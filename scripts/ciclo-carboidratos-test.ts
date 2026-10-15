/**
 * Testes do motor da Calculadora de Ciclo de Carboidratos.
 *   npx tsx scripts/ciclo-carboidratos-test.ts
 */
import { calculaMacros } from "../lib/macros";
import {
  CARB_MIN_DIA, GORD_MAX_PCT, GORD_MIN_PCT, GORDURA_MEDIA_PCT, PROTEINA_G_KG, RAZAO_MAX_ALTO_BAIXO,
  calculaCiclo, distribui, gPorKg, niveisSugeridos, proximoNivel, type Base, type DiaEntrada,
} from "../lib/carboidratos/ciclo";

let falhas = 0;
const ok = (nome: string, cond: boolean, extra = "") => {
  if (!cond) falhas++;
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${extra ? ` (${extra})` : ""}`);
};

const M = (min: number, i: DiaEntrada["sessoes"][0]["intensidade"] = "moderado"): DiaEntrada => ({ sessoes: [{ tipo: "musculacao", minutos: min, intensidade: i }] });
const C = (min: number, i: DiaEntrada["sessoes"][0]["intensidade"] = "moderado"): DiaEntrada => ({ sessoes: [{ tipo: "corrida", minutos: min, intensidade: i }] });
const R: DiaEntrada = { sessoes: [] };

const perfis: [string, Base, DiaEntrada[]][] = [
  ["emagrecer + musculação 3x", { kcal: 1800, pesoKg: 75, objetivo: "emagrecer" }, [M(60, "pesado"), R, M(60), R, M(75, "muito-pesado"), R, R]],
  ["hipertrofia + musculação 5x", { kcal: 2900, pesoKg: 80, objetivo: "ganhar" }, [M(75, "pesado"), M(60), M(75, "muito-pesado"), M(60), M(60), R, R]],
  ["corrida 4x com longão", { kcal: 2400, pesoKg: 65, objetivo: "performance" }, [C(45), R, C(60, "pesado"), R, C(45), C(120), R]],
  ["musculação + corrida no mesmo dia", { kcal: 2600, pesoKg: 78, objetivo: "manter" }, [{ sessoes: [{ tipo: "musculacao", minutos: 60, intensidade: "pesado" }, { tipo: "corrida", minutos: 45, intensidade: "moderado" }] }, R, M(60), R, M(60), C(60), R]],
  ["treino 7 dias", { kcal: 2500, pesoKg: 70, objetivo: "manter" }, [M(60, "pesado"), C(30, "leve"), M(60), C(90), M(60, "pesado"), M(45, "leve"), C(60)]],
  ["descanso a semana toda", { kcal: 2000, pesoKg: 70, objetivo: "organizar" }, [R, R, R, R, R, R, R]],
  ["10 sessões na semana", { kcal: 3000, pesoKg: 75, objetivo: "performance" }, [M(60), { sessoes: [M(60).sessoes[0], C(45).sessoes[0]] }, C(60), { sessoes: [M(60).sessoes[0], C(30).sessoes[0]] }, M(60), { sessoes: [C(90).sessoes[0], M(45).sessoes[0]] }, R]],
];

for (const [nome, base, semana] of perfis) {
  const r = calculaCiclo(base, semana);
  const media = calculaMacros(base.kcal, base.pesoKg, PROTEINA_G_KG[base.objetivo], GORDURA_MEDIA_PCT).carboidrato.gramas;
  ok(`${nome}: 7 dias`, r.dias.length === 7);
  ok(`${nome}: média semanal de carbo preservada (±5 g)`, Math.abs(r.media.carb - media) <= 5, `${r.media.carb} × ${media.toFixed(0)}`);
  ok(`${nome}: calorias do dia estáveis (±15 kcal)`, r.dias.every((d) => Math.abs(d.kcal - base.kcal) <= 15), r.dias.map((d) => d.kcal).join(","));
  ok(`${nome}: macros nunca passam das calorias (+15)`, r.dias.every((d) => d.prot * 4 + d.carb * 4 + d.gord * 9 <= base.kcal + 15));
  ok(`${nome}: gordura entre 20% e 35% (com arredondamento)`, r.dias.every((d) => d.gord * 9 >= base.kcal * GORD_MIN_PCT - 25 && d.gord * 9 <= base.kcal * GORD_MAX_PCT + 25), r.dias.map((d) => d.gord).join(","));
  ok(`${nome}: proteína igual todos os dias`, new Set(r.dias.map((d) => d.prot)).size === 1);
  const carbs = r.dias.map((d) => d.carb);
  ok(`${nome}: dia alto ≤ ${RAZAO_MAX_ALTO_BAIXO}× o baixo`, Math.max(...carbs) <= Math.min(...carbs) * RAZAO_MAX_ALTO_BAIXO + 5, carbs.join(","));
  ok(`${nome}: nenhum dia abaixo de ${CARB_MIN_DIA} g quando a média permite`, media < CARB_MIN_DIA || carbs.every((c) => c >= CARB_MIN_DIA - 3), carbs.join(","));
  ok(`${nome}: descanso nunca é alto`, r.dias.every((d, i) => semana[i].sessoes.length > 0 || d.nivel !== "alto"));
  ok(`${nome}: sem NaN`, r.dias.every((d) => [d.carb, d.gord, d.kcal].every(Number.isFinite)));
}

/* Homogênea e sem ciclo */
{
  const h = calculaCiclo({ kcal: 2200, pesoKg: 70, objetivo: "manter" }, [M(60), M(60), M(60), M(60), M(60), M(45), M(45)]);
  ok("semana homogênea não inventa contraste", h.homogenea && new Set(h.dias.map((d) => d.carb)).size === 1);
  const b = calculaCiclo({ kcal: 1300, pesoKg: 70, objetivo: "emagrecer" }, [M(60), R, M(60), R, M(60), R, R]);
  ok("média abaixo de 130 g: não cicla e avisa", b.semCiclo && new Set(b.dias.map((d) => d.carb)).size === 1 && b.avisos.length > 0);
  ok("sem ciclo: todos os dias aparecem como médio", b.dias.every((d) => d.nivel === "medio"));
  const imp = calculaCiclo({ kcal: 1200, pesoKg: 150, objetivo: "emagrecer" }, [M(60), R, R, R, R, R, R]);
  ok("proteína + gordura maiores que as calorias: impossível, sem dias", imp.impossivel && imp.dias.length === 0);
}

/* O treino define a demanda */
{
  const seg = calculaCiclo({ kcal: 2400, pesoKg: 75, objetivo: "manter" }, [M(75, "muito-pesado"), M(45, "leve"), R, M(60), R, R, R]);
  const ter = calculaCiclo({ kcal: 2400, pesoKg: 75, objetivo: "manter" }, [M(45, "leve"), M(75, "muito-pesado"), R, M(60), R, R, R]);
  ok("treino pesado na segunda → segunda é alto", seg.dias[0].nivel === "alto");
  ok("mover o treino para terça move o dia alto", ter.dias[1].nivel === "alto" && ter.dias[0].nivel !== "alto");
  ok("mover o dia não muda a média semanal", seg.media.carb === ter.media.carb);
  const n = niveisSugeridos([0, 50, 100, 0, 30, 0, 0]);
  ok("níveis: 0 é baixo, ≥2/3 do máximo é alto", n.niveis[0] === "baixo" && n.niveis[2] === "alto" && n.niveis[1] === "medio" && n.niveis[4] === "baixo");
}

/* Edição pela pessoa */
{
  const base: Base = { kcal: 2400, pesoKg: 75, objetivo: "manter" };
  const semana = [M(75, "pesado"), R, M(60), R, M(60), R, R];
  const a = calculaCiclo(base, semana);
  const ed = calculaCiclo(base, semana, [null, null, null, null, null, "alto", null]);
  ok("descanso marcado como alto: aceita e explica", ed.dias[5].nivel === "alto" && ed.avisos.some((x) => /descanso como alto/.test(x)));
  ok("editar redistribui sem mudar a média", Math.abs(ed.media.carb - a.media.carb) <= 3);
  ok("toque cicla baixo → médio → alto → baixo", proximoNivel("baixo") === "medio" && proximoNivel("medio") === "alto" && proximoNivel("alto") === "baixo");
}

/* Aviso de energia baixa para o volume */
{
  const r = calculaCiclo({ kcal: 1500, pesoKg: 70, objetivo: "emagrecer" }, [C(90), C(60), C(90), C(60), C(90), R, R]);
  ok("energia baixa + muito treino: aviso sem diagnóstico", r.avisos.some((x) => /avaliação individual/.test(x)) && !r.avisos.some((x) => /RED-S|você tem/i.test(x)));
}

/* Matemática de apoio */
{
  const d = distribui(700, [1, 1, 1, 1, 1, 1, 1], [90, 90, 90, 90, 90, 90, 90], [110, 110, 110, 110, 110, 110, 110]);
  ok("distribui preserva o total quando cabe", Math.abs(d.valores.reduce((t, v) => t + v, 0) - 700) < 1e-6);
  const e = distribui(700, [3, 1, 1, 1, 1, 1, 1], new Array(7).fill(90), new Array(7).fill(120));
  ok("distribui segura no teto e repassa o resto", e.valores[0] === 120 && Math.abs(e.valores.reduce((t, v) => t + v, 0) - 700) < 1e-6);
  ok("g/kg com uma casa", gPorKg(280, 80) === 3.5);
}

console.log(falhas === 0 ? "\nTODOS OS TESTES PASSARAM\n" : `\n${falhas} TESTE(S) FALHARAM\n`);
process.exit(falhas === 0 ? 0 : 1);
