"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { useAgora } from "@/components/olympia/useAgora";
import { aberta as estaAberta, enquete as acharEnquete, type Enquete, type Lutador } from "@/lib/palpites";

/**
 * Palpite "quem vence?" em formato face-off.
 *
 * Antes do voto: os dois córners lado a lado, VS pulsando no meio e a
 * contagem até a votação fechar. Depois do voto: barras de porcentagem que
 * crescem a partir do centro, com o lado escolhido marcado. Os números
 * vêm da API (/api/palpite); o voto fica lembrado no navegador.
 */
const VERMELHO = "#D7263D";
const AZUL = "#1E6FD9";
const OURO = "#BA9E50";

function votanteId() {
  try {
    let v = localStorage.getItem("palpite_votante");
    if (!v) { v = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2) + Date.now().toString(36)); localStorage.setItem("palpite_votante", v); }
    return v;
  } catch { return "anon-" + Math.random().toString(36).slice(2, 12); }
}
const lembrado = (id: string) => { try { return localStorage.getItem(`palpite:${id}`); } catch { return null; } };
const lembrar = (id: string, op: string) => { try { localStorage.setItem(`palpite:${id}`, op); } catch {} };

function useRelogio(alvoIso: string) {
  const agora = useAgora(1000);
  if (agora === null) return null;
  const ms = Math.max(0, Date.parse(alvoIso) - agora);
  const h = Math.floor(ms / 3.6e6), m = Math.floor((ms % 3.6e6) / 6e4), s = Math.floor((ms % 6e4) / 1e3);
  return { ms, txt: `${h > 0 ? `${h}h ` : ""}${String(m).padStart(2, "0")}min ${String(s).padStart(2, "0")}s` };
}

function Canto({ l, cor, lado, escolhido, outroEscolhido, onVotar, desabilitado }: {
  l: Lutador; cor: string; lado: "esq" | "dir"; escolhido: boolean; outroEscolhido: boolean; onVotar: () => void; desabilitado: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onVotar}
      disabled={desabilitado}
      aria-label={`Votar em ${l.nome}`}
      className={`pal-canto pal-${lado} group relative flex flex-col items-center gap-3 py-6 px-2 transition-all duration-500 ${outroEscolhido ? "opacity-40 scale-95" : ""} ${desabilitado ? "cursor-default" : "cursor-pointer"}`}
    >
      <span className="relative block">
        <span className="pal-anel absolute -inset-2 rounded-full" style={{ background: `conic-gradient(from 0deg, ${cor}, transparent 40%, ${cor} 70%, transparent)` }} aria-hidden />
        <span
          className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full text-3xl sm:text-4xl font-black text-white tracking-tight"
          style={{ background: `radial-gradient(circle at 30% 25%, ${cor}, #0b0b0b 75%)`, boxShadow: escolhido ? `0 0 0 3px ${OURO}, 0 0 40px ${cor}` : `0 0 24px ${cor}55`, fontFamily: "var(--font-titulo), Georgia, serif" }}
        >
          {l.iniciais}
        </span>
        <span className="absolute -bottom-1 -right-1 text-2xl leading-none drop-shadow" aria-hidden>{l.bandeira}</span>
      </span>
      <span className="text-white font-bold text-base sm:text-lg leading-tight text-center">{l.nome}</span>
      <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: cor }}>{l.pais}</span>
      {!desabilitado && (
        <span className="mt-1 text-xs font-semibold uppercase tracking-wider px-4 py-2 rounded-full border transition-colors duration-200 group-hover:text-black" style={{ borderColor: cor, color: "#fff" }}>
          Vai vencer
        </span>
      )}
      {escolhido && <span className="mt-1 text-xs font-bold uppercase tracking-wider" style={{ color: OURO }}>✓ Seu palpite</span>}
    </button>
  );
}

