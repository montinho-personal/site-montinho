/**
 * O motor de equivalência de alimentos ("Troca Certa").
 *
 * A PERGUNTA
 *
 * "Se eu tirar isso do prato, quanto coloco daquilo?" — 150 g de arroz
 * cozido viram quanto de batata-doce, mantendo o mesmo carboidrato? A conta
 * é uma regra de três, e é justamente por ser simples que ela costuma sair
 * errada na internet: trocam arroz cru por batata cozida, igualam calorias
 * entre arroz e chocolate, ou devolvem 3 kg de alface porque a aritmética
 * fecha.
 *
 * O QUE ESTE MÓDULO GARANTE
 *
 * 1. A conta é determinística e só usa números da base (lib/alimentos, TACO).
 *    Nenhum valor é digitado aqui: este arquivo decide QUEM pode trocar com
 *    QUEM e COMO arredondar, nunca quanto nutriente um alimento tem.
 * 2. Troca só dentro do mesmo grupo culinário, numa lista curada por slug.
 *    A taxonomia da TACO (15 categorias) é de laboratório, não de prato:
 *    "cereais e derivados" junta arroz e biscoito recheado. Por isso os
 *    grupos de troca são uma camada editorial à parte, e a categoria da
 *    TACO continua intacta na base.
 * 3. O estado do alimento é respeitado. Quem pesou o arroz cru recebe
 *    equivalentes pesados crus; quem pesou o cozido, cozidos ou prontos.
 * 4. Sem falsa precisão: gramas arredondadas para passos práticos, e o
 *    nutriente igualado é recalculado com a quantidade JÁ arredondada — o
 *    que a tela mostra é o que a pessoa vai comer, não o ideal teórico.
 * 5. Troca que não serve não aparece: quantidade absurda, nutriente nulo
 *    ou ausente, alimento de origem que não é fonte do nutriente escolhido.
 *
 * O motor não sabe nada de interface: recebe alimentos no formato enxuto
 * (`AlimentoEq`) e devolve dados. A ferramenta, o comparador, as páginas de
 * alimento e o Pergunte ao Montinho podem usar o mesmo motor.
 */

import type { Categoria } from "./tipos";

/* ───────────────────────── Entrada ───────────────────────── */

/** O mínimo que o motor precisa de um alimento. `null` = não analisado. */
export interface AlimentoEq {
  slug: string;
  nome: string;
  categoria: Categoria;
  /** Por 100 g. */
  energia: number | null;
  proteina: number | null;
  carboidrato: number | null;
  lipideos: number | null;
  fibra: number | null;
  /** Medidas caseiras com fonte (POF/IBGE), quando existem. */
  porcoes?: { n: string; g: number }[];
  /** Como as pessoas escrevem — só para a busca. */
  aliases?: string[];
  /** Origem do número quando NÃO é a TACO (lib/alimentos/extras-troca.ts). */
  fonte?: string;
}

export type Criterio = "carboidrato" | "proteina" | "energia";

export const CRITERIOS: { id: Criterio; nome: string; curto: string; unidade: "g" | "kcal" }[] = [
  { id: "carboidrato", nome: "Carboidratos", curto: "carboidrato", unidade: "g" },
  { id: "proteina", nome: "Proteína", curto: "proteína", unidade: "g" },
  { id: "energia", nome: "Calorias", curto: "calorias", unidade: "kcal" },
];

export const nomeCriterio = (c: Criterio) => CRITERIOS.find((x) => x.id === c)!;

/* ───────────────────────── Grupos de troca ───────────────────────── */

export type GrupoTroca = "carboidratos" | "leguminosas" | "proteinas" | "laticinios" | "frutas" | "gorduras";

/**
 * "pronto" = pesado como vai ao prato (cozido, grelhado, assado, pão, fruta).
 * "cru"    = pesado antes de cozinhar (arroz cru, macarrão cru, carne crua).
 */
export type Estado = "pronto" | "cru";

export interface GrupoInfo {
  nome: string;
  /** O critério que faz sentido por padrão para o grupo. */
  criterioPadrao: Criterio;
  /** Limites práticos da quantidade equivalente, em gramas. */
  min: number;
  max: number;
}

export const GRUPOS: Record<GrupoTroca, GrupoInfo> = {
  carboidratos: { nome: "Carboidratos (arroz, batatas, massas, pães)", criterioPadrao: "carboidrato", min: 15, max: 600 },
  leguminosas: { nome: "Leguminosas (feijões e lentilha)", criterioPadrao: "carboidrato", min: 15, max: 600 },
  proteinas: { nome: "Proteínas (carnes, aves, peixes, ovos)", criterioPadrao: "proteina", min: 15, max: 500 },
  laticinios: { nome: "Leite e derivados", criterioPadrao: "proteina", min: 10, max: 600 },
  frutas: { nome: "Frutas", criterioPadrao: "carboidrato", min: 20, max: 600 },
  gorduras: { nome: "Gorduras e oleaginosas", criterioPadrao: "energia", min: 3, max: 120 },
};

export interface MembroTroca {
  slug: string;
  grupo: GrupoTroca;
  estado: Estado;
  /** Nota curta exibida junto do resultado, quando o alimento pede ressalva. */
  nota?: string;
}

/**
 * Os membros de cada grupo, na ordem de familiaridade no prato brasileiro.
 * A ordem é a do resultado: o motor não reordena por "score".
 *
 * Só entra alimento com macronutrientes analisados na TACO e com preparo
 * que alguém de fato come. Ficaram de fora, de propósito: biscoitos, bolos
 * e salgados (não são troca de prato), leite de vaca fluido (a TACO está
 * reavaliando a análise e não publica valores nesta edição) e verduras de
 * pouco carboidrato no grupo de carboidratos (couve-flor e brócolis entram
 * só na troca com alimento escolhido, onde a tela mostra que não equivalem).
 */
