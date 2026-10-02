/**
 * Estimativa de calorias e macros por porção das receitas do Mata a Vontade.
 *
 * Valores por 100 g: TACO (NEPA-UNICAMP, 4ª ed.) sempre que o alimento existe
 * lá; o que a TACO não tem (ou está "em reavaliação", como o leite fluido)
 * vem da USDA FoodData Central (SR Legacy) ou do rótulo do fabricante. Whey:
 * rótulo de um concentrado ~80% (Growth: 30 g = 123 kcal, 23 g P, 2,9 g C,
 * 2,2 g G). Gramaturas por receita são medidas caseiras aproximadas e
 * opcionais não entram na conta. É estimativa: varia com marca e quantidade.
 */
import type { Receita } from "./receitas";

type N = { kcal: number; p: number; c: number; g: number };

export const NUTRI: Record<string, N> = {
  ovo: { kcal: 143, p: 13.0, c: 1.6, g: 8.9 }, // TACO ovo de galinha inteiro cru
  clara: { kcal: 59, p: 13.4, c: 0, g: 0.1 }, // TACO clara cozida
  banana: { kcal: 98, p: 1.3, c: 26.0, g: 0.1 }, // TACO banana prata crua
  "banana-congelada": { kcal: 98, p: 1.3, c: 26.0, g: 0.1 },
  leite: { kcal: 61, p: 3.2, c: 4.8, g: 3.3 }, // USDA whole milk 3,25% (TACO em reavaliação)
  "leite-po": { kcal: 497, p: 25.4, c: 39.2, g: 26.9 }, // TACO leite em pó integral
  iogurte: { kcal: 51, p: 4.1, c: 1.9, g: 3.0 }, // TACO iogurte natural
  "iogurte-grego": { kcal: 56, p: 10.3, c: 3.4, g: 0.1 }, // rótulo iogurte proteico natural (YoPRO)
  cottage: { kcal: 81, p: 10.5, c: 4.8, g: 2.3 }, // USDA cottage 2%
  "cream-cheese": { kcal: 342, p: 5.9, c: 4.1, g: 34.2 }, // USDA cream cheese
  whey: { kcal: 410, p: 76.7, c: 9.7, g: 7.3 }, // rótulo concentrado ~80% (Growth)
  aveia: { kcal: 394, p: 13.9, c: 66.6, g: 8.5 }, // TACO aveia em flocos
  "farinha-trigo": { kcal: 360, p: 9.8, c: 75.1, g: 1.4 }, // TACO
  tapioca: { kcal: 331, p: 0.5, c: 81.1, g: 0.3 }, // TACO fécula de mandioca
  pao: { kcal: 266, p: 7.6, c: 50.6, g: 3.3 }, // USDA pão branco
  cacau: { kcal: 228, p: 19.6, c: 57.9, g: 13.7 }, // USDA cacau em pó sem açúcar
  choc70: { kcal: 598, p: 7.8, c: 45.9, g: 42.6 }, // USDA chocolate 70–85%
  "choc-leite": { kcal: 540, p: 7.2, c: 59.6, g: 30.3 }, // TACO
  cafe: { kcal: 353, p: 12.2, c: 75.4, g: 0.5 }, // USDA café solúvel
  canela: { kcal: 247, p: 4.0, c: 80.6, g: 1.2 }, // USDA
  baunilha: { kcal: 288, p: 0.1, c: 12.7, g: 0.1 }, // USDA extrato
  coco: { kcal: 660, p: 6.9, c: 23.7, g: 64.5 }, // USDA coco ralado sem açúcar
  "pasta-amendoim": { kcal: 588, p: 25.1, c: 19.6, g: 50.4 }, // USDA pasta integral
  amendoim: { kcal: 606, p: 22.5, c: 18.7, g: 54.0 }, // TACO amendoim torrado
  pacoca: { kcal: 487, p: 16.0, c: 52.4, g: 26.1 }, // TACO paçoca
  morango: { kcal: 30, p: 0.9, c: 6.8, g: 0.3 }, // TACO
  "frutas-vermelhas": { kcal: 51, p: 1.1, c: 12.0, g: 0.5 }, // USDA média framboesa/mirtilo/amora
  maca: { kcal: 56, p: 0.3, c: 15.2, g: 0 }, // TACO maçã fuji
  chia: { kcal: 486, p: 16.5, c: 42.1, g: 30.7 }, // USDA
  adocante: { kcal: 0, p: 0, c: 0, g: 0 }, // eritritol/sucralose
  acucar: { kcal: 387, p: 0.3, c: 99.5, g: 0 }, // TACO
  mel: { kcal: 309, p: 0, c: 84.0, g: 0 }, // TACO
  fermento: { kcal: 90, p: 0.5, c: 43.9, g: 0.1 }, // TACO
  "leite-condensado": { kcal: 313, p: 7.7, c: 57.0, g: 6.7 }, // TACO
  "doce-de-leite": { kcal: 306, p: 5.5, c: 59.5, g: 6.0 }, // TACO
  "creme-avela": { kcal: 539, p: 6.3, c: 57.5, g: 30.9 }, // rótulo creme de avelã
  granola: { kcal: 489, p: 13.7, c: 53.9, g: 24.3 }, // USDA
  gelo: { kcal: 0, p: 0, c: 0, g: 0 },
  agua: { kcal: 0, p: 0, c: 0, g: 0 },
  sal: { kcal: 0, p: 0, c: 0, g: 0 },
};

