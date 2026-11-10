import type { BlogPost } from "./blog";

/**
 * "Calorias da ceia de Natal" (01/11/2026). Publicado a pedido do Montinho
 * ANTES dos prints, como o da rabanada; H2 e FAQ serão revistos quando a
 * pesquisa chegar.
 *
 * Por que não canibaliza "como-aproveitar-ceia-sem-exagerar": aquele é
 * estratégia (antes, durante e depois da mesa) e não tem número por prato.
 * Este é a tabela, a mesma divisão que já existe na festa junina ("como
 * aproveitar" x "quantas calorias têm os alimentos"). Os dois se linkam.
 *
 * Números: TACO 4ª edição, por 100 g (pernil assado 262, lombo assado 210,
 * peru assado 163, frango inteiro sem pele assado 187, bacalhau refogado 140,
 * salpicão de frango 148, salada de legumes com maionese 96, farofa
 * temperada 406, arroz tipo 1 cozido 128, uva Itália 53, castanha-do-Brasil
 * 643, castanha-de-caju torrada salgada 570, figo em calda 184, pêssego em
 * calda 63). As porções (150 g de carne, 100 g de acompanhamento, 30 g de
 * farofa) são escolha nossa e aparecem em gramas na tabela; as da castanha e
 * do arroz vêm da tabela de medidas da POF/IBGE (2 castanhas = 8 g; 1 concha
 * de arroz = 100 g). Panetone e rabanada vêm dos artigos próprios.
 * Caminhada: 3,8 METs, 70 kg, ≈ 4,66 kcal/min.
 *
 * Prints de "calorias ceia de natal" (01/11, depois da publicação):
 * autocompletar (com baixa caloria, engorda, cetogênica, dieta, nutrição),
 * visão geral por IA e PAA (quantos kg perder até o Natal, estou de dieta o
 * que comer na ceia, 400 calorias no jantar é muito, 2.000 calorias por dia
 * engorda). Entraram como H2 e FAQ; tender e chester ganharam seção sem
 * número próprio (não estão na TACO). Os números da visão geral por IA
 * (chester 107, tender 130, lombo 178, ceia 1.200 a 2.000) não entraram:
 * print não é fonte, e o lombo da TACO é 210.
 *
 * Ferramenta: Calculadora de Calorias na Caminhada como link.
 */