export const MEMBROS: MembroTroca[] = [
  /* Carboidratos — prontos */
  { slug: "arroz-tipo-1-cozido", grupo: "carboidratos", estado: "pronto" },
  { slug: "arroz-integral-cozido", grupo: "carboidratos", estado: "pronto" },
  { slug: "batata-inglesa-cozida", grupo: "carboidratos", estado: "pronto" },
  { slug: "batata-doce-cozida", grupo: "carboidratos", estado: "pronto" },
  { slug: "mandioca-cozida", grupo: "carboidratos", estado: "pronto" },
  { slug: "cuscuz-de-milho-cozido-com-sal", grupo: "carboidratos", estado: "pronto" },
  { slug: "pao-trigo-frances", grupo: "carboidratos", estado: "pronto" },
  { slug: "pao-trigo-forma-integral", grupo: "carboidratos", estado: "pronto" },
  { slug: "batata-baroa-cozida", grupo: "carboidratos", estado: "pronto" },
  { slug: "cara-cozido", grupo: "carboidratos", estado: "pronto" },
  { slug: "abobora-cabotian-cozida", grupo: "carboidratos", estado: "pronto" },
  { slug: "polenta-pre-cozida", grupo: "carboidratos", estado: "pronto" },
  { slug: "milho-verde-enlatado-drenado", grupo: "carboidratos", estado: "pronto" },
  { slug: "granola", grupo: "carboidratos", estado: "pronto" },
  { slug: "aveia-flocos-crua", grupo: "carboidratos", estado: "pronto", nota: "Aveia em flocos, pesada seca, como se come." },
  { slug: "tapioca-com-manteiga", grupo: "carboidratos", estado: "pronto", nota: "Na TACO, a tapioca vem pronta com manteiga: tem mais gordura que a goma pura." },
  { slug: "fecula-de-mandioca", grupo: "carboidratos", estado: "pronto", nota: "Fécula (goma) de mandioca seca, pesada antes de virar tapioca." },
  /* Carboidratos — crus (pesados antes de cozinhar) */
  { slug: "arroz-tipo-1-cru", grupo: "carboidratos", estado: "cru" },
  { slug: "arroz-integral-cru", grupo: "carboidratos", estado: "cru" },
  { slug: "macarrao-trigo-cru", grupo: "carboidratos", estado: "cru" },
  { slug: "batata-inglesa-crua", grupo: "carboidratos", estado: "cru" },
  { slug: "batata-doce-crua", grupo: "carboidratos", estado: "cru" },
  { slug: "mandioca-crua", grupo: "carboidratos", estado: "cru" },
  { slug: "milho-fuba-cru", grupo: "carboidratos", estado: "cru" },
  { slug: "macarrao-trigo-cru-com-ovos", grupo: "carboidratos", estado: "cru" },
  { slug: "batata-baroa-crua", grupo: "carboidratos", estado: "cru" },
  { slug: "abobora-cabotian-crua", grupo: "carboidratos", estado: "cru" },
  { slug: "cara-cru", grupo: "carboidratos", estado: "cru" },
  { slug: "inhame-cru", grupo: "carboidratos", estado: "cru" },

  /* Leguminosas */
  { slug: "feijao-carioca-cozido", grupo: "leguminosas", estado: "pronto" },
  { slug: "feijao-preto-cozido", grupo: "leguminosas", estado: "pronto" },
  { slug: "lentilha-cozida", grupo: "leguminosas", estado: "pronto" },
  { slug: "feijao-fradinho-cozido", grupo: "leguminosas", estado: "pronto" },
  { slug: "feijao-jalo-cozido", grupo: "leguminosas", estado: "pronto" },
  { slug: "feijao-roxo-cozido", grupo: "leguminosas", estado: "pronto" },
  { slug: "ervilha-enlatada-drenada", grupo: "leguminosas", estado: "pronto" },
  { slug: "soja-queijo-tofu", grupo: "leguminosas", estado: "pronto" },
  { slug: "feijao-carioca-cru", grupo: "leguminosas", estado: "cru" },
  { slug: "feijao-preto-cru", grupo: "leguminosas", estado: "cru" },
  { slug: "lentilha-crua", grupo: "leguminosas", estado: "cru" },
  { slug: "grao-de-bico-cru", grupo: "leguminosas", estado: "cru" },

  /* Proteínas — prontas */
  { slug: "frango-peito-sem-pele-grelhado", grupo: "proteinas", estado: "pronto" },
  { slug: "frango-peito-sem-pele-cozido", grupo: "proteinas", estado: "pronto" },
  { slug: "frango-coxa-sem-pele-cozida", grupo: "proteinas", estado: "pronto" },
  { slug: "carne-bovina-patinho-sem-gordura-grelhado", grupo: "proteinas", estado: "pronto" },
  { slug: "carne-bovina-acem-moido-cozido", grupo: "proteinas", estado: "pronto" },
  { slug: "carne-bovina-musculo-sem-gordura-cozido", grupo: "proteinas", estado: "pronto" },
  { slug: "carne-bovina-file-mingnon-sem-gordura-grelhado", grupo: "proteinas", estado: "pronto" },
  { slug: "carne-bovina-contra-file-sem-gordura-grelhado", grupo: "proteinas", estado: "pronto" },
  { slug: "carne-bovina-lagarto-cozido", grupo: "proteinas", estado: "pronto" },
  { slug: "porco-lombo-assado", grupo: "proteinas", estado: "pronto" },
  { slug: "ovo-de-galinha-inteiro-cozido-10minutos", grupo: "proteinas", estado: "pronto" },
  { slug: "ovo-de-galinha-clara-cozida-10minutos", grupo: "proteinas", estado: "pronto" },
  { slug: "atum-conserva-em-oleo", grupo: "proteinas", estado: "pronto" },
  { slug: "sardinha-conserva-em-oleo", grupo: "proteinas", estado: "pronto" },
  { slug: "ovo-de-galinha-inteiro-frito", grupo: "proteinas", estado: "pronto" },
  { slug: "sardinha-assada", grupo: "proteinas", estado: "pronto" },
  { slug: "merluza-file-assado", grupo: "proteinas", estado: "pronto" },
  { slug: "tilapia-file-grelhado", grupo: "proteinas", estado: "pronto" },
  { slug: "whey-protein-concentrado", grupo: "proteinas", estado: "pronto" },
  { slug: "salmao-sem-pele-fresco-grelhado", grupo: "proteinas", estado: "pronto" },
  /* Proteínas — cruas (pesadas antes de cozinhar) */
  { slug: "frango-peito-sem-pele-cru", grupo: "proteinas", estado: "cru" },
  { slug: "frango-coxa-sem-pele-crua", grupo: "proteinas", estado: "cru" },
  { slug: "carne-bovina-patinho-sem-gordura-cru", grupo: "proteinas", estado: "cru" },
  { slug: "carne-bovina-acem-moido-cru", grupo: "proteinas", estado: "cru" },
  { slug: "carne-bovina-musculo-sem-gordura-cru", grupo: "proteinas", estado: "cru" },
  { slug: "carne-bovina-file-mingnon-sem-gordura-cru", grupo: "proteinas", estado: "cru" },
  { slug: "porco-lombo-cru", grupo: "proteinas", estado: "cru" },
  { slug: "ovo-de-galinha-inteiro-cru", grupo: "proteinas", estado: "cru" },
  { slug: "atum-fresco-cru", grupo: "proteinas", estado: "cru" },
  { slug: "merluza-file-cru", grupo: "proteinas", estado: "cru" },
  { slug: "tilapia-file-cru", grupo: "proteinas", estado: "cru" },
  { slug: "salmao-sem-pele-fresco-cru", grupo: "proteinas", estado: "cru" },

  /* Leite e derivados */
  { slug: "iogurte-natural", grupo: "laticinios", estado: "pronto" },
  { slug: "iogurte-natural-desnatado", grupo: "laticinios", estado: "pronto" },
  { slug: "queijo-minas-frescal", grupo: "laticinios", estado: "pronto" },
  { slug: "queijo-mozarela", grupo: "laticinios", estado: "pronto" },
  { slug: "queijo-ricota", grupo: "laticinios", estado: "pronto" },
  { slug: "queijo-prato", grupo: "laticinios", estado: "pronto" },

  /* Frutas */
  { slug: "banana-prata-crua", grupo: "frutas", estado: "pronto" },
  { slug: "banana-nanica-crua", grupo: "frutas", estado: "pronto" },
  { slug: "maca-fuji-com-casca-crua", grupo: "frutas", estado: "pronto" },
  { slug: "mamao-formosa-cru", grupo: "frutas", estado: "pronto" },
  { slug: "mamao-papaia-cru", grupo: "frutas", estado: "pronto" },
  { slug: "laranja-pera-crua", grupo: "frutas", estado: "pronto" },
  { slug: "manga-tommy-atkins-crua", grupo: "frutas", estado: "pronto" },
  { slug: "uva-italia-crua", grupo: "frutas", estado: "pronto" },
  { slug: "abacaxi-cru", grupo: "frutas", estado: "pronto" },
  { slug: "pera-williams-crua", grupo: "frutas", estado: "pronto" },
  { slug: "goiaba-vermelha-com-casca-crua", grupo: "frutas", estado: "pronto" },
  { slug: "melancia-crua", grupo: "frutas", estado: "pronto" },
  { slug: "melao-cru", grupo: "frutas", estado: "pronto" },
  { slug: "morango-cru", grupo: "frutas", estado: "pronto" },
  { slug: "tangerina-ponca-crua", grupo: "frutas", estado: "pronto" },
  { slug: "kiwi-cru", grupo: "frutas", estado: "pronto" },

  /* Gorduras e oleaginosas */
  { slug: "azeite-de-oliva-extra-virgem", grupo: "gorduras", estado: "pronto" },
  { slug: "oleo-de-soja", grupo: "gorduras", estado: "pronto" },
  /* Requeijão: tem mais gordura que proteína — troca de gordura, não de queijo. */
  { slug: "queijo-requeijao-cremoso", grupo: "gorduras", estado: "pronto" },
  { slug: "manteiga-com-sal", grupo: "gorduras", estado: "pronto" },
  { slug: "castanha-do-brasil-crua", grupo: "gorduras", estado: "pronto" },
  { slug: "castanha-de-caju-torrada-salgada", grupo: "gorduras", estado: "pronto" },
  { slug: "amendoa-torrada-salgada", grupo: "gorduras", estado: "pronto" },
  { slug: "amendoim-torrado-salgado", grupo: "gorduras", estado: "pronto" },
  { slug: "abacate-cru", grupo: "gorduras", estado: "pronto" },
];

