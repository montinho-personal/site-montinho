/**
 * Monte seu Cardápio — o motor.
 *
 * Todo o cálculo é determinístico e auditável: banco de alimentos + regras +
 * otimização por porções caseiras. Não há LLM em lugar nenhum da geração —
 * mesmas entradas, mesmo cardápio, sempre. É o que permite testar o motor
 * como se testa uma conta.
 *
 * A cadeia: meta calórica → macros (reusando a cascata de lib/macros, a
 * mesma da Calculadora de Macros — dois motores de macro no site seria o
 * site se contradizendo) → distribuição por refeição → montagem com os
 * alimentos que a pessoa DISSE que come → porções caseiras → validação por
 * tolerância.
 *
 * O princípio que governa as porções: NUNCA sacrificar usabilidade para
 * bater número. O motor trabalha só em múltiplos de porção caseira (1 ovo,
 * meia escumadeira) e aceita errar a meta por uma margem declarada — 2.085
 * kcal numa meta de 2.100 é acerto, não erro. "137 g de banana" é proibido
 * por construção, não por arredondamento posterior.
 */

import {
  ALIMENTOS_CARDAPIO,
  ALIMENTO_CARDAPIO_POR_ID,
  RESTRICOES,
  nutrientes,
  permitido,
  type AlimentoCardapio,
  type Dieta,
  type Momento,
  type Restricao,
} from "./alimentos";
import { calculaMacros } from "@/lib/macros";

// ─── Metas e tolerâncias ─────────────────────────────────────────────────────

export const KCAL_MIN_CARDAPIO = 1200;
export const KCAL_MAX_CARDAPIO = 5000;

/**
 * Tolerância do dia: ±8% da meta calórica, proteína a partir de 85% da meta.
 *
 * Os números vêm do compromisso central: porções caseiras têm passos grandes
 * (meio pão = 25 g = 75 kcal), então exigir ±2% forçaria porções quebradas.
 * ±8% de 2.000 kcal são 160 kcal — menos que a variação diária normal de
 * quem pesa comida em casa.
 */
export const TOLERANCIA_KCAL = 0.08;
export const PISO_PROTEINA = 0.85;

/**
 * Tolerâncias IDEAIS por macro — o alvo que o refinamento persegue. Gordura
 * ganha a folga maior (±15%) porque as fontes têm porções pequenas e passos
 * proporcionais grandes (meia colher de azeite = 4 g de gordura).
 */
export const TOLERANCIA_IDEAL = { kcal: 0.05, prot: 0.1, carb: 0.1, gord: 0.15 } as const;

/**
 * Limites DUROS — abaixo/acima disso o cardápio não pode ser apresentado
 * como resultado normal, por melhor que esteja o resto. Nasceram de um caso
 * real: meta de 70 g de gordura, cardápio com 29 g e calorias "certas". O
 * motor antigo otimizava só kcal + proteína e compensava gordura com
 * carboidrato; estes limites tornam esse resultado invalidável por regra.
 */
export const LIMITE_DURO = { kcal: 0.08, protAbaixo: 0.15, gordAbaixo: 0.2 } as const;

export const MENSAGEM_META_BAIXA =
  "Com os dados informados, prefiro não gerar automaticamente um cardápio nessa faixa de calorias. Vale rever sua meta ou procurar orientação individual.";

/**
 * Situações em que um gerador automático não é a ferramenta certa. Sem
 * diagnóstico, sem anamnese — uma pergunta só, e se algo se aplica, a
 * ferramenta orienta em vez de gerar.
 */
export const SITUACOES_ESPECIAIS = [
  { id: "gestacao", rotulo: "Gestação ou amamentação" },
  { id: "menor", rotulo: "Tenho menos de 18 anos" },
  { id: "clinica", rotulo: "Condição de saúde que exige dieta específica (renal, diabetes, alergia grave...)" },
  { id: "ta", rotulo: "Histórico de transtorno alimentar" },
] as const;

/**
 * A orientação vem ANTES da escolha, e a escolha é da pessoa.
 *
 * A versão anterior simplesmente travava a ferramenta nessas situações. A
 * intenção era certa e o efeito era ruim: quem convive com uma condição
 * crônica há dez anos, ou quem está amamentando, ficava sem NADA — nem a
 * parte educativa — e sem entender o motivo. Isso não protege ninguém;
 * empurra a pessoa para o gerador do concorrente, que não avisa nada.
 *
 * O desenho novo é consentimento informado: dizemos com todas as letras que
 * no caso dela um profissional vale mais que qualquer gerador, explicamos
 * por quê, e aí perguntamos se ela quer ver a simulação mesmo assim. Quem
 * segue, segue sabendo — e o lembrete continua no resultado, inclusive na
 * versão impressa, para não virar um papel que parece prescrição.
 */
export const ORIENTACAO_ESPECIAL =
  "No seu caso, o acompanhamento de um profissional vale mais do que qualquer cardápio automático — e isso não é formalidade. Gestação, amamentação, adolescência, condições clínicas e histórico de transtorno alimentar mudam as necessidades de um jeito que só uma avaliação individual enxerga: um nutricionista ou médico vai ajustar o que nenhuma ferramenta consegue adivinhar.";

export const CONVITE_SIMULACAO =
  "Dito isso, a decisão é sua. Se quiser, pode seguir e ver a simulação como material educativo — para entender como um cardápio se organiza, não para substituir orientação.";

