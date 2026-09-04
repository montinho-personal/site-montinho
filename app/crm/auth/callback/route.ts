import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/crm/supabase/server";

/** Troca o código do link mágico / confirmação por sessão. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/crm";
  if (code) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next.startsWith("/crm") ? next : "/crm", url.origin));
    return NextResponse.redirect(new URL(`/crm/login?erro=${encodeURIComponent(error.message)}`, url.origin));
  }
  return NextResponse.redirect(new URL("/crm/login", url.origin));
}
