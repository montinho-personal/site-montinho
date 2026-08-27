/**
 * Testes da Calculadora de Macros.
 *
 * O risco específico desta ferramenta é a cascata devolver número sem
 * sentido físico. Quando proteína + gordura já estouram a meta, o
 * carboidrato dá negativo — e "−54 g de carboidrato" numa tela de dieta é
 * pior do que não responder. Metade dos testes aqui existe por causa disso.
 *
 * O segundo risco é divergir da Calculadora de Proteína. As duas falam de
 * g/kg na mesma sessão do mesmo usuário; se discordarem, o site se
 * contradiz. Por isso os valores são importados, e o teste confere que
 * continuam sendo os mesmos objetos.
 */

import * as fs from "fs";
import { marked } from "marked";
import { blogPosts } from "../lib/blog";
import {
  AMDR,
  ARTIGOS_COM_CALCULADORA_MACROS,
  FAIXAS_PROTEINA,
  KCAL_MAX,
  KCAL_MIN,
  KCAL_POR_G_CARBO,
  KCAL_POR_G_GORDURA,
  KCAL_POR_G_PROTEINA,
  PERCENTUAIS_GORDURA,
  calculaMacros,
  dentroDoAMDR,
  formataNumero,
  normalizaNumero,
  porRefeicao,
} from "../lib/macros";
import { FAIXAS } from "../lib/proteina";
import { ARTIGOS_COM_CALCULADORA } from "../lib/proteina";
import { ARTIGOS_COM_CALCULADORA_DEFICIT } from "../lib/calorias";
import { ARTIGOS_COM_CALCULADORA_1RM, ARTIGOS_COM_LINK_1RM } from "../lib/onerm";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

console.log("\n" + "=".repeat(64) + "\nA CASCATA\n" + "=".repeat(64));

/** Caso principal do pedido: 80 kg, 2.200 kcal, 2,0 g/kg, 30% gordura. */
const A = calculaMacros(2200, 80, 2.0, 30);
ok("proteína = 80 × 2,0 = 160 g", A.proteina.gramas === 160);
ok("proteína = 640 kcal", A.proteina.kcal === 640);
ok("gordura = 30% de 2200 = 660 kcal", A.gordura.kcal === 660);
ok("gordura ≈ 73,33 g", Math.abs(A.gordura.gramas - 73.3333333) < 1e-5, String(A.gordura.gramas));
ok("gordura na tela = 73 g", formataNumero(A.gordura.gramas) === "73");
ok("carboidrato = 2200 − 640 − 660 = 900 kcal", A.carboidrato.kcal === 900);
ok("carboidrato = 225 g", A.carboidrato.gramas === 225);
ok("nada é impossível aqui", A.impossivel === false);

/** Segundo caso do pedido: 70 kg, 2.000 kcal, 1,6 g/kg, 25%. */
const B = calculaMacros(2000, 70, 1.6, 25);
ok("proteína = 70 × 1,6 = 112 g", B.proteina.gramas === 112);
ok("gordura = 500 kcal ≈ 55,56 g", Math.abs(B.gordura.gramas - 55.5555556) < 1e-5);
ok("gordura na tela = 56 g", formataNumero(B.gordura.gramas) === "56");
ok("carboidrato = 1052 kcal = 263 g", B.carboidrato.kcal === 1052 && B.carboidrato.gramas === 263);

/**
 * O total exibido soma os GRAMAS ARREDONDADOS e pode não bater com a meta.
 * Isso é correto: forçar a soma empurrando um macro seria mentir sobre a
 * conta. O caso do pedido dá 2.197 contra 2.200.
 */
ok("o total do caso 1 é 2.197, não forçado para 2.200", A.totalArredondado === 2197, String(A.totalArredondado));
ok("a meta é preservada como informada", A.metaKcal === 2200);

ok("os fatores de Atwater estão certos", KCAL_POR_G_PROTEINA === 4 && KCAL_POR_G_CARBO === 4 && KCAL_POR_G_GORDURA === 9);

/** Os percentuais precisam somar ~100% quando a combinação fecha. */
const somaPct = A.proteina.percentual + A.carboidrato.percentual + A.gordura.percentual;
ok("os percentuais somam 100%", Math.abs(somaPct - 100) < 1e-9, String(somaPct));

console.log("\n" + "=".repeat(64) + "\nO ORÇAMENTO É FECHADO\n" + "=".repeat(64));

/**
 * O ponto pedagógico da ferramenta: mexer num macro tem que mexer no outro.
 * Se estes testes passarem com valores iguais, a interatividade é falsa.
 */
