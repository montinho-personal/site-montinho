import { readFileSync } from "fs";
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
/**
 * O motor da Calculadora de Corrida.
 *   npx tsx scripts/corrida-test.ts
 *
 * Três coisas aqui quebrariam em silêncio: a equação da ACSM (um 0,2 e um
 * 0,9 fáceis de trocar), o parsing de pace (aceitar "5:75" produziria um
 * tempo de maratona errado sem ninguém notar) e a troca para a conta da
 * caminhada abaixo de 8 km/h, que é o domínio de validade da equação.
 */
import {
  ARTIGOS_COM_CALCULADORA_CORRIDA, FONTES_CORRIDA, PROVAS, VELOCIDADE_MIN_CORRIDA,
  arredondaKcal, comparaComCaminhada, deDistanciaEPace, deDistanciaETempo, deTempoEPace,
  formataPace, formataRelogio, fraseContexto, kcalLiquida, kcalPorKm, metCorrida, metDoRitmo,
  kcalLiquidaPorKm, paceDeVelocidade, parsePace, simulacaoUmQuilo, tabelaPorPace, tabelaPorPeso, tabelaProvas,
  velocidadeDePace, paceValido,
} from "../lib/corrida";
import { ARTIGOS_COM_CALCULADORA_CAMINHADA, ARTIGOS_COM_LINK_CAMINHADA } from "../lib/caminhada";
import { ARTIGOS_COM_CALCULADORA_ATIVIDADES } from "../lib/atividades";
import { ARTIGOS_COM_CALCULADORA_FC, ARTIGOS_COM_LINK_FC } from "../lib/fc";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. A EQUAÇÃO DE CORRIDA DA ACSM");
/* 10 km/h = 166,67 m/min: 0,2 × 166,67 + 3,5 = 36,83 mL/kg/min = 10,52 METs. */
ok("10 km/h ≈ 10,5 METs", perto(metCorrida(10), 10.52, 0.02), String(metCorrida(10)));
ok("8 km/h ≈ 8,6 METs", perto(metCorrida(8), 8.62, 0.02));
ok("12 km/h ≈ 12,4 METs", perto(metCorrida(12), 12.43, 0.02));
ok("o MET cresce com a velocidade", metCorrida(14) > metCorrida(12) && metCorrida(12) > metCorrida(10));
/* Conferência contra o Compêndio: 8 km/h ~8,3; 10 km/h 9,8-10,5; 12 km/h 11,8-12,3. */
ok("bate com o Compêndio a 8 km/h (8,3)", Math.abs(metCorrida(8) - 8.3) < 0.5);
ok("bate com o Compêndio a 10 km/h (9,8-10,5)", metCorrida(10) >= 9.5 && metCorrida(10) <= 10.8);
ok("bate com o Compêndio a 12 km/h (11,8-12,3)", metCorrida(12) >= 11.5 && metCorrida(12) <= 12.8);
ok("inclinação zero não soma nada", metCorrida(10, 0) === metCorrida(10));
ok("inclinação soma, e proporcionalmente", perto(metCorrida(10, 10) - metCorrida(10), (metCorrida(10, 5) - metCorrida(10)) * 2, 0.0001));
/* Na corrida a subida pesa menos por ponto que na caminhada (0,9 contra 1,8). */
ok("o termo de subida da corrida é metade do da caminhada",
  perto((metCorrida(10, 10) - metCorrida(10)) * 2, (1.8 * (10 * 1000 / 60) * 0.1) / 3.5, 0.0001));

bloco("2. ABAIXO DE 8 KM/H A EQUAÇÃO NÃO VALE");
ok("a 10 km/h usa a equação de corrida", metDoRitmo(10).equacao === "corrida");
ok(`a ${VELOCIDADE_MIN_CORRIDA} km/h ainda é corrida`, metDoRitmo(VELOCIDADE_MIN_CORRIDA).equacao === "corrida");
ok("a 6 km/h troca para a caminhada", metDoRitmo(6).equacao === "caminhada");
ok("a troca não devolve número absurdo", metDoRitmo(6).met > 3 && metDoRitmo(6).met < 8);

