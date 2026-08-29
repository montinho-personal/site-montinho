import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import SectionTitle from "@/components/ui/SectionTitle";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Consultoria Online e Personal Trainer em Alphaville",
  description:
    "Consultoria online de treino para todo o Brasil e personal trainer presencial em Alphaville. Treino personalizado, suporte diário no WhatsApp e acompanhamento de quem já perdeu 40 kg.",
  alternates: {
    canonical: `${SITE_URL}/consultoria`,
  },
  openGraph: {
    title: "Consultoria Online e Personal Trainer | Montinho PT",
    description:
      "Consultoria online de treino para todo o Brasil e personal trainer presencial em Alphaville. Treino personalizado e suporte diário no WhatsApp.",
    url: `${SITE_URL}/consultoria`,
    type: "website",
    // O merge de metadata do Next é raso: definir openGraph aqui descarta o
    // images do layout raiz, então a imagem padrão precisa ser redeclarada.
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Personal Training e Consultoria Fitness",
  provider: {
    "@id": "https://www.montinhopersonal.com.br/#localbusiness",
  },
  areaServed: [
    { "@type": "City", name: "Alphaville" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
    { "@type": "Country", name: "Brasil" },
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Modalidades de Atendimento",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Personal Trainer Presencial em Alphaville",
          description: "Acompanhamento 100% presencial com sessões de treino guiadas, correção de técnica em tempo real em Alphaville, Barueri e Santana de Parnaíba.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Consultoria Online",
          description: "Consultoria online para todo o Brasil com protocolo de treino personalizado, orientação nutricional e suporte via WhatsApp.",
        },
      },
    ],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Consultoria", item: `${SITE_URL}/consultoria` },
  ],
};

