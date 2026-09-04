/**
 * Os índices de região: quem linka as páginas de lugar do acervo.
 *
 * POR QUE ISTO EXISTE
 *
 * 336 artigos não recebiam link de nenhum outro artigo. O índice do blog
 * lista os 839, então o Google chega a todos — o que faltava era o link
 * CONTEXTUAL, de dentro de uma página do mesmo assunto, que é o que passa
 * relevância. Um link dividido por 839 no índice não vale quase nada.
 *
 * 77 desses órfãos eram páginas de lugar, e lugar é a única família do
 * acervo que se resolve por índice em vez de artigo por artigo: ninguém
 * escreve "veja também Alpha Sítio" no meio de um texto sobre hipertrofia,
 * mas todo mundo entende uma lista de onde o Montinho atende.
 *
 * A LISTA É EXPLÍCITA, E NÃO DERIVADA DE REGEX
 *
 * Dá para achar essas páginas com um /alphaville|tambore|barueri/ no slug.
 * Seria errado: a mesma regex pega `academias-sem-taxa-de-matricula` (que
 * não é regional) e perde qualquer condomínio novo com nome que não casa.
 * Lista escrita é conferível — scripts/regiao-test.ts reprova slug que não
 * existe, slug repetido e grupo vazio.
 *
 * O QUE NÃO ENTRA AQUI
 *
 * Páginas que não são de lugar. `personal-trainer-ou-aula-coletiva` e
 * `academias-sem-taxa-de-matricula` são artigos editoriais que por acaso
 * começam com a mesma palavra; eles ganham link contextual pela fila diária
 * de manutenção, que é onde esse tipo de decisão é caso a caso.
 */

export interface GrupoRegiao {
  /** Vira o subtítulo da seção. */
  titulo: string;
  /** Uma linha dizendo a quem aquele grupo serve. */
  descricao: string;
  slugs: string[];
}

/**
 * Guias de academia por necessidade, para /academias-alphaville.
 *
 * A página já existe e já é o hub da região — só que ela lista academias
 * ESPECÍFICAS (a Smart Fit tal, a Bluefit tal). Estes 33 são a outra
 * pergunta, a que vem antes: "qual delas tem piscina?", "qual abre às 5h?".
 * É o lugar natural deles, e não uma página nova competindo com a mesma
 * intenção de busca.
 */
export const GUIAS_DE_ACADEMIA: GrupoRegiao[] = [
  {
    titulo: "Por onde você passa",
    descricao: "Quando o que decide é o trajeto, não a estrutura.",
    slugs: [
      "academias-perto-de-alphaville",
      "academias-perto-de-barueri",
      "academias-perto-de-santana-de-parnaiba",
      "academia-perto-do-shopping-tambore",
      "academia-perto-do-iguatemi-alphaville",
      "academia-perto-do-centro-comercial-alphaville",
      "academia-perto-da-estacao-barueri",
      "academia-perto-da-estacao-antonio-joao",
      "academia-perto-da-castelo-branco",
    ],
  },
  {
    titulo: "Por horário",
    descricao: "Para quem treina de madrugada, no domingo ou fugindo do pico.",
    slugs: [
      "academia-24-horas-alphaville",
      "academia-24-horas-barueri",
      "academias-abertas-aos-domingos-alphaville-barueri",
      "academias-menos-lotadas-alphaville",
    ],
  },
  {
    titulo: "Por estrutura",
    descricao: "Quando a piscina, a sauna ou o estacionamento é o que decide.",
    slugs: [
      "academia-com-piscina-alphaville-barueri",
      "academia-com-natacao-alphaville",
      "academia-com-sauna-alphaville",
      "academia-com-pilates-alphaville",
      "academia-com-spinning-alphaville",
      "academia-com-funcional-alphaville",
      "academia-com-cross-training-alphaville",
      "academia-com-estacionamento-alphaville",
      "academia-climatizada-alphaville",
      "academias-mais-completas-alphaville",
    ],
  },
  {
    titulo: "Por preço",
    descricao: "Os dois extremos da conta, com o que muda de um para o outro.",
    slugs: ["academias-mais-baratas-alphaville-barueri", "academias-premium-alphaville"],
  },
  {
    titulo: "Por objetivo e por público",
    descricao: "A academia certa muda conforme quem treina e para quê.",
    slugs: [
      "academia-para-emagrecer-alphaville",
      "academia-para-hipertrofia-alphaville",
      "academia-para-idosos-alphaville",
      "academia-para-fisiculturistas-alphaville",
      "academia-feminina-alphaville",
      "academia-com-personal-trainer-alphaville",
    ],
  },
  {
    titulo: "Análises de unidades",
    descricao: "Duas academias da região olhadas de perto.",
    slugs: ["academia-gavioes-barueri", "academia-performance-santana-de-parnaiba"],
  },
];

