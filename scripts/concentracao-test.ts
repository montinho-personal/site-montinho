/**
 * Conversor mg/mL e Seringa U-100 — a matemática e as barreiras.
 *   npx tsx scripts/concentracao-test.ts
 *
 * Dois tipos de proteção. A primeira é aritmética: 60 mg em 2,5 mL são
 * 24 mg/mL, a marca 10 de uma U-100 é 0,10 mL, e 0,10 mL dessa solução
 * contêm 2,4 mg. A segunda é de produto: o código NÃO pode ter a função que
 * recebe "quero X mg" e devolve uma marca de seringa, e a interface não pode
 * chamar marca de "UI do produto" nem quantidade contida de "dose".
 */
import { readFileSync } from "node:fs";
import {
  calcularConcentracao, conferirInstrucao, formatarConcentracao, formatarMg, formatarMl, lerMarca, lerNumero,
  marcaU100ParaMl, quantidadeNoVolume, tabelaU100, validarMarca, validarMg, validarMl, MARCAS_TABELA,
} from "../lib/concentracao/calculo";

let falhas = 0;
const ok = (nome: string, cond: boolean, detalhe = "") => {
  console.log(`  ${cond ? "ok    " : "FALHOU"}  ${nome}${cond || !detalhe ? "" : `\n           ${detalhe}`}`);
  if (!cond) falhas++;
};
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number | null, b: number, tol = 1e-9) => a != null && Math.abs(a - b) <= tol;

bloco("1. O EXEMPLO DO BRIEFING: 60 mg EM 2,5 mL");
{
  const c = calcularConcentracao(60, 2.5);
  ok("60 mg ÷ 2,5 mL = 24 mg/mL", perto(c, 24));
  ok("marca 10 da U-100 = 0,10 mL", perto(marcaU100ParaMl(10), 0.1));
  ok("24 mg/mL × 0,10 mL = 2,4 mg contidos", perto(quantidadeNoVolume(24, 0.1), 2.4));
  const l = lerMarca(24, 10)!;
  ok("lerMarca junta as três contas", l.marca === 10 && perto(l.volumeMl, 0.1) && perto(l.mg, 2.4));
}

bloco("2. A ESCALA U-100 (só nesse contexto)");
for (const [marca, ml] of [[1, 0.01], [5, 0.05], [10, 0.1], [20, 0.2], [30, 0.3], [40, 0.4], [50, 0.5], [100, 1]] as const) {
  ok(`marca ${marca} → ${ml} mL`, perto(marcaU100ParaMl(marca), ml));
}
ok("tabela educacional tem as marcas declaradas, sem linha destacada", tabelaU100(24).length === MARCAS_TABELA.length);
ok("tabela: marca 5 a 24 mg/mL contém 1,2 mg", perto(tabelaU100(24)[0].mg, 1.2));

bloco("3. ENTRADA EM PORTUGUÊS");
ok("60 lê 60", lerNumero("60") === 60);
ok("60,0 lê 60", lerNumero("60,0") === 60);
ok("2,5 lê 2.5", lerNumero("2,5") === 2.5);
ok("2.5 lê 2.5", lerNumero("2.5") === 2.5);
ok("' 2,5 ' com espaços lê 2.5", lerNumero(" 2,5 ") === 2.5);
ok(",5 lê 0.5", lerNumero(",5") === 0.5);
ok("zero não é valor", lerNumero("0") === null);
ok("negativo não é valor", lerNumero("-5") === null);
ok("texto não é valor", lerNumero("dez") === null);
ok("vazio não é valor", lerNumero("") === null && lerNumero(null) === null);
ok("1e309 (Infinity) não é valor", lerNumero("1e309") === null);
ok("NaN literal não é valor", lerNumero("NaN") === null);
ok("dois pontos decimais não é valor", lerNumero("2.5.1") === null);

bloco("4. VALIDAÇÃO COM MENSAGEM CERTA");
ok("mg vazio → 'vazio'", validarMg("").erro === "vazio");
ok("mg texto → 'invalido'", validarMg("abc").erro === "invalido");
ok("mg 0 → 'invalido' (zero não é quantidade)", validarMg("0").erro === "invalido");
ok("mg 1.000.000 → 'fora_do_limite'", validarMg("1000000").erro === "fora_do_limite");
ok("mL 0,005 → 'fora_do_limite'", validarMl("0,005").erro === "fora_do_limite");
ok("mL 2,5 → válido", validarMl("2,5").valor === 2.5 && validarMl("2,5").erro === null);
ok("marca 10 → válida", validarMarca("10").valor === 10);
ok("marca 10,5 → inválida (V1 pede marca cheia)", validarMarca("10,5").erro === "invalido");
ok("marca 0 → inválida", validarMarca("0").erro === "invalido");
ok("marca 101 → fora da escala", validarMarca("101").erro === "fora_do_limite");
ok("marca 100 → válida (o topo da escala)", validarMarca(100).valor === 100);

