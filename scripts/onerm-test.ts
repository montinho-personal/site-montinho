/**
 * Testes da Calculadora de 1RM e Carga de Treino.
 *
 * A parte que mais merece teste aqui não é a equação — é a montagem da
 * barra. A equação é uma multiplicação; a montagem é um problema de
 * combinação com conjunto incompleto de anilhas, onde o algoritmo ingênuo
 * (guloso) devolve resposta errada em casos que acontecem de verdade numa
 * academia. Um erro ali manda a pessoa carregar peso errado.
 */

import * as fs from "fs";
import { marked } from "marked";
import { blogPosts } from "../lib/blog";
import {
  ANILHAS_PADRAO,
  ARTIGOS_COM_CALCULADORA_1RM,
  ARTIGOS_COM_LINK_1RM,
  CONTEXTO_FAIXAS,
  PERCENTUAIS,
  REPS_AVISO,
  REPS_MAX,
  arredondaKg,
  arredondaParaIncremento,
  brzycki1RM,
  calculaMontagem,
  cargaDoPercentual,
  epley1RM,
  formataKg,
  normalizaCarga,
  normalizaReps,
} from "../lib/onerm";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import { ARTIGOS_COM_CALCULADORA } from "../lib/proteina";
import { ARTIGOS_COM_CALCULADORA_DEFICIT } from "../lib/calorias";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

console.log("\n" + "=".repeat(64) + "\nA EQUAÇÃO\n" + "=".repeat(64));

/** Os três casos do pedido, verbatim. */
ok("100 kg × 1 rep → 100 kg (não pode passar do levantado)", epley1RM(100, 1) === 100);
ok("80 kg × 8 reps → 101,33 kg", Math.abs(epley1RM(80, 8) - 101.3333333) < 1e-5, String(epley1RM(80, 8)));
ok("na tela vira ≈ 101 kg", arredondaKg(epley1RM(80, 8)) === 101);
ok("100 kg × 5 reps → 116,67 kg", Math.abs(epley1RM(100, 5) - 116.6666667) < 1e-5);
ok("na tela vira ≈ 117 kg", arredondaKg(epley1RM(100, 5)) === 117);

/**
 * O caso de 1 repetição é a armadilha clássica: aplicar a fórmula crua daria
 * 103,3 kg para quem levantou 100 uma vez — inventando força que ninguém
 * demonstrou.
 */
ok("1 rep nunca infla o resultado", epley1RM(60, 1) === 60 && epley1RM(200, 1) === 200);
ok("mais repetições → 1RM estimado maior", epley1RM(80, 10) > epley1RM(80, 5));

ok("Brzycki existe como controle", Math.abs(brzycki1RM(80, 8) - (80 * 36) / 29) < 1e-9);
ok("Brzycki também respeita 1 repetição", brzycki1RM(100, 1) === 100);
ok(
  "as duas equações discordam pouco em séries curtas",
  Math.abs(epley1RM(100, 5) - brzycki1RM(100, 5)) < 5,
  `${epley1RM(100, 5).toFixed(1)} vs ${brzycki1RM(100, 5).toFixed(1)}`
);

console.log("\n" + "=".repeat(64) + "\nPERCENTUAIS\n" + "=".repeat(64));

/** Com 1RM redondo de 100 kg, cada percentual tem que bater exatamente. */
for (const p of PERCENTUAIS) {
  ok(`${p}% de 100 kg = ${p} kg`, arredondaKg(cargaDoPercentual(100, p)) === p);
}
ok("a tabela cobre de 50% a 100%", PERCENTUAIS[0] === 50 && PERCENTUAIS[PERCENTUAIS.length - 1] === 100);

