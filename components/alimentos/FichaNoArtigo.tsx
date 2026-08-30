import Link from "next/link";
import { getAlimento, nomeNatural, valorPor100g } from "@/lib/alimentos/base";
import { FICHAS_POR_ARTIGO } from "@/lib/alimentos/artigos";
import { NUTRIENTE_POR_ID } from "@/lib/alimentos/nutrientes";
import { formataNumero } from "@/lib/alimentos/escala";
import { FONTES } from "@/lib/alimentos/fontes";

/**
 * A ficha do alimento no fim do artigo.
 *
 * Componente de servidor, sem JavaScript no cliente: são números fixos e um
 * link. Uma ferramenta interativa aqui atrapalharia a leitura e disputaria
 * espaço com a calculadora que muitos desses artigos já têm.
 *
 * Nenhum valor vive neste arquivo nem no registro. Os números são lidos da
 * base na hora de gerar a página — é o que impede um artigo de afirmar 32 g
 * de proteína enquanto /alimentos afirma outra coisa. Se a base for
 * reimportada, o artigo acompanha sozinho.
 *
 * Alimento sem o nutriente em destaque é OMITIDO em vez de aparecer com
 * travessão: numa ficha de três linhas, um traço no meio parece defeito da
 * página, não recusa honesta da fonte. A recusa honesta continua existindo,
 * na página do alimento, onde há espaço para explicá-la.
 */
export default function FichaNoArtigo({ slug }: { slug: string }) {
  const ficha = FICHAS_POR_ARTIGO[slug];
  if (!ficha) return null;

  const nutriente = NUTRIENTE_POR_ID.get(ficha.destaque);
  if (!nutriente) return null;

  const linhas = ficha.alimentos
    .map((s) => {
      const a = getAlimento(s);
      if (!a) return null;
      const destaque = valorPor100g(a, ficha.destaque);
      const kcal = valorPor100g(a, "energia");
      if (destaque === null) return null;
      return { a, destaque, kcal };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  if (linhas.length === 0) return null;

  const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

  return (
    <aside className="my-10 border border-white/15 bg-[#0d0d0d] p-5 sm:p-6" aria-labelledby={`ficha-${slug}`}>
      <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        Na tabela nutricional
      </p>
      <h2 id={`ficha-${slug}`} className="text-white font-bold text-xl mb-4" style={h}>
        {nutriente.nome} por 100 g
      </h2>

      <ul className="divide-y divide-white/10 border-y border-white/10">
        {linhas.map(({ a, destaque, kcal }) => (
          <li key={a.slug} className="flex items-baseline justify-between gap-3 py-3">
            <span className="text-gray-300">
              {a.indexavel ? (
                <Link
                  href={`/alimentos/${a.slug}`}
                  className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors"
                >
                  {nomeNatural(a.nome)}
                </Link>
              ) : (
                nomeNatural(a.nome)
              )}
              {kcal !== null && (
                <span className="block text-gray-500 text-sm mt-0.5">{formataNumero(kcal, "kcal")} kcal</span>
              )}
            </span>
            <span className="text-white text-lg font-bold tabular-nums whitespace-nowrap">
              {formataNumero(destaque, nutriente.unidade)} {nutriente.unidade}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-gray-500 text-sm mt-4 leading-relaxed">
        Fonte: {FONTES.TACO.atribuicao}.{" "}
        <Link
          href="/alimentos"
          className="underline underline-offset-4 decoration-1 decoration-white/30 hover:text-gray-300 transition-colors"
        >
          Pesquisar outro alimento →
        </Link>
      </p>
    </aside>
  );
}
