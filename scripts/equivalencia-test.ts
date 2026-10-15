/**
 * Testes do motor de equivalência (Troca Certa).
 *   npx tsx scripts/equivalencia-test.ts
 *
 * Roda contra a base REAL (TACO no build), não contra números inventados:
 * se a base mudar e uma troca deixar de fazer sentido, é aqui que aparece.
 */

import { baseEq } from "../lib/alimentos/equivalencia-base";
import {
  APELIDOS,
  GRUPOS,
  MEMBROS,
  NOME_EXIBICAO,
  REFERENCIAS,
  arredondaGramas,
  estadoDe,
  gramasEquivalentes,
  macrosDe,
  medidaCaseira,
  trocaDireta,
  trocas,
  type Criterio,
} from "../lib/alimentos/equivalencia";

let falhas = 0;
function ok(nome: string, cond: boolean, extra = "") {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome} ${extra}`);
  if (!cond) falhas++;
}
const secao = (t: string) => console.log(`\n${"=".repeat(64)}\n${t}\n${"=".repeat(64)}`);

const B = baseEq();
const A = (s: string) => B.get(s)!;

secao("1. A LISTA CURADA EXISTE NA BASE E TEM DADO");
for (const m of MEMBROS) {
  const a = B.get(m.slug);
  ok(`${m.slug} existe`, !!a);
  if (!a) continue;
  const c = GRUPOS[m.grupo].criterioPadrao;
  ok(`${m.slug} tem ${c} analisado`, a[c] !== null && a[c]! > 0);
}
ok("todo membro tem nome de exibição", MEMBROS.every((m) => NOME_EXIBICAO[m.slug]), MEMBROS.filter((m) => !NOME_EXIBICAO[m.slug]).map((m) => m.slug).join(","));
ok("todo apelido aponta para alimento da base", Object.keys(APELIDOS).every((s) => B.has(s)));
ok("nenhum slug repetido", new Set(MEMBROS.map((m) => m.slug)).size === MEMBROS.length);

secao("2. A CONTA");
ok("regra de três: 30 g de alvo com 15 g/100 g = 200 g", gramasEquivalentes(30, 15) === 200);
ok("abaixo de 10 g arredonda a meio grama", arredondaGramas(7.4) === 7.5);
ok("entre 10 e 50 g arredonda ao grama", arredondaGramas(37.4) === 37);
ok("arredonda 20–100 g a 5 g", arredondaGramas(177.84 / 2) === 90);
ok("arredonda acima de 100 g a 10 g", arredondaGramas(177.84) === 180);
ok("arredonda nunca para zero", arredondaGramas(0.2) === 0.5);
{
  let pior = 0;
  for (let g = 10; g <= 600; g += 0.37) pior = Math.max(pior, Math.abs(arredondaGramas(g) - g) / g);
  ok("de 10 g em diante, o arredondamento erra no máximo ~5%", pior <= 0.051, `${(pior * 100).toFixed(1)}%`);
}

const arroz = trocas(A("arroz-tipo-1-cozido"), 150, "carboidrato", B);
ok("150 g de arroz cozido: alvo perto de 42 g de carbo", Math.abs((arroz.alvo ?? 0) - 42.1) < 0.2, String(arroz.alvo));
ok("arroz → há trocas", arroz.trocas.length >= 6, String(arroz.trocas.length));
for (const t of arroz.trocas) {
  const erro = Math.abs(t.igualado - arroz.alvo!) / arroz.alvo!;
  ok(`arroz → ${t.alimento.slug}: carbo a menos de 8% do alvo`, erro < 0.08, `${(erro * 100).toFixed(1)}%`);
}

secao("3. TOLERÂNCIA DO ARREDONDAMENTO EM TODOS OS GRUPOS E CRITÉRIOS");
const CRITS: Criterio[] = ["carboidrato", "proteina", "energia"];
for (const r of REFERENCIAS) {
  for (const c of CRITS) {
    const res = trocas(A(r.slug), r.gramas, c, B);
    if (res.recusa) continue;
    const pior = Math.max(0, ...res.trocas.map((t) => Math.abs(t.igualado - res.alvo!) / res.alvo!));
    /* Gorduras: porções de poucos gramas, arredondadas ao grama. */
    const limite = r.grupo === "gorduras" ? 0.2 : 0.08;
    ok(`${r.grupo} por ${c}: pior erro abaixo de ${limite * 100}%`, pior < limite, `${(pior * 100).toFixed(1)}%`);
  }
}

secao("4. INVERSÃO: A → B → A volta perto da quantidade original");
const pares: [string, string, Criterio, number][] = [
  ["arroz-tipo-1-cozido", "batata-doce-cozida", "carboidrato", 150],
  ["frango-peito-sem-pele-grelhado", "carne-bovina-patinho-sem-gordura-grelhado", "proteina", 120],
  ["pao-trigo-frances", "arroz-tipo-1-cozido", "carboidrato", 50],
  ["feijao-carioca-cozido", "lentilha-cozida", "carboidrato", 140],
];
for (const [a, b, c, g] of pares) {
  const ida = trocaDireta(A(a), g, A(b), c).troca!;
  const volta = trocaDireta(A(b), ida.gramas, A(a), c).troca!;
  const erro = Math.abs(volta.gramas - g) / g;
  ok(`${a} → ${b} → volta`, erro <= 0.1, `${g} g → ${ida.gramas} g → ${volta.gramas} g`);
}

secao("5. CRU E COZIDO NUNCA SE MISTURAM NAS SUGESTÕES");
ok("arroz cru e cozido são entidades diferentes", A("arroz-tipo-1-cru").energia! > A("arroz-tipo-1-cozido").energia! * 2);
ok("estado do arroz cru = cru", estadoDe(A("arroz-tipo-1-cru")) === "cru");
ok("estado da banana crua = pronto (fruta se come crua)", estadoDe(A("banana-prata-crua")) === "pronto");
for (const [s, c] of [["arroz-tipo-1-cozido", "carboidrato"], ["arroz-tipo-1-cru", "carboidrato"], ["frango-peito-sem-pele-cru", "proteina"], ["frango-peito-sem-pele-grelhado", "proteina"]] as const) {
  const est = estadoDe(A(s));
  const r = trocas(A(s), 100, c, B);
  ok(`${s}: todas as trocas no estado "${est}"`, r.trocas.every((t) => estadoDe(t.alimento) === est), r.trocas.map((t) => t.alimento.slug).join(","));
}
ok("arroz cru troca com macarrão cru", trocas(A("arroz-tipo-1-cru"), 50, "carboidrato", B).trocas.some((t) => t.alimento.slug === "macarrao-trigo-cru"));
ok("arroz cozido NÃO sugere macarrão cru", !arroz.trocas.some((t) => t.alimento.slug === "macarrao-trigo-cru"));

secao("6. TROCAS ABSURDAS NÃO APARECEM");
const arrozKcal = trocas(A("arroz-tipo-1-cozido"), 150, "energia", B);
ok("arroz por calorias não sugere manteiga nem chocolate", !arrozKcal.trocas.some((t) => /^manteiga|chocolate|azeite/.test(t.alimento.slug)));
const frango = trocas(A("frango-peito-sem-pele-grelhado"), 100, "proteina", B);
ok("frango não é trocado por açúcar, arroz ou pão", !frango.trocas.some((t) => /acucar|arroz|pao/.test(t.alimento.slug)));
ok("nenhuma quantidade fora dos limites do grupo", [arroz, arrozKcal, frango].every((r) => r.trocas.every((t) => t.gramas >= GRUPOS[r.grupo!].min && t.gramas <= GRUPOS[r.grupo!].max)));
const couve = trocaDireta(A("arroz-tipo-1-cozido"), 150, A("couve-flor-cozida"), "carboidrato");
ok("arroz por couve-flor em carbo: recusa, sem quantidade absurda", couve.troca === null && couve.motivo === "destino-nao-e-fonte");
ok("arroz por couve-flor: mostra o peso por peso", couve.pesoPorPeso !== null && couve.pesoPorPeso.energia! < 60);

secao("7. ORIGEM QUE NÃO É FONTE");
const azeite = trocas(A("azeite-de-oliva-extra-virgem"), 10, "proteina", B);
ok("azeite por proteína: recusa, sem trocas", azeite.recusa !== null && azeite.trocas.length === 0, String(azeite.recusa));
const arrozProt = trocas(A("arroz-tipo-1-cozido"), 100, "proteina", B);
ok("100 g de arroz por proteína: não é fonte (2,5 g)", arrozProt.recusa === "origem-nao-e-fonte");

secao("8. QUANTIDADES EXTREMAS");
for (const g of [1, 50, 150, 1000, 5000]) {
  const r = trocas(A("arroz-tipo-1-cozido"), g, "carboidrato", B);
  ok(`${g} g de arroz: sem NaN e dentro dos limites`, r.trocas.every((t) => Number.isFinite(t.gramas) && t.gramas >= 15 && t.gramas <= 600), `${r.trocas.length} trocas`);
}

secao("9. MEDIDA CASEIRA SÓ COM FONTE E SÓ QUANDO ENCAIXA");
const ovo = A("ovo-de-galinha-inteiro-cozido-10minutos");
ok("240 g de ovo cozido → unidades, não pedaços", medidaCaseira(ovo, 240)?.texto.endsWith("unidades") ?? false, medidaCaseira(ovo, 240)?.texto);
ok("alimento sem medida da POF → sem medida", medidaCaseira(A("cara-cozido"), 200) === null);
const pao = A("pao-trigo-frances");
ok("50 g de pão francês → 1 unidade", medidaCaseira(pao, 50)?.texto === "1 unidade", medidaCaseira(pao, 50)?.texto);
ok("nunca usa 'porção' como medida", MEMBROS.every((m) => !/porç/.test(medidaCaseira(A(m.slug), 100)?.texto ?? "")));

secao("10. AS RESPOSTAS DO FAQ");
const f = (o: string, g: number, c: Criterio, d: string) => trocas(A(o), g, c, B).trocas.find((t) => t.alimento.slug === d);
ok("100 g de frango grelhado → ovos com proteína parecida", (() => { const t = f("frango-peito-sem-pele-grelhado", 100, "proteina", "ovo-de-galinha-inteiro-cozido-10minutos"); return !!t && Math.abs(t.igualado - 32) < 2; })());
ok("ovos no lugar do frango avisam mais gordura", f("frango-peito-sem-pele-grelhado", 100, "proteina", "ovo-de-galinha-inteiro-cozido-10minutos")?.avisos.some((a) => /gordura/.test(a)) ?? false);
ok("100 g de arroz → batata-doce existe", !!f("arroz-tipo-1-cozido", 100, "carboidrato", "batata-doce-cozida"));

secao("11. CORREÇÕES DA AUDITORIA (14/10)");
for (const s of ["inhame-cru", "cara-cru", "batata-baroa-crua", "beterraba-crua"]) {
  if (!B.has(s)) continue;
  const r = trocas(A(s), 150, "carboidrato", B);
  ok(`${s}: nunca troca com alimento cozido/pronto`, r.trocas.every((t) => estadoDe(t.alimento) === "cru"), r.trocas.map((t) => t.alimento.slug).join(","));
}
ok("feijão por proteína tem trocas", trocas(A("feijao-carioca-cozido"), 140, "proteina", B).trocas.length > 0);
ok("queijo minas por proteína inclui iogurte", trocas(A("queijo-minas-frescal"), 45, "proteina", B).trocas.some((t) => /iogurte/.test(t.alimento.slug)));
ok("banana por carboidrato inclui morango", trocas(A("banana-prata-crua"), 75, "carboidrato", B).trocas.some((t) => t.alimento.slug === "morango-cru"));
ok("chocolate por carboidrato: sem grupo (não vira arroz)", trocas(A("chocolate-ao-leite"), 30, "carboidrato", B).recusa === "sem-grupo");
ok("requeijão não é troca de queijo minas", !trocas(A("queijo-minas-frescal"), 45, "proteina", B).trocas.some((t) => /requeijao/.test(t.alimento.slug)));
ok("8 g de azeite → 1 colher de sopa", medidaCaseira(A("azeite-de-oliva-extra-virgem"), 8)?.texto === "1 colher de sopa", medidaCaseira(A("azeite-de-oliva-extra-virgem"), 8)?.texto);
ok("150 g de iogurte → 1 copo americano", medidaCaseira(A("iogurte-natural"), 150)?.texto === "1 copo americano", medidaCaseira(A("iogurte-natural"), 150)?.texto);
ok("mamão formosa nunca em 'unidade'", !/unidade/.test(medidaCaseira(A("mamao-formosa-cru"), 155)?.texto ?? ""));
{
  /* O aviso de calorias aparece exatamente quando a diferença passa de 15% (e de 20 kcal). */
  let erradas = 0;
  for (const r of REFERENCIAS) for (const c of ["carboidrato", "proteina"] as Criterio[]) {
    const res = trocas(A(r.slug), r.gramas * 2, c, B);
    for (const t of res.trocas) {
      const e0 = res.macrosOrigem.energia!, e1 = t.macros.energia!;
      const deve = Math.abs(e1 - e0) > 20 && Math.abs(e1 - e0) > e0 * 0.15;
      if (deve !== t.avisos.some((a) => /calorias/.test(a))) erradas++;
    }
  }
  ok("aviso de calorias coerente com a diferença real", erradas === 0, String(erradas));
}

/* Fora da TACO: whey (rótulo de referência) e tilápia (USDA), sempre com a fonte escrita. */
ok("extras fora da TACO têm fonte", ["whey-protein-concentrado", "tilapia-file-grelhado", "tilapia-file-cru", "granola"].every((s) => B.has(s) && !!A(s).fonte));
ok("whey: 30 g têm 23 g de proteína", Math.abs(macrosDe(A("whey-protein-concentrado"), 30).proteina! - 23) < 0.1);
{
  const w = trocas(A("whey-protein-concentrado"), 30, "proteina", B).trocas.find((t) => t.alimento.slug === "frango-peito-sem-pele-grelhado");
  ok("1 scoop de whey ≈ 70 g de frango grelhado", w?.gramas === 70, String(w?.gramas));
  const f = trocas(A("frango-peito-sem-pele-grelhado"), 100, "proteina", B).trocas;
  ok("frango por proteína inclui tilápia e whey", ["tilapia-file-grelhado", "whey-protein-concentrado"].every((s) => f.some((t) => t.alimento.slug === s)));
  ok("arroz por carboidrato inclui granola, com aviso de calorias", trocas(A("arroz-tipo-1-cozido"), 100, "carboidrato", B).trocas.some((t) => t.alimento.slug === "granola" && t.avisos.length > 0));
  ok("arroz por carboidrato inclui abóbora cabotiá", trocas(A("arroz-tipo-1-cozido"), 100, "carboidrato", B).trocas.some((t) => t.alimento.slug === "abobora-cabotian-cozida"));
  ok("tilápia crua só troca com cru", trocas(A("tilapia-file-cru"), 150, "proteina", B).trocas.every((t) => /cru/.test(t.alimento.slug)));
}

console.log(`\n${"=".repeat(64)}\n${falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} FALHA(S)`}`);
process.exit(falhas === 0 ? 0 : 1);