export const ORIENTACAO_POR_SITUACAO: Record<string, string> = {
  gestacao:
    "Na gestação e na amamentação a necessidade de energia e de vários nutrientes muda ao longo dos meses, e um cálculo genérico não acompanha isso.",
  menor:
    "Antes dos 18 anos o corpo ainda está crescendo, e restringir calorias nessa fase tem consequências que um gerador não consegue prever.",
  clinica:
    "Condições como doença renal, diabetes e alergia grave mudam quais alimentos e quantidades fazem sentido — algumas trocas comuns aqui seriam inadequadas no seu caso.",
  ta:
    "Com histórico de transtorno alimentar, contar calorias e seguir cardápio podem reativar padrões difíceis. Se em algum momento a ferramenta te deixar ansioso ou ansiosa, feche — é a resposta certa, não uma falha sua.",
};

/** Fica visível no resultado de quem seguiu mesmo assim, impressão inclusa. */
export const LEMBRETE_SITUACAO_ESPECIAL =
  "Você marcou uma situação que pede acompanhamento individual. Este cardápio é material educativo — leve-o a um nutricionista ou médico antes de adotá-lo como rotina.";

// ─── Objetivos ───────────────────────────────────────────────────────────────

export type Objetivo = "emagrecer" | "manter" | "ganhar" | "organizar";

export const OBJETIVOS: { id: Objetivo; rotulo: string }[] = [
  { id: "emagrecer", rotulo: "Emagrecer" },
  { id: "manter", rotulo: "Manter meu peso" },
  { id: "ganhar", rotulo: "Ganhar massa muscular" },
  { id: "organizar", rotulo: "Melhorar minha alimentação" },
];

// ─── Refeições ───────────────────────────────────────────────────────────────

export interface PerfilRefeicao {
  momento: Momento;
  nome: string;
  /** Fração da meta calórica do dia. */
  fracao: number;
}

/**
 * Distribuição por número de refeições. As frações não são iguais de
 * propósito: almoço e jantar carregam mais no hábito brasileiro, e lanche e
 * ceia são menores. Nenhuma delas é lei — o resumo do dia é o que vale.
 */
export const PERFIS_REFEICAO: Record<number, PerfilRefeicao[]> = {
  3: [
    { momento: "cafe", nome: "Café da manhã", fracao: 0.28 },
    { momento: "almoco", nome: "Almoço", fracao: 0.4 },
    { momento: "jantar", nome: "Jantar", fracao: 0.32 },
  ],
  4: [
    { momento: "cafe", nome: "Café da manhã", fracao: 0.25 },
    { momento: "almoco", nome: "Almoço", fracao: 0.35 },
    { momento: "lanche", nome: "Lanche da tarde", fracao: 0.15 },
    { momento: "jantar", nome: "Jantar", fracao: 0.25 },
  ],
  5: [
    { momento: "cafe", nome: "Café da manhã", fracao: 0.22 },
    { momento: "almoco", nome: "Almoço", fracao: 0.3 },
    { momento: "lanche", nome: "Lanche da tarde", fracao: 0.13 },
    { momento: "jantar", nome: "Jantar", fracao: 0.25 },
    { momento: "ceia", nome: "Ceia", fracao: 0.1 },
  ],
};

/** "Não sei" → 4 refeições: o arranjo mais comum, dito como sugestão. */
export const REFEICOES_SUGERIDAS = 4;

// ─── Entrada do usuário ──────────────────────────────────────────────────────

export interface PedidoCardapio {
  metaKcal: number;
  pesoKg: number;
  objetivo: Objetivo;
  refeicoes: number;
  dieta: Dieta;
  restricoes: Restricao[];
  /** O que a pessoa disse que come, por momento. O motor prioriza isso. */
  habituais: Partial<Record<Momento, string[]>>;
}

// ─── Resultado ───────────────────────────────────────────────────────────────

export interface ItemCardapio {
  alimentoId: string;
  porcoes: number;
}

export interface RefeicaoMontada {
  momento: Momento;
  nome: string;
  alvoKcal: number;
  itens: ItemCardapio[];
}

export interface CardapioDia {
  refeicoes: RefeicaoMontada[];
  metaKcal: number;
  metaProt: number;
  metaCarb: number;
  metaGord: number;
}

export function totalRefeicao(r: RefeicaoMontada) {
  let kcal = 0, prot = 0, carb = 0, gord = 0;
  for (const it of r.itens) {
    const a = ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId);
    if (!a) continue;
    const n = nutrientes(a, it.porcoes);
    kcal += n.kcal; prot += n.prot; carb += n.carb; gord += n.gord;
  }
  return { kcal, prot, carb, gord };
}

export function totalDia(c: CardapioDia) {
  return c.refeicoes.reduce(
    (acc, r) => {
      const t = totalRefeicao(r);
      return { kcal: acc.kcal + t.kcal, prot: acc.prot + t.prot, carb: acc.carb + t.carb, gord: acc.gord + t.gord };
    },
    { kcal: 0, prot: 0, carb: 0, gord: 0 }
  );
}

// ─── Seleção de alimentos ────────────────────────────────────────────────────

/**
 * Estrutura de cada refeição por papéis. O café precisa de uma fonte de
 * proteína e uma base de carboidrato; o almoço, de proteína + base + (quando
 * onívoro/vegetariano clássico) leguminosa + vegetal. É o que impede o motor
 * de montar "3 bananas e uma tapioca" e chamar de café da manhã.
 */
const PAPEIS: Record<Momento, { grupos: AlimentoCardapio["grupo"][][]; }> = {
  cafe: { grupos: [["proteina-animal", "lacteo", "proteina-vegetal"], ["pao-cereal"], ["fruta"]] },
  almoco: { grupos: [["proteina-animal", "proteina-vegetal"], ["carbo-base"], ["leguminosa"], ["vegetal"]] },
  lanche: { grupos: [["lacteo", "proteina-animal", "gordura"], ["fruta", "pao-cereal"]] },
  jantar: { grupos: [["proteina-animal", "proteina-vegetal"], ["carbo-base", "pao-cereal"], ["vegetal"]] },
  ceia: { grupos: [["lacteo", "fruta"]] },
};

