/**
 * IndexNow: avisa o Bing (e quem mais usa o protocolo) que uma página mudou.
 *
 * A busca do ChatGPT se apoia muito no índice do Bing, e o Bing só via as
 * mudanças quando passava de novo pelo site. Com o aviso, ele recrawla em
 * horas. O protocolo pede só a chave publicada num .txt na raiz do site —
 * ela não é segredo, é a prova de que o aviso vem do dono do domínio.
 *
 * Só avisamos páginas que mudaram de verdade (texto de artigo, página de
 * ferramenta ou de serviço). Mudança de componente que renderiza em
 * centenas de páginas não vira aviso: o Bing pede para não reenviar URL
 * sem mudança.
 */

export const INDEXNOW_KEY = "7700852e16329e48be5405c2b546020d";
export const INDEXNOW_HOST = "www.montinhopersonal.com.br";
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

/** Linhas do arquivo novo tocadas por um `git diff -U0` (cabeçalhos @@ -a,b +c,d @@). */
export function linhasNovasDoDiff(diff: string): number[] {
  const linhas: number[] = [];
  for (const m of diff.matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
    const inicio = Number(m[1]);
    const qtd = m[2] === undefined ? 1 : Number(m[2]);
    // Hunk só de remoção (+c,0): a mudança fica "entre" linhas; conta a linha c.
    if (qtd === 0) linhas.push(Math.max(inicio, 1));
    for (let i = 0; i < qtd; i++) linhas.push(inicio + i);
  }
  return linhas;
}

/**
 * Para cada linha mudada, o `slug: "..."` mais próximo acima dela — é o
 * artigo que contém aquela linha. Linhas antes do primeiro slug não contam.
 */
export function slugsDasLinhas(conteudo: string, linhas: number[]): string[] {
  const texto = conteudo.split("\n");
  const slugEm: (string | null)[] = [];
  let atual: string | null = null;
  for (const l of texto) {
    const m = l.match(/^\s*slug:\s*"([^"]+)"/);
    if (m) atual = m[1];
    slugEm.push(atual);
  }
  const out = new Set<string>();
  for (const n of linhas) {
    const s = slugEm[n - 1];
    if (s) out.add(s);
  }
  return [...out];
}

/** app/x/y/page.tsx → /x/y. Rotas dinâmicas ([slug]) e grupos (x) não viram URL. */
export function rotaDaPagina(arquivo: string): string | null {
  const m = arquivo.match(/^app\/(.*?)\/?page\.tsx$/);
  if (!m) return null;
  const partes = m[1].split("/").filter(Boolean).filter((p) => !/^\(.*\)$/.test(p));
  if (partes.some((p) => p.includes("["))) return null;
  return "/" + partes.join("/");
}

/** Normaliza para comparar com o sitemap: sem barra final, exceto a raiz. */
export function normaliza(url: string): string {
  return url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
}
