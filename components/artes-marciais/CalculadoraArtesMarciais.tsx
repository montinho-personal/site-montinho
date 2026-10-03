"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Compartilhar from "@/components/share/Compartilhar";
import PosResultado from "@/components/ferramentas/PosResultado";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  AULA_MAX,
  AULA_MIN,
  LUTA_PADRAO,
  MODALIDADES,
  MODALIDADE_PADRAO,
  NOTA_ESTIMATIVA,
  NOTA_SEGURANCA,
  NOTA_TECNICA,
  PESO_MAX,
  PESO_MIN,
  PRESETS_AULA,
  arredondaKcal,
  aulaValida,
  calcula,
  comparaModalidades,
  formataTempo,
  lutaValida,
  modalidade,
  parseNumero,
  pesoValido,
  type ModalidadeId,
} from "@/lib/artes-marciais";

/**
 * A Calculadora de Calorias nas Artes Marciais.
 *
 * A pessoa escolhe a modalidade, informa o peso, a duração da aula e
 * quantos minutos dela foram de luta (rola, sparring, randori, kumite). O
 * resto vira técnica. Nada sai do navegador; os eventos registram a
 * modalidade e o preset, nunca o peso nem as calorias.
 */

const CAMINHO = "/ferramentas/calculadora-calorias-artes-marciais";
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

