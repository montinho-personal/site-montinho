/**
 * Academia Ideal em Alphaville — modelo de dados.
 *
 * Regra que governa tudo aqui: NENHUM atributo é um valor solto. Todo campo
 * carrega de onde veio e quando foi verificado, porque horário, preço e
 * convênio mudam — e afirmar sem fonte é o jeito mais rápido de destruir a
 * confiança que a ferramenta existe para construir.
 *
 * `valor: null` significa "não confirmado", e isso NUNCA elimina uma academia:
 * eliminar por falta de informação puniria a unidade pelo nosso desconhecimento.
 */

export type Confianca = "oficial" | "plataforma" | "montinho" | "nao_confirmado";

export interface Campo<T> {
  /** null = não confirmado. Nunca preencher com estimativa. */
  valor: T | null;
  /** De onde veio: URL oficial, plataforma, ou "experiência do Montinho". */
  fonte?: string;
  /** AAAA-MM-DD. Sem isso o dado envelhece em silêncio. */
  verificadoEm?: string;
  confianca: Confianca;
}

/** Atalho para campo ainda não preenchido. */
export const naoConfirmado = <T,>(): Campo<T> => ({ valor: null, confianca: "nao_confirmado" });

export const confirmado = <T,>(
  valor: T,
  confianca: Exclude<Confianca, "nao_confirmado">,
  fonte: string,
  verificadoEm: string
): Campo<T> => ({ valor, confianca, fonte, verificadoEm });

/** Regiões reais de Alphaville, extraídas do conteúdo do próprio site. */
export type Regiao =
  | "centro-industrial-empresarial"
  | "centro-comercial"
  | "iguatemi"
  | "tambore"
  | "aldeia-da-serra"
  | "residenciais"
  | "barueri-fora-alphaville";

export const REGIAO_LABEL: Record<Regiao, string> = {
  "centro-industrial-empresarial": "Centro Industrial e Empresarial",
  "centro-comercial": "Centro Comercial",
  iguatemi: "Região do Iguatemi",
  tambore: "Tamboré",
  "aldeia-da-serra": "Aldeia da Serra",
  residenciais: "Residenciais de Alphaville",
  "barueri-fora-alphaville": "Barueri (fora de Alphaville)",
};

export type Estilo =
  | "musculacao_completa"
  | "pesos_livres"
  | "maquinas"
  | "cardio"
  | "aulas_coletivas"
  | "premium"
  | "piscina"
  | "funcional"
  | "reservada"
  | "24h";

export const ESTILO_LABEL: Record<Estilo, string> = {
  musculacao_completa: "Musculação completa",
  pesos_livres: "Muitos pesos livres",
  maquinas: "Variedade de máquinas",
  cardio: "Área de cardio",
  aulas_coletivas: "Aulas coletivas",
  premium: "Ambiente premium",
  piscina: "Piscina",
  funcional: "Funcional",
  reservada: "Ambiente mais reservado",
  "24h": "Funcionamento 24 horas",
};

export type FaixaPreco = "economico" | "custo_beneficio" | "intermediario" | "premium";

export const PRECO_LABEL: Record<FaixaPreco, string> = {
  economico: "Mais econômica",
  custo_beneficio: "Custo-benefício",
  intermediario: "Intermediária",
  premium: "Premium",
};

export type Status = "ativa" | "temporariamente_fechada" | "encerrada";

export interface Academia {
  id: string;
  nome: string;
  /** Artigo do próprio site sobre a unidade — fonte primária e link interno. */
  artigoSlug?: string;
  /** Site oficial, quando conhecido. */
  siteOficial?: string;
  regiao: Regiao;
  /** Rede nacional ou academia local/independente. */
  tipo: "rede" | "local";
  status: Status;

  // ── Atributos verificáveis ────────────────────────────────────────────────
  vinteQuatroHoras: Campo<boolean>;
  abreDomingo: Campo<boolean>;
  abreSabado: Campo<boolean>;
  /** Hora de fechamento em dia útil, formato 24h (ex.: 22 = 22h). */
  fechaDiaUtil: Campo<number>;
  /** Hora de abertura em dia útil. */
  abreDiaUtil: Campo<number>;
  estacionamento: Campo<boolean>;
  wellhub: Campo<boolean>;
  totalpass: Campo<boolean>;
  personalExterno: Campo<boolean>;
  faixaPreco: Campo<FaixaPreco>;
  /** Estilos que a unidade atende. */
  estilos: Campo<Estilo[]>;

  /**
   * Observação editorial do Montinho — separada dos dados de propósito.
   * Fato e opinião não podem se misturar; o resultado mostra os dois com
   * rótulos diferentes.
   */
  visaoMontinho?: string;
}

/** Quantos campos verificáveis uma academia tem preenchidos (0 a 11). */
export function completude(a: Academia): { preenchidos: number; total: number } {
  const campos: Campo<unknown>[] = [
    a.vinteQuatroHoras, a.abreDomingo, a.abreSabado, a.fechaDiaUtil, a.abreDiaUtil,
    a.estacionamento, a.wellhub, a.totalpass, a.personalExterno, a.faixaPreco, a.estilos,
  ];
  return { preenchidos: campos.filter((c) => c.valor !== null).length, total: campos.length };
}
