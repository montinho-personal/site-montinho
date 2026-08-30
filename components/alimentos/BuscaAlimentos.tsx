"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { buscaAlimentos, montaIndice } from "@/lib/alimentos/busca";
import { GRAMAS_MAX, GRAMAS_PADRAO, formataNumero, leGramas } from "@/lib/alimentos/escala";
import { QTD_PRINCIPAIS, type AlimentoLeve } from "@/lib/alimentos/indice";
import type { Alimento } from "@/lib/alimentos/tipos";

/**
 * A busca de alimentos.
 *
 * A tela começa com uma pergunta e um campo. Nada de filtro, aba ou
 * explicação antes — quem chega aqui já sabe o que quer saber, e cada
 * elemento a mais é um atraso na resposta.
 *
 * O resultado aparece embaixo do campo, com os cinco números e o seletor de
 * quantidade. Não navega, não abre modal: quem procurou "feijão" vê o feijão
 * na mesma tela em que digitou.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

const ROTULOS = ["Calorias", "Proteína", "Carboidratos", "Gorduras", "Fibras"];
const UNIDADES = ["kcal", "g", "g", "g", "g"] as const;

export default function BuscaAlimentos({
  alimentos,
  populares,
  placement,
}: {
  alimentos: AlimentoLeve[];
  populares: string[];
  placement: string;
}) {
  const [consulta, setConsulta] = useState("");
  const [escolhido, setEscolhido] = useState<AlimentoLeve | null>(null);
  const [gramasTexto, setGramasTexto] = useState(String(GRAMAS_PADRAO));
  const raiz = useRef<HTMLDivElement>(null);

  /**
   * O índice é montado uma vez. Sem isso, cada tecla remontaria a
   * normalização dos 597 alimentos e a busca engasgaria no celular.
   */
  const indice = useMemo(
    () =>
      montaIndice(
        alimentos.map(
          (a) =>
            ({
              id: a.s,
              slug: a.s,
              nome: a.n,
              categoria: a.c,
              aliases: a.a,
              preparo: "cru",
              nutrientes: [],
              porcoes: [],
              proveniencia: { fonte: "TACO", idNaFonte: "", descricaoOriginal: "", versao: "", verificadoEm: "" },
              indexavel: a.i,
            }) as Alimento,
        ),
      ),
    [alimentos],
  );

  const porSlug = useMemo(() => new Map(alimentos.map((a) => [a.s, a])), [alimentos]);

  const resultados = useMemo(() => {
    if (escolhido) return [];
    return buscaAlimentos(indice, consulta, { limite: 8 });
  }, [indice, consulta, escolhido]);

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("food_search_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const gramas = leGramas(gramasTexto);
  const gramasOk = gramas !== null;

  function escolhe(a: AlimentoLeve) {
    setEscolhido(a);
    setConsulta(a.n);
    setGramasTexto(String(GRAMAS_PADRAO));
    trackEvent("food_result_open", { placement });
  }

  function limpa() {
    setEscolhido(null);
    setConsulta("");
  }

  const campo =
    "w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white px-4 py-4 text-lg transition-colors min-h-[56px]";

  return (
    <div ref={raiz} data-testid="busca-alimentos" className="bg-[#0d0d0d] border border-white/10 p-5 sm:p-8">
      <label htmlFor={`busca-${placement}`} className="block text-white font-bold text-xl mb-4" style={h}>
        O que você quer pesquisar?
      </label>

      <div className="relative">
        <input
          id={`busca-${placement}`}
          type="search"
          role="combobox"
          aria-expanded={resultados.length > 0}
          aria-controls={`lista-${placement}`}
          aria-autocomplete="list"
          autoComplete="off"
          placeholder="feijão, arroz, frango, ovo…"
          value={consulta}
          onChange={(e) => {
            setConsulta(e.target.value);
            setEscolhido(null);
          }}
          className={campo}
        />
        {consulta !== "" && (
          <button
            type="button"
            onClick={limpa}
            aria-label="Limpar busca"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white px-3 py-2 min-h-[44px]"
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Sugestões ─────────────────────────────────────────────────── */}
      {!escolhido && consulta.trim() === "" && (
        <div className="mt-5">
          <p className="text-gray-500 text-sm mb-3">Alimentos populares</p>
          <div className="flex flex-wrap gap-2">
            {populares
              .map((s) => porSlug.get(s))
              .filter((a): a is AlimentoLeve => Boolean(a))
              .map((a) => (
                <button
                  key={a.s}
                  type="button"
                  onClick={() => escolhe(a)}
                  className="border border-white/20 text-gray-300 hover:border-white/50 px-3 py-2 text-sm min-h-[44px] transition-colors"
                >
                  {a.n.split(",")[0]}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* ── Resultados ────────────────────────────────────────────────── */}
      {!escolhido && consulta.trim() !== "" && (
        <ul id={`lista-${placement}`} role="listbox" className="mt-4 divide-y divide-white/10 border-t border-white/10">
          {resultados.map((r) => {
            const a = porSlug.get(r.alimento.slug)!;
            return (
              <li key={a.s} role="option" aria-selected={false}>
                <button
                  type="button"
                  onClick={() => escolhe(a)}
                  className="w-full text-left py-3.5 hover:bg-white/5 transition-colors min-h-[52px] px-2 -mx-2"
                >
                  <span className="block text-white">{a.n}</span>
                  <span className="block text-gray-500 text-sm mt-0.5">
                    {a.v[0] !== null ? `${formataNumero(a.v[0], "kcal")} kcal` : "—"} por 100 g
                  </span>
                </button>
              </li>
            );
          })}
          {resultados.length === 0 && (
            /**
             * O vazio honesto. A ferramenta não oferece o parecido: devolver
             * "farinha" para quem procurou "frango" faria a pessoa levar
             * embora o número errado achando que era o certo.
             */
            <li className="py-6">
              <p className="text-gray-300">Não encontramos esse alimento na base ainda.</p>
              <p className="text-gray-500 text-sm mt-2">
                A base tem {alimentos.length} alimentos da TACO. Tente outro nome — ou o alimento sem o preparo, como
                “feijão” em vez de “feijão da minha vó”.
              </p>
            </li>
          )}
        </ul>
      )}

      {/* ── O alimento escolhido ──────────────────────────────────────── */}
      {escolhido && (
        <div className="mt-6">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-5">
            <h2 className="text-white font-bold text-xl" style={h}>
              {escolhido.n}
            </h2>
            <button type="button" onClick={limpa} className="text-gray-400 hover:text-white text-sm underline underline-offset-4">
              trocar
            </button>
          </div>

          {/* Quantidade */}
          <div className="mb-6">
            <label htmlFor={`qtd-${placement}`} className="block text-gray-300 text-sm font-medium mb-2">
              Quantidade
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Diminuir 10 gramas"
                onClick={() => {
                  const g = Math.max(1, (gramas ?? GRAMAS_PADRAO) - 10);
                  setGramasTexto(String(g));
                  trackEvent("food_quantity_change", { placement });
                }}
                className="border border-white/25 text-white w-12 h-12 text-xl hover:border-white/50 transition-colors"
              >
                −
              </button>
              <div className="flex items-center gap-2 flex-1">
                <input
                  id={`qtd-${placement}`}
                  type="text"
                  inputMode="decimal"
                  value={gramasTexto}
                  onChange={(e) => setGramasTexto(e.target.value)}
                  aria-invalid={!gramasOk}
                  className="w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none text-white text-2xl font-bold px-4 py-2.5 text-center min-h-[48px]"
                />
                <span className="text-gray-400">g</span>
              </div>
              <button
                type="button"
                aria-label="Aumentar 10 gramas"
                onClick={() => {
                  const g = Math.min(GRAMAS_MAX, (gramas ?? GRAMAS_PADRAO) + 10);
                  setGramasTexto(String(g));
                  trackEvent("food_quantity_change", { placement });
                }}
                className="border border-white/25 text-white w-12 h-12 text-xl hover:border-white/50 transition-colors"
              >
                +
              </button>
            </div>
            {!gramasOk && (
              <p className="text-[#E8B4B4] text-sm mt-2">Informe uma quantidade entre 1 e {GRAMAS_MAX} g.</p>
            )}
          </div>

          {/* Os cinco números */}
          <div aria-live="polite" className="divide-y divide-white/10 border-y border-white/10">
            {/* Só os cinco do card: o índice leve carrega mais que isso. */}
            {escolhido.v.slice(0, QTD_PRINCIPAIS).map((valor, i) => (
              <div key={ROTULOS[i]} className="flex items-baseline justify-between py-3.5">
                <span className="text-gray-300">{ROTULOS[i]}</span>
                <span className="text-white text-lg font-bold tabular-nums">
                  {valor === null || !gramasOk
                    ? "—"
                    : `${formataNumero((valor * gramas!) / 100, UNIDADES[i])} ${UNIDADES[i]}`}
                </span>
              </div>
            ))}
          </div>

          <p className="text-gray-500 text-sm mt-4">
            Fonte: Tabela Brasileira de Composição de Alimentos — TACO, NEPA/UNICAMP.
          </p>

          {escolhido.i && (
            <Link
              href={`/alimentos/${escolhido.s}`}
              onClick={() => trackEvent("food_nutrients_expand", { placement })}
              className="inline-block mt-5 bg-white text-black px-6 py-3 text-[15px] font-semibold min-h-[48px]"
            >
              Ver tabela completa →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
