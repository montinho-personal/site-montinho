/**
 * Relatório de SEO local a partir do export do Search Console.
 *
 *   npx tsx scripts/gsc-local.ts "Páginas.csv" ["Consultas.csv"]
 *
 * O QUE ESTE ARQUIVO RESPONDE QUE A TELA DO SEARCH CONSOLE NÃO RESPONDE
 *
 * A tela lista URL por URL, ordenada por clique. Isso esconde as duas coisas
 * que decidem o que fazer a seguir:
 *
 * 1. QUANTAS PÁGINAS DISPUTAM O MESMO BAIRRO. Existem 24 páginas de bairro em
 *    app/ e mais de 120 artigos locais no blog. Quando cinco delas aparecem
 *    para a mesma intenção, o Google divide a autoridade e nenhuma passa da
 *    primeira página. Só dá para ver isso agrupando por cluster, que é o que
 *    a segunda tabela faz.
 *
 * 2. SE O PROBLEMA É POSIÇÃO OU É TÍTULO. Uma página na posição 4 com 1% de
 *    clique não tem problema de ranking — tem problema de title e description.
 *    Uma na posição 18 com 3% está bem escrita e mal posicionada. São
 *    correções opostas, e confundir as duas custa semanas. A coluna "CTR
 *    esperado" separa uma da outra.
 *
 * O CSV
 *
 * Search Console → Resultados da pesquisa → Exportar → CSV. O ZIP traz
 * "Páginas.csv" e "Consultas.csv". Os números vêm em pt-BR: milhar com ponto,
 * decimal com vírgula, CTR com %. Ler isso com Number() dá NaN silencioso, e
 * NaN em relatório é pior que erro — por isso o parse é explícito e qualquer
 * campo ilegível derruba a execução em vez de virar zero.
 */

import { readFileSync, existsSync } from "node:fs";

/** Bairros e cidades que o site atende. A ordem importa: o primeiro que casar nomeia o cluster. */
export const CLUSTERS: Array<[string, RegExp]> = [
  ["Tamboré", /tambore/i],
  ["Alphaville", /alphaville/i],
  ["Barueri", /barueri/i],
  ["Santana de Parnaíba", /santana-de-parnaiba|parnaiba/i],
  ["Aldeia da Serra", /aldeia-da-serra/i],
  ["Carapicuíba", /carapicuiba/i],
  ["Osasco", /osasco/i],
];

export function cluster(url: string): string | null {
  for (const [nome, re] of CLUSTERS) if (re.test(url)) return nome;
  return null;
}

/**
 * CTR médio por posição na busca orgânica. Serve de régua, não de meta: o
 * que interessa é a distância entre o real e o esperado, porque ela isola
 * problema de título de problema de ranking.
 */
export function ctrEsperado(posicao: number): number {
  const curva: Array<[number, number]> = [
    [1, 27], [2, 15], [3, 11], [4, 8], [5, 6],
    [6, 4.5], [7, 3.5], [8, 3], [9, 2.5], [10, 2.2],
    [15, 1.2], [20, 0.7], [30, 0.3], [50, 0.1],
  ];
  if (posicao <= 1) return curva[0][1];
  for (let i = 1; i < curva.length; i++) {
    const [p1, c1] = curva[i - 1], [p2, c2] = curva[i];
    if (posicao <= p2) return c1 + ((c2 - c1) * (posicao - p1)) / (p2 - p1);
  }
  return 0.05;
}

/** CSV com aspas: URL pode conter vírgula. */
export function csv(texto: string): string[][] {
  const linhas: string[][] = [];
  let campo = "", linha: string[] = [], aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ",") { linha.push(campo); campo = ""; }
    else if (c === "\n") { linha.push(campo); linhas.push(linha); linha = []; campo = ""; }
    else if (c !== "\r") campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

/**
 * "1.234" → 1234, "11,4" → 11.4, "1,23%" → 1.23.
 * Number("1.234") daria 1.234 e Number("11,4") daria NaN: os dois passariam
 * despercebidos num relatório. Aqui, campo ilegível é erro.
 */
export function num(bruto: string, ondeVeio = ""): number {
  const limpo = bruto.trim().replace(/%$/, "").replace(/\./g, "").replace(",", ".");
  /* Number("") é 0, não NaN: célula vazia viraria zero legítimo no relatório. */
  const n = limpo === "" ? NaN : Number(limpo);
  if (!Number.isFinite(n)) throw new Error(`Número ilegível${ondeVeio ? ` em ${ondeVeio}` : ""}: "${bruto}"`);
  return n;
}

export interface Linha { url: string; cliques: number; impressoes: number; ctr: number; posicao: number; }

