"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  NOTA_ESTIMATIVA,
  NOTA_FAIXA_PERCENTUAL,
  NOTA_MUSCULO,
  NOTA_PRIMEIRAS_SEMANAS,
  PERDA_MAX_FRACAO,
  PESO_MAX,
  PESO_MIN,
  SEMANAS_MAX,
  SEMANAS_MIN,
  abaixoDaRegraFixa,
  avalia,
  calcula,
  fimDoAno,
  formataData,
  formataFaixaKg,
  formataKg,
  formataSemanas,
  paraISO,
  parseData,
  parseNumero,
  pesoValido,
  semanasAte,
  semanasPara,
  semanasValidas,
} from "@/lib/meta";

/**
 * A Calculadora de Meta de Peso por Data.
 *
 * A DATA VEM PRIMEIRO, E JÁ VEM PREENCHIDA
 *
 * A busca que traz gente para cá é sazonal e tem uma data implícita: o fim
 * do ano. Ela já vem no campo, porque pedir que a pessoa digite "31/12" é
 * pedir trabalho para confirmar o que ela já disse ao Google — e quem tem
 * outra data (casamento, viagem) troca em um toque.
 *
 * A META É OPCIONAL, E EXISTE PARA PODER DIZER NÃO
 *
 * Sem ela a ferramenta responde "quanto dá". Com ela, responde se o número
 * que a pessoa tem na cabeça cabe no prazo — e quando não cabe, diz em
 * quanto tempo caberia, em vez de devolver um plano que não se cumpre.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador, nada é gravado, e os
 * eventos levam só o veredito da meta — nunca peso, nunca data.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });

export default function CalculadoraMeta({ placement }: { placement: string }) {
  /* A data de hoje é do cliente: fixá-la no servidor faria o prazo envelhecer com o cache. */
  const [hoje, setHoje] = useState<Date | null>(null);
  const [pesoTexto, setPesoTexto] = useState("");
  const [dataTexto, setDataTexto] = useState("");
  const [metaTexto, setMetaTexto] = useState("");
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  /*
   * A data vem do cliente, não do servidor: a página é estática, e o HTML
   * do build congelaria "hoje" na data em que o site foi publicado — o
   * prazo envelheceria sozinho. O setState sai do corpo do efeito pelo
   * mesmo motivo que em PosResultado: rodar síncrono ali dispara render em
   * cascata, e o React 19 recusa.
   */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      setHoje(d);
      setDataTexto(paraISO(fimDoAno(d)));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const alvo = parseData(dataTexto);
  const semanas = hoje && alvo ? semanasAte(hoje, alvo) : 0;
  const prazoOk = semanasValidas(semanas);
  const meta = parseNumero(metaTexto);
  const metaOk = meta !== null && meta > 0 && pesoOk && meta < peso * 0.6;

  const resultado = pesoOk && prazoOk ? calcula(peso, semanas) : null;
  /* null quando a meta é grande demais para um horizonte que signifique algo. */
  const semanasNecessarias = resultado && metaOk ? semanasPara(resultado.pesoAtual, meta) : null;
  const veredito = resultado && metaOk ? avalia(resultado, meta) : null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("goal_calculator_view", { placement });
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
      trackEvent("goal_calculator_use", { placement, verdict: veredito ?? "sem_meta" });
    }
  }, [temResultado, placement, veredito]);

  const resumoWhats = resultado
    ? `em ${formataSemanas(resultado.semanas)} dá para perder ${formataFaixaKg(resultado.perda)}`
    : null;
  const linhasShare = resultado
    ? [`${formataSemanas(resultado.semanas)} até a data`, `Faixa possível: ${formataFaixaKg(resultado.perda)}`]
    : [];
  const idc = (s: string) => `${s}-meta-${placement}`;

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative" data-testid="calculadora-meta">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quantos quilos dá para perder até lá?
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 mb-6">
        <div>
          <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">Quanto você pesa hoje?</label>
          <div className="flex items-center gap-3">
            <input id={idc("peso")} type="text" inputMode="decimal" autoComplete="off" placeholder="90" value={pesoTexto}
              onChange={(e) => setPesoTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("peso-ajuda")} />
            <span className="text-gray-300 text-lg">kg</span>
          </div>
          <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {pesoTexto.trim() === ""
              ? "O peso importa: a faixa segura é percentual dele."
              : !pesoOk ? `Confira o peso (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
          </p>
        </div>
        <div>
          <label htmlFor={idc("data")} className="block text-gray-300 text-sm font-medium mb-2">Até quando?</label>
          <input id={idc("data")} type="date" value={dataTexto} min={hoje ? paraISO(hoje) : undefined}
            onChange={(e) => { setDataTexto(e.target.value); trackEvent("goal_date_changed", { placement }); }}
            className={`${campo} text-lg w-full sm:w-48`} aria-describedby={idc("data-ajuda")} />
          <p id={idc("data-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {!hoje
              ? ""
              : !alvo
                ? "Escolha uma data."
                : semanas < SEMANAS_MIN
                  ? "Faltam menos de duas semanas — não há o que planejar nesse prazo."
                  : semanas > SEMANAS_MAX
                    ? "Mais de dois anos: para um prazo assim, a conta que ajuda é outra."
                    : `${formataSemanas(semanas)} até ${formataData(alvo)}.`}
          </p>
        </div>
      </div>

      <div className="mb-7">
        <label htmlFor={idc("meta")} className="block text-gray-300 text-sm font-medium mb-2">
          Você tem um número em mente? <span className="text-gray-500 font-normal">(opcional)</span>
        </label>
        <div className="flex items-center gap-3">
          <input id={idc("meta")} type="text" inputMode="decimal" autoComplete="off" placeholder="10" value={metaTexto}
            onChange={(e) => setMetaTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("meta-ajuda")} />
          <span className="text-gray-300 text-lg">kg a perder</span>
        </div>
        <p id={idc("meta-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px] max-w-xl">
          {metaTexto.trim() === ""
            ? "Se preencher, a calculadora diz se esse número cabe no prazo — e, se não couber, em quanto tempo caberia."
            : !metaOk && pesoOk
              ? "Confira o número: a meta precisa ser positiva e menor que 60% do seu peso."
              : ""}
        </p>
      </div>

      <div aria-live="polite">
        {resultado && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Sua projeção</p>

            <div className="grid gap-4 sm:grid-cols-3 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Dá para perder</p>
                <p className="text-white font-bold text-2xl sm:text-3xl leading-none" style={h}>{formataFaixaKg(resultado.perda)}</p>
                <p className="text-gray-400 text-sm mt-1">{fmt(resultado.perdaPct.min)}% a {fmt(resultado.perdaPct.max)}% do seu peso</p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Peso na data</p>
                <p className="text-white font-bold text-2xl sm:text-3xl leading-none" style={h}>
                  {formataKg(resultado.pesoFinal.min).replace(" kg", "")} a {formataKg(resultado.pesoFinal.max)}
                </p>
                <p className="text-gray-400 text-sm mt-1">em {formataSemanas(resultado.semanas)}</p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Por semana</p>
                <p className="text-white font-bold text-2xl sm:text-3xl leading-none" style={h}>
                  {fmt(resultado.porSemana.min, 2)} a {fmt(resultado.porSemana.max, 2)} kg
                </p>
                <p className="text-gray-400 text-sm mt-1">déficit de {Math.round(resultado.deficitDiario.min)} a {Math.round(resultado.deficitDiario.max)} kcal/dia</p>
              </div>
            </div>

            {/* O veredito da meta: a parte que pode dizer não. */}
            {veredito && meta !== null && (
              <div className="mb-5 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
                {veredito === "cabe" ? (
                  <p className="text-gray-300 leading-relaxed">
                    <strong className="text-white">Os {formataKg(meta)} cabem no prazo.</strong> Eles ficam dentro da faixa
                    segura, o que significa que dá para chegar lá sem apertar o ritmo além do que o corpo sustenta — e sem
                    pagar em músculo.
                  </p>
                ) : veredito === "apertado" ? (
                  <>
                    <p className="text-gray-300 leading-relaxed mb-2">
                      <strong className="text-white">Os {formataKg(meta)} ficam apertados.</strong> A faixa segura para{" "}
                      {formataSemanas(resultado.semanas)} vai até {formataKg(resultado.perda.max)}; a sua meta pede um ritmo
                      acima disso.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      Dá para chegar perto
                      {semanasNecessarias !== null ? ` — e com ${formataSemanas(semanasNecessarias)} o número caberia com folga` : ""}
                      . {NOTA_MUSCULO}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-300 leading-relaxed mb-2">
                      <strong className="text-white">Os {formataKg(meta)} não cabem em {formataSemanas(resultado.semanas)}.</strong>{" "}
                      A faixa segura para esse prazo vai até {formataKg(resultado.perda.max)}, e forçar a diferença custaria
                      músculo e quase sempre termina em reganho.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      {semanasNecessarias !== null
                        ? `Esse número caberia em cerca de ${formataSemanas(semanasNecessarias)}.`
                        : "Esse número é grande demais para caber num prazo que uma projeção consiga descrever com honestidade."}{" "}
                      Se a data não pode mudar, a meta que cabe nela é {formataKg(resultado.perda.max)} — e ela já é bastante.
                    </p>
                  </>
                )}
              </div>
            )}

            {resultado.noTeto && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
                <strong className="text-white">O prazo é longo demais para uma projeção só.</strong> A conta foi cortada em{" "}
                {Math.round(PERDA_MAX_FRACAO * 100)}% do seu peso porque a partir daí ela deixa de descrever um processo real:
                nenhum emagrecimento segue o mesmo ritmo por tantos meses, e o que acontece depois desse ponto depende de
                revisões que nenhuma projeção antecipa. Use um prazo mais curto — três a seis meses — e refaça a conta
                quando chegar lá.
              </p>
            )}
            {abaixoDaRegraFixa(resultado) && (
              <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-2xl">
                Você deve encontrar por aí a regra de &ldquo;0,5 a 1 kg por semana&rdquo;. Ela é uma média pensada para
                quem pesa mais: para o seu peso, a faixa percentual fica abaixo disso, e é ela que preserva músculo.
              </p>
            )}
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">{NOTA_PRIMEIRAS_SEMANAS}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_FAIXA_PERCENTUAL}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("goal_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    A faixa é de <span className="text-white">0,5% a 1% do peso corporal por semana</span>, aplicada semana a
                    semana — e não multiplicada pelo peso inicial, porque o peso cai ao longo do caminho e somar sempre o
                    mesmo percentual do começo superestimaria o resultado.
                  </p>
                  <p>
                    O déficit diário vem da conta clássica de 7.700 kcal por quilo de gordura, dividida pelos dias do prazo.
                    Ela dá ordem de grandeza: o corpo não responde de forma exatamente linear, e o número real costuma ficar
                    um pouco abaixo conforme o peso desce.
                  </p>
                  <p>{NOTA_FAIXA_PERCENTUAL}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Meta de Peso" caminho="/ferramentas/meta-de-peso"
                local="tool_result" ferramenta="meta" resultado={linhasShare} gancho="Calculei quanto dá para perder até a minha data:" aparencia="solido" />
              {placement !== "meta-de-peso" && (
                <Link href="/ferramentas/meta-de-peso" onClick={() => trackEvent("goal_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="meta" categoria={veredito ?? "padrao"} resumo={resumoWhats} placement={placement} />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_MUSCULO}{" "}
        <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>Calcule o déficit que sustenta esse ritmo</Link>.
      </p>
    </div>
  );
}
