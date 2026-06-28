import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";

export const metadata: Metadata = {
  title: "Personal Trainer Tamboré | Montinho Personal Trainer",
  description:
    "Personal Trainer em Tamboré com atendimento individualizado e presencial. Treino de força, emagrecimento e qualidade de vida para moradores da região de Tamboré e Alphaville.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-tambore`,
  },
  openGraph: {
    title: "Personal Trainer Tamboré | Montinho Personal Trainer",
    description:
      "Treino personalizado no coração de Tamboré. Protocolo individual, progressão real e o acompanhamento de quem vive e trabalha na região há mais de 20 anos.",
    url: `${SITE_URL}/personal-trainer-tambore`,
  },
};

const faq = [
  {
    question: "Personal trainer atende dentro dos condomínios de Tamboré?",
    answer:
      "Dependendo da estrutura do condomínio, sim. Alguns condomínios de Tamboré têm academias ou espaços fitness próprios onde é possível realizar o atendimento. Avaliamos a estrutura disponível antes de definir o local mais adequado para as sessões.",
  },
  {
    question: "Qual a diferença entre personal trainer em Tamboré e em Alphaville?",
    answer:
      "Na prática, a diferença está na localização do aluno — o trabalho e o método são os mesmos. Tamboré é um bairro residencial de Barueri e Santana de Parnaíba com perfil familiar e calmo. Atendo em ambas as regiões, sempre escolhendo o local mais conveniente para o aluno.",
  },
  {
    question: "Você tem experiência com treino para quem tem restrições físicas em Tamboré?",
    answer:
      "Sim. Trabalho frequentemente com alunos que têm histórico de lombalgia, problemas no joelho, hérnia de disco, tendinites e outras condições que limitam certos movimentos. O protocolo é adaptado para contornar as restrições, mantendo progressão e resultado dentro do que é seguro para cada caso.",
  },
  {
    question: "Como começar a treinar com personal trainer em Tamboré?",
    answer:
      "O primeiro passo é uma conversa pelo WhatsApp para entender seu objetivo, rotina e disponibilidade. Depois, marcamos uma avaliação inicial para montar o protocolo. A partir daí, as sessões presenciais começam — sem longa burocracia, sem formulários intermináveis.",
  },
  {
    question: "Personal trainer em Tamboré funciona para quem tem pouco tempo disponível?",
    answer:
      "Funciona justamente para esse perfil. Treino eficiente com acompanhamento profissional produz mais resultado em 3 sessões semanais bem estruturadas do que em 5 sessões sem método. A questão não é quanto tempo você tem — é o que fazemos com o tempo disponível.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-tambore`,
  name: "Montinho Personal Trainer – Tamboré",
  description:
    "Personal Trainer presencial em Tamboré, Barueri e Santana de Parnaíba. Treino individualizado para emagrecimento, hipertrofia e qualidade de vida.",
  url: `${SITE_URL}/personal-trainer-tambore`,
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

export default function PersonalTrainerTambore() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Tamboré · Barueri · Santana de Parnaíba
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal Trainer em Tamboré: treino que cabe na rotina de quem mora aqui.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Tamboré é um bairro residencial com ritmo próprio — mais tranquilo, mais familiar, mais próximo. Meu trabalho respeita esse contexto: acompanhamento próximo, sem pressa e com a atenção que quem vive aqui valoriza.
          </p>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero começar a treinar
          </a>
        </div>
      </section>

      {/* SOBRE TAMBORÉ + HISTÓRIA */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Vizinhança e método
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Tamboré tem um jeito de viver. O treino precisa acompanhar isso.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed font-light">
            <p>
              Quem mora em Tamboré não escolheu esse bairro por acaso. Escolheu pelo ambiente familiar, pela escala humana do lugar, pela sensação de comunidade que pouco outros bairros da Grande São Paulo oferecem. É um ritmo que tem valor — e que merece ser preservado numa rotina de treino que não vira um fardo.
            </p>
            <p>
              Sou da região há mais de 20 anos. Conheço os condomínios, as academias, as ruas, os horários de pico. Quando monto um protocolo para um morador de Tamboré, não estou imaginando um ambiente genérico — estou pensando na realidade local: academia de condomínio com equipamento limitado, horário de treino espremido entre a saída dos filhos para a escola e o início do expediente, o almoço em casa que é uma oportunidade de comer bem.
            </p>
            <p>
              Comecei na musculação pela mesma razão que muitos dos meus alunos hoje: insatisfação com o próprio corpo e uma longa sequência de métodos que prometiam muito e entregavam frustração. O que mudou foi quando parei de buscar atalho e passei a entender de fato como o corpo funciona. Essa virada foi o começo do meu trabalho como personal trainer — e é o que guia cada protocolo que monto até hoje.
            </p>
          </div>
          <div className="mt-10" style={{ maxWidth: "220px" }}>
            <Image
              src="/Personal%20Trainer%20Tambor%C3%A9.jpg"
              alt="Personal Trainer Tamboré"
              title="Personal Trainer Tamboré"
              aria-label="Personal Trainer Tamboré"
              width={220}
              height={476}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* O QUE OFEREÇO */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            O que você recebe
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Acompanhamento presencial em Tamboré: tudo que está incluso
          </h2>
          <p className="text-gray-400 font-light mb-10 leading-relaxed">
            Não vendo sessões avulsas sem contexto. Ofereço acompanhamento — que é diferente de apenas treinar junto:
          </p>

          <div className="grid sm:grid-cols-2 gap-px border border-white/10">
            {[
              {
                icon: "→",
                title: "Avaliação física e anamnese detalhada",
                text: "Antes de qualquer treino: entender quem você é, o que você já fez, o que não funcionou e por que.",
              },
              {
                icon: "→",
                title: "Protocolo 100% individual",
                text: "Sem modelo base. O seu treino começa do zero, pensado para seus objetivos, suas limitações e seu ritmo de vida.",
              },
              {
                icon: "→",
                title: "Presença real durante as sessões",
                text: "Estou ao lado durante todo o treino — não ao telefone nem atendendo outro aluno simultaneamente.",
              },
              {
                icon: "→",
                title: "Correção técnica contínua",
                text: "Erro de execução corrigido antes de virar hábito. Segurança e eficiência no mesmo movimento.",
              },
              {
                icon: "→",
                title: "Suporte pelo WhatsApp",
                text: "Dúvidas fora das sessões, ajustes de horário, orientações pontuais — canal aberto entre as sessões.",
              },
              {
                icon: "→",
                title: "Reavaliação e ajuste mensal",
                text: "Todo mês revejo o protocolo com base no progresso real. O que está bom, ampliamos. O que pode melhorar, ajustamos.",
              },
            ].map((item, i) => (
              <div key={i} className="p-6 border-b border-r border-white/10">
                <p className="text-white font-semibold mb-2">{item.title}</p>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 relative w-full overflow-hidden" style={{ height: "380px" }}>
            <Image
              src="/Treinador%20tambor%C3%A9.jpg"
              alt="Treinador tamboré"
              title="Treinador tamboré"
              aria-label="Treinador tamboré"
              fill
              loading="lazy"
              decoding="async"
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </div>
      </section>

      {/* DEPOIMENTO CONTEXTUALIZADO */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-white mb-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            O que os alunos da região costumam dizer
          </h2>

          <div className="space-y-6">
            <blockquote className="border-l-2 border-white/30 pl-6 py-2">
              <p className="text-gray-300 italic text-lg leading-relaxed font-light mb-3">
                "Tentei de tudo antes de contratar o Montinho — personal anterior, app de treino, grupo na academia. Nada funcionou de verdade porque nenhum deles realmente me conhecia. O acompanhamento dele é diferente."
              </p>
              <footer className="text-gray-500 text-sm">Aluna da região de Tamboré · 6 meses de consultoria</footer>
            </blockquote>

            <blockquote className="border-l-2 border-white/30 pl-6 py-2">
              <p className="text-gray-300 italic text-lg leading-relaxed font-light mb-3">
                "Eu viajava muito e achei que treino personalizado não ia funcionar para a minha rotina. Criamos um protocolo que funciona seja qual for a semana — na academia do condomínio, no hotel ou em casa. Resultado consistente mesmo com imprevistos."
              </p>
              <footer className="text-gray-500 text-sm">Aluno morador de Tamboré · Personal presencial + suporte online</footer>
            </blockquote>
          </div>

          <p className="mt-8 text-gray-500 text-sm">
            Veja mais transformações na{" "}
            <Link href="/resultados" className="text-white underline underline-offset-2 hover:opacity-70 transition-opacity">
              página de resultados
            </Link>
            .
          </p>
          <div className="mt-10 ml-auto" style={{ maxWidth: "240px" }}>
            <Image
              src="/Personal%20Trainer%20Tambor%C3%A9%20%282%29.jpg"
              alt="Personal Trainer Tamboré (2)"
              title="Personal Trainer Tamboré (2)"
              aria-label="Personal Trainer Tamboré (2)"
              width={240}
              height={427}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-white mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            5 Dicas para acabar com dores no lombar
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Além de acompanhar meus alunos presencialmente e online, também compartilho dicas práticas de treino, emagrecimento e hipertrofia. Assista ao vídeo abaixo para conhecer um pouco mais do meu trabalho.
          </p>
          <YoutubeShortEmbed videoId="MrfzaQWFqPs" title="5 Dicas para acabar com dores no lombar — Montinho Personal Trainer" />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
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
            Seu próximo passo começa com uma conversa.
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Sem formulários longos, sem avaliações pagas antes de decidir. Me conta o que você quer mudar — e te mostro se faz sentido trabalharmos juntos.
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
              Ver como funciona o atendimento
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
