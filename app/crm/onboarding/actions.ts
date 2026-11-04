"use server";

/**
 * Ações do onboarding. Mesmas regras das ações do CRM: usuário com escrita,
 * sessão dele (RLS), histórico em crm_onboarding_events, revalidação.
 *
 * Duas regras deste módulo que valem lembrar:
 *  - abrir o WhatsApp NÃO conclui a tarefa: registra "whatsapp_aberto" e
 *    fica em "em andamento"; o Montinho confirma o envio por outro botão;
 *  - ler, adiar ou dispensar um aviso NÃO conclui a tarefa.
 */
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigirAdmin, exigirEscrita } from "@/lib/crm/auth";
import { supabaseServer } from "@/lib/crm/supabase/server";
import { dataDoCheckIn } from "@/lib/crm/onboarding";
import { evento, garantirVersaoPadrao, iniciarOnboardingDeCliente } from "@/lib/crm/onboarding-servidor";
import {
  diaLocal, diffDeVersao, instanciar, progresso, recalcularPrazos, validarDefinicao, verTodas,
  type DefinicaoFluxo, type EtapaDef, type LembreteDef, type OnboardingRow, type PrazoDef, type StatusTarefa, type TarefaOnb,
} from "@/lib/crm/onboarding-fluxo";

const ROTAS = ["/crm", "/crm/onboarding", "/crm/onboarding/tarefas", "/crm/onboarding/avisos", "/crm/clientes", "/crm/configuracoes/onboarding"];
function revalidar(extra: string[] = []) { for (const p of [...ROTAS, ...extra].filter(Boolean)) revalidatePath(p, "layout"); }
const s = (fd: FormData, k: string) => { const v = fd.get(k); return typeof v === "string" && v.trim() ? v.trim() : null; };
const n = (fd: FormData, k: string) => { const v = s(fd, k); if (v == null) return null; const x = Number(v.replace(",", ".")); return Number.isFinite(x) ? x : null; };
const agoraIso = () => new Date().toISOString();
async function erroSe(r: { error: { message: string } | null }, ctx: string) { if (r.error) throw new Error(`${ctx}: ${r.error.message}`); }

async function carregar(sb: any, onboardingId: string): Promise<{ onb: OnboardingRow; tarefas: TarefaOnb[] }> {
  const { data: onb } = await sb.from("crm_onboardings").select("*").eq("id", onboardingId).single();
  if (!onb) throw new Error("Onboarding não encontrado.");
  const { data: tarefas } = await sb.from("crm_onboarding_tasks").select("*").eq("onboarding_id", onboardingId).order("ordem");
  return { onb, tarefas: tarefas ?? [] };
}
/** Recalcula os prazos de regra e grava o que mudou, com histórico. */
async function aplicarPrazos(sb: any, uid: string, onb: OnboardingRow, tarefas: TarefaOnb[]) {
  for (const m of recalcularPrazos(tarefas, onb.iniciado_em)) {
    await sb.from("crm_onboarding_tasks").update({ due_at: m.para, due_origem: m.para ? "regra" : null, updated_at: agoraIso() }).eq("id", m.id);
    await evento(sb, uid, { onboarding_id: onb.id, task_id: m.id, tipo: "prazo", de: m.de, para: m.para, detalhe: { origem: "regra" } });
  }
}

// ---------------------------------------------------------------------------
// Modelos (admin)
// ---------------------------------------------------------------------------

export async function publicarVersaoPadrao() {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  await garantirVersaoPadrao(sb, u.id);
  revalidar();
}

