/**
 * Calculadora de 1RM e Carga de Treino — dados e regras.
 *
 * Mesma arquitetura das outras duas ferramentas: os fatos moram aqui, o
 * componente só apresenta, um registro central diz onde ela aparece e o
 * teste trava cada regra.
 *
 * A cadeia de produto é o que importa: o que eu fiz → qual meu 1RM → quanto
 * é cada percentual → quanto realmente dá para colocar → como montar a
 * barra. Uma calculadora que para no primeiro passo devolve um número que a
 * pessoa ainda precisa traduzir sozinha na hora do treino.
 *
 * E o 1RM aqui é sempre ESTIMADO. A equação sai de uma série submáxima; ela
 * não mede nada. O resultado serve para organizar treino e acompanhar
 * evolução — nunca como convite para tentar a carga máxima.
 */

// ─── Fontes ──────────────────────────────────────────────────────────────────

export const FONTE_EPLEY = {
  rotulo: "Epley, B. (1985). Poundage Chart. Boyd Epley Workout, Lincoln, NE",
  rotuloCurto: "Epley (1985)",
};

export const FONTE_BRZYCKI = {
  rotulo:
    "Brzycki, M. (1993). Strength testing: predicting a one-rep max from reps-to-fatigue. Journal of Physical Education, Recreation & Dance, 64(1), 88–90",
  rotuloCurto: "Brzycki (1993)",
};

/**
 * A evidência sobre os LIMITES das equações — mais importante aqui do que a
 * origem delas. LeSuer et al. compararam sete equações no supino,
 * agachamento e terra: as correlações são altas (r > 0,95), mas todas
 * subestimaram significativamente o 1RM no levantamento terra. É a base
 * factual do aviso de que uma equação só não vale igual para todo exercício
 * — não é ressalva genérica de rodapé.
 */
export const FONTE_LIMITES = {
  rotulo: "LeSuer et al., Journal of Strength and Conditioning Research (1997)",
  url: "https://journals.lww.com/nsca-jscr/abstract/1997/11000/the_accuracy_of_prediction_equations_for.1.aspx",
  resumo:
    "Comparou sete equações de estimativa no supino, agachamento e levantamento terra. As correlações com o 1RM real foram altas, mas todas as equações subestimaram o terra de forma significativa — evidência de que uma mesma equação não se comporta igual em todos os exercícios.",
};

// ─── Entrada ─────────────────────────────────────────────────────────────────

export const CARGA_MIN = 1;
export const CARGA_MAX = 600;
export const REPS_MIN = 1;
/** Acima disso a estimativa perde qualidade rápido — a ferramenta orienta. */
export const REPS_MAX = 15;
/** A partir daqui ainda calcula, mas avisa que a precisão cai. */
export const REPS_AVISO = 11;

/** Normaliza a digitação brasileira: "80", "80,5" e "80.5". */
export function normalizaCarga(texto: string): number | null {
  const limpo = texto.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(limpo)) return null;
  const n = Number(limpo);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Repetições: só inteiro. "8,5 repetições" não existe. */
