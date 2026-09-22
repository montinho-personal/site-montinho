import { readFileSync } from "fs";
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
/**
 * O motor da Calculadora de Potencial Natural.
 *   npx tsx scripts/potencial-test.ts
 *
 * Além da conta, este teste protege o que o tema exige: que a página trate
 * o FFMI de 25 como referência e não como limite, que a base feminina seja
 * declarada como diferente, e que estar na referência nunca vire conselho
 * de parar de treinar ou de procurar atalho.
 */
import {
  ARTIGOS_COM_CALCULADORA_POTENCIAL, FONTES_POTENCIAL, HORIZONTE_MESES, NIVEIS, REFERENCIA_FFMI,
  alturaValida, calcula, ffmi, ffmiNormalizado, formataKg, formataMeses, gorduraValida, leitura,
  massaMagra, massaMagraDeFFMI, nivel, parseAltura, pesoValido, tabelaPorAltura,
} from "../lib/potencial";
import { ARTIGOS_COM_CALCULADORA as ARTIGOS_PROTEINA } from "../lib/proteina";
import { ARTIGOS_COM_CALCULADORA_VOLUME } from "../lib/treino/volume";
import { ARTIGOS_COM_CALCULADORA_TDEE } from "../lib/tdee";
import { ARTIGOS_COM_CALCULADORA_MACROS } from "../lib/macros";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. A CONTA DO FFMI");
ok("massa magra é peso menos gordura", perto(massaMagra(80, 15), 68));
ok("FFMI é massa magra sobre altura²", perto(ffmi(68, 1.8), 68 / 3.24));
/* O caso de referência: 1,80 m com 81 kg de massa magra dá exatamente 25. */
ok("1,80 m com 81 kg magros = FFMI 25", perto(ffmiNormalizado(81, 1.8), 25, 0.001), String(ffmiNormalizado(81, 1.8)));
ok("a 1,80 m a normalização não muda nada", perto(ffmiNormalizado(70, 1.8), ffmi(70, 1.8), 0.0001));
/* Quem é mais baixo tem FFMI bruto inflado; a correção é o que permite comparar. */
ok("abaixo de 1,80 m a normalização soma", ffmiNormalizado(60, 1.65) > ffmi(60, 1.65));
ok("acima de 1,80 m a normalização subtrai", ffmiNormalizado(90, 1.9) < ffmi(90, 1.9));
ok("massaMagraDeFFMI é o inverso de ffmiNormalizado",
  perto(ffmiNormalizado(massaMagraDeFFMI(25, 1.72), 1.72), 25, 0.0001));
for (const a of [1.6, 1.75, 1.9]) {
  ok(`a ${a} m, a referência de 25 devolve massa magra coerente`, perto(ffmiNormalizado(massaMagraDeFFMI(25, a), a), 25, 0.0001));
}

bloco("2. AS REFERÊNCIAS E OS NÍVEIS");
ok("homens: 25 (Kouri)", REFERENCIA_FFMI.homem === 25);
ok("mulheres: 22, de outra literatura", REFERENCIA_FFMI.mulher === 22);
ok("a feminina é menor que a masculina", REFERENCIA_FFMI.mulher < REFERENCIA_FFMI.homem);
ok("três níveis, com taxas decrescentes",
  NIVEIS.length === 3 && NIVEIS.every((n, i) => i === 0 || n.taxa.max < NIVEIS[i - 1].taxa.max));
ok("iniciante: 1% a 1,5% ao mês", nivel("iniciante").taxa.min === 0.01 && nivel("iniciante").taxa.max === 0.015);
ok("intermediário: 0,5% a 1%", nivel("intermediario").taxa.min === 0.005 && nivel("intermediario").taxa.max === 0.01);
ok("avançado: 0,25% a 0,5%", nivel("avancado").taxa.min === 0.0025 && nivel("avancado").taxa.max === 0.005);

bloco("3. O RESULTADO");
const r = calcula(1.78, 75, 15, "homem", "intermediario");
ok("massa magra de 63,75 kg", perto(r.massaMagra, 63.75));
ok("FFMI normalizado ≈ 20,2", perto(r.ffmiNormalizado, 20.2, 0.05), String(r.ffmiNormalizado));
ok("falta massa magra até a referência", r.faltaAteReferencia > 0 && !r.naReferencia);
ok("o peso na referência é maior que o atual", r.pesoNaReferencia > r.pesoKg);
ok("o ganho mensal é percentual do peso", perto(r.ganhoMensal.max, 75 * 0.01));
ok("mais tempo no pior ritmo", r.mesesAteReferencia!.max > r.mesesAteReferencia!.min);
{
  const alto = calcula(1.8, 95, 10, "homem", "avancado");
  ok("quem passou da referência é reconhecido", alto.naReferencia && alto.mesesAteReferencia === null);
  ok("e a leitura reflete isso", leitura(alto) === "na-referencia");
}
ok("leitura varia com a distância",
  leitura(calcula(1.7, 60, 25, "homem", "iniciante")) === "inicio"
    && leitura(calcula(1.78, 75, 15, "homem", "intermediario")) === "caminho");
/* A taxa cai conforme a pessoa avança, então projeções muito longas não valem. */
ok("acima de cinco anos a projeção é marcada como longe", HORIZONTE_MESES === 60
  && calcula(1.9, 55, 10, "homem", "avancado").longe === true);
