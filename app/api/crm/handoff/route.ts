import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/crm/supabase/server";
import { inferirFonte } from "@/lib/crm/metricas";

/**
 * Recebe o registro do clique no WhatsApp. Público, sem sessão: a inserção
 * passa pela política RLS de INSERT para anon, que só aceita linha sem
 * contact_id/lead_id. Nenhum dado pessoal entra por aqui.
 */
const TEXTO = (v: unknown, max = 300) => (typeof v === "string" && v.trim() ? v.trim().slice(0, max) : null);

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const ref = TEXTO(b.ref_code, 8);
  if (!ref || !/^[A-Z0-9]{4,8}$/.test(ref)) return NextResponse.json({ ok: false, erro: "ref_code" }, { status: 400 });
  const utm = {
    utm_source: TEXTO(b.utm_source, 100), utm_medium: TEXTO(b.utm_medium, 100), utm_campaign: TEXTO(b.utm_campaign, 200),
    utm_content: TEXTO(b.utm_content, 200), utm_term: TEXTO(b.utm_term, 200),
    gclid: TEXTO(b.gclid, 200), gbraid: TEXTO(b.gbraid, 200), wbraid: TEXTO(b.wbraid, 200), fbclid: TEXTO(b.fbclid, 200),
  };
  const referrer = TEXTO(b.referrer, 500);
  const referralCode = TEXTO(b.referral_code, 12);
  const fonte = inferirFonte({ utmSource: utm.utm_source, utmMedium: utm.utm_medium, gclid: utm.gclid, gbraid: utm.gbraid, wbraid: utm.wbraid, fbclid: utm.fbclid, referrer, referralCode });
  const linha = {
    ref_code: ref,
    page_url: TEXTO(b.page_url, 500), page_path: TEXTO(b.page_path, 300), page_title: TEXTO(b.page_title, 200),
    cta_id: TEXTO(b.cta_id, 120), ferramenta: TEXTO(b.ferramenta, 80), servico_interesse: TEXTO(b.servico_interesse, 20),
    landing_page: TEXTO(b.landing_page, 500), referrer,
    ...utm,
    source_code: fonte.sourceCode,
    first_touch: b.first_touch && typeof b.first_touch === "object" ? b.first_touch : null,
    session_id: TEXTO(b.session_id, 40), anonymous_id: TEXTO(b.anonymous_id, 40),
    device: TEXTO(b.device, 20),
    consent: typeof b.consent === "boolean" ? b.consent : null,
    utm_content: referralCode && !utm.utm_content ? `ref:${referralCode}` : utm.utm_content,
  };
  const sb = supabaseAnon();
  const { error } = await sb.from("crm_whatsapp_handoffs").insert(linha);
  if (error) return NextResponse.json({ ok: false, erro: error.code }, { status: error.code === "23505" ? 409 : 500 });
  return NextResponse.json({ ok: true, ref });
}
