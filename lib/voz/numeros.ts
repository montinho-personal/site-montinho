/**
 * Número falado em português → número. O reconhecimento do navegador às
 * vezes devolve dígitos ("85", "1,72"), às vezes palavras ("oitenta e
 * cinco", "um e setenta e dois", "um metro e setenta"). Aceita os dois.
 */
const UNID: Record<string, number> = {
  zero: 0, um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5, seis: 6, sete: 7, oito: 8, nove: 9,
  dez: 10, onze: 11, doze: 12, treze: 13, catorze: 14, quatorze: 14, quinze: 15, dezesseis: 16, dezessete: 17,
  dezoito: 18, dezenove: 19, vinte: 20, trinta: 30, quarenta: 40, cinquenta: 50, sessenta: 60, setenta: 70,
  oitenta: 80, noventa: 90, cem: 100, cento: 100, duzentos: 200, duzentas: 200, trezentos: 300,
};

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Soma uma sequência de palavras-número ("oitenta e cinco" → 85). null se não houver nenhuma. */
function somaPalavras(ps: string[]): number | null {
  let total = 0, achou = false;
  for (const p of ps) {
    if (p === "e") continue;
    if (p in UNID) { total += UNID[p]; achou = true; }
  }
  return achou ? total : null;
}

/**
 * Converte a fala em número. "e meio" soma 0,5. Para altura, "um e setenta
 * e dois" / "um metro e setenta" vira 1,72 / 1,70 (quem decide metros ou
 * centímetros é a normalização da ferramenta).
 */
export function falaParaNumero(fala: string): number | null {
  const t = norm(fala).replace(/(\d),(\d)/g, "$1.$2");
  const dig = t.match(/\d+(\.\d+)?/g);
  if (dig?.length === 1) return Number(dig[0]);
  if (dig && dig.length >= 2 && Number(dig[0]) < 3) return Number(`${dig[0]}.${dig[1].padStart(2, "0")}`); // "1 e 72"
  if (dig?.length) return Number(dig[0]);
  const ps = t.replace(/[^a-z ]/g, " ").split(/\s+/).filter(Boolean);
  const meio = ps.includes("meio") ? 0.5 : 0;
  // "um (metro) e setenta e dois": primeira palavra 1–2 seguida de dezenas → metros
  const iMetro = ps.findIndex((p) => p === "metro" || p === "metros");
  if (iMetro > 0) {
    const m = somaPalavras(ps.slice(0, iMetro)); const cm = somaPalavras(ps.slice(iMetro + 1));
    if (m !== null) return m + (cm ?? 0) / 100;
  }
  if ((ps[0] === "um" || ps[0] === "dois") && ps[1] === "e" && ps.length > 2) {
    const resto = somaPalavras(ps.slice(2));
    if (resto !== null && resto >= 10) return UNID[ps[0]] + resto / 100;
  }
  const n = somaPalavras(ps);
  return n === null ? null : n + meio;
}

/** Escolhe a opção cuja palavra-chave aparece na fala. */
export function falaParaOpcao<T extends string>(fala: string, opcoes: { id: T; chaves: string[] }[]): T | null {
  const t = ` ${norm(fala)} `;
  for (const o of opcoes) if (o.chaves.some((c) => t.includes(norm(c)))) return o.id;
  // número da opção ("a dois", "opção 3")
  const n = falaParaNumero(fala);
  if (n && Number.isInteger(n) && n >= 1 && n <= opcoes.length) return opcoes[n - 1].id;
  return null;
}
