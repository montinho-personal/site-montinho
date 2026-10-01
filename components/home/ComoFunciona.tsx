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
    title: "Estratégia Individual",
    description:
      "Com base na sua rotina, no seu histórico e no seu objetivo, monto o treino e o ponto de partida. Tudo organizado no aplicativo, com vídeos de execução de cada exercício.",
  },
  {
    number: "03",
    title: "Ajustes na Prática",
    description:
      "Não desapareço depois que monto o treino. Sua rotina mudou, seu desempenho caiu ou você está evoluindo mais rápido que o previsto: eu vejo isso e ajusto o treino com você.",
  },
  {
    number: "04",
    title: "Evolução que Continua",
    description:
      "O treino evolui junto com você: mais força, mais disposição e um corpo que muda porque a rotina se manteve, e não porque durou 30 dias.",
  },
];

export default function ComoFunciona() {
  return (
    <section className="py-20 bg-black border-t border-white/10" id="como-funciona">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Title */}
          <div>
            <SectionTitle
              eyebrow="Como funciona"
              title="Do primeiro contato a uma rotina que você consegue manter"
              subtitle="Cada etapa tem alguém olhando para o seu caso, e não só a primeira."
              align="left"
            />
          </div>

          {/* Right: Steps */}
          <ol className="flex flex-col gap-0 list-none p-0 m-0">
            {steps.map((step, index) => (
              <li
                key={index}
                className="flex gap-6 py-8 border-b border-white/10 last:border-0 group"
              >
                <div className="flex-shrink-0">
                  <span
                    className="text-4xl font-bold transition-colors duration-300 leading-none group-hover:!text-[#BA9E50]"
                    style={{
                      fontFamily: "var(--font-titulo), Georgia, serif",
                      // 3,80:1 sobre preto. Número de passo é sequência, não
                      // enfeite — e em texto grande o critério AA é 3:1.
                      color: "rgba(186, 158, 80, 0.65)",
                    }}
                  >
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3
                    className="text-white text-lg font-semibold mb-2"
                    style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
