import Link from "next/link";
import SectionTitle from "@/components/ui/SectionTitle";

const resultados = [
  {
    name: "Carlos M.",
    result: "−22kg em 6 meses",
    description: "Perdeu peso de forma sustentável, sem passar fome, mantendo a massa muscular.",
  },
  {
    name: "Fernanda S.",
    result: "−15kg em 4 meses",
    description: "Transformou o corpo após a gravidez com treino adaptado à sua rotina de mãe.",
  },
  {
    name: "Ricardo A.",
    result: "+8kg de massa magra",
    description: "Ganhou músculos com saúde, corrigindo anos de treino errado e lesões recorrentes.",
  },
];

export default function Resultados() {
  return (
    <section className="py-24 bg-black border-t border-white/10" id="resultados">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionTitle
            eyebrow="Resultados"
            title="Transformações reais de pessoas reais"
            subtitle="Não são casos isolados. São histórias de pessoas que decidiram mudar e foram acompanhadas de perto nesse processo."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {resultados.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 p-6 hover:border-white/30 transition-colors duration-300 group"
            >
              {/* Placeholder image */}
              <div className="aspect-[4/3] bg-gray-900 mb-5 overflow-hidden">
                <img
                  src={`https://placehold.co/400x300/1a1a1a/333333?text=Antes+%26+Depois`}
                  alt={`Resultado de ${item.name}`}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                />
              </div>

              <div className="flex items-start justify-between mb-3">
                <p className="text-gray-300 font-medium text-sm">{item.name}</p>
                <span
                  className="text-white font-bold text-sm"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {item.result}
                </span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/resultados"
            className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 text-sm font-medium hover:border-white hover:bg-white/5 transition-all duration-200"
          >
            Ver todos os resultados
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
