/**
 *   npx tsx scripts/indexnow-test.ts
 */
import { readFileSync } from "fs";
import { INDEXNOW_KEY, INDEXNOW_KEY_LOCATION, linhasNovasDoDiff, normaliza, rotaDaPagina, slugsDasLinhas } from "../lib/indexnow";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };

ok("a chave tem 32 caracteres hexadecimais", /^[0-9a-f]{32}$/.test(INDEXNOW_KEY));
ok("o arquivo da chave existe em public/ e contém só a chave", readFileSync(`public/${INDEXNOW_KEY}.txt`, "utf8") === INDEXNOW_KEY);
ok("keyLocation aponta para o domínio com www", INDEXNOW_KEY_LOCATION === `https://www.montinhopersonal.com.br/${INDEXNOW_KEY}.txt`);
ok("robots não bloqueia o .txt da chave", !/Disallow:\s*\/\s*$/m.test(readFileSync("app/robots.ts", "utf8")));

const diff = "@@ -10,2 +10,3 @@\n-a\n+b\n@@ -40 +41 @@\n@@ -50,3 +52,0 @@\n";
ok("linhas do diff: faixa, linha única e remoção", JSON.stringify(linhasNovasDoDiff(diff)) === JSON.stringify([10, 11, 12, 41, 52]));

const conteudo = ["const x = [", "  {", '    slug: "um",', "    content: `a", "b`,", "  },", "  {", '    slug: "dois",', "    content: `c`,", "  },"].join("\n");
ok("linha dentro do artigo 'um' dá 'um'", JSON.stringify(slugsDasLinhas(conteudo, [4])) === '["um"]');
ok("linhas em dois artigos dão os dois, sem repetir", JSON.stringify(slugsDasLinhas(conteudo, [4, 5, 9])) === '["um","dois"]');
ok("linha antes do primeiro slug não conta", slugsDasLinhas(conteudo, [1]).length === 0);

ok("page.tsx de ferramenta vira rota", rotaDaPagina("app/ferramentas/calculadora-calorias-boxe/page.tsx") === "/ferramentas/calculadora-calorias-boxe");
ok("page.tsx da raiz vira /", rotaDaPagina("app/page.tsx") === "/");
ok("rota dinâmica não vira URL", rotaDaPagina("app/blog/[slug]/page.tsx") === null);
ok("grupo de rota some do caminho", rotaDaPagina("app/(site)/contato/page.tsx") === "/contato");
ok("componente não vira URL", rotaDaPagina("components/ui/FAQ.tsx") === null);
ok("normaliza tira a barra final", normaliza("https://x.com/a/") === "https://x.com/a" && normaliza("/") === "/");

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
