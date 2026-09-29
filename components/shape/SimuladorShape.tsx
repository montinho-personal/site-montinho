"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import {
  ANOS, CENARIOS, CHAVE_PREENCHIDO, URL_SHAPE, CONSISTENCIA, ESTAGIOS, REFERENCIAS,
  calcula, fmt1, fmtAno, fmtFaixaAnos, maiorGargalo, naRegua, referencia, validaEntrada,
  type Anos, type CenarioId, type Consistencia, type Entrada, type Gargalos, type ReferenciaId, type Sexo,
} from "@/lib/shape";

/**
 * Simulador "Quanto tempo para ter shape?". Tudo no navegador; analytics só
 * recebe interação (etapa, referência, clique) — NUNCA peso, altura,
 * gordura, idade ou sexo. O compartilhamento leva só o estágio.
 *
 * A versão compacta dos artigos passa a referência pela URL (?ref=) e os
 * números pelo sessionStorage, para dado corporal nunca entrar em URL.
 */


const OURO = "#BA9E50";
const campo = "w-full bg-black border border-white/25 px-4 py-3 text-lg text-white focus:outline-none focus:border-[#BA9E50] focus-visible:ring-2 focus-visible:ring-[#BA9E50]/60";
const opcao = (on: boolean) =>
  `text-left px-4 py-3 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50]/60 ${on ? "border-[#BA9E50] bg-[#BA9E50]/10 text-white" : "border-white/20 text-gray-300 hover:border-white/50"}`;
const btnPri = "inline-flex items-center justify-center px-6 py-3.5 font-semibold bg-[#BA9E50] text-black hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
const btnSec = "inline-flex items-center justify-center px-5 py-3 border border-white/30 text-white hover:border-white transition-colors";
const rot = "text-[11px] font-bold tracking-[0.18em] uppercase";

const num = (t: string) => {
  const s = t.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};
const kg0 = (v: number) => Math.round(v).toLocaleString("pt-BR");

type Etapa = 1 | 2 | 3 | 4 | 5;
const TITULOS: Record<Exclude<Etapa, 5>, string> = { 1: "Como você está hoje?", 2: "Há quanto tempo você treina?", 3: "Como é sua rotina?", 4: "Qual nível de físico você quer usar como referência?" };

