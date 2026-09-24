/**
 * O motor do Simulador de Emagrecimento.
 *
 * O QUE ELE RESPONDE QUE AS OUTRAS FERRAMENTAS NÃO RESPONDEM
 *
 * A Calculadora de Déficit diz quanto comer. A de Meta de Peso diz quanto
 * cabe até uma data, numa faixa percentual fixa. Nenhuma das duas responde
 * "se eu continuar assim, o que tende a acontecer?" nem "o que mais mudaria
 * minha trajetória?". Para isso é preciso simular a curva dia a dia, com o
 * gasto caindo à medida que o peso cai, e poder mexer nas variáveis de
 * comportamento: treino, passos, consistência e comida.
 *
 * O MODELO, EM UMA FRASE
 *
 * Um balanço energético dinâmico simplificado, inspirado no modelo de Hall
 * e colegas (Lancet, 2011) que sustenta o Body Weight Planner do NIH/NIDDK:
 * a cada dia, ingestão − gasto vira variação de peso; o gasto é recalculado
 * com o peso novo; e a energia de cada quilo perdido depende de quanto dele
 * é gordura e quanto é massa magra.
 *
 * AS PEÇAS, E DE ONDE VÊM
 *
 * 1. Gasto de repouso: Mifflin-St Jeor (1990), recalculado com o peso do dia.
 * 2. Rotina: um fator de atividade sobre o repouso (1,25 a 1,65), que já
 *    inclui os passos de HOJE. Só a DIFERENÇA de passos do cenário entra à
 *    parte — somar os passos atuais de novo seria contar duas vezes.
 * 3. Treino: MET × 3,5 × peso ÷ 200 × minutos, líquido (MET − 1), com os
 *    valores do Compêndio de Atividades Físicas (2024).
 * 4. Passos a mais: o custo líquido da caminhada em ritmo moderado (3,8 MET,
 *    ~100 passos/min), o mesmo valor da Calculadora de Caminhada.
 * 5. Composição do que se perde: a relação de Forbes (2000), usada por Hall
 *    — a fração de massa magra na variação de peso é 10,4 ÷ (10,4 + gordura
 *    em kg). Gordura vale ~9.440 kcal/kg; massa magra, ~1.816 kcal/kg. Por
 *    isso o "7.700 kcal = 1 kg" não aparece aqui: quem tem mais gordura
 *    perde uma mistura mais cara, e a conta muda ao longo do caminho.
 * 6. Adaptação: o gasto cai um pouco além do que o peso explica quando a
 *    ingestão cai. Hall usa β = 0,14 × a variação de ingestão; usamos o
 *    mesmo parâmetro.
 * 7. Gordura inicial: estimada pelo IMC (Deurenberg, 1991). É grosseira,
 *    mas só decide a partição de Forbes, que é pouco sensível a ela.
 *
 * CONSISTÊNCIA
 *
 * A fração de dias em que o plano acontece. Nos outros dias a pessoa come
 * o que comia antes (a manutenção inicial) e treina/anda como antes. É
 * esse número que traduz "um dia ruim não destrói o processo": 75% ainda
 * emagrece; o que trava é a consistência despencar por semanas.
 *
 * O QUE O MODELO NÃO FAZ, DE PROPÓSITO
 *
 * - Não muda a curva por medicamento nem por hormônio. Eles mudam apetite e
 *   composição de formas que variam demais de pessoa para pessoa, e somar
 *   "X kg a mais" seria inventar. O que a pessoa informa muda a leitura do
 *   resultado, não o número.
 * - Não modela a água e o glicogênio das primeiras semanas (a balança cai
 *   mais rápido no começo). O texto avisa.
 * - Não modela compensação de apetite quando o treino aumenta.
 * - Não passa de 52 semanas: processo real tem platô, pausa e vida.
 *
 * A INCERTEZA
 *
 * O gasto de duas pessoas iguais no papel varia. A faixa roda o mesmo
 * cenário com o gasto 5% abaixo e 5% acima. A data de chegada vira uma
 * faixa de semanas, nunca um dia.
 */

