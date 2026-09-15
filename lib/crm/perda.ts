/**
 * Regras puras de "perdido" — o que o botão Sumiu e o Kanban têm de respeitar.
 *
 * Marcar perdido fecha a oportunidade, encerra tarefas e agenda reativação.
 * Em 14/09/2026 doze leads foram fechados em 28 minutos: parte deles por
 * toque errado, sem confirmação nem volta. Daí três regras:
 *  1. confirmação explícita (componente ConfirmarPerdido);
 *  2. desfazer em 24h restaurando o estado anterior, sem oportunidade nova;
 *  3. ganho e perdido nunca por arrastar: só pelo formulário com os campos.
 */
export const PRAZO_DESFAZER_MS = 24 * 60 * 60 * 1000;

export const ETAPAS_PROTEGIDAS = new Set(["ganho", "perdido"]);

export function etapaProtegida(code: string | null | undefined): boolean {
  return ETAPAS_PROTEGIDAS.has(code ?? "");
}

/** Dá para desfazer se foi marcado perdido há menos de 24h. */
export function podeDesfazerPerdido(lostAt: string | null | undefined, agora = new Date()): boolean {
  if (!lostAt) return false;
  const dt = agora.getTime() - new Date(lostAt).getTime();
  return dt >= 0 && dt <= PRAZO_DESFAZER_MS;
}

/** O que precisa ser guardado na hora da perda para restaurar depois. */
export interface SnapshotPerda {
  stage_id_anterior: string;
  next_action: string | null;
  next_action_at: string | null;
  reactivation_eligible_at: string | null;
  tarefas_encerradas: string[];
  tarefa_reativacao_id: string | null;
}
