import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import BatalhaDosWheys from "@/components/whey/BatalhaDosWheys";
import { carregarCatalogo } from "@/lib/comparador-whey-catalogo";
import { VALIDADE_PRECO_DIAS, analisa, reais } from "@/lib/comparador-whey";

/**
 * Batalha dos Wheys — o comparador de whey protein.
 *
 * Intenção (prints de 08/10/2026): "comparador de whey" e "melhor whey
 * custo benefício" são a mesma busca, então é uma página só. A página não
 * declara "o melhor whey": mostra o custo do grama de proteína com a mesma
 * régua para qualquer marca, e o visitante decide.
 *
 * Não há Product/Offer no schema: o catálogo é pequeno, os preços são
 * conferidos à mão e mudam — marcar oferta desatualizada seria enganoso.
 */

export const revalidate = 3600;

const CAMINHO = "/ferramentas/comparador-whey-protein";

export const metadata: Metadata = {
  title: "Comparador de Whey: Qual Tem o Melhor Custo-Benefício?",
  description:
    "Compare wheys de qualquer marca pelo custo do grama de proteína, não pelo preço do pote. Veja concentração, quanto rende e quanto custa por mês. Grátis.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Batalha dos Wheys — qual whey compensa mais?",
    description: "Preço, proteína de verdade e rendimento lado a lado. Descubra qual whey entrega mais proteína pelo seu dinheiro.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Batalha dos Wheys — Comparador de Whey Protein",
  descricao:
    "Compara produtos de whey protein pelo custo do grama de proteína declarada no rótulo, com concentração, proteína total da embalagem, custo de 25 g de proteína e custo para 30, 60 ou 90 dias.",
  caminho: CAMINHO,
  categoria: "UtilitiesApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Comparador de Whey Protein", item: `${SITE_URL}${CAMINHO}` },
  ],
};

// Exemplo da metodologia: dois rótulos DE EXEMPLO, declarados como tal.
const EX_A = { pacoteG: 900, porcaoG: 30, proteinaPorcaoG: 24, precoCentavos: 12000 };
const EX_B = { pacoteG: 900, porcaoG: 30, proteinaPorcaoG: 18, precoCentavos: 10000 };
const aA = analisa(EX_A);
const aB = analisa(EX_B);

