/**
 * Motor do simulador "Quanto tempo para ter shape?" — trajetória de anos.
 *
 * O QUE ELE RESPONDE (E O QUE AS OUTRAS FERRAMENTAS JÁ RESPONDEM)
 *
 * - Calculadora de Potencial Natural: "quanto ainda cabe" (FFMI, 5 anos).
 * - Simulador de Ganho de Massa: "quando meu PESO chega em X" (meses).
 * - Este: "em que estágio estou, como tende a ser a curva dos próximos
 *   anos, e onde uma referência deixa de caber num prazo honesto".
 * FFMI e FFMI normalizado vêm de lib/potencial.ts — as duas ferramentas
 * nunca discordam sobre o ponto de partida.
 *
 * O MODELO, E O TAMANHO DA SUA EVIDÊNCIA
 *
 * 1. Massa magra = peso × (1 − %gordura). Sem %gordura, estimamos por
 *    Deurenberg et al. (1991): %G = 1,2·IMC + 0,23·idade − 10,8·sexo − 5,4
 *    (erro-padrão ~4 pontos; SUPERESTIMA gordura em quem é musculoso). A
 *    confiança cai e a faixa de FFMI abre ±4 pontos de gordura.
 *
 * 2. Ritmo de ganho de massa magra por ANO EFETIVO de treino, em % da
 *    massa magra: 14% no 1º ano, 7% no 2º, 3,5% no 3º e 1,5%/ano depois.
 *    É o modelo de Lyle McDonald (~9, 4,5, 2,3, 1 kg/ano para ~65 kg de
 *    massa magra), um modelo PRÁTICO, não um resultado de ensaio. A
 *    literatura sustenta a forma (retornos decrescentes; iniciantes
 *    respondem mais) — não os números exatos. Mulheres: metade, pela mesma
 *    fonte (base mais fraca). Por isso só existem FAIXAS: o cenário
 *    conservador usa 50% da curva, o consistente 100%, o muito bem
 *    executado 130% (≈ o modelo de Aragon usado na Calculadora de
 *    Potencial Natural).
 *
 * 3. Freio perto da faixa de referência: nas últimas 1,5 unidade de FFMI
 *    normalizado antes da referência do cenário, o ritmo cai linearmente
 *    até zero. A referência muda por cenário (homem 24 / 25 / 26; mulher
 *    21 / 22 / 23) porque o "25" de Kouri (1995) é o teto de UMA amostra,
 *    não uma lei. Isso expressa variação individual, não um limite.
 *
 * 4. Consistência e frequência são ADERÊNCIA: multiplicam o ritmo e o
 *    quanto do tempo "conta" como treino. Frequência: com volume igual, ela
 *    não muda a hipertrofia (Schoenfeld 2016, 2019); sem igualar volume,
 *    1×/semana perde para 2–3×, com efeito modesto. Então 1× = 0,75, 2× =
 *    0,9, 3+ = 1 — MAIS DIAS NÃO ACELERAM o modelo. Os fatores de
 *    consistência (0,4 / 0,65 / 0,85 / 1) são classificação interna.
 *
 * 5. Estágios são CLASSIFICAÇÃO INTERNA do simulador, por FFMI normalizado.
 *    Não existem fronteiras científicas universais.
 *
 * O QUE NUNCA FAZ
 * - Prazo para referências profissionais (Classic, 212, Open): elas ficam
 *   fora do que um modelo de progressão natural consegue projetar. Sem
 *   número, e sem inferir nada sobre atleta nenhum.
 * - Casas decimais de anos, "limite genético", modo com hormônios.
 * - Enviar dado corporal a analytics (o componente só manda interação).
 */

import { ffmi, ffmiNormalizado } from "./potencial";

/** Chave do sessionStorage que leva os números da versão compacta ao simulador. */
export const CHAVE_PREENCHIDO = "shape_prefill";
export const URL_SHAPE = "https://www.montinhopersonal.com.br/ferramentas/quanto-tempo-para-ter-shape";

export type Sexo = "homem" | "mulher";
export type Anos = "zero" | "lt6m" | "6a12" | "1a2" | "2a4" | "4a7" | "7mais";
export type Consistencia = "irregular" | "mais-ou-menos" | "consistente" | "muito";
export type ReferenciaId = "atletico" | "musculoso" | "avancado" | "classic" | "212" | "open";
export type CenarioId = "conservador" | "consistente" | "otimo";

