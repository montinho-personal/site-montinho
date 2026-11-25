import type { BlogPost } from "./blog";

/**
 * Dois artigos da agenda de temas enviada pelo Montinho em 25/11/2026
 * (Y1 e Y2 de docs/seo/pauta.md).
 *
 * PESQUISA (SerpApi, 25/11/2026, celular, São Paulo; evidência em
 * docs/seo/serp/agenda-25-11-2026-11-25.json)
 * - Y1 "exercícios para quem dirige muito": autocompletar com "quem dirige
 *   muito" e "exercícios para quem trabalha dirigindo"; visão de IA em três
 *   blocos (alongamento nas paradas, mobilidade e força fora do carro).
 *   Orgânicos fracos (Instagram, TikTok, blog de rastreador, revista).
 * - Y2 "treino para golfe": demanda baixa (o autocompletar só traz "treino
 *   golfe"), mas a primeira página é toda de marca estrangeira traduzida
 *   (Sunday Golf, P4S, Fit For Golf, WHOOP, Hydrow, PureGym). Concorrência
 *   fraca em português e público que existe em Alphaville: entrou, curto.
 *
 * CANIBALIZAÇÃO (busca normalizada por dirig, motorista, carro, volante,
 * golf, swing): nada no acervo. Os dois linkam postura, quadril, lombar e
 * pescoço, que já existem.
 *
 * FERRAMENTA: Teste de Mobilidade nos dois (ARTIGOS_COM_TESTE_MOBILIDADE).
 * Quem dirige quer saber o que travou; quem joga golfe precisa de quadril e
 * coluna que girem.
 */

const CAPA = (slug: string, alt: string, titulo: string) =>
  `<img src="/blog-images/${slug}-capa.webp" alt="Capa: ${alt}" title="${titulo} — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>`;

const T_Y1 = "Exercícios para Quem Dirige Muito: Costas, Quadril e Pescoço";
const T_Y2 = "Treino para Golfe: Força, Rotação e Estabilidade no Swing";

