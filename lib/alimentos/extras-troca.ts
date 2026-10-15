/**
 * Alimentos da Troca Certa que a TACO não tem.
 *
 * A base do site é a TACO, e nada entra sem fonte. Estes três entram por
 * pedido do responsável (15/10/2026), cada um com a origem do número escrita
 * ao lado, que a tela mostra no lugar da linha "TACO: …":
 *
 * - TILÁPIA: o peixe mais comprado no Brasil não está na TACO. Os valores são
 *   do USDA FoodData Central (SR Legacy, domínio público): "Fish, tilapia,
 *   raw" (NDB 15261) e "Fish, tilapia, cooked, dry heat" (NDB 15262, que é a
 *   tilápia assada ou grelhada). A API do USDA não abriu nesta sessão; os
 *   números foram conferidos em duas reproduções independentes da mesma
 *   entrada (FatSecret e Triage/ReciPal), que batem entre si.
 *
 * - WHEY: não existe em tabela de composição; é produto de marca. O
 *   responsável escolheu como referência o whey concentrado da Growth, o mais
 *   comum entre os alunos, com os MESMOS números que o site já usa no Mata a
 *   Vontade (lib/mata-vontade/nutricao.ts): porção de 30 g com 123 kcal, 23 g
 *   de proteína, 2,9 g de carboidrato e 2,2 g de gordura. Sabores e lotes
 *   variam, e a tela diz isso.
 *
 * - GRANOLA: a TACO não tem. Mesmo valor que o Mata a Vontade já usa: USDA
 *   FoodData Central, "Cereals ready-to-eat, granola, homemade" (NDB 08037):
 *   489 kcal, 13,7 g de proteína, 53,9 g de carboidrato e 24,3 g de gordura
 *   por 100 g. Granola de pacote varia muito (açúcar, castanhas), e a tela
 *   manda conferir o rótulo.
 *
 * Não têm página em /alimentos (não são da base) nem medida da POF.
 */

import type { AlimentoEq } from "./equivalencia";

const WHEY_30G = { energia: 123, proteina: 23, carboidrato: 2.9, lipideos: 2.2 };
const por100 = (v: number) => Math.round((v * 100) / 30 * 10) / 10;

export const EXTRAS_TROCA: AlimentoEq[] = [
  {
    slug: "whey-protein-concentrado",
    nome: "Whey protein concentrado",
    categoria: "outros-industrializados",
    energia: por100(WHEY_30G.energia),
    proteina: por100(WHEY_30G.proteina),
    carboidrato: por100(WHEY_30G.carboidrato),
    lipideos: por100(WHEY_30G.lipideos),
    fibra: null,
    porcoes: [{ n: "1 dosador", g: 30 }],
    aliases: ["whey", "whey protein", "proteina em po", "suplemento de proteina"],
    fonte: "Rótulo de referência: whey concentrado Growth, 23 g de proteína em 30 g. Marcas e sabores variam: confira o seu.",
  },
  {
    slug: "granola",
    nome: "Granola",
    categoria: "cereais-e-derivados",
    energia: 489,
    proteina: 13.7,
    carboidrato: 53.9,
    lipideos: 24.3,
    fibra: null,
    aliases: ["granola", "granola tradicional", "granola caseira"],
    fonte: "USDA FoodData Central (EUA), granola caseira: a TACO não tem granola. A de pacote varia muito: confira o rótulo.",
  },
  {
    slug: "tilapia-file-grelhado",
    nome: "Tilápia, filé, grelhado",
    categoria: "pescados-e-frutos-do-mar",
    energia: 128,
    proteina: 26.15,
    carboidrato: 0,
    lipideos: 2.65,
    fibra: 0,
    aliases: ["tilapia", "tilapia grelhada", "tilapia assada", "file de tilapia", "peixe"],
    fonte: "USDA FoodData Central (EUA): a TACO não tem tilápia.",
  },
  {
    slug: "tilapia-file-cru",
    nome: "Tilápia, filé, cru",
    categoria: "pescados-e-frutos-do-mar",
    energia: 96,
    proteina: 20.08,
    carboidrato: 0,
    lipideos: 1.7,
    fibra: 0,
    aliases: ["tilapia crua", "file de tilapia cru"],
    fonte: "USDA FoodData Central (EUA): a TACO não tem tilápia.",
  },
];
