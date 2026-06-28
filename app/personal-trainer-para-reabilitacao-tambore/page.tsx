import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer para Reabilitação Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer para reabilitação em Tamboré. Retorno ao treino após lesão com segurança, progressão adequada e protocolo individualizado. Mais de 20 anos na região.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-para-reabilitacao-tambore`,
  },
  openGraph: {
    title: "Personal Trainer para Reabilitação Tamboré | Montinho Personal Trainer",
    description:
      "Retorno ao treino após lesão em Tamboré com protocolo seguro e individualizado. Personal trainer com experiência em reabilitação e recondiccionamento físico.",
    url: `${SITE_URL}/personal-trainer-para-reabilitacao-tambore`,
  },
};

const faq = [
  {
    question: "Personal trainer pode atuar na reabilitação de lesões em Tamboré?",
    answer:
      "O personal trainer atua no recondicionamento físico — a fase que vem após a reabilitação fisioterapêutica — e no suporte ao retorno ao treino de forma segura. Não substitui o fisioterapeuta nas fases agudas da lesão, mas é essencial para garantir que o retorno à atividade física seja gradual, supervisionado e sem risco de recorrência.",
  },
  {
    question: "Quais lesões mais comuns personal trainer em Tamboré trabalha?",
    answer:
      "Lesões de joelho (menisco, ligamentos, condromalácia), ombro (manguito rotador, impingement), coluna lombar e cervical, quadril e tornozelo são as mais frequentes no meu atendimento. O trabalho é sempre baseado no laudo médico ou fisioterapêutico e adaptado às restrições de cada caso.",
  },
  {
    question: "Como funciona o retorno ao treino após cirurgia com personal em Tamboré?",
    answer:
      "O processo começa com a liberação médica e o relatório de alta da fisioterapia. A partir daí, montamos um protocolo de recondicionamento progressivo: exercícios de baixo impacto, fortalecimento muscular ao redor da articulação comprometida e aumento gradual de carga conforme a resposta do corpo. Cada etapa é monitorada de perto.",
  },
  {
    question: "Personal trainer em Tamboré trabalha junto com fisioterapeuta?",
    answer:
      "Sempre que possível, sim. O trabalho integrado entre personal trainer e fisioterapeuta garante que a progressão do recondicionamento esteja alinhada com a evolução clínica do aluno. Em muitos casos, o fisioterapeuta libera atividades específicas que são incorporadas ao protocolo de treino.",
  },
  {
    question: "Pessoa com dor crônica pode treinar com personal trainer em Tamboré?",
    answer:
      "Dor crônica não é impeditivo para o treino — na maioria dos casos, o treino de força bem prescrito é parte do tratamento. Condições como lombalgia crônica, artrose, tendinites e fibromialgia respondem bem ao treino supervisionado. O protocolo é montado em função das restrições e com progressão cuidadosa.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-para-reabilitacao-tambore`,
  name: "Montinho Personal Trainer – Reabilitação Tamboré",
  description:
    "Personal trainer para reabilitação e recondicionamento físico em Tamboré. Retorno ao treino após lesão com segurança e protocolo individualizado.",
  url: `${SITE_URL}/personal-trainer-para-reabilitacao-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer para Reabilitação",
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

export default function PersonalTrainerReabilitacaoTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Reabilitação · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer para reabilitação em Tamboré: voltar a treinar com segurança.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Lesão não é o fim do treino — é um ponto de reconstrução. Com protocolo adaptado e progressão controlada em Tamboré, o retorno ao treino é feito com segurança e sem comprometer a recuperação.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero voltar a treinar com segurança
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Abordagem e método
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Lesão antiga não precisa ser limitação permanente.
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-5 text-gray-300 leading-relaxed font-light">
              <p>
                Uma das situações mais frustrantes no treino é ter uma lesão antiga que reaparece sempre que o estímulo aumenta. Isso geralmente acontece por um retorno ao treino mal planejado — sem progressão adequada, sem fortalecimento do entorno da estrutura comprometida e sem atenção aos padrões de movimento que causaram a lesão originalmente.
              </p>
              <p>
                O trabalho de recondicionamento com personal trainer vai além de evitar o movimento que dói. Inclui identificar as causas biomecânicas da lesão, fortalecer os grupos musculares de suporte, reestabelecer padrões de movimento corretos e progredir a carga de forma que o corpo esteja preparado para o próximo estímulo antes de recebê-lo.
              </p>
              <p>
                Trabalho com alunos em reabilitação em Tamboré há mais de 20 anos, em parceria com médicos e fisioterapeutas. O protocolo é sempre baseado no laudo clínico — não em suposições. Segurança não é cautela excessiva, é planejamento inteligente.
              </p>
            </div>
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src="/Personal%20Trainer%20Tambor%C3%A9%20%282%29.jpg"
                alt="Personal Trainer para Reabilitação Tamboré"
                title="Personal Trainer para Reabilitação Tamboré"
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
            Como funciona o recondicionamento em Tamboré
          </h2>
          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Leitura do histórico e laudo médico",
                text: "Antes de qualquer movimento, levo em conta o diagnóstico, as restrições do médico ou fisioterapeuta e o histórico completo da lesão.",
              },
              {
                num: "02",
                title: "Avaliação funcional e postural",
                text: "Identificação dos padrões de movimento compensatórios que se desenvolveram durante o período de lesão — e que precisam ser corrigidos.",
              },
              {
                num: "03",
                title: "Protocolo de recondicionamento progressivo",
                text: "Exercícios de fortalecimento e mobilidade adequados ao estágio de recuperação, com progressão controlada e monitoramento constante.",
              },
              {
                num: "04",
                title: "Retorno gradual ao treino completo",
                text: "Integração progressiva dos movimentos do treino regular, com carga e volume aumentados conforme a resposta do corpo comprova que a estrutura está pronta.",
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
            Dúvidas sobre personal trainer para reabilitação em Tamboré
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
            A lesão passou. Agora é hora de reconstruir.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Me conta o histórico e a situação atual. Juntos planejamos o retorno ao treino de forma segura e eficiente.
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
