import type { BlogPost } from "./blog";

/**
 * "Cuscuz engorda?", "Banana engorda?" e "Amendoim engorda?" (06/11/2026).
 * Planejador de Palavras-chave do Google Ads (Brasil): "cuscuz engorda"
 * 22.200/mês (+ "cuscuz calorias" 2.900, "cuscuz emagrece" 1.300); "banana
 * engorda" 14.800 (+ "banana calorias" 5.400); "amendoim engorda" 12.100
 * (+ "amendoim calorias" 3.600). Publicados a pedido do Montinho ANTES dos
 * prints; título, H2 e FAQ serão revistos com a pesquisa.
 *
 * Canibalização: "melhores-frutas-para-emagrecer" tem "Banana engorda?" como
 * uma pergunta do FAQ, num artigo sobre frutas em geral; aqui a banana é o
 * tema inteiro, e os dois se linkam. "pasta-de-amendoim-como-escolher" é guia
 * de compra da pasta; aqui é o grão.
 *
 * Números: TACO 4ª edição, pela base do site (data/alimentos), por 100 g:
 *   - cuscuz de milho cozido com sal: 113,5 kcal, 2,2 g prot, 25,3 g carb,
 *     2,1 g fibra; cuscuz paulista: 142,1 kcal, 4,6 g gordura;
 *   - arroz tipo 1 cozido: 128,3 kcal; pão francês: 299,8 kcal;
 *   - ovo cozido: 145,7 kcal e 13,3 g prot; manteiga com sal: 726 kcal;
 *   - banana prata: 98,2 kcal, 26,0 g carb, 2,0 g fibra, 357,7 mg potássio;
 *     nanica: 91,5 kcal, 23,8 g carb; maçã 86,8; da terra 128,0;
 *   - amendoim torrado salgado: 605,8 kcal, 22,5 g prot, 54,0 g gordura,
 *     7,8 g fibra; cru: 544,1 kcal; paçoca: 486,9; pé-de-moleque: 503,2.
 * Porções da POF 2008-2009 (IBGE), também na base: 1 banana = 75 g; 1 ovo =
 * 45 g; 1 pão francês = 50 g; amendoim: 1 colher de sopa = 17 g, 1 punhado =
 * 30 g, 1 pacote = 50 g. A base não tem medida caseira para o cuscuz: o prato
 * de 200 g é exemplo nosso, e o texto diz isso.
 * Contas: cuscuz 200 g = 227 kcal, 4 g prot, 51 g carb; + 1 ovo cozido
 * (66 kcal, 6 g) = 293 kcal e 10 g; + 5 g de manteiga = 36 kcal; arroz 200 g
 * = 257 kcal; 2 pães franceses = 300 kcal. Banana prata = 74 kcal, 19,5 g
 * carb, 268 mg potássio; nanica = 69 kcal. Amendoim: punhado 182 kcal e
 * 6,8 g prot; colher de sopa 103 kcal; pacote 303 kcal.
 *
 * Cuscuz revisto em 06/11 com os prints (mais que arroz/pão, flocão,
 * acompanhamentos, todo dia, incha a barriga). Acompanhamentos: ovo frito
 * 240,2 kcal/100 g; feijão carioca cozido 76,4 kcal e 4,8 g prot (1 concha =
 * 140 g); peito de frango grelhado 159,2 kcal e 32 g prot (1 filé = 100 g);
 * linguiça de porco frita 279,5 kcal e 20,5 g prot (50 g é exemplo nosso;
 * a TACO não tem calabresa); farinha de milho amarela 350,6 kcal.
 *
 * Banana revista em 06/11 com os prints (2, 3 ou 4 por dia, banana ou pão,
 * com aveia e leite, barriga). Aveia em flocos 393,8 kcal/100 g, 1 colher de
 * sopa = 15 g (POF). Maçã, ouro e da terra a 75 g são só comparação.
 *
 * Amendoim revisto em 06/11 com os prints (benefícios, todo dia, japonês,
 * cozido, sem casca, barriga, como usar para emagrecer). Torrado salgado:
 * magnésio 159 mg e sódio 376 mg por 100 g (punhado: 48 mg e 113 mg). A TACO
 * não tem o amendoim japonês nem o cozido: sem número para eles.
 *
 * Ferramenta: nenhuma embutida (ARTIGOS_SEM_FERRAMENTA). A conta que sobra é
 * "quanto isso pesa no meu dia", mas os registros de TDEE, déficit, macros e
 * cardápio estão no teto de 8; as calorias da porção vêm prontas no texto e
 * na ficha de alimento, e a calculadora de déficit vai por link.
 */

