import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo, urlWhatsAppContato } from "@/lib/crm/dados";
import { itensHoje, todasVisoes, contagemFunil, inicioDoMes, mesAnterior } from "@/lib/crm/visao";
import { taxasFunil, valorPipeline, mrrNormalizado, cicloDeVendaDias } from "@/lib/crm/metricas";
import { Badge, Btn, Card, Pagina, Stat, Vazio, brl, num, pct, relativo } from "@/components/crm/ui";
import { concluirTarefa } from "./actions";

export default async function Hoje() {
  const u = await exigirUsuario();
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const agora = new Date();
  const visoes = todasVisoes(b, cat, agora);
  const itens = itensHoje(b, cat, visoes, agora);
  const abertas = b.oportunidades.filter((o) => !o.won_at && !o.lost_at);
  const etapaDe = (id: string) => cat.etapas.find((e) => e.id === id);
  const pipe = valorPipeline(abertas.map((o) => ({ expectedValue: o.expected_value, probability: o.probability, stageProbability: etapaDe(o.stage_id)?.probabilidade_config ?? null })));
  const quentes = visoes.filter((v) => v.lead.status === "aberto" && v.temperatura === "quente").length;
  const fimHoje = new Date(agora); fimHoje.setHours(23, 59, 59, 999);
  const tarefasHoje = b.tarefas.filter((t) => !t.completed_at && new Date(t.due_at) <= fimHoje && new Date(t.due_at) >= new Date(agora.toDateString()));
  const atrasadas = b.tarefas.filter((t) => !t.completed_at && new Date(t.due_at) < new Date(agora.toDateString()));
  const experimentaisHoje = b.experimentais.filter((t) => t.status === "agendada" && new Date(t.scheduled_at).toDateString() === agora.toDateString());
  const propostasAbertas = abertas.filter((o) => o.proposal_sent_at);
  // Como está o mês
  const de = inicioDoMes(agora); const ant = mesAnterior(agora);
  const fMes = contagemFunil(b, cat, de, agora); const fAnt = contagemFunil(b, cat, ant.de, ant.ate);
  const tMes = taxasFunil(fMes);
  const receitaMes = b.receitas.filter((r) => r.status === "collected" && r.occurred_at >= de.toISOString().slice(0, 10)).reduce((s, r) => s + r.amount, 0);
  const receitaAnt = b.receitas.filter((r) => r.status === "collected" && r.occurred_at >= ant.de.toISOString().slice(0, 10) && r.occurred_at <= ant.ate.toISOString().slice(0, 10)).reduce((s, r) => s + r.amount, 0);
  const mrr = mrrNormalizado(b.contratos.map((c) => ({ clientId: c.client_id, valor: c.valor, cicloMeses: c.ciclo_meses, inicio: c.inicio, fim: c.fim, status: c.status })), agora);
  const ciclo = cicloDeVendaDias(b.oportunidades.filter((o) => o.won_at && new Date(o.won_at) >= de).map((o) => ({ createdAt: b.leads.find((l) => l.id === o.lead_id)?.created_at ?? o.created_at, wonAt: o.won_at! })));
  const comp = (a: number, b: number) => (b > 0 ? `${a >= b ? "+" : ""}${Math.round(((a - b) / b) * 100)}% vs mês passado (${num(b)})` : `mês passado: ${num(b)}`);
  const primeiroNome = (u.nome ?? u.email).split(" ")[0].split("@")[0];
  const h = agora.getHours(); const saud = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";

  return (
    <Pagina titulo={`${saud}, ${primeiroNome}.`} sub={`${agora.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}`} acoes={<Btn href="/crm/leads/novo">+ Novo lead</Btn>}>
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">Precisa da sua atenção</h2>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat rotulo="Leads quentes" valor={quentes} tom={quentes ? "alerta" : "neutro"} />
        <Stat rotulo="Follow-ups hoje" valor={tarefasHoje.length} />
        <Stat rotulo="Atrasados" valor={atrasadas.length} tom={atrasadas.length ? "ruim" : "bom"} />
        <Stat rotulo="Experimentais hoje" valor={experimentaisHoje.length} />
        <Stat rotulo="Propostas abertas" valor={propostasAbertas.length} />
        <Stat rotulo="Em negociação" valor={brl(pipe.bruto)} sub={`ponderado ${brl(pipe.ponderado)}`} />
      </div>

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">Precisa da sua ação</h2>
      {itens.length === 0 ? <Vazio>Nada pendente. Nenhum lead aberto está sem próxima ação.</Vazio> : (
        <ul className="mb-8 space-y-2">
          {itens.slice(0, 40).map((i) => {
            const contato = b.contatos.find((c) => c.id === i.contactId);
            const wa = urlWhatsAppContato(contato?.telefone_e164 ?? null);
            const tom = i.prioridade <= 2 ? "ruim" : i.prioridade <= 4 ? "alerta" : "neutro";
            const href = i.leadId ? `/crm/leads/${i.leadId}` : i.clientId ? `/crm/clientes/${i.clientId}` : "#";
            return (
              <li key={`${i.contactId}-${i.grupo}`} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/70 p-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><Badge tom={tom}>{i.prioridade <= 2 ? "PRIORIDADE ALTA" : i.prioridade <= 4 ? "hoje" : "esta semana"}</Badge><Link href={href} className="truncate font-medium hover:underline">{i.nome}</Link>{i.valor ? <span className="text-xs text-zinc-500">{brl(i.valor)}/mês</span> : null}</div>
                  <div className="mt-1 text-sm text-zinc-400">Motivo: {i.motivo}</div>
                </div>
                <div className="flex gap-2">
                  {wa && <Btn href={wa} tom="whatsapp" pequeno target="_blank">WhatsApp</Btn>}
                  {i.taskId ? (
                    <form action={concluirTarefa}><input type="hidden" name="task_id" value={i.taskId} /><Btn tom="secundario" pequeno>Feito</Btn></form>
                  ) : <Btn href={href} tom="secundario" pequeno>{i.acao}</Btn>}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">Como está o mês</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Stat rotulo="Leads" valor={fMes.leads} sub={comp(fMes.leads, fAnt.leads)} />
        <Stat rotulo="Qualificados" valor={fMes.qualificados} sub={comp(fMes.qualificados, fAnt.qualificados)} />
        <Stat rotulo="Experimentais" valor={fMes.experimentaisRealizadas} sub={`${fMes.experimentaisAgendadas} agendadas`} />
        <Stat rotulo="Vendas" valor={fMes.vendas} sub={comp(fMes.vendas, fAnt.vendas)} />
        <Stat rotulo="Receita recebida" valor={brl(receitaMes)} sub={comp(receitaMes, receitaAnt)} />
        <Stat rotulo="MRR normalizado" valor={brl(mrr)} sub={`${b.clientes.filter((c) => c.status === "ativo").length} clientes ativos`} />
        <Stat rotulo="Pipeline" valor={brl(pipe.bruto)} sub={`${abertas.length} oportunidades`} />
        <Stat rotulo="Win rate" valor={pct(tMes.propostaParaVenda)} sub={`${fMes.vendas} de ${fMes.propostas} propostas`} />
        <Stat rotulo="Ciclo de venda" valor={ciclo.mediana != null ? `${Math.round(ciclo.mediana)} d` : "—"} sub={`mediana · n=${ciclo.n}`} />
        <Stat rotulo="Lead → venda" valor={pct(tMes.leadParaVenda)} sub="coorte deste mês, ainda imatura" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Card titulo="O que está funcionando">
          <FontesResumo b={b} cat={cat} />
        </Card>
        <Card titulo="Onde estamos perdendo">
          {tMes.maiorQueda ? <p className="text-sm">Maior queda do mês: <strong>{tMes.maiorQueda.etapa}</strong> ({pct(tMes.maiorQueda.queda)} não avançam).</p> : <p className="text-sm text-zinc-500">Sem dado suficiente neste mês.</p>}
          <MotivosResumo b={b} cat={cat} />
        </Card>
      </div>
    </Pagina>
  );
}

function FontesResumo({ b, cat }: { b: Awaited<ReturnType<typeof base>>; cat: Awaited<ReturnType<typeof catalogo>> }) {
  const por = new Map<string, { leads: number; vendas: number; receita: number }>();
  for (const l of b.leads) { const r = por.get(l.source_code) ?? { leads: 0, vendas: 0, receita: 0 }; r.leads++; if (l.status === "ganho") r.vendas++; por.set(l.source_code, r); }
  for (const c of b.clientes) { const r = por.get(c.source_code) ?? { leads: 0, vendas: 0, receita: 0 }; r.receita += b.receitas.filter((x) => x.client_id === c.id && x.status === "collected").reduce((s, x) => s + x.amount, 0); por.set(c.source_code, r); }
  const linhas = [...por.entries()].sort((a, c) => c[1].receita - a[1].receita || c[1].vendas - a[1].vendas).slice(0, 6);
  if (!linhas.length) return <p className="text-sm text-zinc-500">Ainda sem leads registrados.</p>;
  return <ul className="space-y-1 text-sm">{linhas.map(([k, v]) => <li key={k} className="flex justify-between"><span>{cat.fontes.find((f) => f.code === k)?.nome ?? k}</span><span className="text-zinc-400">{v.leads} leads · {v.vendas} vendas · {brl(v.receita)}</span></li>)}<li><Link href="/crm/analytics/aquisicao" className="text-xs text-zinc-500 underline">ver aquisição completa</Link></li></ul>;
}
function MotivosResumo({ b, cat }: { b: Awaited<ReturnType<typeof base>>; cat: Awaited<ReturnType<typeof catalogo>> }) {
  const perdidas = b.oportunidades.filter((o) => o.lost_at);
  if (!perdidas.length) return null;
  const por = new Map<string, number>(); for (const o of perdidas) por.set(o.loss_reason_code ?? "other", (por.get(o.loss_reason_code ?? "other") ?? 0) + 1);
  return <ul className="mt-2 space-y-1 text-sm">{[...por.entries()].sort((a, c) => c[1] - a[1]).slice(0, 5).map(([k, v]) => <li key={k} className="flex justify-between"><span>{cat.motivos.find((m) => m.code === k)?.nome ?? k}</span><span className="text-zinc-400">{pct(v / perdidas.length)} ({v})</span></li>)}</ul>;
}
