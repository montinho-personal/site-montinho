/**
 * Leitor do export do Search Console.
 *   npx tsx scripts/gsc-local-test.ts
 *
 * O RISCO REAL AQUI É NÚMERO ERRADO COM CARA DE CERTO
 *
 * O GSC exporta em pt-BR: "1.234" impressões, posição "11,4", CTR "1,23%".
 * Number("1.234") devolve 1.234 — mil vezes menos, sem erro nenhum. E
 * Number("11,4") devolve NaN, que atravessa somas e sai como "NaN%" ou, pior,
 * como 0 depois de um "|| 0" descuidado.
 *
 * Um relatório que erra a escala não parece quebrado, parece uma notícia ruim.
 * Foi para não decidir conteúdo em cima disso que esta suíte existe.
 */

import { num, csv, leGsc, leXlsx, cluster, ctrEsperado, montaMarco, marcoAnterior, dataFimDoExport, VIGIADAS, PASTA_MARCOS } from "./gsc-local";
import { existsSync, readdirSync } from "node:fs";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) { console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64)); }

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. NÚMERO EM pt-BR");

ok('"1.234" é mil duzentos e trinta e quatro', num("1.234") === 1234);
ok('"11,4" é onze vírgula quatro', num("11,4") === 11.4);
ok('"1,23%" perde o símbolo', num("1,23%") === 1.23);
ok('"3.690" não vira 3,69', num("3.690") === 3690);
ok('"0" é zero', num("0") === 0);
ok("espaço em volta não atrapalha", num("  192  ") === 192);
{
  let erro = false;
  try { num("abc"); } catch { erro = true; }
  ok("campo ilegível derruba em vez de virar zero", erro);
}
{
  let erro = false;
  try { num(""); } catch { erro = true; }
  ok("campo vazio derruba em vez de virar zero", erro);
}

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. CSV COM VÍRGULA DENTRO DO CAMPO");

{
  const t = 'Página,Cliques\n"https://x/a,b",5\n';
  const l = csv(t);
  ok("URL com vírgula entre aspas fica inteira", l[1][0] === "https://x/a,b" && l[1][1] === "5");
}

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. AS COLUNAS SÃO ACHADAS PELO NOME, NÃO PELA ORDEM");

{
  /* A ordem do export do GSC já mudou antes; posição fixa quebraria em silêncio. */
  const t = "Impressões,Página principal,Posição,Cliques,CTR\n"
    /* Posição e CTR saem entre aspas no export porque a vírgula é decimal. */
    + '3.690,https://montinhopersonal.com.br/personal-trainer-tambore,"8,1",7,"0,19%"\n';
  const [l] = leGsc(t);
  ok("impressões", l.impressoes === 3690);
  ok("cliques", l.cliques === 7);
  ok("posição", l.posicao === 8.1);
  ok("CTR", l.ctr === 0.19);
  ok("URL", l.url.endsWith("/personal-trainer-tambore"));
}
{
  let erro = false;
  try { leGsc("Foo,Bar\n1,2\n"); } catch { erro = true; }
  ok("CSV que não é do GSC derruba com mensagem", erro);
}

// ─── 3b ─────────────────────────────────────────────────────────────────────
bloco("3b. A PLANILHA, QUE É O CAMINHO PREFERIDO");

/*
 * O .xlsx guarda número como número — não há locale para errar. O que HÁ para
 * errar é a escala do CTR: a planilha traz fração (0,0348) e a régua trabalha
 * em percentual. Ler 0,0348 como 3,48% sem multiplicar faria toda página
 * parecer cem vezes pior do que é, e o relatório mandaria reescrever títulos
 * que estão bons.
 *
 * A fixture também tem a aba "Gráfico" na frente, como o export de verdade:
 * pegar a aba por posição em vez de por nome leria a planilha errada.
 */