bloco("3. PACE");
ok('"5:30" vira 330 s', parsePace("5:30") === 330);
ok('aceita "5.30" e "5,30"', parsePace("5.30") === 330 && parsePace("5,30") === 330);
ok('"6" vira 6:00', parsePace("6") === 360);
ok('rejeita "5:75" (segundo ≥ 60)', parsePace("5:75") === null);
ok('rejeita texto', parsePace("abc") === null && parsePace("") === null);
ok("330 s vira 5:30", formataPace(330) === "5:30");
ok("formata com zero à esquerda", formataPace(305) === "5:05");
ok("pace e velocidade são inversos", perto(velocidadeDePace(paceDeVelocidade(10)), 10, 0.0001));
ok("10 km/h é pace 6:00", formataPace(paceDeVelocidade(10)) === "6:00");
ok("a faixa aceita de 2:24 a 15:00", paceValido(144) && paceValido(900) && !paceValido(143) && !paceValido(901));
ok("relógio com horas", formataRelogio(3600 * 4 + 13 * 60 + 10) === "4:13:10");
ok("relógio sem horas", formataRelogio(30 * 60) === "30:00");

bloco("4. OS MODOS CONCORDAM");
const r = deDistanciaEPace(5, 360, 70);
ok("5 km a 6:00 levam 30 min", perto(r.minutos, 30));
ok("5 km a 6:00 para 70 kg ≈ 387 kcal", perto(r.kcal, 387, 1), String(r.kcal));
ok("distância+tempo devolve o mesmo", perto(deDistanciaETempo(5, 30, 70).kcal, r.kcal, 0.01));
ok("tempo+pace devolve o mesmo", perto(deTempoEPace(30, 360, 70).km, 5, 0.0001));
ok("o gasto é proporcional ao peso", perto(deDistanciaEPace(5, 360, 140).kcal, r.kcal * 2, 0.01));
ok("o gasto é proporcional à distância", perto(deDistanciaEPace(10, 360, 70).kcal, r.kcal * 2, 0.01));
ok("líquido desconta 1 MET e é positivo", kcalLiquida(r, 70) > 0 && kcalLiquida(r, 70) < r.kcal);
/*
 * A regra clássica é LÍQUIDA, e na equação da ACSM ela é exata: o termo
 * 0,2 × v é proporcional à velocidade e o tempo por quilômetro é
 * inversamente proporcional, então os dois se cancelam. Se alguém trocar o
 * 0,2, esta linha cai — e ela é a mais sensível do arquivo.
 */
for (const [peso, pace] of [[50, 420], [70, 360], [70, 270], [120, 300]] as [number, number][]) {
  const x = deDistanciaEPace(5, pace, peso);
  ok(`líquido a ${formataPace(pace)} com ${peso} kg = 1,000 kcal por quilo por km`,
    perto(kcalLiquidaPorKm(x, peso) / peso, 1, 0.0001), String(kcalLiquidaPorKm(x, peso) / peso));
}
ok("o bruto fica entre 1,05 e 1,15 por quilo", kcalPorKm(r) / 70 > 1.05 && kcalPorKm(r) / 70 < 1.15, String(kcalPorKm(r) / 70));
ok("o bruto por km cai conforme o pace acelera (menos repouso somado)",
  kcalPorKm(deDistanciaEPace(5, 270, 70)) < kcalPorKm(deDistanciaEPace(5, 420, 70)));
