"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  MET_AULA,
  MINUTOS_MAX,
  MINUTOS_MIN,
  NOTA_ESTIMATIVA,
  NOTA_FAIXAS,
  NOTA_KJ,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_MAX,
  PESO_MIN,
  PRESETS_MINUTOS,
  VISOR_MAX,
  VISOR_MIN,
  VISOR_TOLERANCIA_PCT,
  WATTS_MAX,
  WATTS_MIN,
  arredondaKcal,
  calcula,
  comparaVisor,
  faixaDe,
  formataTempo,
  kjDoTrabalho,
  leituraVisor,
  minutosValidos,
  parseNumero,
  pesoValido,
  semana,
  visorValido,
} from "@/lib/spinning";

/**
 * A Calculadora de Calorias no Spinning.
 *
 * O NÚMERO QUE A BIKE JÁ MEDIU
 *
 * Quem tem watts no visor digita a potência média da aula, e a calculadora
 * usa a faixa do Compêndio medida para ela. Quem não tem usa a aula de
 * spinning. Nos dois modos, o número de calorias do visor pode ser
 * comparado — e, com watts, a calculadora mostra a conta que o visor
 * provavelmente fez.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram o
 * modo e a faixa, nunca o peso, os watts exatos nem o número do visor.
 */

type Modo = "watts" | "aula";

