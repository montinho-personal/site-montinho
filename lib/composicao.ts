/**
 * O motor da Calculadora de Composição Corporal.
 *
 * POR QUE ELA EXISTE, E POR QUE NÃO CANIBALIZA AS OUTRAS TRÊS
 *
 * O site já responde "quantos quilos até uma data" (meta de peso) e
 * "quanto músculo ainda cabe" (potencial natural). Falta a terceira
 * pergunta, que é a mais comum de quem fez bioimpedância e olhou o
 * relatório sem saber o que fazer: quanto preciso perder para chegar a
 * tantos por cento de gordura?
 *
 * São contas diferentes. A de meta de peso parte de um PRAZO; esta parte
 * de um ALVO DE COMPOSIÇÃO e não fala de tempo. A de potencial olha para
 * a massa magra que falta; esta olha para a gordura que sobra.
 *
 * A CONTA É SIMPLES, E É ISSO QUE A TORNA ÚTIL
 *
 * Se a massa magra ficar de pé, o peso no alvo é massa magra dividida por
 * (1 − alvo). Todo o resto da ferramenta existe para dizer que esse "se"
 * é a parte difícil: emagrecer sem treino de força e sem proteína não
 * preserva massa magra, e aí o alvo chega num corpo menor do que a conta
 * prometeu.
 *
 * DE ONDE VÊM AS FAIXAS
 *
 * Do que o próprio artigo do site publica — homens saudáveis entre 10% e
 * 20%, mulheres entre 18% e 28% — e da literatura de composição corporal
 * para as faixas de atleta e de risco. Elas são REFERÊNCIA, não meta: o
 * percentual "ideal" de uma pessoa depende do que ela quer fazer com o
 * corpo, e a ferramenta não decide isso por ninguém.
 *
 * O QUE ELA NUNCA FAZ
 *
 * Tratar o número da balança de bioimpedância como medida. O aparelho
 * estima tudo a partir da água corporal, e é por isso que o resultado
 * muda de um dia para o outro sem que nada tenha acontecido com a
 * gordura. A ferramenta diz isso antes de mostrar qualquer conta.
 */

import { parseNumero } from "./polichinelo";

export { parseNumero };

/* ───────────────────────── Entradas ───────────────────────── */

export type Sexo = "homem" | "mulher";

export const PESO_MIN = 35;
export const PESO_MAX = 300;
export const GORDURA_MIN = 3;
export const GORDURA_MAX = 65;

/** O piso fisiológico: abaixo disso não há gordura essencial de sobra. */
export const GORDURA_ESSENCIAL: Record<Sexo, number> = { homem: 5, mulher: 12 };

export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const gorduraValida = (g: number | null): g is number => g !== null && g >= GORDURA_MIN && g <= GORDURA_MAX;

export type AlvoRecusa = "abaixo-do-essencial" | "nao-e-reducao";

/**
 * Por que um alvo digitado não vira conta.
 *
 * Silêncio aqui parece defeito: a pessoa digita 4% e a página não reage.
 * Esta função existe para que a calculadora consiga dizer o motivo em vez
 * de simplesmente não responder.
 */
export function recusaDoAlvo(alvo: number | null, atual: number, sexo: Sexo): AlvoRecusa | null {
  if (alvo === null) return null;
  if (alvo < GORDURA_ESSENCIAL[sexo]) return "abaixo-do-essencial";
  if (alvo >= atual) return "nao-e-reducao";
  return null;
}

export function textoDaRecusa(motivo: AlvoRecusa, sexo: Sexo): string {
  if (motivo === "abaixo-do-essencial") {
    return `Abaixo de ${GORDURA_ESSENCIAL[sexo]}% está a gordura essencial — a que reveste órgãos e nervos, e que o corpo não dispensa. Não é um alvo: é o piso fisiológico, e a conta não desce até lá.`;
  }
  return "Esse alvo não é menor que o percentual que você informou. Para ver o caminho até uma faixa, digite um percentual abaixo do atual.";
}

/** O alvo precisa ser menor que o atual e acima do essencial. */
export function alvoValido(alvo: number | null, atual: number, sexo: Sexo): alvo is number {
  return alvo !== null && alvo >= GORDURA_ESSENCIAL[sexo] && alvo < atual;
}

/* ───────────────────────── Faixas ───────────────────────── */

export type FaixaId = "essencial" | "atleta" | "bom" | "aceitavel" | "alto";

export interface Faixa {
  id: FaixaId;
  nome: string;
  /** Limite superior da faixa, por sexo. */
  ate: Record<Sexo, number>;
  descricao: string;
}

