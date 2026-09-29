/**
 * Simulador "Quanto tempo para ter shape?" (lib/shape.ts).
 * Rodar: npx tsx scripts/shape-test.ts
 */
import { ANOS, CONSISTENCIA, REFERENCIAS, calcula, faixaAnos, fmtFaixaAnos, maiorGargalo, validaEntrada, type Entrada, type Anos, type Consistencia } from "../lib/shape";

let falhas = 0;
const ok = (c: boolean, m: string) => { if (!c) { falhas++; console.log("FALHOU:", m); } else console.log("ok:", m); };
const base: Entrada = { sexo: "homem", alturaCm: 178, pesoKg: 79, gorduraPct: 15, idade: 28, anos: "1a2", consistencia: "consistente", dias: 4, referencia: "musculoso" };
const finito = (r: ReturnType<typeof calcula>) =>
  [r.ffm, r.ffmi, r.ffmiN, ...r.ffmiFaixa, r.posicaoRegua, ...Object.values(r.cenarios).flatMap((t) => t.flatMap((p) => [p.ffm, p.ffmiN]))].every((v) => Number.isFinite(v) && v >= 0);

// Exemplo do briefing: 1,78 m, 79 kg, 15% → massa magra ~67 kg, FFMI ~21,2
const r = calcula(base);
ok(Math.abs(r.ffm - 67.15) < 0.01, `massa magra 67,2 kg (${r.ffm.toFixed(2)})`);
ok(Math.abs(r.ffmi - 21.19) < 0.02, `FFMI 21,2 (${r.ffmi.toFixed(2)})`);
ok(r.confianca === "alta", "gordura informada + consistente → confiança alta");

// Retornos decrescentes: ganho do 1º ano > 3º ano > 6º ano (cenário consistente, partindo do zero)
const zero = calcula({ ...base, anos: "zero", pesoKg: 70, gorduraPct: 18 });
const t = zero.cenarios.consistente;
const ganho = (a: number, b: number) => t[b * 12].ffm - t[a * 12].ffm;
ok(ganho(0, 1) > ganho(2, 3) && ganho(2, 3) > ganho(5, 6), `retornos decrescentes (${ganho(0, 1).toFixed(1)} > ${ganho(2, 3).toFixed(1)} > ${ganho(5, 6).toFixed(1)} kg)`);
ok(ganho(0, 1) < 12, "1º ano não passa de ~12 kg de massa magra para 57 kg iniciais");

// Cenários ordenados em todo horizonte
const ordenado = [12, 36, 72, 120].every((m) => zero.cenarios.conservador[m].ffm <= zero.cenarios.consistente[m].ffm && zero.cenarios.consistente[m].ffm <= zero.cenarios.otimo[m].ffm);
ok(ordenado, "conservador ≤ consistente ≤ muito bem executado");

// Nunca atravessa a referência do cenário (freio)
ok(zero.cenarios.consistente.every((p) => p.ffmiN <= 25.01), "consistente não passa de FFMI normalizado 25");
ok(zero.cenarios.otimo.every((p) => p.ffmiN <= 26.01), "muito bem executado não passa de 26");

// Referência profissional: sem prazo, sempre
for (const id of ["classic", "212", "open"] as const) ok(calcula({ ...base, referencia: id }).alvo.tipo === "sem-prazo", `${id}: sem prazo responsável`);

// Gordura desconhecida: continua, confiança baixa, faixa mais larga
const sem = calcula({ ...base, gorduraPct: null });
ok(sem.confianca === "baixa" && sem.gorduraEstimada, "sem %G → confiança baixa");
ok(sem.ffmiFaixa[1] - sem.ffmiFaixa[0] > r.ffmiFaixa[1] - r.ffmiFaixa[0], "sem %G → faixa de FFMI mais larga");

// Mais dias além de 3 não acelera
const d3 = calcula({ ...base, dias: 3 }).cenarios.consistente[24].ffm;
const d6 = calcula({ ...base, dias: 6 }).cenarios.consistente[24].ffm;
ok(Math.abs(d3 - d6) < 1e-9, "6 dias = 3 dias no modelo");
ok(calcula({ ...base, dias: 1 }).cenarios.consistente[24].ffm < d3, "1 dia < 3 dias");

// Já está acima da referência escolhida
ok(calcula({ ...base, pesoKg: 95, gorduraPct: 10, referencia: "atletico" }).alvo.tipo === "ja-chegou", "acima do atlético → já chegou");

// Faixas de anos: sem casas absurdas
const fa = faixaAnos(17, 41);
ok(fa[0] === 1 && fa[1] === 4, `faixa 17–41 meses → 1 a 4 anos (${fa})`);
ok(fmtFaixaAnos([2, 4]) === "2 a 4 anos", "formato 2 a 4 anos");

// Varredura de casos-limite: nada de NaN/Infinity/negativo
const casos: Partial<Entrada>[] = [
  { pesoKg: 40, alturaCm: 150 }, { pesoKg: 180, alturaCm: 165 }, { alturaCm: 145, pesoKg: 45 }, { alturaCm: 210, pesoKg: 110 },
  { gorduraPct: null, idade: null }, { gorduraPct: 4 }, { gorduraPct: 50 }, { sexo: "mulher", pesoKg: 58, alturaCm: 162, gorduraPct: 26 },
  { sexo: "mulher", gorduraPct: null, idade: 60 }, { dias: 1 }, { dias: 6 },
];
let todos = true;
for (const c of casos) for (const anos of Object.keys(ANOS) as Anos[]) for (const cons of Object.keys(CONSISTENCIA) as Consistencia[]) for (const ref of REFERENCIAS) {
  const e = { ...base, ...c, anos, consistencia: cons, referencia: ref.id } as Entrada;
  if (validaEntrada(e)) continue;
  const x = calcula(e);
  if (!finito(x)) { todos = false; console.log("  não finito:", JSON.stringify(e)); }
  if (x.alvo.tipo === "faixa" && !(x.alvo.anos[0] > 0 && x.alvo.anos[1] >= x.alvo.anos[0])) { todos = false; console.log("  faixa inválida:", JSON.stringify(e), x.alvo); }
}
ok(todos, "varredura de casos-limite: tudo finito, não negativo e faixas válidas");

// Validação
ok(validaEntrada({ ...base, alturaCm: 1.78 }) !== null, "altura em metros é recusada");
ok(validaEntrada({ ...base, gorduraPct: 70 }) !== null, "gordura 70% é recusada");

// Gargalo: consistência baixa vence
ok(maiorGargalo({ estruturado: "nao", progressao: "nao", proteina: "nao-acompanho", sono: "lt6", constancia: "baixa" }).titulo === "Consistência", "consistência baixa é o maior gargalo");
ok(maiorGargalo({ estruturado: "sim", progressao: "nao-acompanho", proteina: "acompanho", sono: "7a9", constancia: "alta" }).titulo === "Progressão", "sem acompanhar progressão → progressão");

console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