const maisProteina = calculaMacros(2200, 80, 2.2, 30);
ok(
  "aumentar a proteína reduz o carboidrato",
  maisProteina.carboidrato.gramas < A.carboidrato.gramas,
  `${maisProteina.carboidrato.gramas} vs ${A.carboidrato.gramas}`
);
const menosGordura = calculaMacros(2200, 80, 2.0, 25);
ok(
  "reduzir a gordura aumenta o carboidrato",
  menosGordura.carboidrato.gramas > A.carboidrato.gramas,
  `${menosGordura.carboidrato.gramas} vs ${A.carboidrato.gramas}`
);
ok("a proteína não muda quando só a gordura muda", menosGordura.proteina.gramas === A.proteina.gramas);
ok("a meta calórica não muda com os ajustes", menosGordura.metaKcal === A.metaKcal);

console.log("\n" + "=".repeat(64) + "\nCOMBINAÇÕES IMPOSSÍVEIS\n" + "=".repeat(64));

/** O caso do pedido: 120 kg, 1.200 kcal, 2,2 g/kg, 30% de gordura. */
const IMP = calculaMacros(1200, 120, 2.2, 30);
ok("a combinação é marcada como impossível", IMP.impossivel === true);
ok("o carboidrato NUNCA aparece negativo", IMP.carboidrato.gramas >= 0, String(IMP.carboidrato.gramas));
ok("o excedente é informado", IMP.excedenteKcal > 0, String(IMP.excedenteKcal));
ok(
  "o excedente confere: 264 g × 4 + 360 − 1200 = 216 kcal",
  Math.abs(IMP.excedenteKcal - 216) < 1e-9,
  String(IMP.excedenteKcal)
);

/** Nenhum resultado pode conter NaN ou Infinity, em nenhuma combinação. */
let sujos = 0;
for (const kcal of [800, 1200, 1500, 2000, 2500, 3000, 4000]) {
  for (const peso of [40, 60, 80, 100, 150, 250]) {
    for (const f of FAIXAS_PROTEINA) {
      for (const g of PERCENTUAIS_GORDURA) {
        const r = calculaMacros(kcal, peso, f.gPorKg, g);
        const nums = [
          r.proteina.gramas, r.proteina.kcal, r.proteina.percentual,
          r.carboidrato.gramas, r.carboidrato.kcal, r.carboidrato.percentual,
          r.gordura.gramas, r.gordura.kcal, r.gordura.percentual,
          r.totalArredondado,
        ];
        if (nums.some((n) => !Number.isFinite(n)) || r.carboidrato.gramas < 0) sujos++;
      }
    }
  }
}
ok("nenhuma das 504 combinações produz NaN, Infinity ou macro negativo", sujos === 0, `${sujos} combinações sujas`);

console.log("\n" + "=".repeat(64) + "\nA DIGITAÇÃO\n" + "=".repeat(64));

ok('aceita "2200"', normalizaNumero("2200") === 2200);
ok('aceita "80,5"', normalizaNumero("80,5") === 80.5);
ok('aceita "80.5"', normalizaNumero("80.5") === 80.5);
ok('aceita separador de milhar "2.200"', normalizaNumero("2.200") === 2200);
ok('"2.200,5" → 2200,5 (vírgula manda)', normalizaNumero("2.200,5") === 2200.5);
ok('"1.500" é lido como mil e quinhentos', normalizaNumero("1.500") === 1500);
ok('"80.55" continua decimal', normalizaNumero("80.55") === 80.55);
ok("recusa vazio", normalizaNumero("") === null);
ok("recusa texto", normalizaNumero("duas mil") === null);
ok("recusa zero", normalizaNumero("0") === null);
ok("recusa negativo", normalizaNumero("-80") === null);
ok("limites de caloria são plausíveis", KCAL_MIN >= 500 && KCAL_MAX <= 10000 && KCAL_MIN < KCAL_MAX);

console.log("\n" + "=".repeat(64) + "\nFONTE ÚNICA DE VERDADE\n" + "=".repeat(64));

/**
 * As faixas de proteína têm que ser LITERALMENTE o mesmo objeto da
 * Calculadora de Proteína — não uma cópia com os mesmos números, que
 * dessincroniza no primeiro ajuste.
 */
ok("as faixas de proteína são importadas, não copiadas", FAIXAS_PROTEINA === FAIXAS);
ok("as três referências continuam 1,6 / 2,0 / 2,2", FAIXAS_PROTEINA.map((f) => f.gPorKg).join(",") === "1.6,2,2.2");

const libSrc = fs.readFileSync("lib/macros.ts", "utf8");
const libSemComentarios = libSrc.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
ok(
  "os valores de g/kg não estão redigitados no lib de macros",
  !/1\.6|2\.2/.test(libSemComentarios.replace(/from "\.\/proteina"/g, "")),
  "número repetido é número que vai dessincronizar"
);

