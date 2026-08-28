/**
 * O motor: respostas → mapa → prioridades → protocolo.
 *
 * Nada aqui usa if encadeado por região. As regras operam sobre os dados de
 * testes.ts e exercicios.ts, então acrescentar uma região no futuro não pede
 * mudança neste arquivo — pede um registro novo lá.
 *
 * Três travas duras, todas vindas da literatura e todas em código e não em
 * texto de tela, porque texto de tela ninguém obedece:
 *
 *   1. Pré-treino não recebe sustentação estática acima de 30 s por grupo
 *      (Behm et al.: ≥60 s custa cerca de 4,6% de desempenho; abaixo disso, 1,1%).
 *   2. O volume semanal por região mira 600 s (Ingram et al.: o ganho satura
 *      por volta de dez minutos semanais por grupo muscular).
 *   3. No máximo duas prioridades e quatro exercícios. Não é preferência
 *      estética: é a diferença entre um protocolo feito e um protocolo lido.
 */

import { ALVO_SEMANAL_SEGUNDOS, TETO_ESTATICO_PRE } from "./evidencia";
import { EXERCICIOS } from "./exercicios";
import { REGIOES_POR_DIFICULDADE, TESTES, TESTE_POR_ID, NOME_REGIAO } from "./testes";
import type {
  Contexto,
  Estado,
  EstadoRegiao,
  ExercicioMobilidade,
  ItemProtocolo,
  Lado,
  Mapa,
  Prioridade,
  Protocolo,
  RegiaoId,
  Resposta,
  Unidade,
} from "./tipos";

export const REGIOES: RegiaoId[] = ["tornozelo", "ombro", "toracica", "quadril", "posterior"];

/** Ordem da escala, para comparar estados e medir assimetria. */
const ORDEM: Record<Estado, number> = { prioridade: 0, melhorar: 1, boa: 2, naoAvaliado: 3 };

// ─── 1. Quais testes mostrar ────────────────────────────────────────────────

/**
 * Seleção adaptativa.
 *
 * A pessoa que já disse onde o sapato aperta não deveria responder sobre o
 * resto. Mas a seleção nunca fica vazia nem enorme: piso de três testes (senão
 * o mapa não diz nada) e teto de cinco (senão vira o teste completo com passos
 * extras).
 *
 * As observações do agachamento entram com o mesmo peso das dificuldades
 * declaradas — a tela existe justamente para pegar quem não sabe nomear o
 * problema.
 */
export function selecionaTestes(
  dificuldades: string[],
  observacoesAgachamento: string[] = [],
  completo = false,
): string[] {
  if (completo || dificuldades.includes("nenhuma") || dificuldades.length === 0) {
    return TESTES.map((t) => t.id);
  }

  const regioes = new Set<string>();
  for (const d of dificuldades) {
    for (const r of REGIOES_POR_DIFICULDADE[d] ?? []) regioes.add(r);
  }
  for (const r of observacoesAgachamento) regioes.add(r);

  // Piso de três: completa na ordem da bateria, que já é a ordem de evidência.
  for (const t of TESTES) {
    if (regioes.size >= 3) break;
    regioes.add(t.regiao);
  }

  const ids = TESTES.filter((t) => regioes.has(t.regiao)).map((t) => t.id);
  return ids.slice(0, 5);
}

// ─── 2. Classificação ───────────────────────────────────────────────────────

/**
 * Classifica uma medida numérica do knee-to-wall.
 *
 * As duas escalas têm cortes próprios e jamais se convertem. Um valor em dedos
 * classificado por corte em centímetros produziria "prioridade" para todo mundo.
 */
export function classificaMedida(
  valor: number,
  unidade: Unidade,
  testeId = "knee-to-wall",
): Exclude<Estado, "naoAvaliado"> {
  const t = TESTE_POR_ID[testeId];
  if (!t?.medivel) throw new Error(`teste ${testeId} não aceita medida`);
  const cortes = unidade === "cm" ? t.medivel.cortesCm : t.medivel.cortesDedos;
  if (valor >= cortes.boa) return "boa";
  if (valor >= cortes.melhorar) return "melhorar";
  return "prioridade";
}

function estadoDaResposta(
  r: Resposta,
  lado: Lado,
): Exclude<Estado, "naoAvaliado"> | null {
  const medida = lado === "D" ? r.medidaD : r.medidaE;
  if (medida !== undefined && r.unidade && r.unidade !== "referencia") {
    return classificaMedida(medida, r.unidade, r.testeId);
  }
  const escolha = r[lado];
  if (escolha === undefined || escolha === "naoConsegui") return null;
  const teste = TESTE_POR_ID[r.testeId];
  return teste?.opcoes[escolha]?.estado ?? null;
}

