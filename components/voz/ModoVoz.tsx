"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { falaParaNumero, falaParaOpcao } from "@/lib/voz/numeros";

/**
 * Modo voz: a ferramenta pergunta em voz alta, a pessoa responde falando e
 * o campo se preenche sozinho, passando para a próxima pergunta.
 *
 * Usa só o que o navegador já tem (speechSynthesis para falar,
 * SpeechRecognition para ouvir): sem custo e sem servidor nosso. Os valores
 * ditos NUNCA vão para o GA4 — os eventos registram só uso (início, passo,
 * fim, erro). O teclado continua valendo o tempo todo.
 */

export type PassoVoz =
  | { id: string; pergunta: string; tipo: "numero"; aplicar: (n: number) => string | null }
  | { id: string; pergunta: string; tipo: "opcao"; opcoes: { id: string; chaves: string[] }[]; aplicar: (id: string) => string };

type Estado = "parado" | "falando" | "ouvindo" | "fim" | "erro";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Reconhecedor = any;

const OURO = "#BA9E50";
const VOZ_MASCULINA = /antonio|daniel|ricardo|humberto|fabio|f[aá]bio|julio|j[uú]lio|donato|nicolau|valerio|val[eé]rio|leonardo|thiago|male|mascul/i;

function escolheVoz(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const vs = window.speechSynthesis.getVoices().filter((v) => /^pt(-|_)BR/i.test(v.lang));
  if (!vs.length) return null;
  const pontua = (v: SpeechSynthesisVoice) =>
    (VOZ_MASCULINA.test(v.name) ? 10 : 0) + (/natural|neural|online|premium|enhanced/i.test(v.name) ? 5 : 0) + (v.localService ? 0 : 1);
  return [...vs].sort((a, b) => pontua(b) - pontua(a))[0];
}

// Referências vivas: o Chrome descarta utterances sem referência e corta a fala no meio.
const naFila: SpeechSynthesisUtterance[] = [];

/**
 * Fala frase por frase. O Chrome (sobretudo no Android) interrompe falas
 * longas depois de ~15 s; frases curtas, em fila, chegam até o fim.
 */
function falar(texto: string, voz: SpeechSynthesisVoice | null): Promise<void> {
  return new Promise((ok) => {
    const s = window.speechSynthesis;
    if (!s) return ok();
    s.cancel();
    naFila.length = 0;
    const frases = texto.match(/[^.!?…]+[.!?…]*/g)?.map((f) => f.trim()).filter(Boolean) ?? [texto];
    let restantes = frases.length;
    const vigia = setInterval(() => { if (s.paused) s.resume(); }, 5000);
    const acabou = () => { if (--restantes <= 0) { clearInterval(vigia); naFila.length = 0; ok(); } };
    for (const f of frases) {
      const u = new SpeechSynthesisUtterance(f);
      u.lang = "pt-BR";
      if (voz) u.voice = voz;
      // Sem voz masculina no aparelho: um pouco mais grave.
      u.pitch = voz && VOZ_MASCULINA.test(voz.name) ? 1 : 0.85;
      u.rate = 1.25;
      u.onend = acabou;
      u.onerror = acabou;
      naFila.push(u);
      s.speak(u);
    }
  });
}

export function ouvir(): Promise<string[] | null> {
  return new Promise((ok) => {
    const w = window as unknown as { SpeechRecognition?: new () => Reconhecedor; webkitSpeechRecognition?: new () => Reconhecedor };
    const R = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!R) return ok(null);
    const r = new R();
    r.lang = "pt-BR";
    r.interimResults = false;
    r.maxAlternatives = 3;
    let feito = false;
    r.onresult = (e: Reconhecedor) => {
      feito = true;
      const res = e.results[0];
      ok(Array.from({ length: res.length }, (_, i) => res[i].transcript as string));
    };
    r.onerror = () => { if (!feito) { feito = true; ok([]); } };
    r.onend = () => { if (!feito) { feito = true; ok([]); } };
    r.start();
    ouvindoAtual = r;
  });
}
let ouvindoAtual: Reconhecedor = null;

