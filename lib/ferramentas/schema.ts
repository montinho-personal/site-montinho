import { SITE_URL } from "@/lib/blog";

/**
 * SoftwareApplication das ferramentas, num lugar só.
 *
 * POR QUE UM GERADOR, E NÃO ONZE BLOCOS COLADOS
 *
 * O bloco tem oito campos e nenhum deles muda entre as ferramentas, exceto
 * nome, descrição e endereço. Colado onze vezes, o dia em que o Google mudar
 * uma exigência vira onze edições — e a décima primeira é a que alguém
 * esquece. Aqui é uma.
 *
 * POR QUE O TIPO É VERDADEIRO
 *
 * As treze páginas são aplicativos de navegador: a pessoa preenche, o
 * resultado sai na hora, nada é cobrado e nada exige cadastro. Declarar
 * SoftwareApplication é descrever o que a página é. O que NÃO entra aqui é
 * aggregateRating: nenhuma delas tem avaliação de usuário, e nota inventada
 * não deixa o bloco meio certo — derruba o bloco inteiro.
 */
export interface FerramentaSchema {
  /** Nome curto, como a pessoa chamaria. Não é o título da aba. */
  nome: string;
  /** Uma frase dizendo o que a ferramenta faz. */
  descricao: string;
  /** Caminho a partir da raiz, começando com barra. */
  caminho: string;
  /**
   * HealthApplication para o que trata de corpo, treino e alimentação —
   * que é o caso de todas por enquanto. O campo existe para o dia em que
   * não for.
   */
  categoria?: "HealthApplication" | "UtilitiesApplication";
}

export function aplicativoSchema({ nome, descricao, caminho, categoria = "HealthApplication" }: FerramentaSchema) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: nome,
    applicationCategory: categoria,
    operatingSystem: "Web",
    url: `${SITE_URL}${caminho}`,
    description: descricao,
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    author: { "@type": "Person", name: "Montinho Personal Trainer", url: SITE_URL },
  };
}