/**
 * As faixas de leitura.
 *
 * "Bom" e "aceitável" saem do que o artigo do site publica — homens de 10
 * a 20%, mulheres de 18 a 28%. As pontas vêm da literatura de composição
 * corporal. Nenhuma delas é meta: são régua de leitura, e a ferramenta
 * diz isso em voz alta porque a pergunta "qual o ideal" quase sempre
 * esconde outra, que é "estou bem?".
 */
export const FAIXAS: Faixa[] = [
  {
    id: "essencial",
    nome: "Abaixo do essencial",
    ate: { homem: 5, mulher: 12 },
    descricao: "Território de atleta em competição, e não sustentável. Abaixo disso a gordura que falta é a estrutural.",
  },
  {
    id: "atleta",
    nome: "Faixa atlética",
    ate: { homem: 10, mulher: 18 },
    descricao: "Definição visível. Exige controle alimentar contínuo, e poucas pessoas a mantêm o ano inteiro.",
  },
  {
    id: "bom",
    nome: "Faixa boa",
    ate: { homem: 15, mulher: 23 },
    descricao: "Saudável e sustentável, com boa aparência física sem viver em restrição.",
  },
  {
    id: "aceitavel",
    nome: "Faixa aceitável",
    ate: { homem: 20, mulher: 28 },
    descricao: "Dentro do que a literatura considera saudável, com espaço para melhorar se esse for o objetivo.",
  },
  {
    id: "alto",
    nome: "Acima da faixa saudável",
    ate: { homem: 100, mulher: 100 },
    descricao: "Faixa em que a redução de gordura traz ganho de saúde, não só de estética.",
  },
];

export function faixaDe(gorduraPct: number, sexo: Sexo): Faixa {
  return FAIXAS.find((f) => gorduraPct <= f.ate[sexo]) ?? FAIXAS[FAIXAS.length - 1];
}

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  pesoAtual: number;
  gorduraPct: number;
  sexo: Sexo;
  /** Quilos de gordura hoje. */
  massaGorda: number;
  /** Quilos de massa magra hoje — o número que a conta toda protege. */
  massaMagra: number;
  faixa: Faixa;
  /** Presente só quando há alvo informado. */
  alvo: AlvoResultado | null;
}

export interface AlvoResultado {
  gorduraAlvoPct: number;
  /** Peso no alvo, SE a massa magra ficar de pé. */
  pesoNoAlvo: number;
  /** Quilos a perder até lá. */
  perda: number;
  /** Gordura que sobraria no alvo. */
  massaGordaNoAlvo: number;
  faixaAlvo: Faixa;
  /**
   * O mesmo alvo, se a pessoa perder massa magra junto na proporção
   * clássica de um quarto. É o cenário de quem emagrece sem treino de
   * força — e o número que mostra por que o "se" da conta importa.
   */
  semTreino: { pesoNoAlvo: number; perda: number; massaMagraFinal: number; perdaMagraFracao: number; viavel: boolean };
}

/** Um quarto da perda como massa magra é a regra clássica de quem não treina força. */
export const FRACAO_MAGRA_SEM_TREINO = 0.25;

/**
 * Até onde o cenário "sem treino de força" ainda descreve um corpo real.
 *
 * A álgebra do cenário não tem freio: quanto mais longe o alvo, mais
 * massa magra ela consome, e num alvo distante o bastante ela devolve um
 * corpo que ninguém tem — 90 kg com 60% de gordura mirando 15% "chegaria"
 * a 22,5 kg com 19,1 kg de massa magra. Não é um resultado, é a conta
 * saindo do domínio dela. Acima de perder 20% da massa magra atual a
 * ferramenta para de imprimir o número e diz o que ele significa: por
 * esse caminho o alvo não chega, porque o músculo acaba antes.
 */
export const PERDA_MAGRA_MAX_FRACAO = 0.2;

export function calcula(pesoAtual: number, gorduraPct: number, sexo: Sexo, gorduraAlvoPct: number | null): Resultado {
  const massaGorda = pesoAtual * (gorduraPct / 100);
  const massaMagra = pesoAtual - massaGorda;
  return {
    pesoAtual,
    gorduraPct,
    sexo,
    massaGorda,
    massaMagra,
    faixa: faixaDe(gorduraPct, sexo),
    alvo: gorduraAlvoPct === null ? null : calculaAlvo(pesoAtual, massaMagra, gorduraAlvoPct, sexo),
  };
}

