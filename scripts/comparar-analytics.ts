/**
 * Compara um export novo do GA4 contra a linha de base guardada.
 *
 *   npx tsx scripts/comparar-analytics.ts caminho/para/Paginas-e-telas.csv
 *
 * POR QUE ESTE SCRIPT EXISTE
 *
 * Em 02/09/2026 três coisas aconteceram quase juntas: os vídeos foram para o
 * fim dos artigos, a sticky bar entrou no ar e o bloco pós-resultado das
 * ferramentas subiu. Sem uma foto do "antes", nenhuma delas teria como ser
 * julgada depois — a memória de quanto era o tempo de leitura some, e sobra
 * opinião.
 *
 * A HIPÓTESE EM TESTE
 *
 * Artigos de execução ("como fazer X") tinham tempo de leitura MUITO menor
 * que os demais: 13,1 s contra 36,3 s de mediana. A leitura é que quem busca
 * "como fazer" quer ver o movimento, não ler sobre ele — e que jogar o vídeo
 * para o fim pode ter piorado justamente essas páginas.
 *
 * Este script não decide nada. Ele coloca os dois períodos lado a lado e
 * mostra a distância, separando artigo de execução dos demais, que é a única
 * quebra que interessa para a hipótese.
 */

import { readFileSync, existsSync } from "node:fs";
import { blogPosts } from "../lib/blog";
import { artigoDeExecucao } from "../lib/revisao";

const BASE = "data/analytics/baseline-2026-09-02.json";

interface Artigo {
  usuarios: number;
  visualizacoes: number;
  segundos: number;
  conversoes: number;
  execucao: boolean;
}
interface Baseline {
  periodo: { inicio: string; fim: string; dias: number };
  observacao: string;
  artigos: Record<string, Artigo>;
}

/** CSV com aspas: o caminho de uma página pode conter vírgula. */
function csv(texto: string): string[][] {
  const linhas: string[][] = [];
  let campo = "";
  let linha: string[] = [];
  let aspas = false;
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

function leExport(caminho: string): Record<string, Artigo> {
  const linhas = csv(readFileSync(caminho, "utf8")).filter((l) => l[0] && !l[0].startsWith("#"));
  const cab = linhas[0];
  const iU = cab.indexOf("Usuários ativos");
  const iT = cab.indexOf("Tempo médio de engajamento por usuário ativo");
  const iC = cab.indexOf("Eventos principais");
  const iV = cab.indexOf("Visualizações");
  if (iU < 0 || iT < 0) {
    console.error("Este CSV não parece ser o relatório de Páginas e telas.");
    console.error("Colunas encontradas:", cab.join(" | "));
    process.exit(1);
  }
  const execucao = new Set(blogPosts.filter((p) => artigoDeExecucao(p)).map((p) => p.slug));
  const saida: Record<string, Artigo> = {};
  for (const l of linhas.slice(1)) {
    if (!l[0]?.startsWith("/blog/")) continue;
    const slug = l[0].slice(6);
    saida[slug] = {
      usuarios: +l[iU], visualizacoes: +l[iV],
      segundos: Math.round(+l[iT] * 10) / 10,
      conversoes: +l[iC], execucao: execucao.has(slug),
    };
  }
  return saida;
}

const mediana = (a: number[]) => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};
const sinal = (n: number, casas = 1) => (n >= 0 ? "+" : "") + n.toFixed(casas);

function bloco(t: string) {
  console.log("\n" + "=".repeat(70) + "\n" + t + "\n" + "=".repeat(70));
}

// ─────────────────────────────────────────────────────────────────────────────

const caminho = process.argv[2];
if (!caminho || !existsSync(caminho)) {
  console.error("Uso: npx tsx scripts/comparar-analytics.ts <Páginas e telas.csv>");
  console.error("Exporte em Relatórios → Ver o engajamento e a retenção → Páginas e telas.");
  process.exit(1);
}
if (!existsSync(BASE)) {
  console.error(`Linha de base não encontrada em ${BASE}`);
  process.exit(1);
}

const base: Baseline = JSON.parse(readFileSync(BASE, "utf8"));
const novo = leExport(caminho);

