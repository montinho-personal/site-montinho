/**
 * O motor da Calculadora de Potencial Natural.
 *
 * POR QUE ESTA FERRAMENTA EXISTE
 *
 * O ecossistema de ferramentas do site está torto: o lado do emagrecimento
 * tem seis calculadoras (gasto, déficit, macros, cardápio, meta de peso,
 * GLP-1) e o lado do ganho de massa tem três, nenhuma respondendo a
 * pergunta central de quem treina para crescer — quanto ainda dá para
 * ganhar, e em quanto tempo.
 *
 * No Search Console: `hipertrofia-natural-limite` tem 959 impressões em 90
 * dias, `quanto-tempo-para-ganhar-massa-muscular` 309 e
 * `fibras-musculares-tipo-1-tipo-2` 298 — nenhum com ferramenta.
 *
 * O NÚMERO 25 NÃO É UMA PAREDE, E ISSO PRECISA SER DITO
 *
 * O FFMI de 25 vem de Kouri et al. (1995), que mediu 157 atletas e
 * observou que os que não usavam esteroides ficavam abaixo desse valor.
 * Virou "o limite natural" na internet, e não é isso que o estudo diz: é
 * o teto de UMA amostra, de 1995, de homens, com a composição corporal
 * estimada por equação de dobras — e os próprios vencedores do Mr. America
 * da era pré-esteroide tinham média de 25,4, acima do tal limite.
 *
 * Por isso a ferramenta fala em FAIXA DE REFERÊNCIA, nunca em limite, e
 * diz quantas ressalvas cabem no número antes de alguém usar o resultado
 * para decidir que já chegou ao fim.
 *
 * A BASE FEMININA É MAIS FRACA, E ISSO TAMBÉM PRECISA SER DITO
 *
 * O estudo de Kouri é masculino. Para mulheres, a referência vem de outra
 * literatura — coortes de atletas universitárias, em que o percentil 97,5
 * fica perto de 23,9 e a maioria das atletas de força fica entre 20 e 22.
 * A ferramenta usa 22 como referência feminina e declara que a base é
 * diferente, em vez de fingir simetria.
 *
 * O QUE ELA NUNCA FAZ
 *
 * Dizer que alguém "chegou no limite" e, portanto, deve parar ou usar
 * alguma coisa. O FFMI perto da referência quer dizer que o ritmo de
 * ganho será lento — o que já era verdade, e é o motivo pelo qual as
 * taxas desta calculadora caem com o tempo de treino.
 */

import { parseNumero } from "./polichinelo";

export { parseNumero };

/* ───────────────────────── Fontes ───────────────────────── */

export interface Fonte {
  rotulo: string;
  rotuloCurto: string;
  url: string;
  resumo: string;
}

export const FONTE_KOURI: Fonte = {
  rotulo:
    "Kouri EM, Pope HG, Katz DL, Oliva P. Fat-free mass index in users and nonusers of anabolic-androgenic steroids. Clinical Journal of Sport Medicine, 1995",
  rotuloCurto: "Kouri et al. (1995)",
  url: "https://pubmed.ncbi.nlm.nih.gov/7496846/",
  resumo:
    "mediu 157 atletas e encontrou, entre os que não usavam esteroides, FFMI normalizado abaixo de 25,0 — o número que virou o “limite natural” na internet. É o teto de uma amostra, não uma lei: os Mr. America da era pré-esteroide tinham média estimada de 25,4.",
};

export const FONTE_FFMI_MULHERES: Fonte = {
  rotulo:
    "Fields JB, Merrigan JJ, White JB, Jones MT. Normative fat-free mass index values for a diverse sample of collegiate female athletes. Journal of Sports Sciences, 2019",
  rotuloCurto: "Fields et al. (2019)",
  url: "https://pubmed.ncbi.nlm.nih.gov/30893018/",
  resumo:
    "levantou valores de referência de FFMI em atletas universitárias: a maioria das modalidades de força fica entre 20 e 22, e o percentil 97,5 do conjunto chega perto de 23,9.",
};

export const FONTE_ARAGON: Fonte = {
  rotulo: "Aragon AA. Modelo de taxa de ganho muscular por tempo de treino — Alan Aragon's Research Review",
  rotuloCurto: "modelo de Aragon",
  url: "https://alanaragon.com/",
  resumo:
    "propõe taxas de ganho como percentual do peso corporal por mês, decrescentes com o tempo de treino: cerca de 1% a 1,5% no primeiro ano, 0,5% a 1% nos dois seguintes e 0,25% a 0,5% depois disso.",
};