/** Candidatos válidos de um momento, com os habituais na frente. */
function candidatos(momento: Momento, pedido: PedidoCardapio): AlimentoCardapio[] {
  const habituais = new Set(pedido.habituais[momento] ?? []);
  return ALIMENTOS_CARDAPIO
    .filter(
      (a) =>
        a.momentos.includes(momento) &&
        permitido(a, pedido.dieta, pedido.restricoes) &&
        (!a.soHabitual || habituais.has(a.id))
    )
    .sort((a, b) => Number(habituais.has(b.id)) - Number(habituais.has(a.id)));
}

/**
 * Escolhe os alimentos de uma refeição: um por papel, priorizando o que a
 * pessoa disse que come. Se ela escolheu dois do mesmo papel (arroz E
 * macarrão no almoço), fica o primeiro — a variação vai para o plano
 * semanal, não para o mesmo prato.
 */
export function escolheAlimentos(momento: Momento, pedido: PedidoCardapio): AlimentoCardapio[] {
  const pool = candidatos(momento, pedido);
  const habituais = new Set(pedido.habituais[momento] ?? []);
  const escolhidos: AlimentoCardapio[] = [];

  PAPEIS[momento].grupos.forEach((grupos, papel) => {
    /**
     * A ordem DENTRO da lista de grupos importa: no café, "proteina-animal,
     * lacteo, proteina-vegetal" significa que quem não come ovo cai no
     * iogurte antes do tofu — a versão anterior pegava o primeiro alimento
     * do pool em qualquer grupo da lista, e o onívoro sem ovo acordava com
     * tofu mexido.
     *
     * No papel de proteína (o primeiro), sem habitual escolhido, vence o
     * alimento mais denso em proteína do grupo — é o que faz o cardápio
     * vegano usar PTS (17 g/100 g) em vez de tofu (6,6) no almoço, a
     * diferença entre bater e não bater a meta proteica.
     */
    for (const grupo of grupos) {
      const doGrupo = pool.filter((a) => a.grupo === grupo && !escolhidos.includes(a));
      if (doGrupo.length === 0) continue;
      const habitual = doGrupo.find((a) => habituais.has(a.id));
      let escolhido = habitual ?? (papel === 0 ? [...doGrupo].sort((x, y) => y.prot100 - x.prot100)[0] : doGrupo[0]);
      /**
       * Salvaguarda proteica das refeições principais: se o vencedor da
       * ordem de grupos é fraco em proteína (< 15 g/100 g) e outro grupo do
       * mesmo papel tem fonte mais densa, ela vence. É o que dá PTS ao
       * vegetariano no almoço em vez de ovo (13,3 g, teto de 3) — sem isso
       * a meta proteica dele é inalcançável por construção. Habitual
       * continua mandando, e o café mantém a ordem (ovo antes de iogurte).
       */
      if (!habitual && papel === 0 && (momento === "almoco" || momento === "jantar") && escolhido.prot100 < 15) {
        const todos = grupos.flatMap((g) => pool.filter((a) => a.grupo === g && !escolhidos.includes(a)));
        const maisDenso = [...todos].sort((x, y) => y.prot100 - x.prot100)[0];
        if (maisDenso && maisDenso.prot100 > escolhido.prot100) escolhido = maisDenso;
      }
      escolhidos.push(escolhido);
      return;
    }
  });
  return escolhidos;
}

// ─── Montagem das porções ────────────────────────────────────────────────────

/**
 * Ajusta as porções de uma refeição para chegar perto do alvo.
 *
 * Guloso com prioridade: começa todo mundo em 1 porção, e a cada passo
 * incrementa o alimento que mais ajuda o que está faltando — proteína
 * enquanto a proteína da refeição está abaixo da fatia dela, calorias
 * depois. Para quando entrar na tolerância ou quando o próximo passo
 * estourar mais do que o déficit atual.
 *
 * Vegetais ficam fixos em 1 porção: ninguém resolve meta calórica com mais
 * salada, e "3 pratos de alface" é o tipo de resultado que mata a confiança.
 */
export function montaRefeicao(
  alimentos: AlimentoCardapio[],
  alvoKcal: number,
  alvoProt: number
): ItemCardapio[] {
  if (alimentos.length === 0) return [];
  const itens: ItemCardapio[] = alimentos.map((a) => ({ alimentoId: a.id, porcoes: a.grupo === "vegetal" ? 1 : 1 }));

  const soma = () => {
    let kcal = 0, prot = 0;
    for (const it of itens) {
      const n = nutrientes(ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId)!, it.porcoes);
      kcal += n.kcal; prot += n.prot;
    }
    return { kcal, prot };
  };

  for (let passo = 0; passo < 40; passo++) {
    const { kcal, prot } = soma();
    const faltaKcal = alvoKcal - kcal;
    if (faltaKcal <= alvoKcal * 0.06) break;

    const faltaProt = alvoProt - prot;
    /** Candidatos a crescer: fora do teto, nunca vegetal. */
    const cresciveis = itens
      .map((it) => ({ it, a: ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId)! }))
      .filter(({ it, a }) => a.grupo !== "vegetal" && it.porcoes + a.passo <= a.maxPorcoes);
    if (cresciveis.length === 0) break;

    /**
     * Proteína primeiro; depois, kcal — mas SEM continuar empilhando fonte
     * proteica quando a proteína da refeição já bateu. Sem esse desvio, o
     * frango era sempre o maior passo de kcal disponível e o dia fechava
     * com 30% de proteína acima da meta, que é caro e desnecessário.
     */
    const naoProteicos = cresciveis.filter(({ a }) => a.prot100 < 15);
    const poolKcal = faltaProt <= 0 && naoProteicos.length > 0 ? naoProteicos : cresciveis;
    const escolha =
      faltaProt > 5
        ? cresciveis.sort((x, y) => y.a.prot100 / y.a.kcal100 - x.a.prot100 / x.a.kcal100)[0]
        : poolKcal
            .filter(({ a }) => nutrientes(a, a.passo).kcal <= faltaKcal * 1.5)
            .sort((x, y) => nutrientes(y.a, y.a.passo).kcal - nutrientes(x.a, x.a.passo).kcal)[0];
    if (!escolha) break;
    escolha.it.porcoes = Math.round((escolha.it.porcoes + escolha.a.passo) * 2) / 2;
  }
  return itens;
}

