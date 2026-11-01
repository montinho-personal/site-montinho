import type { BlogPost } from "./blog";

/**
 * "Panetone engorda?" (01/11/2026). Prints do Google mandados pelo Montinho
 * (autocompletar, visão geral por IA e "As pessoas também perguntam"), sem o
 * export do Answer the Public. Autocompletar: "engorda muito", "engorda ou
 * emagrece", "sim ou não", "Bauducco engorda", "de frutas engorda", "de
 * chocolate engorda". PAA: "Quem está de dieta pode comer panetone?",
 * "Quantas calorias tem 1 panetone?". As duas perguntas de "comer à noite"
 * do PAA não cabem aqui e viraram pauta.
 *
 * Números: não existe panetone na TACO oficial, então as calorias vêm de
 * rótulos de marcas grandes e de bases que reproduzem o rótulo, e entram como
 * faixa: panetone de frutas 254 a 290 kcal por fatia de 80 g (274 kcal em
 * duas bases independentes), de chocolate 309 a 391 kcal. O texto manda
 * conferir o rótulo, porque receita e porção mudam de uma marca para outra.
 * Caminhada: 3,8 METs do Compêndio (ritmo moderado), 70 kg, como no artigo
 * de doces de Halloween (≈ 4,66 kcal por minuto).
 *
 * Ferramenta: Calculadora de Calorias na Caminhada como link (a conta que
 * sobra é "quanto eu gasto para compensar a fatia", com o peso dela).
 */

