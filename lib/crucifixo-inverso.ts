import type { BlogPost } from "./blog";

/**
 * "Crucifixo inverso" (05/11/2026). 90.500 buscas por mês no Planejador de
 * Palavras-chave do Google Ads (Brasil), e o site não tinha página do
 * exercício: ele só aparecia de passagem no mapa de ombros. Publicado a
 * pedido do Montinho ANTES dos prints. Revisado em 16/11/2026 com a pesquisa
 * do SerpApi (celular, São Paulo): "crucifixo inverso", "crucifixo inverso com
 * halteres" e "crucifixo inverso maquina". Entraram: para que serve, o que
 * substitui, nomes (invertido, voador, dorsal, peck deck), variações de banco,
 * pegada e ajuste da máquina, trapézio e amplitude exagerada.
 *
 * Sem número de estudo: o texto é de execução e escolha de variação. Os
 * músculos seguem o cadastro do próprio site (lib/treino/exercicios.ts:
 * deltoide posterior como primário, trapézio como secundário), e a faixa de
 * repetições remete aos artigos de séries e repetições, que têm as fontes.
 *
 * Ferramenta: o Comparador de Exercícios embutido com crucifixo inverso x
 * face pull, a dúvida que sobra a quem escolhe exercício para o posterior de
 * ombro. Os três ids do exercício passam a apontar para este artigo no mapa
 * de treino (ARTIGO_DO_EXERCICIO).
 */