export const MEMBRO_POR_SLUG = new Map(MEMBROS.map((m) => [m.slug, m]));

/* ───────────────────────── Nomes e apelidos ───────────────────────── */

/**
 * O nome como se fala, para os alimentos da lista curada. A TACO escreve
 * em ordem de tabela ("Batata, doce, cozida"; "Pão, trigo, francês"), o que
 * é ótimo para conferir na fonte e ruim de ler num cartão. A tela mostra
 * este nome em destaque e o da TACO em letra pequena, para continuar
 * rastreável. Também corrige o erro de grafia da própria TACO ("mingnon").
 */
export const NOME_EXIBICAO: Record<string, string> = {
  "arroz-tipo-1-cozido": "Arroz branco cozido",
  "arroz-integral-cozido": "Arroz integral cozido",
  "batata-inglesa-cozida": "Batata inglesa cozida",
  "batata-doce-cozida": "Batata-doce cozida",
  "mandioca-cozida": "Mandioca cozida",
  "cuscuz-de-milho-cozido-com-sal": "Cuscuz de milho cozido",
  "pao-trigo-frances": "Pão francês",
  "pao-trigo-forma-integral": "Pão de forma integral",
  "batata-baroa-cozida": "Mandioquinha (batata-baroa) cozida",
  "cara-cozido": "Cará cozido",
  "abobora-cabotian-cozida": "Abóbora cozida",
  "abobora-cabotian-crua": "Abóbora crua",
  "polenta-pre-cozida": "Polenta pré-cozida",
  "milho-verde-enlatado-drenado": "Milho verde em lata, escorrido",
  "aveia-flocos-crua": "Aveia em flocos",
  "tapioca-com-manteiga": "Tapioca com manteiga",
  "fecula-de-mandioca": "Goma de tapioca (fécula de mandioca)",
  "arroz-tipo-1-cru": "Arroz branco cru",
  "arroz-integral-cru": "Arroz integral cru",
  "macarrao-trigo-cru": "Macarrão cru",
  "batata-inglesa-crua": "Batata inglesa crua",
  "batata-doce-crua": "Batata-doce crua",
  "mandioca-crua": "Mandioca crua",
  "milho-fuba-cru": "Fubá de milho",
  "macarrao-trigo-cru-com-ovos": "Macarrão com ovos cru",
  "batata-baroa-crua": "Mandioquinha (batata-baroa) crua",
  "cara-cru": "Cará cru",
  "inhame-cru": "Inhame cru",
  "feijao-carioca-cozido": "Feijão carioca cozido",
  "feijao-preto-cozido": "Feijão preto cozido",
  "lentilha-cozida": "Lentilha cozida",
  "feijao-fradinho-cozido": "Feijão-fradinho cozido",
  "feijao-jalo-cozido": "Feijão jalo cozido",
  "feijao-roxo-cozido": "Feijão roxo cozido",
  "ervilha-enlatada-drenada": "Ervilha em lata, escorrida",
  "soja-queijo-tofu": "Tofu",
  "feijao-carioca-cru": "Feijão carioca cru",
  "feijao-preto-cru": "Feijão preto cru",
  "lentilha-crua": "Lentilha crua",
  "grao-de-bico-cru": "Grão-de-bico cru",
  "frango-peito-sem-pele-grelhado": "Peito de frango grelhado",
  "frango-peito-sem-pele-cozido": "Peito de frango cozido",
  "frango-coxa-sem-pele-cozida": "Coxa de frango sem pele, cozida",
  "carne-bovina-patinho-sem-gordura-grelhado": "Patinho grelhado",
  "carne-bovina-acem-moido-cozido": "Carne moída (acém) cozida",
  "carne-bovina-musculo-sem-gordura-cozido": "Músculo cozido",
  "carne-bovina-file-mingnon-sem-gordura-grelhado": "Filé-mignon grelhado",
  "carne-bovina-contra-file-sem-gordura-grelhado": "Contrafilé grelhado",
  "carne-bovina-lagarto-cozido": "Lagarto cozido",
  "porco-lombo-assado": "Lombo de porco assado",
  "ovo-de-galinha-inteiro-cozido-10minutos": "Ovo cozido",
  "ovo-de-galinha-clara-cozida-10minutos": "Clara de ovo cozida",
  "atum-conserva-em-oleo": "Atum em óleo (lata)",
  "sardinha-conserva-em-oleo": "Sardinha em óleo (lata)",
  "ovo-de-galinha-inteiro-frito": "Ovo frito",
  "sardinha-assada": "Sardinha assada",
  "merluza-file-assado": "Filé de merluza assado",
  "salmao-sem-pele-fresco-grelhado": "Salmão grelhado",
  "frango-peito-sem-pele-cru": "Peito de frango cru",
  "frango-coxa-sem-pele-crua": "Coxa de frango sem pele, crua",
  "carne-bovina-patinho-sem-gordura-cru": "Patinho cru",
  "carne-bovina-acem-moido-cru": "Carne moída (acém) crua",
  "carne-bovina-musculo-sem-gordura-cru": "Músculo cru",
  "carne-bovina-file-mingnon-sem-gordura-cru": "Filé-mignon cru",
  "porco-lombo-cru": "Lombo de porco cru",
  "ovo-de-galinha-inteiro-cru": "Ovo cru",
  "atum-fresco-cru": "Atum fresco cru",
  "merluza-file-cru": "Filé de merluza cru",
  "tilapia-file-grelhado": "Filé de tilápia grelhado",
  "tilapia-file-cru": "Filé de tilápia cru",
  "whey-protein-concentrado": "Whey protein concentrado",
  granola: "Granola",
  "salmao-sem-pele-fresco-cru": "Salmão cru",
  "iogurte-natural": "Iogurte natural",
  "iogurte-natural-desnatado": "Iogurte natural desnatado",
  "queijo-minas-frescal": "Queijo minas frescal",
  "queijo-mozarela": "Queijo muçarela",
  "queijo-ricota": "Ricota",
  "queijo-prato": "Queijo prato",
  "banana-prata-crua": "Banana-prata",
  "banana-nanica-crua": "Banana-nanica",
  "maca-fuji-com-casca-crua": "Maçã fuji com casca",
  "mamao-formosa-cru": "Mamão formosa",
  "mamao-papaia-cru": "Mamão papaia",
  "laranja-pera-crua": "Laranja-pera",
  "manga-tommy-atkins-crua": "Manga tommy",
  "uva-italia-crua": "Uva itália",
  "abacaxi-cru": "Abacaxi",
  "pera-williams-crua": "Pera williams",
  "goiaba-vermelha-com-casca-crua": "Goiaba vermelha",
  "melancia-crua": "Melancia",
  "melao-cru": "Melão",
  "morango-cru": "Morango",
  "tangerina-ponca-crua": "Tangerina poncã",
  "kiwi-cru": "Kiwi",
  "azeite-de-oliva-extra-virgem": "Azeite de oliva extravirgem",
  "oleo-de-soja": "Óleo de soja",
  "queijo-requeijao-cremoso": "Requeijão cremoso",
  "manteiga-com-sal": "Manteiga com sal",
  "castanha-do-brasil-crua": "Castanha-do-pará",
  "castanha-de-caju-torrada-salgada": "Castanha de caju torrada e salgada",
  "amendoa-torrada-salgada": "Amêndoa torrada e salgada",
  "amendoim-torrado-salgado": "Amendoim torrado e salgado",
  "abacate-cru": "Abacate",
};

