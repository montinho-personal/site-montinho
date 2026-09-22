"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  AULAS,
  AULA_PADRAO,
  DESCANSO_MAX,
  DESCANSO_PADRAO,
  KCAL_PROPAGANDA,
  MET_DESCANSO,
  MINUTOS_MAX,
  MINUTOS_MIN,
  NOTA_CADENCIA,
  NOTA_ESTIMATIVA,
  NOTA_LIQUIDA,
  NOTA_RELOGIO,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_MAX,
  PESO_MIN,
  PRESETS_MINUTOS,
  RELOGIO_MAX,
  RELOGIO_MIN,
  RITMOS,
  RITMO_PADRAO,
  ROUNDS_MAX,
  ROUNDS_PADRAO,
  ROUND_MIN_MAX,
  ROUND_PADRAO,
  VISOR_TOLERANCIA_PCT,
  arredondaKcal,
  aula as aulaDe,
  comparaVisor,
  deAula,
  deRounds,
  descansoValido,
  formataTempo,
  leituraVisor,
  minutosAtePropaganda,
  minutosValidos,
  parseNumero,
  pesoValido,
  relogioValido,
  ritmo as ritmoDe,
  ritmoPelaContagem,
  roundValido,
  roundsValidos,
  type AulaId,
  type RitmoId,
} from "@/lib/boxe";

/**
 * A Calculadora de Calorias no Boxe.
 *
 * DOIS JEITOS DE CONTAR O TREINO
 *
 * Quem faz aula pensa em minutos e no formato da aula. Quem treina no
 * saco pensa em rounds — e pode medir o próprio ritmo contando os socos
 * de dez segundos. A calculadora aceita os dois, e nos dois compara com
 * o número do relógio, que é de onde vêm as "1.000 kcal por aula".
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram o
 * modo, o formato e o ritmo, nunca o peso nem o número do relógio.
 */

type Modo = "aula" | "rounds";

