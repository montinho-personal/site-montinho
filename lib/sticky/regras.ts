import { getWhatsAppUrl } from "@/lib/whatsapp";
import { revisaoWhatsAppUrl } from "@/lib/revisao";

/**
 * Sticky bar contextual — a matriz de regras.
 *
 * O QUE ISTO É
 *
 * Não é uma barra com botão de WhatsApp. É um sistema que olha o assunto que
 * a pessoa está lendo e oferece o próximo passo mais lógico para AQUELE
 * assunto: ferramenta, diagnóstico, conversa. Uma ação por vez, e a mesma
 * escada de compromisso que o resto do site já usa — informação primeiro,
 * ferramenta depois, conversa por último, venda nunca como primeiro passo.
 *
 * DE ONDE VEM A CATEGORIA
 *
 * Do classificador que já existe em lib/cta/classify.ts, e não de uma
 * taxonomia nova. Ele já roda no build para os 830 artigos, é determinístico e
 * é testado. A sticky bar é uma camada em cima dele: cluster → regra. Criar
 * uma segunda classificação seria ter duas opiniões sobre o mesmo artigo.
 *
 * Para páginas que não são artigo (ferramentas, locais, institucionais), a
 * regra vem da rota — declarada pela própria página via meta tag, ou
 * deduzida do pathname como último recurso.
 *
 * O QUE ESTE ARQUIVO NÃO FAZ
 *
 * Não toca no DOM, não lê storage, não sabe o que é scroll. É uma função pura
 * de (contexto) → (regra concreta), e por isso é o único lugar que precisa de
 * teste de conteúdo. O componente só apresenta.
 */

/** Como a regra dispara. */
export type Gatilho =
  /** 25% de rolagem ou 15 s — o menor sinal de interesse. */
  | "padrao"
  /** 10% ou 5 s — página comercial, a pessoa já veio decidida. */
  | "cedo";

export type Destino = "whatsapp" | "diagnostico" | "ferramenta" | "pagina";

export interface Regra {
  id: string;
  /** O que a pessoa provavelmente quer neste momento. */
  intencao: string;
  /** A frase da barra. Curta: no celular sobram ~36 caracteres antes do botão. */
  texto: string;
  /** Variante B para teste. Só muda o texto, nunca o destino — uma variável por vez. */
  textoB?: string;
  /** O rótulo do botão. Verbo específico. */
  botao: string;
  destino: Destino;
  href: string;
  gatilho: Gatilho;
  /** 1 = comercial/alta intenção … 4 = fallback. Só informa analytics e QA. */
  prioridade: 1 | 2 | 3 | 4;
}

/** Parâmetros que a página pode passar para deixar a regra concreta. */
export interface Contexto {
  /** Título da página — entra na mensagem de WhatsApp quando faz sentido. */
  titulo?: string;
  /** Nome legível do lugar (Tamboré, Barueri…) para páginas locais. */
  local?: string;
  /** Visitas distintas anteriores (dias). Usado só para escalar o fallback. */
  visitas?: number;
}

const z = (msg: string) => getWhatsAppUrl(msg);

/**
 * A MATRIZ.
 *
 * Cada entrada é uma função porque várias regras precisam do contexto para
 * fechar a mensagem — o nome do exercício, o bairro, o título. O texto da
 * barra, por outro lado, é fixo: barra que muda de frase a cada página parece
 * gerada, e "parecer gerada" é o que faz a pessoa ignorar.
 */
