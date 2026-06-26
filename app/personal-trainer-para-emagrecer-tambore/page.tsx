import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer para Emagrecer Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer para emagrecer em Tamboré com método baseado em ciência. Emagrecimento sem efeito sanfona, sem dietas radicais. Mais de 20 anos na região. Resultados reais e duradouros.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-para-emagrecer-tambore`,
  },
  openGraph: {
    title: "Personal Trainer para Emagrecer Tamboré | Montinho Personal Trainer",
    description:
      "Emagrecimento com método em Tamboré. Protocolo individual, progressão real e acompanhamento de quem vive na região há mais de 20 anos.",
    url: `${SITE_URL}/personal-trainer-para-emagrecer-tambore`,
  },
};

const faq = [
  {
    question: "Quantas sessões por semana são necessárias para emagrecer em Tamboré com personal?",
    answer:
      "Três sessões semanais de treino de força, combinadas com orientação alimentar adequada, são suficientes para emagrecimento consistente na maioria dos casos. O resultado depende muito mais da qualidade do protocolo e da consistência do que da quantidade de horas na academia.",
  },
  {
    question: "Qual é o melhor exercício para emagrecer em Tamboré?",
    answer:
      "Não existe um único exercício. O que funciona é a combinação de treino de força — que preserva massa muscular e mantém o metabolismo ativo — com déficit calórico sustentável. Cardio é um complemento útil, não a base. Personal trainer garante que esse protocolo seja montado corretamente para o seu caso.",
  },
  {
    question: "É possível emagrecer rápido com personal trainer em Tamboré?",
    answer:
      "Emagrecimento sustentável acontece em ritmo de 0,5 a 1 kg por semana para a maioria das pessoas. Perder peso rápido demais geralmente significa perda de massa muscular — o que reduz o metabolismo e leva ao efeito sanfona. O objetivo é emagrecer de forma progressiva e manter o resultado.",
  },
  {
    question: "Personal trainer para emagrecer em Tamboré trabalha com alimentação também?",
    answer:
      "Dou orientações gerais sobre alimentação voltadas para o objetivo do emagrecimento — como distribuição de macronutrientes, tamanho de porções e estratégias práticas. Para acompanhamento nutricional detalhado e prescritivo, recomendo o trabalho conjunto com nutricionista.",
  },
  {
    question: "Quanto tempo leva para ver resultado emagrecendo com personal em Tamboré?",
    answer:
      "Os primeiros sinais de melhora — mais disposição, roupas menos apertadas, menos inchaço — costumam aparecer nas primeiras 3 a 4 semanas. Resultados visíveis na composição corporal ficam mais evidentes a partir do segundo mês de protocolo consistente.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-para-emagrecer-tambore`,
  name: "Montinho Personal Trainer – Emagrecimento Tamboré",
  description:
    "Personal trainer para emagrecer em Tamboré. Protocolo individualizado com método baseado em ciência para emagrecimento duradouro.",
  url: `${SITE_URL}/personal-trainer-para-emagrecer-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer para Emagrecimento",
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

export default function PersonalTrainerEmagrecerTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Emagrecimento · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer para emagrecer em Tamboré: resultado que fica.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Emagrecer sem método é perder peso temporariamente. Com protocolo individualizado e acompanhamento profissional em Tamboré, o resultado é construído para durar — não para impressionar na balança por duas semanas.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Moro em Tamboré e quero emagrecer com acompanhamento de personal trainer.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero emagrecer com método
          </a>
        </div>
      </section>

      {/* HISTÓRIA */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Minha história
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Já fui exatamente onde muitos dos meus alunos estão agora.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Cresci convivendo com o excesso de peso. Passei anos tentando dietas da moda, protocolos copiados da internet, suplementos que prometiam resultado rápido e entregavam frustração. Cada vez que parava, o peso voltava — às vezes com acréscimo. Esse ciclo tem nome: efeito sanfona. E é o que acontece quando o método está errado.
            </p>
            <p>
              O que mudou foi quando decidi entender de fato como o corpo funciona: como o metabolismo responde ao déficit calórico, por que a massa muscular é o principal aliado do emagrecimento, como o treino de força transforma a composição corporal de dentro para fora. Essa compreensão, aplicada de forma sistemática, foi o que funcionou — para mim primeiro e depois para centenas de alunos em Tamboré e Alphaville ao longo de mais de 20 anos.
            </p>
            <p>
              Hoje sei que emagrecimento sustentável não tem segredo. Tem método. E método requer individualização — porque o que funciona para um não funciona para outro.
            </p>
          </div>
          <div className="mt-10" style={{ maxWidth: "220px" }}>
            <Image
              src="/montinho-personal-trainer-shape.jpg"
              alt="Personal Trainer para Emagrecer Tamboré"
              title="Personal Trainer para Emagrecer Tamboré"
              width={220}
              height={392}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Como o emagrecimento acontece com acompanhamento de personal em Tamboré
          </h2>
          <p className="text-gray-400 font-light mb-10 leading-relaxed">
            Não existe fórmula mágica. Existe método aplicado com consistência:
          </p>
          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Avaliação inicial: entender onde você está",
                text: "Histórico de peso, tentativas anteriores, rotina alimentar, disponibilidade de treino e limitações físicas. Sem essa base, qualquer protocolo é chute.",
              },
              {
                num: "02",
                title: "Protocolo de treino de força",
                text: "O treino de força é a base do emagrecimento sustentável — não o cardio em excesso. Preservar e construir massa muscular mantém o metabolismo ativo e evita que o peso perdido volte.",
              },
              {
                num: "03",
                title: "Orientação alimentar prática",
                text: "Não prescrevo dieta — oriento estratégias alimentares práticas que criam déficit calórico sem passar fome. Para acompanhamento nutricional detalhado, recomendo nutricionista parceiro.",
              },
              {
                num: "04",
                title: "Monitoramento e ajuste contínuo",
                text: "Reavaliações mensais para medir composição corporal, ajustar o protocolo conforme a resposta do seu corpo e garantir progressão constante.",
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
            Veja resultados reais de alunos que emagreceram com acompanhamento na{" "}
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
            Dúvidas sobre personal trainer para emagrecer em Tamboré
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
            Chega de tentar sozinho em Tamboré.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Com protocolo certo e acompanhamento profissional, o emagrecimento deixa de ser uma luta contra o próprio corpo e passa a ser uma progressão consistente. Vamos começar?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl("Olá! Moro em Tamboré e quero saber mais sobre o personal trainer para emagrecer.")}
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
