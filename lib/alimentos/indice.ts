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
   * Os cinco principais por 100 g, na ordem: energia, proteína, carboidrato,
   * lipídeos, fibra. `null` quando o valor não é número — traço, não
   * aplicável ou não analisado. A distinção fina fica para a página do
   * alimento; aqui, o que importa é não inventar zero.
   */
  v: (number | null)[];
  /** tem página própria? */
  i: boolean;
}

export const ORDEM_LEVE = ["energia", "proteina", "carboidrato", "lipideos", "fibra"] as const;