export default function CalculadoraArtesMarciais({ placement }: { placement: string }) {
  const [mod, setMod] = useState<ModalidadeId>(MODALIDADE_PADRAO);
  const [pesoTexto, setPesoTexto] = useState("");
  const [aulaTexto, setAulaTexto] = useState("");
  const [lutaTexto, setLutaTexto] = useState(String(LUTA_PADRAO));
  const [mostrarMetodo, setMostrarMetodo] = useState(false);

  const raiz = useRef<HTMLDivElement>(null);
  const jaUsou = useRef(false);

  const m = modalidade(mod);
  const peso = parseNumero(pesoTexto);
  const pesoOk = pesoValido(peso);
  const aula = parseNumero(aulaTexto);
  const aulaOk = aulaValida(aula);
  const luta = parseNumero(lutaTexto);
  const lutaOk = lutaValida(luta);

  const camposOk = pesoOk && aulaOk && lutaOk;
  const resultado = camposOk ? calcula(mod, peso, aula, luta) : null;
  const naoCabe = camposOk && resultado === null;
  const comparacao = resultado ? comparaModalidades(peso!, aula!, luta!) : [];

  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          trackOncePerSession("artesmarciais_calculator_view", { placement });
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
      trackEvent("artesmarciais_calculator_use", { placement, modality: mod });
    }
  }, [temResultado, placement, mod]);

  const resumoWhats = resultado
    ? `${formataTempo(resultado.minutosAula)} de ${m.nome.toLowerCase()} com ${formataTempo(resultado.minutosLuta)} de ${m.luta} ≈ ${kc(resultado.kcal)} kcal`
    : null;
  const linhasShare = resultado
    ? [`${formataTempo(resultado.minutosAula)} de ${m.nome.toLowerCase()}`, `${formataTempo(resultado.minutosLuta)} de ${m.luta}`, `≈ ${kc(resultado.kcal)} kcal`]
    : [];
  const idc = (s: string) => `${s}-am-${placement}`;

  return (
    <div
      ref={raiz}
      className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative"
      data-testid="calculadora-artesmarciais"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Gratuita · o peso não sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-6" style={h}>
        Quanto a sua aula de luta gastou?
      </h2>

      <div className="mb-6">
        <label htmlFor={idc("mod")} className="block text-gray-300 text-sm font-medium mb-2">Qual arte marcial?</label>
        <select id={idc("mod")} value={mod}
          onChange={(e) => { const id = e.target.value as ModalidadeId; setMod(id); trackEvent("artesmarciais_modality", { placement, modality: id }); }}
          className="bg-black border border-white/25 focus:border-[#BA9E50] text-white text-lg font-semibold px-4 py-3 outline-none min-h-[44px] w-full max-w-xs">
          {MODALIDADES.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
        </select>
      </div>

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
        <label htmlFor={idc("aula")} className="block text-gray-300 text-sm font-medium mb-2">Quanto tempo de aula?</label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {PRESETS_AULA.map((p) => (
            <button key={p} type="button" aria-pressed={aulaTexto === String(p)} className={chip(aulaTexto === String(p))}
              onClick={() => { setAulaTexto(String(p)); trackEvent("artesmarciais_preset", { placement, preset: p }); }}>
              {formataTempo(p)}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <input id={idc("aula")} type="text" inputMode="numeric" autoComplete="off" placeholder="60" value={aulaTexto}
            onChange={(e) => setAulaTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("aula-ajuda")} />
          <span className="text-gray-300 text-lg">minutos</span>
        </div>
        <p id={idc("aula-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px]">
          {aulaTexto.trim() !== "" && !aulaOk ? `Use um valor entre ${AULA_MIN} e ${AULA_MAX} minutos.` : "A aula inteira: aquecimento, técnica e luta."}
        </p>
      </div>

      <div className="mb-7">
        <label htmlFor={idc("luta")} className="block text-gray-300 text-sm font-medium mb-2">
          Quantos minutos de {m.luta} dentro da aula?
        </label>
        <div className="flex items-center gap-3">
          <input id={idc("luta")} type="text" inputMode="numeric" autoComplete="off" value={lutaTexto}
            onChange={(e) => setLutaTexto(e.target.value)} className={`w-32 ${campo}`} aria-describedby={idc("luta-ajuda")} />
          <span className="text-gray-300 text-lg">minutos</span>
        </div>
        <p id={idc("luta-ajuda")} className="text-gray-400 text-sm mt-2 min-h-[20px] max-w-xl" data-testid="ajuda-luta">
          {lutaTexto.trim() !== "" && !lutaOk
            ? "Informe os minutos de luta, de 0 até a duração da aula."
            : naoCabe
              ? `O ${m.luta} não pode passar da duração da aula.`
              : `Some só o tempo lutando de verdade. O resto da aula conta como técnica.`}
        </p>
      </div>

      <div aria-live="polite">
        {resultado && pesoOk && (
          <div className="border-t border-white/10 pt-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-4" style={{ color: "#BA9E50" }}>Seu resultado</p>
            <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5 mb-5 max-w-md">
              <p className="text-gray-400 text-xs mb-1">Gasto estimado da aula de {m.nome.toLowerCase()}</p>
              <p className="text-white font-bold text-4xl sm:text-5xl leading-none" style={h}>
                {kc(resultado.kcal)}<span className="text-lg font-normal text-gray-300"> kcal</span>
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {resultado.minutosLuta === 0
                  ? "só técnica, sem luta"
                  : `${kc(resultado.kcalLuta)} kcal no ${m.luta}, ${kc(resultado.kcalTecnica)} na técnica`}
              </p>
            </div>

            {m.nota && <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl">{m.nota}</p>}

            <div className="mb-5 max-w-xl">
              <p className="text-gray-300 text-sm font-medium mb-2">A mesma aula em cada modalidade</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse" data-testid="comparacao-modalidades">
                  <caption className="sr-only">Gasto estimado da mesma aula em cada arte marcial</caption>
                  <tbody>
                    {comparacao.map((l) => (
                      <tr key={l.modalidade.id} className="border-b border-white/10">
                        <td className={`py-2 pr-4 ${l.modalidade.id === mod ? "text-white font-semibold" : "text-gray-300"}`}>{l.modalidade.nome}</td>
                        <td className={`py-2 tabular-nums ${l.modalidade.id === mod ? "text-white font-semibold" : "text-gray-300"}`}>≈ {kc(l.kcal)} kcal</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {m.calculadora && placement !== m.calculadora.href.replace("/ferramentas/", "") && (
              <p className="text-gray-300 leading-relaxed mb-4 max-w-2xl border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
                Quer separar rounds e descansos? A{" "}
                <Link href={m.calculadora.href} className={ln}
                  onClick={() => trackEvent("artesmarciais_tool_click", { placement, modality: mod })}>
                  {m.calculadora.nome}
                </Link>{" "}
                faz a conta em detalhe.
              </p>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">{NOTA_ESTIMATIVA} {NOTA_TECNICA}</p>

            <div className="border-t border-white/10 pt-5 mb-6">
              <button type="button" aria-expanded={mostrarMetodo}
                onClick={() => { if (!mostrarMetodo) trackEvent("artesmarciais_methodology_open", { placement }); setMostrarMetodo(!mostrarMetodo); }}
                className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
                style={{ textDecorationColor: "#BA9E50" }}>
                Como calculamos
              </button>
              {mostrarMetodo && (
                <div className="mt-4 space-y-3 text-gray-300 text-sm leading-relaxed max-w-2xl">
                  <p>
                    <span className="text-white">MET × 3,5 × peso em kg ÷ 200</span>, por minuto. Em {m.nome.toLowerCase()}, a técnica vale{" "}
                    {metF(m.metTecnica)} METs e o {m.luta} vale {metF(m.metLuta)}.
                  </p>
                  <p>
                    Na sua aula: {formataTempo(resultado.minutosTecnica)} de técnica e {formataTempo(resultado.minutosLuta)} de {m.luta}.
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Compartilhar contexto="tool-result" titulo="Calculadora de Calorias nas Artes Marciais" caminho={CAMINHO}
                local="tool_result" ferramenta="artesmarciais" resultado={linhasShare} gancho="Descobri quanto a minha aula de luta gastou:" aparencia="solido" />
              {placement !== "calculadora-calorias-artes-marciais" && (
                <Link href={CAMINHO} onClick={() => trackEvent("artesmarciais_tool_click", { placement })}
                  className="text-gray-300 hover:text-white text-sm underline underline-offset-4 decoration-1 transition-colors" style={{ textDecorationColor: "#BA9E50" }}>
                  Ver a calculadora completa →
                </Link>
              )}
            </div>

            <PosResultado ferramenta="artesmarciais" categoria="padrao" resumo={resumoWhats} placement={placement} />
          </div>
        )}
      </div>

      <p className="text-gray-500 text-xs leading-relaxed mt-5 max-w-2xl">
        {NOTA_SEGURANCA}{" "}
        <Link href="/blog/deficit-calorico-como-calcular" className={ln}>Entenda como funciona o déficit calórico</Link>.
      </p>
    </div>
  );
}