const FIX = "scripts/fixtures/gsc-exemplo.xlsx";
{
  const pgs = leXlsx(FIX, "Páginas");
  ok("acha a aba Páginas pelo nome, não pela posição", pgs.length === 3);
  const t = pgs.find((p) => p.url.endsWith("/personal-trainer-tambore"))!;
  ok("cliques", t.cliques === 8);
  ok("impressões", t.impressoes === 230);
  ok("posição com decimal", t.posicao === 16.8);
  ok("CTR vira percentual (0,0348 → 3,48)", Math.abs(t.ctr - 3.48) < 0.001, String(t.ctr));
  ok("CTR não fica em fração", t.ctr > 1);

  const qs = leXlsx(FIX, "Consultas");
  ok("a aba Consultas sai do mesmo arquivo", qs.length === 2);
  ok("consulta traz o texto da busca, não URL", qs[0].url === "personal trainer alphaville");
  ok("CTR da consulta também em percentual", Math.abs(qs[0].ctr - 2.49) < 0.001);
}
{
  let erro = false;
  try { leXlsx(FIX, "Países" as "Páginas"); } catch { erro = true; }
  ok("aba inexistente derruba com a lista de abas", erro);
}
/* A mesma régua precisa valer para os dois caminhos, senão o diagnóstico muda de formato. */
{
  const doXlsx = leXlsx(FIX, "Páginas").find((p) => p.url.endsWith("/personal-trainer-barueri"))!;
  const [doCsv] = leGsc('Páginas principais,Cliques,Impressões,CTR,Posição\n'
    + 'https://www.montinhopersonal.com.br/personal-trainer-barueri,5,256,"1,95%","14,3"\n');
  ok("planilha e CSV chegam ao mesmo número",
    doXlsx.cliques === doCsv.cliques && doXlsx.impressoes === doCsv.impressoes
    && Math.abs(doXlsx.ctr - doCsv.ctr) < 0.01 && doXlsx.posicao === doCsv.posicao,
    `xlsx ${doXlsx.ctr} × csv ${doCsv.ctr}`);
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. CLASSIFICAÇÃO POR BAIRRO");

const c = (u: string) => cluster("https://montinhopersonal.com.br" + u);
ok("/personal-trainer-tambore → Tamboré", c("/personal-trainer-tambore") === "Tamboré");
ok("/blog/personal-trainer-tambore-1 → Tamboré", c("/blog/personal-trainer-tambore-1") === "Tamboré");
ok("/personal-trainer-alphaville → Alphaville", c("/personal-trainer-alphaville") === "Alphaville");
ok("/personal-trainer-barueri → Barueri", c("/personal-trainer-barueri") === "Barueri");
ok("/personal-trainer-santana-de-parnaiba → Santana", c("/personal-trainer-santana-de-parnaiba") === "Santana de Parnaíba");
/* Tamboré vem antes de Barueri na lista: a página que cita os dois é do cluster Tamboré. */
ok("/personal-trainer-tambore-barueri conta como Tamboré", c("/personal-trainer-tambore-barueri") === "Tamboré");
ok("artigo sem bairro fica de fora", c("/blog/polichinelo-emagrece") === null);
ok("ferramenta fica de fora", c("/ferramentas/calculadora-tdee") === null);

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. A RÉGUA DE CTR");

/*
 * A curva não precisa estar certa no decimal — precisa ser monótona e ter a
 * ordem de grandeza certa. Se ela subisse com a posição, o relatório
 * recomendaria mexer exatamente nas páginas que vão bem.
 */
ok("posição 1 é a maior", ctrEsperado(1) > ctrEsperado(2));
ok("cai a cada posição até 10",
  [...Array(9)].every((_, i) => ctrEsperado(i + 1) > ctrEsperado(i + 2)));
ok("posição 1 na casa dos 20-30%", ctrEsperado(1) > 20 && ctrEsperado(1) < 35);
ok("posição 10 abaixo de 3%", ctrEsperado(10) < 3);
ok("posição 20 abaixo da 10", ctrEsperado(20) < ctrEsperado(10));
ok("interpola entre pontos", ctrEsperado(12.5) < ctrEsperado(10) && ctrEsperado(12.5) > ctrEsperado(15));
ok("posição absurda não vira negativo", ctrEsperado(300) > 0);
ok("posição fracionária funciona", ctrEsperado(8.1) < ctrEsperado(8) && ctrEsperado(8.1) > ctrEsperado(9));

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. O MARCO E A COMPARAÇÃO");

/*
 * A decisão de 03/09/2026 foi "deixar como está e vigiar". Vigiar é comparar
 * com o marco anterior — e o erro possível aqui é comparar com o marco
 * ERRADO: o mais novo em vez do imediatamente anterior, ou o próprio período
 * consigo mesmo, o que mostraria "=" em tudo e pareceria estabilidade.
 */
{
  const L = (url: string, cliques: number, impressoes: number, posicao: number) =>
    ({ url: "https://www.montinhopersonal.com.br" + url, cliques, impressoes, ctr: impressoes ? (100 * cliques) / impressoes : 0, posicao });
  const m = montaMarco("2026-09-02", [
    L("/personal-trainer-alphaville", 1, 130, 32.6),
    L("/blog/personal-trainer-tambore-1", 2, 4, 6.2),
    L("/blog/personal-trainer-tambore-4", 0, 1, 2.0),
    L("/blog/personal-trainer-alphaville-residencial-1", 2, 69, 15.8),
    L("/personal-trainer-tambore", 8, 230, 16.8),
  ]);
  ok("guarda o caminho, não a URL inteira", m.locais.every((p) => p.url.startsWith("/")));
  ok("Tamboré numerados: só os com dígito", m.chaves.tamboreNumerados.paginas === 2 && m.chaves.tamboreNumerados.impressoes === 5);
  ok("Alphaville residenciais contados à parte", m.chaves.alphavilleResidenciais.paginas === 1);
  ok("páginas sem clique", m.chaves.locaisSemClique === 1);
  ok("posição do cluster ponderada por impressão",
    Math.abs(m.clusters["Tamboré"].posicao - ((230 * 16.8 + 4 * 6.2 + 1 * 2) / 235)) < 0.1, String(m.clusters["Tamboré"].posicao));
  ok("cluster Alphaville soma as duas páginas", m.clusters["Alphaville"].paginas === 2);
}
{
  ok("o marco de 02/09/2026 está gravado", existsSync(`${PASTA_MARCOS}/2026-09-02.json`));
  ok("marcoAnterior a 2026-09-02 é null (é o primeiro)", marcoAnterior("2026-09-02") === null);
  const depois = marcoAnterior("2026-12-31");
  ok("marcoAnterior a uma data futura devolve o de 02/09", depois?.periodo === "2026-09-02");
  ok("o marco gravado tem as páginas vigiadas",
    VIGIADAS.every(([u]) => depois!.locais.some((p) => p.url === u)),
    VIGIADAS.filter(([u]) => !depois!.locais.some((p) => p.url === u)).map(([u]) => u).join(", "));
  ok("nomes de arquivo são a data-fim do período",
    readdirSync(PASTA_MARCOS).every((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f)));
}
{
  /* A data sai da aba Filtros; a fixture não tem essa aba, então cai no dia de hoje. */
  const hoje = new Date().toISOString().slice(0, 10);
  ok("sem aba Filtros, a data do marco é hoje", dataFimDoExport(FIX) === hoje);
}

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
