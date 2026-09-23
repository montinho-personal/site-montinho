"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  BLOCOS_MAX,
  DESCANSO_MAX,
  MET_DESCANSO,
  META_SALTOS,
  NOTA_BLOCOS,
  NOTA_ESTIMATIVA,
  NOTA_LINEAR,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  PESO_MAX,
  PESO_MIN,
  PULANDO_MAX,
  PULANDO_MIN,
  RITMOS,
  TREINOS,
  VEZES_SEMANA,
  arredondaKcal,
  blocosValidos,
  calcula,
  descansoValido,
  formataTempo,
  kcalPor100Saltos,
  kcalSeFosseContinuo,
  kgPorMes,
  parseNumero,
  pesoValido,
  pulandoValido,
  ritmo,
  type RitmoId,
} from "@/lib/corda";

/**
 * A Calculadora de Calorias Pulando Corda.
 *
 * OS BLOCOS SÃO A CONTA
 *
 * A pessoa informa quantos blocos pulou, quanto tempo cada um durou e
 * quanto descansou entre eles. Só o tempo pulando conta como corda. O
 * resultado compara com o número que sai de multiplicar o MET pelo tempo
 * de relógio — o que as tabelas fazem — e conta os saltos.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram o
 * ritmo, os blocos e a frequência, nunca o peso.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
/** Kcal arredondada e com ponto de milhar. */
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const int = (n: number) => Math.round(n).toLocaleString("pt-BR");
/** Segundos como "30 s", "1 min" ou "1 min 30 s". */
const seg = (s: number) => {
  const m = Math.floor(s / 60);
  const r = Math.round(s % 60);
  if (m === 0) return `${r} s`;
  return r === 0 ? `${m} min` : `${m} min ${r} s`;
};

