"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Link contextual para o quiz "Treino para minha rotina" nas páginas de SEO
 * local. Quem procura personal ou academia na região quase sempre esbarra na
 * mesma dúvida antes de contratar ("3 ou 5 vezes por semana?", "quanto tempo
 * por dia?") — é a pergunta que o PAA dessas buscas repete, e o quiz responde
 * com uma divisão de treino para os dias e o tempo que a pessoa tem.
 *
 * Nas páginas de ACADEMIA a pergunta é outra ("qual academia escolher?"), e o
 * cartão aponta para o quiz de academia ideal.
 */
export default function LinkFerramentaRotina({ slug, tipo = "personal" }: { slug: string; tipo?: "personal" | "academia" }) {
  if (tipo === "academia") {
    return (
      <div className="mt-12 border border-white/15 p-5 sm:p-6">
        <p className="text-white font-semibold mb-1.5">Qual academia da região combina com você?</p>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">
          Responda o que importa para você — preço, horário, estrutura, lotação, localização — e veja as academias de Alphaville e região que mais combinam com o seu perfil.
        </p>
        <Link
          href="/academia-ideal-alphaville"
          onClick={() => trackEvent("rotina_local_click", { placement: `academia-ideal-${slug}` })}
          className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
          style={{ textDecorationColor: "#BA9E50" }}
        >
          Descobrir minha academia →
        </Link>
      </div>
    );
  }
  const titulo = "Antes de contratar: quantos treinos por semana cabem na sua rotina?";
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">{titulo}</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        Diga quantos dias e quanto tempo você tem e veja a divisão de treino que faz sentido — 3, 4 ou 5 vezes por semana, com o porquê.
      </p>
      <Link
        href="/treino-para-minha-rotina"
        onClick={() => trackEvent("rotina_local_click", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Descobrir meu treino →
      </Link>
    </div>
  );
}
