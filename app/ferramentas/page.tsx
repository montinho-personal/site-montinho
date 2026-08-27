import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, blogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Ferramentas Gratuitas de Treino",
  description:
    "Ferramentas gratuitas do Montinho: descubra seu perfil de treino, monte a estrutura que cabe na sua semana, mande um vídeo da sua execução, tire dúvidas de musculação e compare as academias de Alphaville. Sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas` },
  openGraph: {
    title: "Ferramentas Gratuitas de Treino | Montinho",
    description:
      "Descubra seu perfil, monte a estrutura da sua semana, mande um vídeo da sua execução e tire dúvidas de treino. Gratuito e sem cadastro.",
    url: `${SITE_URL}/ferramentas`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
  ],
};

/**
 * ItemList é o tipo correto aqui: a página existe para listar as
 * ferramentas. Nada de Review, Rating ou FAQ inventado.
 */
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Ferramentas gratuitas do Montinho Personal Trainer",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Diagnóstico Montinho", url: `${SITE_URL}/diagnostico` },
    { "@type": "ListItem", position: 2, name: "Treino Para Minha Rotina", url: `${SITE_URL}/treino-para-minha-rotina` },
    { "@type": "ListItem", position: 3, name: "Pergunte ao Montinho", url: `${SITE_URL}/pergunte-ao-montinho` },
    { "@type": "ListItem", position: 4, name: "Revisão Gratuita de Execução", url: `${SITE_URL}/revisao-de-execucao` },
    { "@type": "ListItem", position: 5, name: "Calculadora de Proteína", url: `${SITE_URL}/ferramentas/calculadora-de-proteina` },
    { "@type": "ListItem", position: 6, name: "Calculadora de Déficit Calórico", url: `${SITE_URL}/ferramentas/calculadora-deficit-calorico` },
    { "@type": "ListItem", position: 7, name: "Calculadora de 1RM", url: `${SITE_URL}/ferramentas/calculadora-1rm` },
    { "@type": "ListItem", position: 8, name: "Qual Academia de Alphaville Combina com Você", url: `${SITE_URL}/academia-ideal-alphaville` },
  ],
};

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const ln =
  "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

