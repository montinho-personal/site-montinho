import { exigirUsuario } from "@/lib/crm/auth";
import { base, historicoAquisicao, importacoes } from "@/lib/crm/dados";
import { landingPages } from "@/lib/crm/analise";
import AnalyticsNav from "@/components/crm/AnalyticsNav";
import { Card, Pagina, Stat, Tabela, brl, num, pct } from "@/components/crm/ui";

export default async function Seo() {
  await exigirUsuario();
  const [b, gsc, ga4, imps] = await Promise.all([base(), historicoAquisicao("gsc"), historicoAquisicao("ga4"), importacoes()]);
  const lp = landingPages(b);
  const porPagina = new Map<string, { cliques: number; impressoes: number }>();
  for (const r of gsc) { if (r.granularidade === "total" && r.dimensoes.page) { const k = String(r.dimensoes.page).replace(/^https?:\/\/[^/]+/, ""); const x = porPagina.get(k) ?? { cliques: 0, impressoes: 0 }; x.cliques += Number(r.metricas.clicks ?? 0); x.impressoes += Number(r.metricas.impressions ?? 0); porPagina.set(k, x); } }
  const linhas = [...porPagina.entries()].map(([pagina, m]) => { const l = lp.find((x) => x.pagina === pagina); return { pagina, ...m, waCliques: l?.cliques ?? 0, leads: l?.leads ?? 0, vendas: l?.vendas ?? 0, receita: l?.receita ?? 0 }; }).sort((a, z) => z.receita - a.receita || z.leads - a.leads || z.cliques - a.cliques).slice(0, 60);
  const totalCliques = [...porPagina.values()].reduce((s, x) => s + x.cliques, 0);
  const ga4Dias = ga4.filter((r) => r.granularidade === "day");
  const ultimasImps = imps.filter((i) => ["gsc", "ga4"].includes(i.fonte)).slice(0, 4);
  return (
    <Pagina titulo="SEO → Receita" sub="Qual artigo realmente gera cliente, não só visita. Search Console e GA4 são agregados: nunca viram pessoa.">
      <AnalyticsNav atual="/crm/analytics/seo" />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat rotulo="Páginas com dado GSC" valor={porPagina.size} />
        <Stat rotulo="Cliques orgânicos (export)" valor={num(totalCliques)} />
        <Stat rotulo="Dias de série GA4" valor={ga4Dias.length} />
        <Stat rotulo="Receita ligada a página" valor={brl(lp.reduce((s, x) => s + x.receita, 0))} sub="via código Ref do WhatsApp" />
      </div>
      <Card titulo="Página orgânica → cliques → WhatsApp → leads → vendas → receita">
        <Tabela cabecalho={["Página", "Impressões", "Cliques GSC", "CTR", "Cliques WhatsApp", "Leads", "Vendas", "Receita"]} linhas={linhas.map((l) => [<span key="p" className="text-xs">{l.pagina}</span>, num(l.impressoes), num(l.cliques), pct(l.impressoes ? l.cliques / l.impressoes : null, 1), l.waCliques, l.leads, l.vendas, brl(l.receita)])} vazio="Importe o Search Console (scripts/crm-importar-gsc.ts) para ver esta tabela." />
      </Card>
      <Card titulo="Importações" className="mt-4"><Tabela cabecalho={["Fonte", "Quando", "Período", "Registros", "Limitações"]} linhas={ultimasImps.map((i) => [i.fonte, new Date(i.executado_em).toLocaleDateString("pt-BR"), `${i.periodo_inicio ?? "?"} → ${i.periodo_fim ?? "?"}`, i.registros, <span key="l" className="text-xs">{i.limitacoes}</span>])} vazio="Nenhuma importação ainda." /></Card>
    </Pagina>
  );
}
