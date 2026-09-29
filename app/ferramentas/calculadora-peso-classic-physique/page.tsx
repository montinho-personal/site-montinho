import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import CalculadoraClassic, { TabelaClassic } from "@/components/classic/CalculadoraClassic";
import { DATA_CONFERENCIA_TEXTO, FONTE_CLASSIC, RAMON, faixaPorCm, fmt1 } from "@/lib/classic-physique";

/**
 * Calculadora de Peso da Classic Physique (IFBB Pro League).
 *
 * A PERGUNTA: "com a minha altura, qual seria o peso máximo na Classic
 * Physique profissional?". A resposta é um LIMITE REGULAMENTAR, nunca peso
 * ideal — a página e o componente evitam essa palavra de propósito.
 *
 * SERP (set/2026): tabelas estáticas em português (Esportelândia, Inovar
 * Esportes), calculadora da NPC Sudamérica (tabela amadora, por fórmula) e o
 * "Division Finder" da Fitness Volt (em inglês). Nenhuma calculadora em
 * português com a tabela PRO, pés/polegadas, peso opcional e fonte visível.
 *
 * Todos os números saem de lib/classic-physique.ts. Os exemplos por altura
 * (1,70 a 1,90 m) preenchem a mesma calculadora — nada de uma URL por altura.
 */

const CAMINHO = "/ferramentas/calculadora-peso-classic-physique";

export const metadata: Metadata = {
  title: { absolute: "Calculadora Classic Physique: Peso por Altura | Montinho" },
  description:
    "Digite sua altura e veja o peso máximo permitido na Classic Physique profissional, pela tabela oficial da IFBB Pro League. Em kg, libras, cm ou pés.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Calculadora de Peso da Classic Physique | Montinho",
    description: "Qual seria o seu limite na Classic Physique profissional? Digite a altura e veja a faixa oficial da IFBB Pro League.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Calculadora de Peso da Classic Physique",
  descricao: "Mostra o peso máximo permitido na Men's Classic Physique profissional da IFBB Pro League para uma altura, em cm ou pés/polegadas, com a faixa oficial e a tabela completa.",
  caminho: CAMINHO,
  categoria: "SportsApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Calculadora de Peso da Classic Physique", item: `${SITE_URL}${CAMINHO}` },
  ],
};

