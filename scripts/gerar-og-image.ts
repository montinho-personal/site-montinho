/**
 * Gera a imagem de compartilhamento padrão (public/og-image.jpg).
 *
 * Por que existe como script, e não como um arquivo solto: a versão anterior
 * tinha o "MONTINHO" em #111111 sobre fundo preto — praticamente invisível —
 * e o "PERSONAL TRAINER" cortado na borda de baixo. Ninguém percebeu por meses
 * porque essa imagem só aparece no card do WhatsApp e do Facebook, nunca no
 * site. Com o script, refazer a imagem é reproduzível e a razão de cada
 * escolha fica registrada.
 *
 * Fonte da verdade é o próprio `public/logo.svg`: o wordmark continua sendo a
 * letra original da marca, apenas recolorido. Aproximar com uma fonte
 * instalada no servidor daria um texto parecido, mas não igual — e logo
 * quase-igual é pior que logo diferente.
 *
 *   npx tsx scripts/gerar-og-image.ts
 */

import * as fs from "fs";
import sharp from "sharp";

const LARGURA = 1200;
const ALTURA = 630;

/** Mesmo preto do site. */
const FUNDO = "#0a0a0a";
/**
 * Cor do wordmark. As duas linhas usam a mesma, como na logo original — o
 * arquivo de origem as desenha em #111111 justamente para serem invertidas.
 */
const WORDMARK = "#FFFFFF";

const ORIGEM = "public/logo.svg";
const DESTINO = "public/og-image.jpg";

async function main() {
  const svg = fs.readFileSync(ORIGEM, "utf8");

  /**
   * O wordmark são dois grupos com fill="#111111": "MONTINHO" em cima e
   * "PERSONAL TRAINER" embaixo. Os dois viram branco.
   *
   * Uma versão anterior pintava o descritor de dourado, para criar hierarquia
   * e amarrar com o accent do site. Estava errado, e o Montinho reparou: na
   * logo dele as duas linhas têm a mesma cor. Esta imagem aparece em 852
   * páginas e é o que as pessoas veem no WhatsApp — é o rosto da marca fora
   * do site. Ali fidelidade vale mais que hierarquia: hierarquia é problema
   * de página, identidade é problema de marca. A única liberdade que a
   * geração toma é clarear o wordmark, porque o original é quase preto e
   * some no fundo escuro.
   */
  const ocorrencias = (svg.match(/fill="#111111"/g) ?? []).length;
  if (ocorrencias !== 2) {
    throw new Error(
      `logo.svg mudou: esperava 2 grupos com fill="#111111" (o wordmark), achei ${ocorrencias}. ` +
        `Confira quais grupos formam o texto antes de recolorir.`
    );
  }

  const svgColorido = svg.replace(/fill="#111111"/g, `fill="${WORDMARK}"`);

  /**
   * Densidade alta: o SVG é pequeno (469x321) e vai ser ampliado bastante.
   *
   * A largura não é escolha estética, é margem de segurança. O WhatsApp corta
   * para um quadrado (630x630) no preview pequeno, e vários leitores recortam
   * as bordas. A 700px o wordmark perdia as pontas nesse corte — testado. A
   * 560 a marca cabe inteira mesmo no quadrado, ainda com folga lateral.
   */
  const LARGURA_LOGO = 560;
  const logo = await sharp(Buffer.from(svgColorido), { density: 600 })
    .resize({ width: LARGURA_LOGO, fit: "inside" })
    .png()
    .toBuffer();

  const { height: alturaLogo = 0 } = await sharp(logo).metadata();

  await sharp({
    create: {
      width: LARGURA,
      height: ALTURA,
      channels: 3,
      background: FUNDO,
    },
  })
    .composite([
      {
        input: logo,
        // Centralizado, com um leve deslocamento para cima: a logo tem mais
        // massa visual no topo (o halter), e centralizar pelo retângulo faz
        // ela parecer baixa demais.
        top: Math.round((ALTURA - alturaLogo) / 2) - 12,
        left: Math.round((LARGURA - LARGURA_LOGO) / 2),
      },
    ])
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(DESTINO);

  const stat = fs.statSync(DESTINO);
  console.log(`${DESTINO} — ${LARGURA}x${ALTURA}, ${(stat.size / 1024).toFixed(0)} KB`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
