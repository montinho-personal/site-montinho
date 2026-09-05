/**
 * Auditoria de Open Graph das páginas compartilháveis.
 *
 * Compartilhar só funciona se a prévia funcionar: o link colado no WhatsApp
 * disputa atenção com dezenas de mensagens, e um link sem cartão parece
 * spam. Este script lê os metadados declarados em cada page.tsx e reprova o
 * que quebraria a prévia — título ausente, descrição ausente, imagem
 * ausente sem herança do layout, ou imagem que não existe no repositório.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const raiz = process.cwd();
let alertas = 0, ok = 0;
const problemas: string[] = [];

function paginas(dir: string, achadas: string[] = []): string[] {
  for (const nome of readdirSync(dir)) {
    if (nome === "crm" || nome === "api" || nome === "lp") continue; // privados/noindex
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) paginas(caminho, achadas);
    else if (nome === "page.tsx") achadas.push(caminho);
  }
  return achadas;
}

const layout = readFileSync(join(raiz, "app/layout.tsx"), "utf8");
const temPadraoOg = /openGraph:\s*\{[\s\S]*?images:/.test(layout);
const imagemPadrao = layout.match(/url:\s*["'`]([^"'`]*og-image[^"'`]*)["'`]/)?.[1] ?? "/og-image.jpg";

console.log("Auditoria de Open Graph\n=======================\n");
console.log(`Layout raiz define openGraph com imagem: ${temPadraoOg ? "sim" : "NÃO"} (${imagemPadrao})`);
const arquivoPadrao = join(raiz, "public", imagemPadrao.replace(/^https?:\/\/[^/]+/, "").replace(/^\//, ""));
console.log(`Arquivo da imagem padrão existe: ${existsSync(arquivoPadrao) ? "sim" : "NÃO"}\n`);

for (const p of paginas(join(raiz, "app")).sort()) {
  const rel = p.replace(raiz + "/", "");
  const s = readFileSync(p, "utf8");
  const rota = "/" + rel.replace(/^app\//, "").replace(/\/page\.tsx$/, "").replace(/^page\.tsx$/, "");

  // Página noindex não é compartilhável e não precisa de cartão próprio.
  if (/robots:\s*\{[^}]*index:\s*false/.test(s)) continue;

  const declaraMeta = /export (const metadata|async function generateMetadata)/.test(s);
  if (!declaraMeta) {
    // Sem metadata própria: herda título e OG do layout. Aceitável, mas o
    // cartão sai genérico — vale registrar.
    problemas.push(`${rota}: sem metadata própria (herda o cartão genérico do site)`);
    alertas++;
    continue;
  }
  const temOg = /openGraph:/.test(s);
  const temTitulo = /title:/.test(s);
  const temDesc = /description:/.test(s);
  const temImagem = /images:/.test(s);

  const faltas: string[] = [];
  if (!temTitulo) faltas.push("title");
  if (!temDesc) faltas.push("description");
  if (!temOg) faltas.push("openGraph");
  // Imagem pode ser herdada do layout: só é problema se não houver padrão.
  if (!temImagem && !temPadraoOg) faltas.push("og:image (e o layout não tem padrão)");

  if (faltas.length) { problemas.push(`${rota}: falta ${faltas.join(", ")}`); alertas++; }
  else ok++;
}

// Imagens de OG referenciadas que não existem no repositório
const refs = new Set<string>();
for (const p of paginas(join(raiz, "app"))) {
  const s = readFileSync(p, "utf8");
  for (const m of s.matchAll(/url:\s*[`"']\$\{SITE_URL\}(\/[^`"']+\.(?:jpg|jpeg|png|webp))[`"']/g)) refs.add(m[1]);
  for (const m of s.matchAll(/url:\s*["'](\/[^"']+\.(?:jpg|jpeg|png|webp))["']/g)) refs.add(m[1]);
}
const quebradas = [...refs].filter((r) => !existsSync(join(raiz, "public", r.replace(/^\//, ""))));

console.log(`Páginas com metadata completa: ${ok}`);
console.log(`Páginas com alerta: ${alertas}\n`);
if (problemas.length) { console.log("Alertas:"); for (const x of problemas) console.log(`  · ${x}`); }
console.log(`\nImagens de OG referenciadas: ${refs.size}`);
if (quebradas.length) { console.log("QUEBRADAS (arquivo não existe em /public):"); for (const q of quebradas) console.log(`  ✗ ${q}`); }
else console.log("Nenhuma imagem de OG quebrada.");

process.exit(quebradas.length ? 1 : 0);