bloco("PERÍODOS");
console.log(`  base:  ${base.periodo.inicio} a ${base.periodo.fim} (${base.periodo.dias} dias, ${Object.keys(base.artigos).length} artigos)`);
console.log(`  novo:  ${caminho} (${Object.keys(novo).length} artigos)`);
console.log(`  nota:  ${base.observacao}`);

// ─── A hipótese ──────────────────────────────────────────────────────────────
bloco("HIPÓTESE: ARTIGO DE EXECUÇÃO PRENDE MENOS QUE OS DEMAIS");

const MIN = 3; /* menos que isso é ruído, não amostra */
function grupo(fonte: Record<string, Artigo>, exec: boolean) {
  return Object.values(fonte).filter((a) => a.execucao === exec && a.usuarios >= MIN);
}
console.log(`  (só artigos com ${MIN}+ usuários)\n`);
console.log(`  ${"grupo".padEnd(24)}${"base".padStart(10)}${"novo".padStart(10)}${"diferença".padStart(12)}`);
for (const [rotulo, exec] of [["execução", true], ["demais artigos", false]] as const) {
  const b = mediana(grupo(base.artigos, exec).map((a) => a.segundos));
  const n = mediana(grupo(novo, exec).map((a) => a.segundos));
  console.log(`  ${(rotulo + " (mediana s)").padEnd(24)}${b.toFixed(1).padStart(10)}${n.toFixed(1).padStart(10)}${sinal(n - b).padStart(12)}`);
}
{
  const be = mediana(grupo(base.artigos, true).map((a) => a.segundos));
  const bo = mediana(grupo(base.artigos, false).map((a) => a.segundos));
  const ne = mediana(grupo(novo, true).map((a) => a.segundos));
  const no = mediana(grupo(novo, false).map((a) => a.segundos));
  console.log(`\n  distância entre os grupos: era ${(bo - be).toFixed(1)}s, agora ${(no - ne).toFixed(1)}s`);
  const veredicto =
    ne > be * 1.25 ? "os artigos de execução MELHORARAM — a hipótese perde força"
    : ne < be * 0.8 ? "os artigos de execução PIORARAM — o vídeo no fim é suspeito nº 1"
    : "sem mudança relevante — hipótese segue aberta, esperar mais dados";
  console.log(`  leitura: ${veredicto}`);
}

// ─── Artigo a artigo ─────────────────────────────────────────────────────────
bloco("OS ARTIGOS DE EXECUÇÃO, UM A UM");
const execs = Object.entries(base.artigos)
  .filter(([, a]) => a.execucao && a.usuarios >= MIN)
  .sort((a, b) => b[1].usuarios - a[1].usuarios);
console.log(`  ${"artigo".padEnd(40)}${"seg base".padStart(10)}${"seg novo".padStart(10)}${"dif".padStart(9)}${"usuários".padStart(10)}`);
for (const [slug, b] of execs) {
  const n = novo[slug];
  const seg = n ? n.segundos.toFixed(1).padStart(10) : "sem dado".padStart(10);
  const dif = n ? sinal(n.segundos - b.segundos).padStart(9) : "—".padStart(9);
  const us = n ? `${b.usuarios} → ${n.usuarios}`.padStart(10) : String(b.usuarios).padStart(10);
  console.log(`  ${slug.slice(0, 39).padEnd(40)}${b.segundos.toFixed(1).padStart(10)}${seg}${dif}${us}`);
}

// ─── Conversão ───────────────────────────────────────────────────────────────
bloco("CONVERSÃO DO BLOG");
for (const [rotulo, fonte] of [["base", base.artigos], ["novo", novo]] as const) {
  const todos = Object.values(fonte);
  const u = todos.reduce((s, a) => s + a.usuarios, 0);
  const c = todos.reduce((s, a) => s + a.conversoes, 0);
  console.log(`  ${rotulo}: ${todos.length} artigos, ${u} usuários somados, ${c} eventos de conversão (${u ? (100 * c / u).toFixed(1) : "0"} por 100 usuários)`);
}
console.log("\n  Lembrete: a coluna do GA4 conta EVENTOS, não pessoas. Em página com");
console.log("  poucos usuários, duas pessoas clicando várias vezes viram uma taxa falsa.");

console.log("");