/** Meio da faixa de anos declarada (em anos de calendário). */
export const ANOS: Record<Anos, { rotulo: string; anos: number }> = {
  zero: { rotulo: "Ainda não comecei", anos: 0 },
  lt6m: { rotulo: "Menos de 6 meses", anos: 0.25 },
  "6a12": { rotulo: "6 a 12 meses", anos: 0.75 },
  "1a2": { rotulo: "1 a 2 anos", anos: 1.5 },
  "2a4": { rotulo: "2 a 4 anos", anos: 3 },
  "4a7": { rotulo: "4 a 7 anos", anos: 5.5 },
  "7mais": { rotulo: "7 anos ou mais", anos: 9 },
};

export const CONSISTENCIA: Record<Consistencia, { rotulo: string; fator: number }> = {
  irregular: { rotulo: "Muito irregular", fator: 0.4 },
  "mais-ou-menos": { rotulo: "Mais ou menos", fator: 0.65 },
  consistente: { rotulo: "Consistente", fator: 0.85 },
  muito: { rotulo: "Muito consistente", fator: 1 },
};

export const fatorFrequencia = (dias: number) => (dias <= 1 ? 0.75 : dias === 2 ? 0.9 : 1);

export const CENARIOS: Record<CenarioId, { nome: string; mult: number; tetoH: number; tetoM: number; descricao: string }> = {
  conservador: { nome: "Conservador", mult: 0.5, tetoH: 24, tetoM: 21, descricao: "Evolução abaixo da média: treino ou alimentação irregulares, pouca progressão." },
  consistente: { nome: "Consistente", mult: 1, tetoH: 25, tetoM: 22, descricao: "Treino regular com progressão e alimentação razoável." },
  otimo: { nome: "Muito bem executado", mult: 1.3, tetoH: 26, tetoM: 23, descricao: "Treino estruturado, progressão acompanhada, alimentação, sono e aderência em dia. Nada além disso." },
};

/** Estágios (classificação interna) por FFMI normalizado. */
export const ESTAGIOS = [
  { id: "iniciante", nome: "Iniciante", h: 0, m: 0 },
  { id: "treinado", nome: "Treinado", h: 19, m: 15.5 },
  // Mesmos nomes e limiares das referências de nível 1–3: "musculoso" no
  // estágio e na referência querem dizer a mesma coisa.
  { id: "atletico", nome: "Atlético", h: 20.5, m: 17 },
  { id: "musculoso", nome: "Musculoso", h: 22, m: 18.5 },
  { id: "avancado", nome: "Avançado", h: 23.5, m: 20 },
  { id: "elite", nome: "Referência de elite", h: 25, m: 21.5 },
] as const;

export interface Referencia {
  id: ReferenciaId;
  nome: string;
  descricao: string;
  /** FFMI normalizado alvo; null = profissional, sem prazo responsável. */
  alvo: { homem: number; mulher: number } | null;
  atleta?: { nome: string; dado: string };
}

export const REFERENCIAS: Referencia[] = [
  { id: "atletico", nome: "Atlético", descricao: "Corpo treinado, com músculo visível e bom condicionamento.", alvo: { homem: 20.5, mulher: 17 } },
  { id: "musculoso", nome: "Musculoso", descricao: "Claramente musculoso, mesmo de roupa.", alvo: { homem: 22, mulher: 18.5 } },
  { id: "avancado", nome: "Avançado", descricao: "Muito acima da média de quem treina; anos de treino bem feito.", alvo: { homem: 23.5, mulher: 20 } },
  { id: "classic", nome: "Classic Physique profissional", descricao: "Nível de muscularidade do palco da Classic Physique.", alvo: null, atleta: { nome: "Ramon Dino", dado: "1,81 m e 102,5 kg na pesagem oficial do Mr. Olympia 2026 (23/09/2026). Peso de pesagem, sem percentual de gordura publicado: não entra em cálculo." } },
  { id: "212", nome: "212 profissional", descricao: "Fisiculturismo com teto de 96,2 kg na pesagem.", alvo: null, atleta: { nome: "Lucas Garcia", dado: "Compete na 212, categoria com limite de 212 lb (≈96,2 kg). Sem dados de composição publicados: não entra em cálculo." } },
  { id: "open", nome: "Open profissional", descricao: "Fisiculturismo sem limite de peso, o nível máximo de massa.", alvo: null, atleta: { nome: "Leandro Peres", dado: "Único brasileiro no Open do Mr. Olympia 2026. Sem dados de composição publicados: não entra em cálculo." } },
];

export const referencia = (id: ReferenciaId) => REFERENCIAS.find((r) => r.id === id)!;

/* ───────────── Entrada ───────────── */

export interface Entrada {
  sexo: Sexo;
  alturaCm: number;
  pesoKg: number;
  gorduraPct: number | null;
  idade: number | null;
  anos: Anos;
  consistencia: Consistencia;
  dias: number;
  referencia: ReferenciaId;
}

