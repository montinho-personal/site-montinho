/**
 * O motor do Simulador do Fim de Semana.
 *
 * A PERGUNTA
 *
 * "Faço tudo certo de segunda a sexta. O sábado e o domingo estão anulando
 * a minha semana?" A resposta é o saldo dos sete dias: o corpo não
 * reinicia na segunda-feira. Não existe "segunda a sexta conta, fim de
 * semana não".
 *
 * DUAS CAMADAS, SEPARADAS DE PROPÓSITO
 *
 * A — SALDO DA SEMANA (kcal). Aritmética sobre as premissas: o que se
 *     comeu em cada dia menos a manutenção, com o ajuste de movimento no
 *     sábado e no domingo. Sai sempre como faixa, porque a manutenção é
 *     estimada (±10%; ±5% quando a pessoa informa) e a caloria de uma
 *     pizza depende de tamanho, massa e sabor.
 * B — PROJEÇÃO DE PESO ("e se todo fim de semana fosse assim?"). A
 *     ingestão média dos sete dias entra num balanço dinâmico (a mesma
 *     física do Simulador de Emagrecimento: Mifflin-St Jeor, partição de
 *     Forbes, energia de 1.816 kcal/kg de massa magra e 9.440 kcal/kg de
 *     gordura, gasto recalculado com o peso). Nunca 7.700 kcal = 1 kg.
 *
 * O "QUANTO DO DÉFICIT SOBROU"
 *
 *   construído = 5 × (ingestão de dia útil − manutenção)
 *   saldo      = Σ dos 7 dias
 *   consumido  = saldo − construído   (o que sexta à noite, sábado e
 *                                      domingo fizeram com o construído)
 *   preservado = saldo ÷ construído, entre 0 e 1, só quando os dias úteis
 *                criaram déficit
 *
 * O QUE ELE SE RECUSA A FAZER
 *
 * Dizer quantos gramas de gordura a pessoa ganhou; converter a balança de
 * segunda em gordura; mudar a conta por causa de caneta ou hormônio;
 * sugerir compensação (jejum, cardio punitivo, cortar comida). Quem conta
 * que compensa assim recebe uma mensagem de segurança, e esse cenário
 * nunca aparece como sugestão.
 *
 * Tudo roda no navegador. Diagnóstico por regras fixas, nunca por IA.
 */

import { ENERGIA_GORDURA, ENERGIA_MAGRA, FATOR_ROTINA, FORBES_C, INCERTEZA, gorduraInicialKg, kcalPassosExtra, repouso, type Rotina, type Sexo } from "./emagrecimento";

export { parseNumero, parseAltura, validaBasicos, IDADE_MIN, PESO_MIN, PESO_MAX, KCAL_MIN, KCAL_MAX } from "./emagrecimento";
export type { Rotina, Sexo };

/* ───────────────────────── Tipos ───────────────────────── */

export type ObjetivoFds = "emagrecer" | "manter" | "composicao" | "entender" | "massa";
export type Modo = "sei" | "nao-sei";
export type DiaFds = "sexta" | "sabado" | "domingo";
/** Como a pessoa descreve um dia do fim de semana, comparado com os dias úteis. */
export type Padrao = "igual" | "pouco" | "refeicao" | "varias" | "muito" | "varia";
export type ComoCome = "plano" | "cuidado" | "normal";
export type SextaNoite = "sim" | "nao" | "as-vezes";
export type Movimento = "muito-menos" | "pouco-menos" | "parecido" | "pouco-mais" | "muito-mais" | "nao-sei";
export type Compensa = "nao" | "segunda-menos" | "jejum" | "cardio-longo";
export type Medicacao = "nao" | "tirzepatida" | "semaglutida" | "liraglutida" | "outra" | "nao-informar";

export type Faixa = { min: number; mid: number; max: number };
const F = (min: number, max: number): Faixa => ({ min, max, mid: (min + max) / 2 });
const soma = (...fs: Faixa[]): Faixa => fs.reduce((a, b) => ({ min: a.min + b.min, mid: a.mid + b.mid, max: a.max + b.max }), F(0, 0));
const escala = (f: Faixa, k: number): Faixa => (k >= 0 ? { min: f.min * k, mid: f.mid * k, max: f.max * k } : { min: f.max * k, mid: f.mid * k, max: f.min * k });

/* ───────────────────────── O construtor ───────────────────────── */

export type Grupo = "refeicao" | "extra" | "bebida";
export interface Item { id: string; rotulo: string; unidade: string; grupo: Grupo; kcal: [number, number]; nota?: string }

/**
 * Faixas por unidade, nunca um número único. Refeição SUBSTITUI uma
 * refeição comum (o extra é a diferença); extra e bebida SOMAM inteiros.
 * Bebidas: volume × teor alcoólico × 0,789 g/ml × 7 kcal/g, mais o
 * carboidrato da bebida ou do misturador — por isso a faixa.
 */
