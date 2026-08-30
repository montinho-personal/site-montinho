/**
 * Ponte entre as ferramentas.
 *
 * Uma pessoa que acabou de calcular o gasto calórico já informou o peso; uma
 * que analisou o volume já escolheu o exercício. Pedir o mesmo dado de novo
 * na ferramenta seguinte é atrito puro — e a alternativa (decorar e
 * redigitar) é pior que qualquer solução técnica.
 *
 * Por que sessionStorage e NÃO parâmetro de URL: uma URL com "?peso=82" é
 * copiada, colada, compartilhada, e cai em log de servidor e cabeçalho de
 * referrer. Peso e meta calórica são dados corporais. O sessionStorage fica
 * só naquela aba, naquele navegador, morre quando a aba fecha e nunca é
 * enviado a lugar nenhum.
 *
 * Duas regras que valem para toda ponte:
 *
 * 1. GRAVAR só por ação explícita. Nenhuma ferramenta guarda nada porque a
 *    pessoa digitou — só porque ela clicou em ir para a próxima.
 * 2. LER apaga. O valor serve para preencher um campo uma vez; deixá-lo na
 *    sessão seria guardar dado sem motivo.
 */

/** Chaves da ponte. Uma constante por travessia, para não haver string solta. */
export const PONTE = {
  /** Déficit calórico → Macros: a meta calórica escolhida. */
  kcal: "montinho:ponte:kcal",
  /** Macros → Proteína: o peso já informado. */
  peso: "montinho:ponte:peso",
  /** Volume de treino → 1RM: o nome do exercício em análise. */
  exercicio: "montinho:ponte:exercicio",
  /**
   * Tabela de alimentos → Comparador: o slug do alimento já escolhido.
   *
   * Diferente das outras pontes, o que atravessa aqui não é dado do corpo de
   * ninguém — é o identificador público de uma página do site. Mesmo assim
   * usa sessionStorage, e não `?alimento=`: o comparador tem canonical
   * próprio, e URL com parâmetro é URL que alguém indexa, compartilha e
   * depois cobra que funcione como página de comparação salva. Isso é outra
   * funcionalidade, com outro custo — não um efeito colateral de preencher
   * um campo.
   */
  alimento: "montinho:ponte:alimento",
  /**
   * TMB/TDEE → Déficit: os cinco dados do formulário, como JSON.
   *
   * A alternativa — passar só o TDEE pronto — seria um número opaco que o
   * déficit não saberia explicar. Passando os DADOS, o déficit refaz a
   * mesma conta determinística, chega no mesmo gasto, e todo o "como
   * calculamos" dele continua verdadeiro.
   */
  dados: "montinho:ponte:dados-corporais",
} as const;

export type ChavePonte = (typeof PONTE)[keyof typeof PONTE];

/** Guarda um valor para a próxima ferramenta. Só chamar em onClick. */
export function guarda(chave: ChavePonte, valor: string | number): void {
  try {
    sessionStorage.setItem(chave, String(valor));
  } catch {
    /* modo privado ou storage bloqueado: a ponte some, as ferramentas seguem. */
  }
}

/** Lê e já apaga — o valor preenche um campo uma vez, e só. */
export function consome(chave: ChavePonte): string | null {
  try {
    const v = sessionStorage.getItem(chave);
    if (v === null) return null;
    sessionStorage.removeItem(chave);
    return v;
  } catch {
    return null;
  }
}

/** Consome um número dentro de limites plausíveis, ou null. */
export function consomeNumero(chave: ChavePonte, min: number, max: number): number | null {
  const v = consome(chave);
  if (v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

/** O pacote da travessia TMB/TDEE → Déficit. */
export interface DadosCorporais {
  peso: number;
  altura: number;
  idade: number;
  sexo: "masculino" | "feminino" | "nao_informado";
  /** Id do nível de atividade (o receptor valida contra a lista dele). */
  nivel: string;
}

/**
 * Consome o pacote de dados corporais, validando campo a campo — a regra de
 * toda ponte: quem recebe não confia, confere. Qualquer campo fora das
 * faixas invalida o pacote inteiro; melhor a pessoa digitar de novo que um
 * formulário meio-preenchido com dado corrompido.
 */
export function consomeDadosCorporais(
  chave: ChavePonte,
  limites: { pesoMin: number; pesoMax: number; alturaMin: number; alturaMax: number; idadeMin: number; idadeMax: number; niveis: string[] }
): DadosCorporais | null {
  const bruto = consome(chave);
  if (bruto === null) return null;
  try {
    const d = JSON.parse(bruto) as Partial<DadosCorporais>;
    const numOk = (v: unknown, min: number, max: number): v is number =>
      typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;
    if (
      numOk(d.peso, limites.pesoMin, limites.pesoMax) &&
      numOk(d.altura, limites.alturaMin, limites.alturaMax) &&
      numOk(d.idade, limites.idadeMin, limites.idadeMax) &&
      (d.sexo === "masculino" || d.sexo === "feminino" || d.sexo === "nao_informado") &&
      typeof d.nivel === "string" &&
      limites.niveis.includes(d.nivel)
    ) {
      return { peso: d.peso, altura: d.altura, idade: d.idade, sexo: d.sexo, nivel: d.nivel };
    }
    return null;
  } catch {
    return null;
  }
}
