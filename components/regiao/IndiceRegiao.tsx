import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import type { GrupoRegiao } from "@/lib/regiao";

/**
 * A lista de links de um índice de região.
 *
 * Componente de servidor, zero JavaScript: é navegação, e navegação não
 * precisa hidratar.
 *
 * O TEXTO DE CADA ITEM VEM DO PRÓPRIO ARTIGO
 *
 * Título e excerpt saem de lib/blog.ts, escritos junto com o artigo. Nada
 * aqui é gerado nem resumido: se o excerpt mudar lá, muda aqui, e um índice
 * que descreve o artigo com palavras que o artigo não usa é pior do que um
 * índice só de títulos.
 *
 * Dois artigos antigos não têm excerpt, e aí vale a metaDescription — que é
 * texto autoral também, escrito para descrever aquele artigo no Google. O
 * que não pode é o card sair com um buraco no meio.
 */

export default function IndiceRegiao({ grupos }: { grupos: GrupoRegiao[] }) {
  const porSlug = new Map(blogPosts.map((p) => [p.slug, p]));

  return (
    <div className="flex flex-col gap-12">
      {grupos.map((grupo) => (
        <section key={grupo.titulo}>
          <h3
            className="text-xl font-bold text-white mb-1"
            style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
          >
            {grupo.titulo}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">{grupo.descricao}</p>

          <ul className="grid gap-3 sm:grid-cols-2">
            {grupo.slugs.map((slug) => {
              const post = porSlug.get(slug);
              /*
               * Slug sem artigo não deveria existir — regiao-test.ts reprova
               * antes de chegar aqui. Mas renderizar nada é melhor do que
               * publicar um link quebrado se alguém despublicar um artigo.
               */
              if (!post) return null;
              const resumo = (post.excerpt ?? "").trim() || (post.metaDescription ?? "").trim();
              return (
                <li key={slug}>
                  <Link
                    href={`/blog/${slug}`}
                    className="group block h-full rounded-xl border border-white/12 bg-white/[0.02] px-5 py-4 transition-colors hover:border-[#BA9E50]/40 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#BA9E50]"
                  >
                    <span className="block text-[15px] font-semibold leading-snug text-white group-hover:text-[#BA9E50] transition-colors">
                      {post.title}
                    </span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-gray-400">
                      {resumo}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
