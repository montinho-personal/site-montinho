import type { BlogPost } from "./blog";

/**
 * "O que comer à noite para não engordar" (01/11/2026). Pauta que saiu do PAA
 * de "panetone engorda". Prints do Google mandados pelo Montinho:
 * autocompletar (muito, se deve, na janta, é melhor, receitas, tarde da
 * noite), visão geral por IA (proteínas magras, legumes, carboidrato com
 * moderação), PAA (o que é bom para emagrecer, o que tomar antes de dormir
 * para desinchar, o que não comer para perder barriga, o que sacia a fome) e
 * "Outras pessoas pesquisaram" (lanches que não engordam, cardápio, perder
 * barriga, desinchar, depois da janta, lanche, comer e dormir engorda ou
 * emagrece, cuscuz à noite engorda). Fora: "para engordar" e "ceia para
 * ganhar massa" (o artigo de ganhar massa já cobre) e "nutricionista".
 *
 * Canibalização: "jantar-leve-para-emagrecer" se chamava "O Que Comer à
 * Noite" e "carboidrato-a-noite-engorda" tinha as duas perguntas no FAQ.
 * Nenhum dos dois recebia impressão de "o que comer à noite" em 90 dias. Este
 * fica com a busca; o do jantar mudou de título (aprovado pelo Montinho em
 * 01/11) e os três se linkam.
 *
 * Números: calorias por 100 g da TACO, as mesmas do Monte seu Cardápio
 * (lib/cardapio/alimentos.ts), com porções caseiras.
 *
 * Ferramenta: nenhuma (ARTIGOS_SEM_FERRAMENTA). O leitor sai com uma escolha
 * de lanche, não com uma conta; o Beliscômetro fica linkado no texto.
 */

