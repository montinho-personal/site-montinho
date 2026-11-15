import { NextRequest, NextResponse } from "next/server";
import { RESULTADOS } from "@/lib/resultados";
import { FILOSOFIAS } from "@/lib/filosofia";

/**
 * Feed público da vitrine de transformações, para outros sites do Montinho
 * (ex.: guiafitnessalphaville.com.br) mostrarem os mesmos resultados sem
 * copiar foto nem texto à mão. Quando entra aluno novo em lib/resultados.ts
 * com `vitrine`, ele aparece lá sozinho.
 *
 * - Só sai quem tem fotos separadas de antes e depois (o mesmo critério da
 *   vitrine daqui). URLs absolutas, servidas por este domínio.
 * - Os botões apontam para links controlados, um par por site
 *   (?origem=guia → /l/guia-*, ?origem=ppp → /l/ppp-*), para o CRM saber de
 *   onde veio o contato. Sem origem (ou desconhecida), vale "guia".
 * - CORS aberto: o conteúdo já é público em /resultados.
 */
const BASE = "https://www.montinhopersonal.com.br";

const ORIGENS: Record<string, string> = { guia: "guia", ppp: "ppp" };

export function GET(req: NextRequest) {
  const origem = ORIGENS[req.nextUrl.searchParams.get("origem") ?? ""] ?? "guia";
  const transformacoes = RESULTADOS.filter((r) => r.slug && r.vitrine).map((r) => ({
    slug: r.slug!,
    nome: r.name,
    idade: r.age,
    acompanhamento: r.duration || null,
    resultado: r.result,
    modalidade: r.modality,
    historia: r.description,
    depoimento: r.quote,
    fotos: {
      antes: `${BASE}${r.vitrine!.antes}`,
      depois: `${BASE}${r.vitrine!.depois}`,
      montagem: r.photo ? `${BASE}${r.photo}` : null,
      largura: r.vitrine!.largura,
      altura: r.vitrine!.altura,
    },
  }));
  const comparacao = FILOSOFIAS.find((f) => f.id === "comparacao");
  return NextResponse.json(
    {
      versao: 1,
      fonte: `${BASE}/resultados`,
      aviso: "Resultados individuais: cada pessoa tem o próprio ponto de partida e o próprio ritmo. Nenhum resultado é garantido.",
      nao_se_compare: comparacao ? { titulo: comparacao.titulo, texto: comparacao.texto.replace("{link}", "acompanhamento personalizado") } : null,
      links: {
        cta: `${BASE}/l/${origem}-vitrine`,
        todas: `${BASE}/l/${origem}-resultados`,
      },
      transformacoes,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
