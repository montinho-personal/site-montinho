import type { BlogPost } from "./blog";

/**
 * "O que comer antes da São Silvestre" (29/10/2026). Pauta da varredura da
 * São Silvestre. Prints do Google (autocompletar, visão geral por IA, PAA,
 * Terra e UniCuritiba na 1ª página); sem export do Answer the Public.
 * PAA: melhor alimento antes da corrida, como se preparar, o que vem no kit
 * (link), o que é bom comer antes da prova. A visão geral cita 2 a 4 h antes,
 * pouca fibra e gordura, pão branco com mel ou geleia, bolo simples, banana,
 * maçã sem casca, pera, suco coado e água de coco; a UniCuritiba fala em mais
 * carboidrato nos 3 dias antes (aqui: só para quem passa de 90 min).
 *
 * Não canibaliza "primeira-sao-silvestre-dicas" (que fala da véspera numa
 * linha) nem "alimentacao-para-hyrox": este é só a comida e a água da prova
 * de 15 km, com o horário de largada de 2026 (pelotão geral a partir das
 * 8h08, pelo regulamento, já citado em lib/sao-silvestre-2026.ts).
 *
 * Números das mesmas diretrizes do artigo de Hyrox: carboidrato de 1 a 4 g/kg
 * de 1 a 4 h antes, 30 a 60 g/h em esforço de 1 a 2,5 h, carb loading só
 * acima de 90 min contínuos, água de 5 a 10 ml/kg de 2 a 4 h antes (Thomas
 * 2016); cafeína de 3 a 6 mg/kg cerca de 60 min antes (Guest 2021).
 *
 * Ferramenta: link do Previsor da São Silvestre (o tempo provável decide se
 * vale gel e carboidrato a mais na véspera).
 */

const FONTES = [
  {
    rotulo: "Thomas DT, Erdman KA, Burke LM. Nutrition and Athletic Performance (ACSM, Academy of Nutrition and Dietetics, Dietitians of Canada). Med Sci Sports Exerc, 2016",
    url: "https://pubmed.ncbi.nlm.nih.gov/26891166/",
  },
  {
    rotulo: "Kerksick CM, et al. ISSN position stand: nutrient timing. J Int Soc Sports Nutr, 2017",
    url: "https://pubmed.ncbi.nlm.nih.gov/28919842/",
  },
  {
    rotulo: "Guest NS, et al. ISSN position stand: caffeine and exercise performance. J Int Soc Sports Nutr, 2021",
    url: "https://pubmed.ncbi.nlm.nih.gov/33388079/",
  },
];

