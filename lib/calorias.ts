/**
 * Calculadora de Déficit Calórico — dados e regras.
 *
 * Mesma arquitetura da calculadora de proteína: tudo que é FATO mora aqui,
 * fora do componente. Fórmula, fatores de atividade, faixas de déficit e o
 * registro de onde a ferramenta aparece. O componente só apresenta.
 *
 * A regra que governa o arquivo inteiro: TMB e TDEE são ESTIMATIVAS. A
 * Mifflin-St Jeor foi construída por calorimetria indireta em 498 adultos e
 * explica boa parte da variação entre pessoas — não toda. Duas pessoas com
 * os mesmos dados de entrada podem ter gastos reais diferentes. Por isso
 * nada aqui se chama "medição", nada é exibido com casa decimal, e o
 * arredondamento de exibição é grosso de propósito (dezena), para que a
 * interface não comunique uma precisão que a equação não tem.
 */

export const REFERENCIA_TMB = {
  rotulo: "Mifflin MD, St Jeor ST, Hill LA, Scott BJ, Daugherty SA, Koh YO. American Journal of Clinical Nutrition (1990)",
  rotuloCurto: "Mifflin-St Jeor (1990)",
  url: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
  detalhe:
    "Equação derivada de calorimetria indireta em 498 adultos saudáveis (251 homens e 247 mulheres, de 19 a 78 anos), metade com peso normal e metade com obesidade.",
};

/**
 * O contexto sobre adaptação metabólica que sustenta o aviso de "comece e
 * ajuste" — o mesmo trabalho já citado no artigo de déficit do acervo, de
 * propósito: número que muda de página para página não é referência.
 */
export const REFERENCIA_ADAPTACAO = {
  rotulo: "Leibel et al., New England Journal of Medicine (1995)",
  url: "https://pubmed.ncbi.nlm.nih.gov/7632212/",
};

// ─── Entrada ─────────────────────────────────────────────────────────────────

export type Sexo = "masculino" | "feminino" | "nao_informado";

export const PESO_MIN = 30;
export const PESO_MAX = 300;
export const ALTURA_MIN = 120;
export const ALTURA_MAX = 230;
export const IDADE_MIN = 14;
export const IDADE_MAX = 100;

/** Abaixo disso a ferramenta orienta em vez de calcular uma meta. */
export const IDADE_ADULTA = 18;

/**
 * Normaliza a digitação brasileira: aceita "80", "80,5" e "80.5".
 * Retorna null quando não dá para interpretar como número positivo.
 */
export function normalizaNumero(texto: string): number | null {
  const limpo = texto.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(limpo)) return null;
  const n = Number(limpo);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/**
 * Altura em centímetros, aceitando metros.
 *
 * "1,75" e "175" são as duas formas que as pessoas realmente digitam. A
 * regra de desambiguação é segura porque as faixas não se tocam: ninguém
 * tem 3 cm nem 230 metros. Valores entre 3 e 120 (ex.: "80") continuam
 * inválidos em vez de virarem 80 cm silenciosamente — altura de 80 cm num
 * formulário de adulto é quase certamente erro de digitação.
 */
export function normalizaAltura(texto: string): number | null {
  const n = normalizaNumero(texto);
  if (n === null) return null;
  if (n < 3) return Math.round(n * 100);
  return Math.round(n);
}

