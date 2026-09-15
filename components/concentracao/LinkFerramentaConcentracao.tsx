"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Convite contextual para o conversor de mg/mL e seringa U-100.
 *
 * Vai no fim dos artigos de quem já está usando: essa pessoa comprou o
 * frasco, tem uma seringa de insulina na mão e olha para uma régua de 100
 * marcas sem saber o que cada uma vale. É a confusão que mais produz erro
 * de medida, e ela não se resolve no meio de um texto sobre treino.
 *
 * O texto é deliberadamente contido. Ele NÃO promete ensinar a preparar o
 * frasco, escolher diluente ou decidir quantidade — a ferramenta não faz
 * nada disso, e prometer o que não se entrega, num assunto de injetável, é
 * pior do que não convidar.
 */
export default function LinkFerramentaConcentracao({ slug }: { slug: string }) {
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">
        Comprou o frasco e ficou na dúvida do que cada marca da seringa significa?
      </p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        A ferramenta separa três coisas que se confundem: mg é a substância,
        mL é o líquido e mg/mL é quanto de substância existe em cada mL. Ela
        mostra quanto volume cada marca de uma seringa U-100 representa e
        quanta substância cabe ali. Não ensina a preparar o frasco nem diz
        quanto usar: isso é com quem prescreveu.
      </p>
      <Link
        href="/ferramentas/conversor-mg-ml-u100"
        onClick={() => trackEvent("concentration_article_click", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Entender a escala da seringa →
      </Link>
    </div>
  );
}
