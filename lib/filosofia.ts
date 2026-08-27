/**
 * Nota de método — a filosofia do Montinho ao pé de cada conteúdo de treino.
 *
 * Aparece em centenas de páginas, então o texto NÃO pode ser um só: parágrafo
 * idêntico repetido vira ruído e a mensagem morre justamente por parecer
 * decorada. São variantes que dizem a mesma coisa por ângulos diferentes, e
 * cada página recebe uma de forma estável (mesma página, mesma variante).
 *
 * Toda variante carrega, de algum jeito:
 *   · de onde vem a orientação — prática, ciência citada nos artigos e o
 *     trabalho de grandes treinadores;
 *   · que não existe segredo: existe a estratégia que cabe na pessoa e na
 *     rotina dela agora, e a melhor é a que ela sustenta por mais tempo;
 *   · a ponte para o acompanhamento individual, escrita como convite e nunca
 *     como anúncio.
 *
 * `{link}` marca onde entra o link do acompanhamento — o componente troca.
 */

export interface Filosofia {
  id: string;
  titulo: string;
  texto: string;
  /**
   * Clusters em que esta variante NÃO deve aparecer. Existe por causa da
   * variante do chalalá: "mais uma repetição que você jurava não ter" é
   * bom-humor em conteúdo de treino e é insensível em conteúdo de dor,
   * lesão ou saúde mental, onde o tom precisa ser sóbrio.
   */
  evitarEm?: string[];
}

