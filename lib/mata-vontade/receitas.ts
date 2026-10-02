/**
 * Banco de receitas do Mata a Vontade. TODAS em status "em-teste": são
 * proporções de partida, ainda não preparadas e ajustadas. O selo aparece
 * no cartão até alguém testar e a receita passar para "testada".
 *
 * Regras de cozinha respeitadas (Bloco 2): whey nunca substitui farinha 1:1,
 * cada 30 g de whey pede umidade (banana, iogurte, leite, ovo), whey não vai
 * ao fogo direto em creme, micro-ondas com whey 60–90 s, nada de ovo cru.
 * Macros: só quando houver rótulo do whey de referência (concentrado ~80% de proteína).
 */
import type { Perfil, Temperatura } from "./familias";

export type Equip = "micro-ondas" | "air-fryer" | "forno" | "fogao" | "liquidificador" | "nenhum";
export type Marca = "sem-whey" | "sem-lactose" | "sem-ovo" | "sem-gluten" | "vegana" | "original";
export type Objetivo = "proteina" | "leve" | "saciedade" | "menos-acucar" | "simples" | "original" | "gostoso";

export type Ingrediente = { id: string; qtd: string; opcional?: boolean; troca?: string };
export type Receita = {
  id: string;
  familia: string;
  nome: string;
  tempoMin: number;
  /** Espera passiva (geladeira/congelador), em minutos; não conta como preparo. */
  esperaMin?: number;
  equip: Equip;
  perfil: Perfil;
  temperatura: Temperatura;
  aromas?: string[];
  marcas: Marca[];
  /** Força relativa em cada objetivo (0–3). Rótulo de escolha, não número nutricional. */
  forte: Partial<Record<Objetivo, number>>;
  ingredientes: Ingrediente[];
  passos: string[];
  dica?: string;
  status: "em-teste" | "testada";
};

export const INGREDIENTES: Record<string, { nome: string; despensa?: boolean; alergenos?: string[] }> = {
  ovo: { nome: "ovo", despensa: true, alergenos: ["ovo"] },
  banana: { nome: "banana madura", despensa: true },
  "banana-congelada": { nome: "banana congelada" },
  leite: { nome: "leite", despensa: true, alergenos: ["lactose"] },
  "leite-po": { nome: "leite em pó", alergenos: ["lactose"] },
  iogurte: { nome: "iogurte natural", alergenos: ["lactose"] },
  "iogurte-grego": { nome: "iogurte grego/proteico", alergenos: ["lactose"] },
  cottage: { nome: "cottage", alergenos: ["lactose"] },
  "cream-cheese": { nome: "cream cheese", alergenos: ["lactose"] },
  whey: { nome: "whey protein", alergenos: ["lactose"] },
  aveia: { nome: "aveia em flocos", despensa: true, alergenos: ["gluten"] },
  "farinha-trigo": { nome: "farinha de trigo", alergenos: ["gluten"] },
  tapioca: { nome: "goma de tapioca" },
  pao: { nome: "pão de forma", alergenos: ["gluten"] },
  cacau: { nome: "cacau em pó 100%", despensa: true },
  choc70: { nome: "chocolate 70%", alergenos: ["lactose"] }, // pode conter leite
  "choc-leite": { nome: "chocolate ao leite", alergenos: ["lactose"] },
  cafe: { nome: "café solúvel" },
  canela: { nome: "canela", despensa: true },
  agua: { nome: "água", despensa: true },
  sal: { nome: "sal", despensa: true },
  baunilha: { nome: "essência de baunilha" },
  coco: { nome: "coco ralado" },
  "pasta-amendoim": { nome: "pasta de amendoim", alergenos: ["amendoim"] },
  amendoim: { nome: "amendoim torrado", alergenos: ["amendoim"] },
  pacoca: { nome: "paçoca", alergenos: ["amendoim"] },
  morango: { nome: "morango" },
  "frutas-vermelhas": { nome: "frutas vermelhas congeladas" },
  maca: { nome: "maçã" },
  chia: { nome: "chia" },
  adocante: { nome: "adoçante culinário", despensa: true },
  acucar: { nome: "açúcar" },
  mel: { nome: "mel" },
  fermento: { nome: "fermento químico", despensa: true },
  "leite-condensado": { nome: "leite condensado", alergenos: ["lactose"] },
  "doce-de-leite": { nome: "doce de leite", alergenos: ["lactose"] },
  "creme-avela": { nome: "creme de avelã (Nutella)", alergenos: ["lactose", "castanhas"] },
  granola: { nome: "granola", alergenos: ["gluten", "castanhas"] },
  gelo: { nome: "gelo", despensa: true },
};

/**
 * Rótulo "sem-X"/"vegana" nunca pode contradizer os ingredientes (inclusive
 * opcionais): se algum ingrediente carrega o alérgeno, o rótulo cai.
 */
const R = (r: Omit<Receita, "status">): Receita => {
  const alerg = new Set(r.ingredientes.flatMap((i) => INGREDIENTES[i.id]?.alergenos ?? []));
  const marcas = r.marcas.filter((m) => {
    if (m === "vegana") return !alerg.has("lactose") && !alerg.has("ovo") && !alerg.has("mel");
    if (m === "sem-gluten") return !alerg.has("gluten");
    if (m === "sem-lactose") return !alerg.has("lactose");
    if (m === "sem-ovo") return !alerg.has("ovo");
    if (m === "sem-whey") return !r.ingredientes.some((i) => i.id === "whey");
    return true;
  });
  return { ...r, marcas, status: "em-teste" };
};