export const ITENS: Item[] = [
  { id: "pizza", rotulo: "Pizza", unidade: "fatia", grupo: "refeicao", kcal: [200, 350], nota: "Fatia de pizza grande; muda com massa, borda e cobertura." },
  { id: "hamburguer", rotulo: "Hambúrguer", unidade: "lanche", grupo: "refeicao", kcal: [550, 1000], nota: "Artesanal com queijo; batata conta à parte, em petiscos." },
  { id: "churrasco", rotulo: "Churrasco", unidade: "prato cheio", grupo: "refeicao", kcal: [700, 1300], nota: "Carnes com gordura, pão de alho, farofa e acompanhamentos." },
  { id: "japones", rotulo: "Comida japonesa / rodízio", unidade: "refeição", grupo: "refeicao", kcal: [700, 1500], nota: "Hot roll, cream cheese e temaki empurram para cima; sashimi, para baixo." },
  { id: "restaurante", rotulo: "Restaurante", unidade: "prato", grupo: "refeicao", kcal: [700, 1200] },
  { id: "brunch", rotulo: "Café da manhã / brunch", unidade: "refeição", grupo: "refeicao", kcal: [500, 1000] },
  { id: "delivery", rotulo: "Delivery", unidade: "pedido individual", grupo: "refeicao", kcal: [800, 1500] },
  { id: "sobremesa", rotulo: "Sobremesa", unidade: "porção", grupo: "extra", kcal: [250, 500] },
  { id: "sorvete", rotulo: "Sorvete", unidade: "bola", grupo: "extra", kcal: [120, 200] },
  { id: "salgados", rotulo: "Salgados", unidade: "unidade", grupo: "extra", kcal: [150, 300] },
  { id: "petiscos", rotulo: "Petiscos", unidade: "porção individual", grupo: "extra", kcal: [300, 600], nota: "Batata frita, amendoim, frios, torresmo." },
  { id: "refrigerante", rotulo: "Refrigerante", unidade: "lata 350 ml", grupo: "extra", kcal: [135, 150], nota: "Versão com açúcar. Zero fica perto de zero." },
  { id: "cerveja", rotulo: "Cerveja", unidade: "lata 350 ml", grupo: "bebida", kcal: [140, 160] },
  { id: "chope", rotulo: "Chope", unidade: "copo 300 ml", grupo: "bebida", kcal: [120, 145] },
  { id: "vinho", rotulo: "Vinho", unidade: "taça 150 ml", grupo: "bebida", kcal: [115, 135] },
  { id: "destilado", rotulo: "Destilado puro", unidade: "dose 50 ml", grupo: "bebida", kcal: [105, 120], nota: "Vodca, cachaça, gin, uísque a ~40%." },
  { id: "drink", rotulo: "Drink / caipirinha", unidade: "copo", grupo: "bebida", kcal: [180, 350], nota: "O açúcar e o misturador decidem: caipirinha de açúcar fica no alto; gin com tônica zero, no baixo." },
  { id: "outro", rotulo: "Outro", unidade: "item", grupo: "extra", kcal: [200, 400] },
];
export const item = (id: string) => ITENS.find((i) => i.id === id) ?? ITENS[ITENS.length - 1];

export interface Evento { uid: string; dia: DiaFds; itemId: string; qtd: number; /** kcal da unidade, quando a pessoa sabe. */ kcalManual: number | null }

export function kcalEvento(e: Evento): Faixa {
  const it = item(e.itemId);
  const q = Math.max(0, e.qtd);
  if (e.kcalManual !== null && e.kcalManual >= 0) return F(e.kcalManual * q, e.kcalManual * q);
  return F(it.kcal[0] * q, it.kcal[1] * q);
}

/* ───────────────────────── Premissas por resposta ───────────────────────── */

/** Extra em relação a um dia útil, por padrão descrito. Faixas largas de propósito. */
export const EXTRA_PADRAO: Record<Padrao, Faixa> = {
  igual: F(0, 0),
  pouco: F(150, 450),
  refeicao: F(400, 1000),
  varias: F(900, 1900),
  muito: F(1500, 3000),
  varia: F(300, 1800),
};
export const EXTRA_SEXTA: Record<SextaNoite, Faixa> = { sim: F(300, 900), "as-vezes": F(0, 600), nao: F(0, 0) };
/** Déficit dos dias úteis quando a pessoa não conta calorias. */
export const DEFICIT_COMO_COME: Record<ComoCome, number> = { plano: 0.2, cuidado: 0.1, normal: 0 };
/** Passos a mais (ou a menos) em cada dia do fim de semana. */
export const PASSOS_MOVIMENTO: Record<Movimento, number> = { "muito-menos": -4000, "pouco-menos": -2000, parecido: 0, "pouco-mais": 2000, "muito-mais": 5000, "nao-sei": 0 };
/** A refeição comum que uma refeição do construtor substitui: 30% do dia útil. */
export const FRACAO_REFEICAO = 0.3;
export const INCERTEZA_ESTIMADA = 0.1;
export const INCERTEZA_INFORMADA = INCERTEZA;
/** Abaixo disso, sem sinal claro: "perto da manutenção". */
export const BANDA_EQUILIBRIO = 350;