import { RITMOS as RITMOS_CAMINHADA } from "../caminhada";
import { metCorrida } from "../corrida";
import { kcalPorMinuto } from "../polichinelo";
import { MET_AULA as MET_SPINNING } from "../spinning";
import { MET_WOD } from "../crossfit";
import { NADOS } from "../natacao";
import { AULAS as AULAS_BOXE } from "../boxe";
import { ESTILOS as ESTILOS_DANCA } from "../danca";

/* ───────────────────────── Tipos ───────────────────────── */

export type Sexo = "m" | "f";
export type Objetivo = "peso" | "gordura" | "composicao" | "nao-sei";
export type Rotina = "sentado" | "em-pe" | "ativo" | "fisico";
export type TipoTreino =
  | "musculacao" | "corrida" | "caminhada" | "bike" | "natacao" | "crossfit" | "lutas" | "danca"
  | "pilates" | "yoga" | "esportes" | "funcional" | "combinacao" | "outro";
export type FaixaPassos = "lt3" | "3a5" | "5a75" | "75a10" | "gt10" | "nao-sei";
export type NivelComida = "hoje" | "leve" | "moderado" | "firme";
export type Medicacao = "nao" | "tirzepatida" | "semaglutida" | "retatrutida" | "liraglutida" | "outra" | "nao-informar";
export type Hormonio = "nao" | "reposicao" | "desempenho" | "outro" | "nao-informar";

export interface Perfil {
  idade: number;
  sexo: Sexo;
  alturaCm: number;
  pesoKg: number;
  /** null = sem meta de peso. */
  metaKg: number | null;
  rotina: Rotina;
  treinos: number;
  /** Pode ser mais de um; vazio = musculação (o padrão conservador). */
  tiposTreino: TipoTreino[];
  passos: FaixaPassos;
  /** null = não sabe. */
  kcalDia: number | null;
}

export interface Cenario {
  treinos: number;
  passos: number;
  /** 0 a 1. */
  consistencia: number;
  comida: NivelComida;
}

/* ───────────────────────── Constantes ───────────────────────── */

export const IDADE_MIN = 18;
export const IDADE_MAX = 90;
export const ALTURA_MIN = 130;
export const ALTURA_MAX = 220;
export const PESO_MIN = 35;
export const PESO_MAX = 300;
export const KCAL_MIN = 800;
export const KCAL_MAX = 6000;
export const IMC_MIN_META = 18.5;
export const SEMANAS_MAX = 52;

export const FATOR_ROTINA: Record<Rotina, number> = { sentado: 1.25, "em-pe": 1.4, ativo: 1.55, fisico: 1.7 };

/** Passos do meio de cada faixa. "Não sei" vira 5.000, o meio da população urbana adulta. */
export const PASSOS_FAIXA: Record<FaixaPassos, number> = { lt3: 2500, "3a5": 4000, "5a75": 6250, "75a10": 8750, gt10: 11000, "nao-sei": 5000 };

