/**
 * O motor da Calculadora de Passos.
 *
 * Duas perguntas que as buscas fazem juntas: "quantos passos por dia eu
 * deveria dar?" e "quantas calorias esses passos queimam?".
 *
 * META POR IDADE — Paluch et al., Lancet Public Health 2022 (15 coortes):
 * o risco de morte cai até ~6.000–8.000 passos/dia em quem tem 60 anos ou
 * mais e ~8.000–10.000 em quem tem menos de 60, e depois estabiliza.
 * Ding et al., Lancet Public Health 2025: 7.000 passos/dia já trazem a maior
 * parte do benefício em relação a 2.000.
 *
 * CLASSIFICAÇÃO — Tudor-Locke et al. 2008: <5.000 sedentário; 5.000–7.499
 * pouco ativo; 7.500–9.999 algo ativo; 10.000–12.499 ativo; 12.500+ muito ativo.
 *
 * CALORIAS, TEMPO E KM — saem do motor da Calculadora de Calorias da
 * Caminhada (cadência por ritmo, MET do Compêndio), nunca de um valor
 * recopiado. Se a pessoa medir a própria passada, o km sai dela.
 */

import { dePassos, ritmo, RITMOS, type RitmoId } from "./caminhada";
import { KCAL_POR_KG_GORDURA, arredondaKcal, formataTempo, parseNumero } from "./polichinelo";

export { RITMOS, arredondaKcal, formataTempo, parseNumero, type RitmoId };

export const FONTE_PALUCH = {
  rotulo: "Paluch AE et al. Daily steps and all-cause mortality: a meta-analysis of 15 international cohorts. Lancet Public Health, 2022",
  url: "https://pubmed.ncbi.nlm.nih.gov/35247352/",
};
export const FONTE_DING = {
  rotulo: "Ding D et al. Daily steps and health outcomes in adults: a systematic review and dose-response meta-analysis. Lancet Public Health, 2025",
  url: "https://pubmed.ncbi.nlm.nih.gov/40713949/",
};
export const FONTE_TUDOR_LOCKE_2008 = {
  rotulo: "Tudor-Locke C et al. Revisiting \"how many steps are enough?\". Medicine & Science in Sports & Exercise, 2008",
  url: "https://pubmed.ncbi.nlm.nih.gov/18562971/",
};

export const PASSOS_MIN = 0;
export const PASSOS_MAX = 60000;
export const IDADE_MIN = 18;
export const IDADE_MAX = 100;
export const PESO_MIN = 30;
export const PESO_MAX = 250;
export const PASSADA_MIN = 30;
export const PASSADA_MAX = 120;

export interface Meta { min: number; max: number; rotulo: string }

export const meta = (idade: number): Meta =>
  idade >= 60 ? { min: 6000, max: 8000, rotulo: "60 anos ou mais" } : { min: 8000, max: 10000, rotulo: "menos de 60 anos" };

export interface Nivel { id: string; nome: string; faixa: string; cor: string }

export const NIVEIS: Nivel[] = [
  { id: "sedentario", nome: "Sedentário", faixa: "menos de 5.000", cor: "#ef4444" },
  { id: "pouco", nome: "Pouco ativo", faixa: "5.000 a 7.499", cor: "#f97316" },
  { id: "algo", nome: "Algo ativo", faixa: "7.500 a 9.999", cor: "#eab308" },
  { id: "ativo", nome: "Ativo", faixa: "10.000 a 12.499", cor: "#22c55e" },
  { id: "muito", nome: "Muito ativo", faixa: "12.500 ou mais", cor: "#16a34a" },
];

export function nivel(passos: number): Nivel {
  if (passos < 5000) return NIVEIS[0];
  if (passos < 7500) return NIVEIS[1];
  if (passos < 10000) return NIVEIS[2];
  if (passos < 12500) return NIVEIS[3];
  return NIVEIS[4];
}

export interface Gasto { passos: number; minutos: number; kcal: number; km: number }

/** Calorias, tempo e km dos passos, como se fossem caminhados seguidos no ritmo. */
export function gasto(passos: number, pesoKg: number, ritmoId: RitmoId, passadaCm?: number | null): Gasto {
  const r = ritmo(ritmoId);
  const g = dePassos(passos, pesoKg, r.velocidade, 0, r.cadencia);
  return { passos, minutos: g.minutos, kcal: g.kcal, km: passadaCm ? (passos * passadaCm) / 100000 : g.km };
}

/** Passos por km para uma passada medida. */
export const passosPorKm = (passadaCm: number) => 100000 / passadaCm;

export const diasParaUmQuilo = (kcalPorDia: number) => (kcalPorDia > 0 ? KCAL_POR_KG_GORDURA / kcalPorDia : 0);

export const fmtInt = (n: number) => Math.round(n).toLocaleString("pt-BR");
export const fmtKm = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
export const arredondaPassos = (n: number) => Math.round(n / 100) * 100;

export const PASSOS_TABELA = [1000, 2000, 5000, 6000, 7000, 8000, 10000, 12000, 15000, 20000] as const;
export const PESOS_TABELA = [60, 70, 80, 90, 100] as const;

export const tabelaCalorias = () =>
  PASSOS_TABELA.map((p) => ({ passos: p, kcal: PESOS_TABELA.map((kg) => arredondaKcal(gasto(p, kg, "moderado").kcal)), minutos: gasto(p, 70, "moderado").minutos }));

export const PASSADAS_TABELA = [60, 65, 70, 75, 80] as const;
