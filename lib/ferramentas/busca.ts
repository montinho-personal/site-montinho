import { CATEGORIAS, FERRAMENTAS_NO_AR, MAIS_USADAS, porId, type FerramentaCatalogo } from "./catalogo";

/**
 * A busca da Central de Ferramentas.
 *
 * O QUE ELA PRECISA ACERTAR
 *
 * Quem digita "perder peso" não sabe que a resposta se chama "Calculadora
 * de Déficit Calórico". Quem digita "quanto peso colocar" quer o 1RM. A
 * busca por nome resolveria só quem já conhece a ferramenta — que é quem
 * menos precisa de busca. Então ela lê o nome, a frase de resultado, a
 * categoria e as tags, que é onde mora a linguagem leiga.
 *
 * COMO FUNCIONA
 *
 * 1. Normaliza: sem acento, minúsculas, sem pontuação, sem palavras vazias
 *    ("quanto", "de", "meu"). "Quanto de proteína?" vira ["proteina"].
 * 2. Expande sinônimos: "secar" também procura "emagrecer".
 * 3. Casa por prefixo: "emagrec" acha "emagrecer", "caloria" acha
 *    "calorias". Prefixo com pelo menos 4 letras, para "pe" não achar tudo.
 * 4. Exige que TODA palavra da consulta case em algum campo (E, não OU) e
 *    pontua: nome vale mais que tag, tag vale mais que descrição.
 * 5. Sem resultado estrito, tenta OU e devolve como "relacionadas". Sem
 *    nada, as mais usadas — a página nunca fica vazia.
 *
 * É função pura: recebe texto, devolve listas. Nada de DOM, nada de rede.
 */

export const TAMANHO_MINIMO = 2;

const VAZIAS = new Set([
  "a", "o", "e", "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas", "um", "uma", "uns", "umas", "para", "pra", "pro", "por", "com",
  "sem", "que", "qual", "quais", "como", "quanto", "quanta", "quantos", "quantas", "meu", "minha", "meus", "minhas", "eu", "me", "se", "ou",
  "devo", "preciso", "quero", "posso", "tem", "ter", "faz", "fazer", "ser", "esta", "esta", "isso", "aqui", "hoje", "dia", "calculadora", "calcular", "calculo",
]);

const SINONIMOS: Record<string, string[]> = {
  secar: ["emagrecer"], definir: ["emagrecer"], definicao: ["emagrecer"], cutting: ["emagrecer"], shape: ["emagrecer"], magro: ["emagrecer"],
  perder: ["emagrecer"], emagrecimento: ["emagrecer"], gordura: ["emagrecer", "gordura"],
  queimar: ["calorias"], queima: ["calorias"], gastar: ["calorias"], gasto: ["calorias", "gasto"], kcal: ["calorias"], caloria: ["calorias"],
  massa: ["massa", "hipertrofia"], musculo: ["massa", "hipertrofia", "musculo"], musculos: ["massa", "hipertrofia"], bulking: ["massa", "hipertrofia"], crescer: ["hipertrofia"],
  dieta: ["dieta", "comer"], alimentacao: ["dieta", "alimento"], comida: ["alimento", "cardapio"], comer: ["comer", "cardapio"],
  esteira: ["caminhada", "esteira"], andar: ["caminhada"], bike: ["bicicleta"], pedalar: ["bicicleta"], nadar: ["natacao"], lutar: ["luta"],
  suplemento: ["suplementacao", "suplemento"], suplementos: ["suplementacao"], scoop: ["whey"], dose: ["dose", "suplementacao"],
  carga: ["1rm", "carga"], barra: ["1rm", "barra"], anilha: ["anilhas"], forca: ["1rm", "forca"],
  treino: ["treino", "divisao"], treinar: ["treino"], ficha: ["divisao"], montar: ["montar", "divisao"], dividir: ["divisao"],
  academia: ["academia"], comecar: ["comecar", "diagnostico"], iniciante: ["iniciante", "comecar"],
  remedio: ["mounjaro", "remedio"], caneta: ["mounjaro"], tabela: ["tabela"], alimento: ["alimento", "alimentos"],
};

