import { naoEnviar } from "@/app/crm/actions";
import { Btn } from "@/components/crm/ui";

/**
 * A mensagem do card, lida antes de abrir o WhatsApp (pedido de 29/10/2026).
 *
 * Tem mensagem que, no contexto, não vale mandar: a pessoa já é aluna, a
 * conversa andou por fora, o momento é ruim. Antes, para saber o que ia sair,
 * era preciso abrir o WhatsApp; e para não mandar, sobrava o Registrar →
 * Adiar, que diz outra coisa. Aqui o texto aparece inteiro e "Não enviar"
 * tira o card de hoje sem contar como cobrança.
 */
export default function PreviaMensagem({ texto, contactId, leadId, clientId, taskId, grupo, situacao }: {
  texto: string;
  contactId: string;
  leadId?: string | null;
  clientId?: string | null;
  taskId?: string | null;
  grupo: string;
  situacao?: string;
}) {
  const ids = (
    <>
      <input type="hidden" name="contact_id" value={contactId} />
      {leadId && <input type="hidden" name="lead_id" value={leadId} />}
      {clientId && <input type="hidden" name="client_id" value={clientId} />}
      {taskId && <input type="hidden" name="task_id" value={taskId} />}
      <input type="hidden" name="grupo" value={grupo} />
      {situacao && <input type="hidden" name="situacao" value={situacao} />}
    </>
  );
  return (
    <details className="group w-full sm:w-auto [&[open]]:basis-full">
      <summary className="inline-flex cursor-pointer list-none items-center justify-center gap-1 rounded-lg border border-white/20 px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 [&::-webkit-details-marker]:hidden">
        Ver mensagem <span aria-hidden className="text-zinc-500 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="mt-2 space-y-3 rounded-lg border border-white/10 bg-black/40 p-3">
        <p className="whitespace-pre-wrap rounded-lg bg-[#144d37]/60 px-3 py-2 text-sm leading-relaxed text-zinc-100">{texto}</p>
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Não vale mandar agora?</p>
          <div className="flex flex-wrap gap-2">
            <form action={naoEnviar}>{ids}<input type="hidden" name="dias" value="3" /><Btn tom="secundario" pequeno title="Sai de hoje sem contar como cobrança">Não enviar · volta em 3 dias</Btn></form>
            <form action={naoEnviar}>{ids}<input type="hidden" name="dias" value="7" /><Btn tom="ghost" pequeno>Volta em 1 semana</Btn></form>
          </div>
        </div>
      </div>
    </details>
  );
}
