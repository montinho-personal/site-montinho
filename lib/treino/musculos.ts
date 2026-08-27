/**
 * Taxonomia muscular da Calculadora de Volume.
 *
 * Uma taxonomia só, num arquivo só. O erro clássico de ferramentas assim é
 * "supino = peito" espalhado por vários componentes, cada um com um nome
 * ligeiramente diferente — e aí o total nunca fecha.
 *
 * Os deltoides são separados em anterior, lateral e posterior de propósito:
 * é a distinção que mais muda a leitura de volume na prática. Quem faz muito
 * supino acumula deltoide anterior sem perceber, e quem só faz elevação
 * lateral não treina posterior nenhum. Juntar tudo em "ombro" esconderia
 * exatamente o desequilíbrio que a ferramenta existe para mostrar.
 *
 * Costas fica agrupado numa categoria só na V1. A separação dorsais/parte
 * superior é defensável, mas quase todo exercício de puxada e remada acerta
 * os dois em algum grau, e a divisão traria mais dúvida de classificação do
 * que informação útil.
 */

export type MusculoId =
  | "peitoral"
  | "costas"
  | "trapezio"
  | "deltoide-anterior"
  | "deltoide-lateral"
  | "deltoide-posterior"
  | "biceps"
  | "triceps"
  | "antebraco"
  | "quadriceps"
  | "posteriores"
  | "gluteos"
  | "adutores"
  | "panturrilhas"
  | "core";

export interface Musculo {
  id: MusculoId;
  nome: string;
  /** Agrupamento só para ordenar a exibição — não entra na conta. */
  regiao: "superior-empurrar" | "superior-puxar" | "bracos" | "inferior" | "tronco";
}

export const MUSCULOS: Musculo[] = [
  { id: "peitoral", nome: "Peitoral", regiao: "superior-empurrar" },
  { id: "deltoide-anterior", nome: "Deltoide anterior", regiao: "superior-empurrar" },
  { id: "deltoide-lateral", nome: "Deltoide lateral", regiao: "superior-empurrar" },
  { id: "triceps", nome: "Tríceps", regiao: "bracos" },
  { id: "costas", nome: "Costas", regiao: "superior-puxar" },
  { id: "deltoide-posterior", nome: "Deltoide posterior", regiao: "superior-puxar" },
  { id: "trapezio", nome: "Trapézio", regiao: "superior-puxar" },
  { id: "biceps", nome: "Bíceps", regiao: "bracos" },
  { id: "antebraco", nome: "Antebraço", regiao: "bracos" },
  { id: "quadriceps", nome: "Quadríceps", regiao: "inferior" },
  { id: "posteriores", nome: "Posteriores de coxa", regiao: "inferior" },
  { id: "gluteos", nome: "Glúteos", regiao: "inferior" },
  { id: "adutores", nome: "Adutores", regiao: "inferior" },
  { id: "panturrilhas", nome: "Panturrilhas", regiao: "inferior" },
  { id: "core", nome: "Abdômen / core", regiao: "tronco" },
];

export const MUSCULO_POR_ID = new Map(MUSCULOS.map((m) => [m.id, m]));

export function nomeMusculo(id: MusculoId): string {
  return MUSCULO_POR_ID.get(id)?.nome ?? id;
}

export const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"] as const;
export type Dia = (typeof DIAS)[number];
