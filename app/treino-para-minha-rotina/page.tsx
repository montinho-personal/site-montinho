import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import { EVIDENCE, EVIDENCE_REVIEWED_AT } from "@/lib/rotina/evidence";
import RotinaQuiz from "@/components/rotina/RotinaQuiz";
import Trilha from "@/components/ferramentas/Trilha";

export const metadata: Metadata = {
  title: "Treino Para Minha Rotina: Descubra Sua Melhor Divisão",
  description:
    "Treino 3, 4 ou 5 vezes por semana? Diga seus dias e o tempo livre e veja a divisão que cabe na sua rotina: Full Body, Upper/Lower ou ABC. Grátis.",
  alternates: {
    canonical: `${SITE_URL}/treino-para-minha-rotina`,
  },
  openGraph: {
    title: "Treino Para Minha Rotina: Descubra Sua Melhor Divisão",
    description:
      "Responda perguntas sobre sua rotina real e descubra uma estrutura de musculação que cabe na sua vida — não o contrário.",
    url: `${SITE_URL}/treino-para-minha-rotina`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const FAQ_3X = [
  { q: "Treino 3 vezes por semana dá resultado?", a: "Dá. Treinar cada grupo muscular duas vezes por semana já produz ganho de força e de massa em adultos, e três sessões bem feitas permitem isso. Com o volume semanal parecido, divisões diferentes dão resultados semelhantes; o que mais pesa é manter as três sessões, semana após semana, e ir subindo carga ou repetições." },
  { q: "Como dividir o treino 3x na semana?", a: "As opções mais comuns são Full Body nos três dias, Superior / Inferior / Corpo inteiro, e ABC (empurrar, puxar, pernas). Deixe um dia livre entre as sessões quando der, por exemplo segunda, quarta e sexta. A ferramenta acima compara as três com os seus dias reais." },
  { q: "Qual a melhor divisão de treino para 3 dias na semana?", a: "Não existe uma melhor para todo mundo. Para quem está começando, o Full Body costuma ser o mais simples de manter e repete cada músculo três vezes. Superior / Inferior / Corpo inteiro dá mais tempo para cada região. O ABC treina cada grupo uma vez só, então funciona melhor com sessões longas e para quem já tem alguns anos de treino." },
  { q: "Treino full body 3x na semana serve para hipertrofia?", a: "Serve. Com volume semanal parecido, o full body ganha massa tanto quanto as divisões por grupo. Ele costuma ter menos exercícios por músculo em cada sessão, mas repete o estímulo mais vezes na semana." },
  { q: "O treino 3 vezes por semana é diferente para homem e mulher?", a: "A estrutura é a mesma. O que muda é a prioridade de cada pessoa, como mais glúteo ou mais ombro, e isso entra no volume de cada região, não na divisão. Na ferramenta, você marca até duas prioridades." },
  { q: "Treinar 3 vezes por semana emagrece?", a: "A musculação ajuda a preservar o músculo enquanto você perde gordura, mas quem decide a perda de gordura é o déficit calórico da semana. Três treinos bem feitos, junto com a alimentação ajustada, funcionam; três treinos sozinhos não compensam o resto do dia." },
  { q: "Dá para treinar 3 vezes por semana em casa?", a: "Dá. O Full Body é o que melhor se adapta ao que você tiver em casa: peso do corpo, halteres ou elásticos. O princípio é o mesmo da academia, ir dificultando aos poucos." },
  { q: "Treino 4 vezes por semana dá resultado?", a: "Dá. Com quatro sessões, cada metade do corpo pode ser treinada duas vezes na semana, uma frequência que funciona bem tanto para ganhar massa quanto para quem está perdendo gordura e quer preservar músculo." },
  { q: "Como dividir o treino em 4 dias na semana?", a: "O encaixe mais comum é Upper/Lower (superior e inferior) duas vezes: por exemplo, superior na segunda, inferior na terça, descanso na quarta, superior na quinta e inferior na sexta. Full Body 4x e ABCD também funcionam, em contextos diferentes. A ferramenta acima monta com os seus dias reais." },
  { q: "Qual a melhor divisão de treino para 4 vezes por semana?", a: "Para a maioria, Upper/Lower: cada músculo aparece duas vezes, e os dias de superior e de inferior se alternam na recuperação. O treino AB 4x é o mesmo princípio com outro nome. O ABCD treina cada grupo uma vez por semana e costuma fazer mais sentido para quem já treina há anos e gosta de sessões longas por grupo." },
  { q: "Posso treinar 4 dias seguidos e descansar 3?", a: "Pode. Com Upper/Lower, quatro dias seguidos alternam superior e inferior, então nenhum músculo é treinado dois dias em sequência. Se a rotina permitir, espalhar os quatro treinos na semana costuma ser mais confortável, mas os dias seguidos funcionam." },
  { q: "É melhor treinar 4 ou 5 vezes na semana?", a: "O melhor é o número que você consegue cumprir toda semana. Com o mesmo volume semanal, 4 e 5 dias dão resultados parecidos; o quinto dia só ajuda se você tem tempo e recuperação para ele. Ter mais dias livres não obriga a treinar mais." },
  { q: "O treino 4 vezes por semana muda para homem e mulher?", a: "A divisão é a mesma. Muda a prioridade de cada pessoa, como mais glúteo e posterior ou mais ombro e costas, e isso entra no volume de cada região. Na ferramenta, você escolhe até duas prioridades." },
];

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Treino Para Minha Rotina",
  description:
    "Ferramenta gratuita que cruza objetivo, disponibilidade real, tempo por sessão e experiência para sugerir uma estrutura de musculação compatível com a rotina da pessoa.",
  url: `${SITE_URL}/treino-para-minha-rotina`,
  author: {
    "@type": "Person",
    name: "Montinho",
    url: `${SITE_URL}/minha-historia`,
    jobTitle: "Personal Trainer",
  },
};

const appSchema = aplicativoSchema({
  nome: "Treino Para Minha Rotina",
  descricao:
    "Monta a divisão de treino da semana a partir dos dias e do tempo disponível.",
  caminho: "/treino-para-minha-rotina",
});

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_3X.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Treino Para Minha Rotina", item: `${SITE_URL}/treino-para-minha-rotina` },
  ],
};


