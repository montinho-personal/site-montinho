/**
 * Testes das métricas do CRM — os casos do briefing, um por um.
 *   npx tsx scripts/crm-metricas-test.ts
 *
 * Cada KPI tem definição única em lib/crm/metricas.ts. Estes testes provam a
 * conta com dados fictícios e também os limites: divisão por zero vira null,
 * unknown não vira direct, gclid ausente não impede venda, duplicata sugere
 * merge em vez de mesclar.
 */
import {
  taxasFunil, showRate, winRate, ltvRealizado, mrrDoContrato, mrrNormalizado, movimentoMrr, cacMidia, ltvCac, paybackMeses,
  churnClientes, retencaoClientes, metricasIndicacao, atribuir, inferirFonte, normalizarTelefoneE164, possiveisDuplicatas,
  coortes, classificarLead, prioridadesHoje, anomalia, mediana, cicloDeVendaDias, primeiraResposta, valorPipeline,
  probabilidadeHistorica, coberturaAtribuicao, ltvProjetado, roasReceita, custoPorLead, slaFollowUp, tenureMeses,
  type EventoReceita, type Cliente, type Contrato,
} from "../lib/crm/metricas";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const perto = (a: number | null, b: number, tol = 1e-9) => a != null && Math.abs(a - b) <= tol;
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));

bloco("1. FUNIL");
{
  const t = taxasFunil({ leads: 100, contatos: 80, qualificados: 50, experimentaisAgendadas: 30, experimentaisRealizadas: 30, propostas: 20, vendas: 10 });
  ok("100 leads → 10 vendas = 10%", perto(t.leadParaVenda, 0.10));
  ok("lead → contato 80%", perto(t.leadParaContato, 0.8));
  ok("contato → qualificado 62,5%", perto(t.contatoParaQualificado, 0.625));
  ok("qualificado → experimental 60%", perto(t.qualificadoParaExperimental, 0.6));
  ok("proposta → venda 50%", perto(t.propostaParaVenda, 0.5));
  ok("maior queda apontada é Proposta → Venda (50%)", t.maiorQueda?.etapa === "Proposta → Venda", JSON.stringify(t.maiorQueda));
  const vazio = taxasFunil({ leads: 0, contatos: 0, qualificados: 0, experimentaisAgendadas: 0, experimentaisRealizadas: 0, propostas: 0, vendas: 0 });
  ok("funil vazio devolve null, não NaN nem 0", vazio.leadParaVenda === null && vazio.maiorQueda === null);
}
ok("show rate: 20 agendadas, 15 realizadas = 75%", perto(showRate(20, 15), 0.75));
ok("win rate: 20 propostas, 10 ganhas = 50%", perto(winRate(20, 10), 0.5));
ok("win rate sem proposta é null", winRate(0, 0) === null);

bloco("2. LTV E RECEITA");
{
  const ev: EventoReceita[] = [
    { clientId: "A", amount: 1000, tipo: "sale", occurredAt: "2026-01-10", status: "collected" },
    { clientId: "A", amount: 1000, tipo: "monthly_payment", occurredAt: "2026-02-10", status: "collected" },
    { clientId: "A", amount: 1000, tipo: "monthly_payment", occurredAt: "2026-03-10", status: "collected" },
    { clientId: "B", amount: 3000, tipo: "sale", occurredAt: "2026-01-10", status: "collected" },
    { clientId: "B", amount: -500, tipo: "refund", occurredAt: "2026-02-01", status: "collected" },
    { clientId: "B", amount: 900, tipo: "monthly_payment", occurredAt: "2026-04-01", status: "expected" },
  ];
  ok("LTV realizado A: 1000+1000+1000 = 3000", ltvRealizado(ev, "A") === 3000);
  ok("LTV com refund (líquido, o padrão): 3000 - 500 = 2500", ltvRealizado(ev, "B") === 2500);
  ok("LTV bruto sob demanda: 3000", ltvRealizado(ev, "B", { liquido: false }) === 3000);
  ok("receita apenas esperada NÃO entra no LTV realizado", ltvRealizado(ev, "B") === 2500);
}

