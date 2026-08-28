/**
 * Testes da Calculadora de Déficit Calórico.
 *
 * A ordem reflete a gravidade. Primeiro a conta: uma calculadora que erra o
 * número não tem conserto de UX. Depois a digitação, porque "1,75" e "175"
 * são as duas formas reais de escrever altura e confundir as duas produz um
 * resultado absurdo silenciosamente. Depois os limites de segurança, que
 * existem para a ferramenta NÃO prescrever onde não deve. E por fim
 * privacidade — peso, altura, idade e sexo juntos são dados corporais
 * sensíveis e não podem vazar por um parâmetro de analytics.
 */

import * as fs from "fs";
import { marked } from "marked";
import { blogPosts } from "../lib/blog";
import {
  ALTURA_MAX,
  ALTURA_MIN,
  ARTIGOS_COM_CALCULADORA_DEFICIT,
  FAIXAS_DEFICIT,
  IDADE_ADULTA,
  NIVEIS,
  REFERENCIA_TMB,
  aplicaDeficit,
  arredondaKcal,
  calculaTDEE,
  calculaTMB,
  formataFaixa,
  metaAbaixoDaTMB,
  normalizaAltura,
  normalizaIdade,
  normalizaNumero,
  tmbPorSexo,
} from "../lib/calorias";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

console.log("\n" + "=".repeat(64) + "\nA CONTA (Mifflin-St Jeor)\n" + "=".repeat(64));

/** O caso trabalhado do pedido, verbatim: 80 kg, 175 cm, 35 anos, homem. */
const TMB_HOMEM = tmbPorSexo(80, 175, 35, "masculino");
ok("homem 80 kg / 175 cm / 35 anos → 1723,75 kcal", TMB_HOMEM === 1723.75, String(TMB_HOMEM));

/** Mesma pessoa pela constante feminina: 1723,75 − 5 − 161 = 1557,75. */
const TMB_MULHER = tmbPorSexo(80, 175, 35, "feminino");
ok("mulher 80 kg / 175 cm / 35 anos → 1557,75 kcal", TMB_MULHER === 1557.75, String(TMB_MULHER));
ok("a diferença entre as constantes é de 166 kcal", TMB_HOMEM - TMB_MULHER === 166);

const tmb = calculaTMB(80, 175, 35, "masculino");
const tdee = calculaTDEE(tmb, 1.55);
ok("TDEE = TMB × 1,55 = 2671,8125 (precisão interna preservada)", tdee.min === 2671.8125, String(tdee.min));

/**
 * O arredondamento é de EXIBIÇÃO, para a dezena. O pedido pede ambas as
 * coisas: precisão total por dentro (§43) e ausência de falsa precisão na
 * tela (§3, §7). A dezena é o que cumpre as duas.
 */
ok("na tela o gasto vira 2.670, não 2.671,8125", formataFaixa(tdee) === "2.670", formataFaixa(tdee));
ok("nunca sobra casa decimal na exibição", !/[.,]\d{1,2}$/.test(formataFaixa(tdee).replace(/\./g, "")));

/** As quatro metas do caso trabalhado, conferidas em precisão total. */
const CASOS_DEFICIT: [number, number][] = [
  [10, 2404.63125],
  [15, 2271.040625],
  [20, 2137.45],
  [25, 2003.859375],
];
for (const [pct, esperado] of CASOS_DEFICIT) {
  const m = aplicaDeficit(tdee, pct);
  ok(
    `déficit de ${pct}% → ${esperado} kcal (interno)`,
    Math.abs(m.min - esperado) < 1e-9,
    String(m.min)
  );
}

ok("déficit de 10% na tela → 2.400", formataFaixa(aplicaDeficit(tdee, 10)) === "2.400");
ok("déficit de 20% na tela → 2.140", formataFaixa(aplicaDeficit(tdee, 20)) === "2.140");
ok("déficit de 25% na tela → 2.000", formataFaixa(aplicaDeficit(tdee, 25)) === "2.000");

