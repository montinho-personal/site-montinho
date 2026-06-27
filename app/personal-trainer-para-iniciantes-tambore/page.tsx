import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer para Iniciantes Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer para iniciantes em Tamboré. Comece do zero com base técnica sólida, progressão segura e protocolo individualizado. Mais de 20 anos formando alunos iniciantes na região.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-para-iniciantes-tambore`,
  },
  openGraph: {
    title: "Personal Trainer para Iniciantes Tamboré | Montinho Personal Trainer",
    description:
      "Começar do zero em Tamboré com acompanhamento profissional. Base técnica correta, progressão segura e protocolo que respeita o seu ponto de partida.",
    url: `${SITE_URL}/personal-trainer-para-iniciantes-tambore`,
  },
};

const faq = [
  {
    question: "Personal trainer para iniciantes em Tamboré vale a pena desde o começo?",
    answer:
      "Especialmente desde o começo. O início do treino é quando os hábitos e padrões de movimento são formados. Começar com técnica correta, progressão adequada e protocolo individualizado acelera o resultado e evita lesões que podem comprometer meses de treino. Corrigir erros depois que viraram hábito é muito mais difícil.",
  },
  {
    question: "Iniciante precisa de academia para começar com personal em Tamboré?",
    answer:
      "Não necessariamente. Para iniciantes, o treinamento pode começar com equipamento básico — inclusive na academia do condomínio — e progredir conforme a capacidade física melhora. O protocolo é adaptado ao equipamento disponível, não o contrário.",
  },
  {
    question: "Quantas vezes por semana iniciante deve treinar com personal em Tamboré?",
    answer:
      "Para iniciantes, duas a três sessões semanais são suficientes para progressão consistente. O corpo precisa de tempo de recuperação para se adaptar ao novo estímulo — e treinar mais do que o necessário no início pode gerar excesso de fadiga e desmotivação. A frequência aumenta conforme a adaptação avança.",
  },
  {
    question: "Personal trainer em Tamboré atende iniciantes que nunca treinaram?",
    answer:
      "Esse é um dos perfis mais frequentes no meu atendimento. Quem nunca treinou parte com uma vantagem: não tem padrões errados para corrigir. Com acompanhamento desde o início, a base técnica é construída corretamente — e a progressão acontece de forma mais rápida e segura do que para quem treinou anos sem orientação.",
  },
  {
    question: "Quanto tempo um iniciante leva para ver resultado com personal em Tamboré?",
    answer:
      "Para iniciantes, os primeiros sinais de melhora — mais disposição, sono melhor, roupas menos apertadas — costumam aparecer entre 3 e 6 semanas. Mudanças visíveis na composição corporal ficam evidentes a partir do segundo ou terceiro mês de protocolo consistente. A progressão inicial tende a ser mais rápida do que em alunos avançados.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-para-iniciantes-tambore`,
  name: "Montinho Personal Trainer – Iniciantes Tamboré",
  description:
    "Personal trainer para iniciantes em Tamboré. Base técnica correta, progressão segura e protocolo individualizado desde o primeiro dia.",
  url: `${SITE_URL}/personal-trainer-para-iniciantes-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer para Iniciantes",
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

export default function PersonalTrainerIniciantesTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Iniciantes · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer para iniciantes em Tamboré: começar certo muda tudo.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            O início do treino é a fase mais importante — e a mais negligenciada. Com acompanhamento profissional desde o começo em Tamboré, você constrói base técnica sólida, evita lesões e progride mais rápido do que tentando sozinho.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero começar do zero
          </a>
        </div>
      </section>

      {/* PARA INICIANTES */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Por que começar com acompanhamento
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Iniciante que começa com método progride mais rápido — e com menos risco.
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-5 text-gray-300 leading-relaxed font-light">
              <p>
                A maioria das pessoas que começa a treinar sozinha em Tamboré enfrenta o mesmo conjunto de problemas: execução incorreta dos exercícios, carga inadequada, progressão mal distribuída e ausência de avaliação. Resultado: estagnação rápida, desmotivação e, frequentemente, lesão.
              </p>
              <p>
                Com personal trainer, o iniciante começa de onde deve começar — não de onde acha que deve. A avaliação inicial define o ponto de partida real: histórico de saúde, limitações físicas, objetivos e rotina disponível. Com essa base, o protocolo é construído de forma progressiva, respeitando o ritmo de adaptação do corpo.
              </p>
              <p>
                O maior ganho do acompanhamento para iniciantes não é a velocidade do resultado — é a qualidade da base que é construída. Uma base técnica sólida permite progressão sustentável por anos. Uma base fraca limita o resultado e acumula compensações que viram problemas mais tarde.
              </p>
            </div>
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src="/Personal%20Trainer%20Tambor%C3%A9%20%282%29.jpg"
                alt="Personal Trainer para Iniciantes Tamboré"
                title="Personal Trainer para Iniciantes Tamboré"
                width={220}
                height={390}
                loading="lazy"
                decoding="async"
                className="object-cover object-top"
                style={{ width: "220px", height: "390px", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Como funciona o processo para iniciantes em Tamboré
          </h2>
          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Avaliação inicial completa",
                text: "Anamnese, histórico de saúde, objetivos, disponibilidade de treino e avaliação postural. Nada é prescrito sem essa base.",
              },
              {
                num: "02",
                title: "Protocolo do zero para o seu nível atual",
                text: "Exercícios, cargas e volumes adequados para iniciantes — com progressão planejada para as semanas seguintes desde o primeiro dia.",
              },
              {
                num: "03",
                title: "Aprendizado técnico nas primeiras sessões",
                text: "As primeiras semanas são dedicadas a aprender a executar corretamente. Técnica antes de carga — sempre.",
              },
              {
                num: "04",
                title: "Progressão estruturada semana a semana",
                text: "O protocolo avança conforme sua capacidade aumenta — sem pular etapas e sem estagnar por falta de estímulo.",
              },
            ].map((step) => (
              <div key={step.num} className="flex gap-6 items-start">
                <span className="text-2xl font-bold flex-shrink-0 mt-1" style={{ color: "#BA9E50" }}>
                  {step.num}
                </span>
                <div>
                  <h3 className="text-white font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed font-light">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
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
            Dúvidas sobre personal trainer para iniciantes em Tamboré
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
            Todo expert já foi iniciante. Comece agora com o apoio certo.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Não importa onde você está — importa para onde quer chegar. Me conta seu ponto de partida e vamos construir o caminho juntos.
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
              href="/consultoria"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-base font-medium tracking-wide hover:border-white hover:bg-white/5 transition-all duration-200"
            >
              Ver modalidades de atendimento
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
