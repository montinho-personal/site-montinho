/**
 * O índice que vai para o navegador.
 *
 * A base completa tem 2,3 MB — 597 alimentos × 26 nutrientes, com estado e
 * proveniência em cada célula. Mandar isso para o celular de quem só quer
 * saber quanta proteína tem o feijão seria trocar a utilidade da ferramenta
 * pela conveniência de quem a escreveu.
 *
 * Este índice carrega só o que a BUSCA precisa: nome, slug, categoria,
 * aliases e os cinco números do card principal. Dá cerca de 90 KB, cabe numa
 * conexão ruim, e a busca acontece no aparelho — sem ida ao servidor a cada
 * tecla, que é o que faz parecer instantânea.
 *
 * O resto (micronutrientes, proveniência, unidades) só é lido na página do
 * alimento, que é gerada no build. O navegador nunca vê o JSON grande.
 */

import type { Categoria } from "./tipos";

export interface AlimentoLeve {
  s: string;
  /** nome */
  n: string;
  /** categoria */
  c: Categoria;
  /** aliases */
  a: string[];
  /**
   * Os valores por 100 g, na ordem de ORDEM_LEVE.
   *
   * Os CINCO PRIMEIROS são o card principal e essa ordem é fixa — telas
   * dependem dos índices 0 a 4. Ferro e potássio vêm depois porque servem só
   * à descoberta ("alimentos com mais ferro"), e não ao card: acrescentá-los
   * no fim mantém os índices antigos válidos.
   *
   * `null` quando o valor não é número — traço, não aplicável, em reavaliação
   * ou não analisado. A distinção fina fica para a página do alimento; aqui,
   * o que importa é não inventar zero. E não inventar zero é o que impede um
   * ranking de "mais ferro" de ordenar alimento não-medido como se tivesse
   * zero ferro.
   */
  v: (number | null)[];
  /**
   * Umidade em g por 100 g, quando analisada.
   *
   * Está no índice leve por um motivo de produto: é ela que permite avisar
   * que dois alimentos não são comparáveis por peso quando um é seco e o
   * outro é cozido. Sem esse número, o comparador apresentaria a aveia crua
   * como "muito mais calórica" que o mingau e deixaria a conclusão errada
   * de pé.
   */
  u: number | null;
  /**
   * Medidas caseiras: nome e gramas.
   *
   * Vai no índice leve porque o buscador da /alimentos mostra o alimento sem
   * navegar, e a medida caseira precisa estar onde o alimento aparece — não
   * só na página própria. São 39 alimentos com ~4 medidas cada; o peso disso
   * é desprezível perto de ter duas telas do mesmo alimento com recursos
   * diferentes.
   *
   * A proveniência detalhada de cada medida (código na POF e preparação) NÃO
   * vem junto: ela é longa e vive na página do alimento. Aqui a atribuição à
   * fonte aparece uma vez, embaixo dos botões.
   */
  p?: { n: string; g: number }[];
  /** tem página própria? */
  i: boolean;
}

export const ORDEM_LEVE = [
  "energia", "proteina", "carboidrato", "lipideos", "fibra",
  "ferro", "potassio",
] as const;

/** Quantos dos valores acima formam o card principal. */
export const QTD_PRINCIPAIS = 5;
