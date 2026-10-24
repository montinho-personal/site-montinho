"use client";

import { trackEvent } from "@/lib/analytics";
import { LINK_APP } from "@/lib/app-convite";

/** Botão do convite do app com medição (app_invite_click), para páginas de servidor. */
export default function BotaoApp({ onde, children, variante = "principal" }: { onde: string; children: React.ReactNode; variante?: "principal" | "contorno" }) {
  const cls =
    variante === "principal"
      ? "inline-flex items-center justify-center gap-3 bg-[#BA9E50] text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-[#cdb267] transition-all duration-200"
      : "inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-base font-medium tracking-wide hover:border-white hover:bg-white/5 transition-all duration-200";
  return (
    <a href={LINK_APP} target="_blank" rel="noopener" onClick={() => trackEvent("app_invite_click", { placement: onde })} className={cls}>
      {children}
    </a>
  );
}
