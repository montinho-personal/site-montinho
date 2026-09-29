/**
 * O motor da Calculadora de Whey.
 *
 * A CONTA NÃO É "PESO × WHEY"
 *
 * Nenhum estudo define gramas de whey por kg de peso. O que a literatura
 * define é a ingestão TOTAL de proteína por dia. Por isso a calculadora faz
 * três passos, nesta ordem:
 *
 *   1. meta de proteína do dia (g/kg × peso, faixa com fonte);
 *   2. meta − o que a pessoa já come = quanto falta;
 *   3. quanto falta ÷ concentração do whey DELA (proteína ÷ porção do
 *      rótulo) = gramas de produto.
 *
 * Whey é uma das formas de completar a meta, não a meta.
 *
 * DE ONDE VÊM AS FAIXAS
 *
 * - Morton et al. (BJSM 2018): em quem faz musculação, ~1,6 g/kg/dia foi o
 *   ponto a partir do qual mais proteína não mostrou ganho claro de massa
 *   magra, com intervalo até ~2,2. É a mesma base da Calculadora de
 *   Proteína do site, e os números batem de propósito.
 * - ISSN (Jäger et al., 2017): 1,4 a 2,0 g/kg/dia bastam para a maioria de
 *   quem se exercita, e o déficit calórico pede o topo da faixa (ou mais)
 *   para preservar massa magra.
 * - Leidy et al. (AJCN 2015): no emagrecimento, dietas com 1,2 a 1,6 g/kg
 *   melhoraram saciedade e controle de peso — sem depender de treino.
 * - RDA (Institute of Medicine, 2005): 0,8 g/kg é o mínimo para adultos
 *   saudáveis, sem treino.
 *
 * O objetivo e o "treina musculação?" só selecionam ENTRE essas faixas.
 * Nenhuma diferença foi inventada: ganhar e emagrecer, para quem treina,
 * usam a mesma faixa; muda só o ponto de referência dentro dela.
 */

import { parseNumero } from "./polichinelo";

export { parseNumero };

/* ───────────────────────── Fontes ───────────────────────── */

export interface Fonte {
  rotulo: string;
  url: string;
  resumo: string;
}

export const FONTE_MORTON: Fonte = {
  rotulo:
    "Morton RW, Murphy KT, McKellar SR, et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults. British Journal of Sports Medicine, 2018",
  url: "https://pubmed.ncbi.nlm.nih.gov/28698222/",
  resumo: "49 estudos, 1.863 participantes: cerca de 1,6 g/kg/dia foi o ponto a partir do qual mais proteína não mostrou ganho claro de massa magra, com intervalo de confiança até cerca de 2,2.",
};

export const FONTE_ISSN: Fonte = {
  rotulo:
    "Jäger R, Kerksick CM, Campbell BI, et al. International Society of Sports Nutrition Position Stand: protein and exercise. Journal of the International Society of Sports Nutrition, 2017",
  url: "https://pubmed.ncbi.nlm.nih.gov/28642676/",
  resumo: "1,4 a 2,0 g/kg/dia para a maioria de quem se exercita; ingestões maiores no déficit calórico para preservar massa magra; 20 a 40 g de proteína por refeição como referência.",
};

export const FONTE_LEIDY: Fonte = {
  rotulo:
    "Leidy HJ, Clifton PM, Astrup A, et al. The role of protein in weight loss and maintenance. American Journal of Clinical Nutrition, 2015",
  url: "https://pubmed.ncbi.nlm.nih.gov/25926512/",
  resumo: "no emagrecimento, dietas com 1,2 a 1,6 g/kg/dia melhoraram apetite, controle de peso e marcadores cardiometabólicos.",
};

export const FONTE_RDA: Fonte = {
  rotulo:
    "Institute of Medicine. Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids. National Academies Press, 2005",
  url: "https://nap.nationalacademies.org/catalog/10490",
  resumo: "0,8 g/kg/dia como ingestão recomendada (RDA) para adultos saudáveis — um mínimo, não um alvo para quem treina.",
};

