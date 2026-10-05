/**
 * Páginas indexáveis de substituição (/substituir/[slug]).
 *
 * SEO programático responsável: só existem páginas para trocas com demanda
 * real de busca, conteúdo próprio e revisão editorial. Combinações de
 * filtro (?equipamentos=…&motivo=…) nunca viram página: a ferramenta lê os
 * parâmetros no navegador e a canonical continua limpa.
 *
 * `isIndexable` só pode ser true com `editorialReviewed` true — o teste
 * scripts/substituidor-test.ts trava isso.
 */

import type { Equip } from "./biomecanica";
import type { Motivo } from "./substituicoes";

export interface PaginaSubstituir {
  slug: string;
  exercicioId: string;
  nomeExercicio: string;
  title: string;
  description: string;
  h1: string;
  respostaDireta: string;
  /** Pré-preenchimento do exemplo que a página mostra estático (SSR). */
  exemplo: { motivo: Motivo; equipamentos: Equip[]; rotulo: string };
  comoEscolher: string[];
  quandoNaoTrocar: string;
  faq: { question: string; answer: string }[];
  /** Artigo do blog relacionado, se existir. */
  artigo?: { href: string; texto: string };
  searchDemand: "alta" | "media";
  editorialReviewed: boolean;
  isIndexable: boolean;
}

