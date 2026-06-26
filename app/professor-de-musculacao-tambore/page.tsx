import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Professor de Musculação Tamboré | Montinho Personal Trainer",
  description:
    "Professor de musculação em Tamboré com mais de 20 anos de experiência. Aula individualizada, execução correta e progressão real. Atendimento presencial em Tamboré, Barueri e região.",
  alternates: {
    canonical: `${SITE_URL}/professor-de-musculacao-tambore`,
  },
  openGraph: {
    title: "Professor de Musculação Tamboré | Montinho Personal Trainer",
    description:
      "Professor de musculação em Tamboré com método baseado em ciência. Protocolo individual, técnica corrigida e resultados que se sustentam.",
    url: `${SITE_URL}/professor-de-musculacao-tambore`,
  },
};

const faq = [
  {
    question: "Professor de musculação e personal trainer em Tamboré são a mesma coisa?",
    answer:
      "Na prática, sim — quando o atendimento é individualizado. O professor de musculação que atende alunos de forma individual, monta protocolos personalizados e acompanha o treino presencialmente exerce a mesma função do personal trainer. A diferença está mais no contexto de atuação do que no serviço prestado.",
  },
  {
    question: "Professor de musculação em Tamboré corrige a execução dos exercícios?",
    answer:
      "Esse é o principal diferencial do acompanhamento individualizado. A execução incorreta é a causa mais comum de lesão na musculação — e é exatamente o que o acompanhamento presencial previne. Durante cada sessão, observo a execução, corrijo desvios e ajusto a carga antes que o erro se torne um hábito.",
  },
  {
    question: "Professor de musculação em Tamboré precisa de quanto tempo por semana?",
    answer:
      "Para iniciantes, duas a três sessões semanais de 50 a 60 minutos são suficientes para progressão consistente. Para alunos intermediários e avançados, três a quatro sessões podem ser necessárias dependendo do objetivo. O protocolo é montado dentro da disponibilidade real do aluno — não da ideal.",
  },
  {
    question: "Professor de musculação em Tamboré atende alunos com mais de 50 anos?",
    answer:
      "Sim. O treino de força é especialmente importante para pessoas acima de 50 anos — tanto para preservar massa muscular (que declina naturalmente com a idade) quanto para saúde óssea, equilíbrio e qualidade de vida. O protocolo é adaptado às limitações e ao nível de cada aluno.",
  },
  {
    question: "Como começar musculação em Tamboré com acompanhamento profissional?",
    answer:
      "O primeiro passo é uma conversa pelo WhatsApp para entender seu objetivo e histórico. Depois, marcamos uma avaliação presencial e montamos o protocolo. A primeira sessão de treino pode começar na mesma semana — sem burocracia.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/professor-de-musculacao-tambore`,
  name: "Montinho – Professor de Musculação Tamboré",
  description:
    "Professor de musculação em Tamboré com mais de 20 anos de experiência. Atendimento individualizado para emagrecimento, hipertrofia e qualidade de vida.",
  url: `${SITE_URL}/professor-de-musculacao-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Professor de Musculação",
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

export default function ProfessorMusculacaoTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Musculação · Professor · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Professor de musculação em Tamboré: técnica certa, progressão real.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Musculação sem técnica é tempo perdido — e risco real de lesão. Com acompanhamento individualizado em Tamboré, cada movimento é executado corretamente, cada carga é progressiva e cada resultado é concreto.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Moro em Tamboré e tenho interesse em aulas de musculação com professor particular.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero começar a musculação
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Experiência e método
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Mais de 20 anos ensinando musculação em Tamboré e Alphaville.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              A musculação mudou muito em 20 anos. O que a ciência sabe hoje sobre hipertrofia, emagrecimento, saúde óssea e longevidade é incomparavelmente mais sólido do que o que era ensinado nas academias no início dos anos 2000. Quem acompanhou essa evolução e atualizou o método ao longo do tempo carrega uma vantagem que nenhuma graduação isolada entrega: a experiência prática aliada ao conhecimento científico atual.
            </p>
            <p>
              Comecei na musculação pela própria necessidade de transformar o corpo. O processo de aprender como o corpo realmente funciona — e de aplicar esse conhecimento primeiro em mim mesmo, depois em centenas de alunos em Tamboré e região — é o que dá base para o meu trabalho. Não existe protocolo que eu prescreva sem ter vivido na pele o que ele demanda.
            </p>
            <p>
              Hoje atendo em academias e condomínios de Tamboré com um método que valoriza técnica de execução, progressão estruturada e adaptação individual. Não existe ficha universal que funciona para todo mundo. O protocolo certo é o que foi montado para você.
            </p>
          </div>
          <div className="mt-10" style={{ maxWidth: "220px" }}>
            <Image
              src="/Personal%20Trainer%20Tambor%C3%A9%20%282%29.jpg"
              alt="Professor de Musculação Tamboré"
              title="Professor de Musculação Tamboré"
              width={220}
              height={390}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* DIFERENCIAIS */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Por que musculação com professor individual em Tamboré faz diferença
          </h2>
          <ul className="space-y-4 mt-10 mb-10">
            {[
              "Execução corrigida em tempo real — não depois que o erro já virou hábito",
              "Carga progressiva estruturada — não o peso que você acha que aguenta naquele dia",
              "Protocolo montado para seus grupos musculares prioritários — não para um aluno genérico",
              "Adaptação do treino para limitações físicas — lesões antigas não precisam impedir evolução",
              "Progressão mensurável — você sabe exatamente quanto evoluiu a cada reavaliação",
              "Atenção exclusiva durante todo o treino — sem dividir atenção com outros alunos",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 font-light">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-gray-400 font-light">
            Veja resultados de alunos reais na{" "}
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
            Dúvidas sobre professor de musculação em Tamboré
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
            Pronto para treinar musculação do jeito certo em Tamboré?
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Técnica correta, progressão estruturada e acompanhamento individual. É assim que resultado acontece — e se mantém.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl("Olá! Moro em Tamboré e quero saber mais sobre aulas de musculação com professor particular.")}
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
