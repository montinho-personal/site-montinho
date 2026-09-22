/**
 * A página canônica de cada ferramenta embutida em artigo.
 *
 * O PROBLEMA QUE ISTO RESOLVE, E COMO ELE FOI DESCOBERTO
 *
 * 56 artigos renderizam uma calculadora inteira no meio do texto, e nenhum
 * deles linkava para a página da ferramenta. O efeito no Search Console era
 * o esperado depois que a gente para para pensar: as páginas /ferramentas/*
 * não ranqueavam nem para o próprio nome — "calculadora de proteína" na
 * posição 52, "calculadora de macros" na 61, "calcular macros" na 70. Todas
 * as onze consultas de calculadora do site estavam entre a 35 e a 78,
 * enquanto os artigos sobre os mesmos assuntos ficavam entre a 4 e a 12.
 *
 * Não era problema de título nem de conteúdo. Era ausência de link: o Google
 * via a calculadora dentro do artigo, com toda a autoridade do artigo, e
 * nenhum caminho até a URL que deveria ser a dona daquela intenção. O
 * embutido competia com a página canônica e ganhava.
 *
 * O link daqui é a correção mínima. Ele não tira nada do artigo — a
 * calculadora continua inteira lá — e dá ao Google o que faltava: um caminho
 * até a página canônica, com a palavra da busca na âncora, saindo de páginas
 * que já têm autoridade no assunto.
 *
 * A ÂNCORA É O PRODUTO
 *
 * "clique aqui" desperdiça o link. A âncora carrega o nome pelo qual a
 * ferramenta é procurada, porque é exatamente esse texto que diz ao Google o
 * que existe do outro lado.
 */

export interface Canonica {
  href: string;
  /** A âncora. É o termo de busca, não um rótulo interno. */
  ancora: string;
  /** O que a página canônica tem a mais que o embutido — ou por que voltar nela. */
  motivo: string;
}

/** A chave é o identificador que app/blog/[slug]/page.tsx já usa para escolher o embed. */
export const CANONICA: Record<string, Canonica> = {
  polichinelos: {
    href: "/ferramentas/calculadora-polichinelos",
    ancora: "Calculadora de Polichinelos",
    motivo: "que faz a conta com o seu peso e o seu ritmo, incluindo a equivalência com caminhada",
  },
  caminhada: {
    href: "/ferramentas/calculadora-calorias-caminhada",
    ancora: "Calculadora de Calorias da Caminhada",
    motivo: "que faz a conta com o seu peso, o seu ritmo e a inclinação da esteira, por tempo, distância ou passos",
  },
  eliptico: {
    href: "/ferramentas/calculadora-calorias-eliptico",
    ancora: "Calculadora de Calorias do Elíptico",
    motivo: "que faz a conta com o seu peso e o seu esforço, compara com o visor do aparelho e com a esteira",
  },
  atividades: {
    href: "/ferramentas/calculadora-calorias-atividades",
    ancora: "Calculadora de Calorias por Atividade",
    motivo: "que faz a conta com o seu peso e o seu ritmo, desconta as pausas da aula se você quiser e compara nove atividades",
  },
  corrida: {
    href: "/ferramentas/calculadora-corrida",
    ancora: "Calculadora de Corrida",
    motivo: "que converte pace, tempo e distância, estima o tempo de 5 km a 42 km e compara correr com caminhar",
  },
  glp1: {
    href: "/ferramentas/massa-magra-glp1",
    ancora: "Calculadora de Massa Magra no GLP-1",
    motivo: "com as faixas dos ensaios clínicos, o que muda com treino e proteína, e o que a massa magra realmente inclui",
  },
  meta: {
    href: "/ferramentas/meta-de-peso",
    ancora: "Calculadora de Meta de Peso",
    motivo: "que projeta a faixa possível até a sua data e diz se o número que você tem em mente cabe nela",
  },
  potencial: {
    href: "/ferramentas/potencial-natural",
    ancora: "Calculadora de Potencial Natural",
    motivo: "com o FFMI normalizado, o que o número 25 realmente significa e o ritmo de ganho esperado no seu nível",
  },
  futebol: {
    href: "/ferramentas/calculadora-calorias-futebol",
    ancora: "Calculadora de Calorias no Futebol",
    motivo: "que separa o tempo de bola rolando do tempo na lateral e mostra quantas latas o jogo realmente pagou",
  },
  composicao: {
    href: "/ferramentas/composicao-corporal",
    ancora: "Calculadora de Composição Corporal",
    motivo: "que traduz o exame em quilos de gordura e de massa magra e mostra o que muda com e sem treino de força",
  },
  proteina: {
    href: "/ferramentas/calculadora-de-proteina",
    ancora: "Calculadora de Proteína",
    motivo: "com a explicação de como a faixa por quilo é definida e o que muda em déficit",
  },
  macros: {
    href: "/ferramentas/calculadora-macros",
    ancora: "Calculadora de Macros",
    motivo: "com a metodologia da divisão entre proteína, carboidrato e gordura",
  },
  deficit: {
    href: "/ferramentas/calculadora-deficit-calorico",
    ancora: "Calculadora de Déficit Calórico",
    motivo: "com as faixas de déficit e por que a mais agressiva costuma cobrar caro",
  },
  tdee: {
    href: "/ferramentas/calculadora-tmb-tdee",
    ancora: "Calculadora de TMB e TDEE",
    motivo: "com as fórmulas usadas e a margem de erro de cada uma",
  },
  onerm: {
    href: "/ferramentas/calculadora-1rm",
    ancora: "Calculadora de 1RM",
    motivo: "com a comparação entre as fórmulas e onde cada uma erra mais",
  },
  volume: {
    href: "/ferramentas/calculadora-volume-treino",
    ancora: "Calculadora de Volume de Treino",
    motivo: "com as séries semanais por grupo muscular e as referências",
  },
  fc: {
    href: "/ferramentas/zonas-de-frequencia-cardiaca",
    ancora: "Calculadora de Zonas de Frequência Cardíaca",
    motivo: "com as cinco zonas explicadas e o que treinar em cada uma",
  },
  cardapio: {
    href: "/ferramentas/monte-seu-cardapio",
    ancora: "Monte Seu Cardápio",
    motivo: "com o plano semanal completo, as substituições e a lista de compras",
  },
};