/* ───────────────────────── Entrada ───────────────────────── */

export interface EntradaFds {
  objetivo: ObjetivoFds;
  modo: Modo;
  sexo: Sexo; idade: number; alturaCm: number; pesoKg: number;
  /** Manutenção informada; null = estimar pela equação e pela rotina. */
  manutencaoKcal: number | null;
  rotina: Rotina;
  /** Modo "sei": o que come em média de segunda a sexta, no sábado e no domingo, e o extra da sexta à noite. */
  kcalUtil: number | null; kcalSabado: number | null; kcalDomingo: number | null; kcalSextaExtra: number | null;
  /** Modo "não sei". */
  comoCome: ComoCome;
  sexta: SextaNoite;
  sabado: Padrao; domingo: Padrao;
  /** Construtor: quando um dia tem eventos, eles substituem o padrão daquele dia. */
  eventos: Evento[];
  movimento: Movimento;
  /** Passos informados (substituem "movimento" quando os três existem). */
  passosUtil: number | null; passosSabado: number | null; passosDomingo: number | null;
  treinaFds: "nao" | "sabado" | "domingo" | "ambos" | "varia";
  compensa: Compensa;
  medicacao: Medicacao;
}

/** "E se?" — cada ajuste é uma mudança só, testável isoladamente. */
export interface Ajustes {
  /** Fração das bebidas que fica: 1, 0,5 ou 0. */
  bebidas: number;
  domingoComoSemana: boolean;
  sextaSemExtra: boolean;
  passosExtra: number;
  /** "Voltar à rotina na próxima refeição": cada dia fica com no máximo uma refeição diferente. */
  proximaRefeicao: boolean;
}
export const SEM_AJUSTE: Ajustes = { bebidas: 1, domingoComoSemana: false, sextaSemExtra: false, passosExtra: 0, proximaRefeicao: false };

/* ───────────────────────── Camada A — o saldo ───────────────────────── */

export const DIAS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"] as const;
export type Dia = (typeof DIAS)[number];
export const ROTULO_DIA: Record<Dia, string> = { seg: "SEG", ter: "TER", qua: "QUA", qui: "QUI", sex: "SEX", sab: "SÁB", dom: "DOM" };

export interface Componentes { comida: Faixa; bebida: Faixa }
export interface Semana {
  manutencao: Faixa;
  manutencaoInformada: boolean;
  ingestaoUtil: number;
  /** Saldo de cada dia (ingestão − gasto). */
  dias: Record<Dia, Faixa>;
  construido: Faixa;
  consumido: Faixa;
  saldo: Faixa;
  /** Fração do déficit dos dias úteis que sobrou; null quando não houve déficit nos dias úteis. */
  preservado: number | null;
  estado: "deficit" | "equilibrio" | "superavit";
  /** Extras por dia do fim de semana, separados em comida e bebida. */
  extras: Record<DiaFds, Componentes>;
  /** kcal a menos gastas pela queda de movimento (positivo = gastou menos). */
  movimentoPerdido: number;
  /** Ingestão média diária dos 7 dias — o que entra na projeção. */
  ingestaoMedia: Faixa;
}

export function manutencaoEstimada(e: Pick<EntradaFds, "sexo" | "idade" | "alturaCm" | "pesoKg" | "rotina">): number {
  return repouso(e, e.pesoKg) * FATOR_ROTINA[e.rotina];
}

export function manutencao(e: EntradaFds): { kcal: number; informada: boolean; faixa: Faixa } {
  const informada = e.manutencaoKcal !== null;
  const kcal = informada ? e.manutencaoKcal! : manutencaoEstimada(e);
  const u = informada ? INCERTEZA_INFORMADA : INCERTEZA_ESTIMADA;
  return { kcal, informada, faixa: { min: kcal * (1 - u), mid: kcal, max: kcal * (1 + u) } };
}

export function ingestaoUtil(e: EntradaFds, m: number): number {
  if (e.modo === "sei" && e.kcalUtil !== null) return e.kcalUtil;
  return m * (1 - DEFICIT_COMO_COME[e.comoCome]);
}

const temEventos = (e: EntradaFds, d: DiaFds) => e.eventos.some((x) => x.dia === d && x.qtd > 0);

