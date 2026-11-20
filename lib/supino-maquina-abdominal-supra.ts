import type { BlogPost } from "./blog";

/**
 * Supino na máquina e abdominal supra (17/11/2026). Itens M1 e M2 da pauta
 * (docs/seo/pauta.md), exercícios do cadastro sem artigo. Planejador
 * (Brasil): "supino maquina" 90.500/mês, "abdominal supra" 74.000/mês.
 * Pedido do Montinho: "pode criar os dois primeiros".
 *
 * Canibalização (sem acento e sem hífen, slug, título e app/): nenhum artigo
 * de supino na máquina (só supino reto e inclinado) nem de abdominal supra.
 * O "infra" tem `abdomen-inferior-exercicios`, que diz que o reto abdominal
 * é um músculo só, com ativação regional possível; este texto segue a mesma
 * linha e linka para lá.
 *
 * Pesquisa no SerpApi (celular, São Paulo): "supino na máquina" e
 * "abdominal supra" (a página da segunda voltou 503 na primeira tentativa e
 * foi repetida uma vez). Evidência em
 * docs/seo/serp/supino-maquina-abdominal-supra-2026-11-17.json.
 *
 * Sem número de estudo: textos de execução. Músculos pelo cadastro do site
 * (lib/treino/exercicios.ts). Ferramenta: Comparador de Exercícios nos dois
 * (supino na máquina x supino reto com barra; abdominal supra x infra), e o
 * mapa de treino passa a apontar os dois exercícios para estes artigos.
 *
 * Capas: Kairogen sem crédito; publicados sem capa e anotados em
 * "Capas pendentes".
 */

