/**
 * Calculadora de Proteína — dados e regras.
 *
 * Tudo que é FATO mora aqui, fora do componente: as faixas com a referência
 * científica de onde saíram, os alimentos com ficha completa de fonte, e o
 * registro de quais artigos exibem a calculadora. O componente só apresenta.
 *
 * As três faixas não são três prescrições. Morton et al. (BJSM 2018; 49
 * estudos, 1.863 participantes — o mesmo trabalho já citado no artigo de
 * proteína do acervo) estimou ~1,6 g/kg/dia como o ponto a partir do qual
 * mais proteína não mostrou benefício adicional claro para massa magra, com
 * intervalo de confiança até ~2,2. A calculadora mostra a faixa inteira e
 * diz isso — nunca que 2,2 rende mais músculo que 1,6.
 */

export const REFERENCIA_CIENTIFICA = {
  rotulo: "Morton et al., British Journal of Sports Medicine (2018)",
  url: "https://pubmed.ncbi.nlm.nih.gov/28698222/",
};

export interface FaixaProteina {
  id: "eficaz" | "pratica" | "superior";
  gPorKg: number;
  titulo: string;
  descricao: string;
  /** A "meta prática" ganha leve destaque visual — sem afirmar superioridade. */
  destaque?: boolean;
}

export const FAIXAS: FaixaProteina[] = [
  {
    id: "eficaz",
    gPorKg: 1.6,
    titulo: "Referência eficaz",
    descricao:
      "Uma referência sólida para quem pratica musculação e quer garantir uma ingestão adequada de proteína.",
  },
  {
    id: "pratica",
    gPorKg: 2.0,
    titulo: "Meta prática",
    descricao:
      "Um valor intermediário, fácil de usar como referência no dia a dia dentro da faixa.",
    destaque: true,
  },
  {
    id: "superior",
    gPorKg: 2.2,
    titulo: "Faixa superior",
    descricao:
      "A parte de cima da faixa comumente usada como referência por quem treina musculação.",
  },
];

/** Limites técnicos do campo de peso. Fora deles, pedimos para conferir. */
export const PESO_MIN = 30;
export const PESO_MAX = 300;

/**
 * Normaliza a digitação brasileira: aceita "70", "70,5" e "70.5".
 * Retorna null quando não dá para interpretar como peso.
 */
export function parsePeso(texto: string): number | null {
  const limpo = texto.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(limpo)) return null;
  const n = Number(limpo);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/** Gramas de proteína por dia, inteiro — decimais aqui seriam falsa precisão. */
export function gramasPorDia(pesoKg: number, gPorKg: number): number {
  return Math.round(pesoKg * gPorKg);
}

/** Divisão por refeição, arredondada — o total diário é a referência, não a fatia. */
export function gramasPorRefeicao(totalDia: number, refeicoes: number): number {
  return Math.round(totalDia / refeicoes);
}

// ─── Alimentos ───────────────────────────────────────────────────────────────

export interface AlimentoProteina {
  nome: string;
  /** Descrição exata na fonte — cru/cozido/grelhado preservado de propósito. */
  descricaoFonte: string;
  /** Porção mostrada ao leitor. */
  porcao: string;
  /** Gramas de proteína na porção. */
  proteinaG: number;
  /**
   * Calorias na mesma porção. A calculadora não exibe — o registro existe
   * para que a tabela do artigo tenha contra o que ser conferida, já que era
   * ali que os erros estavam.
   */
  caloriasKcal: number;
  fonte: "TACO";
  versaoFonte: string;
  dataConsulta: string;
  /** Data em que o valor foi conferido contra a fonte, não só transcrito. */
  verificadoEm: string;
}

/**
 * Oito alimentos, todos com ficha completa — melhor do que trinta duvidosos.
 *
 * Fonte: TACO 4ª edição (NEPA/Unicamp), a base brasileira pública. Cada
 * valor preserva o estado do alimento na fonte (grelhado ≠ cozido ≠ cru),
 * porque é aí que a maioria dos erros de tabela nasce.
 *
 * Todos os oito foram conferidos contra a TACO em 2026-08-27 — proteína e
 * calorias — e não apenas transcritos de memória, que era a ressalva da
 * versão anterior deste arquivo. O campo verificadoEm registra isso. A
 * conferência também revelou erros de caloria na tabela do artigo (feijão
 * marcava 132 kcal contra 76 reais), corrigidos junto.
 *
 * Whey e industrializados ficam de fora da lista de propósito: a composição
 * varia por fabricante, e valor universal seria invenção. O componente
 * mostra a nota de rótulo em vez de um número.
 */
