/**
 * Previsor da São Silvestre (lib/sao-silvestre.ts).
 *   npx tsx scripts/sao-silvestre-test.ts
 */
import {
  ARTIGOS_COM_LINK_PREVISOR_SS, ARTIGOS_COM_PREVISOR_SS, DISTANCIA_PROVA_KM, lerTempo, nivel, prever, riegel, semanasAteAProva, validaReferencia,
} from "../lib/sao-silvestre";

let falhas = 0;
const ok = (c: boolean, m: string) => { if (!c) { falhas++; console.log("FALHOU:", m); } else console.log("ok:", m); };
const perto = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

// Riegel: 10 km em 50:00 → 15 km ≈ 77:05 (50 × 1,5^1,06 = 76,7 min)
ok(perto(riegel(3000, 10, 15), 3000 * Math.pow(1.5, 1.06), 0.001), "Riegel aplica o expoente 1,06");
ok(riegel(3000, 10, 10) === 3000, "mesma distância, mesmo tempo");

// Leitura de tempo
ok(lerTempo("25:30") === 1530, "mm:ss");
ok(lerTempo("1:05:30") === 3930, "h:mm:ss");
ok(lerTempo("25:75") === null, "segundos ≥ 60 são inválidos");
ok(lerTempo("abc") === null && lerTempo("25") === null, "texto e número solto são inválidos");

// Sanidade
ok(validaReferencia(600, 5) !== null, "5 km em 10 min é recusado");
ok(validaReferencia(5400, 5) !== null, "5 km em 90 min vira caminhada");
ok(validaReferencia(1800, 5) === null, "5 km em 30 min é aceito");

// Previsão
const p = prever(3000, "10k");
ok(p.faixa.min > p.planoSeg && p.faixa.max > p.faixa.min, "a margem do percurso só acrescenta tempo");
ok(perto(p.paceFaixa.min * DISTANCIA_PROVA_KM, p.faixa.min, 0.001), "pace = tempo / 15 km");
ok(p.cenarios[0].faixa.min === p.faixa.min, "cenário 'manter' é a própria previsão");
ok(p.cenarios[2].faixa.max < p.cenarios[1].faixa.max && p.cenarios[1].faixa.max < p.cenarios[0].faixa.max, "cenários melhores dão tempos menores");
ok(prever(1500, "5k").faixa.min < prever(1800, "5k").faixa.min, "referência mais rápida, previsão mais rápida");
ok(nivel(50 * 60) === "elite" && nivel(80 * 60) === "regular" && nivel(130 * 60) === "caminhada", "faixas de nível");

// Calendário
ok(semanasAteAProva(Date.parse("2026-09-30T10:00:00-03:00")) === 13, "da abertura das inscrições até a prova: 13 semanas");
ok(semanasAteAProva(Date.parse("2027-01-02T00:00:00-03:00")) === 0, "depois da prova: 0");

// Registro
ok(ARTIGOS_COM_LINK_PREVISOR_SS.length <= 8, "registro de link com teto de oito");
ok(ARTIGOS_COM_PREVISOR_SS.length <= 8, "registro do embed com teto de oito");

console.log(falhas ? `\n${falhas} FALHA(S)` : "\nTODOS OS TESTES PASSARAM");
process.exit(falhas ? 1 : 0);
