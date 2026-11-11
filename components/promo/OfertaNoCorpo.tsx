"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PROMO_ATIVA, promoValida, linkOferta } from "@/lib/promo/relampago";
import { AVISO_AFILIADO } from "@/lib/afiliados";
import { trackEvent } from "@/lib/analytics";

/**
 * A oferta relâmpago dentro da página (artigo do tema ou resultado de
 * ferramenta). Monta só no navegador: a validade depende da hora de quem lê,
 * e o HTML do build não pode trazer uma oferta que já acabou.
 */
export default function OfertaNoCorpo({ canal, local }: { canal: "artigo" | "ferramenta"; local: string }) {
  const pathname = usePathname() ?? "/";
  const [agora, setAgora] = useState<number | null>(null);
  const p = PROMO_ATIVA;
  useEffect(() => {
    setAgora(Date.now());
    const i = setInterval(() => setAgora(Date.now()), 30_000);
    return () => clearInterval(i);
  }, []);
  useEffect(() => {
    if (agora !== null && promoValida(p, agora)) trackEvent("promo_relampago_view", { promo: p.id, pagina: pathname, local });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agora !== null]);
  if (agora === null || !promoValida(p, agora)) return null;
  if (canal === "artigo" && !p.paginasDoTema.test(pathname)) return null;

  const hora = new Date(Date.parse(p.ate)).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  const selo = p.vendedor === "Amazon" ? "Vendido pela Amazon" : p.vendedor ? "Vendido pela loja oficial da marca" : null;
  return (
    <aside className="my-8 overflow-hidden rounded-2xl border-2 border-amber-400/70 bg-[#0b0b0b] not-prose" aria-label="Oferta relâmpago">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-gradient-to-r from-red-700 to-red-600 px-4 py-2">
        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-white">⚡ Oferta relâmpago · só hoje</span>
        <span className="text-xs font-semibold text-red-50">termina às {hora}</span>
      </div>
      <div className="p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">{p.marca}</p>
        <p className="mt-0.5 text-xl font-extrabold leading-tight text-white">{p.produto}</p>
        <p className="mt-2 text-sm leading-relaxed text-gray-300">{p.argumento}</p>
        {p.comparacao && (
          <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/[0.07] px-3 py-2 text-sm font-semibold text-amber-200">
            {p.comparacao.texto}
            <span className="mt-1 block text-[10.5px] font-normal text-gray-500">{p.comparacao.fonte}</span>
          </p>
        )}
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {selo && <li className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">✓ {selo}</li>}
          {p.selos.map((s) => <li key={s} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-gray-200">✓ {s}</li>)}
        </ul>
        <a
          href={linkOferta(p, canal, pathname)}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          onClick={() => trackEvent("promo_relampago_click", { promo: p.id, pagina: pathname, local })}
          className="mt-4 block rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-4 py-3.5 text-center text-base font-black text-black shadow-lg shadow-amber-500/25 hover:from-amber-200 hover:to-amber-400"
        >
          Garantir o desconto na Amazon →
        </a>
        <p className="mt-2.5 text-[10.5px] leading-snug text-gray-500">{AVISO_AFILIADO}</p>
      </div>
    </aside>
  );
}
