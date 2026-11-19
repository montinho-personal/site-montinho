import type { BlogPost } from "./blog";

/**
 * Rosca alternada, remada cavalinho e desenvolvimento Arnold (15/11/2026).
 * Exercícios com muita busca e sem página no site, pelo Planejador de
 * Palavras-chave do Google Ads (Brasil): "rosca alternada" 74.000/mês,
 * "remada cavalinho" 49.500, "desenvolvimento arnold" 40.500.
 *
 * Antes deles, a primeira escolha foi cadeira abdutora e tríceps francês,
 * mas os dois já têm artigo (como-fazer-abducao-quadril-maquina e
 * como-fazer-french-press): o slug não tem a palavra da busca. Por isso a
 * checagem de canibalização agora passa pelo mapa de treino
 * (lib/treino/mapa.ts), que liga cada exercício ao artigo dele.
 *
 * Publicados a pedido do Montinho ANTES dos prints; título, H2 e FAQ serão
 * revistos com a pesquisa.
 *
 * Sem número de estudo: texto de execução e de escolha de variação. Os
 * músculos seguem o cadastro do próprio site (lib/treino/exercicios.ts).
 *
 * Ferramenta: o Comparador de Exercícios embutido em cada um, com a dúvida
 * que sobra a quem escolhe o exercício:
 *   - rosca alternada x rosca direta;
 *   - remada cavalinho x remada curvada com barra;
 *   - desenvolvimento Arnold x desenvolvimento com halteres.
 * Os ids do exercício passam a apontar para estes artigos no mapa de treino.
 */

const NAO_SE_COMPARE = (exercicio: string, regua: string) => `<h2>Não se compare</h2>
<p>Na ${exercicio}, a carga de quem está ao lado não diz nada sobre você. Cada um tem a própria genética, rotina e história, com altos e baixos, e muita carga alta na academia vem acompanhada de execução roubada. ${regua} O que dá resultado é um jeito de treinar que você consiga manter por anos, com aderência e progressão.</p>`;

