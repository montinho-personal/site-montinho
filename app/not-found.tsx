import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, blogPosts } from "@/lib/blog";

/**
 * Página 404.
 *
 * Existia um problema silencioso antes desta página: sem `not-found` próprio,
 * o Next servia o 404 herdando os metadados do layout raiz. Resultado — um
 * link quebrado, colado no WhatsApp, gerava um preview idêntico ao da home:
 * título "Personal Trainer Alphaville", descrição da home e a logo. Quem
 * compartilhava via um card bonito e não tinha como saber que o link estava
 * morto; quem recebia clicava e caía no vazio.
 *
 * Agora o 404 diz o que é. O preview de um link quebrado passa a mostrar
 * "Página não encontrada", que é feio de propósito: é assim que o erro fica
 * visível antes de a mensagem ser enviada.
 *
 * `noindex` porque página de erro não pertence ao índice do Google; `follow`
 * para que os links daqui continuem passando o rastreador adiante.
 */
export const metadata: Metadata = {
  title: "Página não encontrada",
  description:
    "Esse endereço não existe ou mudou. Use a busca ou volte para o blog para encontrar o que procurava.",
  // Precisa ser explícito: sem isto, o `index, follow` do layout raiz vence e
  // a página passa a mandar sinais contraditórios (o Next emite o próprio
  // `noindex` do 404 em paralelo). Duas tags dizendo noindex é seguro; uma
  // dizendo noindex e outra dizendo index não é.
  robots: { index: false, follow: true },
  openGraph: {
    title: "Página não encontrada | Montinho Personal Trainer",
    description: "Esse endereço não existe ou mudou de lugar.",
    url: `${SITE_URL}/404`,
    type: "website",
  },
  // Precisa ser declarado à parte: sem isso, as tags twitter:* do layout raiz
  // sobrevivem, e o preview volta a mostrar o texto da home — que era
  // exatamente o problema que esta página resolve.
  twitter: {
    card: "summary",
    title: "Página não encontrada | Montinho Personal Trainer",
    description: "Esse endereço não existe ou mudou de lugar.",
  },
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln =
  "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function NotFound() {
  return (
    <section className="py-20 sm:py-28 bg-black min-h-[60vh] flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase mb-5"
          style={{ color: "#BA9E50" }}
        >
          Erro 404
        </p>

        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
          style={h}
        >
          Essa página não existe
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed mb-3">
          O endereço pode ter mudado, ou o link veio com algum caractere a mais.
          Acontece.
        </p>
        <p className="text-gray-400 leading-relaxed mb-10">
          O conteúdo continua aqui — são {blogPosts.length} artigos publicados.
          É só encontrar o certo.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link
            href="/busca"
            className="inline-flex items-center justify-center bg-white text-black px-7 py-3.5 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[52px]"
          >
            Buscar no site
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center border border-white/30 text-white px-7 py-3.5 text-sm font-medium tracking-wide hover:bg-white hover:text-black transition-colors min-h-[52px]"
          >
            Ver o blog
          </Link>
        </div>

        <p className="text-gray-400 text-sm leading-relaxed">
          Ou vá direto para as{" "}
          <Link href="/ferramentas" className={ln}>
            ferramentas gratuitas
          </Link>
          , para o{" "}
          <Link href="/pergunte-ao-montinho" className={ln}>
            Pergunte ao Montinho
          </Link>{" "}
          ou para a{" "}
          <Link href="/" className={ln}>
            página inicial
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