/** O contexto das faixas não pode virar prescrição de "zona de hipertrofia". */
const copyFaixas = CONTEXTO_FAIXAS.map((f) => `${f.titulo} ${f.texto}`).join(" ");
const PROIBIDO = [
  /zona de hipertrofia/i,
  /\d+% é (para )?(hipertrofia|for[çc]a)/i,
  /faixa (ideal|correta|certa) para hipertrofia/i,
  /apenas|somente.*hipertrofia/i,
];
for (const re of PROIBIDO) {
  ok(`contexto das faixas não contém ${re}`, !re.test(copyFaixas));
}

console.log("\n" + "=".repeat(64) + "\nCARGA PRÁTICA\n" + "=".repeat(64));

ok("80,8 kg com incremento 2,5 → 80 kg", arredondaParaIncremento(80.8, 2.5) === 80);
ok("81,5 kg com incremento 2,5 → 82,5 kg", arredondaParaIncremento(81.5, 2.5) === 82.5);
ok("80,8 kg com incremento 1 → 81 kg", arredondaParaIncremento(80.8, 1) === 81);
ok("80,8 kg com incremento 5 → 80 kg", arredondaParaIncremento(80.8, 5) === 80);
ok("formata sem decimal inútil", formataKg(81) === "81" && formataKg(82.5) === "82,5");

console.log("\n" + "=".repeat(64) + "\nMONTAGEM DA BARRA\n" + "=".repeat(64));

const PADRAO = [25, 20, 15, 10, 5, 2.5, 1.25];

/** O caso do pedido: 100 kg, barra de 20 → 40 kg por lado. */
const m100 = calculaMontagem(100, 20, PADRAO);
ok("100 kg / barra 20 monta exato", m100.exata !== null);
ok("por lado dá 40 kg", m100.exata?.pesoLado === 40, String(m100.exata?.pesoLado));
ok("o total confere com o alvo", m100.exata?.total === 100);

/**
 * O caso que reprova o algoritmo guloso, e que acontece de verdade: só há
 * anilhas de 25, 20 e 15, e o alvo é 30 kg por lado. Guloso pega a de 25 e
 * trava sem conseguir montar os 5 que faltam; a resposta certa é 15 + 15.
 */
const mGuloso = calculaMontagem(80, 20, [25, 20, 15]);
ok(
  "acha 2×15 onde o guloso travaria em 25",
  mGuloso.exata !== null && mGuloso.exata.pesoLado === 30,
  "guloso devolveria 'não dá para montar' num caso montável"
);

/** Combinação impossível: precisa oferecer as duas vizinhas, não inventar. */
const m81 = calculaMontagem(81, 20, PADRAO);
ok("81 kg não é montável com o conjunto padrão", m81.exata === null);
ok("oferece a mais próxima abaixo: 80 kg", m81.abaixo?.total === 80, String(m81.abaixo?.total));
ok("oferece a mais próxima acima: 82,5 kg", m81.acima?.total === 82.5, String(m81.acima?.total));
ok("a de baixo é menor que o alvo e a de cima é maior", (m81.abaixo?.total ?? 0) < 81 && (m81.acima?.total ?? 0) > 81);

/** A montagem tem que ser sempre simétrica e somar certo. */
for (const alvo of [40, 60, 80, 100, 120, 140, 62.5, 47.5]) {
  const m = calculaMontagem(alvo, 20, PADRAO);
  const escolhida = m.exata ?? m.abaixo;
  if (!escolhida) {
    ok(`${alvo} kg produz alguma montagem`, false);
    continue;
  }
  const soma = escolhida.anilhas.reduce((s, a) => s + a.peso * a.quantidade, 0);
  ok(
    `${alvo} kg: as anilhas somam o peso do lado e o total fecha`,
    Math.abs(soma - escolhida.pesoLado) < 1e-9 && Math.abs(escolhida.total - (20 + escolhida.pesoLado * 2)) < 1e-9,
    `soma ${soma} vs lado ${escolhida.pesoLado}, total ${escolhida.total}`
  );
}

