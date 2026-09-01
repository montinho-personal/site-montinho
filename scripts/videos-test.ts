/**
 * Os vídeos dos artigos: onde ficam e como são medidos.
 *   npx tsx scripts/videos-test.ts
 *
 * Duas decisões precisam de trava aqui, e as duas têm o mesmo motivo de
 * fundo: o vídeo é o único elemento do artigo que leva a pessoa para fora do
 * site — e, em 587 dos 813 artigos, para o canal de outro treinador.
 *
 * 1. LUGAR. Vídeo no começo compete com o texto que a pessoa veio ler. No
 *    fim, o mesmo vídeo vira referência de aprofundamento.
 * 2. MEDIÇÃO. Sem saber quantos apertam play, qualquer decisão sobre vídeo
 *    é palpite. E medir play dentro de iframe de outro domínio não é
 *    possível — daí a capa.
 */

import { readFileSync } from "node:fs";
import { blogPosts } from "../lib/blog";

let falhas = 0;
function ok(nome: string, cond: boolean, detalhe = "") {
  if (!cond) { falhas++; console.log(`  FALHOU  ${nome} ${detalhe}`); }
  else console.log(`  ok      ${nome}`);
}
function bloco(t: string) {
  console.log("\n" + "=".repeat(64) + "\n" + t + "\n" + "=".repeat(64));
}

const componente = readFileSync("components/blog/VideoMedido.tsx", "utf8");
const pagina = readFileSync("app/blog/[slug]/page.tsx", "utf8");
const analytics = readFileSync("lib/analytics.ts", "utf8");

// ─── 1 ──────────────────────────────────────────────────────────────────────
bloco("1. TODO VÍDEO FICA NO ÚLTIMO TERÇO DO ARTIGO");

{
  const cedo: string[] = [];
  let comVideo = 0;
  for (const p of blogPosts) {
    const i = p.content.search(/<iframe[^>]*youtube\.com\/embed/);
    if (i === -1) continue;
    comVideo++;
    const fracao = i / p.content.length;
    if (fracao < 2 / 3) cedo.push(`${p.slug} (${Math.round(fracao * 100)}%)`);
  }
  ok(`existem artigos com vídeo para checar (${comVideo})`, comVideo > 500);
  ok("nenhum vídeo antes do último terço", cedo.length === 0, cedo.slice(0, 8).join(", "));
}

// ─── 2 ──────────────────────────────────────────────────────────────────────
bloco("2. NENHUMA CHAMADA DE VÍDEO FICOU ÓRFÃ");

/**
 * A frase que anuncia o vídeo ("Se preferir, assista ao video abaixo") tem
 * que viajar junto com ele. Deixá-la para trás cria uma promessa apontando
 * para um player que não está mais ali — foi o risco número um da migração.
 */
{
  const orfas: string[] = [];
  for (const p of blogPosts) {
    for (const m of p.content.matchAll(/<p class="yt-caption">[\s\S]*?<\/p>/g)) {
      /*
       * Nem toda legenda encosta no player: em alguns artigos existe um
       * parágrafo de contexto entre os dois, dentro do mesmo bloco. O que
       * não pode é a legenda ficar sem player nenhum à vista.
       */
      const depois = p.content.slice(m.index! + m[0].length, m.index! + m[0].length + 800);
      if (!/youtube\.com\/embed/.test(depois)) orfas.push(p.slug);
    }
  }
  ok("toda legenda continua colada no seu player", orfas.length === 0, orfas.slice(0, 5).join(", "));

  const cascas = blogPosts.filter((p) => /<div class="yt-embed">\s*<\/div>/.test(p.content));
  ok("nenhum contêiner de vídeo vazio", cascas.length === 0, cascas.map((p) => p.slug).join(", "));
}

// ─── 3 ──────────────────────────────────────────────────────────────────────
bloco("3. O VÍDEO NÃO PASSA DAS SEÇÕES DE ENCERRAMENTO");