async function definicaoAtual(sb: any, templateId: string): Promise<{ versao: number; def: DefinicaoFluxo }> {
  const { data: v } = await sb.from("crm_onboarding_template_versions").select("versao, definicao").eq("template_id", templateId).order("versao", { ascending: false }).limit(1).maybeSingle();
  return v ? { versao: v.versao, def: v.definicao } : { versao: 0, def: { fases: [], etapas: [] } };
}
/** Toda edição publica uma versão nova (imutável). Quem já começou continua na antiga. */
async function publicar(sb: any, uid: string, templateId: string, def: DefinicaoFluxo, nota: string) {
  const erros = validarDefinicao(def); if (erros.length) throw new Error(erros.join(" "));
  const { versao } = await definicaoAtual(sb, templateId);
  const ordenada: DefinicaoFluxo = { fases: [...def.fases].sort((a, z) => a.ordem - z.ordem).map((f, i) => ({ ...f, ordem: i + 1 })), etapas: [...def.etapas].sort((a, z) => a.ordem - z.ordem).map((e, i) => ({ ...e, ordem: i + 1 })) };
  await erroSe(await sb.from("crm_onboarding_template_versions").insert({ template_id: templateId, versao: versao + 1, definicao: ordenada, nota, created_by: uid }), "versão");
  await erroSe(await sb.from("crm_onboarding_templates").update({ versao_atual: versao + 1, updated_at: agoraIso() }).eq("id", templateId), "modelo");
}

