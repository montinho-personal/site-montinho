/**
 * O motor da Calculadora do Teste de Cooper.
 *
 * VO2 máx = (distância em metros − 504,9) ÷ 44,73
 * Cooper KH, JAMA 1968 (115 militares da Força Aérea dos EUA, r = 0,90
 * contra o teste em esteira de laboratório).
 *
 * As faixas por idade e sexo são a tabela de referência do Topend Sports
 * (Rob Wood), a mais reproduzida em português e inglês. A fonte não traz
 * faixa de 13 a 19 anos com a mesma régua, por isso a ferramenta é para
 * adultos de 20 anos ou mais.
 */

export type Sexo = "homem" | "mulher";

export const FONTE_COOPER = {
  rotulo: "Cooper KH. A means of assessing maximal oxygen intake: correlation between field and treadmill testing. JAMA, 1968",
  url: "https://pubmed.ncbi.nlm.nih.gov/5694044/",
};
export const FONTE_NORMAS = {
  rotulo: "Topend Sports. Cooper 12-minute Run Test Norms",
  url: "https://www.topendsports.com/testing/norms/cooper-12minute.htm",
};

export const vo2 = (metros: number) => (metros - 504.9) / 44.73;

export const FAIXAS_IDADE = ["20-29", "30-39", "40-49", "50+"] as const;
export type FaixaIdade = (typeof FAIXAS_IDADE)[number];

export const faixaIdade = (idade: number): FaixaIdade =>
  idade < 30 ? "20-29" : idade < 40 ? "30-39" : idade < 50 ? "40-49" : "50+";

/** Pisos de cada classe, em metros: [excelente (acima de), acima da média, média, abaixo da média]. */
export const NORMAS: Record<Sexo, Record<FaixaIdade, [number, number, number, number]>> = {
  homem: { "20-29": [2800, 2400, 2200, 1600], "30-39": [2700, 2300, 1900, 1500], "40-49": [2500, 2100, 1700, 1400], "50+": [2400, 2000, 1600, 1300] },
  mulher: { "20-29": [2700, 2200, 1800, 1500], "30-39": [2500, 2000, 1700, 1400], "40-49": [2300, 1900, 1500, 1200], "50+": [2200, 1700, 1400, 1100] },
};

export interface Classe { id: string; nome: string; cor: string }
export const CLASSES: Classe[] = [
  { id: "excelente", nome: "Excelente", cor: "#16a34a" },
  { id: "acima", nome: "Acima da média", cor: "#22c55e" },
  { id: "media", nome: "Média", cor: "#eab308" },
  { id: "abaixo", nome: "Abaixo da média", cor: "#f97316" },
  { id: "fraco", nome: "Fraco", cor: "#ef4444" },
];

export function classe(metros: number, sexo: Sexo, idade: number): Classe {
  const [ex, ac, me, ab] = NORMAS[sexo][faixaIdade(idade)];
  if (metros > ex) return CLASSES[0];
  if (metros >= ac) return CLASSES[1];
  if (metros >= me) return CLASSES[2];
  if (metros >= ab) return CLASSES[3];
  return CLASSES[4];
}

/** Quantos metros faltam para a próxima classe (null se já está em excelente). */
export function proximaClasse(metros: number, sexo: Sexo, idade: number): { classe: Classe; faltam: number } | null {
  const pisos = NORMAS[sexo][faixaIdade(idade)];
  const c = classe(metros, sexo, idade);
  const k = CLASSES.indexOf(c);
  if (k === 0) return null;
  const alvo = k === 1 ? pisos[0] + 1 : pisos[k - 1];
  return { classe: CLASSES[k - 1], faltam: alvo - metros };
}

export const kmh = (metros: number) => (metros / 1000) * 5;
export const paceMinKm = (metros: number) => 12 / (metros / 1000);
export const fmtPace = (minPorKm: number) => {
  const tot = Math.round(minPorKm * 60);
  return `${Math.floor(tot / 60)}:${String(tot % 60).padStart(2, "0")} min/km`;
};

/** Abaixo de ~1 km em 12 minutos é caminhada lenta: a fórmula, feita com corredores, perde o sentido. */
export const DIST_MIN = 1000;
export const DIST_MAX = 5000;

export const parseNumero = (s: string): number | null => {
  const n = Number(s.replace(",", ".").trim());
  return s.trim() && Number.isFinite(n) ? n : null;
};
export const fmt1 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const fmtInt = (n: number) => Math.round(n).toLocaleString("pt-BR");

export const DISTANCIAS_TABELA = [1200, 1600, 2000, 2400, 2800, 3200] as const;
