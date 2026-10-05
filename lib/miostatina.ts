import type { BlogPost } from "./blog";

/** Cluster trevogrumabe / miostatina (out/2026). Medicamentos experimentais:
 *  sem dose, sem preço, sem promessa. Fontes: comunicado da Regeneron
 *  (01/10/2026, EASD), Folha, VEJA, BELIEVE (ADA 2025), Scholar Rock. */
const FONTES_TREVO = `<p><small>Fontes: comunicado da Regeneron sobre o estudo COURAGE (01/10/2026, apresentado no congresso da EASD e no prelo na The Lancet); reportagens da Folha de S.Paulo e da VEJA sobre o estudo; resultados do estudo BELIEVE (bimagrumabe + semaglutida) apresentados no congresso da ADA; comunicados da Scholar Rock sobre o apitegromabe.</small></p>`;

const FECHO = `<h2>Não se compare</h2>
<p>Cada um tem a própria genética, rotina e história, com altos e baixos. Remédio novo nenhum substitui um treino que você consiga seguir pelo resto da vida, com aderência e progressão. Se você usa ou vai usar uma caneta e quer ajuda para montar e ajustar o treino, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>`;

export const MIOSTATINA_POSTS: BlogPost[] = [
  {
    slug: "trevogrumabe",
    title: "Trevogrumabe: o que é, resultados e quando chega ao Brasil",
    metaTitle: "Trevogrumabe: O Que É, Resultados do Estudo e Se Já Foi Aprovado",
    metaDescription:
      "Trevogrumabe é um anticorpo experimental que bloqueia a miostatina. Veja o que o estudo COURAGE mostrou com semaglutida, se já é vendido e o que fazer hoje para não perder músculo.",
    excerpt:
      "O anticorpo que bloqueia a miostatina e reduziu a perda de músculo de quem emagrece com semaglutida. O que o estudo mostrou e o que ainda não se sabe.",
    category: "Saúde",
    date: "2026-10-05",
    readTime: "7 min",
    author: "Montinho Personal Trainer",
    tags: ["trevogrumabe", "miostatina", "semaglutida", "GLP-1", "massa muscular"],
    content: `<p>O <strong>trevogrumabe</strong> (trevogrumab, em inglês) é um anticorpo monoclonal experimental da Regeneron que bloqueia a <a href="/blog/miostatina-o-que-e">miostatina</a>, uma proteína que freia o crescimento do músculo. Ele está sendo estudado junto com remédios da família GLP-1, como a semaglutida, para que a pessoa perca peso perdendo menos músculo.</p>
<p><strong>Ele ainda não é aprovado nem vendido</strong>, no Brasil ou em qualquer outro país. É um medicamento em fase 2 de testes.</p>

<h2>Por que existe: o problema da perda de músculo nas canetas</h2>
<p>Quem emagrece com GLP-1 perde gordura, mas também perde massa magra. No estudo COURAGE, cerca de <strong>um terço do peso perdido só com semaglutida foi massa magra</strong>, segundo a Regeneron. Para quem já tem pouco músculo, ou para quem tem mais de 40 anos, isso pesa em força, metabolismo e autonomia. Explico o tamanho do problema em <a href="/blog/ozempic-faz-perder-musculo">Ozempic faz perder músculo?</a></p>

<h2>O que o estudo COURAGE mostrou</h2>
<ul>
<li>Pessoas com obesidade receberam semaglutida sozinha ou combinada com trevogrumabe. A Folha descreveu um estudo com quase mil pacientes de 18 a 65 anos.</li>
<li>Num subestudo com ressonância, o trevogrumabe <strong>evitou cerca de 70% da perda de músculo</strong> associada à semaglutida.</li>
<li>Os grupos com a combinação tiveram composição corporal melhor: mais gordura perdida e mais massa magra preservada.</li>
<li>O peso total perdido <strong>não aumentou de forma relevante</strong>. O efeito foi na qualidade do emagrecimento, não na quantidade.</li>
<li>Quem já tinha pouca massa magra perdeu mais músculo com a semaglutida e foi quem mais preservou com a combinação.</li>
</ul>
<p>Os resultados foram apresentados no congresso europeu de diabetes (EASD) e estão no prelo na revista The Lancet. A Regeneron anunciou um novo estudo em idosos com obesidade e pouca força ou massa muscular.</p>

<h2>Trevogrumabe já foi aprovado? Quando chega ao Brasil?</h2>
<p>Não foi aprovado pela FDA nem pela Anvisa. Depois da fase 2 ainda vêm estudos maiores, e não há data prevista de chegada ao Brasil. Qualquer produto vendido hoje com esse nome, ou como "bloqueador de miostatina", não é o medicamento do estudo.</p>

<h2>Quanto custa o trevogrumabe?</h2>
<p>Não tem preço, porque não está à venda. Desconfie de quem oferece.</p>

<h2>Trevogrumabe x bimagrumabe x apitegromabe</h2>
<p>São três anticorpos que mexem na mesma via da miostatina, com alvos e objetivos diferentes. Comparo os três em <a href="/blog/bimagrumabe-trevogrumabe-apitegromabe">bimagrumabe, trevogrumabe e apitegromabe: diferenças</a>.</p>

<h2>Efeitos colaterais</h2>
<p>O comunicado da empresa trata de eficácia; a segurança completa sai na publicação científica. Remédio experimental só se usa dentro de estudo clínico, com médico.</p>

<h2>O que fazer hoje, sem esperar remédio novo</h2>
<p>O que já preserva músculo durante o uso de GLP-1 é conhecido e está disponível: musculação com progressão de carga e proteína suficiente. Os detalhes estão em <a href="/blog/como-evitar-perder-massa-muscular-mounjaro">como evitar perder massa muscular</a>, <a href="/blog/como-treinar-usando-qualquer-glp1">como treinar usando qualquer GLP-1</a> e <a href="/blog/semaglutida-e-musculacao">semaglutida e musculação</a>.</p>
<p>Para ter uma ideia de quanto do seu peso perdido pode ser massa magra, use a <a href="/ferramentas/massa-magra-glp1">calculadora de massa magra no GLP-1</a>.</p>
<p><em>Este conteúdo é informativo. Remédio, dose e troca de tratamento são decisão do seu médico.</em></p>

${FECHO}
${FONTES_TREVO}
`,
    faq: [
      { question: "O que é trevogrumabe?", answer: "Um anticorpo monoclonal experimental da Regeneron que bloqueia a miostatina, proteína que freia o crescimento muscular. Está em estudo junto com a semaglutida para reduzir a perda de músculo no emagrecimento." },
      { question: "Trevogrumabe já está à venda?", answer: "Não. Está em fase 2 de testes e não foi aprovado pela FDA nem pela Anvisa. Não há preço nem data de chegada ao Brasil." },
      { question: "Qual o resultado do trevogrumabe com semaglutida?", answer: "No estudo COURAGE, um subestudo com ressonância mostrou que a combinação evitou cerca de 70% da perda de músculo causada pela semaglutida, sem aumentar de forma relevante o peso total perdido." },
      { question: "O trevogrumabe faz emagrecer mais?", answer: "Não de forma relevante. O efeito foi mudar a composição do que se perde: mais gordura e menos massa magra." },
      { question: "Dá para preservar músculo no GLP-1 sem trevogrumabe?", answer: "Sim. Musculação com progressão de carga e proteína suficiente são as estratégias com evidência e disponíveis hoje." },
    ],
  },
  {
    slug: "miostatina-o-que-e",
    title: "Miostatina: o que é, o que bloqueia e se existe inibidor natural",
    metaTitle: "Miostatina: O Que É, O Que Bloqueia e Inibidor Natural Existe?",
    metaDescription:
      "Miostatina é a proteína que freia o crescimento do músculo. Veja o que bloqueia a miostatina, se alimentos e suplementos inibidores funcionam e o que o treino faz com ela.",
    excerpt:
      "A proteína que freia o músculo, os remédios que a bloqueiam e por que suplemento 'inibidor de miostatina' não tem a prova que promete.",
    category: "Saúde",
    date: "2026-10-05",
    readTime: "6 min",
    author: "Montinho Personal Trainer",
    tags: ["miostatina", "folistatina", "hipertrofia", "trevogrumabe", "suplementos"],
    content: `<p>A <strong>miostatina</strong> (também chamada de GDF-8) é uma proteína produzida pelo próprio músculo que funciona como freio: ela limita o quanto o músculo cresce. Animais e pessoas com mutações que desligam a miostatina têm muito mais massa muscular, e foi daí que surgiu a ideia de bloqueá-la com remédio.</p>

<h2>Miostatina em humanos</h2>
<p>Todo mundo produz miostatina. Ela não é "vilã": faz parte do equilíbrio entre construir e economizar músculo. O interesse médico é em situações de perda muscular, como doenças neuromusculares, envelhecimento e emagrecimento rápido com remédios GLP-1.</p>

<h2>O que bloqueia a miostatina?</h2>
<ul>
<li><strong>Anticorpos em estudo:</strong> o <a href="/blog/trevogrumabe">trevogrumabe</a>, o bimagrumabe e o apitegromabe atuam nessa via. Nenhum é vendido como remédio para emagrecer. Comparo os três em <a href="/blog/bimagrumabe-trevogrumabe-apitegromabe">bimagrumabe, trevogrumabe e apitegromabe</a>.</li>
<li><strong>Folistatina:</strong> uma proteína do próprio corpo que se liga à miostatina e reduz a ação dela. É estudada em pesquisa, inclusive em terapia gênica, não como suplemento.</li>
<li><strong>Treino de força:</strong> estudos mostram que a musculação reduz a expressão de miostatina no músculo treinado. É parte de como o treino faz o músculo crescer.</li>
</ul>

<h2>Existe inibidor natural de miostatina?</h2>
<p>O inibidor "natural" com evidência é o treino. Suplementos vendidos como bloqueadores de miostatina ou como "folistatina" (à base de gema de ovo fertilizado, extratos de algas, epicatequina e outros) não têm estudo sólido mostrando ganho de músculo em pessoas. Uma proteína ingerida é digerida como qualquer outra: ela não chega intacta ao músculo para bloquear nada.</p>

<h2>Alimentos que inibem a miostatina funcionam?</h2>
<p>Listas de "alimentos que inibem a miostatina" costumam se apoiar em estudos com células ou animais. Não há alimento com efeito comprovado sobre a miostatina em pessoas. O que a alimentação faz pelo músculo é garantir proteína e energia suficientes: veja <a href="/blog/proteina-para-quem-usa-mounjaro">quanto de proteína</a> e se a <a href="/blog/creatina-para-quem-usa-mounjaro">creatina</a> ajuda.</p>

<h2>Como diminuir a miostatina na prática</h2>
<ol>
<li>Musculação regular, com progressão de carga.</li>
<li>Proteína suficiente distribuída no dia.</li>
<li>Evitar déficit calórico extremo por muito tempo.</li>
<li>Dormir bem.</li>
</ol>
<p>Nada disso desliga a miostatina, e nem é o objetivo. É o que, junto, faz o músculo crescer ou se manter.</p>
<p><em>Este conteúdo é informativo e não substitui avaliação médica.</em></p>

${FECHO}
<p><small>Fontes: comunicado da Regeneron sobre o estudo COURAGE (01/10/2026); comunicados da Scholar Rock sobre o apitegromabe; literatura científica sobre miostatina (GDF-8) e treino de força.</small></p>
`,
    faq: [
      { question: "O que é miostatina?", answer: "Uma proteína produzida pelo músculo que limita o crescimento dele. Funciona como um freio natural da massa muscular." },
      { question: "O que bloqueia a miostatina?", answer: "Anticorpos em estudo (trevogrumabe, bimagrumabe e apitegromabe), a folistatina produzida pelo corpo e, de forma natural, o treino de força, que reduz a expressão de miostatina no músculo." },
      { question: "Suplemento inibidor de miostatina funciona?", answer: "Não há estudo sólido mostrando ganho de músculo em pessoas. Proteínas ingeridas são digeridas e não chegam intactas ao músculo." },
      { question: "Existe alimento que inibe a miostatina?", answer: "Não há alimento com efeito comprovado em pessoas. O que a dieta faz pelo músculo é garantir proteína e energia suficientes." },
    ],
  },
  {
    slug: "bimagrumabe-trevogrumabe-apitegromabe",
    title: "Bimagrumabe, trevogrumabe e apitegromabe: diferenças",
    metaTitle: "Bimagrumabe, Trevogrumabe e Apitegromabe: Diferenças e Status",
    metaDescription:
      "Os três anticorpos que mexem na via da miostatina: para que cada um é estudado, o que os estudos mostraram com semaglutida e se algum já foi aprovado.",
    excerpt:
      "Três remédios experimentais, a mesma via da miostatina e objetivos diferentes. O que cada estudo mostrou e o status de cada um.",
    category: "Saúde",
    date: "2026-10-05",
    readTime: "5 min",
    author: "Montinho Personal Trainer",
    tags: ["bimagrumabe", "trevogrumabe", "apitegromabe", "miostatina", "GLP-1"],
    content: `<p>Os três são anticorpos monoclonais que atuam na via da <a href="/blog/miostatina-o-que-e">miostatina</a>, o freio natural do músculo. Nenhum está aprovado para emagrecimento.</p>

<h2>Trevogrumabe (Regeneron)</h2>
<p>Bloqueia a miostatina. No estudo de fase 2 COURAGE, junto com semaglutida, evitou cerca de 70% da perda de músculo num subestudo com ressonância, sem aumentar de forma relevante o peso total perdido. Detalhes em <a href="/blog/trevogrumabe">trevogrumabe: o que é</a>.</p>

<h2>Bimagrumabe (Eli Lilly)</h2>
<p>Bloqueia o receptor por onde a miostatina e outras proteínas parecidas agem. É aplicado na veia. No estudo de fase 2 BELIEVE, com 507 pessoas por 72 semanas:</p>
<ul>
<li>a combinação com semaglutida levou a cerca de 22% de perda de peso, contra cerca de 16% com semaglutida sozinha;</li>
<li>quase 93% do peso perdido na combinação foi gordura, contra cerca de 72% com semaglutida sozinha;</li>
<li>quem usou só bimagrumabe perdeu cerca de 11% do peso, tudo em gordura, e ganhou massa magra.</li>
</ul>

<h2>Apitegromabe (Scholar Rock)</h2>
<p>Impede a ativação da miostatina. O foco principal não é obesidade: é a atrofia muscular espinhal (AME), doença neuromuscular. Teve resultado positivo no estudo de fase 3 SAPPHIRE, e o pedido de aprovação estava em análise na FDA, com decisão prevista para o fim de setembro de 2026.</p>

<h2>Resumo</h2>
<ul>
<li><strong>Objetivo:</strong> trevogrumabe e bimagrumabe, preservar músculo no emagrecimento; apitegromabe, ganhar função muscular na AME.</li>
<li><strong>Fase:</strong> trevogrumabe e bimagrumabe em fase 2 para obesidade; apitegromabe já passou da fase 3 na AME.</li>
<li><strong>Aprovação para emagrecer:</strong> nenhum.</li>
</ul>
<p>Comparar estudos diferentes, com pessoas e duração diferentes, é só uma aproximação. Para retatrutida e outras canetas, veja <a href="/blog/retatrutida-ou-mounjaro">retatrutida ou Mounjaro</a>.</p>

<h2>Enquanto isso</h2>
<p>O que já funciona para preservar músculo em quem usa GLP-1 é treino de força e proteína: <a href="/blog/musculacao-durante-uso-de-mounjaro">musculação durante o uso de Mounjaro</a> e a <a href="/ferramentas/massa-magra-glp1">calculadora de massa magra no GLP-1</a>.</p>
<p><em>Conteúdo informativo. Remédio é decisão médica.</em></p>

${FECHO}
${FONTES_TREVO}
`,
    faq: [
      { question: "Qual a diferença entre bimagrumabe e trevogrumabe?", answer: "O trevogrumabe bloqueia a miostatina diretamente; o bimagrumabe bloqueia o receptor por onde ela e proteínas parecidas agem. Os dois são estudados com semaglutida para preservar músculo no emagrecimento." },
      { question: "Bimagrumabe já foi aprovado?", answer: "Não. Está em fase 2 de estudos para obesidade." },
      { question: "Para que serve o apitegromabe?", answer: "É estudado principalmente para a atrofia muscular espinhal (AME), não para emagrecimento." },
    ],
  },
];