const faq: ItemFAQ[] = [
  { question: "Qual o melhor whey custo-benefício?", answer: "O que entrega a proteína mais barata — e isso não é o pote mais barato. A conta é o preço dividido pela proteína total do pote (porções × proteína da porção). Um whey de R$ 100 com 18 g em 30 g pode sair mais caro por grama de proteína que um de R$ 120 com 24 g em 30 g. O comparador faz essa conta com o rótulo de cada produto." },
  { question: "Como saber se o whey compensa?", answer: "Olhe três números do rótulo: peso do pote, porção e proteína por porção. Divida a proteína pela porção para saber a concentração e o preço pela proteína total para saber o custo. Depois compare o custo de 25 g de proteína entre os produtos." },
  { question: "Qual a marca de whey mais confiável?", answer: "O comparador não dá selo de confiança: ele usa o que a marca declara no rótulo. Para confiar no rótulo, vale ver se a marca publica laudo de análise do lote e se o produto aparece em testes independentes, como os de entidades de defesa do consumidor, sempre olhando a data do teste." },
  { question: "Por que alguns wheys são bem mais baratos?", answer: "Concentração menor (menos proteína por porção), mistura com outras proteínas, embalagem maior ou venda direta pela fábrica são explicações comuns. O preço sozinho não diz qual é o caso — a proteína por porção diz. Por isso a comparação é sempre pelo custo da proteína." },
  { question: "Whey isolado ou concentrado: qual compensa mais?", answer: "Pelo custo da proteína, o concentrado costuma sair mais barato. O isolado tem mais proteína por grama e menos lactose, o que importa para quem tem intolerância. Para ganhar massa, a proteína total do dia pesa mais que o tipo de whey." },
  { question: "Quanto rende 1 kg de whey?", answer: "Depende da concentração. Com 24 g de proteína em 30 g, 1 kg tem cerca de 800 g de proteína, ou 32 doses de 25 g. Com 18 g em 30 g, são 600 g de proteína e 24 doses." },
  { question: "Qual é o whey mais gostoso e barato?", answer: "Sabor é pessoal e muda por sabor e versão da fórmula. O comparador ainda não tem avaliação de sabor: ela vai entrar só com notas reais de quem usou, nunca inventadas. Até lá, compare o custo e teste uma embalagem menor antes de comprar o pote grande." },
  { question: "O preço do comparador é atualizado?", answer: `Os preços do catálogo são conferidos à mão na loja oficial, com data. Preço com mais de ${VALIDADE_PRECO_DIAS} dias aparece como último preço conhecido e não entra na comparação. Se o preço que você vê na loja for outro, use a opção de digitar o rótulo.` },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const cta = "text-gray-300 text-sm underline underline-offset-4 decoration-1 hover:text-white min-h-[44px] inline-flex items-center";

/** O catálogo vem do banco; se falhar, volta vazio e só a comparação manual aparece. */
async function ComparadorComCatalogo() {
  const catalogo = await carregarCatalogo();
  return <BatalhaDosWheys catalogo={catalogo} />;
}

async function TamanhoCatalogo() {
  const n = (await carregarCatalogo()).length;
  return <>{n === 0 ? "em montagem — use a comparação manual" : `${n} ${n === 1 ? "produto conferido" : "produtos conferidos"}`}</>;
}

export default function ComparadorWheyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Batalha dos Wheys · grátis · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>
            Comparador de Whey Protein: Qual Tem o Melhor Custo-Benefício?
          </h1>
          <Compartilhar contexto="tool" titulo="Batalha dos Wheys" caminho={CAMINHO} local="tool_top" ferramenta="comparador-whey" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Compare preço, proteína de verdade e rendimento. Descubra qual whey entrega mais proteína pelo seu dinheiro — com a mesma régua para
            qualquer marca.
          </p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ComparadorComCatalogo />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
            <p className="text-white text-lg font-semibold" style={h}>Não compare o preço do pote. Compare o preço da proteína.</p>
            <p className="text-gray-300 leading-relaxed mt-1">Dois potes de 900 g podem entregar quantidades bem diferentes de proteína.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como saber qual whey tem o melhor custo-benefício</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Exemplo com dois rótulos de exemplo, ambos de 900 g e porção de 30 g. O primeiro custa {reais(EX_A.precoCentavos)} e tem{" "}
              {EX_A.proteinaPorcaoG} g de proteína por porção; o segundo custa {reais(EX_B.precoCentavos)} e tem {EX_B.proteinaPorcaoG} g.
            </p>
            <ul className="text-gray-300 leading-relaxed space-y-1 list-disc pl-5 mb-3">
              <li>Primeiro: {aA.proteinaTotalG.toLocaleString("pt-BR")} g de proteína no pote → <strong className="text-white">{reais(aA.centavosPor25g)} por 25 g</strong>.</li>
              <li>Segundo: {aB.proteinaTotalG.toLocaleString("pt-BR")} g de proteína no pote → <strong className="text-white">{reais(aB.centavosPor25g)} por 25 g</strong>.</li>
            </ul>
            <p className="text-gray-300 leading-relaxed">O pote mais barato entrega a proteína mais cara. É essa conta que o comparador faz para você.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Whey concentrado, isolado ou hidrolisado</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Concentrado</strong> tem menos proteína por grama e mais lactose e gordura, e costuma ser o mais barato
              por grama de proteína. <strong className="text-white">Isolado</strong> passa por mais filtragem: mais proteína por grama e menos
              lactose. <strong className="text-white">Hidrolisado</strong> vem pré-digerido e costuma custar mais.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Para ganhar massa, isolado não é automaticamente melhor: o que pesa é a proteína total do dia. O isolado faz diferença para quem tem
              intolerância à lactose. Rótulo com proteína baixa demais para um whey (abaixo de 60% da porção) costuma ser blend ou hipercalórico —
              o comparador avisa. Veja mais em{" "}
              <Link href="/blog/whey-concentrado-vs-isolado-vs-hidrolisado" className={ln}>concentrado vs isolado vs hidrolisado</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como o comparador calcula</h2>
            <ul className="text-gray-300 text-sm leading-relaxed space-y-2 list-disc pl-5">
              <li><strong className="text-white">Concentração</strong> = proteína da porção ÷ porção × 100.</li>
              <li><strong className="text-white">Proteína no pote</strong> = (peso do pote ÷ porção) × proteína da porção.</li>
              <li><strong className="text-white">Custo do grama de proteína</strong> = preço ÷ proteína no pote. O de 25 g é esse valor × 25.</li>
              <li><strong className="text-white">Rotina</strong> = proteína por dia × dias × custo do grama. A compra real arredonda para potes inteiros.</li>
              <li><strong className="text-white">Preço de equilíbrio</strong> = o preço em que um whey empataria com o mais econômico, pelo custo da proteína.</li>
            </ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-3">
              Tudo é estimativa a partir do rótulo declarado, que a norma permite arredondar. Os preços do catálogo são conferidos à mão na loja
              oficial e mostram condição de pagamento, loja e data; com mais de {VALIDADE_PRECO_DIAS} dias, saem da comparação. Pix e cupom nunca
              são tratados como preço universal, e o frete não entra (depende da região). Nenhuma marca paga para aparecer, e a ordem do resultado é
              só pelo custo da proteína.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Quanto whey você precisa por dia?</p>
              <Link href="/ferramentas/calculadora-whey" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Whey →</Link>
            </div>
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Quanto de proteína no dia todo?</p>
              <Link href="/ferramentas/calculadora-de-proteina" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Proteína →</Link>
            </div>
            <div className="border border-white/15 p-5 sm:col-span-2">
              <p className="text-white font-semibold mb-2">Suplemento é detalhe. O que faz o resultado é o treino que você consegue manter.</p>
              <Link href="/consultoria-online" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Conhecer a consultoria online →</Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="comparador-whey" />
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            Por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Ferramenta educativa de comparação de
            preço; não é prescrição nutricional. Catálogo: <TamanhoCatalogo />.
          </p>
        </div>
      </section>
    </>
  );
}