export const REGRAS: Record<string, (c: Contexto) => Regra> = {
  // ─── Prioridade 1: a pessoa já sabe o que quer ─────────────────────────

  exercicio: (c) => ({
    id: "exercicio",
    intencao: "execução",
    texto: "Quer que eu veja sua execução?",
    textoB: "Envie uma série e descubra o que pode melhorar.",
    botao: "Enviar vídeo",
    destino: "whatsapp",
    href: revisaoWhatsAppUrl(c.titulo),
    gatilho: "padrao",
    prioridade: 1,
  }),

  local: (c) => ({
    id: "local",
    intencao: "contratar presencial",
    texto: `Procura personal ${emLocal(c.local ?? "Alphaville")}?`,
    botao: "Falar no WhatsApp",
    destino: "whatsapp",
    href: z(
      `Olá, Montinho! Vi sua página sobre personal trainer ${emLocal(c.local ?? "Alphaville")} e queria saber como funciona o atendimento.`,
    ),
    gatilho: "cedo",
    prioridade: 1,
  }),

  consultoria: () => ({
    id: "consultoria",
    intencao: "decidir",
    texto: "Quer saber se a consultoria faz sentido para você?",
    textoB: "Fale comigo antes de decidir.",
    botao: "Falar comigo",
    destino: "whatsapp",
    href: z("Olá, Montinho! Estou na página da consultoria e queria entender se ela faz sentido para o meu caso."),
    gatilho: "cedo",
    prioridade: 1,
  }),

  // ─── Prioridade 2: já reconhece o problema, quer estratégia ────────────

  hipertrofia: () => ({
    id: "hipertrofia",
    intencao: "estruturar o treino",
    texto: "Seu treino está bem montado?",
    botao: "Fazer diagnóstico",
    destino: "diagnostico",
    href: "/diagnostico",
    gatilho: "padrao",
    prioridade: 2,
  }),

  volume: () => ({
    id: "volume",
    intencao: "conferir o volume",
    texto: "Seu volume de treino faz sentido?",
    botao: "Calcular",
    destino: "ferramenta",
    href: "/ferramentas/calculadora-volume-treino",
    gatilho: "padrao",
    prioridade: 2,
  }),

  emagrecimento: () => ({
    id: "emagrecimento",
    intencao: "saber o déficit",
    texto: "Descubra seu déficit estimado",
    botao: "Calcular",
    destino: "ferramenta",
    href: "/ferramentas/calculadora-deficit-calorico",
    gatilho: "padrao",
    prioridade: 2,
  }),

  emagrecimento_travado: () => ({
    id: "emagrecimento_travado",
    intencao: "destravar",
    texto: "Seu resultado travou?",
    botao: "Descobrir por quê",
    destino: "diagnostico",
    href: "/diagnostico",
    gatilho: "padrao",
    prioridade: 2,
  }),

  proteina: () => ({
    id: "proteina",
    intencao: "meta de proteína",
    texto: "Calcule sua meta de proteína",
    botao: "Calcular",
    destino: "ferramenta",
    href: "/ferramentas/calculadora-de-proteina",
    gatilho: "padrao",
    prioridade: 2,
  }),

  macros: () => ({
    id: "macros",
    intencao: "organizar a dieta",
    texto: "Veja seus macros estimados",
    botao: "Calcular",
    destino: "ferramenta",
    href: "/ferramentas/calculadora-macros",
    gatilho: "padrao",
    prioridade: 2,
  }),

  rotina: () => ({
    id: "rotina",
    intencao: "encaixar na semana",
    texto: "Qual treino cabe na sua semana?",
    botao: "Montar rotina",
    destino: "ferramenta",
    href: "/treino-para-minha-rotina",
    gatilho: "padrao",
    prioridade: 2,
  }),

  // ─── Prioridade 3: temas com limite profissional — copy contida ────────

  /**
   * Dor e mobilidade. A ferramenta de mobilidade ainda não está no ar
   * (MOBILIDADE_NO_AR = false), então o destino é o diagnóstico, com a mesma
   * copy responsável do CTA contextual: nada de "resolva", "cure", "acabe".
   */
  dor: () => ({
    id: "dor",
    intencao: "treinar com limitação",
    texto: "Seu treino precisa considerar alguma limitação?",
    botao: "Ver por onde começar",
    destino: "diagnostico",
    href: "/diagnostico",
    gatilho: "padrao",
    prioridade: 3,
  }),

  saude: () => ({
    id: "saude",
    intencao: "treinar com a condição",
    texto: "Como o treino entra no seu caso?",
    botao: "Ver por onde começar",
    destino: "diagnostico",
    href: "/diagnostico",
    gatilho: "padrao",
    prioridade: 3,
  }),

  glp1: () => ({
    id: "glp1",
    intencao: "não perder músculo",
    texto: "Treinando com a caneta? Veja por onde começar",
    botao: "Fazer diagnóstico",
    destino: "diagnostico",
    href: "/diagnostico",
    gatilho: "padrao",
    prioridade: 3,
  }),

  academia_local: () => ({
    id: "academia_local",
    intencao: "escolher academia",
    texto: "Ainda escolhendo a academia?",
    botao: "Comparar",
    destino: "ferramenta",
    href: "/academia-ideal-alphaville",
    gatilho: "padrao",
    prioridade: 3,
  }),

  local_fora: () => ({
    id: "local_fora",
    intencao: "acompanhamento à distância",
    texto: "Acompanhamento online, de onde você estiver",
    botao: "Ver como funciona",
    destino: "pagina",
    href: "/consultoria",
    gatilho: "padrao",
    prioridade: 3,
  }),

  servico_online: () => ({
    id: "servico_online",
    intencao: "avaliar o serviço",
    texto: "Fale comigo antes de decidir",
    botao: "Falar no WhatsApp",
    destino: "whatsapp",
    href: z("Olá, Montinho! Estava lendo sobre o acompanhamento online e queria tirar uma dúvida antes de decidir."),
    gatilho: "padrao",
    prioridade: 2,
  }),

  resultados: () => ({
    id: "resultados",
    intencao: "ver prova",
    texto: "Quer ver o que acontece na prática?",
    botao: "Ver resultados",
    destino: "pagina",
    href: "/resultados",
    gatilho: "padrao",
    prioridade: 3,
  }),

  institucional: () => ({
    id: "institucional",
    intencao: "orientação",
    texto: "Não sabe por onde começar?",
    botao: "Comece aqui",
    destino: "pagina",
    href: "/comece",
    gatilho: "padrao",
    prioridade: 3,
  }),

  // ─── Ferramentas ────────────────────────────────────────────────────────
  // As ferramentas de cálculo NÃO têm sticky: o próximo passo delas é o bloco
  // pós-resultado (components/ferramentas/PosResultado.tsx), que sabe o
  // resultado, a faixa e quantas ferramentas a pessoa já usou. Uma barra por
  // cima disso seria duas ofertas na mesma tela. Só a tabela de alimentos —
  // que não tem "resultado" — fica com barra.

  alimentos: () => ({
    id: "alimentos",
    intencao: "fechar a conta do dia",
    texto: "Já sabe o alimento. E a sua meta?",
    botao: "Calcular macros",
    destino: "ferramenta",
    href: "/ferramentas/calculadora-macros",
    gatilho: "padrao",
    prioridade: 3,
  }),

  // ─── Fallback e recorrência ─────────────────────────────────────────────

  fallback: () => ({
    id: "fallback",
    intencao: "orientação",
    texto: "Não sabe se seu treino faz sentido?",
    botao: "Fazer diagnóstico",
    destino: "diagnostico",
    href: "/diagnostico",
    gatilho: "padrao",
    prioridade: 4,
  }),

  /** Segunda ou terceira visita: a pessoa já leu, agora quer ajuda para organizar. */
  retorno: () => ({
    id: "retorno",
    intencao: "organizar",
    texto: "Quer que eu te ajude a organizar isso?",
    botao: "Fazer diagnóstico",
    destino: "diagnostico",
    href: "/diagnostico",
    gatilho: "padrao",
    prioridade: 3,
  }),

  /** Quarta visita em diante: a leitura já aconteceu várias vezes. Oferece a conversa. */
  retorno_conversa: (c) => ({
    id: "retorno_conversa",
    intencao: "conversar",
    texto: "Quer conversar comigo?",
    botao: "Falar no WhatsApp",
    destino: "whatsapp",
    href: z(
      c.titulo
        ? `Olá, Montinho! Já li alguns conteúdos seus — hoje estava em "${c.titulo}" — e queria conversar sobre o meu caso.`
        : "Olá, Montinho! Já li alguns conteúdos seus e queria conversar sobre o meu caso.",
    ),
    gatilho: "padrao",
    prioridade: 2,
  }),
};