/** Casos de borda que quebram implementações ingênuas. */
ok("alvo menor que a barra é sinalizado", calculaMontagem(15, 20, PADRAO).abaixoDaBarra === true);
ok("alvo igual à barra monta sem anilha", calculaMontagem(20, 20, PADRAO).exata?.pesoLado === 0);
ok("sem anilhas marcadas não inventa montagem", calculaMontagem(80, 20, []).exata === null);
ok("barra de 15 kg é respeitada", calculaMontagem(55, 15, PADRAO).exata?.total === 55);
ok("barra personalizada de 12 kg funciona", calculaMontagem(52, 12, PADRAO).exata?.total === 52);

/**
 * Ponto flutuante: 1,25 + 2,5 somados em float não batem com o alvo por
 * comparação direta. Se a implementação não trabalhar em inteiros, este
 * teste quebra.
 */
const mFino = calculaMontagem(82.5, 20, PADRAO);
ok(
  "cargas com 1,25 fecham exato (sem erro de float)",
  mFino.exata !== null && Math.abs(mFino.exata.total - 82.5) < 1e-9,
  String(mFino.exata?.total)
);

/**
 * 83,75 kg exigiria 31,875 kg por lado — nem o conjunto completo monta isso,
 * porque a menor anilha é 1,25. O certo é NÃO devolver montagem exata e
 * oferecer as vizinhas. (Este caso começou como um teste meu escrito errado:
 * eu esperava exatidão num alvo que não existe fisicamente.)
 */
const mImpar = calculaMontagem(83.75, 20, PADRAO);
ok(
  "alvo fisicamente impossível não vira montagem exata",
  mImpar.exata === null && mImpar.abaixo?.total === 82.5 && mImpar.acima?.total === 85,
  `${mImpar.abaixo?.total} / ${mImpar.acima?.total}`
);

/** Nunca usa uma anilha que a pessoa desmarcou. */
const semLeves = calculaMontagem(100, 20, [25, 20]);
const usadas = (semLeves.exata ?? semLeves.abaixo)?.anilhas.map((a) => a.peso) ?? [];
ok("só usa anilhas disponíveis", usadas.every((p) => [25, 20].includes(p)), usadas.join(","));

console.log("\n" + "=".repeat(64) + "\nA DIGITAÇÃO\n" + "=".repeat(64));

ok('carga aceita "80"', normalizaCarga("80") === 80);
ok('carga aceita "80,5"', normalizaCarga("80,5") === 80.5);
ok('carga aceita "80.5"', normalizaCarga("80.5") === 80.5);
ok('carga aceita " 80 "', normalizaCarga(" 80 ") === 80);
ok("carga recusa vazio", normalizaCarga("") === null);
ok("carga recusa texto", normalizaCarga("oitenta") === null);
ok("carga recusa zero", normalizaCarga("0") === null);
ok("carga recusa negativo", normalizaCarga("-80") === null);
ok('carga recusa "80,5,5"', normalizaCarga("80,5,5") === null);

ok('reps aceita "8"', normalizaReps("8") === 8);
ok('reps recusa decimal "8,5"', normalizaReps("8,5") === null);
ok("reps recusa zero", normalizaReps("0") === null);
ok("reps recusa texto", normalizaReps("oito") === null);

ok("a faixa preferencial vai até 15", REPS_MAX === 15);
ok("o aviso de precisão começa em 11", REPS_AVISO === 11);

console.log("\n" + "=".repeat(64) + "\nPRIVACIDADE E EVENTOS\n" + "=".repeat(64));

const componenteBruto = fs.readFileSync("components/onerm/CalculadoraOneRM.tsx", "utf8");
/**
 * As checagens de conteúdo rodam sobre o código SEM comentários. O componente
 * documenta as próprias regras ("nunca 1RM = 0"), e um teste que reprova por
 * causa da explicação ensina a apagar a explicação.
 */
const componente = componenteBruto.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const linkComp = fs.readFileSync("components/onerm/LinkFerramenta1RM.tsx", "utf8");
const analytics = fs.readFileSync("lib/analytics.ts", "utf8");

