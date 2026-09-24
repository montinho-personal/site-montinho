/**
 * O motor do "Meu Shape em 12 Semanas".
 *
 * A PERGUNTA É OUTRA
 *
 * O Simulador de Emagrecimento pergunta "quando chego ao meu peso?". O de
 * Ganho de Massa, "quanto tempo até o peso que eu quero?". Este fixa o
 * prazo — 12 semanas — e pergunta "o que dá para construir nelas, e o que
 * mais muda o resultado?". O peso deixa de ser protagonista: o resultado é
 * um painel de sinais (peso, treinos acumulados, cintura como tendência,
 * força por fase, consistência).
 *
 * NENHUMA MATEMÁTICA NOVA DE PESO
 *
 * Emagrecer usa o motor de emagrecimento; ganhar massa, o de massa;
 * recomposição usa o de emagrecimento com déficit leve (10%). Assim os três
 * simuladores nunca se contradizem. O que é novo aqui é só o que os outros
 * não fazem:
 *
 * - TREINOS ACUMULADOS: planejados × consistência. Aritmética, não modelo.
 * - RECOMEÇAR RÁPIDO: duas pessoas com a mesma chance de faltar a um
 *   treino. A Pessoa B falta e volta no seguinte; a Pessoa A falta e larga
 *   o resto da semana. O valor esperado é exato: B faz n·c por semana; A faz
 *   c + c² + … + cⁿ (só segue enquanto não falta).
 * - VIABILIDADE DA RECOMPOSIÇÃO por perfil (Barakat 2020): provável em
 *   iniciantes, em quem volta a treinar e em quem tem mais gordura; mais
 *   lenta em avançados. Tendência, nunca quilos.
 * - GARGALO por regras fixas, com as regras de "não mais é melhor":
 *   6 treinos + sono curto nunca vira "treine mais".
 *
 * O QUE ELE SE RECUSA A FAZER
 *
 * Quilos de músculo e de gordura; centímetros de cintura; número de força;
 * bônus por caneta ou hormônio; qualquer imagem de corpo.
 */

import * as S from "./emagrecimento";
import * as M from "./massa";

/* ───────────────────────── Tipos ───────────────────────── */

export type Objetivo12 = "emagrecer" | "recomp" | "massa" | "nao-sei";
export type Espelho = "barriga" | "definicao" | "massa" | "gluteos" | "superior" | "atletico" | "tudo" | "nao-sei";
export type Experiencia12 = "nunca" | "lt6m" | "6a12" | "1a2" | "2a4" | "gt4" | "para-e-volta";
export type Tempo = "lt30" | "30a45" | "45a60" | "60a75" | "gt75";
export type Estruturado = "sim" | "mais-ou-menos" | "lembro" | "nao-treino";
export type Acompanha12 = "sim" | "mais-ou-menos" | "nao" | "nao-sei";
export type Esforco = "muitas" | "algumas" | "1-2" | "falha" | "nao-sei";
export type ConsistHist = "lt50" | "60" | "75" | "quase" | "100";
export type Rotina12 = "sentado" | "caminho-pouco" | "ando-bastante" | "em-pe" | "fisico" | "muito-ativo";
export type Passos12 = "lt3" | "3a5" | "5a75" | "75a10" | "10a15" | "gt15" | "nao-sei";
export type Cardio12 = "nao" | "1a2" | "3a4" | "5+";
export type Comida = "emagrecer" | "ganhar" | "normal" | "varia" | "nao-sei";
export type Sono = "lt5" | "5a6" | "6a7" | "7a8" | "gt8" | "varia";
export type FimSemana = "nao" | "um-pouco" | "bastante" | "varia" | "nao-informar";

export interface Medidas { cintura?: number; abdomen?: number; quadril?: number; braco?: number; coxa?: number; peito?: number }

export interface Perfil12 {
  objetivo: Objetivo12;
  espelho: Espelho[];
  idade: number; sexo: S.Sexo; alturaCm: number; pesoKg: number; gorduraPct: number | null;
  medidas: Medidas;
  experiencia: Experiencia12; treinos: number; tempo: Tempo; estruturado: Estruturado;
  acompanha: Acompanha12; esforco: Esforco; consistHist: ConsistHist;
  rotina: Rotina12; passos: Passos12; cardio: Cardio12;
  comida: Comida; kcalDia: number | null; proteinaG: number | null; sono: Sono | null; fimSemana: FimSemana | null;
  medicacao: S.Medicacao | null; hormonio: S.Hormonio | null; historicoPeso: M.HistoricoPeso | null;
}

