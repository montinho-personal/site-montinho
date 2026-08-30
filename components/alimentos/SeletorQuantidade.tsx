"use client";

import { useEffect, useState } from "react";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { GRAMAS_MAX, GRAMAS_PADRAO, escalaValor, formataValor, leGramas } from "@/lib/alimentos/escala";
import type { EstadoDado, Unidade } from "@/lib/alimentos/tipos";

/**
 * O seletor de quantidade e a tabela.
 *
 * A quantidade é o que separa esta ferramenta de uma tabela impressa: a
 * pessoa não come 100 g, come um prato. Mudar o número recalcula tudo na
 * hora, sem recarregar e sem criar URL nova — é a mesma página, e por isso
 * não existe /100g-feijao e /150g-feijao competindo entre si no Google.
 *
 * A tabela completa começa fechada. Quem chegou perguntando quanta proteína
 * tem o feijão não deve precisar passar por 21 micronutrientes para
 * descobrir.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

export interface PorcaoUI {
  nome: string;
  gramas: number;
  fonte: string;
}

export interface LinhaNutriente {
  id: string;
  nome: string;
  unidade: Unidade;
  valor: number | null;
  estado: EstadoDado;
  nota?: string;
}

export default function SeletorQuantidade({
  nome,
  slug,
  principais,
  secundarios,
  porcoes = [],
}: {
  nome: string;
  slug: string;
  principais: LinhaNutriente[];
  secundarios: LinhaNutriente[];
  /**
   * Medidas caseiras com peso documentado. Vazio é o estado normal enquanto
   * a base de medidas não existir — e aí a ferramenta oferece gramas e só,
   * que é sempre correto. Melhor pedir "120 g" do que afirmar "1 concha =
   * 120 g" sem ter de onde tirar isso.
   */
  porcoes?: PorcaoUI[];
}) {
  const [texto, setTexto] = useState(String(GRAMAS_PADRAO));
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    trackOncePerSession("food_page_view", { placement: "pagina-alimento" });
  }, [slug]);

  const gramas = leGramas(texto);
  const ok = gramas !== null;

  const mostra = (l: LinhaNutriente) =>
    ok
      ? formataValor(
          escalaValor({ nutrienteId: l.id, valorPor100g: l.valor, unidade: l.unidade, estado: l.estado }, gramas!),
        )
      : "—";

  function ajusta(delta: number) {
    const base = gramas ?? GRAMAS_PADRAO;
    setTexto(String(Math.min(GRAMAS_MAX, Math.max(1, base + delta))));
    trackEvent("food_quantity_change", { placement: "pagina-alimento" });
  }

  return (
    <div className="bg-[#0d0d0d] border border-white/10 p-5 sm:p-8">
      {porcoes.length > 0 && (
        <div className="mb-5">
          <p className="text-gray-300 text-sm font-medium mb-2">Medida caseira</p>
          <div className="flex flex-wrap gap-2">
            {porcoes.map((p) => {
              const ativo = gramas === p.gramas;
              return (
                <button
                  key={p.nome}
                  type="button"
                  onClick={() => {
                    setTexto(String(p.gramas));
                    trackEvent("food_portion_select", { placement: "pagina-alimento" });
                  }}
                  aria-pressed={ativo}
                  className={`px-4 py-2.5 text-sm border transition-colors min-h-[44px] text-left ${
                    ativo
                      ? "border-[#BA9E50] text-white bg-[#BA9E50]/10"
                      : "border-white/20 text-gray-300 hover:border-white/40"
                  }`}
                >
                  {p.nome}
                  <span className="block text-gray-500 text-xs mt-0.5">{p.gramas} g</span>
                </button>
              );
            })}
          </div>
          {/*
            A fonte da MEDIDA fica junto dela, e separada da fonte dos
            nutrientes: os dois números vêm de lugares diferentes, e juntar
            tudo numa linha só de crédito faria parecer que a TACO também
            publica pesos de concha — o que ela não faz.
          */}
          <p className="text-gray-500 text-xs mt-2.5">
            Pesos das medidas: {porcoes[0].fonte}
          </p>
        </div>
      )}

      <div className="mb-7">
        <label htmlFor="qtd-alimento" className="block text-gray-300 text-sm font-medium mb-2">
          Quantidade de {nome.split(",")[0].toLowerCase()}
        </label>
        <div className="flex items-center gap-2 max-w-xs">
          <button
            type="button"
            aria-label="Diminuir 10 gramas"
            onClick={() => ajusta(-10)}
            className="border border-white/25 text-white w-12 h-12 text-xl hover:border-white/50 transition-colors"
          >
            −
          </button>
          <div className="flex items-center gap-2 flex-1">
            <input
              id="qtd-alimento"
              type="text"
              inputMode="decimal"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              aria-invalid={!ok}
              aria-describedby="qtd-erro"
              className="w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white text-2xl font-bold px-4 py-2.5 text-center min-h-[48px]"
            />
            <span className="text-gray-400">g</span>
          </div>
          <button
            type="button"
            aria-label="Aumentar 10 gramas"
            onClick={() => ajusta(10)}
            className="border border-white/25 text-white w-12 h-12 text-xl hover:border-white/50 transition-colors"
          >
            +
          </button>
        </div>
        <p id="qtd-erro" className="text-[#E8B4B4] text-sm mt-2 min-h-[20px]">
          {!ok ? `Informe uma quantidade entre 1 e ${GRAMAS_MAX} g.` : ""}
        </p>
      </div>

      {/* Os cinco principais */}
      <div aria-live="polite">
        <table className="w-full">
          <caption className="sr-only">
            Composição nutricional de {nome} em {ok ? gramas : 100} gramas
          </caption>
          <tbody className="divide-y divide-white/10 border-y border-white/10">
            {principais.map((l) => (
              <tr key={l.id}>
                <th scope="row" className="text-left font-normal text-gray-300 py-3.5">
                  {l.nome}
                </th>
                <td className="text-right text-white text-lg font-bold tabular-nums py-3.5">{mostra(l)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={() => {
          if (!aberto) trackEvent("food_nutrients_expand", { placement: "pagina-alimento" });
          setAberto(!aberto);
        }}
        aria-expanded={aberto}
        aria-controls="tabela-completa"
        className="mt-5 text-gray-300 hover:text-white underline underline-offset-4 decoration-1 decoration-white/30 min-h-[44px] transition-colors"
      >
        {aberto ? "Esconder a tabela completa ↑" : "Ver todos os nutrientes ↓"}
      </button>

      <div id="tabela-completa" hidden={!aberto} className="mt-6">
        <h3 className="text-white font-bold text-lg mb-4" style={h}>
          Tabela nutricional completa
        </h3>
        {/*
          Sem min-width e sem largura fixa na nota: num aparelho de 390 px, a
          nota do nutriente empurrava a coluna de valor para fora da tela e o
          "320 kJ" aparecia cortado. A nota agora quebra linha, e o
          overflow-x fica só como rede de segurança.
        */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-white/10 border-y border-white/10">
              {secundarios.map((l) => (
                <tr key={l.id}>
                  <th scope="row" className="text-left font-normal text-gray-300 py-3 pr-4 w-[60%]">
                    {l.nome}
                    {l.nota && <span className="block text-gray-500 text-xs mt-1 font-normal">{l.nota}</span>}
                  </th>
                  <td className="text-right text-white tabular-nums py-3 whitespace-nowrap">{mostra(l)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
