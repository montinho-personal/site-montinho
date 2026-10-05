/**
 * Perfil biomecânico dos exercícios da base única (lib/treino/exercicios.ts).
 *
 * POR QUE UM ARQUIVO SEPARADO, E NÃO UMA SEGUNDA BASE
 *
 * A base de exercícios é uma só e alimenta a Calculadora de Volume, o
 * Substituidor e, no futuro, a biblioteca, o mapa muscular e o comparador.
 * Este arquivo só ACRESCENTA ao mesmo id o que o volume não precisa saber:
 * padrão de movimento, estabilidade, exigência técnica, cadeia e o
 * equipamento exato. Um teste (scripts/substituidor-test.ts) garante que
 * todo exercício da base tem perfil — nada fica de fora sem a gente saber.
 *
 * DE ONDE VÊM AS CLASSIFICAÇÕES
 *
 * Anatomia funcional e cinesiologia básicas (qual articulação faz qual
 * movimento, cadeia aberta x fechada), na linha dos textos de referência de
 * biomecânica do treinamento resistido. Não usamos EMG isolado para dizer
 * que um exercício é "melhor": classificação é por função, não por pico de
 * ativação. Estabilidade e técnica são escalas editoriais de 1 a 3, revistas
 * à mão — servem para ordenar alternativas, não para julgar exercícios.
 */

import { EXERCICIOS, EXERCICIO_POR_ID, type Exercicio } from "./exercicios";

export type Padrao =
  | "agachamento" | "hinge" | "extensao-joelho" | "flexao-joelho"
  | "empurrada-horizontal" | "empurrada-vertical" | "puxada-horizontal" | "puxada-vertical"
  | "abducao-ombro" | "flexao-ombro" | "abducao-horizontal" | "aducao-horizontal" | "extensao-ombro"
  | "flexao-cotovelo" | "extensao-cotovelo" | "extensao-quadril" | "abducao-quadril" | "aducao-quadril"
  | "plantarflexao" | "elevacao-escapula" | "punho" | "core-anti-extensao" | "core-flexao" | "core-rotacao" | "carregamento";

export const NOME_PADRAO: Record<Padrao, string> = {
  agachamento: "agachamento", hinge: "dobradiça de quadril (hinge)", "extensao-joelho": "extensão de joelho", "flexao-joelho": "flexão de joelho",
  "empurrada-horizontal": "empurrada horizontal", "empurrada-vertical": "empurrada vertical", "puxada-horizontal": "puxada horizontal", "puxada-vertical": "puxada vertical",
  "abducao-ombro": "abdução de ombro", "flexao-ombro": "flexão de ombro", "abducao-horizontal": "abertura horizontal do ombro", "aducao-horizontal": "fechamento horizontal do ombro", "extensao-ombro": "extensão de ombro",
  "flexao-cotovelo": "flexão de cotovelo", "extensao-cotovelo": "extensão de cotovelo", "extensao-quadril": "extensão de quadril", "abducao-quadril": "abdução de quadril", "aducao-quadril": "adução de quadril",
  plantarflexao: "flexão plantar", "elevacao-escapula": "elevação das escápulas", punho: "punho", "core-anti-extensao": "estabilização do tronco", "core-flexao": "flexão do tronco", "core-rotacao": "rotação do tronco", carregamento: "carregamento",
};

/** Padrões vizinhos: preservam boa parte da função articular sem ser o mesmo movimento. */
const VIZINHOS: Partial<Record<Padrao, Padrao[]>> = {
  agachamento: ["extensao-joelho"],
  "extensao-joelho": ["agachamento"],
  hinge: ["extensao-quadril"],
  "extensao-quadril": ["hinge"],
  "puxada-vertical": ["puxada-horizontal", "extensao-ombro"],
  "puxada-horizontal": ["puxada-vertical"],
  "extensao-ombro": ["puxada-vertical"],
  "empurrada-horizontal": ["aducao-horizontal", "empurrada-vertical"],
  "aducao-horizontal": ["empurrada-horizontal"],
  "empurrada-vertical": ["empurrada-horizontal", "flexao-ombro"],
  "flexao-ombro": ["empurrada-vertical"],
};
export const padroesVizinhos = (a: Padrao, b: Padrao) => a === b || !!VIZINHOS[a]?.includes(b);