// ─── Classificação nutricional ───────────────────────────────────────────────

export type PerfilNutricional = "proteico" | "carbo" | "gorduroso" | "misto" | "vegetal";

/**
 * O que este alimento É, nutricionalmente — derivado das densidades, não de
 * uma lista mantida à mão. É o mapa que o refinamento usa para saber QUAL
 * porção mexer quando um macro está fora: gordura baixa se corrige com
 * alimento gorduroso, nunca com mais arroz.
 */
export function perfilNutricional(a: AlimentoCardapio): PerfilNutricional {
  if (a.grupo === "vegetal") return "vegetal";
  const kcalProt = a.prot100 * 4;
  const kcalCarb = a.carb100 * 4;
  const kcalGord = a.gord100 * 9;
  const total = Math.max(kcalProt + kcalCarb + kcalGord, 1);
  const fp = kcalProt / total, fc = kcalCarb / total, fg = kcalGord / total;
  /**
   * O corte de gordura é mais alto (65%) de propósito: no ovo, 60% da
   * energia vem da gordura, mas tratá-lo como "fonte de gordura" faria o
   * ajuste usar ovo onde deveria usar azeite. Ovo é misto.
   */
  if (fg >= 0.65) return "gorduroso";
  if (fp >= 0.55) return "proteico";
  if (fc >= 0.55) return "carbo";
  return "misto";
}

// ─── Score e refinamento do dia ──────────────────────────────────────────────

interface Metas { kcal: number; prot: number; carb: number; gord: number }

function metasDe(c: CardapioDia): Metas {
  return { kcal: c.metaKcal, prot: c.metaProt, carb: c.metaCarb, gord: c.metaGord };
}

/** Erro relativo de cada macro; meta 0 (cascata impossível) não pontua. */
export function errosRelativos(t: Metas, m: Metas) {
  const rel = (v: number, meta: number) => (meta > 0 ? Math.abs(v - meta) / meta : 0);
  return { kcal: rel(t.kcal, m.kcal), prot: rel(t.prot, m.prot), carb: rel(t.carb, m.carb), gord: rel(t.gord, m.gord) };
}

/**
 * Score global: menor é melhor. Pesos 4/3/3/2 — calorias mandam, proteína e
 * gordura empatam logo atrás, carboidrato é a variável de ajuste e por isso
 * pesa menos. Violações dos limites duros recebem penalidade dominante:
 * nenhuma combinação de acertos pequenos compensa gordura a -59% da meta.
 */
export function scoreTotais(t: Metas, m: Metas): number {
  const e = errosRelativos(t, m);
  let s = 4 * e.kcal + 3 * e.prot + 3 * e.gord + 2 * e.carb;
  if (e.kcal > LIMITE_DURO.kcal) s += 5 + 40 * (e.kcal - LIMITE_DURO.kcal);
  if (m.prot > 0 && t.prot < m.prot * (1 - LIMITE_DURO.protAbaixo)) {
    s += 5 + 40 * ((m.prot * (1 - LIMITE_DURO.protAbaixo) - t.prot) / m.prot);
  }
  if (m.gord > 0 && t.gord < m.gord * (1 - LIMITE_DURO.gordAbaixo)) {
    s += 5 + 40 * ((m.gord * (1 - LIMITE_DURO.gordAbaixo) - t.gord) / m.gord);
  }
  return s;
}

/**
 * Score do dia = score dos totais + forma das refeições. A penalidade de
 * forma impede o refinamento de "resolver" o dia concentrando tudo numa
 * refeição só: cada refeição deve ficar entre 60% e 150% da fatia calórica
 * dela. É penalidade branda de propósito — os alimentos escolhidos mandam
 * mais que a fração teórica.
 */
function scoreDia(c: CardapioDia): number {
  let s = scoreTotais(totalDia(c), metasDe(c));
  for (const r of c.refeicoes) {
    if (r.alvoKcal <= 0) continue;
    const razao = totalRefeicao(r).kcal / r.alvoKcal;
    if (razao < 0.6) s += (0.6 - razao) * 2;
    if (razao > 1.5) s += (razao - 1.5) * 2;
  }
  return s;
}

/**
 * Refinamento iterativo do dia inteiro — a correção central deste motor.
 *
 * A montagem gulosa por refeição olha só kcal + proteína; aqui o dia é
 * tratado como um problema único de 4 metas. Hill-climbing determinístico:
 * a cada iteração, avalia TODOS os movimentos legais (±1 passo de porção em
 * qualquer item não-vegetal) e aplica o que mais reduz o score. Para quando
 * nenhum movimento melhora ou no teto de iterações.
 *
 * Movimentos continuam presos às porções caseiras (passo e maxPorcoes do
 * banco): o refinamento nunca produz "137 g de arroz". Itens marcados como
 * extras (fontes de gordura injetadas) podem descer até 0 — se a gordura já
 * fecha sem eles, eles somem do prato; os demais nunca descem abaixo de um
 * passo, porque foram escolhidos por papel ou por hábito.
 */