const k = (cm: number) => fmt1(faixaPorCm(cm).kg);
const faq: ItemFAQ[] = [
  { question: "Qual é o peso máximo na Classic Physique?", answer: `Depende da altura. Na IFBB Pro League, os limites vão de ${k(160)} kg (até 162,6 cm) a ${fmt1(faixaPorCm(210).kg)} kg (acima de 200,7 cm), em 17 faixas. A tabela completa está nesta página.` },
  { question: "Quanto pode pesar alguém de 1,80 m na Classic Physique?", answer: `${k(180)} kg na Classic Physique profissional: 1,80 m entra na faixa até 180,3 cm (5'11"). Com 1,81 m, a faixa já é a seguinte, até 182,9 cm, com limite de ${k(181)} kg.` },
  { question: "Como calcular o limite da Classic Physique?", answer: "Encontre a primeira faixa da tabela oficial cujo teto de altura seja igual ou maior que a sua altura — a regra é \"até e incluindo\". O peso máximo dessa faixa é o seu limite. A calculadora faz isso com a altura exata que você digita, sem arredondar." },
  { question: "Por que a Classic Physique tem limite de peso?", answer: "Para preservar a proposta da categoria — proporção, cintura fina e linhas clássicas — e manter a comparação justa entre alturas. Sem o limite, ela viraria um Open menor, com vantagem para quem tivesse mais massa a qualquer custo." },
  { question: "Classic Physique profissional e amadora usam a mesma tabela?", answer: "Não necessariamente. Esta calculadora usa a tabela profissional da IFBB Pro League. Competições amadoras da NPC Worldwide e de outras federações podem ter limites próprios, algumas calculados por fórmula em centímetros. Confira sempre a regra da federação em que você vai competir." },
  { question: "Quanto Ramon Dino pode pesar na Classic Physique?", answer: `Com ${fmt1(RAMON.alturaCm / 100).replace(",0", "")} m, Ramon entra na faixa até 182,9 cm, com limite de ${k(RAMON.alturaCm)} kg. Na pesagem oficial do Mr. Olympia 2026, em ${RAMON.data}, ele marcou ${fmt1(RAMON.pesagemKg)} kg.` },
  { question: "Qual a diferença entre Classic Physique e Open?", answer: "O Open não tem limite de peso: vence quem combina mais massa muscular com condicionamento e proporção. A Classic limita o peso pela altura e valoriza linhas, cintura e poses clássicas, como a vacuum." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function CalculadoraClassicPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-12 pb-6 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Calculadora de Peso da Classic Physique</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Calculadora de Peso da Classic Physique: veja seu limite por altura</h1>
          <p className="text-gray-300 text-lg leading-relaxed">Digite sua altura e veja qual seria o peso máximo permitido na Men&apos;s Classic Physique profissional da IFBB Pro League — a categoria de Ramon Dino no Mr. Olympia.</p>
        </div>
      </section>

      <section className="pb-10 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CalculadoraClassic variante="completa" placement="ferramenta" />
          <noscript><p className="text-gray-300 mt-4">A calculadora precisa de JavaScript. A tabela oficial completa está logo abaixo.</p></noscript>
        </div>
      </section>

      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300 leading-relaxed">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como funciona o limite de peso da Classic Physique?</h2>
            <p>Na Classic Physique, cada atleta é pesado e medido antes de competir. A altura define uma faixa, e cada faixa tem um peso máximo: quem passa dele na pesagem não compete naquela categoria. A regra é &quot;até e incluindo&quot; — com 180,3 cm você está na faixa de {k(180.3)} kg; com 180,4 cm, já na seguinte, de {k(180.4)} kg.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Tabela de altura e peso da Classic Physique Pro</h2>
            <p className="mb-2">Tabela da Men&apos;s Classic Physique profissional da IFBB Pro League. A liga publica os valores em polegadas e libras; os centímetros e quilos são a conversão exata, arredondada a uma casa.</p>
            <TabelaClassic />
            <p className="text-gray-500 text-xs mt-3">Fonte: <a href={FONTE_CLASSIC.url} target="_blank" rel="noopener noreferrer" className={ln}>{FONTE_CLASSIC.nome}</a>. Conferida em {DATA_CONFERENCIA_TEXTO}.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Por que a Classic Physique tem limite de peso?</h2>
            <p>A Classic Physique foi criada pela IFBB Pro League em 2016 para premiar o físico &quot;clássico&quot;: ombros largos, cintura fina, linhas e proporção. Sem teto de peso, a categoria viraria um Open menor, e ganharia quem acumulasse mais massa a qualquer custo. O limite força outra pergunta: quanto músculo, e com que distribuição, cabe no peso permitido para a sua altura.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Como é definido o limite pela altura?</h2>
            <p>O mesmo músculo, num corpo mais alto, se distribui por mais osso e parece menor. Por isso o teto sobe junto com a altura: de {k(160)} kg para quem tem até 1,626 m a {k(190.5)} kg para quem tem até 1,905 m. As faixas não são uma recomendação de peso — são a regra de elegibilidade da competição.</p>
          </div>

          <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.05] p-5">
            <h2 className="text-xl font-bold text-white mb-2" style={h}>Classic Physique profissional x amadora: existe diferença?</h2>
            <p><strong className="text-white">Esta calculadora usa a tabela PROFISSIONAL da IFBB Pro League.</strong> Competições amadoras — da NPC Worldwide e de outras federações — podem usar limites diferentes, algumas por fórmula em centímetros. Se você vai competir como amador, confira a tabela da federação do seu campeonato.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-3" style={h}>Qual é o limite de peso de Ramon Dino?</h2>
            <p>Ramon Dino tem 1,81 m, o que o coloca na faixa até 182,9 cm (6&apos;0&quot;), com limite de <strong className="text-white">{k(RAMON.alturaCm)} kg</strong>. Na pesagem oficial do Mr. Olympia 2026, em {RAMON.data}, ele marcou {fmt1(RAMON.pesagemKg)} kg — 500 gramas abaixo do teto. A história completa, com a diferença entre peso de pesagem e peso fora de temporada, está em <Link href="/blog/ramon-dino-peso-altura" className={ln}>quanto pesa Ramon Dino</Link>; o desempenho dele no Olympia, em <Link href="/blog/resultado-classic-physique-mr-olympia-2026" className={ln}>resultado da Classic Physique do Mr. Olympia 2026</Link>.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="calculadora-classic" />
          </div>

          <p className="text-gray-500 text-xs">Por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer. Esta ferramenta reproduz os limites regulamentares publicados pela IFBB Professional League. Ela não indica peso ideal, saúde, percentual de gordura, preparação competitiva ou aptidão para competir.</p>
        </div>
      </section>
    </>
  );
}
