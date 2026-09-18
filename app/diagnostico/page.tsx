import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import { QUESTIONS, TOTAL_QUESTIONS } from "@/lib/diagnostico";
import DiagnosticoQuiz from "@/components/diagnostico/DiagnosticoQuiz";
import Trilha from "@/components/ferramentas/Trilha";

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

const appSchema = aplicativoSchema({
  nome: "Diagnóstico Montinho",
  descricao:
    "Identifica a estratégia de treino mais adequada a partir de perguntas sobre rotina, objetivo e histórico.",
  caminho: "/diagnostico",
});

/*
 * As perguntas abaixo estão escritas na página, com a mesma resposta. FAQPage
 * que descreve texto invisível é violação da diretriz do Google e derruba o
 * bloco inteiro — o mesmo array alimenta o schema e o HTML para que um não
 * possa mudar sem o outro.
 */
const PERGUNTAS: { q: string; a: string }[] = [
  {
    q: "O Diagnóstico Montinho é gratuito?",
    a: "É gratuito e não pede cadastro. Você responde as perguntas, recebe o resultado na tela e vai embora se quiser — não há e-mail obrigatório nem formulário antes de ver a resposta.",
  },
  {
    q: "Quanto tempo leva para responder?",
    a: "De 1 a 2 minutos. São nove perguntas de múltipla escolha, sem campo aberto para digitar, pensadas para serem respondidas no celular enquanto se espera alguma coisa.",
  },
  {
    q: "Preciso já treinar para fazer o diagnóstico?",
    a: "Não. Uma das perguntas é justamente como está a sua rotina hoje, e nunca ter treinado é uma das respostas possíveis. O resultado muda conforme isso — quem está começando recebe um ponto de partida, não um plano de quem já treina há anos.",
  },
  {
    q: "O resultado substitui uma avaliação profissional?",
    a: "Não substitui. É uma orientação inicial a partir do que você respondeu em nove perguntas, e nenhuma ferramenta pública deveria fingir que isso é uma anamnese. Ela não conhece seu histórico de lesões, seus exames nem como o seu corpo responde ao treino.",
  },
  {
    q: "Serve para quem treina em casa?",
    a: "Serve. Uma das perguntas é onde você pretende treinar, e treinar em casa é uma das opções — a frequência e a estrutura sugeridas mudam conforme a resposta.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PERGUNTAS.map((p) => ({
    "@type": "Question",
    name: p.q,
    acceptedAnswer: { "@type": "Answer", text: p.a },
  })),
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="py-16 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">
            Diagnóstico Montinho
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
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

      <Trilha atual="/diagnostico" />

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
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
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
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
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
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
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
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
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

            {/*
              * As nove perguntas saem de QUESTIONS, não de uma lista escrita à
              * mão: o dia em que alguém mudar o quiz, este texto muda junto.
              * Lista paralela é o que envelhece errado em todo site que tenta
              * descrever a própria ferramenta.
              *
              * E elas precisam estar no HTML por um motivo de busca: o robô do
              * Google não responde quiz. Sem isto, a página é uma caixa vazia
              * para quem procura exatamente o que a ferramenta pergunta.
              */}
            <div>
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                As {TOTAL_QUESTIONS} perguntas do Diagnóstico
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Nenhuma delas é sobre o treino dos seus sonhos. Todas são sobre a
                semana que você realmente tem:
              </p>
              <ol className="text-gray-300 leading-relaxed space-y-2 list-decimal pl-5">
                {QUESTIONS.map((q) => (
                  <li key={q.id}>
                    {q.title}{" "}
                    <span className="text-zinc-500 text-sm">({q.options.length} opções)</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                O que você recebe no final
              </h2>
              <ul className="text-gray-300 leading-relaxed space-y-3 list-disc pl-5">
                <li>
                  <strong className="text-white">Seu perfil de treino</strong>, com o
                  nome do que você é hoje e por que caiu nele — a leitura das
                  respostas que você deu, não um rótulo de catálogo.
                </li>
                <li>
                  <strong className="text-white">A frequência que cabe na sua semana</strong>,
                  calculada sobre os dias que você marcou, e não sobre o ideal de
                  alguém sem filho, sem trânsito e sem hora extra.
                </li>
                <li>
                  <strong className="text-white">O gargalo que mais pesa</strong> no seu
                  caso. Quase sempre é um só, e quase nunca é o que a pessoa acha
                  que é.
                </li>
                <li>
                  <strong className="text-white">Três próximos passos</strong> concretos,
                  para fazer nesta semana.
                </li>
                <li>
                  <strong className="text-white">Conteúdos do blog escolhidos para o seu
                  caso</strong>, em vez da lista inteira.
                </li>
              </ul>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                Perguntas frequentes sobre o Diagnóstico
              </h2>
              <div className="space-y-6">
                {PERGUNTAS.map((p) => (
                  <div key={p.q}>
                    <h3 className="text-lg font-semibold text-white mb-2">{p.q}</h3>
                    <p className="text-gray-300 leading-relaxed">{p.a}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
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
