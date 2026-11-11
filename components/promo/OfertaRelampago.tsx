"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PROMO_ATIVA, ROTAS_SEM_PROMO, promoValida } from "@/lib/promo/relampago";
import { AVISO_AFILIADO } from "@/lib/afiliados";
import { trackEvent } from "@/lib/analytics";

/**
 * Aviso de oferta relâmpago (Amazon, afiliado).
 *
 * Não é um pop-up que tapa a tela: é um cartão no canto (no celular, uma
 * faixa de baixo), porque o Google trata intersticial que cobre o conteúdo
 * como experiência ruim. Espera 25% de rolagem ou 12 s, espera o aviso de
 * cookies, e quem fechou não vê de novo esta oferta.
 */
const fechadaKey = (id: string) => `montinho:promo:fechada:${id}`;
const ls = {
  get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* sem storage */ } },
};

function falta(ate: number, agora: number) {
  const s = Math.max(0, Math.floor((ate - agora) / 1000));
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}

export default function OfertaRelampago() {
  const pathname = usePathname() ?? "/";
  const [aberta, setAberta] = useState(false);
  const [agora, setAgora] = useState(() => Date.now());
  const p = PROMO_ATIVA;

  const permitida = promoValida(p) && !ROTAS_SEM_PROMO.some((r) => r.test(pathname));

  useEffect(() => {
    if (!permitida || !p || ls.get(fechadaKey(p.id))) return;
    let feito = false;
    const mostra = () => {
      if (feito) return;
      if (!ls.get("cookie_consent")) return; // espera o aviso de cookies
      feito = true;
      setAberta(true);
      trackEvent("promo_relampago_view", { promo: p.id, pagina: pathname });
    };
    const onScroll = () => {
      const h = document.documentElement;
      if (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) >= 0.25) mostra();
    };
    const t = setTimeout(mostra, 12_000);
    const onCookies = () => setTimeout(mostra, 1_500);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("montinho:cookies", onCookies);
    return () => { clearTimeout(t); window.removeEventListener("scroll", onScroll); window.removeEventListener("montinho:cookies", onCookies); };
  }, [permitida, p, pathname]);

  useEffect(() => {
    if (!aberta) return;
    const i = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(i);
  }, [aberta]);

  if (!permitida || !p || !aberta) return null;
  const fim = Date.parse(p.ate);
  if (agora >= fim) return null;

  const fecha = (como: string) => {
    ls.set(fechadaKey(p.id), "1");
    setAberta(false);
    trackEvent("promo_relampago_fechar", { promo: p.id, como });
  };
  const hora = new Date(fim).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
  const selo = p.vendedor === "Amazon" ? "Vendido pela Amazon" : "Vendido pela loja oficial da marca";

  const [hh, mm, ss2] = falta(fim, agora).split(":");
  const Digito = ({ v, r }: { v: string; r: string }) => (
    <span className="flex flex-col items-center">
      <span className="min-w-[1.9rem] rounded-md bg-black/40 px-1.5 py-0.5 text-center text-base sm:text-lg font-black tabular-nums text-white">{v}</span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-red-100/80">{r}</span>
    </span>
  );

  return (
    <div
      role="dialog"
      aria-label="Oferta relâmpago"
      className="fixed z-[70] inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[390px] overflow-hidden rounded-2xl border border-amber-400/70 bg-[#0b0b0b] shadow-[0_20px_60px_-10px_rgba(0,0,0,.8)] motion-safe:animate-[promoIn_.35s_ease-out]"
    >
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-red-700 to-red-600 px-4 py-2 pr-12">
        <div className="leading-tight">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white">⚡ Oferta relâmpago</p>
          <p className="text-[11px] text-red-100">só até {hora} de hoje</p>
        </div>
        <div className="flex items-start gap-1" aria-label={`Termina em ${hh} horas, ${mm} minutos`}>
          <Digito v={hh} r="h" /><span className="pt-0.5 font-black text-white">:</span>
          <Digito v={mm} r="min" /><span className="pt-0.5 font-black text-white">:</span>
          <Digito v={ss2} r="s" />
        </div>
      </div>
      <button
        type="button"
        onClick={() => fecha("x")}
        aria-label="Fechar oferta"
        className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full text-white/80 hover:text-white hover:bg-black/20 text-2xl leading-none"
      >
        ×
      </button>

      <div className="px-4 pt-3 pb-3 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-amber-400">{p.marca}</p>
        <p className="mt-0.5 text-white font-extrabold leading-tight text-lg sm:text-xl">{p.produto}</p>
        <p className="mt-2 hidden sm:block text-sm text-gray-300 leading-relaxed">{p.argumento}</p>

        {p.comparacao && (
          <div className="mt-2 sm:mt-3 rounded-lg border border-amber-400/30 bg-amber-400/[0.07] px-3 py-2">
            <p className="text-[13px] sm:text-sm font-semibold text-amber-200 leading-snug">{p.comparacao.texto}</p>
            <p className="mt-1 hidden sm:block text-[10.5px] text-gray-500">{p.comparacao.fonte}</p>
          </div>
        )}

        <ul className="mt-2 sm:mt-3 flex flex-wrap gap-1.5">
          <li className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-300">✓ {selo}</li>
          {p.selos.map((s) => (
            <li key={s} className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-gray-200">✓ {s}</li>
          ))}
        </ul>

        <a
          href={p.url}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          onClick={() => trackEvent("promo_relampago_click", { promo: p.id, pagina: pathname })}
          className="mt-3 sm:mt-4 block rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-4 py-3 sm:py-3.5 text-center text-base font-black text-black shadow-lg shadow-amber-500/25 hover:from-amber-200 hover:to-amber-400"
        >
          Garantir o desconto na Amazon →
        </a>
        <div className="mt-2 flex items-center justify-between text-xs">
          <Link href={p.artigo.href} onClick={() => trackEvent("promo_relampago_artigo", { promo: p.id })} className="text-gray-400 underline underline-offset-2 hover:text-white">
            {p.artigo.nome}
          </Link>
          <button type="button" onClick={() => fecha("agora-nao")} className="text-gray-500 hover:text-gray-300">Agora não</button>
        </div>
        <p className="mt-2 text-[10px] leading-snug text-gray-600"><span className="sm:hidden">Link de afiliado: recebo comissão, sem custo a mais para você. Preço e estoque mudam na Amazon.</span><span className="hidden sm:inline">{AVISO_AFILIADO}</span></p>
      </div>
    </div>
  );
}
