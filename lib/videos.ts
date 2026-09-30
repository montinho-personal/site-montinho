/**
 * Vídeos do canal do Montinho e o dado estruturado deles (VideoObject).
 *
 * POR QUE UM REGISTRO, E NÃO LER DO HTML DO ARTIGO
 *
 * O Google exige três campos no VideoObject: nome, miniatura e DATA DE
 * PUBLICAÇÃO. Nome e miniatura dá para tirar do embed; a data, não — ela só
 * existe no YouTube, e inventá-la (usando a data do artigo, por exemplo)
 * seria dado estruturado falso, que o Google penaliza no site inteiro.
 * Então só entra aqui vídeo com data conferida, e só vídeo do próprio
 * Montinho: marcar como "nosso" o vídeo de outro canal seria mentir sobre a
 * autoria.
 *
 * Vídeo que está no artigo mas não está aqui continua aparecendo
 * normalmente; ele só não ganha a marcação. Para incluir, basta a data de
 * publicação que o YouTube Studio mostra.
 */

export interface VideoCanal {
  /** O id de 11 caracteres da URL do YouTube. */
  id: string;
  titulo: string;
  descricao: string;
  /** Data de publicação no YouTube, AAAA-MM-DD. Conferida, nunca estimada. */
  publicadoEm: string;
}

export const VIDEOS_CANAL: VideoCanal[] = [
  {
    id: "9X968Kqa2-Y",
    titulo: "A balança mente? Por que o peso sobe mesmo emagrecendo",
    descricao:
      "O peso muda todo dia: sal, sono ruim e treino pesado fazem o corpo segurar água. Com musculação você perde gordura e ganha músculo ao mesmo tempo. O que medir de verdade: cintura toda semana, foto a cada 15 dias e a roupa.",
    publicadoEm: "2026-10-01",
  },
];

const porId = new Map(VIDEOS_CANAL.map((v) => [v.id, v]));

/** Ids de YouTube embutidos num HTML, na ordem em que aparecem, sem repetir. */
export function videosEmbutidos(html: string): string[] {
  const ids = [...html.matchAll(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/g)].map((m) => m[1]);
  return [...new Set(ids)];
}

/**
 * VideoObject para cada vídeo registrado que aparece no HTML. Vídeo de
 * terceiros ou sem data conferida fica de fora.
 */
export function videoSchemas(html: string, siteUrl: string) {
  return videosEmbutidos(html)
    .map((id) => porId.get(id))
    .filter((v): v is VideoCanal => Boolean(v))
    .map((v) => ({
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: v.titulo,
      description: v.descricao,
      thumbnailUrl: [`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`],
      uploadDate: v.publicadoEm,
      embedUrl: `https://www.youtube.com/embed/${v.id}`,
      contentUrl: `https://www.youtube.com/shorts/${v.id}`,
      author: { "@type": "Person", name: "Montinho", url: `${siteUrl}/minha-historia` },
    }));
}