export const RECEITAS: Receita[] = [
  // ── Bolo de chocolate
  R({ id: "bolo-caneca-vulcao", familia: "bolo-chocolate", nome: "Bolo de caneca vulcão", tempoMin: 3, equip: "micro-ondas",
    perfil: { chocolate: 5, docura: 4, maciez: 5, densidade: 3, umidade: 4, cremosidade: 2, cobertura: 4 }, temperatura: "quente",
    marcas: ["sem-gluten"], forte: { proteina: 3, saciedade: 2, gostoso: 3 },
    ingredientes: [{ id: "ovo", qtd: "1" }, { id: "aveia", qtd: "20 g (2 col. sopa)" }, { id: "whey", qtd: "15 g (sabor chocolate)" }, { id: "cacau", qtd: "10 g (1 col. sopa)" }, { id: "iogurte", qtd: "40 g", troca: "leite (2 col. sopa)" }, { id: "adocante", qtd: "a gosto", opcional: true }, { id: "fermento", qtd: "1/2 col. chá" }, { id: "choc70", qtd: "1 quadradinho (o recheio)" }],
    passos: ["Misture tudo na caneca, menos o fermento e o chocolate.", "Junte o fermento e afunde o quadradinho de chocolate no meio.", "Micro-ondas 60 s; se o centro ainda estiver cru, mais 15 s.", "Espere 1 minuto: o centro derretido é a cobertura."],
    dica: "Uma pitada de café solúvel deixa o chocolate mais intenso.", }),
  R({ id: "bolo-chocolate-forma", familia: "bolo-chocolate", nome: "Bolo de chocolate fofinho de forma", tempoMin: 35, equip: "forno",
    perfil: { chocolate: 4, docura: 4, maciez: 5, densidade: 2, umidade: 4, cremosidade: 1, cobertura: 1 }, temperatura: "ambiente",
    marcas: ["sem-whey"], forte: { simples: 1, gostoso: 3, original: 2 },
    ingredientes: [{ id: "ovo", qtd: "3" }, { id: "banana", qtd: "2 maduras" }, { id: "aveia", qtd: "1 xíc." }, { id: "whey", qtd: "60 g (chocolate)" }, { id: "cacau", qtd: "3 col. sopa" }, { id: "leite", qtd: "1/2 xíc." }, { id: "adocante", qtd: "a gosto" }, { id: "fermento", qtd: "1 col. sopa" }],
    passos: ["Bata tudo no liquidificador, menos o fermento.", "Misture o fermento com a colher.", "Forma untada, forno 180 °C por cerca de 30 min (palito sai limpo).", "Rende 6 fatias: dá para a semana."] }),
  R({ id: "bolo-caneca-choc-sem-ovo", familia: "bolo-chocolate", nome: "Bolo de caneca de chocolate sem ovo", tempoMin: 3, equip: "micro-ondas",
    perfil: { chocolate: 4, docura: 4, maciez: 4, densidade: 3, umidade: 4, cremosidade: 1 }, temperatura: "quente",
    marcas: ["sem-ovo"], forte: { simples: 2, gostoso: 2, proteina: 2 },
    ingredientes: [{ id: "banana", qtd: "1/2 amassada" }, { id: "aveia", qtd: "25 g" }, { id: "whey", qtd: "15 g (chocolate)" }, { id: "cacau", qtd: "1 col. sopa" }, { id: "leite", qtd: "4 col. sopa" }, { id: "fermento", qtd: "1/2 col. chá" }, { id: "adocante", qtd: "a gosto", opcional: true }],
    passos: ["Amasse a banana na caneca e misture o resto, fermento por último.", "Micro-ondas 70–90 s.", "Sem ovo ele fica mais úmido e menos alto: é assim mesmo."] }),
  // ── Brownie
  R({ id: "brownie-caneca", familia: "brownie", nome: "Brownie de caneca denso", tempoMin: 3, equip: "micro-ondas",
    perfil: { chocolate: 5, docura: 4, densidade: 5, maciez: 4, umidade: 4, crocancia: 1, cremosidade: 2 }, temperatura: "quente",
    marcas: ["sem-gluten"], forte: { proteina: 3, saciedade: 3, gostoso: 3 },
    ingredientes: [{ id: "ovo", qtd: "1" }, { id: "pasta-amendoim", qtd: "15 g (1 col. sopa)" }, { id: "cacau", qtd: "15 g" }, { id: "whey", qtd: "15 g (chocolate)" }, { id: "banana", qtd: "30 g (meia pequena)" }, { id: "choc70", qtd: "picado, a gosto", opcional: true }],
    passos: ["Sem fermento: é isso que deixa denso.", "Misture tudo na caneca até ficar uma massa grossa.", "Micro-ondas 50–60 s. Tire ainda úmido no centro.", "Espere 2 minutos para firmar."],
    dica: "Passou do tempo, vira bolo. Menos é mais aqui." }),
  R({ id: "brownie-air-fryer", familia: "brownie", nome: "Brownie de air fryer sem whey", tempoMin: 15, equip: "air-fryer",
    perfil: { chocolate: 5, docura: 4, densidade: 5, maciez: 3, umidade: 3, crocancia: 2 }, temperatura: "quente",
    marcas: ["sem-gluten"], forte: { gostoso: 3, saciedade: 2 },
    ingredientes: [{ id: "ovo", qtd: "2" }, { id: "banana", qtd: "1 madura" }, { id: "cacau", qtd: "3 col. sopa" }, { id: "whey", qtd: "30 g (chocolate)" }, { id: "pasta-amendoim", qtd: "2 col. sopa" }, { id: "choc70", qtd: "30 g picado" }],
    passos: ["Amasse a banana e misture ovos, cacau, whey e pasta de amendoim.", "Junte o chocolate picado.", "Forminha na air fryer 160 °C por 12 min.", "Corte em 4. Casquinha por cima, úmido por dentro."] }),
  R({ id: "brownie-travessa", familia: "brownie", nome: "Brownie de travessa da semana", tempoMin: 30, equip: "forno",
    perfil: { chocolate: 5, docura: 4, densidade: 5, maciez: 3, umidade: 4, crocancia: 2 }, temperatura: "ambiente",
    marcas: ["sem-whey"], forte: { gostoso: 3, original: 2 },
    ingredientes: [{ id: "ovo", qtd: "3" }, { id: "banana", qtd: "2 maduras" }, { id: "aveia", qtd: "3/4 xíc. (farinha de aveia)" }, { id: "whey", qtd: "60 g (chocolate)" }, { id: "cacau", qtd: "1/2 xíc." }, { id: "choc70", qtd: "60 g derretido" }, { id: "adocante", qtd: "a gosto" }],
    passos: ["Misture banana amassada, ovos e chocolate derretido.", "Junte aveia, cacau e whey sem bater demais.", "Travessa forrada, 180 °C por 20–25 min.", "Corte em 8 depois de frio."] }),
  // ── Brigadeiro
  R({ id: "brigadeiro-colher-proteico", familia: "brigadeiro", nome: "Brigadeiro de colher proteico", tempoMin: 2, equip: "nenhum",
    perfil: { chocolate: 5, docura: 4, cremosidade: 5, densidade: 4, maciez: 4 }, temperatura: "ambiente",
    marcas: ["sem-ovo", "sem-gluten"], forte: { proteina: 3, simples: 3, gostoso: 2 },
    ingredientes: [{ id: "whey", qtd: "30 g (chocolate)" }, { id: "cacau", qtd: "10 g" }, { id: "leite-po", qtd: "15 g" }, { id: "leite", qtd: "aos poucos (2–4 col. sopa)" }],
    passos: ["Misture os pós num potinho.", "Vá pingando leite e mexendo até virar creme grosso.", "Não vai ao fogo: whey no fogo talha.", "Se quiser mais firme, 10 min de geladeira."] }),
  R({ id: "brigadeiro-panela-medida", familia: "brigadeiro", nome: "Brigadeiro de colher de verdade, na medida, com whey", tempoMin: 4, equip: "micro-ondas",
    perfil: { chocolate: 5, docura: 5, cremosidade: 4, densidade: 4, maciez: 4 }, temperatura: "ambiente",
    marcas: ["original", "sem-ovo", "sem-gluten"], forte: { original: 3, gostoso: 3, proteina: 1 },
    ingredientes: [{ id: "leite-condensado", qtd: "2 col. sopa (40 g)" }, { id: "cacau", qtd: "1 col. chá" }, { id: "whey", qtd: "15 g (chocolate)" }, { id: "leite", qtd: "1 col. sopa" }, { id: "morango", qtd: "um punhado", opcional: true }],
    passos: ["Misture leite condensado e cacau numa caneca; micro-ondas 30 s, mexa, mais 30 s.", "Espere 1 minuto e misture o whey com o leite até ficar liso (whey direto no calor empelota).", "Coma de colher, com morangos: gosto de brigadeiro de verdade, numa porção que cabe."],
    dica: "Quando a vontade é de brigadeiro mesmo, às vezes o melhor é o próprio." }),
  R({ id: "brigadeiro-banana-cacau", familia: "brigadeiro", nome: "Brigadeiro de banana e cacau", tempoMin: 4, equip: "micro-ondas",
    perfil: { chocolate: 4, docura: 4, cremosidade: 4, densidade: 3, maciez: 4 }, temperatura: "ambiente",
    marcas: ["sem-ovo", "sem-gluten"], forte: { leve: 2, simples: 3, "menos-acucar": 2, proteina: 2 },
    ingredientes: [{ id: "banana", qtd: "1 bem madura" }, { id: "cacau", qtd: "1 col. sopa" }, { id: "whey", qtd: "20 g (chocolate)" }],
    passos: ["Amasse a banana com o cacau num prato fundo.", "Micro-ondas 1 min, mexa, mais 1 min.", "Espere amornar e misture o whey até engrossar. Coma de colher."] }),
  // ── Chocolate
  R({ id: "quadradinhos-morango", familia: "chocolate", nome: "Quadradinhos de chocolate com morango e iogurte proteico", tempoMin: 2, equip: "nenhum",
    perfil: { chocolate: 5, docura: 3, densidade: 3, cremosidade: 1, crocancia: 1 }, temperatura: "ambiente", aromas: ["frutado"],
    marcas: ["original", "sem-whey", "sem-ovo", "sem-gluten"], forte: { original: 3, simples: 3, leve: 2, proteina: 2 },
    ingredientes: [{ id: "choc70", qtd: "20 g (2–3 quadradinhos)", troca: "chocolate ao leite (20 g)" }, { id: "morango", qtd: "um punhado" }, { id: "iogurte-grego", qtd: "1 pote (~120 g)" }],
    passos: ["Pique os quadradinhos por cima do iogurte, não coma do pacote.", "Morango picado junto.", "O chocolate é o original; o iogurte traz a proteína e faz durar mais na colher."] }),
  R({ id: "morango-chocolate-derretido", familia: "chocolate", nome: "Morango com chocolate derretido", tempoMin: 3, equip: "micro-ondas",
    perfil: { chocolate: 5, docura: 4, cremosidade: 3, densidade: 2, cobertura: 5 }, temperatura: "quente", aromas: ["frutado"],
    marcas: ["sem-whey", "sem-ovo", "sem-gluten"], forte: { gostoso: 3, simples: 2, proteina: 2 },
    ingredientes: [{ id: "choc70", qtd: "25 g", troca: "chocolate ao leite" }, { id: "morango", qtd: "8–10" }, { id: "iogurte-grego", qtd: "1 pote (~120 g)" }],
    passos: ["Derreta o chocolate em intervalos de 20 s, mexendo.", "Morangos no iogurte e o chocolate quente por cima: vira casquinha.", "Pode comer na hora ou esperar firmar 10 min."] }),
  R({ id: "chocolate-quente-cremoso", familia: "chocolate", nome: "Chocolate quente cremoso", tempoMin: 4, equip: "micro-ondas",
    perfil: { chocolate: 5, docura: 4, cremosidade: 4, densidade: 2 }, temperatura: "quente",
    marcas: ["sem-ovo", "sem-gluten"], forte: { proteina: 2, gostoso: 3 },
    ingredientes: [{ id: "leite", qtd: "200 ml" }, { id: "cacau", qtd: "1 col. sopa" }, { id: "whey", qtd: "20 g (chocolate)" }, { id: "leite-po", qtd: "1 col. sopa", troca: "sem, fica menos cremoso" }, { id: "adocante", qtd: "a gosto" }, { id: "canela", qtd: "por cima", opcional: true }],
    passos: ["Misture leite, cacau e leite em pó na caneca e aqueça no micro-ondas 1 min 30 s a 2 min.", "Só depois de quente, misture o whey com um mini batedor (whey direto no calor empelota).", "Canela por cima, se tiver."] }),
  // ── Nutella
  R({ id: "colher-nutella-fruta", familia: "nutella", nome: "Uma colher de Nutella com iogurte proteico e fruta", tempoMin: 1, equip: "nenhum",
    perfil: { chocolate: 4, docura: 5, cremosidade: 5, densidade: 3 }, temperatura: "ambiente", aromas: ["frutado"],
    marcas: ["original", "sem-whey", "sem-ovo"], forte: { original: 3, simples: 3, gostoso: 3, proteina: 2 },
    ingredientes: [{ id: "creme-avela", qtd: "1 colher de sopa (15 g)" }, { id: "iogurte-grego", qtd: "1 pote (~120 g)" }, { id: "morango", qtd: "um punhado", troca: "banana em rodelas" }],
    passos: ["Uma colher de sopa no iogurte, só marmorizando (não misture tudo).", "Morango ou banana por cima.", "É o sabor original: o iogurte traz a proteína e a fruta dá volume."],
    dica: "Nada imita Nutella de verdade. Se é ela que você quer, é ela." }),
  R({ id: "creme-cacau-amendoim", familia: "nutella", nome: "Creme de cacau com amendoim (não é Nutella, mas é cremoso)", tempoMin: 2, equip: "nenhum",
    perfil: { chocolate: 4, docura: 3, cremosidade: 5, densidade: 3 }, temperatura: "ambiente", aromas: ["amendoim"],
    marcas: ["sem-ovo", "sem-gluten"], forte: { saciedade: 2, "menos-acucar": 2, proteina: 2 },
    ingredientes: [{ id: "pasta-amendoim", qtd: "1 col. sopa" }, { id: "cacau", qtd: "1 col. chá" }, { id: "whey", qtd: "15 g (chocolate)" }, { id: "adocante", qtd: "a gosto" }, { id: "agua", qtd: "2 col. sopa, aos poucos" }],
    passos: ["Misture tudo até ficar liso.", "Passe na fruta ou coma de colher."] }),
  R({ id: "torrada-nutella-banana", familia: "nutella", nome: "Torrada com Nutella, banana e creme proteico", tempoMin: 4, equip: "nenhum",
    perfil: { chocolate: 4, docura: 5, cremosidade: 4, crocancia: 3, densidade: 3 }, temperatura: "quente",
    marcas: ["original", "sem-whey", "sem-ovo"], forte: { original: 3, saciedade: 2, gostoso: 3, proteina: 2 },
    ingredientes: [{ id: "pao", qtd: "1 fatia" }, { id: "creme-avela", qtd: "1 colher de sopa" }, { id: "cottage", qtd: "3 col. sopa (~60 g)", troca: "iogurte grego" }, { id: "banana", qtd: "1/2 em rodelas" }],
    passos: ["Toste o pão (sanduicheira, frigideira ou torradeira).", "Misture a colher de creme com o cottage e espalhe; cubra com a banana.", "Crocante, quente e com o sabor original."] }),
  // ── Cookie
  R({ id: "cookie-air-fryer", familia: "cookie", nome: "Cookie de air fryer", tempoMin: 10, equip: "air-fryer",
    perfil: { crocancia: 4, maciez: 3, docura: 4, chocolate: 3, densidade: 3 }, temperatura: "quente",
    marcas: ["sem-gluten"], forte: { proteina: 2, gostoso: 3 },
    ingredientes: [{ id: "aveia", qtd: "30 g" }, { id: "whey", qtd: "15 g (baunilha ou cookies)" }, { id: "pasta-amendoim", qtd: "15 g" }, { id: "ovo", qtd: "1 clara" }, { id: "choc70", qtd: "gotas ou picado" }, { id: "fermento", qtd: "1 pitada" }],
    passos: ["Misture até virar massa que dá para modelar.", "Faça 2 discos achatados e espete o chocolate.", "Air fryer 170 °C por 7–8 min.", "Ele endurece ao esfriar: tire ainda macio."] }),
  R({ id: "cookie-aveia-banana", familia: "cookie", nome: "Cookie de aveia e banana", tempoMin: 20, equip: "forno",
    perfil: { crocancia: 3, maciez: 4, docura: 3, chocolate: 2, densidade: 3 }, temperatura: "ambiente", aromas: ["canela"],
    marcas: ["sem-ovo"], forte: { simples: 3, "menos-acucar": 2, proteina: 2 },
    ingredientes: [{ id: "banana", qtd: "2 maduras" }, { id: "aveia", qtd: "1 xíc. (80 g)" }, { id: "whey", qtd: "30 g (baunilha)" }, { id: "canela", qtd: "a gosto" }, { id: "choc70", qtd: "gotas", opcional: true }],
    passos: ["Amasse as bananas e misture a aveia e o whey.", "Colheradas na assadeira, achatando.", "Forno 180 °C por 15 min.", "Rende uns 10."] }),
  R({ id: "cookie-caneca", familia: "cookie", nome: "Cookie de caneca macio", tempoMin: 2, equip: "micro-ondas",
    perfil: { crocancia: 1, maciez: 5, docura: 4, chocolate: 3, densidade: 3 }, temperatura: "quente",
    marcas: ["sem-gluten"], forte: { proteina: 2, simples: 3 },
    ingredientes: [{ id: "aveia", qtd: "25 g" }, { id: "whey", qtd: "15 g (baunilha)" }, { id: "pasta-amendoim", qtd: "10 g" }, { id: "leite", qtd: "2 col. sopa" }, { id: "choc70", qtd: "gotas" }],
    passos: ["Misture tudo na caneca e aperte no fundo.", "Micro-ondas 40–50 s.", "Coma de colher, quente."] }),
  // ── Sorvete
  R({ id: "nice-cream-chocolate", familia: "sorvete", nome: "Sorvete de banana com chocolate (nice cream)", tempoMin: 3, equip: "liquidificador",
    perfil: { cremosidade: 5, docura: 4, chocolate: 4, densidade: 3 }, temperatura: "gelado",
    marcas: ["sem-ovo", "sem-gluten"], forte: { proteina: 3, gostoso: 3, "menos-acucar": 2 },
    ingredientes: [{ id: "banana-congelada", qtd: "2 em rodelas" }, { id: "cacau", qtd: "10 g" }, { id: "whey", qtd: "20 g (chocolate)" }, { id: "leite", qtd: "2–3 col. sopa" }],
    passos: ["Bata a banana congelada com o mínimo de leite, raspando as laterais.", "Junte cacau e whey e bata mais 10 s.", "Textura de sorvete de máquina: coma na hora."],
    dica: "Sem banana congelada? Congele hoje e amanhã está pronto." }),
  R({ id: "sorvete-morango-iogurte", familia: "sorvete", nome: "Sorvete de morango de iogurte", tempoMin: 3, equip: "liquidificador",
    perfil: { cremosidade: 5, docura: 3, chocolate: 0, densidade: 3 }, temperatura: "gelado", aromas: ["frutado"],
    marcas: ["sem-whey", "sem-ovo", "sem-gluten"], forte: { leve: 2, proteina: 2, "menos-acucar": 2 },
    ingredientes: [{ id: "frutas-vermelhas", qtd: "1 xíc. congeladas", troca: "morango congelado" }, { id: "iogurte-grego", qtd: "100 g" }, { id: "adocante", qtd: "a gosto" }],
    passos: ["Bata a fruta congelada com o iogurte bem gelado.", "Pouco líquido: é isso que deixa cremoso.", "Coma na hora."] }),
  R({ id: "picole-iogurte", familia: "sorvete", nome: "Picolé de iogurte proteico com frutas", tempoMin: 5, esperaMin: 240, equip: "nenhum",
    perfil: { cremosidade: 3, docura: 3, chocolate: 0, densidade: 4 }, temperatura: "gelado", aromas: ["frutado"],
    marcas: ["sem-whey", "sem-ovo", "sem-gluten"], forte: { leve: 3, "menos-acucar": 2, simples: 2, proteina: 2 },
    ingredientes: [{ id: "iogurte-grego", qtd: "2 potes (~240 g), rende 3 picolés" }, { id: "morango", qtd: "100 g picado" }, { id: "mel", qtd: "1 col. chá", troca: "adoçante" }],
    passos: ["Misture e coloque em forminhas ou copinhos com palito.", "Congelador por 4 horas.", "É o plano B pronto para a próxima vontade."] }),
  // ── Mousse
  R({ id: "mousse-iogurte-grego", familia: "mousse", nome: "Mousse de chocolate de iogurte grego", tempoMin: 3, equip: "nenhum",
    perfil: { cremosidade: 5, docura: 3, chocolate: 4, maciez: 5, densidade: 2, umidade: 5 }, temperatura: "gelado",
    marcas: ["sem-ovo", "sem-gluten"], forte: { proteina: 3, leve: 2, saciedade: 2 },
    ingredientes: [{ id: "iogurte-grego", qtd: "150 g" }, { id: "whey", qtd: "15 g (chocolate)" }, { id: "cacau", qtd: "5 g" }, { id: "choc70", qtd: "raspas por cima", opcional: true }],
    passos: ["Misture bem até ficar liso e aerado.", "Pronto já; 30 min de geladeira deixa mais firme.", "Raspas de chocolate por cima, se tiver."] }),
  R({ id: "mousse-cottage-cacau", familia: "mousse", nome: "Mousse de cottage e cacau", tempoMin: 3, equip: "liquidificador",
    perfil: { cremosidade: 5, docura: 3, chocolate: 4, maciez: 5, densidade: 3 }, temperatura: "gelado",
    marcas: ["sem-ovo", "sem-gluten"], forte: { proteina: 3, saciedade: 3 },
    ingredientes: [{ id: "cottage", qtd: "150 g" }, { id: "cacau", qtd: "1 col. sopa" }, { id: "whey", qtd: "15 g (chocolate)" }, { id: "adocante", qtd: "a gosto" }],
    passos: ["Bata o cottage com cacau e whey no mixer até sumir todo grão.", "Prove o doce e ajuste.", "Geladeira 20 min, se der."] }),
  R({ id: "mousse-morango", familia: "mousse", nome: "Mousse de morango", tempoMin: 3, equip: "liquidificador",
    perfil: { cremosidade: 5, docura: 3, chocolate: 0, maciez: 5, densidade: 2 }, temperatura: "gelado", aromas: ["frutado"],
    marcas: ["sem-whey", "sem-ovo", "sem-gluten"], forte: { leve: 3, "menos-acucar": 2 },
    ingredientes: [{ id: "iogurte-grego", qtd: "150 g" }, { id: "morango", qtd: "6–8" }, { id: "adocante", qtd: "a gosto" }],
    passos: ["Bata o morango com o iogurte.", "Geladeira 20 min.", "Morango picado por cima."] }),
  // ── Pudim
  R({ id: "pudim-caneca", familia: "pudim", nome: "Pudim de caneca", tempoMin: 5, esperaMin: 60, equip: "micro-ondas",
    perfil: { cremosidade: 5, docura: 4, maciez: 5, chocolate: 0, cobertura: 4, densidade: 3 }, temperatura: "gelado", aromas: ["caramelo", "baunilha"],
    marcas: ["sem-whey", "sem-gluten"], forte: { gostoso: 3, original: 2 },
    ingredientes: [{ id: "ovo", qtd: "1" }, { id: "leite", qtd: "150 ml" }, { id: "leite-po", qtd: "15 g" }, { id: "adocante", qtd: "a gosto" }, { id: "baunilha", qtd: "gotas", opcional: true }, { id: "acucar", qtd: "1 col. chá (só a calda)" }, { id: "agua", qtd: "1 col. sopa (calda)" }],
    passos: ["Calda: açúcar com 1 col. de água na caneca, micro-ondas de 30 em 30 s, olhando, até dourar (1 a 3 min; adoçante não carameliza). Cuidado: a caneca esquenta muito.", "Bata ovo, leite, leite em pó e adoçante e despeje por cima.", "Micro-ondas em potência média, 2 a 3 min, até firmar nas bordas.", "Geladeira 1 hora e desenforme."] }),
  R({ id: "pudim-chia-baunilha", familia: "pudim", nome: "Pudim de chia com baunilha", tempoMin: 3, esperaMin: 120, equip: "nenhum",
    perfil: { cremosidade: 4, docura: 3, maciez: 4, chocolate: 0, densidade: 3 }, temperatura: "gelado", aromas: ["baunilha"],
    marcas: ["sem-ovo", "sem-gluten"], forte: { saciedade: 2, "menos-acucar": 2, simples: 2, proteina: 2 },
    ingredientes: [{ id: "chia", qtd: "2 col. sopa" }, { id: "leite", qtd: "150 ml" }, { id: "whey", qtd: "15 g (baunilha)" }, { id: "baunilha", qtd: "gotas" }, { id: "adocante", qtd: "a gosto" }, { id: "frutas-vermelhas", qtd: "por cima", opcional: true }],
    passos: ["Dissolva o whey no leite e misture a chia; mexa de novo depois de 5 min.", "Geladeira por 2 horas ou de um dia para o outro.", "Frutas por cima na hora de comer."] }),
  // ── Doce de leite
  R({ id: "creme-doce-de-leite", familia: "doce-de-leite", nome: "Creme de doce de leite", tempoMin: 2, equip: "nenhum",
    perfil: { cremosidade: 5, docura: 4, chocolate: 0, densidade: 3 }, temperatura: "gelado", aromas: ["caramelo"],
    marcas: ["sem-ovo", "sem-gluten"], forte: { proteina: 3, leve: 2 },
    ingredientes: [{ id: "iogurte-grego", qtd: "150 g" }, { id: "whey", qtd: "15 g (doce de leite)", troca: "1 col. de leite em pó + canela" }, { id: "canela", qtd: "pitada", opcional: true }, { id: "sal", qtd: "1 pitada", opcional: true }],
    passos: ["Misture até ficar liso.", "Uma pitada de sal realça o sabor de doce de leite.", "Coma gelado de colher."] }),
  R({ id: "doce-de-leite-fruta", familia: "doce-de-leite", nome: "Uma colher de doce de leite com maçã e iogurte proteico", tempoMin: 1, equip: "nenhum",
    perfil: { cremosidade: 5, docura: 5, chocolate: 0, densidade: 4, crocancia: 2 }, temperatura: "ambiente", aromas: ["caramelo", "frutado"],
    marcas: ["original", "sem-whey", "sem-ovo", "sem-gluten"], forte: { original: 3, simples: 3, gostoso: 3, proteina: 2 },
    ingredientes: [{ id: "doce-de-leite", qtd: "1 colher de sopa" }, { id: "iogurte-grego", qtd: "1 pote (~120 g)" }, { id: "maca", qtd: "1/2 em fatias", troca: "banana" }],
    passos: ["Iogurte no pote e a colher de doce de leite por cima.", "Fatias de maçã para mergulhar.", "O sabor é o original; o iogurte traz a proteína e a fruta dá crocância."] }),
  // ── Paçoca
  R({ id: "pacoca-colher", familia: "pacoca", nome: "Paçoca de colher", tempoMin: 2, equip: "nenhum",
    perfil: { docura: 4, densidade: 4, crocancia: 1, cremosidade: 4, chocolate: 0 }, temperatura: "ambiente", aromas: ["amendoim"],
    marcas: ["sem-ovo", "sem-gluten"], forte: { proteina: 2, saciedade: 3, simples: 3 },
    ingredientes: [{ id: "pasta-amendoim", qtd: "15 g" }, { id: "leite-po", qtd: "15 g" }, { id: "whey", qtd: "15 g (baunilha)" }, { id: "adocante", qtd: "a gosto" }, { id: "sal", qtd: "1 pitada", opcional: true }],
    passos: ["Misture pasta de amendoim, leite em pó e whey até virar uma farofa úmida.", "Uma pitada de sal: é o segredo do gosto de paçoca.", "Coma de colher."] }),
  R({ id: "pacoca-original-iogurte", familia: "pacoca", nome: "Uma paçoca com iogurte proteico", tempoMin: 1, equip: "nenhum",
    perfil: { docura: 4, densidade: 4, crocancia: 2, cremosidade: 3, chocolate: 0 }, temperatura: "ambiente", aromas: ["amendoim"],
    marcas: ["original", "sem-whey", "sem-ovo"], forte: { original: 3, simples: 3, proteina: 2 },
    ingredientes: [{ id: "pacoca", qtd: "1 unidade" }, { id: "iogurte-grego", qtd: "1 pote (~120 g)" }],
    passos: ["Esfarele a paçoca por cima do iogurte.", "É paçoca de verdade, num pote que dura mais na colher."] }),
  R({ id: "bombom-pacoca", familia: "pacoca", nome: "Bombom de paçoca com casquinha de chocolate", tempoMin: 10, esperaMin: 10, equip: "micro-ondas",
    perfil: { docura: 4, densidade: 5, crocancia: 2, cremosidade: 2, chocolate: 4 }, temperatura: "ambiente", aromas: ["amendoim"],
    marcas: ["sem-ovo", "sem-gluten"], forte: { gostoso: 3, saciedade: 2 },
    ingredientes: [{ id: "amendoim", qtd: "30 g moído", troca: "pasta de amendoim" }, { id: "leite-po", qtd: "20 g" }, { id: "whey", qtd: "20 g (baunilha)" }, { id: "choc70", qtd: "30 g para a casquinha" }],
    passos: ["Misture amendoim, leite em pó e whey e enrole 4 bolinhas.", "Derreta o chocolate (20 s por vez) e passe as bolinhas.", "Geladeira 10 min para a casquinha firmar."] }),
  // ── Churros
  R({ id: "churros-air-fryer", familia: "churros", nome: "Churros de air fryer", tempoMin: 12, equip: "air-fryer",
    perfil: { crocancia: 4, docura: 4, maciez: 3, cobertura: 2, chocolate: 0 }, temperatura: "quente", aromas: ["canela"],
    marcas: ["sem-gluten"], forte: { gostoso: 3, original: 2, proteina: 1 },
    ingredientes: [{ id: "tapioca", qtd: "1 tapioca pronta", troca: "pão de forma sem casca, enrolado" }, { id: "canela", qtd: "a gosto" }, { id: "acucar", qtd: "1 col. chá (só a casquinha)" }, { id: "doce-de-leite", qtd: "1 col. sopa" }, { id: "whey", qtd: "15 g (baunilha)" }, { id: "leite", qtd: "1–2 col. sopa" }],
    passos: ["Enrole a tapioca bem apertada e corte em palitos.", "Air fryer 180 °C por 6–8 min, até dourar.", "Passe na mistura de canela e açúcar ainda quente.", "Calda: doce de leite + whey + leite, mexidos até lisos. Mergulhe os churros."] }),
  R({ id: "banana-churros", familia: "churros", nome: "Banana churros", tempoMin: 10, equip: "air-fryer",
    perfil: { crocancia: 3, docura: 5, maciez: 4, cobertura: 4, chocolate: 0 }, temperatura: "quente", aromas: ["canela"],
    marcas: ["sem-ovo", "sem-gluten"], forte: { simples: 2, gostoso: 3, "menos-acucar": 1 },
    ingredientes: [{ id: "banana", qtd: "1 em rodelas grossas" }, { id: "canela", qtd: "a gosto" }, { id: "iogurte-grego", qtd: "2 col. sopa" }, { id: "whey", qtd: "15 g (doce de leite ou baunilha)" }],
    passos: ["Banana com canela na air fryer, 180 °C por 8 min.", "Misture iogurte e whey: é o creme de doce de leite.", "Banana quente, creme gelado."] }),
  // ── Cheesecake
  R({ id: "cheesecake-pote", familia: "cheesecake", nome: "Cheesecake de pote", tempoMin: 4, equip: "nenhum",
    perfil: { cremosidade: 5, docura: 3, crocancia: 3, cobertura: 4, chocolate: 0 }, temperatura: "gelado", aromas: ["frutado", "baunilha"],
    marcas: ["sem-whey", "sem-ovo"], forte: { proteina: 2, gostoso: 3 },
    ingredientes: [{ id: "iogurte-grego", qtd: "120 g", troca: "cottage batido" }, { id: "cream-cheese", qtd: "20 g" }, { id: "baunilha", qtd: "gotas" }, { id: "aveia", qtd: "2 col. sopa tostada (base)", troca: "granola" }, { id: "frutas-vermelhas", qtd: "por cima" }, { id: "adocante", qtd: "a gosto" }],
    passos: ["Base: aveia crua ou granola. Se der, toste a aveia 2 min na frigideira seca, fica mais crocante.", "Misture iogurte, cream cheese, baunilha e adoçante.", "Monte: base, creme, frutas.", "Geladeira 15 min, se der."] }),
  R({ id: "cheesecake-caneca", familia: "cheesecake", nome: "Cheesecake de caneca assado", tempoMin: 4, esperaMin: 60, equip: "micro-ondas",
    perfil: { cremosidade: 4, docura: 3, crocancia: 0, cobertura: 3, chocolate: 0, maciez: 4 }, temperatura: "gelado", aromas: ["baunilha"],
    marcas: ["sem-whey", "sem-gluten"], forte: { gostoso: 3, original: 2 },
    ingredientes: [{ id: "cream-cheese", qtd: "40 g" }, { id: "iogurte-grego", qtd: "60 g" }, { id: "ovo", qtd: "1" }, { id: "baunilha", qtd: "gotas" }, { id: "adocante", qtd: "a gosto" }, { id: "frutas-vermelhas", qtd: "por cima", opcional: true }],
    passos: ["Misture tudo bem liso.", "Micro-ondas potência média 90 s, mais 30 s se o centro balançar muito.", "Geladeira 1 hora: é aí que vira cheesecake."] }),
  // ── Milkshake
  R({ id: "milkshake-proteico", familia: "milkshake", nome: "Milkshake proteico de chocolate", tempoMin: 2, equip: "liquidificador",
    perfil: { cremosidade: 4, docura: 4, chocolate: 4 }, temperatura: "gelado",
    marcas: ["sem-ovo", "sem-gluten"], forte: { proteina: 3, saciedade: 2, simples: 3 },
    ingredientes: [{ id: "leite", qtd: "200 ml gelado" }, { id: "whey", qtd: "30 g (chocolate)" }, { id: "banana-congelada", qtd: "1", troca: "banana + gelo" }, { id: "gelo", qtd: "3 pedras" }],
    passos: ["Bata tudo por 30 s.", "A banana congelada é o que dá cara de milkshake.", "Canudo grosso."] }),
  R({ id: "milkshake-morango", familia: "milkshake", nome: "Milkshake de morango sem whey", tempoMin: 2, equip: "liquidificador",
    perfil: { cremosidade: 4, docura: 4, chocolate: 0 }, temperatura: "gelado", aromas: ["frutado"],
    marcas: ["sem-ovo", "sem-gluten"], forte: { leve: 2, simples: 3 },
    ingredientes: [{ id: "leite", qtd: "200 ml gelado" }, { id: "frutas-vermelhas", qtd: "1 xíc. congelada", troca: "morango + gelo" }, { id: "whey", qtd: "20 g (morango ou baunilha)" }, { id: "leite-po", qtd: "1 col. sopa" }, { id: "adocante", qtd: "a gosto" }],
    passos: ["Bata tudo, com o whey.", "O leite em pó deixa com gosto de sorveteria."] }),
  R({ id: "frappe-cafe", familia: "milkshake", nome: "Frappé de café gelado", tempoMin: 2, equip: "liquidificador",
    perfil: { cremosidade: 4, docura: 3, chocolate: 1 }, temperatura: "gelado", aromas: ["cafe"],
    marcas: ["sem-ovo", "sem-gluten"], forte: { proteina: 2, simples: 3 },
    ingredientes: [{ id: "leite", qtd: "150 ml" }, { id: "cafe", qtd: "1 col. chá" }, { id: "whey", qtd: "20 g (baunilha)" }, { id: "gelo", qtd: "1 copo" }, { id: "adocante", qtd: "a gosto" }, { id: "cacau", qtd: "1 pitada (mocha)", opcional: true }],
    passos: ["Bata tudo com bastante gelo.", "Cacau por cima, se quiser um mocha."] }),
  // ── Bolo de caneca
  R({ id: "bolo-caneca-baunilha", familia: "bolo-caneca", nome: "Bolo de caneca de baunilha", tempoMin: 3, equip: "micro-ondas",
    perfil: { maciez: 5, docura: 3, chocolate: 0, umidade: 4, densidade: 2 }, temperatura: "quente", aromas: ["baunilha"],
    marcas: ["sem-gluten"], forte: { proteina: 3, simples: 3 },
    ingredientes: [{ id: "ovo", qtd: "1" }, { id: "aveia", qtd: "20 g" }, { id: "whey", qtd: "15 g (baunilha)" }, { id: "banana", qtd: "30 g" }, { id: "fermento", qtd: "1/2 col. chá" }],
    passos: ["Amasse a banana na caneca e misture o resto.", "Fermento por último.", "Micro-ondas 60–75 s."] }),
  R({ id: "bolo-caneca-banana-canela", familia: "bolo-caneca", nome: "Bolo de caneca de banana e canela", tempoMin: 3, equip: "micro-ondas",
    perfil: { maciez: 5, docura: 4, chocolate: 0, umidade: 5, densidade: 2 }, temperatura: "quente", aromas: ["canela"],
    marcas: ["sem-gluten"], forte: { simples: 3, "menos-acucar": 2 },
    ingredientes: [{ id: "ovo", qtd: "1" }, { id: "banana", qtd: "1/2 bem madura" }, { id: "aveia", qtd: "3 col. sopa (25–30 g)" }, { id: "whey", qtd: "15 g (baunilha)" }, { id: "canela", qtd: "a gosto" }, { id: "fermento", qtd: "1/2 col. chá" }],
    passos: ["Amasse a banana, misture ovo, aveia, whey e canela.", "Fermento por último.", "Micro-ondas 70–90 s. Cheiro de bolo de vó."] }),
];
