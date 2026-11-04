/**
 * Onboarding de alunos: o motor.
 *
 * Do fechamento do plano ao início do acompanhamento, cada aluno passa por
 * um fluxo de etapas. O fluxo vem de um MODELO (editável nas configurações,
 * versionado); cada aluno recebe uma INSTÂNCIA copiada da versão vigente, e
 * é na instância que o Montinho marca o que fez. Mudar o modelo não mexe em
 * quem já começou — só numa ação explícita, com prévia (ver `diffDeVersao`).
 *
 * Este módulo é puro: recebe linhas e datas, devolve decisões. Quem lê e
 * grava no banco é app/crm/onboarding/actions.ts. Tudo o que o dashboard
 * mostra (atrasada, bloqueada, progresso, avisos) é DERIVADO daqui, nunca
 * gravado — não há como ficar inconsistente.
 *
 * Os três estados que não se gravam:
 *   - atrasada: prazo vencido e tarefa não resolvida (o status original fica);
 *   - bloqueada: alguma dependência ainda não resolvida;
 *   - condicional: a etapa só existe se outra for respondida de certo jeito,
 *     e ainda não foi. Não conta no progresso até ser liberada.
 */
import { preencher, saudacaoDe } from "./copy";
import { dataDoCheckIn } from "./onboarding";

// ---------------------------------------------------------------------------
// Definição (o que fica no modelo)
// ---------------------------------------------------------------------------
export type PrazoDef =
  | { tipo: "inicio"; dias: number }
  | { tipo: "apos_etapa"; etapa: string; dias: number }
  | { tipo: "manual" }
  | { tipo: "sem_prazo" };

export interface CondicaoDef { pergunta: string; opcoes: { valor: string; rotulo: string }[] }
export interface LembreteDef { no_dia: boolean; dia_antes: boolean; atraso: boolean; repetir_dias: number | null }
export interface MaterialDef { rotulo: string; url: string }

export interface FaseDef { key: string; nome: string; ordem: number }
export interface EtapaDef {
  key: string;
  fase: string;
  nome: string;
  descricao: string;
  /** Instrução interna: o que o Montinho precisa lembrar ao fazer. */
  instrucoes: string;
  ordem: number;
  obrigatoria: boolean;
  prazo: PrazoDef;
  depende_de: string[];
  /** Pergunta feita nesta etapa (ex.: "o aluno já tem avaliação?"). */
  condicao: CondicaoDef | null;
  /** Etapa condicional: só existe se a etapa `etapa` for respondida com `valor`. */
  ativar_se: { etapa: string; valor: string } | null;
  /** Se a resposta da PRÓPRIA condição for este valor, a etapa vira "não aplicável". */
  na_se: string | null;
  /** Mensagem de WhatsApp, com {variáveis}. Nula quando a etapa não é um contato. */
  mensagem: string | null;
  materiais: MaterialDef[];
  lembrete: LembreteDef;
  /** Avisa o personal no sino quando entra no prazo. */
  avisar: boolean;
  /** Atalho da tarefa na tela "Minhas tarefas". */
  acao: "whatsapp" | "cliente" | "dados" | null;
}
export interface DefinicaoFluxo { fases: FaseDef[]; etapas: EtapaDef[] }

export const LEMBRETE_PADRAO: LembreteDef = { no_dia: true, dia_antes: false, atraso: true, repetir_dias: 2 };

export const VARIAVEIS_ONBOARDING = ["saudacao", "nome", "personal", "plano", "link_app", "link_guia_filmagem", "link_revisao"] as const;
export type VariavelOnboarding = (typeof VARIAVEIS_ONBOARDING)[number];

// ---------------------------------------------------------------------------
// O fluxo inicial (configuração de fábrica; depois vive no banco, editável)
// ---------------------------------------------------------------------------
const etapa = (p: Partial<EtapaDef> & Pick<EtapaDef, "key" | "fase" | "nome" | "ordem">): EtapaDef => ({
  descricao: "", instrucoes: "", obrigatoria: true, prazo: { tipo: "inicio", dias: 0 }, depende_de: [],
  condicao: null, ativar_se: null, na_se: null, mensagem: null, materiais: [], lembrete: LEMBRETE_PADRAO, avisar: true, acao: null,
  ...p,
});

