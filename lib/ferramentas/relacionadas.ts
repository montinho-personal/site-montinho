/**
 * O cartão de link das ferramentas criadas em outubro de 2026 nos artigos
 * do mesmo assunto.
 *
 * Mesmo motivo de lib/ferramentas/canonica.ts: ferramenta sem link saindo
 * dos artigos que já têm autoridade não ranqueia nem pelo próprio nome.
 * Um artigo recebe no máximo UM cartão daqui, o da ferramenta mais próxima
 * da pergunta que ele responde.
 *
 * É mudança de componente (um deploy, um revert): entrou em todos os
 * artigos de uma vez, sem mexer no updatedAt de nenhum.
 */

export type FerramentaId = "substituidor" | "descanso" | "imc" | "musculacao" | "superavit" | "cintura" | "passos" | "gordura" | "cooper" | "cafeina";

export interface CartaoFerramenta {
  href: string;
  pergunta: string;
  texto: string;
  cta: string;
}

export const CARTOES: Record<FerramentaId, CartaoFerramenta> = {
  substituidor: {
    href: "/ferramentas/substituidor-de-exercicios",
    pergunta: "Sua academia não tem esse aparelho?",
    texto: "Escolha o exercício e veja alternativas que preservam o músculo e o movimento, com o que você tem disponível, e o que muda em cada uma.",
    cta: "Ver alternativas →",
  },
  descanso: {
    href: "/ferramentas/calculadora-descanso-entre-series",
    pergunta: "Quanto descansar antes da próxima série?",
    texto: "Informe o exercício, as repetições e o esforço da série para receber uma faixa de descanso, com cronômetro para usar no treino.",
    cta: "Calcular meu descanso →",
  },
  imc: {
    href: "/ferramentas/calculadora-imc",
    pergunta: "Quer calcular o seu IMC?",
    texto: "A calculadora dá o IMC pela tabela da OMS e mostra, sem rodeio, onde ele engana quem treina.",
    cta: "Abrir a Calculadora de IMC →",
  },
  musculacao: {
    href: "/ferramentas/calculadora-calorias-musculacao",
    pergunta: "Quantas calorias o seu treino de musculação gasta?",
    texto: "Informe o seu peso, o tempo e o tipo de treino para ver o gasto da sessão e comparar com caminhada e corrida.",
    cta: "Abrir a Calculadora de Calorias da Musculação →",
  },
  superavit: {
    href: "/ferramentas/calculadora-superavit-calorico",
    pergunta: "Quantas calorias comer para ganhar massa?",
    texto: "A calculadora estima o seu gasto do dia e mostra as faixas de superávit, do mais leve ao maior.",
    cta: "Abrir a Calculadora de Superávit Calórico →",
  },
  cintura: {
    href: "/ferramentas/relacao-cintura-altura",
    pergunta: "Sua cintura mede menos da metade da sua altura?",
    texto: "Com uma fita métrica, veja a sua relação cintura-altura e em que faixa você está.",
    cta: "Abrir a Calculadora de Relação Cintura-Altura →",
  },
  passos: {
    href: "/ferramentas/calculadora-passos",
    pergunta: "Quantos passos por dia para a sua idade?",
    texto: "Coloque os passos que você dá hoje e veja a meta, o nível de atividade e quanto eles dão em calorias, km e minutos.",
    cta: "Abrir a Calculadora de Passos →",
  },
  gordura: {
    href: "/ferramentas/calculadora-percentual-de-gordura",
    pergunta: "Qual é o seu percentual de gordura?",
    texto: "Estime em casa com uma fita métrica, ou com as dobras da sua avaliação física, e veja a sua faixa.",
    cta: "Abrir a Calculadora de Percentual de Gordura →",
  },
  cooper: {
    href: "/ferramentas/teste-de-cooper",
    pergunta: "Como está o seu fôlego?",
    texto: "Corra 12 minutos, digite a distância e veja o seu VO₂ máx e a classificação para a sua idade.",
    cta: "Abrir a Calculadora do Teste de Cooper →",
  },
  cafeina: {
    href: "/ferramentas/calculadora-cafeina",
    pergunta: "Quanta cafeína você toma por dia?",
    texto: "Some o café, o chá e o pré-treino, veja se passa do limite, a dose por kg para treinar e até que horas tomar o último café.",
    cta: "Abrir a Calculadora de Cafeína →",
  },
};

