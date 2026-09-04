import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { base, urlWhatsAppContato } from "@/lib/crm/dados";
import { showRate, noShowRate } from "@/lib/crm/metricas";
import { Badge, Btn, Input, Pagina, Stat, Vazio, dataHoraBr, pct } from "@/components/crm/ui";
import { marcarExperimental } from "../actions";

export default async function Agenda() {
  await exigirUsuario();
  const b = await base();
  const agora = new Date();
  const futuras = b.experimentais.filter((t) => t.status === "agendada" && new Date(t.scheduled_at) >= agora);
  const semRegistro = b.experimentais.filter((t) => t.status === "agendada" && new Date(t.scheduled_at) < agora);
  const passadas = b.experimentais.filter((t) => t.status !== "agendada").slice(-30).reverse();
  const total = b.experimentais.filter((t) => t.status !== "cancelada");
  const sr = showRate(total.length, total.filter((t) => t.status === "realizada").length);
  const ns = noShowRate(total.length, total.filter((t) => t.status === "no_show").length);
  const Item = ({ t, acoes }: { t: (typeof b.experimentais)[number]; acoes?: boolean }) => {
    const ct = b.contatos.find((c) => c.id === t.contact_id);
    const wa = urlWhatsAppContato(ct?.telefone_e164 ?? null);
    return (
      <li className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><Link href={t.lead_id ? `/crm/leads/${t.lead_id}` : "#"} className="font-medium hover:underline">{ct?.nome ?? "—"}</Link> <Badge tom={t.status === "realizada" ? "bom" : t.status === "no_show" ? "ruim" : t.status === "cancelada" ? "neutro" : "info"}>{t.status}</Badge><div className="text-sm text-zinc-400">{dataHoraBr(t.scheduled_at)}{t.local ? ` · ${t.local}` : ""}{t.outcome ? ` · ${t.outcome}` : ""}</div></div>
          <div className="flex gap-2">{wa && <Btn href={wa} tom="whatsapp" pequeno target="_blank">WhatsApp</Btn>}</div>
        </div>
        {acoes && <form action={marcarExperimental} className="mt-2 flex flex-wrap items-center gap-2"><input type="hidden" name="trial_id" value={t.id} /><Input name="outcome" placeholder="Como foi?" className="max-w-xs" /><Btn pequeno name="status" value="realizada">Realizada</Btn><Btn pequeno tom="perigo" name="status" value="no_show">No-show</Btn><Btn pequeno tom="ghost" name="status" value="cancelada">Cancelada</Btn></form>}
      </li>
    );
  };
  return (
    <Pagina titulo="Agenda de experimentais" sub="Aulas experimentais agendadas, realizadas e no-shows. Integração com Google Calendar: fase 2.">
      <div className="mb-4 grid grid-cols-3 gap-3"><Stat rotulo="Próximas" valor={futuras.length} /><Stat rotulo="Show rate" valor={pct(sr)} sub={`n=${total.length}`} /><Stat rotulo="No-show" valor={pct(ns)} tom={ns != null && ns > 0.25 ? "ruim" : "neutro"} /></div>
      {semRegistro.length > 0 && <section className="mb-6"><h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-300">Passaram sem registro ({semRegistro.length})</h2><ul className="space-y-2">{semRegistro.map((t) => <Item key={t.id} t={t} acoes />)}</ul></section>}
      <section className="mb-6"><h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">Próximas</h2>{futuras.length === 0 ? <Vazio>Nenhuma experimental agendada. Agende pela ficha do lead.</Vazio> : <ul className="space-y-2">{futuras.map((t) => <Item key={t.id} t={t} acoes />)}</ul>}</section>
      <section><h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-400">Histórico recente</h2>{passadas.length === 0 ? <Vazio>Sem histórico.</Vazio> : <ul className="space-y-2">{passadas.map((t) => <Item key={t.id} t={t} />)}</ul>}</section>
    </Pagina>
  );
}