export function refinaDia(c: CardapioDia, extras: Set<string>, maxIteracoes = 250): void {
  let atual = scoreDia(c);
  for (let i = 0; i < maxIteracoes; i++) {
    let melhor: { item: ItemCardapio; porcoes: number; score: number } | null = null;
    for (const r of c.refeicoes) {
      for (const item of r.itens) {
        const a = ALIMENTO_CARDAPIO_POR_ID.get(item.alimentoId);
        if (!a || a.grupo === "vegetal") continue;
        const minimo = extras.has(item.alimentoId) ? 0 : a.passo;
        for (const delta of [a.passo, -a.passo]) {
          const nova = Math.round((item.porcoes + delta) * 2) / 2;
          if (nova < minimo || nova > a.maxPorcoes) continue;
          const antes = item.porcoes;
          item.porcoes = nova;
          const s = scoreDia(c);
          item.porcoes = antes;
          if (s < atual - 1e-9 && (!melhor || s < melhor.score)) melhor = { item, porcoes: nova, score: s };
        }
      }
    }
    if (!melhor) break;
    melhor.item.porcoes = melhor.porcoes;
    atual = melhor.score;
  }
}

/** O dia inteiro. */
export function geraCardapio(pedido: PedidoCardapio): CardapioDia {
  const macros = calculaMacros(pedido.metaKcal, pedido.pesoKg, pedido.objetivo === "ganhar" ? 2.0 : 1.6, 30);
  /**
   * Se proteína + gordura não couberem na meta (pessoa pesada com meta
   * baixa), a cascata marca impossível; o cardápio cai para a proteína
   * mínima do contexto em vez de travar — o resumo do dia mostra o real.
   */
  const metaProt = macros.impossivel ? (pedido.metaKcal * 0.3) / 4 : macros.proteina.gramas;

  const perfil = PERFIS_REFEICAO[pedido.refeicoes] ?? PERFIS_REFEICAO[REFEICOES_SUGERIDAS];
  const refeicoes: RefeicaoMontada[] = perfil.map((p) => {
    const alimentos = escolheAlimentos(p.momento, pedido);
    const alvoKcal = pedido.metaKcal * p.fracao;
    return {
      momento: p.momento,
      nome: p.nome,
      alvoKcal,
      itens: montaRefeicao(alimentos, alvoKcal, metaProt * p.fracao),
    };
  });

  const cardapio: CardapioDia = {
    refeicoes,
    metaKcal: pedido.metaKcal,
    metaProt,
    metaCarb: macros.impossivel ? 0 : macros.carboidrato.gramas,
    metaGord: macros.impossivel ? 0 : macros.gordura.gramas,
  };

  /**
   * Injeta uma fonte de gordura opcional (porção 0) nas refeições que não
   * têm nenhuma. Sem isso a meta de gordura é estruturalmente inalcançável:
   * os papéis clássicos (proteína + base + leguminosa + vegetal) somam pouca
   * gordura, e o refinamento só ajusta o que está no prato. A regra de
   * seleção é a mesma de sempre — habitual primeiro, depois o banco — e o
   * item só permanece se o refinamento precisar dele.
   */
  const extras = new Set<string>();
  for (const r of cardapio.refeicoes) {
    const temGordura = r.itens.some((it) => {
      const a = ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId);
      return a && perfilNutricional(a) === "gorduroso";
    });
    if (temGordura) continue;
    const fonte = candidatos(r.momento, pedido).find(
      (a) => a.grupo === "gordura" && !r.itens.some((it) => it.alimentoId === a.id)
    );
    if (fonte) {
      r.itens.push({ alimentoId: fonte.id, porcoes: 0 });
      extras.add(fonte.id);
    }
  }

  refinaDia(cardapio, extras);

  /** Extras que o refinamento não usou saem do prato. */
  for (const r of cardapio.refeicoes) {
    r.itens = r.itens.filter((it) => it.porcoes > 0);
  }

  if (process.env.NODE_ENV === "development") {
    const t = totalDia(cardapio);
    const e = errosRelativos(t, metasDe(cardapio));
    // eslint-disable-next-line no-console
    console.debug("[cardapio]", {
      meta: { kcal: cardapio.metaKcal, prot: cardapio.metaProt, carb: cardapio.metaCarb, gord: cardapio.metaGord },
      total: { kcal: Math.round(t.kcal), prot: Math.round(t.prot), carb: Math.round(t.carb), gord: Math.round(t.gord) },
      erroPct: Object.fromEntries(Object.entries(e).map(([k, v]) => [k, Math.round(v * 100)])),
      validacao: validaCardapio(cardapio),
    });
  }

  return cardapio;
}

// ─── Validação final ─────────────────────────────────────────────────────────

export type NivelCardapio = "excelente" | "bom" | "ajustavel" | "incompativel";

export interface ValidacaoCardapio {
  kcalOk: boolean;
  protOk: boolean;
  carbOk: boolean;
  gordOk: boolean;
  score: number;
  nivel: NivelCardapio;
}

/**
 * Validação obrigatória antes de apresentar o cardápio — pura, sobre totais,
 * para ser testável com qualquer número. Os níveis existem internamente:
 * "excelente" = tudo na tolerância ideal; "incompativel" = algum limite duro
 * estourado (é o caso que a interface trata em vez de fingir sucesso).
 */