/** MET e minutos por sessão de cada tipo de treino (Compêndio 2024). */
export const TREINO: Record<TipoTreino, { met: number; minutos: number; rotulo: string }> = {
  /* 02054: musculação, vários exercícios, 8–15 repetições, 3,5 MET. */
  musculacao: { met: 3.5, minutos: 60, rotulo: "musculação" },
  corrida: { met: metCorrida(9), minutos: 40, rotulo: "corrida" },
  caminhada: { met: RITMOS_CAMINHADA.find((r) => r.id === "moderado")!.met, minutos: 50, rotulo: "caminhada" },
  /* Os METs abaixo vêm das calculadoras próprias do site, para não discordarem delas. */
  bike: { met: MET_SPINNING, minutos: 45, rotulo: "bike/spinning" },
  natacao: { met: NADOS.find((n) => n.id === "crawl-leve")!.met, minutos: 45, rotulo: "natação" },
  /* A aula de CrossFit não é WOD o tempo todo: ~20 min de WOD e o resto em técnica/força (3,5). */
  crossfit: { met: (MET_WOD * 20 + 3.5 * 40) / 60, minutos: 60, rotulo: "CrossFit" },
  lutas: { met: AULAS_BOXE.find((a) => a.id === "saco")!.met, minutos: 60, rotulo: "luta" },
  danca: { met: ESTILOS_DANCA.find((e) => e.id === "forro")!.met, minutos: 60, rotulo: "dança" },
  /* Compêndio 2024: 02105, pilates de solo, 3,0 MET; 02150, yoga hatha, 2,5 MET. */
  pilates: { met: 3.0, minutos: 55, rotulo: "pilates" },
  yoga: { met: 2.5, minutos: 60, rotulo: "yoga" },
  /* Esportes e funcional variam muito; usa o valor conservador da musculação. */
  esportes: { met: 3.5, minutos: 60, rotulo: "esporte" },
  funcional: { met: 3.5, minutos: 50, rotulo: "treino funcional" },
  combinacao: { met: 3.5, minutos: 60, rotulo: "treino" },
  outro: { met: 3.5, minutos: 50, rotulo: "treino" },
};

/** O treino "médio" da pessoa: média de MET e de minutos dos tipos que ela marcou. */
export function perfilTreino(tipos: TipoTreino[]): { met: number; minutos: number; rotulo: string } {
  const lista = tipos.length ? tipos : ["musculacao" as TipoTreino];
  const met = lista.reduce((a, t) => a + TREINO[t].met, 0) / lista.length;
  const minutos = lista.reduce((a, t) => a + TREINO[t].minutos, 0) / lista.length;
  const rotulo = lista.length === 1 ? TREINO[lista[0]].rotulo : lista.map((t) => TREINO[t].rotulo).join(" + ");
  return { met, minutos, rotulo };
}

const MET_PASSO = RITMOS_CAMINHADA.find((r) => r.id === "moderado")!.met;
const PASSOS_POR_MIN = 100;

export const DEFICIT_NIVEL: Record<Exclude<NivelComida, "hoje">, number> = { leve: 0.1, moderado: 0.2, firme: 0.25 };
/** Quando a pessoa informa quanto come, os níveis viram cortes em kcal sobre o que ela informou. */
export const CORTE_NIVEL_KCAL: Record<Exclude<NivelComida, "hoje">, number> = { leve: 250, moderado: 450, firme: 650 };

export const ENERGIA_GORDURA = 9440;
export const ENERGIA_MAGRA = 1816;
export const FORBES_C = 10.4;
export const BETA_ADAPTACAO = 0.14;
export const INCERTEZA = 0.05;

/* ───────────────────────── Entrada ───────────────────────── */

/** Aceita "82,5", "82.5", " 82 kg ". Devolve null para o resto — nunca NaN. */
export function parseNumero(t: string): number | null {
  const limpo = t.replace(/[^\d.,-]/g, "").replace(",", ".");
  if (!limpo || limpo === "." || limpo === "-") return null;
  const n = Number(limpo);
  return Number.isFinite(n) ? n : null;
}

/** Altura em cm; aceita "1,75" (metros) e "175". */
export function parseAltura(t: string): number | null {
  const n = parseNumero(t);
  if (n === null) return null;
  return n > 0 && n < 3 ? Math.round(n * 100) : n;
}

export const imc = (pesoKg: number, alturaCm: number) => pesoKg / (alturaCm / 100) ** 2;
export const pesoNoImc = (valorImc: number, alturaCm: number) => valorImc * (alturaCm / 100) ** 2;

/* ───────────────────────── Guardrails ───────────────────────── */

export type Bloqueio =
  | { tipo: "menor" }
  | { tipo: "gestacao" }
  | { tipo: "imc-baixo" }
  | { tipo: "meta-baixa"; minimoKg: number };

export interface ErroCampo { campo: "idade" | "altura" | "peso" | "meta" | "kcal"; mensagem: string }