/** O nome de tela de qualquer alimento: o da lista curada, ou o da TACO em forma de frase. */
export function nomeExibicao(a: { slug: string; nome: string }): string {
  const n = NOME_EXIBICAO[a.slug];
  if (n) return n;
  const frase = a.nome
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\/(\d+)\s*minutos?/gi, " por $1 minutos")
    .replace(/mingnon/gi, "mignon")
    .replace(/\s+/g, " ");
  return frase.charAt(0).toUpperCase() + frase.slice(1).toLowerCase();
}

/**
 * Como as pessoas procuram estes alimentos. "peito de frango" não achava
 * nada (o "de" não está no nome da TACO) e "frango" listava asa e coração
 * antes do peito. Os apelidos entram só na busca desta ferramenta.
 */
export const APELIDOS: Record<string, string[]> = {
  "abobora-cabotian-cozida": ["abobora", "abobora cozida", "abobora cabotia", "abobora japonesa", "cabotia", "kabocha"],
  "arroz-tipo-1-cozido": ["arroz", "arroz branco", "arroz cozido"],
  "batata-doce-cozida": ["batata doce"],
  "batata-inglesa-cozida": ["batata", "batata cozida"],
  "pao-trigo-frances": ["pao", "pao frances", "pãozinho"],
  "pao-trigo-forma-integral": ["pao de forma", "pao integral"],
  "macarrao-trigo-cru": ["macarrao", "massa", "espaguete"],
  "batata-baroa-cozida": ["mandioquinha"],
  "mandioca-cozida": ["aipim", "macaxeira"],
  "cuscuz-de-milho-cozido-com-sal": ["cuscuz"],
  "fecula-de-mandioca": ["tapioca", "goma de tapioca"],
  "aveia-flocos-crua": ["aveia"],
  "frango-peito-sem-pele-grelhado": ["frango", "peito de frango", "frango grelhado", "file de frango"],
  "frango-peito-sem-pele-cru": ["peito de frango cru"],
  "carne-bovina-acem-moido-cozido": ["carne moida", "patinho moido"],
  "carne-bovina-patinho-sem-gordura-grelhado": ["patinho", "carne", "bife"],
  "carne-bovina-file-mingnon-sem-gordura-grelhado": ["file mignon"],
  "carne-bovina-contra-file-sem-gordura-grelhado": ["contrafile"],
  "ovo-de-galinha-inteiro-cozido-10minutos": ["ovo", "ovos", "ovo cozido"],
  "ovo-de-galinha-clara-cozida-10minutos": ["clara", "clara de ovo"],
  "atum-conserva-em-oleo": ["atum", "atum em lata"],
  "sardinha-conserva-em-oleo": ["sardinha", "sardinha em lata"],
  "salmao-sem-pele-fresco-grelhado": ["salmao"],
  "merluza-file-assado": ["peixe", "file de peixe"],
  "queijo-mozarela": ["mussarela", "muçarela", "mozzarella"],
  "queijo-minas-frescal": ["queijo branco", "queijo minas"],
  "iogurte-natural": ["iogurte"],
  "feijao-carioca-cozido": ["feijao"],
  "banana-prata-crua": ["banana"],
  "maca-fuji-com-casca-crua": ["maca"],
  "castanha-do-brasil-crua": ["castanha do para", "castanha"],
  "azeite-de-oliva-extra-virgem": ["azeite"],
  "oleo-de-soja": ["oleo"],
  "soja-queijo-tofu": ["tofu"],
};

