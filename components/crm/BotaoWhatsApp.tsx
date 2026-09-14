"use client";
import { useFormStatus } from "react-dom";
import { contatarPeloWhatsApp } from "@/app/crm/actions";

/**
 * O botão de WhatsApp da lista de hoje.
 *
 * Dois efeitos num clique só: abre a conversa com a mensagem pronta e
 * registra no CRM que ela foi enviada, para o card sair da lista. A janela
 * é aberta no onClick — dentro do gesto do dedo, senão o navegador do
 * celular bloqueia como pop-up — e o formulário segue para o servidor.
 */
export default function BotaoWhatsApp({ url, contactId, leadId, clientId, taskId, grupo, situacao }: {
  url: string;
  contactId: string;
  leadId?: string | null;
  clientId?: string | null;
  taskId?: string | null;
  grupo: string;
  situacao?: string;
}) {
  return (
    <form action={contatarPeloWhatsApp} className="contents">
      <input type="hidden" name="contact_id" value={contactId} />
      {leadId && <input type="hidden" name="lead_id" value={leadId} />}
      {clientId && <input type="hidden" name="client_id" value={clientId} />}
      {taskId && <input type="hidden" name="task_id" value={taskId} />}
      <input type="hidden" name="grupo" value={grupo} />
      {situacao && <input type="hidden" name="situacao" value={situacao} />}
      <Botao url={url} />
    </form>
  );
}

function Botao({ url }: { url: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-[#1ebe5b] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-60"
    >
      {pending ? "Registrando…" : "WhatsApp"}
    </button>
  );
}
