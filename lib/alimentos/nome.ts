/**
 * Fica num arquivo próprio, sem importar a base, para que componentes no
 * navegador usem o mesmo nome sem levar o JSON de 2,3 MB junto.
 */

/**
 * O nome como ele cabe numa frase.
 *
 * A TACO escreve em ordem invertida com vírgulas ("Feijão, carioca, cozido")
 * porque é uma tabela ordenada por ingrediente-base. Numa lista isso é ótimo;
 * dentro de uma frase vira "em 100 g de feijão, carioca, cozido há...", que
 * ninguém fala. O nome exibido em lista continua o da fonte — é o que permite
 * conferir contra a tabela —, e só o texto corrido usa esta forma.
 */
export function nomeNatural(nome: string): string {
  return (
    nome
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean)
      .join(" ")
      /*
       * Três alimentos da TACO trazem o tempo de cozimento colado por barra
       * ("cozido/10minutos"). Numa tabela isso é notação; dentro de uma frase
       * vira "ovo de galinha inteiro cozido/10minutos", que trava a leitura.
       * A informação é boa e fica — só ganha a forma de quem escreve, não a
       * de quem tabula.
       */
      .replace(/\/(\d+)\s*minutos?/gi, " por $1 minutos")
      .replace(/\s+/g, " ")
      .trim()
  );
}
