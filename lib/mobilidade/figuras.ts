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
  "knee-to-wall": [
    {
      tipo: "certo",
      titulo: "Assim",
      cenario: [{ tipo: "parede-esq" }, { tipo: "chao" }],
      segmentos: [
        [32, 88, 46, 88],
        [40, 88, 24, 62],
        [24, 62, 58, 48],
        [58, 48, 56, 25],
        [58, 48, 70, 66],
        [70, 66, 74, 88],
        [70, 88, 82, 88],
        [56, 27, 32, 36],
      ],
      cabeca: { cx: 55, cy: 18, r: 5.2 },
      destaque: { cx: 45, cy: 87 },
      medida: { x1: 22, x2: 32, y: 92, rotulo: "meça aqui" },
      anotacoes: [
        { texto: "joelho encosta", x: 30, y: 44, seta: { x: 25, y: 60 }, ancora: "start" },
        { texto: "calcanhar no chão", x: 94, y: 78, seta: { x: 47, y: 86 }, ancora: "end" },
      ],
      alt: "Pessoa de lado, de frente para uma parede, com o pé da frente inteiro no chão e o joelho avançado até tocar a parede. O calcanhar está apoiado. A medida é a distância entre o dedão e a parede.",
    },
    {
      tipo: "erro",
      titulo: "Assim não",
      cenario: [{ tipo: "parede-esq" }, { tipo: "chao" }],
      segmentos: [
        [32, 88, 48, 81],
        [41, 84, 24, 60],
        [24, 60, 58, 47],
        [58, 47, 56, 25],
        [58, 47, 70, 65],
        [70, 65, 74, 88],
        [70, 88, 82, 88],
        [56, 27, 32, 35],
      ],
      cabeca: { cx: 55, cy: 18, r: 5.2 },
      destaque: { cx: 47, cy: 83 },
      anotacoes: [
        { texto: "calcanhar subiu", x: 94, y: 73, seta: { x: 48, y: 82 }, ancora: "end" },
        { texto: "a medida não vale", x: 50, y: 97, ancora: "middle" },
      ],
      alt: "A mesma posição, mas com o calcanhar da frente levantado do chão. Quando isso acontece, a medida não é válida.",
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
