/**
 * O motor da Calculadora de IMC.
 *
 * IMC = peso (kg) ÷ altura (m)². Faixas da OMS para adultos, as mesmas da
 * ABESO: abaixo de 18,5 baixo peso; 18,5 a 24,9 normal; 25 a 29,9
 * sobrepeso; 30 a 34,9 obesidade grau I; 35 a 39,9 grau II; 40 ou mais
 * grau III.
 *
 * A página diz em voz alta o que o IMC não vê — músculo, onde está a
 * gordura — e manda quem treina para as ferramentas que veem: percentual
 * de gordura e relação cintura-altura. Para crianças e adolescentes o IMC
 * se lê por curva de idade e sexo, e esta calculadora não faz isso.
 */

export const FONTES_IMC = [
  { rotulo: "Organização Mundial da Saúde. A healthy lifestyle: WHO recommendations (classificação do IMC em adultos)", url: "https://www.who.int/europe/news-room/fact-sheets/item/a-healthy-lifestyle---who-recommendations" },
  { rotulo: "ABESO. Calculadora de IMC", url: "https://abeso.org.br/calculadora-imc/" },
];

export interface FaixaImc { id: string; nome: string; ate: number; cor: string }

export const FAIXAS_IMC: FaixaImc[] = [
  { id: "baixo", nome: "Baixo peso", ate: 18.5, cor: "#60a5fa" },
  { id: "normal", nome: "Peso normal", ate: 25, cor: "#22c55e" },
  { id: "sobrepeso", nome: "Sobrepeso", ate: 30, cor: "#eab308" },
  { id: "ob1", nome: "Obesidade grau I", ate: 35, cor: "#f97316" },
  { id: "ob2", nome: "Obesidade grau II", ate: 40, cor: "#ef4444" },
  { id: "ob3", nome: "Obesidade grau III", ate: Infinity, cor: "#b91c1c" },
];

/** Arredonda a uma casa antes de classificar, como a tabela é lida (24,96 → 25,0 → sobrepeso). */
export const imc = (pesoKg: number, alturaM: number) => Math.round((pesoKg / (alturaM * alturaM)) * 10) / 10;

export const faixaImc = (v: number) => FAIXAS_IMC.find((f) => v < f.ate) ?? FAIXAS_IMC[FAIXAS_IMC.length - 1];

/** Pesos que dão IMC de 18,5 a 24,9 nessa altura. */
export const faixaPesoNormal = (alturaM: number) => ({ de: 18.5 * alturaM * alturaM, ate: 24.9 * alturaM * alturaM });

export const ALTURAS_TABELA = [1.5, 1.55, 1.6, 1.65, 1.7, 1.75, 1.8, 1.85, 1.9] as const;

export const parseNumero = (s: string): number | null => {
  const n = Number(s.replace(",", ".").trim());
  return s.trim() && Number.isFinite(n) ? n : null;
};
export const fmt1 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
