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

export const ORIENTACAO_ESPECIAL =
  "Nessas situações, um cardápio gerado automaticamente não é a ferramenta certa — as necessidades mudam de um jeito que só uma avaliação individual alcança. O caminho aqui é um nutricionista ou médico. O restante do site continua todo disponível para você.";

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
      const escolhido = habitual ?? (papel === 0 ? [...doGrupo].sort((x, y) => y.prot100 - x.prot100)[0] : doGrupo[0]);
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

  return {
    refeicoes,
    metaKcal: pedido.metaKcal,
    metaProt,
    metaCarb: macros.impossivel ? 0 : macros.carboidrato.gramas,
    metaGord: macros.impossivel ? 0 : macros.gordura.gramas,
  };
}

/** O dia fechou dentro da tolerância? */
export function diaDentroDaTolerancia(c: CardapioDia): { kcalOk: boolean; protOk: boolean } {
  const t = totalDia(c);
  return {
    kcalOk: Math.abs(t.kcal - c.metaKcal) <= c.metaKcal * TOLERANCIA_KCAL,
    protOk: t.prot >= c.metaProt * PISO_PROTEINA,
  };
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
  const kcalAlvo = nutrientes(atual, item.porcoes).kcal;

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
      const kcal = nutrientes(alimento, porcoes).kcal;
      return kcal >= kcalAlvo * 0.65 && kcal <= kcalAlvo * 1.35;
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
export function geraSemana(base: CardapioDia, pedido: PedidoCardapio, variedade: Variedade): CardapioDia[] {
  const versoes = variedade === "repetir" ? 1 : variedade === "um-pouco" ? 2 : 3;
  const variantes: CardapioDia[] = [base];

  for (let v = 1; v < versoes; v++) {
    const anterior = variantes[v - 1];
    const nova: CardapioDia = {
      ...anterior,
      refeicoes: anterior.refeicoes.map((r) => {
        if (r.momento !== "almoco" && r.momento !== "jantar") return { ...r, itens: r.itens.map((i) => ({ ...i })) };
        const itens = r.itens.map((item) => {
          const a = ALIMENTO_CARDAPIO_POR_ID.get(item.alimentoId)!;
          if (a.grupo !== "proteina-animal" && a.grupo !== "proteina-vegetal" && a.grupo !== "carbo-base") {
            return { ...item };
          }
          const alt = alternativas(item, r.momento, pedido, r.itens.map((i) => i.alimentoId))[0];
          return alt ? { alimentoId: alt.alimento.id, porcoes: alt.porcoes } : { ...item };
        });
        return { ...r, itens };
      }),
    };
    variantes.push(nova);
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
