"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { formataNumero } from "@/lib/alimentos/escala";
import type { AlimentoLeve } from "@/lib/alimentos/indice";
import type { Categoria, Unidade } from "@/lib/alimentos/tipos";

/**
 * Descoberta: "o que você quer descobrir?"
 *
 * A busca atende quem já sabe o nome do alimento. Esta seção atende a outra
 * pessoa — a que quer saber o que TEM mais proteína, sem ter um candidato em
 * mente. São intenções diferentes e a ferramenta precisava das duas.
 *
 * O PERIGO DE UM RANKING
 *
 * Ordenar por nutriente por 100 g é matematicamente trivial e
 * editorialmente traiçoeiro. Alimento seco sobe no topo de qualquer lista
 * porque tem menos água, não porque seja melhor: farinha de soja lidera
 * "mais proteína" e ninguém come 100 g de farinha de soja de colher.
 *
 * Três decisões contêm isso, e nenhuma é enfeite:
 *
 * 1. O teor de água aparece na linha do alimento, sempre. É o dado que
 *    explica a posição, e escondê-lo seria deixar o ranking mentir sozinho.
 * 2. A lista nunca diz "melhor" nem "pior" — diz o que contém mais NESTA
 *    comparação, que é a única afirmação que os números sustentam.
 * 3. Alimento sem o nutriente medido some da lista em vez de ir para o fim.
 *    Ordenar ausência como se fosse zero afirmaria que ele não tem o
 *    nutriente, e a fonte não afirmou isso.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

interface Criterio {
  id: string;
  rotulo: string;
  /** Índice em AlimentoLeve.v */
  i: number;
  unidade: Unidade;
  /** Maior primeiro? "Menos calorias" é o único que inverte. */
  desc: boolean;
}

const CRITERIOS: Criterio[] = [
  { id: "proteina", rotulo: "Mais proteína", i: 1, unidade: "g", desc: true },
  { id: "fibra", rotulo: "Mais fibras", i: 4, unidade: "g", desc: true },
  { id: "menos-kcal", rotulo: "Menos calorias", i: 0, unidade: "kcal", desc: false },
  { id: "ferro", rotulo: "Mais ferro", i: 5, unidade: "mg", desc: true },
  { id: "potassio", rotulo: "Mais potássio", i: 6, unidade: "mg", desc: true },
  { id: "carboidrato", rotulo: "Mais carboidrato", i: 2, unidade: "g", desc: true },
];

/* O seletor não oferece o que o ranking exclui — ver FORA_DO_RANKING. */
const CATEGORIAS: { id: Categoria | "todas"; rotulo: string }[] = [
  { id: "todas", rotulo: "Todas" },
  { id: "carnes-e-derivados", rotulo: "Carnes" },
  { id: "pescados-e-frutos-do-mar", rotulo: "Peixes" },
  { id: "ovos-e-derivados", rotulo: "Ovos" },
  { id: "leite-e-derivados", rotulo: "Laticínios" },
  { id: "leguminosas-e-derivados", rotulo: "Leguminosas" },
  { id: "verduras-hortalicas-e-derivados", rotulo: "Verduras" },
  { id: "frutas-e-derivados", rotulo: "Frutas" },
  { id: "cereais-e-derivados", rotulo: "Cereais" },
];

/**
 * Grupos que ficam fora do ranking, e o motivo.
 *
 * Comparar por 100 g só diz alguma coisa quando o alimento é comido por
 * peso. Bebidas a 100 g são majoritariamente água — "menos calorias"
 * devolvia três chás em infusão, tecnicamente correto e completamente
 * inútil. Miscelâneas são condimentos e preparações: café em pó liderava
 * "mais fibras", e ninguém come 100 g de café em pó.
 *
 * A exclusão não é escondida — a tela diz que eles ficam de fora e por quê.
 * Filtro invisível é o tipo de coisa que faz a pessoa desconfiar do resto
 * quando descobre.
 */
const FORA_DO_RANKING: Categoria[] = ["bebidas", "miscelaneas"];

const QUANTOS = 10;
/** Acima disso o alimento é seco o bastante para a ressalva valer a pena. */
const AGUA_BAIXA = 20;

