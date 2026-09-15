/**
 * Onboarding de aluno novo: três check-ins com data marcada.
 *
 * Na base real quase todo aluno que saiu durou exatamente um ciclo. O
 * primeiro mês decide a retenção, e até aqui o CRM fechava o lead como
 * ganho e sumia — a primeira tarefa seguinte era a renovação, trinta dias
 * depois. D+3 pega a dúvida da primeira semana, D+10 o hábito, D+21 a
 * decisão de renovar antes de ela ser cobrada.
 *
 * Puro: recebe a data de início, devolve as tarefas. Quem grava é a ação.
 */
import { FUSO } from "./copy";

export const ONBOARDING_DIAS = [3, 10, 21] as const;
export const HORA_CHECK_IN = 10; // 10h de Brasília

export interface TarefaOnboarding { tipo: "onboarding"; titulo: string; due_at: string; priority: "media"; dia: number }

/** Data ISO (UTC) das 10h de Brasília no dia `data` (YYYY-MM-DD) + `dias`. */
export function dataDoCheckIn(inicio: string, dias: number): string {
  const [y, m, d] = inicio.slice(0, 10).split("-").map(Number);
  // Meio-dia UTC do dia certo, depois o deslocamento de Brasília naquele dia.
  const base = new Date(Date.UTC(y, m - 1, d + dias, 12, 0, 0));
  const local = new Date(base.toLocaleString("en-US", { timeZone: FUSO }));
  const offsetMin = (base.getTime() - local.getTime()) / 60_000; // minutos que Brasília está atrás do UTC
  return new Date(Date.UTC(y, m - 1, d + dias, HORA_CHECK_IN, 0, 0) + offsetMin * 60_000).toISOString();
}

export function tarefasDeOnboarding(inicio: string): TarefaOnboarding[] {
  return ONBOARDING_DIAS.map((dia) => ({
    tipo: "onboarding", dia, priority: "media",
    titulo: `Check-in D+${dia}${dia === 3 ? " — primeira semana" : dia === 10 ? " — como está indo" : " — antes da renovação"}`,
    due_at: dataDoCheckIn(inicio, dia),
  }));
}
