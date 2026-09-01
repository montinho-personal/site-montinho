/**
 * Move o vídeo de cada artigo para o fim do texto.
 *   npx tsx scripts/videos-para-o-fim.ts          (relatório, não grava)
 *   npx tsx scripts/videos-para-o-fim.ts --grava  (aplica)
 *
 * POR QUÊ
 *
 * Em 587 dos 813 artigos com vídeo, o primeiro player é de outro canal — na
 * maioria, Leandro Twin / Monster Cast. Em 380 deles ele aparece no primeiro
 * terço, antes de a pessoa ler uma linha do Montinho. O player do YouTube
 * traz o nome do canal clicável, então o artigo que acabou de ganhar a
 * posição no Google oferecia, como elemento mais chamativo da tela, a saída
 * para o canal de um concorrente.
 *
 * No fim do texto o mesmo vídeo muda de função: deixa de competir com o
 * artigo e vira referência de aprofundamento, que é o que ele sempre foi.
 *
 * O QUE CONTA COMO "O VÍDEO"
 *
 * Não é só o `<iframe>`. Quase todo player vem precedido de uma frase que o
 * anuncia — "Se preferir, assista ao video abaixo", "veja a análise do
 * Leandro Twin:". Mover o player sozinho deixaria essa frase órfã, apontando
 * para um vídeo que não está mais ali. A unidade movida é frase + player.
 *
 * TRÊS FORMATOS
 *
 * O acervo tem três marcações diferentes para a mesma coisa, herdadas de
 * épocas diferentes: `div.yt-embed` completo, `div.yt-wrapper` solto e
 * iframe dentro de divs com style inline. O script trata os três.
 */

import { readFileSync, writeFileSync } from "node:fs";

const GRAVA = process.argv.includes("--grava");
const ARQ = "lib/blog.ts";

/**
 * Chamadas que apontam para uma seção que passa a ficar ACIMA do vídeo.
 *
 * "Antes de ver o resumo, assista a este vídeo" fica sem sentido quando o
 * vídeo desce para depois do resumo. A maioria das chamadas com "antes"
 * sobrevive à mudança — "antes de fechar", "antes de decidir", "antes de
 * pisar na academia" continuam verdadeiras no fim do texto. Só quebram as que
 * nomeiam uma seção posterior.
 *
 * Nesses casos o script NÃO move e reporta, em vez de gerar texto errado.
 * Três artigos não valem uma automação que adivinha redação.
 */
const REFERE_SECAO = /\bantes\b[^.;:!?]{0,40}?\b(resumo|plano final|conclus|perguntas frequentes|se(ç|c)(ã|a)o seguinte)/i;

/** Seções que encerram o artigo: o vídeo entra ANTES delas, nunca depois. */
const ENCERRAMENTO = /<h[23][^>]*>\s*(leia também:?|referências|referencias|fontes|perguntas frequentes)\s*<\/h[23]>/i;

/**
 * Acha o bloco do player a partir da posição do iframe, subindo até o
 * contêiner que o embrulha. Devolve [inicio, fim) no texto.
 */
function delimitaPlayer(c: string, idxIframe: number): [number, number] {
  const fimIframe = c.indexOf("</iframe>", idxIframe) + "</iframe>".length;
  if (fimIframe < idxIframe) throw new Error("iframe sem fechamento");

  /* Sobe pelos <div> abertos imediatamente antes do iframe. */
  let ini = idxIframe;
  let fim = fimIframe;
  for (;;) {
    const antes = c.slice(0, ini);
    const abre = antes.lastIndexOf("<div");
    if (abre === -1) break;
    /* Só sobe se entre o <div> e o iframe não houver nada além de espaço/tags de embrulho. */
    const meio = c.slice(abre, ini);
    if (!/^<div[^>]*>\s*$/.test(meio)) break;
    const fecha = c.indexOf("</div>", fim);
    if (fecha === -1) break;
    ini = abre;
    fim = fecha + "</div>".length;
  }

  /*
   * E, por último, o contêiner `div.yt-embed`, que existe em 377 artigos.
   *
   * A subida acima não chega nele porque entre o `<div class="yt-embed">` e o
   * player existe a legenda — um `<p>` —, e o passo só sobe por div que
   * embrulha o player direto. No ensaio isso movia a legenda e o wrapper para
   * o fim e deixava para trás um `div.yt-embed` vazio: o bloco perderia o
   * próprio CSS e sobraria uma casca no meio do texto.
   */
  const marca = '<div class="yt-embed">';
  const abreEmbed = c.lastIndexOf(marca, ini);
  if (abreEmbed !== -1) {
    let nivel = 0;
    for (let i = abreEmbed; i < c.length; ) {
      if (c.startsWith("<div", i)) { nivel++; i += 4; continue; }
      if (c.startsWith("</div>", i)) {
        nivel--;
        i += 6;
        if (nivel === 0) {
          /* Só adota se este contêiner realmente embrulha o player. */
          if (abreEmbed <= ini && i >= fim) return [abreEmbed, i];
          break;
        }
        continue;
      }
      i++;
    }
  }
  return [ini, fim];
}

