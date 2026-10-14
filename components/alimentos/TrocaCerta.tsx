"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { PONTE, consome } from "@/lib/ferramentas/ponte";
import { buscaAlimentos, montaIndice, normaliza } from "@/lib/alimentos/busca";
import { formataNumero, leGramas } from "@/lib/alimentos/escala";
import { nomeNatural } from "@/lib/alimentos/nome";
import type { Alimento } from "@/lib/alimentos/tipos";
import {
  AVISO_GERAL,
  CRITERIOS,
  FORA_DA_BASE,
  GRUPOS,
  TEXTO_RECUSA,
  grupoDe,
  macrosDe,
  nomeCriterio,
  trocaDireta,
  trocas,
  type AlimentoEq,
  type Criterio,
  type Macros,
  type Troca,
} from "@/lib/alimentos/equivalencia";

/**
 * Troca Certa — a calculadora de substituição de alimentos.
 *
 * Toda a conta mora em lib/alimentos/equivalencia.ts. Este componente só
 * escolhe, mostra e explica. A ordem de prioridade da tela é a da pergunta:
 * primeiro a quantidade equivalente, depois a medida caseira, por último os
 * nutrientes — e sempre dizendo QUAL nutriente foi igualado.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const OURO = "#BA9E50";
const VISIVEIS = 6;

/** Gramas inteiras sem ",0": "100 g", não "100,0 g". */
const gr = (v: number) => (Number.isInteger(v) ? String(v) : formataNumero(v, "g"));
const g1 = (v: number | null) => (v === null ? "—" : `${formataNumero(v, "g")} g`);
const kc = (v: number | null) => (v === null ? "—" : `${formataNumero(v, "kcal")} kcal`);
const fmt = (c: Criterio, v: number | null) => (c === "energia" ? kc(v) : g1(v));

