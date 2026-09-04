import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import IndiceRegiao from "@/components/regiao/IndiceRegiao";
import { ONDE_ATENDO } from "@/lib/regiao";

/**
 * Onde o Montinho atende.
 *
 * Página NAVEGACIONAL, e essa escolha é o ponto todo dela.
 *
 * A tentação óbvia era mirar "personal trainer alphaville" e ganhar mais uma
 * porta de entrada. Seria um erro conhecido: /personal-trainer-alphaville já
 * disputa esse termo com 18 páginas internas e está na posição 32. A décima
 * nona não ajuda nenhuma das outras — divide de novo o mesmo bolo.
 *
 * O trabalho desta página é outro: dar link contextual às 44 páginas de lugar
 * que nenhum artigo do site linkava. Elas existiam, o Google chegava nelas
 * pelo índice do blog, e era só isso — um link dividido por 839 não passa
 * relevância nenhuma.
 *
 * Por isso o título é uma pergunta de navegação ("onde atende?"), não uma
 * consulta comercial, e por isso ela entra no rodapé: link de rodapé é
 * sitewide, e é assim que ela mesma não nasce órfã.
 */
export const metadata: Metadata = {
  title: "Onde Eu Atendo: Condomínios, Cidades e Empresas",
  description:
    "Os condomínios de Alphaville e Tamboré onde atendo presencialmente, as cidades atendidas por consultoria online e como funciona o treino dentro do condomínio.",
  alternates: { canonical: `${SITE_URL}/onde-atendo` },
  openGraph: {
    title: "Onde Eu Atendo | Montinho Personal Trainer",
    description:
      "Condomínios de Alphaville e Tamboré no presencial, e o Brasil inteiro no online. Veja se a sua região está na lista.",
    url: `${SITE_URL}/onde-atendo`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln =
  "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function OndeAtendoPage() {
  const total = ONDE_ATENDO.reduce((n, g) => n + g.slugs.length, 0);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Onde eu atendo", item: `${SITE_URL}/onde-atendo` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="pt-16 pb-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6"
            style={h}
          >
            Onde eu atendo
          </h1>
          <p className="text-gray-300 leading-relaxed mb-3">
            O presencial acontece em <strong className="text-white">Alphaville, Tamboré
            e região</strong> — quase sempre na academia do próprio condomínio, com o
            equipamento que existe lá dentro. A consultoria online funciona em
            qualquer cidade do Brasil, com o mesmo acompanhamento semanal.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Abaixo estão as {total} páginas que já escrevi sobre lugares
            específicos. Se a sua não estiver aqui, isso não quer dizer que eu não
            atendo —{" "}
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold italic underline underline-offset-2 decoration-1 transition-opacity duration-200 hover:opacity-70"
              style={{ color: "#BA9E50" }}
            >
              me pergunta
            </a>
            .
          </p>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <IndiceRegiao grupos={ONDE_ATENDO} />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-4" style={h}>
            Não achou a sua região?
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            A lista acima é do que já virou texto, não do que eu atendo. Fora do
            raio de Alphaville, a resposta costuma ser a{" "}
            <Link href="/consultoria" className={ln}>
              consultoria online
            </Link>
            , que tem o mesmo acompanhamento e não depende de distância.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Se você ainda não sabe qual formato faz sentido para a sua rotina, o{" "}
            <Link href="/diagnostico" className={ln}>
              Diagnóstico Montinho
            </Link>{" "}
            responde isso em um ou dois minutos, de graça.
          </p>
        </div>
      </section>
    </>
  );
}