/** Os extras de um dia do fim de semana, antes dos ajustes. */
export function extrasDoDia(e: EntradaFds, d: DiaFds, util: number, aj: Ajustes = SEM_AJUSTE): Componentes {
  const refeicaoComum = Math.max(400, util * FRACAO_REFEICAO);
  if (d === "sexta" && aj.sextaSemExtra) return { comida: F(0, 0), bebida: F(0, 0) };
  if (d === "domingo" && aj.domingoComoSemana) return { comida: F(0, 0), bebida: F(0, 0) };

  if (e.modo === "sei") {
    const v = d === "sexta" ? (e.kcalSextaExtra ?? 0) : (d === "sabado" ? e.kcalSabado : e.kcalDomingo) ?? util;
    const extra = d === "sexta" ? v : v - util;
    const lim = aj.proximaRefeicao ? Math.min(extra, EXTRA_PADRAO.refeicao.mid) : extra;
    return { comida: F(lim, lim), bebida: F(0, 0) };
  }

  if (temEventos(e, d)) {
    const evs = e.eventos.filter((x) => x.dia === d && x.qtd > 0);
    const refeicoes = evs.filter((x) => item(x.itemId).grupo === "refeicao");
    const extrasSoltos = evs.filter((x) => item(x.itemId).grupo === "extra");
    const bebidas = evs.filter((x) => item(x.itemId).grupo === "bebida");
    // Cada refeição do construtor substitui uma refeição comum.
    let refs = refeicoes.map((x) => soma(kcalEvento(x), F(-refeicaoComum, -refeicaoComum)));
    if (aj.proximaRefeicao && refs.length > 1) refs = [refs.reduce((a, b) => (b.mid > a.mid ? b : a))];
    const comida = soma(...refs, ...(aj.proximaRefeicao ? [] : extrasSoltos.map(kcalEvento)));
    const bebida = escala(soma(...bebidas.map(kcalEvento)), aj.bebidas);
    return { comida: { min: Math.max(0, comida.min), mid: Math.max(0, comida.mid), max: Math.max(0, comida.max) }, bebida };
  }

  const base = d === "sexta" ? EXTRA_SEXTA[e.sexta] : EXTRA_PADRAO[d === "sabado" ? e.sabado : e.domingo];
  const comida = aj.proximaRefeicao ? F(Math.min(base.min, EXTRA_PADRAO.refeicao.min), Math.min(base.max, EXTRA_PADRAO.refeicao.max)) : base;
  return { comida, bebida: F(0, 0) };
}

/** Passos a mais (+) ou a menos (−) em cada dia do fim de semana. */
export function deltaPassos(e: EntradaFds): { sab: number; dom: number } {
  if (e.passosUtil !== null && e.passosSabado !== null && e.passosDomingo !== null) return { sab: e.passosSabado - e.passosUtil, dom: e.passosDomingo - e.passosUtil };
  const p = PASSOS_MOVIMENTO[e.movimento];
  return { sab: p, dom: p };
}

export function semana(e: EntradaFds, aj: Ajustes = SEM_AJUSTE): Semana {
  const m = manutencao(e);
  const util = ingestaoUtil(e, m.kcal);
  const ex: Record<DiaFds, Componentes> = { sexta: extrasDoDia(e, "sexta", util, aj), sabado: extrasDoDia(e, "sabado", util, aj), domingo: extrasDoDia(e, "domingo", util, aj) };
  const dp = deltaPassos(e);
  const mov = { sab: kcalPassosExtra(dp.sab + aj.passosExtra, e.pesoKg), dom: kcalPassosExtra(dp.dom + aj.passosExtra, e.pesoKg) };
  const movBase = { sab: kcalPassosExtra(dp.sab, e.pesoKg), dom: kcalPassosExtra(dp.dom, e.pesoKg) };

  // Saldo de um dia: ingestão − manutenção. O mínimo usa a manutenção alta, o máximo a baixa.
  const saldoDia = (ingestao: Faixa, gastoExtra = 0): Faixa => ({ min: ingestao.min - m.faixa.max - gastoExtra, mid: ingestao.mid - m.faixa.mid - gastoExtra, max: ingestao.max - m.faixa.min - gastoExtra });
  const U = F(util, util);
  const dias: Record<Dia, Faixa> = {
    seg: saldoDia(U), ter: saldoDia(U), qua: saldoDia(U), qui: saldoDia(U),
    sex: saldoDia(soma(U, ex.sexta.comida, ex.sexta.bebida)),
    sab: saldoDia(soma(U, ex.sabado.comida, ex.sabado.bebida), mov.sab),
    dom: saldoDia(soma(U, ex.domingo.comida, ex.domingo.bebida), mov.dom),
  };
  const construido = escala(saldoDia(U), 5);
  const saldo = soma(...DIAS.map((d) => dias[d]));
  const consumido = { min: saldo.min - construido.min, mid: saldo.mid - construido.mid, max: saldo.max - construido.max };
  const preservado = construido.mid < -1 ? Math.max(0, Math.min(1, saldo.mid / construido.mid)) : null;
  const estado = classifica(saldo);
  const totalIngestao = soma(escala(U, 7), ex.sexta.comida, ex.sexta.bebida, ex.sabado.comida, ex.sabado.bebida, ex.domingo.comida, ex.domingo.bebida);
  const movimentoPerdido = -(movBase.sab + movBase.dom);
  return { manutencao: m.faixa, manutencaoInformada: m.informada, ingestaoUtil: util, dias, construido, consumido, saldo, preservado, estado, extras: ex, movimentoPerdido, ingestaoMedia: escala(totalIngestao, 1 / 7) };
}

