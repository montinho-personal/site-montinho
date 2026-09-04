import { NextResponse } from "next/server";
import { usuarioAtual } from "@/lib/crm/auth";
import { supabaseServer } from "@/lib/crm/supabase/server";

const PERMITIDAS = new Set(["crm_contacts", "crm_leads", "crm_opportunities", "crm_clients", "crm_contracts", "crm_revenue_events", "crm_activities", "crm_tasks", "crm_trials", "crm_whatsapp_handoffs", "crm_attribution_touches", "crm_ad_spend", "crm_audit_log", "crm_stage_history"]);

/** Exportação CSV de uma tabela do CRM, com a sessão do usuário (RLS). */
export async function GET(req: Request) {
  const u = await usuarioAtual();
  if (!u) return new NextResponse("não autorizado", { status: 401 });
  const tabela = new URL(req.url).searchParams.get("tabela") ?? "";
  if (!PERMITIDAS.has(tabela)) return new NextResponse("tabela inválida", { status: 400 });
  const sb = await supabaseServer();
  const { data, error } = await sb.from(tabela).select("*").limit(50000);
  if (error) return new NextResponse(error.message, { status: 500 });
  const rows = (data ?? []) as Record<string, unknown>[];
  const cols = rows.length ? Object.keys(rows[0]) : [];
  const esc = (v: unknown) => { const s = v == null ? "" : typeof v === "object" ? JSON.stringify(v) : String(v); return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const csv = "﻿" + [cols.join(";"), ...rows.map((r) => cols.map((c) => esc(r[c])).join(";"))].join("\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${tabela}-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
