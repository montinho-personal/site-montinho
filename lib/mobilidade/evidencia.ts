/**
 * As evidências que sustentam cada decisão da ferramenta.
 *
 * Isto não é bibliografia de rodapé. Cada constante aqui é consumida por uma
 * regra do motor ou por um texto da tela — se um número mudar aqui, muda o
 * comportamento do produto. É o oposto de citar estudo para parecer sério.
 *
 * A ordem de prioridade da literatura foi a pedida: revisão sistemática e
 * meta-análise primeiro; onde não existe evidência suficiente para estabelecer
 * um normal, a ferramenta DIZ que não existe em vez de inventar corte.
 */

export interface Fonte {
  rotulo: string;
  url: string;
  tipo: string;
  resumo: string;
}

/**
 * A dose-resposta que define o protocolo inteiro.
 *
 * Meta-regressão multivariada em sete bases até junho/2024. O achado que mais
 * importa aqui não é o volume ótimo — é que a INTENSIDADE não moderou o
 * efeito. Alongar forçando não entrega mais que alongar confortável, e isso
 * autoriza a ferramenta a dizer "não precisa doer" sem estar sendo apenas
 * simpática.
 */
export const FONTE_DOSE: Fonte = {
  rotulo: "Ingram et al., Sports Medicine (2025), 55(3):597–617",
  url: "https://link.springer.com/article/10.1007/s40279-024-02143-9",
  tipo: "Revisão sistemática, meta-análise e meta-regressão multivariada",
  resumo:
    "O ganho crônico de flexibilidade é maximizado por volta de 10 minutos por semana por grupo muscular, em torno de três sessões semanais. O efeito não foi moderado pela intensidade do alongamento, nem por idade, sexo, região do corpo, nível de treino ou flexibilidade inicial.",
};

/** O alvo semanal de alongamento estático, por região. Em segundos. */
export const ALVO_SEMANAL_SEGUNDOS = 600;

/**
 * A trava do pré-treino.
 *
 * A relação é dose-dependente: abaixo de 60 s por grupo muscular o déficit é
 * trivial (−1,1%); a partir de 60 s ele passa a ser relevante (−4,6%). A
 * ferramenta trabalha com margem e corta em 30 s no pré-treino, porque o custo
 * de errar para menos é zero e para mais é a pessoa treinar mais fraca.
 */
export const FONTE_AGUDO: Fonte = {
  rotulo: "Behm et al., Applied Physiology, Nutrition, and Metabolism (2016)",
  url: "https://cdnsciencepub.com/doi/10.1139/apnm-2015-0235",
  tipo: "Revisão sistemática",
  resumo:
    "Alongamento estático de 60 segundos ou mais por grupo muscular associou-se a queda de desempenho de cerca de 4,6%; abaixo de 60 segundos, a queda foi de cerca de 1,1% — magnitude trivial. Alongamento dinâmico no aquecimento não produziu o mesmo prejuízo.",
};

/** Teto de sustentação estática por grupo muscular no pré-treino, em segundos. */
export const TETO_ESTATICO_PRE = 30;

/**
 * Por que a ferramenta não é um app de alongamento.
 *
 * Se treino de força em amplitude adequada produz ganho de amplitude
 * equivalente ao alongamento, então a mensagem honesta não é "alongue mais" —
 * é "treine bem, e alongue o que precisa". Esta fonte sustenta o exercício de
 * tipo "forca" existir dentro dos protocolos.
 */
export const FONTE_FORCA: Fonte = {
  rotulo: "Afonso et al., Healthcare (2021), 9(4):427",
  url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8067745/",
  tipo: "Revisão sistemática e meta-análise (11 estudos, 452 participantes)",
  resumo:
    "Treino de força e alongamento não diferiram no ganho de amplitude de movimento (ES = −0,22; IC 95% −0,55 a 0,12; p = 0,206). Treinar em amplitudes adequadas também é uma estratégia de mobilidade.",
};

