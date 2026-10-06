/**
 * Comparador de Exercícios — "qual faz mais sentido PARA QUÊ?".
 *
 * Roda sobre a mesma base do Substituidor, do Mapa e da Calculadora de
 * Volume: lib/treino/exercicios.ts (músculos, composto/isolado, lados) e
 * lib/treino/biomecanica.ts (padrão, estabilidade, técnica, cadeia,
 * equipamento). Não existe segunda base.
 *
 * O QUE O MOTOR NÃO FAZ, DE PROPÓSITO
 *
 * - Não declara vencedor nem dá nota. A saída é: o que é igual, o que muda
 *   e, para o objetivo escolhido, em que contexto cada um tende a fazer mais
 *   sentido. O objetivo muda só o bloco de contexto, nunca os dados.
 * - Não mostra percentual de músculo nem usa EMG como veredito. Músculo é
 *   "principal" ou "secundário", como na base.
 * - Não classifica exercício como seguro ou perigoso, nem compara cargas
 *   ("200 kg no leg press = X no agachamento").
 * - Similaridade é calculada internamente, mas o usuário vê só a categoria
 *   em palavras.
 *
 * Pares importantes ganham nota editorial (EDITORIAL), revisada à mão, que
 * substitui a resposta rápida gerada. Os artigos do blog que já comparam o
 * par são linkados: não criamos /comparar/* para não competir com eles.
 */

import { EXERCICIOS, EXERCICIO_POR_ID, buscaExercicios, normaliza, type Exercicio } from "./exercicios";
import { MUSCULOS, type MusculoId } from "./musculos";
import { NOME_PADRAO, PERFIL, padroesVizinhos, type Equip, type Perfil } from "./biomecanica";

export interface Lado extends Exercicio { p: Perfil }

export const lado = (id: string): Lado | null => {
  const e = EXERCICIO_POR_ID.get(id);
  const p = PERFIL[id];
  return e && p ? { ...e, p } : null;
};

export const nomeMusculo = (m: MusculoId) => MUSCULOS.find((x) => x.id === m)?.nome ?? m;

/** Exercícios comparáveis (todos com perfil). */
export const buscaComparavel = (t: string, limite = 8) => buscaExercicios(t, limite * 2).filter((e) => PERFIL[e.id]).slice(0, limite);

// ── Par ───────────────────────────────────────────────────────────────────

/** A ordem não importa: agachamento × leg press e leg press × agachamento são o mesmo par. */
export function normalizePair(a: string, b: string): [string, string] {
  return a <= b ? [a, b] : [b, a];
}
export const chavePar = (a: string, b: string) => normalizePair(a, b).join("__");

// ── Categoria de semelhança ───────────────────────────────────────────────

export type Relacao = "muito-semelhantes" | "parecidos" | "mesmo-musculo" | "funcoes-diferentes";

export const NOME_RELACAO: Record<Relacao, string> = {
  "muito-semelhantes": "Muito semelhantes",
  parecidos: "Parecidos, com diferenças importantes",
  "mesmo-musculo": "Mesmo músculo, função diferente",
  "funcoes-diferentes": "Funções diferentes",
};

export const EXPLICA_RELACAO: Record<Relacao, string> = {
  "muito-semelhantes": "Mesmo movimento e mesmos músculos principais. As diferenças estão nos detalhes: equipamento, estabilidade e como a carga é ajustada.",
  parecidos: "Mesmos músculos principais e movimento parecido, mas exigem coisas bem diferentes do corpo. Um não é cópia do outro.",
  "mesmo-musculo": "Treinam o mesmo músculo de formas diferentes. Não são substitutos diretos, mas podem conviver no mesmo treino.",
  "funcoes-diferentes": "Eles têm funções distintas, então não são alternativas diretas. Dá para comparar os dados, mas a escolha entre eles não é do tipo \"um ou outro\".",
};

