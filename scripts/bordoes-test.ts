/**
 * Testes dos bordões.
 *
 * O que este arquivo protege é a diferença entre convicção e promessa.
 *
 * "É impossível dar errado" é uma afirmação sobre resultado. Escrita sozinha,
 * ela vira a única promessa de um site que passou 813 artigos se recusando a
 * prometer — e a primeira promessa custa a credibilidade que as outras 812
 * construíram. A frase só é honesta com a condição colada nela.
 *
 * Por isso a varredura é do repositório inteiro, e não só dos módulos: o risco
 * não é o texto que escrevi hoje, é a versão curta e bonita que alguém vai
 * querer escrever amanhã num botão.
 */

import * as fs from "fs";
import * as path from "path";
import { BORDOES, REGEX_IMPOSSIVEL, temCondicao } from "../lib/bordoes";
import { FILOSOFIAS } from "../lib/filosofia";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

/** Fontes de conteúdo visível. lib/blog.ts entra: são 813 artigos. */
const RAIZES = ["app", "components", "lib", "scripts"];
const EXTENSOES = new Set([".ts", ".tsx"]);

function arquivos(dir: string): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      out.push(...arquivos(full));
    } else if (EXTENSOES.has(path.extname(e.name))) {
      out.push(full);
    }
  }
  return out;
}

console.log("\n" + "=".repeat(60) + "\nA FRASE NUNCA APARECE SEM A CONDIÇÃO\n" + "=".repeat(60));

const nus: string[] = [];
let ocorrencias = 0;

for (const raiz of RAIZES) {
  if (!fs.existsSync(raiz)) continue;
  for (const arquivo of arquivos(raiz)) {
    // O próprio módulo de bordões e este teste falam SOBRE a regra.
    if (arquivo.endsWith("lib/bordoes.ts") || arquivo.endsWith("scripts/bordoes-test.ts")) continue;

    const texto = fs.readFileSync(arquivo, "utf8");
    const re = new RegExp(REGEX_IMPOSSIVEL.source, "gi");
    let m: RegExpExecArray | null;
    while ((m = re.exec(texto))) {
      ocorrencias++;
      // Janela generosa: a condição pode vir antes ou depois, e o JSX no meio
      // consome muitos caracteres sem ser texto visível.
      const janela = texto.slice(Math.max(0, m.index - 420), m.index + 420);
      if (!temCondicao(janela)) {
        const linha = texto.slice(0, m.index).split("\n").length;
        nus.push(`${arquivo}:${linha}`);
      }
    }
  }
}

ok("a frase aparece em algum lugar", ocorrencias > 0, "nenhuma ocorrência — o bordão sumiu do site");
ok(
  `nenhuma ocorrência sem condição (${ocorrencias} verificadas)`,
  nus.length === 0,
  nus.join(", ")
);

console.log("\n" + "=".repeat(60) + "\nO MÓDULO DE BORDÕES\n" + "=".repeat(60));

ok("a forma canônica traz a condição", temCondicao(BORDOES.impossivelCompleta));
ok(
  "existe um texto dizendo o que a frase NÃO é",
  /não garanto|não significa|não promete/i.test(BORDOES.impossivelNaoEh)
);
ok(
  "o chalalá vem sempre com a distinção de segredo",
  /segredo/i.test(BORDOES.chalalaNaoEhSegredo)
);
ok("a dupla junta os dois bordões", /chalalá/i.test(BORDOES.duplaCompleta) && REGEX_IMPOSSIVEL.test(BORDOES.duplaCompleta));

console.log("\n" + "=".repeat(60) + "\nNA NOTA DE MÉTODO\n" + "=".repeat(60));

/** Título e texto são igualmente visíveis na página. */
const inteiro = (f: (typeof FILOSOFIAS)[number]) => `${f.titulo} ${f.texto}`;
const comFrase = FILOSOFIAS.filter((f) => REGEX_IMPOSSIVEL.test(inteiro(f)));
ok("existe variante da nota com a frase", comFrase.length > 0);
for (const f of comFrase) {
  ok(`variante "${f.id}" traz a condição`, temCondicao(inteiro(f)));
  ok(
    `variante "${f.id}" nega a leitura de promessa`,
    /não é promessa|não é garantia|não garante|deixa de depender/i.test(inteiro(f)),
    "a frase aparece sem desmontar a leitura de 'garanto o resultado'"
  );
  ok(
    `variante "${f.id}" não entra em dor, saúde ou GLP-1`,
    ["pain", "health", "glp1"].every((c) => f.evitarEm?.includes(c)),
    `evitarEm atual: ${f.evitarEm?.join(", ") ?? "nenhum"}`
  );
}

console.log("\n" + "=".repeat(60) + "\nTAMBORÉ LEVA ARTIGO: \"NO\", NÃO \"EM\"\n" + "=".repeat(60));

/*
 * Quem mora ali diz "no Tamboré", como se diz "no Morumbi". O site nasceu
 * misturando as duas formas — havia 268 "em Tamboré" convivendo com 166 "no
 * Tamboré" — e quem percebe a diferença é justamente o público local, que é
 * de onde vêm os leads presenciais.
 *
 * O slug NÃO entra nesta regra: /blog/academias-em-tambore e
 * /personal-trainer-em-tambore são endereços publicados, e trocar endereço
 * por causa de gramática quebra link e joga posição fora.
 */
{
  const erradas: string[] = [];
  for (const raiz of RAIZES) {
    if (!fs.existsSync(raiz)) continue;
    for (const arquivo of arquivos(raiz)) {
      /* Este teste e o helper falam SOBRE a regra, citando a forma errada. */
      if (arquivo.endsWith("scripts/bordoes-test.ts") || arquivo.endsWith("lib/sticky/regras.ts")) continue;
      const texto = fs.readFileSync(arquivo, "utf8");
      const re = /em Tamboré/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(texto))) {
        erradas.push(`${arquivo}:${texto.slice(0, m.index).split("\n").length}`);
      }
    }
  }
  ok(`nenhum "em Tamboré" no texto do site`, erradas.length === 0, erradas.slice(0, 5).join(", "));

  /* A forma certa precisa existir de verdade, senão o teste acima passa com o site vazio. */
  let certas = 0;
  for (const raiz of RAIZES) {
    if (!fs.existsSync(raiz)) continue;
    for (const arquivo of arquivos(raiz)) {
      certas += (fs.readFileSync(arquivo, "utf8").match(/no Tamboré/g) ?? []).length;
    }
  }
  ok(`"no Tamboré" é a forma usada (${certas} ocorrências)`, certas > 300);

  /* Os endereços publicados continuam com "em-tambore". */
  ok(
    "os slugs com em-tambore continuam intactos",
    fs.existsSync("app/personal-trainer-em-tambore/page.tsx") &&
      fs.existsSync("app/personal-em-tambore/page.tsx") &&
      fs.readFileSync("lib/blog.ts", "utf8").includes("/blog/academias-em-tambore"),
  );
}

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
