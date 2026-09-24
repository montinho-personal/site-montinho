/**
 * O motor do Simulador de Ganho de Massa Muscular.
 *
 * O QUE ELE RESPONDE — E O QUE RECUSA RESPONDER
 *
 * Responde "se eu fizer isso nos próximos meses, para onde meu PESO tende
 * a ir, e quando chego aos 70 kg?" — trajetória de peso corporal, com
 * faixa. E responde "o que mais está limitando meu ganho?", por regras.
 *
 * Recusa responder "quantos quilos de MÚSCULO vou ganhar". A Calculadora de
 * Potencial Natural já cobre "quanto ainda cabe", com as ressalvas do FFMI;
 * aqui a composição do ganho aparece como tendência ("mais massa magra" ou
 * "mais gordura"), nunca como número exato — ninguém consegue prever isso
 * a partir de sete perguntas.
 *
 * O MODELO
 *
 * O mesmo balanço energético dinâmico do Simulador de Emagrecimento, ao
 * contrário: ingestão − gasto vira variação de peso, o gasto é recalculado
 * com o peso novo, e cada quilo ganho tem uma energia que depende de quanto
 * dele é massa magra e quanto é gordura (Forbes). Três coisas são
 * específicas do ganho:
 *
 * 1. O PESO ESTÁVEL É O DADO MAIS CONFIÁVEL QUE A PESSOA TEM. Se a balança
 *    está igual há semanas, a ingestão média ≈ o gasto, não importa quanto
 *    a pessoa acha que come. O modelo ancora a manutenção nisso: "como
 *    muito e não engordo" vira "na média, você come a manutenção".
 *
 * 2. A MASSA MAGRA TEM TETO POR SEMANA. Dobrar o superávit não dobra o
 *    músculo: o ganho de massa magra é limitado pela taxa do nível de
 *    treino (as mesmas taxas de Aragon que a Calculadora de Potencial
 *    Natural usa — importadas de lá, para as duas nunca discordarem), e o
 *    que passa do teto vira gordura. É o que Garthe (2013) viu em atletas
 *    com superávit grande: mais peso, mais gordura, não mais músculo.
 *
 * 3. TREINO E PROGRESSÃO DECIDEM A FATIA MAGRA, NÃO A VELOCIDADE. Quem não
 *    treina, ou treina sem progredir, ganha peso do mesmo jeito — só que
 *    com menos massa magra. O treino entra como multiplicador da fração
 *    magra (dentro do teto), nunca como "+X g de músculo por sessão".
 *
 * A FAIXA DE GANHO QUE VALE TESTAR
 *
 * Iraki et al. (2019): 0,25% a 0,5% do peso por semana para iniciantes e
 * intermediários, com superávit de ~10–20%; avançados, mais conservadores.
 * O simulador mostra três ritmos — conservador, intermediário, mais
 * rápido — e diz em qual a pessoa está, sem chamar nenhum de "certo".
 *
 * AS TAXAS DE ARAGON FORAM PENSADAS PARA HOMENS. Em percentual do peso
 * elas servem de teto razoável para mulheres, mas a literatura é mais fina
 * — e a página diz isso na metodologia, em vez de inventar um fator.
 *
 * INCERTEZA: gasto ±5%, como no de emagrecimento. A meta chega numa faixa
 * de semanas, nunca num dia. Projeções param em 52 semanas.
 */

import { NIVEIS, type NivelId } from "../potencial";
import {
  BETA_ADAPTACAO, ENERGIA_GORDURA, ENERGIA_MAGRA, FATOR_ROTINA, FORBES_C, INCERTEZA, SEMANAS_MAX,
  PASSOS_FAIXA, gorduraInicialKg, imc, kcalPassosExtra, kcalPorMinutoTreino, repouso,
  type FaixaPassos, type Hormonio, type Rotina, type Sexo,
} from "./emagrecimento";

