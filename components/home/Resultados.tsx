import Link from "next/link";
import Image from "next/image";
import SectionTitle from "@/components/ui/SectionTitle";

const resultados = [
  {
    name: "Adriana N.",
    result: "−20kg em 8 meses",
    description: "Conquistou uma transformação consistente com treino periodizado, progressão de cargas e um acompanhamento individualizado.",
    photo: "/antes-depois-montinho-personal-trainer-2.jpg",
  },
  {
    name: "Montinho",
    result: "−40kg em 12 meses",
    description: "Minha transformação foi resultado de anos de aprendizado, disciplina e um método estruturado que hoje utilizo para transformar a vida dos meus alunos.",
    photo: "/antes-depois-montinho-personal-trainer.jpg",
  },
  {
    name: "Natália N.",
    result: "−10kg em 9 meses",
    description: "Transformou o corpo. Além de perder 10kg de gordura, ganhou massa magra e melhorou muito a composição corporal.",
    photo: "/antes-depois-montinho-personal-trainer-3.jpg",
  },
  {
    name: "Elisa C.",
    result: "−20kg em 9 meses",
    description: "Transformou o corpo e principalmente a mente, através de uma estratégia individualizada que se encaixava da melhor maneira em sua rotina.",
    photo: "/antes-depois-montinho-personal-trainer-4.jpg",
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
            accent
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {resultados.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 hover:border-white/30 transition-colors duration-300 group"
            >
              <div className="aspect-[4/3] bg-gray-900 overflow-hidden">
                <Image
                  src={item.photo}
                  alt={`Resultado de ${item.name}`}
                  width={400}
                  height={300}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  className="opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-gray-300 font-medium text-sm">{item.name}</p>
                  <span
                    className="font-bold text-sm"
                    style={{ color: "#BA9E50", fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {item.result}
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
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