export const FLUXO_PADRAO: DefinicaoFluxo = {
  fases: [
    { key: "coleta", nome: "Coleta de informações", ordem: 1 },
    { key: "analise", nome: "Análise e planejamento", ordem: 2 },
    { key: "entrega", nome: "Entrega do treinamento", ordem: 3 },
    { key: "acompanhamento", nome: "Acompanhamento inicial", ordem: 4 },
  ],
  etapas: [
    etapa({ key: "anamnese", fase: "coleta", ordem: 1, nome: "Enviar anamnese", acao: "whatsapp",
      descricao: "Coletar saúde, histórico, objetivos, disponibilidade e experiência com treino.",
      instrucoes: "Abra a mensagem, envie, marque \"Enviei\" e deixe em \"Aguardando aluno\" até a anamnese voltar.",
      mensagem: "{saudacao}, {nome}! Seja bem-vindo(a). O primeiro passo é a anamnese: um questionário rápido sobre sua saúde, rotina, objetivos e experiência com treino. É com ele que eu monto a sua estratégia. Consegue responder hoje?" }),
    etapa({ key: "guia_fotos", fase: "coleta", ordem: 2, nome: "Enviar guia de avaliação por fotos", acao: "whatsapp",
      descricao: "Orientar a coleta padronizada das fotos para acompanhar a evolução.",
      instrucoes: "Vincule o guia em Materiais. Fotos são dado sensível: ficam no app, nunca no CRM.",
      mensagem: "{nome}, para a gente acompanhar a sua evolução, preciso de fotos de referência. Vou te mandar o guia de como tirar: mesmo lugar, mesma luz, mesma roupa. Sem pressa, mas quanto antes tirar, melhor a comparação depois." }),
    etapa({ key: "avaliacao", fase: "coleta", ordem: 3, nome: "Verificar avaliação física", acao: "cliente",
      descricao: "O aluno já tem avaliação física feita (comigo ou com outro profissional)?",
      instrucoes: "Responda a pergunta. A resposta libera só o caminho que vale: pedir os dados ou mandar o guia de circunferências.",
      condicao: { pergunta: "O aluno já tem avaliação física?", opcoes: [{ valor: "sim", rotulo: "Sim, já tem" }, { valor: "nao", rotulo: "Não tem" }] } }),
    etapa({ key: "avaliacao_dados", fase: "coleta", ordem: 4, nome: "Solicitar dados da avaliação", acao: "whatsapp",
      descricao: "Pedir a avaliação que o aluno já tem e registrar o recebimento.",
      ativar_se: { etapa: "avaliacao", valor: "sim" }, depende_de: ["avaliacao"],
      mensagem: "{nome}, você comentou que já tem avaliação física. Consegue me mandar os dados (ou uma foto do laudo)? Assim eu parto do que você já tem." }),
    etapa({ key: "guia_circunferencias", fase: "coleta", ordem: 5, nome: "Enviar guia de circunferências", acao: "whatsapp",
      descricao: "Guia de como tirar as medidas em casa, e aguardar os dados.",
      ativar_se: { etapa: "avaliacao", valor: "nao" }, depende_de: ["avaliacao"],
      mensagem: "{nome}, como você ainda não tem avaliação, vamos fazer do jeito simples: medidas com fita em casa. Vou te mandar o guia de como tirar cada uma. Me manda os números quando tiver." }),
    etapa({ key: "dados_ok", fase: "coleta", ordem: 6, nome: "Confirmar recebimento dos dados", acao: "cliente",
      descricao: "Anamnese, fotos e avaliação (ou medidas) chegaram? Registre o que falta nas observações.",
      depende_de: ["anamnese", "guia_fotos", "avaliacao"], prazo: { tipo: "inicio", dias: 3 } }),

    etapa({ key: "analisar", fase: "analise", ordem: 7, nome: "Analisar anamnese", acao: "dados",
      descricao: "Ler o que o aluno respondeu e anotar o que importa para a estratégia.",
      depende_de: ["dados_ok"], prazo: { tipo: "apos_etapa", etapa: "dados_ok", dias: 1 } }),
    etapa({ key: "duvidas", fase: "analise", ordem: 8, nome: "Esclarecer dúvidas da anamnese", acao: "whatsapp",
      descricao: "Ficou algo sem resposta ou insuficiente? Registre a dúvida, converse e conclua depois.",
      depende_de: ["analisar"], prazo: { tipo: "apos_etapa", etapa: "analisar", dias: 1 },
      condicao: { pergunta: "Ficou dúvida sobre a anamnese?", opcoes: [{ valor: "sim", rotulo: "Sim, preciso perguntar" }, { valor: "nao", rotulo: "Não, está claro" }] }, na_se: "nao",
      mensagem: "{nome}, li a sua anamnese. Ficou uma dúvida: [escreva aqui]. Me responde quando puder, que eu já fecho a sua estratégia." }),
    etapa({ key: "estrategia", fase: "analise", ordem: 9, nome: "Montar estratégia de treinamento", acao: "cliente",
      descricao: "A estratégia individualizada: frequência, divisão, progressão, o que respeitar.",
      depende_de: ["analisar", "duvidas"], prazo: { tipo: "apos_etapa", etapa: "analisar", dias: 2 } }),
    etapa({ key: "treino_app", fase: "analise", ordem: 10, nome: "Montar o treino no app", acao: "cliente",
      descricao: "Cadastrar o programa no App Montinho. A confirmação é manual: o CRM não enxerga o app.",
      depende_de: ["estrategia"], prazo: { tipo: "apos_etapa", etapa: "estrategia", dias: 1 } }),

    etapa({ key: "enviar_estrategia", fase: "entrega", ordem: 11, nome: "Enviar estratégia pelo WhatsApp", acao: "whatsapp",
      depende_de: ["treino_app"], prazo: { tipo: "apos_etapa", etapa: "treino_app", dias: 0 },
      mensagem: "{saudacao}, {nome}! Sua estratégia está pronta. Vou te explicar aqui o raciocínio: [resumo]. O treino em si já está no app. Lê com calma e me diz se fez sentido." }),
    etapa({ key: "enviar_acesso", fase: "entrega", ordem: 12, nome: "Enviar acesso ao treino", acao: "whatsapp",
      depende_de: ["treino_app"], prazo: { tipo: "apos_etapa", etapa: "treino_app", dias: 0 },
      mensagem: "{nome}, seu treino está no app. Entra por aqui: {link_app}. Faz o login com o mesmo telefone que você usa aqui. Qualquer tela que travar, me manda print." }),
    etapa({ key: "orientacoes", fase: "entrega", ordem: 13, nome: "Enviar orientações de treinamento", acao: "whatsapp",
      descricao: "Aquecimento, descanso, como progredir carga, o que fazer se faltar.",
      depende_de: ["treino_app"], prazo: { tipo: "apos_etapa", etapa: "treino_app", dias: 0 },
      mensagem: "{nome}, antes do primeiro treino, três orientações: [1] aqueça 5 minutos; [2] a carga é a que deixa as últimas 2 repetições difíceis, não impossíveis; [3] se faltar um dia, segue do próximo treino, sem compensar. Dúvida no meio do treino, me chama." }),
    etapa({ key: "guia_filmagem", fase: "entrega", ordem: 14, nome: "Enviar guia de filmagem", acao: "whatsapp", obrigatoria: false,
      descricao: "Como filmar as séries para a revisão de execução. Não é obrigação do aluno: é oferta.",
      depende_de: ["treino_app"], prazo: { tipo: "apos_etapa", etapa: "treino_app", dias: 1 },
      materiais: [{ rotulo: "Vídeo: como filmar o seu exercício", url: "https://www.montinhopersonal.com.br/revisao-de-execucao" }],
      mensagem: "{nome}, uma coisa que ajuda muito: me manda um vídeo curto dos exercícios principais. Eu vejo amplitude, coluna, joelho e cotovelo, e ajusto antes de virar hábito. Filma de lado, com o celular na altura do quadril e o corpo inteiro no quadro. Fiz um vídeo de 2 minutos mostrando como, sem tripé e sem vergonha: {link_guia_filmagem}. Manda quando quiser, sem obrigação." }),

    etapa({ key: "checkin_entrega", fase: "acompanhamento", ordem: 15, nome: "Check-in após a entrega", acao: "whatsapp",
      descricao: "Conseguiu ler a estratégia? Acessou o treino? Ficou dúvida? Está tudo certo para começar?",
      depende_de: ["enviar_estrategia", "enviar_acesso", "orientacoes"], prazo: { tipo: "apos_etapa", etapa: "orientacoes", dias: 1 },
      mensagem: "{saudacao}, {nome}! Passando para saber: conseguiu ler a estratégia e entrar no app? Ficou alguma dúvida? Está tudo certo para começar?" }),
    etapa({ key: "checkin_experiencia", fase: "acompanhamento", ordem: 16, nome: "Check-in da experiência inicial", acao: "whatsapp",
      descricao: "Como foi o primeiro treino? Alguma dificuldade? Se ainda não treinou, pergunte o que está travando, sem presumir.",
      instrucoes: "Se o aluno ainda não treinou, use a segunda mensagem: não pergunte \"como foi\" para quem não foi.",
      depende_de: ["checkin_entrega"], prazo: { tipo: "apos_etapa", etapa: "checkin_entrega", dias: 2 },
      mensagem: "{nome}, como foi o primeiro treino? Algum exercício que não encaixou, carga que ficou leve ou pesada demais? Me conta que eu ajusto.\n\n(Se ainda não treinou:) {nome}, vi que o treino ainda não começou. Está travando em alguma coisa? Horário, academia, dúvida no app? Me fala que a gente resolve junto." }),
    etapa({ key: "confirmacao", fase: "acompanhamento", ordem: 17, nome: "Confirmar início do acompanhamento", acao: "cliente",
      descricao: "Orientações entregues, acesso resolvido, acompanhamento inicial feito, pendências críticas resolvidas. Aqui o onboarding termina.",
      depende_de: ["checkin_experiencia"], prazo: { tipo: "apos_etapa", etapa: "checkin_experiencia", dias: 1 } }),
  ],
};

