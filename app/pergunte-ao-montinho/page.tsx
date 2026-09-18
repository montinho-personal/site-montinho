import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import AskMontinho from "@/components/ask/AskMontinho";

export const metadata: Metadata = {
  title: "Pergunte ao Montinho: Tire Suas Dúvidas de Treino",
  description:
    "Assistente inteligente que responde suas dúvidas de musculação, emagrecimento e exercícios buscando nos conteúdos publicados pelo Montinho — com as fontes de cada resposta.",
  alternates: {
    canonical: `${SITE_URL}/pergunte-ao-montinho`,
  },
  openGraph: {
    title: "Pergunte ao Montinho: Tire Suas Dúvidas de Treino",
    description:
      "Assistente inteligente que responde dúvidas de treino buscando nos conteúdos do Montinho — com as fontes de cada resposta.",
    url: `${SITE_URL}/pergunte-ao-montinho`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Pergunte ao Montinho",
  description:
    "Assistente inteligente que busca respostas nos conteúdos publicados pelo Montinho Personal Trainer sobre musculação, emagrecimento e exercícios.",
  url: `${SITE_URL}/pergunte-ao-montinho`,
  author: {
    "@type": "Person",
    name: "Montinho",
    url: `${SITE_URL}/minha-historia`,
    jobTitle: "Personal Trainer",
  },
};

const appSchema = aplicativoSchema({
  nome: "Pergunte ao Montinho",
  descricao:
    "Responde dúvidas de treino e nutrição buscando nos conteúdos publicados, citando a fonte de cada resposta.",
  caminho: "/pergunte-ao-montinho",
});

/*
 * Perguntas reais, cada uma apontando para o artigo que a responde.
 *
 * Existe por um motivo de busca antes de qualquer outro: o robô do Google não
 * digita no chat. Sem esta lista, a página é uma caixa vazia para quem procura
 * justamente o que o assistente responde — e cada linha aqui é uma busca de
 * cauda longa que hoje não chega a lugar nenhum.
 *
 * Todos os slugs foram conferidos contra o acervo. Link quebrado em página
 * nova é o erro que mais barato se evita e mais caro custa.
 */
const EXEMPLOS: { pergunta: string; slug: string }[] = [
  { pergunta: "Quantas vezes por semana devo treinar?", slug: "/blog/frequencia-de-treino" },
  { pergunta: "Quanto tempo deve durar o treino?", slug: "/blog/duracao-ideal-do-treino" },
  { pergunta: "Treinar todos os dias faz mal?", slug: "/blog/treinar-todos-os-dias-faz-mal" },
  { pergunta: "Musculação emagrece?", slug: "/blog/musculacao-emagrece" },
  { pergunta: "Como calcular meu déficit calórico?", slug: "/blog/deficit-calorico-como-calcular" },
  { pergunta: "Quanta proteína por dia eu preciso?", slug: "/blog/quanta-proteina-por-dia-para-ganhar-massa-muscular" },
  { pergunta: "Quais alimentos têm mais proteína?", slug: "/blog/alimentos-ricos-em-proteina" },
  { pergunta: "Como montar um treino de hipertrofia?", slug: "/blog/como-montar-treino-de-hipertrofia" },
  { pergunta: "Nunca treinei — por onde começo?", slug: "/blog/primeira-semana-na-academia" },
  { pergunta: "Descansar atrapalha o resultado?", slug: "/blog/descansar-tambem-faz-crescer" },
  { pergunta: "Como criar o hábito de treinar?", slug: "/blog/como-criar-habito-de-treinar" },
  { pergunta: "Quantos dias por semana dá para treinar?", slug: "/blog/quantos-dias-por-semana-treinar" },
];

/*
 * As perguntas abaixo estão escritas na página, com a mesma resposta. FAQPage
 * descrevendo texto invisível é violação da diretriz do Google e derruba o
 * bloco inteiro — o mesmo array alimenta o schema e o HTML.
 */
const PERGUNTAS: { q: string; a: string }[] = [
  {
    q: "O Pergunte ao Montinho é gratuito?",
    a: "É gratuito e não pede cadastro. Você escreve a dúvida, recebe a resposta na tela e vê quais artigos a embasaram.",
  },
  {
    q: "É um robô de inteligência artificial genérico?",
    a: "Não. Ele não responde do conhecimento geral da internet: procura nos conteúdos publicados neste site e monta a resposta a partir deles, mostrando quais artigos usou. Quando a base não cobre a pergunta, ele diz que não tem como responder com segurança em vez de inventar.",
  },
  {
    q: "Ele pode montar meu treino ou minha dieta?",
    a: "Não. Ele explica conceito, execução e critério — o que é conteúdo educativo. Montar treino e dieta depende de histórico, exames e acompanhamento, e isso é trabalho de profissional acompanhando a pessoa, não de assistente de site.",
  },
  {
    q: "As respostas substituem médico ou nutricionista?",
    a: "Não substituem. O assistente não faz diagnóstico e não prescreve nada. Quem tem dor, lesão ou condição de saúde deve procurar o profissional adequado antes de seguir qualquer orientação geral.",
  },
  {
    q: "Por que ele mostra os artigos que usou?",
    a: "Para você poder conferir. Resposta sem fonte é opinião apresentada como fato, e do outro lado da tela não há como saber a diferença. Com o link, dá para ler o raciocínio inteiro e discordar se for o caso.",
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
    { "@type": "ListItem", position: 2, name: "Pergunte ao Montinho", item: `${SITE_URL}/pergunte-ao-montinho` },
  ],
};

const POPULAR = [
  { slug: "/blog/frequencia-de-treino", title: "Frequência de Treino: Quantas Vezes Por Semana?" },
  { slug: "/blog/como-montar-treino-de-hipertrofia", title: "Como Montar um Treino de Hipertrofia" },
  { slug: "/blog/deficit-calorico-como-calcular", title: "Déficit Calórico: Como Calcular o Seu" },
  { slug: "/blog/primeira-semana-na-academia", title: "Primeira Semana na Academia" },
];

export default function PergunteAoMontinhoPage() {
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
      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">
            Assistente do site
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            Pergunte ao Montinho
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-3">
            Pergunte o que quiser sobre musculação, treino e emagrecimento. Cada
            resposta é construída a partir dos mais de 800 conteúdos escritos pelo
            Montinho — a experiência de quem perdeu 40 kg e acompanha alunos todos
            os dias, apoiada na evidência científica e no que as principais
            referências do treinamento de força ensinam.
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            Você recebe a explicação e vê exatamente quais artigos a embasaram.
          </p>
        </div>
      </section>

      {/* Chat */}
      <section className="py-10 bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AskMontinho />
        </div>
      </section>

      {/* Conteúdo indexável */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
            >
              O que é o Pergunte ao Montinho
            </h2>
            <p className="text-gray-300 leading-relaxed">
              É um assistente inteligente que transforma o acervo do site — centenas
              de artigos sobre treino, emagrecimento, exercícios, nutrição e
              acompanhamento — em respostas diretas. Em vez de procurar artigo por
              artigo, você pergunta com suas palavras e ele busca os trechos mais
              relevantes dos conteúdos do Montinho para montar a resposta, sempre
              mostrando de onde ela veio.
            </p>
          </div>

          <div>
            <h2
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
            >
              Perguntas que as pessoas mais fazem
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Pode copiar qualquer uma delas para o campo acima, ou ir direto ao
              artigo que a responde por escrito:
            </p>
            <ul className="text-gray-300 leading-relaxed grid gap-2 sm:grid-cols-2">
              {EXEMPLOS.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={e.slug}
                    className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                  >
                    {e.pergunta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
            >
              Como ele monta a resposta
            </h2>
            <ol className="text-gray-300 leading-relaxed space-y-3 list-decimal pl-5">
              <li>
                <strong className="text-white">Procura nos conteúdos do site.</strong>{" "}
                A busca é nos artigos publicados aqui, não no conhecimento geral
                da internet. É a diferença entre uma resposta que o Montinho
                assina e uma que ninguém assina.
              </li>
              <li>
                <strong className="text-white">Monta a explicação a partir do que
                achou</strong>, na mesma linguagem dos artigos — sem promessa de
                resultado e sem fórmula mágica.
              </li>
              <li>
                <strong className="text-white">Mostra quais artigos usou.</strong>{" "}
                Você consegue abrir cada um e conferir. Resposta sem fonte é
                opinião apresentada como fato, e do outro lado da tela não há
                como saber a diferença.
              </li>
              <li>
                <strong className="text-white">Diz quando não sabe.</strong> Se a
                base não cobre a pergunta, ele fala isso. Inventar seria pior que
                não responder — e é o que assistente genérico faz.
              </li>
            </ol>
          </div>

          <div>
            <h2
              className="text-2xl font-bold text-white mb-6"
              style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
            >
              Perguntas frequentes sobre o assistente
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
              Que tipo de dúvida ele responde
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Perguntas sobre treino e frequência ("quantas vezes por semana devo
              treinar?"), execução de exercícios ("como fazer remada curvada?"),
              emagrecimento e alimentação ("musculação emagrece?"), e também sobre o
              acompanhamento do Montinho ("atende em Alphaville?", "como funciona a
              consultoria online?"). Quando a base não tem conteúdo suficiente para
              responder com segurança, ele diz isso com honestidade em vez de
              inventar.
            </p>
          </div>

          <div>
            <h2
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
            >
              De onde vêm as respostas — e os limites
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A fonte é o próprio site: os artigos do{" "}
              <Link href="/blog" className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors">
                blog
              </Link>{" "}
              e as páginas de serviço, escritos dentro da filosofia do Montinho —
              resultados reais, sem fórmulas mágicas. O assistente não substitui
              médico, fisioterapeuta ou nutricionista, não faz diagnóstico e não
              prescreve nada: é conteúdo educativo. Para orientação individual, o
              caminho é o{" "}
              <Link href="/consultoria" className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors">
                acompanhamento personalizado
              </Link>
              .
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              A ferramenta foi criada sobre os conteúdos do{" "}
              <Link href="/minha-historia" className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors">
                Montinho, personal trainer em Alphaville
              </Link>{" "}
              que perdeu mais de 40 kg na própria transformação — a mesma
              experiência prática que sustenta cada artigo usado nas respostas.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Cada dica nasce de três lugares: a experiência de quem vive isso na
              prática e acompanha alunos todos os dias; a{" "}
              <strong className="text-white font-semibold">evidência científica</strong>{" "}
              — os estudos estão citados nas referências dos próprios artigos, para
              você conferir; e o trabalho de grandes treinadores do Brasil e do
              mundo que o Montinho estuda e acompanha, entre eles Fabrício
              Pacholok, Leandro Twin, Júlio Balestrin, Coach Rubens e Hany Rambod.
              No fim, nenhuma dessas fontes entrega uma fórmula secreta: elas dão
              direção. A melhor estratégia continua sendo a que se encaixa nas suas
              individualidades e na sua rotina de agora — a que você consegue
              seguir por mais tempo, com mais consistência e melhor progressão.
            </p>
          </div>

          <div>
            <h2
              className="text-2xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
            >
              Conteúdos mais buscados
            </h2>
            <ul className="space-y-2">
              {POPULAR.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={p.slug}
                    className="text-gray-300 underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
