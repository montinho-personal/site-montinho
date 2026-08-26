import { ACADEMIAS } from "./base";
import { ESTILO_LABEL, REGIAO_LABEL, type Academia, type Estilo, type FaixaPreco, type Regiao } from "./tipos";

/**
 * Motor de compatibilidade.
 *
 * Determinístico e auditável: as mesmas respostas produzem sempre o mesmo
 * resultado, e cada item da lista sabe explicar por que apareceu. Nenhuma
 * chamada de IA — não existe pergunta aqui que um modelo responda melhor que
 * uma regra escrita, e regra escrita a gente consegue justificar.
 *
 * Três princípios, nesta ordem:
 *
 * 1. NÃO EXISTE "MELHOR ACADEMIA". Existe encaixe com o que a pessoa disse.
 *    Por isso o resultado é "critérios atendidos", nunca nota de qualidade.
 *
 * 2. DADO AUSENTE NUNCA ELIMINA. Se não sabemos se a unidade abre 24h, ela não
 *    é descartada de quem precisa de 24h — ela aparece com a ressalva. Eliminar
 *    por desconhecimento nosso puniria a academia pelo nosso buraco de dados.
 *
 * 3. SÓ CRITÉRIO ESSENCIAL ELIMINA, e só contra informação CONFIRMADA. Uma
 *    academia que sabidamente fecha às 22h sai para quem só treina depois das
 *    23h — aí a incompatibilidade é fato, não suposição.
 */

export type Objetivo = "massa" | "emagrecer" | "forca" | "saude" | "condicionamento" | "aulas" | "comecando";
export type Conveniencia = "casa" | "trabalho" | "caminho" | "indiferente";
export type Horario = "muito_cedo" | "manha" | "almoco" | "tarde" | "noite" | "pos_22h" | "variavel";
export type FimDeSemana = "sabado" | "domingo" | "ambos" | "nao";
export type Importancia = "essencial" | "preferivel" | "indiferente";
export type Beneficio = "wellhub" | "totalpass" | "outro" | "nenhum";

export interface Respostas {
  objetivo: Objetivo;
  conveniencia: Conveniencia;
  regiao: Regiao | "indiferente";
  horario: Horario;
  fimDeSemana: FimDeSemana;
  estilos: Estilo[];
  vinteQuatro: Importancia;
  estacionamento: Importancia;
  preco: FaixaPreco | "indiferente";
  beneficio: Beneficio;
  personal: "sim" | "talvez" | "nao";
}

export interface Criterio {
  rotulo: string;
  /** true = atendido, false = sabidamente não atendido, null = não confirmado. */
  atende: boolean | null;
  /**
   * Peso no ranqueamento. Região e itens marcados como essenciais valem o
   * dobro: são escolhas explícitas da pessoa, e tratá-las igual a um critério
   * secundário faz uma academia com mais dados confirmados passar na frente de
   * outra que fica exatamente onde ela pediu.
   */
  peso: number;
}

export interface Resultado {
  academia: Academia;
  criterios: Criterio[];
  atendidos: number;
  aplicaveis: number;
  naoConfirmados: number;
  /** Soma ponderada — usada só para ordenar. O que aparece na tela é a contagem. */
  pontos: number;
  /** Ressalvas honestas para mostrar junto do resultado. */
  ressalvas: string[];
}

export interface Recomendacao {
  top: Resultado[];
  /** Critérios essenciais que nenhuma academia confirmada atendeu. */
  semCombinacaoPerfeita: boolean;
  /** Empate técnico entre os dois primeiros. */
  empateTecnico: boolean;
  /** Total de unidades consideradas depois dos filtros duros. */
  consideradas: number;
}

/** Hora mínima de fechamento que cada faixa de horário exige. */
const FECHA_MINIMO: Partial<Record<Horario, number>> = {
  noite: 21,
  pos_22h: 23,
};

