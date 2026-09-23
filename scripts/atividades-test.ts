import { readFileSync } from "fs";
import { marked } from "marked";
import { splitAtPrimeiraSecao } from "../lib/cta/placement";
/**
 * O motor da Calculadora de Calorias por Atividade.
 *   npx tsx scripts/atividades-test.ts
 *
 * Além da conta, este teste protege duas coisas que ninguém notaria
 * quebrando: os METs de cada atividade (trava, para que mudar um exija
 * conferir a fonte) e a fração de tempo ativo, que é a única coisa da
 * ferramenta que não vem do Compêndio e precisa continuar declarada.
 */
import {
  faixaPrincipal,
  ARTIGOS_COM_CALCULADORA_ATIVIDADES, ARTIGOS_COM_LINK_ATIVIDADES, ATIVIDADES, FONTES_ATIVIDADES,
  arredondaKcal, atividade, atividadeDoArtigo, comparaAtividades, deKcal, deTempo, faixa, fraseContexto, kcalLiquida,
  simulacaoUmQuilo, tabelaPorPeso, tempoAtivo,
} from "../lib/atividades";
import { ARTIGOS_COM_CALCULADORA_CAMINHADA, ARTIGOS_COM_LINK_CAMINHADA } from "../lib/caminhada";
import { ARTIGOS_COM_CALCULADORA_ELIPTICO } from "../lib/eliptico";
import { ARTIGOS_COM_CALCULADORA_FC, ARTIGOS_COM_LINK_FC } from "../lib/fc";
import { CANONICA } from "../lib/ferramentas/canonica";
import { NOME, ROTA } from "../lib/ferramentas/pos-resultado";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };
const bloco = (t: string) => console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
const perto = (a: number, b: number, t = 0.01) => Math.abs(a - b) <= t;

bloco("1. OS METs, TRAVADOS (mudar exige conferir o Compêndio)");
const ESPERADO: Record<string, [string, number][]> = {
  corda: [["lento", 8.8], ["rapido", 12.3]],
  escada: [["lento", 4.0], ["rapido", 8.8]],
  bicicleta: [["lazer", 5.8], ["esforco", 8.0]],
};
ok("toda atividade do motor está travada aqui", ATIVIDADES.every((a) => ESPERADO[a.id]), ATIVIDADES.filter((a) => !ESPERADO[a.id]).map((a) => a.id).join(", "));
for (const [id, faixas] of Object.entries(ESPERADO)) {
  const a = atividade(id);
  ok(`${id}: ${faixas.map(([f, m]) => `${f} ${m}`).join(", ")}`,
    a.faixas.length === faixas.length && faixas.every(([f, m]) => faixa(a, f).met === m),
    a.faixas.map((f) => `${f.id} ${f.met}`).join(", "));
}
ok("toda faixa diz de onde veio", ATIVIDADES.every((a) => a.faixas.every((f) => f.origem.length > 5)));
ok("a segunda faixa é sempre mais intensa que a primeira", ATIVIDADES.every((a) => a.faixas[1].met > a.faixas[0].met));
ok("toda atividade aponta para um artigo que existe",
  ATIVIDADES.every((a) => blogPosts.some((p) => p.slug === a.slug)),
  ATIVIDADES.filter((a) => !blogPosts.some((p) => p.slug === a.slug)).map((a) => a.slug).join(", "));

bloco("2. A CONTA");
const r = deTempo(60, 70, 7.8);
ok("60 min, 70 kg, 7,8 METs = 573,3 kcal", perto(r.kcal, 573.3));
ok("ida e volta concordam", perto(deKcal(r.kcal, 70, 7.8).minutos, 60));
ok("proporcional ao peso", perto(deTempo(60, 140, 7.8).kcal, r.kcal * 2));
ok("líquido desconta 1 MET e é positivo", perto(kcalLiquida(r, 70), r.kcal - 1.225 * 60) && kcalLiquida(r, 70) > 0);
ok("a frase mantém o decimal do peso", /82,5 kg/.test(fraseContexto(82.5, r, atividade("corda"), atividade("corda").faixas[0])));
/* "em ritmo saco e aparelhos" e "em ritmo moderada" não concordam: o nome da
   faixa é rótulo, não adjetivo. Ele entra entre parênteses. */