const lerPrazo = (fd: FormData): PrazoDef => {
  const tipo = s(fd, "prazo_tipo") ?? "sem_prazo";
  if (tipo === "inicio") return { tipo, dias: Math.max(0, n(fd, "prazo_dias") ?? 0) };
  if (tipo === "apos_etapa") return { tipo, etapa: s(fd, "prazo_etapa") ?? "", dias: Math.max(0, n(fd, "prazo_dias") ?? 0) };
  if (tipo === "manual") return { tipo };
  return { tipo: "sem_prazo" };
};
const lerLembrete = (fd: FormData): LembreteDef => ({ no_dia: fd.get("lembrete_no_dia") === "on", dia_antes: fd.get("lembrete_dia_antes") === "on", atraso: fd.get("lembrete_atraso") === "on", repetir_dias: n(fd, "lembrete_repetir") || null });
const lerLista = (fd: FormData, k: string) => (s(fd, k) ?? "").split(",").map((x) => x.trim()).filter(Boolean);
const lerOpcoes = (txt: string | null) => (txt ?? "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => { const [valor, ...r] = l.split("="); return { valor: valor.trim(), rotulo: (r.join("=") || valor).trim() }; });
const lerMateriais = (txt: string | null) => (txt ?? "").split("\n").map((l) => l.trim()).filter(Boolean).map((l) => { const [rotulo, ...r] = l.split("|"); return { rotulo: rotulo.trim(), url: r.join("|").trim() || rotulo.trim() }; });

/** Cria ou altera uma etapa do modelo e publica a versão nova. */
export async function salvarEtapaModelo(fd: FormData) {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  const templateId = s(fd, "template_id")!;
  const { def } = await definicaoAtual(sb, templateId);
  const keyAntiga = s(fd, "key_antiga");
  const key = (s(fd, "key") ?? s(fd, "nome") ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 40);
  const condPergunta = s(fd, "condicao_pergunta");
  const ativarEtapa = s(fd, "ativar_etapa");
  const etapa: EtapaDef = {
    key, fase: s(fd, "fase")!, nome: s(fd, "nome")!, descricao: s(fd, "descricao") ?? "", instrucoes: s(fd, "instrucoes") ?? "",
    ordem: n(fd, "ordem") ?? def.etapas.length + 1, obrigatoria: fd.get("obrigatoria") === "on",
    prazo: lerPrazo(fd), depende_de: lerLista(fd, "depende_de"),
    condicao: condPergunta ? { pergunta: condPergunta, opcoes: lerOpcoes(s(fd, "condicao_opcoes")) } : null,
    ativar_se: ativarEtapa ? { etapa: ativarEtapa, valor: s(fd, "ativar_valor") ?? "" } : null,
    na_se: s(fd, "na_se"),
    mensagem: s(fd, "mensagem"), materiais: lerMateriais(s(fd, "materiais")), lembrete: lerLembrete(fd), avisar: fd.get("avisar") === "on",
    acao: (s(fd, "acao") as EtapaDef["acao"]) ?? null,
  };
  const etapas = def.etapas.filter((e) => e.key !== (keyAntiga ?? key));
  if (keyAntiga && keyAntiga !== key) for (const e of etapas) { e.depende_de = e.depende_de.map((d) => (d === keyAntiga ? key : d)); if (e.ativar_se?.etapa === keyAntiga) e.ativar_se.etapa = key; if (e.prazo.tipo === "apos_etapa" && e.prazo.etapa === keyAntiga) e.prazo.etapa = key; }
  // Inserir na posição pedida empurra as seguintes.
  const pos = Math.max(1, Math.min(etapa.ordem, etapas.length + 1));
  const ordenadas = [...etapas].sort((a, z) => a.ordem - z.ordem);
  ordenadas.splice(pos - 1, 0, etapa);
  await publicar(sb, u.id, templateId, { fases: def.fases, etapas: ordenadas.map((e, i) => ({ ...e, ordem: i + 1 })) }, `${keyAntiga ? "Etapa alterada" : "Etapa criada"}: ${etapa.nome}`);
  revalidar();
}

export async function excluirEtapaModelo(fd: FormData) {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  const templateId = s(fd, "template_id")!; const key = s(fd, "key")!;
  const { def } = await definicaoAtual(sb, templateId);
  const etapas = def.etapas.filter((e) => e.key !== key).map((e) => ({
    ...e, depende_de: e.depende_de.filter((d) => d !== key), ativar_se: e.ativar_se?.etapa === key ? null : e.ativar_se,
    prazo: e.prazo.tipo === "apos_etapa" && e.prazo.etapa === key ? ({ tipo: "manual" } as PrazoDef) : e.prazo,
  }));
  await publicar(sb, u.id, templateId, { fases: def.fases, etapas }, `Etapa excluída: ${key}`);
  revalidar();
}

export async function moverEtapaModelo(fd: FormData) {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  const templateId = s(fd, "template_id")!; const key = s(fd, "key")!; const dir = s(fd, "direcao") === "cima" ? -1 : 1;
  const { def } = await definicaoAtual(sb, templateId);
  const etapas = [...def.etapas].sort((a, z) => a.ordem - z.ordem);
  const i = etapas.findIndex((e) => e.key === key); const j = i + dir;
  if (i < 0 || j < 0 || j >= etapas.length) return;
  [etapas[i], etapas[j]] = [etapas[j], etapas[i]];
  await publicar(sb, u.id, templateId, { fases: def.fases, etapas: etapas.map((e, k) => ({ ...e, ordem: k + 1 })) }, `Ordem: ${key}`);
  revalidar();
}

export async function salvarFaseModelo(fd: FormData) {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  const templateId = s(fd, "template_id")!;
  const { def } = await definicaoAtual(sb, templateId);
  const keyAntiga = s(fd, "key_antiga");
  const nome = s(fd, "nome")!;
  const key = keyAntiga ?? nome.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 30);
  const fases = def.fases.filter((f) => f.key !== key);
  fases.push({ key, nome, ordem: n(fd, "ordem") ?? fases.length + 1 });
  await publicar(sb, u.id, templateId, { fases, etapas: def.etapas }, keyAntiga ? `Fase renomeada: ${nome}` : `Fase criada: ${nome}`);
  revalidar();
}
export async function excluirFaseModelo(fd: FormData) {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  const templateId = s(fd, "template_id")!; const key = s(fd, "key")!;
  const { def } = await definicaoAtual(sb, templateId);
  if (def.etapas.some((e) => e.fase === key)) throw new Error("Mova ou exclua as etapas desta fase antes.");
  await publicar(sb, u.id, templateId, { fases: def.fases.filter((f) => f.key !== key), etapas: def.etapas }, `Fase excluída: ${key}`);
  revalidar();
}

