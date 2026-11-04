import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { urlWhatsAppContato } from "@/lib/crm/dados";
import { painelOnboarding, type LinhaPainel } from "@/lib/crm/onboarding-dados";
import { ROTULO_ESTADO, diaLocal, mensagemDaTarefa, variaveisDe, type TarefaVista } from "@/lib/crm/onboarding-fluxo";
import { LINK_APP } from "@/lib/app-convite";
import { Btn, Card, Pagina, Select, Vazio, dataBr, dataHoraBr } from "@/components/crm/ui";
import BotaoWhatsAppTarefa from "@/components/crm/onboarding/BotaoWhatsAppTarefa";
import { mudarStatusTarefa } from "../actions";

/**
 * Minhas tarefas: tudo o que o onboarding pede de você, de todos os alunos,
 * agrupado pelo que é mais urgente. Bloqueadas e condicionais não aparecem:
 * não há o que fazer nelas ainda.
 */
type Item = { l: LinhaPainel; v: TarefaVista };
const GRUPOS = ["atrasadas", "hoje", "proximas", "aguardando", "sem_prazo", "concluidas"] as const;
const TITULO: Record<(typeof GRUPOS)[number], string> = { atrasadas: "🔴 Atrasadas", hoje: "Para hoje", proximas: "Próximas", aguardando: "🟡 Aguardando aluno", sem_prazo: "Sem prazo", concluidas: "✅ Concluídas (últimos 7 dias)" };

export default async function MinhasTarefas({ searchParams }: { searchParams: Promise<{ aluno?: string; tipo?: string }> }) {
  const u = await exigirUsuario();
  const sp = await searchParams;
  const agora = new Date(); const hoje = diaLocal(agora);
  const { linhas } = await painelOnboarding(agora);
  const ativos = linhas.filter((l) => l.onb.status === "em_andamento");
  const itens: Item[] = ativos.filter((l) => !sp.aluno || l.onb.id === sp.aluno)
    .flatMap((l) => l.vistas.map((v) => ({ l, v })))
    .filter(({ v }) => v.aplicavel && v.estado !== "bloqueada" && v.estado !== "pausada" && (!sp.tipo || v.t.acao === sp.tipo));
  const grupo = ({ v }: Item): (typeof GRUPOS)[number] | null => {
    if (v.estado === "concluida") return v.t.completed_at && agora.getTime() - new Date(v.t.completed_at).getTime() <= 7 * 86_400_000 ? "concluidas" : null;
    if (v.atrasada) return "atrasadas";
    if (v.estado === "aguardando_aluno") return "aguardando";
    if (!v.t.due_at) return "sem_prazo";
    return diaLocal(new Date(v.t.due_at)) === hoje ? "hoje" : "proximas";
  };
  const por = new Map(GRUPOS.map((g) => [g, [] as Item[]]));
  for (const i of itens) { const g = grupo(i); if (g) por.get(g)!.push(i); }
  for (const [g, xs] of por) xs.sort((a, z) => g === "concluidas" ? (z.v.t.completed_at ?? "").localeCompare(a.v.t.completed_at ?? "") : (a.v.t.due_at ?? "9").localeCompare(z.v.t.due_at ?? "9"));
  const ro = u.role === "readonly";
  const item = ({ l, v }: Item) => {
    const t = v.t; const msg = mensagemDaTarefa(t, variaveisDe({ nome: l.nome, plano: l.plano, linkApp: LINK_APP, agora }));
    const wa = msg ? urlWhatsAppContato(l.telefone, msg) : null;
    const aberta = v.estado !== "concluida";
    return (
      <li key={t.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
        <div className="min-w-0 flex-1 basis-full sm:basis-0">
          <div className="font-medium"><span aria-hidden>{ROTULO_ESTADO[v.estado].icone}</span> {t.nome}</div>
          <div className="text-sm text-zinc-400"><Link href={`/crm/onboarding/${l.onb.id}#t-${t.key}`} prefetch={false} className="hover:underline">{l.nome}</Link>
            {t.due_at && aberta && <> · prazo {dataBr(t.due_at)}</>}{t.completed_at && !aberta && <> · {dataHoraBr(t.completed_at)}</>}</div>
        </div>
        {!ro && aberta && (
          <div className="flex flex-wrap gap-2">
            {wa && <BotaoWhatsAppTarefa url={wa} taskId={t.id} rotulo="WhatsApp" />}
            {t.condicao ? <Btn href={`/crm/onboarding/${l.onb.id}#t-${t.key}`} pequeno tom="secundario">Responder</Btn>
              : <form action={mudarStatusTarefa}><input type="hidden" name="task_id" value={t.id} /><input type="hidden" name="status" value="concluida" /><Btn pequeno tom="secundario">{t.status === "aguardando_aluno" ? "Respondeu" : "Feito"}</Btn></form>}
          </div>
        )}
      </li>
    );
  };
  const total = GRUPOS.filter((g) => g !== "concluidas").reduce((s, g) => s + por.get(g)!.length, 0);
  return (
    <Pagina titulo="Minhas tarefas" sub={`${total} em aberto no onboarding. Abrir o WhatsApp não conclui a tarefa: confirme com “Feito”.`}
      acoes={<Btn href="/crm/onboarding" tom="secundario" pequeno>Dashboard</Btn>}>
      <form method="get" className="mb-4 flex flex-wrap gap-2">
        <Select name="aluno" defaultValue={sp.aluno ?? ""} className="!w-auto"><option value="">Todos os alunos</option>{ativos.map((l) => <option key={l.onb.id} value={l.onb.id}>{l.nome}</option>)}</Select>
        <Select name="tipo" defaultValue={sp.tipo ?? ""} className="!w-auto"><option value="">Todo tipo</option><option value="whatsapp">Mensagem</option><option value="cliente">Com o aluno</option><option value="dados">Análise</option></Select>
        <Btn pequeno tom="secundario">Filtrar</Btn>
      </form>
      {total === 0 && !por.get("concluidas")!.length ? <Vazio>Nada pendente no onboarding.</Vazio> : (
        <div className="space-y-4">
          {GRUPOS.map((g) => por.get(g)!.length ? <Card key={g} titulo={`${TITULO[g]} · ${por.get(g)!.length}`}><ul className="space-y-2">{por.get(g)!.map(item)}</ul></Card> : null)}
        </div>
      )}
    </Pagina>
  );
}
