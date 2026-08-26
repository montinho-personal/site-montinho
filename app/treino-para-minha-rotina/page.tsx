import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { EVIDENCE, EVIDENCE_REVIEWED_AT } from "@/lib/rotina/evidence";
import RotinaQuiz from "@/components/rotina/RotinaQuiz";

export const metadata: Metadata = {
  title: "Treino Para Minha Rotina: Descubra Sua Melhor Divisão",
  description:
    "Quantos dias e quanto tempo você realmente tem para treinar? Descubra uma estrutura de musculação compatível com sua rotina, objetivo e experiência. Gratuito, 1 minuto.",
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

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Treino Para Minha Rotina", item: `${SITE_URL}/treino-para-minha-rotina` },
  ],
};

const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const h2s = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;

export default function TreinoParaMinhaRotinaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
