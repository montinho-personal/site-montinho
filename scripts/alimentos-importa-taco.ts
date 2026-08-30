/**
 * Importação da TACO.
 *   npx tsx scripts/alimentos-importa-taco.ts
 *
 * Lê data/alimentos/bruto/taco-4a-edicao.xlsx (nunca editado à mão) e escreve
 * data/alimentos/processado/taco.json. O bruto entra, o processado sai, e o
 * caminho entre os dois está inteiro neste arquivo — é isso que torna a
 * importação reproduzível: rodar de novo com o mesmo bruto dá o mesmo
 * resultado, e qualquer decisão de normalização é visível aqui em vez de ter
 * acontecido uma vez na mão de alguém.
 *
 * Nada é consertado em silêncio. Linha com problema é RECUSADA e listada no
 * relatório final, com o motivo.
 */

import { writeFileSync } from "node:fs";
import { leZip, leTextos, leePlanilha, type Linha } from "./lib-xlsx";
import { NUTRIENTE_POR_ID } from "../lib/alimentos/nutrientes";
import {
  conferenciaEnergetica,
  normalizaNegativoResidual,
  podePublicar,
  validaFicha,
  type Problema,
} from "../lib/alimentos/validacao";
import type { Alimento, Categoria, EstadoDado, Preparo, ValorNutriente } from "../lib/alimentos/tipos";

const ENTRADA = "data/alimentos/bruto/taco-4a-edicao.xlsx";
const SAIDA = "data/alimentos/processado/taco.json";

/**
 * A proveniência, agora confirmada na publicação.
 *
 * Por um tempo esta constante descrevia o arquivo em vez da edição, porque as
 * três abas internas da planilha estão rotuladas "taco3" e não dava para
 * afirmar a edição só olhando o arquivo.
 *
 * A ficha catalográfica do PDF oficial resolveu: "4. ed. rev. e ampl. --
 * Campinas: NEPA-UNICAMP, 2011". Os rótulos das abas eram nomes herdados da
 * planilha da edição anterior — e a contagem de 597 alimentos, que bate com a
 * 4ª edição, já apontava para isso.
 */
const VERSAO = "4ª edição revisada e ampliada — Campinas: NEPA-UNICAMP, 2011";
const VERIFICADO_EM = new Date().toISOString().slice(0, 10);

/** Coluna → nutriente. A ordem é a do arquivo, conferida no cabeçalho. */
const COLUNAS: [string, string][] = [
  ["C", "umidade"],
  ["D", "energia"],
  ["E", "energia-kj"],
  ["F", "proteina"],
  ["G", "lipideos"],
  ["H", "colesterol"],
  ["I", "carboidrato"],
  ["J", "fibra"],
  ["K", "cinzas"],
  ["L", "calcio"],
  ["M", "magnesio"],
  ["O", "manganes"],
  ["P", "fosforo"],
  ["Q", "ferro"],
  ["R", "sodio"],
  ["S", "potassio"],
  ["T", "cobre"],
  ["U", "zinco"],
  ["V", "retinol"],
  ["W", "vitamina-a-re"],
  ["X", "vitamina-a-rae"],
  ["Y", "tiamina"],
  ["Z", "riboflavina"],
  ["AA", "piridoxina"],
  ["AB", "niacina"],
  ["AC", "vitamina-c"],
];

const CATEGORIAS: Record<string, Categoria> = {
  "Cereais e derivados": "cereais-e-derivados",
  "Verduras, hortaliças e derivados": "verduras-hortalicas-e-derivados",
  "Frutas e derivados": "frutas-e-derivados",
  "Gorduras e óleos": "gorduras-e-oleos",
  "Pescados e frutos do mar": "pescados-e-frutos-do-mar",
  "Carnes e derivados": "carnes-e-derivados",
  "Leite e derivados": "leite-e-derivados",
  "Bebidas (alcoólicas e não alcoólicas)": "bebidas",
  "Ovos e derivados": "ovos-e-derivados",
  "Produtos açucarados": "produtos-acucarados",
  "Miscelâneas": "miscelaneas",
  "Outros alimentos industrializados": "outros-industrializados",
  "Alimentos preparados": "alimentos-preparados",
  "Leguminosas e derivados": "leguminosas-e-derivados",
  "Nozes e sementes": "nozes-e-sementes",
};

/**
 * Leitura de célula segundo a LEGENDA DA PRÓPRIA TACO:
 *
 *   "Tr"     → traço
 *   "NA"     → não aplicável
 *   "*"      → análise sendo reavaliada pela fonte
 *   em branco → "análises não solicitadas" (a legenda diz isso literalmente)
 *
 * Nenhum dos três vira zero. Essa é a decisão que separa uma tabela honesta
 * de uma que afirma ausência onde só houve silêncio.
 */
