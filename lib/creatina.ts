/**
 * O motor da Calculadora de Creatina.
 *
 * DE ONDE VÊM OS NÚMEROS
 *
 * Posicionamento da International Society of Sports Nutrition (Kreider et
 * al., 2017), o consenso mais citado sobre creatina:
 *
 *   - manutenção: 3 a 5 g por dia — ou, ajustado ao peso, cerca de
 *     0,03 g/kg/dia;
 *   - saturação (opcional): cerca de 0,3 g/kg/dia por 5 a 7 dias,
 *     dividida em quatro doses — os "20 g por dia" que circulam são essa
 *     conta para uma pessoa de uns 70 kg;
 *   - atletas muito grandes podem precisar de 5 a 10 g/dia na manutenção.
 *
 * E Hultman et al. (1996): 3 g/dia elevam a creatina muscular ao mesmo
 * nível da saturação em cerca de 28 dias; 20 g/dia, em cerca de 6.
 *
 * POR QUE A CALCULADORA NÃO DIZ 7 g PARA 70 kg
 *
 * Várias calculadoras brasileiras multiplicam o peso por 0,1 ou 0,06 g/kg
 * como dose diária. Esses fatores não vêm do consenso: 0,1 g/kg aparece em
 * estudos de saturação de curta duração, não de manutenção. Aqui a conta é
 * a da ISSN, e a página mostra por que o número é menor.
 *
 * O QUE A CALCULADORA NÃO PERGUNTA
 *
 * Idade, sexo, altura, objetivo e frequência de treino não mudam a dose de
 * manutenção na literatura. Perguntar seria parecer personalizado sem ser.
 */

import { parseNumero } from "./polichinelo";

export { parseNumero };

/* ───────────────────────── Fontes ───────────────────────── */

export interface Fonte {
  rotulo: string;
  url: string;
  resumo: string;
}

export const FONTE_ISSN: Fonte = {
  rotulo:
    "Kreider RB, Kalman DS, Antonio J, et al. International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine. Journal of the International Society of Sports Nutrition, 2017",
  url: "https://pubmed.ncbi.nlm.nih.gov/28615996/",
  resumo: "o consenso da ISSN: manutenção de 3 a 5 g/dia (cerca de 0,03 g/kg), saturação opcional de cerca de 0,3 g/kg/dia por 5 a 7 dias, e segurança em adultos saudáveis.",
};

export const FONTE_ANTONIO: Fonte = {
  rotulo:
    "Antonio J, Candow DG, Forbes SC, et al. Common questions and misconceptions about creatine supplementation: what does the scientific evidence really show? Journal of the International Society of Sports Nutrition, 2021",
  url: "https://pubmed.ncbi.nlm.nih.gov/33557850/",
  resumo: "revisão sobre retenção de líquido, gordura, rins, desidratação e uso por mulheres, adolescentes e idosos.",
};

export const FONTE_HULTMAN: Fonte = {
  rotulo: "Hultman E, Söderlund K, Timmons JA, et al. Muscle creatine loading in men. Journal of Applied Physiology, 1996",
  url: "https://pubmed.ncbi.nlm.nih.gov/8828669/",
  resumo: "3 g/dia elevam a creatina muscular ao mesmo nível da saturação em cerca de 28 dias; 20 g/dia, em cerca de 6.",
};

export const FONTES_CREATINA: Fonte[] = [FONTE_ISSN, FONTE_ANTONIO, FONTE_HULTMAN];

/* ───────────────────────── A conta ───────────────────────── */

