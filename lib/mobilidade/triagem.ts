/**
 * Triagem de segurança — a etapa 0.
 *
 * O tom aqui é a coisa mais difícil do arquivo inteiro. Uma triagem escrita
 * com medo assusta a pessoa e a manda para o pronto-socorro por uma dor de
 * ombro de quinta-feira. Uma triagem escrita com leveza demais deixa passar
 * quem precisa de olho humano.
 *
 * A saída é dizer a verdade e só ela: o teste não serve para investigar
 * aquilo. Não é que a pessoa esteja mal — é que a ferramenta é a errada. Isso
 * é factualmente correto e não carrega ameaça nenhuma.
 *
 * Note o que NÃO existe aqui: nenhum item devolve nome de condição, gravidade
 * ou probabilidade. A triagem só decide entre seguir e não seguir.
 */

export interface ItemTriagem {
  id: string;
  rotulo: string;
  /** O detalhe que evita falso positivo — dor comum de treino não conta. */
  ajuda?: string;
}

export const ITENS_TRIAGEM: ItemTriagem[] = [
  {
    id: "dor-intensa",
    rotulo: "Dor intensa agora, em repouso ou ao se mover",
    ajuda: "Dor forte, que atrapalha o dia. Dor muscular de treino não entra aqui.",
  },
  {
    id: "trauma",
    rotulo: "Torção, queda, pancada ou trauma recente",
  },
  {
    id: "forca",
    rotulo: "Perda de força que apareceu sem explicação",
  },
  {
    id: "dormencia",
    rotulo: "Dormência ou formigamento que não passa",
  },
  {
    id: "cirurgia",
    rotulo: "Cirurgia recente, ou ainda em recuperação de uma",
  },
  {
    id: "apoio",
    rotulo: "Dificuldade para apoiar o peso do corpo em uma das pernas",
  },
  {
    id: "orientacao",
    rotulo: "Orientação de um profissional de saúde para evitar certos movimentos",
  },
  {
    id: "nenhum",
    rotulo: "Nenhum desses",
  },
];

/** Há bandeira? "nenhum" é opção exclusiva — marcar qualquer outra a cancela. */
export function temBandeira(marcados: string[]): boolean {
  return marcados.some((m) => m !== "nenhum");
}

/**
 * O texto do bloqueio.
 *
 * Sem diagnóstico, sem susto, sem "procure imediatamente". A frase sobre dor
 * não significar lesão grave está aqui de propósito: é verdadeira, e é o que
 * impede a triagem de plantar um medo que a pessoa vai carregar para o treino
 * de amanhã.
 */
export const BLOQUEIO = {
  titulo: "Aqui eu prefiro não chutar",
  corpo:
    "Pelo que você marcou, um teste de mobilidade feito pela internet não é a ferramenta certa para o seu caso. Não porque seja grave — dor e desconforto quase nunca significam lesão séria —, mas porque investigar isso direito exige alguém olhando você, movendo a articulação e perguntando o que a tela não pergunta.",
  encaminhamento:
    "O caminho mais curto é uma avaliação individual com um profissional de saúde. Depois disso, se fizer sentido, o teste continua aqui te esperando.",
  saida:
    "Se você marcou por engano, pode voltar e corrigir.",
} as const;

/**
 * O aviso que acompanha a bateria inteira, mostrado antes do primeiro teste.
 *
 * "Pare" é uma instrução acionável; "cuidado" não é. Por isso a frase diz
 * exatamente o que fazer se doer durante um teste.
 */
export const AVISO_DURANTE =
  "Nenhum teste aqui deve doer. Se algum movimento doer, pare aquele movimento e marque \"não consegui avaliar\" — isso não estraga o seu resultado, só significa que aquela informação vai faltar.";

export const AVISO_NAO_E_CONSULTA =
  "Este teste não substitui avaliação profissional e não serve para investigar dor.";
