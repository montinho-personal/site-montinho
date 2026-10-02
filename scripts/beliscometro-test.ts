/**
 * Beliscômetro + "O que a balança não conta": cálculo, fontes e linguagem.
 * Rodar: npx tsx scripts/beliscometro-test.ts
 */
import { readFileSync } from "node:fs";
import { ALIMENTOS, buscar } from "../lib/beliscometro/alimentos";
import { calcular, simular, PERFIS, type Respostas } from "../lib/beliscometro/motor";
import { KCAL_POR_KG, equivalenteBeliscos, gastoDe, perspectiva } from "../lib/beliscometro/balanca";

let falhas = 0;
const ok = (c: boolean, m: string, x = "") => { console.log(`  ${c ? "ok    " : "FALHOU"}  ${m}${c ? "" : "  " + x}`); if (!c) falhas++; };

// Base
ok(ALIMENTOS.every((a) => a.kcal100 > 0 || ["agua"].includes(a.id)), "todo alimento tem energia");
ok(ALIMENTOS.every((a) => /TACO|USDA|POF|IBGE/.test(a.fonte)), "todo alimento tem fonte reconhecida", ALIMENTOS.filter((a) => !/TACO|USDA/.test(a.fonte)).map((a) => a.id).join(","));
ok(ALIMENTOS.every((a) => a.medidas.some((m) => m.id === a.padrao)), "medida padrão existe");
ok(ALIMENTOS.every((a) => a.medidas.every((m, i, xs) => i === 0 || m.gramas >= xs[i - 1].gramas)), "medidas em ordem crescente", ALIMENTOS.filter((a) => !a.medidas.every((m, i, xs) => i === 0 || m.gramas >= xs[i - 1].gramas)).map((a) => a.id).join(","));
ok(new Set(ALIMENTOS.map((a) => a.id)).size === ALIMENTOS.length, "ids únicos");
ok(buscar("mussarela")[0]?.id === "queijo" && buscar("pao de queijo")[0]?.id === "pao-de-queijo", "busca sem acento e por sinônimo");
for (const c of ["doces", "salgados", "petiscos", "bebidas", "disfarcados"]) ok(ALIMENTOS.some((a) => a.categoria === c), `categoria ${c} tem alimentos`);

// Cálculo
const base: Respostas = { momentos: ["trabalho", "noite"], itens: [
  { alimentoId: "amendoim", medidaId: "medio", frequencia: "1" }, // 30 g × 606 = 181,8
  { alimentoId: "chocolate", medidaId: "2q", frequencia: "2" }, // 10 g × 540 × 2 = 108
  { alimentoId: "pao-de-queijo", medidaId: "2", frequencia: "fds" }, // 60 g × 363 × 2/7 = 62,2
], fazendo: "trabalhando", conta: "quase-nunca" };
const r = calcular(base);
ok(Math.abs(r.kcalDia - (181.8 + 108 + 217.8 * 2 / 7)) < 0.5, "soma por dia", String(r.kcalDia));
ok(Math.abs(r.kcalSemana - r.kcalDia * 7) < 0.01, "semana = dia × 7");
ok(r.podio[0].alimento.id === "amendoim", "pódio: maior primeiro");
ok(r.perfil === "automatico", "perfil automático (trabalho + fazendo outra coisa)", r.perfil);
ok(r.insight.some((t) => /enquanto trabalha/.test(t)), "insight cita o momento");
const semComportamento = calcular({ ...base, fazendo: "nao", conta: "sim" });
ok(Math.abs(semComportamento.kcalDia - r.kcalDia) < 0.001, "perguntas de comportamento não mexem no número");
const livre = calcular({ momentos: [], itens: [{ alimentoId: "amendoim", medidaId: "livre", gramasLivres: 100, frequencia: "1" }] });
ok(Math.abs(livre.kcalDia - 606) < 0.5, "gramas informados pela pessoa");
const comp = calcular({ momentos: ["tv"], itens: [{ alimentoId: "batata-alheia", medidaId: "punhadinho", frequencia: "1" }, { alimentoId: "resto-filhos", medidaId: "garfadas", frequencia: "1" }] });
ok(comp.perfil === "compartilhado", "perfil compartilhado", comp.perfil);
ok(comp.menosPercebido?.alimento.categoria === "disfarcados", "menos percebido: disfarçado");

// Simulação
const s1 = simular(base, { alimentoId: "amendoim", tipo: "porcao-menor" });
ok(s1.depois < s1.antes && Math.abs(s1.antes - s1.depois - (30 - 15) * 6.06) < 0.5, "porção menor reduz", JSON.stringify(s1));
const s2 = simular(base, { alimentoId: "chocolate", tipo: "menos-vezes" });
ok(Math.abs(s2.antes - s2.depois - 54) < 0.5, "menos vezes reduz (2→1)", JSON.stringify(s2));

// Balança
ok(KCAL_POR_KG === 7700, "7.700 kcal/kg");
const tdee = { min: 2500, max: 2500 };
const p1 = perspectiva(1, 1, tdee), p2 = perspectiva(2, 1, tdee), pf = perspectiva(2, 2, tdee);
ok(p1.superavit === 7700 && p1.consumoPorDia.min === 10200, "1 kg em 1 dia → 10.200 kcal consumidas");
ok(p2.superavit === 15400 && p2.consumoPorDia.min === 17900, "2 kg em 1 dia → 17.900");
ok(pf.superavitPorDia === 7700 && pf.consumoPorDia.min === 10200, "2 kg no fim de semana → 10.200/dia");
const e = equivalenteBeliscos(680, 1, "sim");
ok(Math.abs(e.kg.max - 0.0883) < 0.001, "680 kcal ≈ 0,09 kg (hipótese de excedente total)");
ok(equivalenteBeliscos(680, 1, "substituiram").kg.max === 0, "substituíram → sem excedente");
ok(equivalenteBeliscos(680, 1, "nao-sei").kg.min === 0, "não sei → faixa a partir de zero");
const g = gastoDe({ peso: 85, altura: 172, idade: 34, sexo: "masculino", nivelId: "moderado" });
ok(Math.round(g.tdee.min) === 2728, "gasto igual ao da calculadora de TMB/TDEE", String(g.tdee.min));

// Linguagem: nada de culpa, terrorismo ou promessa
const textos = [
  readFileSync("components/beliscometro/Beliscometro.tsx", "utf8"), readFileSync("components/beliscometro/Balanca.tsx", "utf8"),
  readFileSync("lib/beliscometro/motor.ts", "utf8"), readFileSync("lib/beliscometro/balanca.ts", "utf8"), readFileSync("app/ferramentas/beliscometro/page.tsx", "utf8"),
  JSON.stringify(PERFIS),
].join("\n").toLowerCase();
for (const proibido of ["lixo", "sabotando", "sabotar", "vilão", "culpa sua", "você vai engordar", "vai engordar", "compulsão", "é impossível", "foi só retenção", "foi apenas retenção", "porcaria", "jejum", "punir"]) {
  ok(!textos.includes(proibido), `sem “${proibido}”`);
}
ok(/estimativa/.test(textos) && /não substitui orientação/.test(textos), "avisos de estimativa e de orientação profissional");
ok(!/beliscometro_result[^\n]*kcal/.test(textos) && !/balanca_result[^\n]*subiu/.test(textos), "GA4 sem kcal ou peso da pessoa");

console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