/**
 * "Leia também" e "Referências" fecham o artigo. Vídeo depois delas fica
 * pendurado fora do texto, e o bloco de links internos — que é o que segura a
 * pessoa no site — perde o lugar de última coisa lida.
 */
{
  const depois: string[] = [];
  for (const p of blogPosts) {
    const v = p.content.search(/<iframe[^>]*youtube\.com\/embed/);
    if (v === -1) continue;
    const enc = p.content.search(/<h[23][^>]*>\s*(leia também:?|referências)\s*<\/h[23]>/i);
    if (enc !== -1 && v > enc) depois.push(p.slug);
  }
  ok("nenhum vídeo depois de 'Leia também' ou 'Referências'", depois.length === 0, depois.slice(0, 5).join(", "));
}

// ─── 4 ──────────────────────────────────────────────────────────────────────
bloco("4. A MEDIÇÃO DO PLAY");

ok("os dois eventos estão declarados",
  analytics.includes('"article_video_view"') && analytics.includes('"article_video_play"'));
ok("o componente está montado na página do artigo", /<VideoMedido slug=\{post\.slug\}/.test(pagina));

/**
 * O denominador. "40 plays" não responde nada sozinho — precisa do número de
 * pessoas que tiveram o vídeo na frente.
 */
ok("mede exposição além do play", /article_video_view[\s\S]{0,200}video_count/.test(componente));
ok("o play identifica o vídeo e a posição",
  /article_video_play[\s\S]{0,200}video_id[\s\S]{0,60}video_position/.test(componente));

/**
 * O erro que já aconteceu uma vez neste arquivo: `querySelector` no
 * singular. O artigo é cortado em vários `.prose-blog` quando tem
 * calculadora ou CTA no meio, e como o vídeo agora fica no fim, ele cai
 * quase sempre no último pedaço. No singular a medição não pegava nada
 * justamente nos artigos maiores.
 */
ok("procura em TODOS os blocos do artigo",
  /querySelectorAll<HTMLIFrameElement>\('\.prose-blog iframe/.test(componente) &&
  !/document\.querySelector\("\.prose-blog"\)/.test(componente));

// ─── 5 ──────────────────────────────────────────────────────────────────────
bloco("5. A CAPA É ACESSÍVEL E REVERSÍVEL");

ok("a capa é um button de verdade", /createElement\("button"\)/.test(componente) && /capa\.type = "button"/.test(componente));
ok("tem nome acessível vindo do título do vídeo",
  /aria-label"?, `Assistir ao vídeo/.test(componente));
ok("a seta de play é decorativa para leitor de tela", /seta\.setAttribute\("aria-hidden"/.test(componente));

/**
 * Progressivo: o iframe original nunca é removido, só escondido. Se o script
 * falhar, o vídeo continua funcionando — perde-se a medição, não o conteúdo.
 */
ok("o iframe original é escondido, não destruído",
  /iframe\.style\.visibility = "hidden"/.test(componente) && !/iframe\.remove\(\)/.test(componente));
ok("o efeito desfaz o que fez ao desmontar", /return \(\) => desfazer\.forEach/.test(componente));

/**
 * O YouTube só é contatado quando a pessoa pede o vídeo. Antes disso, a
 * única requisição é a miniatura.
 */
ok("o autoplay entra só no clique", /autoplay=1/.test(componente) && /const toca = \(\)/.test(componente));
ok("miniatura tem alternativa quando a maxres não existe",
  /teste\.onerror/.test(componente) && /hqdefault/.test(componente));

// ─── 6 ──────────────────────────────────────────────────────────────────────
bloco("6. O EVENTO NÃO CARREGA DADO DE NINGUÉM");

/**
 * `video_id` e `placement` são conteúdo editorial nosso — o vídeo escolhido
 * e o artigo em que está. Nada ali descreve quem assistiu.
 */
{
  const chamadas = componente.match(/trackEvent\([^;]*\)/g) ?? [];
  ok("existem chamadas para auditar", chamadas.length >= 2);
  const SENSIVEL = /\b(peso|kcal|idade|sexo|altura|email|nome|telefone|pergunta)\b/i;
  ok("nenhuma chamada carrega dado pessoal",
    chamadas.every((c) => !SENSIVEL.test(c)),
    chamadas.filter((c) => SENSIVEL.test(c)).join(" | "));
}

console.log("\n" + "=".repeat(64));
if (falhas > 0) {
  console.log(`${falhas} TESTE(S) FALHARAM`);
  process.exit(1);
}
console.log("TODOS OS TESTES PASSARAM");
