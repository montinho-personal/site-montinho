/**
 * O FAQ do site.
 *   npx tsx scripts/faq-test.ts
 *
 * Duas coisas estão em jogo aqui, e a segunda é a que quebra sem avisar.
 *
 * A primeira é a forma: toda pergunta do site abre e fecha, e todas iguais.
 * Antes desta unificação havia quatro FAQs diferentes na mesma casa.
 *
 * A segunda é SEO. Acordeão de `useState` não renderiza a resposta enquanto
 * está fechado, e como ele nasce fechado, a resposta nunca chega ao HTML —
 * era o que acontecia em /faq e na home, que tinham a resposta só dentro do
 * JSON-LD. `details` recolhe sem tirar do HTML. Esta suíte trava isso pelo
 * código e, quando existe build, pelo HTML gerado de verdade.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}
const semComents = (s: string) =>
  s.replace(/\{\/\*[\s\S]*?\*\/\}/g, " ").replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\/\/[^\n]*/g, " ");

const comp = readFileSync("components/ui/FAQ.tsx", "utf8");
const compSC = semComents(comp);
const css = readFileSync("app/globals.css", "utf8");
const analytics = readFileSync("lib/analytics.ts", "utf8");

/** Todo page.tsx do app, recursivo. */
function paginas(dir = "app"): string[] {
  const saida: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) saida.push(...paginas(p));
    else if (e.name === "page.tsx") saida.push(p);
  }
  return saida;
}
const TODAS = [...paginas(), "components/home/HomeFAQ.tsx"];

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. A RESPOSTA NUNCA SAI DO HTML");

