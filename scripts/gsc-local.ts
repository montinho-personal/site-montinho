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
 * Search Console → Resultados da pesquisa → Exportar. Serve tanto o .xlsx
 * quanto o ZIP de CSVs, e a diferença entre os dois não é cosmética.
 *
 * O .xlsx guarda número como número: CTR 0,0249 e posição 11,46, cru. O CSV
 * exporta em pt-BR: "1.234" impressões, "11,4" de posição, "1,23%" de CTR.
 * Number("1.234") devolve 1,234 — mil vezes menos, sem erro nenhum. Por isso
 * o .xlsx é o caminho preferido, e o parse do CSV recusa campo ilegível em
 * vez de deixá-lo virar zero.
 *
 * O CTR também muda de escala entre os dois: fração no xlsx, percentual no
 * CSV. Normalizar isso na entrada é obrigatório — 0,0249 lido como 2,49% e
 * comparado com uma régua em percentual inverteria todo o diagnóstico.
 *
 * MARCO E COMPARAÇÃO
 *
 *   npx tsx scripts/gsc-local.ts export.xlsx --salvar
 *
 * grava o recorte local em data/analytics/gsc-local/<data-fim>.json. Nas
 * execuções seguintes, o relatório compara com o marco anterior e mostra o
 * que mudou nas páginas vigiadas — porque a decisão de 03/09/2026 foi "deixar
 * como está e vigiar", e vigiar sem comparação é reler o mesmo número.
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { leZip, leTextos, leePlanilha } from "./lib-xlsx";

export const PASTA_MARCOS = "data/analytics/gsc-local";

/**
 * As páginas que a decisão de 03/09/2026 mandou vigiar, e por quê. Cada uma
 * responde uma pergunta específica; o relatório mostra a variação delas
 * antes de qualquer outra coisa.
 */
export const VIGIADAS: Array<[string, string]> = [
  ["/personal-trainer-alphaville", "a página que vende, na posição 32,6 — canibalizada por 18 irmãs"],
  ["/personal-trainer-tambore", "a maior de Tamboré (230 impr) — se cair, o termo esfria de vez"],
  ["/personal-trainer-barueri", "comercial de Barueri, 2ª página (14,3)"],
  ["/blog/obox-training-club-santana-de-parnaiba", "posição 2,3 com CTR de 3ª página — título fraco"],
  ["/blog/bluefit-alphaville", "artigo que ranqueia no lugar da comercial (9,0)"],
  ["/blog/10-melhores-academias-de-alphaville", "artigo que ranqueia no lugar da comercial (6,1)"],
];

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

/**
 * Planilha do Search Console: aba "Páginas" ou "Consultas".
 * Aqui não há parse de locale — o Excel guardou os números como números.
 */
export function leXlsx(caminho: string, aba: "Páginas" | "Consultas"): Linha[] {
  const zip = leZip(caminho);
  const textos = leTextos(zip.get("xl/sharedStrings.xml") ?? "");
  const wb = zip.get("xl/workbook.xml") ?? "";
  const nomes = [...wb.matchAll(/<sheet[^>]*name="([^"]+)"/g)].map((m) => m[1]);
  const i = nomes.indexOf(aba);
  if (i < 0) throw new Error(`A planilha não tem a aba "${aba}". Abas: ${nomes.join(" | ")}`);
  const xml = zip.get(`xl/worksheets/sheet${i + 1}.xml`);
  if (!xml) throw new Error(`Não achei a aba ${i + 1} dentro do arquivo.`);

  const linhas = [...leePlanilha(xml, textos).entries()].sort((a, b) => a[0] - b[0]);
  const saida: Linha[] = [];
  for (const [n, cels] of linhas) {
    if (n === 1) continue; /* cabeçalho */
    const col = (c: string) => cels.get(c)?.texto ?? "";
    const url = col("A").trim();
    if (!url) continue;
    const numero = (c: string) => {
      const v = Number(col(c));
      if (!Number.isFinite(v)) throw new Error(`Célula ${c}${n} ilegível: "${col(c)}"`);
      return v;
    };
    /* CTR vem como fração (0,0249). A régua e o relatório trabalham em %. */
    saida.push({ url, cliques: numero("B"), impressoes: numero("C"), ctr: numero("D") * 100, posicao: numero("E") });
  }
  return saida;
}

