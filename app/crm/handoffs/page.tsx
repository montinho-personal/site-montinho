import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { Badge, Btn, Pagina, Stat, Tabela, dataHoraBr } from "@/components/crm/ui";

export default async function Handoffs({ searchParams }: { searchParams: Promise<{ dias?: string }> }) {
  await exigirUsuario();
  const sp = await searchParams;
  const dias = Number(sp.dias ?? 14);
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const desde = new Date(Date.now() - dias * 86400000);
  const xs = b.handoffs.filter((h) => new Date(h.created_at) >= desde);
  const ligados = xs.filter((h) => h.contact_id).length;
  const porPagina = new Map<string, number>(); for (const h of xs) porPagina.set(h.page_path ?? "?", (porPagina.get(h.page_path ?? "?") ?? 0) + 1);
  const porFonte = new Map<string, number>(); for (const h of xs) porFonte.set(h.source_code ?? "unknown", (porFonte.get(h.source_code ?? "unknown") ?? 0) + 1);
  return (
    <Pagina titulo="Chegaram pelo site" sub={`Cliques no WhatsApp registrados pelo site nos últimos ${dias} dias. Cada um tem um código Ref que aparece na mensagem, se a pessoa não apagar.`} acoes={<>{[7, 14, 30, 90].map((d) => <Btn key={d} href={`/crm/handoffs?dias=${d}`} tom={d === dias ? "primario" : "secundario"} pequeno>{d} d</Btn>)}</>}>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat rotulo="Cliques" valor={xs.length} />
        <Stat rotulo="Ligados a lead" valor={ligados} sub={xs.length ? `${Math.round((ligados / xs.length) * 100)}%` : ""} />
        <Stat rotulo="Com click id de anúncio" valor={xs.filter((h) => h.gclid || h.gbraid || h.wbraid || h.fbclid).length} />
        <Stat rotulo="Consentimento recusado" valor={xs.filter((h) => h.consent === false).length} sub="sem rastreio persistente" />
      </div>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 p-3 text-sm"><div className="mb-1 text-xs uppercase tracking-wider text-zinc-500">Por página</div>{[...porPagina.entries()].sort((a, z) => z[1] - a[1]).slice(0, 8).map(([k, v]) => <div key={k} className="flex justify-between"><span className="truncate">{k}</span><span className="text-zinc-400">{v}</span></div>)}</div>
        <div className="rounded-xl border border-white/10 p-3 text-sm"><div className="mb-1 text-xs uppercase tracking-wider text-zinc-500">Por origem</div>{[...porFonte.entries()].sort((a, z) => z[1] - a[1]).map(([k, v]) => <div key={k} className="flex justify-between"><span>{cat.fontes.find((f) => f.code === k)?.nome ?? k}</span><span className="text-zinc-400">{v}</span></div>)}</div>
      </div>
      <Tabela cabecalho={["Quando", "Ref", "Página", "CTA", "Origem", "Ligado a", ""]} linhas={xs.slice(0, 200).map((h) => [
        dataHoraBr(h.created_at), <code key="r" className="text-xs">{h.ref_code}</code>, <span key="p" className="text-xs">{h.page_path}{h.ferramenta ? ` (${h.ferramenta})` : ""}</span>, <span key="c" className="text-xs text-zinc-400">{h.cta_id ?? "—"}</span>,
        <span key="f" className="text-xs">{cat.fontes.find((f) => f.code === h.source_code)?.nome ?? h.source_code ?? "?"}{h.utm_campaign ? ` · ${h.utm_campaign}` : ""}{h.gclid ? " · gclid" : ""}</span>,
        h.contact_id ? <Badge key="l" tom="bom">{b.contatos.find((c) => c.id === h.contact_id)?.nome ?? "lead"} ({h.link_confidence})</Badge> : <Badge key="l">não ligado</Badge>,
        !h.contact_id ? <Btn key="b" href={`/crm/leads/novo?ref=${h.ref_code}`} pequeno tom="secundario">Criar lead</Btn> : "",
      ])} vazio="Nenhum clique registrado no período. O rastreio começa quando o site é publicado com o tracker." />
    </Pagina>
  );
}