bloco("3. MRR");
ok("plano mensal 1.200 = 1.200 de MRR", mrrDoContrato(1200, 1) === 1200);
ok("plano trimestral 1.200 = 400 de MRR normalizado", mrrDoContrato(1200, 3) === 400);
{
  const c: Contrato[] = [
    { clientId: "A", valor: 1200, cicloMeses: 1, inicio: "2026-01-01", fim: null, status: "ativo" },
    { clientId: "B", valor: 1200, cicloMeses: 3, inicio: "2026-01-01", fim: "2026-03-31", status: "encerrado" },
    { clientId: "C", valor: 600, cicloMeses: 1, inicio: "2026-05-01", fim: null, status: "ativo" },
    { clientId: "D", valor: 900, cicloMeses: 1, inicio: "2026-01-01", fim: "2026-02-28", status: "cancelado" },
  ];
  ok("MRR em fevereiro: 1200 + 400 + 900 = 2500", perto(mrrNormalizado(c, new Date("2026-02-15")), 2500));
  ok("MRR em maio: 1200 + 600 = 1800 (trimestral encerrado, D cancelado)", perto(mrrNormalizado(c, new Date("2026-05-15")), 1800));
  const m = movimentoMrr(c, new Date("2026-02-15"), new Date("2026-05-15"));
  ok("movimento: novo 600, perdido 400 (B) + 900 (D)", m.novo === 600 && perto(m.perdido, 1300), JSON.stringify(m));
}

bloco("4. CAC, LTV:CAC, PAYBACK, ROAS");
{
  const cac = cacMidia(5000, 10);
  ok("CAC de mídia: 5.000 / 10 clientes = 500", cac.valor === 500 && cac.rotulo === "media");
  ok("orgânico sem custo rastreado: 'custo não calculado', não zero", cacMidia(null, 8).valor === null && /não calculado/.test(cacMidia(null, 8).motivo!));
  ok("gasto sem cliente atribuído: null com motivo", cacMidia(3000, 0).valor === null);
  const lc = ltvCac(5000, 500, "observado");
  ok("LTV:CAC 5.000 / 500 = 10x, rotulado observado", lc.valor === 10 && lc.rotulo === "LTV:CAC observado");
  ok("LTV:CAC sem CAC é null com motivo", ltvCac(5000, null, "projetado").valor === null);
  const pb = paybackMeses(500, 250);
  ok("payback de receita: 500 / 250 por mês = 2 meses", pb.receitaMeses === 2 && pb.margemMeses === null && !pb.margemInformada);
  ok("payback de margem só com margem informada: 500 / (250×0,5) = 4", paybackMeses(500, 250, 0.5).margemMeses === 4);
  ok("ROAS de receita: 15.000 / 3.000 = 5x", roasReceita(15000, 3000) === 5);
  ok("CPL: 3.000 / 40 leads = 75", custoPorLead(3000, 40) === 75);
}

bloco("5. CHURN E RETENÇÃO");
ok("100 ativos, 5 cancelaram: churn 5%", perto(churnClientes(100, 5), 0.05));
ok("100, 95 permanecem: retenção 95%", perto(retencaoClientes(100, 95), 0.95));
ok("churn com zero ativos é null", churnClientes(0, 0) === null);
{
  const cl: Cliente[] = [
    { id: "A", firstPurchaseAt: "2026-01-05", sourceCode: "google_ads", status: "ativo" },
    { id: "B", firstPurchaseAt: "2026-01-20", sourceCode: "instagram_organic", status: "cancelado", cancelledAt: "2026-03-01" },
    { id: "C", firstPurchaseAt: "2026-02-03", sourceCode: "referral_client", status: "ativo", referredBy: "A" },
  ];
  const ev: EventoReceita[] = [
    { clientId: "A", amount: 1000, tipo: "sale", occurredAt: "2026-01-05", status: "collected" },
    { clientId: "A", amount: 1000, tipo: "monthly_payment", occurredAt: "2026-02-05", status: "collected" },
    { clientId: "A", amount: 1000, tipo: "monthly_payment", occurredAt: "2026-03-05", status: "collected" },
    { clientId: "B", amount: 800, tipo: "sale", occurredAt: "2026-01-20", status: "collected" },
    { clientId: "C", amount: 900, tipo: "sale", occurredAt: "2026-02-03", status: "collected" },
  ];
  const co = coortes(cl, ev, new Date("2026-04-15"));
  const jan = co.find((c) => c.coorte === "2026-01")!;
  ok("coorte Jan/2026 tem 2 clientes e mix de fontes", jan.clientes === 2 && jan.fontes.google_ads === 1 && jan.fontes.instagram_organic === 1);
  ok("receita 30 dias da coorte Jan: 1000 + 800 = 1800", jan.receita.d30 === 1800, JSON.stringify(jan.receita));
  ok("retenção M1 da coorte Jan: 1 de 2 (A pagou em fev, B não) = 50%", perto(jan.retencao.M1, 0.5), JSON.stringify(jan.retencao));
  ok("M6 ainda não chegou: null, não zero", jan.retencao.M6 === null);
  ok("coorte pequena vem marcada", jan.amostraPequena === true);
  const proj = ltvProjetado(cl, ev, new Date("2026-04-15"));
  ok("LTV projetado com 3 clientes: null e motivo 'imatura'", proj.valor === null && /imatura/i.test(proj.motivo));
  const t = tenureMeses(cl, new Date("2026-04-15"));
  ok("tenure calcula mediana", t.mediana != null && t.n === 3);
}

