"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { registrarAberturaWhatsApp } from "@/app/crm/onboarding/actions";

/**
 * Abre o WhatsApp com a mensagem da etapa e registra no histórico que a
 * conversa foi ABERTA. Não marca como enviada: abrir não prova envio. A
 * tarefa vai para "em andamento" e o Montinho confirma com "Enviei".
 *
 * A janela abre no onClick (dentro do gesto, senão o celular bloqueia), e a
 * falha do registro com a aba congelada é engolida, como em BotaoWhatsApp.
 */
export default function BotaoWhatsAppTarefa({ url, taskId, rotulo = "Abrir WhatsApp" }: { url: string; taskId: string; rotulo?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const registrar = (fd: FormData) => start(async () => {
    try { await registrarAberturaWhatsApp(fd); }
    catch {
      const volta = () => { if (document.visibilityState === "visible") { document.removeEventListener("visibilitychange", volta); router.refresh(); } };
      document.addEventListener("visibilitychange", volta); volta();
    }
  });
  return (
    <form action={(fd) => registrar(fd)} className="contents">
      <input type="hidden" name="task_id" value={taskId} />
      <button type="submit" disabled={pending} onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#25D366] px-3 py-1.5 text-sm font-medium text-black hover:bg-[#1ebe5b] disabled:opacity-60">
        {pending ? "Registrando…" : rotulo}
      </button>
    </form>
  );
}