export interface Cenario12 { treinos: number; passos: number; consistencia: number }

export const SEMANAS = 12;
export const CONSIST_HIST: Record<ConsistHist, number> = { lt50: 0.5, "60": 0.6, "75": 0.75, quase: 0.9, "100": 1 };
export const PASSOS12: Record<Passos12, number> = { lt3: 2500, "3a5": 4000, "5a75": 6250, "75a10": 8750, "10a15": 12500, gt15: 16000, "nao-sei": 5000 };

/* ───────────────────────── Tradução para os motores irmãos ───────────────────────── */

/** Rotina de 6 opções → fator dos motores; cardio frequente sobe um degrau. */
function rotinaMotor(p: Perfil12): S.Rotina {
  const base: S.Rotina = ({ sentado: "sentado", "caminho-pouco": "sentado", "em-pe": "em-pe", "ando-bastante": "ativo", fisico: "fisico", "muito-ativo": "fisico" } as const)[p.rotina];
  if (p.cardio === "3a4" || p.cardio === "5+") return base === "sentado" ? "em-pe" : base === "em-pe" ? "ativo" : "fisico";
  return base;
}
const faixaPassosMotor = (p: Passos12): S.FaixaPassos => (p === "10a15" || p === "gt15" ? "gt10" : p);

function experienciaMassa(e: Experiencia12): { experiencia: M.Experiencia; continuidade: M.Continuidade } {
  return e === "para-e-volta" ? { experiencia: "1a2", continuidade: "para-e-volta" } : { experiencia: e, continuidade: "continuo" };
}

/** O caminho que o motor vai projetar. "Não sei" vira o primeiro dos dois caminhos sugeridos. */
export function caminho(p: Perfil12): Exclude<Objetivo12, "nao-sei"> {
  return p.objetivo === "nao-sei" ? caminhosSugeridos(p)[0] : p.objetivo;
}

/**
 * "Quero melhorar o shape, mas não sei o caminho." Não diagnostica: aponta
 * dois caminhos para a pessoa considerar, a partir de IMC, percentual
 * informado e do que ela quer ver no espelho.
 */
export function caminhosSugeridos(p: Perfil12): [Exclude<Objetivo12, "nao-sei">, Exclude<Objetivo12, "nao-sei">] {
  const imc = S.imc(p.pesoKg, p.alturaCm);
  const gorduraAlta = p.gorduraPct !== null ? p.gorduraPct > (p.sexo === "m" ? 25 : 32) : imc >= 27;
  const magro = p.gorduraPct !== null ? p.gorduraPct < (p.sexo === "m" ? 12 : 20) && imc < 22 : imc < 20;
  const querMassa = p.espelho.some((e) => e === "massa" || e === "superior" || e === "gluteos");
  if (gorduraAlta) return ["emagrecer", "recomp"];
  if (magro) return ["massa", "recomp"];
  return querMassa ? ["recomp", "massa"] : ["recomp", "emagrecer"];
}

function perfilEmag(p: Perfil12): S.Perfil {
  return { idade: p.idade, sexo: p.sexo, alturaCm: p.alturaCm, pesoKg: p.pesoKg, metaKg: null, rotina: rotinaMotor(p), treinos: p.treinos, tiposTreino: ["musculacao"], passos: faixaPassosMotor(p.passos), kcalDia: p.kcalDia };
}
function perfilMassa(p: Perfil12): M.PerfilMassa {
  const tendencia: M.Tendencia = p.comida === "ganhar" ? "subindo-devagar" : p.comida === "emagrecer" ? "perdendo" : "igual";
  return {
    objetivo: "massa", idade: p.idade, sexo: p.sexo, alturaCm: p.alturaCm, pesoKg: p.pesoKg, metaKg: null, gorduraPct: p.gorduraPct,
    ...experienciaMassa(p.experiencia), treinos: p.treinos,
    acompanha: p.acompanha === "sim" ? "anota" : p.acompanha === "mais-ou-menos" ? "nocao" : "nao",
    tendencia, kcalDia: p.kcalDia, apetite: "normal", dificuldade: "nao-sei", proteinaG: p.proteinaG,
    rotina: rotinaMotor(p), passos: faixaPassosMotor(p.passos), cardio: p.cardio === "nao" ? "nao" : p.cardio,
    suplementos: [], hormonio: p.hormonio ?? "nao", historicoPeso: p.historicoPeso ?? "sempre",
  };
}