/** Sem acento, minúsculas, sem pontuação. Exportada para o teste. */
export function normaliza(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** As palavras que contam: sem as vazias, sem repetição. */
export function palavras(s: string): string[] {
  const out: string[] = [];
  for (const t of normaliza(s).split(" ")) {
    if (!t || VAZIAS.has(t)) continue;
    if (!out.includes(t)) out.push(t);
  }
  return out;
}

/** Uma palavra da consulta casa com uma do documento por prefixo (≥ 4 letras) ou igualdade. */
function casa(consulta: string, doc: string): boolean {
  if (consulta === doc) return true;
  if (consulta.length >= 4 && doc.startsWith(consulta)) return true;
  if (doc.length >= 4 && consulta.startsWith(doc) && consulta.length - doc.length <= 2) return true;
  return false;
}

interface Doc {
  f: FerramentaCatalogo;
  nome: string[];
  tags: string[];
  resultado: string[];
  categoria: string[];
}

let indice: Doc[] | null = null;

function montaIndice(): Doc[] {
  if (indice) return indice;
  indice = FERRAMENTAS_NO_AR.map((f) => {
    const cat = CATEGORIAS.find((c) => c.id === f.categoria);
    return {
      f,
      nome: palavras(f.nome),
      tags: palavras(f.tags.join(" ")),
      resultado: palavras(f.resultado),
      categoria: cat ? palavras(`${cat.nome} ${cat.chip}`) : [],
    };
  });
  return indice;
}

/**
 * Pontos de uma palavra da consulta contra um documento; 0 quando não casa.
 * Os campos SOMAM: a palavra que aparece no nome E nas tags E na frase de
 * resultado é mais central àquela ferramenta do que a que aparece só numa
 * tag. Sinônimo vale um ponto a menos que a palavra literal.
 */
function pontua(palavra: string, d: Doc): number {
  const formas = [palavra, ...(SINONIMOS[palavra] ?? [])];
  let nome = 0, tags = 0, resultado = 0, categoria = 0;
  for (const p of formas) {
    const desconto = p === palavra ? 0 : 1;
    if (d.nome.some((t) => casa(p, t))) nome = Math.max(nome, 5 - desconto);
    if (d.tags.some((t) => casa(p, t))) tags = Math.max(tags, 4 - desconto);
    if (d.resultado.some((t) => casa(p, t))) resultado = Math.max(resultado, 2 - desconto);
    if (d.categoria.some((t) => casa(p, t))) categoria = 1;
  }
  return nome + tags + resultado + categoria;
}

/**
 * Empate se resolve pelo uso: entre duas ferramentas igualmente relevantes
 * para "calorias", a que mais gente abre vem primeiro. O peso é pequeno de
 * propósito — desempata, não sobrepõe relevância.
 */
const BONUS_MAIS_USADA = 3;

export interface ResultadoBusca {
  /** A consulta depois de limpa; vazia quando não há o que buscar. */
  consulta: string;
  /** As palavras que a busca usou. */
  termos: string[];
  /** O que casou com TODAS as palavras, do mais relevante ao menos. */
  resultados: FerramentaCatalogo[];
  /**
   * Quando `resultados` está vazio: o que casou com ALGUMA palavra ou, sem
   * nada, as mais usadas. Nunca vazio — a página não mostra tela em branco.
   */
  relacionadas: FerramentaCatalogo[];
}

export function buscaFerramentas(texto: string, limite = 12): ResultadoBusca {
  const termos = palavras(texto);
  const consulta = normaliza(texto);
  if (consulta.length < TAMANHO_MINIMO || termos.length === 0) {
    return { consulta, termos: [], resultados: [], relacionadas: [] };
  }
  const docs = montaIndice();
  const estritos: { f: FerramentaCatalogo; pontos: number }[] = [];
  const parciais: { f: FerramentaCatalogo; pontos: number }[] = [];
  for (const d of docs) {
    let total = 0;
    let casaram = 0;
    for (const t of termos) {
      const p = pontua(t, d);
      if (p > 0) casaram++;
      total += p;
    }
    if (casaram === 0) continue;
    if (MAIS_USADAS.includes(d.f.id)) total += BONUS_MAIS_USADA;
    (casaram === termos.length ? estritos : parciais).push({ f: d.f, pontos: total });
  }
  const ordena = (a: { pontos: number }, b: { pontos: number }) => b.pontos - a.pontos;
  const resultados = estritos.sort(ordena).slice(0, limite).map((x) => x.f);
  let relacionadas: FerramentaCatalogo[] = [];
  if (resultados.length === 0) {
    relacionadas = parciais.sort(ordena).slice(0, 4).map((x) => x.f);
    if (relacionadas.length === 0) relacionadas = MAIS_USADAS.map(porId).filter((f): f is FerramentaCatalogo => f !== null).slice(0, 4);
  }
  return { consulta, termos, resultados, relacionadas };
}