/*
 * O artigo de pular corda publica uma linha de corrida: 9 a 10 km/h, 300 a
 * 350 kcal em 30 minutos para 70 kg. É a única menção numérica à corrida em
 * outro artigo do site, e o líquido da ferramenta tem de caber nela —
 * senão as duas páginas se contradizem.
 */
{
  const trinta = (kmh: number) => {
    const x = deDistanciaETempo((kmh * 30) / 60, 30, 70);
    return kcalLiquida(x, 70);
  };
  ok("a 9 km/h o líquido em 30 min cabe em 300-350 kcal", trinta(9) >= 300 && trinta(9) <= 350, String(Math.round(trinta(9))));
  ok("a 10 km/h o líquido em 30 min cabe em 300-350 kcal", trinta(10) >= 300 && trinta(10) <= 350, String(Math.round(trinta(10))));
}
/* O que a página afirma: o pace muda pouco o gasto POR QUILÔMETRO. */
{
  const lento = kcalPorKm(deDistanciaEPace(5, 420, 70));
  const rapido = kcalPorKm(deDistanciaEPace(5, 270, 70));
  ok("do pace 7:00 ao 4:30 o gasto por km sobe menos de 20%", (rapido - lento) / lento < 0.2, `${((rapido - lento) / lento * 100).toFixed(0)}%`);
  ok("mas o tempo cai mais de 30%", (420 - 270) / 420 > 0.3);
}

bloco("5. PROVAS E COMPARAÇÃO COM A CAMINHADA");
const provas = tabelaProvas(360, 70);
ok("quatro provas", provas.length === 4 && PROVAS.length === 4);
ok("maratona a 6:00 dá 4:13:10", formataRelogio(provas[3].segundos) === "4:13:10", formataRelogio(provas[3].segundos));
ok("meia a 6:00 dá 2:06:35", formataRelogio(provas[2].segundos) === "2:06:35");
ok("a distância oficial da maratona é 42,195 km", PROVAS[3].km === 42.195 && PROVAS[2].km === 21.0975);
ok("tempo e gasto crescem com a distância", provas.every((l, i) => i === 0 || (l.segundos > provas[i - 1].segundos && l.kcal > provas[i - 1].kcal)));
const cmp = comparaComCaminhada(r, 70);
ok("correr 5 km gasta mais que caminhar 5 km", cmp.corrida.kcal > cmp.caminhadaMesmaDistancia.kcal);
/* O insight da página: por DISTÂNCIA a diferença é pequena; por TEMPO é grande. */
ok("por distância a diferença fica abaixo de 60%", (cmp.corrida.kcal - cmp.caminhadaMesmaDistancia.kcal) / cmp.caminhadaMesmaDistancia.kcal < 0.6);
ok("por tempo a corrida gasta mais que o dobro", cmp.corrida.kcal > cmp.caminhadaMesmoTempo.kcal * 2);
ok("caminhar a mesma distância leva mais tempo", cmp.caminhadaMesmaDistancia.minutos > cmp.corrida.minutos);

bloco("6. NENHUMA PRECISÃO FALSA, NENHUMA PROMESSA");
const frase = fraseContexto(82.5, r);
ok("a frase mantém o decimal do peso", /82,5 kg/.test(frase));
ok("a frase traz pace, tempo e estimativa", /6:00/.test(frase) && /30:00/.test(frase) && /aproximadamente/.test(frase));
ok("a frase não promete quilo", !/perde|perder|emagrec/i.test(frase), frase);
ok("kcal arredondada de 5 em 5 acima de 100", arredondaKcal(387) === 385);
const q = simulacaoUmQuilo(70, 360);
ok("1 kg de gordura dá ~100 km (ninguém corre isso de uma vez)", q.km > 80 && q.km < 130, String(q.km));
const tp = tabelaPorPeso(360);
ok("a tabela por peso cresce", tp.every((l, i) => i === 0 || l.kcal5k > tp[i - 1].kcal5k));
ok("10 km é o dobro de 5 km na tabela", tp.every((l) => Math.abs(l.kcal10k - l.kcal5k * 2) <= 5));
const tpc = tabelaPorPace(70);
ok("a tabela por pace vai do mais lento ao mais rápido", tpc.every((l, i) => i === 0 || l.pace < tpc[i - 1].pace));
ok("quanto mais rápido, menos tempo", tpc.every((l, i) => i === 0 || l.tempo5k < tpc[i - 1].tempo5k));

