import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { eventosReceita, clientesMetricas } from "@/lib/crm/analise";
import { ltvMedio, ltvPorFonte, ltvProjetado, coortes, churnClientes, retencaoClientes, tenureMeses, taxaRenovacao, ltvRealizado, DIA_MS } from "@/lib/crm/metricas";
import AnalyticsNav from "@/components/crm/AnalyticsNav";
import { Aviso, Card, Pagina, Stat, Tabela, brl, pct, Amostra } from "@/components/crm/ui";

export default async function Ltv() {
  await exigirUsuario();
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const ev = eventosReceita(b); const cls = clientesMetricas(b);
  const real = ltvMedio(cls, ev); const proj = ltvProjetado(cls, ev);
  const porFonte = ltvPorFonte(cls, ev);
  const co = coortes(cls, ev);
  const hoje = new Date();
  const ret = [30, 60, 90, 180, 365].map((d) => { const ini = new Date(hoje.getTime() - d * DIA_MS); const ativosInicio = b.clientes.filter((c) => new Date(c.first_purchase_at) <= ini && (!c.cancelled_at || new Date(c.cancelled_at) > ini)); const permanecem = ativosInicio.filter((c) => !c.cancelled_at || new Date(c.cancelled_at) > hoje); return { d, n: ativosInicio.length, retencao: retencaoClientes(ativosInicio.length, permanecem.length), churn: churnClientes(ativosInicio.length, ativosInicio.length - permanecem.length) }; });
  const ten = tenureMeses(cls);
  const elegiveis = b.contratos.filter((c) => c.status !== "ativo"); const renovados = elegiveis.filter((c) => c.status === "renovado");
  const porPlano = cat.planos.map((p) => { const xs = b.clientes.filter((c) => c.current_plan_id === p.id); return { p, n: xs.length, ativos: xs.filter((c) => c.status === "ativo").length, ltv: xs.length ? xs.reduce((s, c) => s + ltvRealizado(ev, c.id), 0) / xs.length : null }; }).filter((x) => x.n);
  const porServico = cat.servicos.map((s) => { const xs = cls.filter((c) => b.clientes.find((k) => k.id === c.id)?.service_id === s.id); return { s, ...ltvMedio(xs, ev) }; });
  const indic = ltvMedio(cls.filter((c) => c.referredBy), ev), naoIndic = ltvMedio(cls.filter((c) => !c.referredBy), ev);
  const nomeF = (c: string) => cat.fontes.find((f) => f.code === c)?.nome ?? c;
  return (
    <Pagina titulo="Lifetime Value & Retenção" sub="LTV realizado é o que entrou. LTV projetado é estimativa, e só aparece quando a base aguenta.">
      <AnalyticsNav atual="/crm/analytics/ltv" />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat rotulo="LTV realizado médio" valor={brl(real.medio)} sub={<>mediana {brl(real.mediana)} · <Amostra n={real.n} /></>} />
        <Stat rotulo="LTV projetado" valor={proj.valor != null ? brl(proj.valor) : "dados imaturos"} tom={proj.valor == null ? "alerta" : "neutro"} sub={proj.motivo} />
        <Stat rotulo="Tempo como cliente" valor={ten.mediana != null ? `${ten.mediana.toFixed(1)} m` : "—"} sub={`média ${ten.media?.toFixed(1) ?? "—"} m`} />
        <Stat rotulo="Taxa de renovação" valor={pct(taxaRenovacao(elegiveis.length, renovados.length))} sub={`${renovados.length}/${elegiveis.length} contratos`} />
        <Stat rotulo="LTV indicados" valor={brl(indic.medio)} sub={<Amostra n={indic.n} minimo={5} />} />
        <Stat rotulo="LTV não indicados" valor={brl(naoIndic.medio)} sub={<Amostra n={naoIndic.n} minimo={5} />} />
      </div>
      {real.n < 15 && <div className="mb-4"><Aviso tom="alerta">Base pequena ({real.n} clientes): compare fontes com cautela e não tire conclusão de LTV final de cliente com 1 mês.</Aviso></div>}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="LTV por origem"><Tabela cabecalho={["Origem", "Clientes", "LTV médio", "Mediana", "Total"]} linhas={porFonte.map((f) => [nomeF(f.fonte), <span key="n">{f.n} <Amostra n={f.n} minimo={5} /></span>, brl(f.medio), brl(f.mediana), brl(f.total)])} vazio="Sem clientes." /></Card>
        <Card titulo="Retenção e churn"><Tabela cabecalho={["Janela", "Ativos no início", "Retenção", "Churn"]} linhas={ret.map((r) => [`${r.d} dias`, r.n, pct(r.retencao), pct(r.churn)])} /></Card>
        <Card titulo="Retenção por plano"><Tabela cabecalho={["Plano", "Clientes", "Ativos", "LTV médio"]} linhas={porPlano.map((x) => [x.p.nome, x.n, x.ativos, brl(x.ltv)])} vazio="—" /></Card>
        <Card titulo="LTV por serviço"><Tabela cabecalho={["Serviço", "Clientes", "LTV médio"]} linhas={porServico.map((x) => [x.s.nome, x.n, brl(x.medio)])} /></Card>
      </div>
      <Card titulo="Coortes por mês de aquisição" className="mt-4">
        <Tabela cabecalho={["Coorte", "Clientes", "Mix de fontes", "30 d", "90 d", "180 d", "365 d", "LTV médio", "M0", "M1", "M2", "M3", "M6", "M12"]} linhas={co.map((c) => [<span key="c">{c.coorte} {c.amostraPequena && <Amostra n={c.clientes} minimo={5} />}</span>, c.clientes, <span key="f" className="text-xs">{Object.entries(c.fontes).map(([k, v]) => `${nomeF(k)} ${v}`).join(", ")}</span>, brl(c.receita.d30), brl(c.receita.d90), brl(c.receita.d180), brl(c.receita.d365), brl(c.ltvMedio), pct(c.retencao.M0), pct(c.retencao.M1), pct(c.retencao.M2), pct(c.retencao.M3), pct(c.retencao.M6), pct(c.retencao.M12)])} vazio="Sem clientes ainda." />
        <p className="mt-2 text-xs text-zinc-500">Retido em Mn = teve receita recebida no n-ésimo mês após a compra. "—" é mês que ainda não chegou.</p>
      </Card>
    </Pagina>
  );
}