/** As faixas do AMDR precisam bater com a fonte citada. */
ok("AMDR carboidrato 45–65%", AMDR.carboidrato.min === 45 && AMDR.carboidrato.max === 65);
ok("AMDR gordura 20–35%", AMDR.gordura.min === 20 && AMDR.gordura.max === 35);
ok("AMDR proteína 10–35%", AMDR.proteina.min === 10 && AMDR.proteina.max === 35);
ok("todos os percentuais de gordura oferecidos ficam dentro do AMDR", PERCENTUAIS_GORDURA.every((p) => dentroDoAMDR("gordura", p)));

console.log("\n" + "=".repeat(64) + "\nDIVISÃO POR REFEIÇÃO\n" + "=".repeat(64));

ok("160 g em 4 refeições → 40 g", porRefeicao(160, 4) === 40);
ok("225 g em 4 refeições → 56 g", porRefeicao(225, 4) === 56);
ok("73 g em 4 refeições → 18 g", porRefeicao(73.333, 4) === 18);

console.log("\n" + "=".repeat(64) + "\nPRIVACIDADE E EVENTOS\n" + "=".repeat(64));

const componenteBruto = fs.readFileSync("components/macros/CalculadoraMacros.tsx", "utf8");
const componente = componenteBruto.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const analytics = fs.readFileSync("lib/analytics.ts", "utf8");

for (const ev of [
  "macro_calculator_view", "macro_calculator_complete", "macro_protein_change", "macro_fat_change",
  "macro_meal_split_open", "macro_methodology_open", "macro_deficit_click",
  "macro_protein_calculator_click", "macro_article_click", "macro_cta_click", "calorie_macros_click",
]) {
  ok(`evento declarado: ${ev}`, analytics.includes(`"${ev}"`));
}

