import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { Estagio, Ferramenta } from "./historico";

/**
 * O que vem depois do resultado, ferramenta por ferramenta.
 *
 * A pessoa acabou de descobrir um número sobre ela mesma. As três camadas
 * que este arquivo descreve fazem esse número virar um caminho:
 *
 *   1. RESULTADO      — a ferramenta já mostra; não é daqui.
 *   2. INTERPRETAÇÃO  — uma frase dizendo o que o número significa na
 *                       prática, e o que ele NÃO diz.
 *   3. PRÓXIMO PASSO  — uma ação. Qual, depende do degrau da escada
 *                       (lib/ferramentas/historico.ts): próxima ferramenta,
 *                       diagnóstico ou conversa.
 *
 * O CTA muda com o RESULTADO, não só com a ferramenta. "Seu volume está
 * alto" e "seu volume está baixo" não podem receber a mesma pergunta — é a
 * diferença entre continuação e propaganda.
 *
 * NADA DAQUI TOCA O DOM. É função pura de (ferramenta, categoria do
 * resultado, estágio, resumo) → bloco concreto. O componente só apresenta.
 */

export interface Bloco {
  /** Camada 2: o que o número quer dizer, e o que não quer. */
  interpretacao: string;
  /** Camada 3: a pergunta que abre a próxima ação. */
  pergunta: string;
  botao: string;
  destino: "whatsapp" | "diagnostico" | "ferramenta";
  href: string;
  /** Ação discreta, uma só, nunca competindo com a principal. */
  secundaria?: { label: string; href: string; destino: "ferramenta" | "diagnostico" | "whatsapp" };
}

/**
 * Variantes da pergunta de conversa — a única variável em teste.
 *
 * Mudar texto E destino ao mesmo tempo não ensina nada. As três variantes
 * têm o mesmo destino (WhatsApp) e a mesma mensagem; muda só a pergunta.
 */
export const VARIANTES_PERGUNTA = {
  a: "Quer que eu te ajude a interpretar?",
  b: "Quer saber o que fazer com esse resultado?",
  c: "Quer que eu veja se isso faz sentido para você?",
} as const;
export type Variante = keyof typeof VARIANTES_PERGUNTA;

/** Nome da ferramenta como aparece na mensagem de WhatsApp. */
export const NOME: Record<Ferramenta, string> = {
  proteina: "Calculadora de Proteína",
  macros: "Calculadora de Macros",
  deficit: "Calculadora de Déficit",
  tdee: "Calculadora de Gasto Calórico",
  volume: "Calculadora de Volume",
  onerm: "Calculadora de 1RM",
  diagnostico: "Diagnóstico de Treino",
  rotina: "Treino para Minha Rotina",
  academia: "Comparador de Academias",
  cardapio: "Monte seu Cardápio",
  alimentos: "Tabela de Alimentos",
};

/**
 * A mensagem que abre no WhatsApp.
 *
 * Curta, para a pessoa conseguir reler antes de enviar. Leva o nome da
 * ferramenta e o RESUMO do resultado — que a ferramenta monta e que nunca
 * inclui peso, altura, idade ou condição de saúde. "160 g de proteína por
 * dia" é resultado; "80 kg" é dado do corpo e fica de fora.
 */
function mensagem(f: Ferramenta, resumo: string | null, pedido: string): string {
  const res = resumo ? ` e meu resultado foi ${resumo}` : "";
  return `Olá, Montinho! Usei a ${NOME[f]} no seu site${res}. ${pedido}`;
}

const z = (f: Ferramenta, resumo: string | null, pedido: string) =>
  getWhatsAppUrl(mensagem(f, resumo, pedido));

/** As rotas das ferramentas, num lugar só. */
export const ROTA: Record<Ferramenta, string> = {
  proteina: "/ferramentas/calculadora-de-proteina",
  macros: "/ferramentas/calculadora-macros",
  deficit: "/ferramentas/calculadora-deficit-calorico",
  tdee: "/ferramentas/calculadora-tmb-tdee",
  volume: "/ferramentas/calculadora-volume-treino",
  onerm: "/ferramentas/calculadora-1rm",
  diagnostico: "/diagnostico",
  rotina: "/treino-para-minha-rotina",
  academia: "/academia-ideal-alphaville",
  cardapio: "/ferramentas/monte-seu-cardapio",
  alimentos: "/alimentos",
};

/**
 * A JORNADA: para onde cada ferramenta leva quando o degrau é "próxima".
 *
 *   proteína → macros → cardápio           (a alimentação, de trás para frente)
 *   gasto → déficit → macros               (a conta, do gasto à distribuição)
 *   1RM → volume → diagnóstico             (a carga, do exercício ao treino)
 *   academia → rotina                      (o lugar, depois a semana)
 */
