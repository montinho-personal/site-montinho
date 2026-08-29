/**
 * Onde o CAMINHO aparece nos artigos.
 *
 * O critério aqui é diferente do das ferramentas. Uma calculadora entra onde
 * o leitor chegou com a pergunta que ela responde — no meio do texto, cedo.
 * O caminho é outra coisa: é direção, e serve o leitor que TERMINOU de ler e
 * pensa "entendi, mas e agora?". Por isso entra no fim, como próximo passo,
 * e só em artigos de quem está no COMEÇO da jornada.
 *
 * A seleção é curta de propósito. Estes são artigos em que a pessoa está
 * decidindo começar (ou recomeçar) e a maior dor dela não é uma conta — é
 * não saber a ordem das coisas. Espalhar isto por 200 artigos transformaria
 * o bloco em rodapé ignorado.
 */

export type CaminhoId = "geral" | "dieta" | "treino";

export const CAMINHO_POR_ARTIGO: Record<string, CaminhoId> = {
  /* Treino: a pessoa vai começar a treinar e não sabe por onde. */
  "primeira-semana-na-academia": "treino",
  "como-sair-do-sedentarismo": "treino",
  "exercicio-para-sedentario": "treino",
  "hipertrofia-para-iniciantes": "treino",
  "melhor-treino-para-iniciantes-academia": "treino",
  "musculacao-para-obesos-como-comecar": "treino",

  /* Dieta: a dúvida é alimentar, e o caminho da dieta responde inteira. */
  "dieta-para-comecar-o-ano": "dieta",

  /* Geral: a decisão ainda é "vale a pena?", então mostramos os dois. */
  "vale-a-pena-comecar-academia-agora": "geral",

  /*
   * Quem está escolhendo academia já decidiu começar — o que falta é a
   * ordem. São os artigos mais linkados do site fora dos pilares, e nenhum
   * deles tinha para onde mandar o leitor depois da escolha feita.
   */
  "academia-ou-personal-trainer": "geral",
  "como-escolher-uma-academia": "geral",
  "academias-em-alphaville": "geral",
  "melhor-academia-de-alphaville": "geral",
  "academias-em-barueri": "geral",

  /* Treino: já está treinando em casa, e a dúvida é como organizar. */
  "treino-em-casa-sem-equipamento": "treino",
};

export const TITULOS: Record<CaminhoId, string> = {
  geral: "Ainda não sabe por onde começar?",
  dieta: "Quer transformar isso num plano?",
  treino: "Quer transformar isso num plano?",
};

export const TEXTOS: Record<CaminhoId, string> = {
  geral:
    "Ler ajuda, mas o que costuma travar não é falta de informação — é falta de ordem. O site tem dois caminhos prontos, com ferramentas gratuitas conectadas: um para a comida, outro para o treino.",
  dieta:
    "O caminho da dieta pega você do 'não sei quanto comer' até um cardápio com lista de compras — quatro ferramentas gratuitas, com seus dados passando de uma para a outra sem redigitar nada.",
  treino:
    "O caminho do treino vai do 'por onde eu começo?' até a sua execução conferida em vídeo — cinco passos gratuitos, na ordem certa, sem cadastro.",
};

export const ROTULOS: Record<CaminhoId, string> = {
  geral: "Ver os caminhos",
  dieta: "Ver o caminho da dieta",
  treino: "Ver o caminho do treino",
};

export const HREFS: Record<CaminhoId, string> = {
  geral: "/comece",
  dieta: "/comece/dieta",
  treino: "/comece/treino",
};
