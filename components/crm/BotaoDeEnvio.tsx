"use client";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";

/**
 * O botão que envia um formulário do CRM, travado enquanto o envio corre.
 *
 * Não é polimento: em 05/09/2026 um mesmo lead entrou quatro vezes no banco
 * em treze segundos, e outro duas vezes em sete — sempre a mesma pessoa,
 * sempre o mesmo clique repetido enquanto a página parecia parada. Sem
 * trava, cada toque a mais vira um contato, um lead e uma oportunidade
 * novos, e o funil passa a contar quatro pessoas onde existe uma.
 *
 * `useFormStatus` só enxerga o formulário acima dele na árvore, então este
 * componente precisa ser filho do <form> — é o caso de todos os usos do Btn.
 */
export default function BotaoDeEnvio({ tipo, cls, name, value, formAction, children }: {
  tipo: "submit" | "button";
  cls: string;
  name?: string;
  value?: string;
  formAction?: (fd: FormData) => void | Promise<void>;
  children: ReactNode;
}) {
  const { pending } = useFormStatus();
  const travado = pending && tipo === "submit";
  return (
    <button
      type={tipo}
      className={`${cls} disabled:cursor-not-allowed disabled:opacity-60`}
      name={name}
      value={value}
      formAction={formAction}
      disabled={travado}
      aria-busy={travado || undefined}
    >
      {travado ? "Salvando…" : children}
    </button>
  );
}