/* ───────────────────────── Projeção ───────────────────────── */

export interface Ponto12 { semana: number; peso: number; min: number; max: number }

export interface Projecao12 {
  caminho: Exclude<Objetivo12, "nao-sei">;
  pontos: Ponto12[];
  variacao12: { centro: number; min: number; max: number };
  planejados: number;
  realizados: number;
  /** Pessoa A (larga a semana depois de faltar) × Pessoa B (volta no seguinte). */
  recomeco: { largaSemana: number; voltaRapido: number };
  /** Tendência qualitativa da cintura, só quando medida. */
  cintura: "cai" | "estavel" | "sobe-pouco" | null;
  /** Viabilidade da recomposição (Barakat 2020), quando o caminho é recomposição. */
  recomp: "provavel" | "possivel" | "lenta" | null;
}

/** Valor esperado de sessões por semana para quem larga a semana na primeira falta: c + c² + … + cⁿ. */
export const sessoesLargando = (n: number, c: number) => { let s = 0, t = 1; for (let k = 0; k < n; k++) { t *= c; s += t; } return s; };

export function projeta12(p: Perfil12, c: Cenario12): Projecao12 {
  const cam = caminho(p);
  let pontos: Ponto12[];
  if (cam === "massa") {
    const pm = perfilMassa(p);
    const pr = M.projetaMassa(pm, { superavit: M.ritmos(pm)[1].superavit, treinos: c.treinos, consistencia: c.consistencia, progressao: p.acompanha === "sim" ? "sim" : p.acompanha === "mais-ou-menos" ? "pouco" : "nao" });
    pontos = pr.pontos.slice(0, SEMANAS + 1).map((x) => ({ semana: x.semana, peso: x.peso, min: x.min, max: x.max }));
  } else {
    const pe = perfilEmag(p);
    const comida: S.NivelComida = cam === "recomp" ? "leve" : p.kcalDia !== null && p.comida === "emagrecer" ? "hoje" : "moderado";
    const pr = S.projeta(pe, { treinos: c.treinos, passos: c.passos, consistencia: c.consistencia, comida });
    pontos = pr.pontos.slice(0, SEMANAS + 1).map((x) => ({ semana: x.semana, peso: x.peso, min: x.min, max: x.max }));
  }
  const f = pontos[SEMANAS];
  const planejados = c.treinos * SEMANAS;
  const d = f.peso - p.pesoKg;
  const nivel = M.nivelDe(experienciaMassa(p.experiencia).experiencia, experienciaMassa(p.experiencia).continuidade);
  const imc = S.imc(p.pesoKg, p.alturaCm);
  const gorduraAlta = p.gorduraPct !== null ? p.gorduraPct > (p.sexo === "m" ? 22 : 30) : imc >= 27;
  return {
    caminho: cam, pontos,
    variacao12: { centro: d, min: f.min - p.pesoKg, max: f.max - p.pesoKg },
    planejados, realizados: Math.round(planejados * c.consistencia),
    recomeco: { largaSemana: Math.round(SEMANAS * sessoesLargando(c.treinos, c.consistencia)), voltaRapido: Math.round(planejados * c.consistencia) },
    cintura: p.medidas.cintura === undefined ? null : d < -0.8 ? "cai" : d > 1.2 ? "sobe-pouco" : "estavel",
    recomp: cam !== "recomp" ? null : nivel === "iniciante" || p.experiencia === "para-e-volta" || gorduraAlta ? "provavel" : nivel === "intermediario" ? "possivel" : "lenta",
  };
}

export function cenarioAtual12(p: Perfil12): Cenario12 {
  return { treinos: p.treinos, passos: PASSOS12[p.passos], consistencia: CONSIST_HIST[p.consistHist] };
}

/* ───────────────────────── O que mais muda ───────────────────────── */

export interface Impacto12 { alavanca: "treino" | "passos" | "consistencia"; descricao: string; ganho: number; unidade: "kg" | "treinos" }

/**
 * Emagrecer e recomposição: quanto cada ajuste muda o peso em 12 semanas.
 * Ganhar massa: o peso não é a métrica certa (mais passos "pioram" a
 * balança e melhoram a saúde), então compara treinos realizados — e só
 * treino e consistência entram.
 */
