"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Convite para a Calculadora de Polichinelos, no fim dos artigos do tema.
 *
 * LINK, NUNCA EMBED
 *
 * Os dois artigos respondem "vale a pena?" e "quanto queima?" em prosa. Uma
 * calculadora no meio do texto trocaria a resposta por um formulário — e o
 * `polichinelo-emagrece` é a página com 7.319 impressões do cluster, não é
 * lugar de experimento.
 *
 * O link em si é obrigatório, e o motivo está em lib/ferramentas/canonica.ts:
 * ferramenta sem caminho de link saindo dos artigos que já têm autoridade
 * não ranqueia nem pelo próprio nome. A âncora carrega o termo de busca de
 * propósito — é ela que diz ao Google o que existe do outro lado.
 */
export default function LinkFerramentaPolichinelo({ slug }: { slug: string }) {
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">
        Quantos polichinelos, para o seu peso?
      </p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        A conta muda bastante de pessoa para pessoa. Informe seu peso e seu ritmo para ver o gasto estimado, o
        tempo que leva e quantos polichinelos equivalem à sua caminhada.
      </p>
      <Link
        href="/ferramentas/calculadora-polichinelos"
        onClick={() => trackEvent("jumping_jack_tool_click", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Abrir a Calculadora de Polichinelos →
      </Link>
    </div>
  );
}