export { parseAltura, parseNumero, fmtKg, fmtKgProj, fmtSemanas, fmtFaixaSemanas, validaBasicos, IDADE_MIN, PESO_MIN, PESO_MAX, KCAL_MIN, KCAL_MAX, SEMANAS_MAX } from "./emagrecimento";
export type { Sexo, Rotina, FaixaPassos, Hormonio };

/* ───────────────────────── Tipos ───────────────────────── */

export type ObjetivoMassa = "massa" | "peso" | "maior" | "forca" | "sem-barriga" | "nao-sei";
export type Experiencia = "nunca" | "lt6m" | "6a12" | "1a2" | "2a4" | "gt4";
export type Continuidade = "continuo" | "pausas" | "para-e-volta" | "voltando";
export type Acompanha = "anota" | "nocao" | "nao" | "nem-sei";
export type Tendencia = "perdendo" | "igual" | "subindo-devagar" | "subindo-rapido" | "nao-sei";
export type Apetite = "muita-dificuldade" | "cheio-rapido" | "normal" | "bastante";
export type Dificuldade = "comer" | "peso-nao-sobe" | "quanto-comer" | "treino-bom" | "cargas" | "constancia" | "medo-barriga" | "organizar" | "nao-sei" | "outro";
export type Cardio = "nao" | "1a2" | "3a4" | "5+" | "nao-sei";
export type Suplemento = "creatina" | "whey" | "hipercalorico" | "outro";
export type HistoricoPeso = "sempre" | "mudei" | "sem-querer" | "nao-sei";
export type Progressao = "nao" | "pouco" | "sim";

export interface PerfilMassa {
  objetivo: ObjetivoMassa;
  idade: number;
  sexo: Sexo;
  alturaCm: number;
  pesoKg: number;
  metaKg: number | null;
  gorduraPct: number | null;
  experiencia: Experiencia;
  continuidade: Continuidade;
  treinos: number;
  acompanha: Acompanha;
  tendencia: Tendencia;
  kcalDia: number | null;
  apetite: Apetite;
  dificuldade: Dificuldade;
  proteinaG: number | null;
  rotina: Rotina;
  passos: FaixaPassos;
  cardio: Cardio;
  suplementos: Suplemento[];
  hormonio: Hormonio;
  historicoPeso: HistoricoPeso;
}

export interface CenarioMassa {
  /** kcal por dia acima da manutenção estimada, nos dias de plano. */
  superavit: number;
  treinos: number;
  /** 0 a 1: fração dos dias (e treinos) em que o plano acontece. */
  consistencia: number;
  progressao: Progressao;
}

/* ───────────────────────── Constantes ───────────────────────── */

/** Rótulo curto do estado do ritmo, sem julgamento. */
export const ESTADO_RITMO: Record<ProjecaoMassa["estadoRitmo"], string> = { abaixo: "Peso parado ou caindo", conservador: "Ritmo mais conservador", "na-faixa": "Ritmo dentro da faixa planejada", acima: "Peso subindo mais rápido que o planejado" };
export const META_MAX_FRACAO = 0.35;

/** Gasto do cardio/esporte além da musculação: ~6 MET líquido, 40 min. */
const CARDIO_SESSOES: Record<Cardio, number> = { nao: 0, "1a2": 1.5, "3a4": 3.5, "5+": 5, "nao-sei": 1 };

/** Como o peso vem se comportando → onde a ingestão atual está em relação ao gasto. */
export const SALDO_TENDENCIA: Record<Tendencia, number> = { perdendo: -250, igual: 0, "subindo-devagar": 150, "subindo-rapido": 400, "nao-sei": 0 };

/** Nível de treino efetivo: tempo de treino descontado das interrupções. */
export function nivelDe(experiencia: Experiencia, continuidade: Continuidade): NivelId {
  const anos = { nunca: 0, lt6m: 0.25, "6a12": 0.75, "1a2": 1.5, "2a4": 3, gt4: 5 }[experiencia];
  const fator = { continuo: 1, pausas: 0.75, "para-e-volta": 0.5, voltando: 0.5 }[continuidade];
  const efetivo = anos * fator;
  return efetivo < 1 ? "iniciante" : efetivo < 3 ? "intermediario" : "avancado";
}

