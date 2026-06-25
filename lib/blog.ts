export const SITE_URL = "https://www.montinhopersonal.com.br";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  updatedAt?: string;
  readTime: string;
  author: string;
  tags?: string[];
}

export const BLOG_CATEGORIES = [
  "Todos",
  "Emagrecimento",
  "Hipertrofia",
  "Saúde",
  "Treinamento",
  "Lesões",
  "Hábitos",
];

export const blogPosts: BlogPost[] = [
  {
    slug: "por-que-voce-nao-consegue-emagrecer",
    title: "Por Que Você Não Consegue Emagrecer (E Como Mudar Isso de Vez)",
    excerpt:
      "Você já tentou de tudo: dieta da moda, jejum, treinar todos os dias... e mesmo assim o peso não sai. Entenda o que realmente está te impedindo e como resolver.",
    category: "Emagrecimento",
    date: "2024-12-10",
    updatedAt: "2024-12-10",
    readTime: "8 min",
    author: "Montinho Personal Trainer",
    tags: [
      "emagrecimento",
      "dieta",
      "metabolismo",
      "efeito sanfona",
      "personal trainer alphaville",
      "consultoria online",
    ],
    content: `
<p>Você já fez dieta. Já treinou todos os dias. Já cortou o carboidrato, fez jejum intermitente, tomou chás milagrosos e até acordou cedo para malhar antes do trabalho. E ainda assim, a balança não se move — ou pior, você recupera tudo assim que relaxa.</p>

<p>Se isso soa familiar, você não está sozinho. Durante anos eu mesmo vivi esse ciclo frustrante. Comecei a lutar contra a balança na infância, passei pela adolescência tentando cada dieta nova, e entrei na vida adulta acumulando frustrações. O efeito sanfona foi meu companheiro por muito tempo.</p>

<p>Tudo mudou quando entendi <strong>por que</strong> estava falhando — não o que estava fazendo de errado isoladamente. Neste artigo, vou te mostrar o motivo real pelo qual a maioria das pessoas não consegue emagrecer de forma definitiva.</p>

<h2>O problema não é falta de força de vontade</h2>

<p>A narrativa cultural diz que emagrecer é simples: é só ter disciplina. Se você falhou, é porque não se dedicou o suficiente. Essa narrativa é tóxica — e completamente equivocada.</p>

<p>O que ninguém conta é que o corpo humano tem mecanismos biológicos poderosos que resistem à perda de peso. Quando você tenta forçar esse processo com restrição extrema, o corpo luta de volta. E quase sempre vence.</p>

<h2>O ciclo vicioso das dietas restritivas</h2>

<p>A grande maioria das "soluções" para emagrecimento funciona assim:</p>
<ol>
  <li>Você corta calorias drasticamente</li>
  <li>Perde peso rápido — grande parte é água e músculo</li>
  <li>Seu metabolismo desacelera como resposta de sobrevivência</li>
  <li>A fome se torna incontrolável</li>
  <li>Você quebra a dieta e recupera tudo, mais um pouco</li>
</ol>

<p>Isso não é fraqueza. É biologia. Seu corpo está fazendo exatamente o que foi programado para fazer.</p>

<h2>Como seu metabolismo reage à restrição</h2>

<h3>Déficit calórico extremo</h3>
<p>Comer muito pouco faz seu metabolismo de repouso cair. Isso significa que você queima menos calorias fazendo as mesmas atividades — e o processo piora quanto mais tempo você mantém a restrição.</p>

<h3>Perda de massa muscular</h3>
<p>Sem proteína suficiente e estímulo de força, o corpo usa o músculo como combustível durante o emagrecimento. Menos músculo significa metabolismo mais lento e cada vez mais difícil manter o peso.</p>

<h3>Aumento do apetite</h3>
<p>Hormônios como a grelina aumentam significativamente durante dietas restritivas. A vontade de comer não é fraqueza psicológica — é uma resposta hormonal direta à restrição.</p>

<h2>O que realmente funciona para emagrecer</h2>

<p>Emagrecimento sustentável vem de uma abordagem estruturada, não de restrição extrema:</p>
<ul>
  <li><strong>Déficit calórico moderado</strong> — suficiente para perder gordura, pequeno o bastante para não disparar a resposta de sobrevivência</li>
  <li><strong>Proteína adequada</strong> — preserva a massa muscular durante o processo</li>
  <li><strong>Treino de força</strong> — mantém e aumenta o metabolismo de repouso</li>
  <li><strong>Consistência ao longo do tempo</strong> — não perfeição, mas constância</li>
  <li><strong>Acompanhamento profissional</strong> — ajustes contínuos conforme o corpo responde</li>
</ul>

<h2>Por que o acompanhamento muda tudo</h2>

<p>Quando você tenta fazer tudo sozinho, cada obstáculo vira um motivo para desistir. Com um profissional ao seu lado, cada obstáculo vira uma oportunidade de ajuste.</p>

<p>Como Personal Trainer em Alphaville, atendo presencialmente alunos de Barueri e Santana de Parnaíba. Para quem está em outra cidade, ofereço consultoria online com o mesmo nível de acompanhamento.</p>

<p>Eu já estive do outro lado. Sei como é acordar de manhã, se olhar no espelho e não se reconhecer. Por isso o meu trabalho vai muito além dos exercícios — é sobre te ajudar a construir uma relação diferente com seu corpo e com sua saúde.</p>

<p><strong>Leia também:</strong></p>
<ul>
  <li><a href="/blog/habitos-que-sabotam-seu-emagrecimento">5 Hábitos do Dia a Dia Que Estão Sabotando Seu Emagrecimento</a></li>
  <li><a href="/blog/erros-comuns-no-treino-de-musculacao">7 Erros Comuns na Musculação Que Sabotam Seus Resultados</a></li>
</ul>
    `,
  },
  {
    slug: "erros-comuns-no-treino-de-musculacao",
    title: "7 Erros Comuns na Musculação Que Sabotam Seus Resultados",
    excerpt:
      "A maioria das pessoas passa meses na academia sem ver resultado por causa de erros simples que são fáceis de corrigir. Veja se você está cometendo algum deles.",
    category: "Treinamento",
    date: "2024-11-28",
    updatedAt: "2024-11-28",
    readTime: "7 min",
    author: "Montinho Personal Trainer",
    tags: [
      "musculação",
      "treino de força",
      "hipertrofia",
      "erros no treino",
      "personal trainer alphaville",
      "barueri",
    ],
    content: `
<p>Você treina há meses. Vai à academia com frequência. Sente o cansaço depois de cada sessão. Mas quando se olha no espelho, pouco mudou.</p>

<p>Isso é mais comum do que parece — e quase sempre tem uma explicação concreta. Acompanhando alunos como Personal Trainer em Alphaville e em consultoria online em todo o Brasil, percebi que os mesmos erros aparecem repetidamente. Erros que nenhum app de treino corrige sozinho.</p>

<p>A boa notícia: todos eles são corrigíveis. Veja se você está cometendo algum destes.</p>

<h2>Treinar muito não é treinar bem</h2>

<p>Um dos maiores mitos no mundo fitness é que mais treino significa mais resultado. Na prática, acontece o oposto: treino excessivo sem recuperação adequada leva a estagnação, lesões e até perda de massa muscular.</p>

<p>A qualidade do treino — execução, progressão, periodização — importa muito mais do que o volume bruto de horas na academia.</p>

<h2>Os 7 erros que estão travando seus resultados</h2>

<h3>1. Não ter progressão de carga</h3>
<p>Se você faz os mesmos exercícios com o mesmo peso há meses, seu corpo não tem motivo para mudar. O princípio da sobrecarga progressiva é a base da hipertrofia: você precisa desafiar seus músculos continuamente para estimular adaptação.</p>

<h3>2. Ignorar a técnica por ego</h3>
<p>Pegar peso demais com técnica ruim não constrói músculo — constrói lesão. Vi incontáveis pessoas se machucarem por não aceitar começar com carga menor e aprender o movimento correto. O ego cobra caro depois.</p>

<h3>3. Não descansar o suficiente</h3>
<p>O músculo cresce durante o descanso, não durante o treino. O treino gera o estímulo; o sono e a recuperação geram a adaptação. Dormir 7 a 9 horas por noite não é luxo — é parte fundamental do processo.</p>

<h3>4. Treinar sem planejamento</h3>
<p>Entrar na academia e fazer o que dá na cabeça não é método, é passatempo. Resultados consistentes exigem programação inteligente: volume, intensidade, frequência e periodização pensados em conjunto.</p>

<h3>5. Negligenciar a alimentação</h3>
<p>Você pode treinar perfeitamente e não ver resultado se a alimentação não estiver alinhada. Proteína insuficiente, calorias muito baixas — tudo isso impacta diretamente o que acontece com o seu corpo.</p>

<h3>6. Pular o aquecimento</h3>
<p>O aquecimento prepara o sistema nervoso, eleva a temperatura muscular e previne lesões. Cinco a dez minutos antes do treino fazem uma diferença enorme no longo prazo.</p>

<h3>7. Desistir cedo demais</h3>
<p>Resultados reais levam tempo. A maioria das pessoas desiste exatamente quando está prestes a ver a transformação acontecer. Consistência por meses — não semanas — é o que separa quem transforma o corpo de quem fica estagnado.</p>

<h2>Como corrigir o caminho</h2>

<p>Identificou algum desses erros na sua rotina? O importante é corrigir o caminho com a orientação certa.</p>

<p>Um Personal Trainer experiente identifica esses pontos em minutos e traça um plano para corrigi-los. Se você está em Alphaville, Barueri ou Santana de Parnaíba, podemos trabalhar presencialmente. Se estiver em outra cidade, a consultoria online oferece o mesmo nível de acompanhamento.</p>

<p><strong>Leia também:</strong></p>
<ul>
  <li><a href="/blog/como-prevenir-lesoes-no-treino">Como Prevenir Lesões e Treinar Por Décadas Sem Dor</a></li>
  <li><a href="/blog/por-que-voce-nao-consegue-emagrecer">Por Que Você Não Consegue Emagrecer</a></li>
</ul>
    `,
  },
  {
    slug: "como-prevenir-lesoes-no-treino",
    title: "Como Prevenir Lesões e Treinar Por Décadas Sem Dor",
    excerpt:
      "Lesões são o maior inimigo dos resultados a longo prazo. Aprenda as estratégias que uso com meus alunos para treinar com intensidade e sem se machucar.",
    category: "Lesões",
    date: "2024-11-15",
    updatedAt: "2024-11-15",
    readTime: "6 min",
    author: "Montinho Personal Trainer",
    tags: [
      "prevenção de lesões",
      "mobilidade",
      "longevidade no treino",
      "personal trainer alphaville",
      "santana de parnaíba",
    ],
    content: `
<p>Nada compromete mais o progresso de longo prazo do que uma lesão. Uma fisgada no ombro, uma dor persistente no joelho, uma lombalgia que aparece após o agachamento — e semanas ou meses de treino vão por água abaixo.</p>

<p>O pior: a maioria das lesões não acontece de repente. Elas se desenvolvem silenciosamente por semanas, como resultado de padrões de movimento incorretos, sobrecarga mal distribuída e falta de mobilidade. E são amplamente evitáveis com a abordagem certa.</p>

<p>Estes são os princípios que aplico com meus alunos — tanto no atendimento presencial em Alphaville quanto na consultoria online em todo o Brasil — para garantir décadas de treino consistente e sem dor.</p>

<h2>A lesão que ninguém fala</h2>

<p>Existe a lesão aguda — aquela que acontece de repente com um estalo ou dor intensa. E existe a lesão crônica — aquela que vai se desenvolvendo silenciosamente por meses de má postura, sobrecarga errada e falta de mobilidade.</p>

<p>A segunda é muito mais comum e muito mais traiçoeira. Você treina sentindo um desconforto que vai aumentando gradualmente, até que um dia não consegue mais treinar. É para evitar esse cenário que falo tanto sobre prevenção.</p>

<h2>Os princípios da longevidade no treino</h2>

<h3>Mobilidade antes da força</h3>
<p>Não adianta querer levantar muito peso se você não tem mobilidade para executar o movimento com segurança. Investir em mobilidade não é fraqueza — é inteligência. Um agachamento profundo bem executado vale muito mais do que um parcial cheio de compensações.</p>

<h3>Respeitar os sinais do corpo</h3>
<p>Existe uma diferença importante entre desconforto muscular — que é normal e esperado — e dor articular, que é sinal de alerta. Aprender a distinguir os dois é fundamental para treinar com segurança a longo prazo.</p>

<h3>Progressão gradual de carga</h3>
<p>O corpo precisa de tempo para se adaptar a novas cargas. Aumentar peso demais, rápido demais, é a receita para lesão. Paciência e progressão gradual não são sinais de fraqueza — são a estratégia de quem quer resultados sustentáveis.</p>

<h3>Recuperação ativa</h3>
<p>Dias de descanso não precisam ser dias sem movimento. Caminhada leve, alongamento, trabalho de mobilidade — tudo isso acelera a recuperação e previne lesões ao manter o fluxo sanguíneo e reduzir a rigidez muscular.</p>

<h3>Aquecimento específico</h3>
<p>O aquecimento não é opcional. Cinco a dez minutos preparando o sistema nervoso e elevando a temperatura muscular reduzem drasticamente o risco de lesões agudas e melhoram a qualidade do treino como um todo.</p>

<h2>O papel do profissional na prevenção</h2>

<p>Um bom Personal Trainer não serve apenas para te dar exercícios. Serve para identificar desequilíbrios musculares antes que virem problema, corrigir padrões de movimento errados, e adaptar o treino quando algo não está certo.</p>

<p>Como Personal Trainer em Alphaville, trabalho com alunos de Barueri e Santana de Parnaíba que chegaram com histórico de lesões. Em muitos casos, não apenas treinamos com segurança — como resolvemos problemas crônicos que carregavam há anos.</p>

<p>É muito mais barato — e mais inteligente — investir em prevenção do que tratar uma lesão depois que ela aconteceu.</p>

<p><strong>Leia também:</strong></p>
<ul>
  <li><a href="/blog/erros-comuns-no-treino-de-musculacao">7 Erros Comuns na Musculação Que Sabotam Seus Resultados</a></li>
  <li><a href="/blog/habitos-que-sabotam-seu-emagrecimento">5 Hábitos do Dia a Dia Que Estão Sabotando Seu Emagrecimento</a></li>
</ul>
    `,
  },
  {
    slug: "habitos-que-sabotam-seu-emagrecimento",
    title: "5 Hábitos do Dia a Dia Que Estão Sabotando Seu Emagrecimento",
    excerpt:
      "Às vezes não é a dieta ou o treino o problema. São comportamentos do cotidiano que você nem percebe que estão impedindo seu progresso.",
    category: "Hábitos",
    date: "2024-10-30",
    updatedAt: "2024-10-30",
    readTime: "5 min",
    author: "Montinho Personal Trainer",
    tags: [
      "hábitos saudáveis",
      "emagrecimento",
      "sono",
      "estresse",
      "consultoria online",
      "personal trainer alphaville",
    ],
    content: `
<p>Você segue o treino à risca. Tenta comer bem. Faz sua parte. Mas os resultados não aparecem. Antes de culpar seu metabolismo ou sua genética, considere uma possibilidade: o problema pode estar em hábitos que você nem está monitorando.</p>

<p>Comportamentos cotidianos aparentemente inofensivos podem estar sabotando silenciosamente todo o seu esforço. Alguns deles você provavelmente não imaginava que tinham impacto direto no emagrecimento.</p>

<p>Identifique os que se aplicam à sua rotina — e comece a corrigir um de cada vez.</p>

<h2>Os vilões invisíveis do emagrecimento</h2>

<p>Dieta e treino são fundamentais, mas representam apenas parte do quadro. O estilo de vida ao redor do treino — o que você faz nas outras 23 horas do dia — tem um impacto enorme sobre os resultados. Esses cinco hábitos são os que aparecem com mais frequência nos alunos que chegam até mim sem conseguir emagrecer, mesmo fazendo tudo "certo".</p>

<h2>Os 5 hábitos que estão sabotando seu progresso</h2>

<h3>1. Dormir pouco ou mal</h3>
<p>Privação de sono aumenta o cortisol (hormônio do estresse), que por sua vez aumenta o apetite e favorece o acúmulo de gordura abdominal. Dormir mal também prejudica a recuperação muscular e reduz a disposição para treinar no dia seguinte.</p>

<h3>2. Estresse crônico</h3>
<p>O cortisol elevado de forma crônica é um dos maiores sabotadores do emagrecimento. Estratégias de gerenciamento de estresse — meditação, tempo na natureza, atividades prazerosas — não são frescura, são parte do processo de transformação.</p>

<h3>3. Beber pouca água</h3>
<p>Desidratação leve já prejudica o metabolismo e pode ser confundida com fome. Beber água adequadamente é uma das estratégias mais simples e eficientes para apoiar o emagrecimento — e a maioria das pessoas bebe muito menos do que deveria.</p>

<h3>4. Comer distraído</h3>
<p>Comer na frente da tela, no carro ou em pé não permite que o cérebro registre a saciedade adequadamente. Você come mais do que precisa sem perceber. Refeições feitas com atenção — sem telas, sentado — resultam em maior satisfação com menos comida.</p>

<h3>5. Subestimar calorias líquidas</h3>
<p>Sucos, refrigerantes, bebidas alcoólicas, café com açúcar — essas calorias somam muito e raramente são consideradas no controle alimentar. Trocar bebidas calóricas por água ou chá sem açúcar é uma mudança simples com grande impacto acumulado.</p>

<h2>A mudança começa nos hábitos</h2>

<p>Transformação real não vem de dietas temporárias, mas de hábitos construídos com consistência ao longo do tempo. Cada um desses cinco pontos, corrigido gradualmente, pode fazer uma diferença significativa nos seus resultados.</p>

<p>Seja no atendimento presencial em Alphaville ou na consultoria online para todo o Brasil, parte do meu trabalho é exatamente isso: identificar o que está travando o progresso de cada aluno e montar uma estratégia prática e sustentável para a sua realidade.</p>

<p><strong>Leia também:</strong></p>
<ul>
  <li><a href="/blog/por-que-voce-nao-consegue-emagrecer">Por Que Você Não Consegue Emagrecer (E Como Mudar Isso de Vez)</a></li>
  <li><a href="/blog/como-prevenir-lesoes-no-treino">Como Prevenir Lesões e Treinar Por Décadas Sem Dor</a></li>
</ul>
    `,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  if (category === "Todos") return blogPosts;
  return blogPosts.filter((post) => post.category === category);
}

export function getRelatedPosts(currentSlug: string, category: string): BlogPost[] {
  return blogPosts
    .filter((post) => post.slug !== currentSlug && post.category === category)
    .slice(0, 2);
}