export function validaTotais(t: Metas, m: Metas): ValidacaoCardapio {
  const e = errosRelativos(t, m);
  const kcalOk = e.kcal <= LIMITE_DURO.kcal;
  const protOk = m.prot <= 0 || t.prot >= m.prot * (1 - LIMITE_DURO.protAbaixo);
  const gordOk = m.gord <= 0 || t.gord >= m.gord * (1 - LIMITE_DURO.gordAbaixo);
  const carbOk = m.carb <= 0 || e.carb <= 0.25;
  const ideais =
    e.kcal <= TOLERANCIA_IDEAL.kcal &&
    e.prot <= TOLERANCIA_IDEAL.prot &&
    e.carb <= TOLERANCIA_IDEAL.carb &&
    e.gord <= TOLERANCIA_IDEAL.gord;
  const nivel: NivelCardapio = !kcalOk || !protOk || !gordOk
    ? "incompativel"
    : ideais
      ? "excelente"
      : e.kcal <= TOLERANCIA_IDEAL.kcal * 1.5 && e.prot <= 0.15 && e.gord <= 0.2 && e.carb <= 0.2
        ? "bom"
        : "ajustavel";
  return { kcalOk, protOk, carbOk, gordOk, score: scoreTotais(t, m), nivel };
}

export function validaCardapio(c: CardapioDia): ValidacaoCardapio {
  return validaTotais(totalDia(c), metasDe(c));
}

/** O dia fechou dentro da tolerância? */
export function diaDentroDaTolerancia(c: CardapioDia): { kcalOk: boolean; protOk: boolean; carbOk: boolean; gordOk: boolean } {
  const t = totalDia(c);
  const v = validaCardapio(c);
  return {
    kcalOk: Math.abs(t.kcal - c.metaKcal) <= c.metaKcal * TOLERANCIA_KCAL,
    protOk: t.prot >= c.metaProt * PISO_PROTEINA,
    carbOk: v.carbOk,
    gordOk: v.gordOk,
  };
}

/**
 * Quando nem com as fontes injetadas a gordura fecha, a saída honesta é
 * dizer isso e oferecer as fontes cadastradas — nunca entregar 29 g numa
 * meta de 70 g como se estivesse tudo bem.
 */
export const MENSAGEM_FALTA_GORDURA =
  "Com os alimentos deste cardápio, chegamos perto das calorias e da proteína, mas a gordura ficou abaixo do equilíbrio que a sua meta pede. Vale incluir pelo menos uma fonte de gordura nas refeições:";

export function sugestoesGordura(pedido: PedidoCardapio): AlimentoCardapio[] {
  return ALIMENTOS_CARDAPIO.filter(
    (a) => a.grupo === "gordura" && !a.soHabitual && permitido(a, pedido.dieta, pedido.restricoes)
  );
}

// ─── Substituições ───────────────────────────────────────────────────────────

/**
 * Alternativas para um item: mesmo grupo, cabe na dieta/restrições, serve no
 * momento. A porção do substituto é recalculada PELAS CALORIAS do item que
 * sai — trocar 150 g de arroz por 150 g de batata mudaria a refeição em
 * ~110 kcal sem ninguém perceber.
 */
export function alternativas(
  item: ItemCardapio,
  momento: Momento,
  pedido: PedidoCardapio,
  jaNaRefeicao: string[]
): { alimento: AlimentoCardapio; porcoes: number }[] {
  const atual = ALIMENTO_CARDAPIO_POR_ID.get(item.alimentoId);
  if (!atual) return [];
  const saem = nutrientes(atual, item.porcoes);
  const kcalAlvo = saem.kcal;

  return ALIMENTOS_CARDAPIO
    .filter(
      (a) =>
        a.id !== atual.id &&
        !jaNaRefeicao.includes(a.id) &&
        a.grupo === atual.grupo &&
        a.momentos.includes(momento) &&
        permitido(a, pedido.dieta, pedido.restricoes)
    )
    .map((a) => {
      /** Porções que aproximam as kcal do item que sai, presas ao passo. */
      const brutas = kcalAlvo / nutrientes(a, 1).kcal;
      const porcoes = Math.min(a.maxPorcoes, Math.max(a.passo, Math.round(brutas / a.passo) * a.passo));
      return { alimento: a, porcoes };
    })
    .filter(({ alimento, porcoes }) => {
      /** Se nem a melhor porção chega perto (±35%), a troca engana — fora. */
      const entram = nutrientes(alimento, porcoes);
      if (entram.kcal < kcalAlvo * 0.65 || entram.kcal > kcalAlvo * 1.35) return false;
      /**
       * Função nutricional preservada: se o item que sai é fonte proteica
       * relevante (≥10 g na porção), o substituto precisa entregar pelo
       * menos 60% dessa proteína — calorias parecidas com proteína sumindo
       * é troca que sabota o dia sem a pessoa perceber.
       */
      if (saem.prot >= 10 && entram.prot < saem.prot * 0.6) return false;
      return true;
    })
    .slice(0, 4);
}

export const SEM_ALTERNATIVA =
  "Não encontrei uma substituição boa o suficiente para manter esta refeição perto da sua meta. Escolha outro alimento da lista ou ajuste a refeição.";

// ─── Semana ──────────────────────────────────────────────────────────────────

export type Variedade = "repetir" | "um-pouco" | "bastante";

export const DIAS_SEMANA = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"] as const;