export async function salvarModelo(fd: FormData) {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  const id = s(fd, "template_id");
  const linha = { nome: s(fd, "nome")!, descricao: s(fd, "descricao"), service_id: s(fd, "service_id"), plan_id: s(fd, "plan_id"), updated_at: agoraIso() };
  if (id) await erroSe(await sb.from("crm_onboarding_templates").update(linha).eq("id", id), "modelo");
  else {
    const { data, error } = await sb.from("crm_onboarding_templates").insert({ ...linha, ativo: true, created_by: u.id }).select("id").single();
    if (error) throw new Error(`modelo: ${error.message}`);
    await publicar(sb, u.id, data.id, { fases: [{ key: "geral", nome: "Geral", ordem: 1 }], etapas: [] }, "Modelo criado");
  }
  revalidar();
}
export async function duplicarModelo(fd: FormData) {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  const de = s(fd, "template_id")!;
  const { data: tpl } = await sb.from("crm_onboarding_templates").select("*").eq("id", de).single();
  const { def } = await definicaoAtual(sb, de);
  const { data: novo, error } = await sb.from("crm_onboarding_templates").insert({ nome: `${tpl.nome} (cópia)`, descricao: tpl.descricao, service_id: null, plan_id: null, ativo: false, padrao: false, created_by: u.id }).select("id").single();
  if (error) throw new Error(`modelo: ${error.message}`);
  await publicar(sb, u.id, novo.id, def, `Copiado de ${tpl.nome}`);
  revalidar();
}
export async function alternarModelo(fd: FormData) {
  await exigirAdmin();
  const sb = await supabaseServer();
  const id = s(fd, "template_id")!;
  const { data: t } = await sb.from("crm_onboarding_templates").select("ativo, padrao").eq("id", id).single();
  if (!t) throw new Error("Modelo não encontrado.");
  if (t.padrao && t.ativo) throw new Error("O modelo padrão não pode ser desativado. Defina outro como padrão antes.");
  await erroSe(await sb.from("crm_onboarding_templates").update({ ativo: !t.ativo, updated_at: agoraIso() }).eq("id", id), "modelo");
  revalidar();
}
export async function definirModeloPadrao(fd: FormData) {
  await exigirAdmin();
  const sb = await supabaseServer();
  const id = s(fd, "template_id")!;
  await sb.from("crm_onboarding_templates").update({ padrao: false }).eq("padrao", true);
  await erroSe(await sb.from("crm_onboarding_templates").update({ padrao: true, ativo: true, updated_at: agoraIso() }).eq("id", id), "modelo");
  revalidar();
}

// ---------------------------------------------------------------------------
// Instâncias
// ---------------------------------------------------------------------------

export async function iniciarOnboarding(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const clientId = s(fd, "client_id")!;
  const id = await iniciarOnboardingDeCliente(sb, u.id, clientId, { inicio: s(fd, "inicio") ?? undefined, templateId: s(fd, "template_id") });
  revalidar([`/crm/clientes/${clientId}`, `/crm/onboarding/${id}`]);
  redirect(`/crm/onboarding/${id}`);
}

export async function mudarStatusOnboarding(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const id = s(fd, "onboarding_id")!; const para = s(fd, "status") as OnboardingRow["status"];
  const { onb, tarefas } = await carregar(sb, id);
  if (para === "concluido") {
    const p = progresso(verTodas(tarefas, new Date()));
    if (p.obrigatoriasAbertas > 0) throw new Error(`Ainda há ${p.obrigatoriasAbertas} etapa(s) obrigatória(s) em aberto. Conclua ou marque como não aplicável antes.`);
  }
  if (!["em_andamento", "pausado", "concluido", "cancelado"].includes(para)) throw new Error("Status inválido.");
  const patch: Record<string, unknown> = { status: para, updated_at: agoraIso() };
  if (para === "pausado") patch.pausado_em = agoraIso();
  if (para === "em_andamento") patch.pausado_em = null;
  if (para === "concluido" || para === "cancelado") patch.concluido_em = agoraIso();
  await erroSe(await sb.from("crm_onboardings").update(patch).eq("id", id), "onboarding");
  const tipo = para === "pausado" ? "pausado" : para === "em_andamento" ? "retomado" : para === "concluido" ? "concluido" : "cancelado";
  await evento(sb, u.id, { onboarding_id: id, tipo, de: onb.status, para });
  revalidar([`/crm/onboarding/${id}`, `/crm/clientes/${onb.client_id}`]);
}

