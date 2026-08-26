import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import DiagnosticoQuiz from "@/components/diagnostico/DiagnosticoQuiz";

export const metadata: Metadata = {
  title: "Diagnóstico Montinho: Descubra Sua Estratégia de Treino",
  description:
    "Responda 9 perguntas rápidas sobre sua rotina e objetivo e receba uma orientação inicial personalizada: perfil de treino, frequência compatível e próximos passos. Gratuito, leva 1–2 minutos.",
  alternates: {
    canonical: `${SITE_URL}/diagnostico`,
  },
  openGraph: {
    title: "Diagnóstico Montinho: Descubra Sua Estratégia de Treino",
    description:
      "Responda 9 perguntas rápidas sobre sua rotina e objetivo e receba uma orientação inicial personalizada. Gratuito, leva 1–2 minutos.",
    url: `${SITE_URL}/diagnostico`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Diagnóstico Montinho",
  description:
    "Ferramenta gratuita que identifica qual estratégia de treino combina com a rotina e o objetivo do visitante, criada pelo Montinho Personal Trainer.",
  url: `${SITE_URL}/diagnostico`,
  author: {
    "@type": "Person",
    name: "Montinho",
    url: `${SITE_URL}/minha-historia`,
    jobTitle: "Personal Trainer",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Diagnóstico Montinho", item: `${SITE_URL}/diagnostico` },
  ],
};

export default function DiagnosticoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <section className="py-16 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">
            Diagnóstico Montinho
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Descubra qual estratégia de treino combina com você
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Responda algumas perguntas sobre sua rotina e objetivo e receba uma
            orientação inicial personalizada — frequência compatível, principal
            gargalo e próximos passos.
          </p>
        </div>
      </section>

      {/* Quiz */}
      <section className="py-12 bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <DiagnosticoQuiz />
        </div>
      </section>

      {/* Conteúdo indexável */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div>
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                O que é o Diagnóstico Montinho
              </h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                É uma ferramenta gratuita que traduz a experiência prática do
                Montinho em uma orientação inicial: a partir do seu objetivo, da
                sua disponibilidade real e da sua maior dificuldade, ela indica
                qual caminho de treino tende a fazer mais sentido para a sua vida
                — e não para uma rotina idealizada que ninguém cumpre.
              </p>
              <p className="text-gray-300 leading-relaxed">
                O resultado considera seu objetivo, disponibilidade, experiência e
                principal dificuldade para identificar o ponto de partida mais
                compatível com a sua rotina. É uma orientação inicial — não é
                avaliação médica, não substitui a anamnese individual feita com
                alunos e não promete resultados.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Como funciona
              </h2>
              <p className="text-gray-300 leading-relaxed">
                São 9 perguntas rápidas — objetivo, rotina atual, dias e tempo
                disponíveis, experiência, principal dificuldade, onde pretende
                treinar e como prefere ser acompanhado. Ao final, você recebe seu
                perfil de treino com explicação, frequência compatível com a sua
                agenda, o gargalo que mais merece atenção e três próximos passos
                práticos, além de conteúdos do blog selecionados para o seu caso.
                Leva de 1 a 2 minutos e não pede cadastro.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Por que rotina e frequência importam mais do que o treino perfeito
              </h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                A maioria das pessoas não para de treinar por falta de um plano
                melhor — para porque o plano não cabia na vida real. Um programa
                de 5 dias é inútil para quem consegue treinar 3; um treino de 90
                minutos não sobrevive a uma agenda com 40. Por isso o Diagnóstico
                pergunta o que você <em>consegue</em> fazer, não o que você
                gostaria.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Essa é a mesma lógica que o Montinho aplica com alunos: a{" "}
                <Link
                  href="/blog/frequencia-de-treino"
                  className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                >
                  frequência certa de treino
                </Link>{" "}
                é a que se repete toda semana, e a{" "}
                <Link
                  href="/blog/como-criar-habito-de-treinar"
                  className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                >
                  construção do hábito
                </Link>{" "}
                vem antes de qualquer otimização.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                E depois do diagnóstico?
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Se quiser transformar a orientação em um plano de verdade, o
                Montinho atende{" "}
                <Link
                  href="/personal-trainer-alphaville"
                  className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                >
                  presencialmente em Alphaville
                </Link>
                , Barueri e Santana de Parnaíba, e pela{" "}
                <Link
                  href="/consultoria"
                  className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                >
                  consultoria online
                </Link>{" "}
                em todo o Brasil — sempre com plano individualizado e
                acompanhamento próximo. Aí sim entra a anamnese completa, feita
                individualmente, com a profundidade que uma ferramenta pública não
                deve ter.
              </p>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Quem criou o Diagnóstico Montinho
              </h2>
              <p className="text-gray-300 leading-relaxed">
                A ferramenta foi criada pelo{" "}
                <Link
                  href="/minha-historia"
                  className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                >
                  Montinho, personal trainer em Alphaville
                </Link>{" "}
                especialista em emagrecimento — que viveu a própria transformação
                ao perder mais de 40 kg. As perguntas e os perfis vêm da
                experiência real de acompanhar alunos com rotinas, objetivos e
                dificuldades muito diferentes, seguindo a mesma filosofia do
                site: resultados reais, sem fórmulas mágicas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
