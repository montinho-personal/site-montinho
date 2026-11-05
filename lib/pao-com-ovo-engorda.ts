import type { BlogPost } from "./blog";

/**
 * "Pão com ovo engorda?" (05/11/2026). 5.400 buscas por mês, mais 1.600 de
 * "pão com ovo calorias", no Planejador de Palavras-chave do Google Ads
 * (Brasil). Publicado a pedido do Montinho ANTES dos prints; título, H2 e FAQ
 * serão revistos com a pesquisa.
 *
 * Números: TACO 4ª edição, pela base do próprio site (data/alimentos):
 *   - pão francês: 300 kcal, 8,0 g de proteína, 2,3 g de fibra por 100 g;
 *   - pão de forma integral: 253 kcal, 9,4 g de proteína, 6,9 g de fibra;
 *   - ovo inteiro cozido: 146 kcal, 13,3 g de proteína por 100 g;
 *   - ovo inteiro cru: 143 kcal; ovo frito: 240 kcal e 18,6 g de gordura;
 *   - manteiga com sal: 726 kcal por 100 g.
 * Porções da POF 2008-2009 (IBGE), também na base: 1 pão francês = 50 g,
 * 1 ovo = 45 g. Manteiga em gramas (5 g), escolha nossa: a base não tem
 * medida caseira para ela.
 * Contas: pão 150 kcal e 4 g de proteína; ovo cozido 66 kcal e 6 g; pão +
 * 1 ovo cozido = 216 kcal e 10 g; pão + 2 ovos cozidos = 281 kcal e 16 g;
 * pão + 1 ovo mexido em 5 g de manteiga = 150 + 64 + 36 = 250 kcal.
 *
 * Ferramenta: Calculadora de TDEE embutida (o leitor sai com "216 kcal" e a
 * pergunta que sobra é quanto isso pesa no gasto do dia DELE). Ficha de
 * alimento (pão francês e ovo cozido) pelo registro de fichas.
 */

