"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { buscaAlimentos, montaIndice } from "@/lib/alimentos/busca";
import { GRAMAS_MAX, GRAMAS_PADRAO, formataNumero, leGramas } from "@/lib/alimentos/escala";
import type { AlimentoLeve } from "@/lib/alimentos/indice";
import type { Alimento } from "@/lib/alimentos/tipos";

/**
 * Comparador de alimentos.
 *
 * A parte difícil aqui não é mostrar duas colunas — é impedir que a
 * comparação minta sem dizer nada de errado.
 *
 * Dois alimentos com teor de água muito diferente não são comparáveis por
 * 100 g de um jeito honesto. A aveia crua tem 394 kcal e o mingau de aveia
 * tem uma fração disso, e a diferença não é a comida: é a água. Quem olha a
 * tabela conclui que a aveia "engorda muito mais", quando na prática ninguém
 * come 100 g de aveia seca de colher.
 *
 * Por isso a umidade — que a TACO publica e quase nenhum site usa — vira um
 * aviso na tela quando a distância entre os dois é grande. É o dado
 * respondendo por si.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

const LINHAS = [
  { i: 0, rotulo: "Calorias", unidade: "kcal" as const },
  { i: 1, rotulo: "Proteína", unidade: "g" as const },
  { i: 2, rotulo: "Carboidratos", unidade: "g" as const },
  { i: 3, rotulo: "Gorduras", unidade: "g" as const },
  { i: 4, rotulo: "Fibras", unidade: "g" as const },
];

/**
 * A partir de quantos pontos de diferença de água a comparação merece
 * ressalva. Trinta pontos separa comida seca de comida cozida sem pegar
 * variação normal entre dois alimentos do mesmo tipo.
 */
const DIFERENCA_AGUA_RELEVANTE = 30;

