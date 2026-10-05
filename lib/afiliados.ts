/** Cartões de afiliado da Amazon (tag montinho-20). Sem preço: muda o tempo
 *  todo na promoção. Só entra produto vendido pela loja oficial da marca ou
 *  pela própria Amazon, conferido por print do "Vendido por". */
export type ProdutoAfiliado = {
  id: string;
  marca: string;
  nome: string;
  url: string;
  vendedor: "loja oficial da marca" | "Amazon";
  enviadoPelaAmazon: boolean;
};

export const PRODUTOS_AFILIADOS: Record<string, ProdutoAfiliado> = {
  "creatina-ftw-500g": {
    id: "creatina-ftw-500g",
    marca: "FTW",
    nome: "Creatina monohidratada 500 g (refil), sem sabor",
    url: "https://www.amazon.com.br/dp/B0DH64LKFK?tag=montinho-20",
    vendedor: "loja oficial da marca",
    enviadoPelaAmazon: true,
  },
  "creatina-soldiers-250g": {
    id: "creatina-soldiers-250g",
    marca: "Soldiers Nutrition",
    nome: "Creatina monohidratada 250 g, sabor natural",
    url: "https://link.amazon/B0aiNDs4P",
    vendedor: "loja oficial da marca",
    enviadoPelaAmazon: true,
  },
};

/** Artigo → produtos (até 3 por artigo, 6 em páginas de compra). */
export const AFILIADOS_POR_ARTIGO: Record<string, string[]> = {
  "black-friday-suplementos": ["creatina-ftw-500g", "creatina-soldiers-250g"],
  "mega-oferta-prime-2026": ["creatina-ftw-500g", "creatina-soldiers-250g"],
  "creatina-para-hipertrofia": ["creatina-ftw-500g", "creatina-soldiers-250g"],
};

export const AVISO_AFILIADO =
  "Como associado da Amazon, recebo comissão por compras qualificadas feitas pelos links acima, sem custo a mais para você. Preço e disponibilidade mudam: confira na Amazon antes de comprar.";
