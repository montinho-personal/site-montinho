"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { contatarPeloWhatsApp } from "@/app/crm/actions";

/**
 * O botão de WhatsApp da lista de hoje.
 *
 * Dois efeitos num clique só: abre a conversa com a mensagem pronta e
 * registra no CRM que ela foi enviada, para o card sair da lista. A janela
 * é aberta no onClick — dentro do gesto do dedo, senão o navegador do
 * celular bloqueia como pop-up.
 *
 * No celular, abrir o WhatsApp manda o navegador para o fundo, e ele congela
 * a aba no meio do registro. Na volta, a chamada interrompida virava erro e
 * derrubava a tela inteira ("Algo deu errado"). Agora a falha é engolida
 * aqui: quando a aba volta a ficar visível, a lista é recarregada do banco —
 * se o registro chegou, o card some; se não chegou, o card continua e o
 * Montinho vê que precisa tocar de novo.
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
  const router = useRouter();
  const [pending, start] = useTransition();
  const enviar = (fd: FormData) => start(async () => {
    try {
      await contatarPeloWhatsApp(fd);
    } catch {
      const recarregar = () => { if (document.visibilityState === "visible") { document.removeEventListener("visibilitychange", recarregar); router.refresh(); } };
      document.addEventListener("visibilitychange", recarregar);
      recarregar();
    }
  });
  return (
    <form action={(fd) => enviar(fd)} className="contents">
      <input type="hidden" name="contact_id" value={contactId} />
      {leadId && <input type="hidden" name="lead_id" value={leadId} />}
      {clientId && <input type="hidden" name="client_id" value={clientId} />}
      {taskId && <input type="hidden" name="task_id" value={taskId} />}
      <input type="hidden" name="grupo" value={grupo} />
      {situacao && <input type="hidden" name="situacao" value={situacao} />}
      <Botao url={url} pending={pending} />
    </form>
  );
}

function Botao({ url, pending }: { url: string; pending: boolean }) {
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
