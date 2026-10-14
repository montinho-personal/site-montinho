"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { PONTE, guarda } from "@/lib/ferramentas/ponte";

/**
 * Leva um alimento já escolhido para a Troca Certa, pelo mesmo mecanismo do
 * LinkComparar: a gravação acontece no clique, em sessionStorage, e a
 * calculadora consome ao abrir. Nada vai para a URL.
 */
export default function LinkTroca({
  slug,
  children,
  className,
  placement,
}: {
  slug: string;
  children: React.ReactNode;
  className?: string;
  placement: string;
}) {
  return (
    <Link
      href="/ferramentas/substituicao-de-alimentos"
      onClick={() => {
        guarda(PONTE.troca, slug);
        trackEvent("food_swap_open", { placement });
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