export const ALIMENTOS: AlimentoProteina[] = [
  {
    nome: "Peito de frango grelhado",
    descricaoFonte: "Frango, peito, sem pele, grelhado",
    porcao: "100 g",
    proteinaG: 32,
    caloriasKcal: 159,
    fonte: "TACO",
    versaoFonte: "4ª edição (NEPA/Unicamp)",
    dataConsulta: "2026-08-27",
    verificadoEm: "2026-08-27",
  },
  {
    nome: "Carne bovina magra (patinho) grelhada",
    descricaoFonte: "Carne, bovina, patinho, sem gordura, grelhado",
    porcao: "100 g",
    proteinaG: 36,
    caloriasKcal: 219,
    fonte: "TACO",
    versaoFonte: "4ª edição (NEPA/Unicamp)",
    dataConsulta: "2026-08-27",
    verificadoEm: "2026-08-27",
  },
  {
    nome: "Ovo cozido",
    descricaoFonte: "Ovo, de galinha, inteiro, cozido",
    porcao: "1 unidade (~50 g)",
    proteinaG: 7,
    caloriasKcal: 73,
    fonte: "TACO",
    versaoFonte: "4ª edição (NEPA/Unicamp)",
    dataConsulta: "2026-08-27",
    verificadoEm: "2026-08-27",
  },
  {
    nome: "Queijo minas frescal",
    descricaoFonte: "Queijo, minas, frescal",
    porcao: "100 g",
    proteinaG: 17,
    caloriasKcal: 264,
    fonte: "TACO",
    versaoFonte: "4ª edição (NEPA/Unicamp)",
    dataConsulta: "2026-08-27",
    verificadoEm: "2026-08-27",
  },
  {
    nome: "Iogurte natural",
    descricaoFonte: "Iogurte, natural",
    porcao: "100 g",
    proteinaG: 4,
    caloriasKcal: 51,
    fonte: "TACO",
    versaoFonte: "4ª edição (NEPA/Unicamp)",
    dataConsulta: "2026-08-27",
    verificadoEm: "2026-08-27",
  },
  {
    nome: "Feijão carioca cozido",
    descricaoFonte: "Feijão, carioca, cozido",
    porcao: "100 g (concha pequena)",
    proteinaG: 5,
    caloriasKcal: 76,
    fonte: "TACO",
    versaoFonte: "4ª edição (NEPA/Unicamp)",
    dataConsulta: "2026-08-27",
    verificadoEm: "2026-08-27",
  },
  {
    nome: "Lentilha cozida",
    descricaoFonte: "Lentilha, cozida",
    porcao: "100 g",
    proteinaG: 6,
    caloriasKcal: 93,
    fonte: "TACO",
    versaoFonte: "4ª edição (NEPA/Unicamp)",
    dataConsulta: "2026-08-27",
    verificadoEm: "2026-08-27",
  },
  {
    nome: "Tofu",
    descricaoFonte: "Soja, queijo (tofu)",
    porcao: "100 g",
    proteinaG: 7,
    caloriasKcal: 64,
    fonte: "TACO",
    versaoFonte: "4ª edição (NEPA/Unicamp)",
    dataConsulta: "2026-08-27",
    verificadoEm: "2026-08-27",
  },
];

export const NOTA_INDUSTRIALIZADOS =
  "Whey, iogurtes proteicos e barrinhas variam por marca — confira sempre o rótulo nutricional. Não usamos um valor universal para eles de propósito.";

export const NOTA_FONTES =
  "Valores de composição alimentar baseados na TACO (NEPA/Unicamp, 4ª edição). Podem variar conforme corte, marca e preparo do alimento.";

// ─── Onde a calculadora aparece ──────────────────────────────────────────────