export const PAGINAS_SUBSTITUIR: PaginaSubstituir[] = [
  {
    slug: "cadeira-extensora",
    exercicioId: "cadeira-extensora",
    nomeExercicio: "cadeira extensora",
    title: "O Que Fazer no Lugar da Cadeira Extensora? | Montinho",
    description: "Sem cadeira extensora? Veja alternativas que preservam o foco em quadríceps e a extensão de joelho, na academia ou em casa, e o que muda em cada uma.",
    h1: "O que fazer no lugar da cadeira extensora?",
    respostaDireta: "As alternativas mais parecidas mantêm o que a extensora faz: muita extensão de joelho com foco em quadríceps. Sem máquina, o Spanish squat (com elástico) e o sissy squat assistido chegam mais perto. Agachamentos com calcanhar elevado também priorizam quadríceps, mas viram exercício composto, com o quadril participando.",
    exemplo: { motivo: "sem-aparelho", equipamentos: ["barra", "halter", "banco", "elastico"], rotulo: "sem máquinas, com barra, halteres, banco e elástico" },
    comoEscolher: [
      "Quer o mais parecido possível? Prefira exercícios em que o joelho faz quase todo o trabalho, como Spanish squat e sissy squat assistido.",
      "Treina em casa? O sissy squat assistido só precisa de um apoio firme; o Spanish squat, de um elástico preso.",
      "Aceita um composto? Agachamento com calcanhar elevado ou goblet dão muito quadríceps, com mais carga, mas dividem o trabalho com glúteos.",
    ],
    quandoNaoTrocar: "Se a sua academia tem a extensora e ela não incomoda, não há motivo para trocar só por variar. Ela é fácil de progredir e de levar perto da falha com segurança.",
    faq: [
      { question: "Leg press substitui a cadeira extensora?", answer: "Não exatamente. O leg press treina quadríceps, mas é um agachamento: quadril e glúteos também trabalham, e o joelho não faz o movimento isolado da extensora. Pode entrar no treino, mas como outro exercício, não como cópia." },
      { question: "Dá para fazer extensora em casa?", answer: "Não igual à máquina, mas dá para chegar perto com Spanish squat (elástico preso num ponto firme) ou sissy squat segurando num apoio." },
      { question: "Qual a carga certa no exercício novo?", answer: "Não use a carga da extensora como referência. Comece leve, encontre a faixa de repetições que você usa e ajuste por ela." },
    ],
    artigo: { href: "/blog/agachamento-vs-leg-press", texto: "agachamento vs leg press" },
    searchDemand: "alta",
    editorialReviewed: true,
    isIndexable: true,
  },
  {
    slug: "leg-press",
    exercicioId: "leg-press",
    nomeExercicio: "leg press",
    title: "O Que Fazer no Lugar do Leg Press? | Montinho",
    description: "Sem leg press ou treinando em casa? Veja alternativas que mantêm o agachamento de quadríceps e glúteos, com hack, smith, halteres ou peso corporal.",
    h1: "O que fazer no lugar do leg press?",
    respostaDireta: "O mais parecido é outro agachamento guiado e apoiado, como o hack. Sem máquinas, agachamento no smith ou livre mantêm o padrão, mas pedem mais tronco e técnica. Em casa, agachamentos com halteres, búlgaro e afundo preservam quadríceps e glúteos com carga menor.",
    exemplo: { motivo: "sem-aparelho", equipamentos: ["barra", "smith", "halter", "banco"], rotulo: "sem máquinas, com barra, smith, halteres e banco" },
    comoEscolher: [
      "Tem hack? É o mais próximo: costas apoiadas e trajetória guiada.",
      "Tem smith ou barra? Mantém carga alta, mas a coluna passa a sustentar o peso.",
      "Só halteres ou em casa? Búlgaro e afundo dão muito trabalho com pouca carga, um lado por vez.",
    ],
    quandoNaoTrocar: "Se o leg press está disponível, confortável e você está progredindo, ele pode ficar. Trocar só por novidade atrapalha a comparação de carga semana a semana.",
    faq: [
      { question: "Agachamento livre substitui o leg press?", answer: "Treina os mesmos músculos com o mesmo padrão, mas não é igual: exige muito mais estabilidade e técnica, e o tronco trabalha bem mais." },
      { question: "100 kg no leg press equivalem a quanto no agachamento?", answer: "Não existe conversão. O leg press tem ângulo, trilho e às vezes contrapeso, e cada máquina é diferente. Comece leve no exercício novo e ajuste pelas repetições." },
      { question: "O que fazer no lugar do leg press em casa?", answer: "Agachamento com halteres ou com o peso do corpo, búlgaro e afundo. Unilaterais deixam o exercício mais difícil sem precisar de muita carga." },
    ],
    artigo: { href: "/blog/como-fazer-leg-press", texto: "como fazer leg press" },
    searchDemand: "alta",
    editorialReviewed: true,
    isIndexable: true,
  },
  {
    slug: "agachamento",
    exercicioId: "agachamento-livre",
    nomeExercicio: "agachamento livre",
    title: "O Que Fazer no Lugar do Agachamento? | Montinho",
    description: "Não pode ou não quer fazer agachamento livre? Veja alternativas que mantêm quadríceps e glúteos, do smith ao goblet, e o que cada uma muda.",
    h1: "O que fazer no lugar do agachamento livre?",
    respostaDireta: "O agachamento no smith é o mais parecido: mesmo padrão, com trajetória guiada. O goblet mantém o movimento com carga à frente e é mais fácil de aprender. Leg press e hack treinam os mesmos músculos com as costas apoiadas, mas tiram quase toda a demanda de tronco.",
    exemplo: { motivo: "execucao", equipamentos: ["maquina", "smith", "halter", "banco"], rotulo: "quem não se sente seguro na técnica, com máquinas, smith e halteres" },
    comoEscolher: [
      "Ainda aprendendo? Goblet e smith ajudam a construir o padrão com menos risco técnico.",
      "Quer carga alta sem barra nas costas? Leg press e hack.",
      "Só halteres? Agachamento com halteres e búlgaro.",
    ],
    quandoNaoTrocar: "Se o incômodo vem só da técnica, às vezes vale aprender o movimento com um profissional antes de abandonar o exercício.",
    faq: [
      { question: "Leg press substitui o agachamento?", answer: "Parcialmente. Treina quadríceps e glúteos com carga alta, mas com as costas apoiadas e o movimento guiado, o que tira o trabalho do tronco e do equilíbrio." },
      { question: "O que fazer no lugar do agachamento com dor no joelho?", answer: "Esta página não avalia dor. Se o desconforto é persistente, procure avaliação. Para treinar, mudar a profundidade, a posição dos pés ou o equipamento costuma ajudar, mas não é garantia." },
    ],
    artigo: { href: "/blog/como-fazer-agachamento-livre-corretamente", texto: "como fazer agachamento livre corretamente" },
    searchDemand: "alta",
    editorialReviewed: true,
    isIndexable: true,
  },
  {
    slug: "stiff",
    exercicioId: "stiff",
    nomeExercicio: "stiff",
    title: "O Que Fazer no Lugar do Stiff? | Montinho",
    description: "Sem barra para o stiff? Veja alternativas que mantêm a dobradiça de quadril, e entenda por que a mesa flexora treina posteriores de outro jeito.",
    h1: "O que fazer no lugar do stiff?",
    respostaDireta: "O que mais preserva o stiff é outro movimento de dobradiça de quadril: stiff com halteres, pull-through no cabo ou terra unilateral. A mesa flexora também treina posteriores, mas pela flexão de joelho: é outra função, que complementa, não substitui.",
    exemplo: { motivo: "sem-aparelho", equipamentos: ["halter", "polia", "maquina", "banco"], rotulo: "sem barra, com halteres, polia e máquinas" },
    comoEscolher: [
      "Sem barra? Stiff com halteres é o mais direto.",
      "Quer menos carga na lombar? Pull-through: a resistência vem de trás.",
      "Quer só mais posteriores? Mesa ou cadeira flexora, sabendo que mudam a função.",
    ],
    quandoNaoTrocar: "Se o stiff está confortável e progredindo, mantenha. Ele treina posteriores e glúteos alongados sob carga, algo que poucos exercícios fazem.",
    faq: [
      { question: "Mesa flexora substitui o stiff?", answer: "Não. As duas treinam posteriores, mas o stiff é dobradiça de quadril (com glúteos) e a mesa flexora é flexão de joelho. O ideal é ter uma de cada no treino, não trocar uma pela outra." },
      { question: "Stiff com halteres é igual ao com barra?", answer: "Muito parecido: mesmo movimento e mesmos músculos, com um pouco mais de liberdade e carga total geralmente menor." },
    ],
    searchDemand: "media",
    editorialReviewed: true,
    isIndexable: true,
  },
  {
    slug: "puxada-alta",
    exercicioId: "puxada-frente",
    nomeExercicio: "puxada alta",
    title: "O Que Fazer no Lugar da Puxada Alta? | Montinho",
    description: "Sem polia ou treinando em casa? Veja alternativas à puxada alta com barra fixa, elástico ou halteres, e qual escolher para o seu nível.",
    h1: "O que fazer no lugar da puxada alta?",
    respostaDireta: "O mais parecido é outra puxada vertical: barra fixa assistida, puxada com elástico ou a própria barra fixa para quem já consegue. Remadas treinam os mesmos músculos com puxada horizontal, uma boa alternativa quando não há onde pendurar.",
    exemplo: { motivo: "casa", equipamentos: ["barra-fixa", "elastico"], rotulo: "em casa, com barra fixa e elástico" },
    comoEscolher: [
      "Não faz nenhuma barra? Barra assistida com elástico ou negativas.",
      "Só elástico? Puxada com elástico preso no alto.",
      "Sem onde prender? Remada com halter ou elástico.",
    ],
    quandoNaoTrocar: "A puxada na polia é ótima para controlar a carga. Se ela está disponível, pode continuar e servir de ponte para a barra fixa.",
    faq: [
      { question: "Não consigo fazer barra fixa. O que faço no lugar?", answer: "Barra fixa assistida (com elástico ou máquina), negativas controladas ou a puxada na polia. Elas constroem a força para chegar à barra." },
      { question: "Remada substitui a puxada?", answer: "Parcialmente. Treina costas e bíceps, mas na horizontal. Vale para quando não há onde fazer puxada vertical." },
    ],
    artigo: { href: "/blog/puxada-vs-remada", texto: "puxada vs remada" },
    searchDemand: "media",
    editorialReviewed: true,
    isIndexable: true,
  },
];

export const paginaPorSlug = (slug: string) => PAGINAS_SUBSTITUIR.find((p) => p.slug === slug) ?? null;