/**
 * Monta o mapa.
 *
 * Duas decisões de honestidade aqui. Primeira: o estado da região é o PIOR
 * entre os lados — se um tornozelo está limitado, a região está, e mediar os
 * dois esconderia justamente o lado que precisa de trabalho. Segunda: a
 * assimetria só é sinalizada quando os lados estão a um degrau inteiro de
 * distância, porque diferença pequena entre lados é comum, é ruído de medida
 * na maior parte das vezes, e transformá-la em achado seria fabricar problema.
 */
export function montaMapa(respostas: Resposta[]): Mapa {
  const mapa = {} as Mapa;
  for (const regiao of REGIOES) {
    mapa[regiao] = { regiao, estado: "naoAvaliado", assimetria: false };
  }

  for (const r of respostas) {
    const teste = TESTE_POR_ID[r.testeId];
    if (!teste) continue;

    const d = estadoDaResposta(r, "D");
    const e = teste.bilateral ? estadoDaResposta(r, "E") : d;
    const estados = [d, e].filter((x): x is Exclude<Estado, "naoAvaliado"> => x !== null);
    if (estados.length === 0) continue;

    const pior = estados.reduce((a, b) => (ORDEM[a] <= ORDEM[b] ? a : b));
    const assimetria =
      d !== null && e !== null && Math.abs(ORDEM[d] - ORDEM[e]) >= 2;

    const entrada: EstadoRegiao = {
      regiao: teste.regiao,
      estado: pior,
      assimetria,
      ...(teste.bilateral && (d || e)
        ? { porLado: { ...(d ? { D: d } : {}), ...(e ? { E: e } : {}) } }
        : {}),
      ...(r.medidaD !== undefined || r.medidaE !== undefined
        ? { medida: { D: r.medidaD, E: r.medidaE, unidade: r.unidade ?? "referencia" } }
        : {}),
    };
    mapa[teste.regiao] = entrada;
  }

  return mapa;
}

// ─── 3. Priorização ─────────────────────────────────────────────────────────

/**
 * Escolhe no máximo duas regiões.
 *
 * A ordem: severidade primeiro, depois relevância para o que a pessoa disse
 * querer melhorar, depois assimetria, e o desempate final pela simplicidade do
 * exercício disponível. Um empate resolvido pelo mais simples é uma escolha de
 * adesão, não de preguiça — o protocolo que a pessoa executa vence o protocolo
 * ótimo que ela abandona.
 *
 * "Pode melhorar" só entra como segunda prioridade, e só se houver espaço.
 * Nunca como primeira: quem tem uma região em prioridade não precisa dividir
 * atenção com uma que está funcional.
 */
export function priorizar(mapa: Mapa, contexto: Contexto): Prioridade[] {
  const relevantes = new Set<string>();
  for (const d of contexto.dificuldades) {
    for (const r of REGIOES_POR_DIFICULDADE[d] ?? []) relevantes.add(r);
  }

  const candidatas = REGIOES.map((regiao) => {
    const m = mapa[regiao];
    if (m.estado === "naoAvaliado" || m.estado === "boa") return null;

    const facilidadeMin = Math.min(
      ...EXERCICIOS.filter((e) => e.regiao === regiao).map((e) => e.facilidade),
      3,
    );

    let score = m.estado === "prioridade" ? 100 : 40;
    if (relevantes.has(regiao)) score += 30;
    if (m.assimetria) score += 10;
    score += (3 - facilidadeMin) * 2;

    const motivos: string[] = [];
    if (m.estado === "prioridade") motivos.push("foi onde apareceu a maior limitação");
    else motivos.push("tem margem de ganho");
    if (relevantes.has(regiao)) motivos.push("e influencia o exercício que você quer melhorar");
    if (m.assimetria) motivos.push("com diferença marcada entre os lados");

    return {
      score,
      prioridade: {
        regiao,
        estado: m.estado as Exclude<Estado, "naoAvaliado">,
        motivo: motivos.join(" "),
        influencia: TESTES.find((t) => t.regiao === regiao)?.influencia ?? [],
      } as Prioridade,
    };
  }).filter((x): x is { score: number; prioridade: Prioridade } => x !== null);

  candidatas.sort((a, b) => b.score - a.score);

  const escolhidas = candidatas.slice(0, 2).map((c) => c.prioridade);
  // Uma região só "pode melhorar" não justifica sozinha um protocolo de duas.
  if (escolhidas.length === 2 && escolhidas[1].estado === "melhorar" && contexto.minutos === 3) {
    return [escolhidas[0]];
  }
  return escolhidas;
}

/** As regiões que ficaram de fora, para a tela dizer que não foram esquecidas. */
export function adiadas(mapa: Mapa, prioridades: Prioridade[]): RegiaoId[] {
  const dentro = new Set(prioridades.map((p) => p.regiao));
  return REGIOES.filter(
    (r) => !dentro.has(r) && mapa[r].estado !== "naoAvaliado" && mapa[r].estado !== "boa",
  );
}

