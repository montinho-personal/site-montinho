"use client";

import { trackEvent } from "@/lib/analytics";

/**
 * "Lista de substituição para imprimir" e "pdf" estão entre as buscas do
 * tema. Em vez de um PDF que envelhece separado dos dados, a própria página
 * imprime só a lista (o CSS de impressão esconde o resto), e quem quiser
 * PDF escolhe "Salvar como PDF" na janela de impressão.
 */
export default function BotaoImprimirLista() {
  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("food_swap_print", {});
        window.print();
      }}
      className="border border-white/25 text-gray-200 px-5 py-3 min-h-[48px] text-sm hover:border-white/50 print:hidden"
    >
      Imprimir ou salvar a lista em PDF
    </button>
  );
}
