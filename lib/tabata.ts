import type { BlogPost } from "./blog";

/**
 * "Tabata" (05/11/2026). 8.100 buscas por mês para "tabata", 880 para
 * "treino tabata" e 260 para "protocolo tabata" no Planejador de
 * Palavras-chave do Google Ads (Brasil). O site tinha HIIT, mas nenhuma
 * página do protocolo. Publicado a pedido do Montinho ANTES dos prints;
 * título, H2 e FAQ serão revistos com a pesquisa.
 *
 * O estudo: Tabata I et al., 1996, Med Sci Sports Exerc 28(10):1327-1330
 * (PMID 8897392), pelo resumo do PubMed. O número do grupo moderado
 * (53 para 58) e a atribuição dos +7 e +28% ao grupo intermitente batem com
 * os resumos secundários encontrados na busca. Grupo intermitente: 7 a 8 séries de 20 s a cerca de 170% do
 * VO2máx com 10 s de pausa, em cicloergômetro, 5 dias por semana, 6 semanas:
 * VO2máx +7 mL/kg/min e capacidade anaeróbia +28%. Grupo moderado: 70% do
 * VO2máx, 60 min, 5 dias por semana, 6 semanas: VO2máx de 53 para 58
 * mL/kg/min, sem mudança significativa na capacidade anaeróbia.
 *
 * Calorias do tabata NÃO entram em número: o gasto de 4 minutos depende da
 * intensidade real, e não achamos valor confiável. O texto diz isso.
 *
 * Ferramenta: nenhuma (ARTIGOS_SEM_FERRAMENTA). O leitor sai com um treino
 * pronto e o tempo fixo do protocolo; quem quer emagrecer vai à calculadora
 * de déficit pelo link.
 */