export const DIRIGIR_GOLFE_POSTS: BlogPost[] = [
  {
    slug: "exercicios-para-quem-dirige-muito",
    title: T_Y1,
    metaTitle: "Exercícios para Quem Dirige Muito: Costas, Quadril e Pescoço",
    metaDescription:
      "Quem passa horas no volante sente lombar, quadril e pescoço. Veja os alongamentos para fazer nas paradas e o treino que evita a dor voltar.",
    excerpt:
      "O que horas ao volante fazem com lombar, quadril e pescoço, os alongamentos de 3 minutos para as paradas e o treino da semana que segura a dor.",
    category: "Saúde",
    date: "2026-11-25",
    readTime: "7 min",
    author: "Montinho",
    tags: ["quem dirige muito", "motorista", "mobilidade", "dor lombar", "postura"],
    faq: [
      {
        question: "Quais exercícios fazer para quem dirige muito?",
        answer:
          "Dois tipos. Nas paradas, alongamentos rápidos com o carro estacionado: pescoço, peito, rotação do tronco, panturrilha e a frente do quadril. Na semana, musculação de 2 a 3 vezes, com foco em glúteos, posteriores de coxa, costas e abdômen, que são os músculos que a posição do volante deixa fracos.",
      },
      {
        question: "Ficar muito tempo dirigindo faz mal para a coluna?",
        answer:
          "Horas na mesma posição deixam a lombar, o quadril e o pescoço rígidos e tensos, e muita gente sente dor no fim do dia. Pausas para se mexer, ajuste do banco e fortalecimento de costas e abdômen costumam ajudar. Dor forte, que não passa ou que irradia para a perna, é caso de avaliação médica.",
      },
      {
        question: "De quanto em quanto tempo parar para alongar quando se dirige?",
        answer:
          "Na estrada, aproveite cada parada para descer do carro e se mexer por alguns minutos. Na cidade, use as pausas naturais do dia (chegar ao destino, esperar alguém) em vez de passar direto do banco do carro para a cadeira do escritório. Alongar só com o carro parado e em local seguro.",
      },
      {
        question: "Quem trabalha dirigindo pode fazer musculação?",
        answer:
          "Pode e deve. A musculação é o que fortalece os músculos que ficam desligados no banco do carro. Duas sessões de 40 minutos por semana, bem feitas, já fazem diferença, e o treino pode ser encaixado antes ou depois do turno.",
      },
    ],
    content: `${CAPA("exercicios-para-quem-dirige-muito", "Exercícios para quem dirige muito. Ilustração de um volante com setas de movimento", T_Y1)}

<p><strong>Quais exercícios fazer quando se dirige muito?</strong> Dois tipos, em dois momentos. Nas paradas, alongamentos rápidos com o carro estacionado para pescoço, peito, tronco, panturrilha e a frente do quadril. E, ao longo da semana, musculação para fortalecer glúteos, costas e abdômen, os músculos que ficam desligados enquanto você está sentado ao volante. O alongamento alivia o dia; o treino é o que faz a dor parar de voltar.</p>
<p>Em Alphaville e Tamboré isso é rotina de muita gente: Castello Branco, Marginal e reuniões do outro lado da cidade somam horas de carro por dia, antes mesmo da cadeira do escritório.</p>

<h2>O que horas ao volante fazem com o corpo</h2>
<p>Dirigir é ficar sentado com algumas particularidades: o pé direito trabalha o tempo todo, os braços ficam estendidos para a frente e a atenção segura o pescoço numa posição só. Por isso as queixas mais comuns de quem dirige muito são sempre as mesmas:</p>
<ul>
<li><strong>Lombar:</strong> horas com o quadril dobrado e pouco apoio deixam a região tensa e cansada.</li>
<li><strong>Quadril:</strong> a frente do quadril fica encurtada e o glúteo passa o dia sem trabalhar. Quando você levanta, a sensação é de "travado".</li>
<li><strong>Pescoço e ombros:</strong> braços estendidos e cabeça para a frente sobrecarregam o trapézio.</li>
<li><strong>Pernas:</strong> pouco movimento deixa as pernas pesadas no fim do dia.</li>
</ul>
<p>Além da dor, há o efeito de ficar parado: em estudo publicado na Diabetes Care, interromper o tempo sentado com pausas curtas de caminhada leve deixou a glicose e a insulina mais baixas depois da refeição. A Organização Mundial da Saúde recomenda reduzir o tempo sentado e trocar parte dele por qualquer movimento, mesmo leve.</p>

<h2>Alongamentos para as paradas (3 minutos)</h2>
<p>Sempre com o carro estacionado e em local seguro: no posto, no estacionamento, ao chegar ao destino. Segure cada posição de 20 a 30 segundos, sem dor:</p>
<ol>
<li><strong>Pescoço:</strong> incline a cabeça levando a orelha em direção ao ombro, sem subir o ombro do outro lado. Dos dois lados.</li>
<li><strong>Peito e ombros:</strong> gire os ombros para trás 10 vezes e depois entrelace as mãos atrás das costas, abrindo o peito.</li>
<li><strong>Rotação do tronco:</strong> em pé, mãos na cintura, gire o tronco devagar para um lado e para o outro.</li>
<li><strong>Panturrilha:</strong> mãos apoiadas no carro, uma perna para trás com o calcanhar no chão.</li>
<li><strong>Frente do quadril:</strong> passo à frente, joelho da frente dobrado, contraia o glúteo da perna de trás e leve o quadril para a frente. É o alongamento que mais alivia quem sai do carro "travado".</li>
</ol>
<p>Se der tempo, caminhe de 5 a 10 minutos antes de voltar ao volante. Na cidade, use as pausas que já existem no dia em vez de ir direto do banco do carro para a cadeira.</p>

<h2>No carro, antes de sair</h2>
<ul>
<li>Banco perto o suficiente para os joelhos ficarem levemente dobrados ao pisar até o fim.</li>
<li>Encosto pouco inclinado, com a lombar apoiada. Uma toalha enrolada ajuda se o banco não tiver ajuste.</li>
<li>Volante numa altura em que os cotovelos fiquem dobrados, sem esticar os braços.</li>
<li>Carteira e celular fora do bolso de trás: sentar em cima deles por horas entorta o quadril.</li>
</ul>

<h2>O treino da semana que segura a dor</h2>
<p>Alongar alivia, mas quem dirige muito precisa de força nos músculos que o banco desliga. Duas ou três sessões por semana, com foco em:</p>
<ul>
<li><strong>Glúteos e posteriores de coxa:</strong> ponte de glúteo, levantamento terra romeno e <a href="/blog/agachamento-bulgaro-como-fazer">agachamento búlgaro</a>.</li>
<li><strong>Costas:</strong> remadas e puxadas, que puxam os ombros para trás.</li>
<li><strong>Abdômen:</strong> <a href="/blog/prancha-abdominal-como-fazer-e-beneficios">prancha</a> e prancha lateral, que estabilizam a lombar.</li>
<li><strong>Mobilidade:</strong> quadril e coluna torácica, de 5 a 10 minutos no começo do treino. Veja <a href="/blog/mobilidade-de-quadril">mobilidade de quadril</a>.</li>
</ul>
<p>Com aluno que passa o dia no carro, a primeira semana costuma mostrar o mesmo padrão: glúteo que demora a "acordar" na ponte e lombar que tenta fazer o trabalho dele. É ali que o treino começa, antes de colocar carga.</p>

<h2>Quando a dor não é só cansaço</h2>
<p>Dor que irradia para a perna, formigamento, perda de força ou dor que não melhora com repouso não são caso de alongamento no posto: procure avaliação médica. Veja também <a href="/blog/dor-no-ciatico-exercicio-tratamento">dor no ciático</a> e <a href="/blog/cervicalgia-dor-no-pescoco-treino">dor no pescoço</a>.</p>

<h2>Não se compare</h2>
<p>Tem gente que dirige o dia inteiro e não sente nada, e tem quem trave depois de uma hora de trânsito. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu fim de dia é um treino que caiba entre um compromisso e outro e que você mantenha por anos. Se quiser ajuda para montar esse treino e acompanhar a evolução, <a href="/consultoria-online">fale comigo</a>.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.who.int/publications/i/item/9789240015128" target="_blank" rel="noopener noreferrer">Organização Mundial da Saúde. WHO guidelines on physical activity and sedentary behaviour, 2020</a></li>
<li>Dunstan DW, et al. Breaking up prolonged sitting reduces postprandial glucose and insulin responses. Diabetes Care, 2012</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/postura-trabalho-sentado-exercicios">Postura para quem trabalha sentado</a></li>
<li><a href="/blog/quem-trabalha-sentado">Quem trabalha sentado</a></li>
<li><a href="/blog/exercicios-para-dor-nas-costas-coluna">Exercícios para dor nas costas</a></li>
</ul>`,
  },
  {
    slug: "treino-para-golfe",
    title: T_Y2,
    metaTitle: "Treino para Golfe: Força, Rotação e Estabilidade no Swing",
    metaDescription:
      "O swing pede quadril que gira, tronco estável e pernas fortes. Veja os exercícios de academia para golfe e como encaixar na semana de jogo.",
    excerpt:
      "O que o swing pede do corpo, os exercícios de força, core e mobilidade que mais ajudam no golfe e como encaixar o treino sem cansar antes do jogo.",
    category: "Treinamento",
    date: "2026-11-25",
    readTime: "6 min",
    author: "Montinho",
    tags: ["golfe", "treino para golfe", "swing", "mobilidade", "core"],
    faq: [
      {
        question: "Qual o melhor treino para golfe?",
        answer:
          "Um treino que combine força de pernas e quadril (agachamento, afundo, levantamento terra), costas (remadas), core que resiste à rotação (prancha lateral, pallof press) e mobilidade de quadril e coluna torácica. Duas a três sessões por semana bastam para a maioria dos golfistas amadores.",
      },
      {
        question: "Musculação atrapalha o swing?",
        answer:
          "Não, quando o treino inclui mobilidade e é organizado em volta dos dias de jogo. O que atrapalha é treino pesado de pernas ou costas na véspera de uma rodada, ou só exercícios de máquina sem trabalhar rotação e estabilidade.",
      },
      {
        question: "Que músculos o golfe usa?",
        answer:
          "O swing nasce nas pernas e no quadril, passa pelo tronco e chega aos braços. Glúteos, coxas, abdômen e oblíquos, costas e ombros trabalham juntos, e a coluna torácica e os quadris precisam girar bem.",
      },
      {
        question: "Dá para treinar golfe em casa?",
        answer:
          "A parte física, sim: agachamento, afundo, ponte de glúteo, prancha lateral e mobilidade de quadril e tronco não precisam de academia. O swing lento sem bola, com atenção à postura, também ajuda. A técnica fina fica com o professor de golfe.",
      },
    ],
    content: `${CAPA("treino-para-golfe", "Treino para golfe. Ilustração de um taco de golfe e uma bola com uma seta de rotação", T_Y2)}

<p><strong>Qual o melhor treino para golfe?</strong> Um treino que junte quatro coisas: pernas e quadril fortes, que é de onde sai a potência do swing; costas fortes; um core que segura a rotação em vez de girar junto; e mobilidade de quadril e coluna torácica para o giro acontecer sem a lombar compensar. Duas a três sessões por semana, organizadas em volta dos dias de jogo, resolvem para a maioria dos golfistas amadores.</p>
<p>A técnica do swing é com o professor de golfe. O que a academia faz é dar ao corpo força e amplitude para executar essa técnica com controle, rodada após rodada.</p>

<h2>O que o swing pede do corpo</h2>
<p>O swing é uma rotação rápida que começa no chão. As pernas empurram, o quadril gira primeiro, o tronco vem atrás e os braços entregam a velocidade ao taco. Para isso funcionar, o corpo precisa de três coisas:</p>
<ul>
<li><strong>Força:</strong> pernas e quadril que geram a potência.</li>
<li><strong>Estabilidade:</strong> um tronco que transfere essa força sem "vazar" na lombar.</li>
<li><strong>Mobilidade:</strong> quadris e coluna torácica que giram, para a lombar (que gira pouco) não ser forçada a fazer esse papel.</li>
</ul>

<h2>Força e potência: pernas, quadril e costas</h2>
<ul>
<li><strong>Agachamento e <a href="/blog/agachamento-bulgaro-como-fazer">agachamento búlgaro</a>:</strong> força de pernas, e o búlgaro ainda trabalha equilíbrio numa perna só.</li>
<li><strong><a href="/blog/como-fazer-levantamento-terra-corretamente">Levantamento terra</a> ou terra romeno:</strong> glúteos e posteriores de coxa, a base do giro do quadril.</li>
<li><strong>Remadas:</strong> costas fortes seguram a postura do começo ao fim do swing.</li>
<li><strong>Arremesso lateral de medicine ball contra a parede:</strong> treina a rotação com velocidade, do jeito que o swing acontece.</li>
</ul>

<h2>Core: segurar a rotação, não só girar</h2>
<p>O papel do abdômen no golfe é mais segurar do que girar. Os exercícios que mais ajudam são os que resistem à rotação:</p>
<ul>
<li><strong>Prancha lateral:</strong> 20 a 40 segundos de cada lado.</li>
<li><strong>Pallof press:</strong> em pé, de lado para o cabo ou elástico, empurre as mãos para a frente sem deixar o tronco girar.</li>
<li><strong>Bird-dog:</strong> estabilidade de lombar com braço e perna em movimento.</li>
</ul>

<h2>Mobilidade de quadril e coluna torácica</h2>
<p>De 5 a 10 minutos antes do treino e antes da rodada: rotação torácica deitado de lado (o "livro aberto"), gato e camelo, rotação interna e externa de quadril sentado e o alongamento da frente do quadril. Veja <a href="/blog/mobilidade-de-quadril">mobilidade de quadril</a>. O teste no fim deste artigo mostra quais regiões estão mais travadas em você.</p>

<h2>Como encaixar na semana de jogo</h2>
<ul>
<li>Treino de força pesado longe da rodada: pelo menos um dia de distância, de preferência dois.</li>
<li>Na véspera do jogo, só mobilidade e ativação leve.</li>
<li>No período sem torneio, dá para subir a carga; perto de um torneio, mantenha a força com menos volume.</li>
</ul>
<p>Quando acompanho alguém que joga, o ajuste vem do que a pessoa conta depois da rodada: lombar cansada no buraco 14 pede mais core e mobilidade de quadril; perna que perde estabilidade no fim pede mais força unilateral. O treino muda com o jogo.</p>

<h2>Não se compare</h2>
<p>O parceiro de jogo que bate mais longe pode ter outra idade, outro histórico esportivo e outra genética. Cada um tem a própria rotina e história, com altos e baixos. O que melhora o seu jogo é um treino que você mantenha a temporada inteira, com o corpo pronto para rodar sem dor. Se quiser ajuda para montar esse treino e acompanhar a evolução, <a href="/consultoria-online">fale comigo</a>.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/dor-lombar-na-musculacao">Dor lombar na musculação</a></li>
<li><a href="/blog/beach-tennis-e-musculacao">Beach tennis e musculação</a></li>
<li><a href="/blog/prancha-abdominal-como-fazer-e-beneficios">Prancha abdominal</a></li>
</ul>`,
  },
];