/** Sem sexo informado, o resultado é uma faixa de verdade — não uma média. */
const faixaTmb = calculaTMB(80, 175, 35, "nao_informado");
ok("sem sexo informado, a TMB vira faixa", faixaTmb.min === 1557.75 && faixaTmb.max === 1723.75);
ok("a faixa é exibida como intervalo", formataFaixa(faixaTmb).includes("–"), formataFaixa(faixaTmb));
ok(
  "com sexo informado NÃO vira intervalo",
  !formataFaixa(calculaTMB(80, 175, 35, "feminino")).includes("–")
);

/** O déficit sempre reduz, e mais percentual sempre reduz mais. */
const m10 = aplicaDeficit(tdee, 10).min;
const m25 = aplicaDeficit(tdee, 25).min;
ok("déficit reduz em relação ao gasto", m10 < tdee.min);
ok("déficit maior resulta em meta menor", m25 < m10);

ok("arredondaKcal vai para a dezena", arredondaKcal(2671.8125) === 2670 && arredondaKcal(2675) === 2680);

console.log("\n" + "=".repeat(64) + "\nA DIGITAÇÃO\n" + "=".repeat(64));

ok('peso aceita "80"', normalizaNumero("80") === 80);
ok('peso aceita vírgula "80,5"', normalizaNumero("80,5") === 80.5);
ok('peso aceita ponto "80.5"', normalizaNumero("80.5") === 80.5);
ok('peso aceita espaços " 80 "', normalizaNumero(" 80 ") === 80);
ok("peso recusa vazio", normalizaNumero("") === null);
ok('peso recusa texto "oitenta"', normalizaNumero("oitenta") === null);
ok("peso recusa negativo", normalizaNumero("-80") === null);
ok("peso recusa zero", normalizaNumero("0") === null);
ok('peso recusa "80,5,5"', normalizaNumero("80,5,5") === null);

ok('altura aceita "175" como cm', normalizaAltura("175") === 175);
ok('altura aceita "1,75" como metros', normalizaAltura("1,75") === 175);
ok('altura aceita "1.75" como metros', normalizaAltura("1.75") === 175);
ok('altura aceita "1,8" → 180', normalizaAltura("1,8") === 180);
ok("altura recusa texto", normalizaAltura("alto") === null);
/**
 * A desambiguação metros/cm só é segura porque as faixas não se tocam. "80"
 * vira 80, que o range de altura rejeita — em vez de virar 80 cm calado.
 */
ok("altura 80 é interpretada, mas cai fora do range válido", normalizaAltura("80") === 80 && 80 < ALTURA_MIN);
ok("range de altura é razoável", ALTURA_MIN >= 100 && ALTURA_MAX <= 250);

ok('idade aceita "35"', normalizaIdade("35") === 35);
ok('idade recusa decimal "35,5"', normalizaIdade("35,5") === null);
ok("idade recusa texto", normalizaIdade("trinta") === null);
ok("idade recusa zero", normalizaIdade("0") === null);
ok("idade recusa negativo", normalizaIdade("-5") === null);

console.log("\n" + "=".repeat(64) + "\nFATORES E FAIXAS\n" + "=".repeat(64));

ok(
  "os fatores são os clássicos 1,2 / 1,375 / 1,55 / 1,725 / 1,9",
  NIVEIS.map((n) => n.fator).join(",") === "1.2,1.375,1.55,1.725,1.9"
);
ok("todo nível tem descrição que fala da rotina, não só do treino", NIVEIS.every((n) => n.descricao.length > 40));
/**
 * O erro clássico destas calculadoras é a pessoa se marcar como extremamente
 * ativa por treinar 1h. O nível de cima precisa exigir trabalho físico, não
 * só academia, e precisa dizer que é incomum.
 */