/** Déficit / perto da manutenção / acima, pela faixa — nunca por um número só. */
export function classifica(s: Faixa): Semana["estado"] {
  if (Math.abs(s.mid) <= BANDA_EQUILIBRIO) return "equilibrio";
  if (s.min < 0 && s.max > 0 && Math.abs(s.mid) < 2 * BANDA_EQUILIBRIO) return "equilibrio";
  return s.mid < 0 ? "deficit" : "superavit";
}

/* ───────────────────────── A frase e o "onde" ───────────────────────── */

export function fraseDaSemana(s: Semana): string {
  const util = s.construido.mid < -1;
  const fdsNegativo = s.consumido.mid <= 0;
  if (s.estado === "deficit") {
    if (!util) return "Mesmo sem déficit nos dias úteis, você terminou a semana em déficit — o fim de semana gastou mais do que você comeu a mais.";
    if (fdsNegativo) return "Você criou um déficit de segunda a sexta, e o fim de semana não tirou nada dele.";
    return "Você criou um déficit de segunda a sexta, perdeu parte dele no fim de semana, mas ainda terminou a semana em déficit.";
  }
  if (s.estado === "equilibrio") return util ? "Você passou os dias úteis em déficit, mas terminou a semana perto da manutenção." : "Você terminou a semana perto da manutenção.";
  return util ? "Neste cenário, a energia extra do fim de semana ultrapassou o déficit criado durante os outros dias." : "Neste cenário, o saldo da semana ficou acima da manutenção.";
}

export type Fonte = "sexta" | "sabado-comida" | "sabado-bebida" | "domingo-comida" | "domingo-bebida" | "movimento";
export const ROTULO_FONTE: Record<Fonte, string> = { sexta: "Sexta à noite", "sabado-comida": "Sábado — comida", "sabado-bebida": "Sábado — bebidas", "domingo-comida": "Domingo — comida", "domingo-bebida": "Domingo — bebidas", movimento: "Menos movimento" };

/** O que empurrou o saldo para cima, do maior para o menor. Só o que é positivo. */
export function contribuicoes(s: Semana): { fonte: Fonte; kcal: number }[] {
  const l: { fonte: Fonte; kcal: number }[] = [
    { fonte: "sexta", kcal: s.extras.sexta.comida.mid + s.extras.sexta.bebida.mid },
    { fonte: "sabado-comida", kcal: s.extras.sabado.comida.mid },
    { fonte: "sabado-bebida", kcal: s.extras.sabado.bebida.mid },
    { fonte: "domingo-comida", kcal: s.extras.domingo.comida.mid },
    { fonte: "domingo-bebida", kcal: s.extras.domingo.bebida.mid },
    { fonte: "movimento", kcal: s.movimentoPerdido },
  ];
  return l.filter((x) => x.kcal > 20).sort((a, b) => b.kcal - a.kcal);
}

/* ───────────────────────── O insight, por regras ───────────────────────── */

export type TipoInsight = "seguranca" | "tranquilo" | "bebidas" | "duracao" | "domingo" | "movimento" | "maior" | "sem-extra";
export interface Insight { tipo: TipoInsight; titulo: string; texto: string }

export const ehCompensacaoArriscada = (e: EntradaFds, s?: Semana) =>
  e.compensa === "jejum" || e.compensa === "cardio-longo" ||
  (e.modo === "sei" && e.kcalDomingo !== null && e.kcalDomingo < Math.max(1200, repouso(e, e.pesoKg) * 0.8) && (s ? s.extras.sabado.comida.mid > 500 : true));