/** Hora máxima de abertura que cada faixa exige. */
const ABRE_MAXIMO: Partial<Record<Horario, number>> = {
  muito_cedo: 6,
  manha: 8,
};

/**
 * Normaliza hora de fechamento que passa da meia-noite.
 *
 * Uma academia que fecha à 0h fecha DEPOIS de uma que fecha às 22h — mas
 * `0 < 22`. Sem isso, a que fica aberta até mais tarde é justamente a que
 * seria descartada de quem só treina à noite. Tratamos 0h–4h como 24h–28h.
 */
function normalizaFechamento(h: number): number {
  return h <= 4 ? h + 24 : h;
}

function avaliar(a: Academia, r: Respostas): Resultado {
  const criterios: Criterio[] = [];
  const ressalvas: string[] = [];

  const add = (rotulo: string, atende: boolean | null, ressalva?: string, peso = 1) => {
    criterios.push({ rotulo, atende, peso });
    if (atende === null && ressalva) ressalvas.push(ressalva);
  };

  // Região
  if (r.regiao !== "indiferente") {
    add(`Fica em ${REGIAO_LABEL[r.regiao]}`, a.regiao === r.regiao, undefined, 2);
  }

  // Horário de fechamento / abertura
  const minFecha = FECHA_MINIMO[r.horario];
  if (minFecha !== undefined) {
    const v = a.fechaDiaUtil.valor;
    const abre24 = a.vinteQuatroHoras.valor === true;
    add(
      `Aberta no seu horário (${r.horario === "pos_22h" ? "depois das 22h" : "à noite"})`,
      abre24 ? true : v === null ? null : normalizaFechamento(v) >= minFecha,
      "Horário de funcionamento não confirmado — vale checar com a unidade."
    );
  }
  const maxAbre = ABRE_MAXIMO[r.horario];
  if (maxAbre !== undefined) {
    const v = a.abreDiaUtil.valor;
    const abre24 = a.vinteQuatroHoras.valor === true;
    add(
      "Abre cedo o suficiente para o seu horário",
      abre24 ? true : v === null ? null : v <= maxAbre,
      "Horário de abertura não confirmado — vale checar com a unidade."
    );
  }

  // Fim de semana
  if (r.fimDeSemana !== "nao") {
    const precisaSab = r.fimDeSemana === "sabado" || r.fimDeSemana === "ambos";
    const precisaDom = r.fimDeSemana === "domingo" || r.fimDeSemana === "ambos";
    if (precisaSab) {
      add("Abre aos sábados", a.vinteQuatroHoras.valor === true ? true : a.abreSabado.valor,
        "Funcionamento no sábado não confirmado.");
    }
    if (precisaDom) {
      add("Abre aos domingos", a.vinteQuatroHoras.valor === true ? true : a.abreDomingo.valor,
        "Funcionamento no domingo não confirmado.");
    }
  }

  // 24 horas
  if (r.vinteQuatro !== "indiferente") {
    add("Funciona 24 horas", a.vinteQuatroHoras.valor, "Não confirmamos se a unidade opera 24h.",
      r.vinteQuatro === "essencial" ? 2 : 1);
  }

  // Estacionamento
  if (r.estacionamento !== "indiferente") {
    add("Tem estacionamento", a.estacionamento.valor, "Estacionamento não confirmado.",
      r.estacionamento === "essencial" ? 2 : 1);
  }

  // Estilos
  for (const e of r.estilos) {
    const lista = a.estilos.valor;
    add(ESTILO_LABEL[e], lista === null ? null : lista.includes(e),
      `Não confirmamos a estrutura de ${ESTILO_LABEL[e].toLowerCase()} nessa unidade.`);
  }

  // Faixa de preço
  if (r.preco !== "indiferente") {
    add("Dentro da faixa de investimento", a.faixaPreco.valor === null ? null : a.faixaPreco.valor === r.preco,
      "Faixa de preço não confirmada — planos mudam, consulte a unidade.");
  }

  // Benefício
  if (r.beneficio === "wellhub") {
    add("Aceita Wellhub", a.wellhub.valor, "Não confirmamos se a unidade aceita Wellhub.");
  } else if (r.beneficio === "totalpass") {
    add("Aceita TotalPass", a.totalpass.valor, "Não confirmamos se a unidade aceita TotalPass.");
  }

  // Personal externo — informativo, nunca decide o ranking.
  if (r.personal === "sim" && a.personalExterno.valor !== null) {
    add("Permite personal externo", a.personalExterno.valor);
  }

  const aplicaveis = criterios.length;
  const atendidos = criterios.filter((c) => c.atende === true).length;
  const naoConfirmados = criterios.filter((c) => c.atende === null).length;

  const pontos = criterios.reduce((acc, c) => acc + (c.atende === true ? c.peso : 0), 0);

  return { academia: a, criterios, atendidos, aplicaveis, naoConfirmados, ressalvas, pontos };
}

