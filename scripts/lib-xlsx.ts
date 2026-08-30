/**
 * Leitor mínimo de .xlsx, sem dependência nova.
 *
 * Um .xlsx é um ZIP de XML. O Node já traz o `zlib` que descomprime, e o
 * formato do ZIP é simples o bastante para ler aqui: cabeçalho local, nome,
 * dados deflacionados. São ~60 linhas contra uma biblioteca de alguns MB que
 * entraria no repositório para ser usada por um único script de importação.
 *
 * Este arquivo NÃO entra no bundle do site — vive em scripts/, roda uma vez
 * por importação e produz um .ts gerado.
 */

import { inflateRawSync } from "node:zlib";
import { readFileSync } from "node:fs";

/** Descompacta o .xlsx e devolve os arquivos internos como texto. */
export function leZip(caminho: string): Map<string, string> {
  const buf = readFileSync(caminho);
  const saida = new Map<string, string>();

  let i = 0;
  while (i < buf.length - 4) {
    /* Assinatura de cabeçalho local de arquivo: PK\x03\x04 */
    if (buf.readUInt32LE(i) !== 0x04034b50) break;

    const metodo = buf.readUInt16LE(i + 8);
    const flags = buf.readUInt16LE(i + 6);
    let comprimido = buf.readUInt32LE(i + 18);
    let descomprimido = buf.readUInt32LE(i + 22);
    const tamNome = buf.readUInt16LE(i + 26);
    const tamExtra = buf.readUInt16LE(i + 28);
    const nome = buf.subarray(i + 30, i + 30 + tamNome).toString("utf8");
    const inicioDados = i + 30 + tamNome + tamExtra;

    /**
     * Bit 3 dos flags: os tamanhos vieram DEPOIS dos dados, num descritor.
     * Nesse caso o cabeçalho traz zeros e é preciso procurar o próximo
     * cabeçalho para saber onde este arquivo termina.
     */
    if (flags & 0x08 && comprimido === 0) {
      let j = inicioDados;
      while (j < buf.length - 4) {
        const sig = buf.readUInt32LE(j);
        if (sig === 0x08074b50 || sig === 0x04034b50 || sig === 0x02014b50) break;
        j++;
      }
      comprimido = j - inicioDados;
      descomprimido = 0;
    }

    const dados = buf.subarray(inicioDados, inicioDados + comprimido);
    try {
      const conteudo = metodo === 0 ? dados : inflateRawSync(dados);
      saida.set(nome, conteudo.toString("utf8"));
    } catch {
      /* Entrada ilegível (diretório, binário de impressora): não interessa. */
    }

    i = inicioDados + comprimido;
    if (flags & 0x08) {
      /* Pula o descritor de dados, quando presente. */
      if (buf.readUInt32LE(i) === 0x08074b50) i += 16;
      else i += 12;
    }
    if (descomprimido === 0 && comprimido === 0) break;
  }
  return saida;
}

function desescapa(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, "&");
}

/** A tabela de textos compartilhados — onde o Excel guarda toda string. */
export function leTextos(sharedStrings: string): string[] {
  return (sharedStrings.match(/<si>[\s\S]*?<\/si>/g) ?? []).map((si) =>
    desescapa((si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) ?? [])
      .map((t) => t.replace(/<[^>]+>/g, ""))
      .join("")),
  );
}

export interface Celula {
  /** O texto bruto da célula, já resolvido contra a tabela de textos. */
  texto: string;
  /** true quando o Excel guardou como número, não como string. */
  numerico: boolean;
}

export type Linha = Map<string, Celula>;

/** Lê uma planilha como linhas indexadas pelo número da linha do arquivo. */
export function leePlanilha(xml: string, textos: string[]): Map<number, Linha> {
  const linhas = new Map<number, Linha>();
  for (const bruta of xml.match(/<row[^>]*>[\s\S]*?<\/row>/g) ?? []) {
    const num = Number(bruta.match(/<row[^>]*\br="(\d+)"/)?.[1] ?? 0);
    if (!num) continue;
    const celulas: Linha = new Map();
    /**
     * O `[^>]*?` precisa ser preguiçoso, e a razão é sutil o bastante para
     * ter corrompido dados antes de ser notada.
     *
     * Com `[^>]*` guloso, numa célula vazia `<c r="K293" s="29"/>` o motor
     * consome o `/` junto, tenta `\/>`, falha — e então a SEGUNDA alternativa
     * (`>` seguido de qualquer coisa até `</c>`) casa a partir do `>` final,
     * varrendo as células seguintes até achar o primeiro `</c>` de verdade.
     * O resultado é uma célula vazia herdando o valor de outra três colunas
     * adiante. Como o motor teve sucesso, ele nunca volta atrás.
     *
     * Na prática isso fez o sódio do sal dietético (23.431 mg) ser lido como
     * manganês, e o número do alimento virar teor de cinzas. Números
     * plausíveis, na coluna errada — o pior tipo de erro numa tabela
     * nutricional, porque nada parece quebrado.
     */
    for (const c of bruta.match(/<c\b[^>]*?(?:\/>|>[\s\S]*?<\/c>)/g) ?? []) {
      const ref = c.match(/\br="([A-Z]+)\d+"/)?.[1];
      if (!ref) continue;
      /* Cinto e suspensório: uma célula jamais pode conter outra. */
      if (c.indexOf("<c ", 1) !== -1) {
        throw new Error(`Célula ${ref}${num} absorveu a seguinte — o recorte de células está errado.`);
      }
      const tipo = c.match(/\bt="([^"]+)"/)?.[1];
      const v = c.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      /* t="inlineStr": o texto vem dentro da própria célula. */
      const inline = c.match(/<is>[\s\S]*?<t[^>]*>([\s\S]*?)<\/t>/)?.[1];

      let texto: string;
      let numerico = false;
      if (inline !== undefined) texto = desescapa(inline);
      else if (v === undefined) continue;
      else if (tipo === "s") texto = textos[Number(v)] ?? "";
      else if (tipo === "str" || tipo === "e") texto = desescapa(v);
      else { texto = v; numerico = true; }

      celulas.set(ref, { texto: texto.trim(), numerico });
    }
    linhas.set(num, celulas);
  }
  return linhas;
}
