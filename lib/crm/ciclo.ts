/**
 * Ciclo de follow-ups de um lead.
 *
 * Follow-up é a mensagem que cobra uma resposta que não veio. Três delas
 * sem resposta é o limite: a quarta não converte, só incomoda — e o CRM
 * antigo pedia a quarta, a quinta, a décima, porque o grupo "parado"
 * reaparecia a cada cinco dias para sempre.
 *
 * O ciclo recomeça quando acontece algo novo na conversa: ela respondeu,
 * proposta enviada, experimental marcada, etapa avançou ou o Montinho adiou
 * de propósito. A contagem só olha o que aconteceu depois disso.
 *
 * Duas mensagens do acervo PROMETEM que é a última ("não vou ficar te
 * cobrando"): segundo_toque, proposta_follow_up_2 e negociacao_parada. Uma
 * vez enviada uma delas no ciclo, mandar outra quebra a promessa — o lead
 * vai para "decidir" mesmo com menos de três tentativas.
 *
 * Puro de propósito (sem banco, sem Base): testável em scripts/.
 */

export const MAX_FOLLOW_UPS = 3;

/** Situações de copy que prometem não cobrar de novo. */
export const SITUACOES_PROMESSA = new Set(["segundo_toque", "proposta_follow_up_2", "negociacao_parada"]);

/** Grupos da tela Hoje cujo WhatsApp é uma cobrança de resposta. */
export const GRUPOS_FOLLOW_UP = new Set(["parado", "proposta_sem_follow_up", "negociacao_antiga", "follow_up_atrasado", "follow_up_hoje", "proxima_acao_vencida"]);

export interface EventoDoCiclo { ocorreuEm: string; tipo: string; metadata?: Record<string, unknown> | null }
export interface Ciclo { inicio: string | null; followUps: number; promessaFeita: boolean; ultimoFollowUpEm: string | null }

/** Uma atividade é follow-up se foi marcada assim ou se saiu de um grupo de cobrança da tela Hoje. */
export function ehFollowUp(e: EventoDoCiclo): boolean {
  const m = e.metadata ?? {};
  if (m.follow_up === true) return true;
  if (e.tipo === "follow_up") return true;
  return e.tipo === "message" && m.direcao !== "entrada" && typeof m.grupo === "string" && GRUPOS_FOLLOW_UP.has(m.grupo);
}

/**
 * @param marcos  datas que reiniciam o ciclo (last_reply_at, proposal_sent_at, experimental criada, última mudança de etapa, adiamento). Nulos são ignorados.
 * @param eventos atividades do lead (qualquer ordem).
 */
export function cicloDeFollowUps(marcos: (string | null | undefined)[], eventos: EventoDoCiclo[]): Ciclo {
  const inicio = marcos.filter((m): m is string => !!m).sort().at(-1) ?? null;
  const noCiclo = eventos.filter((e) => ehFollowUp(e) && (!inicio || e.ocorreuEm > inicio)).sort((a, b) => a.ocorreuEm.localeCompare(b.ocorreuEm));
  const promessaFeita = noCiclo.some((e) => SITUACOES_PROMESSA.has(String(e.metadata?.situacao ?? "")));
  return { inicio, followUps: noCiclo.length, promessaFeita, ultimoFollowUpEm: noCiclo.at(-1)?.ocorreuEm ?? null };
}

/** Continuar cobrando ou parar e decidir (adiar, deixar em paz, perdido)? */
export function esgotouFollowUps(c: Pick<Ciclo, "followUps" | "promessaFeita">, max = MAX_FOLLOW_UPS): boolean {
  return c.followUps >= max || c.promessaFeita;
}

/** Texto do motivo no card "decidir". */
export function motivoDecidir(c: Ciclo): string {
  if (c.promessaFeita) return `Já mandou a mensagem final sem resposta — prometeu não cobrar de novo`;
  return `${c.followUps} tentativas sem resposta${c.inicio ? ` desde ${new Date(c.inicio).toLocaleDateString("pt-BR")}` : ""}`;
}
