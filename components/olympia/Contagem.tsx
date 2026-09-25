"use client";

import { useAgora } from "./useAgora";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import {
  ATLETAS_BRASIL, BLOCOS, NOME_BLOCO, agendaTexto, alvo, categoria, fase, inicioBloco, resumoBrasil,
  type CategoriaOlympia, type IdBloco,
} from "@/lib/olympia-brasil";

/**
 * Contagem regressiva do Mr. Olympia 2026 — UM componente para os artigos de
 * categoria (`cat="212"`) e para o hub Brasil (`cat="brasil"`).
 *
 * - A agenda vem de lib/olympia-brasil.ts (ISO com fuso); o navegador só
 *   informa "agora". Nenhum fetch.
 * - O HTML do servidor já traz dia, horário e categoria em texto; o relógio
 *   é um enfeite útil por cima. Caixa com altura mínima fixa: sem CLS.
 * - Leitor de tela: os dígitos são aria-hidden; o texto estático diz o
 *   horário. Nada de aria-live no relógio.
 * - O timer só roda enquanto há contagem; por segundo, só no último dia.
 */


function falta(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return d > 0 ? `${d}d ${p(h)}h ${p(m)}min` : `${p(h)}h ${p(m)}min ${p(ss)}s`;
}

const caixa = "not-prose border border-[#BA9E50]/40 bg-[#BA9E50]/[0.05] p-4 sm:p-5 min-h-[178px]";
const rotulo = "text-[11px] font-bold tracking-[0.18em] uppercase text-[#BA9E50]";
const btn = "inline-block mt-3 px-4 py-2 text-sm font-semibold bg-[#BA9E50] text-black hover:bg-white transition-colors";
const lnk = "inline-block mt-3 ml-3 text-sm underline underline-offset-4 text-gray-300 hover:text-white";

export default function Contagem({ cat }: { cat: string }) {
  return cat === "brasil" ? <ContagemBrasil /> : <ContagemCategoria c={categoria(cat)} />;
}

function useView(escopo: string, estado: string | null) {
  const foi = useRef(false);
  useEffect(() => {
    if (!estado || foi.current) return;
    foi.current = true;
    trackEvent("olympia_countdown_view", { category: escopo, state: estado });
  }, [escopo, estado]);
}

function ContagemCategoria({ c }: { c: CategoriaOlympia }) {
  const agora = useAgora(1000);
  const f = agora === null ? null : fase(c, agora);
  const al = agora === null ? null : alvo(c, agora);
  useView(c.id, f);
  const hojeFinal = BLOCOS[c.final].texto.split(",")[0];
  const clicaResultado = () => trackEvent("olympia_live_result_click", { category: c.id, state: f ?? "ssr" });

  if (c.sessaoUnica) return <ContagemSessaoUnica c={c} f={f} agora={agora} clicaResultado={clicaResultado} />;

  return (
    <div className={caixa}>
      {/* Texto estático: é o que o Google e o leitor de tela leem. */}
      <p className="sr-only">{c.nome}: {agendaTexto(c)}</p>

      {f === null || f === "antes-previas" || f === "aguardando-final" ? (
        <>
          <p className={rotulo} aria-hidden="true">⏱️ {f === "aguardando-final" ? "Quanto falta para as finais?" : "Próximo evento"}</p>
          <p className="text-white font-semibold mt-1" aria-hidden="true">{f === "aguardando-final" ? `Final da ${c.nome} começa em` : `Prévias da ${c.nome} começam em`}</p>
          <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums mt-1" aria-hidden="true">
            {agora !== null && al ? falta(inicioBloco(al.bloco) - agora) : "—"}
          </p>
          <p className="text-sm text-gray-400 mt-1" aria-hidden="true">
            {f === "aguardando-final" ? `Sessão das finais a partir de ${BLOCOS[c.final].texto}.` : `Bloco das prévias a partir de ${BLOCOS[c.previas].texto}. A ordem das categorias dentro do bloco pode fazer o horário exato variar.`}
          </p>
          {f === "aguardando-final" ? (
            <a href="#como-foram-as-previas" className={lnk}>Ver como foram as prévias</a>
          ) : (
            <a href="#horario" className={lnk}>Ver programação</a>
          )}
        </>
      ) : f === "previas" ? (
        <>
          <p className={rotulo}>🔴 Prévias em andamento</p>
          <p className="text-white mt-1">O bloco das prévias já começou. Acompanhe esta página para atualizações.</p>
          <p className="text-sm text-gray-400 mt-2" aria-hidden="true">
            Final: <span className="tabular-nums text-white">{al && agora !== null ? falta(inicioBloco(al.bloco) - agora) : "—"}</span> para a sessão das finais ({BLOCOS[c.final].texto}).
          </p>
        </>
      ) : f === "final" ? (
        <>
          <p className={rotulo}>🔴 Finais em andamento</p>
          <p className="text-white mt-1">A sessão das finais começou ({hojeFinal}). O resultado oficial entra nesta página assim que for anunciado.</p>
          <Link href="/blog/quem-ganhou-mr-olympia-2026" className={lnk} onClick={clicaResultado}>Ver todos os campeões do Olympia</Link>
        </>
      ) : (
        <>
          <p className={rotulo}>✅ Competição encerrada</p>
          <p className="text-white mt-1">O resultado oficial da {c.nome} já saiu.</p>
          <a href="#resultado" className={btn} onClick={clicaResultado}>Ver resultado completo</a>
          <Link href="/blog/brasileiros-mr-olympia-2026" className={lnk}>Ver todos os brasileiros</Link>
        </>
      )}
    </div>
  );
}

