"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Link contextual para a Calculadora de Volume.
 *
 * Vai nos artigos de treino por grupo muscular. Lá a pergunta é "quais
 * exercícios eu faço para peito"; a ferramenta responde outra — "quanto do
 * meu treino inteiro vai para cada músculo" — e é a pergunta natural de
 * quem acabou de ler.
 */
export default function LinkFerramentaVolume({ slug }: { slug: string }) {
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">Seu treino está bem distribuído?</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        Monte sua semana e veja quantas séries semanais cada grupo muscular
        está recebendo de verdade — e onde o volume está concentrado.
      </p>
      <Link
        href="/ferramentas/calculadora-volume-treino"
        onClick={() => trackEvent("training_volume_article_click", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Analisar meu treino →
      </Link>
    </div>
  );
}