/* ───────────────────────── Regras ───────────────────────── */

/**
 * O mínimo do nutriente na quantidade de ORIGEM para a troca fazer sentido.
 * 2 g de proteína em 150 g de arroz não são "fonte de proteína": igualar
 * isso com frango produziria uma troca sem sentido nenhum.
 */
export const MINIMO_ORIGEM: Record<Criterio, number> = { carboidrato: 5, proteina: 5, energia: 20 };

/**
 * O mínimo do nutriente por 100 g no SUBSTITUTO. Abaixo disso o alimento
 * não é fonte e a quantidade equivalente explode (alface por arroz).
 */
export const MINIMO_SUBSTITUTO_100G: Record<Criterio, number> = { carboidrato: 8, proteina: 8, energia: 25 };

/**
 * Exceções por grupo. Feijão cozido tem 4,5 a 6,3 g de proteína por 100 g:
 * com o mínimo geral de 8 g, "feijão por proteína" voltava sempre vazio.
 * Iogurte (3,8 a 4,1 g) e morango/melão (5 a 7,5 g de carboidrato) idem.
 */
export const MINIMO_POR_GRUPO: Partial<Record<GrupoTroca, Partial<Record<Criterio, number>>>> = {
  leguminosas: { proteina: 4 },
  laticinios: { proteina: 3 },
  frutas: { carboidrato: 5 },
};

export function minimoSubstituto(grupo: GrupoTroca | null, c: Criterio): number {
  return (grupo && MINIMO_POR_GRUPO[grupo]?.[c]) ?? MINIMO_SUBSTITUTO_100G[c];
}

/**
 * Arredondamento das gramas, por faixa: meio grama abaixo de 10 g (azeite,
 * castanha), 1 g até 50 g, 5 g até 100 g e 10 g acima. Assim o erro do
 * arredondamento fica em até cerca de 5% a partir de 10 g — menor que a
 * variação natural entre duas amostras do mesmo alimento. Abaixo de 10 g o
 * erro relativo pode passar disso, mas são décimos de grama.
 */
export function arredondaGramas(g: number): number {
  if (g < 10) return Math.max(0.5, Math.round(g * 2) / 2);
  if (g < 50) return Math.round(g);
  if (g < 100) return Math.round(g / 5) * 5;
  return Math.round(g / 10) * 10;
}

/** Estado de um alimento fora da lista curada: o preparo da TACO decide. */
export function estadoDe(a: AlimentoEq): Estado {
  const m = MEMBRO_POR_SLUG.get(a.slug);
  if (m) return m.estado;
  /* Verdura crua NÃO entra aqui: inhame cru e batata-baroa crua se pesam crus e se comem cozidos. */
  const comeCru: Categoria[] = ["frutas-e-derivados", "leite-e-derivados", "nozes-e-sementes", "gorduras-e-oleos"];
  return /(^|-)crua?(-|$)/.test(a.slug) && !comeCru.includes(a.categoria) ? "cru" : "pronto";
}