export const O_QUE_COMER_A_NOITE_POSTS: BlogPost[] = [
  {
    slug: "o-que-comer-a-noite-para-nao-engordar",
    title: "O Que Comer à Noite Para Não Engordar: Janta, Lanche e o Que Evitar",
    metaTitle: "O Que Comer à Noite Para Não Engordar (Janta e Lanche)",
    metaDescription:
      "O que comer à noite para não engordar: como montar a janta, lanches leves para a fome depois do jantar e o que evitar para perder barriga e desinchar.",
    excerpt:
      "Como montar a janta, o que comer quando a fome volta depois dela, o que evitar à noite e se comer e dormir engorda, com as calorias de cada lanche.",
    category: "Nutrição",
    date: "2026-11-01",
    readTime: "7 min",
    author: "Montinho",
    tags: ["jantar", "lanche da noite", "emagrecimento", "saciedade", "dieta"],
    faq: [
      {
        question: "O que comer à noite para não engordar?",
        answer:
          "Uma janta com proteína (frango, peixe, ovos ou carne magra), legumes à vontade e uma porção moderada de carboidrato. Se a fome voltar depois, um lanche pequeno com proteína, como iogurte natural ou ovo cozido. O que engorda é o total do dia, não o horário.",
      },
      {
        question: "Comer e dormir engorda ou emagrece?",
        answer:
          "Nenhum dos dois por si só. O peso muda pelo balanço de calorias do dia inteiro. Comer pouco antes de dormir só engorda se essas calorias passarem do que você gasta. Para quem tem refluxo, vale deixar um intervalo entre a última refeição e deitar.",
      },
      {
        question: "O que sacia a fome à noite?",
        answer:
          "Proteína e volume. Iogurte natural, ovo cozido, queijo branco, leite e frutas com bastante água, como mamão, saciam com poucas calorias. Doce e salgadinho saciam pouco e abrem o apetite para mais.",
      },
      {
        question: "O que comer à noite depois da janta?",
        answer:
          "Se a fome for de verdade, um lanche de até cerca de 150 kcal com proteína: um pote de iogurte natural (cerca de 87 kcal), dois ovos cozidos (cerca de 146 kcal) ou uma fatia de mamão com uma colher de aveia. Se for vontade de comer por tédio, um chá ou um copo de água resolve antes.",
      },
      {
        question: "O que não comer à noite para perder barriga?",
        answer:
          "Nenhum alimento sozinho cria barriga, mas alguns facilitam comer demais à noite: doces, salgadinhos, frituras, ultraprocessados e álcool. Eles somam muitas calorias em pouco volume e saciam pouco. A barriga diminui com déficit calórico e treino ao longo das semanas.",
      },
      {
        question: "O que comer à noite para desinchar?",
        answer:
          "Comida com menos sal: o inchaço do dia seguinte costuma vir do sódio de embutidos, temperos prontos, salgadinhos e fast food, que fazem o corpo reter água. Uma janta caseira com legumes, proteína e pouco sal, e beber água ao longo do dia, ajudam mais que qualquer chá.",
      },
      {
        question: "Comer cuscuz à noite engorda?",
        answer:
          "Não pelo horário. O cuscuz de milho cozido tem 113 kcal por 100 g, segundo a tabela TACO. Uma porção de cerca de 100 g, com ovo ou frango e legumes, é uma janta equilibrada. O que pesa é a quantidade e o que vai junto, como manteiga e queijo em excesso.",
      },
      {
        question: "Quais lanches não engordam à noite?",
        answer:
          "Lanches pequenos, com proteína e pouca gordura: iogurte natural, ovo cozido, queijo minas frescal, leite e frutas como mamão e banana. Nenhum engorda em porção normal. O que engorda é o lanche virar uma segunda janta.",
      },
    ],
    content: `<img src="/blog-images/o-que-comer-a-noite-para-nao-engordar-capa.webp" alt="Capa: O que comer à noite para não engordar — janta, lanche e o que evitar. Ilustração de lua, prato com proteína e legumes e um pote de iogurte" title="O Que Comer à Noite Para Não Engordar — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>O que comer à noite para não engordar?</strong> Uma janta com proteína, legumes e uma porção moderada de carboidrato e, se a fome voltar depois, um lanche pequeno com proteína. O horário não engorda ninguém: o que conta é o total do dia. Mas a noite é quando a fome e o cansaço se juntam, e é aí que a geladeira vira problema.</p>

<h2>Comer à noite engorda?</h2>
<p>Não pelo relógio. O peso muda pelo balanço de calorias ao longo dos dias: se você come mais do que gasta, engorda, seja de manhã ou à noite. A dúvida "comer e dormir engorda ou emagrece?" tem a mesma resposta: nenhum dos dois por si só.</p>
<p>O que muda à noite é o comportamento. Num estudo controlado, as mesmas refeições feitas mais tarde deixaram as pessoas com mais fome no dia seguinte (Vujović e colaboradores, 2022). E é à noite, cansado e no sofá, que se belisca sem perceber. Por isso a janta precisa saciar de verdade.</p>
<p>Se você quer entender o papel do carboidrato nesse horário, o artigo <a href="/blog/carboidrato-a-noite-engorda">carboidrato à noite engorda?</a> aprofunda.</p>

<h2>O que comer na janta para não engordar</h2>
<p>A janta que segura a fome até de manhã tem três partes:</p>
<ul>
<li><strong>Proteína:</strong> frango, peixe, ovos, carne magra ou tofu. É o que mais sacia.</li>
<li><strong>Legumes e salada à vontade:</strong> brócolis, abobrinha, berinjela, cenoura, folhas. Dão volume com poucas calorias.</li>
<li><strong>Carboidrato com moderação:</strong> arroz, batata, mandioquinha, cuscuz ou pão, numa porção menor que a do almoço se você não treinou à noite.</li>
</ul>
<p>Pular a janta para "economizar" costuma sair pela culatra: a fome volta às dez da noite, e aí ninguém come salada. Dez ideias práticas estão no artigo de <a href="/blog/jantar-leve-para-emagrecer">jantar leve para emagrecer</a>.</p>

<h2>O que comer à noite depois da janta</h2>
<p>Primeiro, a pergunta honesta: é fome ou é hábito? Se você jantou bem há pouco tempo e a vontade é de doce ou de "alguma coisa", um chá ou um copo de água resolve antes. Se for fome de verdade, especialmente quando a janta foi cedo, um lanche pequeno com proteína é melhor do que ir dormir brigando com a geladeira.</p>
<table>
<thead><tr><th>Lanche da noite</th><th>Porção</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Iogurte natural</td><td>1 pote (170 g)</td><td>cerca de 87 kcal</td></tr>
<tr><td>Mamão papaia</td><td>1 fatia (150 g)</td><td>cerca de 60 kcal</td></tr>
<tr><td>Banana nanica</td><td>1 média (100 g)</td><td>cerca de 92 kcal</td></tr>
<tr><td>Queijo minas frescal</td><td>2 fatias (40 g)</td><td>cerca de 106 kcal</td></tr>
<tr><td>Leite integral</td><td>1 copo (200 ml)</td><td>cerca de 120 kcal</td></tr>
<tr><td>Ovo cozido</td><td>2 unidades (100 g)</td><td>cerca de 146 kcal</td></tr>
</tbody>
</table>
<p>Calorias por 100 g da tabela TACO, com porções caseiras. Combinações que funcionam: iogurte com mamão, banana com uma fatia de queijo, um copo de leite quente. Se quiser fazer a conta do que os beliscos da noite somam, use o <a href="/ferramentas/beliscometro">Beliscômetro</a>.</p>
<p>Quem treina à noite e chega tarde em casa não precisa de lanche: precisa de uma janta de verdade, com proteína. Veja <a href="/blog/o-que-comer-apos-o-treino">o que comer depois do treino</a>. E quem quer ganhar massa tem outra conta, explicada em <a href="/blog/o-que-comer-antes-de-dormir-para-ganhar-massa">o que comer antes de dormir para ganhar massa</a>.</p>

<h2>O que sacia a fome à noite?</h2>
<p><strong>Proteína e volume.</strong> Alimentos com proteína (ovo, iogurte, queijo branco, leite, carnes) e com bastante água e fibra (frutas, legumes, sopa de legumes) enchem o estômago com poucas calorias. Doce, salgadinho e biscoito fazem o contrário: muitas calorias em pouco volume, e a vontade volta em minutos. Mais ideias no artigo de <a href="/blog/alimentos-que-dao-saciedade">alimentos que dão saciedade</a>.</p>

<h2>O que não comer à noite para perder barriga</h2>
<p>Nenhum alimento cria barriga sozinho, e nenhum derrete gordura. Mas alguns tornam fácil passar das calorias à noite:</p>
<ul>
<li><strong>Doces e sobremesas</strong> todo dia depois da janta.</li>
<li><strong>Salgadinhos, biscoitos e frituras</strong>, que somam muito em pouca quantidade.</li>
<li><strong>Ultraprocessados e fast food</strong>, com muito sal e gordura.</li>
<li><strong>Álcool</strong>, que soma calorias e abre o apetite.</li>
</ul>
<p>A barriga diminui com déficit calórico e treino ao longo das semanas. Se a dúvida é se a sua barriga é gordura ou inchaço, veja <a href="/blog/barriga-inchada-ou-gordura">barriga inchada ou gordura</a>.</p>

<h2>O que comer à noite para desinchar</h2>
<p>Quem acorda inchado costuma ter jantado salgado. O sódio de embutidos, temperos prontos, molhos industrializados, salgadinhos e fast food faz o corpo segurar água. Para desinchar, o que funciona é o básico: janta caseira, com pouco sal, legumes e proteína, e água ao longo do dia. Não existe chá que desinche sozinho. Mais detalhes em <a href="/blog/retencao-de-liquido-como-desinchar">retenção de líquido: como desinchar</a>.</p>

<h2>Comer cuscuz à noite engorda?</h2>
<p>Não pelo horário. O <strong>cuscuz de milho cozido tem 113 kcal por 100 g</strong>, segundo a tabela TACO, menos que o arroz branco cozido. Uma porção de cerca de 100 g, com ovo ou frango e legumes, é uma janta equilibrada. O que pesa é exagerar na porção ou na manteiga e no queijo por cima.</p>

<h2>Cardápio para comer à noite e emagrecer</h2>
<p>Três jantas de exemplo, para variar na semana:</p>
<ul>
<li><strong>Noite 1:</strong> omelete de 2 ovos com espinafre e tomate, 1 fatia de pão integral e salada.</li>
<li><strong>Noite 2:</strong> frango grelhado, legumes assados e 2 colheres de arroz.</li>
<li><strong>Noite 3:</strong> cuscuz (cerca de 100 g) com ovo mexido e salada de folhas.</li>
</ul>
<p>Se a fome vier depois, um dos lanches da tabela. Para montar uma semana inteira com o seu gasto, use o <a href="/ferramentas/monte-seu-cardapio">Monte seu Cardápio</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que janta às seis e não come mais nada, e gente que precisa de um lanche às dez. Nenhum dos dois é a sua régua. Cada um tem a própria genética, rotina e história, com altos e baixos. O que funciona é um jeito de comer à noite que você consiga manter por anos, e não uma regra que dura uma semana.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://pubmed.ncbi.nlm.nih.gov/36198293/" target="_blank" rel="noopener noreferrer">Vujović N e colaboradores. Late isocaloric eating increases hunger, decreases energy expenditure, and modifies metabolic pathways in adults with overweight and obesity. Cell Metabolism, 2022</a></li>
<li><a href="https://pubmed.ncbi.nlm.nih.gov/25859885/" target="_blank" rel="noopener noreferrer">Kinsey AW, Ormsbee MJ. The health impact of nighttime eating: old and new perspectives. Nutrients, 2015</a></li>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">Tabela Brasileira de Composição de Alimentos (TACO), 4ª edição — Unicamp/NEPA</a></li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/jantar-leve-para-emagrecer">Jantar leve para emagrecer: 10 ideias que saciam</a></li>
<li><a href="/blog/carboidrato-a-noite-engorda">Carboidrato à noite engorda?</a></li>
<li><a href="/blog/beliscar-engorda">Beliscar engorda?</a></li>
<li><a href="/blog/fome-emocional-como-controlar">Fome emocional: como controlar</a></li>
</ul>`,
  },
];