const FERRAMENTAS = [
  {
    href: "/diagnostico",
    nome: "Diagnóstico Montinho",
    pergunta: "Por onde eu começo?",
    tempo: "9 perguntas · 1–2 minutos",
    texto:
      "Olha o quadro todo: objetivo, disponibilidade, experiência e o que mais te trava hoje. No fim, mostra qual perfil de treino combina com o seu momento, qual é o seu principal gargalo e quais conteúdos fazem sentido para você agora.",
    quando: "Use quando você não sabe por onde começar ou sente que está travado sem entender o motivo.",
  },
  {
    href: "/treino-para-minha-rotina",
    nome: "Treino Para Minha Rotina",
    pergunta: "Qual divisão eu sigo?",
    tempo: "8 perguntas · cerca de 1 minuto",
    texto:
      "Cruza os dias que você realmente tem, o tempo por sessão, sua experiência e onde você treina para sugerir uma estrutura semanal — full body, upper/lower, ABC ou PPL — com a semana desenhada e um plano B para quando a agenda apertar.",
    quando: "Use quando você já vai treinar e a dúvida é como distribuir os treinos na semana.",
  },
  {
    href: "/revisao-de-execucao",
    nome: "Revisão Gratuita de Execução",
    pergunta: "Estou fazendo certo?",
    tempo: "grave uma série · envie pelo WhatsApp",
    texto:
      "Você grava uma série completa do exercício e me manda pelo WhatsApp. Eu mesmo assisto e te passo os principais pontos que vale observar na execução — amplitude, ritmo, controle, o que muda quando a fadiga aparece.",
    quando: "Use quando a dúvida é sobre o seu movimento, não sobre o conceito. Sem cadastro e sem custo.",
  },
  {
    href: "/ferramentas/calculadora-de-proteina",
    nome: "Calculadora de Proteína",
    pergunta: "Quanto de proteína eu preciso?",
    tempo: "10 segundos · sem cadastro",
    texto:
      "Informe seu peso e veja referências de 1,6, 2,0 e 2,2 g de proteína por kg por dia, com divisão por refeições e exemplos de alimentos com a fonte de cada valor.",
    quando: "Use quando quiser sair do achismo sobre a meta de proteína — o peso não sai do seu navegador.",
  },
  {
    href: "/ferramentas/calculadora-deficit-calorico",
    nome: "Calculadora de Déficit Calórico",
    pergunta: "Quanto devo comer para emagrecer?",
    tempo: "1 minuto · sem cadastro",
    texto:
      "Estime sua taxa metabólica, seu gasto diário e veja faixas de déficit de 10%, 15–20% e 25% a partir do seu peso, altura, idade e rotina — com a conta aberta, mostrando de onde vem cada número.",
    quando: "Use quando a dúvida é quantas calorias comer por dia. Seus dados não saem do navegador.",
  },
  {
    href: "/ferramentas/calculadora-1rm",
    nome: "Calculadora de 1RM",
    pergunta: "Quanto colocar na barra?",
    tempo: "10 segundos · sem cadastro",
    texto:
      "Informe uma carga e suas repetições para estimar seu 1RM, ver as cargas de 50% a 100% e descobrir exatamente quais anilhas colocar de cada lado da barra — considerando as que a sua academia tem.",
    quando: "Use no meio do treino, entre uma série e outra. Não é preciso testar carga máxima.",
  },
  {
    href: "/pergunte-ao-montinho",
    nome: "Pergunte ao Montinho",
    pergunta: "Tenho uma dúvida específica",
    tempo: "resposta na hora",
    texto: `Responde perguntas de treino, exercício, emagrecimento e alimentação buscando nos ${blogPosts.length} conteúdos publicados no site — e mostra quais artigos embasaram cada resposta, para você conferir a fonte.`,
    quando: "Use quando a dúvida é pontual: como executar um exercício, se um alimento atrapalha, quanto descansar.",
  },
];

/**
 * Ferramenta de alcance local, separada das outras de propósito. As quatro
 * acima respondem perguntas de treino e servem qualquer pessoa; esta responde
 * uma pergunta de localização e só faz sentido para quem está em Alphaville.
 * Misturar as duas coisas na mesma lista faria a maioria dos leitores abrir
 * uma ferramenta que não pode usar.
 */
const FERRAMENTA_LOCAL = {
  href: "/academia-ideal-alphaville",
  nome: "Qual Academia Combina com Você",
  pergunta: "Onde eu treino em Alphaville?",
  tempo: "8 perguntas · cerca de 1 minuto",
  texto:
    "Cruza o que você marcou como prioridade — região, horário, estacionamento, estilo de treino — com informações verificadas sobre cada academia de Alphaville, e mostra as que mais se encaixam, listando critério por critério o que bate e o que não bate.",
  quando: "Use se você mora ou trabalha em Alphaville e ainda não decidiu onde treinar. Não elege a melhor academia — mostra qual combina com a sua rotina.",
};

