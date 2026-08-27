import Link from "next/link";
import { pickFilosofia } from "@/lib/filosofia";

/**
 * Nota de método ao pé de um conteúdo de treino.
 *
 * Server component puro: nenhum JavaScript vai para o navegador. É uma nota
 * editorial, não um CTA — por isso não tem botão, não tem caixa com destaque
 * e não compete com o bloco de próxima ação que vem depois. O único elemento
 * clicável é o link do acompanhamento dentro da frase.
 */
export default function NotaMetodo({
  chave,
  cluster,
  href = "/consultoria",
  rotulo = "acompanhamento personalizado",
}: {
  /** Slug ou identificador da página — decide qual variante aparece. */
  chave: string;
  /** Cluster do conteúdo — algumas variantes não cabem em dor ou saúde. */
  cluster?: string;
  href?: string;
  rotulo?: string;
}) {
  const f = pickFilosofia(chave, cluster);
  const [antes, depois = ""] = f.texto.split("{link}");

  return (
    <aside
      aria-label="Nota do Montinho sobre método"
      className="mt-14 border-l-2 pl-5 sm:pl-6"
      style={{ borderColor: "#BA9E50" }}
    >
      <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>
        {f.titulo}
      </p>
      <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
        {antes}
        <Link
          href={href}
          className="text-white underline underline-offset-4 decoration-1 decoration-white/40 hover:decoration-white transition-colors"
        >
          {rotulo}
        </Link>
        {depois}
      </p>
    </aside>
  );
}