const extremo = NIVEIS[NIVEIS.length - 1];
ok(
  "o nível mais alto exige rotina fisicamente pesada, não só treino",
  /trabalho|pesad/i.test(extremo.descricao) && /incomum|menos comum/i.test(extremo.descricao),
  extremo.descricao
);

ok("são três faixas de déficit", FAIXAS_DEFICIT.length === 3);
ok(
  "os percentuais são 10 / 15–20 / 25",
  FAIXAS_DEFICIT.map((f) => `${f.percentualMin}-${f.percentualMax}`).join(",") === "10-10,15-20,25-25"
);
ok(
  "só a faixa moderada tem destaque",
  FAIXAS_DEFICIT.filter((f) => f.destaque).length === 1 && FAIXAS_DEFICIT.find((f) => f.destaque)!.id === "moderado"
);

/** A copy não pode prometer emagrecimento nem chamar nada de ideal. */
const copy = FAIXAS_DEFICIT.map((f) => `${f.titulo} ${f.descricao}`).join(" ");
const PROIBIDO = [
  /d[ée]ficit ideal/i,
  /ideal para (todos|todas|qualquer)/i,
  /voc[êe] (vai|ir[áa]) perder/i,
  /garantid/i,
  /\d+\s*kg por semana/i,
  /perde\s+\d/i,
  /emagrece\s+\d/i,
];
for (const re of PROIBIDO) {
  ok(`copy das faixas não contém ${re}`, !re.test(copy));
}

console.log("\n" + "=".repeat(64) + "\nLIMITES: ONDE A FERRAMENTA NÃO DEVE PRESCREVER\n" + "=".repeat(64));

ok("a maioridade usada é 18", IDADE_ADULTA === 18);

/**
 * Nada de piso calórico universal ("mulher nunca abaixo de 1.200"). O sinal
 * é relativo à própria pessoa: meta abaixo da TMB estimada dela.
 */
const tmbPequena = calculaTMB(50, 155, 60, "feminino");
const tdeePequeno = calculaTDEE(tmbPequena, 1.2);
const meta25 = aplicaDeficit(tdeePequeno, 25);
ok(
  "meta abaixo da TMB é sinalizada",
  metaAbaixoDaTMB(meta25, tmbPequena),
  `meta ${meta25.min.toFixed(0)} vs TMB ${tmbPequena.min.toFixed(0)}`
);
const metaConfortavel = aplicaDeficit(calculaTDEE(tmb, 1.725), 10);
ok("meta acima da TMB não é sinalizada", !metaAbaixoDaTMB(metaConfortavel, tmb));

const libSrc = fs.readFileSync("lib/calorias.ts", "utf8");
const semComentarios = libSrc.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
ok(
  "não existe piso calórico universal codificado",
  !/\b1200\b|\b1500\b/.test(semComentarios),
  "1.200/1.500 kcal como regra viraria prescrição clínica automática"
);

console.log("\n" + "=".repeat(64) + "\nPRIVACIDADE E EVENTOS\n" + "=".repeat(64));

const componente = fs.readFileSync("components/calorias/CalculadoraDeficit.tsx", "utf8");
const analytics = fs.readFileSync("lib/analytics.ts", "utf8");

for (const ev of [
  "calorie_calculator_view",
  "calorie_calculator_complete",
  "calorie_activity_help_open",
  "calorie_methodology_open",
  "calorie_deficit_select",
  "calorie_article_click",
  "calorie_cta_click",
]) {
  ok(`evento declarado: ${ev}`, analytics.includes(`"${ev}"`));
}

/**
 * Nenhum dado corporal em parâmetro de evento. A checagem varre todas as
 * chamadas de track* do componente.
 */
