import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/blog";
import { alimentosIndexaveis, getAlimento, nomeNatural, valorPor100g, NOME_CATEGORIA } from "@/lib/alimentos/base";
import { NUTRIENTES, NUTRIENTE_POR_ID, DEFINICAO_BRANCO, DEFINICAO_NA, DEFINICAO_TRACO } from "@/lib/alimentos/nutrientes";
import { AVISO_NAO_SUBSTITUI, AVISO_VARIACAO, FONTES } from "@/lib/alimentos/fontes";
import { formataNumero, formataValor, escalaValor } from "@/lib/alimentos/escala";
import SeletorQuantidade from "@/components/alimentos/SeletorQuantidade";

/**
 * Página de um alimento.
 *
 * Só existe para os alimentos promovidos em lib/alimentos/indexaveis.ts.
 * `dynamicParams: false` faz qualquer outro slug dar 404 em vez de gerar
 * página sob demanda — é o que impede a base de 597 registros virar 597
 * páginas fracas sem ninguém ter decidido isso.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return alimentosIndexaveis().map((a) => ({ slug: a.slug }));
}

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

/** "Feijão, carioca, cozido" → "Feijão carioca cozido" */
const tituloHumano = nomeNatural;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getAlimento(slug);
  if (!a) return {};
  const nome = tituloHumano(a.nome);

  /**
   * A meta NÃO carrega número.
   *
   * Se a base for reimportada e um valor mudar, a descrição no Google
   * continuaria mostrando o antigo por semanas. Descrever o que a página faz
   * envelhece bem; cravar "tem 76 kcal" não.
   */
  return {
    title: `${nome}: Calorias e Proteína`,
    description: `Veja quantas calorias, proteínas, carboidratos, gorduras e fibras existem em 100 g de ${nomeNatural(a.nome).toLowerCase()} — e calcule para a quantidade que você come. Dados da TACO.`,
    alternates: { canonical: `${SITE_URL}/alimentos/${a.slug}` },
    openGraph: {
      title: `${nome} | Montinho`,
      description: `Tabela nutricional completa de ${nomeNatural(a.nome).toLowerCase()}, com a quantidade que você escolher.`,
      url: `${SITE_URL}/alimentos/${a.slug}`,
      type: "website",
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
    },
  };
}

export default async function AlimentoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getAlimento(slug);
  if (!a || !a.indexavel) notFound();

  const nome = tituloHumano(a.nome);
  const kcal = valorPor100g(a, "energia");
  const prot = valorPor100g(a, "proteina");
  const carb = valorPor100g(a, "carboidrato");
  const fibra = valorPor100g(a, "fibra");

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Tabela Nutricional de Alimentos", item: `${SITE_URL}/alimentos` },
      { "@type": "ListItem", position: 3, name: nome, item: `${SITE_URL}/alimentos/${a.slug}` },
    ],
  };

  const principais = NUTRIENTES.filter((n) => n.prioridade === 1);
  const secundarios = NUTRIENTES.filter((n) => n.prioridade === 2);
  const valores = new Map(a.nutrientes.map((v) => [v.nutrienteId, v]));

  /** Relacionados: mesma categoria, nunca aleatório. */
  const relacionados = alimentosIndexaveis()
    .filter((x) => x.categoria === a.categoria && x.slug !== a.slug)
    .slice(0, 5);

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
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#BA9E50" }}>
            {NOME_CATEGORIA[a.categoria]}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5" style={h}>
            {nome}: Calorias, Proteína e Tabela Nutricional
          </h1>

          {/* A resposta direta, antes de qualquer interação. */}
          <p className="text-gray-200 text-lg leading-relaxed">
            Em 100 g de {nomeNatural(a.nome).toLowerCase()} há{" "}
            {kcal !== null ? <strong className="text-white">{formataNumero(kcal, "kcal")} kcal</strong> : "valor não informado"}
            {prot !== null && (
              <>
                {" "}e <strong className="text-white">{formataNumero(prot, "g")} g de proteína</strong>
              </>
            )}
            {carb !== null && <>, {formataNumero(carb, "g")} g de carboidrato</>}
            {fibra !== null && <> e {formataNumero(fibra, "g")} g de fibra</>}
            , segundo a {FONTES.TACO.atribuicao}.
          </p>
        </div>
      </section>

      {/* ── Quantidade + tabela ──────────────────────────────────────── */}
      <section className="py-10 bg-[#0d0d0d]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SeletorQuantidade
            nome={a.nome}
            slug={a.slug}
            principais={principais.map((n) => ({
              id: n.id,
              nome: n.nome,
              unidade: n.unidade,
              valor: valores.get(n.id)?.valorPor100g ?? null,
              estado: valores.get(n.id)?.estado ?? "naoDisponivel",
            }))}
            secundarios={secundarios.map((n) => ({
              id: n.id,
              nome: n.nome,
              unidade: n.unidade,
              valor: valores.get(n.id)?.valorPor100g ?? null,
              estado: valores.get(n.id)?.estado ?? "naoDisponivel",
              nota: n.nota,
            }))}
          />
        </div>
      </section>

      {/* ── Texto de apoio, gerado só do registro ────────────────────── */}
      <section className="py-12 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {prot !== null && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
                Quanto de proteína tem?
              </h2>
              <p className="text-gray-300 leading-relaxed">
                100 g de {nomeNatural(a.nome).toLowerCase()} têm {formataNumero(prot, "g")} g de proteína. Numa porção de 150 g são{" "}
                {formataNumero((prot * 150) / 100, "g")} g; em 200 g, {formataNumero((prot * 200) / 100, "g")} g. Use o
                seletor acima para a quantidade que você come de verdade.
              </p>
            </div>
          )}

          {kcal !== null && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
                Quantas calorias tem?
              </h2>
              <p className="text-gray-300 leading-relaxed">
                São {formataNumero(kcal, "kcal")} kcal por 100 g.{" "}
                {a.preparo !== "pronto para consumo" && (
                  <>
                    Esse valor vale para o alimento <strong className="text-white">{a.preparo}</strong> — e essa
                    diferença importa mais do que parece: o mesmo alimento cru e cozido tem valores distintos, porque
                    cozinhar muda o teor de água.
                  </>
                )}
              </p>
            </div>
          )}

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
              Fonte dos dados
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              {FONTES.TACO.atribuicao}. Registro <span className="text-gray-400">{a.proveniencia.idNaFonte}</span>,
              descrito na fonte como “{a.proveniencia.descricaoOriginal}”.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">{AVISO_VARIACAO}</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">{AVISO_NAO_SUBSTITUI}</p>
            <div className="border border-white/15 p-4 text-sm text-gray-400 leading-relaxed space-y-2">
              <p><strong className="text-gray-200">tr</strong> — {DEFINICAO_TRACO}</p>
              <p><strong className="text-gray-200">n/a</strong> — {DEFINICAO_NA}</p>
              <p><strong className="text-gray-200">—</strong> — {DEFINICAO_BRANCO}</p>
            </div>
          </div>

          {relacionados.length > 0 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-4" style={h}>
                Alimentos relacionados
              </h2>
              <ul className="space-y-2">
                {relacionados.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/alimentos/${r.slug}`} className={`text-gray-300 ${ln}`}>
                      {r.nome}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="border-t border-white/10 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3" style={h}>
              Quanto você precisa por dia?
            </h2>
            <p className="text-gray-300 leading-relaxed mb-5">
              Esta página diz o que tem no alimento. Quanto você precisa é outra conta.
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
        </div>
      </section>
    </>
  );
}