bloco("5. NUNCA NaN, Infinity OU undefined");
ok("concentração com mL zero → null", calcularConcentracao(60, 0) === null);
ok("concentração com mg negativo → null", calcularConcentracao(-1, 2.5) === null);
ok("concentração com NaN → null", calcularConcentracao(NaN, 2.5) === null);
ok("marca negativa → null", marcaU100ParaMl(-1) === null);
ok("quantidade com Infinity → null", quantidadeNoVolume(Infinity, 0.1) === null);
ok("formatar Infinity vira travessão, não 'Infinity'", formatarMg(Infinity) === "—" && formatarMl(NaN) === "—");

bloco("6. FORMATAÇÃO EM PORTUGUÊS");
ok("2,4 mg", formatarMg(2.4) === "2,4");
ok("0,125 mg mantém três casas", formatarMg(0.125) === "0,125");
ok("24 mg/mL sem zeros de enfeite", formatarConcentracao(24) === "24");
ok("0,10 mL sempre com duas casas", formatarMl(0.1) === "0,10");
ok("1,00 mL", formatarMl(1) === "1,00");
ok("ponto flutuante não vaza: 0,3 × 3", formatarMg(quantidadeNoVolume(3, 0.3)!) === "0,9");

bloco("7. CONFERIR UMA INSTRUÇÃO (sem corrigir a dose)");
{
  const c = 24;
  ok("2,4 mg na marca 10 → compatível", conferirInstrucao(c, 2.4, 10).status === "compativel");
  ok("2,40 mg (arredondado) → compatível", conferirInstrucao(c, 2.4000001, 10).status === "compativel");
  ok("2,5 mg na marca 10 → não corresponde (4%)", conferirInstrucao(c, 2.5, 10).status === "nao_corresponde");
  ok("24 mg na marca 10 → não corresponde (erro de 10×)", conferirInstrucao(c, 24, 10).status === "nao_corresponde");
  ok("0,24 mg na marca 10 → não corresponde (erro de 10× para baixo)", conferirInstrucao(c, 0.24, 10).status === "nao_corresponde");
  ok("2,4 mg na marca 100 → não corresponde", conferirInstrucao(c, 2.4, 100).status === "nao_corresponde");
  const r = conferirInstrucao(c, 2.5, 10);
  ok("o resultado mostra o que a marca contém, para a pessoa ver a diferença", r.status === "nao_corresponde" && perto(r.mgContido, 2.4));
  ok("o resultado NÃO traz uma marca sugerida", !("marcaSugerida" in r) && !("marcaCorreta" in r) && !("correcao" in r));
  ok("mg inválido → 'invalido'", conferirInstrucao(c, 0, 10).status === "invalido");
  ok("quantidade minúscula usa o piso absoluto: 0,012 vs 0,01 mg → compatível", conferirInstrucao(1, 0.012, 1).status === "compativel");
}

bloco("8. AS BARREIRAS ESTÃO NO CÓDIGO, NÃO SÓ NA INTENÇÃO");
{
  const lib = readFileSync("lib/concentracao/calculo.ts", "utf8");
  const semComentarios = lib.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
  ok("nenhuma função de dose recomendada", !/calculateRecommendedDose|doseRecomendada|calcularDose\b/.test(semComentarios));
  ok("nenhum solver reverso mg → marca", !/targetMgToInjectionUnits|mgParaMarca|marcaPara(Mg|Dose)|unidadesPara/.test(semComentarios));
  ok("nenhuma função devolve marca a partir de mg desejado", !/function\s+\w*(marca|unidade)\w*\s*\([^)]*mg\w*Desejad/i.test(semComentarios));

  const comp = ["components/concentracao/ConversorConcentracao.tsx", "components/concentracao/SeringaU100.tsx", "app/ferramentas/conversor-mg-ml-u100/page.tsx"]
    .map((f) => { try { return readFileSync(f, "utf8"); } catch { return ""; } })
    .join("\n");
  if (comp.trim().length > 0) {
    const semC = comp.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
    ok("a interface nunca diz 'UI do produto' nem 'UI do medicamento'", !/UI do (produto|medicamento|composto)/i.test(semC));
    ok("a interface nunca diz 'sua dose'", !/sua dose|dose de \d|dose certa|dose ideal|dose recomendada|dose segura/i.test(semC));
    ok("a interface nunca diz 'aplique' / 'injete' como instrução", !/\b(aplique|injete)\b/i.test(semC));
    ok("nenhum campo 'quero tomar'", !/quero tomar|quantas unidades coloco/i.test(semC));
    ok("nenhum nome de substância como preset", !/tirzepatid|retatrutid|semaglutid|BPC|TB-500|hormônio do crescimento/i.test(semC));
    ok("nenhuma cor verde significando 'pode aplicar'", !/pode aplicar|seguro aplicar|verde/i.test(semC));
    ok("o aviso de segurança existe", /não determina quanto você deve injetar/i.test(semC));
    ok("a distinção marca × UI está escrita", /não significa que o outro composto/i.test(semC) || /não transforma/i.test(semC));
    ok("a trava de insulina existe", /não calcula doses de insulina/i.test(semC));
    ok("nenhum evento carrega valor: trackEvent sem mg/ml/marca nos params", !/trackEvent\([^)]*\b(mg|ml|marca|concentracao)\s*:/i.test(semC));
  }
}

console.log("\n" + "=".repeat(64) + `\n${falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} FALHA(S)`}\n` + "=".repeat(64));
if (falhas > 0) process.exit(1);
