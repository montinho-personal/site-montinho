/**
 * Higiene do catálogo de eventos.
 *   npx tsx scripts/analytics-test.ts
 *
 * POR QUE ESTA SUÍTE EXISTE
 *
 * Um evento declarado em lib/analytics.ts e nunca disparado por ninguém é
 * pior do que evento nenhum: ele aparece na lista, dá a impressão de que
 * aquele botão está medido, e o relatório sai com um zero que parece
 * resultado quando na verdade é ausência de instrumentação. Foi assim que
 * a academia ideal e a revisão de execução passaram meses sem denominador.
 *
 * As outras suítes cuidam de cada ferramenta. Esta cuida do catálogo
 * inteiro: nada declarado sem uso, nada usado sem declaração, e todo botão
 * importante com um evento de exposição para virar taxa.
 *
 * CUIDADO COM NOME MONTADO
 *
 * `diagnostic_progress_25` é construído por template literal. Procurar só
 * pelo texto entre aspas dá falso positivo — foi exatamente o erro que
 * motivou esta suíte. DINAMICOS registra esses casos com o motivo.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

const CAT = readFileSync("lib/analytics.ts", "utf8");

function fontes(dir: string): string[] {
  const saida: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) saida.push(...fontes(p));
    else if (/\.tsx?$/.test(e.name) && p !== "lib/analytics.ts") saida.push(p);
  }
  return saida;
}
const ARQUIVOS = [...fontes("app"), ...fontes("components"), ...fontes("lib")];
const CODIGO = ARQUIVOS.map((f) => readFileSync(f, "utf8")).join("\n");

/** Só a união de eventos, antes do resto do arquivo. */
const DECLARADOS = [...CAT.slice(0, CAT.indexOf("export interface") + 1 || CAT.length)
  .matchAll(/^\s*\|\s*"([a-z0-9_]+)"/gm)].map((m) => m[1]);

/**
 * Eventos cujo nome é montado em tempo de execução, com o porquê.
 * Entrar aqui exige que o nome seja realmente construído no código.
 */
const DINAMICOS: Record<string, string> = {
  diagnostic_progress_25: "montado por template no DiagnosticoQuiz",
  diagnostic_progress_50: "montado por template no DiagnosticoQuiz",
  diagnostic_progress_75: "montado por template no DiagnosticoQuiz",
};

/**
 * Eventos de funcionalidade que ainda não está no ar. Ficam declarados de
 * propósito, e a lista é curta para não virar depósito.
 */
const NAO_LANCADOS: Record<string, string> = {
  mobility_share: "teste de mobilidade ainda não está no ar",
  mobility_retest_start: "teste de mobilidade ainda não está no ar",
  mobility_retest_complete: "teste de mobilidade ainda não está no ar",
};

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. NADA DECLARADO SEM DISPARAR");

ok(`o catálogo tem eventos (${DECLARADOS.length})`, DECLARADOS.length > 100);
ok("nenhum nome declarado duas vezes", new Set(DECLARADOS).size === DECLARADOS.length,
  DECLARADOS.filter((e, i) => DECLARADOS.indexOf(e) !== i).join(", "));