export const FONTE_SCHOENFELD: Fonte = {
  rotulo:
    "Schoenfeld BJ, Aragon AA. How much protein can the body use in a single meal for muscle-building? Implications for daily protein distribution. Journal of the International Society of Sports Nutrition, 2018",
  url: "https://pubmed.ncbi.nlm.nih.gov/29497353/",
  resumo: "o limite de 20 a 25 g por refeição vale para proteína rápida isolada; distribuir cerca de 0,4 g/kg em quatro refeições é uma estratégia prática, não um teto de absorção.",
};

export const FONTE_TROMMELEN: Fonte = {
  rotulo:
    "Trommelen J, van Lieshout GAA, Nyakayiru J, et al. The anabolic response to protein ingestion during recovery from exercise has no upper limit in magnitude and duration in vivo in humans. Cell Reports Medicine, 2023",
  url: "https://www.cell.com/cell-reports-medicine/fulltext/S2666-3791(23)00540-2",
  resumo: "100 g de proteína numa refeição deram resposta anabólica maior e mais longa que 25 g — o corpo não descarta o que passa de 30 g.",
};

export const FONTE_ARAGON: Fonte = {
  rotulo: "Aragon AA, Schoenfeld BJ. Nutrient timing revisited: is there a post-exercise anabolic window? Journal of the International Society of Sports Nutrition, 2013",
  url: "https://pubmed.ncbi.nlm.nih.gov/23360586/",
  resumo: "a janela depois do treino é de horas, não de 30 minutos; a ingestão total do dia pesa mais que o horário.",
};

export const FONTE_TACO: Fonte = {
  rotulo: "Tabela Brasileira de Composição de Alimentos (TACO), 4ª edição. NEPA/Unicamp, 2011",
  url: "https://nepa.unicamp.br/publicacoes/tabela-taco-pdf/",
  resumo: "proteína dos alimentos do estimador rápido.",
};

export const FONTES_WHEY: Fonte[] = [FONTE_MORTON, FONTE_ISSN, FONTE_LEIDY, FONTE_RDA, FONTE_SCHOENFELD, FONTE_TROMMELEN, FONTE_ARAGON, FONTE_TACO];

/* ───────────────────────── A meta ───────────────────────── */

export type Objetivo = "ganhar" | "emagrecer" | "manter";

export const OBJETIVOS: { id: Objetivo; rotulo: string }[] = [
  { id: "ganhar", rotulo: "Ganhar massa muscular" },
  { id: "emagrecer", rotulo: "Emagrecer preservando massa muscular" },
  { id: "manter", rotulo: "Manter peso e composição corporal" },
];

export interface Faixa {
  /** g/kg/dia. */
  min: number;
  max: number;
  /** O ponto de referência dentro da faixa. */
  ref: number;
  fonte: Fonte;
  /** Por que este ponto, em uma frase. */
  porque: string;
}

/**
 * A tabela inteira da metodologia. Treinar musculação muda a faixa — é o
 * único motivo de a pergunta existir; os estudos de 1,6 a 2,2 são com quem
 * treina, e sem treino a referência é outra.
 */
export const FAIXAS: Record<"treina" | "naoTreina", Record<Objetivo, Faixa>> = {
  treina: {
    ganhar: { min: 1.6, max: 2.2, ref: 2.0, fonte: FONTE_MORTON, porque: "o meio da faixa em que os estudos de musculação encontraram o benefício." },
    emagrecer: { min: 1.6, max: 2.2, ref: 2.2, fonte: FONTE_ISSN, porque: "no déficit calórico, o consenso da ISSN recomenda o topo da faixa para preservar massa magra." },
    manter: { min: 1.4, max: 2.0, ref: 1.6, fonte: FONTE_ISSN, porque: "a faixa da ISSN para quem se exercita, no ponto em que o benefício para massa magra se estabiliza." },
  },
  naoTreina: {
    ganhar: { min: 0.8, max: 0.8, ref: 0.8, fonte: FONTE_RDA, porque: "sem treino de força, proteína a mais não constrói músculo; a referência é a ingestão recomendada para adultos." },
    emagrecer: { min: 1.2, max: 1.6, ref: 1.2, fonte: FONTE_LEIDY, porque: "a faixa que melhorou saciedade e controle de peso em dietas de emagrecimento." },
    manter: { min: 0.8, max: 0.8, ref: 0.8, fonte: FONTE_RDA, porque: "a ingestão recomendada para adultos saudáveis." },
  },
};