/** Manutenção ajustada ao peso, g/kg/dia (ISSN). */
export const G_POR_KG_MANUTENCAO = 0.03;
/** Faixa estudada de manutenção, g/dia (ISSN). */
export const MANUTENCAO_MIN = 3;
export const MANUTENCAO_MAX = 5;
/** Saturação, g/kg/dia (ISSN). */
export const G_POR_KG_SATURACAO = 0.3;
/** Dias de saturação usados na conta. A faixa estudada é de 5 a 7. */
export const DIAS_SATURACAO = 5;
export const DIAS_SATURACAO_MAX = 7;
/** Doses em que a saturação é dividida. */
export const DOSES_SATURACAO = 4;
/** Dias até saturar sem a fase de saturação, com 3 g/dia (Hultman, 1996). */
export const DIAS_ATE_SATURAR_SEM = 28;
/** Acima disso, a ISSN menciona que atletas muito grandes podem usar 5 a 10 g/dia. */
export const PESO_ATLETA_GRANDE = 120;

export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const POTE_MIN = 50;
export const POTE_MAX = 5000;
export const PRECO_MIN = 1;
export const PRECO_MAX = 3000;
export const MEDIDA_MIN = 0.5;
export const MEDIDA_MAX = 20;
export const POTES_ATALHO = [150, 250, 300, 500, 1000] as const;

export const pesoValido = (p: number | null): p is number => p !== null && Number.isFinite(p) && p >= PESO_MIN && p <= PESO_MAX;
export const poteValido = (g: number | null): g is number => g !== null && Number.isFinite(g) && g >= POTE_MIN && g <= POTE_MAX;
export const precoValido = (r: number | null): r is number => r !== null && Number.isFinite(r) && r >= PRECO_MIN && r <= PRECO_MAX;
export const medidaValida = (g: number | null): g is number => g !== null && Number.isFinite(g) && g >= MEDIDA_MIN && g <= MEDIDA_MAX;

/** Arredonda a 0,5 g — balança de cozinha e dosador não medem décimo. */
export const meioGrama = (g: number) => Math.round(g * 2) / 2;

export interface Referencia {
  pesoKg: number;
  /** 0,03 g/kg, sem arredondar. */
  calculada: number;
  /** A dose prática: a calculada arredondada ao grama e presa à faixa estudada de 3 a 5 g. */
  diaria: number;
  /** A conta deu menos que 3 g e a dose prática subiu para o mínimo estudado. */
  subiuParaMinimo: boolean;
  /** Peso acima do qual a ISSN menciona doses maiores para atletas grandes. */
  atletaGrande: boolean;
}

export function referencia(pesoKg: number): Referencia {
  const calculada = G_POR_KG_MANUTENCAO * pesoKg;
  const diaria = Math.min(MANUTENCAO_MAX, Math.max(MANUTENCAO_MIN, Math.round(calculada)));
  return { pesoKg, calculada, diaria, subiuParaMinimo: calculada < MANUTENCAO_MIN, atletaGrande: pesoKg > PESO_ATLETA_GRANDE };
}

export interface Saturacao {
  /** g/dia na saturação, arredondado ao grama. */
  diaria: number;
  doses: number;
  /** g por dose, a 0,5 g. */
  porDose: number;
  dias: number;
  /** Total consumido na saturação. */
  total: number;
  manutencao: number;
}

export function saturacao(pesoKg: number): Saturacao {
  const diaria = Math.round(G_POR_KG_SATURACAO * pesoKg);
  return {
    diaria,
    doses: DOSES_SATURACAO,
    porDose: meioGrama(diaria / DOSES_SATURACAO),
    dias: DIAS_SATURACAO,
    total: diaria * DIAS_SATURACAO,
    manutencao: referencia(pesoKg).diaria,
  };
}

/* ───────────────────────── O pote ───────────────────────── */

export interface DuracaoPote {
  poteG: number;
  dias: number;
  /** Só com saturação: quanto a saturação consome e quanto sobra. */
  consumoSaturacao: number | null;
  restante: number | null;
  /** O pote acaba antes de terminar a saturação. */
  acabaNaSaturacao: boolean;
}

