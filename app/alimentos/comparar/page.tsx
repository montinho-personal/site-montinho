import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { todosAlimentos } from "@/lib/alimentos/base";
import { ORDEM_LEVE, type AlimentoLeve } from "@/lib/alimentos/indice";
import { FONTES } from "@/lib/alimentos/fontes";
import ComparadorAlimentos from "@/components/alimentos/ComparadorAlimentos";

/**
 * Comparador de alimentos.
 *
 * Existe como página própria porque a intenção é diferente da busca: quem
 * chega aqui já sabe os dois alimentos e quer decidir entre eles. Canonical
 * para si; a escolha não cria URL, então não há parâmetro para desindexar.
 */
export const metadata: Metadata = {
  title: "Comparar Alimentos: Calorias, Proteína e Macros",
  description:
    "Compare dois alimentos lado a lado — calorias, proteína, carboidratos, gorduras e fibras, na quantidade que você escolher. Dados da TACO. Grátis, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/alimentos/comparar` },
  openGraph: {
    title: "Comparar Alimentos | Montinho",
    description: "Dois alimentos lado a lado, com os macros na quantidade que você escolher.",
    url: `${SITE_URL}/alimentos/comparar`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Tabela Nutricional de Alimentos", item: `${SITE_URL}/alimentos` },
    { "@type": "ListItem", position: 3, name: "Comparar alimentos", item: `${SITE_URL}/alimentos/comparar` },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

/**
 * Pares oferecidos prontos. Curadoria, não combinação automática.
 *
 * Cada um é uma dúvida que alguém tem de verdade na hora de montar o prato —
 * e todos comparam alimentos no MESMO preparo, para que a comparação já
 * comece justa.
 */
const SUGESTOES: [string, string][] = [
  ["frango-peito-sem-pele-grelhado", "carne-bovina-patinho-sem-gordura-grelhado"],
  ["arroz-tipo-1-cozido", "arroz-integral-cozido"],
  ["feijao-carioca-cozido", "lentilha-cozida"],
  ["batata-inglesa-cozida", "batata-doce-cozida"],
  ["ovo-de-galinha-inteiro-cozido-10minutos", "queijo-minas-frescal"],
  ["banana-prata-crua", "maca-fuji-com-casca-crua"],
];

export default function CompararPage() {
  const leves: AlimentoLeve[] = todosAlimentos().map((a) => ({
    s: a.slug,
    n: a.nome,
    c: a.categoria,
    a: a.aliases,
    v: ORDEM_LEVE.map((id) => {
      const n = a.nutrientes.find((x) => x.nutrienteId === id);
      return n && n.estado === "analisado" ? n.valorPor100g : null;
    }),
    u: (() => {
      const n = a.nutrientes.find((x) => x.nutrienteId === "umidade");
      return n && n.estado === "analisado" ? n.valorPor100g : null;
    })(),
    p: a.porcoes.length ? a.porcoes.map((x) => ({ n: x.nome, g: x.gramas })) : undefined,
    i: a.indexavel,
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm">
            <Link href="/alimentos" className={`text-gray-400 ${ln}`}>
              ← Tabela nutricional
            </Link>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5" style={h}>
            Comparar alimentos
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Escolha dois alimentos e veja os dois lado a lado. A comparação começa em 100 g para cada um, e você pode
            mudar as duas quantidades.
          </p>
        </div>
      </section>

      <section className="py-10 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <ComparadorAlimentos alimentos={leves} sugestoes={SUGESTOES} />
        </div>
      </section>

      <section className="py-12 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={h}>
            Como ler uma comparação sem se enganar
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            Comparar por peso parece neutro e não é. Alimento seco concentra mais nutriente no mesmo peso simplesmente
            porque tem menos água — a aveia crua tem quase quatro vezes as calorias do mingau feito com ela, e a
            diferença é a água, não a comida.
          </p>
          <p className="text-gray-300 leading-relaxed mb-3">
            Por isso o comparador avisa quando os dois alimentos têm teor de água muito diferente. Não é para você
            desconfiar do número: é para lembrar que 100 g de um pode ser uma colher e 100 g do outro, um prato.
          </p>
          <p className="text-gray-400 leading-relaxed">
            E nenhum alimento aqui é chamado de melhor ou pior. A tabela mostra o que cada um contém na quantidade que
            você escolheu — o que fazer com essa informação depende do resto do seu dia, não de um ranking.
          </p>
        </div>
      </section>

      <section className="py-12 bg-[#0d0d0d] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-400 leading-relaxed mb-5">
            Dados da {FONTES.TACO.atribuicao}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/alimentos" className="border border-white/25 text-gray-200 px-6 py-3.5 text-[15px] font-medium min-h-[52px] flex items-center hover:border-white/50 transition-colors">
              Buscar um alimento
            </Link>
            <Link href="/alimentos/fontes" className="border border-white/25 text-gray-200 px-6 py-3.5 text-[15px] font-medium min-h-[52px] flex items-center hover:border-white/50 transition-colors">
              Como verificamos os dados
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
