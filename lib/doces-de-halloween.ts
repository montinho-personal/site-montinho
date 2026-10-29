import type { BlogPost } from "./blog";

/**
 * "Doces de Halloween fáceis e rápidos" (29/10/2026). Export do Answer the
 * Public de "doces de halloween" + prints do Google (autocompletar, visão
 * geral por IA e "Outras pessoas pesquisaram"). A busca é quase toda de
 * receita: "fáceis e rápidos" 1,3 mil/mês, "para festa" 210, "para fazer"
 * 170, "simples" 70, "o que dar de doces" 20. "Calorias" e "sem açúcar"
 * vieram com zero, então as calorias entram como seção, não como artigo
 * próprio (decisão do Montinho). Fora: compra, marcas (Fini), desenho,
 * colorir, jogos (Blox Fruits, Hay Day, Brookhaven), cidades.
 *
 * Números: calorias dos doces comprados da base do Beliscômetro (TACO e
 * USDA, com a porção estimada de lá) e minutos de caminhada moderada pela
 * lib/caminhada (3,8 METs do Compêndio, 70 kg). As receitas não têm
 * calorias por unidade: o tamanho muda tudo, e nenhuma foi pesada aqui.
 *
 * Ferramenta: Calculadora de Calorias na Caminhada como link (a conta que
 * sobra é "quanto eu gasto para compensar"), com Beliscômetro e Mata a
 * Vontade linkados no texto.
 */