/** Teto de massa magra por dia, pela taxa máxima do nível (Aragon, via Potencial Natural). */
export function tetoMagraDia(pesoKg: number, nivelId: NivelId): number {
  const n = NIVEIS.find((x) => x.id === nivelId)!;
  return (pesoKg * n.taxa.max) / 30.4;
}

/**
 * Quanto do peso ganho tende a ser massa magra, ANTES do teto.
 * Forbes dá a partição pelo estoque de gordura (quem tem menos gordura
 * ganha mais magro por quilo); o treino e a progressão ajustam para cima
 * ou para baixo, e o resultado fica entre 0,25 e 0,85.
 */
export function fracaoMagra(gorduraKg: number, treinos: number, progressao: Progressao, nivelId: NivelId): number {
  const forbes = FORBES_C / (FORBES_C + Math.max(gorduraKg, 2));
  const treino = treinos === 0 ? 0.55 : treinos === 1 ? 0.8 : treinos === 2 ? 0.95 : 1.05;
  const prog = { nao: 0.8, pouco: 0.95, sim: 1.1 }[progressao];
  const nivel = { iniciante: 1.1, intermediario: 1.0, avancado: 0.9 }[nivelId];
  return Math.min(0.85, Math.max(0.25, forbes * treino * prog * nivel));
}

/* ───────────────────────── Entrada e guardrails ───────────────────────── */

export type BloqueioMassa = { tipo: "menor" } | { tipo: "meta-alta"; maximoKg: number };
export type AvisoMassa = "perda-involuntaria" | "imc-baixo";

export function bloqueioMassa(idade: number): BloqueioMassa | null {
  return idade < 18 ? { tipo: "menor" } : null;
}

/** Avisos que não bloqueiam: aparecem no resultado e pedem acompanhamento. */
export function avisos(p: Pick<PerfilMassa, "historicoPeso" | "pesoKg" | "alturaCm">): AvisoMassa[] {
  const a: AvisoMassa[] = [];
  if (p.historicoPeso === "sem-querer") a.push("perda-involuntaria");
  if (imc(p.pesoKg, p.alturaCm) < 17) a.push("imc-baixo");
  return a;
}

export function validaMetaMassa(metaKg: number | null, pesoKg: number): { campo: "meta"; mensagem: string } | BloqueioMassa | null {
  if (metaKg === null) return { campo: "meta", mensagem: "Informe a meta em kg, ou marque “Não sei”." };
  if (metaKg <= pesoKg) return { campo: "meta", mensagem: "A meta precisa ser maior que o peso atual. Se o objetivo é mudar a composição sem subir o peso, marque “Não sei” e veja a trajetória." };
  if (metaKg - pesoKg < 0.5) return { campo: "meta", mensagem: "A diferença é pequena demais para projetar." };
  const maximo = Math.floor(pesoKg * (1 + META_MAX_FRACAO));
  if (metaKg > maximo) return { tipo: "meta-alta", maximoKg: maximo };
  return null;
}

/* ───────────────────────── Fisiologia ───────────────────────── */

const gorduraKg = (p: PerfilMassa) => (p.gorduraPct !== null ? (p.pesoKg * p.gorduraPct) / 100 : gorduraInicialKg(p));

export function gastoBase(p: PerfilMassa, pesoKg: number, treinos: number): number {
  const musc = (treinos * kcalPorMinutoTreino(3.5 - 1, pesoKg) * 60) / 7;
  const cardio = (CARDIO_SESSOES[p.cardio] * kcalPorMinutoTreino(6 - 1, pesoKg) * 40) / 7;
  /*
   * Passos: o fator de rotina já supõe ~5.000 por dia. Quando a pessoa
   * informa uma faixa, a diferença para 5.000 entra à parte — é assim que
   * o magro que anda 12 mil passos aparece com o gasto que ele tem.
   */
  const passos = p.passos === "nao-sei" ? 0 : PASSOS_FAIXA[p.passos] - 5000;
  const extraPassos = passos >= 0 ? kcalPassosExtra(passos, pesoKg) : -kcalPassosExtra(-passos, pesoKg);
  return repouso(p, pesoKg) * FATOR_ROTINA[p.rotina] + musc + cardio + extraPassos;
}

