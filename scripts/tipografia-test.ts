/**
 * Testes de consistência tipográfica.
 *
 * Nasceu de uma observação de uso: "em alguns lugares do site o espaçamento
 * entre um parágrafo e outro está diferente". Estava mesmo — 69 pares de
 * parágrafos de prosa usavam seis valores de margem diferentes, porque as
 * páginas foram escritas em momentos distintos.
 *
 * A regra que este arquivo protege é simples e única: PROSA SEGUIDA DE PROSA
 * usa sempre mb-3. Espaçamentos maiores separam BLOCOS de ideia, e nesse
 * caso vêm do container (margin-top ou space-y), não de uma margem pendurada
 * num parágrafo — foi exatamente essa gambiarra que quebrou o ritmo.
 *
 * Pares rótulo/valor (sem leading-relaxed) ficam de fora de propósito: ali o
 * espaçamento justo é o correto.
 */

import * as fs from "fs";
import * as path from "path";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};

/** Prosa = parágrafo de corpo de texto; leading-relaxed é a assinatura. */
const ehProsa = (classe: string) => /leading-relaxed/.test(classe);

interface Par { arquivo: string; linha: number; mb: number }

function paresDeProsa(dir: string, achados: Par[] = []): Par[] {
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entrada.name);
    if (entrada.isDirectory()) {
      if (!/node_modules|\.next/.test(p)) paresDeProsa(p, achados);
      continue;
    }
    if (!p.endsWith(".tsx")) continue;
    const linhas = fs.readFileSync(p, "utf8").split("\n");
    for (let i = 0; i < linhas.length; i++) {
      const m = linhas[i].match(/<p className="([^"]*)"/);
      if (!m || !ehProsa(m[1])) continue;
      const mb = m[1].match(/\bmb-(\d+)\b/)?.[1];
      if (mb === undefined) continue;
      let j = i;
      while (j < linhas.length && !linhas[j].includes("</p>")) j++;
      /**
       * Procurar o PRÓXIMO ELEMENTO, não a próxima linha: comentários e
       * linhas em branco entre dois parágrafos não desfazem a adjacência
       * visual — e ignorar isso era um ponto cego que escondia casos reais.
       */
      let k = j + 1;
      while (k < linhas.length) {
        const t = (linhas[k] ?? "").trim();
        if (t === "" || t.startsWith("{/*") || t.startsWith("*") || t.startsWith("//") || t.endsWith("*/}")) { k++; continue; }
        break;
      }
      const seguinte = (linhas[k] ?? "").trim();
      if (!/^<p[ >]/.test(seguinte)) continue;
      const mSeg = seguinte.match(/<p className="([^"]*)"/);
      if (mSeg && !ehProsa(mSeg[1])) continue;
      achados.push({ arquivo: p, linha: i + 1, mb: Number(mb) });
    }
  }
  return achados;
}

console.log("\n" + "=".repeat(64) + "\nESPAÇAMENTO ENTRE PARÁGRAFOS\n" + "=".repeat(64));

const pares = [...paresDeProsa("app"), ...paresDeProsa("components")];
ok(`existem pares de prosa para verificar (${pares.length})`, pares.length >= 40, "se caiu muito, o detector quebrou");

const fora = pares.filter((p) => p.mb !== 3);
ok(
  "todo parágrafo de prosa seguido de outro usa mb-3",
  fora.length === 0,
  fora.map((p) => `${p.arquivo}:${p.linha} usa mb-${p.mb}`).join("\n           ")
);

console.log("\n" + "=".repeat(64) + (falhas === 0 ? "\nTODOS OS TESTES PASSARAM" : `\n${falhas} TESTE(S) FALHARAM`));
if (falhas > 0) process.exit(1);