bloco("7. REGISTROS E PÁGINA");
const slugs = new Set(blogPosts.map((p) => p.slug));
ok("todo artigo do registro existe", ARTIGOS_COM_CALCULADORA_CORRIDA.every((s) => slugs.has(s)), ARTIGOS_COM_CALCULADORA_CORRIDA.filter((s) => !slugs.has(s)).join(", "));
ok("o teto de oito é respeitado", ARTIGOS_COM_CALCULADORA_CORRIDA.length <= 8);
const outros = new Set([...ARTIGOS_COM_CALCULADORA_CAMINHADA, ...ARTIGOS_COM_LINK_CAMINHADA, ...ARTIGOS_COM_CALCULADORA_ATIVIDADES, ...ARTIGOS_COM_CALCULADORA_FC, ...ARTIGOS_COM_LINK_FC]);
ok("nenhum artigo daqui pertence a outra ferramenta", ARTIGOS_COM_CALCULADORA_CORRIDA.every((s) => !outros.has(s)), ARTIGOS_COM_CALCULADORA_CORRIDA.filter((s) => outros.has(s)).join(", "));
ok("corrida-de-rua-iniciante saiu da FC", !ARTIGOS_COM_LINK_FC.includes("corrida-de-rua-iniciante"));
/* musculacao-ou-corrida fica na FC: a pergunta dele é comparar modalidades, não pace. */
ok("musculacao-ou-corrida continua na FC", ARTIGOS_COM_LINK_FC.includes("musculacao-ou-corrida-para-emagrecer"));
/*
 * O embed entra depois da primeira seção, e quem decide isso é
 * splitAtPrimeiraSecao sobre o HTML já convertido — vários artigos
 * escrevem "## Título" em markdown, e sem marked() o teste olharia para o
 * texto errado e aprovaria um artigo onde a calculadora nunca apareceria.
 */
for (const s of ARTIGOS_COM_CALCULADORA_CORRIDA) {
  const p = blogPosts.find((x) => x.slug === s)!;
  ok(`${s}: o corte editorial existe (a calculadora tem onde entrar)`,
    splitAtPrimeiraSecao(marked(p.content) as string) !== null);
}
ok("canônica e pós-resultado", CANONICA.corrida?.href === ROTA.corrida && NOME.corrida === "Calculadora de Corrida");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute pelo registro", /ARTIGOS_COM_CALCULADORA_CORRIDA\.includes\(post\.slug\)/.test(blog) && /<CalculadoraCorrida placement=\{post\.slug\} \/>/.test(blog));
ok("hub e sitemap", /calculadora-corrida/.test(readFileSync("lib/ferramentas/catalogo.ts", "utf8")) && /calculadora-corrida/.test(readFileSync("app/sitemap.ts", "utf8")));
const comp = readFileSync("components/corrida/CalculadoraCorrida.tsx", "utf8");
ok("sem chamada de rede", !/fetch\(|sendBeacon/.test(comp));
ok("CTA centralizado", /<PosResultado[\s\S]*ferramenta="corrida"/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("avisa quando cai na conta da caminhada", /NOTA_EQUACAO_CAMINHADA/.test(comp));
const tool = readFileSync("app/ferramentas/calculadora-corrida/page.tsx", "utf8");
ok("um H1", (tool.match(/<h1[\s>]/g) ?? []).length === 1);
ok("três tabelas em HTML", (tool.match(/<table/g) ?? []).length >= 3);
ok("publica a equação da ACSM", /0,2 × v \+ 0,9/.test(tool));
ok("a página diz que a regra de 1 kcal/kg/km é acima do repouso", /acima do repouso/.test(tool));
ok("mostra a conferência contra o Compêndio", /metCorrida\(8\)/.test(tool) && /Compêndio/.test(tool));
ok("simulação de 1 kg com aviso", /NÃO significa/.test(tool));
ok("quatro fontes com URL", FONTES_CORRIDA.length === 4 && FONTES_CORRIDA.every((f) => /^https?:\/\//.test(f.url)));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
