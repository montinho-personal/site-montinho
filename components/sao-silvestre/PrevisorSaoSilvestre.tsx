"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { useAgora } from "@/components/olympia/useAgora";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import {
  REFERENCIAS, fmtFaixa, formataRelogio, fmtPaceFaixa, lerTempo, prever, semanasAteAProva, validaReferencia,
  type Previsao, type ReferenciaId,
} from "@/lib/sao-silvestre";

/**
 * Previsor de tempo da São Silvestre. Tudo no navegador; o analytics recebe
 * a distância de referência e o nível, NUNCA o tempo digitado.
 */

const OURO = "#BA9E50";
const campo = "w-full bg-black border border-white/25 px-4 py-3 text-lg text-white focus:outline-none focus:border-[#BA9E50] focus-visible:ring-2 focus-visible:ring-[#BA9E50]/60";
const opcao = (on: boolean) =>
  `px-4 py-3 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50]/60 ${on ? "border-[#BA9E50] bg-[#BA9E50]/10 text-white" : "border-white/20 text-gray-300 hover:border-white/50"}`;
const btnPri = "inline-flex items-center justify-center px-6 py-3.5 font-semibold bg-[#BA9E50] text-black hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
const rot = "text-[11px] font-bold tracking-[0.18em] uppercase";

export default function PrevisorSaoSilvestre() {
  const [ref, setRef] = useState<ReferenciaId>("5k");
  const [tempo, setTempo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [res, setRes] = useState<Previsao | null>(null);
  const agora = useAgora(3600000);
  const semanas = agora === null ? null : semanasAteAProva(agora);

  useEffect(() => {
    trackEvent("ss_predictor_view", {});
  }, []);

  const km = REFERENCIAS.find((r) => r.id === ref)!;

  const calcular = () => {
    const seg = lerTempo(tempo);
    if (seg === null) { setErro("Não entendi esse tempo. Digite minutos e segundos, como 28:30 ou 28.30. Acima de uma hora: 1:02:00 ou 1h02."); setRes(null); trackEvent("ss_predictor_error", { reason: "format" }); return; }
    const v = validaReferencia(seg, km.km);
    if (v) { setErro(v); setRes(null); trackEvent("ss_predictor_error", { reason: "range" }); return; }
    setErro(null);
    const p = prever(seg, ref);
    setRes(p);
    trackEvent("ss_predictor_use", { reference: ref, level: p.nivel });
  };

  return (
    <div className="space-y-8" data-testid="previsor-ss">
      <section className="border border-white/15 p-5 sm:p-6 space-y-5">
        <div>
          <p className="text-white font-semibold mb-2">Qual prova você já correu?</p>
          <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Distância de referência">
            {REFERENCIAS.map((r) => (
              <button key={r.id} type="button" role="radio" aria-checked={ref === r.id} className={opcao(ref === r.id)} onClick={() => { setRef(r.id); setRes(null); }}>{r.rotulo}</button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="ss-tempo" className="text-white font-semibold block mb-2">Seu tempo recente nos {km.rotulo.toLowerCase()}</label>
          <input id="ss-tempo" inputMode="decimal" autoComplete="off" placeholder={ref === "21k" ? "ex.: 2:05:00" : ref === "10k" ? "ex.: 58:00" : "ex.: 28:30"} className={campo} value={tempo}
            onChange={(e) => setTempo(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") calcular(); }} />
          <p className="text-gray-500 text-sm mt-2">Pode digitar 28:30, 28.30 ou só 2830. Use um tempo dos últimos 2 ou 3 meses, de prova ou de treino forte.</p>
        </div>
        {erro && <p className="text-red-300 text-sm" role="alert">{erro}{erro.includes("começando") && <> <Link href="/blog/corrida-para-iniciantes" className="underline">Corrida para iniciantes</Link>.</>}</p>}
        <button type="button" className={btnPri} onClick={calcular} disabled={!tempo.trim()}>Prever meu tempo nos 15 km</button>
      </section>

      {res && (
        <>
          <section className="border border-[#BA9E50]/50 p-5 sm:p-6" data-testid="ss-resultado">
            <p className={rot} style={{ color: OURO }}>Seu tempo provável na São Silvestre</p>
            <p className="text-3xl sm:text-4xl font-bold text-white mt-2">{fmtFaixa(res.faixa)}</p>
            <p className="text-gray-300 mt-2">Pace médio de {fmtPaceFaixa(res.paceFaixa)}</p>
            <p className="text-gray-400 text-sm mt-3">Num percurso plano, sem aglomeração, a conta daria {formataRelogio(res.planoSeg)}. A faixa acima soma a subida da Brigadeiro e a largada cheia — uma margem estimada, não medida.</p>
          </section>

          <section>
            <p className={rot} style={{ color: OURO }}>Até 31 de dezembro{semanas !== null && semanas > 0 ? ` — faltam ${semanas} semanas` : ""}</p>
            <div className="mt-3 divide-y divide-white/10 border border-white/15">
              {res.cenarios.map((c) => (
                <div key={c.id} className="flex justify-between gap-4 px-4 py-3">
                  <span className="text-gray-300">{c.rotulo}</span>
                  <span className="text-white font-semibold whitespace-nowrap">{fmtFaixa(c.faixa)}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-2">Os cenários são hipóteses, não promessa. Quanto você melhora depende de por onde começa, de quantas vezes treina e de chegar inteiro no dia.</p>
          </section>

          <section>
            <p className={rot} style={{ color: OURO }}>{FECHAMENTO_COMPARACAO.titulo}</p>
            <div className="space-y-3 mt-2">{FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white leading-relaxed">{t}</p>)}<p className="text-gray-400 text-sm">— Montinho</p></div>
          </section>

          <section className="border border-[#BA9E50]/40 p-5">
            <h3 className="text-xl font-bold text-white">Quer chegar na Paulista inteiro e mais rápido?</h3>
            <p className="text-gray-300 mt-2">O que separa o cenário de cima do de baixo é o plano: quantos treinos por semana, onde entra a força para a subida e como não se machucar antes de dezembro.</p>
            <a href={getWhatsAppUrl("Oi, Montinho! Fiz o previsor da São Silvestre no seu site e quero um plano para chegar bem nos 15 km.")} target="_blank" rel="noopener noreferrer" className={`${btnPri} mt-4`}
              onClick={() => trackEvent("ss_whatsapp_click", { level: res.nivel })}>Falar com o Montinho</a>
          </section>
        </>
      )}
    </div>
  );
}