export const PESO_MIN = 30;
export const PESO_MAX = 250;
/** Acima disso, a conta pelo peso atual tende a superestimar em obesidade. */
export const PESO_AVISO_AJUSTADO = 110;

export const pesoValido = (p: number | null): p is number => p !== null && Number.isFinite(p) && p >= PESO_MIN && p <= PESO_MAX;

export interface Meta {
  pesoKg: number;
  faixa: Faixa;
  /** g/dia, inteiros — decimal de grama aqui seria falsa precisão. */
  minG: number;
  maxG: number;
  refG: number;
  avisoPesoAjustado: boolean;
}

export function meta(pesoKg: number, objetivo: Objetivo, treina: boolean): Meta {
  const faixa = FAIXAS[treina ? "treina" : "naoTreina"][objetivo];
  return {
    pesoKg,
    faixa,
    minG: Math.round(faixa.min * pesoKg),
    maxG: Math.round(faixa.max * pesoKg),
    refG: Math.round(faixa.ref * pesoKg),
    avisoPesoAjustado: pesoKg > PESO_AVISO_AJUSTADO,
  };
}

/* ───────────────────────── O que falta ───────────────────────── */

export const CONSUMO_MIN = 0;
export const CONSUMO_MAX = 400;
/**
 * Acima disso, o que falta é grande demais para o whey resolver sozinho:
 * seriam mais de duas porções típicas só de suplemento.
 */
export const FALTA_GRANDE = 60;

export const consumoValido = (g: number | null): g is number => g !== null && Number.isFinite(g) && g >= CONSUMO_MIN && g <= CONSUMO_MAX;

export interface Falta {
  metaG: number;
  consumoG: number;
  /** 0 quando a alimentação já chega na meta. */
  faltaG: number;
  atingida: boolean;
  /** A diferença é grande para completar só com suplemento. */
  grande: boolean;
}

export function falta(metaG: number, consumoG: number): Falta {
  const f = Math.max(0, Math.round(metaG - consumoG));
  return { metaG, consumoG, faltaG: f, atingida: f === 0, grande: f > FALTA_GRANDE };
}

/* ───────────────────────── O rótulo ───────────────────────── */

export const PORCAO_MIN = 5;
export const PORCAO_MAX = 100;
/** Abaixo disso não parece whey — talvez um hipercalórico. */
export const CONCENTRACAO_BAIXA = 0.5;
/** Acima disso é incomum até para isolado; vale conferir. */
export const CONCENTRACAO_ALTA = 0.95;

export type EstadoRotulo = "ok" | "porcaoInvalida" | "proteinaInvalida" | "impossivel" | "baixa" | "alta";

/** Valida o par porção/proteína do rótulo. "baixa" e "alta" calculam, mas avisam. */
export function estadoRotulo(porcaoG: number | null, proteinaG: number | null): EstadoRotulo {
  if (porcaoG === null || !Number.isFinite(porcaoG) || porcaoG < PORCAO_MIN || porcaoG > PORCAO_MAX) return "porcaoInvalida";
  if (proteinaG === null || !Number.isFinite(proteinaG) || proteinaG <= 0) return "proteinaInvalida";
  if (proteinaG > porcaoG) return "impossivel";
  const c = proteinaG / porcaoG;
  if (c < CONCENTRACAO_BAIXA) return "baixa";
  if (c > CONCENTRACAO_ALTA) return "alta";
  return "ok";
}

export const rotuloCalculavel = (e: EstadoRotulo) => e === "ok" || e === "baixa" || e === "alta";

