"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  TIPOS,
  TIPO_PADRAO,
  KCAL_MAX,
  KCAL_MIN,
  MINUTOS_ALERTA,
  MINUTOS_MAX,
  MINUTOS_MIN,
  NOTA_BRUTO,
  NOTA_EPOC,
  NOTA_ESTIMATIVA,
  NOTA_SEGURANCA,
  NOTA_SEM_PERDA_LOCALIZADA,
  NOTA_VOLUME_ALTO,
  PESO_MAX,
  PESO_MIN,
  PRESETS_MINUTOS,
  arredondaKcal,
  comparaComCardio,
  deKcal,
  deTempo,
  tipo as tipoDe,
  formataTempo,
  fraseContexto,
  kcalLiquida,
  kcalValida,
  minutosValidos,
  parseNumero,
  pesoValido,
  type TipoId,
} from "@/lib/musculacao";

/**
 * A Calculadora de Calorias da Musculação.
 *
 * TRÊS PERGUNTAS
 *
 * "Quantas calorias em X minutos de musculação" é o que mais se busca; "quanto
 * tempo para gastar X" é a conta ao contrário; "musculação queima mais que
 * cardio?" é a comparação que aparece no autocompletar.
 *
 * PRIVACIDADE
 *
 * Peso é dado do corpo. Nada sai do navegador e os eventos registram uso
 * e modo, nunca valor. O resumo do WhatsApp leva tempo e calorias, jamais
 * o peso.
 */

type Modo = "tempo" | "meta" | "comparar";