export const TABATA_POSTS: BlogPost[] = [
  {
    slug: "treino-tabata",
    title: "Treino Tabata: O Que É, Como Fazer e Se Emagrece",
    metaTitle: "Treino Tabata: O Que É, Como Fazer e Se Emagrece",
    metaDescription:
      "Tabata é 20 segundos de esforço máximo e 10 de pausa, 8 vezes: 4 minutos. Veja o que o estudo original mostrou, um treino pronto e quando ele ajuda a emagrecer.",
    excerpt:
      "O que é o protocolo Tabata, o que o estudo de 1996 realmente testou, como montar um treino de 4 minutos e o que esperar dele para emagrecer e para o condicionamento.",
    category: "Treino",
    date: "2026-11-05",
    readTime: "6 min",
    author: "Montinho",
    tags: ["tabata", "hiit", "treino intervalado", "cardio", "condicionamento"],
    faq: [
      {
        question: "O que é o treino tabata?",
        answer:
          "É um treino intervalado de 4 minutos: 20 segundos de esforço máximo e 10 segundos de pausa, repetidos 8 vezes. O nome vem do pesquisador japonês Izumi Tabata, que testou o protocolo num estudo publicado em 1996.",
      },
      {
        question: "Como funciona o protocolo tabata?",
        answer:
          "São 8 rodadas de 20 segundos de esforço e 10 segundos de descanso. No estudo original, o esforço era muito acima do que a pessoa aguentaria por minutos, em bicicleta, e a última rodada mal fechava os 20 segundos.",
      },
      {
        question: "Tabata emagrece?",
        answer:
          "Ajuda, mas não sozinho. Quatro minutos gastam pouco no total do dia. O que emagrece é um déficit de calorias mantido por semanas; o tabata entra como um treino curto que melhora o condicionamento e soma ao gasto da semana.",
      },
      {
        question: "Quantas calorias o tabata queima?",
        answer:
          "Não existe um número confiável. O gasto de 4 minutos depende do quanto você se esforça de verdade, do exercício e do seu peso. Desconfie de promessas de centenas de calorias em 4 minutos.",
      },
      {
        question: "Quantas vezes por semana fazer tabata?",
        answer:
          "Para a maioria das pessoas, 2 ou 3 vezes por semana, em dias que não sejam seguidos. No estudo original foram 5 dias por semana, mas com jovens ativos e acompanhamento de laboratório.",
      },
      {
        question: "Tabata é a mesma coisa que HIIT?",
        answer:
          "Tabata é um tipo de HIIT, com tempos fixos: 20 segundos de esforço e 10 de pausa, 8 vezes. HIIT é o nome geral de qualquer treino que alterna esforço forte e pausa.",
      },
      {
        question: "Iniciante pode fazer tabata?",
        answer:
          "Pode fazer uma versão adaptada: exercícios simples, intensidade que dê para controlar e menos rodadas no começo. Quem tem problema de coração, pressão alta sem controle ou dor articular deve falar com o médico antes de treinar em intensidade máxima.",
      },
    ],
    content: `<img src="/blog-images/treino-tabata-capa.webp" alt="Capa: Treino Tabata. 20 segundos, 10 de pausa. Ilustração de cronômetro e pessoa pedalando" title="Treino Tabata — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>O <strong>treino tabata</strong> são 4 minutos: 20 segundos de esforço máximo, 10 segundos de pausa, 8 vezes. Parece pouco, e é. A diferença está no "máximo": o protocolo original era tão forte que a última rodada mal fechava. O que muita aula chama de tabata é outra coisa, mais leve, e funciona de outro jeito.</p>

<h2>O que é o treino tabata?</h2>
<p>É um treino intervalado de alta intensidade, um tipo de HIIT, com tempos fixos: <strong>20 segundos de esforço e 10 segundos de descanso, repetidos 8 vezes</strong>, num total de 4 minutos. O nome vem do pesquisador japonês Izumi Tabata, que publicou o estudo do protocolo em 1996.</p>

<h2>O que o estudo original mostrou</h2>
<p>O estudo comparou dois grupos de homens jovens e ativos durante 6 semanas, 5 dias por semana, em bicicleta ergométrica:</p>
<table>
<thead><tr><th></th><th>Grupo intervalado (tabata)</th><th>Grupo moderado</th></tr></thead>
<tbody>
<tr><td>Treino</td><td>7 a 8 séries de 20 s a cerca de 170% do VO2máx, com 10 s de pausa</td><td>60 min a 70% do VO2máx</td></tr>
<tr><td>VO2máx</td><td>subiu cerca de 7 mL/kg/min</td><td>subiu de 53 para 58 mL/kg/min</td></tr>
<tr><td>Capacidade anaeróbia</td><td>subiu 28%</td><td>sem mudança significativa</td></tr>
</tbody>
</table>
<p>O ponto que costuma se perder: <strong>170% do VO2máx</strong> é um esforço muito acima do que alguém aguenta por minutos. Não é um polichinelo animado. É o tipo de sprint em que você termina a última rodada sem conseguir manter o ritmo. Com intensidade menor, o treino ainda vale, mas não é o mesmo estímulo do estudo.</p>

<h2>Como fazer um treino tabata</h2>
<ol>
<li><strong>Aqueça de 5 a 10 minutos.</strong> Intensidade máxima com o corpo frio é pedir lesão.</li>
<li><strong>Escolha um exercício que dê para fazer forte e com segurança.</strong> Bicicleta ergométrica é o mais próximo do estudo. Corrida na esteira, remo e air bike também servem.</li>
<li><strong>Use um cronômetro de intervalos.</strong> 20 segundos de esforço, 10 de pausa, 8 rodadas. Contar de cabeça no meio do cansaço não funciona.</li>
<li><strong>Desacelere no fim.</strong> Mais 5 minutos leves para o coração e a respiração voltarem.</li>
</ol>

<h2>Exemplo de treino tabata</h2>
<p>Para quem não tem bicicleta, um tabata com o peso do corpo, alternando dois exercícios:</p>
<table>
<thead><tr><th>Rodada</th><th>20 segundos</th><th>10 segundos</th></tr></thead>
<tbody>
<tr><td>1, 3, 5, 7</td><td>Polichinelo ou corrida parada, o mais rápido que conseguir</td><td>Pausa</td></tr>
<tr><td>2, 4, 6, 8</td><td>Agachamento livre, rápido e com amplitude</td><td>Pausa</td></tr>
</tbody>
</table>
<p>Com o peso do corpo, é difícil chegar perto da intensidade do estudo; o treino fica mais para condicionamento geral. Está tudo bem: só não espere o mesmo resultado do laboratório.</p>

<h2>Tabata emagrece?</h2>
<p>Ajuda, mas não sozinho. <strong>Quatro minutos gastam pouco no total do dia</strong>, mesmo em esforço máximo. O que faz emagrecer é um déficit de calorias mantido por semanas: comer um pouco menos do que você gasta. O tabata entra como um treino curto que melhora o condicionamento e soma ao gasto da semana, e não como um atalho.</p>
<p>Não há um número confiável de calorias para o tabata. O gasto depende do quanto você se esforça de verdade, do exercício e do seu peso. Desconfie de promessas de centenas de calorias em 4 minutos. Para saber o seu ponto de partida, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Quantas vezes por semana fazer tabata?</h2>
<p>No estudo foram 5 dias por semana, mas com jovens ativos e supervisão de laboratório. Na vida real, <strong>2 ou 3 vezes por semana</strong>, em dias não seguidos, costuma ser o suficiente. Como é curto, cabe no fim do treino de musculação, desde que não seja no dia de perna pesada.</p>

<h2>Tabata ou HIIT: qual a diferença?</h2>
<p>Todo tabata é HIIT, mas nem todo HIIT é tabata. HIIT é o nome geral de qualquer treino que alterna esforço forte e pausa, com tempos que variam: 30 segundos e 30 segundos, 1 minuto e 2 minutos, e assim por diante. O tabata tem os tempos fixos e o esforço máximo. Veja mais em <a href="/blog/hiit-funciona">HIIT funciona?</a> e no <a href="/blog/treino-hiit-em-casa">treino HIIT em casa</a>.</p>

<h2>Quem deve tomar cuidado</h2>
<p>Esforço máximo pede um corpo preparado. Quem está começando pode fazer uma versão adaptada, com menos rodadas e intensidade que dê para controlar. Quem tem problema de coração, pressão alta sem controle, dor articular ou volta de lesão deve falar com o médico antes de treinar no limite.</p>

<h2>Não se compare</h2>
<p>Tem gente que termina o tabata deitada no chão e gente que acha leve. Se achou leve, provavelmente não foi tabata. E se não consegue fazer as 8 rodadas, comece com 4. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o condicionamento é repetir o treino por semanas, não vencer o colega da aula.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://pubmed.ncbi.nlm.nih.gov/8897392/" target="_blank" rel="noopener noreferrer">Tabata I et al. Effects of moderate-intensity endurance and high-intensity intermittent training on anaerobic capacity and VO2max. Med Sci Sports Exerc, 1996 (PubMed)</a></li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/hiit-funciona">HIIT funciona?</a></li>
<li><a href="/blog/treino-hiit-em-casa">Treino HIIT em casa</a></li>
<li><a href="/blog/quanto-de-cardio-fazer">Quanto de cardio fazer</a></li>
<li><a href="/blog/cardio-antes-ou-depois-da-musculacao">Cardio antes ou depois da musculação</a></li>
</ul>`,
  },
];
