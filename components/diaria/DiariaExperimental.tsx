"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { IDAS, brl, dataTxt, filtrar, precoTxt, totalNoMes, type Modo, type Oferta } from "@/lib/diaria-experimental";

/**
 * Lista filtrável, toda no navegador. Os dados vêm de lib/diaria-experimental.ts:
 * cada oferta mostra a fonte oficial e a data da conferência.
 */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const opcao = (ativo: boolean) =>
  `min-h-[48px] px-4 py-2.5 text-sm border transition-colors ${foco} ${ativo ? "bg-white text-black border-white font-semibold" : "bg-black text-gray-200 border-white/25 hover:border-white/60"}`;
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white";

function Cartao({ o, idas }: { o: Oferta; idas: number }) {
  const total = o.modo === "diaria" ? totalNoMes(o, idas) : null;
  return (
    <li className={`border p-4 sm:p-5 ${o.daCasa ? "border-[#BA9E50]/60" : "border-white/15"}`} data-testid={`oferta-${o.id}`}>
      {o.daCasa && <p className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>Atendimento do Montinho, dono deste site</p>}
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-lg font-bold text-white" style={h}>{o.academia}</h3>
        <p className="text-lg font-bold text-white tabular-nums">{precoTxt(o)}</p>
      </div>
      <p className="text-sm text-gray-400">{o.rotulo} · {o.bairro}</p>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div><dt className="inline text-gray-400">Inclui: </dt><dd className="inline text-gray-200">{o.modalidade}</dd></div>
        <div><dt className="inline text-gray-400">Como: </dt><dd className="inline text-gray-200">{o.como}</dd></div>
        <div><dt className="inline text-gray-400">Reserva: </dt><dd className="inline text-gray-200">{o.precisaAgendar === null ? "consulte a academia" : o.precisaAgendar ? "precisa agendar" : "não precisa agendar"}</dd></div>
        {total !== null && (
          <div><dt className="inline text-gray-400">{idas} {idas === 1 ? "ida" : "idas"} no mês: </dt><dd className="inline text-white font-semibold">{brl(total)}</dd></div>
        )}
      </dl>
      <p className="text-xs text-gray-500 mt-3">
        Fonte:{" "}
        {o.fonteUrl ? <a href={o.fonteUrl} target="_blank" rel="noopener noreferrer nofollow" className={ln}>{o.fonteNome}</a> : o.fonteNome}
        , conferida em {dataTxt(o.conferidaEm)}.
      </p>
      <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
        {o.daCasa && (
          <a href={getWhatsAppUrl("Oi Montinho! Vi no site a aula experimental de musculação na Arena 18 e queria marcar.")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("diaria_experimental_whatsapp", { origem: "cartao" })} className={`inline-flex items-center justify-center border border-white/25 text-white px-4 py-2.5 text-sm min-h-[44px] hover:border-white/60 ${foco}`}>Marcar pelo WhatsApp</a>
        )}
        {o.guia && <Link href={o.guia} className={`text-sm text-gray-300 min-h-[44px] inline-flex items-center ${ln}`}>Ver o guia da academia</Link>}
      </div>
    </li>
  );
}

export default function DiariaExperimental() {
  const [modo, setModo] = useState<Modo>("diaria");
  const [soMusculacao, setSoMusculacao] = useState(false);
  const [soComPreco, setSoComPreco] = useState(false);
  const [idas, setIdas] = useState<number>(4);

  useEffect(() => { trackOncePerSession("diaria_experimental_view", {}); }, []);

  const lista = filtrar({ modo, soMusculacao, soComPreco });
  const marcar = (campo: string, valor: string | boolean) => trackEvent("diaria_experimental_filtro", { campo, valor: String(valor) });

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" data-testid="diaria-experimental">
      <div role="group" aria-label="O que você quer fazer" className="grid sm:grid-cols-2 gap-2">
        <button type="button" aria-pressed={modo === "diaria"} onClick={() => { setModo("diaria"); marcar("modo", "diaria"); }} className={opcao(modo === "diaria")}>Quero treinar hoje (diária)</button>
        <button type="button" aria-pressed={modo === "experimental"} onClick={() => { setModo("experimental"); marcar("modo", "experimental"); }} className={opcao(modo === "experimental")}>Quero testar antes de assinar</button>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-5">
        <label className="inline-flex items-center gap-2 text-sm text-gray-200 min-h-[44px] cursor-pointer">
          <input type="checkbox" className="w-5 h-5 accent-[#BA9E50]" checked={soMusculacao} onChange={(e) => { setSoMusculacao(e.target.checked); marcar("so_musculacao", e.target.checked); }} />
          Só musculação
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-gray-200 min-h-[44px] cursor-pointer">
          <input type="checkbox" className="w-5 h-5 accent-[#BA9E50]" checked={soComPreco} onChange={(e) => { setSoComPreco(e.target.checked); marcar("so_com_preco", e.target.checked); }} />
          Só com preço confirmado
        </label>
      </div>

      {modo === "diaria" && (
        <fieldset className="mt-4">
          <legend className="block text-sm text-gray-300 mb-2">Quantas vezes você iria no mês pagando diária</legend>
          <div className="flex flex-wrap gap-2">
            {IDAS.map((n) => (
              <button key={n} type="button" aria-pressed={idas === n} onClick={() => { setIdas(n); marcar("idas", String(n)); }} className={opcao(idas === n)}>{n}×</button>
            ))}
          </div>
        </fieldset>
      )}

      <p aria-live="polite" className="text-sm text-gray-400 mt-6">
        {lista.length === 0 ? "Nenhuma oferta confirmada com esses filtros." : `${lista.length} ${lista.length === 1 ? "oferta confirmada" : "ofertas confirmadas"}, com fonte e data.`}
      </p>

      {lista.length > 0 && (
        <ul className="mt-3 space-y-3">
          {lista.map((o) => <Cartao key={o.id} o={o} idas={idas} />)}
        </ul>
      )}

      {lista.length === 0 && (
        <button type="button" onClick={() => { setSoMusculacao(false); setSoComPreco(false); }} className={`mt-3 text-sm text-gray-200 min-h-[44px] ${ln} ${foco}`}>Limpar os filtros</button>
      )}

      <p className="text-gray-500 text-xs mt-5">
        Preço e regra mudam sem aviso. Antes de sair de casa, confirme com a academia se a oferta vale no dia e no horário em que você vai.
      </p>

      <div className="mt-6 border border-white/15 p-4">
        <p className="text-gray-200 text-sm leading-relaxed">
          A lista mostra onde dá para entrar. O que acontece depois da primeira aula é outra conversa: qual treino seguir, com que carga começar e o que ajustar na segunda semana. Quer ajuda com isso?
        </p>
        <a href={getWhatsAppUrl("Oi Montinho! Usei a lista de academias com diária e aula experimental no site e queria ajuda para começar a treinar.")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("diaria_experimental_whatsapp", { origem: "rodape" })} className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>Falar com o Montinho no WhatsApp</a>
      </div>
    </div>
  );
}
