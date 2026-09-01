/**
 * As rotas do site: nada aponta para o vazio, nada aponta para um desvio.
 *   npx tsx scripts/rotas-test.ts
 *
 * Esta suíte nasceu do relatório de indexação do Search Console de
 * 01/09/2026: dez URLs em "Não encontrado (404)". Seis já tinham redirect e
 * o relatório estava velho; quatro eram reais. Nenhuma vinha de link interno
 * — a linkagem do site estava limpa —, mas o custo de descobrir isso foi
 * cruzar três planilhas com o código à mão.
 *
 * As invariantes abaixo respondem sozinhas, a cada execução, o que aquele
 * cruzamento respondeu uma vez.
 */

import { readFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { blogPosts, SITE_URL } from "../lib/blog";
import gerarSitemap from "../app/sitemap";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

const cfg = readFileSync("next.config.ts", "utf8");
const slugs = new Set(blogPosts.map((p) => p.slug));

/** Redirects declarados, na ordem em que o Next os avalia. */
const REDIRECTS = [...cfg.matchAll(/source: "([^"]+)"[\s\S]{0,120}?destination: "([^"]+)"/g)].map(
  (m) => ({ de: m[1], para: m[2] }),
);

/** Páginas fixas do app router (as que têm page.tsx e não são dinâmicas). */
const paginas = new Set<string>();
(function anda(dir: string, rota: string) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (e === "page.tsx") paginas.add(rota === "" ? "/" : rota);
    else if (statSync(p).isDirectory() && !e.startsWith("[") && !e.startsWith("(") && !e.startsWith("_")) {
      anda(p, `${rota}/${e}`);
    }
  }
})("app", "");

