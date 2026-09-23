import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Calorias no Boxe.
 *   npx tsx scripts/boxe-test.ts
 */
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
import {
  ARTIGOS_COM_CALCULADORA_BOXE, AULAS, KCAL_PROPAGANDA, MET_DESCANSO, RITMOS, aula, deAula, deRounds,
  descansoValido, minutosAtePropaganda, minutosValidos, pesoValido, ritmo, ritmoPelaContagem, roundValido,
  roundsValidos, tabelaPorPeso, tabelaPorRitmo,
} from "../lib/boxe";
import { ARTIGOS_COM_CALCULADORA_ATIVIDADES, ATIVIDADES } from "../lib/atividades";
import { MET_AULA as MET_AULA_SPINNING } from "../lib/spinning";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS METs DO COMPÊNDIO, TRAVADOS");
/* Mudar em lib/boxe.ts exige conferir a fonte e mudar aqui. */
ok("sombra = 5,5", aula("sombra").met === 5.5);
ok("saco = 5,8 (código 15110)", aula("saco").met === 5.8);
ok("sparring = 7,8 (código 15120)", aula("sparring").met === 7.8);
ok("ritmos 60/120/180 = 7,0/8,5/10,8", ritmo("60").met === 7.0 && ritmo("120").met === 8.5 && ritmo("180").met === 10.8);
ok("descanso = 1,3 (em pé parado, o mesmo da lateral no futebol)", MET_DESCANSO === 1.3);
ok("aulas em ordem de gasto", AULAS.every((a, i) => i === 0 || a.met > AULAS[i - 1].met));
ok("ritmos em ordem de gasto", RITMOS.every((r, i) => i === 0 || r.met > RITMOS[i - 1].met));
/* O erro que trouxe esta ferramenta: a coletiva dava 7,8 ao saco e 9,3 ao sparring. */
ok("o saco não é mais 7,8, que é o valor do sparring", aula("saco").met !== 7.8);

bloco("2. A CONTA");
const h70 = deAula(70, 60, 5.8);
ok("1 h de saco, 70 kg = 426,3 kcal", perto(h70.kcal, 426.3));
ok("aula não tem descanso separado", h70.minutosDescanso === 0 && h70.kcalDescanso === 0);
ok("líquido desconta 1 MET", perto(h70.kcalLiquida, h70.kcal - 1.225 * 60));
const r12 = deRounds(70, 12, 3, 1, 8.5);
ok("12 rounds de 3 com 1 de descanso = 36 + 11 min", r12.minutosAtivos === 36 && r12.minutosDescanso === 11 && r12.minutosTotais === 47);
ok("um round só não tem descanso", deRounds(70, 1, 3, 1, 8.5).minutosDescanso === 0);
ok("a soma das partes é o total", perto(r12.kcalAtiva + r12.kcalDescanso, r12.kcal));
ok("rounds fortes gastam menos que 1 h de sparring", r12.kcal < deAula(70, 60, 7.8).kcal);
ok("e mais que o mesmo tempo de aula de saco", r12.kcal > deAula(70, r12.minutosTotais, 5.8).kcal);

bloco("3. A CONTAGEM DE SOCOS");
ok("10 socos = cadenciado", ritmoPelaContagem(10).id === "60");
ok("19 socos = forte", ritmoPelaContagem(19).id === "120");
ok("28 socos = máximo", ritmoPelaContagem(28).id === "180");
ok("empate fica no ritmo menor", ritmoPelaContagem(15).id === "60");
ok("contagem absurda cai no extremo, não quebra", ritmoPelaContagem(60).id === "180" && ritmoPelaContagem(1).id === "60");

bloco("4. AS 1.000 KCAL DA PROPAGANDA");
ok("70 kg precisa de mais de 2 h de saco", minutosAtePropaganda(70, 5.8) > 120);
ok("nem 90 kg chega em 1 h de sparring", deAula(90, 60, 7.8).kcal < KCAL_PROPAGANDA);
ok("nenhuma aula de 1 h para 70 kg chega às 1.000", AULAS.every((a) => deAula(70, 60, a.met).kcal < KCAL_PROPAGANDA));

bloco("5. LIMITES");
ok("peso", !pesoValido(20) && pesoValido(70) && !pesoValido(300));
ok("tempo de aula", !minutosValidos(2) && minutosValidos(60) && !minutosValidos(200));
ok("rounds inteiros de 1 a 20", roundsValidos(12) && !roundsValidos(0) && !roundsValidos(21) && !roundsValidos(2.5));
ok("round de 1 a 5 min", roundValido(3) && !roundValido(0.5) && !roundValido(6));
ok("descanso de 0 a 3 min", descansoValido(0) && descansoValido(1) && !descansoValido(4));