/**
 * A manutenção de partida. Se o peso está estável, a ingestão atual É a
 * manutenção — e, se a pessoa informou calorias, elas calibram a estimativa
 * (a média entre o que ela informa e o que a equação diz, porque quem anota
 * subestima). Se o peso se move, a ingestão atual = manutenção + saldo.
 */
export function manutencao(p: PerfilMassa): { kcal: number; ingestaoAtual: number; calibrada: boolean } {
  const equacao = gastoBase(p, p.pesoKg, p.treinos);
  if (p.kcalDia !== null && p.tendencia !== "nao-sei") {
    const manut = (equacao + (p.kcalDia - SALDO_TENDENCIA[p.tendencia])) / 2;
    return { kcal: manut, ingestaoAtual: manut + SALDO_TENDENCIA[p.tendencia], calibrada: true };
  }
  return { kcal: equacao, ingestaoAtual: equacao + SALDO_TENDENCIA[p.tendencia], calibrada: false };
}

/* ───────────────────────── Simulação ───────────────────────── */

export interface PontoMassa { semana: number; peso: number; min: number; max: number; magra: number; gordura: number }

export interface ProjecaoMassa {
  pontos: PontoMassa[];
  semanaMeta: number | null;
  faixaMeta: { min: number; max: number } | null;
  manutencao: number;
  ingestaoPlano: number;
  nivel: NivelId;
  /** Ganho médio por semana nas 12 primeiras, em kg e em % do peso. */
  ritmo12: { kg: number; pct: number };
  /** Ritmo em relação à faixa de Iraki (0,25–0,5%/sem; avançado 0,125–0,25%). */
  estadoRitmo: "abaixo" | "conservador" | "na-faixa" | "acima";
  /** Fração do ganho em 26 semanas que o modelo atribui à massa magra. */
  fracaoMagra26: number;
  ganho26: number;
  ganho52: number;
  treinosPlanejados12: number;
  treinosRealizados12: number;
}

function roda(p: PerfilMassa, c: CenarioMassa, fatorGasto: number) {
  const m = manutencao(p);
  const nivelId = nivelDe(p.experiencia, p.continuidade);
  let peso = p.pesoKg, gord = gorduraKg(p), magra = 0, gordAcum = 0;
  const semanal: PontoMassa[] = [{ semana: 0, peso, min: peso, max: peso, magra: 0, gordura: 0 }];
  let cruzaDia: number | null = null;
  const ingestao = c.consistencia * (m.kcal + c.superavit) + (1 - c.consistencia) * m.ingestaoAtual;
  const adaptacao = BETA_ADAPTACAO * (ingestao - m.kcal);
  for (let dia = 1; dia <= SEMANAS_MAX * 7; dia++) {
    const treinosEfetivos = c.consistencia * c.treinos + (1 - c.consistencia) * p.treinos;
    const gasto = gastoBase(p, peso, treinosEfetivos) * fatorGasto + adaptacao;
    const saldo = ingestao - gasto;
    const antes = peso;
    if (saldo >= 0) {
      const fm = fracaoMagra(gord, c.treinos, c.progressao, nivelId);
      const densidade = fm * ENERGIA_MAGRA + (1 - fm) * ENERGIA_GORDURA;
      let dMagra = (saldo / densidade) * fm;
      const teto = tetoMagraDia(peso, nivelId) * (c.progressao === "nao" ? 0.6 : c.progressao === "pouco" ? 0.85 : 1);
      dMagra = Math.min(dMagra, teto);
      const dGord = Math.max(0, saldo - dMagra * ENERGIA_MAGRA) / ENERGIA_GORDURA;
      peso += dMagra + dGord; magra += dMagra; gord += dGord; gordAcum += dGord;
    } else {
      const fm = FORBES_C / (FORBES_C + Math.max(gord, 1));
      const d = saldo / (fm * ENERGIA_MAGRA + (1 - fm) * ENERGIA_GORDURA);
      peso += d; gord += d * (1 - fm); magra += d * fm; gordAcum += d * (1 - fm);
    }
    if (cruzaDia === null && p.metaKg !== null && antes < p.metaKg && peso >= p.metaKg) cruzaDia = dia - 1 + (p.metaKg - antes) / (peso - antes);
    if (dia % 7 === 0) semanal.push({ semana: dia / 7, peso, min: peso, max: peso, magra, gordura: gordAcum });
  }
  return { semanal, cruzaDia, m, nivelId };
}

