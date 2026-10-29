import Link from "next/link";
import { adiarLead, agendarExperimental, deixarEmPaz, enviarProposta, marcarRespondeu, marcarRespostaSemRetorno } from "@/app/crm/actions";
import ConfirmarPerdido from "@/components/crm/ConfirmarPerdido";
import { Btn, Input } from "@/components/crm/ui";

/**
 * "Registrar": o único lugar para dizer o que aconteceu com o lead.
 *
 * Antes cada tela tinha um conjunto diferente: na Hoje, "Respondeu" e "Só
 * deu um ok" soltos e o resto atrás de um link pequeno ("Atualizar o que
 * aconteceu"); na lista de leads, só o link; no pipeline, só mover etapa. Um
 * usuário experiente procura o mesmo botão no mesmo lugar (pedido do
 * Montinho, 30/10/2026). Agora todo card tem duas ações: WhatsApp, para
 * FAZER, e Registrar, para dizer o que aconteceu.
 *
 * A etapa anda sozinha pelo que é registrado: "respondeu" tira de Novo,
 * "mandei os valores" leva para Proposta, "marcou experimental" para
 * Experimental (só no presencial). Mover etapa à mão continua no pipeline e
 * na ficha, para quem precisar.
 *
 * "Fechou" leva para a ficha, com o formulário de venda aberto: venda exige
 * plano, valor e forma de pagamento, e inventar qualquer um estraga a receita.
 */
export default function Registrar({ leadId, contactId, opportunityId, motivos, temExperimental = true, jaRespondeu = false, aberto = false }: {
  leadId: string;
  contactId: string;
  opportunityId?: string | null;
  motivos: { code: string; nome: string }[];
  /** Experimental só existe no presencial (funil simplificado em 30/10/2026). */
  temExperimental?: boolean;
  /** O card já é "respondeu e está esperando você": "Respondeu" não teria o que dizer. */
  jaRespondeu?: boolean;
  aberto?: boolean;
}) {
  const ids = (
    <>
      <input type="hidden" name="lead_id" value={leadId} />
      <input type="hidden" name="contact_id" value={contactId} />
    </>
  );
  const titulo = "mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500";
  return (
    <details open={aberto} className="group w-full sm:w-auto [&[open]]:basis-full">
      <summary className="inline-flex cursor-pointer list-none items-center justify-center gap-1 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 [&::-webkit-details-marker]:hidden">
        Registrar <span aria-hidden className="text-zinc-500 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="mt-2 space-y-3 rounded-lg border border-white/10 bg-black/40 p-3">
        <div>
          <p className={titulo}>A conversa</p>
          <div className="flex flex-wrap gap-2">
            {!jaRespondeu && (
              <form action={marcarRespondeu}>{ids}<Btn tom="secundario" pequeno title="Respondeu e a bola voltou para você: dúvida, pergunta, quer saber mais">Respondeu, quer saber mais</Btn></form>
            )}
            <form action={marcarRespostaSemRetorno}>{ids}<Btn tom="secundario" pequeno title="Ok, valeu, qualquer coisa te chamo: não pede retorno agora">Só deu um ok</Btn></form>
          </div>
        </div>

        <div>
          <p className={titulo}>Avançou</p>
          <div className="flex flex-wrap items-center gap-2">
            {opportunityId && (
              <form action={enviarProposta}><input type="hidden" name="opportunity_id" value={opportunityId} /><Btn tom="secundario" pequeno>Mandei os valores</Btn></form>
            )}
            {temExperimental && (
              <form action={agendarExperimental} className="flex items-center gap-1">
                <input type="hidden" name="lead_id" value={leadId} />
                <Input type="datetime-local" name="scheduled_at" required className="w-auto px-2 py-1 text-sm" aria-label="Quando é a experimental" />
                <Btn tom="secundario" pequeno>Marcou experimental</Btn>
              </form>
            )}
            <Link href={`/crm/leads/${leadId}?fechar=1#fechou`} prefetch={false} className="inline-flex items-center rounded-lg bg-emerald-500/90 px-3 py-1.5 text-sm font-medium text-black hover:bg-emerald-400">Fechou →</Link>
          </div>
        </div>

        <div>
          <p className={titulo}>Parar de cobrar</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-500">Adiar:</span>
            <form action={adiarLead}>{ids}<input type="hidden" name="dias" value="3" /><Btn tom="ghost" pequeno>3 dias</Btn></form>
            <form action={adiarLead}>{ids}<input type="hidden" name="dias" value="7" /><Btn tom="ghost" pequeno>1 semana</Btn></form>
            <form action={adiarLead} className="flex items-center gap-1">{ids}<Input type="date" name="ate" required className="w-auto px-2 py-1 text-sm" aria-label="Adiar até" /><Btn tom="ghost" pequeno>Até a data</Btn></form>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <form action={deixarEmPaz}>{ids}<Btn tom="ghost" pequeno title="Sem follow-up comercial até você retomar. Não fecha o lead.">Parar de cobrar</Btn></form>
            {opportunityId && <ConfirmarPerdido opportunityId={opportunityId} motivos={motivos} rotulo="Não quer (perdido)" />}
          </div>
        </div>
      </div>
    </details>
  );
}
