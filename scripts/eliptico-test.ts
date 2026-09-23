import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias do Elíptico.
 *   npx tsx scripts/eliptico-test.ts
 */
import {
  ARTIGOS_COM_CALCULADORA_ELIPTICO, ESFORCOS, VISOR_TOLERANCIA_PCT, comparaComEsteira, comparaVisor, deKcal, deTempo,
  esforco, fraseContexto, kcalLiquida, leituraVisor, tabelaPorPeso, tabelaPorTempo,
} from "../lib/eliptico";
import { ARTIGOS_COM_CALCULADORA_FC, ARTIGOS_COM_LINK_FC } from "../lib/fc";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS ESFORÇOS DO COMPÊNDIO");
/* Trava dos METs: mudar em lib/eliptico.ts exige mudar aqui, conferindo a fonte. */
ok("dois esforços, sem 'leve' inventado", ESFORCOS.length === 2 && !ESFORCOS.some((e) => /leve/i.test(e.nome)));
ok("moderado = 6,0 METs", esforco("moderado").met === 6.0);
ok("vigoroso = 9,0 METs", esforco("vigoroso").met === 9.0);
ok("vigoroso > moderado", esforco("vigoroso").met > esforco("moderado").met);
ok("todo esforço diz de onde veio", ESFORCOS.every((e) => /Compêndio/.test(e.origem)));

bloco("2. A CONTA E OS MODOS");
const r20 = deTempo(20, 70, 6);
ok("20 min, 70 kg, 6 METs = 147 kcal", perto(r20.kcal, 147));
ok("ida e volta concordam", perto(deKcal(r20.kcal, 70, 6).minutos, 20));
ok("proporcional ao peso", perto(deTempo(20, 140, 6).kcal, r20.kcal * 2));
ok("30 min moderado, 70 kg ≈ 220 kcal (bate com a tabela do artigo)", Math.abs(deTempo(30, 70, esforco("moderado").met).kcal - 220) < 1);
ok("líquido desconta 1 MET e é positivo", perto(kcalLiquida(r20, 70), r20.kcal - 1.225 * 20) && kcalLiquida(r20, 70) > 0);
ok("a frase mantém o decimal do peso e não promete quilo",
  /82,5 kg/.test(fraseContexto(82.5, r20, "Moderado")) && !/perde|emagrec/i.test(fraseContexto(70, r20, "Moderado")));

bloco("3. O VISOR");
ok("visor 20% acima é 'acima'", leituraVisor(comparaVisor(120, 100)) === "acima");
ok("visor 20% abaixo é 'abaixo'", leituraVisor(comparaVisor(80, 100)) === "abaixo");
ok(`dentro de ${VISOR_TOLERANCIA_PCT}% é 'parecido'`, leituraVisor(comparaVisor(110, 100)) === "parecido");
ok("diferença percentual correta", perto(comparaVisor(150, 100), 50));

bloco("3b. O QUE A PÁGINA E O COMPONENTE PROMETEM POR ESCRITO");
{
  const comp = readFileSync("components/eliptico/CalculadoraEliptico.tsx", "utf8");
  /* A tabela do artigo tem uma faixa "leve"; o Compêndio não. Sem esta frase,
     quem vem do artigo procura um botão que não existe. */
  ok("o componente explica por que não há esforço leve", /dois únicos esforços medidos/.test(comp));
  ok("o campo do visor avisa quando o número é inválido", /visor-ajuda/.test(comp) && /!visorValido\(visor\)/.test(comp));
  const tool = readFileSync("app/ferramentas/calculadora-calorias-eliptico/page.tsx", "utf8");
  /* A comparação com a esteira sai do motor, não de adjetivo escrito à mão. */
  ok("o FAQ da comparação usa os números do motor", /CMP\.find/.test(tool) && !/alcança ou passa/.test(tool));
}

bloco("4. COMPARAÇÃO E TABELAS");
const cmp = comparaComEsteira(30, 70);
ok("compara com caminhada e esteira inclinada", cmp.some((l) => /Caminhada/.test(l.nome)) && cmp.some((l) => /inclinação/.test(l.nome)));
ok("ordenada do maior para o menor", cmp.every((l, i) => i === 0 || l.kcal <= cmp[i - 1].kcal));
/* O que o FAQ afirma: a esteira a 10% passa o moderado e fica abaixo do vigoroso. */
{
  const incl = cmp.find((l) => /inclinação/.test(l.nome))!.kcal;
  const mod = cmp.find((l) => l.id === "eliptico-moderado")!.kcal;
  const vig = cmp.find((l) => l.id === "eliptico-vigoroso")!.kcal;
  ok("a esteira a 10% passa o elíptico moderado e fica abaixo do vigoroso", incl > mod && incl < vig);
}
ok("tabela por peso cresce", tabelaPorPeso(20).every((l, i, a) => i === 0 || l.moderado > a[i - 1].moderado));
ok("vigoroso > moderado em toda linha", tabelaPorTempo(70).every((l) => l.vigoroso > l.moderado));

bloco("5. REGISTROS E PÁGINA");
const slugs = new Set(blogPosts.map((p) => p.slug));
ok("artigo do registro existe", ARTIGOS_COM_CALCULADORA_ELIPTICO.every((s) => slugs.has(s)));
ok("eliptico-emagrece saiu da FC (uma ferramenta por artigo)",
  !ARTIGOS_COM_LINK_FC.includes("eliptico-emagrece") && !ARTIGOS_COM_CALCULADORA_FC.includes("eliptico-emagrece"));
ok("canônica e pós-resultado", CANONICA.eliptico?.href === ROTA.eliptico && NOME.eliptico === "Calculadora de Calorias do Elíptico");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_ELIPTICO\.includes\(post\.slug\)/.test(blog) && /<CalculadoraEliptico placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-eliptico/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-calorias-eliptico/.test(readFileSync("app/sitemap.ts", "utf8")));
const comp = readFileSync("components/eliptico/CalculadoraEliptico.tsx", "utf8");
ok("sem chamada de rede", !/fetch\(|sendBeacon/.test(comp));
ok("CTA centralizado", /<PosResultado[\s\S]*ferramenta="eliptico"/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
const tool = readFileSync("app/ferramentas/calculadora-calorias-eliptico/page.tsx", "utf8");
ok("um H1", (tool.match(/<h1[\s>]/g) ?? []).length === 1);
ok("três tabelas em HTML", (tool.match(/<table/g) ?? []).length >= 3);
ok("simulação de 1 kg com aviso", /NÃO significa/.test(tool));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