export function projetaMassa(p: PerfilMassa, c: CenarioMassa): ProjecaoMassa {
  const centro = roda(p, c, 1);
  const rapido = roda(p, c, 1 - INCERTEZA);  // gasta menos → sobe mais rápido
  const lento = roda(p, c, 1 + INCERTEZA);
  const pontos = centro.semanal.map((x, i) => ({ ...x, min: Math.min(rapido.semanal[i].peso, lento.semanal[i].peso), max: Math.max(rapido.semanal[i].peso, lento.semanal[i].peso) }));
  const semanaMeta = centro.cruzaDia === null ? null : centro.cruzaDia / 7;
  const faixaMeta = semanaMeta === null ? null : { min: (rapido.cruzaDia ?? centro.cruzaDia!) / 7, max: lento.cruzaDia === null ? Infinity : lento.cruzaDia / 7 };
  const kg = (pontos[12].peso - p.pesoKg) / 12;
  const pct = kg / p.pesoKg;
  const avancado = centro.nivelId === "avancado";
  const lo = avancado ? 0.00125 : 0.0025, hi = avancado ? 0.0025 : 0.005;
  const estadoRitmo = pct < lo * 0.5 ? "abaixo" : pct < lo ? "conservador" : pct <= hi * 1.1 ? "na-faixa" : "acima";
  const g26 = pontos[26].peso - p.pesoKg;
  return {
    pontos, semanaMeta, faixaMeta, manutencao: centro.m.kcal, ingestaoPlano: centro.m.kcal + c.superavit, nivel: centro.nivelId,
    ritmo12: { kg, pct }, estadoRitmo,
    fracaoMagra26: g26 > 0.05 ? Math.min(1, Math.max(0, pontos[26].magra / g26)) : 0,
    ganho26: g26, ganho52: pontos[52].peso - p.pesoKg,
    treinosPlanejados12: c.treinos * 12, treinosRealizados12: Math.round(c.treinos * 12 * c.consistencia),
  };
}

/** O cenário de partida: como a pessoa está hoje (superávit 0 sobre a manutenção estimada + a tendência atual já embutida). */
export function cenarioAtualMassa(p: PerfilMassa): CenarioMassa {
  const prog: Progressao = p.acompanha === "anota" ? "sim" : p.acompanha === "nocao" ? "pouco" : "nao";
  return { superavit: Math.max(0, SALDO_TENDENCIA[p.tendencia]), treinos: p.treinos, consistencia: 0.75, progressao: prog };
}

/**
 * Os três ritmos que valem testar, como superávit sobre a manutenção
 * estimada. Iraki (2019) fala em ~10–20% de superávit para iniciantes e
 * intermediários; avançados, menos. Percentual, não kcal fixas: 250 kcal
 * são 8% para quem gasta 3.000 e 15% para quem gasta 1.600.
 */
export function ritmos(p: PerfilMassa): { id: "conservador" | "intermediario" | "rapido"; nome: string; superavit: number; descricao: string }[] {
  const avancado = nivelDe(p.experiencia, p.continuidade) === "avancado";
  const m = manutencao(p).kcal;
  const kcal = (f: number) => Math.round((m * f) / 10) * 10;
  return [
    { id: "conservador", nome: "Mais conservador", superavit: kcal(avancado ? 0.05 : 0.075), descricao: "Peso sobe devagar; menor chance de ganhar gordura à toa." },
    { id: "intermediario", nome: "Intermediário", superavit: kcal(avancado ? 0.08 : 0.125), descricao: "O ponto de partida que a literatura sugere testar." },
    { id: "rapido", nome: "Mais rápido", superavit: kcal(avancado ? 0.12 : 0.2), descricao: "Peso sobe mais rápido — mas o músculo não acompanha na mesma proporção." },
  ];
}

