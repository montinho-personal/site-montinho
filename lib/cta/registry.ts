import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { CtaDefinition } from "./types";

/**
 * Registry central de CTAs.
 *
 * Regra que cada bloco daqui precisa passar: se o botão fosse removido e
 * sobrasse só o texto, a recomendação ainda faria sentido naquele artigo?
 * Se não faz, é propaganda e não entra.
 *
 * Nenhum texto aqui promete resultado, cria urgência ou afirma número que
 * o site não sustenta. Verbos de botão são específicos — nada de "saiba mais".
 */

const ask = (label = "Perguntar ao Montinho") => ({
  label,
  href: "/pergunte-ao-montinho",
  destination: "ask" as const,
});

const diagnostic = (label = "Fazer meu diagnóstico") => ({
  label,
  href: "/diagnostico",
  destination: "diagnostic" as const,
});

const consultoria = (label = "Conhecer a consultoria") => ({
  label,
  href: "/consultoria",
  destination: "consultoria" as const,
});

const results = (label = "Ver resultados de alunos") => ({
  label,
  href: "/resultados",
  destination: "results" as const,
});

const whats = (message: string, label = "Falar com o Montinho") => ({
  label,
  href: getWhatsAppUrl(message),
  destination: "whatsapp" as const,
  external: true,
});

const presencial = (href: string, label = "Ver o acompanhamento presencial") => ({
  label,
  href,
  destination: "presencial" as const,
});