/** Proteína por grama de produto: 24 g em 30 g = 0,8. */
export const concentracao = (porcaoG: number, proteinaG: number) => proteinaG / porcaoG;

export interface Dose {
  /** Proteína que o whey precisa fornecer. */
  proteinaG: number;
  /** Gramas de produto, ao grama. */
  produtoG: number;
  /** Porções do rótulo, com duas casas. */
  porcoes: number;
  concentracao: number;
}

export function dose(faltaG: number, porcaoG: number, proteinaPorcaoG: number): Dose {
  const c = concentracao(porcaoG, proteinaPorcaoG);
  return {
    proteinaG: faltaG,
    produtoG: Math.round(faltaG / c),
    porcoes: Math.round((faltaG / proteinaPorcaoG) * 100) / 100,
    concentracao: c,
  };
}

/** O inverso: quanta proteína tem numa quantidade de produto. */
export const proteinaEm = (produtoG: number, porcaoG: number, proteinaPorcaoG: number) =>
  Math.round(produtoG * concentracao(porcaoG, proteinaPorcaoG) * 10) / 10;

export const ATALHOS_INVERSO = [30, 40, 50, 60] as const;

/** Medidas do dosador, com duas casas. O dosador é o do rótulo, não um "scoop universal". */
export const MEDIDA_MIN = 5;
export const MEDIDA_MAX = 100;
export const medidaValida = (g: number | null): g is number => g !== null && Number.isFinite(g) && g >= MEDIDA_MIN && g <= MEDIDA_MAX;
export const medidas = (produtoG: number, gPorMedida: number) => Math.round((produtoG / gPorMedida) * 100) / 100;

/* ───────────────────────── O pacote ───────────────────────── */

export const PACOTE_MIN = 100;
export const PACOTE_MAX = 10000;
export const PACOTES_ATALHO = [450, 900, 1000, 1800] as const;
export const PRECO_MIN = 1;
export const PRECO_MAX = 5000;

export const pacoteValido = (g: number | null): g is number => g !== null && Number.isFinite(g) && g >= PACOTE_MIN && g <= PACOTE_MAX;
export const precoValido = (r: number | null): r is number => r !== null && Number.isFinite(r) && r >= PRECO_MIN && r <= PRECO_MAX;
export const diasSemanaValido = (d: number | null): d is number => d !== null && Number.isInteger(d) && d >= 1 && d <= 7;

export interface Duracao {
  /** Quantas vezes o pacote rende na dose. */
  usos: number;
  /** Dias de calendário, contando que só se usa em alguns dias da semana. */
  diasCorridos: number;
  semanas: number;
}

export function duracao(pacoteG: number, doseG: number, diasPorSemana = 7): Duracao {
  const usos = Math.floor(pacoteG / doseG);
  const diasCorridos = Math.floor((usos * 7) / diasPorSemana);
  return { usos, diasCorridos, semanas: Math.round((diasCorridos / 7) * 10) / 10 };
}

export interface Custo {
  porGrama: number;
  porPorcao: number;
  /** Por dia de uso, na dose calculada. */
  porUso: number;
  /** Em 30 dias de calendário, com os dias de uso por semana. */
  por30Dias: number;
  por25gProteina: number;
  por30gProteina: number;
}

export function custo(preco: number, pacoteG: number, porcaoG: number, proteinaPorcaoG: number, doseG: number, diasPorSemana = 7): Custo {
  const porGrama = preco / pacoteG;
  const c = concentracao(porcaoG, proteinaPorcaoG);
  return {
    porGrama,
    porPorcao: porGrama * porcaoG,
    porUso: porGrama * doseG,
    por30Dias: porGrama * doseG * ((30 * diasPorSemana) / 7),
    por25gProteina: (25 / c) * porGrama,
    por30gProteina: (30 / c) * porGrama,
  };
}

/* ───────────────────────── Comparador ───────────────────────── */

export interface Produto {
  preco: number;
  pacoteG: number;
  porcaoG: number;
  proteinaG: number;
}

