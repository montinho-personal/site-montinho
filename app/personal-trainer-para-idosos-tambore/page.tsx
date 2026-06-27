import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer para Idosos Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer para idosos em Tamboré com protocolo adaptado para a terceira idade. Força, equilíbrio, mobilidade e qualidade de vida com segurança e método. Mais de 20 anos na região.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-para-idosos-tambore`,
  },
  openGraph: {
    title: "Personal Trainer para Idosos Tamboré | Montinho Personal Trainer",
    description:
      "Treino de força para idosos em Tamboré. Protocolo adaptado para terceira idade com foco em equilíbrio, mobilidade e qualidade de vida.",
    url: `${SITE_URL}/personal-trainer-para-idosos-tambore`,
  },
};

const faq = [
  {
    question: "Personal trainer para idosos em Tamboré é seguro?",
    answer:
      "O treino de força para idosos é não apenas seguro como altamente recomendado pela ciência — quando bem orientado. Protocolos adequados para a terceira idade levam em conta a capacidade individual, as limitações articulares, o histórico de saúde e a velocidade de progressão adequada para cada fase da vida. O risco existe quando não há acompanhamento — não quando há.",
  },
  {
    question: "Que tipo de exercício personal trainer indica para idosos em Tamboré?",
    answer:
      "Treino de força com pesos adaptados, exercícios de equilíbrio, mobilidade articular e atividades funcionais que melhoram a autonomia no dia a dia. A composição do protocolo depende do histórico de saúde e dos objetivos individuais — não existe programa padrão para idosos, assim como não existe para nenhum outro perfil.",
  },
  {
    question: "Personal trainer para idosos em Tamboré atende pessoas com doenças crônicas?",
    answer:
      "O protocolo de treino é sempre adaptado às condições de saúde existentes — hipertensão, diabetes tipo 2, osteoporose, artrose, entre outras. Em casos de patologias específicas, o trabalho é feito em conjunto com o médico do aluno, respeitando as orientações e restrições clínicas.",
  },
  {
    question: "Quais os benefícios do treino com personal para idosos em Tamboré?",
    answer:
      "A ciência documenta benefícios amplos: aumento e manutenção de massa muscular (sarcopenia é uma das principais causas de perda de autonomia), melhora da densidade óssea, redução do risco de quedas, controle glicêmico, saúde cardiovascular, melhora do humor e sono, e maior capacidade funcional no cotidiano.",
  },
  {
    question: "Personal trainer para idosos em Tamboré atende a domicílio?",
    answer:
      "Sim. Para pessoas que têm dificuldade de deslocamento ou preferem treinar em casa, o atendimento domiciliar é uma opção disponível. O protocolo é adaptado ao equipamento e espaço disponíveis no domicílio.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-para-idosos-tambore`,
  name: "Montinho Personal Trainer – Idosos Tamboré",
  description:
    "Personal trainer para idosos em Tamboré. Protocolo adaptado para terceira idade com foco em força, equilíbrio e qualidade de vida.",
  url: `${SITE_URL}/personal-trainer-para-idosos-tambore`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
  ],
  serviceType: "Personal Trainer para Idosos",
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

export default function PersonalTrainerIdososTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Terceira Idade · Tamboré
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer para idosos em Tamboré: força, equilíbrio e autonomia.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            O treino de força é o investimento mais importante que uma pessoa acima de 60 anos pode fazer na própria saúde. Com protocolo adaptado e acompanhamento profissional em Tamboré, os benefícios são reais e mensuráveis.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero treinar com segurança
          </a>
        </div>
      </section>

      {/* IMPORTÂNCIA */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Por que treinar na terceira idade
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            A ciência é clara: treino de força muda a qualidade de vida de idosos.
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-5 text-gray-300 leading-relaxed font-light">
              <p>
                A partir dos 50 anos, o corpo começa a perder massa muscular de forma progressiva — um processo chamado sarcopenia. Sem intervenção, essa perda compromete a força, o equilíbrio, a densidade óssea e a capacidade funcional no dia a dia. A boa notícia: o treino de força reverte ou desacelera significativamente esse processo em qualquer idade.
              </p>
              <p>
                O protocolo para a terceira idade não é uma versão simplificada do treino de adultos jovens. É um protocolo específico que leva em conta a capacidade de recuperação, as limitações articulares, o histórico de saúde e a importância de construir confiança no próprio corpo. Cada detalhe importa — e exige experiência para ser bem aplicado.
              </p>
              <p>
                Atendo idosos em Tamboré e Alphaville há mais de 20 anos, em academia e a domicílio. O retorno que mais ouço dos alunos dessa faixa etária não é sobre estética — é sobre poder subir escada sem apoio, carregar os netos, dormir melhor e ter mais energia no dia a dia. Esse é o resultado que importa.
              </p>
            </div>
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src="/Personal%20Trainer%20Tambor%C3%A9.jpg"
                alt="Personal Trainer para Idosos Tamboré"
                title="Personal Trainer para Idosos Tamboré"
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

      {/* BENEFÍCIOS */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que o treino com personal traz para idosos em Tamboré
          </h2>
          <ul className="space-y-4 mb-10">
            {[
              "Manutenção e aumento de massa muscular — combatendo a sarcopenia",
              "Melhora da densidade óssea — reduzindo risco de fraturas",
              "Equilíbrio e coordenação — prevenindo quedas",
              "Controle da pressão arterial e glicemia",
              "Melhora da capacidade funcional — autonomia no dia a dia",
              "Redução de dores articulares crônicas",
              "Melhora do sono e do humor",
              "Maior disposição e energia para atividades cotidianas",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300 font-light">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                {item}
              </li>
            ))}
          </ul>
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
            Dúvidas sobre personal trainer para idosos em Tamboré
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
            Nunca é tarde para investir na própria saúde.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            O melhor momento para começar a treinar com acompanhamento foi há 10 anos. O segundo melhor momento é agora. Me conta o que você precisa.
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
