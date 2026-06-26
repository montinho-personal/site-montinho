import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal em Tamboré | Montinho Personal Trainer",
  description:
    "Personal em Tamboré com mais de 20 anos na região. Treino individualizado presencial e online para emagrecimento, hipertrofia e qualidade de vida. Sem fórmulas genéricas, sem resultado provisório.",
  alternates: {
    canonical: `${SITE_URL}/personal-em-tambore`,
  },
  openGraph: {
    title: "Personal em Tamboré | Montinho Personal Trainer",
    description:
      "Personal em Tamboré com método baseado em ciência e 20 anos de experiência na região. Protocolo individual e resultado real.",
    url: `${SITE_URL}/personal-em-tambore`,
  },
};

const faq = [
  {
    question: "Como encontrar um bom personal em Tamboré?",
    answer:
      "Procure profissional com CREF ativo, experiência comprovada na região e metodologia clara — não apenas fichas de treino genéricas. Verifique resultados reais de alunos anteriores e pergunte como o protocolo é montado e ajustado. Um bom personal explica o raciocínio por trás de cada decisão de treino.",
  },
  {
    question: "Personal em Tamboré atende na academia ou a domicílio?",
    answer:
      "Atendo em ambas as modalidades. Presencial em academias e condomínios de Tamboré e região, a domicílio para quem prefere treinar em casa, e online para quem tem agenda mais imprevisível. A melhor opção é alinhada na primeira conversa.",
  },
  {
    question: "Qual o valor do personal em Tamboré?",
    answer:
      "O investimento varia conforme a modalidade (presencial, domiciliar ou online), a frequência semanal e o pacote contratado. O valor é apresentado com transparência na primeira conversa — sem surpresas ou cobranças adicionais depois.",
  },
  {
    question: "Personal em Tamboré atende aos finais de semana?",
    answer:
      "Dependendo da disponibilidade de agenda, sim. Para alunos com rotina de segunda a sexta muito carregada, horários aos sábados podem ser organizados. Conversamos sobre isso no primeiro contato.",
  },
  {
    question: "Personal em Tamboré pode atender iniciantes?",
    answer:
      "Esse é um dos perfis que mais atendo. Quem nunca treinou ou voltou ao treino após anos afastado precisa de uma base técnica sólida desde o início — e é exatamente aí que o acompanhamento profissional faz mais diferença. Começar certo evita lesões e garante progressão mais rápida.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-em-tambore`,
  name: "Montinho Personal Trainer – Tamboré",
  description:
    "Personal em Tamboré com mais de 20 anos na região. Treino individualizado para emagrecimento, hipertrofia e qualidade de vida.",
  url: `${SITE_URL}/personal-em-tambore`,
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

export default function PersonalEmTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal · Tamboré · Barueri · Santana de Parnaíba
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal em Tamboré que mora aqui, conhece aqui e entrega resultado aqui.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Tamboré não precisa de mais uma ficha genérica. Precisa de um profissional que entenda a rotina de quem vive aqui e monte um protocolo que funcione de verdade — dentro da agenda real, não da agenda ideal.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Moro em Tamboré e tenho interesse em personal trainer na região.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero um personal em Tamboré
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Quem sou eu
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Mais de 20 anos em Tamboré e Alphaville. Conheço esse lugar como poucos.
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-5 text-gray-300 leading-relaxed font-light">
              <p>
                Tamboré tem um jeito de ser que quem não mora aqui não entende completamente. O ritmo mais tranquilo, a vida de condomínio, os horários de pico no trânsito para São Paulo, as academias da região — tudo isso molda a rotina de quem vive aqui. E toda essa realidade precisa ser considerada quando se monta um protocolo de treino.
              </p>
              <p>
                Sou personal trainer com mais de 20 anos de experiência, vivendo e trabalhando entre Tamboré, Alphaville e a região de Barueri e Santana de Parnaíba. Ao longo desse tempo, atendi centenas de alunos com perfis distintos — executivos, mães, profissionais liberais, pessoas com histórico de lesão, iniciantes e atletas recreacionais. O denominador comum de quem obtém resultado é sempre o mesmo: protocolo individualizado, acompanhamento próximo e consistência.
              </p>
              <p>
                Minha trajetória começa com a minha própria transformação — do excesso de peso ao entendimento real de como o corpo funciona. Esse caminho me deu não apenas o conhecimento técnico, mas a empatia para entender o que cada aluno enfrenta quando decide mudar.
              </p>
            </div>
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src="/Personal%20Trainer%20Tambor%C3%A9.jpg"
                alt="Personal em Tamboré"
                title="Personal em Tamboré"
                width={220}
                height={476}
                loading="lazy"
                decoding="async"
                className="object-cover object-top"
                style={{ width: "220px", height: "390px", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* MODALIDADES */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Modalidades
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Como posso te atender em Tamboré
          </h2>
          <div className="space-y-8 mt-10">
            {[
              {
                num: "01",
                title: "Presencial em academia ou condomínio",
                text: "Atendo na academia do aluno em Tamboré e região. Sessões individuais com acompanhamento exclusivo durante todo o treino.",
              },
              {
                num: "02",
                title: "A domicílio",
                text: "Para quem prefere treinar em casa ou na academia do condomínio. Levo o protocolo até você — sem necessidade de deslocamento.",
              },
              {
                num: "03",
                title: "Híbrido",
                text: "Combinação de sessões presenciais com suporte online nos dias de treino autônomo. Ideal para quem tem agenda variável.",
              },
              {
                num: "04",
                title: "Online",
                text: "Acompanhamento 100% remoto para quem viaja com frequência ou prefere flexibilidade total de horário e local.",
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
          <p className="mt-10 text-gray-400 font-light">
            Detalhes completos de cada modalidade na{" "}
            <Link href="/consultoria" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
              página de consultoria
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
            Dúvidas sobre personal em Tamboré
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
            Vamos começar?
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            A primeira conversa é sem compromisso. Me conta sua rotina e seu objetivo — e eu te mostro o que é possível fazer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl("Olá! Moro em Tamboré e quero saber mais sobre personal trainer na região.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
            >
              Falar pelo WhatsApp
            </a>
            <Link
              href="/personal-trainer-tambore"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-base font-medium tracking-wide hover:border-white hover:bg-white/5 transition-all duration-200"
            >
              Saiba mais sobre o atendimento em Tamboré
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
