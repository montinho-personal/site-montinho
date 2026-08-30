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
import type { Alimento, Categoria, ValorEscalado } from "./tipos";
import { escalaTodos } from "./escala";
import { buscaAlimentos, montaIndice, type OpcoesBusca, type ResultadoBusca } from "./busca";
import { ALIMENTOS_INDEXAVEIS } from "./indexaveis";

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
  return nome.split(",").map((p) => p.trim()).filter(Boolean).join(" ");
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
