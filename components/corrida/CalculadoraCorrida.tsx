"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  INCLINACAO_MAX,
  KM_MAX,
  KM_MIN,
  MINUTOS_MAX,
  MINUTOS_MIN,
  NOTA_BRUTO,
  NOTA_EQUACAO_CAMINHADA,
  NOTA_ESTIMATIVA,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_MAX,
  PESO_MIN,
  PROVAS,
  arredondaKcal,
  comparaComCaminhada,
  deDistanciaEPace,
  deDistanciaETempo,
  deTempoEPace,
  formataPace,
  formataRelogio,
  fraseContexto,
  inclinacaoValida,
  kcalLiquida,
  kcalLiquidaPorKm,
  kcalPorKm,
  kmValidos,
  minutosValidos,
  paceValido,
  parseNumero,
  parsePace,
  pesoValido,
  tabelaProvas,
} from "@/lib/corrida";

/**
 * A Calculadora de Corrida.
 *
 * TRÊS PERGUNTAS, TRÊS PARES DE CAMPOS
 *
 * Quem corre tem sempre dois dos três valores — distância, tempo e pace —
 * e quer o terceiro. Pedir os três seria pedir a resposta junto com a
 * pergunta. A pessoa escolhe o par que tem.
 *
 * O PACE VEM EM MINUTOS POR QUILÔMETRO
 *
 * É como se fala. O campo aceita "5:30", "5.30" e "5,30", e recusa
 * "5:75" — segundo não passa de 59, e aceitar isso em silêncio produziria
 * um tempo de prova errado sem ninguém perceber.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador; os eventos levam modo e
 * prova, nunca valor. O resumo do WhatsApp leva distância, tempo e
 * calorias — resultado.
 */

type Modo = "pace" | "tempo" | "distancia";

const MODOS: { id: Modo; rotulo: string }[] = [
  { id: "pace", rotulo: "Tenho distância e pace" },
  { id: "tempo", rotulo: "Tenho distância e tempo" },
  { id: "distancia", rotulo: "Tenho tempo e pace" },
];

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });

export default function CalculadoraCorrida({ placement }: { placement: string }) {
  const [modo, setModo] = useState<Modo>("pace");
  const [pesoTexto, setPesoTexto] = useState("");
  const [kmTexto, setKmTexto] = useState("");
  const [paceTexto, setPaceTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [mostrarInclinacao, setMostrarInclinacao] = useState(false);
  const [inclinacao, setInclinacao] = useState(0);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const km = parseNumero(kmTexto);
  const kmOk = kmValidos(km);
  const pace = parsePace(paceTexto);
  const paceOk = paceValido(pace);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const incl = mostrarInclinacao && inclinacaoValida(inclinacao) ? inclinacao : 0;

  const resultado = !pesoOk
    ? null
    : modo === "pace"
      ? kmOk && paceOk ? deDistanciaEPace(km, pace, peso, incl) : null
      : modo === "tempo"
        ? kmOk && minutosOk ? deDistanciaETempo(km, minutos, peso, incl) : null
        : minutosOk && paceOk ? deTempoEPace(minutos, pace, peso, incl) : null;

  const provas = resultado && pesoOk ? tabelaProvas(resultado.pace, peso, incl) : null;
  const cmp = resultado && pesoOk ? comparaComCaminhada(resultado, peso) : null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("running_calculator_view", { placement });
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
      trackEvent("running_calculator_use", { placement, mode: modo, incline: incl > 0 ? "yes" : "no" });
    }
  }, [temResultado, placement, modo, incl]);

  function trocaModo(novo: Modo) {
    if (novo === modo) return;
    setModo(novo);
    trackEvent("running_mode_selected", { placement, mode: novo });
  }

  const resumoWhats = resultado
    ? `${fmt(resultado.km, 2)} km em ${formataRelogio(resultado.minutos * 60)} (pace ${formataPace(resultado.pace)}) ≈ ${arredondaKcal(resultado.kcal)} kcal`
    : null;
  const linhasShare = resultado
    ? [`${fmt(resultado.km, 2)} km`, `${formataRelogio(resultado.minutos * 60)} · pace ${formataPace(resultado.pace)}`, `≈ ${arredondaKcal(resultado.kcal)} kcal`]
    : [];
  const idc = (s: string) => `${s}-cor-${placement}`;

  const campoKm = (
    <div>
      <label htmlFor={idc("km")} className="block text-gray-300 text-sm font-medium mb-2">Qual distância?</label>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {PROVAS.map((p) => (
          <button key={p.id} type="button" aria-pressed={kmTexto === String(p.km)} className={chip(kmTexto === String(p.km))}
            onClick={() => { setKmTexto(String(p.km)); trackEvent("running_race_preset", { placement, race: p.id }); }}>
            {p.nome}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <input id={idc("km")} type="text" inputMode="decimal" autoComplete="off" placeholder="5" value={kmTexto}
          onChange={(e) => setKmTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("km-ajuda")} />
        <span className="text-gray-300 text-lg">km</span>
      </div>
      <p id={idc("km-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
        {kmTexto.trim() !== "" && !kmOk ? `Use um valor entre ${fmt(KM_MIN)} e ${KM_MAX} km.` : ""}
      </p>
    </div>
  );

  const campoPace = (
    <div>
      <label htmlFor={idc("pace")} className="block text-gray-300 text-sm font-medium mb-2">Em que pace?</label>
      <div className="flex items-center gap-3">
        <input id={idc("pace")} type="text" inputMode="numeric" autoComplete="off" placeholder="6:00" value={paceTexto}
          onChange={(e) => setPaceTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("pace-ajuda")} />
        <span className="text-gray-300 text-lg">min/km</span>
      </div>
      <p id={idc("pace-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px] max-w-xl">
        {paceTexto.trim() === ""
          ? "Minutos e segundos por quilômetro, como no relógio: 6:00, 5:30, 4:45."
          : !paceOk
            ? "Use minutos:segundos por quilômetro, entre 2:24 e 15:00 — os segundos não passam de 59."
            : `Cerca de ${fmt(3600 / pace!)} km/h.`}
      </p>
    </div>
  );

  const campoMinutos = (
    <div>
      <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">Quanto tempo?</label>
      <div className="flex items-center gap-3">
        <input id={idc("min")} type="text" inputMode="numeric" autoComplete="off" placeholder="30" value={minutosTexto}
          onChange={(e) => setMinutosTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("min-ajuda")} />
        <span className="text-gray-300 text-lg">minutos</span>
      </div>
      <p id={idc("min-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
        {minutosTexto.trim() !== "" && !minutosOk ? `Use um valor entre ${MINUTOS_MIN} e ${MINUTOS_MAX} minutos.` : ""}
      </p>
    </div>
  );

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative" data-testid="calculadora-corrida">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Pace, tempo e calorias da sua corrida
      </h2>

      <div role="group" aria-label="O que você já sabe" className="grid gap-2.5 sm:grid-cols-3 mb-7">
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
          {pesoTexto.trim() === ""
            ? "Na corrida o peso quase define o gasto: cada quilômetro custa cerca de 1 kcal por quilo de corpo, acima do repouso."
            : !pesoOk ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 mb-6">
        {modo !== "distancia" && campoKm}
        {modo !== "tempo" && campoPace}
        {modo !== "pace" && campoMinutos}
      </div>

      <div className="mb-7">
        {!mostrarInclinacao ? (
          <button type="button" onClick={() => { trackEvent("running_incline_open", { placement }); setMostrarInclinacao(true); }}
            className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
            style={{ textDecorationColor: "#BA9E50" }}>
            Correu em subida ou esteira inclinada? Informe a inclinação
          </button>
        ) : (
          <div>
            <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("incl")}>Inclinação</span>
            <div role="group" aria-labelledby={idc("incl")} className="flex flex-wrap gap-2">
              {[0, 2, 4, 6, 8, 10].map((i) => (
                <button key={i} type="button" onClick={() => setInclinacao(i)} aria-pressed={inclinacao === i} className={chip(inclinacao === i)}>
                  {i}%
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2 max-w-xl">
              {inclinacao === 0 ? `Plano. Até ${INCLINACAO_MAX}% — na corrida a subida pesa menos por ponto que na caminhada, porque a passada aproveita melhor o impulso.` : `${inclinacao}% de subida.`}
            </p>
          </div>
        )}
      </div>

      <div aria-live="polite">
        {resultado && pesoOk && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>

            <div className="grid gap-4 sm:grid-cols-3 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Gasto estimado</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {arredondaKcal(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  ≈ {Math.round(kcalPorKm(resultado))} kcal por km · {arredondaKcal(kcalLiquida(resultado, peso))} acima do repouso
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Tempo</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>{formataRelogio(resultado.minutos * 60)}</p>
                <p className="text-gray-400 text-sm mt-1">{fmt(resultado.km, 2)} km</p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Pace</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>{formataPace(resultado.pace)}</p>
                <p className="text-gray-400 text-sm mt-1">{fmt(resultado.velocidade)} km/h</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">{fraseContexto(peso, resultado)}</p>

            {resultado.equacao === "caminhada" && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
                {NOTA_EQUACAO_CAMINHADA}{" "}
                <Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>
                  A Calculadora de Calorias da Caminhada
                </Link>{" "}
                responde esse ritmo com mais detalhe — ela tem passos e inclinação de esteira.
              </p>
            )}

            {/* As provas no pace informado: o que quem corre realmente quer saber. */}
            {provas && (
              <div className="overflow-x-auto mb-5">
                <table className="w-full text-sm border-collapse">
                  <caption className="text-left text-gray-400 text-xs mb-2">
                    No pace de {formataPace(resultado.pace)}, para {fmt(peso)} kg
                  </caption>
                  <thead>
                    <tr className="border-b border-white/20">
                      <th scope="col" className="text-left text-gray-400 font-medium py-2.5 pr-4">Prova</th>
                      <th scope="col" className="text-left text-gray-400 font-medium py-2.5 pr-4">Tempo</th>
                      <th scope="col" className="text-left text-gray-400 font-medium py-2.5">Gasto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provas.map((l) => (
                      <tr key={l.prova.id} className="border-b border-white/10">
                        <td className="text-gray-300 py-2.5 pr-4">{l.prova.nome}</td>
                        <td className="text-white py-2.5 pr-4 font-medium tabular-nums">{formataRelogio(l.segundos)}</td>
                        <td className="text-gray-300 py-2.5 tabular-nums">≈ {arredondaKcal(l.kcal)} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                  Os tempos supõem o pace constante do início ao fim. Na maratona isso quase nunca acontece — o
                  tempo real costuma ser maior que a conta.
                </p>
              </div>
            )}

            {/* Correr x caminhar: os dois lados, porque mostrar um só engana. */}
            {cmp && (
              <div className="border-l-2 pl-4 mb-5 max-w-2xl" style={{ borderColor: "#BA9E50" }}>
                <p className="text-gray-300 leading-relaxed mb-2">
                  <strong className="text-white">Correr ou caminhar {fmt(resultado.km, 2)} km?</strong> Caminhando a{" "}
                  {fmt(cmp.velocidadeCaminhada)} km/h você gastaria cerca de{" "}
                  <strong className="text-white">{arredondaKcal(cmp.caminhadaMesmaDistancia.kcal)} kcal</strong> — contra{" "}
                  {arredondaKcal(cmp.corrida.kcal)} correndo. A mesma distância custa quase o mesmo, porque o gasto é quase
                  todo do deslocamento; só que a caminhada levaria {formataRelogio(cmp.caminhadaMesmaDistancia.minutos * 60)}.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  No <strong className="text-white">mesmo tempo</strong>, a conta vira: em{" "}
                  {formataRelogio(resultado.minutos * 60)} de caminhada você faria {fmt(cmp.caminhadaMesmoTempo.km)} km e
                  gastaria cerca de {arredondaKcal(cmp.caminhadaMesmoTempo.kcal)} kcal. É por tempo que a corrida ganha, não
                  por quilômetro.
                </p>
              </div>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_BRUTO}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("running_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    {resultado.equacao === "corrida" ? (
                      <>
                        A equação de corrida da ACSM:{" "}
                        <span className="text-white">VO₂ = 0,2 × velocidade + 0,9 × velocidade × inclinação + 3,5</span>, com a
                        velocidade em metros por minuto. A {fmt(resultado.velocidade)} km/h
                        {resultado.inclinacao > 0 ? ` com ${fmt(resultado.inclinacao)}% de inclinação` : ""} isso dá{" "}
                        {fmt(resultado.met)} METs.
                      </>
                    ) : (
                      <>
                        Abaixo de 8 km/h a equação de corrida não vale, então a conta usa a da caminhada: {fmt(resultado.met)} METs
                        a {fmt(resultado.velocidade)} km/h.
                      </>
                    )}
                  </p>
                  <p>
                    O gasto sai daí: <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span> — cerca de{" "}
                    {fmt(resultado.kcal / Math.max(resultado.minutos, 0.0001))} kcal por minuto para {fmt(peso)} kg.
                  </p>
                  <p>
                    Descontando o que você gastaria parado nesse tempo, a corrida acrescenta{" "}
                    <span className="text-white">{arredondaKcal(kcalLiquida(resultado, peso))} kcal</span> ao seu dia — cerca
                    de {fmt(kcalLiquidaPorKm(resultado, peso) / peso, 2)} kcal por quilo a cada quilômetro. Esse número
                    líquido é exatamente 1 kcal por quilo por quilômetro em qualquer pace, e é de onde vem a regra
                    clássica; o bruto acima dele fica em torno de {fmt(kcalPorKm(resultado) / peso, 2)} porque soma o
                    repouso do tempo em que você esteve correndo.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Corrida" caminho="/ferramentas/calculadora-corrida"
                local="tool_result" ferramenta="corrida" resultado={linhasShare} gancho="Calculei o pace e o gasto da minha corrida:" aparencia="solido" />
              {placement !== "calculadora-corrida" && (
                <Link href="/ferramentas/calculadora-corrida" onClick={() => trackEvent("running_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="corrida" categoria="padrao" resumo={resumoWhats} placement={placement} />
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