const arred = (n: number, c = 1) => Math.round(n * 10 ** c) / 10 ** c;
const pad = (s: string | number, n: number) => String(s).padStart(n);

export interface Marco {
  periodo: string;
  /** Só o recorte local: é o que este relatório vigia. */
  locais: Array<{ url: string; cliques: number; impressoes: number; ctr: number; posicao: number }>;
  clusters: Record<string, { paginas: number; cliques: number; impressoes: number; posicao: number }>;
  /** Os números de decisão, para a comparação não depender de recomputar tudo. */
  chaves: {
    tamboreNumerados: { paginas: number; impressoes: number; cliques: number };
    alphavilleResidenciais: { paginas: number; impressoes: number; cliques: number };
    locaisSemClique: number;
  };
}

/** "24 de jun. de 2026-2 de set. de 2026" → "2026-09-02". Sem a aba Filtros, usa hoje. */
export function dataFimDoExport(caminho: string): string {
  try {
    const zip = leZip(caminho);
    const textos = leTextos(zip.get("xl/sharedStrings.xml") ?? "");
    const wb = zip.get("xl/workbook.xml") ?? "";
    const nomes = [...wb.matchAll(/<sheet[^>]*name="([^"]+)"/g)].map((m) => m[1]);
    const i = nomes.indexOf("Filtros");
    const xml = i >= 0 ? zip.get(`xl/worksheets/sheet${i + 1}.xml`) : undefined;
    if (!xml) throw new Error("sem aba Filtros");
    const linhas = [...leePlanilha(xml, textos).values()];
    const data = linhas.map((l) => l.get("B")?.texto ?? "").find((t) => /\d{4}\s*$/.test(t)) ?? "";
    const MES: Record<string, string> = { jan: "01", fev: "02", mar: "03", abr: "04", mai: "05", jun: "06",
      jul: "07", ago: "08", set: "09", out: "10", nov: "11", dez: "12" };
    const fim = data.split("-").pop()!.trim();
    const m = fim.match(/(\d{1,2}) de (\w{3})\.? de (\d{4})/);
    if (!m) throw new Error(`data ilegível: "${data}"`);
    return `${m[3]}-${MES[m[2].toLowerCase()]}-${m[1].padStart(2, "0")}`;
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function montaMarco(periodo: string, locais: Linha[]): Marco {
  const porCluster = new Map<string, Linha[]>();
  for (const p of locais) porCluster.set(cluster(p.url)!, [...(porCluster.get(cluster(p.url)!) ?? []), p]);
  const clusters: Marco["clusters"] = {};
  for (const [nome, ps] of porCluster) {
    const im = ps.reduce((s, p) => s + p.impressoes, 0);
    clusters[nome] = {
      paginas: ps.length,
      cliques: ps.reduce((s, p) => s + p.cliques, 0),
      impressoes: im,
      posicao: im ? arred(ps.reduce((s, p) => s + p.posicao * p.impressoes, 0) / im) : 0,
    };
  }
  const soma = (ps: Linha[]) => ({
    paginas: ps.length,
    impressoes: ps.reduce((s, p) => s + p.impressoes, 0),
    cliques: ps.reduce((s, p) => s + p.cliques, 0),
  });
  return {
    periodo,
    locais: locais.map((p) => ({ ...p, url: caminho(p.url), ctr: arred(p.ctr, 2), posicao: arred(p.posicao) })),
    clusters,
    chaves: {
      tamboreNumerados: soma(locais.filter((p) => /tambore-\d/.test(p.url))),
      alphavilleResidenciais: soma(locais.filter((p) => /alphaville-residencial-\d/.test(p.url))),
      locaisSemClique: locais.filter((p) => p.cliques === 0).length,
    },
  };
}

export function marcoAnterior(antesDe: string): Marco | null {
  if (!existsSync(PASTA_MARCOS)) return null;
  const arquivos = readdirSync(PASTA_MARCOS).filter((f) => f.endsWith(".json") && f.slice(0, 10) < antesDe).sort();
  if (!arquivos.length) return null;
  return JSON.parse(readFileSync(`${PASTA_MARCOS}/${arquivos[arquivos.length - 1]}`, "utf8"));
}

/** Variação com sinal, no formato de cada métrica. Posição menor é melhor, e a seta diz isso. */
function delta(atual: number, antes: number, tipo: "n" | "pos" | "pct"): string {
  const d = atual - antes;
  if (Math.abs(d) < (tipo === "n" ? 1 : 0.05)) return "=";
  const seta = tipo === "pos" ? (d < 0 ? "↑" : "↓") : (d > 0 ? "↑" : "↓");
  const v = tipo === "n" ? String(Math.abs(Math.round(d))) : arred(Math.abs(d)).toFixed(1) + (tipo === "pct" ? "pp" : "");
  return `${seta}${v}`;
}

export function imprimeComparacao(agora: Marco, antes: Marco) {
  console.log("\n" + "-".repeat(96));
  console.log(`0. O QUE MUDOU DESDE ${antes.periodo}  (decisão de 03/09: deixar como está e vigiar)`);
  console.log("-".repeat(96));
  const acha = (m: Marco, url: string) => m.locais.find((p) => p.url === url);
  console.log("página vigiada".padEnd(46) + pad("posição", 18) + pad("impr", 12) + pad("cliques", 12) + "  por quê");
  for (const [url, motivo] of VIGIADAS) {
    const a = acha(agora, url), b = acha(antes, url);
    if (!a && !b) continue;
    const pos = a && b ? `${b.posicao}→${a.posicao} ${delta(a.posicao, b.posicao, "pos")}` : a ? `nova ${a.posicao}` : "sumiu";
    const im = a && b ? `${a.impressoes} ${delta(a.impressoes, b.impressoes, "n")}` : String(a?.impressoes ?? "—");
    const cl = a && b ? `${a.cliques} ${delta(a.cliques, b.cliques, "n")}` : String(a?.cliques ?? "—");
    console.log(url.padEnd(46).slice(0, 46) + pad(pos, 18) + pad(im, 12) + pad(cl, 12) + "  " + motivo);
  }

  console.log("\nbairro".padEnd(23) + pad("págs", 8) + pad("impr", 14) + pad("cliques", 12) + pad("posição", 16));
  for (const nome of Object.keys(agora.clusters)) {
    const a = agora.clusters[nome], b = antes.clusters[nome];
    if (!b) { console.log(nome.padEnd(22) + pad(a.paginas, 8) + pad(a.impressoes, 14) + pad(a.cliques, 12) + pad(a.posicao, 16) + "  novo"); continue; }
    console.log(nome.padEnd(22) + pad(`${a.paginas} ${delta(a.paginas, b.paginas, "n")}`, 8)
      + pad(`${a.impressoes} ${delta(a.impressoes, b.impressoes, "n")}`, 14)
      + pad(`${a.cliques} ${delta(a.cliques, b.cliques, "n")}`, 12)
      + pad(`${b.posicao}→${a.posicao} ${delta(a.posicao, b.posicao, "pos")}`, 16));
  }

  const c = agora.chaves, d = antes.chaves;
  console.log("\nA comparação que decidiu não mexer em Tamboré:");
  console.log(`  Tamboré 1, 2, 3…            ${c.tamboreNumerados.paginas} págs  ${c.tamboreNumerados.impressoes} impr ${delta(c.tamboreNumerados.impressoes, d.tamboreNumerados.impressoes, "n")}  ${c.tamboreNumerados.cliques} cliques`);
  console.log(`  Alphaville Residencial 1, 2… ${c.alphavilleResidenciais.paginas} págs  ${c.alphavilleResidenciais.impressoes} impr ${delta(c.alphavilleResidenciais.impressoes, d.alphavilleResidenciais.impressoes, "n")}  ${c.alphavilleResidenciais.cliques} cliques`);
  console.log(`  páginas locais sem clique:   ${c.locaisSemClique} ${delta(c.locaisSemClique, d.locaisSemClique, "n")}`);

  /* Quem mais andou, fora das vigiadas: é onde aparece o que ninguém previu. */
  const vig = new Set(VIGIADAS.map(([u]) => u));
  const movs = agora.locais
    .filter((a) => !vig.has(a.url) && a.impressoes >= 30)
    .map((a) => ({ a, b: acha(antes, a.url) }))
    .filter((x): x is { a: Marco["locais"][number]; b: Marco["locais"][number] } => !!x.b && x.b.impressoes >= 30)
    .map((x) => ({ ...x, d: x.a.posicao - x.b.posicao }))
    .filter((x) => Math.abs(x.d) >= 3)
    .sort((x, y) => Math.abs(y.d) - Math.abs(x.d))
    .slice(0, 8);
  if (movs.length) {
    console.log("\nMaiores movimentos de posição fora da lista (≥3 posições, ≥30 impr nos dois períodos):");
    for (const { a, b, d } of movs) console.log(`  ${d < 0 ? "↑" : "↓"} ${pad(Math.abs(arred(d)), 5)}  ${b.posicao}→${a.posicao}  ${a.url}`);
  }
  console.log("\nPeríodos de tamanhos diferentes distorcem impressões e cliques; posição e CTR comparam direto.");
}

function main() {
  const todos = process.argv.slice(2);
  const salvar = todos.includes("--salvar");
  const args = todos.filter((a) => a !== "--salvar");
  if (!args.length) {
    console.error("Uso: npx tsx scripts/gsc-local.ts <export do Search Console>");
    console.error('  planilha:  npx tsx scripts/gsc-local.ts "PerformanceonSearch.xlsx"');
    console.error('  csv:       npx tsx scripts/gsc-local.ts "Páginas.csv" ["Consultas.csv"]');
    console.error("  --salvar   grava este export como marco em data/analytics/gsc-local/");
    process.exit(1);
  }
  for (const a of args) if (!existsSync(a)) { console.error(`Arquivo não encontrado: ${a}`); process.exit(1); }

  const ehXlsx = args[0].toLowerCase().endsWith(".xlsx");
  const paginas = ehXlsx ? leXlsx(args[0], "Páginas") : leGsc(readFileSync(args[0], "utf8"));
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

  const periodo = ehXlsx ? dataFimDoExport(args[0]) : new Date().toISOString().slice(0, 10);
  const marco = montaMarco(periodo, locais);
  const anterior = marcoAnterior(periodo);
  if (anterior) imprimeComparacao(marco, anterior);
  else console.log(`\n(sem marco anterior a ${periodo} em ${PASTA_MARCOS}; rode com --salvar para este virar o primeiro)`);

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
  /* A planilha traz as duas abas no mesmo arquivo; o CSV precisa do segundo. */
  const brutasConsultas = ehXlsx ? leXlsx(args[0], "Consultas")
    : args[1] ? leGsc(readFileSync(args[1], "utf8"), "Consulta") : null;
  if (brutasConsultas) {
    const consultas = brutasConsultas.filter((c) => cluster(c.url));
    console.log("\n" + "-".repeat(96));
    console.log("4. BUSCAS LOCAIS — o que digitam para chegar aqui");
    console.log("-".repeat(96));
    console.log("busca".padEnd(50) + pad("cliq", 6) + pad("impr", 8) + pad("CTR", 8) + pad("pos", 6));
    for (const c of [...consultas].sort((a, b) => b.impressoes - a.impressoes).slice(0, 30)) {
      console.log(c.url.padEnd(50).slice(0, 50) + pad(c.cliques, 6) + pad(c.impressoes, 8)
        + pad(arred(c.ctr, 2) + "%", 8) + pad(arred(c.posicao), 6));
    }
  }

  if (salvar) {
    mkdirSync(PASTA_MARCOS, { recursive: true });
    const destino = `${PASTA_MARCOS}/${periodo}.json`;
    writeFileSync(destino, JSON.stringify(marco, null, 1) + "\n");
    console.log(`\nMarco gravado: ${destino} (${marco.locais.length} páginas locais).`);
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
