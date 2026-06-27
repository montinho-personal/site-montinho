import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer Tamboré e Barueri | Montinho Personal Trainer",
  description:
    "Personal trainer atendendo Tamboré e Barueri há mais de 20 anos. Protocolo individualizado, atendimento presencial e online. Emagrecimento, hipertrofia e qualidade de vida.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-tambore-barueri`,
  },
  openGraph: {
    title: "Personal Trainer Tamboré e Barueri | Montinho Personal Trainer",
    description:
      "Personal trainer em Tamboré e Barueri com método científico e experiência local de mais de 20 anos. Protocolo individual, resultado duradouro.",
    url: `${SITE_URL}/personal-trainer-tambore-barueri`,
  },
};

const faq = [
  {
    question: "Personal trainer atende tanto em Tamboré quanto em Barueri?",
    answer:
      "Sim. Atendo em toda a região — Tamboré, Alphaville, Barueri centro, Jardim Belval, Jardim Silveira e demais bairros próximos. A localização exata do atendimento é definida com base na conveniência do aluno, seja em academia parceira, condomínio ou domicílio.",
  },
  {
    question: "Qual a diferença entre personal trainer em Tamboré e em Barueri?",
    answer:
      "O serviço é o mesmo — protocolo individualizado, acompanhamento exclusivo e progressão estruturada. A diferença é geográfica: em Tamboré o perfil de atendimento costuma ser mais voltado a condomínios e academias de bairro residencial, enquanto em Barueri há mais academias comerciais e espaços corporativos. O protocolo é adaptado ao contexto de cada local.",
  },
  {
    question: "Personal trainer em Barueri precisa de avaliação antes de começar?",
    answer:
      "Sempre. A avaliação física e a anamnese são a base de qualquer protocolo sério. Sem entender o histórico de saúde, as limitações físicas e os objetivos reais do aluno, qualquer treino é uma estimativa. Isso vale tanto para iniciantes quanto para quem já treina há anos.",
  },
  {
    question: "Tem personal trainer que atende perto de Tamboré aos finais de semana?",
    answer:
      "Dependendo da disponibilidade de agenda, atendo aos sábados. Para alunos com semana muito carregada, o treino de final de semana pode ser incorporado ao protocolo. Conversamos sobre isso no primeiro contato.",
  },
  {
    question: "Personal trainer em Barueri e Tamboré também faz treino online?",
    answer:
      "Sim. Para alunos que viajam com frequência ou têm agenda imprevisível, o modelo híbrido — sessões presenciais combinadas com acompanhamento online nos dias de treino autônomo — é uma opção eficiente. E para quem prefere 100% remoto, o modelo online completo também está disponível.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-tambore-barueri`,
  name: "Montinho Personal Trainer – Tamboré e Barueri",
  description:
    "Personal trainer atendendo Tamboré e Barueri com mais de 20 anos de experiência. Protocolo individual para emagrecimento, hipertrofia e qualidade de vida.",
  url: `${SITE_URL}/personal-trainer-tambore-barueri`,
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

export default function PersonalTrainerTamboreBarueri() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Tamboré · Barueri · Região
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer em Tamboré e Barueri: 20 anos na região, um método que funciona.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Seja em Tamboré, Alphaville ou Barueri, o protocolo de treino precisa respeitar a realidade de quem vive aqui. Profissional com duas décadas na região conhece essa realidade melhor do que ninguém.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero um personal trainer
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Experiência local
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Conheço cada canto de Tamboré e Barueri. Isso muda o protocolo.
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-5 text-gray-300 leading-relaxed font-light">
              <p>
                Tamboré e Barueri têm perfis distintos, mas compartilham a mesma demanda: profissionais e famílias com agenda exigente que precisam de resultado eficiente dentro do tempo disponível. Não há espaço para treino que não funciona ou protocolo que exige mais do que a rotina permite.
              </p>
              <p>
                Atendo nessa região há mais de 20 anos. Conheço as academias de Barueri e os condomínios de Tamboré. Sei quais locais têm equipamento adequado, quais têm limitações e como montar o melhor protocolo para cada contexto. Isso é informação que nenhum personal recém-chegado tem.
              </p>
              <p>
                Ao longo dessas duas décadas, atendi centenas de alunos com perfis e objetivos distintos — emagrecimento, hipertrofia, reabilitação, condicionamento físico, qualidade de vida. O que todos têm em comum é que chegaram com uma demanda e saíram com um resultado concreto.
              </p>
            </div>
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src="/Personal%20Trainer%20Tambor%C3%A9%20%282%29.jpg"
                alt="Personal Trainer Tamboré e Barueri"
                title="Personal Trainer Tamboré e Barueri"
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

      {/* COBERTURA */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Áreas de atendimento
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Onde atendo em Tamboré, Barueri e região
          </h2>
          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Tamboré e Alphaville",
                text: "Academias de condomínio, academias parceiras e atendimento a domicílio em toda a extensão de Tamboré e Alphaville.",
              },
              {
                num: "02",
                title: "Barueri",
                text: "Academias comerciais e parceiros em Barueri centro, Jardim Silveira, Jardim Belval e demais bairros da cidade.",
              },
              {
                num: "03",
                title: "Santana de Parnaíba",
                text: "Atendimento em Santana de Parnaíba, incluindo condomínios e academias da cidade.",
              },
              {
                num: "04",
                title: "Online",
                text: "Para alunos de qualquer localidade que preferirem ou precisarem de acompanhamento remoto.",
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
            Dúvidas sobre personal trainer em Tamboré e Barueri
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
            Tamboré ou Barueri — estou perto de você.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Me conta onde você mora e qual é o seu objetivo. Organizamos o atendimento na localização mais conveniente para a sua rotina.
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
