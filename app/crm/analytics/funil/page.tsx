import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { funilPeriodo } from "@/lib/crm/analise";
import { taxasFunil, cicloDeVendaDias, primeiraResposta, probabilidadeHistorica } from "@/lib/crm/metricas";
import AnalyticsNav, { Periodo } from "@/components/crm/AnalyticsNav";
import { Card, Pagina, Stat, Tabela, pct, Amostra } from "@/components/crm/ui";

export default async function Funil({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  await exigirUsuario();
  const dias = Number((await searchParams).dias ?? 90);
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const { contagem: c, de } = funilPeriodo(b, cat, dias);
  const t = taxasFunil(c);
  const leadsPer = b.leads.filter((l) => new Date(l.created_at) >= de);
  const ciclo = cicloDeVendaDias(b.oportunidades.filter((o) => o.won_at && new Date(o.won_at) >= de).map((o) => ({ createdAt: b.leads.find((l) => l.id === o.lead_id)?.created_at ?? o.created_at, wonAt: o.won_at! })));
  const resp = primeiraResposta(leadsPer.map((l) => ({ createdAt: l.created_at, firstResponseAt: l.first_response_at })));
  // Speed-to-lead vs conversão (descritivo)
  const faixas = [["até 1h", 60], ["1h a 24h", 1440], ["mais de 24h", Infinity]] as const;
  const stl = faixas.map(([nome, lim], i) => { const min = i === 0 ? 0 : faixas[i - 1][1]; const xs = leadsPer.filter((l) => l.first_response_at && (() => { const m = (new Date(l.first_response_at).getTime() - new Date(l.created_at).getTime()) / 60000; return m > min && m <= lim; })()); return { nome, n: xs.length, conv: xs.length ? xs.filter((l) => l.status === "ganho").length / xs.length : null }; });
  const passagens = b.historicoEtapas.map((h) => ({ stageCode: cat.etapas.find((e) => e.id === h.to_stage_id)?.code ?? "?", ganhou: !!b.oportunidades.find((o) => o.id === h.opportunity_id)?.won_at }));
  const probHist = probabilidadeHistorica(passagens, 20);
  const perdidas = b.oportunidades.filter((o) => o.lost_at && new Date(o.lost_at) >= de);
  const motivos = new Map<string, number>(); for (const o of perdidas) motivos.set(o.loss_reason_code ?? "other", (motivos.get(o.loss_reason_code ?? "other") ?? 0) + 1);
  const porServico = cat.servicos.map((s) => ({ s, xs: perdidas.filter((o) => o.service_id === s.id) }));
  const linhas: [string, number, number | null][] = [["Leads", c.leads, null], ["Contatados", c.contatos, t.leadParaContato], ["Qualificados", c.qualificados, t.contatoParaQualificado], ["Experimental agendada", c.experimentaisAgendadas, t.qualificadoParaExperimental], ["Experimental realizada", c.experimentaisRealizadas, t.experimentalAgendadaParaRealizada], ["Proposta", c.propostas, t.experimentalParaProposta], ["Venda", c.vendas, t.propostaParaVenda]];
  return (
    <Pagina titulo="Funil" sub={`Leads criados nos últimos ${dias} dias (coorte por criação).`}>
      <AnalyticsNav atual="/crm/analytics/funil" /><Periodo atual={dias} base="/crm/analytics/funil" />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat rotulo="Lead → Venda" valor={pct(t.leadParaVenda)} sub={<Amostra n={c.leads} />} />
        <Stat rotulo="Show rate" valor={pct(t.experimentalAgendadaParaRealizada)} sub={`${c.experimentaisRealizadas}/${c.experimentaisAgendadas}`} />
        <Stat rotulo="Ciclo de venda (mediana)" valor={ciclo.mediana != null ? `${Math.round(ciclo.mediana)} d` : "—"} sub={`média ${ciclo.media != null ? Math.round(ciclo.media) : "—"} · P75 ${ciclo.p75 != null ? Math.round(ciclo.p75) : "—"} · n=${ciclo.n}`} />
        <Stat rotulo="1ª resposta (mediana)" valor={resp.mediana != null ? `${Math.round(resp.mediana)} min` : "—"} sub={`≤5min ${pct(resp.ate5min)} · ≤1h ${pct(resp.ate1h)} · ≤24h ${pct(resp.ate24h)} · ${resp.semResposta} sem resposta`} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Etapas">
          <Tabela cabecalho={["Etapa", "Pessoas", "Conversão da anterior"]} linhas={linhas.map(([n, v, r]) => [n, v, r == null ? "—" : pct(r)])} />
          {t.maiorQueda && <p className="mt-2 text-sm text-amber-200">Maior queda: {t.maiorQueda.etapa} ({pct(t.maiorQueda.queda)} não avançam).</p>}
        </Card>
        <Card titulo="Speed-to-lead × conversão (descritivo, não causal)">
          <Tabela cabecalho={["Tempo até 1ª resposta", "Leads", "Viraram venda"]} linhas={stl.map((x) => [x.nome, x.n, x.conv == null ? "—" : pct(x.conv)])} />
        </Card>
        <Card titulo="Motivos de perda no período">
          <Tabela cabecalho={["Motivo", "%", "n"]} linhas={[...motivos.entries()].sort((a, z) => z[1] - a[1]).map(([k, v]) => [cat.motivos.find((m) => m.code === k)?.nome ?? k, pct(v / perdidas.length), v])} vazio="Nenhuma perda no período." />
          {porServico.some((x) => x.xs.length) && <div className="mt-3 text-xs text-zinc-400">{porServico.map((x) => x.xs.length ? `${x.s.nome}: ${x.xs.length} perdas` : null).filter(Boolean).join(" · ")}</div>}
        </Card>
        <Card titulo="Probabilidade por etapa">
          <Tabela cabecalho={["Etapa", "Configurada", "Histórica (20+ passagens)"]} linhas={cat.etapas.filter((e) => e.tipo === "open" && e.pipeline_id === cat.pipelines[0]?.id).map((e) => [e.nome, pct(e.probabilidade_config), probHist[e.code] == null ? <span key="h" className="text-xs text-zinc-500">sem amostra</span> : pct(probHist[e.code])])} />
        </Card>
      </div>
    </Pagina>
  );
}