export function insight(e: EntradaFds, s: Semana): Insight {
  if (ehCompensacaoArriscada(e, s)) return { tipo: "seguranca", titulo: "Antes de tudo: não precisa compensar", texto: "Jejum para “pagar” o sábado, cardio muito longo ou um domingo quase sem comer não fazem parte de uma estratégia — tendem a puxar o próximo exagero. Depois de um fim de semana diferente, o caminho é voltar à rotina normal na próxima refeição. Se comer e compensar virou um ciclo difícil de controlar, vale conversar com um profissional de saúde." };
  const c = contribuicoes(s);
  const total = c.reduce((a, x) => a + x.kcal, 0);
  if (total < 50) return { tipo: "sem-extra", titulo: "Seu fim de semana parece com a sua semana", texto: "Pelas suas respostas, sábado e domingo quase não mudaram o saldo. Se o resultado não aparece, a resposta provavelmente está nos dias úteis ou no gasto — não no fim de semana." };
  const bebidas = s.extras.sabado.bebida.mid + s.extras.domingo.bebida.mid + s.extras.sexta.bebida.mid;
  const diasComExtra = (["sexta", "sabado", "domingo"] as DiaFds[]).filter((d) => s.extras[d].comida.mid + s.extras[d].bebida.mid > 150).length;
  const umaRefeicao = diasComExtra === 1 && total <= EXTRA_PADRAO.refeicao.max + 200;
  if (s.movimentoPerdido >= 0.35 * total) return { tipo: "movimento", titulo: "Você também se mexe bem menos no fim de semana", texto: `A queda de passos no sábado e no domingo tirou cerca de ${fmtKcal(s.movimentoPerdido)} do gasto — ${Math.round((s.movimentoPerdido / total) * 100)}% do que o fim de semana mudou. Comer mais e ficar parado costumam andar juntos (Racette, 2008).` };
  if (s.estado === "deficit" && umaRefeicao) return { tipo: "tranquilo", titulo: "Você continuou em déficit mesmo com a refeição livre", texto: "Uma refeição diferente reduziu parte do déficit da semana, mas não o apagou. É um exemplo de flexibilidade dentro da estratégia — o que conta é o conjunto dos sete dias." };
  if (bebidas >= 0.4 * total) return { tipo: "bebidas", titulo: "As bebidas foram a maior parte da diferença", texto: `Pelas suas respostas, as bebidas somaram cerca de ${fmtKcal(bebidas)} no fim de semana — ${Math.round((bebidas / total) * 100)}% de tudo o que ele adicionou. Não é o álcool “desligando” nada: é energia que entra sem ocupar espaço no prato, e que muitas vezes vem acompanhada de petisco e de uma noite mais curta.` };
  if (diasComExtra === 3 && s.estado !== "deficit") return { tipo: "duracao", titulo: "O que pesou foi a duração, não um alimento", texto: "Sexta à noite, sábado e domingo ficaram diferentes da semana. Nenhum deles sozinho decide o saldo — a soma dos três é que levou a semana para perto (ou acima) da manutenção." };
  const sab = s.extras.sabado.comida.mid + s.extras.sabado.bebida.mid, dom = s.extras.domingo.comida.mid + s.extras.domingo.bebida.mid;
  if (dom >= 500 && sab > 0 && dom >= 0.6 * sab && s.estado !== "deficit") return { tipo: "domingo", titulo: "O domingo mudou mais o cenário do que o sábado sozinho", texto: "Seu sábado isoladamente não mudaria tanto a semana. O maior impacto aparece quando o domingo também fica muito diferente — o “já que eu saí, volto na segunda”." };
  return { tipo: "maior", titulo: `O maior componente: ${ROTULO_FONTE[c[0].fonte].toLowerCase()}`, texto: `Foi ${ROTULO_FONTE[c[0].fonte].toLowerCase()} que mais mexeu no saldo — cerca de ${fmtKcal(c[0].kcal)} dos ${fmtKcal(total)} que o fim de semana adicionou.` };
}

/* ───────────────────────── "Menor mudança, maior impacto" ───────────────────────── */

export interface Mudanca { id: keyof Ajustes | "passos"; rotulo: string; ajuste: Partial<Ajustes>; ganho: number }

/**
 * Testa uma mudança por vez e escolhe a de maior efeito entre as que
 * preservam pelo menos um momento social no fim de semana. Não é a mais
 * radical: "zerar o fim de semana" nem entra na lista.
 */
