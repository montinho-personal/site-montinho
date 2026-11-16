import type { BlogPost } from "./blog";

/**
 * Graviton e air bike (16/11/2026). Itens 1 e 2 da pauta (docs/seo/pauta.md),
 * escolhidos pelo Montinho. Volumes do Planejador (Brasil): "graviton"
 * 14.800/mês, "air bike" 8.100/mês.
 *
 * Canibalização (sem acento e sem hífen, slug, título e app/): nenhum dos
 * dois tinha página. O graviton só aparecia como alias de
 * "barra-fixa-assistida" no cadastro de exercícios e em FAQ de substituição;
 * a air bike não aparecia.
 *
 * Pesquisa no SerpApi (celular, São Paulo): "graviton", "graviton academia",
 * "air bike" (visão de IA em duas etapas) e "air bike emagrece". Evidência em
 * docs/seo/serp/graviton-air-bike-2026-11-16.json.
 *
 * GRAVITON. Sem número de estudo: o texto é de uso do aparelho. Músculos
 * seguem o cadastro do site (lib/treino/exercicios.ts: barra-fixa-assistida
 * com costas como primário; paralelas com tríceps ou peitoral). Ferramenta:
 * Comparador de Exercícios com graviton x puxada frontal, a troca que a
 * pessoa faz quando o aparelho está ocupado ou quando quer saber qual usar.
 *
 * AIR BIKE. Calorias pela escada de watts que o site já usa para a
 * ergométrica (lib/spinning.ts, Compêndio de 2011, códigos 02012 a 02015),
 * a mesma da Calculadora de Calorias na Bicicleta, para não haver duas
 * respostas para os mesmos watts. Conta: kcal/min = MET × 3,5 × kg ÷ 200.
 * 70 kg, 30 min: 6,8 MET ≈ 250; 8,8 ≈ 323; 11,0 ≈ 404; 14,0 ≈ 515.
 * As "750 calorias em 30 minutos" da visão de IA pediriam cerca de 20 MET,
 * acima da faixa mais alta medida. O Compêndio não tem entrada própria de
 * air bike (bike com braços); o texto diz que a conta usa a ergométrica.
 * Ferramenta: a Calculadora de Calorias na Bicicleta embutida
 * (ARTIGOS_COM_CALCULADORA_BICICLETA), no modo ergométrica por watts.
 */

