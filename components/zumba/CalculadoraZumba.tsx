"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  AULAS_PADRAO,
  AULAS_SEMANA,
  KCAL_PROPAGANDA,
  MET_ALTO,
  MET_BAIXO,
  MINUTOS_MAX,
  MINUTOS_MIN,
  MINUTOS_POR_MUSICA,
  NOTA_ESTIMATIVA,
  NOTA_LINEAR,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  NOTA_SO_AULAS,
  PESO_MAX,
  PESO_MIN,
  PRESETS_MINUTOS,
  SALTOS,
  SALTOS_PADRAO,
  arredondaKcal,
  calcula,
  formataTempo,
  minutosAtePropaganda,
  minutosValidos,
  parseNumero,
  pesoValido,
  saltos as saltosDe,
  semana,
  type SaltosId,
} from "@/lib/zumba";

/**
 * A Calculadora de Calorias na Zumba.
 *
 * DUAS PERGUNTAS QUE A GENÉRICA NÃO FAZ
 *
 * Quantas músicas tiveram salto — porque a aula alterna baixo e alto
 * impacto, e é essa mistura que decide o gasto — e quantas aulas por
 * semana, porque a pergunta que traz gente ao artigo é "quantos quilos".
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram a
 * proporção de saltos e a frequência, nunca o peso.
 */

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
/** METs sempre com uma casa: "5,0", não "5". */
const metF = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const kg = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function CalculadoraZumba({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [saltosId, setSaltosId] = useState<SaltosId>(SALTOS_PADRAO);
  const [aulas, setAulas] = useState<number>(AULAS_PADRAO);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const sl = saltosDe(saltosId);

  const resultado = pesoOk && minutosOk ? calcula(peso, minutos, sl.fracao) : null;
  const sem = resultado ? semana(resultado, aulas) : null;
  const musicas = minutosOk ? Math.round(minutos / MINUTOS_POR_MUSICA) : null;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("zumba_calculator_view", { placement });
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
      trackEvent("zumba_calculator_use", { placement, jumps: saltosId, per_week: aulas });
    }
  }, [temResultado, placement, saltosId, aulas]);

  const resumoWhats = resultado && sem
    ? `${formataTempo(resultado.minutos)} de zumba ≈ ${kc(resultado.kcal)} kcal por aula, ${aulas}× por semana`
    : null;
  const linhasShare = resultado && sem
    ? [`${formataTempo(resultado.minutos)} de zumba`, `≈ ${kc(resultado.kcal)} kcal por aula`, `${aulas}× por semana ≈ ${kg(sem.kgMes)} kg por mês só das aulas`]
    : [];
  const idc = (s: string) => `${s}-zum-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-zumba"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto a sua zumba gasta — e quantos quilos isso dá?
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
        <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">Quanto tempo de aula?</label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {PRESETS_MINUTOS.map((p) => (
            <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
              onClick={() => { setMinutosTexto(String(p)); trackEvent("zumba_preset", { placement, preset: p }); }}>
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
          {minutosTexto.trim() !== "" && !minutosOk
            ? `Use um valor entre ${MINUTOS_MIN} e ${MINUTOS_MAX} minutos.`
            : musicas !== null ? `São cerca de ${musicas} músicas.` : ""}
        </p>
      </div>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("saltos")}>Quantas músicas tiveram salto?</span>
        <div role="group" aria-labelledby={idc("saltos")} className="flex flex-wrap gap-2">
          {SALTOS.map((s) => (
            <button key={s.id} type="button" onClick={() => setSaltosId(s.id)} aria-pressed={saltosId === s.id} className={chip(saltosId === s.id)}>
              {s.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">
          Música com salto é a que tira os dois pés do chão: polichinelo, corrida no lugar, pulo no refrão. As outras são de
          baixo impacto, com um pé sempre no chão.
        </p>
      </div>

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantas aulas por semana?</span>
        <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
          {AULAS_SEMANA.map((n) => (
            <button key={n} type="button" onClick={() => { setAulas(n); trackEvent("zumba_frequency", { placement, per_week: n }); }}
              aria-pressed={aulas === n} className={chip(aulas === n)}>
              {n}×
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {resultado && pesoOk && sem && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Cada aula</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {sl.fracao === 0
                    ? "tudo em baixo impacto"
                    : sl.fracao === 1
                      ? "tudo com salto"
                      : `${formataTempo(resultado.minutosComSalto)} com salto e ${formataTempo(resultado.minutosSemSalto)} sem`}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">Só das aulas, {aulas}× por semana</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>
                  {kg(sem.kgMes)}<span className="text-lg font-normal text-gray-300"> kg/mês</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">cerca de {fmt(sem.gramasSemana, 0)} g por semana, no máximo</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Descontando o que você gastaria parado, cada aula acrescenta cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia. Nesse ritmo, só com as
              aulas, cada quilo de gordura levaria cerca de {fmt(sem.semanasPorQuilo, 0)} semanas.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
              {NOTA_SO_AULAS}
            </p>
            {resultado.kcal < KCAL_PROPAGANDA && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
                E as {KCAL_PROPAGANDA.toLocaleString("pt-BR")} kcal por aula da propaganda? Com o seu peso e essa aula, seriam{" "}
                {formataTempo(minutosAtePropaganda(peso, sl.fracao))} sem parar.
              </p>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_LINEAR}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("zumba_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. O Compêndio de Atividades Físicas
                    mede a dança aeróbica em {metF(MET_BAIXO)} METs no baixo impacto e {metF(MET_ALTO)} com salto. A sua aula, {sl.frase}, fica em {metF(resultado.met)} METs em média.
                  </p>
                  <p>
                    Os quilos saem do gasto líquido das aulas da semana, a 7.700 kcal por quilo de gordura. É teto: o corpo compensa
                    parte do gasto.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias na Zumba" caminho="/ferramentas/calculadora-calorias-zumba"
                local="tool_result" ferramenta="zumba" resultado={linhasShare} gancho="Descobri quanto a minha zumba gasta:" aparencia="solido" />
              {placement !== "calculadora-calorias-zumba" && (
                <Link href="/ferramentas/calculadora-calorias-zumba" onClick={() => trackEvent("zumba_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="zumba" categoria="padrao" resumo={resumoWhats} placement={placement} />
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
