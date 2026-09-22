import { readFileSync } from "fs";
/**
 * O motor da Calculadora de Polichinelos.
 *   npx tsx scripts/polichinelo-test.ts
 *
 * O que se protege aqui é o que quebraria sem ninguém notar: a conta em si
 * (que é uma multiplicação, mas com um 200 e um 3,5 fáceis de trocar de
 * lugar), a coerência entre os modos — calcular ida e volta tem de devolver
 * o mesmo número — e as duas promessas que a página faz por escrito:
 * nenhum MET inventado e nenhuma precisão falsa.
 */
import {
  CADENCIA_MAX,
  CADENCIA_MIN,
  FONTES,
  INTENSIDADES,
  KCAL_MAX,
  KCAL_MIN,
  KCAL_POR_KG_GORDURA,
  PESOS_TABELA,
  PESO_MAX,
  PESO_MIN,
  PRESETS_QUANTIDADE,
  QTD_MAX,
  QTD_MIN,
  RITMOS_CAMINHADA,
  arredondaKcal,
  arredondaQuantidade,
  cadenciaValida,
  deKcal,
  deQuantidade,
  equivalenteACaminhada,
  formataTempo,
  fraseContexto,
  intensidade,
  kcalPorMinuto,
  kcalValida,
  parseNumero,
  pesoValido,
  quantidadeValida,
  simulacaoUmQuilo,
  tabelaPorPeso,
} from "../lib/polichinelo";
import { ARTIGOS_COM_LINK_POLICHINELO } from "../lib/polichinelo";
import { blogPosts } from "../lib/blog";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) {
    falhas++;
    console.log(`  FALHOU  ${nome}${detalhe ? `  ${detalhe}` : ""}`);
  } else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}
/** Compara com folga — o que se testa é a conta, não o último bit do float. */
const perto = (a: number, b: number, tol = 0.01) => Math.abs(a - b) <= tol;

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. A EQUAÇÃO DE METs");

/*
 * O caso de mão: 5,5 METs, 70 kg.
 *   5,5 × 3,5 × 70 ÷ 200 = 6,7375 kcal/min
 * Se alguém trocar o 200 por 100 ou o 3,5 por 3, esta linha cai.
 */
ok("5,5 MET × 70 kg = 6,7375 kcal/min", perto(kcalPorMinuto(5.5, 70), 6.7375, 0.0001),
  String(kcalPorMinuto(5.5, 70)));
ok("1 MET × 70 kg ≈ 1,225 kcal/min", perto(kcalPorMinuto(1, 70), 1.225, 0.0001));
ok("o gasto é proporcional ao peso",
  perto(kcalPorMinuto(5.5, 140), kcalPorMinuto(5.5, 70) * 2, 0.0001));
ok("o gasto é proporcional ao MET",
  perto(kcalPorMinuto(7, 70), kcalPorMinuto(3.5, 70) * 2, 0.0001));
ok("peso zero não gera gasto", kcalPorMinuto(5.5, 0) === 0);

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. OS MODOS CONCORDAM ENTRE SI");

/*
 * Ida e volta. Quem pede as calorias de 300 polichinelos e depois pede
 * quantos polichinelos dão aquelas calorias tem de receber 300 de volta —
 * senão a ferramenta se contradiz na mesma tela.
 */
for (const inten of INTENSIDADES) {
  for (const peso of [50, 70, 100, 120]) {
    const ida = deQuantidade(300, peso, inten.met, inten.cadencia);
    const volta = deKcal(ida.kcal, peso, inten.met, inten.cadencia);
    ok(`ida e volta fecham (${inten.nome}, ${peso} kg)`, perto(volta.quantidade, 300, 0.001),
      `voltou ${volta.quantidade}`);
  }
}

const r = deQuantidade(450, 80, 5.5, 45);
ok("450 polichinelos a 45/min dão 10 minutos", perto(r.minutos, 10, 0.0001), String(r.minutos));
ok("e o gasto bate com minutos × kcal/min",
  perto(r.kcal, kcalPorMinuto(5.5, 80) * 10, 0.0001));

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. EQUIVALÊNCIA COM A CAMINHADA");

const cam = equivalenteACaminhada(30, 70, 3.5, 5.5, 45);
ok("30 min de caminhada a 3,5 MET, 70 kg ≈ 128,6 kcal", perto(cam.kcalCaminhada, 128.625, 0.01),
  String(cam.kcalCaminhada));
