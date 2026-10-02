/**
 * Beliscômetro — base de alimentos.
 *
 * Energia por 100 g (ml ≈ g nas bebidas) sempre com fonte:
 *   1. TACO (NEPA-UNICAMP, 4ª ed., já importada em data/alimentos);
 *   2. receita calculada com ingredientes da TACO, quando o alimento não
 *      existe pronto nela (ex.: brigadeiro);
 *   3. USDA FoodData Central (SR Legacy), quando não há equivalente brasileiro.
 * Sem fonte, o alimento não entra. TBCA ainda não está importada no site.
 *
 * Medidas caseiras viram gramas estimados. Onde existe medida na tabela de
 * Medidas Referidas da POF 2008-09 (IBGE), ela é usada; o resto é estimativa
 * de porção comum, e a interface sempre diz que é estimativa.
 */

export type Categoria = "doces" | "salgados" | "petiscos" | "bebidas" | "disfarcados";
export type Tag = "compartilhado" | "passagem" | "cozinhando";

export type Medida = { id: string; rotulo: string; gramas: number };

export type Alimento = {
  id: string;
  nome: string;
  emoji: string;
  /** Cor de fundo do alimento no prato (dá cor à interface preto e dourado). */
  cor: string;
  categoria: Categoria;
  kcal100: number;
  fonte: string;
  medidas: Medida[];
  /** Medida pré-selecionada: a mais comum, não a maior. */
  padrao: string;
  tags?: Tag[];
  /** Busca: outros nomes. */
  sinonimos?: string[];
};

export const CATEGORIAS: { id: Categoria; nome: string; emoji: string }[] = [
  { id: "doces", nome: "Doces", emoji: "🍫" },
  { id: "salgados", nome: "Salgados", emoji: "🧀" },
  { id: "petiscos", nome: "Petiscos", emoji: "🥜" },
  { id: "bebidas", nome: "Bebidas", emoji: "🥤" },
  { id: "disfarcados", nome: "Beliscos que não parecem beliscos", emoji: "🤫" },
];

const un = (id: string, rotulo: string, g: number): Medida => ({ id, rotulo, gramas: g });
/** Contagem de unidades: "1", "2", "3", "4+" (4+ conta como 4). */
const unidades = (g: number, ns: number[], sufixo = "") =>
  ns.map((n, i) => un(String(n), `${n}${i === ns.length - 1 && ns.length > 3 ? "+" : ""}${sufixo}`, n * g));

/** Mistura arroz + feijão (TACO, cozidos, meio a meio): comida de panela provada ou sobrada. */
const ARROZ_FEIJAO = Math.round((128 + 76) / 2);

