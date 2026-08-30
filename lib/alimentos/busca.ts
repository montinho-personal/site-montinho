/**
 * A busca de alimentos.
 *
 * O trabalho aqui não é ranquear texto — é entender como o brasileiro digita
 * comida. "feijao", "FEIJÃO", "feijão-preto", "ovos", "batata doce",
 * "peito de frango". Todas essas precisam chegar no mesmo lugar.
 *
 * A regra que manda em tudo: NUNCA inventar alimento. A tolerância a erro de
 * digitação é deliberadamente curta e só age em palavra de tamanho decente,
 * porque o custo dos dois erros é assimétrico. Não achar "frnago" faz a
 * pessoa digitar de novo; devolver "farinha" para quem procurou "frango" faz
 * ela levar embora o número errado achando que é o certo.
 */

import { fold } from "@/lib/search";
import type { Alimento, Categoria } from "./tipos";

export interface ResultadoBusca {
  alimento: Alimento;
  score: number;
  /** Por que casou — usado nos testes, e para depurar busca ruim. */
  motivo: "exato" | "prefixo" | "contem" | "alias" | "aproximado";
}

/**
 * Plural do português, no recorte que importa para comida.
 *
 * Não é um stemmer: é uma lista curta de terminações que cobre "ovos",
 * "bananas", "feijões", "pães". Um stemmer de verdade erraria mais do que
 * acerta num vocabulário deste tamanho — "arroz" viraria "arro".
 */
function singular(p: string): string {
  if (p.length <= 3) return p;
  if (p.endsWith("oes")) return p.slice(0, -3) + "ao";
  if (p.endsWith("aes")) return p.slice(0, -3) + "ao";
  if (p.endsWith("ais")) return p.slice(0, -3) + "al";
  if (p.endsWith("eis")) return p.slice(0, -3) + "el";
  if (p.endsWith("ns")) return p.slice(0, -2) + "m";
  if (p.endsWith("es") && p.length > 4) return p.slice(0, -2);
  if (p.endsWith("s")) return p.slice(0, -1);
  return p;
}

/**
 * A forma canônica de comparação: sem acento, minúscula, sem hífen, no
 * singular, com espaços colapsados.
 *
 * O hífen vira espaço porque "batata-doce" e "batata doce" são a mesma
 * comida escrita de dois jeitos igualmente corretos — e porque essa exata
 * diferença já escondeu artigo do acervo numa varredura anterior.
 */
export function normaliza(s: string): string {
  return fold(s)
    .replace(/[-_/]/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map(singular)
    .join(" ");
}

/**
 * Distância de edição com transposição (Damerau, alinhamento ótimo).
 *
 * A transposição não é refinamento acadêmico — é o erro de digitação real.
 * "frnago" por "frango" é um par de letras trocadas, e a distância de
 * Levenshtein comum cobra 2 por isso, o mesmo que duas letras erradas de
 * verdade. Com tolerância 1, "frnago" não achava nada: a busca ficava burra
 * justamente no engano mais comum de quem digita rápido no celular.
 *
 * O corte por `max` não é otimização: é a regra de produto. Assim que a
 * distância passa do limite, a função desiste — o que garante que nenhum
 * resultado distante entre por acidente, mesmo que alguém afrouxe a
 * tolerância depois.
 */
function distancia(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  /* Três linhas: a anterior da anterior é o que enxerga a transposição. */
  let doisAtras: number[] = [];
  let anterior = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const atual = [i];
    let melhorLinha = i;
    for (let j = 1; j <= b.length; j++) {
      const custo = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(atual[j - 1] + 1, anterior[j] + 1, anterior[j - 1] + custo);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, doisAtras[j - 2] + 1);
      }
      atual.push(v);
      if (v < melhorLinha) melhorLinha = v;
    }
    if (melhorLinha > max) return max + 1;
    doisAtras = anterior;
    anterior = atual;
  }
  return anterior[b.length];
}

/**
 * Quantos erros de digitação tolerar, pelo tamanho da palavra.
 *
 * Palavra curta não ganha tolerância nenhuma: com 1 erro permitido, "ovo"
 * alcançaria "uva", "avo" e "oco". É exatamente o caso em que aproximar
 * devolve a comida errada.
 */
function toleranciaPara(palavra: string): number {
  if (palavra.length <= 4) return 0;
  if (palavra.length <= 7) return 1;
  return 2;
}

interface Entrada {
  alimento: Alimento;
  nome: string;
  termos: string[];
}

