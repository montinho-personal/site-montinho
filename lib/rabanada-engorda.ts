import type { BlogPost } from "./blog";

/**
 * "Rabanada engorda?" (01/11/2026). Publicado a pedido do Montinho ANTES dos
 * prints ("pode criar os dois próximos artigos, depois eu te mando os
 * prints"): título, H2 e FAQ seguem o formato do panetone, que já tem os
 * prints de "x engorda" do Natal, e serão revistos quando a pesquisa chegar.
 *
 * Números: a TACO não tem rabanada pronta, então a caloria vem da receita,
 * ingrediente por ingrediente, com os valores da TACO (pão francês 300 kcal,
 * ovo cru 143, açúcar refinado 387 e óleo de soja 884 por 100 g). O leite
 * integral está "em reavaliação" na TACO; entra com os 60 kcal por 100 ml do
 * rótulo comum. Receita de referência, 12 fatias:
 *
 *   4 pães franceses (200 g)            600 kcal
 *   300 ml de leite integral            180 kcal
 *   2 ovos (90 g)                       129 kcal
 *   25 g de açúcar no leite              97 kcal
 *   50 g de açúcar e canela por fora    193 kcal
 *   total 1.199 kcal → ≈ 100 kcal por fatia, sem gordura
 *
 * Óleo da fritura: quanto o pão absorve varia com temperatura e tempo, e não
 * achamos fonte oficial com um número para rabanada. O texto assume 4 g por
 * fatia (uma colher de chá) e diz que é suposição: +35 kcal, ≈ 137 kcal.
 * Leite condensado: 1 colher de sopa de 20 g (313 kcal/100 g na TACO) ≈ 63.
 * Caminhada: 3,8 METs, 70 kg, ≈ 4,66 kcal/min, como panetone e Halloween.
 *
 * Ferramenta: Calculadora de Calorias na Caminhada como link (a conta que
 * sobra é "quanto eu gasto para compensar", com o peso dela).
 */