export function normalizaReps(texto: string): number | null {
  const limpo = texto.trim();
  if (!/^\d+$/.test(limpo)) return null;
  const n = Number(limpo);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// ─── As equações ─────────────────────────────────────────────────────────────

/**
 * Epley: 1RM = carga × (1 + reps / 30).
 *
 * Com 1 repetição a equação já devolve a própria carga (1 + 1/30 seria
 * errado), então o caso é tratado explicitamente: quem levantou 100 kg uma
 * vez tem 1RM de 100 kg, não de 103. Retornar mais que o levantado seria
 * inventar força que ninguém demonstrou.
 */
export function epley1RM(carga: number, reps: number): number {
  if (reps <= 1) return carga;
  return carga * (1 + reps / 30);
}

/**
 * Brzycki: 1RM = carga × 36 / (37 − reps). Só de controle, para a seção de
 * metodologia mostrar que equações diferentes discordam um pouco. Não é
 * exibida como resultado principal, e nunca fazemos média das duas: média
 * de duas estimativas não é uma estimativa melhor, é um número sem fonte.
 */
export function brzycki1RM(carga: number, reps: number): number {
  if (reps <= 1) return carga;
  if (reps >= 37) return NaN;
  return (carga * 36) / (37 - reps);
}

/** Arredonda para o quilo — casa decimal em 1RM estimado é falsa precisão. */
export function arredondaKg(n: number): number {
  return Math.round(n);
}

/** Formata no padrão brasileiro, sem decimal inútil: 82.5 → "82,5", 81 → "81". */
export function formataKg(n: number): string {
  const arred = Math.round(n * 100) / 100;
  return Number.isInteger(arred) ? String(arred) : arred.toFixed(2).replace(/0$/, "").replace(".", ",");
}

// ─── Percentuais ─────────────────────────────────────────────────────────────

export const PERCENTUAIS = [50, 60, 65, 70, 75, 80, 85, 90, 95, 100] as const;

/** Chips de acesso rápido — os percentuais que a pessoa realmente treina. */
export const PERCENTUAIS_RAPIDOS = [60, 65, 70, 75, 80, 85, 90] as const;

/** Carga de um percentual, calculada sobre o 1RM em precisão total. */
export function cargaDoPercentual(umRM: number, percentual: number): number {
  return (umRM * percentual) / 100;
}

/**
 * Contexto das faixas — deliberadamente sem "zona de hipertrofia".
 *
 * A ideia de que 80% é hipertrofia e 90% é força é uma simplificação que a
 * literatura não sustenta: hipertrofia acontece numa amplitude ampla de
 * cargas quando as séries são levadas perto o suficiente da falha e o
 * volume é adequado. O que muda com a carga relativa é o número de
 * repetições possível e a exigência por série, não a existência de um
 * portal mágico de crescimento.
 */
export interface ContextoFaixa {
  de: number;
  ate: number;
  titulo: string;
  texto: string;
}

export const CONTEXTO_FAIXAS: ContextoFaixa[] = [
  {
    de: 50,
    ate: 65,
    titulo: "Cargas mais leves",
    texto:
      "Aparecem em protocolos com mais repetições, trabalho de técnica, velocidade ou volume acumulado com menos desgaste por série.",
  },
  {
    de: 70,
    ate: 80,
    titulo: "Cargas intermediárias",
    texto:
      "A região mais comum na maioria dos programas de treinamento resistido, por equilibrar carga por série e volume total possível.",
  },
  {
    de: 85,
    ate: 100,
    titulo: "Cargas altas",
    texto:
      "Costumam ser usadas em séries com poucas repetições e exigência alta por série, com mais atenção a técnica e recuperação.",
  },
];

export const NOTA_SEM_ZONA_MAGICA =
  "Hipertrofia pode acontecer em diferentes faixas de carga quando as séries são levadas perto o suficiente da falha e o volume é adequado. Não existe uma única zona de hipertrofia.";

// ─── Carga prática ───────────────────────────────────────────────────────────

export const INCREMENTOS = [1, 2, 2.5, 5] as const;
export type Incremento = (typeof INCREMENTOS)[number];

/** Arredonda a carga-alvo para o incremento realmente disponível. */
export function arredondaParaIncremento(carga: number, incremento: number): number {
  return Math.round(carga / incremento) * incremento;
}

export type Equipamento = "barra" | "halteres" | "maquina" | "indiferente";

export const EQUIPAMENTOS: { id: Equipamento; rotulo: string }[] = [
  { id: "barra", rotulo: "Barra" },
  { id: "halteres", rotulo: "Halteres" },
  { id: "maquina", rotulo: "Máquina" },
  { id: "indiferente", rotulo: "Não importa" },
];

// ─── Barra e anilhas ─────────────────────────────────────────────────────────

export const BARRAS = [20, 15, 10] as const;
export const ANILHAS_PADRAO = [25, 20, 15, 10, 5, 2.5, 1.25, 0.5] as const;

/** Quantas anilhas do mesmo tipo cabem de um lado, na prática. */
const MAX_POR_DENOMINACAO = 8;

export interface MontagemLado {
  /** Anilhas de um lado, da mais pesada para a mais leve. */
  anilhas: { peso: number; quantidade: number }[];
  /** Peso total de um lado. */
  pesoLado: number;
  /** Carga total montada, incluindo a barra. */
  total: number;
}

export interface ResultadoMontagem {
  /** Montagem exata, quando o alvo é montável. */
  exata: MontagemLado | null;
  /** Alternativa imediatamente abaixo do alvo, quando não há exata. */
  abaixo: MontagemLado | null;
  /** Alternativa imediatamente acima do alvo, quando não há exata. */
  acima: MontagemLado | null;
  /** O alvo é menor que a barra sozinha. */
  abaixoDaBarra: boolean;
}

/**
 * Monta a barra pelo conjunto de anilhas disponível.
 *
 * A implementação é programação dinâmica sobre os pesos alcançáveis por
 * lado, e NÃO o algoritmo guloso que quase todo mundo usa aqui. Guloso
 * falha de verdade: com anilhas de 25, 20 e 15 e alvo de 30 kg por lado,
 * ele pega a de 25 e trava sem conseguir os 5 restantes — quando 15 + 15
 * monta exatamente. Como o usuário escolhe quais anilhas a academia dele
 * tem, conjuntos incompletos são o caso normal, não a exceção.
 *
 * Trabalhamos em unidades de 0,25 kg para evitar erro de ponto flutuante:
 * somar 1.25 + 2.5 em float e comparar com o alvo é como o cálculo erra
 * silenciosamente. Entre as combinações que dão o mesmo peso, escolhemos a
 * de menos anilhas — menos discos para carregar e travar.
 */
export function calculaMontagem(
  cargaAlvo: number,
  pesoBarra: number,
  anilhasDisponiveis: number[]
): ResultadoMontagem {
  const vazio: ResultadoMontagem = { exata: null, abaixo: null, acima: null, abaixoDaBarra: false };

  if (cargaAlvo < pesoBarra) return { ...vazio, abaixoDaBarra: true };
  if (anilhasDisponiveis.length === 0) return vazio;

  const U = 4; // unidades por kg (0,25 kg)
  const alvoLadoU = Math.round(((cargaAlvo - pesoBarra) / 2) * U);
  if (alvoLadoU < 0) return { ...vazio, abaixoDaBarra: true };

  /** Teto de busca com folga, para achar também a opção acima do alvo. */
  const maiorAnilhaU = Math.round(Math.max(...anilhasDisponiveis) * U);
  const tetoU = alvoLadoU + maiorAnilhaU;

  /** minPlates[s] = menor número de anilhas que soma exatamente s unidades. */
  const INF = Number.POSITIVE_INFINITY;
  const minPlates = new Array<number>(tetoU + 1).fill(INF);
  minPlates[0] = 0;

  const ordenadas = [...anilhasDisponiveis].sort((a, b) => b - a);
  for (const anilha of ordenadas) {
    const passo = Math.round(anilha * U);
    if (passo <= 0) continue;
    /**
     * Knapsack limitado: cada denominação entra no máximo
     * MAX_POR_DENOMINACAO vezes por lado. Percorremos de trás para a frente
     * por cópia para não usar a mesma anilha mais vezes do que o permitido.
     */
    for (let c = 0; c < MAX_POR_DENOMINACAO; c++) {
      for (let s = tetoU; s >= passo; s--) {
        if (minPlates[s - passo] === c && minPlates[s] > c + 1) {
          minPlates[s] = c + 1;
        }
      }
    }
  }

  /** Reconstrói uma combinação concreta para um peso alcançável. */
  function reconstroi(somaU: number): MontagemLado | null {
    if (somaU < 0 || somaU > tetoU || minPlates[somaU] === INF) return null;
    const usadas = new Map<number, number>();
    let restante = somaU;
    let guarda = 0;
    while (restante > 0 && guarda++ < 200) {
      let escolhida: number | null = null;
      for (const anilha of ordenadas) {
        const passo = Math.round(anilha * U);
        if (passo > restante) continue;
        const usoAtual = usadas.get(anilha) ?? 0;
        if (usoAtual >= MAX_POR_DENOMINACAO) continue;
        if (minPlates[restante - passo] === minPlates[restante] - 1) {
          escolhida = anilha;
          break;
        }
      }
      if (escolhida === null) return null;
      usadas.set(escolhida, (usadas.get(escolhida) ?? 0) + 1);
      restante -= Math.round(escolhida * U);
    }
    if (restante !== 0) return null;
    const anilhas = [...usadas.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([peso, quantidade]) => ({ peso, quantidade }));
    const pesoLado = somaU / U;
    return { anilhas, pesoLado, total: pesoBarra + pesoLado * 2 };
  }

  const exata = reconstroi(alvoLadoU);
  if (exata) return { exata, abaixo: null, acima: null, abaixoDaBarra: false };

  let abaixo: MontagemLado | null = null;
  for (let s = alvoLadoU - 1; s >= 0; s--) {
    if (minPlates[s] !== INF) {
      abaixo = reconstroi(s);
      if (abaixo) break;
    }
  }
  let acima: MontagemLado | null = null;
  for (let s = alvoLadoU + 1; s <= tetoU; s++) {
    if (minPlates[s] !== INF) {
      acima = reconstroi(s);
      if (acima) break;
    }
  }
  return { exata: null, abaixo, acima, abaixoDaBarra: false };
}

// ─── Avisos ──────────────────────────────────────────────────────────────────

export const AVISO_MUITAS_REPS =
  "A estimativa tende a ficar menos precisa quando é baseada em séries com muitas repetições.";

export const ORIENTACAO_REPS_DEMAIS =
  "Com mais de 15 repetições a estimativa perde muita qualidade. Para uma referência melhor, use uma série com uma carga que te leve a 10 repetições ou menos.";

export const NOTA_PROXIMIDADE_FALHA =
  "A estimativa funciona melhor quando a série usada representa um esforço relativamente alto, sem muitas repetições sobrando. Não é preciso treinar até a falha absoluta.";

export const NOTA_SEM_TESTE_MAXIMO =
  "Você não precisa testar uma repetição máxima real para ter uma referência de carga. Use uma série que já fez no treino normal.";

export const NOTA_NAO_TENTE =
  "Isso não significa que você precisa tentar essa carga na próxima série. Use o valor como referência para comparar cargas e acompanhar sua evolução.";

export const NOTA_EXERCICIOS =
  "A estimativa faz mais sentido em exercícios com carga e repetição bem definidas — supino, agachamento, terra, desenvolvimento, remadas e máquinas. Em isoladores e movimentos difíceis de padronizar, interprete com mais cautela.";

export const DISCLAIMER =
  "O resultado é uma estimativa para organizar o treino, não uma recomendação para tentar uma carga máxima. Técnica, experiência, fadiga e o contexto do exercício mudam bastante o que é seguro e possível.";

// ─── Exercícios (só contexto, não entram na conta) ───────────────────────────

export const EXERCICIOS = [
  "Supino reto",
  "Agachamento",
  "Levantamento terra",
  "Desenvolvimento",
  "Remada",
  "Outro",
] as const;

// ─── Onde a calculadora aparece ──────────────────────────────────────────────

/**
 * Artigos que exibem a calculadora cedo no corpo.
 *
 * Mesmo critério das outras duas: entra onde o leitor chegou com a pergunta
 * que a ferramenta responde — "quanto peso eu uso?" — e não onde a palavra
 * "carga" aparece.
 */
export const ARTIGOS_COM_CALCULADORA_1RM: string[] = [
  "carga-ideal-como-escolher",
  "progressao-de-carga",
  "como-aumentar-a-forca-muscular",
  "escala-rpe-musculacao",
  "treino-de-potencia-e-explosividade",
  "quantas-repeticoes-para-hipertrofia",
];

/**
 * Artigos de técnica dos grandes exercícios: aqui a dúvida do leitor é como
 * executar, não quanto carregar — a ferramenta inteira no meio do texto
 * atrapalharia. Recebem só um link contextual, que é o suficiente para quem
 * termina de ler e quer saber a própria carga.
 */
export const ARTIGOS_COM_LINK_1RM: string[] = [
  "como-fazer-supino-reto",
  "como-fazer-agachamento-livre-corretamente",
  "como-fazer-levantamento-terra-corretamente",
  "como-fazer-desenvolvimento-ombros",
  "como-fazer-remada-curvada-tecnica",
];
