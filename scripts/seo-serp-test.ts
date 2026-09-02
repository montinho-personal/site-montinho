/**
 * O que o Google efetivamente mostra na SERP.
 *   npx tsx scripts/seo-serp-test.ts
 *
 * Este arquivo existe por causa de um defeito que nenhum teste pegava porque
 * ninguém estava olhando para o lugar certo. Os metaTitles do blog pareciam
 * curtos e bem comportados no código — 38 a 49 caracteres. Só que o layout
 * raiz anexa `%s | Montinho Personal Trainer` a todo título, e o que chegava
 * na busca tinha 70 e poucos caracteres. O Google cortava o final.
 *
 * Em 83 artigos era pior: a marca estava escrita à mão no metaTitle E o
 * template anexava de novo, produzindo "… | Montinho Personal Trainer |
 * Montinho Personal Trainer".
 *
 * A correção foi desligar o template nas páginas de artigo (`title:
 * { absolute }`). Os testes abaixo travam essa decisão e a qualidade dos
 * títulos que ela viabilizou.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { blogPosts } from "../lib/blog";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

const pagina = readFileSync("app/blog/[slug]/page.tsx", "utf8");

/**
 * Os 12 artigos revisados na auditoria de 30/08/2026, escolhidos por
 * impressão real no Search Console. Eles seguem a régua apertada; o resto do
 * acervo ainda não passou por revisão e só responde às travas globais.
 */
const REVISADOS = [
  /* Lote 2 — 02/09/2026: as dez com CTR ZERO e mais impressões, todas já na
     primeira página. 2.808 impressões e nenhum clique em três meses. */
  "dormir-depois-do-almoco-engorda",
  "quanto-tempo-de-caminhada-por-dia",
  "quanto-tempo-para-ganhar-massa-muscular",
  "quanto-de-cardio-fazer",
  "tirzepatida-e-musculacao",
  "fibras-musculares-tipo-1-tipo-2",
  "zumba-emagrece",
  "agachamento-bulgaro-como-fazer",
  "tapioca-engorda",
  "musculacao-ou-corrida-para-emagrecer",
  /* Lote 1 — 30/08/2026: as doze de maior impressão. */
  "polichinelo-emagrece",
  "quantas-calorias-tem-1kg-de-gordura",
  "crossover-vs-crucifixo",
  "smart-fit-vs-bluefit",
  "retatrutida-faz-perder-musculos",
  "da-para-comer-pamonha-e-emagrecer",
  "cardio-ou-musculacao-mounjaro",
  "treino-upper-lower-superior-inferior",
  "quantos-quilos-perder-ate-fim-do-ano",
  "eliptico-emagrece",
  "acai-engorda",
  "proteina-para-quem-usa-mounjaro",
];

const porSlug = new Map(blogPosts.map((p) => [p.slug, p]));

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. O TÍTULO DO ARTIGO NÃO RECEBE O SUFIXO DA MARCA");

/**
 * `title: { absolute: ... }` é o que impede o template do layout de anexar os
 * 28 caracteres da marca. Sem isso, todo título desta auditoria volta a
 * nascer truncado e os 12 textos abaixo perdem o sentido.
 */
ok("a página de artigo declara o título como absoluto",
  /title:\s*\{\s*absolute:\s*title\s*\}/.test(pagina));
ok("o motivo está registrado no código", /28 caracteres|template/i.test(pagina));

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. NENHUM DOS REVISADOS CARREGA A MARCA NO TÍTULO");

/**
 * Com o template desligado, marca escrita à mão não duplica mais — mas
 * continua sendo desperdício. Em busca informacional ("polichinelo
 * emagrece") quem pesquisa ainda não conhece a marca, então ela não compra
 * clique nenhum e ocupa o espaço mais caro da página.
 */
for (const slug of REVISADOS) {
  const p = porSlug.get(slug);
  if (!p) { ok(`${slug} existe`, false); continue; }
  const t = p.metaTitle || p.title;
  ok(`${slug}: sem marca no título`, !/montinho/i.test(t), t);
}

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. TÍTULO CABE NA SERP");

/**
 * 60 é referência, não lei — o Google corta por pixel, não por caractere. O
 * teto de 62 dá folga para uma palavra a mais quando ela paga o espaço, e
 * ainda reprova o título que voltou a inchar.
 */
for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const t = p.metaTitle || p.title;
  ok(`${slug}: título com ${t.length} caracteres`, t.length <= 62, t);
}

