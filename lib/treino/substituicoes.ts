/**
 * O motor do Substituidor de Exercícios ("Qual exercício posso fazer no lugar?").
 *
 * A PERGUNTA CERTA
 *
 * Não é "que outro exercício treina o mesmo músculo?". É "o que este
 * exercício fazia no treino, e o que dá para preservar com o que eu tenho?".
 * Por isso o resultado vem em dois grupos:
 *   - MAIS PARECIDOS: mesmo músculo E mesmo padrão de movimento (ou um padrão
 *     vizinho, com a mesma função articular principal);
 *   - OUTRAS FORMAS DE TREINAR O MESMO MÚSCULO: mesmo músculo, função
 *     diferente. Mesa flexora no lugar do stiff mora aqui, nunca no primeiro.
 *
 * COMO PONTUA (interno; a pessoa vê só a categoria, nunca "92,7%")
 *
 *   músculo principal  até 40   (fração dos primários preservados)
 *   padrão de movimento    30   (mesmo) | 15 (vizinho)
 *   cadeia (aberta/fechada) 5
 *   músculos secundários   até 5
 *   1º músculo principal   10   (o que o exercício mais trabalha)
 *   estabilidade          −3 por nível de diferença
 *   técnica               −2 por nível de diferença
 *   uni x bilateral       −6 (e nunca "muito próxima")
 *   curadoria editorial   +25 (relações revisadas à mão abaixo)
 *   motivo / nível        ajustes descritos em `ajusteMotivo`
 *
 * O equipamento não pontua: é filtro. O que a pessoa não tem não aparece.
 * A lista sai ordenada por categoria (muito próxima → boa → parcial) e,
 * dentro de cada uma, pela pontuação.
 */

import { EXERCICIOS, EXERCICIO_POR_ID, buscaExercicios, normaliza, type Exercicio } from "./exercicios";
import { MUSCULOS, type MusculoId } from "./musculos";
import { NOME_PADRAO, PERFIL, cabeNoEquipamento, padroesVizinhos, type Equip, type Perfil } from "./biomecanica";

export type Motivo = "sem-aparelho" | "casa" | "desconforto" | "variar" | "execucao" | "mais-simples" | "mais-avancado" | "outro";
export type Nivel = "iniciante" | "intermediario" | "avancado";
export type Tier = "muito-proxima" | "boa" | "parcial" | "mesmo-musculo";

export const MOTIVOS: { id: Motivo; nome: string }[] = [
  { id: "sem-aparelho", nome: "Não tem esse aparelho" },
  { id: "casa", nome: "Treino em casa" },
  { id: "desconforto", nome: "Sinto desconforto" },
  { id: "variar", nome: "Quero variar" },
  { id: "execucao", nome: "Não consigo executar bem" },
  { id: "mais-simples", nome: "Quero algo mais simples" },
  { id: "mais-avancado", nome: "Quero algo mais avançado" },
  { id: "outro", nome: "Outro" },
];

export const NOME_TIER: Record<Tier, string> = {
  "muito-proxima": "Muito próxima",
  boa: "Boa alternativa",
  parcial: "Alternativa com algumas diferenças",
  "mesmo-musculo": "Outra forma de treinar o mesmo músculo",
};

const nomeMusculo = (m: MusculoId) => MUSCULOS.find((x) => x.id === m)?.nome ?? m;

/* ───────────── Curadoria editorial ───────────── */

export interface Curada {
  id: string;
  tier: Tier;
  preserva: string[];
  muda: string[];
  quando: string;
}

/**
 * Relações revisadas à mão para os exercícios mais trocados. Têm prioridade
 * sobre o texto gerado e ganham bônus no ranking — mas continuam sujeitas ao
 * filtro de equipamento: curadoria não faz aparecer o que a pessoa não tem.
 */
