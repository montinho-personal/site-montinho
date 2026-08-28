/**
 * O histórico — o único dado do site que sobrevive ao fechar da aba.
 *
 * Todas as outras ferramentas usam sessionStorage e apagam na leitura, porque
 * dado corporal não deve ficar guardado sem motivo. Aqui existe motivo, e ele
 * é o produto inteiro: sem guardar o teste de hoje, não há reteste em quatro
 * semanas, e sem reteste o ciclo TESTAR → EXECUTAR → VOLTAR não fecha.
 *
 * As três regras que mantêm isso honesto:
 *
 *   1. localStorage, nunca servidor. Nenhuma resposta sai do aparelho.
 *   2. Guarda o mínimo: estado por região e a medida do knee-to-wall. As
 *      respostas de triagem NÃO são gravadas — são dado de saúde e servem
 *      apenas para decidir se o teste continua naquela sessão.
 *   3. A pessoa é avisada de que isso mora no aparelho dela e some se ela
 *      limpar o navegador. A limitação vira o argumento honesto do WhatsApp.
 *
 * Teto de seis avaliações: o suficiente para meio ano de ciclos de quatro
 * semanas, e pouco o bastante para o localStorage nunca virar depósito.
 */

import type { Mapa } from "./tipos";

const CHAVE = "montinho:mobilidade:historico";
const MAXIMO = 6;

export interface Avaliacao {
  /** ISO date, só o dia — hora não acrescenta nada e é mais um dado. */
  data: string;
  mapa: Mapa;
  /** As prioridades daquela vez, para a comparação mostrar o que foi trabalhado. */
  prioridades: string[];
}

export const AVISO_HISTORICO =
  "Seu resultado fica salvo só neste aparelho, no seu navegador — nunca no meu servidor. Se você limpar os dados do navegador ou trocar de celular, ele se perde. Por isso vale receber o protocolo no WhatsApp: aí ele fica com você de qualquer jeito.";

export function leHistorico(): Avaliacao[] {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    return Array.isArray(dados) ? (dados as Avaliacao[]) : [];
  } catch {
    /* modo privado, storage cheio ou JSON corrompido: começa do zero. */
    return [];
  }
}

export function salvaAvaliacao(mapa: Mapa, prioridades: string[]): Avaliacao[] {
  const nova: Avaliacao = {
    data: new Date().toISOString().slice(0, 10),
    mapa,
    prioridades,
  };
  const historico = [...leHistorico(), nova].slice(-MAXIMO);
  try {
    localStorage.setItem(CHAVE, JSON.stringify(historico));
  } catch {
    /* sem espaço ou bloqueado: a avaliação vale para esta sessão e acabou. */
  }
  return historico;
}

export function limpaHistorico(): void {
  try {
    localStorage.removeItem(CHAVE);
  } catch {
    /* nada a fazer, e nada a explicar para a pessoa. */
  }
}

/** A avaliação anterior, para o reteste comparar. */
export function anterior(): Avaliacao | null {
  const h = leHistorico();
  return h.length >= 2 ? h[h.length - 2] : null;
}

/** Passaram as semanas do ciclo desde a última avaliação? */
export function estaNaHoraDeRetestar(semanas: number): boolean {
  const h = leHistorico();
  if (h.length === 0) return false;
  const ultima = new Date(h[h.length - 1].data);
  const dias = (Date.now() - ultima.getTime()) / 86_400_000;
  return dias >= semanas * 7;
}
