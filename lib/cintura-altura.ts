/**
 * O motor da Calculadora de Relação Cintura-Altura (RCA, também chamada de
 * relação cintura-estatura, RCE).
 *
 *     RCA = cintura (cm) ÷ altura (cm)
 *
 * As faixas são as da NICE (NG246), recomendações 1.9.14 e 1.9.15:
 *   0,40 a 0,49 — adiposidade central saudável;
 *   0,50 a 0,59 — adiposidade central aumentada;
 *   0,60 ou mais — adiposidade central alta.
 * Valem para adultos com IMC abaixo de 35, dos dois sexos e de todas as
 * etnias, inclusive quem tem muita massa muscular. O mesmo corte para homem
 * e mulher é o que a NICE diz; não inventamos faixas separadas por sexo.
 * Abaixo de 0,40 a NICE não define faixa: a ferramenta só diz que está
 * abaixo da faixa da tabela, sem chamar de saudável.
 */

export const FONTE_NICE = {
  rotulo: "NICE. Overweight and obesity management (NG246), recomendações 1.9.14 e 1.9.15",
  url: "https://www.nice.org.uk/guidance/ng246",
};

export const ALTURA_MIN = 120;
export const ALTURA_MAX = 230;
export const CINTURA_MIN = 40;
export const CINTURA_MAX = 200;

export type FaixaId = "abaixo" | "saudavel" | "aumentada" | "alta";

export interface Faixa {
  id: FaixaId;
  nome: string;
  intervalo: string;
  texto: string;
  cor: string;
}

export const FAIXAS: Faixa[] = [
  { id: "abaixo", nome: "Abaixo da tabela", intervalo: "menos de 0,40", cor: "#9ca3af", texto: "A NICE não define faixa abaixo de 0,40. Um número baixo não é, sozinho, sinal de saúde nem de problema: vale olhar alimentação, energia e desempenho." },
  { id: "saudavel", nome: "Saudável", intervalo: "0,40 a 0,49", cor: "#22c55e", texto: "Sua cintura está abaixo da metade da altura, a faixa que a NICE chama de adiposidade central saudável." },
  { id: "aumentada", nome: "Aumentada", intervalo: "0,50 a 0,59", cor: "#eab308", texto: "Sua cintura passou da metade da altura. Pela NICE, é adiposidade central aumentada, ligada a mais risco de diabetes tipo 2, pressão alta e doença cardiovascular." },
  { id: "alta", nome: "Alta", intervalo: "0,60 ou mais", cor: "#ef4444", texto: "Pela NICE, é adiposidade central alta, com risco ainda maior. Vale conversar com um médico e ter acompanhamento para reduzir a cintura com calma." },
];

export const parseNumero = (s: string): number | null => {
  const n = Number(s.replace(",", ".").trim());
  return s.trim() && Number.isFinite(n) ? n : null;
};

export const rca = (cinturaCm: number, alturaCm: number) => cinturaCm / alturaCm;

export function faixa(r: number): Faixa {
  const v = Math.round(r * 100) / 100;
  if (v < 0.4) return FAIXAS[0];
  if (v < 0.5) return FAIXAS[1];
  if (v < 0.6) return FAIXAS[2];
  return FAIXAS[3];
}

/** A cintura que dá RCA 0,5 — a "metade da altura". */
export const cinturaMetade = (alturaCm: number) => alturaCm / 2;

export const fmt2 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const fmt1 = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

export const ALTURAS_TABELA = [150, 155, 160, 165, 170, 175, 180, 185, 190] as const;

export const tabela = () =>
  ALTURAS_TABELA.map((a) => ({ altura: a, saudavelAte: Math.ceil(a * 0.5) - 1, aumentadaAte: Math.ceil(a * 0.6) - 1, alta: Math.ceil(a * 0.6) }));

export const NOTA_LIMITES =
  "A RCA é triagem, não diagnóstico. Não vale para gestantes, e a NICE indica as faixas para adultos com IMC abaixo de 35. Para crianças e adolescentes, o uso é outro e precisa de avaliação profissional.";
