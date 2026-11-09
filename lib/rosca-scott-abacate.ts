import type { BlogPost } from "./blog";

/**
 * "Rosca Scott" e "Abacate engorda?" (09/11/2026). Planejador de
 * Palavras-chave do Google Ads (Brasil): "rosca scott" 74.000/mês; "abacate
 * engorda" 12.100. Publicados a pedido do Montinho ("criar próximos 2
 * artigos") ANTES dos prints; título, H2 e FAQ serão revistos com a pesquisa.
 *
 * Canibalização: o site tinha rosca direta, martelo e concentrada, mas não a
 * Scott (o exercício só existia no cadastro do mapa de treino). Abacate só
 * aparecia de passagem em listas de fruta e de fibra.
 *
 * Rosca Scott: sem número de estudo; execução e escolha de variação. Revista
 * em 09/11 com o export do Answer the Public, o PAA e os prints (para que
 * serve, qual cabeça, variações, substituto, sem banco, engrossa, origem do
 * nome). Larry Scott: fisiculturista que popularizou o exercício (Wikipédia e
 * Hipertrofia.org, citados na visão geral por IA; sem data no texto).
 * Ferramenta: Comparador (rosca Scott x rosca direta) e o id "rosca-scott"
 * do mapa de treino passa a apontar para o artigo.
 *
 * Abacate: TACO 4ª edição, pela base do site, abacate cru por 100 g: 96,2 kcal,
 * 8,4 g de gordura, 6,0 g de carboidrato, 6,3 g de fibra, 1,2 g de proteína,
 * 206 mg de potássio. Porções da POF 2008-2009 (IBGE): 1 colher de sopa = 45 g,
 * 1 fatia = 90 g, 1 unidade = 430 g. Contas: colher 43 kcal; fatia 87 kcal;
 * unidade 414 kcal. Azeite de oliva: 884 kcal/100 g, 1 colher de sopa = 8 g
 * (71 kcal). Açúcar refinado: 387 kcal/100 g; 10 g é exemplo nosso (39 kcal),
 * a base não tem medida caseira para ele. A TACO não tem avocado nem leite
 * integral com valor na base: sem número para os dois.
 * Abacate revisto em 09/11 com o export e os prints (meio abacate, 500 g,
 * banana ou abacate, açúcar/mel/leite condensado/leite em pó/aveia, vitamina
 * "quantos quilos", gravidez, barriga inchada). Fora: caroço e farinha do
 * caroço, remédios e cardápio para engordar, criança. Pesos de 10/20 g para
 * açúcar, mel, leite condensado e leite em pó são exemplo nosso.
 * Ferramenta: nenhuma embutida (TDEE, déficit, macros e cardápio no teto de 8);
 * ficha de alimento e calculadora de déficit por link.
 */

