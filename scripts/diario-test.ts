/**
 * Série diária de eventos.
 *   npx tsx scripts/diario-test.ts
 *
 * O arquivo é preenchido à mão, a partir de uma tela do app do GA4. Isso
 * significa que os erros possíveis não são de código — são de digitação e de
 * leitura. Um dígito trocado num dia entra no histórico e nunca mais é
 * questionado, porque daqui a um mês ninguém lembra qual era a tela.
 *
 * As invariantes abaixo são as que o próprio GA4 garante. Quando uma delas
 * quebra, ou o número foi copiado errado, ou o site passou a disparar evento
 * duplicado — e as duas coisas precisam ser vistas no dia, não no trimestre.
 */

import { leDiario, PARES_DIARIOS, type Dia } from "./diario";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

const dias = leDiario();
const ev = (d: Dia, n: string) => d.eventos[n] ?? 0;

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. O ARQUIVO É UMA SÉRIE, NÃO UM SACO DE DIAS");

ok("tem pelo menos um dia", dias.length > 0);
ok("nenhuma data repetida", new Set(dias.map((d) => d.data)).size === dias.length);
ok("em ordem cronológica",
  dias.every((d, i) => i === 0 || dias[i - 1].data < d.data));
ok("toda data no formato AAAA-MM-DD", dias.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.data)));
ok("nenhum dia no futuro", dias.every((d) => d.data <= new Date().toISOString().slice(0, 10)));
ok("todo dia diz de onde veio", dias.every((d) => !!d.fonte));
ok("dia parcial registra a hora da leitura",
  dias.every((d) => d.parcial === undefined || /^\d{2}:\d{2}$/.test(d.parcial)));

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. CONTAGEM DE EVENTO É INTEIRA E NÃO-NEGATIVA");

for (const d of dias) {
  const nomes = Object.keys(d.eventos);
  ok(`${d.data}: tem eventos registrados`, nomes.length > 0);
  ok(`${d.data}: todos inteiros >= 0`,
    nomes.every((n) => Number.isInteger(d.eventos[n]) && d.eventos[n] >= 0));
  ok(`${d.data}: nome de evento em snake_case`, nomes.every((n) => /^[a-z][a-z0-9_]*$/.test(n)));
}

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. AS INVARIANTES QUE O GA4 GARANTE");

/*
 * Cada uma destas é impossível de violar com o site funcionando direito.
 * Quebrar significa erro de digitação OU disparo duplicado no código — e as
 * duas hipóteses valem uma investigação no mesmo dia.
 */
for (const d of dias) {
  ok(`${d.data}: page_view >= session_start`,
    ev(d, "page_view") >= ev(d, "session_start"),
    `${ev(d, "page_view")} × ${ev(d, "session_start")}`);
  ok(`${d.data}: first_visit <= session_start`,
    ev(d, "first_visit") <= ev(d, "session_start"),
    `${ev(d, "first_visit")} × ${ev(d, "session_start")}`);
  ok(`${d.data}: user_engagement <= session_start`,
    ev(d, "user_engagement") <= ev(d, "session_start"),
    `${ev(d, "user_engagement")} × ${ev(d, "session_start")}`);
  /* scroll_75 dispara aos 75%, scroll aos 90%: quem chega ao segundo passou pelo primeiro. */
  ok(`${d.data}: scroll_75 >= scroll`,
    ev(d, "scroll_75") >= ev(d, "scroll"),
    `${ev(d, "scroll_75")} × ${ev(d, "scroll")}`);
  /*
   * generate_lead sai do mesmo clique que click_whatsapp (AnalyticsTracker),
   * mais o canal telefone. Passar do click_whatsapp é possível; ficar acima
   * da soma dos dois canais não seria — mas o app não separa, então o teto
   * aqui é o que dá para afirmar: lead sem clique nenhum é erro.
   */
  ok(`${d.data}: generate_lead não aparece sem click_whatsapp`,
    ev(d, "generate_lead") === 0 || ev(d, "click_whatsapp") > 0);
  /* Ação sem exposição é medição quebrada: o par existe para dar denominador. */
  for (const [nome, vista, acao] of PARES_DIARIOS) {
    ok(`${d.data}: ${nome} — ação nunca sem exposição`,
      ev(d, acao) === 0 || ev(d, vista) > 0,
      `${acao}=${ev(d, acao)} ${vista}=${ev(d, vista)}`);
    ok(`${d.data}: ${nome} — ação nunca acima da exposição`,
      ev(d, acao) <= ev(d, vista) || ev(d, vista) === 0,
      `${acao}=${ev(d, acao)} ${vista}=${ev(d, vista)}`);
  }
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. NADA DE DADO PESSOAL ATRAVESSA");

/*
 * O app do GA4 mostra agregado, mas quem digita pode achar que ajuda anotar
 * "veio do Instagram, mulher, 40 anos". A mesma regra do trackEvent vale
 * aqui: o arquivo guarda contagem e contexto editorial, nunca a pessoa.
 */
const PROIBIDO = /\b(peso|kcal|idade|sexo|altura|email|e-mail|nome|telefone|whatsapp:\s*\+?\d|cpf|\d{2}9\d{8})\b/i;
for (const d of dias) {
  const texto = [d.fonte, d.nota ?? "", ...Object.keys(d.eventos)].join(" | ");
  const m = texto.match(PROIBIDO);
  /* "whatsapp" solto é nome de evento nosso; o padrão só pega whatsapp seguido de número. */
  ok(`${d.data}: sem campo de dado pessoal`, !m, m ? `achei "${m[0]}"` : "");
}

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. NÃO SE CONFUNDE COM O SNAPSHOT DE CSV");

/*
 * O erro caro seria alguém ler esta série como se fosse gente e comparar com
 * o historico.json, que conta usuários. Os dois arquivos convivem; o que não
 * pode é esta série ganhar um campo chamado "usuários".
 */
for (const d of dias) {
  ok(`${d.data}: nenhum campo se chama usuário`,
    !Object.keys(d.eventos).some((n) => /usuario|users?\b/i.test(n)));
}
{
  const fonte = require("node:fs").readFileSync("scripts/diario.ts", "utf8");
  ok("o relatório avisa que conta evento, não pessoa", /não de pessoas/.test(fonte));
  ok("o relatório marca o dia parcial", /\*.*antes de fechar/.test(fonte));
  ok("o relatório aponta para o snapshot completo", /snapshot-analytics/.test(fonte));
}

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
