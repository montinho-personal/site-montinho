/**
 * Quem revisou o Conversor mg/mL e Seringa U-100, e o que isso significa.
 *
 * A página fala de injetável. Duas revisões diferentes podem existir aqui, e
 * elas NÃO são a mesma coisa — misturar as duas na mesma frase daria ao
 * leitor a impressão de um aval clínico que talvez não exista:
 *
 *   REVISAO_AUTOR    — o dono do site leu e aprovou o conteúdo. É o que
 *                      libera a publicação: a página é dele.
 *   REVISAO_TECNICA  — um profissional habilitado em segurança medicamentosa
 *                      (farmacêutico, médico) conferiu terminologia,
 *                      fórmulas, descrição da seringa e alertas. Enquanto for
 *                      null, a página DIZ que não houve, em vez de calar.
 *
 * A publicação depende só da primeira. A segunda, quando vier, acrescenta
 * uma linha de crédito — nunca some com a ressalva por acidente.
 */
export const REVISAO_AUTOR: { revisadoEm: string | null; por: string | null } = {
  revisadoEm: "2026-09-15",
  por: "Montinho Personal Trainer",
};

/**
 * Revisão por profissional habilitado em segurança medicamentosa.
 * Preencher com nome e registro profissional como devem aparecer na página.
 */
export const REVISAO_TECNICA: { revisadoEm: string | null; revisor: string | null } = {
  revisadoEm: null,
  revisor: null,
};

/** A página entra no ar quando o dono do site aprova o conteúdo. */
export const CONVERSOR_NO_AR = REVISAO_AUTOR.revisadoEm !== null && REVISAO_AUTOR.por !== null;

/** Data da última atualização do conteúdo. */
export const CONTEUDO_ATUALIZADO_EM = "2026-09-15";