export const CURADAS: Record<string, Curada[]> = {
  "cadeira-extensora": [
    { id: "spanish-squat", tier: "muito-proxima", preserva: ["Foco em quadríceps", "Muita demanda de extensão de joelho"], muda: ["Cadeia fechada: pés no chão, corpo todo participa", "Pede um elástico preso em ponto firme"], quando: "Quando quer o mais perto possível da extensora sem a máquina." },
    { id: "sissy-squat-assistido", tier: "boa", preserva: ["Grande demanda dos extensores do joelho", "Pouca participação do quadril"], muda: ["Exige mais técnica e equilíbrio (apoie as mãos)", "Carga é o próprio corpo"], quando: "Quando quer isolar quadríceps em casa e tem onde se apoiar." },
    { id: "agachamento-calcanhar-elevado", tier: "parcial", preserva: ["Forte participação de quadríceps"], muda: ["Vira exercício composto: quadril e glúteos trabalham junto", "Mais estabilidade corporal"], quando: "Quando tem halteres e aceita um exercício composto com ênfase em quadríceps." },
  ],
  "leg-press": [
    { id: "agachamento-hack", tier: "muito-proxima", preserva: ["Agachamento guiado com costas apoiadas", "Quadríceps e glúteos"], muda: ["Trajetória e ângulo diferentes do leg", "Carga não se compara"], quando: "Quando a academia tem hack e você quer manter a máquina guiada." },
    { id: "agachamento-smith", tier: "boa", preserva: ["Padrão de agachamento com carga alta", "Trajetória guiada"], muda: ["Tronco sustenta a carga: mais exigência de coluna e core", "Mais técnica que o leg"], quando: "Quando quer carga alta e guiada sem leg press." },
    { id: "agachamento-livre", tier: "boa", preserva: ["Quadríceps e glúteos com carga alta"], muda: ["Bem mais estabilidade e técnica", "Envolve mais o tronco"], quando: "Para quem já tem boa técnica de agachamento." },
    { id: "agachamento-bulgaro", tier: "parcial", preserva: ["Quadríceps e glúteos"], muda: ["Unilateral: carga menor e mais equilíbrio", "Mais demanda de estabilizadores do quadril"], quando: "Quando tem só halteres e banco." },
  ],
  "leg-press-45": [
    { id: "agachamento-hack", tier: "muito-proxima", preserva: ["Agachamento guiado com costas apoiadas", "Quadríceps e glúteos"], muda: ["Trajetória e ângulo diferentes", "Carga não se compara"], quando: "Quando a academia tem hack." },
    { id: "leg-press-horizontal", tier: "muito-proxima", preserva: ["Mesmo movimento, também guiado e apoiado"], muda: ["Ângulo do quadril e carga diferentes"], quando: "Quando o 45 está ocupado ou não existe." },
    { id: "agachamento-smith", tier: "boa", preserva: ["Agachamento guiado com carga alta"], muda: ["Carga nas costas: mais exigência de tronco"], quando: "Quando quer carga alta e guiada." },
  ],
  "agachamento-livre": [
    { id: "agachamento-smith", tier: "muito-proxima", preserva: ["Padrão de agachamento com barra nas costas"], muda: ["Trajetória guiada: menos estabilização", "Posição dos pés pode ser ajustada"], quando: "Quando quer aprender ou carregar com mais segurança de trajetória." },
    { id: "agachamento-goblet", tier: "boa", preserva: ["Padrão de agachamento"], muda: ["Carga à frente, mais leve", "Mais fácil de aprender"], quando: "Para iniciantes ou treino com halteres." },
    { id: "leg-press", tier: "parcial", preserva: ["Quadríceps e glúteos com carga alta"], muda: ["Costas apoiadas: quase nenhuma demanda de tronco", "Movimento guiado"], quando: "Quando a coluna precisa de descanso ou quer carga alta com menos técnica." },
  ],
  stiff: [
    { id: "stiff-halter", tier: "muito-proxima", preserva: ["Dobradiça de quadril (hinge)", "Posteriores e glúteos alongados sob carga"], muda: ["Carga dividida nas mãos, um pouco mais livre"], quando: "Quando não tem barra ou quer mais liberdade nos ombros." },
    { id: "pull-through", tier: "boa", preserva: ["Padrão de hinge", "Glúteos e posteriores"], muda: ["Carga vem de trás, pela polia: menos exigência de lombar", "Mais leve"], quando: "Quando quer o padrão do stiff com menos carga na coluna." },
    { id: "mesa-flexora", tier: "mesmo-musculo", preserva: ["Posteriores de coxa"], muda: ["Função diferente: flexão de joelho, não dobradiça de quadril", "Glúteos quase não participam", "Não treina o alongamento sob carga do stiff"], quando: "Alternativa para trabalhar posteriores, mas com função diferente. Funciona melhor junto com um hinge do que no lugar dele." },
    { id: "stiff-elastico", tier: "parcial", preserva: ["Padrão de hinge"], muda: ["Resistência cresce no fim do movimento, não no alongamento"], quando: "Treino em casa com elástico." },
  ],
  "puxada-frente": [
    { id: "barra-fixa-assistida", tier: "muito-proxima", preserva: ["Puxada vertical", "Dorsais e bíceps"], muda: ["O corpo se move, não a carga", "Assistência do elástico ou da máquina"], quando: "Quando não tem polia ou quer evoluir para a barra." },
    { id: "puxada-elastico", tier: "boa", preserva: ["Puxada vertical com o tronco parado"], muda: ["Resistência aumenta no fim da puxada", "Carga difícil de medir"], quando: "Treino em casa com elástico preso no alto." },
    { id: "barra-fixa", tier: "boa", preserva: ["Puxada vertical"], muda: ["Usa o peso do corpo todo: bem mais difícil"], quando: "Para quem já faz algumas repetições na barra." },
    { id: "barra-fixa-negativa", tier: "parcial", preserva: ["Puxada vertical"], muda: ["Só a descida, controlada"], quando: "Para quem ainda não sobe na barra e quer progredir." },
  ],
  "barra-fixa": [
    { id: "barra-fixa-assistida", tier: "muito-proxima", preserva: ["Mesmo movimento"], muda: ["Parte do peso é aliviada"], quando: "Quando ainda não completa as repetições." },
    { id: "puxada-frente", tier: "muito-proxima", preserva: ["Puxada vertical", "Dorsais e bíceps"], muda: ["Carga ajustável", "Corpo fica parado, menos estabilização"], quando: "Na academia, para controlar a carga." },
    { id: "barra-fixa-negativa", tier: "boa", preserva: ["Mesmo movimento, na descida"], muda: ["Sem a fase de subida"], quando: "Para quem está aprendendo a barra." },
  ],
  "supino-reto-barra": [
    { id: "supino-reto-halter", tier: "muito-proxima", preserva: ["Empurrada horizontal", "Peitoral, tríceps e deltoide anterior"], muda: ["Mais liberdade para os ombros", "Mais estabilidade de cada braço", "Carga total costuma ser menor"], quando: "Quando não tem barra ou quer mais liberdade articular." },
    { id: "supino-maquina", tier: "boa", preserva: ["Empurrada horizontal", "Peitoral e tríceps"], muda: ["Trajetória guiada: menos estabilização", "Mais fácil de levar perto da falha"], quando: "Quando quer simplicidade ou foco total em empurrar." },
    { id: "flexao-de-braco", tier: "boa", preserva: ["Empurrada horizontal"], muda: ["Peso corporal: carga limitada", "Cadeia fechada, pede core"], quando: "Treino em casa." },
  ],
  "agachamento-hack": [
    { id: "leg-press", tier: "muito-proxima", preserva: ["Agachamento guiado e apoiado", "Quadríceps"], muda: ["Ângulo do quadril diferente"], quando: "Quando não tem hack." },
    { id: "agachamento-smith", tier: "boa", preserva: ["Agachamento guiado"], muda: ["Barra nas costas: mais tronco"], quando: "Com smith, pés um pouco à frente para enfatizar quadríceps." },
    { id: "agachamento-calcanhar-elevado", tier: "parcial", preserva: ["Ênfase em quadríceps"], muda: ["Livre: mais equilíbrio, carga menor"], quando: "Só com halteres." },
  ],
  "mesa-flexora": [
    { id: "cadeira-flexora", tier: "muito-proxima", preserva: ["Flexão de joelho na máquina"], muda: ["Quadril flexionado: posteriores mais alongados"], quando: "Quando a academia tem cadeira em vez de mesa." },
    { id: "flexora-deslizamento", tier: "boa", preserva: ["Flexão de joelho"], muda: ["Peso corporal, quadril elevado: glúteo participa"], quando: "Treino em casa, com toalha num piso liso." },
    { id: "nordic-curl", tier: "parcial", preserva: ["Flexão de joelho"], muda: ["Muito mais intenso e técnico, na descida"], quando: "Para quem já é avançado." },
  ],
  "remada-curvada": [
    { id: "remada-unilateral", tier: "muito-proxima", preserva: ["Puxada horizontal", "Costas e bíceps"], muda: ["Apoio no banco: menos exigência de lombar", "Um lado por vez"], quando: "Quando quer poupar a lombar ou só tem halteres." },
    { id: "remada-baixa", tier: "boa", preserva: ["Puxada horizontal"], muda: ["Sentado e guiado pela polia"], quando: "Na academia, para focar só nas costas." },
    { id: "remada-cavalinho", tier: "boa", preserva: ["Puxada horizontal com carga alta"], muda: ["Peito apoiado em algumas versões"], quando: "Quando quer carga alta com mais apoio." },
  ],
  "desenvolvimento-barra": [
    { id: "desenvolvimento-halter", tier: "muito-proxima", preserva: ["Empurrada vertical", "Deltoides e tríceps"], muda: ["Mais liberdade de trajetória", "Mais estabilização"], quando: "Quando não tem barra ou quer mais conforto nos ombros." },
    { id: "desenvolvimento-maquina", tier: "boa", preserva: ["Empurrada vertical"], muda: ["Guiado, com encosto"], quando: "Para focar nos ombros com menos técnica." },
  ],
  "triceps-pulley": [
    { id: "triceps-elastico", tier: "muito-proxima", preserva: ["Extensão de cotovelo com braço junto ao corpo"], muda: ["Resistência aumenta no fim do movimento"], quando: "Treino em casa." },
    { id: "triceps-coice", tier: "boa", preserva: ["Extensão de cotovelo"], muda: ["Halter: resistência maior no fim, perto do braço estendido"], quando: "Só com halteres." },
    { id: "triceps-testa", tier: "boa", preserva: ["Extensão de cotovelo"], muda: ["Braço acima da cabeça: tríceps mais alongado"], quando: "Quando quer variar o alongamento do tríceps." },
  ],
};

