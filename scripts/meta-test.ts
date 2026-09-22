import { readFileSync } from "fs";
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
/**
 * O motor da Calculadora de Meta de Peso por Data.
 *   npx tsx scripts/meta-test.ts
 */
import {
  ARTIGOS_COM_CALCULADORA_META, SEMANAS_MAX, SEMANAS_MIN, TAXA_MAX, TAXA_MIN,
  avalia, calcula, fimDoAno, formataFaixaKg, formataKg, formataSemanas, paraISO, parseData,
  pesoValido, semanasAte, semanasPara, semanasValidas, tabelaPorPeso, tabelaPorPrazo,
} from "../lib/meta";
import { ARTIGOS_COM_CALCULADORA_DEFICIT } from "../lib/calorias";
import { ARTIGOS_COM_CALCULADORA_TDEE } from "../lib/tdee";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. A FAIXA E A CONTA");
ok("a faixa é de 0,5% a 1% do peso por semana", TAXA_MIN === 0.005 && TAXA_MAX === 0.01);
const r = calcula(90, 12);
ok("12 semanas, 90 kg: 5,2 a 10,2 kg", perto(r.perda.min, 5.2, 0.1) && perto(r.perda.max, 10.2, 0.1), formataFaixaKg(r.perda));
/*
 * Aplicar semana a semana, e não multiplicar pelo peso inicial: como o peso
 * cai, a soma linear superestima. Esta linha é a que pega a regressão.
 */
ok("a taxa é composta, não linear", r.perda.max < 90 * TAXA_MAX * 12, `${r.perda.max} vs ${90 * TAXA_MAX * 12}`);
ok("perda maior deixa peso menor", r.pesoFinal.min < r.pesoFinal.max && perto(r.pesoFinal.min, 90 - r.perda.max));
ok("o percentual bate com os quilos", perto(r.perdaPct.max, (r.perda.max / 90) * 100, 0.001));
ok("por semana é a perda dividida pelo prazo", perto(r.porSemana.max, r.perda.max / 12, 0.0001));
ok("o déficit cresce com a perda", r.deficitDiario.max > r.deficitDiario.min && r.deficitDiario.min > 0);
ok("mais tempo, mais perda", calcula(90, 24).perda.max > calcula(90, 12).perda.max);
ok("mais peso, mais perda possível", calcula(120, 12).perda.max > calcula(60, 12).perda.max);
ok("ninguém perde mais que o próprio peso", calcula(90, SEMANAS_MAX).perda.max < 90);

bloco("2. CONCORDÂNCIA COM O ARTIGO");
/*
 * O artigo publica "0,5 a 1 kg por semana", "déficit de 350 a 750 kcal
 * diários" e "5 a 8 kg em 10 a 12 semanas". A calculadora tem de caber
 * nisso, senão o site se contradiz na mesma página.
 */
{
  const a = calcula(70, 11);
  ok("70 kg em 11 semanas cabe nos '5 a 8 kg' do artigo", a.perda.min <= 8 && a.perda.max >= 5, formataFaixaKg(a.perda));
  ok("o déficit de 70 kg cabe nos '350 a 750 kcal' do artigo",
    a.deficitDiario.min >= 300 && a.deficitDiario.max <= 800,
    `${Math.round(a.deficitDiario.min)}-${Math.round(a.deficitDiario.max)}`);
  const b = calcula(90, 11);
  ok("90 kg em 11 semanas também cabe", b.perda.min <= 8 && b.perda.max >= 5, formataFaixaKg(b.perda));
  ok("a ponta alta de 70 a 100 kg fica entre 0,5 e 1 kg por semana",
    [70, 80, 90, 100].every((p) => { const x = calcula(p, 12).porSemana.max; return x >= 0.45 && x <= 1.05; }));
}

bloco("3. O VEREDITO DA META");
ok("meta dentro da faixa cabe", avalia(r, 5) === "cabe");
ok("a ponta exata da faixa cabe", avalia(r, r.perda.max) === "cabe");
ok("um pouco acima fica apertado", avalia(r, r.perda.max * 1.2) === "apertado");
ok("muito acima não cabe", avalia(r, r.perda.max * 2) === "nao-cabe");
ok("o limite do apertado é uma vez e meia", avalia(r, r.perda.max * 1.5) === "apertado" && avalia(r, r.perda.max * 1.51) === "nao-cabe");
ok("semanasPara devolve prazo maior para meta maior", semanasPara(90, 15) > semanasPara(90, 5));
ok("semanasPara é coerente com a faixa", calcula(90, semanasPara(90, 10)).perda.max >= 10);