/**
 * Semana por rotação determinística de substituições — não por sorteio.
 *
 * "repetir" usa o mesmo dia sete vezes; "um-pouco" alterna duas versões;
 * "bastante" roda três. As versões trocam a proteína e o carboidrato do
 * almoço/jantar pela alternativa seguinte do grupo, então a variação é
 * nutricionalmente equivalente por construção. Repetição não é defeito:
 * cardápio que repete é cardápio que a pessoa consegue cozinhar.
 */
/**
 * A próxima versão do MESMO dia: troca a proteína e o carboidrato do almoço
 * e do jantar pela alternativa seguinte do grupo e reajusta as porções.
 *
 * Existe porque "gerar outra versão" num motor determinístico é uma
 * contradição: as mesmas respostas devolvem sempre o mesmo cardápio, então
 * o botão precisa pedir explicitamente uma variação — não um novo sorteio,
 * que a ferramenta não faz e não deve fazer.
 *
 * Devolve null quando não existe variação possível (banco sem alternativa
 * para aquelas restrições). Null é resposta: melhor dizer "não tem outra"
 * que devolver o mesmo prato fingindo novidade.
 */
export function proximaVersao(base: CardapioDia, pedido: PedidoCardapio): CardapioDia | null {
  const nova: CardapioDia = {
    ...base,
    refeicoes: base.refeicoes.map((r) => ({ ...r, itens: r.itens.map((i) => ({ ...i })) })),
  };
  let mudou = false;

  for (const r of nova.refeicoes) {
    if (r.momento !== "almoco" && r.momento !== "jantar") continue;
    r.itens = r.itens.map((item) => {
      const a = ALIMENTO_CARDAPIO_POR_ID.get(item.alimentoId);
      if (!a || (a.grupo !== "proteina-animal" && a.grupo !== "proteina-vegetal" && a.grupo !== "carbo-base")) {
        return item;
      }
      const alt = alternativas(item, r.momento, pedido, r.itens.map((i) => i.alimentoId))[0];
      if (!alt) return item;
      mudou = true;
      return { alimentoId: alt.alimento.id, porcoes: alt.porcoes };
    });
  }
  if (!mudou) return null;

  /**
   * A troca mexe nos macros do dia, então a versão passa pelo mesmo
   * refinamento do original — variação não pode custar equilíbrio. As
   * fontes de gordura entram como ajustáveis até zero, igual na geração.
   */
  const extras = new Set(
    nova.refeicoes.flatMap((r) =>
      r.itens.filter((i) => ALIMENTO_CARDAPIO_POR_ID.get(i.alimentoId)?.grupo === "gordura").map((i) => i.alimentoId)
    )
  );
  refinaDia(nova, extras);
  for (const r of nova.refeicoes) r.itens = r.itens.filter((i) => i.porcoes > 0);
  return nova;
}

export function geraSemana(base: CardapioDia, pedido: PedidoCardapio, variedade: Variedade): CardapioDia[] {
  const versoes = variedade === "repetir" ? 1 : variedade === "um-pouco" ? 2 : 3;
  const variantes: CardapioDia[] = [base];

  for (let v = 1; v < versoes; v++) {
    variantes.push(proximaVersao(variantes[v - 1], pedido) ?? variantes[v - 1]);
  }

  return DIAS_SEMANA.map((_, i) => variantes[i % versoes]);
}

// ─── Lista de compras ────────────────────────────────────────────────────────

export interface ItemCompra {
  alimentoId: string;
  nome: string;
  categoria: string;
  /** Quantidade da semana, já em número redondo de mercado. */
  quantidade: string;
}

const CATEGORIA_COMPRA: Record<AlimentoCardapio["grupo"], string> = {
  "proteina-animal": "Proteínas",
  "proteina-vegetal": "Proteínas",
  "carbo-base": "Carboidratos",
  leguminosa: "Carboidratos",
  "pao-cereal": "Padaria e cereais",
  fruta: "Frutas",
  lacteo: "Laticínios e afins",
  vegetal: "Verduras e legumes",
  gordura: "Mercearia",
};

/**
 * Soma a semana e arredonda para número de mercado: ovos em unidades,
 * o resto para cima em passos de 100 g. A lista serve para COMPRAR — 1.940 g
 * de frango vira 2 kg, porque ninguém pede 1,94 kg no açougue.
 */
export function listaDeCompras(semana: CardapioDia[]): ItemCompra[] {
  const soma = new Map<string, number>();
  for (const dia of semana) {
    for (const r of dia.refeicoes) {
      for (const it of r.itens) {
        const a = ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId);
        if (!a) continue;
        soma.set(a.id, (soma.get(a.id) ?? 0) + a.porcao.g * it.porcoes);
      }
    }
  }
  return [...soma.entries()]
    .map(([id, gramas]) => {
      const a = ALIMENTO_CARDAPIO_POR_ID.get(id)!;
      const unidade = /^1\s(ovo|banana|maçã|laranja|unidade|pote|copo|dose)/.test(a.porcao.rotulo);
      const quantidade = unidade
        ? `${Math.ceil(gramas / a.porcao.g)} un`
        : gramas >= 1000
          ? `${(Math.ceil(gramas / 100) / 10).toFixed(1).replace(".", ",")} kg`
          : `${Math.ceil(gramas / 100) * 100} g`;
      return { alimentoId: id, nome: a.nome, categoria: CATEGORIA_COMPRA[a.grupo], quantidade };
    })
    .sort((x, y) => x.categoria.localeCompare(y.categoria) || x.nome.localeCompare(y.nome));
}

// ─── Textos ──────────────────────────────────────────────────────────────────

