/**
 * As trilhas do ecossistema — o caminho explícito entre as ferramentas.
 *
 * O problema que isto resolve: as ferramentas sempre se conectaram por
 * pontes (dados atravessando) e links contextuais, mas o caminho só existia
 * no código. A pessoa leiga que cai numa ferramenta do meio não sabe que
 * existe um antes e um depois — e é exatamente ela que mais precisa de
 * direção. A trilha dá nome e número ao processo: você está no passo 2 de
 * 4, veio dali, vai para lá.
 *
 * Duas trilhas, porque são duas jornadas diferentes:
 *   DIETA:  quanto gasto → quanto como → como distribuo → o que boto no prato
 *   TREINO: por onde começo → qual divisão → volume certo → carga certa → execução
 *
 * A ordem é a ordem da dependência real dos dados: cada passo produz o
 * número que o seguinte consome. A Calculadora de Proteína fica fora da
 * trilha de propósito — ela é conferência pontual, não etapa; colocá-la na
 * linha faria o caminho parecer mais longo do que é.
 */

export type TrilhaId = "dieta" | "treino";

export interface PassoTrilha {
  href: string;
  /** Nome curto do passo, do jeito que cabe num chip. */
  nome: string;
  /** A pergunta que o passo responde — a linguagem da pessoa, não a nossa. */
  pergunta: string;
}

export const TRILHAS: Record<TrilhaId, { titulo: string; passos: PassoTrilha[] }> = {
  dieta: {
    titulo: "O caminho da dieta",
    passos: [
      { href: "/ferramentas/calculadora-tmb-tdee", nome: "Gasto", pergunta: "Quanto eu gasto por dia?" },
      { href: "/ferramentas/calculadora-deficit-calorico", nome: "Meta", pergunta: "Quanto eu vou comer?" },
      { href: "/ferramentas/calculadora-macros", nome: "Macros", pergunta: "Como distribuir?" },
      { href: "/ferramentas/monte-seu-cardapio", nome: "Cardápio", pergunta: "O que boto no prato?" },
    ],
  },
  treino: {
    titulo: "O caminho do treino",
    passos: [
      { href: "/diagnostico", nome: "Diagnóstico", pergunta: "Por onde eu começo?" },
      { href: "/treino-para-minha-rotina", nome: "Rotina", pergunta: "Qual divisão eu sigo?" },
      { href: "/ferramentas/calculadora-volume-treino", nome: "Volume", pergunta: "Meu treino está bem distribuído?" },
      { href: "/ferramentas/calculadora-1rm", nome: "Carga", pergunta: "Quanto colocar na barra?" },
      { href: "/revisao-de-execucao", nome: "Execução", pergunta: "Estou fazendo certo?" },
    ],
  },
};

/** Em qual trilha e posição uma página está; null para páginas fora delas. */
export function encontraPasso(href: string): { trilha: TrilhaId; indice: number } | null {
  for (const id of Object.keys(TRILHAS) as TrilhaId[]) {
    const i = TRILHAS[id].passos.findIndex((p) => p.href === href);
    if (i !== -1) return { trilha: id, indice: i };
  }
  return null;
}
