/**
 * O que esperar pelo caminho — os marcos do emagrecimento.
 *
 * POR QUE EXISTE
 *
 * A ansiedade de quem começa não é só "quando chego": é "o que muda no
 * meio do caminho?". Um amigo do Montinho mandou "de 142 para 129,5 em 12
 * meses" e a resposta dele foi a certa: roupas, lesões, bem-estar, sono,
 * saúde, autoestima — e isso já dá uma diferença enorme. Esta lista
 * transforma essa resposta em marcos que a pessoa vê na própria projeção,
 * cada um com a semana estimada em que a curva passa por ele.
 *
 * OS MARCOS SÃO PERCENTUAIS DO PESO, NÃO QUILOS FIXOS
 *
 * 5 kg em alguém de 60 e em alguém de 140 são coisas diferentes. A
 * literatura de saúde metabólica trabalha em percentual (5%, 10%, 15%), e
 * é o que os estudos abaixo mediram. Os quilos aparecem calculados para a
 * pessoa.
 *
 * TRÊS CAMADAS, DE NOVO
 *
 * O que os estudos mediram vem com referência. O que costuma acontecer em
 * roupa, rosto e disposição é experiência de quem acompanha alunos e
 * relato comum — está escrito como "costuma", nunca como garantia. Corpos
 * diferem: onde a gordura sai primeiro é genética, e a página diz isso.
 */

export interface Marco {
  /** Fração do peso inicial perdida em que o marco acontece. */
  fracao: number;
  titulo: string;
  /** O que os estudos mediram nessa faixa, com a referência. */
  estudos: { texto: string; ref: { rotulo: string; url: string } }[];
  /** O que costuma aparecer no corpo, na roupa e no dia a dia. */
  costuma: string[];
  /** O que ainda NÃO esperar aqui — para não frustrar. */
  aindaNao?: string;
}