/**
 * A frase que anuncia o vídeo, se existir logo acima do player.
 *
 * A primeira versão usava /<p[^>]*>[\s\S]*?<\/p>\s*$/ sobre o texto anterior
 * ao player. Parece certo e está errado: ancorado no fim, o quantificador
 * preguiçoso casa a partir do PRIMEIRO <p> que consegue alcançar o fim — ou
 * seja, da abertura do artigo. No ensaio isso moveu 7.737 caracteres de
 * "por-que-voce-nao-consegue-emagrecer", o texto inteiro de introdução, para
 * depois das referências.
 *
 * A busca correta é para trás: o último </p> antes do player, e daí o <p>
 * que o abre.
 */
function delimitaChamada(c: string, iniPlayer: number, autor: string): number {
  const antes = c.slice(0, iniPlayer);
  if (!/^\s*$/.test(antes.slice(antes.lastIndexOf("</p>") + 4))) return iniPlayer;
  const fecha = antes.lastIndexOf("</p>");
  if (fecha === -1) return iniPlayer;
  const abre = antes.lastIndexOf("<p", fecha);
  if (abre === -1) return iniPlayer;
  const texto = antes.slice(abre, fecha).replace(/<[^>]+>/g, " ").trim();

  /*
   * Só leva junto se a frase FALA do vídeo — senão seria roubar um parágrafo
   * do artigo e jogá-lo depois das referências.
   *
   * "abaixo" e "veja" sozinhos são largos demais. Em
   * "como-prevenir-lesoes-no-treino", o parágrafo de abertura termina em
   * "semanas de treino vão por água ABAIXO" e foi capturado como se fosse
   * chamada de vídeo. O critério agora exige a palavra vídeo/assistir/player,
   * ou uma frase curta terminada em dois-pontos — que é como as chamadas sem
   * a palavra "vídeo" se apresentam ("veja a análise do Leandro Twin:").
   */
  const falaDoVideo = /\b(v[íi]deos?|assist[aei]|player)\b/i.test(texto);
  const apresenta = texto.length <= 200 && /:\s*$/.test(texto);
  /*
   * E o vínculo mais forte de todos: a frase nomear o autor DAQUELE vídeo.
   * "...este guia completo de musculação do Leandro Twin organiza os
   * fundamentos" não usa a palavra vídeo, mas está inequivocamente
   * apresentando o player que vem logo abaixo.
   */
  const citaAutor = autor.length > 4 && texto.length <= 300 && texto.includes(autor);
  return falaDoVideo || apresenta || citaAutor ? abre : iniPlayer;
}

const src = readFileSync(ARQ, "utf8");
const posts = [...src.matchAll(/\n\s*slug: "([^"]+)"/g)].map((m) => ({ i: m.index!, slug: m[1] }));

let movidos = 0;
let jaNoFim = 0;
let semVideo = 0;
let maiorUnidade = 0;
const semEspaco = (t: string) => t.replace(/\s+/g, "");
/**
 * Assinatura do conteúdo, ignorando ORDEM e espaço.
 *
 * Comparar as strings direto não serve: mover um trecho muda a ordem por
 * definição, então a igualdade falharia sempre. O que precisa ser idêntico é
 * o CONJUNTO de caracteres — se um só entrou ou sumiu, o recorte pegou o que
 * não devia.
 */
const assinatura = (t: string) => [...semEspaco(t)].sort().join("");
const amostras: string[] = [];
const chamadas: string[] = [];
const revisar: string[] = [];
const orfas: string[] = [];
let saida = "";
let cursor = 0;

