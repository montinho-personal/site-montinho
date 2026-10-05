/**
 * Trava o comportamento da Calculadora de Descanso Entre Séries:
 * os quatro casos do briefing, a coerência de RIR e de demanda em TODAS as
 * combinações, e a busca de exercícios.
 */
import assert from "node:assert/strict";
import { calcula, encontraExercicio, explica, fmtFaixa, minutosDeDescanso, type Demanda, type FaixaReps, type Objetivo, type Rir } from "../lib/descanso";

let falhas = 0;
const t = (nome: string, fn: () => void) => { try { fn(); console.log("  ok    ", nome); } catch (e) { falhas++; console.log("  FALHOU", nome, (e as Error).message); } };

t("lateral 15 reps RIR 2 → 1:00–2:00", () => assert.equal(fmtFaixa(calcula({ objetivo: "hipertrofia", demanda: "isolador", reps: "11-15", rir: 2 })), "1:00–2:00"));
t("agachamento 8 reps RIR 1 → 2:30–4:00", () => assert.equal(fmtFaixa(calcula({ objetivo: "hipertrofia", demanda: "muito_exigente", reps: "7-10", rir: 1 })), "2:30–4:00"));
t("supino força 3 reps RIR 1 → 3:00–5:00", () => assert.equal(fmtFaixa(calcula({ objetivo: "forca", demanda: "composto_pesado", reps: "1-3", rir: 1 })), "3:00–5:00"));
t("rosca 10 reps RIR 0 → 1:30–2:30", () => assert.equal(fmtFaixa(calcula({ objetivo: "hipertrofia", demanda: "isolador", reps: "7-10", rir: 0 })), "1:30–2:30"));
t("rosca RIR 4 abaixo de rosca RIR 0", () => {
  const a = calcula({ objetivo: "hipertrofia", demanda: "isolador", reps: "11-15", rir: 4 });
  const b = calcula({ objetivo: "hipertrofia", demanda: "isolador", reps: "11-15", rir: 0 });
  assert.ok(a.max < b.max && a.min <= b.min);
});

const OBJ: Objetivo[] = ["hipertrofia", "forca", "resistencia", "potencia"];
const DEM: Demanda[] = ["isolador", "composto_moderado", "composto_pesado", "muito_exigente"];
const REPS: FaixaReps[] = ["1-3", "4-6", "7-10", "11-15", "16+"];
const RIRS: Rir[] = [4, 3, 2, 1, 0];

t("menos RIR nunca dá menos descanso (todas as combinações)", () => {
  for (const o of OBJ) for (const d of DEM) for (const r of REPS) for (let i = 1; i < RIRS.length; i++) {
    const a = calcula({ objetivo: o, demanda: d, reps: r, rir: RIRS[i - 1] });
    const b = calcula({ objetivo: o, demanda: d, reps: r, rir: RIRS[i] });
    assert.ok(b.min >= a.min && b.max >= a.max, `${o} ${d} ${r} RIR ${RIRS[i]}`);
  }
});
t("exercício mais exigente nunca dá menos descanso", () => {
  for (const o of OBJ) for (const r of REPS) for (const rir of RIRS) for (let i = 1; i < DEM.length; i++) {
    const a = calcula({ objetivo: o, demanda: DEM[i - 1], reps: r, rir });
    const b = calcula({ objetivo: o, demanda: DEM[i], reps: r, rir });
    assert.ok(b.min >= a.min && b.max >= a.max, `${o} ${DEM[i]} ${r} ${rir}`);
  }
});
t("faixas em blocos de 30 s, mínimo < máximo, início dentro", () => {
  for (const o of OBJ) for (const d of DEM) for (const r of REPS) for (const rir of RIRS) for (const x of ["iniciante", "intermediario", "avancado"] as const) {
    const v = calcula({ objetivo: o, demanda: d, reps: r, rir, experiencia: x });
    assert.ok(v.min % 30 === 0 && v.max % 30 === 0 && v.inicio % 30 === 0 && v.min < v.max && v.inicio >= v.min && v.inicio <= v.max, JSON.stringify(v));
  }
});
t("hipertrofia nunca sugere menos de 1 minuto", () => {
  for (const d of DEM) for (const r of REPS) for (const rir of RIRS) assert.ok(calcula({ objetivo: "hipertrofia", demanda: d, reps: r, rir }).min >= 60);
});
t("busca: supino, agachamento, leg press, rosca, lateral, extensora", () => {
  assert.equal(encontraExercicio("supino reto")?.nome, "Supino reto");
  assert.equal(encontraExercicio("Agachamento")?.nome, "Agachamento livre");
  assert.equal(encontraExercicio("leg press 45")?.nome, "Leg press");
  assert.equal(encontraExercicio("rosca direta")?.demanda, "isolador");
  assert.equal(encontraExercicio("elevação lateral")?.nome, "Elevação lateral");
  assert.equal(encontraExercicio("cadeira extensora")?.demanda, "isolador");
  assert.equal(encontraExercicio("xyz"), null);
});
t("explicação do isolador na falha é gramatical", () => assert.match(explica({ objetivo: "hipertrofia", demanda: "isolador", reps: "7-10", rir: 0 }, "Rosca direta"), /^Apesar de rosca direta ser um isolador/));
t("explicações sem vírgula solta nem ponto duplo", () => { for (const d of ["isolador", "composto_moderado", "composto_pesado", "muito_exigente"] as const) for (const r of [0, 1, 2, 3, 4] as const) { const x = explica({ objetivo: "hipertrofia", demanda: d, reps: "7-10", rir: r }, "X"); assert.ok(!/,\.|\.\.|  /.test(x), x); } });
t("20 séries × 2 min ≈ 40 min de intervalo", () => assert.equal(minutosDeDescanso(20, 2), 40));

console.log(falhas ? `\n${falhas} TESTE(S) FALHARAM` : "\nTODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
