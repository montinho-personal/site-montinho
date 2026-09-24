import { readFileSync } from "fs";
/**
 * Os treinos dos artigos na Calculadora de Volume.
 *   npx tsx scripts/volume-modelos-test.ts
 */
import { MODELOS, modeloDoArtigo } from "../lib/treino/modelos";
import { EXERCICIO_POR_ID } from "../lib/treino/exercicios";
import { ARTIGOS_COM_CALCULADORA_VOLUME, calculaVolume, itemDeExercicio } from "../lib/treino/volume";
import { blogPosts } from "../lib/blog";

let falhas = 0;
const ok = (n: string, c: boolean, d = "") => { if (!c) { falhas++; console.log(`  FALHOU  ${n} ${d}`); } else console.log(`  ok      ${n}`); };

for (const m of MODELOS) {
  const ids = m.dias.flatMap((d) => d.itens.map((i) => i.id));
  const faltando = ids.filter((id) => !EXERCICIO_POR_ID.get(id));
  ok(`${m.nome}: todo exercício existe na base`, faltando.length === 0, faltando.join(", "));
  ok(`${m.nome}: o artigo existe e embute a calculadora`, blogPosts.some((p) => p.slug === m.slug) && ARTIGOS_COM_CALCULADORA_VOLUME.includes(m.slug));
  ok(`${m.nome}: o artigo encontra o próprio modelo`, modeloDoArtigo(m.slug)?.id === m.id);
  ok(`${m.nome}: dias sem repetir`, new Set(m.dias.map((d) => d.dia)).size === m.dias.length);
  const dias = m.dias.map((d, k) => ({
    uid: `d${k}`, dia: d.dia, nome: d.nome,
    itens: d.itens.map((x, i) => itemDeExercicio(EXERCICIO_POR_ID.get(x.id)!, `i${k}-${i}`, x.series)),
  }));
  const vol = calculaVolume(dias);
  ok(`${m.nome}: dá resultado (volume em peito, costas e quadríceps)`,
    ["peitoral", "costas", "quadriceps"].every((mu) => (vol.find((v) => v.musculo === mu)?.diretas ?? 0) > 0),
    vol.filter((v) => v.diretas > 0).map((v) => v.musculo).join(","));
}

/* O artigo ainda publica a ficha que o modelo copia. Se alguém reescrever
   o artigo, este teste avisa que o modelo ficou para trás. */
const texto = (slug: string) => blogPosts.find((p) => p.slug === slug)!.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const ul = texto("treino-upper-lower-superior-inferior");
ok("Upper/Lower: o artigo publica as quatro fichas", /Upper A/.test(ul) && /Lower A/.test(ul) && /Upper B/.test(ul) && /Lower B/.test(ul) && /Hip thrust com barra 4/.test(ul));
const ppl = texto("push-pull-legs");
ok("PPL: o artigo publica Push, Pull e Legs", /Exemplo de treino Push/.test(ppl) && /Exemplo de treino Pull/.test(ppl) && /Exemplo de treino Legs/.test(ppl) && /Panturrilha em pé — 4x15-20/.test(ppl));
const abc = texto("como-montar-treino-abc");
ok("ABC: o artigo publica A, B e C", /Exemplo de Treino A/.test(abc) && /Exemplo de Treino B/.test(abc) && /Exemplo de Treino C/.test(abc) && /Panturrilha no leg press: 4/.test(abc));

const comp = readFileSync("components/volume/CalculadoraVolume.tsx", "utf8");
ok("a calculadora oferece o modelo do artigo", /modeloDoArtigo\(placement\)/.test(comp) && /Comece pelo treino deste artigo/.test(comp));
ok("substituir uma ficha já montada pede confirmação", /confirmandoModelo/.test(comp) && /Sim, substituir/.test(comp));
ok("o carregamento é medido à parte (não infla 'complete' sem ação)", /training_volume_template_loaded/.test(comp) && readFileSync("lib/analytics.ts", "utf8").includes('"training_volume_template_loaded"'));

console.log(`\n${falhas === 0 ? "TUDO OK" : `${falhas} FALHA(S)`}\n`);
process.exit(falhas === 0 ? 0 : 1);