/**
 * Por que o foam roller é opcional e nunca padrão.
 *
 * No geral as duas estratégias empatam. Mas o ciclo desta ferramenta é de
 * quatro semanas, e é justamente na janela de até quatro semanas que só o
 * alongamento mostrou mudança significativa. A decisão de produto sai do
 * recorte, não da média.
 */
export const FONTE_ROLO: Fonte = {
  rotulo: "Konrad et al., Sports Medicine (2024)",
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11393112/",
  tipo: "Revisão sistemática e meta-análise",
  resumo:
    "Alongamento estático e foam rolling aumentam a amplitude de movimento sem diferença significativa entre si no conjunto dos estudos. Em intervenções de até quatro semanas, porém, apenas o alongamento estático mostrou mudança significativa.",
};

/**
 * A fonte que impede a ferramenta de prometer prevenção de lesão.
 *
 * Se um escore composto de triagem de movimento validado e amplamente
 * estudado não prediz lesão, nenhum teste de mobilidade online prediz. É esta
 * evidência — e não excesso de cautela jurídica — que sustenta a proibição de
 * linguagem preditiva em todo o produto.
 */
export const FONTE_TRIAGEM: Fonte = {
  rotulo: "Moran et al., British Journal of Sports Medicine (2017)",
  url: "https://www.ovid.com/journals/bjsme/abstract/10.1136/bjsports-2016-096938~do-functional-movement-screen-fms-composite-scores-predict",
  tipo: "Revisão sistemática com meta-análise",
  resumo:
    "Escores compostos de triagem de movimento não sustentam uso como ferramenta de predição de lesão; o ponto de corte usual não se associou significativamente a lesão subsequente.",
};

/**
 * A única medida da bateria com confiabilidade forte e referência publicada.
 *
 * É por isso que o knee-to-wall é o único teste que aceita número, e é o único
 * cujo corte a ferramenta apresenta como referência da literatura. Os outros
 * quatro são classificação funcional — e a página de metodologia diz isso.
 */
export const FONTE_KNEE_TO_WALL: Fonte = {
  rotulo: "Powden et al. e revisões de confiabilidade do weight-bearing lunge test",
  url: "https://www.physio-pedia.com/Knee_to_Wall_Test",
  tipo: "Estudos de confiabilidade e revisão sistemática",
  resumo:
    "O teste apresenta confiabilidade intra-avaliador e entre avaliadores alta (ICC entre 0,80 e 0,99 conforme o estudo). Distâncias típicas ficam entre 10 e 15 cm; valores abaixo de 10 cm costumam ser descritos como restrição relevante de dorsiflexão.",
};

export const FONTES: Fonte[] = [
  FONTE_DOSE,
  FONTE_AGUDO,
  FONTE_FORCA,
  FONTE_ROLO,
  FONTE_TRIAGEM,
  FONTE_KNEE_TO_WALL,
];

/**
 * A limitação central, dita na primeira pessoa.
 *
 * Aparece na página de metodologia e no resultado. Não é letra miúda: é a
 * diferença entre uma ferramenta educacional honesta e um site que finge
 * avaliar gente pela internet.
 */
export const LIMITE_DO_TESTE =
  "Este é um teste educacional de autoavaliação, não uma avaliação clínica. Ele não diagnostica nada, não identifica a causa de dor e não prevê lesão. Dos cinco testes, só o de tornozelo tem valores de referência publicados — os outros quatro usam uma classificação funcional criada para orientar treino, não para medir você contra uma norma.";

export const NAO_PREVINE_LESAO =
  "Melhorar mobilidade pode facilitar a execução de alguns exercícios. Não existe evidência boa de que isso previna lesões, e esta ferramenta não promete isso.";

export const NAO_PRECISA_DOER =
  "Você não precisa forçar. A revisão mais recente sobre dose de alongamento não encontrou vantagem em alongar com mais intensidade — o que conta é o tempo total na semana, feito num desconforto confortável.";
