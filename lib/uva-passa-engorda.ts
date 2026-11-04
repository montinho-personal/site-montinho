import type { BlogPost } from "./blog";

/**
 * "Uva passa engorda?" (04/11/2026). 4.400 buscas por mês no Planejador de
 * Palavras-chave do Google Ads (Brasil), com pico no fim do ano. Fecha o
 * grupo do Natal (ceia, panetone, rabanada). Publicado a pedido do Montinho
 * ANTES dos prints; título, H2 e FAQ serão revistos com a pesquisa.
 *
 * Números: a TACO não tem uva-passa. Usamos 299 kcal, 79,18 g de
 * carboidrato, 3,07 g de proteína e 0,46 g de gordura por 100 g, o mesmo
 * valor em duas bases independentes (a tabela do IBGE reproduzida pela
 * Tabela TACO Online, e o FatSecret Brasil). A uva fresca vem da TACO (uva
 * Itália crua, 53 kcal por 100 g). As porções são em gramas, escolha nossa,
 * porque não há medida caseira oficial para uva-passa na tabela do IBGE que
 * usamos. Fibra e açúcar não entram em número: não achamos o valor nas duas
 * bases.
 * Arroz com passas: 1 concha de arroz branco (100 g, POF/IBGE; 128 kcal na
 * TACO) + 15 g de passas (45 kcal) = 173 kcal.
 * Caminhada: 3,8 METs, 70 kg, ≈ 4,66 kcal por minuto.
 *
 * Ferramenta: Calculadora de Calorias na Caminhada como link.
 */