bloco("6. INDICAÇÕES");
{
  const cl: Cliente[] = [
    { id: "A", firstPurchaseAt: "2026-01-05", sourceCode: "google_ads", status: "ativo" },
    { id: "B", firstPurchaseAt: "2026-01-20", sourceCode: "referral_client", status: "ativo", referredBy: "A" },
    { id: "C", firstPurchaseAt: "2026-02-03", sourceCode: "referral_client", status: "ativo", referredBy: "A" },
    { id: "D", firstPurchaseAt: "2026-02-03", sourceCode: "instagram_organic", status: "ativo" },
  ];
  const r = metricasIndicacao(cl, 20, 8, []);
  ok("20 leads indicados, 8 vendas: conversão 40%", perto(r.referralConversionRate, 0.4));
  ok("referral rate: 1 de 4 clientes indicou = 25%", perto(r.referralRate, 0.25));
  ok("2 indicações por indicador", r.indicacoesPorIndicador === 2);
}

bloco("7. ATRIBUIÇÃO");
{
  const a = atribuir([
    { occurredAt: "2026-08-01T10:00:00Z", sourceCode: "google_organic" },
    { occurredAt: "2026-08-03T10:00:00Z", sourceCode: "instagram_organic" },
    { occurredAt: "2026-08-05T10:00:00Z", sourceCode: "direct" },
  ], "2026-08-03T12:00:00Z");
  ok("first touch = Google orgânico", a.firstTouch?.sourceCode === "google_organic");
  ok("lead creation touch = Instagram", a.leadCreationTouch?.sourceCode === "instagram_organic");
  ok("last non-direct = Instagram (direto não apaga o papel dos outros)", a.lastNonDirect?.sourceCode === "instagram_organic");
  ok("last touch bruto = Direct, preservado", a.lastTouch?.sourceCode === "direct");
  const u = atribuir([{ occurredAt: "2026-08-01T10:00:00Z", sourceCode: "unknown" }]);
  ok("só unknown continua unknown, não vira direct", u.firstTouch?.sourceCode === "unknown" && u.lastNonDirect?.sourceCode === "unknown");
  ok("sem toques: tudo null", atribuir([]).firstTouch === null);
  const multi = atribuir([
    { occurredAt: "2026-08-01T10:00:00Z", sourceCode: "google_organic" },
    { occurredAt: "2026-08-02T10:00:00Z", sourceCode: "youtube" },
    { occurredAt: "2026-08-03T10:00:00Z", sourceCode: "instagram_organic" },
    { occurredAt: "2026-08-04T10:00:00Z", sourceCode: "google_ads" },
  ], "2026-08-04T11:00:00Z");
  ok("assistidos = os do meio (YouTube, Instagram)", multi.assisted.map((t) => t.sourceCode).join() === "youtube,instagram_organic", multi.assisted.map((t) => t.sourceCode).join());
}
ok("gclid presente → google_ads, confiança alta", inferirFonte({ gclid: "abc" }).sourceCode === "google_ads" && inferirFonte({ gclid: "abc" }).confidence === "high");
ok("utm instagram/organic_social → instagram_organic", inferirFonte({ utmSource: "instagram", utmMedium: "organic_social" }).sourceCode === "instagram_organic");
ok("utm instagram/paid → instagram_ads", inferirFonte({ utmSource: "instagram", utmMedium: "paid_social" }).sourceCode === "instagram_ads");
ok("referrer google sem utm → google_organic, confiança média", inferirFonte({ referrer: "https://www.google.com/" }).sourceCode === "google_organic" && inferirFonte({ referrer: "https://www.google.com/" }).confidence === "medium");
ok("nada → unknown, confiança baixa", inferirFonte({}).sourceCode === "unknown" && inferirFonte({}).confidence === "low");
ok("código de indicação → referral_client", inferirFonte({ referralCode: "ABCD" }).sourceCode === "referral_client");
ok("cobertura de atribuição: 3 de 4 vendas com fonte = 75%", perto(coberturaAtribuicao([{ sourceCode: "google_ads" }, { sourceCode: "unknown" }, { sourceCode: "referral_client" }, { sourceCode: "direct" }]), 0.75));
ok("cobertura por receita pondera pelo valor", perto(coberturaAtribuicao([{ sourceCode: "google_ads", peso: 900 }, { sourceCode: "unknown", peso: 100 }]), 0.9));

