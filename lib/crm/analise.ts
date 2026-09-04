/** Agregações para os dashboards. Calculadas em memória a partir de base()+catalogo(), usando metricas.ts. */
import type { Base, Catalogo } from "./dados";
import { atribuir, cacMidia, coberturaAtribuicao, ltvCac, ltvMedio, ltvRealizado, razao, roasReceita, type EventoReceita, type Cliente } from "./metricas";
import { contagemFunil } from "./visao";

export const eventosReceita = (b: Base): EventoReceita[] => b.receitas.map((r) => ({ clientId: r.client_id, amount: r.amount, tipo: r.tipo, occurredAt: r.occurred_at, status: r.status }));
/**
 * Só clientes com alguma receita coletada entram em média de LTV. Cliente
 * importado sem recibo (planilha, cadastro) tem LTV desconhecido, não zero —
 * e zero na média derrubaria o número de todo mundo.
 */
export function separarPorReceita(clientes: Cliente[], ev: EventoReceita[]) {
  const com = new Set(ev.filter((e) => e.status === "collected").map((e) => e.clientId));
  return { comReceita: clientes.filter((c) => com.has(c.id)), semReceita: clientes.filter((c) => !com.has(c.id)) };
}
export const clientesMetricas = (b: Base): Cliente[] => b.clientes.map((c) => ({ id: c.id, firstPurchaseAt: c.first_purchase_at, sourceCode: c.source_code, status: c.status, cancelledAt: c.cancelled_at, planId: c.current_plan_id, referredBy: b.contatos.find((x) => x.id === c.contact_id)?.referred_by_contact_id ?? null }));

export interface LinhaFonte { code: string; nome: string; leads: number; qualificados: number; experimentais: number; vendas: number; conversao: number | null; gasto: number | null; cac: ReturnType<typeof cacMidia>; receita: number; ltvMedio: number | null; ltvCac: ReturnType<typeof ltvCac>; roas: number | null; n: number }
/** A tabela central: Canal | Leads | Qualificados | Vendas | Conversão | CAC | Receita | LTV | LTV:CAC */
export function tabelaPorFonte(b: Base, cat: Catalogo, de: Date, ate: Date): LinhaFonte[] {
  const ev = eventosReceita(b);
  const clientes = clientesMetricas(b);
  const noPeriodo = (d: string) => new Date(d) >= de && new Date(d) <= ate;
  const canalGasto: Record<string, string[]> = { google_ads: ["google_ads"], meta_ads: ["instagram_ads", "facebook_ads"] };
  return cat.fontes.map((f) => {
    const leads = b.leads.filter((l) => l.source_code === f.code && noPeriodo(l.created_at));
    const ids = new Set(leads.map((l) => l.id));
    const opps = b.oportunidades.filter((o) => ids.has(o.lead_id));
    const qualificados = opps.filter((o) => o.proposal_sent_at || o.won_at || cat.etapas.find((e) => e.id === o.stage_id)?.ordem! >= 30).length;
    const experimentais = b.experimentais.filter((t) => t.lead_id && ids.has(t.lead_id) && t.status === "realizada").length;
    const vendas = opps.filter((o) => o.won_at).length;
    const cls = clientes.filter((c) => c.sourceCode === f.code && noPeriodo(c.firstPurchaseAt));
    const receita = cls.reduce((s, c) => s + ltvRealizado(ev, c.id), 0);
    const canal = Object.entries(canalGasto).find(([, fs]) => fs.includes(f.code))?.[0];
    const gasto = f.custo_rastreado ? b.gastos.filter((g) => g.canal === canal && noPeriodo(g.data)).reduce((s, g) => s + Number(g.custo), 0) : null;
    const cac = cacMidia(gasto, cls.length);
    const lm = ltvMedio(separarPorReceita(cls, ev).comReceita, ev);
    return { code: f.code, nome: f.nome, leads: leads.length, qualificados, experimentais, vendas, conversao: razao(vendas, leads.length), gasto, cac, receita, ltvMedio: lm.medio, ltvCac: ltvCac(lm.medio, cac.valor, "observado"), roas: gasto != null && gasto > 0 ? roasReceita(receita, gasto) : null, n: cls.length };
  }).filter((l) => l.leads || l.vendas || l.n || (l.gasto ?? 0) > 0);
}

