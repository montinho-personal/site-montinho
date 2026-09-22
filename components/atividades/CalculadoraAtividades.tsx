"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  ATIVIDADES,
  ATIVIDADE_PADRAO,
  KCAL_MAX,
  KCAL_MIN,
  MINUTOS_ALERTA,
  MINUTOS_MAX,
  MINUTOS_MIN,
  NOTA_BRUTO,
  NOTA_ESTIMATIVA,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  NOTA_VOLUME_ALTO,
  PESO_MAX,
  PESO_MIN,
  arredondaKcal,
  atividade as atividadeDe,
  comparaAtividades,
  deKcal,
  deTempo,
  faixa as faixaDe,
  formataTempo,
  fraseContexto,
  kcalLiquida,
  kcalValida,
  minutosValidos,
  parseNumero,
  pesoValido,
  tempoAtivo,
} from "@/lib/atividades";

/**
 * A Calculadora de Calorias por Atividade.
 *
 * A ATIVIDADE VEM PRIMEIRO
 *
 * É o único campo que muda a natureza da resposta — os outros só mudam o
 * número. Nos artigos ela já vem escolhida, porque quem está lendo sobre
 * boxe não deveria precisar procurar "boxe" numa lista de dez.
 *
 * TEMPO DE AULA NÃO É TEMPO DE ESFORÇO
 *
 * Esta é a correção que dá sentido à ferramenta. Uma aula de boxe de uma
 * hora tem aquecimento, explicação, água e conversa; o gasto real vem do
 * tempo em movimento. A ferramenta calcula com o tempo ativo, mostra a
 * conta e deixa desligar — mas não esconde o desconto.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador; os eventos levam atividade
 * e modo, nunca valor. O resumo do WhatsApp leva tempo e calorias.
 */

type Modo = "tempo" | "meta" | "comparar";