/** Idade: só inteiro. "35,5 anos" não muda nada na conta e confunde. */
export function normalizaIdade(texto: string): number | null {
  const limpo = texto.trim();
  if (!/^\d+$/.test(limpo)) return null;
  const n = Number(limpo);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// ─── Fatores de atividade ────────────────────────────────────────────────────

export interface NivelAtividade {
  id: string;
  fator: number;
  titulo: string;
  descricao: string;
}

/**
 * Os fatores clássicos, os mesmos já publicados nos artigos do acervo —
 * não inventamos uma tabela paralela.
 *
 * As descrições foram escritas contra o erro mais comum destas
 * calculadoras: a pessoa treina 1h e se marca como "extremamente ativo",
 * inflando o TDEE em centenas de kcal e transformando um déficit em
 * manutenção. Por isso cada descrição fala da rotina INTEIRA (as outras 23
 * horas), e não só do treino, e os níveis de cima exigem explicitamente
 * trabalho fisicamente pesado — não apenas academia.
 */
export const NIVEIS: NivelAtividade[] = [
  {
    id: "pouco",
    fator: 1.2,
    titulo: "Pouco ativo",
    descricao: "Trabalho sentado a maior parte do dia e pouco ou nenhum exercício na semana.",
  },
  {
    id: "leve",
    fator: 1.375,
    titulo: "Levemente ativo",
    descricao: "Treino leve 1 a 3 vezes por semana, ou uma rotina em que você anda bastante no dia a dia.",
  },
  {
    id: "moderado",
    fator: 1.55,
    titulo: "Moderadamente ativo",
    descricao: "Treino 3 a 5 vezes por semana, com o resto do dia razoavelmente ativo.",
  },
  {
    id: "muito",
    fator: 1.725,
    titulo: "Muito ativo",
    descricao: "Treino forte quase todos os dias, ou trabalho que exige esforço físico durante boa parte da jornada.",
  },
  {
    id: "extremo",
    fator: 1.9,
    titulo: "Extremamente ativo",
    descricao: "Volume alto de treino somado a trabalho fisicamente pesado. É menos comum do que parece.",
  },
];

export const DICA_ATIVIDADE =
  "Na dúvida entre dois níveis, comece pelo menor. Treinar uma hora por dia não faz de ninguém extremamente ativo se as outras horas forem sentadas — e superestimar aqui é o erro que faz a conta inteira desandar.";

// ─── A conta ─────────────────────────────────────────────────────────────────

/**
 * Mifflin-St Jeor. A constante é o único ponto em que a equação separa
 * homens (+5) de mulheres (−161).
 */
export function tmbPorSexo(pesoKg: number, alturaCm: number, idade: number, sexo: "masculino" | "feminino"): number {
  const base = 10 * pesoKg + 6.25 * alturaCm - 5 * idade;
  return sexo === "masculino" ? base + 5 : base - 161;
}

export interface Faixa {
  min: number;
  max: number;
}

/**
 * TMB como faixa, sempre.
 *
 * Para quem informou o sexo, min === max e a interface mostra um número só.
 * Para quem preferiu não informar, a faixa vai da constante feminina à
 * masculina — 166 kcal de diferença. Inventar um valor único ali (uma
 * média, um "unissex") seria produzir um número que a equação não prevê;
 * mostrar a faixa é dizer a verdade sobre o que dá para saber.
 */
export function calculaTMB(pesoKg: number, alturaCm: number, idade: number, sexo: Sexo): Faixa {
  if (sexo === "nao_informado") {
    return {
      min: tmbPorSexo(pesoKg, alturaCm, idade, "feminino"),
      max: tmbPorSexo(pesoKg, alturaCm, idade, "masculino"),
    };
  }
  const v = tmbPorSexo(pesoKg, alturaCm, idade, sexo);
  return { min: v, max: v };
}

/** Gasto diário estimado = TMB × fator de atividade. */
export function calculaTDEE(tmb: Faixa, fator: number): Faixa {
  return { min: tmb.min * fator, max: tmb.max * fator };
}

/** Ingestão estimada para um percentual de déficit sobre o gasto. */
export function aplicaDeficit(tdee: Faixa, percentual: number): Faixa {
  const k = 1 - percentual / 100;
  return { min: tdee.min * k, max: tdee.max * k };
}

/**
 * Arredondamento de EXIBIÇÃO — dezena mais próxima.
 *
 * A conta roda em precisão total internamente; só a tela arredonda. A
 * dezena é escolha deliberada: "2.437 kcal" comunica uma exatidão que uma
 * equação preditiva não tem, e a diferença entre 2.430 e 2.440 não muda
 * decisão nenhuma de ninguém.
 */
export function arredondaKcal(n: number): number {
  return Math.round(n / 10) * 10;
}

/** Formata para o padrão brasileiro: 2670 → "2.670". */
export function formataKcal(n: number): string {
  return arredondaKcal(n).toLocaleString("pt-BR");
}

/** Uma faixa vira texto: número único quando min === max, intervalo quando não. */
export function formataFaixa(f: Faixa): string {
  const a = arredondaKcal(f.min);
  const b = arredondaKcal(f.max);
  return a === b ? a.toLocaleString("pt-BR") : `${a.toLocaleString("pt-BR")}–${b.toLocaleString("pt-BR")}`;
}

// ─── Faixas de déficit ───────────────────────────────────────────────────────

export interface FaixaDeficit {
  id: "leve" | "moderado" | "maior";
  /** Percentual único, ou intervalo quando a faixa é apresentada como range. */
  percentualMin: number;
  percentualMax: number;
  titulo: string;
  descricao: string;
  /** A referência central ganha destaque visual — sem virar prescrição. */
  destaque?: boolean;
}

/**
 * Percentuais, não kcal fixas.
 *
 * Um corte de 500 kcal é ~18% para quem gasta 2.800 e ~29% para quem gasta
 * 1.700 — o mesmo número absoluto produz experiências completamente
 * diferentes. O percentual escala com a pessoa, e é exatamente o argumento
 * que o artigo "Quantas Calorias Cortar Para Emagrecer" já defende.
 *
 * As três faixas caem em cima das mesmas bandas que o acervo recomenda em
 * kcal absolutas (leve 250–350, moderado 400–550, maior 600–750 para um
 * gasto típico de ~2.700), então a ferramenta reforça os artigos em vez de
 * disputar com eles.
 *
 * "Moderado" tem destaque e se chama referência prática — nunca "ideal".
 * Não existe déficit ideal universal, e a faixa maior nunca é sugerida
 * automaticamente.
 */
export const FAIXAS_DEFICIT: FaixaDeficit[] = [
  {
    id: "leve",
    percentualMin: 10,
    percentualMax: 10,
    titulo: "Déficit leve",
    descricao:
      "Corte menor, normalmente mais fácil de sustentar. Costuma interessar a quem tem pouco peso a perder ou prioriza desempenho no treino e preservação de massa muscular.",
  },
  {
    id: "moderado",
    percentualMin: 15,
    percentualMax: 20,
    titulo: "Déficit moderado",
    descricao:
      "Uma referência prática para começar em muitos casos, equilibrando velocidade de perda e aderência ao longo das semanas.",
    destaque: true,
  },
  {
    id: "maior",
    percentualMin: 25,
    percentualMax: 25,
    titulo: "Déficit maior",
    descricao:
      "Corte mais agressivo, que tende a exigir mais atenção com fome, recuperação, desempenho no treino e preservação de massa muscular.",
  },
];

// ─── Textos que não podem virar promessa ─────────────────────────────────────

export const NOTA_ESTIMATIVA =
  "É uma estimativa inicial. Seu gasto real pode variar e pode ser refinado observando peso, medidas, fome, desempenho e rotina ao longo das semanas.";

export const NOTA_SEM_PROMESSA =
  "Um déficit energético mantido ao longo do tempo tende a levar à redução de peso, mas a velocidade varia entre pessoas e não acontece de forma linear. O peso na balança também oscila por água, glicogênio, conteúdo gastrointestinal e mudanças de rotina.";

export const NOTA_SEM_DUPLA_CONTAGEM =
  "O fator de atividade já representa o seu treino. Somar de novo as calorias que o relógio ou a esteira mostram costuma inflar bastante a estimativa — por isso a calculadora não pede esse número.";

export const DISCLAIMER =
  "Os valores são estimativas educacionais e não substituem avaliação individual. Necessidades energéticas variam conforme composição corporal, rotina, condições de saúde, medicamentos e histórico alimentar.";

export const DISCLAIMER_ESPECIAL =
  "Gestantes, lactantes, menores de idade e pessoas com condições clínicas específicas devem receber orientação individual de profissional habilitado.";

export const ORIENTACAO_MENOR_IDADE =
  "Para menores de 18 anos, necessidades energéticas acompanham crescimento e maturação, e uma meta de déficit não deve ser definida por uma calculadora. O caminho aqui é avaliação individual com profissional habilitado.";

/**
 * Sinalização de meta muito baixa — sem piso universal.
 *
 * Regras do tipo "mulher nunca pode comer menos de 1.200" viram algoritmo
 * de segurança individual sem base para isso. O sinal usado aqui é
 * relativo à própria pessoa: uma meta abaixo da TMB estimada dela. Isso é
 * fisiologicamente informativo, individualizado, e não prescreve nada —
 * apenas recomenda avaliação antes de adotar o número.
 */
export function metaAbaixoDaTMB(meta: Faixa, tmb: Faixa): boolean {
  return meta.min < tmb.min;
}

export const AVISO_META_BAIXA =
  "Essa meta fica abaixo da sua taxa metabólica estimada. Esse resultado merece avaliação individual antes de ser usado como meta alimentar.";

// ─── Onde a calculadora aparece ──────────────────────────────────────────────

/**
 * Artigos que exibem a calculadora cedo no corpo (antes da segunda seção).
 *
 * Mesmo critério da calculadora de proteína: entra onde o leitor chegou com
 * a pergunta que a ferramenta responde — "quanto eu devo comer?" — e não
 * onde a palavra "caloria" aparece.
 *
 * Ficam de fora, por decisão: artigos de exercício específico (quanto de
 * cardio, esteira, pular corda), de contexto (álcool, dia do lixo), de
 * medicamento (GLP-1, onde a conta por peso corporal superestima em
 * obesidade, mesma razão da calculadora de proteína) e os de expectativa de
 * tempo (quantos kg por mês), cuja dúvida é sobre velocidade e não sobre
 * quanto comer.
 */
/**
 * "como-calcular-tmb-tdee-calorias" e "quantas-calorias-eu-gasto-por-dia"
 * moraram aqui até a Calculadora de TMB/TDEE existir — migraram para
 * ARTIGOS_COM_CALCULADORA_TDEE (lib/tdee.ts) porque a pergunta dos dois é
 * "quanto eu gasto?", não "quanto cortar?". Uma ferramenta por artigo.
 */
export const ARTIGOS_COM_CALCULADORA_DEFICIT: string[] = [
  /**
   * A resposta mais frequente para "por que não consigo emagrecer" é que a
   * pessoa não está no déficit que imagina estar. O artigo explica o
   * mecanismo; a calculadora entrega o número que falta.
   */
  "por-que-voce-nao-consegue-emagrecer",
  "deficit-calorico-como-calcular",
  "quantas-calorias-cortar-para-emagrecer",
  /**
   * "Plano realista para emagrecer 10 kg" e "a matemática do
   * emagrecimento" pedem a conta ao lado do texto: os dois artigos
   * ENSINAM a fazer o cálculo que a ferramenta faz.
   */
  "como-emagrecer-10-kg",
  "quantas-calorias-tem-1kg-de-gordura",
];