function leValor(c: { texto: string; numerico: boolean } | undefined, nutrienteId: string): ValorNutriente {
  const unidade = NUTRIENTE_POR_ID.get(nutrienteId)!.unidade;
  const base = { nutrienteId, unidade };

  if (!c || c.texto === "") return { ...base, valorPor100g: null, estado: "naoDisponivel" };

  const t = c.texto.toLowerCase();
  if (t === "tr") return { ...base, valorPor100g: null, estado: "traco" };
  if (t === "na") return { ...base, valorPor100g: null, estado: "naoAplicavel" };
  /*
   * "*" é o quinto estado, e a legenda o define: "as análises estão sendo
   * reavaliadas". Não é ausência de dado nem zero — é a fonte dizendo que
   * ainda está olhando. O leite de vaca integral inteiro está assim nesta
   * edição, e tratar isso como "não analisado" esconderia que a TACO tem uma
   * posição sobre o assunto.
   */
  if (t === "*") return { ...base, valorPor100g: null, estado: "emReavaliacao" };

  const n = Number(c.texto.replace(/\./g, "").replace(",", "."));
  const direto = Number(c.texto);
  /* Célula numérica do Excel já vem com ponto decimal; texto pode vir com vírgula. */
  const valor = c.numerico && Number.isFinite(direto) ? direto : n;
  if (!Number.isFinite(valor)) {
    return { ...base, valorPor100g: null, estado: "naoDisponivel" };
  }
  return { ...base, valorPor100g: valor, estado: "analisado" as EstadoDado };
}

/** "Arroz, integral, cozido" → "arroz-integral-cozido" */
function fazSlug(desc: string): string {
  return desc
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70)
    .replace(/-+$/g, "");
}

const PREPAROS: [RegExp, Preparo][] = [
  [/\bcozid[ao]s?\b/i, "cozido"],
  [/\bgrelhad[ao]s?\b/i, "grelhado"],
  [/\bassad[ao]s?\b/i, "assado"],
  [/\bfrit[ao]s?\b/i, "frito"],
  [/\brefogad[ao]s?\b/i, "refogado"],
  [/\bcru[ao]?s?\b|\bcrua\b/i, "cru"],
];

function achaPreparo(desc: string): Preparo {
  for (const [re, p] of PREPAROS) if (re.test(desc)) return p;
  return "pronto para consumo";
}

/**
 * Aliases: como as pessoas escrevem, não como a tabela escreve.
 *
 * A TACO usa ordem invertida com vírgulas ("Arroz, integral, cozido") porque
 * é uma tabela ordenada alfabeticamente por ingrediente-base. Ninguém digita
 * assim. Os aliases desfazem a inversão: a descrição sem vírgulas, e o
 * primeiro segmento sozinho — que é justamente o nome popular do alimento
 * ("arroz", "feijão", "banana").
 */
function fazAliases(desc: string): string[] {
  const partes = desc.split(",").map((p) => p.trim()).filter(Boolean);
  const alias = new Set<string>();
  alias.add(desc.replace(/,/g, " ").replace(/\s+/g, " ").trim());
  if (partes.length > 1) {
    alias.add(partes[0]);
    /* "Arroz, integral, cozido" → "arroz integral" (sem o preparo). */
    if (partes.length > 2) alias.add(partes.slice(0, -1).join(" "));
    /* Ordem natural: "integral arroz" não; mas "arroz integral" sim. */
    alias.add(partes.join(" "));
  }
  return [...alias].filter((a) => a.length > 1);
}

// ─── execução ───────────────────────────────────────────────────────────────

const zip = leZip(ENTRADA);
const textos = leTextos(zip.get("xl/sharedStrings.xml") ?? "");
const planilha = leePlanilha(zip.get("xl/worksheets/sheet1.xml") ?? "", textos);

const alimentos: Alimento[] = [];
const recusados: { linha: number; desc: string; motivos: string[] }[] = [];
const avisos: Problema[] = [];
const slugsUsados = new Map<string, number>();

let categoriaAtual: Categoria | null = null;
let linhasVistas = 0;
const negativosResiduais: string[] = [];