export const ROSCA_CAVALINHO_ARNOLD_POSTS: BlogPost[] = [
  {
    slug: "rosca-alternada",
    title: "Rosca Alternada: Como Fazer, Músculos e Erros Comuns",
    metaTitle: "Rosca Alternada: Como Fazer com Halteres e Erros Comuns",
    metaDescription:
      "Rosca alternada é a rosca com halteres, um braço de cada vez. Veja como fazer em pé e sentado, quando girar o punho e os erros que tiram carga do bíceps.",
    excerpt:
      "Para que serve a rosca alternada, quais músculos trabalha, como fazer em pé, sentado e no banco inclinado, com ou sem giro do punho, os erros mais comuns e quando ela vale mais que a rosca direta.",
    category: "Treino",
    date: "2026-11-15",
    updatedAt: "2026-11-19",
    readTime: "7 min",
    author: "Montinho",
    tags: ["rosca alternada", "bíceps", "halteres", "braço", "exercícios"],
    faq: [
      {
        question: "Rosca alternada trabalha qual músculo?",
        answer:
          "O principal é o bíceps, na frente do braço. O braquial, que fica embaixo dele, e o braquiorradial, no antebraço, ajudam a dobrar o cotovelo. Os músculos do antebraço também seguram o halter.",
      },
      {
        question: "Como fazer a rosca alternada?",
        answer:
          "Em pé, um halter em cada mão, braços estendidos ao lado do corpo. Suba um halter dobrando o cotovelo, sem levar o cotovelo para a frente, e desça devagar até o braço estender. Só depois suba o outro.",
      },
      {
        question: "Precisa girar o punho na rosca alternada?",
        answer:
          "Não é obrigatório. Muita gente começa com a palma virada para o corpo e gira até a palma ficar para cima durante a subida. Esse giro também é função do bíceps, então ele participa mais. Fazer com a palma para cima o tempo todo também funciona.",
      },
      {
        question: "Rosca alternada ou rosca direta: qual é melhor?",
        answer:
          "As duas trabalham o mesmo músculo. A rosca direta, com barra, deixa usar mais carga no total. A alternada, com halteres, deixa cada braço trabalhar sozinho, permite o giro do punho e incomoda menos o punho de quem sente a barra reta. As duas cabem num treino.",
      },
      {
        question: "Rosca alternada em pé ou sentado?",
        answer:
          "Sentado, com as costas apoiadas, fica mais difícil balançar o corpo, e o bíceps faz mais o trabalho. Em pé dá para usar um pouco mais de carga, mas é mais fácil roubar com o tronco. Para quem está aprendendo, sentado costuma ser melhor.",
      },
      {
        question: "Quantas séries e repetições fazer na rosca alternada?",
        answer:
          "Para a maioria das pessoas, de 2 a 4 séries de 8 a 15 repetições com cada braço, parando a 1 ou 2 repetições da falha. Conte as repetições por braço, não a soma dos dois.",
      },
      {
        question: "Dá para fazer rosca alternada na polia ou na máquina?",
        answer:
          "Dá. Na polia baixa, com uma alça em cada mão ou um braço de cada vez, o cabo puxa o tempo todo, inclusive no alto do movimento, onde o halter quase não pesa. Na máquina de rosca com braços independentes, o banco e o apoio seguram o corpo, o que ajuda quem rouba com o tronco. A execução é a mesma: cotovelo parado, subida firme e descida controlada.",
      },
      {
        question: "Rosca alternada é diferente da rosca martelo?",
        answer:
          "É. Na rosca martelo a palma fica virada para o corpo o tempo todo, como quem segura um martelo, e o braquial e o antebraço trabalham mais. Na alternada a palma fica para cima no fim da subida, e o bíceps trabalha mais.",
      },
      {
        question: "Dá para fazer rosca alternada com os dois braços juntos?",
        answer:
          "Dá, e aí ela vira a rosca simultânea com halteres. O treino é parecido. Alternar tem a vantagem de deixar a atenção num braço de cada vez e dar um pequeno descanso ao outro.",
      },
    ],
    content: `<img src="/blog-images/rosca-alternada-capa.webp" alt="Capa: Rosca alternada. Como fazer com halteres. Ilustração de dois halteres em alturas diferentes" title="Rosca Alternada — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>A <strong>rosca alternada</strong> é a rosca para bíceps feita com halteres, um braço de cada vez: sobe um, desce, sobe o outro. Está em quase toda ficha de treino de braço, e é um dos exercícios em que mais se vê carga alta com o corpo inteiro balançando.</p>

<h2>Para que serve a rosca alternada e qual músculo ela trabalha?</h2>
<p>Ela serve para treinar os músculos que dobram o cotovelo. O principal é o <strong>bíceps</strong>, na frente do braço. Ajudam:</p>
<ul>
<li>o <strong>braquial</strong>, que fica embaixo do bíceps;</li>
<li>o <strong>braquiorradial</strong>, no antebraço, perto do cotovelo;</li>
<li>os músculos do <strong>antebraço</strong>, que seguram o halter.</li>
</ul>
<p>O bíceps também gira o antebraço, levando a palma para cima. Por isso a rosca alternada com giro do punho, que você vai ver abaixo, faz o bíceps participar de duas funções no mesmo movimento.</p>
<p>A dúvida que costuma vir junto é: rosca alternada ou rosca direta? O comparador abaixo mostra o que muda entre elas.</p>

<h2>Como fazer a rosca alternada, passo a passo</h2>
<ol>
<li><strong>Posição.</strong> Em pé, pés na largura do quadril, joelhos levemente soltos. Um halter em cada mão, braços estendidos ao lado do corpo.</li>
<li><strong>Subida.</strong> Dobre um cotovelo e leve o halter em direção ao ombro. O cotovelo fica parado ao lado do corpo, sem ir para a frente.</li>
<li><strong>Topo.</strong> Pare quando o antebraço estiver quase vertical. Daí para cima o bíceps descansa.</li>
<li><strong>Descida.</strong> Desça devagar até o braço estender quase por completo. A descida também é treino; deixar o halter cair desperdiça metade da repetição.</li>
<li><strong>Troca.</strong> Só depois que o primeiro braço desceu, suba o outro.</li>
</ol>

<h2>Com giro do punho ou com a palma para cima?</h2>
<p>As duas formas funcionam.</p>
<ul>
<li><strong>Com giro (supinação):</strong> começa com a palma virada para a coxa e vai girando até a palma ficar para cima durante a subida. O bíceps trabalha mais, porque girar o antebraço também é função dele.</li>
<li><strong>Com a palma para cima o tempo todo:</strong> mais simples de aprender, e o bíceps trabalha do começo ao fim.</li>
</ul>
<p>Se o punho ou o cotovelo incomodam em uma delas, use a outra. Com a palma virada para o corpo o tempo todo, o exercício vira a <a href="/blog/como-fazer-rosca-martelo">rosca martelo</a>, que puxa mais o braquial e o antebraço.</p>

<h2>Em pé, sentado ou no banco inclinado?</h2>
<ul>
<li><strong>Em pé:</strong> dá para usar um pouco mais de carga, e é mais fácil roubar com o tronco.</li>
<li><strong>Sentado, com as costas apoiadas:</strong> o corpo para, e o bíceps faz o trabalho. É a melhor opção para aprender ou para quem balança demais em pé.</li>
<li><strong>No banco inclinado:</strong> deitado com o encosto a cerca de 45 graus, os braços ficam atrás do corpo, e o bíceps começa o movimento mais alongado. A carga cai, e vale como variação.</li>
</ul>

<h2>Na polia ou na máquina</h2>
<p>A rosca alternada não precisa ser só com halteres:</p>
<ul>
<li><strong>Na polia baixa:</strong> com uma alça em cada mão, ou um braço de cada vez, o cabo mantém o bíceps trabalhando também no alto do movimento, onde o halter quase não pesa. Fique de frente para a polia, a um passo dela, com os cotovelos ao lado do corpo.</li>
<li><strong>Na máquina de rosca com braços independentes:</strong> o banco e o apoio dos braços seguram o corpo. É uma boa opção para quem balança o tronco no halter ou está aprendendo o movimento.</li>
</ul>
<p>Em qualquer versão, a regra é a mesma do halter: cotovelo parado, subida firme e descida controlada. Se a polia ou a máquina estiver ocupada, o <a href="/ferramentas/substituidor-de-exercicios">substituidor de exercícios</a> mostra outras opções para o bíceps.</p>

<h2>Os erros mais comuns</h2>
<ul>
<li><strong>Balançar o tronco.</strong> Se as costas jogam o halter para cima, a carga está alta. Abaixe o peso até o corpo ficar parado.</li>
<li><strong>Levar o cotovelo para a frente.</strong> Quando o cotovelo sobe junto, o ombro entra no movimento e o bíceps descansa.</li>
<li><strong>Descer rápido.</strong> A descida controlada é metade do trabalho.</li>
<li><strong>Encurtar o movimento.</strong> Parar no meio da descida e subir de novo deixa a parte mais difícil de fora.</li>
<li><strong>Alternar tão rápido que os dois braços se movem juntos.</strong> Termine um braço antes de começar o outro.</li>
</ul>

<h2>Rosca alternada ou rosca direta?</h2>
<p>As duas trabalham o mesmo músculo. A diferença está no equipamento:</p>
<ul>
<li>A <a href="/blog/como-fazer-rosca-direta">rosca direta</a>, com barra, deixa usar mais carga somando os dois braços.</li>
<li>A alternada deixa cada braço trabalhar sozinho, o que mostra se um lado é mais fraco, e permite o giro do punho. Também costuma incomodar menos quem sente o punho na barra reta.</li>
</ul>
<p>Não precisa escolher uma para sempre: muita gente faz uma no começo do treino de braço e a outra em outra semana ou em outro dia. A comparação completa, com a rosca martelo, está em <a href="/blog/rosca-direta-vs-rosca-martelo">rosca direta vs rosca martelo</a>.</p>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>2 a 4 séries de 8 a 15 repetições com cada braço</strong>, parando a 1 ou 2 repetições da falha. Conte por braço: 10 repetições são 10 de cada lado, não 5 e 5. Quando completar o topo da faixa com boa execução, suba o halter na próxima sessão (<a href="/blog/progressao-de-carga">progressão de carga</a>).</p>
<p>Ela encaixa no treino de braço ou no fim do treino de costas, já que as puxadas também usam o bíceps. Mais ideias em <a href="/blog/treino-de-biceps">treino de bíceps</a>.</p>

<div class="yt-embed">
<p class="yt-caption">Não sentiu o bíceps queimar na rosca? Em menos de um minuto, por que execução, esforço e carga subindo contam mais do que o pump.</p>
<div class="yt-wrapper yt-wrapper--vertical"><iframe src="https://www.youtube.com/embed/xb1sP6z01-s?rel=0" title="Não sentiu o músculo? Pump não é sinônimo de hipertrofia — Montinho Personal Trainer" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
</div>

${NAO_SE_COMPARE("rosca alternada", "A sua régua é o seu próprio braço: o mesmo halter subindo com o corpo parado, ou uma repetição a mais que na semana passada.")}

<h2>Leia também</h2>
<ul>
<li><a href="/blog/como-fazer-rosca-direta">Rosca direta: como fazer</a></li>
<li><a href="/blog/como-fazer-rosca-martelo">Rosca martelo: como fazer</a></li>
<li><a href="/blog/rosca-scott">Rosca Scott</a></li>
<li><a href="/blog/como-fazer-rosca-concentrada">Rosca concentrada</a></li>
<li><a href="/blog/treino-de-biceps">Treino de bíceps</a></li>
</ul>`,
  },
  {
    slug: "remada-cavalinho",
    title: "Remada Cavalinho: Como Fazer, Músculos e Erros Comuns",
    metaTitle: "Remada Cavalinho: Como Fazer na Barra T e Erros Comuns",
    metaDescription:
      "Remada cavalinho é a remada na barra presa no chão ou na máquina com apoio no peito. Veja a pegada, a posição das costas e os erros que levam a dor lombar.",
    excerpt:
      "Para que serve a remada cavalinho, quais músculos trabalha, como fazer na barra T livre, com o triângulo e na máquina com apoio no peito, os erros mais comuns e a diferença para a remada curvada.",
    category: "Treino",
    date: "2026-11-15",
    readTime: "8 min",
    author: "Montinho",
    tags: ["remada cavalinho", "barra T", "costas", "remada", "exercícios"],
    faq: [
      {
        question: "Remada cavalinho trabalha qual músculo?",
        answer:
          "O principal são as costas, com o latíssimo e os músculos do meio das costas. O trapézio ajuda a aproximar as escápulas, e o bíceps participa porque o cotovelo dobra. A lombar e o quadril trabalham para segurar o tronco inclinado na versão sem apoio no peito.",
      },
      {
        question: "Por que se chama remada cavalinho?",
        answer:
          "Porque, na versão livre, a pessoa fica com a barra entre as pernas, como quem monta num cavalo. Em inglês, o exercício é chamado de T-bar row, por causa do formato da barra.",
      },
      {
        question: "Como fazer a remada cavalinho?",
        answer:
          "Com a barra entre as pernas, dobre os joelhos e incline o tronco à frente com as costas retas. Segure o pegador, puxe a barra em direção ao abdômen levando os cotovelos para trás e desça devagar, sem arredondar as costas.",
      },
      {
        question: "Remada cavalinho ou remada curvada com barra?",
        answer:
          "As duas trabalham as costas com o tronco inclinado. Na cavalinho a barra sobe por um caminho fixo e o pegador deixa as mãos mais perto, o que costuma facilitar manter a postura. A curvada com barra exige mais equilíbrio e mais da lombar. Uma das duas num treino já basta.",
      },
      {
        question: "Remada cavalinho com pegada aberta ou fechada?",
        answer:
          "Com o triângulo, pegada fechada e neutra, os cotovelos ficam perto do corpo e o latíssimo trabalha mais. Com pegada aberta, os cotovelos se afastam e o meio das costas e a parte de trás do ombro participam mais. As duas funcionam.",
      },
      {
        question: "A remada cavalinho com apoio no peito é melhor?",
        answer:
          "É melhor para quem sente a lombar ou não consegue manter as costas retas inclinado. O peito apoiado tira a lombar do esforço e o corpo não ajuda a puxar. A versão livre treina também a sustentação do tronco.",
      },
      {
        question: "Remada cavalinho dá dor lombar?",
        answer:
          "Pode dar quando as costas arredondam ou quando o tronco sobe e desce para ajudar a puxar. Abaixar a carga, encurtar a distância da inclinação ou trocar pela versão com apoio no peito costuma resolver. Dor que não passa precisa de avaliação.",
      },
      {
        question: "Quantas séries e repetições fazer na remada cavalinho?",
        answer:
          "Para a maioria das pessoas, de 3 a 4 séries de 6 a 12 repetições, parando a 1 ou 2 repetições da falha. A carga é a que você puxa sem mudar a posição das costas.",
      },
    ],
    content: `<img src="/blog-images/remada-cavalinho-capa.webp" alt="Capa: Remada cavalinho. Como fazer na barra T. Ilustração da barra presa no chão com o pegador em V" title="Remada Cavalinho — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>A <strong>remada cavalinho</strong> é a remada feita com uma barra presa no chão por uma ponta e carregada na outra, com a pessoa de pé sobre ela, como quem monta num cavalo. Em inglês, é a <em>T-bar row</em>. Muitas academias têm também a versão na máquina, com o peito apoiado num banco.</p>

<h2>Para que serve a remada cavalinho e qual músculo ela trabalha?</h2>
<p>Ela treina as <strong>costas</strong>: o latíssimo, que dá largura, e os músculos do meio das costas, que dão espessura. Ajudam:</p>
<ul>
<li>o <strong>trapézio</strong>, que aproxima as escápulas no fim da puxada;</li>
<li>o <strong>bíceps</strong>, porque o cotovelo dobra;</li>
<li>a <strong>lombar</strong> e o <strong>quadril</strong>, que seguram o tronco inclinado na versão sem apoio no peito.</li>
</ul>
<p>A dúvida que costuma vir junto é: remada cavalinho ou remada curvada com barra? O comparador abaixo mostra o que muda entre elas.</p>

<h2>Barra T livre, máquina com apoio no peito ou barra no canto?</h2>
<ul>
<li><strong>Barra T livre:</strong> a ponta da barra fica presa num suporte no chão (ou encaixada no canto da parede, com uma anilha protegendo). Você fica de pé com a barra entre as pernas e encaixa um pegador em V, o triângulo, logo abaixo das anilhas.</li>
<li><strong>Máquina com apoio no peito:</strong> você deita de bruços num banco inclinado e puxa as alças. A lombar sai do esforço e o corpo não consegue ajudar.</li>
<li><strong>Máquina sem apoio:</strong> algumas máquinas têm plataforma para os pés e alças fixas, com o mesmo movimento da barra livre.</li>
</ul>

<h2>Como fazer a remada cavalinho na barra T, passo a passo</h2>
<ol>
<li><strong>Posição.</strong> Pés afastados, um de cada lado da barra, perto das anilhas. Dobre os joelhos e incline o tronco à frente, levando o quadril para trás, até ficar entre 30 e 45 graus em relação ao chão.</li>
<li><strong>Costas.</strong> Costas retas, do quadril até a cabeça, com o olhar no chão um pouco à frente. É essa posição que tem de durar a série inteira.</li>
<li><strong>Pegada.</strong> Segure o triângulo com as palmas viradas uma para a outra. Comece com os braços estendidos e as anilhas fora do chão.</li>
<li><strong>Puxada.</strong> Puxe a barra em direção ao abdômen, levando os cotovelos para trás e perto do corpo. No fim, aproxime as escápulas.</li>
<li><strong>Descida.</strong> Desça devagar até os braços estenderem, sem deixar as anilhas baterem no chão e sem o tronco subir.</li>
</ol>

<h2>Pegada aberta ou fechada?</h2>
<ul>
<li><strong>Fechada e neutra (triângulo):</strong> os cotovelos passam perto do corpo, e o latíssimo trabalha mais. É a forma mais comum.</li>
<li><strong>Aberta (barra ou alças largas):</strong> os cotovelos se afastam, e o meio das costas e a parte de trás do ombro participam mais.</li>
</ul>
<p>As duas funcionam. Dá para alternar ao longo das semanas.</p>

<h2>Os erros mais comuns</h2>
<ul>
<li><strong>Arredondar as costas.</strong> É o erro que mais leva a <a href="/blog/dor-lombar-na-musculacao">dor lombar</a>. Se a coluna curva para puxar, a carga está alta.</li>
<li><strong>Subir o tronco a cada repetição.</strong> Quando o tronco levanta para ajudar, o quadril e a lombar fazem o trabalho das costas.</li>
<li><strong>Carga alta demais.</strong> Anilhas grandes deixam o movimento curto, porque batem no peito antes da hora. Anilhas menores permitem puxar mais longe.</li>
<li><strong>Puxar só com os braços.</strong> Pense em levar os cotovelos para trás, não em trazer as mãos para o corpo.</li>
<li><strong>Encolher os ombros.</strong> Aí trabalha o trapézio de cima. Mantenha os ombros longe das orelhas.</li>
</ul>

<h2>Remada cavalinho ou remada curvada com barra?</h2>
<p>As duas trabalham as costas com o tronco inclinado. Na cavalinho, a barra sobe por um caminho fixo e as mãos ficam mais juntas, o que costuma facilitar manter a postura e usar carga. A <a href="/blog/como-fazer-remada-curvada-tecnica">remada curvada com barra</a> exige mais equilíbrio e mais da lombar. Uma das duas num treino já basta.</p>
<p>Se a lombar incomoda nas duas, as opções são a cavalinho com apoio no peito, a <a href="/blog/como-fazer-remada-baixa">remada baixa</a> sentada ou a <a href="/blog/como-fazer-remada-unilateral">remada unilateral</a> com a mão apoiada no banco.</p>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>3 a 4 séries de 6 a 12 repetições</strong>, parando a 1 ou 2 repetições da falha. A carga certa é a que você puxa sem mudar a posição das costas. Quando completar o topo da faixa assim, acrescente um pouco de peso (<a href="/blog/progressao-de-carga">progressão de carga</a>).</p>
<p>Ela costuma entrar no começo ou no meio do treino de costas. Veja como montar o resto em <a href="/blog/treino-de-costas-hipertrofia">treino de costas para hipertrofia</a>.</p>

<div class="yt-embed">
<p class="yt-caption">Barra T ocupada ou sem o triângulo? Veja como achar um substituto para a remada em 3 passos.</p>
<div class="yt-wrapper yt-wrapper--vertical"><iframe src="https://www.youtube.com/embed/Mck7dwGz0as?rel=0" title="O aparelho está ocupado? Descubra o que fazer no lugar em 3 passos — Montinho Personal Trainer" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
</div>

${NAO_SE_COMPARE("remada cavalinho", "A sua régua é a sua postura: as mesmas costas retas da primeira à última repetição, com um pouco mais de carga ou uma repetição a mais que na semana passada.")}

<h2>Leia também</h2>
<ul>
<li><a href="/blog/como-fazer-remada-curvada-tecnica">Remada curvada: técnica</a></li>
<li><a href="/blog/como-fazer-remada-baixa">Remada baixa: como fazer</a></li>
<li><a href="/blog/como-fazer-remada-unilateral">Remada unilateral</a></li>
<li><a href="/blog/puxada-vs-remada">Puxada ou remada?</a></li>
<li><a href="/blog/treino-de-costas-hipertrofia">Treino de costas para hipertrofia</a></li>
</ul>`,
  },
  {
    slug: "desenvolvimento-arnold",
    title: "Desenvolvimento Arnold: Como Fazer, Músculos e Erros Comuns",
    metaTitle: "Desenvolvimento Arnold: Como Fazer o Arnold Press",
    metaDescription:
      "Desenvolvimento Arnold é o desenvolvimento com halteres que gira as palmas na subida. Veja como fazer o giro, o que muda no ombro e quem deve evitar.",
    excerpt:
      "Para que serve o desenvolvimento Arnold, quais músculos trabalha, como fazer o giro sentado ou em pé, os erros mais comuns, a diferença para o desenvolvimento com halteres e quem deve evitar.",
    category: "Treino",
    date: "2026-11-15",
    readTime: "7 min",
    author: "Montinho",
    tags: ["desenvolvimento arnold", "arnold press", "ombro", "halteres", "exercícios"],
    faq: [
      {
        question: "Desenvolvimento Arnold trabalha qual músculo?",
        answer:
          "O principal é a parte da frente do ombro, o deltoide anterior. A lateral do ombro e o tríceps ajudam. O giro faz o ombro passar por uma faixa maior de movimento que no desenvolvimento comum.",
      },
      {
        question: "Como fazer o desenvolvimento Arnold?",
        answer:
          "Sentado, com os halteres na altura do queixo e as palmas viradas para você, cotovelos à frente. Na subida, abra os cotovelos para os lados e gire os halteres até as palmas ficarem para a frente, terminando com os braços estendidos acima da cabeça. Desça fazendo o caminho inverso.",
      },
      {
        question: "Por que se chama desenvolvimento Arnold?",
        answer:
          "O exercício leva o nome de Arnold Schwarzenegger, a quem é atribuído. Em inglês, é o Arnold press.",
      },
      {
        question: "Desenvolvimento Arnold ou desenvolvimento com halteres?",
        answer:
          "Os dois trabalham a frente do ombro. O Arnold tem o giro, que aumenta o caminho do movimento e pede carga menor. O desenvolvimento com halteres comum permite mais carga e é mais simples. Um dos dois num treino já basta.",
      },
      {
        question: "Desenvolvimento Arnold é melhor que o normal?",
        answer:
          "Não é melhor nem pior: é uma variação. Para quem gosta e não sente o ombro, é uma boa forma de variar o treino. Para quem tem dor no ombro, o desenvolvimento comum, com os cotovelos um pouco à frente, costuma ser mais confortável.",
      },
      {
        question: "Quem deve evitar o desenvolvimento Arnold?",
        answer:
          "Quem sente dor no ombro ao girar o braço, quem tem síndrome do impacto ou lesão no manguito rotador ainda não resolvida. Nesses casos, vale escolher outra variação e conversar com quem acompanha o caso.",
      },
      {
        question: "Dá para fazer o desenvolvimento Arnold em pé?",
        answer:
          "Dá. Em pé, o abdômen e os glúteos trabalham para segurar o corpo, e é mais fácil arquear a lombar para empurrar. Sentado, com as costas apoiadas, o ombro faz mais o trabalho.",
      },
      {
        question: "Quantas séries e repetições fazer no desenvolvimento Arnold?",
        answer:
          "Para a maioria das pessoas, de 2 a 4 séries de 8 a 12 repetições, parando a 1 ou 2 repetições da falha. A carga costuma ser menor que no desenvolvimento comum, por causa do giro.",
      },
    ],
    content: `<img src="/blog-images/desenvolvimento-arnold-capa.webp" alt="Capa: Desenvolvimento Arnold. Como fazer o giro. Ilustração de dois halteres com setas de rotação" title="Desenvolvimento Arnold — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>desenvolvimento Arnold</strong> é o desenvolvimento de ombros com halteres que começa com as palmas viradas para você e termina com as palmas para a frente, girando os halteres durante a subida. Leva o nome de Arnold Schwarzenegger, a quem o exercício é atribuído. Em inglês, é o <em>Arnold press</em>.</p>

<h2>Para que serve o desenvolvimento Arnold e qual músculo ele trabalha?</h2>
<p>Ele treina o ombro empurrando o peso para cima. O músculo principal é o <strong>deltoide anterior</strong>, a parte da frente do ombro. Ajudam:</p>
<ul>
<li>o <strong>deltoide lateral</strong>, a lateral do ombro, que trabalha mais quando os cotovelos se abrem para os lados;</li>
<li>o <strong>tríceps</strong>, que estende o cotovelo no fim da subida.</li>
</ul>
<p>O giro faz o ombro sair de uma posição com os cotovelos à frente e terminar com eles abertos, um caminho maior que o do desenvolvimento comum. É por isso que a carga costuma ser menor.</p>
<p>A dúvida que costuma vir junto é: Arnold ou desenvolvimento com halteres comum? O comparador abaixo mostra o que muda entre eles.</p>

<h2>Como fazer o desenvolvimento Arnold, passo a passo</h2>
<ol>
<li><strong>Posição.</strong> Sentado num banco com encosto quase vertical, pés firmes no chão. Halteres na altura do queixo, palmas viradas para você, cotovelos à frente do corpo, como no topo de uma rosca.</li>
<li><strong>Abertura.</strong> Comece a subir abrindo os cotovelos para os lados. Ao mesmo tempo, gire os halteres para que as palmas fiquem viradas para a frente.</li>
<li><strong>Subida.</strong> Empurre até os braços estenderem acima da cabeça, sem bater um halter no outro. O giro termina antes ou junto com o fim da subida.</li>
<li><strong>Descida.</strong> Faça o caminho inverso, devagar: desce, fecha os cotovelos à frente e gira as palmas de volta para você.</li>
</ol>
<p>O giro é contínuo. Subir primeiro e girar só lá em cima, ou girar parado e depois subir, divide o exercício em dois movimentos e perde o que ele tem de diferente.</p>

<h2>Sentado ou em pé?</h2>
<ul>
<li><strong>Sentado, com as costas apoiadas:</strong> o corpo fica parado, e o ombro faz o trabalho. É a melhor opção para aprender.</li>
<li><strong>Em pé:</strong> o abdômen e os glúteos trabalham para segurar o corpo. É mais fácil arquear a lombar para empurrar; se isso acontecer, a carga está alta.</li>
</ul>

<h2>Os erros mais comuns</h2>
<ul>
<li><strong>Carga alta demais.</strong> O giro pede halteres mais leves que os do desenvolvimento comum. Comece leve e suba aos poucos.</li>
<li><strong>Arquear a lombar.</strong> Quando as costas desgrudam do encosto para ajudar, o peito entra no movimento.</li>
<li><strong>Descer rápido.</strong> A descida com o giro é a parte que mais exige controle do ombro.</li>
<li><strong>Encurtar o movimento.</strong> Parar com os halteres na altura das orelhas tira a parte de baixo, onde o giro acontece.</li>
<li><strong>Insistir com dor.</strong> Se o ombro incomoda no giro, troque de variação.</li>
</ul>

<h2>Arnold ou desenvolvimento com halteres?</h2>
<p>Os dois trabalham a frente do ombro. O Arnold tem o giro, que aumenta o caminho do movimento e pede carga menor. O <a href="/blog/como-fazer-desenvolvimento-ombros">desenvolvimento com halteres comum</a> permite mais carga e é mais simples de aprender. Não é questão de um ser melhor: um dos dois num treino já basta, e alternar ao longo das semanas funciona.</p>
<p>Para a lateral do ombro, que dá a aparência de ombro largo, o exercício principal continua sendo a <a href="/blog/como-fazer-elevacao-lateral">elevação lateral</a>.</p>

<h2>Quem deve evitar?</h2>
<p>Quem sente dor no ombro ao girar o braço, quem tem <a href="/blog/sindrome-do-impacto-no-ombro">síndrome do impacto</a> ou lesão no manguito rotador ainda não resolvida. O giro com os braços acima da cabeça é justamente a posição que mais incomoda nesses casos. O desenvolvimento comum, com os cotovelos um pouco à frente do corpo, costuma ser mais confortável. Veja também <a href="/blog/dor-no-ombro-ao-treinar">dor no ombro ao treinar</a>.</p>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>2 a 4 séries de 8 a 12 repetições</strong>, parando a 1 ou 2 repetições da falha. Quando completar o topo da faixa com o giro controlado, suba o halter na próxima sessão (<a href="/blog/progressao-de-carga">progressão de carga</a>). Ele costuma entrar no começo do treino de ombro; o resto da sessão está em <a href="/blog/treino-de-ombros-hipertrofia">treino de ombros para hipertrofia</a>.</p>

<div class="yt-embed">
<p class="yt-caption">O giro do Arnold é difícil de conferir no espelho. Veja como filmar a sua série para eu corrigir a execução.</p>
<div class="yt-wrapper yt-wrapper--vertical"><iframe src="https://www.youtube.com/embed/L5w4DBU2la8?rel=0" title="Como filmar o seu exercício para eu corrigir a execução — Montinho Personal Trainer" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
</div>

${NAO_SE_COMPARE("desenvolvimento Arnold", "A sua régua é o seu ombro: o mesmo giro controlado, sem dor, com um pouco mais de carga ou uma repetição a mais que na semana passada.")}

<h2>Leia também</h2>
<ul>
<li><a href="/blog/como-fazer-desenvolvimento-ombros">Desenvolvimento de ombros: como fazer</a></li>
<li><a href="/blog/como-fazer-elevacao-lateral">Elevação lateral</a></li>
<li><a href="/blog/como-fazer-elevacao-frontal">Elevação frontal</a></li>
<li><a href="/blog/treino-de-ombros-hipertrofia">Treino de ombros para hipertrofia</a></li>
<li><a href="/blog/dor-no-ombro-ao-treinar">Dor no ombro ao treinar</a></li>
</ul>`,
  },
];
