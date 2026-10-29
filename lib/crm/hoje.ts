/**
 * A tela Hoje em seções, na ordem em que o Montinho trabalha (pedido de
 * 30/10/2026): primeiro quem respondeu e espera, depois os leads novos, os
 * follow-ups, as renovações e, por último, quem já recebeu cobranças demais
 * e precisa de uma decisão.
 *
 * Antes era uma lista só, com quase tudo em "PRIORIDADE ALTA": quando tudo é
 * urgente, nada é. A prioridade continua mandando, mas DENTRO da seção.
 */

export type SecaoHoje = "responder" | "primeiro_contato" | "follow_up" | "renovacoes" | "decidir";

export const SECOES_HOJE: { id: SecaoHoje; titulo: string; dica: string }[] = [
  { id: "responder", titulo: "Responder agora", dica: "Respondeu e está esperando você." },
  { id: "primeiro_contato", titulo: "Primeiro contato", dica: "Lead novo que ainda não recebeu resposta." },
  { id: "follow_up", titulo: "Follow-ups e próximos passos", dica: "Proposta, experimental e o que você combinou de retomar." },
  { id: "renovacoes", titulo: "Renovações", dica: "Cliente com renovação vencida, perto de vencer ou pacote no fim." },
  { id: "decidir", titulo: "Decidir", dica: "Já recebeu cobranças sem resposta: adiar, parar de cobrar ou encerrar." },
];

/** Em qual seção cai cada grupo do motor de prioridades (lib/crm/metricas.ts). */
export function secaoDoGrupo(grupo: string): SecaoHoje {
  if (grupo === "respondeu_aguardando_voce") return "responder";
  if (grupo === "novo_sem_contato") return "primeiro_contato";
  if (grupo === "decidir") return "decidir";
  if (grupo.startsWith("renovacao")) return "renovacoes";
  return "follow_up";
}

/** As seções na ordem fixa, só as que têm item; dentro de cada uma, a prioridade manda. */
export function agruparPorSecao<T extends { grupo: string; prioridade: number }>(itens: T[]): { secao: (typeof SECOES_HOJE)[number]; itens: T[] }[] {
  return SECOES_HOJE.map((secao) => ({
    secao,
    itens: itens
      .map((item, i) => ({ item, i }))
      .filter(({ item }) => secaoDoGrupo(item.grupo) === secao.id)
      .sort((a, z) => a.item.prioridade - z.item.prioridade || a.i - z.i)
      .map(({ item }) => item),
  })).filter((g) => g.itens.length > 0);
}

/** Quantos cards cada seção mostra antes do "ver mais". */
export const POR_SECAO = 12;
