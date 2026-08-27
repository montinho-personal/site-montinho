/**
 * Mede espaçamentos reais no navegador, em vários tamanhos de tela.
 *
 * Existe porque "parece colado" é uma reclamação visual e "acho que está
 * bom" é uma resposta ruim. Este script abre a página no Chromium de
 * verdade, em viewports de celular reais, e devolve a distância em pixels
 * entre os elementos — o que transforma ajuste de layout em algo verificável
 * em vez de opinião.
 *
 * Como usar:
 *   npm run build && npx next start -p 3113 &
 *   node scripts/medir-layout.mjs
 *
 * Para medir outra coisa, edite MEDIDAS: cada entrada é um par de seletores
 * (ou funções) e o script imprime o espaço entre eles.
 */

import { chromium } from "playwright-core";

const URL = process.env.URL ?? "http://localhost:3113/";

/** Viewports que cobrem do celular pequeno ao grande, com e sem barra do navegador. */
const TELAS = [
  ["iPhone SE", 375, 667],
  ["iPhone 14 Pro", 393, 852],
  ["Galaxy c/ browser", 412, 780],
  ["Galaxy inteiro", 412, 915],
  ["bem pequeno", 320, 568],
];

const navegador = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

for (const [nome, largura, altura] of TELAS) {
  const pagina = await navegador.newPage({ viewport: { width: largura, height: altura }, deviceScaleFactor: 2 });
  await pagina.goto(URL, { waitUntil: "networkidle" });

  const medida = await pagina.evaluate(() => {
    const header = document.querySelector("header");
    const eyebrow = [...document.querySelectorAll("p")].find((e) =>
      /Personal Trainer · Alphaville/i.test(e.textContent || "")
    );
    if (!header || !eyebrow) return null;
    return {
      fimDoHeader: header.getBoundingClientRect().bottom,
      inicioDoTexto: eyebrow.getBoundingClientRect().top,
    };
  });

  if (!medida) {
    console.log(`${nome.padEnd(18)} ${largura}x${altura}  elementos não encontrados`);
  } else {
    const folga = medida.inicioDoTexto - medida.fimDoHeader;
    /** Folga negativa significa que o texto está atrás do header. */
    const aviso = folga < 24 ? "  ← APERTADO" : "";
    console.log(
      `${nome.padEnd(18)} ${largura}x${altura}  header termina em ${medida.fimDoHeader.toFixed(0)}px | ` +
        `texto começa em ${medida.inicioDoTexto.toFixed(0)}px | folga = ${folga.toFixed(0)}px${aviso}`
    );
  }
  await pagina.close();
}

await navegador.close();
