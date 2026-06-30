import type { Metadata } from "next";
import Link from "next/link";
import { search } from "@/lib/search";
import { blogPosts } from "@/lib/blog";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import SearchBar from "@/components/search/SearchBar";

export const metadata: Metadata = {
  title: "Resultados da pesquisa",
  robots: { index: false, follow: true },
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

// Popular posts shown in empty state — last 4 by date
const popularPosts = [...blogPosts]
  .sort((a, b) => new Date(b.date + "T12:00:00").getTime() - new Date(a.date + "T12:00:00").getTime())
  .slice(0, 4);

export default async function BuscaPage({ searchParams }: Props) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query.length >= 2 ? search(query, 30) : [];

  return (
    <main className="min-h-screen bg-black">
      {/* Search hero */}
      <section className="py-16 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-4">
            Pesquisa
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-8"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {query
              ? <>Resultados para <span className="text-gray-400">&ldquo;{query}&rdquo;</span></>
              : "O que você está procurando?"}
          </h1>

          <SearchBar autoFocus={!query} />

          {query && results.length > 0 && (
            <p className="mt-4 text-gray-500 text-sm">
              {results.length} {results.length === 1 ? "resultado encontrado" : "resultados encontrados"}
            </p>
          )}
        </div>
      </section>

      {/* Results or empty state */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {query && results.length === 0 ? (
            <EmptyState query={query} />
          ) : query && results.length > 0 ? (
            <ResultsList results={results} query={query} />
          ) : (
            <EmptyState query="" />
          )}
        </div>
      </section>
    </main>
  );
}

function ResultsList({
  results,
  query,
}: {
  results: ReturnType<typeof search>;
  query: string;
}) {
  return (
    <div className="flex flex-col gap-6">
      {results.map((r) => (
        <article
          key={r.slug}
          className="border border-white/10 hover:border-white/30 transition-colors duration-300 group"
        >
          <Link href={`/blog/${r.slug}`} className="block p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 border border-white/10 px-2 py-1">
                {r.category}
              </span>
              <span className="text-gray-600 text-xs">{r.readTime} de leitura</span>
              <span className="text-gray-600 text-xs">
                {new Date(r.date + "T12:00:00").toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <h2
              className="text-white text-xl font-bold leading-snug mb-3 group-hover:text-gray-200 transition-colors duration-200"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              <HighlightText text={r.title} query={query} />
            </h2>

            <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
              <HighlightText text={r.excerpt} query={query} />
            </p>

            <span className="inline-flex items-center gap-2 text-white text-sm font-medium group-hover:gap-3 transition-all duration-200">
              Ler artigo
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="group-hover:translate-x-1 transition-transform duration-200"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </article>
      ))}
    </div>
  );
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const regex = new RegExp(
    `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-white/15 text-white not-italic px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div>
      {query && (
        <div className="mb-10 p-6 border border-white/10 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            className="mx-auto text-gray-700 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <p className="text-white font-semibold mb-1">
            Nenhum resultado para &ldquo;{query}&rdquo;
          </p>
          <p className="text-gray-500 text-sm">
            Tente palavras diferentes ou mais curtas, ou navegue pelos artigos abaixo.
          </p>
        </div>
      )}

      {/* Popular posts */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-6">
          Artigos populares
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {popularPosts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="border border-white/10 hover:border-white/30 p-5 transition-colors duration-300 group"
            >
              <span className="text-xs font-semibold tracking-[0.1em] uppercase text-gray-500 border border-white/10 px-2 py-1">
                {p.category}
              </span>
              <h3
                className="text-white text-base font-bold leading-snug mt-3 group-hover:text-gray-200 transition-colors duration-200"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {p.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* Service links */}
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-gray-500 mb-6">
          Páginas de serviço
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { href: "/consultoria", label: "Consultoria" },
            { href: "/resultados", label: "Resultados" },
            { href: "/faq", label: "FAQ" },
            { href: "/blog", label: "Blog completo" },
            { href: "/contato", label: "Contato" },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-gray-300 hover:text-white border border-white/15 hover:border-white/40 px-4 py-2 transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* WhatsApp CTA */}
      <div className="border border-white/10 p-6 sm:p-8 text-center">
        <p className="text-white font-semibold mb-2">Não encontrou o que buscava?</p>
        <p className="text-gray-400 text-sm mb-6">
          Fale diretamente com o Montinho e tire todas as suas dúvidas sobre treino e acompanhamento.
        </p>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="16"
            height="16"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
