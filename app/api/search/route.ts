import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/search";
import { sugerirFerramentas } from "@/lib/busca-unificada";

export const runtime = "nodejs";

export function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limit = Math.min(
    parseInt(req.nextUrl.searchParams.get("limit") ?? "20", 10),
    50
  );

  if (q.trim().length < 2) {
    return NextResponse.json({ results: [], ferramentas: [], total: 0 });
  }

  const results = search(q, limit, true);
  const ferramentas = sugerirFerramentas(q, 3);
  return NextResponse.json({ results, ferramentas, total: results.length });
}
