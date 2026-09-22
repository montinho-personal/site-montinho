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
 *
 * LANÇADA EM 22/09/2026, COM OS DESENHOS
 *
 * O Montinho decidiu subir sem esperar os GIFs, depois de 25 dias fora do
 * ar. Os GIFs substituem só as figuras dos 9 exercícios de MOVIMENTO, e vão
 * entrando um a um conforme chegam; as 10 figuras dos testes e os 4
 * alongamentos parados ficam em desenho de propósito — no teste, o ponto
 * colorido que decide se ele vale ensina melhor do que um vídeo do corpo
 * inteiro. Enquanto um GIF não chega, o desenho dele continua valendo.
 */
export const MOBILIDADE_NO_AR = true;
