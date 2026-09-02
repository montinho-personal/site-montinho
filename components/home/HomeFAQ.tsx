import FAQ from "@/components/ui/FAQ";

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
  return (
    <section className="py-20 bg-black border-t border-white/10" id="faq">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-white text-3xl font-bold mb-2 text-center"
          style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
        >
          Perguntas Frequentes
        </h2>
        <p className="text-gray-300 text-center text-sm mb-12">
          Dúvidas comuns sobre personal trainer e acompanhamento
        </p>

        <FAQ itens={faqs} placement="home" />
      </div>
    </section>
  );
}
