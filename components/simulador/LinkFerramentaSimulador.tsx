"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/** Convite para o Simulador de Emagrecimento nos artigos que perguntam "quanto tempo, no meu caso?". */
export default function LinkFerramentaSimulador({ slug }: { slug: string }) {
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6" data-testid="link-simulador">
      <p className="text-white font-semibold mb-1.5">Quanto tempo até a sua meta — e o que mais mudaria isso?</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        O Simulador de Emagrecimento desenha sua trajetória estimada semana a semana e deixa você comparar treino, passos e consistência. Leva cerca de 1 minuto.
      </p>
      <Link
        href="/ferramentas/simulador-emagrecimento"
        onClick={() => trackEvent("simulator_internal_tool_click", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Abrir o Simulador de Emagrecimento →
      </Link>
    </div>
  );
}
