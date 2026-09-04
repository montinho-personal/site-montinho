"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import PosResultado from "@/components/ferramentas/PosResultado";
import {
  DISCLAIMER,
  FC_REPOUSO_MAX,
  FC_REPOUSO_MIN,
  FONTE_KARVONEN,
  FONTE_TANAKA,
  FONTE_ZONAS,
  IDADE_MAX,
  IDADE_MIN,
  NOTA_BETABLOQUEADOR,
  NOTA_ESTIMATIVA,
  NOTA_REPOUSO,
  fcMaxima,
  fcMaximaClassica,
  parseInteiro,
  zonasEmBpm,
} from "@/lib/fc";

/**
 * Calculadora de zonas de frequência cardíaca.
 *
 * Um campo obrigatório (idade), um opcional (FC de repouso) que troca o
 * método de percentual simples para Karvonen. O cálculo é instantâneo:
 * obrigar um clique em "calcular" para uma subtração seria cerimônia.
 *
 * PRIVACIDADE
 *
 * Idade e FC de repouso são dados do corpo. Nada disso sai do navegador:
 * nenhuma chamada de rede, nada gravado, e os eventos registram uso, nunca
 * o valor. O resumo que vai para a mensagem de WhatsApp é null de propósito
 * — qualquer número desta ferramenta (FC máxima, limite de zona) é uma
 * função direta da idade e a entregaria de volta.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";

export default function CalculadoraFC({
  placement,
}: {
  /** Onde o componente está — segmenta os eventos, nunca carrega os valores. */
  placement: string;
}) {
  const [idadeTexto, setIdadeTexto] = useState("");
  const [repousoTexto, setRepousoTexto] = useState("");
  const [mostrarRepouso, setMostrarRepouso] = useState(false);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const idade = useMemo(() => parseInteiro(idadeTexto), [idadeTexto]);
  const idadeValida = idade !== null && idade >= IDADE_MIN && idade <= IDADE_MAX;

  const repouso = useMemo(() => parseInteiro(repousoTexto), [repousoTexto]);
  const repousoValido = repouso !== null && repouso >= FC_REPOUSO_MIN && repouso <= FC_REPOUSO_MAX;
  /* Repouso só entra na conta se foi aberto, preenchido e válido. */
  const repousoUsado = mostrarRepouso && repousoValido ? repouso : null;

  const fcMax = idadeValida ? fcMaxima(idade) : null;
  const faixas = fcMax !== null ? zonasEmBpm(fcMax, repousoUsado) : null;
  const zona2 = faixas?.find((f) => f.zona.id === "z2") ?? null;

  /** View: só quando o bloco entra de fato na tela. */
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("heart_rate_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  /** Uso: primeira vez que uma idade válida produz resultado. Sem a idade. */
  useEffect(() => {
    if (idadeValida && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("heart_rate_calculator_use", { placement });
    }
  }, [idadeValida, placement]);

  function copiarResultado() {
    if (!faixas || fcMax === null) return;
    const linhas = [
      `FC máxima estimada: ${fcMax} bpm${repousoUsado !== null ? " (zonas por Karvonen)" : ""}`,
      ...faixas.map((f) => `Zona ${f.zona.numero} (${f.zona.nome}): ${f.de} a ${f.ate} bpm`),
      "Calculado no Montinho Personal.",
    ].join("\n");
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(linhas).catch(() => {});
  }

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-fc"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />

      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuito · a idade não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
        Calculadora de Zonas de Frequência Cardíaca
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6 max-w-xl">
        Descubra sua frequência cardíaca máxima estimada e em que batimento fica cada zona de treino.
      </p>

      {/* Idade */}
      <div className="mb-5">
        <label htmlFor={`idade-${placement}`} className="block text-gray-300 text-sm font-medium mb-2">
          Sua idade
        </label>
        <div className="flex items-center gap-3">
          <input
            id={`idade-${placement}`}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="40"
            value={idadeTexto}
            onChange={(e) => setIdadeTexto(e.target.value)}
            className="w-28 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors"
            aria-describedby={`idade-ajuda-${placement}`}
          />
          <span className="text-gray-300 text-lg">anos</span>
        </div>
        <p id={`idade-ajuda-${placement}`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {idadeTexto.trim() === ""
            ? "Exemplo: aos 40 anos, a FC máxima estimada é 180 bpm e a zona 2 fica entre 108 e 126."
            : !idadeValida
              ? `Confira a idade informada (entre ${IDADE_MIN} e ${IDADE_MAX}).`
              : ""}
        </p>
      </div>

      {/* FC de repouso, opcional */}
      <div className="mb-6">
        {!mostrarRepouso ? (
          <button
            type="button"
            onClick={() => {
              trackEvent("heart_rate_resting_open", { placement });
              setMostrarRepouso(true);
            }}
            className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
            style={{ textDecorationColor: "#BA9E50" }}
          >
            Sabe sua frequência de repouso? Deixa as zonas mais precisas
          </button>
        ) : (
          <div>
            <label htmlFor={`repouso-${placement}`} className="block text-gray-300 text-sm font-medium mb-2">
              Frequência cardíaca de repouso <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                id={`repouso-${placement}`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                placeholder="60"
                value={repousoTexto}
                onChange={(e) => setRepousoTexto(e.target.value)}
                className="w-28 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors"
                aria-describedby={`repouso-ajuda-${placement}`}
              />
              <span className="text-gray-300 text-lg">bpm</span>
            </div>
            <p id={`repouso-ajuda-${placement}`} className="text-gray-400 text-sm mt-2 max-w-xl">
              {repousoTexto.trim() !== "" && !repousoValido
                ? `Confira o valor (entre ${FC_REPOUSO_MIN} e ${FC_REPOUSO_MAX}).`
                : NOTA_REPOUSO}
            </p>
          </div>
        )}
      </div>

      {/* Resultado — aria-live anuncia a atualização para leitores de tela */}
      <div aria-live="polite">
        {idadeValida && fcMax !== null && faixas && zona2 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="border border-white/15 p-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: "#BA9E50" }}>
                  FC máxima estimada
                </p>
                <p className="text-white font-bold text-5xl leading-none mb-1" style={h}>
                  {fcMax}
                  <span className="text-lg font-normal text-gray-300"> bpm</span>
                </p>
                <p className="text-gray-400 text-xs">
                  208 − 0,7 × idade · {FONTE_TANAKA.rotuloCurto} · ±{FONTE_TANAKA.desvioBpm} bpm
                </p>
              </div>
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-1" style={{ color: "#BA9E50" }}>
                  Sua zona 2
                </p>
                <p className="text-white font-bold text-5xl leading-none mb-1" style={h}>
                  {zona2.de}
                  <span className="text-2xl font-normal text-gray-300"> a </span>
                  {zona2.ate}
                  <span className="text-lg font-normal text-gray-300"> bpm</span>
                </p>
                <p className="text-gray-400 text-xs">
                  {repousoUsado !== null ? `método de Karvonen, com repouso de ${repousoUsado} bpm` : "60% a 70% da máxima"}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto mb-3">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left text-gray-400 font-medium py-2.5 pr-3">Zona</th>
                    <th className="text-left text-gray-400 font-medium py-2.5 pr-3 whitespace-nowrap">Batimentos</th>
                    <th className="text-left text-gray-400 font-medium py-2.5">Como saber que está nela</th>
                  </tr>
                </thead>
                <tbody>
                  {faixas.map((f) => (
                    <tr key={f.zona.id} className={`border-b border-white/10 ${f.zona.destaque ? "bg-[#BA9E50]/[0.06]" : ""}`}>
                      <td className="py-3 pr-3 align-top">
                        <p className="text-white font-semibold whitespace-nowrap">
                          Zona {f.zona.numero} · {f.zona.nome}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {f.zona.de}–{f.zona.ate}%
                        </p>
                      </td>
                      <td className="py-3 pr-3 align-top text-white font-medium tabular-nums whitespace-nowrap">
                        {f.de} a {f.ate}
                      </td>
                      <td className="py-3 align-top text-gray-300 leading-relaxed">
                        {f.zona.fala}
                        <span className="block text-gray-500 text-xs mt-1">{f.zona.exemplos}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-3 max-w-2xl">{NOTA_ESTIMATIVA}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_BETABLOQUEADOR}</p>

            {/* Metodologia */}
            <div className="border-t border-white/10 pt-5 mb-6">
              <button
                type="button"
                onClick={() => {
                  if (!mostrarMetodo) trackEvent("heart_rate_methodology_open", { placement });
                  setMostrarMetodo(!mostrarMetodo);
                }}
                aria-expanded={mostrarMetodo}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}
              >
                De onde saem esses números?
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    A FC máxima vem de{" "}
                    <a href={FONTE_TANAKA.url} target="_blank" rel="noopener noreferrer" className={ln}>
                      {FONTE_TANAKA.rotulo}
                    </a>
                    : 208 − 0,7 × idade. Para a sua idade, a fórmula antiga de 220 − idade daria{" "}
                    <span className="text-white">{fcMaximaClassica(idade)} bpm</span>; a diferença entre as duas cresce
                    depois dos 40 e é o motivo de a antiga ter sido abandonada.
                  </p>
                  <p>
                    {repousoUsado !== null ? (
                      <>
                        Com a FC de repouso, as zonas usam o método de{" "}
                        <a href={FONTE_KARVONEN.url} target="_blank" rel="noopener noreferrer" className={ln}>
                          {FONTE_KARVONEN.rotuloCurto}
                        </a>
                        : o percentual é aplicado sobre a reserva (máxima − repouso) e o repouso é somado de volta. Isso
                        aproxima as zonas do esforço real de quem tem repouso muito alto ou muito baixo.
                      </>
                    ) : (
                      <>
                        Sem a FC de repouso, cada zona é um percentual direto da máxima, que é o que a maioria dos
                        relógios faz. Com o repouso, a calculadora troca para o método de Karvonen, mais fiel ao esforço.
                      </>
                    )}
                  </p>
                  <p>Os cortes das cinco zonas seguem a convenção do {FONTE_ZONAS.rotuloCurto}. São referência, não lei: o que importa é o esforço subir de forma consistente de uma para a outra.</p>
                </div>
              )}
            </div>

            {/* Ações e links contextuais */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button
                type="button"
                onClick={copiarResultado}
                className="border border-white/25 text-gray-300 hover:text-white hover:border-white/50 text-sm px-4 py-2.5 transition-colors min-h-[44px]"
              >
                Copiar resultado
              </button>
              {placement !== "zonas-de-frequencia-cardiaca" && (
                <Link
                  href="/blog/zonas-de-frequencia-cardiaca"
                  onClick={() => trackEvent("heart_rate_article_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors"
                  style={{ textDecorationColor: "#BA9E50" }}
                >
                  Entenda o que fazer em cada zona →
                </Link>
              )}
            </div>

            {/*
              Próximo passo. O resumo é null de propósito: FC máxima e limite
              de zona são função direta da idade, e idade não vai em mensagem.
            */}
            <PosResultado
              ferramenta="fc"
              categoria="padrao"
              resumo={null}
              placement={placement}
            />
          </>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">{DISCLAIMER}</p>
    </div>
  );
}