/**
 * O índice.
 *
 * Construído uma vez por processo. Cada alimento entra com o nome
 * normalizado mais todos os aliases, também normalizados — é a lista de
 * termos que a consulta vai encontrar. O `Set` remove a duplicata natural
 * entre nome e alias sem que a base precise se preocupar com isso.
 */
export function montaIndice(alimentos: Alimento[]): Entrada[] {
  return alimentos.map((a) => ({
    alimento: a,
    nome: normaliza(a.nome),
    termos: [...new Set([normaliza(a.nome), ...a.aliases.map(normaliza)])].filter(Boolean),
  }));
}

/**
 * A pontuação de um alimento para uma consulta.
 *
 * A ordem das faixas é a ordem da confiança, e os intervalos não se
 * encostam: nada aproximado consegue passar à frente de qualquer coisa
 * exata, por mais palavras que case. É o que faz "feijão" trazer "Feijão
 * carioca, cozido" antes de "Farofa de feijão".
 */
function pontua(e: Entrada, consulta: string): { score: number; motivo: ResultadoBusca["motivo"] } | null {
  const q = consulta;

  if (e.termos.includes(q)) return { score: 1000, motivo: "exato" };
  if (e.nome.startsWith(q)) return { score: 800 - e.nome.length, motivo: "prefixo" };
  if (e.termos.some((t) => t.startsWith(q))) return { score: 700 - e.nome.length, motivo: "alias" };

  /**
   * Todas as palavras da consulta aparecem em algum termo. É o que faz
   * "frango grelhado" achar "Peito de frango, grelhado" — as duas palavras
   * estão lá, na ordem que for.
   */
  const palavras = q.split(" ").filter(Boolean);
  const alvo = e.termos.join(" ");
  if (palavras.length > 0 && palavras.every((p) => alvo.includes(p))) {
    return { score: 500 - e.nome.length, motivo: "contem" };
  }

  /**
   * Última chance: erro de digitação. Só vale para a consulta inteira contra
   * uma palavra do alimento, e dentro da tolerância do tamanho.
   */
  if (!q.includes(" ")) {
    const tol = toleranciaPara(q);
    if (tol > 0) {
      /**
       * Casar contra um termo INTEIRO vale mais que casar contra uma palavra
       * solta dentro do nome. Um alias é curadoria — alguém escreveu que a
       * comida se chama assim; uma palavra no meio do nome é acidente da
       * frase.
       *
       * Sem essa diferença, "feijaoo" caía no feijão preto: as duas fichas
       * têm a palavra "feijao" no nome, e o desempate acabava sendo o
       * comprimento da frase. Com ela, o erro de digitação aterrissa na mesma
       * comida que a grafia certa — que é o mínimo que se espera de uma
       * correção.
       */
      let melhor: { score: number } | null = null;
      for (const termo of e.termos) {
        const candidatos: [string, number][] = [[termo, 0]];
        for (const palavra of termo.split(" ")) if (palavra !== termo) candidatos.push([palavra, 60]);
        for (const [alvoTexto, penalidade] of candidatos) {
          if (Math.abs(alvoTexto.length - q.length) > tol) continue;
          const d = distancia(q, alvoTexto, tol);
          if (d > tol) continue;
          const score = 300 - d * 50 - penalidade - e.nome.length;
          if (!melhor || score > melhor.score) melhor = { score };
        }
      }
      if (melhor) return { score: melhor.score, motivo: "aproximado" };
    }
  }
  return null;
}

export interface OpcoesBusca {
  limite?: number;
  categoria?: Categoria;
}

/**
 * Busca. Devolve lista vazia quando não há correspondência confiável — e é a
 * lista vazia que faz a tela dizer "não encontramos esse alimento na base
 * ainda" em vez de mostrar o parecido mais próximo.
 */
export function buscaAlimentos(
  indice: Entrada[],
  consulta: string,
  opcoes: OpcoesBusca = {},
): ResultadoBusca[] {
  const q = normaliza(consulta);
  if (q.length < 2) return [];

  const achados: ResultadoBusca[] = [];
  for (const e of indice) {
    if (opcoes.categoria && e.alimento.categoria !== opcoes.categoria) continue;
    const p = pontua(e, q);
    if (p) achados.push({ alimento: e.alimento, score: p.score, motivo: p.motivo });
  }

  achados.sort((a, b) => b.score - a.score || a.alimento.nome.localeCompare(b.alimento.nome, "pt-BR"));
  return achados.slice(0, opcoes.limite ?? 12);
}
