import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { alimentosIndexaveis, todosAlimentos, NOME_CATEGORIA } from "@/lib/alimentos/base";
import { ORDEM_LEVE, type AlimentoLeve } from "@/lib/alimentos/indice";
import { AVISO_NAO_SUBSTITUI, AVISO_VARIACAO, FONTES } from "@/lib/alimentos/fontes";
import BuscaAlimentos from "@/components/alimentos/BuscaAlimentos";
import Descoberta from "@/components/alimentos/Descoberta";

/**
 * A central do buscador nutricional.
 *
 * Canonical para ela mesma. A busca é feita no aparelho, então nenhuma
 * consulta cria URL — não existe /alimentos?q=feijao gerando página, e por
 * isso não há o que desindexar depois.
 */
export const metadata: Metadata = {
  title: "Tabela Nutricional de Alimentos: Calorias e Macros",
  description:
    "Pesquise alimentos e descubra calorias, proteínas, carboidratos, gorduras, fibras e outros nutrientes por 100 g ou na quantidade que você escolher. Dados da TACO. Grátis, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/alimentos` },
  openGraph: {
    title: "Tabela Nutricional de Alimentos | Montinho",
    description:
      "Busque um alimento e veja calorias, proteína, carboidratos, gorduras e fibras na quantidade que quiser. Dados da Tabela Brasileira de Composição de Alimentos.",
    url: `${SITE_URL}/alimentos`,
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
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

/**
 * "Alimentos populares", e não "mais pesquisados".
 *
 * A diferença não é de estilo. "Mais pesquisados" seria uma afirmação sobre
 * dados que ainda não temos; "populares" é curadoria assumida. Quando o
 * Search Console tiver volume de verdade, a lista muda — e o rótulo também
 * pode mudar, aí com lastro.
 */
const POPULARES = [
  "feijao-carioca-cozido",
  "arroz-tipo-1-cozido",
  "frango-peito-sem-pele-grelhado",
  "ovo-de-galinha-inteiro-cozido-10minutos",
  "banana-prata-crua",
  "aveia-flocos-crua",
  "batata-doce-cozida",
  "queijo-minas-frescal",
];

export default function AlimentosPage() {
  const todos = todosAlimentos();
  const indexaveis = alimentosIndexaveis();

  /* O índice leve — só o que a busca precisa. O JSON grande fica no build. */
  const leves: AlimentoLeve[] = todos.map((a) => ({
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

  const porCategoria = new Map<string, typeof indexaveis>();
  for (const a of indexaveis) {
    const lista = porCategoria.get(a.categoria) ?? [];
    lista.push(a);
    porCategoria.set(a.categoria, lista);
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Grátis · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Tabela Nutricional de Alimentos
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Pesquise um alimento e veja calorias, proteínas, carboidratos, gorduras, fibras e outros nutrientes por
            100 g ou na quantidade que você escolher.
          </p>
        </div>
      </section>

      <section className="py-10 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <BuscaAlimentos alimentos={leves} populares={POPULARES} placement="pagina-alimentos" />

          <p className="mt-5">
            <Link href="/alimentos/comparar" className={`text-gray-300 ${ln}`}>
              Comparar dois alimentos lado a lado →
            </Link>
          </p>

          <p className="text-gray-500 text-sm mt-4 leading-relaxed">
            {todos.length} alimentos da {FONTES.TACO.atribuicao}. A busca acontece no seu aparelho — nada do que você
            digita é enviado para lugar nenhum.
          </p>
        </div>
      </section>

      {/*
          Descoberta vem DEPOIS da busca, e a ordem não é acidental: quem
          chega com um alimento na cabeça resolve na primeira tela e nem
          precisa rolar. Quem não sabe o que procurar encontra aqui.
      */}
      <section className="py-10 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Descoberta alimentos={leves} />
        </div>
      </section>

      {/* ── Alimentos com página própria ─────────────────────────────── */}
      <section className="py-14 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3" style={h}>
            Alimentos com tabela completa
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Todos os {todos.length} alimentos aparecem na busca acima. Estes {indexaveis.length} têm página própria,
            com os 26 nutrientes, a origem de cada número e a conta para a quantidade que você quiser.
          </p>

          <div className="space-y-8">
            {[...porCategoria.entries()].map(([cat, lista]) => (
              <div key={cat}>
                <h3 className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#BA9E50" }}>
                  {NOME_CATEGORIA[cat as keyof typeof NOME_CATEGORIA]}
                </h3>
                <ul className="space-y-1.5">
                  {lista.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/alimentos/${a.slug}`} className={`text-gray-300 ${ln}`}>
                        {a.nome}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Confiança ────────────────────────────────────────────────── */}
      <section className="py-14 bg-[#0d0d0d] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5" style={h}>
            De onde vêm estes números
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            Os dados são da <strong className="text-white">{FONTES.TACO.nomeCompleto}</strong>, produzida pelo{" "}
            {FONTES.TACO.instituicao}. A publicação permite a reprodução desde que a fonte seja citada — por isso ela
            aparece em toda página de alimento, e não escondida num rodapé.
          </p>
          <p className="text-gray-400 leading-relaxed mb-3">{AVISO_VARIACAO}</p>
          <p className="text-gray-400 leading-relaxed mb-6">{AVISO_NAO_SUBSTITUI}</p>
          <Link href="/alimentos/fontes" className={`text-gray-300 ${ln}`}>
            Como verificamos os dados →
          </Link>
        </div>
      </section>

      {/* ── Ferramentas irmãs ────────────────────────────────────────── */}
      <section className="py-14 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5" style={h}>
            Já sabe quanto precisa comer?
          </h2>
          <p className="text-gray-300 leading-relaxed mb-6">
            Esta tabela responde o que TEM no alimento. Quanto você precisa por dia é outra conta — e ela tem
            calculadora própria.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/ferramentas/calculadora-de-proteina"
              className="border border-white/25 text-gray-200 px-6 py-3.5 text-[15px] font-medium min-h-[52px] flex items-center hover:border-white/50 transition-colors"
            >
              Calculadora de proteína
            </Link>
            <Link
              href="/ferramentas/calculadora-macros"
              className="border border-white/25 text-gray-200 px-6 py-3.5 text-[15px] font-medium min-h-[52px] flex items-center hover:border-white/50 transition-colors"
            >
              Calculadora de macros
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
