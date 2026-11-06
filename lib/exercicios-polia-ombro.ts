import type { BlogPost } from "./blog";

/**
 * Face pull, tríceps corda e remada alta (06/11/2026). Exercícios com muita
 * busca e sem página no site, pelo Planejador de Palavras-chave do Google Ads
 * (Brasil): "face pull" 135.000/mês, "triceps corda" 135.000 (+ "triceps
 * pulley corda" 9.900, "tríceps na corda" 6.600), "remada alta" 90.500
 * (+ "remada alta polia" 27.100, "com barra" 18.100, "com halteres" 6.600).
 * Publicados a pedido do Montinho ANTES dos prints; título, H2 e FAQ serão
 * revistos com a pesquisa.
 *
 * Sem número de estudo: texto de execução e de escolha de variação. Os
 * músculos seguem o cadastro do próprio site (lib/treino/exercicios.ts).
 *
 * Ferramenta: o Comparador de Exercícios embutido em cada um, com a dúvida
 * que sobra a quem escolhe o exercício:
 *   - face pull x crucifixo inverso no cabo;
 *   - tríceps corda (tríceps pulley) x tríceps testa;
 *   - remada alta x elevação lateral.
 * Os ids do exercício passam a apontar para estes artigos no mapa de treino.
 */

export const EXERCICIOS_POLIA_OMBRO_POSTS: BlogPost[] = [
  {
    slug: "face-pull",
    title: "Face Pull: Como Fazer na Polia, Músculos e Erros Comuns",
    metaTitle: "Face Pull: Como Fazer na Polia e Músculos Trabalhados",
    metaDescription:
      "Face pull trabalha a parte de trás do ombro e o trapézio, com a corda na polia alta. Veja a altura certa da polia, a pegada, o caminho dos cotovelos e os erros que viram remada.",
    excerpt:
      "O que o face pull trabalha, como montar a polia e a corda, o movimento passo a passo, os erros mais comuns e como fazer com elástico em casa.",
    category: "Treino",
    date: "2026-11-06",
    readTime: "6 min",
    author: "Montinho",
    tags: ["face pull", "ombro", "deltoide posterior", "polia", "exercícios"],
    faq: [
      {
        question: "O que o face pull trabalha?",
        answer:
          "Principalmente o deltoide posterior, a parte de trás do ombro, junto com o trapézio do meio das costas. No fim do movimento, quando as mãos vão para os lados do rosto, os músculos que giram o braço para fora também trabalham.",
      },
      {
        question: "Como fazer o face pull na polia?",
        answer:
          "Polia na altura do rosto ou um pouco acima, com a corda. Segure as pontas, dê um passo para trás e puxe a corda em direção ao rosto, abrindo as pontas e levando os cotovelos para fora e para trás, na altura dos ombros. Volte devagar.",
      },
      {
        question: "Face pull é para ombro ou para costas?",
        answer:
          "Para os dois, com o ombro em primeiro lugar. O alvo é a parte de trás do ombro; o trapézio do meio das costas ajuda. É um exercício que equilibra o treino de quem faz muito supino e desenvolvimento.",
      },
      {
        question: "Quantas séries e repetições fazer no face pull?",
        answer:
          "Para a maioria das pessoas, de 2 a 4 séries de 12 a 20 repetições. É um exercício de controle: carga que você consegue puxar sem jogar o tronco para trás, parando a 1 ou 2 repetições da falha.",
      },
      {
        question: "Face pull ou crucifixo inverso?",
        answer:
          "Os dois treinam a parte de trás do ombro. O crucifixo inverso isola mais o deltoide posterior; o face pull envolve mais o trapézio e a rotação do ombro. Um dos dois num treino já basta, e alternar ao longo das semanas também funciona.",
      },
      {
        question: "Dá para fazer face pull em casa?",
        answer:
          "Dá, com um elástico preso na altura do rosto, numa porta ou num poste. O movimento é o mesmo: puxar em direção ao rosto com os cotovelos altos.",
      },
    ],
    content: `<img src="/blog-images/face-pull-capa.webp" alt="Capa: Face pull. Como fazer na polia. Ilustração de pessoa puxando a corda da polia alta em direção ao rosto" title="Face Pull — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>face pull</strong> é puxar a corda da polia em direção ao rosto, com os cotovelos altos. Parece uma remada, mas o objetivo é outro: a parte de trás do ombro e o trapézio do meio das costas. É o exercício que equilibra o treino de quem empurra muito, no supino e no desenvolvimento, e puxa pouco para trás.</p>

<h2>O que o face pull trabalha?</h2>
<p>O músculo principal é o <strong>deltoide posterior</strong>, a parte de trás do ombro. O <strong>trapézio</strong> do meio das costas ajuda a segurar e aproximar as escápulas. No fim do movimento, quando as mãos chegam ao lado do rosto, os músculos que giram o braço para fora também entram.</p>
<p>A dúvida que costuma vir junto é: face pull ou crucifixo inverso? Os dois treinam a parte de trás do ombro, de jeitos diferentes. O comparador abaixo mostra o que muda.</p>

<h2>Como montar a polia</h2>
<ul>
<li><strong>Altura:</strong> polia na altura do rosto ou um pouco acima. Polia baixa demais transforma o exercício numa remada.</li>
<li><strong>Pegador:</strong> a corda, a mesma do tríceps. Ela deixa as mãos se afastarem no fim do movimento.</li>
<li><strong>Pegada:</strong> segure as pontas da corda com os polegares para trás, virados para você, ou com as palmas para baixo. As duas funcionam; escolha a que deixa o ombro confortável.</li>
</ul>

<h2>Como fazer o face pull, passo a passo</h2>
<ol>
<li><strong>Posição.</strong> De frente para a polia, dê um ou dois passos para trás até a corda ficar esticada com os braços estendidos. Pés na largura do quadril ou um à frente do outro.</li>
<li><strong>Puxada.</strong> Puxe a corda em direção ao rosto, abrindo as pontas para os lados. Os cotovelos vão para fora e para trás, na altura dos ombros ou um pouco acima.</li>
<li><strong>Fim do movimento.</strong> As mãos terminam ao lado das orelhas, como quem mostra os bíceps. Segure um instante.</li>
<li><strong>Volta.</strong> Estenda os braços devagar, sem deixar a polia puxar você para a frente.</li>
</ol>

<h2>Os erros mais comuns</h2>
<ul>
<li><strong>Carga alta demais.</strong> O corpo compensa inclinando o tronco para trás. Se você precisa deitar para puxar, a carga está alta.</li>
<li><strong>Cotovelos baixos.</strong> Com os cotovelos colados ao corpo, vira remada baixa. Eles ficam na altura dos ombros.</li>
<li><strong>Encolher os ombros.</strong> Aí trabalha o trapézio de cima. Mantenha os ombros longe das orelhas.</li>
<li><strong>Puxar até o queixo e parar.</strong> O fim do movimento, com as mãos abrindo para os lados do rosto, é a parte que mais diferencia o face pull de uma remada.</li>
</ul>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>2 a 4 séries de 12 a 20 repetições</strong>, parando a 1 ou 2 repetições da falha. É um exercício de controle, e funciona melhor com repetições mais altas e carga que não tira a postura. Mais sobre o assunto em <a href="/blog/quantas-repeticoes-para-hipertrofia">quantas repetições para hipertrofia</a>.</p>
<p>Ele encaixa no fim do treino de ombro ou de costas, ou como aquecimento leve antes de supino e desenvolvimento.</p>

<h2>Face pull em casa</h2>
<p>Com um elástico preso na altura do rosto, numa porta, numa grade ou num poste, o movimento é igual: puxar em direção ao rosto com os cotovelos altos. O elástico pesa mais no fim, que é justamente onde o exercício trabalha mais.</p>

<h2>Não se compare</h2>
<p>O face pull é um daqueles exercícios em que a carga do vizinho não diz nada. Tem gente que faz com a pilha quase inteira e puxa com o corpo todo. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é fazer a mesma postura, com um pouco mais de carga ou uma repetição a mais que na semana passada.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/crucifixo-inverso">Crucifixo inverso: como fazer</a></li>
<li><a href="/blog/treino-de-ombros-hipertrofia">Treino de ombros para hipertrofia</a></li>
<li><a href="/blog/remada-alta">Remada alta: como fazer sem machucar o ombro</a></li>
<li><a href="/blog/dor-no-ombro-ao-treinar">Dor no ombro ao treinar</a></li>
</ul>`,
  },
  {
    slug: "triceps-corda",
    title: "Tríceps Corda: Como Fazer na Polia e Erros Comuns",
    metaTitle: "Tríceps Corda: Como Fazer na Polia e Erros Comuns",
    metaDescription:
      "Tríceps corda é o tríceps pulley feito com a corda: cotovelo parado ao lado do corpo e as pontas abrindo no fim. Veja o passo a passo, corda ou barra e os erros que roubam o tríceps.",
    excerpt:
      "Como fazer o tríceps corda (tríceps pulley com corda), o que ele trabalha, a diferença para a barra, os erros mais comuns e quantas séries fazer.",
    category: "Treino",
    date: "2026-11-06",
    readTime: "5 min",
    author: "Montinho",
    tags: ["tríceps corda", "tríceps pulley", "tríceps", "polia", "exercícios"],
    faq: [
      {
        question: "Como fazer o tríceps corda?",
        answer:
          "Na polia alta, com a corda. Cotovelos colados ao lado do corpo e parados. Estenda os braços para baixo até o fim, abrindo as pontas da corda para os lados, e volte devagar até o antebraço passar um pouco da linha do chão.",
      },
      {
        question: "Tríceps corda trabalha qual parte do tríceps?",
        answer:
          "O tríceps inteiro, as três cabeças. Com o braço ao lado do corpo, a cabeça lateral e a medial tendem a aparecer mais; para enfatizar a cabeça longa, os exercícios com o braço acima da cabeça, como o tríceps francês, complementam bem.",
      },
      {
        question: "Tríceps corda ou barra: qual é melhor?",
        answer:
          "Os dois funcionam. A barra costuma permitir mais carga; a corda deixa as mãos se afastarem no fim e costuma ser mais confortável para o punho e o cotovelo. Muita gente alterna entre os dois.",
      },
      {
        question: "Quantas séries e repetições fazer no tríceps corda?",
        answer:
          "Para a maioria das pessoas, de 3 a 4 séries de 10 a 15 repetições, parando a 1 ou 2 repetições da falha, com o cotovelo parado do começo ao fim.",
      },
      {
        question: "Por que sinto o tríceps corda no ombro?",
        answer:
          "Normalmente porque o cotovelo está saindo do lugar e o ombro está ajudando a empurrar. Abaixe a carga, cole os cotovelos ao lado do corpo e mantenha o tronco quase reto.",
      },
      {
        question: "Dá para fazer tríceps corda em casa?",
        answer:
          "Dá uma versão com elástico preso no alto de uma porta. O movimento é o mesmo: cotovelo parado ao lado do corpo e estender o braço para baixo.",
      },
    ],
    content: `<img src="/blog-images/triceps-corda-capa.webp" alt="Capa: Tríceps corda. Como fazer e erros comuns. Ilustração de pessoa empurrando a corda da polia para baixo" title="Tríceps Corda — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>tríceps corda</strong> é o tríceps pulley feito com a corda no lugar da barra. É um dos exercícios mais feitos da academia e um dos mais roubados: o cotovelo sai do lugar, o tronco ajuda, e o tríceps faz metade do trabalho. O que define o exercício é um detalhe só: o cotovelo parado.</p>

<h2>O que o tríceps corda trabalha?</h2>
<p>O <strong>tríceps</strong>, o músculo de trás do braço, que estica o cotovelo. Ele tem três partes, e o tríceps corda trabalha as três. Com o braço ao lado do corpo, a parte lateral e a medial tendem a aparecer mais. Para a cabeça longa, os exercícios com o braço acima da cabeça, como o <a href="/blog/como-fazer-french-press">tríceps francês</a>, complementam.</p>
<p>A dúvida que costuma vir junto é: tríceps corda ou tríceps testa? O comparador abaixo mostra o que muda entre eles.</p>

<h2>Como fazer o tríceps corda, passo a passo</h2>
<ol>
<li><strong>Posição.</strong> Polia no alto, com a corda. Segure as pontas com as palmas viradas uma para a outra. Fique de pé, perto da polia, com o tronco quase reto e os joelhos levemente dobrados.</li>
<li><strong>Cotovelos.</strong> Cole os cotovelos ao lado do corpo. Eles ficam parados o exercício inteiro.</li>
<li><strong>Descida.</strong> Estenda os braços para baixo até o fim. Nos últimos centímetros, abra as pontas da corda para os lados.</li>
<li><strong>Volta.</strong> Suba devagar, até o antebraço passar um pouco da linha do chão, sem deixar o cotovelo subir junto.</li>
</ol>

<h2>Os erros mais comuns</h2>
<ul>
<li><strong>Cotovelo saindo do lugar.</strong> Se o cotovelo vai para a frente na subida, o ombro entra no movimento. É o erro número um.</li>
<li><strong>Inclinar o tronco e usar o peso do corpo.</strong> Um pouco de inclinação é normal; deitar sobre a corda para empurrar não é.</li>
<li><strong>Encurtar o movimento.</strong> Com carga alta, a extensão não chega ao fim. Os últimos centímetros são do tríceps.</li>
<li><strong>Dobrar o punho.</strong> O punho fica firme, alinhado com o antebraço.</li>
</ul>

<h2>Tríceps corda ou barra?</h2>
<p>Os dois funcionam e trabalham o mesmo músculo. A <strong>barra</strong> costuma permitir mais carga. A <strong>corda</strong> deixa as mãos se afastarem no fim do movimento e costuma ser mais confortável para punho e cotovelo. Se um deles incomoda, use o outro; se os dois vão bem, alternar ao longo das semanas é uma boa ideia.</p>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>3 a 4 séries de 10 a 15 repetições</strong>, parando a 1 ou 2 repetições da falha. O tríceps já trabalha no supino, no desenvolvimento e na flexão, então o volume total da semana conta. Veja <a href="/blog/quantas-series-para-hipertrofia">quantas séries para hipertrofia</a>.</p>

<h2>Tríceps corda em casa</h2>
<p>Com um elástico preso no alto de uma porta, dá para fazer a mesma extensão: cotovelo parado ao lado do corpo e braço esticando para baixo. Segure o elástico com as duas mãos, como seguraria a corda.</p>

<h2>Não se compare</h2>
<p>Tem gente que faz tríceps corda com a pilha inteira, inclinado sobre a polia, e gente que usa metade da carga com o cotovelo parado. O segundo treina mais tríceps. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é a execução: carga que deixa o cotovelo parado do começo ao fim.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/como-fazer-french-press">Como fazer tríceps francês</a></li>
<li><a href="/blog/como-fazer-skull-crusher-triceps-testa">Como fazer tríceps testa</a></li>
<li><a href="/blog/treino-de-triceps">Treino de tríceps</a></li>
<li><a href="/blog/quantas-repeticoes-para-hipertrofia">Quantas repetições para hipertrofia</a></li>
</ul>`,
  },
  {
    slug: "remada-alta",
    title: "Remada Alta: Como Fazer Sem Machucar o Ombro",
    metaTitle: "Remada Alta: Como Fazer com Barra, Halteres e Polia",
    metaDescription:
      "Remada alta trabalha o trapézio e a lateral do ombro. Veja a pegada, até onde subir com barra, halteres ou polia, e o ajuste para quem sente o ombro no exercício.",
    excerpt:
      "O que a remada alta trabalha, como fazer com barra, halteres e na polia, até onde subir, os erros comuns e o que fazer se o ombro incomoda.",
    category: "Treino",
    date: "2026-11-06",
    readTime: "6 min",
    author: "Montinho",
    tags: ["remada alta", "ombro", "trapézio", "exercícios", "musculação"],
    faq: [
      {
        question: "O que a remada alta trabalha?",
        answer:
          "Principalmente o trapézio e a parte lateral do ombro, o deltoide lateral. O bíceps ajuda a dobrar o cotovelo, mas não é o alvo.",
      },
      {
        question: "Como fazer a remada alta?",
        answer:
          "De pé, com a barra na frente das coxas. Puxe a barra para cima, perto do corpo, levando os cotovelos para os lados e para cima até a altura dos ombros. Os cotovelos ficam sempre acima dos punhos. Desça devagar.",
      },
      {
        question: "A remada alta faz mal para o ombro?",
        answer:
          "Para muita gente, não. Mas é um exercício que incomoda o ombro de algumas pessoas, principalmente com a pegada bem fechada e subindo acima da linha do ombro. Pegada mais aberta e subir só até a altura do ombro costumam resolver; se ainda doer, troque pela elevação lateral.",
      },
      {
        question: "Remada alta é para ombro ou para trapézio?",
        answer:
          "Para os dois. Com a pegada mais aberta, o ombro lateral trabalha mais; com a pegada mais fechada e subindo mais, o trapézio aparece mais.",
      },
      {
        question: "Remada alta com barra, halteres ou polia?",
        answer:
          "As três funcionam. Os halteres e a polia com corda deixam cada braço achar o caminho mais confortável, o que ajuda quem sente o ombro. A barra permite mais carga.",
      },
      {
        question: "Quantas séries e repetições fazer na remada alta?",
        answer:
          "Para a maioria das pessoas, de 3 a 4 séries de 10 a 15 repetições, com carga que você controla na descida e sem jogar o corpo para trás.",
      },
    ],
    content: `<img src="/blog-images/remada-alta-capa.webp" alt="Capa: Remada alta. Como fazer sem machucar o ombro. Ilustração de pessoa puxando a barra até o peito com os cotovelos altos" title="Remada Alta — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>A <strong>remada alta</strong> é puxar a barra, os halteres ou a polia de baixo para cima, perto do corpo, com os cotovelos subindo para os lados. É um exercício de ombro e trapézio que divide opinião: muita gente faz sem problema, e algumas pessoas sentem o ombro. A diferença quase sempre está na pegada e em até onde a barra sobe.</p>

<h2>O que a remada alta trabalha?</h2>
<p>Principalmente o <strong>trapézio</strong> e a parte lateral do ombro, o <strong>deltoide lateral</strong>. O bíceps ajuda a dobrar o cotovelo, mas não é o alvo. Com a pegada mais aberta, o ombro lateral trabalha mais; com a pegada mais fechada e subindo mais, o trapézio aparece mais.</p>
<p>A dúvida que costuma vir junto é: remada alta ou elevação lateral? As duas trabalham a lateral do ombro. O comparador abaixo mostra o que muda.</p>

<h2>Como fazer a remada alta com barra</h2>
<ol>
<li><strong>Posição.</strong> De pé, pés na largura do quadril, barra na frente das coxas com as palmas viradas para você.</li>
<li><strong>Pegada.</strong> Mãos um pouco mais abertas que a largura dos ombros. Pegada muito fechada é o que mais costuma incomodar o ombro.</li>
<li><strong>Subida.</strong> Puxe a barra para cima, perto do corpo, levando os cotovelos para os lados e para cima. Os cotovelos ficam sempre acima dos punhos.</li>
<li><strong>Até onde.</strong> Até os cotovelos chegarem à altura dos ombros. Subir mais que isso não adiciona muito e é onde o ombro reclama.</li>
<li><strong>Descida.</strong> Desça devagar, sem soltar o peso.</li>
</ol>

<h2>Com halteres e na polia</h2>
<ul>
<li><strong>Com halteres:</strong> o mesmo movimento, com um halter em cada mão. Como cada braço é livre, dá para achar o caminho mais confortável para o ombro.</li>
<li><strong>Na polia:</strong> polia baixa, com a barra reta ou a corda. A polia mantém a tensão no começo do movimento. Com a corda, as mãos podem se afastar no alto, o que costuma ser mais confortável.</li>
</ul>

<h2>A remada alta faz mal para o ombro?</h2>
<p>Para muita gente, não. Mas é um exercício que incomoda o ombro de algumas pessoas, principalmente com a <strong>pegada bem fechada</strong> e <strong>subindo acima da linha do ombro</strong>. Os ajustes que costumam resolver:</p>
<ul>
<li>abrir um pouco mais a pegada;</li>
<li>subir só até os cotovelos ficarem na altura dos ombros;</li>
<li>usar halteres ou a corda na polia no lugar da barra.</li>
</ul>
<p>Se ainda doer, troque pela elevação lateral, que trabalha a lateral do ombro com menos rotação. Dor que continua fora do treino é para avaliação: veja <a href="/blog/dor-no-ombro-ao-treinar">dor no ombro ao treinar</a>.</p>

<h2>Os erros mais comuns</h2>
<ul>
<li><strong>Carga alta e corpo balançando.</strong> Se o tronco vai para trás para a barra subir, a carga está alta.</li>
<li><strong>Barra longe do corpo.</strong> Ela sobe rente às coxas e à barriga.</li>
<li><strong>Punho acima do cotovelo.</strong> Quem lidera o movimento é o cotovelo. Se o punho sobe primeiro, vira uma rosca.</li>
<li><strong>Subir até o queixo.</strong> Os cotovelos param na altura dos ombros.</li>
</ul>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>3 a 4 séries de 10 a 15 repetições</strong>, parando a 1 ou 2 repetições da falha e com a descida controlada. Ela encaixa no treino de ombro, depois do desenvolvimento.</p>

<h2>Não se compare</h2>
<p>Tem gente que faz remada alta pesada a vida toda sem sentir nada e gente que sente o ombro na primeira série. Os dois estão certos para o próprio ombro. Cada um tem a própria genética, rotina e história, com altos e baixos. O que vale é achar a versão que o seu ombro aceita e progredir nela.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/como-fazer-elevacao-lateral">Como fazer elevação lateral</a></li>
<li><a href="/blog/face-pull">Face pull: como fazer na polia</a></li>
<li><a href="/blog/como-fazer-encolhimento-trapezio">Encolhimento para trapézio</a></li>
<li><a href="/blog/treino-de-ombros-hipertrofia">Treino de ombros para hipertrofia</a></li>
</ul>`,
  },
];
