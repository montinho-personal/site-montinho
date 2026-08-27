/**
 * Testes da Calculadora de Proteína.
 *
 * Três coisas se protegem aqui, em ordem de gravidade: a conta (número errado
 * numa calculadora destrói a ferramenta inteira), os dados de alimentos (cada
 * valor precisa de ficha completa com fonte — nutriente sem fonte é chute
 * publicado) e a privacidade (o peso digitado nunca pode sair do navegador,
 * nem escondido num parâmetro de analytics).
 */

import * as fs from "fs";
import { marked } from "marked";
import { blogPosts } from "../lib/blog";
import {
  ALIMENTOS,
  ARTIGOS_COM_CALCULADORA,
  FAIXAS,
  PESO_MAX,
  PESO_MIN,
  gramasPorDia,
  gramasPorRefeicao,
  parsePeso,
} from "../lib/proteina";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

console.log("\n" + "=".repeat(60) + "\nA CONTA\n" + "=".repeat(60));

/** Os casos do pedido, verbatim. */
const CASOS: [number, number, number, number][] = [
  [50, 80, 100, 110],
  [70, 112, 140, 154],
  [80, 128, 160, 176],
  [100, 160, 200, 220],
];
for (const [peso, g16, g20, g22] of CASOS) {
  ok(
    `${peso} kg → ${g16} / ${g20} / ${g22}`,
    gramasPorDia(peso, 1.6) === g16 && gramasPorDia(peso, 2.0) === g20 && gramasPorDia(peso, 2.2) === g22
  );
}
ok("resultado é sempre inteiro (sem falsa precisão)", Number.isInteger(gramasPorDia(70.5, 1.6)));
ok("divisão por refeição: 160 g em 4 → 40 g", gramasPorRefeicao(160, 4) === 40);
ok("divisão por refeição: 164 g em 4 → 41 g", gramasPorRefeicao(164, 4) === 41);

console.log("\n" + "=".repeat(60) + "\nA DIGITAÇÃO\n" + "=".repeat(60));

ok('aceita "70"', parsePeso("70") === 70);
ok('aceita vírgula brasileira "70,5"', parsePeso("70,5") === 70.5);
ok('aceita ponto "70.5"', parsePeso("70.5") === 70.5);
ok('aceita espaços em volta " 82 "', parsePeso(" 82 ") === 82);
ok("recusa vazio", parsePeso("") === null);
ok('recusa texto "oitenta"', parsePeso("oitenta") === null);
ok('recusa negativo "-70"', parsePeso("-70") === null);
ok('recusa zero', parsePeso("0") === null);
ok('recusa "70,5,5"', parsePeso("70,5,5") === null);
ok("limites técnicos existem e são razoáveis", PESO_MIN >= 20 && PESO_MAX <= 400 && PESO_MIN < PESO_MAX);

console.log("\n" + "=".repeat(60) + "\nAS FAIXAS\n" + "=".repeat(60));

ok("são exatamente 1,6 / 2,0 / 2,2", FAIXAS.map((f) => f.gPorKg).join(",") === "1.6,2,2.2");
ok("só a meta prática tem destaque", FAIXAS.filter((f) => f.destaque).length === 1 && FAIXAS.find((f) => f.destaque)!.gPorKg === 2.0);

/** A copy não pode prometer o que o Morton não sustenta. */
const copyFaixas = FAIXAS.map((f) => `${f.titulo} ${f.descricao}`).join(" ");
const PROIBIDO = [/dose perfeita/i, /garantid/i, /quanto mais proteína/i, /obrigatoriamente/i, /superior às demais|melhor que/i, /gera mais (músculo|hipertrofia)/i];
for (const re of PROIBIDO) {
  ok(`copy das faixas não contém ${re}`, !re.test(copyFaixas));
}

console.log("\n" + "=".repeat(60) + "\nOS ALIMENTOS\n" + "=".repeat(60));

ok("existe uma lista enxuta (6 a 12 itens)", ALIMENTOS.length >= 6 && ALIMENTOS.length <= 12, String(ALIMENTOS.length));
for (const a of ALIMENTOS) {
  const completa = !!(a.descricaoFonte && a.porcao && a.proteinaG > 0 && a.fonte && a.versaoFonte && a.dataConsulta);
  ok(`"${a.nome}" tem ficha completa (fonte, versão, data, estado)`, completa);
}
ok(
  "nenhum valor universal para whey/suplemento na lista",
  !ALIMENTOS.some((a) => /whey|barrinha|suplemento|prote[ií]co/i.test(a.nome)),
  "composição de industrializado varia por marca — a nota de rótulo cobre isso"
);
ok(
  "o estado do alimento está declarado onde importa",
  ALIMENTOS.filter((a) => /frango|carne|ovo|feij[aã]o|lentilha/i.test(a.nome)).every((a) =>
    /cozid|grelhad/i.test(a.descricaoFonte)
  ),
  "cru e cozido têm valores diferentes; a descrição precisa dizer qual é"
);

console.log("\n" + "=".repeat(60) + "\nONDE A CALCULADORA APARECE\n" + "=".repeat(60));

