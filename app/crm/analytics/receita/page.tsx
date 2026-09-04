import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { serieMensal, eventosReceita, clientesMetricas } from "@/lib/crm/analise";
import { mrrNormalizado, movimentoMrr, receitaPorStatus, arpuMensal, churnReceita } from "@/lib/crm/metricas";
import AnalyticsNav from "@/components/crm/AnalyticsNav";
import { Card, Pagina, Stat, Tabela, brl, pct } from "@/components/crm/ui";

export default async function Receita() {
  await exigirUsuario();
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const contratos = b.contratos.map((c) => ({ clientId: c.client_id, valor: c.valor, cicloMeses: c.ciclo_meses, inicio: c.inicio, fim: c.fim, status: c.status, planId: c.plan_id }));
  const hoje = new Date(); const mesPassado = new Date(hoje.getFullYear(), hoje.getMonth() - 1, hoje.getDate());
  const mrr = mrrNormalizado(contratos, hoje); const mov = movimentoMrr(contratos, mesPassado, hoje);
  const st = receitaPorStatus(eventosReceita(b));
  const arpu = arpuMensal(clientesMetricas(b), eventosReceita(b), hoje);
  const serie = serieMensal(b, 12);
  const porPlano = cat.planos.map((p) => ({ p, mrr: mrrNormalizado(contratos.filter((c) => c.planId === p.id), hoje), n: contratos.filter((c) => c.planId === p.id && c.status === "ativo").length })).filter((x) => x.n);
  const porServico = cat.servicos.map((s) => ({ s, receita: b.receitas.filter((r) => r.status === "collected" && r.service_id === s.id).reduce((a, r) => a + r.amount, 0), vendas: b.oportunidades.filter((o) => o.won_at && o.service_id === s.id).length }));
  const forecast = [30, 60, 90].map((d) => ({ d, valor: mrr * (d / 30) }));
  return (
    <Pagina titulo="Receita" sub="Venda não é dinheiro recebido. Três estados: esperado, contratado, recebido.">
      <AnalyticsNav atual="/crm/analytics/receita" />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat rotulo="MRR normalizado" valor={brl(mrr)} sub="contratos ativos ÷ ciclo" />
        <Stat rotulo="Novo MRR (30 d)" valor={brl(mov.novo)} tom="bom" />
        <Stat rotulo="Expansão / contração" valor={`${brl(mov.expansao)} / ${brl(mov.contracao)}`} />
        <Stat rotulo="MRR perdido (30 d)" valor={brl(mov.perdido)} tom={mov.perdido ? "ruim" : "neutro"} sub={`churn de receita ${pct(churnReceita(mov.inicio, mov.perdido))}`} />
        <Stat rotulo="ARPU (30 d)" valor={brl(arpu)} />
        <Stat rotulo="Recebido / contratado / esperado" valor={brl(st.collected)} sub={`${brl(st.contracted)} contratado · ${brl(st.expected)} esperado`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Receita recebida por mês"><Tabela cabecalho={["Mês", "Recebido", "Vendas", "Novos", "Cancelados"]} linhas={serie.map((m) => [m.mes, brl(m.receita), m.vendas, m.novosClientes, m.cancelados])} /></Card>
        <Card titulo="MRR por plano"><Tabela cabecalho={["Plano", "Contratos ativos", "MRR normalizado"]} linhas={porPlano.map((x) => [x.p.nome, x.n, brl(x.mrr)])} vazio="Nenhum contrato ativo." /></Card>
        <Card titulo="Por serviço"><Tabela cabecalho={["Serviço", "Vendas", "Receita recebida"]} linhas={porServico.map((x) => [x.s.nome, x.vendas, brl(x.receita)])} /></Card>
        <Card titulo="Previsão (estimativa, não promessa)">
          <Tabela cabecalho={["Horizonte", "Receita recorrente esperada"]} linhas={forecast.map((f) => [`${f.d} dias`, brl(f.valor)])} />
          <p className="mt-2 text-xs text-zinc-500">Projeta o MRR atual sem churn nem vendas novas. Confiança baixa enquanto o histórico for curto.</p>
        </Card>
      </div>
    </Pagina>
  );
}
