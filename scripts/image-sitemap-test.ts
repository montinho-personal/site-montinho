/**
 * Sitemap de imagens.
 *   npx tsx scripts/image-sitemap-test.ts
 *
 * A regra que esta suíte existe para proteger é uma só: o sitemap declara
 * exatamente as imagens que estão nas páginas. Nem uma a mais, nem uma a
 * menos.
 *
 * O ARQUIVO ANTERIOR ERRAVA DOS DOIS LADOS
 *
 * Ele procurava `{slug}-infographic.svg` no disco e declarava se o arquivo
 * existisse — 373 infográficos que nenhum artigo publica entravam como se
 * estivessem numa página. E considerava só a capa, então artigo com duas
 * fotos perdia a segunda: 47 imagens reais ficavam de fora.
 *
 * Nenhum dos dois erros aparece em teste de build, em lint ou no navegador.
 * Só comparando o XML com o HTML dos artigos, que é o que este arquivo faz.
 *
 * E COMPARA O XML, NÃO O EXTRATOR
 *
 * Verificar só a função de extração deixaria passar exatamente o bug antigo:
 * ela devolvia tudo certo e a rota descartava o resto. Quem responde ao
 * Google é a rota, então é a saída dela que precisa bater.
 */

import { readFileSync, existsSync, readdirSync } from "node:fs";
import { blogPosts, imagensDoArtigo, SITE_URL } from "../lib/blog";
import { GET } from "../app/image-sitemap/route";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

/*
 * O (?<![:\w]) evita comer o "//" de http:// e transformar a URL do namespace
 * em comentário — foi o que aconteceu na primeira versão desta suíte.
 */
const semComents = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(?<![:\w])\/\/[^\n]*/g, " ");
const rota = semComents(readFileSync("app/image-sitemap/route.ts", "utf8"));
const robots = readFileSync("app/robots.ts", "utf8");