export const LIMITES = { alturaMin: 140, alturaMax: 215, pesoMin: 35, pesoMax: 200, gorduraMin: 4, gorduraMax: 50, idadeMin: 16, idadeMax: 80 };

export function validaEntrada(e: Partial<Entrada>): string | null {
  if (!e.alturaCm || e.alturaCm < LIMITES.alturaMin || e.alturaCm > LIMITES.alturaMax) return `Altura entre ${LIMITES.alturaMin} e ${LIMITES.alturaMax} cm.`;
  if (!e.pesoKg || e.pesoKg < LIMITES.pesoMin || e.pesoKg > LIMITES.pesoMax) return `Peso entre ${LIMITES.pesoMin} e ${LIMITES.pesoMax} kg.`;
  if (e.gorduraPct != null && (e.gorduraPct < LIMITES.gorduraMin || e.gorduraPct > LIMITES.gorduraMax)) return `Percentual de gordura entre ${LIMITES.gorduraMin}% e ${LIMITES.gorduraMax}%, ou marque "não sei".`;
  if (e.idade != null && (e.idade < LIMITES.idadeMin || e.idade > LIMITES.idadeMax)) return `Idade entre ${LIMITES.idadeMin} e ${LIMITES.idadeMax} anos.`;
  return null;
}

/** Deurenberg et al. (1991), adultos. */
export function gorduraDeurenberg(pesoKg: number, alturaCm: number, idade: number | null, sexo: Sexo): number {
  const imc = pesoKg / (alturaCm / 100) ** 2;
  const g = 1.2 * imc + 0.23 * (idade ?? 30) - 10.8 * (sexo === "homem" ? 1 : 0) - 5.4;
  return Math.min(LIMITES.gorduraMax, Math.max(sexo === "homem" ? 6 : 12, g));
}

/* ───────────── Modelo ───────────── */

/** % da massa magra por ano, no ano efetivo `e` (contínuo). */
export function ritmoAnual(e: number, sexo: Sexo): number {
  const base = e < 1 ? 0.14 : e < 2 ? 0.07 : e < 3 ? 0.035 : 0.015;
  return sexo === "mulher" ? base / 2 : base;
}

export interface Ponto { mes: number; ffm: number; ffmiN: number }

/** Trajetória mensal por 15 anos num cenário. */
export function trajetoria(ffm0: number, alturaM: number, sexo: Sexo, efetivo0: number, aderencia: number, c: CenarioId): Ponto[] {
  const cen = CENARIOS[c];
  const teto = sexo === "homem" ? cen.tetoH : cen.tetoM;
  const out: Ponto[] = [];
  let ffm = ffm0;
  let e = efetivo0;
  for (let mes = 0; mes <= 180; mes++) {
    const n = ffmiNormalizado(ffm, alturaM);
    out.push({ mes, ffm, ffmiN: n });
    const freio = Math.min(1, Math.max(0, (teto - n) / 1.5));
    ffm += (ffm * ritmoAnual(e, sexo) * cen.mult * aderencia * freio) / 12;
    e += aderencia / 12;
  }
  return out;
}

export function estagio(ffmiN: number, sexo: Sexo) {
  let s: (typeof ESTAGIOS)[number] = ESTAGIOS[0];
  for (const x of ESTAGIOS) if (ffmiN >= (sexo === "homem" ? x.h : x.m)) s = x;
  return s;
}

export type Confianca = "alta" | "media" | "baixa";

export interface Resultado {
  alturaM: number;
  gorduraPct: number;
  gorduraEstimada: boolean;
  ffm: number;
  ffmi: number;
  ffmiN: number;
  /** Faixa do FFMI normalizado atual (abre quando a gordura é estimada). */
  ffmiFaixa: [number, number];
  estagio: (typeof ESTAGIOS)[number];
  /** 0–1 na régua de estágios, para a barra. */
  posicaoRegua: number;
  cenarios: Record<CenarioId, Ponto[]>;
  proximo: { nome: string; kg: [number, number]; anos: [number, number] | null } | null;
  alvo:
    | { tipo: "sem-prazo" }
    | { tipo: "ja-chegou" }
    | { tipo: "faixa"; anos: [number, number]; conservador: number | null }
    | { tipo: "alem-do-modelo"; minimoAnos: number | null };
  confianca: Confianca;
  motivosConfianca: string[];
}

const reguaMax = (s: Sexo) => (s === "homem" ? 26 : 23);
const reguaMin = (s: Sexo) => (s === "homem" ? 16 : 13);