// ---------------------------------------------------------------------------
// Instância (o que fica no aluno)
// ---------------------------------------------------------------------------
export type StatusTarefa = "pendente" | "em_andamento" | "aguardando_aluno" | "concluida" | "pausada" | "nao_aplicavel";
export type StatusOnboarding = "em_andamento" | "pausado" | "concluido" | "cancelado";

/** Linha de crm_onboarding_tasks. Os campos da definição são copiados na criação. */
export interface TarefaOnb {
  id: string; onboarding_id: string;
  key: string; fase: string; nome: string; descricao: string | null; instrucoes: string | null; ordem: number;
  obrigatoria: boolean; prazo: PrazoDef; depende_de: string[]; condicao: CondicaoDef | null; ativar_se: { etapa: string; valor: string } | null; na_se: string | null;
  mensagem: string | null; materiais: MaterialDef[]; lembrete: LembreteDef; avisar: boolean; acao: EtapaDef["acao"];
  status: StatusTarefa; resposta: string | null;
  due_at: string | null; due_origem: "regra" | "manual" | null;
  started_at: string | null; completed_at: string | null; completed_by: string | null;
  observacoes: string | null; created_at: string; updated_at: string;
}
export interface OnboardingRow {
  id: string; client_id: string; contact_id: string; template_id: string; version_id: string; plan_id: string | null;
  status: StatusOnboarding; iniciado_em: string; concluido_em: string | null; pausado_em: string | null;
  fases: FaseDef[]; created_at: string; updated_at: string;
}