for (const ev of [
  "one_rm_calculator_view",
  "one_rm_calculator_use",
  "one_rm_percentage_select",
  "one_rm_plate_calculator_open",
  "one_rm_methodology_open",
  "one_rm_article_click",
]) {
  ok(`evento declarado: ${ev}`, analytics.includes(`"${ev}"`));
}

/** Carga, repetições e 1RM são desempenho individual — nunca em evento. */
const chamadas = (componente + linkComp).match(/track(Event|OncePerSession)\([^)]*\)/g) ?? [];
ok("existem chamadas de analytics para auditar", chamadas.length > 0);
const SENSIVEL = /\bcarga\b|\breps\b|umRM|1rm_|\bkg\b|resultado|alvo|montagem/i;
ok(
  "nenhuma chamada carrega carga, repetições ou o 1RM",
  chamadas.every((c) => !SENSIVEL.test(c)),
  chamadas.filter((c) => SENSIVEL.test(c)).join(" | ")
);
ok("nenhuma chamada de rede", !/fetch\(|axios|XMLHttpRequest/.test(componente));
/**
 * O 1RM passou a LER o exercício vindo da Calculadora de Volume, mas não
 * grava nada — e nunca fala com o storage direto, só pela ponte.
 */
ok("não grava nada em storage", !/setItem|localStorage/.test(componente));
ok("só fala com storage pela ponte", !/sessionStorage/.test(componente) && /consome\(PONTE\.exercicio\)/.test(componente));
ok("copiar só acontece por ação explícita", /onClick=\{copiar\}/.test(componente));

console.log("\n" + "=".repeat(64) + "\nACESSIBILIDADE E UX\n" + "=".repeat(64));

ok("os campos têm label verdadeiro", (componente.match(/<label htmlFor=/g) ?? []).length >= 3);
ok("teclado decimal para carga", /inputMode="decimal"/.test(componente));
ok("teclado numérico para repetições", /inputMode="numeric"/.test(componente));
ok("resultado anunciado por aria-live", /aria-live="polite"/.test(componente));
ok("estado dos chips exposto com aria-pressed", /aria-pressed/.test(componente));
ok("accordions com aria-expanded", /aria-expanded/.test(componente));
ok("campos inválidos com aria-invalid", /aria-invalid/.test(componente));
ok("foco visível preservado", /focus-visible:ring/.test(componente));
ok("alvos de toque adequados", (componente.match(/min-h-\[44px\]/g) ?? []).length >= 3);
ok("campos de entrada ainda maiores no mobile", /min-h-\[56px\]/.test(componente));
ok("seleção não depende só de cor", /✓/.test(componente));
ok(
  "erro amigável, sem grito",
  /Confira a carga informada|Informe quantas repetições/.test(componente) && !/ERRO|INVÁLIDO!|422/.test(componente)
);
ok("zero state não mostra 1RM = 0", /Informe uma carga e o número/.test(componente) && !/1RM = 0/.test(componente));
ok("o input do peso de barra personalizado tem rótulo acessível", /sr-only[^>]*>\s*Peso da barra/.test(componente));

console.log("\n" + "=".repeat(64) + "\nSEGURANÇA E HONESTIDADE\n" + "=".repeat(64));

const libSrc = fs.readFileSync("lib/onerm.ts", "utf8");
ok("sempre chama de 1RM estimado", /1RM estimado/.test(componente));
ok(
  "nunca apresenta como valor exato",
  !/seu 1RM exato|1RM real é|medimos seu/i.test(componente + libSrc)
);
ok("avisa para não tentar a carga máxima", /NOTA_NAO_TENTE/.test(componente));
ok("diz que não é preciso testar carga máxima", /NOTA_SEM_TESTE_MAXIMO/.test(componente));
ok("fala de proximidade da falha sem exigir falha absoluta", /NOTA_PROXIMIDADE_FALHA/.test(componente));
ok("acima de 15 reps orienta em vez de devolver número frágil", /ORIENTACAO_REPS_DEMAIS/.test(componente));
ok("cita a limitação por exercício com fonte", /FONTE_LIMITES/.test(componente) && /jscr/i.test(libSrc));
ok("documenta as duas equações", /FONTE_EPLEY/.test(libSrc) && /FONTE_BRZYCKI/.test(libSrc));
ok(
  "não faz média arbitrária das equações",
  !/\(epley1RM\([^)]*\)\s*\+\s*brzycki1RM\([^)]*\)\)\s*\/\s*2/.test(componente)
);