export const FONTES_POTENCIAL: Fonte[] = [FONTE_KOURI, FONTE_FFMI_MULHERES, FONTE_ARAGON];

/* ───────────────────────── Entradas ───────────────────────── */

export type Sexo = "homem" | "mulher";


/**
 * A faixa de altura em que a normalização ainda significa alguma coisa.
 *
 * Encolheu de 1,30–2,30 na auditoria. A correção de 6,3 × (1,80 − altura)
 * é linear e foi ajustada a atletas adultos: aplicada a 1,30 m ela produz
 * FFMI de 146 em entrada absurda, e a 2,30 m chega a devolver número
 * NEGATIVO. Fora desta faixa a conta deixa de descrever um corpo.
 */
export const ALTURA_MIN = 1.45;
export const ALTURA_MAX = 2.1;
export const PESO_MIN = 35;
export const PESO_MAX = 250;
export const GORDURA_MIN = 3;
export const GORDURA_MAX = 60;

/**
 * Acima deste percentual, o "peso na referência" deixa de ser uma meta.
 *
 * A conta projeta o peso mantendo o percentual de gordura atual, e isso é
 * honesto — mas para quem está com 30% ela devolve "você chegaria a 108
 * kg", um número que ninguém deveria perseguir mantendo os 30%. Acima
 * daqui a tela diz que o caminho realista começa por reduzir gordura.
 */
export const GORDURA_ALTA: Record<Sexo, number> = { homem: 25, mulher: 35 };

export const alturaValida = (a: number | null): a is number => a !== null && a >= ALTURA_MIN && a <= ALTURA_MAX;
export const pesoValido = (p: number | null): p is number => p !== null && p >= PESO_MIN && p <= PESO_MAX;
export const gorduraValida = (g: number | null): g is number => g !== null && g >= GORDURA_MIN && g <= GORDURA_MAX;

/** Aceita "1,75" e "175" — quem digita altura faz as duas coisas. */
export function parseAltura(texto: string): number | null {
  const n = parseNumero(texto);
  if (n === null) return null;
  return n > 3 ? n / 100 : n;
}

export interface Nivel {
  id: NivelId;
  nome: string;
  descricao: string;
  /** Ganho mensal como fração do peso corporal. */
  taxa: { min: number; max: number };
}

export type NivelId = "iniciante" | "intermediario" | "avancado";

/**
 * As taxas do modelo de Aragon, como percentual do peso por mês.
 *
 * Elas caem com o tempo de treino, e é isso que responde de verdade
 * "quanto ainda dá para ganhar": não é o FFMI que freia alguém, é o fato
 * de que o segundo ano rende metade do primeiro.
 */
export const NIVEIS: Nivel[] = [
  {
    id: "iniciante",
    nome: "Primeiro ano",
    descricao: "Treinando e comendo de forma consistente há menos de um ano.",
    taxa: { min: 0.01, max: 0.015 },
  },
  {
    id: "intermediario",
    nome: "1 a 3 anos",
    descricao: "Já passou do primeiro ano, ainda progride com regularidade.",
    taxa: { min: 0.005, max: 0.01 },
  },
  {
    id: "avancado",
    nome: "Mais de 3 anos",
    descricao: "Treino consistente há anos; progresso mede-se em meses, não em semanas.",
    taxa: { min: 0.0025, max: 0.005 },
  },
];

export const NIVEL_PADRAO: NivelId = "intermediario";

export function nivel(id: NivelId): Nivel {
  return NIVEIS.find((n) => n.id === id) ?? NIVEIS[1];
}

/**
 * O horizonte em que a projeção ainda diz alguma coisa.
 *
 * Além de cinco anos o modelo deixa de valer por construção: a taxa cai
 * conforme a pessoa avança de nível, então projetar a taxa de hoje por
 * uma década produziria um número com cara de resposta e nenhum conteúdo.
 */
export const HORIZONTE_MESES = 60;

/** A faixa de referência de FFMI por sexo, com a base de cada uma. */
export const REFERENCIA_FFMI: Record<Sexo, number> = { homem: 25, mulher: 22 };

/* ───────────────────────── FFMI ───────────────────────── */

/** Massa magra em kg, a partir do peso e do percentual de gordura. */
export function massaMagra(pesoKg: number, gorduraPct: number): number {
  return pesoKg * (1 - gorduraPct / 100);
}

