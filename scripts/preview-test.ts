/**
 * Testes do preview de compartilhamento.
 *
 * O bug que originou este arquivo: sem `app/not-found.tsx`, o 404 herdava os
 * metadados do layout raiz. Um link quebrado colado no WhatsApp gerava um card
 * idêntico ao da home — título "Personal Trainer Alphaville", descrição da home
 * e a logo. Quem compartilhava via um preview bonito e não tinha como saber que
 * o link estava morto.
 *
 * O que se protege aqui: toda página que alguém compartilha precisa ter um
 * preview que fale dela mesma. Preview errado não quebra o build, não aparece
 * em teste de tela e só é descoberto quando já foi enviado para alguém.
 */

import type { Metadata } from "next";
import { blogPosts, SITE_URL, getPostCoverImage } from "../lib/blog";
import { metadata as metaHome } from "../app/page";
import { metadata as meta404 } from "../app/not-found";
import { metadata as metaFerramentas } from "../app/ferramentas/page";
import { metadata as metaGuia } from "../app/academias-alphaville/page";
import { metadata as metaQuiz } from "../app/academia-ideal-alphaville/page";
import { metadata as metaContato } from "../app/contato/page";
import { metadata as metaLgpd } from "../app/lgpd/page";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

/**
 * Texto efetivo do preview.
 *
 * Cuidado que custou caro: a versão anterior desta função caía em `m.title`
 * quando `openGraph` não existia — e openGraph ausente É o bug. O teste
 * passava exatamente no caso que existia para pegar, porque comparava o
 * título da aba, que estava certo, em vez das tags og:*, que estavam herdadas
 * da home. Agora só o que o leitor de link realmente lê conta.
 */
function preview(m: Metadata): { titulo: string; descricao: string; url: string } {
  const og = m.openGraph as { title?: string; description?: string; url?: string } | undefined;
  return {
    titulo: String(og?.title ?? ""),
    descricao: String(og?.description ?? ""),
    url: String(og?.url ?? ""),
  };
}

console.log("\n" + "=".repeat(60) + "\nO 404 NÃO PODE SE PASSAR PELA HOME\n" + "=".repeat(60));

const home = preview(metaHome);
const erro = preview(meta404);

ok("o 404 tem título próprio", erro.titulo.length > 0 && erro.titulo !== home.titulo, `404: "${erro.titulo}"`);
ok("o 404 tem descrição própria", erro.descricao.length > 0 && erro.descricao !== home.descricao);
ok(
  "o título do 404 avisa que é erro",
  /não encontrad|404|não existe/i.test(erro.titulo),
  `título atual: "${erro.titulo}" — quem compartilha precisa ver que o link morreu`
);
ok(
  "o 404 declara twitter próprio",
  !!meta404.twitter,
  "sem isso as tags twitter:* do layout raiz sobrevivem e o preview volta a ser o da home"
);
ok("o 404 é noindex", (meta404.robots as { index?: boolean } | undefined)?.index === false);

console.log("\n" + "=".repeat(60) + "\nCADA PÁGINA FALA DE SI MESMA\n" + "=".repeat(60));

const paginas: [string, Metadata][] = [
  ["/ferramentas", metaFerramentas],
  ["/academias-alphaville", metaGuia],
  ["/academia-ideal-alphaville", metaQuiz],
  ["/contato", metaContato],
  ["/lgpd", metaLgpd],
];

for (const [nome, m] of paginas) {
  const p = preview(m);
  // A checagem que importa: sem bloco próprio, as tags og:* da home passam
  // inteiras — incluindo o og:url, que aponta o card para a raiz do site.
  ok(`${nome}: declara openGraph próprio`, !!m.openGraph, "sem isso o card mostra a home");
  ok(`${nome}: título diferente do da home`, !!p.titulo && p.titulo !== home.titulo, `atual: "${p.titulo}"`);
  ok(`${nome}: descrição diferente da home`, !!p.descricao && p.descricao !== home.descricao);
  ok(`${nome}: og:url aponta para a própria página`, p.url.endsWith(nome), `atual: "${p.url}"`);
  ok(`${nome}: tem canonical`, !!(m.alternates as { canonical?: string } | undefined)?.canonical);
}

console.log("\n" + "=".repeat(60) + "\nOS ARTIGOS\n" + "=".repeat(60));

/**
 * A imagem do preview não pode ser SVG: nenhum leitor de link renderiza SVG
 * em card. Quando o artigo só tem infográfico, o fallback tem de ser raster.
 */
const svgs = blogPosts.filter((p) => getPostCoverImage(p).url.toLowerCase().endsWith(".svg"));
ok("nenhum artigo usa SVG como imagem de preview", svgs.length === 0, svgs.slice(0, 5).map((p) => p.slug).join(", "));

const foraDoDominio = blogPosts.filter((p) => !getPostCoverImage(p).url.startsWith(SITE_URL));
ok("toda imagem de preview é URL absoluta do site", foraDoDominio.length === 0, foraDoDominio.slice(0, 5).map((p) => p.slug).join(", "));

const semTitulo = blogPosts.filter((p) => !p.title?.trim());
ok("todo artigo tem título", semTitulo.length === 0, semTitulo.map((p) => p.slug).join(", "));

/**
 * A descrição efetiva é a mesma que `app/blog/[slug]/page.tsx` usa. Testar o
 * excerpt sozinho daria falso alarme em artigo que tem metaDescription.
 */
const descricaoDe = (p: (typeof blogPosts)[number]) => (p.metaDescription || p.excerpt || "").trim();

const semDescricao = blogPosts.filter((p) => !descricaoDe(p));
ok(
  "todo artigo tem descrição para o card",
  semDescricao.length === 0,
  semDescricao.slice(0, 8).map((p) => p.slug).join(", ")
);

/**
 * Truncagem não quebra nada — o card fica feio, não errado. Por isso o número
 * é relatado, e só vira falha se piorar muito. Transformar 181 artigos em
 * erro vermelho faria o teste ser ignorado, que é o pior destino de um teste.
 */
const LIMITE_TRUNCAGEM = 200;
const longos = blogPosts.filter((p) => descricaoDe(p).length > LIMITE_TRUNCAGEM);
console.log(`  nota    ${longos.length} de ${blogPosts.length} descrições passam de ${LIMITE_TRUNCAGEM} caracteres e serão cortadas no card`);
ok(
  "a truncagem não se espalhou para a maioria dos artigos",
  longos.length < blogPosts.length / 2,
  `${longos.length} de ${blogPosts.length}`
);

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
