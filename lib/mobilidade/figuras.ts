/**
 * As figuras dos testes — desenho didático como dado.
 *
 * Por que SVG desenhado em código, e não foto ou vídeo: além de pesar poucos
 * kilobytes e ficar nítido em qualquer tela, o desenho deixa DESTACAR. Numa
 * foto do knee-to-wall, o calcanhar no chão é um detalhe no canto da imagem
 * competindo com o resto do corpo, o piso e a parede. No desenho ele é a única
 * coisa colorida.
 *
 * A decisão de fundo é o par CERTO + ERRO. Uma ilustração bonita da execução
 * correta ensina metade: a pessoa sozinha em casa não erra por não ter visto o
 * certo, erra por não reconhecer que está fazendo o errado. Cada teste mostra
 * as duas, lado a lado, e o erro desenhado é exatamente o `erroComum` que já
 * estava no registro do teste — a mesma informação, agora vista.
 *
 * O sistema é deliberadamente pobre: segmentos de reta, círculos, e três
 * elementos de cenário (parede, chão, assento). Figura de vareta comunica
 * posição melhor que desenho realista, porque não tem nada além da posição
 * para olhar. Tudo vive num viewBox 0 0 100 100.
 */

export interface Cenario {
  tipo: "parede-esq" | "parede-dir" | "chao" | "assento-cima" | "assento-frente";
}

export interface Anotacao {
  /** Texto curto. Nunca mais que quatro palavras — é rótulo, não legenda. */
  texto: string;
  x: number;
  y: number;
  /** Seta opcional, do rótulo até o ponto que ele nomeia. */
  seta?: { x: number; y: number };
  ancora?: "start" | "middle" | "end";
}

export interface Figura {
  /** "certo" pinta o destaque em verde; "erro" em laranja. */
  tipo: "certo" | "erro";
  titulo: string;
  cenario: Cenario[];
  /** Segmentos do corpo: [x1, y1, x2, y2]. */
  segmentos: [number, number, number, number][];
  /** Opcional: figuras em close (como a do quadril) não mostram a cabeça. */
  cabeca?: { cx: number; cy: number; r: number };
  /** O ponto que decide se o teste vale. É a única coisa colorida. */
  destaque?: { cx: number; cy: number };
  /** Linha tracejada de referência, quando o critério é uma comparação. */
  referencia?: [number, number, number, number];
  /** A medida, quando o teste tem uma. */
  medida?: { x1: number; x2: number; y: number; rotulo: string };
  /**
   * A seta de movimento, para as figuras de exercício.
   *
   * Nos testes o assunto é uma POSIÇÃO, e a figura parada basta. Num exercício
   * o assunto é o movimento, e uma figura parada mostra metade — a pessoa vê
   * onde chegar e não para onde ir. A seta resolve isso sem precisar de duas
   * figuras nem de animação.
   */
  movimento?: { x1: number; y1: number; x2: number; y2: number };
  anotacoes: Anotacao[];
  /** Descrição textual equivalente, para quem usa leitor de tela. */
  alt: string;
}

/**
 * Duas figuras por teste, na ordem certo → erro.
 *
 * As coordenadas foram ajustadas olhando o desenho renderizado, não calculadas.
 * Se alguém mexer aqui, o jeito de conferir é abrir a página — número que
 * parece certo na cabeça sai torto na tela.
 */
