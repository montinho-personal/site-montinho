import { NextResponse } from "next/server";
import { CANAIS_OFERTA, promoPorApelido } from "@/lib/promo/relampago";
import { ehRoboDePrevia } from "@/lib/crm/previa";
import { supabaseAnon } from "@/lib/crm/supabase/server";

/**
 * Link rastreado da oferta relâmpago: /oferta/<apelido>?c=<canal>&de=<página>.
 *
 * Conta o clique em crm_tracked_link_clicks (code "oferta:<apelido>:<canal>",
 * landing_page = página do site de onde a pessoa saiu) e redireciona para a
 * Amazon. Robô de prévia (WhatsApp, Instagram) não conta. Nada pessoal é
 * gravado: canal, página e referrer, como nos links /l/.
 */
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: Promise<{ apelido: string }> }) {
  const { apelido } = await ctx.params;
  const url = new URL(req.url);
  const p = promoPorApelido(apelido);
  if (!p) return NextResponse.redirect(new URL("/", url.origin), 302);

  const c = url.searchParams.get("c") ?? "outro";
  const canal = (CANAIS_OFERTA as readonly string[]).includes(c) ? c : "outro";
  const de = (url.searchParams.get("de") ?? "").replace(/[^\w\-/]/g, "").slice(0, 200) || null;

  if (!ehRoboDePrevia(req.headers.get("user-agent"))) {
    try {
      await supabaseAnon().from("crm_tracked_link_clicks").insert({
        code: `oferta:${p.apelido}:${canal}`,
        tipo: canal.startsWith("ig") || canal.startsWith("whatsapp") || canal === "youtube" ? "social" : "other",
        landing_page: de,
        referrer: req.headers.get("referer")?.slice(0, 500) ?? null,
      });
    } catch { /* o redirecionamento não depende do registro */ }
  }
  const r = NextResponse.redirect(p.url, 302);
  r.headers.set("X-Robots-Tag", "noindex, nofollow");
  r.headers.set("cache-control", "private, no-store");
  return r;
}
