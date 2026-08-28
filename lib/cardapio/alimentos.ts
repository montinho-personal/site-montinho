/**
 * Monte seu Cardápio — banco de alimentos.
 *
 * Fonte única de verdade nutricional da ferramenta. Nenhum número de
 * caloria ou macro vive no componente ou no motor — tudo mora aqui, com
 * ficha por alimento, no mesmo padrão de lib/proteina.ts.
 *
 * Três decisões estruturais:
 *
 * 1. BRASIL-FIRST. A base é o que aparece no prato brasileiro — arroz,
 *    feijão, frango, ovo, pão francês, tapioca, cuscuz — e não quinoa e
 *    salmão. O melhor cardápio não é o mais sofisticado; é o que a pessoa
 *    consegue seguir com o que já compra.
 *
 * 2. ESTADO SEMPRE DECLARADO. "100 g de arroz" cru e cozido são comidas
 *    diferentes (o cru tem ~3x as calorias por grama). Todo alimento aqui
 *    diz em que estado o valor vale, e o nome exibido carrega o estado.
 *
 * 3. PORÇÕES HUMANAS. Cada alimento tem uma porção caseira (1 ovo, 1 fatia,
 *    1 concha) com o peso dela, e o motor só trabalha em múltiplos dessa
 *    porção — nunca "137 g de banana".
 *
 * Fonte: TACO 4ª ed. (NEPA/Unicamp). Os alimentos com `verificadoEm` foram
 * conferidos contra a base nesta sessão ou nas anteriores; os demais usam os
 * valores da TACO amplamente reproduzidos na literatura e estão marcados
 * como não conferidos — melhor uma ficha honesta que uma conferência
 * fingida. Industrializados de marca (whey, requeijão) usam valor típico de
 * rótulo com a ressalva embutida no nome da fonte.
 */

export type Momento = "cafe" | "almoco" | "lanche" | "jantar" | "ceia";

export type Restricao =
  | "lactose"
  | "ovo"
  | "gluten"
  | "frango"
  | "carne-bovina"
  | "peixe"
  | "frutos-mar";

export const RESTRICOES: { id: Restricao; rotulo: string }[] = [
  { id: "lactose", rotulo: "Leite e derivados" },
  { id: "ovo", rotulo: "Ovos" },
  { id: "gluten", rotulo: "Glúten" },
  { id: "frango", rotulo: "Frango" },
  { id: "carne-bovina", rotulo: "Carne bovina" },
  { id: "peixe", rotulo: "Peixe" },
  { id: "frutos-mar", rotulo: "Frutos do mar" },
];

export type Dieta = "onivoro" | "vegetariano" | "vegano";

/**
 * Grupos de substituição. Um alimento só troca por outro do mesmo grupo —
 * e a porção do substituto é recalculada pelas calorias, não pelo peso:
 * 100 g de arroz não equivalem a 100 g de batata.
 */
export type Grupo =
  | "proteina-animal"
  | "proteina-vegetal"
  | "carbo-base"
  | "leguminosa"
  | "pao-cereal"
  | "fruta"
  | "lacteo"
  | "vegetal"
  | "gordura";

export interface AlimentoCardapio {
  id: string;
  /** Nome exibido — já carrega o estado quando ele muda o valor. */
  nome: string;
  grupo: Grupo;
  /** Em que refeições o alimento faz sentido culturalmente. */
  momentos: Momento[];
  /** Restrições que EXCLUEM este alimento. */
  exclusoes: Restricao[];
  /** true = serve para vegetarianos; veganos exigem os dois true. */
  vegetariano: boolean;
  vegano: boolean;
  kcal100: number;
  prot100: number;
  carb100: number;
  gord100: number;
  /** A porção caseira: rótulo humano + gramas que ela pesa. */
  porcao: { rotulo: string; g: number };
  /** Passo de ajuste em porções (0.5 = meia porção é aceitável). */
  passo: number;
  maxPorcoes: number;
  estado: "cozido" | "cru" | "pronto para consumo" | "grelhado";
  fonte: string;
  /** Presente só quando o valor foi conferido contra a fonte. */
  verificadoEm?: string;
  /**
   * Só entra no cardápio se a pessoa marcou que consome. Existe para o
   * whey: é legítimo para quem já usa, mas uma ferramenta que sugere
   * suplemento por padrão vira propaganda de suplemento.
   */
  soHabitual?: boolean;
}