export function validaBasicos(idade: number | null, alturaCm: number | null, pesoKg: number | null): ErroCampo[] {
  const e: ErroCampo[] = [];
  if (idade === null) e.push({ campo: "idade", mensagem: "Informe sua idade em anos." });
  else if (idade < 10 || idade > IDADE_MAX) e.push({ campo: "idade", mensagem: `Confira a idade: ela precisa estar entre ${IDADE_MIN} e ${IDADE_MAX} anos.` });
  if (alturaCm === null) e.push({ campo: "altura", mensagem: "Informe sua altura, em cm (ex.: 170) ou metros (ex.: 1,70)." });
  else if (alturaCm < ALTURA_MIN || alturaCm > ALTURA_MAX) e.push({ campo: "altura", mensagem: `Confira a altura: aceitamos de ${ALTURA_MIN} a ${ALTURA_MAX} cm.` });
  if (pesoKg === null) e.push({ campo: "peso", mensagem: "Informe seu peso atual em kg." });
  else if (pesoKg < PESO_MIN || pesoKg > PESO_MAX) e.push({ campo: "peso", mensagem: `Confira o peso: aceitamos de ${PESO_MIN} a ${PESO_MAX} kg.` });
  return e;
}

/** Situações em que uma projeção automática não é o caminho. */
export function bloqueio(idade: number, gestante: boolean, pesoKg: number, alturaCm: number): Bloqueio | null {
  if (idade < IDADE_MIN) return { tipo: "menor" };
  if (gestante) return { tipo: "gestacao" };
  if (imc(pesoKg, alturaCm) < IMC_MIN_META) return { tipo: "imc-baixo" };
  return null;
}

export function validaMeta(metaKg: number | null, pesoKg: number, alturaCm: number): ErroCampo | Bloqueio | null {
  if (metaKg === null) return { campo: "meta", mensagem: "Informe a meta em kg, ou marque que não tem uma." };
  if (metaKg >= pesoKg) return { campo: "meta", mensagem: "A meta precisa ser menor que o peso atual. Se o seu objetivo é mudar a composição sem perder peso, marque “Não tenho uma meta de peso”." };
  if (pesoKg - metaKg < 0.5) return { campo: "meta", mensagem: "A diferença é pequena demais para projetar. Marque “Não tenho uma meta de peso” para ver a trajetória." };
  const minimo = Math.ceil(pesoNoImc(IMC_MIN_META, alturaCm));
  if (metaKg < minimo) return { tipo: "meta-baixa", minimoKg: minimo };
  return null;
}

/* ───────────────────────── Fisiologia ───────────────────────── */

export function repouso(p: Pick<Perfil, "sexo" | "idade" | "alturaCm">, pesoKg: number): number {
  return 10 * pesoKg + 6.25 * p.alturaCm - 5 * p.idade + (p.sexo === "m" ? 5 : -161);
}

/** Percentual de gordura pelo IMC (Deurenberg 1991), limitado a 8–60%. */
export function gorduraInicialKg(p: Pick<Perfil, "sexo" | "idade" | "alturaCm" | "pesoKg">): number {
  const pct = 1.2 * imc(p.pesoKg, p.alturaCm) + 0.23 * p.idade - 10.8 * (p.sexo === "m" ? 1 : 0) - 5.4;
  return (p.pesoKg * Math.min(60, Math.max(8, pct))) / 100;
}

export const kcalTreinoDia = (tipos: TipoTreino[], sessoesSemana: number, pesoKg: number) => {
  const t = perfilTreino(tipos);
  return (sessoesSemana * kcalPorMinuto(t.met - 1, pesoKg) * t.minutos) / 7;
};

/** kcal/min de um treino a um MET líquido dado — a mesma conta das calculadoras do site. */
export const kcalPorMinutoTreino = (metLiquido: number, pesoKg: number) => kcalPorMinuto(metLiquido, pesoKg);

export const kcalPassosExtra = (passosExtra: number, pesoKg: number) =>
  (kcalPorMinuto(MET_PASSO - 1, pesoKg) * passosExtra) / PASSOS_POR_MIN;

