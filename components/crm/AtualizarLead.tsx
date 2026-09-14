import Link from "next/link";
import { agendarExperimental, enviarProposta, marcarPerdido, registrarAtividade } from "@/app/crm/actions";
import { Btn, Input, Select } from "@/components/crm/ui";

/**
 * "O que aconteceu na conversa?" — direto no card da lista de hoje.
 *
 * O cadastro do lead já é automático pelo Ref; o que ficava para trás era a
 * etapa. Depois de três dias de conversa ninguém lembra de abrir a tela do
 * lead para dizer que a proposta foi enviada — e o funil vira ficção.
 *
 * Fica fechado por padrão: o card continua limpo, e quem quiser atualizar
 * toca em "Atualizar". Um toque resolve o que já tem todos os dados
 * (proposta, respondeu); o resto pede o mínimo ali mesmo (a data da
 * experimental, o motivo da perda).
 *
 * "Fechou" não vira botão de um toque de propósito: venda exige plano,
 * valor e forma de pagamento, e inventar qualquer um deles estraga a
 * receita e o MRR. Ele leva para a tela do lead, onde o formulário pede
 * tudo.
 */
export default function AtualizarLead({ leadId, contactId, opportunityId, motivos }: {
  leadId: string;
  contactId: string;
  opportunityId?: string | null;
  motivos: { code: string; nome: string }[];
}) {
  return (
    <details className="w-full [&[open]>summary]:mb-2">
      <summary className="cursor-pointer list-none text-xs text-zinc-500 underline underline-offset-2 hover:text-zinc-300">
        Atualizar o que aconteceu
      </summary>
      <div className="flex flex-wrap gap-2 rounded-lg border border-white/10 bg-black/30 p-2">
        <form action={registrarAtividade}>
          <input type="hidden" name="lead_id" value={leadId} />
          <input type="hidden" name="contact_id" value={contactId} />
          <input type="hidden" name="tipo" value="message" />
          <input type="hidden" name="descricao" value="Respondeu na conversa" />
          <Btn tom="secundario" pequeno>Respondeu</Btn>
        </form>

        {opportunityId && (
          <form action={enviarProposta}>
            <input type="hidden" name="opportunity_id" value={opportunityId} />
            <Btn tom="secundario" pequeno>Mandei proposta</Btn>
          </form>
        )}

        {/* Agendar experimental só precisa do lead: a ação encontra a oportunidade sozinha. */}
        <form action={agendarExperimental} className="flex items-center gap-1">
          <input type="hidden" name="lead_id" value={leadId} />
          <Input type="datetime-local" name="scheduled_at" required className="w-auto px-2 py-1 text-sm" aria-label="Quando é a experimental" />
          <Btn tom="secundario" pequeno>Marcou experimental</Btn>
        </form>

        {opportunityId && (
          <form action={marcarPerdido} className="flex items-center gap-1">
            <input type="hidden" name="opportunity_id" value={opportunityId} />
            <Select name="loss_reason_code" required defaultValue="" className="w-auto px-2 py-1 text-sm" aria-label="Por que perdeu">
              <option value="" disabled>Motivo…</option>
              {motivos.map((m) => <option key={m.code} value={m.code}>{m.nome}</option>)}
            </Select>
            <Btn tom="secundario" pequeno>Sumiu</Btn>
          </form>
        )}

        <Link href={`/crm/leads/${leadId}`} className="inline-flex items-center rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">
          Fechou →
        </Link>
      </div>
    </details>
  );
}