export const PAO_COM_OVO_POSTS: BlogPost[] = [
  {
    slug: "pao-com-ovo-engorda",
    title: "Pão com Ovo Engorda? Calorias e Como Montar",
    metaTitle: "Pão com Ovo Engorda? Calorias e Como Montar",
    metaDescription:
      "Um pão francês com um ovo cozido tem perto de 216 kcal e 10 g de proteína. Veja quando engorda, frito ou cozido, no café da manhã, à noite e antes do treino.",
    excerpt:
      "Quantas calorias tem o pão com ovo, o que muda entre frito, cozido e mexido na manteiga, pão francês ou integral, e como encaixar no café da manhã, à noite e no treino.",
    category: "Nutrição",
    date: "2026-11-05",
    readTime: "5 min",
    author: "Montinho",
    tags: ["pão com ovo", "calorias", "café da manhã", "proteína", "dieta"],
    faq: [
      {
        question: "Pão com ovo engorda?",
        answer:
          "Não por si só. Um pão francês com um ovo cozido tem perto de 216 kcal, menos que muita opção de padaria. Engorda o que passa do seu gasto ao longo das semanas; o pão com ovo é uma refeição pequena e com proteína.",
      },
      {
        question: "Quantas calorias tem um pão com ovo?",
        answer:
          "Um pão francês (50 g) com um ovo cozido (45 g) tem perto de 216 kcal. Com dois ovos, perto de 281 kcal. Mexido em 5 g de manteiga, um ovo com o pão vai para perto de 250 kcal.",
      },
      {
        question: "Pão com ovo frito engorda mais?",
        answer:
          "Um pouco mais. Em 100 g, o ovo frito tem perto de 240 kcal, contra 146 do cozido, por causa da gordura da fritura. A diferença depende de quanto óleo ou manteiga vai na frigideira.",
      },
      {
        question: "Pão com ovo é bom para emagrecer?",
        answer:
          "Pode ser. Tem proteína, que ajuda a segurar a fome, e cabe em poucas calorias. Funciona melhor com o ovo cozido ou mexido sem muita gordura, e com o resto do dia dentro do seu gasto.",
      },
      {
        question: "Pão com ovo à noite engorda?",
        answer:
          "O horário não engorda. O que conta é o total do dia. Um pão com ovo à noite é uma janta leve e prática, se as calorias do resto do dia couberem.",
      },
      {
        question: "Pão com ovo antes do treino é bom?",
        answer:
          "É uma boa opção: o pão dá carboidrato para energia e o ovo, proteína. Coma de 1 a 2 horas antes, para não treinar com o estômago cheio.",
      },
      {
        question: "Pão francês ou integral com ovo?",
        answer:
          "Em 100 g, o pão de forma integral tem menos calorias (253 contra 300) e três vezes mais fibra (6,9 g contra 2,3 g) que o francês. O integral sustenta mais, mas os dois cabem numa dieta.",
      },
    ],
    content: `<img src="/blog-images/pao-com-ovo-engorda-capa.webp" alt="Capa: Pão com ovo engorda? Calorias e como montar. Ilustração de pão francês com ovo frito" title="Pão com Ovo Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Pão com ovo engorda?</strong> Não por si só. Um pão francês com um ovo cozido tem perto de 216 kcal e 10 g de proteína: é uma refeição pequena, barata e que segura a fome. O que muda a conta é a quantidade de ovos, a gordura da frigideira e o que vem junto.</p>

<h2>Quantas calorias tem um pão com ovo?</h2>
<table>
<thead><tr><th>Como</th><th>Calorias</th><th>Proteína</th></tr></thead>
<tbody>
<tr><td>1 pão francês (50 g)</td><td>cerca de 150 kcal</td><td>4 g</td></tr>
<tr><td>1 ovo cozido (45 g)</td><td>cerca de 66 kcal</td><td>6 g</td></tr>
<tr><td><strong>Pão + 1 ovo cozido</strong></td><td><strong>cerca de 216 kcal</strong></td><td><strong>10 g</strong></td></tr>
<tr><td>Pão + 2 ovos cozidos</td><td>cerca de 281 kcal</td><td>16 g</td></tr>
<tr><td>Pão + 1 ovo mexido em 5 g de manteiga</td><td>cerca de 250 kcal</td><td>10 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos, com o peso de 1 pão francês e de 1 ovo da pesquisa de orçamentos familiares do IBGE. Pão de padaria varia de tamanho: um pão maior muda a conta. A pergunta que sobra é quanto isso pesa no <em>seu</em> dia, e a calculadora abaixo responde:</p>

<h2>Pão com ovo engorda: sim ou não?</h2>
<p><strong>Engorda o que passa do seu gasto, repetido por semanas.</strong> Nenhum alimento sozinho faz isso. Perto de 216 kcal é uma refeição pequena, e a proteína do ovo ajuda a chegar no almoço sem beliscar.</p>
<p>O pão com ovo vira problema quando vem em dobro ou triplo sem você perceber: dois pães, três ovos fritos, manteiga no pão e no ovo, e um suco junto. Aí a refeição passa fácil do dobro ou do triplo das 216 kcal.</p>

<h2>Ovo frito, cozido ou mexido: qual engorda mais?</h2>
<p>O ovo é o mesmo; muda a gordura do preparo. Pela TACO, em 100 g, o ovo cozido tem perto de 146 kcal e o frito, perto de 240 kcal. A diferença vem quase toda da fritura: o frito tem 18,6 g de gordura em 100 g, o cozido 9,5 g.</p>
<ul>
<li><strong>Cozido:</strong> o mais leve. Faça vários de uma vez e guarde na geladeira.</li>
<li><strong>Mexido:</strong> leve se for numa frigideira antiaderente com pouca gordura. 5 g de manteiga somam perto de 36 kcal.</li>
<li><strong>Frito:</strong> o mais calórico, e quanto mais óleo na frigideira, mais ele absorve.</li>
</ul>

<h2>Pão francês ou integral?</h2>
<p>Em 100 g, o pão de forma integral tem menos calorias que o francês (253 contra 300) e três vezes mais fibra (6,9 g contra 2,3 g). A fibra ajuda a saciar por mais tempo. Mas os dois cabem numa dieta: um pão francês com ovo continua sendo uma boa refeição. Mais em <a href="/blog/pao-integral-engorda">pão integral engorda?</a>.</p>

<h2>Pão com ovo no café da manhã, à noite e no treino</h2>
<ul>
<li><strong>Café da manhã:</strong> é o uso mais comum, e um dos melhores. Carboidrato para começar o dia e proteína para segurar até o almoço. Uma fruta junto completa.</li>
<li><strong>À noite:</strong> o horário não engorda. Um pão com ovo é uma janta leve e prática, se o resto do dia couber. Veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite</a>.</li>
<li><strong>Antes do treino:</strong> de 1 a 2 horas antes, dá energia sem pesar. Mais opções em <a href="/blog/o-que-comer-no-cafe-da-manha-para-treinar">o que comer no café da manhã para treinar</a>.</li>
<li><strong>Depois do treino:</strong> dois ovos com o pão dão perto de 16 g de proteína. Ajuda, mas o que mais importa é a proteína do dia inteiro. Veja <a href="/blog/quanta-proteina-por-dia-para-ganhar-massa-muscular">quanta proteína por dia</a>.</li>
</ul>

<h2>Como montar um pão com ovo que cabe na dieta</h2>
<ul>
<li><strong>Prefira o ovo cozido ou mexido com pouca gordura.</strong></li>
<li><strong>Dois ovos no lugar de dois pães.</strong> Mais proteína, menos carboidrato, e segura mais a fome.</li>
<li><strong>Manteiga ou no pão ou no ovo, não nos dois.</strong></li>
<li><strong>Junte uma fruta ou um café sem açúcar</strong> em vez de suco.</li>
</ul>
<p>Para saber quantos ovos por dia cabem com tranquilidade, veja <a href="/blog/quantos-ovos-por-dia">quantos ovos por dia</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come dois pães com ovo todo dia e emagrece, e gente que come um e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com o pão com ovo dentro, se você gosta dele.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>: pão francês, pão de forma integral, ovo cozido, cru e frito, manteiga</li>
<li><a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a> (1 pão francês e 1 ovo)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/quantos-ovos-por-dia">Quantos ovos por dia</a></li>
<li><a href="/blog/pao-integral-engorda">Pão integral engorda?</a></li>
<li><a href="/blog/o-que-comer-no-cafe-da-manha-para-treinar">O que comer no café da manhã para treinar</a></li>
<li><a href="/blog/o-que-comer-a-noite-para-nao-engordar">O que comer à noite para não engordar</a></li>
</ul>`,
  },
];