bloco("8. TEMPO, PIPELINE, SLA");
ok("mediana ignora extremo: [1,2,3,100] = 2,5", mediana([1, 2, 3, 100]) === 2.5);
{
  const c = cicloDeVendaDias([{ createdAt: "2026-08-01", wonAt: "2026-08-08" }, { createdAt: "2026-08-01", wonAt: "2026-08-15" }, { createdAt: "2026-08-01", wonAt: "2026-09-30" }]);
  ok("ciclo de venda: mediana 14, média 27 (o extremo de 60 dias puxa a média)", c.mediana === 14 && c.media === 27);
  const r = primeiraResposta([{ createdAt: "2026-08-01T10:00:00Z", firstResponseAt: "2026-08-01T10:03:00Z" }, { createdAt: "2026-08-01T10:00:00Z", firstResponseAt: "2026-08-01T12:00:00Z" }, { createdAt: "2026-08-01T10:00:00Z", firstResponseAt: null }]);
  ok("primeira resposta: 50% em 5 min, 100% em 24h, 1 sem resposta", perto(r.ate5min, 0.5) && perto(r.ate24h, 1) && r.semResposta === 1);
  const pv = valorPipeline([{ expectedValue: 1000, probability: null, stageProbability: 0.5 }, { expectedValue: 2000, probability: 0.25, stageProbability: 0.5 }, { expectedValue: null, probability: null, stageProbability: 0.5 }]);
  ok("pipeline bruto 3000, ponderado 500+500 = 1000, 1 sem valor", pv.bruto === 3000 && pv.ponderado === 1000 && pv.semValor === 1);
  const ph = probabilidadeHistorica([...Array(20)].map((_, i) => ({ stageCode: "proposta", ganhou: i < 12 })).concat([{ stageCode: "novo", ganhou: true }]), 20);
  ok("probabilidade histórica com amostra: proposta 60%; sem amostra: null", perto(ph.proposta, 0.6) && ph.novo === null);
  ok("SLA de follow-up: 1 no prazo de 2 vencidas = 50%", perto(slaFollowUp([{ dueAt: "2026-08-01", completedAt: "2026-07-31" }, { dueAt: "2026-08-01", completedAt: "2026-08-05" }, { dueAt: "2099-01-01", completedAt: null }], new Date("2026-08-10")), 0.5));
}

