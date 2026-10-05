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
    respostaDireta: "As alternativas mais parecidas mantêm o que a extensora faz: extensão de joelho com foco em quadríceps. A mais fiel é fazer o mesmo movimento sentado, com caneleira, elástico ou na polia baixa. Fora isso, o Spanish squat (com elástico) e o sissy squat assistido chegam mais perto. Agachamentos com calcanhar elevado também priorizam quadríceps, mas viram exercício composto, com o quadril participando.",
    exemplo: { motivo: "sem-aparelho", equipamentos: ["barra", "halter", "banco", "elastico"], rotulo: "sem máquinas, com barra, halteres, banco e elástico" },
    comoEscolher: [
      "Quer o mais parecido possível? Prefira exercícios em que o joelho faz quase todo o trabalho, como Spanish squat e sissy squat assistido.",
      "Treina em casa? O sissy squat assistido só precisa de um apoio firme; o Spanish squat, de um elástico preso.",
      "Aceita um composto? Agachamento com calcanhar elevado ou goblet dão muito quadríceps, com mais carga, mas dividem o trabalho com glúteos.",
    ],
    quandoNaoTrocar: "Se a sua academia tem a extensora e ela não incomoda, não há motivo para trocar só por variar. Ela é fácil de progredir e de levar perto da falha com segurança.",
    faq: [
      { question: "Leg press substitui a cadeira extensora?", answer: "Não exatamente. O leg press treina quadríceps, mas é um agachamento: quadril e glúteos também trabalham, e o joelho não faz o movimento isolado da extensora. Pode entrar no treino, mas como outro exercício, não como cópia." },
      { question: "Dá para fazer extensora em casa?", answer: "Sim, chegando bem perto: extensão de joelho sentado com caneleira ou elástico faz o mesmo movimento. Spanish squat e sissy squat assistido são outras opções sem máquina." },
      { question: "Como substituir a cadeira extensora com caneleira ou elástico?", answer: "Sente numa cadeira ou banco firme, prenda a caneleira no tornozelo (ou o elástico no pé e no pé da cadeira) e estique o joelho, controlando a volta. É o mesmo movimento da máquina, com carga menor: use mais repetições e leve perto da falha." },
      { question: "Dá para substituir a extensora na polia?", answer: "Sim: com a tornozeleira na polia baixa, sentado de costas para a polia, você faz a mesma extensão de joelho. A curva de resistência muda um pouco, mas é uma das opções mais parecidas." },
      { question: "Agachamento hack substitui a cadeira extensora?", answer: "Treina muito quadríceps com carga alta, mas é um agachamento: glúteos participam e o joelho não trabalha isolado. É uma boa alternativa na academia, não uma cópia." },
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
      { question: "Qual aparelho é parecido com o leg press?", answer: "O agachamento hack: também é guiado, com as costas apoiadas e muito quadríceps. O agachamento no smith vem em seguida, com a barra nas costas." },
      { question: "Como simular o leg press em casa?", answer: "Não dá para copiar a máquina, mas agachamento com halteres, búlgaro com o pé de trás no sofá e step up num degrau firme treinam os mesmos músculos. Elástico preso nos pés, deitado, imita o empurrão, com carga pequena." },
      { question: "Como substituir o leg press 45 ou o horizontal?", answer: "Um pelo outro, se existir: fazem o mesmo movimento com ângulo de quadril diferente. Sem nenhum dos dois, hack ou smith. A carga de um não vale para o outro." },
      { question: "E para substituir o leg press unilateral?", answer: "Búlgaro, afundo e step up também trabalham uma perna por vez e são as opções mais próximas." },
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
      { question: "Leg press substitui o agachamento?", answer: "Parcialmente. Treina quadríceps e glúteos com carga alta, mas com as costas apoiadas e o movimento guiado, o que tira o trabalho do tronco e do equilíbrio. Vale para o leg press 45 e o horizontal." },
      { question: "Qual aparelho na academia substitui o agachamento?", answer: "O agachamento no smith é o mais parecido, porque mantém a barra nas costas. Hack e leg press treinam os mesmos músculos com as costas apoiadas, tirando a carga da coluna." },
      { question: "É obrigatório fazer agachamento?", answer: "Não. Ele é ótimo, mas nenhum exercício é obrigatório. Dá para treinar muito bem as pernas com smith, hack, leg press, búlgaro e stiff, se o agachamento livre não encaixar para você." },
      { question: "O que fazer no lugar do agachamento com dor na lombar?", answer: "Esta página não avalia dor: se ela é persistente, procure avaliação. Para treinar, opções com as costas apoiadas (leg press, hack) ou com a carga à frente (goblet) tiram parte da carga da coluna, mas não são garantia." },
      { question: "O que substitui o agachamento sumô?", answer: "Outro agachamento com as pernas afastadas: goblet sumô com halter ou o sumô no smith. Para adutores e glúteos, leg press com os pés afastados e altos também ajuda." },
      { question: "Como substituir o agachamento em casa?", answer: "Agachamento com halteres ou mochila, goblet, búlgaro com o pé de trás no sofá e afundo. Sem carga, use mais repetições ou a versão de uma perna." },
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
      { question: "Qual aparelho substitui o stiff?", answer: "Na polia, o pull-through mantém a dobradiça de quadril. O banco romano (hiperextensão) também trabalha o quadril, com o corpo apoiado. Mesa e cadeira flexora treinam posteriores, mas com outra função." },
      { question: "Como fazer stiff sem barra?", answer: "Com halteres, um em cada mão, ou com um elástico preso sob os pés. O movimento é o mesmo: quadril para trás, coluna neutra, joelhos levemente dobrados." },
      { question: "Stiff e levantamento terra romeno são a mesma coisa?", answer: "São muito parecidos e muita gente usa os nomes como sinônimos. O terra romeno costuma ter um pouco mais de flexão de joelho e começar de cima. Os dois são dobradiça de quadril." },
      { question: "Elevação pélvica substitui o stiff?", answer: "Não exatamente. A elevação pélvica é extensão de quadril com foco no glúteo contraído; o stiff trabalha posteriores e glúteos alongados. Complementam, não se substituem." },
      { question: "O que substitui o stiff unilateral?", answer: "Terra unilateral com halter, ou o stiff com as duas pernas se o problema for equilíbrio." },
      { question: "Qual músculo o stiff trabalha?", answer: "Principalmente posteriores de coxa e glúteos, com a lombar estabilizando o tronco." },
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
  {
    slug: "elevacao-pelvica",
    exercicioId: "hip-thrust",
    nomeExercicio: "elevação pélvica",
    title: "O Que Fazer no Lugar da Elevação Pélvica? | Montinho",
    description: "Sem banco, barra ou máquina para a elevação pélvica? Veja alternativas que mantêm o glúteo trabalhando na extensão de quadril, na academia ou em casa.",
    h1: "O que fazer no lugar da elevação pélvica?",
    respostaDireta: "O que mais preserva a elevação pélvica é outra extensão de quadril com o glúteo fazendo a força no fim do movimento: hip thrust na máquina, ponte de glúteo (com ou sem halter) ou a versão unilateral. Agachamento búlgaro e terra sumô também treinam glúteo, mas com outro movimento: entram como complemento.",
    exemplo: { motivo: "casa", equipamentos: ["halter", "banco", "elastico"], rotulo: "em casa, com halteres, banco e elástico" },
    comoEscolher: [
      "Tem a máquina? Hip thrust na máquina é o mais próximo e o mais fácil de progredir.",
      "Em casa? Ponte de glúteo com um halter no quadril, ou a elevação unilateral no sofá ou banco.",
      "Quer só mais glúteo? Búlgaro e abdução complementam, mas não fazem o mesmo papel.",
    ],
    quandoNaoTrocar: "Se você consegue montar a elevação pélvica com conforto e está progredindo na carga, ela pode ficar: é um dos poucos exercícios que carregam o glúteo no ponto mais contraído.",
    faq: [
      { question: "Agachamento búlgaro substitui a elevação pélvica?", answer: "Não exatamente. Os dois treinam glúteo, mas o búlgaro é um agachamento de um lado só, com mais quadríceps e mais trabalho no alongamento. Vale ter os dois no treino." },
      { question: "Ponte de glúteo é igual à elevação pélvica?", answer: "É o mesmo movimento com as costas no chão em vez de no banco: a amplitude é menor e a carga costuma ser menor. Para quem treina em casa, é a alternativa mais direta." },
    ],
    searchDemand: "alta",
    editorialReviewed: true,
    isIndexable: true,
  },
  {
    slug: "mesa-flexora",
    exercicioId: "mesa-flexora",
    nomeExercicio: "mesa flexora",
    title: "O Que Fazer no Lugar da Mesa Flexora? | Montinho",
    description: "Sem mesa ou cadeira flexora? Veja alternativas que mantêm a flexão de joelho para os posteriores, em casa ou na academia, e por que stiff é outra função.",
    h1: "O que fazer no lugar da mesa flexora?",
    respostaDireta: "O mais parecido é outra flexão de joelho: cadeira flexora, flexora em pé, flexora com elástico ou deslizando os pés no chão com uma toalha. Stiff e terra também treinam posteriores, mas pela dobradiça de quadril: é outra função, que complementa a flexora em vez de substituí-la.",
    exemplo: { motivo: "casa", equipamentos: ["halter", "elastico", "banco"], rotulo: "em casa, com halteres, elástico e banco" },
    comoEscolher: [
      "Na academia, sem a mesa? Cadeira flexora ou flexora em pé fazem o mesmo movimento.",
      "Em casa? Flexão de joelho deslizando os pés (toalha em piso liso) ou flexora com elástico.",
      "Já é avançado? Nordic curl, que é bem mais intenso e técnico.",
    ],
    quandoNaoTrocar: "Se a mesa está disponível e confortável, mantenha: é a forma mais simples de treinar a flexão de joelho com carga que dá para medir.",
    faq: [
      { question: "Stiff substitui a mesa flexora?", answer: "Não. Os dois trabalham posteriores, mas a mesa flexiona o joelho e o stiff dobra o quadril. O ideal é ter um exercício de cada tipo no treino." },
      { question: "Quando não tem a cadeira flexora, o que fazer?", answer: "Use a mesa flexora ou a flexora em pé, se existirem. Sem máquina, flexora com elástico ou deslizando os pés no chão fazem a mesma flexão de joelho." },
      { question: "Mesa flexora e cadeira flexora são iguais?", answer: "Fazem o mesmo movimento. Na cadeira o quadril fica dobrado, o que deixa os posteriores mais alongados; muitas pessoas acham mais confortável." },
    ],
    searchDemand: "media",
    editorialReviewed: true,
    isIndexable: true,
  },
  {
    slug: "cadeira-abdutora",
    exercicioId: "abducao-quadril",
    nomeExercicio: "cadeira abdutora",
    title: "O Que Fazer no Lugar da Cadeira Abdutora? | Montinho",
    description: "Sem cadeira abdutora? Veja alternativas para a abdução de quadril e o glúteo médio, com polia ou elástico, e o que muda em cada uma.",
    h1: "O que fazer no lugar da cadeira abdutora?",
    respostaDireta: "O que mais preserva a cadeira abdutora é outra abdução de quadril: na polia, em pé, um lado por vez, ou com elástico (caminhada lateral ou ostra). Elevação pélvica e glúteo no cabo treinam o glúteo com outro movimento e entram como complemento.",
    exemplo: { motivo: "sem-aparelho", equipamentos: ["polia", "halter", "elastico", "banco"], rotulo: "sem máquinas, com polia, halteres, elástico e banco" },
    comoEscolher: [
      "Tem polia? Abdução no cabo, em pé, é a mais próxima.",
      "Em casa? Elástico acima dos joelhos: caminhada lateral ou ostra deitado de lado.",
    ],
    quandoNaoTrocar: "Se a máquina está disponível, ela é simples de ajustar e de progredir. Trocar só por variar não traz vantagem.",
    faq: [
      { question: "A abdutora é a mesma coisa que treinar glúteo?", answer: "Ela trabalha principalmente o glúteo médio, a parte lateral. Para o glúteo máximo, elevação pélvica, agachamentos e stiff fazem mais." },
    ],
    searchDemand: "media",
    editorialReviewed: true,
    isIndexable: true,
  },
  {
    slug: "afundo",
    exercicioId: "afundo",
    nomeExercicio: "afundo",
    title: "O Que Fazer no Lugar do Afundo? | Montinho",
    description: "Afundo incomoda ou não encaixa no seu treino? Veja alternativas unilaterais e bilaterais para quadríceps e glúteos, e o que cada uma muda.",
    h1: "O que fazer no lugar do afundo?",
    respostaDireta: "As alternativas mais parecidas também trabalham uma perna por vez: agachamento búlgaro, passada e subida no banco (step up). Se o problema é equilíbrio, agachamentos com as duas pernas (goblet, smith, leg press) mantêm quadríceps e glúteos com mais estabilidade, mas perdem o trabalho unilateral.",
    exemplo: { motivo: "execucao", equipamentos: ["maquina", "smith", "halter", "banco"], rotulo: "quem não se sente firme no afundo, com máquinas, smith, halteres e banco" },
    comoEscolher: [
      "Quer manter uma perna por vez? Búlgaro (mais estável que o afundo) ou step up.",
      "Falta equilíbrio? Afundo no smith ou segurando num apoio, ou um agachamento bilateral.",
      "Em casa? Búlgaro com o pé de trás no sofá e halteres ou mochila nas mãos.",
    ],
    quandoNaoTrocar: "Se o afundo está confortável e você está progredindo, ele pode ficar. Exercícios de uma perna ajudam a equilibrar os lados.",
    faq: [
      { question: "Búlgaro substitui o afundo?", answer: "É uma das alternativas mais próximas: também é de uma perna, com o pé de trás apoiado. Costuma ser mais estável e permitir mais carga." },
    ],
    searchDemand: "media",
    editorialReviewed: true,
    isIndexable: true,
  },
];

export const paginaPorSlug = (slug: string) => PAGINAS_SUBSTITUIR.find((p) => p.slug === slug) ?? null;