for (let k = 0; k < posts.length; k++) {
  const ini = posts[k].i;
  const fimPost = k + 1 < posts.length ? posts[k + 1].i : src.length;
  const bloco = src.slice(ini, fimPost);

  const mc = bloco.match(/content: `/);
  if (!mc) continue;
  const cIni = ini + mc.index! + mc[0].length;
  /*
   * O fim do template literal é a próxima crase — e só.
   *
   * A primeira versão procurava "`," e pulava EM SILÊNCIO os 10 artigos em
   * que `content` é o último campo do objeto e portanto não tem vírgula
   * depois. Todos ficaram com o vídeo no começo, e o relatório não disse
   * nada porque "pular" e "nada a fazer" eram indistinguíveis. Agora, se o
   * conteúdo não puder ser delimitado, o script para.
   */
  const cFimRel = bloco.indexOf("`", mc.index! + mc[0].length);
  if (cFimRel === -1) {
    console.log(`\nABORTADO em ${posts[k].slug}: não achei o fim do content.`);
    process.exit(1);
  }
  const cFim = ini + cFimRel;

  const c = src.slice(cIni, cFim);
  if (!/youtube\.com\/embed/.test(c)) { semVideo++; continue; }

  /*
   * TODOS os vídeos do artigo, não só o primeiro.
   *
   * Nove artigos têm dois players. Tratando um só, cada execução movia o
   * primeiro para o fim e deixava o segundo atrás dele — na execução
   * seguinte os papéis se invertiam, e o script trocava os dois de lugar
   * para sempre. Rodar duas vezes tem que dar o mesmo resultado que rodar
   * uma; sem isso não é migração, é oscilação.
   */
  const unidades: [number, number][] = [];
  let busca = 0;
  /*
   * Chamada que talvez não sobreviva à mudança de lugar. Marcar não basta
   * para recusar: se o vídeo JÁ está no fim, não há mudança nenhuma para
   * quebrar a frase, e reportar seria ruído. A decisão sai depois de saber
   * se o artigo muda — foi o caso de "como-fazer-supino-reto", cujo vídeo
   * está em 91% do texto e apareceu na lista de revisão sem precisar.
   */
  let duvidosa = false;
  const abortar = false;
  for (;;) {
    const idx = c.indexOf("<iframe", busca);
    if (idx === -1) break;
    if (!/youtube\.com\/embed/.test(c.slice(idx, idx + 200))) { busca = idx + 7; continue; }

    const [pIni, pFim] = delimitaPlayer(c, idx);
    const titulo = c.slice(idx, idx + 500).match(/title="([^"]*)"/)?.[1] ?? "";
    const autor = titulo.includes("—") ? titulo.split("—").pop()!.trim() : "";
    const uIni = delimitaChamada(c, pIni, autor);

    if (uIni < pIni && REFERE_SECAO.test(c.slice(uIni, pIni).replace(/<[^>]+>/g, " "))) {
      duvidosa = true;
    }
    if (uIni === pIni) {
      const ant = c.slice(0, pIni);
      const f = ant.lastIndexOf("</p>");
      if (f !== -1 && /^\s*$/.test(ant.slice(f + 4))) {
        const a = ant.lastIndexOf("<p", f);
        const t = ant.slice(a, f).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        orfas.push(`${posts[k].slug} :: …${t.slice(-120)}`);
        /* "antes de" só conta como conector se ABRE a frase — senão pega o
           próprio assunto do artigo ("carboidrato antes do treino"). */
        if (t.length <= 320 && /^antes d[eo]\b|\bvale (entender|assistir|conferir)\b/i.test(t)) {
          duvidosa = true;
        }
      }
    }
    /* Uma unidade não pode invadir a anterior. */
    if (unidades.length && uIni < unidades[unidades.length - 1][1]) {
      console.log(`\nABORTADO em ${posts[k].slug}: unidades de vídeo sobrepostas.`);
      process.exit(1);
    }
    unidades.push([uIni, pFim]);
    busca = pFim;
  }
  if (abortar || unidades.length === 0) { if (!abortar) semVideo++; continue; }

  /* Remove todas, preservando a ordem em que aparecem. */
  let resto = "";
  let ant = 0;
  const textos: string[] = [];
  for (const [a, b] of unidades) { resto += c.slice(ant, a); textos.push(c.slice(a, b).trim()); ant = b; }
  resto += c.slice(ant);

  const mEnc = resto.match(ENCERRAMENTO);
  const alvo = mEnc ? mEnc.index! : resto.length;
  const novo =
    resto.slice(0, alvo).replace(/\s*$/, "") + "\n\n" + textos.join("\n\n") + "\n\n" + resto.slice(alvo);

  /*
   * Idempotência por comparação direta, não por heurística de posição.
   * Se o resultado é igual ao que já está no arquivo, não há o que mover.
   */
  if (novo === c) { jaNoFim++; continue; }
  if (duvidosa) { revisar.push(posts[k].slug); continue; }

  /*
   * Mover um trecho não pode mudar UM caractere que não seja espaço. Se
   * mudou, o recorte pegou o que não devia — foi assim que o ensaio flagrou
   * a introdução inteira de um artigo indo parar depois das referências.
   */
  if (assinatura(novo) !== assinatura(c)) {
    console.log(`\nABORTADO em ${posts[k].slug}: o conteúdo mudou além de espaços.`);
    process.exit(1);
  }
  for (const t of textos) maiorUnidade = Math.max(maiorUnidade, t.length);
  chamadas.push(...textos.filter((t) => !t.startsWith("<div") && !t.startsWith("<p class=\"yt-caption\"")).map((t) => t.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 150)));

  if (amostras.length < 3) {
    amostras.push(
      `\n### ${posts[k].slug}\n  ${unidades.length} vídeo(s), primeiro estava em ${Math.round((unidades[0][0] / c.length) * 100)}% do texto\n  ${textos[0].replace(/\s+/g, " ").slice(0, 200)}…\n  passa a ficar ${mEnc ? `antes de "${mEnc[1]}"` : "no fim do artigo"}`,
    );
  }

  saida += src.slice(cursor, cIni) + novo;
  cursor = cFim;
  movidos++;
}
saida += src.slice(cursor);