export const RESOLVIDAS: StatusTarefa[] = ["concluida", "nao_aplicavel"];
export const ehResolvida = (t: Pick<TarefaOnb, "status">) => RESOLVIDAS.includes(t.status);

/** A etapa condicional está liberada? (null = ainda não respondida; false = outro caminho) */
export function condicionalLiberada(t: Pick<TarefaOnb, "ativar_se">, todas: Pick<TarefaOnb, "key" | "resposta">[]): boolean | null {
  if (!t.ativar_se) return true;
  const mae = todas.find((x) => x.key === t.ativar_se!.etapa);
  if (!mae || mae.resposta == null) return null;
  return mae.resposta === t.ativar_se.valor;
}

export type Derivado = "condicional" | "nao_aplicavel" | "concluida" | "bloqueada" | "pausada" | "aguardando_aluno" | "em_andamento" | "pendente";

export interface TarefaVista {
  t: TarefaOnb;
  /** O estado que a tela mostra como principal. */
  estado: Derivado;
  atrasada: boolean;
  /** Entra na conta do progresso. */
  aplicavel: boolean;
  /** Dependências ainda não resolvidas. */
  esperando: string[];
}

export function verTarefa(t: TarefaOnb, todas: TarefaOnb[], agora: Date): TarefaVista {
  const lib = condicionalLiberada(t, todas);
  if (lib === null) return { t, estado: "condicional", atrasada: false, aplicavel: false, esperando: [] };
  if (lib === false || t.status === "nao_aplicavel") return { t, estado: "nao_aplicavel", atrasada: false, aplicavel: false, esperando: [] };
  if (t.status === "concluida") return { t, estado: "concluida", atrasada: false, aplicavel: true, esperando: [] };
  const esperando = t.depende_de.filter((k) => {
    const d = todas.find((x) => x.key === k);
    if (!d) return false;
    // Dependência que não se aplica (outro caminho da condição) não trava ninguém.
    if (condicionalLiberada(d, todas) === false || d.status === "nao_aplicavel") return false;
    return d.status !== "concluida";
  });
  // Atrasada é dia vencido, não hora vencida: a tarefa de hoje às 10h ainda é de hoje às 15h.
  const atrasada = !!t.due_at && diaLocal(new Date(t.due_at)) < diaLocal(agora) && t.status !== "pausada";
  if (t.status === "pausada") return { t, estado: "pausada", atrasada: false, aplicavel: true, esperando };
  if (esperando.length && t.status === "pendente") return { t, estado: "bloqueada", atrasada, aplicavel: true, esperando };
  return { t, estado: t.status, atrasada, aplicavel: true, esperando };
}

