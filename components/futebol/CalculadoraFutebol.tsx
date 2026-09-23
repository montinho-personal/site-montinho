"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  JOGOS,
  JOGO_PADRAO,
  KCAL_LATA,
  MET_ESPERANDO,
  MINUTOS_EM_CAMPO_ALERTA,
  MINUTOS_MAX,
  MINUTOS_MIN,
  NOTA_ESTIMATIVA,
  NOTA_GOLEIRO,
  NOTA_LIQUIDA,
  NOTA_REVEZAMENTO_MEDIA,
  NOTA_SEGURANCA,
  NOTA_SEMANA,
  NOTA_TEMPO_ALTO,
  PESO_MAX,
  PESO_MIN,
  PRESETS_MINUTOS,
  TIMES_OPCOES,
  arredondaKcal,
  calcula,
  formataLatas,
  formataTempo,
  jogo as jogoDe,
  minutosValidos,
  parseNumero,
  pesoValido,
  semana,
  type JogoId,
} from "@/lib/futebol";

/**
 * A Calculadora de Calorias no Futebol.
 *
 * TRÊS PERGUNTAS QUE A GENÉRICA NÃO FAZ
 *
 * Quanto tempo você ficou na quadra, quantos times revezaram e em que
 * posição você jogou. A primeira pesa o jogo; a segunda separa o tempo de
 * bola rolando do tempo na lateral; a terceira existe para a calculadora
 * não entregar um número de linha para quem ficou no gol.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram o
 * tipo de jogo e o número de times, nunca o peso. O resumo do WhatsApp
 * leva tempo e calorias, jamais o peso.
 */

type Posicao = "linha" | "goleiro";

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-2 decoration-1 hover:text-white transition-colors";
const campo =
  "bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";
const chip = (ativo: boolean) =>
  `px-4 py-2.5 border text-sm font-semibold transition-colors min-h-[44px] ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
  }`;
const fmt = (n: number, d = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: d });
/** Kcal arredondada e com ponto de milhar: 1.195, não 1195. */
const kc = (n: number) => arredondaKcal(n).toLocaleString("pt-BR");
const rotuloTimes = (t: number) => (t === 2 ? "Só 2, sem revezar" : `${t} times`);

