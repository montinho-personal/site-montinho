"use client";

import { usePathname } from "next/navigation";

/**
 * O CRM mora em /crm e não usa cabeçalho, rodapé, botão flutuante de
 * WhatsApp, sticky bar nem banner de cookies do site. Em vez de mover todas
 * as rotas do site para um route group, este componente esconde o "chrome"
 * do site quando a rota é do CRM.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/crm")) return null;
  return <>{children}</>;
}

export function MainDoSite({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const crm = pathname.startsWith("/crm");
  return <main className={crm ? "flex-1" : "flex-1 pt-16 lg:pt-20"}>{children}</main>;
}