/** FFMI bruto: massa magra dividida pela altura ao quadrado. */
export function ffmi(massaMagraKg: number, alturaM: number): number {
  return alturaM > 0 ? massaMagraKg / (alturaM * alturaM) : 0;
}

/**
 * FFMI normalizado para 1,80 m, como no estudo de Kouri.
 *
 * A correção existe porque o FFMI bruto favorece quem é baixo: a altura
 * entra ao quadrado no denominador, mas massa magra não cresce ao
 * quadrado com a estatura. Sem normalizar, comparar alguém de 1,65 com a
 * referência de 25 seria comparar coisas diferentes.
 */
export function ffmiNormalizado(massaMagraKg: number, alturaM: number): number {
  return ffmi(massaMagraKg, alturaM) + 6.3 * (1.8 - alturaM);
}

/** A massa magra que corresponde a um FFMI normalizado, na altura dada. */
export function massaMagraDeFFMI(ffmiAlvo: number, alturaM: number): number {
  return (ffmiAlvo - 6.3 * (1.8 - alturaM)) * alturaM * alturaM;
}

/* ───────────────────────── O cálculo ───────────────────────── */

export interface Resultado {
  alturaM: number;
  pesoKg: number;
  gorduraPct: number;
  sexo: Sexo;
  massaMagra: number;
  ffmi: number;
  ffmiNormalizado: number;
  /** A referência da literatura para o sexo. */
  referencia: number;
  /** Quanto falta de massa magra até a referência. Zero ou negativo se já passou. */
  faltaAteReferencia: number;
  /** Já está na referência ou acima dela. */
  naReferencia: boolean;
  /** Ganho mensal esperado, em kg, pelo nível. */
  ganhoMensal: { min: number; max: number };
  /**
   * Meses para chegar à referência, na taxa do nível de hoje. null quando
   * já chegou, e `longe` quando a projeção passa de cinco anos — dar "7
   * anos e 3 meses" seria precisão fingida sobre um modelo que já não
   * vale nesse horizonte.
   */
  mesesAteReferencia: { min: number; max: number } | null;
  /** A projeção passou do horizonte em que o modelo ainda significa algo. */
  longe: boolean;
  /** Peso corporal na referência, mantendo o mesmo percentual de gordura. */
  pesoNaReferencia: number;
  /**
   * O percentual de gordura informado é alto o bastante para que o peso
   * na referência não sirva como meta — o caminho realista começa por
   * reduzir gordura, e aí todos os números daqui mudam.
   */
  gorduraAlta: boolean;
}

export function calcula(alturaM: number, pesoKg: number, gorduraPct: number, sexo: Sexo, nivelId: NivelId): Resultado {
  const magra = massaMagra(pesoKg, gorduraPct);
  const norm = ffmiNormalizado(magra, alturaM);
  const referencia = REFERENCIA_FFMI[sexo];
  const magraNaRef = massaMagraDeFFMI(referencia, alturaM);
  const falta = magraNaRef - magra;
  const n = nivel(nivelId);
  const ganhoMensal = { min: pesoKg * n.taxa.min, max: pesoKg * n.taxa.max };
  return {
    alturaM,
    pesoKg,
    gorduraPct,
    sexo,
    massaMagra: magra,
    ffmi: ffmi(magra, alturaM),
    ffmiNormalizado: norm,
    referencia,
    faltaAteReferencia: falta,
    naReferencia: falta <= 0,
    ganhoMensal,
    /* O rápido vem do ganho máximo, e vice-versa: por isso as pontas se cruzam. */
    mesesAteReferencia:
      falta > 0 ? { min: falta / ganhoMensal.max, max: falta / ganhoMensal.min } : null,
    longe: falta > 0 && falta / ganhoMensal.max > HORIZONTE_MESES,
    pesoNaReferencia: magraNaRef / (1 - gorduraPct / 100),
    gorduraAlta: gorduraPct > GORDURA_ALTA[sexo],
  };
}

/* ───────────────────────── Faixas de leitura ───────────────────────── */

export type Leitura = "inicio" | "caminho" | "perto" | "na-referencia";

/** Onde a pessoa está em relação à referência, para a tela escolher o texto. */
export function leitura(r: Resultado): Leitura {
  if (r.naReferencia) return "na-referencia";
  const p = r.ffmiNormalizado / r.referencia;
  if (p >= 0.94) return "perto";
  if (p >= 0.8) return "caminho";
  return "inicio";
}

