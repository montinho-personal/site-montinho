/**
 * A mensagem certa para cada situação de follow-up.
 *
 * O botão de WhatsApp do CRM abria uma conversa em branco, e o Montinho
 * digitava do zero — ou mandava o "oi, tudo bem?" que ninguém responde. Aqui
 * a mensagem nasce pronta do que o CRM já sabe: de onde a pessoa veio, o que
 * escreveu, há quantos dias a proposta foi mandada, quando é a experimental,
 * quem indicou, quando renova. Ele lê, ajusta se quiser e envia. Nada sai
 * sozinho.
 *
 * Os textos ficam em copy-textos.ts. Aqui é o motor: escolhe a situação a
 * partir do grupo da tela Hoje e do estado do lead, e preenche as variáveis.
 * Trecho entre [[ e ]] some inteiro quando uma variável dentro dele está
 * vazia — é assim que a mesma mensagem serve para quem tem página conhecida
 * e para quem não tem.
 *
 * Não importa dados.ts nem visao.ts de propósito: os dois puxam o cliente
 * do Supabase, e este módulo precisa rodar em teste puro.
 */
import type { Base, Catalogo } from "./dados";
import { diasEntre } from "./metricas";
import { extrairRef, identificarMensagem, limparColagem } from "./mensagens";
import { limparTitulo } from "../whatsapp";
import { TEXTOS, type Situacao } from "./copy-textos";
import type { ClienteRow, Experimental, Lead, Oportunidade } from "./tipos";

export type { Situacao } from "./copy-textos";

export const VARIAVEIS = ["nome", "servico", "pagina", "objetivo", "pergunta", "dias", "valor", "plano", "dia_hora", "local", "renova_em", "indicador", "cidade"] as const;
export type Variavel = (typeof VARIAVEIS)[number];
export type Variaveis = Record<Variavel, string>;

const FUSO = "America/Sao_Paulo";

