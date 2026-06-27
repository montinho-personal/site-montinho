import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Personal Trainer em Tamboré | Montinho Personal Trainer",
  description:
    "Personal trainer em Tamboré com mais de 20 anos na região. Protocolo individualizado, acompanhamento exclusivo e resultado real. Presencial, a domicílio ou online.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-em-tambore`,
  },
  openGraph: {
    title: "Personal Trainer em Tamboré | Montinho Personal Trainer",
    description:
      "Personal trainer em Tamboré com método baseado em ciência e 20 anos de experiência local. Treino individualizado para quem quer resultado de verdade.",
    url: `${SITE_URL}/personal-trainer-em-tambore`,
  },
};

const faq = [
  {
    question: "Como funciona o atendimento de personal trainer em Tamboré?",
    answer:
      "O atendimento começa com uma conversa pelo WhatsApp para entender seu objetivo e histórico. Depois, fazemos uma avaliação presencial e montamos o protocolo de treino do zero. As sessões podem ser em academia parceira, na academia do seu condomínio ou a domicílio — conforme sua preferência e rotina.",
  },
  {
    question: "Personal trainer em Tamboré cobra por sessão ou por pacote mensal?",
    answer:
      "O modelo mais comum é o pacote mensal, com frequência de duas a quatro sessões por semana. Essa estrutura permite planejamento de progressão, revisão mensal e continuidade no protocolo — o que é muito mais efetivo do que sessões avulsas sem continuidade.",
  },
  {
    question: "Personal trainer em Tamboré atende alunos sem experiência anterior?",
    answer:
      "Sim. Iniciantes representam um dos perfis mais importantes a se acompanhar: a base técnica construída corretamente no início evita lesões, acelera a progressão e cria hábitos de treino sólidos. Começar com acompanhamento profissional é o caminho mais eficiente — independente do ponto de partida.",
  },
  {
    question: "Qual a diferença de personal trainer em Tamboré para professor de academia comum?",
    answer:
      "O professor de academia atende dezenas de alunos simultaneamente — quando atende. O personal trainer em Tamboré está dedicado exclusivamente a você durante toda a sessão: corrige execução, ajusta carga, monitora recuperação e adapta o protocolo conforme sua resposta individual. É uma diferença de atenção e resultado que não tem comparação.",
  },
  {
    question: "Personal trainer em Tamboré atende nos condomínios da região?",
    answer:
      "Sim. Atendo nas academias de condomínios em Tamboré e região, incluindo Alphaville, Barueri e Santana de Parnaíba. Para alunos que preferem treinar sem sair do condomínio, essa é uma opção prática que elimina o deslocamento e otimiza o tempo.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-em-tambore`,
  name: "Montinho Personal Trainer – Tamboré",
  description:
    "Personal trainer em Tamboré com mais de 20 anos de experiência. Atendimento individualizado presencial e online.",
  url: `${SITE_URL}/personal-trainer-em-tambore`,
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

export default function PersonalTrainerEmTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Tamboré · Barueri · Alphaville
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal trainer em Tamboré: protocolo seu, atenção exclusiva, resultado real.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Em Tamboré, o tempo é escasso e a exigência é alta. Personal trainer que vive na região há mais de 20 anos sabe como montar um protocolo que funciona dentro da sua rotina — não apesar dela.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero um personal trainer em Tamboré
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
            Mais de 20 anos vivendo e trabalhando em Tamboré e Alphaville.
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-5 text-gray-300 leading-relaxed font-light">
              <p>
                Conheço Tamboré de dentro. A rotina de condomínio, os horários do trânsito para São Paulo, as academias da região, os estilos de vida de quem vive aqui. Quando monto um protocolo de treino, estou pensando na realidade de quem acorda às 6h, entra no carro às 7h e ainda quer ter energia no fim do dia.
              </p>
              <p>
                Sou formado em Educação Física, com pós-graduação e mais de duas décadas de prática com alunos reais — executivos, mães, profissionais liberais, pessoas com histórico de lesão e de sedentarismo. O que aprendi ao longo desse tempo é que resultado exige método, método exige individualização e individualização exige conhecer a pessoa.
              </p>
              <p>
                Antes de ser personal trainer, fui aluno frustrado. Convivi com excesso de peso, tentei métodos que não funcionavam e entendi na pele o que é querer resultado e não ter direção. Essa experiência moldou minha forma de trabalhar — com empatia e sem atalhos.
              </p>
            </div>
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src="/Personal%20Trainer%20Tambor%C3%A9.jpg"
                alt="Personal Trainer em Tamboré"
                title="Personal Trainer em Tamboré"
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

      {/* DIFERENCIAIS */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            O que muda com personal trainer
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Por que personal trainer em Tamboré faz diferença real
          </h2>
          <div className="grid sm:grid-cols-2 gap-px border border-white/10">
            {[
              {
                title: "Protocolo 100% individual",
                text: "Seu treino é construído do zero, com base no seu objetivo, histórico e rotina. Sem fichas genéricas.",
              },
              {
                title: "Atenção exclusiva durante a sessão",
                text: "Nenhum outro aluno divide minha atenção no seu treino. Cada repetição é observada e corrigida.",
              },
              {
                title: "Progressão estruturada",
                text: "Carga, volume e intensidade aumentam de forma planejada — não quando você acha que está fácil.",
              },
              {
                title: "Adaptação ao seu contexto",
                text: "Viagem, semana pesada, cansaço acumulado — o protocolo é ajustado para a sua realidade atual.",
              },
              {
                title: "Suporte pelo WhatsApp",
                text: "Canal aberto entre as sessões para dúvidas, ajustes e orientações pontuais.",
              },
              {
                title: "Reavaliação mensal",
                text: "Revisão completa todo mês: composição corporal, evolução de força, ajuste de protocolo.",
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
            Dúvidas sobre personal trainer em Tamboré
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
            Pronto para treinar com quem conhece Tamboré de verdade?
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            A primeira conversa é sem compromisso. Me conta seu objetivo e sua rotina — e te mostro como chegar lá.
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
