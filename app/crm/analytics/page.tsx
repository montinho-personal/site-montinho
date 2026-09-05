import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { funilPeriodo, serieMensal, tabelaPorFonte, eventosReceita, clientesMetricas, separarPorReceita } from "@/lib/crm/analise";
import { taxasFunil, mrrNormalizado, ltvMedio, anomalia, valorPipeline } from "@/lib/crm/metricas";
import AnalyticsNav, { Periodo } from "@/components/crm/AnalyticsNav";
import { Card, Pagina, Stat, Tabela, brl, pct, Amostra } from "@/components/crm/ui";

export default async function Analytics({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  await exigirUsuario();
  const dias = Number((await searchParams).dias ?? 90);
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const { contagem, de, ate } = funilPeriodo(b, cat, dias);
  const t = taxasFunil(contagem);
  const serie = serieMensal(b, 6);
  const ultimo = serie[serie.length - 1], anterior = serie[serie.length - 2];
  const fontes = tabelaPorFonte(b, cat, de, ate);
  const ev = eventosReceita(b);
  // Cliente importado sem recibo tem LTV desconhecido, não zero: fora da média.
  const { comReceita: cls, semReceita } = separarPorReceita(clientesMetricas(b), ev);
  const ltv = ltvMedio(cls, ev);
  const mrr = mrrNormalizado(b.contratos.map((c) => ({ clientId: c.client_id, valor: c.valor, cicloMeses: c.ciclo_meses, inicio: c.inicio, fim: c.fim, status: c.status })));
  const abertas = b.oportunidades.filter((o) => !o.won_at && !o.lost_at);
  const pv = valorPipeline(abertas.map((o) => ({ expectedValue: o.expected_value, probability: o.probability, stageProbability: cat.etapas.find((e) => e.id === o.stage_id)?.probabilidade_config ?? null })));
  const insights = [
    anomalia("Leads no mês", ultimo.leads, anterior.leads), anomalia("Vendas no mês", ultimo.vendas, anterior.vendas), anomalia("Receita recebida", Math.round(ultimo.receita), Math.round(anterior.receita), { minimo: 1000, limiar: 0.4 }),
  ];
  const melhorLtv = [...fontes].filter((f) => f.n >= 3).sort((a, z) => (z.ltvMedio ?? 0) - (a.ltvMedio ?? 0))[0];
  const maisLeads = [...fontes].sort((a, z) => z.leads - a.leads)[0];
  return (
    <Pagina titulo="Visão do negócio" sub="Tráfego é o começo. LTV é o final da história.">
      <AnalyticsNav atual="/crm/analytics" /><Periodo atual={dias} base="/crm/analytics" />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat rotulo="Leads" valor={contagem.leads} sub={`${dias} dias`} />
        <Stat rotulo="Vendas" valor={contagem.vendas} sub={`lead → venda ${pct(t.leadParaVenda)}`} />
        <Stat rotulo="Win rate" valor={pct(t.propostaParaVenda)} sub={`${contagem.propostas} propostas`} />
        <Stat rotulo="MRR normalizado" valor={brl(mrr)} />
        <Stat rotulo="LTV médio realizado" valor={brl(ltv.medio)} sub={<>{<Amostra n={ltv.n} />}{semReceita.length > 0 && <span className="block text-xs text-zinc-500">{semReceita.length} sem receita registrada, fora da média</span>}</>} />
        <Stat rotulo="Pipeline ponderado" valor={brl(pv.ponderado)} sub={`bruto ${brl(pv.bruto)}`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Insights determinísticos">
          <ul className="space-y-1 text-sm">
            {insights.map((i) => <li key={i.texto} className={i.alerta ? "text-amber-200" : "text-zinc-300"}>{i.alerta ? "⚠ " : ""}{i.texto}</li>)}
            {maisLeads && melhorLtv && maisLeads.code !== melhorLtv.code && <li className="text-zinc-300">{maisLeads.nome} trouxe mais leads ({maisLeads.leads}), mas {melhorLtv.nome} tem o maior LTV médio ({brl(melhorLtv.ltvMedio)}, n={melhorLtv.n}).</li>}
            {t.maiorQueda && <li className="text-zinc-300">Maior queda do funil: {t.maiorQueda.etapa} ({pct(t.maiorQueda.queda)}).</li>}
          </ul>
          <p className="mt-2 text-xs text-zinc-500">A métrica não prova causa. Isto descreve; a explicação é sua.</p>
        </Card>
        <Card titulo="Últimos 6 meses">
          <Tabela cabecalho={["Mês", "Leads", "Vendas", "Novos clientes", "Cancelados", "Receita recebida"]} linhas={serie.map((m) => [m.mes, m.leads, m.vendas, m.novosClientes, m.cancelados, brl(m.receita)])} />
        </Card>
      </div>
      <Card titulo="O que está funcionando (por origem, no período)" className="mt-4">
        <Tabela cabecalho={["Canal", "Leads", "Qualif.", "Vendas", "Conversão", "CAC mídia", "Receita", "LTV médio", "LTV:CAC"]} linhas={fontes.map((f) => [f.nome, f.leads, f.qualificados, f.vendas, pct(f.conversao), f.cac.valor != null ? brl(f.cac.valor) : <span key="c" className="text-xs text-zinc-500">{f.cac.motivo}</span>, brl(f.receita), f.ltvMedio != null ? <span key="l">{brl(f.ltvMedio)} <Amostra n={f.n} minimo={5} /></span> : "—", f.ltvCac.valor != null ? `${f.ltvCac.valor.toFixed(1)}x` : "—"])} vazio="Sem leads no período." />
      </Card>
    </Pagina>
  );
}
