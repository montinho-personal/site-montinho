import type { BlogPost } from "./blog";

/**
 * "Arroz engorda?", "Aveia engorda?" e "Granola engorda?" (11/11/2026).
 * Planejador de Palavras-chave do Google Ads (Brasil): "arroz engorda" e
 * "aveia engorda" 9.900/mês cada; "granola engorda" 8.100. Pedido do Montinho
 * ("pode criar os 3 sem os prints"); os prints chegaram durante a escrita
 * (autocompletar, PAA, visão geral por IA e buscas relacionadas dos três) e
 * decidiram H2 e FAQ. Fora, por não caber no tema: "arroz engorda o cachorro",
 * "aveia engorda cavalo/gado". Sem export do Answer the Public.
 *
 * Canibalização: nenhum artigo com arroz, aveia ou granola no slug ou título
 * (busca normalizada). Vizinhos linkados: cuscuz, banana, tapioca, pão
 * integral, açaí, leite, carboidrato à noite.
 *
 * Números: TACO 4ª edição, pela base do site, por 100 g.
 * - Arroz tipo 1 cozido: 128 kcal, 28,1 g carboidrato, 2,5 g proteína, 1,6 g fibra.
 *   Integral cozido: 124 kcal, 25,8 g, 2,6 g, 2,7 g. Cru tipo 1: 358 kcal.
 *   Porções (POF 2008-2009, IBGE), branco: colher de sopa 25 g (32 kcal),
 *   colher de servir 45 g (58), escumadeira 85 g (109), concha 100 g (128).
 *   Integral: colher de sopa 20 g (25), colher de servir 63 g (78),
 *   escumadeira 59 g (73), concha 117 g (145).
 *   Feijão carioca cozido 76 kcal/100 g, concha 140 g (107). Batata inglesa
 *   cozida 52 kcal/100 g, unidade 140 g (72); batata-doce cozida 77 kcal/100 g.
 *   Macarrão: a base só tem o cru (371 kcal/100 g); sem número para o cozido.
 * - Aveia em flocos crua: 394 kcal, 66,6 g carboidrato, 13,9 g proteína,
 *   8,5 g gordura, 9,1 g fibra. Colher de sopa 15 g (59 kcal), colher de
 *   servir 30 g (118), porção 37,5 g (148). Iogurte natural 51,5 kcal/100 g,
 *   copo americano 150 g (77). Banana prata unidade 75 g (74). Mel 309 kcal/100 g
 *   (10 g, exemplo nosso: 31). Ovo cozido unidade 45 g (66). Leite líquido e
 *   farelo de aveia: sem valor na base, vale o rótulo.
 * - Granola: a TACO não tem. Exemplo nosso, calculado com a TACO: 30 g de aveia,
 *   10 g de castanha-do-pará, 10 g de mel, 5 g de coco e 5 g de açúcar mascavo
 *   = 60 g e 252 kcal (420 kcal/100 g; 40 g = 168 kcal). Açaí polpa com xarope
 *   110 kcal/100 g (200 g, exemplo nosso: 221). "Light": Anvisa, RDC 54/2012.
 *
 * Ferramenta: cartão de link da Calculadora de Déficit (ARTIGOS_COM_LINK_DEFICIT)
 * e ficha de alimento (FICHAS_POR_ARTIGO; granola sem ficha, não está na base).
 */

