import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";
import YoutubeShortEmbed from "@/components/ui/YoutubeShortEmbed";

export const metadata: Metadata = {
  title: "Personal Trainer em Alphaville | Montinho Personal Trainer",
  description:
    "Personal Trainer em Alphaville com mais de 20 anos de experiência. Treino presencial individualizado para moradores de Alphaville, Barueri e região. Resultados reais, sem fórmulas mágicas.",
  alternates: {
    canonical: `${SITE_URL}/personal-trainer-alphaville`,
  },
  openGraph: {
    title: "Personal Trainer em Alphaville | Montinho Personal Trainer",
    description:
      "Acompanhamento presencial e personalizado em Alphaville. Método baseado em ciência, experiência real e compromisso com resultados duradouros.",
    url: `${SITE_URL}/personal-trainer-alphaville`,
  },
};

const faq = [
  {
    question: "Onde são realizados os treinos presenciais em Alphaville?",
    answer:
      "Os atendimentos presenciais acontecem na própria academia do aluno em Alphaville ou em espaços parceiros na região. Na primeira conversa, alinhamos o local mais conveniente para a sua rotina.",
  },
  {
    question: "Você atende alunos que já treinam há anos sem resultado?",
    answer:
      "Sim. Esse é exatamente o perfil de muitos dos meus alunos em Alphaville: pessoas que frequentam academia há meses ou anos mas que nunca tiveram um protocolo verdadeiramente individualizado. A diferença que um método estruturado faz nesse cenário é significativa.",
  },
  {
    question: "É possível contratar personal trainer em Alphaville para treinos na minha própria academia?",
    answer:
      "Sim. Atendo alunos em diferentes academias de Alphaville e da região. O treino vai até onde você já treina — não é necessário mudar de lugar.",
  },
  {
    question: "Qual é o diferencial do seu trabalho comparado a outros personal trainers em Alphaville?",
    answer:
      "Conheço Alphaville há mais de duas décadas — a rotina, o ritmo e as demandas reais de quem vive aqui. Meu acompanhamento combina método científico com sensibilidade para a realidade do aluno: agenda cheia, viagens, família, limitações físicas. Não existe ficha genérica — cada protocolo é construído do zero para aquela pessoa.",
  },
  {
    question: "O treino personalizado em Alphaville é indicado para qual perfil de aluno?",
    answer:
      "Para qualquer pessoa que queira sair do lugar: seja quem nunca treinou, quem voltou após anos afastado, quem tem histórico de lesões ou quem já treina mas não vê resultado. Adapto o protocolo ao ponto de partida de cada aluno.",
  },
];

const localSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/personal-trainer-alphaville`,
  name: "Montinho Personal Trainer – Alphaville",
  description:
    "Personal Trainer presencial em Alphaville com mais de 20 anos de experiência em musculação, emagrecimento e hipertrofia.",
  url: `${SITE_URL}/personal-trainer-alphaville`,
  telephone: "+5511981063409",
  areaServed: [
    { "@type": "City", name: "Barueri" },
    { "@type": "Neighborhood", name: "Alphaville" },
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

export default function PersonalTrainerAlphaville() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* HERO */}
      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Alphaville · Barueri
          </p>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Personal Trainer em Alphaville que conhece a sua rotina de dentro.
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Moradores de Alphaville têm agenda cheia, compromissos que não podem ser adiados e paciência zero para método que não funciona. Aqui o treino é construído para a sua realidade — não para uma pessoa genérica.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Sou morador de Alphaville e tenho interesse no treino personalizado presencial.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero conhecer o método
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
            Vivo em Alphaville há mais de 20 anos. Conheço esse lugar como poucos.
          </h2>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <div className="space-y-5 text-gray-300 leading-relaxed font-light text-base">
              <p>
                Alphaville tem um ritmo que quem não vive aqui não entende. A saída para São Paulo às 6h30, o trânsito de volta que ninguém controla, a academia que fecha às 22h, o jantar que acontece só depois das 21h. Quando você mora no mesmo lugar há mais de duas décadas, você para de tentar encaixar o treino num modelo padrão — e começa a construir um método que cabe nessa realidade.
              </p>
              <p>
                Minha paixão pela musculação não nasceu de um livro. Nasceu de necessidade. Cresci convivendo com o excesso de peso, passei anos tentando dietas e protocolos que prometiam resultado rápido e entregavam frustração. Foi só quando decidi estudar de verdade — entender como o corpo funciona, o que a ciência diz sobre treino e composição corporal — que as coisas mudaram. Para mim primeiro. Depois para os meus alunos.
              </p>
              <p>
                Hoje trabalho com pessoas que têm a mesma rotina que eu tinha: agenda lotada, pouca margem para erro e zero paciência para perder tempo. O que ofereço não é uma ficha de treino — é um protocolo construído especificamente para você, com ajustes contínuos conforme seu corpo responde.
              </p>
            </div>
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <Image
                src="/Treinador%20Alphaville.jpg"
                alt="Treinador Alphaville"
                title="Treinador Alphaville"
                aria-label="Treinador Alphaville"
                width={260}
                height={462}
                loading="lazy"
                decoding="async"
                className="object-cover object-top"
                style={{ width: "260px", height: "462px", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Como funciona
          </p>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Treino presencial em Alphaville: como é trabalhar comigo
          </h2>
          <p className="text-gray-400 leading-relaxed font-light mb-10">
            Do primeiro contato até os resultados, o processo é estruturado para eliminar tentativa e erro e garantir progresso consistente desde a primeira semana.
          </p>

          <div className="space-y-8">
            {[
              {
                num: "01",
                title: "Avaliação inicial e anamnese",
                text: "Antes de propor qualquer exercício, preciso entender com quem estou trabalhando: histórico de treino, lesões anteriores, objetivos, rotina, disponibilidade de tempo, restrições alimentares e expectativas. Essa conversa inicial dura entre 30 e 60 minutos e é onde o protocolo começa a ser desenhado.",
              },
              {
                num: "02",
                title: "Protocolo construído do zero",
                text: "Não existe ficha padrão que uso como base e adapto. Cada aluno tem um protocolo criado especificamente para seus objetivos, seu nível atual e suas limitações. Dois alunos com o mesmo objetivo podem ter programações completamente diferentes — porque são pessoas diferentes.",
              },
              {
                num: "03",
                title: "Sessões presenciais com acompanhamento real",
                text: "Durante o treino estou ao lado, não na academia fazendo outra coisa. Observo a execução, corrijo antes que o erro vire hábito, ajusto a carga em tempo real e garanto que cada série está cumprindo sua função. Esse nível de atenção é o que diferencia acompanhamento profissional de simplesmente treinar com alguém por perto.",
              },
              {
                num: "04",
                title: "Ajustes frequentes e reavaliações mensais",
                text: "O corpo se adapta. O protocolo precisa acompanhar essa adaptação. Faço reavaliações mensais para medir progresso, identificar o que está funcionando e ajustar o que pode ser melhorado. O objetivo é garantir que você continue evoluindo — não que faça o mesmo treino por meses a fio.",
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

          <div className="mt-12 relative w-full overflow-hidden" style={{ height: "420px" }}>
            <Image
              src="/Personal%20Trainer%20Alphaville.jpg"
              alt="Personal Trainer Alphaville"
              title="Personal Trainer Alphaville"
              aria-label="Personal Trainer Alphaville"
              fill
              loading="lazy"
              decoding="async"
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 896px"
            />
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Para quem é esse trabalho
          </h2>
          <p className="text-gray-400 font-light mb-10 leading-relaxed">
            Alphaville concentra um perfil de pessoa muito específico. Executivos, empreendedores, profissionais liberais, mães que conciliam filhos e carreira — todos com uma coisa em comum: tempo escasso e exigência alta. Trabalho com:
          </p>
          <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-start">
            <ul className="space-y-4">
              {[
                "Quem quer emagrecer com método — sem dietas radicais que não sustentam",
                "Quem busca hipertrofia real, não apenas volume aparente de treino",
                "Quem voltou ao treino após anos parado e precisa reconstruir a base com segurança",
                "Quem tem histórico de lesão e precisa de um protocolo que respeite essas limitações",
                "Quem já treina mas chegou num platô onde parece que nada mais evolui",
                "Quem nunca teve acompanhamento e quer fazer isso da forma certa desde o início",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 font-light">
                  <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                  {item}
                </li>
              ))}
            </ul>
            <div
              className="flex-shrink-0 mx-auto sm:mx-0 relative overflow-hidden"
              style={{ width: "240px", height: "380px" }}
            >
              <Image
                src="/Personal%20Trainer%20Alphaville%20SP.jpg"
                alt="Personal Trainer Alphaville SP"
                title="Personal Trainer Alphaville SP"
                aria-label="Personal Trainer Alphaville SP"
                fill
                loading="lazy"
                decoding="async"
                sizes="240px"
                style={{ objectFit: "cover", objectPosition: "top center" }}
              />
            </div>
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
            Dúvidas sobre personal trainer em Alphaville
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
            Pronto para começar em Alphaville?
          </h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            A primeira conversa é sem compromisso. Me conta o que você quer alcançar — e eu te mostro como podemos chegar lá juntos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl("Olá! Sou morador de Alphaville e quero saber mais sobre o treino personalizado presencial.")}
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