export const UVA_PASSA_POSTS: BlogPost[] = [
  {
    slug: "uva-passa-engorda",
    title: "Uva Passa Engorda? Calorias e Quanto Comer",
    metaTitle: "Uva Passa Engorda? Calorias e Quanto Comer",
    metaDescription:
      "Uva passa engorda? Ela tem quase seis vezes as calorias da uva fresca no mesmo peso: 299 kcal em 100 g. Veja quanto comer, no arroz do Natal e antes do treino.",
    excerpt:
      "Quantas calorias tem a uva passa, por que ela engorda mais que a uva fresca no mesmo peso, quanto comer e como usar no arroz da ceia e antes do treino.",
    category: "Nutrição",
    date: "2026-11-04",
    readTime: "5 min",
    author: "Montinho",
    tags: ["uva passa", "natal", "calorias", "frutas secas", "dieta"],
    faq: [
      {
        question: "Uva passa engorda?",
        answer:
          "Uma porção pequena, não. Ela é calórica para o tamanho: 299 kcal em 100 g, porque é a uva sem a água. O risco é comer de punhado, sem perceber, já que um pouco de passa tem as calorias de muita uva fresca.",
      },
      {
        question: "Quantas calorias tem a uva passa?",
        answer:
          "Cerca de 299 kcal em 100 g, com 79 g de carboidrato, 3 g de proteína e quase nenhuma gordura. Uma porção de 30 g tem perto de 90 kcal.",
      },
      {
        question: "Uva passa engorda mais que a uva fresca?",
        answer:
          "No mesmo peso, sim: 100 g de uva fresca têm perto de 53 kcal, e 100 g de passa, 299 kcal, quase seis vezes mais. É a mesma fruta sem a água, então cabe muito mais uva em poucos gramas.",
      },
      {
        question: "Uva passa engorda ou emagrece?",
        answer:
          "Nenhum alimento sozinho engorda ou emagrece. A passa é uma fruta concentrada: boa para dar energia rápida, fácil de exagerar. Cabe na dieta em porção pequena e medida.",
      },
      {
        question: "Quem está de dieta pode comer uva passa?",
        answer:
          "Pode, em porção medida. Separe a quantidade num potinho em vez de comer do pacote, e prefira a passa misturada a uma refeição, como no iogurte ou no arroz, do que beliscada sozinha.",
      },
      {
        question: "Arroz com uva passa engorda?",
        answer:
          "Uma concha de arroz branco (100 g) tem perto de 128 kcal; com 15 g de passas, vai para perto de 173 kcal. A passa soma, mas o que mais pesa no prato da ceia é a quantidade de arroz e o que vem junto.",
      },
      {
        question: "Uva passa é boa antes do treino?",
        answer:
          "Pode ser. Ela é quase toda carboidrato, com pouca gordura e pouca proteína, então é digerida rápido e dá energia. Uma porção pequena, de 20 a 30 g, cerca de uma hora antes, funciona para muita gente.",
      },
    ],
    content: `<img src="/blog-images/uva-passa-engorda-capa.webp" alt="Capa: Uva passa engorda? Calorias e quanto comer. Ilustração de cacho de uva e uvas-passas" title="Uva Passa Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Uva passa engorda?</strong> Uma porção pequena, não. Mas ela é bem mais calórica do que parece: é a uva sem a água, então poucos gramas guardam as calorias de muita fruta. O risco está no punhado sem medida, não na colher do arroz da ceia.</p>

<h2>Uva passa engorda: sim ou não?</h2>
<p><strong>Engorda se virar belisco sem medida; não engorda em porção pequena.</strong> Ganhar peso depende do que se repete por semanas, e não de um alimento. O problema da passa é que ela é pequena, doce e fácil de comer: um punhado vai rápido, e a conta sobe sem que você sinta que comeu muito.</p>

<h2>Quantas calorias tem a uva passa?</h2>
<table>
<thead><tr><th>Porção</th><th>Calorias</th><th>Caminhada para gastar*</th></tr></thead>
<tbody>
<tr><td>10 g</td><td>cerca de 30 kcal</td><td>cerca de 6 min</td></tr>
<tr><td>15 g (o que vai no arroz de um prato)</td><td>cerca de 45 kcal</td><td>cerca de 10 min</td></tr>
<tr><td>30 g</td><td>cerca de 90 kcal</td><td>cerca de 19 min</td></tr>
<tr><td>50 g</td><td>cerca de 150 kcal</td><td>cerca de 32 min</td></tr>
<tr><td>100 g</td><td>cerca de 299 kcal</td><td>cerca de 1 h 4 min</td></tr>
</tbody>
</table>
<p>Em 100 g, a uva-passa tem perto de 299 kcal, 79 g de carboidrato, 3 g de proteína e quase nenhuma gordura. A tabela TACO não tem uva-passa; o valor é o mesmo em duas bases de dados independentes. Marcas com açúcar ou óleo na cobertura podem ter mais: confira o rótulo. *Caminhada em ritmo moderado para uma pessoa de 70 kg, com 3,8 METs do Compêndio de Atividades Físicas. Para a conta com o seu peso, use a <a href="/ferramentas/calculadora-calorias-caminhada">Calculadora de Calorias na Caminhada</a>.</p>

<h2>Uva passa engorda mais que a uva fresca?</h2>
<p>No mesmo peso, sim. Pela TACO, 100 g de uva Itália fresca têm perto de 53 kcal. A mesma quantidade de passa tem 299 kcal, quase seis vezes mais. Não é que a passa "ganhe" caloria: ela perde a água, e a fruta encolhe. Cabe muito mais uva em poucos gramas.</p>
<p>Na prática, a uva fresca enche mais o estômago com menos calorias, porque a água ocupa espaço. A passa dá a mesma doçura num volume pequeno, o que é bom quando você quer energia rápida e ruim quando você está com fome.</p>

<h2>Uva passa engorda ou emagrece?</h2>
<p>Nenhum alimento sozinho faz uma coisa ou outra. A passa é uma fruta concentrada: tem vitaminas e minerais da uva, mas também todo o açúcar dela num volume pequeno. Na dieta, ela funciona como um doce natural em porção medida, e não como lanche à vontade. Se o objetivo é saciar, a fruta fresca rende mais. Veja <a href="/blog/melhores-frutas-para-emagrecer">as melhores frutas para emagrecer</a>.</p>

<h2>Quem está de dieta pode comer uva passa?</h2>
<p>Pode. Alguns jeitos de encaixar sem exagerar:</p>
<ul>
<li><strong>Separe a porção antes.</strong> Um potinho com 20 ou 30 g, e o pacote volta para o armário.</li>
<li><strong>Misture a uma refeição.</strong> No iogurte, na aveia ou no arroz, ela adoça sem virar belisco.</li>
<li><strong>Não coma direto do pacote.</strong> É assim que 30 g viram 100 g sem você perceber.</li>
<li><strong>Prefira a passa sem cobertura.</strong> As versões com chocolate ou açúcar somam calorias.</li>
</ul>

<h2>Arroz com uva passa engorda?</h2>
<p>O arroz da ceia é onde a passa mais aparece, e ela pesa menos do que parece. Uma concha de arroz branco (100 g) tem perto de 128 kcal. Com cerca de 15 g de passas misturadas, vai para perto de 173 kcal. O que muda o prato de verdade é quantas conchas você serve e o que vai ao lado, como a farofa. Para o resto da mesa, veja a <a href="/blog/calorias-da-ceia-de-natal">tabela de calorias da ceia de Natal</a>.</p>

<h2>Uva passa antes do treino</h2>
<p>Ela é quase toda carboidrato, com pouca gordura e pouca proteína, então é digerida rápido. Isso a torna uma opção prática antes do treino, principalmente para quem treina cedo e não quer comer uma refeição inteira. Uma porção pequena, de 20 a 30 g, cerca de uma hora antes, costuma funcionar. Teste num treino leve antes de usar num treino pesado. Mais opções em <a href="/blog/frutas-antes-do-treino">frutas antes do treino</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come passa no arroz o ano inteiro e gente que tira uma por uma do prato. Nenhum dos dois é a sua régua. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer e de treinar que dê para manter o ano inteiro, Natal incluído.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: uva Itália crua e arroz branco cozido</li>
<li><a href="https://www.tabelatacoonline.com.br/tabela-nutricional/ibge/uva-passa" target="_blank" rel="noopener noreferrer">Tabela TACO Online — uva-passa (tabela do IBGE)</a></li>
<li><a href="https://www.fatsecret.com.br/calorias-nutri%C3%A7%C3%A3o/alimentos/uvas-passas" target="_blank" rel="noopener noreferrer">FatSecret Brasil — uvas-passas</a></li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (concha de arroz)</li>
<li><a href="https://pacompendium.com/walking/" target="_blank" rel="noopener noreferrer">Compêndio de Atividades Físicas — caminhada</a> (ritmo moderado, 4,5 a 5,5 km/h: 3,8 METs)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/calorias-da-ceia-de-natal">Calorias da ceia de Natal</a></li>
<li><a href="/blog/panetone-engorda">Panetone engorda?</a></li>
<li><a href="/blog/rabanada-engorda">Rabanada engorda?</a></li>
<li><a href="/blog/melhores-frutas-para-emagrecer">Melhores frutas para emagrecer</a></li>
</ul>`,
  },
];
