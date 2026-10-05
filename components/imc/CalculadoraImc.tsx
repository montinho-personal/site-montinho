"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import { FAIXAS_IMC, faixaImc, faixaPesoNormal, fmt1, imc, parseNumero } from "@/lib/imc";

/** Nada sai do navegador. Os eventos levam só a faixa e se a pessoa treina. */

const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const campo = `w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-xl font-bold px-4 py-3 outline-none ${foco}`;
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const chip = (on: boolean) => `border px-3 py-3 text-sm min-h-[48px] ${on ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300"} ${foco}`;

export default function CalculadoraImc() {
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [treina, setTreina] = useState<boolean | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [res, setRes] = useState<{ v: number; alturaM: number; treina: boolean } | null>(null);
  const iniciou = useRef(false);
  const resRef = useRef<HTMLDivElement>(null);

  useEffect(() => { trackOncePerSession("bmi_view", {}); }, []);
  const muda = (fn: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!iniciou.current) { iniciou.current = true; trackEvent("bmi_started", {}); }
    fn(e.target.value); setRes(null);
  };

  function calcular(e: React.FormEvent) {
    e.preventDefault();
    const kg = parseNumero(peso);
    const bruto = parseNumero(altura);
    const m = bruto !== null && bruto > 3 ? bruto / 100 : bruto; // aceita 175 ou 1,75
    if (kg === null || kg < 30 || kg > 300) return setErro("Digite o peso em kg, entre 30 e 300.");
    if (m === null || m < 1.2 || m > 2.3) return setErro("Digite a altura em metros (1,75) ou em centímetros (175).");
    if (treina === null) return setErro("Responda se você treina força com regularidade: muda a leitura do resultado.");
    setErro(null);
    const v = imc(kg, m);
    setRes({ v, alturaM: m, treina });
    const faixaId = faixaImc(v).id;
    trackEvent("bmi_completed", { faixa: faixaId, treina: treina ? "sim" : "nao" });
    setTimeout(() => resRef.current?.focus(), 50);
  }

  const f = res ? faixaImc(res.v) : null;
  const pn = res ? faixaPesoNormal(res.alturaM) : null;
  const pos = res ? Math.min(100, Math.max(0, ((res.v - 15) / 30) * 100)) : 0;
  const limites = [15, 18.5, 25, 30, 35, 40, 45];

  return (
    <div className="border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" data-testid="calculadora-imc">
      <form onSubmit={calcular} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="block text-sm text-gray-300 mb-1">Peso (kg)</span>
            <input inputMode="decimal" className={campo} value={peso} onChange={muda(setPeso)} placeholder="Ex.: 70" />
          </label>
          <label className="block">
            <span className="block text-sm text-gray-300 mb-1">Altura</span>
            <input inputMode="decimal" className={campo} value={altura} onChange={muda(setAltura)} placeholder="Ex.: 1,70" />
          </label>
        </div>
        <fieldset>
          <legend className="text-sm text-gray-300 mb-2">Você treina musculação com regularidade?</legend>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" aria-pressed={treina === true} onClick={() => { setTreina(true); setRes(null); }} className={chip(treina === true)}>Sim</button>
            <button type="button" aria-pressed={treina === false} onClick={() => { setTreina(false); setRes(null); }} className={chip(treina === false)}>Não</button>
          </div>
        </fieldset>
        <p className="text-xs text-gray-500">Para adultos. Em crianças e adolescentes o IMC se lê por curva de idade e sexo, com o pediatra.</p>
        {erro && <p role="alert" className="text-sm text-red-400">{erro}</p>}
        <button type="submit" className={`w-full bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 ${foco}`}>Calcular meu IMC</button>
      </form>

      {res && f && pn && (
        <div ref={resRef} tabIndex={-1} aria-live="polite" className="mt-6 border-t border-white/10 pt-6 outline-none space-y-4">
          <div>
            <p className="text-sm text-gray-400">Seu IMC</p>
            <p className="text-5xl font-bold text-white my-1" style={h}>{fmt1(res.v)}</p>
            <p className="text-lg font-semibold" style={{ color: f.cor }}>{f.nome}</p>
          </div>
          <div>
            <div className="relative h-3 flex" aria-hidden="true">
              {FAIXAS_IMC.map((x, k) => <div key={x.id} style={{ flex: limites[k + 1] - limites[k], background: x.cor }} />)}
              <div className="absolute -top-1 w-1 h-5 bg-white" style={{ left: `calc(${pos}% - 2px)` }} />
            </div>
            <div className="flex justify-between text-[11px] text-gray-500 mt-1" aria-hidden="true"><span>15</span><span>25</span><span>35</span><span>45</span></div>
          </div>
          <p className="text-gray-300">Para {res.alturaM.toFixed(2).replace(".", ",")} m, o IMC normal vai de <strong className="text-white">{fmt1(pn.de)} a {fmt1(pn.ate)} kg</strong>.</p>

          <div className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.06] p-4">
            <p className="text-white font-semibold mb-1">{res.treina ? "Para quem treina, o IMC engana" : "O IMC é só o começo da conversa"}</p>
            <p className="text-gray-200 text-sm leading-relaxed">
              {res.treina
                ? "O IMC só enxerga peso e altura. Ele não sabe se o seu peso é músculo ou gordura: quem ganhou massa costuma cair em \"sobrepeso\" estando magro. Para saber como você está de verdade, olhe a gordura, não o peso."
                : "O IMC só enxerga peso e altura. Duas pessoas com o mesmo IMC podem ter corpos bem diferentes: uma com mais músculo, outra com mais gordura na barriga. Ele serve de triagem, não de diagnóstico."}
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              <li>→ <Link href="/ferramentas/calculadora-percentual-de-gordura" className={ln} onClick={() => trackEvent("bmi_better_tool", { ferramenta: "gordura" })}>Calculadora de Percentual de Gordura</Link> <span className="text-gray-400">— separa músculo de gordura</span></li>
              <li>→ <Link href="/ferramentas/relacao-cintura-altura" className={ln} onClick={() => trackEvent("bmi_better_tool", { ferramenta: "cintura" })}>Relação Cintura-Altura</Link> <span className="text-gray-400">— mostra a gordura da barriga, a que mais pesa na saúde</span></li>
            </ul>
          </div>

          <div className="border border-white/15 p-4">
            <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white text-sm leading-relaxed mb-3">{t}</p>)}
            <p className="text-gray-200 text-sm leading-relaxed">Esse número é um ponto de partida. Quer ajuda para transformar isso em um plano para você?</p>
            <a href={getWhatsAppUrl("Oi Montinho! Calculei meu IMC no site e queria ajuda para montar um plano.")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("bmi_whatsapp", { faixa: f.id })} className={`mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 ${foco}`}>Falar com o Montinho no WhatsApp</a>
          </div>
        </div>
      )}
    </div>
  );
}
