import type { BlogPost } from "./blog";

/**
 * Rosca inversa e abdominal oblíquo (17/11/2026). Itens M3 e M3a da pauta
 * (docs/seo/pauta.md). Planejador (Brasil): "rosca inversa" 27.100/mês,
 * "abdominal obliquo" 27.100/mês. Pedido do Montinho: "pode criar 1 e 2".
 *
 * Canibalização (sem acento e sem hífen, slug, título e app/): nenhum artigo
 * de rosca inversa nem de oblíquo. Vizinhos e coerência:
 * - `forca-de-pegada-e-antebraco` cita a rosca inversa como trabalho direto
 *   de antebraço (2 a 3 séries, 12 a 20 repetições): o texto segue a mesma
 *   faixa e linka para lá.
 * - `treino-para-cintura-fina` diz que oblíquo com carga alta pode aumentar o
 *   volume lateral da cintura e recomenda carga leve para quem quer cintura
 *   fina: o texto segue a mesma linha.
 *
 * Pesquisa no SerpApi (celular, São Paulo): "rosca inversa" e "abdominal
 * oblíquo". Evidência em docs/seo/serp/rosca-inversa-obliquo-2026-11-17.json.
 *
 * Sem número de estudo: textos de execução. Músculos pelo cadastro do site
 * (rosca-inversa: antebraço primário, bíceps secundário). Ferramentas:
 * Comparador de Exercícios (rosca inversa x rosca martelo; abdominal
 * bicicleta x rotação de tronco na polia, os dois exercícios de rotação do
 * cadastro). O mapa de treino passa a apontar rosca-inversa e
 * rosca-inversa-polia para o artigo.
 *
 * Capas: Kairogen sem crédito; publicados sem capa e anotados em
 * "Capas pendentes".
 */

