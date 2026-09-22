/**
 * Demonstração em vídeo dos exercícios do protocolo.
 *
 * ONDE O VÍDEO ENTRA, E ONDE NÃO
 *
 * Só nos exercícios de MOVIMENTO (tipo "dinamico" ou "forca"). As figuras dos
 * cinco testes ficam em desenho de propósito: ali o ponto colorido marca
 * exatamente o que decide se o teste vale, e um vídeo do corpo inteiro faria
 * o olho procurar. Os alongamentos parados também ficam em desenho — em vídeo
 * seriam uma pessoa imóvel, pesando o mesmo e mostrando nada a mais.
 *
 * Exercício sem entrada aqui continua com o desenho. Não existe estado
 * intermediário quebrado: a lista pode ter um vídeo ou nove.
 *
 * DE ONDE VÊM
 *
 * Biblioteca da Lyfta, com uso liberado ao Montinho. Os originais são GIF de
 * 0,7 a 5,7 MB; aqui entram convertidos para vídeo (scripts/gif-para-video.sh),
 * na casa das centenas de KB, porque GIF é o pior formato possível para
 * movimento: 256 cores e nenhuma compressão entre quadros.
 */

export interface VideoExercicio {
  /**
   * VP9, a primeira opção: menor, e o que Chrome, Android e Firefox escolhem.
   * Vem antes do MP4 no <video> — o navegador fica com o primeiro que sabe tocar.
   */
  webm: string;
  /** H.264, a reserva que garante o iPhone. */
  mp4: string;
  /** Primeiro quadro, mostrado antes de carregar e para quem pede menos movimento. */
  poster: string;
  /** Nome do arquivo na biblioteca de origem, para rastrear de onde veio. */
  origem: string;
}

/* Os cinco primeiros, em 22/09/2026: 219 KB em WebM, 334 KB em MP4. Os GIFs de origem somavam 16,4 MB. */
export const VIDEOS_EXERCICIO: Record<string, VideoExercicio> = {
  "knee-to-wall-dinamico": { webm: "/mobilidade/videos/knee-to-wall-dinamico.webm", mp4: "/mobilidade/videos/knee-to-wall-dinamico.mp4", poster: "/mobilidade/videos/knee-to-wall-dinamico.jpg", origem: "Lyfta · Dynamic-Weight-Bearing-Ankle-Dorsi-Flexion-(male)" },
  "dorsiflexao-afundo": { webm: "/mobilidade/videos/dorsiflexao-afundo.webm", mp4: "/mobilidade/videos/dorsiflexao-afundo.mp4", poster: "/mobilidade/videos/dorsiflexao-afundo.jpg", origem: "Lyfta · Deep-Lunge-Dorsi-Flexion-(male)" },
  "wall-slide": { webm: "/mobilidade/videos/wall-slide.webm", mp4: "/mobilidade/videos/wall-slide.mp4", poster: "/mobilidade/videos/wall-slide.jpg", origem: "Lyfta · Scapular-Slide-Back-to-Wall-(female)" },
  "flexao-ombro-bastao": { webm: "/mobilidade/videos/flexao-ombro-bastao.webm", mp4: "/mobilidade/videos/flexao-ombro-bastao.mp4", poster: "/mobilidade/videos/flexao-ombro-bastao.jpg", origem: "Lyfta · PVC-Pass-Through" },
  "noventa-noventa": { webm: "/mobilidade/videos/noventa-noventa.webm", mp4: "/mobilidade/videos/noventa-noventa.mp4", poster: "/mobilidade/videos/noventa-noventa.jpg", origem: "Lyfta · 90-to-90-Switch-(male)" },
};

export function videoDoExercicio(id: string): VideoExercicio | undefined {
  return VIDEOS_EXERCICIO[id];
}