/** Primeiro mês em que a trajetória alcança `n`; null se não alcança em 15 anos. */
const mesAte = (t: Ponto[], n: number) => t.find((p) => p.ffmiN >= n - 1e-9)?.mes ?? null;

/** Arredonda uma faixa de meses para anos "humanos" (meio ano até 3, depois inteiros). */
export function faixaAnos(minMes: number, maxMes: number): [number, number] {
  const r = (m: number, up: boolean) => {
    const a = m / 12;
    const passo = a < 3 ? 0.5 : 1;
    return Math.max(passo, (up ? Math.ceil(a / passo) : Math.floor(a / passo)) * passo);
  };
  const a = r(minMes, false);
  const b = Math.max(a, r(maxMes, true));
  return [a, b];
}

export function calcula(x: Entrada): Resultado {
  const alturaM = x.alturaCm / 100;
  const estimada = x.gorduraPct == null;
  const g = estimada ? gorduraDeurenberg(x.pesoKg, x.alturaCm, x.idade, x.sexo) : x.gorduraPct!;
  const ffm = x.pesoKg * (1 - g / 100);
  const n = ffmiNormalizado(ffm, alturaM);
  const d = estimada ? 4 : 1.5; // pontos de gordura de incerteza
  const nLo = ffmiNormalizado(x.pesoKg * (1 - Math.min(60, g + d) / 100), alturaM);
  const nHi = ffmiNormalizado(x.pesoKg * (1 - Math.max(3, g - d) / 100), alturaM);

  const cons = CONSISTENCIA[x.consistencia].fator;
  const aderencia = cons * fatorFrequencia(x.dias);
  const efetivo0 = ANOS[x.anos].anos * cons;
  const cenarios = {
    conservador: trajetoria(ffm, alturaM, x.sexo, efetivo0, aderencia, "conservador"),
    consistente: trajetoria(ffm, alturaM, x.sexo, efetivo0, aderencia, "consistente"),
    otimo: trajetoria(ffm, alturaM, x.sexo, efetivo0, aderencia, "otimo"),
  };

  const est = estagio(n, x.sexo);
  const idx = ESTAGIOS.findIndex((s) => s.id === est.id);
  const prox = ESTAGIOS[idx + 1];
  let proximo: Resultado["proximo"] = null;
  if (prox) {
    const alvoN = x.sexo === "homem" ? prox.h : prox.m;
    const kg = (alvoN - n) * alturaM * alturaM; // ΔFFM ≈ ΔFFMI·h² (o ajuste de altura é constante)
    const kgLo = Math.max(1, Math.floor(kg));
    const kgHi = Math.max(kgLo + 1, Math.ceil(kg + (nHi - nLo) * alturaM * alturaM * 0.5));
    const mOt = mesAte(cenarios.otimo, alvoN);
    const mCons = mesAte(cenarios.conservador, alvoN) ?? mesAte(cenarios.consistente, alvoN);
    proximo = { nome: prox.nome, kg: [kgLo, kgHi], anos: mOt !== null && mCons !== null ? faixaAnos(mOt, mCons) : null };
  }

  const ref = referencia(x.referencia);
  let alvo: Resultado["alvo"];
  if (!ref.alvo) alvo = { tipo: "sem-prazo" };
  else {
    const alvoN = ref.alvo[x.sexo];
    if (n >= alvoN) alvo = { tipo: "ja-chegou" };
    else {
      const mOt = mesAte(cenarios.otimo, alvoN);
      const mCen = mesAte(cenarios.consistente, alvoN);
      const mCons = mesAte(cenarios.conservador, alvoN);
      if (mCen === null || mOt === null) alvo = { tipo: "alem-do-modelo", minimoAnos: mOt !== null ? faixaAnos(mOt, mOt)[0] : null };
      // Faixa = muito bem executado → consistente. O conservador vai à parte:
      // juntá-lo daria "1,5 a 15 anos", uma faixa que não informa nada.
      else alvo = { tipo: "faixa", anos: faixaAnos(mOt, mCen), conservador: mCons === null ? null : faixaAnos(mCons, mCons)[1] };
    }
  }

  const motivos: string[] = [];
  if (estimada) motivos.push("Você não informou o percentual de gordura: estimamos pelo IMC, que erra ~4 pontos e superestima gordura em quem já é musculoso. A faixa ficou mais ampla.");
  if (x.consistencia === "irregular" || x.consistencia === "mais-ou-menos") motivos.push("Um histórico irregular torna o tempo de treino declarado menos informativo.");
  if (x.sexo === "mulher") motivos.push("Os modelos de ritmo de ganho foram construídos sobretudo com homens; para mulheres a base é mais fraca.");
  const confianca: Confianca = estimada ? "baixa" : motivos.length ? "media" : "alta";

  const pos = (n - reguaMin(x.sexo)) / (reguaMax(x.sexo) - reguaMin(x.sexo));
  return {
    alturaM, gorduraPct: g, gorduraEstimada: estimada, ffm, ffmi: ffmi(ffm, alturaM), ffmiN: n,
    ffmiFaixa: [nLo, nHi], estagio: est, posicaoRegua: Math.min(1, Math.max(0, pos)),
    cenarios, proximo, alvo, confianca, motivosConfianca: motivos,
  };
}

