/**
 * Avisa o Bing (IndexNow) das páginas que mudaram entre dois commits.
 *
 *   npx tsx scripts/indexnow.ts <commit-antes> [commit-depois=HEAD] [--dry]
 *
 * Rodar depois que o deploy estiver no ar (passo de verificação do fluxo).
 * Só entram URLs que estão no sitemap; o resto é descartado.
 */
import { execFileSync } from "child_process";
import sitemap from "../app/sitemap";
import { SITE_URL } from "../lib/blog";
import {
  INDEXNOW_ENDPOINT, INDEXNOW_HOST, INDEXNOW_KEY, INDEXNOW_KEY_LOCATION,
  linhasNovasDoDiff, normaliza, rotaDaPagina, slugsDasLinhas,
} from "../lib/indexnow";

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const dry = process.argv.includes("--dry");
const [antes, depois = "HEAD"] = args;
if (!antes) {
  console.error("uso: npx tsx scripts/indexnow.ts <commit-antes> [commit-depois] [--dry]");
  process.exit(1);
}

const git = (...a: string[]) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 1 << 28 });

const arquivos = git("diff", "--name-only", antes, depois).split("\n").filter(Boolean);
const caminhos = new Set<string>();

for (const arq of arquivos) {
  const rota = rotaDaPagina(arq);
  if (rota) caminhos.add(rota);
  if (/^lib\/[^/]+\.ts$/.test(arq)) {
    let conteudo: string;
    try { conteudo = git("show", `${depois}:${arq}`); } catch { continue; }
    if (!/^\s*slug:\s*"/m.test(conteudo)) continue;
    const linhas = linhasNovasDoDiff(git("diff", "-U0", antes, depois, "--", arq));
    for (const s of slugsDasLinhas(conteudo, linhas)) caminhos.add(`/blog/${s}`);
  }
}

const noSitemap = new Set(sitemap().map((e) => normaliza(e.url)));
const urls = [...caminhos].map((c) => normaliza(SITE_URL + (c === "/" ? "" : c))).filter((u) => noSitemap.has(u));
const fora = [...caminhos].length - urls.length;

console.log(`[indexnow] ${arquivos.length} arquivo(s) mudados; ${urls.length} URL(s) no sitemap; ${fora} descartada(s).`);
for (const u of urls) console.log("  " + u);

if (urls.length === 0 || dry) process.exit(0);

(async () => {
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: INDEXNOW_HOST, key: INDEXNOW_KEY, keyLocation: INDEXNOW_KEY_LOCATION, urlList: urls.slice(0, 10000) }),
  });
  // 200 = recebido; 202 = recebido, chave ainda em validação.
  console.log(`[indexnow] resposta ${res.status} ${res.statusText}`);
  if (res.status !== 200 && res.status !== 202) {
    console.log(await res.text());
    process.exit(1);
  }
})();