function calculaAlvo(pesoAtual: number, massaMagra: number, alvoPct: number, sexo: Sexo): AlvoResultado {
  const fracao = alvoPct / 100;
  /* Com a massa magra intacta: peso = magra / (1 − alvo). */
  const pesoNoAlvo = massaMagra / (1 - fracao);
  const perda = pesoAtual - pesoNoAlvo;
  /*
   * Sem treino de força, um quarto do que sai é massa magra. Resolver o
   * sistema dá o peso final em que a composição fecha no alvo com a magra
   * já reduzida — é a mesma conta, com a magra como variável.
   */
  const magraFinal = (massaMagra - FRACAO_MAGRA_SEM_TREINO * pesoAtual) / (1 - FRACAO_MAGRA_SEM_TREINO / (1 - fracao));
  const pesoSemTreino = magraFinal / (1 - fracao);
  const perdaMagraFracao = magraFinal > 0 ? (massaMagra - magraFinal) / massaMagra : 1;
  return {
    gorduraAlvoPct: alvoPct,
    pesoNoAlvo,
    perda,
    massaGordaNoAlvo: pesoNoAlvo * fracao,
    faixaAlvo: faixaDe(alvoPct, sexo),
    semTreino: {
      pesoNoAlvo: pesoSemTreino,
      perda: pesoAtual - pesoSemTreino,
      massaMagraFinal: magraFinal,
      perdaMagraFracao,
      viavel: magraFinal > 0 && perdaMagraFracao <= PERDA_MAGRA_MAX_FRACAO,
    },
  };
}

/* ───────────────────────── Tabela estática ───────────────────────── */

export const ALVOS_TABELA: Record<Sexo, number[]> = {
  homem: [20, 18, 15, 12, 10],
  mulher: [28, 25, 22, 20, 18],
};

export interface LinhaAlvo {
  alvo: number;
  pesoNoAlvo: number;
  perda: number;
  faixa: Faixa;
}

/** Cada alvo de gordura traduzido em peso e perda, para um corpo dado. */
export function tabelaDeAlvos(pesoAtual: number, gorduraPct: number, sexo: Sexo): LinhaAlvo[] {
  const magra = pesoAtual * (1 - gorduraPct / 100);
  return ALVOS_TABELA[sexo]
    .filter((a) => a < gorduraPct)
    .map((alvo) => {
      const peso = magra / (1 - alvo / 100);
      return { alvo, pesoNoAlvo: peso, perda: pesoAtual - peso, faixa: faixaDe(alvo, sexo) };
    });
}

/* ───────────────────────── Formatação ───────────────────────── */

export const formataKg = (kg: number) =>
  `${kg.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;

export const formataPct = (v: number) =>
  `${v.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_BIOIMPEDANCIA =
  "A bioimpedância não mede gordura: ela mede resistência elétrica, estima a água do corpo e deduz o resto por equação. É por isso que o resultado muda de um dia para o outro com treino recente, sal, álcool ou hidratação — sem que um grama de gordura tenha saído ou entrado.";

export const NOTA_MESMO_APARELHO =
  "Para acompanhar evolução, o que vale é repetir no mesmo aparelho, no mesmo horário e nas mesmas condições. Comparar o exame de hoje com o de outra balança é comparar duas equações diferentes, não dois momentos do seu corpo.";

export const NOTA_MASSA_MAGRA_DE_PE =
  "A conta supõe que a sua massa magra fica de pé — e esse é o maior “se” dela. Sem treino de força e sem proteína suficiente, parte do que sai é músculo, e o alvo chega num corpo menor do que o número prometeu.";

export const NOTA_SEM_TREINO_INVIAVEL =
  "Por esse caminho o alvo não chega. Perder essa quantidade de gordura sem treino de força levaria junto mais massa magra do que um corpo tem para dar — o músculo acabaria antes do percentual fechar. Não é um alvo mais difícil: é um alvo que só existe com treino de força e proteína.";

export const NOTA_FAIXA_NAO_E_META =
  "As faixas são régua de leitura, não meta. O percentual que faz sentido para você depende do que você quer fazer com o corpo e de quanto de controle alimentar cabe na sua vida — e ninguém precisa viver na faixa atlética para ser saudável.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora.
 *
 * Os quatro que terminam com o leitor olhando para números de composição
 * sem saber o que fazer com eles. `como-perder-gordura-sem-perder-massa-muscular`
 * entra porque é literalmente o cenário que a ferramenta compara.
 */
export const ARTIGOS_COM_CALCULADORA_COMPOSICAO: string[] = [
  "bioimpedancia-como-interpretar",
  "percentual-de-gordura-ideal",
  "como-saber-se-estou-perdendo-gordura-ou-musculo",
  "imc-limitacoes-e-composicao-corporal",
  "balanca-de-bioimpedancia-vale-a-pena",
];
