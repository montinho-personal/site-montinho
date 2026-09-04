import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { eventosReceita } from "@/lib/crm/analise";
import { ltvRealizado } from "@/lib/crm/metricas";
import { LINKS } from "@/lib/crm/links";
import AnalyticsNav from "@/components/crm/AnalyticsNav";
import { supabaseServer } from "@/lib/crm/supabase/server";
import { Card, Pagina, Tabela, brl } from "@/components/crm/ui";

export default async function Social() {
  await exigirUsuario();
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const sb = await supabaseServer();
  const { data: cliques } = await sb.from("crm_tracked_link_clicks").select("code,tipo,occurred_at").limit(5000);
  const ev = eventosReceita(b);
  const social = ["instagram_organic", "instagram_ads", "facebook_organic", "facebook_ads", "youtube", "tiktok"];
  const porFonteConteudo = new Map<string, { cliques: number; wa: number; leads: number; qualificados: number; vendas: number; receita: number; ltv: number[] }>();
  const chave = (f: string, c: string | null) => `${f}|${c ?? "—"}`;
  for (const h of b.handoffs) if (h.source_code && social.includes(h.source_code)) { const k = chave(h.source_code, h.utm_campaign ?? h.utm_content); const r = porFonteConteudo.get(k) ?? { cliques: 0, wa: 0, leads: 0, qualificados: 0, vendas: 0, receita: 0, ltv: [] }; r.wa++; porFonteConteudo.set(k, r); }
  for (const l of b.leads) if (social.includes(l.source_code)) { const k = chave(l.source_code, l.source_detail); const r = porFonteConteudo.get(k) ?? { cliques: 0, wa: 0, leads: 0, qualificados: 0, vendas: 0, receita: 0, ltv: [] }; r.leads++; const o = b.oportunidades.find((x) => x.lead_id === l.id); if (o?.proposal_sent_at || o?.won_at) r.qualificados++; if (l.status === "ganho") { r.vendas++; const c = b.clientes.find((x) => x.contact_id === l.contact_id); if (c) { const v = ltvRealizado(ev, c.id); r.receita += v; r.ltv.push(v); } } porFonteConteudo.set(k, r); }
  for (const c of cliques ?? []) { const l = LINKS[c.code]; if (l && l.tipo === "social") { const f = `${l.utm_source}_organic`; const k = chave(f, l.utm_campaign); const r = porFonteConteudo.get(k) ?? { cliques: 0, wa: 0, leads: 0, qualificados: 0, vendas: 0, receita: 0, ltv: [] }; r.cliques++; porFonteConteudo.set(k, r); } }
  const linhas = [...porFonteConteudo.entries()].sort((a, z) => z[1].receita - a[1].receita || z[1].leads - a[1].leads);
  const nome = (c: string) => cat.fontes.find((f) => f.code === c)?.nome ?? c;
  const base_ = "https://www.montinhopersonal.com.br";
  return (
    <Pagina titulo="Social" sub="Métrica primária: lead → qualificado → venda → receita → LTV. Likes e seguidores não entram aqui.">
      <AnalyticsNav atual="/crm/analytics/social" />
      <Card titulo="Plataforma / campanha ou conteúdo → cliques → WhatsApp → leads → vendas → receita">
        <Tabela cabecalho={["Plataforma", "Campanha / conteúdo", "Cliques em link controlado", "Cliques WhatsApp", "Leads", "Qualificados", "Vendas", "Receita", "LTV médio"]} linhas={linhas.map(([k, r]) => { const [f, c] = k.split("|"); return [nome(f), c, r.cliques, r.wa, r.leads, r.qualificados, r.vendas, brl(r.receita), r.ltv.length ? brl(r.ltv.reduce((s, x) => s + x, 0) / r.ltv.length) : "—"]; })} vazio="Sem dado social ainda. Use os links controlados abaixo na bio, stories e destaques." />
      </Card>
      <Card titulo="Links controlados (use estes, não o domínio puro)" className="mt-4">
        <Tabela cabecalho={["Onde usar", "Link curto", "Destino com UTM"]} linhas={Object.entries(LINKS).map(([slug, l]) => [slug, <code key="s" className="text-xs">{base_}/l/{slug}</code>, <span key="d" className="text-xs text-zinc-400">{l.destino} · {l.utm_source}/{l.utm_medium}/{l.utm_campaign}/{l.utm_content}</span>])} />
        <p className="mt-2 text-xs text-zinc-500">Referrer de app social não é confiável; o link controlado é. Para QR code, gere a imagem com a URL do link.</p>
      </Card>
    </Pagina>
  );
}
