/**
 * Quais alimentos ganham página própria.
 *
 * Os 597 são todos PESQUISÁVEIS. Só estes são INDEXÁVEIS — a diferença é a
 * decisão de SEO mais importante do projeto.
 *
 * Publicar 597 páginas porque existem 597 registros criaria centenas de
 * páginas quase idênticas, competindo entre si por consultas parecidas, e o
 * efeito conhecido disso é o site inteiro perder força — não só as páginas
 * fracas. "Pêssego, em calda, enlatado" tem dado tão bom quanto o feijão e
 * não tem quem procure.
 *
 * Esta lista de partida é curadoria editorial, baseada em duas coisas
 * verificáveis: o que o brasileiro come todo dia, e o que os artigos e as
 * ferramentas do site já citam. Ela deve crescer com DADO, não com palpite —
 * o Search Console e a busca interna dizem o que as pessoas procuram e não
 * acham, e é isso que promove o próximo alimento.
 *
 * Todo slug aqui precisa existir na base, e o teste reprova se não existir.
 */

export const ALIMENTOS_INDEXAVEIS: string[] = [
  // ── O prato brasileiro ──────────────────────────────────────────────────
  "arroz-tipo-1-cozido",
  "arroz-integral-cozido",
  "feijao-carioca-cozido",
  "feijao-preto-cozido",
  "macarrao-instantaneo",

  // ── Proteínas ───────────────────────────────────────────────────────────
  "frango-peito-sem-pele-grelhado",
  "frango-peito-sem-pele-cru",
  "carne-bovina-patinho-sem-gordura-grelhado",
  "carne-bovina-acem-moido-cozido",
  "ovo-de-galinha-inteiro-cozido-10minutos",
  "ovo-de-galinha-inteiro-cru",
  "pescada-file-cru",
  "atum-conserva-em-oleo",
  "sardinha-conserva-em-oleo",

  // ── Carboidratos e tubérculos ───────────────────────────────────────────
  "batata-inglesa-cozida",
  "batata-doce-cozida",
  "mandioca-cozida",
  "pao-trigo-frances",
  "aveia-flocos-crua",
  "tapioca-com-manteiga",

  // ── Leguminosas e vegetais ──────────────────────────────────────────────
  "lentilha-cozida",
  "grao-de-bico-cru",
  "soja-farinha",
  "brocolis-cozido",
  "cenoura-crua",
  "tomate-com-semente-cru",
  "alface-crespa-crua",

  // ── Frutas ──────────────────────────────────────────────────────────────
  "banana-prata-crua",
  "banana-nanica-crua",
  "maca-fuji-com-casca-crua",
  "mamao-formosa-cru",
  "laranja-pera-crua",
  "abacate-cru",
  "melancia-crua",

  // ── Lácteos ─────────────────────────────────────────────────────────────
  "leite-de-vaca-integral",
  "iogurte-natural",
  "queijo-minas-frescal",
  "queijo-mozarela",
  "queijo-requeijao-cremoso",

  // ── Gorduras e oleaginosas ──────────────────────────────────────────────
  "azeite-de-oliva-extra-virgem",
  "amendoim-torrado-salgado",
  "castanha-do-brasil-crua",
];