export default function ModoVoz({ ferramenta, intro, passos, resultado }: {
  /** Só para segmentar eventos. */
  ferramenta: string;
  intro: string;
  passos: PassoVoz[];
  /** Frase do resultado, lida ao final (atualizada a cada render). */
  resultado: string | null;
}) {
  const [suporta, setSuporta] = useState(false);
  const [estado, setEstado] = useState<Estado>("parado");
  const [idx, setIdx] = useState(0);
  const [ouviu, setOuviu] = useState("");
  const [aviso, setAviso] = useState("");
  const voz = useRef<SpeechSynthesisVoice | null>(null);
  const ativo = useRef(false);
  const resultadoRef = useRef(resultado);
  useEffect(() => { resultadoRef.current = resultado; }, [resultado]);

  useEffect(() => {
    const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
    // Detecção no cliente, depois da hidratação: o servidor não sabe se o navegador ouve.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSuporta(!!(w.SpeechRecognition || w.webkitSpeechRecognition) && !!window.speechSynthesis);
    const pega = () => { voz.current = escolheVoz(); };
    pega();
    window.speechSynthesis?.addEventListener?.("voiceschanged", pega);
    return () => { window.speechSynthesis?.removeEventListener?.("voiceschanged", pega); ativo.current = false; window.speechSynthesis?.cancel(); };
  }, []);

  function parar() {
    ativo.current = false;
    window.speechSynthesis?.cancel();
    try { ouvindoAtual?.abort(); } catch { /* já parou */ }
    setEstado("parado");
  }

  async function perguntar(i: number, tentativa = 0): Promise<boolean> {
    const p = passos[i];
    setIdx(i); setOuviu(""); setAviso("");
    setEstado("falando");
    await falar(tentativa ? "Opa, não peguei. Fala de novo pra mim?" : p.pergunta, voz.current);
    if (!ativo.current) return false;
    setEstado("ouvindo");
    const alts = await ouvir();
    if (!ativo.current) return false;
    await new Promise((r) => setTimeout(r, 200)); // Android: soltar o microfone antes de voltar a falar
    if (alts === null) { setEstado("erro"); setAviso("Seu navegador não liberou o microfone."); return false; }
    setOuviu(alts[0] ?? "");
    let confirma: string | null = null;
    for (const a of alts) {
      if (p.tipo === "numero") { const n = falaParaNumero(a); if (n !== null) confirma = p.aplicar(n); }
      else { const o = falaParaOpcao(a, p.opcoes); if (o) confirma = p.aplicar(o); }
      if (confirma) break;
    }
    if (!confirma) {
      if (tentativa < 2) return perguntar(i, tentativa + 1);
      trackEvent("voz_erro", { ferramenta, passo: i + 1, motivo: "nao_entendeu" });
      setEstado("erro"); setAviso("Não consegui entender. Pode digitar nesse campo, ou tocar em continuar por voz.");
      return false;
    }
    trackEvent("voz_passo", { ferramenta, passo: i + 1 });
    setEstado("falando");
    await falar(confirma, voz.current);
    return ativo.current;
  }

  async function rodar(de = 0) {
    ativo.current = true;
    if (de === 0) {
      trackEvent("voz_inicio", { ferramenta });
      if (intro) {
        setEstado("falando");
        await falar(intro, voz.current);
        if (!ativo.current) return;
      }
    }
    for (let i = de; i < passos.length; i++) if (!(await perguntar(i))) return;
    // Dá um respiro para o React recalcular o resultado com o último campo.
    await new Promise((r) => setTimeout(r, 400));
    setEstado("fim");
    trackEvent("voz_fim", { ferramenta });
    await falar(resultadoRef.current ?? "Pronto! Confira o resultado na tela.", voz.current);
    ativo.current = false;
  }

  if (!suporta) return null;

  const rodando = estado === "falando" || estado === "ouvindo";
  return (
    <div className="mb-6 border border-white/15 p-4 sm:p-5" style={{ background: "rgba(186,158,80,.06)" }}>
      {estado === "parado" ? (
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => rodar(0)} className="min-h-[48px] px-5 font-semibold text-black inline-flex items-center gap-2" style={{ background: OURO }}>
            <span aria-hidden>🎙️</span> Responder por voz
          </button>
          <p className="text-gray-400 text-xs leading-relaxed flex-1 min-w-[200px]">
            Eu pergunto, você responde falando. O reconhecimento é do seu navegador (no Chrome, passa pelo Google); nada do que você fala fica no site.
          </p>
        </div>
      ) : (
        <div aria-live="polite">
          <div className="flex items-center justify-between gap-3 mb-2">
            <p className="text-xs uppercase tracking-[0.2em]" style={{ color: OURO }}>
              {estado === "fim" ? "Pronto" : `Pergunta ${idx + 1} de ${passos.length}`}
            </p>
            <button type="button" onClick={parar} className="text-sm text-gray-300 hover:text-white min-h-[44px]">{estado === "fim" ? "fechar" : "parar"}</button>
          </div>
          {estado !== "fim" && <p className="text-white text-lg">{passos[idx]?.pergunta}</p>}
          <p className="text-sm mt-2 min-h-[20px] flex items-center gap-2" style={{ color: estado === "ouvindo" ? OURO : "#9ca3af" }}>
            {estado === "ouvindo" && <span className="inline-block w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: OURO }} aria-hidden />}
            {estado === "ouvindo" ? "Ouvindo… pode falar" : estado === "falando" ? "…" : ouviu ? `Ouvi: “${ouviu}”` : ""}
          </p>
          {aviso && <p className="text-[#E8B4B4] text-sm mt-2" role="status">{aviso}</p>}
          {estado === "erro" && (
            <button type="button" onClick={() => rodar(idx)} className="mt-3 min-h-[44px] px-4 border border-white/25 text-white text-sm">Continuar por voz</button>
          )}
          {rodando && <span className="sr-only">Modo voz ativo</span>}
        </div>
      )}
    </div>
  );
}