ok("o acordeão é details/summary, não useState", /<details/.test(compSC) && /<summary/.test(compSC) && !/useState/.test(compSC));
ok("a resposta é renderizada sempre, sem condicional", (() => {
  const corpo = compSC.slice(compSC.indexOf("<details"));
  /*
   * Nenhum `&&` no corpo do acordeão. É uma trava dura de propósito: o
   * componente não tem motivo legítimo para renderização condicional, e
   * qualquer guarda ali é o caminho de volta para a resposta sumir do HTML.
   */
  return /\{item\.answer\}/.test(corpo) && !corpo.includes("&&");
})());
ok("o Safari não desenha o triângulo por cima do nosso +", /summary::-webkit-details-marker\s*\{\s*display:\s*none/.test(css));

/*
 * O padrão que ESTA suíte existe para impedir: acordeão que desmonta a
 * resposta. Se alguém reintroduzir um, o FAQ some do HTML de novo.
 */
for (const f of TODAS) {
  const s = semComents(readFileSync(f, "utf8"));
  if (!/answer|resposta/.test(s)) continue;
  const suspeito = /\{(?:open|aberto|isOpen)[^}]*&&\s*\(?\s*<[^>]*>\s*\{[^}]*(?:answer|resposta)/.test(s);
  ok(`${f}: não esconde resposta com estado`, !suspeito);
}

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. UM FAQ SÓ NO SITE INTEIRO");

ok("não sobrou o acordeão antigo de useState", !existsSync("components/ui/FAQAccordion.tsx"));

const COM_FAQ: string[] = [];
for (const f of TODAS) {
  const s = semComents(readFileSync(f, "utf8"));
  /* Lista de perguntas na página, fora do schema. */
  const temLista = /(?:const (?:faq|faqs|faqLp|FAQ_EDITORIAL)\b)/.test(s);
  if (!temLista) continue;
  COM_FAQ.push(f);
  ok(`${f}: usa o componente único`, /<FAQ\s/.test(s) || /import FAQ from "@\/components\/ui\/FAQ"/.test(s));
  /* Nada de montar pergunta e resposta à mão fora do componente. */
  const naMao = /\{(?:faq|faqs|faqLp|FAQ_EDITORIAL)\.map\([^)]*\)\s*=>\s*\(\s*<(?:div|details|dl)/.test(s);
  ok(`${f}: não monta FAQ à mão`, !naMao);
}
ok(`o FAQ aparece em várias páginas (${COM_FAQ.length})`, COM_FAQ.length >= 25, String(COM_FAQ.length));
ok("as páginas locais de Tamboré e Alphaville estão entre elas",
  ["app/personal-trainer-tambore/page.tsx", "app/personal-trainer-alphaville/page.tsx", "app/faq/page.tsx"]
    .every((p) => COM_FAQ.includes(p)));

/* Cada chamada declara de onde veio, senão a medição não separa página. */
for (const f of COM_FAQ) {
  const s = readFileSync(f, "utf8");
  const chamadas = s.match(/<FAQ\s[\s\S]*?\/>/g) ?? [];
  ok(`${f}: a chamada informa o placement`, chamadas.length > 0 && chamadas.every((c) => /placement="[a-z0-9-]+"/.test(c)));
}

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. O SCHEMA DIZ O MESMO QUE A PÁGINA MOSTRA");

/*
 * Na home a lista do schema e a lista exibida são dois arrays diferentes,
 * em arquivos diferentes. Divergir é questão de tempo — e schema que promete
 * uma pergunta que a página não mostra é exatamente o que o Google pune.
 */
{
  const schema = readFileSync("app/page.tsx", "utf8");
  const visivel = readFileSync("components/home/HomeFAQ.tsx", "utf8");
  const qsS = [...schema.matchAll(/name:\s*"([^"]+\?)"/g)].map((m) => m[1]);
  const qsV = [...visivel.matchAll(/question:\s*"([^"]+)"/g)].map((m) => m[1]);
  ok("home: o schema tem perguntas", qsS.length > 0);
  ok(`home: schema e página mostram as mesmas perguntas (${qsS.length} × ${qsV.length})`,
    qsS.length === qsV.length && qsS.every((q) => qsV.includes(q)),
    qsS.filter((q) => !qsV.includes(q)).join(" | "));
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. ACESSÍVEL E CLICÁVEL NO CELULAR");

ok("o gatilho é summary, operável por teclado sem JS", /<summary/.test(compSC));
ok("foco visível no padrão do site (dourado)", /focus-visible:outline-\[#BA9E50\]/.test(compSC));
ok("alvo de toque confortável", /min-h-\[5[26]px\]/.test(compSC));
ok("o + é decorativo para o leitor de tela", /aria-hidden="true"/.test(compSC));
ok("o texto da pergunta não é só ícone", /\{item\.question\}/.test(compSC));

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. MEDIÇÃO: SÓ ABERTURA, SÓ CONTEÚDO NOSSO");

ok("faq_open declarado e disparado", analytics.includes(`"faq_open"`) && compSC.includes(`"faq_open"`));
ok("só a abertura conta, não o fechamento", /\.open\)/.test(compSC) && !/faq_close/.test(compSC));
{
  const chamadas = compSC.match(/trackEvent\([\s\S]*?\);/g) ?? [];
  ok("o evento leva placement e a pergunta, nada mais",
    chamadas.length === 1 && /placement/.test(chamadas[0]) && /pergunta: item\.question/.test(chamadas[0]));
  ok("nenhum dado de quem leu no evento",
    chamadas.every((c) => !/peso|kcal|idade|sexo|altura|email|nome|telefone|referrer|utm_source|href|url/i.test(c)));
}
ok("o evento antigo só da consultoria saiu do catálogo", !analytics.includes(`"consultoria_faq_open"`));

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. O HTML GERADO (roda depois de next build)");

const dirHtml = ".next/server/app";
if (!existsSync(dirHtml)) {
  console.log("  pulado  sem build em .next — rode `npx next build` para checar o HTML");
} else {
  const semScript = (h: string) => h.replace(/<script[\s\S]*?<\/script>/g, "");
  /* Uma amostra que cobre os quatro FAQs que existiam antes da unificação. */
  const AMOSTRA: Array<[string, string, string]> = [
    ["personal-trainer-tambore.html", "Boa parte dos residenciais de Tamboré", "página local"],
    ["faq.html", "Os valores variam conforme a modalidade", "/faq"],
    ["index.html", "personal trainer online cria seu programa", "home"],
    ["consultoria.html", "", "consultoria"],
  ];
  for (const [arq, trecho, rotulo] of AMOSTRA) {
    const caminho = join(dirHtml, arq);
    if (!existsSync(caminho) || !trecho) continue;
    const visivel = semScript(readFileSync(caminho, "utf8"));
    ok(`${rotulo}: a resposta está no HTML visível`, visivel.includes(trecho));
    ok(`${rotulo}: e vem dentro de um details`, /<details/.test(visivel));
  }
}

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