/* ───────────────────────── O gargalo ───────────────────────── */

export type Gargalo = "ingestao" | "monitoramento" | "treino" | "constancia" | "paciencia" | "velocidade" | "saude";

export interface Diagnostico {
  gargalo: Gargalo;
  titulo: string;
  texto: string;
  /** O que eu olharia primeiro. */
  primeiro: string;
  cta: { texto: string; mensagem: string };
}

/**
 * Regras determinísticas, na ordem de prioridade. A primeira que casa vence.
 * Nada aqui é diagnóstico médico: é "pelas suas respostas, o que parece
 * estar limitando".
 */
export function diagnostico(p: PerfilMassa, pr: ProjecaoMassa): Diagnostico {
  const semTreino = p.treinos <= 1;
  const semProgresso = p.acompanha === "nao" || p.acompanha === "nem-sei";
  const pesoParado = p.tendencia === "igual" || p.tendencia === "perdendo";
  const comeMal = p.apetite === "muita-dificuldade" || p.apetite === "cheio-rapido" || p.dificuldade === "comer";
  const inconstante = p.continuidade === "para-e-volta" || p.dificuldade === "constancia";
  const mensagemBase = "Oi, Montinho! Fiz o Simulador de Ganho de Massa no seu site e queria entender como transformar essa projeção em um plano de treino.";

  if (p.historicoPeso === "sem-querer")
    return { gargalo: "saude", titulo: "Antes de aumentar calorias, vale uma conversa", texto: "Você contou que perdeu peso sem querer. Isso não é diagnóstico de nada — mas, quando o peso cai sem intenção ou é difícil de manter, vale conversar com um profissional de saúde antes de simplesmente comer mais. O simulador segue, e o plano de treino pode andar junto.", primeiro: "Pelas suas respostas, eu não começaria pelo treino nem pela comida: começaria por entender por que o peso caiu. Depois disso, o resto fica mais fácil.", cta: { texto: "Quero organizar treino e rotina para conseguir crescer", mensagem: mensagemBase } };
  if (p.tendencia === "subindo-rapido" && pr.estadoRitmo === "acima")
    return { gargalo: "velocidade", titulo: "Seu peso já sobe — talvez rápido demais", texto: "Peso subindo acima da faixa que vale testar costuma significar mais gordura do que músculo, porque o músculo tem teto por semana. O objetivo não é fazer a balança subir o máximo possível; é dar ao corpo o que ele consegue transformar.", primeiro: "Eu olharia a cintura junto com a balança nas próximas quatro semanas. Se as duas sobem rápido, o ajuste é reduzir um pouco o superávit — não o treino.", cta: { texto: "Quero ganhar massa com uma estratégia controlada", mensagem: mensagemBase } };
  if (pesoParado && comeMal)
    return { gargalo: "ingestao", titulo: "O peso parado já respondeu: na média, a comida está na manutenção", texto: "Se a balança está igual há semanas, sua ingestão média e seu gasto estão próximos do equilíbrio — não importa quanto pareça que você come. Isso não é culpa nem “comer pouco em toda refeição”: é que, na média dos sete dias, não sobra energia para o corpo construir. Com apetite baixo, o caminho é densidade calórica e regularidade, não volume de prato.", primeiro: "Pelas suas respostas, eu não começaria complicando seu treino. Seu primeiro problema parece ser conseguir manter um ganho de peso consistente — 150 a 250 kcal a mais por dia, medido pela média semanal da balança.", cta: { texto: "Quero uma estratégia para ganhar massa", mensagem: mensagemBase } };
  if (pesoParado && p.kcalDia === null)
    return { gargalo: "monitoramento", titulo: "Você não sabe quanto come, e o peso não sobe", texto: "Não é preciso pesar comida para sempre. Mas sem uma referência — quantas calorias entram num dia comum — cada semana vira chute. O simulador partiu da manutenção estimada; a vida real precisa da média semanal da balança para confirmar.", primeiro: "Eu começaria medindo: peso de manhã 3 a 4 vezes por semana, média semanal, e uma estimativa das calorias de um dia comum. Em duas semanas você sabe se está em superávit — e para de adivinhar.", cta: { texto: "Quero uma estratégia para ganhar massa", mensagem: mensagemBase } };
  if (inconstante)
    return { gargalo: "constancia", titulo: "O plano existe; ele só não acontece com regularidade", texto: "Parar e voltar zera o principal ganho do iniciante: a progressão acumulada. Em 12 semanas com 75% de consistência, um plano de 4 treinos vira 36 realizados — e o corpo responde aos realizados.", primeiro: "Eu olharia a rotina antes do treino: um plano de 3 dias que acontece vale mais que um de 5 que não acontece.", cta: { texto: "Quero montar uma rotina que eu consiga manter", mensagem: mensagemBase } };
  if (semTreino || semProgresso)
    return { gargalo: "treino", titulo: semTreino ? "Comer mais sem estímulo vira peso, não músculo" : "Seu peso pode subir, mas seu treino não mostra progressão clara", texto: semTreino ? "O superávit dá o material; o treino de força dá o motivo para o corpo construir músculo com ele. Sem esse estímulo, a fatia magra do ganho cai." : "Hipertrofia depende de um estímulo que cresce: mais carga, mais repetições, mais séries ao longo das semanas. Se ninguém anota, ninguém sabe se cresceu.", primeiro: semTreino ? "Eu começaria por 2 a 3 treinos de força por semana, com poucos exercícios e cargas anotadas — antes de mexer mais na comida." : "Seu peso já está subindo. A prioridade agora é verificar se seu treino também está evoluindo: anote carga e repetições dos principais exercícios por 4 semanas.", cta: { texto: "Quero um treino estruturado para hipertrofia", mensagem: mensagemBase } };
  return { gargalo: "paciencia", titulo: "Pelas suas respostas, o que falta é tempo — não mais calorias", texto: "Peso subindo dentro da faixa, treino com progressão, constância razoável: esse é o cenário em que o ganho acontece. O erro mais comum aqui é apertar tudo por ansiedade e acabar com mais gordura pelo mesmo músculo.", primeiro: "Eu olharia a média semanal da balança e as cargas anotadas — e não mudaria nada por 6 a 8 semanas. Se o peso parar por 2 a 3 semanas, aí sim um pequeno ajuste de ingestão.", cta: { texto: "Quero montar meu treino com o Montinho", mensagem: mensagemBase } };
}