bloco("4. DATAS E LIMITES");
{
  const hoje = new Date(2026, 8, 22);
  ok("fim do ano é 31 de dezembro", paraISO(fimDoAno(hoje)) === "2026-12-31");
  ok("22/09 a 31/12 dá 14 semanas", semanasAte(hoje, fimDoAno(hoje)) === 14);
  ok("data no passado dá semanas negativas", semanasAte(hoje, new Date(2026, 0, 1)) < 0);
  ok("parseData não desloca por fuso", paraISO(parseData("2026-12-31")!) === "2026-12-31");
  ok("parseData recusa lixo", parseData("31/12/2026") === null && parseData("") === null);
}
ok("prazo curto demais é recusado", !semanasValidas(SEMANAS_MIN - 1) && semanasValidas(SEMANAS_MIN));
ok("prazo longo demais é recusado", !semanasValidas(SEMANAS_MAX + 1) && semanasValidas(SEMANAS_MAX));
ok("peso fora da faixa é recusado", !pesoValido(20) && !pesoValido(400) && pesoValido(90));

bloco("5. FORMATAÇÃO E TABELAS");
ok("faixa com uma casa dos dois lados", formataFaixaKg({ min: 6, max: 7.5 }) === "6,0 a 7,5 kg");
ok("kg com uma casa", formataKg(5.24) === "5,2 kg");
ok("semana no singular", formataSemanas(1) === "1 semana" && formataSemanas(12) === "12 semanas");
ok("tabela por prazo cresce", tabelaPorPrazo(90).every((l, i, a) => i === 0 || l.perda.max > a[i - 1].perda.max));
ok("tabela por peso cresce", tabelaPorPeso(12).every((l, i, a) => i === 0 || l.perda.max > a[i - 1].perda.max));

bloco("6. REGISTROS E PÁGINA");
const slugs = new Set(blogPosts.map((p) => p.slug));
ok("todo artigo do registro existe", ARTIGOS_COM_CALCULADORA_META.every((s) => slugs.has(s)), ARTIGOS_COM_CALCULADORA_META.filter((s) => !slugs.has(s)).join(", "));
ok("o teto de oito é respeitado", ARTIGOS_COM_CALCULADORA_META.length <= 8);
const outros = new Set([...ARTIGOS_COM_CALCULADORA_DEFICIT, ...ARTIGOS_COM_CALCULADORA_TDEE]);
ok("nenhum artigo daqui pertence ao déficit ou ao TDEE", ARTIGOS_COM_CALCULADORA_META.every((s) => !outros.has(s)), ARTIGOS_COM_CALCULADORA_META.filter((s) => outros.has(s)).join(", "));
ok("o artigo que é dono da pergunta está no registro", ARTIGOS_COM_CALCULADORA_META.includes("quantos-quilos-perder-ate-fim-do-ano"));
for (const s of ARTIGOS_COM_CALCULADORA_META) {
  const p = blogPosts.find((x) => x.slug === s)!;
  ok(`${s}: o corte editorial existe`, splitAtPrimeiraSecao(marked(p.content) as string) !== null);
}
ok("canônica e pós-resultado", CANONICA.meta?.href === ROTA.meta && NOME.meta === "Calculadora de Meta de Peso");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_META\.includes\(post\.slug\)/.test(blog) && /<CalculadoraMeta placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /meta-de-peso/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /meta-de-peso/.test(readFileSync("app/sitemap.ts", "utf8")));
const comp = readFileSync("components/meta/CalculadoraMeta.tsx", "utf8");
ok("sem chamada de rede", !/fetch\(|sendBeacon/.test(comp));
ok("CTA centralizado", /<PosResultado[\s\S]*ferramenta="meta"/.test(comp));
ok("o CTA muda com o veredito", /categoria=\{veredito \?\? "padrao"\}/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("o evento leva o veredito, nunca o peso", /verdict: veredito \?\? "sem_meta"/.test(comp) && !/trackEvent\([^)]*peso/.test(comp));
/* A data vem do cliente: no HTML estático, "hoje" seria a data do build. */
ok("a data de hoje é calculada no cliente", /useEffect\([\s\S]{0,400}new Date\(\)/.test(comp));
ok("a data do fim do ano já vem preenchida", /paraISO\(fimDoAno\(d\)\)/.test(comp));
const tool = readFileSync("app/ferramentas/meta-de-peso/page.tsx", "utf8");
ok("um H1", (tool.match(/<h1[\s>]/g) ?? []).length === 1);
ok("duas tabelas em HTML", (tool.match(/<table/g) ?? []).length >= 2);
ok("manda para o déficit, que é o passo seguinte", /calculadora-deficit-calorico/.test(tool) && /calculadora-deficit-calorico/.test(comp));
ok("diz que a projeção não é promessa", /projeção, não uma promessa/i.test(readFileSync("lib/meta.ts", "utf8")) && /NOTA_ESTIMATIVA/.test(tool + comp));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