export const FIGURAS: Record<string, [Figura, Figura]> = {
  /**
   * Posição de meio ajoelhado, como o Montinho pediu: o joelho de trás fica
   * APOIADO no chão. É a forma padrão do weight-bearing lunge test para
   * autoaplicação — sem equilíbrio para administrar, sobra atenção para o que
   * importa, que é o calcanhar da frente.
   */
  "knee-to-wall": [
    {
      tipo: "certo",
      titulo: "Assim",
      cenario: [{ tipo: "parede-esq" }, { tipo: "chao" }],
      segmentos: [
        // pé da frente + canela: joelho avança e encosta na parede
        [32, 88, 46, 88],
        [40, 88, 24, 64],
        // coxa da frente, subindo para o quadril
        [24, 64, 56, 56],
        // tronco ereto
        [56, 56, 55, 30],
        // coxa de trás: do quadril ao joelho APOIADO no chão
        [56, 56, 68, 86],
        // canela de trás deitada no chão, pé atrás
        [68, 86, 84, 86],
        // braço apoiando na parede
        [55, 33, 30, 40],
      ],
      cabeca: { cx: 54, cy: 23, r: 5.2 },
      destaque: { cx: 45, cy: 87 },
      medida: { x1: 22, x2: 32, y: 92, rotulo: "meça aqui" },
      anotacoes: [
        { texto: "joelho encosta", x: 30, y: 48, seta: { x: 25, y: 62 }, ancora: "start" },
        { texto: "calcanhar no chão", x: 94, y: 74, seta: { x: 47, y: 86 }, ancora: "end" },
        { texto: "joelho apoiado", x: 94, y: 96, seta: { x: 70, y: 88 }, ancora: "end" },
      ],
      alt: "Pessoa meio ajoelhada de frente para uma parede: o joelho de trás está apoiado no chão, o pé da frente fica inteiro no chão e o joelho da frente avança até tocar a parede. O calcanhar da frente permanece apoiado, e a medida é a distância entre o dedão e a parede.",
    },
    {
      tipo: "erro",
      titulo: "Assim não",
      cenario: [{ tipo: "parede-esq" }, { tipo: "chao" }],
      segmentos: [
        // mesmo desenho, mas o calcanhar da frente subiu
        [32, 88, 48, 81],
        [41, 84, 24, 62],
        [24, 62, 56, 55],
        [56, 55, 55, 30],
        [56, 55, 68, 86],
        [68, 86, 84, 86],
        [55, 33, 30, 39],
      ],
      cabeca: { cx: 54, cy: 23, r: 5.2 },
      destaque: { cx: 47, cy: 83 },
      anotacoes: [
        { texto: "calcanhar subiu", x: 94, y: 72, seta: { x: 48, y: 82 }, ancora: "end" },
        { texto: "a medida não vale", x: 50, y: 97, ancora: "middle" },
      ],
      alt: "A mesma posição meio ajoelhada, mas com o calcanhar da frente levantado do chão. Quando isso acontece, a medida não é válida.",
    },
  ],

  "flexao-ombro-parede": [
    {
      tipo: "certo",
      titulo: "Assim",
      cenario: [{ tipo: "parede-dir" }, { tipo: "chao" }],
      segmentos: [
        [70, 27, 70, 54],
        [70, 54, 65, 71],
        [65, 71, 65, 88],
        [57, 88, 69, 88],
        [70, 29, 58, 17],
        [58, 17, 72, 8],
      ],
      cabeca: { cx: 68, cy: 20, r: 5.2 },
      destaque: { cx: 71, cy: 50 },
      anotacoes: [
        { texto: "mão encosta", x: 62, y: 9, seta: { x: 71, y: 9 }, ancora: "end" },
        { texto: "lombar colada", x: 62, y: 52, seta: { x: 69, y: 51 }, ancora: "end" },
      ],
      alt: "Pessoa de lado, de costas para a parede, com a lombar encostada nela e os dois braços estendidos acima da cabeça tocando a parede.",
    },
    {
      tipo: "erro",
      titulo: "Assim não",
      cenario: [{ tipo: "parede-dir" }, { tipo: "chao" }],
      segmentos: [
        [70, 27, 62, 41],
        [62, 41, 70, 54],
        [70, 54, 65, 71],
        [65, 71, 65, 88],
        [57, 88, 69, 88],
        [70, 29, 57, 16],
        [57, 16, 72, 8],
      ],
      cabeca: { cx: 68, cy: 20, r: 5.2 },
      destaque: { cx: 65, cy: 42 },
      anotacoes: [
        { texto: "lombar saiu", x: 56, y: 42, seta: { x: 63, y: 42 }, ancora: "end" },
        { texto: "o braço pegou emprestado", x: 50, y: 97, ancora: "middle" },
      ],
      alt: "A mesma posição, mas com a lombar arqueada e afastada da parede. O braço chegou à parede às custas da coluna, e não da amplitude do ombro.",
    },
  ],

  "rotacao-toracica": [
    {
      tipo: "certo",
      titulo: "Assim",
      cenario: [{ tipo: "assento-cima" }],
      segmentos: [
        [30, 66, 70, 66],
        [32, 43, 68, 54],
        [50, 66, 50, 49],
      ],
      cabeca: { cx: 50, cy: 45, r: 6 },
      destaque: { cx: 50, cy: 66 },
      referencia: [30, 48, 70, 48],
      anotacoes: [
        { texto: "ombros giram", x: 50, y: 28, seta: { x: 65, y: 52 }, ancora: "middle" },
        { texto: "joelhos parados", x: 50, y: 80, seta: { x: 62, y: 67 }, ancora: "middle" },
        { texto: "visto de cima", x: 50, y: 97, ancora: "middle" },
      ],
      alt: "Vista de cima de uma pessoa sentada. A linha dos quadris e joelhos permanece parada enquanto a linha dos ombros gira para um lado, saindo da posição de partida marcada pela linha tracejada.",
    },
    {
      tipo: "erro",
      titulo: "Assim não",
      cenario: [{ tipo: "assento-cima" }],
      segmentos: [
        [32, 61, 68, 72],
        [32, 43, 68, 54],
        [50, 66, 50, 49],
      ],
      cabeca: { cx: 50, cy: 45, r: 6 },
      destaque: { cx: 50, cy: 66 },
      referencia: [30, 66, 70, 66],
      anotacoes: [
        { texto: "o quadril girou junto", x: 50, y: 84, seta: { x: 64, y: 70 }, ancora: "middle" },
        { texto: "visto de cima", x: 50, y: 97, ancora: "middle" },
      ],
      alt: "A mesma vista de cima, mas com os quadris girando junto com os ombros, saindo da linha tracejada de partida. Nesse caso o giro não veio da parte de cima das costas.",
    },
  ],

  /**
   * Esta é a única figura em CLOSE, e por um motivo: a vista de frente do
   * corpo inteiro sentado ficou ilegível — o tronco não acrescentava nada e a
   * cadeira competia com os braços. O teste acontece do joelho para baixo, e é
   * isso que o desenho mostra.
   */
  "rotacao-interna-quadril": [
    {
      tipo: "certo",
      titulo: "Assim",
      cenario: [{ tipo: "assento-frente" }],
      segmentos: [
        [40, 30, 40, 50],
        [60, 30, 60, 50],
        [40, 50, 18, 78],
        [60, 50, 60, 78],
        [12, 81, 24, 81],
        [54, 81, 66, 81],
      ],
      destaque: { cx: 40, cy: 50 },
      referencia: [40, 50, 40, 86],
      anotacoes: [
        { texto: "joelho parado", x: 94, y: 46, seta: { x: 43, y: 49 }, ancora: "end" },
        { texto: "só o pé sai", x: 6, y: 68, seta: { x: 19, y: 76 }, ancora: "start" },
        { texto: "visto de frente", x: 50, y: 95, ancora: "middle" },
      ],
      alt: "Close das pernas de quem está sentado, visto de frente. Um pé se afasta para fora enquanto o joelho permanece parado sobre a linha tracejada original.",
    },
    {
      tipo: "erro",
      titulo: "Assim não",
      cenario: [{ tipo: "assento-frente" }],
      segmentos: [
        [40, 30, 30, 50],
        [60, 30, 60, 50],
        [30, 50, 16, 78],
        [60, 50, 60, 78],
        [10, 81, 22, 81],
        [54, 81, 66, 81],
      ],
      destaque: { cx: 30, cy: 50 },
      referencia: [40, 50, 40, 86],
      anotacoes: [
        { texto: "o joelho andou", x: 94, y: 46, seta: { x: 33, y: 49 }, ancora: "end" },
        { texto: "veio de fora do quadril", x: 50, y: 95, ancora: "middle" },
      ],
      alt: "O mesmo close, mas com o joelho saindo da linha tracejada junto com o pé. Quando isso acontece, o movimento deixa de vir do quadril.",
    },
  ],

  "elevacao-perna": [
    {
      tipo: "certo",
      titulo: "Assim",
      cenario: [{ tipo: "chao" }],
      segmentos: [
        [24, 80, 52, 80],
        [52, 80, 70, 82],
        [70, 82, 86, 82],
        [86, 82, 90, 76],
        [52, 80, 63, 57],
        [63, 57, 74, 34],
        [74, 34, 79, 31],
      ],
      cabeca: { cx: 18, cy: 76, r: 5.2 },
      destaque: { cx: 74, cy: 34 },
      referencia: [70, 82, 70, 26],
      anotacoes: [
        { texto: "joelho estendido", x: 28, y: 54, seta: { x: 62, y: 58 }, ancora: "start" },
        { texto: "meio da coxa", x: 94, y: 22, seta: { x: 70, y: 27 }, ancora: "end" },
        { texto: "a outra perna fica no chão", x: 50, y: 97, ancora: "middle" },
      ],
      alt: "Pessoa deitada de barriga para cima. Uma perna sobe com o joelho estendido enquanto a outra permanece apoiada no chão. A linha tracejada marca o meio da coxa da perna apoiada, que é a referência.",
    },
    {
      tipo: "erro",
      titulo: "Assim não",
      cenario: [{ tipo: "chao" }],
      segmentos: [
        [24, 80, 52, 80],
        [52, 80, 70, 74],
        [70, 74, 85, 70],
        [85, 70, 90, 65],
        [52, 80, 64, 58],
        [64, 58, 62, 38],
        [62, 38, 66, 33],
      ],
      cabeca: { cx: 18, cy: 76, r: 5.2 },
      destaque: { cx: 64, cy: 58 },
      anotacoes: [
        { texto: "joelho dobrou", x: 24, y: 54, seta: { x: 62, y: 58 }, ancora: "start" },
        { texto: "a outra perna saiu do chão", x: 50, y: 97, ancora: "middle" },
      ],
      alt: "A mesma posição, mas com o joelho da perna que sobe dobrado e a outra perna descolando do chão. As duas coisas emprestam amplitude e estragam a comparação no reteste.",
    },
  ],
};

