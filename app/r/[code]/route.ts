import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/crm/supabase/server";

/**
 * Link de indicação: /r/CODIGO. Valida o código sem expor nada do contato,
 * registra o clique, grava cookie de 30 dias e redireciona com UTM de
 * indicação. O tracker do site lê `ref` da URL e guarda no navegador.
 */
export async function GET(req: Request, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const origem = new URL(req.url).origin;
  const codigo = code.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 12);
  const sb = supabaseAnon();
  const { data: valido } = await sb.rpc("crm_referral_code_valido", { codigo });
  if (!valido) {
    const r = NextResponse.redirect(new URL("/", origem), 302);
    r.headers.set("X-Robots-Tag", "noindex, nofollow");
    return r;
  }
  try {
    await sb.from("crm_tracked_link_clicks").insert({ code: codigo, tipo: "referral", landing_page: "/", referrer: req.headers.get("referer")?.slice(0, 500) ?? null });
  } catch { /* segue */ }
  const destino = new URL("/", origem);
  destino.searchParams.set("utm_source", "indicacao");
  destino.searchParams.set("utm_medium", "referral");
  destino.searchParams.set("utm_content", codigo);
  destino.searchParams.set("ref", codigo);
  const r = NextResponse.redirect(destino, 302);
  r.cookies.set("mp_ref", codigo, { maxAge: 60 * 60 * 24 * 30, path: "/", sameSite: "lax" });
  r.headers.set("X-Robots-Tag", "noindex, nofollow");
  return r;
}