export const PROXIMA: Record<Ferramenta, { ferramenta: Ferramenta; label: string } | null> = {
  proteina: { ferramenta: "macros", label: "Calcular meus macros" },
  macros: { ferramenta: "cardapio", label: "Transformar em cardápio" },
  deficit: { ferramenta: "macros", label: "Distribuir em macros" },
  tdee: { ferramenta: "deficit", label: "Calcular meu déficit" },
  onerm: { ferramenta: "volume", label: "Conferir meu volume" },
  volume: { ferramenta: "diagnostico", label: "Fazer o diagnóstico" },
  academia: { ferramenta: "rotina", label: "Montar meu treino" },
  diagnostico: { ferramenta: "rotina", label: "Montar minha rotina" },
  rotina: null,
  cardapio: null,
  alimentos: { ferramenta: "proteina", label: "Calcular minha meta de proteína" },
};

/**
 * Interpretação e pedido por ferramenta e por CATEGORIA de resultado.
 *
 * A categoria é decidida pela própria ferramenta (ela conhece as faixas);
 * aqui só existe o texto para cada uma. `padrao` cobre o que não tem
 * categoria — nunca deixa a pessoa sem frase.
 */
interface Texto {
  interpretacao: string;
  /** Pergunta específica do resultado, usada no lugar da variante quando existe. */
  pergunta?: string;
  /** O que a pessoa pede na mensagem de WhatsApp. */
  pedido: string;
}

const TEXTOS: Record<Ferramenta, Record<string, Texto>> = {
  proteina: {
    padrao: {
      interpretacao:
        "Esse número é o ponto de partida. O que decide o resultado é conseguir encaixar essa meta na rotina, no treino e nas calorias do dia.",
      pedido: "Quero entender como encaixar isso na minha rotina e no meu treino.",
    },
    alta: {
      interpretacao:
        "Você está na faixa alta. Ela faz sentido em déficit ou com bastante treino, mas em dia comum pode ser mais proteína do que dá para comer com prazer.",
      pergunta: "Quer que eu veja se essa faixa é a certa para você?",
      pedido: "Fiquei na faixa alta e queria saber se ela faz sentido para o meu caso.",
    },
    baixa: {
      interpretacao:
        "Você está na faixa mínima. Ela protege músculo em quem treina; quem quer ganhar massa costuma precisar de um pouco mais.",
      pergunta: "Quer saber se vale subir essa meta?",
      pedido: "Fiquei na faixa mínima e queria saber se vale subir para o meu objetivo.",
    },
  },
  macros: {
    padrao: {
      interpretacao:
        "Seus macros estão estimados. Agora a pergunta é outra: dá para sustentar isso na sua semana real — com trabalho, fome e treino?",
      pedido: "Queria ajuda para saber se essa estratégia é viável na minha rotina.",
    },
    fora_amdr: {
      interpretacao:
        "A distribuição saiu da faixa de referência para algum macro. Não é erro — é sinal de que a proteína ou a gordura que você escolheu pesam muito na meta.",
      pergunta: "Quer que eu veja se essa distribuição faz sentido?",
      pedido: "A distribuição saiu da faixa de referência e queria entender se faz sentido para mim.",
    },
    impossivel: {
      interpretacao:
        "Proteína e gordura somadas já passam da meta calórica. A conta não fecha — e isso costuma indicar que a meta está baixa demais, não que os macros estão errados.",
      pergunta: "Quer que eu te ajude a rever essa meta?",
      pedido: "A conta dos macros não fechou com a minha meta e queria ajuda para rever.",
    },
  },
  deficit: {
    padrao: {
      interpretacao:
        "Esse déficit é uma estimativa. Ele só funciona se convive com treino, fome, sono e rotina — e é aí que a maioria dos planos quebra.",
      pedido: "Queria entender como aplicar esse déficit sem prejudicar meu treino.",
    },
    leve: {
      interpretacao:
        "Déficit leve é o mais fácil de manter e o que mais preserva músculo. O custo é o tempo: o resultado vem, mas devagar.",
      pergunta: "Quer saber se dá para acelerar sem perder músculo?",
      pedido: "Escolhi o déficit leve e queria saber se dá para acelerar sem perder músculo.",
    },
    moderado: {
      interpretacao:
        "Déficit moderado é a faixa que a maioria consegue sustentar. O que decide é o treino de força junto — sem ele, parte do peso que sai é músculo.",
      pergunta: "Quer que eu te ajude a aplicar isso no treino?",
      pedido: "Escolhi o déficit moderado e queria saber como aplicar isso junto com o treino.",
    },
    maior: {
      interpretacao:
        "Déficit maior traz resultado rápido e cobra caro: fome, queda no treino e mais risco de perder músculo. Costuma pedir proteína alta e acompanhamento de perto.",
      pergunta: "Quer que eu veja se esse déficit é seguro para você?",
      pedido: "Escolhi o déficit maior e queria saber se ele é seguro para o meu caso.",
    },
  },
  tdee: {
    padrao: {
      interpretacao:
        "Esse é o seu gasto estimado. Sozinho ele não emagrece nem ganha músculo — o que faz diferença é o que você decide fazer com ele: déficit, superávit ou manutenção.",
      pedido: "Queria entender o que fazer com esse número para o meu objetivo.",
    },
  },
  onerm: {
    padrao: {
      interpretacao:
        "Saber a carga máxima é útil para escolher a carga de treino. Saber quando subir, quantas séries fazer e como progredir é o que transforma o número em resultado.",
      pedido: "Queria entender como usar esse número para organizar a progressão.",
    },
  },
  volume: {
    padrao: {
      interpretacao:
        "Volume isolado não conta a história toda. Frequência, intensidade, progressão e recuperação decidem se esse volume vira músculo.",
      pedido: "Queria saber se o meu treino está bem distribuído.",
    },
    baixo: {
      interpretacao: "Volume abaixo da faixa costuma significar estímulo de menos para o músculo crescer. Subir é fácil; subir sem exagerar é o que importa.",
      pergunta: "Quer ajuda para aumentar seu volume sem exagerar?",
      pedido: "Meu volume ficou abaixo da faixa e queria ajuda para subir sem exagerar.",
    },
    alto: {
      interpretacao: "Volume acima da faixa não é necessariamente ruim, mas costuma ser onde a recuperação começa a falhar sem a pessoa perceber.",
      pergunta: "Quer que eu veja onde você pode estar exagerando?",
      pedido: "Meu volume ficou acima da faixa e queria saber onde posso estar exagerando.",
    },
    adequado: {
      interpretacao: "Volume na faixa. A próxima pergunta não é quantidade — é se intensidade e progressão também estão certas.",
      pergunta: "Quer saber se intensidade e progressão também estão certas?",
      pedido: "Meu volume está na faixa e queria saber se intensidade e progressão também estão certas.",
    },
  },
  diagnostico: {
    padrao: {
      interpretacao:
        "O diagnóstico aponta os pontos de atenção. Daqui você pode ajustar sozinho ou pedir uma segunda opinião.",
      pergunta: "Quer uma segunda opinião?",
      pedido: "Queria a sua opinião sobre o meu resultado.",
    },
  },
  rotina: {
    padrao: {
      interpretacao:
        "Essa estrutura é um bom ponto de partida. O próximo passo é ajustar exercícios, volume e progressão para você.",
      pergunta: "Quer que eu te ajude a personalizar?",
      pedido: "Queria ajuda para transformar o resultado num treino mais personalizado.",
    },
  },
  academia: {
    padrao: {
      interpretacao:
        "A academia é o lugar. O treino é a estratégia — e é ele que decide se a mensalidade vira resultado.",
      pergunta: "Quer que eu te explique como funciona o acompanhamento na academia?",
      pedido: "Estou escolhendo academia na região e queria entender como funciona o acompanhamento presencial.",
    },
  },
  cardapio: {
    padrao: {
      interpretacao: "O cardápio organiza a alimentação. O treino decide quanto do resultado é músculo.",
      pedido: "Queria entender como fica o treino para acompanhar esse objetivo.",
    },
  },
  alimentos: {
    padrao: {
      interpretacao: "Você já sabe o que o alimento tem. Falta saber quanto dele cabe na sua meta do dia.",
      pergunta: "Quer saber como encaixar esse alimento na sua meta?",
      pedido: "Queria saber como encaixar esse alimento na minha meta.",
    },
  },
};