export const ENGORDA_CUSCUZ_BANANA_AMENDOIM_POSTS: BlogPost[] = [
  {
    slug: "cuscuz-engorda",
    title: "Cuscuz Engorda? Calorias e Como Comer na Dieta",
    metaTitle: "Cuscuz Engorda? Calorias e Como Comer na Dieta",
    metaDescription:
      "100 g de cuscuz de milho têm perto de 113 kcal, menos que arroz e pão francês. Veja quando o cuscuz engorda, com ovo ou manteiga, à noite e se ele ajuda a emagrecer.",
    excerpt:
      "Quantas calorias tem o cuscuz de milho, como ele se compara com arroz e pão, o que muda com ovo, manteiga e queijo, e como encaixar no café, na janta e no treino.",
    category: "Nutrição",
    date: "2026-11-06",
    readTime: "7 min",
    author: "Montinho",
    tags: ["cuscuz", "calorias", "café da manhã", "carboidrato", "dieta"],
    faq: [
      {
        question: "Cuscuz engorda?",
        answer:
          "Não por si só. Em 100 g, o cuscuz de milho cozido tem perto de 113 kcal, menos que o arroz cozido (128) e bem menos que o pão francês (300). Engorda o que passa do seu gasto ao longo das semanas, e o que mais pesa no cuscuz costuma ser a quantidade e o que vai junto.",
      },
      {
        question: "Quantas calorias tem o cuscuz?",
        answer:
          "Pela TACO, 100 g de cuscuz de milho cozido com sal têm perto de 113 kcal, 25 g de carboidrato e 2 g de proteína. Um prato de 200 g fica perto de 227 kcal.",
      },
      {
        question: "Cuscuz com ovo engorda?",
        answer:
          "É uma das combinações mais equilibradas: 200 g de cuscuz com um ovo cozido ficam perto de 293 kcal e 10 g de proteína. O ovo frito ou a manteiga por cima somam mais calorias, mas a refeição continua cabendo na maioria das dietas.",
      },
      {
        question: "Quem está de dieta pode comer cuscuz?",
        answer:
          "Pode. O cuscuz de milho tem poucas calorias por peso e cabe na maioria das dietas. O que pede atenção é o tamanho do prato e o que vai junto: manteiga, queijo e calabresa somam mais que o próprio cuscuz.",
      },
      {
        question: "Cuscuz engorda mais que arroz?",
        answer:
          "Não. Em 100 g, o cuscuz de milho cozido tem perto de 113 kcal e o arroz branco cozido, perto de 128 kcal. A diferença é pequena; o tamanho do prato pesa mais que a escolha entre os dois.",
      },
      {
        question: "O que engorda mais, o pão ou o cuscuz?",
        answer:
          "Por peso, o cuscuz tem bem menos calorias: perto de 113 kcal em 100 g, contra 300 do pão francês, porque o cuscuz cozido tem muita água. Mas o que conta é a porção que você come; os dois cabem numa dieta.",
      },
      {
        question: "Cuscuz à noite engorda?",
        answer:
          "O horário não engorda. O que conta é o total do dia. Cuscuz com ovo à noite é uma janta leve e prática, se as calorias do resto do dia couberem.",
      },
      {
        question: "Cuscuz com manteiga, queijo ou calabresa engorda?",
        answer:
          "Somam calorias. 5 g de manteiga são perto de 36 kcal; 50 g de linguiça de porco frita, perto de 140 kcal, mais que metade de um prato de cuscuz. Cabem, mas são eles que costumam pesar, não o cuscuz.",
      },
      {
        question: "Comer cuscuz todo dia engorda?",
        answer:
          "Não, se o total do dia couber no seu gasto. Muita gente come cuscuz todo dia no café da manhã. A variedade ajuda a acertar outros nutrientes, mas comer todo dia não é problema por si só.",
      },
      {
        question: "Cuscuz incha a barriga?",
        answer:
          "Algumas pessoas sentem a barriga estufada depois de um prato grande, como acontece com qualquer refeição volumosa. Se acontece sempre, vale observar a porção e o que vai junto; inchaço frequente é para conversar com médico ou nutricionista.",
      },
      {
        question: "Cuscuz emagrece?",
        answer:
          "Nenhum alimento emagrece sozinho. O cuscuz ajuda porque é barato, sustenta e cabe em poucas calorias, mas quem emagrece é quem mantém um déficit de calorias por semanas.",
      },
      {
        question: "Cuscuz é bom antes do treino?",
        answer:
          "É uma boa opção: é carboidrato que dá energia e costuma ser leve no estômago. Coma de 1 a 2 horas antes, com uma fonte de proteína como o ovo.",
      },
    ],
    content: `<img src="/blog-images/cuscuz-engorda-capa.webp" alt="Capa: Cuscuz engorda? Calorias e como montar. Ilustração de cuscuz de milho no prato com um ovo" title="Cuscuz Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Cuscuz engorda?</strong> Não por si só. Em 100 g, o cuscuz de milho cozido tem perto de 113 kcal, menos que o arroz e bem menos que o pão francês. O que muda a conta é o tamanho do prato e o que vai por cima: manteiga, queijo, ovo frito, linguiça.</p>

<h2>Quantas calorias tem o cuscuz?</h2>
<table>
<thead><tr><th>Alimento (100 g)</th><th>Calorias</th><th>Carboidrato</th><th>Proteína</th></tr></thead>
<tbody>
<tr><td><strong>Cuscuz de milho cozido</strong></td><td><strong>113 kcal</strong></td><td>25 g</td><td>2 g</td></tr>
<tr><td>Arroz branco cozido</td><td>128 kcal</td><td>28 g</td><td>2,5 g</td></tr>
<tr><td>Pão francês</td><td>300 kcal</td><td>59 g</td><td>8 g</td></tr>
<tr><td>Cuscuz paulista</td><td>142 kcal</td><td>22,5 g</td><td>2,6 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos. O cuscuz cozido tem bastante água, por isso pesa menos calorias que o pão no mesmo peso. O cuscuz paulista é outro prato, feito com farinha de milho, óleo e recheios, e tem mais gordura (4,6 g contra 0,7 g em 100 g).</p>
<p>Você vai encontrar a ficha do cuscuz e do ovo no fim do artigo, com os números da tabela.</p>

<h2>Cuscuz engorda mais que arroz ou pão?</h2>
<p><strong>Não.</strong> No mesmo peso, o cuscuz cozido tem um pouco menos calorias que o arroz (113 contra 128 kcal em 100 g) e bem menos que o pão francês (300 kcal), porque tem muita água. Na prática:</p>
<ul>
<li><strong>Cuscuz ou arroz:</strong> quase empate. O que decide é o tamanho do prato.</li>
<li><strong>Cuscuz ou pão:</strong> 200 g de cuscuz (perto de 227 kcal) têm menos calorias que 2 pães franceses (perto de 300 kcal) e enchem mais o prato.</li>
</ul>

<h2>Cuscuz de flocão engorda?</h2>
<p>O flocão é a farinha de milho flocada, que vira o cuscuz depois de hidratada e cozida no vapor. O "cuscuz de flocão" é o próprio cuscuz de milho desta página. A farinha seca tem perto de 351 kcal em 100 g; depois de pronta, com a água que absorve, o cuscuz fica perto de 113 kcal em 100 g. Por isso compare sempre o cuscuz pronto, e não a farinha do pacote.</p>

<h2>Um prato de cuscuz: quanto dá?</h2>
<p>A tabela de medidas do IBGE não traz uma porção caseira de cuscuz, então usamos 200 g como exemplo, um prato de café da manhã. Pese o seu uma vez para saber quanto você costuma servir.</p>
<table>
<thead><tr><th>Prato</th><th>Calorias</th><th>Proteína</th></tr></thead>
<tbody>
<tr><td>200 g de cuscuz</td><td>cerca de 227 kcal</td><td>4 g</td></tr>
<tr><td>200 g de cuscuz + 1 ovo cozido (45 g)</td><td>cerca de 293 kcal</td><td>10 g</td></tr>
<tr><td>+ 5 g de manteiga por cima</td><td>mais 36 kcal</td><td>—</td></tr>
<tr><td>Para comparar: 200 g de arroz cozido</td><td>cerca de 257 kcal</td><td>5 g</td></tr>
<tr><td>Para comparar: 2 pães franceses (100 g)</td><td>cerca de 300 kcal</td><td>8 g</td></tr>
</tbody>
</table>

<h2>Cuscuz engorda: sim ou não?</h2>
<p><strong>Engorda o que passa do seu gasto, repetido por semanas.</strong> O cuscuz sozinho é um carboidrato com poucas calorias por peso, barato e que sustenta. O problema aparece quando o prato dobra e chega com manteiga, queijo coalho e linguiça: aí a refeição passa fácil do dobro.</p>
<p>A versão que mais ajuda quem quer emagrecer é a mais simples: cuscuz com ovo cozido ou mexido com pouca gordura, e um pouco de manteiga se você faz questão.</p>

<h2>Cuscuz com ovo, manteiga, queijo, calabresa, frango ou feijão</h2>
<p>O cuscuz é a base; o que vai junto é o que muda a conta. Sempre com 200 g de cuscuz (perto de 227 kcal e 4 g de proteína):</p>
<table>
<thead><tr><th>Cuscuz (200 g) +</th><th>Total</th><th>Proteína</th></tr></thead>
<tbody>
<tr><td>1 ovo cozido (45 g)</td><td>cerca de 293 kcal</td><td>10 g</td></tr>
<tr><td>1 ovo frito (45 g)</td><td>cerca de 335 kcal</td><td>11 g</td></tr>
<tr><td>1 concha de feijão (140 g)</td><td>cerca de 334 kcal</td><td>11 g</td></tr>
<tr><td>1 filé de frango grelhado (100 g)</td><td>cerca de 386 kcal</td><td>36 g</td></tr>
<tr><td>50 g de linguiça de porco frita</td><td>cerca de 367 kcal</td><td>15 g</td></tr>
<tr><td>5 g de manteiga</td><td>cerca de 263 kcal</td><td>4 g</td></tr>
</tbody>
</table>
<p>Valores da TACO; peso do ovo, da concha de feijão e do filé de frango pela tabela de medidas do IBGE. A TACO não tem calabresa nem queijo coalho: a linguiça de porco frita entra como referência, e os 50 g são exemplo nosso.</p>
<ul>
<li><strong>Com ovo ou frango:</strong> as melhores duplas para quem quer emagrecer ou ganhar massa, porque trazem a proteína que o cuscuz não tem. Veja <a href="/blog/quantos-ovos-por-dia">quantos ovos por dia</a>.</li>
<li><strong>Com feijão:</strong> combinação comum no Nordeste, com mais proteína e fibra. Cabe bem numa dieta.</li>
<li><strong>Com manteiga:</strong> 5 g somam perto de 36 kcal. Uma colher bem cheia passa disso fácil.</li>
<li><strong>Com queijo, calabresa ou com leite:</strong> sobem as calorias e, no caso da calabresa e do queijo, a gordura. Cabem de vez em quando, ou em porção menor.</li>
</ul>

<h2>Comer cuscuz todo dia engorda? E a "dieta do cuscuz"?</h2>
<p>Comer cuscuz todo dia não engorda se o total do dia couber no seu gasto. Muita gente come cuscuz todo dia no café da manhã e emagrece. Não existe uma "dieta do cuscuz" que emagreça por causa do cuscuz: o que emagrece é o déficit de calorias mantido por semanas, e o cuscuz é só uma base barata e leve para montar esse cardápio.</p>

<h2>Cuscuz incha a barriga?</h2>
<p>Algumas pessoas sentem a barriga estufada depois de um prato grande, como acontece com qualquer refeição volumosa. Se acontece sempre, observe a porção e o que vai junto. Inchaço frequente é para conversar com médico ou nutricionista. Veja também <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a>.</p>

<h2>Cuscuz no café da manhã, à noite e no treino</h2>
<ul>
<li><strong>Café da manhã:</strong> com ovo, é uma refeição completa e barata. Mais ideias em <a href="/blog/o-que-comer-no-cafe-da-manha-para-treinar">o que comer no café da manhã para treinar</a>.</li>
<li><strong>À noite:</strong> o horário não engorda; o total do dia, sim. Veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</li>
<li><strong>Antes do treino:</strong> de 1 a 2 horas antes, dá energia sem pesar. Veja <a href="/blog/carboidrato-antes-do-treino">carboidrato antes do treino</a>.</li>
</ul>
<p>Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come cuscuz todo dia e emagrece, e gente que corta o cuscuz e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com o cuscuz dentro, se você gosta dele.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: cuscuz de milho cozido, cuscuz paulista, farinha de milho, arroz cozido, pão francês, ovo cozido e frito, feijão carioca, frango grelhado, linguiça de porco frita, manteiga</li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (1 ovo, 1 pão francês, 1 concha de feijão e 1 filé de frango)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/pao-com-ovo-engorda">Pão com ovo engorda?</a></li>
<li><a href="/blog/tapioca-engorda">Tapioca engorda?</a></li>
<li><a href="/blog/batata-doce-emagrece">Batata-doce emagrece?</a></li>
<li><a href="/blog/carboidratos-simples-vs-complexos">Carboidratos simples e complexos</a></li>
</ul>`,
  },
  {
    slug: "banana-engorda",
    title: "Banana Engorda? Calorias e Melhor Horário para Comer",
    metaTitle: "Banana Engorda? Calorias e Melhor Horário para Comer",
    metaDescription:
      "Uma banana prata tem perto de 74 kcal. Veja se banana engorda, a diferença entre prata, nanica e da terra, e se vale comer à noite, antes ou depois do treino.",
    excerpt:
      "Quantas calorias tem uma banana, prata, nanica, maçã ou da terra, por que ela não engorda sozinha, e como encaixar no café, no treino e à noite.",
    category: "Nutrição",
    date: "2026-11-06",
    readTime: "7 min",
    author: "Montinho",
    tags: ["banana", "calorias", "frutas", "pré-treino", "dieta"],
    faq: [
      {
        question: "Banana engorda?",
        answer:
          "Não. Uma banana prata tem perto de 74 kcal. Engorda o que passa do seu gasto ao longo das semanas, e uma ou duas bananas por dia cabem com folga na maioria das dietas.",
      },
      {
        question: "Quantas calorias tem uma banana?",
        answer:
          "Pela TACO, com o peso de 1 banana da pesquisa do IBGE (75 g): banana prata, perto de 74 kcal; nanica, perto de 69 kcal. A banana da terra tem mais: 128 kcal em 100 g.",
      },
      {
        question: "Qual banana engorda mais?",
        answer:
          "Em 100 g, a banana da terra é a mais calórica (128 kcal), seguida da ouro (112), da prata (98), da nanica (92) e da maçã (87). A diferença entre prata, nanica e maçã é pequena; o que muda mais é o tamanho da fruta.",
      },
      {
        question: "Comer 2 bananas por dia engorda?",
        answer:
          "Não. Duas bananas prata somam perto de 147 kcal, o que cabe com folga na maioria das dietas. Três ficam perto de 221 kcal e quatro, perto de 295 kcal; aí já vale contar no total do dia.",
      },
      {
        question: "O que engorda mais, banana ou pão?",
        answer:
          "O pão. Um pão francês (50 g) tem perto de 150 kcal; uma banana prata (75 g), perto de 74 kcal. Em 100 g, são 300 kcal do pão contra 98 da banana.",
      },
      {
        question: "Banana com aveia ou com leite engorda?",
        answer:
          "Somam calorias, mas cabem. Uma banana com 2 colheres de sopa de aveia (30 g) fica perto de 192 kcal. Com leite, a conta depende do copo e do tipo de leite; vitamina com açúcar ou leite condensado é o que pesa.",
      },
      {
        question: "Banana engorda a barriga ou incha a barriga?",
        answer:
          "Nenhum alimento engorda só a barriga: a gordura se acumula no corpo todo, de acordo com o total de calorias. Algumas pessoas sentem a barriga estufada depois de comer fruta, principalmente em quantidade; se for frequente, vale conversar com médico ou nutricionista.",
      },
      {
        question: "Banana à noite engorda?",
        answer:
          "Não. O horário não engorda; o que conta é o total do dia. Uma banana à noite é um lanche leve, de perto de 70 kcal.",
      },
      {
        question: "Banana antes do treino é bom?",
        answer:
          "É uma das melhores opções: carboidrato que dá energia, fácil de levar e leve no estômago. Coma de 30 a 60 minutos antes.",
      },
      {
        question: "Quantas bananas posso comer por dia?",
        answer:
          "Para a maioria das pessoas, uma a três bananas por dia cabem bem, junto com outras frutas. Duas bananas somam perto de 150 kcal. Quem tem doença renal ou orientação médica para controlar potássio deve seguir o que o médico disser.",
      },
      {
        question: "Banana emagrece?",
        answer:
          "Nenhum alimento emagrece sozinho. A banana ajuda porque é prática, sustenta e substitui doces e lanches mais calóricos. Quem emagrece é quem mantém um déficit de calorias por semanas.",
      },
    ],
    content: `<img src="/blog-images/banana-engorda-capa.webp" alt="Capa: Banana engorda? Calorias e melhor horário. Ilustração de um cacho de bananas" title="Banana Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Banana engorda?</strong> Não. Uma banana prata tem perto de 74 kcal. Ela tem fama de "fruta que engorda" por ser mais doce que outras, mas o que engorda é o total do dia, e uma banana mal aparece nessa conta.</p>

<h2>Quantas calorias tem uma banana?</h2>
<table>
<thead><tr><th>Banana</th><th>Em 100 g</th><th>1 banana (75 g)</th></tr></thead>
<tbody>
<tr><td><strong>Prata</strong></td><td>98 kcal</td><td><strong>cerca de 74 kcal</strong></td></tr>
<tr><td><strong>Nanica</strong></td><td>92 kcal</td><td><strong>cerca de 69 kcal</strong></td></tr>
<tr><td>Maçã</td><td>87 kcal</td><td>cerca de 65 kcal</td></tr>
<tr><td>Ouro</td><td>112 kcal</td><td>cerca de 84 kcal</td></tr>
<tr><td>Da terra</td><td>128 kcal</td><td>cerca de 96 kcal (a fruta costuma ser bem maior)</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, com o peso de 1 banana da tabela de medidas do IBGE (75 g). Na maçã, na ouro e na da terra, os 75 g servem só para comparar: a banana ouro costuma ser menor, e a da terra, bem maior, comida cozida ou frita.</p>
<p>Uma banana prata tem perto de 19,5 g de carboidrato, 1,5 g de fibra e 268 mg de potássio. Você vai encontrar a ficha da prata e da nanica no fim do artigo.</p>

<h2>Banana engorda: sim ou não?</h2>
<p><strong>Engorda o que passa do seu gasto, repetido por semanas.</strong> Perto de 70 kcal é pouco: uma banana por dia, durante um mês, não muda a balança de ninguém se o resto do dia está no lugar. O que costuma pesar é o que vem junto: leite condensado, granola, açúcar, mel, ou a banana virar sobremesa frita.</p>
<p>A banana até ajuda quem quer emagrecer: sustenta, mata a vontade de doce e substitui lanches mais calóricos. Veja as <a href="/blog/melhores-frutas-para-emagrecer">melhores frutas para emagrecer</a>.</p>

<h2>Qual banana engorda mais?</h2>
<p>Em 100 g, a banana da terra é a mais calórica, seguida da ouro, da prata, da nanica e da maçã. Entre prata, nanica e maçã, a diferença é pequena, de 5 a 10 kcal por fruta. O que muda mais é o tamanho: uma banana grande pode ter o dobro de uma pequena.</p>

<h2>Comer 2, 3 ou 4 bananas por dia engorda?</h2>
<table>
<thead><tr><th>Bananas prata por dia</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>1</td><td>cerca de 74 kcal</td></tr>
<tr><td>2</td><td>cerca de 147 kcal</td></tr>
<tr><td>3</td><td>cerca de 221 kcal</td></tr>
<tr><td>4</td><td>cerca de 295 kcal</td></tr>
</tbody>
</table>
<p>Duas bananas por dia não engordam ninguém que está com o resto do dia no lugar. A partir de três ou quatro, a conta já pesa o mesmo que uma refeição pequena, e vale contar no total. Comer muita banana engorda pelo mesmo motivo que comer muito de qualquer coisa: as calorias somam.</p>

<h2>O que engorda mais, banana ou pão?</h2>
<p>O pão. Um pão francês (50 g) tem perto de 150 kcal, o dobro de uma banana prata (perto de 74 kcal). Em 100 g, o pão tem 300 kcal e a banana, 98. Trocar o pão pela banana no lanche diminui as calorias, mas também a proteína; o ideal é a banana acompanhada de iogurte, ovo ou leite.</p>

<h2>Banana com aveia, com leite ou com pasta de amendoim</h2>
<ul>
<li><strong>Com aveia:</strong> uma banana com 2 colheres de sopa de aveia (30 g) fica perto de 192 kcal, com mais fibra. Bom café da manhã ou pré-treino.</li>
<li><strong>Com leite (vitamina):</strong> a conta depende do tamanho do copo e do tipo de leite. O que pesa costuma ser o açúcar, o leite condensado ou o achocolatado.</li>
<li><strong>Com pasta de amendoim:</strong> bom lanche, mas a pasta é calórica. Veja <a href="/blog/pasta-de-amendoim-como-escolher">como escolher a pasta de amendoim</a>.</li>
</ul>

<h2>Banana engorda a barriga?</h2>
<p>Nenhum alimento engorda só a barriga: a gordura se acumula no corpo todo, de acordo com o total de calorias. Algumas pessoas sentem a barriga estufada depois de comer fruta, principalmente em quantidade, e isso não é gordura. Se for frequente, vale conversar com médico ou nutricionista. Veja <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a>.</p>

<h2>Banana à noite, antes e depois do treino</h2>
<ul>
<li><strong>À noite:</strong> o horário não engorda. Uma banana é um lanche leve. Veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</li>
<li><strong>Antes do treino:</strong> uma das melhores opções. Carboidrato fácil de digerir, de 30 a 60 minutos antes. Mais em <a href="/blog/frutas-antes-do-treino">frutas antes do treino</a>.</li>
<li><strong>Depois do treino:</strong> combina bem com uma fonte de proteína, como iogurte, leite ou whey.</li>
</ul>

<h2>Quantas bananas comer por dia na dieta?</h2>
<p>Para a maioria das pessoas, <strong>uma a três bananas por dia</strong> cabem bem, junto com outras frutas. Duas bananas somam perto de 150 kcal. Quem tem doença renal ou orientação médica para controlar potássio deve seguir o que o médico disser.</p>
<p>Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que corta a banana "porque engorda" e continua sem emagrecer, porque o que pesava estava em outro lugar. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, e fruta que você gosta ajuda a manter.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: banana prata, nanica, maçã, ouro e da terra, pão francês, aveia em flocos</li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (1 banana, 1 pão francês, 1 colher de sopa de aveia)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/melhores-frutas-para-emagrecer">Melhores frutas para emagrecer</a></li>
<li><a href="/blog/frutas-antes-do-treino">Frutas antes do treino</a></li>
<li><a href="/blog/cuscuz-engorda">Cuscuz engorda?</a></li>
<li><a href="/blog/amendoim-engorda">Amendoim engorda?</a></li>
</ul>`,
  },
  {
    slug: "amendoim-engorda",
    title: "Amendoim Engorda? Calorias por Punhado e Quanto Comer",
    metaTitle: "Amendoim Engorda? Calorias por Punhado e Quanto Comer",
    metaDescription:
      "Um punhado de amendoim torrado tem perto de 182 kcal. Veja quando o amendoim engorda, cru, torrado ou em paçoca, quanto comer por dia e se ajuda no ganho de massa.",
    excerpt:
      "Quantas calorias tem o amendoim por punhado, colher e pacote, a diferença entre cru, torrado, paçoca e pé-de-moleque, e como comer sem exagerar.",
    category: "Nutrição",
    date: "2026-11-06",
    readTime: "7 min",
    author: "Montinho",
    tags: ["amendoim", "calorias", "lanches", "gordura", "dieta"],
    faq: [
      {
        question: "Amendoim engorda?",
        answer:
          "Pode engordar, porque é muito calórico: perto de 606 kcal em 100 g de amendoim torrado. Um punhado (30 g) tem perto de 182 kcal, o que cabe numa dieta. O problema é que é fácil comer o pacote inteiro sem perceber.",
      },
      {
        question: "Quantas calorias tem o amendoim?",
        answer:
          "Pela TACO, o amendoim torrado salgado tem perto de 606 kcal em 100 g. Com as medidas do IBGE: 1 colher de sopa (17 g) tem perto de 103 kcal, 1 punhado (30 g) perto de 182 kcal e 1 pacote (50 g) perto de 303 kcal.",
      },
      {
        question: "Quanto amendoim posso comer por dia?",
        answer:
          "Para a maioria das pessoas, um punhado (perto de 30 g) por dia cabe bem. Mais que isso pode caber, desde que você conte as calorias no total do dia.",
      },
      {
        question: "Quem está de dieta pode comer amendoim?",
        answer:
          "Pode, contando a porção. Um punhado (30 g) tem perto de 182 kcal e cabe na maioria das dietas. O cuidado é não comer do pacote: sirva a porção num pote e guarde o resto.",
      },
      {
        question: "Comer amendoim todos os dias engorda?",
        answer:
          "Não, se a porção couber no total do dia. Um punhado por dia, todo dia, soma perto de 182 kcal. O que engorda é o pacote inteiro todo dia sem contar.",
      },
      {
        question: "Amendoim cru ou torrado engorda mais?",
        answer:
          "Em 100 g, o torrado salgado tem perto de 606 kcal e o cru, perto de 544 kcal, porque perde água ao torrar. A diferença por punhado é pequena; o que pesa é a quantidade.",
      },
      {
        question: "Amendoim japonês engorda?",
        answer:
          "Ele vem coberto por uma casquinha de farinha e costuma ser frito, o que soma calorias à do grão. A TACO não tem o amendoim japonês; a fonte certa para as calorias é o rótulo do pacote, e a porção a contar é a mesma: um punhado.",
      },
      {
        question: "Amendoim engorda a barriga?",
        answer:
          "Nenhum alimento engorda só a barriga: a gordura se acumula no corpo todo, de acordo com o total de calorias. O amendoim engorda a barriga do mesmo jeito que engorda o resto: quando passa do gasto.",
      },
      {
        question: "Paçoca engorda?",
        answer:
          "É calórica: perto de 487 kcal em 100 g, e o pé-de-moleque, perto de 503 kcal, com bastante açúcar. Cabem de vez em quando, contando as calorias.",
      },
      {
        question: "Amendoim ajuda a ganhar massa muscular?",
        answer:
          "Ajuda a somar calorias e tem alguma proteína: perto de 6,8 g por punhado. Mas para ganhar massa a proteína do dia inteiro conta mais, e o amendoim é mais gordura que proteína.",
      },
      {
        question: "Amendoim à noite engorda?",
        answer:
          "O horário não engorda. O que conta é o total do dia. O cuidado é o mesmo de qualquer hora: comer da mão, uma porção, e não do pacote.",
      },
    ],
    content: `<img src="/blog-images/amendoim-engorda-capa.webp" alt="Capa: Amendoim engorda? Calorias por punhado. Ilustração de amendoim na casca e numa tigela" title="Amendoim Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Amendoim engorda?</strong> Pode engordar, e é por um motivo simples: ele é muito calórico. Um punhado tem perto de 182 kcal, o que cabe tranquilo numa dieta. O problema é que ninguém come um punhado: come o pacote assistindo TV, e aí são mais de 300 kcal sem perceber.</p>

<h2>Quantas calorias tem o amendoim?</h2>
<table>
<thead><tr><th>Porção (amendoim torrado salgado)</th><th>Calorias</th><th>Proteína</th><th>Gordura</th></tr></thead>
<tbody>
<tr><td>1 colher de sopa (17 g)</td><td>cerca de 103 kcal</td><td>3,8 g</td><td>9 g</td></tr>
<tr><td><strong>1 punhado (30 g)</strong></td><td><strong>cerca de 182 kcal</strong></td><td><strong>6,8 g</strong></td><td>16 g</td></tr>
<tr><td>1 pacote (50 g)</td><td>cerca de 303 kcal</td><td>11 g</td><td>27 g</td></tr>
<tr><td>100 g</td><td>606 kcal</td><td>22,5 g</td><td>54 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, com as porções da tabela de medidas do IBGE. Você vai encontrar a ficha do amendoim torrado e do cru no fim do artigo.</p>

<h2>Amendoim engorda: sim ou não?</h2>
<p><strong>Engorda o que passa do seu gasto, repetido por semanas.</strong> O amendoim não é vilão: tem fibra (7,8 g em 100 g) e alguma proteína, e sustenta. Mas é um alimento em que pouco volume tem muita caloria. Quem come direto do pacote come mais do que imagina.</p>
<p>O jeito mais simples de controlar: <strong>servir um punhado num pote e guardar o pacote</strong>.</p>

<h2>Para que o amendoim é bom?</h2>
<p>Pela TACO, um punhado (30 g) de amendoim torrado traz perto de 6,8 g de proteína, 2,3 g de fibra e 48 mg de magnésio. É um lanche que sustenta, fácil de levar e barato. A outra face é a mesma do começo: são 182 kcal em pouco volume, e o torrado salgado tem perto de 113 mg de sódio no punhado.</p>

<h2>Cru, torrado, cozido, japonês, paçoca e pé-de-moleque</h2>
<table>
<thead><tr><th>Em 100 g</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Amendoim cru</td><td>544 kcal</td></tr>
<tr><td>Amendoim torrado salgado</td><td>606 kcal</td></tr>
<tr><td>Paçoca</td><td>487 kcal</td></tr>
<tr><td>Pé-de-moleque</td><td>503 kcal</td></tr>
</tbody>
</table>
<ul>
<li><strong>Sem casca ou com casca:</strong> é o mesmo amendoim; a casca não se come. Conte o peso já descascado.</li>
<li><strong>Cozido:</strong> a TACO não tem o amendoim cozido. Como ele absorve água, tende a ter menos calorias por peso que o torrado; o cru é a referência mais próxima.</li>
<li><strong>Japonês:</strong> vem coberto por uma casquinha de farinha e costuma ser frito. A TACO não tem esse item; veja as calorias no rótulo do pacote.</li>
</ul>
<p>O torrado tem mais calorias por peso que o cru porque perde água. A paçoca e o pé-de-moleque têm um pouco menos por peso, mas trazem bastante açúcar. <strong>Pasta de amendoim engorda?</strong> Pelo mesmo motivo do grão: é calórica, e a colher costuma vir cheia demais. Veja <a href="/blog/pasta-de-amendoim-como-escolher">como escolher a pasta de amendoim</a>.</p>

<h2>Quanto amendoim comer por dia?</h2>
<p>Para a maioria das pessoas, <strong>um punhado, perto de 30 g</strong>, cabe bem. Mais que isso pode caber, desde que você conte no total do dia. Quem quer emagrecer costuma se dar melhor com a porção já separada; quem quer ganhar peso pode usar o amendoim justamente porque soma calorias com pouco volume.</p>
<p>Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Como usar o amendoim para emagrecer</h2>
<ul>
<li><strong>Sirva a porção num pote</strong> e guarde o pacote. É o que mais funciona.</li>
<li><strong>Use no lugar de um lanche mais calórico</strong>, como biscoito recheado ou salgadinho, e não além dele.</li>
<li><strong>Junte com fruta</strong> para ter mais volume na mesma refeição.</li>
<li><strong>Prefira o sem sal ou o cru</strong> se você come todo dia, para não somar sódio.</li>
</ul>
<p>Amendoim engorda a barriga? Nenhum alimento engorda só a barriga: a gordura se acumula no corpo todo, de acordo com o total de calorias.</p>

<h2>Amendoim e ganho de massa</h2>
<p>Um punhado tem perto de 6,8 g de proteína. Ajuda, mas o amendoim é mais gordura que proteína: 16 g de gordura no mesmo punhado. Para ganhar massa, o que mais importa é a proteína do dia inteiro. Veja <a href="/blog/quanta-proteina-por-dia-para-ganhar-massa-muscular">quanta proteína por dia</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come amendoim todo dia e emagrece, e gente que corta e não emagrece. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, e um punhado de algo que você gosta ajuda a manter.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: amendoim cru e torrado salgado, paçoca, pé-de-moleque</li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (colher de sopa, punhado e pacote de amendoim)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/pasta-de-amendoim-como-escolher">Pasta de amendoim: como escolher</a></li>
<li><a href="/blog/banana-engorda">Banana engorda?</a></li>
<li><a href="/blog/cuscuz-engorda">Cuscuz engorda?</a></li>
<li><a href="/blog/o-que-comer-a-noite-para-nao-engordar">O que comer à noite para não engordar</a></li>
</ul>`,
  },
];
