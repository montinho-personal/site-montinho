import SectionTitle from "@/components/ui/SectionTitle";

const steps = [
  {
    number: "01",
    title: "Conversa Inicial e Anamnese Inteligente",
    description:
      "Começamos com uma conversa sem compromisso para entender sua história, objetivos e rotina. Em seguida, você preenche uma anamnese completa e inteligente, desenvolvida para identificar suas individualidades, limitações, preferências e fatores que influenciam diretamente seus resultados.",
  },
  {
    number: "02",
    title: "Planejamento Personalizado",
    description:
      "Com base na sua realidade, crio um plano completo: treino, orientação nutricional e estratégias práticas que cabem na sua vida.",
  },
  {
    number: "03",
    title: "Acompanhamento Contínuo",
    description:
      "Não desapareço depois que monto o plano. Estou presente, ajusto o que for necessário e te apoio em cada desafio do processo.",
  },
  {
    number: "04",
    title: "Evolução Real",
    description:
      "Resultados concretos e duradouros. Uma nova relação com seu corpo, mais energia, autoestima e saúde para anos à frente.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="py-24 bg-black border-t border-white/10" id="como-funciona">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Title */}
          <div>
            <SectionTitle
              eyebrow="Como funciona"
              title="Do primeiro contato à transformação real"
              subtitle="Um processo estruturado, personalizado e com acompanhamento humano em cada etapa."
              align="left"
            />
          </div>

          {/* Right: Steps */}
          <div className="flex flex-col gap-0">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex gap-6 py-8 border-b border-white/10 last:border-0 group"
              >
                <div className="flex-shrink-0">
                  <span
                    className="text-4xl font-bold text-white/10 group-hover:text-white/20 transition-colors duration-300 leading-none"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3
                    className="text-white text-lg font-semibold mb-2"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
