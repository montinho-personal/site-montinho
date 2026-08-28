import Link from "next/link";
import { TRILHAS, encontraPasso } from "@/lib/ferramentas/trilha";

/**
 * A faixa de trilha que aparece em toda ferramenta do caminho.
 *
 * Componente de servidor, zero JavaScript: são links e texto. A pessoa vê
 * onde está (passo dourado), de onde veio e para onde vai — e o passo
 * seguinte carrega a pergunta que ele responde, porque "Cardápio →" diz
 * menos que "O que boto no prato?".
 *
 * Ela é deliberadamente discreta: uma linha de chips, não um banner. A
 * ferramenta é a protagonista da página; a trilha é a placa de rua.
 */
export default function Trilha({ atual }: { atual: string }) {
  const pos = encontraPasso(atual);
  if (!pos) return null;
  const { titulo, passos } = TRILHAS[pos.trilha];
  const proximo = passos[pos.indice + 1];

  return (
    <nav aria-label={titulo} className="border-b border-white/10 bg-black print:hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p className="text-xs text-gray-500 mb-2.5">
          <Link href={`/comece/${pos.trilha}`} className="hover:text-gray-300 underline underline-offset-2 decoration-white/20 transition-colors">
            {titulo}
          </Link>{" "}
          · passo {pos.indice + 1} de {passos.length}
        </p>
        <ol className="flex flex-wrap items-center gap-y-2">
          {passos.map((p, i) => (
            <li key={p.href} className="flex items-center">
              {i > 0 && (
                <span className="text-gray-600 mx-2" aria-hidden="true">
                  →
                </span>
              )}
              {i === pos.indice ? (
                <span
                  aria-current="step"
                  className="text-sm font-semibold px-3 py-1.5 border border-[#BA9E50] text-white bg-[#BA9E50]/10 whitespace-nowrap"
                >
                  {i + 1}. {p.nome}
                </span>
              ) : (
                <Link
                  href={p.href}
                  className="text-sm text-gray-400 hover:text-white px-3 py-1.5 border border-white/15 hover:border-white/40 transition-colors whitespace-nowrap"
                >
                  {i + 1}. {p.nome}
                </Link>
              )}
            </li>
          ))}
        </ol>
        {proximo && (
          <p className="text-xs text-gray-500 mt-2.5">
            Próximo passo:{" "}
            <Link href={proximo.href} className="text-gray-300 hover:text-white underline underline-offset-2 decoration-1">
              {proximo.pergunta}
            </Link>
          </p>
        )}
      </div>
    </nav>
  );
}
