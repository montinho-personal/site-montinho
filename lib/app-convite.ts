/**
 * O app do Montinho no site: o convite de 30 dias grátis.
 *
 * Estratégia aprovada pelo Montinho em 24/10/2026: o app é o degrau entre as
 * ferramentas grátis (quem quer treinar sozinho) e o acompanhamento pago. Ele
 * aparece onde é a continuação natural do que a pessoa acabou de fazer:
 * depois do resultado das ferramentas de treino, no fim dos artigos de platô
 * e progressão, no menu e no "Comece". Nunca antes do resultado.
 *
 * O convite SITE-30DIAS (criado no app em 24/10/2026: 30 dias, sem limite de
 * usos, origem "site") separa no app e no CRM quem chegou pelo site. Quando
 * existir a página própria do app (depende da pesquisa de intenções), basta
 * trocar LINK_APP por ela: todo cartão usa esta constante.
 */
export const CODIGO_CONVITE_SITE = "SITE-30DIAS";
export const LINK_APP = `https://app-montinho.vercel.app/convite/${CODIGO_CONVITE_SITE}`;

/** Ferramentas de treino em que registrar treino a treino é o próximo passo. */
export const FERRAMENTAS_COM_CONVITE_APP = ["onerm", "volume", "descanso"] as const;
export type FerramentaComApp = (typeof FERRAMENTAS_COM_CONVITE_APP)[number];

/**
 * Artigos em que o app resolve o problema do leitor: a carga parou, a balança
 * não mexe, não sabe quando trocar o treino, ou quer saber se app funciona.
 * Cartão de componente: não muda o que o artigo ensina, então não mexe no
 * updatedAt (regra do AGENTS.md).
 */
export const ARTIGOS_COM_CONVITE_APP: string[] = [
  "como-sair-do-plato-da-musculacao",
  "plato-do-emagrecimento-como-quebrar",
  "balanca-nao-muda-mas-o-corpo-muda",
  "progressao-de-carga",
  "quando-trocar-o-treino",
  "descansar-tambem-faz-crescer",
  "app-de-treino-funciona",
];

/** O texto do cartão, por lugar. Situação concreta primeiro, oferta depois. */
export const TEXTO_CONVITE_APP: Record<FerramentaComApp | "artigo" | "comece", { titulo: string; texto: string }> = {
  onerm: {
    titulo: "Esse número muda a cada treino. Quer ver ele mudar?",
    texto: "No app do Montinho você anota carga e repetições em cada série. A carga da última vez já vem preenchida, e o app avisa quando você bate recorde.",
  },
  volume: {
    titulo: "Agora é conferir se o volume se mantém na semana real.",
    texto: "No app do Montinho você registra cada treino e vê a constância semana a semana: quantos treinos fez, quais séries faltaram e se a carga está subindo ou parou.",
  },
  descanso: {
    titulo: "O descanso conta sozinho no app.",
    texto: "No app do Montinho o cronômetro de descanso dispara ao concluir a série, e cada carga fica registrada para o próximo treino.",
  },
  artigo: {
    titulo: "Quer enxergar isso no seu próprio treino?",
    texto: "No app do Montinho você registra carga e repetições a cada treino e vê se a carga está subindo ou se parou, antes de virar meses de platô. Tem treino pronto para quem não sabe por onde começar.",
  },
  comece: {
    titulo: "Prefere já começar com o treino na mão?",
    texto: "O app do Montinho tem treinos prontos, com nome e desafio de 28 dias, e registra a sua evolução treino a treino. Dá para colocar o treino que você já faz, também.",
  },
};

export const OFERTA_APP = "30 dias grátis, sem cartão";
