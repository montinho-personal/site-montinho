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
    readTime: "5 min",
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
        question: "Cuscuz é melhor que pão para emagrecer?",
        answer:
          "Por peso, o cuscuz tem bem menos calorias: perto de 113 kcal em 100 g, contra 300 do pão francês, porque o cuscuz cozido tem muita água. Mas o que conta é a porção que você come; os dois cabem numa dieta.",
      },
      {
        question: "Cuscuz à noite engorda?",
        answer:
          "O horário não engorda. O que conta é o total do dia. Cuscuz com ovo à noite é uma janta leve e prática, se as calorias do resto do dia couberem.",
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

<h2>Cuscuz com ovo, manteiga ou queijo</h2>
<ul>
<li><strong>Com ovo:</strong> a melhor dupla. O ovo traz a proteína que o cuscuz não tem. Veja <a href="/blog/quantos-ovos-por-dia">quantos ovos por dia</a>.</li>
<li><strong>Com manteiga:</strong> 5 g somam perto de 36 kcal. Uma colher bem cheia passa disso fácil.</li>
<li><strong>Com queijo coalho ou linguiça:</strong> sobem bastante as calorias e a gordura. Cabem de vez em quando, ou em porção menor.</li>
</ul>

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
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: cuscuz de milho cozido, cuscuz paulista, arroz cozido, pão francês, ovo cozido, manteiga</li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (1 ovo e 1 pão francês)</li>
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
    readTime: "5 min",
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
<tr><td>Maçã</td><td>87 kcal</td><td>—</td></tr>
<tr><td>Ouro</td><td>112 kcal</td><td>—</td></tr>
<tr><td>Da terra</td><td>128 kcal</td><td>—</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, com o peso de 1 banana da tabela de medidas do IBGE (75 g, para a prata e a nanica). A banana da terra costuma ser bem maior e é comida cozida ou frita, então a porção muda bastante.</p>
<p>Uma banana prata tem perto de 19,5 g de carboidrato, 1,5 g de fibra e 268 mg de potássio. Você vai encontrar a ficha da prata e da nanica no fim do artigo.</p>

<h2>Banana engorda: sim ou não?</h2>
<p><strong>Engorda o que passa do seu gasto, repetido por semanas.</strong> Perto de 70 kcal é pouco: uma banana por dia, durante um mês, não muda a balança de ninguém se o resto do dia está no lugar. O que costuma pesar é o que vem junto: leite condensado, granola, açúcar, mel, ou a banana virar sobremesa frita.</p>
<p>A banana até ajuda quem quer emagrecer: sustenta, mata a vontade de doce e substitui lanches mais calóricos. Veja as <a href="/blog/melhores-frutas-para-emagrecer">melhores frutas para emagrecer</a>.</p>

<h2>Qual banana engorda mais?</h2>
<p>Em 100 g, a banana da terra é a mais calórica, seguida da ouro, da prata, da nanica e da maçã. Entre prata, nanica e maçã, a diferença é pequena, de 5 a 10 kcal por fruta. O que muda mais é o tamanho: uma banana grande pode ter o dobro de uma pequena.</p>

<h2>Banana à noite, antes e depois do treino</h2>
<ul>
<li><strong>À noite:</strong> o horário não engorda. Uma banana é um lanche leve. Veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</li>
<li><strong>Antes do treino:</strong> uma das melhores opções. Carboidrato fácil de digerir, de 30 a 60 minutos antes. Mais em <a href="/blog/frutas-antes-do-treino">frutas antes do treino</a>.</li>
<li><strong>Depois do treino:</strong> combina bem com uma fonte de proteína, como iogurte, leite ou whey.</li>
<li><strong>Com aveia ou pasta de amendoim:</strong> bom lanche, mas a pasta é calórica. Veja <a href="/blog/pasta-de-amendoim-como-escolher">como escolher a pasta de amendoim</a>.</li>
</ul>

<h2>Quantas bananas por dia?</h2>
<p>Para a maioria das pessoas, <strong>uma a três bananas por dia</strong> cabem bem, junto com outras frutas. Duas bananas somam perto de 150 kcal. Quem tem doença renal ou orientação médica para controlar potássio deve seguir o que o médico disser.</p>
<p>Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que corta a banana "porque engorda" e continua sem emagrecer, porque o que pesava estava em outro lugar. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, e fruta que você gosta ajuda a manter.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: banana prata, nanica, maçã, ouro e da terra</li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (1 banana)</li>
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
    readTime: "5 min",
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
        question: "Amendoim cru ou torrado engorda mais?",
        answer:
          "Em 100 g, o torrado salgado tem perto de 606 kcal e o cru, perto de 544 kcal, porque perde água ao torrar. A diferença por punhado é pequena; o que pesa é a quantidade.",
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

<h2>Cru, torrado, paçoca e pé-de-moleque</h2>
<table>
<thead><tr><th>Em 100 g</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Amendoim cru</td><td>544 kcal</td></tr>
<tr><td>Amendoim torrado salgado</td><td>606 kcal</td></tr>
<tr><td>Paçoca</td><td>487 kcal</td></tr>
<tr><td>Pé-de-moleque</td><td>503 kcal</td></tr>
</tbody>
</table>
<p>O torrado tem mais calorias por peso que o cru porque perde água. A paçoca e o pé-de-moleque têm um pouco menos por peso, mas trazem bastante açúcar. Para a pasta de amendoim, veja <a href="/blog/pasta-de-amendoim-como-escolher">como escolher a pasta de amendoim</a>.</p>

<h2>Quanto amendoim comer por dia?</h2>
<p>Para a maioria das pessoas, <strong>um punhado, perto de 30 g</strong>, cabe bem. Mais que isso pode caber, desde que você conte no total do dia. Quem quer emagrecer costuma se dar melhor com a porção já separada; quem quer ganhar peso pode usar o amendoim justamente porque soma calorias com pouco volume.</p>
<p>Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

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
