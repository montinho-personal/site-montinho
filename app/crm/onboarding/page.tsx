import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { painelOnboarding, type LinhaPainel } from "@/lib/crm/onboarding-dados";
import { ROTULO_ESTADO, ROTULO_SITUACAO, type SituacaoOnb } from "@/lib/crm/onboarding-fluxo";
import { Badge, Btn, Pagina, Tabela, dataBr } from "@/components/crm/ui";

/**
 * Onboarding · Dashboard. Os cinco cartões do topo são filtros: tocar num
 * deles mostra só aqueles alunos. Tudo é derivado de status e prazos
 * (lib/crm/onboarding-fluxo.ts), nada é gravado como "atrasado".
 */
const FILTROS: { key: string; rotulo: string; tom: string; casa: (l: LinhaPainel) => boolean }[] = [
  { key: "andamento", rotulo: "Em andamento", tom: "text-white", casa: (l) => l.onb.status === "em_andamento" },
  { key: "atencao", rotulo: "Precisam de atenção", tom: "text-orange-300", casa: (l) => l.situacao === "atencao" },
  { key: "atrasados", rotulo: "Atrasados", tom: "text-rose-300", casa: (l) => l.situacao === "atrasado" },
  { key: "aguardando", rotulo: "Aguardando aluno", tom: "text-amber-300", casa: (l) => l.onb.status === "em_andamento" && l.progresso.aguardando > 0 },
  { key: "concluidos", rotulo: "Concluídos", tom: "text-emerald-300", casa: (l) => l.onb.status === "concluido" },
];
const URGENCIA: SituacaoOnb[] = ["atrasado", "atencao", "aguardando_aluno", "em_dia", "pausado", "concluido", "cancelado"];
const tomSituacao = (s: SituacaoOnb) => (s === "atrasado" ? "ruim" : s === "atencao" || s === "aguardando_aluno" ? "alerta" : s === "concluido" || s === "em_dia" ? "bom" : "neutro") as "ruim" | "alerta" | "bom" | "neutro";

export default async function OnboardingDashboard({ searchParams }: { searchParams: Promise<{ f?: string; todos?: string }> }) {
  await exigirUsuario();
  const sp = await searchParams;
  const { linhas } = await painelOnboarding();
  const filtro = FILTROS.find((f) => f.key === sp.f);
  const abertos = linhas.filter((l) => l.onb.status === "em_andamento" || l.onb.status === "pausado");
  const lista = (filtro ? linhas.filter(filtro.casa) : sp.todos ? linhas : abertos)
    .sort((a, z) => URGENCIA.indexOf(a.situacao) - URGENCIA.indexOf(z.situacao) || a.progresso.pct - z.progresso.pct);
  const naoLidos = linhas.reduce((s, l) => s + l.avisos.filter((a) => !a.lido).length, 0);
  return (
    <Pagina titulo="Onboarding" sub="Do fechamento ao início do acompanhamento. Toque num número para filtrar."
      acoes={<>
        <Btn href="/crm/onboarding/tarefas" tom="secundario" pequeno>Minhas tarefas</Btn>
        <Btn href="/crm/onboarding/avisos" tom="secundario" pequeno>🔔 Avisos{naoLidos ? ` (${naoLidos})` : ""}</Btn>
        <Btn href="/crm/configuracoes/onboarding" tom="ghost" pequeno>Modelos</Btn>
      </>}>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {FILTROS.map((f) => {
          const n = linhas.filter(f.casa).length; const ativo = filtro?.key === f.key;
          return (
            <Link key={f.key} href={ativo ? "/crm/onboarding" : `/crm/onboarding?f=${f.key}`} prefetch={false}
              className={`rounded-xl border p-4 transition-colors ${ativo ? "border-white bg-white/10" : "border-white/10 bg-zinc-900/70 hover:border-white/30"}`}>
              <div className="text-xs uppercase tracking-wider text-zinc-500">{f.rotulo}</div>
              <div className={`mt-1 font-serif text-2xl font-semibold ${f.tom}`}>{n}</div>
            </Link>
          );
        })}
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm text-zinc-400">
        <span>{filtro ? `${filtro.rotulo}: ${lista.length}` : sp.todos ? `Todos: ${lista.length}` : `Abertos: ${lista.length}`}</span>
        <span className="flex gap-3">
          {filtro && <Link href="/crm/onboarding" className="underline">limpar filtro</Link>}
          {!sp.todos && !filtro && <Link href="/crm/onboarding?todos=1" className="underline">ver histórico (concluídos e cancelados)</Link>}
        </span>
      </div>
      <Tabela cabecalho={["Aluno", "Plano", "Progresso", "Etapa atual", "Próxima ação", "Situação"]}
        vazio={filtro ? "Ninguém neste filtro." : "Nenhum onboarding aberto. Ele começa sozinho quando um lead vira cliente, ou pelo botão na ficha do cliente."}
        linhas={lista.map((l) => {
          const fase = l.proxima ? l.onb.fases.find((f) => f.key === l.proxima!.t.fase)?.nome : null;
          const sit = ROTULO_SITUACAO[l.situacao];
          return [
            <div key="n"><Link href={`/crm/onboarding/${l.onb.id}`} prefetch={false} className="font-medium hover:underline">{l.nome}</Link><div className="text-xs text-zinc-500">desde {dataBr(l.onb.iniciado_em)}</div></div>,
            <span key="p" className="text-zinc-300">{l.plano ?? "—"}</span>,
            <div key="g" className="min-w-[120px]">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${l.progresso.pct}%` }} /></div>
              <div className="mt-1 text-xs text-zinc-400">{l.progresso.pct}% · {l.progresso.concluidas}/{l.progresso.aplicaveis}</div>
            </div>,
            <span key="f" className="text-zinc-300">{fase ?? "—"}</span>,
            l.proxima
              ? <div key="a"><span>{ROTULO_ESTADO[l.proxima.estado].icone} {l.proxima.t.nome}</span>{l.proxima.t.due_at && <div className={`text-xs ${l.proxima.atrasada ? "text-rose-300" : "text-zinc-500"}`}>{l.proxima.atrasada ? "atrasada · " : "prazo "}{dataBr(l.proxima.t.due_at)}</div>}</div>
              : <span key="a" className="text-zinc-500">—</span>,
            <Badge key="s" tom={tomSituacao(l.situacao)}>{sit.icone} {sit.rotulo}</Badge>,
          ];
        })} />
    </Pagina>
  );
}
