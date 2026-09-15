/**
 * A chave de publicação do Conversor mg/mL e Seringa U-100.
 *
 * Esta ferramenta fala de injetável. A regra que o próprio briefing
 * estabeleceu é que um profissional habilitado, com experiência em
 * segurança medicamentosa, revise terminologia, fórmulas, descrição da
 * seringa, alertas e conteúdo ANTES de a página ser publicada — e que a
 * data dessa revisão fique registrada na página.
 *
 * Enquanto `revisadoEm` for null:
 *   - a página abre pela URL (para ser revisada), mas com noindex/nofollow;
 *   - ela fica fora do sitemap, do card em /ferramentas e do ItemList;
 *   - um aviso no topo diz que está em revisão técnica.
 *
 * Para publicar: preencher `revisadoEm` (AAAA-MM-DD) e `revisor` (nome e
 * registro profissional, como deve aparecer na página). Nada mais.
 */
export const REVISAO_TECNICA: { revisadoEm: string | null; revisor: string | null } = {
  revisadoEm: null,
  revisor: null,
};

export const CONVERSOR_NO_AR = REVISAO_TECNICA.revisadoEm !== null && REVISAO_TECNICA.revisor !== null;

/** Data da última revisão do conteúdo pelo autor (não é a revisão técnica). */
export const CONTEUDO_ATUALIZADO_EM = "2026-09-15";
