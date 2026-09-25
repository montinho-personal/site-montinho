"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import {
  EXEMPLOS_CM, FAIXAS, FONTE_CLASSIC, DATA_CONFERENCIA_TEXTO, MENSAGEM_ERRO_ALTURA,
  PESO_KG_MAX, PESO_KG_MIN, calcula, fmt1, fmtAlturaM, fmtFaixaAltura, fraseDiferenca, lbParaKg,
  parseNumero, polegadasParaCm, validaAlturaCm, type Resultado,
} from "@/lib/classic-physique";

/**
 * Calculadora de Peso da Classic Physique — UM componente, dois tamanhos.
 *
 *   variante="completa" — a página da ferramenta e o artigo de peso de Ramon:
 *     cm ou pés/polegadas, peso opcional em kg ou lb, barra de comparação,
 *     faixas vizinhas, tabela completa recolhida, compartilhar e o próximo
 *     passo (Simulador de Ganho de Massa).
 *   variante="compacta" — dentro de artigo de resultado: só altura em cm e o
 *     limite, com link para a ferramenta completa.
 *
 * Nada sai do navegador. Os eventos levam a variante e o lugar, nunca altura
 * nem peso. A URL não muda com o resultado (sem ?altura=), para não gerar
 * páginas duplicadas.
 */

const CAMINHO = "/ferramentas/calculadora-peso-classic-physique";
const URL_FERRAMENTA = `https://www.montinhopersonal.com.br${CAMINHO}`;
const DOURADO = "#BA9E50";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const campo = `w-full min-w-0 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-xl font-bold px-4 py-3 outline-none ${foco}`;
const btnPrim = `inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 transition-colors ${foco}`;
const btnSec = `inline-flex items-center justify-center border border-white/25 text-white px-5 py-3 text-sm min-h-[48px] hover:border-white/60 transition-colors ${foco}`;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

type Unidade = "cm" | "ft";
type UnPeso = "kg" | "lb";