export const ARTIGOS_COM_CARTAO: Record<string, FerramentaId> = {
  "agachamento-vs-leg-press": "substituidor",
  "hack-vs-leg-press": "substituidor",
  "puxada-vs-remada": "substituidor",
  "agachamento-livre-ou-maquina-smith": "substituidor",
  "como-fazer-remada-baixa": "substituidor",
  "treino-de-pernas-em-casa": "substituidor",
  "treino-em-casa-sem-equipamento": "substituidor",
  "treino-com-elasticos-em-casa": "substituidor",
  "como-montar-academia-em-casa": "substituidor",

  "como-fazer-supino-reto": "descanso",
  "como-fazer-agachamento-livre-corretamente": "descanso",
  "como-fazer-leg-press": "descanso",
  "como-fazer-remada-curvada-tecnica": "descanso",
  "como-fazer-desenvolvimento-ombros": "descanso",
  "treinar-ate-a-falha": "descanso",
  "escala-rpe-musculacao": "descanso",

  "musculacao-emagrece": "musculacao",
  "musculacao-ou-corrida-para-emagrecer": "musculacao",

  "bulking-ou-cutting": "superavit",
  "calorias-para-ganhar-massa-muscular": "superavit",
  "como-ganhar-massa-sem-ganhar-gordura": "superavit",
  "como-ganhar-peso-saudavel": "superavit",
  "melhor-epoca-para-fazer-bulking": "superavit",
  "vale-a-pena-fazer-bulking-no-inverno": "superavit",
  "erros-de-quem-quer-ganhar-massa-muscular": "superavit",
  "como-ganhar-massa-muscular": "superavit",

  "como-perder-gordura-abdominal": "cintura",
  "gordura-visceral-como-eliminar": "cintura",
  "por-que-a-barriga-e-a-ultima-a-ir": "cintura",
  "barriga-inchada-ou-gordura": "cintura",
  "como-perder-barriga-rapido": "cintura",
  "imc-limitacoes-e-composicao-corporal": "imc",

  "10-mil-passos-por-dia-emagrece": "passos",
  "quanto-tempo-de-caminhada-por-dia": "passos",
  "caminhada-japonesa": "passos",
  "neat-gasto-calorico-diario": "passos",

  "percentual-de-gordura-ideal": "gordura",
  "bioimpedancia-como-interpretar": "gordura",
  "recomposicao-corporal": "gordura",
  "como-reduzir-gordura-corporal-rapidamente": "gordura",

  "vo2-maximo-longevidade": "cooper",
  "como-ganhar-condicionamento-para-verao": "cooper",
  "corrida-para-iniciantes": "cooper",
  "quanto-de-cardio-fazer": "cooper",

  "cafeina-no-treino-dose-timing": "cafeina",
  "cafe-antes-do-treino": "cafeina",
  "pre-treino-vale-a-pena": "cafeina",
  "termogenicos-funcionam": "cafeina",
  "suplementacao-pre-treino-avancada": "cafeina",
};

/**
 * Link direto para a troca daquele artigo: o Substituidor abre com o
 * exercício já escolhido (ou a página editorial, quando existe).
 */
export const HREF_POR_ARTIGO: Record<string, { href: string; pergunta?: string }> = {
  "agachamento-vs-leg-press": { href: "/substituir/leg-press", pergunta: "Não tem leg press?" },
  "hack-vs-leg-press": { href: "/ferramentas/substituidor-de-exercicios?exercicio=agachamento-hack", pergunta: "Não tem hack?" },
  "puxada-vs-remada": { href: "/substituir/puxada-alta", pergunta: "Não tem polia para a puxada?" },
  "agachamento-livre-ou-maquina-smith": { href: "/substituir/agachamento", pergunta: "Quer trocar o agachamento?" },
  "como-fazer-remada-baixa": { href: "/ferramentas/substituidor-de-exercicios?exercicio=remada-baixa", pergunta: "Não tem a remada baixa na sua academia?" },
  "treino-de-pernas-em-casa": { href: "/ferramentas/substituidor-de-exercicios", pergunta: "Algum exercício de academia sem versão em casa?" },
  "treino-em-casa-sem-equipamento": { href: "/ferramentas/substituidor-de-exercicios", pergunta: "Quer trocar um exercício de academia por um que dá para fazer em casa?" },
  "treino-com-elasticos-em-casa": { href: "/ferramentas/substituidor-de-exercicios", pergunta: "Qual exercício com elástico substitui o da academia?" },
  "como-montar-academia-em-casa": { href: "/ferramentas/substituidor-de-exercicios", pergunta: "O que fazer no lugar das máquinas que você não tem em casa?" },
};