// ─── 4. Protocolo ───────────────────────────────────────────────────────────

/** Quantos exercícios cabem em cada duração escolhida. */
const CAPACIDADE: Record<3 | 6 | 10, number> = { 3: 2, 6: 3, 10: 4 };

/**
 * Escolhe os exercícios de uma região para um momento.
 *
 * O filtro por momento é a trava do Behm em forma de dado: exercício estático
 * longo não declara "pre", então o motor não tem como colocá-lo antes do
 * treino. Não existe caminho de código que fure isso.
 */
function candidatos(regiao: RegiaoId, momento: "pre" | "isolada"): ExercicioMobilidade[] {
  return EXERCICIOS.filter((e) => e.regiao === regiao && e.momentos.includes(momento)).sort(
    (a, b) => a.facilidade - b.facilidade,
  );
}

function segundosDe(e: ExercicioMobilidade, momento: "pre" | "isolada"): number {
  if (e.tipo !== "estatico") return 0;
  const s = e.segundosPorLado?.[momento] ?? 0;
  return momento === "pre" ? Math.min(s, TETO_ESTATICO_PRE) : s;
}

/**
 * Gera o protocolo completo.
 *
 * Quando a pessoa escolhe fazer antes do treino, saem DOIS protocolos: o A,
 * dinâmico, nos dias de treino; e o B, com o alongamento sustentado, nos dias
 * sem treino. Essa separação não é organizacional — é o que permite entregar o
 * volume semanal que otimiza ganho sem colocar sustentação longa antes das
 * séries pesadas. Um único protocolo teria que escolher entre as duas coisas.
 */
export function geraProtocolo(prioridades: Prioridade[], contexto: Contexto): Protocolo | null {
  if (prioridades.length === 0) return null;

  const teto = CAPACIDADE[contexto.minutos];
  const preTreino = contexto.momento === "pre";
  const itensA: ItemProtocolo[] = [];
  const itensB: ItemProtocolo[] = [];
  const volume: Partial<Record<RegiaoId, number>> = {};

  const momentoA = preTreino ? "pre" : "isolada";
  const freqA = preTreino ? Math.max(contexto.diasDeTreino, 1) : 3;
  const freqB = preTreino ? 2 : 0;

  // O protocolo A distribui as vagas entre as prioridades, a primeira levando
  // mais — duas vagas quando há espaço, porque prioridade 1 é onde o ganho mora.
  const vagas = prioridades.map((_, i) =>
    prioridades.length === 1 ? teto : i === 0 ? Math.ceil(teto / 2) + (teto > 3 ? 1 : 0) : 1,
  );

  prioridades.forEach((p, i) => {
    for (const ex of candidatos(p.regiao, momentoA).slice(0, vagas[i])) {
      if (itensA.length >= teto) break;
      itensA.push({ exercicio: ex, dose: ex.dose[momentoA] ?? "", momento: momentoA });
      volume[p.regiao] = (volume[p.regiao] ?? 0) + segundosDe(ex, momentoA) * freqA;
    }
  });

  // O protocolo B só existe no cenário pré-treino, e carrega o volume estático.
  if (preTreino) {
    for (const p of prioridades) {
      const estaticos = candidatos(p.regiao, "isolada").filter((e) => e.tipo === "estatico");
      for (const ex of estaticos.slice(0, prioridades.length === 1 ? 2 : 1)) {
        itensB.push({ exercicio: ex, dose: ex.dose.isolada ?? "", momento: "isolada" });
        volume[p.regiao] = (volume[p.regiao] ?? 0) + segundosDe(ex, "isolada") * freqB;
      }
    }
  }

  const planoBEx = itensA[0] ?? itensB[0];

  return {
    a: {
      titulo: preTreino ? "Nos dias de treino, antes de começar" : "Sua sessão de mobilidade",
      itens: itensA,
      frequencia: freqA,
    },
    b: itensB.length
      ? { titulo: "Em 2 dias sem treino", itens: itensB, frequencia: freqB }
      : null,
    planoB: planoBEx,
    volumeSemanal: volume,
    minutosPorSessao: contexto.minutos,
  };
}

// ─── 5. Validação ───────────────────────────────────────────────────────────

export interface ValidacaoProtocolo {
  ok: boolean;
  problemas: string[];
  /** Quanto o volume de cada região ficou em relação ao alvo de 600 s. */
  cobertura: Partial<Record<RegiaoId, number>>;
}

/**
 * Confere o protocolo contra as travas antes de mostrá-lo.
 *
 * Isto roda no motor, não no teste: um protocolo que fure uma trava não deve
 * chegar à tela nem em produção. É o mesmo espírito da validação do cardápio —
 * o motor conferindo o próprio trabalho.
 */
