/**
 * A camada de serviço da base nutricional.
 *
 * É a única porta de entrada para os dados: páginas, componentes e futuros
 * widgets em artigo passam por aqui. Nenhum número nutricional deve ser
 * digitado em outro lugar do site — se dois lugares mostram o feijão, os dois
 * leem daqui, e não há como divergirem.
 *
 * Roda no servidor, em tempo de build. O JSON tem 2,3 MB e jamais deve ir
 * para o navegador inteiro; o que vai é o índice enxuto de `indice.ts`.
 */

import bruto from "@/data/alimentos/processado/taco.json";
import medidas from "@/data/alimentos/processado/medidas.json";
import type { Alimento, Categoria, Porcao, ValorEscalado } from "./tipos";
import { escalaTodos } from "./escala";
import { buscaAlimentos, montaIndice, type OpcoesBusca, type ResultadoBusca } from "./busca";
import { ALIMENTOS_INDEXAVEIS } from "./indexaveis";
import { podeEntrarEmProducao } from "./fontes";

const TODOS: Alimento[] = (bruto as { alimentos: Alimento[] }).alimentos.map((a) => ({
  ...a,
  /**
   * A promoção para indexável acontece aqui, na leitura — não no JSON.
   *
   * O JSON é o retrato fiel da importação e não deve carregar decisão
   * editorial. Quais alimentos merecem página própria é escolha nossa, muda
   * com o tempo, e por isso mora numa lista curada e versionada à parte.
   */
  indexavel: ALIMENTOS_INDEXAVEIS.includes(a.slug),
  /**
   * As medidas caseiras vêm da POF/IBGE e são casadas por slug aqui, em vez
   * de dentro do JSON da TACO. Os dois arquivos têm fontes diferentes e ciclos
   * de atualização diferentes: misturá-los faria a reimportação de um apagar
   * o outro, e faria a proveniência dos pesos se perder dentro da tabela de
   * composição — que não publica peso de concha nenhum.
   */
  porcoes: podeEntrarEmProducao("IBGE_POF")
    ? ((medidas as { medidas: Record<string, Porcao[]> }).medidas[a.slug] ?? [])
    : /*
       * A trava de licença vale para mim também.
       *
       * As medidas estão importadas, conferidas e prontas — 125 delas, com
       * código do IBGE e preparação em cada uma. Mas os termos de uso da
       * publicação ainda não foram lidos na origem, e foi exatamente a frase
       * "provavelmente permite" que esta trava existe para recusar. Ela não
       * pode valer só quando é cômoda.
       *
       * Assim que os termos forem conferidos e verificadoEm for preenchido em
       * fontes.ts, os botões de medida caseira aparecem sozinhos.
       */
      [],
}));

const POR_SLUG = new Map(TODOS.map((a) => [a.slug, a]));
const INDICE = montaIndice(TODOS);

export function todosAlimentos(): Alimento[] {
  return TODOS;
}

export function getAlimento(slug: string): Alimento | null {
  return POR_SLUG.get(slug) ?? null;
}

/** Os que têm página própria — os únicos que entram em sitemap e index. */
export function alimentosIndexaveis(): Alimento[] {
  return TODOS.filter((a) => a.indexavel);
}

export function searchAlimentos(consulta: string, opcoes?: OpcoesBusca): ResultadoBusca[] {
  return buscaAlimentos(INDICE, consulta, opcoes);
}

export function alimentosDaCategoria(c: Categoria): Alimento[] {
  return TODOS.filter((a) => a.categoria === c);
}

/** Os nutrientes de um alimento já escalados para a quantidade pedida. */
export function escalaAlimento(a: Alimento, gramas: number): ValorEscalado[] {
  return escalaTodos(a.nutrientes, gramas);
}

/** Valor por 100 g de um nutriente, quando ele foi analisado. */
export function valorPor100g(a: Alimento, nutrienteId: string): number | null {
  const v = a.nutrientes.find((n) => n.nutrienteId === nutrienteId);
  return v && v.estado === "analisado" ? v.valorPor100g : null;
}

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

export const NOME_CATEGORIA: Record<Categoria, string> = {
  "cereais-e-derivados": "Cereais e derivados",
  "verduras-hortalicas-e-derivados": "Verduras, hortaliças e derivados",
  "frutas-e-derivados": "Frutas e derivados",
  "gorduras-e-oleos": "Gorduras e óleos",
  "pescados-e-frutos-do-mar": "Pescados e frutos do mar",
  "carnes-e-derivados": "Carnes e derivados",
  "leite-e-derivados": "Leite e derivados",
  bebidas: "Bebidas",
  "ovos-e-derivados": "Ovos e derivados",
  "produtos-acucarados": "Produtos açucarados",
  miscelaneas: "Miscelâneas",
  "outros-industrializados": "Outros industrializados",
  "alimentos-preparados": "Alimentos preparados",
  "leguminosas-e-derivados": "Leguminosas e derivados",
  "nozes-e-sementes": "Nozes e sementes",
};