export default function CalculadoraFutebol({ placement }: { placement: string }) {
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [jogoId, setJogoId] = useState<JogoId>(JOGO_PADRAO);
  const [times, setTimes] = useState<number>(2);
  const [posicao, setPosicao] = useState<Posicao>("linha");
  const [peladas, setPeladas] = useState(1);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const jg = jogoDe(jogoId);
  const goleiro = posicao === "goleiro";

  const resultado = pesoOk && minutosOk && !goleiro ? calcula(peso, minutos, jg.met, times) : null;
  const sem = resultado ? semana(resultado, peladas) : null;
  const tempoAlto = resultado !== null && resultado.minutosEmCampo > MINUTOS_EM_CAMPO_ALERTA;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("soccer_calculator_view", { placement });
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
      trackEvent("soccer_calculator_use", { placement, game: jogoId, teams: times });
    }
  }, [temResultado, placement, jogoId, times]);

  function trocaPosicao(nova: Posicao) {
    if (nova === posicao) return;
    setPosicao(nova);
    if (nova === "goleiro") trackEvent("soccer_goalkeeper_selected", { placement });
  }

  const resumoWhats = resultado
    ? `${formataTempo(resultado.minutosNoLocal)} de ${jg.nome.toLowerCase()} ≈ ${kc(resultado.kcal)} kcal`
    : null;
  const linhasShare = resultado
    ? [`${formataTempo(resultado.minutosNoLocal)} de ${jg.nome.toLowerCase()}`, `≈ ${kc(resultado.kcal)} kcal`, `o jogo pagou ${formataLatas(resultado.latas)}`]
    : [];
  const idc = (s: string) => `${s}-fut-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-futebol"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto a sua pelada gastou?
      </h2>

      <div className="mb-6">
        <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">
          Quanto você pesa?
        </label>
        <div className="flex items-center gap-3">
          <input id={idc("peso")} type="text" inputMode="decimal" autoComplete="off" placeholder="80" value={pesoTexto}
            onChange={(e) => setPesoTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("peso-ajuda")} />
          <span className="text-gray-300 text-lg">kg</span>
        </div>
        <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {pesoTexto.trim() !== "" && !pesoOk ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
        </p>
      </div>

      <div className="mb-6">
        <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">
          Quanto tempo você ficou na quadra ou no campo?
        </label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {PRESETS_MINUTOS.map((p) => (
            <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
              onClick={() => { setMinutosTexto(String(p)); trackEvent("soccer_preset", { placement, preset: p }); }}>
              {formataTempo(p)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input id={idc("min")} type="text" inputMode="numeric" autoComplete="off" placeholder="90" value={minutosTexto}
            onChange={(e) => setMinutosTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("min-ajuda")} />
          <span className="text-gray-300 text-lg">minutos</span>
        </div>
        <p id={idc("min-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {minutosTexto.trim() !== "" && !minutosOk
            ? `Use um valor entre ${MINUTOS_MIN} e ${MINUTOS_MAX} minutos.`
            : "O tempo todo, contando o que você passou esperando na lateral."}
        </p>
      </div>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("jogo")}>Que jogo foi?</span>
        <div role="group" aria-labelledby={idc("jogo")} className="flex flex-wrap gap-2">
          {JOGOS.map((j) => (
            <button key={j.id} type="button" onClick={() => setJogoId(j.id)} aria-pressed={jogoId === j.id} className={chip(jogoId === j.id)}>
              {j.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">{jg.comoReconhecer}</p>
      </div>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("times")}>Quantos times revezaram?</span>
        <div role="group" aria-labelledby={idc("times")} className="flex flex-wrap gap-2">
          {TIMES_OPCOES.map((t) => (
            <button key={t} type="button" onClick={() => setTimes(t)} aria-pressed={times === t} className={chip(times === t)}>
              {rotuloTimes(t)}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">
          {times === 2
            ? "Os dois times jogaram o tempo todo."
            : `Com ${times} times, cada um fica em campo cerca de ${Math.round((2 / times) * 100)}% do tempo. O resto é lateral.`}
        </p>
      </div>

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("pos")}>Onde você jogou?</span>
        <div role="group" aria-labelledby={idc("pos")} className="flex flex-wrap gap-2">
          <button type="button" onClick={() => trocaPosicao("linha")} aria-pressed={posicao === "linha"} className={chip(posicao === "linha")}>
            Na linha
          </button>
          <button type="button" onClick={() => trocaPosicao("goleiro")} aria-pressed={posicao === "goleiro"} className={chip(posicao === "goleiro")}>
            No gol
          </button>
        </div>
      </div>

      {/* A frequência entra antes do resultado: é pergunta, não detalhe do resultado. */}
      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("sem")}>Quantas vezes por semana você joga?</span>
        <div role="group" aria-labelledby={idc("sem")} className="flex flex-wrap gap-2">
          {[1, 2, 3].map((n) => (
            <button key={n} type="button" onClick={() => { setPeladas(n); trackEvent("soccer_frequency", { placement, per_week: n }); }}
              aria-pressed={peladas === n} className={chip(peladas === n)}>
              {n}× por semana
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {goleiro && (
          <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border border-white/15 p-4" data-testid="nota-goleiro">
            {NOTA_GOLEIRO}
          </p>
        )}

        {resultado && pesoOk && sem && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>
              Seu resultado
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5">
                <p className="text-gray-400 text-xs mb-1">Gasto estimado</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  {times === 2
                    ? `${formataTempo(resultado.minutosEmCampo)} de bola rolando`
                    : `${formataTempo(resultado.minutosEmCampo)} em campo e ${formataTempo(resultado.minutosEsperando)} na lateral`}
                </p>
              </div>
              <div className="border border-white/15 p-5">
                <p className="text-gray-400 text-xs mb-1">O jogo pagou</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>{formataLatas(resultado.latas)}</p>
                <p className="text-gray-400 text-sm mt-2">de cerveja comum, 350 ml</p>
              </div>
            </div>

            {tempoAlto && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }} data-testid="aviso-tempo-alto">
                {NOTA_TEMPO_ALTO}
              </p>
            )}

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">
              Descontando o que você gastaria em casa no mesmo tempo, o jogo acrescentou cerca de{" "}
              <strong className="text-white">{kc(resultado.kcalLiquida)} kcal</strong> ao seu dia. A partir da
              lata seguinte, a resenha começa a comer o que o jogo gastou.
            </p>

            <div className="mb-5 max-w-2xl">
              <p className="text-gray-300 leading-relaxed">
                {peladas === 1 ? "Um jogo por semana soma" : `${peladas} jogos por semana somam`} cerca de{" "}
                <strong className="text-white">{kc(sem.kcalLiquida)} kcal</strong> a mais na semana — no máximo{" "}
                {fmt(sem.gramasGordura, 0)} g de gordura, se nada do que você come depois mudar.
                {peladas === 1 && " É por isso que um jogo semanal, sozinho, raramente move a balança."}
              </p>
              <p className="text-gray-500 text-xs mt-2">{NOTA_SEMANA}</p>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
              {NOTA_ESTIMATIVA} {times > 2 && NOTA_REVEZAMENTO_MEDIA}
            </p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("soccer_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. {jg.nome} vale {fmt(jg.met)} METs no
                    Compêndio de Atividades Físicas ({jg.origem}); o tempo na lateral vale {fmt(MET_ESPERANDO)} MET, que é ficar em pé parado.
                  </p>
                  <p>
                    Para {fmt(peso)} kg: {formataTempo(resultado.minutosEmCampo)} em campo dão {kc(resultado.kcalEmCampo)} kcal
                    {resultado.minutosEsperando > 0 && <>, e {formataTempo(resultado.minutosEsperando)} na lateral, {kc(resultado.kcalEsperando)} kcal</>}.
                  </p>
                  <p>{NOTA_LIQUIDA} Cada lata conta {KCAL_LATA} kcal.</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias no Futebol" caminho="/ferramentas/calculadora-calorias-futebol"
                local="tool_result" ferramenta="futebol" resultado={linhasShare} gancho="Descobri quantas calorias a minha pelada gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-futebol" && (
                <Link href="/ferramentas/calculadora-calorias-futebol" onClick={() => trackEvent("soccer_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="futebol" categoria="padrao" resumo={resumoWhats} placement={placement} />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_SEGURANCA}{" "}
        <Link href="/blog/treino-de-perna-completo" className={ln}>Força de perna é o que segura o joelho no jogo</Link>.
      </p>
    </div>
  );
}