export const GRAVITON_AIR_BIKE_POSTS: BlogPost[] = [
  {
    slug: "graviton",
    title: "Graviton: Para Que Serve, Como Usar e Qual Músculo Trabalha",
    metaTitle: "Graviton: Para Que Serve e Como Usar na Academia",
    metaDescription:
      "O graviton é a barra fixa com contrapeso da academia: quanto mais peso, mais fácil. Veja como usar, as pegadas e como sair dele para a barra livre.",
    excerpt:
      "O que é o graviton, para que serve, por que mais peso deixa mais leve, como usar passo a passo, qual músculo cada pegada trabalha e como evoluir para a barra fixa sem ajuda.",
    category: "Treino",
    date: "2026-11-16",
    readTime: "8 min",
    author: "Montinho",
    tags: ["graviton", "barra fixa assistida", "costas", "paralelas", "exercícios", "musculação"],
    faq: [
      {
        question: "O que é o graviton?",
        answer:
          "É o aparelho de academia que ajuda você a fazer barra fixa e paralelas. Você apoia os joelhos (ou os pés) numa plataforma ligada a uma pilha de pesos, e esse contrapeso empurra o corpo para cima, tirando parte do seu peso do exercício.",
      },
      {
        question: "Para que serve o graviton?",
        answer:
          "Para treinar costas e braços com a barra fixa, e tríceps e peito com as paralelas, mesmo antes de conseguir levantar o próprio corpo inteiro. Também serve para quem já faz barra, mas quer fazer mais repetições com boa execução.",
      },
      {
        question: "No graviton, quanto mais peso, mais leve?",
        answer:
          "Sim. A carga do graviton é ajuda, não resistência. Se você pesa 70 kg e coloca 30 kg, levanta mais ou menos 40 kg. Para o exercício ficar mais difícil, você tira peso da pilha.",
      },
      {
        question: "Qual músculo o graviton trabalha?",
        answer:
          "Na barra, principalmente as costas (o grande dorsal), com bíceps e a parte de trás do ombro ajudando. Nas paralelas, principalmente o tríceps, com peito e a frente do ombro ajudando. A pegada muda um pouco a distribuição.",
      },
      {
        question: "Qual treino substitui o graviton?",
        answer:
          "A puxada frontal na polia faz o mesmo movimento para as costas. A barra fixa com elástico substitui a ajuda do contrapeso, e a negativa na barra (só a descida, devagar) ajuda a ganhar força para a barra livre. Para as paralelas, o tríceps no banco ou o mergulho com os pés no chão.",
      },
      {
        question: "Graviton ou puxada: qual é melhor?",
        answer:
          "Os dois treinam as costas no mesmo movimento. O graviton é melhor para quem quer chegar à barra fixa, porque o corpo se move como na barra livre. A puxada é mais fácil de ajustar a carga em pequenos passos. Num treino de costas, um dos dois já basta.",
      },
      {
        question: "Dá para treinar glúteo no graviton?",
        answer:
          "Algumas pessoas usam a plataforma para fazer um coice de glúteo em quatro apoios. Funciona como adaptação, mas não é para isso que o aparelho foi feito. Para glúteo, máquinas e exercícios próprios dão mais controle da carga.",
      },
    ],
    content: `<img src="/blog-images/graviton-capa.webp" alt="Capa: Graviton. Para que serve e como usar. Ilustração de uma mulher ajoelhada na plataforma do graviton, puxando a barra" title="Graviton — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>graviton</strong> é aquele aparelho da academia com uma barra no alto, uma plataforma acolchoada e uma pilha de pesos do lado. Ele faz a barra fixa e as paralelas ficarem mais leves, para você treinar o movimento antes de conseguir levantar o próprio corpo. Muita gente passa por ele sem saber usar, e a regra que mais confunde é a da carga: nele, <strong>mais peso deixa o exercício mais fácil</strong>.</p>

<h2>O que é o graviton e para que serve?</h2>
<p>É uma máquina de <strong>barra fixa e paralelas assistidas</strong>. Você apoia os joelhos ou os pés numa plataforma presa a uma pilha de pesos. Esse contrapeso empurra seu corpo para cima e tira parte do seu peso do exercício.</p>
<p>Serve para três coisas:</p>
<ul>
<li><strong>Aprender a barra fixa.</strong> Quem ainda não faz nenhuma repetição na barra livre treina o mesmo movimento com ajuda.</li>
<li><strong>Treinar paralelas.</strong> O mergulho para tríceps e peito, com o mesmo contrapeso.</li>
<li><strong>Fazer mais repetições com boa execução.</strong> Quem já faz algumas barras usa a ajuda para completar as séries sem roubar.</li>
</ul>
<p>Se o graviton está ocupado ou você quer saber se vale trocar pela puxada, o comparador abaixo mostra o que muda entre os dois.</p>

<h2>Por que no graviton mais peso fica mais leve?</h2>
<p>Porque a pilha de pesos não está contra você: ela está do seu lado. O peso que você escolhe é a <strong>ajuda</strong>. Se você pesa 70 kg e coloca 30 kg, levanta mais ou menos 40 kg. Se coloca 50 kg, levanta 20 kg.</p>
<p>A evolução, então, é ao contrário das outras máquinas: <strong>você progride tirando peso</strong>. Quando o número da pilha chegar perto de zero, você está pronto para tentar a barra livre.</p>

<h2>Como usar o graviton passo a passo</h2>
<ol>
<li><strong>Escolha a ajuda.</strong> Comece com uma carga que deixe você fazer 8 a 12 repetições com controle. Na dúvida, comece com mais ajuda e vá tirando.</li>
<li><strong>Suba no degrau e segure a barra</strong> na pegada que você vai usar.</li>
<li><strong>Apoie os joelhos na plataforma</strong>, um de cada vez, com o corpo pendurado e os braços esticados. Alguns modelos usam os pés em pé na plataforma.</li>
<li><strong>Puxe</strong> levando o peito em direção à barra e os cotovelos para baixo e para trás, até o queixo passar da barra ou chegar perto dela.</li>
<li><strong>Desça devagar</strong> até esticar os braços de novo. A descida controlada também conta.</li>
<li><strong>Para sair</strong>, apoie um pé no degrau antes de tirar o outro joelho. Sair de uma vez faz a plataforma subir de repente.</li>
</ol>
<p>Nas paralelas, o caminho é o mesmo: joelhos na plataforma, mãos nas alças paralelas, braços esticados. Você desce dobrando os cotovelos até o ombro chegar perto da linha do cotovelo e empurra de volta.</p>

<h2>Qual músculo o graviton trabalha?</h2>
<p>Depende do exercício:</p>
<table>
<thead><tr><th>Exercício</th><th>Músculo principal</th><th>Ajudam</th></tr></thead>
<tbody>
<tr><td>Barra fixa assistida</td><td>Costas (grande dorsal)</td><td>Bíceps e parte de trás do ombro</td></tr>
<tr><td>Paralelas, tronco reto</td><td>Tríceps</td><td>Peito e frente do ombro</td></tr>
<tr><td>Paralelas, tronco inclinado à frente</td><td>Peito</td><td>Tríceps e frente do ombro</td></tr>
</tbody>
</table>

<h3>Pegada aberta, fechada, neutra, pronada ou supinada?</h3>
<ul>
<li><strong>Pronada aberta</strong> (palmas para a frente, mãos além da largura dos ombros): a mais usada, foca nas costas.</li>
<li><strong>Supinada</strong> (palmas viradas para você, mãos na largura dos ombros): mais bíceps, e costuma ser a mais fácil de puxar.</li>
<li><strong>Neutra</strong> (palmas viradas uma para a outra, nas alças paralelas): confortável para o ombro e boa para quem sente o punho.</li>
<li><strong>Fechada</strong>: mais bíceps e menos amplitude de costas.</li>
</ul>
<p>Todas trabalham as costas. Use a que você faz com o ombro confortável e varie ao longo das semanas.</p>

<h2>Graviton, puxada ou elástico: qual escolher?</h2>
<ul>
<li><strong>Graviton:</strong> o corpo se move como na barra livre. É a melhor ponte para quem quer chegar à <a href="/blog/como-fazer-barra-fixa">barra fixa</a>.</li>
<li><strong>Puxada frontal:</strong> o banco segura o corpo e a carga sobe em pequenos passos. Boa para treinar costas com volume. A diferença entre as duas está em <a href="/blog/barra-fixa-vs-puxada">barra fixa ou puxada</a>.</li>
<li><strong>Barra com elástico:</strong> a ajuda é maior embaixo e menor em cima. Serve em casa ou quando o graviton está ocupado.</li>
</ul>

<h2>Como sair do graviton para a barra fixa</h2>
<ol>
<li><strong>Tire ajuda aos poucos.</strong> Quando fizer 12 repetições boas, tire uma placa e volte às 8.</li>
<li><strong>Treine a negativa na barra livre.</strong> Suba com um banco e desça devagar, em 3 a 5 segundos. É a parte que dá força para a subida.</li>
<li><strong>Teste a barra livre de tempos em tempos.</strong> A primeira repetição costuma aparecer quando a ajuda já está bem baixa.</li>
</ol>
<p>Não tem prazo certo. Depende do seu peso, da sua força de partida e de quantas vezes por semana você treina costas.</p>

<h2>Graviton para glúteo e perna?</h2>
<p>Algumas academias e vídeos mostram o coice de glúteo usando a plataforma do graviton, em quatro apoios. Funciona como adaptação, mas não é a função do aparelho, e a carga é difícil de medir. Para glúteo e posterior, exercícios e máquinas próprios dão mais controle.</p>

<h2>Não se compare</h2>
<p>Tem gente que usa o graviton com 10 kg de ajuda e gente que precisa de 50 kg. Quanto pesa, quanto braço tem, quanto já treinou: tudo muda o número. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é a sua última série: uma repetição a mais ou uma placa de ajuda a menos, com a mesma execução.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/como-fazer-barra-fixa">Como fazer barra fixa</a></li>
<li><a href="/blog/barra-fixa-vs-puxada">Barra fixa ou puxada?</a></li>
<li><a href="/blog/como-fazer-pulldown-puxada-frontal">Como fazer puxada frontal</a></li>
<li><a href="/blog/treino-de-costas-hipertrofia">Treino de costas para hipertrofia</a></li>
</ul>`,
  },
  {
    slug: "air-bike",
    title: "Air Bike: O Que É, Como Usar e Quantas Calorias Queima",
    metaTitle: "Air Bike: O Que É, Como Usar e Quantas Calorias Queima",
    metaDescription:
      "A air bike é a bike de ventoinha com braços: quanto mais força, mais resistência. Veja como usar, o que ela trabalha e quanto gasta de verdade.",
    excerpt:
      "O que é a air bike, a diferença para a bicicleta ergométrica, os músculos que trabalha, quantas calorias queima pelos watts do visor, se emagrece e três treinos para começar.",
    category: "Treino",
    date: "2026-11-16",
    readTime: "8 min",
    author: "Montinho",
    tags: ["air bike", "bicicleta ergométrica", "cardio", "hiit", "calorias", "condicionamento"],
    faq: [
      {
        question: "Qual a diferença entre air bike e bicicleta ergométrica?",
        answer:
          "A air bike tem uma ventoinha no lugar do disco de carga e braços que vão e voltam. A resistência vem do ar: quanto mais força e velocidade, mais pesado. Na ergométrica comum, você escolhe o nível num botão e trabalha só as pernas.",
      },
      {
        question: "Quantas calorias a air bike queima?",
        answer:
          "Depende da potência que você mantém. Para uma pessoa de 70 kg, 30 minutos ficam em torno de 250 kcal em ritmo moderado (90 a 100 watts), 320 a 400 kcal em ritmo forte (101 a 200 watts) e perto de 515 kcal num esforço muito alto e sustentado (201 a 270 watts). A conta usa os valores da bicicleta ergométrica no Compêndio de Atividades Físicas.",
      },
      {
        question: "Air bike queima 750 calorias em 30 minutos?",
        answer:
          "Para uma pessoa de 70 kg, isso exigiria um esforço acima de tudo o que o Compêndio de Atividades Físicas mediu na bicicleta ergométrica. Em treino real, com pausas, o número fica bem abaixo. O visor da bike mostra uma estimativa do próprio aparelho.",
      },
      {
        question: "Air bike emagrece?",
        answer:
          "Ajuda, como qualquer cardio que gaste bastante energia. Quem decide o emagrecimento é o déficit de calorias mantido por semanas. A air bike entra como um jeito de gastar bem em pouco tempo e com pouco impacto nas articulações.",
      },
      {
        question: "Quais músculos a air bike trabalha?",
        answer:
          "Pernas (quadríceps, glúteos, posterior de coxa e panturrilha) na pedalada, e braços, ombros, peito e costas no empurra e puxa dos braços. O abdômen trabalha para estabilizar o tronco. Não é treino de força: o principal ganho é de condicionamento.",
      },
      {
        question: "Air bike ou esteira: o que queima mais?",
        answer:
          "Depende da intensidade, não do aparelho. Uma corrida forte e uma air bike forte gastam na mesma faixa. A air bike tem a vantagem de quase não ter impacto; a esteira tem a de ser mais fácil de manter num ritmo constante e longo.",
      },
      {
        question: "Dá para emagrecer com 1 hora de bicicleta por dia?",
        answer:
          "Dá, se a alimentação ficar em déficit. Uma hora por dia gasta bastante, mas também pode abrir o apetite. Para a maioria das pessoas, 3 a 5 sessões por semana somadas à musculação são mais fáceis de manter do que uma hora todo dia.",
      },
    ],
    content: `<img src="/blog-images/air-bike-capa.webp" alt="Capa: Air bike. O que é e quanto queima. Ilustração de um homem pedalando forte numa air bike com a ventoinha à frente" title="Air Bike — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>A <strong>air bike</strong> é a bicicleta com uma ventoinha na frente e braços que vão e voltam. Ela virou presença fixa em box de cross e em academias com área funcional, e tem fama de "a bike que mais queima". Gasta bastante, mesmo. Mas os números que circulam costumam vir inflados, e é isso que vale saber antes de escolher ela por causa das calorias.</p>

<h2>O que é a air bike?</h2>
<p>É uma bicicleta ergométrica com <strong>resistência a ar</strong>. No lugar do disco de carga, ela tem uma ventoinha. Quanto mais forte e rápido você pedala e empurra os braços, mais ar a ventoinha desloca e mais pesado fica. Não tem botão de nível: <strong>a carga é você quem faz</strong>.</p>
<p>Os braços se movem junto com os pedais. Quando a perna direita empurra, o braço direito puxa, e vice-versa. Por isso ela trabalha o corpo todo.</p>

<h2>Qual a diferença entre air bike e bicicleta ergométrica?</h2>
<table>
<thead><tr><th></th><th>Air bike</th><th>Ergométrica comum</th></tr></thead>
<tbody>
<tr><td>Resistência</td><td>Ar, pela ventoinha: sobe com o seu esforço</td><td>Disco ou magnética: você escolhe o nível</td></tr>
<tr><td>Braços</td><td>Móveis, trabalham junto</td><td>Fixos, só para apoio</td></tr>
<tr><td>Melhor para</td><td>Tiros curtos e intervalados</td><td>Ritmo constante e longo</td></tr>
<tr><td>Barulho</td><td>Alto (a ventoinha venta)</td><td>Baixo</td></tr>
</tbody>
</table>
<p>As duas servem para emagrecer e ganhar fôlego. A air bike brilha nos tiros, porque a resistência acompanha o esforço sem precisar mexer em nada.</p>

<h2>Quantas calorias a air bike queima?</h2>
<p>Depende da <strong>potência</strong> que você mantém, que o visor mostra em watts. O Compêndio de Atividades Físicas, a referência usada para calcular gasto por atividade, não tem uma entrada só para a air bike, mas mede a bicicleta ergométrica por faixa de watts. Para uma pessoa de 70 kg, em 30 minutos:</p>
<table>
<thead><tr><th>Potência mantida</th><th>Esforço</th><th>Gasto em 30 min (70 kg)</th></tr></thead>
<tbody>
<tr><td>90 a 100 W</td><td>moderado a forte</td><td>cerca de 250 kcal</td></tr>
<tr><td>101 a 160 W</td><td>forte</td><td>cerca de 320 kcal</td></tr>
<tr><td>161 a 200 W</td><td>forte</td><td>cerca de 400 kcal</td></tr>
<tr><td>201 a 270 W</td><td>muito forte</td><td>cerca de 515 kcal</td></tr>
</tbody>
</table>
<p>Dois cuidados com esses números. Primeiro, a medição do Compêndio é da bike de pernas; na air bike os braços também empurram, então os watts do visor já incluem esse trabalho. Segundo, quase ninguém mantém 200 watts por 30 minutos: num treino intervalado, as pausas puxam a média para baixo.</p>
<p>E as <strong>"750 calorias em 30 minutos"</strong> que aparecem por aí? Para uma pessoa de 70 kg, isso exigiria um esforço acima da faixa mais alta que o Compêndio mediu. O número do visor também é uma estimativa do próprio aparelho, e cada marca calcula de um jeito. Para fazer a sua conta, use a calculadora abaixo no modo ergométrica, com os watts do seu visor.</p>

<h2>Air bike emagrece?</h2>
<p>Ajuda, como qualquer cardio que gaste bastante energia. Mas quem decide o emagrecimento é o <strong>déficit de calorias mantido por semanas</strong>, e não o aparelho. A vantagem da air bike é gastar bem em pouco tempo e com pouco impacto: joelho e tornozelo quase não sofrem.</p>
<p>A fama de que ela "acelera o metabolismo por horas" vem do efeito pós-treino, que existe, mas é pequeno. Está explicado em <a href="/blog/efeito-afterburn-epoc">efeito afterburn</a>.</p>

<h2>Quais músculos a air bike trabalha?</h2>
<ul>
<li><strong>Pernas:</strong> quadríceps, glúteos, posterior de coxa e panturrilha, na pedalada.</li>
<li><strong>Braços e tronco:</strong> peito, ombros e tríceps quando você empurra; costas e bíceps quando puxa.</li>
<li><strong>Abdômen:</strong> segura o tronco firme enquanto braços e pernas trabalham.</li>
</ul>
<p>Ela não substitui a musculação: o ganho principal é de condicionamento, não de força.</p>

<h2>Como usar a air bike</h2>
<ol>
<li><strong>Ajuste o banco.</strong> Com o pedal embaixo, o joelho fica levemente dobrado, nunca esticado de vez.</li>
<li><strong>Pés firmes nos pedais</strong> e mãos nas alças, sem apertar demais.</li>
<li><strong>Empurre e puxe os braços</strong> junto com a pedalada. Só pedalar, com os braços soltos, desperdiça metade do aparelho.</li>
<li><strong>Tronco firme</strong>, sem balançar de um lado para o outro.</li>
<li><strong>Aqueça 3 a 5 minutos</strong> leve antes de qualquer tiro.</li>
</ol>

<h2>Treinos de air bike para começar</h2>
<ul>
<li><strong>Intervalado curto:</strong> 20 segundos forte e 40 segundos leve, 8 a 10 vezes. Bom para quem está começando.</li>
<li><strong>Tabata:</strong> 20 segundos no máximo e 10 de pausa, 8 vezes. A air bike é um dos melhores aparelhos para o <a href="/blog/treino-tabata">tabata</a> de verdade.</li>
<li><strong>Contínuo:</strong> 15 a 25 minutos num ritmo que dê para conversar com frases curtas. Bom para os dias depois de um treino pesado.</li>
</ul>
<p>Duas ou três sessões por semana, somadas à musculação, já fazem diferença no fôlego.</p>

<h2>Air bike, esteira ou elíptico?</h2>
<p>Em calorias, os três ficam na mesma faixa quando a intensidade é parecida. A escolha é de outra ordem: a air bike quase não tem impacto e é ótima para tiros; a esteira é natural para quem gosta de correr ou caminhar inclinado; o elíptico também tem pouco impacto e é mais fácil de manter por muito tempo. Use o que você vai repetir semana após semana. Para comparar o gasto de cada um, veja <a href="/blog/exercicio-que-mais-queima-calorias">exercício que mais queima calorias</a>.</p>

<h2>Não se compare</h2>
<p>Na air bike todo mundo olha o visor de quem está do lado. Uma pessoa mais pesada e mais alta gera mais watts e mais calorias no mesmo esforço, e isso não diz nada sobre quem treina melhor. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é o seu último treino: um pouco mais de potência média ou um tiro a mais, com a mesma técnica.</p>

<h2>Fontes</h2>
<ul>
<li>Ainsworth BE, Haskell WL, Herrmann SD, et al. 2011 Compendium of Physical Activities: a second update of codes and MET values. Medicine &amp; Science in Sports &amp; Exercise, 2011 (bicicleta ergométrica por faixa de watts, códigos 02012 a 02015).</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/bicicleta-emagrece">Bicicleta emagrece?</a></li>
<li><a href="/blog/treino-tabata">Treino tabata</a></li>
<li><a href="/blog/hiit-funciona">HIIT funciona?</a></li>
<li><a href="/blog/efeito-afterburn-epoc">Efeito afterburn: o corpo queima depois do treino?</a></li>
</ul>`,
  },
];
