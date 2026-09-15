/**
 * Aulas do pacote flexível.
 *   npx tsx scripts/crm-aulas-test.ts
 *
 * O que se protege: a lista colada do WhatsApp vira datas certas (com
 * cabeçalho no meio, hífen na frente, sem ano), a mesma lista colada duas
 * vezes não dobra a contagem, e o pacote só cobra renovação quando a última
 * aula foi dada — nunca pela data, que num plano sem rotina fixa é chute.
 */
import { formatarDatas, lerDatas, resumoDoPacote } from "../lib/crm/aulas";
import { prioridadesHoje } from "../lib/crm/metricas";
import { escolherSituacao } from "../lib/crm/copy";
import type { Sinais } from "../lib/crm/copy";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const hoje = new Date("2026-09-15T12:00:00-03:00");

bloco("1. LER A LISTA COMO ELA CHEGA");
{
  // Exatamente como veio do controle da Natália, cabeçalho em inglês incluso.
  const colado = `Control of Classes - Natalia Nascimento

Package 20 lessons

Dates held:

-06/08
-07/08
-10/08
-11/08
-13/08
-14/08
-15/08
-24/08
-25/08
-26/08
-28/08
-12/09
-14/09
-15/09`;
  const r = lerDatas(colado, hoje);
  ok("14 aulas lidas", r.datas.length === 14, r.datas.join(", "));
  ok("primeira é 06/08/2026", r.datas[0] === "2026-08-06", r.datas[0]);
  ok("última é 15/09/2026", r.datas[13] === "2026-09-15", r.datas[13]);
  ok("nome do aluno não vira data", !r.ignoradas.some((x) => /Natalia/.test(x)));
  ok("'Package 20 lessons' é reportado como ignorado, não engolido", r.ignoradas.some((x) => /Package 20/.test(x)), r.ignoradas.join(" | "));
  ok("formatado para a mensagem", formatarDatas(r.datas).startsWith("06/08, 07/08, 10/08"), formatarDatas(r.datas));
}
{
  const r = lerDatas("08/09, 09/09, 11/09, 12/09, 14/09, 15/09", hoje);
  ok("lista separada por vírgula: 6 aulas", r.datas.length === 6, r.datas.join(", "));
}

bloco("2. FORMATOS E ANO");
ok("com ano completo", lerDatas("06/08/2026", hoje).datas[0] === "2026-08-06");
ok("com ano de dois dígitos", lerDatas("06/08/26", hoje).datas[0] === "2026-08-06");
ok("com um dígito no dia e no mês", lerDatas("6/8", hoje).datas[0] === "2026-08-06");
ok("com hífen", lerDatas("06-08", hoje).datas[0] === "2026-08-06");
ok("ISO passa direto", lerDatas("2026-08-06", hoje).datas[0] === "2026-08-06");
// Sem ano, aula é coisa que já aconteceu: dezembro é do ano passado, não do que vem.
ok("20/12 sem ano é do ano passado, não do futuro", lerDatas("20/12", hoje).datas[0] === "2025-12-20", lerDatas("20/12", hoje).datas[0]);
ok("aula de hoje continua sendo deste ano", lerDatas("15/09", hoje).datas[0] === "2026-09-15");
ok("31/02 não existe e não vira 03/03", lerDatas("31/02", hoje).datas.length === 0);
ok("texto sem data nenhuma não inventa", lerDatas("sem aula essa semana", hoje).datas.length === 0);

bloco("3. NÃO DOBRAR A CONTAGEM");
{
  const r = lerDatas("-06/08\n-06/08\n-07/08", hoje);
  ok("data repetida na lista conta uma vez", r.datas.length === 2 && r.repetidas.length === 1, JSON.stringify(r));
}

bloco("4. ONDE O PACOTE ESTÁ");
{
  const p = resumoDoPacote(14, 20);
  ok("14 de 20: faltam 6, não terminou", p.restantes === 6 && !p.terminou);
  ok("20 de 20: terminou", resumoDoPacote(20, 20).terminou);
  ok("21 de 20 (uma aula de cortesia): terminou, sem número negativo", resumoDoPacote(21, 20).terminou && resumoDoPacote(21, 20).restantes === 0);
  ok("sem tamanho contratado não é pacote", resumoDoPacote(5, null).contratadas === null && !resumoDoPacote(5, null).terminou);
  ok("tamanho zero não é pacote", !resumoDoPacote(5, 0).terminou);
}