/* ───────────────────────── Proteína ───────────────────────── */

/** Faixa de Morton 2018 / Iraki 2019: 1,6 a 2,2 g/kg. */
export function avaliaProteina(g: number, pesoKg: number): { gkg: number; estado: "abaixo" | "na-faixa" | "acima" } {
  const gkg = g / pesoKg;
  return { gkg, estado: gkg < 1.6 ? "abaixo" : gkg <= 2.2 ? "na-faixa" : "acima" };
}

/* ───────────────────────── Marcos ───────────────────────── */

export const MARCOS_MASSA = [
  { fracao: 0.025, titulo: "Os primeiros quilos", costuma: ["A força sobe antes do espelho: cargas que travavam começam a andar.", "Parte do que entra é glicogênio e água — com creatina, mais ainda. Não é gordura; também não é músculo novo.", "Você percebe nas roupas de treino; os outros ainda não."], aindaNao: "Não espere braço nem peito diferentes. Quem procura isso na semana 3 desanima à toa." },
  { fracao: 0.05, titulo: "5% do peso: a roupa começa a apertar onde deve", costuma: ["Camiseta mais justa no ombro e nas costas; calça mais justa na coxa.", "Cintura sobe 1 a 2 cm — normal. Se subir mais que isso por mês, o ritmo está alto.", "Quem convive com você começa a notar, principalmente de lado e de costas."] },
  { fracao: 0.1, titulo: "10% do peso: outro corpo na foto", costuma: ["Comparação de fotos padronizadas mostra diferença clara.", "Numeração de camiseta pode mudar.", "Hora de reavaliar: a manutenção subiu junto com o peso, e o superávit de antes pode ter virado manutenção."] },
];