const MODOS: { id: Modo; rotulo: string }[] = [
  { id: "watts", rotulo: "Minha bike mostra watts" },
  { id: "aula", rotulo: "Não sei os watts" },
];

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
/** METs sempre com uma casa: "8,8", "11,0". */
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
/** Kcal arredondada e com ponto de milhar. */
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function CalculadoraSpinning({ placement }: { placement: string }) {
  const [modo, setModo] = useState<Modo>("watts");
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [wattsTexto, setWattsTexto] = useState("");
  const [mostrarVisor, setMostrarVisor] = useState(false);
  const [visorTexto, setVisorTexto] = useState("");
  const [aulas, setAulas] = useState(3);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const watts = parseNumero(wattsTexto);
  const faixa = watts !== null ? faixaDe(watts) : null;
  const visor = parseNumero(visorTexto);
  const visorOk = mostrarVisor && visorValido(visor);

  const met = modo === "watts" ? faixa?.met ?? null : MET_AULA;
  const resultado = pesoOk && minutosOk && met !== null ? calcula(peso, minutos, met) : null;
  const kj = resultado && modo === "watts" && watts !== null ? kjDoTrabalho(watts, minutos!) : null;
  const diffVisor = resultado && visorOk ? comparaVisor(visor, resultado.kcal) : null;
  const sem = resultado ? semana(resultado, aulas) : null;
  const rotuloFaixa = modo === "watts" ? faixa?.codigo ?? "fora" : "aula";

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("spinning_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const temResultado = resultado !== null;
  useEffect(() => {
    if (temResultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("spinning_calculator_use", { placement, mode: modo, band: rotuloFaixa });
    }
  }, [temResultado, placement, modo, rotuloFaixa]);

  function trocaModo(novo: Modo) {
    if (novo === modo) return;
    setModo(novo);
    trackEvent("spinning_mode_selected", { placement, mode: novo });
  }

  const resumoWhats = resultado
    ? `${formataTempo(resultado.minutos)} de spinning ≈ ${kc(resultado.kcal)} kcal`
    : null;
  const linhasShare = resultado
    ? [`${formataTempo(resultado.minutos)} de spinning`, modo === "watts" && watts !== null ? `${Math.round(watts)} W de média` : "aula de spinning", `≈ ${kc(resultado.kcal)} kcal`]
    : [];
  const idc = (s: string) => `${s}-spin-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-spinning"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto a sua aula de spinning gastou?
      </h2>

      <div role="group" aria-label="O que a sua bike mostra" className="grid gap-2.5 grid-cols-2 mb-7">
        {MODOS.map((m) => (
          <button key={m.id} type="button" onClick={() => trocaModo(m.id)} aria-pressed={m.id === modo}
            className={`text-left px-4 py-3.5 border transition-colors min-h-[44px] ${
              m.id === modo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
            }`}>
            <span className="font-semibold text-sm sm:text-base">{m.rotulo}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">Quanto você pesa?</label>
        <div className="flex items-center gap-3">
          <input id={idc("peso")} type="text" inputMode="decimal" autoComplete="off" placeholder="70" value={pesoTexto}
            onChange={(e) => setPesoTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("peso-ajuda")} />
          <span className="text-gray-300 text-lg">kg</span>
        </div>
        <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {pesoTexto.trim() !== "" && !pesoOk ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">Quanto tempo de aula?</label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {PRESETS_MINUTOS.map((p) => (
            <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
              onClick={() => { setMinutosTexto(String(p)); trackEvent("spinning_preset", { placement, preset: p }); }}>
              {formataTempo(p)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input id={idc("min")} type="text" inputMode="numeric" autoComplete="off" placeholder="45" value={minutosTexto}
            onChange={(e) => setMinutosTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("min-ajuda")} />
          <span className="text-gray-300 text-lg">minutos</span>
        </div>
        <p id={idc("min-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {minutosTexto.trim() !== "" && !minutosOk ? `Use um valor entre ${MINUTOS_MIN} e ${MINUTOS_MAX} minutos.` : ""}
        </p>
      </div>

      {modo === "watts" ? (
        <div className="mb-7">
          <label htmlFor={idc("w")} className="block text-gray-300 text-sm font-medium mb-2">Potência média da aula</label>
          <div className="flex items-center gap-3">
            <input id={idc("w")} type="text" inputMode="numeric" autoComplete="off" placeholder="130" value={wattsTexto}
              onChange={(e) => setWattsTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("w-ajuda")} />
            <span className="text-gray-300 text-lg">watts</span>
          </div>
          <p id={idc("w-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px] max-w-xl" data-testid="ajuda-watts">
            {wattsTexto.trim() === ""
              ? "É o número com \"W\" no visor. Use a média da aula, não o pico de um tiro."
              : watts === null
                ? "Use só números."
                : faixa === null
                  ? `O Compêndio mediu a bike entre ${WATTS_MIN} e ${WATTS_MAX} W. Fora disso a calculadora não inventa um valor — ${watts < WATTS_MIN ? "abaixo de 30 W a pedalada é quase parada" : "acima de 270 W de média por uma aula inteira é ritmo de ciclista de competição"}.`
                  : `Faixa de ${faixa.de} a ${faixa.ate} W no Compêndio: esforço ${faixa.nome}, ${metF(faixa.met)} METs.`}
          </p>
        </div>
      ) : (
        <p className="text-gray-400 text-sm mb-7 max-w-xl">
          Sem watts, a calculadora usa a aula de spinning que o Compêndio mediu: {metF(MET_AULA)} METs, com as subidas, os
          tiros e as recuperações que uma aula tem.
        </p>
      )}

      {/* A frequência entra antes do resultado: é pergunta, não detalhe do resultado. */}
      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantas aulas por semana?</span>
        <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} type="button" onClick={() => { setAulas(n); trackEvent("spinning_frequency", { placement, per_week: n }); }}
              aria-pressed={aulas === n} className={chip(aulas === n)}>
              {n}×
            </button>
          ))}
        </div>
      </div>

      <div className="mb-7">
        {!mostrarVisor ? (
          <button type="button" onClick={() => { trackEvent("spinning_display_open", { placement }); setMostrarVisor(true); }}
            className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
            style={{ textDecorationColor: "#BA9E50" }}>
            O visor da bike mostrou outro número? Compare
          </button>
        ) : (
          <div>
            <label htmlFor={idc("vis")} className="block text-gray-300 text-sm font-medium mb-2">
              Calorias no visor <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-3">
              <input id={idc("vis")} type="text" inputMode="numeric" autoComplete="off" placeholder="450" value={visorTexto}
                onChange={(e) => setVisorTexto(e.target.value)} className={`w-32 ${campo}`} />
              <span className="text-gray-300 text-lg">kcal</span>
            </div>
            <p className="text-gray-400 text-sm mt-2 min-h-[20px]">
              {visorTexto.trim() !== "" && !visorValido(visor) ? `Use o número do visor, entre ${VISOR_MIN} e ${VISOR_MAX.toLocaleString("pt-BR")} kcal.` : ""}
            </p>
          </div>
        )}
      </div>

      <div aria-live="polite">
        {resultado && pesoOk && sem && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Gasto estimado</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">pelo Compêndio, com o seu peso</p>
              </div>
              {kj !== null ? (
                <div className="border border-white/15 p-5" data-testid="cartao-kj">
                  <p className="text-gray-400 text-xs mb-1">Pelo trabalho nos pedais</p>
                  <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                    {Math.round(kj).toLocaleString("pt-BR")}<span className="text-lg font-normal text-gray-300"> kJ ≈ kcal</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-2">a conta que muitos visores fazem</p>
                </div>
              ) : (
                <div className="border border-white/15 p-5">
                  <p className="text-gray-400 text-xs mb-1">Só das aulas, {aulas}× por semana</p>
                  <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                    {kg(sem.kgMes)}<span className="text-lg font-normal text-gray-300"> kg/mês</span>
                  </p>
                  <p className="text-gray-400 text-sm mt-2">no máximo, pela conta linear</p>
                </div>
              )}
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Descontando o que você gastaria parado, a aula acrescentou cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia.
            </p>

            {diffVisor !== null && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="leitura-visor">
                {leituraVisor(diffVisor) === "parecido"
                  ? `O visor (${kc(visor!)} kcal) está dentro de ${VISOR_TOLERANCIA_PCT}% da estimativa — os dois contam a mesma história.`
                  : leituraVisor(diffVisor) === "acima"
                    ? `O visor (${kc(visor!)} kcal) está cerca de ${Math.round(diffVisor)}% acima da estimativa. Pode ser um peso padrão maior que o seu, ou uma potência média mais alta que a que você digitou. Use o visor para comparar uma aula com a outra, não para decidir quanto comer.`
                    : `O visor (${kc(visor!)} kcal) está cerca de ${Math.round(-diffVisor)}% abaixo da estimativa. Se ele calcula pelos quilojoules, não usa o seu peso — e quem pesa mais gasta mais do que o trabalho nos pedais sugere.`}
              </p>
            )}

            <div className="mb-5 max-w-2xl">
              <p className="text-gray-300 leading-relaxed">
                {aulas === 1 ? "Uma aula por semana soma" : `${aulas} aulas por semana somam`} cerca de{" "}
                <strong className="text-white">{kc(sem.kcalLiquida)} kcal</strong> a mais — no máximo {kg(sem.kgMes)} kg de gordura por
                mês, se nada do que você come depois mudar.
              </p>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
              {NOTA_ESTIMATIVA} {modo === "watts" && NOTA_FAIXAS}
            </p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("spinning_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto.{" "}
                    {modo === "watts" && faixa
                      ? <>A faixa de {faixa.de} a {faixa.ate} W vale {metF(faixa.met)} METs no Compêndio de Atividades Físicas (código {faixa.codigo}).</>
                      : <>A aula de spinning vale {metF(MET_AULA)} METs no Compêndio de Atividades Físicas.</>}
                  </p>
                  {kj !== null && <p>{NOTA_KJ}</p>}
                  <p>Os quilos saem do gasto líquido das aulas da semana, a 7.700 kcal por quilo de gordura. É teto: o corpo compensa parte do gasto.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias no Spinning" caminho="/ferramentas/calculadora-calorias-spinning"
                local="tool_result" ferramenta="spinning" resultado={linhasShare} gancho="Descobri quanto a minha aula de spinning gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-spinning" && (
                <Link href="/ferramentas/calculadora-calorias-spinning" onClick={() => trackEvent("spinning_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="spinning" categoria="padrao" resumo={resumoWhats} placement={placement} />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_SEM_PERDA_LOCALIZADA} {NOTA_SEGURANCA}{" "}
        <Link href="/blog/deficit-calorico-como-calcular" className={ln}>Entenda como funciona o déficit calórico</Link>.
      </p>
    </div>
  );
}
