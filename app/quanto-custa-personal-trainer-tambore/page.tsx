import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Quanto Custa Personal Trainer Tamboré | Montinho Personal Trainer",
  description:
    "Quanto custa personal trainer em Tamboré? Entenda os fatores que influenciam o preço, o que está incluso no investimento e como comparar o custo com o resultado real.",
  alternates: {
    canonical: `${SITE_URL}/quanto-custa-personal-trainer-tambore`,
  },
  openGraph: {
    title: "Quanto Custa Personal Trainer Tamboré | Montinho Personal Trainer",
    description:
      "Transparência sobre o investimento em personal trainer em Tamboré. O que determina o preço, o que está incluso e como avaliar o custo-benefício real.",
    url: `${SITE_URL}/quanto-custa-personal-trainer-tambore`,
  },
};

const faq = [
  {
    question: "Quanto custa personal trainer em Tamboré por mês?",
    answer:
      "O valor mensal varia conforme a modalidade (presencial em academia, domiciliar ou online), a frequência semanal (duas, três ou quatro sessões) e o profissional. Em Tamboré e Alphaville, o valor de mercado para personal trainer qualificado e experiente fica entre R$ 800 e R$ 2.500 por mês. O valor exato depende do pacote — e é apresentado com total transparência na primeira conversa.",
  },
  {
    question: "Personal trainer mais barato em Tamboré vale a pena?",
    answer:
      "Depende do que está por trás do preço. Um profissional jovem e recém-formado pode cobrar menos e entregar bom trabalho. Mas preço baixo também pode significar ausência de método, ficha genérica e sem reavaliação. Avalie o que está incluso: protocolo individualizado, presença exclusiva, correção técnica e reavaliação mensal — esses elementos são inegociáveis para resultado real.",
  },
  {
    question: "Personal trainer domiciliar em Tamboré custa mais caro?",
    answer:
      "Em geral, sim — o atendimento domiciliar inclui o deslocamento do profissional, o que é incorporado ao valor. A conveniência de treinar em casa ou na academia do condomínio sem sair do portão tem um custo a mais, mas para muitos alunos a economia de tempo no deslocamento até a academia justifica o investimento.",
  },
  {
    question: "O que está incluso no preço do personal trainer em Tamboré?",
    answer:
      "No meu atendimento, o valor inclui: avaliação física inicial, protocolo de treino individualizado, sessões com atenção exclusiva, suporte pelo WhatsApp entre as sessões e reavaliação mensal. Não há cobranças extras ou surpresas depois da contratação. O que é combinado na primeira conversa é o que está incluso.",
  },
  {
    question: "Como saber se o preço do personal trainer em Tamboré é justo?",
    answer:
      "Compare o que está incluso, não apenas o número. Um personal a R$ 600/mês que manda ficha genérica e não faz reavaliação é mais caro do que um a R$ 1.500/mês que entrega protocolo individual, presença exclusiva e resultado mensurável. O custo real do treino sem método é o tempo perdido sem progressão — e isso tem um valor muito alto.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/quanto-custa-personal-trainer-tambore`,
  name: "Montinho Personal Trainer – Tamboré",
  description:
    "Personal trainer em Tamboré com preço transparente. Protocolo individualizado, presença exclusiva e resultado real.",
  url: `${SITE_URL}/quanto-custa-personal-trainer-tambore`,
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

export default function QuantoCustaPersonalTrainerTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Preço · Personal Trainer · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Quanto custa personal trainer em Tamboré — e o que você recebe por isso.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Preço sem contexto não informa nada. O que importa é o custo-benefício real: o que está incluso, o resultado que entrega e quanto tempo e dinheiro você economiza ao não tentar resolver sozinho.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero saber o investimento
          </a>
        </div>
      </section>

      {/* O QUE DETERMINA O PREÇO */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            O que influencia o valor
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que determina o preço do personal trainer em Tamboré.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              O valor de um personal trainer em Tamboré é influenciado por alguns fatores principais: a experiência e formação do profissional, a modalidade de atendimento (presencial em academia, domiciliar ou online), a frequência semanal de sessões e o que está incluso no pacote além das sessões em si.
            </p>
            <p>
              Profissionais com mais anos de experiência, especialização na área e histórico de resultados comprovados cobram mais — e isso é justificado. O custo do personal trainer experiente em Tamboré é superado pelo valor do resultado que entrega: menos tempo chegando ao objetivo, menos risco de lesão e progressão mais eficiente.
            </p>
            <p>
              Meu investimento é apresentado com total transparência na primeira conversa — sem letras miúdas, sem cobranças extras. O que é combinado é o que está incluso. O objetivo é que você tome uma decisão informada, não uma compra por impulso.
            </p>
          </div>
        </div>
      </section>

      {/* O QUE ESTÁ INCLUSO */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            O que inclui o investimento
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que está incluso no valor do meu atendimento em Tamboré
          </h2>
          <div className="grid sm:grid-cols-2 gap-px border border-white/10">
            {[
              {
                title: "Avaliação física e anamnese",
                text: "Antes de começar, entendo seu histórico completo: saúde, objetivos, limitações e rotina. Sem cobranças extras.",
              },
              {
                title: "Protocolo 100% individual",
                text: "Seu treino construído do zero. Não é adaptação de outro aluno — é um protocolo montado para você.",
              },
              {
                title: "Sessões com atenção exclusiva",
                text: "Durante o seu treino, sou exclusivamente seu. Sem outros alunos, sem distrações, sem celular.",
              },
              {
                title: "Suporte entre sessões",
                text: "Canal aberto pelo WhatsApp para dúvidas, ajustes e orientações entre os dias de treino.",
              },
              {
                title: "Reavaliação mensal",
                text: "Todo mês revisamos composição corporal, evolução e protocolo. Sem custo adicional.",
              },
              {
                title: "Ajuste de protocolo contínuo",
                text: "Quando o corpo se adapta, o treino muda. Não espero o próximo ciclo para fazer o ajuste necessário.",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 border-b border-r border-white/10">
                <p className="text-white font-semibold mb-2">{item.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-gray-400 font-light">
            Veja as modalidades disponíveis na{" "}
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
            Dúvidas sobre preço de personal trainer em Tamboré
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
            Transparência primeiro. Decisão depois.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Me conta o que você precisa e receba uma proposta clara — com o que está incluso, o valor e o que esperar como resultado. Sem pressão.
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