export function verTodas(tarefas: TarefaOnb[], agora: Date): TarefaVista[] {
  return [...tarefas].sort((a, z) => a.ordem - z.ordem).map((t) => verTarefa(t, tarefas, agora));
}

export interface Progresso {
  aplicaveis: number; concluidas: number; pendentes: number; atrasadas: number; aguardando: number; nao_aplicaveis: number; bloqueadas: number; condicionais: number;
  pct: number;
  /** Obrigatórias ainda não resolvidas: enquanto houver, não se conclui. */
  obrigatoriasAbertas: number;
}
/** Progresso = concluídas / aplicáveis. Não aplicável e condicional não entram; atrasada continua pendente. */
export function progresso(vistas: TarefaVista[]): Progresso {
  const ap = vistas.filter((v) => v.aplicavel);
  const concluidas = ap.filter((v) => v.estado === "concluida").length;
  const p: Progresso = {
    aplicaveis: ap.length, concluidas,
    pendentes: ap.filter((v) => v.estado !== "concluida").length,
    atrasadas: ap.filter((v) => v.atrasada).length,
    aguardando: ap.filter((v) => v.estado === "aguardando_aluno").length,
    nao_aplicaveis: vistas.filter((v) => v.estado === "nao_aplicavel").length,
    bloqueadas: ap.filter((v) => v.estado === "bloqueada").length,
    condicionais: vistas.filter((v) => v.estado === "condicional").length,
    pct: ap.length ? Math.round((concluidas / ap.length) * 100) : 0,
    obrigatoriasAbertas: ap.filter((v) => v.t.obrigatoria && v.estado !== "concluida").length,
  };
  return p;
}

/** A próxima coisa a fazer: a primeira tarefa aberta e desbloqueada, na ordem; atrasada primeiro. */
export function proximaAcao(vistas: TarefaVista[]): TarefaVista | null {
  const abertas = vistas.filter((v) => v.aplicavel && ["pendente", "em_andamento", "aguardando_aluno"].includes(v.estado));
  return abertas.find((v) => v.atrasada) ?? abertas.find((v) => v.estado !== "aguardando_aluno") ?? abertas[0] ?? null;
}

export type SituacaoOnb = "atrasado" | "atencao" | "aguardando_aluno" | "em_dia" | "pausado" | "concluido" | "cancelado";
/** A situação do aluno no dashboard, com a ordem de urgência: atrasado > atenção > aguardando > em dia. */
export function situacao(onb: Pick<OnboardingRow, "status">, vistas: TarefaVista[], agora: Date): SituacaoOnb {
  if (onb.status === "concluido") return "concluido";
  if (onb.status === "cancelado") return "cancelado";
  if (onb.status === "pausado") return "pausado";
  if (vistas.some((v) => v.atrasada)) return "atrasado";
  const fimHoje = fimDoDia(agora);
  const precisa = vistas.some((v) => v.aplicavel && (v.estado === "pendente" || v.estado === "em_andamento") && v.t.due_at && new Date(v.t.due_at) <= fimHoje);
  if (precisa) return "atencao";
  if (vistas.some((v) => v.estado === "aguardando_aluno")) return "aguardando_aluno";
  return "em_dia";
}

// ---------------------------------------------------------------------------
// Prazos e datas (Brasília)
// ---------------------------------------------------------------------------
export const FUSO_ONB = "America/Sao_Paulo";
export const diaLocal = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: FUSO_ONB });
export function fimDoDia(d: Date): Date {
  // 23:59:59 de Brasília do dia de `d`: 10h do dia (dataDoCheckIn) + 13h59m59s.
  return new Date(new Date(dataDoCheckIn(diaLocal(d), 0)).getTime() + (13 * 60 + 59) * 60_000 + 59_000);
}
export const inicioDoDia = (d: Date) => new Date(fimDoDia(d).getTime() - 86_400_000 + 1000);