/** Grupo de um alimento fora da lista curada, pela categoria da TACO. */
export function grupoDe(a: AlimentoEq, criterio: Criterio): GrupoTroca | null {
  const m = MEMBRO_POR_SLUG.get(a.slug);
  if (m) return m.grupo;
  switch (a.categoria) {
    case "cereais-e-derivados":
      return "carboidratos";
    case "leguminosas-e-derivados":
      return "leguminosas";
    case "carnes-e-derivados":
    case "pescados-e-frutos-do-mar":
    case "ovos-e-derivados":
      return "proteinas";
    case "leite-e-derivados":
      return "laticinios";
    case "frutas-e-derivados":
      return "frutas";
    case "gorduras-e-oleos":
    case "nozes-e-sementes":
      return "gorduras";
    case "verduras-hortalicas-e-derivados":
      return (a.carboidrato ?? 0) >= 10 ? "carboidratos" : null;
    default: {
      /*
       * Preparados, miscelâneas, industrializados: só entram num grupo se o
       * macro DOMINAR o alimento. Sem isso, chocolate virava "carboidrato"
       * e era trocado por arroz, e macarrão à bolonhesa virava "proteína".
       */
      const kcal = a.energia ?? 0;
      if (kcal <= 0) return null;
      if (criterio === "carboidrato" && (4 * (a.carboidrato ?? 0)) / kcal >= 0.6) return "carboidratos";
      if (criterio === "proteina" && (4 * (a.proteina ?? 0)) / kcal >= 0.35) return "proteinas";
      return null;
    }
  }
}

export const valor = (a: AlimentoEq, c: Criterio): number | null => a[c];

/* ───────────────────────── A conta ───────────────────────── */

export interface Macros {
  energia: number | null;
  proteina: number | null;
  carboidrato: number | null;
  lipideos: number | null;
  fibra: number | null;
}

export function macrosDe(a: AlimentoEq, gramas: number): Macros {
  const e = (v: number | null) => (v === null ? null : (v * gramas) / 100);
  return { energia: e(a.energia), proteina: e(a.proteina), carboidrato: e(a.carboidrato), lipideos: e(a.lipideos), fibra: e(a.fibra) };
}

/** A regra de três, isolada: quantos gramas do substituto dão o alvo. */
export function gramasEquivalentes(alvo: number, por100g: number): number {
  return (alvo / por100g) * 100;
}

export interface MedidaCaseira {
  /** "2 fatias", "1½ unidade". */
  texto: string;
  /** Peso de UMA medida, para a pessoa conferir. */
  gramasCada: number;
}

/**
 * O nome de cada medida da POF como se lê, no singular e no plural.
 * A POF grava sem acento ("pedaco", "copo de requeijao"); a tela não.
 */
const NOMES: Record<string, [string, string]> = {
  "1 unidade": ["unidade", "unidades"],
  "1 bife": ["bife", "bifes"],
  "1 file": ["filé", "filés"],
  "1 copo americano": ["copo americano", "copos americanos"],
  "1 copo de requeijao": ["copo de requeijão", "copos de requeijão"],
  "1 copo medio": ["copo médio", "copos médios"],
  "1 copo grande": ["copo grande", "copos grandes"],
  "1 concha": ["concha", "conchas"],
  "1 escumadeira": ["escumadeira", "escumadeiras"],
  "1 colher de sopa": ["colher de sopa", "colheres de sopa"],
  "1 colher de arroz ou servir": ["colher de servir", "colheres de servir"],
  "1 fatia": ["fatia", "fatias"],
  "1 pedaco": ["pedaço", "pedaços"],
  "1 banda": ["banda", "bandas"],
  "1 punhado": ["punhado", "punhados"],
  "1 dosador": ["scoop", "scoops"],
};

/**
 * Desempate entre medidas que cabem na mesma quantidade: a ordem acima, que
 * vai da medida mais reconhecível (unidade, bife, copo) à mais vaga (pedaço).
 * "1 porção", "metade" e "lata (n. e.)" não entram: não são medida de
 * cozinha, ou repetem o ½.
 */
const PREFERENCIA = Object.keys(NOMES);

/**
 * Medidas da POF que enganam neste uso, por alimento. A POF registra o que
 * as famílias relataram; algumas medidas são reais mas variam demais para
 * servir de conversão: "1 mamão formosa = 310 g" (um formosa inteiro pesa
 * bem mais), "1 batata-doce = 355 g", melancia em copo, tapioca em fatia,
 * carne moída em bife, peito de frango em fatia de 180 g, e a banana-nanica
 * com o mesmo peso de unidade da prata.
 */
export const MEDIDAS_EXCLUIDAS: Record<string, string[]> = {
  "mamao-formosa-cru": ["1 unidade"],
  "batata-doce-cozida": ["1 unidade"],
  "melancia-crua": ["1 copo americano"],
  "tapioca-com-manteiga": ["1 fatia", "1 pedaco", "1 banda"],
  "carne-bovina-acem-moido-cozido": ["1 bife", "1 pedaco"],
  "frango-peito-sem-pele-grelhado": ["1 fatia"],
  "banana-nanica-crua": ["1 unidade"],
};

/** As medidas de um alimento que podem aparecer na tela. */
export function medidasValidas(a: AlimentoEq): { n: string; g: number }[] {
  const fora = MEDIDAS_EXCLUIDAS[a.slug] ?? [];
  return (a.porcoes ?? []).filter((p) => NOMES[p.n] && p.g > 0 && !fora.includes(p.n));
}

/** O nome de uma medida da POF, como se lê ("1 colher de servir"). */
export function rotuloMedida(n: string): string {
  return NOMES[n] ? `1 ${NOMES[n][0]}` : n;
}

function fracao(n: number): string {
  const inteiro = Math.floor(n);
  const meio = n - inteiro >= 0.5;
  if (inteiro === 0) return "½";
  return meio ? `${inteiro}½` : `${inteiro}`;
}