const nomes = (cs: CategoriaOlympia[]) => cs.map((c) => c.nome.replace(" (Mr. Olympia)", "")).join(" / ");

function ContagemBrasil() {
  const agora = useAgora(1000);
  const r = agora === null ? null : resumoBrasil(agora);
  useView("brasil", r ? (r.proximo?.bloco ?? "fim") : null);
  const prox: IdBloco | null = r ? (r.proximo?.bloco ?? null) : "sextaPrevias";

  const linha = "grid grid-cols-[7.5rem_1fr] gap-2 py-1.5 border-b border-white/10 text-sm";
  return (
    <div className={caixa}>
      {/* AGORA / PRÓXIMO / FINALIZADO: blocos pelo relógio, categorias encerradas só com resultado oficial. */}
      <dl className="mb-4">
        <div className={linha}><dt className="text-gray-400">🔴 Agora</dt><dd className="text-white">{r?.agora ? `${NOME_BLOCO[r.agora.bloco]} (bloco iniciado): ${nomes(r.agora.categorias)}` : "Nenhum bloco em andamento"}</dd></div>
        <div className={linha}><dt className="text-gray-400">⏱️ Próximo</dt><dd className="text-white">{r ? (r.proximo ? `${NOME_BLOCO[r.proximo.bloco]}: ${nomes(r.proximo.categorias)}` : "Não há próximo bloco") : "Prévias de sexta, 13h30 (Brasília)"}</dd></div>
        <div className={linha}><dt className="text-gray-400">✅ Finalizado</dt><dd className="text-white">{r?.finalizadas.length ? r.finalizadas.map((c) => (c.artigo ? <Link key={c.id} href={`/blog/${c.artigo}`} className="underline underline-offset-4 mr-2" onClick={() => trackEvent("olympia_live_result_click", { category: c.id })}>{c.nome}</Link> : <span key={c.id} className="mr-2">{c.nome}</span>)) : "Nenhuma categoria com resultado oficial ainda"}</dd></div>
      </dl>
      <p className="sr-only">Prévias de sexta a partir das 13h30 e finais a partir das 22h; prévias de sábado a partir das 13h30 e finais a partir das 23h, horário de Brasília.</p>
      {prox ? (
        <>
          <p className={rotulo} aria-hidden="true">🇧🇷 Próximos brasileiros no palco</p>
          <p className="text-white font-semibold mt-1" aria-hidden="true">
            {NOME_BLOCO[prox]}: {r?.proximo ? nomes(r.proximo.categorias) : "212 / Women's Physique / Classic / Wellness / Ms. Olympia"}
          </p>
          <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums mt-1" aria-hidden="true">
            {agora !== null ? falta(inicioBloco(prox) - agora) : "—"}
          </p>
          <p className="text-sm text-gray-400 mt-1" aria-hidden="true">Bloco a partir de {BLOCOS[prox].texto}. O horário exato de cada categoria depende da ordem no bloco.</p>
          <a href="#painel-brasil" className={lnk} onClick={() => trackEvent("olympia_hub_category_click", { target: "painel" })}>Ver brasileiros deste bloco</a>
        </>
      ) : (
        <>
          <p className={rotulo}>✅ Competição encerrada</p>
          <p className="text-white mt-1">Todos os blocos com brasileiros já aconteceram.</p>
          <a href="#resultados-brasileiros" className={btn}>Ver resultados dos brasileiros</a>
          <Link href="/blog/quem-ganhou-mr-olympia-2026" className={lnk}>Ver todos os campeões do Olympia</Link>
        </>
      )}
    </div>
  );
}

