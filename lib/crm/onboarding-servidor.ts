/**
 * Partes do onboarding usadas por mais de uma ação (o ganho em
 * app/crm/actions.ts e as telas do onboarding). Ficam fora do arquivo
 * "use server" de propósito: lá, toda exportação vira endpoint chamável
 * pelo navegador, e estas recebem o cliente do banco como argumento.
 */
import { FLUXO_PADRAO, instanciar, validarDefinicao, type DefinicaoFluxo } from "./onboarding-fluxo";

const agoraIso = () => new Date().toISOString();
async function erroSe(r: { error: { message: string } | null }, ctx: string) { if (r.error) throw new Error(`${ctx}: ${r.error.message}`); }

export async function evento(sb: any, uid: string, e: { onboarding_id: string; task_id?: string | null; tipo: string; de?: string | null; para?: string | null; detalhe?: Record<string, unknown> }) {
  await erroSe(await sb.from("crm_onboarding_events").insert({ detalhe: {}, ...e, created_by: uid }), "histórico");
}

/**
 * Garante que o modelo padrão tenha uma versão publicada. A migração cria o
 * modelo vazio; a versão 1 nasce de FLUXO_PADRAO aqui, pela mesma validação
 * de qualquer edição. Idempotente: já existindo versão, não faz nada.
 */
export async function garantirVersaoPadrao(sb: any, uid: string): Promise<{ templateId: string; versionId: string } | null> {
  const { data: tpl } = await sb.from("crm_onboarding_templates").select("id, versao_atual").eq("padrao", true).maybeSingle();
  if (!tpl) return null;
  const { data: v } = await sb.from("crm_onboarding_template_versions").select("id").eq("template_id", tpl.id).order("versao", { ascending: false }).limit(1).maybeSingle();
  if (v) return { templateId: tpl.id, versionId: v.id };
  const erros = validarDefinicao(FLUXO_PADRAO); if (erros.length) throw new Error(erros.join(" "));
  const { data: nova, error } = await sb.from("crm_onboarding_template_versions").insert({ template_id: tpl.id, versao: 1, definicao: FLUXO_PADRAO, nota: "Fluxo inicial (briefing de 04/11/2026).", created_by: uid }).select("id").single();
  if (error) throw new Error(`versão: ${error.message}`);
  await sb.from("crm_onboarding_templates").update({ versao_atual: 1, updated_at: agoraIso() }).eq("id", tpl.id);
  return { templateId: tpl.id, versionId: nova.id };
}

/**
 * Inicia o onboarding de um cliente. Chamada pelo ganho (automático) e pelo
 * botão "Iniciar onboarding" (clientes antigos). Nunca duplica: com um
 * aberto, devolve o existente.
 */
export async function iniciarOnboardingDeCliente(sb: any, uid: string, clientId: string, opts: { inicio?: string; templateId?: string | null } = {}): Promise<string> {
  const { data: aberto } = await sb.from("crm_onboardings").select("id").eq("client_id", clientId).in("status", ["em_andamento", "pausado"]).maybeSingle();
  if (aberto) return aberto.id;
  const { data: c } = await sb.from("crm_clients").select("id, contact_id, service_id, current_plan_id").eq("id", clientId).single();
  if (!c) throw new Error("Cliente não encontrado.");
  await garantirVersaoPadrao(sb, uid);
  const { data: templates } = await sb.from("crm_onboarding_templates").select("*").eq("ativo", true);
  const ts = (templates ?? []) as { id: string; service_id: string | null; plan_id: string | null; padrao: boolean }[];
  const tpl = (opts.templateId && ts.find((t) => t.id === opts.templateId))
    ?? ts.find((t) => t.plan_id && t.plan_id === c.current_plan_id)
    ?? ts.find((t) => t.service_id && t.service_id === c.service_id && !t.plan_id)
    ?? ts.find((t) => t.padrao);
  if (!tpl) throw new Error("Nenhum modelo de onboarding ativo.");
  const { data: v } = await sb.from("crm_onboarding_template_versions").select("*").eq("template_id", tpl.id).order("versao", { ascending: false }).limit(1).maybeSingle();
  if (!v) throw new Error("O modelo escolhido não tem versão publicada.");
  const def = v.definicao as DefinicaoFluxo;
  const iniciadoEm = opts.inicio ? new Date(opts.inicio + "T12:00:00").toISOString() : agoraIso();
  const { data: onb, error } = await sb.from("crm_onboardings").insert({ client_id: clientId, contact_id: c.contact_id, template_id: tpl.id, version_id: v.id, plan_id: c.current_plan_id, status: "em_andamento", iniciado_em: iniciadoEm, fases: def.fases, created_by: uid }).select("id").single();
  if (error) throw new Error(`onboarding: ${error.message}`);
  const linhas = instanciar(def, iniciadoEm).map((t) => ({ ...t, onboarding_id: onb.id }));
  if (linhas.length) await erroSe(await sb.from("crm_onboarding_tasks").insert(linhas), "tarefas");
  await evento(sb, uid, { onboarding_id: onb.id, tipo: "iniciado", detalhe: { template_id: tpl.id, versao: v.versao, etapas: linhas.length } });
  return onb.id;
}