ok("a faixa entra entre parênteses, sem forçar concordância",
  /\(subida do dia a dia\) representa/.test(fraseContexto(70, r, atividade("escada"), atividade("escada").faixas[0]))
    && /\(ritmo lento\) representa/.test(fraseContexto(70, r, atividade("corda"), atividade("corda").faixas[0])));
ok("a frase não promete quilo", !/perde|emagrec/i.test(fraseContexto(70, r, atividade("corda"), atividade("corda").faixas[0])));
ok("1 kg de gordura leva mais de 10 h (para ninguém tentar)", simulacaoUmQuilo(70, 7.8).minutos > 600);

bloco("2b. A CALCULADORA CONCORDA COM AS FAIXAS DOS ARTIGOS");
/*
 * O teste que existe por causa de um bug real: o desconto de pausas era
 * padrão e fazia a calculadora dizer 400 kcal logo abaixo de um artigo que
 * dizia 450 a 600 para a mesma aula. Cada linha aqui é a faixa que o artigo
 * publica, com o peso e a duração dele. O padrão da ferramenta (tempo
 * cheio) tem de cair dentro.
 */
const FAIXAS_DOS_ARTIGOS: [string, string, number, number, number, number][] = [
  /* atividade, faixa, peso, minutos, mínimo do artigo, máximo do artigo */
  ["corda", "lento", 70, 30, 300, 400],
  /* "10 a 12 kcal/min para 80 kg" — o artigo arredonda, daí a tolerância abaixo. */
  ["escada", "rapido", 80, 15, 150, 180],
];
/*
 * Uma leitura basta. O artigo às vezes fala do tempo cheio (boxe: "uma hora
 * de treino") e às vezes já conta as pausas (jiu-jitsu: "contando
 * aquecimento, técnica e rola"). O que o teste proíbe é a contradição: que
 * NENHUMA das duas leituras da ferramenta caiba na faixa publicada.
 */
const TOLERANCIA = 0.05;
for (const [aid, fid, peso, min, lo, hi] of FAIXAS_DOS_ARTIGOS) {
  const a = atividade(aid);
  const met = faixa(a, fid).met;
  const cheio = arredondaKcal(deTempo(min, peso, met).kcal);
  const desc = arredondaKcal(deTempo(tempoAtivo(min, a), peso, met).kcal);
  const cabe = (k: number) => k >= lo * (1 - TOLERANCIA) && k <= hi * (1 + TOLERANCIA);
  ok(`${aid}/${fid}: ${min} min, ${peso} kg -> ${cheio}${desc !== cheio ? ` ou ${desc}` : ""} kcal (artigo: ${lo}-${hi})`,
    cabe(cheio) || cabe(desc));
}
/* E o padrão da ferramenta (tempo cheio) precisa bater na maioria — senão o
   número que a pessoa vê primeiro é o que diverge. */
{
  const batem = FAIXAS_DOS_ARTIGOS.filter(([aid, fid, peso, min, lo, hi]) => {
    const k = arredondaKcal(deTempo(min, peso, faixa(atividade(aid), fid).met).kcal);
    return k >= lo * (1 - TOLERANCIA) && k <= hi * (1 + TOLERANCIA);
  }).length;
  ok(`o padrão (tempo cheio) cai na faixa do artigo em ${batem} de ${FAIXAS_DOS_ARTIGOS.length} casos`,
    batem >= FAIXAS_DOS_ARTIGOS.length - 3);
}