bloco("6. O ARTIGO DIZ O QUE A CALCULADORA DIZ");
const art = blogPosts.find((p) => p.slug === "boxe-emagrece")!;
const tab = tabelaPorPeso();
const l70 = tab.find((l) => l.peso === 70)!;
const l90 = tab.find((l) => l.peso === 90)!;
for (const [nome, v] of [["sombra 70", l70.sombra], ["sombra 90", l90.sombra], ["saco 70", l70.saco], ["saco 90", l90.saco], ["sparring 70", l70.sparring], ["sparring 90", l90.sparring]] as const) {
  ok(`o artigo publica ${nome} = ${v} kcal`, art.content.includes(`cerca de ${v} kcal`));
}
ok("o artigo não publica mais as faixas antigas", !/450–600 kcal|600–800 kcal|750–1\.000 kcal/.test(art.content));
ok("a FAQ do artigo cabe na calculadora (400 a 750 por hora)",
  art.faq!.some((f) => /400 a 750 kcal por hora/.test(f.answer)) && l70.sombra >= 400 && l90.sparring <= 750);
ok("o artigo cita o Compêndio de 2024", /2024 Adult Compendium/.test(art.content) && !/2011 Compendium/.test(art.content));
{
  /* "Três aulas por semana acrescentam 1.000 a 2.000 kcal" — líquido, saco 70 kg a sparring 90 kg. */
  const min = deAula(70, 60, 5.8).kcalLiquida * 3;
  const max = deAula(90, 60, 7.8).kcalLiquida * 3;
  ok(`a semana do artigo cabe na conta (${Math.round(min)} a ${Math.round(max)})`, min >= 1000 && max <= 2000 && /1\.000 a 2\.000 kcal à semana/.test(art.content));
  const kgMes = (k: number) => (k * 52 / 12) / 7700;
  ok(`o mês do artigo cabe na conta (${kgMes(min).toFixed(2)} a ${kgMes(max).toFixed(2)} kg)`, kgMes(min) >= 0.5 && kgMes(max) <= 1.1 && /0,5 a 1 kg de gordura por mês/.test(art.content));
}
/*
 * A auditoria: com o saco em 5,8 METs, o boxe ficou abaixo de corrida,
 * corda, spinning e futebol. O artigo não pode mais vendê-lo como um dos
 * que mais gastam.
 */
ok("o artigo não chama o boxe de um dos que mais queimam", !/(um dos treinos|uma das atividades) que mais queimam/i.test(art.content + art.excerpt));
/* O spinning saiu da coletiva para lib/spinning.ts; a comparação usa a aula de lá. */
ok("e a comparação que ele faz se sustenta: aula de saco abaixo da aula de spinning", aula("saco").met < MET_AULA_SPINNING);
ok("a tabela por ritmo cresce", tabelaPorRitmo(70).every((l, i, a) => i === 0 || l.kcal > a[i - 1].kcal));

bloco("7. UMA FERRAMENTA POR ARTIGO");
ok("o artigo embute a calculadora de boxe", ARTIGOS_COM_CALCULADORA_BOXE.includes("boxe-emagrece"));
ok("e saiu da calculadora de atividades", !ARTIGOS_COM_CALCULADORA_ATIVIDADES.includes("boxe-emagrece"));
ok("o boxe saiu do seletor de atividades", !ATIVIDADES.some((a) => a.id === "boxe"));
ok("o corte editorial existe no HTML renderizado", splitAtPrimeiraSecao(marked(art.content) as string) !== null);
ok("canônica e pós-resultado", CANONICA.boxe?.href === ROTA.boxe && NOME.boxe === "Calculadora de Calorias no Boxe");

bloco("8. REGISTROS E PÁGINA");
const comp = readFileSync("components/boxe/CalculadoraBoxe.tsx", "utf8");
const pag = readFileSync("app/ferramentas/calculadora-calorias-boxe/page.tsx", "utf8");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_BOXE\.includes\(post\.slug\)/.test(blog) && /<CalculadoraBoxe placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-calorias-boxe/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-calorias-boxe/.test(readFileSync("app/sitemap.ts", "utf8")));
ok("sem chamada de rede", !/fetch\(|sendBeacon|localStorage/.test(comp));
ok("os eventos nunca levam peso nem relógio", !/trackEvent\([^)]*(peso|relogio)/.test(comp));
ok("quem passa das 1.000 kcal não recebe 'quanto falta'", /resultado\.kcal < KCAL_PROPAGANDA \?/.test(comp) && /passou-propaganda/.test(comp));
ok("o caso da auditoria passa mesmo das 1.000", deAula(120, 120, 7.8).kcal > KCAL_PROPAGANDA);
ok("kcal com ponto de milhar", /toLocaleString\("pt-BR"\)/.test(comp) && !/\{arredondaKcal\(/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("um H1", (pag.match(/<h1[\s>]/g) ?? []).length === 1);
const titulo = pag.match(/title: "([^"]+)"/)![1];
const desc = pag.match(/description:\s*\n?\s*"([^"]+)"/)![1];
ok(`título entre 45 e 58 (${titulo.length})`, titulo.length >= 45 && titulo.length <= 58);
ok(`descrição entre 130 e 155 (${desc.length})`, desc.length >= 130 && desc.length <= 155);

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