function Seletor({
  titulo,
  indice,
  porSlug,
  escolhido,
  onEscolhe,
  id,
}: {
  titulo: string;
  indice: ReturnType<typeof montaIndice>;
  porSlug: Map<string, AlimentoLeve>;
  escolhido: AlimentoLeve | null;
  onEscolhe: (a: AlimentoLeve | null) => void;
  id: string;
}) {
  const [consulta, setConsulta] = useState("");
  const resultados = useMemo(
    () => (escolhido ? [] : buscaAlimentos(indice, consulta, { limite: 6 })),
    [indice, consulta, escolhido],
  );

  return (
    <div>
      <label htmlFor={id} className="block text-gray-300 text-sm font-medium mb-2">
        {titulo}
      </label>
      {escolhido ? (
        <div className="flex items-start justify-between gap-3 border border-white/25 px-4 py-3 min-h-[52px]">
          <span className="text-white">{escolhido.n}</span>
          <button
            type="button"
            onClick={() => { onEscolhe(null); setConsulta(""); }}
            className="text-gray-400 hover:text-white text-sm underline underline-offset-4 shrink-0"
          >
            trocar
          </button>
        </div>
      ) : (
        <>
          <input
            id={id}
            type="search"
            autoComplete="off"
            placeholder="digite um alimento"
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            className="w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white px-4 py-3 min-h-[52px] transition-colors"
          />
          {consulta.trim() !== "" && (
            <ul className="mt-2 divide-y divide-white/10 border-t border-white/10">
              {resultados.map((r) => {
                const a = porSlug.get(r.alimento.slug)!;
                return (
                  <li key={a.s}>
                    <button
                      type="button"
                      onClick={() => { onEscolhe(a); setConsulta(""); }}
                      className="w-full text-left py-3 hover:bg-white/5 transition-colors min-h-[48px] px-2 -mx-2 text-gray-200"
                    >
                      {a.n}
                    </button>
                  </li>
                );
              })}
              {resultados.length === 0 && (
                <li className="py-4 text-gray-400 text-sm">Não encontramos esse alimento na base ainda.</li>
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default function ComparadorAlimentos({
  alimentos,
  sugestoes,
}: {
  alimentos: AlimentoLeve[];
  /** Pares que valem a pena oferecer prontos. Curadoria, não aleatório. */
  sugestoes: [string, string][];
}) {
  const [a, setA] = useState<AlimentoLeve | null>(null);
  const [b, setB] = useState<AlimentoLeve | null>(null);
  const [gA, setGA] = useState(String(GRAMAS_PADRAO));
  const [gB, setGB] = useState(String(GRAMAS_PADRAO));

  const porSlug = useMemo(() => new Map(alimentos.map((x) => [x.s, x])), [alimentos]);
  const indice = useMemo(
    () =>
      montaIndice(
        alimentos.map(
          (x) =>
            ({
              id: x.s, slug: x.s, nome: x.n, categoria: x.c, aliases: x.a,
              preparo: "cru", nutrientes: [], porcoes: [],
              proveniencia: { fonte: "TACO", idNaFonte: "", descricaoOriginal: "", versao: "", verificadoEm: "" },
              indexavel: x.i,
            }) as Alimento,
        ),
      ),
    [alimentos],
  );

  const qA = leGramas(gA);
  const qB = leGramas(gB);
  const pronto = a && b && qA !== null && qB !== null;
  const mesmaQuantidade = qA === qB;

  /**
   * O aviso da água. Só aparece quando faz diferença, e diz o motivo em vez
   * de apenas alertar — "cuidado ao comparar" não ensina nada.
   */
  const aguaA = a?.u ?? null;
  const aguaB = b?.u ?? null;
  const diferencaDeAgua =
    aguaA !== null && aguaB !== null && Math.abs(aguaA - aguaB) >= DIFERENCA_AGUA_RELEVANTE;
  const maisSeco = diferencaDeAgua ? (aguaA! < aguaB! ? a : b) : null;

  function escolhe(qual: "a" | "b", v: AlimentoLeve | null) {
    (qual === "a" ? setA : setB)(v);
    if (v) trackEvent("food_compare_open", { placement: "comparador" });
  }

  return (
    <div className="bg-[#0d0d0d] border border-white/10 p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Seletor titulo="Primeiro alimento" id="cmp-a" indice={indice} porSlug={porSlug} escolhido={a} onEscolhe={(v) => escolhe("a", v)} />
        <Seletor titulo="Segundo alimento" id="cmp-b" indice={indice} porSlug={porSlug} escolhido={b} onEscolhe={(v) => escolhe("b", v)} />
      </div>

      {!a && !b && (
        <div className="mt-6">
          <p className="text-gray-500 text-sm mb-3">Comparações comuns</p>
          <div className="flex flex-wrap gap-2">
            {sugestoes.map(([sa, sb]) => {
              const x = porSlug.get(sa), y = porSlug.get(sb);
              if (!x || !y) return null;
              return (
                <button
                  key={`${sa}-${sb}`}
                  type="button"
                  onClick={() => { setA(x); setB(y); trackEvent("food_compare_open", { placement: "comparador" }); }}
                  className="border border-white/20 text-gray-300 hover:border-white/50 px-3 py-2 text-sm min-h-[44px] transition-colors"
                >
                  {x.n.split(",")[0]} × {y.n.split(",")[0]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {pronto && (
        <div className="mt-8">
          {/* Quantidades */}
          <div className="grid gap-4 sm:grid-cols-2 mb-6">
            {([["a", gA, setGA, a] as const, ["b", gB, setGB, b] as const]).map(([k, valor, set, alim]) => (
              <div key={k}>
                <label htmlFor={`qtd-${k}`} className="block text-gray-400 text-xs mb-1.5">
                  {alim!.n.split(",")[0]}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id={`qtd-${k}`}
                    type="text"
                    inputMode="decimal"
                    value={valor}
                    onChange={(e) => { set(e.target.value); trackEvent("food_quantity_change", { placement: "comparador" }); }}
                    className="w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none text-white text-xl font-bold px-3 py-2 text-center min-h-[48px]"
                  />
                  <span className="text-gray-400">g</span>
                </div>
              </div>
            ))}
          </div>

          {/*
            A ressalva da porção. Comparar 50 g de um com 200 g de outro é
            legítimo — mas o número grande não pode passar por "tem mais",
            quando o que ele tem é mais comida.
          */}
          {!mesmaQuantidade && (
            <p className="text-[#BA9E50] text-sm mb-5 border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>
              Atenção: as quantidades são diferentes ({qA} g contra {qB} g). Os números maiores refletem a porção
              maior, não necessariamente o alimento mais concentrado.
            </p>
          )}

          {diferencaDeAgua && maisSeco && (
            <p className="text-gray-300 text-sm mb-5 border border-white/15 p-4 leading-relaxed">
              <strong className="text-white">Esses dois têm muita diferença de água.</strong>{" "}
              {maisSeco.n.split(",")[0]} é bem mais seco, e por isso concentra mais nutrientes no mesmo peso. Isso não
              o torna “melhor” — significa que 100 g dele correspondem a uma porção bem maior de comida do que 100 g
              do outro.
            </p>
          )}

          {/* A tabela */}
          <div aria-live="polite" className="overflow-x-auto">
            <table className="w-full">
              <caption className="sr-only">
                Comparação entre {a!.n} e {b!.n}
              </caption>
              <thead>
                <tr className="border-b border-white/20">
                  <th scope="col" className="text-left text-gray-400 text-xs font-medium py-2 pr-3 w-[34%]"> </th>
                  <th scope="col" className="text-right text-white text-xs font-semibold py-2 px-2">
                    {a!.n.split(",")[0]}
                  </th>
                  <th scope="col" className="text-right text-white text-xs font-semibold py-2 pl-2">
                    {b!.n.split(",")[0]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {LINHAS.map((l) => {
                  const va = a!.v[l.i], vb = b!.v[l.i];
                  const ea = va === null ? null : (va * qA!) / 100;
                  const eb = vb === null ? null : (vb * qB!) / 100;
                  /* Destaque só quando os dois existem e há diferença real. */
                  const maiorA = ea !== null && eb !== null && ea > eb;
                  const maiorB = ea !== null && eb !== null && eb > ea;
                  return (
                    <tr key={l.rotulo}>
                      <th scope="row" className="text-left font-normal text-gray-300 py-3 pr-3">{l.rotulo}</th>
                      <td className={`text-right tabular-nums py-3 px-2 whitespace-nowrap ${maiorA ? "text-white font-bold" : "text-gray-400"}`}>
                        {ea === null ? "—" : `${formataNumero(ea, l.unidade)} ${l.unidade}`}
                      </td>
                      <td className={`text-right tabular-nums py-3 pl-2 whitespace-nowrap ${maiorB ? "text-white font-bold" : "text-gray-400"}`}>
                        {eb === null ? "—" : `${formataNumero(eb, l.unidade)} ${l.unidade}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-gray-500 text-sm mt-5 leading-relaxed">
            Em negrito, o que contém mais na quantidade escolhida — nesta comparação, e não como julgamento sobre o
            alimento. Fonte: Tabela Brasileira de Composição de Alimentos — TACO, NEPA/UNICAMP.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            {a!.i && (
              <Link href={`/alimentos/${a!.s}`} className="border border-white/25 text-gray-200 px-5 py-3 text-[15px] min-h-[48px] flex items-center hover:border-white/50 transition-colors">
                Ver {a!.n.split(",")[0]} completo
              </Link>
            )}
            {b!.i && (
              <Link href={`/alimentos/${b!.s}`} className="border border-white/25 text-gray-200 px-5 py-3 text-[15px] min-h-[48px] flex items-center hover:border-white/50 transition-colors">
                Ver {b!.n.split(",")[0]} completo
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