{
  const mortos = DECLARADOS.filter((e) => !CODIGO.includes(`"${e}"`) && !(e in DINAMICOS) && !(e in NAO_LANCADOS));
  ok("nenhum evento declarado e nunca disparado", mortos.length === 0, mortos.join(", "));
}
/* A dispensa precisa ser verdade: template que não existe mais é evento morto disfarçado. */
ok("os eventos dinâmicos realmente são montados no código",
  /trackEvent\(`diagnostic_progress_\$\{/.test(CODIGO));
ok("a lista de não lançados é curta", Object.keys(NAO_LANCADOS).length <= 6);

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. NADA DISPARADO SEM DECLARAR");

{
  const usados = new Set(
    [...CODIGO.matchAll(/track(?:Event|OncePerSession)\(\s*"([a-z0-9_]+)"/g)].map((m) => m[1]),
  );
  const orfaos = [...usados].filter((e) => !DECLARADOS.includes(e));
  ok("todo evento disparado está no catálogo", orfaos.length === 0, orfaos.join(", "));
  ok(`o site dispara muitos eventos (${usados.size})`, usados.size > 100);
}

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. TODO BOTÃO IMPORTANTE TEM DENOMINADOR");

/*
 * Clique sem exposição não vira taxa. Cada área abaixo precisa de um evento
 * que conte quantas pessoas VIRAM aquilo, senão o relatório mostra número
 * absoluto e ninguém sabe se é bom.
 */
const DENOMINADORES: Array<[string, string]> = [
  ["FAQ", "faq_view"],
  ["academia ideal", "gym_finder_view"],
  ["revisão de execução", "execution_review_view"],
  ["sticky bar", "sticky_view"],
  ["bloco pós-ferramenta", "post_tool_cta_view"],
  ["vídeo no artigo", "article_video_view"],
  ["diagnóstico", "diagnostic_view"],
  ["fonte preferida", "preferred_source_cta_view"],
];
for (const [area, evento] of DENOMINADORES) {
  ok(`${area}: tem exposição (${evento})`, DECLARADOS.includes(evento) && CODIGO.includes(`"${evento}"`));
}

/* A travessia da tabela de alimentos para as calculadoras. */
for (const e of ["food_protein_calculator_click", "food_macros_click"]) {
  ok(`${e} disparado na tabela de alimentos`, readFileSync("components/alimentos/LinksCalculadoras.tsx", "utf8").includes(`"${e}"`));
}
for (const arq of ["app/alimentos/page.tsx", "app/alimentos/[slug]/page.tsx"]) {
  ok(`${arq}: usa os links medidos`, readFileSync(arq, "utf8").includes("<LinksCalculadoras"));
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. EXPOSIÇÃO NÃO INFLA");

{
  const faq = readFileSync("components/ui/FAQ.tsx", "utf8");
  ok("faq_view conta uma vez por página por sessão", /CH_VISTO \+ placement/.test(faq) && /sessionStorage/.test(faq));
  ok("faq_view leva placement", /trackEvent\("faq_view", \{ placement/.test(faq));
  const vista = readFileSync("components/ui/VistaMedida.tsx", "utf8");
  ok("VistaMedida usa trackOncePerSession", /trackOncePerSession\(evento/.test(vista));
  ok("VistaMedida não desenha nada", /return null;/.test(vista));
  const quiz = readFileSync("components/academias/AcademiaQuiz.tsx", "utf8");
  ok("gym_finder_view uma vez por sessão", /trackOncePerSession\("gym_finder_view"\)/.test(quiz));
}

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. PRIVACIDADE: O QUE NUNCA PODE IR JUNTO");

{
  const PROIBIDO = /\b(peso|altura|idade|sexo|kcal|gramas|email|telefone|cpf)\s*[,:}]/;
  /*
   * Extrai a chamada equilibrando parênteses. Regex que para no primeiro
   * ");" engole o JSX seguinte e acusa `href` do link de baixo como se
   * fosse parâmetro — falso positivo que já aconteceu aqui.
   */
  const chamadas: string[] = [];
  for (const m of CODIGO.matchAll(/track(?:Event|OncePerSession)\(/g)) {
    let i = m.index! + m[0].length;
    let nivel = 1;
    while (i < CODIGO.length && nivel > 0) {
      if (CODIGO[i] === "(") nivel++;
      else if (CODIGO[i] === ")") nivel--;
      i++;
    }
    chamadas.push(CODIGO.slice(m.index!, i));
  }
  const sujas = chamadas.filter((c) => PROIBIDO.test(c));
  ok(`nenhuma chamada leva dado corporal (${chamadas.length} chamadas)`, sujas.length === 0, sujas.slice(0, 2).join(" || "));
  /*
   * Os vetores reais de vazamento. `href` sozinho é largo demais para uma
   * varredura global: quase todo botão tem uma variável `href` que é um
   * link nosso, montado por nós. O que não pode ir é de onde a PESSOA veio
   * ou onde ela está — isso é rastro de navegação.
   */
  const comUrl = chamadas.filter((c) =>
    /(location\.href|window\.location|document\.(referrer|URL))/.test(c) || /"https?:\/\//.test(c));
  ok("nenhuma chamada leva a URL da pessoa nem endereço absoluto", comUrl.length === 0, comUrl.slice(0, 2).join(" || "));
}

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