function Busca({
  id,
  rotulo,
  indice,
  porSlug,
  escolhido,
  onEscolhe,
  placeholder,
}: {
  id: string;
  rotulo: string;
  indice: ReturnType<typeof montaIndice>;
  porSlug: Map<string, AlimentoEq>;
  escolhido: AlimentoEq | null;
  onEscolhe: (a: AlimentoEq | null) => void;
  placeholder: string;
}) {
  const [consulta, setConsulta] = useState("");
  const resultados = useMemo(() => (escolhido ? [] : buscaAlimentos(indice, consulta, { limite: 7 })), [indice, consulta, escolhido]);
  const fora = useMemo(() => {
    const q = normaliza(consulta);
    return q.length >= 3 ? FORA_DA_BASE.find((f) => f.termo.test(q)) : undefined;
  }, [consulta]);
  const listaId = `${id}-lista`;

  return (
    <div>
      <label htmlFor={id} className="block text-gray-300 text-sm font-medium mb-2">{rotulo}</label>
      {escolhido ? (
        <div className="flex items-start justify-between gap-3 border border-white/25 px-4 py-3 min-h-[52px]">
          <span className="text-white">{escolhido.nome}</span>
          <button type="button" onClick={() => { onEscolhe(null); setConsulta(""); }} className="text-gray-400 hover:text-white text-sm underline underline-offset-4 shrink-0">
            trocar
          </button>
        </div>
      ) : (
        <>
          <input
            id={id}
            type="search"
            autoComplete="off"
            enterKeyHint="search"
            placeholder={placeholder}
            value={consulta}
            aria-controls={listaId}
            onChange={(e) => setConsulta(e.target.value)}
            className="w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white px-4 py-3 min-h-[52px] transition-colors"
          />
          {consulta.trim() !== "" && (
            <ul id={listaId} className="mt-2 divide-y divide-white/10 border-t border-white/10">
              {resultados.map((r) => {
                const a = porSlug.get(r.alimento.slug);
                if (!a) return null;
                return (
                  <li key={a.slug}>
                    <button
                      type="button"
                      onClick={() => { onEscolhe(a); setConsulta(""); }}
                      className="w-full text-left py-3 hover:bg-white/5 transition-colors min-h-[48px] px-2 -mx-2 text-gray-200"
                    >
                      {a.nome}
                    </button>
                  </li>
                );
              })}
              {resultados.length === 0 && (
                <li className="py-4 text-gray-400 text-sm">{fora ? fora.texto : "Esse alimento ainda não está na nossa base."}</li>
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

/** A linha compacta dos quatro macros, com o critério em destaque. */
function LinhaMacros({ m, criterio }: { m: Macros; criterio: Criterio }) {
  const itens: [Criterio | "lipideos", string, string][] = [
    ["carboidrato", "Carbo", g1(m.carboidrato)],
    ["proteina", "Proteína", g1(m.proteina)],
    ["lipideos", "Gordura", g1(m.lipideos)],
    ["energia", "Calorias", kc(m.energia)],
  ];
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-sm">
      {itens.map(([id, rotulo, v]) => {
        const destaque = id === criterio;
        return (
          <div key={id} className="flex gap-1.5">
            <dt className={destaque ? "font-semibold" : "text-gray-400"} style={destaque ? { color: OURO } : undefined}>{rotulo}{destaque ? " ✓" : ""}</dt>
            <dd className={destaque ? "text-white font-semibold tabular-nums" : "text-gray-300 tabular-nums"}>{v}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function CartaoTroca({ t, criterio, linkavel }: { t: Troca; criterio: Criterio; linkavel: boolean }) {
  return (
    <li className="border border-white/15 p-4">
      <p className="text-gray-200 mb-1">
        {linkavel ? (
          <Link href={`/alimentos/${t.alimento.slug}`} className="underline underline-offset-4 decoration-white/30 hover:text-white">{t.alimento.nome}</Link>
        ) : (
          t.alimento.nome
        )}
      </p>
      <p className="text-3xl font-bold text-white tabular-nums mb-1" style={h}>{t.gramas} g</p>
      {t.medida && (
        <p className="text-gray-300 text-sm mb-3">≈ {t.medida.texto} <span className="text-gray-500">({gr(t.medida.gramasCada)} g cada)</span></p>
      )}
      <LinhaMacros m={t.macros} criterio={criterio} />
      {t.nota && <p className="text-gray-400 text-xs mt-3">{t.nota}</p>}
      {t.avisos.length > 0 && <p className="text-gray-400 text-xs mt-2">{t.avisos.join(" ")}</p>}
    </li>
  );
}

export default function TrocaCerta({ alimentos, indexaveis }: { alimentos: AlimentoEq[]; indexaveis: string[] }) {
  const porSlug = useMemo(() => new Map(alimentos.map((a) => [a.slug, a])), [alimentos]);
  const linkaveis = useMemo(() => new Set(indexaveis), [indexaveis]);
  const indice = useMemo(
    () =>
      montaIndice(
        alimentos.map(
          (x) =>
            ({
              id: x.slug, slug: x.slug, nome: x.nome, categoria: x.categoria, aliases: x.aliases ?? [],
              preparo: "cru", nutrientes: [], porcoes: [],
              proveniencia: { fonte: "TACO", idNaFonte: "", descricaoOriginal: "", versao: "", verificadoEm: "" },
              indexavel: false,
            }) as Alimento,
        ),
      ),
    [alimentos],
  );

  const [origem, setOrigem] = useState<AlimentoEq | null>(null);
  const [texto, setTexto] = useState("150");
  const [criterio, setCriterio] = useState<Criterio>("carboidrato");
  const [verTodas, setVerTodas] = useState(false);
  const [destino, setDestino] = useState<AlimentoEq | null>(null);
  const [especifico, setEspecifico] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);

  /** O alimento que veio de outra página (página do alimento, comparador). */
  useEffect(() => {
    const slug = consome(PONTE.troca);
    if (slug === null) return;
    const a = porSlug.get(slug);
    if (!a) return;
    escolheOrigem(a, "ponte");
    trackEvent("food_swap_open", { placement: "ponte" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [porSlug]);

  function escolheOrigem(a: AlimentoEq | null, placement = "busca") {
    setOrigem(a);
    setVerTodas(false);
    setDestino(null);
    if (!a) return;
    const grupo = grupoDe(a, criterio);
    const padrao = grupo ? GRUPOS[grupo].criterioPadrao : "energia";
    setCriterio(padrao);
    /*
     * Quantidade de partida: 100 g, que é como as perguntas chegam ("100 g de
     * frango equivalem a quantos ovos?"). As medidas caseiras ficam nos botões
     * logo abaixo do campo, para quem pensa em conchas e fatias.
     */
    setTexto("100");
    trackEvent("food_swap_source_selected", { food_group_source: grupo ?? "nenhum", placement });
  }

  const gramas = leGramas(texto);
  const resultado = useMemo(
    () => (origem && gramas !== null ? trocas(origem, gramas, criterio, porSlug) : null),
    [origem, gramas, criterio, porSlug],
  );
  const direto = useMemo(
    () => (origem && destino && gramas !== null ? trocaDireta(origem, gramas, destino, criterio) : null),
    [origem, destino, gramas, criterio],
  );

  /* Um evento por combinação de alimento + critério, não por tecla. */
  const ultimo = useRef("");
  useEffect(() => {
    if (!resultado || !origem) return;
    const chave = `${origem.slug}|${criterio}`;
    if (ultimo.current === chave) return;
    ultimo.current = chave;
    trackEvent("food_swap_results_generated", {
      criterion: criterio,
      food_group_source: resultado.grupo ?? "nenhum",
      result_count: resultado.trocas.length,
      refused: resultado.recusa ?? "nao",
    });
  }, [resultado, origem, criterio]);

  const visiveis = resultado ? (verTodas ? resultado.trocas : resultado.trocas.slice(0, VISIVEIS)) : [];
  const nc = nomeCriterio(criterio);

  return (
    <div className="border border-white/15 p-5 sm:p-8" style={{ background: "#0d0d0d" }}>
      <div className="grid gap-6 sm:grid-cols-[1fr_160px]">
        <Busca
          id="troca-origem"
          rotulo="O que você quer trocar?"
          placeholder="ex.: arroz, frango, pão"
          indice={indice}
          porSlug={porSlug}
          escolhido={origem}
          onEscolhe={(a) => escolheOrigem(a)}
        />
        <div>
          <label htmlFor="troca-gramas" className="block text-gray-300 text-sm font-medium mb-2">Quantidade (g)</label>
          <input
            id="troca-gramas"
            type="text"
            inputMode="decimal"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            aria-invalid={texto !== "" && gramas === null}
            className="w-full bg-black border border-white/25 focus:border-[#BA9E50] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] text-white px-4 py-3 min-h-[52px] tabular-nums"
          />
        </div>
      </div>

      {origem?.porcoes && origem.porcoes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Medidas caseiras">
          {origem.porcoes
            .filter((p) => !/porcao|metade|lata/.test(p.n))
            .map((p) => (
              <button
                key={p.n}
                type="button"
                onClick={() => setTexto(String(p.g))}
                className="border border-white/20 text-gray-300 text-xs px-3 py-2 min-h-[36px] hover:border-white/50"
              >
                {p.n.replace("colher de arroz ou servir", "colher de servir").replace("pedaco", "pedaço").replace("requeijao", "requeijão").replace("medio", "médio")} ({gr(p.g)} g)
              </button>
            ))}
        </div>
      )}

      <fieldset className="mt-6">
        <legend className="text-gray-300 text-sm font-medium mb-3">O que você quer manter parecido?</legend>
        <div className="grid grid-cols-3 gap-2">
          {CRITERIOS.map((c) => {
            const ativo = c.id === criterio;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => { setCriterio(c.id); setVerTodas(false); trackEvent("food_swap_criterion_selected", { criterion: c.id }); }}
                className={`min-h-[52px] px-2 border text-sm font-medium transition-colors ${ativo ? "text-black" : "border-white/25 text-gray-200 hover:border-white/50"}`}
                style={ativo ? { background: OURO, borderColor: OURO } : undefined}
              >
                {c.nome}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div ref={resultadoRef} aria-live="polite" className="mt-8">
        {!origem && <p className="text-gray-400 text-sm">Escolha um alimento para ver as trocas.</p>}
        {origem && gramas === null && <p className="text-gray-400 text-sm">Informe a quantidade em gramas (de 1 a 5.000).</p>}

        {resultado && (
          <>
            <p className="text-gray-300 leading-relaxed mb-5">
              <strong className="text-white">{gr(resultado.gramas)} g de {nomeNatural(origem!.nome).toLowerCase()}</strong>
              {resultado.alvo !== null && resultado.recusa !== "origem-sem-dado" ? (
                <> fornecem cerca de <strong style={{ color: OURO }}>{fmt(criterio, resultado.alvo)}</strong> de {nc.curto}.</>
              ) : (
                "."
              )}
            </p>

            {resultado.recusa ? (
              <p className="text-gray-300 border-l-2 pl-4 mb-6" style={{ borderColor: OURO }}>{TEXTO_RECUSA[resultado.recusa]}</p>
            ) : resultado.trocas.length === 0 ? (
              <p className="text-gray-300 border-l-2 pl-4 mb-6" style={{ borderColor: OURO }}>
                Não encontramos troca prática no mesmo grupo para essa quantidade. Tente outra quantidade ou escolha um alimento específico abaixo.
              </p>
            ) : (
              <>
                <h3 className="text-white font-semibold mb-3">Trocas equivalentes em {nc.curto}</h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {visiveis.map((t) => (
                    <CartaoTroca key={t.alimento.slug} t={t} criterio={criterio} linkavel={linkaveis.has(t.alimento.slug)} />
                  ))}
                </ul>
                {resultado.trocas.length > VISIVEIS && !verTodas && (
                  <button
                    type="button"
                    onClick={() => { setVerTodas(true); trackEvent("food_swap_more_results", { criterion: criterio }); }}
                    className="mt-4 border border-white/25 text-gray-200 px-5 py-3 min-h-[48px] text-sm hover:border-white/50"
                  >
                    Ver mais {resultado.trocas.length - VISIVEIS} opções
                  </button>
                )}
              </>
            )}

            <div className="mt-8 border-t border-white/10 pt-6">
              {!especifico ? (
                <button
                  type="button"
                  onClick={() => setEspecifico(true)}
                  className="text-sm underline underline-offset-4 decoration-white/30 text-gray-300 hover:text-white"
                >
                  Quero trocar por um alimento específico
                </button>
              ) : (
                <>
                  <Busca
                    id="troca-destino"
                    rotulo="Trocar por qual alimento?"
                    placeholder="ex.: batata-doce, ovo, couve-flor"
                    indice={indice}
                    porSlug={porSlug}
                    escolhido={destino}
                    onEscolhe={(a) => { setDestino(a); if (a) trackEvent("food_swap_direct_comparison", { criterion: criterio }); }}
                  />
                  {direto && destino && (
                    <div className="mt-5">
                      {direto.troca ? (
                        <>
                          <p className="text-gray-300 mb-4">
                            {gr(resultado.gramas)} g de {nomeNatural(origem!.nome).toLowerCase()} ≈{" "}
                            <strong className="text-white">{direto.troca.gramas} g de {nomeNatural(destino.nome).toLowerCase()}</strong>
                            {direto.troca.medida ? ` (≈ ${direto.troca.medida.texto})` : ""}, em {nc.curto}.
                          </p>
                          <Comparacao
                            a={{ nome: origem!.nome, gramas: resultado.gramas, m: resultado.macrosOrigem }}
                            b={{ nome: destino.nome, gramas: direto.troca.gramas, m: direto.troca.macros }}
                            criterio={criterio}
                          />
                          {direto.troca.avisos.length > 0 && <p className="text-gray-400 text-sm mt-3">{direto.troca.avisos.join(" ")}</p>}
                          {direto.motivo && <p className="text-gray-400 text-sm mt-3">{TEXTO_RECUSA[direto.motivo]}</p>}
                        </>
                      ) : (
                        <>
                          <p className="text-gray-300 border-l-2 pl-4 mb-4" style={{ borderColor: OURO }}>{TEXTO_RECUSA[direto.motivo!]}</p>
                          {direto.pesoPorPeso && direto.motivo === "destino-nao-e-fonte" && (
                            <>
                              <p className="text-gray-300 mb-3">
                                Trocando peso por peso ({gr(resultado.gramas)} g de cada):
                              </p>
                              <Comparacao
                                a={{ nome: origem!.nome, gramas: resultado.gramas, m: resultado.macrosOrigem }}
                                b={{ nome: destino.nome, gramas: resultado.gramas, m: macrosDe(destino, resultado.gramas) }}
                                criterio={criterio}
                              />
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            <p className="text-gray-500 text-xs mt-8 leading-relaxed">{AVISO_GERAL}</p>

            <div className="mt-8 border border-white/15 p-5">
              <p className="text-gray-200 mb-4">Quer montar refeições inteiras com alimentos de que você gosta, já com as porções?</p>
              <Link
                href="/ferramentas/monte-seu-cardapio"
                onClick={() => trackEvent("food_swap_fitchef_clicked", { criterion: criterio })}
                className="inline-flex items-center min-h-[48px] px-6 font-semibold text-black"
                style={{ background: OURO }}
              >
                Montar meu cardápio →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Comparacao({
  a,
  b,
  criterio,
}: {
  a: { nome: string; gramas: number; m: Macros };
  b: { nome: string; gramas: number; m: Macros };
  criterio: Criterio;
}) {
  const linhas: [keyof Macros, string, boolean][] = [
    ["carboidrato", "Carboidratos", false],
    ["proteina", "Proteína", false],
    ["lipideos", "Gordura", false],
    ["energia", "Calorias", true],
    ["fibra", "Fibras", false],
  ];
  const th = "text-left text-gray-400 font-medium py-2 pr-3";
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <caption className="sr-only">Comparação entre o alimento original e o substituto</caption>
        <thead>
          <tr className="border-b border-white/20">
            <th scope="col" className={th}></th>
            <th scope="col" className={th}>{nomeNatural(a.nome)} · {gr(a.gramas)} g</th>
            <th scope="col" className="text-left text-gray-400 font-medium py-2">{nomeNatural(b.nome)} · {gr(b.gramas)} g</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map(([id, rotulo, kcal]) => {
            const destaque = id === criterio;
            const f = (v: number | null) => (kcal ? kc(v) : g1(v));
            return (
              <tr key={id} className="border-b border-white/10">
                <th scope="row" className={`text-left py-2 pr-3 font-medium ${destaque ? "" : "text-gray-400"}`} style={destaque ? { color: OURO } : undefined}>
                  {rotulo}{destaque ? " ✓" : ""}
                </th>
                <td className={`py-2 pr-3 tabular-nums ${destaque ? "text-white font-semibold" : "text-gray-300"}`}>{f(a.m[id])}</td>
                <td className={`py-2 tabular-nums ${destaque ? "text-white font-semibold" : "text-gray-300"}`}>{f(b.m[id])}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
