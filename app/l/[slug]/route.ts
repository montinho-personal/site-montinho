import { NextResponse } from "next/server";
import { LINKS, urlDoLink } from "@/lib/crm/links";
import { supabaseAnon } from "@/lib/crm/supabase/server";

/** Link controlado: registra o clique e redireciona com UTM. */
export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const alvo = urlDoLink(slug);
  const origem = new URL(req.url).origin;
  if (!alvo) return NextResponse.redirect(new URL("/", origem), 302);
  try {
    await supabaseAnon().from("crm_tracked_link_clicks").insert({ code: slug, tipo: LINKS[slug].tipo, landing_page: alvo, referrer: req.headers.get("referer")?.slice(0, 500) ?? null });
  } catch { /* o redirecionamento não depende do registro */ }
  const r = NextResponse.redirect(new URL(alvo, origem), 302);
  r.headers.set("X-Robots-Tag", "noindex, nofollow");
  return r;
}
