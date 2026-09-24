import { existsSync, readFileSync } from "fs";
/**
 * /simuladores e a integração com /ferramentas.
 *   npx tsx scripts/simuladores-test.ts
 */
import { PROXIMOS_SIMULADORES, SIMULADORES, outrosSimuladores } from "../lib/simuladores";
import { FERRAMENTAS_NO_AR } from "../lib/ferramentas/catalogo";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };

ok("todo simulador tem página", SIMULADORES.every((s) => existsSync(`app${s.href}/page.tsx`)));
ok("todo simulador está no catálogo da central", SIMULADORES.every((s) => FERRAMENTAS_NO_AR.some((f) => f.href === s.href)));
ok("ids únicos e irmãos excluem o atual", new Set(SIMULADORES.map((s) => s.id)).size === SIMULADORES.length && outrosSimuladores("massa").every((s) => s.id !== "massa"));
ok("os próximos não têm link (nada de página vazia)", PROXIMOS_SIMULADORES.every((p) => !("href" in p)));

const pg = readFileSync("app/simuladores/page.tsx", "utf8");
ok("um H1", (pg.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pg.match(/^\s*title:\s*"([^"]+)"/m)![1];
const desc = pg.match(/^\s*description:\s*\n?\s*"([^"]+)"/m)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58, titulo);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155, desc);
ok("canonical, CollectionPage e breadcrumb", /canonical/.test(pg) && /"CollectionPage"/.test(pg) && /"BreadcrumbList"/.test(pg));
ok("a escolha é pelo objetivo e sai do registro", /SIMULADORES\.map/.test(pg) && /s\.pergunta/.test(pg));
ok("fechamento do Montinho na página", /FECHAMENTO_COMPARACAO/.test(pg));
ok("FAQ pelo componente do site", /<FAQ itens=\{faq\}/.test(pg));

const hub = readFileSync("app/ferramentas/page.tsx", "utf8");
ok("/ferramentas mostra a faixa ANTES do catálogo", hub.indexOf("<FaixaSimuladores") > 0 && hub.indexOf("<FaixaSimuladores") < hub.indexOf("<CentralFerramentas"));
for (const s of SIMULADORES) {
  const p = readFileSync(`app${s.href}/page.tsx`, "utf8");
  ok(`${s.nome}: trilha Ferramentas › Simuladores › página`, /name: "Simuladores", item: `\$\{SITE_URL\}\/simuladores`/.test(p) && /href="\/simuladores"/.test(p));
  ok(`${s.nome}: mostra os irmãos`, /<OutrosSimuladores atual=/.test(p));
}
ok("sitemap e rodapé", /\/simuladores`/.test(readFileSync("app/sitemap.ts", "utf8")) && /href="\/simuladores"/.test(readFileSync("components/layout/Footer.tsx", "utf8")));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