ok("projeção curta não é marcada", calcula(1.8, 88, 12, "homem", "avancado").longe === false);

bloco("4. ENTRADAS");
ok("parseAltura aceita metros e centímetros", parseAltura("1,75") === 1.75 && parseAltura("175") === 1.75);
ok("parseAltura recusa lixo", parseAltura("abc") === null);
ok("altura fora da faixa", !alturaValida(1.2) && !alturaValida(2.4) && alturaValida(1.75));
ok("peso fora da faixa", !pesoValido(20) && !pesoValido(300) && pesoValido(75));
ok("gordura fora da faixa", !gorduraValida(2) && !gorduraValida(70) && gorduraValida(15));

bloco("5. A TABELA POR ALTURA");
const th = tabelaPorAltura("homem");
ok("uma linha por altura, crescente", th.every((l, i) => i === 0 || l.massaMagra > th[i - 1].massaMagra));
ok("toda linha corresponde à referência", th.every((l) => perto(ffmiNormalizado(l.massaMagra, l.altura), 25, 0.001)));
ok("o peso é maior que a massa magra", th.every((l) => l.peso > l.massaMagra));
ok("a tabela feminina usa a referência feminina",
  tabelaPorAltura("mulher").every((l) => perto(ffmiNormalizado(l.massaMagra, l.altura), 22, 0.001)));

bloco("6. O QUE A PÁGINA PRECISA DIZER");
const lib = readFileSync("lib/potencial.ts", "utf8");
const comp = readFileSync("components/potencial/CalculadoraPotencial.tsx", "utf8");
const tool = readFileSync("app/ferramentas/potencial-natural/page.tsx", "utf8");
const todos = lib + comp + tool;
ok("diz que a referência não é uma parede", /não é uma parede/i.test(todos));
ok("cita o estudo pelo nome e a amostra", /Kouri/.test(todos) && /157/.test(todos));
ok("diz que os Mr. America pré-esteroide passavam do número", /25,4/.test(todos));
ok("declara que a base feminina é diferente", /base.{0,20}diferente|outra literatura/i.test(todos));
ok("avisa da fragilidade do percentual de gordura", /entrada mais frágil/i.test(todos) && /bioimpedância/i.test(todos));
ok("diz que o tempo projetado é piso, não previsão", /piso, não uma previsão|piso, não de previsão/i.test(todos));
/* Nunca vira conselho de parar nem de usar alguma coisa. */
ok("não sugere parar de treinar", !/(pare|deve parar) de treinar/i.test(todos));
ok("diz explicitamente que não é motivo para atalho", /não é motivo para parar|nem para procurar atalho/i.test(todos));

bloco("7. REGISTROS E PÁGINA");
const slugs = new Set(blogPosts.map((p) => p.slug));
ok("todo artigo do registro existe", ARTIGOS_COM_CALCULADORA_POTENCIAL.every((s) => slugs.has(s)), ARTIGOS_COM_CALCULADORA_POTENCIAL.filter((s) => !slugs.has(s)).join(", "));
ok("o teto de oito é respeitado", ARTIGOS_COM_CALCULADORA_POTENCIAL.length <= 8);
const outros = new Set([...ARTIGOS_PROTEINA, ...ARTIGOS_COM_CALCULADORA_VOLUME, ...ARTIGOS_COM_CALCULADORA_TDEE, ...ARTIGOS_COM_CALCULADORA_MACROS]);
ok("nenhum artigo daqui pertence a outra ferramenta", ARTIGOS_COM_CALCULADORA_POTENCIAL.every((s) => !outros.has(s)), ARTIGOS_COM_CALCULADORA_POTENCIAL.filter((s) => outros.has(s)).join(", "));
ok("o artigo dono da pergunta está no registro", ARTIGOS_COM_CALCULADORA_POTENCIAL.includes("hipertrofia-natural-limite"));
for (const s of ARTIGOS_COM_CALCULADORA_POTENCIAL) {
  const p = blogPosts.find((x) => x.slug === s)!;
  ok(`${s}: o corte editorial existe`, splitAtPrimeiraSecao(marked(p.content) as string) !== null);
}
ok("canônica e pós-resultado", CANONICA.potencial?.href === ROTA.potencial && NOME.potencial === "Calculadora de Potencial Natural");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_POTENCIAL\.includes\(post\.slug\)/.test(blog) && /<CalculadoraPotencial placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /potencial-natural/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /potencial-natural/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon/.test(comp));
ok("o evento leva a leitura, nunca os dados do corpo",
  /reading: lei, level: nivelId/.test(comp) && !/trackEvent\([^)]*(peso|altura|gordura)/.test(comp));
ok("CTA centralizado e por leitura", /<PosResultado[\s\S]*ferramenta="potencial"/.test(comp) && /categoria=\{lei\}/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("um H1", (tool.match(/<h1[\s>]/g) ?? []).length === 1);
ok("duas tabelas em HTML", (tool.match(/<table/g) ?? []).length >= 2);
ok("três fontes com URL", FONTES_POTENCIAL.length === 3 && FONTES_POTENCIAL.every((f) => /^https?:\/\//.test(f.url)));
ok("formatação", formataKg(63.749) === "63,7 kg" && formataMeses(14) === "1 ano e 2 meses" && formataMeses(12) === "1 ano");

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
