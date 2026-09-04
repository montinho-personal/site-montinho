import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/crm/supabase/server";

/** Clique em link controlado (indicação, QR, social). Sem dado pessoal. */
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const code = typeof b.code === "string" ? b.code.slice(0, 40) : null;
  const tipo = ["referral", "qr", "social", "other"].includes(String(b.tipo)) ? String(b.tipo) : "other";
  if (!code) return NextResponse.json({ ok: false }, { status: 400 });
  const { error } = await supabaseAnon().from("crm_tracked_link_clicks").insert({
    code, tipo,
    landing_page: typeof b.landing_page === "string" ? b.landing_page.slice(0, 500) : null,
    referrer: typeof b.referrer === "string" ? b.referrer.slice(0, 500) : null,
    session_id: typeof b.session_id === "string" ? b.session_id.slice(0, 40) : null,
    anonymous_id: typeof b.anonymous_id === "string" ? b.anonymous_id.slice(0, 40) : null,
  });
  return NextResponse.json({ ok: !error });
}
