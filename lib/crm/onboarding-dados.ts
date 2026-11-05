/**
 * Leitura do onboarding (Server Components). Mesmo desenho de dados.ts:
 * consultas pela sessão do usuário (RLS), junções em TypeScript, cache()
 * por renderização.
 */
import { cache } from "react";
import { supabaseServer } from "./supabase/server";
import type { DefinicaoFluxo, FaseDef, OnboardingRow, TarefaOnb } from "./onboarding-fluxo";
import { avisosDe, ehResolvida, progresso, proximaAcao, situacao, verTodas, type Aviso, type Progresso, type SituacaoOnb, type TarefaVista } from "./onboarding-fluxo";
import { base, catalogo } from "./dados";

export interface TemplateOnb { id: string; nome: string; descricao: string | null; service_id: string | null; plan_id: string | null; ativo: boolean; padrao: boolean; versao_atual: number; created_at: string; updated_at: string }
export interface VersaoOnb { id: string; template_id: string; versao: number; definicao: DefinicaoFluxo; nota: string | null; created_by: string | null; created_at: string }
export interface EventoOnb { id: number; onboarding_id: string; task_id: string | null; tipo: string; de: string | null; para: string | null; detalhe: Record<string, unknown>; created_by: string | null; created_at: string }
export interface AvisoRow { chave: string; onboarding_id: string; task_id: string | null; lido_em: string | null; dispensado_em: string | null; adiado_ate: string | null }

type SB = Awaited<ReturnType<typeof supabaseServer>>;
async function todos<T>(sb: SB, tabela: string, mod?: (q: any) => any): Promise<T[]> {
  let q: any = sb.from(tabela).select("*");
  if (mod) q = mod(q);
  const { data, error } = await q.limit(5000);
  if (error) throw new Error(`${tabela}: ${error.message}`);
  return (data ?? []) as T[];
}

export interface BaseOnboarding { templates: TemplateOnb[]; versoes: VersaoOnb[]; onboardings: OnboardingRow[]; tarefas: TarefaOnb[]; avisos: AvisoRow[] }
export const baseOnboarding = cache(async function baseOnboarding(): Promise<BaseOnboarding> {
  const sb = await supabaseServer();
  const [templates, versoes, onboardings, tarefas, avisos] = await Promise.all([
    todos<TemplateOnb>(sb, "crm_onboarding_templates", (q) => q.order("created_at")),
    todos<VersaoOnb>(sb, "crm_onboarding_template_versions", (q) => q.order("versao")),
    todos<OnboardingRow>(sb, "crm_onboardings", (q) => q.order("iniciado_em", { ascending: false })),
    todos<TarefaOnb>(sb, "crm_onboarding_tasks", (q) => q.order("ordem")),
    todos<AvisoRow>(sb, "crm_onboarding_avisos"),
  ]);
  return { templates, versoes, onboardings, tarefas, avisos };
});

export async function eventosDoOnboarding(id: string): Promise<EventoOnb[]> {
  const sb = await supabaseServer();
  return todos<EventoOnb>(sb, "crm_onboarding_events", (q) => q.eq("onboarding_id", id).order("created_at", { ascending: false }));
}

/** A versão vigente de um modelo (a última publicada). */
export function versaoVigente(b: Pick<BaseOnboarding, "versoes">, templateId: string): VersaoOnb | null {
  const vs = b.versoes.filter((v) => v.template_id === templateId).sort((a, z) => z.versao - a.versao);
  return vs[0] ?? null;
}

/** Qual modelo serve um serviço/plano: o mais específico ativo; senão o padrão. */
export function modeloPara(b: Pick<BaseOnboarding, "templates">, serviceId: string | null, planId: string | null): TemplateOnb | null {
  const ativos = b.templates.filter((t) => t.ativo);
  return ativos.find((t) => t.plan_id && t.plan_id === planId)
    ?? ativos.find((t) => t.service_id && t.service_id === serviceId && !t.plan_id)
    ?? ativos.find((t) => t.padrao)
    ?? ativos.find((t) => !t.service_id && !t.plan_id)
    ?? null;
}

export const fasesDe = (onb: OnboardingRow): FaseDef[] => [...(onb.fases ?? [])].sort((a, z) => a.ordem - z.ordem);

// ---------------------------------------------------------------------------
// Painel: tudo o que as telas mostram, derivado numa passada só.
// ---------------------------------------------------------------------------

export interface LinhaPainel {
  onb: OnboardingRow; nome: string; telefone: string | null; plano: string | null; template: string | null;
  vistas: TarefaVista[]; progresso: Progresso; situacao: SituacaoOnb; proxima: TarefaVista | null; avisos: AvisoVisto[];
}
export interface AvisoVisto extends Aviso { lido: boolean }

/**
 * Quando uma etapa foi liberada: a data da última dependência resolvida.
 * Só conta se foi nas últimas 48h (aviso "liberou" é notícia, não estoque).
 */
function liberadasRecentes(tarefas: TarefaOnb[], agora: Date): Map<string, string> {
  const out = new Map<string, string>();
  for (const t of tarefas) {
    if (t.status !== "pendente" || !t.depende_de.length) continue;
    const deps = t.depende_de.map((k) => tarefas.find((x) => x.key === k)).filter((x): x is TarefaOnb => !!x);
    if (!deps.length || !deps.every(ehResolvida)) continue;
    const quando = deps.map((d) => d.completed_at ?? d.updated_at).sort().at(-1)!;
    if (agora.getTime() - new Date(quando).getTime() <= 48 * 3_600_000) out.set(t.id, quando);
  }
  return out;
}

export async function painelOnboarding(agora = new Date()): Promise<{ linhas: LinhaPainel[]; bo: BaseOnboarding }> {
  const [bo, b, cat] = await Promise.all([baseOnboarding(), base(), catalogo()]);
  const avisosPorChave = new Map(bo.avisos.map((a) => [a.chave, a]));
  const linhas = bo.onboardings.map((onb): LinhaPainel => {
    const tarefas = bo.tarefas.filter((t) => t.onboarding_id === onb.id);
    const vistas = verTodas(tarefas, agora);
    const contato = b.contatos.find((c) => c.id === onb.contact_id);
    const nome = contato?.nome ?? "Aluno";
    const avisos = avisosDe(onb, nome, vistas, agora, liberadasRecentes(tarefas, agora)).flatMap((a): AvisoVisto[] => {
      const r = avisosPorChave.get(a.chave);
      if (r?.dispensado_em) return [];
      if (r?.adiado_ate && new Date(r.adiado_ate) > agora) return [];
      // Um adiamento vencido volta como não lido.
      return [{ ...a, lido: !!r?.lido_em && !(r.adiado_ate && new Date(r.adiado_ate) <= agora) }];
    });
    return {
      onb, nome, telefone: contato?.telefone_e164 ?? null,
      plano: cat.planos.find((p) => p.id === onb.plan_id)?.nome ?? null,
      template: bo.templates.find((t) => t.id === onb.template_id)?.nome ?? null,
      vistas, progresso: progresso(vistas), situacao: situacao(onb, vistas, agora), proxima: proximaAcao(vistas), avisos,
    };
  });
  return { linhas, bo };
}

/** Avisos não lidos, para o sino. Falha silenciosa: o sino nunca derruba a tela. */
export async function contarAvisos(): Promise<number> {
  try { const { linhas } = await painelOnboarding(); return linhas.reduce((s, l) => s + l.avisos.filter((a) => !a.lido).length, 0); }
  catch { return 0; }
}
