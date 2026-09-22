"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  ESFORCOS,
  ESFORCO_PADRAO,
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
  PRESETS_MINUTOS,
  VISOR_MAX,
  VISOR_MIN,
  VISOR_TOLERANCIA_PCT,
  arredondaKcal,
  comparaComEsteira,
  comparaVisor,
  deKcal,
  deTempo,
  esforco as esforcoDe,
  formataTempo,
  fraseContexto,
  kcalLiquida,
  kcalValida,
  leituraVisor,
  minutosValidos,
  parseNumero,
  pesoValido,
  visorValido,
  type EsforcoId,
} from "@/lib/eliptico";

/**
 * A Calculadora de Calorias do Elíptico.
 *
 * TRÊS PERGUNTAS
 *
 * "Quantas calorias em 20 minutos" é a busca que mais traz gente; "quanto
 * tempo para gastar X" é a mesma conta ao contrário; "elíptico ou esteira"
 * é a comparação que o artigo faz em prosa. O campo do visor é opcional,
 * dentro da primeira pergunta: quem está no aparelho tem um número na tela
 * e quer saber se pode confiar nele.
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
  { id: "comparar", rotulo: "Elíptico ou esteira: qual gasta mais" },
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

export default function CalculadoraEliptico({ placement }: { placement: string }) {
  const [modo, setModo] = useState<Modo>("tempo");
  const [pesoTexto, setPesoTexto] = useState("");
  const [minutosTexto, setMinutosTexto] = useState("");
  const [kcalTexto, setKcalTexto] = useState("");
  const [visorTexto, setVisorTexto] = useState("");
  const [mostrarVisor, setMostrarVisor] = useState(false);
  const [esforcoId, setEsforcoId] = useState<EsforcoId>(ESFORCO_PADRAO);
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const minutos = parseNumero(minutosTexto);
  const minutosOk = minutosValidos(minutos);
  const alvo = parseNumero(kcalTexto);
  const alvoOk = kcalValida(alvo);
  const visor = parseNumero(visorTexto);
  const visorOk = mostrarVisor && visorValido(visor);
  const esf = esforcoDe(esforcoId);

  const resultado = !pesoOk
    ? null
    : modo === "meta"
      ? alvoOk ? deKcal(alvo, peso, esf.met) : null
      : minutosOk ? deTempo(minutos, peso, esf.met) : null;
  const comparacao = modo === "comparar" && resultado && pesoOk ? comparaComEsteira(resultado.minutos, peso) : null;
  const diffVisor = modo === "tempo" && resultado && visorOk ? comparaVisor(visor, resultado.kcal) : null;
  const volumeAlto = resultado !== null && resultado.minutos > MINUTOS_ALERTA;

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          trackOncePerSession("elliptical_calculator_view", { placement });
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
      trackEvent("elliptical_calculator_use", { placement, mode: modo, effort: esforcoId });
    }
  }, [temResultado, placement, modo, esforcoId]);

  function trocaModo(novo: Modo) {
    if (novo === modo) return;
    setModo(novo);
    trackEvent("elliptical_mode_selected", { placement, mode: novo });
  }

  const resumoWhats = resultado
    ? `${formataTempo(resultado.minutos)} de elíptico ≈ ${arredondaKcal(resultado.kcal)} kcal`
    : null;
  const linhasShare = resultado
    ? [`${formataTempo(resultado.minutos)} de elíptico`, `esforço ${esf.nome.toLowerCase()}`, `≈ ${arredondaKcal(resultado.kcal)} kcal`]
    : [];
  const idc = (s: string) => `${s}-eli-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-eliptico"
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
            ? "É o que mais muda o resultado — e o que muitos visores de elíptico nem perguntam."
            : !pesoOk ? `Confira o peso informado (entre ${PESO_MIN} e ${PESO_MAX} kg).` : ""}
        </p>
      </div>

      {modo !== "meta" ? (
        <div className="mb-6">
          <label htmlFor={idc("min")} className="block text-gray-300 text-sm font-medium mb-2">
            Quanto tempo de elíptico?
          </label>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {PRESETS_MINUTOS.map((p) => (
              <button key={p} type="button" aria-pressed={minutosTexto === String(p)} className={chip(minutosTexto === String(p))}
                onClick={() => { setMinutosTexto(String(p)); trackEvent("elliptical_preset", { placement, preset: p }); }}>
                {p} min
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input id={idc("min")} type="text" inputMode="numeric" autoComplete="off" placeholder="20" value={minutosTexto}
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

      <div className="mb-6">
        <span className="block text-gray-300 text-sm font-medium mb-2" id={idc("esf")}>
          Qual o seu esforço?
        </span>
        <div role="group" aria-labelledby={idc("esf")} className="flex flex-wrap gap-2">
          {ESFORCOS.map((e) => (
            <button key={e.id} type="button" onClick={() => setEsforcoId(e.id)} aria-pressed={esforcoId === e.id} className={chip(esforcoId === e.id)}>
              {e.nome}
            </button>
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-2 max-w-xl">{esf.comoReconhecer}</p>
        {/* A ausência de "leve" é deliberada e precisa ser dita: o artigo tem
            uma faixa leve em tabela, o Compêndio não tem entrada para ela. */}
        <p className="text-gray-500 text-xs mt-1.5 max-w-xl">
          São os dois únicos esforços medidos para o elíptico. Se o seu ritmo é mais leve que o moderado, o gasto
          fica abaixo do que a conta mostra.
        </p>
      </div>

      {modo === "tempo" && (
        <div className="mb-7">
          {!mostrarVisor ? (
            <button type="button" onClick={() => { trackEvent("elliptical_display_open", { placement }); setMostrarVisor(true); }}
              className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
              style={{ textDecorationColor: "#BA9E50" }}>
              O visor do aparelho mostrou outro número? Compare
            </button>
          ) : (
            <div>
              <label htmlFor={idc("visor")} className="block text-gray-300 text-sm font-medium mb-2">
                Calorias no visor <span className="text-gray-500 font-normal">(opcional)</span>
              </label>
              <div className="flex items-center gap-3">
                <input id={idc("visor")} type="text" inputMode="numeric" autoComplete="off" placeholder="250" value={visorTexto}
                  onChange={(e) => setVisorTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("visor-ajuda")} />
                <span className="text-gray-300 text-lg">kcal</span>
              </div>
              <p id={idc("visor-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
                {visorTexto.trim() !== "" && !visorValido(visor)
                  ? `Use o número que apareceu no visor, entre ${VISOR_MIN} e ${VISOR_MAX.toLocaleString("pt-BR")} kcal.`
                  : ""}
              </p>
            </div>
          )}
        </div>
      )}

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

            {diffVisor !== null && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
                {leituraVisor(diffVisor) === "parecido"
                  ? `O visor (${arredondaKcal(visor!)} kcal) está dentro de ${VISOR_TOLERANCIA_PCT}% da estimativa — os dois contam a mesma história.`
                  : leituraVisor(diffVisor) === "acima"
                    ? `O visor (${arredondaKcal(visor!)} kcal) está cerca de ${Math.round(diffVisor)}% acima da estimativa. É comum, principalmente quando o aparelho não sabe o seu peso ou usa um peso padrão maior que o seu. Use o visor para comparar uma sessão com a outra, não para "compensar" comida.`
                    : `O visor (${arredondaKcal(visor!)} kcal) está cerca de ${Math.round(-diffVisor)}% abaixo da estimativa. Pode ser um peso padrão menor que o seu, ou um esforço real menor que o que você marcou aqui. Nenhum dos dois números é medição — são duas estimativas.`}
              </p>
            )}

            {comparacao && (
              <div className="overflow-x-auto mb-5">
                <table className="w-full text-sm border-collapse">
                  <caption className="text-left text-gray-400 text-xs mb-2">
                    {formataTempo(resultado.minutos)} para {fmt(peso)} kg, do que gasta mais para o que gasta menos
                  </caption>
                  <tbody>
                    {comparacao.map((l) => (
                      <tr key={l.id} className={`border-b border-white/10 ${l.id === `eliptico-${esforcoId}` ? "text-white" : "text-gray-300"}`}>
                        <td className="py-2.5 pr-4">{l.nome}</td>
                        <td className="py-2.5 pr-4 tabular-nums text-gray-400">{fmt(l.met)} METs</td>
                        <td className="py-2.5 tabular-nums font-medium">≈ {arredondaKcal(l.kcal)} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-gray-400 text-sm mt-2 max-w-2xl">
                  Na mesma sensação de esforço, elíptico e esteira ficam perto. O que muda o resultado é qual dos dois você consegue repetir mais vezes na semana.
                </p>
              </div>
            )}

            {volumeAlto && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>{NOTA_VOLUME_ALTO}</p>
            )}
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_BRUTO}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("elliptical_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>. Para {fmt(peso)} kg em esforço {esf.nome.toLowerCase()} ({fmt(esf.met)} METs, {esf.origem}), isso dá cerca de {fmt(resultado.kcal / Math.max(resultado.minutos, 0.0001))} kcal por minuto.
                  </p>
                  <p>
                    Resistência e velocidade não entram na conta porque o elíptico não tem equação metabólica própria: o Compêndio mediu por esforço, e é o esforço que você marca aqui.
                  </p>
                  <p>
                    Descontando o que você gastaria parado nesse tempo, a sessão acrescenta cerca de <span className="text-white">{arredondaKcal(kcalLiquida(resultado, peso))} kcal</span> ao seu dia.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias do Elíptico" caminho="/ferramentas/calculadora-calorias-eliptico"
                local="tool_result" ferramenta="eliptico" resultado={linhasShare} gancho="Descobri quantas calorias o meu elíptico gasta:" aparencia="solido" />
              {placement !== "calculadora-calorias-eliptico" && (
                <Link href="/ferramentas/calculadora-calorias-eliptico" onClick={() => trackEvent("elliptical_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="eliptico" categoria={volumeAlto ? "volume_alto" : "padrao"} resumo={resumoWhats} placement={placement} />
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