/** O que a pessoa tem. "peso-corporal" está sempre disponível. */
export type Equip = "maquina" | "smith" | "polia" | "barra" | "halter" | "banco" | "elastico" | "barra-fixa" | "peso-corporal";

export const EQUIPAMENTOS: { id: Equip; nome: string }[] = [
  { id: "maquina", nome: "Máquinas" },
  { id: "smith", nome: "Smith" },
  { id: "polia", nome: "Polia / cabo" },
  { id: "barra", nome: "Barra e anilhas" },
  { id: "halter", nome: "Halteres" },
  { id: "banco", nome: "Banco" },
  { id: "elastico", nome: "Elástico" },
  { id: "barra-fixa", nome: "Barra fixa" },
];
export const ACADEMIA_COMPLETA: Equip[] = ["maquina", "smith", "polia", "barra", "halter", "banco", "elastico", "barra-fixa"];

export interface Perfil {
  padrao: Padrao;
  /** 1 = guiado/apoiado (máquina), 3 = exige muito controle do corpo. */
  estabilidade: 1 | 2 | 3;
  /** 1 = simples de aprender, 3 = técnico. */
  tecnica: 1 | 2 | 3;
  cadeia: "aberta" | "fechada";
  /** Tudo o que é preciso para fazer. Vazio = só peso corporal. */
  precisa: Equip[];
}

type P = [Padrao, 1 | 2 | 3, 1 | 2 | 3, "a" | "f", Equip[]];