export default function FerramentasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      {/* Hero */}
      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuitas · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Ferramentas para sair do &ldquo;não sei o que fazer&rdquo;
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Cada uma responde a uma pergunta diferente. Você não precisa usar
            todas — comece pela que descreve melhor a sua dúvida de agora.
          </p>
        </div>
      </section>

      {/* As ferramentas */}
      <section className="py-14 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
          {FERRAMENTAS.map((f) => (
            <div
              key={f.href}
              className="relative border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-7 sm:p-9"
            >
              <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
                {f.pergunta}
              </p>
              <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
                {f.nome}
              </h2>
              <p className="text-gray-400 text-sm mb-4">{f.tempo}</p>
              <p className="text-gray-300 leading-relaxed mb-4">{f.texto}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{f.quando}</p>
              <Link
                href={f.href}
                className="inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[52px]"
              >
                Abrir {f.nome} <span aria-hidden="true">&nbsp;→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Ferramenta local */}
      <section className="pb-14 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-white/10 pt-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: "#BA9E50" }}>
              Só para quem é de Alphaville
            </p>
            <div className="relative border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-7 sm:p-9">
              <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
              <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
                {FERRAMENTA_LOCAL.pergunta}
              </p>
              <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
                {FERRAMENTA_LOCAL.nome}
              </h2>
              <p className="text-gray-400 text-sm mb-4">{FERRAMENTA_LOCAL.tempo}</p>
              <p className="text-gray-300 leading-relaxed mb-4">{FERRAMENTA_LOCAL.texto}</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{FERRAMENTA_LOCAL.quando}</p>
              <Link
                href={FERRAMENTA_LOCAL.href}
                className="inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[52px]"
              >
                Comparar academias <span aria-hidden="true">&nbsp;→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo indexável */}
      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Qual delas eu uso?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A diferença é o tamanho da pergunta. Se a dúvida é{" "}
              <strong className="text-white">&ldquo;por onde eu começo?&rdquo;</strong>, o
              Diagnóstico olha o contexto inteiro. Se você já vai treinar e a dúvida
              é <strong className="text-white">&ldquo;como organizo minha semana?&rdquo;</strong>,
              o Treino Para Minha Rotina resolve. Se a dúvida é sobre o{" "}
              <strong className="text-white">seu próprio movimento</strong>, a
              Revisão de Execução é a única que olha para você de verdade — você
              grava uma série e eu assisto. Se é algo pontual —{" "}
              <strong className="text-white">&ldquo;posso treinar com dor?&rdquo;</strong>,{" "}
              <strong className="text-white">&ldquo;whey antes ou depois?&rdquo;</strong> —, o
              Pergunte ao Montinho responde na hora.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Elas conversam entre si: o resultado de uma sugere a outra quando faz
              sentido. E nenhuma pede cadastro, e-mail ou telefone — o resultado
              aparece na tela, e você decide se quer conversar depois.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              De onde vêm as respostas
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              De três lugares: a prática de acompanhar alunos todos os dias; a
              evidência científica — os estudos estão citados nas referências dos
              próprios artigos, para você conferir; e o trabalho de grandes
              treinadores do Brasil e do mundo que eu estudo e acompanho, entre eles
              Fabrício Pacholok, Leandro Twin, Júlio Balestrin, Coach Rubens e Hany
              Rambod.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Nenhuma dessas fontes entrega fórmula secreta. Elas dão direção. A
              melhor estratégia continua sendo a que se encaixa nas suas
              individualidades e na sua rotina de agora — a que você consegue seguir
              por mais tempo, com mais consistência e melhor progressão.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que elas não fazem
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Nenhuma delas conhece sua técnica, sua força atual, seu histórico de
              lesão ou como você recupera. São ferramentas educativas: sugerem
              estrutura e direção, não prescrição. Não substituem médico,
              fisioterapeuta ou nutricionista, e não fazem diagnóstico.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Quando o próximo passo precisa considerar o seu caso de verdade —
              exercícios, cargas, progressão, correção de execução e ajustes ao longo
              do caminho — o caminho é o{" "}
              <Link href="/consultoria" className={ln}>
                acompanhamento personalizado
              </Link>
              , presencial em Alphaville e região ou online. Feito por quem perdeu
              mais de 40 kg antes de treinar qualquer pessoa — e que faz isso porque
              gosta de ver alguém descobrir que também consegue. As ferramentas dão
              a direção; o <strong className="text-white">chalalá</strong> vem de
              alguém olhando o seu caso.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Prefere ler antes?
            </h2>
            <p className="text-gray-300 leading-relaxed">
              O{" "}
              <Link href="/blog" className={ln}>
                blog
              </Link>{" "}
              tem {blogPosts.length} conteúdos sobre treino, emagrecimento,
              exercícios e nutrição — e é a mesma base que alimenta as ferramentas
              acima. Você também pode conhecer{" "}
              <Link href="/minha-historia" className={ln}>
                a história por trás disso tudo
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
