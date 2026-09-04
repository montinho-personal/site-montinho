import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo, urlWhatsAppContato } from "@/lib/crm/dados";
import { todasVisoes } from "@/lib/crm/visao";
import { Badge, Btn, Pagina, Vazio, brl, relativo } from "@/components/crm/ui";

export default async function Leads({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await exigirUsuario();
  const sp = await searchParams;
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const q = (sp.q ?? "").trim().toLowerCase();
  const status = sp.status ?? "aberto";
  const fonte = sp.fonte ?? ""; const temp = sp.temp ?? "";
  const dig = q.replace(/\D/g, "");
  let visoes = todasVisoes(b, cat);
  if (status !== "todos") visoes = visoes.filter((v) => v.lead.status === status);
  if (fonte) visoes = visoes.filter((v) => v.lead.source_code === fonte);
  if (temp) visoes = visoes.filter((v) => v.temperatura === temp);
  if (q) visoes = visoes.filter((v) => v.contato.nome.toLowerCase().includes(q) || (v.contato.email ?? "").toLowerCase().includes(q) || (dig.length >= 4 && (v.contato.telefone_e164 ?? "").includes(dig)));
  visoes.sort((a, c) => (a.lead.next_action_at ?? "9").localeCompare(c.lead.next_action_at ?? "9"));
  const clientesBusca = q ? b.clientes.filter((c) => { const ct = b.contatos.find((x) => x.id === c.contact_id); return ct && (ct.nome.toLowerCase().includes(q) || (dig.length >= 4 && (ct.telefone_e164 ?? "").includes(dig))); }) : [];

  return (
    <Pagina titulo="Leads" sub={`${visoes.length} ${status === "todos" ? "no total" : status + "s"}`} acoes={<Btn href="/crm/leads/novo">+ Novo lead</Btn>}>
      <form className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-5" method="get">
        <input name="q" defaultValue={sp.q ?? ""} placeholder="Nome, telefone, e-mail" className="col-span-2 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm" />
        <select name="status" defaultValue={status} className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"><option value="aberto">Abertos</option><option value="ganho">Ganhos</option><option value="perdido">Perdidos</option><option value="todos">Todos</option></select>
        <select name="fonte" defaultValue={fonte} className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"><option value="">Toda origem</option>{cat.fontes.map((f) => <option key={f.code} value={f.code}>{f.nome}</option>)}</select>
        <select name="temp" defaultValue={temp} className="rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-sm"><option value="">Toda temperatura</option><option value="quente">Quente</option><option value="morno">Morno</option><option value="frio">Frio</option></select>
        <button className="col-span-2 rounded-lg border border-white/20 px-3 py-2 text-sm sm:col-span-1">Filtrar</button>
      </form>
      {clientesBusca.length > 0 && <p className="mb-3 text-sm text-zinc-400">Clientes com esse nome: {clientesBusca.map((c) => <Link key={c.id} href={`/crm/clientes/${c.id}`} className="underline mr-2">{b.contatos.find((x) => x.id === c.contact_id)?.nome}</Link>)}</p>}
      {visoes.length === 0 ? <Vazio>Nenhum lead com esses filtros.</Vazio> : (
        <ul className="space-y-2">
          {visoes.map((v) => {
            const wa = urlWhatsAppContato(v.contato.telefone_e164);
            const atrasado = v.lead.status === "aberto" && v.lead.next_action_at && new Date(v.lead.next_action_at) < new Date();
            return (
              <li key={v.lead.id} className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/crm/leads/${v.lead.id}`} className="font-medium hover:underline">{v.contato.nome}</Link>
                      <Badge tom={v.temperatura}>{v.temperatura}</Badge>
                      {v.etapa && <Badge>{v.etapa.nome}</Badge>}
                      {v.contato.possivel_duplicata_de && <Badge tom="alerta">possível duplicata</Badge>}
                    </div>
                    <div className="mt-1 text-xs text-zinc-400">{v.servicoNome} · {v.fonteNome}{v.lead.attribution_confidence === "low" ? " (confiança baixa)" : ""} · criado {relativo(v.lead.created_at)}{v.opp?.expected_value ? ` · ${brl(v.opp.expected_value)}/mês` : ""}</div>
                    {v.lead.status === "aberto" && (
                      <div className={`mt-1 text-sm ${atrasado ? "text-rose-300" : v.lead.next_action_at ? "text-zinc-300" : "text-amber-300"}`}>
                        {v.lead.next_action_at ? `Próxima ação: ${v.lead.next_action ?? "—"} · ${relativo(v.lead.next_action_at)}` : "Sem próxima ação definida"}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">{wa && <Btn href={wa} tom="whatsapp" pequeno target="_blank">WhatsApp</Btn>}<Btn href={`/crm/leads/${v.lead.id}`} tom="secundario" pequeno>Abrir</Btn></div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Pagina>
  );
}