/**
 * Onde o Montinho atende, para a página /onde-atendo.
 *
 * Página NAVEGACIONAL de propósito. A tentação seria mirar "personal trainer
 * alphaville" e ganhar mais uma porta de entrada — mas /personal-trainer-alphaville
 * já disputa esse termo com 18 páginas internas e está na posição 32. Criar a
 * décima nona não ajudaria nenhuma delas.
 */
export const ONDE_ATENDO: GrupoRegiao[] = [
  {
    titulo: "Condomínios de Alphaville e Tamboré",
    descricao:
      "Atendimento na academia do próprio condomínio, com o equipamento que existe lá dentro.",
    slugs: [
      "personal-trainer-alphaville-residencial-zero",
      "personal-trainer-alpha-conde",
      "personal-trainer-alpha-sitio",
      "personal-trainer-burle-marx",
      "personal-trainer-campos-do-conde",
      "personal-trainer-green-valley",
      "personal-trainer-itahye",
      "personal-trainer-morada-dos-lagos",
      "personal-trainer-new-ville",
      "personal-trainer-parque-das-artes",
      "personal-trainer-scenic",
      "personal-trainer-villa-lobos",
      "personal-trainer-villa-solaia",
      "personal-trainer-tambore-3",
      "personal-trainer-tambore-10",
    ],
  },
  {
    titulo: "Cidades",
    descricao:
      "Presencial em Alphaville e região; nas demais, consultoria online com o mesmo acompanhamento.",
    slugs: [
      "personal-trainer-aldeia-da-serra",
      "personal-trainer-santana-de-parnaiba",
      "personal-trainer-carapicuiba",
      "personal-trainer-osasco",
      "personal-trainer-jandira",
      "personal-trainer-itapevi",
      "personal-trainer-cotia",
      "personal-trainer-granja-viana",
      "personal-trainer-vargem-grande-paulista",
      "personal-trainer-pirapora-do-bom-jesus",
      "personal-trainer-jundiai",
      "personal-trainer-itu",
      "personal-trainer-sorocaba",
      "personal-trainer-pinheiros-sao-paulo",
      "personal-trainer-perdizes-sao-paulo",
      "personal-trainer-higienopolis-sao-paulo",
    ],
  },
  {
    titulo: "No trabalho",
    descricao: "Empresas e escritórios da região, com treino encaixado no expediente.",
    slugs: [
      "personal-trainer-para-empresas-alphaville",
      "personal-trainer-para-executivos-alphaville",
      "personal-trainer-empresarial-18-do-forte",
      "personal-trainer-centro-comercial-alphaville",
      "personal-trainer-iguatemi-alphaville",
      "personal-trainer-alameda-rio-negro",
    ],
  },
  {
    titulo: "Como funciona o atendimento em condomínio",
    descricao: "O método, o que precisa ter na academia e para quem costuma fazer sentido.",
    slugs: [
      "personal-trainer-em-condominio-alphaville",
      "personal-trainer-para-condominio-alphaville",
      "personal-trainer-perto-de-mim-alphaville",
      "treinador-particular-alphaville",
      "professor-de-musculacao-alphaville",
    ],
  },
  {
    titulo: "Atendimento por perfil",
    descricao: "Quando a fase da vida muda o que o treino precisa respeitar.",
    slugs: ["personal-trainer-feminino-alphaville", "personal-trainer-para-gestantes-alphaville-tambore"],
  },
];

/** Todo slug citado nos dois índices — é o que o teste confere contra o acervo. */
export function slugsDosIndices(): string[] {
  return [...GUIAS_DE_ACADEMIA, ...ONDE_ATENDO].flatMap((g) => g.slugs);
}