export const produtoValido = (p: { preco: number | null; pacoteG: number | null; porcaoG: number | null; proteinaG: number | null }): p is Produto =>
  precoValido(p.preco) && pacoteValido(p.pacoteG) && rotuloCalculavel(estadoRotulo(p.porcaoG, p.proteinaG));

export interface LinhaComparador {
  proteinaPor100g: number;
  por25g: number;
  por30g: number;
}

export function linhaComparador(p: Produto): LinhaComparador {
  const c = concentracao(p.porcaoG, p.proteinaG);
  const porGrama = p.preco / p.pacoteG;
  return { proteinaPor100g: Math.round(c * 1000) / 10, por25g: (25 / c) * porGrama, por30g: (30 / c) * porGrama };
}

/** Pelo custo da proteína, não do pó. Não diz nada sobre qualidade. */
export function compara(a: Produto, b: Produto) {
  const la = linhaComparador(a);
  const lb = linhaComparador(b);
  const maisBarato: "a" | "b" | "empate" = Math.abs(la.por25g - lb.por25g) < 0.005 ? "empate" : la.por25g < lb.por25g ? "a" : "b";
  return { a: la, b: lb, maisBarato, diferencaPct: Math.abs(la.por25g - lb.por25g) / Math.max(la.por25g, lb.por25g) };
}

/* ───────────────────────── Estimador rápido ───────────────────────── */

/**
 * Para quem clica "não sei". Não é diário alimentar: são os alimentos que
 * mais pesam na proteína do brasileiro, numa porção caseira, e a pessoa
 * conta quantas porções come num dia comum.
 *
 * A proteína por 100 g vem da TACO, pela base de alimentos do site
 * (lib/alimentos). O teste confere cada valor contra a base, para que os
 * dois nunca discordem. A porção caseira é aproximada, e a tela diz isso.
 *
 * Leite e iogurte proteico ficam fora de propósito: a TACO desta edição
 * não traz macronutrientes do leite integral, e produto proteico varia por
 * marca. Esses entram no campo "outros, pelo rótulo".
 */
export interface AlimentoEstimador {
  id: string;
  /** Slug na base (lib/alimentos), fonte TACO. */
  slugBase: string;
  nome: string;
  porcao: string;
  porcaoG: number;
  proteinaPor100g: number;
}

export const ALIMENTOS_ESTIMADOR: AlimentoEstimador[] = [
  { id: "ovo", slugBase: "ovo-de-galinha-inteiro-cozido-10minutos", nome: "Ovo", porcao: "1 unidade (50 g)", porcaoG: 50, proteinaPor100g: 13.3 },
  { id: "frango", slugBase: "frango-peito-sem-pele-grelhado", nome: "Frango (peito grelhado)", porcao: "1 filé médio (100 g)", porcaoG: 100, proteinaPor100g: 32 },
  { id: "carne", slugBase: "carne-bovina-patinho-sem-gordura-grelhado", nome: "Carne magra (patinho grelhado)", porcao: "1 bife médio (100 g)", porcaoG: 100, proteinaPor100g: 35.9 },
  { id: "peixe", slugBase: "merluza-file-assado", nome: "Peixe (filé assado)", porcao: "1 filé (100 g)", porcaoG: 100, proteinaPor100g: 26.6 },
  { id: "atum", slugBase: "atum-conserva-em-oleo", nome: "Atum em lata", porcao: "½ lata escorrida (60 g)", porcaoG: 60, proteinaPor100g: 26.2 },
  { id: "queijo", slugBase: "queijo-mozarela", nome: "Queijo muçarela", porcao: "2 fatias (30 g)", porcaoG: 30, proteinaPor100g: 22.6 },
  { id: "iogurte", slugBase: "iogurte-natural", nome: "Iogurte natural", porcao: "1 pote (170 g)", porcaoG: 170, proteinaPor100g: 4.1 },
  { id: "feijao", slugBase: "feijao-carioca-cozido", nome: "Feijão", porcao: "1 concha (100 g)", porcaoG: 100, proteinaPor100g: 4.8 },
  { id: "lentilha", slugBase: "lentilha-cozida", nome: "Lentilha", porcao: "1 concha (100 g)", porcaoG: 100, proteinaPor100g: 6.3 },
  { id: "arroz", slugBase: "arroz-tipo-1-cozido", nome: "Arroz", porcao: "4 colheres de sopa (100 g)", porcaoG: 100, proteinaPor100g: 2.5 },
  { id: "pao", slugBase: "pao-trigo-frances", nome: "Pão francês", porcao: "1 unidade (50 g)", porcaoG: 50, proteinaPor100g: 8 },
  { id: "tofu", slugBase: "soja-queijo-tofu", nome: "Tofu", porcao: "1 fatia grossa (100 g)", porcaoG: 100, proteinaPor100g: 6.6 },
];

