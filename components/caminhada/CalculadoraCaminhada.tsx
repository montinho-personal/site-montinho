"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  INCLINACAO_MAX,
  INCLINACAO_MIN,
  KCAL_MAX,
  KCAL_MIN,
  KM_MAX,
  KM_MIN,
  MINUTOS_ALERTA,
  MINUTOS_MAX,
  MINUTOS_MIN,
  NOTA_BRUTO,
  NOTA_ESTIMATIVA,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  NOTA_VOLUME_ALTO,
  PASSOS_MAX,
  PASSOS_MIN,
  PESO_MAX,
  PESO_MIN,
  PRESETS_INCLINACAO,
  PRESETS_KM,
  PRESETS_MINUTOS,
  PRESETS_PASSOS,
  RITMOS,
  RITMO_PADRAO,
  VELOCIDADE_MAX,
  VELOCIDADE_MIN,
  arredondaKcal,
  arredondaPassos,
  deDistancia,
  deKcal,
  dePassos,
  deTempo,
  formataKm,
  formataTempo,
  formataVelocidade,
  fraseContexto,
  inclinacaoValida,
  kcalLiquida,
  kcalValida,
  kmValidos,
  metDaInclinacao,
  metNoPlano,
  minutosValidos,
  parseNumero,
  passosValidos,
  pesoValido,
  ritmo as ritmoDe,
  cadenciaPara,
  velocidadeMedida,
  velocidadeValida,
  type RitmoId,
} from "@/lib/caminhada";

/**
 * A Calculadora de Calorias da Caminhada.
 *
 * QUATRO MODOS, UMA PERGUNTA DE CADA VEZ
 *
 * As buscas que trazem gente para cá chegam com medidas diferentes: uns
 * têm o tempo ("30 minutos de esteira"), outros a distância ("5 km"),
 * outros os passos do relógio ("10 mil passos"), outros a meta ("quanto
 * tempo para gastar 300 kcal"). Servir tudo num formulário só produziria
 * seis campos em que nenhum é obviamente o primeiro. A pessoa escolhe a
 * pergunta antes de ver qualquer campo.
 *
 * O PESO E O RITMO ATRAVESSAM OS MODOS
 *
 * São os dois dados comuns. Trocar de modo e ter de digitar de novo seria
 * atrito puro, então ficam no estado do componente — e em lugar nenhum
 * além dele.
 *
 * A ESTEIRA É OPÇÃO, NÃO OUTRO MODO
 *
 * Inclinação e velocidade exata ficam fechadas por padrão. Quem caminha na
 * rua não precisa ver "12%"; quem faz 12-3-30 abre e digita. O mesmo
 * motor serve os dois.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador: nenhuma chamada de rede,
 * nada gravado, e os eventos registram uso e modo, nunca valor. O resumo
 * que vai para a mensagem de WhatsApp carrega calorias e tempo —
 * resultado —, jamais o peso que os gerou.
 */

type Modo = "tempo" | "distancia" | "passos" | "meta";

