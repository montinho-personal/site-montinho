/**
 * O cardápio e a tabela nutricional falam a mesma coisa.
 *   npx tsx scripts/cardapio-taco-test.ts
 *
 * A regra: se /alimentos/feijao-carioca-cozido diz 4,8 g de proteína, o
 * Monte seu Cardápio precisa dizer 4,8 g também. Duas verdades nutricionais
 * no mesmo site é o começo de um problema que só aparece meses depois,
 * quando alguém compara as duas telas e nenhuma das duas parece confiável.
 *
 * POR QUE UM TESTE, E NÃO UM IMPORT DIRETO
 *
 * O caminho óbvio seria o cardápio ler os números de lib/alimentos. Não dá:
 * o componente do cardápio roda no navegador, e a base completa tem 2,3 MB.
 * Importar de lá mandaria os 597 alimentos e os 26 nutrientes de cada um
 * para o celular de quem só quer montar um almoço.
 *
 * Então os valores ficam escritos no cardápio — legíveis, editáveis — e este
 * teste garante que eles sejam exatamente os da TACO. A fonte da verdade
 * continua sendo uma só; o que muda é que a garantia é do build, não do
 * import.
 */

import { readFileSync } from "node:fs";
import { ALIMENTOS_CARDAPIO } from "../lib/cardapio/alimentos";
import type { Alimento } from "../lib/alimentos/tipos";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

const base = JSON.parse(readFileSync("data/alimentos/processado/taco.json", "utf8")) as { alimentos: Alimento[] };
const porSlug = new Map(base.alimentos.map((a) => [a.slug, a]));

const ligados = ALIMENTOS_CARDAPIO.filter((a) => a.taco);
const soltos = ALIMENTOS_CARDAPIO.filter((a) => !a.taco);

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. TODO VÍNCULO APONTA PARA UM REGISTRO REAL");

const fantasmas = ligados.filter((a) => !porSlug.has(a.taco!));
ok("todo alimento ligado aponta para um registro que existe na TACO",
  fantasmas.length === 0, fantasmas.map((a) => `${a.id} → ${a.taco}`).join(", "));

console.log(`\n  ${ligados.length} ligados à TACO · ${soltos.length} sem vínculo`);

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. OS NÚMEROS SÃO OS MESMOS DOS DOIS LADOS");

/** kcal inteira, macro com uma casa — a mesma regra de exibição do site. */
const arredonda = (v: number, kcal: boolean) => (kcal ? Math.round(v) : Math.round(v * 10) / 10);

for (const a of ligados) {
  const t = porSlug.get(a.taco!);
  if (!t) continue;
  const daTaco = (id: string) => {
    const v = t.nutrientes.find((n) => n.nutrienteId === id);
    return v && v.estado === "analisado" ? v.valorPor100g : null;
  };

  const pares: [string, number, number | null, boolean][] = [
    ["kcal", a.kcal100, daTaco("energia"), true],
    ["proteína", a.prot100, daTaco("proteina"), false],
    ["carboidrato", a.carb100, daTaco("carboidrato"), false],
    ["gordura", a.gord100, daTaco("lipideos"), false],
  ];

  const ruins = pares.filter(([, cardapio, taco, kcal]) =>
    taco === null ? cardapio !== 0 : Math.abs(cardapio - arredonda(taco, kcal)) > 0.001,
  );

  ok(
    `${a.id} bate com ${a.taco}`,
    ruins.length === 0,
    ruins.map(([k, c, t2, kc]) => `${k}: cardápio ${c} ≠ TACO ${t2 === null ? "(sem valor)" : arredonda(t2, kc)}`).join(" | "),
  );
}

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. NINGUÉM ALEGA TACO SEM TER REGISTRO NA TACO");

/**
 * O teste que motivou este arquivo.
 *
 * Sete alimentos do cardápio citavam a TACO como fonte e não existiam nela:
 * tilápia grelhada (a TACO não tem tilápia), grão-de-bico e macarrão cozidos
 * (a tabela só traz os crus), ovos mexidos, leite de vaca integral (marcado
 * como análise em reavaliação, sem valor publicado nesta edição) e dois
 * pratos compostos. Um deles carregava até data de conferência — uma
 * conferência que não teria como ter acontecido.
 *
 * Citar fonte errada é pior que não citar fonte: dá ao número uma autoridade
 * que ele não tem, e ninguém tem como perceber olhando.
 */
/*
 * Um /TACO/ solto não serve aqui: as fontes honestas MENCIONAM a TACO
 * justamente para dizer que o alimento não está nela ("a TACO 4ª ed. não traz
 * este alimento neste preparo"). O que o teste procura é a alegação — a fonte
 * apresentada como sendo a tabela —, não a palavra.
 */
const ALEGA_TACO = /^\s*TACO\b|^\s*Tabela Brasileira/i;
const mentirosos = soltos.filter((a) => ALEGA_TACO.test(a.fonte));
ok("nenhum alimento sem vínculo cita a TACO como fonte",
  mentirosos.length === 0,
  mentirosos.map((a) => `${a.id} ("${a.fonte}")`).join(", "));

const semDataFalsa = soltos.filter((a) => a.verificadoEm !== undefined);
ok("nenhum alimento sem vínculo carrega data de conferência",
  semDataFalsa.length === 0, semDataFalsa.map((a) => a.id).join(", "));

console.log("\n  Alimentos sem vínculo e o que eles dizem ser:");
for (const a of soltos) console.log(`    ${a.id.padEnd(18)} ${a.fonte}`);

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. O ESTADO DO ALIMENTO CONFERE COM O REGISTRO");

/**
 * Cru e cozido não podem se cruzar. Ligar "arroz cozido" do cardápio ao
 * registro do arroz CRU triplicaria as calorias do prato sem nenhum sinal de
 * erro — os dois são registros válidos da mesma fonte.
 */
for (const a of ligados) {
  const t = porSlug.get(a.taco!);
  if (!t) continue;
  const cruDosDois = a.estado === "cru";
  const cruNaTaco = t.preparo === "cru";
  ok(`${a.id}: estado "${a.estado}" não conflita com "${t.preparo}"`,
    cruDosDois === cruNaTaco || (!cruDosDois && !cruNaTaco),
    `cardápio diz ${a.estado}, TACO diz ${t.preparo} (${t.nome})`);
}

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