export const ROSCA_INVERSA_OBLIQUO_POSTS: BlogPost[] = [
  {
    slug: "rosca-inversa",
    title: "Rosca Inversa: Para Que Serve, Como Fazer e Qual Músculo Trabalha",
    metaTitle: "Rosca Inversa: Para Que Serve e Como Fazer",
    metaDescription:
      "A rosca inversa é a rosca com as palmas viradas para baixo: trabalha antebraço e braço. Veja como fazer com barra, barra W, halteres e polia.",
    excerpt:
      "Para que serve a rosca inversa, qual músculo trabalha, como fazer com barra reta, barra W, halteres e na polia, a diferença para a rosca direta e a martelo, erros e séries.",
    category: "Treino",
    date: "2026-11-17",
    readTime: "7 min",
    author: "Montinho",
    tags: ["rosca inversa", "antebraço", "bíceps", "exercícios", "musculação"],
    faq: [
      {
        question: "Para que serve a rosca inversa?",
        answer:
          "Para treinar o antebraço, principalmente o músculo da parte de cima dele, junto com o braço. Ela também ajuda na força de pegada, que conta em barra fixa, remada e levantamento terra.",
      },
      {
        question: "Qual músculo a rosca inversa trabalha?",
        answer:
          "O antebraço é o alvo principal, em especial o braquiorradial, o músculo grosso da parte de cima do antebraço, perto do cotovelo. O bíceps e o braquial ajudam a dobrar o cotovelo, mas trabalham menos que na rosca direta.",
      },
      {
        question: "Qual a diferença entre rosca direta, martelo e inversa?",
        answer:
          "Muda a posição da mão. Na direta, as palmas ficam para cima e o bíceps trabalha mais. Na martelo, as palmas ficam viradas uma para a outra e braço e antebraço dividem o trabalho. Na inversa, as palmas ficam para baixo e o antebraço trabalha mais.",
      },
      {
        question: "Como substituir a rosca inversa?",
        answer:
          "A rosca martelo é a substituta mais próxima. A rosca inversa na polia substitui a versão com barra, e a rosca de punho invertida trabalha os extensores do punho, que também participam.",
      },
      {
        question: "Rosca inversa com barra reta ou barra W?",
        answer:
          "Com a barra W, os punhos ficam num ângulo mais confortável, e muita gente sente menos incômodo. A barra reta pede mais do punho. As duas trabalham o mesmo músculo: use a que você faz sem dor.",
      },
      {
        question: "Rosca em pé ou sentado: qual a diferença?",
        answer:
          "Sentado, fica mais difícil balançar o tronco para ajudar a subir o peso, e o braço trabalha mais isolado. Em pé, dá para usar um pouco mais de carga, mas é mais fácil roubar. Para a rosca inversa, os dois funcionam.",
      },
      {
        question: "Quantas séries e repetições fazer na rosca inversa?",
        answer:
          "De 2 a 3 séries de 12 a 20 repetições funcionam bem para a maioria. A carga costuma ser menor que a da rosca direta, porque o antebraço é mais fraco nessa posição.",
      },
    ],
    content: `<img src="/blog-images/rosca-inversa-capa.webp" alt="Capa: Rosca inversa. Como fazer a pegada pronada. Ilustração de duas barras em alturas diferentes com uma seta de subida" title="Rosca Inversa: Para Que Serve, Como Fazer e Qual Músculo Trabalha — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>A <strong>rosca inversa</strong> é a rosca feita com as palmas das mãos viradas para baixo. Parece só um detalhe da pegada, mas muda o músculo que mais trabalha: sai o bíceps do centro e entra o <strong>antebraço</strong>. É o exercício que ajuda a deixar o antebraço proporcional ao braço e a segurar melhor a barra nos exercícios de puxar.</p>

<h2>Para que serve a rosca inversa?</h2>
<ul>
<li><strong>Treinar o antebraço</strong>, que quase não recebe estímulo direto nas roscas tradicionais.</li>
<li><strong>Equilibrar braço e antebraço.</strong> Quem só faz rosca direta costuma ter o bíceps mais desenvolvido que o antebraço.</li>
<li><strong>Melhorar a força de pegada</strong>, que conta na barra fixa, na remada e no levantamento terra. Veja <a href="/blog/forca-de-pegada-e-antebraco">força de pegada e antebraço</a>.</li>
</ul>
<p>Na dúvida entre a inversa e a martelo, o comparador abaixo mostra o que muda entre as duas.</p>

<h2>Qual músculo a rosca inversa trabalha?</h2>
<p>O alvo principal é o <strong>braquiorradial</strong>, o músculo grosso da parte de cima do antebraço, perto do cotovelo. Os <strong>extensores do punho</strong> trabalham para manter a mão firme. O <strong>bíceps</strong> e o <strong>braquial</strong> ajudam a dobrar o cotovelo, mas com menos força que na rosca direta, porque a palma para baixo coloca o bíceps numa posição menos favorável.</p>

<h2>Como fazer rosca inversa</h2>
<ol>
<li><strong>Segure a barra com as palmas para baixo</strong>, mãos na largura dos ombros.</li>
<li><strong>Em pé</strong>, pés na largura do quadril, abdômen firme, cotovelos colados ao corpo.</li>
<li><strong>Suba</strong> dobrando os cotovelos, sem mexer os ombros nem balançar o tronco, até a barra chegar perto do peito.</li>
<li><strong>Mantenha o punho reto</strong>, alinhado com o antebraço. Punho dobrando para trás tira o trabalho do antebraço e incomoda.</li>
<li><strong>Desça devagar</strong> até esticar os braços.</li>
</ol>

<h2>Variações: barra reta, barra W, halteres e polia</h2>
<ul>
<li><strong>Barra reta:</strong> a clássica. Pede mais do punho; para quem tem boa mobilidade.</li>
<li><strong>Barra W:</strong> deixa os punhos num ângulo mais natural. Boa para quem sente o punho na barra reta.</li>
<li><strong>Halteres:</strong> cada braço trabalha sozinho, e dá para fazer alternado ou ao mesmo tempo.</li>
<li><strong>Polia (cross):</strong> com a barra presa na polia baixa, o peso puxa o tempo todo, inclusive no começo do movimento. Há também a versão unilateral, com um braço de cada vez.</li>
</ul>

<h2>Rosca direta, martelo ou inversa?</h2>
<table>
<thead><tr><th></th><th>Direta</th><th>Martelo</th><th>Inversa</th></tr></thead>
<tbody>
<tr><td>Palmas</td><td>Para cima</td><td>Uma para a outra</td><td>Para baixo</td></tr>
<tr><td>Trabalha mais</td><td>Bíceps</td><td>Braço e antebraço</td><td>Antebraço</td></tr>
<tr><td>Carga</td><td>A maior das três</td><td>Intermediária</td><td>A menor das três</td></tr>
</tbody>
</table>
<p>As três se completam. Num treino de braço, a direta ou a <a href="/blog/rosca-alternada">alternada</a> cuidam do bíceps, e a martelo ou a inversa cuidam do antebraço. Veja também <a href="/blog/rosca-direta-vs-rosca-martelo">rosca direta ou martelo</a>.</p>

<h2>Erros mais comuns</h2>
<ul>
<li><strong>Carga de rosca direta.</strong> O antebraço é mais fraco nessa posição. Com o peso da rosca comum, o corpo balança e o punho dobra.</li>
<li><strong>Punho dobrando para trás.</strong> Mantenha a mão alinhada com o antebraço do começo ao fim.</li>
<li><strong>Cotovelo indo para a frente.</strong> Vira um levantamento de ombro. Cotovelos parados ao lado do corpo.</li>
<li><strong>Descer rápido.</strong> A descida controlada também conta.</li>
</ul>

<h2>Quantas séries e repetições?</h2>
<p>De <strong>2 a 3 séries de 12 a 20 repetições</strong>, parando perto da falha, funcionam bem para a maioria. Ela cabe no fim do treino de braço ou de costas, quando o antebraço já trabalhou segurando as puxadas.</p>

<h2>Não se compare</h2>
<p>O tamanho do antebraço depende muito de genética: tem gente com antebraço grosso sem treinar e gente que treina anos e ele cresce devagar. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é a sua última série: uma repetição a mais ou um pouco mais de carga, com o punho firme.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/forca-de-pegada-e-antebraco">Força de pegada e antebraço</a></li>
<li><a href="/blog/como-fazer-rosca-martelo">Como fazer rosca martelo</a></li>
<li><a href="/blog/como-fazer-rosca-direta">Como fazer rosca direta</a></li>
<li><a href="/blog/treino-de-biceps">Treino de bíceps</a></li>
</ul>`,
  },
  {
    slug: "abdominal-obliquo",
    title: "Abdominal Oblíquo: Como Fazer, Para Que Serve e os Melhores Exercícios",
    metaTitle: "Abdominal Oblíquo: Como Fazer e Melhores Exercícios",
    metaDescription:
      "Os oblíquos são os músculos da lateral da barriga, que giram e inclinam o tronco. Veja como fazer o abdominal oblíquo e as variações no solo e na polia.",
    excerpt:
      "Para que servem os oblíquos, como fazer o abdominal oblíquo no solo, alternado e cruzado, as variações com peso, na polia e no banco romano, se engrossa a cintura e o que fazer no lugar.",
    category: "Treino",
    date: "2026-11-17",
    readTime: "7 min",
    author: "Montinho",
    tags: ["abdominal oblíquo", "oblíquos", "abdômen", "core", "exercícios"],
    faq: [
      {
        question: "Qual a função do oblíquo?",
        answer:
          "Os oblíquos, interno e externo, ficam na lateral da barriga. Eles giram o tronco, inclinam para o lado e, principalmente, seguram o tronco firme quando algo tenta girá-lo, como ao carregar uma sacola de um lado só.",
      },
      {
        question: "Como fazer abdominal oblíquo?",
        answer:
          "Deite de costas, joelhos dobrados e pés no chão, mãos de leve atrás da cabeça. Solte o ar e suba o tronco girando, levando o cotovelo em direção ao joelho oposto. Volte devagar e alterne os lados, sem puxar o pescoço.",
      },
      {
        question: "Qual abdominal substitui o oblíquo?",
        answer:
          "Prancha lateral, abdominal bicicleta, rotação de tronco na polia (lenhador) e o giro russo trabalham os oblíquos. A prancha lateral é a mais confortável para quem sente o pescoço.",
      },
      {
        question: "Abdominal oblíquo engrossa a cintura?",
        answer:
          "Com carga alta e muito volume, os oblíquos podem crescer e deixar a lateral da cintura um pouco mais larga, principalmente em quem tem facilidade de ganhar músculo. Com peso leve ou só o corpo, isso não costuma acontecer. Quem quer cintura fina pode treinar oblíquo com carga leve.",
      },
      {
        question: "Abdominal oblíquo perde a gordura do lado da barriga?",
        answer:
          "Não. Ele fortalece o músculo, mas a gordura sai do corpo todo, com o déficit de calorias mantido por semanas. Nenhum exercício queima a gordura de um lugar escolhido.",
      },
      {
        question: "Quais são os melhores exercícios abdominais?",
        answer:
          "Os que você faz bem e consegue progredir: um para enrolar o tronco (abdominal supra ou na polia), um para elevar as pernas (infra) e um para girar ou resistir ao giro (oblíquo ou prancha lateral). Com os três, o abdômen inteiro trabalha.",
      },
    ],
    content: `<img src="/blog-images/abdominal-obliquo-capa.webp" alt="Capa: Abdominal oblíquo. Como fazer e as variações. Ilustração de um colchonete com setas de giro" title="Abdominal Oblíquo: Como Fazer, Para Que Serve e os Melhores Exercícios — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>abdominal oblíquo</strong> é o abdominal que trabalha a lateral da barriga. Os oblíquos giram o tronco e inclinam para o lado, mas a função mais importante deles no dia a dia é <strong>segurar o tronco firme</strong> quando alguma coisa tenta girá-lo. Um treino de abdômen que só tem abdominal supra deixa essa parte de fora.</p>

<h2>Para que serve o oblíquo?</h2>
<p>São dois músculos de cada lado: o <strong>oblíquo externo</strong>, mais por fora, e o <strong>oblíquo interno</strong>, por baixo dele. Juntos, eles:</p>
<ul>
<li><strong>Giram o tronco</strong>, como ao olhar para trás ou num golpe de raquete.</li>
<li><strong>Inclinam o tronco para o lado.</strong></li>
<li><strong>Resistem ao giro e à inclinação</strong>, como ao carregar uma mala ou sacola de um lado só. É o que mais protege a coluna no dia a dia.</li>
</ul>
<p>O comparador abaixo mostra as diferenças entre dois exercícios de oblíquo: o abdominal bicicleta e a rotação de tronco na polia.</p>

<h2>Como fazer abdominal oblíquo no solo</h2>
<ol>
<li><strong>Deite de costas</strong>, joelhos dobrados, pés no chão.</li>
<li><strong>Mãos de leve atrás da cabeça</strong> ou nas laterais da testa, sem entrelaçar os dedos e sem puxar o pescoço.</li>
<li><strong>Solte o ar e suba girando</strong>, levando o cotovelo em direção ao joelho oposto (cotovelo direito para o joelho esquerdo).</li>
<li><strong>Volte devagar</strong> e alterne o lado na próxima repetição, ou faça todas de um lado e depois do outro.</li>
</ol>
<p>O movimento é curto, como no <a href="/blog/abdominal-supra">abdominal supra</a>: quem gira é o tronco, não o cotovelo sozinho.</p>

<h2>Variações do abdominal oblíquo</h2>
<ul>
<li><strong>Alternado ou cruzado:</strong> o da descrição acima, cotovelo para o joelho oposto.</li>
<li><strong>Unilateral:</strong> todas as repetições de um lado antes de trocar. Ajuda a perceber se um lado é mais fraco.</li>
<li><strong>Toque nos pés:</strong> deitado, com os ombros levemente descolados, você inclina para o lado e leva a mão em direção ao calcanhar.</li>
<li><strong>Bicicleta:</strong> pernas no ar, pedalando, e o cotovelo vai ao joelho oposto. Mais difícil e mais dinâmico.</li>
<li><strong>Com halter ou peso:</strong> o halter no peito durante a rotação, ou de lado na inclinação lateral em pé.</li>
<li><strong>Na polia (lenhador):</strong> em pé, de lado para a polia, você gira o tronco puxando o cabo na diagonal, de cima para baixo ou de baixo para cima. A polia alta faz o movimento de cima para baixo.</li>
<li><strong>Na máquina:</strong> algumas academias têm a máquina de rotação de tronco, sentado.</li>
<li><strong>No banco romano:</strong> de lado no banco, com os pés presos, você desce e sobe o tronco inclinando para o lado. É a mais difícil da lista.</li>
</ul>

<h2>Prancha lateral: o oblíquo sem girar</h2>
<p>A <strong>prancha lateral</strong> treina os oblíquos segurando o corpo de lado, sem movimento. É a melhor escolha para quem sente o pescoço nos abdominais ou a lombar nas rotações. Comece apoiando o joelho e evolua para os pés. Veja <a href="/blog/prancha-abdominal-como-fazer-e-beneficios">prancha abdominal</a>.</p>

<h2>Abdominal oblíquo engrossa a cintura?</h2>
<p>Com <strong>carga alta e muito volume</strong>, os oblíquos podem crescer e deixar a lateral da cintura um pouco mais larga, principalmente em quem tem facilidade de ganhar músculo. Com peso leve ou só o peso do corpo, isso não costuma acontecer. Quem quer cintura fina pode treinar oblíquo com carga leve. Veja <a href="/blog/treino-para-cintura-fina">treino para cintura fina</a>.</p>

<h2>Abdominal oblíquo perde a gordura do lado da barriga?</h2>
<p>Não. Ele fortalece o músculo, mas a gordura sai do corpo todo, com o déficit de calorias mantido por semanas. Nenhum exercício queima a gordura de um lugar escolhido. Veja <a href="/blog/gordura-localizada-mitos-e-fatos">gordura localizada</a>.</p>

<h2>Erros mais comuns</h2>
<ul>
<li><strong>Puxar o pescoço.</strong> As mãos só apoiam. Quem gira é a barriga.</li>
<li><strong>Mexer só o cotovelo.</strong> O cotovelo vai junto com o tronco; se só ele se mexe, o oblíquo quase não trabalha.</li>
<li><strong>Usar impulso.</strong> Rotação rápida e solta perde a tensão e força a lombar.</li>
<li><strong>Carga alta logo de cara.</strong> Comece com o peso do corpo e só depois acrescente carga.</li>
</ul>

<h2>Como encaixar no treino</h2>
<p>Um treino de abdômen completo tem três tipos de movimento: <strong>enrolar o tronco</strong> (<a href="/blog/abdominal-supra">supra</a> ou na polia), <strong>elevar as pernas</strong> (<a href="/blog/abdomen-inferior-exercicios">infra</a>) e <strong>girar ou resistir ao giro</strong> (oblíquo ou prancha lateral). De <strong>2 a 3 séries de 10 a 15 repetições de cada lado</strong>, ou de 20 a 40 segundos na prancha lateral, funcionam para a maioria.</p>

<h2>Não se compare</h2>
<p>O desenho da lateral da barriga depende de genética e da gordura que cobre o músculo. Tem gente que mostra os oblíquos sem treinar e gente que treina muito e não mostra. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é o seu último treino: uma repetição a mais ou alguns segundos a mais na prancha, com a mesma execução.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/abdominal-supra">Abdominal supra</a></li>
<li><a href="/blog/abdomen-inferior-exercicios">Abdômen inferior: a verdade sobre o infra</a></li>
<li><a href="/blog/prancha-abdominal-como-fazer-e-beneficios">Prancha abdominal</a></li>
<li><a href="/blog/treino-de-abdomen-em-casa">Treino de abdômen em casa</a></li>
</ul>`,
  },
];