export const ARROZ_AVEIA_GRANOLA_POSTS: BlogPost[] = [
  {
    slug: "arroz-engorda",
    title: "Arroz Engorda? Calorias por Colher e Arroz à Noite",
    metaTitle: "Arroz Engorda? Calorias por Colher e Arroz à Noite",
    metaDescription:
      "Uma escumadeira de arroz branco tem perto de 109 kcal. Veja quando o arroz engorda, se dá barriga, à noite, branco ou integral e se engorda mais que macarrão ou feijão.",
    excerpt:
      "Quantas calorias tem o arroz por colher, escumadeira e concha, branco ou integral, se engorda à noite, se dá barriga e como ele se compara a feijão, batata e macarrão.",
    category: "Nutrição",
    date: "2026-11-11",
    readTime: "7 min",
    author: "Montinho",
    tags: ["arroz", "calorias", "carboidrato", "dieta", "emagrecimento"],
    faq: [
      {
        question: "Arroz engorda?",
        answer:
          "Sozinho, não. Uma escumadeira de arroz branco (85 g) tem perto de 109 kcal. O que engorda é o total do dia passar do seu gasto, semana após semana: o prato cheio, repetido, junto com tudo o que vem com ele.",
      },
      {
        question: "Quantas calorias tem uma colher de arroz?",
        answer:
          "Pelas medidas do IBGE e a TACO: 1 colher de sopa de arroz branco cozido (25 g) tem perto de 32 kcal; 1 colher de servir (45 g), perto de 58 kcal; 1 escumadeira (85 g), perto de 109 kcal.",
      },
      {
        question: "3 colheres de arroz engordam?",
        answer:
          "Três colheres de servir (135 g) somam perto de 173 kcal; três colheres de sopa (75 g), perto de 96 kcal. Nenhuma das duas engorda sozinha: depende do que mais vai no prato e no dia.",
      },
      {
        question: "100 gramas de arroz engordam?",
        answer:
          "100 g de arroz branco cozido têm perto de 128 kcal, o mesmo que uma concha. É uma porção comum de almoço e cabe na maioria das dietas.",
      },
      {
        question: "Arroz engorda barriga?",
        answer:
          "Nenhum alimento escolhe onde a gordura vai. Barriga é gordura do corpo todo, e ela aumenta quando o total de calorias passa do gasto por semanas. Também não existe comida que tire gordura só da barriga.",
      },
      {
        question: "É verdade que o arroz incha a barriga?",
        answer:
          "Não é comum. A sensação de barriga estufada depois do almoço costuma ser do volume do prato todo. Se acontece sempre, vale observar o que vem junto e procurar médico ou nutricionista.",
      },
      {
        question: "Arroz à noite engorda?",
        answer:
          "O horário não engorda. O que conta é o total do dia. Se o arroz do jantar cabe nas suas calorias, ele não engorda mais do que no almoço.",
      },
      {
        question: "Qual arroz engorda mais, branco ou integral?",
        answer:
          "Quase empatam: 100 g de arroz branco cozido têm 128 kcal, e 100 g de integral, 124. A diferença é a fibra: o integral tem 2,7 g em 100 g, contra 1,6 g do branco, e costuma sustentar um pouco mais.",
      },
      {
        question: "O que engorda mais, feijão ou arroz?",
        answer:
          "O arroz. 100 g de feijão carioca cozido têm 76 kcal, e 100 g de arroz branco, 128. O feijão ainda tem mais proteína e muito mais fibra.",
      },
      {
        question: "Arroz engorda mais que macarrão?",
        answer:
          "Crus, quase empatam: 358 kcal em 100 g de arroz e 371 kcal em 100 g de macarrão. A TACO não traz o macarrão cozido, então a comparação no prato depende do rótulo e de quanto você serve.",
      },
      {
        question: "Arroz engorda mais que batata?",
        answer:
          "No mesmo peso, sim: 100 g de batata inglesa cozida têm perto de 52 kcal, e 100 g de arroz branco, 128. A batata-doce cozida fica no meio, com 77 kcal.",
      },
      {
        question: "Quem está de dieta pode comer arroz?",
        answer:
          "Pode. Arroz com feijão é uma base boa para quem quer emagrecer: o que muda é a porção. Uma ou duas escumadeiras por refeição cabem na maioria das dietas.",
      },
    ],
    content: `<img src="/blog-images/arroz-engorda-capa.webp" alt="Capa: Arroz engorda? Ilustração de tigela de arroz ao lado de uma tigela de feijão" title="Arroz Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Arroz engorda?</strong> Sozinho, não. Uma escumadeira de arroz branco tem perto de 109 kcal, o que cabe tranquilo num almoço. O que engorda é o prato cheio todo dia, somado ao que vem junto, passando do seu gasto por semanas. O arroz é só uma parte dessa conta.</p>

<h2>Quantas calorias tem o arroz?</h2>
<table>
<thead><tr><th>Porção (cozido)</th><th>Arroz branco</th><th>Arroz integral</th></tr></thead>
<tbody>
<tr><td>1 colher de sopa</td><td>25 g, cerca de 32 kcal</td><td>20 g, cerca de 25 kcal</td></tr>
<tr><td>1 colher de servir</td><td>45 g, cerca de 58 kcal</td><td>63 g, cerca de 78 kcal</td></tr>
<tr><td><strong>1 escumadeira</strong></td><td><strong>85 g, cerca de 109 kcal</strong></td><td>59 g, cerca de 73 kcal</td></tr>
<tr><td>1 concha</td><td>100 g, cerca de 128 kcal</td><td>117 g, cerca de 145 kcal</td></tr>
<tr><td>100 g</td><td>128 kcal · 28 g de carboidrato · 1,6 g de fibra</td><td>124 kcal · 26 g de carboidrato · 2,7 g de fibra</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, com as porções da tabela de medidas do IBGE. Repare que a colher e a escumadeira do IBGE têm pesos diferentes para o branco e o integral: é como as pessoas servem cada um. Você vai encontrar a ficha do arroz no fim do artigo.</p>

<h2>3 colheres de arroz engordam?</h2>
<p>Depende da colher. <strong>Três colheres de servir</strong> (135 g) somam perto de <strong>173 kcal</strong>; três colheres de sopa (75 g), perto de 96 kcal. Nenhuma das duas engorda sozinha. Um prato com duas escumadeiras de arroz (170 g, perto de 218 kcal) e uma concha de feijão (140 g, perto de 107 kcal) fica em torno de 325 kcal antes da carne e da salada.</p>

<h2>Arroz engorda ou emagrece?</h2>
<p>Nem um nem outro sozinho. <strong>Engorda o que passa do seu gasto, repetido por semanas.</strong> O arroz é carboidrato, dá energia e quase não tem gordura (0,2 g em 100 g, no branco). O que costuma pesar é a quantidade: o arroz é barato, gostoso e fácil de repetir. Quem quer emagrecer não precisa cortar o arroz; precisa saber quantas escumadeiras cabem no prato.</p>

<h2>Arroz engorda barriga?</h2>
<p>Nenhum alimento escolhe onde a gordura vai. A barriga cresce quando a gordura do corpo todo aumenta, e isso acontece pelo total do dia, não por um alimento. Também não existe comida que derreta gordura só da barriga.</p>
<p>A sensação de <strong>barriga estufada</strong> depois do almoço costuma ser do volume do prato inteiro, não do arroz. Se acontece sempre, observe o que vem junto e, se continuar, procure médico ou nutricionista. Veja <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a>.</p>

<h2>Arroz à noite engorda?</h2>
<p>O horário não engorda. O que conta é o total do dia: se o arroz do jantar cabe nas suas calorias, ele não engorda mais do que no almoço. Veja <a href="/blog/carboidrato-a-noite-engorda">carboidrato à noite engorda?</a> e <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</p>

<h2>Qual arroz engorda mais: branco ou integral?</h2>
<p>Quase empatam: <strong>128 kcal</strong> em 100 g de branco cozido e <strong>124 kcal</strong> no integral. A diferença está na fibra (2,7 g contra 1,6 g em 100 g), que faz o integral sustentar um pouco mais. Se você gosta dos dois, o integral é a troca fácil; se só come o branco, ele cabe na dieta do mesmo jeito.</p>

<h2>Arroz engorda mais que feijão, batata ou macarrão?</h2>
<table>
<thead><tr><th>Alimento (100 g)</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Arroz branco cozido</td><td>128 kcal</td></tr>
<tr><td>Arroz integral cozido</td><td>124 kcal</td></tr>
<tr><td>Cuscuz de milho cozido</td><td>114 kcal</td></tr>
<tr><td>Batata-doce cozida</td><td>77 kcal</td></tr>
<tr><td>Feijão carioca cozido</td><td>76 kcal</td></tr>
<tr><td>Batata inglesa cozida</td><td>52 kcal</td></tr>
</tbody>
</table>
<ul>
<li><strong>Feijão:</strong> engorda menos que o arroz no mesmo peso e tem mais proteína e fibra. Arroz com feijão não é o problema da dieta de ninguém; a porção é.</li>
<li><strong>Batata:</strong> no mesmo peso, a batata inglesa tem menos da metade das calorias do arroz. Uma batata média cozida (140 g) tem perto de 72 kcal.</li>
<li><strong>Macarrão:</strong> crus, quase empatam (358 kcal em 100 g de arroz e 371 no macarrão). A TACO não traz o macarrão cozido, então no prato a comparação depende do rótulo e de quanto você serve. Macarrão de arroz segue a mesma lógica: confira o rótulo.</li>
</ul>
<p>Veja também <a href="/blog/cuscuz-engorda">cuscuz engorda?</a> e <a href="/blog/tapioca-engorda">tapioca engorda?</a>.</p>

<h2>Quem está de dieta pode comer arroz?</h2>
<p>Pode. Para a maioria das pessoas, <strong>uma ou duas escumadeiras por refeição</strong> cabem bem, junto com feijão, uma carne magra e salada. Quem treina pesado ou quer ganhar massa costuma precisar de mais; quem quer emagrecer, de um pouco menos. Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come arroz todo dia e emagrece, e gente que corta o arroz e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com o arroz no prato, se você gosta dele.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: arroz tipo 1 cozido e cru, arroz integral cozido, feijão carioca cozido, batata inglesa e batata-doce cozidas, cuscuz de milho, macarrão cru</li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (colher de sopa, colher de servir, escumadeira e concha de arroz; concha de feijão; unidade de batata)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/aveia-engorda">Aveia engorda?</a></li>
<li><a href="/blog/cuscuz-engorda">Cuscuz engorda?</a></li>
<li><a href="/blog/carboidrato-a-noite-engorda">Carboidrato à noite engorda?</a></li>
<li><a href="/blog/pao-integral-engorda">Pão integral engorda?</a></li>
</ul>`,
  },
  {
    slug: "aveia-engorda",
    title: "Aveia Engorda? Calorias por Colher, com Leite e com Banana",
    metaTitle: "Aveia Engorda? Calorias por Colher, com Leite e com Banana",
    metaDescription:
      "Uma colher de sopa de aveia tem perto de 59 kcal. Veja quando a aveia engorda, com leite, banana ou no mingau à noite, se incha a barriga e quanto comer por dia.",
    excerpt:
      "Quantas calorias tem a aveia por colher e porção, se engorda mais que arroz, o que muda com leite, banana, mel e ovo, mingau à noite, barriga inchada e quanto comer por dia.",
    category: "Nutrição",
    date: "2026-11-11",
    readTime: "7 min",
    author: "Montinho",
    tags: ["aveia", "calorias", "fibra", "cafe da manha", "dieta"],
    faq: [
      {
        question: "Aveia engorda?",
        answer:
          "Sozinha, não. Uma colher de sopa de aveia (15 g) tem perto de 59 kcal. Ela engorda se a porção for grande ou se vier com muita coisa calórica junto, e o total do dia passar do seu gasto por semanas.",
      },
      {
        question: "Quantas calorias tem uma colher de aveia?",
        answer:
          "Pela TACO e as medidas do IBGE: 1 colher de sopa (15 g) tem perto de 59 kcal; 1 colher de servir (30 g), perto de 118 kcal; a porção de referência do IBGE (37,5 g), perto de 148 kcal.",
      },
      {
        question: "Aveia engorda ou emagrece?",
        answer:
          "Nenhum alimento emagrece sozinho. A aveia ajuda quem quer emagrecer porque tem bastante fibra (9,1 g em 100 g) e sustenta, mas é calórica: funciona em porção, no lugar de outra coisa, e não somada a tudo.",
      },
      {
        question: "Aveia com leite engorda?",
        answer:
          "Soma as calorias do leite, que dependem do tipo e do copo (confira o rótulo; a TACO não traz o leite líquido). Aveia com leite é um café da manhã comum e cabe na dieta; o que pesa é o tamanho da tigela e o açúcar.",
      },
      {
        question: "Aveia com banana engorda?",
        answer:
          "Duas colheres de sopa de aveia (30 g, perto de 118 kcal) com uma banana prata (75 g, perto de 74 kcal) somam cerca de 192 kcal. É um lanche que cabe na maioria das dietas.",
      },
      {
        question: "Mingau de aveia à noite engorda?",
        answer:
          "O horário não engorda; o total do dia, sim. Um mingau com 30 g de aveia é um lanche da noite que sustenta. O que muda a conta é o leite, o açúcar e o tamanho da tigela.",
      },
      {
        question: "O que engorda mais, aveia ou arroz?",
        answer:
          "Na porção, quase empatam: 2 colheres de sopa de aveia (30 g) têm perto de 118 kcal, e uma escumadeira de arroz branco cozido (85 g), perto de 109. Grama a grama a aveia tem mais calorias porque é seca; o arroz cozido tem água.",
      },
      {
        question: "Por que a aveia incha a barriga?",
        answer:
          "Porque é muita fibra de uma vez para quem não está acostumado. Começar com uma colher e aumentar aos poucos, com água, costuma resolver. Se o incômodo for frequente, procure médico ou nutricionista.",
      },
      {
        question: "O que acontece se comer aveia todos os dias?",
        answer:
          "Em porção normal, uma ou duas colheres de sopa por dia são um jeito fácil de colocar fibra na rotina. Não emagrece sozinha nem faz mal; só soma calorias como qualquer alimento.",
      },
      {
        question: "Quem quer perder peso pode comer aveia?",
        answer:
          "Pode. Uma ou duas colheres de sopa por dia cabem na maioria das dietas e ajudam a sustentar. O cuidado é com o que vai junto: mel, açúcar, leite condensado e granola somam rápido.",
      },
      {
        question: "Aveia engorda o bebê?",
        answer:
          "A alimentação de bebês e crianças é com o pediatra. Ganho de peso no bebê depende da alimentação como um todo, não de um alimento.",
      },
      {
        question: "Quanta aveia posso comer por dia?",
        answer:
          "Para a maioria das pessoas, de 15 a 30 g por dia (uma a duas colheres de sopa) cabem bem. Mais que isso pode caber, desde que você conte no total do dia.",
      },
    ],
    content: `<img src="/blog-images/aveia-engorda-capa.webp" alt="Capa: Aveia engorda? Ilustração de tigela de mingau de aveia com rodelas de banana" title="Aveia Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Aveia engorda?</strong> Sozinha, não. Uma colher de sopa tem perto de 59 kcal e bastante fibra, o que ajuda a sustentar. Ela engorda quando a porção cresce e vem junto com leite, mel, açúcar ou granola, e o total do dia passa do seu gasto por semanas.</p>

<h2>Quantas calorias tem a aveia?</h2>
<table>
<thead><tr><th>Porção (aveia em flocos)</th><th>Calorias</th><th>Carboidrato</th><th>Proteína</th><th>Fibra</th></tr></thead>
<tbody>
<tr><td><strong>1 colher de sopa (15 g)</strong></td><td><strong>cerca de 59 kcal</strong></td><td>10 g</td><td>2,1 g</td><td>1,4 g</td></tr>
<tr><td>2 colheres de sopa (30 g)</td><td>cerca de 118 kcal</td><td>20 g</td><td>4,2 g</td><td>2,7 g</td></tr>
<tr><td>1 porção do IBGE (37,5 g)</td><td>cerca de 148 kcal</td><td>25 g</td><td>5,2 g</td><td>3,4 g</td></tr>
<tr><td>100 g</td><td>394 kcal</td><td>66,6 g</td><td>13,9 g</td><td>9,1 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, com as porções da tabela de medidas do IBGE. A TACO não tem o farelo de aveia: para ele, veja o rótulo. Você vai encontrar a ficha da aveia no fim do artigo.</p>

<h2>Aveia engorda ou emagrece?</h2>
<p>Nenhum alimento emagrece sozinho. A aveia <strong>ajuda</strong> quem quer emagrecer porque tem fibra (9,1 g em 100 g) e um pouco de proteína (13,9 g), e isso sustenta. Mas é calórica: 100 g têm quase 400 kcal. Ela funciona em porção, no lugar de outra coisa no café da manhã ou no lanche, e não somada a tudo.</p>

<h2>Aveia com leite, banana, mel ou ovo</h2>
<p>A aveia quase nunca vem sozinha. O que vai junto pesa tanto quanto ela:</p>
<table>
<thead><tr><th>Junto com a aveia</th><th>Calorias a mais</th></tr></thead>
<tbody>
<tr><td>1 banana prata (75 g)</td><td>cerca de 74 kcal</td></tr>
<tr><td>1 copo americano de iogurte natural (150 g)</td><td>cerca de 77 kcal</td></tr>
<tr><td>1 ovo cozido (45 g)</td><td>cerca de 66 kcal</td></tr>
<tr><td>10 g de mel</td><td>cerca de 31 kcal</td></tr>
<tr><td>Leite</td><td>depende do tipo e do copo: veja o rótulo</td></tr>
</tbody>
</table>
<p>Valores da TACO com as medidas do IBGE; os 10 g de mel são exemplo nosso, porque a base não traz medida caseira para ele. A TACO não tem valor para o leite líquido.</p>
<ul>
<li><strong>Com banana:</strong> duas colheres de sopa de aveia (30 g) com uma banana prata somam perto de 192 kcal. É um lanche que cabe na maioria das dietas. Veja <a href="/blog/banana-engorda">banana engorda?</a>.</li>
<li><strong>Com leite:</strong> soma as calorias do leite, que mudam bastante entre integral, semidesnatado e desnatado. Veja <a href="/blog/leite-engorda">leite engorda?</a>.</li>
<li><strong>Com ovo (panqueca de aveia):</strong> uma panqueca com 2 colheres de sopa de aveia e 1 ovo tem perto de 184 kcal antes do recheio.</li>
<li><strong>Com mel ou açúcar:</strong> é o que mais soma sem você perceber. Use pouco, ou adoce com a própria banana.</li>
</ul>

<h2>Mingau de aveia à noite engorda?</h2>
<p>O horário não engorda; o total do dia, sim. Um mingau com 30 g de aveia é um lanche da noite que sustenta. O que muda a conta é o leite, o açúcar e o tamanho da tigela. Veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</p>

<h2>O que engorda mais: aveia ou arroz?</h2>
<p>Grama a grama, a aveia tem mais calorias (394 kcal em 100 g, contra 128 do arroz branco cozido), porque é seca e o arroz cozido tem água. Mas ninguém come 100 g de aveia de uma vez. <strong>Na porção, quase empatam:</strong> 2 colheres de sopa de aveia (30 g) têm perto de 118 kcal, e uma escumadeira de arroz (85 g), perto de 109. Veja <a href="/blog/arroz-engorda">arroz engorda?</a>.</p>

<h2>Por que a aveia incha a barriga?</h2>
<p>Porque é muita fibra de uma vez para quem não está acostumado. Começar com uma colher de sopa por dia e aumentar aos poucos, bebendo água, costuma resolver. Se o incômodo for frequente, procure médico ou nutricionista. Veja <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a>.</p>

<h2>O que acontece se comer aveia todos os dias?</h2>
<p>Em porção normal, nada de ruim: é um jeito fácil de colocar fibra na rotina. Ela não emagrece sozinha nem faz mal; soma calorias como qualquer alimento. Quem tem doença celíaca precisa de aveia com selo sem glúten e da orientação do médico.</p>

<h2>Aveia engorda o bebê?</h2>
<p>A alimentação de bebês e crianças é com o pediatra. Ganho de peso no bebê depende da alimentação como um todo, não de um alimento.</p>

<h2>Quanta aveia comer por dia?</h2>
<p>Para a maioria das pessoas, <strong>de 15 a 30 g por dia</strong> (uma a duas colheres de sopa) cabem bem. Mais que isso pode caber, desde que você conte no total do dia. Para saber quantas calorias cabem no seu, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come aveia todo dia e emagrece, e gente que coloca aveia em tudo e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com a aveia dentro, se ela faz sentido para você.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: aveia em flocos crua, arroz tipo 1 cozido, banana prata, iogurte natural, ovo cozido, mel</li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (colher de sopa, colher de servir e porção de aveia; escumadeira de arroz; unidade de banana e de ovo; copo americano de iogurte)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/granola-engorda">Granola engorda?</a></li>
<li><a href="/blog/arroz-engorda">Arroz engorda?</a></li>
<li><a href="/blog/alimentos-ricos-em-fibra">Alimentos ricos em fibra</a></li>
<li><a href="/blog/o-que-comer-no-cafe-da-manha-para-treinar">O que comer no café da manhã para treinar</a></li>
</ul>`,
  },
  {
    slug: "granola-engorda",
    title: "Granola Engorda? Calorias, com Iogurte e Granola Light",
    metaTitle: "Granola Engorda? Calorias, com Iogurte e Granola Light",
    metaDescription:
      "A granola é aveia com mel, açúcar e castanhas: 40 g passam fácil de 160 kcal. Veja quando engorda, com iogurte, leite ou açaí, se a light vale a pena e o que olhar no rótulo.",
    excerpt:
      "Por que a granola tem mais calorias que a aveia, quantas calorias numa porção, o que muda com iogurte, leite, banana e açaí, o que significa granola light e como ler o rótulo.",
    category: "Nutrição",
    date: "2026-11-11",
    readTime: "7 min",
    author: "Montinho",
    tags: ["granola", "calorias", "aveia", "cafe da manha", "dieta"],
    faq: [
      {
        question: "Granola engorda?",
        answer:
          "Pode engordar, porque é calórica em pouco volume: além da aveia, leva mel, açúcar, castanhas e às vezes óleo. Em porção pequena cabe na dieta; jogada à vontade no iogurte ou no açaí, soma rápido.",
      },
      {
        question: "Quantas calorias tem a granola?",
        answer:
          "Depende da receita e da marca: confira o rótulo. Numa granola caseira de exemplo, feita com aveia, castanha-do-pará, mel, coco e açúcar mascavo e calculada com a TACO, 40 g têm perto de 168 kcal.",
      },
      {
        question: "Granola engorda ou emagrece?",
        answer:
          "Nenhum alimento emagrece sozinho. A granola tem fibra e sustenta, mas tem bastante açúcar e gordura em pouco volume. Para quem quer emagrecer, funciona em porção pequena e medida.",
      },
      {
        question: "O que engorda mais, aveia ou granola?",
        answer:
          "Normalmente a granola. Ela é aveia somada a mel, açúcar, castanhas e coco. No mesmo peso pode até ficar perto da aveia, mas a granola costuma vir com mais açúcar e gordura e é mais fácil de exagerar.",
      },
      {
        question: "Granola com iogurte engorda?",
        answer:
          "Um copo americano de iogurte natural (150 g, perto de 77 kcal) com 40 g de granola fica em torno de 245 kcal. É um lanche que cabe; o problema é a granola sem medida e o iogurte adoçado.",
      },
      {
        question: "Granola com leite engorda?",
        answer:
          "Soma as calorias do leite, que dependem do tipo e do copo (veja o rótulo). Uma tigela grande de granola com leite pode passar de uma refeição.",
      },
      {
        question: "Açaí com granola engorda?",
        answer:
          "É uma das combinações mais calóricas: 200 g de polpa de açaí com xarope (perto de 221 kcal) com 40 g de granola passam de 380 kcal antes de leite condensado, banana ou paçoca.",
      },
      {
        question: "Granola light engorda menos?",
        answer:
          "Light quer dizer que o produto tem menos de algum nutriente que a versão comum da marca, pela regra da Anvisa. Não quer dizer poucas calorias: compare o rótulo das duas.",
      },
      {
        question: "Quem está de dieta pode comer granola?",
        answer:
          "Pode, medindo. Duas colheres de sopa por cima do iogurte ou da fruta costumam caber; uma tigela cheia, raramente.",
      },
      {
        question: "É bom comer granola todo dia?",
        answer:
          "Pode ser, em porção pequena e escolhendo uma com pouco açúcar. Se a granola entra todo dia, vale medir em vez de despejar.",
      },
      {
        question: "A granola incha a barriga?",
        answer:
          "Pode, em quem não está acostumado a tanta fibra de uma vez. Comece com pouco e beba água. Se o incômodo for frequente, procure médico ou nutricionista.",
      },
      {
        question: "Por que a granola engorda?",
        answer:
          "Porque concentra calorias: aveia, açúcar, mel e castanhas, assados juntos e secos. Pouco volume tem muita energia, e ela é fácil de comer além da conta.",
      },
    ],
    content: `<img src="/blog-images/granola-engorda-capa.webp" alt="Capa: Granola engorda? Ilustração de pote de granola tombado com mel escorrendo e uma tigela" title="Granola Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Granola engorda?</strong> Pode engordar, porque concentra muita caloria em pouco volume. A granola é aveia assada com mel, açúcar, castanhas e, às vezes, óleo. Duas colheres por cima do iogurte cabem na dieta; a granola despejada à vontade, todo dia, soma rápido.</p>

<h2>Quantas calorias tem a granola?</h2>
<p>A TACO, a Tabela Brasileira de Composição de Alimentos, não tem granola: cada marca e cada receita é diferente. Para dar um número, montamos uma <strong>granola caseira de exemplo</strong> e calculamos com a TACO:</p>
<table>
<thead><tr><th>Ingrediente</th><th>Quantidade</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Aveia em flocos</td><td>30 g</td><td>cerca de 118 kcal</td></tr>
<tr><td>Castanha-do-pará</td><td>10 g</td><td>cerca de 64 kcal</td></tr>
<tr><td>Mel</td><td>10 g</td><td>cerca de 31 kcal</td></tr>
<tr><td>Coco</td><td>5 g</td><td>cerca de 20 kcal</td></tr>
<tr><td>Açúcar mascavo</td><td>5 g</td><td>cerca de 18 kcal</td></tr>
<tr><td><strong>Total</strong></td><td><strong>60 g</strong></td><td><strong>cerca de 252 kcal</strong></td></tr>
</tbody>
</table>
<p>Isso dá perto de <strong>420 kcal em 100 g</strong> e <strong>168 kcal em 40 g</strong>, uma porção comum. A receita é nossa; a granola que você compra pode ter mais ou menos. O número certo é o do rótulo.</p>

<h2>Por que a granola engorda mais que a aveia?</h2>
<p>A granola é aveia <strong>com</strong> outras coisas calóricas. Grama a grama, a nossa granola de exemplo (420 kcal em 100 g) fica perto da aveia pura (394 kcal), mas a conta muda em dois pontos:</p>
<ul>
<li><strong>Açúcar e gordura:</strong> mel, açúcar e castanhas trocam parte da fibra e da proteína da aveia por açúcar e gordura.</li>
<li><strong>Porção:</strong> ninguém come aveia crua às colheradas, mas granola, sim. Ela é crocante, doce e fácil de passar dos 40 g.</li>
</ul>
<p>Veja <a href="/blog/aveia-engorda">aveia engorda?</a>.</p>

<h2>Granola com iogurte, leite, banana ou açaí</h2>
<table>
<thead><tr><th>Combinação</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>40 g de granola + 1 copo americano de iogurte natural (150 g)</td><td>cerca de 245 kcal</td></tr>
<tr><td>40 g de granola + 1 banana prata (75 g)</td><td>cerca de 242 kcal</td></tr>
<tr><td>40 g de granola + 200 g de açaí com xarope</td><td>cerca de 389 kcal</td></tr>
<tr><td>40 g de granola + leite</td><td>168 kcal + o leite (veja o rótulo)</td></tr>
</tbody>
</table>
<p>Granola da nossa receita de exemplo; iogurte, banana e açaí pela TACO com as medidas do IBGE. Os 200 g de açaí são exemplo nosso.</p>
<ul>
<li><strong>Com iogurte:</strong> prefira o iogurte natural e meça a granola. O iogurte adoçado soma mais açúcar.</li>
<li><strong>Com açaí:</strong> é a combinação que mais pesa, e ainda costuma vir com leite condensado, paçoca ou leite em pó. Veja <a href="/blog/acai-engorda">açaí engorda?</a>.</li>
<li><strong>Com leite:</strong> uma tigela grande pode passar de uma refeição. Veja <a href="/blog/leite-engorda">leite engorda?</a>.</li>
</ul>

<h2>Granola light engorda menos?</h2>
<p>Pela regra da Anvisa, <strong>light</strong> quer dizer que o produto tem menos de algum nutriente (açúcar, gordura ou calorias) do que a versão comum. Não quer dizer que tem poucas calorias. Uma granola light ainda pode ser calórica: compare o rótulo das duas, na mesma porção.</p>

<h2>Como escolher a granola no mercado</h2>
<ol>
<li><strong>Olhe a porção do rótulo e as calorias dessa porção.</strong> A porção do rótulo costuma ser menor do que a que a gente serve.</li>
<li><strong>Veja onde está o açúcar na lista de ingredientes.</strong> A lista vem em ordem de quantidade: açúcar, xarope ou mel entre os primeiros quer dizer granola mais doce.</li>
<li><strong>Prefira a que tem mais aveia e castanha</strong> e menos açúcar e óleo.</li>
</ol>

<h2>A granola incha a barriga?</h2>
<p>Pode, em quem não está acostumado a tanta fibra de uma vez. Comece com pouco e beba água. Se o incômodo for frequente, procure médico ou nutricionista. Veja <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a>.</p>

<h2>Quem está de dieta pode comer granola todo dia?</h2>
<p>Pode, medindo. <strong>Duas colheres de sopa</strong> por cima do iogurte ou da fruta costumam caber; uma tigela cheia, raramente. Se a granola entra todo dia, meça em vez de despejar. Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come granola todo dia e emagrece, e gente que tira a granola e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com a granola dentro, na medida, se você gosta dela.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: aveia em flocos, castanha-do-pará, mel, coco, açúcar mascavo, iogurte natural, banana prata, polpa de açaí com xarope</li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (copo americano de iogurte, unidade de banana)</li>
<li><a href="https://bvsms.saude.gov.br/bvs/saudelegis/anvisa/2012/rdc0054_12_11_2012.html" target="_blank" rel="noopener noreferrer">Anvisa — RDC nº 54/2012, informação nutricional complementar</a> (o que significa "light")</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/aveia-engorda">Aveia engorda?</a></li>
<li><a href="/blog/acai-engorda">Açaí engorda?</a></li>
<li><a href="/blog/banana-engorda">Banana engorda?</a></li>
<li><a href="/blog/alimentos-ricos-em-fibra">Alimentos ricos em fibra</a></li>
</ul>`,
  },
];
