import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirUsuario } from "@/lib/crm/auth";
import { urlWhatsAppContato } from "@/lib/crm/dados";
import { eventosDoOnboarding, painelOnboarding, versaoVigente } from "@/lib/crm/onboarding-dados";
import { ROTULO_ESTADO, ROTULO_SITUACAO, diffDeVersao, mensagemDaTarefa, variaveisDe, type TarefaVista } from "@/lib/crm/onboarding-fluxo";
import { LINK_APP } from "@/lib/app-convite";
import { Aviso, Badge, Btn, Card, Detalhes, Input, Pagina, Textarea, dataBr, dataHoraBr } from "@/components/crm/ui";
import BotaoWhatsAppTarefa from "@/components/crm/onboarding/BotaoWhatsAppTarefa";
import { aplicarVersaoAtual, definirPrazoTarefa, mudarStatusOnboarding, mudarStatusTarefa, responderCondicao, salvarLembreteTarefa, salvarObservacaoTarefa } from "../actions";

const ROTULO_EVENTO: Record<string, string> = {
  iniciado: "Onboarding iniciado", pausado: "Pausado", retomado: "Retomado", concluido: "Concluído", cancelado: "Cancelado",
  status: "Status", resposta: "Resposta", prazo: "Prazo", observacao: "Observação", whatsapp_aberto: "WhatsApp aberto (não confirma envio)",
  lembrete: "Lembrete alterado", versao_aplicada: "Versão do modelo aplicada", adiado: "Aviso adiado/dispensado",
};
const rotuloStatus = (s: string | null) => (s && s in ROTULO_ESTADO ? ROTULO_ESTADO[s as keyof typeof ROTULO_ESTADO].rotulo : s ?? "—");

function Mudar({ id, para, children, tom = "secundario" }: { id: string; para: string; children: React.ReactNode; tom?: "secundario" | "ghost" | "primario" }) {
  return <form action={mudarStatusTarefa}><input type="hidden" name="task_id" value={id} /><input type="hidden" name="status" value={para} /><Btn pequeno tom={tom}>{children}</Btn></form>;
}

