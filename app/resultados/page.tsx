import type { Metadata } from "next";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import SectionTitle from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Resultados e Transformações",
  description:
    "Veja as transformações reais dos alunos do Montinho Personal Trainer. Resultados de perda de peso, ganho de massa muscular e melhoria de qualidade de vida.",
};

interface ResultadoItem {
  name: string;
  age: string;
  duration: string;
  result: string;
  modality: string;
  photo?: string;
  objectPosition?: string;
  photoAspect?: string;
  description: string;
  quote: string;
}

const resultados: ResultadoItem[] = [
  {
    name: "Adriana Nascimento",
    age: "43 anos",
    duration: "8 meses",
    result: "−20kg",
    modality: "Modelo Híbrido",
    photo: "/antes-depois-montinho-personal-trainer-2.jpg",
    description:
      "Adriana treinava há anos e já havia tentado diferentes esportes e métodos de treinamento, mas sem uma estratégia bem definida. Com um planejamento estruturado e treino periodizado, em poucos meses conquistou uma transformação que ela mesma não acreditava ser possível.",
    quote:
      "Finalmente entendi o que estava fazendo errado. Em 8 meses aprendi mais sobre meu corpo e minha mente do que em anos de academia.",
  },
  {
    name: "Montinho",
    age: "37 anos",
    duration: "Uma vida toda dedicada",
    result: "−40kg",
    modality: "Transformação Pessoal",
    photo: "/antes-depois-montinho-personal-trainer.jpg",
    description:
      "Durante anos, eu tentei de tudo para transformar meu corpo. Vivi o efeito sanfona, cometi erros, segui métodos que prometiam resultados rápidos e me frustrei inúmeras vezes. Quando finalmente encontrei um caminho baseado em ciência, estratégia e constância, minha vida mudou. Hoje, esse é o mesmo método que utilizo para ajudar meus alunos a conquistarem resultados reais.",
    quote:
      "Se eu consegui transformar minha própria história, acredito que posso ajudar você a transformar a sua também.",
  },
  {
    name: "Natália Nascimento",
    age: "40 anos",
    duration: "9 meses",
    result: "−10kg",
    modality: "Personal Presencial · Alphaville",
    photo: "/antes-depois-montinho-personal-trainer-3.jpg",
    description:
      "Natália já treinava há anos e sabia exatamente como executar os exercícios. Já havia conquistado um ótimo físico, mas vivia presa ao efeito sanfona. O que faltava não era esforço, e sim um planejamento estruturado, uma estratégia de treino e o suporte necessário para confiar no processo. Com consistência e acompanhamento, voltou a evoluir e conquistou uma transformação duradoura.",
    quote:
      "Percebi que não precisava treinar mais, e sim treinar com estratégia. Aprendi a confiar no processo e os resultados apareceram novamente.",
  },
  {
    name: "Elisa Cruz",
    age: "34 anos",
    duration: "9 meses",
    result: "−20kg",
    modality: "Modelo Híbrido",
    photo: "/antes-depois-montinho-personal-trainer-4.jpg",
    description:
      "Elisa já tinha decidido que era hora de mudar. O meu papel foi transformar essa decisão em um plano claro, adaptado à sua rotina e aos seus objetivos. Com um treino estratégico, acompanhamento próximo e confiança no processo, ela conquistou uma transformação consistente sem precisar viver em função da academia.",
    quote:
      "Ter um planejamento feito para a minha realidade fez toda a diferença. Pela primeira vez, consegui manter a consistência e ver resultados de verdade.",
  },
  {
    name: "Bruna Rodrigues",
    age: "35 anos",
    duration: "",
    result: "−22kg",
    modality: "Modelo Híbrido",
    photo: "/antes-depois-montinho-personal-trainer-alphaville-sp.jpg",
    objectPosition: "center",
    description:
      "Durante anos, Bruna viveu entre o entusiasmo de começar e a frustração de recomeçar. O efeito sanfona parecia não ter fim. Quando me procurou, construímos um plano pensado para a vida que ela realmente levava. Aos poucos, a constância substituiu a culpa, e o resultado deixou de ser temporário para se tornar um novo estilo de vida.",
    quote:
      "Ter um treino personalizado já fez toda a diferença, mas o maior diferencial foi o suporte. Saber que meu treinador já viveu essa mesma luta me deu confiança para não desistir. Hoje tenho resultados que nunca consegui manter antes.",
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
      <section className="py-16 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Resultados"
            title="Transformações que falam por si"
            subtitle="Histórias reais de pessoas que confiaram no processo e transformaram suas vidas. Não são exceções — são a regra quando a abordagem é certa."
            accent
          />
        </div>
      </section>

      {/* Results Grid */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultados.filter((item) => item.photo).map((item, index) => (
              <article
                key={index}
                className="border border-white/10 group hover:border-white/30 transition-colors duration-300"
              >
                {/* Image */}
                <div className={`${item.photoAspect ?? "aspect-[4/3]"} bg-gray-900 overflow-hidden`}>
                  {item.photo ? (
                    <Image
                      src={item.photo}
                      alt={`Transformação de ${item.name}`}
                      width={600}
                      height={450}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: item.objectPosition ?? "center" }}
                      className="opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">Antes &amp; Depois</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.age} · {item.modality}</p>
                    </div>
                    <span
                      className="font-bold text-sm text-right"
                      style={{
                        color: item.photo ? "#BA9E50" : "white",
                        fontFamily: "var(--font-playfair), Georgia, serif",
                      }}
                    >
                      {item.result}
                    </span>
                  </div>

                  {item.duration && (
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-gray-500 text-xs">{item.duration}</span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                  )}

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
      <section className="py-16 bg-white text-black text-center">
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
            href={getWhatsAppUrl()}
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