const MODOS: { id: Modo; rotulo: string }[] = [
  { id: "tempo", rotulo: "Quantas calorias em X minutos" },
  { id: "distancia", rotulo: "Quantas calorias em X km" },
  { id: "passos", rotulo: "Quantas calorias em X passos" },
  { id: "meta", rotulo: "Quanto tempo para gastar X kcal" },
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

export default function CalculadoraCaminhada({ placement }: { placement: string }) {
  const [modo, setModo] = useState<Modo>("tempo");
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [kmTexto, setKmTexto] = useState("");
  const [passosTexto, setPassosTexto] = useState("");
  const [kcalTexto, setKcalTexto] = useState("");
  const [ritmoId, setRitmoId] = useState<RitmoId>(RITMO_PADRAO);
  const [mostrarEsteira, setMostrarEsteira] = useState(false);
  const [velocidadeTexto, setVelocidadeTexto] = useState("");
  const [inclinacao, setInclinacao] = useState<number>(0);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = useMemo(() => parseNumero(pesoTexto), [pesoTexto]);
  const pesoOk = pesoValido(peso);
  const minutos = useMemo(() => parseNumero(minutosTexto), [minutosTexto]);
  const minutosOk = minutosValidos(minutos);
  const km = useMemo(() => parseNumero(kmTexto), [kmTexto]);
  const kmOk = kmValidos(km);
  const passos = useMemo(() => parseNumero(passosTexto), [passosTexto]);
  const passosOk = passosValidos(passos);
  const alvoKcal = useMemo(() => parseNumero(kcalTexto), [kcalTexto]);
  const kcalOk = kcalValida(alvoKcal);

  const rit = ritmoDe(ritmoId);
  const velocidadeCustom = useMemo(() => parseNumero(velocidadeTexto), [velocidadeTexto]);
  /* A velocidade exata só entra se a esteira foi aberta, preenchida e válida. */
  const velocidade = mostrarEsteira && velocidadeValida(velocidadeCustom) ? velocidadeCustom : rit.velocidade;
  const incl = mostrarEsteira && inclinacaoValida(inclinacao) ? inclinacao : 0;
  /* Com velocidade manual, a cadência acompanha a velocidade, não o botão de ritmo. */
  const cadencia = velocidade === rit.velocidade ? rit.cadencia : cadenciaPara(velocidade);

  /* O resultado de cada modo. Null enquanto faltar dado — a view não inventa zero. */
  /* Conta barata: sem useMemo, recalcula a cada render. */
  const resultado = (() => {
    if (!pesoOk) return null;
    if (modo === "tempo") return minutosOk ? deTempo(minutos, peso, velocidade, incl, cadencia) : null;
    if (modo === "distancia") return kmOk ? deDistancia(km, peso, velocidade, incl, cadencia) : null;
    if (modo === "passos") return passosOk ? dePassos(passos, peso, velocidade, incl, cadencia) : null;
    return kcalOk ? deKcal(alvoKcal, peso, velocidade, incl, cadencia) : null;
  })();

  const volumeAlto = resultado !== null && resultado.minutos > MINUTOS_ALERTA;

  /** View: só quando o bloco entra de fato na tela. */
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("walking_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  /** Uso: a primeira vez que sai um resultado. Sem o peso, sem o número. */
  useEffect(() => {
    if (resultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("walking_calculator_use", { placement, mode: modo, pace: ritmoId, incline: incl > 0 ? "yes" : "no" });
    }
  }, [resultado, placement, modo, ritmoId, incl]);

  function trocaModo(novo: Modo) {
    if (novo === modo) return;
    setModo(novo);
    trackEvent("walking_mode_selected", { placement, mode: novo });
  }

  const linhasShare = resultado
    ? [`${formataTempo(resultado.minutos)} de caminhada`, `≈ ${formataKm(resultado.km)}`, `≈ ${arredondaKcal(resultado.kcal)} kcal`]
    : [];
  const resumoWhats = resultado
    ? `${formataTempo(resultado.minutos)} de caminhada ≈ ${arredondaKcal(resultado.kcal)} kcal`
    : null;

  const idc = (s: string) => `${s}-cam-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-caminhada"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        O que você quer descobrir?
      </h2>

      {/* Escolha do modo */}
      <div role="group" aria-label="O que você quer descobrir" className="grid gap-2.5 sm:grid-cols-2 mb-7">
        {MODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => trocaModo(m.id)}
            aria-pressed={m.id === modo}
            className={`text-left px-4 py-3.5 border transition-colors min-h-[44px] ${
              m.id === modo
                ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white"
                : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
            }`}
          >
            <span className="font-semibold text-sm sm:text-base">{m.rotulo}</span>
          </button>
        ))}
      </div>

      {/* Peso — comum aos quatro modos */}
      <div className="mb-6">
        <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">
          Quanto você pesa?
        </label>
        <div className="flex items-center gap-3">
          <input
            id={idc("peso")}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="70"
            value={pesoTexto}
            onChange={(e) => setPesoTexto(e.target.value)}
            className={`w-32 ${campo}`}
            aria-describedby={idc("peso-ajuda")}
          />
          <span className="text-gray-300 text-lg">kg</span>
        </div>
        <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {pesoTexto.trim() === ""
            ? "É o que mais muda o resultado: corpos mais pesados gastam mais energia no mesmo caminho."
            : !pesoOk
              ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).`
              : ""}
        </p>
      </div>

      {/* Campo específico do modo */}
      {modo === "tempo" && (
        <div className="mb-6">
          <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">
            Quanto tempo de caminhada?
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {PRESETS_MINUTOS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setMinutosTexto(String(p));
                  trackEvent("walking_preset", { placement, preset: `${p}min` });
                }}
                aria-pressed={minutosTexto === String(p)}
                className={chip(minutosTexto === String(p))}
              >
                {p} min
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              id={idc("min")}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="30"
              value={minutosTexto}
              onChange={(e) => setMinutosTexto(e.target.value)}
              className={`w-32 ${campo}`}
              aria-describedby={idc("min-ajuda")}
            />
            <span className="text-gray-300 text-lg">minutos</span>
          </div>
          <p id={idc("min-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {minutosTexto.trim() !== "" && !minutosOk ? `Use um valor entre ${MINUTOS_MIN} e ${MINUTOS_MAX} minutos.` : ""}
          </p>
        </div>
      )}

      {modo === "distancia" && (
        <div className="mb-6">
          <label htmlFor={idc("km")} className="block text-gray-300 text-sm font-medium mb-2">
            Quantos quilômetros?
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {PRESETS_KM.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setKmTexto(String(p));
                  trackEvent("walking_preset", { placement, preset: `${p}km` });
                }}
                aria-pressed={kmTexto === String(p)}
                className={chip(kmTexto === String(p))}
              >
                {p} km
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              id={idc("km")}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="5"
              value={kmTexto}
              onChange={(e) => setKmTexto(e.target.value)}
              className={`w-32 ${campo}`}
              aria-describedby={idc("km-ajuda")}
            />
            <span className="text-gray-300 text-lg">km</span>
          </div>
          <p id={idc("km-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {kmTexto.trim() !== "" && !kmOk ? `Use um valor entre ${fmt(KM_MIN)} e ${KM_MAX} km.` : ""}
          </p>
        </div>
      )}

      {modo === "passos" && (
        <div className="mb-6">
          <label htmlFor={idc("passos")} className="block text-gray-300 text-sm font-medium mb-2">
            Quantos passos?
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {PRESETS_PASSOS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setPassosTexto(String(p));
                  trackEvent("walking_preset", { placement, preset: `${p}passos` });
                }}
                aria-pressed={passosTexto === String(p)}
                className={chip(passosTexto === String(p))}
              >
                {p.toLocaleString("pt-BR")}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              id={idc("passos")}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="10000"
              value={passosTexto}
              onChange={(e) => setPassosTexto(e.target.value)}
              className={`w-40 ${campo}`}
              aria-describedby={idc("passos-ajuda")}
            />
            <span className="text-gray-300 text-lg">passos</span>
          </div>
          <p id={idc("passos-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {passosTexto.trim() !== "" && !passosOk
              ? `Use um número inteiro entre ${PASSOS_MIN} e ${PASSOS_MAX.toLocaleString("pt-BR")}.`
              : "Os passos viram tempo pela cadência do ritmo escolhido abaixo — não pela passada, que varia com a altura."}
          </p>
        </div>
      )}

      {modo === "meta" && (
        <div className="mb-6">
          <label htmlFor={idc("kcal")} className="block text-gray-300 text-sm font-medium mb-2">
            Quantas calorias você quer gastar?
          </label>
          <div className="flex items-center gap-3">
            <input
              id={idc("kcal")}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              placeholder="300"
              value={kcalTexto}
              onChange={(e) => setKcalTexto(e.target.value)}
              className={`w-36 ${campo}`}
              aria-describedby={idc("kcal-ajuda")}
            />
            <span className="text-gray-300 text-lg">kcal</span>
          </div>
          <p id={idc("kcal-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {kcalTexto.trim() !== "" && !kcalOk ? `Use um valor entre ${KCAL_MIN} e ${KCAL_MAX.toLocaleString("pt-BR")} kcal.` : ""}
          </p>
        </div>
      )}

      {/* Ritmo — comum aos quatro */}
      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("ritmo")}>
          Em que ritmo você caminha?
        </span>
        <div role="group" aria-labelledby={idc("ritmo")} className="flex flex-wrap gap-2">
          {RITMOS.map((r) => (
            <button key={r.id} type="button" onClick={() => setRitmoId(r.id)} aria-pressed={ritmoId === r.id} className={chip(ritmoId === r.id)}>
              {r.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">
          {rit.comoReconhecer} <span className="text-gray-500">{rit.faixa} · cerca de {rit.cadencia} passos por minuto.</span>
        </p>
      </div>

      {/* Esteira — velocidade exata e inclinação, fechadas por padrão */}
      <div className="mb-7">
        {!mostrarEsteira ? (
          <button
            type="button"
            onClick={() => {
              trackEvent("walking_treadmill_open", { placement });
              setMostrarEsteira(true);
            }}
            className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
            style={{ textDecorationColor: "#BA9E50" }}
          >
            Na esteira? Informe velocidade e inclinação
          </button>
        ) : (
          <div className="space-y-5">
            <div>
              <label htmlFor={idc("vel")} className="block text-gray-300 text-sm font-medium mb-2">
                Velocidade da esteira <span className="text-gray-500 font-normal">(opcional)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  id={idc("vel")}
                  type="text"
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder={fmt(rit.velocidade)}
                  value={velocidadeTexto}
                  onChange={(e) => setVelocidadeTexto(e.target.value)}
                  className={`w-28 ${campo}`}
                  aria-describedby={idc("vel-ajuda")}
                />
                <span className="text-gray-300 text-lg">km/h</span>
              </div>
              <p id={idc("vel-ajuda")} className="text-gray-400 text-sm mt-2 max-w-xl">
                {velocidadeTexto.trim() !== "" && !velocidadeValida(velocidadeCustom)
                  ? `Use um valor entre ${VELOCIDADE_MIN} e ${VELOCIDADE_MAX} km/h — acima disso já é corrida, e a conta é outra.`
                  : "Se preencher, a velocidade substitui o ritmo escolhido acima. Vazio, vale o ritmo."}
              </p>
            </div>
            <div>
              <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("incl")}>
                Inclinação
              </span>
              <div role="group" aria-labelledby={idc("incl")} className="flex flex-wrap gap-2">
                {PRESETS_INCLINACAO.map((i) => (
                  <button key={i} type="button" onClick={() => setInclinacao(i)} aria-pressed={inclinacao === i} className={chip(inclinacao === i)}>
                    {i}%
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-2 max-w-xl">
                {inclinacao === 0
                  ? `Plano. Entre ${INCLINACAO_MIN} e ${INCLINACAO_MAX}% — 12% é o do método 12-3-30.`
                  : `${inclinacao}% soma cerca de ${fmt(metDaInclinacao(velocidade, inclinacao))} METs ao ritmo — é a subida que faz a esteira inclinada render.`}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Resultado */}
      <div aria-live="polite">
        {resultado && pesoOk && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>
              Seu resultado
            </p>

            <div className="grid gap-4 sm:grid-cols-3 mb-5">
              <div className={modo === "meta" ? "border border-white/15 p-5" : "border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5"}>
                <p className="text-gray-400 text-xs mb-1">Gasto estimado</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {arredondaKcal(resultado.kcal)}
                  <span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
              </div>
              <div className={modo === "meta" ? "border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5" : "border border-white/15 p-5"}>
                <p className="text-gray-400 text-xs mb-1">Tempo</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {formataTempo(resultado.minutos)}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">{modo === "passos" ? "Distância" : "Distância · passos"}</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {formataKm(resultado.km)}
                </p>
                {modo !== "passos" && (
                  <p className="text-gray-400 text-sm mt-1">≈ {arredondaPassos(resultado.passos).toLocaleString("pt-BR")} passos</p>
                )}
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">{fraseContexto(peso, resultado)}</p>

            {volumeAlto && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
                {NOTA_VOLUME_ALTO}
              </p>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
              {NOTA_ESTIMATIVA} {NOTA_BRUTO}
            </p>

            {/* Metodologia */}
            <div className="border-t border-white/10 pt-5 mb-6">
              <button
                type="button"
                onClick={() => {
                  if (!mostrarMetodo) trackEvent("walking_methodology_open", { placement });
                  setMostrarMetodo(!mostrarMetodo);
                }}
                aria-expanded={mostrarMetodo}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}
              >
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    O gasto por minuto vem da equação de METs: <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>.
                    Para {fmt(peso)} kg a {formataVelocidade(resultado.velocidade)}
                    {resultado.inclinacao > 0 ? ` com ${fmt(resultado.inclinacao)}% de inclinação` : ""} ({fmt(resultado.met)} METs), isso dá cerca de{" "}
                    {fmt(resultado.kcal / Math.max(resultado.minutos, 0.0001))} kcal por minuto.
                  </p>
                  <p>
                    O MET no plano ({fmt(metNoPlano(resultado.velocidade))}) é{" "}
                    {velocidadeMedida(resultado.velocidade)
                      ? `o do Compêndio de Atividades Físicas para ${rit.faixa}`
                      : "interpolado entre as faixas de velocidade que o Compêndio de Atividades Físicas mediu"}
                    .
                    {resultado.inclinacao > 0 &&
                      ` A inclinação soma ${fmt(metDaInclinacao(resultado.velocidade, resultado.inclinacao))} METs, pelo termo vertical da equação de caminhada da ACSM (1,8 × velocidade em m/min × inclinação).`}
                  </p>
                  <p>
                    Esse gasto é bruto. Descontando o que você gastaria parado nesse tempo (1 MET), a caminhada acrescenta cerca de{" "}
                    <span className="text-white">{arredondaKcal(kcalLiquida(resultado, peso))} kcal</span> ao seu dia.
                  </p>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar
                contexto="tool-result"
                titulo="Calculadora de Calorias da Caminhada"
                caminho="/ferramentas/calculadora-calorias-caminhada"
                local="tool_result"
                ferramenta="caminhada"
                resultado={linhasShare}
                gancho="Descobri quantas calorias a minha caminhada gasta:"
                aparencia="solido"
              />
              {placement !== "calculadora-calorias-caminhada" && (
                <Link
                  href="/ferramentas/calculadora-calorias-caminhada"
                  onClick={() => trackEvent("walking_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors"
                  style={{ textDecorationColor: "#BA9E50" }}
                >
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado
              ferramenta="caminhada"
              categoria={volumeAlto ? "volume_alto" : "padrao"}
              resumo={resumoWhats}
              placement={placement}
            />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_SEM_PERDA_LOCALIZADA} {NOTA_SEGURANCA}{" "}
        <Link href="/blog/deficit-calorico-como-calcular" className={ln}>
          Entenda como funciona o déficit calórico
        </Link>
        .
      </p>
    </div>
  );
}