export default function CalculadoraClassic({ variante = "completa", placement }: { variante?: "completa" | "compacta"; placement: string }) {
  const id = useId();
  const [unidade, setUnidade] = useState<Unidade>("cm");
  const [cm, setCm] = useState("");
  const [pes, setPes] = useState("");
  const [pol, setPol] = useState("");
  const [peso, setPeso] = useState("");
  const [unPeso, setUnPeso] = useState<UnPeso>("kg");
  const [erro, setErro] = useState<string | null>(null);
  const [erroPeso, setErroPeso] = useState<string | null>(null);
  const [res, setRes] = useState<Resultado | null>(null);
  const [tabela, setTabela] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const iniciou = useRef(false);
  const resultadoRef = useRef<HTMLDivElement>(null);
  const completa = variante === "completa";

  useEffect(() => { trackOncePerSession("classic_calc_view", { variant: variante, placement }); }, [variante, placement]);
  const comecou = () => { if (!iniciou.current) { iniciou.current = true; trackEvent("classic_calc_started", { variant: variante, placement }); } };

  function calcular(alturaCmTexto?: string) {
    setErro(null); setErroPeso(null);
    let alturaCm: number; let polegadas: number | undefined;
    if (unidade === "cm" || alturaCmTexto !== undefined) {
      const v = validaAlturaCm(alturaCmTexto ?? cm);
      if ("erro" in v) { setErro(MENSAGEM_ERRO_ALTURA[v.erro]); setRes(null); return; }
      alturaCm = v.cm;
    } else {
      const f = parseNumero(pes); const i = pol.trim() ? parseNumero(pol) : 0;
      if (f === null || i === null || f < 4 || f > 7 || i >= 12) { setErro("Informe pés (4 a 7) e polegadas (0 a 11). Exemplo: 5 pés e 11 polegadas."); setRes(null); return; }
      polegadas = f * 12 + i; alturaCm = polegadasParaCm(polegadas);
    }
    let pesoKg: number | null = null;
    if (completa && peso.trim()) {
      const p = parseNumero(peso);
      const kg = p === null ? null : unPeso === "kg" ? p : lbParaKg(p);
      if (kg === null || kg < PESO_KG_MIN || kg > PESO_KG_MAX) { setErroPeso(`Peso opcional: informe um valor entre ${PESO_KG_MIN} e ${PESO_KG_MAX} kg (ou deixe em branco).`); setRes(null); return; }
      pesoKg = Math.round(kg * 10) / 10;
      trackEvent("classic_calc_weight_used", { variant: variante, placement });
    }
    setRes(calcula(alturaCm, pesoKg, polegadas));
    trackEvent("classic_calc_completed", { variant: variante, placement, unit: unidade });
    requestAnimationFrame(() => resultadoRef.current?.focus({ preventScroll: false }));
  }

  function exemplo(v: number) { comecou(); setUnidade("cm"); setCm(String(v)); calcular(String(v)); }

  const textoShare = res ? `Com ${fmtAlturaM(res.alturaCm)}, o limite atual da Classic Physique profissional (IFBB Pro League) é ${fmt1(res.faixa.kg)} kg. Veja o seu:` : "";
  async function compartilhar() {
    trackEvent("classic_calc_share", { variant: variante, placement });
    try {
      if (navigator.share) { await navigator.share({ title: "Calculadora de Peso da Classic Physique", text: textoShare, url: URL_FERRAMENTA }); return; }
      await navigator.clipboard.writeText(`${textoShare} ${URL_FERRAMENTA}`); setCopiado(true); setTimeout(() => setCopiado(false), 2500);
    } catch { /* cancelado */ }
  }

  const barra = res && res.pesoKg !== null ? (() => {
    const max = Math.max(res.faixa.kg, res.pesoKg) * 1.08;
    return { atual: (res.pesoKg / max) * 100, limite: (res.faixa.kg / max) * 100 };
  })() : null;

  return (
    <div className={`border border-white/15 ${completa ? "p-5 sm:p-8" : "p-5"}`} data-testid={`calc-classic-${variante}`}>
      <form onSubmit={(e) => { e.preventDefault(); comecou(); calcular(); }} noValidate>
        {completa && (
          <div role="radiogroup" aria-label="Unidade da altura" className="flex gap-1.5 mb-4">
            {(["cm", "ft"] as Unidade[]).map((u) => (
              <button key={u} type="button" role="radio" aria-checked={unidade === u} onClick={() => { setUnidade(u); setErro(null); }}
                className={`px-3 min-h-[40px] text-sm border ${foco} ${unidade === u ? "bg-white text-black border-white font-semibold" : "border-white/20 text-gray-300 hover:border-white/50"}`}>
                {u === "cm" ? "Centímetros" : "Pés e polegadas"}
              </button>
            ))}
          </div>
        )}
        <div className={`grid gap-3 ${completa ? "sm:grid-cols-2" : ""}`}>
          {unidade === "cm" ? (
            <div>
              <label htmlFor={`${id}-cm`} className="block text-white text-sm font-semibold mb-1.5">Altura em centímetros</label>
              <div className="flex">
                <input id={`${id}-cm`} inputMode="decimal" autoComplete="off" placeholder="180" value={cm} onChange={(e) => { setCm(e.target.value); comecou(); }}
                  aria-invalid={!!erro} aria-describedby={erro ? `${id}-erro` : undefined} className={campo} />
                <span className="border border-l-0 border-white/25 text-gray-400 px-3 flex items-center text-sm">cm</span>
              </div>
            </div>
          ) : (
            <div>
              <span className="block text-white text-sm font-semibold mb-1.5" id={`${id}-ftl`}>Altura em pés e polegadas</span>
              <div className="flex gap-2" role="group" aria-labelledby={`${id}-ftl`}>
                <label className="sr-only" htmlFor={`${id}-ft`}>Pés</label>
                <input id={`${id}-ft`} inputMode="numeric" placeholder="5" value={pes} onChange={(e) => { setPes(e.target.value); comecou(); }} className={campo} />
                <span className="text-gray-400 self-center">′</span>
                <label className="sr-only" htmlFor={`${id}-in`}>Polegadas</label>
                <input id={`${id}-in`} inputMode="decimal" placeholder="11" value={pol} onChange={(e) => { setPol(e.target.value); comecou(); }} className={campo} />
                <span className="text-gray-400 self-center">″</span>
              </div>
            </div>
          )}
          {completa && (
            <div>
              <label htmlFor={`${id}-peso`} className="block text-white text-sm font-semibold mb-1.5">Peso atual <span className="text-gray-500 font-normal">(opcional)</span></label>
              <div className="flex">
                <input id={`${id}-peso`} inputMode="decimal" autoComplete="off" placeholder={unPeso === "kg" ? "85" : "187"} value={peso} onChange={(e) => setPeso(e.target.value)}
                  aria-invalid={!!erroPeso} aria-describedby={erroPeso ? `${id}-erro-peso` : undefined} className={campo} />
                <button type="button" onClick={() => setUnPeso(unPeso === "kg" ? "lb" : "kg")} aria-label={`Unidade do peso: ${unPeso}. Trocar`}
                  className={`border border-l-0 border-white/25 text-gray-300 px-3 text-sm min-w-[52px] hover:text-white ${foco}`}>{unPeso}</button>
              </div>
            </div>
          )}
        </div>
        {erro && <p id={`${id}-erro`} role="alert" className="text-red-300 text-sm mt-2">{erro}</p>}
        {erroPeso && <p id={`${id}-erro-peso`} role="alert" className="text-red-300 text-sm mt-2">{erroPeso}</p>}
        <button type="submit" className={`${btnPrim} mt-4 w-full sm:w-auto`}>Calcular meu limite</button>
      </form>

      {completa && (
        <p className="text-gray-400 text-sm mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span>Exemplos:</span>
          {EXEMPLOS_CM.map((v) => (
            <button key={v} type="button" onClick={() => exemplo(v)} className={`text-gray-200 underline underline-offset-4 decoration-white/30 hover:text-white min-h-[36px] ${foco}`}>
              {fmtAlturaM(v)}
            </button>
          ))}
        </p>
      )}

      <div ref={resultadoRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {res && (
          <div className="mt-6" data-testid="calc-classic-resultado">
            <div className="border-l-2 pl-4 sm:pl-5" style={{ borderColor: DOURADO }}>
              <p className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: DOURADO }}>Seu limite na Classic Physique Pro</p>
              <p className="text-gray-300 text-sm mt-2">Para uma altura de <strong className="text-white">{fmtAlturaM(res.alturaCm)}</strong>, o limite atual da Men&apos;s Classic Physique profissional da IFBB Pro League é:</p>
              <p className="text-white font-bold leading-none mt-2" style={h} data-testid="calc-classic-kg">
                <span className="text-5xl sm:text-6xl tabular-nums">{fmt1(res.faixa.kg)}</span> <span className="text-2xl">kg</span>
                <span className="block text-gray-400 text-base font-normal mt-2" style={{ fontFamily: "inherit" }}>{res.faixa.libras} lb · faixa {fmtFaixaAltura(res.faixa)}</span>
              </p>
              <p className="text-gray-400 text-sm mt-3">Esse é o peso máximo permitido na pesagem da categoria para essa faixa de altura — não é um peso ideal nem uma recomendação de composição corporal.</p>
            </div>

            {completa && res.pesoKg !== null && res.diferencaKg !== null && barra && (
              <div className="mt-6" data-testid="calc-classic-comparacao">
                <div className="flex justify-between text-sm text-gray-300"><span>Peso atual: <strong className="text-white tabular-nums">{fmt1(res.pesoKg)} kg</strong></span><span>Limite: <strong className="text-white tabular-nums">{fmt1(res.faixa.kg)} kg</strong></span></div>
                <div className="relative h-3 bg-white/10 mt-2" aria-hidden="true">
                  <div className="absolute inset-y-0 left-0 bg-white/50" style={{ width: `${Math.min(barra.atual, 100)}%` }} />
                  <div className="absolute -top-1 -bottom-1 w-[3px]" style={{ left: `${barra.limite}%`, background: DOURADO }} />
                </div>
                <p className="text-white mt-3">{fraseDiferenca(res.diferencaKg)}</p>
              </div>
            )}

            {completa && (
              <div className="mt-6">
                <p className="text-white text-sm font-semibold mb-2">Como sua altura se compara às faixas vizinhas</p>
                <table className="w-full text-sm border-collapse">
                  <caption className="sr-only">Sua faixa e as faixas vizinhas da tabela profissional</caption>
                  <thead><tr className="border-b border-white/20 text-gray-400"><th scope="col" className="text-left font-medium py-2 pr-3">Altura</th><th scope="col" className="text-left font-medium py-2 pr-3">Limite</th><th scope="col" className="text-left font-medium py-2">Libras</th></tr></thead>
                  <tbody>{res.vizinhas.map((f) => {
                    const sua = f.indice === res.faixa.indice;
                    return (
                      <tr key={f.indice} className={`border-b border-white/10 ${sua ? "text-white font-semibold" : "text-gray-400"}`}>
                        <td className="py-2 pr-3">{fmtFaixaAltura(f)}{sua && <span className="ml-2 text-xs px-1.5 py-0.5 text-black" style={{ background: DOURADO }}>sua faixa</span>}</td>
                        <td className="py-2 pr-3 tabular-nums">{fmt1(f.kg)} kg</td>
                        <td className="py-2 tabular-nums">{f.libras} lb</td>
                      </tr>
                    );
                  })}</tbody>
                </table>
              </div>
            )}

            {completa ? (
              <>
                <div className="flex flex-wrap items-center gap-3 mt-6">
                  <button type="button" onClick={compartilhar} className={btnSec}>Compartilhar resultado</button>
                  <a href={getWhatsAppUrl(`${textoShare} ${URL_FERRAMENTA}`)} onClick={() => trackEvent("classic_calc_share", { variant: variante, placement, channel: "whatsapp" })} target="_blank" rel="noopener noreferrer" className={btnSec}>Enviar no WhatsApp</a>
                  {copiado && <span role="status" className="text-sm text-white">Texto copiado.</span>}
                </div>

                <div className="mt-8 border border-white/15 p-5" data-testid="calc-classic-proximo">
                  <p className="text-white font-bold text-lg" style={h}>O limite da categoria não é uma meta de peso</p>
                  <p className="text-gray-300 text-sm leading-relaxed mt-2">O peso máximo da Classic é uma regra competitiva. Para quem treina por estética, o que importa é construir massa muscular de acordo com a sua estrutura, experiência, rotina e objetivo. Quer ver como o seu próprio ganho de massa pode evoluir?</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link href="/ferramentas/simulador-ganho-massa-muscular" onClick={() => trackEvent("classic_calc_mass_simulator_click", { variant: variante, placement })} className={btnPrim}>Simular meu ganho de massa →</Link>
                    <a href={getWhatsAppUrl("Oi, Montinho! Usei a calculadora da Classic Physique no seu site e queria entender como estruturar meu ganho de massa.")} target="_blank" rel="noopener noreferrer"
                      onClick={() => trackEvent("classic_calc_whatsapp_click", { variant: variante, placement })} className={`${ln} text-gray-300 text-sm min-h-[48px] inline-flex items-center`}>Falar com o Montinho</a>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-4 text-sm"><Link href={CAMINHO} className={`${ln} text-gray-200`}>Ver a calculadora completa e a tabela oficial →</Link></p>
            )}
          </div>
        )}
      </div>

      {completa && (
        <details className="mt-6 border-t border-white/10 pt-4 group" onToggle={(e) => { if ((e.target as HTMLDetailsElement).open) { setTabela(true); trackEvent("classic_calc_table_open", { variant: variante, placement }); } }}>
          <summary className={`cursor-pointer text-gray-200 text-sm font-semibold min-h-[44px] flex items-center ${foco}`}>Ver tabela completa (IFBB Pro League)</summary>
          {tabela && <TabelaClassic destaque={res?.faixa.indice ?? null} />}
        </details>
      )}

      <p className="text-gray-500 text-xs mt-4">
        Fonte dos limites: <a href={FONTE_CLASSIC.url} target="_blank" rel="noopener noreferrer" className={ln}>IFBB Professional League — Pro Competition Rules</a>. Dados conferidos em {DATA_CONFERENCIA_TEXTO}. Tabela profissional; competições amadoras (NPC Worldwide e outras federações) podem usar limites diferentes.
      </p>
    </div>
  );
}