export function duracaoPote(poteG: number, pesoKg: number, comSaturacao: boolean): DuracaoPote {
  const manut = referencia(pesoKg).diaria;
  if (!comSaturacao) {
    return { poteG, dias: Math.floor(poteG / manut), consumoSaturacao: null, restante: null, acabaNaSaturacao: false };
  }
  const s = saturacao(pesoKg);
  if (s.total >= poteG) {
    return { poteG, dias: Math.floor(poteG / s.diaria), consumoSaturacao: poteG, restante: 0, acabaNaSaturacao: true };
  }
  const restante = poteG - s.total;
  return { poteG, dias: s.dias + Math.floor(restante / manut), consumoSaturacao: s.total, restante, acabaNaSaturacao: false };
}

/** Dias de uso de um pote numa dose fixa — a tabela da página. */
export const diasPorDose = (poteG: number, doseG: number) => Math.floor(poteG / doseG);

export interface Custo {
  porGrama: number;
  porDia: number;
  por30Dias: number;
  porAno: number;
}

export function custo(precoPote: number, poteG: number, doseDiaria: number): Custo {
  const porGrama = precoPote / poteG;
  return { porGrama, porDia: porGrama * doseDiaria, por30Dias: porGrama * doseDiaria * 30, porAno: porGrama * doseDiaria * 365 };
}

/** Comparação só de preço por grama. Não diz nada sobre qualidade. */
export function comparaPotes(a: { g: number; preco: number }, b: { g: number; preco: number }) {
  const ga = a.preco / a.g;
  const gb = b.preco / b.g;
  const maisBarato: "a" | "b" | "empate" = Math.abs(ga - gb) < 0.0005 ? "empate" : ga < gb ? "a" : "b";
  return { porGramaA: ga, porGramaB: gb, maisBarato, diferencaPct: Math.abs(ga - gb) / Math.max(ga, gb) };
}

/** Medidas do dosador para a dose, a 0,5 medida. */
export const medidas = (doseG: number, gPorMedida: number) => meioGrama(doseG / gPorMedida);

/* ───────────────────────── Faixas para o analytics ───────────────────────── */

/** O peso não vai para o Analytics; a faixa, sim, para saber quem usa. */
export function faixaPeso(p: number): string {
  if (p < 60) return "<60";
  if (p < 80) return "60-79";
  if (p < 100) return "80-99";
  return "100+";
}

/* ───────────────────────── Tabelas da página ───────────────────────── */

export const PESOS_TABELA = [50, 60, 70, 80, 90, 100, 120, 150] as const;
export const POTES_TABELA = [150, 300, 500, 1000] as const;

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_REFERENCIA =
  "É uma referência baseada no consenso científico para adultos saudáveis, não uma prescrição individual.";

export const AVISO_SEGURANCA =
  "Com doença renal conhecida, exames de função renal alterados, gravidez, amamentação, menos de 18 anos, doença crônica ou uso contínuo de medicamentos, converse com seu médico ou nutricionista antes de usar creatina. Não porque ela seja perigosa para quem é saudável — a evidência mostra que não é —, mas porque nesses casos a decisão precisa do seu contexto.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora: os que respondem uma dúvida de uso
 * de creatina, em que a próxima pergunta natural é "e quanto eu tomo?".
 */
export const ARTIGOS_COM_CALCULADORA_CREATINA: string[] = [
  "creatina-para-hipertrofia",
  "creatina-para-mulheres",
  "creatina-retencao-de-liquido-mito",
  "melhor-horario-para-tomar-creatina",
  "timing-creatina-quando-tomar",
];

/**
 * Artigos que recebem LINK, não embed. Os dois de GLP-1 ficam no link de
 * propósito: uma calculadora de dose dentro de um artigo sobre remédio
 * pareceria recomendação combinada. Os guias de suplementos falam de
 * creatina entre vários outros assuntos.
 */
export const ARTIGOS_COM_LINK_CREATINA: string[] = [
  "creatina-para-quem-usa-mounjaro",
  "creatina-para-quem-usa-retatrutida",
  "suplementacao-basica-para-iniciantes",
  "suplementos-femininos-guia",
];
