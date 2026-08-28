/**
 * A bateria — cinco testes e uma tela integrativa.
 *
 * Foram cinco e não sete porque cada teste extra custa abandono, e porque a
 * lista original tinha redundância: quem mede flexão de ombro na parede já
 * está pegando boa parte do que um teste torácico dedicado pegaria, e o
 * agachamento não acrescenta medida — acrescenta direção.
 *
 * A regra que organiza o arquivo: o critério de cada teste descreve o que a
 * pessoa OBSERVA, nunca o que ela tem. "O calcanhar sai do chão" é
 * observação. "Seu tornozelo está travado" seria diagnóstico, e um teste
 * online não pode fazer isso.
 *
 * Só o knee-to-wall aceita número, porque é o único com confiabilidade forte e
 * referência publicada. Nos outros quatro, inventar centímetro seria fabricar
 * precisão — exatamente o que o Montinho pediu para não fazer.
 */

import type { TesteMobilidade } from "./tipos";

/**
 * O agachamento como TELA.
 *
 * Não pontua, não entra no mapa, não gera prioridade. Ele existe para
 * direcionar quais testes específicos mostrar a seguir — que é o único uso
 * defensável de uma triagem de movimento, dado que escores de triagem não
 * predizem desfecho (Moran et al.).
 */
export interface ObservacaoTela {
  id: string;
  rotulo: string;
  /** Regiões que esta observação sugere testar. Vazio = nada a direcionar. */
  direciona: string[];
}

export const TELA_AGACHAMENTO: {
  id: string;
  nome: string;
  chamada: string;
  posicaoInicial: string;
  movimento: string;
  criterio: string;
  observacoes: ObservacaoTela[];
} = {
  id: "tela-agachamento",
  nome: "Agachamento livre",
  chamada: "Antes dos testes, um movimento só — para eu saber o que vale testar em você.",
  posicaoInicial: "Pés na largura dos ombros, braços à frente do corpo.",
  movimento: "Agache o mais fundo que conseguir com conforto e volte. Faça duas vezes.",
  criterio: "Repare no que aconteceu. Pode marcar mais de uma.",
  /** Cada observação direciona uma ou mais regiões. Nada aqui vira nota. */
  observacoes: [
    { id: "calcanhar", rotulo: "Meu calcanhar sai do chão", direciona: ["tornozelo", "quadril"] },
    { id: "profundidade", rotulo: "Não consigo descer muito", direciona: ["tornozelo", "quadril"] },
    { id: "tronco", rotulo: "Meu tronco inclina muito para a frente", direciona: ["tornozelo", "toracica"] },
    { id: "joelhos", rotulo: "Meus joelhos entram para dentro", direciona: ["quadril"] },
    { id: "lombar", rotulo: "Minha lombar arredonda embaixo", direciona: ["quadril", "posterior"] },
    { id: "tranquilo", rotulo: "Consegui agachar sem dificuldade", direciona: [] },
  ],
};