/** O gasto de hoje, com a rotina e o treino que a pessoa tem hoje. */
export function manutencaoInicial(p: Perfil): number {
  return repouso(p, p.pesoKg) * FATOR_ROTINA[p.rotina] + kcalTreinoDia(p.tiposTreino, p.treinos, p.pesoKg);
}

/** O que a pessoa come nos dias em que o plano acontece. */
export function ingestaoPlano(p: Perfil, comida: NivelComida): { kcal: number; noPiso: boolean } {
  const manut = manutencaoInicial(p);
  let alvo: number;
  if (p.kcalDia !== null) alvo = comida === "hoje" ? p.kcalDia : p.kcalDia - CORTE_NIVEL_KCAL[comida];
  else alvo = manut * (1 - DEFICIT_NIVEL[comida === "hoje" ? "moderado" : comida]);
  const piso = Math.max(repouso(p, p.pesoKg), p.sexo === "m" ? 1500 : 1200);
  return alvo < piso ? { kcal: piso, noPiso: true } : { kcal: alvo, noPiso: false };
}

/* ───────────────────────── Simulação ───────────────────────── */

export interface Ponto { semana: number; peso: number; min: number; max: number }

export interface Projecao {
  pontos: Ponto[];
  /** Semana (fracionária) em que a trajetória central cruza a meta; null se não cruza em 52. */
  semanaMeta: number | null;
  faixaMeta: { min: number; max: number } | null;
  ingestaoPlano: number;
  noPiso: boolean;
  manutencao: number;
  /** Perda média por semana nas primeiras 12 semanas, em kg. */
  ritmo12: number;
  /** Variação nas 52 semanas, trajetória central. */
  perda52: number;
}

function roda(p: Perfil, c: Cenario, fatorGasto: number): { semanal: number[]; cruzaDia: number | null } {
  const manut0 = manutencaoInicial(p);
  const { kcal: plano } = ingestaoPlano(p, c.comida);
  const passosHoje = PASSOS_FAIXA[p.passos];
  const passosExtra = Math.max(0, c.passos - passosHoje);
  const menosPassos = Math.max(0, passosHoje - c.passos);
  let peso = p.pesoKg;
  let gordura = gorduraInicialKg(p);
  const semanal = [peso];
  let cruzaDia: number | null = null;
  const ingestao = c.consistencia * plano + (1 - c.consistencia) * manut0;
  const adaptacao = BETA_ADAPTACAO * (ingestao - manut0);
  for (let dia = 1; dia <= SEMANAS_MAX * 7; dia++) {
    const base = repouso(p, peso) * FATOR_ROTINA[p.rotina];
    const extrasPlano = kcalTreinoDia(p.tiposTreino, c.treinos, peso) + kcalPassosExtra(passosExtra, peso) - kcalPassosExtra(menosPassos, peso);
    const extrasHoje = kcalTreinoDia(p.tiposTreino, p.treinos, peso);
    const gasto = (base + c.consistencia * extrasPlano + (1 - c.consistencia) * extrasHoje) * fatorGasto + adaptacao;
    const saldo = ingestao - gasto;
    const fracMagra = FORBES_C / (FORBES_C + Math.max(gordura, 1));
    const densidade = fracMagra * ENERGIA_MAGRA + (1 - fracMagra) * ENERGIA_GORDURA;
    const dPeso = saldo / densidade;
    const antes = peso;
    peso += dPeso;
    gordura += dPeso * (1 - fracMagra);
    if (cruzaDia === null && p.metaKg !== null && antes > p.metaKg && peso <= p.metaKg) {
      cruzaDia = dia - 1 + (antes - p.metaKg) / (antes - peso);
    }
    if (dia % 7 === 0) semanal.push(peso);
  }
  return { semanal, cruzaDia };
}