ok("o polichinelo equivalente gasta o MESMO tanto", perto(cam.polichinelo.kcal, cam.kcalCaminhada, 0.0001));
ok("e leva MENOS tempo, porque o MET é maior", cam.polichinelo.minutos < 30,
  `${cam.polichinelo.minutos} min`);

/*
 * A direção importa: caminhada mais rápida tem de pedir MAIS polichinelos,
 * nunca menos. Um sinal trocado aqui inverteria a resposta da página.
 */
const lento = equivalenteACaminhada(30, 70, RITMOS_CAMINHADA[0].met, 5.5, 45);
const rapido = equivalenteACaminhada(30, 70, RITMOS_CAMINHADA[2].met, 5.5, 45);
ok("caminhada rápida pede mais polichinelos que a leve",
  rapido.polichinelo.quantidade > lento.polichinelo.quantidade);

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. NENHUM MET INVENTADO");

/*
 * Os valores das pontas são do Compêndio e não podem ser "ajustados" por
 * conveniência. O do meio pode mudar, mas só se continuar entre os dois —
 * e a descrição tem de dizer que é interpolação.
 */
const leve = intensidade("leve");
const mod = intensidade("moderado");
const intenso = intensidade("intenso");
ok("leve = 3,5 METs (calistenia leve/moderada do Compêndio)", leve.met === 3.5, String(leve.met));
ok("intenso = 7,5 METs (calistenia vigorosa do Compêndio)", intenso.met === 7.5, String(intenso.met));
ok("moderado fica ENTRE os dois valores medidos", mod.met > leve.met && mod.met < intenso.met,
  String(mod.met));
ok("e se declara interpolado", /interpol/i.test(mod.origem), mod.origem);
ok("as pontas citam o Compêndio", /compêndio/i.test(leve.origem) && /compêndio/i.test(intenso.origem));

ok("a cadência cresce junto com a intensidade",
  leve.cadencia < mod.cadencia && mod.cadencia < intenso.cadencia);

