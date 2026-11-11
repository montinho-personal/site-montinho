/**
 * Oferta relâmpago: um aviso só, com hora para acabar.
 *
 * Mesmas regras dos cartões de afiliado (lib/afiliados.ts):
 * - SEM PREÇO NA TELA. O Acordo Operacional do Associados só permite preço
 *   vindo da API de produtos. O aviso diz que há desconto e leva à Amazon.
 * - SUPLEMENTO SÓ DE LOJA OFICIAL OU DA AMAZON, conferido por print do
 *   "Vendido por". Sem o print, `vendedor` fica null e o aviso não sobe.
 * - Rótulo verificável no print (tamanho, "Escolha da Amazon", Prime), nunca
 *   "mais vendida" nem promessa de resultado.
 *
 * O aviso some sozinho em `ate`: depois disso nem chega a montar.
 */
export type PromoRelampago = {
  id: string;
  /** Caminho do link rastreado: /oferta/<apelido>. */
  apelido: string;
  /** Artigos e ferramentas onde a oferta também entra no corpo da página, e o aviso aparece mais cedo. */
  paginasDoTema: RegExp;
  marca: string;
  produto: string;
  url: string;
  /** Fim da oferta, como a Amazon mostrava ("Termina em…"), em horário de Brasília. */
  ate: string;
  vendedor: "loja oficial da marca" | "Amazon" | null;
  /** Liga a oferta sem o print do "Vendido por": o selo de vendedor não aparece. Decisão do Montinho, caso a caso. */
  semSeloDeVendedor?: boolean;
  selos: string[];
  /** Por que esse produto: fato, com o artigo que sustenta. */
  argumento: string;
  /** Preço da própria loja da marca (não da Amazon), com hora e fonte do print. */
  comparacao?: { texto: string; fonte: string };
  artigo: { href: string; nome: string };
};

export const PROMO_ATIVA: PromoRelampago | null = {
  id: "creatina-growth-250g-2026-11-11",
  apelido: "creatina-growth",
  paginasDoTema: /creatina|suplement|whey|hipertrofia|ganhar-massa|massa-muscular/,
  marca: "Growth Supplements",
  produto: "Creatina monohidratada 250 g, sem sabor",
  url: "https://link.amazon/B0cLtgysF",
  ate: "2026-11-11T23:54:00-03:00",
  vendedor: null,
  // 11/11/2026: o Montinho mandou ligar sem o print do vendedor, só com "Escolha da Amazon" (visto no print do produto).
  semSeloDeVendedor: true,
  selos: ["Escolha da Amazon", "Entrega Prime"],
  argumento:
    "Creatina monohidratada pura, o suplemento com mais estudo para força e ganho de massa. O pote de 250 g rende 50 doses de 5 g.",
  comparacao: {
    texto: "No site oficial da Growth, este pote sai por R$ 34,90 hoje, mais frete. Pelo link, na Amazon, sai por menos.",
    fonte: "Preço do site da Growth Supplements visto em 11/11/2026, às 9h59.",
  },
  artigo: { href: "/blog/creatina-para-hipertrofia", nome: "Por que creatina? Veja o guia" },
};

/** Onde o aviso não entra: áreas de trabalho, landing pages e o app. */
export const ROTAS_SEM_PROMO = [/^\/crm/, /^\/lp\//, /^\/l\//, /^\/r\//, /^\/app/, /^\/busca/];

export const promoValida = (p: PromoRelampago | null, agora = Date.now()): p is PromoRelampago =>
  !!p && (p.vendedor !== null || !!p.semSeloDeVendedor) && agora < Date.parse(p.ate);

/** Canais aceitos no link rastreado (?c=). Qualquer outro vira "outro". */
export const CANAIS_OFERTA = ["popup", "artigo", "ferramenta", "ig-stories", "ig-bio", "whatsapp", "whatsapp-status", "youtube", "outro"] as const;

/** Link rastreado da oferta: conta o clique (página e canal) e segue para a Amazon. */
export const linkOferta = (p: PromoRelampago, canal: (typeof CANAIS_OFERTA)[number], pagina?: string) =>
  `/oferta/${p.apelido}?c=${canal}${pagina ? `&de=${encodeURIComponent(pagina)}` : ""}`;

export const promoPorApelido = (a: string): PromoRelampago | null =>
  PROMO_ATIVA && (PROMO_ATIVA.apelido === a || PROMO_ATIVA.id === a) ? PROMO_ATIVA : null;