const MODOS: { id: Modo; rotulo: string }[] = [
  { id: "tempo", rotulo: "Quantas calorias eu gastei" },
  { id: "meta", rotulo: "Quanto tempo para gastar X kcal" },
  { id: "comparar", rotulo: "Qual atividade gasta mais" },
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

export default function CalculadoraAtividades({
  placement,
  atividadeInicial,
}: {
  placement: string;
  /** Nos artigos, a atividade do texto. Na página da ferramenta, ausente. */
  atividadeInicial?: string;
}) {
  const [atividadeId, setAtividadeId] = useState(atividadeInicial ?? ATIVIDADE_PADRAO);
  const [modo, setModo] = useState<Modo>("tempo");
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [kcalTexto, setKcalTexto] = useState("");
  const [faixaId, setFaixaId] = useState<string | null>(null);
  const [descontarPausas, setDescontarPausas] = useState(true);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const ativ = atividadeDe(atividadeId);
  /* A faixa é da atividade: trocar de atividade sem resetar deixaria um id órfão. */
  const fx = faixaDe(ativ, faixaId ?? ativ.faixas[0].id);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const alvo = parseNumero(kcalTexto);
  const alvoOk = kcalValida(alvo);

  /* O desconto só existe onde a atividade tem pausa por natureza. */
  const temPausa = ativ.fracaoAtiva !== null;
  const aplicaDesconto = temPausa && descontarPausas;
  const minutosDeEsforco = minutosOk ? (aplicaDesconto ? tempoAtivo(minutos, ativ) : minutos) : 0;

  const resultado = !pesoOk
    ? null
    : modo === "meta"
      ? alvoOk ? deKcal(alvo, peso, fx.met) : null
      : minutosOk ? deTempo(minutosDeEsforco, peso, fx.met) : null;
  const comparacao = modo === "comparar" && resultado && pesoOk ? comparaAtividades(resultado.minutos, peso) : null;
  const volumeAlto = resultado !== null && resultado.minutos > MINUTOS_ALERTA;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("activity_calculator_view", { placement });
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
      trackEvent("activity_calculator_use", { placement, activity: atividadeId, mode: modo });
    }
  }, [temResultado, placement, atividadeId, modo]);

  function trocaAtividade(id: string) {
    if (id === atividadeId) return;
    setAtividadeId(id);
    setFaixaId(null);
    trackEvent("activity_selected", { placement, activity: id });
  }
  function trocaModo(novo: Modo) {
    if (novo === modo) return;
    setModo(novo);
    trackEvent("activity_mode_selected", { placement, mode: novo });
  }

  const resumoWhats = resultado ? `${formataTempo(resultado.minutos)} de ${ativ.nome.toLowerCase()} ≈ ${arredondaKcal(resultado.kcal)} kcal` : null;
  const linhasShare = resultado ? [ativ.nome, formataTempo(resultado.minutos), `≈ ${arredondaKcal(resultado.kcal)} kcal`] : [];
  const idc = (s: string) => `${s}-ativ-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-atividades"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quantas calorias você gastou?
      </h2>

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("ativ")}>Qual atividade?</span>
        <div role="group" aria-labelledby={idc("ativ")} className="flex flex-wrap gap-2">
          {ATIVIDADES.map((a) => (
            <button key={a.id} type="button" onClick={() => trocaAtividade(a.id)} aria-pressed={a.id === atividadeId} className={chip(a.id === atividadeId)}>
              {a.nome}
            </button>
          ))}
        </div>
      </div>

      <div role="group" aria-label="O que você quer descobrir" className="grid gap-2.5 sm:grid-cols-3 mb-7">
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
          {pesoTexto.trim() === "" ? "É o que mais muda o resultado: corpos maiores gastam mais no mesmo movimento."
            : !pesoOk ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
        </p>
      </div>

      {modo !== "meta" ? (
        <div className="mb-6">
          <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">
            {temPausa ? "Quanto tempo durou a aula ou o jogo?" : `Quanto tempo de ${ativ.nome.toLowerCase()}?`}
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {[ativ.sessaoTipica, 30, 45, 60, 90].filter((v, i, arr) => arr.indexOf(v) === i).map((p) => (
              <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
                onClick={() => { setMinutosTexto(String(p)); trackEvent("activity_preset", { placement, preset: p }); }}>
                {p} min
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input id={idc("min")} type="text" inputMode="numeric" autoComplete="off" placeholder={String(ativ.sessaoTipica)} value={minutosTexto}
              onChange={(e) => setMinutosTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("min-ajuda")} />
            <span className="text-gray-300 text-lg">minutos</span>
          </div>
          <p id={idc("min-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {minutosTexto.trim() !== "" && !minutosOk ? `Use um valor entre ${MINUTOS_MIN} e ${MINUTOS_MAX} minutos.` : ""}
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <label htmlFor={idc("kcal")} className="block text-gray-300 text-sm font-medium mb-2">Quantas calorias você quer gastar?</label>
          <div className="flex items-center gap-3">
            <input id={idc("kcal")} type="text" inputMode="numeric" autoComplete="off" placeholder="300" value={kcalTexto}
              onChange={(e) => setKcalTexto(e.target.value)} className={`w-36 ${campo}`} aria-describedby={idc("kcal-ajuda")} />
            <span className="text-gray-300 text-lg">kcal</span>
          </div>
          <p id={idc("kcal-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {kcalTexto.trim() !== "" && !alvoOk ? `Use um valor entre ${KCAL_MIN} e ${KCAL_MAX.toLocaleString("pt-BR")} kcal.` : ""}
          </p>
        </div>
      )}

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("faixa")}>Como foi a sessão?</span>
        <div role="group" aria-labelledby={idc("faixa")} className="flex flex-wrap gap-2">
          {ativ.faixas.map((f) => (
            <button key={f.id} type="button" onClick={() => setFaixaId(f.id)} aria-pressed={f.id === fx.id} className={chip(f.id === fx.id)}>
              {f.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">{fx.comoReconhecer}</p>
      </div>

      {/* O desconto das pausas: declarado, não secreto. */}
      {temPausa && modo !== "meta" && (
        <div className="mb-7">
          <label className="flex items-start gap-3 cursor-pointer min-h-[44px]">
            <input type="checkbox" checked={descontarPausas} onChange={(e) => { setDescontarPausas(e.target.checked); trackEvent("activity_pauses_toggle", { placement, on: e.target.checked ? "yes" : "no" }); }}
              className="mt-1 h-5 w-5 accent-[#BA9E50]" />
            <span className="text-gray-300 text-sm leading-relaxed">
              Descontar as pausas da aula
              <span className="block text-gray-500 text-xs mt-0.5">
                Aquecimento, explicação e água. Contamos cerca de {Math.round(ativ.fracaoAtiva! * 100)}% do tempo como esforço —
                é o que separa o gasto real do número das tabelas de revista.
              </span>
            </span>
          </label>
        </div>
      )}

      <div aria-live="polite">
        {resultado && pesoOk && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className={modo === "meta" ? "border border-white/15 p-5" : "border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5"}>
                <p className="text-gray-400 text-xs mb-1">Gasto estimado</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {arredondaKcal(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
              </div>
              <div className={modo === "meta" ? "border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5" : "border border-white/15 p-5"}>
                <p className="text-gray-400 text-xs mb-1">{modo === "meta" ? "Tempo de esforço" : "Tempo contado"}</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>{formataTempo(resultado.minutos)}</p>
                {aplicaDesconto && modo !== "meta" && minutosOk && (
                  <p className="text-gray-400 text-sm mt-1">de {formataTempo(minutos)} de aula</p>
                )}
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">{fraseContexto(peso, resultado, ativ, fx)}</p>

            {comparacao && (
              <div className="overflow-x-auto mb-5">
                <table className="w-full text-sm border-collapse">
                  <caption className="text-left text-gray-400 text-xs mb-2">
                    {formataTempo(resultado.minutos)} de esforço para {fmt(peso)} kg, no ritmo mais comum de cada atividade
                  </caption>
                  <tbody>
                    {comparacao.map((l) => (
                      <tr key={l.id} className={`border-b border-white/10 ${l.id === atividadeId ? "text-white" : "text-gray-300"}`}>
                        <td className="py-2.5 pr-4">{l.nome}</td>
                        <td className="py-2.5 pr-4 tabular-nums text-gray-400">{fmt(l.met)} METs</td>
                        <td className="py-2.5 tabular-nums font-medium">≈ {arredondaKcal(l.kcal)} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                  Comparação de gasto no mesmo tempo de esforço — não de resultado. O que emagrece mais é a atividade que
                  você repete, e a que você gosta ganha da que gasta 50 kcal a mais.
                </p>
              </div>
            )}

            {volumeAlto && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>{NOTA_VOLUME_ALTO}</p>
            )}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_BRUTO}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("activity_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>. Para {fmt(peso)} kg em{" "}
                    {ativ.nome.toLowerCase()}, {fx.nome.toLowerCase()} ({fmt(fx.met)} METs, {fx.origem} no Compêndio),
                    isso dá cerca de {fmt(resultado.kcal / Math.max(resultado.minutos, 0.0001))} kcal por minuto.
                  </p>
                  {aplicaDesconto && modo !== "meta" && minutosOk && (
                    <p>
                      Dos {formataTempo(minutos)} de aula, contamos {formataTempo(resultado.minutos)} como esforço
                      ({Math.round(ativ.fracaoAtiva! * 100)}%). Desmarque a caixa acima para contar o tempo inteiro.
                    </p>
                  )}
                  <p>
                    Descontando o que você gastaria parado nesse tempo, a sessão acrescenta cerca de{" "}
                    <span className="text-white">{arredondaKcal(kcalLiquida(resultado, peso))} kcal</span> ao seu dia.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias por Atividade" caminho="/ferramentas/calculadora-calorias-atividades"
                local="tool_result" ferramenta="atividades" resultado={linhasShare} gancho="Descobri quantas calorias eu gasto nessa atividade:" aparencia="solido" />
              {placement !== "calculadora-calorias-atividades" && (
                <Link href="/ferramentas/calculadora-calorias-atividades" onClick={() => trackEvent("activity_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="atividades" categoria={volumeAlto ? "volume_alto" : "padrao"} resumo={resumoWhats} placement={placement} />
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