/** Gramas (ml ≈ g) de cada ingrediente obrigatório na receita inteira, e quantas porções rende. */
export const GRAMAS: Record<string, { porcoes: number; g: Record<string, number> }> = {
  "bolo-caneca-vulcao": { porcoes: 1, g: { ovo: 45, aveia: 20, whey: 15, cacau: 10, iogurte: 40, fermento: 2, choc70: 5 } },
  "bolo-chocolate-forma": { porcoes: 6, g: { ovo: 135, banana: 150, aveia: 80, cacau: 18, leite: 120, fermento: 12, whey: 60 } },
  "bolo-caneca-choc-sem-ovo": { porcoes: 1, g: { banana: 37, aveia: 25, whey: 15, cacau: 6, leite: 60, fermento: 2 } },
  "brownie-caneca": { porcoes: 1, g: { ovo: 45, "pasta-amendoim": 15, cacau: 15, whey: 15, banana: 30 } },
  "brownie-air-fryer": { porcoes: 4, g: { ovo: 90, banana: 75, cacau: 18, "pasta-amendoim": 30, choc70: 30, whey: 30 } },
  "brownie-travessa": { porcoes: 8, g: { ovo: 135, banana: 150, aveia: 60, cacau: 45, choc70: 60, whey: 60 } },
  "brigadeiro-colher-proteico": { porcoes: 1, g: { whey: 30, cacau: 10, "leite-po": 15, leite: 45 } },
  "brigadeiro-panela-medida": { porcoes: 1, g: { "leite-condensado": 40, cacau: 2, whey: 15, leite: 15 } },
  "brigadeiro-banana-cacau": { porcoes: 1, g: { banana: 75, cacau: 6, whey: 20 } },
  "quadradinhos-morango": { porcoes: 1, g: { choc70: 20, morango: 100, "iogurte-grego": 120 } },
  "morango-chocolate-derretido": { porcoes: 1, g: { choc70: 25, morango: 120, "iogurte-grego": 120 } },
  "chocolate-quente-cremoso": { porcoes: 1, g: { leite: 200, cacau: 6, "leite-po": 10, whey: 20 } },
  "colher-nutella-fruta": { porcoes: 1, g: { "creme-avela": 15, "iogurte-grego": 120, morango: 100 } },
  "creme-cacau-amendoim": { porcoes: 1, g: { "pasta-amendoim": 15, cacau: 2, whey: 15 } },
  "torrada-nutella-banana": { porcoes: 1, g: { pao: 25, "creme-avela": 15, cottage: 60, banana: 37 } },
  "cookie-air-fryer": { porcoes: 1, g: { aveia: 30, whey: 15, "pasta-amendoim": 15, clara: 33, choc70: 10, fermento: 1 } },
  "cookie-aveia-banana": { porcoes: 10, g: { banana: 150, aveia: 80, whey: 30, canela: 2 } },
  "cookie-caneca": { porcoes: 1, g: { aveia: 25, whey: 15, "pasta-amendoim": 10, leite: 30, choc70: 10 } },
  "nice-cream-chocolate": { porcoes: 1, g: { "banana-congelada": 150, cacau: 10, whey: 20, leite: 40 } },
  "sorvete-morango-iogurte": { porcoes: 1, g: { "frutas-vermelhas": 140, "iogurte-grego": 100 } },
  "picole-iogurte": { porcoes: 3, g: { "iogurte-grego": 240, morango: 100, mel: 7 } },
  "mousse-iogurte-grego": { porcoes: 1, g: { "iogurte-grego": 150, whey: 15, cacau: 5 } },
  "mousse-cottage-cacau": { porcoes: 1, g: { cottage: 150, cacau: 6, whey: 15 } },
  "mousse-morango": { porcoes: 1, g: { "iogurte-grego": 150, morango: 100 } },
  "pudim-caneca": { porcoes: 1, g: { ovo: 45, leite: 150, "leite-po": 15, acucar: 4 } },
  "pudim-chia-baunilha": { porcoes: 1, g: { chia: 20, leite: 150, whey: 15, baunilha: 1 } },
  "creme-doce-de-leite": { porcoes: 1, g: { "iogurte-grego": 150, whey: 15 } },
  "doce-de-leite-fruta": { porcoes: 1, g: { "doce-de-leite": 20, "iogurte-grego": 120, maca: 75 } },
  "pacoca-colher": { porcoes: 1, g: { "pasta-amendoim": 15, "leite-po": 15, whey: 15 } },
  "pacoca-original-iogurte": { porcoes: 1, g: { pacoca: 20, "iogurte-grego": 120 } },
  "bombom-pacoca": { porcoes: 2, g: { amendoim: 30, "leite-po": 20, choc70: 30, whey: 20 } },
  "churros-air-fryer": { porcoes: 1, g: { tapioca: 40, canela: 1, acucar: 4, "doce-de-leite": 20, whey: 15, leite: 20 } },
  "banana-churros": { porcoes: 1, g: { banana: 75, canela: 1, "iogurte-grego": 30, whey: 15 } },
  "cheesecake-pote": { porcoes: 1, g: { "iogurte-grego": 120, "cream-cheese": 20, baunilha: 1, aveia: 20, "frutas-vermelhas": 50 } },
  "cheesecake-caneca": { porcoes: 1, g: { "cream-cheese": 40, "iogurte-grego": 60, ovo: 45, baunilha: 1 } },
  "milkshake-proteico": { porcoes: 1, g: { leite: 200, whey: 30, "banana-congelada": 75 } },
  "milkshake-morango": { porcoes: 1, g: { leite: 200, "frutas-vermelhas": 140, "leite-po": 10, whey: 20 } },
  "frappe-cafe": { porcoes: 1, g: { leite: 150, cafe: 2, whey: 20 } },
  "bolo-caneca-baunilha": { porcoes: 1, g: { ovo: 45, aveia: 20, whey: 15, banana: 30, fermento: 2 } },
  "bolo-caneca-banana-canela": { porcoes: 1, g: { ovo: 45, banana: 37, aveia: 28, canela: 1, fermento: 2, whey: 15 } },
};

export type Macros = { kcal: number; p: number; c: number; g: number; porcoes: number };

/** Por porção, arredondado. null se a receita não tem gramatura cadastrada. */
export function macrosDe(r: Receita): Macros | null {
  const m = GRAMAS[r.id];
  if (!m) return null;
  const t = { kcal: 0, p: 0, c: 0, g: 0 };
  for (const [id, gramas] of Object.entries(m.g)) {
    const n = NUTRI[id];
    if (!n) return null;
    t.kcal += (n.kcal * gramas) / 100; t.p += (n.p * gramas) / 100; t.c += (n.c * gramas) / 100; t.g += (n.g * gramas) / 100;
  }
  const d = m.porcoes;
  return { kcal: Math.round(t.kcal / d / 5) * 5, p: Math.round(t.p / d), c: Math.round(t.c / d), g: Math.round(t.g / d), porcoes: d };
}
