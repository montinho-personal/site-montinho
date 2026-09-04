import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { funilPeriodo, tabelaPorFonte, landingPages } from "@/lib/crm/analise";
import { custoPorLead, custoPorLeadQualificado, custoPorExperimental, custoPorVenda } from "@/lib/crm/metricas";
import AnalyticsNav, { Periodo } from "@/components/crm/AnalyticsNav";
import { Card, Pagina, Tabela, brl, pct, Amostra, Aviso } from "@/components/crm/ui";

export default async function Aquisicao({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  await exigirUsuario();
  const dias = Number((await searchParams).dias ?? 90);
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const { de, ate } = funilPeriodo(b, cat, dias);
  const fontes = tabelaPorFonte(b, cat, de, ate);
  const lp = landingPages(b);
  const semGasto = fontes.filter((f) => cat.fontes.find((x) => x.code === f.code)?.custo_rastreado && (f.gasto ?? 0) === 0);
  return (
    <Pagina titulo="Aquisição" sub="Não quero saber apenas de onde vêm mais leads. Quero saber de onde vêm os melhores clientes.">
      <AnalyticsNav atual="/crm/analytics/aquisicao" /><Periodo atual={dias} base="/crm/analytics/aquisicao" />
      {semGasto.length > 0 && <div className="mb-3"><Aviso tom="alerta">Canais pagos sem gasto registrado no período: {semGasto.map((f) => f.nome).join(", ")}. Registre o gasto em Ads para calcular CAC.</Aviso></div>}
      <Card titulo="Canal · Leads · Qualificados · Vendas · Conversão · CAC · Receita · LTV · LTV:CAC">
        <Tabela cabecalho={["Canal", "Leads", "Qualif.", "Experim.", "Vendas", "Conv.", "Gasto", "CPL", "CPQL", "Custo/exp.", "Custo/venda", "CAC mídia", "Receita", "LTV médio", "LTV:CAC obs.", "ROAS"]} linhas={fontes.map((f) => [
          f.nome, f.leads, f.qualificados, f.experimentais, f.vendas, pct(f.conversao),
          f.gasto == null ? <span key="g" className="text-xs text-zinc-500">não calculado</span> : brl(f.gasto),
          f.gasto != null ? brl(custoPorLead(f.gasto, f.leads)) : "—", f.gasto != null ? brl(custoPorLeadQualificado(f.gasto, f.qualificados)) : "—", f.gasto != null ? brl(custoPorExperimental(f.gasto, f.experimentais)) : "—", f.gasto != null ? brl(custoPorVenda(f.gasto, f.vendas)) : "—",
          f.cac.valor != null ? brl(f.cac.valor) : <span key="c" className="text-xs text-zinc-500">{f.cac.motivo}</span>,
          brl(f.receita), f.ltvMedio != null ? <span key="l">{brl(f.ltvMedio)} <Amostra n={f.n} minimo={5} /></span> : "—", f.ltvCac.valor != null ? `${f.ltvCac.valor.toFixed(1)}x` : "—", f.roas != null ? `${f.roas.toFixed(1)}x` : "—",
        ])} vazio="Sem leads no período." />
        <p className="mt-2 text-xs text-zinc-500">CAC de mídia não é CAC total. Orgânico e indicação aparecem como "custo não calculado", não como zero. LTV:CAC usa LTV realizado (observado).</p>
      </Card>
      <Card titulo="Landing pages → cliques no WhatsApp → leads → vendas → receita" className="mt-4">
        <Tabela cabecalho={["Página", "Cliques WhatsApp", "Leads ligados", "Vendas", "Receita"]} linhas={lp.slice(0, 40).map((p) => [<span key="p" className="text-xs">{p.pagina}</span>, p.cliques, p.leads, p.vendas, brl(p.receita)])} vazio="Sem cliques registrados pelo site ainda." />
        <p className="mt-2 text-xs text-zinc-500">Sessões por página vêm do GA4 (histórico agregado em SEO). Leads aqui são só os ligados a um clique pelo código Ref: cobertura parcial por desenho.</p>
      </Card>
    </Pagina>
  );
}