/**
 * A medida caseira mais reconhecível, em passos de meia medida.
 *
 * Só usa medidas com fonte (POF/IBGE). Só aparece se cair a até 15% das
 * gramas e entre ½ e 10 medidas: "≈ 1 fatia" para 40 g de pão de 25 g a
 * fatia seria arredondar a conta inteira, e "14 colheres" não ajuda ninguém.
 */
export function medidaCaseira(a: AlimentoEq, gramas: number): MedidaCaseira | null {
  let melhor: { p: { n: string; g: number }; n: number; nota: number } | null = null;
  for (const p of medidasValidas(a)) {
    const n = Math.round((gramas / p.g) * 2) / 2;
    if (n < 0.5 || n > 10) continue;
    if (Math.abs(n * p.g - gramas) / gramas > 0.15) continue;
    /*
     * Prefere a medida que dá uma contagem entre 1 e 4 ("1 copo americano"
     * em vez de "10 colheres de sopa"; "1 colher de sopa" de azeite em vez de
     * "½ colher de servir"); no empate, a ordem de PREFERENCIA.
     */
    const nota = (n >= 1 && n <= 4 ? 0 : 100) + PREFERENCIA.indexOf(p.n);
    if (!melhor || nota < melhor.nota) melhor = { p, n, nota };
  }
  if (!melhor) return null;
  const [sing, plur] = NOMES[melhor.p.n];
  return { texto: `${fracao(melhor.n)} ${melhor.n > 1 ? plur : sing}`, gramasCada: melhor.p.g };
}

export type MotivoRecusa =
  /** O grupo existe, mas nenhum alimento dele entrega o nutriente numa quantidade prática. */
  | "sem-troca-pratica"
  /** O alimento de origem não tem esse nutriente analisado. */
  | "origem-sem-dado"
  /** A origem tem pouco do nutriente na quantidade informada. */
  | "origem-nao-e-fonte"
  /** Não há grupo de troca para este alimento com este critério. */
  | "sem-grupo";

export interface Troca {
  alimento: AlimentoEq;
  /** Gramas já arredondadas. */
  gramas: number;
  medida: MedidaCaseira | null;
  macros: Macros;
  /** Valor do critério na troca (com as gramas arredondadas). */
  igualado: number;
  nota?: string;
  /** Avisos de diferença nos OUTROS nutrientes — contexto, não julgamento. */
  avisos: string[];
}

export interface ResultadoTroca {
  origem: AlimentoEq;
  gramas: number;
  criterio: Criterio;
  macrosOrigem: Macros;
  alvo: number | null;
  grupo: GrupoTroca | null;
  trocas: Troca[];
  recusa: MotivoRecusa | null;
}

/**
 * Os avisos que acompanham a troca: o critério ficou igual, o resto não.
 *
 * Diferença relevante = mais de 25% E mais que um piso absoluto (para não
 * avisar que 0,3 g de gordura "dobrou" para 0,6 g).
 */
export function avisos(origem: Macros, troca: Macros, criterio: Criterio): string[] {
  const out: string[] = [];
  const dif = (a: number | null, b: number | null, piso: number) =>
    a !== null && b !== null && Math.abs(b - a) > piso && Math.abs(b - a) > Math.abs(a) * 0.25 ? Math.sign(b - a) : 0;
  if (criterio !== "energia") {
    /* Calorias: 15% já muda a refeição (arroz → pão era +17% e não avisava). */
    const s =
      origem.energia !== null && troca.energia !== null && Math.abs(troca.energia - origem.energia) > 20 && Math.abs(troca.energia - origem.energia) > origem.energia * 0.15
        ? Math.sign(troca.energia - origem.energia)
        : 0;
    if (s) out.push(s > 0 ? "Tem mais calorias nesta quantidade." : "Tem menos calorias nesta quantidade.");
  }
  const g = dif(origem.lipideos, troca.lipideos, 4);
  if (g) out.push(g > 0 ? "Tem mais gordura." : "Tem menos gordura.");
  if (criterio !== "proteina") {
    const p = dif(origem.proteina, troca.proteina, 5);
    if (p) out.push(p > 0 ? "Tem mais proteína." : "Tem menos proteína.");
  }
  if (criterio !== "carboidrato") {
    const c = dif(origem.carboidrato, troca.carboidrato, 8);
    if (c) out.push(c > 0 ? "Tem mais carboidrato." : "Tem menos carboidrato.");
  }
  return out;
}

function trocaPara(origemMacros: Macros, alvo: number, sub: AlimentoEq, criterio: Criterio): Troca | null {
  const por100 = valor(sub, criterio);
  if (por100 === null || por100 <= 0) return null;
  const gramas = arredondaGramas(gramasEquivalentes(alvo, por100));
  const macros = macrosDe(sub, gramas);
  const m = MEMBRO_POR_SLUG.get(sub.slug);
  return {
    alimento: sub,
    gramas,
    medida: medidaCaseira(sub, gramas),
    macros,
    igualado: macros[criterio]!,
    nota: m?.nota,
    avisos: avisos(origemMacros, macros, criterio),
  };
}

/**
 * As trocas de um alimento, dentro do grupo e do mesmo estado.
 * `base` é o universo de alimentos disponíveis (os da lista curada que
 * existirem nele entram; os demais são ignorados).
 */
export function trocas(origem: AlimentoEq, gramas: number, criterio: Criterio, base: Map<string, AlimentoEq>): ResultadoTroca {
  const macrosOrigem = macrosDe(origem, gramas);
  const alvo = macrosOrigem[criterio];
  const grupo = grupoDe(origem, criterio);
  const vazio = { origem, gramas, criterio, macrosOrigem, alvo, grupo, trocas: [] as Troca[] };
  if (alvo === null) return { ...vazio, recusa: "origem-sem-dado" };
  if (alvo < MINIMO_ORIGEM[criterio]) return { ...vazio, recusa: "origem-nao-e-fonte" };
  if (!grupo) return { ...vazio, recusa: "sem-grupo" };

  const estado = estadoDe(origem);
  const { min, max } = GRUPOS[grupo];
  const lista: Troca[] = [];
  for (const m of MEMBROS) {
    if (m.grupo !== grupo || m.estado !== estado || m.slug === origem.slug) continue;
    const sub = base.get(m.slug);
    if (!sub) continue;
    const por100 = valor(sub, criterio);
    if (por100 === null || por100 < minimoSubstituto(grupo, criterio)) continue;
    const t = trocaPara(macrosOrigem, alvo, sub, criterio);
    if (!t || t.gramas < min || t.gramas > max) continue;
    lista.push(t);
  }
  return { ...vazio, trocas: lista, recusa: lista.length ? null : "sem-troca-pratica" };
}