export default function Descoberta({ alimentos }: { alimentos: AlimentoLeve[] }) {
  const [criterioId, setCriterioId] = useState(CRITERIOS[0].id);
  const [categoria, setCategoria] = useState<Categoria | "todas">("todas");

  const criterio = CRITERIOS.find((c) => c.id === criterioId)!;

  const lista = useMemo(() => {
    const candidatos = alimentos.filter((a) => {
      if (FORA_DO_RANKING.includes(a.c)) return false;
      if (categoria !== "todas" && a.c !== categoria) return false;
      /* Sem o nutriente medido, fora da lista — nunca no fim como se fosse zero. */
      return a.v[criterio.i] !== null;
    });
    candidatos.sort((x, y) => {
      const vx = x.v[criterio.i]!;
      const vy = y.v[criterio.i]!;
      return criterio.desc ? vy - vx : vx - vy;
    });
    return candidatos.slice(0, QUANTOS);
  }, [alimentos, criterio, categoria]);

  const temSeco = lista.some((a) => a.u !== null && a.u < AGUA_BAIXA);

  const chip = (ativo: boolean) =>
    `px-4 py-2.5 text-sm border transition-colors min-h-[44px] ${
      ativo ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/40"
    }`;

  return (
    <div className="bg-[#0d0d0d] border border-white/10 p-5 sm:p-8">
      <h2 className="text-white font-bold text-xl mb-4" style={h}>
        O que você quer descobrir?
      </h2>

      <div className="flex flex-wrap gap-2 mb-5">
        {CRITERIOS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setCriterioId(c.id);
              trackEvent("food_discover_sort", { placement: "pagina-alimentos", criterio: c.id });
            }}
            aria-pressed={criterioId === c.id}
            className={chip(criterioId === c.id)}
          >
            {c.rotulo}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label htmlFor="cat-descoberta" className="block text-gray-400 text-xs mb-2">
          Categoria
        </label>
        <select
          id="cat-descoberta"
          value={categoria}
          onChange={(e) => {
            setCategoria(e.target.value as Categoria | "todas");
            trackEvent("food_discover_filter", { placement: "pagina-alimentos" });
          }}
          className="bg-black border border-white/25 text-white px-4 py-3 min-h-[48px] w-full sm:w-auto focus:border-[#BA9E50] focus-visible:outline-none"
        >
          {CATEGORIAS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.rotulo}
            </option>
          ))}
        </select>
      </div>

      <ol className="divide-y divide-white/10 border-y border-white/10" aria-live="polite">
        {lista.map((a, i) => (
          <li key={a.s} className="flex items-baseline justify-between gap-3 py-3">
            <span className="text-gray-300">
              <span className="text-gray-600 tabular-nums mr-2">{i + 1}.</span>
              {a.i ? (
                <Link
                  href={`/alimentos/${a.s}`}
                  onClick={() => trackEvent("food_result_open", { placement: "descoberta" })}
                  className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                >
                  {a.n}
                </Link>
              ) : (
                a.n
              )}
              {a.u !== null && a.u < AGUA_BAIXA && (
                <span className="block text-gray-500 text-xs mt-0.5 ml-6">
                  alimento seco — {formataNumero(a.u, "g")}% de água
                </span>
              )}
            </span>
            <span className="text-white font-bold tabular-nums whitespace-nowrap">
              {formataNumero(a.v[criterio.i]!, criterio.unidade)} {criterio.unidade}
            </span>
          </li>
        ))}
        {lista.length === 0 && (
          <li className="py-6 text-gray-400">
            Nenhum alimento desta categoria tem esse nutriente medido na base.
          </li>
        )}
      </ol>

      <p className="text-gray-500 text-sm leading-relaxed mt-4">
        Valores por 100 g. A lista mostra o que <strong className="text-gray-300">contém mais nesta comparação</strong>
        {" "}— não o que é melhor: isso depende do resto do seu dia, e não de uma posição. Bebidas e condimentos ficam
        de fora, porque comparar 100 g só diz alguma coisa quando o alimento é comido por peso.
      </p>

      {temSeco && (
        <p className="text-gray-400 text-sm leading-relaxed mt-3 border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>
          Alimento seco aparece no topo porque tem pouca água, e não porque seja mais nutritivo: 100 g dele
          correspondem a uma porção bem maior de comida do que 100 g de um alimento cozido. Por isso o teor de água
          aparece ao lado.
        </p>
      )}
    </div>
  );
}