// ─── 3b ─────────────────────────────────────────────────────────────────────
bloco("3b. O TÍTULO NÃO ESTÁ CORTADO NEM MAL ESCRITO");

/**
 * Dois defeitos que aparecem NA BUSCA e não em lugar nenhum do site.
 *
 * Reticências: dois metaTitles terminavam em "…" literal — cortados na hora
 * de escrever para caber no limite, e publicados assim. O leitor vê um
 * título que morre no meio.
 *
 * Acentuação: o metaTitle de musculacao-ou-corrida trazia "Musculacao" sem
 * cedilha enquanto o H1 estava correto. Como é o metaTitle que vai para o
 * Google, o erro só existia onde ninguém do site olhava.
 */
for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const t = p.metaTitle || p.title;
  ok(`${slug}: título não termina cortado`, !/(\.\.\.|…)\s*$/.test(t), t);
}
{
  /* Palavras que existem com e sem acento e passam batido no título. */
  const SEM_ACENTO = /\b(musculacao|nutricao|proteina|calorias?\b(?! )|abdomen|exercicio|refeicao|reducao|hipertrofia\b(?! )|saude|voce|nao|tecnica|gluteo|joelho\b(?! ))\b/i;
  const erradas = REVISADOS
    .map((s) => ({ s, t: porSlug.get(s)!.metaTitle || porSlug.get(s)!.title }))
    .filter((x) => SEM_ACENTO.test(x.t));
  ok("nenhum título com palavra sem acento", erradas.length === 0,
    erradas.map((x) => `${x.s}: ${x.t}`).join(" | "));
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. A DESCRIPTION EXISTE, TEM TAMANHO ÚTIL E NÃO ESTÁ CORTADA");

for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const d = p.metaDescription || "";
  ok(`${slug}: description entre 120 e 160 (${d.length})`, d.length >= 120 && d.length <= 160);
  /* A meta da Retatrutida terminava literalmente em "e como..." — cortada na origem. */
  ok(`${slug}: não termina em reticências`, !/\.\.\.$|…$/.test(d.trim()), d.slice(-30));
}

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. A DESCRIPTION COMPLEMENTA O TÍTULO, NÃO O REPETE");

/**
 * Abrir a description repetindo o título queima a primeira linha do
 * resultado — a única que boa parte das pessoas lê no celular. A trava
 * compara as quatro primeiras palavras significativas das duas.
 */
const palavras = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2);

for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const t = palavras(p.metaTitle || p.title).slice(0, 4);
  const d = palavras(p.metaDescription || "").slice(0, 4);
  const iguais = t.filter((w) => d.includes(w)).length;
  ok(`${slug}: abertura da description difere do título`, iguais < 3, `${t.join(" ")} / ${d.join(" ")}`);
}

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. SEM ENCHIMENTO DE SERP");

/**
 * Lista curta e literal, com as construções que efetivamente estavam nos 12:
 * "Descubra a verdade" (pamonha), "Confira!" (Smart Fit), "Guia Completo"
 * (upper/lower). São frases que aparecem em metade da SERP brasileira e não
 * dizem nada sobre esta página em particular.
 */
const ENCHIMENTO: [string, RegExp][] = [
  ["descubra a verdade", /descubra a verdade/i],
  ["confira! solto no fim", /\bconfira!/i],
  ["guia completo/definitivo", /guia (completo|definitivo)/i],
  ["adjetivo vazio", /\b(incr[ií]vel|imperd[ií]vel|revolucion[áa]rio|segredo)\b/i],
  ["promessa de resultado", /resultado garantido|garant\w+ (o|seu) resultado/i],
];
for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const texto = `${p.metaTitle || p.title} ${p.metaDescription || ""}`;
  for (const [nome, re] of ENCHIMENTO) {
    const achado = texto.match(re);
    ok(`${slug}: sem ${nome}`, achado === null, achado ? `"${achado[0]}"` : "");
  }
}

// ─── 7 ──────────────────────────────────────────────────────────────────────
bloco("7. PÁGINA NACIONAL NÃO SE ANUNCIA COMO LOCAL");

/**
 * A meta de "quantos quilos perder até o fim do ano" gastava metade do
 * espaço com "Personal trainer em Alphaville" — numa consulta informacional
 * que vem do Brasil inteiro. Quem pesquisa isso em Recife lê "Alphaville" e
 * conclui que o resultado não é para ele.
 *
 * A trava vale só para os artigos SEM intenção local. Smart Fit vs Bluefit
 * compara duas unidades da região, então ali o sinal local é legítimo.
 */