ok("toda fonte tem rótulo, URL e resumo",
  FONTES.every((f) => f.rotulo.length > 20 && /^https?:\/\//.test(f.url) && f.resumo.length > 20));
ok("a correção de Hall está entre as fontes",
  FONTES.some((f) => /hall/i.test(f.rotulo)),
  "sem ela a conta de 1 kg vira promessa");

const caminhadaOrdenada = RITMOS_CAMINHADA.every((x, i, a) => i === 0 || a[i - 1].met < x.met);
ok("os METs de caminhada estão em ordem crescente", caminhadaOrdenada);

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. NADA DE PRECISÃO FALSA");

ok("74,382 vira 74", arredondaKcal(74.382) === 74, String(arredondaKcal(74.382)));
ok("acima de 100 arredonda de 5 em 5", arredondaKcal(812.7) % 5 === 0, String(arredondaKcal(812.7)));
ok("quantidade acima de 1.000 arredonda de 50 em 50",
  arredondaQuantidade(4827) % 50 === 0, String(arredondaQuantidade(4827)));
ok("quantidade entre 100 e 1.000 arredonda de 10 em 10",
  arredondaQuantidade(437) % 10 === 0, String(arredondaQuantidade(437)));
ok("abaixo de 100 mantém o inteiro", arredondaQuantidade(37.4) === 37);

ok("meio minuto vira segundos", formataTempo(0.5) === "30 s", formataTempo(0.5));
ok("um minuto fica no singular", formataTempo(1) === "1 minuto", formataTempo(1));
ok("dez minutos ficam no plural", formataTempo(10) === "10 minutos");
ok("acima de uma hora vira h + min", formataTempo(95) === "1 h 35 min", formataTempo(95));
ok("hora cheia não mostra os minutos", formataTempo(120) === "2 h", formataTempo(120));
ok("tempo inválido não quebra a tela", formataTempo(0) === "—" && formataTempo(NaN) === "—");

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. VALIDAÇÃO — O QUE NÃO PODE ENTRAR");

ok("vírgula decimal é aceita (é como se escreve peso)", parseNumero("72,5") === 72.5);
ok("ponto decimal também", parseNumero("72.5") === 72.5);
ok("texto vira null", parseNumero("oitenta") === null);
ok("negativo vira null", parseNumero("-70") === null);
ok("campo vazio vira null", parseNumero("   ") === null);
ok("número com lixo vira null", parseNumero("70kg") === null);

ok("peso abaixo do mínimo é recusado", !pesoValido(PESO_MIN - 1));
ok("peso acima do máximo é recusado", !pesoValido(PESO_MAX + 1));
ok("peso no limite é aceito", pesoValido(PESO_MIN) && pesoValido(PESO_MAX));
ok("peso nulo é recusado", !pesoValido(null));
ok("peso zero é recusado", !pesoValido(0));

ok("quantidade fracionada é recusada", !quantidadeValida(10.5));
ok("quantidade zero é recusada", !quantidadeValida(0));
ok("quantidade absurda é recusada", !quantidadeValida(QTD_MAX + 1));
ok("quantidade no limite é aceita", quantidadeValida(QTD_MIN) && quantidadeValida(QTD_MAX));

ok("meta calórica minúscula é recusada", !kcalValida(KCAL_MIN - 1));
ok("meta calórica absurda é recusada", !kcalValida(KCAL_MAX + 1));
ok("cadência fora da faixa é recusada",
  !cadenciaValida(CADENCIA_MIN - 1) && !cadenciaValida(CADENCIA_MAX + 1));

// ─── 7 ──────────────────────────────────────────────────────────────────────
bloco("7. A MATRIZ DE TESTES PEDIDA (pesos × quantidades)");

const PESOS = [50, 60, 70, 80, 90, 100, 120];
const QTDS = [50, 100, 500, 1000, 5000];
let celulas = 0;
for (const peso of PESOS) {
  for (const q of QTDS) {
    for (const inten of INTENSIDADES) {
      const res = deQuantidade(q, peso, inten.met, inten.cadencia);
      const sane =
        Number.isFinite(res.kcal) && res.kcal > 0 &&
        Number.isFinite(res.minutos) && res.minutos > 0 &&
        arredondaKcal(res.kcal) > 0 &&
        formataTempo(res.minutos) !== "—";
      if (!sane) ok(`${peso} kg × ${q} (${inten.nome})`, false, JSON.stringify(res));
      celulas++;
    }
  }
}
ok(`${celulas} combinações produzem número válido`, true);

/* Monotonicidade: mais peso nunca pode gastar menos. */
let monotonico = true;
for (const q of QTDS) {
  for (let i = 1; i < PESOS.length; i++) {
    const a = deQuantidade(q, PESOS[i - 1], 5.5, 45).kcal;
    const b = deQuantidade(q, PESOS[i], 5.5, 45).kcal;
    if (b <= a) monotonico = false;
  }
}
ok("mais peso sempre gasta mais", monotonico);

/* E mais polichinelo nunca pode gastar menos. */
let crescente = true;
for (let i = 1; i < QTDS.length; i++) {
  if (deQuantidade(QTDS[i], 70, 5.5, 45).kcal <= deQuantidade(QTDS[i - 1], 70, 5.5, 45).kcal)
    crescente = false;
}
ok("mais polichinelos sempre gastam mais", crescente);

// ─── 8 ──────────────────────────────────────────────────────────────────────
bloco("8. A SIMULAÇÃO DE 1 KG É ABSURDA DE PROPÓSITO");

const umQuilo = simulacaoUmQuilo(70, 5.5, 45);
ok("1 kg de gordura = 7.700 kcal", KCAL_POR_KG_GORDURA === 7700);
ok("a simulação usa exatamente essa energia", perto(umQuilo.kcal, 7700, 0.0001));
/*
 * O número tem de sair grande o bastante para ser obviamente impraticável.
 * Se um dia ele caísse para algo que parece factível, a página passaria a
 * sugerir que dá para tentar — que é o oposto do que ela diz.
 */
ok("dá mais de dez mil polichinelos", umQuilo.quantidade > 10000,
  String(Math.round(umQuilo.quantidade)));
ok("e mais de quinze horas seguidas", umQuilo.minutos > 15 * 60,
  formataTempo(umQuilo.minutos));

// ─── 9 ──────────────────────────────────────────────────────────────────────
bloco("9. A TABELA QUE O ROBÔ LÊ");

const tab = tabelaPorPeso(100, 5.5, 45);
ok("uma linha por peso da tabela", tab.length === PESOS_TABELA.length);
ok("todas as linhas têm kcal maior que zero", tab.every((l) => l.kcal > 0));
ok("a tabela também é monotônica",
  tab.every((l, i, a) => i === 0 || a[i - 1].kcal < l.kcal));
ok("o tempo é igual em todas as linhas (peso não muda cadência)",
  tab.every((l) => perto(l.minutos, tab[0].minutos, 0.0001)));

ok("os atalhos de quantidade estão em ordem",
  PRESETS_QUANTIDADE.every((p, i, a) => i === 0 || a[i - 1] < p));
ok("100 está entre os atalhos (é a busca mais comum do cluster)",
  (PRESETS_QUANTIDADE as readonly number[]).includes(100));

// ─── 10 ─────────────────────────────────────────────────────────────────────
bloco("10. A FRASE DE CONTEXTO");

const frase = fraseContexto(80, deQuantidade(500, 80, 5.5, 45), "Moderado");
ok("cita o peso", frase.includes("80 kg"), frase);
ok("cita a quantidade", frase.includes("500"));
ok("diz que é estimativa", /aproximadamente|estimad/i.test(frase));
ok("não promete quilo nenhum", !/perde|perder|emagrec/i.test(frase), frase);

// ─── 11 ─────────────────────────────────────────────────────────────────────
bloco("11. O REGISTRO DE ARTIGOS É HONESTO");

const slugs = new Set(blogPosts.map((p) => p.slug));
ok("todo artigo do registro existe",
  ARTIGOS_COM_LINK_POLICHINELO.every((s) => slugs.has(s)),
  ARTIGOS_COM_LINK_POLICHINELO.filter((s) => !slugs.has(s)).join(", "));
ok("o artigo de maior tráfego do cluster está no registro",
  ARTIGOS_COM_LINK_POLICHINELO.includes("polichinelo-emagrece"));

// ─── 12 ─────────────────────────────────────────────────────────────────────
bloco("12. O CONVITE DO TOPO FICA ONDE A PESSOA QUER A CONTA");
{
  /*
   * ~95% das buscas de polichinelo chegam com um número na cabeça. O convite
   * do fim do artigo chegava tarde; o do topo entra logo depois da primeira
   * seção, onde o artigo dá a conta genérica.
   */
  const pagina = readFileSync("app/blog/[slug]/page.tsx", "utf8");
  const link = readFileSync("components/polichinelo/LinkFerramentaPolichinelo.tsx", "utf8");
  ok("a página põe o convite do topo depois da primeira seção",
    /linkPolichineloNoTopo[\s\S]{0,120}splitAtPrimeiraSecao/.test(pagina)
      && /<LinkFerramentaPolichinelo slug=\{post\.slug\} posicao="topo" \/>/.test(pagina));
  ok("o convite do fim continua no artigo",
    /<LinkFerramentaPolichinelo slug=\{post\.slug\} posicao="fim" \/>/.test(pagina));
  ok("o topo só entra onde não há calculadora embutida (senão seriam duas ferramentas no mesmo ponto)",
    /linkPolichineloNoTopo = !qualCalc &&/.test(pagina));
  ok("topo e fim mandam placements diferentes para o GA4",
    /`topo-\$\{slug\}`/.test(link) && /`link-\$\{slug\}`/.test(link));

  /*
   * O texto do topo diz "Esses números são para 70 kg". Isso só é verdade
   * se a primeira seção do artigo fizer a conta para 70 kg — então todo
   * artigo que entrar no registro tem de fazer. Sem esta trava, o próximo
   * artigo adicionado herdaria uma frase falsa.
   */
  ok("o convite do topo afirma o peso de referência", /Esses números são para 70 kg/.test(link));
  for (const slug of ARTIGOS_COM_LINK_POLICHINELO) {
    const html = blogPosts.find((p) => p.slug === slug)?.content ?? "";
    const h2 = [...html.matchAll(/<h2[\s>]/gi)].map((m) => m.index ?? 0);
    const primeiraSecao = h2.length >= 2 ? html.slice(0, h2[1]) : "";
    ok(`${slug}: a primeira seção faz a conta para 70 kg`, /70\s?kg/.test(primeiraSecao));
  }
}

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
