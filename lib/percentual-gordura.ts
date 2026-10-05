/**
 * O motor da Calculadora de Percentual de Gordura.
 *
 * A Calculadora de Composição Corporal parte de um percentual que a pessoa
 * já tem (bioimpedância). Esta é para quem não tem: estima o percentual
 * pela fita métrica ou pelo adipômetro, e as faixas de leitura são as
 * MESMAS da composição (lib/composicao.ts), para o site não dar duas
 * respostas diferentes ao mesmo número.
 *
 * FITA — Marinha americana (Hodgdon e Beckett, Naval Health Research
 * Center, 1984), versão em centímetros:
 *   homem:  495 / (1,0324 − 0,19077·log10(cintura − pescoço) + 0,15456·log10(altura)) − 450
 *   mulher: 495 / (1,29579 − 0,35004·log10(cintura + quadril − pescoço) + 0,22100·log10(altura)) − 450
 * Erro típico de 3 a 4 pontos percentuais.
 *
 * DOBRAS — Jackson e Pollock (1978 homens, 1980 mulheres) dão a densidade
 * corporal; Siri (1961) converte: % = 495 / densidade − 450.
 *   3 dobras homem (peitoral, abdominal, coxa):
 *     D = 1,10938 − 0,0008267·S + 0,0000016·S² − 0,0002574·idade
 *   3 dobras mulher (tríceps, suprailíaca, coxa):
 *     D = 1,0994921 − 0,0009929·S + 0,0000023·S² − 0,0001392·idade
 *   7 dobras (peitoral, axilar média, tríceps, subescapular, abdominal,
 *   suprailíaca, coxa):
 *     homem:  D = 1,112 − 0,00043499·S + 0,00000055·S² − 0,00028826·idade
 *     mulher: D = 1,097 − 0,00046971·S + 0,00000056·S² − 0,00012828·idade
 * Conferidas em duas fontes independentes em 05/10/2026.
 */

import { faixaDe, FAIXAS, type Sexo } from "./composicao";

export { faixaDe, FAIXAS, type Sexo };

export const FONTES_GORDURA = [
  { rotulo: "Hodgdon JA, Beckett MB. Prediction of percent body fat for U.S. Navy men and women from body circumferences and height. Naval Health Research Center, 1984", url: "https://apps.dtic.mil/sti/citations/ADA143890" },
  { rotulo: "Jackson AS, Pollock ML. Generalized equations for predicting body density of men. British Journal of Nutrition, 1978", url: "https://pubmed.ncbi.nlm.nih.gov/718832/" },
  { rotulo: "Jackson AS, Pollock ML, Ward A. Generalized equations for predicting body density of women. Medicine & Science in Sports & Exercise, 1980", url: "https://pubmed.ncbi.nlm.nih.gov/7402053/" },
];

export type Metodo = "fita" | "dobras3" | "dobras7";

export const siri = (densidade: number) => 495 / densidade - 450;

export function marinha(sexo: Sexo, alturaCm: number, pescocoCm: number, cinturaCm: number, quadrilCm: number | null): number | null {
  if (sexo === "homem") {
    const d = cinturaCm - pescocoCm;
    if (d <= 0) return null;
    return 495 / (1.0324 - 0.19077 * Math.log10(d) + 0.15456 * Math.log10(alturaCm)) - 450;
  }
  if (quadrilCm === null) return null;
  const d = cinturaCm + quadrilCm - pescocoCm;
  if (d <= 0) return null;
  return 495 / (1.29579 - 0.35004 * Math.log10(d) + 0.221 * Math.log10(alturaCm)) - 450;
}

export function dobras3(sexo: Sexo, soma: number, idade: number): number {
  const d = sexo === "homem"
    ? 1.10938 - 0.0008267 * soma + 0.0000016 * soma ** 2 - 0.0002574 * idade
    : 1.0994921 - 0.0009929 * soma + 0.0000023 * soma ** 2 - 0.0001392 * idade;
  return siri(d);
}

export function dobras7(sexo: Sexo, soma: number, idade: number): number {
  const d = sexo === "homem"
    ? 1.112 - 0.00043499 * soma + 0.00000055 * soma ** 2 - 0.00028826 * idade
    : 1.097 - 0.00046971 * soma + 0.00000056 * soma ** 2 - 0.00012828 * idade;
  return siri(d);
}

export const SITIOS_3: Record<Sexo, string[]> = {
  homem: ["Peitoral", "Abdominal", "Coxa"],
  mulher: ["Tríceps", "Suprailíaca", "Coxa"],
};
export const SITIOS_7 = ["Peitoral", "Axilar média", "Tríceps", "Subescapular", "Abdominal", "Suprailíaca", "Coxa"];

/** Fora disso a conta saiu de medida errada, não de corpo real. */
export const RESULTADO_MIN = 2;
export const RESULTADO_MAX = 60;

export const parseNumero = (s: string): number | null => {
  const n = Number(s.replace(",", ".").trim());
  return s.trim() && Number.isFinite(n) ? n : null;
};

export const fmt1 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