/* ───────────────────────── Tabelas estáticas ───────────────────────── */

export const ALTURAS_TABELA = [1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9] as const;

export interface LinhaAltura {
  altura: number;
  /** Massa magra na referência. */
  massaMagra: number;
  /** Peso corporal correspondente, com 12% (homem) ou 22% (mulher) de gordura. */
  peso: number;
}

/** A referência traduzida em quilos, por altura — o número que a pessoa reconhece. */
export function tabelaPorAltura(sexo: Sexo): LinhaAltura[] {
  const gordura = sexo === "homem" ? 12 : 22;
  return ALTURAS_TABELA.map((altura) => {
    const magra = massaMagraDeFFMI(REFERENCIA_FFMI[sexo], altura);
    return { altura, massaMagra: magra, peso: magra / (1 - gordura / 100) };
  });
}

/* ───────────────────────── Formatação ───────────────────────── */

export const formataKg = (kg: number) =>
  `${kg.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;

export const formataFFMI = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function formataMeses(m: number): string {
  const meses = Math.round(m);
  if (meses < 12) return `${meses} ${meses === 1 ? "mês" : "meses"}`;
  const anos = Math.floor(meses / 12);
  const resto = meses % 12;
  const a = `${anos} ${anos === 1 ? "ano" : "anos"}`;
  return resto === 0 ? a : `${a} e ${resto} ${resto === 1 ? "mês" : "meses"}`;
}

/* ───────────────────────── Textos fixos ───────────────────────── */

export const NOTA_NAO_E_PAREDE =
  "A referência não é uma parede. Ela é o teto observado numa amostra de 1995, com a gordura estimada por dobras cutâneas — e os fisiculturistas da era pré-esteroide ficavam acima dela. Chegar perto significa que o ganho vai ficar lento, não que ele acabou.";

export const NOTA_GORDURA_ESTIMADA =
  "O percentual de gordura é a entrada mais frágil desta conta: balança de bioimpedância erra fácil cinco pontos, e cinco pontos mudam o resultado o bastante para trocar a sua leitura. Se o número veio de uma balança de academia, trate tudo aqui como ordem de grandeza.";

export const NOTA_TAXAS_OTIMISTAS =
  "As taxas supõem treino estruturado, comida suficiente e sono — as condições do modelo, não as da vida. Na prática, o ganho real costuma ficar abaixo delas, e a diferença entre o papel e o espelho quase sempre está na consistência, não no potencial.";

export const NOTA_TEMPO_OTIMISTA =
  "O tempo projetado é um piso, não uma previsão: ele supõe que você continua ganhando no ritmo de hoje, e esse ritmo cai conforme você avança. Quem hoje ganha no ritmo de intermediário estará no de avançado antes de chegar lá — e aí o mesmo quilo leva o dobro do tempo.";

export const NOTA_GORDURA_ALTA =
  "Com esse percentual de gordura, o peso projetado na referência não é uma meta: ele supõe que você mantém a mesma proporção de gordura enquanto ganha massa magra, o que não é o caminho de ninguém. Na prática, reduzir gordura primeiro sobe o seu FFMI sem que você ganhe um grama de músculo — e muda todos os números desta tela.";

export const NOTA_NAO_PRESCREVE =
  "Estar perto da referência não é motivo para parar de treinar nem para procurar atalho. É motivo para mudar a expectativa: de ganhar massa para ganhar força, melhorar a execução e manter o que já foi construído.";

/* ───────────────────────── Artigos ───────────────────────── */

/**
 * Artigos que EMBUTEM a calculadora.
 *
 * Os três que fazem a pergunta que ela responde. Nenhum pertencia a outra
 * ferramenta: `calorias-para-ganhar-massa-muscular` fica com a de macros
 * e `como-ganhar-massa-muscular` com a de TDEE, porque a pergunta dos dois
 * é quanto comer, não quanto dá para crescer.
 */
export const ARTIGOS_COM_CALCULADORA_POTENCIAL: string[] = [
  "hipertrofia-natural-limite",
  "quanto-tempo-para-ganhar-massa-muscular",
  /*
   * "fibras-musculares-tipo-1-tipo-2" saiu daqui na auditoria. O artigo é
   * sobre programar repetições, séries e cargas — a pergunta do leitor é
   * de montagem de treino, não "quanto ainda dá para ganhar". Ele foi para
   * o registro de link da Calculadora de Volume, que é a ferramenta certa
   * e não a disponível.
   */
];