const MODOS: { id: Modo; rotulo: string }[] = [
  { id: "tempo", rotulo: "Quantas calorias em X minutos" },
  { id: "meta", rotulo: "Quanto tempo para gastar X kcal" },
  { id: "comparar", rotulo: "Musculação ou cardio: qual gasta mais" },
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

export default function CalculadoraMusculacao({ placement }: { placement: string }) {
  const [modo, setModo] = useState<Modo>("tempo");
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [kcalTexto, setKcalTexto] = useState("");
  const [tipoId, setTipoId] = useState<TipoId>(TIPO_PADRAO);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const alvo = parseNumero(kcalTexto);
  const alvoOk = kcalValida(alvo);
  const esf = tipoDe(tipoId);

  const resultado = !pesoOk
    ? null
    : modo === "meta"
      ? alvoOk ? deKcal(alvo, peso, esf.met) : null
      : minutosOk ? deTempo(minutos, peso, esf.met) : null;
  const comparacao = modo === "comparar" && resultado && pesoOk ? comparaComCardio(resultado.minutos, peso) : null;
  const volumeAlto = resultado !== null && resultado.minutos > MINUTOS_ALERTA;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("strength_calculator_view", { placement });
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
      trackEvent("strength_calculator_use", { placement, mode: modo, type: tipoId });
    }
  }, [temResultado, placement, modo, tipoId]);

  function trocaModo(novo: Modo) {
    if (novo === modo) return;
    setModo(novo);
    trackEvent("strength_mode_selected", { placement, mode: novo });
  }

  const resumoWhats = resultado
    ? `${formataTempo(resultado.minutos)} de musculação ≈ ${arredondaKcal(resultado.kcal)} kcal`
    : null;
  const linhasShare = resultado
    ? [`${formataTempo(resultado.minutos)} de musculação`, `treino ${esf.nome.toLowerCase()}`, `≈ ${arredondaKcal(resultado.kcal)} kcal`]
    : [];
  const idc = (s: string) => `${s}-musc-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-musculacao"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        O que você quer descobrir?
      </h2>

      <div role="group" aria-label="O que você quer descobrir" className="grid gap-2.5 sm:grid-cols-3 mb-7">
        {MODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => trocaModo(m.id)}
            aria-pressed={m.id === modo}
            className={`text-left px-4 py-3.5 border transition-colors min-h-[44px] ${
              m.id === modo ? "border-[#BA9E50] bg-[#BA9E50]/[0.08] text-white" : "border-white/20 text-gray-300 hover:border-white/40 hover:text-white"
            }`}
          >
            <span className="font-semibold text-sm sm:text-base">{m.rotulo}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <label htmlFor={idc("peso")} className="block text-gray-300 text-sm font-medium mb-2">
          Quanto você pesa?
        </label>
        <div className="flex items-center gap-3">
          <input id={idc("peso")} type="text" inputMode="decimal" autoComplete="off" placeholder="70" value={pesoTexto}
            onChange={(e) => setPesoTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("peso-ajuda")} />
          <span className="text-gray-300 text-lg">kg</span>
        </div>
        <p id={idc("peso-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {pesoTexto.trim() === ""
            ? "É o que mais muda o resultado: corpos maiores gastam mais para mover a mesma carga."
            : !pesoOk ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
        </p>
      </div>

      {modo !== "meta" ? (
        <div className="mb-6">
          <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">
            Quanto tempo de treino?
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {PRESETS_MINUTOS.map((p) => (
              <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
                onClick={() => { setMinutosTexto(String(p)); trackEvent("strength_preset", { placement, preset: p }); }}>
                {p} min
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
      ) : (
        <div className="mb-6">
          <label htmlFor={idc("kcal")} className="block text-gray-300 text-sm font-medium mb-2">
            Quantas calorias você quer gastar?
          </label>
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

      <div className="mb-7">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("tipo")}>
          Como é o seu treino?
        </span>
        <div role="group" aria-labelledby={idc("tipo")} className="flex flex-wrap gap-2">
          {TIPOS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTipoId(t.id)} aria-pressed={tipoId === t.id} className={chip(tipoId === t.id)}>
              {t.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">{esf.comoReconhecer}</p>
        <p className="text-gray-500 text-xs mt-1.5 max-w-xl">
          O tempo é o da sessão inteira, com as pausas entre séries: é assim que o Compêndio mediu.
        </p>
      </div>

      <div aria-live="polite">
        {resultado && pesoOk && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>
              Seu resultado
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mb-5">
              <div className={modo === "meta" ? "border border-white/15 p-5" : "border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5"}>
                <p className="text-gray-400 text-xs mb-1">Gasto estimado</p>
                <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                  {arredondaKcal(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
                </p>
              </div>
              <div className={modo === "meta" ? "border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5" : "border border-white/15 p-5"}>
                <p className="text-gray-400 text-xs mb-1">Tempo</p>
                <p className="text-white font-bold text-3xl sm:text-4xl leading-none" style={h}>{formataTempo(resultado.minutos)}</p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">{fraseContexto(peso, resultado, esf.nome)}</p>

            {comparacao && (
              <div className="overflow-x-auto mb-5">
                <table className="w-full text-sm border-collapse">
                  <caption className="text-left text-gray-400 text-xs mb-2">
                    {formataTempo(resultado.minutos)} para {fmt(peso)} kg, do que gasta mais para o que gasta menos
                  </caption>
                  <tbody>
                    {comparacao.map((l) => (
                      <tr key={l.id} className={`border-b border-white/10 ${l.id === `musc-${tipoId}` ? "text-white" : "text-gray-300"}`}>
                        <td className="py-2.5 pr-4">{l.nome}</td>
                        <td className="py-2.5 pr-4 tabular-nums text-gray-400">{fmt(l.met)} METs</td>
                        <td className="py-2.5 tabular-nums font-medium">≈ {arredondaKcal(l.kcal)} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                  Por minuto, o cardio contínuo costuma gastar mais. Mas a musculação é o que preserva e constrói músculo enquanto você emagrece; o melhor resultado vem de combinar os dois.
                </p>
              </div>
            )}

            {volumeAlto && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>{NOTA_VOLUME_ALTO}</p>
            )}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_BRUTO} {NOTA_EPOC}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("strength_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>. Para {fmt(peso)} kg num treino {esf.nome.toLowerCase()} ({fmt(esf.met)} METs, {esf.origem}), isso dá cerca de {fmt(resultado.kcal / Math.max(resultado.minutos, 0.0001))} kcal por minuto.
                  </p>
                  <p>
                    O Compêndio mediu a sessão inteira, com as pausas dentro. Por isso o tipo de treino pesa mais que a carga isolada: descanso curto e exercícios grandes são o que sobem o gasto.
                  </p>
                  <p>
                    Descontando o que você gastaria parado nesse tempo, o treino acrescenta cerca de <span className="text-white">{arredondaKcal(kcalLiquida(resultado, peso))} kcal</span> ao seu dia.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias da Musculação" caminho="/ferramentas/calculadora-calorias-musculacao"
                local="tool_result" ferramenta="musculacao" resultado={linhasShare} gancho="Descobri quantas calorias o meu treino de musculação gasta:" aparencia="solido" />
              {placement !== "calculadora-calorias-musculacao" && (
                <Link href="/ferramentas/calculadora-calorias-musculacao" onClick={() => trackEvent("strength_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="musculacao" categoria={volumeAlto ? "volume_alto" : "padrao"} resumo={resumoWhats} placement={placement} />
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
