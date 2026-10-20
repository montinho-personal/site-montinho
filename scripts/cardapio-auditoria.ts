/**
 * Auditoria dos números do Monte seu Cardápio (relatório, não teste).
 *   npx tsx scripts/cardapio-auditoria.ts
 * 1. cada alimento contra a TACO; 2. soma das partes e metas em 1.152 pedidos;
 * 3. quanto as trocas mudam o item; 4. arredondamento da tela. Rodada em 21/10/2026.
 */
import { readFileSync } from "fs";
import { ALIMENTOS_CARDAPIO, nutrientes, ALIMENTO_CARDAPIO_POR_ID } from "../lib/cardapio/alimentos";
import * as M from "../lib/cardapio/motor";
const taco = JSON.parse(readFileSync("data/alimentos/processado/taco.json", "utf8")).alimentos as any[];
const T = new Map(taco.map((r) => [r.id, r]));
const v = (r: any, id: string) => r.nutrientes.find((n: any) => n.nutrienteId === id)?.valorPor100g ?? null;
console.log("== 1. Cardápio x TACO (por 100 g)");
let div = 0;
for (const a of ALIMENTOS_CARDAPIO) {
  const ref = a.taco ?? (a.id === "leite-integral" ? "leite-de-vaca-integral" : a.id === "ovo-mexido" ? "ovo-de-galinha-inteiro-frito" : null);
  if (!ref) { console.log(`  sem TACO   ${a.id.padEnd(20)} fonte: ${a.fonte.slice(0, 50)}`); continue; }
  const r = T.get(ref); if (!r) { console.log(`  REF FALTA  ${a.id} -> ${ref}`); continue; }
  const t = { kcal: v(r, "energia"), prot: v(r, "proteina"), carb: v(r, "carboidrato"), gord: v(r, "lipideos") };
  const c = { kcal: a.kcal100, prot: a.prot100, carb: a.carb100, gord: a.gord100 };
  const difs = (["kcal", "prot", "carb", "gord"] as const).map((k) => {
    const tv = t[k] ?? 0; const d = c[k] - tv;
    const bad = Math.abs(d) > Math.max(0.6, Math.abs(tv) * 0.03);
    if (bad) div++;
    return `${k} ${c[k]}/${tv?.toFixed(1)}${bad ? "!" : ""}`;
  });
  console.log(`  ${a.taco ? "ligado    " : "comparado "} ${a.id.padEnd(20)} ${difs.join("  ")}`);
}
console.log(`  divergências: ${div}`);

console.log("\n== 2. Conta: soma das partes");
let erroSoma = 0;
const pedidos: M.PedidoCardapio[] = [];
const objs = M.OBJETIVOS.map((o) => o.id); const dietas = ["onivoro", "vegetariano", "vegano"] as const;
for (const kcal of [1200, 1500, 1800, 2200, 2600, 3000, 3500, 4000]) for (const peso of [50, 70, 90, 120]) for (const ob of objs) for (const d of dietas) for (const ref of [3, 4, 5]) {
  if (!M.PERFIS_REFEICAO[ref]) continue;
  pedidos.push({ metaKcal: kcal, pesoKg: peso, objetivo: ob, refeicoes: ref, dieta: d, restricoes: [], habituais: {} });
}
let fora = { kcal: 0, prot: 0, carb: 0, gord: 0 }, total = 0, nivel: Record<string, number> = {};
const maxErr = { kcal: 0, prot: 0, carb: 0, gord: 0 };
for (const p of pedidos) {
  let c: M.CardapioDia; try { c = M.geraCardapio(p); } catch { continue; }
  total++;
  const t = M.totalDia(c);
  // soma manual item a item
  let k = 0, pr = 0, cb = 0, g = 0;
  for (const r of c.refeicoes) for (const it of r.itens) { const n = nutrientes(ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId)!, it.porcoes); k += n.kcal; pr += n.prot; cb += n.carb; g += n.gord; }
  if (Math.abs(k - t.kcal) > 1e-6 || Math.abs(pr - t.prot) > 1e-6) erroSoma++;
  const e = { kcal: (t.kcal - c.metaKcal) / c.metaKcal, prot: (t.prot - c.metaProt) / c.metaProt, carb: c.metaCarb ? (t.carb - c.metaCarb) / c.metaCarb : 0, gord: (t.gord - c.metaGord) / c.metaGord };
  for (const kk of ["kcal", "prot", "carb", "gord"] as const) maxErr[kk] = Math.max(maxErr[kk], Math.abs(e[kk]));
  const val = M.validaCardapio(c); nivel[val.nivel] = (nivel[val.nivel] ?? 0) + 1;
  if (Math.abs(e.kcal) > M.TOLERANCIA_KCAL) fora.kcal++;
  if (t.prot < c.metaProt * M.PISO_PROTEINA) fora.prot++;
  // meta de kcal pedida x meta usada
  if (c.metaKcal !== p.metaKcal) fora.carb++;
  // macros da meta fecham as kcal?
  const kcalMacros = c.metaProt * 4 + c.metaCarb * 4 + c.metaGord * 9;
  if (Math.abs(kcalMacros - c.metaKcal) / c.metaKcal > 0.03) fora.gord++;
}
console.log(`  cardápios gerados: ${total} | soma != total: ${erroSoma}`);
console.log(`  fora da tolerância de kcal (±${M.TOLERANCIA_KCAL * 100}%): ${fora.kcal} | proteína abaixo do piso: ${fora.prot} | meta usada != pedida: ${fora.carb} | metas de macro que não fecham as kcal (>3%): ${fora.gord}`);
console.log(`  maior erro: kcal ${(maxErr.kcal * 100).toFixed(1)}% prot ${(maxErr.prot * 100).toFixed(1)}% carb ${(maxErr.carb * 100).toFixed(1)}% gord ${(maxErr.gord * 100).toFixed(1)}%`);
console.log(`  níveis: ${JSON.stringify(nivel)}`);

console.log("\n== 3. Trocas: quanto muda o dia");
let n = 0, maxD = 0, soma = 0, protCai = 0;
for (const p of pedidos.slice(0, 300)) {
  const c = M.geraCardapio(p);
  c.refeicoes.forEach((r) => r.itens.forEach((it) => {
    const sai = nutrientes(ALIMENTO_CARDAPIO_POR_ID.get(it.alimentoId)!, it.porcoes);
    for (const { alimento, porcoes } of M.alternativas(it, r.momento, p, r.itens.map((x) => x.alimentoId))) {
      const entra = nutrientes(alimento, porcoes); const d = Math.abs(entra.kcal - sai.kcal) / sai.kcal;
      n++; soma += d; maxD = Math.max(maxD, d); if (sai.prot >= 10 && entra.prot < sai.prot * 0.6) protCai++;
    }
  }));
}
console.log(`  trocas oferecidas: ${n} | diferença média de kcal do item: ${(soma / n * 100).toFixed(1)}% | maior: ${(maxD * 100).toFixed(1)}% | perda de proteína > 40% em fonte proteica: ${protCai}`);

console.log("\n== 4. Arredondamento na tela");
let dif = 0, maxR = 0;
for (const p of pedidos) { const c = M.geraCardapio(p); const somaRef = c.refeicoes.reduce((s, r) => s + Math.round(M.totalRefeicao(r).kcal), 0); const d = Math.abs(somaRef - Math.round(M.totalDia(c).kcal)); if (d) dif++; maxR = Math.max(maxR, d); }
console.log(`  cardápios em que a soma das refeições arredondadas difere do total: ${dif}/${total} (maior diferença ${maxR} kcal)`);