export function validaProtocolo(p: Protocolo): ValidacaoProtocolo {
  const problemas: string[] = [];
  const todos = [...p.a.itens, ...(p.b?.itens ?? [])];

  if (todos.length > 4) problemas.push(`${todos.length} exercícios — o teto é 4`);

  for (const item of p.a.itens) {
    if (item.momento !== "pre") continue;
    const s = item.exercicio.segundosPorLado?.pre ?? 0;
    if (item.exercicio.tipo === "estatico" && s > TETO_ESTATICO_PRE) {
      problemas.push(`${item.exercicio.nome}: ${s}s estáticos no pré-treino (teto ${TETO_ESTATICO_PRE}s)`);
    }
    if (!item.exercicio.momentos.includes("pre")) {
      problemas.push(`${item.exercicio.nome} não é liberado para pré-treino`);
    }
  }

  const cobertura: Partial<Record<RegiaoId, number>> = {};
  for (const [regiao, seg] of Object.entries(p.volumeSemanal)) {
    cobertura[regiao as RegiaoId] = Math.round((seg / ALVO_SEMANAL_SEGUNDOS) * 100);
  }

  return { ok: problemas.length === 0, problemas, cobertura };
}

// ─── 6. Reteste ─────────────────────────────────────────────────────────────

export type Direcao = "melhorou" | "igual" | "piorou" | "incomparavel";

export interface Comparacao {
  regiao: RegiaoId;
  direcao: Direcao;
  antes?: number;
  agora?: number;
  unidade?: Unidade;
  frase: string;
}

/**
 * Compara duas avaliações.
 *
 * A regra que mais importa: unidades diferentes devolvem "incomparavel", nunca
 * uma conversão. Alguém que mediu em dedos em março e comprou fita em abril
 * não recebe uma evolução inventada — recebe o aviso de que a comparação
 * precisa da mesma régua.
 *
 * E a ferramenta nunca promete que vai melhorar. Quando não mudou, ela diz que
 * não mudou. É o que torna o "melhorou" digno de confiança quando aparece.
 */
export function comparaRegiao(antes: EstadoRegiao, agora: EstadoRegiao): Comparacao {
  const nome = NOME_REGIAO[antes.regiao] ?? antes.regiao;

  if (antes.medida && agora.medida) {
    if (antes.medida.unidade !== agora.medida.unidade) {
      return {
        regiao: antes.regiao,
        direcao: "incomparavel",
        frase: `${nome}: você mediu com réguas diferentes nas duas vezes, então não dá para comparar. Refaça usando a mesma medida da primeira vez.`,
      };
    }
    const a = Math.max(antes.medida.D ?? 0, antes.medida.E ?? 0);
    const b = Math.max(agora.medida.D ?? 0, agora.medida.E ?? 0);
    const u = agora.medida.unidade;
    const rotulo = u === "cm" ? "cm" : "dedos";
    if (b > a) {
      return { regiao: antes.regiao, direcao: "melhorou", antes: a, agora: b, unidade: u,
        frase: `${nome}: ${a} → ${b} ${rotulo}. Mudou para melhor.` };
    }
    if (b === a) {
      return { regiao: antes.regiao, direcao: "igual", antes: a, agora: b, unidade: u,
        frase: `${nome}: ${a} ${rotulo} nas duas vezes. Não mudou — e isso acontece.` };
    }
    return { regiao: antes.regiao, direcao: "piorou", antes: a, agora: b, unidade: u,
      frase: `${nome}: ${a} → ${b} ${rotulo}. Vale conferir se você mediu do mesmo jeito.` };
  }

  const d = ORDEM[antes.estado] - ORDEM[agora.estado];
  if (antes.estado === "naoAvaliado" || agora.estado === "naoAvaliado") {
    return { regiao: antes.regiao, direcao: "incomparavel",
      frase: `${nome}: faltou avaliar em uma das vezes.` };
  }
  if (d > 0) return { regiao: antes.regiao, direcao: "melhorou", frase: `${nome}: mudou para melhor.` };
  if (d === 0) return { regiao: antes.regiao, direcao: "igual", frase: `${nome}: igual à primeira vez.` };
  return { regiao: antes.regiao, direcao: "piorou", frase: `${nome}: ficou abaixo da primeira vez.` };
}

/** Quando retestar. Quatro semanas: o ciclo em que a literatura já vê mudança. */
export const SEMANAS_ATE_RETESTE = 4;
export const SEMANAS_RETESTE_PARCIAL = 2;

export const CONVITE_RETESTE =
  "Vamos ver se mudou. Refaça os mesmos testes, do mesmo jeito e com a mesma medida — e a gente compara lado a lado. Se não tiver mudado, a gente ajusta.";