export function mudancas(e: EntradaFds): Mudanca[] {
  const base = semana(e);
  const bebidas = base.extras.sexta.bebida.mid + base.extras.sabado.bebida.mid + base.extras.domingo.bebida.mid;
  const sab = base.extras.sabado.comida.mid + base.extras.sabado.bebida.mid;
  const dom = base.extras.domingo.comida.mid + base.extras.domingo.bebida.mid;
  const sex = base.extras.sexta.comida.mid + base.extras.sexta.bebida.mid;
  const cands: Omit<Mudanca, "ganho">[] = [];
  if (bebidas > 50) cands.push({ id: "bebidas", rotulo: "Metade das bebidas", ajuste: { bebidas: 0.5 } });
  if (dom > 50 && (sab > 50 || sex > 50)) cands.push({ id: "domingoComoSemana", rotulo: "Domingo parecido com a semana (o sábado fica como está)", ajuste: { domingoComoSemana: true } });
  if (sex > 50 && (sab > 50 || dom > 50)) cands.push({ id: "sextaSemExtra", rotulo: "Não estender a sexta à noite", ajuste: { sextaSemExtra: true } });
  const proxima = semana(e, { ...SEM_AJUSTE, proximaRefeicao: true });
  if (base.saldo.mid - proxima.saldo.mid > 50) cands.push({ id: "proximaRefeicao", rotulo: "Voltar à rotina na refeição seguinte (uma refeição diferente por dia, não o dia todo)", ajuste: { proximaRefeicao: true } });
  cands.push({ id: "passos", rotulo: "3.000 passos a mais no sábado e no domingo", ajuste: { passosExtra: 3000 } });
  return cands
    .map((c) => ({ ...c, ganho: base.saldo.mid - semana(e, { ...SEM_AJUSTE, ...c.ajuste }).saldo.mid }))
    .filter((c) => c.ganho > 30)
    .sort((a, b) => b.ganho - a.ganho);
}

/* ───────────────────────── Recomeçar rápido ───────────────────────── */

/**
 * O efeito "já que eu saí da dieta…". Uma refeição diferente no almoço de
 * sábado, com dois finais possíveis:
 *   B — volta na próxima refeição: só o extra da refeição.
 *   A — "já estraguei mesmo": jantar também, domingo inteiro diferente,
 *       recomeça segunda.
 * A diferença não vem do alimento inicial; vem da decisão de adiar a volta.
 */
export function recomecar(e: EntradaFds): { b: number; a: number; diferenca: number; diasDeDeficit: number | null } {
  const m = manutencao(e).kcal;
  const util = ingestaoUtil(e, m);
  const refeicao = EXTRA_PADRAO.refeicao.mid;
  const b = refeicao;
  const a = refeicao + EXTRA_PADRAO.refeicao.mid + EXTRA_PADRAO.varias.mid;
  const deficitDia = m - util;
  return { b, a, diferenca: a - b, diasDeDeficit: deficitDia > 50 ? (a - b) / deficitDia : null };
}

/* ───────────────────────── Balança ≠ gordura ───────────────────────── */

/**
 * Quem conta que a balança subiu X kg na segunda. O limite superior de
 * tecido gorduroso é a energia extra do fim de semana (no cenário alto)
 * dividida pela energia do tecido — e nunca passa do que a balança mostrou.
 * O resto é água, glicogênio, sódio e conteúdo intestinal. É um teto, não
 * uma medida: a frase nunca diz "você não ganhou gordura".
 */
export function balanca(s: Semana, subiuKg: number): { tetoGorduraKg: number; restoKg: number } {
  const extraFds = Math.max(0, s.dias.sex.max) + Math.max(0, s.dias.sab.max) + Math.max(0, s.dias.dom.max);
  const teto = Math.min(subiuKg, extraFds / ENERGIA_GORDURA);
  return { tetoGorduraKg: teto, restoKg: Math.max(0, subiuKg - teto) };
}

/* ───────────────────────── Camada B — projeção ───────────────────────── */

export interface PontoFds { semana: number; delta: number; min: number; max: number }

function simula(e: EntradaFds, ingestao: number, manut: number, semanas: number): number[] {
  let peso = e.pesoKg, gord = gorduraInicialKg(e);
  const r0 = repouso(e, e.pesoKg);
  const out = [0];
  for (let d = 1; d <= semanas * 7; d++) {
    const gasto = manut + (repouso(e, peso) - r0) * (manut / r0);
    const p = FORBES_C / (FORBES_C + Math.max(1, gord));
    const rho = p * ENERGIA_MAGRA + (1 - p) * ENERGIA_GORDURA;
    const dp = (ingestao - gasto) / rho;
    peso += dp; gord += (1 - p) * dp;
    if (d % 7 === 0) out.push(peso - e.pesoKg);
  }
  return out;
}

/** "E se todo fim de semana fosse assim?" — variação de peso em 4, 8 e 12 semanas, com faixa. */
export function projecao(e: EntradaFds, s: Semana): PontoFds[] {
  const mid = simula(e, s.ingestaoMedia.mid, s.manutencao.mid, 12);
  const lo = simula(e, s.ingestaoMedia.min, s.manutencao.max, 12);
  const hi = simula(e, s.ingestaoMedia.max, s.manutencao.min, 12);
  return [4, 8, 12].map((w) => ({ semana: w, delta: mid[w], min: Math.min(lo[w], hi[w]), max: Math.max(lo[w], hi[w]) }));
}

/* ───────────────────────── Formatação ───────────────────────── */