/** Muda o status gravado de uma tarefa. "Atrasada" e "bloqueada" não são status: são derivados. */
export async function mudarStatusTarefa(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const taskId = s(fd, "task_id")!; const para = s(fd, "status") as StatusTarefa;
  if (!["pendente", "em_andamento", "aguardando_aluno", "concluida", "pausada", "nao_aplicavel"].includes(para)) throw new Error("Status inválido.");
  const { data: t } = await sb.from("crm_onboarding_tasks").select("*").eq("id", taskId).single();
  if (!t) throw new Error("Tarefa não encontrada.");
  const agora = agoraIso();
  const patch: Record<string, unknown> = { status: para, updated_at: agora };
  if (para === "concluida") { patch.completed_at = agora; patch.completed_by = u.id; }
  else if (t.status === "concluida") { patch.completed_at = null; patch.completed_by = null; }
  if (para === "em_andamento" && !t.started_at) patch.started_at = agora;
  await erroSe(await sb.from("crm_onboarding_tasks").update(patch).eq("id", taskId), "tarefa");
  await evento(sb, u.id, { onboarding_id: t.onboarding_id, task_id: taskId, tipo: "status", de: t.status, para });
  const obs = s(fd, "observacoes");
  if (obs) { await sb.from("crm_onboarding_tasks").update({ observacoes: obs }).eq("id", taskId); await evento(sb, u.id, { onboarding_id: t.onboarding_id, task_id: taskId, tipo: "observacao", para: obs }); }
  const { onb, tarefas } = await carregar(sb, t.onboarding_id);
  await aplicarPrazos(sb, u.id, onb, tarefas);
  revalidar([`/crm/onboarding/${t.onboarding_id}`, `/crm/clientes/${onb.client_id}`]);
}

/** Responde a pergunta de uma etapa condicional; libera um caminho e dispensa o outro. */
export async function responderCondicao(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const taskId = s(fd, "task_id")!; const resposta = s(fd, "resposta")!;
  const { data: t } = await sb.from("crm_onboarding_tasks").select("*").eq("id", taskId).single();
  if (!t?.condicao) throw new Error("Esta etapa não tem pergunta.");
  if (!t.condicao.opcoes.some((o: { valor: string }) => o.valor === resposta)) throw new Error("Resposta inválida.");
  const agora = agoraIso();
  const patch: Record<string, unknown> = { resposta, updated_at: agora };
  // A própria etapa: "não há dúvidas" → não aplicável; qualquer outra resposta conclui a pergunta.
  if (t.na_se && resposta === t.na_se) patch.status = "nao_aplicavel";
  else if (!t.na_se) { patch.status = "concluida"; patch.completed_at = agora; patch.completed_by = u.id; }
  await erroSe(await sb.from("crm_onboarding_tasks").update(patch).eq("id", taskId), "resposta");
  await evento(sb, u.id, { onboarding_id: t.onboarding_id, task_id: taskId, tipo: "resposta", de: t.resposta, para: resposta });
  // Os caminhos: o que casa fica pendente; o que não casa vira não aplicável.
  const { onb, tarefas } = await carregar(sb, t.onboarding_id);
  for (const f of tarefas) {
    if (f.ativar_se?.etapa !== t.key) continue;
    const casa = f.ativar_se?.valor === resposta;
    const novo: StatusTarefa = casa ? (f.status === "nao_aplicavel" ? "pendente" : f.status) : "nao_aplicavel";
    if (novo !== f.status) {
      await sb.from("crm_onboarding_tasks").update({ status: novo, updated_at: agora }).eq("id", f.id);
      await evento(sb, u.id, { onboarding_id: onb.id, task_id: f.id, tipo: "status", de: f.status, para: novo, detalhe: { motivo: `resposta de ${t.key}: ${resposta}` } });
      f.status = novo;
    }
  }
  await aplicarPrazos(sb, u.id, onb, tarefas);
  revalidar([`/crm/onboarding/${t.onboarding_id}`, `/crm/clientes/${onb.client_id}`]);
}

