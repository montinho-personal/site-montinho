import type { BlogPost } from "./blog";

/**
 * "Macarrão engorda?" (16/11/2026). Item da pauta (docs/seo/pauta.md),
 * 5.400 buscas/mês no Planejador (Brasil). Pedido do Montinho: "pode criar
 * próximo artigo".
 *
 * Canibalização (sem acento e sem hífen): só a ficha de alimento
 * `macarrao-trigo-cru` e o instantâneo; nenhum artigo. Vizinhos linkados:
 * arroz, feijão, pão com ovo, o que comer à noite, 1 kg de gordura.
 *
 * Pesquisa no SerpApi (celular, São Paulo): "macarrão engorda". Evidência em
 * docs/seo/serp/macarrao-engorda-2026-11-16.json.
 *
 * Números: TACO 4ª edição, pela base do site, por 100 g.
 * - Macarrão de trigo cru: 371 kcal, 77,9 g carboidrato, 10,0 g proteína,
 *   1,3 g gordura. Com ovos, cru: 371 kcal. A TACO NÃO tem macarrão comum
 *   cozido nem macarrão integral; a base não tem medida caseira do macarrão
 *   comum. Por isso a conta é pelo peso cru (o do pacote e do rótulo):
 *   80, 100 e 120 g são exemplos nossos (297, 371 e 445 kcal).
 * - Arroz tipo 1 cru 358 kcal; cozido 128.
 * - Macarrão instantâneo (seco): 436 kcal, 17,2 g gordura, 1.516 mg sódio.
 * - Macarrão com molho à bolonhesa (prato pronto): 119,5 kcal; 300 g é
 *   exemplo nosso (359 kcal).
 * - Acompanhamentos: molho de tomate industrializado 38 kcal (100 g: 38);
 *   queijo parmesão 453 (10 g: 45); creme de leite 221 (50 g: 111); óleo de
 *   soja 884 (10 g: 88); sardinha em conserva em óleo 285 (50 g: 143); acém
 *   moído cozido 212 (100 g: 212); ovo cozido 146, unidade de 45 g pela POF
 *   (66 kcal).
 * - 1 kg de gordura ≈ 7.700 kcal (KCAL_POR_KG_GORDURA do site).
 *
 * Ferramenta: cartão de link da Calculadora de Déficit (ARTIGOS_COM_LINK_DEFICIT)
 * e ficha de alimento (FICHAS_POR_ARTIGO).
 *
 * Capa: sem crédito do Kairogen em 16/11; publicado sem capa e anotado em
 * "Capas pendentes" (AGENTS.md, "Capa de artigo: só no padrão, ou nenhuma").
 */

const TACO = `<a href="https://www.cfn.org.br/wp-content/uploads/2017/03/taco_4_edicao_ampliada_e_revisada.pdf" target="_blank" rel="noopener noreferrer">TACO — Tabela Brasileira de Composição de Alimentos, 4ª edição (NEPA/Unicamp)</a>`;
const IBGE = `<a href="https://biblioteca.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE — POF 2008-2009, Tabela de Medidas Referidas para os Alimentos Consumidos no Brasil</a>`;

