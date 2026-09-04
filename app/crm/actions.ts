"use server";

/**
 * Ações do CRM. Toda ação: (1) exige usuário com permissão de escrita,
 * (2) escreve com a sessão dele (RLS), (3) registra atividade na timeline,
 * (4) revalida as telas. As regras do briefing moram aqui e no banco:
 *  - ganho exige serviço, plano, valor e data → cria cliente, contrato e
 *    evento de receita;
 *  - perdido exige motivo;
 *  - proposta enviada cria follow-up automático;
 *  - experimental realizada cria tarefa de proposta; no-show cria reativação.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirAdmin, exigirEscrita, exigirUsuario } from "@/lib/crm/auth";
import { supabaseServer } from "@/lib/crm/supabase/server";
import { gerarRefCode } from "@/lib/crm/tracking";
import { inferirFonte } from "@/lib/crm/metricas";

const REVALIDAR = ["/crm", "/crm/leads", "/crm/pipeline", "/crm/clientes", "/crm/follow-ups", "/crm/agenda", "/crm/analytics", "/crm/indicacoes", "/crm/handoffs"];
function revalidarTudo(extra: string[] = []) { for (const p of [...REVALIDAR, ...extra]) revalidatePath(p, "layout"); }
const s = (fd: FormData, k: string) => { const v = fd.get(k); return typeof v === "string" && v.trim() ? v.trim() : null; };
const n = (fd: FormData, k: string) => { const v = s(fd, k); if (v == null) return null; const x = Number(v.replace(/\./g, "").replace(",", ".")); return Number.isFinite(x) ? x : null; };
const dt = (fd: FormData, k: string) => { const v = s(fd, k); return v ? new Date(v).toISOString() : null; };
const hoje = () => new Date().toISOString().slice(0, 10);
function addDias(base: Date, dias: number) { const d = new Date(base); d.setDate(d.getDate() + dias); return d; }
function addMeses(base: Date, meses: number) { const d = new Date(base); d.setMonth(d.getMonth() + Math.round(meses)); return d; }
async function erroSe(r: { error: { message: string } | null }, ctx: string) { if (r.error) throw new Error(`${ctx}: ${r.error.message}`); }

async function atividade(sb: any, uid: string, a: { contact_id?: string | null; lead_id?: string | null; opportunity_id?: string | null; client_id?: string | null; tipo: string; descricao?: string | null; metadata?: Record<string, unknown>; ocorreu_em?: string }) {
  await erroSe(await sb.from("crm_activities").insert({ ...a, created_by: uid }), "atividade");
}
async function tarefa(sb: any, uid: string, t: { contact_id?: string | null; lead_id?: string | null; opportunity_id?: string | null; client_id?: string | null; tipo: string; titulo: string; due_at: string; priority?: string; origem?: string }) {
  await erroSe(await sb.from("crm_tasks").insert({ priority: "media", origem: "automacao", owner_id: uid, created_by: uid, ...t }), "tarefa");
}
async function etapaPorCodigo(sb: any, pipelineId: string, code: string) {
  const { data } = await sb.from("crm_stages").select("*").eq("pipeline_id", pipelineId).eq("code", code).maybeSingle();
  if (!data) throw new Error(`Etapa ${code} não existe neste pipeline.`);
  return data;
}

// ---------------------------------------------------------------------------
// Contato + Lead
// ---------------------------------------------------------------------------
export async function criarLead(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const nome = s(fd, "nome"); if (!nome) throw new Error("Nome é obrigatório.");
  let contactId = s(fd, "contact_id");
  const refCode = s(fd, "ref_code")?.toUpperCase() ?? null;
  const indicadorId = s(fd, "referred_by_contact_id");
  if (!contactId) {
    const { data, error } = await sb.from("crm_contacts").insert({
      nome, telefone: s(fd, "telefone"), email: s(fd, "email"), instagram: s(fd, "instagram"), cidade: s(fd, "cidade"),
      como_conheceu: s(fd, "como_conheceu"), referred_by_contact_id: indicadorId, created_by: u.id,
    }).select("id").single();
    if (error) throw new Error(`contato: ${error.message}`);
    contactId = data.id;
  }
  // Handoff pelo código de referência → origem com confiança alta.
  let handoff: any = null;
  if (refCode) {
    const { data } = await sb.from("crm_whatsapp_handoffs").select("*").eq("ref_code", refCode).maybeSingle();
    handoff = data;
  }
  let sourceCode = s(fd, "source_code") ?? "unknown";
  let confidence: "high" | "medium" | "low" = s(fd, "source_code") ? "medium" : "low";
  if (indicadorId) { sourceCode = "referral_client"; confidence = "high"; }
  if (handoff) { sourceCode = handoff.source_code ?? sourceCode; confidence = handoff.source_code && handoff.source_code !== "unknown" ? "high" : confidence; }
  const serviceId = s(fd, "service_id");
  const { data: lead, error: el } = await sb.from("crm_leads").insert({
    contact_id: contactId, service_id: serviceId, interesse: s(fd, "interesse"), source_code: sourceCode, source_detail: s(fd, "source_detail"),
    attribution_confidence: confidence, handoff_id: handoff?.id ?? null, referred_by_contact_id: indicadorId, owner_id: u.id,
    next_action: s(fd, "next_action") ?? "Primeiro contato", next_action_at: dt(fd, "next_action_at") ?? new Date().toISOString(), created_by: u.id,
    created_at: dt(fd, "created_at") ?? undefined,
  }).select("id, created_at").single();
  if (el) throw new Error(`lead: ${el.message}`);
  // Pipeline do serviço (ou presencial por padrão)
  const { data: servico } = serviceId ? await sb.from("crm_services").select("code").eq("id", serviceId).single() : { data: null };
  const { data: pipe } = await sb.from("crm_pipelines").select("*").eq("code", servico?.code ?? "presencial").single();
  const novo = await etapaPorCodigo(sb, pipe.id, "novo");
  const { data: opp, error: eo } = await sb.from("crm_opportunities").insert({
    lead_id: lead.id, contact_id: contactId, pipeline_id: pipe.id, stage_id: novo.id, service_id: serviceId, expected_value: n(fd, "expected_value"), created_by: u.id,
  }).select("id").single();
  if (eo) throw new Error(`oportunidade: ${eo.message}`);
  if (handoff) {
    await sb.from("crm_whatsapp_handoffs").update({ contact_id: contactId, lead_id: lead.id, linked_at: new Date().toISOString(), link_confidence: "high" }).eq("id", handoff.id);
    await sb.from("crm_attribution_touches").insert({
      contact_id: contactId, handoff_id: handoff.id, occurred_at: handoff.created_at, source_code: handoff.source_code ?? "unknown",
      medium: handoff.utm_medium, campaign: handoff.utm_campaign, content: handoff.utm_content, term: handoff.utm_term, landing_page: handoff.landing_page,
      referrer: handoff.referrer, page_url: handoff.page_url, cta_id: handoff.cta_id, utm_source: handoff.utm_source, utm_medium: handoff.utm_medium,
      utm_campaign: handoff.utm_campaign, utm_content: handoff.utm_content, utm_term: handoff.utm_term, gclid: handoff.gclid, gbraid: handoff.gbraid,
      wbraid: handoff.wbraid, fbclid: handoff.fbclid, session_id: handoff.session_id, confidence: "high", origem_registro: "site",
    });
    const ft = handoff.first_touch as any;
    if (ft && ft.at && (ft.utm_source || ft.gclid || ft.referrer)) {
      const f = inferirFonte({ utmSource: ft.utm_source, utmMedium: ft.utm_medium, gclid: ft.gclid, gbraid: ft.gbraid, wbraid: ft.wbraid, fbclid: ft.fbclid, referrer: ft.referrer, referralCode: ft.ref });
      await sb.from("crm_attribution_touches").insert({ contact_id: contactId, occurred_at: ft.at, source_code: f.sourceCode, campaign: ft.utm_campaign, content: ft.utm_content, landing_page: ft.landing, referrer: ft.referrer, utm_source: ft.utm_source, utm_medium: ft.utm_medium, utm_campaign: ft.utm_campaign, utm_content: ft.utm_content, gclid: ft.gclid, gbraid: ft.gbraid, wbraid: ft.wbraid, fbclid: ft.fbclid, confidence: "medium", origem_registro: "site" });
    }
  } else if (sourceCode !== "unknown") {
    await sb.from("crm_attribution_touches").insert({ contact_id: contactId, occurred_at: lead.created_at, source_code: sourceCode, campaign: s(fd, "source_detail"), confidence, origem_registro: "manual" });
  }
  await atividade(sb, u.id, { contact_id: contactId, lead_id: lead.id, opportunity_id: opp.id, tipo: "lead_created", descricao: `Lead criado (${sourceCode})`, ocorreu_em: lead.created_at });
  if (indicadorId) await atividade(sb, u.id, { contact_id: indicadorId, tipo: "referral", descricao: `Indicou ${nome}`, metadata: { lead_id: lead.id } });
  revalidarTudo();
  redirect(`/crm/leads/${lead.id}`);
}

export async function atualizarContato(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const id = s(fd, "contact_id")!;
  await erroSe(await sb.from("crm_contacts").update({
    nome: s(fd, "nome"), telefone: s(fd, "telefone"), email: s(fd, "email"), instagram: s(fd, "instagram"), cidade: s(fd, "cidade"), como_conheceu: s(fd, "como_conheceu"), observacoes: s(fd, "observacoes"),
    consent_marketing: fd.get("consent_marketing") === "on" ? true : fd.get("consent_marketing") === "off" ? false : undefined,
  }).eq("id", id), "contato");
  void u; revalidarTudo([`/crm/leads`, `/crm/clientes`]);
}

export async function definirProximaAcao(fd: FormData) {
  await exigirEscrita();
  const sb = await supabaseServer();
  const leadId = s(fd, "lead_id")!;
  await erroSe(await sb.from("crm_leads").update({ next_action: s(fd, "next_action"), next_action_at: dt(fd, "next_action_at") }).eq("id", leadId), "próxima ação");
  revalidarTudo([`/crm/leads/${leadId}`]);
}

const TIPOS_CONTATO_HUMANO = new Set(["message", "call", "meeting", "follow_up", "whatsapp_open"]);
export async function registrarAtividade(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const leadId = s(fd, "lead_id"); const contactId = s(fd, "contact_id"); const clientId = s(fd, "client_id");
  const tipo = s(fd, "tipo") ?? "note";
  const quando = dt(fd, "ocorreu_em") ?? new Date().toISOString();
  await atividade(sb, u.id, { contact_id: contactId, lead_id: leadId, client_id: clientId, tipo, descricao: s(fd, "descricao"), ocorreu_em: quando });
  if (leadId && TIPOS_CONTATO_HUMANO.has(tipo)) {
    const { data: l } = await sb.from("crm_leads").select("first_response_at, created_at").eq("id", leadId).single();
    const upd: Record<string, unknown> = { last_contact_at: quando };
    if (l && !l.first_response_at && tipo !== "whatsapp_open") upd.first_response_at = quando;
    await sb.from("crm_leads").update(upd).eq("id", leadId);
    // Primeiro contato tira o lead de "novo".
    const { data: opp } = await sb.from("crm_opportunities").select("id, pipeline_id, stage_id").eq("lead_id", leadId).is("won_at", null).is("lost_at", null).order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (opp && tipo !== "whatsapp_open") {
      const novo = await etapaPorCodigo(sb, opp.pipeline_id, "novo");
      if (opp.stage_id === novo.id) { const c = await etapaPorCodigo(sb, opp.pipeline_id, "contato"); await sb.from("crm_opportunities").update({ stage_id: c.id }).eq("id", opp.id); }
    }
  }
  const prox = s(fd, "next_action"), proxAt = dt(fd, "next_action_at");
  if (leadId && (prox || proxAt)) await sb.from("crm_leads").update({ next_action: prox, next_action_at: proxAt }).eq("id", leadId);
  revalidarTudo([leadId ? `/crm/leads/${leadId}` : "", clientId ? `/crm/clientes/${clientId}` : ""].filter(Boolean));
}

export async function moverEtapa(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const oppId = s(fd, "opportunity_id")!; const code = s(fd, "stage_code")!;
  if (code === "ganho" || code === "perdido") throw new Error("Use 'Marcar ganho' ou 'Marcar perdido' — eles exigem os dados obrigatórios.");
  const { data: opp } = await sb.from("crm_opportunities").select("*").eq("id", oppId).single();
  const etapa = await etapaPorCodigo(sb, opp.pipeline_id, code);
  await erroSe(await sb.from("crm_opportunities").update({ stage_id: etapa.id }).eq("id", oppId), "mover");
  await atividade(sb, u.id, { contact_id: opp.contact_id, lead_id: opp.lead_id, opportunity_id: oppId, tipo: "stage_change", descricao: `Etapa: ${etapa.nome}` });
  revalidarTudo([`/crm/leads/${opp.lead_id}`]);
}

export async function agendarExperimental(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const leadId = s(fd, "lead_id")!; const quando = dt(fd, "scheduled_at"); if (!quando) throw new Error("Data e hora são obrigatórias.");
  const { data: lead } = await sb.from("crm_leads").select("contact_id").eq("id", leadId).single();
  if (!lead) throw new Error("Lead não encontrado.");
  const { data: opp } = await sb.from("crm_opportunities").select("*").eq("lead_id", leadId).is("won_at", null).is("lost_at", null).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const { data: trial, error } = await sb.from("crm_trials").insert({ contact_id: lead.contact_id, lead_id: leadId, opportunity_id: opp?.id ?? null, scheduled_at: quando, local: s(fd, "local"), created_by: u.id }).select("id").single();
  if (error) throw new Error(`experimental: ${error.message}`);
  if (opp) { const e = await etapaPorCodigo(sb, opp.pipeline_id, "experimental_agendada").catch(() => null); if (e) await sb.from("crm_opportunities").update({ stage_id: e.id }).eq("id", opp.id); }
  await atividade(sb, u.id, { contact_id: lead.contact_id, lead_id: leadId, opportunity_id: opp?.id, tipo: "trial_scheduled", descricao: `Experimental agendada para ${new Date(quando).toLocaleString("pt-BR")}`, metadata: { trial_id: trial.id } });
  await tarefa(sb, u.id, { contact_id: lead.contact_id, lead_id: leadId, opportunity_id: opp?.id, tipo: "lembrete_experimental", titulo: "Confirmar aula experimental", due_at: addDias(new Date(quando), -1).toISOString() });
  await sb.from("crm_leads").update({ next_action: "Confirmar experimental", next_action_at: addDias(new Date(quando), -1).toISOString() }).eq("id", leadId);
  revalidarTudo([`/crm/leads/${leadId}`]);
}

export async function marcarExperimental(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const trialId = s(fd, "trial_id")!; const status = s(fd, "status") as "realizada" | "no_show" | "cancelada";
  const { data: t } = await sb.from("crm_trials").select("*").eq("id", trialId).single();
  await erroSe(await sb.from("crm_trials").update({ status, completed_at: new Date().toISOString(), outcome: s(fd, "outcome") }).eq("id", trialId), "experimental");
  const opp = t.opportunity_id ? (await sb.from("crm_opportunities").select("*").eq("id", t.opportunity_id).single()).data : null;
  const amanha = addDias(new Date(), 1); amanha.setHours(10, 0, 0, 0);
  if (status === "realizada") {
    if (opp) { const e = await etapaPorCodigo(sb, opp.pipeline_id, "experimental_realizada").catch(() => null); if (e) await sb.from("crm_opportunities").update({ stage_id: e.id }).eq("id", opp.id); }
    await atividade(sb, u.id, { contact_id: t.contact_id, lead_id: t.lead_id, opportunity_id: t.opportunity_id, tipo: "trial_completed", descricao: s(fd, "outcome") ?? "Experimental realizada" });
    await tarefa(sb, u.id, { contact_id: t.contact_id, lead_id: t.lead_id, opportunity_id: t.opportunity_id, tipo: "enviar_proposta", titulo: "Enviar proposta", due_at: amanha.toISOString(), priority: "alta" });
    if (t.lead_id) await sb.from("crm_leads").update({ next_action: "Enviar proposta", next_action_at: amanha.toISOString(), last_contact_at: new Date().toISOString() }).eq("id", t.lead_id);
  } else if (status === "no_show") {
    await atividade(sb, u.id, { contact_id: t.contact_id, lead_id: t.lead_id, opportunity_id: t.opportunity_id, tipo: "trial_no_show", descricao: "Não compareceu à experimental" });
    await tarefa(sb, u.id, { contact_id: t.contact_id, lead_id: t.lead_id, opportunity_id: t.opportunity_id, tipo: "reativacao", titulo: "Reagendar experimental (no-show)", due_at: amanha.toISOString(), priority: "alta" });
    if (t.lead_id) await sb.from("crm_leads").update({ next_action: "Reagendar experimental", next_action_at: amanha.toISOString() }).eq("id", t.lead_id);
  } else {
    await atividade(sb, u.id, { contact_id: t.contact_id, lead_id: t.lead_id, opportunity_id: t.opportunity_id, tipo: "trial_cancelled", descricao: s(fd, "outcome") ?? "Experimental cancelada" });
  }
  revalidarTudo([t.lead_id ? `/crm/leads/${t.lead_id}` : ""]);
}

export async function enviarProposta(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const oppId = s(fd, "opportunity_id")!;
  const { data: opp } = await sb.from("crm_opportunities").select("*").eq("id", oppId).single();
  const etapa = await etapaPorCodigo(sb, opp.pipeline_id, "proposta");
  const valor = n(fd, "proposal_value");
  await erroSe(await sb.from("crm_opportunities").update({ stage_id: etapa.id, proposal_sent_at: new Date().toISOString(), proposal_value: valor, expected_value: valor ?? opp.expected_value, plan_id: s(fd, "plan_id") ?? opp.plan_id, service_id: s(fd, "service_id") ?? opp.service_id }).eq("id", oppId), "proposta");
  const { data: cfg } = await sb.from("crm_settings").select("value").eq("key", "sla").maybeSingle();
  const dias = Number(cfg?.value?.proposta_sem_follow_up_dias ?? 2);
  const due = addDias(new Date(), dias); due.setHours(10, 0, 0, 0);
  await atividade(sb, u.id, { contact_id: opp.contact_id, lead_id: opp.lead_id, opportunity_id: oppId, tipo: "proposal_sent", descricao: valor ? `Proposta enviada: R$ ${valor}` : "Proposta enviada" });
  await tarefa(sb, u.id, { contact_id: opp.contact_id, lead_id: opp.lead_id, opportunity_id: oppId, tipo: "follow_up", titulo: "Follow-up da proposta", due_at: due.toISOString(), priority: "alta" });
  await sb.from("crm_leads").update({ next_action: "Follow-up da proposta", next_action_at: due.toISOString(), last_contact_at: new Date().toISOString() }).eq("id", opp.lead_id);
  revalidarTudo([`/crm/leads/${opp.lead_id}`]);
}

export async function marcarGanho(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const oppId = s(fd, "opportunity_id")!;
  const serviceId = s(fd, "service_id"), planId = s(fd, "plan_id"), valor = n(fd, "won_value"), data = s(fd, "won_at") ?? hoje();
  const ciclo = n(fd, "ciclo_meses") ?? 1;
  if (!serviceId || !planId || !valor || valor <= 0) throw new Error("Ganho exige serviço, plano, valor e data.");
  const { data: opp } = await sb.from("crm_opportunities").select("*").eq("id", oppId).single();
  const { data: lead } = await sb.from("crm_leads").select("*").eq("id", opp.lead_id).single();
  if (!lead) throw new Error("Lead não encontrado.");
  const etapa = await etapaPorCodigo(sb, opp.pipeline_id, "ganho");
  const wonAt = new Date(data + "T12:00:00").toISOString();
  await erroSe(await sb.from("crm_opportunities").update({ stage_id: etapa.id, won_at: wonAt, won_value: valor, service_id: serviceId, plan_id: planId, ciclo_meses: ciclo, recurring_value: valor / ciclo }).eq("id", oppId), "ganho");
  await sb.from("crm_leads").update({ status: "ganho", next_action: null, next_action_at: null }).eq("id", opp.lead_id);
  // Cliente: um por contato. Se já existe (cliente que voltou), reativa; senão cria.
  const { data: existente } = await sb.from("crm_clients").select("*").eq("contact_id", opp.contact_id).maybeSingle();
  const renovacao = addMeses(new Date(data + "T12:00:00"), ciclo).toISOString().slice(0, 10);
  let clientId: string;
  if (existente) {
    clientId = existente.id;
    await erroSe(await sb.from("crm_clients").update({ status: "ativo", service_id: serviceId, current_plan_id: planId, start_date: existente.start_date ?? data, end_date: null, renewal_date: renovacao, reactivated_at: existente.status !== "ativo" ? data : existente.reactivated_at, cancelled_at: null, cancel_reason: null }).eq("id", clientId), "cliente");
  } else {
    const { data: c, error } = await sb.from("crm_clients").insert({ contact_id: opp.contact_id, first_purchase_at: data, status: "ativo", service_id: serviceId, current_plan_id: planId, start_date: data, renewal_date: renovacao, source_code: lead.source_code, source_confidence: lead.attribution_confidence }).select("id").single();
    if (error) throw new Error(`cliente: ${error.message}`);
    clientId = c.id;
  }
  const { data: contrato, error: ec } = await sb.from("crm_contracts").insert({ client_id: clientId, opportunity_id: oppId, service_id: serviceId, plan_id: planId, valor, ciclo_meses: ciclo, inicio: data, renovacao_prevista: renovacao, status: "ativo", created_by: u.id }).select("id").single();
  if (ec) throw new Error(`contrato: ${ec.message}`);
  const recebido = fd.get("recebido") === "on";
  await erroSe(await sb.from("crm_revenue_events").insert({ client_id: clientId, contract_id: contrato.id, tipo: existente ? "renewal" : "sale", amount: valor, occurred_at: data, status: recebido ? "collected" : "contracted", service_id: serviceId, plan_id: planId, source_code: lead.source_code, payment_method: s(fd, "payment_method"), created_by: u.id }), "receita");
  await atividade(sb, u.id, { contact_id: opp.contact_id, lead_id: opp.lead_id, opportunity_id: oppId, client_id: clientId, tipo: "won", descricao: `Venda ganha: R$ ${valor} (${ciclo} mês${ciclo > 1 ? "es" : ""})`, ocorreu_em: wonAt });
  await atividade(sb, u.id, { contact_id: opp.contact_id, client_id: clientId, tipo: existente ? "reactivated" : "client_started", descricao: existente ? "Cliente reativado" : "Cliente iniciado", ocorreu_em: wonAt });
  // Tarefas abertas do lead deixam de fazer sentido.
  await sb.from("crm_tasks").update({ completed_at: new Date().toISOString() }).eq("lead_id", opp.lead_id).is("completed_at", null);
  revalidarTudo([`/crm/leads/${opp.lead_id}`, `/crm/clientes/${clientId}`]);
  redirect(`/crm/clientes/${clientId}`);
}

export async function marcarPerdido(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const oppId = s(fd, "opportunity_id")!; const motivo = s(fd, "loss_reason_code");
  if (!motivo) throw new Error("Perdido exige motivo.");
  const { data: opp } = await sb.from("crm_opportunities").select("*").eq("id", oppId).single();
  const etapa = await etapaPorCodigo(sb, opp.pipeline_id, "perdido");
  const agora = new Date().toISOString();
  await erroSe(await sb.from("crm_opportunities").update({ stage_id: etapa.id, lost_at: agora, loss_reason_code: motivo, loss_reason_text: s(fd, "loss_reason_text") }).eq("id", oppId), "perdido");
  const { data: cfg } = await sb.from("crm_settings").select("value").eq("key", "reativacao").maybeSingle();
  const cad = (cfg?.value?.cadencia_dias as number[] | undefined) ?? [7, 14, 30, 60];
  await sb.from("crm_leads").update({ status: "perdido", lost_at: agora, lost_reason_code: motivo, lost_reason_text: s(fd, "loss_reason_text"), next_action: null, next_action_at: null, reactivation_eligible_at: addDias(new Date(), cad[0] ?? 7).toISOString() }).eq("id", opp.lead_id);
  await sb.from("crm_tasks").update({ completed_at: agora }).eq("lead_id", opp.lead_id).is("completed_at", null);
  await atividade(sb, u.id, { contact_id: opp.contact_id, lead_id: opp.lead_id, opportunity_id: oppId, tipo: "lost", descricao: `Perdido: ${motivo}${s(fd, "loss_reason_text") ? " — " + s(fd, "loss_reason_text") : ""}` });
  if (motivo !== "decided_not_to_train") await tarefa(sb, u.id, { contact_id: opp.contact_id, lead_id: opp.lead_id, tipo: "reativacao", titulo: "Reativação (lead perdido)", due_at: addDias(new Date(), cad[0] ?? 7).toISOString(), priority: "baixa" });
  revalidarTudo([`/crm/leads/${opp.lead_id}`]);
}

export async function reativarLead(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const leadId = s(fd, "lead_id")!;
  const { data: lead } = await sb.from("crm_leads").select("*").eq("id", leadId).single();
  const { data: ultima } = await sb.from("crm_opportunities").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const pipelineId: string = ultima?.pipeline_id ?? (await sb.from("crm_pipelines").select("id").eq("code", "presencial").single()).data!.id;
  const contato = await etapaPorCodigo(sb, pipelineId, "contato");
  const amanha = addDias(new Date(), 1);
  await sb.from("crm_leads").update({ status: "aberto", lost_at: null, lost_reason_code: null, lost_reason_text: null, next_action: "Retomar conversa", next_action_at: amanha.toISOString() }).eq("id", leadId);
  const { data: opp } = await sb.from("crm_opportunities").insert({ lead_id: leadId, contact_id: lead.contact_id, pipeline_id: pipelineId, stage_id: contato.id, service_id: ultima?.service_id ?? lead.service_id, expected_value: ultima?.expected_value ?? null, created_by: u.id }).select("id").single();
  await atividade(sb, u.id, { contact_id: lead.contact_id, lead_id: leadId, opportunity_id: opp?.id, tipo: "reactivated", descricao: "Lead reativado" });
  revalidarTudo([`/crm/leads/${leadId}`]);
}

// ---------------------------------------------------------------------------
// Tarefas
// ---------------------------------------------------------------------------
export async function criarTarefa(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const due = dt(fd, "due_at"); if (!due) throw new Error("Prazo é obrigatório.");
  await tarefa(sb, u.id, { contact_id: s(fd, "contact_id"), lead_id: s(fd, "lead_id"), client_id: s(fd, "client_id"), tipo: s(fd, "tipo") ?? "follow_up", titulo: s(fd, "titulo") ?? "Follow-up", due_at: due, priority: s(fd, "priority") ?? "media", origem: "manual" });
  const leadId = s(fd, "lead_id");
  if (leadId) await sb.from("crm_leads").update({ next_action: s(fd, "titulo") ?? "Follow-up", next_action_at: due }).eq("id", leadId);
  revalidarTudo([leadId ? `/crm/leads/${leadId}` : ""]);
}
export async function concluirTarefa(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const id = s(fd, "task_id")!;
  const { data: t } = await sb.from("crm_tasks").select("*").eq("id", id).single();
  await erroSe(await sb.from("crm_tasks").update({ completed_at: new Date().toISOString() }).eq("id", id), "tarefa");
  await atividade(sb, u.id, { contact_id: t.contact_id, lead_id: t.lead_id, client_id: t.client_id, tipo: "task_done", descricao: t.titulo });
  if (t.lead_id) {
    const { data: l } = await sb.from("crm_leads").select("first_response_at").eq("id", t.lead_id).single();
    await sb.from("crm_leads").update({ last_contact_at: new Date().toISOString(), first_response_at: l?.first_response_at ?? new Date().toISOString() }).eq("id", t.lead_id);
  }
  revalidarTudo([t.lead_id ? `/crm/leads/${t.lead_id}` : ""]);
}

// ---------------------------------------------------------------------------
// Cliente, receita, renovação, cancelamento
// ---------------------------------------------------------------------------
export async function registrarReceita(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const clientId = s(fd, "client_id")!; const tipo = s(fd, "tipo") ?? "monthly_payment"; let amount = n(fd, "amount") ?? 0;
  if (tipo === "refund" && amount > 0) amount = -amount;
  if (amount === 0) throw new Error("Valor é obrigatório.");
  const { data: c } = await sb.from("crm_clients").select("*").eq("id", clientId).single();
  await erroSe(await sb.from("crm_revenue_events").insert({ client_id: clientId, contract_id: s(fd, "contract_id"), tipo, amount, occurred_at: s(fd, "occurred_at") ?? hoje(), status: s(fd, "status") ?? "collected", service_id: c.service_id, plan_id: c.current_plan_id, source_code: c.source_code, payment_method: s(fd, "payment_method"), external_ref: s(fd, "external_ref"), fee: n(fd, "fee"), notes: s(fd, "notes"), created_by: u.id }), "receita");
  await atividade(sb, u.id, { contact_id: c.contact_id, client_id: clientId, tipo: tipo === "refund" ? "other" : "payment", descricao: `${tipo}: R$ ${amount}`, ocorreu_em: new Date((s(fd, "occurred_at") ?? hoje()) + "T12:00:00").toISOString() });
  revalidarTudo([`/crm/clientes/${clientId}`]);
}
export async function marcarRecebido(fd: FormData) {
  await exigirEscrita();
  const sb = await supabaseServer();
  const id = s(fd, "revenue_id")!;
  const { data: r } = await sb.from("crm_revenue_events").select("client_id").eq("id", id).single();
  await erroSe(await sb.from("crm_revenue_events").update({ status: "collected", payment_method: s(fd, "payment_method") ?? undefined }).eq("id", id), "receita");
  revalidarTudo([`/crm/clientes/${r?.client_id}`]);
}
export async function renovarContrato(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const clientId = s(fd, "client_id")!; const valor = n(fd, "valor"); const ciclo = n(fd, "ciclo_meses") ?? 1; const inicio = s(fd, "inicio") ?? hoje();
  const planId = s(fd, "plan_id"); if (!valor || !planId) throw new Error("Renovação exige plano e valor.");
  const { data: c } = await sb.from("crm_clients").select("*").eq("id", clientId).single();
  const { data: atual } = await sb.from("crm_contracts").select("*").eq("client_id", clientId).eq("status", "ativo").order("inicio", { ascending: false }).limit(1).maybeSingle();
  if (atual) await sb.from("crm_contracts").update({ status: "renovado", fim: atual.fim ?? addDias(new Date(inicio + "T12:00:00"), -1).toISOString().slice(0, 10) }).eq("id", atual.id);
  const renovacao = addMeses(new Date(inicio + "T12:00:00"), ciclo).toISOString().slice(0, 10);
  const { data: novo, error } = await sb.from("crm_contracts").insert({ client_id: clientId, service_id: s(fd, "service_id") ?? c.service_id, plan_id: planId, valor, ciclo_meses: ciclo, inicio, renovacao_prevista: renovacao, status: "ativo", contrato_anterior_id: atual?.id ?? null, created_by: u.id }).select("id").single();
  if (error) throw new Error(`contrato: ${error.message}`);
  await sb.from("crm_clients").update({ status: "ativo", current_plan_id: planId, renewal_date: renovacao, end_date: null }).eq("id", clientId);
  const recebido = fd.get("recebido") === "on";
  const tipoEvento = atual && valor > atual.valor / atual.ciclo_meses * ciclo ? "upgrade" : atual && valor < atual.valor / atual.ciclo_meses * ciclo ? "downgrade" : "renewal";
  await sb.from("crm_revenue_events").insert({ client_id: clientId, contract_id: novo.id, tipo: tipoEvento, amount: valor, occurred_at: inicio, status: recebido ? "collected" : "contracted", service_id: c.service_id, plan_id: planId, source_code: c.source_code, payment_method: s(fd, "payment_method"), created_by: u.id });
  await atividade(sb, u.id, { contact_id: c.contact_id, client_id: clientId, tipo: "renewal", descricao: `Renovação: R$ ${valor} (${ciclo} mês${ciclo > 1 ? "es" : ""})` });
  await sb.from("crm_tasks").update({ completed_at: new Date().toISOString() }).eq("client_id", clientId).eq("tipo", "renovacao").is("completed_at", null);
  revalidarTudo([`/crm/clientes/${clientId}`]);
}
export async function cancelarCliente(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const clientId = s(fd, "client_id")!; const data = s(fd, "cancelled_at") ?? hoje(); const status = (s(fd, "status") as "cancelado" | "pausado") ?? "cancelado";
  const { data: c } = await sb.from("crm_clients").select("*").eq("id", clientId).single();
  await erroSe(await sb.from("crm_clients").update({ status, cancelled_at: status === "cancelado" ? data : null, cancel_reason: s(fd, "cancel_reason"), end_date: data, renewal_date: null }).eq("id", clientId), "cliente");
  if (status === "cancelado") {
    await sb.from("crm_contracts").update({ status: "cancelado", fim: data }).eq("client_id", clientId).eq("status", "ativo");
    await sb.from("crm_revenue_events").insert({ client_id: clientId, tipo: "cancellation", amount: 0, occurred_at: data, status: "collected", service_id: c.service_id, plan_id: c.current_plan_id, source_code: c.source_code, notes: s(fd, "cancel_reason"), created_by: u.id });
  }
  await atividade(sb, u.id, { contact_id: c.contact_id, client_id: clientId, tipo: "cancellation", descricao: `${status === "cancelado" ? "Cancelado" : "Pausado"}: ${s(fd, "cancel_reason") ?? "sem motivo"}` });
  revalidarTudo([`/crm/clientes/${clientId}`]);
}

// ---------------------------------------------------------------------------
// Atribuição, indicação, dedupe, LGPD
// ---------------------------------------------------------------------------
export async function ligarHandoff(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const leadId = s(fd, "lead_id")!; const handoffId = s(fd, "handoff_id"); const ref = s(fd, "ref_code")?.toUpperCase();
  const conf = (s(fd, "confidence") as "high" | "medium" | "low") ?? (ref ? "high" : "medium");
  const { data: lead } = await sb.from("crm_leads").select("*").eq("id", leadId).single();
  const q = handoffId ? sb.from("crm_whatsapp_handoffs").select("*").eq("id", handoffId) : sb.from("crm_whatsapp_handoffs").select("*").eq("ref_code", ref!);
  const { data: h } = await q.maybeSingle();
  if (!h) throw new Error("Handoff não encontrado.");
  if (h.contact_id && h.contact_id !== lead.contact_id) throw new Error("Este clique já está ligado a outro contato.");
  await sb.from("crm_whatsapp_handoffs").update({ contact_id: lead.contact_id, lead_id: leadId, linked_at: new Date().toISOString(), link_confidence: conf }).eq("id", h.id);
  await sb.from("crm_attribution_touches").insert({ contact_id: lead.contact_id, handoff_id: h.id, occurred_at: h.created_at, source_code: h.source_code ?? "unknown", medium: h.utm_medium, campaign: h.utm_campaign, content: h.utm_content, landing_page: h.landing_page, referrer: h.referrer, page_url: h.page_url, cta_id: h.cta_id, utm_source: h.utm_source, utm_medium: h.utm_medium, utm_campaign: h.utm_campaign, utm_content: h.utm_content, utm_term: h.utm_term, gclid: h.gclid, gbraid: h.gbraid, wbraid: h.wbraid, fbclid: h.fbclid, session_id: h.session_id, confidence: conf, origem_registro: "site" });
  if (lead.source_code === "unknown" && h.source_code) await sb.from("crm_leads").update({ source_code: h.source_code, attribution_confidence: conf, handoff_id: h.id }).eq("id", leadId);
  else await sb.from("crm_leads").update({ handoff_id: h.id }).eq("id", leadId);
  await atividade(sb, u.id, { contact_id: lead.contact_id, lead_id: leadId, tipo: "whatsapp_open", descricao: `Clique no site ligado (ref ${h.ref_code}, confiança ${conf})`, ocorreu_em: h.created_at, metadata: { handoff_id: h.id } });
  revalidarTudo([`/crm/leads/${leadId}`]);
}
export async function definirOrigem(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const leadId = s(fd, "lead_id")!; const code = s(fd, "source_code") ?? "unknown";
  const { data: lead } = await sb.from("crm_leads").select("*").eq("id", leadId).single();
  await sb.from("crm_leads").update({ source_code: code, source_detail: s(fd, "source_detail"), attribution_confidence: s(fd, "confidence") ?? "medium" }).eq("id", leadId);
  if (code !== "unknown") await sb.from("crm_attribution_touches").insert({ contact_id: lead.contact_id, occurred_at: lead.created_at, source_code: code, campaign: s(fd, "source_detail"), confidence: s(fd, "confidence") ?? "medium", origem_registro: "manual" });
  await atividade(sb, u.id, { contact_id: lead.contact_id, lead_id: leadId, tipo: "note", descricao: `Origem definida: ${code}` });
  revalidarTudo([`/crm/leads/${leadId}`]);
}
export async function gerarCodigoIndicacao(fd: FormData) {
  await exigirEscrita();
  const sb = await supabaseServer();
  const contactId = s(fd, "contact_id")!;
  for (let i = 0; i < 5; i++) {
    const code = gerarRefCode();
    const { error } = await sb.from("crm_contacts").update({ referral_code: code }).eq("id", contactId);
    if (!error) break;
  }
  revalidarTudo([`/crm/clientes`, `/crm/leads`]);
}
export async function mesclarContatos(fd: FormData) {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  const de = s(fd, "de_id")!, para = s(fd, "para_id")!;
  if (de === para) throw new Error("Escolha dois contatos diferentes.");
  for (const t of ["crm_leads", "crm_opportunities", "crm_trials", "crm_activities", "crm_tasks", "crm_attribution_touches", "crm_whatsapp_handoffs"]) await sb.from(t).update({ contact_id: para }).eq("contact_id", de);
  await sb.from("crm_contacts").update({ referred_by_contact_id: para }).eq("referred_by_contact_id", de);
  await sb.from("crm_leads").update({ referred_by_contact_id: para }).eq("referred_by_contact_id", de);
  const { data: cliDe } = await sb.from("crm_clients").select("id").eq("contact_id", de).maybeSingle();
  const { data: cliPara } = await sb.from("crm_clients").select("id").eq("contact_id", para).maybeSingle();
  if (cliDe && !cliPara) await sb.from("crm_clients").update({ contact_id: para }).eq("id", cliDe.id);
  else if (cliDe && cliPara) { for (const t of ["crm_contracts", "crm_revenue_events"]) await sb.from(t).update({ client_id: cliPara.id }).eq("client_id", cliDe.id); await sb.from("crm_clients").delete().eq("id", cliDe.id); }
  await sb.from("crm_contacts").update({ merged_into_contact_id: para, possivel_duplicata_de: null }).eq("id", de);
  await sb.from("crm_contacts").update({ possivel_duplicata_de: null }).eq("id", para);
  await atividade(sb, u.id, { contact_id: para, tipo: "merge", descricao: "Contatos mesclados", metadata: { de } });
  revalidarTudo(["/crm/qualidade-de-dados"]);
}
export async function naoEhDuplicata(fd: FormData) {
  await exigirEscrita();
  const sb = await supabaseServer();
  await sb.from("crm_contacts").update({ possivel_duplicata_de: null }).eq("id", s(fd, "contact_id")!);
  revalidarTudo(["/crm/qualidade-de-dados"]);
}
export async function anonimizarContato(fd: FormData) {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  const id = s(fd, "contact_id")!;
  await erroSe(await sb.from("crm_contacts").update({ nome: "Contato removido", telefone: null, email: null, instagram: null, cidade: null, como_conheceu: null, observacoes: null, referral_code: null, anonimizado: true }).eq("id", id), "anonimizar");
  await sb.from("crm_activities").update({ descricao: "[removido a pedido do titular]" }).eq("contact_id", id).in("tipo", ["note", "message"]);
  await atividade(sb, u.id, { contact_id: id, tipo: "other", descricao: "Dados pessoais removidos (LGPD). Métricas agregadas preservadas." });
  revalidarTudo();
}

// ---------------------------------------------------------------------------
// Configurações
// ---------------------------------------------------------------------------
export async function salvarConfig(fd: FormData) {
  await exigirAdmin();
  const sb = await supabaseServer();
  const key = s(fd, "key")!;
  let value: unknown;
  try { value = JSON.parse(s(fd, "value") ?? "{}"); } catch { throw new Error("JSON inválido."); }
  await erroSe(await sb.from("crm_settings").upsert({ key, value, updated_at: new Date().toISOString() }), "config");
  revalidarTudo(["/crm/configuracoes"]);
}
export async function salvarPlano(fd: FormData) {
  await exigirAdmin();
  const sb = await supabaseServer();
  const id = s(fd, "id");
  const linha = { service_id: s(fd, "service_id"), nome: s(fd, "nome"), tipo_cobranca: s(fd, "tipo_cobranca") ?? "mensal", ciclo_meses: n(fd, "ciclo_meses") ?? 1, preco: n(fd, "preco") ?? 0, sessoes_por_semana: n(fd, "sessoes_por_semana"), descricao: s(fd, "descricao"), ativo: fd.get("ativo") !== "off" };
  if (!linha.nome || !linha.service_id) throw new Error("Plano exige serviço e nome.");
  await erroSe(id ? await sb.from("crm_plans").update(linha).eq("id", id) : await sb.from("crm_plans").insert(linha), "plano");
  revalidarTudo(["/crm/configuracoes"]);
}
export async function salvarTemplate(fd: FormData) {
  await exigirAdmin();
  const sb = await supabaseServer();
  const id = s(fd, "id");
  const linha = { tipo: s(fd, "tipo") ?? "outro", titulo: s(fd, "titulo") ?? "Mensagem", corpo: s(fd, "corpo") ?? "", ativo: fd.get("ativo") !== "off" };
  await erroSe(id ? await sb.from("crm_message_templates").update(linha).eq("id", id) : await sb.from("crm_message_templates").insert(linha), "template");
  revalidarTudo(["/crm/configuracoes"]);
}
export async function adicionarUsuario(fd: FormData) {
  await exigirAdmin();
  const sb = await supabaseServer();
  const email = s(fd, "email")?.toLowerCase(); if (!email) throw new Error("E-mail obrigatório.");
  await erroSe(await sb.from("crm_allowlist").upsert({ email, role: s(fd, "role") ?? "user", nome: s(fd, "nome") }), "allowlist");
  await sb.from("crm_users").update({ role: s(fd, "role") ?? "user" }).eq("email", email);
  revalidarTudo(["/crm/configuracoes"]);
}
export async function registrarGasto(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  await erroSe(await sb.from("crm_ad_spend").insert({ canal: s(fd, "canal") ?? "google_ads", campanha: s(fd, "campanha"), campaign_id: s(fd, "campaign_id"), data: s(fd, "data") ?? hoje(), custo: n(fd, "custo") ?? 0, cliques: n(fd, "cliques"), impressoes: n(fd, "impressoes"), conversoes: n(fd, "conversoes"), created_by: u.id }), "gasto");
  revalidarTudo(["/crm/analytics/ads"]);
}
export async function definirBaseline(fd: FormData) {
  await exigirAdmin();
  const sb = await supabaseServer();
  await sb.from("crm_settings").upsert({ key: "tracking_baseline", value: { data: s(fd, "data"), descricao: s(fd, "descricao") ?? "Atribuição individual capturada prospectivamente a partir desta data." }, updated_at: new Date().toISOString() });
  revalidarTudo(["/crm/configuracoes", "/crm/analytics/atribuicao"]);
}

export async function sair() {
  await exigirUsuario();
  const sb = await supabaseServer();
  await sb.auth.signOut();
  redirect("/crm/login");
}
