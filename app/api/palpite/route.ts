import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/crm/supabase/server";
import { aberta, enquete } from "@/lib/palpites";

/**
 * Palpites: GET devolve o total por opção; POST registra um voto.
 * Público e anônimo — o "votante" é um id gerado no navegador, sem dado
 * pessoal. Um voto por votante por enquete (unique no banco).
 */
export const dynamic = "force-dynamic";

async function contagem(id: string) {
  const { data } = await supabaseAnon().rpc("palpites_contagem", { p_enquete: id });
  const votos: Record<string, number> = {};
  for (const r of (data ?? []) as { opcao: string; votos: number }[]) votos[r.opcao] = Number(r.votos);
  return votos;
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("e") ?? "";
  const e = enquete(id);
  if (!e) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, votos: await contagem(id), aberta: aberta(e) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  const e = enquete(String(b.enquete ?? ""));
  const opcao = String(b.opcao ?? "");
  const votante = String(b.votante ?? "");
  if (!e || (opcao !== e.vermelho.id && opcao !== e.azul.id) || !/^[a-zA-Z0-9-]{8,40}$/.test(votante))
    return NextResponse.json({ ok: false }, { status: 400 });
  if (!aberta(e)) return NextResponse.json({ ok: false, erro: "fechada", votos: await contagem(e.id) }, { status: 409 });
  const { error } = await supabaseAnon().from("palpites_votos").insert({ enquete: e.id, opcao, votante });
  if (error && error.code !== "23505") return NextResponse.json({ ok: false }, { status: 500 });
  return NextResponse.json({ ok: true, repetido: !!error, votos: await contagem(e.id) });
}
