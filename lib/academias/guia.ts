import { ACADEMIAS } from "./base";
import { REGIAO_LABEL, type Academia } from "./tipos";

/**
 * Guia das academias de Alphaville — camada editorial.
 *
 * Isto NÃO é a base de dados. A base (`base.ts`) guarda fatos verificáveis
 * com fonte e data; aqui mora opinião declarada como opinião, e a distinção
 * é o que mantém as duas coisas confiáveis.
 *
 * Por que agrupar por proposta e não por região: 12 das 16 unidades ficam no
 * Centro Industrial e Empresarial. Região quase não separa ninguém — agrupar
 * por ela daria uma lista com um bloco gigante e três sobras. O que de fato
 * separa essas academias é a proposta de cada uma, e é essa a pergunta que a
 * pessoa está fazendo quando procura "qual academia de Alphaville".
 *
 * Regra de conteúdo: cada linha aqui resume o que o artigo daquela unidade já
 * diz. Nada de horário, preço em reais, estrutura exata ou nota — esses dados
 * mudam, e só a academia pode confirmar.
 */

export type GrupoId = "economicas" | "bairro" | "premium" | "especificas";

export interface Grupo {
  id: GrupoId;
  titulo: string;
  /** A pergunta que essa família de academias responde. */
  chamada: string;
  descricao: string;
  /** O trade-off honesto do modelo — todo modelo tem um. */
  tradeOff: string;
}

export const GRUPOS: Grupo[] = [
  {
    id: "economicas",
    titulo: "Modelo econômico",
    chamada: "Quero treinar gastando pouco",
    descricao:
      "Redes que baixam a mensalidade padronizando a operação: muita máquina, muito horário disponível e pouco serviço individual incluído. É o modelo que mais fez gente começar a treinar no Brasil, e funciona bem para quem já sabe o que vai fazer na sala.",
    tradeOff:
      "Você entra pagando pouco, mas ninguém vai te procurar. Se a sua dificuldade é saber o que fazer ou manter constância sozinho, a economia da mensalidade costuma virar prejuízo em forma de plano parado.",
  },
  {
    id: "bairro",
    titulo: "Custo-benefício e academias de bairro",
    chamada: "Quero algo equilibrado e perto de casa",
    descricao:
      "O meio-termo: estrutura suficiente, ambiente menos impessoal que o das grandes redes e, quase sempre, menos deslocamento. É onde mora a maioria das pessoas que treina de forma constante há anos — e não por acaso.",
    tradeOff:
      "Costuma ter menos redundância de equipamento. Em horário de pico, isso significa esperar por um aparelho específico. Vale a visita no seu horário real antes de assinar.",
  },
  {
    id: "premium",
    titulo: "Premium",
    chamada: "Quero estrutura e serviço completos",
    descricao:
      "Mensalidade mais alta em troca de estrutura ampla, manutenção mais cuidadosa, ambiente controlado e serviços que as outras faixas não incluem. O investimento se paga quando você efetivamente usa o que está pagando.",
    tradeOff:
      "Estrutura premium não treina por você. Se o plano vira uma assinatura que você usa duas vezes por mês, o valor por treino fica alto — e o problema não era a academia.",
  },
  {
    id: "especificas",
    titulo: "Propostas específicas",
    chamada: "Quero um formato diferente do convencional",
    descricao:
      "Academias que não tentam servir todo mundo: elas escolhem um público e constroem tudo em volta dele — fisiculturismo, performance, atendimento em estúdio ou horário livre. Quando você é esse público, o encaixe é muito melhor do que o de uma academia generalista.",
    tradeOff:
      "Especialização corta o que está fora dela. Antes de escolher por aqui, confirme que você é mesmo o público que aquele formato foi desenhado para atender.",
  },
];

export interface ItemGuia {
  /** id em `base.ts` — a ligação entre a camada editorial e a de dados. */
  id: string;
  grupo: GrupoId;
  /** Uma frase: para quem essa unidade tende a fazer sentido. */
  paraQuem: string;
  /** Uma frase: para quem ela tende a NÃO fazer sentido. */
  penseDuasVezes: string;
}

/**
 * As unidades ativas e as encerradas que ainda têm artigo. Cada linha resume o que o artigo daquela academia já
 * defende — se você mudar a posição no artigo, mude aqui também.
 */