export const DOCES_HALLOWEEN_POSTS: BlogPost[] = [
  {
    slug: "doces-de-halloween-faceis-e-rapidos",
    title: "Doces de Halloween Fáceis e Rápidos (e Versões Mais Leves)",
    metaTitle: "Doces de Halloween Fáceis e Rápidos (e Versões Leves)",
    metaDescription:
      "Abóbora de brigadeiro, dedos de bruxa, fantasma de banana e mais doces de Halloween fáceis para festa, quais são os mais leves e as calorias dos comprados.",
    excerpt:
      "Oito doces de Halloween que saem em minutos, quatro clássicos e quatro mais leves, o que dar para as crianças e quantas calorias têm os doces comprados, sem terrorismo.",
    category: "Nutrição",
    date: "2026-10-29",
    readTime: "7 min",
    author: "Montinho",
    tags: ["halloween", "doces", "receitas fáceis", "festa", "calorias"],
    faq: [
      {
        question: "Quais doces de Halloween são fáceis e rápidos?",
        answer:
          "Os mais rápidos são os que não vão ao forno: fantasmas de banana, abóboras de tangerina, morangos fantasma, dedos de bruxa de biscoito palito e o copinho cemitério de iogurte. A abóbora de brigadeiro também é fácil, só pede uns minutos de panela e o tempo de esfriar.",
      },
      {
        question: "Como fazer abóbora de brigadeiro?",
        answer:
          "Cozinhe 1 lata de leite condensado com 1 colher de sopa de manteiga e 3 colheres de sopa de leite em pó, mexendo até desgrudar da panela. Pingue corante alimentício laranja, deixe esfriar, enrole bolinhas, marque os gomos com um palito e coloque um cravo ou um pedacinho de chocolate como cabinho.",
      },
      {
        question: "Quais doces servir numa festa de Halloween?",
        answer:
          "Misture clássicos e leves: abóbora de brigadeiro, dedos de bruxa e morangos fantasma de um lado, fantasmas de banana, abóboras de tangerina e copinhos cemitério do outro. Doces que se pegam com a mão, em porção pequena, funcionam melhor na mesa.",
      },
      {
        question: "O que dar de doces no Halloween?",
        answer:
          "Para quem bate na porta, o mais prático são doces embalados um a um: balas, pirulitos, chocolates pequenos e paçoca. Embalagem fechada é mais segura para quem recebe. Doce caseiro funciona melhor na festa, para quem você conhece.",
      },
      {
        question: "Tem doce de Halloween mais leve?",
        answer:
          "Tem. Fantasmas de banana com gotas de chocolate, abóboras de tangerina e copinho cemitério de iogurte natural com cacau e a lama de bruxa, um brigadeiro de banana com cacau e whey, são temáticos e usam fruta ou iogurte como base, sem leite condensado.",
      },
      {
        question: "Tem doce de Halloween sem açúcar?",
        answer:
          "As abóboras de tangerina não levam açúcar adicionado, só a fruta. Os fantasmas de banana levam apenas três gotinhas de chocolate cada, e o copinho cemitério pode ser feito com iogurte natural sem açúcar e cacau 100%.",
      },
      {
        question: "Quantas calorias tem uma bala?",
        answer:
          "Uma bala dura de cerca de 5 g tem perto de 20 kcal. Cinco balas somam por volta de 100 kcal, o que uma pessoa de 70 kg gasta em cerca de 21 minutos de caminhada em ritmo moderado.",
      },
      {
        question: "Quantas calorias tem um brigadeiro?",
        answer:
          "Um brigadeiro de festa, de cerca de 15 g, tem perto de 58 kcal, numa receita calculada com os ingredientes da tabela TACO. É o que uma pessoa de 70 kg gasta em cerca de 12 minutos de caminhada moderada.",
      },
      {
        question: "Comer doce no Halloween estraga a dieta?",
        answer:
          "Não. Um dia de doce não desfaz uma semana de alimentação e treino. O que pesa é a média: se o Halloween vira uma semana de saquinho de doce aberto em casa, aí sim soma. Coma o que quiser na festa, com calma, e volte para a rotina no dia seguinte.",
      },
    ],
    content: `<img src="/blog-images/doces-de-halloween-capa.webp" alt="Capa: Doces de Halloween fáceis, rápidos e versões mais leves. Ilustração de lua, chapéu de bruxa, caldeirão, fantasma e docinhos em forma de abóbora" title="Doces de Halloween Fáceis e Rápidos — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Doces de Halloween fáceis e rápidos</strong> são os que saem sem forno e sem técnica: banana que vira fantasma, tangerina que vira abóbora, brigadeiro que ganha gomos. Abaixo estão oito ideias para festa, quatro clássicas e quatro mais leves, o que dar para quem bate na porta e quantas calorias têm os doces comprados, para você decidir com informação, não com culpa.</p>

<h2>Doces de Halloween clássicos, fáceis e rápidos</h2>

<h3>1. Abóbora de brigadeiro</h3>
<p>O doce de Halloween mais pedido. Rende cerca de 25 unidades.</p>
<ul>
<li>1 lata de leite condensado</li>
<li>1 colher de sopa de manteiga</li>
<li>3 colheres de sopa de leite em pó</li>
<li>Corante alimentício laranja</li>
<li>Cravos-da-índia ou pedacinhos de chocolate para o cabinho</li>
</ul>
<p>Cozinhe o leite condensado, a manteiga e o leite em pó em fogo baixo, mexendo sem parar, até a massa desgrudar do fundo da panela. Desligue, pingue o corante aos poucos até chegar no laranja e deixe esfriar. Com as mãos untadas, enrole bolinhas, marque os gomos de cima para baixo com um palito e finalize com o cabinho. Se usar cravo, avise que ele não é para comer.</p>

<h3>2. Olhos de monstro</h3>
<p>Mesma massa da abóbora, sem corante. Enrole bolinhas brancas e coloque um confeito ou uma gota de chocolate no centro, como a íris. Para o efeito de "olho vermelho", desenhe veias com uma caneta de corante alimentício vermelho.</p>

<h3>3. Dedos de bruxa</h3>
<p>A versão mais rápida não vai ao forno. Derreta chocolate ao leite ou meio amargo, mergulhe biscoitos tipo palito até a metade e prenda uma amêndoa na ponta, como a unha. Deixe firmar na geladeira por 10 minutos.</p>

<h3>4. Morangos fantasma</h3>
<p>Lave e seque bem os morangos, mergulhe em chocolate branco derretido e coloque em papel-manteiga. Antes de firmar, faça dois olhos e uma boca com gotas de chocolate meio amargo. Na geladeira, ficam prontos em 15 minutos.</p>

<h2>Doces de Halloween mais leves</h2>
<p>Temáticos do mesmo jeito, mas com fruta ou iogurte como base, sem leite condensado: são os doces fit com banana e com iogurte natural, em versão de Halloween. Funcionam bem misturados aos clássicos na mesa, e as crianças costumam gostar justamente pela cara.</p>

<h3>5. Fantasmas de banana</h3>
<p>Corte bananas ao meio, no sentido da largura, e deixe as metades em pé. Use três gotas de chocolate 70% para fazer os olhos e a boca. Faça na hora de servir, porque a banana escurece.</p>

<h3>6. Abóboras de tangerina</h3>
<p>Descasque tangerinas inteiras e espete no topo um pedacinho de salsão ou uma folha de hortelã, como o cabinho da abóbora. Não leva açúcar nenhum além do da fruta.</p>

<h3>7. Copinho cemitério</h3>
<p>Num copinho, coloque iogurte natural ou grego. Por cima, faça a "terra" com cacau em pó 100% misturado a um pouco de aveia em flocos. Espete meio biscoito de maisena como lápide. O iogurte grego ainda traz proteína, o que deixa o doce mais saciante.</p>
<h3>8. Lama de bruxa (brigadeiro de banana fit)</h3>
<p>O doce fit de banana com três ingredientes, servido como lama de caldeirão. Para uma porção: amasse 1 banana bem madura com 1 colher de sopa de cacau 100%, leve ao micro-ondas por 1 minuto, mexa e volte por mais 1 minuto. Espere amornar e misture 20 g de whey de chocolate até engrossar. Sirva num copinho escuro, com duas gotas de chocolate por cima como olhos. É de colher: a massa fica mole demais para enrolar. O whey entra só depois de amornar, porque no calor direto ele empelota.</p>
<p>Quer mais ideias de doce com menos açúcar, com o que você tem em casa? O <a href="/ferramentas/mata-a-vontade">Mata a Vontade</a> sugere receitas a partir da sua vontade do momento.</p>

<h2>O que dar de doces no Halloween</h2>
<p>Para quem bate na porta pedindo "doces ou travessuras", o mais prático é ter doces <strong>embalados um a um</strong>: balas, pirulitos, chocolates pequenos e paçoca. Embalagem fechada é mais segura para quem recebe, e os pais costumam preferir. O doce caseiro fica para a festa, com quem você conhece.</p>
<p>Uma ideia que funciona: monte os saquinhos já com a quantidade que você quer dar, em vez de deixar a tigela aberta. Ajuda a distribuir para todo mundo e evita que o que sobrou fique a semana inteira na sua cozinha.</p>

<h2>Quantas calorias têm os doces de Halloween comprados</h2>
<p>Não é para fazer conta na festa. Mas, se você tem curiosidade, a tabela mostra a energia dos doces mais comuns e quanto tempo de caminhada em ritmo moderado uma pessoa de 70 kg leva para gastar isso.</p>
<table>
<thead><tr><th>Doce</th><th>Porção</th><th>Calorias</th><th>Caminhada moderada (70 kg)</th></tr></thead>
<tbody>
<tr><td>Bala dura</td><td>1 unidade (≈ 5 g)</td><td>≈ 20 kcal</td><td>≈ 4 min</td></tr>
<tr><td>Bala dura</td><td>5 unidades (≈ 25 g)</td><td>≈ 100 kcal</td><td>≈ 21 min</td></tr>
<tr><td>Brigadeiro</td><td>1 unidade (≈ 15 g)</td><td>≈ 58 kcal</td><td>≈ 12 min</td></tr>
<tr><td>Paçoca</td><td>1 unidade (≈ 20 g)</td><td>≈ 97 kcal</td><td>≈ 21 min</td></tr>
<tr><td>Chocolate ao leite</td><td>20 g</td><td>≈ 108 kcal</td><td>≈ 23 min</td></tr>
</tbody>
</table>
<p>Calorias por 100 g da tabela TACO (chocolate ao leite, paçoca de amendoim; brigadeiro calculado com os ingredientes dela) e da USDA FoodData Central (bala dura), com porções estimadas. A caminhada usa 3,8 METs do Compêndio de Atividades Físicas para o ritmo moderado, entre 4,5 e 5,5 km/h. Para fazer a conta com o seu peso e o seu ritmo, use a <a href="/ferramentas/calculadora-calorias-caminhada">Calculadora de Calorias na Caminhada</a>, e, para somar os beliscos do dia, o <a href="/ferramentas/beliscometro">Beliscômetro</a>.</p>

<h2>Comer doce no Halloween estraga a dieta?</h2>
<p>Não. Um dia de festa não desfaz o que você faz no resto da semana, nem no treino nem na alimentação. O que conta é a média. O risco do Halloween não é a noite: é o saquinho que sobra aberto em casa e vira um belisco por dia até o fim do mês.</p>
<p>Então aproveite a festa sem culpa, coma devagar o que você gosta de verdade e, no dia seguinte, volte para a rotina. Se você quer ver como uma noite fora entra na conta da semana, o <a href="/ferramentas/simulador-fim-de-semana">Simulador de Fim de Semana</a> faz essa conta. E, se a vontade de doce aparece todo dia, o artigo de <a href="/blog/vontade-de-doce">vontade de doce</a> ajuda.</p>

<h2>Não se compare</h2>
<p>Tem gente que passa o Halloween sem tocar num doce e gente que come o saquinho inteiro. Nenhum dos dois é a régua. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer e de treinar que dê para manter o ano todo, festa incluída.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/vontade-de-doce">Vontade de doce: por que dá e como controlar</a></li>
<li><a href="/blog/chocolate-engorda">Chocolate engorda? Como encaixar sem sabotar a dieta</a></li>
<li><a href="/blog/como-nao-engordar-na-pascoa">Como não engordar na Páscoa</a></li>
<li><a href="/blog/como-aproveitar-ceia-sem-exagerar">Como aproveitar a ceia de Natal sem exagerar</a></li>
</ul>`,
  },
];
