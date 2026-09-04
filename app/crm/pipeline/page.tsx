import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { todasVisoes } from "@/lib/crm/visao";
import { valorPipeline } from "@/lib/crm/metricas";
import Kanban from "@/components/crm/Kanban";
import { Btn, Pagina, Stat, brl } from "@/components/crm/ui";

export default async function PipelinePage({ searchParams }: { searchParams: Promise<{ pipeline?: string }> }) {
  await exigirUsuario();
  const sp = await searchParams;
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const pipe = cat.pipelines.find((p) => p.code === (sp.pipeline ?? "presencial")) ?? cat.pipelines[0];
  const colunas = cat.etapas.filter((e) => e.pipeline_id === pipe.id && e.tipo === "open").map((e) => ({ code: e.code, nome: e.nome }));
  const visoes = todasVisoes(b, cat).filter((v) => v.lead.status === "aberto" && v.opp && v.opp.pipeline_id === pipe.id && v.etapa?.tipo === "open");
  const agora = new Date();
  const cartoes = visoes.map((v) => ({ oppId: v.opp!.id, leadId: v.lead.id, nome: v.contato.nome, stageCode: v.etapa!.code, valor: v.opp!.expected_value, temperatura: v.temperatura, proximaAcao: v.lead.next_action, proximaAcaoEm: v.lead.next_action_at, atrasado: !!v.lead.next_action_at && new Date(v.lead.next_action_at) < agora, servico: v.servicoNome }));
  const pv = valorPipeline(visoes.map((v) => ({ expectedValue: v.opp!.expected_value, probability: v.opp!.probability, stageProbability: v.etapa!.probabilidade_config })));
  const ganhos = b.oportunidades.filter((o) => o.pipeline_id === pipe.id && o.won_at).length; const perdidos = b.oportunidades.filter((o) => o.pipeline_id === pipe.id && o.lost_at).length;
  return (
    <Pagina titulo="Pipeline" sub={pipe.nome} acoes={<>{cat.pipelines.map((p) => <Btn key={p.id} href={`/crm/pipeline?pipeline=${p.code}`} tom={p.id === pipe.id ? "primario" : "secundario"} pequeno>{p.nome}</Btn>)}</>}>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat rotulo="Abertas" valor={visoes.length} />
        <Stat rotulo="Pipeline bruto" valor={brl(pv.bruto)} sub={pv.semValor ? `${pv.semValor} sem valor` : undefined} />
        <Stat rotulo="Ponderado" valor={brl(pv.ponderado)} sub="probabilidade configurada por etapa" />
        <Stat rotulo="Ganhos / perdidos" valor={`${ganhos} / ${perdidos}`} sub="histórico deste pipeline" />
      </div>
      <Kanban colunas={colunas} cartoes={cartoes} />
      <p className="mt-2 text-xs text-zinc-500">Arraste o cartão ou use o seletor. Toda mudança fica no histórico de etapas. Ganho e perdido só pela ficha do lead.</p>
    </Pagina>
  );
}