export const PANETONE_POSTS: BlogPost[] = [
  {
    slug: "panetone-engorda",
    title: "Panetone Engorda? Calorias da Fatia e Quanto Dá para Comer",
    metaTitle: "Panetone Engorda? Calorias da Fatia e Quanto Comer",
    metaDescription:
      "Panetone engorda ou emagrece? Uma fatia de 80 g do de frutas tem perto de 274 kcal, e o de chocolate tem mais. Veja quanto dá para comer sem sair da dieta.",
    excerpt:
      "Panetone engorda sim ou não, quantas calorias tem a fatia e o panetone inteiro, frutas x chocolate, e como comer no fim de ano sem sair da dieta.",
    category: "Nutrição",
    date: "2026-11-01",
    readTime: "6 min",
    author: "Montinho",
    tags: ["panetone", "chocotone", "natal", "calorias", "dieta"],
    faq: [
      {
        question: "Panetone engorda?",
        answer:
          "Uma fatia não engorda ninguém. O que faz ganhar peso é comer mais calorias do que se gasta, por semanas. O panetone é calórico, então o risco é o hábito: uma fatia por dia em todo o fim de ano, além do resto da alimentação.",
      },
      {
        question: "Panetone engorda muito?",
        answer:
          "Ele é denso em calorias: uma fatia de 80 g do de frutas tem perto de 274 kcal, cerca de 14% de uma referência de 2.000 kcal por dia. Engorda muito quando vira rotina ou quando a fatia é grande. Uma fatia no dia de festa, não.",
      },
      {
        question: "Panetone engorda ou emagrece?",
        answer:
          "Nenhum alimento sozinho engorda ou emagrece. O panetone tem bastante açúcar e farinha e pouca proteína, então sacia pouco para as calorias que tem. Cabe na dieta como doce, em porção controlada, não como lanche de todo dia.",
      },
      {
        question: "Quantas calorias tem uma fatia de panetone?",
        answer:
          "Uma fatia de 80 g do panetone de frutas tem entre 254 e 290 kcal, conforme a marca (274 kcal em duas bases de dados). O de chocolate fica entre cerca de 310 e 390 kcal na mesma fatia. Confira o rótulo do seu.",
      },
      {
        question: "Quantas calorias tem um panetone inteiro?",
        answer:
          "Um panetone de frutas de 500 g tem perto de 1.700 kcal. É quase um dia inteiro de calorias de muita gente, por isso ele rende fatias e não é para uma pessoa só.",
      },
      {
        question: "Panetone de chocolate engorda mais que o de frutas?",
        answer:
          "Tem mais calorias por fatia: perto de 310 a 390 kcal em 80 g, contra 254 a 290 kcal do de frutas. Os recheados e com cobertura costumam ficar no alto dessa faixa. Na prática, o que pesa é a quantidade, não o sabor.",
      },
      {
        question: "Panetone Bauducco engorda?",
        answer:
          "É como qualquer panetone: a fatia de 80 g do de frutas das marcas grandes fica perto de 254 a 290 kcal, e o rótulo da embalagem mostra o valor exato. Engorda se a quantidade passar do que você gasta, como qualquer outro.",
      },
      {
        question: "Quem está de dieta pode comer panetone?",
        answer:
          "Pode. Escolha a fatia que você vai comer, coma devagar, de preferência depois de uma refeição com proteína, e não compense pulando a próxima refeição. Uma fatia no fim de ano não desfaz meses de rotina.",
      },
    ],
    content: `<img src="/blog-images/panetone-engorda-capa.webp" alt="Capa: Panetone engorda? Calorias da fatia e quanto dá para comer. Ilustração de panetone fatiado e estrela de Natal" title="Panetone Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Panetone engorda?</strong> Uma fatia, não. O panetone é calórico, mas ganhar peso depende de comer mais do que se gasta por semanas, e não de um doce numa festa. O risco do fim de ano é outro: a caixa aberta na cozinha que vira uma fatia por dia até janeiro.</p>

<h2>Panetone engorda: sim ou não?</h2>
<p><strong>Engorda se virar hábito; não engorda numa fatia.</strong> O corpo responde à soma da semana. Uma fatia de panetone tem perto de 274 kcal no de frutas, o que uma refeição um pouco maior também tem. O problema aparece quando a fatia se repete todo dia, além de tudo o que você já come, e quando a fatia é grossa.</p>
<p>Ele também sacia pouco para as calorias que tem: é feito de farinha, açúcar, manteiga e frutas cristalizadas, com pouca proteína e pouca fibra. Por isso é fácil comer a segunda fatia sem perceber.</p>

<h2>Quantas calorias tem o panetone?</h2>
<table>
<thead><tr><th>Panetone</th><th>Porção</th><th>Calorias</th><th>Caminhada para gastar*</th></tr></thead>
<tbody>
<tr><td>De frutas</td><td>Fatia fina, 40 g</td><td>cerca de 137 kcal</td><td>cerca de 30 min</td></tr>
<tr><td>De frutas</td><td>Fatia, 80 g</td><td>254 a 290 kcal (274 kcal em duas bases)</td><td>55 a 62 min</td></tr>
<tr><td>De chocolate (chocotone)</td><td>Fatia, 80 g</td><td>cerca de 310 a 390 kcal</td><td>67 a 84 min</td></tr>
<tr><td>De frutas, inteiro</td><td>500 g</td><td>cerca de 1.700 kcal</td><td>mais de 6 horas</td></tr>
</tbody>
</table>
<p>A fatia de 80 g é a porção que os rótulos das marcas grandes usam. A tabela TACO, a brasileira, não tem panetone, então os valores vêm dos rótulos e de bases que os reproduzem, e mudam de uma marca para outra: confira a tabela nutricional da sua embalagem. *Caminhada em ritmo moderado para uma pessoa de 70 kg, com 3,8 METs do Compêndio de Atividades Físicas. Para fazer a conta com o seu peso e o seu ritmo, use a <a href="/ferramentas/calculadora-calorias-caminhada">Calculadora de Calorias na Caminhada</a>.</p>

<h2>Panetone de frutas, de chocolate ou recheado: qual engorda mais?</h2>
<p>Por fatia, o de <strong>chocolate</strong> tem mais calorias que o de frutas, e os <strong>recheados e com cobertura</strong> ficam no alto da faixa, porque somam recheio de chocolate, doce de leite ou creme. O de frutas é o mais leve dos três, mas ainda é doce.</p>
<p>Na prática, a diferença entre eles é menor do que a diferença entre uma fatia e duas. Escolha o que você gosta de verdade e controle o tamanho, em vez de comer o "mais leve" sem vontade e depois atacar o outro.</p>

<h2>Panetone Bauducco engorda?</h2>
<p>Como qualquer panetone. A fatia de 80 g do de frutas das marcas grandes fica na faixa de 254 a 290 kcal, e cada versão (frutas, gotas de chocolate, recheado) tem um valor diferente no rótulo. Não existe marca que engorde ou emagreça: o que muda o resultado é quanto e com que frequência.</p>

<h2>Quem está de dieta pode comer panetone?</h2>
<p>Pode. A dieta que funciona é a que aguenta o fim de ano, e não a que proíbe tudo até 1º de janeiro. Alguns jeitos de encaixar:</p>
<ul>
<li><strong>Decida a fatia antes de cortar.</strong> Corte, ponha no prato e guarde a caixa. Comer direto da caixa é como a segunda fatia acontece.</li>
<li><strong>Coma depois de uma refeição com proteína.</strong> Com o estômago cheio, uma fatia basta. Com fome, ela vira lanche.</li>
<li><strong>Não compense pulando refeição.</strong> Pular o jantar porque comeu panetone deixa você com mais fome à noite.</li>
<li><strong>Não deixe a caixa aberta na bancada.</strong> Fechada no armário, ela vira escolha; à vista, vira belisco.</li>
<li><strong>Mantenha o treino.</strong> Dezembro não é mês de parar. Dois treinos curtos na semana já seguram a rotina.</li>
</ul>
<p>Se a vontade de doce aparece todo dia, e não só no Natal, o problema é outro: veja o artigo de <a href="/blog/vontade-de-doce">vontade de doce</a> e as ideias do <a href="/ferramentas/mata-a-vontade">Mata a Vontade</a>. Para medir o que os beliscos somam no dia, use o <a href="/ferramentas/beliscometro">Beliscômetro</a>.</p>

<h2>Comer panetone no Natal estraga a dieta?</h2>
<p>Não. Uma ceia não desfaz meses. O que desfaz é a semana de "já que estraguei" que vem depois. Aproveite a festa, coma a fatia que você quer e, no dia seguinte, volte para a rotina. Para o resto da ceia, veja <a href="/blog/como-aproveitar-ceia-sem-exagerar">como aproveitar a ceia de Natal sem exagerar</a> e <a href="/blog/como-nao-perder-o-shape-no-natal">como não perder o shape no Natal</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que passa o Natal sem tocar no panetone e gente que come uma fatia por dia. Nenhum dos dois é a sua régua. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer e de treinar que dê para manter o ano inteiro, festa incluída.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.tabelatacoonline.com.br/tabela-nutricional/marcas/bauducco-panetone-frutas-80g" target="_blank" rel="noopener noreferrer">Tabela TACO Online — panetone de frutas, 80 g (marcas)</a></li>
<li><a href="https://www.fatsecret.com.br/calorias-nutri%C3%A7%C3%A3o/bauducco/panettone-frutas/1-fatia" target="_blank" rel="noopener noreferrer">FatSecret — panettone de frutas, 1 fatia (80 g)</a></li>
<li><a href="https://www.paodeacucar.com/produto/194029/chocottone-com-gotas-de-chocolate-bauducco-caixa-400g" target="_blank" rel="noopener noreferrer">Pão de Açúcar — chocotone com gotas de chocolate, tabela nutricional</a></li>
<li><a href="https://www.fatsecret.com.br/calorias-nutri%C3%A7%C3%A3o/bauducco/chocottone/1-fatia" target="_blank" rel="noopener noreferrer">FatSecret — chocotone, 1 fatia (80 g)</a></li>
<li><a href="https://pacompendium.com/walking/" target="_blank" rel="noopener noreferrer">Compêndio de Atividades Físicas — caminhada</a> (ritmo moderado, 4,5 a 5,5 km/h: 3,8 METs)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/como-aproveitar-ceia-sem-exagerar">Como aproveitar a ceia de Natal sem exagerar</a></li>
<li><a href="/blog/como-nao-perder-o-shape-no-natal">Como não perder o shape no Natal</a></li>
<li><a href="/blog/como-manter-dieta-festas-fim-de-ano">Como manter a dieta nas festas de fim de ano</a></li>
<li><a href="/blog/chocolate-engorda">Chocolate engorda?</a></li>
</ul>`,
  },
];
