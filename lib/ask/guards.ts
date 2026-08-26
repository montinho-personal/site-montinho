/**
 * Pergunte ao Montinho — guardrails e classificação de intenção.
 * Regras determinísticas (sem LLM): baratas, testáveis e auditáveis.
 */

export type Intent =
  | "emagrecimento"
  | "hipertrofia"
  | "exercicio"
  | "dor"
  | "iniciante"
  | "cardio"
  | "alimentacao"
  | "servico"
  | "local"
  | "diagnostico"
  | "outra";

export type CTA = "whatsapp" | "diagnostico" | "consultoria" | null;

function norm(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// ── Red flags de saúde: resposta fixa, sem LLM, sem minimizar ───────────────

const RED_FLAGS: RegExp[] = [
  /dor no peito/i,
  /aperto no peito/i,
  /desmai/i,
  /perd[ai] a consciencia/i,
  /falta de ar (forte|grave|intensa)/i,
  /nao consigo respirar/i,
  /formigamento no bra[cç]o esquerdo/i,
  /rosto (torto|paralisado|dormente)/i,
  /perda de for[cç]a (subita|repentina|de um lado)/i,
  /vis[aã]o (dupla|turva) (subita|repentina|de repente)/i,
  /sangramento (intenso|que nao para)/i,
  /perd[ai] o controle (da bexiga|do intestino)/i,
  /pensamentos? (suicida|de me machucar|de morrer)/i,
  /me machucar de proposito/i,
  /vomito com sangue/i,
];

export function checkRedFlag(question: string): string | null {
  const q = norm(question);
  for (const re of RED_FLAGS) {
    if (re.test(q)) {
      return (
        "Isso que você descreveu pode ser sinal de algo sério e não é assunto de treino: " +
        "interrompa o exercício e procure avaliação médica agora — em sintomas intensos ou " +
        "repentinos, um pronto atendimento (ou o SAMU, 192). Não dá para avaliar isso com " +
        "segurança por aqui, e minimizar seria irresponsável. Quando estiver tudo bem e " +
        "com liberação médica, volto a te ajudar com o treino."
      );
    }
  }
  return null;
}

// ── Substâncias: sem instruções operacionais ─────────────────────────────────

const SUBSTANCE_PROTOCOL: RegExp[] = [
  /ciclo de (anabolizante|esteroide|hormonio|testosterona|trembolona|stanozolol|durateston|hemogenin|oxandrolona)/i,
  /(como|quanto|qual dose|dosagem).{0,40}(anabolizante|esteroide|trembolona|stanozolol|durateston|hemogenin|oxandrolona|gh |hormonio do crescimento)/i,
  /(tomar|usar|aplicar|injetar).{0,30}(anabolizante|esteroide|trembolona|durateston|hemogenin)/i,
];

export function checkSubstanceProtocol(question: string): string | null {
  const q = norm(question);
  for (const re of SUBSTANCE_PROTOCOL) {
    if (re.test(q)) {
      return (
        "Não passo protocolos, doses ou combinações de anabolizantes e hormônios — isso é " +
        "conduta médica e o uso sem acompanhamento tem riscos reais (cardíacos, hormonais e " +
        "hepáticos). O que os conteúdos do Montinho mostram é que dá para evoluir muito com " +
        "treino estruturado, alimentação e consistência; se o assunto é reposição hormonal, o " +
        "caminho é um endocrinologista de confiança."
      );
    }
  }
  return null;
}

// ── Prompt injection (pré-filtro leve; a defesa principal é o system prompt) ─

const INJECTION: RegExp[] = [
  /ignore (as|suas|todas as) (instrucoes|regras)/i,
  /system prompt/i,
  /mostre (seu|sua|as) (prompt|instrucoes|chave|api key)/i,
  /api[_ ]?key/i,
  /reveal your/i,
  /jailbreak/i,
];

export function looksLikeInjection(question: string): boolean {
  const q = norm(question);
  return INJECTION.some((re) => re.test(q));
}

// ── Classificação de intenção (categorias genéricas — é o que vai ao GA4) ────

const INTENT_RULES: Array<[Intent, RegExp]> = [
  ["servico", /(consultoria|contratar|personal|acompanhamento|quanto custa|preco|preço|valor|mensalidade|atende|mentoria)/i],
  ["local", /(alphaville|barueri|santana de parnaiba|tambore|tamboré|presencial|na minha cidade|regiao|região)/i],
  ["diagnostico", /(qual treino (e|é) melhor|nao sei (por onde|o que)|não sei (por onde|o que)|por onde come[cç]o|melhor para mim|combina comigo)/i],
  ["dor", /(dor|lesao|lesão|machuc|tendinite|hernia|hérnia|inflam|estal)/i],
  ["iniciante", /(iniciante|come[cç]ar|primeira vez|nunca treinei|sedentari|do zero)/i],
  ["emagrecimento", /(emagrec|perder peso|perder gordura|secar|barriga|deficit|caloria|gordura)/i],
  ["hipertrofia", /(hipertrofia|ganhar massa|massa muscular|crescer|volume muscular|progress)/i],
  ["cardio", /(cardio|aerobico|aeróbico|corrida|correr|esteira|caminhada|hiit|bike|eliptico|elíptico)/i],
  ["alimentacao", /(comer|dieta|alimenta|proteina|proteína|nutri|suplement|creatina|whey|jejum)/i],
  ["exercicio", /(como fazer|execu[cç][aã]o|series|séries|repeti|tecnica|técnica|supino|agachamento|remada|rosca|puxada|leg |cadeira (extensora|flexora|adutora|abdutora)|prancha|abdominal|stiff|terra)/i],
];

export function classifyIntent(question: string): Intent {
  for (const [intent, re] of INTENT_RULES) {
    if (re.test(norm(question))) return intent;
  }
  return "outra";
}

// ── Intenção comercial forte → CTA ───────────────────────────────────────────

const COMMERCIAL: RegExp = /(quero (contratar|come[cç]ar|consultoria|personal|acompanhamento)|quanto custa|pre[cç]o|valor|mensalidade|disponibilidade|agenda|atende (em|no|na)|marcar (aula|conversa|avaliacao|avaliação))/i;

export function pickCTA(question: string, intent: Intent): CTA {
  const q = norm(question);
  if (COMMERCIAL.test(q) || intent === "servico" || intent === "local") return "whatsapp";
  if (intent === "diagnostico") return "diagnostico";
  // dúvida de estrutura/rotina sem pedido comercial → Diagnóstico ajuda
  if (/(montar (meu|um) treino|rotina de treino|quantas vezes|quantos dias)/.test(q)) return "diagnostico";
  return null;
}

// ── Validação de entrada ─────────────────────────────────────────────────────

export const MAX_QUESTION_LENGTH = 500;

export function validateQuestion(q: unknown): string | null {
  if (typeof q !== "string") return null;
  const trimmed = q.trim();
  if (trimmed.length < 2 || trimmed.length > MAX_QUESTION_LENGTH) return null;
  return trimmed;
}