/** A tabela oficial completa, a partir da mesma fonte. Também usada na página da ferramenta. */
export function TabelaClassic({ destaque = null }: { destaque?: number | null }) {
  return (
    <div className="overflow-x-auto mt-3">
      <table className="w-full text-sm border-collapse">
        <caption className="sr-only">Peso máximo da Men&apos;s Classic Physique profissional por altura, IFBB Pro League</caption>
        <thead><tr className="border-b border-white/20 text-gray-400"><th scope="col" className="text-left font-medium py-2 pr-3">Altura (até)</th><th scope="col" className="text-left font-medium py-2 pr-3">Pés/pol.</th><th scope="col" className="text-left font-medium py-2 pr-3">Peso máximo</th><th scope="col" className="text-left font-medium py-2">Libras</th></tr></thead>
        <tbody>{FAIXAS.map((f) => (
          <tr key={f.indice} className={`border-b border-white/10 ${destaque === f.indice ? "text-white font-semibold bg-[#BA9E50]/10" : "text-gray-300"}`}>
            <td className="py-2 pr-3 tabular-nums">{f.cm === null ? "acima de 200,7 cm" : `${fmt1(f.cm)} cm`}</td>
            <td className="py-2 pr-3 tabular-nums">{f.pesPolegadas ?? "acima de 6'7\""}</td>
            <td className="py-2 pr-3 tabular-nums">{fmt1(f.kg)} kg</td>
            <td className="py-2 tabular-nums">{f.libras} lb</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