console.log(`artigos sem vídeo:        ${semVideo}`);
console.log(`vídeo já estava no fim:   ${jaNoFim}`);
console.log(`vídeos movidos:           ${movidos}`);
console.log(`deixados para revisão:    ${revisar.length}${revisar.length ? "  → " + revisar.join(", ") : ""}`);
console.log(amostras.join("\n"));

/* Invariantes: mover não pode criar nem perder nada. */
const conta = (t: string, re: RegExp) => (t.match(re) ?? []).length;
const igual = (re: RegExp, nome: string) => {
  const a = conta(src, re), b = conta(saida, re);
  console.log(`  ${a === b ? "ok    " : "FALHOU"}  ${nome}: ${a} → ${b}`);
  return a === b;
};
console.log("\nconferência:");
const ok =
  [
    igual(/youtube\.com\/embed/g, "iframes de vídeo"),
    igual(/<iframe/g, "tags iframe"),
    igual(/<\/iframe>/g, "fechamentos de iframe"),
    igual(/<div/g, "divs abertas"),
    igual(/<\/div>/g, "divs fechadas"),
    igual(/<p[ >]/g, "parágrafos"),
    igual(/<h2/g, "h2"),
    igual(/slug: "/g, "artigos"),
    igual(/<div class="yt-embed">/g, "contêineres yt-embed"),
    igual(/<p class="yt-caption">/g, "legendas de vídeo"),
  ].every(Boolean) && assinatura(src) === assinatura(saida);

console.log(`\n  ${assinatura(src) === assinatura(saida) ? "ok    " : "FALHOU"}  nenhum caractere entrou ou sumiu (${semEspaco(src).length} não-espaços)`);
console.log(`\nmaior unidade movida: ${maiorUnidade} caracteres`);
if (process.argv.includes("--orfas")) {
  console.log(`\n${orfas.length} artigos em que o parágrafo anterior NÃO foi levado junto:`);
  for (const t of orfas) console.log("   • " + t);
}
if (process.argv.includes("--chamadas")) {
  const u = [...new Set(chamadas)].sort();
  console.log(`\n${chamadas.length} chamadas levadas junto (${u.length} distintas):`);
  for (const t of u) console.log("   • " + t.slice(0, 150));
}

/* Nenhum contêiner de vídeo pode ficar vazio: seria casca abandonada no texto. */
const vazios = (saida.match(/<div class="yt-embed">\s*<\/div>/g) ?? []).length;
console.log(`  ${vazios === 0 ? "ok    " : "FALHOU"}  nenhum yt-embed vazio: ${vazios}`);

/* Toda legenda tem que continuar colada no seu player. */
const soltas = (saida.match(/<p class="yt-caption">[\s\S]{0,400}?<\/p>/g) ?? []).filter((leg) => {
  const i = saida.indexOf(leg);
  return !/^\s*<div class="yt-wrapper">/.test(saida.slice(i + leg.length, i + leg.length + 40));
}).length;
console.log(`  ${soltas === 0 ? "ok    " : "FALHOU"}  nenhuma legenda órfã: ${soltas}`);

if (!ok) {
  console.log("\nCONFERÊNCIA FALHOU — nada foi gravado.");
  process.exit(1);
}
if (GRAVA) {
  writeFileSync(ARQ, saida);
  console.log("\ngravado.");
} else {
  console.log("\n(relatório apenas — rode com --grava para aplicar)");
}
