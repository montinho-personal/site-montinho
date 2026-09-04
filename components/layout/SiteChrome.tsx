"use client";

import { usePathname } from "next/navigation";

/**
 * O CRM mora em /crm e não usa cabeçalho, rodapé, botão flutuante de
 * WhatsApp, sticky bar nem banner de cookies do site. Em vez de mover todas
 * as rotas do site para um route group, este componente esconde o "chrome"
 * do site quando a rota é do CRM.
 */
const SEM_CHROME = ["/crm", "/lp/"];
const semChrome = (p: string) => SEM_CHROME.some((x) => p.startsWith(x));

/**
 * `sempre`: partes que ficam mesmo sem chrome (o banner de cookies numa
 * landing page de anúncio, por exemplo — LGPD não tira folga por ser anúncio).
 */
export default function SiteChrome({ children, sempreEm = [] }: { children: React.ReactNode; sempreEm?: string[] }) {
  const pathname = usePathname();
  if (semChrome(pathname) && !sempreEm.some((x) => pathname.startsWith(x))) return null;
  return <>{children}</>;
}

export function MainDoSite({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <main className={semChrome(pathname) ? "flex-1" : "flex-1 pt-16 lg:pt-20"}>{children}</main>;
}