export const ALIMENTOS: Alimento[] = [
  // ── Doces
  { id: "chocolate", nome: "Chocolate", emoji: "🍫", cor: "#5b3a29", categoria: "doces", kcal100: 540, fonte: "TACO: chocolate ao leite", padrao: "2q",
    medidas: [un("1q", "1 quadradinho", 5), un("2q", "2 quadradinhos", 10), un("4q", "4 quadradinhos", 20), un("meia", "meia barra", 45), un("barra", "barra inteira (90 g)", 90)] },
  { id: "brigadeiro", nome: "Brigadeiro", emoji: "🟤", cor: "#4a2c1d", categoria: "doces", kcal100: 385, padrao: "1",
    fonte: "Receita com ingredientes TACO (leite condensado, manteiga, achocolatado), rendimento ≈ 25 unid. de 15 g",
    medidas: unidades(15, [1, 2, 3, 5]) },
  { id: "bolo", nome: "Bolo", emoji: "🍰", cor: "#d9a066", categoria: "doces", kcal100: 410, fonte: "TACO: bolo pronto de chocolate", padrao: "media",
    medidas: [un("fina", "fatia fina", 40), un("media", "fatia média", 60), un("grande", "fatia grande", 90)] },
  { id: "doce-de-leite", nome: "Doce de leite", emoji: "🍯", cor: "#b5763a", categoria: "doces", kcal100: 306, fonte: "TACO: doce de leite cremoso", padrao: "sopa",
    medidas: [un("cha", "1 colher de chá", 10), un("sopa", "1 colher de sopa", 20), un("2sopa", "2 colheres de sopa", 40)] },
  { id: "biscoito-recheado", nome: "Biscoito recheado", emoji: "🍪", cor: "#7a4b2a", categoria: "doces", kcal100: 472, fonte: "TACO: biscoito doce recheado com chocolate", padrao: "2", sinonimos: ["bolacha", "biscoito doce"],
    medidas: [un("1", "1 biscoito", 13), un("2", "2 biscoitos", 26), un("4", "4 biscoitos", 52), un("meio", "meio pacote", 65), un("pacote", "pacote inteiro", 130)] },
  { id: "sorvete", nome: "Sorvete", emoji: "🍨", cor: "#f1d9c4", categoria: "doces", kcal100: 207, fonte: "USDA FoodData Central (SR Legacy): ice cream, vanilla", padrao: "1",
    medidas: [un("colher", "algumas colheradas", 30), un("1", "1 bola", 65), un("pote", "um potinho (≈ 200 ml)", 110), un("2", "2 bolas", 130)] },
  { id: "bala", nome: "Bala", emoji: "🍬", cor: "#e86a92", categoria: "doces", kcal100: 394, fonte: "USDA FoodData Central (SR Legacy): candies, hard", padrao: "3",
    medidas: unidades(5, [1, 3, 5, 10]) },
  { id: "pacoca", nome: "Paçoca", emoji: "🥜", cor: "#c99a5b", categoria: "doces", kcal100: 487, fonte: "TACO: paçoca de amendoim", padrao: "1",
    medidas: unidades(20, [1, 2, 3, 4]) },

  // ── Salgados
  { id: "pao-de-queijo", nome: "Pão de queijo", emoji: "🧀", cor: "#e8c26e", categoria: "salgados", kcal100: 363, fonte: "TACO: pão de queijo assado", padrao: "2",
    medidas: unidades(30, [1, 2, 3, 4], " (médio)") },
  { id: "salgadinho-festa", nome: "Salgadinho de festa", emoji: "🥟", cor: "#c8873e", categoria: "salgados", kcal100: 283, fonte: "TACO: coxinha de frango frita (unidade de festa ≈ 20 g)", padrao: "5", sinonimos: ["coxinha", "risole", "kibe", "salgado"],
    medidas: unidades(20, [3, 5, 8, 10, 15]) },
  { id: "batata-frita", nome: "Batata frita", emoji: "🍟", cor: "#f2c14e", categoria: "salgados", kcal100: 267, fonte: "TACO: batata inglesa frita", padrao: "punhado",
    medidas: [un("algumas", "algumas do prato de alguém", 30), un("punhado", "pequeno punhado", 50), un("meia", "meia porção", 75), un("pequena", "porção pequena", 100), un("media", "porção média", 150)] },
  { id: "pizza", nome: "Pizza", emoji: "🍕", cor: "#e2683c", categoria: "salgados", kcal100: 266, fonte: "USDA FoodData Central (SR Legacy): pizza, cheese, regular crust", padrao: "1",
    medidas: unidades(100, [1, 2, 3, 4], " pedaço(s)") },
  { id: "queijo", nome: "Queijo", emoji: "🧀", cor: "#f4d35e", categoria: "salgados", kcal100: 330, fonte: "TACO: queijo mozarela; fatia de 20 g (POF/IBGE)", padrao: "1", sinonimos: ["mussarela", "muçarela"],
    medidas: [un("pedacinho", "um pedacinho", 10), un("1", "1 fatia", 20), un("2", "2 fatias", 40), un("4", "4 fatias", 80)] },
  { id: "salame", nome: "Salame", emoji: "🥓", cor: "#a63d40", categoria: "salgados", kcal100: 398, fonte: "TACO: salame", padrao: "3",
    medidas: [un("3", "3 fatias finas", 15), un("6", "6 fatias", 30), un("10", "10 fatias", 50)] },
  { id: "presunto", nome: "Presunto", emoji: "🥩", cor: "#e09f9f", categoria: "salgados", kcal100: 94, fonte: "TACO: presunto sem capa de gordura", padrao: "2",
    medidas: [un("1", "1 fatia", 15), un("2", "2 fatias", 30), un("4", "4 fatias", 60)] },
  { id: "pao", nome: "Pão", emoji: "🥖", cor: "#d4a15f", categoria: "salgados", kcal100: 300, fonte: "TACO: pão francês; unidade de 50 g (POF/IBGE)", padrao: "meio", sinonimos: ["pão francês", "pãozinho"],
    medidas: [un("pedaco", "um pedaço", 15), un("meio", "meio pão", 25), un("1", "1 pão", 50), un("2", "2 pães", 100)] },
  { id: "torrada", nome: "Torrada", emoji: "🍞", cor: "#c58b4c", categoria: "salgados", kcal100: 377, fonte: "TACO: torrada de pão francês", padrao: "3",
    medidas: unidades(8, [1, 3, 5, 8]) },

  // ── Petiscos
  { id: "amendoim", nome: "Amendoim", emoji: "🥜", cor: "#b98b52", categoria: "petiscos", kcal100: 606, fonte: "TACO: amendoim torrado salgado; punhado 30 g e pacote 50 g (POF/IBGE)", padrao: "medio",
    medidas: [un("alguns", "só alguns", 9), un("pequeno", "1 punhado pequeno", 15), un("medio", "1 punhado médio", 30), un("pacote", "um pacotinho (50 g)", 50), un("2", "2 punhados", 60)] },
  { id: "castanhas", nome: "Castanhas", emoji: "🌰", cor: "#a0703f", categoria: "petiscos", kcal100: 570, fonte: "TACO: castanha-de-caju torrada salgada", padrao: "punhado", sinonimos: ["castanha de caju", "nozes", "mix de castanhas"],
    medidas: [un("algumas", "algumas", 10), un("punhado", "1 punhado", 30), un("2", "2 punhados", 60)] },
  { id: "pipoca", nome: "Pipoca", emoji: "🍿", cor: "#f5e6b8", categoria: "petiscos", kcal100: 448, fonte: "TACO: pipoca com óleo de soja", padrao: "pequena",
    medidas: [un("xicara", "1 xícara", 10), un("pequena", "tigela pequena", 25), un("media", "tigela média", 50), un("grande", "balde de cinema médio", 90)] },
  { id: "chips", nome: "Batata chips", emoji: "🥔", cor: "#e9b949", categoria: "petiscos", kcal100: 543, fonte: "TACO: batata frita tipo chips industrializada", padrao: "punhado", sinonimos: ["salgadinho de pacote"],
    medidas: [un("punhado", "1 punhado", 15), un("pequeno", "pacote pequeno", 45), un("meio", "meio pacote grande", 60), un("grande", "pacote grande", 120)] },
  { id: "biscoito-salgado", nome: "Biscoito salgado", emoji: "🧂", cor: "#d6b47a", categoria: "petiscos", kcal100: 432, fonte: "TACO: biscoito salgado cream cracker", padrao: "3", sinonimos: ["cream cracker", "bolacha salgada"],
    medidas: unidades(6, [1, 3, 6, 9]) },
  { id: "petisco-bar", nome: "Petisco de bar", emoji: "🍢", cor: "#9c4a2f", categoria: "petiscos", kcal100: 280, fonte: "TACO: linguiça de porco frita (referência de petisco frito)", padrao: "algumas", sinonimos: ["calabresa", "porção", "linguiça"],
    medidas: [un("algumas", "algumas rodelas/pedaços", 30), un("dividida", "parte de uma porção dividida", 80), un("muita", "boa parte da porção", 150)] },

  // ── Bebidas
  { id: "cerveja", nome: "Cerveja", emoji: "🍺", cor: "#e3a72f", categoria: "bebidas", kcal100: 41, fonte: "TACO: cerveja pilsen", padrao: "lata",
    medidas: [un("copo", "1 copo americano", 190), un("lata", "1 lata", 350), un("2", "2 latas", 700), un("3", "3 latas", 1050), un("4", "4+ latas", 1400)] },
  { id: "refrigerante", nome: "Refrigerante", emoji: "🥤", cor: "#7a1e1e", categoria: "bebidas", kcal100: 34, fonte: "TACO: refrigerante tipo cola", padrao: "copo",
    medidas: [un("copo", "1 copo (200 ml)", 200), un("lata", "1 lata", 350), un("600", "garrafa de 600 ml", 600)] },
  { id: "suco", nome: "Suco", emoji: "🧃", cor: "#f39c12", categoria: "bebidas", kcal100: 33, fonte: "TACO: suco de laranja-pera", padrao: "copo",
    medidas: [un("copo", "1 copo (200 ml)", 200), un("grande", "copo grande (300 ml)", 300), un("2", "2 copos", 400)] },
  { id: "cafe-adocado", nome: "Café adoçado", emoji: "☕", cor: "#6f4e37", categoria: "bebidas", kcal100: 44, padrao: "1",
    fonte: "TACO: café (infusão) + açúcar refinado, 1 colher de chá (≈ 5 g) por xícara de 50 ml",
    medidas: unidades(55, [1, 2, 3, 4], " xícara(s)") },
  { id: "vinho", nome: "Vinho", emoji: "🍷", cor: "#6d1a36", categoria: "bebidas", kcal100: 85, fonte: "USDA FoodData Central (SR Legacy): wine, table, red", padrao: "1",
    medidas: unidades(150, [1, 2, 3], " taça(s)") },
  { id: "destilado", nome: "Destilado", emoji: "🥃", cor: "#c27c0e", categoria: "bebidas", kcal100: 216, fonte: "TACO: aguardente de cana", padrao: "1", sinonimos: ["cachaça", "caipirinha", "whisky", "vodka", "dose"],
    medidas: unidades(50, [1, 2, 3, 4], " dose(s)") },

  // ── Beliscos que não parecem beliscos
  { id: "provar-cozinhando", nome: "Provar a comida enquanto cozinha", emoji: "🥄", cor: "#8d6e63", categoria: "disfarcados", kcal100: ARROZ_FEIJAO, tags: ["cozinhando"], padrao: "3",
    fonte: "TACO: arroz tipo 1 e feijão carioca cozidos (meio a meio); colher de sopa ≈ 21 g (POF/IBGE)",
    medidas: [un("2", "2 colheradas", 42), un("3", "3 colheradas", 63), un("5", "5 colheradas", 105), un("muitas", "perdi a conta", 150)] },
  { id: "resto-filhos", nome: "Terminar a comida dos filhos", emoji: "🧒", cor: "#ff8a65", categoria: "disfarcados", kcal100: ARROZ_FEIJAO, tags: ["compartilhado"], padrao: "garfadas",
    fonte: "TACO: arroz tipo 1 e feijão carioca cozidos (meio a meio)",
    medidas: [un("restinho", "um restinho", 50), un("garfadas", "umas garfadas", 100), un("meio", "meio prato", 150)] },
  { id: "batata-alheia", nome: "Batata do prato de outra pessoa", emoji: "🍟", cor: "#ffd166", categoria: "disfarcados", kcal100: 267, tags: ["compartilhado"], padrao: "punhadinho",
    fonte: "TACO: batata inglesa frita", medidas: [un("poucas", "3 ou 4 palitos", 20), un("punhadinho", "um punhadinho", 40), un("varias", "várias vezes", 70)] },
  { id: "sobremesa-alheia", nome: "Experimentar a sobremesa de alguém", emoji: "🍮", cor: "#e6b980", categoria: "disfarcados", kcal100: 410, tags: ["compartilhado"], padrao: "garfadas",
    fonte: "TACO: bolo pronto de chocolate (referência de sobremesa)", medidas: [un("1", "1 garfada", 15), un("garfadas", "2 ou 3 garfadas", 40), un("metade", "metade dela", 80)] },
  { id: "montando-prato", nome: "Comer enquanto monta o prato", emoji: "🍽️", cor: "#a1887f", categoria: "disfarcados", kcal100: ARROZ_FEIJAO, tags: ["cozinhando"], padrao: "2",
    fonte: "TACO: arroz tipo 1 e feijão carioca cozidos (meio a meio)", medidas: [un("1", "1 colherada", 21), un("2", "2 ou 3 colheradas", 50), un("muitas", "várias", 100)] },
  { id: "passando-cozinha", nome: "Pegar algo ao passar pela cozinha", emoji: "🚪", cor: "#bcaaa4", categoria: "disfarcados", kcal100: 443, tags: ["passagem"], padrao: "2",
    fonte: "TACO: biscoito doce tipo maisena (referência de “pegar algo do armário”)", medidas: [un("1", "1 ou 2 biscoitos", 10), un("2", "um punhadinho", 25), un("varios", "vários", 50)] },
  { id: "guardando-comida", nome: "Beliscar enquanto guarda as compras", emoji: "🛒", cor: "#90a4ae", categoria: "disfarcados", kcal100: 330, tags: ["passagem"], padrao: "1",
    fonte: "TACO: queijo mozarela (referência de “provar o que está guardando”)", medidas: [un("1", "um pedacinho", 10), un("2", "alguns pedaços", 25), un("3", "bastante", 50)] },
];

export const POR_ID: Record<string, Alimento> = Object.fromEntries(ALIMENTOS.map((a) => [a.id, a]));

export const normaliza = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/** Busca por nome ou sinônimo, sem acento. */
export function buscar(q: string): Alimento[] {
  const t = normaliza(q);
  if (!t) return [];
  return ALIMENTOS.filter((a) => [a.nome, ...(a.sinonimos ?? [])].some((n) => normaliza(n).includes(t)));
}
