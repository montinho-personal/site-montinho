/**
 * Montinho Mata a Vontade — famílias de vontade e o perfil sensorial.
 *
 * Perfil: eixos de 0 a 5. A família traz o alvo base; os chips de "como você
 * quer?" ajustam o alvo e dobram o peso do eixo citado (ver motor.ts).
 */
export type Eixo = "chocolate" | "docura" | "cremosidade" | "crocancia" | "maciez" | "densidade" | "umidade" | "cobertura";
export type Temperatura = "quente" | "gelado" | "ambiente";
export type Perfil = Partial<Record<Eixo, number>>;

export const EIXOS: { id: Eixo; rotulo: string }[] = [
  { id: "chocolate", rotulo: "Chocolate" },
  { id: "docura", rotulo: "Doçura" },
  { id: "cremosidade", rotulo: "Cremosidade" },
  { id: "crocancia", rotulo: "Crocância" },
  { id: "maciez", rotulo: "Maciez" },
  { id: "densidade", rotulo: "Densidade" },
  { id: "umidade", rotulo: "Umidade" },
  { id: "cobertura", rotulo: "Cobertura/recheio" },
];

export type Chip = {
  id: string;
  rotulo: string;
  /** Eixos que o chip fixa no alvo (e passam a pesar 2). */
  alvo?: Perfil;
  temperatura?: Temperatura;
  aroma?: string;
};

export type Familia = {
  id: string;
  nome: string;
  emoji: string;
  /** Formas vizinhas: match com fator 0,9 em vez de 0,7. */
  vizinhas: string[];
  sinonimos: string[];
  alvo: Perfil;
  /** Eixos que importam para a família (peso 1). Os demais pesam 0. */
  relevantes: Eixo[];
  temperatura?: Temperatura;
  chips: Chip[];
  /** Vontade de um produto específico: o "original na medida" sobe para o 1º cartão. */
  produto?: boolean;
};

const C = {
  chocolatudo: { id: "chocolatudo", rotulo: "bem chocolatudo", alvo: { chocolate: 5 } },
  fofinho: { id: "fofinho", rotulo: "fofinho", alvo: { maciez: 5, densidade: 2 } },
  denso: { id: "denso", rotulo: "denso e úmido", alvo: { densidade: 5, umidade: 4 } },
  cobertura: { id: "cobertura", rotulo: "com cobertura ou recheio", alvo: { cobertura: 5 } },
  cremoso: { id: "cremoso", rotulo: "bem cremoso", alvo: { cremosidade: 5 } },
  crocante: { id: "crocante", rotulo: "crocante", alvo: { crocancia: 4 } },
  doce: { id: "doce", rotulo: "bem doce", alvo: { docura: 5 } },
  quente: { id: "quente", rotulo: "quentinho", temperatura: "quente" as const },
  gelado: { id: "gelado", rotulo: "gelado", temperatura: "gelado" as const },
  morango: { id: "morango", rotulo: "de morango/fruta", aroma: "frutado", alvo: { chocolate: 0 } },
} satisfies Record<string, Chip>;

