/**
 * Métricas do CRM — funções puras, sem banco.
 *
 * ESTE ARQUIVO É A FONTE ÚNICA DA VERDADE DE CADA KPI.
 *
 * Toda tela do CRM calcula por aqui. Se duas telas discordarem, o bug está
 * numa delas ter feito a conta por fora, não na definição. O dicionário em
 * lib/crm/kpis.ts descreve cada função em linguagem humana e aponta para cá.
 *
 * Regras que estas funções impõem:
 *  - Divisão por zero devolve null, nunca 0 nem Infinity. "Não calculável" é
 *    resposta válida e a tela mostra assim.
 *  - LTV realizado é líquido de reembolso (refund entra negativo). Isso está
 *    documentado no dicionário; quem quiser bruto filtra antes.
 *  - MRR só conta contrato recorrente ativo, normalizado por ciclo
 *    (trimestral de 1.200 = 400/mês) e rotulado "normalizado".
 *  - CAC de mídia divide gasto rastreado por clientes ATRIBUÍDOS àquela
 *    fonte. Fonte sem custo rastreado devolve "custo não calculado", não zero.
 *  - Atribuição preserva todos os toques: first, lead creation, last
 *    non-direct e assistidos. Unknown continua unknown.
 *  - Mediana antes de média onde extremo distorce (ciclo de venda, resposta).
 */

// ---------------------------------------------------------------------------
// Utilidades numéricas
// ---------------------------------------------------------------------------
export const razao = (num: number, den: number): number | null => (den > 0 ? num / den : null);

export function mediana(valores: number[]): number | null {
  if (!valores.length) return null;
  const v = [...valores].sort((a, b) => a - b);
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}
export function media(valores: number[]): number | null {
  return valores.length ? valores.reduce((s, x) => s + x, 0) / valores.length : null;
}
export function percentil(valores: number[], p: number): number | null {
  if (!valores.length) return null;
  const v = [...valores].sort((a, b) => a - b);
  const idx = Math.min(v.length - 1, Math.max(0, Math.ceil((p / 100) * v.length) - 1));
  return v[idx];
}
export const DIA_MS = 86_400_000;
export const diasEntre = (a: Date | string, b: Date | string) => (new Date(b).getTime() - new Date(a).getTime()) / DIA_MS;
export const mesChave = (d: Date | string) => new Date(d).toISOString().slice(0, 7); // "2026-09"

// ---------------------------------------------------------------------------
// Funil
// ---------------------------------------------------------------------------
export interface ContagemFunil {
  leads: number;
  contatos: number;
  qualificados: number;
  experimentaisAgendadas: number;
  experimentaisRealizadas: number;
  propostas: number;
  vendas: number;
}
export interface TaxasFunil {
  leadParaContato: number | null;
  contatoParaQualificado: number | null;
  qualificadoParaExperimental: number | null;
  experimentalAgendadaParaRealizada: number | null; // show rate
  experimentalParaProposta: number | null;
  propostaParaVenda: number | null;                 // win rate
  leadParaVenda: number | null;
  maiorQueda: { etapa: string; queda: number } | null;
}
export function taxasFunil(c: ContagemFunil): TaxasFunil {
  const etapas: [string, number, number][] = [
    ["Lead → Contato", c.leads, c.contatos],
    ["Contato → Qualificado", c.contatos, c.qualificados],
    ["Qualificado → Experimental agendada", c.qualificados, c.experimentaisAgendadas],
    ["Experimental agendada → Realizada", c.experimentaisAgendadas, c.experimentaisRealizadas],
    ["Experimental → Proposta", c.experimentaisRealizadas, c.propostas],
    ["Proposta → Venda", c.propostas, c.vendas],
  ];
  let maiorQueda: TaxasFunil["maiorQueda"] = null;
  for (const [etapa, de, para] of etapas) {
    if (de > 0) {
      const queda = 1 - para / de;
      if (!maiorQueda || queda > maiorQueda.queda) maiorQueda = { etapa, queda };
    }
  }
  return {
    leadParaContato: razao(c.contatos, c.leads),
    contatoParaQualificado: razao(c.qualificados, c.contatos),
    qualificadoParaExperimental: razao(c.experimentaisAgendadas, c.qualificados),
    experimentalAgendadaParaRealizada: razao(c.experimentaisRealizadas, c.experimentaisAgendadas),
    experimentalParaProposta: razao(c.propostas, c.experimentaisRealizadas),
    propostaParaVenda: razao(c.vendas, c.propostas),
    leadParaVenda: razao(c.vendas, c.leads),
    maiorQueda,
  };
}

export const showRate = (agendadas: number, realizadas: number) => razao(realizadas, agendadas);
export const noShowRate = (agendadas: number, noShows: number) => razao(noShows, agendadas);
export const winRate = (propostas: number, ganhas: number) => razao(ganhas, propostas);

