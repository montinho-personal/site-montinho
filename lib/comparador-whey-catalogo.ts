import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./crm/supabase/config";

/**
 * Leitura do catálogo da Batalha dos Wheys (tabelas whey_produtos e
 * whey_precos, só leitura pública via RLS).
 *
 * A página NUNCA depende do banco para funcionar: se a consulta falhar,
 * o catálogo volta vazio e a comparação manual continua de pé. O
 * resultado fica em cache por 1 hora (ISR), então nenhum visitante dispara
 * consulta a loja nenhuma — o preço só muda quando alguém cadastra um novo
 * no painel.
 */

export type CondicaoPreco = "regular" | "promocional" | "avista" | "pix" | "cartao" | "assinatura" | "cupom";

export const ROTULO_CONDICAO: Record<CondicaoPreco, string> = {
  regular: "preço cheio",
  promocional: "promoção",
  avista: "à vista",
  pix: "no Pix",
  cartao: "no cartão",
  assinatura: "por assinatura",
  cupom: "com cupom",
};

export interface PrecoCatalogo {
  condicao: CondicaoPreco;
  precoCentavos: number;
  parcelamento: string | null;
  emEstoque: boolean | null;
  loja: string;
  url: string;
  metodo: string;
  /** ISO. */
  verificadoEm: string;
}

export interface ProdutoCatalogo {
  slug: string;
  marca: string;
  linha: string;
  nome: string;
  tipo: string;
  sabor: string;
  pacoteG: number;
  porcaoG: number;
  proteinaPorcaoG: number;
  carboidratosG: number | null;
  acucaresG: number | null;
  gordurasG: number | null;
  sodioMg: number | null;
  kcalPorcao: number | null;
  lactose: string | null;
  alergenicos: string | null;
  urlOficial: string | null;
  fonteRotulo: string;
  rotuloVerificadoEm: string;
  /** O preço mais recente de cada condição. */
  precos: PrecoCatalogo[];
}

const num = (v: unknown) => (v === null || v === undefined ? null : Number(v));

export async function carregarCatalogo(): Promise<ProdutoCatalogo[]> {
  const sel =
    "slug,marca,linha,nome,tipo,sabor,pacote_g,porcao_g,proteina_porcao_g,carboidratos_g,acucares_totais_g,gorduras_totais_g,sodio_mg,kcal_porcao,lactose,alergenicos,url_oficial,fonte_rotulo,rotulo_verificado_em," +
    "whey_precos(condicao,preco_centavos,parcelamento,em_estoque,loja,url,metodo,verificado_em)";
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/whey_produtos?select=${encodeURIComponent(sel)}&status=eq.verificado&order=marca,linha,sabor`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` },
      next: { revalidate: 3600 },
    });
    if (!r.ok) return [];
    const linhas = (await r.json()) as Record<string, unknown>[];
    return linhas.map((l) => {
      const brutos = (l.whey_precos as Record<string, unknown>[] | null) ?? [];
      const porCondicao = new Map<string, PrecoCatalogo>();
      for (const p of brutos) {
        const atual = porCondicao.get(String(p.condicao));
        if (!atual || String(p.verificado_em) > atual.verificadoEm) {
          porCondicao.set(String(p.condicao), {
            condicao: p.condicao as CondicaoPreco,
            precoCentavos: Number(p.preco_centavos),
            parcelamento: (p.parcelamento as string) ?? null,
            emEstoque: (p.em_estoque as boolean) ?? null,
            loja: String(p.loja),
            url: String(p.url),
            metodo: String(p.metodo),
            verificadoEm: new Date(String(p.verificado_em)).toISOString(),
          });
        }
      }
      return {
        slug: String(l.slug),
        marca: String(l.marca),
        linha: String(l.linha),
        nome: String(l.nome),
        tipo: String(l.tipo),
        sabor: String(l.sabor),
        pacoteG: Number(l.pacote_g),
        porcaoG: Number(l.porcao_g),
        proteinaPorcaoG: Number(l.proteina_porcao_g),
        carboidratosG: num(l.carboidratos_g),
        acucaresG: num(l.acucares_totais_g),
        gordurasG: num(l.gorduras_totais_g),
        sodioMg: num(l.sodio_mg),
        kcalPorcao: num(l.kcal_porcao),
        lactose: (l.lactose as string) ?? null,
        alergenicos: (l.alergenicos as string) ?? null,
        urlOficial: (l.url_oficial as string) ?? null,
        fonteRotulo: String(l.fonte_rotulo),
        rotuloVerificadoEm: String(l.rotulo_verificado_em),
        precos: [...porCondicao.values()],
      };
    });
  } catch {
    return [];
  }
}
