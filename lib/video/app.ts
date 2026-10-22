/**
 * O vídeo de lançamento do app do Montinho (2 min 13 s, versão completa).
 * Montinho decidiu em 22/10/2026 usar a versão original nas páginas, sem corte.
 *
 * Enquanto o id do YouTube estiver vazio, o componente VideoApp não renderiza
 * nada: o código fica pronto e o vídeo entra no ar trocando só esta linha
 * (e adicionando a entrada em lib/videos.ts, que dá a página em /videos).
 */
export const VIDEO_APP_ID = "DPAQDPVffCg";
export const VIDEO_APP_SLUG = "app-do-montinho";
export const VIDEO_APP_TITULO = "Como funciona o acompanhamento no app do Montinho — Montinho Personal Trainer";

/**
 * Artigos de personal/SEO local sem vídeo nenhum que recebem o vídeo do app
 * no fim (pedido do Montinho em 22/10/2026: "o vídeo do app nas páginas de
 * SEO local e nas que falam de consultoria online"). Artigo com vídeo do
 * próprio Montinho não entra; vídeo de terceiro é trocado no texto (lib/blog.ts).
 */
export const ARTIGOS_COM_VIDEO_APP_FIM: string[] = [
  "personal-trainer-ou-aula-coletiva",
  "quanto-custa-personal-trainer-aldeia-da-serra",
];
