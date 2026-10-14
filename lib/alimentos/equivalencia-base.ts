/**
 * A ponte entre a base completa (servidor) e o motor de equivalência.
 *
 * Roda no build: transforma os 597 alimentos da TACO no formato enxuto que o
 * motor e o navegador precisam — macros por 100 g, medidas caseiras e
 * aliases. Valor não analisado vira null, nunca zero.
 */

import { todosAlimentos } from "./base";
import type { Alimento } from "./tipos";
import type { AlimentoEq } from "./equivalencia";

function v(a: Alimento, id: string): number | null {
  const n = a.nutrientes.find((x) => x.nutrienteId === id);
  return n && n.estado === "analisado" ? n.valorPor100g : null;
}

export function paraEq(a: Alimento): AlimentoEq {
  return {
    slug: a.slug,
    nome: a.nome,
    categoria: a.categoria,
    energia: v(a, "energia"),
    proteina: v(a, "proteina"),
    carboidrato: v(a, "carboidrato"),
    lipideos: v(a, "lipideos"),
    fibra: v(a, "fibra"),
    porcoes: a.porcoes.length ? a.porcoes.map((p) => ({ n: p.nome, g: p.gramas })) : undefined,
    aliases: a.aliases.length ? a.aliases : undefined,
  };
}

export function alimentosEq(): AlimentoEq[] {
  return todosAlimentos().map(paraEq);
}

export function baseEq(): Map<string, AlimentoEq> {
  return new Map(alimentosEq().map((a) => [a.slug, a]));
}
