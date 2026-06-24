import type { Metadata } from "next";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Resultados e Transformações",
  description:
    "Veja as transformações reais dos alunos do Montinho Personal Trainer. Resultados de perda de peso, ganho de massa muscular e melhoria de qualidade de vida.",
};

const resultados = [
  {
    name: "Carlos M.",
    age: "34 anos",
    duration: "6 meses",
    result: "−22kg de gordura",
    modality: "Consultoria Online",
    description:
      "Carlos chegou sem nunca ter se exercitado de forma consistente. Com um plano realista para sua rotina corrida de executivo, transformou o corpo sem abrir mão da vida social.",
    quote:
      "Nunca acreditei que conseguiria. Mas com o método certo e alguém me acompanhando de perto, foi possível.",
  },
  {
    name: "Fernanda S.",
    age: "29 anos",
    duration: "4 meses",
    result: "−15kg e recuperação pós-parto",
    modality: "Personal Presencial · Alphaville",
    description:
      "Mãe de dois filhos, Fernanda precisava de um treino que respeitasse seu corpo pós-gestação e sua rotina intensa. O resultado superou todas as expectativas.",
    quote:
      "O Montinho entendeu que eu precisava de mais do que um treino. Precisava de apoio. E ele me deu os dois.",
  },
  {
    name: "Ricardo A.",
    age: "41 anos",
    duration: "8 meses",
    result: "+8kg de massa magra",
    modality: "Modelo Híbrido",
    description:
      "Ricardo treinava há anos mas não via progresso. Lesões recorrentes e treinos sem periodização foram corrigidos com método e paciência.",
    quote:
      "Finalmente entendi o que estava fazendo errado. Em 8 meses aprendi mais sobre meu corpo do que em anos de academia.",
  },
  {
    name: "Patrícia N.",
    age: "45 anos",
    duration: "5 meses",
    result: "−18kg e reversão de quadro pré-diabético",
    modality: "Consultoria Online",
    description:
      "Patricia tinha indicação médica para perder peso. Com orientação nutricional integrada ao treino, reverteu um quadro pré-diabético e recuperou a energia.",
    quote:
      "Meu médico ficou impressionado nos exames. Mas quem eu tenho que agradecer é o Montinho.",
  },
  {
    name: "Bruno T.",
    age: "26 anos",
    duration: "4 meses",
    result: "Corpo definido para o verão",
    modality: "Personal Presencial · Alphaville",
    description:
      "Bruno queria chegar ao verão com o corpo definido. Com protocolo específico de hipertrofia e perda de gordura, chegou no resultado antes do prazo.",
    quote:
      "Pensei que seria difícil demais. Mas quando o plano faz sentido e o acompanhamento é bom, você segue sem dificuldade.",
  },
  {
    name: "Luciana M.",
    age: "38 anos",
    duration: "7 meses",
    result: "−20kg e eliminação de dores lombares crônicas",
    modality: "Modelo Híbrido",
    description:
      "Luciana sofria de dores lombares há anos. O trabalho combinado de fortalecimento e mobilidade não apenas eliminou as dores como ajudou a emagrecer 20kg.",
    quote:
      "Curei minha coluna e transformei meu corpo ao mesmo tempo. Não esperava esse resultado duplo.",
  },
];

export default function Resultados() {
  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Resultados"
            title="Transformações que falam por si"
            subtitle="Histórias reais de pessoas que confiaram no processo e transformaram suas vidas. Não são exceções — são a regra quando a abordagem é certa."
          />
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.map((item, index) => (
              <article
                key={index}
                className="border border-white/10 group hover:border-white/30 transition-colors duration-300"
              >
                {/* Placeholder image */}
                <div className="aspect-[4/3] bg-gray-900 overflow-hidden">
                  <img
                    src="https://placehold.co/400x300/1a1a1a/333333?text=Antes+%26+Depois"
                    alt={`Transformação de ${item.name}`}
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.age} · {item.modality}</p>
                    </div>
                    <span
                      className="text-white font-bold text-sm text-right"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                    >
                      {item.result}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-px flex-1 bg-white/10" />
                    <span className="text-gray-500 text-xs">{item.duration}</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <blockquote className="border-l-2 border-white/20 pl-3">
                    <p className="text-gray-300 text-sm italic">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </blockquote>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white text-black text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-black mb-5"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            A próxima história pode ser a sua.
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            Estas pessoas tinham dúvidas, medos e já tinham tentado de tudo antes. O que mudou foi o método e o acompanhamento.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Vi os resultados no site e quero começar minha transformação.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-900 transition-all duration-200"
          >
            Quero Ser o Próximo
          </a>
        </div>
      </section>
    </>
  );
}