const numeros = [...planilha.keys()].sort((a, b) => a - b);
for (const num of numeros) {
  const linha: Linha = planilha.get(num)!;
  const A = linha.get("A")?.texto ?? "";
  const B = linha.get("B")?.texto ?? "";

  /* Cabeçalho de categoria: só a coluna A preenchida, e ela é uma categoria. */
  if (A && CATEGORIAS[A]) { categoriaAtual = CATEGORIAS[A]; continue; }
  /* A legenda vem depois do último alimento e encerra a leitura. */
  if (A === "Legenda") break;
  /* Cabeçalhos repetidos no meio da planilha. */
  if (A === "Alimento" || B === "Descrição dos alimentos" || B === "") continue;
  /* Linha sem energia não é ficha de alimento. */
  if (!linha.get("D")) continue;

  linhasVistas++;

  const brutos = COLUNAS.map(([col, id]) => leValor(linha.get(col), id));
  const nutrientes = brutos.map((v) => {
    const { valor, convertido } = normalizaNegativoResidual(v);
    if (convertido) negativosResiduais.push(`${B} — ${v.nutrienteId} (${v.valorPor100g})`);
    return valor;
  });

  /**
   * O código do alimento na TACO, da coluna A.
   *
   * Ele existe no arquivo como fórmula com valor em cache, e é o
   * identificador que a publicação usa. Só cai para o número da linha quando
   * a célula estiver mesmo vazia — assim a proveniência aponta para o código
   * oficial sempre que ele existir.
   */
  const codigo = linha.get("A")?.texto ?? "";
  const idNaFonte = /^\d+$/.test(codigo) ? `TACO-${codigo}` : `linha-${num}`;

  const problemas = validaFicha({ nome: B, idNaFonte, verificadoEm: VERIFICADO_EM, nutrientes });

  const porId = (id: string) => nutrientes.find((n) => n.nutrienteId === id) ?? null;
  const val = (id: string) => {
    const v = porId(id);
    return v && v.estado === "analisado" ? v.valorPor100g : null;
  };
  problemas.push(
    ...conferenciaEnergetica(val("energia"), val("proteina"), val("carboidrato"), val("lipideos"), idNaFonte),
  );

  if (!categoriaAtual) {
    problemas.push({ gravidade: "erro", onde: idNaFonte, campo: "categoria", mensagem: "alimento fora de qualquer categoria" });
  }

  if (!podePublicar(problemas)) {
    recusados.push({ linha: num, desc: B, motivos: problemas.filter((p) => p.gravidade === "erro").map((p) => `${p.campo}: ${p.mensagem}`) });
    continue;
  }
  avisos.push(...problemas.filter((p) => p.gravidade === "aviso"));

  /* Slug único. Colisão ganha sufixo em vez de sobrescrever silenciosamente. */
  let slug = fazSlug(B);
  const jaVisto = slugsUsados.get(slug);
  if (jaVisto !== undefined) {
    slugsUsados.set(slug, jaVisto + 1);
    slug = `${slug}-${jaVisto + 1}`;
  } else {
    slugsUsados.set(slug, 1);
  }

  alimentos.push({
    id: slug,
    slug,
    nome: B,
    categoria: categoriaAtual!,
    preparo: achaPreparo(B),
    aliases: fazAliases(B),
    nutrientes,
    porcoes: [],
    proveniencia: {
      fonte: "TACO",
      idNaFonte,
      descricaoOriginal: B,
      versao: VERSAO,
      verificadoEm: VERIFICADO_EM,
    },
    /* Ninguém nasce indexável. A promoção é decisão editorial, feita depois. */
    indexavel: false,
  });
}

writeFileSync(SAIDA, JSON.stringify({ versao: VERSAO, importadoEm: VERIFICADO_EM, alimentos }, null, 1) + "\n");

// ─── relatório ──────────────────────────────────────────────────────────────

const linha = "=".repeat(64);
console.log(`\n${linha}\nIMPORTAÇÃO DA TACO\n${linha}`);
console.log(`  entrada          ${ENTRADA}`);
console.log(`  saída            ${SAIDA}`);
console.log(`  versão gravada   ${VERSAO}`);
console.log(`\n  linhas de alimento lidas   ${linhasVistas}`);
console.log(`  importadas                 ${alimentos.length}`);
console.log(`  recusadas                  ${recusados.length}`);
console.log(`  avisos (não bloqueiam)     ${avisos.length}`);
console.log(`  negativos residuais → traço ${negativosResiduais.length}`);

const porCategoria = new Map<string, number>();
for (const a of alimentos) porCategoria.set(a.categoria, (porCategoria.get(a.categoria) ?? 0) + 1);
console.log("\n  Por categoria:");
for (const [c, n] of [...porCategoria].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(4)}  ${c}`);
}

const estados = new Map<EstadoDado, number>();
for (const a of alimentos) for (const v of a.nutrientes) estados.set(v.estado, (estados.get(v.estado) ?? 0) + 1);
console.log("\n  Estado das células (o que seria zero numa tabela ingênua):");
for (const [e, n] of [...estados].sort((a, b) => b[1] - a[1])) {
  console.log(`    ${String(n).padStart(6)}  ${e}`);
}

if (recusados.length) {
  console.log(`\n  RECUSADAS (${recusados.length}):`);
  for (const r of recusados.slice(0, 25)) {
    console.log(`    linha ${r.linha}  ${r.desc.slice(0, 40)}`);
    for (const m of r.motivos.slice(0, 3)) console.log(`        ${m}`);
  }
  if (recusados.length > 25) console.log(`    ... e mais ${recusados.length - 25}`);
}

if (negativosResiduais.length) {
  console.log(`\n  CARBOIDRATO POR DIFERENÇA — negativo abaixo do limite de quantificação,`);
  console.log(`  convertido em traço conforme a legenda da TACO (${negativosResiduais.length}):`);
  for (const n of negativosResiduais) console.log(`    ${n}`);
}

if (avisos.length) {
  console.log(`\n  AVISOS — conferir na fonte, sem substituir o valor oficial (${avisos.length}):`);
  for (const a of avisos.slice(0, 15)) console.log(`    ${a.onde}  ${a.mensagem.slice(0, 110)}`);
  if (avisos.length > 15) console.log(`    ... e mais ${avisos.length - 15}`);
}

console.log(`\n${linha}\n`);