export const proteinaPorcao = (a: AlimentoEstimador) => Math.round(((a.porcaoG * a.proteinaPor100g) / 100) * 10) / 10;

/** Soma do estimador, ao grama. `outrosG` é o que a pessoa leu em rótulos. */
export function estimaConsumo(porcoes: Record<string, number>, outrosG = 0): number {
  let total = outrosG;
  for (const a of ALIMENTOS_ESTIMADOR) total += (porcoes[a.id] ?? 0) * proteinaPorcao(a);
  return Math.round(total);
}

export const PORCOES_MAX = 10;

/* ───────────────────────── Analytics ───────────────────────── */

/** O peso não vai para o Analytics; a faixa, sim. */
export function faixaPeso(p: number): string {
  if (p < 60) return "<60";
  if (p < 80) return "60-79";
  if (p < 100) return "80-99";
  return "100+";
}

export function faixaFalta(f: Falta): string {
  if (f.atingida) return "0";
  if (f.faltaG <= 30) return "1-30";
  if (f.faltaG <= FALTA_GRANDE) return "31-60";
  return "60+";
}

/* ───────────────────────── Tabelas da página ───────────────────────── */

export const PESOS_TABELA = [50, 60, 70, 80, 90, 100] as const;
/** Rótulos de exemplo: todos com porção de 30 g. */
export const ROTULOS_EXEMPLO = [18, 21, 24, 27] as const;
export const QTDS_TABELA = [30, 40, 50, 60] as const;
/** O rótulo usado nos exemplos de texto, sempre declarado junto. */
export const ROTULO_PADRAO = { porcaoG: 30, proteinaG: 24 } as const;

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_REFERENCIA =
  "É uma estimativa com base na literatura científica para adultos saudáveis, não uma prescrição nutricional individual.";

export const AVISO_SEGURANCA =
  "Com doença renal, alergia à proteína do leite, gravidez, amamentação, menos de 18 anos ou dieta prescrita por condição de saúde, converse com seu médico ou nutricionista antes de ajustar proteína ou usar whey. Intolerância à lactose é diferente de alergia: o isolado costuma ter pouca lactose, mas só o rótulo do seu produto diz quanto.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora: o leitor chega com "quanto eu tomo?".
 * "Como tomar" traz a seção "Qual a dose certa?" — a pergunta da ferramenta.
 */
export const ARTIGOS_COM_CALCULADORA_WHEY: string[] = ["whey-protein-como-tomar"];

/**
 * Artigos que recebem LINK, não embed:
 * - "concentrado, isolado ou hidrolisado": a pergunta é qual comprar; o
 *   comparador de custo por proteína ajuda, mas não responde o título.
 * - "whey engorda?": a dúvida é de calorias, não de dose.
 * - Mounjaro: uma calculadora de dose num artigo sobre remédio pareceria
 *   recomendação combinada, a mesma regra da creatina.
 * - proteína vegana × whey: a pergunta é qual fonte, não quanto.
 */
export const ARTIGOS_COM_LINK_WHEY: string[] = [
  "whey-concentrado-vs-isolado-vs-hidrolisado",
  "whey-protein-engorda",
  "whey-protein-para-quem-usa-mounjaro",
  "proteina-vegana-whey-ganho-muscular-estudo-2025",
  "black-friday-suplementos",
];