const faq = [
  {
    question: "Como funciona a consultoria online?",
    answer:
      "Depois de uma conversa inicial gratuita e de uma anamnese completa, você recebe um treino personalizado com vídeos demonstrativos, orientação prática e suporte diário via WhatsApp. Fazemos check-ins semanais e reavaliações mensais para ajustar o plano conforme a sua evolução.",
  },
  {
    question: "Quanto custa a consultoria online e o personal presencial?",
    answer:
      "O valor depende da modalidade (online, presencial ou híbrida), da frequência e do período do plano. A conversa inicial é gratuita e sem compromisso — nela eu entendo seu objetivo e te passo as opções com transparência, para você decidir com calma.",
  },
  {
    question: "Consultoria online funciona de verdade?",
    answer:
      "Funciona quando existe plano individualizado e acompanhamento de verdade — não um PDF genérico. Na minha consultoria o treino é montado para a sua rotina e o suporte é diário: você manda vídeo da execução, tira dúvidas e o protocolo é ajustado sempre que necessário.",
  },
  {
    question: "Preciso de experiência ou posso começar do zero?",
    answer:
      "Pode começar do zero. Boa parte dos meus alunos chegou sedentária ou depois de várias tentativas frustradas. O plano parte do seu nível atual e evolui de forma gradual — eu já estive do outro lado da balança e sei como é recomeçar.",
  },
  {
    question: "Atende em qual região no presencial?",
    answer:
      "Atendo presencialmente em Alphaville e região — Barueri e Santana de Parnaíba —, em academias e condomínios. Para o restante do Brasil, o atendimento é pela consultoria online, com o mesmo método e acompanhamento próximo.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const services = [
  {
    tag: "Mais Popular",
    title: "Personal Presencial",
    subtitle: "Alphaville · Barueri · Santana de Parnaíba",
    description:
      "Acompanhamento 100% presencial com sessões de treino guiadas, correção de técnica em tempo real e total atenção às suas necessidades.",
    includes: [
      "Avaliação física completa e anamnese",
      "Treinos personalizados 100% para você",
      "Correção de técnica em tempo real",
      "Suporte via WhatsApp entre as sessões",
      "Reavaliações mensais e ajustes de protocolo",
      "Prevenção e correção de desvios posturais",
    ],
    cta: "Quero Personal Presencial",
    message:
      "Olá! Tenho interesse no Personal Presencial em Alphaville. Pode me contar mais?",
    featured: false,
  },
  {
    tag: "Online",
    title: "Consultoria Online",
    subtitle: "Em qualquer lugar do Brasil",
    description:
      "Todo o método Montinho, sem limitação geográfica. Para quem não está em Alphaville mas quer os mesmos resultados com o mesmo nível de acompanhamento.",
    includes: [
      "Anamnese completa e avaliação de histórico",
      "Treino personalizado com vídeos demonstrativos",
      "Suporte diário via WhatsApp",
      "Check-ins semanais de evolução",
      "Reavaliações e ajustes mensais",
      "Acesso a materiais exclusivos",
    ],
    cta: "Quero Consultoria Online",
    message:
      "Olá! Tenho interesse na Consultoria Online. Pode me contar mais sobre como funciona?",
    featured: true,
  },
  {
    tag: "Flexível",
    title: "Modelo Híbrido",
    subtitle: "Presencial + Online",
    description:
      "O melhor dos dois mundos. Sessões presenciais para refinamento de técnica combinadas com o suporte digital para o resto da semana.",
    includes: [
      "Sessões presenciais semanais em Alphaville",
      "Treinos complementares online",
      "Suporte via WhatsApp todos os dias",
      "Avaliações e ajustes de protocolo",
      "Flexibilidade para períodos de viagem",
      "Acesso a materiais e conteúdos exclusivos",
    ],
    cta: "Quero o Modelo Híbrido",
    message:
      "Olá! Tenho interesse no Modelo Híbrido (presencial + online). Pode me contar mais?",
    featured: false,
  },
];

const steps = [
  {
    number: "01",
    title: "Conversa Inicial Gratuita",
    description:
      "Sem compromisso. Quero entender seus objetivos, histórico e rotina antes de qualquer coisa. Esse diagnóstico é fundamental para um plano que funcione.",
  },
  {
    number: "02",
    title: "Planejamento Personalizado",
    description:
      "Com base em tudo que ouvi, crio um protocolo completo: treino periodizado, orientação nutricional e estratégias práticas para a sua realidade.",
  },
  {
    number: "03",
    title: "Acompanhamento Ativo",
    description:
      "Não sou o tipo que desaparece. Estou presente, acompanho a evolução, respondo dúvidas e faço ajustes sempre que necessário.",
  },
  {
    number: "04",
    title: "Evolução Contínua",
    description:
      "Reavaliações regulares para medir progresso, ajustar protocolos e garantir que você continua evoluindo em direção ao seu objetivo.",
  },
];

const trustItems = [
  { value: "-40 kg", label: "na minha própria transformação" },
  { value: "100%", label: "dos treinos personalizados — nada de PDF genérico" },
  { value: "7 dias", label: "por semana de suporte no WhatsApp" },
  { value: "Grátis", label: "a conversa inicial, sem compromisso" },
];

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

export default function Consultoria() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero — resposta direta ao anúncio, CTA acima da dobra */}
      <section className="py-14 sm:py-16 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">
            Consultoria Online · Personal Trainer em Alphaville
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Treino personalizado com acompanhamento de verdade
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-3">
            Presencial em Alphaville ou online em qualquer lugar do Brasil — com
            suporte diário no WhatsApp e um plano montado para a sua rotina.
          </p>
          <p className="text-gray-300 text-base leading-relaxed mb-8">
            Eu já perdi <strong className="text-white">40 kg</strong> na minha
            própria transformação. Sei o que funciona fora do papel — e é isso
            que aplico com cada aluno.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getWhatsAppUrl(
                "Olá! Vi a página de consultoria e quero saber como funciona o acompanhamento."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200 w-full sm:w-auto"
            >
              <WhatsAppIcon size={18} />
              Começar com uma conversa gratuita
            </a>
            <a
              href="#modalidades"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white px-8 py-4 text-base font-semibold tracking-wide hover:bg-white hover:text-black transition-all duration-200 w-full sm:w-auto"
            >
              Ver modalidades
            </a>
          </div>
          <p className="text-gray-400 text-xs mt-4">
            Resposta direto comigo, sem robô e sem compromisso.
          </p>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-10 bg-black border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {trustItems.map((item, i) => (
              <div key={i}>
                <p
                  className="text-2xl sm:text-3xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
                >
                  {item.value}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8">
            <Link
              href="/resultados"
              className="text-gray-300 text-sm underline underline-offset-4 decoration-1 hover:text-white transition-colors duration-200"
            >
              Veja transformações reais de alunos →
            </Link>
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section id="modalidades" className="py-20 bg-black scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col border p-8 ${
                  service.featured
                    ? "border-white bg-white/5"
                    : "border-white/20"
                }`}
              >
                {/* Tag */}
                <div className="mb-6">
                  <span
                    className={`text-xs font-semibold tracking-[0.15em] uppercase px-3 py-1 ${
                      service.featured
                        ? "bg-white text-black"
                        : "border border-white/30 text-gray-300"
                    }`}
                  >
                    {service.tag}
                  </span>
                </div>

                {/* Title */}
                <h2
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
                >
                  {service.title}
                </h2>
                <p className="text-gray-300 text-sm mb-5">{service.subtitle}</p>

                <p className="text-gray-300 text-sm leading-relaxed mb-8 border-b border-white/10 pb-8">
                  {service.description}
                </p>

                {/* Includes */}
                <div className="flex-1 mb-8">
                  <p className="text-white text-xs font-semibold tracking-[0.1em] uppercase mb-4">
                    O que inclui:
                  </p>
                  <ul className="space-y-3">
                    {service.includes.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="text-white flex-shrink-0 mt-0.5"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <a
                  href={getWhatsAppUrl(service.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 ${
                    service.featured
                      ? "bg-white text-black hover:bg-gray-100"
                      : "border border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  <WhatsAppIcon />
                  {service.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionTitle
              eyebrow="Processo"
              title="Como funciona na prática"
              subtitle="Do primeiro contato até os resultados — etapa por etapa."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mb-4">
                  <span
                    className="text-5xl font-bold"
                    style={{
                      fontFamily: "var(--font-titulo), Georgia, serif",
                      // Mesmo critério da home: 3,80:1, visível e secundário.
                      color: "rgba(186, 158, 80, 0.65)",
                    }}
                  >
                    {step.number}
                  </span>
                </div>
                <h3
                  className="text-white font-semibold text-lg mb-3"
                  style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amostra grátis do trabalho — entrega valor antes de pedir decisão */}
      <section className="py-14 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-l-2 pl-5 sm:pl-7" style={{ borderColor: "#BA9E50" }}>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: "#BA9E50" }}>
              Antes de decidir
            </p>
            <p
              className="text-white font-bold text-xl sm:text-2xl leading-snug mb-3"
              style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
            >
              Quer experimentar como eu olho para uma execução?
            </p>
            <p className="text-gray-300 leading-relaxed mb-5 max-w-2xl">
              Grave uma série completa de qualquer exercício e me mande pelo
              WhatsApp. Eu assisto e te passo os principais pontos que vale
              observar — gratuitamente, sem cadastro e sem compromisso nenhum.
              É a forma mais honesta de você sentir como funciona antes de
              contratar qualquer coisa.
            </p>
            <Link
              href="/revisao-de-execucao"
              className="inline-flex items-center text-sm text-white underline underline-offset-4 decoration-1 decoration-white/40 hover:decoration-white transition-colors min-h-[44px]"
            >
              Ver como funciona a revisão gratuita →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionTitle
              eyebrow="Dúvidas Frequentes"
              title="Perguntas antes de começar"
              subtitle="As respostas diretas para o que todo mundo pergunta."
            />
          </div>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <details
                key={i}
                className="group border border-white/15 px-6 py-5 open:bg-white/[0.03]"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
                  <span
                    className="text-white font-semibold text-base"
                    style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
                  >
                    {item.question}
                  </span>
                  <span className="text-gray-400 text-xl leading-none group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <p className="text-gray-300 text-sm leading-relaxed mt-4">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-white text-black text-center" data-track-section="pricing">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-black mb-5"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Não sabe qual modalidade escolher?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Me manda uma mensagem. Vamos conversar sobre o que faz mais sentido
            para a sua realidade — a conversa inicial é gratuita.
          </p>
          <p className="text-gray-400 mb-8 text-lg">
            No fim, é isso que você está contratando: alguém que sabe onde o seu
            treino pede um <strong className="text-black">chalalá</strong> — e
            onde ele só ia te cansar à toa.
          </p>
          <p className="text-gray-400 mb-8 text-lg">
            Não vou te dar um número nem uma data. Vou te dar uma estratégia que
            cabe na sua vida, medir o que acontece e ajustar junto com você.
            Fazendo isso por tempo suficiente,{" "}
            <strong className="text-black">é impossível dar errado</strong> — não
            porque eu prometo, mas porque a gente para de depender de sorte.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-900 transition-all duration-200"
          >
            <WhatsAppIcon size={18} />
            Falar com Montinho
          </a>
          <p className="text-gray-400 text-sm mt-6">
            Prefere entender primeiro qual caminho combina com você?{" "}
            <Link href="/diagnostico" className="underline underline-offset-4 decoration-1 hover:text-black transition-colors">
              Faça o Diagnóstico Montinho
            </Link>{" "}
            — gratuito, 1–2 minutos.
          </p>
        </div>
      </section>
    </>
  );
}
