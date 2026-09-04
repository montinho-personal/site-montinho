/** Formas das linhas do banco (snake_case, como vêm do Supabase). */
export type Papel = "admin" | "user" | "readonly";
export type Confianca = "high" | "medium" | "low";

export interface Fonte { code: string; nome: string; categoria: string; custo_rastreado: boolean; ordem: number; ativo: boolean }
export interface Servico { id: string; code: string; nome: string; exige_experimental: boolean; ativo: boolean; ordem: number }
export interface Plano { id: string; service_id: string; nome: string; tipo_cobranca: string; ciclo_meses: number; preco: number; sessoes_por_semana: number | null; descricao: string | null; ativo: boolean; ordem: number }
export interface Pipeline { id: string; code: string; nome: string; service_id: string | null }
export interface Etapa { id: string; pipeline_id: string; code: string; nome: string; ordem: number; tipo: "open" | "won" | "lost"; probabilidade_config: number | null }
export interface MotivoPerda { code: string; nome: string; ordem: number; ativo: boolean }
export interface Template { id: string; tipo: string; titulo: string; corpo: string; ativo: boolean; ordem: number }
export interface UsuarioRow { id: string; email: string; nome: string | null; role: Papel; ativo: boolean; created_at: string }

export interface Contato {
  id: string; nome: string; telefone: string | null; telefone_e164: string | null; email: string | null; instagram: string | null; cidade: string | null;
  como_conheceu: string | null; referred_by_contact_id: string | null; referral_code: string | null; consent_marketing: boolean | null;
  possivel_duplicata_de: string | null; merged_into_contact_id: string | null; anonimizado: boolean; observacoes: string | null; created_at: string; updated_at: string;
}
export interface Lead {
  id: string; contact_id: string; service_id: string | null; interesse: string | null; status: "aberto" | "ganho" | "perdido" | "inativo";
  source_code: string; source_detail: string | null; attribution_confidence: Confianca; handoff_id: string | null; referred_by_contact_id: string | null;
  owner_id: string | null; next_action: string | null; next_action_at: string | null; last_contact_at: string | null; first_response_at: string | null;
  lost_at: string | null; lost_reason_code: string | null; lost_reason_text: string | null; reactivation_eligible_at: string | null; created_at: string; updated_at: string;
}
export interface Oportunidade {
  id: string; lead_id: string; contact_id: string; pipeline_id: string; stage_id: string; service_id: string | null; plan_id: string | null;
  expected_value: number | null; recurring_value: number | null; ciclo_meses: number | null; probability: number | null; expected_close_date: string | null;
  proposal_sent_at: string | null; proposal_value: number | null; won_at: string | null; won_value: number | null; lost_at: string | null;
  loss_reason_code: string | null; loss_reason_text: string | null; created_at: string; updated_at: string;
}
export interface HistoricoEtapa { id: string; opportunity_id: string; from_stage_id: string | null; to_stage_id: string; changed_at: string; changed_by: string | null }
export interface Experimental { id: string; contact_id: string; lead_id: string | null; opportunity_id: string | null; scheduled_at: string; local: string | null; status: "agendada" | "realizada" | "no_show" | "cancelada"; completed_at: string | null; outcome: string | null; calendar_event_id: string | null; origem_registro: string; created_at: string }
export interface Atividade { id: string; contact_id: string | null; lead_id: string | null; opportunity_id: string | null; client_id: string | null; tipo: string; descricao: string | null; ocorreu_em: string; metadata: Record<string, unknown>; created_by: string | null; created_at: string }
export interface Tarefa { id: string; contact_id: string | null; lead_id: string | null; opportunity_id: string | null; client_id: string | null; tipo: string; titulo: string; due_at: string; priority: "alta" | "media" | "baixa"; completed_at: string | null; owner_id: string | null; origem: string; created_at: string }
export interface ClienteRow {
  id: string; contact_id: string; first_purchase_at: string; status: "ativo" | "pausado" | "inativo" | "cancelado"; service_id: string | null; current_plan_id: string | null;
  start_date: string | null; end_date: string | null; renewal_date: string | null; source_code: string; source_confidence: Confianca; cancel_reason: string | null;
  cancelled_at: string | null; reactivated_at: string | null; origem_registro: string; created_at: string; updated_at: string;
}
export interface Contrato { id: string; client_id: string; opportunity_id: string | null; service_id: string; plan_id: string; valor: number; ciclo_meses: number; inicio: string; fim: string | null; renovacao_prevista: string | null; status: "ativo" | "renovado" | "encerrado" | "cancelado"; contrato_anterior_id: string | null; created_at: string }
export interface EventoReceitaRow { id: string; client_id: string; contract_id: string | null; tipo: string; amount: number; occurred_at: string; status: "expected" | "contracted" | "collected"; service_id: string | null; plan_id: string | null; source_code: string | null; payment_method: string | null; external_ref: string | null; fee: number | null; notes: string | null; confidence: string; import_id: string | null; created_at: string }
export interface Handoff {
  id: string; ref_code: string; created_at: string; anonymous_id: string | null; session_id: string | null; page_url: string | null; page_path: string | null; page_title: string | null; cta_id: string | null;
  ferramenta: string | null; servico_interesse: string | null; landing_page: string | null; referrer: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_content: string | null; utm_term: string | null;
  gclid: string | null; gbraid: string | null; wbraid: string | null; fbclid: string | null; source_code: string | null; first_touch: Record<string, unknown> | null;
  device: string | null; consent: boolean | null; contact_id: string | null; lead_id: string | null; linked_at: string | null; link_confidence: Confianca | null;
}
export interface ToqueRow { id: string; contact_id: string | null; handoff_id: string | null; occurred_at: string; source_code: string; medium: string | null; campaign: string | null; content: string | null; term: string | null; landing_page: string | null; referrer: string | null; page_url: string | null; cta_id: string | null; gclid: string | null; gbraid: string | null; wbraid: string | null; fbclid: string | null; confidence: Confianca; origem_registro: string }
export interface GastoAds { id: string; canal: string; campanha: string | null; campaign_id: string | null; data: string; custo: number; cliques: number | null; impressoes: number | null; conversoes: number | null }
export interface ImportRow { id: string; fonte: string; executado_em: string; periodo_inicio: string | null; periodo_fim: string | null; registros: number; sucesso: number; duplicados: number; erros: number; nao_casados: number; limitacoes: string | null; relatorio: Record<string, unknown> }
export interface HistoricoAquisicao { id: string; fonte: string; granularidade: string; data: string; dimensoes: Record<string, unknown>; metricas: Record<string, number>; confidence: string }
export interface ConfigSla { novo_lead_sem_contato_horas: number; proposta_sem_follow_up_dias: number; lead_parado_dias: number; negociacao_antiga_dias: number }