export const FONTES_MASSA = [
  { rotulo: "Iraki J, Fitschen P, Espinar S, Helms E. Nutrition Recommendations for Bodybuilders in the Off-Season: A Narrative Review. Sports, 2019;7(7):154", url: "https://pubmed.ncbi.nlm.nih.gov/31247944/", resumo: "a faixa de ganho de 0,25% a 0,5% do peso por semana com superávit de ~10–20% para iniciantes e intermediários, mais conservadora para avançados; proteína de 1,6 a 2,2 g/kg." },
  { rotulo: "Slater GJ, Dieter BP, Marsh DJ, Helms ER, Shaw G, Iraki J. Is an Energy Surplus Required to Maximize Skeletal Muscle Hypertrophy Associated With Resistance Training. Frontiers in Nutrition, 2019;6:131", url: "https://pubmed.ncbi.nlm.nih.gov/31482093/", resumo: "o tamanho exato do superávit necessário é desconhecido; superávits grandes aumentam gordura sem hipertrofia proporcional." },
  { rotulo: "Garthe I, Raastad T, Refsnes PE, Sundgot-Borgen J. Effect of nutritional intervention on body composition and performance in elite athletes. European Journal of Sport Science, 2013;13:295-303", url: "https://pubmed.ncbi.nlm.nih.gov/23679146/", resumo: "atletas com superávit maior ganharam mais peso — e mais gordura — sem mais massa magra que o grupo com ganho mais lento." },
  { rotulo: "Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass. Journal of Sports Sciences, 2017;35:1073-1082", url: "https://pubmed.ncbi.nlm.nih.gov/27433992/", resumo: "cada série semanal a mais rende um pouco mais de hipertrofia, com cerca de 10 séries por músculo por semana como ponto de referência." },
  { rotulo: "Morton RW et al. A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength. British Journal of Sports Medicine, 2018;52:376-384", url: "https://pubmed.ncbi.nlm.nih.gov/28698222/", resumo: "o benefício da proteína para massa magra satura em torno de 1,6 g/kg/dia (limite superior do intervalo, ~2,2)." },
  { rotulo: "Aragon AA. Modelo de taxa de ganho muscular por tempo de treino — Alan Aragon's Research Review", url: "https://alanaragon.com/researchreview/", resumo: "as taxas de ganho por nível (1–1,5% do peso/mês no primeiro ano, 0,5–1% depois, 0,25–0,5% em avançados) que limitam a massa magra no modelo — as mesmas da Calculadora de Potencial Natural." },
  { rotulo: "Forbes GB. Body fat content influences the body composition response to nutrition and exercise. Annals of the New York Academy of Sciences, 2000;904:359-365", url: "https://pubmed.ncbi.nlm.nih.gov/10865771/", resumo: "quem tem menos gordura tende a ganhar mais massa magra por quilo — a partição usada antes do teto." },
  { rotulo: "Hall KD et al. Quantification of the effect of energy imbalance on bodyweight. The Lancet, 2011;378:826-837", url: "https://pubmed.ncbi.nlm.nih.gov/21872751/", resumo: "o balanço energético dinâmico e a adaptação do gasto, aplicados aqui ao ganho." },
];

export const ARTIGOS_COM_LINK_SIMULADOR_MASSA: string[] = [
  "como-ganhar-peso-saudavel",
  "erros-de-quem-quer-ganhar-massa-muscular",
  "bulking-ou-cutting",
  "como-ganhar-massa-sem-ganhar-gordura",
  "o-que-impede-a-hipertrofia",
  "endomorfo-ectomorfo-mesomorfo",
];