export async function definirPrazoTarefa(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const taskId = s(fd, "task_id")!;
  const dia = s(fd, "due_dia");
  const { data: t } = await sb.from("crm_onboarding_tasks").select("*").eq("id", taskId).single();
  const para = dia ? dataDoCheckIn(dia, 0) : null;
  await erroSe(await sb.from("crm_onboarding_tasks").update({ due_at: para, due_origem: para ? "manual" : null, updated_at: agoraIso() }).eq("id", taskId), "prazo");
  await evento(sb, u.id, { onboarding_id: t.onboarding_id, task_id: taskId, tipo: "prazo", de: t.due_at, para, detalhe: { origem: "manual" } });
  revalidar([`/crm/onboarding/${t.onboarding_id}`]);
}

export async function salvarObservacaoTarefa(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const taskId = s(fd, "task_id")!; const obs = s(fd, "observacoes");
  const { data: t } = await sb.from("crm_onboarding_tasks").select("onboarding_id, observacoes").eq("id", taskId).single();
  if (!t) throw new Error("Tarefa não encontrada.");
  await erroSe(await sb.from("crm_onboarding_tasks").update({ observacoes: obs, updated_at: agoraIso() }).eq("id", taskId), "observação");
  await evento(sb, u.id, { onboarding_id: t.onboarding_id, task_id: taskId, tipo: "observacao", de: t.observacoes, para: obs });
  revalidar([`/crm/onboarding/${t.onboarding_id}`]);
}

export async function salvarLembreteTarefa(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const taskId = s(fd, "task_id")!;
  const lembrete = lerLembrete(fd); const avisar = fd.get("avisar") === "on";
  const { data: t } = await sb.from("crm_onboarding_tasks").select("onboarding_id").eq("id", taskId).single();
  if (!t) throw new Error("Tarefa não encontrada.");
  await erroSe(await sb.from("crm_onboarding_tasks").update({ lembrete, avisar, updated_at: agoraIso() }).eq("id", taskId), "lembrete");
  await evento(sb, u.id, { onboarding_id: t.onboarding_id, task_id: taskId, tipo: "lembrete", detalhe: { lembrete, avisar } });
  revalidar([`/crm/onboarding/${t.onboarding_id}`]);
}

/**
 * O botão de WhatsApp da tarefa. Abrir a conversa não prova envio: fica
 * registrado como "whatsapp_aberto", a tarefa passa a "em andamento" e o
 * Montinho confirma depois com "Enviei" (que leva a aguardando aluno ou
 * concluída, conforme a etapa espera resposta ou não).
 */
export async function registrarAberturaWhatsApp(fd: FormData) {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const taskId = s(fd, "task_id")!;
  const { data: t } = await sb.from("crm_onboarding_tasks").select("onboarding_id, status, started_at").eq("id", taskId).single();
  if (!t) return;
  await evento(sb, u.id, { onboarding_id: t.onboarding_id, task_id: taskId, tipo: "whatsapp_aberto" });
  if (t.status === "pendente") await sb.from("crm_onboarding_tasks").update({ status: "em_andamento", started_at: t.started_at ?? agoraIso(), updated_at: agoraIso() }).eq("id", taskId);
  revalidar([`/crm/onboarding/${t.onboarding_id}`]);
}

