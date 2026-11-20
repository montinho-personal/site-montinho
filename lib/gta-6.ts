import type { BlogPost } from "./blog";

/**
 * Dois artigos no gancho do lançamento do GTA 6 (19/11/2026), pedidos pelo
 * Montinho em 20/11/2026 (G2 e G3 de docs/seo/pauta.md).
 *
 * PESQUISA
 * - G2 "gta-6-tem-academia": a busca "gta 6 vai ter academia" já tinha sido
 *   feita no SerpApi em 20/11 pela sessão do Personal por Perto (mesma conta,
 *   celular, São Paulo). Não foi repetida (regra da cota); o JSON foi copiado
 *   para docs/seo/serp/gta-6-academia-e-videogame-2026-11-20.json.
 * - G3 "jogar-videogame-muito-tempo-faz-mal": busca nova no SerpApi
 *   (página, autocompletar e visão de IA em duas etapas), no mesmo JSON.
 *
 * CANIBALIZAÇÃO (busca normalizada por gta, videogame, game, jogo, sentado,
 * sedentar, postura)
 * - jogar-videogame-gasta-calorias responde o gasto do jogo; aqui G2 é o
 *   corpo do personagem e G3 é o que horas de jogo fazem com o corpo. Os três
 *   se linkam.
 * - quem-trabalha-sentado e postura-trabalho-sentado-exercicios são do
 *   trabalho; G3 é a busca de quem joga ("jogar videogame muito tempo faz
 *   mal"), e linka os dois para o detalhe de postura.
 *
 * FONTES DO JOGO: só o que dois veículos independentes publicaram (academia,
 * treino muda o músculo, comida muda o peso, sono e farra mudam a aparência).
 * Nome de quem disse, números internos do jogo e detalhes de vídeo de fã
 * ficaram de fora. Os sites dos veículos não abriram neste ambiente; a
 * conferência foi feita pelos títulos e resumos indexados de cada um.
 *
 * FERRAMENTA
 * - G2: link da Calculadora de Déficit (ARTIGOS_COM_LINK_DEFICIT): o leitor
 *   sai com "quanto eu gasto e quanto como", a barra que o personagem tem e
 *   ele não.
 * - G3: Teste de Mobilidade (ARTIGOS_COM_TESTE_MOBILIDADE): quem passa horas
 *   sentado quer saber o que travou.
 */

const CAPA = (slug: string, alt: string, titulo: string) =>
  `<img src="/blog-images/${slug}-capa.webp" alt="Capa: ${alt}" title="${titulo} — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>`;

const NAO_SE_COMPARE = (gancho: string) => `<h2>Não se compare</h2>
<p>${gancho} Cada um tem a própria genética, rotina e história, com altos e baixos. O que dá resultado é achar um jeito de treinar que caiba na sua vida, inclusive nas noites de jogo, e manter isso por anos, subindo um pouco de cada vez. Se quiser ajuda para montar esse treino e acompanhar a evolução, <a href="/consultoria-online">fale comigo</a>.</p>`;

const T_G2 = "GTA 6 Tem Academia? O Treino do Jogo e o da Vida Real";
const T_G3 = "Jogar Videogame Muito Tempo Faz Mal? O Que Acontece com o Corpo";