async function main() {
  const XML = await (await GET()).text();
  const noXml = new Set([...XML.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]));

  // ─── 1 ────────────────────────────────────────────────────────────────────
  bloco("1. AS IMAGENS SAEM DO ARTIGO, NÃO DE UM PALPITE");

  ok("a rota lê as imagens do conteúdo do artigo", /imagensDoArtigo\(post\)/.test(rota));
  ok("não procura arquivo no disco por convenção de nome",
    !/existsSync|readdirSync|readFileSync|-infographic\.svg/.test(rota));
  ok("não usa o fallback de og:image como imagem de artigo", !/getPostCoverImage|og-image/.test(rota));

  {
    const post = blogPosts.find((p) => (p.content.match(/<img[^>]*src="\/blog-images\//g) ?? []).length >= 2);
    ok("existe artigo com duas ou mais imagens para testar", !!post);
    if (post) {
      const imgs = imagensDoArtigo(post);
      ok(`${post.slug}: devolve mais de uma imagem (${imgs.length})`, imgs.length >= 2);
      ok("todas com URL absoluta do site", imgs.every((u) => u.startsWith(`${SITE_URL}/blog-images/`)));
      ok("e todas chegam ao XML", imgs.every((u) => noXml.has(u)));
    }
  }
  ok("artigo sem imagem devolve lista vazia",
    imagensDoArtigo({ ...blogPosts[0], content: "<p>sem imagem</p>" }).length === 0);
  {
    /* A mesma imagem citada duas vezes no artigo entra uma vez só. */
    const dobrada = '<img src="/blog-images/x.webp" alt="a"><p>t</p><img src="/blog-images/x.webp" alt="a">';
    ok("imagem repetida no artigo não duplica",
      imagensDoArtigo({ ...blogPosts[0], content: dobrada }).length === 1);
  }

  // ─── 2 ────────────────────────────────────────────────────────────────────
  bloco("2. O XML BATE COM O HTML DOS ARTIGOS");

  /* O que os artigos realmente exibem, contado de forma independente da rota. */
  const noHtml = new Set<string>();
  let artigosComImagem = 0;
  for (const post of blogPosts) {
    let tem = false;
    for (const m of post.content.matchAll(/<img[^>]*\ssrc="(\/blog-images\/[^"]+)"/g)) {
      noHtml.add(`${SITE_URL}${m[1]}`);
      tem = true;
    }
    if (tem) artigosComImagem++;
  }

  const fantasmas = [...noXml].filter((u) => !noHtml.has(u));
  const faltando = [...noHtml].filter((u) => !noXml.has(u));
  ok(`nenhuma imagem fantasma (${noXml.size} no XML)`, fantasmas.length === 0, fantasmas.slice(0, 3).join(", "));
  ok("nenhuma imagem do artigo fica de fora", faltando.length === 0, faltando.slice(0, 3).join(", "));
  ok(`cobre os artigos que têm imagem (${artigosComImagem} de ${blogPosts.length})`,
    artigosComImagem > blogPosts.length * 0.9);
  ok("uma <url> por artigo com imagem",
    (XML.match(/<url>/g) ?? []).length === artigosComImagem,
    `${(XML.match(/<url>/g) ?? []).length} × ${artigosComImagem}`);

  {
    const arquivos = new Set(readdirSync("public/blog-images"));
    const ausentes = [...noXml].filter((u) => !arquivos.has(u.split("/").pop()!));
    ok("toda imagem declarada existe em public/blog-images", ausentes.length === 0, ausentes.slice(0, 3).join(", "));
  }

  // ─── 3 ────────────────────────────────────────────────────────────────────
  bloco("3. XML VÁLIDO E SÓ COM O QUE O GOOGLE LÊ");

  ok("declara o namespace de imagem",
    XML.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'));
  ok("declara o namespace de sitemap",
    XML.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'));
  /*
   * image:title, image:caption, image:license e image:geo_location foram
   * descontinuados pelo Google em 2022 e são ignorados. Emiti-los inchava o
   * arquivo sem informar nada.
   */
  for (const tag of ["image:title", "image:caption", "image:license", "image:geo_location"]) {
    ok(`o XML não emite ${tag}, descontinuado`, !XML.includes(`<${tag}>`));
  }
  ok(`o XML emite image:loc (${noXml.size})`, noXml.size > 800);
  ok("nenhum & sem escape no XML", [...XML.matchAll(/&(?!(amp|lt|gt|quot|apos);)/g)].length === 0);
  ok("declara charset na resposta", /charset=utf-8/.test(rota));
  ok("a rota escapa tudo que imprime", /escapaXml\(url\)/.test(rota) && /escapaXml\(`/.test(rota));

  // ─── 4 ────────────────────────────────────────────────────────────────────
  bloco("4. O GOOGLE CONSEGUE ACHAR O ARQUIVO");

  ok("o robots.txt aponta para o sitemap de imagens", /image-sitemap/.test(robots));
  ok("o robots.txt aponta também para o sitemap normal", /sitemap\.xml/.test(robots));
  ok("a rota existe onde o robots diz", existsSync("app/image-sitemap/route.ts"));

  // ─── 5 ────────────────────────────────────────────────────────────────────
  bloco("5. AS ÓRFÃS DO DISCO NÃO VOLTAM PELA PORTA DOS FUNDOS");

  {
    const orfas = readdirSync("public/blog-images")
      .filter((f) => !noHtml.has(`${SITE_URL}/blog-images/${f}`));
    console.log(`   ${orfas.length} arquivo(s) em public/blog-images não aparecem em artigo nenhum.`);
    console.log("   Ficam no disco de propósito: podem virar conteúdo. O que não podem é");
    console.log("   entrar no sitemap como se já estivessem publicados.");
    ok("nenhuma órfã no XML", orfas.every((f) => !noXml.has(`${SITE_URL}/blog-images/${f}`)));
  }

  console.log("\n" + "=".repeat(64));
  if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
  console.log("TODOS OS TESTES PASSARAM");
}

main();