/** Uma linha por exercício: [padrão, estabilidade, técnica, cadeia, equipamento]. */
const T: Record<string, P> = {
  // peitoral
  "supino-reto-barra": ["empurrada-horizontal", 2, 2, "a", ["barra", "banco"]],
  "supino-reto-halter": ["empurrada-horizontal", 3, 2, "a", ["halter", "banco"]],
  "supino-inclinado-barra": ["empurrada-horizontal", 2, 2, "a", ["barra", "banco"]],
  "supino-inclinado-halter": ["empurrada-horizontal", 3, 2, "a", ["halter", "banco"]],
  "supino-declinado": ["empurrada-horizontal", 2, 2, "a", ["barra", "banco"]],
  "supino-maquina": ["empurrada-horizontal", 1, 1, "a", ["maquina"]],
  "supino-inclinado-maquina": ["empurrada-horizontal", 1, 1, "a", ["maquina"]],
  "crucifixo-halter": ["aducao-horizontal", 2, 2, "a", ["halter", "banco"]],
  "crucifixo-inclinado": ["aducao-horizontal", 2, 2, "a", ["halter", "banco"]],
  "crucifixo-maquina": ["aducao-horizontal", 1, 1, "a", ["maquina"]],
  "cross-over": ["aducao-horizontal", 2, 1, "a", ["polia"]],
  "cross-over-baixo": ["aducao-horizontal", 2, 1, "a", ["polia"]],
  "flexao-de-braco": ["empurrada-horizontal", 2, 1, "f", []],
  "flexao-inclinada": ["empurrada-horizontal", 2, 1, "f", []],
  "flexao-joelhos": ["empurrada-horizontal", 1, 1, "f", []],
  "paralelas-peito": ["empurrada-horizontal", 3, 2, "f", ["barra-fixa"]],
  pullover: ["extensao-ombro", 2, 2, "a", ["halter", "banco"]],
  // costas
  "barra-fixa": ["puxada-vertical", 3, 2, "f", ["barra-fixa"]],
  "barra-fixa-assistida": ["puxada-vertical", 2, 1, "f", ["barra-fixa", "elastico"]],
  "barra-fixa-negativa": ["puxada-vertical", 3, 2, "f", ["barra-fixa"]],
  "puxada-frente": ["puxada-vertical", 1, 1, "a", ["polia"]],
  "puxada-supinada": ["puxada-vertical", 1, 1, "a", ["polia"]],
  "puxada-triangulo": ["puxada-vertical", 1, 1, "a", ["polia"]],
  "puxada-atras": ["puxada-vertical", 1, 2, "a", ["polia"]],
  "puxada-elastico": ["puxada-vertical", 2, 1, "a", ["elastico"]],
  "pulldown-braco-reto": ["extensao-ombro", 2, 1, "a", ["polia"]],
  "remada-curvada": ["puxada-horizontal", 3, 3, "a", ["barra"]],
  "remada-pronada": ["puxada-horizontal", 3, 3, "a", ["barra"]],
  "remada-cavalinho": ["puxada-horizontal", 2, 2, "a", ["barra"]],
  "remada-baixa": ["puxada-horizontal", 1, 1, "a", ["polia"]],
  "remada-maquina": ["puxada-horizontal", 1, 1, "a", ["maquina"]],
  "remada-smith": ["puxada-horizontal", 2, 2, "a", ["smith"]],
  "remada-unilateral": ["puxada-horizontal", 2, 1, "a", ["halter", "banco"]],
  "remada-elastico": ["puxada-horizontal", 2, 1, "a", ["elastico"]],
  "barra-fixa-australiana": ["puxada-horizontal", 2, 1, "f", ["barra-fixa"]],
  // posteriores, glúteos
  "levantamento-terra": ["hinge", 3, 3, "f", ["barra"]],
  "terra-sumo": ["hinge", 3, 3, "f", ["barra"]],
  stiff: ["hinge", 3, 3, "f", ["barra"]],
  "stiff-halter": ["hinge", 3, 2, "f", ["halter"]],
  "stiff-elastico": ["hinge", 2, 2, "f", ["elastico"]],
  "terra-unilateral": ["hinge", 3, 3, "f", ["halter"]],
  "good-morning": ["hinge", 3, 3, "f", ["barra"]],
  "pull-through": ["hinge", 2, 1, "f", ["polia"]],
  hiperextensao: ["hinge", 1, 1, "a", ["maquina"]],
  "mesa-flexora": ["flexao-joelho", 1, 1, "a", ["maquina"]],
  "cadeira-flexora": ["flexao-joelho", 1, 1, "a", ["maquina"]],
  "flexora-em-pe": ["flexao-joelho", 1, 1, "a", ["maquina"]],
  "flexora-deslizamento": ["flexao-joelho", 2, 2, "f", []],
  "flexora-elastico": ["flexao-joelho", 2, 1, "a", ["elastico"]],
  "nordic-curl": ["flexao-joelho", 2, 3, "a", []],
  "hip-thrust": ["extensao-quadril", 2, 2, "f", ["barra", "banco"]],
  "hip-thrust-maquina": ["extensao-quadril", 1, 1, "f", ["maquina"]],
  "ponte-gluteo": ["extensao-quadril", 1, 1, "f", []],
  "gluteo-maquina": ["extensao-quadril", 1, 1, "a", ["maquina"]],
  "gluteo-cabo": ["extensao-quadril", 2, 1, "a", ["polia"]],
  "abducao-quadril": ["abducao-quadril", 1, 1, "a", ["maquina"]],
  "abducao-cabo": ["abducao-quadril", 2, 1, "a", ["polia"]],
  "adducao-quadril": ["aducao-quadril", 1, 1, "a", ["maquina"]],
  // quadríceps
  "agachamento-livre": ["agachamento", 3, 3, "f", ["barra"]],
  "agachamento-frontal": ["agachamento", 3, 3, "f", ["barra"]],
  "agachamento-smith": ["agachamento", 2, 2, "f", ["smith"]],
  "agachamento-hack": ["agachamento", 1, 1, "f", ["maquina"]],
  "agachamento-goblet": ["agachamento", 2, 1, "f", ["halter"]],
  "agachamento-livre-halter": ["agachamento", 2, 1, "f", ["halter"]],
  "agachamento-sumo": ["agachamento", 3, 2, "f", ["barra"]],
  "agachamento-calcanhar-elevado": ["agachamento", 2, 2, "f", ["halter"]],
  "agachamento-peso-corporal": ["agachamento", 2, 1, "f", []],
  "spanish-squat": ["agachamento", 2, 2, "f", ["elastico"]],
  "leg-press": ["agachamento", 1, 1, "f", ["maquina"]],
  "leg-press-45": ["agachamento", 1, 1, "f", ["maquina"]],
  "leg-press-horizontal": ["agachamento", 1, 1, "f", ["maquina"]],
  afundo: ["agachamento", 3, 2, "f", []],
  passada: ["agachamento", 3, 2, "f", []],
  "agachamento-bulgaro": ["agachamento", 3, 2, "f", ["banco"]],
  "step-up": ["agachamento", 2, 1, "f", ["banco"]],
  "cadeira-extensora": ["extensao-joelho", 1, 1, "a", ["maquina"]],
  "cadeira-extensora-unilateral": ["extensao-joelho", 1, 1, "a", ["maquina"]],
  "sissy-squat": ["extensao-joelho", 3, 3, "f", []],
  "sissy-squat-assistido": ["extensao-joelho", 2, 2, "f", []],
  // ombros e trapézio
  "desenvolvimento-barra": ["empurrada-vertical", 3, 2, "a", ["barra"]],
  "desenvolvimento-halter": ["empurrada-vertical", 3, 2, "a", ["halter"]],
  "desenvolvimento-arnold": ["empurrada-vertical", 3, 2, "a", ["halter"]],
  "desenvolvimento-maquina": ["empurrada-vertical", 1, 1, "a", ["maquina"]],
  "desenvolvimento-smith": ["empurrada-vertical", 2, 1, "a", ["smith"]],
  "elevacao-lateral": ["abducao-ombro", 2, 1, "a", ["halter"]],
  "elevacao-lateral-cabo": ["abducao-ombro", 2, 1, "a", ["polia"]],
  "elevacao-lateral-maquina": ["abducao-ombro", 1, 1, "a", ["maquina"]],
  "elevacao-lateral-inclinada": ["abducao-ombro", 2, 1, "a", ["halter", "banco"]],
  "elevacao-lateral-elastico": ["abducao-ombro", 2, 1, "a", ["elastico"]],
  "elevacao-frontal": ["flexao-ombro", 2, 1, "a", ["halter"]],
  "crucifixo-inverso": ["abducao-horizontal", 1, 1, "a", ["maquina"]],
  "crucifixo-inverso-halter": ["abducao-horizontal", 2, 1, "a", ["halter"]],
  "crucifixo-inverso-cabo": ["abducao-horizontal", 2, 1, "a", ["polia"]],
  "face-pull": ["abducao-horizontal", 2, 2, "a", ["polia"]],
  "remada-alta": ["abducao-ombro", 2, 2, "a", ["barra"]],
  encolhimento: ["elevacao-escapula", 2, 1, "a", ["halter"]],
  "encolhimento-barra": ["elevacao-escapula", 2, 1, "a", ["barra"]],
  // braços
  "rosca-direta": ["flexao-cotovelo", 2, 1, "a", ["barra"]],
  "rosca-alternada": ["flexao-cotovelo", 2, 1, "a", ["halter"]],
  "rosca-martelo": ["flexao-cotovelo", 2, 1, "a", ["halter"]],
  "rosca-scott": ["flexao-cotovelo", 1, 1, "a", ["barra", "banco"]],
  "rosca-scott-maquina": ["flexao-cotovelo", 1, 1, "a", ["maquina"]],
  "rosca-concentrada": ["flexao-cotovelo", 1, 1, "a", ["halter", "banco"]],
  "rosca-cabo": ["flexao-cotovelo", 2, 1, "a", ["polia"]],
  "rosca-inversa": ["flexao-cotovelo", 2, 1, "a", ["barra"]],
  "rosca-21": ["flexao-cotovelo", 2, 2, "a", ["barra"]],
  "rosca-banco-inclinado": ["flexao-cotovelo", 1, 1, "a", ["halter", "banco"]],
  "rosca-punho": ["punho", 1, 1, "a", ["halter"]],
  "triceps-pulley": ["extensao-cotovelo", 2, 1, "a", ["polia"]],
  "triceps-unilateral-cabo": ["extensao-cotovelo", 2, 1, "a", ["polia"]],
  "triceps-maquina": ["extensao-cotovelo", 1, 1, "a", ["maquina"]],
  "triceps-testa": ["extensao-cotovelo", 1, 2, "a", ["barra", "banco"]],
  "triceps-testa-halter": ["extensao-cotovelo", 1, 2, "a", ["halter", "banco"]],
  "triceps-frances": ["extensao-cotovelo", 2, 2, "a", ["halter"]],
  "triceps-coice": ["extensao-cotovelo", 2, 1, "a", ["halter"]],
  "triceps-elastico": ["extensao-cotovelo", 2, 1, "a", ["elastico"]],
  "triceps-banco": ["extensao-cotovelo", 2, 1, "f", ["banco"]],
  "paralelas-triceps": ["extensao-cotovelo", 3, 2, "f", ["barra-fixa"]],
  "supino-fechado": ["empurrada-horizontal", 2, 2, "a", ["barra", "banco"]],
  // panturrilhas
  "panturrilha-em-pe": ["plantarflexao", 1, 1, "f", ["maquina"]],
  "panturrilha-sentado": ["plantarflexao", 1, 1, "a", ["maquina"]],
  "panturrilha-leg-press": ["plantarflexao", 1, 1, "f", ["maquina"]],
  "panturrilha-smith": ["plantarflexao", 2, 1, "f", ["smith"]],
  "panturrilha-unilateral": ["plantarflexao", 2, 1, "f", []],
  // core e outros
  "abdominal-supra": ["core-flexao", 1, 1, "a", []],
  "abdominal-infra": ["core-flexao", 2, 1, "a", []],
  "abdominal-maquina": ["core-flexao", 1, 1, "a", ["maquina"]],
  "abdominal-cabo": ["core-flexao", 2, 1, "a", ["polia"]],
  "abdominal-bicicleta": ["core-rotacao", 2, 1, "a", []],
  "elevacao-pernas-barra": ["core-flexao", 3, 2, "a", ["barra-fixa"]],
  prancha: ["core-anti-extensao", 2, 1, "f", []],
  "prancha-lateral": ["core-anti-extensao", 2, 1, "f", []],
  "roda-abdominal": ["core-anti-extensao", 3, 3, "f", []],
  "rotacao-tronco": ["core-rotacao", 2, 1, "a", ["polia"]],
  "farmers-walk": ["carregamento", 2, 1, "f", ["halter"]],
};

export const PERFIL: Record<string, Perfil> = Object.fromEntries(
  Object.entries(T).map(([id, [padrao, estabilidade, tecnica, c, precisa]]) => [id, { padrao, estabilidade, tecnica, cadeia: c === "a" ? "aberta" : "fechada", precisa }]),
);

export const exerciciosSemPerfil = () => EXERCICIOS.filter((e) => !PERFIL[e.id]).map((e) => e.id);

/** Dá para fazer com o que a pessoa tem? Peso corporal sempre conta. */
export const cabeNoEquipamento = (id: string, tem: Equip[]) => (PERFIL[id]?.precisa ?? []).every((x) => tem.includes(x));

export function exercicioComPerfil(id: string): (Exercicio & Perfil) | null {
  const e = EXERCICIO_POR_ID.get(id);
  const p = PERFIL[id];
  return e && p ? { ...e, ...p } : null;
}