export const GTA_6_POSTS: BlogPost[] = [
  {
    slug: "gta-6-tem-academia",
    title: T_G2,
    metaTitle: "GTA 6 Tem Academia? O Treino do Jogo e o da Vida Real",
    metaDescription:
      "Tem: no GTA 6, treino, comida e sono mudam o corpo de Jason e Lucia. Veja o que foi confirmado e quanto tempo o mesmo resultado leva fora do jogo.",
    excerpt:
      "O que se sabe da academia do GTA 6, como treino, comida e sono mudam Jason e Lucia, e o que disso funciona igual na vida real (e em quanto tempo).",
    category: "Treinamento",
    date: "2026-11-20",
    readTime: "5 min",
    author: "Montinho",
    tags: ["GTA 6", "videogame", "academia", "hipertrofia", "sono"],
    faq: [
      {
        question: "GTA 6 vai ter academia?",
        answer:
          "Tem. Antes do lançamento, em 19 de novembro de 2026, veículos como LADbible e IBTimes UK noticiaram que Jason e Lucia podem treinar e que o corpo dos dois muda com o que o jogador faz: exercício ganha músculo, comida em excesso aumenta o peso e falta de sono pesa na aparência.",
      },
      {
        question: "Tem academia no GTA?",
        answer:
          "No GTA 6, sim, e a ideia lembra o GTA San Andreas, de 2004, em que o personagem também ganhava músculo ou gordura conforme treinava e comia. Os veículos que cobriram a prévia do GTA 6 trataram a mecânica justamente como a volta desse sistema.",
      },
      {
        question: "Lucia do GTA 6 vai para a academia?",
        answer:
          "Vai: os dois protagonistas, Jason e Lucia, podem treinar, e o corpo de ambos responde a treino, comida e sono, segundo a cobertura da prévia do jogo.",
      },
      {
        question: "Em quanto tempo dá para ter o corpo do personagem na vida real?",
        answer:
          "Não dá para prometer prazo, porque depende de genética, histórico de treino, sono e alimentação. O que a ciência mostra é que as primeiras semanas de treino ganham força mais pelo sistema nervoso do que por músculo novo, e o músculo visível costuma levar meses de treino com carga subindo aos poucos.",
      },
      {
        question: "O que o GTA 6 acerta sobre ganhar músculo?",
        answer:
          "A lista: treino, comida e sono são mesmo os três fatores que mudam um corpo. O que o jogo encurta é o tempo. Num estudo com adultos em dieta, quem dormiu 5,5 horas por noite perdeu menos gordura e mais massa magra do que quem dormiu 8,5 horas, comendo a mesma coisa.",
      },
    ],
    content: `${CAPA("gta-6-tem-academia", "GTA 6 tem academia? O treino do jogo e o da vida real. Ilustração de um controle de videogame ao lado de um halter", T_G2)}

<p><strong>Tem.</strong> No GTA 6, lançado em 19 de novembro de 2026, Jason e Lucia podem treinar, e o corpo dos dois muda com o que você faz no jogo: exercício ganha músculo, comida demais aumenta o peso e noites sem dormir aparecem no visual. Abaixo, o que foi noticiado antes do lançamento e quanto disso funciona igual na vida real, com o olhar de quem passa o dia dentro de academia.</p>

<h2>O que se sabe da academia do GTA 6</h2>
<p>Na cobertura da prévia do jogo, veículos como <strong>LADbible</strong> e <strong>IBTimes UK</strong> descreveram o mesmo sistema:</p>
<ul>
<li><strong>Treino muda o corpo:</strong> exercício faz Jason e Lucia ganharem músculo.</li>
<li><strong>Comida conta:</strong> comer em excesso aumenta o peso do personagem.</li>
<li><strong>Sono e farra também:</strong> dormir pouco e exagerar na noite pesam na aparência.</li>
</ul>
<p>A ideia lembra o GTA San Andreas, de 2004, em que o personagem também engordava ou ganhava músculo conforme o jogador decidia. Detalhes como quantas idas à academia mudam o corpo, que exercícios existem e quais números o jogo usa por trás não foram publicados oficialmente, então ficam fora deste texto.</p>

<h2>No jogo x na vida real</h2>
<p>O jogo acertou os três botões. Treino, comida e sono são mesmo o que muda um corpo. A diferença é o relógio.</p>

<h3>Músculo: semanas para a força, meses para o espelho</h3>
<p>No jogo, algumas sessões já aparecem no personagem. Fora dele, o começo é diferente: nas primeiras semanas de treino, quase todo o ganho de força vem do sistema nervoso aprendendo a recrutar o músculo, e não de músculo novo, como mostrou o estudo clássico de Moritani e deVries. O músculo que aparece no espelho leva meses, e só continua se a carga ou as repetições subirem aos poucos, o princípio que o American College of Sports Medicine chama de progressão.</p>
<p>Na prática, é aqui que muita gente desiste: você treina três semanas, fica mais forte, olha no espelho e não vê nada. Está funcionando. Os prazos realistas, com estudos, estão em <a href="/blog/quanto-tempo-para-ganhar-massa-muscular">quanto tempo para ganhar massa muscular</a>.</p>

<h3>Comida: a conta é a mesma</h3>
<p>"Comer demais engorda o personagem" é o superávit calórico em versão de videogame. Na vida real vale igual nos dois sentidos: comer acima do que se gasta faz o peso subir, comer abaixo faz descer. A diferença é que Jason e Lucia têm a barra na tela, e você não. Para ter uma estimativa de quanto o seu dia gasta, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>. O plano alimentar em si é com o nutricionista; o treino caminha junto com ele.</p>

<h3>Sono: aqui o jogo está certo</h3>
<p>O jogo fez o sono pesar, e a ciência concorda. Num estudo publicado no Annals of Internal Medicine, adultos em dieta que dormiram 5,5 horas por noite perderam menos gordura e mais massa magra do que quando dormiram 8,5 horas, comendo a mesma coisa. Para quem treina, sono curto atrapalha justamente o que se está tentando ganhar. Veja <a href="/blog/quantas-horas-de-sono-para-ganhar-massa-e-emagrecer">quantas horas de sono para ganhar massa e emagrecer</a>.</p>

<h2>O personagem treina, e você?</h2>
<p>A ironia da semana de lançamento: Jason e Lucia vão para a academia enquanto quem joga passa horas no sofá. Uma hora de jogo sentado gasta quase o mesmo que ficar parado; a conta está em <a href="/blog/jogar-videogame-gasta-calorias">jogar videogame gasta calorias</a>. E o que muitas horas de jogo fazem com costas, pescoço e sono está em <a href="/blog/jogar-videogame-muito-tempo-faz-mal">jogar videogame muito tempo faz mal</a>.</p>
<p>Dá para fazer as duas coisas. Três treinos de musculação por semana cabem na rotina de quem joga à noite, e começar é mais simples do que parece: <a href="/blog/hipertrofia-para-iniciantes">hipertrofia para iniciantes</a>.</p>

${NAO_SE_COMPARE("Não se compare com o Jason, com a Lucia nem com ninguém da academia: o personagem foi desenhado, você não.")}

<p><strong>Resumindo:</strong> o GTA 6 tem academia, e o corpo de Jason e Lucia muda com treino, comida e sono, como o seu. O que o jogo mostra numa tarde, a vida real entrega em meses de constância.</p>

<h2>Fontes</h2>
<ul>
<li>LADbible. New GTA 6 gameplay preview has players "getting fat" as controversial feature returns, 27/08/2026</li>
<li>IBTimes UK. GTA 6 gameplay takes realism to new level as diet and sleep transform Jason and Lucia, 2026</li>
<li>Moritani T, deVries HA. Neural factors versus hypertrophy in the time course of muscle strength gain. American Journal of Physical Medicine, 1979</li>
<li>American College of Sports Medicine. Progression models in resistance training for healthy adults. Medicine &amp; Science in Sports &amp; Exercise, 2009</li>
<li>Nedeltcheva AV, et al. Insufficient sleep undermines dietary efforts to reduce adiposity. Annals of Internal Medicine, 2010</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/jogar-videogame-gasta-calorias">Jogar videogame gasta calorias?</a></li>
<li><a href="/blog/jogar-videogame-muito-tempo-faz-mal">Jogar videogame muito tempo faz mal?</a></li>
<li><a href="/blog/quanto-tempo-para-ganhar-massa-muscular">Quanto tempo para ganhar massa muscular</a></li>
</ul>`,
  },
  {
    slug: "jogar-videogame-muito-tempo-faz-mal",
    title: T_G3,
    metaTitle: "Jogar Videogame Muito Tempo Faz Mal? O Que Acontece",
    metaDescription:
      "O problema de uma maratona de jogo não é o videogame, é o corpo parado por horas. Veja o que acontece e a pausa de 5 minutos que os estudos indicam.",
    excerpt:
      "O que horas seguidas de videogame fazem com o corpo (costas, pescoço, punho, glicose e sono), quando o jogo vira problema e a pausa simples entre partidas.",
    category: "Saúde",
    date: "2026-11-20",
    readTime: "6 min",
    author: "Montinho",
    tags: ["videogame", "sedentarismo", "postura", "pausa ativa", "GTA 6"],
    faq: [
      {
        question: "Jogar videogame muito tempo faz mal?",
        answer:
          "O jogo em si não. O que pesa é o que vem junto com muitas horas seguidas: o corpo parado, a postura curvada, o sono que encurta e, às vezes, o jogo tomando o lugar de outras coisas. A Organização Mundial da Saúde recomenda reduzir o tempo sentado e trocar parte dele por qualquer movimento, mesmo leve.",
      },
      {
        question: "Quanto tempo de videogame por dia faz mal?",
        answer:
          "Não existe um número oficial de horas de jogo para adultos. O que os estudos mostram é que longos períodos sentados sem pausa pioram a resposta do corpo à comida, e que interromper com alguns minutos de movimento a cada 20 a 30 minutos ajuda. O sinal de alerta é o jogo atrapalhar sono, trabalho, estudo ou relações.",
      },
      {
        question: "Quais são os pontos negativos de jogar muito videogame?",
        answer:
          "Os mais comuns: muitas horas com o corpo parado, dor nas costas, no pescoço ou no punho pela posição, sono mais curto quando a partida entra pela madrugada e, em alguns casos, perda de controle sobre o tempo de jogo, que a OMS reconhece como transtorno na CID-11.",
      },
      {
        question: "Jogar videogame causa dor nas costas?",
        answer:
          "Horas na mesma posição, com o tronco curvado e o pescoço para a frente, deixam as costas e o pescoço tensos. Levantar a cada partida, ajustar a tela à altura dos olhos e fortalecer costas e abdômen na semana costumam ajudar. Dor forte, que não passa ou que irradia para braço ou perna, é caso de avaliação médica.",
      },
      {
        question: "Vício em videogame é doença?",
        answer:
          "A Organização Mundial da Saúde incluiu o transtorno de jogo (gaming disorder) na CID-11. Ele não é definido pelas horas jogadas, e sim pela perda de controle: o jogo passa na frente de outras atividades e continua mesmo trazendo prejuízo, em geral por pelo menos um ano. Quem se reconhece nisso deve procurar um profissional de saúde mental.",
      },
      {
        question: "Fazer exercício compensa as horas jogando?",
        answer:
          "Em boa parte, sim. Uma análise com mais de 1 milhão de adultos, publicada na revista The Lancet, mostrou que 60 a 75 minutos por dia de atividade moderada praticamente eliminaram o risco extra ligado a ficar muitas horas sentado. Para quem passava muitas horas em frente à TV, o risco diminuiu, mas não sumiu.",
      },
    ],
    content: `${CAPA("jogar-videogame-muito-tempo-faz-mal", "Jogar videogame muito tempo faz mal? Ilustração de um controle de videogame e de um relógio com uma pausa marcada", T_G3)}

<p><strong>Jogar videogame muito tempo faz mal?</strong> O videogame em si, não. O que pesa numa maratona de jogo é o que vem junto: horas com o corpo parado, costas e pescoço na mesma posição, sono que encurta quando a partida entra pela madrugada. A boa notícia é que a parte do corpo se resolve com pouco: uma pausa curta de movimento a cada 20 ou 30 minutos já muda a resposta do organismo, como mostram estudos de laboratório.</p>
<p>Com o GTA 6 lançado em 19 de novembro de 2026, a pergunta é da semana. Abaixo, o que acontece com o corpo, quando o jogo vira problema e a pausa que eu passaria para um aluno que joga.</p>

<h2>O que acontece com o corpo depois de horas jogando</h2>
<p>Jogar sentado gasta quase o mesmo que ficar parado vendo TV (a conta, por peso, está em <a href="/blog/jogar-videogame-gasta-calorias">jogar videogame gasta calorias</a>). Do ponto de vista do corpo, uma maratona de jogo é uma longa sessão sentado, com três efeitos principais:</p>
<ul>
<li><strong>Metabolismo parado:</strong> em estudo publicado na Diabetes Care, adultos que interromperam o tempo sentado com 2 minutos de caminhada leve a cada 20 minutos tiveram glicose e insulina mais baixas depois da refeição do que quando ficaram sentados direto.</li>
<li><strong>Costas, pescoço e punho:</strong> horas com o tronco curvado, a cabeça para a frente e o punho na mesma posição deixam tudo tenso e rígido. Veja <a href="/blog/exercicios-para-dor-nas-costas-coluna">exercícios para dor nas costas</a> e <a href="/blog/dor-no-punho-ao-treinar">dor no punho</a>.</li>
<li><strong>Sono:</strong> a partida que entra pela madrugada encurta a noite, e sono curto atrapalha a recuperação e o controle do peso.</li>
</ul>

<h2>Quanto tempo de videogame por dia faz mal?</h2>
<p>Para adultos, não existe um número oficial de horas de jogo. A Organização Mundial da Saúde não fala em limite de videogame; fala em <strong>reduzir o tempo sentado</strong> e trocar parte dele por qualquer movimento, mesmo leve, além de 150 a 300 minutos de atividade moderada por semana e músculo trabalhado em pelo menos dois dias.</p>
<p>Por isso, a pergunta que importa é menos "quantas horas" e mais "quanto tempo sem levantar". Quatro horas com pausas a cada partida são bem diferentes de quatro horas grudado na cadeira.</p>

<h2>A pausa entre partidas (5 minutos)</h2>
<p>Os estudos testaram pausas curtas, de 2 a 5 minutos a cada 20 a 30 minutos sentado. Ficar só em pé não teve o mesmo efeito que se mexer. Uma rotina simples para fazer entre uma partida e outra:</p>
<ol>
<li><strong>Andar 1 a 2 minutos</strong> pela casa, buscar água, subir um lance de escada.</li>
<li><strong>10 agachamentos</strong> no ritmo que der, segurando numa cadeira se precisar.</li>
<li><strong>Abrir o peito na porta:</strong> antebraço apoiado no batente, gire o tronco para o lado oposto por 20 a 30 segundos de cada lado.</li>
<li><strong>Pescoço e ombros:</strong> encolher e soltar os ombros devagar, 10 vezes, e levar o queixo levemente para trás.</li>
<li><strong>Punhos:</strong> abrir e fechar as mãos e girar os punhos para os dois lados.</li>
</ol>
<p>Não é treino, é quebra do tempo parado. O treino de verdade vem nos outros dias: musculação duas ou três vezes por semana é o que fortalece costas e abdômen para aguentar melhor as horas de cadeira. Para ajustar a posição, veja <a href="/blog/postura-trabalho-sentado-exercicios">postura de quem trabalha sentado</a>, que vale igual para quem joga.</p>

<h2>Fazer exercício compensa as horas jogando?</h2>
<p>Em boa parte, sim. Uma análise com mais de 1 milhão de adultos, publicada na revista The Lancet, mostrou que 60 a 75 minutos por dia de atividade moderada praticamente eliminaram o risco extra de morte ligado a passar muitas horas sentado. Para quem ficava muitas horas em frente à TV, o risco caiu, mas não sumiu. Ou seja: treinar ajuda muito, e levantar de vez em quando continua valendo.</p>
<p>Se você está parado há tempo, o começo é mais leve do que parece: <a href="/blog/como-sair-do-sedentarismo">como sair do sedentarismo</a>.</p>

<h2>Quando o jogo vira problema</h2>
<p>A Organização Mundial da Saúde incluiu o <strong>transtorno de jogo</strong> na CID-11, a classificação internacional de doenças. O que define o transtorno não é a quantidade de horas, e sim a perda de controle: o jogo passa na frente de outras atividades e continua mesmo trazendo prejuízo para sono, trabalho, estudo ou relações, em geral por pelo menos um ano. Isso é assunto para um profissional de saúde mental, não para personal trainer.</p>
<p>Para a maioria das pessoas, o videogame é lazer como outro qualquer. O ajuste é de rotina: pausa entre partidas, hora para parar e treino na semana.</p>

${NAO_SE_COMPARE("Não se compare com quem treina todo dia nem com o personagem do jogo.")}

<h2>Fontes</h2>
<ul>
<li><a href="https://www.who.int/publications/i/item/9789240015128" target="_blank" rel="noopener noreferrer">Organização Mundial da Saúde. WHO guidelines on physical activity and sedentary behaviour, 2020</a></li>
<li><a href="https://www.who.int/standards/classifications/frequently-asked-questions/gaming-disorder" target="_blank" rel="noopener noreferrer">Organização Mundial da Saúde. Gaming disorder (CID-11), perguntas frequentes</a></li>
<li>Dunstan DW, et al. Breaking up prolonged sitting reduces postprandial glucose and insulin responses. Diabetes Care, 2012</li>
<li>Henson J, et al. Predictors of the acute postprandial response to breaking up prolonged sitting. Medicine &amp; Science in Sports &amp; Exercise, 2020</li>
<li>Ekelund U, et al. Does physical activity attenuate, or even eliminate, the detrimental association of sitting time with mortality? The Lancet, 2016</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/jogar-videogame-gasta-calorias">Jogar videogame gasta calorias?</a></li>
<li><a href="/blog/gta-6-tem-academia">GTA 6 tem academia? O treino do jogo e o da vida real</a></li>
<li><a href="/blog/quem-trabalha-sentado">Quem trabalha sentado</a></li>
</ul>`,
  },
];