bloco("9. LEAD SCORING EXPLICÁVEL E TELA HOJE");
{
  const q = classificarLead({ diasDesdeUltimoContato: 0, respondeu: true, pediuPreco: true, pediuHorario: true, experimentalAgendada: true, experimentalRealizada: true, propostaEnviada: false, respondeuProposta: false, interacoes: 4, intencaoDeclarada: false });
  ok("experimental realizada + horário + preço + respondeu hoje = quente, com motivos", q.temperatura === "quente" && q.motivos.includes("experimental realizada"));
  const f = classificarLead({ diasDesdeUltimoContato: 12, respondeu: false, pediuPreco: false, pediuHorario: false, experimentalAgendada: false, experimentalRealizada: false, propostaEnviada: false, respondeuProposta: false, interacoes: 1, intencaoDeclarada: false });
  ok("12 dias sem resposta = frio, motivo explica", f.temperatura === "frio" && f.motivos.some((m) => /dias sem contato/.test(m)));
  const agora = new Date("2026-09-04T12:00:00-03:00");
  const hoje = prioridadesHoje({
    leads: [
      { id: "L1", contactId: "C1", nome: "Fernanda", status: "aberto", createdAt: "2026-09-03T06:00:00-03:00", lastContactAt: null, firstResponseAt: null, nextAction: null, nextActionAt: null, stageCode: "novo", proposalSentAt: null, expectedValue: 800 },
      { id: "L2", contactId: "C2", nome: "Mariana", status: "aberto", createdAt: "2026-08-20", lastContactAt: "2026-09-02T10:00:00-03:00", firstResponseAt: "2026-08-20", nextAction: "Follow-up", nextActionAt: "2026-09-05", stageCode: "proposta", proposalSentAt: "2026-09-02T10:00:00-03:00", expectedValue: 1200 },
      { id: "L3", contactId: "C3", nome: "Ricardo", status: "aberto", createdAt: "2026-08-25", lastContactAt: "2026-09-03", firstResponseAt: "2026-08-25", nextAction: null, nextActionAt: "2026-09-06", stageCode: "experimental_realizada", proposalSentAt: null, expectedValue: 1000 },
      { id: "L4", contactId: "C4", nome: "Ganho", status: "ganho", createdAt: "2026-08-01", lastContactAt: null, firstResponseAt: null, nextAction: null, nextActionAt: null, stageCode: "ganho", proposalSentAt: null, expectedValue: null },
    ],
    tarefas: [{ id: "T1", leadId: "L2", clientId: null, contactId: "C2", nome: "Mariana", titulo: "Ligar", dueAt: "2026-09-03T09:00:00-03:00", priority: "alta" }],
    trials: [{ id: "X1", leadId: "L3", contactId: "C3", nome: "Ricardo", scheduledAt: "2026-09-04T18:00:00-03:00", status: "agendada" }],
    clientes: [{ id: "K1", contactId: "C9", nome: "Elias", renewalDate: "2026-09-10", status: "ativo" }],
    sla: { novo_lead_sem_contato_horas: 24, proposta_sem_follow_up_dias: 2, lead_parado_dias: 5, negociacao_antiga_dias: 7 },
    renovacaoDias: [30, 14, 7],
  }, agora);
  const por = Object.fromEntries(hoje.map((i) => [i.nome, i]));
  ok("Fernanda: lead novo sem retorno há 30h vem em prioridade 1", por.Fernanda?.prioridade === 1 && /30h/.test(por.Fernanda.motivo), por.Fernanda?.motivo);
  ok("Mariana: follow-up atrasado + proposta sem follow-up, um card só", por.Mariana?.prioridade === 2 && /atrasado/.test(por.Mariana.motivo) && /Proposta/.test(por.Mariana.motivo), por.Mariana?.motivo);
  ok("Ricardo: pós-experimental sem proposta, ação 'Enviar proposta'", por.Ricardo?.acao === "Enviar proposta", por.Ricardo?.acao);
  ok("Elias: renovação em 6 dias entra", /Renovação em 6 dias/.test(por.Elias?.motivo ?? ""), por.Elias?.motivo);
  ok("lead ganho não aparece", !por.Ganho);
  ok("ordem: prioridade crescente", hoje.every((x, i) => i === 0 || hoje[i - 1].prioridade <= x.prioridade));
}

bloco("10. ANOMALIA COM AMOSTRA MÍNIMA");
ok("2 leads vs 1 NÃO dispara alerta", !anomalia("Leads", 1, 2).alerta);
ok("40 → 20 leads dispara (-50%)", anomalia("Leads", 20, 40).alerta && /-50%/.test(anomalia("Leads", 20, 40).texto));
ok("40 → 35 não dispara (-12%)", !anomalia("Leads", 35, 40).alerta);

bloco("11. DEDUPLICAÇÃO");
ok("(11) 98106-3409 → +5511981063409", normalizarTelefoneE164("(11) 98106-3409") === "+5511981063409");
ok("55 11 98106 3409 → +5511981063409", normalizarTelefoneE164("55 11 98106 3409") === "+5511981063409");
ok("texto sem número → null, não inventa", normalizarTelefoneE164("sem telefone") === null);
{
  const d = possiveisDuplicatas([
    { id: "1", telefoneE164: "+5511981063409", email: "a@x.com" },
    { id: "2", telefoneE164: "+5511981063409", email: null },
    { id: "3", telefoneE164: null, email: "A@X.COM" },
    { id: "4", telefoneE164: "+5511900000000", email: "b@x.com" },
  ]);
  ok("mesmo telefone em dois leads: sugere merge (não mescla)", d.some((x) => x.motivo === "mesmo telefone" && x.b.id === "2"));
  ok("mesmo e-mail (case-insensitive): sugere merge", d.some((x) => x.motivo === "mesmo e-mail" && x.b.id === "3"));
  ok("contato distinto não é acusado", !d.some((x) => x.a.id === "4" || x.b.id === "4"));
}

bloco("12. O QUE NÃO PODE TRAVAR");
{
  // gclid ausente não impede venda: a atribuição fica unknown/low e a venda segue.
  const semGclid = inferirFonte({ utmSource: null, gclid: null });
  ok("venda sem gclid: fonte unknown, confiança baixa — e a conta de LTV segue igual", semGclid.sourceCode === "unknown" && ltvRealizado([{ clientId: "Z", amount: 500, tipo: "sale", occurredAt: "2026-09-01", status: "collected" }], "Z") === 500);
  // WhatsApp: pessoa apagou o código → nenhuma associação automática (confiança fica a cargo de quem liga).
  ok("sem ref code, inferirFonte não inventa origem a partir do nada", inferirFonte({ referrer: "" }).sourceCode === "unknown");
}

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