export default async function OnboardingAluno({ params }: { params: Promise<{ id: string }> }) {
  const u = await exigirUsuario();
  const { id } = await params;
  const { linhas, bo } = await painelOnboarding();
  const l = linhas.find((x) => x.onb.id === id); if (!l) notFound();
  const eventos = await eventosDoOnboarding(id);
  const ro = u.role === "readonly"; const admin = u.role === "admin";
  const aberto = l.onb.status === "em_andamento" || l.onb.status === "pausado";
  const vars = variaveisDe({ nome: l.nome, plano: l.plano, linkApp: LINK_APP });
  const versaoAtual = bo.versoes.find((v) => v.id === l.onb.version_id);
  const vigente = versaoVigente(bo, l.onb.template_id);
  const diff = vigente && vigente.id !== l.onb.version_id ? diffDeVersao(vigente.definicao, bo.tarefas.filter((t) => t.onboarding_id === id)) : null;
  const nomeTarefa = (key: string) => l.vistas.find((v) => v.t.key === key)?.t.nome ?? key;
  const sit = ROTULO_SITUACAO[l.situacao];
  const p = l.progresso;

  const tarefa = (v: TarefaVista) => {
    const t = v.t; const e = ROTULO_ESTADO[v.estado];
    const msg = mensagemDaTarefa(t, vars);
    const wa = msg ? urlWhatsAppContato(l.telefone, msg) : null;
    const podeAgir = !ro && aberto && v.estado !== "condicional" && v.estado !== "nao_aplicavel";
    const resolvida = t.status === "concluida" || t.status === "nao_aplicavel";
    return (
      <li key={t.id} id={`t-${t.key}`} className={`rounded-lg border p-3 ${v.atrasada ? "border-rose-500/40 bg-rose-500/5" : "border-white/10 bg-black/20"} ${v.estado === "condicional" || v.estado === "nao_aplicavel" ? "opacity-60" : ""}`}>
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="font-medium"><span aria-hidden>{e.icone}</span> {t.nome}{!t.obrigatoria && <span className="ml-2 text-xs text-zinc-500">(opcional)</span>}</div>
            <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-zinc-400">
              <span>{e.rotulo}</span>
              {v.atrasada && <Badge tom="ruim">🔴 Atrasada</Badge>}
              {t.due_at && !resolvida && <span>prazo {dataBr(t.due_at)}{t.due_origem === "manual" ? " (manual)" : ""}</span>}
              {!t.due_at && !resolvida && t.prazo.tipo === "apos_etapa" && <span>prazo conta depois de “{nomeTarefa(t.prazo.etapa)}”</span>}
              {t.completed_at && <span>feita em {dataHoraBr(t.completed_at)}</span>}
              {t.resposta && <span>resposta: {t.condicao?.opcoes.find((o) => o.valor === t.resposta)?.rotulo ?? t.resposta}</span>}
            </div>
            {v.estado === "bloqueada" && <p className="mt-1 text-xs text-zinc-400">🔒 Esperando: {v.esperando.map(nomeTarefa).join(", ")}</p>}
            {v.estado === "condicional" && t.ativar_se && <p className="mt-1 text-xs text-zinc-400">Só vale se “{nomeTarefa(t.ativar_se.etapa)}” for respondida como “{t.ativar_se.valor}”.</p>}
            {t.descricao && <p className="mt-1 text-sm text-zinc-300">{t.descricao}</p>}
            {t.instrucoes && <p className="mt-1 text-xs text-zinc-500">Como fazer: {t.instrucoes}</p>}
            {t.materiais.length > 0 && <ul className="mt-1 text-xs">{t.materiais.map((m) => <li key={m.url}><a href={m.url} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline">{m.rotulo}</a></li>)}</ul>}
            {t.observacoes && <p className="mt-1 rounded bg-white/5 px-2 py-1 text-xs text-zinc-300">Obs.: {t.observacoes}</p>}
          </div>
        </div>
        {podeAgir && (
          <div className="mt-2 flex flex-wrap gap-2">
            {t.condicao && !resolvida && t.condicao.opcoes.map((o) => (
              <form key={o.valor} action={responderCondicao}><input type="hidden" name="task_id" value={t.id} /><input type="hidden" name="resposta" value={o.valor} /><Btn pequeno tom={t.resposta === o.valor ? "primario" : "secundario"}>{o.rotulo}</Btn></form>
            ))}
            {wa && !resolvida && v.estado !== "bloqueada" && <BotaoWhatsAppTarefa url={wa} taskId={t.id} />}
            {!resolvida && v.estado !== "bloqueada" && t.status !== "em_andamento" && t.status !== "aguardando_aluno" && !t.condicao && <Mudar id={t.id} para="em_andamento">Iniciar</Mudar>}
            {!resolvida && v.estado !== "bloqueada" && t.mensagem && t.status !== "aguardando_aluno" && <Mudar id={t.id} para="aguardando_aluno">Enviei · aguardando aluno</Mudar>}
            {!resolvida && v.estado !== "bloqueada" && !(t.condicao && t.na_se) && <Mudar id={t.id} para="concluida" tom="primario">{t.status === "aguardando_aluno" ? "Aluno respondeu · concluir" : "Concluir"}</Mudar>}
            {!resolvida && t.status !== "pausada" && <Mudar id={t.id} para="pausada" tom="ghost">Pausar</Mudar>}
            {t.status === "pausada" && <Mudar id={t.id} para="pendente" tom="ghost">Retomar</Mudar>}
            {!resolvida && !t.obrigatoria && <Mudar id={t.id} para="nao_aplicavel" tom="ghost">Não se aplica</Mudar>}
            {resolvida && <Mudar id={t.id} para="pendente" tom="ghost">Reabrir</Mudar>}
          </div>
        )}
        {!ro && aberto && t.status === "nao_aplicavel" && !t.ativar_se && <div className="mt-2"><Mudar id={t.id} para="pendente" tom="ghost">Reabrir</Mudar></div>}
        {!ro && aberto && (
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {msg && <Detalhes titulo="Ver mensagem"><p className="whitespace-pre-wrap text-sm text-zinc-200">{msg}</p><p className="mt-2 text-xs text-zinc-500">Edite à vontade antes de enviar no WhatsApp. Abrir a conversa não marca como enviada.</p></Detalhes>}
            <Detalhes titulo="Prazo e observação">
              <form action={definirPrazoTarefa} className="flex gap-2"><input type="hidden" name="task_id" value={t.id} /><Input type="date" name="due_dia" defaultValue={t.due_at ? new Date(t.due_at).toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" }) : ""} /><Btn pequeno tom="secundario">Salvar</Btn></form>
              <p className="mt-1 text-xs text-zinc-500">Data em branco volta para a regra do modelo.</p>
              <form action={salvarObservacaoTarefa} className="mt-2 space-y-2"><input type="hidden" name="task_id" value={t.id} /><Textarea name="observacoes" defaultValue={t.observacoes ?? ""} placeholder="Nota interna. Sem dado de saúde: a anamnese fica no app." /><Btn pequeno tom="secundario">Salvar observação</Btn></form>
            </Detalhes>
            <Detalhes titulo="Lembrete">
              <form action={salvarLembreteTarefa} className="space-y-1 text-sm"><input type="hidden" name="task_id" value={t.id} />
                <label className="flex gap-2"><input type="checkbox" name="avisar" defaultChecked={t.avisar} /> Avisar no sino</label>
                <label className="flex gap-2"><input type="checkbox" name="lembrete_no_dia" defaultChecked={t.lembrete.no_dia} /> No dia do prazo</label>
                <label className="flex gap-2"><input type="checkbox" name="lembrete_dia_antes" defaultChecked={t.lembrete.dia_antes} /> Um dia antes</label>
                <label className="flex gap-2"><input type="checkbox" name="lembrete_atraso" defaultChecked={t.lembrete.atraso} /> Quando atrasar</label>
                <label className="flex items-center gap-2">Repetir atraso a cada <Input name="lembrete_repetir" defaultValue={t.lembrete.repetir_dias ?? ""} className="!w-16 !py-1" /> dias</label>
                <Btn pequeno tom="secundario">Salvar lembrete</Btn>
              </form>
            </Detalhes>
          </div>
        )}
      </li>
    );
  };

  return (
    <Pagina titulo={`Onboarding · ${l.nome}`}
      sub={<><Link href={`/crm/clientes/${l.onb.client_id}`} className="underline">ficha do cliente</Link> · {l.plano ?? "sem plano"} · {l.template ?? "modelo"} v{versaoAtual?.versao ?? "?"} · desde {dataBr(l.onb.iniciado_em)}</>}
      acoes={!ro && <>
        {l.onb.status === "em_andamento" && <form action={mudarStatusOnboarding}><input type="hidden" name="onboarding_id" value={id} /><input type="hidden" name="status" value="pausado" /><Btn pequeno tom="secundario">Pausar</Btn></form>}
        {l.onb.status === "pausado" && <form action={mudarStatusOnboarding}><input type="hidden" name="onboarding_id" value={id} /><input type="hidden" name="status" value="em_andamento" /><Btn pequeno tom="secundario">Retomar</Btn></form>}
        {aberto && p.obrigatoriasAbertas === 0 && <form action={mudarStatusOnboarding}><input type="hidden" name="onboarding_id" value={id} /><input type="hidden" name="status" value="concluido" /><Btn pequeno>Concluir onboarding</Btn></form>}
        {(l.onb.status === "concluido" || l.onb.status === "cancelado") && <form action={mudarStatusOnboarding}><input type="hidden" name="onboarding_id" value={id} /><input type="hidden" name="status" value="em_andamento" /><Btn pequeno tom="secundario">Reabrir</Btn></form>}
      </>}>
      <div className="mb-4 grid gap-3 sm:grid-cols-[2fr_1fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-2"><Badge tom={l.situacao === "atrasado" ? "ruim" : l.situacao === "em_dia" || l.situacao === "concluido" ? "bom" : "alerta"}>{sit.icone} {sit.rotulo}</Badge><span className="text-sm text-zinc-400">{p.pct}% concluído</span></div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${p.pct}%` }} /></div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-zinc-400 sm:grid-cols-6">
            <div><div className="text-lg text-white">{p.concluidas}</div>concluídas</div>
            <div><div className="text-lg text-white">{p.pendentes}</div>pendentes</div>
            <div><div className="text-lg text-rose-300">{p.atrasadas}</div>atrasadas</div>
            <div><div className="text-lg text-amber-300">{p.aguardando}</div>aguardando</div>
            <div><div className="text-lg text-zinc-300">{p.nao_aplicaveis}</div>não aplicáveis</div>
            <div><div className="text-lg text-zinc-300">{p.bloqueadas}</div>bloqueadas</div>
          </div>
          <p className="mt-2 text-xs text-zinc-500">O percentual conta só as etapas que se aplicam a este aluno. Não aplicável não reduz; atrasada continua pendente.</p>
        </Card>
        <Card titulo="Próxima ação">
          {l.proxima ? <a href={`#t-${l.proxima.t.key}`} className="block hover:underline">{ROTULO_ESTADO[l.proxima.estado].icone} {l.proxima.t.nome}{l.proxima.t.due_at && <span className="block text-xs text-zinc-400">prazo {dataBr(l.proxima.t.due_at)}</span>}</a> : <p className="text-sm text-zinc-400">Nada em aberto.</p>}
          {aberto && p.obrigatoriasAbertas > 0 && <p className="mt-2 text-xs text-zinc-500">Faltam {p.obrigatoriasAbertas} obrigatória(s) para concluir.</p>}
        </Card>
      </div>
      {diff && admin && aberto && (
        <div className="mb-4"><Aviso tom="alerta">
          O modelo tem uma versão nova (v{vigente!.versao}). Este aluno continua na v{versaoAtual?.versao} até você aplicar.
          <Detalhes titulo="Ver o impacto antes de aplicar">
            <ul className="space-y-1 text-sm">
              <li>Entram: {diff.adicionar.map((e) => e.nome).join(", ") || "nada"}</li>
              <li>Saem (só pendentes): {diff.remover.map((t) => t.nome).join(", ") || "nada"}</li>
              <li>Mudam: {diff.atualizar.map((a) => `${a.tarefa.nome} (${a.mudancas.join(", ")})`).join("; ") || "nada"}</li>
              <li>Ficam como histórico (já feitas): {diff.preservadas.map((t) => t.nome).join(", ") || "nada"}</li>
            </ul>
            <p className="mt-2 text-xs">Status, respostas, datas e observações das etapas mantidas não mudam.</p>
            <form action={aplicarVersaoAtual} className="mt-2"><input type="hidden" name="onboarding_id" value={id} /><Btn pequeno>Aplicar v{vigente!.versao} a este aluno</Btn></form>
          </Detalhes>
        </Aviso></div>
      )}
      <div className="space-y-4">
        {l.onb.fases.slice().sort((a, z) => a.ordem - z.ordem).map((f) => {
          const vs = l.vistas.filter((v) => v.t.fase === f.key); if (!vs.length) return null;
          const ap = vs.filter((v) => v.aplicavel); const ok = ap.filter((v) => v.estado === "concluida").length;
          return <Card key={f.key} titulo={`${f.ordem}. ${f.nome}`} acao={<span className="text-xs text-zinc-500">{ok}/{ap.length}</span>}><ul className="space-y-2">{vs.map(tarefa)}</ul></Card>;
        })}
        <Card titulo="Histórico">
          {eventos.length ? <ul className="space-y-1 text-sm">{eventos.map((e) => (
            <li key={e.id} className="flex flex-wrap gap-2"><span className="text-xs text-zinc-500">{dataHoraBr(e.created_at)}</span><span>{ROTULO_EVENTO[e.tipo] ?? e.tipo}</span>
              {e.task_id && <span className="text-zinc-400">· {l.vistas.find((v) => v.t.id === e.task_id)?.t.nome ?? "etapa removida"}</span>}
              {e.tipo === "status" && <span className="text-zinc-400">{rotuloStatus(e.de)} → {rotuloStatus(e.para)}</span>}
              {e.tipo === "prazo" && <span className="text-zinc-400">{e.para ? dataBr(e.para) : "sem prazo"}</span>}
              {(e.tipo === "resposta" || e.tipo === "observacao") && e.para && <span className="text-zinc-400">“{e.para}”</span>}
            </li>))}</ul> : <p className="text-sm text-zinc-500">Sem registros.</p>}
        </Card>
      </div>
    </Pagina>
  );
}