export function impactos12(p: Perfil12, c: Cenario12): Impacto12[] {
  const cam = caminho(p);
  const base = projeta12(p, c);
  const testes: { alavanca: Impacto12["alavanca"]; descricao: string; c: Cenario12 }[] = [];
  if (c.treinos < 6) testes.push({ alavanca: "treino", descricao: `treinar ${c.treinos + 1}x por semana em vez de ${c.treinos}x`, c: { ...c, treinos: c.treinos + 1 } });
  if (cam !== "massa" && c.passos < 12500) testes.push({ alavanca: "passos", descricao: "andar cerca de 2.500 passos a mais por dia", c: { ...c, passos: c.passos + 2500 } });
  if (c.consistencia < 1) { const n = Math.min(1, Math.round((c.consistencia + 0.15) * 100) / 100); testes.push({ alavanca: "consistencia", descricao: `fazer ${Math.round(n * 100)}% dos treinos planejados em vez de ${Math.round(c.consistencia * 100)}%`, c: { ...c, consistencia: n } }); }
  return testes.map((t) => {
    const pr = projeta12(p, t.c);
    return cam === "massa"
      ? { alavanca: t.alavanca, descricao: t.descricao, ganho: pr.realizados - base.realizados, unidade: "treinos" as const }
      : { alavanca: t.alavanca, descricao: t.descricao, ganho: base.pontos[SEMANAS].peso - pr.pontos[SEMANAS].peso, unidade: "kg" as const };
  }).sort((a, b) => b.ganho - a.ganho);
}

export function insight12(l: Impacto12[]): Impacto12 | null {
  if (!l.length) return null;
  const [v, s] = l;
  if (v.ganho < (v.unidade === "kg" ? 0.3 : 2)) return null;
  if (s && s.ganho > 0 && v.ganho < s.ganho * 1.25) return null;
  return v;
}

/* ───────────────────────── Gargalo ───────────────────────── */

export type Gargalo12 = "saude" | "sono" | "recuperacao" | "consistencia" | "treino" | "movimento" | "comida" | "fim-de-semana" | "bem";

export interface Diag12 { gargalo: Gargalo12; titulo: string; texto: string; primeiro: string; cta: string }