export const TESTES: TesteMobilidade[] = [
  {
    id: "knee-to-wall",
    regiao: "tornozelo",
    nome: "Joelho na parede",
    porqueImporta:
      "É a amplitude que permite o joelho avançar sobre o pé. Aparece em quase todo movimento de perna em que você desce.",
    bilateral: true,
    posicaoInicial:
      "De frente para uma parede, um pé à frente, o dedão apontando para ela. O outro pé fica atrás, para apoio.",
    movimento:
      "Sem tirar o calcanhar da frente do chão, leve o joelho até encostar na parede. Se encostar fácil, afaste o pé e tente de novo. Pare na maior distância em que o joelho ainda encosta com o calcanhar no chão.",
    erroComum:
      "Deixar o calcanhar subir. Se ele saiu do chão, a medida não vale — volte um pouco o pé e tente outra vez.",
    criterio: "Meça a distância entre o dedão e a parede.",
    influencia: ["agachamento", "afundo", "passada", "leg press"],
    opcoes: [
      { rotulo: "Bem pouca distância", estado: "prioridade" },
      { rotulo: "Uma distância média", estado: "melhorar" },
      { rotulo: "Bastante distância", estado: "boa" },
    ],
    medivel: {
      unidadePreferida: "cm",
      unidadeAlternativa: "dedos",
      /**
       * Cortes em centímetros, da literatura: a faixa típica descrita é de 10
       * a 15 cm, e valores abaixo de 10 cm costumam ser tratados como
       * restrição relevante. O corte de "boa" ficou em 12 para não classificar
       * como confortável quem está na borda de baixo do típico.
       */
      cortesCm: { boa: 12, melhorar: 10 },
      /**
       * Cortes em dedos, para quem não tem fita. A ferramenta declara na tela
       * que é aproximação e que o reteste precisa usar a mesma régua — um dedo
       * adulto fica em torno de dois centímetros, mas "em torno de" é
       * imprecisão suficiente para inventar evolução onde não houve.
       */
      cortesDedos: { boa: 6, melhorar: 5 },
    },
  },

  {
    id: "flexao-ombro-parede",
    regiao: "ombro",
    nome: "Braços na parede",
    porqueImporta:
      "É a amplitude de levar os braços acima da cabeça sem compensar com a lombar. Sem ela, o desenvolvimento vira outro exercício.",
    bilateral: false,
    posicaoInicial:
      "De costas para a parede, pés a um palmo dela. Encoste a lombar na parede — a ponto de não caber a mão entre elas — e mantenha assim.",
    movimento:
      "Com os braços estendidos e os polegares para trás, leve os dois braços por cima da cabeça em direção à parede.",
    erroComum:
      "Deixar a lombar arquear para o braço chegar. Se a lombar saiu da parede, o braço chegou emprestando amplitude de outro lugar.",
    criterio: "Com a lombar ainda encostada, onde as suas mãos chegaram?",
    influencia: ["desenvolvimento", "elevação frontal", "puxada", "agachamento com barra nas costas"],
    opcoes: [
      { rotulo: "Longe da parede, ou a lombar sai antes", estado: "prioridade" },
      { rotulo: "Quase encostam, ou encostam dobrando o cotovelo", estado: "melhorar" },
      { rotulo: "Encostam com o braço estendido e a lombar na parede", estado: "boa" },
    ],
  },

  {
    id: "rotacao-toracica",
    regiao: "toracica",
    nome: "Giro sentado",
    porqueImporta:
      "É o giro que vem da parte de cima das costas. Quando falta, a lombar tende a assumir o movimento nas remadas e nos agachamentos.",
    bilateral: true,
    posicaoInicial:
      "Sentado numa cadeira, joelhos e pés juntos, braços cruzados no peito com as mãos nos ombros.",
    movimento:
      "Sem descolar os joelhos um do outro, gire o tronco para um lado o máximo que conseguir. Depois para o outro.",
    erroComum:
      "Abrir os joelhos ou tirar o quadril da cadeira. O giro tem que vir do tronco, não do resto.",
    criterio: "Compare o quanto o seu peito girou em relação ao ponto de partida.",
    influencia: ["remada", "agachamento com barra", "desenvolvimento", "levantamento terra"],
    opcoes: [
      { rotulo: "Girei pouco — menos que meio caminho para o lado", estado: "prioridade" },
      { rotulo: "Girei até mais ou menos apontar para o lado", estado: "melhorar" },
      { rotulo: "Girei confortavelmente além do lado", estado: "boa" },
    ],
  },

  {
    id: "rotacao-interna-quadril",
    regiao: "quadril",
    nome: "Pé para fora, sentado",
    porqueImporta:
      "É uma das amplitudes que o quadril usa quando você desce no agachamento. Costuma ser bem diferente entre as pessoas — e isso é normal.",
    bilateral: true,
    posicaoInicial:
      "Sentado numa cadeira ou banco, coxas apoiadas, joelhos dobrados a noventa graus e afastados na largura do quadril.",
    movimento:
      "Sem tirar a coxa do apoio e sem deixar o joelho sair do lugar, leve só o pé para fora, afastando-o da linha do corpo.",
    erroComum:
      "Deixar o joelho acompanhar o pé, ou inclinar o tronco para o lado. Se o joelho andou, o movimento veio de fora do quadril.",
    criterio: "Veja o quanto o pé se afastou, com o joelho parado.",
    influencia: ["agachamento", "afundo", "leg press", "agachamento profundo"],
    opcoes: [
      { rotulo: "Quase não saiu do lugar", estado: "prioridade" },
      { rotulo: "Saiu um pouco", estado: "melhorar" },
      { rotulo: "Saiu bastante, com folga", estado: "boa" },
    ],
  },

  {
    id: "elevacao-perna",
    regiao: "posterior",
    nome: "Perna reta, deitado",
    porqueImporta:
      "É a amplitude da parte de trás da coxa. Aparece direto no stiff, no terra e em qualquer movimento em que o quadril dobra com a perna estendida.",
    bilateral: true,
    posicaoInicial:
      "Deitado de barriga para cima, as duas pernas estendidas no chão, braços ao lado do corpo.",
    movimento:
      "Mantendo a perna de baixo colada no chão e o joelho de cima estendido, suba uma perna o máximo que conseguir sem forçar.",
    erroComum:
      "Dobrar o joelho da perna que sobe, ou deixar a outra perna descolar do chão. Os dois roubam amplitude e estragam a comparação no reteste.",
    criterio:
      "Olhe onde o seu tornozelo chegou em relação à perna que ficou no chão.",
    influencia: ["stiff", "levantamento terra", "RDL", "bom-dia"],
    opcoes: [
      { rotulo: "Não passou do joelho da outra perna", estado: "prioridade" },
      { rotulo: "Passou do joelho, mas não chegou ao meio da coxa", estado: "melhorar" },
      { rotulo: "Chegou ao meio da coxa ou acima", estado: "boa" },
    ],
  },
];