export const CALORIAS_CEIA_NATAL_POSTS: BlogPost[] = [
  {
    slug: "calorias-da-ceia-de-natal",
    title: "Calorias da Ceia de Natal: Pernil, Peru, Farofa e Mais",
    metaTitle: "Calorias da Ceia de Natal: Pernil, Peru, Farofa e Mais",
    metaDescription:
      "Quantas calorias tem a ceia de Natal? Tabela com pernil, peru, chester, farofa, salpicão, arroz e sobremesas, e a diferença entre dois pratos montados.",
    excerpt:
      "Tabela de calorias dos pratos da ceia de Natal com dados da TACO, quanto soma um prato típico e como montar um prato mais leve sem deixar de aproveitar.",
    category: "Nutrição",
    date: "2026-11-01",
    readTime: "9 min",
    author: "Montinho",
    tags: ["natal", "ceia", "calorias", "pernil", "peru", "dieta"],
    faq: [
      {
        question: "Quantas calorias tem uma ceia de Natal?",
        answer:
          "Depende do prato. Um prato com pernil, arroz, farofa, salpicão, uma fatia de panetone e uma rabanada soma perto de 1.200 kcal na nossa conta com a TACO. Trocando por peru, salada e uma sobremesa só, cai para perto de 680 kcal. Bebida não está incluída.",
      },
      {
        question: "Ceia de Natal engorda?",
        answer:
          "Uma ceia não engorda ninguém. Ganhar peso depende do que se repete por semanas. O que pesa no fim de ano é a sequência: ceia, almoço do dia 25 com as sobras, confraternizações e Ano-Novo, todos com o mesmo exagero.",
      },
      {
        question: "Estou de dieta. O que comer na ceia?",
        answer:
          "Comece pela salada e por uma carne (o peru é a mais leve, mas qualquer uma serve), ponha arroz e farofa em quantidade pequena e escolha um doce só. Não precisa cortar o que você gosta: o prato com essas trocas fica perto de 680 kcal, contra 1.200 do típico.",
      },
      {
        question: "Como fazer uma ceia de Natal com baixa caloria?",
        answer:
          "Peru ou frango no lugar do pernil, salada de folhas e legumes, farofa servida em pouca quantidade, frutas frescas na mesa e uma sobremesa só. A bebida conta: cada taça de vinho ou espumante soma ao prato.",
      },
      {
        question: "Dá para fazer uma ceia de Natal cetogênica ou low carb?",
        answer:
          "Dá, e a mesa já ajuda: pernil, lombo, peru e frango assados têm zero carboidrato na TACO, e o bacalhau refogado tem perto de 1 g em 100 g. Ficam de fora arroz, farofa, panetone, rabanada e frutas em calda. Low carb não é o mesmo que pouca caloria: o pernil continua sendo a carne mais calórica.",
      },
      {
        question: "Quantas calorias tem o pernil assado?",
        answer:
          "Pela TACO, o pernil de porco assado tem perto de 262 kcal em 100 g. Um prato servido de 150 g fica perto de 390 kcal. É a carne mais calórica da ceia, mas também rica em proteína: 32 g em 100 g.",
      },
      {
        question: "Peru ou pernil: qual tem menos calorias?",
        answer:
          "O peru. Pela TACO, o peru assado tem perto de 163 kcal em 100 g, contra 262 kcal do pernil e 210 kcal do lombo. Em 150 g, a diferença entre peru e pernil passa de 140 kcal.",
      },
      {
        question: "Quantas calorias tem o chester?",
        answer:
          "Chester é uma marca de ave e não aparece na TACO. Como ave assada, fica na faixa do peru e do frango assado (perto de 160 a 190 kcal em 100 g sem pele), mas os temperados e com pele têm mais. Confira o rótulo da embalagem.",
      },
      {
        question: "Farofa engorda?",
        answer:
          "É o acompanhamento mais denso da ceia: pela TACO, a farofa temperada tem perto de 406 kcal em 100 g. Uma porção de 30 g soma por volta de 120 kcal, quase o mesmo que uma concha de arroz.",
      },
      {
        question: "Quantas calorias tem o tender?",
        answer:
          "O tender não aparece na TACO, e as receitas e marcas variam muito (com ou sem capa de gordura, com ou sem calda). O valor certo é o do rótulo da embalagem, por 100 g.",
      },
      {
        question: "Quais são os alimentos mais calóricos da ceia de Natal?",
        answer:
          "Por porção servida, o pernil, as sobremesas (panetone, rabanada, pavê, torta) e a farofa. Castanhas também são muito calóricas por grama, mas a porção costuma ser pequena. Os mais leves são as frutas, as saladas sem maionese e o peru.",
      },
      {
        question: "400 calorias no jantar é muito?",
        answer:
          "Depende do seu gasto e do resto do dia. Para muita gente, 400 kcal é um jantar comum. Na ceia, um prato de pernil de 150 g sozinho já passa de 390 kcal. Para saber quanto você gasta por dia, use a Calculadora de TMB e gasto diário.",
      },
      {
        question: "Consumir 2.000 calorias por dia engorda?",
        answer:
          "Depende de quanto você gasta. 2.000 kcal é uma referência de rótulo, não a necessidade de todo mundo: para uma pessoa pode ser manutenção, para outra pode ser excesso ou déficit. A Calculadora de TMB e gasto diário dá a sua estimativa.",
      },
      {
        question: "Quantos kg posso perder até o Natal?",
        answer:
          "Depende do seu peso, do déficit que você aguenta manter e de quantas semanas faltam. Veja quantos quilos é realista perder por mês e use a Calculadora de Déficit Calórico para montar a conta com o seu peso.",
      },
      {
        question: "Como montar um prato de ceia mais leve?",
        answer:
          "Comece pela salada, escolha uma carne (o peru é a mais leve), sirva a farofa por cima do arroz em vez de ao lado, e escolha um doce só. Não precisa cortar nada que você goste: é a soma de pequenas escolhas que muda o prato.",
      },
    ],
    content: `<img src="/blog-images/calorias-da-ceia-de-natal-capa.webp" alt="Capa: Calorias da ceia de Natal, tabela de pernil, peru, farofa e mais. Ilustração de mesa de ceia com pernil e farofa" title="Calorias da Ceia de Natal — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Quantas calorias tem a ceia de Natal?</strong> Depende muito do que vai para o prato. Com os dados da TACO, a tabela brasileira de composição de alimentos, um prato típico com pernil, farofa, salpicão e dois doces passa de 1.200 kcal. Com algumas trocas, o mesmo jantar fica perto de 680 kcal. Abaixo, prato por prato.</p>

<h2>Ceia de Natal engorda?</h2>
<p>Uma ceia, não. O corpo responde à soma das semanas, e não a uma noite. O que pesa em dezembro é a sequência: a ceia, o almoço do dia 25 com as sobras, as confraternizações e o Ano-Novo, todos com o mesmo "hoje pode". A tabela abaixo serve para saber onde estão as diferenças grandes, e não para contar cada garfada.</p>

<h2>Tabela de calorias da ceia de Natal</h2>
<table>
<thead><tr><th>Prato</th><th>Porção</th><th>Calorias</th><th>Caminhada para gastar*</th></tr></thead>
<tbody>
<tr><td>Pernil de porco assado</td><td>150 g</td><td>cerca de 393 kcal</td><td>cerca de 1 h 24 min</td></tr>
<tr><td>Lombo de porco assado</td><td>150 g</td><td>cerca de 315 kcal</td><td>cerca de 1 h 8 min</td></tr>
<tr><td>Frango inteiro assado, sem pele</td><td>150 g</td><td>cerca de 281 kcal</td><td>cerca de 1 h</td></tr>
<tr><td>Peru assado</td><td>150 g</td><td>cerca de 245 kcal</td><td>cerca de 53 min</td></tr>
<tr><td>Bacalhau refogado (só o peixe)</td><td>150 g</td><td>cerca de 210 kcal</td><td>cerca de 45 min</td></tr>
<tr><td>Salpicão de frango</td><td>100 g</td><td>cerca de 148 kcal</td><td>cerca de 32 min</td></tr>
<tr><td>Arroz branco</td><td>1 concha (100 g)</td><td>cerca de 128 kcal</td><td>cerca de 27 min</td></tr>
<tr><td>Farofa temperada</td><td>30 g</td><td>cerca de 122 kcal</td><td>cerca de 26 min</td></tr>
<tr><td>Salada de legumes com maionese</td><td>100 g</td><td>cerca de 96 kcal</td><td>cerca de 21 min</td></tr>
<tr><td>Uva Itália</td><td>100 g</td><td>cerca de 53 kcal</td><td>cerca de 11 min</td></tr>
<tr><td>Castanha-do-Brasil</td><td>2 unidades (8 g)</td><td>cerca de 51 kcal</td><td>cerca de 11 min</td></tr>
<tr><td>Castanha-de-caju torrada e salgada</td><td>30 g</td><td>cerca de 171 kcal</td><td>cerca de 37 min</td></tr>
<tr><td>Figo em calda</td><td>100 g</td><td>cerca de 184 kcal</td><td>cerca de 39 min</td></tr>
<tr><td>Pêssego em calda</td><td>100 g</td><td>cerca de 63 kcal</td><td>cerca de 14 min</td></tr>
<tr><td><a href="/blog/panetone-engorda">Panetone de frutas</a></td><td>1 fatia (80 g)</td><td>254 a 290 kcal</td><td>55 a 62 min</td></tr>
<tr><td><a href="/blog/rabanada-engorda">Rabanada frita, com açúcar e canela</a></td><td>1 fatia</td><td>cerca de 140 kcal</td><td>cerca de 29 min</td></tr>
</tbody>
</table>
<p>Valores da TACO por 100 g, multiplicados pela porção da tabela. A porção de carne (150 g) e a de acompanhamento (100 g) são uma referência nossa para um prato servido; as do arroz e da castanha vêm da tabela de medidas caseiras do IBGE. Panetone e rabanada não estão na TACO: os números vêm dos artigos de cada um. *Caminhada em ritmo moderado para uma pessoa de 70 kg, com 3,8 METs do Compêndio de Atividades Físicas. Para fazer a conta com o seu peso, use a <a href="/ferramentas/calculadora-calorias-caminhada">Calculadora de Calorias na Caminhada</a>.</p>

<h2>Quanto soma um prato de ceia?</h2>
<p>Dois pratos montados com a tabela acima, sem bebida:</p>
<table>
<thead><tr><th>Prato típico</th><th>kcal</th><th>Prato com trocas</th><th>kcal</th></tr></thead>
<tbody>
<tr><td>Pernil, 150 g</td><td>393</td><td>Peru, 150 g</td><td>245</td></tr>
<tr><td>Arroz, 1 concha</td><td>128</td><td>Arroz, 1 concha</td><td>128</td></tr>
<tr><td>Farofa, 30 g</td><td>122</td><td>Farofa, 15 g</td><td>61</td></tr>
<tr><td>Salpicão, 100 g</td><td>148</td><td>Salada de legumes com maionese, 100 g</td><td>96</td></tr>
<tr><td>Panetone, 1 fatia</td><td>274</td><td>Uva, 100 g</td><td>53</td></tr>
<tr><td>Rabanada frita, 1 fatia</td><td>135</td><td>Rabanada assada, 1 fatia</td><td>100</td></tr>
<tr><td><strong>Total</strong></td><td><strong>cerca de 1.200</strong></td><td><strong>Total</strong></td><td><strong>cerca de 680</strong></td></tr>
</tbody>
</table>
<p>A diferença, perto de 520 kcal, é quase uma refeição inteira. E o prato com trocas não tirou nada da mesa: tem carne, arroz, farofa, salada e doce. Só mudou qual carne, quanto de farofa e quantos doces.</p>
<p>Fica de fora a bebida, que muda a conta de verdade. Vinho, cerveja e espumante somam rápido ao longo da noite: veja <a href="/blog/vinho-engorda">vinho engorda?</a> e <a href="/blog/cerveja-engorda">cerveja engorda?</a>.</p>

<h2>Qual carne da ceia tem menos calorias?</h2>
<p>O <strong>peru</strong>: perto de 163 kcal em 100 g pela TACO, contra 187 do frango assado sem pele, 210 do lombo e 262 do pernil. Todas são boas fontes de proteína (de 26 a 36 g em 100 g), então nenhuma é "errada". Se o pernil é o prato que você espera o ano inteiro, coma o pernil e acerte no resto.</p>
<p>O <strong>chester</strong> é uma marca de ave e não aparece na TACO. Como ave assada, fica na faixa do peru e do frango; as versões temperadas e com pele têm mais. O rótulo da embalagem dá o valor exato. O <strong>bacalhau</strong> da tabela é só o peixe refogado: a bacalhoada com batata e azeite tem bem mais, porque o azeite é o ingrediente mais calórico do prato.</p>

<h2>Tender e chester: quantas calorias têm?</h2>
<p>Nenhum dos dois aparece na TACO: chester é uma marca de ave, e tender é um presunto defumado que muda muito de marca para marca (com ou sem capa de gordura, com ou sem calda). Para os dois, o valor certo é o do rótulo, por 100 g. Como referência, a TACO dá perto de 94 kcal em 100 g para o presunto sem capa de gordura; a calda de frutas ou de mel que costuma ir por cima do tender soma a partir daí.</p>

<h2>Farofa, salpicão e maionese engordam?</h2>
<p>A <strong>farofa</strong> é o acompanhamento mais denso da mesa: perto de 406 kcal em 100 g, porque é farinha torrada com gordura. 30 g já empatam com uma concha de arroz. Servir por cima do arroz, e não ao lado, costuma reduzir a quantidade sem esforço.</p>
<p>O <strong>salpicão</strong> e a <strong>salada de maionese</strong> são menos calóricos do que parecem por grama (148 e 96 kcal em 100 g), porque têm muito legume e frango. O que pesa é a colher: elas costumam ir para o prato em quantidade.</p>

<h2>E as frutas secas e castanhas?</h2>
<p>Castanhas são muito calóricas por grama (a do Brasil tem 643 kcal em 100 g), mas duas unidades somam perto de 51 kcal. O problema é o pote na mesa de centro, que vira beliscada a noite inteira. Frutas frescas, como uva, são as mais leves da ceia. Frutas em calda variam: o pêssego em calda tem perto de 63 kcal em 100 g, e o figo em calda, quase o triplo.</p>

<h2>Estou de dieta: o que comer na ceia?</h2>
<p>A ceia com baixa caloria não precisa de receita especial. É o prato com trocas da tabela acima, perto de 680 kcal:</p>
<ul>
<li><strong>Uma carne.</strong> Peru e frango são as mais leves; se o pernil é o prato do ano, coma o pernil e acerte no resto.</li>
<li><strong>Salada primeiro.</strong> Folhas e legumes enchem o prato com pouca caloria.</li>
<li><strong>Arroz e farofa em quantidade pequena.</strong> Uma concha de arroz e a farofa por cima dele.</li>
<li><strong>Um doce só.</strong> E frutas frescas, como uva, para quem quer beliscar depois.</li>
<li><strong>Conte a bebida.</strong> É o que mais soma sem você perceber.</li>
</ul>
<p>Se a sua dúvida é se o jantar de 400 kcal é muito, ou se 2.000 kcal por dia engorda, a resposta depende do quanto você gasta. A <a href="/ferramentas/calculadora-tmb-tdee">Calculadora de TMB e gasto diário</a> dá a sua estimativa. E se a meta é chegar ao Natal mais leve, veja <a href="/blog/quantos-kg-perder-por-mes">quantos quilos é realista perder por mês</a> e use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Ceia de Natal cetogênica ou low carb</h2>
<p>A ceia brasileira tem muita coisa sem carboidrato. Pela TACO, pernil, lombo, peru e frango assados têm zero carboidrato, e o bacalhau refogado, perto de 1 g em 100 g. O salpicão de frango tem perto de 5 g em 100 g. Ficam de fora arroz, farofa (80 g de carboidrato em 100 g), panetone, rabanada e frutas em calda.</p>
<p>Só que low carb não é o mesmo que pouca caloria: o pernil continua sendo a carne mais calórica da mesa, e castanhas, maionese e queijos somam rápido. Se a ideia é emagrecer, a conta de calorias continua valendo. Para quem treina e quer saber mais, veja <a href="/blog/dieta-cetogenica-musculacao">dieta cetogênica e musculação</a>.</p>

<h2>Como aproveitar a ceia sem exagerar</h2>
<p>Não precisa contar caloria na ceia. A tabela serve para saber onde estão as diferenças grandes, e elas são poucas: a carne, a farofa, os doces e a bebida. O resto é detalhe. Para a estratégia completa de antes, durante e depois da festa, veja <a href="/blog/como-aproveitar-ceia-sem-exagerar">como aproveitar a ceia de Natal sem exagerar</a>.</p>
<ul>
<li><strong>Não chegue em jejum.</strong> Quem pula as refeições do dia 24 para "guardar espaço" chega com fome e come em dobro.</li>
<li><strong>Comece pela salada e pela carne.</strong> Proteína e fibra primeiro, e o resto do prato se ajusta sozinho.</li>
<li><strong>Escolha um doce.</strong> Panetone, rabanada, pavê e torta na mesma noite somam mais que o prato principal.</li>
<li><strong>Volte para a rotina no dia 26.</strong> Uma ceia não desfaz meses. A semana de "já que estraguei", sim.</li>
</ul>

<div class="yt-embed">
<p class="yt-caption">Em 1 minuto: por que o problema quase nunca é a caloria do copo, e sim o que vem junto com ela e a conta do dia seguinte.</p>
<div class="yt-wrapper yt-wrapper--vertical"><iframe src="https://www.youtube.com/embed/pxstc1eDnJU?rel=0" title="Eu emagreci 40 kg sem parar de beber cerveja — Montinho Personal Trainer" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
</div>

<h2>Não se compare</h2>
<p>Na mesma mesa vai ter quem come pouco, quem repete três vezes e quem passa a noite falando de dieta. Nenhum deles é a sua régua. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer e de treinar que dê para manter o ano inteiro, ceia incluída.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a></li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a></li>
<li><a href="https://pacompendium.com/walking/" target="_blank" rel="noopener noreferrer">Compêndio de Atividades Físicas — caminhada</a> (ritmo moderado, 4,5 a 5,5 km/h: 3,8 METs)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/como-aproveitar-ceia-sem-exagerar">Como aproveitar a ceia de Natal sem exagerar</a></li>
<li><a href="/blog/rabanada-engorda">Rabanada engorda?</a></li>
<li><a href="/blog/panetone-engorda">Panetone engorda?</a></li>
<li><a href="/blog/como-nao-perder-o-shape-no-natal">Como não perder o shape no Natal</a></li>
</ul>`,
  },
];