/** Critérios marcados como essenciais que a academia sabidamente não atende. */
function reprovaEssencial(res: Resultado, r: Respostas): boolean {
  const falha = (rotulo: string) =>
    res.criterios.some((c) => c.rotulo.startsWith(rotulo) && c.atende === false);

  if (r.vinteQuatro === "essencial" && falha("Funciona 24 horas")) return true;
  if (r.estacionamento === "essencial" && falha("Tem estacionamento")) return true;
  // Horário: incompatibilidade confirmada é fato, não suposição.
  if (falha("Aberta no seu horário")) return true;
  if (falha("Abre cedo")) return true;
  return false;
}

export function recomendar(respostas: Respostas): Recomendacao {
  const ativas = ACADEMIAS.filter((a) => a.status === "ativa");
  const avaliadas = ativas.map((a) => avaliar(a, respostas));

  const passaram = avaliadas.filter((r) => !reprovaEssencial(r, respostas));
  const base = passaram.length > 0 ? passaram : avaliadas;

  const ordenadas = [...base].sort((x, y) => {
    // 1) soma ponderada — região e essenciais pesam o dobro
    if (y.pontos !== x.pontos) return y.pontos - x.pontos;
    // 2) menos incerteza — quem tem dado confirmado ganha do que é chute
    if (x.naoConfirmados !== y.naoConfirmados) return x.naoConfirmados - y.naoConfirmados;
    // 3) desempate estável por id, para o resultado nunca mudar sozinho
    return x.academia.id.localeCompare(y.academia.id);
  });

  const top = ordenadas.slice(0, 3);
  const empateTecnico =
    top.length >= 2 && top[0].pontos === top[1].pontos && top[0].naoConfirmados === top[1].naoConfirmados;

  return {
    top,
    semCombinacaoPerfeita: passaram.length === 0,
    empateTecnico,
    consideradas: base.length,
  };
}

/** Resumo do que a pessoa pediu, para repetir de volta no resultado. */
export function resumoRespostas(r: Respostas): string[] {
  const out: string[] = [];
  const obj: Record<Objetivo, string> = {
    massa: "ganhar massa muscular", emagrecer: "emagrecer", forca: "ganhar força",
    saude: "saúde e qualidade de vida", condicionamento: "condicionamento",
    aulas: "aulas e atividades", comecando: "está começando agora",
  };
  out.push(`Seu foco: ${obj[r.objetivo]}`);
  if (r.regiao !== "indiferente") out.push(`Região: ${REGIAO_LABEL[r.regiao]}`);
  if (r.estilos.length) out.push(`Procura: ${r.estilos.map((e) => ESTILO_LABEL[e].toLowerCase()).join(", ")}`);
  if (r.vinteQuatro === "essencial") out.push("24 horas é essencial");
  if (r.estacionamento === "essencial") out.push("Estacionamento é essencial");
  return out;
}