const inter = <T,>(a: T[], b: T[]) => a.filter((x) => b.includes(x));

/** Score interno (0–1). Não é mostrado: serve para escolher a categoria e testar. */
export function similaridade(a: Lado, b: Lado): number {
  const pa = a.primarios, pb = b.primarios;
  const jac = inter(pa, pb).length / new Set([...pa, ...pb]).size;
  const mov = a.p.padrao === b.p.padrao ? 1 : padroesVizinhos(a.p.padrao, b.p.padrao) ? 0.5 : 0;
  const cat = a.categoria === b.categoria ? 1 : 0;
  const est = 1 - Math.abs(a.p.estabilidade - b.p.estabilidade) / 2;
  return Math.round((0.45 * jac + 0.3 * mov + 0.1 * cat + 0.15 * est) * 100) / 100;
}

export function relacao(a: Lado, b: Lado): Relacao {
  const comuns = inter(a.primarios, b.primarios);
  if (!comuns.length) return "funcoes-diferentes";
  const mesmosPrimarios = comuns.length === a.primarios.length && comuns.length === b.primarios.length;
  if (a.p.padrao === b.p.padrao && a.categoria === b.categoria) {
    if (mesmosPrimarios && Math.abs(a.p.estabilidade - b.p.estabilidade) <= 1) return "muito-semelhantes";
    return "parecidos";
  }
  if (a.categoria !== b.categoria || !padroesVizinhos(a.p.padrao, b.p.padrao)) return "mesmo-musculo";
  return "parecidos";
}

// ── Critérios ─────────────────────────────────────────────────────────────

export const NIVEL_ESTAB = ["", "Baixa", "Moderada", "Alta"] as const;
export const NIVEL_TECNICA = ["", "Simples", "Moderada", "Alta"] as const;

const NOME_EQUIP: Record<Equip, string> = {
  maquina: "máquina", smith: "smith", polia: "polia", barra: "barra", halter: "halteres", banco: "banco", elastico: "elástico", "barra-fixa": "barra fixa", "peso-corporal": "peso do corpo",
};
export const equipamentoTexto = (l: Lado) => (l.p.precisa.length ? l.p.precisa.map((q) => NOME_EQUIP[q]).join(" + ") : "Peso do corpo");

/** Facilidade de progressão de carga: por tipo de resistência, não por "qualidade". */
export function progressao(l: Lado): string {
  const q = l.p.precisa;
  if (q.includes("maquina") || q.includes("polia") || q.includes("smith")) return "Muito prática: trocar o pino e repetir as mesmas condições";
  if (q.includes("barra")) return "Boa: anilhas permitem saltos pequenos, mas depende de técnica e estabilidade";
  if (q.includes("halter")) return "Boa, com saltos de carga maiores entre um par e outro";
  if (q.includes("elastico")) return "Mais difícil de medir: a tensão muda com o elástico e o alongamento";
  return "Depende de variações mais difíceis ou de carga extra";
}

export interface Linha { criterio: string; a: string; b: string; igual: boolean }

export function compareStructure(a: Lado, b: Lado): Linha[] {
  const tipo = (l: Lado) => (l.categoria === "composto" ? "Composto (mais de uma articulação)" : "Isolador (uma articulação)");
  const lados = (l: Lado) => (l.unilateral ? "Unilateral (um lado por vez)" : "Bilateral");
  const cadeia = (l: Lado) => (l.p.cadeia === "fechada" ? "Pés ou mãos fixos (o corpo se move)" : "O peso se move, o corpo fica apoiado");
  const sec = (l: Lado) => (l.secundarios?.length ? l.secundarios.map(nomeMusculo).join(", ") : "Pequena participação de outros");
  const linhas: [string, (l: Lado) => string][] = [
    ["Músculos principais", (l) => l.primarios.map(nomeMusculo).join(", ")],
    ["Músculos secundários", sec],
    ["Movimento", (l) => NOME_PADRAO[l.p.padrao]],
    ["Tipo", tipo],
    ["Lados", lados],
    ["Exigência de estabilidade", (l) => NIVEL_ESTAB[l.p.estabilidade]],
    ["Complexidade técnica", (l) => NIVEL_TECNICA[l.p.tecnica]],
    ["Progressão de carga", progressao],
    ["Equipamento", equipamentoTexto],
    ["Apoio", cadeia],
  ];
  return linhas.map(([criterio, f]) => ({ criterio, a: f(a), b: f(b), igual: f(a) === f(b) }));
}

