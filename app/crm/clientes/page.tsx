import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo, urlWhatsAppContato } from "@/lib/crm/dados";
import { ltvRealizado, mrrNormalizado, tenureMeses, diasEntre } from "@/lib/crm/metricas";
import { Badge, Btn, Pagina, Stat, Tabela, brl, dataBr } from "@/components/crm/ui";

export default async function Clientes({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await exigirUsuario();
  const sp = await searchParams;
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const status = sp.status ?? "ativo";
  const ev = b.receitas.map((r) => ({ clientId: r.client_id, amount: r.amount, tipo: r.tipo, occurredAt: r.occurred_at, status: r.status }));
  const lista = b.clientes.filter((c) => status === "todos" || c.status === status).map((c) => ({ c, contato: b.contatos.find((x) => x.id === c.contact_id), ltv: ltvRealizado(ev, c.id), plano: cat.planos.find((p) => p.id === c.current_plan_id)?.nome ?? "—" })).sort((a, z) => (a.c.renewal_date ?? "9").localeCompare(z.c.renewal_date ?? "9"));
  const ativos = b.clientes.filter((c) => c.status === "ativo");
  const mrr = mrrNormalizado(b.contratos.map((k) => ({ clientId: k.client_id, valor: k.valor, cicloMeses: k.ciclo_meses, inicio: k.inicio, fim: k.fim, status: k.status })));
  const ten = tenureMeses(b.clientes.map((c) => ({ id: c.id, firstPurchaseAt: c.first_purchase_at, sourceCode: c.source_code, status: c.status, cancelledAt: c.cancelled_at })));
  const em30 = ativos.filter((c) => c.renewal_date && diasEntre(new Date(), c.renewal_date) <= 30).length;
  return (
    <Pagina titulo="Clientes" sub="Só quem já comprou. A venda não termina no ganho: aqui começa o LTV." acoes={<>{["ativo", "pausado", "cancelado", "todos"].map((s) => <Btn key={s} href={`/crm/clientes?status=${s}`} tom={s === status ? "primario" : "secundario"} pequeno>{s}</Btn>)}</>}>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat rotulo="Ativos" valor={ativos.length} />
        <Stat rotulo="MRR normalizado" valor={brl(mrr)} />
        <Stat rotulo="Renovações em 30 dias" valor={em30} tom={em30 ? "alerta" : "neutro"} />
        <Stat rotulo="Tempo como cliente" valor={ten.mediana != null ? `${ten.mediana.toFixed(1)} m` : "—"} sub="mediana, inclui ativos" />
      </div>
      <Tabela cabecalho={["Cliente", "Plano", "Renova em", "Status", "LTV realizado", ""]} linhas={lista.map(({ c, contato, ltv, plano }) => [
        <Link key="n" href={`/crm/clientes/${c.id}`} className="font-medium hover:underline">{contato?.nome ?? "—"}</Link>,
        plano,
        <span key="r" className={c.renewal_date && diasEntre(new Date(), c.renewal_date) <= 7 ? "text-amber-300" : ""}>{dataBr(c.renewal_date)}</span>,
        <Badge key="s" tom={c.status === "ativo" ? "bom" : c.status === "cancelado" ? "ruim" : "alerta"}>{c.status}</Badge>,
        brl(ltv),
        <span key="a" className="flex gap-1">{urlWhatsAppContato(contato?.telefone_e164 ?? null) && <Btn href={urlWhatsAppContato(contato!.telefone_e164)!} tom="whatsapp" pequeno target="_blank">WA</Btn>}</span>,
      ])} vazio="Nenhum cliente neste filtro." />
    </Pagina>
  );
}