export function figurasDoTeste(testeId: string): [Figura, Figura] | null {
  return FIGURAS[testeId] ?? null;
}

/**
 * As figuras dos exercícios — uma por exercício, não um par.
 *
 * A diferença para os testes é deliberada. Lá o par certo/erro existe porque
 * uma medida feita torto invalida tudo o que vem depois. Aqui o card já traz
 * "Como", "Você deve sentir" e "Evite" em texto ao lado, e o desenho tem outro
 * trabalho: mostrar a FORMA da posição e para onde o movimento vai.
 *
 * Por isso estas figuras não têm rótulo nenhum. Elas aparecem pequenas, do
 * lado do texto, e rótulo de 5 pixels não se lê — seria enfeite fingindo ser
 * informação. O que a figura precisa comunicar nesse tamanho é silhueta e
 * direção, e é só isso que ela tenta.
 */
export const FIGURAS_EXERCICIO: Record<string, Figura> = {
  // ── Tornozelo ───────────────────────────────────────────────────────────
  "knee-to-wall-dinamico": {
    tipo: "certo",
    titulo: "Joelho na parede",
    cenario: [{ tipo: "parede-esq" }, { tipo: "chao" }],
    segmentos: [
      [32, 88, 46, 88],
      [40, 88, 26, 62],
      [26, 62, 58, 48],
      [58, 48, 56, 25],
      [58, 48, 70, 66],
      [70, 66, 74, 88],
      [70, 88, 82, 88],
      [56, 27, 32, 36],
    ],
    cabeca: { cx: 55, cy: 18, r: 5.2 },
    destaque: { cx: 45, cy: 87 },
    movimento: { x1: 40, y1: 55, x2: 26, y2: 58 },
    anotacoes: [],
    alt: "De frente para a parede, com o pé inteiro no chão, o joelho avança até tocar a parede e volta, num movimento contínuo.",
  },
  "dorsiflexao-afundo": {
    tipo: "certo",
    titulo: "Balanço no afundo",
    cenario: [{ tipo: "chao" }],
    segmentos: [
      [22, 88, 36, 88],
      [30, 88, 26, 62],
      [26, 62, 52, 50],
      [52, 50, 50, 26],
      [52, 50, 68, 68],
      [68, 68, 78, 84],
      [76, 88, 86, 88],
      [50, 30, 34, 44],
    ],
    cabeca: { cx: 49, cy: 19, r: 5.2 },
    destaque: { cx: 27, cy: 62 },
    movimento: { x1: 40, y1: 58, x2: 24, y2: 58 },
    anotacoes: [],
    alt: "Em posição de afundo, com o pé da frente inteiro no chão, o joelho da frente avança sobre o pé e volta.",
  },
  "panturrilha-joelho-reto": {
    tipo: "certo",
    titulo: "Panturrilha, joelho estendido",
    cenario: [{ tipo: "parede-esq" }, { tipo: "chao" }],
    segmentos: [
      [34, 88, 46, 88],
      [40, 88, 44, 62],
      [44, 62, 52, 44],
      [52, 44, 50, 22],
      [52, 44, 78, 84],
      [74, 88, 88, 88],
      [50, 25, 28, 32],
    ],
    cabeca: { cx: 49, cy: 15, r: 5.2 },
    destaque: { cx: 79, cy: 87 },
    anotacoes: [],
    alt: "De pé com as mãos na parede, a perna de trás fica completamente estendida, numa linha reta do quadril ao calcanhar, que permanece apoiado no chão.",
  },
  "panturrilha-joelho-flexionado": {
    tipo: "certo",
    titulo: "Panturrilha, joelho dobrado",
    cenario: [{ tipo: "parede-esq" }, { tipo: "chao" }],
    segmentos: [
      [34, 88, 46, 88],
      [40, 88, 44, 62],
      [44, 62, 52, 44],
      [52, 44, 50, 22],
      [52, 44, 72, 56],
      [72, 56, 74, 84],
      [70, 88, 84, 88],
      [50, 25, 28, 32],
    ],
    cabeca: { cx: 49, cy: 15, r: 5.2 },
    destaque: { cx: 73, cy: 56 },
    anotacoes: [],
    alt: "A mesma posição, mas com o joelho de trás nitidamente dobrado e o calcanhar ainda apoiado no chão. É a dobra do joelho que muda o alvo do alongamento.",
  },

  // ── Ombro ───────────────────────────────────────────────────────────────
  "wall-slide": {
    tipo: "certo",
    titulo: "Deslize na parede",
    cenario: [{ tipo: "parede-dir" }, { tipo: "chao" }],
    segmentos: [
      [70, 28, 70, 54],
      [70, 54, 65, 71],
      [65, 71, 65, 88],
      [57, 88, 69, 88],
      [70, 30, 58, 22],
      [58, 22, 68, 12],
    ],
    cabeca: { cx: 67, cy: 21, r: 5.2 },
    destaque: { cx: 71, cy: 50 },
    movimento: { x1: 50, y1: 30, x2: 50, y2: 12 },
    anotacoes: [],
    alt: "De costas para a parede, com a lombar encostada, os antebraços deslizam para cima ao longo da parede e voltam.",
  },
  "flexao-ombro-bastao": {
    tipo: "certo",
    titulo: "Braços acima da cabeça",
    cenario: [{ tipo: "chao" }],
    segmentos: [
      [50, 30, 50, 56],
      [50, 56, 42, 72],
      [42, 72, 42, 88],
      [50, 56, 58, 72],
      [58, 72, 58, 88],
      [36, 88, 46, 88],
      [54, 88, 64, 88],
      [50, 32, 30, 20],
      [50, 32, 70, 20],
      [26, 16, 74, 16],
    ],
    cabeca: { cx: 50, cy: 22, r: 5.2 },
    destaque: { cx: 50, cy: 16 },
    movimento: { x1: 50, y1: 40, x2: 50, y2: 24 },
    anotacoes: [],
    alt: "De pé, segurando um bastão com as mãos afastadas, os braços sobem por cima da cabeça e vão para trás até onde for confortável.",
  },
  "peitoral-porta": {
    tipo: "certo",
    titulo: "Abertura na porta",
    cenario: [{ tipo: "parede-esq" }, { tipo: "chao" }],
    segmentos: [
      [50, 46, 46, 66],
      [46, 66, 44, 88],
      [50, 46, 60, 66],
      [60, 66, 62, 88],
      [38, 88, 50, 88],
      [56, 88, 68, 88],
      [50, 46, 50, 28],
      [50, 30, 34, 30],
      [34, 30, 26, 40],
    ],
    cabeca: { cx: 52, cy: 20, r: 5.2 },
    destaque: { cx: 40, cy: 30 },
    movimento: { x1: 62, y1: 40, x2: 74, y2: 40 },
    anotacoes: [],
    alt: "Com o antebraço apoiado no batente da porta e o cotovelo na altura do ombro, o corpo dá um passo à frente e gira levemente para o lado oposto.",
  },

  // ── Torácica ────────────────────────────────────────────────────────────
  /**
   * Vista de cima, como no teste de rotação torácica — e pelo mesmo motivo: a
   * primeira versão, desenhada de lado, virou um emaranhado de linhas que não
   * se lia como pessoa deitada. De cima, o braço que varre é imediato.
   */
  "open-book": {
    tipo: "certo",
    titulo: "Abrir o livro",
    cenario: [],
    segmentos: [
      [34, 74, 66, 74],
      [50, 74, 50, 52],
      [50, 56, 24, 48],
    ],
    cabeca: { cx: 50, cy: 47, r: 5.5 },
    destaque: { cx: 50, cy: 58 },
    referencia: [50, 56, 78, 60],
    movimento: { x1: 74, y1: 32, x2: 28, y2: 32 },
    anotacoes: [],
    alt: "Visto de cima: deitado de lado com os joelhos empilhados e parados, o braço de cima parte da posição à frente do corpo e varre até o outro lado.",
  },
  "rotacao-quatro-apoios": {
    tipo: "certo",
    titulo: "Giro em quatro apoios",
    cenario: [{ tipo: "chao" }],
    segmentos: [
      [34, 60, 66, 56],
      [34, 60, 30, 88],
      [66, 56, 72, 88],
      [26, 88, 38, 88],
      [66, 88, 78, 88],
      [38, 58, 44, 38],
      [44, 38, 34, 30],
    ],
    cabeca: { cx: 28, cy: 54, r: 5.2 },
    destaque: { cx: 44, cy: 38 },
    movimento: { x1: 54, y1: 40, x2: 46, y2: 30 },
    anotacoes: [],
    alt: "Em quatro apoios, com uma mão atrás da cabeça, o cotovelo gira para cima acompanhando o olhar e depois desce por baixo do corpo.",
  },

  // ── Quadril ─────────────────────────────────────────────────────────────
  /**
   * Também de cima. No chão, o 90/90 é definido pelo ÂNGULO das duas pernas —
   * e ângulo é exatamente o que uma vista lateral esconde.
   */
  "noventa-noventa": {
    tipo: "certo",
    titulo: "90/90",
    cenario: [],
    segmentos: [
      [50, 60, 50, 44],
      [50, 60, 26, 60],
      [26, 60, 26, 84],
      [50, 60, 74, 60],
      [74, 60, 74, 34],
    ],
    cabeca: { cx: 50, cy: 39, r: 5.2 },
    destaque: { cx: 50, cy: 60 },
    movimento: { x1: 30, y1: 92, x2: 70, y2: 92 },
    anotacoes: [],
    alt: "Visto de cima: sentado no chão com uma perna à frente e outra ao lado, ambas dobradas a noventa graus. Os dois joelhos giram juntos para o outro lado e voltam.",
  },
  "rock-back-adutor": {
    tipo: "certo",
    titulo: "Balanço com a perna aberta",
    cenario: [{ tipo: "chao" }],
    segmentos: [
      [34, 58, 64, 56],
      [34, 58, 30, 88],
      [64, 56, 70, 82],
      [26, 88, 38, 88],
      [64, 56, 86, 86],
      [80, 88, 92, 88],
    ],
    cabeca: { cx: 28, cy: 52, r: 5.2 },
    destaque: { cx: 78, cy: 74 },
    movimento: { x1: 48, y1: 44, x2: 66, y2: 44 },
    anotacoes: [],
    alt: "Em quatro apoios, com uma perna estendida para o lado e o pé no chão, o quadril senta para trás e volta.",
  },

  // ── Cadeia posterior ────────────────────────────────────────────────────
  "posterior-deitado": {
    tipo: "certo",
    titulo: "Perna reta, deitado",
    cenario: [{ tipo: "chao" }],
    segmentos: [
      [24, 80, 52, 80],
      [52, 80, 70, 82],
      [70, 82, 86, 82],
      [52, 80, 63, 57],
      [63, 57, 74, 34],
      [74, 34, 79, 31],
      [30, 78, 50, 52],
      [50, 52, 66, 50],
    ],
    cabeca: { cx: 18, cy: 76, r: 5.2 },
    destaque: { cx: 63, cy: 57 },
    anotacoes: [],
    alt: "Deitado de barriga para cima, uma perna sobe com o joelho estendido e as mãos seguram atrás da coxa, enquanto a outra perna fica apoiada no chão.",
  },
  "hinge-controlado": {
    tipo: "certo",
    titulo: "Dobradiça de quadril",
    cenario: [{ tipo: "chao" }],
    segmentos: [
      [46, 46, 44, 68],
      [44, 68, 42, 88],
      [36, 88, 48, 88],
      [46, 46, 70, 34],
      [68, 36, 64, 56],
      [70, 34, 78, 31],
    ],
    cabeca: { cx: 82, cy: 29, r: 5.2 },
    destaque: { cx: 46, cy: 46 },
    movimento: { x1: 40, y1: 46, x2: 24, y2: 52 },
    anotacoes: [],
    alt: "De pé com os joelhos levemente dobrados, o quadril empurra para trás mantendo as costas retas, até sentir a parte de trás da coxa, e volta.",
  },
};

export function figuraDoExercicio(id: string): Figura | null {
  return FIGURAS_EXERCICIO[id] ?? null;
}