/**
 * Artigos que exibem a calculadora cedo no corpo (antes da segunda seção).
 * Registro central: um lugar para mudar, e o teste garante que todo slug
 * daqui existe de verdade no acervo.
 *
 * O critério de entrada não é "fala de proteína" — é "o leitor chegou com a
 * pergunta que a calculadora responde". Artigo de whey fala de proteína, mas
 * a dúvida lá é sobre o suplemento, não sobre a meta diária.
 *
 * Ficaram de fora, por decisão e não por esquecimento:
 *
 * - Timing (melhor horário, antes de dormir), fonte (vegetal vs animal) e
 *   suplementos (whey, barrinha, shake): a pergunta do leitor ali é "quando",
 *   "qual" ou "vale a pena" — não "quantos gramas".
 * - "Proteína demais faz mal": a dúvida é de segurança. A calculadora mostra
 *   uma faixa de referência, não um teto seguro; responderia outra pergunta.
 * - Os artigos de GLP-1 (Mounjaro, Ozempic, GLP-1 e apetite): o título deles é
 *   literalmente a pergunta da calculadora, e ainda assim não entram. A conta
 *   aqui é peso corporal × g/kg, e o Morton foi feito com pessoas treinadas —
 *   não com pessoas em déficit calórico grande e obesidade, onde a
 *   recomendação usa peso ajustado. Uma pessoa de 130 kg veria "286 g/dia",
 *   número que o próprio artigo não recomenda. É justamente o público em que
 *   um número errado pesa mais, então a explicação em texto serve melhor.
 *
 *   EXCEÇÃO, decidida com o Renato em 05/09/2026: o artigo da retatrutida
 *   entra. O motivo é que ele é o único do grupo que já publica a conta em
 *   peso corporal ("para uma pessoa de 80 kg, entre 128 g e 176 g") e as
 *   mesmas três faixas da ferramenta. Negar a calculadora ali não protege
 *   ninguém do número — o número já está no texto —, só obriga a pessoa a
 *   fazer a conta de cabeça. A ressalva do peso ajustado passa a aparecer
 *   junto da calculadora, em NOTA_POR_ARTIGO, que é onde ela é lida.
 */
/**
 * Ressalva que acompanha a calculadora em artigos onde o contexto muda a
 * leitura do número. Fica ao lado da ferramenta, não no rodapé: aviso que
 * ninguém lê no lugar errado é aviso que não existe.
 */
export const NOTA_POR_ARTIGO: Record<string, string> = {
  "proteina-para-quem-usa-retatrutida":
    "Esta conta usa o seu peso atual. Em obesidade com déficit grande, parte das recomendações parte do peso ajustado, e aí o número abaixo fica acima do necessário — use como referência de teto e ajuste com quem acompanha o seu tratamento.",
};

export const ARTIGOS_COM_CALCULADORA: string[] = [
  /**
   * O artigo diz que proteína alta é o fator mais importante para preservar
   * músculo no déficit — e para toda pessoa isso vira a pergunta "alta
   * quanto?". A calculadora responde ali, sem tirar ninguém da leitura.
   */
  "como-manter-massa-muscular-emagrecendo",
  "quanta-proteina-por-dia-para-ganhar-massa-muscular",
  "quanto-de-proteina-consumir",
  "alimentos-ricos-em-proteina",
  "proteina-em-alimentos-tabela-completa",
  /**
   * Ao parar o GLP-1 a proteína muda de papel: durante o tratamento ela
   * preservava músculo, depois ela também é o macro que mais sacia — e é o
   * músculo preservado que segura o gasto quando a fome volta. O leitor sai
   * do artigo com "quanta proteína, no meu peso?" e a conta é essa.
   */
  "parar-de-tomar-mounjaro",
  /**
   * O artigo da retatrutida termina a primeira seção explicando POR QUE a
   * necessidade de proteína sobe no déficit severo, e a seção seguinte
   * responde "quanto": 1,6 como mínimo, 2,0 a 2,2 como meta. São as três
   * faixas da calculadora, e o artigo até usa o mesmo exemplo de 80 kg
   * (128 g e 176 g) e a mesma referência, Morton et al. (2018). A conta no
   * peso de quem lê é o passo que faltava — e ela cai exatamente entre a
   * pergunta e a resposta.
   */
  "proteina-para-quem-usa-retatrutida",
  /**
   * Os três artigos de "cardápio semanal" moraram aqui até o Montinho
   * FitChef existir. Migraram para ARTIGOS_COM_CALCULADORA_CARDAPIO: num
   * artigo chamado "Cardápio Semanal para...", a pergunta do leitor é que
   * cardápio seguir — não quanto de proteína comer. Uma ferramenta por
   * artigo, e ganha a que responde o título.
   */
];