export function compareMuscles(a: Lado, b: Lado) {
  return {
    comunsPrincipais: inter(a.primarios, b.primarios),
    soA: a.primarios.filter((m) => !b.primarios.includes(m)),
    soB: b.primarios.filter((m) => !a.primarios.includes(m)),
  };
}

export function compareMovementPattern(a: Lado, b: Lado): "igual" | "parecido" | "diferente" {
  return a.p.padrao === b.p.padrao ? "igual" : padroesVizinhos(a.p.padrao, b.p.padrao) ? "parecido" : "diferente";
}

const BARRA_LIVRE = (l: Lado) => !l.p.precisa.some((q) => q === "maquina" || q === "polia" || q === "smith");

/** "O que os dois têm em comum?" */
export function emComum(a: Lado, b: Lado): string[] {
  const out: string[] = [];
  const { comunsPrincipais } = compareMuscles(a, b);
  if (comunsPrincipais.length) out.push(`treinam ${comunsPrincipais.map((m) => nomeMusculo(m).toLowerCase()).join(" e ")} como músculo principal`);
  const mov = compareMovementPattern(a, b);
  if (mov === "igual") out.push(`fazem o mesmo movimento: ${NOME_PADRAO[a.p.padrao]}`);
  else if (mov === "parecido") out.push(`fazem movimentos parecidos (${NOME_PADRAO[a.p.padrao]} e ${NOME_PADRAO[b.p.padrao]})`);
  if (a.categoria === b.categoria) out.push(a.categoria === "composto" ? "são exercícios compostos, de mais de uma articulação" : "são exercícios isoladores, de uma articulação");
  if (!!a.unilateral === !!b.unilateral) out.push(a.unilateral ? "são feitos um lado por vez" : "trabalham os dois lados ao mesmo tempo");
  if (a.equipamento !== "peso-corporal" && b.equipamento !== "peso-corporal") out.push("permitem sobrecarga progressiva, com carga ou repetições subindo ao longo das semanas");
  if (comunsPrincipais.length) out.push("podem ser usados para hipertrofia");
  return out;
}

/** "Principais diferenças": o que só um dos lados tem, em relação ao outro. */
export function diferencas(l: Lado, o: Lado): string[] {
  const out: string[] = [];
  if (l.p.estabilidade > o.p.estabilidade) out.push("exige mais estabilização e controle do corpo");
  if (l.p.estabilidade < o.p.estabilidade) out.push("dá mais apoio externo, com menos demanda de estabilização");
  if (l.p.tecnica > o.p.tecnica) out.push("pede mais técnica para executar bem");
  if (l.p.tecnica < o.p.tecnica) out.push("é mais simples de aprender");
  if (l.categoria !== o.categoria) out.push(l.categoria === "composto" ? "envolve mais articulações e mais músculos ao mesmo tempo" : "concentra o esforço em uma articulação");
  if (!!l.unilateral !== !!o.unilateral) out.push(l.unilateral ? "trabalha um lado por vez, o que mostra diferenças entre os lados e leva mais tempo" : "trabalha os dois lados juntos, com mais carga total");
  if (l.p.cadeia !== o.p.cadeia) out.push(l.p.cadeia === "fechada" ? "o corpo sustenta e move a carga" : "o tronco fica apoiado e o peso é que se move");
  const extra = compareMuscles(l, o)[l === o ? "soA" : "soA"];
  const so = l.primarios.filter((m) => !o.primarios.includes(m));
  if (so.length && extra) out.push(`tem ${so.map((m) => nomeMusculo(m).toLowerCase()).join(" e ")} como principal`);
  if (BARRA_LIVRE(l) && !BARRA_LIVRE(o)) out.push("usa peso livre: a trajetória depende de você");
  if (!BARRA_LIVRE(l) && BARRA_LIVRE(o)) out.push("a máquina ou a polia guiam o caminho e facilitam repetir a mesma execução");
  if (l.p.padrao !== o.p.padrao) out.push(`o movimento é ${NOME_PADRAO[l.p.padrao]}`);
  return out;
}