/** Preenche {variáveis}; apaga [[fragmentos]] cuja variável está vazia; arruma o que sobrou. */
export function preencher(modelo: string, vars: Partial<Record<string, string>>): string {
  const v = (k: string) => (vars[k] ?? "").trim();
  let t = modelo.replace(/\[\[([\s\S]*?)\]\]/g, (_, dentro: string) => {
    const usadas = [...dentro.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
    return usadas.every((k) => v(k)) ? dentro : "";
  });
  t = t.replace(/\{(\w+)\}/g, (_, k: string) => v(k));
  return arrumar(t);
}
function arrumar(t: string): string {
  return t
    .replace(/[ \t]+/g, " ")
    .replace(/ +([.,;:!?])/g, "$1")
    .replace(/\( *\)/g, "")
    .replace(/« *»/g, "")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ---------------------------------------------------------------------------
// Escolha da situação
// ---------------------------------------------------------------------------
export interface Sinais {
  pergunta: string; indicador: string; pagina: string; anuncio: boolean;
  jaContatado: boolean; propostaEnviada: boolean; diasProposta: number | null; etapa: string | null;
  exigeExperimental: boolean; experimentalAgendada: boolean; experimentalRealizada: boolean; experimentalNoShow: boolean;
  cliente: ClienteRow | undefined; renovaEm: number | null; diasDeCliente: number | null; jaIndicou: boolean;
}

const primeiroContato = (s: Sinais): Situacao =>
  s.pergunta ? "primeiro_contato_duvida" : s.indicador ? "primeiro_contato_indicacao" : s.pagina ? "primeiro_contato_site" : s.anuncio ? "primeiro_contato_anuncio" : "primeiro_contato_generico";
const depoisDaProposta = (s: Sinais): Situacao => ((s.diasProposta ?? 0) >= 7 ? "proposta_follow_up_2" : "proposta_follow_up_1");

/**
 * O passo seguinte de quem já falou e ainda não comprou. Ele depende do
 * serviço, não da temperatura: os formatos presenciais passam pela aula
 * experimental antes da proposta (crm_services.exige_experimental), a
 * consultoria online vai direto ao plano. Convidar para a experimental é o
 * degrau que faltava — sem ele, um lead quente recebia "vamos marcar o
 * primeiro dia", que pula a aula que existe justamente para a pessoa decidir.
 */
const proximoPasso = (s: Sinais): Situacao => {
  if (s.experimentalRealizada) return "pos_experimental_proposta";
  if (s.experimentalNoShow) return "experimental_no_show";
  if (s.experimentalAgendada) return "experimental_confirmar";
  if (s.exigeExperimental) return "convite_experimental";
  return "convite_proposta";
};

/** Quem já é aluno: a conversa muda com o momento do ciclo, não com a etapa do funil. */
const comAluno = (s: Sinais): Situacao => {
  const c = s.cliente!;
  if (c.status !== "ativo") return "reativacao_pausado";
  if (s.renovaEm != null && s.renovaEm < 0) return "renovacao_vencida";
  if (s.diasDeCliente != null && s.diasDeCliente <= 14) return "boas_vindas";
  if (s.renovaEm != null && s.renovaEm <= 30) return "renovacao_proxima";
  if (!s.jaIndicou && s.diasDeCliente != null && s.diasDeCliente >= 90) return "pedido_indicacao";
  return "check_in_aluno";
};

const retomar = (s: Sinais): Situacao => {
  if (s.cliente) return comAluno(s);
  if (!s.jaContatado) return primeiroContato(s);
  if (s.etapa === "negociacao") return "negociacao_parada";
  if (s.propostaEnviada) return depoisDaProposta(s);
  return s.experimentalRealizada || s.experimentalNoShow || s.experimentalAgendada ? proximoPasso(s) : "segundo_toque";
};

/** Grupo da tela Hoje (metricas.prioridadesHoje) + estado do lead → situação. Sem grupo, decide só pelo estado. */
export function escolherSituacao(grupo: string | null | undefined, s: Sinais): Situacao {
  switch (grupo) {
    case "novo_sem_contato": return primeiroContato(s);
    case "proposta_sem_follow_up": return depoisDaProposta(s);
    case "negociacao_antiga": return "negociacao_parada";
    case "experimental_proxima": return "experimental_confirmar";
    case "experimental_sem_registro": return "experimental_sem_registro";
    case "pos_experimental_sem_proposta": return "pos_experimental_proposta";
    case "quente": return s.propostaEnviada && (s.diasProposta ?? 0) >= 2 ? depoisDaProposta(s) : proximoPasso(s);
    case "renovacao_proxima": return "renovacao_proxima";
    case "renovacao_vencida": return "renovacao_vencida";
    default: return retomar(s);
  }
}

// ---------------------------------------------------------------------------
// Contexto a partir da base
// ---------------------------------------------------------------------------
export interface Referencia { contactId: string; leadId?: string | null; clientId?: string | null }

export const primeiroNome = (nome: string) => nome.trim().split(/\s+/)[0] ?? "";
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/** "hoje às 7h", "amanhã às 18h30", "sex, 12/09, às 7h" — sempre no horário de Brasília. */
export function formatarDiaHora(iso: string, agora: Date): string {
  const d = new Date(iso);
  const dia = (x: Date) => x.toLocaleDateString("pt-BR", { timeZone: FUSO, day: "2-digit", month: "2-digit" });
  const [h, m] = d.toLocaleTimeString("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit", hour12: false }).split(":");
  const hora = `${Number(h)}h${m === "00" ? "" : m}`;
  const amanha = new Date(agora.getTime() + 86_400_000);
  if (dia(d) === dia(agora)) return `hoje às ${hora}`;
  if (dia(d) === dia(amanha)) return `amanhã às ${hora}`;
  const semana = d.toLocaleDateString("pt-BR", { timeZone: FUSO, weekday: "short" }).replace(".", "");
  return `${semana}, ${dia(d)}, às ${hora}`;
}

/** O que a pessoa escreveu além da frase fixa do botão. Vazio quando só clicou. */
export function perguntaDaMensagem(texto: string | null | undefined): string {
  if (!texto) return "";
  const id = identificarMensagem(texto);
  let p = id.origem ? (id.complemento ?? "") : limparColagem(texto).replace(/\s*Ref:\s*[A-Za-z0-9]{5}\s*/gi, " ");
  if (!id.origem && extrairRef(texto) === null && /^ol[áa],? montinho/i.test(p)) p = "";
  p = p.replace(/^[\s:.,;!?-]+|[\s:.,;-]+$/g, "").trim();
  return /[a-zA-ZÀ-ú]{2,}/.test(p) ? p : "";
}

/**
 * `interesse` é campo livre e nem sempre guarda um objetivo: às vezes guarda a
 * rota inteira ("Consultoria online — dúvida sobre a página"). Colado numa
 * frase como "pensando em {objetivo}", isso vira mensagem quebrada. Só passa o
 * que se encaixa numa frase: curto e sem separador de rótulo.
 */
export function objetivoUsavel(interesse: string | null | undefined): string {
  const t = (interesse ?? "").trim();
  return t.length > 0 && t.length <= 30 && !/[—–|:;/]/.test(t) ? t : "";
}

function oportunidadeDoLead(b: Base, leadId: string): Oportunidade | undefined {
  const ops = b.oportunidades.filter((o) => o.lead_id === leadId).sort((a, c) => c.created_at.localeCompare(a.created_at));
  return ops.find((o) => !o.won_at && !o.lost_at) ?? ops[0];
}

export function contextoDoContato(b: Base, cat: Catalogo, ref: Referencia, agora = new Date()): { sinais: Sinais; vars: Variaveis; lead: Lead | undefined } {
  const contato = b.contatos.find((c) => c.id === ref.contactId);
  const lead = (ref.leadId ? b.leads.find((l) => l.id === ref.leadId) : undefined)
    ?? b.leads.filter((l) => l.contact_id === ref.contactId).sort((a, c) => (a.status === "aberto" ? -1 : 1) - (c.status === "aberto" ? -1 : 1) || c.created_at.localeCompare(a.created_at))[0];
  const opp = lead ? oportunidadeDoLead(b, lead.id) : undefined;
  const etapa = opp ? cat.etapas.find((e) => e.id === opp.stage_id) : undefined;
  const cliente = (ref.clientId ? b.clientes.find((c) => c.id === ref.clientId) : undefined) ?? b.clientes.find((c) => c.contact_id === ref.contactId);
  const handoff = (lead?.handoff_id ? b.handoffs.find((h) => h.id === lead.handoff_id) : undefined) ?? b.handoffs.find((h) => h.contact_id === ref.contactId);
  const criacao = lead ? b.atividades.find((a) => a.lead_id === lead.id && a.tipo === "lead_created") : undefined;
  const mensagemOriginal = (criacao?.metadata as { mensagem_whatsapp?: string } | undefined)?.mensagem_whatsapp;
  const indicadorId = contato?.referred_by_contact_id ?? lead?.referred_by_contact_id ?? null;
  const indicador = indicadorId ? b.contatos.find((c) => c.id === indicadorId) : undefined;
  const trials: Experimental[] = lead ? b.experimentais.filter((t) => t.lead_id === lead.id) : b.experimentais.filter((t) => t.contact_id === ref.contactId);
  const proxima = trials.filter((t) => t.status === "agendada").sort((a, c) => a.scheduled_at.localeCompare(c.scheduled_at))[0] ?? trials.sort((a, c) => c.scheduled_at.localeCompare(a.scheduled_at))[0];
  const servicoId = opp?.service_id ?? lead?.service_id ?? cliente?.service_id ?? null;
  const planoId = cliente?.current_plan_id ?? opp?.plan_id ?? null;
  const valorProposta = opp?.proposal_value ?? opp?.expected_value ?? null;
  const renovaEm = cliente?.renewal_date ? Math.ceil(diasEntre(agora, cliente.renewal_date)) : null;
  const diasProposta = opp?.proposal_sent_at ? Math.round(diasEntre(opp.proposal_sent_at, agora)) : null;
  const ultimoContato = lead?.last_contact_at ?? null;
  const pagina = handoff?.page_title ? limparTitulo(handoff.page_title) : "";

  const servico = cat.servicos.find((s) => s.id === servicoId);
  const sinais: Sinais = {
    pergunta: perguntaDaMensagem(mensagemOriginal),
    indicador: indicador ? primeiroNome(indicador.nome) : "",
    pagina,
    anuncio: lead?.source_code === "google_ads" || !!handoff?.gclid || !!handoff?.gbraid || !!handoff?.wbraid,
    jaContatado: !!(ultimoContato || lead?.first_response_at),
    propostaEnviada: !!opp?.proposal_sent_at,
    diasProposta,
    etapa: etapa?.code ?? null,
    // Sem serviço definido ainda, o presencial é o caminho mais comum aqui — e convidar
    // para a experimental é o convite que não queima etapa se o serviço mudar depois.
    exigeExperimental: servico?.exige_experimental ?? true,
    experimentalAgendada: trials.some((t) => t.status === "agendada"),
    experimentalRealizada: trials.some((t) => t.status === "realizada"),
    experimentalNoShow: trials.some((t) => t.status === "no_show") && !trials.some((t) => t.status === "agendada" || t.status === "realizada"),
    cliente,
    renovaEm,
    diasDeCliente: cliente ? Math.round(diasEntre(cliente.first_purchase_at, agora)) : null,
    jaIndicou: b.contatos.some((x) => x.referred_by_contact_id === ref.contactId),
  };
  const vars: Variaveis = {
    nome: contato ? primeiroNome(contato.nome) : "",
    servico: (cat.servicos.find((s) => s.id === servicoId)?.nome ?? "").toLowerCase(),
    pagina,
    objetivo: objetivoUsavel(lead?.interesse),
    // A frase que cita a dúvida já abre com dois-pontos e aspas; a pontuação final dela sobraria.
    pergunta: sinais.pergunta.replace(/[?!.\s]+$/, ""),
    dias: "",
    valor: valorProposta != null ? brl(valorProposta) : "",
    plano: cat.planos.find((p) => p.id === planoId)?.nome ?? "",
    dia_hora: proxima ? formatarDiaHora(proxima.scheduled_at, agora) : "",
    local: proxima?.local ?? "",
    renova_em: renovaEm != null && renovaEm >= 0 ? String(renovaEm) : "",
    indicador: sinais.indicador,
    cidade: contato?.cidade ?? "",
  };
  // "dias" depende do que a mensagem conta: desde a proposta, desde o último contato, desde a chegada ou desde o vencimento.
  const desde = (iso: string | null | undefined) => (iso ? String(Math.max(0, Math.round(diasEntre(iso, agora)))) : "");
  vars.dias = sinais.propostaEnviada && !sinais.cliente ? String(Math.max(0, diasProposta ?? 0))
    : sinais.cliente && renovaEm != null && renovaEm < 0 ? String(-renovaEm)
    : sinais.cliente && sinais.cliente.status !== "ativo" ? desde(sinais.cliente.cancelled_at ?? sinais.cliente.updated_at)
    : desde(ultimoContato ?? lead?.created_at);
  return { sinais, vars, lead };
}

/** Texto pronto para o wa.me: situação escolhida pelo grupo da tela Hoje (ou pelo estado, sem grupo) e variáveis preenchidas. */
export function mensagemPara(b: Base, cat: Catalogo, ref: Referencia, grupo?: string | null, agora = new Date()): { situacao: Situacao; texto: string } {
  const { sinais, vars } = contextoDoContato(b, cat, ref, agora);
  const situacao = escolherSituacao(grupo, sinais);
  return { situacao, texto: preencher(TEXTOS[situacao], vars) };
}
