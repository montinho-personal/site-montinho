import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Melhor Personal Trainer Tamboré | Montinho Personal Trainer",
  description:
    "Procurando o melhor personal trainer em Tamboré? Mais de 20 anos de experiência na região, método baseado em ciência e resultados verificáveis. Saiba o que diferencia um personal trainer de verdade.",
  alternates: {
    canonical: `${SITE_URL}/melhor-personal-trainer-tambore`,
  },
  openGraph: {
    title: "Melhor Personal Trainer Tamboré | Montinho Personal Trainer",
    description:
      "O que define o melhor personal trainer em Tamboré? Método, experiência, resultados comprovados e presença exclusiva. Conheça o critério certo para escolher.",
    url: `${SITE_URL}/melhor-personal-trainer-tambore`,
  },
};

const faq = [
  {
    question: "Como identificar o melhor personal trainer em Tamboré?",
    answer:
      "Verifique a formação em Educação Física, a metodologia de trabalho, os resultados de alunos anteriores e a clareza com que o profissional explica as decisões de treino. O melhor personal trainer não é o que tem mais seguidores nas redes sociais — é o que entrega resultado consistente e explica o raciocínio por trás de cada escolha.",
  },
  {
    question: "O melhor personal trainer em Tamboré é o mais caro?",
    answer:
      "Preço alto não é sinônimo de qualidade — assim como preço baixo não é garantia de má qualidade. O que determina o valor de um personal trainer é o resultado que entrega, o método que aplica e a experiência que acumula. Profissionais experientes com histórico sólido cobram mais — e geralmente valem o investimento.",
  },
  {
    question: "Qual a formação do melhor personal trainer em Tamboré?",
    answer:
      "Graduação em Educação Física é o ponto de partida. Pós-graduação em áreas como fisiologia do exercício, musculação, reabilitação ou nutrição esportiva agrega. Mais importante ainda é a atualização constante — o conhecimento científico sobre treino evoluiu muito nos últimos anos e o profissional precisa acompanhar.",
  },
  {
    question: "Melhor personal trainer em Tamboré atende online também?",
    answer:
      "Sim. A qualidade do método não depende da modalidade — o que muda é o formato de acompanhamento. O modelo online exige protocolos bem estruturados, comunicação frequente e avaliações periódicas para compensar a ausência de presença física. Para alunos com agenda imprevisível, o modelo híbrido costuma ser o mais eficiente.",
  },
  {
    question: "Como saber se estou com o personal trainer certo em Tamboré?",
    answer:
      "Você está com o profissional certo quando: o protocolo é montado especificamente para você (não adaptado de outro aluno), a execução é corrigida em todas as sessões, você entende o porquê de cada escolha de treino e, principalmente, quando os resultados aparecem de forma consistente ao longo do tempo.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/melhor-personal-trainer-tambore`,
  name: "Montinho – Personal Trainer Tamboré",
  description:
    "Personal trainer com mais de 20 anos em Tamboré. Método baseado em ciência, protocolo individualizado e resultados comprovados.",
  url: `${SITE_URL}/melhor-personal-trainer-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer",
  priceRange: "$$",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function MelhorPersonalTrainerTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Tamboré · Referência na Região
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Melhor personal trainer em Tamboré: o critério certo para escolher.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            "Melhor" não é opinião — é resultado verificável. Mais de 20 anos em Tamboré e Alphaville, centenas de alunos atendidos e um método que entrega progressão real. Esse é o critério que importa na hora de escolher.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Conhecer o método
          </a>
        </div>
      </section>

      {/* CRITÉRIOS */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            O que define qualidade
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que separa um bom personal trainer dos demais em Tamboré.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Em Tamboré e Alphaville há muitos profissionais de educação física. Alguns com formação sólida, outros com apenas um certificado de fim de semana. Alguns com método científico atualizado, outros com fichas de treino prontas para todo mundo. A diferença entre eles não é visível no Instagram — é perceptível no resultado.
            </p>
            <p>
              Um personal trainer de qualidade faz perguntas antes de prescrever. Avalia postura, histórico de lesões, objetivos reais e disponibilidade de tempo antes de escrever uma única série. O protocolo que entrega é específico — não adaptado de outro aluno. E as sessões que conduz são exclusivas: atenção total, correção técnica em tempo real, sem divisão de foco.
            </p>
            <p>
              Trabalho em Tamboré e Alphaville há mais de 20 anos. Meu método é construído sobre base científica atualizada, experiência prática acumulada e um histórico de resultados que pode ser verificado por alunos reais. Não tenho promessas de prazo impossível — tenho processo estruturado e progressão mensurável.
            </p>
          </div>
          <div className="mt-10" style={{ maxWidth: "220px" }}>
            <Image
              src="/montinho-personal-trainer-shape.jpg"
              alt="Melhor Personal Trainer Tamboré"
              title="Melhor Personal Trainer Tamboré"
              width={220}
              height={392}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* O QUE OFEREÇO */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que encontrar em um personal trainer de referência em Tamboré
          </h2>
          <ul className="space-y-4 mb-10">
            {[
              "Formação em Educação Física e histórico profissional verificável",
              "Método claro e explicado — não 'confie em mim e faça'",
              "Protocolo construído do zero para cada aluno, sem fichas adaptadas",
              "Avaliação antes de prescrever qualquer exercício",
              "Correção técnica em cada repetição, em cada sessão",
              "Reavaliação mensal com ajuste baseado na resposta real do corpo",
              "Resultados de alunos anteriores disponíveis e verificáveis",
              "Suporte entre as sessões — não some depois que o treino acaba",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 font-light">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-400 font-light">
            Veja resultados reais na{" "}
            <Link href="/resultados" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
              página de resultados
            </Link>
            .
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Perguntas frequentes
          </p>
          <h2
            className="text-3xl font-bold text-white mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Dúvidas sobre como escolher personal trainer em Tamboré
          </h2>
          <div className="space-y-8">
            {faq.map((item, i) => (
              <div key={i} className="border-b border-white/10 pb-8">
                <h3 className="text-white font-semibold text-lg mb-3">{item.question}</h3>
                <p className="text-gray-400 leading-relaxed font-light">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Julgue pelo processo. E pelos resultados.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            A primeira conversa é sem compromisso. Te apresento meu método, minha experiência e os resultados de quem já passou por aqui. Daí você decide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
            >
              Falar pelo WhatsApp
            </a>
            <Link
              href="/resultados"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-base font-medium tracking-wide hover:border-white hover:bg-white/5 transition-all duration-200"
            >
              Ver resultados de alunos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
