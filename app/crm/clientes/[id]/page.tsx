import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo, urlWhatsAppContato } from "@/lib/crm/dados";
import { ltvRealizado, mrrDoContrato, diasEntre } from "@/lib/crm/metricas";
import { Badge, Btn, Campo, Card, Detalhes, Input, Pagina, Select, Stat, Tabela, Textarea, brl, dataBr, dataHoraBr, dataInput } from "@/components/crm/ui";
import { cancelarCliente, criarTarefa, gerarCodigoIndicacao, marcarRecebido, registrarAtividade, registrarReceita, renovarContrato } from "../../actions";

export default async function ClientePage({ params }: { params: Promise<{ id: string }> }) {
  const u = await exigirUsuario();
  const { id } = await params;
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const c = b.clientes.find((x) => x.id === id); if (!c) notFound();
  const contato = b.contatos.find((x) => x.id === c.contact_id); if (!contato) notFound();
  const contratos = b.contratos.filter((k) => k.client_id === c.id).sort((a, z) => z.inicio.localeCompare(a.inicio));
  const receitas = b.receitas.filter((r) => r.client_id === c.id).sort((a, z) => z.occurred_at.localeCompare(a.occurred_at));
  const ev = receitas.map((r) => ({ clientId: r.client_id, amount: r.amount, tipo: r.tipo, occurredAt: r.occurred_at, status: r.status }));
  const ltv = ltvRealizado(ev, c.id);
  const contratoAtivo = contratos.find((k) => k.status === "ativo");
  const atividades = b.atividades.filter((a) => a.client_id === c.id || a.contact_id === c.contact_id);
  const leads = b.leads.filter((l) => l.contact_id === c.contact_id);
  const indicados = b.contatos.filter((x) => x.referred_by_contact_id === c.contact_id);
  const wa = urlWhatsAppContato(contato.telefone_e164);
  const plano = cat.planos.find((p) => p.id === c.current_plan_id);
  const meses = diasEntre(c.first_purchase_at, c.cancelled_at ?? new Date().toISOString()) / 30.44;
  const ro = u.role === "readonly";
  const refUrl = contato.referral_code ? `https://www.montinhopersonal.com.br/r/${contato.referral_code}` : null;
  return (
    <Pagina titulo={contato.nome} sub={<span><Badge tom={c.status === "ativo" ? "bom" : "ruim"}>{c.status}</Badge> · cliente desde {dataBr(c.first_purchase_at)} · origem {cat.fontes.find((f) => f.code === c.source_code)?.nome ?? c.source_code}</span>}
      acoes={<>{wa && <Btn href={wa} tom="whatsapp" target="_blank">WhatsApp</Btn>}{leads[0] && <Btn href={`/crm/leads/${leads[0].id}`} tom="secundario">Ver lead</Btn>}</>}>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat rotulo="LTV realizado" valor={brl(ltv)} sub="líquido de reembolsos" />
        <Stat rotulo="MRR deste cliente" valor={contratoAtivo ? brl(mrrDoContrato(contratoAtivo.valor, contratoAtivo.ciclo_meses)) : "—"} sub={plano?.nome} />
        <Stat rotulo="Tempo como cliente" valor={`${meses.toFixed(1)} m`} />
        <Stat rotulo="Renovação" valor={dataBr(c.renewal_date)} tom={c.renewal_date && diasEntre(new Date(), c.renewal_date) <= 14 ? "alerta" : "neutro"} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Card titulo="Receita">
            <Tabela cabecalho={["Data", "Tipo", "Valor", "Status", ""]} linhas={receitas.map((r) => [dataBr(r.occurred_at), r.tipo, brl(r.amount), <Badge key="s" tom={r.status === "collected" ? "bom" : r.status === "contracted" ? "alerta" : "neutro"}>{r.status === "collected" ? "recebido" : r.status === "contracted" ? "contratado" : "esperado"}</Badge>, r.status !== "collected" && !ro ? <form key="f" action={marcarRecebido}><input type="hidden" name="revenue_id" value={r.id} /><Btn pequeno tom="ghost">Recebi</Btn></form> : ""])} vazio="Nenhum evento de receita." />
            {!ro && (
              <Detalhes titulo="Registrar receita">
                <form action={registrarReceita} className="grid gap-2 sm:grid-cols-3">
                  <input type="hidden" name="client_id" value={c.id} /><input type="hidden" name="contract_id" value={contratoAtivo?.id ?? ""} />
                  <Select name="tipo" defaultValue="monthly_payment"><option value="monthly_payment">Mensalidade</option><option value="renewal">Renovação</option><option value="upgrade">Upgrade</option><option value="downgrade">Downgrade</option><option value="refund">Reembolso</option><option value="adjustment">Ajuste</option></Select>
                  <Input name="amount" inputMode="decimal" placeholder="Valor (R$)" required />
                  <Input name="occurred_at" type="date" defaultValue={dataInput()} />
                  <Select name="status" defaultValue="collected"><option value="collected">Recebido</option><option value="contracted">Contratado</option><option value="expected">Esperado</option></Select>
                  <Select name="payment_method" defaultValue="pix"><option value="pix">Pix</option><option value="cartao">Cartão</option><option value="mercado_pago">Mercado Pago</option><option value="dinheiro">Dinheiro</option></Select>
                  <Input name="external_ref" placeholder="Id externo (MP, Pix)" />
                  <Btn pequeno className="sm:col-span-3">Registrar</Btn>
                </form>
              </Detalhes>
            )}
          </Card>
          <Card titulo="Contratos">
            <Tabela cabecalho={["Início", "Plano", "Valor", "Ciclo", "Renova", "Status"]} linhas={contratos.map((k) => [dataBr(k.inicio), cat.planos.find((p) => p.id === k.plan_id)?.nome ?? "—", brl(k.valor), `${k.ciclo_meses} m`, dataBr(k.renovacao_prevista), <Badge key="s" tom={k.status === "ativo" ? "bom" : "neutro"}>{k.status}</Badge>])} />
            {!ro && (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <Detalhes titulo="Renovar / mudar plano">
                  <form action={renovarContrato} className="space-y-2">
                    <input type="hidden" name="client_id" value={c.id} />
                    <Select name="plan_id" defaultValue={c.current_plan_id ?? ""} required><option value="">Plano *</option>{cat.planos.filter((p) => p.ativo).map((p) => <option key={p.id} value={p.id}>{p.nome} · {brl(p.preco)}</option>)}</Select>
                    <div className="grid grid-cols-3 gap-2"><Input name="valor" inputMode="decimal" placeholder="Valor do ciclo *" required defaultValue={contratoAtivo?.valor ?? ""} /><Input name="ciclo_meses" inputMode="numeric" defaultValue={contratoAtivo?.ciclo_meses ?? 1} /><Input name="inicio" type="date" defaultValue={c.renewal_date ?? dataInput()} /></div>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="recebido" defaultChecked /> Pagamento recebido</label>
                    <Btn pequeno>Renovar</Btn>
                  </form>
                </Detalhes>
                <Detalhes titulo="Pausar / cancelar">
                  <form action={cancelarCliente} className="space-y-2">
                    <input type="hidden" name="client_id" value={c.id} />
                    <Select name="status" defaultValue="cancelado"><option value="cancelado">Cancelar</option><option value="pausado">Pausar</option></Select>
                    <Input name="cancelled_at" type="date" defaultValue={dataInput()} />
                    <Input name="cancel_reason" placeholder="Motivo (comercial, sem dado de saúde)" required />
                    <Btn pequeno tom="perigo">Confirmar</Btn>
                  </form>
                </Detalhes>
              </div>
            )}
          </Card>
          <Card titulo="Linha do tempo">
            {atividades.length === 0 ? <p className="text-sm text-zinc-500">Sem registros.</p> : <ol className="space-y-2">{atividades.map((a) => <li key={a.id} className="flex gap-3 text-sm"><span className="w-28 shrink-0 text-xs text-zinc-500">{dataHoraBr(a.ocorreu_em)}</span><span><Badge>{a.tipo}</Badge> {a.descricao}</span></li>)}</ol>}
            {!ro && <form action={registrarAtividade} className="mt-3 flex gap-2"><input type="hidden" name="client_id" value={c.id} /><input type="hidden" name="contact_id" value={contato.id} /><input type="hidden" name="tipo" value="note" /><Input name="descricao" placeholder="Nota comercial" required /><Btn pequeno tom="secundario">Anotar</Btn></form>}
          </Card>
        </div>
        <div className="space-y-4">
          <Card titulo="Contato">
            <ul className="space-y-1 text-sm"><li>{contato.telefone ?? "—"}</li><li>{contato.email ?? "—"}</li><li>{contato.instagram ?? ""}</li><li className="text-zinc-500">{contato.cidade ?? ""}</li></ul>
            <p className="mt-2 text-xs text-zinc-500">Editar dados: pela ficha do lead.</p>
          </Card>
          <Card titulo="Indicações">
            {refUrl ? <p className="break-all text-sm">Link de indicação: <a href={refUrl} className="underline">{refUrl}</a></p> : !ro ? <form action={gerarCodigoIndicacao}><input type="hidden" name="contact_id" value={contato.id} /><Btn pequeno tom="secundario">Gerar link de indicação</Btn></form> : null}
            <p className="mt-2 text-sm">{indicados.length} pessoa(s) indicadas{indicados.length ? ": " + indicados.map((x) => x.nome).join(", ") : ""}</p>
            {contato.referred_by_contact_id && <p className="mt-1 text-xs text-zinc-500">Veio por indicação de {b.contatos.find((x) => x.id === contato.referred_by_contact_id)?.nome}</p>}
            {!ro && <form action={criarTarefa} className="mt-3 space-y-2"><input type="hidden" name="client_id" value={c.id} /><input type="hidden" name="contact_id" value={contato.id} /><input type="hidden" name="tipo" value="pedir_indicacao" /><input type="hidden" name="titulo" value="Pedir indicação" /><Input name="due_at" type="datetime-local" required /><Btn pequeno tom="ghost">Lembrar de pedir indicação</Btn></form>}
          </Card>
          <Card titulo="Relacionamento comercial">
            <ul className="space-y-1 text-sm">
              <li>Status: <Badge tom={c.status === "ativo" ? "bom" : "ruim"}>{c.status}</Badge></li>
              <li>Renovação: {dataBr(c.renewal_date)}</li>
              <li>Pagamentos pendentes: {receitas.filter((r) => r.status !== "collected").length}</li>
            </ul>
            <p className="mt-2 text-xs text-zinc-500">Isto não é "health score": só situação comercial.</p>
          </Card>
        </div>
      </div>
    </Pagina>
  );
}
