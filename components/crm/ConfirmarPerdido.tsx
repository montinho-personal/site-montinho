"use client";
import { useRef } from "react";
import { marcarPerdido } from "@/app/crm/actions";
import { Input, Select } from "@/components/crm/ui";

/**
 * "Sumiu" / "Marcar perdido" com confirmação.
 *
 * O botão fecha a oportunidade, encerra tarefas e agenda reativação — grave
 * demais para um toque. O motivo continua obrigatório (o <select> de
 * sempre); o clique abre um <dialog> nativo que explica o efeito e só
 * envia o formulário em "Marcar como perdido". Cancelar não muda nada.
 */
export default function ConfirmarPerdido({ opportunityId, motivos, rotulo = "Sumiu", detalhe = false }: {
  opportunityId: string;
  motivos: { code: string; nome: string }[];
  rotulo?: string;
  detalhe?: boolean;
}) {
  const form = useRef<HTMLFormElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <form ref={form} action={marcarPerdido} className={detalhe ? "space-y-2" : "flex items-center gap-1"}>
      <input type="hidden" name="opportunity_id" value={opportunityId} />
      <Select name="loss_reason_code" required defaultValue="" className={detalhe ? "" : "w-auto px-2 py-1 text-sm"} aria-label="Por que perdeu">
        <option value="" disabled>{detalhe ? "Motivo *" : "Motivo…"}</option>
        {motivos.map((m) => <option key={m.code} value={m.code}>{m.nome}</option>)}
      </Select>
      {detalhe && <Input name="loss_reason_text" placeholder="Detalhe (opcional)" />}
      {/* type=button: nunca envia sozinho. Só valida o motivo e abre a confirmação. */}
      <button type="button" onClick={() => { if (form.current?.reportValidity()) dialog.current?.showModal(); }}
        className={`inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${detalhe ? "border border-rose-500/50 text-rose-200 hover:bg-rose-500/10" : "border border-white/20 text-white hover:bg-white/10"}`}>
        {rotulo}
      </button>

      <dialog ref={dialog} className="w-[min(92vw,380px)] rounded-xl border border-white/10 bg-zinc-900 p-4 text-zinc-100 backdrop:bg-black/70">
        <h3 className="text-base font-semibold">Marcar este lead como perdido?</h3>
        <p className="mt-2 text-sm text-zinc-400">Os follow-ups atuais serão encerrados e o lead sairá da lista ativa. Dá para desfazer em até 24 horas pela ficha do lead.</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" onClick={() => dialog.current?.close()} className="rounded-lg border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10">Cancelar</button>
          <button type="button" onClick={() => { dialog.current?.close(); form.current?.requestSubmit(); }} className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-400">Marcar como perdido</button>
        </div>
      </dialog>
    </form>
  );
}
