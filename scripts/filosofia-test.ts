/**
 * Testes da nota de método.
 *   npx tsx scripts/filosofia-test.ts
 */
import { FILOSOFIAS, pickFilosofia, clusterRecebeNota } from "../lib/filosofia";
import { blogPosts } from "../lib/blog";
import { planCTAs } from "../lib/cta/classify";

let falhas = 0;
const check = (nome: string, cond: boolean, det = "") => {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${det}`); }
  else console.log(`  ok      ${nome}`);
};

console.log("VARIANTES");
check("ids únicos", new Set(FILOSOFIAS.map((f) => f.id)).size === FILOSOFIAS.length);
check("títulos únicos", new Set(FILOSOFIAS.map((f) => f.titulo)).size === FILOSOFIAS.length);
check("toda variante tem o marcador {link}", FILOSOFIAS.every((f) => f.texto.includes("{link}")));
check("nenhum texto repetido", new Set(FILOSOFIAS.map((f) => f.texto)).size === FILOSOFIAS.length);

// A mensagem central precisa aparecer de algum jeito em toda variante.
const NUCLEO = /(estratégia|caminho|plano|direç|método)/i;
check("toda variante fala de estratégia/direção", FILOSOFIAS.every((f) => NUCLEO.test(f.texto)));

// Ponte para acompanhamento em todas — é o pedido central.
check(
  "toda variante faz a ponte para o acompanhamento",
  FILOSOFIAS.every((f) => /\{link\}/.test(f.texto))
);

// Nada de promessa, urgência ou superlativo.
const PROIBIDO = /(garantid|resultado certo|em \d+ dias|fórmula infalível|única forma|melhor personal do|revolucionári|última chance|não perca)/i;
check("nenhuma promessa ou urgência falsa", FILOSOFIAS.every((f) => !PROIBIDO.test(f.texto)));

// Tamanho: nota, não artigo.
check(
  "textos entre 180 e 600 caracteres",
  FILOSOFIAS.every((f) => f.texto.length >= 180 && f.texto.length <= 600),
  FILOSOFIAS.map((f) => `${f.id}:${f.texto.length}`).join(" ")
);

console.log("\nESCOLHA DETERMINÍSTICA");
check("mesma chave → mesma variante", pickFilosofia("abc").id === pickFilosofia("abc").id);
check(
  "chaves diferentes usam variantes diferentes",
  new Set(["a", "bb", "ccc", "dddd", "eeeee"].map((k) => pickFilosofia(k).id)).size > 1
);

console.log("\nCOBERTURA NOS ARTIGOS");
const comNota = blogPosts.filter((p) => clusterRecebeNota(planCTAs(p, { renderEnd: false }).cluster));
console.log(`  ${comNota.length}/${blogPosts.length} artigos recebem a nota (${((comNota.length / blogPosts.length) * 100).toFixed(0)}%)`);

// Página local/serviço/academia não é dica de treino.
check("página de serviço local não recebe nota", !clusterRecebeNota("local_service"));
check("página de academia não recebe nota", !clusterRecebeNota("gym_local"));
check("cidade fora da região não recebe nota", !clusterRecebeNota("local_other"));
check("artigo de exercício recebe nota", clusterRecebeNota("exercise"));

// Distribuição: nenhuma variante pode concentrar demais.
const dist = new Map<string, number>();
comNota.forEach((p) => {
  const id = pickFilosofia(p.slug).id;
  dist.set(id, (dist.get(id) ?? 0) + 1);
});
const maior = Math.max(...dist.values());
check(
  "nenhuma variante passa de 25% dos artigos",
  maior / comNota.length <= 0.25,
  `(maior: ${((maior / comNota.length) * 100).toFixed(0)}%)`
);
check("todas as variantes são usadas", dist.size === FILOSOFIAS.length);

console.log("\n" + (falhas === 0 ? "TODOS OS TESTES PASSARAM" : `${falhas} FALHARAM`));
process.exit(falhas === 0 ? 0 : 1);