/** Uma rota existe se é página fixa ou artigo publicado. */
const existe = (url: string) => {
  const limpa = url.split(/[?#]/)[0].replace(/\/$/, "") || "/";
  if (paginas.has(limpa)) return true;
  if (limpa.startsWith("/blog/")) return slugs.has(limpa.slice("/blog/".length));
  if (limpa.startsWith("/alimentos/")) return true; // rota dinâmica com base própria
  return false;
};

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. TODO REDIRECT LEVA A ALGUM LUGAR QUE EXISTE");

ok(`há redirects para auditar (${REDIRECTS.length})`, REDIRECTS.length > 20);
{
  const mortos = REDIRECTS.filter((r) => !existe(r.para));
  ok("nenhum redirect aponta para página inexistente", mortos.length === 0,
    mortos.map((r) => `${r.de} → ${r.para}`).join(", "));
}

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. NENHUM REDIRECT ESCONDE UM ARTIGO PUBLICADO");

/**
 * Redirect vence a rota. Se a origem de um redirect for o slug de um artigo
 * que existe, o artigo some do ar sem ninguém perceber — e continua no
 * sitemap, convidando o Google a rastrear uma página que desvia.
 */
{
  const sombra = REDIRECTS.filter((r) => existe(r.de));
  ok("nenhuma origem de redirect é uma página real", sombra.length === 0,
    sombra.map((r) => r.de).join(", "));
}

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. NENHUM REDIRECT EM CADEIA OU EM CÍRCULO");

/**
 * Cadeia (A→B→C) faz o Google seguir dois saltos e perder força no caminho;
 * círculo (A→B→A) derruba a página. Os dois passam despercebidos porque cada
 * linha, isolada, parece correta.
 */
{
  const mapa = new Map(REDIRECTS.map((r) => [r.de, r.para]));
  const cadeias: string[] = [];
  const circulos: string[] = [];
  for (const r of REDIRECTS) {
    if (r.de === r.para) { circulos.push(r.de); continue; }
    if (mapa.has(r.para)) {
      if (mapa.get(r.para) === r.de) circulos.push(`${r.de} ⇄ ${r.para}`);
      else cadeias.push(`${r.de} → ${r.para} → ${mapa.get(r.para)}`);
    }
  }
  ok("nenhum redirect em cadeia", cadeias.length === 0, cadeias.join(" | "));
  ok("nenhum redirect circular", circulos.length === 0, circulos.join(" | "));

  /**
   * A ARMADILHA DA CAIXA ALTA.
   *
   * O casamento de `source` no next.config IGNORA maiúsculas; a rota
   * dinâmica [slug], não. Então uma regra "…/RED-S-… → …/red-s-…" casa
   * também com a URL minúscula e a manda para ela mesma: laço infinito, e o
   * artigo sai do ar.
   *
   * As checagens acima não pegam, porque como texto origem e destino são
   * diferentes. Esta pega — e foi escrita depois de o laço acontecer de
   * verdade, num build conferido antes de subir.
   */
  const soCaixa = REDIRECTS.filter(
    (r) => r.de !== r.para && r.de.toLowerCase() === r.para.toLowerCase(),
  );
  ok("nenhum redirect difere do destino só pela caixa", soCaixa.length === 0,
    soCaixa.map((r) => `${r.de} → ${r.para} (laço: o matcher ignora maiúsculas)`).join(" | "));
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. NENHUM LINK INTERNO QUEBRADO OU PASSANDO POR DESVIO");

/**
 * Link interno é o único 404 que o site pode causar sozinho, e o único que
 * dá para impedir. Link que passa por redirect não quebra nada, mas gasta um
 * salto à toa e alimenta a fila "Página com redirecionamento" do Search
 * Console — quando bastava apontar para o destino final.
 */
{
  const arquivos: string[] = [];
  (function anda(dir: string) {
    for (const e of readdirSync(dir)) {
      if (e === "node_modules" || e === ".next" || e === ".git") continue;
      const p = join(dir, e);
      if (statSync(p).isDirectory()) anda(p);
      else if (e.endsWith(".ts") || e.endsWith(".tsx")) arquivos.push(p);
    }
  })(".");

  const origens = new Set(REDIRECTS.map((r) => r.de));
  const quebrados: string[] = [];
  const desviados: string[] = [];
  let total = 0;
  for (const f of arquivos) {
    if (f.includes("next.config")) continue;
    for (const m of readFileSync(f, "utf8").matchAll(/href="(\/blog\/[^"#?]+)"/g)) {
      total++;
      const url = m[1].replace(/\/$/, "");
      if (existe(url)) continue;
      if (origens.has(url)) desviados.push(`${url} (${f})`);
      else quebrados.push(`${url} (${f})`);
    }
  }
  ok(`há links internos para auditar (${total})`, total > 400);
  ok("nenhum link interno aponta para artigo inexistente", quebrados.length === 0,
    quebrados.slice(0, 6).join(", "));
  ok("nenhum link interno passa por redirect", desviados.length === 0,
    desviados.slice(0, 6).join(", "));
}

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. O SITEMAP SÓ OFERECE PÁGINA FINAL");

/**
 * Sitemap é convite explícito ao rastreamento. URL que desvia ou não existe
 * ali é pedir para o Google gastar rastreamento com o que não é página — e é
 * exatamente o que enche os relatórios de "404" e "com redirecionamento".
 */
{
  /*
   * O sitemap é GERADO, não lido como texto.
   *
   * A primeira versão deste teste procurava o slug do redirect dentro do
   * código-fonte de app/sitemap.ts e acusou três falsos positivos: buscar
   * "personal-trainer-alphaville" casava com a página fixa
   * /personal-trainer-alphaville, que é justamente o DESTINO do redirect
   * /blog/personal-trainer-alphaville. Comparar caminho inteiro, e não
   * pedaço de string, elimina a classe inteira desse erro.
   */
  const urls = new Set(
    gerarSitemap().map((e) => e.url.replace(SITE_URL, "").replace(/\/$/, "") || "/"),
  );
  ok(`o sitemap tem URLs para auditar (${urls.size})`, urls.size > 800);

  const origens = REDIRECTS.filter((r) => urls.has(r.de.replace(/\/$/, "")));
  ok("o sitemap não lista origem de redirect", origens.length === 0,
    origens.map((r) => r.de).join(", "));

  const inexistentes = [...urls].filter((u) => !existe(u));
  ok("toda URL do sitemap existe", inexistentes.length === 0, inexistentes.slice(0, 6).join(", "));
}

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. OS 404 DO RELATÓRIO DE 01/09/2026 ESTÃO COBERTOS");

/**
 * Trava de regressão. Estas quatro URLs vieram do relatório do Search
 * Console; se alguém remover o redirect, o 404 volta em silêncio e só
 * reaparece no relatório semanas depois.
 */
/**
 * A quarta URL do relatório, a de caixa alta, NÃO é coberta por redirect —
 * não pode ser. É resolvida na própria página do artigo.
 */
{
  const pagina = readFileSync("app/blog/[slug]/page.tsx", "utf8");
  ok("a página redireciona slug com caixa errada",
    /slug\.toLowerCase\(\)/.test(pagina) && /permanentRedirect\(`\/blog\/\$\{minusculo\}`\)/.test(pagina));
  ok("e continua devolvendo 404 para slug que não existe", /notFound\(\);/.test(pagina));
  const alvo = "deficiencia-energia-atleta-red-s-recuperacao";
  ok(`o artigo de destino existe: ${alvo}`, slugs.has(alvo));
}

for (const url of [
  "/blog/5-habitos-que-sabotam-seu-progresso",
  "/blog/personal-trainer-online-vs-presencial",
  "/blog/quanto-tempo-para-ver-resultados-no-treino",
]) {
  const r = REDIRECTS.find((x) => x.de === url);
  ok(`coberta: ${url}`, r !== undefined && existe(r.para), r ? `→ ${r.para}` : "sem redirect");
}

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