export const CRUCIFIXO_INVERSO_POSTS: BlogPost[] = [
  {
    slug: "crucifixo-inverso",
    title: "Crucifixo Inverso: Como Fazer, Músculos e Erros Comuns",
    metaTitle: "Crucifixo Inverso: Como Fazer, Músculos e Erros",
    metaDescription:
      "Crucifixo inverso trabalha o deltoide posterior, a parte de trás do ombro. Veja como fazer com halteres, na máquina e na polia, e os erros que tiram o ombro do exercício.",
    excerpt:
      "O que o crucifixo inverso trabalha, como fazer com halteres, na máquina (voador inverso) e na polia, os erros mais comuns e quando trocar pelo face pull.",
    category: "Treino",
    date: "2026-11-05",
    updatedAt: "2026-11-16",
    readTime: "8 min",
    author: "Montinho",
    tags: ["crucifixo inverso", "ombro", "deltoide posterior", "exercícios", "musculação"],
    faq: [
      {
        question: "O que o crucifixo inverso trabalha?",
        answer:
          "Principalmente o deltoide posterior, a parte de trás do ombro. O trapézio do meio das costas e os romboides ajudam a segurar e aproximar as escápulas no fim do movimento.",
      },
      {
        question: "Crucifixo inverso é para ombro ou para costas?",
        answer:
          "Para ombro. O alvo é o deltoide posterior. As costas participam como apoio, mas, se você sente o exercício só no meio das costas, provavelmente está puxando com as escápulas e usando carga demais.",
      },
      {
        question: "Qual parte das costas o crucifixo inverso trabalha?",
        answer:
          "A parte de cima e do meio das costas: o trapézio médio e inferior e os romboides, que seguram e aproximam as escápulas no fim do movimento. Eles ajudam, mas o alvo continua sendo o deltoide posterior, a parte de trás do ombro.",
      },
      {
        question: "O crucifixo inverso trabalha o trapézio?",
        answer:
          "Trabalha o trapézio do meio das costas, como ajudante. O trapézio de cima, perto do pescoço, não deveria fazer força: se você sente ali, o ombro está subindo em direção à orelha ou a carga está alta.",
      },
      {
        question: "O que significa crucifixo invertido?",
        answer:
          "É o mesmo crucifixo inverso. \"Invertido\" porque é o contrário do crucifixo de peito: em vez de fechar os braços à frente, você abre os braços para os lados e para trás. Também aparece como voador invertido, fly inverso, peck deck invertido e crucifixo dorsal.",
      },
      {
        question: "Qual a diferença entre crucifixo inverso e voador inverso?",
        answer:
          "É o mesmo movimento. Voador inverso é o nome que muita academia dá ao crucifixo inverso feito na máquina do voador, sentado de frente para o encosto.",
      },
      {
        question: "Quantas séries e repetições fazer no crucifixo inverso?",
        answer:
          "Para a maioria das pessoas, de 2 a 4 séries de 10 a 20 repetições funcionam bem. O deltoide posterior é pequeno e trabalha melhor com carga que você controla do começo ao fim, parando a 1 ou 2 repetições da falha.",
      },
      {
        question: "Crucifixo inverso ou face pull: qual é melhor?",
        answer:
          "Os dois treinam o posterior de ombro. O crucifixo inverso isola melhor o deltoide posterior; o face pull, na polia, envolve mais o trapézio e a rotação do ombro. Num treino de ombros, um dos dois já basta; alternar entre eles ao longo das semanas também funciona.",
      },
      {
        question: "O que substitui o crucifixo inverso?",
        answer:
          "O face pull na polia, a remada com pegada aberta e cotovelos altos e a abertura de braços com elástico treinam o mesmo músculo. Trocar de equipamento também vale: se a máquina está ocupada, o crucifixo inverso com halteres ou na polia faz o mesmo trabalho.",
      },
      {
        question: "Como ajustar a máquina do crucifixo inverso?",
        answer:
          "Sente de frente para o encosto, com o peito apoiado, e ajuste a altura do banco para que as alças fiquem na linha dos ombros. Ajuste também a posição inicial dos braços: eles começam quase juntos à frente, sem que o peso encoste na pilha.",
      },
      {
        question: "Dá para fazer crucifixo inverso em casa?",
        answer:
          "Dá. Com halteres ou garrafas de água, inclinado à frente ou deitado de bruços num banco. Com elástico, preso na altura do peito, você abre os braços para trás, como na polia.",
      },
      {
        question: "Por que sinto o crucifixo inverso no trapézio?",
        answer:
          "Normalmente porque o ombro está subindo em direção à orelha durante o movimento, ou porque a carga está alta e você compensa encolhendo. Abaixe a carga, mantenha os ombros longe das orelhas e pense em abrir os braços para os lados, não em juntar as escápulas.",
      },
    ],
    content: `<img src="/blog-images/crucifixo-inverso-capa.webp" alt="Capa: Crucifixo inverso. Como fazer e erros comuns. Ilustração de pessoa inclinada abrindo os braços com halteres" title="Crucifixo Inverso — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>crucifixo inverso</strong> é o exercício que treina a parte de trás do ombro, o deltoide posterior. É o oposto do crucifixo do peito: em vez de fechar os braços à frente, você abre os braços para trás. É pequeno, leve e fácil de fazer errado, e é justamente por isso que muita gente sente nas costas e nada no ombro.</p>
<p>Na academia ele aparece com vários nomes: <strong>crucifixo invertido</strong>, <strong>voador invertido</strong>, <strong>fly inverso</strong>, <strong>peck deck invertido</strong> e <strong>crucifixo dorsal</strong>. É tudo o mesmo movimento, só muda o equipamento.</p>

<h2>Para que serve o crucifixo inverso?</h2>
<p>Serve para treinar a parte do ombro que os exercícios de empurrar quase não alcançam. Supino, desenvolvimento e flexão trabalham bastante a frente do ombro; a parte de trás fica com pouco estímulo se ninguém olha para ela. O crucifixo inverso é o jeito mais direto de dar trabalho a esse músculo, e é por isso que costuma entrar no treino de ombro ou de costas.</p>
<p>Muita gente procura o exercício para melhorar a postura. Ele fortalece músculos que seguram os ombros e as escápulas, mas postura depende também da rotina, de quanto tempo você passa sentado e de outros exercícios. Tratar o crucifixo inverso como correção de postura sozinho é esperar demais dele. Se esse é o seu objetivo, veja <a href="/blog/exercicios-para-melhorar-a-postura">exercícios para melhorar a postura</a>.</p>

<h2>O que o crucifixo inverso trabalha?</h2>
<p>O músculo principal é o <strong>deltoide posterior</strong>. O ombro tem três partes: a da frente trabalha em todo supino e desenvolvimento, a lateral trabalha na elevação lateral, e a de trás quase não aparece em exercício de empurrar. Sem um exercício próprio, ela costuma ficar para trás.</p>
<p>O trapézio do meio das costas e os romboides ajudam a segurar as escápulas no fim do movimento. Eles participam, mas não são o alvo. Se o exercício "sobe" para o trapézio, a execução está errada, não o músculo.</p>
<p><strong>É ombro ou costas?</strong> É ombro. As costas trabalham como apoio. Por isso ele cabe tanto no dia de ombro quanto no de costas, mas o músculo que você quer cansar é o de trás do ombro.</p>
<p>A dúvida que costuma vir junto é: crucifixo inverso ou face pull? Os dois treinam o posterior, de jeitos diferentes. O comparador abaixo mostra o que muda entre eles.</p>

<h2>Como fazer o crucifixo inverso com halteres</h2>
<ol>
<li><strong>Posição.</strong> Em pé, pés na largura do quadril, joelhos levemente dobrados. Incline o tronco à frente, dobrando no quadril, até ficar quase paralelo ao chão. Coluna reta.</li>
<li><strong>Braços.</strong> Halteres pendurados abaixo do peito, palmas viradas uma para a outra, cotovelos levemente dobrados. Esse ângulo do cotovelo fica igual o exercício inteiro.</li>
<li><strong>Subida.</strong> Abra os braços para os lados, em arco, até a linha do ombro. Pense em levar os halteres para longe, para os lados, e não para trás das costas.</li>
<li><strong>Descida.</strong> Volte devagar, controlando o peso, até os braços quase se encontrarem embaixo.</li>
</ol>
<h3>Variações com halteres</h3>
<ul>
<li><strong>Em pé, inclinado.</strong> A versão do passo a passo acima. Pede mais da lombar para segurar o tronco parado.</li>
<li><strong>Sentado na ponta do banco.</strong> Sente, incline o tronco sobre as coxas e abra os braços. Tira a lombar da jogada e dificulta o balanço do corpo.</li>
<li><strong>Deitado de bruços no banco inclinado.</strong> Peito e barriga apoiados num banco a uns 30 graus. É a melhor opção para quem sente a lombar inclinado ou não consegue parar de balançar.</li>
<li><strong>Unilateral.</strong> Um braço de cada vez, com a outra mão apoiada no banco. Ajuda a perceber se um lado está mais fraco e a concentrar no ombro que trabalha.</li>
</ul>
<p><strong>Pegada neutra ou pronada?</strong> Com as palmas viradas uma para a outra (neutra), o movimento fica mais confortável para a maioria. Com as palmas para trás (pronada), muita gente sente mais a parte de trás do ombro. As duas funcionam; use a que deixa você abrir os braços sem encolher o ombro.</p>

<h2>Crucifixo inverso na máquina (voador inverso)</h2>
<p>Na máquina do voador (também chamada de peck deck ou crucifixo dorsal), sente de frente para o encosto, com o peito apoiado. É a versão mais fácil de aprender: a máquina guia o caminho e o encosto segura o tronco.</p>
<ol>
<li><strong>Ajuste o banco.</strong> As alças precisam ficar na linha dos ombros. Muito baixas, o exercício vira remada; muito altas, o ombro sobe.</li>
<li><strong>Ajuste o início.</strong> Os braços começam quase juntos à frente, com o peso fora da pilha. Muitas máquinas têm uma alavanca ou pino para isso.</li>
<li><strong>Escolha a pegada.</strong> Alças verticais (pegada neutra) ou horizontais (pegada pronada), conforme a máquina. A lógica é a mesma dos halteres.</li>
<li><strong>Abra os braços.</strong> Leve as alças para os lados e para trás até a linha do corpo, puxando com os cotovelos e sem mudar o ângulo deles. Volte devagar, sem deixar o peso bater.</li>
</ol>
<p>Dá para fazer com um braço só, sentado de lado para o encosto ou de frente, segurando uma alça. Funciona bem para quem sente diferença entre os lados.</p>

<h2>Crucifixo inverso na polia</h2>
<p>No cross, com as polias na altura do ombro, cruze os cabos: a mão direita segura o cabo da esquerda, e a esquerda o da direita. Dê um passo para trás e abra os braços para os lados. A polia mantém a tensão no começo do movimento, onde o halter quase não pesa.</p>
<p>Com a polia alta, um pouco acima da cabeça, o movimento puxa para trás e para baixo e costuma ficar mais confortável para quem sente o ombro na versão reta. A versão unilateral, com um cabo só, deixa você ajustar o caminho do braço e concentrar no lado que trabalha.</p>

<h2>Halteres, máquina ou polia: qual escolher?</h2>
<ul>
<li><strong>Máquina:</strong> para aprender e para quem ainda balança o tronco. O encosto não deixa roubar.</li>
<li><strong>Halteres:</strong> para quem treina em casa ou quer variar a posição (em pé, sentado, no banco).</li>
<li><strong>Polia:</strong> para manter tensão do começo ao fim e ajustar a altura do cabo.</li>
</ul>
<p>Nenhuma é melhor para todo mundo. A melhor é a que você consegue fazer sentindo a parte de trás do ombro, sem encolher e sem balançar, e repetir semana após semana colocando um pouco mais de carga ou repetição.</p>

<h2>Os erros mais comuns</h2>
<ul>
<li><strong>Carga alta demais.</strong> O deltoide posterior é pequeno. Com peso demais, o corpo puxa com as costas, balança o tronco e encolhe os ombros. Comece leve.</li>
<li><strong>Ombro subindo para a orelha.</strong> Aí quem trabalha é o trapézio de cima. Mantenha o ombro baixo, longe da orelha.</li>
<li><strong>Juntar as escápulas no fim.</strong> Um pouco é natural, mas transformar o exercício numa "remada de escápula" tira o ombro. Pense em abrir os braços, não em espremer as costas.</li>
<li><strong>Abrir demais os braços.</strong> Levar os braços muito além da linha do corpo passa o trabalho para as escápulas e força a frente do ombro. Pare quando os braços chegam à linha do tronco.</li>
<li><strong>Dobrar e esticar o cotovelo.</strong> Se o cotovelo dobra na subida, vira remada. Ele fica levemente dobrado e parado.</li>
<li><strong>Subir rápido e soltar o peso.</strong> A descida controlada também conta. Se precisa de impulso para subir, a carga está alta.</li>
</ul>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>2 a 4 séries de 10 a 20 repetições</strong> funcionam bem, parando a 1 ou 2 repetições da falha. Repetições mais altas combinam com um músculo pequeno, que perde a técnica rápido com carga alta. O que vale para qualquer exercício está em <a href="/blog/quantas-repeticoes-para-hipertrofia">quantas repetições para hipertrofia</a> e <a href="/blog/quantas-series-para-hipertrofia">quantas séries para hipertrofia</a>.</p>
<p>Ele cabe no fim do treino de ombro ou de costas. Em quem treina com divisão por grupos, encaixa bem depois da remada, quando o ombro já está aquecido.</p>

<h2>O que substitui o crucifixo inverso?</h2>
<p>Se a máquina está ocupada, o ombro não se dá bem com uma versão ou você quer variar, estas opções treinam o mesmo músculo:</p>
<ul>
<li><strong>Outra versão do próprio crucifixo inverso.</strong> Máquina ocupada? Faça com halteres ou na polia. É a troca mais simples, porque o movimento é o mesmo.</li>
<li><strong><a href="/blog/face-pull">Face pull</a>.</strong> Na polia, com corda, puxando em direção ao rosto. Trabalha a parte de trás do ombro junto com o trapézio do meio e a rotação do ombro.</li>
<li><strong>Remada com pegada aberta e cotovelos altos.</strong> Com os cotovelos na altura dos ombros, a remada passa a pegar mais a parte de trás do ombro. Ela trabalha mais as costas que o crucifixo, então é um substituto parcial.</li>
<li><strong>Abertura de braços com elástico.</strong> Elástico esticado à frente, na altura do peito, e você abre os braços para os lados. Boa para casa e para aquecer o ombro antes do treino.</li>
</ul>

<h2>Crucifixo inverso em casa</h2>
<p>Com halteres, galões ou garrafas de água, a execução é a mesma: inclinado à frente ou de bruços na cama ou num banco. Com elástico, prenda na altura do peito, segure uma ponta em cada mão e abra os braços para trás. O elástico pesa mais no fim, onde o halter pesa mais também, então funciona bem.</p>

<h2>Não se compare</h2>
<p>Tem gente que faz crucifixo inverso com halter de 10 kg e gente que começa com 2 kg. O posterior de ombro varia muito de pessoa para pessoa, e quase todo mundo começa mais fraco nele do que imagina. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é a sua última série: mais uma repetição ou um pouco mais de carga, com a mesma execução.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/treino-de-ombros-hipertrofia">Treino de ombros para hipertrofia</a></li>
<li><a href="/blog/face-pull">Face pull: como fazer</a></li>
<li><a href="/blog/como-fazer-elevacao-lateral">Como fazer elevação lateral</a></li>
<li><a href="/blog/exercicios-para-melhorar-a-postura">Exercícios para melhorar a postura</a></li>
<li><a href="/blog/como-fazer-crucifixo-halteres">Como fazer crucifixo com halteres (peito)</a></li>
<li><a href="/blog/dor-no-ombro-ao-treinar">Dor no ombro ao treinar</a></li>
</ul>`,
  },
];
