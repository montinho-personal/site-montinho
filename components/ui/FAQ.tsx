"use client";

import { trackEvent } from "@/lib/analytics";

/**
 * O FAQ do site inteiro. Um só.
 *
 * POR QUE details/summary, E NÃO useState
 *
 * Um acordeão de useState desmonta a resposta enquanto está fechado. Como
 * o padrão nasce fechado, a resposta NUNCA entra no HTML que o Google
 * recebe — ela existe só no JSON-LD. Era exatamente o que acontecia em
 * /faq e na home: pergunta visível, resposta em lugar nenhum.
 *
 * `details` resolve isso de graça: o navegador esconde a resposta, mas ela
 * está no HTML desde o primeiro byte. O Google indexa conteúdo em seção
 * recolhida normalmente. De quebra funciona sem JavaScript, o teclado já
 * sabe operar, e o leitor de tela anuncia o estado sozinho.
 *
 * A REGRA
 *
 * Toda pergunta e resposta do site passa por aqui. Se aparecer FAQ montado
 * à mão em alguma página, scripts/faq-test.ts reprova.
 */

export interface ItemFAQ {
  question: string;
  answer: string;
}

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

interface Props {
  itens: ItemFAQ[];
  /** De onde veio a abertura, para a medição. Ex.: "personal-trainer-tambore". */
  placement: string;
  className?: string;
}

export default function FAQ({ itens, placement, className = "" }: Props) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {itens.map((item) => (
        <details
          key={item.question}
          className="group border border-white/12 bg-white/[0.02] rounded-xl open:border-[#BA9E50]/40 open:bg-white/[0.04] transition-colors"
          onToggle={(e) => {
            /*
             * Só a abertura interessa. A pergunta vai no parâmetro porque é
             * conteúdo editorial nosso, não dado de quem leu — saber qual
             * dúvida abre mais muda o que a página responde primeiro.
             */
            if ((e.currentTarget as HTMLDetailsElement).open) {
              trackEvent("faq_open", { placement, pergunta: item.question });
            }
          }}
        >
          <summary
            className="cursor-pointer list-none flex items-start justify-between gap-4 px-5 sm:px-6 py-4 min-h-[56px] text-white font-semibold text-[15px] sm:text-base leading-snug rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#BA9E50]"
            style={h}
          >
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="shrink-0 mt-0.5 text-[#BA9E50] text-2xl leading-none transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="px-5 sm:px-6 pb-5">
            <p className="text-gray-300 leading-relaxed text-[15px]">{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
