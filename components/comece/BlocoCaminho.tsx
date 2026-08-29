import Link from "next/link";
import { CAMINHO_POR_ARTIGO, HREFS, ROTULOS, TEXTOS, TITULOS } from "@/lib/ferramentas/comece-artigos";

/**
 * O bloco de caminho no fim do artigo.
 *
 * Componente de servidor, zero JavaScript. Renderiza nada quando o artigo
 * não está no registro — a decisão de onde aparecer é editorial e mora em
 * lib/ferramentas/comece-artigos.ts, não espalhada no template.
 */
export default function BlocoCaminho({ slug }: { slug: string }) {
  const caminho = CAMINHO_POR_ARTIGO[slug];
  if (!caminho) return null;

  return (
    <aside className="border border-[#BA9E50]/50 bg-[#BA9E50]/[0.06] p-6 my-10 print:hidden">
      <p
        className="text-xs font-semibold tracking-[0.2em] uppercase mb-2"
        style={{ color: "#BA9E50", fontFamily: "var(--font-inter), sans-serif" }}
      >
        Próximo passo
      </p>
      <p
        className="text-white font-bold text-xl mb-2"
        style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
      >
        {TITULOS[caminho]}
      </p>
      <p className="text-gray-300 leading-relaxed mb-4">{TEXTOS[caminho]}</p>
      <Link
        href={HREFS[caminho]}
        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-sm font-semibold min-h-[48px] hover:opacity-90 transition-opacity"
      >
        {ROTULOS[caminho]}
        <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