/** Acha as colunas pelo nome, porque a ordem do export do GSC já mudou antes. */
export function leGsc(texto: string, rotuloChave = "Página"): Linha[] {
  const linhas = csv(texto).filter((l) => l.some((c) => c.trim()));
  if (!linhas.length) throw new Error("CSV vazio.");
  const cab = linhas[0].map((c) => c.trim());
  const acha = (...nomes: string[]) => {
    const i = cab.findIndex((c) => nomes.some((n) => c.toLowerCase().startsWith(n.toLowerCase())));
    if (i < 0) throw new Error(`Não achei a coluna "${nomes[0]}". Colunas: ${cab.join(" | ")}`);
    return i;
  };
  const iU = acha(rotuloChave, "Principais", "Consulta");
  const iC = acha("Cliques");
  const iI = acha("Impressões");
  const iR = acha("CTR");
  const iP = acha("Posição");
  return linhas.slice(1).filter((l) => l[iU]?.trim()).map((l) => ({
    url: l[iU].trim(),
    cliques: num(l[iC], l[iU]),
    impressoes: num(l[iI], l[iU]),
    ctr: num(l[iR], l[iU]),
    posicao: num(l[iP], l[iU]),
  }));
}

const arred = (n: number, c = 1) => Math.round(n * 10 ** c) / 10 ** c;
const pad = (s: string | number, n: number) => String(s).padStart(n);

