"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * A saída da tabela nutricional para as calculadoras.
 *
 * A tabela responde o que TEM no alimento; a meta do dia é outra conta. Este
 * é o par de links que faz essa travessia, e ele é medido porque é o ponto
 * em que a pessoa sai de consulta e entra em jornada.
 *
 * Client component só por causa do clique: são âncoras comuns, funcionam
 * sem JavaScript.
 */

const botao =
  "border border-white/25 text-gray-200 px-6 py-3.5 text-[15px] font-medium min-h-[52px] flex items-center hover:border-white/50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA9E50]";

export default function LinksCalculadoras({ placement }: { placement: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/ferramentas/calculadora-de-proteina"
        onClick={() => trackEvent("food_protein_calculator_click", { placement })}
        className={botao}
      >
        Calculadora de proteína
      </Link>
      <Link
        href="/ferramentas/calculadora-macros"
        onClick={() => trackEvent("food_macros_click", { placement })}
        className={botao}
      >
        Calculadora de macros
      </Link>
    </div>
  );
}
