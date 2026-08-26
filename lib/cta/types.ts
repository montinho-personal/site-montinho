/**
 * Sistema de CTAs contextuais — tipos.
 *
 * A ideia central: o artigo não escolhe um botão, ele declara um contexto.
 * O sistema decide qual é a próxima ação mais útil para quem acabou de ler
 * aquilo. Classificação é determinística e roda no build (SSG), nunca em
 * runtime e nunca via LLM.
 */

/** Estágio provável do leitor no funil. */
export type CtaStage =
  | "informativo" // quer aprender
  | "problema" // reconhece uma dor, não sabe o caminho
  | "solucao" // procura uma estratégia
  | "servico" // avalia contratar
  | "local"; // intenção comercial local

/** Cluster editorial real do acervo (derivado do inventário, não inventado). */
export type CtaCluster =
  | "exercise"
  | "hypertrophy"
  | "weight_loss"
  | "beginner"
  | "routine"
  | "glp1"
  | "pain"
  | "health"
  | "nutrition"
  | "gym_local"
  | "gym_generic"
  | "local_service"
  | "local_other"
  | "service_online"
  | "results"
  | "general";

/** Para onde a ação leva — usado como dimensão em analytics. */
export type CtaDestination =
  | "ask"
  | "diagnostic"
  | "consultoria"
  | "presencial"
  | "whatsapp"
  | "article"
  | "results"
  | "rotina";

/** Variantes visuais. Todas compartilham o design system; mudam só o peso. */
export type CtaVariant = "light" | "diagnostic" | "service" | "local";

export type CtaPosition = "mid_article" | "end_article";

export interface CtaAction {
  label: string;
  href: string;
  destination: CtaDestination;
  /** true para wa.me — abre em nova aba e recebe rel de segurança. */
  external?: boolean;
}

export interface CtaDefinition {
  id: string;
  variant: CtaVariant;
  /** Linha curta acima do título. Opcional — nem todo CTA precisa. */
  eyebrow?: string;
  /** Pergunta ou afirmação que conecta com o artigo. */
  title: string;
  /** Uma ou duas frases de contexto. */
  body: string;
  primary: CtaAction;
  /** Ação secundária discreta. No máximo uma, para não gerar paralisia. */
  secondary?: CtaAction;
}

export interface CtaPlan {
  cluster: CtaCluster;
  stage: CtaStage;
  /** null quando o artigo é curto demais para comportar um CTA no meio. */
  mid: CtaDefinition | null;
  end: CtaDefinition;
  /** Motivo da decisão — usado no relatório de cobertura e no QA. */
  reason: string;
}

/**
 * Override editorial por slug. Vence sempre a classificação automática.
 * Preencher em lib/cta/overrides.ts.
 */
export interface CtaOverride {
  cluster?: CtaCluster;
  stage?: CtaStage;
  /** ID de um CTA do registry, ou null para suprimir o bloco. */
  mid?: string | null;
  end?: string;
  note?: string;
}