/* ───────────── Entrada e resultado ───────────── */

export interface Pedido {
  exercicioId: string;
  motivo: Motivo;
  equipamentos: Equip[];
  nivel?: Nivel;
}

export interface Alternativa {
  ex: Exercicio & Perfil;
  tier: Tier;
  preserva: string[];
  muda: string[];
  quando?: string;
  porque: string;
  tags: string[];
  curada: boolean;
  score: number;
}

export interface Resultado {
  original: Exercicio & Perfil;
  proximas: Alternativa[];
  mesmoMusculo: Alternativa[];
  avisos: string[];
}

/* ───────────── Ajustes por motivo e nível ───────────── */

function ajusteMotivo(o: Perfil, c: Perfil, motivo: Motivo, nivel?: Nivel): number {
  let s = 0;
  const dTec = c.tecnica - o.tecnica;
  if (motivo === "casa" && c.precisa.every((x) => x === "elastico" || x === "halter" || x === "banco" || x === "barra-fixa")) s += 6;
  if (motivo === "desconforto") {
    // Mudar posição, apoio ou equipamento — sem prometer que dói menos.
    if (c.estabilidade < o.estabilidade) s += 6;
    if (c.precisa.join() !== o.precisa.join()) s += 4;
  }
  if (motivo === "execucao" || motivo === "mais-simples") s += dTec > 0 ? -10 * dTec : dTec < 0 ? 6 : 0;
  if (motivo === "mais-avancado") s += dTec > 0 ? 6 : -4;
  if (nivel === "iniciante") s -= 6 * (c.tecnica - 1);
  return s;
}

