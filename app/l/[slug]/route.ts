import { NextResponse } from "next/server";
import { LINKS, urlDoLink } from "@/lib/crm/links";
import { ehRoboDePrevia } from "@/lib/crm/previa";
import { supabaseAnon } from "@/lib/crm/supabase/server";

/** Link controlado: registra o clique e redireciona com UTM. */
export async function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const alvo = urlDoLink(slug);
  const origem = new URL(req.url).origin;
  if (!alvo) return NextResponse.redirect(new URL("/", origem), 302);

  /*
   * O WhatsApp (e Facebook, Telegram, LinkedIn) monta a prévia do link —
   * imagem, título — lendo as meta tags da página. Diante de um 302 ele
   * muitas vezes não segue, e o link curto aparecia "pelado" no grupo.
   * Para esses robôs devolvemos o HTML da página de destino, com as meta
   * tags dela, e não contamos como clique: robô de prévia não é pessoa.
   */
  if (ehRoboDePrevia(req.headers.get("user-agent"))) {
    try {
      const pagina = await fetch(new URL(LINKS[slug].destino, origem), { headers: { "user-agent": "montinho-previa" } });
      if (pagina.ok) {
        return new NextResponse(await pagina.text(), {
          status: 200,
          headers: { "content-type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex, nofollow", "cache-control": "public, max-age=300" },
        });
      }
    } catch { /* cai no redirecionamento normal */ }
  }

  try {
    await supabaseAnon().from("crm_tracked_link_clicks").insert({ code: slug, tipo: LINKS[slug].tipo, landing_page: alvo, referrer: req.headers.get("referer")?.slice(0, 500) ?? null });
  } catch { /* o redirecionamento não depende do registro */ }
  const r = NextResponse.redirect(new URL(alvo, origem), 302);
  r.headers.set("X-Robots-Tag", "noindex, nofollow");
  return r;
}