export const arred = (n: number) => Math.round(n / 50) * 50;
export function fmtKcal(n: number): string {
  const v = arred(n);
  return `${v > 0 ? "+" : v < 0 ? "−" : ""}${Math.abs(v).toLocaleString("pt-BR")} kcal`;
}
export function fmtFaixaKcal(f: Faixa): string {
  const a = arred(f.min), b = arred(f.max);
  if (a === b) return fmtKcal(a);
  const s = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("pt-BR")}`;
  return `${s(a)} a ${s(b)} kcal`;
}
export function fmtDeltaKg(n: number): string {
  const v = Math.round(n * 10) / 10;
  if (v === 0) return "0 kg";
  return `${v > 0 ? "+" : "−"}${Math.abs(v).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;
}
export const ROTULO_ESTADO: Record<Semana["estado"], { rotulo: string; simbolo: string }> = {
  deficit: { rotulo: "Déficit semanal", simbolo: "▼" },
  equilibrio: { rotulo: "Perto da manutenção", simbolo: "≈" },
  superavit: { rotulo: "Acima da manutenção", simbolo: "▲" },
};

/* ───────────────────────── Fontes ───────────────────────── */

export const FONTES_FDS = [
  { rotulo: "Monteiro LS et al. Consumo alimentar segundo os dias da semana — Inquérito Nacional de Alimentação, 2008-2009. Rev Saúde Pública, 2017", url: "https://pubmed.ncbi.nlm.nih.gov/29020121/", resumo: "34.003 brasileiros: ingestão média 8% maior no fim de semana; bebidas açucaradas com contribuição 62% maior." },
  { rotulo: "Racette SB et al. Influence of weekend lifestyle patterns on body weight. Obesity, 2008", url: "https://onlinelibrary.wiley.com/doi/10.1038/oby.2008.320", resumo: "O peso subiu nos fins de semana por comer mais E se mexer menos; a perda parou justamente neles." },
  { rotulo: "Orsama AL et al. Weight rhythms: weight increases during weekends and decreases during weekdays. Obes Facts, 2014", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5644907/", resumo: "Pico de peso no domingo e na segunda, queda ao longo da semana — maior justamente em quem emagreceu." },
  { rotulo: "Hall KD et al. Quantification of the effect of energy imbalance on bodyweight. Lancet, 2011", url: "https://pubmed.ncbi.nlm.nih.gov/21872751/", resumo: "Base da projeção dinâmica; por que 7.700 kcal = 1 kg erra em projeções de semanas." },
  { rotulo: "Forbes GB. Body fat content influences the body composition response to nutrition and exercise. Ann N Y Acad Sci, 2000", url: "https://pubmed.ncbi.nlm.nih.gov/10865771/", resumo: "Quanto da variação de peso é massa magra ou gordura, pela gordura de partida." },
  { rotulo: "Mifflin MD et al. A new predictive equation for resting energy expenditure. Am J Clin Nutr, 1990", url: "https://pubmed.ncbi.nlm.nih.gov/2305711/", resumo: "Equação do gasto de repouso usada quando você não informa a manutenção." },
  { rotulo: "Kreitzman SN et al. Glycogen storage: illusions of easy weight loss, excessive weight regain. Am J Clin Nutr, 1992", url: "https://pubmed.ncbi.nlm.nih.gov/1615908/", resumo: "Glicogênio é armazenado com água — oscilações rápidas de peso sem mudança proporcional de gordura." },
];

/* ───────────────────────── Registros ───────────────────────── */

/** Artigos que perguntam "e o meu fim de semana?" — recebem o link do simulador. */
export const ARTIGOS_COM_LINK_FIM_DE_SEMANA: string[] = ["fim-de-semana-estraga-a-dieta", "dia-do-lixo-funciona"];

/* ───────────────────────── Uma refeição × o fim de semana inteiro ───────────────────────── */

/**
 * O mesmo corpo, a mesma semana útil, dois fins de semana:
 *   A — uma refeição mais livre no sábado à noite; o resto como a semana.
 *   B — sexta à noite + sábado + domingo fora da rotina.
 * Usa as faixas do padrão ("refeição" e "várias refeições"), nunca o
 * cardápio da pessoa, para que a comparação seja sobre duração.
 */
export function comparaRefeicaoFds(e: EntradaFds): { a: Semana; b: Semana } {
  const m = manutencao(e).kcal;
  const util = ingestaoUtil(e, m);
  const fixa: EntradaFds = { ...e, modo: "sei", manutencaoKcal: m, kcalUtil: util, eventos: [], passosUtil: null, passosSabado: null, passosDomingo: null, movimento: "parecido" };
  const a = semana({ ...fixa, kcalSextaExtra: 0, kcalSabado: util + EXTRA_PADRAO.refeicao.mid, kcalDomingo: util });
  const b = semana({ ...fixa, kcalSextaExtra: EXTRA_SEXTA.sim.mid, kcalSabado: util + EXTRA_PADRAO.varias.mid, kcalDomingo: util + EXTRA_PADRAO.varias.mid });
  return { a, b };
}
