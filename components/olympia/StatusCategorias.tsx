"use client";

import { useAgora } from "./useAgora";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { BLOCOS, CATEGORIAS, fase, type Fase } from "@/lib/olympia-brasil";

/**
 * Painel curto de status das categorias, para o hub geral "Quem ganhou".
 * Uma lista, não um dashboard. O servidor já renderiza o horário da final
 * de cada categoria; o estado ao vivo entra depois de montar, sem mudar a
 * altura das linhas. Atualiza a cada minuto — status não precisa de segundo.
 */

const ICONE: Record<Fase, string> = {
  "antes-previas": "⏱️",
  previas: "🔴",
  "aguardando-final": "⏱️",
  final: "🔴",
  encerrada: "✅",
  bloco: "🔴",
  "no-palco": "🔴",
};
const TEXTO: Record<Fase, string> = {
  "antes-previas": "Programada",
  previas: "Bloco das prévias em andamento",
  "aguardando-final": "Aguardando a final",
  final: "Bloco das finais em andamento",
  encerrada: "Resultado definido",
  bloco: "Bloco em andamento",
  "no-palco": "Em andamento",
};
const quando = (id: keyof typeof BLOCOS) => BLOCOS[id].texto.split(",")[0].replace("-feira", "") + ", " + BLOCOS[id].texto.split(", ")[2].split(" de Brasília")[0];

export default function StatusCategorias() {
  const agora = useAgora(60000);

  return (
    <ul className="not-prose divide-y divide-white/10 border border-white/15 text-sm">
      {CATEGORIAS.map((c) => {
        const f = agora === null ? null : fase(c, agora);
        const linha = (
          <>
            <span className="text-white font-medium">{c.nome}</span>
            <span className="text-gray-300 text-right">
              {f ? `${ICONE[f]} ${f === "encerrada" && c.campeao ? c.campeao : TEXTO[f]}` : `${c.sessaoUnica ? "Prévias e final" : "Final"}: ${quando(c.final)}`}
            </span>
          </>
        );
        return (
          <li key={c.id}>
            {c.artigo ? (
              <Link href={`/blog/${c.artigo}`} className="flex justify-between gap-3 px-3 py-2.5 hover:bg-white/5" onClick={() => trackEvent("olympia_hub_category_click", { category: c.id, state: f ?? "ssr" })}>{linha}</Link>
            ) : (
              <div className="flex justify-between gap-3 px-3 py-2.5">{linha}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