export const ALIMENTACAO_SAO_SILVESTRE_POSTS: BlogPost[] = [
  {
    slug: "o-que-comer-antes-da-sao-silvestre",
    title: "O Que Comer Antes da São Silvestre: Véspera, Café e Prova",
    metaTitle: "O Que Comer Antes da São Silvestre: Véspera e Café da Manhã",
    metaDescription:
      "O que jantar na véspera da São Silvestre, que horas tomar café com a largada às 8h08, quanta água e carboidrato pelo seu peso e se vale levar gel.",
    excerpt:
      "Jantar da véspera, café da manhã com a largada às 8h08, quanta água e carboidrato pelo seu peso, gel, cafeína e o que comer depois dos 15 km.",
    category: "Nutrição",
    date: "2026-10-29",
    readTime: "6 min",
    author: "Montinho",
    tags: ["São Silvestre", "São Silvestre 2026", "o que comer antes da corrida", "alimentação corrida", "corrida de rua"],
    faq: [
      {
        question: "O que comer antes da São Silvestre?",
        answer:
          "Um café da manhã com carboidrato de fácil digestão de 2 a 4 horas antes da largada: pão com mel ou geleia, tapioca, banana, aveia. Com o pelotão geral largando a partir das 8h08, isso dá café entre 4h30 e 6h. Pouca fibra, pouca gordura e nada que você nunca comeu antes de correr.",
      },
      {
        question: "Qual o melhor alimento antes da corrida?",
        answer:
          "Não existe um só. Os que mais funcionam são carboidratos de fácil digestão e pouca fibra: pão francês ou de forma com mel ou geleia, tapioca, bolo simples sem recheio, banana madura, maçã sem casca ou pera. O melhor é o que você já testou antes dos treinos longos.",
      },
      {
        question: "Como me preparar para a São Silvestre?",
        answer:
          "Treino de corrida aumentando o volume aos poucos, força para as pernas por causa da subida da Brigadeiro e, na semana da prova, descanso, comida conhecida e sono. O plano completo está no treino de 13 semanas para a São Silvestre.",
      },
      {
        question: "O que jantar na véspera da São Silvestre?",
        answer:
          "Um jantar normal, com carboidrato (arroz, massa, batata) e uma proteína leve, sem exagero de gordura, fritura e fibra. Não é dia de comer o dobro: é dia de comer o que você já conhece e dormir cedo.",
      },
      {
        question: "Precisa fazer carb loading para a São Silvestre?",
        answer:
          "Para a maioria, não. O carregamento de carboidrato é indicado para esforços contínuos de mais de 90 minutos. Quem leva mais de uma hora e meia nos 15 km e já testou pode aumentar um pouco o carboidrato na véspera, sem dobrar o volume de comida.",
      },
      {
        question: "Quanta água tomar antes da São Silvestre?",
        answer:
          "De 5 a 10 ml por quilo de peso de 2 a 4 horas antes: para 70 kg, de 350 a 700 ml, junto com o café da manhã. Assim dá tempo de ir ao banheiro antes de entrar no pelotão.",
      },
      {
        question: "Precisa tomar gel na São Silvestre?",
        answer:
          "Para provas de 1 a 2 horas e meia, as diretrizes indicam de 30 a 60 g de carboidrato por hora. Quem faz os 15 km em menos de uma hora precisa de pouco além de água. Quem passa de uma hora pode levar um gel para o meio da prova, desde que já tenha testado no treino.",
      },
      {
        question: "Posso tomar café antes da São Silvestre?",
        answer:
          "Pode, se você já toma antes de correr. A dose estudada para desempenho é de 3 a 6 mg de cafeína por quilo, cerca de 60 minutos antes. Quem não está acostumado não deve estrear no dia da prova, porque o café pode mexer com o intestino.",
      },
      {
        question: "O que não comer antes da São Silvestre?",
        answer:
          "Comida nova, refeição grande perto da largada, muita fibra (feijão, salada crua em quantidade, granola com muita semente), fritura e gordura. Gel, café ou pré-treino que o corpo não conhece também ficam de fora.",
      },
      {
        question: "O que comer depois da São Silvestre?",
        answer:
          "Nas primeiras horas, uma refeição com carboidrato e proteína, como arroz, batata ou pão com frango, carne, ovos ou iogurte, e água até a urina voltar à cor clara. Depois é Réveillon: aproveite.",
      },
    ],
    content: `<p><strong>O que comer antes da São Silvestre?</strong> Um jantar normal na véspera, com carboidrato e sem exagero, e um café da manhã leve de 2 a 4 horas antes da largada. Em 2026, o pelotão geral larga a partir das <strong>8h08</strong>, então o café fica entre 4h30 e 6h. A regra que vale mais do que qualquer quantidade: no dia 31 você come o que já testou nos treinos.</p>

<h2>Resposta direta</h2>
<ul>
<li><strong>Véspera:</strong> jantar com carboidrato (arroz, massa, batata) e proteína leve, sem fritura e sem exagero de fibra.</li>
<li><strong>Café da manhã:</strong> de 2 a 4 horas antes, com carboidrato de fácil digestão e pouca fibra e gordura.</li>
<li><strong>Água:</strong> de 5 a 10 ml por quilo de 2 a 4 horas antes.</li>
<li><strong>Durante:</strong> água nos postos; gel só se a prova passar de uma hora e você já usou no treino.</li>
<li><strong>Nada novo:</strong> comida, gel, café e suplemento do dia 31 são os mesmos dos treinos longos.</li>
</ul>

<h2>Que horas tomar café com a largada às 8h08</h2>
<p>Pelo regulamento de 2026, o pelotão geral larga a partir das 8h08, em ondas pelo pace informado na inscrição, e a orientação é chegar pelo menos 45 minutos antes. Contando o deslocamento até a Paulista, o café da manhã de 2 a 4 horas antes cai entre <strong>4h30 e 6h</strong>. Quem não consegue comer tão cedo pode fazer uma refeição menor, mais perto da saída de casa, e completar com uma banana.</p>
<p>Treine esse horário: faça pelo menos dois treinos longos acordando cedo e comendo o mesmo café que vai comer no dia 31. É o jeito mais simples de descobrir o que o seu estômago aceita.</p>

<h2>O que comer no café da manhã da prova</h2>
<p>Carboidrato de fácil digestão, com pouca fibra e pouca gordura. Escolha dois ou três itens desta lista e faça a mesma combinação nos treinos longos:</p>
<ul>
<li><strong>Pães e bolos:</strong> pão francês ou de forma com mel, geleia ou requeijão light; tapioca; bolo simples, como o de milho ou de aipim, sem recheio.</li>
<li><strong>Frutas:</strong> banana madura, maçã sem casca, pera.</li>
<li><strong>Aveia</strong> em pouca quantidade, se você já está acostumado.</li>
<li><strong>Bebidas:</strong> água, suco de fruta coado, água de coco; café só se você já toma antes de correr.</li>
</ul>
<p>Quem está acostumado com pão integral pode manter. Só não é dia de exagerar na fibra se o seu intestino não está habituado a ela antes de correr.</p>

<h2>Quanto carboidrato e água pelo seu peso</h2>
<p>As diretrizes de nutrição esportiva falam em <strong>1 a 4 g de carboidrato por quilo</strong> de 1 a 4 horas antes do esforço: quanto mais perto da largada, menor a quantidade. Para um café de 2 a 3 horas antes, a faixa de 1 a 2 g por quilo costuma cair bem:</p>
<table>
<thead><tr><th>Peso</th><th>Carboidrato (1–2 g/kg)</th><th>Água (5–10 ml/kg)</th><th>Cafeína, se usar (3 mg/kg)</th></tr></thead>
<tbody>
<tr><td>60 kg</td><td>60 a 120 g</td><td>300 a 600 ml</td><td>180 mg</td></tr>
<tr><td>70 kg</td><td>70 a 140 g</td><td>350 a 700 ml</td><td>210 mg</td></tr>
<tr><td>80 kg</td><td>80 a 160 g</td><td>400 a 800 ml</td><td>240 mg</td></tr>
<tr><td>90 kg</td><td>90 a 180 g</td><td>450 a 900 ml</td><td>270 mg</td></tr>
</tbody>
</table>
<p>Na prática, duas fatias de pão com mel e uma banana dão perto de 70 g de carboidrato. Mais ideias de refeição antes de correr estão em <a href="/blog/carboidrato-antes-do-treino">carboidrato antes do treino</a>.</p>

<h2>O que jantar na véspera</h2>
<p>O jantar do dia 30 não precisa ser especial. Um prato de arroz ou massa com frango, carne magra ou ovos, legumes cozidos e água. O que atrapalha é o contrário: comer muito mais do que o normal "para ter energia", fritura, feijoada, muita salada crua e álcool. Coma cedo o bastante para dormir bem, porque o despertador do dia 31 toca de madrugada.</p>

<h2>Precisa fazer carb loading?</h2>
<p>Muita gente ouve que precisa comer mais carboidrato nos três dias antes da prova. O carregamento de carboidrato, de 10 a 12 g por quilo por dia nas 36 a 48 horas antes, é indicado para esforços contínuos de <strong>mais de 90 minutos</strong>. A maior parte do pelotão geral termina os 15 km entre 1h10 e 2h, então depende de você:</p>
<ul>
<li><strong>Abaixo de 1h30:</strong> jantar e café da manhã com carboidrato bastam.</li>
<li><strong>Acima de 1h30:</strong> dá para aumentar um pouco o carboidrato na véspera (mais arroz, mais pão, menos gordura no prato), sem dobrar o volume de comida. Teste antes num treino longo.</li>
</ul>
<p>Para saber de que lado você está, o <a href="/ferramentas/previsor-sao-silvestre">Previsor da São Silvestre</a> calcula o seu tempo provável nos 15 km a partir de um tempo recente em 5 km, 10 km ou meia.</p>

<h2>Precisa de gel durante a prova?</h2>
<p>Para esforços de 1 a 2 horas e meia, as diretrizes indicam <strong>de 30 a 60 g de carboidrato por hora</strong>. Quem corre em menos de uma hora precisa de pouco além de água. Quem passa de uma hora pode levar um gel para tomar no meio do percurso, antes da subida da Brigadeiro. O teor de carboidrato muda de marca para marca, então confira o rótulo.</p>
<p>A organização monta postos de hidratação ao longo do trajeto. Beba um pouco em cada um, sem parar de repente no meio do pelotão. E <strong>gel que o estômago nunca viu não estreia no dia 31</strong>.</p>

<h2>Café e cafeína</h2>
<p>A dose de cafeína estudada para desempenho é de <strong>3 a 6 mg por quilo</strong>, cerca de 60 minutos antes. Comece pela ponta de baixo e lembre que pré-treino e alguns géis já têm cafeína. Quem não está acostumado a tomar café antes de correr não deve estrear no dia da prova: além do coração acelerado, ele pode mexer com o intestino. A conta pelo seu peso está na <a href="/ferramentas/calculadora-cafeina">Calculadora de Cafeína</a>.</p>

<h2>O que evitar no dia</h2>
<ul>
<li>comida nova ou de restaurante que você não conhece;</li>
<li>refeição grande perto da largada;</li>
<li>muita fibra: feijão, granola com muita semente, salada crua em quantidade;</li>
<li>fritura e gordura;</li>
<li>gel, café ou pré-treino em dose que você nunca usou.</li>
</ul>
<p>Se o estômago costuma atrapalhar nos treinos longos mesmo com a comida certa, procure um médico antes da prova.</p>

<h2>Depois da prova</h2>
<p>Nas primeiras horas, uma refeição com <strong>carboidrato e proteína</strong>: arroz, batata ou pão com frango, carne, ovos ou iogurte. A proteína de 0,25 a 0,4 g por quilo na refeição, perto de 20 a 30 g para 70 kg, é a faixa das diretrizes. Água até a urina voltar à cor clara. Depois disso é Réveillon, e você mereceu.</p>

<h2>Não se compare</h2>
<p>No pelotão vai ter gente com cinto de gel, gente que toma café na largada e gente que corre de fantasia comendo pipoca. Não copie ninguém. Cada um tem a própria genética, rotina e história. O que funciona é o que você testou nos seus treinos, no seu horário.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/primeira-sao-silvestre-dicas">Primeira São Silvestre: dicas para estrear nos 15 km</a></li>
<li><a href="/blog/treino-sao-silvestre-13-semanas">Treino para a São Silvestre: planilha de 13 semanas</a></li>
<li><a href="/blog/percurso-sao-silvestre">Percurso da São Silvestre: os 15 km trecho a trecho</a></li>
<li><a href="/blog/retirada-kit-sao-silvestre-2026">Retirada do kit da São Silvestre 2026</a></li>
<li><a href="/blog/alimentacao-para-hyrox">Alimentação para Hyrox: o que comer antes e depois</a></li>
</ul>

<h2>Fontes</h2>
<ul>
${FONTES.map((f) => `<li><a href="${f.url}" target="_blank" rel="noopener noreferrer">${f.rotulo}</a></li>`).join("\n")}
<li>Horário de largada e chegada antecipada: regulamento da 101ª São Silvestre (2026), em <a href="https://www.saosilvestre.com.br/" target="_blank" rel="noopener noreferrer">saosilvestre.com.br</a>.</li>
</ul>`,
  },
];
