"use client";

import { useState } from "react";

const faqs = [
  {
    question: "O que é um personal trainer online?",
    answer:
      "Um personal trainer online cria seu programa de treino personalizado, acompanha sua evolução e ajusta o plano periodicamente — tudo à distância. Você treina na academia, em casa ou onde preferir, com o mesmo nível de personalização do presencial.",
  },
  {
    question: "Qual a diferença entre personal trainer online e presencial?",
    answer:
      "O presencial oferece supervisão direta a cada sessão — ideal para iniciantes e pessoas com histórico de lesões. O online oferece flexibilidade de horário e local com o mesmo nível de personalização. Para a maioria dos objetivos, os resultados são equivalentes.",
  },
  {
    question: "Quanto tempo leva para ver resultado com personal trainer?",
    answer:
      "Os primeiros resultados perceptíveis — mais disposição, melhor sono, composição corporal mudando — aparecem entre 3 e 6 semanas. Resultados expressivos no espelho e nos exames se consolidam entre 3 e 6 meses de treino consistente.",
  },
  {
    question: "Como funciona o atendimento em Alphaville?",
    answer:
      "O atendimento presencial acontece na região de Alphaville, em Barueri/Santana de Parnaíba. A consultoria online atende alunos em qualquer cidade do Brasil. O primeiro contato é gratuito e sem compromisso.",
  },
  {
    question: "Preciso de academia para fazer consultoria online?",
    answer:
      "Não necessariamente. O programa é montado de acordo com os equipamentos que você tem disponíveis — academia completa, sala de casa, condomínio ou apenas peso corporal. O treino é adaptado à sua realidade.",
  },
];

export default function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="py-20 bg-black border-t border-white/10" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-white text-3xl font-bold mb-2 text-center"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          Perguntas Frequentes
        </h2>
        <p className="text-gray-400 text-center text-sm mb-12">
          Dúvidas comuns sobre personal trainer e acompanhamento
        </p>

        <dl className="flex flex-col gap-0">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-white/10 last:border-0">
              <dt>
                <button
                  onClick={() => setOpen(open === index ? null : index)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left text-white font-medium text-base hover:text-gray-300 transition-colors"
                  aria-expanded={open === index}
                >
                  <span>{faq.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className={`flex-shrink-0 transition-transform duration-200 ${open === index ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </dt>
              {open === index && (
                <dd className="pb-5 text-gray-400 text-sm leading-relaxed">
                  {faq.answer}
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
