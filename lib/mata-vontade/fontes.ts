/**
 * "Veja como fazer": receita parecida num grande portal, para quem quer o
 * passo a passo completo. Só entra link encontrado em busca (nunca montado à
 * mão). O texto da ferramenta é nosso, resumido; o portal é referência.
 */
export type Fonte = { portal: string; titulo: string; url: string };

export const FONTES: Record<string, Fonte> = {
  "bolo-caneca-vulcao": { portal: "TudoGostoso", titulo: "Bolo proteico de caneca (bolo de pote com whey)", url: "https://www.tudogostoso.com.br/noticias/essa-receita-de-bolo-proteico-e-de-caneca-e-perfeita-para-quem-nao-quer-sair-da-dieta-e-tem-pressa-a12223.htm" },
  "bolo-chocolate-forma": { portal: "TudoGostoso", titulo: "Bolo de chocolate saudável com aveia e banana", url: "https://www.tudogostoso.com.br/noticias/nunca-foi-tao-facil-preparar-um-bolo-de-chocolate-saudavel-com-aveia-e-banana-em-20-minutos-a10543.htm" },
  "bolo-caneca-choc-sem-ovo": { portal: "TudoGostoso", titulo: "Bolo de caneca sem ovo", url: "https://www.tudogostoso.com.br/receita/163866-bolo-de-caneca-sem-ovo.html" },
  "brownie-air-fryer": { portal: "TudoGostoso", titulo: "Brownie de airfryer com apenas três ingredientes", url: "https://www.tudogostoso.com.br/noticias/sabe-aquela-receita-que-ate-uma-crianca-de-6-anos-consegue-fazer-brownie-de-airfryer-com-apenas-tres-ingredientes-cremoso-e-saudavel-a16756.htm" },
  "brigadeiro-panela-medida": { portal: "TudoGostoso", titulo: "Brigadeiro", url: "https://www.tudogostoso.com.br/receita/6174-brigadeiro.html" },
  "brigadeiro-banana-cacau": { portal: "TudoGostoso", titulo: "Receita de brigadeiro fit com 3 ingredientes", url: "https://www.tudogostoso.com.br/noticias/receita-de-brigadeiro-fit-com-3-ingredientes-aprenda-a-preparar-versao-saudavel-do-doce-para-comer-sem-culpa-a11578.htm" },
  "morango-chocolate-derretido": { portal: "TudoGostoso", titulo: "Morango trufado", url: "https://www.tudogostoso.com.br/receita/26298-morango-trufado.html" },
  "cookie-aveia-banana": { portal: "TudoGostoso", titulo: "Cookie de aveia com banana", url: "https://www.tudogostoso.com.br/receita/21034-cookie-de-aveia-com-banana.html" },
  "cookie-caneca": { portal: "TudoGostoso", titulo: "Cookie de pote com 166 calorias", url: "https://www.tudogostoso.com.br/noticias/parece-um-sonho-cookie-de-pote-delicioso-com-apenas-166-calorias-e-pronto-em-menos-de-2-minutos-a11308.htm" },
  "nice-cream-chocolate": { portal: "TudoGostoso", titulo: "Sorvete saudável com menos de 350 calorias", url: "https://www.tudogostoso.com.br/noticias/chega-de-abrir-mao-da-sobremesa-descubra-o-sorvete-saudavel-com-menos-de-350-calorias-que-voce-pode-comer-a-vontade-todos-os-dias-a23779.htm" },
  "picole-iogurte": { portal: "TudoGostoso", titulo: "Picolé de frutas", url: "https://www.tudogostoso.com.br/receita/195762-picole-de-frutas.html" },
  "mousse-cottage-cacau": { portal: "TudoGostoso", titulo: "Mousse de chocolate brilhante e cremosa fit", url: "https://www.tudogostoso.com.br/noticias/mousse-de-chocolate-brilhante-e-cremosa-fit-o-segredo-da-receita-esta-em-um-ingrediente-inesperado-a18659.htm" },
  "mousse-morango": { portal: "TudoGostoso", titulo: "Mousse de iogurte com geleia de morango fácil de fazer", url: "https://www.tudogostoso.com.br/noticias/mousse-de-iogurte-com-geleia-de-morango-facil-de-fazer-a4164.htm" },
  "pudim-caneca": { portal: "TudoGostoso", titulo: "Pudim de caneca sem leite condensado (de leite e de chocolate)", url: "https://www.tudogostoso.com.br/receita/308983-pudim-de-caneca-sem-leite-condensado-de-leite-e-de-chocolate.html" },
  "pudim-chia-baunilha": { portal: "TudoGostoso", titulo: "Pudim de chia", url: "https://www.tudogostoso.com.br/receita/199814-pudim-de-chia.html" },
  "bombom-pacoca": { portal: "TudoGostoso", titulo: "Bombom de paçoca", url: "https://www.tudogostoso.com.br/receita/7463-bombom-de-pacoca.html" },
  "churros-air-fryer": { portal: "TudoGostoso", titulo: "Churros também pode ser fit com essa receita superprática e na airfryer", url: "https://www.tudogostoso.com.br/noticias/churros-tambem-pode-ser-fit-com-essa-receita-superpratica-e-na-airfryer-fica-simplesmente-dos-deuses-a15715.htm" },
  "banana-churros": { portal: "Receiteria", titulo: "Churros de banana fit", url: "https://www.receiteria.com.br/receita/churros-de-banana-fit/" },
  "cheesecake-pote": { portal: "TudoGostoso", titulo: "Cheesecake no pote de iogurte", url: "https://www.tudogostoso.com.br/receita/320282-cheesecake-no-pote-de-iogurte.html" },
  "cheesecake-caneca": { portal: "TudoGostoso", titulo: "Cheesecake Fácil de Micro-ondas", url: "https://www.tudogostoso.com.br/receita/96228-cheesecake-facil-de-micro-ondas.html" },
  "milkshake-proteico": { portal: "TudoGostoso", titulo: "Shake de whey com banana", url: "https://www.tudogostoso.com.br/receita/175515-shake-de-whey-com-banana.html" },
  "milkshake-morango": { portal: "TudoGostoso", titulo: "Milkshake de morango", url: "https://www.tudogostoso.com.br/receita/146681-milkshake-de-morango.html" },
  "bolo-caneca-baunilha": { portal: "TudoGostoso", titulo: "Essa receita de bolo proteico e de caneca é perfeita para quem não quer sair da dieta", url: "https://www.tudogostoso.com.br/noticias/essa-receita-de-bolo-proteico-e-de-caneca-e-perfeita-para-quem-nao-quer-sair-da-dieta-e-tem-pressa-a12223.htm" },
  "bolo-caneca-banana-canela": { portal: "TudoGostoso", titulo: "Bolo de banana com aveia de caneca", url: "https://www.tudogostoso.com.br/receita/177689-bolo-de-banana-com-aveia-de-caneca.html" },
};