/* ───────────── Textos gerados (quando não há curadoria) ───────────── */

function diferencas(o: Exercicio & Perfil, c: Exercicio & Perfil): string[] {
  const out: string[] = [];
  if (c.padrao !== o.padrao) out.push(`Muda o movimento: de ${NOME_PADRAO[o.padrao]} para ${NOME_PADRAO[c.padrao]}`);
  if (c.cadeia !== o.cadeia) out.push(c.cadeia === "fechada" ? "Pés ou mãos apoiados: envolve mais articulações e equilíbrio" : "Membro livre: mais isolado, menos articulações");
  if (c.estabilidade > o.estabilidade) out.push("Exige mais estabilidade e controle do corpo");
  if (c.estabilidade < o.estabilidade) out.push("Mais estável e guiado");
  if (c.tecnica > o.tecnica) out.push("Mais técnico de executar");
  if (c.tecnica < o.tecnica) out.push("Mais simples de executar");
  if (c.unilateral && !o.unilateral) out.push("Um lado por vez: carga menor por série");
  if (!c.unilateral && o.unilateral) out.push("Os dois lados juntos: menos trabalho de equilíbrio");
  if (o.precisa.length > 0 && c.precisa.length === 0 && o.categoria === "composto") out.push("Só o peso do corpo: para progredir, use mais repetições, pausas ou a versão unilateral");
  if (c.categoria !== o.categoria) out.push(c.categoria === "composto" ? "Vira exercício composto: outros músculos ajudam" : "Mais isolado que o original");
  if (c.equipamento !== o.equipamento || c.precisa.join() !== o.precisa.join()) out.push("Equipamento diferente: a carga não se compara");
  if (out.length === 0) out.push("Variação do mesmo exercício: muda ângulo, pegada ou posição, e a ênfase dentro do músculo");
  return out.slice(0, 3);
}

