/**
 * Calculadora de Peso da Classic Physique — tabela e fronteiras.
 *   npx tsx scripts/classic-physique-test.ts
 */
import { FAIXAS, calcula, faixaPorCm, faixaPorPolegadas, fraseDiferenca, parseNumero, validaAlturaCm, RAMON } from "../lib/classic-physique";

let falhas = 0;
const ok = (n: string, c: boolean, d: unknown = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${JSON.stringify(d)}`); } else console.log(`  ok      ${n}`); };

// A tabela publicada no prompt (cm → kg), conferida contra a oficial em polegadas/libras.
const ESPERADO: [number | null, number][] = [
  [162.6, 80.3], [165.1, 82.6], [167.6, 84.8], [170.2, 87.1], [172.7, 89.4], [175.3, 92.5], [177.8, 96.2],
  [180.3, 99.3], [182.9, 103.0], [185.4, 106.1], [188.0, 109.8], [190.5, 112.9], [193.0, 116.1],
  [195.6, 119.3], [198.1, 122.5], [200.7, 125.6], [null, 128.8],
];
ok("17 faixas", FAIXAS.length === 17);
ESPERADO.forEach(([cm, kg], i) => ok(`faixa ${i + 1}: ${cm ?? "acima"} → ${kg} kg`, FAIXAS[i].cm === cm && FAIXAS[i].kg === kg, FAIXAS[i]));

console.log("\nFronteiras (até e incluindo)");
const fronteira: [number, number][] = [
  [162.6, 80.3], [162.7, 82.6], [165.1, 82.6], [165.2, 84.8], [170.2, 87.1], [170.3, 89.4], [175.3, 92.5], [175.4, 96.2],
  [177.8, 96.2], [177.9, 99.3], [180.0, 99.3], [180.3, 99.3], [180.4, 103.0], [182.9, 103.0], [183.0, 106.1],
  [185.4, 106.1], [188.0, 109.8], [190.5, 112.9], [193.0, 116.1], [195.6, 119.3], [198.1, 122.5], [200.7, 125.6], [201.0, 128.8],
];
for (const [cm, kg] of fronteira) ok(`${cm} cm → ${kg} kg`, faixaPorCm(cm).kg === kg, faixaPorCm(cm));
ok("181 cm (Ramon) → 103,0 kg", faixaPorCm(RAMON.alturaCm).kg === 103.0);
ok("180,35 cm não arredonda para baixo → 103,0", faixaPorCm(180.35).kg === 103.0);

console.log("\nPés e polegadas (exato)");
ok("5'11\" → 99,3 / 219 lb", faixaPorPolegadas(71).kg === 99.3 && faixaPorPolegadas(71).libras === 219);
ok("5'11,5\" → 103,0", faixaPorPolegadas(71.5).kg === 103.0);
ok("6'0\" → 103,0 / 227 lb", faixaPorPolegadas(72).libras === 227);
ok("6'8\" → última faixa", faixaPorPolegadas(80).kg === 128.8);
ok("5'4\" → 80,3", faixaPorPolegadas(64).kg === 80.3);

console.log("\nEntrada");
ok("vírgula decimal", parseNumero("175,5") === 175.5);
ok("ponto decimal", parseNumero("175.5") === 175.5);
ok("texto → null", parseNumero("abc") === null && parseNumero("1,8,0") === null);
ok("vazio", "erro" in validaAlturaCm("") && (validaAlturaCm("") as { erro: string }).erro === "vazio");
ok("negativo", (validaAlturaCm("-180") as { erro: string }).erro === "invalido");
ok("zero", (validaAlturaCm("0") as { erro: string }).erro === "invalido");
ok("1,80 em campo de cm pede confirmação (metros)", (validaAlturaCm("1,80") as { erro: string }).erro === "metros");
ok("fora do intervalo", (validaAlturaCm("90") as { erro: string }).erro === "fora");
ok("180 válido", (validaAlturaCm("180") as { cm: number }).cm === 180);

console.log("\nResultado e frases");
const r = calcula(180, 85);
ok("180 cm + 85 kg → 14,3 abaixo", r.diferencaKg === 14.3 && fraseDiferenca(r.diferencaKg!) === "Seu peso atual está 14,3 kg abaixo do teto regulamentar dessa faixa.");
ok("acima do teto", fraseDiferenca(calcula(180, 101).diferencaKg!).includes("1,7 kg acima do limite"));
ok("vizinhas: anterior, atual, seguinte", r.vizinhas.map((f) => f.kg).join() === "96.2,99.3,103");
ok("primeira faixa sem anterior", calcula(150, null).vizinhas.length === 2);
const proibido = /peso ideal|recomendad|pode ganhar|precisa ganhar|deveria/i;
ok("nenhuma frase usa 'peso ideal / pode ganhar'", ![fraseDiferenca(5), fraseDiferenca(-5), fraseDiferenca(0)].some((f) => proibido.test(f)));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
