/**
 * Panorama de renovações (/crm/renovacoes).
 *   npx tsx scripts/crm-renovacoes-test.ts
 */
import { panoramaRenovacoes } from "../lib/crm/renovacoes";
import { dataBr } from "../components/crm/ui";
import type { Base, Catalogo } from "../lib/crm/dados";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => { console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`); if (!cond) falhas++; };

const agora = new Date("2026-10-19T12:00:00-03:00");
const cli = (id: string, renewal: string | null, service = "s-on", status = "ativo") => ({ id, contact_id: `c-${id}`, status, service_id: service, current_plan_id: "p1", renewal_date: renewal, first_purchase_at: "2026-02-27", cancelled_at: null, updated_at: "2026-09-01" });
const b = {
  contatos: ["vencida", "semana", "mes", "depois", "semdata", "pacfim", "pac", "pausado", "cobrada"].map((x) => ({ id: `c-${x}`, nome: x, telefone_e164: "+5511999999999" })),
  clientes: [cli("vencida", "2026-10-01"), cli("semana", "2026-10-23", "s-pre"), cli("mes", "2026-11-10"), cli("depois", "2027-01-10"), cli("semdata", null), cli("pacfim", "2026-12-01", "s-flex"), cli("pac", "2026-10-01", "s-flex"), cli("pausado", "2026-10-01", "s-on", "pausado"), cli("cobrada", "2026-10-05")],
  contratos: [
    { id: "k-v", client_id: "vencida", status: "ativo", inicio: "2026-07-01", plan_id: "p1", valor: 399, ciclo_meses: 3, sessoes_contratadas: null },
    { id: "k-pf", client_id: "pacfim", status: "ativo", inicio: "2026-09-01", plan_id: "p2", valor: 900, ciclo_meses: 1, sessoes_contratadas: 2 },
    { id: "k-p", client_id: "pac", status: "ativo", inicio: "2026-09-01", plan_id: "p2", valor: 900, ciclo_meses: 1, sessoes_contratadas: 10 },
  ],
  aulas: [{ client_id: "pacfim", contract_id: "k-pf", data: "2026-09-10" }, { client_id: "pacfim", contract_id: "k-pf", data: "2026-09-17" }, { client_id: "pac", contract_id: "k-p", data: "2026-09-10" }],
  tarefas: [{ client_id: "cobrada", tipo: "renovacao", completed_at: null, due_at: "2026-10-22T10:00:00Z" }],
  atividades: [1, 2, 3].map((n) => ({ client_id: "cobrada", tipo: "message", metadata: { grupo: "renovacao_vencida" }, ocorreu_em: `2026-10-0${5 + n}T12:00:00Z` })),
} as unknown as Base;
const cat = { servicos: [{ id: "s-on", nome: "Consultoria online", code: "online" }, { id: "s-pre", nome: "Personal presencial", code: "presencial" }, { id: "s-flex", nome: "Pacote flexível", code: "flexivel" }], planos: [{ id: "p1", nome: "Consultoria trimestral" }, { id: "p2", nome: "Pacote 10 aulas" }] } as unknown as Catalogo;

const p = panoramaRenovacoes(b, cat, agora);
const l = (id: string) => p.find((x) => x.clientId === id);
ok("só cliente ativo entra", !l("pausado") && p.length === 8);
ok("vencida: 18 dias, botão de renovação vencida", l("vencida")?.faixa === "vencida" && l("vencida")?.dias === -18 && l("vencida")?.grupo === "renovacao_vencida", JSON.stringify(l("vencida")));
ok("vencida traz valor e ciclo do contrato", l("vencida")?.valor === 399 && l("vencida")?.cicloMeses === 3);
ok("até 7 dias: botão de renovação próxima", l("semana")?.faixa === "semana" && l("semana")?.grupo === "renovacao_proxima");
ok("8 a 30 dias: também tem botão (janela de alerta de 30 dias)", l("mes")?.faixa === "mes" && l("mes")?.grupo === "renovacao_proxima");
ok("mais de 30 dias: no mapa, sem botão", l("depois")?.faixa === "depois" && l("depois")?.grupo === null);
ok("sem data: no mapa, sem botão", l("semdata")?.faixa === "sem_data" && l("semdata")?.grupo === null);
ok("pacote com todas as aulas dadas: pacote terminou, texto do pacote", l("pacfim")?.faixa === "pacote_fim" && l("pacfim")?.grupo === "renovacao_pacote");
ok("pacote em andamento ignora a data vencida e não tem botão", l("pac")?.faixa === "pacote" && l("pac")?.grupo === null && l("pac")?.pacote?.usadas === 1);
ok("3 cobranças: pede decisão em vez da quarta mensagem", l("cobrada")?.cobrancas === 3 && l("cobrada")?.decidir === true);
ok("tarefa aberta no futuro: aguardando resposta", l("cobrada")?.aguardandoAte === "2026-10-22T10:00:00Z");
ok("ordem: vencidas primeiro, depois pacote terminado, depois a semana", p[0].faixa === "vencida" && p.findIndex((x) => x.faixa === "pacote_fim") < p.findIndex((x) => x.faixa === "semana"));
ok("vencida há mais tempo vem antes", p.filter((x) => x.faixa === "vencida").map((x) => x.clientId).join() === "vencida,cobrada");
ok("data pura não volta um dia no fuso de Brasília", dataBr("2026-10-01") === "01/10/2026", dataBr("2026-10-01"));
ok("timestamp continua no fuso de Brasília", dataBr("2026-10-01T02:00:00Z") === "30/09/2026", dataBr("2026-10-01T02:00:00Z"));

console.log("\n" + "=".repeat(64));
if (falhas) { console.log(`${falhas} TESTE(S) FALHARAM`); process.exit(1); }
console.log("TODOS OS TESTES PASSARAM");