export const CTA_REGISTRY: Record<string, CtaDefinition> = {
  // ---------------------------------------------------------------- Estágio 1
  // Informativo. A pessoa quer aprender. Não vendemos nada aqui.

  ask_exercise: {
    id: "ask_exercise",
    variant: "light",
    title: "Ficou com alguma dúvida sobre a execução?",
    body: "Pergunte com suas palavras e eu busco a resposta nos meus conteúdos sobre técnica e execução.",
    primary: ask(),
  },

  ask_concept: {
    id: "ask_concept",
    variant: "light",
    title: "Quer entender esse assunto mais a fundo?",
    body: "Você pode perguntar o que ficou solto e eu respondo com base no que já escrevi sobre o tema.",
    primary: ask(),
  },

  ask_nutrition: {
    id: "ask_nutrition",
    variant: "light",
    title: "Tem dúvida sobre como isso se encaixa na sua alimentação?",
    body: "Pergunte com suas palavras. As respostas vêm dos meus conteúdos — não substituem nutricionista, mas ajudam a entender o caminho.",
    primary: ask(),
  },

  ask_health: {
    id: "ask_health",
    variant: "light",
    title: "Quer entender como o treino entra nesse contexto?",
    body: "Pergunte o que ficou em aberto. Conteúdo educativo — decisões clínicas continuam com seu médico.",
    primary: ask(),
  },

  // ---------------------------------------------------------------- Estágio 2
  // Problema. A pessoa sabe o que incomoda mas não sabe o próximo passo.

  diag_stuck: {
    id: "diag_stuck",
    variant: "diagnostic",
    eyebrow: "Próximo passo",
    title: "Seu resultado parece travado?",
    body: "Responda algumas perguntas rápidas sobre sua rotina e objetivo e veja qual estrutura de treino faz mais sentido para o seu momento.",
    primary: diagnostic(),
    secondary: ask("Prefere tirar uma dúvida antes?"),
  },

  diag_pain: {
    id: "diag_pain",
    variant: "diagnostic",
    eyebrow: "Próximo passo",
    title: "Seu treino precisa considerar alguma limitação?",
    body: "O diagnóstico ajuda a identificar um ponto de partida compatível com a sua rotina. Dor persistente é assunto de médico ou fisioterapeuta — o treino vem depois, e junto.",
    primary: diagnostic(),
    secondary: ask("Tirar uma dúvida sobre treino"),
  },

  // ---------------------------------------------------------------- Estágio 3
  // Solução. A pessoa já procura uma estratégia.

  diag_weight_loss: {
    id: "diag_weight_loss",
    variant: "diagnostic",
    eyebrow: "Próximo passo",
    title: "Não sabe como organizar treino e rotina para emagrecer?",
    body: "Responda algumas perguntas sobre seu objetivo e sua disponibilidade e veja qual estrutura tende a funcionar melhor no seu caso.",
    primary: diagnostic(),
    secondary: ask("Prefere tirar uma dúvida antes?"),
  },

  diag_hypertrophy: {
    id: "diag_hypertrophy",
    variant: "diagnostic",
    eyebrow: "Próximo passo",
    title: "Quer estruturar melhor sua musculação?",
    body: "Descubra qual divisão e qual frequência combinam com os dias que você realmente tem para treinar.",
    primary: diagnostic(),
    secondary: ask("Prefere tirar uma dúvida antes?"),
  },

  diag_beginner: {
    id: "diag_beginner",
    variant: "diagnostic",
    eyebrow: "Por onde começar",
    title: "Está começando e não sabe por onde seguir?",
    body: "Em um ou dois minutos você vê qual estrutura inicial faz mais sentido para a sua rotina — sem precisar decorar método nenhum.",
    primary: diagnostic(),
    secondary: ask("Prefere tirar uma dúvida antes?"),
  },

  diag_routine: {
    id: "diag_routine",
    variant: "diagnostic",
    eyebrow: "Próximo passo",
    title: "Só tem pouco tempo para treinar?",
    body: "Descubra qual frequência e qual estrutura são mais compatíveis com a rotina que você tem hoje — não com a rotina ideal.",
    primary: diagnostic(),
    secondary: ask("Prefere tirar uma dúvida antes?"),
  },

  diag_glp1: {
    id: "diag_glp1",
    variant: "diagnostic",
    eyebrow: "Próximo passo",
    title: "Está emagrecendo e quer organizar melhor a musculação?",
    body: "O diagnóstico ajuda a identificar uma estrutura inicial de treino de acordo com a sua rotina. Dose, indicação e acompanhamento clínico seguem com o seu médico.",
    primary: diagnostic(),
    secondary: ask("Tirar uma dúvida sobre treino"),
  },

  // ---------------------------------------------------------------- Estágio 4
  // Serviço. A pessoa avalia contratar acompanhamento.

  service_online: {
    id: "service_online",
    variant: "service",
    eyebrow: "Acompanhamento",
    title: "Quer acompanhamento mesmo morando fora de Alphaville?",
    body: "Na consultoria online eu monto e ajusto seu treino de acordo com a sua rotina, sua academia e seus objetivos, com contato direto comigo.",
    primary: consultoria(),
    secondary: diagnostic("Ainda em dúvida? Faça o diagnóstico"),
  },

  service_results: {
    id: "service_results",
    variant: "service",
    eyebrow: "Antes de decidir",
    title: "Quer ver o que acontece na prática?",
    body: "Histórias reais de alunos que treinaram comigo — sem número inventado e sem promessa de prazo.",
    primary: results(),
    secondary: consultoria("Conhecer o acompanhamento"),
  },

  service_general: {
    id: "service_general",
    variant: "service",
    eyebrow: "Acompanhamento",
    title: "Quer um acompanhamento feito para a sua rotina?",
    body: "Eu monto o treino a partir do seu objetivo, do tempo que você tem e do que está disponível na sua academia — presencial em Alphaville e região, ou online.",
    primary: consultoria(),
    secondary: diagnostic("Ainda em dúvida? Faça o diagnóstico"),
  },

  // ---------------------------------------------------------------- Estágio 5
  // Local. Intenção comercial alta e geograficamente específica.

  local_alphaville: {
    id: "local_alphaville",
    variant: "local",
    eyebrow: "Alphaville e região",
    title: "Procura acompanhamento presencial na região?",
    body: "Atendo presencialmente em Alphaville, Tamboré, Barueri e Santana de Parnaíba, em academias e em condomínios. Veja como funciona.",
    primary: presencial("/personal-trainer-alphaville"),
    secondary: whats(
      "Oi, Montinho! Vim pelo blog e queria saber sobre acompanhamento presencial em Alphaville e região.",
      "Falar pelo WhatsApp"
    ),
  },

  local_tambore: {
    id: "local_tambore",
    variant: "local",
    eyebrow: "Tamboré",
    title: "Treina no Tamboré?",
    body: "Atendo presencialmente na região, em academias e em condomínios. Veja como funciona o acompanhamento individual.",
    primary: presencial("/personal-trainer-tambore"),
    secondary: whats(
      "Oi, Montinho! Vim pelo blog e queria saber sobre acompanhamento presencial no Tamboré.",
      "Falar pelo WhatsApp"
    ),
  },

  local_barueri: {
    id: "local_barueri",
    variant: "local",
    eyebrow: "Barueri",
    title: "Procura personal trainer em Barueri?",
    body: "Atendo presencialmente em Barueri e em Alphaville, em academias e em condomínios. Veja como funciona.",
    primary: presencial("/personal-trainer-barueri"),
    secondary: whats(
      "Oi, Montinho! Vim pelo blog e queria saber sobre acompanhamento presencial em Barueri.",
      "Falar pelo WhatsApp"
    ),
  },

  local_santana: {
    id: "local_santana",
    variant: "local",
    eyebrow: "Santana de Parnaíba",
    title: "Procura personal trainer em Santana de Parnaíba?",
    body: "Atendo presencialmente na região, incluindo os condomínios de Aldeia da Serra. Veja como funciona o acompanhamento.",
    primary: presencial("/personal-trainer-santana-de-parnaiba"),
    secondary: whats(
      "Oi, Montinho! Vim pelo blog e queria saber sobre acompanhamento presencial em Santana de Parnaíba.",
      "Falar pelo WhatsApp"
    ),
  },

  local_gym: {
    id: "local_gym",
    variant: "local",
    eyebrow: "Alphaville e região",
    title: "Já escolheu a academia e quer aproveitar melhor o treino?",
    body: "Eu acompanho alunos em várias academias da região. Veja como funciona o acompanhamento individual dentro da academia que você escolher.",
    primary: presencial("/personal-trainer-alphaville"),
    secondary: diagnostic("Prefere descobrir sua estrutura antes?"),
  },

  rotina_mid: {
    id: "rotina_mid",
    variant: "light",
    title: "Quantos dias você realmente consegue treinar?",
    body: "Responda algumas perguntas sobre sua rotina real e descubra qual estrutura de treino parece mais compatível com a sua semana.",
    primary: {
      label: "Montar minha rotina",
      href: "/treino-para-minha-rotina",
      destination: "rotina",
    },
  },

  revisao_execucao: {
    id: "revisao_execucao",
    variant: "light",
    eyebrow: "Revisão gratuita",
    title: "Quer saber como está a sua execução?",
    body: "Grave uma série completa e me mande pelo WhatsApp. Eu mesmo assisto e te passo os principais pontos que vale observar. Sem cadastro, sem custo — e não precisa estar perfeito.",
    primary: {
      label: "Enviar meu vídeo",
      href: "/revisao-de-execucao",
      destination: "revisao",
    },
  },

  // ------------------------------------------------------------------ Neutros
  // Fallback: nunca deixar classificação incerta gerar oferta inadequada.

  fallback_ask: {
    id: "fallback_ask",
    variant: "light",
    title: "Ficou com alguma dúvida?",
    body: "Pergunte com suas palavras e eu busco a resposta nos conteúdos que já escrevi.",
    primary: ask(),
  },

  fallback_continue: {
    id: "fallback_continue",
    variant: "light",
    title: "Quer continuar aprendendo?",
    body: "Você pode me perguntar o que ficou em aberto, ou descobrir qual estrutura de treino combina com a sua rotina.",
    primary: ask(),
    secondary: diagnostic("Fazer o diagnóstico"),
  },
  academia_ideal: {
    id: "academia_ideal",
    variant: "light",
    eyebrow: "Gratuito · sem cadastro",
    title: "Ainda na dúvida sobre qual academia?",
    body:
      "Responda algumas perguntas sobre a sua rotina — região, horário, o que não pode faltar — e veja quais academias de Alphaville mais combinam, com o motivo de cada uma.",
    primary: { label: "Comparar academias", href: "/academia-ideal-alphaville", destination: "academias" },
  },
};

export function getCta(id: string): CtaDefinition | null {
  return CTA_REGISTRY[id] ?? null;
}