function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error('Uso: npx tsx scripts/gsc-local.ts "Páginas.csv" ["Consultas.csv"]');
    console.error("Search Console → Resultados da pesquisa → Exportar → CSV (o ZIP traz os dois).");
    process.exit(1);
  }
  for (const a of args) if (!existsSync(a)) { console.error(`Arquivo não encontrado: ${a}`); process.exit(1); }

  const paginas = leGsc(readFileSync(args[0], "utf8"));
  const locais = paginas.filter((p) => cluster(p.url));
  const totalCliques = paginas.reduce((s, p) => s + p.cliques, 0);
  const totalImpr = paginas.reduce((s, p) => s + p.impressoes, 0);
  const locCliques = locais.reduce((s, p) => s + p.cliques, 0);
  const locImpr = locais.reduce((s, p) => s + p.impressoes, 0);

  console.log("=".repeat(96));
  console.log("SEO LOCAL — SEARCH CONSOLE");
  console.log("=".repeat(96));
  console.log(`${locais.length} de ${paginas.length} páginas do export são de bairro ou cidade.`);
  console.log(`Elas somam ${locCliques} cliques (${arred((100 * locCliques) / (totalCliques || 1))}% do site)`
    + ` e ${locImpr} impressões (${arred((100 * locImpr) / (totalImpr || 1))}%).`);
  if (!locais.length) { console.log("\nNenhuma página local no export."); return; }

  // ─── 1. Por cluster ───────────────────────────────────────────────────────
  console.log("\n" + "-".repeat(96));
  console.log("1. POR BAIRRO — quantas páginas disputam o mesmo lugar");
  console.log("-".repeat(96));
  console.log("bairro".padEnd(22) + pad("págs", 6) + pad("cliques", 9) + pad("impr", 9)
    + pad("CTR", 8) + pad("posição", 9) + "  melhor página");
  const porCluster = new Map<string, Linha[]>();
  for (const p of locais) {
    const c = cluster(p.url)!;
    porCluster.set(c, [...(porCluster.get(c) ?? []), p]);
  }
  for (const [nome, ps] of [...porCluster].sort((a, b) =>
    b[1].reduce((s, p) => s + p.impressoes, 0) - a[1].reduce((s, p) => s + p.impressoes, 0))) {
    const cl = ps.reduce((s, p) => s + p.cliques, 0);
    const im = ps.reduce((s, p) => s + p.impressoes, 0);
    /* Posição do cluster é média ponderada por impressão: a página que aparece mais pesa mais. */
    const pos = im ? ps.reduce((s, p) => s + p.posicao * p.impressoes, 0) / im : 0;
    const melhor = [...ps].sort((a, b) => b.cliques - a.cliques || a.posicao - b.posicao)[0];
    console.log(nome.padEnd(22) + pad(ps.length, 6) + pad(cl, 9) + pad(im, 9)
      + pad(arred(im ? (100 * cl) / im : 0, 2) + "%", 8) + pad(arred(pos), 9)
      + "  " + caminho(melhor.url));
  }

  // ─── 2. Página a página ───────────────────────────────────────────────────
  console.log("\n" + "-".repeat(96));
  console.log("2. PÁGINA A PÁGINA — ordenado por impressão");
  console.log("-".repeat(96));
  console.log("página".padEnd(50) + pad("cliq", 6) + pad("impr", 8) + pad("CTR", 8)
    + pad("esper", 7) + pad("pos", 6) + "  leitura");
  for (const p of [...locais].sort((a, b) => b.impressoes - a.impressoes)) {
    const esp = ctrEsperado(p.posicao);
    console.log(caminho(p.url).padEnd(50).slice(0, 50) + pad(p.cliques, 6) + pad(p.impressoes, 8)
      + pad(arred(p.ctr, 2) + "%", 8) + pad(arred(esp, 1) + "%", 7) + pad(arred(p.posicao), 6)
      + "  " + diagnostico(p, esp));
  }

  // ─── 3. O que fazer primeiro ──────────────────────────────────────────────
  console.log("\n" + "-".repeat(96));
  console.log("3. O QUE RENDE MAIS SE MEXER");
  console.log("-".repeat(96));

  const MIN = 30; /* abaixo de 30 impressões, a diferença é acaso e não sinal */
  const titulo = locais.filter((p) => p.impressoes >= MIN && p.posicao <= 10 && p.ctr < ctrEsperado(p.posicao) * 0.6)
    .sort((a, b) => b.impressoes * (ctrEsperado(b.posicao) - b.ctr) - a.impressoes * (ctrEsperado(a.posicao) - a.ctr));
  const ranking = locais.filter((p) => p.impressoes >= MIN && p.posicao > 10 && p.posicao <= 25)
    .sort((a, b) => b.impressoes - a.impressoes);

  bloco("TÍTULO E DESCRIPTION — já está na primeira página e não clicam", titulo, (p) => {
    const ganho = Math.round((p.impressoes * (ctrEsperado(p.posicao) - p.ctr)) / 100);
    return `pos ${arred(p.posicao)}, ${arred(p.ctr, 2)}% contra ${arred(ctrEsperado(p.posicao))}% — cabem ~${ganho} cliques/período`;
  });
  bloco("CONTEÚDO E LINK INTERNO — tem demanda e está na segunda página", ranking,
    (p) => `pos ${arred(p.posicao)}, ${p.impressoes} impressões, ${p.cliques} clique${p.cliques === 1 ? "" : "s"}`);

  const brigando = [...porCluster].filter(([, ps]) => ps.filter((p) => p.impressoes >= MIN).length >= 3);
  if (brigando.length) {
    console.log("\nCANIBALIZAÇÃO — bairros com 3+ páginas aparecendo ao mesmo tempo");
    for (const [nome, ps] of brigando) {
      const rel = ps.filter((p) => p.impressoes >= MIN).sort((a, b) => b.impressoes - a.impressoes);
      console.log(`\n  ${nome}: ${rel.length} páginas`);
      for (const p of rel) console.log(`    ${pad(p.impressoes, 7)} impr  pos ${pad(arred(p.posicao), 5)}  ${caminho(p.url)}`);
      console.log("    → decidir qual é a principal e fazer as outras apontarem para ela.");
    }
  }

  // ─── 4. Consultas, se veio o segundo arquivo ──────────────────────────────
  if (args[1]) {
    const consultas = leGsc(readFileSync(args[1], "utf8"), "Consulta").filter((c) => cluster(c.url));
    console.log("\n" + "-".repeat(96));
    console.log("4. BUSCAS LOCAIS — o que digitam para chegar aqui");
    console.log("-".repeat(96));
    console.log("busca".padEnd(50) + pad("cliq", 6) + pad("impr", 8) + pad("CTR", 8) + pad("pos", 6));
    for (const c of [...consultas].sort((a, b) => b.impressoes - a.impressoes).slice(0, 30)) {
      console.log(c.url.padEnd(50).slice(0, 50) + pad(c.cliques, 6) + pad(c.impressoes, 8)
        + pad(arred(c.ctr, 2) + "%", 8) + pad(arred(c.posicao), 6));
    }
  }

  console.log("\n" + "-".repeat(96));
  console.log(`"esper" é o CTR médio de quem está naquela posição. Abaixo dele com posição boa`);
  console.log("é problema de título; posição ruim com CTR bom é problema de ranking.");
  console.log(`Linhas com menos de ${MIN} impressões ficam fora das recomendações: é acaso, não sinal.`);
  console.log("");
}

function caminho(url: string): string {
  try { return new URL(url).pathname; } catch { return url; }
}

function diagnostico(p: Linha, esp: number): string {
  if (p.impressoes < 30) return "pouca amostra";
  if (p.posicao <= 10 && p.ctr < esp * 0.6) return "título fraco";
  if (p.posicao > 30) return "fora do radar";
  if (p.posicao > 20) return "3ª página";
  if (p.posicao > 10) return "2ª página";
  if (p.ctr > esp * 1.4) return "acima da curva";
  return "ok";
}

function bloco(titulo: string, linhas: Linha[], detalhe: (p: Linha) => string) {
  console.log(`\n${titulo}`);
  if (!linhas.length) { console.log("  (nenhuma página nessa situação)"); return; }
  for (const p of linhas.slice(0, 10)) console.log(`  ${caminho(p.url)}\n      ${detalhe(p)}`);
}

if (require.main === module) main();
