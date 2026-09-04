/**
 * Visões derivadas para as telas: lead enriquecido (contato, etapa,
 * temperatura), dados da tela Hoje, funil por período. Tudo calculado em
 * memória a partir de `base()` e `catalogo()`, com as funções de metricas.ts.
 */
import type { Base, Catalogo } from "./dados";
import { etapaAtual, oportunidadeAtiva } from "./dados";
import { classificarLead, diasEntre, prioridadesHoje, type ContagemFunil, type ItemHoje } from "./metricas";
import type { Atividade, ClienteRow, Contato, Etapa, Experimental, Lead, Oportunidade, Tarefa } from "./tipos";

export interface LeadVisao {
  lead: Lead; contato: Contato; opp: Oportunidade | undefined; etapa: Etapa | undefined; servicoNome: string;
  fonteNome: string; temperatura: "quente" | "morno" | "frio"; motivos: string[]; atividades: Atividade[]; tarefas: Tarefa[]; experimentais: Experimental[];
  cliente: ClienteRow | undefined;
}

export function visaoLead(b: Base, cat: Catalogo, lead: Lead, agora = new Date()): LeadVisao | null {
  const contato = b.contatos.find((c) => c.id === lead.contact_id);
  if (!contato) return null;
  const opp = oportunidadeAtiva(b, lead.id);
  const etapa = etapaAtual(cat, opp);
  const atividades = b.atividades.filter((a) => a.lead_id === lead.id || (a.contact_id === lead.contact_id && !a.lead_id));
  const tarefas = b.tarefas.filter((t) => t.lead_id === lead.id);
  const experimentais = b.experimentais.filter((t) => t.lead_id === lead.id);
  const texto = atividades.map((a) => (a.descricao ?? "").toLowerCase()).join(" ");
  const ultimo = lead.last_contact_at ? diasEntre(lead.last_contact_at, agora) : null;
  const { temperatura, motivos } = classificarLead({
    diasDesdeUltimoContato: ultimo, respondeu: !!lead.first_response_at,
    pediuPreco: /pre[çc]o|valor|quanto custa|mensalidade/.test(texto), pediuHorario: /hor[áa]rio|agenda|que horas|dispon/.test(texto),
    experimentalAgendada: experimentais.some((t) => t.status === "agendada"), experimentalRealizada: experimentais.some((t) => t.status === "realizada"),
    propostaEnviada: !!opp?.proposal_sent_at, respondeuProposta: !!opp?.proposal_sent_at && !!lead.last_contact_at && lead.last_contact_at > opp.proposal_sent_at,
    interacoes: atividades.filter((a) => ["message", "call", "meeting", "follow_up"].includes(a.tipo)).length, intencaoDeclarada: /quero come[çc]ar|fechar|vamos|topo/.test(texto),
  }, { quenteMin: Number(cat.config.lead_scoring?.quente_min ?? 5), mornoMin: Number(cat.config.lead_scoring?.morno_min ?? 2) });
  return {
    lead, contato, opp, etapa, servicoNome: cat.servicos.find((s) => s.id === (opp?.service_id ?? lead.service_id))?.nome ?? "—",
    fonteNome: cat.fontes.find((f) => f.code === lead.source_code)?.nome ?? lead.source_code, temperatura: temperatura as LeadVisao["temperatura"], motivos,
    atividades, tarefas, experimentais, cliente: b.clientes.find((c) => c.contact_id === lead.contact_id),
  };
}

export function todasVisoes(b: Base, cat: Catalogo, agora = new Date()): LeadVisao[] {
  return b.leads.map((l) => visaoLead(b, cat, l, agora)).filter((x): x is LeadVisao => !!x);
}

export function itensHoje(b: Base, cat: Catalogo, visoes: LeadVisao[], agora = new Date()): ItemHoje[] {
  const sla = { novo_lead_sem_contato_horas: 24, proposta_sem_follow_up_dias: 2, lead_parado_dias: 5, negociacao_antiga_dias: 7, ...(cat.config.sla ?? {}) };
  const renovacaoDias = (cat.config.renovacao?.alertas_dias_antes as number[] | undefined) ?? [30, 14, 7];
  const nome = (id: string) => b.contatos.find((c) => c.id === id)?.nome ?? "Contato";
  return prioridadesHoje({
    leads: visoes.map((v) => ({ id: v.lead.id, contactId: v.contato.id, nome: v.contato.nome, status: v.lead.status, createdAt: v.lead.created_at, lastContactAt: v.lead.last_contact_at, firstResponseAt: v.lead.first_response_at, nextAction: v.lead.next_action, nextActionAt: v.lead.next_action_at, stageCode: v.etapa?.code ?? null, proposalSentAt: v.opp?.proposal_sent_at ?? null, expectedValue: v.opp?.expected_value ?? null, temperatura: v.temperatura, opportunityId: v.opp?.id })),
    tarefas: b.tarefas.filter((t) => !t.completed_at).map((t) => ({ id: t.id, leadId: t.lead_id, clientId: t.client_id, contactId: t.contact_id, nome: t.contact_id ? nome(t.contact_id) : "—", titulo: t.titulo, dueAt: t.due_at, priority: t.priority })),
    trials: b.experimentais.map((t) => ({ id: t.id, leadId: t.lead_id, contactId: t.contact_id, nome: nome(t.contact_id), scheduledAt: t.scheduled_at, status: t.status })),
    clientes: b.clientes.map((c) => ({ id: c.id, contactId: c.contact_id, nome: nome(c.contact_id), renewalDate: c.renewal_date, status: c.status })),
    sla, renovacaoDias,
  }, agora);
}

/** Contagem do funil para leads criados no período (coorte por criação). */
export function contagemFunil(b: Base, cat: Catalogo, de: Date, ate: Date): ContagemFunil {
  const leads = b.leads.filter((l) => new Date(l.created_at) >= de && new Date(l.created_at) <= ate);
  const ids = new Set(leads.map((l) => l.id));
  const opps = b.oportunidades.filter((o) => ids.has(o.lead_id));
  const passou = (code: string) => {
    const etapasCode = new Set(cat.etapas.filter((e) => e.code === code).map((e) => e.id));
    const oppIds = new Set(b.historicoEtapas.filter((h) => etapasCode.has(h.to_stage_id)).map((h) => h.opportunity_id));
    return opps.filter((o) => oppIds.has(o.id) || etapasCode.has(o.stage_id)).length;
  };
  const trials = b.experimentais.filter((t) => t.lead_id && ids.has(t.lead_id));
  return {
    leads: leads.length,
    contatos: leads.filter((l) => l.first_response_at || l.last_contact_at).length,
    qualificados: Math.max(passou("qualificado"), opps.filter((o) => o.proposal_sent_at || o.won_at).length),
    experimentaisAgendadas: trials.length,
    experimentaisRealizadas: trials.filter((t) => t.status === "realizada").length,
    propostas: opps.filter((o) => o.proposal_sent_at).length,
    vendas: opps.filter((o) => o.won_at).length,
  };
}

export const inicioDoMes = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1);
export const mesAnterior = (d = new Date()) => ({ de: new Date(d.getFullYear(), d.getMonth() - 1, 1), ate: new Date(d.getFullYear(), d.getMonth(), 0, 23, 59, 59) });
