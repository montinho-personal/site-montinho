"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  DIAS_TRABALHO,
  ESFORCOS,
  KM_MAX,
  KM_MIN,
  MET_PARADO,
  MET_TRABALHO,
  MINUTOS_MAX,
  MINUTOS_MIN,
  NOTA_ESTIMATIVA,
  NOTA_LINEAR,
  NOTA_PARADAS,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PARADO_MAX,
  PESO_MAX,
  PESO_MIN,
  PRESETS_MINUTOS,
  TERRENOS,
  VELOCIDADE_MAX,
  VELOCIDADE_MIN,
  VEZES_SEMANA,
  WATTS_MAX,
  WATTS_MIN,
  arredondaKcal,
  calcula,
  compara,
  esforco,
  faixaDe,
  faixaRua,
  formataTempo,
  kcalSeFosseContinuo,
  kgPorMes,
  kmValido,
  metDoEsforco,
  minutosValidos,
  paradoValido,
  parseNumero,
  pesoValido,
  terreno,
  trabalho,
  velocidadeMedia,
  velocidadeValida,
  wattsValidos,
  type EsforcoId,
  type TerrenoId,
} from "@/lib/bicicleta";

/**
 * A Calculadora de Calorias na Bicicleta.
 *
 * TRÊS PERGUNTAS, TRÊS CONTAS
 *
 * "Quanto o meu pedal gastou?" é uma conta pela velocidade e pelas
 * paradas. "Quanto a ergométrica gastou?" é uma conta pelos watts do visor
 * ou pelo esforço. "Quanto rende ir de bike para o trabalho?" é a ida e a
 * volta, nos dias da semana, virando quilos por mês. A pessoa escolhe a
 * pergunta antes de digitar qualquer número, porque os campos mudam.
 *
 * A frequência é perguntada ANTES do resultado: quilos por mês precisam
 * dela, e perguntar depois faria o número mudar embaixo de quem lê.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram o
 * modo, a faixa e a frequência, nunca o peso nem a distância.
 */

type Modo = "rua" | "ergometrica" | "trabalho";

const MODOS: { id: Modo; rotulo: string; sub: string }[] = [
  { id: "rua", rotulo: "Pedal na rua", sub: "pela velocidade e pelas paradas" },
  { id: "ergometrica", rotulo: "Ergométrica", sub: "pelos watts ou pelo esforço" },
  { id: "trabalho", rotulo: "Ir de bike para o trabalho", sub: "ida e volta, no mês" },
];

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const dec = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });

export default function CalculadoraBicicleta({ placement }: { placement: string }) {
  const [modo, setModo] = useState<Modo>("rua");
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [vezes, setVezes] = useState(3);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);
  /* Rua */
  const [terrenoId, setTerrenoId] = useState<TerrenoId>("plano");
  const [porVelocidade, setPorVelocidade] = useState(true);
  const [velTexto, setVelTexto] = useState("");
  const [kmTexto, setKmTexto] = useState("");
  const [paradoTexto, setParadoTexto] = useState("");
  /* Ergométrica */
  const [porWatts, setPorWatts] = useState(false);
  const [wattsTexto, setWattsTexto] = useState("");
  const [esforcoId, setEsforcoId] = useState<EsforcoId>("moderado");
  /* Trabalho */
  const [kmIdaTexto, setKmIdaTexto] = useState("");
  const [minIdaTexto, setMinIdaTexto] = useState("");
  const [dias, setDias] = useState(5);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const parado = paradoTexto.trim() === "" ? 0 : parseNumero(paradoTexto);
  const paradoOk = paradoValido(parado);
  const km = parseNumero(kmTexto);
  const kmOk = kmValido(km);
  const velDigitada = parseNumero(velTexto);
  const velocidade = porVelocidade ? velDigitada : kmOk && minutosOk ? velocidadeMedia(km, minutos) : null;
  const velOk = velocidadeValida(velocidade);
  const faixa = velOk ? faixaRua(velocidade) : null;
  const terr = terreno(terrenoId);
  const watts = parseNumero(wattsTexto);
  const wattsOk = wattsValidos(watts);
  const faixaW = wattsOk ? faixaDe(watts) : null;
  const kmIda = parseNumero(kmIdaTexto);
  const kmIdaOk = kmValido(kmIda);
  const minIda = parseNumero(minIdaTexto);
  const minIdaOk = minutosValidos(minIda);

  /* O MET da sessão, conforme o modo. null enquanto faltar campo. */
  const met =
    modo === "rua"
      ? terr.met !== null ? terr.met : faixa ? faixa.met : null
      : modo === "ergometrica"
        ? porWatts ? (faixaW ? faixaW.met : null) : metDoEsforco(esforcoId)
        : null;
  const paradoAplicado = modo === "rua" && paradoOk ? parado : 0;
  const resultado = modo !== "trabalho" && pesoOk && minutosOk && met !== null && (modo !== "rua" || paradoOk) ? calcula(peso, met, minutos, paradoAplicado) : null;
  const kgMes = resultado ? kgPorMes(resultado.kcalLiquida, vezes) : null;
  const tabela = resultado && resultado.minutosParado > 0 ? kcalSeFosseContinuo(peso!, met!, resultado.minutosTotais) : null;
  const comparacao = resultado ? compara(peso!, resultado.minutosTotais) : null;
  const trab = modo === "trabalho" && pesoOk && kmIdaOk && minIdaOk ? trabalho(peso, kmIda, minIda, dias) : null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("bike_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const temResultado = resultado !== null || trab !== null;
  const faixaId = modo === "rua" ? (terr.met !== null ? terrenoId : faixa?.codigo ?? "") : modo === "ergometrica" ? (porWatts ? faixaW?.codigo ?? "" : esforcoId) : "trabalho";
  useEffect(() => {
    if (temResultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("bike_calculator_use", { placement, mode: modo, band: faixaId, per_week: modo === "trabalho" ? dias : vezes });
    }
  }, [temResultado, placement, modo, faixaId, vezes, dias]);

  const trocaModo = (m: Modo) => {
    if (m === modo) return;
    setModo(m);
    trackEvent("bike_mode_selected", { placement, mode: m });
  };

  const rotuloSessao =
    modo === "rua"
      ? terr.met !== null
        ? `${terr.nome.toLowerCase()}`
        : faixa ? `${faixa.nome.toLowerCase()}, ${dec(velocidade!)} km/h` : "na rua"
      : porWatts && faixaW ? `${watts} W` : `esforço ${esforco(esforcoId).nome.toLowerCase()}`;
  const resumoWhats = resultado
    ? `${formataTempo(resultado.minutosTotais)} de bicicleta (${rotuloSessao}) ≈ ${kc(resultado.kcal)} kcal`
    : trab
      ? `Ir de bike para o trabalho, ${dec(trab.kmIda)} km por trecho, ${trab.diasPorSemana}× por semana ≈ ${kc(trab.kcalPorSemana)} kcal por semana`
      : null;
  const linhasShare = resultado
    ? [`${formataTempo(resultado.minutosTotais)} de bicicleta`, rotuloSessao, `≈ ${kc(resultado.kcal)} kcal`]
    : trab
      ? ["Ir de bike para o trabalho", `${dec(trab.kmIda)} km por trecho, ${trab.diasPorSemana}× por semana`, `≈ ${kc(trab.kcalPorSemana)} kcal por semana`]
      : [];
  const idc = (s: string) => `${s}-bike-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-bicicleta"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto o seu pedal gastou?
      </h2>

      <div role="group" aria-label="O que você quer calcular" className="grid gap-2.5 sm:grid-cols-3 mb-7">
        {MODOS.map((m) => (
          <button key={m.id} type="button" onClick={() => trocaModo(m.id)} aria-pressed={m.id === modo}
            className={`text-left px-4 py-3.5 border transition-colors min-h-[44px] ${
              m.id === modo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
            }`}>
            <span className="block font-semibold text-sm sm:text-base">{m.rotulo}</span>
            <span className="block text-xs text-gray-400 mt-0.5">{m.sub}</span>
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

      {/* ── Rua ── */}
      {modo === "rua" && (
        <>
          <div className="mb-6">
            <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("terreno")}>Onde você pedalou?</span>
            <div role="group" aria-labelledby={idc("terreno")} className="flex flex-wrap gap-2 mb-2">
              {TERRENOS.map((t) => (
                <button key={t.id} type="button" aria-pressed={terrenoId === t.id} className={chip(terrenoId === t.id)} onClick={() => setTerrenoId(t.id)}>
                  {t.nome}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm max-w-xl">{terr.descricao}</p>
          </div>

          {terr.met === null && (
            <div className="mb-6">
              <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("como")}>Como você sabe o ritmo?</span>
              <div role="group" aria-labelledby={idc("como")} className="flex flex-wrap gap-2 mb-4">
                <button type="button" aria-pressed={porVelocidade} className={chip(porVelocidade)} onClick={() => setPorVelocidade(true)}>Sei a velocidade média</button>
                <button type="button" aria-pressed={!porVelocidade} className={chip(!porVelocidade)} onClick={() => setPorVelocidade(false)}>Sei a distância e o tempo</button>
              </div>
              {porVelocidade ? (
                <div>
                  <label htmlFor={idc("vel")} className="block text-gray-300 text-sm font-medium mb-2">Velocidade média (o app ou o ciclocomputador mostram)</label>
                  <div className="flex items-center gap-3">
                    <input id={idc("vel")} type="text" inputMode="decimal" autoComplete="off" placeholder="18" value={velTexto}
                      onChange={(e) => setVelTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("vel-ajuda")} />
                    <span className="text-gray-300 text-lg">km/h</span>
                  </div>
                  <p id={idc("vel-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px] max-w-xl" data-testid="ajuda-velocidade">
                    {velTexto.trim() !== "" && !velOk ? `Use um valor entre ${VELOCIDADE_MIN} e ${VELOCIDADE_MAX} km/h.` : faixa ? `${faixa.nome}: ${faixa.comoReconhecer}` : "Sem app: passeio tranquilo fica perto de 15 km/h; quem se esforça na ciclovia, perto de 20."}
                  </p>
                </div>
              ) : (
                <div>
                  <label htmlFor={idc("km")} className="block text-gray-300 text-sm font-medium mb-2">Quantos km você pedalou?</label>
                  <div className="flex items-center gap-3">
                    <input id={idc("km")} type="text" inputMode="decimal" autoComplete="off" placeholder="15" value={kmTexto}
                      onChange={(e) => setKmTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("km-ajuda")} />
                    <span className="text-gray-300 text-lg">km</span>
                  </div>
                  <p id={idc("km-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
                    {kmTexto.trim() !== "" && !kmOk ? `Use um valor entre ${KM_MIN} e ${KM_MAX} km.` : faixa && velocidade ? `Média de ${dec(velocidade)} km/h: ${faixa.nome.toLowerCase()}.` : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Ergométrica ── */}
      {modo === "ergometrica" && (
        <div className="mb-6">
          <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("ergo")}>Como foi o esforço?</span>
          <div role="group" aria-labelledby={idc("ergo")} className="flex flex-wrap gap-2 mb-4">
            <button type="button" aria-pressed={!porWatts} className={chip(!porWatts)} onClick={() => setPorWatts(false)}>Pelo esforço</button>
            <button type="button" aria-pressed={porWatts} className={chip(porWatts)} onClick={() => setPorWatts(true)}>Sei os watts do visor</button>
          </div>
          {porWatts ? (
            <div>
              <label htmlFor={idc("watts")} className="block text-gray-300 text-sm font-medium mb-2">Potência média que o visor mostrou</label>
              <div className="flex items-center gap-3">
                <input id={idc("watts")} type="text" inputMode="numeric" autoComplete="off" placeholder="100" value={wattsTexto}
                  onChange={(e) => setWattsTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("watts-ajuda")} />
                <span className="text-gray-300 text-lg">W</span>
              </div>
              <p id={idc("watts-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px] max-w-xl">
                {wattsTexto.trim() !== "" && !wattsOk ? `O Compêndio mediu de ${WATTS_MIN} a ${WATTS_MAX} W.` : faixaW ? `${faixaW.de} a ${faixaW.ate} W: ${faixaW.nome}, ${metF(faixaW.met)} METs.` : "Use a média da sessão, não o pico."}
              </p>
            </div>
          ) : (
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                {ESFORCOS.map((e) => (
                  <button key={e.id} type="button" aria-pressed={esforcoId === e.id} className={chip(esforcoId === e.id)} onClick={() => setEsforcoId(e.id)}>
                    {e.nome}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-sm max-w-xl">{esforco(esforcoId).comoReconhecer} Equivale a uns {esforco(esforcoId).watts} W.</p>
            </div>
          )}
          <p className="text-gray-500 text-xs mt-3 max-w-xl">
            Aula de spinning tem <Link href="/ferramentas/calculadora-calorias-spinning" className={ln}>calculadora própria</Link>, com a potência da bike e o número do visor.
          </p>
        </div>
      )}

      {/* ── Tempo e paradas (rua e ergométrica) ── */}
      {modo !== "trabalho" && (
        <>
          <div className="mb-6">
            <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">Quanto tempo durou, do começo ao fim?</label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {PRESETS_MINUTOS.map((p) => (
                <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
                  onClick={() => { setMinutosTexto(String(p)); trackEvent("bike_preset", { placement, preset: p }); }}>
                  {p} min
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
          {modo === "rua" && (
            <div className="mb-6">
              <label htmlFor={idc("parado")} className="block text-gray-300 text-sm font-medium mb-2">Desse tempo, quanto você ficou parado? (semáforo, espera, foto)</label>
              <div className="flex items-center gap-3">
                <input id={idc("parado")} type="text" inputMode="numeric" autoComplete="off" placeholder="0" value={paradoTexto}
                  onChange={(e) => setParadoTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("parado-ajuda")} />
                <span className="text-gray-300 text-lg">minutos</span>
              </div>
              <p id={idc("parado-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px] max-w-xl">
                {paradoTexto.trim() !== "" && !paradoOk ? `Use de 0 a ${PARADO_MAX} minutos.` : "Na cidade, uns 10 minutos por hora é comum. Deixe em branco se pedalou direto."}
              </p>
            </div>
          )}
          <div className="mb-7">
            <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantas vezes por semana?</span>
            <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
              {VEZES_SEMANA.map((n) => (
                <button key={n} type="button" onClick={() => { setVezes(n); trackEvent("bike_frequency", { placement, per_week: n }); }}
                  aria-pressed={vezes === n} className={chip(vezes === n)}>
                  {n}×
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Trabalho ── */}
      {modo === "trabalho" && (
        <>
          <div className="grid grid-cols-2 gap-3 mb-2 max-w-md">
            <div>
              <label htmlFor={idc("kmida")} className="block text-gray-300 text-sm font-medium mb-2">Km só de ida</label>
              <input id={idc("kmida")} type="text" inputMode="decimal" autoComplete="off" placeholder="8" value={kmIdaTexto}
                onChange={(e) => setKmIdaTexto(e.target.value)} className={`w-full ${campo}`} />
            </div>
            <div>
              <label htmlFor={idc("minida")} className="block text-gray-300 text-sm font-medium mb-2">Minutos só de ida</label>
              <input id={idc("minida")} type="text" inputMode="numeric" autoComplete="off" placeholder="30" value={minIdaTexto}
                onChange={(e) => setMinIdaTexto(e.target.value)} className={`w-full ${campo}`} />
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-6 min-h-[20px] max-w-xl">
            {kmIdaTexto.trim() !== "" && !kmIdaOk
              ? `Use de ${KM_MIN} a ${KM_MAX} km.`
              : minIdaTexto.trim() !== "" && !minIdaOk
                ? `Use de ${MINUTOS_MIN} a ${MINUTOS_MAX} minutos.`
                : "A volta entra sozinha. Se o caminho de volta é bem diferente, use a média dos dois."}
          </p>
          <div className="mb-7">
            <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("dias")}>Quantos dias por semana você vai de bike?</span>
            <div role="group" aria-labelledby={idc("dias")} className="flex flex-wrap gap-2">
              {DIAS_TRABALHO.map((n) => (
                <button key={n} type="button" onClick={() => { setDias(n); trackEvent("bike_frequency", { placement, per_week: n }); }}
                  aria-pressed={dias === n} className={chip(dias === n)}>
                  {n} {n === 1 ? "dia" : "dias"}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div aria-live="polite">
        {resultado && pesoOk && kgMes !== null && comparacao && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Gasto estimado da sessão</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {formataTempo(resultado.minutosPedalando)} pedalando, {rotuloSessao}
                  {resultado.minutosParado > 0 && <> · {formataTempo(resultado.minutosParado)} parado</>}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Só da bike, {vezes}× por semana</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {kg(kgMes)}<span className="text-lg font-normal text-gray-300"> kg/mês</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">no máximo, pela conta linear</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Descontando o que você gastaria parado, a sessão acrescentou cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia.
            </p>
            {tabela !== null && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="nota-tabela">
                A tabela que multiplica pelo tempo de relógio daria {kc(tabela)} kcal para os mesmos {formataTempo(resultado.minutosTotais)} — como
                se você não tivesse parado. Parado no semáforo, o corpo gasta {metF(MET_PARADO)} MET, quase o de ficar em pé.
              </p>
            )}

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <caption className="text-left text-gray-400 text-xs mb-2">
                  {formataTempo(resultado.minutosTotais)} para {dec(peso)} kg, em cada tipo de pedal
                </caption>
                <tbody>
                  {comparacao.map((l) => (
                    <tr key={l.id} className="border-b border-white/10 text-gray-300">
                      <td className="py-2.5 pr-4">
                        {l.href ? <Link href={l.href} className={ln}>{l.nome}</Link> : l.nome}
                      </td>
                      <td className="py-2.5 pr-4 tabular-nums text-gray-400">{metF(l.met)} METs</td>
                      <td className="py-2.5 tabular-nums font-medium text-white">≈ {kc(l.kcal)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {modo === "rua" ? NOTA_PARADAS : ""} {NOTA_LINEAR}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("bike_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. Para {dec(peso)} kg a {metF(met!)} METs
                    ({modo === "rua" ? (terr.codigo ? `${terr.nome.toLowerCase()}, código ${terr.codigo}` : `${faixa!.nome.toLowerCase()}, ${faixa!.de} a ${faixa!.ate} km/h, código ${faixa!.codigo}`) : porWatts ? `${faixaW!.de} a ${faixaW!.ate} W, código ${faixaW!.codigo}` : `esforço ${esforco(esforcoId).nome.toLowerCase()}, cerca de ${esforco(esforcoId).watts} W`} no Compêndio), isso dá cerca de{" "}
                    {dec(resultado.kcalPedalando / Math.max(resultado.minutosPedalando, 0.001))} kcal por minuto pedalando.
                  </p>
                  {resultado.minutosParado > 0 && <p>O tempo parado vale {metF(MET_PARADO)} MET, que é ficar em pé.</p>}
                  <p>Os quilos saem do gasto líquido da semana, a 7.700 kcal por quilo de gordura. É teto: o corpo compensa parte do gasto.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias na Bicicleta" caminho="/ferramentas/calculadora-calorias-bicicleta"
                local="tool_result" ferramenta="bicicleta" resultado={linhasShare} gancho="Descobri quanto o meu pedal gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-bicicleta" && (
                <Link href="/ferramentas/calculadora-calorias-bicicleta" onClick={() => trackEvent("bike_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="bicicleta" categoria="padrao" resumo={resumoWhats} placement={placement} />
          </div>
        )}

        {trab && pesoOk && (
          <div className="border-t border-white/10 pt-7" data-testid="resultado-trabalho">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Por semana, ida e volta, {trab.diasPorSemana} {trab.diasPorSemana === 1 ? "dia" : "dias"}</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(trab.kcalPorSemana)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">≈ {kc(trab.kcalPorDia)} kcal por dia de bike · {formataTempo(trab.minutosPorSemana)} pedalando na semana</p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Só do trajeto, por mês</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {kg(trab.kgPorMes)}<span className="text-lg font-normal text-gray-300"> kg</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">no máximo, pela conta linear · {Math.round(trab.kmPorMes)} km pedalados no mês</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Sua média é de {dec(trab.velocidade)} km/h. A conta usa a entrada do Compêndio para <strong className="text-white">ir e voltar do trabalho no ritmo que
              você escolhe</strong> ({metF(MET_TRABALHO)} METs), e não a da velocidade: quem vai devagar para não chegar suado não é punido por isso. Descontando o
              que você gastaria parado, cada dia de bike acrescenta cerca de <strong className="text-white">{kc(trab.kcalLiquidaPorDia)} kcal</strong>.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_LINEAR}</p>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias na Bicicleta" caminho="/ferramentas/calculadora-calorias-bicicleta"
                local="tool_result" ferramenta="bicicleta" resultado={linhasShare} gancho="Descobri quanto ir de bike para o trabalho rende:" aparencia="solido" />
              {placement !== "calculadora-calorias-bicicleta" && (
                <Link href="/ferramentas/calculadora-calorias-bicicleta" onClick={() => trackEvent("bike_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>
            <PosResultado ferramenta="bicicleta" categoria="padrao" resumo={resumoWhats} placement={placement} />
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
