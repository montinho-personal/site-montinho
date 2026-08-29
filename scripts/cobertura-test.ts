/**
 * A regra de cobertura de ferramentas.
 *   npx tsx scripts/cobertura-test.ts
 * Sai com código 1 se algo falhar.
 *
 * Este teste existe por causa de uma falha real: sete artigos publicados em
 * dois dias, nenhum com ferramenta, e não por decisão — por esquecimento. O
 * teste transforma a pergunta "esse artigo pede ferramenta?" em algo que o
 * build faz por conta própria, em vez de depender de alguém lembrar.
 *
 * Ele NÃO obriga ferramenta em todo artigo. Obriga DECISÃO: ou o artigo
 * está num registro, ou está na lista de dispensados com o motivo escrito.
 */

import { blogPosts } from "../lib/blog";
import {
  ARTIGOS_SEM_FERRAMENTA,
  DATA_DA_REGRA,
  SLUGS_SEM_FERRAMENTA,
} from "../lib/ferramentas/cobertura";
import { CAMINHO_POR_ARTIGO } from "../lib/ferramentas/comece-artigos";
import { ARTIGOS_COM_CALCULADORA } from "../lib/proteina";
import { ARTIGOS_COM_CALCULADORA_CARDAPIO } from "../lib/cardapio/motor";
import { ARTIGOS_COM_CALCULADORA_TDEE } from "../lib/tdee";
import { ARTIGOS_COM_CALCULADORA_DEFICIT } from "../lib/calorias";
import { ARTIGOS_COM_CALCULADORA_1RM, ARTIGOS_COM_LINK_1RM } from "../lib/onerm";
import { ARTIGOS_COM_CALCULADORA_MACROS } from "../lib/macros";
import { ARTIGOS_COM_CALCULADORA_VOLUME, ARTIGOS_COM_LINK_VOLUME } from "../lib/treino/volume";
import { SLUGS_COM_TESTE_MOBILIDADE } from "../lib/mobilidade/artigos";

let falhas = 0;
function check(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

/** Onde cada artigo está coberto, e por qual registro. */
const REGISTROS: [string, string[]][] = [
  ["proteína", ARTIGOS_COM_CALCULADORA],
  ["cardápio", ARTIGOS_COM_CALCULADORA_CARDAPIO],
  ["TMB/TDEE", ARTIGOS_COM_CALCULADORA_TDEE],
  ["déficit", ARTIGOS_COM_CALCULADORA_DEFICIT],
  ["1RM", ARTIGOS_COM_CALCULADORA_1RM],
  ["1RM (link)", ARTIGOS_COM_LINK_1RM],
  ["macros", ARTIGOS_COM_CALCULADORA_MACROS],
  ["volume", ARTIGOS_COM_CALCULADORA_VOLUME],
  ["volume (link)", ARTIGOS_COM_LINK_VOLUME],
  ["mobilidade", SLUGS_COM_TESTE_MOBILIDADE],
];

const onde = new Map<string, string>();
for (const [nome, lista] of REGISTROS) for (const s of lista) onde.set(s, nome);
for (const s of Object.keys(CAMINHO_POR_ARTIGO)) {
  // O caminho não é ferramenta, mas é uma decisão editorial deliberada sobre
  // o que oferecer no fim do artigo — e cumpre a regra pelo mesmo motivo.
  if (!onde.has(s)) onde.set(s, "caminho");
}

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. TODO ARTIGO NOVO PASSOU POR UMA DECISÃO");

const novos = blogPosts.filter((p) => p.date >= DATA_DA_REGRA);
check(`existem artigos sob a regra (a partir de ${DATA_DA_REGRA})`, novos.length > 0,
  `${novos.length}`);

const semDecisao = novos.filter(
  (p) => !onde.has(p.slug) && !SLUGS_SEM_FERRAMENTA.includes(p.slug),
);
check(
  "nenhum artigo novo ficou sem decisão de ferramenta",
  semDecisao.length === 0,
  semDecisao.length
    ? `\n\n     ${semDecisao.length} artigo(s) sem decisão:\n` +
      semDecisao.map((p) => `       • ${p.slug}`).join("\n") +
      "\n\n     Registre cada um numa ferramenta OU em ARTIGOS_SEM_FERRAMENTA\n" +
      "     (lib/ferramentas/cobertura.ts) com o motivo escrito.\n"
    : "",
);

console.log("\n  Situação dos artigos sob a regra:");
for (const p of novos) {
  const destino = onde.get(p.slug) ?? (SLUGS_SEM_FERRAMENTA.includes(p.slug) ? "dispensado" : "SEM DECISÃO");
  console.log(`    ${destino.padEnd(15)} ${p.slug}`);
}

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. A LISTA DE DISPENSADOS É HONESTA");

check("todo artigo dispensado existe de verdade",
  SLUGS_SEM_FERRAMENTA.every((s) => blogPosts.some((p) => p.slug === s)),
  SLUGS_SEM_FERRAMENTA.filter((s) => !blogPosts.some((p) => p.slug === s)).join(", "));

/**
 * O motivo precisa ser um motivo, não um "não coube". Vinte caracteres
 * bastariam para escrever "não precisa" — daí o piso alto.
 */
const motivosCurtos = Object.entries(ARTIGOS_SEM_FERRAMENTA).filter(([, m]) => m.length < 80);
check("todo dispensado explica o porquê com uma frase de verdade",
  motivosCurtos.length === 0,
  motivosCurtos.map(([s]) => s).join(", "));

const dispensadoEmRegistro = SLUGS_SEM_FERRAMENTA.filter((s) => onde.has(s));
check("nenhum artigo está dispensado E num registro ao mesmo tempo",
  dispensadoEmRegistro.length === 0, dispensadoEmRegistro.join(", "));

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. A REGRA DE UMA FERRAMENTA POR ARTIGO CONTINUA VALENDO");

const contagem = new Map<string, string[]>();
for (const [nome, lista] of REGISTROS)
  for (const s of lista) contagem.set(s, [...(contagem.get(s) ?? []), nome]);
const duplicados = [...contagem].filter(([, regs]) => regs.length > 1);
check("nenhum artigo aparece em dois registros de ferramenta",
  duplicados.length === 0,
  duplicados.map(([s, r]) => `${s} (${r.join(" + ")})`).join(", "));

const todosSlugs = new Set(blogPosts.map((p) => p.slug));
const fantasmas = REGISTROS.flatMap(([nome, lista]) =>
  lista.filter((s) => !todosSlugs.has(s)).map((s) => `${nome}: ${s}`));
check("nenhum registro aponta para artigo inexistente", fantasmas.length === 0, fantasmas.join(", "));

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. COBERTURA GERAL DO ACERVO");

const cobertos = blogPosts.filter((p) => onde.has(p.slug)).length;
console.log(`  ${cobertos} de ${blogPosts.length} artigos com ferramenta ou caminho ` +
  `(${((cobertos / blogPosts.length) * 100).toFixed(1)}%)`);
console.log("\n  Por registro:");
for (const [nome, lista] of REGISTROS) console.log(`    ${String(lista.length).padStart(3)}  ${nome}`);
console.log(`    ${String(Object.keys(CAMINHO_POR_ARTIGO).length).padStart(3)}  caminho`);
console.log(`    ${String(SLUGS_SEM_FERRAMENTA.length).padStart(3)}  dispensados por decisão`);

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