export default function SimuladorShape({ referenciaInicial }: { referenciaInicial?: ReferenciaId }) {
  const [etapa, setEtapa] = useState<Etapa>(1);
  const [sexo, setSexo] = useState<Sexo>("homem");
  const [altura, setAltura] = useState("");
  const [peso, setPeso] = useState("");
  const [gordura, setGordura] = useState("");
  const [naoSei, setNaoSei] = useState(false);
  const [idade, setIdade] = useState("");
  const [anos, setAnos] = useState<Anos | null>(null);
  const [cons, setCons] = useState<Consistencia | null>(null);
  const [dias, setDias] = useState<number | null>(null);
  const [ref, setRef] = useState<ReferenciaId | null>(referenciaInicial ?? null);
  const [erro, setErro] = useState<string | null>(null);
  const iniciou = useRef(false);
  const topo = useRef<HTMLDivElement>(null);

  // Referência pela URL (?ref=) e números vindos da versão compacta (sessionStorage).
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("ref") as ReferenciaId | null;
    const pre: { altura?: string; peso?: string; anos?: Anos } = (() => {
      try { const v = sessionStorage.getItem(CHAVE_PREENCHIDO); sessionStorage.removeItem(CHAVE_PREENCHIDO); return v ? JSON.parse(v) : {}; } catch { return {}; }
    })();
    /* eslint-disable react-hooks/set-state-in-effect -- leitura única de URL/sessionStorage, que não existem no servidor */
    if (p && REFERENCIAS.some((r) => r.id === p)) setRef(p);
    if (pre.altura) setAltura(pre.altura);
    if (pre.peso) setPeso(pre.peso);
    if (pre.anos && pre.anos in ANOS) setAnos(pre.anos);
    /* eslint-enable react-hooks/set-state-in-effect */
    trackEvent("shape_timeline_view", { source: p ? "referencia" : "direto" });
  }, []);

  const entrada: Entrada | null = useMemo(() => {
    const a = num(altura), w = num(peso), g = naoSei ? null : num(gordura), i = num(idade);
    if (a === null || w === null || !anos || !cons || !dias || !ref) return null;
    const e: Entrada = { sexo, alturaCm: a, pesoKg: w, gorduraPct: g, idade: i, anos, consistencia: cons, dias, referencia: ref };
    return validaEntrada(e) ? null : e;
  }, [sexo, altura, peso, gordura, naoSei, idade, anos, cons, dias, ref]);

  const começar = () => { if (!iniciou.current) { iniciou.current = true; trackEvent("shape_timeline_start", {}); } };
  const ir = (e: Etapa) => { setErro(null); setEtapa(e); requestAnimationFrame(() => topo.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" })); };

  const avançar1 = () => {
    const a = num(altura), w = num(peso), g = num(gordura), i = num(idade);
    if (a !== null && a > 1 && a < 3) return setErro("Parece que você digitou em metros. A altura vai em centímetros: 178 em vez de 1,78.");
    const msg = validaEntrada({ sexo, alturaCm: a ?? 0, pesoKg: w ?? 0, gorduraPct: naoSei ? null : g, idade: idade.trim() ? i : null });
    if (msg) return setErro(msg);
    if (!naoSei && g === null) return setErro("Informe seu percentual de gordura ou marque \"Não sei meu percentual\".");
    ir(2);
  };

  return (
    <div ref={topo} className="scroll-mt-24 border border-white/15 bg-[#0b0b0b] p-4 sm:p-6">
      {etapa < 5 && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2"><span>Etapa {etapa} de 4</span>{etapa > 1 && <button type="button" onClick={() => ir((etapa - 1) as Etapa)} className="underline underline-offset-4 hover:text-white">Voltar</button>}</div>
          <div className="h-1 bg-white/10"><div className="h-1 bg-[#BA9E50] transition-[width] motion-reduce:transition-none" style={{ width: `${(etapa / 4) * 100}%` }} /></div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-4" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>{TITULOS[etapa as 1]}</h2>
        </div>
      )}

      {etapa === 1 && (
        <div className="space-y-4" onFocus={começar}>
          <fieldset>
            <legend className="text-sm text-gray-300 mb-2">Sexo (para a fisiologia do modelo)</legend>
            <div className="grid grid-cols-2 gap-2">{(["homem", "mulher"] as Sexo[]).map((s) => <button key={s} type="button" aria-pressed={sexo === s} className={opcao(sexo === s)} onClick={() => setSexo(s)}>{s === "homem" ? "Homem" : "Mulher"}</button>)}</div>
          </fieldset>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="text-sm text-gray-300">Altura (cm)</span><input className={campo} inputMode="decimal" placeholder="178" value={altura} onChange={(e) => setAltura(e.target.value)} /></label>
            <label className="block"><span className="text-sm text-gray-300">Peso (kg)</span><input className={campo} inputMode="decimal" placeholder="79" value={peso} onChange={(e) => setPeso(e.target.value)} /></label>
          </div>
          <label className="block"><span className="text-sm text-gray-300">Percentual de gordura (%)</span>
            <input className={`${campo} ${naoSei ? "opacity-40" : ""}`} inputMode="decimal" placeholder="15" value={gordura} disabled={naoSei} onChange={(e) => setGordura(e.target.value)} />
          </label>
          <label className="flex items-center gap-3 text-gray-300 cursor-pointer"><input type="checkbox" className="w-5 h-5 accent-[#BA9E50]" checked={naoSei} onChange={(e) => setNaoSei(e.target.checked)} />Não sei meu percentual</label>
          {naoSei && (
            <label className="block"><span className="text-sm text-gray-300">Idade <span className="text-gray-500">(opcional — melhora a estimativa sem o percentual)</span></span><input className={campo} inputMode="numeric" placeholder="30" value={idade} onChange={(e) => setIdade(e.target.value)} /></label>
          )}
          {erro && <p role="alert" className="text-red-300 text-sm">{erro}</p>}
          <button type="button" className={`${btnPri} w-full`} onClick={avançar1}>Continuar</button>
        </div>
      )}

      {etapa === 2 && (
        <div className="space-y-5">
          <fieldset>
            <legend className="text-sm text-gray-300 mb-2">Musculação de forma consistente</legend>
            <div className="grid grid-cols-2 gap-2">{(Object.keys(ANOS) as Anos[]).map((k) => <button key={k} type="button" aria-pressed={anos === k} className={opcao(anos === k)} onClick={() => setAnos(k)}>{ANOS[k].rotulo}</button>)}</div>
          </fieldset>
          <fieldset>
            <legend className="text-sm text-gray-300 mb-2">Esse período foi realmente consistente? <span className="text-gray-500">5 anos de matrícula não são 5 anos de treino.</span></legend>
            <div className="grid grid-cols-2 gap-2">{(Object.keys(CONSISTENCIA) as Consistencia[]).map((k) => <button key={k} type="button" aria-pressed={cons === k} className={opcao(cons === k)} onClick={() => setCons(k)}>{CONSISTENCIA[k].rotulo}</button>)}</div>
          </fieldset>
          <button type="button" className={`${btnPri} w-full`} disabled={!anos || !cons} onClick={() => ir(3)}>Continuar</button>
        </div>
      )}

      {etapa === 3 && (
        <div className="space-y-5">
          <fieldset>
            <legend className="text-sm text-gray-300 mb-2">Quantas vezes por semana você costuma treinar?</legend>
            <div className="grid grid-cols-6 gap-2">{[1, 2, 3, 4, 5, 6].map((d) => <button key={d} type="button" aria-pressed={dias === d} className={`${opcao(dias === d)} text-center px-0`} onClick={() => setDias(d)}>{d === 6 ? "6+" : d}</button>)}</div>
          </fieldset>
          <p className="text-xs text-gray-500">Mais dias não aceleram o modelo sozinhos: com o mesmo volume semanal, a frequência quase não muda a hipertrofia. Só 1 treino por semana tende a render menos.</p>
          <button type="button" className={`${btnPri} w-full`} disabled={!dias} onClick={() => ir(4)}>Continuar</button>
        </div>
      )}

      {etapa === 4 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Essas referências representam níveis de muscularidade, não uma promessa de aparência idêntica.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {REFERENCIAS.map((r, i) => (
              <button key={r.id} type="button" aria-pressed={ref === r.id} className={opcao(ref === r.id)} onClick={() => { setRef(r.id); trackEvent("shape_reference_selected", { reference: r.id }); }}>
                <span className={`${rot} block mb-1`} style={{ color: OURO }}>Nível {i + 1}{r.alvo ? "" : " · profissional"}</span>
                <span className="block text-white font-semibold">{r.nome}</span>
                <span className="block text-xs text-gray-400 mt-0.5">{r.descricao}</span>
                {r.atleta && <span className="block text-xs text-gray-500 mt-1">Referência de escala: {r.atleta.nome}</span>}
              </button>
            ))}
          </div>
          <button type="button" className={`${btnPri} w-full`} disabled={!ref || !entrada} onClick={() => { trackEvent("shape_timeline_complete", { reference: ref ?? "" }); ir(5); }}>Ver minha jornada</button>
        </div>
      )}

      {etapa === 5 && entrada && <Resultado e={entrada} setEntrada={(p) => { if (p.dias) setDias(p.dias); if (p.consistencia) setCons(p.consistencia); }} refazer={() => ir(1)} trocarRef={() => ir(4)} />}
    </div>
  );
}

