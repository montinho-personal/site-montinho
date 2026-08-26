import type { CtaOverride } from "./types";

/**
 * Overrides editoriais por slug. Vencem sempre a classificação automática.
 *
 * Use quando você conhece a intenção real do artigo melhor que a regra —
 * o que acontece com títulos ambíguos e com conteúdos que citam um tema
 * sem serem sobre ele.
 *
 * Campos:
 *   cluster — troca o cluster (muda mid e end de uma vez)
 *   stage   — troca só o estágio do funil (usado em analytics)
 *   mid     — id de um CTA do registry, ou null para não ter CTA no meio
 *   end     — id de um CTA do registry
 *   note    — por que a exceção existe (aparece no relatório de cobertura)
 *
 * Exemplo:
 *   "meu-artigo": { end: "diag_weight_loss", mid: null, note: "topo de funil" },
 */
export const CTA_OVERRIDES: Record<string, CtaOverride> = {
  // Página institucional disfarçada de artigo: quem chega aqui já está
  // avaliando contratar, não aprendendo.
  "personal-trainer-online-como-funciona": {
    end: "service_general",
    note: "intenção de contratação explícita",
  },

  // Cita 'personal trainer' no título mas é conteúdo de decisão, não de
  // serviço local — mandar para presencial seria forçar a barra.
  "vale-a-pena-contratar-personal-trainer": {
    cluster: "service_online",
    note: "conteúdo de decisão, não de geografia",
  },

  // Fala de academia em Alphaville mas o assunto é preço, não treino.
  // Diagnóstico não ajuda quem está comparando mensalidade.
  "academias-mais-baratas-alphaville-barueri": {
    end: "local_gym",
    mid: null,
    note: "comparativo de preço — não interromper com CTA no meio",
  },

  // Artigos cuja pergunta central é "como estruturar minha semana" — o CTA do
  // meio leva para o Treino Para Minha Rotina, que responde exatamente isso.
  "full-body-vs-divisao-abc": { mid: "rotina_mid", note: "divisão → ferramenta de rotina" },
  "treino-upper-lower-superior-inferior": { mid: "rotina_mid", note: "divisão → ferramenta de rotina" },
  "push-pull-legs": { mid: "rotina_mid", note: "divisão → ferramenta de rotina" },
  "como-montar-treino-abc": { mid: "rotina_mid", note: "divisão → ferramenta de rotina" },
  "como-montar-treino-abcde": { mid: "rotina_mid", note: "divisão → ferramenta de rotina" },
  "treino-abcd-para-hipertrofia": { mid: "rotina_mid", note: "divisão → ferramenta de rotina" },
  "frequencia-de-treino": { mid: "rotina_mid", note: "frequência → ferramenta de rotina" },
  "treino-de-30-minutos-funciona": { mid: "rotina_mid", note: "tempo → ferramenta de rotina" },
  "treinar-todos-os-dias-faz-mal": { mid: "rotina_mid", note: "frequência → ferramenta de rotina" },
};
