import type { BlogPost } from "./blog";

/**
 * "Feijão engorda?", "Pão de queijo engorda?" e "Maçã engorda?" (15/11/2026).
 * Planejador de Palavras-chave do Google Ads (Brasil): "feijão engorda" e
 * "pão de queijo engorda" 8.100/mês cada; "maçã engorda" 5.400. Pedido do
 * Montinho ("pode criar próximos artigos"): escritos sem prints e sem export
 * do Answer the Public; H2 e FAQ a revisar quando chegarem.
 *
 * Canibalização: nenhum artigo com feijão, feijoada, pão de queijo ou maçã no
 * slug ou título (busca normalizada). Vizinhos linkados: arroz, tapioca, pão
 * com ovo, banana, manga, melancia, frutas para emagrecer.
 *
 * Números: TACO 4ª edição, pela base do site, por 100 g.
 * - Feijão carioca cozido: 76 kcal, 13,6 g carboidrato, 4,8 g proteína, 0,5 g
 *   gordura, 8,5 g fibra. Preto cozido: 77 kcal, 14,0 g, 4,5 g, 8,4 g fibra.
 *   Outros cozidos: fradinho 78, jalo 93, rajado 85, rosinha 68, roxo 77.
 *   Lentilha cozida 93. Feijão tropeiro mineiro 152. Arroz tipo 1 cozido 128.
 *   Porções (POF 2008-2009, IBGE), carioca e preto: concha 140 g (107 kcal no
 *   carioca), escumadeira 35 g (27), colher de sopa 17 g (13). Lentilha: concha
 *   160 g (148). Arroz: escumadeira 85 g (109).
 * - Pão de queijo assado: 363 kcal, 34,2 g carboidrato, 5,1 g proteína, 24,6 g
 *   gordura, 0,6 g fibra. A base não tem medida caseira de pão de queijo: 20 g,
 *   40 g e 50 g são exemplos nossos (73, 145 e 182 kcal). Pão francês 300 kcal,
 *   unidade 50 g (IBGE, 150 kcal). Tapioca com manteiga 348. Biscoito de
 *   polvilho doce 438. Pão de queijo congelado/industrializado: vale o rótulo.
 * - Maçã fuji com casca: 55,5 kcal, 15,2 g carboidrato, 1,3 g fibra. Argentina
 *   com casca: 62,5 kcal, 2,0 g fibra. Porções (IBGE, fuji): unidade 150 g
 *   (83 kcal), fatia 37,5 g (21), porção 130 g (72). Comparação por 100 g:
 *   pera williams 53, banana prata 98, manga palmer 73, laranja-pera 37,
 *   melancia 33. Maçã verde e suco de maçã: sem valor na base.
 *
 * Ferramenta: cartão de link da Calculadora de Déficit (ARTIGOS_COM_LINK_DEFICIT)
 * e ficha de alimento (FICHAS_POR_ARTIGO).
 */

const TACO = `<a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>`;
const IBGE = `<a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a>`;
const NAO_SE_COMPARE = (alimento: string) => `<h2>Não se compare</h2>
<p>Tem gente que come ${alimento} todo dia e emagrece, e gente que corta e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com o que você gosta dentro, na medida.</p>`;