export const RABANADA_POSTS: BlogPost[] = [
  {
    slug: "rabanada-engorda",
    title: "Rabanada Engorda? Calorias da Fatia, Frita ou Assada",
    metaTitle: "Rabanada Engorda? Calorias da Fatia, Frita ou Assada",
    metaDescription:
      "Rabanada engorda? Uma fatia frita com açúcar e canela tem perto de 140 kcal, e a assada fica bem abaixo. Veja a conta da receita e quantas dá para comer.",
    excerpt:
      "Quantas calorias tem a rabanada frita, assada e na air fryer, o que pesa mais na receita e como comer no Natal sem sair da dieta.",
    category: "Nutrição",
    date: "2026-11-01",
    readTime: "6 min",
    author: "Montinho",
    tags: ["rabanada", "natal", "calorias", "ceia", "dieta"],
    faq: [
      {
        question: "Rabanada engorda?",
        answer:
          "Uma fatia não engorda ninguém. Ganhar peso depende de comer mais do que se gasta por semanas. A rabanada é doce, frita e fácil de repetir, então o risco é a terceira fatia e a travessa que fica na mesa até o Ano-Novo.",
      },
      {
        question: "Quantas calorias tem uma rabanada?",
        answer:
          "Na receita caseira, com um terço de pão francês por fatia, a rabanada frita e passada no açúcar com canela fica perto de 140 kcal. A assada, com o mesmo açúcar por fora, fica perto de 100 kcal. Com leite condensado por cima, passa de 200 kcal.",
      },
      {
        question: "Rabanada assada engorda menos que a frita?",
        answer:
          "Sim. A assada não leva o óleo da fritura, que é o que mais varia na receita. Na nossa conta, a diferença fica perto de 35 kcal por fatia, e pode ser maior se a rabanada sair encharcada de óleo.",
      },
      {
        question: "Rabanada na air fryer tem menos calorias?",
        answer:
          "Tem, porque funciona como a assada: o pão doura sem ficar mergulhado em óleo. Sem o açúcar por fora, só com canela, a fatia fica perto de 85 kcal na nossa conta.",
      },
      {
        question: "O que engorda mais na rabanada?",
        answer:
          "O pão é a maior parte das calorias, mas o que muda o resultado são os extras: o óleo da fritura, o açúcar por fora e o leite condensado por cima. Uma colher de sopa de leite condensado soma perto de 63 kcal na fatia.",
      },
      {
        question: "Quem está de dieta pode comer rabanada?",
        answer:
          "Pode. Escolha uma ou duas fatias, coma depois da refeição, e não deixe a travessa na mesa para ir beliscando. Uma ceia não desfaz meses de rotina; a semana de exagero depois dela, sim.",
      },
      {
        question: "Rabanada ou panetone: o que engorda mais?",
        answer:
          "Por porção, a fatia de panetone de frutas de 80 g tem perto de 274 kcal, e uma rabanada frita tem perto de 140 kcal. Duas rabanadas empatam com uma fatia de panetone. O que pesa é quantas você come, não qual escolhe.",
      },
    ],
    content: `<img src="/blog-images/rabanada-engorda-capa.webp" alt="Capa: Rabanada engorda? Calorias da fatia, frita ou assada. Ilustração de rabanadas com açúcar e canela" title="Rabanada Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Rabanada engorda?</strong> Uma fatia, não. Ela é pão frito com açúcar, então é calórica para o tamanho, mas ganhar peso depende do que se repete por semanas. O risco do Natal é outro: a travessa que fica na mesa, a fatia "só para provar" que vira três e a sobra que dura até o Ano-Novo.</p>

<h2>Rabanada engorda: sim ou não?</h2>
<p><strong>Engorda se virar hábito; não engorda numa fatia.</strong> O corpo responde à soma da semana. Uma rabanada frita com açúcar e canela tem perto de 140 kcal, o que é parecido com um pão francês com manteiga. O que faz diferença é a quantidade: rabanada é pequena, quente e doce, e é fácil comer três sem perceber.</p>
<p>Ela também sacia pouco: é pão branco, açúcar e gordura, com pouca proteína e quase nenhuma fibra. Por isso a segunda fatia desce tão fácil quanto a primeira.</p>

<h2>Quantas calorias tem uma rabanada?</h2>
<table>
<thead><tr><th>Rabanada (1 fatia, ⅓ de pão francês)</th><th>Calorias</th><th>Caminhada para gastar*</th></tr></thead>
<tbody>
<tr><td>Assada ou na air fryer, só com canela</td><td>cerca de 85 kcal</td><td>cerca de 18 min</td></tr>
<tr><td>Assada, com açúcar e canela</td><td>cerca de 100 kcal</td><td>cerca de 21 min</td></tr>
<tr><td>Frita, com açúcar e canela</td><td>cerca de 140 kcal</td><td>cerca de 29 min</td></tr>
<tr><td>Frita, com açúcar e 1 colher de sopa de leite condensado</td><td>cerca de 200 kcal</td><td>cerca de 43 min</td></tr>
<tr><td>3 fatias fritas, com açúcar e canela</td><td>cerca de 405 kcal</td><td>cerca de 1 h 27 min</td></tr>
</tbody>
</table>
<p>*Caminhada em ritmo moderado para uma pessoa de 70 kg, com 3,8 METs do Compêndio de Atividades Físicas. Para fazer a conta com o seu peso e o seu ritmo, use a <a href="/ferramentas/calculadora-calorias-caminhada">Calculadora de Calorias na Caminhada</a>.</p>

<h2>De onde vem esse número</h2>
<p>A tabela TACO, a brasileira, não tem rabanada pronta. Então a conta foi feita pela receita, com os valores da TACO para cada ingrediente. Receita caseira de 12 fatias:</p>
<table>
<thead><tr><th>Ingrediente</th><th>Quantidade</th><th>Calorias</th></tr></thead>
<tbody>
<tr><td>Pão francês</td><td>4 unidades (200 g)</td><td>600 kcal</td></tr>
<tr><td>Leite integral</td><td>300 ml</td><td>180 kcal</td></tr>
<tr><td>Ovo</td><td>2 unidades (90 g)</td><td>129 kcal</td></tr>
<tr><td>Açúcar no leite</td><td>25 g</td><td>97 kcal</td></tr>
<tr><td>Açúcar e canela por fora</td><td>50 g</td><td>193 kcal</td></tr>
<tr><td><strong>Total, sem óleo</strong></td><td>12 fatias</td><td><strong>1.199 kcal, perto de 100 por fatia</strong></td></tr>
</tbody>
</table>
<p>O óleo é a parte que mais varia: depende da temperatura, do tempo na frigideira e de quanto o pão estava encharcado. Não existe um número oficial para rabanada. Na tabela, supomos que cada fatia segura uma colher de chá de óleo (4 g, cerca de 35 kcal). Se a sua sai pingando, conte mais. O leite integral entra com os 60 kcal por 100 ml do rótulo comum, porque o valor da TACO para ele está em reavaliação.</p>

<h2>Rabanada assada ou na air fryer engorda menos?</h2>
<p>Sim. Assada ou na air fryer, a rabanada doura sem ficar mergulhada em óleo, e isso tira perto de 35 kcal por fatia na nossa conta. Se você também trocar o açúcar por fora por canela pura, a fatia fica perto de 85 kcal.</p>
<p>Dá para cortar mais: pão integral no lugar do francês, leite desnatado e um pouco de adoçante no leite. Mas não espere o mesmo sabor. Se a versão "fit" não satisfaz e você acaba comendo a frita depois, saiu mais caro. Às vezes vale mais uma rabanada de verdade, bem escolhida, do que três versões que não matam a vontade.</p>

<h2>O que engorda mais na rabanada?</h2>
<p>O pão é a maior parte das calorias, e não tem como fugir dele: é o que faz a rabanada ser rabanada. O que muda o resultado são os extras:</p>
<ul>
<li><strong>O óleo da fritura.</strong> É o item que mais varia de uma casa para outra. Escorrer bem no papel-toalha ajuda.</li>
<li><strong>O açúcar por fora.</strong> Os 50 g da receita somam perto de 16 kcal por fatia. Canela pura dá o sabor com bem menos.</li>
<li><strong>O leite condensado por cima.</strong> Uma colher de sopa soma perto de 63 kcal. É o que leva a fatia de 140 para 200.</li>
<li><strong>A calda de vinho ou de chocolate.</strong> Mesmo raciocínio: cada colher conta.</li>
</ul>

<h2>Quantas rabanadas dá para comer de dieta?</h2>
<p>Não existe número certo para todo mundo, porque depende do resto do seu dia. Um jeito prático: <strong>decida antes quantas vão para o prato</strong> (uma ou duas), sirva e saia de perto da travessa. Algumas estratégias que funcionam na ceia:</p>
<ul>
<li><strong>Coma depois da refeição, não antes.</strong> Com o estômago cheio de pernil e salada, uma fatia basta. Com fome, ela vira entrada.</li>
<li><strong>Escolha um doce.</strong> Rabanada, panetone, pavê e torta na mesma noite somam rápido. Pegue o que você mais gosta.</li>
<li><strong>Cuidado com a sobra.</strong> Rabanada fria na geladeira vira café da manhã de três dias. Faça menos, ou distribua a sobra.</li>
<li><strong>Não compense pulando refeição.</strong> Pular o almoço do dia 25 porque exagerou na ceia deixa você com mais fome à noite.</li>
<li><strong>Mantenha o treino.</strong> Dezembro não é mês de parar. Dois treinos na semana já seguram a rotina.</li>
</ul>

<h2>Rabanada ou panetone: o que engorda mais?</h2>
<p>Por porção, a fatia de 80 g do <a href="/blog/panetone-engorda">panetone</a> de frutas tem perto de 274 kcal, e uma rabanada frita tem perto de 140 kcal. Duas rabanadas empatam com uma fatia de panetone. Na prática, a diferença entre os dois é menor do que a diferença entre comer um e comer os dois. Para a mesa inteira, veja a <a href="/blog/calorias-da-ceia-de-natal">tabela de calorias da ceia de Natal</a>.</p>

<h2>Comer rabanada no Natal estraga a dieta?</h2>
<p>Não. Uma ceia não desfaz meses. O que desfaz é o "já que estraguei" que se estende até janeiro. Aproveite a festa, coma a rabanada que você quer e, no dia seguinte, volte para a rotina. Se a vontade de doce aparece todo dia, e não só no Natal, veja o artigo de <a href="/blog/vontade-de-doce">vontade de doce</a> e as ideias do <a href="/ferramentas/mata-a-vontade">Mata a Vontade</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que passa a ceia sem tocar na rabanada e gente que come cinco. Nenhum dos dois é a sua régua. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer e de treinar que dê para manter o ano inteiro, festa incluída.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: pão francês, ovo, açúcar refinado, óleo de soja e leite condensado</li>
<li><a href="https://pacompendium.com/walking/" target="_blank" rel="noopener noreferrer">Compêndio de Atividades Físicas — caminhada</a> (ritmo moderado, 4,5 a 5,5 km/h: 3,8 METs)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/panetone-engorda">Panetone engorda?</a></li>
<li><a href="/blog/calorias-da-ceia-de-natal">Calorias da ceia de Natal</a></li>
<li><a href="/blog/como-aproveitar-ceia-sem-exagerar">Como aproveitar a ceia de Natal sem exagerar</a></li>
<li><a href="/blog/como-nao-perder-o-shape-no-natal">Como não perder o shape no Natal</a></li>
</ul>`,
  },
];
