/**
 * Previsor de tempo da São Silvestre (15 km).
 *
 * A conta tem três partes, e cada uma diz de onde vem:
 *
 *   1. Riegel (1981): T2 = T1 × (D2 / D1)^1,06. É a fórmula padrão de
 *      equivalência entre distâncias, usada pelas calculadoras de prova do
 *      mundo inteiro. Funciona bem entre 5 km e a meia; fora disso, erra.
 *   2. Margem do percurso: a São Silvestre não é plana (a subida da
 *      Brigadeiro Luís Antônio fica na reta final) e a largada do pelotão
 *      geral é congestionada. Não existe coeficiente publicado para isso,
 *      então a margem é uma FAIXA declarada como estimativa nossa — de 2% a
 *      6% acima do tempo plano — e a página diz isso com essas palavras.
 *   3. Cenários até a prova: o previsor não promete melhora. Mostra o tempo
 *      "se você mantiver o nível de hoje" e duas hipóteses explícitas
 *      ("se melhorar 3%", "se melhorar 6%"), sempre como SE.
 *
 * Tudo roda no navegador. O analytics recebe a distância de referência e a
 * faixa de resultado, nunca o tempo digitado.
 */

import { formataPace, formataRelogio } from "./corrida";

export const DISTANCIA_PROVA_KM = 15;
export const EXPOENTE_RIEGEL = 1.06;
/** Margem do percurso (subida e largada cheia): estimativa nossa, em faixa. */
export const MARGEM_PERCURSO = { min: 0.02, max: 0.06 } as const;
/** 101ª edição: quinta-feira, 31/12/2026, largada do pelotão geral às 8h10 (horário de 2025, a confirmar). */
export const DATA_PROVA = "2026-12-31T08:10:00-03:00";
export const URL_PREVISOR = "/ferramentas/previsor-sao-silvestre";

export const REFERENCIAS = [
  { id: "5k", km: 5, rotulo: "5 km" },
  { id: "10k", km: 10, rotulo: "10 km" },
  { id: "21k", km: 21.0975, rotulo: "Meia maratona" },
] as const;
export type ReferenciaId = (typeof REFERENCIAS)[number]["id"];

export const CENARIOS = [
  { id: "manter", ganho: 0, rotulo: "Se você mantiver o nível de hoje" },
  { id: "moderado", ganho: 0.03, rotulo: "Se melhorar 3% até a prova" },
  { id: "bom", ganho: 0.06, rotulo: "Se melhorar 6% até a prova" },
] as const;

/** Limites de sanidade do tempo de referência, em segundos por km. */
const PACE_MIN = 150; // 2:30/km — ritmo de elite mundial
const PACE_MAX = 720; // 12:00/km — abaixo disso é caminhada

export interface Faixa { min: number; max: number }
export interface Previsao {
  planoSeg: number;
  faixa: Faixa;
  paceFaixa: Faixa;
  cenarios: { id: string; rotulo: string; faixa: Faixa }[];
  nivel: NivelId;
}

export function riegel(tempoSeg: number, deKm: number, paraKm: number): number {
  return tempoSeg * Math.pow(paraKm / deKm, EXPOENTE_RIEGEL);
}

/** "25:30" ou "1:05:30" → segundos; null se não for um tempo válido. */
export function lerTempo(txt: string): number | null {
  const partes = txt.trim().split(":").map((p) => p.trim());
  if (partes.length < 2 || partes.length > 3 || partes.some((p) => !/^\d{1,3}$/.test(p))) return null;
  const n = partes.map(Number);
  if (n.slice(1).some((x) => x >= 60)) return null;
  const seg = n.length === 3 ? n[0] * 3600 + n[1] * 60 + n[2] : n[0] * 60 + n[1];
  return seg > 0 ? seg : null;
}

export function validaReferencia(tempoSeg: number, km: number): string | null {
  const pace = tempoSeg / km;
  if (pace < PACE_MIN) return "Esse tempo é mais rápido que o recorde mundial. Confira se digitou minutos e segundos no lugar certo.";
  if (pace > PACE_MAX) return "Nesse ritmo a prova vira caminhada, e a fórmula deixa de valer. Veja o guia para quem está começando.";
  return null;
}

export const NIVEIS = [
  { id: "elite", ate: 55 * 60, rotulo: "Ritmo de pelotão de elite" },
  { id: "forte", ate: 70 * 60, rotulo: "Corredor forte" },
  { id: "regular", ate: 90 * 60, rotulo: "Corredor regular" },
  { id: "iniciante", ate: 120 * 60, rotulo: "Primeiros 15 km" },
  { id: "caminhada", ate: Infinity, rotulo: "Corrida com caminhada" },
] as const;
export type NivelId = (typeof NIVEIS)[number]["id"];

export function nivel(seg: number): NivelId {
  return NIVEIS.find((n) => seg < n.ate)!.id;
}

const comMargem = (plano: number): Faixa => ({ min: plano * (1 + MARGEM_PERCURSO.min), max: plano * (1 + MARGEM_PERCURSO.max) });

export function prever(tempoSeg: number, referencia: ReferenciaId): Previsao {
  const ref = REFERENCIAS.find((r) => r.id === referencia)!;
  const plano = riegel(tempoSeg, ref.km, DISTANCIA_PROVA_KM);
  const faixa = comMargem(plano);
  return {
    planoSeg: plano,
    faixa,
    paceFaixa: { min: faixa.min / DISTANCIA_PROVA_KM, max: faixa.max / DISTANCIA_PROVA_KM },
    cenarios: CENARIOS.map((c) => ({ id: c.id, rotulo: c.rotulo, faixa: comMargem(plano * (1 - c.ganho)) })),
    nivel: nivel((faixa.min + faixa.max) / 2),
  };
}

/** Semanas inteiras entre `agora` e a largada; 0 se já passou. */
export function semanasAteAProva(agora: number): number {
  return Math.max(0, Math.floor((Date.parse(DATA_PROVA) - agora) / (7 * 24 * 3600 * 1000)));
}

export const fmtFaixa = (f: Faixa) => `${formataRelogio(f.min)} a ${formataRelogio(f.max)}`;
export const fmtPaceFaixa = (f: Faixa) => `${formataPace(f.min)} a ${formataPace(f.max)}/km`;
export { formataPace, formataRelogio };

/** Artigos que apontam para o previsor (variante de LINK, teto de oito). */
export const ARTIGOS_COM_LINK_PREVISOR_SS: string[] = [
  "inscricao-sao-silvestre-2026",
];