export const ROSCA_SCOTT_ABACATE_POSTS: BlogPost[] = [
  {
    slug: "rosca-scott",
    title: "Rosca Scott: Como Fazer, Músculos e Erros Comuns",
    metaTitle: "Rosca Scott: Como Fazer, Músculos e Erros Comuns",
    metaDescription:
      "Rosca Scott é a rosca feita com o braço apoiado no banco Scott, o que tira o balanço do corpo. Veja a regulagem do banco, até onde descer e os erros que machucam o cotovelo.",
    excerpt:
      "Para que serve a rosca Scott, qual músculo trabalha, como regular o banco, a execução passo a passo, as variações (halteres, polia, máquina articulada, unilateral, martelo) e o que substitui.",
    category: "Treino",
    date: "2026-11-09",
    readTime: "8 min",
    author: "Montinho",
    tags: ["rosca scott", "bíceps", "banco scott", "rosca", "exercícios"],
    faq: [
      {
        question: "Para que serve a rosca Scott?",
        answer:
          "Para treinar o bíceps sem a ajuda do corpo. Com o braço apoiado no banco inclinado, não dá para balançar o tronco nem empurrar com o ombro, e o esforço fica todo no braço.",
      },
      {
        question: "Rosca Scott trabalha qual músculo?",
        answer:
          "O bíceps, junto com o braquial, o músculo que fica por baixo dele e também dobra o cotovelo, e o braquiorradial, no antebraço. Com a pegada neutra (martelo), o braquial e o antebraço trabalham mais.",
      },
      {
        question: "A rosca Scott trabalha qual cabeça do bíceps?",
        answer:
          "As duas cabeças do bíceps trabalham em qualquer rosca. O que a Scott muda é a parte do movimento que pesa mais: com o braço na frente do corpo, o esforço é maior perto do braço esticado.",
      },
      {
        question: "Como fazer a rosca Scott?",
        answer:
          "Ajuste o assento para as axilas encostarem no topo do banco e a parte de trás do braço ficar apoiada. Segure a barra com as palmas para cima e suba dobrando só o cotovelo. Desça devagar até quase esticar, sem travar.",
      },
      {
        question: "Qual a diferença entre rosca direta e rosca Scott?",
        answer:
          "Na rosca direta você está em pé e pode usar mais carga, mas o corpo tende a ajudar. Na Scott o braço fica apoiado, o corpo não ajuda e o esforço pesa mais na parte de baixo do movimento. Os dois cabem no mesmo treino.",
      },
      {
        question: "A rosca Scott engrossa o braço?",
        answer:
          "Ela faz o bíceps crescer como qualquer rosca bem feita, com séries perto da falha e progressão de carga. O que engrossa o braço é o volume da semana somado ao tríceps, que é a maior parte do braço, e a alimentação.",
      },
      {
        question: "Qual exercício substitui a rosca Scott?",
        answer:
          "A rosca concentrada, com o cotovelo apoiado na coxa, é a mais parecida. Também servem a rosca no cabo com o braço apoiado, a rosca com o peito apoiado num banco inclinado e, em casa, a rosca com halter apoiando o braço no encosto de uma cadeira.",
      },
      {
        question: "Como fazer rosca Scott sem banco?",
        answer:
          "Apoie a parte de trás do braço por cima do encosto de um banco inclinado ou de uma cadeira firme, e faça a rosca com halter, um braço de cada vez. A ideia é a mesma: o braço parado e apoiado.",
      },
      {
        question: "Rosca Scott com barra W ou reta?",
        answer:
          "A barra W costuma ser mais confortável para o punho e o cotovelo, por isso é a mais usada. A reta funciona para quem não sente nada. Com halter, dá para fazer um braço de cada vez.",
      },
      {
        question: "Rosca Scott dá dor no cotovelo?",
        answer:
          "Pode incomodar quando a carga é alta e o braço estica de uma vez, com tranco, no fim da descida. Desça devagar, pare um pouco antes de travar o cotovelo e use uma carga que você controla. Se a dor continua fora do treino, procure avaliação.",
      },
      {
        question: "Quantas séries e repetições fazer na rosca Scott?",
        answer:
          "Para a maioria das pessoas, de 2 a 4 séries de 8 a 15 repetições, parando a 1 ou 2 repetições da falha, com a descida controlada.",
      },
    ],
    content: `<img src="/blog-images/rosca-scott-capa.webp" alt="Capa: Rosca Scott. Como fazer e erros comuns. Ilustração de pessoa no banco Scott com barra W" title="Rosca Scott — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>A <strong>rosca Scott</strong> é a rosca de bíceps feita com o braço apoiado num banco inclinado, o banco Scott. O apoio tira o balanço do corpo: não dá para jogar o tronco para trás nem roubar com o ombro. Sobra o bíceps fazendo o trabalho, e por isso a carga é bem menor que a da rosca direta.</p>

<h2>Para que serve a rosca Scott e qual músculo trabalha?</h2>
<p>Serve para treinar o <strong>bíceps</strong> sem a ajuda do corpo. Trabalham o bíceps, o <strong>braquial</strong> (o músculo que fica por baixo do bíceps e também dobra o cotovelo) e o <strong>braquiorradial</strong>, no antebraço. Com a pegada neutra, a do martelo, o braquial e o antebraço trabalham mais.</p>
<p><strong>Qual cabeça do bíceps?</strong> As duas trabalham em qualquer rosca. O que a Scott muda é onde o esforço pesa mais: com o braço apoiado na frente do corpo, a parte mais difícil é perto do braço esticado, e o topo fica leve.</p>
<p>A dúvida que costuma vir junto é: rosca Scott ou rosca direta? O comparador abaixo mostra o que muda entre as duas.</p>

<h2>Como ajustar o banco Scott</h2>
<ul>
<li><strong>Altura do assento:</strong> as axilas encostam no topo do estofado, e a parte de trás do braço fica inteira apoiada nele.</li>
<li><strong>Assento baixo demais:</strong> você precisa se esticar e os ombros sobem. <strong>Alto demais:</strong> o braço apoia só no cotovelo e escorrega.</li>
</ul>

<h2>Como fazer a rosca Scott, passo a passo</h2>
<ol>
<li><strong>Posição.</strong> Sente, ajuste a altura e apoie a parte de trás dos braços no estofado. Peito perto do banco.</li>
<li><strong>Pegada.</strong> Segure a barra W com as palmas para cima (pegada supinada), na largura dos ombros.</li>
<li><strong>Subida.</strong> Dobre só o cotovelo e suba a barra até o antebraço ficar quase vertical. O braço não sai do estofado.</li>
<li><strong>Descida.</strong> Desça devagar, em uns 2 a 3 segundos, até quase esticar o braço. Pare um pouco antes de travar o cotovelo.</li>
</ol>

<h2>Os erros mais comuns</h2>
<ul>
<li><strong>Soltar o peso na descida.</strong> É o erro que mais dá dor no cotovelo: o braço estica de uma vez, com tranco, carregando a carga toda.</li>
<li><strong>Carga alta demais.</strong> Na Scott, a carga cai bastante em relação à rosca direta. Isso é normal e não quer dizer fraqueza.</li>
<li><strong>Tirar o braço do apoio.</strong> Se o cotovelo levanta do estofado no fim da subida, o ombro entrou no movimento.</li>
<li><strong>Encurtar a descida.</strong> Subir e descer só pela metade tira a parte do movimento em que a Scott mais trabalha.</li>
</ul>

<h2>Variações da rosca Scott</h2>
<ul>
<li><strong>Barra W ou reta:</strong> a W é a mais usada, mais confortável para punho e cotovelo; a reta funciona para quem não sente nada. Pegada mais fechada ou mais aberta muda pouco: escolha a que o punho aceita.</li>
<li><strong>Com halteres e unilateral:</strong> um halter em cada mão, ou um braço de cada vez. Bom para corrigir diferença entre os lados e para quem sente o punho na barra. Dá para fazer alternada.</li>
<li><strong>Martelo (pegada neutra):</strong> palmas viradas uma para a outra, com halter ou corda. Trabalha mais o braquial e o antebraço.</li>
<li><strong>Na polia ou no cross:</strong> o banco Scott de frente para a polia baixa, com barra ou corda. O cabo mantém tensão também no topo, onde a barra fica leve.</li>
<li><strong>Máquina Scott ou articulada:</strong> a carga é guiada, com pegada supinada ou neutra. É a versão mais fácil de aprender e de levar perto da falha com segurança.</li>
<li><strong>Rosca 21:</strong> 7 repetições na metade de baixo, 7 na metade de cima e 7 completas. É uma técnica para variar, não para toda semana.</li>
</ul>

<h2>Rosca Scott ou rosca direta? E as outras roscas</h2>
<ul>
<li><strong>Rosca direta:</strong> em pé, permite mais carga, mas o corpo tende a ajudar. Veja <a href="/blog/como-fazer-rosca-direta">como fazer rosca direta</a>.</li>
<li><strong>Rosca inclinada:</strong> deitado num banco inclinado, o braço fica atrás do corpo; na Scott, fica na frente. Uma pesa mais com o bíceps alongado, a outra com o braço à frente.</li>
<li><strong>Rosca concentrada e martelo:</strong> a concentrada é a mais parecida com a Scott; a martelo muda a pegada. Veja <a href="/blog/rosca-direta-vs-rosca-martelo">rosca direta ou martelo</a>.</li>
</ul>
<p>Nenhuma é a melhor. Um bom treino de bíceps costuma ter uma rosca com mais carga e uma com o braço apoiado, como a Scott.</p>

<h2>O que pode substituir a rosca Scott?</h2>
<ul>
<li><strong><a href="/blog/como-fazer-rosca-concentrada">Rosca concentrada</a>:</strong> sentado, com o cotovelo apoiado na coxa. É a mais parecida.</li>
<li><strong>Rosca no cabo com o braço apoiado:</strong> se não tem banco Scott, apoie o braço num banco inclinado de frente para a polia.</li>
<li><strong>Sem banco, em casa:</strong> apoie a parte de trás do braço no encosto de um banco inclinado ou de uma cadeira firme e faça a rosca com halter, um braço de cada vez.</li>
</ul>

<h2>Rosca Scott engrossa o braço?</h2>
<p>Ela faz o bíceps crescer como qualquer rosca bem feita: séries perto da falha e carga subindo com o tempo. Mas o tamanho do braço depende do volume da semana, do tríceps, que é a maior parte do braço, e da alimentação. Veja o <a href="/blog/treino-de-biceps">treino de bíceps</a> e o <a href="/blog/treino-de-triceps">treino de tríceps</a>.</p>

<h2>Quantas séries e repetições?</h2>
<p>Para a maioria das pessoas, <strong>2 a 4 séries de 8 a 15 repetições</strong>, parando a 1 ou 2 repetições da falha, com a descida controlada. Ela encaixa depois de um exercício de bíceps com mais carga, como a rosca direta.</p>

<h2>Por que se chama rosca Scott?</h2>
<p>O nome vem do fisiculturista norte-americano Larry Scott, que ficou conhecido pelos braços e popularizou o exercício no banco inclinado nos anos 1960.</p>

<h2>Não se compare</h2>
<p>Na Scott, a barra do vizinho quase nunca é parâmetro: ele pode estar soltando o peso na descida e chamando isso de carga. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é a sua última série: a mesma execução, com uma repetição ou um pouco mais de carga.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/como-fazer-rosca-direta">Como fazer rosca direta</a></li>
<li><a href="/blog/como-fazer-rosca-martelo">Como fazer rosca martelo</a></li>
<li><a href="/blog/rosca-direta-vs-rosca-martelo">Rosca direta ou rosca martelo</a></li>
<li><a href="/blog/treino-de-biceps">Treino de bíceps</a></li>
</ul>`,
  },
  {
    slug: "abacate-engorda",
    title: "Abacate Engorda? Calorias por Fatia e Quanto Comer",
    metaTitle: "Abacate Engorda? Calorias por Fatia e Quanto Comer",
    metaDescription:
      "Uma fatia de abacate tem perto de 87 kcal; a fruta inteira, mais de 400. Veja quando o abacate engorda, com açúcar ou na vitamina, à noite e se ajuda a emagrecer.",
    excerpt:
      "Quantas calorias tem o abacate por colher, fatia, meio e inteiro, se engorda mais que banana, o que muda com açúcar, leite, mel e na vitamina, e quanto comer por dia.",
    category: "Nutrição",
    date: "2026-11-09",
    readTime: "7 min",
    author: "Montinho",
    tags: ["abacate", "calorias", "frutas", "gordura", "dieta"],
    faq: [
      {
        question: "Abacate engorda?",
        answer:
          "Pode engordar se a porção for grande: um abacate inteiro tem mais de 400 kcal. Uma fatia (90 g) tem perto de 87 kcal e cabe tranquilo numa dieta. O que engorda é o total do dia passar do seu gasto.",
      },
      {
        question: "Quantas calorias tem um abacate?",
        answer:
          "Pela TACO, o abacate tem perto de 96 kcal em 100 g. Com as medidas do IBGE: 1 colher de sopa (45 g) tem perto de 43 kcal, 1 fatia (90 g) perto de 87 kcal e 1 unidade (430 g) perto de 414 kcal.",
      },
      {
        question: "Por que o abacate tem tantas calorias?",
        answer:
          "Porque, diferente da maioria das frutas, ele tem bastante gordura: 8,4 g em 100 g. Em compensação, tem pouco açúcar e muita fibra (6,3 g em 100 g).",
      },
      {
        question: "Meio abacate engorda?",
        answer:
          "Meio abacate grande (215 g) tem perto de 207 kcal, o mesmo que uma refeição pequena. Cabe, se você contar no total do dia; como lanche de todo dia, uma fatia (87 kcal) costuma ser suficiente.",
      },
      {
        question: "O que engorda mais, banana ou abacate?",
        answer:
          "No mesmo peso, quase empatam: 100 g de banana prata têm 98 kcal, e 100 g de abacate, 96. Na porção, uma fatia de abacate (90 g, 87 kcal) passa um pouco de uma banana prata (75 g, 74 kcal). A diferença está no que cada um tem: a banana é carboidrato, o abacate é gordura.",
      },
      {
        question: "Vitamina de abacate engorda quantos quilos?",
        answer:
          "Nenhum alimento engorda um número fixo de quilos. O que muda o peso é o total de calorias do dia, repetido por semanas. Uma vitamina grande, com açúcar ou leite condensado, pode passar fácil de uma refeição; por isso, se ela entra todo dia, a porção importa.",
      },
      {
        question: "Abacate com açúcar engorda?",
        answer:
          "O açúcar soma calorias sem sustentar: cada 10 g somam perto de 39 kcal. Se você gosta assim, use pouco, ou troque por fruta picada junto.",
      },
      {
        question: "Vitamina de abacate engorda o bebê na barriga?",
        answer:
          "O ganho de peso do bebê depende da gestação como um todo, não de um alimento. A alimentação na gravidez deve ser combinada com o obstetra e o nutricionista que acompanham a gestação.",
      },
      {
        question: "Por que o abacate incha a barriga?",
        answer:
          "Algumas pessoas sentem a barriga estufada depois de uma porção grande, porque é muita fibra e gordura de uma vez. Se acontece sempre, diminua a porção; se o incômodo for frequente, procure médico ou nutricionista.",
      },
      {
        question: "Abacate à noite engorda?",
        answer:
          "O horário não engorda. O que conta é o total do dia. Uma fatia à noite é um lanche que sustenta e cabe na maioria das dietas.",
      },
      {
        question: "Abacate ajuda a emagrecer?",
        answer:
          "Nenhum alimento emagrece sozinho. O abacate ajuda porque tem fibra e sustenta, mas é calórico: funciona em porção pequena, no lugar de outra gordura, e não somado a tudo.",
      },
      {
        question: "Quanto abacate posso comer por dia?",
        answer:
          "Para a maioria das pessoas, uma ou duas fatias (90 a 180 g) por dia cabem bem. Mais que isso pode caber, desde que você conte as calorias no total do dia.",
      },
    ],
    content: `<img src="/blog-images/abacate-engorda-capa.webp" alt="Capa: Abacate engorda? Calorias por fatia. Ilustração de abacate cortado ao meio com fatias" title="Abacate Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Abacate engorda?</strong> Depende de quanto. Uma fatia tem perto de 87 kcal, o que cabe tranquilo numa dieta. O abacate brasileiro inteiro, que é grande, passa de 400 kcal. O abacate é fruta, mas se comporta como uma gordura: tem pouco açúcar e muita caloria em pouco volume.</p>

<h2>Quantas calorias tem o abacate?</h2>
<table>
<thead><tr><th>Porção</th><th>Calorias</th><th>Gordura</th><th>Fibra</th></tr></thead>
<tbody>
<tr><td>1 colher de sopa (45 g)</td><td>cerca de 43 kcal</td><td>3,8 g</td><td>2,8 g</td></tr>
<tr><td><strong>1 fatia (90 g)</strong></td><td><strong>cerca de 87 kcal</strong></td><td>7,6 g</td><td>5,7 g</td></tr>
<tr><td>Meio abacate (215 g)</td><td>cerca de 207 kcal</td><td>18 g</td><td>13,5 g</td></tr>
<tr><td>1 unidade (430 g)</td><td>cerca de 414 kcal</td><td>36 g</td><td>27 g</td></tr>
<tr><td>500 g</td><td>cerca de 481 kcal</td><td>42 g</td><td>31,5 g</td></tr>
<tr><td>100 g</td><td>96 kcal</td><td>8,4 g</td><td>6,3 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, com as porções da tabela de medidas do IBGE. A TACO não tem o avocado, a variedade menor que se vende em bandeja; para ele, veja o rótulo. Você vai encontrar a ficha do abacate no fim do artigo.</p>

<h2>Por que o abacate tem tantas calorias?</h2>
<p>Porque, diferente da maioria das frutas, ele é rico em <strong>gordura</strong>: 8,4 g em 100 g. A banana, por exemplo, quase não tem. Em compensação, o abacate tem pouco carboidrato (6 g em 100 g) e bastante <strong>fibra</strong> (6,3 g), o que ajuda a sustentar.</p>
<p>Para ter uma ideia: uma fatia de abacate tem um pouco mais de calorias que uma colher de sopa de azeite (perto de 71 kcal). Não é vilão, mas é para comer em porção, como você usaria um azeite.</p>

<h2>O que engorda mais, banana ou abacate?</h2>
<p>No mesmo peso, quase empatam: 100 g de banana prata têm 98 kcal, e 100 g de abacate, 96. Na porção, uma fatia de abacate (90 g, perto de 87 kcal) passa um pouco de uma banana prata (75 g, perto de 74 kcal). A diferença é o que cada um tem: a banana é quase só carboidrato; o abacate, gordura e fibra. Veja <a href="/blog/banana-engorda">banana engorda?</a>.</p>

<h2>Abacate engorda: sim ou não?</h2>
<p><strong>Engorda o que passa do seu gasto, repetido por semanas.</strong> Uma fatia por dia não muda a balança de ninguém que está com o resto no lugar. O problema é comer o abacate inteiro de uma vez, ou somar tudo: abacate com açúcar, leite condensado ou mel.</p>

<h2>Abacate com açúcar, leite, mel ou na vitamina</h2>
<p>O abacate quase nunca vem sozinho. O que vai junto pesa tanto quanto ele:</p>
<table>
<thead><tr><th>Junto com o abacate</th><th>Calorias a mais</th></tr></thead>
<tbody>
<tr><td>10 g de açúcar refinado</td><td>cerca de 39 kcal</td></tr>
<tr><td>10 g de açúcar mascavo</td><td>cerca de 37 kcal</td></tr>
<tr><td>10 g de mel</td><td>cerca de 31 kcal</td></tr>
<tr><td>20 g de leite condensado</td><td>cerca de 63 kcal</td></tr>
<tr><td>10 g de leite em pó integral</td><td>cerca de 50 kcal</td></tr>
<tr><td>1 colher de sopa de aveia (15 g)</td><td>cerca de 59 kcal</td></tr>
</tbody>
</table>
<p>Valores da TACO; os pesos de 10 e 20 g são exemplos nossos, porque a base não traz medida caseira para esses itens. A TACO não tem valor para o leite líquido integral nem para whey: veja o rótulo.</p>
<ul>
<li><strong>Com açúcar ou sem açúcar?</strong> Sem açúcar é a versão mais leve. Se você gosta assim, use pouco, ou amasse com fruta picada para adoçar.</li>
<li><strong>Na vitamina:</strong> a conta depende do tamanho do copo, do leite e de quanto açúcar vai. Uma vitamina grande com açúcar ou leite condensado passa fácil de uma refeição. Vitamina de abacate não engorda "tantos quilos": o que muda o peso é o total do dia, repetido por semanas.</li>
<li><strong>Com banana, aveia ou whey:</strong> viram um lanche mais completo, mas cada um soma calorias. Bom para quem quer ganhar peso; para quem quer emagrecer, vale escolher um só.</li>
<li><strong>Salgado (guacamole, na torrada, na salada):</strong> o abacate substitui outra gordura, como manteiga ou maionese, e isso costuma ser uma boa troca.</li>
</ul>

<h2>Abacate à noite e no treino</h2>
<ul>
<li><strong>À noite:</strong> o horário não engorda. Uma fatia é um lanche que sustenta. Veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</li>
<li><strong>Antes do treino:</strong> como tem muita gordura e fibra, demora para digerir. Se você treina logo depois, prefira uma fruta com mais carboidrato, como a <a href="/blog/banana-engorda">banana</a>.</li>
</ul>

<h2>Abacate na gravidez, barriga inchada e quem deve ter cuidado</h2>
<ul>
<li><strong>Na gravidez:</strong> "vitamina de abacate engorda o bebê" é uma busca comum, mas o peso do bebê depende da gestação como um todo, não de um alimento. A alimentação na gravidez deve ser combinada com o obstetra e o nutricionista.</li>
<li><strong>Barriga inchada:</strong> uma porção grande é muita fibra e gordura de uma vez, e algumas pessoas sentem a barriga estufada. Se acontece sempre, diminua a porção; se for frequente, procure médico ou nutricionista. Veja <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a>.</li>
<li><strong>Quem tem diabetes ou restrição de potássio:</strong> o abacate tem pouco carboidrato (6 g em 100 g) e uma quantidade moderada de potássio (206 mg em 100 g). Quem tem orientação médica para a dieta deve seguir o que o médico disser.</li>
</ul>

<h2>Quanto abacate comer por dia?</h2>
<p>Para a maioria das pessoas, <strong>uma ou duas fatias (90 a 180 g)</strong> por dia cabem bem. Mais que isso pode caber, desde que você conte no total do dia. Para saber quantas calorias cabem no seu, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come abacate todo dia e emagrece, e gente que corta e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com o abacate dentro, se você gosta dele.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: abacate cru, banana prata, azeite de oliva, açúcar refinado e mascavo, mel, leite condensado, leite em pó integral, aveia em flocos</li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (colher de sopa, fatia e unidade de abacate; banana prata; colher de sopa de azeite e de aveia)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/banana-engorda">Banana engorda?</a></li>
<li><a href="/blog/amendoim-engorda">Amendoim engorda?</a></li>
<li><a href="/blog/melhores-frutas-para-emagrecer">Melhores frutas para emagrecer</a></li>
<li><a href="/blog/alimentos-ricos-em-fibra">Alimentos ricos em fibra</a></li>
</ul>`,
  },
];