export const FEIJAO_PAODEQUEIJO_MACA_POSTS: BlogPost[] = [
  {
    slug: "feijao-engorda",
    title: "Feijão Engorda? Calorias por Concha, Feijão com Arroz e à Noite",
    metaTitle: "Feijão Engorda? Calorias por Concha, com Arroz e à Noite",
    metaDescription:
      "Uma concha de feijão carioca tem perto de 107 kcal e muita fibra. Veja se feijão engorda, com arroz, à noite, qual tipo tem mais calorias e por que ele incha a barriga.",
    excerpt:
      "Quantas calorias tem o feijão por concha e colher, carioca ou preto, se feijão com arroz engorda, feijão à noite, proteína ou carboidrato e por que dá gases.",
    category: "Nutrição",
    date: "2026-11-15",
    updatedAt: "2026-11-18",
    readTime: "6 min",
    author: "Montinho",
    tags: ["feijao", "calorias", "fibra", "arroz com feijao", "dieta"],
    faq: [
      {
        question: "Feijão engorda?",
        answer:
          "Sozinho, não. Uma concha de feijão carioca cozido (140 g) tem perto de 107 kcal e quase 12 g de fibra. Ele só engorda se o total do dia passar do seu gasto por semanas, como qualquer alimento.",
      },
      {
        question: "Quantas calorias tem uma concha de feijão?",
        answer:
          "Pelas medidas do IBGE e a TACO, 1 concha de feijão carioca cozido (140 g) tem perto de 107 kcal; 1 escumadeira (35 g), perto de 27 kcal; 1 colher de sopa (17 g), perto de 13 kcal.",
      },
      {
        question: "Feijão com arroz engorda?",
        answer:
          "Não necessariamente. Duas escumadeiras de arroz (perto de 218 kcal) com uma concha de feijão (perto de 107 kcal) somam cerca de 325 kcal antes da carne e da salada. É uma base boa para quem quer emagrecer; o que muda é a porção.",
      },
      {
        question: "Feijão à noite engorda?",
        answer:
          "O horário não engorda; o total do dia, sim. Se o feijão do jantar cabe nas suas calorias, ele não engorda mais do que no almoço.",
      },
      {
        question: "Qual feijão engorda mais?",
        answer:
          "Cozidos, ficam próximos: o rosinha tem 68 kcal em 100 g, o carioca 76, o preto 77, o fradinho 78, o rajado 85 e o jalo 93, pela TACO. A diferença no prato é pequena.",
      },
      {
        question: "Feijão é proteína ou carboidrato?",
        answer:
          "Os dois, com mais carboidrato. 100 g de feijão carioca cozido têm 13,6 g de carboidrato, 4,8 g de proteína e 8,5 g de fibra. Junto com uma carne, ovo ou outra proteína, completa bem a refeição.",
      },
      {
        question: "Por que o feijão dá gases e incha a barriga?",
        answer:
          "Porque tem bastante fibra. Quem não está acostumado sente mais. Começar com porções menores e beber água costuma ajudar. Se o incômodo for frequente, procure médico ou nutricionista.",
      },
      {
        question: "Feijão emagrece?",
        answer:
          "Nenhum alimento emagrece sozinho. O feijão ajuda porque sustenta: tem fibra e um pouco de proteína para poucas calorias.",
      },
      {
        question: "Engorda mais arroz ou feijão?",
        answer:
          "O arroz. 100 g de arroz branco cozido têm 128 kcal; 100 g de feijão carioca cozido, 76.",
      },
      {
        question: "Quantas colheres de arroz e feijão posso comer para emagrecer?",
        answer:
          "Não existe um número certo de colheres para emagrecer: o que decide é o total do dia. Pelas medidas do IBGE e a TACO, 1 colher de sopa de arroz (25 g) tem perto de 32 kcal e 1 colher de sopa de feijão (17 g), perto de 13 kcal. Um prato com 4 colheres de arroz e 4 de feijão fica perto de 180 kcal. A quantidade que cabe no seu dia é com o nutricionista.",
      },
      {
        question: "Feijão engorda mais que arroz?",
        answer:
          "Não. No mesmo peso, o arroz tem mais calorias: 128 kcal em 100 g de arroz branco cozido, contra 76 kcal no feijão carioca. Uma escumadeira de arroz (85 g) tem perto de 109 kcal; uma concha de feijão (140 g), perto de 107.",
      },
      {
        question: "Quanto feijão posso comer por dia?",
        answer:
          "Para a maioria das pessoas, uma ou duas conchas por refeição cabem bem. Mais que isso pode caber, desde que você conte no total do dia.",
      },
    ],
    content: `<img src="/blog-images/feijao-engorda-capa.webp" alt="Capa: Feijão engorda? Ilustração de uma panela de feijão com concha e um prato de arroz" title="Feijão Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Feijão engorda?</strong> Sozinho, não. Uma concha de feijão carioca tem perto de 107 kcal e quase 12 g de fibra, o que ajuda a sustentar. O feijão só pesa se o prato todo, somado ao resto do dia, passar do seu gasto por semanas.</p>

<h2>Quantas calorias tem o feijão?</h2>
<table>
<thead><tr><th>Feijão carioca cozido</th><th>Calorias</th><th>Proteína</th><th>Fibra</th></tr></thead>
<tbody>
<tr><td>1 colher de sopa (17 g)</td><td>cerca de 13 kcal</td><td>0,8 g</td><td>1,4 g</td></tr>
<tr><td>1 escumadeira (35 g)</td><td>cerca de 27 kcal</td><td>1,7 g</td><td>3,0 g</td></tr>
<tr><td><strong>1 concha (140 g)</strong></td><td><strong>cerca de 107 kcal</strong></td><td>6,7 g</td><td>11,9 g</td></tr>
<tr><td>100 g</td><td>76 kcal</td><td>4,8 g</td><td>8,5 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, com as porções da tabela de medidas do IBGE. O feijão preto é quase igual: 77 kcal em 100 g e as mesmas medidas caseiras. Você vai encontrar a ficha do feijão no fim do artigo.</p>

<h2>Feijão com arroz engorda?</h2>
<p>Não necessariamente. Um prato com <strong>duas escumadeiras de arroz</strong> (170 g, perto de 218 kcal) e <strong>uma concha de feijão</strong> (140 g, perto de 107 kcal) fica em torno de <strong>325 kcal</strong> antes da carne e da salada. É uma base boa para quem quer emagrecer: o feijão sustenta e o arroz dá energia. O que muda é a porção. Veja <a href="/blog/arroz-engorda">arroz engorda?</a>.</p>

<h2>Quantas colheres de arroz e feijão?</h2>
<p>Não existe um número certo de colheres para emagrecer: o que decide é o total do dia. Mas dá para ver quanto cada medida pesa no prato:</p>
<table>
<thead><tr><th>Medida caseira</th><th>Arroz branco cozido</th><th>Feijão carioca cozido</th></tr></thead>
<tbody>
<tr><td>1 colher de sopa</td><td>25 g, cerca de 32 kcal</td><td>17 g, cerca de 13 kcal</td></tr>
<tr><td>1 escumadeira</td><td>85 g, cerca de 109 kcal</td><td>35 g, cerca de 27 kcal</td></tr>
<tr><td>1 concha</td><td>—</td><td>140 g, cerca de 107 kcal</td></tr>
<tr><td>4 colheres de sopa</td><td>cerca de 128 kcal</td><td>cerca de 52 kcal</td></tr>
</tbody>
</table>
<p>Pesos da tabela de medidas do IBGE; calorias da TACO. Repare que, colher por colher, o arroz pesa mais do que o feijão. Quem quer encaixar o prato num déficit costuma mexer primeiro na quantidade de arroz e no que vai junto (óleo, linguiça, bacon), não no feijão. Quanto cabe no seu dia é uma conta para fazer com o nutricionista; para ter uma ideia do seu gasto, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Qual feijão engorda mais?</h2>
<table>
<thead><tr><th>Cozido (100 g)</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Jalo</td><td>93 kcal</td></tr>
<tr><td>Lentilha (para comparar)</td><td>93 kcal</td></tr>
<tr><td>Rajado</td><td>85 kcal</td></tr>
<tr><td>Fradinho</td><td>78 kcal</td></tr>
<tr><td>Preto</td><td>77 kcal</td></tr>
<tr><td>Roxo</td><td>77 kcal</td></tr>
<tr><td>Carioca</td><td>76 kcal</td></tr>
<tr><td>Rosinha</td><td>68 kcal</td></tr>
</tbody>
</table>
<p>A diferença entre os tipos é pequena no prato. O que pesa mais é o preparo: o <strong>feijão tropeiro</strong> tem 152 kcal em 100 g, o dobro do carioca, por causa da farinha, do bacon e da gordura.</p>

<h2>Feijão é proteína ou carboidrato?</h2>
<p>Os dois, com mais carboidrato: 100 g de carioca cozido têm <strong>13,6 g de carboidrato</strong>, <strong>4,8 g de proteína</strong> e <strong>8,5 g de fibra</strong>. Ele ajuda na proteína do dia, mas sozinho não basta para quem treina. Junto com uma carne, ovo ou outra fonte de proteína, completa a refeição. Veja <a href="/blog/alimentos-ricos-em-proteina">alimentos ricos em proteína</a>.</p>

<h2>Feijão à noite engorda?</h2>
<p>O horário não engorda; o total do dia, sim. Se o feijão do jantar cabe nas suas calorias, ele não engorda mais do que no almoço. Veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</p>

<h2>Por que o feijão dá gases e incha a barriga?</h2>
<p>Porque tem bastante fibra, e quem não está acostumado sente mais. Começar com porções menores e beber água costuma ajudar. Se o incômodo for frequente, procure médico ou nutricionista. Veja <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a> e <a href="/blog/alimentos-ricos-em-fibra">alimentos ricos em fibra</a>.</p>

<h2>Quanto feijão comer por dia?</h2>
<p>Para a maioria das pessoas, <strong>uma ou duas conchas por refeição</strong> cabem bem. Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

${NAO_SE_COMPARE("feijão")}

<h2>Fontes</h2>
<ul>
<li>${TACO}: feijão carioca, preto, fradinho, jalo, rajado, rosinha e roxo cozidos, feijão tropeiro mineiro, lentilha cozida, arroz tipo 1 cozido</li>
<li>${IBGE} (concha, escumadeira e colher de sopa de feijão; escumadeira e colher de sopa de arroz)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/arroz-engorda">Arroz engorda?</a></li>
<li><a href="/blog/alimentos-ricos-em-fibra">Alimentos ricos em fibra</a></li>
<li><a href="/blog/alimentos-ricos-em-proteina">Alimentos ricos em proteína</a></li>
<li><a href="/blog/cuscuz-engorda">Cuscuz engorda?</a></li>
</ul>`,
  },
  {
    slug: "pao-de-queijo-engorda",
    title: "Pão de Queijo Engorda? Calorias por Unidade e no Café da Manhã",
    metaTitle: "Pão de Queijo Engorda? Calorias por Unidade e no Café",
    metaDescription:
      "Um pão de queijo médio (40 g) tem perto de 145 kcal, e boa parte vem da gordura. Veja se pão de queijo engorda, se é melhor que pão francês e quantos dá para comer.",
    excerpt:
      "Quantas calorias tem o pão de queijo por unidade, por que ele é mais calórico que parece, pão de queijo ou pão francês, no café da manhã, na dieta e o congelado.",
    category: "Nutrição",
    date: "2026-11-15",
    updatedAt: "2026-11-18",
    readTime: "6 min",
    author: "Montinho",
    tags: ["pao de queijo", "calorias", "cafe da manha", "lanche", "dieta"],
    faq: [
      {
        question: "Pão de queijo engorda?",
        answer:
          "Sozinho, não, mas é calórico para o tamanho: 100 g têm 363 kcal, e quase dois terços vêm da gordura. Um ou dois no café cabem na dieta; um saquinho inteiro no lanche soma rápido.",
      },
      {
        question: "Quantas calorias tem um pão de queijo?",
        answer:
          "Depende do tamanho. Pela TACO, um pão de queijo pequeno (20 g, exemplo nosso) tem perto de 73 kcal; um médio (40 g), perto de 145 kcal; um grande (50 g), perto de 182 kcal.",
      },
      {
        question: "Pão de queijo ou pão francês: qual engorda mais?",
        answer:
          "No mesmo peso, o pão de queijo: 363 kcal em 100 g, contra 300 do pão francês. Uma unidade de pão francês (50 g) tem perto de 150 kcal; um pão de queijo do mesmo peso, perto de 182.",
      },
      {
        question: "Pão de queijo é carboidrato ou gordura?",
        answer:
          "Os dois. 100 g têm 34,2 g de carboidrato e 24,6 g de gordura, que vem do queijo e do óleo. Tem pouca proteína (5,1 g) e quase nenhuma fibra.",
      },
      {
        question: "Quem está de dieta pode comer pão de queijo?",
        answer:
          "Pode, contando. Um ou dois médios no café, junto com uma fonte de proteína, cabem na maioria das dietas.",
      },
      {
        question: "Pão de queijo na air fryer engorda menos?",
        answer:
          "Não muda muito. As calorias vêm da massa (polvilho, queijo e óleo), e o modo de assar não tira essa gordura.",
      },
      {
        question: "Pão de queijo tem glúten?",
        answer:
          "A receita tradicional usa polvilho, que vem da mandioca, e não trigo. Mas receitas e marcas variam: quem tem doença celíaca precisa conferir o rótulo.",
      },
      {
        question: "Pão de queijo congelado engorda mais?",
        answer:
          "Depende da marca. A TACO traz o pão de queijo assado; o congelado tem a informação no rótulo, na porção indicada.",
      },
      {
        question: "2 ou 3 pães de queijo engordam?",
        answer:
          "Depende do tamanho e do resto do dia. Com pães de queijo médios (40 g, exemplo nosso), 2 unidades têm perto de 290 kcal e 3 unidades, perto de 436 kcal, pela TACO.",
      },
      {
        question: "Comer pão de queijo todo dia engorda?",
        answer:
          "Não por ser todo dia, e sim pelo total. Um pão de queijo médio por dia (perto de 145 kcal) cabe numa rotina que está em déficit. O que costuma pesar é virar 3 ou 4 todo dia sem perceber, ou somar com outros lanches.",
      },
      {
        question: "Pão de queijo à noite engorda?",
        answer:
          "O horário não engorda; o total do dia, sim. Um pão de queijo no jantar pesa o mesmo que no café. A diferença é que, à noite, ele costuma vir como lanche a mais.",
      },
      {
        question: "Quantos pães de queijo posso comer?",
        answer:
          "Para a maioria das pessoas, um ou dois médios por vez cabem bem. Mais que isso pode caber, desde que você conte no total do dia.",
      },
    ],
    content: `<img src="/blog-images/pao-de-queijo-engorda-capa.webp" alt="Capa: Pão de queijo engorda? Ilustração de cesta de pães de queijo ao lado de uma xícara de café" title="Pão de Queijo Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Pão de queijo engorda?</strong> Sozinho, não, mas ele é mais calórico do que parece: um médio tem perto de 145 kcal, e quase dois terços dessas calorias vêm da gordura do queijo e do óleo. Um ou dois no café cabem na dieta. O problema é o saquinho que vai inteiro.</p>

<h2>Quantas calorias tem o pão de queijo?</h2>
<table>
<thead><tr><th>Pão de queijo assado</th><th>Calorias</th><th>Carboidrato</th><th>Gordura</th></tr></thead>
<tbody>
<tr><td>Pequeno (20 g)</td><td>cerca de 73 kcal</td><td>6,8 g</td><td>4,9 g</td></tr>
<tr><td><strong>Médio (40 g)</strong></td><td><strong>cerca de 145 kcal</strong></td><td>13,7 g</td><td>9,8 g</td></tr>
<tr><td>Grande (50 g)</td><td>cerca de 182 kcal</td><td>17,1 g</td><td>12,3 g</td></tr>
<tr><td>100 g</td><td>363 kcal</td><td>34,2 g</td><td>24,6 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos. A tabela de medidas do IBGE não traz o peso de uma unidade de pão de queijo, e o tamanho varia muito: os pesos acima são exemplos nossos. O congelado tem a informação no rótulo. Você vai encontrar a ficha do pão de queijo no fim do artigo.</p>

<h2>Por que o pão de queijo engorda mais do que parece?</h2>
<p>Porque é pequeno e concentrado. Em 100 g há <strong>24,6 g de gordura</strong> e <strong>34,2 g de carboidrato</strong>, com pouca proteína (5,1 g) e quase nenhuma fibra (0,6 g). Ele sustenta pouco para as calorias que tem, e é fácil comer três ou quatro sem perceber.</p>

<h2>Pão de queijo ou pão francês?</h2>
<table>
<thead><tr><th>Alimento</th><th>100 g</th><th>Unidade de 50 g</th></tr></thead>
<tbody>
<tr><td>Pão de queijo assado</td><td>363 kcal</td><td>cerca de 182 kcal</td></tr>
<tr><td>Pão francês</td><td>300 kcal</td><td>cerca de 150 kcal</td></tr>
<tr><td>Tapioca com manteiga</td><td>348 kcal</td><td>cerca de 174 kcal</td></tr>
</tbody>
</table>
<p>No mesmo peso, o pão de queijo tem mais calorias e muito mais gordura que o pão francês. A diferença por unidade não é enorme, mas o pão francês sustenta mais quando vem com ovo ou queijo branco. Veja <a href="/blog/pao-com-ovo-engorda">pão com ovo engorda?</a> e <a href="/blog/tapioca-engorda">tapioca engorda?</a>.</p>

<h2>2 ou 3 pães de queijo engordam?</h2>
<p>O que muda a conta é a quantidade, porque o pão de queijo é pequeno e calórico. Com o tamanho médio da tabela acima (40 g):</p>
<table>
<thead><tr><th>Quantidade</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>1 pão de queijo médio</td><td>cerca de 145 kcal</td></tr>
<tr><td>2 pães de queijo médios</td><td>cerca de 290 kcal</td></tr>
<tr><td>3 pães de queijo médios</td><td>cerca de 436 kcal</td></tr>
<tr><td>5 pães de queijo médios</td><td>cerca de 726 kcal</td></tr>
</tbody>
</table>
<p>Calorias da TACO; o peso de 40 g é exemplo nosso, porque o tamanho varia muito. Dois médios no café cabem na rotina de muita gente. Três ou mais, todo dia, somam mais de 400 kcal só nesse lanche, e é aí que a conta do dia costuma estourar.</p>

<h2>Comer pão de queijo todo dia ou à noite engorda?</h2>
<p>Nem o "todo dia" nem o horário engordam: o que conta é o total. Um pão de queijo médio por dia, perto de 145 kcal, cabe numa rotina em déficit. O problema costuma ser outro: virar 3 ou 4 sem perceber, ou entrar como lanche a mais à noite, depois de um dia que já fechou a conta. Para ter uma ideia de quanto cabe no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Pão de queijo no café da manhã engorda?</h2>
<p>Cabe, se você contar. <strong>Um ou dois médios</strong> com uma fonte de proteína (ovo, iogurte, queijo branco) e uma fruta fazem um café que sustenta. Só pão de queijo e café costuma dar fome cedo. Veja <a href="/blog/o-que-comer-no-cafe-da-manha-para-treinar">o que comer no café da manhã para treinar</a>.</p>

<h2>Pão de queijo na air fryer engorda menos?</h2>
<p>Não muda muito. As calorias vêm da massa (polvilho, queijo e óleo), e o modo de assar não tira essa gordura.</p>

<h2>Pão de queijo tem glúten?</h2>
<p>A receita tradicional usa polvilho, que vem da mandioca, e não trigo. Mas receitas e marcas variam: quem tem doença celíaca precisa conferir o rótulo e seguir a orientação do médico.</p>

<h2>Quantos pães de queijo posso comer?</h2>
<p>Para a maioria das pessoas, <strong>um ou dois médios por vez</strong> cabem bem. Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

${NAO_SE_COMPARE("pão de queijo")}

<h2>Fontes</h2>
<ul>
<li>${TACO}: pão de queijo assado, pão de trigo francês, tapioca com manteiga</li>
<li>${IBGE} (unidade de pão francês)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/pao-com-ovo-engorda">Pão com ovo engorda?</a></li>
<li><a href="/blog/tapioca-engorda">Tapioca engorda?</a></li>
<li><a href="/blog/pao-integral-engorda">Pão integral engorda?</a></li>
<li><a href="/blog/lanches-saudaveis-para-emagrecer">Lanches saudáveis para emagrecer</a></li>
</ul>`,
  },
  {
    slug: "maca-engorda",
    title: "Maçã Engorda ou Emagrece? Calorias, à Noite e na Dieta",
    metaTitle: "Maçã Engorda ou Emagrece? Calorias, à Noite e na Dieta",
    metaDescription:
      "Uma maçã fuji média tem perto de 83 kcal e é quase toda água e fibra. Veja se maçã engorda, se pode comer à noite, maçã com casca e como ela se compara a outras frutas.",
    excerpt:
      "Quantas calorias tem a maçã por unidade e fatia, fuji ou argentina, com casca, à noite, na dieta e comparada com banana, pera e manga.",
    category: "Nutrição",
    date: "2026-11-15",
    updatedAt: "2026-11-19",
    readTime: "5 min",
    author: "Montinho",
    tags: ["maca", "frutas", "calorias", "fibra", "dieta"],
    faq: [
      {
        question: "Maçã engorda?",
        answer:
          "É difícil engordar com maçã. Uma fuji média (150 g) tem perto de 83 kcal. Ela só engorda se o total do dia passar do seu gasto por semanas, como qualquer alimento.",
      },
      {
        question: "Quantas calorias tem uma maçã?",
        answer:
          "Pela TACO e as medidas do IBGE, uma maçã fuji com casca (150 g) tem perto de 83 kcal; uma fatia (37,5 g), perto de 21 kcal. A argentina tem um pouco mais: 62,5 kcal em 100 g.",
      },
      {
        question: "Maçã à noite engorda?",
        answer:
          "Não. O horário não engorda; o que conta é o total do dia. Uma maçã à noite é uma sobremesa leve.",
      },
      {
        question: "Maçã emagrece?",
        answer:
          "Nenhum alimento emagrece sozinho. A maçã ajuda porque tem poucas calorias, um pouco de fibra e pode entrar no lugar de um doce.",
      },
      {
        question: "Comer maçã com casca ou sem casca?",
        answer:
          "Os valores da TACO são da maçã com casca, que é como a maioria come. A casca concentra parte da fibra; se você tolera bem, vale manter.",
      },
      {
        question: "Engorda mais maçã ou banana?",
        answer:
          "A banana. 100 g de banana prata têm 98 kcal; 100 g de maçã fuji, 55,5.",
      },
      {
        question: "Maçã verde engorda menos?",
        answer:
          "A TACO não traz a maçã verde, então não há número oficial para comparar. Na prática, as variedades de maçã ficam próximas.",
      },
      {
        question: "Maçã tem carboidrato ou proteína?",
        answer:
          "Quase só carboidrato. Pela TACO, 100 g de maçã fuji com casca têm 15,2 g de carboidrato, 0,3 g de proteína, praticamente nada de gordura e 1,3 g de fibra. Uma unidade média (150 g) dá cerca de 23 g de carboidrato. Para proteína, ela precisa de companhia: iogurte, queijo ou ovo.",
      },
      {
        question: "Qual a melhor fruta para quem quer emagrecer?",
        answer:
          "A que você come no lugar de um lanche mais calórico e consegue manter. A maçã é uma boa candidata por ter poucas calorias e dar trabalho para comer, mas nenhuma fruta emagrece sozinha: o que decide é o total do dia. A comparação entre as frutas está em melhores frutas para emagrecer.",
      },
      {
        question: "Quantas maçãs posso comer por dia?",
        answer:
          "Para a maioria das pessoas, uma ou duas por dia cabem bem, junto com outras frutas.",
      },
    ],
    content: `<img src="/blog-images/maca-engorda-capa.webp" alt="Capa: Maçã engorda? Ilustração de uma maçã vermelha inteira, meia maçã e fatias" title="Maçã Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Maçã engorda?</strong> É difícil engordar com maçã. Uma fuji média tem perto de 83 kcal e é quase toda água e fibra. Ela é uma das trocas mais fáceis para quem quer matar a vontade de doce sem somar muito no dia.</p>

<h2>Quantas calorias tem a maçã?</h2>
<table>
<thead><tr><th>Maçã fuji com casca</th><th>Calorias</th><th>Carboidrato</th><th>Fibra</th></tr></thead>
<tbody>
<tr><td>1 fatia (37,5 g)</td><td>cerca de 21 kcal</td><td>5,7 g</td><td>0,5 g</td></tr>
<tr><td>1 porção do IBGE (130 g)</td><td>cerca de 72 kcal</td><td>19,8 g</td><td>1,7 g</td></tr>
<tr><td><strong>1 unidade (150 g)</strong></td><td><strong>cerca de 83 kcal</strong></td><td>22,8 g</td><td>2,0 g</td></tr>
<tr><td>100 g</td><td>55,5 kcal</td><td>15,2 g</td><td>1,3 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, com as porções da tabela de medidas do IBGE. A maçã argentina tem um pouco mais: 62,5 kcal e 2,0 g de fibra em 100 g. A TACO não traz a maçã verde. Você vai encontrar a ficha da maçã no fim do artigo.</p>

<h2>Maçã engorda ou emagrece?</h2>
<p>Nenhum alimento emagrece sozinho. A maçã <strong>ajuda</strong> porque é doce, tem poucas calorias e dá trabalho para mastigar, o que faz durar. Funciona bem no lugar de um doce ou como lanche entre as refeições. Veja <a href="/blog/vontade-de-doce">vontade de doce</a>.</p>

<h2>Maçã à noite engorda?</h2>
<p>Não. O horário não engorda; o que conta é o total do dia. Uma maçã à noite é uma sobremesa leve. Veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</p>

<h2>Com casca ou sem casca?</h2>
<p>Os valores da TACO são da maçã <strong>com casca</strong>, que é como a maioria come. A casca concentra parte da fibra; se você tolera bem, vale manter.</p>

<h2>Maçã engorda mais que outras frutas?</h2>
<table>
<thead><tr><th>Fruta (100 g, crua)</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Banana prata</td><td>98 kcal</td></tr>
<tr><td>Manga Palmer</td><td>73 kcal</td></tr>
<tr><td>Maçã argentina</td><td>62,5 kcal</td></tr>
<tr><td><strong>Maçã fuji</strong></td><td><strong>55,5 kcal</strong></td></tr>
<tr><td>Pera williams</td><td>53 kcal</td></tr>
<tr><td>Laranja-pera</td><td>37 kcal</td></tr>
<tr><td>Melancia</td><td>33 kcal</td></tr>
</tbody>
</table>
<p>Veja também <a href="/blog/banana-engorda">banana engorda?</a>, <a href="/blog/manga-engorda">manga engorda?</a> e <a href="/blog/melancia-engorda">melancia engorda?</a>.</p>

<h2>Maçã tem carboidrato ou proteína?</h2>
<p>Quase só carboidrato, e quase nada de proteína ou gordura. Pela TACO, a cada 100 g:</p>
<table>
<thead><tr><th>Maçã com casca (100 g)</th><th>Calorias</th><th>Carboidrato</th><th>Proteína</th><th>Fibra</th></tr></thead>
<tbody>
<tr><td>Fuji</td><td>55,5 kcal</td><td>15,2 g</td><td>0,3 g</td><td>1,3 g</td></tr>
<tr><td>Argentina</td><td>62,5 kcal</td><td>16,6 g</td><td>0,2 g</td><td>2,0 g</td></tr>
</tbody>
</table>
<p>Uma maçã fuji média (150 g) dá cerca de 23 g de carboidrato. Por isso ela funciona bem como lanche ou antes do treino, mas não segura a fome sozinha por muito tempo. Junto com uma fonte de proteína, como iogurte natural, queijo ou ovo, o lanche fica mais completo. Veja <a href="/blog/alimentos-ricos-em-proteina">alimentos ricos em proteína</a>.</p>

<h2>Qual a melhor fruta para quem quer emagrecer?</h2>
<p>A que você come no lugar de um lanche mais calórico, e consegue manter na rotina. A maçã é uma boa candidata: tem poucas calorias por unidade e dá trabalho para comer, o que ajuda a não exagerar. Mas nenhuma fruta emagrece sozinha. A comparação entre as frutas, com calorias e fibra de cada uma, está em <a href="/blog/melhores-frutas-para-emagrecer">melhores frutas para emagrecer</a>.</p>

<h2>Quantas maçãs comer por dia?</h2>
<p>Para a maioria das pessoas, <strong>uma ou duas por dia</strong> cabem bem, junto com outras frutas. Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

${NAO_SE_COMPARE("maçã")}

<h2>Fontes</h2>
<ul>
<li>${TACO}: maçã fuji e argentina com casca, banana prata, manga Palmer, pera williams, laranja-pera, melancia</li>
<li>${IBGE} (unidade, fatia e porção de maçã)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/melhores-frutas-para-emagrecer">Melhores frutas para emagrecer</a></li>
<li><a href="/blog/banana-engorda">Banana engorda?</a></li>
<li><a href="/blog/manga-engorda">Manga engorda?</a></li>
<li><a href="/blog/frutas-antes-do-treino">Frutas antes do treino</a></li>
</ul>`,
  },
];