const TACO = "TACO 4ª ed. (NEPA/Unicamp)";
const ROTULO = "valor típico de rótulo — varia por marca";

export const ALIMENTOS_CARDAPIO: AlimentoCardapio[] = [
  // ── Proteínas animais ──────────────────────────────────────────────────
  { id: "frango-grelhado", nome: "Peito de frango grelhado", grupo: "proteina-animal", momentos: ["almoco", "jantar"], exclusoes: ["frango"], vegetariano: false, vegano: false, kcal100: 159, prot100: 32, carb100: 0, gord100: 2.5, porcao: { rotulo: "1 filé médio", g: 100 }, passo: 0.5, maxPorcoes: 3, estado: "grelhado", fonte: TACO, verificadoEm: "2026-08-28" },
  { id: "patinho-grelhado", nome: "Carne bovina (patinho) grelhada", grupo: "proteina-animal", momentos: ["almoco", "jantar"], exclusoes: ["carne-bovina"], vegetariano: false, vegano: false, kcal100: 219, prot100: 35.9, carb100: 0, gord100: 7.3, porcao: { rotulo: "1 bife médio", g: 100 }, passo: 0.5, maxPorcoes: 3, estado: "grelhado", fonte: TACO, verificadoEm: "2026-08-28" },
  { id: "carne-moida", nome: "Carne moída refogada", grupo: "proteina-animal", momentos: ["almoco", "jantar"], exclusoes: ["carne-bovina"], vegetariano: false, vegano: false, kcal100: 212, prot100: 26.7, carb100: 0, gord100: 10.9, porcao: { rotulo: "4 colheres de sopa", g: 100 }, passo: 0.5, maxPorcoes: 3, estado: "pronto para consumo", fonte: TACO },
  { id: "tilapia-grelhada", nome: "Filé de tilápia grelhado", grupo: "proteina-animal", momentos: ["almoco", "jantar"], exclusoes: ["peixe"], vegetariano: false, vegano: false, kcal100: 128, prot100: 26, carb100: 0, gord100: 2.6, porcao: { rotulo: "1 filé médio", g: 100 }, passo: 0.5, maxPorcoes: 3, estado: "grelhado", fonte: TACO },
  { id: "sardinha-lata", nome: "Sardinha em conserva (escorrida)", grupo: "proteina-animal", momentos: ["almoco", "jantar", "lanche"], exclusoes: ["peixe"], vegetariano: false, vegano: false, kcal100: 285, prot100: 15.9, carb100: 0, gord100: 24, porcao: { rotulo: "1 lata pequena", g: 84 }, passo: 0.5, maxPorcoes: 2, estado: "pronto para consumo", fonte: TACO },
  { id: "ovo-cozido", nome: "Ovo cozido", grupo: "proteina-animal", momentos: ["cafe", "almoco", "lanche", "jantar"], exclusoes: ["ovo"], vegetariano: true, vegano: false, kcal100: 146, prot100: 13.3, carb100: 0.6, gord100: 9.5, porcao: { rotulo: "1 ovo", g: 50 }, passo: 1, maxPorcoes: 3, estado: "cozido", fonte: TACO, verificadoEm: "2026-08-28" },
  { id: "ovo-mexido", nome: "Ovos mexidos", grupo: "proteina-animal", momentos: ["cafe", "jantar"], exclusoes: ["ovo"], vegetariano: true, vegano: false, kcal100: 146, prot100: 13.3, carb100: 0.6, gord100: 9.5, porcao: { rotulo: "1 ovo", g: 50 }, passo: 1, maxPorcoes: 3, estado: "pronto para consumo", fonte: TACO },

  // ── Proteínas vegetais ─────────────────────────────────────────────────
  { id: "tofu", nome: "Tofu", grupo: "proteina-vegetal", momentos: ["almoco", "jantar", "cafe"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 64, prot100: 6.6, carb100: 2.1, gord100: 4, porcao: { rotulo: "1 fatia grossa", g: 100 }, passo: 0.5, maxPorcoes: 3, estado: "pronto para consumo", fonte: TACO, verificadoEm: "2026-08-28" },
  { id: "grao-de-bico", nome: "Grão-de-bico cozido", grupo: "proteina-vegetal", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 164, prot100: 8.9, carb100: 27.4, gord100: 2.6, porcao: { rotulo: "1 concha", g: 100 }, passo: 0.5, maxPorcoes: 3, estado: "cozido", fonte: TACO },
  { id: "pts", nome: "Proteína de soja texturizada (hidratada)", grupo: "proteina-vegetal", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 115, prot100: 17, carb100: 9, gord100: 0.6, porcao: { rotulo: "4 colheres de sopa", g: 100 }, passo: 0.5, maxPorcoes: 3, estado: "pronto para consumo", fonte: ROTULO },

  // ── Carboidratos de prato ──────────────────────────────────────────────
  { id: "arroz-branco", nome: "Arroz branco cozido", grupo: "carbo-base", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 128, prot100: 2.5, carb100: 28.1, gord100: 0.2, porcao: { rotulo: "1 escumadeira", g: 100 }, passo: 0.5, maxPorcoes: 4, estado: "cozido", fonte: TACO, verificadoEm: "2026-08-28" },
  { id: "arroz-integral", nome: "Arroz integral cozido", grupo: "carbo-base", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 124, prot100: 2.6, carb100: 25.8, gord100: 1, porcao: { rotulo: "1 escumadeira", g: 100 }, passo: 0.5, maxPorcoes: 4, estado: "cozido", fonte: TACO },
  { id: "batata-cozida", nome: "Batata inglesa cozida", grupo: "carbo-base", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 52, prot100: 1.2, carb100: 11.9, gord100: 0, porcao: { rotulo: "1 batata média", g: 140 }, passo: 0.5, maxPorcoes: 4, estado: "cozido", fonte: TACO, verificadoEm: "2026-08-28" },
  { id: "batata-doce", nome: "Batata-doce cozida", grupo: "carbo-base", momentos: ["almoco", "jantar", "lanche"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 77, prot100: 0.6, carb100: 18.4, gord100: 0.1, porcao: { rotulo: "1 pedaço médio", g: 100 }, passo: 0.5, maxPorcoes: 4, estado: "cozido", fonte: TACO },
  { id: "mandioca", nome: "Mandioca cozida", grupo: "carbo-base", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 125, prot100: 0.6, carb100: 30.1, gord100: 0.3, porcao: { rotulo: "1 pedaço médio", g: 100 }, passo: 0.5, maxPorcoes: 3, estado: "cozido", fonte: TACO },
  { id: "macarrao", nome: "Macarrão cozido", grupo: "carbo-base", momentos: ["almoco", "jantar"], exclusoes: ["gluten"], vegetariano: true, vegano: true, kcal100: 102, prot100: 3.4, carb100: 19.9, gord100: 0.6, porcao: { rotulo: "1 pegador", g: 110 }, passo: 0.5, maxPorcoes: 4, estado: "cozido", fonte: TACO, verificadoEm: "2026-08-28" },

  // ── Leguminosas ────────────────────────────────────────────────────────
  { id: "feijao-carioca", nome: "Feijão carioca cozido", grupo: "leguminosa", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 76, prot100: 4.8, carb100: 13.6, gord100: 0.5, porcao: { rotulo: "1 concha média", g: 86 }, passo: 0.5, maxPorcoes: 3, estado: "cozido", fonte: TACO, verificadoEm: "2026-08-28" },
  { id: "feijao-preto", nome: "Feijão preto cozido", grupo: "leguminosa", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 77, prot100: 4.5, carb100: 14, gord100: 0.5, porcao: { rotulo: "1 concha média", g: 86 }, passo: 0.5, maxPorcoes: 3, estado: "cozido", fonte: TACO },
  { id: "lentilha", nome: "Lentilha cozida", grupo: "leguminosa", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 93, prot100: 6.3, carb100: 16.3, gord100: 0.5, porcao: { rotulo: "1 concha média", g: 86 }, passo: 0.5, maxPorcoes: 3, estado: "cozido", fonte: TACO, verificadoEm: "2026-08-28" },

  // ── Pães e cereais ─────────────────────────────────────────────────────
  { id: "pao-frances", nome: "Pão francês", grupo: "pao-cereal", momentos: ["cafe", "lanche"], exclusoes: ["gluten"], vegetariano: true, vegano: true, kcal100: 300, prot100: 8, carb100: 58.6, gord100: 3.1, porcao: { rotulo: "1 unidade", g: 50 }, passo: 0.5, maxPorcoes: 3, estado: "pronto para consumo", fonte: TACO },
  { id: "pao-integral", nome: "Pão de forma integral", grupo: "pao-cereal", momentos: ["cafe", "lanche"], exclusoes: ["gluten"], vegetariano: true, vegano: true, kcal100: 253, prot100: 9.4, carb100: 49.9, gord100: 2.9, porcao: { rotulo: "1 fatia", g: 25 }, passo: 1, maxPorcoes: 6, estado: "pronto para consumo", fonte: TACO },
  { id: "aveia", nome: "Aveia em flocos", grupo: "pao-cereal", momentos: ["cafe", "lanche", "ceia"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 394, prot100: 13.9, carb100: 66.6, gord100: 8.5, porcao: { rotulo: "2 colheres de sopa", g: 30 }, passo: 0.5, maxPorcoes: 3, estado: "cru", fonte: TACO },
  { id: "tapioca", nome: "Tapioca (goma hidratada)", grupo: "pao-cereal", momentos: ["cafe", "lanche"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 240, prot100: 0, carb100: 59, gord100: 0, porcao: { rotulo: "1 tapioca média", g: 60 }, passo: 0.5, maxPorcoes: 2, estado: "pronto para consumo", fonte: ROTULO },
  { id: "cuscuz", nome: "Cuscuz de milho cozido", grupo: "pao-cereal", momentos: ["cafe", "jantar", "lanche"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 113, prot100: 2.2, carb100: 25.3, gord100: 0.7, porcao: { rotulo: "1 fatia média", g: 135 }, passo: 0.5, maxPorcoes: 3, estado: "cozido", fonte: TACO },

  // ── Frutas ─────────────────────────────────────────────────────────────
  { id: "banana", nome: "Banana", grupo: "fruta", momentos: ["cafe", "lanche", "ceia"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 92, prot100: 1.3, carb100: 23.8, gord100: 0.1, porcao: { rotulo: "1 banana média", g: 90 }, passo: 1, maxPorcoes: 2, estado: "cru", fonte: TACO },
  { id: "maca", nome: "Maçã", grupo: "fruta", momentos: ["cafe", "lanche", "ceia"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 56, prot100: 0.3, carb100: 15.2, gord100: 0, porcao: { rotulo: "1 maçã média", g: 130 }, passo: 1, maxPorcoes: 2, estado: "cru", fonte: TACO },
  { id: "mamao", nome: "Mamão papaia", grupo: "fruta", momentos: ["cafe", "lanche", "ceia"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 40, prot100: 0.5, carb100: 10.4, gord100: 0.1, porcao: { rotulo: "1/2 papaia", g: 155 }, passo: 0.5, maxPorcoes: 2, estado: "cru", fonte: TACO },
  { id: "laranja", nome: "Laranja", grupo: "fruta", momentos: ["cafe", "lanche"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 45, prot100: 1, carb100: 11.5, gord100: 0.1, porcao: { rotulo: "1 laranja média", g: 140 }, passo: 1, maxPorcoes: 2, estado: "cru", fonte: TACO },

  // ── Lácteos e afins ────────────────────────────────────────────────────
  { id: "iogurte-natural", nome: "Iogurte natural", grupo: "lacteo", momentos: ["cafe", "lanche", "ceia"], exclusoes: ["lactose"], vegetariano: true, vegano: false, kcal100: 51, prot100: 4.1, carb100: 1.9, gord100: 3, porcao: { rotulo: "1 pote", g: 170 }, passo: 0.5, maxPorcoes: 2, estado: "pronto para consumo", fonte: TACO, verificadoEm: "2026-08-28" },
  { id: "leite-integral", nome: "Leite integral", grupo: "lacteo", momentos: ["cafe", "ceia"], exclusoes: ["lactose"], vegetariano: true, vegano: false, kcal100: 60, prot100: 3.2, carb100: 4.6, gord100: 3.3, porcao: { rotulo: "1 copo", g: 200 }, passo: 0.5, maxPorcoes: 2, estado: "pronto para consumo", fonte: TACO },
  { id: "queijo-minas", nome: "Queijo minas frescal", grupo: "lacteo", momentos: ["cafe", "lanche"], exclusoes: ["lactose"], vegetariano: true, vegano: false, kcal100: 264, prot100: 17.4, carb100: 3.2, gord100: 20.2, porcao: { rotulo: "1 fatia média", g: 30 }, passo: 1, maxPorcoes: 4, estado: "pronto para consumo", fonte: TACO, verificadoEm: "2026-08-28" },
  { id: "whey", nome: "Whey protein (1 dose)", grupo: "lacteo", momentos: ["cafe", "lanche", "ceia"], exclusoes: ["lactose"], vegetariano: true, vegano: false, kcal100: 400, prot100: 76.7, carb100: 10, gord100: 5, porcao: { rotulo: "1 dose (scoop)", g: 30 }, passo: 0.5, maxPorcoes: 2, estado: "pronto para consumo", fonte: ROTULO, soHabitual: true },
  { id: "leite-vegetal", nome: "Bebida vegetal (soja)", grupo: "lacteo", momentos: ["cafe", "ceia"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 40, prot100: 2.5, carb100: 3.5, gord100: 1.7, porcao: { rotulo: "1 copo", g: 200 }, passo: 0.5, maxPorcoes: 2, estado: "pronto para consumo", fonte: ROTULO },

  // ── Vegetais ───────────────────────────────────────────────────────────
  { id: "salada-crua", nome: "Salada crua (folhas e tomate)", grupo: "vegetal", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 20, prot100: 1.2, carb100: 3.5, gord100: 0.2, porcao: { rotulo: "1 prato de sobremesa", g: 80 }, passo: 1, maxPorcoes: 2, estado: "cru", fonte: TACO },
  { id: "legumes-cozidos", nome: "Legumes cozidos (cenoura, abobrinha)", grupo: "vegetal", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 35, prot100: 1.1, carb100: 7.5, gord100: 0.2, porcao: { rotulo: "4 colheres de sopa", g: 100 }, passo: 1, maxPorcoes: 2, estado: "cozido", fonte: TACO },
  { id: "brocolis", nome: "Brócolis cozido", grupo: "vegetal", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 25, prot100: 2.1, carb100: 4.4, gord100: 0.5, porcao: { rotulo: "4 buquês", g: 80 }, passo: 1, maxPorcoes: 2, estado: "cozido", fonte: TACO },

  // ── Gorduras ───────────────────────────────────────────────────────────
  { id: "azeite", nome: "Azeite de oliva", grupo: "gordura", momentos: ["almoco", "jantar"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 884, prot100: 0, carb100: 0, gord100: 100, porcao: { rotulo: "1 colher de sopa", g: 8 }, passo: 0.5, maxPorcoes: 2, estado: "pronto para consumo", fonte: TACO },
  { id: "pasta-amendoim", nome: "Pasta de amendoim", grupo: "gordura", momentos: ["cafe", "lanche", "ceia"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 589, prot100: 22.5, carb100: 21.6, gord100: 49.9, porcao: { rotulo: "1 colher de sopa", g: 15 }, passo: 0.5, maxPorcoes: 3, estado: "pronto para consumo", fonte: ROTULO },
  { id: "abacate", nome: "Abacate", grupo: "gordura", momentos: ["cafe", "lanche", "ceia"], exclusoes: [], vegetariano: true, vegano: true, kcal100: 96, prot100: 1.2, carb100: 6, gord100: 8.4, porcao: { rotulo: "2 colheres de sopa", g: 60 }, passo: 0.5, maxPorcoes: 2, estado: "cru", fonte: TACO },
];

export const ALIMENTO_CARDAPIO_POR_ID = new Map(ALIMENTOS_CARDAPIO.map((a) => [a.id, a]));

/** Nutrientes de N porções de um alimento. */
export function nutrientes(a: AlimentoCardapio, porcoes: number) {
  const g = a.porcao.g * porcoes;
  const f = g / 100;
  return { g, kcal: a.kcal100 * f, prot: a.prot100 * f, carb: a.carb100 * f, gord: a.gord100 * f };
}

/** Rótulo humano: "2 ovos", "1,5 escumadeira (~150 g)". */
export function rotuloPorcao(a: AlimentoCardapio, porcoes: number): string {
  const g = Math.round(a.porcao.g * porcoes);
  const n = Number.isInteger(porcoes) ? String(porcoes) : porcoes.toFixed(1).replace(".", ",");
  /**
   * Pluralização: "1 filé médio" → "2 filés médios". Cada palavra recebe o
   * plural (r → +es, vogal → +s), pulando conectivos. Rótulos com "de"
   * ("colher de sopa") ou não inteiros usam a forma "N× rótulo", que nunca
   * erra — melhor um × a mais que um "colheres des sopas".
   */
  const base = a.porcao.rotulo.replace(/^1\s+/, "");
  const pluralizavel = /^1\s/.test(a.porcao.rotulo) && !/\sde\s|\d/.test(base);
  const pluraliza = (palavra: string) =>
    palavra.endsWith("s") ? palavra : palavra.endsWith("r") ? `${palavra}es` : `${palavra}s`;
  const plural =
    porcoes === 1
      ? a.porcao.rotulo
      : pluralizavel && Number.isInteger(porcoes)
        ? `${n} ${base.split(" ").map(pluraliza).join(" ")}`
        : /**
           * Forma "N×": usa a porção SEM o "1" da frente, senão sai
           * "1,5× 1 unidade", que faz o leitor multiplicar duas vezes.
           * Rótulos que já começam com outro número ("4 colheres") ficam
           * inteiros — ali o número faz parte da medida.
           */
          `${n}× ${base}`;
  return `${plural} (~${g} g)`;
}

/** O alimento cabe na dieta e nas restrições? */
export function permitido(a: AlimentoCardapio, dieta: Dieta, restricoes: Restricao[]): boolean {
  if (dieta === "vegano" && !a.vegano) return false;
  if (dieta === "vegetariano" && !a.vegetariano) return false;
  return !a.exclusoes.some((e) => restricoes.includes(e));
}