// ── Objetivo ──────────────────────────────────────────────────────────────

export type Objetivo = "hipertrofia" | "forca" | "estabilidade" | "pouco-equipamento" | "casa" | "progressao" | "simples";

export const OBJETIVOS: { id: Objetivo; nome: string }[] = [
  { id: "hipertrofia", nome: "Ganhar músculo" },
  { id: "forca", nome: "Ficar mais forte no movimento" },
  { id: "estabilidade", nome: "Estabilidade e controle" },
  { id: "progressao", nome: "Progredir carga com facilidade" },
  { id: "simples", nome: "Algo mais simples de executar" },
  { id: "pouco-equipamento", nome: "Pouco equipamento" },
  { id: "casa", nome: "Treinar em casa" },
];

const SO_ACADEMIA: Equip[] = ["maquina", "polia", "smith"];
const daEmCasa = (l: Lado) => !l.p.precisa.some((q) => SO_ACADEMIA.includes(q) || q === "barra");

/**
 * "No seu contexto": muda com o objetivo, nunca muda os dados acima.
 * Fala em "tende a" e "pode", não em "vence".
 */
export function compareGoalSuitability(a: Lado, b: Lado, obj: Objetivo): string[] {
  const n = (l: Lado) => l.nome.toLowerCase();
  const rel = relacao(a, b);
  const [maisEst, menosEst] = a.p.estabilidade >= b.p.estabilidade ? [a, b] : [b, a];
  const difEst = maisEst.p.estabilidade !== menosEst.p.estabilidade;
  switch (obj) {
    case "hipertrofia": {
      if (rel === "funcoes-diferentes") return [`Para ganhar músculo, os dois podem entrar no treino, mas cada um para o seu músculo: ${n(a)} para ${a.primarios.map(nomeMusculo).join(", ").toLowerCase()}, ${n(b)} para ${b.primarios.map(nomeMusculo).join(", ").toLowerCase()}.`];
      const out = ["Os dois podem contribuir para hipertrofia. O que mais pesa é chegar perto da falha com boa execução e progredir ao longo das semanas."];
      if (difEst) out.push(`Se a estabilidade estiver limitando a série (você para antes de o músculo cansar), ${n(menosEst)} pode ser uma ferramenta interessante. ${cap(n(maisEst))} oferece mais demanda global e faz sentido se você também quer dominar o movimento.`);
      if (a.categoria !== b.categoria) { const iso = a.categoria === "isolado" ? a : b; out.push(`${cap(n(iso))} ajuda a acumular trabalho no músculo-alvo sem cansar tanto o resto; o composto treina mais músculos de uma vez.`); }
      return out;
    }
    case "forca":
      return [
        `Para ficar mais forte em um movimento, a regra é a especificidade: o próprio exercício, ou uma variação bem próxima, tende a transferir mais. Quer levantar mais no ${n(a)}? Treine ${n(a)}. O mesmo vale para ${n(b)}.`,
        rel === "funcoes-diferentes" || rel === "mesmo-musculo" ? "Como os movimentos são diferentes, um não substitui o outro para ganhar força no movimento." : `O outro exercício pode fortalecer os mesmos músculos e ajudar, mas não ensina o mesmo movimento.`,
        "Ganhar músculo e ficar melhor em um movimento são objetivos diferentes: para o primeiro, os dois servem; para o segundo, a especificidade manda.",
      ];
    case "estabilidade":
      return difEst
        ? [`Se o objetivo é desenvolver controle e estabilidade, ${n(maisEst)} exige mais disso. Menor estabilidade não quer dizer exercício pior: em ${n(menosEst)}, o apoio externo permite concentrar mais esforço no músculo-alvo.`]
        : ["Os dois têm exigência de estabilidade parecida. A escolha aqui depende mais de equipamento e preferência."];
    case "progressao":
      return [`${cap(n(a))}: ${progressao(a).toLowerCase()}.`, `${cap(n(b))}: ${progressao(b).toLowerCase()}.`, "O exercício que você consegue repetir sempre do mesmo jeito é o mais fácil de acompanhar no papel."];
    case "simples": {
      if (a.p.tecnica === b.p.tecnica) return ["Os dois têm complexidade técnica parecida. Mais técnico não quer dizer melhor: quer dizer que leva mais tempo para executar bem."];
      const [s, t] = a.p.tecnica < b.p.tecnica ? [a, b] : [b, a];
      return [`${cap(n(s))} é mais simples de aprender. Mais técnico não quer dizer melhor: ${n(t)} só leva mais tempo para executar bem e se beneficia de alguém olhando a execução no começo.`];
    }
    case "pouco-equipamento":
    case "casa": {
      const ca = daEmCasa(a), cb = daEmCasa(b);
      if (ca && cb) return [`Os dois dá para fazer com pouco equipamento: ${equipamentoTexto(a).toLowerCase()} e ${equipamentoTexto(b).toLowerCase()}.`];
      if (!ca && !cb) return ["Os dois precisam de equipamento de academia. Para treinar em casa, veja alternativas no Substituidor."];
      const [s, t] = ca ? [a, b] : [b, a];
      return [`${cap(n(s))} dá para fazer com pouco equipamento (${equipamentoTexto(s).toLowerCase()}). ${cap(n(t))} precisa de ${equipamentoTexto(t).toLowerCase()}: se você não tem, o Substituidor mostra alternativas.`];
    }
  }
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Resposta rápida ───────────────────────────────────────────────────────

export interface Editorial {
  /** Primeiro parágrafo do resultado, revisado à mão. */
  resposta: string;
  /** Observações específicas do par. */
  notas?: string[];
  /** Artigo do blog que já compara o par (sem /comparar/* para não competir com ele). */
  artigo?: string;
}

const E = (a: string, b: string, e: Editorial): [string, Editorial] => [chavePar(a, b), e];

/** Notas editoriais por par (chave normalizada). */
export const EDITORIAL: Record<string, Editorial> = Object.fromEntries([
  E("agachamento-livre", "leg-press", {
    resposta: "Os dois podem ser excelentes para desenvolver quadríceps e glúteos, mas não são a mesma coisa. O agachamento exige mais estabilização e controle do corpo; o leg press oferece mais apoio externo e facilita concentrar o esforço nas pernas.",
    notas: [
      "Leg press substitui agachamento? Para ganhar músculo nas pernas, pode cumprir boa parte do papel. Para ficar mais forte no agachamento, não: o leg press transfere pouco para o próprio agachamento.",
      "Dá para fazer os dois no mesmo treino. O mais comum é o mais técnico primeiro (agachamento), quando você está descansado, e o leg press depois.",
      "Os quilos não se comparam: o peso do leg press depende do ângulo e da máquina, e o agachamento soma o peso do seu corpo.",
    ],
    artigo: "agachamento-vs-leg-press",
  }),
  E("agachamento-livre", "leg-press-45", {
    resposta: "Os dois podem ser excelentes para desenvolver quadríceps e glúteos, mas não são a mesma coisa. O agachamento exige mais estabilização e controle do corpo; o leg press 45 oferece mais apoio externo e facilita concentrar o esforço nas pernas.",
    notas: ["Para ficar mais forte no agachamento, o próprio agachamento é mais específico. Para ganhar músculo, os dois podem cumprir o papel e podem estar no mesmo treino."],
    artigo: "agachamento-vs-leg-press",
  }),
  E("agachamento-hack", "leg-press", {
    resposta: "Parecidos, mas não iguais. Os dois são máquinas com apoio para as costas, mas no hack você fica em pé sob a carga e o movimento lembra mais um agachamento; no leg press você está sentado e empurra a plataforma.",
    notas: ["Leg press e hack não são a mesma coisa, mas podem cumprir papel parecido para quadríceps num treino de hipertrofia.", "Dá para fazer os dois no mesmo dia, inclusive em sequência. Como os dois cansam bastante a coxa, o total de séries da semana conta mais que a combinação.", "Os quilos de uma máquina não valem para a outra: ângulo, trilho e fabricante mudam tudo."],
    artigo: "hack-vs-leg-press",
  }),
  E("supino-reto-barra", "supino-inclinado-barra", {
    resposta: "Os dois treinam o peitoral, com tríceps e ombro ajudando. Inclinar o banco muda a ênfase: a parte de cima do peito e o ombro da frente participam mais. Não existe \"peito superior isolado\", e nenhum dos dois é melhor em absoluto.",
    notas: [
      "Qual fazer primeiro? Normalmente o que você mais quer progredir, quando está descansado. Se a prioridade é a parte de cima do peito, o inclinado pode vir antes.",
      "O inclinado costuma ser mais pesado de sentir e sair com menos carga que o reto: isso é normal, não é sinal de fraqueza.",
      "Reto e inclinado no mesmo dia não é exagero, desde que o total de séries da semana faça sentido para você.",
    ],
    artigo: "supino-reto-vs-supino-inclinado",
  }),
  E("supino-reto-halter", "supino-inclinado-halter", {
    resposta: "Os dois treinam o peitoral com halteres. Inclinar o banco aumenta a participação da parte de cima do peito e do ombro da frente; o reto costuma permitir mais carga.",
    artigo: "supino-reto-vs-supino-inclinado",
  }),
  E("supino-reto-barra", "supino-reto-halter", {
    resposta: "Muito semelhantes: mesmo movimento, mesmos músculos. A barra liga os dois braços, dá mais estabilidade e permite mais carga total; os halteres deixam cada lado independente, com mais liberdade de trajetória e mais estabilização.",
    notas: ["Com halteres, pegar e devolver o peso pode limitar cargas altas antes do peito cansar. Com barra, ajustar a carga e repetir a execução é mais fácil."],
  }),
  E("barra-fixa", "puxada-frente", {
    resposta: "Os dois são puxadas verticais e treinam as costas (dorsais) com bíceps ajudando. A puxada deixa você escolher a carga, inclusive abaixo do peso do corpo; a barra fixa usa o próprio corpo e exige mais controle.",
    notas: ["Para melhorar na barra fixa, a própria barra fixa (ou a assistida) é mais específica. Para ganhar músculo nas costas, a puxada pode cumprir o mesmo papel. Barra fixa não é sempre melhor.", "Não é a mesma coisa que puxar o seu peso no puxador: na barra o corpo se move e precisa ser estabilizado, e a carga do aparelho depende da polia. Os quilos não se comparam.", "Pegada aberta, fechada, neutra ou supinada muda um pouco a ênfase entre costas e bíceps, nos dois exercícios."],
    artigo: "barra-fixa-vs-puxada",
  }),
  E("stiff", "mesa-flexora", {
    resposta: "Os dois treinam os posteriores de coxa, mas não cumprem a mesma função. O stiff é uma dobradiça de quadril, trabalha os posteriores alongados e envolve bastante glúteo; a mesa flexora dobra o joelho e isola mais os posteriores.",
    notas: [
      "Não são concorrentes: se complementam. Por isso costumam aparecer juntos num treino de posterior, um de quadril e um de joelho.",
      "Pode trocar mesa flexora por stiff? Dá para manter o trabalho de posterior, mas muda a função: você perde a flexão de joelho e ganha glúteo e lombar trabalhando junto.",
      "Qual primeiro? O mais comum é o stiff antes, por ser mais técnico e permitir mais carga, e a flexora depois. Mas a ordem pode inverter se a prioridade for a flexora.",
    ],
  }),
  E("cadeira-flexora", "mesa-flexora", {
    resposta: "Muito semelhantes: os dois dobram o joelho e isolam os posteriores. Na cadeira você fica sentado, com o quadril dobrado, o que deixa os posteriores mais alongados; na mesa você fica deitado de bruços. Escolha pela que encaixa melhor no seu corpo e na sua academia, ou alterne.",
  }),
  E("cadeira-extensora", "agachamento-livre", {
    resposta: "Não são exercícios equivalentes. O agachamento é composto, treina quadríceps e glúteos juntos e exige estabilidade; a cadeira extensora isola a extensão do joelho, só quadríceps. Os dois podem estar na mesma estratégia para a frente da coxa.",
    notas: [
      "A cadeira extensora substitui o agachamento? Não totalmente: ela não treina glúteos nem o movimento de agachar. Mas é útil para acumular trabalho no quadríceps sem cansar o resto.",
      "Qual primeiro? Normalmente o agachamento, mais técnico e pesado, quando você está descansado. A extensora antes (pré-exaustão) é uma estratégia possível, com carga menor no agachamento.",
      "Fazer extensora todo dia não acelera o resultado: o músculo cresce no descanso entre os treinos.",
    ],
  }),
  E("rosca-direta", "rosca-martelo", {
    resposta: "Os dois dobram o cotovelo e treinam bíceps. A pegada é o que muda: na martelo, com a palma virada para dentro, o braquial e o antebraço participam mais; na direta, com a palma para cima, o bíceps trabalha na posição dele de mais força.",
    notas: [
      "A martelo trabalha bíceps E antebraço (braquiorradial), além do braquial; não é \"só antebraço\". A direta deixa o bíceps mais em evidência.",
      "Dá para fazer as duas no mesmo treino: é uma combinação comum para o braço.",
    ],
    artigo: "rosca-direta-vs-rosca-martelo",
  }),
  E("desenvolvimento-barra", "elevacao-lateral", {
    resposta: "Os dois treinam o ombro, mas de formas diferentes. O desenvolvimento é composto: empurra o peso para cima, com deltoide da frente e tríceps trabalhando muito. A elevação lateral é mais específica para o deltoide lateral, sem tríceps.",
    notas: ["Não são substitutos: é comum ter os dois no mesmo treino de ombro."],
  }),
  E("desenvolvimento-halter", "elevacao-lateral", {
    resposta: "Os dois treinam o ombro, mas de formas diferentes. O desenvolvimento é composto, com deltoide da frente e tríceps; a elevação lateral é mais específica para o deltoide lateral.",
  }),
  E("remada-baixa", "remada-curvada", {
    resposta: "Os dois são remadas e treinam as costas com bíceps ajudando. Na remada baixa o tronco fica apoiado e a polia guia o movimento; na curvada você segura o tronco inclinado, o que exige muito mais estabilidade e técnica da lombar e do quadril.",
    artigo: "puxada-vs-remada",
  }),
  E("cross-over", "crucifixo-maquina", {
    resposta: "Muito parecidos: os dois fecham os braços à frente do peito e isolam o peitoral. A polia deixa você mudar a altura e o ângulo; a máquina guia o caminho e é mais simples de repetir igual.",
    artigo: "crossover-vs-crucifixo",
  }),
  E("panturrilha-em-pe", "panturrilha-sentado", {
    resposta: "Os dois treinam a panturrilha, mas com o joelho em posições diferentes. Em pé, com o joelho esticado, o gastrocnêmio trabalha mais; sentado, com o joelho dobrado, o sóleo faz mais do trabalho.",
    artigo: "panturrilha-em-pe-vs-sentada",
  }),
]);

/** Resposta rápida: a editorial, se existir; senão, montada pela categoria. */
export function respostaRapida(a: Lado, b: Lado): string {
  const ed = EDITORIAL[chavePar(a.id, b.id)];
  if (ed) return ed.resposta;
  const rel = relacao(a, b);
  const comuns = compareMuscles(a, b).comunsPrincipais.map((m) => nomeMusculo(m).toLowerCase()).join(" e ");
  const n = (l: Lado) => l.nome.toLowerCase();
  const [mais, menos] = a.p.estabilidade >= b.p.estabilidade ? [a, b] : [b, a];
  const est = mais.p.estabilidade !== menos.p.estabilidade ? ` ${cap(n(mais))} exige mais estabilização; ${n(menos)} oferece mais apoio.` : "";
  switch (rel) {
    case "muito-semelhantes": return `Muito semelhantes: os dois treinam ${comuns} com o mesmo movimento.${est} A diferença está mais no equipamento e na execução do que no músculo.`;
    case "parecidos": return `Os dois treinam ${comuns}, mas não são a mesma coisa.${est} O melhor depende do que você precisa naquele momento.`;
    case "mesmo-musculo": return `Os dois treinam ${comuns}, mas de formas diferentes: ${n(a)} é ${NOME_PADRAO[a.p.padrao]}, ${n(b)} é ${NOME_PADRAO[b.p.padrao]}. Não são substitutos diretos e podem conviver no mesmo treino.`;
    case "funcoes-diferentes": return `Esses exercícios treinam funções e músculos diferentes: ${n(a)} trabalha ${a.primarios.map(nomeMusculo).join(", ").toLowerCase()}, ${n(b)} trabalha ${b.primarios.map(nomeMusculo).join(", ").toLowerCase()}. Eles não são alternativas diretas.`;
  }
}

/** "Precisa escolher só um?" */
export function precisaEscolher(a: Lado, b: Lado): string {
  if (relacao(a, b) === "funcoes-diferentes") return "Não: eles fazem coisas diferentes e é comum os dois estarem no mesmo treino.";
  return "Não necessariamente. Exercícios parecidos podem coexistir na mesma programação, em momentos ou funções diferentes: um mais pesado no começo do treino, outro para completar o volume, ou alternando por fases.";
}

/** 1RM só faz sentido prático em compostos com carga externa. */
export const temUmRM = (l: Lado) => l.categoria === "composto" && l.equipamento !== "peso-corporal";

/** Termos que indicam pergunta de dor/lesão: a ferramenta não responde isso. */
export const mencionaDor = (t: string) => /\b(dor|doi|lesao|lesionad|machuc|hernia|tendinit|condromalacia|lombalgia)/.test(normaliza(t));

/** Comparações populares (pares reais da base). */
export const POPULARES: [string, string][] = [
  ["agachamento-livre", "leg-press"],
  ["supino-reto-barra", "supino-inclinado-barra"],
  ["supino-reto-barra", "supino-reto-halter"],
  ["barra-fixa", "puxada-frente"],
  ["stiff", "mesa-flexora"],
  ["rosca-direta", "rosca-martelo"],
  ["cadeira-extensora", "agachamento-livre"],
  ["agachamento-hack", "leg-press"],
  ["desenvolvimento-barra", "elevacao-lateral"],
  ["remada-baixa", "remada-curvada"],
];

export const COMPARAVEIS = EXERCICIOS.filter((e) => PERFIL[e.id]).length;