export function serieMensal(b: Base, meses = 12) {
  const out: { mes: string; leads: number; vendas: number; receita: number; novosClientes: number; cancelados: number }[] = [];
  const hoje = new Date();
  for (let i = meses - 1; i >= 0; i--) {
    const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1); const k = d.toISOString().slice(0, 7);
    out.push({
      mes: k, leads: b.leads.filter((l) => l.created_at.startsWith(k)).length, vendas: b.oportunidades.filter((o) => o.won_at?.startsWith(k)).length,
      receita: b.receitas.filter((r) => r.status === "collected" && r.occurred_at.startsWith(k)).reduce((s, r) => s + r.amount, 0),
      novosClientes: b.clientes.filter((c) => c.first_purchase_at.startsWith(k)).length, cancelados: b.clientes.filter((c) => c.cancelled_at?.startsWith(k)).length,
    });
  }
  return out;
}

export function atribuicaoPorModelo(b: Base, cat: Catalogo) {
  const modelos = ["firstTouch", "leadCreationTouch", "lastNonDirect"] as const;
  const res: Record<string, Record<string, { leads: number; vendas: number; receita: number }>> = { firstTouch: {}, leadCreationTouch: {}, lastNonDirect: {}, assisted: {} };
  const ev = eventosReceita(b);
  for (const l of b.leads) {
    const toques = b.toques.filter((t) => t.contact_id === l.contact_id).map((t) => ({ occurredAt: t.occurred_at, sourceCode: t.source_code }));
    const a = atribuir(toques, l.created_at);
    const cl = b.clientes.find((c) => c.contact_id === l.contact_id);
    const receita = cl && l.status === "ganho" ? ltvRealizado(ev, cl.id) : 0;
    for (const m of modelos) {
      const code = a[m]?.sourceCode ?? l.source_code;
      const r = (res[m][code] ??= { leads: 0, vendas: 0, receita: 0 }); r.leads++; if (l.status === "ganho") { r.vendas++; r.receita += receita; }
    }
    for (const t of a.assisted) { const r = (res.assisted[t.sourceCode] ??= { leads: 0, vendas: 0, receita: 0 }); r.leads++; if (l.status === "ganho") { r.vendas++; r.receita += receita; } }
  }
  const nome = (c: string) => cat.fontes.find((f) => f.code === c)?.nome ?? c;
  return { res, nome, cobertura: coberturaAtribuicao(b.clientes.map((c) => ({ sourceCode: c.source_code }))), coberturaReceita: coberturaAtribuicao(b.clientes.map((c) => ({ sourceCode: c.source_code, peso: ltvRealizado(ev, c.id) }))) };
}

export function landingPages(b: Base) {
  const por = new Map<string, { cliques: number; leads: number; vendas: number; receita: number }>();
  const ev = eventosReceita(b);
  for (const h of b.handoffs) {
    const k = h.landing_page?.split("?")[0] ?? h.page_path ?? "?";
    const r = por.get(k) ?? { cliques: 0, leads: 0, vendas: 0, receita: 0 }; r.cliques++;
    if (h.lead_id) { r.leads++; const l = b.leads.find((x) => x.id === h.lead_id); if (l?.status === "ganho") { r.vendas++; const cl = b.clientes.find((c) => c.contact_id === l.contact_id); if (cl) r.receita += ltvRealizado(ev, cl.id); } }
    por.set(k, r);
  }
  return [...por.entries()].map(([pagina, r]) => ({ pagina, ...r })).sort((a, z) => z.receita - a.receita || z.leads - a.leads || z.cliques - a.cliques);
}

export function funilPeriodo(b: Base, cat: Catalogo, dias: number) {
  const ate = new Date(); const de = new Date(ate.getTime() - dias * 86400000);
  return { de, ate, contagem: contagemFunil(b, cat, de, ate) };
}
