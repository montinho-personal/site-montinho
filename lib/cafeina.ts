/**
 * O motor da Calculadora de Cafeína.
 *
 * LIMITES — EFSA, parecer científico de 2015:
 *   adultos: até 400 mg por dia e até 200 mg numa dose única (inclusive
 *   menos de 2 horas antes de exercício intenso);
 *   gestantes e lactantes: até 200 mg por dia;
 *   crianças e adolescentes: até 3 mg por kg por dia.
 *
 * TEOR DAS BEBIDAS — a tabela do mesmo parecer da EFSA (café filtrado
 * 200 ml 90 mg, expresso 60 ml 80 mg, energético 250 ml 80 mg, chá 220 ml
 * 50 mg, cola 355 ml 40 mg, chocolate amargo 50 g 25 mg). É média: o café
 * real varia muito com o pó e o preparo.
 *
 * TREINO — ISSN 2021 (Guest et al.): 3 a 6 mg/kg, em geral 60 minutos
 * antes; a dose mínima eficaz pode ser de 2 mg/kg; 9 mg/kg ou mais traz
 * muito efeito colateral sem ganho.
 *
 * SONO — Gardiner et al. 2023 (Sleep Medicine Reviews, 24 estudos): para
 * não perder tempo de sono, café (107 mg) pelo menos 8,8 h antes de deitar
 * e uma dose padrão de pré-treino (217,5 mg) pelo menos 13,2 h antes.
 */

export const FONTES_CAFEINA = [
  { rotulo: "EFSA Panel on Dietetic Products, Nutrition and Allergies. Scientific Opinion on the safety of caffeine. EFSA Journal, 2015", url: "https://www.efsa.europa.eu/en/topics/topic/caffeine" },
  { rotulo: "Guest NS et al. International Society of Sports Nutrition position stand: caffeine and exercise performance. JISSN, 2021", url: "https://pubmed.ncbi.nlm.nih.gov/33388079/" },
  { rotulo: "Gardiner C et al. The effect of caffeine on subsequent sleep: a systematic review and meta-analysis. Sleep Medicine Reviews, 2023", url: "https://eprints.leedsbeckett.ac.uk/id/eprint/9625/" },
];

export interface Fonte { id: string; nome: string; porcao: string; mg: number }

export const BEBIDAS: Fonte[] = [
  { id: "coado", nome: "Café coado / filtrado", porcao: "xícara de 200 ml", mg: 90 },
  { id: "expresso", nome: "Café expresso", porcao: "60 ml", mg: 80 },
  { id: "cha", nome: "Chá preto ou mate", porcao: "copo de 220 ml", mg: 50 },
  { id: "cola", nome: "Refrigerante de cola", porcao: "lata de 350 ml", mg: 40 },
  { id: "energetico", nome: "Energético", porcao: "lata de 250 ml", mg: 80 },
  { id: "chocolate", nome: "Chocolate amargo", porcao: "barra de 50 g", mg: 25 },
];

export type Perfil = "adulto" | "gestante" | "menor";

export const LIMITE_DIA_ADULTO = 400;
export const LIMITE_DIA_GESTANTE = 200;
export const LIMITE_DOSE_UNICA = 200;
export const LIMITE_MENOR_MG_KG = 3;

export function limiteDiario(perfil: Perfil, pesoKg: number): number {
  if (perfil === "gestante") return LIMITE_DIA_GESTANTE;
  if (perfil === "menor") return LIMITE_MENOR_MG_KG * pesoKg;
  return LIMITE_DIA_ADULTO;
}

export const doseTreino = (pesoKg: number) => ({ minima: 2 * pesoKg, de: 3 * pesoKg, ate: 6 * pesoKg, excessiva: 9 * pesoKg });

/** Horas antes de deitar (Gardiner 2023). */
export const HORAS_ANTES_CAFE = 8.8;
export const HORAS_ANTES_PRE_TREINO = 13.2;

/** "23:00" − 8,8 h → "14:12". */
export function horarioLimite(dormir: string, horasAntes: number): string | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(dormir.trim());
  if (!m) return null;
  const h = Number(m[1]), mi = Number(m[2]);
  if (h > 23 || mi > 59) return null;
  let tot = h * 60 + mi - Math.round(horasAntes * 60);
  tot = ((tot % 1440) + 1440) % 1440;
  return `${String(Math.floor(tot / 60)).padStart(2, "0")}:${String(tot % 60).padStart(2, "0")}`;
}

/** Arredonda para baixo, em múltiplos de 5 mg, para nunca exibir uma meta acima do limite. */
export const arred5 = (mg: number) => Math.floor(mg / 5) * 5;
export const fmtInt = (n: number) => Math.round(n).toLocaleString("pt-BR");
export const fmt1 = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
export const parseNumero = (s: string): number | null => {
  const n = Number(s.replace(",", ".").trim());
  return s.trim() && Number.isFinite(n) ? n : null;
};