const chamadas = componente.match(/track(Event|OncePerSession)\([^)]*\)/g) ?? [];
ok("existem chamadas de analytics para auditar", chamadas.length > 0);
const SENSIVEL = /peso|altura|idade|sexo|tmb|tdee|kcal|meta|resultado|caloria/i;
ok(
  "nenhuma chamada de analytics carrega dado corporal ou resultado",
  chamadas.every((c) => !SENSIVEL.test(c)),
  chamadas.filter((c) => SENSIVEL.test(c)).join(" | ")
);
ok("nenhuma chamada de rede no componente", !/fetch\(|axios|XMLHttpRequest/.test(componente));
/**
 * Storage: a regra ficou mais precisa quando as pontes passaram a existir
 * (primeiro para a Calculadora de Macros, depois para o cardápio). Nada é
 * gravado passivamente — os únicos writes são as funções guarda* da ponte,
 * e só quando a pessoa CLICA em um dos links de destino. Não pode haver
 * localStorage (que persiste), nem setItem direto, nem chamada de guarda*
 * fora de um handler onClick.
 *
 * Esta assertion nasceu falhando: o teste original proibia qualquer storage
 * e pegou a mudança de comportamento na hora, que é exatamente o que ele
 * tinha que fazer. Quando o link para o cardápio adicionou a segunda
 * chamada, ela falhou de novo — e a regra foi reescrita para verificar a
 * invariante real (write só dentro de clique) em vez de contar chamadas.
 */
ok("nunca usa localStorage", !/localStorage/.test(componente));
const semImports = componente.replace(/^import .*$/gm, "");
{
  const guardas = semImports.match(/guarda\w+\(/g) ?? [];
  // Toda chamada guarda* deve estar dentro de um bloco onClick: cortamos o
  // arquivo nos inícios de handler e exigimos que nenhuma chamada apareça
  // fora deles (aproximação por segmento até o fechamento "}}").
  const foraDeClique = semImports
    .split(/onClick=\{\(\) => \{[\s\S]*?\}\}/)
    .some((trecho) => /guarda\w+\(/.test(trecho));
  ok(
    "os únicos writes são as pontes, todos dentro de onClick",
    !/setItem/.test(componente) && guardas.length >= 2 && !foraDeClique,
    "gravar meta ou peso sem ação explícita seria mudar o contrato de privacidade da ferramenta"
  );
}

console.log("\n" + "=".repeat(64) + "\nACESSIBILIDADE E UX\n" + "=".repeat(64));

ok("os três campos têm label verdadeiro", (componente.match(/<label htmlFor=/g) ?? []).length >= 3);
ok("os grupos de opção usam fieldset/legend", /<fieldset/.test(componente) && /<legend/.test(componente));
ok("radios reais, navegáveis por teclado", /type="radio"/.test(componente));
ok("teclado decimal para peso e altura", (componente.match(/inputMode="decimal"/g) ?? []).length >= 2);
ok("teclado numérico para idade", /inputMode="numeric"/.test(componente));
ok("resultado anunciado por aria-live", /aria-live="polite"/.test(componente));
ok("campos inválidos marcados com aria-invalid", /aria-invalid/.test(componente));
ok("foco visível preservado", /focus-visible:ring|focus-within:ring/.test(componente));
ok("alvos de toque adequados", /min-h-\[44px\]/.test(componente));
ok(
  "erro amigável, sem grito",
  /Confira o peso informado|Confira sua altura|Informe sua idade/.test(componente) && !/ERRO!|INVÁLIDO!/.test(componente)
);
ok("seleção não depende só de cor (tem marca ✓)", /✓/.test(componente));
ok("zero state não mostra 0 kcal", /Preencha seus dados/.test(componente) && !/>0 kcal/.test(componente));

console.log("\n" + "=".repeat(64) + "\nO QUE A FERRAMENTA NÃO PODE FAZER\n" + "=".repeat(64));

ok(
  "não promete quilos perdidos",
  !/kg por semana|kg em \d+ dias|voc[êe] vai perder/i.test(componente),
  "previsão de perda é falsa precisão"
);
ok(
  "não pede calorias queimadas no treino",
  !/calorias queimadas|quantas calorias voc[êe] gasta treinando/i.test(componente),
  "somar isso ao TDEE é dupla contagem"
);
ok("avisa sobre dupla contagem", /NOTA_SEM_DUPLA_CONTAGEM/.test(componente));
ok("a palavra 'estimativa' aparece com destaque", /estimad|estimativa/i.test(componente));
ok(
  "nunca chama a equação de medição",
  !/medi[çc][ãa]o do seu metabolismo|medimos seu/i.test(componente + libSrc)
);
ok("cita a fonte científica com link", REFERENCIA_TMB.url.includes("pubmed") && componente.includes("REFERENCIA_TMB"));

console.log("\n" + "=".repeat(64) + "\nONDE A CALCULADORA APARECE\n" + "=".repeat(64));

const slugs = new Set(blogPosts.map((p) => p.slug));
ok("o registro não está vazio", ARTIGOS_COM_CALCULADORA_DEFICIT.length > 0);
for (const s of ARTIGOS_COM_CALCULADORA_DEFICIT) {
  ok(`artigo do registro existe: ${s}`, slugs.has(s));
}
ok(
  "o registro é seletivo, não indiscriminado",
  ARTIGOS_COM_CALCULADORA_DEFICIT.length <= 8,
  `${ARTIGOS_COM_CALCULADORA_DEFICIT.length} artigos — a regra é aparecer onde responde a dúvida`
);

/** O corte cedo roda sobre marked(content), igual à página. */
const html = (s: string) => marked(blogPosts.find((x) => x.slug === s)!.content ?? "") as string;
for (const s of ARTIGOS_COM_CALCULADORA_DEFICIT) {
  const corte = splitAtPrimeiraSecao(html(s));
  ok(`corte cedo funciona em ${s}`, corte !== null && corte.before.length > 100);
}

/**
 * Os fatores de atividade publicados nos artigos precisam bater com os da
 * ferramenta — foi exatamente esse tipo de divergência que apareceu na
 * tabela de proteína.
 */
for (const s of ["deficit-calorico-como-calcular", "quantas-calorias-eu-gasto-por-dia"]) {
  const c = blogPosts.find((p) => p.slug === s)!.content;
  const temTodos = NIVEIS.every((n) => {
    const br = String(n.fator).replace(".", ",");
    return c.includes(br) || c.includes(String(n.fator));
  });
  ok(`os fatores do artigo ${s} batem com os da ferramenta`, temTodos);
}

/** A página própria precisa existir e ter canonical para ela mesma. */
const pagina = fs.readFileSync("app/ferramentas/calculadora-deficit-calorico/page.tsx", "utf8");
ok("a página própria tem canonical para ela mesma", /canonical: `\$\{SITE_URL\}\/ferramentas\/calculadora-deficit-calorico`/.test(pagina));
ok("a página própria declara openGraph", /openGraph:/.test(pagina));
ok("a página própria tem H1", /<h1/.test(pagina));
ok(
  "a página tem conteúdo indexável além da ferramenta (o crawler não digita)",
  /<h2/.test(pagina) && pagina.length > 4000
);
/**
 * A checagem ignora comentários de propósito. A página DOCUMENTA que não usa
 * FAQPage nem AggregateRating; um teste que reprova por causa da explicação
 * ensina a apagar a explicação, que é o oposto do que se quer.
 */
const paginaSemComentarios = pagina.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
ok(
  "a página usa BreadcrumbList, sem schema inventado",
  /BreadcrumbList/.test(paginaSemComentarios) &&
    !/AggregateRating|"Review"|FAQPage|MedicalWebPage/.test(paginaSemComentarios)
);

/** A ferramenta entrou no sitemap e na central. */
const sitemap = fs.readFileSync("app/sitemap.ts", "utf8");
ok("a página está no sitemap", sitemap.includes("/ferramentas/calculadora-deficit-calorico"));
const central = fs.readFileSync("app/ferramentas/page.tsx", "utf8");
ok("a ferramenta está na central /ferramentas", central.includes("/ferramentas/calculadora-deficit-calorico"));

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