const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const h2s = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

export default function TreinoParaMinhaRotinaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-5">
            Ferramenta gratuita
          </p>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
            style={h2s}
          >
            O problema talvez não seja seu treino. Talvez seja o treino não caber na sua vida.
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-3">
            Responda algumas perguntas sobre sua rotina real e descubra uma
            estrutura de musculação compatível com seu objetivo, experiência e
            tempo disponível — <strong className="text-white">agora</strong>.
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            Seu treino precisa caber na sua vida. Não sua vida caber no treino.
          </p>
        </div>
      </section>

      <Trilha atual="/treino-para-minha-rotina" />

      {/* Ferramenta */}
      <section className="py-10 bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <RotinaQuiz />
        </div>
      </section>

      {/* Conteúdo indexável */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Existe um treino perfeito?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Não — e isso é uma boa notícia. A pesquisa em treinamento de força
              mostra que muitas combinações de frequência, volume e divisão levam
              a resultados comparáveis quando o trabalho semanal é semelhante. O
              que separa quem evolui de quem desiste raramente é a escolha da
              divisão: é conseguir treinar bem, recuperar, progredir e continuar.
            </p>
            <p className="text-gray-300 leading-relaxed">
              O melhor treino não é o que parece mais avançado. É o que permite
              treinar bem, recuperar, progredir e continuar — dentro da vida que
              você leva agora. E &ldquo;agora&rdquo; importa: rotina muda, experiência muda,
              objetivo muda. A estrutura certa hoje pode não ser a de daqui a seis
              meses, e está tudo bem.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Quantas vezes por semana preciso treinar?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Menos do que a internet faz parecer. Duas sessões bem-feitas por
              semana já produzem ganhos reais de força, massa muscular e saúde em
              adultos — é o que os posicionamentos científicos atuais sustentam.
              Três a quatro sessões ampliam as possibilidades de distribuição.
              Cinco ou seis fazem sentido para quem já tem consistência e
              recuperação para sustentar — não como ponto de partida obrigatório.
              Se quiser se aprofundar:{" "}
              <Link href="/blog/frequencia-de-treino" className={ln}>
                frequência de treino: quantas vezes por semana?
              </Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Full body ou treino dividido?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Com volume equiparado, corpo inteiro e divisões como{" "}
              <Link href="/blog/treino-upper-lower-superior-inferior" className={ln}>
                upper/lower
              </Link>{" "}
              ou{" "}
              <Link href="/blog/push-pull-legs" className={ln}>
                push pull legs
              </Link>{" "}
              produzem resultados semelhantes. A divisão é uma forma de
              distribuir o trabalho na semana — não uma religião. Ela deve ser
              escolhida pelos dias que você tem, pela forma como eles se
              distribuem e pela rotina que você acha mais fácil de manter. É
              exatamente esse cruzamento que a ferramenta acima faz.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Como dividir o treino 2, 3, 4, 5 ou 6 vezes por semana
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Não existe uma divisão única para cada número de dias. Estas são as
              que a ferramenta compara — e quem decide entre elas são os seus dias
              reais, o tempo por sessão e o seu momento:
            </p>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li><strong className="text-white">2x por semana:</strong> Full Body nas duas sessões costuma ser o encaixe mais natural, porque cada região é treinada duas vezes. <Link href="/treino-para-minha-rotina?dias=2" className={ln}>Montar com 2 dias</Link></li>
              <li><strong className="text-white">3x por semana:</strong> Full Body 3x, Upper/Lower alternado, Superior/Inferior/Corpo inteiro ou ABC (empurrar, puxar, pernas). Para quem está começando, o Full Body tende a ser o mais simples de manter. <Link href="/treino-para-minha-rotina?dias=3" className={ln}>Montar com 3 dias</Link></li>
              <li><strong className="text-white">4x por semana:</strong> Upper/Lower é o encaixe mais comum, principalmente com dias seguidos (superior hoje, inferior amanhã). Full Body 4x e ABCD também funcionam, em contextos diferentes. <Link href="/treino-para-minha-rotina?dias=4" className={ln}>Montar com 4 dias</Link></li>
              <li><strong className="text-white">5x por semana:</strong> Upper/Lower com uma sessão extra ou o híbrido PPL + Upper/Lower. Cinco dias não pedem PPL automaticamente. <Link href="/treino-para-minha-rotina?dias=5" className={ln}>Montar com 5 dias</Link></li>
              <li><strong className="text-white">6x por semana:</strong> PPL duas vezes ou Upper/Lower em três ciclos, para quem já tem consistência e recuperação. Ter seis dias livres não significa precisar treinar seis. <Link href="/treino-para-minha-rotina?dias=6" className={ln}>Montar com 6 dias</Link></li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              PPL ou Upper/Lower? Com quatro dias, Upper/Lower costuma encaixar
              melhor: cada metade do corpo é treinada duas vezes. O PPL precisa de
              seis dias para fazer o mesmo; com três, cada grupo aparece uma vez na
              semana. Veja também <Link href="/blog/full-body-vs-divisao-abc" className={ln}>Full Body vs ABC</Link> e <Link href="/blog/quantos-dias-por-semana-treinar" className={ln}>quantos dias por semana treinar</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Treino 3 vezes por semana: dá resultado?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Dá, e é uma das rotinas mais fáceis de manter. Três sessões
              permitem treinar cada músculo duas ou três vezes na semana, e com
              o mesmo volume as divisões dão resultados parecidos. O que separa
              quem evolui de quem não evolui com 3x é cumprir as três sessões e
              ir subindo carga ou repetições.
            </p>
            <ul className="space-y-3 text-gray-300 leading-relaxed">
              <li><strong className="text-white">Full Body 3x</strong> (ex.: segunda, quarta e sexta): o corpo todo em cada treino. O mais simples para quem está começando e serve para hipertrofia.</li>
              <li><strong className="text-white">Superior / Inferior / Corpo inteiro:</strong> mais tempo para cada região sem perder a repetição na semana.</li>
              <li><strong className="text-white">ABC (empurrar, puxar, pernas):</strong> cada grupo uma vez por semana. Funciona com sessões longas e para quem já treina há anos.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed mt-4">
              Masculino ou feminino, a estrutura é a mesma: muda a prioridade
              (mais glúteo, mais ombro), e você marca isso na ferramenta. Em casa,
              o Full Body é o que melhor se adapta ao que você tiver. Para
              emagrecer, os três treinos preservam o músculo, mas quem decide a
              perda de gordura é o{" "}
              <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>déficit calórico</Link>
              . A ferramenta monta a sua semana de 3 dias e você pode salvar ou
              compartilhar o plano. <Link href="/treino-para-minha-rotina?dias=3" className={ln}>Montar com 3 dias</Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Treino 4 vezes por semana: como dividir
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Com quatro dias, o encaixe mais comum é Upper/Lower: superior e
              inferior duas vezes cada, como segunda e quinta para superior,
              terça e sexta para inferior. Cada músculo aparece duas vezes na
              semana, e serve tanto para hipertrofia quanto para quem está
              perdendo gordura. Dá para fazer os quatro dias seguidos e
              descansar três, porque superior e inferior se alternam. Masculino
              ou feminino, a divisão é a mesma; o que muda é a prioridade de cada
              região. Se você está entre 4 e 5 dias, fique com o que consegue
              cumprir toda semana. Para o número de séries, veja{" "}
              <Link href="/blog/quantas-series-para-hipertrofia" className={ln}>quantas séries para hipertrofia</Link>
              . <Link href="/treino-para-minha-rotina?dias=4" className={ln}>Montar com 4 dias</Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Perdi um treino. E agora?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Continue a sequência no próximo dia disponível. Se a semana era
              Superior na segunda, Inferior na terça e você perdeu a terça, o
              Inferior vai para quinta e o resto anda uma casa; o que sobrar entra
              no começo da semana seguinte. O corpo não sabe que sexta é &ldquo;dia de
              perna&rdquo;: a ordem importa mais que o nome do dia. Quem trabalha por
              escala ou tem horários que mudam toda semana pode usar só a
              sequência (A, B, A, B), sem calendário fixo. E numa semana em que só
              cabem menos treinos, o ajuste é temporário: você não precisa trocar
              de programa por causa de uma semana apertada.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Tenho só 30 minutos. Ainda vale?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Vale. Menos tempo muda a estratégia — não torna o treino inútil. A
              literatura sobre estratégias de dose mínima mostra que sessões
              curtas com poucos exercícios de alto valor produzem adaptações
              reais, ainda que não maximizem tudo. Com 30 minutos, a sessão
              prioriza movimentos multiarticulares e corta o que é enfeite. O
              artigo{" "}
              <Link href="/blog/treino-de-30-minutos-funciona" className={ln}>
                treino de 30 minutos funciona?
              </Link>{" "}
              detalha essa lógica.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Por que aderência importa mais que perfeição
            </h2>
            <p className="text-gray-300 leading-relaxed">
              O treino perfeito que você não faz perde para o treino bem
              estruturado que você consegue sustentar. Isso não é desculpa para
              treinar de qualquer jeito — é otimizar dentro das condições reais:
              qualidade × aderência × progressão × sustentabilidade. Um programa
              teoricamente excelente que depende de cinco sessões, quando sua
              agenda comporta três, cria um problema antes do primeiro treino. Por
              isso a ferramenta pergunta quantos dias você <em>realmente</em> tem
              — e monta a partir daí, incluindo um Plano B para a semana que der
              errado. Porque vai acontecer, e a diferença entre ajustar e
              abandonar é ter o próximo passo definido.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Quando devo mudar minha rotina?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Quando a vida mudar ou quando a progressão estagnar por várias
              semanas — não a cada vídeo novo que aparecer. Trocou de horário,
              ganhou ou perdeu dias livres, mudou de objetivo? Refaça a ferramenta
              com a rotina nova. A estrutura serve à sua vida atual, não a uma
              versão idealizada dela. Vale também conhecer{" "}
              <Link href="/blog/treinar-todos-os-dias-faz-mal" className={ln}>
                treinar todos os dias faz mal?
              </Link>
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              O que esta ferramenta não substitui
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Ela sugere uma estrutura — divisão, frequência, distribuição e
              duração. Ela não conhece sua técnica, sua força atual, seu
              histórico, sua recuperação real nem suas limitações. Exercícios,
              volume, intensidade, progressão e adaptações individuais são
              prescrição — e prescrição é individual. É aí que entra o{" "}
              <Link href="/consultoria" className={ln}>
                acompanhamento personalizado
              </Link>
              , presencial em Alphaville e região ou online.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Ferramenta desenvolvida a partir de evidências atuais de
              treinamento de força e da experiência do{" "}
              <Link href="/minha-historia" className={ln}>
                Montinho, personal trainer em Alphaville
              </Link>{" "}
              — que viveu na prática o que é encaixar treino em rotina cheia
              durante a própria transformação de mais de 40 kg.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h2s}>
              Perguntas frequentes sobre treino 3 e 4 vezes por semana
            </h2>
            <div className="space-y-3">
              {FAQ_3X.map((f) => (
                <details key={f.q} className="border border-white/10 p-4">
                  <summary className="text-white font-semibold cursor-pointer">{f.q}</summary>
                  <p className="text-gray-300 leading-relaxed mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Bases científicas — discreto, mas auditável */}
          <details className="border border-white/10 p-6">
            <summary className="text-gray-300 cursor-pointer hover:text-white transition-colors font-semibold">
              Como chegamos a essas recomendações — ver bases científicas
            </summary>
            <div className="mt-5 space-y-4">
              {EVIDENCE.map((e) => (
                <div key={e.id} className="text-sm leading-relaxed">
                  <p className="text-gray-300">{e.principle}</p>
                  <p className="text-gray-500 mt-1">
                    {e.reference}
                    {e.pmid ? ` · PMID ${e.pmid}` : ""}
                  </p>
                </div>
              ))}
              <p className="text-gray-500 text-xs">
                Última revisão científica: {EVIDENCE_REVIEWED_AT}. As referências
                sustentam princípios gerais de estruturação — não prescrição
                individual.
              </p>
            </div>
          </details>
        </div>
      </section>
    </>
  );
}
