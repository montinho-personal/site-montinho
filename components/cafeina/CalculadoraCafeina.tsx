"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import {
  BEBIDAS, HORAS_ANTES_CAFE, HORAS_ANTES_PRE_TREINO, LIMITE_DOSE_UNICA, arred5, doseTreino, fmt1, fmtInt, horarioLimite, limiteDiario, parseNumero, type Perfil,
} from "@/lib/cafeina";

/** Nada sai do navegador. Os eventos levam só a faixa do resultado e o perfil. */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const campo = `w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-lg font-bold px-3 py-3 outline-none ${foco}`;
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const chip = (on: boolean) => `border px-2 py-3 text-sm min-h-[48px] ${on ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300"} ${foco}`;

const PERFIS: { id: Perfil; nome: string }[] = [
  { id: "adulto", nome: "Adulto" },
  { id: "gestante", nome: "Gestante ou amamentando" },
  { id: "menor", nome: "Menor de 18" },
];

export default function CalculadoraCafeina() {
  const [peso, setPeso] = useState("");
  const [perfil, setPerfil] = useState<Perfil>("adulto");
  const [qtd, setQtd] = useState<Record<string, number>>({});
  const [extra, setExtra] = useState("");
  const [dormir, setDormir] = useState("23:00");
  const [erro, setErro] = useState<string | null>(null);
  const [res, setRes] = useState<{ total: number; peso: number; perfil: Perfil; dormir: string } | null>(null);
  const iniciou = useRef(false);
  const resRef = useRef<HTMLDivElement>(null);

  useEffect(() => { trackOncePerSession("caffeine_view", {}); }, []);
  const comecou = () => { if (!iniciou.current) { iniciou.current = true; trackEvent("caffeine_started", {}); } };
  const muda = (id: string, d: number) => { comecou(); setRes(null); setQtd((q) => ({ ...q, [id]: Math.max(0, Math.min(20, (q[id] ?? 0) + d)) })); };

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    const kg = parseNumero(peso);
    const ex = extra.trim() ? parseNumero(extra) : 0;
    if (kg === null || kg < 30 || kg > 250) return setErro("Digite o peso, entre 30 e 250 kg.");
    if (ex === null || ex < 0 || ex > 1000) return setErro("A cafeína de suplementos vai de 0 a 1.000 mg. Veja no rótulo; se não usa, deixe em branco.");
    setErro(null);
    const total = BEBIDAS.reduce((s, b) => s + (qtd[b.id] ?? 0) * b.mg, 0) + ex;
    setRes({ total, peso: kg, perfil, dormir });
    const lim = limiteDiario(perfil, kg);
    trackEvent("caffeine_completed", { perfil, faixa: total > lim ? "acima" : total > lim * 0.75 ? "perto" : "dentro" });
    setTimeout(() => resRef.current?.focus(), 50);
  }

  const lim = res ? limiteDiario(res.perfil, res.peso) : 0;
  const pct = res ? Math.min(100, (res.total / lim) * 100) : 0;
  const cor = res ? (res.total > lim ? "#ef4444" : res.total > lim * 0.75 ? "#eab308" : "#22c55e") : "";
  const dose = res ? doseTreino(res.peso) : null;
  const hCafe = res ? horarioLimite(res.dormir, HORAS_ANTES_CAFE) : null;
  const hPre = res ? horarioLimite(res.dormir, HORAS_ANTES_PRE_TREINO) : null;

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" data-testid="calculadora-cafeina">
      <form onSubmit={calcular} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-sm text-gray-300 mb-1">Peso (kg)</span>
            <input inputMode="decimal" className={campo} value={peso} onChange={(e) => { comecou(); setPeso(e.target.value); setRes(null); }} placeholder="Ex.: 70" />
          </label>
          <label className="block">
            <span className="block text-sm text-gray-300 mb-1">Horário que dorme</span>
            <input type="time" className={campo} value={dormir} onChange={(e) => { setDormir(e.target.value); setRes(null); }} />
          </label>
        </div>
        <fieldset>
          <legend className="text-sm text-gray-300 mb-2">Perfil</legend>
          <div className="grid grid-cols-3 gap-2">
            {PERFIS.map((p) => <button key={p.id} type="button" aria-pressed={perfil === p.id} onClick={() => { setPerfil(p.id); setRes(null); }} className={chip(perfil === p.id)}>{p.nome}</button>)}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-sm text-gray-300 mb-2">O que você toma num dia comum</legend>
          <ul className="divide-y divide-white/10 border border-white/15">
            {BEBIDAS.map((b) => (
              <li key={b.id} className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="text-sm text-gray-200 min-w-0">{b.nome}<span className="block text-[11px] text-gray-500">{b.porcao} · ~{b.mg} mg</span></span>
                <span className="flex items-center gap-2 shrink-0">
                  <button type="button" aria-label={`Menos ${b.nome}`} onClick={() => muda(b.id, -1)} className={`w-10 h-10 border border-white/25 text-white ${foco}`}>−</button>
                  <span className="w-6 text-center text-white font-bold" aria-live="polite">{qtd[b.id] ?? 0}</span>
                  <button type="button" aria-label={`Mais ${b.nome}`} onClick={() => muda(b.id, 1)} className={`w-10 h-10 border border-white/25 text-white ${foco}`}>+</button>
                </span>
              </li>
            ))}
          </ul>
        </fieldset>
        <label className="block">
          <span className="block text-sm text-gray-300 mb-1">Pré-treino ou cápsula de cafeína (mg do rótulo)</span>
          <input inputMode="numeric" className={campo} value={extra} onChange={(e) => { comecou(); setExtra(e.target.value); setRes(null); }} placeholder="Ex.: 200" />
        </label>
        {erro && <p role="alert" className="text-sm text-red-400">{erro}</p>}
        <button type="submit" className={`w-full bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 ${foco}`}>Calcular minha cafeína</button>
      </form>

      {res && dose && (
        <div ref={resRef} tabIndex={-1} aria-live="polite" className="mt-6 border-t border-white/10 pt-6 outline-none space-y-5">
          <div>
            <p className="text-sm text-gray-400">Sua cafeína num dia comum</p>
            <p className="text-5xl font-bold text-white my-1" style={h}>{fmtInt(res.total)} mg</p>
            <p className="text-gray-300">{fmt1(res.total / res.peso)} mg por kg · limite para o seu perfil: <strong className="text-white">{fmtInt(arred5(lim))} mg por dia</strong></p>
            <div className="h-3 bg-white/10 mt-3" aria-hidden="true"><div className="h-3" style={{ width: `${pct}%`, background: cor }} /></div>
            <p className="mt-3" style={{ color: cor }}>
              {res.total > lim ? `Acima do limite em ${fmtInt(res.total - lim)} mg.` : res.total > lim * 0.75 ? "Perto do limite. Qualquer café a mais passa dele." : "Dentro do limite."}
            </p>
            {res.perfil === "gestante" && <p className="text-sm text-gray-400 mt-2">Na gestação e na amamentação o limite cai para 200 mg por dia. Confirme com quem acompanha o seu pré-natal.</p>}
            {res.perfil === "menor" && <p className="text-sm text-gray-400 mt-2">Para menores de 18 o limite é 3 mg por kg por dia, e pré-treino e energético não são indicados.</p>}
          </div>

          {res.perfil === "adulto" && (
            <div className="border border-white/15 p-4">
              <p className="text-white font-semibold mb-1">Cafeína para treinar</p>
              <p className="text-gray-300 text-sm leading-relaxed">Os estudos usam de 3 a 6 mg por kg, uns 60 minutos antes: para {fmt1(res.peso)} kg, de <strong className="text-white">{fmtInt(arred5(dose.de))} a {fmtInt(arred5(dose.ate))} mg</strong>. Doses a partir de 2 mg por kg ({fmtInt(arred5(dose.minima))} mg) podem já funcionar.{" "}
                {dose.de > LIMITE_DOSE_UNICA && <>Repare que a ponta de baixo já passa dos 200 mg que a EFSA considera seguros numa dose única: comece por baixo e veja como você reage.</>}
                {" "}Acima de 9 mg por kg ({fmtInt(arred5(dose.excessiva))} mg) os efeitos colaterais disparam sem ganho no treino.</p>
            </div>
          )}

          {(hCafe || hPre) && (
            <div className="border border-white/15 p-4">
              <p className="text-white font-semibold mb-1">Para não atrapalhar o sono (dormindo às {res.dormir})</p>
              <ul className="text-gray-300 text-sm space-y-1">
                {hCafe && <li>Último café até as <strong className="text-white">{hCafe}</strong> (cerca de 9 horas antes).</li>}
                {hPre && res.perfil !== "menor" && <li>Pré-treino com uns 200 mg até as <strong className="text-white">{hPre}</strong> (cerca de 13 horas antes).</li>}
              </ul>
              <p className="text-[11px] text-gray-500 mt-2">Cada pessoa metaboliza cafeína num ritmo: se você dorme mal, antecipe ainda mais.</p>
            </div>
          )}

          <p className="text-xs text-gray-500">O teor de cada bebida é a média da EFSA; o café de verdade varia muito com o pó e o preparo. Para entender dose e horário no treino, leia <Link href="/blog/cafeina-no-treino-dose-timing" className={ln}>cafeína como pré-treino</Link>.</p>

          <div className="border border-white/15 p-4">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white text-sm leading-relaxed mb-3">{t}</p>)}
            <p className="text-gray-200 text-sm leading-relaxed">Esse número é um ponto de partida. Quer ajuda para transformar isso em um plano para você?</p>
            <a href={getWhatsAppUrl("Oi Montinho! Usei a calculadora de cafeína do site e queria ajuda para montar meu plano de treino.")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("caffeine_whatsapp", { perfil: res.perfil })} className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>Falar com o Montinho no WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}
