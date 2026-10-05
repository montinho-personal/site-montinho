/**
 * Casos de referência do Substituidor de Exercícios.
 */
import assert from "node:assert/strict";
import { EXERCICIOS, EXERCICIO_POR_ID } from "../lib/treino/exercicios";
import { ACADEMIA_COMPLETA, PERFIL, exerciciosSemPerfil } from "../lib/treino/biomecanica";
import { CURADAS, buscaSubstituivel, substitui } from "../lib/treino/substituicoes";
import { PAGINAS_SUBSTITUIR } from "../lib/treino/substituir-seo";

let falhas = 0;
const t = (nome: string, fn: () => void) => { try { fn(); console.log("  ok    ", nome); } catch (e) { falhas++; console.log("  FALHOU", nome, (e as Error).message); } };
const ids = (r: ReturnType<typeof substitui>) => [...(r?.proximas ?? []), ...(r?.mesmoMusculo ?? [])].map((a) => a.ex.id);

t("todo exercício da base tem perfil biomecânico", () => assert.deepEqual(exerciciosSemPerfil(), []));
t("toda curadoria aponta para exercícios que existem", () => { for (const [k, v] of Object.entries(CURADAS)) { assert.ok(EXERCICIO_POR_ID.has(k), k); for (const c of v) assert.ok(EXERCICIO_POR_ID.has(c.id), `${k} → ${c.id}`); } });