const chamadas = componente.match(/track(Event|OncePerSession)\([^)]*\)/g) ?? [];
ok("existem chamadas de analytics para auditar", chamadas.length > 0);
const SENSIVEL = /peso|kcal|caloria|gramas|proteina\.|carboidrato\.|gordura\.|resultado/i;
ok(
  "nenhuma chamada carrega peso, calorias ou os macros",
  chamadas.every((c) => !SENSIVEL.test(c)),
  chamadas.filter((c) => SENSIVEL.test(c)).join(" | ")
);
ok("nenhuma chamada de rede", !/fetch\(|axios|XMLHttpRequest/.test(componente));

/**
 * O sessionStorage é a ÚNICA gravação de todo o ecossistema de ferramentas,
 * e existe só para a ponte vinda do déficit. Precisa ser lida e apagada na
 * mesma função — senão o número fica sobrando na sessão.
 */
const ponteSrc = fs.readFileSync("lib/ferramentas/ponte.ts", "utf8");
ok("a ponte usa sessionStorage e não a URL", /sessionStorage/.test(ponteSrc) && !/searchParams|useSearchParams/.test(componente));
ok(
  "o valor é apagado assim que é consumido",
  /removeItem\(chave\)/.test(ponteSrc),
  "sem o removeItem, o valor fica guardado na sessão sem necessidade"
);
ok(
  "a mecânica da ponte está num lugar só",
  !/sessionStorage/.test(libSrc),
  "cada ferramenta com sua cópia de try/catch é como as regras divergem"
);
ok("o componente não grava nada por conta própria", !/setItem/.test(componente));
ok("storage bloqueado não quebra a ferramenta", (ponteSrc.match(/catch\s*\{/g) ?? []).length >= 2);

console.log("\n" + "=".repeat(64) + "\nACESSIBILIDADE E UX\n" + "=".repeat(64));

ok("os campos têm label verdadeiro", (componente.match(/<label htmlFor=/g) ?? []).length >= 2);
ok("os grupos de opção usam fieldset/legend", /<fieldset/.test(componente) && /<legend/.test(componente));
ok("teclado decimal nos dois campos", (componente.match(/inputMode="decimal"/g) ?? []).length >= 2);
ok("resultado anunciado por aria-live", /aria-live="polite"/.test(componente));
ok("estado dos chips exposto com aria-pressed", /aria-pressed/.test(componente));
ok("campos inválidos com aria-invalid", /aria-invalid/.test(componente));
ok("foco visível preservado", /focus-visible:ring/.test(componente));
ok("alvos de toque adequados", (componente.match(/min-h-\[44px\]/g) ?? []).length >= 2);
ok("erro amigável, sem grito", /Confira as calorias|Confira o peso/.test(componente) && !/ERRO|INVÁLIDO!/.test(componente));
ok("zero state não mostra zeros", /Informe suas calorias e seu peso/.test(componente));

/**
 * A barra é decorativa e está marcada como tal: toda informação que ela
 * carrega aparece em texto logo abaixo. Assim quem não distingue as cores
 * (ou usa leitor de tela) não perde nada.
 */
ok("a barra é aria-hidden e a informação existe em texto", /aria-hidden="true"/.test(componente) && /formataNumero\(item\.m\.gramas\)/.test(componente));
ok("cada macro tem nome escrito, não só cor", /Carboidratos/.test(componente) && /Gorduras/.test(componente));

console.log("\n" + "=".repeat(64) + "\nO QUE A FERRAMENTA NÃO PODE FAZER\n" + "=".repeat(64));

const tudo = componente + libSemComentarios;
ok("não existe preset por objetivo com números inventados", !/40\/30\/30|50\/25\/25|35\/40\/25/.test(tudo));
ok("não chama nenhuma distribuição de ideal ou perfeita", !/macros? (ideal|perfeit)/i.test(tudo));
ok("não promete perda de peso", !/voc[êe] (vai|ir[áa]) perder|garante (hipertrofia|emagrecimento)/i.test(tudo));
ok("não gera cardápio", !/caf[ée] da manh[ãa]:|almo[çc]o:|jantar:/i.test(componente));
ok("diz que a distribuição não é única", /NOTA_ORCAMENTO/.test(componente));
ok("explica o arredondamento em vez de forçar a soma", /NOTA_ARREDONDAMENTO/.test(componente));
ok("não força a soma bater com a meta", !/ajusta.*para fechar|forc[ao].*total/i.test(libSemComentarios));

console.log("\n" + "=".repeat(64) + "\nONDE A CALCULADORA APARECE\n" + "=".repeat(64));

const slugs = new Set(blogPosts.map((p) => p.slug));
ok("o registro não está vazio", ARTIGOS_COM_CALCULADORA_MACROS.length > 0);
for (const s of ARTIGOS_COM_CALCULADORA_MACROS) ok(`artigo do registro existe: ${s}`, slugs.has(s));
ok("o registro é seletivo", ARTIGOS_COM_CALCULADORA_MACROS.length <= 8, String(ARTIGOS_COM_CALCULADORA_MACROS.length));

/** Nenhum artigo pode receber duas calculadoras. */
const jaOcupados = [...ARTIGOS_COM_CALCULADORA, ...ARTIGOS_COM_CALCULADORA_DEFICIT, ...ARTIGOS_COM_CALCULADORA_1RM, ...ARTIGOS_COM_LINK_1RM];
const conflitos = ARTIGOS_COM_CALCULADORA_MACROS.filter((s) => jaOcupados.includes(s));
ok("nenhum artigo aparece em dois registros", conflitos.length === 0, conflitos.join(", "));

const html = (s: string) => marked(blogPosts.find((x) => x.slug === s)!.content ?? "") as string;
for (const s of ARTIGOS_COM_CALCULADORA_MACROS) {
  const corte = splitAtPrimeiraSecao(html(s));
  ok(`corte cedo funciona em ${s}`, corte !== null && corte.before.length > 100);
}

console.log("\n" + "=".repeat(64) + "\nSEO E ECOSSISTEMA\n" + "=".repeat(64));

const pagina = fs.readFileSync("app/ferramentas/calculadora-macros/page.tsx", "utf8");
const paginaSemComentarios = pagina.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
ok("canonical para ela mesma", /canonical: `\$\{SITE_URL\}\/ferramentas\/calculadora-macros`/.test(pagina));
ok("declara openGraph", /openGraph:/.test(pagina));
ok("tem H1", /<h1/.test(pagina));
ok("tem conteúdo indexável em volta", (pagina.match(/<h2/g) ?? []).length >= 5 && pagina.length > 5000);
ok("BreadcrumbList, sem schema inventado", /BreadcrumbList/.test(paginaSemComentarios) && !/AggregateRating|"Review"|FAQPage/.test(paginaSemComentarios));
ok("está no sitemap", fs.readFileSync("app/sitemap.ts", "utf8").includes("/ferramentas/calculadora-macros"));
ok("está na central /ferramentas", fs.readFileSync("app/ferramentas/page.tsx", "utf8").includes("/ferramentas/calculadora-macros"));

/** O ecossistema tem que estar ligado nos dois sentidos. */
const deficitComp = fs.readFileSync("components/calorias/CalculadoraDeficit.tsx", "utf8");
ok("o déficit leva para os macros", deficitComp.includes("/ferramentas/calculadora-macros"));
ok("o déficit guarda as calorias para a ponte", /guardaKcalParaMacros/.test(deficitComp));
ok("os macros levam de volta para o déficit", componente.includes("/ferramentas/calculadora-deficit-calorico"));
ok("os macros levam para a calculadora de proteína", componente.includes("/ferramentas/calculadora-de-proteina"));

/** Todo link interno da página precisa existir. */
const internos = [...pagina.matchAll(/href="\/blog\/([a-z0-9-]+)"/g)].map((m) => m[1]);
for (const s of internos) ok(`link interno aponta para artigo real: ${s}`, slugs.has(s));

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
