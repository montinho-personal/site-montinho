import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { metricasIndicacao, ltvRealizado } from "@/lib/crm/metricas";
import { Pagina, Stat, Tabela, brl, pct, Amostra } from "@/components/crm/ui";

export default async function Indicacoes() {
  await exigirUsuario();
  const [b] = await Promise.all([base(), catalogo()]);
  const ev = b.receitas.map((r) => ({ clientId: r.client_id, amount: r.amount, tipo: r.tipo, occurredAt: r.occurred_at, status: r.status }));
  const clientes = b.clientes.map((c) => ({ id: c.id, firstPurchaseAt: c.first_purchase_at, sourceCode: c.source_code, status: c.status, cancelledAt: c.cancelled_at, referredBy: b.contatos.find((x) => x.id === c.contact_id)?.referred_by_contact_id ?? null }));
  const leadsInd = b.leads.filter((l) => l.source_code === "referral_client" || l.referred_by_contact_id);
  const m = metricasIndicacao(clientes, leadsInd.length, leadsInd.filter((l) => l.status === "ganho").length, ev);
  const porIndicador = new Map<string, { leads: number; clientes: number; receita: number }>();
  for (const l of leadsInd) if (l.referred_by_contact_id) { const r = porIndicador.get(l.referred_by_contact_id) ?? { leads: 0, clientes: 0, receita: 0 }; r.leads++; if (l.status === "ganho") { r.clientes++; const cl = b.clientes.find((c) => c.contact_id === l.contact_id); if (cl) r.receita += ltvRealizado(ev, cl.id); } porIndicador.set(l.referred_by_contact_id, r); }
  const cliques = b.toques.filter((t) => t.origem_registro === "referral_link").length;
  return (
    <Pagina titulo="Indicações" sub="Quem indica, quanto as indicações valem e como convertem. Sem ranking público: isto é gestão, não gamificação.">
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        <Stat rotulo="Clientes que indicaram" valor={m.clientesQueIndicaram} sub={<>referral rate {pct(m.referralRate)} <Amostra n={b.clientes.length} /></>} />
        <Stat rotulo="Leads indicados" valor={m.leadsIndicados} />
        <Stat rotulo="Vendas por indicação" valor={m.vendasIndicadas} sub={`conversão ${pct(m.referralConversionRate)}`} />
        <Stat rotulo="Receita de indicados" valor={brl(m.receitaIndicados)} />
        <Stat rotulo="LTV médio indicados" valor={brl(m.ltvMedioIndicados)} />
        <Stat rotulo="Cliques em links /r" valor={cliques} sub="registrados como toque" />
      </div>
      <Tabela cabecalho={["Indicador", "Leads", "Clientes", "Receita gerada", "Link"]} linhas={[...porIndicador.entries()].sort((a, z) => z[1].receita - a[1].receita || z[1].leads - a[1].leads).map(([id, r]) => {
        const ct = b.contatos.find((c) => c.id === id); const cl = b.clientes.find((c) => c.contact_id === id);
        return [<Link key="n" href={cl ? `/crm/clientes/${cl.id}` : "#"} className="hover:underline">{ct?.nome ?? "—"}</Link>, r.leads, r.clientes, brl(r.receita), ct?.referral_code ? <code key="c" className="text-xs">/r/{ct.referral_code}</code> : <span key="c" className="text-xs text-zinc-500">sem link</span>];
      })} vazio="Nenhuma indicação registrada ainda. Ao criar um lead, escolha 'Indicado por'." />
    </Pagina>
  );
}