function preservados(o: Exercicio & Perfil, c: Exercicio & Perfil, comuns: MusculoId[]): string[] {
  const out: string[] = [];
  if (comuns.length) out.push(comuns.map(nomeMusculo).join(" e "));
  if (c.padrao === o.padrao) out.push(`Mesmo padrão: ${NOME_PADRAO[o.padrao]}`);
  else if (padroesVizinhos(o.padrao, c.padrao)) out.push("Função articular parecida");
  return out;
}

function tags(o: Exercicio & Perfil, c: Exercicio & Perfil, mesmoPadrao: boolean): string[] {
  const t: string[] = [];
  if (mesmoPadrao) t.push("Mesmo padrão"); else t.push("Mesmo músculo");
  if (c.precisa.length === 0) t.push("Casa");
  else if (!c.precisa.includes("maquina") && !c.precisa.includes("polia") && !c.precisa.includes("smith") && (o.precisa.includes("maquina") || o.precisa.includes("polia"))) t.push("Sem máquina");
  if (c.estabilidade < o.estabilidade) t.push("Mais estável");
  else if (c.tecnica > o.tecnica) t.push("Mais técnico");
  else if (c.unilateral && !o.unilateral) t.push("Unilateral");
  return t.slice(0, 3);
}

/* ───────────── O motor ───────────── */

