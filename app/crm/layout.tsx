import type { Metadata } from "next";
import { headers } from "next/headers";
import Shell from "@/components/crm/Shell";
import { usuarioAtual } from "@/lib/crm/auth";
import { sair } from "./actions";

export const metadata: Metadata = { title: "CRM", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
// O banco fica em sa-east-1 (São Paulo) e o usuário também. Sem isto a função
// roda no padrão da Vercel, nos Estados Unidos, e cada uma das dezenas de
// consultas por tela paga a ida e volta até lá.
export const preferredRegion = ["gru1"];

export default async function CrmLayout({ children }: { children: React.ReactNode }) {
  const h = await headers();
  const path = h.get("x-pathname") ?? "";
  const usuario = await usuarioAtual();
  // Login e callback não têm shell. O proxy já redireciona quem não tem sessão.
  if (!usuario || path.startsWith("/crm/login")) return <div className="min-h-screen bg-zinc-950 text-white">{children}</div>;
  return <Shell usuario={usuario} sair={sair}>{children}</Shell>;
}