function Cartao({ e }: { e: Enquete }) {
  const [votos, setVotos] = useState<Record<string, number> | null>(null);
  const [meu, setMeu] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const relogio = useRelogio(e.fechaEm);
  const fechada = relogio ? relogio.ms === 0 : !estaAberta(e);

  useEffect(() => {
    const t = setTimeout(() => setMeu(lembrado(e.id)), 0);
    fetch(`/api/palpite?e=${e.id}`, { cache: "no-store" }).then((r) => r.json()).then((d) => d?.ok && setVotos(d.votos)).catch(() => {});
    return () => clearTimeout(t);
  }, [e.id]);

  const votar = useCallback(async (op: string) => {
    if (meu || enviando || fechada) return;
    setEnviando(true);
    setMeu(op); lembrar(e.id, op);
    setVotos((v) => ({ ...(v ?? {}), [op]: ((v ?? {})[op] ?? 0) + 1 }));
    trackEvent("palpite_voto", { enquete: e.id, opcao: op });
    try {
      const r = await fetch("/api/palpite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ enquete: e.id, opcao: op, votante: votanteId() }) });
      const d = await r.json();
      if (d?.votos) setVotos(d.votos);
    } catch {}
    setEnviando(false);
  }, [e.id, meu, enviando, fechada]);

  const v = votos?.[e.vermelho.id] ?? 0, a = votos?.[e.azul.id] ?? 0, total = v + a;
  const pv = total ? Math.round((v / total) * 100) : 50;
  const mostrar = !!meu || fechada;

  const compartilhar = useMemo(() => async () => {
    const texto = `Dei meu palpite: ${meu === e.vermelho.id ? e.vermelho.nome : e.azul.nome} vence ${e.vermelho.nome} x ${e.azul.nome} no UFC 332. E você?`;
    const url = typeof window !== "undefined" ? window.location.href.split("#")[0] : "";
    trackEvent("palpite_compartilhar", { enquete: e.id });
    try { if (navigator.share) await navigator.share({ text: texto, url }); else window.open(`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`, "_blank"); } catch {}
  }, [meu, e]);

  return (
    <section className="pal-card relative overflow-hidden rounded-2xl border border-white/10 my-2" style={{ background: "linear-gradient(135deg, #1a0508 0%, #0a0a0a 48%, #050b18 100%)" }} aria-label={`Palpite: ${e.vermelho.nome} x ${e.azul.nome}`}>
      <span className="pal-luz-v absolute -left-24 -top-24 w-72 h-72 rounded-full blur-3xl" style={{ background: `${VERMELHO}33` }} aria-hidden />
      <span className="pal-luz-a absolute -right-24 -bottom-24 w-72 h-72 rounded-full blur-3xl" style={{ background: `${AZUL}33` }} aria-hidden />
      <span className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(115deg, #fff 0 1px, transparent 1px 14px)" }} aria-hidden />

      <header className="relative text-center pt-6 px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em]" style={{ color: OURO }}>UFC 332 · {e.card}</p>
        <h3 className="text-white text-2xl sm:text-3xl font-black mt-2" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>{e.titulo}</h3>
        <p className="text-gray-400 text-xs mt-1">{e.categoria}</p>
      </header>

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-2 sm:px-6">
        <Canto l={e.vermelho} cor={VERMELHO} lado="esq" escolhido={meu === e.vermelho.id} outroEscolhido={!!meu && meu !== e.vermelho.id} onVotar={() => votar(e.vermelho.id)} desabilitado={!!meu || fechada} />
        <span className="pal-vs relative text-3xl sm:text-5xl font-black italic px-1 select-none" style={{ color: OURO, fontFamily: "var(--font-titulo), Georgia, serif", textShadow: `0 0 18px ${OURO}aa` }} aria-hidden>VS</span>
        <Canto l={e.azul} cor={AZUL} lado="dir" escolhido={meu === e.azul.id} outroEscolhido={!!meu && meu !== e.azul.id} onVotar={() => votar(e.azul.id)} desabilitado={!!meu || fechada} />
      </div>

      <div className="relative px-5 sm:px-8 pb-6">
        {mostrar ? (
          <div aria-live="polite">
            <div className="flex justify-between text-white font-black text-2xl sm:text-3xl tabular-nums" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              <span style={{ color: VERMELHO }}>{pv}%</span>
              <span style={{ color: AZUL }}>{100 - pv}%</span>
            </div>
            <div className="relative h-4 mt-2 rounded-full overflow-hidden bg-white/5 flex">
              <span className="pal-barra h-full" style={{ width: `${pv}%`, background: `linear-gradient(90deg, ${VERMELHO}aa, ${VERMELHO})` }} />
              <span className="pal-barra h-full" style={{ width: `${100 - pv}%`, background: `linear-gradient(90deg, ${AZUL}, ${AZUL}aa)` }} />
              <span className="absolute top-0 bottom-0 w-[3px] bg-white shadow-[0_0_10px_#fff] transition-all duration-1000" style={{ left: `calc(${pv}% - 1.5px)` }} aria-hidden />
            </div>
            <p className="text-center text-gray-400 text-xs mt-3">
              {total.toLocaleString("pt-BR")} {total === 1 ? "palpite" : "palpites"} {fechada ? "· votação encerrada" : "até agora"}
            </p>
            {meu && !fechada && (
              <div className="text-center mt-4">
                <button type="button" onClick={compartilhar} className="text-xs font-semibold uppercase tracking-wider px-5 py-2.5 rounded-full text-black transition-transform hover:scale-105" style={{ background: OURO }}>
                  Desafiar um amigo
                </button>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-300 text-sm">
            Toque em quem você acha que vence.{" "}
            {relogio && relogio.ms > 0 && <span className="whitespace-nowrap">Votação fecha em <strong className="tabular-nums" style={{ color: OURO }}>{relogio.txt}</strong></span>}
          </p>
        )}
      </div>
    </section>
  );
}

export default function Palpite({ ids }: { ids: string[] }) {
  const lista = ids.map(acharEnquete).filter(Boolean) as Enquete[];
  return (
    <div className="not-prose space-y-6">
      <style>{`
        .pal-anel{animation:pal-gira 6s linear infinite;opacity:.55;mask:radial-gradient(circle,transparent 58%,#000 60%);-webkit-mask:radial-gradient(circle,transparent 58%,#000 60%)}
        .pal-canto:not(:disabled):hover .pal-anel{opacity:1;animation-duration:1.6s}
        .pal-canto:not(:disabled):hover{transform:translateY(-4px)}
        .pal-vs{animation:pal-pulso 1.8s ease-in-out infinite}
        .pal-luz-v,.pal-luz-a{animation:pal-respira 5s ease-in-out infinite}
        .pal-luz-a{animation-delay:2.5s}
        .pal-barra{transition:width 1.1s cubic-bezier(.2,.9,.2,1)}
        .pal-card{animation:pal-entra .7s ease-out both}
        .pal-esq{animation:pal-de-esq .7s cubic-bezier(.2,.9,.2,1) both}
        .pal-dir{animation:pal-de-dir .7s cubic-bezier(.2,.9,.2,1) both}
        @keyframes pal-gira{to{transform:rotate(360deg)}}
        @keyframes pal-pulso{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
        @keyframes pal-respira{0%,100%{opacity:.6}50%{opacity:1}}
        @keyframes pal-entra{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
        @keyframes pal-de-esq{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none}}
        @keyframes pal-de-dir{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion:reduce){.pal-anel,.pal-vs,.pal-luz-v,.pal-luz-a,.pal-card,.pal-esq,.pal-dir{animation:none}.pal-barra{transition:none}}
      `}</style>
      {lista.map((e) => <Cartao key={e.id} e={e} />)}
    </div>
  );
}