/**
 * Categoria com prévias e final na mesma sessão (Fit Model). O início do
 * bloco vira "bloco em andamento", nunca "categoria no palco": isso só com
 * `noPalco` confirmado. Encerrada mostra campeã e brasileira, se marcadas.
 */
function ContagemSessaoUnica({ c, f, agora, clicaResultado }: { c: CategoriaOlympia; f: ReturnType<typeof fase> | null; agora: number | null; clicaResultado: () => void }) {
  return (
    <div className={caixa}>
      <p className="sr-only">{c.nome}: {agendaTexto(c)}</p>
      {f === null || f === "antes-previas" ? (
        <>
          <p className={rotulo} aria-hidden="true">⏱️ {c.nome} Olympia</p>
          <p className="text-white font-semibold mt-1" aria-hidden="true">Prévias e final começam dentro de</p>
          <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums mt-1" aria-hidden="true">{agora !== null ? falta(inicioBloco(c.previas) - agora) : "—"}</p>
          <p className="text-sm text-gray-400 mt-1" aria-hidden="true">Bloco a partir de {BLOCOS[c.previas].texto}. O horário é o início do bloco oficial; o momento exato em que a {c.nome} sobe ao palco pode variar.</p>
          <a href="#horario" className={lnk}>Ver programação</a>
        </>
      ) : f === "bloco" ? (
        <>
          <p className={rotulo}>🔴 Bloco do Olympia em andamento</p>
          <p className="text-white mt-1">A {c.nome} está programada para esta sessão. Esta página será atualizada quando houver informações confirmadas.</p>
          <Link href="/blog/brasileiros-mr-olympia-2026" className={lnk}>Ver todos os brasileiros</Link>
        </>
      ) : f === "no-palco" ? (
        <>
          <p className={rotulo}>🔴 {c.nome} em andamento</p>
          <p className="text-white mt-1">A categoria está no palco. O resultado oficial entra nesta página assim que for anunciado.</p>
        </>
      ) : (
        <>
          <p className={rotulo}>✅ {c.nome} Olympia 2026 encerrada</p>
          {c.campeao && <p className="text-white mt-1">Campeã: <strong>{c.campeao}</strong></p>}
          {ATLETAS_BRASIL.filter((x) => x.categoria === c.id && x.resultado).map((x) => (
            <p key={x.nome} className="text-white">{x.nome}: <strong>{x.resultado}</strong></p>
          ))}
          <a href="#resultado" className={btn} onClick={clicaResultado}>Ver resultado completo</a>
          <Link href="/blog/quem-ganhou-mr-olympia-2026" className={lnk}>Ver todos os campeões do Olympia</Link>
        </>
      )}
    </div>
  );
}