export const FILOSOFIAS: Filosofia[] = [
  {
    id: "chalala",
    titulo: "E onde entra o chalalá",
    evitarEm: ["pain", "health", "glp1"],
    texto:
      "Tem uma palavra que eu uso direto com os alunos: chalalá — o algo a mais que faz diferença. A carga que sobe, a técnica no fim da série, a repetição que você não ia fazer. E repare: chalalá não é segredo. Segredo é o que alguém esconde; chalalá é o que você acrescenta de propósito, em cima de uma estratégia que já funciona. Saber onde colocar esse extra, e onde ele só ia te cansar à toa, é o trabalho do {link}.",
  },
  {
    id: "direcao",
    titulo: "Uma palavra sobre o que você acabou de ler",
    texto:
      "Tudo aqui é direção, não receita. O que está escrito se apoia na prática de acompanhar alunos todos os dias, nos estudos citados nas referências e no trabalho de grandes treinadores do Brasil e do mundo. Mas não existe segredo: existe a estratégia que se encaixa em você e na rotina que você tem agora — e a melhor é sempre a que você consegue seguir por mais tempo, com mais consistência e melhor progressão. Descobrir qual é a sua é exatamente o trabalho de {link}.",
  },
  {
    id: "individualidade",
    titulo: "Por que isso não é uma fórmula",
    texto:
      "Nenhum artigo conhece sua altura, seu histórico, sua lesão antiga, o horário que sobra no seu dia. Ele dá o mapa; a rota é sua. Por isso o que funciona não é o método mais avançado, e sim o que respeita suas individualidades e a sua rotina de agora. Se você quer parar de adivinhar e ter alguém olhando o seu caso, é isso que existe no {link}.",
  },
  {
    id: "consistencia",
    titulo: "O que separa quem evolui",
    texto:
      "Depois de anos vendo gente começar e parar, ficou claro que o plano perfeito no papel perde para o plano que a pessoa consegue repetir. Consistência antes de complexidade — e progressão em cima do que já está de pé. É por isso que o {link} começa entendendo a sua semana real antes de montar qualquer treino.",
  },
  {
    id: "historia",
    titulo: "De quem vem essa orientação",
    texto:
      "Quem escreve aqui já esteve do outro lado: perdi mais de 40 kg antes de treinar qualquer pessoa. Sei o que é achar que treino não é para você. Foi essa experiência, somada aos estudos e a quem faz isso muito bem lá fora, que virou o conteúdo deste site. E é ela que sustenta o {link} — porque ajudar alguém a encontrar o próprio caminho é o que me move nisso.",
  },
  {
    id: "referencias",
    titulo: "De onde vem cada orientação",
    texto:
      "Três lugares: a prática de quem acompanha alunos de verdade, a evidência científica — os estudos estão citados nas referências, para você conferir — e o trabalho de grandes treinadores do Brasil e do mundo, como Fabrício Pacholok, Leandro Twin, Júlio Balestrin, Coach Rubens e Hany Rambod. Nenhum deles entrega fórmula mágica; todos apontam direções. Transformar direção em plano seu é o que acontece no {link}.",
  },
  {
    id: "agora",
    titulo: "A palavra mais importante aqui é “agora”",
    texto:
      "A melhor estratégia para você hoje pode não ser a melhor daqui a seis meses — porque rotina muda, objetivo muda, capacidade muda. Conteúdo bom te dá o princípio; quem ajusta o princípio ao seu momento é o acompanhamento. É exatamente isso que o {link} faz: revisar o caminho junto com você enquanto a sua vida se mexe.",
  },
  {
    id: "sem-magica",
    titulo: "Sem fórmula mágica, com método",
    texto:
      "Não existe exercício secreto nem protocolo milagroso — existe o básico bem-feito, aplicado com constância e ajustado ao longo do tempo. O conteúdo aqui mostra a direção que a ciência e a experiência apontam; o que nenhum texto consegue é olhar para a sua execução, sua carga e sua recuperação. A melhor estratégia continua sendo a que você sustenta, e desenhar essa é o trabalho do {link}.",
  },
  {
    id: "sozinho",
    titulo: "Você não precisa fazer isso sozinho",
    texto:
      "Dá para evoluir estudando por conta própria — muita gente faz. Mas o caminho costuma ser mais curto, mais seguro e menos frustrante com alguém acompanhando de perto: corrigindo o que não dá para ver sozinho e ajustando a estratégia quando a rotina aperta. Se quiser esse tipo de suporte, é o que existe no {link}.",
  },
  {
    id: "proposito",
    titulo: "Por que esse conteúdo existe",
    texto:
      "Escrevo isso porque gosto genuinamente desse estilo de vida e de ver alguém descobrir que também consegue. Cada artigo é uma tentativa de encurtar o caminho de quem está começando ou travado. E quando o conteúdo não basta — porque cada corpo e cada rotina são diferentes — o próximo passo é o {link}, feito para o seu caso e não para a média.",
  },
  {
    id: "pratica",
    titulo: "Do papel para a sua semana",
    texto:
      "Saber o que fazer é metade; a outra metade é fazer caber na vida que você leva. É aí que a maioria dos planos quebra — não por falta de informação, mas por falta de ajuste. A estratégia certa é a que sobrevive à sua semana cheia. Se quiser montar uma assim, com alguém acompanhando de perto, o caminho é o {link}.",
  },
];

/**
 * Escolhe uma variante de forma estável a partir de uma chave (o slug da
 * página). Determinístico: a mesma página mostra sempre o mesmo texto, e
 * páginas diferentes tendem a mostrar textos diferentes.
 */
export function pickFilosofia(key: string, cluster?: string): Filosofia {
  // O conjunto elegível muda com o cluster, mas o sorteio continua estável:
  // a mesma página mostra sempre o mesmo texto.
  const elegiveis = cluster
    ? FILOSOFIAS.filter((f) => !f.evitarEm?.includes(cluster))
    : FILOSOFIAS;
  const pool = elegiveis.length > 0 ? elegiveis : FILOSOFIAS;

  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return pool[h % pool.length];
}

/**
 * Clusters do sistema de CTA que representam orientação de treino, saúde ou
 * nutrição — os únicos que recebem a nota. Página de academia, página local e
 * página de serviço não são "dica de treino": ali a nota soaria deslocada.
 */
const CLUSTERS_COM_NOTA = new Set([
  "exercise", "hypertrophy", "weight_loss", "beginner", "routine",
  "glp1", "pain", "health", "nutrition", "general",
]);

export function clusterRecebeNota(cluster: string): boolean {
  return CLUSTERS_COM_NOTA.has(cluster);
}
