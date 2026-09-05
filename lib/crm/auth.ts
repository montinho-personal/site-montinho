import { cache } from "react";
import { redirect } from "next/navigation";
import { supabaseServer } from "./supabase/server";

export interface UsuarioCrm { id: string; email: string; nome: string | null; role: "admin" | "user" | "readonly" }

/**
 * Camada de acesso a dados (DAL) da autenticação. Toda página, action e
 * route handler do CRM passa por aqui — o proxy.ts só faz a checagem
 * otimista pelo cookie, e isso não é autorização.
 *
 * Envolvida em cache() do React: o layout e a página pedem o usuário na mesma
 * renderização, e sem isto cada tela fazia duas chamadas de rede ao Auth do
 * Supabase mais duas consultas a crm_users.
 */
export const usuarioAtual = cache(async function usuarioAtual(): Promise<UsuarioCrm | null> {
  const sb = await supabaseServer();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("crm_users").select("id,email,nome,role,ativo").eq("id", user.id).maybeSingle();
  if (!data || !data.ativo) return null;
  return { id: data.id, email: data.email, nome: data.nome, role: data.role };
});

export async function exigirUsuario(): Promise<UsuarioCrm> {
  const u = await usuarioAtual();
  if (!u) redirect("/crm/login");
  return u;
}

export async function exigirEscrita(): Promise<UsuarioCrm> {
  const u = await exigirUsuario();
  if (u.role === "readonly") throw new Error("Seu acesso é somente leitura.");
  return u;
}

export async function exigirAdmin(): Promise<UsuarioCrm> {
  const u = await exigirUsuario();
  if (u.role !== "admin") throw new Error("Ação restrita ao administrador.");
  return u;
}