export function projeta(p: Perfil, c: Cenario): Projecao {
  const centro = roda(p, c, 1);
  /* Gasto mais baixo = perde mais devagar = curva de cima. */
  const lento = roda(p, c, 1 - INCERTEZA);
  const rapido = roda(p, c, 1 + INCERTEZA);
  const pontos = centro.semanal.map((peso, semana) => ({
    semana, peso,
    min: Math.min(rapido.semanal[semana], lento.semanal[semana]),
    max: Math.max(rapido.semanal[semana], lento.semanal[semana]),
  }));
  const semanaMeta = centro.cruzaDia === null ? null : centro.cruzaDia / 7;
  const faixaMeta = semanaMeta === null ? null : {
    min: (rapido.cruzaDia ?? centro.cruzaDia!) / 7,
    max: lento.cruzaDia === null ? Infinity : lento.cruzaDia / 7,
  };
  const ing = ingestaoPlano(p, c.comida);
  return {
    pontos, semanaMeta, faixaMeta,
    ingestaoPlano: ing.kcal, noPiso: ing.noPiso,
    manutencao: manutencaoInicial(p),
    ritmo12: (p.pesoKg - centro.semanal[12]) / 12,
    perda52: p.pesoKg - centro.semanal[SEMANAS_MAX],
  };
}

/** O cenário "como estou": a rotina que a pessoa descreveu, 75% de consistência, comida moderada. */
export function cenarioAtual(p: Perfil): Cenario {
  return { treinos: p.treinos, passos: PASSOS_FAIXA[p.passos], consistencia: 0.75, comida: p.kcalDia !== null ? "hoje" : "moderado" };
}

/* ───────────────────────── O que mais muda ───────────────────────── */

export type Alavanca = "treino" | "passos" | "consistencia";

export interface Impacto { alavanca: Alavanca; descricao: string; ganho: number; unidade: "semanas" | "kg" }

/**
 * Testa três mudanças pequenas e plausíveis e mede quanto cada uma muda a
 * projeção: semanas a menos até a meta ou, sem meta, quilos a mais em 12
 * semanas. Não inclui comida porque a comida é a alavanca óbvia e o
 * simulador já deixa a pessoa mexer nela; a pergunta aqui é qual HÁBITO
 * pesa mais.
 */
export function impactos(p: Perfil, c: Cenario): Impacto[] {
  const base = projeta(p, c);
  /* Com meta alcançada, mede semanas poupadas; sem isso, quilos a mais num horizonte fixo. */
  const emSemanas = p.metaKg !== null && base.semanaMeta !== null;
  const horizonte = 12;
  const testes: { alavanca: Alavanca; descricao: string; c: Cenario }[] = [];
  if (c.treinos < 6) testes.push({ alavanca: "treino", descricao: `treinar ${c.treinos + 1}x por semana em vez de ${c.treinos}x`, c: { ...c, treinos: c.treinos + 1 } });
  if (c.passos < 12500) testes.push({ alavanca: "passos", descricao: "andar cerca de 2.500 passos a mais por dia", c: { ...c, passos: c.passos + 2500 } });
  if (c.consistencia < 1) {
    const nova = Math.min(1, Math.round((c.consistencia + 0.15) * 100) / 100);
    testes.push({ alavanca: "consistencia", descricao: `subir a consistência de ${Math.round(c.consistencia * 100)}% para ${Math.round(nova * 100)}%`, c: { ...c, consistencia: nova } });
  }
  return testes
    .map((t) => {
      const pr = projeta(p, t.c);
      const ganho = emSemanas
        ? base.semanaMeta! - (pr.semanaMeta ?? base.semanaMeta!)
        : base.pontos[horizonte].peso - pr.pontos[horizonte].peso;
      return { alavanca: t.alavanca, descricao: t.descricao, ganho, unidade: (emSemanas ? "semanas" : "kg") as Impacto["unidade"] };
    })
    .sort((x, y) => y.ganho - x.ganho);
}

