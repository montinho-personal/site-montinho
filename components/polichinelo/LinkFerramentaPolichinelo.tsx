"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Convite para a Calculadora de Polichinelos nos artigos do tema.
 *
 * LINK, NUNCA EMBED
 *
 * Os artigos respondem "vale a pena?" e "quanto queima?" em prosa. Uma
 * calculadora no meio do texto trocaria a resposta por um formulário — e o
 * `polichinelo-emagrece` é a página de maior impressão do cluster, não é
 * lugar de experimento.
 *
 * O link em si é obrigatório, e o motivo está em lib/ferramentas/canonica.ts:
 * ferramenta sem caminho de link saindo dos artigos que já têm autoridade
 * não ranqueia nem pelo próprio nome. A âncora carrega o termo de busca de
 * propósito — é ela que diz ao Google o que existe do outro lado.
 *
 * DUAS POSIÇÕES
 *
 * "topo" entra logo depois da primeira seção, onde o artigo acabou de dar a
 * conta para 70 kg: é o momento em que a pessoa quer a conta dela. "fim" é o
 * convite original, no fim do texto. Cada um manda um placement diferente
 * para o GA4, e é assim que dá para saber qual deles leva mais gente à
 * ferramenta. O do fim manteve o nome antigo (`link-<slug>`) para não quebrar
 * a série que já existia.
 */
export default function LinkFerramentaPolichinelo({
  slug,
  posicao = "fim",
}: {
  slug: string;
  posicao?: "topo" | "fim";
}) {
  const placement = posicao === "topo" ? `topo-${slug}` : `link-${slug}`;
  const ancora = (
    <Link
      href="/ferramentas/calculadora-polichinelos"
      onClick={() => trackEvent("jumping_jack_tool_click", { placement })}
      className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
      style={{ textDecorationColor: "#BA9E50" }}
    >
      Abrir a Calculadora de Polichinelos →
    </Link>
  );

  if (posicao === "topo") {
    return (
      <div className="border-l-2 border-[#BA9E50] bg-white/[0.03] px-4 py-3 sm:px-5">
        <p className="text-gray-300 text-sm leading-relaxed">
          <strong className="text-white">Esses números são para 70 kg.</strong> Com o seu peso e o seu ritmo a
          conta muda — a calculadora mostra quantas calorias os seus polichinelos gastam, quantos fazer para uma
          meta e quanto equivalem em caminhada.
        </p>
        {ancora}
      </div>
    );
  }

  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">
        Quantos polichinelos, para o seu peso?
      </p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        A conta muda bastante de pessoa para pessoa. Informe seu peso e seu ritmo para ver o gasto estimado, o
        tempo que leva e quantos polichinelos equivalem à sua caminhada.
      </p>
      {ancora}
    </div>
  );
}