console.log("\n" + "=".repeat(64) + "\nONDE A CALCULADORA APARECE\n" + "=".repeat(64));

const slugs = new Set(blogPosts.map((p) => p.slug));
ok("o registro de embed não está vazio", ARTIGOS_COM_CALCULADORA_1RM.length > 0);
for (const s of ARTIGOS_COM_CALCULADORA_1RM) ok(`artigo do embed existe: ${s}`, slugs.has(s));
for (const s of ARTIGOS_COM_LINK_1RM) ok(`artigo do link existe: ${s}`, slugs.has(s));
ok(
  "o registro é seletivo, não indiscriminado",
  ARTIGOS_COM_CALCULADORA_1RM.length <= 8,
  `${ARTIGOS_COM_CALCULADORA_1RM.length} artigos`
);
ok(
  "embed e link são conjuntos disjuntos",
  !ARTIGOS_COM_CALCULADORA_1RM.some((s) => ARTIGOS_COM_LINK_1RM.includes(s)),
  "um artigo não pode receber a ferramenta e o link para ela"
);

/** Nenhum artigo pode receber duas calculadoras diferentes. */
const outros = [...ARTIGOS_COM_CALCULADORA, ...ARTIGOS_COM_CALCULADORA_DEFICIT];
ok(
  "nenhum artigo aparece em dois registros de calculadora",
  !ARTIGOS_COM_CALCULADORA_1RM.some((s) => outros.includes(s)),
  "duas ferramentas disputariam o mesmo corte"
);

const html = (s: string) => marked(blogPosts.find((x) => x.slug === s)!.content ?? "") as string;
for (const s of ARTIGOS_COM_CALCULADORA_1RM) {
  const corte = splitAtPrimeiraSecao(html(s));
  ok(`corte cedo funciona em ${s}`, corte !== null && corte.before.length > 100);
}

console.log("\n" + "=".repeat(64) + "\nSEO E INTEGRAÇÃO\n" + "=".repeat(64));

const pagina = fs.readFileSync("app/ferramentas/calculadora-1rm/page.tsx", "utf8");
const semComentarios = pagina.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
ok("canonical para ela mesma", /canonical: `\$\{SITE_URL\}\/ferramentas\/calculadora-1rm`/.test(pagina));
ok("declara openGraph", /openGraph:/.test(pagina));
ok("tem H1", /<h1/.test(pagina));
ok("tem conteúdo indexável em volta", (pagina.match(/<h2/g) ?? []).length >= 4 && pagina.length > 5000);
ok(
  "BreadcrumbList, sem schema inventado",
  /BreadcrumbList/.test(semComentarios) && !/AggregateRating|"Review"|FAQPage/.test(semComentarios)
);
ok("está no sitemap", fs.readFileSync("app/sitemap.ts", "utf8").includes("/ferramentas/calculadora-1rm"));
ok("está na central /ferramentas", fs.readFileSync("app/ferramentas/page.tsx", "utf8").includes("/ferramentas/calculadora-1rm"));

/** Todo link interno da página precisa apontar para slug que existe. */
const internos = [...pagina.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].map((m) => m[1]);
ok("a página linka pelo menos 3 artigos", internos.length >= 3, internos.join(", "));
for (const s of internos) ok(`link interno aponta para artigo real: ${s}`, slugs.has(s));

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
