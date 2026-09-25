"use client";

import { useSyncExternalStore } from "react";

/**
 * "Agora" em ms UTC, atualizado a cada `passo` ms. No servidor e na
 * hidratação vale null (a agenda em texto já está no HTML); o relógio entra
 * logo depois, sem erro de hidratação. O valor é arredondado ao passo, para
 * o snapshot ficar estável entre dois ticks.
 */
export function useAgora(passo: number): number | null {
  return useSyncExternalStore(
    (avisa) => {
      const id = window.setInterval(avisa, passo);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / passo) * passo,
    () => null,
  );
}