const slugs = new Set(blogPosts.map((p) => p.slug));
ok("o registro não está vazio", ARTIGOS_COM_CALCULADORA.length > 0);
for (const s of ARTIGOS_COM_CALCULADORA) {
  ok(`artigo do registro existe: ${s}`, slugs.has(s));
}
ok("o artigo principal de proteína está no registro", ARTIGOS_COM_CALCULADORA.includes("quanta-proteina-por-dia-para-ganhar-massa-muscular"));
ok(
  "o registro é seletivo, não indiscriminado",
  ARTIGOS_COM_CALCULADORA.length <= 8,
  `${ARTIGOS_COM_CALCULADORA.length} artigos — a regra é aparecer onde responde a dúvida, não onde a palavra aparece`
);

/**
 * O corte cedo precisa funcionar em todos os artigos do registro.
 *
 * Sobre o marked(): a página divide `marked(post.content)`, não o content
 * cru. Este teste checava o cru e passava por acaso — os quatro primeiros
 * artigos do registro são escritos em HTML, então tinham <h2> literal. O
 * acervo tem artigos escritos em Markdown ("## Título"), e neles a checagem
 * no cru dava zero <h2> e teria reprovado um artigo que funciona perfeito na
 * página. Testar o que o usuário não vê é como não testar.
 */
const html = (s: string) => marked(blogPosts.find((x) => x.slug === s)!.content ?? "") as string;

for (const s of ARTIGOS_COM_CALCULADORA) {
  const corte = splitAtPrimeiraSecao(html(s));
  ok(`corte cedo funciona em ${s}`, corte !== null && corte.before.length > 100);
}

/** A tabela existente NÃO pode ter sido removida em nenhum artigo do registro. */
for (const s of ARTIGOS_COM_CALCULADORA) {
  ok(
    `a tabela continua lá em ${s} (a calculadora complementa, não substitui)`,
    /<table/.test(html(s)),
    "a tabela é o conteúdo indexável; removê-la trocaria SEO por caixa vazia"
  );
}

/**
 * Os artigos de GLP-1 ficam de fora por segurança, não por acaso — a conta é
 * peso × g/kg e superestima para quem tem obesidade. Se alguém adicionar um
 * deles sem rediscutir a conta, o teste avisa.
 */
for (const s of ["proteina-para-quem-usa-mounjaro", "proteina-para-quem-usa-retatrutida", "ozempic-faz-perder-musculo", "glp1-apetite-suprimido-proteina-musculo"]) {
  ok(
    `artigo de GLP-1 permanece fora do registro: ${s}`,
    !ARTIGOS_COM_CALCULADORA.includes(s),
    "peso corporal × g/kg superestima nesse público; ver a justificativa em lib/proteina.ts"
  );
}

console.log("\n" + "=".repeat(60) + "\nPRIVACIDADE E EVENTOS\n" + "=".repeat(60));

const componente = fs.readFileSync("components/proteina/CalculadoraProteina.tsx", "utf8");
const analytics = fs.readFileSync("lib/analytics.ts", "utf8");

for (const ev of ["protein_calculator_view", "protein_calculator_use", "protein_meals_open", "protein_food_examples_open", "protein_article_click", "protein_cta_click"]) {
  ok(`evento declarado: ${ev}`, analytics.includes(`"${ev}"`));
}

/**
 * O peso NUNCA entra em parâmetro de evento. A checagem: nenhuma chamada de
 * track* no componente pode referenciar peso, texto ou resultado.
 */
const chamadas = componente.match(/track(Event|OncePerSession)\([^)]*\)/g) ?? [];
ok("existem chamadas de analytics para auditar", chamadas.length > 0);
ok(
  "nenhuma chamada de analytics carrega o peso ou o resultado",
  chamadas.every((c) => !/peso|texto|total|gramas|kg/i.test(c)),
  chamadas.filter((c) => /peso|texto|total|gramas|kg/i.test(c)).join(" | ")
);
ok("nenhuma chamada de rede no componente", !/fetch\(|axios|XMLHttpRequest/.test(componente));
ok("nada é gravado em storage", !/localStorage|sessionStorage\.setItem\(\s*["']peso/i.test(componente.replace(/trackOncePerSession/g, "")));

console.log("\n" + "=".repeat(60) + "\nACESSIBILIDADE E UX\n" + "=".repeat(60));

ok("o input tem label verdadeiro", /<label htmlFor=/.test(componente));
ok("teclado numérico no mobile", /inputMode="decimal"/.test(componente));
ok("resultados anunciados por aria-live", /aria-live="polite"/.test(componente));
ok("erro amigável, sem grito", /Confira o peso informado/.test(componente) && !/VALOR INVÁLIDO|INVALIDO!/i.test(componente));
ok("zero state útil (exemplo de 70 kg)", /para 70 kg.*112 g/.test(componente));
ok("alvos de toque adequados", /min-h-\[44px\]/.test(componente));
ok("o disclaimer existe e é discreto", /não substitui avaliação individual/.test(componente));

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
