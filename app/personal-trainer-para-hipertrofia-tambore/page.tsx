import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer para Hipertrofia Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer para hipertrofia em Tamboré com protocolo baseado em ciência. Ganho de massa muscular real, progressão de carga e método individualizado. Mais de 20 anos na região.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-para-hipertrofia-tambore`,
  },
  openGraph: {
    title: "Personal Trainer para Hipertrofia Tamboré | Montinho Personal Trainer",
    description:
      "Hipertrofia com método em Tamboré. Protocolo individual, sobrecarga progressiva e acompanhamento de quem vive na região há mais de 20 anos.",
    url: `${SITE_URL}/personal-trainer-para-hipertrofia-tambore`,
  },
};

const faq = [
  {
    question: "Quanto tempo leva para ganhar massa muscular com personal em Tamboré?",
    answer:
      "Iniciantes podem ganhar de 1 a 2 kg de massa muscular por mês nos primeiros meses com protocolo adequado. Praticantes intermediários evoluem mais lentamente — cerca de 0,5 a 1 kg por mês. O que importa é a progressão consistente ao longo do tempo, não resultados imediatos que não se sustentam.",
  },
  {
    question: "É possível ganhar massa muscular sem academia em Tamboré?",
    answer:
      "É possível, mas com limitações. A hipertrofia eficiente requer sobrecarga progressiva — que é mais fácil de implementar com pesos livres e máquinas. Com equipamento doméstico básico (halteres ajustáveis, barra, elásticos), dá para avançar até um ponto. Para maximizar o resultado, academia ou academia de condomínio bem equipada fazem diferença.",
  },
  {
    question: "Personal trainer para hipertrofia em Tamboré precisa de suplementação?",
    answer:
      "Suplementação não é obrigatória, mas pode ser conveniente. Whey protein, creatina e cafeína têm respaldo científico sólido para hipertrofia. O que nunca pode faltar é ingestão proteica adequada (1.6 a 2.2 g por kg de peso corporal) — seja pela alimentação, seja com suplementação como apoio.",
  },
  {
    question: "Como personal trainer monta protocolo de hipertrofia em Tamboré?",
    answer:
      "O protocolo é construído com base no nível atual do aluno, nos grupos musculares prioritários, na disponibilidade de treino e no equipamento disponível. Inclui definição de volume (séries e repetições), seleção de exercícios, progressão de carga e periodização — com revisão mensal baseada na resposta individual.",
  },
  {
    question: "Personal trainer para hipertrofia em Tamboré também orienta sobre alimentação?",
    answer:
      "Dou orientações práticas sobre ingestão proteica, timing nutricional e estratégias para sustentar o ganho muscular. Para acompanhamento nutricional completo e prescritivo, recomendo trabalho conjunto com nutricionista — especialmente para quem busca otimizar ganhos em nível avançado.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-para-hipertrofia-tambore`,
  name: "Montinho Personal Trainer – Hipertrofia Tamboré",
  description:
    "Personal trainer para hipertrofia em Tamboré. Protocolo individualizado com sobrecarga progressiva para ganho de massa muscular real.",
  url: `${SITE_URL}/personal-trainer-para-hipertrofia-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer para Hipertrofia",
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

export default function PersonalTrainerHipertrofiaTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Hipertrofia · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer para hipertrofia em Tamboré: ganho muscular com método real.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Quem busca hipertrofia em Tamboré sem acompanhamento costuma treinar muito e evoluir pouco. Com protocolo individualizado e sobrecarga progressiva, o estímulo certo chega no músculo certo — e o resultado aparece.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Moro em Tamboré e quero ganhar massa muscular com acompanhamento de personal trainer.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero ganhar massa muscular
          </a>
        </div>
      </section>

      {/* SOBRE */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Método e experiência
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Hipertrofia tem ciência. E ciência aplicada corretamente entrega resultado.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Quem treina há meses sem ver resultado no espelho geralmente tem um dos seguintes problemas: volume insuficiente, sobrecarga mal distribuída, execução incorreta ou recuperação inadequada. Raramente é genética. Quase sempre é método.
            </p>
            <p>
              A hipertrofia muscular é hoje um dos temas mais estudados em ciência do exercício. Sabemos com clareza o que funciona: volume de treino adequado por grupo muscular, frequência de estímulo otimizada, sobrecarga progressiva ao longo do tempo, ingestão proteica suficiente e recuperação respeitada. Aplicar isso tudo de forma individualizada — respeitando o nível atual do aluno, suas limitações e sua disponibilidade — é o que faço há mais de 20 anos em Tamboré e região.
            </p>
            <p>
              Minha paixão pela musculação começa na própria transformação: fui do excesso de peso à composição corporal que queria, entendendo cada etapa do caminho. Hoje reproduzo esse processo — com base científica e individualização — para cada aluno que busca o mesmo.
            </p>
          </div>
          <div className="mt-10" style={{ maxWidth: "220px" }}>
            <Image
              src="/montinho-personal-trainer-shape.jpg"
              alt="Personal Trainer Hipertrofia Tamboré"
              title="Personal Trainer Hipertrofia Tamboré"
              width={220}
              height={392}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* O QUE INCLUI */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que o protocolo de hipertrofia inclui em Tamboré
          </h2>
          <div className="grid sm:grid-cols-2 gap-px border border-white/10 mt-10">
            {[
              {
                title: "Avaliação do nível atual",
                text: "Análise do histórico de treino, pontos fortes, pontos fracos e grupos musculares que precisam de atenção prioritária.",
              },
              {
                title: "Programação de volume e frequência",
                text: "Distribuição de séries por grupo muscular com frequência otimizada para maximizar o estímulo hipertrófico sem comprometer a recuperação.",
              },
              {
                title: "Seleção de exercícios",
                text: "Exercícios escolhidos com base em biomecânica individual — o que maximiza o estímulo no músculo certo para cada aluno.",
              },
              {
                title: "Sobrecarga progressiva sistematizada",
                text: "Progressão de carga e volume estruturada para garantir adaptação contínua — não estagnação depois de alguns meses.",
              },
              {
                title: "Correção técnica presencial",
                text: "Execução corrigida em tempo real durante cada sessão. Movimento errado com carga alta é a receita para lesão.",
              },
              {
                title: "Reavaliação e periodização mensal",
                text: "Ajuste do protocolo todo mês com base na evolução real — incluindo fotos, medidas e percepção de força.",
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
            Dúvidas sobre personal trainer para hipertrofia em Tamboré
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
            Pronto para ganhar músculo de verdade em Tamboré?
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Com protocolo certo, progressão estruturada e acompanhamento real, o ganho muscular deixa de ser promessa e vira realidade mensurável.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl("Olá! Moro em Tamboré e quero saber mais sobre o personal trainer para hipertrofia.")}
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