/** Posição de um FFMI normalizado na régua (0–1), para as barras. */
export const naRegua = (n: number, s: Sexo) => Math.min(1, Math.max(0, (n - reguaMin(s)) / (reguaMax(s) - reguaMin(s))));

/* ───────────── Gargalos (regras, não diagnóstico) ───────────── */

export interface Gargalos {
  estruturado: "sim" | "nao" | "mais-ou-menos";
  progressao: "sim" | "nao" | "nao-acompanho";
  proteina: "acompanho" | "nao-acompanho";
  sono: "lt6" | "6a7" | "7a9" | "9mais";
  constancia: "alta" | "media" | "baixa";
}

export function maiorGargalo(g: Gargalos): { titulo: string; texto: string } {
  if (g.constancia === "baixa") return { titulo: "Consistência", texto: "Você relatou uma rotina irregular. Antes de qualquer detalhe avançado, aumentar o número de semanas realmente cumpridas é provavelmente o ponto que mais muda a sua curva." };
  if (g.estruturado === "nao") return { titulo: "Estrutura do treino", texto: "Treinar sem um plano definido dificulta repetir o estímulo e somar volume semana após semana. Um treino estruturado, com exercícios e séries definidos, vem antes de qualquer ajuste fino." };
  if (g.progressao !== "sim") return { titulo: "Progressão", texto: "Você treina, mas não acompanha cargas e repetições. Sem isso, não dá para saber se existe progressão — e progressão é o que mantém o estímulo crescendo quando os ganhos de iniciante acabam." };
  if (g.sono === "lt6") return { titulo: "Sono", texto: "Menos de 6 horas por noite atrapalha recuperação e desempenho no treino. Não é diagnóstico: vale olhar para isso antes de mexer no treino." };
  if (g.proteina === "nao-acompanho") return { titulo: "Proteína", texto: "Você não acompanha a proteína do dia. Não é obrigatório pesar comida, mas ter uma noção de quanto você come ajuda a garantir que ela não esteja faltando." };
  if (g.constancia === "media") return { titulo: "Consistência", texto: "Sua rotina é razoável, mas oscila. Nos anos seguintes, é a regularidade — mais do que qualquer técnica — que decide quanto da curva você aproveita." };
  return { titulo: "Paciência com a curva", texto: "Pelas suas respostas, o básico está em dia. Daqui para frente o ganho fica mais lento para todo mundo: o trabalho é manter a progressão por anos, ajustando volume e exercícios quando estagnar." };
}

/* ───────────── Formatação ───────────── */

export const fmt1 = (v: number) => v.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
export const fmtAno = (a: number) => (Number.isInteger(a) ? String(a) : a.toLocaleString("pt-BR", { maximumFractionDigits: 1 }));
export function fmtFaixaAnos([a, b]: [number, number]): string {
  if (a === b) return `cerca de ${fmtAno(a)} ${a <= 1 ? "ano" : "anos"}`;
  return `${fmtAno(a)} a ${fmtAno(b)} anos`;
}

/**
 * Artigos com a entrada compacta EMBUTIDA (<!--SHAPE:ref-->). Só onde não há
 * outra ferramenta: Classic e peso do Ramon já têm a calculadora da Classic
 * e recebem apenas um link em texto (uma continuação por página).
 */
export const ARTIGOS_COM_SHAPE: string[] = ["resultado-212-mr-olympia-2026", "resultado-mr-olympia-open-2026", "mr-olympia-brasil-2026",
  "por-que-ramon-dino-perdeu-mr-olympia-2026",
  "ramon-dino-mr-olympia-2026-horario",
  "quem-ganhou-mr-olympia-2026",
  "brasileiros-mr-olympia-2026",
  "resultado-mens-physique-olympia-2026",
  "resultado-wellness-mr-olympia-2026",
  "resultado-womens-physique-olympia-2026",
  "resultado-bikini-olympia-2026",
  "resultado-fit-model-olympia-2026",
];
