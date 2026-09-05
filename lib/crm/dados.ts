/**
 * Leitura de dados do CRM (Server Components). Toda consulta passa pela
 * sessão do usuário — o RLS decide o que ele vê. As junções são feitas em
 * TypeScript: o volume é de centenas de linhas e isso evita depender de
 * nomes de FK na sintaxe de embed do PostgREST.
 */
import { cache } from "react";
import { supabaseServer } from "./supabase/server";
import type {
  Atividade, ClienteRow, ConfigSla, Contato, Contrato, Etapa, EventoReceitaRow, Experimental, Fonte, GastoAds, Handoff, HistoricoAquisicao, HistoricoEtapa,
  ImportRow, Lead, MotivoPerda, Oportunidade, Pipeline, Plano, Servico, Tarefa, Template, ToqueRow, UsuarioRow,
} from "./tipos";

type SB = Awaited<ReturnType<typeof supabaseServer>>;
async function todos<T>(sb: SB, tabela: string, mod?: (q: any) => any): Promise<T[]> {
  let q: any = sb.from(tabela).select("*");
  if (mod) q = mod(q);
  const { data, error } = await q.limit(5000);
  if (error) throw new Error(`${tabela}: ${error.message}`);
  return (data ?? []) as T[];
}

export interface Catalogo { fontes: Fonte[]; servicos: Servico[]; planos: Plano[]; pipelines: Pipeline[]; etapas: Etapa[]; motivos: MotivoPerda[]; templates: Template[]; usuarios: UsuarioRow[]; config: Record<string, any> }
export const catalogo = cache(async function catalogo(): Promise<Catalogo> {
  const sb = await supabaseServer();
  const [fontes, servicos, planos, pipelines, etapas, motivos, templates, usuarios, cfg] = await Promise.all([
    todos<Fonte>(sb, "crm_sources", (q) => q.order("ordem")),
    todos<Servico>(sb, "crm_services", (q) => q.order("ordem")),
    todos<Plano>(sb, "crm_plans", (q) => q.order("ordem")),
    todos<Pipeline>(sb, "crm_pipelines"),
    todos<Etapa>(sb, "crm_stages", (q) => q.order("ordem")),
    todos<MotivoPerda>(sb, "crm_loss_reasons", (q) => q.order("ordem")),
    todos<Template>(sb, "crm_message_templates", (q) => q.order("ordem")),
    todos<UsuarioRow>(sb, "crm_users"),
    todos<{ key: string; value: any }>(sb, "crm_settings"),
  ]);
  return { fontes, servicos, planos, pipelines, etapas, motivos, templates, usuarios, config: Object.fromEntries(cfg.map((c) => [c.key, c.value])) };
});
export const slaPadrao: ConfigSla = { novo_lead_sem_contato_horas: 24, proposta_sem_follow_up_dias: 2, lead_parado_dias: 5, negociacao_antiga_dias: 7 };

export interface Base {
  contatos: Contato[]; leads: Lead[]; oportunidades: Oportunidade[]; experimentais: Experimental[]; tarefas: Tarefa[]; clientes: ClienteRow[];
  contratos: Contrato[]; receitas: EventoReceitaRow[]; atividades: Atividade[]; handoffs: Handoff[]; toques: ToqueRow[]; gastos: GastoAds[]; historicoEtapas: HistoricoEtapa[];
}
/**
 * Tudo que as telas operacionais e analíticas precisam. Uma leitura, cálculo
 * em memória. Envolvida em cache() do React: se a página e um componente
 * pedirem a base na mesma renderização, o banco é consultado uma vez só.
 */
export const base = cache(async function base(): Promise<Base> {
  const sb = await supabaseServer();
  const [contatos, leads, oportunidades, experimentais, tarefas, clientes, contratos, receitas, atividades, handoffs, toques, gastos, historicoEtapas] = await Promise.all([
    todos<Contato>(sb, "crm_contacts", (q) => q.is("merged_into_contact_id", null).order("created_at", { ascending: false })),
    todos<Lead>(sb, "crm_leads", (q) => q.order("created_at", { ascending: false })),
    todos<Oportunidade>(sb, "crm_opportunities"),
    todos<Experimental>(sb, "crm_trials", (q) => q.order("scheduled_at")),
    todos<Tarefa>(sb, "crm_tasks", (q) => q.order("due_at")),
    todos<ClienteRow>(sb, "crm_clients"),
    todos<Contrato>(sb, "crm_contracts"),
    todos<EventoReceitaRow>(sb, "crm_revenue_events", (q) => q.order("occurred_at")),
    todos<Atividade>(sb, "crm_activities", (q) => q.order("ocorreu_em", { ascending: false })),
    todos<Handoff>(sb, "crm_whatsapp_handoffs", (q) => q.order("created_at", { ascending: false })),
    todos<ToqueRow>(sb, "crm_attribution_touches", (q) => q.order("occurred_at")),
    todos<GastoAds>(sb, "crm_ad_spend"),
    todos<HistoricoEtapa>(sb, "crm_stage_history"),
  ]);
  return { contatos, leads, oportunidades, experimentais, tarefas, clientes, contratos, receitas, atividades, handoffs, toques, gastos, historicoEtapas };
});

export async function historicoAquisicao(fonte?: string): Promise<HistoricoAquisicao[]> {
  const sb = await supabaseServer();
  return todos<HistoricoAquisicao>(sb, "crm_historical_acquisition", (q) => (fonte ? q.eq("fonte", fonte) : q).order("data"));
}
export async function importacoes(): Promise<ImportRow[]> {
  const sb = await supabaseServer();
  return todos<ImportRow>(sb, "crm_imports", (q) => q.order("executado_em", { ascending: false }));
}
export async function auditoria(tabela: string, rowId: string) {
  const sb = await supabaseServer();
  const { data } = await sb.from("crm_audit_log").select("*").eq("table_name", tabela).eq("row_id", rowId).order("changed_at", { ascending: false }).limit(50);
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Índices e utilidades de junção
// ---------------------------------------------------------------------------
export const porId = <T extends { id: string }>(xs: T[]) => new Map(xs.map((x) => [x.id, x]));
export const porCodigo = <T extends { code: string }>(xs: T[]) => new Map(xs.map((x) => [x.code, x]));

export function etapaAtual(cat: Catalogo, opp: Oportunidade | undefined | null): Etapa | undefined {
  return opp ? cat.etapas.find((e) => e.id === opp.stage_id) : undefined;
}
export function oportunidadeAtiva(b: Base, leadId: string): Oportunidade | undefined {
  const ops = b.oportunidades.filter((o) => o.lead_id === leadId).sort((a, c) => c.created_at.localeCompare(a.created_at));
  return ops.find((o) => !o.won_at && !o.lost_at) ?? ops[0];
}
export function nomeContato(b: Base, contactId: string) {
  return b.contatos.find((c) => c.id === contactId)?.nome ?? "Contato";
}
/** Mensagem pré-preenchida para abrir o WhatsApp do contato. Nunca leva dado do corpo. */
export function urlWhatsAppContato(telefoneE164: string | null, texto?: string) {
  if (!telefoneE164) return null;
  const n = telefoneE164.replace(/\D/g, "");
  return `https://wa.me/${n}${texto ? `?text=${encodeURIComponent(texto)}` : ""}`;
}
