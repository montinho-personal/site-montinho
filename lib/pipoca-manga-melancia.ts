import type { BlogPost } from "./blog";

/**
 * Pipoca revisada em 16/11/2026 com o SerpApi ("pipoca engorda", celular, São
 * Paulo): H2 arroz ou pão (TACO: arroz cozido 128, pão francês 300, azeite e
 * óleo 884 kcal/100 g; pão 50 g pela POF) e como fazer para não engordar; +4 FAQ.
 *
 * Manga e melancia revisadas em 17/11/2026 com o SerpApi ("manga engorda" e
 * "melancia engorda", celular, São Paulo). Manga: H2 manga inteira na dieta e
 * incha a barriga; FAQ com sal, inteira, frutas menos calóricas, inchaço.
 * Melancia: tabela nutricional (TACO: 0,9 g proteína, lipídeos em traço,
 * 104 mg potássio, 6,2 mg vitamina C em 100 g), suco, fruta mais calórica
 * (TACO: coco cru 406, tamarindo 276, pequi 205, abacate 96 kcal/100 g),
 * barriga e gravidez. Manga inteira de 300 g de polpa é exemplo nosso.
 *
 * "Pipoca engorda?", "Manga engorda?" e "Melancia engorda?" (11/11/2026).
 * Planejador de Palavras-chave do Google Ads (Brasil): "pipoca engorda"
 * 22.200/mês; "manga engorda" e "melancia engorda" 12.100 cada. Pedido do
 * Montinho ("pode fazer, depois me lembra de enviar os prints"): escritos sem
 * prints e sem export do Answer the Public; H2 e FAQ a revisar quando chegarem.
 *
 * Canibalização: nenhum artigo com pipoca, manga ou melancia no slug ou título
 * (busca normalizada). Vizinhos linkados: melhores frutas para emagrecer,
 * banana, chocolate, beliscar, vontade de doce, carboidrato à noite.
 *
 * Números: TACO 4ª edição, pela base do site, por 100 g.
 * - Pipoca com óleo de soja, sem sal: 448 kcal, 70,3 g carboidrato, 9,9 g
 *   proteína, 15,9 g gordura, 14,3 g fibra. A base não tem medida caseira de
 *   pipoca: 20, 30 e 50 g são exemplos nossos (90, 134 e 224 kcal). Pipoca sem
 *   óleo, de micro-ondas e de cinema: sem valor na base, vale o rótulo.
 *   Manteiga com sal 726 kcal/100 g (10 g: 73). Açúcar refinado 387 (20 g: 77).
 *   Leite condensado 313 (20 g: 63). Batata chips 543 (30 g: 163). Chocolate
 *   ao leite 540 (30 g: 162).
 * - Manga Palmer 72,5 kcal (19,4 g carboidrato, 1,6 g fibra); Tommy Atkins
 *   50,7 (12,8 g; 2,1 g); Haden 63,5 (16,7 g; 1,6 g); polpa congelada 48,3.
 *   A base não tem medida caseira de manga: 150 g e 200 g são exemplos nossos.
 *   Comparação por 100 g: melancia 33, melão 29, morango 30, mamão papaia 40,
 *   laranja-pera 37, abacaxi 48, uva itália 53, maçã fuji 56, banana prata 98.
 * - Melancia crua: 32,6 kcal, 8,1 g carboidrato, 0,9 g proteína, 0,1 g fibra,
 *   90,7 g de água (umidade). Porções (POF 2008-2009, IBGE): pedaço 150 g (49 kcal),
 *   fatia 200 g (65), porção 296 g (97).
 *
 * Ferramenta: cartão de link da Calculadora de Déficit (ARTIGOS_COM_LINK_DEFICIT)
 * e ficha de alimento (FICHAS_POR_ARTIGO).
 */

const TACO = `<a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>`;
const IBGE = `<a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a>`;

