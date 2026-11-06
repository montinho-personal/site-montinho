import type { BlogPost } from "./blog";

/**
 * Face pull, tríceps corda e remada alta (06/11/2026). Exercícios com muita
 * busca e sem página no site, pelo Planejador de Palavras-chave do Google Ads
 * (Brasil): "face pull" 135.000/mês, "triceps corda" 135.000 (+ "triceps
 * pulley corda" 9.900, "tríceps na corda" 6.600), "remada alta" 90.500
 * (+ "remada alta polia" 27.100, "com barra" 18.100, "com halteres" 6.600).
 * Publicados a pedido do Montinho ANTES dos prints; título, H2 e FAQ serão
 * revistos com a pesquisa. Face pull revisto em 06/11 com o export do Answer
 * the Public e os prints (para que serve, músculos, elástico, halteres, sem
 * corda, substituto, outro nome); tríceps corda também (para que serve,
 * qual cabeça, altura da polia, francês, testa, unilateral, cross, corda ou
 * barra, substituto) e remada alta (para que serve, músculos, pegada
 * aberta ou fechada, polia com corda, cross, smith, anilha, kettlebell,
 * elástico, remada alta articulada, substituto). Músculos do manguito: infraespinhal e
 * redondo menor, os rotadores externos do ombro.
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
      "Para que serve o face pull, quais músculos trabalha, como fazer na polia com corda, com elástico, com halteres ou sem corda, os erros mais comuns e o que pode substituir.",
    category: "Treino",
    date: "2026-11-06",
    readTime: "8 min",
    author: "Montinho",
    tags: ["face pull", "ombro", "deltoide posterior", "polia", "exercícios"],
    faq: [
      {
        question: "Para que serve o face pull?",
        answer:
          "Para treinar a parte de trás do ombro e o meio das costas, que quase não trabalham nos exercícios de empurrar. É um exercício que equilibra o treino de quem faz muito supino, flexão e desenvolvimento.",
      },
      {
        question: "Face pull trabalha qual músculo?",
        answer:
          "O principal é o deltoide posterior, a parte de trás do ombro. Ajudam o trapézio do meio das costas, os romboides e os músculos do manguito rotador que giram o braço para fora (infraespinhal e redondo menor). O bíceps participa porque o cotovelo dobra.",
      },
      {
        question: "Face pull é para ombro ou para costas?",
        answer:
          "Para os dois, com o ombro em primeiro lugar. O alvo é a parte de trás do ombro; o trapézio e os romboides, no meio das costas, ajudam. Ele não alarga as costas: quem faz isso é o latíssimo, treinado na puxada e na barra fixa.",
      },
      {
        question: "Como fazer o face pull na polia com corda?",
        answer:
          "Polia na altura do rosto ou um pouco acima, com a corda. Segure as pontas, dê um passo para trás e puxe a corda em direção ao rosto, abrindo as pontas e levando os cotovelos para fora e para trás, na altura dos ombros. Volte devagar.",
      },
      {
        question: "Como fazer face pull com elástico em casa?",
        answer:
          "Prenda o elástico na altura do rosto, numa porta, grade ou poste. Segure uma ponta em cada mão, dê um passo para trás até esticar e puxe em direção ao rosto com os cotovelos altos, abrindo as mãos para os lados no fim.",
      },
      {
        question: "Dá para fazer face pull com halteres?",
        answer:
          "Não exatamente, porque o halter puxa para baixo e não para a frente. O mais parecido é deitar de bruços num banco inclinado e puxar os halteres com os cotovelos bem abertos, girando as mãos para cima no fim.",
      },
      {
        question: "Dá para fazer face pull sem corda?",
        answer:
          "Dá, com duas alças de pegada, uma em cada mão, ou com duas cordas no mesmo gancho. Com a barra reta também dá, mas as mãos não conseguem se afastar no fim, e é esse final que mais diferencia o face pull de uma remada.",
      },
      {
        question: "O que pode substituir o face pull?",
        answer:
          "O crucifixo inverso, com halteres, na máquina (voador invertido) ou na polia, é o substituto mais próximo para a parte de trás do ombro. Em casa, o face pull com elástico. Com halteres, a puxada deitada de bruços num banco inclinado.",
      },
      {
        question: "Face pull ou crucifixo inverso (voador invertido)?",
        answer:
          "Os dois trabalham o mesmo músculo principal, o deltoide posterior. O crucifixo inverso isola mais o ombro; o face pull envolve mais o trapézio e a rotação do braço para fora. Um dos dois num treino já basta, e alternar ao longo das semanas também funciona.",
      },
      {
        question: "Quantas séries e repetições fazer no face pull?",
        answer:
          "Para a maioria das pessoas, de 2 a 4 séries de 12 a 20 repetições (3 de 15 é um bom ponto de partida). É um exercício de controle: carga que você puxa sem jogar o tronco para trás, parando a 1 ou 2 repetições da falha.",
      },
      {
        question: "Face pull tem outro nome?",
        answer:
          "Em português, a tradução é \"puxada para o rosto\", e algumas academias usam esse nome. Mas o nome em inglês, face pull, é o mais usado nas fichas de treino.",
      },
      {
        question: "Face pull é diferente para mulher?",
        answer:
          "Não. O exercício, a execução e a faixa de repetições são os mesmos. O que muda de pessoa para pessoa é a carga, e isso vale para qualquer um.",
      },
    ],
    content: `<img src="/blog-images/face-pull-capa.webp" alt="Capa: Face pull. Como fazer na polia. Ilustração de pessoa puxando a corda da polia alta em direção ao rosto" title="Face Pull — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>face pull</strong> é puxar a corda da polia em direção ao rosto, com os cotovelos altos. Parece uma remada, mas o objetivo é outro: a parte de trás do ombro e o meio das costas. É o exercício que equilibra o treino de quem empurra muito, no supino e no desenvolvimento, e puxa pouco para trás.</p>

<h2>Para que serve o face pull e qual músculo ele trabalha?</h2>
<p>O músculo principal é o <strong>deltoide posterior</strong>, a parte de trás do ombro. Ajudam:</p>
<ul>
<li>o <strong>trapézio</strong> do meio das costas e os <strong>romboides</strong>, que seguram e aproximam as escápulas;</li>
<li>os músculos do <strong>manguito rotador</strong> que giram o braço para fora (infraespinhal e redondo menor), no fim do movimento, quando as mãos chegam ao lado do rosto;</li>
<li>o <strong>bíceps</strong>, porque o cotovelo dobra.</li>
</ul>
<p><strong>É para ombro ou para costas?</strong> Para os dois, com o ombro em primeiro lugar. Ele não alarga as costas: quem dá largura é o latíssimo, treinado na <a href="/blog/como-fazer-pulldown-puxada-frontal">puxada</a> e na barra fixa.</p>
<p><strong>Ajuda na postura?</strong> Ele fortalece os músculos que levam os ombros para trás, e por isso aparece muito nessa conversa. Mas postura depende de muita coisa além de um exercício, e o face pull sozinho não "corrige" nada.</p>
<p>A dúvida que costuma vir junto é: face pull ou crucifixo inverso? Os dois treinam a parte de trás do ombro, de jeitos diferentes. O comparador abaixo mostra o que muda.</p>

<h2>Como montar a polia</h2>
<ul>
<li><strong>Altura:</strong> polia na altura do rosto ou um pouco acima. Polia baixa demais transforma o exercício numa remada. No cross, use uma das torres com o cabo no alto; é o mesmo exercício.</li>
<li><strong>Pegador:</strong> a corda, a mesma do tríceps. Ela deixa as mãos se afastarem no fim do movimento.</li>
<li><strong>Pegada:</strong> segure as pontas da corda com os polegares para trás, virados para você, ou com as palmas para baixo. As duas funcionam; escolha a que deixa o ombro confortável.</li>
</ul>

<h2>Como fazer o face pull na polia com corda, passo a passo</h2>
<ol>
<li><strong>Posição.</strong> De frente para a polia, dê um ou dois passos para trás até a corda ficar esticada com os braços estendidos. Pés na largura do quadril ou um à frente do outro.</li>
<li><strong>Puxada.</strong> Puxe a corda em direção ao rosto, abrindo as pontas para os lados. Os cotovelos vão para fora e para trás, na altura dos ombros ou um pouco acima.</li>
<li><strong>Fim do movimento.</strong> As mãos terminam ao lado das orelhas, como quem mostra os bíceps. Segure um instante.</li>
<li><strong>Volta.</strong> Estenda os braços devagar, sem deixar a polia puxar você para a frente.</li>
</ol>
<p><strong>Sentado ou ajoelhado:</strong> dá para fazer sentado num banco ou ajoelhado de frente para a polia. Com o tronco parado, fica mais difícil roubar com o corpo. Ajuste a polia para continuar na altura do rosto.</p>

<h2>Os erros mais comuns</h2>
<ul>
<li><strong>Carga alta demais.</strong> O corpo compensa inclinando o tronco para trás. Se você precisa deitar para puxar, a carga está alta.</li>
<li><strong>Cotovelos baixos.</strong> Com os cotovelos colados ao corpo, vira remada baixa. Eles ficam na altura dos ombros.</li>
<li><strong>Encolher os ombros.</strong> Aí trabalha o trapézio de cima. Mantenha os ombros longe das orelhas.</li>
<li><strong>Puxar até o queixo e parar.</strong> O fim do movimento, com as mãos abrindo para os lados do rosto, é a parte que mais diferencia o face pull de uma remada.</li>
</ul>

<h2>Face pull com elástico (em casa)</h2>
<p>Prenda o elástico na altura do rosto, numa porta, numa grade ou num poste. Segure uma ponta em cada mão, dê um passo para trás até esticar e faça o mesmo movimento: puxar em direção ao rosto com os cotovelos altos, abrindo as mãos no fim. O elástico pesa mais no fim, que é justamente onde o exercício trabalha mais.</p>

<h2>Face pull com halteres, com barra ou sem corda</h2>
<ul>
<li><strong>Com halteres:</strong> não dá para fazer igual, porque o halter puxa para baixo, não para a frente. O mais parecido é deitar de bruços num banco inclinado e puxar os halteres com os cotovelos bem abertos, girando as mãos para cima no fim.</li>
<li><strong>Com barra:</strong> na polia, com a barra reta, dá. Mas as mãos ficam presas na mesma largura e não abrem no fim. Funciona, só que fica mais perto de uma remada para o rosto.</li>
<li><strong>Sem corda:</strong> duas alças de pegada, uma em cada mão, ou duas cordas no mesmo gancho, que dão ainda mais espaço para as mãos se afastarem.</li>
</ul>

<h2>O que pode substituir o face pull?</h2>
<ul>
<li><strong><a href="/blog/crucifixo-inverso">Crucifixo inverso</a></strong>, com halteres, na polia ou na máquina, que muitas academias chamam de <strong>voador invertido</strong>. É o substituto mais próximo: trabalha o mesmo músculo principal, de um jeito mais isolado.</li>
<li><strong>Face pull com elástico</strong>, quando não há polia.</li>
<li><strong>Puxada com halteres deitado de bruços</strong>, como descrito acima.</li>
</ul>
<p>E a <strong>remada alta com corda</strong>? É outro exercício: puxa de baixo para cima, até o peito, e trabalha mais a lateral do ombro e o trapézio. Veja a <a href="/blog/remada-alta">remada alta</a>.</p>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>2 a 4 séries de 12 a 20 repetições</strong>, parando a 1 ou 2 repetições da falha. Três séries de 15 é um bom ponto de partida. É um exercício de controle, e funciona melhor com repetições mais altas e carga que não tira a postura. Mais sobre o assunto em <a href="/blog/quantas-repeticoes-para-hipertrofia">quantas repetições para hipertrofia</a>.</p>
<p>Ele encaixa no fim do treino de ombro ou de costas, ou como aquecimento leve antes de supino e desenvolvimento. Não há versão "feminina": o exercício é o mesmo para todo mundo, e o que muda é a carga.</p>

<h2>Face pull tem outro nome?</h2>
<p>Em português, a tradução é "puxada para o rosto", e algumas academias usam esse nome. Mas o nome em inglês é o mais usado nas fichas de treino, e é por ele que você vai achar o exercício.</p>

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
      "Como fazer o tríceps corda na polia alta, para que serve, qual cabeça trabalha, as variações (francês, testa, unilateral, no cross), corda ou barra, os erros e o que substitui.",
    category: "Treino",
    date: "2026-11-06",
    readTime: "8 min",
    author: "Montinho",
    tags: ["tríceps corda", "tríceps pulley", "tríceps", "polia", "exercícios"],
    faq: [
      {
        question: "Como fazer o tríceps corda?",
        answer:
          "Na polia alta, com a corda. Tronco levemente inclinado à frente, cotovelos colados ao lado do corpo e parados. Estenda os braços para baixo até o fim, abrindo as pontas da corda para os lados, e volte devagar até o antebraço ficar perto de 90 graus com o braço.",
      },
      {
        question: "Para que serve o tríceps corda?",
        answer:
          "Para treinar o tríceps, o músculo de trás do braço, que estica o cotovelo e ocupa a maior parte do braço. Como o resto do corpo fica parado, é um jeito simples de dar volume ao tríceps depois dos exercícios de empurrar.",
      },
      {
        question: "Tríceps corda trabalha qual cabeça do tríceps?",
        answer:
          "As três: lateral, medial e longa. Com o braço ao lado do corpo, a lateral e a medial tendem a aparecer mais. Para enfatizar a cabeça longa, as versões com o braço acima da cabeça, como o tríceps francês na polia, complementam bem.",
      },
      {
        question: "Qual a altura da polia no tríceps corda?",
        answer:
          "No tríceps corda tradicional, a polia fica no alto, acima da cabeça. Na polia baixa, a corda serve para o tríceps francês, de costas para a máquina e com os braços acima da cabeça.",
      },
      {
        question: "Tríceps corda ou barra: qual é melhor?",
        answer:
          "Os dois funcionam e trabalham o mesmo músculo. A barra reta, V ou W costuma permitir mais carga; a corda deixa as mãos se afastarem no fim e costuma ser mais confortável para o punho e o cotovelo. Muita gente alterna entre os dois.",
      },
      {
        question: "Como fazer o tríceps corda francês?",
        answer:
          "De costas para a polia, com a corda presa embaixo ou no meio. Leve a corda para trás da cabeça com os cotovelos apontando para cima e estenda os braços para cima e para a frente, sem abrir os cotovelos.",
      },
      {
        question: "O que é o tríceps corda testa?",
        answer:
          "É a versão do tríceps testa feita na polia com a corda: deitado num banco com a cabeça virada para a polia, ou em pé inclinado de costas para ela. Os cotovelos ficam parados apontando para cima e só o antebraço se move.",
      },
      {
        question: "Dá para fazer o tríceps corda unilateral?",
        answer:
          "Dá, segurando uma ponta da corda, ou uma alça, com uma mão só. Ajuda a corrigir diferença entre os braços e a sentir melhor o cotovelo parado.",
      },
      {
        question: "O que pode substituir o tríceps corda?",
        answer:
          "Na polia, o tríceps com barra reta, V ou W. Sem polia, o tríceps testa ou o francês com halter, o mergulho no banco ou nas paralelas e, em casa, a extensão com elástico preso no alto de uma porta.",
      },
      {
        question: "Quantas séries e repetições fazer no tríceps corda?",
        answer:
          "Para a maioria das pessoas, de 3 a 4 séries de 10 a 15 repetições, parando a 1 ou 2 repetições da falha, com o cotovelo parado do começo ao fim.",
      },
      {
        question: "Por que sinto o tríceps corda no ombro?",
        answer:
          "Normalmente porque o cotovelo está saindo do lugar e o ombro está ajudando a empurrar. Abaixe a carga, cole os cotovelos ao lado do corpo e mantenha o tronco firme.",
      },
      {
        question: "Tríceps corda é diferente para mulher?",
        answer:
          "Não. O exercício, a execução e a faixa de repetições são os mesmos. O que muda de pessoa para pessoa é a carga.",
      },
    ],
    content: `<img src="/blog-images/triceps-corda-capa.webp" alt="Capa: Tríceps corda. Como fazer e erros comuns. Ilustração de pessoa empurrando a corda da polia para baixo" title="Tríceps Corda — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>tríceps corda</strong> é o tríceps pulley feito com a corda no lugar da barra. É um dos exercícios mais feitos da academia e um dos mais roubados: o cotovelo sai do lugar, o tronco ajuda, e o tríceps faz metade do trabalho. O que define o exercício é um detalhe só: o cotovelo parado.</p>

<h2>Para que serve o tríceps corda e qual músculo trabalha?</h2>
<p>Serve para treinar o <strong>tríceps</strong>, o músculo de trás do braço, que estica o cotovelo. Ele tem três cabeças, a lateral, a medial e a longa, e o tríceps corda trabalha as três. Com o braço ao lado do corpo, a lateral e a medial tendem a aparecer mais. Para a cabeça longa, as versões com o braço acima da cabeça, como o tríceps francês, complementam. O abdômen e o antebraço trabalham só para manter o corpo firme e segurar a corda.</p>
<p>A dúvida que costuma vir junto é: tríceps corda ou tríceps testa? O comparador abaixo mostra o que muda entre eles.</p>

<h2>Como fazer o tríceps corda na polia alta, passo a passo</h2>
<ol>
<li><strong>Polia.</strong> Ajuste a polia na posição mais alta e prenda a corda.</li>
<li><strong>Posição.</strong> Segure as pontas com as palmas viradas uma para a outra. Fique de pé, perto da polia, com os pés afastados ou um à frente do outro, joelhos levemente dobrados e o tronco levemente inclinado à frente. Abdômen firme.</li>
<li><strong>Cotovelos.</strong> Cole os cotovelos ao lado do corpo. Eles ficam parados o exercício inteiro.</li>
<li><strong>Descida.</strong> Estenda os braços para baixo até o fim. Nos últimos centímetros, abra as pontas da corda para os lados.</li>
<li><strong>Volta.</strong> Suba devagar, até o antebraço ficar perto de 90 graus com o braço, sem deixar o cotovelo subir junto.</li>
</ol>
<p>No <strong>cross over</strong>, o exercício é o mesmo: use uma das torres com a polia no alto.</p>

<h2>Os erros mais comuns</h2>
<ul>
<li><strong>Cotovelo saindo do lugar.</strong> Se o cotovelo vai para a frente na subida, o ombro entra no movimento. É o erro número um.</li>
<li><strong>Inclinar demais e usar o peso do corpo.</strong> Um pouco de inclinação é normal; deitar sobre a corda para empurrar não é.</li>
<li><strong>Encurtar o movimento.</strong> Com carga alta, a extensão não chega ao fim. Os últimos centímetros são do tríceps.</li>
<li><strong>Dobrar o punho.</strong> O punho fica firme, alinhado com o antebraço.</li>
</ul>

<h2>Variações do tríceps corda</h2>
<ul>
<li><strong>Tríceps corda francês (acima da cabeça):</strong> de costas para a polia, com a corda presa embaixo ou no meio. Leve a corda para trás da cabeça, cotovelos apontando para cima, e estenda os braços para cima e para a frente. É a versão que mais alonga a cabeça longa. Veja o <a href="/blog/como-fazer-french-press">tríceps francês</a>.</li>
<li><strong>Tríceps corda testa:</strong> o <a href="/blog/como-fazer-skull-crusher-triceps-testa">tríceps testa</a> feito na polia, deitado num banco com a cabeça virada para a polia, ou em pé inclinado de costas para ela. Os cotovelos ficam parados e só o antebraço se move.</li>
<li><strong>Unilateral:</strong> uma ponta da corda, ou uma alça, em uma mão só. Ajuda a corrigir diferença entre os braços.</li>
<li><strong>Pegada invertida:</strong> com a barra reta e as palmas para cima. É mais leve e costuma ser sentida mais perto do cotovelo; com a corda, a pegada já é neutra.</li>
</ul>

<h2>Tríceps corda ou barra?</h2>
<p>Não são a mesma coisa, mas trabalham o mesmo músculo. A <strong>barra</strong> (reta, V ou W) costuma permitir mais carga. A <strong>corda</strong> deixa as mãos se afastarem no fim do movimento e costuma ser mais confortável para punho e cotovelo. Se um deles incomoda, use o outro; se os dois vão bem, alternar ao longo das semanas é uma boa ideia.</p>

<h2>O que pode substituir o tríceps corda?</h2>
<ul>
<li><strong>Na polia:</strong> a barra reta, V ou W.</li>
<li><strong>Com halter:</strong> o tríceps testa ou o francês com halter.</li>
<li><strong>Sem equipamento:</strong> o mergulho no banco, ou nas <a href="/blog/como-fazer-mergulho-paralelas">paralelas</a>, e a flexão com as mãos mais fechadas.</li>
<li><strong>Em casa:</strong> um elástico preso no alto de uma porta, com o mesmo movimento: cotovelo parado ao lado do corpo e braço esticando para baixo.</li>
</ul>
<p><strong>Tríceps corda ou banco?</strong> O mergulho no banco usa o peso do corpo e carrega mais o ombro. Para quem sente o ombro, a corda costuma ser a escolha mais confortável.</p>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>3 a 4 séries de 10 a 15 repetições</strong>, parando a 1 ou 2 repetições da falha. O tríceps já trabalha no supino, no desenvolvimento e na flexão, então o volume total da semana conta. Veja <a href="/blog/quantas-series-para-hipertrofia">quantas séries para hipertrofia</a>. Não existe versão "feminina": o exercício é o mesmo para todo mundo, e o que muda é a carga.</p>

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
      "Para que serve a remada alta, qual músculo trabalha, como fazer com barra, halteres, na polia com corda, no cross e no smith, pegada aberta ou fechada, a remada alta articulada e o que fazer se o ombro incomoda.",
    category: "Treino",
    date: "2026-11-06",
    readTime: "8 min",
    author: "Montinho",
    tags: ["remada alta", "ombro", "trapézio", "exercícios", "musculação"],
    faq: [
      {
        question: "Para que serve a remada alta?",
        answer:
          "Para treinar a lateral do ombro e o trapézio, a parte de cima das costas que vai do pescoço ao ombro. É um exercício de ombro que também ajuda a dar volume ao trapézio.",
      },
      {
        question: "Remada alta trabalha qual músculo?",
        answer:
          "Principalmente o deltoide lateral, a parte lateral do ombro, e o trapézio, sobretudo a parte de cima. O bíceps ajuda a dobrar o cotovelo, e os músculos que movem a escápula participam para segurar o ombro.",
      },
      {
        question: "Remada alta é para ombro ou para costas?",
        answer:
          "A remada alta com barra, halteres ou polia é de ombro e trapézio. A remada alta articulada, a máquina em que você senta e puxa as alças de cima para baixo em direção ao peito, é outro exercício: trabalha as costas.",
      },
      {
        question: "Como fazer a remada alta?",
        answer:
          "De pé, com a barra na frente das coxas. Puxe a barra para cima, perto do corpo, levando os cotovelos para os lados e para cima até a altura dos ombros. Os cotovelos ficam sempre acima dos punhos. Desça devagar.",
      },
      {
        question: "Remada alta com pegada aberta ou fechada?",
        answer:
          "A pegada mais aberta, um pouco além da largura dos ombros, trabalha mais a lateral do ombro e costuma ser mais confortável. A pegada bem fechada leva mais o trapézio e é a que mais incomoda o ombro de quem sente o exercício.",
      },
      {
        question: "A remada alta faz mal para o ombro?",
        answer:
          "Para muita gente, não. Mas é um exercício que incomoda o ombro de algumas pessoas, principalmente com a pegada bem fechada e subindo acima da linha do ombro. Pegada mais aberta e subir só até a altura do ombro costumam resolver; se ainda doer, troque pela elevação lateral.",
      },
      {
        question: "Como fazer a remada alta na polia com corda?",
        answer:
          "Polia baixa, com a corda. De pé, de frente para a polia, puxe a corda para cima, perto do corpo, abrindo as pontas e levando os cotovelos para os lados até a altura dos ombros. A corda deixa cada mão achar o caminho mais confortável.",
      },
      {
        question: "Remada alta com barra, halteres ou polia?",
        answer:
          "As três funcionam. Os halteres e a polia com corda deixam cada braço achar o caminho mais confortável, o que ajuda quem sente o ombro. A barra, reta ou W, permite mais carga.",
      },
      {
        question: "O que pode substituir a remada alta?",
        answer:
          "Para a lateral do ombro, a elevação lateral. Para o trapézio, o encolhimento com halteres ou barra. Em casa, a remada alta com elástico, pisando no meio dele.",
      },
      {
        question: "Quantas séries e repetições fazer na remada alta?",
        answer:
          "Para a maioria das pessoas, de 3 a 4 séries de 10 a 15 repetições, com carga que você controla na descida e sem jogar o corpo para trás.",
      },
    ],
    content: `<img src="/blog-images/remada-alta-capa.webp" alt="Capa: Remada alta. Como fazer sem machucar o ombro. Ilustração de pessoa puxando a barra até o peito com os cotovelos altos" title="Remada Alta — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>A <strong>remada alta</strong> é puxar a barra, os halteres ou a polia de baixo para cima, perto do corpo, com os cotovelos subindo para os lados. É um exercício de ombro e trapézio que divide opinião: muita gente faz sem problema, e algumas pessoas sentem o ombro. A diferença quase sempre está na pegada e em até onde a barra sobe.</p>

<h2>Para que serve a remada alta e qual músculo trabalha?</h2>
<p>Principalmente o <strong>deltoide lateral</strong>, a parte lateral do ombro, e o <strong>trapézio</strong>, sobretudo a parte de cima, que vai do pescoço ao ombro. O bíceps ajuda a dobrar o cotovelo, e os músculos que movem a escápula participam para segurar o ombro.</p>
<p><strong>É para ombro ou para costas?</strong> A remada alta com barra, halteres ou polia é de ombro e trapézio. Se na sua ficha está "remada alta articulada", é outro exercício, que trabalha as costas; ele tem uma seção mais abaixo.</p>
<p>A dúvida que costuma vir junto é: remada alta ou elevação lateral? As duas trabalham a lateral do ombro. O comparador abaixo mostra o que muda.</p>

<h2>Como fazer a remada alta com barra</h2>
<ol>
<li><strong>Posição.</strong> De pé, pés na largura do quadril, joelhos levemente dobrados, coluna reta. Barra na frente das coxas, com as palmas viradas para você (pegada pronada).</li>
<li><strong>Pegada.</strong> Mãos um pouco mais abertas que a largura dos ombros. Pegada muito fechada é o que mais costuma incomodar o ombro.</li>
<li><strong>Subida.</strong> Puxe a barra para cima, perto do corpo, levando os cotovelos para os lados e para cima. Os cotovelos ficam sempre acima dos punhos.</li>
<li><strong>Até onde.</strong> Até os cotovelos chegarem à altura dos ombros. Subir mais que isso não adiciona muito e é onde o ombro reclama.</li>
<li><strong>Descida.</strong> Desça devagar, sem soltar o peso.</li>
</ol>
<p>Com a <strong>barra W</strong>, o movimento é o mesmo; os punhos ficam num ângulo que muita gente acha mais confortável.</p>

<h2>Pegada aberta ou fechada?</h2>
<p>A <strong>pegada aberta</strong>, um pouco além da largura dos ombros, trabalha mais a lateral do ombro e costuma ser mais confortável. A <strong>pegada fechada</strong>, com as mãos perto uma da outra, leva mais o trapézio, e é a versão que mais incomoda quem sente o ombro. Se você não tem motivo para fechar, prefira a aberta.</p>

<h2>Na polia, no cross, com halteres e outras variações</h2>
<ul>
<li><strong>Na polia com corda:</strong> polia baixa, com a corda. Puxe para cima, perto do corpo, abrindo as pontas no alto. A corda deixa cada mão achar o caminho mais confortável, e por isso costuma ser a versão mais amiga do ombro.</li>
<li><strong>Na polia ou no cross com barra reta ou triângulo:</strong> mesma execução da barra livre, com a tensão do cabo desde o começo. O triângulo deixa a pegada fechada; a barra reta permite abrir.</li>
<li><strong>Com halteres:</strong> um halter em cada mão, na frente das coxas. Como cada braço é livre, dá para achar o caminho mais confortável. Também dá para fazer unilateral, um braço de cada vez.</li>
<li><strong>No smith:</strong> a barra segue um trilho fixo, o que tira a liberdade do ombro. Funciona para quem se adapta; se incomodar, volte para os halteres ou a corda.</li>
<li><strong>Com anilha ou kettlebell:</strong> segure a anilha pelas bordas, ou o kettlebell pela alça, com as duas mãos. A pegada fica fechada, então suba só até a altura do peito.</li>
<li><strong>Com elástico (em casa):</strong> pise no meio do elástico, segure uma ponta em cada mão e faça o mesmo movimento.</li>
</ul>

<h2>Remada alta articulada (na máquina): é outro exercício</h2>
<p>Em muitas academias, "remada alta" também é o nome da <strong>máquina articulada</strong> em que você senta, apoia o peito e puxa as alças, que ficam no alto e à frente, em direção ao peito. Ela é uma remada de verdade: trabalha as <strong>costas</strong>, o latíssimo e o meio das costas, e não a lateral do ombro. A pegada pronada (palmas para baixo) e os cotovelos abertos levam mais o meio das costas; a supinada (palmas para cima) e os cotovelos junto ao corpo, mais o latíssimo. Para entender a diferença entre puxar de cima e puxar de frente, veja <a href="/blog/puxada-vs-remada">puxada ou remada</a>.</p>

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

<h2>O que pode substituir a remada alta?</h2>
<ul>
<li><strong>Para a lateral do ombro:</strong> a <a href="/blog/como-fazer-elevacao-lateral">elevação lateral</a>.</li>
<li><strong>Para o trapézio:</strong> o <a href="/blog/como-fazer-encolhimento-trapezio">encolhimento</a> com halteres ou barra. Encolhimento ou remada alta? O encolhimento isola o trapézio; a remada alta divide o trabalho com o ombro.</li>
<li><strong>Em casa:</strong> a remada alta com elástico.</li>
</ul>
<p>E o <strong>face pull</strong>? Também usa a corda na polia, mas puxa para a frente, em direção ao rosto, e trabalha a parte de trás do ombro. Veja o <a href="/blog/face-pull">face pull</a>.</p>

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