// ---------------------------------------------------------------------------
// Avisos
// ---------------------------------------------------------------------------
async function marcarAviso(fd: FormData, patch: (agora: string) => Record<string, unknown>, tipo: "lido" | "adiado" | "dispensado") {
  const u = await exigirEscrita();
  const sb = await supabaseServer();
  const chave = s(fd, "chave")!; const onboardingId = s(fd, "onboarding_id")!; const taskId = s(fd, "task_id");
  const agora = agoraIso();
  await erroSe(await sb.from("crm_onboarding_avisos").upsert({ chave, onboarding_id: onboardingId, task_id: taskId, ...patch(agora), updated_by: u.id, updated_at: agora }, { onConflict: "chave" }), "aviso");
  if (tipo !== "lido") await evento(sb, u.id, { onboarding_id: onboardingId, task_id: taskId, tipo: "adiado", detalhe: { aviso: chave, acao: tipo, ...patch(agora) } });
  revalidar([`/crm/onboarding/${onboardingId}`]);
}
export async function lerAviso(fd: FormData) { await marcarAviso(fd, (agora) => ({ lido_em: agora }), "lido"); }
export async function dispensarAviso(fd: FormData) { await marcarAviso(fd, (agora) => ({ dispensado_em: agora }), "dispensado"); }
export async function adiarAviso(fd: FormData) {
  const dias = Math.max(1, Math.min(30, n(fd, "dias") ?? 1));
  const ate = dataDoCheckIn(diaLocal(new Date()), dias);
  await marcarAviso(fd, () => ({ adiado_ate: ate, lido_em: agoraIso() }), "adiado");
}

// ---------------------------------------------------------------------------
// Atualizar um onboarding em andamento para a versão vigente (ação explícita, com prévia)
// ---------------------------------------------------------------------------
export async function aplicarVersaoAtual(fd: FormData) {
  const u = await exigirAdmin();
  const sb = await supabaseServer();
  const id = s(fd, "onboarding_id")!;
  const { onb, tarefas } = await carregar(sb, id);
  const { data: v } = await sb.from("crm_onboarding_template_versions").select("*").eq("template_id", onb.template_id).order("versao", { ascending: false }).limit(1).single();
  const def = v.definicao as DefinicaoFluxo;
  const d = diffDeVersao(def, tarefas);
  const agora = agoraIso();
  for (const e of d.adicionar) {
    const [linha] = instanciar({ fases: def.fases, etapas: [e] }, onb.iniciado_em);
    await erroSe(await sb.from("crm_onboarding_tasks").insert({ ...linha, onboarding_id: id }), "etapa nova");
  }
  for (const t of d.remover) await sb.from("crm_onboarding_tasks").delete().eq("id", t.id);
  for (const a of d.atualizar) {
    const e = a.def;
    await sb.from("crm_onboarding_tasks").update({ nome: e.nome, descricao: e.descricao || null, instrucoes: e.instrucoes || null, fase: e.fase, ordem: e.ordem, obrigatoria: e.obrigatoria, prazo: e.prazo, depende_de: e.depende_de, condicao: e.condicao, ativar_se: e.ativar_se, na_se: e.na_se, mensagem: e.mensagem, materiais: e.materiais, lembrete: e.lembrete, avisar: e.avisar, acao: e.acao, updated_at: agora }).eq("id", a.tarefa.id);
  }
  await erroSe(await sb.from("crm_onboardings").update({ version_id: v.id, fases: def.fases, updated_at: agora }).eq("id", id), "onboarding");
  await evento(sb, u.id, { onboarding_id: id, tipo: "versao_aplicada", para: String(v.versao), detalhe: { adicionadas: d.adicionar.map((e) => e.key), removidas: d.remover.map((t) => t.key), atualizadas: d.atualizar.map((a) => a.tarefa.key), preservadas: d.preservadas.map((t) => t.key) } });
  const atualizado = await carregar(sb, id);
  await aplicarPrazos(sb, u.id, atualizado.onb, atualizado.tarefas);
  revalidar([`/crm/onboarding/${id}`]);
  redirect(`/crm/onboarding/${id}`);
}

