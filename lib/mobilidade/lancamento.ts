/**
 * A chave de lançamento do Destrave Seu Corpo.
 *
 * O Montinho decidiu segurar a ferramenta até os vídeos demonstrativos
 * estarem escolhidos e aprovados por ele — os desenhos não passaram na
 * revisão dele, e lançar com material didático que o dono não aprova seria
 * lançar errado.
 *
 * Enquanto for `false`: a página devolve 404, ela sai do sitemap, o card
 * some de /ferramentas e do ItemList, e os convites nos artigos não
 * renderizam. Todo o código continua no repositório, testado — o motor não
 * sabe que está fora do ar.
 *
 * Para lançar: mudar para `true`. Nada mais.
 */
export const MOBILIDADE_NO_AR = false;