export function substitui(p: Pedido): Resultado | null {
  const o = EXERCICIO_POR_ID.get(p.exercicioId);
  const op = PERFIL[p.exercicioId];
  if (!o || !op) return null;
  const original = { ...o, ...op };
  const tem: Equip[] = [...p.equipamentos, "peso-corporal"];
  const curadas = new Map((CURADAS[p.exercicioId] ?? []).map((c) => [c.id, c]));

  const todos: Alternativa[] = [];
  for (const c of EXERCICIOS) {
    if (c.id === o.id) continue;
    const cp = PERFIL[c.id];
    if (!cp || !cabeNoEquipamento(c.id, tem)) continue;
    const cand = { ...c, ...cp };
    const comuns = o.primarios.filter((m) => c.primarios.includes(m));
    if (comuns.length === 0) continue; // sem músculo principal em comum não é substituição
    const mesmoPadrao = cp.padrao === op.padrao;
    const semCargaExterna = op.precisa.length > 0 && cp.precisa.length === 0 && o.categoria === "composto";
    const vizinho = !mesmoPadrao && padroesVizinhos(op.padrao, cp.padrao);
    const secOverlap = (o.secundarios ?? []).filter((m) => (c.secundarios ?? []).includes(m) || c.primarios.includes(m)).length;
    let score = 40 * (comuns.length / o.primarios.length)
      + (mesmoPadrao ? 30 : vizinho ? 15 : 0)
      + (cp.cadeia === op.cadeia ? 5 : 0)
      + Math.min(5, secOverlap * 2)
      - 3 * Math.abs(cp.estabilidade - op.estabilidade)
      - 2 * Math.abs(cp.tecnica - op.tecnica)
      - (!!c.unilateral !== !!o.unilateral ? 6 : 0) // um lado por vez muda carga, equilíbrio e volume da série
      - (semCargaExterna ? 8 : 0) // peso corporal no lugar de exercício com carga: o estímulo cai muito
      + (c.primarios.includes(o.primarios[0]) ? 10 : 0) // o músculo principal pesa mais que o secundário
      + ajusteMotivo(op, cp, p.motivo, p.nivel);
    const cur = curadas.get(c.id);
    if (cur) score += 25;

    let tier: Tier;
    if (cur) tier = cur.tier;
    else if (!mesmoPadrao && !vizinho) tier = "mesmo-musculo";
    else if (mesmoPadrao && comuns.length === o.primarios.length && c.categoria === o.categoria && !!c.unilateral === !!o.unilateral && !semCargaExterna && Math.abs(cp.estabilidade - op.estabilidade) <= 1 && Math.abs(cp.tecnica - op.tecnica) <= 1 && score >= 70) tier = "muito-proxima";
    else if (score >= 55) tier = "boa";
    else tier = "parcial";
    // Onde há curadoria, "muito próxima" é decisão editorial: o algoritmo não passa à frente dela.
    if (!cur && curadas.size > 0 && tier === "muito-proxima") tier = "boa";

    const preserva = cur?.preserva ?? preservados(original, cand, comuns);
    const muda = cur?.muda ?? diferencas(original, cand);
    const porque = tier === "mesmo-musculo"
      ? `Trabalha ${comuns.map(nomeMusculo).join(" e ").toLowerCase()}, mas com outra função: ${NOME_PADRAO[cp.padrao]} em vez de ${NOME_PADRAO[op.padrao]}. Não reproduz o original, complementa.`
      : `${preserva.join("; ")}. ${muda.length ? "Mas " + muda[0].charAt(0).toLowerCase() + muda[0].slice(1) + "." : ""}`.trim();
    todos.push({ ex: cand, tier, preserva, muda, quando: cur?.quando, porque, tags: tags(original, cand, mesmoPadrao || vizinho), curada: !!cur, score });
  }

  const RANK: Record<Tier, number> = { "muito-proxima": 0, boa: 1, parcial: 2, "mesmo-musculo": 3 };
  const ord = (a: Alternativa, b: Alternativa) => RANK[a.tier] - RANK[b.tier] || b.score - a.score || a.ex.nome.localeCompare(b.ex.nome);
  const proximas = todos.filter((a) => a.tier !== "mesmo-musculo").sort(ord).slice(0, 5);
  const mesmoMusculo = todos.filter((a) => a.tier === "mesmo-musculo").sort(ord).slice(0, 3);

  const avisos: string[] = [];
  if (p.motivo === "desconforto")
    avisos.push("Se o exercício causa dor persistente, não use só esta ferramenta para decidir: procure avaliação adequada. As opções abaixo mudam posição, apoio ou equipamento, mas não são garantia de ausência de dor.");
  if (p.motivo === "variar")
    avisos.push("Você não precisa trocar um exercício só porque já faz há algumas semanas. Se ele continua confortável e progredindo, pode ficar no treino: progressão e consistência importam mais que novidade.");
  return { original, proximas, mesmoMusculo, avisos };
}

export const AVISO_CARGA = "A carga do novo exercício não precisa ser igual à do anterior: 100 kg no leg press não equivalem a 100 kg no agachamento, e máquinas diferentes têm alavancas e polias diferentes. Comece mais leve e ajuste pelas repetições.";

/** Busca com aliases brasileiros, só entre exercícios com perfil. */
export const buscaSubstituivel = (t: string, limite = 8) => buscaExercicios(t, limite * 2).filter((e) => PERFIL[e.id]).slice(0, limite);

export const exercicioPorSlug = (slug: string) => EXERCICIOS.find((e) => e.id === normaliza(slug)) ?? null;