export const SUPINO_MAQUINA_ABDOMINAL_SUPRA_POSTS: BlogPost[] = [
  {
    slug: "supino-na-maquina",
    title: "Supino na Máquina: Como Fazer, Para Que Serve e Como Ajustar",
    metaTitle: "Supino na Máquina: Como Fazer e Para Que Serve",
    metaDescription:
      "O supino na máquina (chest press) treina o peito com o caminho guiado. Veja como ajustar o banco, a pegada certa e quando ele vale mais que a barra.",
    excerpt:
      "Para que serve o supino na máquina, como ajustar o banco e fazer certo, pegada neutra ou pronada, máquina articulada, convergente e inclinada, e máquina, barra ou halteres.",
    category: "Treino",
    date: "2026-11-17",
    readTime: "7 min",
    author: "Montinho",
    tags: ["supino na máquina", "chest press", "peito", "exercícios", "musculação"],
    faq: [
      {
        question: "Para que serve o supino na máquina?",
        answer:
          "Para treinar o peito, com ajuda do tríceps e da frente do ombro, num caminho guiado. Como a máquina segura a trajetória, dá para focar em empurrar e levar a série perto da falha com mais segurança que na barra.",
      },
      {
        question: "Como fazer supino na máquina?",
        answer:
          "Ajuste o banco para as alças ficarem na altura do meio do peito. Sente com as costas apoiadas, ombros para trás e para baixo e pés firmes no chão. Empurre até quase esticar os braços, sem travar os cotovelos, e volte devagar até sentir o peito alongar, sem deixar o peso bater.",
      },
      {
        question: "Supino na máquina é bom?",
        answer:
          "É. A máquina guia o movimento, é fácil de aprender e de progredir a carga em passos pequenos, e permite treinar perto da falha com segurança. Ela não substitui obrigatoriamente a barra, mas também não é um exercício inferior.",
      },
      {
        question: "Supino na máquina ou na barra: qual é melhor?",
        answer:
          "Os dois treinam o peito. A barra pede mais equilíbrio e trabalha mais os músculos estabilizadores; a máquina deixa você focar só em empurrar. Para ganhar músculo, os dois funcionam; muita gente usa os dois na mesma semana.",
      },
      {
        question: "Supino na máquina ou com halteres?",
        answer:
          "Os halteres pedem mais estabilidade e deixam cada braço trabalhar sozinho; a máquina é mais estável e mais fácil de ajustar a carga. Escolha pelo que você consegue fazer com boa execução e progredir com o tempo.",
      },
      {
        question: "Qual pegada usar no supino na máquina?",
        answer:
          "A pegada neutra (palmas viradas uma para a outra) costuma ser mais confortável para o ombro e deixa o cotovelo mais perto do corpo. A pronada (palmas para baixo) abre um pouco mais os cotovelos. As duas treinam o peito.",
      },
      {
        question: "Supino na máquina é a mesma coisa que supino no Smith?",
        answer:
          "Não. No Smith você deita num banco embaixo de uma barra presa em trilhos. No supino na máquina, chamado de chest press, você empurra alças, quase sempre sentado. Os dois têm o caminho guiado.",
      },
    ],
    content: `<img src="/blog-images/supino-na-maquina-capa.webp" alt="Capa: Supino na máquina. Como fazer o chest press. Ilustração de uma máquina de supino com seta de empurrar" title="Supino na Máquina: Como Fazer, Para Que Serve e Como Ajustar — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>supino na máquina</strong>, também chamado de <em>chest press</em>, é o supino com o caminho guiado: você senta, segura as alças e empurra. Ele treina o mesmo peito do supino com barra, com menos coisa para controlar ao mesmo tempo. Por isso é ótimo para quem está começando e muito útil para quem já treina e quer levar a série perto do limite com segurança.</p>

<h2>Para que serve o supino na máquina?</h2>
<p>Para treinar o <strong>peito</strong> (peitoral maior), com ajuda do <strong>tríceps</strong> e da <strong>frente do ombro</strong>. A diferença para o supino com barra está no controle: a máquina segura a trajetória, então o corpo não precisa equilibrar o peso. Sobra mais atenção para empurrar.</p>
<p>Na prática, ele serve para:</p>
<ul>
<li><strong>Aprender o movimento</strong> de empurrar sem medo de a barra desequilibrar.</li>
<li><strong>Treinar perto da falha</strong> sem precisar de alguém ajudando na última repetição.</li>
<li><strong>Progredir a carga em passos pequenos</strong>, de placa em placa.</li>
<li><strong>Completar o treino</strong> depois do supino com barra, quando a técnica já cansou.</li>
</ul>
<p>Na dúvida entre a máquina e a barra, o comparador abaixo mostra o que muda entre os dois.</p>

<h2>Como fazer supino na máquina</h2>
<ol>
<li><strong>Ajuste o banco.</strong> As alças precisam ficar na altura do meio do peito (perto da linha dos mamilos). Muito altas, na altura do ombro, o ombro trabalha demais.</li>
<li><strong>Sente com as costas apoiadas.</strong> Ombros para trás e para baixo, peito aberto, pés firmes no chão.</li>
<li><strong>Segure as alças</strong> com os cotovelos um pouco abaixo da linha do ombro, apontando levemente para baixo, e não abertos em linha reta com o ombro.</li>
<li><strong>Empurre</strong> até quase esticar os braços, sem travar os cotovelos.</li>
<li><strong>Volte devagar</strong>, até sentir o peito alongar, sem deixar a pilha de peso bater antes do fim da série.</li>
</ol>

<h3>Pegada neutra ou pronada?</h3>
<p>Muitas máquinas têm duas alças. A <strong>neutra</strong> (palmas viradas uma para a outra) costuma ser mais confortável para o ombro e deixa o cotovelo mais perto do corpo. A <strong>pronada</strong> (palmas para baixo) abre um pouco mais os cotovelos. As duas treinam o peito: use a que você faz sem dor no ombro.</p>

<h2>Tipos de supino na máquina</h2>
<ul>
<li><strong>Sentado (chest press vertical):</strong> o mais comum. Você empurra para a frente, sentado com o encosto nas costas.</li>
<li><strong>Articulado:</strong> cada braço tem o seu braço de alavanca. Dá para empurrar com um braço de cada vez e perceber se um lado está mais fraco.</li>
<li><strong>Convergente:</strong> as alças se aproximam no fim do movimento, como se as mãos fechassem à frente do peito.</li>
<li><strong>Deitado:</strong> parecido com o supino de banco, mas com o peso guiado pela máquina.</li>
<li><strong>Inclinado:</strong> o encosto mais deitado para trás e o empurrar para cima e para a frente. Puxa mais a parte de cima do peito, como o <a href="/blog/como-fazer-supino-inclinado">supino inclinado</a>.</li>
</ul>
<p>O <strong>supino no Smith</strong> é outra coisa: um banco embaixo de uma barra presa em trilhos. Também é guiado, mas você deita e empurra a barra.</p>

<h2>Supino na máquina, na barra ou com halteres?</h2>
<table>
<thead><tr><th></th><th>Máquina</th><th>Barra</th><th>Halteres</th></tr></thead>
<tbody>
<tr><td>Equilíbrio</td><td>A máquina segura</td><td>Você segura a barra</td><td>Cada braço se equilibra sozinho</td></tr>
<tr><td>Aprender</td><td>Mais fácil</td><td>Pede mais técnica</td><td>Pede mais técnica</td></tr>
<tr><td>Treinar perto da falha</td><td>Seguro sozinho</td><td>Melhor com alguém ajudando</td><td>Dá para soltar os halteres</td></tr>
<tr><td>Progredir a carga</td><td>Placa a placa</td><td>Anilhas pequenas</td><td>Pula de 2 em 2 kg</td></tr>
</tbody>
</table>
<p>Nenhum é melhor para todo mundo. Para ganhar músculo, os três funcionam; muita gente usa a barra no começo do treino e a máquina no fim. Veja <a href="/blog/como-fazer-supino-reto">como fazer supino reto</a>, <a href="/blog/supino-barra-vs-halteres">supino com barra ou halteres</a> e <a href="/blog/maquina-ou-peso-livre">máquina ou peso livre</a>.</p>

<h2>Erros mais comuns</h2>
<ul>
<li><strong>Banco alto demais.</strong> Alças na altura do ombro fazem o ombro trabalhar mais que o peito.</li>
<li><strong>Ombro subindo do encosto.</strong> No fim da série, o ombro sai para a frente para ajudar. Mantenha as costas e os ombros apoiados.</li>
<li><strong>Cotovelo aberto em linha reta com o ombro.</strong> Costuma incomodar o ombro. Deixe o cotovelo um pouco abaixo.</li>
<li><strong>Deixar o peso bater.</strong> A descida conta. Volte devagar e comece a próxima repetição sem descansar na pilha.</li>
<li><strong>Carga alta com amplitude curta.</strong> Mais peso empurrado pela metade do caminho trabalha menos o peito do que um peso menor com o movimento inteiro.</li>
</ul>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>3 a 4 séries de 8 a 15 repetições</strong>, parando a 1 ou 2 repetições da falha, funcionam bem. Como a máquina é estável, ela é uma boa escolha para as últimas séries do treino de peito, quando o cansaço já atrapalha a técnica na barra. O que vale para qualquer exercício está em <a href="/blog/quantas-series-para-hipertrofia">quantas séries para hipertrofia</a>.</p>

<h2>Não se compare</h2>
<p>A placa da máquina não é a mesma de uma academia para outra: cada modelo tem uma alavanca diferente, e 50 kg numa máquina não pesam o mesmo que 50 kg na outra. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é a sua última série, na mesma máquina e com o mesmo ajuste do banco.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/como-fazer-supino-reto">Como fazer supino reto</a></li>
<li><a href="/blog/como-fazer-voador-pec-deck">Como fazer voador (peck deck)</a></li>
<li><a href="/blog/treino-de-peito-hipertrofia">Treino de peito para hipertrofia</a></li>
<li><a href="/blog/aparelhos-de-academia-nomes">Aparelhos de academia: nomes e para que serve</a></li>
</ul>`,
  },
  {
    slug: "abdominal-supra",
    title: "Abdominal Supra: Como Fazer, O Que Trabalha e Diferença para o Infra",
    metaTitle: "Abdominal Supra: Como Fazer e Diferença para o Infra",
    metaDescription:
      "O abdominal supra é o crunch: você enrola o tronco e descola só as escápulas do chão. Veja como fazer certo, as variações e a diferença para o infra.",
    excerpt:
      "O que o abdominal supra trabalha, como fazer no solo, a diferença para o infra, variações com peso, na polia, na máquina e no banco declinado, erros comuns e o que fazer no lugar.",
    category: "Treino",
    date: "2026-11-17",
    readTime: "7 min",
    author: "Montinho",
    tags: ["abdominal supra", "crunch", "abdômen", "reto abdominal", "exercícios"],
    faq: [
      {
        question: "Qual parte do abdômen o abdominal supra trabalha?",
        answer:
          "O reto abdominal, o músculo da frente da barriga, o mesmo dos \"gominhos\". Ele é um músculo só, de cima a baixo: o supra trabalha o reto inteiro, com um pouco mais de ênfase na parte de cima, porque é o tronco que se enrola em direção ao quadril.",
      },
      {
        question: "Qual a diferença entre abdominal supra e infra?",
        answer:
          "No supra, o tronco sobe em direção ao quadril; no infra, o quadril e as pernas sobem em direção ao tronco. Os dois trabalham o mesmo reto abdominal. O infra costuma pedir mais do flexor do quadril e ser mais difícil de fazer sem a lombar sair do chão.",
      },
      {
        question: "Como fazer abdominal supra corretamente?",
        answer:
          "Deite de costas com os joelhos dobrados e os pés no chão. Solte o ar e enrole o tronco até descolar só as escápulas do chão, sem puxar o pescoço com as mãos. Desça devagar, sem relaxar o abdômen entre as repetições.",
      },
      {
        question: "O que substitui o abdominal supra?",
        answer:
          "O abdominal na polia (ajoelhado, com a corda), o abdominal na máquina, o abdominal no banco declinado e a roda abdominal trabalham o mesmo músculo. Se o pescoço incomoda, a prancha é uma alternativa que treina o abdômen sem enrolar o tronco.",
      },
      {
        question: "Quem tem diástase pode fazer abdominal?",
        answer:
          "Depende do caso. Em muitas situações, o abdominal tradicional fica para depois e o trabalho começa pelo controle da respiração e do abdômen profundo. A decisão é com o médico ou o fisioterapeuta que acompanha a diástase.",
      },
      {
        question: "Quais são os músculos principais do abdômen?",
        answer:
          "O reto abdominal (na frente, o dos \"gominhos\"), os oblíquos interno e externo (nas laterais) e o transverso do abdômen (o mais fundo, que funciona como uma cinta). O abdominal supra trabalha principalmente o reto.",
      },
      {
        question: "Abdominal supra perde barriga?",
        answer:
          "Não sozinho. Ele fortalece o músculo, mas a gordura da barriga sai do corpo todo, com o déficit de calorias mantido por semanas. Fazer centenas de abdominais não queima a gordura daquele lugar.",
      },
    ],
    content: `<img src="/blog-images/abdominal-supra-capa.webp" alt="Capa: Abdominal supra. Como fazer o crunch. Ilustração de um colchonete e do tronco subindo" title="Abdominal Supra: Como Fazer, O Que Trabalha e Diferença para o Infra — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>abdominal supra</strong> é o abdominal mais conhecido, o <em>crunch</em>: deitado, você enrola o tronco e descola só a parte de cima das costas do chão. É simples, mas quase todo mundo faz algum detalhe que tira o trabalho da barriga e joga para o pescoço ou para o quadril. Corrigir isso vale mais do que fazer mais repetições.</p>

<h2>O que o abdominal supra trabalha?</h2>
<p>O <strong>reto abdominal</strong>, o músculo da frente da barriga. Ele vai do osso do púbis até as costelas, e as faixas que formam os "gominhos" não dividem músculos diferentes: é um músculo só. O supra trabalha o reto inteiro, com um pouco mais de ênfase na parte de cima, porque é o tronco que se move em direção ao quadril.</p>
<p>Os outros músculos do abdômen ajudam a segurar o tronco: os <strong>oblíquos</strong>, nas laterais, e o <strong>transverso</strong>, o mais fundo, que funciona como uma cinta.</p>

<h2>Como fazer abdominal supra</h2>
<ol>
<li><strong>Deite de costas</strong>, joelhos dobrados, pés apoiados no chão na largura do quadril.</li>
<li><strong>Mãos cruzadas no peito</strong> ou encostadas de leve nas laterais da cabeça, sem entrelaçar os dedos atrás da nuca.</li>
<li><strong>Solte o ar e enrole o tronco</strong>, como se aproximasse as costelas do quadril, até descolar só as escápulas do chão. É um movimento curto.</li>
<li><strong>Segure um instante</strong> no alto, apertando a barriga.</li>
<li><strong>Desça devagar</strong>, sem relaxar o abdômen antes da próxima repetição.</li>
</ol>

<h2>Abdominal supra e infra: qual a diferença?</h2>
<table>
<thead><tr><th></th><th>Supra</th><th>Infra</th></tr></thead>
<tbody>
<tr><td>O que se move</td><td>O tronco sobe em direção ao quadril</td><td>O quadril e as pernas sobem em direção ao tronco</td></tr>
<tr><td>Músculo</td><td>Reto abdominal, com um pouco mais de ênfase em cima</td><td>Reto abdominal, com mais participação do flexor do quadril</td></tr>
<tr><td>Dificuldade</td><td>Mais fácil de aprender</td><td>Mais difícil manter a lombar no chão</td></tr>
</tbody>
</table>
<p>O "infra" não é um músculo separado. Os dois trabalham o mesmo reto abdominal, com ênfases um pouco diferentes, e um treino com os dois movimentos cobre o abdômen inteiro. A explicação completa está em <a href="/blog/abdomen-inferior-exercicios">abdômen inferior: a verdade sobre o infra</a>. O comparador abaixo mostra as diferenças entre os dois exercícios.</p>

<h2>Variações do abdominal supra</h2>
<ul>
<li><strong>No solo:</strong> a versão básica, sem equipamento.</li>
<li><strong>Com peso ou anilha:</strong> segure uma anilha ou um halter no peito. É o jeito mais simples de progredir quando as repetições ficam fáceis.</li>
<li><strong>Na polia (com corda):</strong> ajoelhado de frente para a polia, você enrola o tronco para baixo. Dá para aumentar a carga em passos pequenos.</li>
<li><strong>Na máquina:</strong> sentado, você empurra o apoio do peito para baixo enrolando o tronco.</li>
<li><strong>No banco declinado:</strong> com os pés presos e a cabeça mais baixa, o movimento fica mais difícil.</li>
<li><strong>Na bola:</strong> deitado sobre a bola suíça, o tronco desce um pouco mais e a amplitude aumenta.</li>
</ul>

<h2>Erros mais comuns</h2>
<ul>
<li><strong>Puxar o pescoço com as mãos.</strong> É a principal causa de dor no pescoço no abdominal. As mãos só apoiam; quem sobe é a barriga.</li>
<li><strong>Subir o tronco inteiro.</strong> Sentar até o fim passa o trabalho para o flexor do quadril. O supra é curto: só as escápulas saem do chão.</li>
<li><strong>Usar impulso.</strong> Subir jogando o corpo tira a tensão do músculo. Controle a subida e a descida.</li>
<li><strong>Prender a respiração.</strong> Solte o ar na subida.</li>
</ul>

<h2>O que fazer no lugar do abdominal supra?</h2>
<p>Se o pescoço incomoda ou você quer variar, estes treinam o mesmo músculo: abdominal na polia, abdominal na máquina, roda abdominal e o abdominal no banco declinado. A <a href="/blog/prancha-abdominal-como-fazer-e-beneficios">prancha</a> treina o abdômen sem enrolar o tronco e costuma ser mais confortável para quem sente o pescoço.</p>

<h2>Abdominal supra perde barriga?</h2>
<p>Não sozinho. Ele fortalece o músculo, mas a gordura da barriga sai do corpo todo, com o déficit de calorias mantido por semanas. Fazer centenas de abdominais não queima a gordura daquele lugar. Veja <a href="/blog/abdominal-todo-dia-perde-barriga">abdominal todo dia perde barriga?</a> e <a href="/blog/como-perder-gordura-abdominal">como perder gordura abdominal</a>.</p>

<h2>Quem tem diástase pode fazer?</h2>
<p>Depende do caso. Em muitas situações, o abdominal tradicional fica para depois e o trabalho começa pelo controle da respiração e do abdômen profundo. A decisão é com o médico ou o fisioterapeuta que acompanha a diástase. Veja <a href="/blog/diastase-abdominal-exercicio">diástase abdominal: exercícios</a>.</p>

<h2>Quantas séries e repetições?</h2>
<p>De <strong>2 a 4 séries de 10 a 20 repetições</strong> funcionam para a maioria, com controle em cada uma. Quando passar de 20 com facilidade, acrescente peso ou troque por uma variação mais difícil, em vez de só somar repetições. Veja também <a href="/blog/quantos-abdominais-por-dia">quantos abdominais por dia</a>.</p>

<h2>Não se compare</h2>
<p>O desenho do abdômen depende muito de genética e da gordura que cobre o músculo: tem gente que treina pouco e mostra os "gominhos", e gente que treina muito e não mostra. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é o seu último treino: uma repetição a mais ou um pouco mais de carga, com a mesma execução.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/abdomen-inferior-exercicios">Abdômen inferior: a verdade sobre o infra</a></li>
<li><a href="/blog/prancha-abdominal-como-fazer-e-beneficios">Prancha abdominal</a></li>
<li><a href="/blog/treino-de-abdomen-em-casa">Treino de abdômen em casa</a></li>
<li><a href="/blog/quantos-abdominais-por-dia">Quantos abdominais por dia</a></li>
</ul>`,
  },
];
