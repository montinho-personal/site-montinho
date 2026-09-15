/**
 * Testes da Fase 1 do CRM — lógica pura de ciclo de follow-ups.
 *   npx tsx scripts/crm-fase1-test.ts
 */
import { cicloDeFollowUps, ehFollowUp, esgotouFollowUps, motivoDecidir } from "../lib/crm/ciclo";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const fu = (dia: string, situacao = "segundo_toque_nao", grupo = "parado") => ({ ocorreuEm: `2026-09-${dia}T10:00:00Z`, tipo: "message", metadata: { origem: "hoje", grupo, situacao, follow_up: true } });

bloco("T2. O QUE É FOLLOW-UP");
ok("mensagem do Hoje em grupo de cobrança conta", ehFollowUp({ ocorreuEm: "x", tipo: "message", metadata: { grupo: "parado" } }));
ok("mensagem marcada follow_up: true conta", ehFollowUp({ ocorreuEm: "x", tipo: "message", metadata: { follow_up: true } }));
ok("tipo follow_up conta", ehFollowUp({ ocorreuEm: "x", tipo: "follow_up" }));
ok("primeiro contato (novo_sem_contato) NÃO conta", !ehFollowUp({ ocorreuEm: "x", tipo: "message", metadata: { grupo: "novo_sem_contato", follow_up: false } }));
ok("resposta do lead (direção entrada) NÃO conta", !ehFollowUp({ ocorreuEm: "x", tipo: "message", metadata: { direcao: "entrada" } }));
ok("nota interna NÃO conta", !ehFollowUp({ ocorreuEm: "x", tipo: "note" }));

bloco("T2. CONTADOR POR CICLO");
{
  const c = cicloDeFollowUps([null, undefined], [fu("01"), fu("03"), fu("05")]);
  ok("três cobranças sem marco = 3 no ciclo", c.followUps === 3 && c.inicio === null);
  ok("3 = esgotou", esgotouFollowUps(c));
  ok("2 não esgota", !esgotouFollowUps({ followUps: 2, promessaFeita: false }));
  ok("motivo fala em 3 tentativas", /3 tentativas/.test(motivoDecidir(c)));
}
{
  // Ela respondeu no dia 04: o ciclo recomeça, só o dia 05 conta.
  const c = cicloDeFollowUps(["2026-09-04T12:00:00Z"], [fu("01"), fu("03"), fu("05")]);
  ok("resposta do lead zera o contador (1 no ciclo)", c.followUps === 1 && c.inicio === "2026-09-04T12:00:00Z", JSON.stringify(c));
  ok("não esgotou", !esgotouFollowUps(c));
}
{
  // Proposta enviada no 06 reinicia depois da resposta do 04: o marco mais recente manda.
  const c = cicloDeFollowUps(["2026-09-04T12:00:00Z", "2026-09-06T12:00:00Z"], [fu("01"), fu("05"), fu("07")]);
  ok("o marco mais recente é o início do ciclo", c.inicio === "2026-09-06T12:00:00Z" && c.followUps === 1);
}
{
  // Mensagem que promete ser a última: esgota com 1.
  const c = cicloDeFollowUps([], [fu("02", "segundo_toque")]);
  ok("promessa feita com uma mensagem só", c.promessaFeita && esgotouFollowUps(c));
  ok("motivo explica a promessa", /prometeu/.test(motivoDecidir(c)));
  const c2 = cicloDeFollowUps(["2026-09-03T00:00:00Z"], [fu("02", "proposta_follow_up_2")]);
  ok("promessa ANTES do marco não conta no ciclo novo", !c2.promessaFeita && c2.followUps === 0);
}
{
  const c = cicloDeFollowUps([], [fu("01", "x", "negociacao_antiga"), fu("02", "x", "proposta_sem_follow_up"), fu("03", "x", "follow_up_atrasado"), { ocorreuEm: "2026-09-04T10:00:00Z", tipo: "message", metadata: { grupo: "quente", follow_up: false } }]);
  ok("mensagem de 'quente' (próximo passo) não é cobrança: 3, não 4", c.followUps === 3);
}

console.log("\n" + "=".repeat(64) + `\n${falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} FALHA(S)`}\n` + "=".repeat(64));
if (falhas > 0) process.exit(1);
