"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import { CLASSES, DIST_MAX, DIST_MIN, classe, faixaIdade, fmt1, fmtInt, fmtPace, kmh, paceMinKm, parseNumero, proximaClasse, vo2, type Sexo } from "@/lib/cooper";

/** Nada sai do navegador. Os eventos levam só a classe, nunca distância ou idade. */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const campo = `w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-xl font-bold px-4 py-3 outline-none ${foco}`;
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const chip = (on: boolean) => `border px-3 py-3 text-sm min-h-[48px] ${on ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300"} ${foco}`;

export default function CalculadoraCooper() {
  const [dist, setDist] = useState("");
  const [idade, setIdade] = useState("");
  const [sexo, setSexo] = useState<Sexo>("homem");
  const [erro, setErro] = useState<string | null>(null);
  const [res, setRes] = useState<{ m: number; idade: number; sexo: Sexo } | null>(null);
  const iniciou = useRef(false);
  const resRef = useRef<HTMLDivElement>(null);

  useEffect(() => { trackOncePerSession("cooper_view", {}); }, []);
  const muda = (fn: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!iniciou.current) { iniciou.current = true; trackEvent("cooper_started", {}); }
    fn(e.target.value); setRes(null);
  };

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    const bruto = parseNumero(dist.replace(/\.(?=\d{3}$)/, ""));
    const m = bruto !== null && bruto < 10 ? bruto * 1000 : bruto; // aceita 2,4 (km)
    const i = parseNumero(idade);
    if (m === null || m < DIST_MIN || m > DIST_MAX) return setErro(`Digite a distância dos 12 minutos em metros (ex.: 2400) ou em km (ex.: 2,4), entre ${fmtInt(DIST_MIN)} e ${fmtInt(DIST_MAX)} metros.`);
    if (i === null || i < 20 || i > 90) return setErro("Digite a idade, entre 20 e 90 anos. A tabela de referência é para adultos.");
    setErro(null);
    setRes({ m: Math.round(m), idade: i, sexo });
    trackEvent("cooper_completed", { classe: classe(m, sexo, i).id });
    setTimeout(() => resRef.current?.focus(), 50);
  }

  const c = res ? classe(res.m, res.sexo, res.idade) : null;
  const prox = res ? proximaClasse(res.m, res.sexo, res.idade) : null;

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" data-testid="calculadora-cooper">
      <form onSubmit={calcular} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block col-span-2">
            <span className="block text-sm text-gray-300 mb-1">Distância em 12 minutos (metros)</span>
            <input inputMode="decimal" className={campo} value={dist} onChange={muda(setDist)} placeholder="Ex.: 2400" />
          </label>
          <label className="block">
            <span className="block text-sm text-gray-300 mb-1">Idade</span>
            <input inputMode="numeric" className={campo} value={idade} onChange={muda(setIdade)} placeholder="Ex.: 30" />
          </label>
          <fieldset>
            <legend className="text-sm text-gray-300 mb-1">Sexo</legend>
            <div className="grid grid-cols-2 gap-2">
              {(["homem", "mulher"] as Sexo[]).map((s) => <button key={s} type="button" aria-pressed={sexo === s} onClick={() => { setSexo(s); setRes(null); }} className={chip(sexo === s)}>{s === "homem" ? "Homem" : "Mulher"}</button>)}
            </div>
          </fieldset>
        </div>
        {erro && <p role="alert" className="text-sm text-red-400">{erro}</p>}
        <button type="submit" className={`w-full bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 ${foco}`}>Calcular meu VO₂ máx</button>
      </form>

      {res && c && (
        <div ref={resRef} tabIndex={-1} aria-live="polite" className="mt-6 border-t border-white/10 pt-6 outline-none space-y-4">
          <div>
            <p className="text-sm text-gray-400">VO₂ máx estimado</p>
            <p className="text-5xl font-bold text-white my-1" style={h}>{fmt1(vo2(res.m))} <span className="text-xl text-gray-400">ml/kg/min</span></p>
            <p className="text-lg font-semibold" style={{ color: c.cor }}>{c.nome} para {res.sexo === "homem" ? "homens" : "mulheres"} de {faixaIdade(res.idade).replace("-", " a ").replace("+", " anos ou mais")}{faixaIdade(res.idade).includes("+") ? "" : " anos"}</p>
          </div>
          <div className="flex gap-1" aria-hidden="true">
            {[...CLASSES].reverse().map((k) => <div key={k.id} className="flex-1 h-3" style={{ background: k.cor, opacity: k.id === c.id ? 1 : 0.25 }} />)}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="border border-white/15 p-3"><p className="text-xl font-bold text-white">{fmtInt(res.m)} m</p><p className="text-xs text-gray-400">distância</p></div>
            <div className="border border-white/15 p-3"><p className="text-xl font-bold text-white">{fmt1(kmh(res.m))}</p><p className="text-xs text-gray-400">km/h média</p></div>
            <div className="border border-white/15 p-3"><p className="text-xl font-bold text-white">{fmtPace(paceMinKm(res.m)).replace(" min/km", "")}</p><p className="text-xs text-gray-400">min/km</p></div>
          </div>
          {prox && <p className="text-gray-300">Para chegar a <strong className="text-white">{prox.classe.nome.toLowerCase()}</strong>, faltam cerca de {fmtInt(prox.faltam)} metros nos mesmos 12 minutos.</p>}
          <p className="text-xs text-gray-500">Estimativa pela fórmula de Cooper (1968). A fórmula foi criada com militares homens; o erro tende a ser maior em iniciantes e em quem não está acostumado a correr no ritmo máximo. Refaça o teste a cada 6 a 8 semanas, no mesmo lugar, para ver a evolução. Para treinar pelo coração, use as <Link href="/ferramentas/zonas-de-frequencia-cardiaca" className={ln}>zonas de frequência cardíaca</Link>; para prever provas, a <Link href="/ferramentas/calculadora-corrida" className={ln}>calculadora de corrida</Link>.</p>
          <div className="border border-white/15 p-4">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white text-sm leading-relaxed mb-3">{t}</p>)}
            <p className="text-gray-200 text-sm leading-relaxed">Esse número é um ponto de partida. Quer ajuda para transformar isso em um plano para você?</p>
            <a href={getWhatsAppUrl("Oi Montinho! Fiz o teste de Cooper na calculadora do site e queria ajuda para montar um plano.")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("cooper_whatsapp", { classe: c.id })} className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>Falar com o Montinho no WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}
