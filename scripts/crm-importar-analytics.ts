/**
 * Importação histórica AGREGADA: Search Console e GA4, a partir dos exports
 * que já vivem em data/analytics. Gera SQL idempotente para
 * crm_historical_acquisition + o relatório em crm_imports.
 *
 *   npx tsx scripts/crm-importar-analytics.ts > /caminho/import.sql
 *
 * O que sabemos: cliques/impressões por página (GSC), totais do site e
 * cliques de WhatsApp por dia (GA4, quando há série).
 * O que NÃO sabemos: nenhuma sessão vira pessoa. Confiança = 'aggregate'.
 */
import { readFileSync, existsSync } from "node:fs";

const q = (s: unknown) => (s == null ? "null" : `'${String(s).replace(/'/g, "''")}'`);
const j = (o: unknown) => `'${JSON.stringify(o).replace(/'/g, "''")}'::jsonb`;
const linhas: string[] = [];
const relatorios: { fonte: string; inicio: string | null; fim: string | null; n: number; limitacoes: string; extra: Record<string, unknown> }[] = [];

// ---------------- GSC: páginas locais (gsc-local) + impressões do blog ----------------
{
  const gsc = JSON.parse(readFileSync("data/analytics/gsc-local/2026-09-02.json", "utf8"));
  const imp = JSON.parse(readFileSync("data/analytics/impressoes-blog.json", "utf8"));
  const vals: string[] = [];
  for (const l of gsc.locais as { url: string; cliques: number; impressoes: number; ctr: number; posicao: number }[]) {
    vals.push(`('gsc','total','2026-09-02',${j({ page: l.url, tipo: "pagina_local", periodo: "ate_2026-09-02" })},${j({ clicks: l.cliques, impressions: l.impressoes, ctr: l.ctr, position: l.posicao })},'aggregate')`);
  }
  for (const [slug, impressoes] of Object.entries(imp.impressoes as Record<string, number>)) {
    vals.push(`('gsc','total','2026-09-02',${j({ page: `/blog/${slug}`, tipo: "artigo", periodo: imp.periodo })},${j({ impressions: impressoes })},'aggregate')`);
  }
  linhas.push(`with imp as (insert into crm_imports (fonte, periodo_inicio, periodo_fim, registros, sucesso, limitacoes, relatorio) values ('gsc','2026-06-24','2026-09-02',${vals.length},${vals.length},${q("Export manual do Search Console (aba Páginas), sem API. Páginas locais têm cliques, impressões, CTR e posição; artigos do blog só impressões. Não há query, device nem país neste export. Nada liga a pessoa.")},${j({ paginasLocais: gsc.locais.length, artigos: Object.keys(imp.impressoes).length, fonte: imp.fonte })}) returning id)
insert into crm_historical_acquisition (import_id, fonte, granularidade, data, dimensoes, metricas, confidence)
select imp.id, v.fonte, v.gran, v.data::date, v.dim, v.met, v.conf from imp, (values ${vals.join(",\n")}) as v(fonte, gran, data, dim, met, conf);`);
  relatorios.push({ fonte: "gsc", inicio: "2026-06-24", fim: "2026-09-02", n: vals.length, limitacoes: "export manual, sem query/device", extra: {} });
}

// ---------------- GA4: histórico agregado + série diária de eventos ----------------
{
  const hist = JSON.parse(readFileSync("data/analytics/historico.json", "utf8"));
  const diario = existsSync("data/analytics/diario.json") ? JSON.parse(readFileSync("data/analytics/diario.json", "utf8")) : [];
  const vals: string[] = [];
  for (const h of hist as any[]) {
    vals.push(`('ga4','total',${q(h.periodo.fim)},${j({ periodo: h.periodo, tipo: "resumo_site" })},${j({ users: h.publico?.usuarios, pageviews: h.publico?.visualizacoes, engaged_users: h.engajamento?.engajados, whatsapp_clicks: h.conversa?.cliquesWhatsapp, whatsapp_users: h.conversa?.usuariosWhatsapp, leads_ga4: h.conversa?.leads, conversions: h.conversa?.conversoes, blog_users: h.blog?.usuarios, blog_conversions: h.blog?.conversoes })},'aggregate')`);
  }
  for (const d of diario as any[]) {
    vals.push(`('ga4','day',${q(d.data)},${j({ tipo: "eventos_dia", parcial: d.parcial ?? null, fonte: d.fonte })},${j(d.eventos)},'aggregate')`);
  }
  const ini = hist[0]?.periodo?.inicio ?? null, fim = diario.length ? diario[diario.length - 1].data : hist[hist.length - 1]?.periodo?.fim;
  linhas.push(`with imp as (insert into crm_imports (fonte, periodo_inicio, periodo_fim, registros, sucesso, limitacoes, relatorio) values ('ga4',${q(ini)},${q(fim)},${vals.length},${vals.length},${q("Leitura manual do app GA4 (sem Data API). Resumo do período em bloco único + série diária de eventos iniciada em 2026-09-02. Não há source/medium/campaign/landing por dia neste material: a dimensão de aquisição só vem com a API ou export do Explorar. Nenhuma sessão vira pessoa.")},${j({ blocosHistorico: hist.length, diasSerie: diario.length })}) returning id)
insert into crm_historical_acquisition (import_id, fonte, granularidade, data, dimensoes, metricas, confidence)
select imp.id, v.fonte, v.gran, v.data::date, v.dim, v.met, v.conf from imp, (values ${vals.join(",\n")}) as v(fonte, gran, data, dim, met, conf);`);
  relatorios.push({ fonte: "ga4", inicio: ini, fim, n: vals.length, limitacoes: "sem Data API; sem dimensão de aquisição por dia", extra: {} });
}

console.log("-- Gerado por scripts/crm-importar-analytics.ts em " + new Date().toISOString());
console.log("delete from crm_historical_acquisition where fonte in ('gsc','ga4'); delete from crm_imports where fonte in ('gsc','ga4');");
console.log(linhas.join("\n\n"));
console.error(JSON.stringify(relatorios, null, 1));