/**
 * Regras que a recorrência pode substituir.
 *
 * Só as educativas. Quem está numa página local, de exercício ou de
 * consultoria já tem a ação certa na frente — trocar por "quer conversar?"
 * seria pior. As ferramentas nem passam por aqui.
 */
const ESCALAVEIS = new Set([
  "hipertrofia", "volume", "emagrecimento", "emagrecimento_travado", "proteina", "macros",
  "rotina", "dor", "saude", "glp1", "institucional", "fallback", "alimentos", "resultados",
]);

/**
 * Páginas em que a barra NÃO aparece, e o motivo de cada uma.
 *
 * A regra é: onde a página já É a conversão, ou já tem a própria barra, a
 * sticky vira ruído.
 */
export const SUPRIMIDA: Array<{ padrao: RegExp; motivo: string }> = [
  { padrao: /^\/consultoria-online\/?$/, motivo: "tem barra fixa própria com WhatsApp" },
  { padrao: /^\/revisao-de-execucao\/?$/, motivo: "é o destino da regra de exercício" },
  { padrao: /^\/pergunte-ao-montinho\/?$/, motivo: "chat: a pessoa está digitando" },
  { padrao: /^\/comece(\/|$)/, motivo: "é o destino da regra institucional" },
  { padrao: /^\/contato\/?$/, motivo: "formulário: já é conversão" },
  { padrao: /^\/lgpd\/?$/, motivo: "página legal" },
  { padrao: /^\/busca\/?$/, motivo: "a pessoa está procurando" },
  { padrao: /^\/blog\/?$/, motivo: "índice: ainda não escolheu o assunto" },
  { padrao: /^\/ferramentas\/?$/, motivo: "índice de ferramentas: a escolha é a ação" },
];

