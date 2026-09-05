import Link from "next/link";
const ITENS = [["/crm/analytics", "Visão geral"], ["/crm/analytics/funil", "Funil"], ["/crm/analytics/aquisicao", "Aquisição"], ["/crm/analytics/receita", "Receita"], ["/crm/analytics/ltv", "LTV & Retenção"], ["/crm/analytics/atribuicao", "Atribuição"], ["/crm/analytics/ads", "Ads"], ["/crm/analytics/seo", "SEO"], ["/crm/analytics/social", "Social"], ["/crm/qualidade-de-dados", "Qualidade"]];
export default function AnalyticsNav({ atual }: { atual: string }) {
  return <nav className="mb-4 flex flex-wrap gap-1">{ITENS.map(([h, n]) => <Link key={h} href={h} prefetch={false} className={`rounded-full px-3 py-1 text-xs ${h === atual ? "bg-white text-black" : "border border-white/15 text-zinc-300 hover:bg-white/10"}`}>{n}</Link>)}</nav>;
}
export function Periodo({ atual, base }: { atual: number; base: string }) {
  return <div className="mb-3 flex gap-1 text-xs">{[30, 90, 180, 365].map((d) => <Link key={d} href={`${base}?dias=${d}`} prefetch={false} className={`rounded px-2 py-1 ${d === atual ? "bg-white/20" : "text-zinc-400 hover:text-white"}`}>{d} dias</Link>)}</div>;
}
