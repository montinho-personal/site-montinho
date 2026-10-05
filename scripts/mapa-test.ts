/** Mapa Muscular: casos de referência. */
import assert from "node:assert/strict";
import { EXERCICIOS } from "../lib/treino/exercicios";
import { PERFIL } from "../lib/treino/biomecanica";
import { GRUPOS, GRUPO_DO_MUSCULO, busca, exerciciosDoGrupo, filtra, EQUIP_CASA } from "../lib/treino/mapa";
import { EDITORIAL, GRUPOS_INDEXAVEIS } from "../lib/treino/mapa-editorial";
import { MUSCULOS } from "../lib/treino/musculos";

let falhas = 0;
const t = (n: string, fn: () => void) => { try { fn(); console.log("  ok    ", n); } catch (e) { falhas++; console.log("  FALHOU", n, (e as Error).message); } };

t("mesma base: todo exercício do mapa existe na base do Volume/Substituidor", () => { for (const g of GRUPOS) for (const e of exerciciosDoGrupo(g.slug, true)) assert.ok(EXERCICIOS.some((x) => x.id === e.id) && PERFIL[e.id]); });
t("todo músculo da taxonomia tem grupo e todo grupo tem editorial", () => { for (const m of MUSCULOS) assert.ok(GRUPO_DO_MUSCULO[m.id]); for (const g of GRUPOS) assert.ok(EDITORIAL[g.slug], g.slug); });
t("peito: só exercícios em que o peitoral é principal", () => { for (const e of exerciciosDoGrupo("peito")) assert.ok(e.primarios.includes("peitoral"), e.id); assert.ok(!exerciciosDoGrupo("peito").some((e) => e.id === "triceps-banco")); });
t("bíceps e biceps dão o mesmo resultado", () => assert.deepEqual(busca("bíceps").grupos.map((g) => g.slug), busca("biceps").grupos.map((g) => g.slug)));
t("peito + sem equipamento: nada de máquina", () => { for (const e of filtra(exerciciosDoGrupo("peito"), { equipamentos: [] })) assert.deepEqual(e.precisa, [], e.id); });
t("peito + casa: sem chest press nem polia", () => { for (const e of filtra(exerciciosDoGrupo("peito"), { equipamentos: EQUIP_CASA })) assert.ok(!e.precisa.some((q) => ["maquina", "polia", "smith"].includes(q)), e.id); });
t("ombros + halteres: desenvolvimento, elevação lateral; nenhuma máquina", () => {
  const ids = filtra(exerciciosDoGrupo("ombros"), { equipamentos: ["halter", "banco"] }).map((e) => e.id);
  assert.ok(ids.includes("desenvolvimento-halter") && ids.includes("elevacao-lateral") && ids.includes("crucifixo-inverso-halter"));
  assert.ok(!ids.some((i) => /maquina|cabo|smith/.test(i)));
});
t("'posterior de ombro' → deltoide posterior, nunca posterior de coxa", () => assert.deepEqual(busca("posterior de ombro").grupos.map((g) => g.slug), ["deltoide-posterior"]));
t("'asa' → dorsais, com explicação", () => { const r = busca("asa"); assert.equal(r.grupos[0].slug, "dorsais"); assert.ok(r.nota); });
t("busca inversa: remada baixa → costas principal", () => { const e = busca("remada baixa").exercicios[0]; assert.equal(e.id, "remada-baixa"); assert.ok(e.primarios.includes("costas")); });
t("costas não é um músculo só: 4 subgrupos com listas diferentes", () => { const s = new Set(["dorsais", "parte-superior-das-costas", "trapezio", "lombar"].map((g) => exerciciosDoGrupo(g as never).map((e) => e.id).join())); assert.equal(s.size, 4); });
t("quadríceps inclui extensora, agachamento e leg press", () => { const ids = exerciciosDoGrupo("quadriceps").map((e) => e.id); for (const i of ["cadeira-extensora", "agachamento-livre", "leg-press"]) assert.ok(ids.includes(i), i); });
t("indexáveis: revisados, com conteúdo próprio e ao menos 4 exercícios", () => { for (const g of GRUPOS_INDEXAVEIS) { assert.ok(EDITORIAL[g].editorialReviewed && EDITORIAL[g].uniqueContent); assert.ok(exerciciosDoGrupo(g).length >= 4, g); } });
t("nenhum texto editorial usa percentual de ativação", () => { for (const e of Object.values(EDITORIAL)) assert.ok(!/\d+\s*%/.test(JSON.stringify(e))); });

console.log(falhas ? `\n${falhas} TESTE(S) FALHARAM` : "\nTODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