/** Acesso por id, para o motor e para o componente não repetirem find(). */
export const TESTE_POR_ID: Record<string, TesteMobilidade> = Object.fromEntries(
  TESTES.map((t) => [t.id, t]),
);

export const TESTE_POR_REGIAO: Record<string, TesteMobilidade> = Object.fromEntries(
  TESTES.map((t) => [t.regiao, t]),
);

/**
 * O que a pessoa disse que tem dificuldade → quais regiões testar.
 *
 * Este mapa é o que torna o teste adaptativo. Ele não pontua nada: só decide
 * quais dos cinco testes vale a pena mostrar, para ninguém gastar oito minutos
 * respondendo sobre uma região que não muda o protocolo dele.
 */
export const REGIOES_POR_DIFICULDADE: Record<string, string[]> = {
  agachamento: ["tornozelo", "quadril"],
  stiff: ["posterior", "quadril"],
  afundo: ["tornozelo", "quadril"],
  "leg-press": ["tornozelo", "quadril"],
  desenvolvimento: ["ombro", "toracica"],
  supino: ["ombro", "toracica"],
  remada: ["toracica", "ombro"],
  "elevar-bracos": ["ombro", "toracica"],
};

export const DIFICULDADES = [
  { id: "agachamento", rotulo: "Agachamento" },
  { id: "stiff", rotulo: "Stiff / RDL" },
  { id: "afundo", rotulo: "Afundo" },
  { id: "leg-press", rotulo: "Leg press" },
  { id: "desenvolvimento", rotulo: "Desenvolvimento acima da cabeça" },
  { id: "supino", rotulo: "Supino" },
  { id: "remada", rotulo: "Remadas" },
  { id: "elevar-bracos", rotulo: "Elevar os braços" },
  { id: "nenhuma", rotulo: "Nenhuma específica — quero o teste completo" },
] as const;

export const NOME_REGIAO: Record<string, string> = {
  tornozelo: "Tornozelo",
  ombro: "Ombro",
  toracica: "Parte de cima das costas",
  quadril: "Quadril",
  posterior: "Parte de trás da coxa",
};