export type MotivoDireta = MotivoRecusa | "destino-sem-dado" | "destino-nao-e-fonte" | "estados-diferentes";

export interface ResultadoDireto {
  troca: Troca | null;
  /** Quando a troca não equivale, o que acontece se a pessoa trocar peso por peso. */
  pesoPorPeso: Macros | null;
  motivo: MotivoDireta | null;
}

/**
 * Troca com um alimento escolhido pela pessoa ("arroz por couve-flor").
 *
 * Aqui não há filtro de grupo: a pessoa já escolheu. Mas quando o destino
 * não é fonte do nutriente, o motor NÃO devolve a quantidade absurda — ele
 * devolve o que a troca peso por peso faz com os nutrientes, que é a
 * resposta útil para quem troca arroz por couve-flor para emagrecer.
 */
export function trocaDireta(origem: AlimentoEq, gramas: number, destino: AlimentoEq, criterio: Criterio): ResultadoDireto {
  const macrosOrigem = macrosDe(origem, gramas);
  const alvo = macrosOrigem[criterio];
  const pesoPorPeso = macrosDe(destino, gramas);
  if (alvo === null) return { troca: null, pesoPorPeso, motivo: "origem-sem-dado" };
  if (alvo < MINIMO_ORIGEM[criterio]) return { troca: null, pesoPorPeso, motivo: "origem-nao-e-fonte" };
  const por100 = valor(destino, criterio);
  if (por100 === null) return { troca: null, pesoPorPeso, motivo: "destino-sem-dado" };
  if (por100 < minimoSubstituto(MEMBRO_POR_SLUG.get(destino.slug)?.grupo ?? null, criterio)) return { troca: null, pesoPorPeso, motivo: "destino-nao-e-fonte" };
  const t = trocaPara(macrosOrigem, alvo, destino, criterio);
  if (!t) return { troca: null, pesoPorPeso, motivo: "destino-sem-dado" };
  const motivo = estadoDe(origem) !== estadoDe(destino) ? "estados-diferentes" : null;
  return { troca: t, pesoPorPeso: null, motivo };
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const AVISO_GERAL =
  "As equivalências são estimativas pela composição média dos alimentos na TACO. Dois alimentos equivalentes em um nutriente podem ser bem diferentes nos outros.";

export const TEXTO_RECUSA: Record<MotivoDireta, string> = {
  "origem-sem-dado": "A TACO não publica esse nutriente analisado para este alimento (às vezes porque ele praticamente não tem, às vezes porque a análise está em revisão). Sem o dado, não calculamos a troca por esse critério. Experimente outro.",
  "origem-nao-e-fonte": "Esse alimento, nessa quantidade, não é uma fonte relevante desse nutriente. A comparação por esse critério não seria útil. Experimente outro critério.",
  "sem-grupo": "Ainda não temos um grupo de troca para este alimento com esse critério. Escolha um alimento específico para comparar.",
  "sem-troca-pratica": "Nenhum alimento do mesmo grupo entrega esse nutriente numa quantidade que alguém comeria. Experimente outro critério ou escolha um alimento específico.",
  "destino-sem-dado": "A tabela não traz esse nutriente analisado para o alimento escolhido.",
  "destino-nao-e-fonte": "O alimento escolhido tem pouco desse nutriente: para igualar, seria preciso uma quantidade que ninguém come. Veja abaixo o que muda trocando peso por peso.",
  "estados-diferentes": "Atenção: um alimento está pesado cru e o outro pronto. A conta está certa, mas confira se é assim que você vai pesar.",
};

/** Alimentos que muita gente procura e que a TACO não tem. */
export const FORA_DA_BASE: { termo: RegExp; texto: string }[] = [
  { termo: /quinoa|quinua/, texto: "A quinoa não está na TACO, a tabela que usamos. Por isso ela ainda não entra nas trocas: não usamos número sem fonte." },
  { termo: /macarra.*cozid|massa cozid/, texto: "Na TACO o macarrão só aparece cru. Escolha \"Macarrão cru\" e pese antes de cozinhar; a troca virá com outros alimentos crus." },
];

/* ───────────────────────── Lista pronta ───────────────────────── */

/**
 * A "lista de substituição" que as pessoas procuram: por grupo, quanto de
 * cada alimento equivale a UMA porção de referência. A referência de cada
 * grupo é o alimento mais comum dele, numa medida caseira com fonte.
 */
export const REFERENCIAS: { grupo: GrupoTroca; slug: string; gramas: number; rotulo: string }[] = [
  { grupo: "carboidratos", slug: "arroz-tipo-1-cozido", gramas: 100, rotulo: "100 g de arroz branco cozido" },
  { grupo: "proteinas", slug: "frango-peito-sem-pele-grelhado", gramas: 100, rotulo: "100 g de peito de frango grelhado" },
  { grupo: "leguminosas", slug: "feijao-carioca-cozido", gramas: 140, rotulo: "1 concha (140 g) de feijão carioca cozido" },
  { grupo: "frutas", slug: "banana-prata-crua", gramas: 75, rotulo: "1 banana-prata (75 g)" },
  { grupo: "laticinios", slug: "queijo-minas-frescal", gramas: 45, rotulo: "1 fatia (45 g) de queijo minas frescal" },
  { grupo: "gorduras", slug: "azeite-de-oliva-extra-virgem", gramas: 8, rotulo: "1 colher de sopa (8 g) de azeite" },
];