t("caso 1: supino com barra, só halteres → supino com halteres em primeiro", () => {
  const r = substitui({ exercicioId: "supino-reto-barra", motivo: "sem-aparelho", equipamentos: ["halter", "banco"] });
  assert.equal(r?.proximas[0].ex.id, "supino-reto-halter");
  assert.equal(r?.proximas[0].tier, "muito-proxima");
});
t("caso 2: cadeira extensora sem máquinas → só quadríceps, nada de máquina", () => {
  const r = substitui({ exercicioId: "cadeira-extensora", motivo: "sem-aparelho", equipamentos: ["barra", "halter", "banco"] })!;
  assert.ok(r.proximas.length >= 3);
  for (const a of r.proximas) { assert.ok(a.ex.primarios.includes("quadriceps"), a.ex.nome); assert.ok(!a.ex.precisa.includes("maquina"), a.ex.nome); }
});
t("caso 3: leg press em casa sem nada → só peso corporal", () => {
  const r = substitui({ exercicioId: "leg-press", motivo: "casa", equipamentos: [] })!;
  assert.ok(r.proximas.length >= 2);
  for (const a of [...r.proximas, ...r.mesmoMusculo]) assert.deepEqual(a.ex.precisa, [], a.ex.nome);
});
t("caso 4: puxada alta com barra fixa e elástico → puxadas verticais primeiro", () => {
  const r = substitui({ exercicioId: "puxada-frente", motivo: "casa", equipamentos: ["barra-fixa", "elastico"] })!;
  assert.ok(r.proximas.slice(0, 3).every((a) => a.ex.padrao === "puxada-vertical"));
});
t("caso 5: stiff → hinge entre os parecidos, mesa flexora separada", () => {
  const r = substitui({ exercicioId: "stiff", motivo: "variar", equipamentos: ACADEMIA_COMPLETA })!;
  assert.ok(r.proximas.slice(0, 3).every((a) => a.ex.padrao === "hinge"));
  assert.ok(!r.proximas.some((a) => a.ex.id === "mesa-flexora"));
  assert.ok(r.mesmoMusculo.some((a) => a.ex.id === "mesa-flexora"));
});
t("supino com halteres é mais parecido com supino barra do que elevação lateral", () => {
  const r = substitui({ exercicioId: "supino-reto-barra", motivo: "variar", equipamentos: ACADEMIA_COMPLETA })!;
  const l = ids(r);
  assert.ok(l.includes("supino-reto-halter"));
  assert.ok(!l.includes("elevacao-lateral"));
});
t("só peso corporal: nunca máquina, barra ou polia (todos os exercícios)", () => {
  for (const e of EXERCICIOS) {
    const r = substitui({ exercicioId: e.id, motivo: "casa", equipamentos: [] })!;
    for (const a of [...r.proximas, ...r.mesmoMusculo]) assert.deepEqual(PERFIL[a.ex.id].precisa, [], `${e.id} → ${a.ex.id}`);
  }
});
t("iniciante: a primeira opção do leg press não é a mais técnica disponível", () => {
  const r = substitui({ exercicioId: "leg-press", motivo: "variar", equipamentos: ACADEMIA_COMPLETA, nivel: "iniciante" })!;
  assert.ok(r.proximas[0].ex.tecnica <= 2);
  assert.notEqual(r.proximas[0].ex.id, "agachamento-livre");
});
t("motivo muda o resultado (desconforto x mais avançado no supino)", () => {
  const a = substitui({ exercicioId: "supino-reto-barra", motivo: "desconforto", equipamentos: ACADEMIA_COMPLETA })!;
  const b = substitui({ exercicioId: "supino-reto-barra", motivo: "mais-avancado", equipamentos: ACADEMIA_COMPLETA })!;
  assert.notDeepEqual(a.proximas.map((x) => x.ex.id), b.proximas.map((x) => x.ex.id));
});
t("desconforto sempre traz o aviso; variar traz o aviso de não trocar à toa", () => {
  for (const e of EXERCICIOS.slice(0, 40)) assert.ok(substitui({ exercicioId: e.id, motivo: "desconforto", equipamentos: ACADEMIA_COMPLETA })!.avisos.some((x) => /avaliação/.test(x)));
  assert.ok(substitui({ exercicioId: "leg-press", motivo: "variar", equipamentos: ACADEMIA_COMPLETA })!.avisos.some((x) => /não precisa trocar/.test(x)));
});
t("nenhum texto diz que substitui perfeitamente nem cita EMG", () => {
  for (const e of EXERCICIOS) for (const a of [...substitui({ exercicioId: e.id, motivo: "variar", equipamentos: ACADEMIA_COMPLETA })!.proximas]) {
    const txt = [a.porque, ...a.preserva, ...a.muda, a.quando ?? ""].join(" ");
    assert.ok(!/perfeitamente|idêntic|EMG|melhor substituto/i.test(txt), `${e.id} → ${a.ex.id}`);
  }
});
t("toda alternativa diz o que muda ou é de outro grupo", () => {
  for (const e of EXERCICIOS) for (const a of substitui({ exercicioId: e.id, motivo: "variar", equipamentos: ACADEMIA_COMPLETA })!.proximas) assert.ok(a.muda.length > 0 || a.tier === "muito-proxima", `${e.id} → ${a.ex.id}`);
});
t("unilateral nunca é 'muito próxima' de bilateral (e vice-versa)", () => {
  for (const e of EXERCICIOS) for (const a of substitui({ exercicioId: e.id, motivo: "variar", equipamentos: ACADEMIA_COMPLETA })!.proximas)
    if (a.tier === "muito-proxima" && !a.curada) assert.equal(!!a.ex.unilateral, !!e.unilateral, `${e.id} → ${a.ex.id}`);
});
t("composto com carga: peso corporal nunca é 'muito próxima' (fora da curadoria)", () => {
  for (const e of EXERCICIOS) for (const a of substitui({ exercicioId: e.id, motivo: "variar", equipamentos: ACADEMIA_COMPLETA })!.proximas)
    if (a.tier === "muito-proxima" && !a.curada && e.categoria === "composto" && PERFIL[e.id].precisa.length) assert.ok(PERFIL[a.ex.id].precisa.length > 0, `${e.id} → ${a.ex.id}`);
});
t("agachamento no smith: primeira opção é bilateral", () => assert.ok(!substitui({ exercicioId: "agachamento-smith", motivo: "sem-aparelho", equipamentos: ACADEMIA_COMPLETA })!.proximas[0].ex.unilateral));
t("busca com aliases brasileiros", () => {
  assert.equal(buscaSubstituivel("extensora")[0].id, "cadeira-extensora");
  assert.equal(buscaSubstituivel("puxador")[0].id, "puxada-frente");
  assert.equal(buscaSubstituivel("hack")[0].id, "agachamento-hack");
  assert.equal(buscaSubstituivel("supino maquina")[0].id, "supino-maquina");
  assert.ok(buscaSubstituivel("pulley").some((e) => e.id === "triceps-pulley"));
});
t("páginas SEO: só indexa o que foi revisado e tem exercício existente", () => {
  for (const p of PAGINAS_SUBSTITUIR) { assert.ok(EXERCICIO_POR_ID.has(p.exercicioId), p.slug); if (p.isIndexable) assert.ok(p.editorialReviewed, p.slug); }
});

console.log(falhas ? `\n${falhas} TESTE(S) FALHARAM` : "\nTODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