/**
 * Nome legível do lugar a partir do pathname de uma página local do app.
 * Ordem importa: "tambore-barueri" é Tamboré e Barueri, e cai em Tamboré.
 */
/**
 * A preposição certa para cada lugar.
 *
 * Quem mora ali diz "no Tamboré", não "em Tamboré" — o bairro leva artigo
 * masculino, como o Morumbi ou o Butantã. As outras cidades não levam
 * artigo, então continuam com "em". Sem isto, a barra escreveria "Procura
 * personal em Tamboré?" para justamente o público que mais percebe a
 * diferença.
 */
const COM_ARTIGO = new Set(["Tamboré"]);
export function emLocal(local: string): string {
  return `${COM_ARTIGO.has(local) ? "no" : "em"} ${local}`;
}

export function localDoPathname(pathname: string): string | null {
  if (/tambore/.test(pathname)) return "Tamboré";
  if (/barueri/.test(pathname)) return "Barueri";
  if (/santana-de-parnaiba|aldeia-da-serra/.test(pathname)) return "Santana de Parnaíba";
  if (/alphaville/.test(pathname)) return "Alphaville";
  if (/^\/personal-trainer\/?$/.test(pathname)) return "Alphaville e região";
  return null;
}

/**
 * Regra por rota, para páginas que não declararam nada.
 *
 * É o último recurso, e cobre só o que dá para saber pelo caminho: ferramenta
 * (qual), página local (qual), institucional. Artigo NÃO passa por aqui — o
 * artigo declara a regra no build, a partir do classificador.
 */
export function regraPorRota(pathname: string): string | null {
  const p = pathname.replace(/\/$/, "") || "/";
  if (SUPRIMIDA.some((s) => s.padrao.test(p))) return null;

  // Ferramentas de cálculo e quizzes: sem barra. O próximo passo é o bloco
  // pós-resultado da própria ferramenta (ver REGRAS).
  if (p.startsWith("/ferramentas/")) return null;
  if (p === "/diagnostico" || p === "/treino-para-minha-rotina" || p === "/academia-ideal-alphaville") return null;
  if (p.startsWith("/alimentos")) return "alimentos";

  if (p === "/consultoria") return "consultoria";
  if (localDoPathname(p) && /personal|treinador|professor|academia-com/.test(p)) return "local";
  if (p === "/academias-alphaville") return "academia_local";

  if (["/", "/minha-historia", "/resultados", "/faq", "/personal-trainer"].includes(p)) {
    return p === "/personal-trainer" ? "local" : "institucional";
  }
  return "fallback";
}

/**
 * Fecha a regra: aplica a recorrência e entrega o objeto concreto.
 *
 * `visitas` conta dias distintos em que a pessoa voltou. A escalada só vale
 * para regras educativas (ESCALAVEIS) — e pula a primeira visita inteira.
 */
export function resolve(id: string, c: Contexto = {}): Regra | null {
  const visitas = c.visitas ?? 0;
  let efetiva = id;
  if (ESCALAVEIS.has(id)) {
    if (visitas >= 4) efetiva = "retorno_conversa";
    else if (visitas >= 2) efetiva = "retorno";
  }
  const f = REGRAS[efetiva];
  return f ? f(c) : null;
}

/** Tempo e rolagem por gatilho. Exportado para o teste travar os números. */
export const LIMIARES: Record<Gatilho, { scroll: number; ms: number }> = {
  padrao: { scroll: 0.25, ms: 15_000 },
  cedo: { scroll: 0.1, ms: 5_000 },
};