export default function CalculadoraCorda({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [rt, setRt] = useState<RitmoId>("moderado");
  const [blocosTexto, setBlocosTexto] = useState("");
  const [pulandoTexto, setPulandoTexto] = useState("");
  const [descansoTexto, setDescansoTexto] = useState("");
  const [vezes, setVezes] = useState(3);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const blocos = parseNumero(blocosTexto);
  const blocosOk = blocosValidos(blocos);
  const pulando = parseNumero(pulandoTexto);
  const pulandoOk = pulandoValido(pulando);
  const descanso = parseNumero(descansoTexto);
  const descansoOk = descansoValido(descanso);

  const resultado = pesoOk && blocosOk && pulandoOk && descansoOk ? calcula(peso, rt, blocos, pulando, descanso) : null;
  const kgMes = resultado ? kgPorMes(resultado, vezes) : null;
  const tabela = resultado && resultado.minutosDescanso > 0 ? kcalSeFosseContinuo(peso!, rt, resultado.minutosTotais) : null;
  const por100 = pesoOk ? kcalPor100Saltos(peso, rt) : 0;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("jump_rope_calculator_view", { placement });
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  const temResultado = resultado !== null;
  const nBlocos = blocosOk ? blocos : -1;
  useEffect(() => {
    if (temResultado && !jaUsou.current) {
      jaUsou.current = true;
      trackEvent("jump_rope_calculator_use", { placement, pace: rt, rounds: nBlocos, per_week: vezes });
    }
  }, [temResultado, placement, rt, nBlocos, vezes]);

  const escolheTreino = (id: string) => {
    const t = TREINOS.find((x) => x.id === id)!;
    setBlocosTexto(String(t.blocos));
    setPulandoTexto(String(t.segundosPulando));
    setDescansoTexto(String(t.segundosDescanso));
    trackEvent("jump_rope_preset", { placement, preset: id });
  };
  const treinoAtivo = TREINOS.find(
    (t) => blocosTexto === String(t.blocos) && pulandoTexto === String(t.segundosPulando) && descansoTexto === String(t.segundosDescanso),
  )?.id;

  const resumoWhats = resultado ? `${resultado.blocos} blocos de corda (${formataTempo(resultado.minutosPulando)} pulando) ≈ ${kc(resultado.kcal)} kcal` : null;
  const linhasShare = resultado
    ? [`${resultado.blocos} ${resultado.blocos === 1 ? "bloco" : "blocos"} de corda`, `${formataTempo(resultado.minutosPulando)} pulando`, `≈ ${kc(resultado.kcal)} kcal`]
    : [];
  const idc = (s: string) => `${s}-corda-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-corda"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto a sua corda gastou?
      </h2>

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
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("ritmo")}>Em que ritmo?</span>
        <div role="group" aria-labelledby={idc("ritmo")} className="flex flex-wrap gap-2 mb-2">
          {RITMOS.map((r) => (
            <button key={r.id} type="button" aria-pressed={rt === r.id} className={chip(rt === r.id)}
              onClick={() => setRt(r.id)}>
              {r.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm" data-testid="ajuda-ritmo">
          Conte os saltos em 15 segundos: {ritmo(rt).nome.toLowerCase()} é {ritmo(rt).em15s}.
        </p>
      </div>

      <div className="mb-2">
        <span className="block text-gray-300 text-sm font-medium mb-2">Como foi o treino?</span>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {TREINOS.map((t) => (
            <button key={t.id} type="button" aria-pressed={treinoAtivo === t.id} className={chip(treinoAtivo === t.id)}
              onClick={() => escolheTreino(t.id)}>
              {t.nome}: {t.blocos} × {seg(t.segundosPulando)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-2 max-w-md">
        <div>
          <label htmlFor={idc("blocos")} className="block text-gray-300 text-sm font-medium mb-2">Blocos</label>
          <input id={idc("blocos")} type="text" inputMode="numeric" autoComplete="off" placeholder="10" value={blocosTexto}
            onChange={(e) => setBlocosTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("pulando")} className="block text-gray-300 text-sm font-medium mb-2">Seg. pulando</label>
          <input id={idc("pulando")} type="text" inputMode="numeric" autoComplete="off" placeholder="30" value={pulandoTexto}
            onChange={(e) => setPulandoTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
        <div>
          <label htmlFor={idc("desc")} className="block text-gray-300 text-sm font-medium mb-2">Seg. parado</label>
          <input id={idc("desc")} type="text" inputMode="numeric" autoComplete="off" placeholder="60" value={descansoTexto}
            onChange={(e) => setDescansoTexto(e.target.value)} className={`w-full ${campo}`} />
        </div>
      </div>
      <p className="text-gray-400 text-sm mb-6 min-h-[20px] max-w-xl" data-testid="ajuda-blocos">
        {!blocosOk && blocosTexto.trim() !== ""
          ? `Use de 1 a ${BLOCOS_MAX} blocos, em número inteiro.`
          : !pulandoOk && pulandoTexto.trim() !== ""
            ? `Cada bloco pode ter de ${PULANDO_MIN} a ${PULANDO_MAX} segundos.`
            : !descansoOk && descansoTexto.trim() !== ""
              ? `O descanso vai de 0 a ${DESCANSO_MAX} segundos.`
              : "Pulou direto? Use 1 bloco com o tempo todo, em segundos, e 0 de descanso."}
      </p>

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantas vezes por semana?</span>
        <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
          {VEZES_SEMANA.map((n) => (
            <button key={n} type="button" onClick={() => { setVezes(n); trackEvent("jump_rope_frequency", { placement, per_week: n }); }}
              aria-pressed={vezes === n} className={chip(vezes === n)}>
              {n}×
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {resultado && pesoOk && kgMes !== null && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Gasto estimado do treino</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {formataTempo(resultado.minutosPulando)} pulando
                  {resultado.minutosDescanso > 0 && <> em {formataTempo(resultado.minutosTotais)} de treino</>}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Só da corda, {vezes}× por semana</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {kg(kgMes)}<span className="text-lg font-normal text-gray-300"> kg/mês</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">no máximo, pela conta linear</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Descontando o que você gastaria parado, o treino acrescentou cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia.
            </p>
            {tabela !== null && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="nota-tabela">
                A tabela que multiplica pelo tempo de relógio daria {kc(tabela)} kcal para os mesmos{" "}
                {formataTempo(resultado.minutosTotais)} — como se você tivesse pulado o treino inteiro. Nos blocos, você pulou{" "}
                {formataTempo(resultado.minutosPulando)}.
              </p>
            )}
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="nota-saltos">
              Foram cerca de <strong className="text-white">{int(resultado.saltos)} saltos</strong>. No ritmo{" "}
              {ritmo(rt).nome.toLowerCase()}, cada 100 custam cerca de {kg(por100)} kcal — a meta de{" "}
              {int(META_SALTOS)} saltos por dia gasta cerca de {kc(por100 * (META_SALTOS / 100))} kcal.
            </p>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_BLOCOS} {NOTA_LINEAR}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("jump_rope_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. O Compêndio de Atividades Físicas mede a
                    corda pela cadência: {RITMOS.map((r, i) => (
                      <span key={r.id}>{i > 0 && (i === RITMOS.length - 1 ? " e " : ", ")}{r.nome.toLowerCase()}, {metF(r.met)} METs</span>
                    ))}. O descanso entre blocos vale {metF(MET_DESCANSO)}, que é ficar em pé.
                  </p>
                  <p>
                    Os saltos saem de uma cadência típica de cada ritmo: {RITMOS.map((r) => `${r.saltosPorMinuto}`).join(", ")} por minuto.
                    O ritmo rápido gasta mais por minuto, mas menos por salto — cada salto é mais baixo e mais curto.
                  </p>
                  <p>Os quilos saem do gasto líquido da semana, a 7.700 kcal por quilo de gordura. É teto: o corpo compensa parte do gasto.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias Pulando Corda" caminho="/ferramentas/calculadora-calorias-pular-corda"
                local="tool_result" ferramenta="corda" resultado={linhasShare} gancho="Descobri quanto a minha corda gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-pular-corda" && (
                <Link href="/ferramentas/calculadora-calorias-pular-corda" onClick={() => trackEvent("jump_rope_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="corda" categoria="padrao" resumo={resumoWhats} placement={placement} />
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
