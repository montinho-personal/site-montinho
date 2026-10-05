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
  /** Rótulo honesto e verificável (tamanho, vendedor), nunca "mais vendida" ou preço. */
  destaque: string;
};

export const PRODUTOS_AFILIADOS: Record<string, ProdutoAfiliado> = {
  "creatina-ftw-500g": {
    id: "creatina-ftw-500g",
    marca: "FTW",
    nome: "Creatina monohidratada 500 g (refil), sem sabor",
    url: "https://www.amazon.com.br/dp/B0DH64LKFK?tag=montinho-20",
    vendedor: "loja oficial da marca",
    enviadoPelaAmazon: true,
    destaque: "Maior embalagem",
  },
  "creatina-soldiers-250g": {
    id: "creatina-soldiers-250g",
    marca: "Soldiers Nutrition",
    nome: "Creatina monohidratada 250 g, sabor natural",
    url: "https://link.amazon/B0aiNDs4P",
    vendedor: "loja oficial da marca",
    enviadoPelaAmazon: true,
    destaque: "Menor embalagem, para testar",
  },
  "creatina-atlhetica-300g": {
    id: "creatina-atlhetica-300g",
    marca: "Atlhetica Nutrition",
    nome: "Creatina monohidratada 300 g, em pó",
    url: "https://link.amazon/B0bJRv77U",
    vendedor: "Amazon",
    enviadoPelaAmazon: true,
    destaque: "Vendida pela Amazon",
  },
  "whey-soldiers-1kg": {
    id: "whey-soldiers-1kg",
    marca: "Soldiers Nutrition",
    nome: "Whey protein concentrado 1 kg, sabor natural",
    url: "https://link.amazon/B04Mb4lca",
    vendedor: "loja oficial da marca",
    enviadoPelaAmazon: true,
    destaque: "Whey 1 kg, sabor natural",
  },
  "whey-ftw-1kg": {
    id: "whey-ftw-1kg",
    marca: "FTW",
    nome: "Whey protein concentrado 1 kg (refil), sabor leite",
    url: "https://link.amazon/B0er2An2b",
    vendedor: "loja oficial da marca",
    enviadoPelaAmazon: true,
    destaque: "Whey 1 kg, sabor leite",
  },
  "whey-soldiers-elite-1kg": {
    id: "whey-soldiers-elite-1kg",
    marca: "Soldiers Nutrition",
    nome: "Whey protein concentrado 80% 1 kg, sabor cookies",
    url: "https://link.amazon/B035wwBjS",
    vendedor: "loja oficial da marca",
    enviadoPelaAmazon: true,
    destaque: "Whey 1 kg, sabor cookies",
  },
  "pre-treino-3vs-360g": {
    id: "pre-treino-3vs-360g",
    marca: "3VS Nutrition",
    nome: "Pré-treino 360 g, sabor citrus (200 mg de cafeína por dose)",
    url: "https://link.amazon/B09fqwvEP",
    vendedor: "Amazon",
    enviadoPelaAmazon: true,
    destaque: "200 mg de cafeína",
  },
  "pre-treino-ftw-sem-cafeina-300g": {
    id: "pre-treino-ftw-sem-cafeina-300g",
    marca: "FTW",
    nome: "Pré-treino sem cafeína 300 g, sabor energético",
    url: "https://link.amazon/B01TILusf",
    vendedor: "loja oficial da marca",
    enviadoPelaAmazon: true,
    destaque: "Sem cafeína",
  },
  "pre-treino-mu-500g": {
    id: "pre-treino-mu-500g",
    marca: "+Mu",
    nome: "Pré-treino 500 g, sabor manga (150 mg de cafeína por dose)",
    url: "https://link.amazon/B0in9lqDx",
    vendedor: "Amazon",
    enviadoPelaAmazon: true,
    destaque: "150 mg de cafeína",
  },
  "barra-bold-cookies-12un": {
    id: "barra-bold-cookies-12un",
    marca: "Bold",
    nome: "Barra de proteína 40 g, cookies e cream, caixa com 12 (14 g de proteína cada)",
    url: "https://link.amazon/B0887cu0W",
    vendedor: "Amazon",
    enviadoPelaAmazon: true,
    destaque: "14 g de proteína por barra",
  },
  "barra-nutry-crispy-12un": {
    id: "barra-nutry-crispy-12un",
    marca: "Nutry",
    nome: "Barra de proteína crispy 30 g, trufa de avelã, caixa com 12 (9 g de proteína cada)",
    url: "https://link.amazon/B0iMncSCp",
    vendedor: "Amazon",
    enviadoPelaAmazon: true,
    destaque: "Menor, 9 g de proteína",
  },
  "barra-supino-amendoim-9un": {
    id: "barra-supino-amendoim-9un",
    marca: "Banana Brasil",
    nome: "Barra de proteína 46 g, amendoim com caramelo, caixa com 9 (16 g de proteína cada)",
    url: "https://link.amazon/B0dsMOs3G",
    vendedor: "Amazon",
    enviadoPelaAmazon: true,
    destaque: "16 g de proteína por barra",
  },
};

/** Artigo → produtos (até 3 por artigo, 6 em páginas de compra). */
export const AFILIADOS_POR_ARTIGO: Record<string, string[]> = {
  "black-friday-suplementos": ["creatina-ftw-500g", "creatina-soldiers-250g", "creatina-atlhetica-300g", "whey-soldiers-1kg", "whey-ftw-1kg", "pre-treino-3vs-360g"],
  "mega-oferta-prime-2026": ["creatina-ftw-500g", "creatina-soldiers-250g", "creatina-atlhetica-300g", "whey-soldiers-1kg", "whey-ftw-1kg", "whey-soldiers-elite-1kg"],
  "creatina-para-hipertrofia": ["creatina-ftw-500g", "creatina-soldiers-250g", "creatina-atlhetica-300g"],
  // whey-protein-engorda fica de fora: é controle do teste de intenção.
  "whey-protein-como-tomar": ["whey-soldiers-1kg", "whey-ftw-1kg", "whey-soldiers-elite-1kg"],
  "whey-concentrado-vs-isolado-vs-hidrolisado": ["whey-soldiers-1kg", "whey-ftw-1kg", "whey-soldiers-elite-1kg"],
  "pre-treino-vale-a-pena": ["pre-treino-3vs-360g", "pre-treino-mu-500g", "pre-treino-ftw-sem-cafeina-300g"],
  "barrinha-de-proteina-vale-a-pena": ["barra-supino-amendoim-9un", "barra-bold-cookies-12un", "barra-nutry-crispy-12un"],
};

export const AVISO_AFILIADO =
  "Como associado da Amazon, recebo comissão por compras qualificadas feitas pelos links acima, sem custo a mais para você. Preço e disponibilidade mudam: confira na Amazon antes de comprar.";
