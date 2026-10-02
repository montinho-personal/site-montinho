/**
 * "O que a balança não conta" — capítulo 2 do Beliscômetro.
 *
 * TMB e gasto diário vêm de lib/calorias (Mifflin-St Jeor + fatores de
 * atividade), a MESMA conta da Calculadora de TMB/TDEE, para o site não ter
 * dois números para a mesma pessoa.
 *
 * 7.700 kcal ≈ 1 kg de gordura é uma aproximação EDUCATIVA (o tecido adiposo
 * não é gordura pura e o corpo não converte excedente com eficiência fixa).
 * Serve para dar ordem de grandeza, nunca para prever ganho ou perda.
 */
import { calculaTDEE, calculaTMB, NIVEIS, type Faixa, type Sexo } from "@/lib/calorias";

export const KCAL_POR_KG = 7700;

export const ENQUETE = [
  { id: "1kg", rotulo: "“Engordei 1 kg”" },
  { id: "2kg", rotulo: "“Engordei 2 kg”" },
  { id: "3kg", rotulo: "“Engordei 3 kg ou mais”" },
  { id: "direto", rotulo: "“Acontece comigo direto”" },
  { id: "nunca", rotulo: "“Nunca parei para pensar nisso”" },
] as const;

/** "Esses beliscos foram além do que você normalmente comeria?" → fração que pode ser excedente. */
export const ALEM = [
  { id: "sim", rotulo: "Sim", min: 1, max: 1 },
  { id: "mais-ou-menos", rotulo: "Mais ou menos", min: 0.5, max: 1 },
  { id: "nao-sei", rotulo: "Não sei", min: 0, max: 1 },
  { id: "substituiram", rotulo: "Não, substituíram outras comidas", min: 0, max: 0 },
] as const;
export type AlemId = (typeof ALEM)[number]["id"];

export const SUBIDAS = [0.5, 1, 1.5, 2, 3] as const;

export const PERIODOS = [
  { id: "1d", rotulo: "1 dia", dias: 1 },
  { id: "2d", rotulo: "2 dias", dias: 2 },
  { id: "fds", rotulo: "Fim de semana", dias: 2 },
  { id: "3-4d", rotulo: "3–4 dias", dias: 3.5 },
  { id: "1s", rotulo: "1 semana", dias: 7 },
  { id: "mais", rotulo: "Mais tempo", dias: 14 },
] as const;
export type PeriodoId = (typeof PERIODOS)[number]["id"];

export type Dados = { peso: number; altura: number; idade: number; sexo: Sexo; nivelId: string };

export function gastoDe(d: Dados): { tmb: Faixa; tdee: Faixa } {
  const nivel = NIVEIS.find((n) => n.id === d.nivelId) ?? NIVEIS[0];
  const tmb = calculaTMB(d.peso, d.altura, d.idade, d.sexo);
  return { tmb, tdee: calculaTDEE(tmb, nivel.fator) };
}

/**
 * Superávit equivalente aos quilos e o consumo TEÓRICO por dia para gerar
 * esse superávit no período. Consumo ≠ superávit: soma-se o gasto do dia.
 */
export function perspectiva(kg: number, dias: number, tdee: Faixa) {
  const superavit = kg * KCAL_POR_KG;
  const porDia = superavit / dias;
  return { superavit, superavitPorDia: porDia, consumoPorDia: { min: tdee.min + porDia, max: tdee.max + porDia } };
}

/**
 * Beliscos → equivalente energético teórico, como FAIXA conforme a resposta
 * "foram além?". 680 kcal de beliscos não são automaticamente +680 kcal de
 * superávit: a pessoa pode ter comido menos em outra refeição.
 */
export function equivalenteBeliscos(kcalDia: number, dias: number, alem: AlemId) {
  const f = ALEM.find((a) => a.id === alem)!;
  const total = kcalDia * dias;
  return { excedente: { min: total * f.min, max: total * f.max }, kg: { min: (total * f.min) / KCAL_POR_KG, max: (total * f.max) / KCAL_POR_KG } };
}

export const FATORES = [
  { emoji: "💧", nome: "Água", texto: "O corpo é majoritariamente água, e o quanto ele retém varia de um dia para o outro." },
  { emoji: "🧂", nome: "Sódio", texto: "Comida mais salgada costuma vir acompanhada de mais água retida por um tempo." },
  { emoji: "🍚", nome: "Glicogênio + água", texto: "Depois de comer mais carboidratos, o corpo pode guardar mais glicogênio — e o glicogênio é armazenado junto com água. Parte da mudança rápida na balança pode vir daí, sem representar o mesmo tanto de gordura." },
  { emoji: "🍕", nome: "Volume de comida", texto: "Comer mais significa ter mais comida no trato digestivo naquele momento — e ela pesa." },
  { emoji: "🍺", nome: "Álcool e hidratação", texto: "Álcool mexe com a hidratação, e isso aparece na balança nos dias seguintes." },
  { emoji: "🏋️", nome: "Treino", texto: "Treinos novos ou mais intensos podem causar inflamação muscular temporária, que também retém água." },
  { emoji: "🚽", nome: "Conteúdo intestinal", texto: "O horário em que você se pesa em relação ao intestino muda o número." },
  { emoji: "🌙", nome: "Sono e rotina", texto: "Noites mal dormidas e rotina fora do eixo também costumam mexer na balança." },
] as const;

export const FATOR_CICLO = { emoji: "🔄", nome: "Ciclo menstrual", texto: "Mudanças ao longo do ciclo menstrual também podem alterar o peso temporariamente." } as const;
