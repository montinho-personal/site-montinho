/**
 * A regra de cobertura: todo artigo novo passa por uma decisão de ferramenta.
 *
 * O problema que isto resolve apareceu na prática. Sete artigos foram
 * publicados em dois dias e nenhum recebeu ferramenta — não porque alguém
 * decidiu que não cabia, mas porque ninguém lembrou de perguntar. E o mesmo
 * já tinha acontecido antes com o artigo mais linkado do site inteiro, que
 * ficou anos sem nada.
 *
 * A regra NÃO é "todo artigo precisa de ferramenta". Seria falsa: existe
 * artigo cuja pergunta não termina em conta nenhuma, e enfiar calculadora
 * nele piora a leitura e dilui a ferramenta. A regra é que a decisão precisa
 * ser EXPLÍCITA — ou o artigo está num registro de ferramenta, ou está
 * listado aqui com o motivo de não estar.
 *
 * Vale a partir de DATA_DA_REGRA. O acervo anterior é grande demais para
 * classificar de uma vez, e forçar isso agora transformaria a regra numa
 * dívida impagável que o teste reprovaria para sempre. O passado entra aos
 * poucos, quando alguém mexer no artigo.
 *
 * Como cumprir, ao publicar um artigo novo:
 *
 *   1. Pergunte: o leitor termina este texto com uma conta na cabeça?
 *   2. Se sim, registre no registro da ferramenta que responde essa conta.
 *      Cuidado com os tetos — vários registros são limitados a oito por um
 *      teste de seletividade, e nesses casos existe a variante de LINK.
 *   3. Se não, acrescente o slug aqui embaixo com uma frase dizendo por quê.
 *
 * O teste de cobertura reprova qualquer artigo novo que não esteja nem num
 * lugar nem no outro.
 */

/** A regra só vale para artigos publicados a partir desta data. */
export const DATA_DA_REGRA = "2026-08-29";

/**
 * Artigos que ficam sem ferramenta por decisão, com o motivo.
 *
 * O motivo não é burocracia: é o que impede a lista de virar depósito de
 * "não deu tempo". Se você não consegue escrever a frase, provavelmente o
 * artigo cabe numa ferramenta.
 */
export const ARTIGOS_SEM_FERRAMENTA: Record<string, string> = {
  "forca-de-pegada-e-antebraco":
    "A pergunta do leitor é o que fazer com a mão que solta a barra, e a resposta é um exercício, não um número. Nenhuma das ferramentas do site calcula pegada — colocar a de volume aqui seria empurrar a ferramenta disponível em vez da certa.",

  "acessorios-de-treino-valem-a-pena":
    "O artigo responde uma decisão de compra, não uma conta. Quem termina de ler quer saber se compra o cinto — e nenhuma calculadora responde isso.",

  "primeira-sessao-com-personal-trainer":
    "O leitor termina sem conta na cabeça: ele quer saber se pode marcar sem medo. A pergunta que sobra é para o WhatsApp, e o artigo já leva lá. Ferramenta aqui seria desvio no fundo do funil.",

  "personal-trainer-ou-aula-coletiva":
    "Decisão de formato, não de número. Quem termina de ler quer saber qual dos dois marca, e a resposta depende de lesão, objetivo e rotina — coisas que a conversa inicial resolve e nenhuma calculadora resolve.",
};

export const SLUGS_SEM_FERRAMENTA = Object.keys(ARTIGOS_SEM_FERRAMENTA);
