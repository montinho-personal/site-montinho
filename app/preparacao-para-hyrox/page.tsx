import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";
import FAQ from "@/components/ui/FAQ";
import VideoApp from "@/components/video/VideoApp";

/**
 * Preparação para Hyrox com personal trainer.
 *
 * Nasceu das perguntas que o ChatGPT e o Gemini fazem sobre "hyrox
 * alphaville" (export do Answer the Public de 23/10/2026): quem oferece
 * plano personalizado, se existe acompanhamento online, como agendar a
 * avaliação. O site tinha os guias de Hyrox, mas nenhuma página que
 * dissesse quem prepara.
 *
 * O método é o mesmo da musculação, nas palavras do Montinho: avaliação
 * inicial, estratégia de acordo com a rotina, acompanhamento por
 * resultado, métrica e desempenho, e ajuste. Sem resultado de aluno (ele
 * ainda não preparou ninguém para a prova) e preço sob consulta.
 */

const CAMINHO = "/preparacao-para-hyrox";
const WHATS = "Oi Montinho! Quero me preparar para o Hyrox e queria entender como funciona o acompanhamento.";

export const metadata: Metadata = {
  title: { absolute: "Preparação para Hyrox com Personal Trainer em Alphaville" },
  description:
    "Preparação para o Hyrox com personal trainer: avaliação, plano de corrida, força e estações na sua rotina e ajuste pelo desempenho. Alphaville e online.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Preparação para Hyrox com Personal Trainer | Montinho",
    description: "Avaliação, plano na sua rotina e ajuste pelo que acontece em cada treino. Presencial em Alphaville e região, ou online.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const faq = [
  {
    question: "Como funciona a preparação para o Hyrox com personal?",
    answer:
      "Começa por uma avaliação: como você corre hoje, quanta força tem, quanto tempo tem na semana e quando é a prova. Com isso eu monto a estratégia — corrida, força e treinos de corrida com estações — e acompanho pelo que acontece: pace, tempo nas estações, carga dos exercícios e como você responde a cada semana. O plano muda quando os números mudam.",
  },
  {
    question: "A preparação para Hyrox é presencial ou online?",
    answer:
      "Os dois. Presencial na Arena 18, em condomínios e em casa, em Alphaville e região. Online para qualquer cidade, com o plano no aplicativo, vídeos da sua execução e ajuste semana a semana.",
  },
  {
    question: "Vocês treinam as estações do Hyrox, como trenó e SkiErg?",
    answer:
      "A preparação inclui todas as estações. O que a sua academia tiver, treinamos nela; o que não tiver, como trenó ou SkiErg, entra com adaptação na academia e algumas sessões num box com o equipamento antes da prova. Em outras academias, o atendimento presencial depende das regras do local para personal externo e de combinação prévia.",
  },
  {
    question: "Quanto tempo antes da prova devo começar?",
    answer:
      "Para quem já treina musculação ou corre, oito semanas bastam para terminar a prova bem. Quem parte do zero ganha mais começando 3 a 4 meses antes, com uma fase de base. Se a prova já está perto, dá para organizar a reta final: chegar descansado e com o ritmo testado.",
  },
  {
    question: "Preciso já correr para me preparar para o Hyrox?",
    answer:
      "Não. A avaliação mostra de onde você parte, e a corrida entra aos poucos, junto com a força. Quem vem só da musculação costuma precisar de mais corrida; quem vem da corrida, de mais força. A estratégia é montada para o que falta em você.",
  },
  {
    question: "Quanto custa a preparação para o Hyrox?",
    answer:
      "Sob consulta. O valor depende da modalidade (presencial, online ou as duas) e de quantos treinos por semana. Me chame no WhatsApp para conversarmos sobre a sua rotina e a sua prova.",
  },
  {
    question: "Dá para continuar a musculação durante a preparação?",
    answer:
      "Dá e deve. A força é o que sustenta trenó, avanço, farmers carry e wall ball, e protege joelho, lombar e ombro. Na preparação, a musculação muda de objetivo, mas continua na semana.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}${CAMINHO}`,
  name: "Preparação para Hyrox com personal trainer",
  serviceType: "Personal trainer para preparação de Hyrox",
  description:
    "Avaliação inicial, estratégia de corrida, força e estações de acordo com a rotina e acompanhamento por desempenho, presencial em Alphaville e região ou online.",
  url: `${SITE_URL}${CAMINHO}`,
  provider: { "@type": "Person", name: "Montinho", jobTitle: "Personal Trainer", url: `${SITE_URL}/minha-historia` },
  areaServed: [
    { "@type": "Neighborhood", name: "Alphaville" },
    { "@type": "Neighborhood", name: "Tamboré" },
    { "@type": "City", name: "Barueri" },
    { "@type": "City", name: "Santana de Parnaíba" },
    { "@type": "Country", name: "Brasil" },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

const ETAPAS = [
  {
    titulo: "1. Avaliação inicial",
    texto:
      "A mesma da musculação, com o que o Hyrox pede a mais: como você corre hoje, quanto aguenta de força, que equipamento tem perto, quantos dias tem na semana e quando é a prova.",
  },
  {
    titulo: "2. A estratégia na sua rotina",
    texto:
      "Corrida, força e treinos de corrida com estações distribuídos nos dias que você tem de verdade — não nos dias de uma planilha genérica. Se você tem três dias, o plano é de três dias.",
  },
  {
    titulo: "3. Acompanhamento pelos números",
    texto:
      "Pace dos trechos de 1 km, tempo em cada estação nos simulados, carga dos exercícios de força, como você se sentiu e os vídeos da execução. É o desempenho que diz se a estratégia está funcionando.",
  },
  {
    titulo: "4. Ajuste",
    texto:
      "Você faltou na corrida da semana, a carga parou de subir, o pace caiu no quinto quilômetro, o trenó travou: alguém percebe e decide o que muda na semana seguinte.",
  },
];

export default function PreparacaoHyroxPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            Personal Trainer · Hyrox · Alphaville e online
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={h}>
            Preparação para o Hyrox com personal trainer
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Montar uma planilha de Hyrox é o começo. O trabalho é o que vem depois: ver o pace caindo no quinto quilômetro, o trenó
            travando, a semana em que a corrida e a força caíram no mesmo dia — e ajustar a estratégia antes que isso vire o seu tempo de prova.
          </p>
          <a
            href={getWhatsAppUrl(WHATS)} data-wa-origem="topo" data-cta-id="preparacao-para-hyrox:topo"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            Quero me preparar para o Hyrox
          </a>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>Como funciona</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8" style={h}>
            O mesmo método da musculação, com a prova como objetivo
          </h2>
          <div className="grid sm:grid-cols-2 gap-px border border-white/10">
            {ETAPAS.map((e) => (
              <div key={e.titulo} className="p-6 border-b border-r border-white/10">
                <p className="text-white font-semibold mb-2">{e.titulo}</p>
                <p className="text-gray-300 text-sm leading-relaxed font-light">{e.texto}</p>
              </div>
            ))}
          </div>
          <p className="text-gray-300 leading-relaxed font-light mt-8 max-w-3xl">
            É Montinho e aluno trabalhando juntos: eu monto, observo e ajusto; você treina, registra e me conta o que aconteceu. Sem os
            seus números, eu não tenho como saber o que mudar.
          </p>
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8" style={h}>O que a preparação cobre</h2>
          <ul className="space-y-4 text-gray-300 leading-relaxed font-light max-w-3xl">
            <li><strong className="text-white font-semibold">Corrida:</strong> base, tiros de 1 km em ritmo de prova e o pace que a sua meta pede — a conta está na <Link href="/ferramentas/calculadora-tempo-hyrox" className={ln}>Calculadora de Tempo do Hyrox</Link>.</li>
            <li><strong className="text-white font-semibold">Força:</strong> pernas, costas e pegada para trenó, avanço, farmers carry e wall ball.</li>
            <li><strong className="text-white font-semibold">As oito estações:</strong> técnica de cada uma e como dividir as séries. A ordem e os pesos estão em <Link href="/blog/estacoes-do-hyrox" className={ln}>estações do Hyrox</Link>.</li>
            <li><strong className="text-white font-semibold">Corrida cansada e simulado:</strong> o treino que mais se parece com a prova, nas semanas certas.</li>
            <li><strong className="text-white font-semibold">Reta final:</strong> a semana que deixa você descansado sem perder o ritmo, e o que comer antes da prova — veja <Link href="/blog/alimentacao-para-hyrox" className={ln}>alimentação para Hyrox</Link>.</li>
          </ul>
        </div>
      </section>

      <section className="py-16 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8" style={h}>Presencial ou online</h2>
          <div className="grid sm:grid-cols-2 gap-px border border-white/10">
            <div className="p-6 border-b border-r border-white/10">
              <p className="text-white font-semibold mb-2">Presencial</p>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Na Arena 18, em condomínios e em casa, em Alphaville, Tamboré, Barueri e Santana de Parnaíba. Em outras academias, depende
                das regras do local para personal externo e de combinação prévia. Veja <Link href="/onde-atendo" className={ln}>onde atendo</Link>.
              </p>
            </div>
            <div className="p-6 border-b border-r border-white/10">
              <p className="text-white font-semibold mb-2">Online</p>
              <p className="text-gray-300 text-sm leading-relaxed font-light">
                Para qualquer cidade: o plano no aplicativo, vídeos da sua execução com correção e o ajuste semana a semana. Veja como
                funciona a <Link href="/consultoria-online" className={ln}>consultoria online</Link>.
              </p>
            </div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mt-6 max-w-3xl">
            Onde treinar as estações na região: <Link href="/blog/hyrox-alphaville-onde-treinar" className={ln}>Alphaville</Link>,{" "}
            <Link href="/blog/hyrox-barueri-onde-treinar" className={ln}>Barueri</Link> e{" "}
            <Link href="/blog/hyrox-santana-de-parnaiba-onde-treinar" className={ln}>Santana de Parnaíba</Link>. Os boxes desses guias são
            referência de equipamento, não locais de atendimento.
          </p>
        </div>
        <VideoApp variante="online" onde="preparacao-para-hyrox" />
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6" style={h}>Antes de falar comigo</h2>
          <p className="text-gray-300 leading-relaxed font-light mb-4 max-w-3xl">Se quiser chegar já com uma ideia de onde você está:</p>
          <ul className="space-y-2 text-gray-300 font-light">
            <li><Link href="/blog/treino-de-hyrox" className={ln}>Treino de Hyrox: a planilha de 8 semanas</Link></li>
            <li><Link href="/blog/hyrox-pft" className={ln}>Hyrox PFT: o teste físico que indica a categoria</Link></li>
            <li><Link href="/blog/hyrox-em-dupla" className={ln}>Hyrox em dupla: o melhor jeito de estrear</Link></li>
            <li><Link href="/blog/hyrox-brasil-2026" className={ln}>Calendário do Hyrox no Brasil</Link></li>
          </ul>
        </div>
      </section>

      <section className="py-16 border-t border-white/10 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>Perguntas frequentes</p>
          <h2 className="text-3xl font-bold text-white mb-10" style={h}>Dúvidas sobre a preparação para o Hyrox</h2>
          <FAQ itens={faq} placement="preparacao-para-hyrox" />
        </div>
      </section>

      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={h}>A prova é um dia. A preparação é toda semana.</h2>
          <p className="text-gray-300 font-light leading-relaxed mb-8 text-lg">
            Não se compare com ninguém: cada pessoa tem a própria genética, a própria rotina e a própria história, com altos e baixos. O
            que importa é encontrar um jeito de treinar que você consiga seguir pelo resto da vida, com aderência e progressão. O Hyrox pode
            ser a meta que faz isso acontecer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={getWhatsAppUrl(WHATS)} data-wa-origem="fim" data-cta-id="preparacao-para-hyrox:fim"
              target="_blank" rel="noopener noreferrer"
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