export const FAMILIAS: Familia[] = [
  { id: "bolo-chocolate", nome: "Bolo de chocolate", emoji: "🍫", vizinhas: ["bolo-caneca", "brownie"],
    sinonimos: ["bolo de chocolate", "bolo chocolate", "bolo choc", "nega maluca", "bolo vulcao", "petit gateau", "bolo"],
    alvo: { chocolate: 4, docura: 4, maciez: 5, densidade: 2, umidade: 4, cremosidade: 2 },
    relevantes: ["chocolate", "docura", "maciez", "densidade", "umidade", "cobertura", "cremosidade"],
    chips: [C.chocolatudo, C.fofinho, C.cobertura, C.quente] },
  { id: "brownie", nome: "Brownie", emoji: "🟫", vizinhas: ["bolo-chocolate", "bolo-caneca", "cookie"],
    sinonimos: ["brownie", "bronie", "brauni", "browni", "blondie"],
    alvo: { chocolate: 5, docura: 4, densidade: 5, maciez: 4, umidade: 4, crocancia: 1 },
    relevantes: ["chocolate", "docura", "densidade", "maciez", "umidade", "crocancia"],
    chips: [C.denso, C.chocolatudo, { id: "pedacos", rotulo: "com pedaços", alvo: { crocancia: 2 } }, C.quente] },
  { id: "brigadeiro", nome: "Brigadeiro", emoji: "🟤", vizinhas: ["chocolate", "mousse"],
    sinonimos: ["brigadeiro", "brigadero", "negrinho", "brigadeiro de colher", "brigadeirao"],
    alvo: { chocolate: 5, docura: 5, cremosidade: 4, densidade: 4, maciez: 4 },
    relevantes: ["chocolate", "docura", "cremosidade", "densidade"],
    chips: [{ id: "colher", rotulo: "de colher", alvo: { cremosidade: 5 } }, { id: "enrolado", rotulo: "enrolado", alvo: { densidade: 5, cremosidade: 3 } }, C.doce] },
  { id: "chocolate", nome: "Chocolate", emoji: "🍫", vizinhas: ["brigadeiro", "nutella"], produto: true,
    sinonimos: ["chocolate", "barra de chocolate", "bombom", "kit kat", "kitkat", "bis", "sonho de valsa", "prestigio", "lacta", "ouro branco", "chocolate ao leite", "trufa"],
    alvo: { chocolate: 5, docura: 4, densidade: 3, cremosidade: 2 },
    relevantes: ["chocolate", "docura", "densidade", "crocancia"],
    chips: [{ id: "original", rotulo: "o original mesmo" }, { id: "sabor", rotulo: "algo com esse sabor" }, C.quente] },
  { id: "nutella", nome: "Nutella / creme de avelã", emoji: "🫙", vizinhas: ["chocolate", "brigadeiro"], produto: true,
    sinonimos: ["nutella", "nutela", "creme de avela", "creme avela", "ovomaltine", "creme de ovomaltine"],
    alvo: { chocolate: 4, docura: 5, cremosidade: 5, densidade: 3 },
    relevantes: ["chocolate", "docura", "cremosidade"],
    chips: [{ id: "original", rotulo: "o original mesmo" }, { id: "sabor", rotulo: "algo com esse sabor" }] },
  { id: "cookie", nome: "Cookie", emoji: "🍪", vizinhas: ["brownie", "bolo-caneca"],
    sinonimos: ["cookie", "cookies", "biscoito", "bolacha", "cookie de chocolate"],
    alvo: { crocancia: 4, maciez: 3, docura: 4, chocolate: 3, densidade: 3 },
    relevantes: ["crocancia", "maciez", "docura", "chocolate"],
    chips: [C.crocante, { id: "macio", rotulo: "macio por dentro", alvo: { maciez: 5, crocancia: 2 } }, { id: "gotas", rotulo: "com gotas de chocolate", alvo: { chocolate: 4 } }, C.quente] },
  { id: "sorvete", nome: "Sorvete", emoji: "🍨", vizinhas: ["milkshake", "mousse"], temperatura: "gelado",
    sinonimos: ["sorvete", "picole", "gelato", "sorvete de chocolate", "sorvete de morango", "acai", "frozen", "frozen yogurt", "paleta"],
    alvo: { cremosidade: 5, docura: 4, chocolate: 2 },
    relevantes: ["cremosidade", "docura", "chocolate"],
    chips: [{ id: "choc", rotulo: "de chocolate", alvo: { chocolate: 5 } }, C.morango, C.cremoso] },
  { id: "mousse", nome: "Mousse", emoji: "🍮", vizinhas: ["pudim", "cheesecake", "brigadeiro"], temperatura: "gelado",
    sinonimos: ["mousse", "musse", "creme", "sobremesa cremosa", "algo cremoso", "pave"],
    alvo: { cremosidade: 5, docura: 3, chocolate: 3, maciez: 5 },
    relevantes: ["cremosidade", "docura", "chocolate"],
    chips: [{ id: "choc", rotulo: "de chocolate", alvo: { chocolate: 5 } }, C.morango, C.gelado] },
  { id: "pudim", nome: "Pudim", emoji: "🍮", vizinhas: ["mousse", "doce-de-leite"], temperatura: "gelado",
    sinonimos: ["pudim", "flan", "pudim de leite"],
    alvo: { cremosidade: 5, docura: 4, maciez: 5, chocolate: 0, cobertura: 3 },
    relevantes: ["cremosidade", "docura", "maciez", "chocolate", "cobertura"],
    chips: [{ id: "calda", rotulo: "com calda", alvo: { cobertura: 5 } }, C.gelado] },
  { id: "doce-de-leite", nome: "Doce de leite", emoji: "🍯", vizinhas: ["pudim", "pacoca"],
    sinonimos: ["doce de leite", "dulce de leche", "leite condensado", "leite moca", "doce de leite de colher"],
    alvo: { cremosidade: 5, docura: 5, chocolate: 0 },
    relevantes: ["cremosidade", "docura", "chocolate"],
    chips: [{ id: "original", rotulo: "o original mesmo" }, C.cremoso, C.gelado] },
  { id: "pacoca", nome: "Paçoca", emoji: "🥜", vizinhas: ["doce-de-leite", "cookie"],
    sinonimos: ["pacoca", "pe de moleque", "amendoim", "doce de amendoim", "pasta de amendoim"],
    alvo: { docura: 4, densidade: 5, crocancia: 2, cremosidade: 2, chocolate: 0 },
    relevantes: ["docura", "densidade", "crocancia", "cremosidade", "chocolate"],
    chips: [{ id: "original", rotulo: "a paçoca mesmo" }, { id: "colher", rotulo: "de colher", alvo: { cremosidade: 4 } }, { id: "chocolate", rotulo: "com chocolate", alvo: { chocolate: 4 } }] },
  { id: "churros", nome: "Churros", emoji: "🥖", vizinhas: ["cookie", "doce-de-leite"],
    sinonimos: ["churros", "churro", "churrus", "chrros"],
    alvo: { crocancia: 4, docura: 4, maciez: 3, cobertura: 3, chocolate: 0 },
    relevantes: ["crocancia", "docura", "maciez", "cobertura"],
    chips: [{ id: "recheio", rotulo: "com recheio", alvo: { cobertura: 5 } }, C.crocante, C.quente] },
  { id: "cheesecake", nome: "Cheesecake", emoji: "🍰", vizinhas: ["mousse", "pudim"], temperatura: "gelado",
    sinonimos: ["cheesecake", "cheescake", "torta de queijo", "torta gelada"],
    alvo: { cremosidade: 5, docura: 3, crocancia: 2, cobertura: 4, chocolate: 0 },
    relevantes: ["cremosidade", "docura", "crocancia", "cobertura"],
    chips: [{ id: "base", rotulo: "com base crocante", alvo: { crocancia: 3 } }, C.morango, C.gelado] },
  { id: "milkshake", nome: "Milkshake", emoji: "🥤", vizinhas: ["sorvete"], temperatura: "gelado",
    sinonimos: ["milkshake", "milk shake", "shake", "vitamina", "frappe", "frapuccino", "frappuccino"],
    alvo: { cremosidade: 4, docura: 4, chocolate: 3 },
    relevantes: ["cremosidade", "docura", "chocolate"],
    chips: [{ id: "choc", rotulo: "de chocolate", alvo: { chocolate: 5 } }, C.morango, { id: "cafe", rotulo: "de café", aroma: "cafe" }] },
  { id: "bolo-caneca", nome: "Bolo de caneca", emoji: "☕", vizinhas: ["bolo-chocolate", "brownie"],
    sinonimos: ["bolo de caneca", "bolo caneca", "bolo de micro-ondas", "bolo de microondas", "mug cake", "bolo fit", "bolinho"],
    alvo: { maciez: 5, docura: 3, chocolate: 2, umidade: 4, densidade: 2 },
    relevantes: ["maciez", "docura", "chocolate", "umidade", "densidade"],
    chips: [{ id: "choc", rotulo: "de chocolate", alvo: { chocolate: 5 } }, { id: "banana", rotulo: "de banana/canela", aroma: "canela", alvo: { chocolate: 0 } }, C.fofinho] },
];

/** Atalhos da primeira tela. */
export const ATALHOS = ["chocolate", "bolo", "brigadeiro", "sorvete", "cookie", "pudim", "paçoca", "só quero besteira"];

/** Respostas vagas: abrem a pergunta "doce, cremoso, crocante ou fruta?". */
export const VAGAS = ["besteira", "doce", "alguma coisa", "algo doce", "qualquer coisa", "nem sei", "não sei", "nao sei", "sei la", "sei lá", "tanto faz", "qualquer", "sobremesa", "porcaria", "guloseima", "algo"];
export const SALGADOS = ["pizza", "hamburguer", "lanche", "coxinha", "salgadinho", "batata frita", "pastel", "esfiha", "salgado", "sushi", "cachorro quente", "x tudo", "pao de queijo"];