/** Regras fixas, em ordem. A primeira que casa vence. "Pelas suas respostas", nunca diagnóstico. */
export function diagnostico12(p: Perfil12): Diag12 {
  const cam = caminho(p);
  const sonoCurto = p.sono === "lt5" || p.sono === "5a6";
  const consistBaixa = CONSIST_HIST[p.consistHist] < 0.75 || p.experiencia === "para-e-volta";
  const semProgressao = p.acompanha === "nao" || p.acompanha === "nao-sei" || p.estruturado === "lembro" || p.esforco === "muitas";
  if (p.historicoPeso === "sem-querer")
    return { gargalo: "saude", titulo: "Antes do plano, uma conversa", texto: "Você contou que perdeu peso sem querer. Não é diagnóstico de nada — mas vale conversar com um profissional de saúde antes de mexer em comida. O treino pode começar leve enquanto isso.", primeiro: "Eu começaria entendendo por que o peso caiu. As 12 semanas podem esperar essa resposta.", cta: "Quero organizar meu treino" };
  if (p.treinos >= 6 && (sonoCurto || p.sono === "varia"))
    return { gargalo: "recuperacao", titulo: "Mais treino não é o que falta", texto: "Seis ou mais treinos por semana com sono curto ou irregular: o limite aqui provavelmente é recuperação, não estímulo. Somar treino nesse cenário tende a piorar, não a acelerar.", primeiro: "Eu não aumentaria nada. Olharia primeiro o sono e, se preciso, trocaria um dia de treino por um de descanso de verdade.", cta: "Quero treinar com estratégia" };
  if (sonoCurto && cam !== "massa")
    return { gargalo: "sono", titulo: "O sono pode estar decidindo o que você perde", texto: "Com a mesma dieta, dormir 5,5 h em vez de 8,5 h fez as pessoas perderem o mesmo peso — mas com 55% menos gordura e 60% mais massa magra no pacote (Nedeltcheva, 2010). Em 12 semanas de déficit, isso pesa.", primeiro: "Antes de mexer em treino ou comida, eu tentaria ganhar 30 a 60 minutos de sono na maioria das noites.", cta: "Quero começar minhas 12 semanas" };
  if (consistBaixa)
    return { gargalo: "consistencia", titulo: "O plano existe; ele só não acontece o bastante", texto: `Com ${Math.round(CONSIST_HIST[p.consistHist] * 100)}% dos treinos feitos, 12 semanas de ${p.treinos || 3}x viram ${Math.round((p.treinos || 3) * 12 * CONSIST_HIST[p.consistHist])} sessões em vez de ${(p.treinos || 3) * 12}. O corpo responde às feitas.`, primeiro: "Seu maior problema talvez não seja saber o que fazer — é conseguir fazer por tempo suficiente. Eu reduziria o plano até ele caber, e mediria só uma coisa: treinos feitos.", cta: "Quero conseguir manter" };
  if (p.experiencia === "nunca" || p.estruturado === "nao-treino")
    return { gargalo: "treino", titulo: "O primeiro passo é ter um treino — e só depois um treino perfeito", texto: "Nas primeiras semanas de musculação, o corpo responde a quase qualquer estímulo bem feito: técnica, força e coordenação sobem rápido. O que decide as 12 semanas não é o programa ideal, é começar com um que caiba na sua rotina e ir anotando.", primeiro: "Eu começaria com 2 a 3 treinos de corpo inteiro por semana, poucos exercícios, e anotaria carga e repetições desde o primeiro dia.", cta: "Quero começar minhas 12 semanas" };
  if (semProgressao)
    return { gargalo: "treino", titulo: "Treino sem progressão vira manutenção", texto: p.esforco === "muitas" ? "Terminar as séries importantes sobrando muitas repetições é estímulo de sobra no tanque. Hipertrofia pede séries que cheguem perto do limite, com carga que sobe ao longo das semanas." : "Sem anotar carga e repetições, ninguém sabe se o estímulo cresceu — e 12 semanas repetindo o mesmo treino rendem menos do que parecem.", primeiro: "Eu escolheria 4 a 6 exercícios principais e anotaria carga × repetições em todo treino. A meta é um número subir a cada uma ou duas semanas.", cta: "Quero treinar com estratégia" };
  if ((p.passos === "lt3" || (p.rotina === "sentado" && p.passos !== "75a10" && p.passos !== "10a15" && p.passos !== "gt15")) && cam !== "massa")
    return { gargalo: "movimento", titulo: "O limitador não parece ser falta de treino", texto: "Sua atividade diária está baixa. Treino acontece 3 ou 4 vezes por semana; o movimento do dia acontece sete — e, somado, costuma pesar mais que um treino extra.", primeiro: "Eu somaria 2.000 passos ao que você faz hoje antes de pensar em outro dia de academia.", cta: "Quero começar minhas 12 semanas" };
  if ((cam === "emagrecer" && p.comida === "ganhar") || (cam === "massa" && p.comida === "emagrecer"))
    return { gargalo: "comida", titulo: "A comida está puxando para o outro lado", texto: cam === "massa" ? "Você quer ganhar massa e está comendo para emagrecer. Dá para melhorar o shape assim (recomposição), mas o peso não vai subir." : "Você quer emagrecer e está comendo para ganhar peso. O treino sozinho não compensa essa direção.", primeiro: "Eu alinharia primeiro a direção da comida com o objetivo — depois o resto.", cta: cam === "massa" ? "Quero um treino para hipertrofia" : "Quero começar minhas 12 semanas" };
  if (p.fimSemana === "bastante")
    return { gargalo: "fim-de-semana", titulo: "O fim de semana desfaz parte da semana", texto: "Pesando adultos todos os dias por um ano, o peso subia de sexta a domingo e caía de segunda a quinta — quem não perdia o fim de semana emagrecia (Racette, 2008). Não é moral; é conta.", primeiro: "Eu não cortaria o fim de semana: tornaria ele “meio certo”. Uma refeição livre, não duas; um dia de movimento, não zero.", cta: "Quero começar minhas 12 semanas" };
  return { gargalo: "bem", titulo: "Pelas suas respostas, você já está indo bem", texto: "Consistência, treino com progressão e rotina razoável: esse é o cenário em que 12 semanas rendem. O erro mais comum aqui é apertar tudo por ansiedade.", primeiro: "Eu não mudaria nada agora. Mediria: peso em média semanal, cintura a cada duas semanas, cargas em todo treino — e olharia os dados na semana 4.", cta: cam === "massa" ? "Quero um treino para hipertrofia" : "Quero começar minhas 12 semanas" };
}

