/**
 * Destrave Seu Corpo — Teste de Mobilidade do Montinho: tipos.
 *
 * Um arquivo só de tipos porque o motor, a bateria e o banco de exercícios
 * precisam falar a mesma língua sem depender um do outro. A regra da casa
 * continua: os fatos moram em lib/, o componente só apresenta.
 *
 * A decisão de vocabulário mais importante está no tipo Estado. Não existe
 * "ruim", não existe "disfunção", não existe grau. Existem quatro estados
 * educacionais, e o pior deles se chama "prioridade" — que descreve o que a
 * pessoa deve FAZER, não o que ela TEM. Um teste online não diagnostica, e o
 * tipo é o primeiro lugar onde isso é imposto: não há como escrever no
 * produto um estado que o tipo não permite.
 */

export type RegiaoId = "tornozelo" | "ombro" | "toracica" | "quadril" | "posterior";

/**
 * Os quatro estados. "naoAvaliado" é de primeira classe de propósito: o teste
 * é adaptativo, então a maioria das pessoas termina com regiões não avaliadas,
 * e o mapa precisa mostrar isso como ausência de informação — nunca como
 * ausência de problema.
 */
export type Estado = "boa" | "melhorar" | "prioridade" | "naoAvaliado";

export type Lado = "D" | "E";

/** Onde o protocolo será executado. Muda a prescrição inteira (Behm et al.). */
export type Momento = "pre" | "isolada";

/**
 * A unidade da medida, guardada JUNTO com o valor.
 *
 * O Montinho decidiu que a fita métrica é o padrão — ela é o que dá ao
 * knee-to-wall os valores de referência publicados. Mas quem não tem fita não
 * pode ficar de fora, então existe a régua do próprio corpo: a largura dos
 * dedos.
 *
 * As duas escalas NUNCA se convertem uma na outra. Um dedo tem cerca de 2 cm,
 * mas "cerca de" é exatamente o tipo de imprecisão que estragaria a comparação
 * de reteste — a pessoa mediria 10 cm em março e 5 dedos em abril e a
 * ferramenta anunciaria uma evolução que não existiu. Por isso o reteste exige
 * a mesma unidade do teste original, e o motor recusa comparar unidades
 * diferentes.
 */
export type Unidade = "cm" | "dedos" | "referencia";

/** Uma resposta ordinal a um teste, por lado quando o teste é bilateral. */
export interface Resposta {
  testeId: string;
  /** Índice da opção escolhida (0 = menor amplitude) ou "naoConsegui". */
  D?: number | "naoConsegui";
  E?: number | "naoConsegui";
  /** Medida numérica quando o teste aceita uma (knee-to-wall). */
  medidaD?: number;
  medidaE?: number;
  unidade?: Unidade;
}

export interface OpcaoResposta {
  /** O que a pessoa vê. Descreve o que ela observa, nunca o que ela "tem". */
  rotulo: string;
  /** O estado que esta opção produz. */
  estado: Exclude<Estado, "naoAvaliado">;
}

export interface TesteMobilidade {
  id: string;
  regiao: RegiaoId;
  nome: string;
  /** Por que importa para quem faz musculação — em uma frase, sem anatomia. */
  porqueImporta: string;
  bilateral: boolean;
  posicaoInicial: string;
  movimento: string;
  /** O erro que mais estraga a medida. */
  erroComum: string;
  /** O critério visual, escrito para quem está sozinho com o celular. */
  criterio: string;
  opcoes: OpcaoResposta[];
  /** Exercícios de musculação que esta região pode influenciar. */
  influencia: string[];
  /**
   * Aceita medida numérica? Só o knee-to-wall aceita — é o único da bateria
   * com valores de referência publicados.
   */
  medivel?: {
    unidadePreferida: "cm";
    unidadeAlternativa: "dedos";
    /** Faixas em cm, da literatura. */
    cortesCm: { boa: number; melhorar: number };
    /** Faixas em dedos, declaradas como aproximação. */
    cortesDedos: { boa: number; melhorar: number };
  };
  /** Vazio na v1. O schema já existe para o vídeo entrar sem refatoração. */
  video?: string;
  fotos?: string[];
}

export type TipoExercicio = "dinamico" | "estatico" | "forca";

export interface ExercicioMobilidade {
  id: string;
  regiao: RegiaoId;
  nome: string;
  /** Em quais momentos este exercício pode ser prescrito. */
  momentos: Momento[];
  tipo: TipoExercicio;
  /** A dose por momento. Escrita para o card, já pronta. */
  dose: Partial<Record<Momento, string>>;
  /**
   * Segundos de trabalho por sessão, por lado, para o cálculo de volume
   * semanal. Só faz sentido em exercício estático — é ele que a dose-resposta
   * de Ingram et al. descreve.
   */
  segundosPorLado?: Partial<Record<Momento, number>>;
  como: string;
  senteOnde: string;
  evite: string;
  equipamento: "nenhum" | "parede" | "bastao-opcional" | "rolo-opcional";
  /** Desempate quando dois exercícios servem igual: 1 é o mais simples. */
  facilidade: 1 | 2 | 3;
  /** Resposta ao botão "por que estou fazendo isso?" — 2 a 4 frases. */
  porque: string;
  video?: string;
  fotos?: string[];
}

export interface EstadoRegiao {
  regiao: RegiaoId;
  estado: Estado;
  /** Estado por lado, quando o teste foi bilateral. */
  porLado?: Partial<Record<Lado, Estado>>;
  /** Só quando a diferença passa de um degrau inteiro da escala. */
  assimetria: boolean;
  /** A medida bruta, guardada para o reteste comparar. */
  medida?: { D?: number; E?: number; unidade: Unidade };
}

export type Mapa = Record<RegiaoId, EstadoRegiao>;

/** O que a pessoa informou antes dos testes. */
export interface Contexto {
  frequencia: "comecando" | "1-2" | "3-4" | "5+";
  objetivo: "hipertrofia" | "emagrecimento" | "forca" | "saude" | "movimento";
  /** Exercícios em que ela percebe dificuldade. Vazio = teste completo. */
  dificuldades: string[];
  /** Onde ela sente rigidez. Só direciona a ordem, nunca pontua. */
  rigidez: RegiaoId[];
  momento: Momento;
  minutos: 3 | 6 | 10;
  diasDeTreino: number;
}

export interface Prioridade {
  regiao: RegiaoId;
  estado: Exclude<Estado, "naoAvaliado">;
  /** Por que esta região subiu — mostrado na tela, para a escolha ser legível. */
  motivo: string;
  /** Os exercícios de musculação que ela pode influenciar. */
  influencia: string[];
}

export interface ItemProtocolo {
  exercicio: ExercicioMobilidade;
  dose: string;
  momento: Momento;
}

export interface Protocolo {
  /** Protocolo dos dias de treino, quando o momento é pré-treino. */
  a: { titulo: string; itens: ItemProtocolo[]; frequencia: number };
  /** Protocolo dos dias sem treino. Pode vir vazio. */
  b: { titulo: string; itens: ItemProtocolo[]; frequencia: number } | null;
  /** O exercício único do plano B de 2 minutos. */
  planoB: ItemProtocolo;
  /** Segundos semanais de alongamento estático, por região. */
  volumeSemanal: Partial<Record<RegiaoId, number>>;
  minutosPorSessao: number;
}
