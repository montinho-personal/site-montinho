import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/crm/supabase/server";

/**
 * Link de indicação: /r/CODIGO. Valida o código sem expor nada do contato,
 * registra o clique e redireciona com UTM de indicação. O tracker do site lê
 * `ref` da URL e guarda no navegador.
 *
 * POR QUE NÃO HÁ COOKIE AQUI
 *
 * Havia: um `mp_ref` de 30 dias, gravado pelo servidor. Ele tinha dois
 * problemas. O primeiro é que ninguém o lia — o HandoffTracker sempre leu o
 * `ref` da URL, não o cookie, então era dado morto. O segundo é que a
 * política em /lgpd promete consentimento (art. 7º, I) para cookie não
 * essencial, e o servidor não tem como saber o que a pessoa respondeu no
 * banner: essa decisão mora no localStorage do navegador. Gravar do servidor
 * era, na prática, ignorar o banner.
 *
 * O caminho certo já existia: o `ref` vai na URL, o tracker o guarda em
 * localStorage se a pessoa aceitou e em sessionStorage se recusou. Mesma
 * atribuição, dentro do que a política promete.
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
  r.headers.set("X-Robots-Tag", "noindex, nofollow");
  return r;
}
