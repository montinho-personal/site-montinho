import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { base, urlWhatsAppContato } from "@/lib/crm/dados";
import { slaFollowUp } from "@/lib/crm/metricas";
import { Badge, Btn, Pagina, Stat, Vazio, pct, relativo } from "@/components/crm/ui";
import { concluirTarefa } from "../actions";

export default async function FollowUps() {
  await exigirUsuario();
  const b = await base();
  const agora = new Date();
  const abertas = b.tarefas.filter((t) => !t.completed_at);
  const grupos = [
    { t: "Atrasadas", xs: abertas.filter((t) => new Date(t.due_at) < new Date(agora.toDateString())), tom: "ruim" as const },
    { t: "Hoje", xs: abertas.filter((t) => new Date(t.due_at).toDateString() === agora.toDateString()), tom: "alerta" as const },
    { t: "Próximas", xs: abertas.filter((t) => new Date(t.due_at) > agora && new Date(t.due_at).toDateString() !== agora.toDateString()), tom: "neutro" as const },
  ];
  const sla = slaFollowUp(b.tarefas.map((t) => ({ dueAt: t.due_at, completedAt: t.completed_at })), agora);
  return (
    <Pagina titulo="Follow-ups" sub="Tarefas geradas por você e pelas automações (proposta, experimental, no-show, renovação).">
      <div className="mb-4 grid grid-cols-3 gap-3">
        <Stat rotulo="Atrasadas" valor={grupos[0].xs.length} tom={grupos[0].xs.length ? "ruim" : "bom"} />
        <Stat rotulo="Hoje" valor={grupos[1].xs.length} />
        <Stat rotulo="SLA de follow-up" valor={pct(sla)} sub="concluídas no prazo" />
      </div>
      {grupos.map((g) => (
        <section key={g.t} className="mb-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">{g.t} ({g.xs.length})</h2>
          {g.xs.length === 0 ? <Vazio>Nada aqui.</Vazio> : (
            <ul className="space-y-2">{g.xs.map((t) => {
              const ct = b.contatos.find((c) => c.id === t.contact_id);
              const href = t.lead_id ? `/crm/leads/${t.lead_id}` : t.client_id ? `/crm/clientes/${t.client_id}` : "#";
              const wa = urlWhatsAppContato(ct?.telefone_e164 ?? null);
              return (
                <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 bg-zinc-900/70 p-3">
                  <div><Link href={href} className="font-medium hover:underline">{ct?.nome ?? "—"}</Link> <Badge tom={t.priority === "alta" ? "ruim" : t.priority === "baixa" ? "neutro" : "alerta"}>{t.priority}</Badge><div className="text-sm text-zinc-400">{t.titulo} · {relativo(t.due_at)} · {t.origem === "automacao" ? "automático" : "manual"}</div></div>
                  <div className="flex gap-2">{wa && <Btn href={wa} tom="whatsapp" pequeno target="_blank">WhatsApp</Btn>}<form action={concluirTarefa}><input type="hidden" name="task_id" value={t.id} /><Btn pequeno tom="secundario">Feito</Btn></form></div>
                </li>
              );
            })}</ul>
          )}
        </section>
      ))}
    </Pagina>
  );
}