export const AVISO_EDUCACIONAL =
  "Esta é uma sugestão de organização alimentar com finalidade educativa — não é prescrição de dieta. Os valores são estimativas: gasto energético, peso dos alimentos, marcas e preparo variam. Situações clínicas específicas pedem avaliação de nutricionista ou médico.";

/** Rótulo de dieta como a pessoa leu na tela, para a mensagem sair igual. */
const DIETA_LABEL: Record<Dieta, string> = {
  onivoro: "como de tudo",
  vegetariano: "vegetariana",
  vegano: "vegana",
};

/**
 * A mensagem que a pessoa envia ao abrir o WhatsApp no fim do cardápio.
 *
 * O QUE VAI, E POR QUÊ NÃO VAI MAIS QUE ISSO
 *
 * Vai o que faz a conversa começar informada: objetivo, meta calórica,
 * número de refeições, tipo de alimentação e o que ela não come. É
 * exatamente o que o Montinho perguntaria nas primeiras cinco mensagens, e
 * poupar essas cinco mensagens é o ponto.
 *
 * NÃO vai o peso, e não vão as situações de saúde. As situações são o dado
 * clínico que existe na ferramenta só para decidir se ela deve gerar a
 * simulação — colocá-las num texto que a pessoa dispara sem reler seria usar
 * para outra coisa um dado que foi pedido para uma. E o peso não é
 * necessário para a conversa começar: a meta calórica já diz o que precisa
 * ser dito, e ele aparece naturalmente se a conversa avançar.
 *
 * O PEDIDO É DE TREINO
 *
 * O cardápio é material educativo, não prescrição — o aviso da ferramenta diz
 * isso, e a mensagem não pode contradizê-lo. Por isso ela pede acompanhamento
 * de TREINO alinhado ao que a pessoa montou, e não que alguém assuma a dieta
 * dela. Quem precisa de conduta alimentar precisa de nutricionista, e o
 * cardápio já fala isso na tela.
 */
export function buildCardapioWhatsApp(dados: {
  objetivo: Objetivo;
  metaKcal: number;
  refeicoes: number;
  dieta: Dieta;
  restricoes: Restricao[];
}): string {
  const objetivo = OBJETIVOS.find((o) => o.id === dados.objetivo)?.rotulo ?? "";
  const nao = dados.restricoes
    .map((r) => RESTRICOES.find((x) => x.id === r)?.rotulo)
    .filter(Boolean)
    .join(", ");
  const linhaNao = nao ? `Não como: ${nao}\n` : "";
  return (
    `Oi, Montinho! Montei meu cardápio no seu site.\n\n` +
    `Objetivo: ${objetivo}\n` +
    `Meta do dia: ${Math.round(dados.metaKcal)} kcal\n` +
    `Refeições: ${dados.refeicoes} por dia\n` +
    `Alimentação: ${DIETA_LABEL[dados.dieta]}\n` +
    linhaNao +
    `\nA alimentação eu já organizei. Quero entender como fica o treino para acompanhar esse objetivo.`
  );
}

export const NOTA_TOLERANCIA =
  "O total do dia não bate a meta no centavo de propósito: as porções são caseiras (1 ovo, 1 concha), e uma diferença de até 8% é menor que a variação normal de quem pesa comida. Referência é para orientar, não para escravizar.";

export function porQueAssim(pedido: PedidoCardapio): string {
  const habituais = Object.values(pedido.habituais).flat().length;
  const partes = [
    `Você pediu ${pedido.refeicoes} refeições`,
    habituais > 0 ? `e marcou ${habituais} alimento${habituais > 1 ? "s" : ""} que já fazem parte da sua rotina — o cardápio prioriza esses` : "e o cardápio usa alimentos comuns no prato brasileiro",
  ];
  return `${partes.join(" ")}. As calorias vêm da sua meta, a proteína usa a mesma referência das calculadoras do site, e as porções são caseiras de propósito — um cardápio que você consegue montar sem balança de precisão.`;
}

export const SEM_VARIACAO =
  "Com a sua dieta e as suas restrições, o banco não tem outra combinação boa o suficiente para variar sem sair da meta. Use o botão de trocar em cada item para ajustar do seu jeito.";

// ─── Onde a ferramenta aparece ───────────────────────────────────────────────

/**
 * Artigos que exibem o Montinho FitChef no primeiro corte editorial.
 *
 * A ferramenta mais completa do site nascia sem nenhum artigo: existia só em
 * /ferramentas e nas trilhas, ou seja, era invisível para quem chega pelo
 * Google — que é quase todo mundo. Estes seis são os artigos em que a
 * pergunta do leitor É a que a ferramenta responde: "que cardápio eu sigo",
 * "o que eu boto na marmita", "o que eu compro no mercado".
 *
 * Os três de cardápio semanal saíram do registro da Calculadora de Proteína
 * ao entrar aqui — a regra de uma ferramenta por artigo continua valendo, e
 * entre "quanto de proteína" e "que cardápio seguir", num artigo chamado
 * "Cardápio Semanal para..." a segunda pergunta é a do título.
 */
export const ARTIGOS_COM_CALCULADORA_CARDAPIO: string[] = [
  /**
   * Dois artigos que terminam em "e o que eu ponho no prato". O de verão
   * porque definição é execução alimentar; o do pré-treino porque a dúvida
   * de horário só se resolve dentro de um dia inteiro planejado.
   */
  "como-definir-corpo-ate-o-verao",
  "o-que-comer-antes-do-treino",
  "cardapio-semanal-emagrecer-com-musculo",
  "cardapio-semanal-ganho-de-massa-muscular",
  "cardapio-para-hipertrofia",
  "marmita-fitness-como-montar",
  "lista-de-compras-fitness-semanal",
  "quantas-refeicoes-por-dia",
];