// ---------------------------------------------------------------------------
// Tempo: ciclo de venda e primeira resposta
// ---------------------------------------------------------------------------
export interface ResumoTempo { n: number; media: number | null; mediana: number | null; p75: number | null }
export function resumoTempo(valores: number[]): ResumoTempo {
  return { n: valores.length, media: media(valores), mediana: mediana(valores), p75: percentil(valores, 75) };
}
/** Dias entre lead criado e ganho. */
export const cicloDeVendaDias = (pares: { createdAt: string; wonAt: string }[]) =>
  resumoTempo(pares.map((p) => diasEntre(p.createdAt, p.wonAt)));

export interface ResumoPrimeiraResposta extends ResumoTempo {
  ate5min: number | null; ate30min: number | null; ate1h: number | null; ate24h: number | null;
}
/** Minutos entre lead criado e primeiro contato humano registrado. Lead sem resposta fica de fora do tempo e conta em `semResposta`. */
export function primeiraResposta(pares: { createdAt: string; firstResponseAt: string | null }[]): ResumoPrimeiraResposta & { semResposta: number } {
  const min = pares.filter((p) => p.firstResponseAt).map((p) => diasEntre(p.createdAt, p.firstResponseAt!) * 24 * 60);
  const frac = (lim: number) => razao(min.filter((m) => m <= lim).length, min.length);
  return { ...resumoTempo(min), ate5min: frac(5), ate30min: frac(30), ate1h: frac(60), ate24h: frac(1440), semResposta: pares.length - min.length };
}
/** % de tarefas concluídas até o prazo. */
export function slaFollowUp(tarefas: { dueAt: string; completedAt: string | null }[], agora = new Date()): number | null {
  const vencidas = tarefas.filter((t) => t.completedAt || new Date(t.dueAt) < agora);
  return razao(vencidas.filter((t) => t.completedAt && new Date(t.completedAt) <= new Date(t.dueAt)).length, vencidas.length);
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------
export interface OportunidadeAberta { expectedValue: number | null; probability: number | null; stageProbability: number | null }
export function valorPipeline(opps: OportunidadeAberta[]) {
  let bruto = 0, ponderado = 0, semValor = 0, semProbabilidade = 0;
  for (const o of opps) {
    if (o.expectedValue == null) { semValor++; continue; }
    bruto += o.expectedValue;
    const p = o.probability ?? o.stageProbability;
    if (p == null) { semProbabilidade++; continue; }
    ponderado += o.expectedValue * p;
  }
  return { bruto, ponderado, semValor, semProbabilidade, n: opps.length };
}
/**
 * Probabilidade histórica por etapa: das oportunidades que passaram pela
 * etapa, quantas acabaram ganhas. Só vale com amostra — abaixo de `minimo`
 * devolve null e a tela usa a configurada.
 */
export function probabilidadeHistorica(passagens: { stageCode: string; ganhou: boolean }[], minimo = 20): Record<string, number | null> {
  const por: Record<string, { n: number; g: number }> = {};
  for (const p of passagens) { (por[p.stageCode] ??= { n: 0, g: 0 }).n++; if (p.ganhou) por[p.stageCode].g++; }
  return Object.fromEntries(Object.entries(por).map(([k, v]) => [k, v.n >= minimo ? v.g / v.n : null]));
}
/** Pipeline velocity (documentada no dicionário): oportunidades × win rate × ticket médio / ciclo médio (dias). */
export function pipelineVelocity(oportunidadesQualificadas: number, winRate: number | null, ticketMedio: number | null, cicloMedioDias: number | null): number | null {
  if (winRate == null || ticketMedio == null || !cicloMedioDias) return null;
  return (oportunidadesQualificadas * winRate * ticketMedio) / cicloMedioDias;
}

// ---------------------------------------------------------------------------
// Receita, LTV, MRR
// ---------------------------------------------------------------------------
export interface EventoReceita { clientId: string; amount: number; tipo: string; occurredAt: string; status: "expected" | "contracted" | "collected" }
export interface Cliente { id: string; firstPurchaseAt: string; sourceCode: string; status: string; cancelledAt?: string | null; planId?: string | null; serviceCode?: string | null; referredBy?: string | null }
export interface Contrato { clientId: string; valor: number; cicloMeses: number; inicio: string; fim: string | null; status: string; planId?: string | null }

/** Receita realizada líquida do cliente: soma dos eventos coletados (reembolso é negativo). */
export function ltvRealizado(eventos: EventoReceita[], clientId: string, opts: { liquido?: boolean } = {}): number {
  const liquido = opts.liquido ?? true;
  return eventos
    .filter((e) => e.clientId === clientId && e.status === "collected" && (liquido || e.tipo !== "refund"))
    .reduce((s, e) => s + e.amount, 0);
}
export function receitaPorStatus(eventos: EventoReceita[]) {
  const r = { expected: 0, contracted: 0, collected: 0 };
  for (const e of eventos) r[e.status] += e.amount;
  return r;
}
/** LTV médio realizado de um grupo de clientes; devolve n para a tela avisar amostra pequena. */
export function ltvMedio(clientes: Cliente[], eventos: EventoReceita[]) {
  const valores = clientes.map((c) => ltvRealizado(eventos, c.id));
  return { n: clientes.length, medio: media(valores), mediana: mediana(valores), total: valores.reduce((s, x) => s + x, 0) };
}
export function ltvPorFonte(clientes: Cliente[], eventos: EventoReceita[]) {
  const grupos = new Map<string, Cliente[]>();
  for (const c of clientes) grupos.set(c.sourceCode, [...(grupos.get(c.sourceCode) ?? []), c]);
  return [...grupos.entries()].map(([fonte, cs]) => ({ fonte, ...ltvMedio(cs, eventos) })).sort((a, b) => (b.medio ?? 0) - (a.medio ?? 0));
}
/**
 * LTV projetado, só com dado suficiente: ARPU mensal × vida média observada
 * (meses). Devolve null e o motivo quando a base é imatura — a tela mostra
 * "dados ainda imaturos" em vez de número.
 */
export function ltvProjetado(clientes: Cliente[], eventos: EventoReceita[], hoje = new Date(), minimos = { clientes: 15, mesesHistorico: 6 }) {
  const encerrados = clientes.filter((c) => c.cancelledAt);
  const maisAntigo = clientes.length ? Math.min(...clientes.map((c) => new Date(c.firstPurchaseAt).getTime())) : null;
  const mesesHistorico = maisAntigo ? diasEntre(new Date(maisAntigo), hoje) / 30.44 : 0;
  if (clientes.length < minimos.clientes || mesesHistorico < minimos.mesesHistorico || encerrados.length < 5) {
    return { valor: null as number | null, motivo: `Base imatura: ${clientes.length} clientes, ${mesesHistorico.toFixed(1)} meses de histórico, ${encerrados.length} encerrados (mínimo ${minimos.clientes}/${minimos.mesesHistorico}/5).`, confianca: "baixa" as const };
  }
  const vidaMediaMeses = media(encerrados.map((c) => diasEntre(c.firstPurchaseAt, c.cancelledAt!) / 30.44))!;
  const arpu = arpuMensal(clientes, eventos, hoje);
  if (arpu == null) return { valor: null, motivo: "Sem receita coletada.", confianca: "baixa" as const };
  return { valor: arpu * vidaMediaMeses, motivo: `ARPU ${arpu.toFixed(0)} × vida média ${vidaMediaMeses.toFixed(1)} meses`, confianca: encerrados.length >= 20 ? ("media" as const) : ("baixa" as const) };
}
/** ARPU mensal: receita coletada nos últimos 30 dias / clientes ativos. */
export function arpuMensal(clientes: Cliente[], eventos: EventoReceita[], hoje = new Date()): number | null {
  const ativos = clientes.filter((c) => c.status === "ativo").length;
  const inicio = new Date(hoje.getTime() - 30 * DIA_MS);
  const receita = eventos.filter((e) => e.status === "collected" && new Date(e.occurredAt) > inicio && new Date(e.occurredAt) <= hoje).reduce((s, e) => s + e.amount, 0);
  return razao(receita, ativos);
}

export function contratoAtivoEm(c: Contrato, data: Date): boolean {
  if (new Date(c.inicio) > data) return false;
  if (c.fim) return new Date(c.fim) >= data;
  return c.status !== "cancelado" && c.status !== "encerrado";
}
/** MRR normalizado numa data: soma de valor/ciclo dos contratos ativos naquela data. */
export function mrrNormalizado(contratos: Contrato[], data = new Date()): number {
  // Contrato cancelado ou encerrado ainda conta até a data de fim: o
  // cancelamento vale a partir do fim, não do momento em que foi registrado.
  return contratos
    .filter((c) => contratoAtivoEm(c, data))
    .reduce((s, c) => s + c.valor / (c.cicloMeses || 1), 0);
}
export const mrrDoContrato = (valor: number, cicloMeses: number) => valor / (cicloMeses || 1);
/** Movimento de MRR entre dois instantes, por cliente. */
export function movimentoMrr(contratos: Contrato[], de: Date, ate: Date) {
  const porCliente = (data: Date) => {
    const m = new Map<string, number>();
    for (const c of contratos) {
      if (contratoAtivoEm(c, data)) m.set(c.clientId, (m.get(c.clientId) ?? 0) + mrrDoContrato(c.valor, c.cicloMeses));
    }
    return m;
  };
  const antes = porCliente(de), depois = porCliente(ate);
  const r = { novo: 0, expansao: 0, contracao: 0, perdido: 0, inicio: 0, fim: 0 };
  for (const v of antes.values()) r.inicio += v;
  for (const v of depois.values()) r.fim += v;
  const ids = new Set([...antes.keys(), ...depois.keys()]);
  for (const id of ids) {
    const a = antes.get(id) ?? 0, d = depois.get(id) ?? 0;
    if (a === 0 && d > 0) r.novo += d;
    else if (a > 0 && d === 0) r.perdido += a;
    else if (d > a) r.expansao += d - a;
    else if (d < a) r.contracao += a - d;
  }
  return r;
}

// ---------------------------------------------------------------------------
// Retenção, churn, coortes
// ---------------------------------------------------------------------------
/** Churn de clientes no período: cancelados / ativos no início. */
export const churnClientes = (ativosInicio: number, cancelados: number) => razao(cancelados, ativosInicio);
export const retencaoClientes = (ativosInicio: number, permanecem: number) => razao(permanecem, ativosInicio);
/** Churn de receita: MRR perdido / MRR no início. */
export const churnReceita = (mrrInicio: number, mrrPerdido: number) => razao(mrrPerdido, mrrInicio);
export const taxaRenovacao = (elegiveis: number, renovados: number) => razao(renovados, elegiveis);
export const taxaReativacao = (trabalhados: number, reativados: number) => razao(reativados, trabalhados);
/** Tempo como cliente (meses), para ativos até hoje e para encerrados até o cancelamento. */
export function tenureMeses(clientes: Cliente[], hoje = new Date()) {
  return resumoTempo(clientes.map((c) => diasEntre(c.firstPurchaseAt, c.cancelledAt ?? hoje) / 30.44));
}

export interface LinhaCoorte {
  coorte: string; clientes: number; fontes: Record<string, number>;
  receita: { d30: number; d60: number; d90: number; d180: number; d365: number; total: number };
  ltvMedio: number | null;
  retencao: Record<string, number | null>; // M0, M1, M2, M3, M6, M12
  amostraPequena: boolean;
}
/**
 * Coortes por mês de aquisição. Retido em M(n) = teve receita coletada no
 * n-ésimo mês após a compra. Um mês futuro (ainda não chegou) fica null.
 */
export function coortes(clientes: Cliente[], eventos: EventoReceita[], hoje = new Date(), minimoAmostra = 5): LinhaCoorte[] {
  const grupos = new Map<string, Cliente[]>();
  for (const c of clientes) { const k = mesChave(c.firstPurchaseAt); grupos.set(k, [...(grupos.get(k) ?? []), c]); }
  const marcos = [0, 1, 2, 3, 6, 12];
  return [...grupos.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([coorte, cs]) => {
    const rec = { d30: 0, d60: 0, d90: 0, d180: 0, d365: 0, total: 0 };
    const fontes: Record<string, number> = {};
    const retidos: Record<number, number> = {};
    const elegiveis: Record<number, number> = {};
    for (const c of cs) {
      fontes[c.sourceCode] = (fontes[c.sourceCode] ?? 0) + 1;
      const ev = eventos.filter((e) => e.clientId === c.id && e.status === "collected");
      for (const e of ev) {
        const d = diasEntre(c.firstPurchaseAt, e.occurredAt);
        rec.total += e.amount;
        if (d <= 30) rec.d30 += e.amount; if (d <= 60) rec.d60 += e.amount; if (d <= 90) rec.d90 += e.amount;
        if (d <= 180) rec.d180 += e.amount; if (d <= 365) rec.d365 += e.amount;
      }
      for (const m of marcos) {
        const ini = new Date(c.firstPurchaseAt); ini.setMonth(ini.getMonth() + m);
        const fim = new Date(ini); fim.setMonth(fim.getMonth() + 1);
        if (ini > hoje) continue;
        elegiveis[m] = (elegiveis[m] ?? 0) + 1;
        if (ev.some((e) => { const t = new Date(e.occurredAt); return t >= ini && t < fim && e.amount > 0; })) retidos[m] = (retidos[m] ?? 0) + 1;
      }
    }
    const retencao: Record<string, number | null> = {};
    for (const m of marcos) retencao[`M${m}`] = elegiveis[m] ? (retidos[m] ?? 0) / elegiveis[m] : null;
    return { coorte, clientes: cs.length, fontes, receita: rec, ltvMedio: razao(rec.total, cs.length), retencao, amostraPequena: cs.length < minimoAmostra };
  });
}

// ---------------------------------------------------------------------------
// CAC, LTV:CAC, payback, ROAS
// ---------------------------------------------------------------------------
export interface ResultadoCac { valor: number | null; motivo?: string; rotulo: "media" | "fully_loaded" }
/** CAC de mídia: gasto rastreado / clientes atribuídos. Sem gasto rastreado, o custo é "não calculado", não zero. */
export function cacMidia(gastoMidia: number | null, novosClientesAtribuidos: number): ResultadoCac {
  if (gastoMidia == null) return { valor: null, motivo: "custo não calculado", rotulo: "media" };
  if (novosClientesAtribuidos <= 0) return { valor: null, motivo: gastoMidia > 0 ? "gasto sem cliente atribuído" : "sem gasto e sem cliente", rotulo: "media" };
  return { valor: gastoMidia / novosClientesAtribuidos, rotulo: "media" };
}
export function cacFullyLoaded(gastoMidia: number, custosVendasMarketing: number | null, novosClientes: number): ResultadoCac {
  if (custosVendasMarketing == null) return { valor: null, motivo: "custos de vendas/marketing não informados", rotulo: "fully_loaded" };
  return { valor: razao(gastoMidia + custosVendasMarketing, novosClientes), rotulo: "fully_loaded" };
}
export const custoPorLead = (gasto: number, leads: number) => razao(gasto, leads);
export const custoPorLeadQualificado = (gasto: number, qualificados: number) => razao(gasto, qualificados);
export const custoPorExperimental = (gasto: number, experimentais: number) => razao(gasto, experimentais);
export const custoPorVenda = (gasto: number, vendas: number) => razao(gasto, vendas);

/** LTV:CAC só quando ambos existem; rótulo diz se o LTV é observado ou projetado. */
export function ltvCac(ltv: number | null, cac: number | null, tipoLtv: "observado" | "projetado") {
  if (ltv == null || cac == null || cac <= 0) return { valor: null as number | null, rotulo: `LTV:CAC ${tipoLtv}`, motivo: cac == null ? "CAC não calculável" : ltv == null ? "LTV não calculável" : "CAC zero" };
  return { valor: ltv / cac, rotulo: `LTV:CAC ${tipoLtv}` };
}
/** Meses para recuperar o CAC. Receita: CAC / receita mensal média por cliente. Margem: idem com margem, só se informada. */
export function paybackMeses(cac: number | null, receitaMensalPorCliente: number | null, margemContribuicao?: number | null) {
  const receita = cac != null && receitaMensalPorCliente ? cac / receitaMensalPorCliente : null;
  const margem = cac != null && margemContribuicao != null && receitaMensalPorCliente ? cac / (receitaMensalPorCliente * margemContribuicao) : null;
  return { receitaMeses: receita, margemMeses: margem, margemInformada: margemContribuicao != null };
}
export const roasReceita = (receitaAtribuida: number, gasto: number) => razao(receitaAtribuida, gasto);

// ---------------------------------------------------------------------------
// Indicações
// ---------------------------------------------------------------------------
export function metricasIndicacao(clientes: Cliente[], leadsIndicados: number, vendasIndicadas: number, eventos: EventoReceita[]) {
  const indicadores = new Set(clientes.map((c) => c.referredBy).filter(Boolean) as string[]);
  const indicados = clientes.filter((c) => c.referredBy);
  return {
    clientesQueIndicaram: indicadores.size,
    referralRate: razao(indicadores.size, clientes.length),
    leadsIndicados, vendasIndicadas,
    referralConversionRate: razao(vendasIndicadas, leadsIndicados),
    receitaIndicados: indicados.reduce((s, c) => s + ltvRealizado(eventos, c.id), 0),
    ltvMedioIndicados: ltvMedio(indicados, eventos).medio,
    indicacoesPorIndicador: razao(indicados.length, indicadores.size),
  };
}

// ---------------------------------------------------------------------------
// Atribuição
// ---------------------------------------------------------------------------
export interface Toque { occurredAt: string; sourceCode: string; campaign?: string | null; content?: string | null; confidence?: "high" | "medium" | "low" }
export interface Atribuicao {
  firstTouch: Toque | null;
  leadCreationTouch: Toque | null;
  lastNonDirect: Toque | null;
  lastTouch: Toque | null;
  assisted: Toque[];
}
const DIRETOS = new Set(["direct", "whatsapp_direct"]);
/**
 * Preserva todas as perspectivas. `leadCreatedAt` define o lead creation touch
 * (último toque até o momento em que virou lead). Unknown NÃO é convertido em
 * direct: se só há unknown, é unknown.
 */
export function atribuir(toques: Toque[], leadCreatedAt?: string | null): Atribuicao {
  const t = [...toques].sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
  if (!t.length) return { firstTouch: null, leadCreationTouch: null, lastNonDirect: null, lastTouch: null, assisted: [] };
  const firstTouch = t[0];
  const lastTouch = t[t.length - 1];
  const naoDiretos = t.filter((x) => !DIRETOS.has(x.sourceCode));
  const lastNonDirect = naoDiretos.length ? naoDiretos[naoDiretos.length - 1] : lastTouch;
  const ateLead = leadCreatedAt ? t.filter((x) => new Date(x.occurredAt) <= new Date(leadCreatedAt)) : t;
  const leadCreationTouch = ateLead.length ? ateLead[ateLead.length - 1] : firstTouch;
  const assisted = t.filter((x) => x !== firstTouch && x !== lastNonDirect && x !== leadCreationTouch);
  return { firstTouch, leadCreationTouch, lastNonDirect, lastTouch, assisted };
}
/** Fonte a partir de UTM/click id/referrer. Sem evidência → unknown. */
export function inferirFonte(p: { utmSource?: string | null; utmMedium?: string | null; gclid?: string | null; gbraid?: string | null; wbraid?: string | null; fbclid?: string | null; referrer?: string | null; referralCode?: string | null }): { sourceCode: string; confidence: "high" | "medium" | "low" } {
  const s = (p.utmSource ?? "").toLowerCase(), m = (p.utmMedium ?? "").toLowerCase();
  if (p.referralCode) return { sourceCode: "referral_client", confidence: "high" };
  if (p.gclid || p.gbraid || p.wbraid) return { sourceCode: "google_ads", confidence: "high" };
  if (s.includes("instagram") || s === "ig") return { sourceCode: /paid|cpc|ads/.test(m) ? "instagram_ads" : "instagram_organic", confidence: "high" };
  if (s.includes("facebook") || s === "fb") return { sourceCode: /paid|cpc|ads/.test(m) ? "facebook_ads" : "facebook_organic", confidence: "high" };
  if (s === "google" && /cpc|paid|ppc/.test(m)) return { sourceCode: "google_ads", confidence: "high" };
  if (s === "tiktok") return { sourceCode: "tiktok", confidence: "high" };
  if (s === "youtube") return { sourceCode: "youtube", confidence: "high" };
  if (s === "qr" || m === "qr") return { sourceCode: "offline_qr", confidence: "high" };
  if (s === "personalporperto" || s === "personal_por_perto") return { sourceCode: "personal_por_perto", confidence: "high" };
  if (p.fbclid) return { sourceCode: "facebook_ads", confidence: "medium" };
  const r = (p.referrer ?? "").toLowerCase();
  if (r) {
    try {
      const host = new URL(r).hostname;
      if (/google\./.test(host)) return { sourceCode: "google_organic", confidence: "medium" };
      if (/instagram\.com|l\.instagram/.test(host)) return { sourceCode: "instagram_organic", confidence: "medium" };
      if (/facebook\.com|l\.facebook|fb\.com/.test(host)) return { sourceCode: "facebook_organic", confidence: "medium" };
      if (/tiktok\.com/.test(host)) return { sourceCode: "tiktok", confidence: "medium" };
      if (/youtube\.com|youtu\.be/.test(host)) return { sourceCode: "youtube", confidence: "medium" };
      if (/personalporperto/.test(host)) return { sourceCode: "personal_por_perto", confidence: "medium" };
      if (/montinhopersonal\.com\.br/.test(host)) return { sourceCode: "unknown", confidence: "low" };
      return { sourceCode: "other", confidence: "low" };
    } catch { /* referrer inválido */ }
  }
  return { sourceCode: "unknown", confidence: "low" };
}
/** Cobertura de atribuição: % de vendas (ou receita) com fonte conhecida. */
export function coberturaAtribuicao(itens: { sourceCode: string; peso?: number }[]) {
  const total = itens.reduce((s, i) => s + (i.peso ?? 1), 0);
  const conhecido = itens.filter((i) => i.sourceCode !== "unknown").reduce((s, i) => s + (i.peso ?? 1), 0);
  return razao(conhecido, total);
}

// ---------------------------------------------------------------------------
// Lead scoring explicável
// ---------------------------------------------------------------------------
export interface SinaisLead {
  diasDesdeUltimoContato: number | null; respondeu: boolean; pediuPreco: boolean; pediuHorario: boolean;
  experimentalAgendada: boolean; experimentalRealizada: boolean; propostaEnviada: boolean; respondeuProposta: boolean;
  interacoes: number; intencaoDeclarada: boolean;
}
export function classificarLead(s: SinaisLead, limites = { quenteMin: 5, mornoMin: 2 }) {
  const motivos: string[] = []; let pontos = 0;
  const add = (cond: boolean, p: number, m: string) => { if (cond) { pontos += p; motivos.push(m); } };
  add(s.experimentalRealizada, 3, "experimental realizada");
  add(s.experimentalAgendada && !s.experimentalRealizada, 2, "experimental agendada");
  add(s.respondeuProposta, 2, "respondeu à proposta");
  add(s.propostaEnviada && !s.respondeuProposta, 1, "proposta enviada");
  add(s.pediuHorario, 1, "perguntou horário");
  add(s.pediuPreco, 1, "perguntou preço");
  add(s.intencaoDeclarada, 1, "declarou intenção de começar");
  add(s.respondeu && s.diasDesdeUltimoContato != null && s.diasDesdeUltimoContato <= 1, 1, "respondeu hoje");
  add(s.interacoes >= 3, 1, `${s.interacoes} interações`);
  add(s.diasDesdeUltimoContato != null && s.diasDesdeUltimoContato > 7, -2, `${Math.round(s.diasDesdeUltimoContato ?? 0)} dias sem contato`);
  add(!s.respondeu, -1, "nunca respondeu");
  const temperatura = pontos >= limites.quenteMin ? "quente" : pontos >= limites.mornoMin ? "morno" : "frio";
  return { temperatura, pontos, motivos };
}

// ---------------------------------------------------------------------------
// Daily Decision Engine — regras transparentes, sem "AI score"
// ---------------------------------------------------------------------------
export interface LeadParaHoje { id: string; contactId: string; nome: string; status: string; createdAt: string; lastContactAt: string | null; firstResponseAt: string | null; nextAction: string | null; nextActionAt: string | null; stageCode: string | null; proposalSentAt: string | null; expectedValue: number | null; temperatura?: string; opportunityId?: string | null }
export interface TarefaParaHoje { id: string; leadId: string | null; clientId: string | null; contactId: string | null; nome: string; titulo: string; dueAt: string; priority: string }
export interface TrialParaHoje { id: string; leadId: string | null; contactId: string; nome: string; scheduledAt: string; status: string }
export interface ClienteParaHoje { id: string; contactId: string; nome: string; renewalDate: string | null; status: string }
export interface SlaConfig { novo_lead_sem_contato_horas: number; proposta_sem_follow_up_dias: number; lead_parado_dias: number; negociacao_antiga_dias: number }
export interface ItemHoje { prioridade: number; grupo: string; motivo: string; acao: string; contactId: string; leadId?: string | null; clientId?: string | null; taskId?: string | null; trialId?: string | null; nome: string; valor?: number | null }

export function prioridadesHoje(
  d: { leads: LeadParaHoje[]; tarefas: TarefaParaHoje[]; trials: TrialParaHoje[]; clientes: ClienteParaHoje[]; sla: SlaConfig; renovacaoDias: number[] },
  agora = new Date(),
): ItemHoje[] {
  const itens: ItemHoje[] = [];
  const h = (ms: number) => ms / 3_600_000;
  const fimHoje = new Date(agora); fimHoje.setHours(23, 59, 59, 999);
  const abertos = d.leads.filter((l) => l.status === "aberto");

  // 1. Lead novo sem contato além do SLA
  for (const l of abertos) {
    if (!l.firstResponseAt && !l.lastContactAt) {
      const horas = h(agora.getTime() - new Date(l.createdAt).getTime());
      itens.push({ prioridade: horas >= d.sla.novo_lead_sem_contato_horas ? 1 : 3, grupo: "novo_sem_contato", motivo: `Lead novo sem retorno há ${Math.round(horas)}h`, acao: "Fazer primeiro contato", contactId: l.contactId, leadId: l.id, nome: l.nome, valor: l.expectedValue });
    }
  }
  // 2. Follow-ups vencidos e de hoje
  for (const t of d.tarefas) {
    const due = new Date(t.dueAt);
    if (due < agora) itens.push({ prioridade: 2, grupo: "follow_up_atrasado", motivo: `Follow-up atrasado desde ${due.toLocaleDateString("pt-BR")}: ${t.titulo}`, acao: t.titulo, contactId: t.contactId ?? "", leadId: t.leadId, clientId: t.clientId, taskId: t.id, nome: t.nome });
    else if (due <= fimHoje) itens.push({ prioridade: 4, grupo: "follow_up_hoje", motivo: `Follow-up hoje: ${t.titulo}`, acao: t.titulo, contactId: t.contactId ?? "", leadId: t.leadId, clientId: t.clientId, taskId: t.id, nome: t.nome });
  }
  // 3. Leads quentes
  for (const l of abertos) if (l.temperatura === "quente") itens.push({ prioridade: 3, grupo: "quente", motivo: "Lead quente", acao: l.nextAction ?? "Avançar a negociação", contactId: l.contactId, leadId: l.id, nome: l.nome, valor: l.expectedValue });
  // 4. Experimentais próximas (próximas 24h)
  for (const t of d.trials) {
    const s = new Date(t.scheduledAt);
    if (t.status === "agendada" && s >= agora && h(s.getTime() - agora.getTime()) <= 24) itens.push({ prioridade: 4, grupo: "experimental_proxima", motivo: `Experimental ${s.toLocaleString("pt-BR", { weekday: "short", hour: "2-digit", minute: "2-digit" })}`, acao: "Confirmar presença", contactId: t.contactId, leadId: t.leadId, trialId: t.id, nome: t.nome });
    if (t.status === "agendada" && s < agora) itens.push({ prioridade: 2, grupo: "experimental_sem_registro", motivo: "Experimental passou sem registro de presença", acao: "Registrar realizada ou no-show", contactId: t.contactId, leadId: t.leadId, trialId: t.id, nome: t.nome });
  }
  // 5. Pós-experimental sem proposta
  for (const l of abertos) if (l.stageCode === "experimental_realizada" && !l.proposalSentAt) itens.push({ prioridade: 2, grupo: "pos_experimental_sem_proposta", motivo: "Experimental realizada e proposta ainda não enviada", acao: "Enviar proposta", contactId: l.contactId, leadId: l.id, nome: l.nome, valor: l.expectedValue });
  // 6. Proposta sem follow-up
  for (const l of abertos) if (l.proposalSentAt && l.stageCode === "proposta") {
    const dias = diasEntre(l.lastContactAt ?? l.proposalSentAt, agora);
    if (dias >= d.sla.proposta_sem_follow_up_dias) itens.push({ prioridade: 2, grupo: "proposta_sem_follow_up", motivo: `Proposta enviada há ${Math.round(diasEntre(l.proposalSentAt, agora))} dias sem follow-up`, acao: "Fazer follow-up", contactId: l.contactId, leadId: l.id, nome: l.nome, valor: l.expectedValue });
  }
  // 7. Negociações antigas / leads parados
  for (const l of abertos) {
    const ref = l.lastContactAt ?? l.createdAt;
    const dias = diasEntre(ref, agora);
    if (l.stageCode === "negociacao" && dias >= d.sla.negociacao_antiga_dias) itens.push({ prioridade: 5, grupo: "negociacao_antiga", motivo: `Negociação parada há ${Math.round(dias)} dias`, acao: "Retomar", contactId: l.contactId, leadId: l.id, nome: l.nome, valor: l.expectedValue });
    else if (dias >= d.sla.lead_parado_dias && l.lastContactAt) itens.push({ prioridade: 5, grupo: "parado", motivo: `Sem contato há ${Math.round(dias)} dias`, acao: "Retomar", contactId: l.contactId, leadId: l.id, nome: l.nome, valor: l.expectedValue });
    if (!l.nextActionAt) itens.push({ prioridade: 6, grupo: "sem_proxima_acao", motivo: "Lead aberto sem próxima ação", acao: "Definir próxima ação", contactId: l.contactId, leadId: l.id, nome: l.nome, valor: l.expectedValue });
  }
  // 8. Renovações próximas
  for (const c of d.clientes) if (c.status === "ativo" && c.renewalDate) {
    const dias = Math.ceil(diasEntre(agora, c.renewalDate));
    if (dias < 0) itens.push({ prioridade: 5, grupo: "renovacao_vencida", motivo: `Renovação venceu há ${-dias} dias`, acao: "Confirmar renovação", contactId: c.contactId, clientId: c.id, nome: c.nome });
    else if (d.renovacaoDias.some((x) => dias <= x)) itens.push({ prioridade: 7, grupo: "renovacao_proxima", motivo: `Renovação em ${dias} dias`, acao: "Falar sobre renovação", contactId: c.contactId, clientId: c.id, nome: c.nome });
  }
  // Uma pessoa, um card: fica o item de maior prioridade por contato (motivos agregados).
  const porContato = new Map<string, ItemHoje & { motivos: string[] }>();
  for (const i of itens.sort((a, b) => a.prioridade - b.prioridade)) {
    const k = i.contactId || `${i.grupo}:${i.taskId ?? i.trialId}`;
    const ex = porContato.get(k);
    if (!ex) porContato.set(k, { ...i, motivos: [i.motivo] });
    else if (!ex.motivos.includes(i.motivo)) ex.motivos.push(i.motivo);
  }
  return [...porContato.values()].map((x) => ({ ...x, motivo: x.motivos.join(" · ") }));
}

// ---------------------------------------------------------------------------
// Anomalias com amostra mínima
// ---------------------------------------------------------------------------
export function anomalia(nome: string, atual: number, anterior: number, opts = { minimo: 10, limiar: 0.4 }): { alerta: boolean; texto: string } {
  if (anterior < opts.minimo && atual < opts.minimo) return { alerta: false, texto: `${nome}: amostra pequena (${anterior} → ${atual}), sem alerta.` };
  if (anterior === 0) return { alerta: atual >= opts.minimo, texto: `${nome}: de 0 para ${atual}.` };
  const var_ = atual / anterior - 1;
  const alerta = Math.abs(var_) >= opts.limiar;
  return { alerta, texto: `${nome}: ${anterior} → ${atual} (${var_ >= 0 ? "+" : ""}${Math.round(var_ * 100)}%, n=${anterior + atual}).` };
}

// ---------------------------------------------------------------------------
// Deduplicação (espelho em TS da função SQL)
// ---------------------------------------------------------------------------
export function normalizarTelefoneE164(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const d = raw.replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("55") && (d.length === 12 || d.length === 13)) return `+${d}`;
  if (d.length === 10 || d.length === 11) return `+55${d}`;
  if (raw.trim().startsWith("+") && d.length >= 8 && d.length <= 15) return `+${d}`;
  return null;
}
export function possiveisDuplicatas<T extends { id: string; telefoneE164?: string | null; email?: string | null }>(contatos: T[]): { a: T; b: T; motivo: string }[] {
  const out: { a: T; b: T; motivo: string }[] = [];
  const porTel = new Map<string, T>(), porEmail = new Map<string, T>();
  for (const c of contatos) {
    if (c.telefoneE164) { const o = porTel.get(c.telefoneE164); if (o) out.push({ a: o, b: c, motivo: "mesmo telefone" }); else porTel.set(c.telefoneE164, c); }
    const e = c.email?.toLowerCase();
    if (e) { const o = porEmail.get(e); if (o && !out.some((x) => x.a === o && x.b === c)) out.push({ a: o, b: c, motivo: "mesmo e-mail" }); else if (!o) porEmail.set(e, c); }
  }
  return out;
}