export const MARCOS: Marco[] = [
  {
    fracao: 0.025,
    titulo: "Os primeiros quilos",
    estudos: [
      {
        texto: "Parte do que sai nas duas primeiras semanas é água e glicogênio, não gordura — por isso a balança cai rápido e depois se acomoda.",
        ref: { rotulo: "Hall KD et al. The Lancet, 2011 — apêndice do modelo", url: "https://www.niddk.nih.gov/-/media/Files/BWP/Hall_Lancet_Web_Appendix.pdf" },
      },
    ],
    costuma: [
      "Menos inchaço: a calça fecha com mais folga, o anel gira mais fácil.",
      "Sono e disposição melhoram antes de qualquer mudança visível — geralmente porque comer melhor e se mexer mais já mudou o dia.",
      "Você percebe; os outros ainda não.",
    ],
    aindaNao: "Não espere mudança no espelho nem nas fotos. Quem procura isso na semana 3 desanima à toa.",
  },
  {
    fracao: 0.05,
    titulo: "5% do peso: a saúde responde primeiro",
    estudos: [
      {
        texto: "Perder 5% do peso já melhorou a sensibilidade à insulina no fígado, no músculo e no tecido adiposo, além de pressão e triglicerídeos, em adultos com obesidade.",
        ref: { rotulo: "Magkos F et al. Cell Metabolism, 2016;23:591-601", url: "https://pubmed.ncbi.nlm.nih.gov/26916363/" },
      },
      {
        texto: "No Look AHEAD, perdas de 5% a 10% em um ano vieram com melhora de glicemia, pressão, HDL e triglicerídeos — e quanto maior a perda, maior a melhora.",
        ref: { rotulo: "Wing RR et al. Diabetes Care, 2011;34:1481-1486", url: "https://pubmed.ncbi.nlm.nih.gov/21593294/" },
      },
    ],
    costuma: [
      "Roupa começa a sobrar: um furo a menos no cinto, a camiseta que marcava a barriga para de marcar.",
      "Escada, caminhada e treino ficam mais leves. Joelhos e lombar agradecem antes do espelho.",
      "O rosto afina um pouco — é onde as pessoas próximas notam primeiro.",
      "Quem ronca costuma roncar menos.",
    ],
    aindaNao: "Numeração de roupa ainda é a mesma para a maioria. A cintura caiu uns 3 a 5 cm; a etiqueta demora mais.",
  },
  {
    fracao: 0.075,
    titulo: "Os outros começam a notar",
    estudos: [
      {
        texto: "Ao olhar fotos de rosto, as pessoas percebem a mudança a partir de cerca de 1,3 ponto de IMC — e passam a achar o rosto mais atraente por volta de 2,4 pontos.",
        ref: { rotulo: "Re DE, Rule NO. Social Psychological and Personality Science, 2016;7:1-8", url: "https://doi.org/10.1177/1948550615607592" },
      },
    ],
    costuma: [
      "“Você emagreceu?” de quem não vê você toda semana.",
      "Uma numeração de roupa a menos para muita gente, especialmente nas calças.",
      "Fotos de perfil e de lado mostram diferença; a de frente ainda engana.",
      "Autoestima sobe — e, junto, a vontade de continuar. Cuidado para isso não virar pressa.",
    ],
  },
  {
    fracao: 0.1,
    titulo: "10% do peso: a virada",
    estudos: [
      {
        texto: "Em adultos com apneia do sono, perder 10% do peso reduziu em cerca de 26% o índice de apneias por hora.",
        ref: { rotulo: "Peppard PE et al. JAMA, 2000;284:3015-3021", url: "https://pubmed.ncbi.nlm.nih.gov/11122588/" },
      },
      {
        texto: "Em quem tem artrose de joelho, perder 10% ou mais com dieta e exercício reduziu a dor e a carga no joelho a cada passo, e melhorou a função.",
        ref: { rotulo: "Messier SP et al. JAMA, 2013;310:1263-1273", url: "https://pubmed.ncbi.nlm.nih.gov/24065013/" },
      },
    ],
    costuma: [
      "Guarda-roupa muda de verdade: uma ou duas numerações a menos.",
      "Dores articulares que eram “normais” diminuem ou somem.",
      "Sono mais profundo, acordar mais fácil, menos sonolência de tarde.",
      "Exames de rotina costumam vir melhores: glicemia, pressão, colesterol.",
      "O rosto muda o suficiente para gente que não te vê há meses se surpreender.",
    ],
    aindaNao: "É também onde o ritmo cai e a rotina afrouxa. Recalcular o gasto com o peso novo é o que evita o platô virar desânimo.",
  },
  {
    fracao: 0.15,
    titulo: "15% ou mais: outro corpo, outra rotina",
    estudos: [
      {
        texto: "Perdas de 15% ou mais são as que os ensaios com medicamentos e cirurgia associam a remissão de diabetes tipo 2 e melhora ampla de risco cardiovascular.",
        ref: { rotulo: "Wing RR et al. Diabetes Care, 2011;34:1481-1486", url: "https://pubmed.ncbi.nlm.nih.gov/21593294/" },
      },
    ],
    costuma: [
      "Você não cabe mais nas roupas antigas — e sente falta de uma referência: é hora de fotos padronizadas e medidas.",
      "Treino muda de patamar: mais carga, mais repetições, mais disposição para tentar coisas novas.",
      "Pele pode ficar mais solta em algumas regiões; treino de força e paciência ajudam mais do que qualquer creme.",
      "A manutenção vira o novo objetivo, e ela tem regras próprias: continuar treinando força e pesando em média semanal.",
    ],
  },
];

/** A semana em que a trajetória central cruza uma fração perdida; null se não cruza no horizonte. */
export function semanaDoMarco(pontos: { semana: number; peso: number }[], pesoInicial: number, fracao: number): number | null {
  const alvo = pesoInicial * (1 - fracao);
  for (let i = 1; i < pontos.length; i++) {
    if (pontos[i].peso <= alvo && pontos[i - 1].peso > alvo) {
      return pontos[i - 1].semana + (pontos[i - 1].peso - alvo) / (pontos[i - 1].peso - pontos[i].peso);
    }
  }
  return null;
}

export const REFERENCIAS_MARCOS = [...new Map(MARCOS.flatMap((m) => m.estudos.map((e) => [e.ref.url, e.ref] as const))).values()];
