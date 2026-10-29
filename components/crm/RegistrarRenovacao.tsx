import Link from "next/link";
import { cancelarCliente, renovarContrato } from "@/app/crm/actions";
import { Btn, Input, Select, brl, dataInput } from "@/components/crm/ui";

/**
 * Renovação resolvida no próprio card (pedido do Montinho, 30/10/2026).
 *
 * Antes o card de renovação só tinha "Confirmar…" (cortado), que levava para
 * a ficha do cliente; lá, o formulário ficava dentro de uma sanfona. Por isso
 * havia cliente com a renovação vencida há mais de cem dias ainda "ativo":
 * confirmar dava trabalho demais.
 *
 * "Renovou" já vem com o plano, o valor e o ciclo do contrato atual; o ciclo
 * começa na data em que o anterior venceu (sem buraco nem sobreposição).
 * "Pausou" e "Não renovou" pedem só o motivo, como na ficha.
 */
export default function RegistrarRenovacao({ clientId, planId, valor, cicloMeses, renovaEm, nomePlano }: {
  clientId: string;
  planId: string | null;
  valor: number | null;
  cicloMeses: number;
  /** Data em que o contrato atual vence (aaaa-mm-dd). */
  renovaEm: string | null;
  nomePlano?: string | null;
}) {
  const hoje = dataInput();
  return (
    <details className="group w-full sm:w-auto [&[open]]:basis-full">
      <summary className="inline-flex cursor-pointer list-none items-center justify-center gap-1 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 [&::-webkit-details-marker]:hidden">
        Registrar <span aria-hidden className="text-zinc-500 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="mt-2 space-y-3 rounded-lg border border-white/10 bg-black/40 p-3">
        {planId ? (
          <form action={renovarContrato} className="space-y-2">
            <input type="hidden" name="client_id" value={clientId} />
            <input type="hidden" name="plan_id" value={planId} />
            <input type="hidden" name="ciclo_meses" value={cicloMeses} />
            <input type="hidden" name="recebido_em" value={hoje} />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Renovou · {nomePlano ?? "plano atual"}{valor ? ` · ${brl(valor)}` : ""}</p>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-zinc-400">Valor (R$)<Input name="valor" inputMode="decimal" required defaultValue={valor ?? ""} className="mt-1 px-2 py-1.5 text-sm" /></label>
              <label className="text-xs text-zinc-400">Ciclo começa<Input name="inicio" type="date" required defaultValue={renovaEm ?? hoje} className="mt-1 px-2 py-1.5 text-sm" /></label>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="recebido" defaultChecked /> Já recebi</label>
              <Select name="payment_method" defaultValue="pix" className="w-auto px-2 py-1 text-sm" aria-label="Forma de pagamento"><option value="pix">Pix</option><option value="cartao">Cartão</option><option value="mercado_pago">Mercado Pago</option><option value="dinheiro">Dinheiro</option><option value="transferencia">Transferência</option></Select>
              <Btn pequeno>Renovou</Btn>
            </div>
          </form>
        ) : (
          <p className="text-sm text-zinc-400">Sem plano no contrato atual. <Link href={`/crm/clientes/${clientId}`} className="underline">Renovar pela ficha</Link>.</p>
        )}

        <form action={cancelarCliente} className="space-y-2 border-t border-white/10 pt-3">
          <input type="hidden" name="client_id" value={clientId} />
          <input type="hidden" name="cancelled_at" value={hoje} />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Não vai renovar agora</p>
          <Input name="cancel_reason" required placeholder="Motivo (comercial, sem dado de saúde)" className="px-2 py-1.5 text-sm" />
          <div className="flex flex-wrap gap-2">
            <Btn tom="secundario" pequeno name="status" value="pausado">Pausou</Btn>
            <Btn tom="perigo" pequeno name="status" value="cancelado">Não renovou (encerrar)</Btn>
          </div>
        </form>
      </div>
    </details>
  );
}
