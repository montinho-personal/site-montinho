"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

/**
 * Mede quantas pessoas realmente dão play nos vídeos dos artigos.
 *
 * POR QUE NÃO DÁ PARA MEDIR O IFRAME DIRETO
 *
 * O player do YouTube roda num iframe de outro domínio. O navegador isola
 * esse conteúdo por segurança, então a página não enxerga o clique lá dentro
 * — nem com listener no elemento. Existe um truque conhecido (observar o
 * `blur` da janela e ver se o foco caiu no iframe), mas ele erra nos dois
 * sentidos: dispara quando a pessoa só rolou por cima e não dispara quando
 * ela dá play com o teclado. Número que erra é pior que número nenhum,
 * porque parece dado.
 *
 * A SOLUÇÃO É INVERTER QUEM DÁ O PRIMEIRO CLIQUE
 *
 * O componente troca cada player por uma capa: a miniatura do próprio vídeo
 * com um botão de play por cima. O primeiro clique é NOSSO — logo, contável
 * com precisão — e só então o iframe real entra na página, já com autoplay.
 * Para quem assiste, a diferença é nenhuma: um toque, o vídeo começa.
 *
 * TRÊS GANHOS DE BRINDE
 *
 * 1. Peso. O embed do YouTube carrega muito JavaScript em toda visita, mesmo
 *    quando ninguém assiste. A capa é uma imagem.
 * 2. Cookies. O YouTube só passa a ser contatado quando a pessoa pede o
 *    vídeo — o que é o comportamento correto de qualquer forma.
 * 3. Progressivo. Se o script não rodar, o iframe original continua lá e o
 *    vídeo funciona como sempre. A medição é que se perde, não o conteúdo.
 */

/** Miniaturas do YouTube, da melhor para a que sempre existe. */
const CAPAS = ["maxresdefault", "hqdefault"] as const;

export default function VideoMedido({ slug }: { slug: string }) {
  useEffect(() => {
    /*
     * TODOS os blocos, não o primeiro.
     *
     * O artigo é cortado em vários `.prose-blog` quando leva calculadora ou
     * CTA no meio, e agora que o vídeo desceu para o fim ele quase sempre
     * cai no último pedaço. Com `querySelector` no singular, a medição
     * silenciosamente não pegava nada justamente nos artigos maiores.
     */
    const iframes = [
      ...document.querySelectorAll<HTMLIFrameElement>('.prose-blog iframe[src*="youtube.com/embed/"]'),
    ];
    if (iframes.length === 0) return;
    const desfazer: (() => void)[] = [];

    iframes.forEach((iframe, i) => {
      const id = iframe.src.match(/embed\/([\w-]+)/)?.[1];
      if (!id) return;

      const capa = document.createElement("button");
      capa.type = "button";
      /*
       * O nome acessível vem do title do próprio iframe, que já descreve o
       * vídeo. Um botão chamado "play" não diz a um leitor de tela qual dos
       * vídeos da página vai tocar.
       */
      capa.setAttribute("aria-label", `Assistir ao vídeo: ${iframe.title || "vídeo do artigo"}`);
      capa.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;border:0;padding:0;cursor:pointer;" +
        "background:#000 center/cover no-repeat;border-radius:12px;display:block";
      capa.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/${CAPAS[0]}.jpg)`;

      /*
       * Nem todo vídeo tem maxresdefault — vídeo antigo ou de baixa
       * resolução devolve uma imagem cinza de 120px. Testar antes evita
       * mostrar a placeholder do YouTube como se fosse a capa.
       */
      const teste = new Image();
      const menor = () => { capa.style.backgroundImage = `url(https://i.ytimg.com/vi/${id}/${CAPAS[1]}.jpg)`; };
      teste.onload = () => { if (teste.naturalWidth <= 120) menor(); };
      /* 404 na maxres é comum em vídeo antigo — a hqdefault existe sempre. */
      teste.onerror = menor;
      teste.src = `https://i.ytimg.com/vi/${id}/${CAPAS[0]}.jpg`;

      const seta = document.createElement("span");
      seta.setAttribute("aria-hidden", "true");
      seta.textContent = "▶";
      seta.style.cssText =
        "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:68px;" +
        "border-radius:50%;background:rgba(0,0,0,.72);color:#fff;font-size:24px;line-height:68px;" +
        "text-align:center;pointer-events:none;box-shadow:0 2px 16px rgba(0,0,0,.5)";
      capa.appendChild(seta);

      const pai = iframe.parentElement;
      if (!pai) return;
      const antes = iframe.style.visibility;
      /* O iframe fica, mas invisível: se o clique falhar, é só voltar a mostrar. */
      iframe.style.visibility = "hidden";
      pai.appendChild(capa);

      const toca = () => {
        trackEvent("article_video_play", { placement: slug, video_id: id, video_position: i + 1 });
        iframe.src = iframe.src.includes("?") ? `${iframe.src}&autoplay=1` : `${iframe.src}?autoplay=1`;
        iframe.style.visibility = antes;
        capa.remove();
      };
      capa.addEventListener("click", toca);
      desfazer.push(() => {
        capa.removeEventListener("click", toca);
        capa.remove();
        iframe.style.visibility = antes;
      });
    });

    /*
     * Quantos vídeos a pessoa teve à frente. Sem esse denominador, "40
     * plays" não responde nada — 40 de 100 é uma história, 40 de 5.000 é
     * outra.
     */
    if (iframes.length > 0) trackEvent("article_video_view", { placement: slug, video_count: iframes.length });

    return () => desfazer.forEach((f) => f());
  }, [slug]);

  return null;
}
