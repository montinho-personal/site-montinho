"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  CATEGORIAS,
  EXEMPLOS_BUSCA,
  FERRAMENTAS_NO_AR,
  MAIS_USADAS,
  MOSTRAR_POR_CATEGORIA,
  daCategoria,
  porId,
  type CategoriaId,
  type FerramentaCatalogo,
} from "@/lib/ferramentas/catalogo";
import { buscaFerramentas } from "@/lib/ferramentas/busca";
import CardFerramenta from "./CardFerramenta";
import IconeFerramenta, { IconeLupa } from "./IconeFerramenta";

/**
 * A parte viva da central: busca, filtros, mais usadas e o catálogo por
 * categoria.
 *
 * TUDO ESTÁ NO HTML, SEMPRE
 *
 * Buscar e filtrar mudam o que se VÊ, não o que existe. Toda ferramenta é
 * renderizada no servidor e continua no DOM com `hidden` quando não cabe
 * no filtro; a categoria grande mostra as primeiras e esconde o resto
 * atrás de "ver todas", sem tirá-las da página. É o que faz o Google achar
 * os trinta e cinco links sem executar JavaScript — e o que faz a página
 * funcionar sem ele.
 *
 * UMA DECISÃO POR VEZ
 *
 * Quem chega vê a busca, seis filtros e seis ferramentas. As trinta e
 * cinco só aparecem por categoria, em grupos de até oito. Hick-Hyman não é
 * sobre esconder opção: é sobre não pedir para escolher entre trinta e
 * cinco coisas iguais de uma vez.
 */

type Filtro = CategoriaId | "todos";

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const foco = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA9E50] focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const chip = (ativo: boolean) =>
  `shrink-0 snap-start min-h-[44px] px-4 py-2 border text-sm font-semibold transition-colors ${foco} ${
    ativo ? "border-[#BA9E50] bg-[#BA9E50]/[0.10] text-white" : "border-white/20 text-gray-300 hover:border-white/45 hover:text-white"
  }`;
const grade = "grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3";
const H2 = ({ children, id }: { children: ReactNode; id?: string }) => (
  <h2 id={id} className="text-white font-bold text-xl sm:text-2xl leading-tight scroll-mt-24" style={h}>
    {children}
  </h2>
);

