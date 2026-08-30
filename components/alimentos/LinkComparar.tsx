"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { PONTE, guarda } from "@/lib/ferramentas/ponte";

/**
 * Leva um alimento já escolhido para o comparador.
 *
 * Quem chegou até aqui já disse qual alimento tem na cabeça — na página do
 * alimento ou na busca da tabela. Abrir o comparador com os dois campos
 * vazios obriga essa pessoa a digitar de novo o que ela acabou de escolher,
 * e a segunda digitação é a que faz desistir.
 *
 * A gravação acontece no clique, nunca antes. É a regra 1 da ponte: nenhuma
 * ferramenta guarda nada porque a pessoa mexeu num campo — só porque ela
 * pediu para ir adiante.
 */
export default function LinkComparar({
  slug,
  children,
  className,
  evento = "food_compare_open",
}: {
  slug: string;
  children: React.ReactNode;
  className?: string;
  evento?: "food_compare_open";
}) {
  return (
    <Link
      href="/alimentos/comparar"
      onClick={() => {
        guarda(PONTE.alimento, slug);
        trackEvent(evento, { placement: "ponte-alimento" });
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