bloco("3. O TEMPO ATIVO — opção, nunca padrão");
{
  const comp = readFileSync("components/atividades/CalculadoraAtividades.tsx", "utf8");
  /* O padrão tem de ser o tempo cheio: é ele que concorda com os artigos. */
  ok("o desconto de pausas começa desligado", /useState\(false\);?\s*$/m.test(comp.split("descontarPausas")[1]?.split("\n")[0] ?? "") || /const \[descontarPausas, setDescontarPausas\] = useState\(false\)/.test(comp));
  ok("a caixa fala do que a pessoa observou, não de uma regra da casa", /Passei boa parte da sessão parado/.test(comp));
}
ok("corda, quando pedido, desconta pausas", tempoAtivo(60, atividade("corda")) === 30);
ok("bicicleta é contínua (não desconta)", tempoAtivo(60, atividade("bicicleta")) === 60);
ok("bicicleta é contínua", atividade("bicicleta").fracaoAtiva === null);
ok("toda fração declarada fica entre 40% e 95%",
  ATIVIDADES.every((a) => a.fracaoAtiva === null || (a.fracaoAtiva >= 0.4 && a.fracaoAtiva <= 0.95)));
{
  const aulaCorda = deTempo(tempoAtivo(60, atividade("corda")), 70, atividade("corda").faixas[0].met);
  const horaInteira = deTempo(60, 70, atividade("corda").faixas[0].met);
  ok("descontar pausas reduz o gasto da aula", aulaCorda.kcal < horaInteira.kcal);
  /* A trava das "1.000 kcal por aula" mora agora nos testes de boxe e zumba. */
}

bloco("4. COMPARAÇÃO E TABELAS");
const cmp = comparaAtividades(60, 70);
ok("uma linha por atividade", cmp.length === ATIVIDADES.length);
ok("ordenada do maior para o menor", cmp.every((l, i) => i === 0 || l.kcal <= cmp[i - 1].kcal));
ok("usa a faixa principal de cada uma", cmp.every((l) => l.met === faixaPrincipal(atividade(l.id)).met));
/* Escada: o artigo trata a escada como exercício (8 a 9 METs). Se a comparação
   usasse a entrada lenta do Compêndio, ela apareceria como a mais fraca da lista. */
ok("a escada entra na comparação como exercício, não como subida do dia a dia", faixaPrincipal(atividade("escada")).met === 8.8);
ok("toda faixa principal existe", ATIVIDADES.every((a) => a.faixas[a.faixaPrincipal] !== undefined));
const tab = tabelaPorPeso(atividade("corda"), 42);
ok("tabela por peso cresce", tab.every((l, i, a) => i === 0 || l.kcal[0] > a[i - 1].kcal[0]));
ok("uma coluna por faixa", tab.every((l) => l.kcal.length === atividade("corda").faixas.length));
ok("o pós-resultado não promete o desconto de pausas, que é opcional",
  !/tempo de aula não é todo tempo de esforço/.test(readFileSync("lib/ferramentas/pos-resultado.ts", "utf8")));
ok("futebol, boxe, zumba, spinning, dança, natação e jiu-jitsu saíram do seletor", !ATIVIDADES.some((a) => ["futebol", "boxe", "zumba", "spinning", "danca", "natacao", "jiu-jitsu"].includes(a.id)));

