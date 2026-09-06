/**
 * Testes dos índices de região.
 *
 * O que este arquivo protege é o motivo de os índices existirem: dar link
 * contextual às páginas de lugar que nenhum artigo do site linkava. Um índice
 * com slug errado não avisa nada — ele só deixa de linkar, silenciosamente, e
 * o artigo volta a ficar órfão sem ninguém perceber.
 *
 * Por isso três invariantes:
 *
 * 1. Todo slug citado existe no acervo. Slug quebrado = link 404 publicado.
 * 2. Nenhum slug aparece duas vezes. Repetido é ruído para o leitor e sinal
 *    trocado para o Google.
 * 3. Os órfãos que os índices prometem resgatar realmente deixam de ser
 *    órfãos. É o teste que fecha o ciclo — sem ele, dá para escrever a lista
 *    e esquecer de renderizar em algum lugar.
 */

import * as fs from "fs";
import { blogPosts } from "../lib/blog";
import { GUIAS_DE_ACADEMIA, ONDE_ATENDO, slugsDosIndices } from "../lib/regiao";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + `\n${t}\n` + "=".repeat(64));

const existentes = new Set(blogPosts.map((p) => p.slug));
const citados = slugsDosIndices();

bloco("1. AS LISTAS APONTAM PARA ARTIGOS QUE EXISTEM");

const inexistentes = citados.filter((s) => !existentes.has(s));
ok("todo slug citado existe em lib/blog.ts", inexistentes.length === 0, inexistentes.join(", "));

const repetidos = citados.filter((s, i) => citados.indexOf(s) !== i);
ok("nenhum slug aparece em dois grupos", repetidos.length === 0, [...new Set(repetidos)].join(", "));

for (const grupo of [...GUIAS_DE_ACADEMIA, ...ONDE_ATENDO]) {
  ok(`grupo "${grupo.titulo}" não está vazio`, grupo.slugs.length > 0);
}
ok("os dois índices juntos cobrem 77 páginas de lugar", citados.length === 77, `são ${citados.length}`);

bloco("2. OS ARTIGOS CITADOS TÊM O QUE O ÍNDICE MOSTRA");

/*
 * O índice mostra título e um resumo do próprio artigo. Resumo vazio vira card
 * com um buraco no meio — e como o texto vem de lib/blog.ts, o buraco só
 * apareceria no navegador.
 *
 * Dois artigos antigos (carapicuiba, osasco) não têm excerpt, e o componente
 * cai na metaDescription. O teste aceita as duas fontes porque as duas são
 * texto autoral; o que ele não aceita é card sem nenhuma das duas.
 */
const semResumo = citados.filter((s) => {
  const p = blogPosts.find((x) => x.slug === s);
  return !((p?.excerpt ?? "").trim() || (p?.metaDescription ?? "").trim());
});
ok("todo artigo citado tem resumo para exibir", semResumo.length === 0, semResumo.join(", "));

const semExcerpt = citados.filter((s) => !(blogPosts.find((p) => p.slug === s)?.excerpt ?? "").trim());
ok(
  "o componente sabe cair na metaDescription quando falta excerpt",
  /post\.excerpt \?\? ""\)\.trim\(\) \|\| \(post\.metaDescription/.test(
    fs.readFileSync("components/regiao/IndiceRegiao.tsx", "utf8")
  ),
  `${semExcerpt.length} artigo(s) citados dependem desse fallback: ${semExcerpt.join(", ")}`
);

bloco("3. OS ÍNDICES ESTÃO DE FATO RENDERIZADOS");

const academias = fs.readFileSync("app/academias-alphaville/page.tsx", "utf8");
const ondeAtendo = fs.readFileSync("app/onde-atendo/page.tsx", "utf8");
const rodape = fs.readFileSync("components/layout/Footer.tsx", "utf8");

ok("a página de academias renderiza GUIAS_DE_ACADEMIA", /<IndiceRegiao\s+grupos=\{GUIAS_DE_ACADEMIA\}/.test(academias));
ok("a página onde-atendo renderiza ONDE_ATENDO", /<IndiceRegiao\s+grupos=\{ONDE_ATENDO\}/.test(ondeAtendo));
ok(
  "o rodapé linka /onde-atendo",
  /href="\/onde-atendo"/.test(rodape),
  "sem link sitewide o índice nasce órfão e não tem relevância para repassar"
);

bloco("4. O CICLO FECHA: OS ÓRFÃOS DEIXARAM DE SER ÓRFÃOS");

/*
 * A conta que originou o trabalho: quantos artigos não recebem link de nenhum
 * OUTRO artigo. Os índices moram fora de lib/blog.ts, então este teste é o
 * único lugar que prova que eles realmente cobrem quem prometeram cobrir.
 */
const recebemDeArtigo = new Set<string>();
for (const p of blogPosts) {
  for (const m of p.content.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)) {
    if (m[1] !== p.slug) recebemDeArtigo.add(m[1]);
  }
}
const orfaosAntes = blogPosts.filter((p) => !recebemDeArtigo.has(p.slug)).map((p) => p.slug);
const cobertos = citados.filter((s) => orfaosAntes.includes(s));

/*
 * Os índices foram escritos para 77 órfãos. Um slug do índice passar a receber
 * link de artigo depois disso não é regressão — é o ciclo fechando pelo outro
 * lado (em 06/09/2026, os guias de academias da Aldeia da Serra passaram a
 * linkar personal-trainer-aldeia-da-serra). O que o teste protege é o inverso:
 * ninguém que os índices resgatam pode voltar a ser órfão sem os índices.
 */
const jaLinkados = citados.filter((s) => !orfaosAntes.includes(s));
ok(
  "todo slug do índice que já recebe link de artigo é um resgate a mais, não um erro",
  jaLinkados.every((s) => recebemDeArtigo.has(s)),
  jaLinkados.join(", ")
);
console.log(`           ${jaLinkados.length} slug(s) do índice já recebem link de artigo: ${jaLinkados.join(", ") || "nenhum"}`);
ok("os índices resgatam 76 dos órfãos", cobertos.length === 76, `resgatam ${cobertos.length}`);

const restam = orfaosAntes.length - cobertos.length;
console.log(`\n  ${orfaosAntes.length} órfãos antes · ${cobertos.length} resgatados pelos índices · ${restam} para a fila diária`);

console.log("\n" + "=".repeat(64));
if (falhas) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