bloco("5. A TELA HOJE COBRA PELA AULA, NÃO PELA DATA");
{
  const sla = { novo_lead_sem_contato_horas: 24, proposta_sem_follow_up_dias: 2, lead_parado_dias: 5, negociacao_antiga_dias: 7 };
  const roda = (clientes: Parameters<typeof prioridadesHoje>[0]["clientes"]) =>
    prioridadesHoje({ leads: [], tarefas: [], trials: [], clientes, sla, renovacaoDias: [30, 14, 7] }, hoje);

  // Renovação "vencida" há meses, mas ainda sobram 6 aulas: não é hora de cobrar.
  const sobrando = roda([{ id: "K1", contactId: "C1", nome: "Natalia", renewalDate: "2026-07-01", status: "ativo", pacote: { usadas: 14, contratadas: 20 } }]);
  ok("pacote com aula sobrando não aparece, mesmo com data vencida", sobrando.length === 0, JSON.stringify(sobrando));

  const fechou = roda([{ id: "K1", contactId: "C1", nome: "Natalia", renewalDate: "2026-12-01", status: "ativo", pacote: { usadas: 20, contratadas: 20 } }]);
  ok("pacote fechado aparece, mesmo com data lá na frente", fechou[0]?.grupo === "renovacao_pacote", JSON.stringify(fechou[0]));
  ok("motivo mostra a conta", /20 de 20 aulas/.test(fechou[0]?.motivo ?? ""), fechou[0]?.motivo);

  const jaCobrei = roda([{ id: "K1", contactId: "C1", nome: "Natalia", renewalDate: null, status: "ativo", pacote: { usadas: 20, contratadas: 20 }, proximaCobrancaEm: "2026-09-18T13:00:00Z" }]);
  ok("depois da mensagem, espera a resposta", jaCobrei.length === 0, JSON.stringify(jaCobrei));

  const insistiu = roda([{ id: "K1", contactId: "C1", nome: "Natalia", renewalDate: null, status: "ativo", pacote: { usadas: 20, contratadas: 20 }, cobrancas: 3 }]);
  ok("três mensagens sem resposta viram decisão, não a quarta", insistiu[0]?.grupo === "decidir", JSON.stringify(insistiu[0]));

  const pausado = roda([{ id: "K1", contactId: "C1", nome: "Natalia", renewalDate: null, status: "pausado", pacote: { usadas: 20, contratadas: 20 } }]);
  ok("aluno pausado não é cobrado", pausado.length === 0);
}

bloco("6. A MENSAGEM DO FIM DO PACOTE");
{
  const base: Sinais = {
    pergunta: "", indicador: "", pagina: "", anuncio: false, jaContatado: true, respondeu: false, followUpsNoCiclo: 0, pacoteTerminou: false,
    propostaEnviada: false, diasProposta: null, etapa: null, exigeExperimental: true, experimentalAgendada: false, experimentalRealizada: false, experimentalNoShow: false,
    cliente: { status: "ativo" } as Sinais["cliente"], renovaEm: 5, diasDeCliente: 200, diasForaDeTreino: null, jaIndicou: false,
  };
  ok("grupo do pacote leva à mensagem do pacote", escolherSituacao("renovacao_pacote", { ...base, pacoteTerminou: true }) === "renovacao_pacote");
  ok("pacote fechado ganha da data vencida", escolherSituacao(null, { ...base, pacoteTerminou: true, renovaEm: -40 }) === "renovacao_pacote");
  ok("sem pacote, a data vencida continua mandando", escolherSituacao(null, { ...base, renovaEm: -40 }) === "renovacao_vencida");
  ok("aluno mensal com renovação perto segue igual", escolherSituacao(null, { ...base, renovaEm: 5 }) === "renovacao_proxima");
}

console.log("\n" + "=".repeat(64) + `\n${falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} FALHA(S)`}\n` + "=".repeat(64));
if (falhas > 0) process.exit(1);