/** Prazo de uma tarefa a partir da regra; null quando a regra depende de algo que ainda não aconteceu. */
export function prazoDaRegra(prazo: PrazoDef, iniciadoEm: string, todas: Pick<TarefaOnb, "key" | "completed_at">[]): string | null {
  if (prazo.tipo === "inicio") return dataDoCheckIn(diaLocal(new Date(iniciadoEm)), prazo.dias);
  if (prazo.tipo === "apos_etapa") {
    const ref = todas.find((t) => t.key === prazo.etapa);
    if (!ref?.completed_at) return null;
    return dataDoCheckIn(diaLocal(new Date(ref.completed_at)), prazo.dias);
  }
  return null;
}

/**
 * Recalcula os prazos de regra depois de um evento (uma etapa concluída,
 * uma data corrigida). Prazo definido à mão não é tocado. Devolve só o que
 * mudou, para a ação gravar e registrar no histórico.
 */
export function recalcularPrazos(tarefas: TarefaOnb[], iniciadoEm: string): { id: string; de: string | null; para: string | null }[] {
  const out: { id: string; de: string | null; para: string | null }[] = [];
  for (const t of tarefas) {
    if (t.due_origem === "manual" || ehResolvida(t)) continue;
    const novo = prazoDaRegra(t.prazo, iniciadoEm, tarefas);
    if ((novo ?? null) !== (t.due_at ?? null)) out.push({ id: t.id, de: t.due_at, para: novo });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Validação do modelo
// ---------------------------------------------------------------------------
export function validarDefinicao(def: DefinicaoFluxo): string[] {
  const erros: string[] = [];
  const keys = new Set<string>();
  for (const e of def.etapas) {
    if (!/^[a-z0-9_]{2,40}$/.test(e.key)) erros.push(`Etapa "${e.nome}": chave inválida (${e.key}).`);
    if (keys.has(e.key)) erros.push(`Chave repetida: ${e.key}.`);
    keys.add(e.key);
    if (!e.nome.trim()) erros.push(`Etapa ${e.key}: sem nome.`);
    if (!def.fases.some((f) => f.key === e.fase)) erros.push(`Etapa ${e.key}: fase "${e.fase}" não existe.`);
  }
  for (const e of def.etapas) {
    for (const d of e.depende_de) if (!keys.has(d)) erros.push(`Etapa ${e.key}: depende de "${d}", que não existe.`);
    if (e.depende_de.includes(e.key)) erros.push(`Etapa ${e.key}: depende de si mesma.`);
    if (e.ativar_se) {
      const mae = def.etapas.find((x) => x.key === e.ativar_se!.etapa);
      if (!mae) erros.push(`Etapa ${e.key}: condicionada a "${e.ativar_se.etapa}", que não existe.`);
      else if (!mae.condicao) erros.push(`Etapa ${e.key}: "${mae.key}" não faz pergunta nenhuma.`);
      else if (!mae.condicao.opcoes.some((o) => o.valor === e.ativar_se!.valor)) erros.push(`Etapa ${e.key}: "${e.ativar_se.valor}" não é uma resposta de ${mae.key}.`);
    }
    if (e.na_se && !e.condicao?.opcoes.some((o) => o.valor === e.na_se)) erros.push(`Etapa ${e.key}: "não aplicável se ${e.na_se}" não é uma resposta da própria pergunta.`);
    if (e.prazo.tipo === "apos_etapa" && !keys.has(e.prazo.etapa)) erros.push(`Etapa ${e.key}: prazo conta a partir de "${e.prazo.etapa}", que não existe.`);
  }
  const ciclo = encontrarCiclo(def.etapas);
  if (ciclo) erros.push(`Dependência circular: ${ciclo.join(" → ")}.`);
  if (!def.fases.length) erros.push("O modelo precisa de pelo menos uma fase.");
  return erros;
}

/** Procura um ciclo em depende_de (e em prazo apos_etapa). Devolve o caminho, ou null. */
export function encontrarCiclo(etapas: Pick<EtapaDef, "key" | "depende_de" | "prazo">[]): string[] | null {
  const arestas = new Map(etapas.map((e) => [e.key, [...e.depende_de, ...(e.prazo.tipo === "apos_etapa" ? [e.prazo.etapa] : [])]]));
  const cor = new Map<string, 1 | 2>();
  const pilha: string[] = [];
  const visita = (k: string): string[] | null => {
    cor.set(k, 1); pilha.push(k);
    for (const v of arestas.get(k) ?? []) {
      if (!arestas.has(v)) continue;
      if (cor.get(v) === 1) return [...pilha.slice(pilha.indexOf(v)), v];
      if (!cor.has(v)) { const r = visita(v); if (r) return r; }
    }
    pilha.pop(); cor.set(k, 2);
    return null;
  };
  for (const k of arestas.keys()) if (!cor.has(k)) { const r = visita(k); if (r) return r; }
  return null;
}

// ---------------------------------------------------------------------------
// Instanciar e atualizar
// ---------------------------------------------------------------------------
export type NovaTarefa = Omit<TarefaOnb, "id" | "onboarding_id" | "created_at" | "updated_at">;

/** As linhas de tarefa de um onboarding novo, com os prazos "desde o início" já calculados. */
export function instanciar(def: DefinicaoFluxo, iniciadoEm: string): NovaTarefa[] {
  const base = def.etapas.map((e): NovaTarefa => ({
    key: e.key, fase: e.fase, nome: e.nome, descricao: e.descricao || null, instrucoes: e.instrucoes || null, ordem: e.ordem,
    obrigatoria: e.obrigatoria, prazo: e.prazo, depende_de: e.depende_de, condicao: e.condicao, ativar_se: e.ativar_se, na_se: e.na_se,
    mensagem: e.mensagem, materiais: e.materiais, lembrete: e.lembrete, avisar: e.avisar, acao: e.acao,
    status: "pendente", resposta: null, due_at: null, due_origem: null, started_at: null, completed_at: null, completed_by: null, observacoes: null,
  }));
  for (const t of base) {
    const d = prazoDaRegra(t.prazo, iniciadoEm, []);
    if (d) { t.due_at = d; t.due_origem = "regra"; }
  }
  return base;
}

export interface DiffVersao {
  adicionar: EtapaDef[];
  /** Pendentes que o modelo novo não tem mais. Concluídas nunca saem. */
  remover: TarefaOnb[];
  /** Mantidas, com texto/prazo/mensagem atualizados a partir do modelo (status e datas ficam). */
  atualizar: { tarefa: TarefaOnb; def: EtapaDef; mudancas: string[] }[];
  /** Concluídas que o modelo novo não tem: ficam como estão, só para o histórico. */
  preservadas: TarefaOnb[];
}
/** Prévia do impacto de aplicar uma versão nova num onboarding em andamento. Nada se perde do que foi feito. */
export function diffDeVersao(def: DefinicaoFluxo, atuais: TarefaOnb[]): DiffVersao {
  const porKey = new Map(atuais.map((t) => [t.key, t]));
  const defKeys = new Set(def.etapas.map((e) => e.key));
  const adicionar = def.etapas.filter((e) => !porKey.has(e.key));
  const remover = atuais.filter((t) => !defKeys.has(t.key) && !ehResolvida(t));
  const preservadas = atuais.filter((t) => !defKeys.has(t.key) && ehResolvida(t));
  const campos: (keyof EtapaDef)[] = ["nome", "descricao", "instrucoes", "fase", "ordem", "obrigatoria", "prazo", "depende_de", "condicao", "ativar_se", "na_se", "mensagem", "materiais", "lembrete", "avisar", "acao"];
  const atualizar = def.etapas.flatMap((e) => {
    const t = porKey.get(e.key); if (!t) return [];
    const mudancas = campos.filter((c) => JSON.stringify((t as any)[c] ?? null) !== JSON.stringify((e as any)[c] === "" ? null : (e as any)[c]));
    return mudancas.length ? [{ tarefa: t, def: e, mudancas: mudancas as string[] }] : [];
  });
  return { adicionar, remover, atualizar, preservadas };
}

// ---------------------------------------------------------------------------
// Avisos (derivados; o banco guarda só lido/adiado/dispensado por chave)
// ---------------------------------------------------------------------------
export type TipoAviso = "hoje" | "amanha" | "atrasada" | "aguardando" | "liberada";
export interface Aviso {
  chave: string; tipo: TipoAviso; onboardingId: string; tarefaId: string; tarefa: TarefaOnb; texto: string; prazo: string | null;
}
const TEXTO_AVISO: Record<TipoAviso, (nome: string, tarefa: string) => string> = {
  hoje: (n, t) => `Hoje você precisa: ${t.toLowerCase()} — ${n}.`,
  amanha: (n, t) => `Amanhã: ${t.toLowerCase()} — ${n}.`,
  atrasada: (n, t) => `Atrasado: ${t.toLowerCase()} — ${n}.`,
  aguardando: (n, t) => `${n} ainda não respondeu: ${t.toLowerCase()}.`,
  liberada: (n, t) => `Liberou: ${t.toLowerCase()} — ${n}.`,
};
/**
 * Os avisos de um onboarding agora. Cada um tem uma chave estável
 * (tarefa + tipo + dia), que é como o banco lembra se foi lido, adiado ou
 * dispensado — sem a chave, cada recarga da tela geraria aviso "novo".
 * Atraso repete a cada `repetir_dias` (a chave muda de balde), para não
 * virar spam diário nem sumir.
 */
export function avisosDe(onb: OnboardingRow, nomeAluno: string, vistas: TarefaVista[], agora: Date, liberadasRecentes: Map<string, string> = new Map()): Aviso[] {
  if (onb.status !== "em_andamento") return [];
  const hoje = diaLocal(agora); const fimHoje = fimDoDia(agora); const fimAmanha = new Date(fimHoje.getTime() + 86_400_000);
  const out: Aviso[] = [];
  const add = (v: TarefaVista, tipo: TipoAviso, balde: string) => out.push({
    chave: `${v.t.id}:${tipo}:${balde}`, tipo, onboardingId: onb.id, tarefaId: v.t.id, tarefa: v.t, texto: TEXTO_AVISO[tipo](nomeAluno, v.t.nome), prazo: v.t.due_at,
  });
  for (const v of vistas) {
    if (!v.aplicavel || !v.t.avisar || v.estado === "concluida" || v.estado === "pausada") continue;
    const l = v.t.lembrete;
    if (v.estado === "aguardando_aluno") { add(v, "aguardando", hoje); continue; }
    if (v.estado === "bloqueada") continue;
    const due = v.t.due_at ? new Date(v.t.due_at) : null;
    if (v.atrasada && l.atraso && due) {
      const diasAtraso = Math.floor((agora.getTime() - due.getTime()) / 86_400_000);
      const balde = l.repetir_dias ? String(Math.floor(diasAtraso / Math.max(1, l.repetir_dias))) : "unico";
      add(v, "atrasada", balde); continue;
    }
    if (due && l.no_dia && due <= fimHoje && due >= inicioDoDia(agora)) { add(v, "hoje", hoje); continue; }
    if (due && l.dia_antes && due > fimHoje && due <= fimAmanha) { add(v, "amanha", hoje); continue; }
    const lib = liberadasRecentes.get(v.t.id);
    if (lib && v.estado === "pendente") add(v, "liberada", lib.slice(0, 10));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Mensagens
// ---------------------------------------------------------------------------
export function variaveisDe(p: { nome: string; plano: string | null; linkApp: string; agora?: Date }): Record<VariavelOnboarding, string> {
  return {
    saudacao: saudacaoDe(p.agora ?? new Date()), nome: p.nome.split(" ")[0], personal: "Montinho", plano: p.plano ?? "",
    link_app: p.linkApp, link_guia_filmagem: "https://www.montinhopersonal.com.br/revisao-de-execucao", link_revisao: "https://www.montinhopersonal.com.br/revisao-de-execucao",
  };
}
export function mensagemDaTarefa(t: Pick<TarefaOnb, "mensagem">, vars: Record<string, string>): string | null {
  return t.mensagem ? preencher(t.mensagem, vars) : null;
}

export const ROTULO_ESTADO: Record<Derivado, { icone: string; rotulo: string }> = {
  concluida: { icone: "✅", rotulo: "Concluída" },
  pendente: { icone: "⚪", rotulo: "Pendente" },
  em_andamento: { icone: "🔵", rotulo: "Em andamento" },
  aguardando_aluno: { icone: "🟡", rotulo: "Aguardando aluno" },
  pausada: { icone: "⏸️", rotulo: "Pausada" },
  nao_aplicavel: { icone: "⏭️", rotulo: "Não aplicável" },
  bloqueada: { icone: "🔒", rotulo: "Bloqueada" },
  condicional: { icone: "◌", rotulo: "Depende da resposta" },
};
export const ROTULO_SITUACAO: Record<SituacaoOnb, { icone: string; rotulo: string }> = {
  atrasado: { icone: "🔴", rotulo: "Atrasado" }, atencao: { icone: "🟠", rotulo: "Precisa de atenção" }, aguardando_aluno: { icone: "🟡", rotulo: "Aguardando aluno" },
  em_dia: { icone: "🟢", rotulo: "Em dia" }, pausado: { icone: "⏸️", rotulo: "Pausado" }, concluido: { icone: "✅", rotulo: "Concluído" }, cancelado: { icone: "✖", rotulo: "Cancelado" },
};