bloco("5. UMA FERRAMENTA POR ARTIGO");
const slugs = new Set(blogPosts.map((p) => p.slug));
const meus = [...ARTIGOS_COM_CALCULADORA_ATIVIDADES, ...ARTIGOS_COM_LINK_ATIVIDADES];
ok("todo artigo dos registros existe", meus.every((s) => slugs.has(s)), meus.filter((s) => !slugs.has(s)).join(", "));
ok("o teto de oito embeds é respeitado", ARTIGOS_COM_CALCULADORA_ATIVIDADES.length <= 8);
ok("embed e link são disjuntos", ARTIGOS_COM_CALCULADORA_ATIVIDADES.every((s) => !ARTIGOS_COM_LINK_ATIVIDADES.includes(s)));
const outros = new Set([...ARTIGOS_COM_CALCULADORA_CAMINHADA, ...ARTIGOS_COM_LINK_CAMINHADA, ...ARTIGOS_COM_CALCULADORA_ELIPTICO, ...ARTIGOS_COM_CALCULADORA_FC, ...ARTIGOS_COM_LINK_FC]);
ok("nenhum artigo daqui pertence a outra ferramenta", meus.every((s) => !outros.has(s)), meus.filter((s) => outros.has(s)).join(", "));
ok("futebol e jiu-jitsu saíram da FC", !ARTIGOS_COM_LINK_FC.includes("futebol-emagrece") && !ARTIGOS_COM_LINK_FC.includes("jiu-jitsu-emagrece"));
ok("todo artigo com embed tem atividade correspondente",
  ARTIGOS_COM_CALCULADORA_ATIVIDADES.every((s) => atividadeDoArtigo(s) !== null),
  ARTIGOS_COM_CALCULADORA_ATIVIDADES.filter((s) => !atividadeDoArtigo(s)).join(", "));
/* O corte editorial do embed é depois da primeira seção: sem duas, não há corte. */
for (const s of ARTIGOS_COM_CALCULADORA_ATIVIDADES) {
  const p = blogPosts.find((x) => x.slug === s)!;
  ok(`${s}: o corte editorial existe (a calculadora tem onde entrar)`,
    splitAtPrimeiraSecao(marked(p.content) as string) !== null);
}
/* Caminhada e elíptico têm ferramenta própria e não podem virar opção do seletor. */
ok("caminhada e elíptico ficam fora do seletor", !ATIVIDADES.some((a) => /caminhada|elíptico|eliptico/i.test(a.nome)));

bloco("6. REGISTROS E PÁGINA");
ok("canônica e pós-resultado", CANONICA.atividades?.href === ROTA.atividades && NOME.atividades === "Calculadora de Calorias por Atividade");
const blog = readFileSync("app/blog/[slug]/page.tsx", "utf8");
ok("o blog embute com a atividade do artigo já escolhida",
  /ARTIGOS_COM_CALCULADORA_ATIVIDADES\.includes\(post\.slug\)/.test(blog) && /atividadeInicial=\{atividadeDoArtigo\(post\.slug\)\?\.id\}/.test(blog));
ok("o blog põe o convite pelo registro de link", /ARTIGOS_COM_LINK_ATIVIDADES\.includes\(post\.slug\) && <LinkFerramentaAtividades/.test(blog));
ok("hub e sitemap", /calculadora-calorias-atividades/.test(readFileSync("app/ferramentas/page.tsx", "utf8")) && /calculadora-calorias-atividades/.test(readFileSync("app/sitemap.ts", "utf8")));
const comp = readFileSync("components/atividades/CalculadoraAtividades.tsx", "utf8");
ok("sem chamada de rede", !/fetch\(|sendBeacon/.test(comp));
ok("CTA centralizado", /<PosResultado[\s\S]*ferramenta="atividades"/.test(comp));
ok("aria-live", /aria-live="polite"/.test(comp));
ok("o desconto das pausas é visível e desligável", /Passei boa parte da sessão parado/.test(comp) && /type="checkbox"/.test(comp));
const tool = readFileSync("app/ferramentas/calculadora-calorias-atividades/page.tsx", "utf8");
ok("um H1", (tool.match(/<h1[\s>]/g) ?? []).length === 1);
ok("quatro tabelas em HTML", (tool.match(/<table/g) ?? []).length >= 4);
ok("a página publica a tabela de METs por atividade", /Entrada do Compêndio/.test(tool));
ok("simulação de 1 kg com aviso", /NÃO significa/.test(tool));
ok("a página explica por que caminhada e elíptico têm ferramenta própria", /calculadora-calorias-caminhada/.test(tool) && /calculadora-calorias-eliptico/.test(tool));
ok("seis fontes ou menos, todas com URL", FONTES_ATIVIDADES.every((f) => /^https?:\/\//.test(f.url)));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