export default function CentralFerramentas({ caminhoGuiado }: { caminhoGuiado: ReactNode }) {
  const [texto, setTexto] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [expandidas, setExpandidas] = useState<Set<CategoriaId>>(() => new Set());
  const idBase = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const medida = useRef<string>("");

  const busca = useMemo(() => buscaFerramentas(texto), [texto]);
  const buscando = busca.termos.length > 0;
  const semResultado = buscando && busca.resultados.length === 0;

  /*
   * A busca é medida quando a pessoa PARA de digitar, uma vez por consulta.
   * Medir a cada tecla mandaria "c", "cr", "cre"… e não diria nada. O termo
   * sem resultado vai num evento próprio: é a lista de ferramentas que
   * ainda não existem.
   */
  useEffect(() => {
    if (!buscando || busca.consulta === medida.current) return;
    const t = setTimeout(() => {
      medida.current = busca.consulta;
      const query = busca.consulta.slice(0, 80);
      trackEvent("tools_hub_search", { query, results_count: busca.resultados.length });
      if (busca.resultados.length === 0) trackEvent("tools_no_results", { query });
    }, 700);
    return () => clearTimeout(t);
  }, [busca, buscando]);

  const mudaFiltro = (f: Filtro) => {
    setFiltro(f);
    trackEvent("tools_hub_filter", { category: f });
  };

  const expande = (c: CategoriaId) => {
    setExpandidas((s) => new Set(s).add(c));
    trackEvent("tools_hub_expand", { category: c });
  };

  const maisUsadas = MAIS_USADAS.map(porId).filter((f): f is FerramentaCatalogo => f !== null);
  const idBusca = `${idBase}-busca`;
  const idStatus = `${idBase}-status`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Busca ── */}
      <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-3xl mx-auto">
        <label htmlFor={idBusca} className="sr-only">
          Busque uma dúvida ou ferramenta
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <IconeLupa />
          </span>
          <input
            ref={inputRef}
            id={idBusca}
            type="search"
            inputMode="search"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            placeholder="O que você quer descobrir?"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setTexto("");
            }}
            aria-describedby={idStatus}
            className={`w-full bg-black border border-white/30 focus:border-[#BA9E50] text-white text-lg sm:text-xl px-12 py-4 min-h-[60px] outline-none transition-colors placeholder:text-gray-500 [&::-webkit-search-cancel-button]:hidden`}
          />
          {texto && (
            <button
              type="button"
              onClick={() => {
                setTexto("");
                inputRef.current?.focus();
              }}
              aria-label="Limpar busca"
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 text-gray-400 hover:text-white text-2xl leading-none ${foco}`}
            >
              ×
            </button>
          )}
        </div>
        <p className="text-gray-500 text-sm mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>Exemplos:</span>
          {EXEMPLOS_BUSCA.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setTexto(ex);
                inputRef.current?.focus();
              }}
              className={`text-gray-300 hover:text-white underline underline-offset-4 decoration-white/30 min-h-[32px] px-1 ${foco}`}
            >
              {ex}
            </button>
          ))}
        </p>
      </form>

      {/* ── Filtros ── */}
      <div className="mt-6" role="group" aria-label="Filtrar por categoria">
        <div className="flex gap-2 overflow-x-auto snap-x -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap pb-1 [scrollbar-width:thin]">
          <button type="button" aria-pressed={filtro === "todos"} className={chip(filtro === "todos")} onClick={() => mudaFiltro("todos")}>
            Todos
          </button>
          {CATEGORIAS.map((c) => (
            <button key={c.id} type="button" aria-pressed={filtro === c.id} className={chip(filtro === c.id)} onClick={() => mudaFiltro(c.id)}>
              {c.chip}
            </button>
          ))}
        </div>
      </div>

      {/* Estado da busca para leitor de tela e para quem enxerga. */}
      <p id={idStatus} className="sr-only" aria-live="polite">
        {buscando
          ? busca.resultados.length === 0
            ? `Nenhuma ferramenta exata para “${texto.trim()}”. Veja as relacionadas ou pergunte ao Montinho.`
            : `${busca.resultados.length} ${busca.resultados.length === 1 ? "ferramenta encontrada" : "ferramentas encontradas"} para “${texto.trim()}”.`
          : filtro === "todos"
            ? ""
            : `Mostrando só ${CATEGORIAS.find((c) => c.id === filtro)?.nome}.`}
      </p>

      {/* ── Caminho guiado: para quem não sabe o que buscar ── */}
      <div hidden={buscando} className="mt-8">
        {caminhoGuiado}
      </div>

      {/* ── Resultados da busca ── */}
      {buscando && (
        <section className="mt-10" aria-labelledby={`${idBase}-resultados`} data-testid="resultados-busca">
          {busca.resultados.length > 0 ? (
            <>
              <h2 id={`${idBase}-resultados`} className="text-white font-bold text-xl sm:text-2xl leading-tight" style={h}>
                {busca.resultados.length} {busca.resultados.length === 1 ? "ferramenta" : "ferramentas"} para “{texto.trim()}”
              </h2>
              <div className={`${grade} mt-5`}>
                {busca.resultados.map((f, i) => (
                  <CardFerramenta key={f.id} f={f} posicao={i + 1} secao="busca" />
                ))}
              </div>
            </>
          ) : (
            <div data-testid="sem-resultado">
              <h2 id={`${idBase}-resultados`} className="text-white font-bold text-xl sm:text-2xl leading-tight" style={h}>
                Não encontrei uma ferramenta exatamente para isso.
              </h2>
              <div className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.06] p-5 sm:p-6 mt-5 max-w-2xl">
                <p className="text-white font-semibold mb-1">Pergunte ao Montinho</p>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  Ele responde perguntas de treino, exercício, emagrecimento e alimentação buscando nos conteúdos do site, e mostra os artigos
                  que embasaram cada resposta.
                </p>
                <Link
                  href="/pergunte-ao-montinho"
                  onClick={() => trackEvent("ask_montinho_click", { placement: "ferramentas_hub", context: "no_results" })}
                  className={`inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-sm font-semibold min-h-[48px] hover:bg-gray-100 transition-colors ${foco}`}
                >
                  <IconeFerramenta id="chat" className="w-4 h-4" /> Fazer minha pergunta →
                </Link>
              </div>
              {busca.relacionadas.length > 0 && (
                <>
                  <h3 className="text-white font-semibold mt-8 mb-4">Talvez uma destas ajude</h3>
                  <div className={grade}>
                    {busca.relacionadas.map((f, i) => (
                      <CardFerramenta key={f.id} f={f} posicao={i + 1} secao="relacionadas" />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </section>
      )}

      {/* ── Mais usadas ── */}
      <section className="mt-12" aria-labelledby={`${idBase}-usadas`} hidden={buscando || filtro !== "todos"} data-testid="mais-usadas">
        <H2 id={`${idBase}-usadas`}>Mais usadas</H2>
        <p className="text-gray-400 text-sm mt-1 mb-5">As que mais gente abre por aqui. Um bom começo se você não sabe qual escolher.</p>
        <div className={grade}>
          {maisUsadas.map((f, i) => (
            <CardFerramenta key={f.id} f={f} posicao={i + 1} secao="mais_usadas" destaque />
          ))}
        </div>
      </section>

      {/* ── Catálogo por categoria ── */}
      {CATEGORIAS.map((c) => {
        const todas = daCategoria(c.id);
        const aberta = expandidas.has(c.id) || filtro === c.id;
        const visiveis = aberta ? todas : todas.slice(0, MOSTRAR_POR_CATEGORIA);
        const escondidas = aberta ? [] : todas.slice(MOSTRAR_POR_CATEGORIA);
        const idTitulo = `${idBase}-${c.id}`;
        const idResto = `${idBase}-${c.id}-resto`;
        return (
          <section
            key={c.id}
            id={c.id}
            className={`mt-12 pt-10 border-t border-white/10 ${c.id === "alphaville" ? "scroll-mt-24" : ""}`}
            aria-labelledby={idTitulo}
            hidden={buscando || (filtro !== "todos" && filtro !== c.id)}
            data-testid={`categoria-${c.id}`}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <H2 id={idTitulo}>{c.nome}</H2>
              <span className="text-gray-500 text-sm">
                {todas.length} {todas.length === 1 ? "ferramenta" : "ferramentas"}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1 mb-5 max-w-2xl">{c.descricao}</p>
            {c.aviso && (
              <p className="text-gray-500 text-xs mb-5 max-w-2xl border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>
                {c.aviso}
              </p>
            )}
            <div className={grade}>
              {visiveis.map((f, i) => (
                <CardFerramenta key={f.id} f={f} posicao={i + 1} secao={c.id} />
              ))}
            </div>
            {todas.length > MOSTRAR_POR_CATEGORIA && (
              <>
                {/* As escondidas ficam no HTML: rastreáveis, e visíveis sem JavaScript. */}
                {!aberta && (
                  <div id={idResto} hidden className={`${grade} mt-3 sm:mt-4`}>
                    {escondidas.map((f, i) => (
                      <CardFerramenta key={f.id} f={f} posicao={MOSTRAR_POR_CATEGORIA + i + 1} secao={c.id} />
                    ))}
                  </div>
                )}
                {!aberta && (
                  <button
                    type="button"
                    aria-expanded={false}
                    aria-controls={idResto}
                    onClick={() => expande(c.id)}
                    className={`mt-5 inline-flex items-center gap-2 border border-white/25 text-white px-5 py-3 text-sm font-semibold min-h-[48px] hover:border-white/50 transition-colors ${foco}`}
                  >
                    Ver todas as {todas.length} ferramentas de {c.chip.toLowerCase()} ↓
                  </button>
                )}
              </>
            )}
          </section>
        );
      })}

      {/* ── Fallback: chegou ao fim e não achou ── */}
      <section className="mt-12 pt-10 border-t border-white/10" aria-labelledby={`${idBase}-pergunte`} hidden={buscando} data-testid="fallback-pergunte">
        <div className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8 relative">
          <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
          <h2 id={`${idBase}-pergunte`} className="text-white font-bold text-xl sm:text-2xl mb-2" style={h}>
            Não encontrou o que procurava?
          </h2>
          <p className="text-gray-300 leading-relaxed mb-5 max-w-2xl">
            Pergunte ao Montinho. Ele responde dúvidas de treino, exercício, emagrecimento e alimentação buscando nos conteúdos publicados
            no site, e mostra quais artigos embasaram cada resposta, para você conferir a fonte.
          </p>
          <Link
            href="/pergunte-ao-montinho"
            onClick={() => trackEvent("ask_montinho_click", { placement: "ferramentas_hub", context: "fallback" })}
            className={`inline-flex items-center gap-2 bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 transition-colors ${foco}`}
          >
            <IconeFerramenta id="chat" className="w-4 h-4" /> Fazer minha pergunta →
          </Link>
        </div>
      </section>
    </div>
  );
}
