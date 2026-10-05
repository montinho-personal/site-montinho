"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import {
  IDADE_MAX, IDADE_MIN, NIVEIS, PASSADA_MAX, PASSADA_MIN, PASSOS_MAX, PESO_MAX, PESO_MIN, RITMOS,
  arredondaKcal, arredondaPassos, diasParaUmQuilo, fmtInt, fmtKm, formataTempo, gasto, meta, nivel, parseNumero, passosPorKm, type RitmoId,
} from "@/lib/passos";

/**
 * Nada sai do navegador. Os eventos levam só o nível de atividade e o
 * ritmo, nunca passos, idade ou peso.
 */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const campo = `w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-xl font-bold px-4 py-3 outline-none ${foco}`;
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const RITMOS_USADOS = RITMOS.filter((r) => r.id !== "muito-rapido");

interface Res { passos: number; idade: number; peso: number; ritmo: RitmoId; passada: number | null }

export default function CalculadoraPassos() {
  const [passos, setPassos] = useState("");
  const [idade, setIdade] = useState("");
  const [peso, setPeso] = useState("");
  const [rit, setRit] = useState<RitmoId>("moderado");
  const [passada, setPassada] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [res, setRes] = useState<Res | null>(null);
  const iniciou = useRef(false);
  const resRef = useRef<HTMLDivElement>(null);

  useEffect(() => { trackOncePerSession("steps_view", {}); }, []);
  const muda = (fn: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!iniciou.current) { iniciou.current = true; trackEvent("steps_started", {}); }
    fn(e.target.value); setRes(null);
  };

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    const p = parseNumero(passos.replace(/\./g, ""));
    const i = parseNumero(idade);
    const kg = parseNumero(peso);
    const pa = passada.trim() ? parseNumero(passada) : null;
    if (p === null || p < 100 || p > PASSOS_MAX) return setErro("Digite quantos passos você dá por dia, entre 100 e 60.000. O número está no app de saúde do celular ou no relógio.");
    if (i === null || i < IDADE_MIN || i > IDADE_MAX) return setErro(`Digite a idade, entre ${IDADE_MIN} e ${IDADE_MAX} anos.`);
    if (kg === null || kg < PESO_MIN || kg > PESO_MAX) return setErro(`Digite o peso, entre ${PESO_MIN} e ${PESO_MAX} kg.`);
    if (passada.trim() && (pa === null || pa < PASSADA_MIN || pa > PASSADA_MAX)) return setErro(`A passada vai de ${PASSADA_MIN} a ${PASSADA_MAX} cm. Se não souber, deixe em branco.`);
    setErro(null);
    setRes({ passos: Math.round(p), idade: i, peso: kg, ritmo: rit, passada: pa });
    trackEvent("steps_completed", { nivel: nivel(p).id, ritmo: rit });
    setTimeout(() => resRef.current?.focus(), 50);
  }

  const m = res ? meta(res.idade) : null;
  const n = res ? nivel(res.passos) : null;
  const g = res ? gasto(res.passos, res.peso, res.ritmo, res.passada) : null;
  const faltam = res && m ? Math.max(0, m.min - res.passos) : 0;
  const gFalta = res && faltam ? gasto(faltam, res.peso, res.ritmo, res.passada) : null;
  const pos = res ? Math.min(100, (res.passos / 15000) * 100) : 0;

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" data-testid="calculadora-passos">
      <form onSubmit={calcular} noValidate className="grid sm:grid-cols-3 gap-4">
        <label className="block sm:col-span-3">
          <span className="block text-sm text-gray-300 mb-1">Passos por dia (média)</span>
          <input inputMode="numeric" className={campo} value={passos} onChange={muda(setPassos)} placeholder="Ex.: 6000" />
        </label>
        <label className="block">
          <span className="block text-sm text-gray-300 mb-1">Idade</span>
          <input inputMode="numeric" className={campo} value={idade} onChange={muda(setIdade)} placeholder="Ex.: 35" />
        </label>
        <label className="block">
          <span className="block text-sm text-gray-300 mb-1">Peso (kg)</span>
          <input inputMode="decimal" className={campo} value={peso} onChange={muda(setPeso)} placeholder="Ex.: 70" />
        </label>
        <label className="block">
          <span className="block text-sm text-gray-300 mb-1">Passada (cm, opcional)</span>
          <input inputMode="decimal" className={campo} value={passada} onChange={muda(setPassada)} placeholder="Ex.: 70" />
        </label>
        <fieldset className="sm:col-span-3">
          <legend className="text-sm text-gray-300 mb-2">Ritmo da caminhada</legend>
          <div className="grid grid-cols-3 gap-2">
            {RITMOS_USADOS.map((r) => (
              <button key={r.id} type="button" aria-pressed={rit === r.id} onClick={() => { setRit(r.id); setRes(null); }}
                className={`border px-3 py-3 text-sm min-h-[48px] ${rit === r.id ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300"} ${foco}`}>
                {r.nome}<span className="block text-[11px] text-gray-500">{r.faixa}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <p className="sm:col-span-3 text-xs text-gray-500">Para medir a passada: conte 10 passos normais, meça a distância com uma trena e divida por 10.</p>
        {erro && <p role="alert" className="sm:col-span-3 text-sm text-red-400">{erro}</p>}
        <button type="submit" className={`sm:col-span-3 bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 ${foco}`}>Calcular meus passos</button>
      </form>

      {res && m && n && g && (
        <div ref={resRef} tabIndex={-1} aria-live="polite" className="mt-6 border-t border-white/10 pt-6 outline-none space-y-5">
          <div>
            <p className="text-sm text-gray-400">Sua meta para {m.rotulo}</p>
            <p className="text-4xl font-bold text-white my-1" style={h}>{fmtInt(m.min)} a {fmtInt(m.max)} passos/dia</p>
            <p className="text-gray-300">
              {res.passos >= m.min
                ? <>Com {fmtInt(res.passos)} passos você já está na faixa em que o benefício praticamente se estabiliza. Manter vale mais que subir.</>
                : <>Faltam cerca de <strong className="text-white">{fmtInt(arredondaPassos(faltam))} passos</strong> por dia para chegar ao começo da faixa{gFalta && <>: uns {formataTempo(gFalta.minutos)} a mais de caminhada, que podem ser picados ao longo do dia</>}.</>}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Nível de atividade hoje</p>
            <p className="text-lg font-semibold" style={{ color: n.cor }}>{n.nome} ({n.faixa} passos)</p>
            <div className="relative h-3 mt-2 flex" aria-hidden="true">
              {[5000, 2500, 2500, 2500, 2500].map((w, k) => <div key={k} style={{ flex: w, background: NIVEIS[k].cor }} />)}
              <div className="absolute -top-1 w-1 h-5 bg-white" style={{ left: `calc(${pos}% - 2px)` }} />
            </div>
            <div className="flex justify-between text-[11px] text-gray-500 mt-1" aria-hidden="true"><span>0</span><span>5 mil</span><span>10 mil</span><span>15 mil</span></div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="border border-white/15 p-3"><p className="text-2xl font-bold text-white">{arredondaKcal(g.kcal)}</p><p className="text-xs text-gray-400">kcal</p></div>
            <div className="border border-white/15 p-3"><p className="text-2xl font-bold text-white">{fmtKm(g.km)}</p><p className="text-xs text-gray-400">km</p></div>
            <div className="border border-white/15 p-3"><p className="text-2xl font-bold text-white">{formataTempo(g.minutos)}</p><p className="text-xs text-gray-400">de caminhada</p></div>
          </div>
          <p className="text-xs text-gray-500">
            {fmtInt(res.passos)} passos em ritmo {RITMOS.find((r) => r.id === res.ritmo)?.nome.toLowerCase()}, como se fossem caminhados seguidos. O gasto é bruto: inclui o que você gastaria parado nesse tempo.{" "}
            {res.passada ? <>Com a sua passada de {fmtKm(res.passada)} cm, 1 km tem cerca de {fmtInt(passosPorKm(res.passada))} passos.</> : <>Sem a passada, o km vem do ritmo escolhido; meça a sua para um número mais fiel.</>}
          </p>
          <p className="text-gray-300 text-sm">Se esse gasto entrasse num déficit sem ser compensado na comida, levaria uns {fmtInt(diasParaUmQuilo(g.kcal))} dias para somar o equivalente a 1 kg de gordura. Na vida real o corpo compensa parte disso, então use como ordem de grandeza. Para ver o tempo, a inclinação e a esteira em detalhe, use a <Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>calculadora de calorias da caminhada</Link>.</p>

          <div className="border border-white/15 p-4">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white text-sm leading-relaxed mb-3">{t}</p>)}
            <p className="text-gray-200 text-sm leading-relaxed">Esse número é um ponto de partida. Quer ajuda para transformar isso em um plano para você?</p>
            <a href={getWhatsAppUrl("Oi Montinho! Fiz a calculadora de passos no site e queria ajuda para montar um plano.")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("steps_whatsapp", { nivel: n.id })} className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>Falar com o Montinho no WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}
