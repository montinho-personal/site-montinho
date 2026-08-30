/**
 * Artigos que ganham a ficha do alimento no fim do texto.
 *
 * POR QUE ISTO NÃO É UM REGISTRO DE FERRAMENTA
 *
 * A regra de cobertura (lib/ferramentas/cobertura.ts) obriga todo artigo novo
 * a passar por uma decisão sobre FERRAMENTA — e por isso proíbe um artigo de
 * estar em dois registros: duas calculadoras no mesmo texto brigariam pelo
 * mesmo espaço e pela mesma atenção.
 *
 * A ficha de alimento não é ferramenta. Ela não calcula nada: mostra um
 * número que já existe e diz de onde ele veio. É uma citação de dado, do
 * mesmo tipo que uma referência bibliográfica — e cabe ao lado de uma
 * calculadora sem competir, porque responde outra pergunta. A calculadora
 * responde "quanto EU preciso"; a ficha responde "quanto TEM na comida".
 *
 * Por isso este registro fica fora de REGISTROS no teste de cobertura, e a
 * decisão está escrita aqui em vez de acontecer por omissão.
 *
 * A REGRA DO NÚMERO
 *
 * Nenhum valor nutricional é digitado aqui. O registro guarda apenas SLUGS —
 * os números vêm da base no momento de montar a página. É o que impede um
 * artigo de dizer 32 g de proteína enquanto /alimentos diz outra coisa.
 */

export interface FichaDeArtigo {
  /** Alimentos a mostrar, na ordem. Dois ou três; mais vira lista. */
  alimentos: string[];
  /**
   * O nutriente que o artigo discute — é ele que aparece em destaque, junto
   * das calorias. Um artigo sobre ferro que destacasse proteína seria uma
   * ficha tecnicamente correta e editorialmente inútil.
   */
  destaque: string;
}

export const FICHAS_POR_ARTIGO: Record<string, FichaDeArtigo> = {
  "proteina-em-alimentos-tabela-completa": {
    alimentos: ["frango-peito-sem-pele-grelhado", "ovo-de-galinha-inteiro-cozido-10minutos", "feijao-carioca-cozido"],
    destaque: "proteina",
  },
  "alimentos-ricos-em-proteina": {
    alimentos: ["frango-peito-sem-pele-grelhado", "carne-bovina-patinho-sem-gordura-grelhado", "lentilha-cozida"],
    destaque: "proteina",
  },
  "alimentos-ricos-em-ferro": {
    alimentos: ["feijao-carioca-cozido", "lentilha-cozida", "carne-bovina-acem-moido-cozido"],
    destaque: "ferro",
  },
  "alimentos-ricos-em-fibra": {
    alimentos: ["feijao-carioca-cozido", "aveia-flocos-crua", "abacate-cru"],
    destaque: "fibra",
  },
  "quantos-ovos-por-dia": {
    alimentos: ["ovo-de-galinha-inteiro-cozido-10minutos", "ovo-de-galinha-inteiro-cru"],
    destaque: "proteina",
  },
  "batata-doce-emagrece": {
    alimentos: ["batata-doce-cozida", "batata-inglesa-cozida"],
    destaque: "carboidrato",
  },
  "carboidratos-simples-vs-complexos": {
    alimentos: ["arroz-tipo-1-cozido", "arroz-integral-cozido", "aveia-flocos-crua"],
    destaque: "carboidrato",
  },
  "marmita-fitness-como-montar": {
    alimentos: ["arroz-tipo-1-cozido", "feijao-carioca-cozido", "frango-peito-sem-pele-grelhado"],
    destaque: "proteina",
  },
  "proteina-vegetal-vs-animal": {
    alimentos: ["frango-peito-sem-pele-grelhado", "lentilha-cozida", "soja-queijo-tofu"],
    destaque: "proteina",
  },
  "lista-de-compras-fitness-semanal": {
    alimentos: ["arroz-tipo-1-cozido", "feijao-carioca-cozido", "ovo-de-galinha-inteiro-cozido-10minutos"],
    destaque: "proteina",
  },
};

export const ARTIGOS_COM_FICHA = Object.keys(FICHAS_POR_ARTIGO);
