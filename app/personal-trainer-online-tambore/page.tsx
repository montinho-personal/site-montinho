import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer Online Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer online para moradores de Tamboré. Protocolo individualizado, acompanhamento remoto e resultado real sem sair de casa. Mais de 20 anos de experiência.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-online-tambore`,
  },
  openGraph: {
    title: "Personal Trainer Online Tamboré | Montinho Personal Trainer",
    description:
      "Personal trainer online para quem mora em Tamboré e precisa de flexibilidade. Protocolo individual, acompanhamento remoto e progressão real.",
    url: `${SITE_URL}/personal-trainer-online-tambore`,
  },
};

const faq = [
  {
    question: "Personal trainer online para quem mora em Tamboré funciona de verdade?",
    answer:
      "Funciona — quando o protocolo é bem estruturado e o acompanhamento é genuíno. O modelo online exige protocolos mais detalhados, comunicação frequente e avaliações periódicas para compensar a ausência física. Para alunos com disciplina e agenda imprevisível, é uma opção eficiente e com resultado real.",
  },
  {
    question: "Qual a diferença entre personal trainer online e presencial para moradores de Tamboré?",
    answer:
      "A principal diferença é a presença física durante o treino — o personal presencial corrige execução em tempo real, o que é difícil de replicar online. Por isso, o modelo online funciona melhor para alunos com alguma experiência de treino ou com capacidade de enviar vídeos da execução para feedback. Para iniciantes absolutos, o presencial costuma ser mais eficiente.",
  },
  {
    question: "Personal trainer online de Tamboré acompanha quem treina em casa?",
    answer:
      "Sim. O protocolo online é adaptado ao equipamento disponível — academia completa, academia de condomínio, halteres em casa ou apenas peso corporal. O que determina a eficiência do treino não é o local, é a qualidade do protocolo e da progressão.",
  },
  {
    question: "Como funciona o acompanhamento do personal trainer online para alunos de Tamboré?",
    answer:
      "O acompanhamento inclui: protocolo de treino individualizado com descrição detalhada de cada exercício, check-ins semanais via WhatsApp, feedback de vídeos de execução quando necessário, ajuste de protocolo conforme a resposta do corpo e reavaliação mensal com análise de composição corporal.",
  },
  {
    question: "Personal trainer online é mais barato que presencial em Tamboré?",
    answer:
      "Em geral, sim — o modelo online tem custo menor porque elimina o deslocamento e permite atender mais alunos com qualidade. O investimento varia conforme o pacote e a frequência de interação. O valor exato é apresentado com transparência na primeira conversa.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-online-tambore`,
  name: "Montinho Personal Trainer Online – Tamboré",
  description:
    "Personal trainer online para moradores de Tamboré. Protocolo individualizado e acompanhamento remoto para quem precisa de flexibilidade.",
  url: `${SITE_URL}/personal-trainer-online-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer Online",
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

export default function PersonalTrainerOnlineTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Online · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer online para Tamboré: protocolo real, acompanhamento de verdade.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Para quem mora em Tamboré e viaja com frequência, tem agenda imprevisível ou prefere a praticidade do treino remoto, o personal trainer online entrega protocolo individualizado e resultado concreto — sem precisar de horário fixo.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Moro em Tamboré e tenho interesse em personal trainer online.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero personal trainer online
          </a>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Para quem é
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer online funciona para quem tem a rotina de Tamboré.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Quem mora em Tamboré e trabalha em São Paulo conhece a realidade de perder uma, duas horas por dia no trânsito. Encaixar treino presencial com personal nessa agenda é um desafio logístico real. O modelo online resolve esse problema: o treino acontece onde e quando você pode — sem deslocamento, sem horário fixo.
            </p>
            <p>
              O personal trainer online não é uma planilha mandada por e-mail uma vez por mês. É um protocolo individualizado com acompanhamento genuíno: check-ins semanais, feedback de execução, ajuste conforme a resposta do corpo e revisão mensal completa. A diferença está na qualidade do acompanhamento — e é aí que a maioria dos serviços online falha.
            </p>
            <p>
              Atendo alunos online de Tamboré que viajam para São Paulo durante a semana, que têm horários diferentes a cada dia e que querem flexibilidade sem abrir mão de progressão real. O resultado é possível — com método correto.
            </p>
          </div>
        </div>
      </section>

      {/* O QUE INCLUI */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que inclui o personal trainer online para Tamboré
          </h2>
          <div className="grid sm:grid-cols-2 gap-px border border-white/10">
            {[
              {
                title: "Protocolo individualizado",
                text: "Treino montado do zero para seu objetivo, nível atual e equipamento disponível — academia, condomínio ou casa.",
              },
              {
                title: "Check-ins semanais",
                text: "Acompanhamento regular via WhatsApp para verificar progresso, tirar dúvidas e ajustar o treino conforme necessário.",
              },
              {
                title: "Feedback de execução por vídeo",
                text: "Envie vídeos dos exercícios e receba feedback técnico detalhado — para garantir que a execução está correta mesmo à distância.",
              },
              {
                title: "Ajuste de protocolo contínuo",
                text: "O treino é atualizado conforme sua evolução — sem estagnar esperando a reavaliação do mês.",
              },
              {
                title: "Reavaliação mensal",
                text: "Análise de composição corporal, evolução de força, ajuste de objetivos e planejamento para o próximo ciclo.",
              },
              {
                title: "Orientações nutricionais práticas",
                text: "Dicas práticas de alimentação alinhadas com o objetivo do treino — sem substituir a prescrição de nutricionista.",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 border-b border-r border-white/10">
                <p className="text-white font-semibold mb-2">{item.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{item.text}</p>
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
            Dúvidas sobre personal trainer online em Tamboré
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
            Treino sério não precisa de horário fixo.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Me conta sua rotina e o que você precisa. Juntos encontramos o modelo que funciona para você — presencial, online ou híbrido.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl("Olá! Moro em Tamboré e tenho interesse em personal trainer online.")}
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
              Ver todas as modalidades
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