/** O insight só aparece quando a conta sustenta: um vencedor claro e relevante. */
export function insight(lista: Impacto[]): { vencedor: Impacto; segundo: Impacto | null } | null {
  if (lista.length === 0) return null;
  const [v, s] = lista;
  const minimo = v.unidade === "semanas" ? 1 : 0.3;
  if (v.ganho < minimo) return null;
  if (s && s.ganho > 0 && v.ganho < s.ganho * 1.25) return null;
  return { vencedor: v, segundo: s ?? null };
}

/* ───────────────────────── Formatação ───────────────────────── */

export const fmtKg = (n: number) => `${n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
/** Peso da trajetória: arredonda para 0,5 kg — a projeção não tem precisão de 100 g. */
export const fmtKgProj = (n: number) => fmtKg(Math.round(n * 2) / 2);

export function fmtSemanas(s: number): string {
  const n = Math.max(1, Math.round(s));
  if (n < 9) return `${n} ${n === 1 ? "semana" : "semanas"}`;
  const meses = Math.round((n / 4.345) * 2) / 2;
  return `${meses.toLocaleString("pt-BR")} ${meses === 1 ? "mês" : "meses"}`;
}

export function fmtFaixaSemanas(f: { min: number; max: number }): string {
  if (!Number.isFinite(f.max) || f.max > SEMANAS_MAX) return `${Math.round(f.min)} semanas ou mais`;
  const a = Math.round(f.min), b = Math.round(f.max);
  return a === b ? `cerca de ${a} semanas` : `entre ${a} e ${b} semanas`;
}

/* ───────────────────────── Estudos com medicamentos ───────────────────────── */

/**
 * O que ensaios clínicos observaram. NÃO entra na simulação: é um bloco
 * separado, com população, duração e dose, para a pessoa não confundir
 * média de ensaio com previsão individual.
 */
export interface Estudo {
  id: "tirzepatida" | "semaglutida" | "retatrutida" | "liraglutida";
  substancia: string;
  marcas: string;
  estudo: string;
  populacao: string;
  duracao: string;
  dose: string;
  resultado: string;
  comparacao: string;
  url: string;
  referencia: string;
}

export const ESTUDOS: Estudo[] = [
  {
    id: "tirzepatida",
    substancia: "Tirzepatida",
    marcas: "ex.: Mounjaro",
    estudo: "SURMOUNT-1",
    populacao: "2.539 adultos com obesidade ou sobrepeso com ao menos uma comorbidade, sem diabetes",
    duracao: "72 semanas",
    dose: "5, 10 ou 15 mg por semana, com dieta e atividade física orientadas",
    resultado: "perda média de 15,0%, 19,5% e 20,9% do peso, conforme a dose",
    comparacao: "3,1% no grupo placebo",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2206038",
    referencia: "Jastreboff AM et al. Tirzepatide Once Weekly for the Treatment of Obesity. N Engl J Med, 2022;387:205-216",
  },
  {
    id: "semaglutida",
    substancia: "Semaglutida 2,4 mg",
    marcas: "ex.: Wegovy",
    estudo: "STEP 1",
    populacao: "1.961 adultos com IMC ≥ 30, ou ≥ 27 com comorbidade, sem diabetes",
    duracao: "68 semanas",
    dose: "2,4 mg por semana, com orientação de estilo de vida",
    resultado: "perda média de 14,9% do peso",
    comparacao: "2,4% no grupo placebo",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2032183",
    referencia: "Wilding JPH et al. Once-Weekly Semaglutide in Adults with Overweight or Obesity. N Engl J Med, 2021;384:989-1002",
  },
  {
    id: "retatrutida",
    substancia: "Retatrutida",
    marcas: "ainda sem marca comercial: em estudo de fase 3 na data desta revisão",
    estudo: "fase 2 (NEJM 2023)",
    populacao: "338 adultos com IMC ≥ 30, ou ≥ 27 com comorbidade, sem diabetes",
    duracao: "48 semanas",
    dose: "1 a 12 mg por semana, com orientação de estilo de vida",
    resultado: "perda média de 24,2% do peso na dose de 12 mg (17,3% com 4 mg)",
    comparacao: "2,1% no grupo placebo",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2301972",
    referencia: "Jastreboff AM et al. Triple-Hormone-Receptor Agonist Retatrutide for Obesity — A Phase 2 Trial. N Engl J Med, 2023;389:514-526",
  },
  {
    id: "liraglutida",
    substancia: "Liraglutida 3,0 mg",
    marcas: "ex.: Saxenda",
    estudo: "SCALE Obesity and Prediabetes",
    populacao: "3.731 adultos com IMC ≥ 30, ou ≥ 27 com comorbidade, sem diabetes",
    duracao: "56 semanas",
    dose: "3,0 mg por dia, com orientação de estilo de vida",
    resultado: "perda média de 8,0% do peso",
    comparacao: "2,6% no grupo placebo",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1411892",
    referencia: "Pi-Sunyer X et al. A Randomized, Controlled Trial of 3.0 mg of Liraglutide in Weight Management. N Engl J Med, 2015;373:11-22",
  },
];

export const FONTES = [
  { rotulo: "Hall KD, Sacks G, Chandramohan D, et al. Quantification of the effect of energy imbalance on bodyweight. The Lancet, 2011;378:826-837", url: "https://pubmed.ncbi.nlm.nih.gov/21872751/", resumo: "o modelo dinâmico por trás do Body Weight Planner do NIH/NIDDK; de onde vêm a adaptação (β = 0,14) e as energias de gordura e massa magra." },
  { rotulo: "NIDDK. Body Weight Planner", url: "https://www.niddk.nih.gov/bwp", resumo: "a ferramenta pública do NIH que implementa o modelo completo." },
  { rotulo: "Forbes GB. Body fat content influences the body composition response to nutrition and exercise. Annals of the New York Academy of Sciences, 2000;904:359-365", url: "https://pubmed.ncbi.nlm.nih.gov/10865771/", resumo: "a relação que diz quanto do peso perdido tende a ser massa magra, conforme a gordura inicial." },
  { rotulo: "Mifflin MD, St Jeor ST, et al. A new predictive equation for resting energy expenditure in healthy individuals. American Journal of Clinical Nutrition, 1990;51:241-247", url: "https://pubmed.ncbi.nlm.nih.gov/2305711/", resumo: "a equação do gasto de repouso, recalculada com o peso de cada dia." },
  { rotulo: "Deurenberg P, Weststrate JA, Seidell JC. Body mass index as a measure of body fatness. British Journal of Nutrition, 1991;65:105-114", url: "https://pubmed.ncbi.nlm.nih.gov/2043597/", resumo: "a estimativa inicial de gordura pelo IMC, usada só para a partição de Forbes." },
  { rotulo: "Herrmann SD, Willis EA, Ainsworth BE, et al. 2024 Adult Compendium of Physical Activities. Journal of Sport and Health Science, 2024", url: "https://pacompendium.com/adult-compendium/", resumo: "os METs de treino (musculação 3,5, código 02054) e de caminhada." },
];

export const NOTA_ESTIMATIVA = "Isso é uma estimativa, não uma promessa. Corpos diferentes respondem de formas diferentes, e o gasto real pode ficar acima ou abaixo do calculado.";
export const NOTA_PRIMEIRAS_SEMANAS = "Nas primeiras semanas a balança costuma cair mais rápido que a curva, porque sai água e glicogênio junto com gordura. Depois o ritmo se acomoda.";

/* ───────────────────────── Onde aparece ───────────────────────── */

/**
 * Artigos que recebem o convite (variante de LINK, não o simulador
 * embutido). São os que terminam com a pergunta "e no meu caso, quanto
 * tempo?" sem outra ferramenta registrada: `quanto-tempo-para-emagrecer`
 * já carrega a Meta de Peso e fica com ela (uma ferramenta por artigo).
 */
export const ARTIGOS_COM_LINK_SIMULADOR: string[] = [
  "quantos-kg-perder-por-mes",
  "quantos-quilos-da-para-perder-por-mes",
  "plato-do-emagrecimento-como-quebrar",
  "como-continuar-emagrecendo-sem-perder-motivacao",
];