const COM_INTENCAO_LOCAL = new Set(["smart-fit-vs-bluefit"]);
for (const slug of REVISADOS) {
  if (COM_INTENCAO_LOCAL.has(slug)) continue;
  const p = porSlug.get(slug)!;
  const texto = `${p.metaTitle || p.title} ${p.metaDescription || ""}`;
  ok(`${slug}: sem sinal geográfico indevido`,
    !/alphaville|barueri|tamboré|tambore|santana de parna/i.test(texto));
}

// ─── 8 ──────────────────────────────────────────────────────────────────────
bloco("8. O TÍTULO NÃO PROMETE O QUE A PÁGINA NÃO TEM");

/**
 * Título com número é o que mais rende nessas consultas — e é exatamente por
 * isso que ele precisa de trava. Número inventado no título é a forma mais
 * fácil de transformar CTR em pogo-sticking.
 *
 * A verificação é literal: todo número do título tem que aparecer no corpo
 * do artigo. Percentuais e unidades entram sem o sufixo para tolerar as
 * variações de escrita entre título e texto.
 */
for (const slug of REVISADOS) {
  const p = porSlug.get(slug)!;
  const t = p.metaTitle || p.title;
  const numeros = t.match(/\d+(?:[.,]\d+)?/g) ?? [];
  const corpo = `${p.content} ${(p.faq ?? []).map((f) => f.question + f.answer).join(" ")}`;
  const ausentes = numeros.filter((n) => !corpo.includes(n));
  ok(`${slug}: números do título aparecem no artigo`, ausentes.length === 0, ausentes.join(", "));
}

// ─── 9 ──────────────────────────────────────────────────────────────────────
bloco("9. OS 12 NÃO DISPUTAM A MESMA CONSULTA ENTRE SI");

/**
 * Canibalização não é "assunto parecido", é título parecido a ponto de duas
 * URLs parecerem responder a mesma busca. A régua compara as palavras
 * significativas de cada par.
 */
for (let i = 0; i < REVISADOS.length; i++) {
  for (let j = i + 1; j < REVISADOS.length; j++) {
    const a = porSlug.get(REVISADOS[i])!;
    const b = porSlug.get(REVISADOS[j])!;
    const pa = new Set(palavras(a.metaTitle || a.title));
    const pb = palavras(b.metaTitle || b.title);
    const comuns = pb.filter((w) => pa.has(w));
    const sobreposicao = comuns.length / Math.min(pa.size, pb.length);
    ok(`${REVISADOS[i]} × ${REVISADOS[j]}`, sobreposicao < 0.6, `${Math.round(sobreposicao * 100)}% em comum`);
  }
}

// ─── 10 ─────────────────────────────────────────────────────────────────────
bloco("10. NENHUMA PÁGINA DO APP DUPLICA A MARCA NO TÍTULO");

/**
 * O mesmo defeito do blog acontecia nas 21 landing pages locais, que são as
 * páginas comerciais do site: a marca vinha escrita no `title` do metadata E
 * o template do layout anexava outra, produzindo
 *
 *   Personal Trainer Tamboré | Montinho Personal Trainer | Montinho Personal Trainer
 *
 * A correção ali foi diferente da do blog, e de propósito. Em página local a
 * marca AJUDA — quem busca "personal trainer Tamboré" está a um passo de
 * contratar e reconhece o nome. Então o título continua com a marca, uma vez
 * só, via `absolute`.
 *
 * A trava é sobre o `title` de primeiro nível do metadata (dois espaços de
 * indentação). O `openGraph.title` fica de fora porque o template não se
 * aplica a ele — lá a marca escrita à mão é a única que existe.
 */
{
  const pages: string[] = [];
  const anda = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) anda(p);
      else if (e.name === "page.tsx") pages.push(p);
    }
  };
  anda("app");

  const duplicam = pages.filter((f) =>
    /\n {2}title: "[^"]*\| Montinho Personal Trainer",/.test(readFileSync(f, "utf8")),
  );
  ok("nenhuma página soma marca escrita à mão com o template", duplicam.length === 0,
    duplicam.join(", "));

  /* E o inverso: quem usa `absolute` precisa mesmo trazer a marca, senão a página perde o sinal. */
  const locaisSemMarca = pages.filter((f) => {
    const m = readFileSync(f, "utf8").match(/\n {2}title: \{ absolute: "([^"]*)" \}/);
    return m !== null && !/Montinho/.test(m[1]);
  });
  ok("página que desliga o template ainda declara a marca", locaisSemMarca.length === 0,
    locaisSemMarca.join(", "));
}

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