export const ITENS: ItemGuia[] = [
  // ── Modelo econômico ──────────────────────────────────────────────────────
  {
    id: "smart-fit-alphaville",
    grupo: "economicas",
    paraQuem: "Quem já treina com autonomia e quer o menor custo por sessão, com muitas unidades para usar.",
    penseDuasVezes: "Você está começando e precisa de alguém olhando a sua execução na sala.",
  },
  {
    id: "bluefit-alphaville",
    grupo: "economicas",
    paraQuem: "Quem quer preço de low cost sem abrir mão de uma sala ampla e de aulas no pacote.",
    penseDuasVezes: "Sua prioridade é atendimento próximo e ambiente com pouca gente.",
  },
  {
    id: "skyfit-alphaville",
    grupo: "economicas",
    paraQuem: "Quem procura rede acessível com estrutura ampla e horários folgados.",
    penseDuasVezes: "Você quer acompanhamento incluído na mensalidade.",
  },
  {
    id: "voi-fit-alphaville",
    grupo: "economicas",
    paraQuem: "Quem quer academia de bairro com custo acessível e trajeto curto.",
    penseDuasVezes: "Você precisa de grande variedade de máquinas para uma rotina muito específica.",
  },

  // ── Custo-benefício e bairro ──────────────────────────────────────────────
  {
    id: "panobianco-alphaville",
    grupo: "bairro",
    paraQuem: "Quem quer estrutura de rede consolidada sem pagar faixa premium.",
    penseDuasVezes: "Você busca o menor preço possível ou, no outro extremo, serviço premium completo.",
  },
  {
    id: "nitrogym-alphaville",
    grupo: "bairro",
    paraQuem: "Quem prefere academia independente, com ambiente mais direto e menos padronizado.",
    penseDuasVezes: "Você quer acesso a várias unidades pela mesma mensalidade.",
  },
  {
    id: "arena-18-alphaville",
    grupo: "bairro",
    paraQuem: "Quem procura uma opção local no Centro Industrial e Empresarial, perto do trabalho.",
    penseDuasVezes: "Sua rotina exige treinar em horários muito fora do comercial.",
  },
  {
    id: "scelta-aldeia-da-serra",
    grupo: "bairro",
    paraQuem: "Quem é da Aldeia da Serra e não quer entrar em Alphaville para treinar.",
    penseDuasVezes: "Você passa o dia no polo empresarial e treinaria no intervalo do trabalho.",
  },

  // ── Premium ───────────────────────────────────────────────────────────────
  {
    id: "bodytech-alphaville",
    grupo: "premium",
    paraQuem: "Quem quer o padrão premium nacional e vai usar a estrutura completa que está pagando.",
    penseDuasVezes: "Você treina três vezes por semana só na musculação — a conta por treino não fecha.",
  },
  {
    id: "bio-ritmo-alphaville",
    grupo: "premium",
    paraQuem: "Quem quer ambiente premium com a operação de uma rede grande por trás.",
    penseDuasVezes: "Preço é o seu critério principal de decisão.",
  },

  {
    id: "scelta-alphaville",
    grupo: "premium",
    paraQuem: "Quem trabalha no Centro Comercial e quer resolver musculação, aulas e funcional no mesmo lugar, sem atravessar Alphaville no fim do dia.",
    penseDuasVezes: "Seu critério principal é mensalidade baixa — aqui você paga pelo ambiente e pela proximidade.",
  },

  // ── Propostas específicas ─────────────────────────────────────────────────
  {
    id: "ironberg-alphaville",
    grupo: "especificas",
    paraQuem: "Quem leva musculação a sério e quer ambiente, equipamento e público alinhados à hipertrofia.",
    penseDuasVezes: "Você busca variedade de aulas ou um clima de clube família.",
  },
  {
    id: "4perform-alphaville",
    grupo: "especificas",
    paraQuem: "Quem rende melhor com sessão agendada e treino conduzido, unindo força e condicionamento.",
    penseDuasVezes: "Você quer acesso livre para treinar sozinho na hora que der.",
  },
  {
    id: "studio-mormaii-alphaville",
    grupo: "especificas",
    paraQuem: "Quem prioriza atenção individual e eficiência de tempo, no formato estúdio.",
    penseDuasVezes: "Você quer acesso livre e ilimitado pelo menor custo.",
  },
  {
    id: "24-wellness-alphaville",
    grupo: "especificas",
    paraQuem: "Quem tem agenda imprevisível, trabalha em turnos ou prefere treinar em horário vazio.",
    penseDuasVezes: "Você é iniciante e precisa de acompanhamento constante na sala.",
  },
];

export interface EntradaGuia extends ItemGuia {
  academia: Academia;
  regiaoLabel: string;
}

/** Junta editorial e base, na ordem dos grupos. Lança se algo não bater. */
export function montarGuia(): { grupo: Grupo; entradas: EntradaGuia[] }[] {
  const porId = new Map(ACADEMIAS.map((a) => [a.id, a]));

  const entradas: EntradaGuia[] = ITENS.map((item) => {
    const academia = porId.get(item.id);
    if (!academia) {
      throw new Error(`guia.ts: "${item.id}" não existe em base.ts`);
    }
    return { ...item, academia, regiaoLabel: REGIAO_LABEL[academia.regiao] };
  });

  const faltando = ACADEMIAS.filter((a) => !ITENS.some((i) => i.id === a.id));
  if (faltando.length > 0) {
    throw new Error(`guia.ts: sem texto editorial para ${faltando.map((a) => a.id).join(", ")}`);
  }

  return GRUPOS.map((grupo) => ({
    grupo,
    entradas: entradas.filter((e) => e.grupo === grupo.id && e.academia.status === "ativa"),
  }));
}