export const PIPOCA_MANGA_MELANCIA_POSTS: BlogPost[] = [
  {
    slug: "pipoca-engorda",
    title: "Pipoca Engorda? Calorias, Pipoca Doce, de Manteiga e à Noite",
    metaTitle: "Pipoca Engorda? Calorias, Pipoca Doce, de Manteiga e à Noite",
    metaDescription:
      "30 g de pipoca feita com óleo têm perto de 134 kcal e bastante fibra. Veja quando a pipoca engorda, o que muda com manteiga ou açúcar e se dá para comer à noite e na dieta.",
    excerpt:
      "Quantas calorias tem a pipoca, por que a manteiga e o açúcar mudam tudo, pipoca de micro-ondas e de cinema, pipoca à noite, na dieta e comparada com chips e chocolate.",
    category: "Nutrição",
    date: "2026-11-11",
    updatedAt: "2026-11-16",
    readTime: "6 min",
    author: "Montinho",
    tags: ["pipoca", "calorias", "lanche", "fibra", "dieta"],
    faq: [
      {
        question: "Pipoca engorda?",
        answer:
          "Sozinha, não. 30 g de pipoca feita com óleo têm perto de 134 kcal. Ela engorda quando a porção cresce, vem com manteiga, açúcar ou leite condensado, e o total do dia passa do seu gasto por semanas.",
      },
      {
        question: "Quantas calorias tem a pipoca?",
        answer:
          "Pela TACO, 100 g de pipoca feita com óleo de soja, sem sal, têm 448 kcal. Em porções: 20 g têm perto de 90 kcal; 30 g, 134 kcal; 50 g, 224 kcal.",
      },
      {
        question: "Pipoca engorda ou emagrece?",
        answer:
          "Nenhum alimento emagrece sozinho. A pipoca ajuda quem quer emagrecer porque ocupa muito volume e tem bastante fibra (14,3 g em 100 g), mas é calórica no peso. Funciona em porção medida, como lanche.",
      },
      {
        question: "Pipoca à noite engorda?",
        answer:
          "O horário não engorda; o total do dia, sim. Uma porção de pipoca à noite cabe na dieta. O que pesa é o balde no sofá, com manteiga, comido sem perceber.",
      },
      {
        question: "Pipoca doce engorda mais?",
        answer:
          "Sim. Cada 20 g de açúcar somam perto de 77 kcal, e 20 g de leite condensado, perto de 63 kcal, sem contar a pipoca.",
      },
      {
        question: "Pipoca com manteiga engorda?",
        answer:
          "A manteiga é o que mais soma: 10 g têm perto de 73 kcal. Duas colheres na panela quase dobram as calorias de uma porção pequena.",
      },
      {
        question: "Pipoca de micro-ondas engorda?",
        answer:
          "Depende da marca: muitas vêm com gordura e sal. A TACO não traz pipoca de micro-ondas, então o número certo é o do rótulo, na porção que você come.",
      },
      {
        question: "Pipoca de cinema engorda?",
        answer:
          "O tamanho do balde é o problema. Os cinemas não publicam o peso de forma padronizada, e a TACO não tem pipoca de cinema; se quiser, divida um balde ou peça o menor.",
      },
      {
        question: "Quem está de dieta pode comer pipoca?",
        answer:
          "Pode. Uma porção de 20 a 30 g, feita com pouco óleo, é um lanche que sustenta e cabe na maioria das dietas. Meça antes de estourar.",
      },
      {
        question: "Pipoca é carboidrato?",
        answer:
          "É. Pela TACO, 100 g de pipoca têm 70,3 g de carboidrato, 15,9 g de gordura (do óleo) e 9,9 g de proteína.",
      },
      {
        question: "Pipoca incha a barriga?",
        answer:
          "Pode, em quem não está acostumado a tanta fibra de uma vez. Beba água e comece com pouco. Se o incômodo for frequente, procure médico ou nutricionista.",
      },
      {
        question: "O que engorda mais, arroz ou pipoca?",
        answer:
          "No mesmo peso, a pipoca: 448 kcal em 100 g contra 128 kcal do arroz cozido, porque o arroz tem muita água. Na porção, a conta empata: 30 g de pipoca com óleo dão cerca de 134 kcal, o mesmo que 100 g de arroz cozido.",
      },
      {
        question: "O que engorda mais, pipoca ou pão?",
        answer:
          "No peso, a pipoca (448 kcal em 100 g contra 300 kcal do pão francês). Na porção, 1 pão francês de 50 g tem cerca de 150 kcal, perto de 33 g de pipoca com óleo, que rende uma tigela bem maior.",
      },
      {
        question: "Como fazer a pipoca para não engordar?",
        answer:
          "Use pouco óleo ou azeite (um fio, medido), ou a pipoqueira de ar; tempere com sal na medida, ervas ou páprica, e deixe a manteiga, o açúcar e o leite condensado para de vez em quando. E sirva a porção num pote, em vez de comer direto da panela.",
      },
      {
        question: "Quantas calorias tem 100 g de pipoca estourada?",
        answer:
          "Cerca de 448 kcal para pipoca feita com óleo de soja e sem sal, segundo a TACO. Como a pipoca pesa pouco, 100 g já é um balde grande; uma porção comum fica entre 20 e 30 g.",
      },
      {
        question: "O que engorda mais, pipoca ou batata chips?",
        answer:
          "A chips. 30 g de batata chips têm perto de 163 kcal, contra 134 kcal de 30 g de pipoca feita com óleo, e a pipoca tem muito mais fibra.",
      },
    ],
    content: `<img src="/blog-images/pipoca-engorda-capa.webp" alt="Capa: Pipoca engorda? Ilustração de tigela de pipoca ao lado de um saco listrado" title="Pipoca Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Pipoca engorda?</strong> Sozinha, não. 30 g de pipoca feita com óleo têm perto de 134 kcal e bastante fibra, o que faz dela um lanche que ocupa a mão e a barriga. Ela engorda quando vira balde, com manteiga, açúcar ou leite condensado, e o total do dia passa do seu gasto por semanas.</p>

<h2>Quantas calorias tem a pipoca?</h2>
<table>
<thead><tr><th>Pipoca com óleo, sem sal</th><th>Calorias</th><th>Carboidrato</th><th>Fibra</th></tr></thead>
<tbody>
<tr><td>20 g</td><td>cerca de 90 kcal</td><td>14 g</td><td>2,9 g</td></tr>
<tr><td><strong>30 g</strong></td><td><strong>cerca de 134 kcal</strong></td><td>21 g</td><td>4,3 g</td></tr>
<tr><td>50 g</td><td>cerca de 224 kcal</td><td>35 g</td><td>7,2 g</td></tr>
<tr><td>100 g</td><td>448 kcal</td><td>70,3 g</td><td>14,3 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, para pipoca feita com óleo de soja e sem sal. A tabela de medidas do IBGE não traz porção caseira de pipoca, então os pesos acima são exemplos nossos. Pipoca estourada pesa pouco e ocupa muito: a forma mais segura de medir é pesar o milho ou a pipoca, ou seguir a porção do rótulo. Você vai encontrar a ficha da pipoca no fim do artigo.</p>

<h2>Pipoca engorda ou emagrece?</h2>
<p>Nenhum alimento emagrece sozinho. A pipoca <strong>ajuda</strong> porque tem muito volume e fibra (14,3 g em 100 g): uma tigela cheia pesa pouco e demora para comer. Mas, no peso, ela é calórica, por causa do milho seco e do óleo. Funciona como lanche medido, não como petisco infinito em frente à TV.</p>

<h2>O que vai na pipoca muda tudo</h2>
<table>
<thead><tr><th>Junto com a pipoca</th><th>Calorias a mais</th></tr></thead>
<tbody>
<tr><td>10 g de manteiga</td><td>cerca de 73 kcal</td></tr>
<tr><td>20 g de açúcar (pipoca doce)</td><td>cerca de 77 kcal</td></tr>
<tr><td>20 g de leite condensado</td><td>cerca de 63 kcal</td></tr>
</tbody>
</table>
<p>Valores da TACO; as quantidades são exemplos nossos.</p>
<ul>
<li><strong>Manteiga:</strong> é o que mais soma. Duas colheres derretidas por cima quase dobram as calorias de uma porção pequena.</li>
<li><strong>Pipoca doce:</strong> o açúcar ou o leite condensado viram calda e grudam em tudo, então a porção pesa mais do que parece.</li>
<li><strong>Pipoca sem óleo</strong> (na pipoqueira de ar ou no micro-ondas em vasilha própria): tem menos gordura, mas a TACO não traz o valor dela.</li>
</ul>

<h2>Pipoca de micro-ondas e de cinema engordam?</h2>
<p>A TACO não tem nenhuma das duas. A de <strong>micro-ondas</strong> muda muito de marca para marca, e muitas vêm com bastante gordura e sal: confira o rótulo, na porção que você realmente come. A de <strong>cinema</strong> pesa pelo tamanho do balde e pela manteiga. Se quiser, peça o menor ou divida.</p>

<h2>Pipoca à noite engorda?</h2>
<p>O horário não engorda; o total do dia, sim. Uma porção de pipoca à noite cabe na dieta, e é uma troca melhor que muito petisco. O que pesa é o balde no sofá, comido sem olhar. Veja <a href="/blog/carboidrato-a-noite-engorda">carboidrato à noite engorda?</a> e <a href="/blog/beliscar-engorda">beliscar engorda?</a>.</p>

<h2>Pipoca engorda mais que chips ou chocolate?</h2>
<table>
<thead><tr><th>Lanche (30 g)</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Batata chips</td><td>cerca de 163 kcal</td></tr>
<tr><td>Chocolate ao leite</td><td>cerca de 162 kcal</td></tr>
<tr><td>Pipoca com óleo</td><td>cerca de 134 kcal</td></tr>
</tbody>
</table>
<p>No mesmo peso, a pipoca tem menos calorias e muito mais fibra que a chips e o chocolate, e ocupa bem mais espaço no pote. Veja <a href="/blog/chocolate-engorda">chocolate engorda?</a>.</p>

<h2>Pipoca engorda mais que arroz ou pão?</h2>
<p>Depende de como você compara. No mesmo peso, a pipoca é a mais calórica, porque é milho seco com óleo, sem água. Na porção que as pessoas comem, a conta fica parecida:</p>
<table>
<thead><tr><th>Porção</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>30 g de pipoca com óleo</td><td>cerca de 134 kcal</td></tr>
<tr><td>100 g de arroz branco cozido</td><td>cerca de 128 kcal</td></tr>
<tr><td>1 pão francês (50 g)</td><td>cerca de 150 kcal</td></tr>
</tbody>
</table>
<p>Valores da TACO; o peso do pão é o da pesquisa de orçamentos do IBGE, e os outros pesos são exemplos nossos. A diferença está no volume: 30 g de pipoca enchem uma tigela, e é isso que ajuda a segurar a fome. Veja também <a href="/blog/arroz-engorda">arroz engorda?</a>.</p>

<h2>Como fazer pipoca para não engordar</h2>
<ul>
<li><strong>Meça a gordura.</strong> Óleo e azeite têm cerca de 884 kcal em 100 g. Um fio de 5 g soma perto de 44 kcal na panela inteira; despejar sem medir pode somar o triplo.</li>
<li><strong>Sem óleo também estoura.</strong> Na pipoqueira de ar ou no micro-ondas, em vasilha própria, a pipoca sai com bem menos gordura.</li>
<li><strong>Tempere sem calorias.</strong> Sal na medida, ervas, páprica, orégano ou pimenta. Tempero pronto em pó costuma ter muito sódio: veja o rótulo.</li>
<li><strong>Pipoca de saco e de micro-ondas:</strong> são industrializadas e mudam de marca para marca. A porção e as calorias estão no rótulo.</li>
<li><strong>Sirva num pote.</strong> Comer direto da panela ou do balde é o jeito mais fácil de perder a conta.</li>
</ul>

<h2>Pipoca incha a barriga?</h2>
<p>Pode, em quem não está acostumado a tanta fibra de uma vez. Beba água e comece com pouco. Se o incômodo for frequente, procure médico ou nutricionista. Veja <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a>.</p>

<h2>Quem está de dieta pode comer pipoca?</h2>
<p>Pode. <strong>20 a 30 g</strong>, feita com pouco óleo e sal na medida, é um lanche que sustenta e cabe na maioria das dietas. Quem tem diabetes ou pressão alta precisa conversar com o médico sobre carboidrato e sal. Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come pipoca toda noite e emagrece, e gente que corta a pipoca e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com a pipoca do filme dentro, se ela faz parte da sua vida.</p>

<h2>Fontes</h2>
<ul>
<li>${TACO}: pipoca com óleo de soja sem sal, manteiga com sal, açúcar refinado, leite condensado, batata frita tipo chips, chocolate ao leite</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/chocolate-engorda">Chocolate engorda?</a></li>
<li><a href="/blog/beliscar-engorda">Beliscar engorda?</a></li>
<li><a href="/blog/lanches-saudaveis-para-emagrecer">Lanches saudáveis para emagrecer</a></li>
<li><a href="/blog/alimentos-ricos-em-fibra">Alimentos ricos em fibra</a></li>
</ul>`,
  },
  {
    slug: "manga-engorda",
    title: "Manga Engorda? Calorias por Tipo, à Noite e com Leite",
    metaTitle: "Manga Engorda? Calorias por Tipo, à Noite e com Leite",
    metaDescription:
      "100 g de manga Tommy têm perto de 51 kcal; a Palmer, 73. Veja quando a manga engorda, qual tipo tem mais calorias, manga à noite, com leite, em suco e na dieta.",
    excerpt:
      "Quantas calorias tem a manga Palmer, Tommy e Haden, quanto comer, manga à noite, com leite e em suco, e como ela se compara a banana, maçã, mamão e melancia.",
    category: "Nutrição",
    date: "2026-11-11",
    updatedAt: "2026-11-17",
    readTime: "7 min",
    author: "Montinho",
    tags: ["manga", "frutas", "calorias", "carboidrato", "dieta"],
    faq: [
      {
        question: "Manga engorda?",
        answer:
          "Sozinha, não. 100 g de manga Tommy têm perto de 51 kcal, e 100 g da Palmer, perto de 73. Ela engorda só se o total do dia passar do seu gasto por semanas, como qualquer alimento.",
      },
      {
        question: "Quantas calorias tem uma manga?",
        answer:
          "Depende do tipo e do tamanho. Pela TACO, 150 g de polpa (uma tigelinha, exemplo nosso) têm perto de 76 kcal na Tommy, 95 na Haden e 109 na Palmer.",
      },
      {
        question: "Qual manga engorda mais?",
        answer:
          "A Palmer: 72,5 kcal em 100 g, contra 63,5 da Haden e 50,7 da Tommy Atkins. A diferença está no açúcar natural de cada uma.",
      },
      {
        question: "Manga engorda ou emagrece?",
        answer:
          "Nenhum alimento emagrece sozinho. A manga tem poucas calorias para o volume e ajuda a trocar um doce, mas soma como qualquer fruta.",
      },
      {
        question: "Manga à noite engorda?",
        answer:
          "Não. O horário não engorda; o que conta é o total do dia. Manga de sobremesa no jantar cabe na dieta.",
      },
      {
        question: "Manga com leite engorda?",
        answer:
          "Soma as calorias do leite, que dependem do tipo e do copo (confira o rótulo; a TACO não traz o leite líquido). Uma vitamina com açúcar soma mais ainda.",
      },
      {
        question: "Suco de manga engorda?",
        answer:
          "Pode engordar mais que a fruta, porque é fácil tomar mais manga do que você comeria e porque o açúcar costuma ir junto. 20 g de açúcar somam perto de 77 kcal.",
      },
      {
        question: "Manga tem muito açúcar?",
        answer:
          "Tem o açúcar natural da fruta. Pela TACO, 100 g de manga têm de 12,8 g (Tommy) a 19,4 g (Palmer) de carboidrato. Quem tem diabetes deve combinar a porção com o médico ou nutricionista.",
      },
      {
        question: "Engorda mais manga ou banana?",
        answer:
          "A banana. 100 g de banana prata têm perto de 98 kcal; a manga Tommy, 51, e a Palmer, 73.",
      },
      {
        question: "Estou de dieta, posso comer uma manga inteira?",
        answer:
          "Pode, contando no total do dia. Uma manga grande com 300 g de polpa (exemplo nosso) tem perto de 152 kcal na Tommy e 217 na Palmer, menos que muito lanche de pacote.",
      },
      {
        question: "Manga com sal engorda?",
        answer:
          "O sal não tem calorias, então não muda o quanto a manga engorda. Só não exagere no sal por causa do sódio.",
      },
      {
        question: "A manga causa inchaço na barriga?",
        answer:
          "Em algumas pessoas, muita fruta de uma vez pode dar gases e desconforto. Isso é inchaço, não gordura, e passa. Se acontece sempre, observe a quantidade e procure médico ou nutricionista.",
      },
      {
        question: "Quais são as frutas menos calóricas?",
        answer:
          "Pela TACO, em 100 g: melão (29 kcal), morango (30), melancia (33), laranja-pera (37) e mamão papaia (40). A manga Tommy tem 51.",
      },
      {
        question: "Quanta manga posso comer por dia?",
        answer:
          "Para a maioria das pessoas, uma porção de 150 a 200 g por dia cabe bem, junto com outras frutas. Mais que isso pode caber, desde que você conte no total do dia.",
      },
    ],
    content: `<img src="/blog-images/manga-engorda-capa.webp" alt="Capa: Manga engorda? Ilustração de uma manga inteira ao lado de meia manga cortada em cubos" title="Manga Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Manga engorda?</strong> Sozinha, não. 100 g de manga Tommy têm perto de 51 kcal, e 100 g da Palmer, perto de 73. É uma fruta com poucas calorias para o volume. Ela só pesa se vier em suco com açúcar, em vitamina grande ou se o total do dia passar do seu gasto por semanas.</p>

<h2>Quantas calorias tem a manga?</h2>
<table>
<thead><tr><th>Tipo (crua)</th><th>100 g</th><th>150 g</th><th>200 g</th><th>Carboidrato em 100 g</th></tr></thead>
<tbody>
<tr><td>Tommy Atkins</td><td>51 kcal</td><td>cerca de 76 kcal</td><td>cerca de 101 kcal</td><td>12,8 g</td></tr>
<tr><td>Haden</td><td>64 kcal</td><td>cerca de 95 kcal</td><td>cerca de 127 kcal</td><td>16,7 g</td></tr>
<tr><td><strong>Palmer</strong></td><td><strong>73 kcal</strong></td><td>cerca de 109 kcal</td><td>cerca de 145 kcal</td><td>19,4 g</td></tr>
<tr><td>Polpa congelada</td><td>48 kcal</td><td>cerca de 72 kcal</td><td>cerca de 97 kcal</td><td>12,5 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos. A tabela de medidas do IBGE não traz porção caseira de manga, e o tamanho da fruta varia muito, então 150 g (uma tigelinha) e 200 g são exemplos nossos. Você vai encontrar a ficha da manga no fim do artigo.</p>

<h2>Qual manga engorda mais?</h2>
<p>A <strong>Palmer</strong>, com 72,5 kcal em 100 g, seguida da Haden (63,5) e da Tommy Atkins (50,7). A diferença está no açúcar natural de cada uma. Na prática, ela é pequena: trocar a Palmer pela Tommy numa tigelinha economiza uns 33 kcal.</p>

<h2>Manga engorda ou emagrece?</h2>
<p>Nenhum alimento emagrece sozinho. A manga ajuda quem quer emagrecer porque é doce, tem pouca caloria para o volume e pode entrar no lugar de uma sobremesa. Mas soma como qualquer fruta: é parte do total do dia. Veja <a href="/blog/melhores-frutas-para-emagrecer">melhores frutas para emagrecer</a> e <a href="/blog/vontade-de-doce">vontade de doce</a>.</p>

<h2>Manga à noite engorda?</h2>
<p>Não. O horário não engorda; o que conta é o total do dia. Manga de sobremesa no jantar cabe na dieta. Veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</p>

<h2>Manga com leite e suco de manga engordam?</h2>
<ul>
<li><strong>Manga com leite (vitamina):</strong> soma as calorias do leite, que dependem do tipo e do copo. Confira o rótulo; a TACO não traz o leite líquido. Veja <a href="/blog/leite-engorda">leite engorda?</a>.</li>
<li><strong>Suco de manga:</strong> é fácil tomar mais manga em suco do que você comeria inteira, e o açúcar costuma ir junto: 20 g de açúcar somam perto de 77 kcal. Se for tomar, prefira sem açúcar, ou coma a fruta.</li>
</ul>

<h2>Manga engorda mais que outras frutas?</h2>
<table>
<thead><tr><th>Fruta (100 g, crua)</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Banana prata</td><td>98 kcal</td></tr>
<tr><td>Manga Palmer</td><td>73 kcal</td></tr>
<tr><td>Maçã fuji com casca</td><td>56 kcal</td></tr>
<tr><td>Uva itália</td><td>53 kcal</td></tr>
<tr><td>Manga Tommy Atkins</td><td>51 kcal</td></tr>
<tr><td>Abacaxi</td><td>48 kcal</td></tr>
<tr><td>Mamão papaia</td><td>40 kcal</td></tr>
<tr><td>Laranja-pera</td><td>37 kcal</td></tr>
<tr><td>Melancia</td><td>33 kcal</td></tr>
<tr><td>Morango</td><td>30 kcal</td></tr>
</tbody>
</table>
<p>A manga fica no meio da tabela: mais calórica que melancia e morango, menos que a banana. Veja <a href="/blog/banana-engorda">banana engorda?</a> e <a href="/blog/melancia-engorda">melancia engorda?</a>.</p>

<h2>Manga tem muito açúcar?</h2>
<p>Tem o açúcar natural da fruta: de 12,8 g (Tommy) a 19,4 g (Palmer) de carboidrato em 100 g, segundo a TACO. Para a maioria das pessoas, isso cabe sem problema. Quem tem diabetes deve combinar a porção com o médico ou nutricionista. Veja <a href="/blog/musculacao-e-diabetes-tipo-2">musculação e diabetes tipo 2</a>.</p>

<h2>Manga incha a barriga?</h2>
<p>Em algumas pessoas, muita fruta de uma vez pode dar gases e desconforto. Isso é <strong>inchaço, não gordura</strong>: passa em algumas horas. Se acontece sempre, observe a quantidade e procure médico ou nutricionista. Veja <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a>.</p>

<h2>Quanta manga comer por dia?</h2>
<p>Para a maioria das pessoas, <strong>150 a 200 g por dia</strong> cabem bem, junto com outras frutas. Mais que isso pode caber, desde que você conte no total do dia. Para saber quantas calorias cabem no seu, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Estou de dieta: posso comer uma manga inteira?</h2>
<p>Pode, contando no total do dia. O tamanho varia muito, mas uma manga grande com <strong>300 g de polpa</strong> (exemplo nosso) tem perto de <strong>152 kcal na Tommy</strong> e <strong>217 na Palmer</strong>. Se a manga inteira for o lanche da tarde, ela cabe; se vier depois de uma sobremesa, soma as duas. E com sal, como muita gente come: o sal não tem calorias, então não muda a conta.</p>

<h2>Não se compare</h2>
<p>Tem gente que come manga todo dia e emagrece, e gente que corta a fruta e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com a manga dentro, se você gosta dela.</p>

<h2>Fontes</h2>
<ul>
<li>${TACO}: manga Palmer, Tommy Atkins e Haden crua (300 g de polpa: exemplo nosso), polpa de manga congelada, banana prata, maçã fuji, uva itália, abacaxi, mamão papaia, laranja-pera, melancia, morango, açúcar refinado</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/melancia-engorda">Melancia engorda?</a></li>
<li><a href="/blog/banana-engorda">Banana engorda?</a></li>
<li><a href="/blog/melhores-frutas-para-emagrecer">Melhores frutas para emagrecer</a></li>
<li><a href="/blog/frutas-antes-do-treino">Frutas antes do treino</a></li>
</ul>`,
  },
  {
    slug: "melancia-engorda",
    title: "Melancia Engorda? Calorias por Fatia, à Noite e na Dieta",
    metaTitle: "Melancia Engorda? Calorias por Fatia, à Noite e na Dieta",
    metaDescription:
      "Uma fatia de melancia tem perto de 65 kcal e é 90% água. Veja quando a melancia engorda, se tem muito açúcar, se pode comer à noite e quanto comer por dia.",
    excerpt:
      "Quantas calorias tem a melancia por fatia e pedaço, quanto de água e açúcar, melancia à noite, na dieta, com diabetes e comparada com outras frutas.",
    category: "Nutrição",
    date: "2026-11-11",
    updatedAt: "2026-11-17",
    readTime: "6 min",
    author: "Montinho",
    tags: ["melancia", "frutas", "calorias", "dieta", "emagrecimento"],
    faq: [
      {
        question: "Melancia engorda?",
        answer:
          "É difícil engordar com melancia. Uma fatia (200 g) tem perto de 65 kcal, e a fruta é mais de 90% água. Ela só engorda se o total do dia passar do seu gasto por semanas.",
      },
      {
        question: "Quantas calorias tem uma fatia de melancia?",
        answer:
          "Pelas medidas do IBGE e a TACO: 1 pedaço (150 g) tem perto de 49 kcal; 1 fatia (200 g), perto de 65 kcal; a porção de referência do IBGE (296 g), perto de 97 kcal.",
      },
      {
        question: "Melancia engorda ou emagrece?",
        answer:
          "Nenhum alimento emagrece sozinho. A melancia ajuda porque tem muito volume e poucas calorias: dá para comer bastante e somar pouco.",
      },
      {
        question: "Melancia à noite engorda?",
        answer:
          "Não. O horário não engorda; o que conta é o total do dia. Uma fatia de melancia à noite é uma sobremesa leve.",
      },
      {
        question: "Melancia tem muito açúcar?",
        answer:
          "Não muito. Pela TACO, 100 g de melancia têm 8,1 g de carboidrato, perto de 16 g numa fatia de 200 g. Quem tem diabetes deve combinar a porção com o médico ou nutricionista.",
      },
      {
        question: "Melancia tem muita água?",
        answer:
          "Sim. Pela TACO, 100 g de melancia têm 90,7 g de água. É por isso que ela tem tão poucas calorias.",
      },
      {
        question: "Quem está de dieta pode comer melancia?",
        answer:
          "Pode. Uma ou duas fatias por dia cabem na maioria das dietas e ajudam a matar a vontade de doce.",
      },
      {
        question: "Melancia incha a barriga?",
        answer:
          "Em algumas pessoas, muita fruta de uma vez pode dar desconforto. Se acontece sempre, observe a quantidade e procure médico ou nutricionista.",
      },
      {
        question: "Quanta melancia posso comer por dia?",
        answer:
          "Para a maioria das pessoas, de 1 a 2 fatias (200 a 400 g) por dia cabem bem. Meio quilo tem perto de 163 kcal.",
      },
      {
        question: "Melancia engorda a barriga?",
        answer:
          "Não. Nenhum alimento leva gordura para um lugar escolhido; ela sai e entra no corpo todo, pelo total do dia. Se a barriga estufa depois de muita melancia, é inchaço, não gordura.",
      },
      {
        question: "Qual a tabela nutricional da melancia?",
        answer:
          "Pela TACO, 100 g de melancia crua têm 33 kcal, 8,1 g de carboidrato, 0,9 g de proteína, gordura em traço, 0,1 g de fibra, 90,7 g de água, 104 mg de potássio e 6,2 mg de vitamina C.",
      },
      {
        question: "É bom tomar suco de melancia todos os dias?",
        answer:
          "Sem açúcar, o suco tem as mesmas calorias da fruta batida. O cuidado é a quantidade: num copo vai muita melancia, e se entrar açúcar, ele soma (20 g de açúcar têm perto de 77 kcal).",
      },
      {
        question: "Qual é a fruta mais calórica?",
        answer:
          "Entre as frutas da TACO, o coco cru (406 kcal em 100 g), o tamarindo (276) e o pequi (205). O abacate tem 96, e a banana prata, 98. A melancia, com 33, fica entre as menos calóricas.",
      },
      {
        question: "Melancia engorda na gravidez?",
        answer:
          "As calorias são as mesmas de fora da gravidez. Na gestação, quanto e o que comer é com o médico e o nutricionista do pré-natal.",
      },
      {
        question: "Engorda mais melancia ou manga?",
        answer:
          "A manga. 100 g de melancia têm 33 kcal; a manga Tommy, 51, e a Palmer, 73.",
      },
    ],
    content: `<img src="/blog-images/melancia-engorda-capa.webp" alt="Capa: Melancia engorda? Ilustração de duas fatias de melancia, uma mordida" title="Melancia Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Melancia engorda?</strong> É difícil engordar com melancia. Uma fatia tem perto de 65 kcal, e a fruta é mais de 90% água. Ela é uma das frutas com menos calorias por peso: dá para comer bastante e somar pouco no dia.</p>

<h2>Quantas calorias tem a melancia?</h2>
<table>
<thead><tr><th>Porção</th><th>Calorias</th><th>Carboidrato</th></tr></thead>
<tbody>
<tr><td>1 pedaço (150 g)</td><td>cerca de 49 kcal</td><td>12 g</td></tr>
<tr><td><strong>1 fatia (200 g)</strong></td><td><strong>cerca de 65 kcal</strong></td><td>16 g</td></tr>
<tr><td>1 porção do IBGE (296 g)</td><td>cerca de 97 kcal</td><td>24 g</td></tr>
<tr><td>500 g</td><td>cerca de 163 kcal</td><td>41 g</td></tr>
<tr><td>100 g</td><td>33 kcal</td><td>8,1 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, com as porções da tabela de medidas do IBGE (o meio quilo é exemplo nosso). Você vai encontrar a ficha da melancia no fim do artigo.</p>

<h2>Tabela nutricional da melancia</h2>
<table>
<thead><tr><th>Em 100 g de melancia crua</th><th>Quantidade</th></tr></thead>
<tbody>
<tr><td>Calorias</td><td>33 kcal</td></tr>
<tr><td>Carboidrato</td><td>8,1 g</td></tr>
<tr><td>Proteína</td><td>0,9 g</td></tr>
<tr><td>Gordura</td><td>traço (quase zero)</td></tr>
<tr><td>Fibra</td><td>0,1 g</td></tr>
<tr><td>Água</td><td>90,7 g</td></tr>
<tr><td>Potássio</td><td>104 mg</td></tr>
<tr><td>Vitamina C</td><td>6,2 mg</td></tr>
</tbody>
</table>
<p>Valores da TACO.</p>

<h2>Por que a melancia tem tão poucas calorias?</h2>
<p>Porque é quase toda água: pela TACO, <strong>90,7 g em cada 100 g</strong>. Sobra pouco espaço para açúcar, e quase nada de gordura e proteína. É o mesmo motivo de o melão (29 kcal em 100 g) e o morango (30) também ficarem lá embaixo na tabela.</p>

<h2>Melancia engorda ou emagrece?</h2>
<p>Nenhum alimento emagrece sozinho. A melancia <strong>ajuda</strong> porque enche o prato e a barriga com pouca caloria, e pode entrar no lugar de um doce. Ela quase não tem fibra (0,1 g em 100 g), então não sustenta por muito tempo: funciona melhor como sobremesa ou junto de uma refeição. Veja <a href="/blog/melhores-frutas-para-emagrecer">melhores frutas para emagrecer</a>.</p>

<h2>Melancia à noite engorda?</h2>
<p>Não. O horário não engorda; o que conta é o total do dia. Uma fatia à noite é uma sobremesa leve. Veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</p>

<h2>Melancia tem muito açúcar?</h2>
<p>Não muito: <strong>8,1 g de carboidrato em 100 g</strong>, perto de 16 g numa fatia. É menos que a manga e bem menos que a banana. Para a maioria das pessoas, cabe sem problema. Quem tem diabetes deve combinar a porção com o médico ou nutricionista.</p>

<h2>Melancia engorda mais que outras frutas?</h2>
<table>
<thead><tr><th>Fruta (100 g, crua)</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Banana prata</td><td>98 kcal</td></tr>
<tr><td>Manga Palmer</td><td>73 kcal</td></tr>
<tr><td>Maçã fuji com casca</td><td>56 kcal</td></tr>
<tr><td>Mamão papaia</td><td>40 kcal</td></tr>
<tr><td>Laranja-pera</td><td>37 kcal</td></tr>
<tr><td><strong>Melancia</strong></td><td><strong>33 kcal</strong></td></tr>
<tr><td>Morango</td><td>30 kcal</td></tr>
<tr><td>Melão</td><td>29 kcal</td></tr>
</tbody>
</table>
<p>Na outra ponta, as frutas mais calóricas da TACO são o coco cru (406 kcal em 100 g), o tamarindo (276) e o pequi (205); o abacate tem 96. Veja <a href="/blog/manga-engorda">manga engorda?</a> e <a href="/blog/banana-engorda">banana engorda?</a>.</p>

<h2>Suco de melancia engorda? Pode tomar todo dia?</h2>
<p>Sem açúcar, o suco tem as mesmas calorias da melancia batida. O cuidado é a quantidade: num copo cabe muita fruta, e é fácil tomar dois. Se entrar açúcar, ele soma: 20 g têm perto de 77 kcal. Todo dia, sem açúcar e no lugar de um refrigerante, cabe na maioria das dietas.</p>

<h2>Melancia engorda a barriga?</h2>
<p>Não. Nenhum alimento leva gordura para um lugar escolhido: ela entra e sai do corpo todo, pelo total do dia. Veja <a href="/blog/gordura-localizada-mitos-e-fatos">gordura localizada</a>.</p>

<h2>Melancia incha a barriga?</h2>
<p>Em algumas pessoas, muita fruta de uma vez pode dar desconforto. Se acontece sempre, observe a quantidade e procure médico ou nutricionista. Veja <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a>.</p>

<h2>Quanta melancia comer por dia?</h2>
<p>Para a maioria das pessoas, <strong>1 a 2 fatias por dia</strong> (200 a 400 g) cabem bem. Mesmo meio quilo soma perto de 163 kcal, e 1 kg, perto de 326. Engorda se comer muito? Só se o total do dia passar do seu gasto, e com melancia isso exige muita fruta. Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come melancia todo dia e emagrece, e gente que come só fruta e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com a fruta que você gosta dentro.</p>

<h2>Fontes</h2>
<ul>
<li>${TACO}: melancia crua (composição completa), melão, coco cru, tamarindo, pequi, abacate, morango, mamão papaia, laranja-pera, maçã fuji, manga Palmer, banana prata</li>
<li>${IBGE} (pedaço, fatia e porção de melancia)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/manga-engorda">Manga engorda?</a></li>
<li><a href="/blog/melhores-frutas-para-emagrecer">Melhores frutas para emagrecer</a></li>
<li><a href="/blog/frutas-antes-do-treino">Frutas antes do treino</a></li>
<li><a href="/blog/vontade-de-doce">Vontade de doce</a></li>
</ul>`,
  },
];