/* ───────────────────────── Resultado ───────────────────────── */

const MARCOS = [1, 3, 6, 10];

function Resultado({ e, setEntrada, refazer, trocarRef }: { e: Entrada; setEntrada: (p: Partial<Entrada>) => void; refazer: () => void; trocarRef: () => void }) {
  const r = useMemo(() => calcula(e), [e]);
  const [anosSlider, setAnosSlider] = useState(3);
  const [cen, setCen] = useState<CenarioId>("consistente");
  const [usouSlider, setUsouSlider] = useState(false);
  const ref = referencia(e.referencia);
  const titulo = { fontFamily: "var(--font-titulo), Georgia, serif" };

  const ponto = (c: CenarioId, anos: number) => r.cenarios[c][Math.round(anos * 12)];
  const faixaGanho = (anos: number): [number, number] => [ponto("conservador", anos).ffm - r.ffm, ponto("otimo", anos).ffm - r.ffm];
  const peso = (ffm: number) => ffm / (1 - r.gorduraPct / 100);
  const pSlider = ponto(cen, anosSlider);

  const moveSlider = (v: number) => {
    setAnosSlider(Math.min(10, Math.max(0, v)));
    if (!usouSlider) { setUsouSlider(true); trackEvent("shape_timeline_slider_use", {}); }
  };

  const estagioIdx = ESTAGIOS.findIndex((s) => s.id === r.estagio.id);
  const textoShare = `Meu simulador estimou que eu estou no estágio "${r.estagio.nome}" da minha jornada de desenvolvimento muscular. Veja o seu:`;

  return (
    <div className="space-y-8" aria-live="polite">
      {/* Ponto de partida */}
      <section>
        <p className={rot} style={{ color: OURO }}>Seu ponto de partida</p>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
          {[
            ["Altura", `${r.alturaM.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} m`],
            ["Peso", `${kg0(e.pesoKg)} kg`],
            ["Massa magra estimada", `${kg0(r.ffm)} kg`],
            ["FFMI estimado", r.gorduraEstimada ? `${fmt1(r.ffmiFaixa[0])}–${fmt1(r.ffmiFaixa[1])}` : fmt1(r.ffmiN)],
          ].map(([k, v]) => <div key={k} className="border border-white/10 bg-black p-3"><dt className="text-xs text-gray-500">{k}</dt><dd className="text-xl font-bold text-white tabular-nums">{v}</dd></div>)}
        </dl>
        <p className="text-xs text-gray-500 mt-2">FFMI normalizado pela altura. {r.gorduraEstimada ? `Gordura estimada pelo IMC em cerca de ${Math.round(r.gorduraPct)}%.` : ""}</p>
      </section>

      {/* Estágio */}
      <section>
        <p className={rot} style={{ color: OURO }}>Seu estágio atual</p>
        <p className="text-3xl font-bold text-white mt-1" style={titulo}>{r.estagio.nome}</p>
        <ol className="grid grid-cols-6 gap-1 mt-3" aria-label="Régua de estágios">
          {ESTAGIOS.map((s, i) => (
            <li key={s.id} className="text-center">
              <div className={`h-2 ${i <= estagioIdx ? "bg-[#BA9E50]" : "bg-white/10"}`} />
              <span className={`block text-[10px] sm:text-xs mt-1 leading-tight ${i === estagioIdx ? "text-white font-semibold" : "text-gray-500"}`}>{s.nome}{i === estagioIdx ? " ●" : ""}</span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-gray-500 mt-2">Estágios são uma classificação interna do simulador, por FFMI. Não existem fronteiras científicas universais entre eles.</p>
      </section>

      {/* Linha do tempo */}
      <section>
        <p className={rot} style={{ color: OURO }}>Sua jornada provável</p>
        <ol className="mt-3 border-l-2 border-white/15 ml-2 space-y-5">
          <li className="pl-5 relative"><span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-[#BA9E50]" /><p className="text-white font-semibold">Hoje</p><p className="text-sm text-gray-400">{r.estagio.nome} · {kg0(r.ffm)} kg de massa magra</p></li>
          {MARCOS.map((a, i) => {
            const [lo, hi] = faixaGanho(a);
            const anterior = i === 0 ? 0 : MARCOS[i - 1];
            const noPeriodo = ponto("consistente", a).ffm - ponto("consistente", anterior).ffm;
            return (
              <li key={a} className="pl-5 relative">
                <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-[#BA9E50] bg-black" />
                <p className="text-white font-semibold">{a} {a === 1 ? "ano" : "anos"}</p>
                <p className="text-sm text-gray-300">+{kg0(Math.max(0, lo))} a +{kg0(Math.max(0, hi))} kg de massa magra no total · estágio provável: {ESTAGIOS.find((s) => s.id === calcEst(ponto("consistente", a).ffmiN, e.sexo))?.nome}</p>
                <p className="text-xs text-gray-500">{noPeriodo < 0.5 ? "Ganhos já muito pequenos neste trecho." : `Neste trecho, cerca de ${kg0(noPeriodo)} kg no cenário consistente${i > 0 ? " — menos por ano do que antes" : ""}.`}</p>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Slider */}
      <section className="border border-white/10 bg-black p-4">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="shape-slider" className="text-white font-semibold">Arraste o tempo</label>
          <span className="text-white tabular-nums font-bold">{anosSlider === 10 ? "10+ anos" : `${fmtAno(anosSlider)} ${anosSlider === 1 ? "ano" : "anos"}`}</span>
        </div>
        <div className="flex items-center gap-3 mt-3">
          <button type="button" aria-label="Menos meio ano" className={`${btnSec} px-3 py-2`} onClick={() => moveSlider(anosSlider - 0.5)}>−</button>
          <input id="shape-slider" type="range" min={0} max={10} step={0.5} value={anosSlider} onChange={(ev) => moveSlider(Number(ev.target.value))} className="w-full h-8 accent-[#BA9E50]" aria-valuetext={`${fmtAno(anosSlider)} anos`} />
          <button type="button" aria-label="Mais meio ano" className={`${btnSec} px-3 py-2`} onClick={() => moveSlider(anosSlider + 0.5)}>+</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3" role="group" aria-label="Cenário">
          {(Object.keys(CENARIOS) as CenarioId[]).map((c) => <button key={c} type="button" aria-pressed={cen === c} className={`${opcao(cen === c)} py-2 text-sm`} onClick={() => setCen(c)}>{CENARIOS[c].nome}</button>)}
        </div>
        <p className="text-xs text-gray-500 mt-2">{CENARIOS[cen].descricao}</p>
        <dl className="grid grid-cols-2 gap-2 mt-3">
          {[
            ["Peso estimado*", `~${kg0(peso(pSlider.ffm))} kg`],
            ["Massa magra", `~${kg0(pSlider.ffm)} kg`],
            ["FFMI normalizado", `${fmt1(pSlider.ffmiN - 0.3)}–${fmt1(pSlider.ffmiN + 0.3)}`],
            ["Ganho acumulado", `~+${kg0(pSlider.ffm - r.ffm)} kg`],
          ].map(([k, v]) => <div key={k}><dt className="text-xs text-gray-500">{k}</dt><dd className="text-lg text-white font-semibold tabular-nums">{v}</dd></div>)}
        </dl>
        <p className="mt-2 text-sm text-gray-300">Estágio: <strong className="text-white">{ESTAGIOS.find((s) => s.id === calcEst(pSlider.ffmiN, e.sexo))?.nome}</strong></p>
        <p className="text-xs text-gray-500 mt-1">*Mantendo o mesmo percentual de gordura de hoje. É uma faixa aproximada, não uma previsão.</p>
      </section>

      {/* Referência */}
      <section>
        <p className={rot} style={{ color: OURO }}>Referência escolhida · {ref.nome}</p>
        <div className="mt-3 space-y-2">
          <Barra rotulo="Sua muscularidade hoje" v={r.posicaoRegua} />
          {ref.alvo ? <Barra rotulo={ref.nome} v={naRegua(ref.alvo[e.sexo], e.sexo)} ouro /> : <Barra rotulo={`${ref.nome} — além da escala do modelo`} v={1} ouro tracejada />}
        </div>
        {r.alvo.tipo === "sem-prazo" && (
          <div className="mt-4 border border-[#BA9E50]/40 bg-[#BA9E50]/[0.05] p-4 text-gray-200 space-y-2">
            <p className="text-white font-semibold">Não é responsável estimar um prazo para chegar exatamente a esse nível.</p>
            <p>Essa referência representa um nível de muscularidade do fisiculturismo profissional. Modelos baseados em progresso natural não permitem afirmar que esse nível será atingível só somando mais anos de treino.</p>
            <p>Por isso, em vez de mostrar um número artificial, o simulador mostra até onde consegue estimar a sua evolução com razoabilidade: a linha do tempo acima.</p>
            {ref.atleta && <p className="text-xs text-gray-400">{ref.atleta.nome} entra só como referência de escala da categoria. {ref.atleta.dado}</p>}
          </div>
        )}
        {r.alvo.tipo === "ja-chegou" && <p className="mt-3 text-gray-200">Pela estimativa, você já está no nível dessa referência ou acima dele. <button type="button" onClick={trocarRef} className="underline underline-offset-4 text-white">Escolher uma referência maior</button></p>}
        {r.alvo.tipo === "faixa" && (
          <p className="mt-3 text-gray-200">Faixa estimada para um nível semelhante ao de <strong className="text-white">{ref.nome}</strong>: <strong className="text-white">{fmtFaixaAnos(r.alvo.anos)}</strong>, entre o cenário muito bem executado e o consistente. {r.alvo.conservador === null ? "No cenário conservador, pode não acontecer dentro de 15 anos." : `No conservador, perto de ${fmtAno(r.alvo.conservador)} anos.`}</p>
        )}
        {r.alvo.tipo === "alem-do-modelo" && <p className="mt-3 text-gray-200">Com seus dados atuais, essa referência fica além do que o modelo projeta com razoabilidade nos próximos 15 anos. Não significa impossível: significa que um número aqui seria inventado.</p>}
      </section>

      {/* Próximo estágio */}
      {r.proximo && (
        <section className="border border-white/10 p-4">
          <p className={rot} style={{ color: OURO }}>Quanto falta para o próximo estágio?</p>
          <p className="text-white mt-2">Para chegar a <strong>{r.proximo.nome}</strong>: <strong>+{r.proximo.kg[0]} a +{r.proximo.kg[1]} kg de massa magra</strong>.</p>
          <p className="text-gray-300 text-sm mt-1">{r.proximo.anos ? `Faixa de tempo estimada: ${fmtFaixaAnos(r.proximo.anos)}.` : "Com o ritmo atual, o modelo não chega lá com segurança em 15 anos."}</p>
        </section>
      )}

      {/* Confiança */}
      <section>
        <p className={rot} style={{ color: OURO }}>Qualidade da estimativa</p>
        <p className="text-white font-semibold mt-1">{{ alta: "Alta", media: "Média", baixa: "Baixa" }[r.confianca]}</p>
        {r.motivosConfianca.length > 0 ? <ul className="text-sm text-gray-400 mt-1 space-y-1 list-disc pl-5">{r.motivosConfianca.map((m) => <li key={m}>{m}</li>)}</ul> : <p className="text-sm text-gray-400">Você informou percentual de gordura e um histórico consistente.</p>}
      </section>

      <EeSe e={e} setEntrada={setEntrada} />
      <Gargalo />

      {/* Compartilhar */}
      <section className="border-t border-white/10 pt-6">
        <p className="text-white font-semibold">Compartilhar minha jornada</p>
        <p className="text-xs text-gray-500 mb-3">Só o estágio vai na mensagem. Peso, gordura e medidas ficam com você.</p>
        <div className="flex flex-wrap gap-2">
          <a className={btnSec} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`${textoShare} ${URL_SHAPE}`)}`} onClick={() => trackEvent("shape_share", { channel: "whatsapp" })}>Enviar no WhatsApp</a>
          <Copiar texto={`${textoShare} ${URL_SHAPE}`} />
        </div>
      </section>

      {/* Próxima ferramenta */}
      <section className="border border-white/15 bg-black p-5">
        <p className={rot} style={{ color: OURO }}>Próximo passo</p>
        <p className="text-white mt-2">Quer ver o seu próximo ciclo de ganho de massa em semanas, com calorias e ritmo de peso?</p>
        <div className="flex flex-wrap gap-3 mt-4">
          <Link href="/ferramentas/simulador-ganho-massa-muscular" className={btnPri} onClick={() => trackEvent("shape_mass_simulator_click", {})}>Simular meu ganho de massa</Link>
          <Link href="/treino-para-minha-rotina" className={btnSec} onClick={() => trackEvent("shape_training_tool_click", {})}>Treino para minha rotina</Link>
        </div>
      </section>

      <section>
        <p className={rot} style={{ color: OURO }}>{FECHAMENTO_COMPARACAO.titulo}</p>
        <div className="space-y-3 mt-2">{FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white leading-relaxed">{t}</p>)}<p className="text-gray-400 text-sm">— Montinho</p></div>
      </section>

      <section className="border border-[#BA9E50]/40 p-5">
        <h3 className="text-xl font-bold text-white" style={titulo}>Quer transformar a estimativa em um plano?</h3>
        <p className="text-gray-300 mt-2">O simulador mostra uma faixa. Para evoluir de verdade, o treino precisa considerar sua rotina, experiência, exercícios, recuperação e progresso.</p>
        <a href={getWhatsAppUrl("Oi, Montinho! Fiz o simulador de quanto tempo para ter shape e quero um plano para a minha evolução.")} target="_blank" rel="noopener noreferrer" className={`${btnPri} mt-4`} onClick={() => trackEvent("shape_whatsapp_click", {})}>Falar com o Montinho</a>
      </section>

      <div className="flex flex-wrap gap-4 text-sm">
        <button type="button" onClick={trocarRef} className="underline underline-offset-4 text-gray-300 hover:text-white">Trocar a referência</button>
        <button type="button" onClick={refazer} className="underline underline-offset-4 text-gray-300 hover:text-white">Refazer com outros dados</button>
      </div>
    </div>
  );
}

function calcEst(ffmiN: number, sexo: Sexo) {
  let id: string = ESTAGIOS[0].id;
  for (const s of ESTAGIOS) if (ffmiN >= (sexo === "homem" ? s.h : s.m)) id = s.id;
  return id;
}

function Barra({ rotulo, v, ouro, tracejada }: { rotulo: string; v: number; ouro?: boolean; tracejada?: boolean }) {
  return (
    <div>
      <p className="text-xs text-gray-400 mb-1">{rotulo}</p>
      <div className="h-3 bg-white/10" role="img" aria-label={`${rotulo}: ${Math.round(v * 100)}% da régua`}>
        <div className={`h-3 ${ouro ? "bg-[#BA9E50]" : "bg-white/70"} ${tracejada ? "bg-[repeating-linear-gradient(90deg,#BA9E50_0_10px,transparent_10px_16px)]" : ""}`} style={{ width: `${Math.max(3, v * 100)}%` }} />
      </div>
    </div>
  );
}

function Copiar({ texto }: { texto: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className={btnSec} onClick={async () => {
      trackEvent("shape_share", { channel: "copiar" });
      try {
        if (navigator.share) { await navigator.share({ text: texto }); return; }
        await navigator.clipboard.writeText(texto); setOk(true); setTimeout(() => setOk(false), 2500);
      } catch { /* cancelado */ }
    }}>{ok ? "Copiado!" : "Compartilhar / copiar link"}</button>
  );
}

/* ── E se? ── Só recalcula o que o modelo sustenta (frequência até 3×, consistência). */
function EeSe({ e, setEntrada }: { e: Entrada; setEntrada: (p: Partial<Entrada>) => void }) {
  const [msg, setMsg] = useState<string | null>(null);
  const ordem: Consistencia[] = ["irregular", "mais-ou-menos", "consistente", "muito"];
  const proxCons = ordem[Math.min(3, ordem.indexOf(e.consistencia) + 1)];
  return (
    <section>
      <h3 className="text-lg font-bold text-white">E se eu melhorar minha consistência?</h3>
      <div className="grid sm:grid-cols-2 gap-2 mt-3">
        <button type="button" className={opcao(false)} onClick={() => {
          if (e.dias >= 3) setMsg("Você já treina 3 ou mais vezes. No modelo, mais um dia não acelera nada sozinho: com o mesmo volume semanal, a frequência quase não muda a hipertrofia. Vale mais cuidar da progressão.");
          else { setEntrada({ dias: e.dias + 1 }); setMsg(`Recalculado com ${e.dias + 1} treinos por semana.`); }
        }}>Treinar +1 dia por semana</button>
        <button type="button" className={opcao(false)} onClick={() => {
          if (e.consistencia === "muito") setMsg("Você já marcou \"muito consistente\": não há o que somar aqui.");
          else { setEntrada({ consistencia: proxCons }); setMsg(`Recalculado como "${CONSISTENCIA[proxCons].rotulo.toLowerCase()}". Veja a linha do tempo e o slider acima.`); }
        }}>Ser mais consistente</button>
        <button type="button" className={opcao(false)} onClick={() => setMsg("Dormir melhor ajuda recuperação e desempenho, mas não existe uma relação confiável para converter horas de sono em quilos de músculo. Por isso ele não muda os números — só a sua chance de ficar no cenário de cima.")}>Dormir melhor</button>
        <button type="button" className={opcao(false)} onClick={() => setMsg("Acompanhar cargas e repetições é o que permite progredir de propósito. O modelo trata isso como a diferença entre os cenários — quem acompanha tende a ficar no consistente ou acima.")}>Acompanhar progressão</button>
      </div>
      {msg && <p className="mt-3 text-sm text-gray-300" role="status">{msg}</p>}
    </section>
  );
}

/* ── Gargalo ── */
function Gargalo() {
  const [g, setG] = useState<Partial<Gargalos>>({});
  const [enviado, setEnviado] = useState(false);
  const completo = g.estruturado && g.progressao && g.proteina && g.sono && g.constancia;
  const P = <K extends keyof Gargalos>(k: K, titulo: string, ops: [Gargalos[K], string][]) => (
    <fieldset key={k} className="mt-3">
      <legend className="text-sm text-gray-300 mb-1.5">{titulo}</legend>
      <div className="flex flex-wrap gap-2">{ops.map(([v, t]) => <button key={String(v)} type="button" aria-pressed={g[k] === v} className={`${opcao(g[k] === v)} py-2 text-sm`} onClick={() => { setG({ ...g, [k]: v }); setEnviado(false); }}>{t}</button>)}</div>
    </fieldset>
  );
  const res = completo ? maiorGargalo(g as Gargalos) : null;
  return (
    <section className="border border-white/10 p-4">
      <h3 className="text-lg font-bold text-white">O que mais pode estar limitando sua evolução?</h3>
      <p className="text-xs text-gray-500">Cinco toques. Não é diagnóstico.</p>
      {P("estruturado", "Treino estruturado?", [["sim", "Sim"], ["mais-ou-menos", "Mais ou menos"], ["nao", "Não"]])}
      {P("progressao", "Progressão de carga?", [["sim", "Sim"], ["nao", "Não"], ["nao-acompanho", "Não acompanho"]])}
      {P("proteina", "Proteína?", [["acompanho", "Acompanho"], ["nao-acompanho", "Não acompanho"]])}
      {P("sono", "Sono por noite", [["lt6", "Menos de 6h"], ["6a7", "6–7h"], ["7a9", "7–9h"], ["9mais", "9h+"]])}
      {P("constancia", "Constância", [["alta", "Alta"], ["media", "Média"], ["baixa", "Baixa"]])}
      <button type="button" disabled={!completo} className={`${btnPri} mt-4 w-full sm:w-auto`} onClick={() => { setEnviado(true); trackEvent("shape_bottleneck_complete", { bottleneck: res?.titulo ?? "" }); }}>Ver meu maior ponto de atenção</button>
      {enviado && res && (
        <div className="mt-4 border-l-2 border-[#BA9E50] pl-4" role="status">
          <p className={rot} style={{ color: OURO }}>Seu maior ponto de atenção</p>
          <p className="text-white font-semibold text-lg">{res.titulo}</p>
          <p className="text-gray-300 mt-1">{res.texto}</p>
        </div>
      )}
    </section>
  );
}