/**
 * Monta o bloco.
 *
 * @param categoria  faixa do resultado, decidida pela ferramenta ("alta",
 *                   "leve", "fora_amdr"…). Cai em "padrao" se não existir.
 * @param resumo     frase curta do resultado para a mensagem — sem dado do corpo.
 */
export function blocoPosResultado(
  f: Ferramenta,
  categoria: string,
  est: Estagio,
  variante: Variante,
  resumo: string | null,
): Bloco {
  const t = TEXTOS[f][categoria] ?? TEXTOS[f].padrao;
  const proxima = PROXIMA[f];
  const whats = { pergunta: t.pergunta ?? VARIANTES_PERGUNTA[variante], botao: "Conversar com o Montinho", destino: "whatsapp" as const, href: z(f, resumo, t.pedido) };

  if (est === "whatsapp" || !proxima) {
    return {
      interpretacao: t.interpretacao,
      ...whats,
      secundaria: proxima
        ? { label: "Prefere continuar sozinho? " + proxima.label, href: ROTA[proxima.ferramenta], destino: "ferramenta" }
        : undefined,
    };
  }
  if (est === "diagnostico" && f !== "diagnostico") {
    return {
      interpretacao: t.interpretacao,
      pergunta: "Quer saber se isso faz sentido no seu treino?",
      botao: "Fazer o diagnóstico",
      destino: "diagnostico",
      href: ROTA.diagnostico,
      /* Se a próxima já É o diagnóstico (volume), a secundária vira a conversa — nunca a mesma ação duas vezes. */
      secundaria:
        proxima.ferramenta === "diagnostico"
          ? { label: "Prefere conversar? " + whats.botao, href: whats.href, destino: "whatsapp" }
          : { label: proxima.label, href: ROTA[proxima.ferramenta], destino: "ferramenta" },
    };
  }
  return {
    interpretacao: t.interpretacao,
    pergunta: "Quer montar o restante?",
    botao: proxima.label,
    destino: "ferramenta",
    href: ROTA[proxima.ferramenta],
    secundaria: { label: "Prefere conversar? " + whats.botao, href: whats.href, destino: "whatsapp" },
  };
}
