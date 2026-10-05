"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import { ALTURA_MAX, ALTURA_MIN, CINTURA_MAX, CINTURA_MIN, FAIXAS, NOTA_LIMITES, cinturaMetade, faixa, fmt1, fmt2, parseNumero, rca } from "@/lib/cintura-altura";

/**
 * Nada sai do navegador. Os eventos levam só a faixa (sem cintura, altura
 * ou razão), porque medida corporal é dado de saúde.
 */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const campo = `w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-xl font-bold px-4 py-3 outline-none ${foco}`;
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

export default function CalculadoraCintura() {
  const [cintura, setCintura] = useState("");
  const [altura, setAltura] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [res, setRes] = useState<{ r: number; c: number; a: number } | null>(null);
  const iniciou = useRef(false);
  const resRef = useRef<HTMLDivElement>(null);

  useEffect(() => { trackOncePerSession("waist_height_view", {}); }, []);
  const comecou = () => { if (!iniciou.current) { iniciou.current = true; trackEvent("waist_height_started", {}); } };

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    const c = parseNumero(cintura);
    const bruto = parseNumero(altura);
    const a = bruto !== null && bruto < 3 ? bruto * 100 : bruto; // aceita 1,70
    if (a === null || a < ALTURA_MIN || a > ALTURA_MAX) return setErro(`Digite a altura em centímetros, entre ${ALTURA_MIN} e ${ALTURA_MAX}.`);
    if (c === null || c < CINTURA_MIN || c > CINTURA_MAX) return setErro(`Digite a cintura em centímetros, entre ${CINTURA_MIN} e ${CINTURA_MAX}.`);
    setErro(null);
    const r = rca(c, a);
    setRes({ r, c, a });
    trackEvent("waist_height_completed", { faixa: faixa(r).id });
    setTimeout(() => resRef.current?.focus(), 50);
  }

  const f = res ? faixa(res.r) : null;
  const pos = res ? Math.min(100, Math.max(0, ((res.r - 0.3) / 0.4) * 100)) : 0;
  const meta = res ? cinturaMetade(res.a) : 0;

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" data-testid="calculadora-cintura-altura">
      <form onSubmit={calcular} noValidate className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-sm text-gray-300 mb-1">Cintura (cm)</span>
          <input inputMode="decimal" className={campo} value={cintura} onChange={(e) => { comecou(); setCintura(e.target.value); setRes(null); }} placeholder="Ex.: 82" aria-invalid={!!erro && erro.includes("cintura")} />
        </label>
        <label className="block">
          <span className="block text-sm text-gray-300 mb-1">Altura (cm)</span>
          <input inputMode="decimal" className={campo} value={altura} onChange={(e) => { comecou(); setAltura(e.target.value); setRes(null); }} placeholder="Ex.: 170" aria-invalid={!!erro && erro.includes("altura")} />
        </label>
        <p className="sm:col-span-2 text-xs text-gray-500">Meça a cintura no meio do caminho entre a última costela e o topo do osso do quadril, depois de soltar o ar, sem encolher a barriga.</p>
        {erro && <p role="alert" className="sm:col-span-2 text-sm text-red-400">{erro}</p>}
        <button type="submit" className={`sm:col-span-2 bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 ${foco}`}>Calcular minha relação cintura-altura</button>
      </form>

      {res && f && (
        <div ref={resRef} tabIndex={-1} aria-live="polite" className="mt-6 border-t border-white/10 pt-6 outline-none">
          <p className="text-sm text-gray-400">Sua relação cintura-altura</p>
          <p className="text-5xl font-bold text-white my-1" style={h}>{fmt2(res.r)}</p>
          <p className="text-lg font-semibold" style={{ color: f.cor }}>{f.nome} ({f.intervalo})</p>
          <div className="relative h-3 mt-4 flex" aria-hidden="true">
            <div className="flex-[1]" style={{ background: FAIXAS[0].cor }} />
            <div className="flex-[1]" style={{ background: FAIXAS[1].cor }} />
            <div className="flex-[1]" style={{ background: FAIXAS[2].cor }} />
            <div className="flex-[1]" style={{ background: FAIXAS[3].cor }} />
            <div className="absolute -top-1 w-1 h-5 bg-white" style={{ left: `calc(${pos}% - 2px)` }} />
          </div>
          <div className="flex justify-between text-[11px] text-gray-500 mt-1" aria-hidden="true"><span>0,30</span><span>0,40</span><span>0,50</span><span>0,60</span><span>0,70</span></div>
          <p className="text-gray-200 mt-4 leading-relaxed">{f.texto}</p>
          <p className="text-gray-300 mt-3 leading-relaxed">Para {fmt1(res.a)} cm de altura, a metade é <strong className="text-white">{fmt1(meta)} cm</strong> de cintura.{" "}
            {res.c === meta ? <>Você está exatamente nela.</> : res.c > meta ? <>Você está {fmt1(res.c - meta)} cm acima dela.</> : <>Você está {fmt1(meta - res.c)} cm abaixo dela.</>}
          </p>
          <p className="text-gray-500 text-xs mt-4">{NOTA_LIMITES}</p>
          <div className="mt-6 border border-white/15 p-4">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white text-sm leading-relaxed mb-3">{t}</p>)}
            <p className="text-gray-200 text-sm leading-relaxed">Esse número é um ponto de partida. Quem reduz a cintura de verdade é quem treina e ajusta a rotina semana a semana. Quer ajuda para transformar isso em um plano para você?</p>
            <a href={getWhatsAppUrl("Oi Montinho! Fiz a calculadora de relação cintura-altura no site e queria ajuda para montar um plano.")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("waist_height_whatsapp", { faixa: f.id })} className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>Falar com o Montinho no WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}
