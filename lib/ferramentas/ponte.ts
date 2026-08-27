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