export const MACARRAO_ENGORDA_POSTS: BlogPost[] = [
  {
    slug: "macarrao-engorda",
    title: "Macarrão Engorda? Calorias, Mais que Arroz e à Noite",
    metaTitle: "Macarrão Engorda? Calorias, Mais que Arroz e à Noite",
    metaDescription:
      "100 g de macarrão cru têm 371 kcal, quase o mesmo que o arroz cru. Veja se macarrão engorda, à noite, com sardinha, ovo ou carne moída, e o que pesa no prato.",
    excerpt:
      "Quantas calorias tem o macarrão, se engorda mais que arroz, à noite, quantos quilos um prato engorda, o peso de cada molho e acompanhamento e como montar um prato que cabe no dia.",
    category: "Nutrição",
    date: "2026-11-16",
    readTime: "7 min",
    author: "Montinho",
    tags: ["macarrao", "calorias", "carboidrato", "arroz", "dieta"],
    faq: [
      {
        question: "Macarrão engorda?",
        answer:
          "Sozinho, não. Ele engorda se o total do dia passar do seu gasto por semanas, como qualquer alimento. O que costuma pesar no prato de macarrão é a quantidade de massa e o que vai por cima: creme de leite, queijo, óleo e embutidos.",
      },
      {
        question: "Macarrão engorda mais que arroz?",
        answer:
          "Quase o mesmo. Crus, os dois ficam perto: 371 kcal em 100 g de macarrão de trigo e 358 kcal em 100 g de arroz branco, pela TACO. A diferença real está na porção e no molho, que no macarrão costuma ser mais calórico.",
      },
      {
        question: "Macarrão engorda à noite?",
        answer:
          "O horário não engorda. O que conta é o total do dia. Um prato de macarrão no jantar cabe no dia de muita gente, desde que a porção e o molho estejam na medida.",
      },
      {
        question: "Macarrão engorda quantos quilos?",
        answer:
          "Um prato não engorda quilos. Um quilo de gordura equivale a cerca de 7.700 kcal acima do que você gasta. Um prato de 100 g de macarrão cru com molho de tomate fica perto de 410 kcal. O peso que sobe na balança no dia seguinte é, em grande parte, água e o próprio alimento no intestino.",
      },
      {
        question: "Quantas calorias tem 2 pratos de macarrão?",
        answer:
          "Depende do tamanho do prato e do molho. Dois pratos com 80 g de macarrão cru cada dão cerca de 594 kcal só de massa. Com molho de tomate, passa de 650 kcal; com creme de leite e queijo, pode passar de 900.",
      },
      {
        question: "Quantas calorias tem 100 g de macarrão integral?",
        answer:
          "A TACO não traz o macarrão integral. O valor certo está no rótulo do pacote, que muda de marca para marca. Compare com o comum (371 kcal em 100 g cru) sempre pelo peso cru.",
      },
      {
        question: "Miojo engorda mais que macarrão comum?",
        answer:
          "Por grama, sim. O macarrão instantâneo seco tem 436 kcal e 17,2 g de gordura em 100 g, contra 371 kcal e 1,3 g do macarrão comum cru, porque é pré-frito. Também tem muito sódio: 1.516 mg em 100 g, sem contar o tempero do sachê.",
      },
      {
        question: "Macarrão com sardinha engorda?",
        answer:
          "Depende da quantidade. 50 g de sardinha em óleo somam cerca de 143 kcal ao prato e trazem proteína. Escorrer bem o óleo da lata ajuda a não somar gordura à toa.",
      },
    ],
    content: `<p><strong>Macarrão engorda?</strong> Sozinho, não. Cru, ele tem praticamente as mesmas calorias que o arroz cru. O que transforma um prato de macarrão numa refeição pesada é a quantidade de massa e o que vai por cima: creme de leite, queijo, óleo e embutidos.</p>

<h2>Quantas calorias tem o macarrão?</h2>
<table>
<thead><tr><th>Macarrão de trigo (peso cru)</th><th>Calorias</th><th>Carboidrato</th><th>Proteína</th></tr></thead>
<tbody>
<tr><td>80 g</td><td>cerca de 297 kcal</td><td>62 g</td><td>8 g</td></tr>
<tr><td><strong>100 g</strong></td><td><strong>cerca de 371 kcal</strong></td><td>78 g</td><td>10 g</td></tr>
<tr><td>120 g</td><td>cerca de 445 kcal</td><td>93 g</td><td>12 g</td></tr>
</tbody>
</table>
<p>Valores da TACO, a Tabela Brasileira de Composição de Alimentos. A TACO não traz o macarrão comum cozido, e a tabela de medidas caseiras do IBGE não tem porção de macarrão comum. Por isso a conta é pelo <strong>peso cru</strong>, o mesmo do pacote e do rótulo: pese a massa seca antes de cozinhar. Os pesos acima são exemplos nossos. A ficha do macarrão está no fim do artigo.</p>

<h2>Macarrão engorda mais que arroz?</h2>
<p>Quase o mesmo. Na comparação justa, cru com cru, os dois ficam perto:</p>
<table>
<thead><tr><th>100 g crus</th><th>Calorias</th><th>Carboidrato</th><th>Proteína</th></tr></thead>
<tbody>
<tr><td>Macarrão de trigo</td><td>371 kcal</td><td>77,9 g</td><td>10,0 g</td></tr>
<tr><td>Arroz branco tipo 1</td><td>358 kcal</td><td>78,8 g</td><td>7,2 g</td></tr>
</tbody>
</table>
<p>O macarrão tem um pouco mais de proteína. A diferença no dia a dia vem da porção (um prato de macarrão costuma ter mais massa que a porção de arroz ao lado do feijão) e do molho. Para o arroz, veja <a href="/blog/arroz-engorda">arroz engorda?</a>. Com feijão junto, o prato ganha fibra e proteína; veja <a href="/blog/feijao-engorda">feijão engorda?</a>.</p>

<h2>O que vai no prato muda tudo</h2>
<table>
<thead><tr><th>Junto com o macarrão</th><th>Calorias a mais</th></tr></thead>
<tbody>
<tr><td>100 g de molho de tomate pronto</td><td>cerca de 38 kcal</td></tr>
<tr><td>1 ovo cozido (45 g)</td><td>cerca de 66 kcal</td></tr>
<tr><td>10 g de queijo parmesão</td><td>cerca de 45 kcal</td></tr>
<tr><td>10 g de óleo ou azeite (alho e óleo)</td><td>cerca de 88 kcal</td></tr>
<tr><td>50 g de creme de leite</td><td>cerca de 111 kcal</td></tr>
<tr><td>50 g de sardinha em óleo</td><td>cerca de 143 kcal</td></tr>
<tr><td>100 g de carne moída (acém, cozida)</td><td>cerca de 212 kcal</td></tr>
</tbody>
</table>
<p>Valores da TACO; o peso do ovo é o da pesquisa de orçamentos do IBGE, e as outras quantidades são exemplos nossos.</p>
<ul>
<li><strong>Molho de tomate:</strong> é o mais leve. Um prato ao sugo quase não soma.</li>
<li><strong>Alho e óleo:</strong> o alho não pesa; o óleo, sim. Meça a colher.</li>
<li><strong>Molho branco e quatro queijos:</strong> creme de leite e queijo somam rápido. É aqui que um prato de 400 kcal vira de 700.</li>
<li><strong>Carne moída, ovo e sardinha:</strong> somam calorias, mas trazem proteína, que segura a fome. Prefira carne mais magra e escorra o óleo da sardinha.</li>
</ul>
<p>Pronto à bolonhesa, o prato tem perto de 120 kcal em 100 g pela TACO: um prato de 300 g (exemplo nosso) fica perto de 359 kcal.</p>

<h2>Macarrão engorda à noite?</h2>
<p>O horário não engorda. O que conta é o total do dia. Um prato de macarrão no jantar cabe no dia de muita gente, se a porção e o molho estiverem na medida. Se a fome da noite é o problema, veja <a href="/blog/o-que-comer-a-noite-para-nao-engordar">o que comer à noite para não engordar</a>.</p>

<h2>Macarrão engorda quantos quilos?</h2>
<p>Um prato não engorda quilos. Um quilo de gordura equivale a cerca de <strong>7.700 kcal acima do que você gasta</strong>, e um prato de 100 g de macarrão cru com molho de tomate fica perto de 410 kcal. Se a balança sobe no dia seguinte a um macarrão, é em grande parte água e o próprio alimento no intestino, não gordura. A conta está em <a href="/blog/quantas-calorias-tem-1kg-de-gordura">quantas calorias tem 1 kg de gordura</a>.</p>

<h2>Miojo engorda mais?</h2>
<p>Por grama, sim. O macarrão instantâneo é pré-frito: seco, tem <strong>436 kcal e 17,2 g de gordura</strong> em 100 g, contra 371 kcal e 1,3 g do macarrão comum cru. E tem muito sódio: 1.516 mg em 100 g, sem contar o tempero do sachê. Dá para comer de vez em quando; como base da semana, o macarrão comum sai na frente.</p>

<h2>Macarrão integral ou de arroz?</h2>
<p>A TACO não traz nenhum dos dois, então a resposta está no rótulo de cada pacote, pelo peso cru. Compare com os 371 kcal em 100 g do macarrão comum e olhe também a fibra. O de arroz serve para quem não come glúten; ser de arroz não o torna mais leve por si só.</p>

<h2>Como montar um prato de macarrão que cabe no dia</h2>
<ul>
<li><strong>Pese a massa crua</strong> pelo menos nas primeiras vezes, para saber quanto é o seu prato.</li>
<li><strong>Prefira molho de tomate</strong> e deixe molho branco e quatro queijos para de vez em quando.</li>
<li><strong>Junte uma proteína</strong>: frango, carne moída magra, ovo ou sardinha escorrida.</li>
<li><strong>Ponha legumes no prato</strong> (abobrinha, brócolis, cenoura): mais volume, poucas calorias.</li>
<li><strong>Sirva um prato só</strong>, em vez de comer direto da panela.</li>
</ul>
<p>Para saber quantas calorias cabem no seu dia, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que come macarrão toda semana e emagrece, e gente que corta e não sai do lugar. A diferença está no resto do dia, no gasto e na história de cada um. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de comer que dê para manter, com o que você gosta dentro, na medida.</p>

<h2>Fontes</h2>
<ul>
<li>${TACO}: macarrão de trigo cru, macarrão de trigo cru com ovos, macarrão instantâneo, macarrão com molho à bolonhesa, arroz tipo 1 cru, molho de tomate industrializado, queijo parmesão, creme de leite, óleo de soja, sardinha em conserva em óleo, acém moído cozido, ovo cozido</li>
<li>${IBGE} (unidade de ovo)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/arroz-engorda">Arroz engorda?</a></li>
<li><a href="/blog/feijao-engorda">Feijão engorda?</a></li>
<li><a href="/blog/pao-com-ovo-engorda">Pão com ovo engorda?</a></li>
<li><a href="/blog/cuscuz-engorda">Cuscuz engorda?</a></li>
</ul>`,
  },
];