/* ───────────────────────── Guardrails ───────────────────────── */

export type Bloqueio12 = { tipo: "menor" } | { tipo: "gestacao" } | { tipo: "imc-baixo-emagrecer" };

export function bloqueio12(idade: number, gestante: boolean, objetivo: Objetivo12, pesoKg: number, alturaCm: number): Bloqueio12 | null {
  if (idade < 18) return { tipo: "menor" };
  if (gestante) return { tipo: "gestacao" };
  if (objetivo === "emagrecer" && S.imc(pesoKg, alturaCm) < 18.5) return { tipo: "imc-baixo-emagrecer" };
  return null;
}

/* ───────────────────────── Datas ───────────────────────── */

export function checkpoints(hoje: Date): { semana: number; data: Date }[] {
  return [0, 4, 8, 12].map((s) => { const d = new Date(hoje); d.setDate(d.getDate() + s * 7); return { semana: s, data: d }; });
}
export const fmtData = (d: Date) => d.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });

/* ───────────────────────── Força por fase (sem número) ───────────────────────── */

export const FASES = [
  { id: 1, titulo: "Semanas 1–4 · Construir o ritmo", foco: "Consistência, técnica e começar a coletar dados.", forca: "A força costuma subir rápido — mas é principalmente o sistema nervoso aprendendo o movimento, não músculo novo ainda." },
  { id: 2, titulo: "Semanas 5–8 · Consolidar", foco: "Agora há dados, não impressão: planejado × realizado, peso médio, cintura, cargas.", forca: "Por volta das semanas 6 a 8, o crescimento muscular passa a pesar mais que a adaptação neural no ganho de força." },
  { id: 3, titulo: "Semanas 9–12 · Refinar", foco: "Ajustar pelo que os seus dados mostram — não simplesmente “fazer mais”.", forca: "Força subindo com cintura estável ou caindo é um dos sinais mais claros de que o shape está mudando." },
] as const;

export const FONTES_12 = [
  { rotulo: "Barakat C, Pearson J, Escalante G, Campbell B, De Souza EO. Body Recomposition: Can Trained Individuals Build Muscle and Lose Fat at the Same Time? Strength & Conditioning Journal, 2020;42(5):7-21", url: "https://journals.lww.com/nsca-scj/Fulltext/2020/10000/Body_Recomposition__Can_Trained_Individuals_Build.3.aspx", resumo: "recomposição acontece com mais facilidade em iniciantes, em quem volta a treinar e em quem tem mais gordura; é mais lenta em avançados." },
  { rotulo: "Seynnes OR, de Boer M, Narici MV. Early skeletal muscle hypertrophy and architectural changes in response to high-intensity resistance training. Journal of Applied Physiology, 2007;102:368-373", url: "https://journals.physiology.org/doi/full/10.1152/japplphysiol.00789.2006", resumo: "hipertrofia mensurável já nas primeiras semanas; a força inicial vem principalmente de adaptação neural." },
  { rotulo: "Nedeltcheva AV et al. Insufficient Sleep Undermines Dietary Efforts to Reduce Adiposity. Annals of Internal Medicine, 2010;153:435-441", url: "https://www.acpjournals.org/doi/abs/10.7326/0003-4819-153-7-201010050-00006", resumo: "com o mesmo déficit, 5,5 h de sono levaram a 55% menos gordura e 60% mais massa magra perdidas que 8,5 h." },
  { rotulo: "Racette SB et al. Influence of Weekend Lifestyle Patterns on Body Weight. Obesity, 2008;16:1826-1830", url: "https://onlinelibrary.wiley.com/doi/10.1038/oby.2008.320", resumo: "o peso sobe de sexta a domingo e cai de segunda a quinta." },
  { rotulo: "World Health Organization. Waist Circumference and Waist–Hip Ratio: Report of a WHO Expert Consultation, 2008", url: "https://iris.who.int/server/api/core/bitstreams/ca408ade-05c9-4b7c-8967-6ee5b5e0ccd8/content", resumo: "o protocolo de medida da cintura usado nos checkpoints." },
];

export const ARTIGOS_COM_LINK_SHAPE12: string[] = ["quanto-tempo-para-aparecer-resultado-na-academia", "antes-e-depois-musculacao"];
