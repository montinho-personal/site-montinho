"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  ESTACOES,
  KM_CORRIDA,
  NOTA_TEMPO,
  ROXZONE,
  estacaoValida,
  formataPace,
  formataTempo,
  ganhos,
  maisLenta,
  metaValida,
  paceParaMeta,
  paceValido,
  parseMinSeg,
  parsePace,
  parseTempoFinal,
  preve,
  roxValida,
} from "@/lib/hyrox-tempo";

/**
 * A Calculadora de Tempo do Hyrox.
 *
 * DUAS PERGUNTAS, A MESMA SOMA
 *
 *   - "Quanto vou fazer?": pace + estações + Roxzone → tempo final.
 *   - "Quero fazer em X": meta − estações − Roxzone → pace necessário.
 *
 * As estações entram como média (o que quase todo mundo sabe dizer) ou
 * uma a uma, para quem já fez simulado. Nada sai do navegador.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const campoP =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-base font-semibold px-3 py-2 outline-none transition-colors w-24";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
const pct = (a: number, b: number) => `${Math.round((a / b) * 100)}%`;

type Modo = "prever" | "meta";

export default function CalculadoraTempoHyrox({ placement }: { placement: string }) {
  const [modo, setModo] = useState<Modo>("prever");
  const [paceTexto, setPaceTexto] = useState("");
  const [metaTexto, setMetaTexto] = useState("");
  const [mediaTexto, setMediaTexto] = useState("");
  const [detalhar, setDetalhar] = useState(false);
  const [detalhe, setDetalhe] = useState<string[]>(() => ESTACOES.map(() => ""));
  const [roxTexto, setRoxTexto] = useState("");

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const pace = parsePace(paceTexto);
  const paceOk = paceValido(pace);
  const meta = parseTempoFinal(metaTexto);
  const metaOk = metaValida(meta);
  const media = parseMinSeg(mediaTexto);
  const mediaOk = estacaoValida(media);
  const detalheSeg = detalhe.map((t) => parseMinSeg(t));
  const detalheOk = detalheSeg.every((s) => estacaoValida(s));
  const estacoes: number | number[] | null = detalhar ? (detalheOk ? (detalheSeg as number[]) : null) : mediaOk ? media : null;
  const rox = parseMinSeg(roxTexto);
  const roxOk = roxValida(rox);

  const prontoBase = estacoes !== null && roxOk;
  const resultado = modo === "prever" && prontoBase && paceOk ? preve(pace, estacoes, rox) : null;
  const paceMeta = modo === "meta" && prontoBase && metaOk ? paceParaMeta(meta, estacoes, rox) : null;
  const metaNaoFecha = modo === "meta" && prontoBase && metaOk && paceMeta === null;
  const resultadoMeta = paceMeta !== null && estacoes !== null && roxOk ? preve(paceMeta, estacoes, rox) : null;
  const r = resultado ?? resultadoMeta;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("hyrox_time_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const temResultado = r !== null;
  useEffect(() => {
    if (temResultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("hyrox_time_use", { placement, modo, detalhado: detalhar });
    }
  }, [temResultado, placement, modo, detalhar]);

  const idc = (s: string) => `${s}-hyrox-tempo-${placement}`;
  const ajuda = (texto: string, ok: boolean, msg: string) => (texto.trim() !== "" && !ok ? msg : "");

  const linhasShare = r
    ? modo === "prever"
      ? [`Hyrox: ${formataTempo(r.totalSeg)}`, `pace ${formataPace(r.corridaSeg / KM_CORRIDA)}/km`]
      : [`Meta ${formataTempo(r.totalSeg)}`, `pace ${formataPace(paceMeta!)}/km`]
    : [];
  const pedidoWhats = r
    ? `Oi Montinho! Usei a calculadora de tempo do Hyrox: ${modo === "prever" ? `previsão de ${formataTempo(r.totalSeg)}` : `meta de ${formataTempo(r.totalSeg)} pedindo pace de ${formataPace(paceMeta!)}`}. Queria ajuda para montar a preparação.`
    : "";

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative" data-testid="calculadora-tempo-hyrox">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · nada sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto tempo você vai fazer no Hyrox?
      </h2>

      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="O que você quer saber">
        <button type="button" aria-pressed={modo === "prever"} className={chip(modo === "prever")} onClick={() => setModo("prever")}>
          Prever meu tempo
        </button>
        <button type="button" aria-pressed={modo === "meta"} className={chip(modo === "meta")} onClick={() => setModo("meta")}>
          Tenho uma meta de tempo
        </button>
      </div>

      {modo === "prever" ? (
        <div className="mb-6">
          <label htmlFor={idc("pace")} className="block text-gray-300 text-sm font-medium mb-2">Pace da corrida na prova (por km)</label>
          <input id={idc("pace")} type="text" inputMode="text" autoComplete="off" placeholder="6:00" value={paceTexto}
            onChange={(e) => setPaceTexto(e.target.value)} className={`w-36 ${campo}`} />
          <p className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {ajuda(paceTexto, paceOk, "Use o pace entre 3:00 e 10:00 por km, como 6:00.") ||
              "O ritmo que você aguenta correndo cansado, não o do seu melhor 5 km."}
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <label htmlFor={idc("meta")} className="block text-gray-300 text-sm font-medium mb-2">Sua meta de tempo final</label>
          <input id={idc("meta")} type="text" inputMode="text" autoComplete="off" placeholder="1h30" value={metaTexto}
            onChange={(e) => setMetaTexto(e.target.value)} className={`w-36 ${campo}`} />
          <p className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {ajuda(metaTexto, metaOk, "Use a meta entre 45 min e 4h, como 1h30 ou 1:30:00.") || "Como 1h30, 1:30 ou 1:29:59."}
          </p>
        </div>
      )}

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2">Tempo nas estações</span>
        <div className="flex flex-wrap gap-2 mb-3">
          <button type="button" aria-pressed={!detalhar} className={chip(!detalhar)} onClick={() => setDetalhar(false)}>Média por estação</button>
          <button type="button" aria-pressed={detalhar} className={chip(detalhar)} onClick={() => setDetalhar(true)}>Uma a uma</button>
        </div>
        {!detalhar ? (
          <>
            <label htmlFor={idc("media")} className="sr-only">Tempo médio por estação</label>
            <input id={idc("media")} type="text" inputMode="text" autoComplete="off" placeholder="5:00" value={mediaTexto}
              onChange={(e) => setMediaTexto(e.target.value)} className={`w-36 ${campo}`} />
            <p className="text-gray-400 text-sm mt-2 min-h-[20px]">
              {ajuda(mediaTexto, mediaOk, "Use entre 1:00 e 15:00 por estação.") ||
                "Quanto você leva, em média, em cada uma das 8 estações. Fez simulado? Use “uma a uma”."}
            </p>
          </>
        ) : (
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2" data-testid="estacoes-detalhe">
            {ESTACOES.map((e, i) => (
              <label key={e.id} htmlFor={idc(e.id)} className="flex items-center justify-between gap-3 border-b border-white/10 py-1.5">
                <span className="text-gray-300 text-sm">{i + 1}. {e.nome.split(" (")[0]} · {e.distancia}</span>
                <input id={idc(e.id)} type="text" inputMode="text" autoComplete="off" placeholder="5:00" value={detalhe[i]}
                  onChange={(ev) => setDetalhe(detalhe.map((x, j) => (j === i ? ev.target.value : x)))} className={campoP} />
              </label>
            ))}
            <p className="text-gray-400 text-sm sm:col-span-2 mt-1 min-h-[20px]">
              {detalhe.some((t, i) => t.trim() !== "" && !estacaoValida(detalheSeg[i])) ? "Cada estação entre 1:00 e 15:00." : "Minutos e segundos, como 4:30."}
            </p>
          </div>
        )}
      </div>

      <div className="mb-3">
        <span className="block text-gray-300 text-sm font-medium mb-2">Roxzone (o total das transições na prova)</span>
        <div className="flex flex-wrap gap-2 mb-3">
          {ROXZONE.map((f) => (
            <button key={f.id} type="button" aria-pressed={rox === f.seg} className={chip(rox === f.seg)}
              onClick={() => { setRoxTexto(formataTempo(f.seg)); trackEvent("hyrox_time_roxzone", { placement, faixa: f.id }); }}>
              {f.nome}: {formataTempo(f.seg)}
            </button>
          ))}
        </div>
        <label htmlFor={idc("rox")} className="sr-only">Roxzone total</label>
        <input id={idc("rox")} type="text" inputMode="text" autoComplete="off" placeholder="6:00" value={roxTexto}
          onChange={(e) => setRoxTexto(e.target.value)} className={`w-36 ${campo}`} />
        <p className="text-gray-400 text-sm mt-2 mb-7 min-h-[20px] max-w-xl">
          {ajuda(roxTexto, roxOk, "Use a Roxzone total entre 1:00 e 20:00.") ||
            "Sem ideia? Escolha a faixa do seu tempo: os valores são a média de 825 resultados de uma etapa do Hyrox."}
        </p>
      </div>

      <div aria-live="polite">
        {metaNaoFecha && (
          <p className="border-l-2 pl-4 text-gray-200 leading-relaxed mb-4" style={{ borderColor: "#BA9E50" }} data-testid="meta-nao-fecha">
            Com esse tempo de estação e de Roxzone, a meta não fecha: sobraria pouco ou nenhum tempo para os {KM_CORRIDA} km de corrida.
            Para chegar nela, as estações precisam ficar mais curtas — ou a meta, mais longa.
          </p>
        )}

        {r && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">{modo === "prever" ? "Tempo final previsto" : "Pace que fecha a meta"}</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none tabular-nums" style={h} data-testid="resultado-principal">
                  {modo === "prever" ? formataTempo(r.totalSeg) : <>{formataPace(paceMeta!)}<span className="text-lg font-normal text-gray-300"> /km</span></>}
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {modo === "prever" ? `com pace de ${formataPace(pace!)} por km` : `para terminar em ${formataTempo(r.totalSeg)}`}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-2">Onde vai o tempo</p>
                <ul className="text-white text-sm space-y-1 tabular-nums">
                  <li><strong>{formataTempo(r.corridaSeg)}</strong> de corrida ({pct(r.corridaSeg, r.totalSeg)})</li>
                  <li><strong>{formataTempo(r.estacoesSeg)}</strong> nas estações ({pct(r.estacoesSeg, r.totalSeg)})</li>
                  <li><strong>{formataTempo(r.roxSeg)}</strong> na Roxzone ({pct(r.roxSeg, r.totalSeg)})</li>
                </ul>
              </div>
            </div>

            <div className="mb-5" data-testid="ganhos">
              <p className="text-white font-semibold mb-2">Onde estão os seus minutos</p>
              <ul className="space-y-1.5 text-sm max-w-xl">
                {ganhos(r).map((g) => (
                  <li key={g.id} className="flex justify-between gap-4 border-b border-white/10 pb-1.5">
                    <span className="text-gray-300">{g.texto}</span>
                    <span className="text-white tabular-nums">− {formataTempo(g.seg)}</span>
                  </li>
                ))}
              </ul>
              {detalhar && (
                <p className="text-gray-300 text-sm mt-3 max-w-xl">
                  A sua estação mais longa é <strong className="text-white">{maisLenta(r).estacao.nome.split(" (")[0]}</strong> ({formataTempo(maisLenta(r).seg)}): costuma ser
                  ali que técnica e força rendem mais minuto por semana de treino.
                </p>
              )}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_TEMPO}</p>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Tempo do Hyrox" caminho="/ferramentas/calculadora-tempo-hyrox"
                local="tool_result" ferramenta="hyrox-tempo" resultado={linhasShare} gancho="Fiz a conta do meu Hyrox:" aparencia="solido" />
              {placement !== "calculadora-tempo-hyrox" && (
                <Link href="/ferramentas/calculadora-tempo-hyrox" onClick={() => trackEvent("hyrox_time_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <div className="border border-white/15 p-4" data-testid="fechamento">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: "#BA9E50" }}>{FECHAMENTO_COMPARACAO.titulo}</p>
              {FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white text-sm leading-relaxed mb-3">{t}</p>)}
              <p className="text-gray-200 text-sm leading-relaxed">
                Esse número é um ponto de partida. Quer ajuda para transformar isso em um plano de preparação para você?
              </p>
              <a href={getWhatsAppUrl(pedidoWhats)} target="_blank" rel="noopener noreferrer"
                onClick={() => trackEvent("hyrox_time_whatsapp", { placement, modo })}
                className="mt-3 inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60">
                Falar com o Montinho no WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        Quer saber quanto a prova gasta? Veja a <Link href="/ferramentas/calculadora-calorias-hyrox" className={ln}>Calculadora de Calorias no Hyrox</Link>.
      </p>
    </div>
  );
}