const MODOS: { id: Modo; rotulo: string }[] = [
  { id: "aula", rotulo: "Fiz uma aula" },
  { id: "rounds", rotulo: "Contei os rounds" },
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
/** Kcal arredondada e com ponto de milhar. */
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");

export default function CalculadoraBoxe({ placement }: { placement: string }) {
  const [modo, setModo] = useState<Modo>("aula");
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [aulaId, setAulaId] = useState<AulaId>(AULA_PADRAO);
  const [roundsTexto, setRoundsTexto] = useState(String(ROUNDS_PADRAO));
  const [roundTexto, setRoundTexto] = useState(String(ROUND_PADRAO));
  const [descansoTexto, setDescansoTexto] = useState(String(DESCANSO_PADRAO));
  const [ritmoId, setRitmoId] = useState<RitmoId>(RITMO_PADRAO);
  const [contagemTexto, setContagemTexto] = useState("");
  const [mostrarRelogio, setMostrarRelogio] = useState(false);
  const [relogioTexto, setRelogioTexto] = useState("");
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const rounds = parseNumero(roundsTexto);
  const roundsOk = roundsValidos(rounds);
  const round = parseNumero(roundTexto);
  const roundOk = roundValido(round);
  const descanso = parseNumero(descansoTexto);
  const descansoOk = descansoValido(descanso);
  const relogio = parseNumero(relogioTexto);
  const relogioOk = mostrarRelogio && relogioValido(relogio);
  const au = aulaDe(aulaId);
  const rt = ritmoDe(ritmoId);
  const contagem = parseNumero(contagemTexto);
  const sugerido = contagem !== null && contagem > 0 && contagem <= 60 ? ritmoPelaContagem(contagem) : null;

  const resultado = !pesoOk
    ? null
    : modo === "aula"
      ? minutosOk ? deAula(peso, minutos, au.met) : null
      : roundsOk && roundOk && descansoOk ? deRounds(peso, rounds, round, descanso, rt.met) : null;
  const diffRelogio = resultado && relogioOk ? comparaVisor(relogio, resultado.kcal) : null;
  const metAtivo = modo === "aula" ? au.met : rt.met;
  const nomeTreino = modo === "aula" ? au.nome.toLowerCase() : `rounds em ritmo ${rt.nome.toLowerCase()}`;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("boxing_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const temResultado = resultado !== null;
  const detalhe = modo === "aula" ? aulaId : ritmoId;
  useEffect(() => {
    if (temResultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("boxing_calculator_use", { placement, mode: modo, format: detalhe });
    }
  }, [temResultado, placement, modo, detalhe]);

  function trocaModo(novo: Modo) {
    if (novo === modo) return;
    setModo(novo);
    trackEvent("boxing_mode_selected", { placement, mode: novo });
  }

  const resumoWhats = resultado
    ? `${formataTempo(resultado.minutosTotais)} de boxe (${nomeTreino}) ≈ ${kc(resultado.kcal)} kcal`
    : null;
  const linhasShare = resultado
    ? [`${formataTempo(resultado.minutosTotais)} de boxe`, nomeTreino, `≈ ${kc(resultado.kcal)} kcal`]
    : [];
  const idc = (s: string) => `${s}-box-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-boxe"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto o seu treino de boxe gastou?
      </h2>

      <div role="group" aria-label="Como você quer contar o treino" className="grid gap-2.5 grid-cols-2 mb-7">
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
            ? "É o que mais muda o resultado — e o que muitos relógios estimam errado."
            : !pesoOk ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
        </p>
      </div>

      {modo === "aula" ? (
        <>
          <div className="mb-6">
            <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">Quanto tempo de aula?</label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {PRESETS_MINUTOS.map((p) => (
                <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
                  onClick={() => { setMinutosTexto(String(p)); trackEvent("boxing_preset", { placement, preset: p }); }}>
                  {formataTempo(p)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input id={idc("min")} type="text" inputMode="numeric" autoComplete="off" placeholder="60" value={minutosTexto}
                onChange={(e) => setMinutosTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("min-ajuda")} />
              <span className="text-gray-300 text-lg">minutos</span>
            </div>
            <p id={idc("min-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
              {minutosTexto.trim() !== "" && !minutosOk ? `Use um valor entre ${MINUTOS_MIN} e ${MINUTOS_MAX} minutos.` : ""}
            </p>
          </div>

          <div className="mb-7">
            <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("aula")}>Que aula foi?</span>
            <div role="group" aria-labelledby={idc("aula")} className="flex flex-wrap gap-2">
              {AULAS.map((a) => (
                <button key={a.id} type="button" onClick={() => setAulaId(a.id)} aria-pressed={aulaId === a.id} className={chip(aulaId === a.id)}>
                  {a.nome}
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2 max-w-xl">{au.comoReconhecer}</p>
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6 max-w-md">
            <div>
              <label htmlFor={idc("rounds")} className="block text-gray-300 text-sm font-medium mb-2">Rounds</label>
              <input id={idc("rounds")} type="text" inputMode="numeric" autoComplete="off" value={roundsTexto}
                onChange={(e) => setRoundsTexto(e.target.value)} className={`w-full ${campo}`} />
            </div>
            <div>
              <label htmlFor={idc("round")} className="block text-gray-300 text-sm font-medium mb-2">Min/round</label>
              <input id={idc("round")} type="text" inputMode="decimal" autoComplete="off" value={roundTexto}
                onChange={(e) => setRoundTexto(e.target.value)} className={`w-full ${campo}`} />
            </div>
            <div>
              <label htmlFor={idc("desc")} className="block text-gray-300 text-sm font-medium mb-2">Descanso</label>
              <input id={idc("desc")} type="text" inputMode="decimal" autoComplete="off" value={descansoTexto}
                onChange={(e) => setDescansoTexto(e.target.value)} className={`w-full ${campo}`} />
            </div>
          </div>
          <p className="text-gray-400 text-sm -mt-3 mb-6 min-h-[20px]" data-testid="ajuda-rounds">
            {!roundsOk && roundsTexto.trim() !== ""
              ? `Use de 1 a ${ROUNDS_MAX} rounds, em número inteiro.`
              : !roundOk && roundTexto.trim() !== ""
                ? `Cada round pode ter de 1 a ${ROUND_MIN_MAX} minutos.`
                : !descansoOk && descansoTexto.trim() !== ""
                  ? `O descanso vai de 0 a ${DESCANSO_MAX} minutos.`
                  : "Tempo de round e de descanso em minutos. O formato de academia é 12 rounds de 3 com 1 de descanso."}
          </p>

          <div className="mb-7">
            <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("ritmo")}>Em que ritmo você socou?</span>
            <div role="group" aria-labelledby={idc("ritmo")} className="flex flex-wrap gap-2">
              {RITMOS.map((r) => (
                <button key={r.id} type="button" onClick={() => setRitmoId(r.id)} aria-pressed={ritmoId === r.id} className={chip(ritmoId === r.id)}>
                  {r.nome} · {r.socosPorMinuto}/min
                </button>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2 max-w-xl">{rt.comoReconhecer}</p>
            <div className="mt-4 max-w-xl">
              <label htmlFor={idc("conta")} className="block text-gray-300 text-sm font-medium mb-2">
                Não sabe? Conte seus socos em 10 segundos <span className="text-gray-500 font-normal">(opcional)</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input id={idc("conta")} type="text" inputMode="numeric" autoComplete="off" placeholder="18" value={contagemTexto}
                  onChange={(e) => setContagemTexto(e.target.value)} className={`w-28 ${campo}`} />
                <span className="text-gray-300">socos</span>
                {sugerido && sugerido.id !== ritmoId && (
                  <button type="button" className={chip(false)}
                    onClick={() => { setRitmoId(sugerido.id); trackEvent("boxing_count_used", { placement, rhythm: sugerido.id }); }}>
                    Usar ritmo {sugerido.nome.toLowerCase()}
                  </button>
                )}
              </div>
              {sugerido && (
                <p className="text-gray-400 text-sm mt-2">
                  {contagem} socos em 10 segundos são cerca de {fmt(contagem! * 6, 0)} por minuto — o ritmo medido mais perto é o{" "}
                  {sugerido.nome.toLowerCase()} ({sugerido.socosPorMinuto}/min).
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mb-7">
        {!mostrarRelogio ? (
          <button type="button" onClick={() => { trackEvent("boxing_watch_open", { placement }); setMostrarRelogio(true); }}
            className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
            style={{ textDecorationColor: "#BA9E50" }}>
            O relógio mostrou outro número? Compare
          </button>
        ) : (
          <div>
            <label htmlFor={idc("rel")} className="block text-gray-300 text-sm font-medium mb-2">
              Calorias no relógio <span className="text-gray-500 font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-3">
              <input id={idc("rel")} type="text" inputMode="numeric" autoComplete="off" placeholder="800" value={relogioTexto}
                onChange={(e) => setRelogioTexto(e.target.value)} className={`w-32 ${campo}`} />
              <span className="text-gray-300 text-lg">kcal</span>
            </div>
            <p className="text-gray-400 text-sm mt-2 min-h-[20px]">
              {relogioTexto.trim() !== "" && !relogioValido(relogio)
                ? `Use o número do relógio, entre ${RELOGIO_MIN} e ${RELOGIO_MAX.toLocaleString("pt-BR")} kcal.` : ""}
            </p>
          </div>
        )}
      </div>

      <div aria-live="polite">
        {resultado && pesoOk && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Gasto estimado</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {modo === "aula"
                    ? `${formataTempo(resultado.minutosTotais)} de ${au.nome.toLowerCase()}`
                    : `${formataTempo(resultado.minutosAtivos)} socando e ${formataTempo(resultado.minutosDescanso)} de descanso`}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Para chegar às {KCAL_PROPAGANDA.toLocaleString("pt-BR")} kcal da propaganda</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {formataTempo(minutosAtePropaganda(peso, metAtivo))}
                </p>
                <p className="text-gray-400 text-sm mt-2">sem parar, nesse mesmo esforço</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Descontando o que você gastaria em casa no mesmo tempo, o treino acrescentou cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia.
            </p>

            {diffRelogio !== null && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="leitura-relogio">
                {leituraVisor(diffRelogio) === "parecido"
                  ? `O relógio (${kc(relogio!)} kcal) está dentro de ${VISOR_TOLERANCIA_PCT}% da estimativa — os dois contam a mesma história.`
                  : leituraVisor(diffRelogio) === "acima"
                    ? `O relógio (${kc(relogio!)} kcal) está cerca de ${Math.round(diffRelogio)}% acima da estimativa. No boxe isso é comum: a frequência cardíaca sobe com tensão e adrenalina, não só com esforço, e o relógio lê tudo como gasto. Use o número dele para comparar um treino com outro, não para decidir quanto comer.`
                    : `O relógio (${kc(relogio!)} kcal) está cerca de ${Math.round(-diffRelogio)}% abaixo da estimativa. Pode ser um peso cadastrado menor que o seu, ou um treino mais leve que o formato que você marcou aqui.`}
              </p>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
              {NOTA_ESTIMATIVA} {modo === "rounds" && NOTA_CADENCIA} {diffRelogio !== null && NOTA_RELOGIO}
            </p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("boxing_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto.{" "}
                    {modo === "aula"
                      ? <>{au.nome} vale {fmt(au.met)} METs no Compêndio de Atividades Físicas ({au.origem}), medido na aula como ela é praticada — com as pausas que ela tem.</>
                      : <>O ritmo {rt.nome.toLowerCase()} ({rt.socosPorMinuto} socos por minuto) vale {fmt(rt.met)} METs no Compêndio, em trabalho contínuo no saco. O descanso entre rounds vale {fmt(MET_DESCANSO)} MET, que é ficar em pé parado.</>}
                  </p>
                  {modo === "rounds" && (
                    <p>
                      Para {fmt(peso)} kg: {formataTempo(resultado.minutosAtivos)} de round dão {kc(resultado.kcalAtiva)} kcal
                      {resultado.minutosDescanso > 0 && <>, e {formataTempo(resultado.minutosDescanso)} de descanso, {kc(resultado.kcalDescanso)} kcal</>}.
                    </p>
                  )}
                  <p>{NOTA_LIQUIDA}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias no Boxe" caminho="/ferramentas/calculadora-calorias-boxe"
                local="tool_result" ferramenta="boxe" resultado={linhasShare} gancho="Descobri quantas calorias o meu treino de boxe gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-boxe" && (
                <Link href="/ferramentas/calculadora-calorias-boxe" onClick={() => trackEvent("boxing_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="boxe" categoria="padrao" resumo={resumoWhats} placement={placement} />
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
