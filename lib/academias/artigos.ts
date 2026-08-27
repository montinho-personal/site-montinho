import type { BlogPost } from "@/lib/blog";
import { ACADEMIAS } from "@/lib/academias/base";

/**
 * Quais artigos podem receber o CTA do comparador de academias.
 *
 * O critério não é "fala de academia" — é "fala de academia ONDE a ferramenta
 * tem dados". A base cobre Alphaville e o entorno imediato; oferecer o
 * comparador num artigo sobre academias de Santana de Parnaíba manda a pessoa
 * responder oito perguntas para receber uma lista de outra cidade. Pior que
 * não oferecer nada.
 *
 * Também ficam de fora os artigos das unidades encerradas e o da Competition:
 * ali o leitor já está lendo um aviso de correção que aponta para o guia, e
 * empilhar um segundo convite no meio do texto seria ruído.
 */

/** Cidades vizinhas que a base NÃO cobre. */
const FORA = /barueri|santana-de-parnaiba|parnaiba|aldeia-da-serra|cotia|itapevi|jandira|osasco|carapicuiba|granja-viana/;

/** Sinal de que o artigo é sobre academia, e não sobre serviço de personal. */
const ACADEMIA = /academia|academias/;

/**
 * Artigos de serviço presencial. Quem lê sobre treinar no próprio condomínio
 * ou sobre contratar personal não está escolhendo academia — o convite ali
 * seria um convite para o problema errado.
 */
const SERVICO = /personal-trainer|condominio|a-domicilio|treinador-particular|professor-de-musculacao|consultoria/;

/** Artigos com aviso de correção — não recebem CTA no meio. */
const CORRIGIDOS = new Set(["competition-alphaville", ...ACADEMIAS.filter((a) => a.status !== "ativa").map((a) => a.artigoSlug ?? "")]);

/** Marcas presentes na base — "smart-fit-alphaville" não casa com /academia/. */
function marcas(): RegExp {
  const nomes = ACADEMIAS.map((a) =>
    a.nome
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+alphaville$/, "")
      .trim()
      .replace(/\s+/g, "[- ]?")
  ).filter((n) => n.length > 2);
  return new RegExp(nomes.join("|"));
}

const MARCAS = marcas();

export function artigoDeAcademiaAlphaville(post: BlogPost): boolean {
  if (CORRIGIDOS.has(post.slug)) return false;

  const hay = `${post.slug} ${post.title}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // Cidade vizinha vence tudo: mesmo citando Alphaville, o artigo é de lá.
  if (FORA.test(hay)) return false;
  if (SERVICO.test(hay)) return false;
  if (!/alphaville|tambore/.test(hay)) return false;

  return ACADEMIA.test(hay) || MARCAS.test(hay);
}
