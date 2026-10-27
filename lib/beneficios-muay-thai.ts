import type { BlogPost } from "./blog";
import { FONTE_COMPENDIO_MUAY, FONTE_HALL, tabelaCenarios } from "./muaythai";

/**
 * "Benefícios do muay thai" (pauta da fila de 23/10/2026). Escrito antes
 * dos prints do Google, a pedido do Montinho (24/10/2026): quando chegarem,
 * H2 e FAQ são ajustados às perguntas reais.
 *
 * Não canibaliza "muay-thai-emagrece": aquele responde só "emagrece?"; este
 * responde "o que o muay thai faz por mim". Os dois se linkam.
 *
 * Prints do Google e export do Answer the Public chegaram em 27/10/2026:
 * "para mulher / no corpo feminino" é o maior grupo depois do termo
 * principal (~470 buscas/mês somadas), e viraram seção própria, assim como
 * crianças e adolescentes, desvantagens e "como fica o corpo". Faixas,
 * golpes, origem, regras e equipamentos ficaram como sugestão de pauta.
 *
 * As calorias saem da calculadora (lib/muaythai.ts, tabelaCenarios), para o
 * artigo nunca discordar dela. Os benefícios vêm de estudo publicado, e o
 * texto diz o tamanho da evidência: o estudo de condicionamento é de
 * kickboxing (luta da mesma família, com socos e chutes), pequeno e de 5
 * semanas; a meta-análise de saúde mental é de artes marciais em geral, com
 * efeito pequeno.
 */

const FONTE_OUERGUI = {
  rotulo: "Ouergui I, et al. The effects of five weeks of kickboxing training on physical fitness. Muscles, Ligaments and Tendons Journal, 2014",
  url: "https://pubmed.ncbi.nlm.nih.gov/25332919/",
};
const FONTE_MOORE = {
  rotulo: "Moore B, Dudley D, Woodcock S. The effect of martial arts training on mental health outcomes: a systematic review and meta-analysis. Journal of Bodywork and Movement Therapies, 2020",
  url: "https://pubmed.ncbi.nlm.nih.gov/33218541/",
};
const FONTE_SCHOENFELD_VOLUME = {
  rotulo: "Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass. Journal of Sports Sciences, 2017",
  url: "https://pubmed.ncbi.nlm.nih.gov/27433992/",
};

const FONTE_ROBERTS = {
  rotulo: "Roberts BM, Nuckols G, Krieger JW. Sex differences in resistance training: a systematic review and meta-analysis. Journal of Strength and Conditioning Research, 2020",
  url: "https://pubmed.ncbi.nlm.nih.gov/32218059/",
};
const FONTE_GARTLAND = {
  rotulo: "Gartland S, Malik MH, Lovell ME. Injury and injury rates in Muay Thai kick boxing. British Journal of Sports Medicine, 2001",
  url: "https://pubmed.ncbi.nlm.nih.gov/11579062/",
};
const FONTE_OMS = {
  rotulo: "Organização Mundial da Saúde. WHO guidelines on physical activity and sedentary behaviour, 2020",
  url: "https://www.who.int/publications/i/item/9789240015128",
};

const CEN = tabelaCenarios();
const kcal = (n: number) => n.toLocaleString("pt-BR");
const TIPICA = CEN.find((c) => c.cenario.id === "tipica")!;
const TECNICA = CEN.find((c) => c.cenario.id === "tecnica")!;
const INTENSA = CEN.find((c) => c.cenario.id === "intensa")!;

const tabelaCalorias = `<table>
<thead><tr><th>Aula</th><th>70 kg</th><th>90 kg</th></tr></thead>
<tbody>
${CEN.map((c) => `<tr><td>${c.cenario.nome} (${c.cenario.minutosAula} min)</td><td>≈ ${kcal(c.kcal70)} kcal</td><td>≈ ${kcal(c.kcal90)} kcal</td></tr>`).join("\n")}
</tbody>
</table>`;

export const BENEFICIOS_MUAY_THAI_POSTS: BlogPost[] = [
  {
    slug: "beneficios-do-muay-thai",
    title: "Benefícios do Muay Thai para o Corpo e a Mente",
    metaTitle: "Benefícios do Muay Thai: Fôlego, Força, Agilidade e Mente",
    metaDescription:
      "Os benefícios do muay thai para o condicionamento, a força, a agilidade e a cabeça, com o tamanho real da evidência. E o que ele não faz sozinho.",
    excerpt:
      "Fôlego, potência, agilidade, gasto calórico alto e uma aula que dá vontade de voltar. Veja o que os estudos mostram sobre os benefícios do muay thai, o que ainda é pouco estudado e como somar a luta com a musculação.",
    category: "Treinamento",
    date: "2026-10-24",
    updatedAt: "2026-10-27",
    readTime: "10 min",
    author: "Montinho",
    tags: ["muay thai", "artes marciais", "condicionamento", "saúde mental", "musculação"],
    faq: [
      {
        question: "Quais são os principais benefícios do muay thai?",
        answer:
          "Condicionamento (fôlego e resistência a esforço intenso), potência de braços, flexibilidade, velocidade, agilidade e coordenação. Num estudo com 5 semanas de kickboxing, luta da mesma família, todos esses pontos melhoraram. Ele também gasta muitas calorias por aula e tem um efeito pequeno, mas real, no bem-estar.",
      },
      {
        question: "Quais os benefícios do muay thai para mulher?",
        answer:
          "Os mesmos que para o homem: fôlego, potência, agilidade, flexibilidade, gasto calórico alto e um efeito pequeno, mas positivo, no bem-estar. O corpo da mulher responde ao treino tão bem quanto o do homem, em proporção. O que costuma pesar a favor é a aula em si: dinâmica, em grupo e com técnica que dá sensação de progresso rápido, o que ajuda a voltar na semana seguinte.",
      },
      {
        question: "O muay thai define o corpo feminino?",
        answer:
          "Ajuda, mas não sozinho. Corpo definido é menos gordura por cima de músculo: o muay thai ajuda na primeira parte, porque gasta muitas calorias, e pouco na segunda, porque não sobe carga. Com duas aulas de luta e duas ou três de musculação na semana, e a alimentação acertada, a definição aparece.",
      },
      {
        question: "Como fica o corpo de quem pratica muay thai?",
        answer:
          "Com mais fôlego, mais potência nos braços, mais agilidade e mais flexibilidade de quadril, que é o que os estudos medem. A mudança na aparência depende da alimentação e de somar musculação: num estudo de 5 semanas de kickboxing, a composição corporal não mudou.",
      },
      {
        question: "Muay thai emagrece?",
        answer: `Ajuda, porque gasta bastante: cerca de ${kcal(TIPICA.kcal70)} kcal numa aula típica de 1 hora para quem pesa 70 kg. Mas quem decide o emagrecimento é o déficit calórico da semana. A conta completa está no artigo "Muay thai emagrece?".`,
      },
      {
        question: "Muay thai emagrece quantos quilos por semana?",
        answer:
          `Não existe um número fixo. A aula gasta calorias, mas quem decide quantos quilos saem é o déficit da semana inteira, somando o que você come. Duas aulas de cerca de 1 hora gastam perto de ${kcal(TIPICA.kcal70 * 2)} kcal para quem pesa 70 kg, o que sozinho não chega a um quilo por semana. A conta completa está no artigo "Muay thai emagrece?" e na calculadora.`,
      },
      {
        question: "Muay thai dá massa muscular?",
        answer:
          "Pouca. No estudo de 5 semanas de kickboxing, a composição corporal não mudou. O muay thai melhora força e resistência, mas ganhar músculo pede carga que sobe aos poucos e séries suficientes por músculo, o que é o trabalho da musculação. O melhor dos dois mundos é fazer as duas coisas.",
      },
      {
        question: "Muay thai faz bem para a ansiedade?",
        answer:
          "Pode ajudar. Uma meta-análise de 14 estudos sobre artes marciais encontrou efeito pequeno e positivo no bem-estar e efeito médio em ansiedade e depressão, mas com resultados muito variados entre os estudos. É um complemento, não um tratamento: se a ansiedade atrapalha a sua vida, procure um profissional de saúde mental.",
      },
      {
        question: "Quantas vezes por semana treinar muay thai?",
        answer:
          "Duas ou três aulas por semana já bastam para o corpo responder: o estudo de kickboxing usou três aulas de 1 hora por semana. Para quem também faz musculação, duas aulas de luta e duas ou três de força é uma semana que cabe na rotina e deixa o corpo recuperar.",
      },
      {
        question: "Muay thai ou musculação: qual é melhor?",
        answer:
          "Depende do objetivo. Para fôlego, agilidade e gasto calórico por aula, o muay thai entrega mais. Para ganhar músculo e força com segurança, a musculação. Não é um contra o outro: as duas juntas cobrem o que cada uma deixa de fora.",
      },
      {
        question: "Quais os benefícios do muay thai para crianças?",
        answer:
          "Ajuda a cumprir a recomendação da OMS para crianças e adolescentes: 60 minutos por dia de atividade moderada a intensa, com atividades que fortaleçam músculos e ossos pelo menos 3 vezes por semana. Na aula infantil, o foco deve ser técnica, coordenação e brincadeira, sem sparring com contato forte.",
      },
      {
        question: "Quais as desvantagens do muay thai?",
        answer:
          "Risco de lesão, principalmente nas pernas, com hematomas, entorses e distensões, e mais no começo do que depois: num levantamento com praticantes de muay thai, iniciantes tiveram a maior taxa de lesões por ano. Também não constrói músculo como a musculação. Técnica antes do sparring, bandagem e luva desde o primeiro dia diminuem bastante o problema.",
      },
      {
        question: "Muay thai serve para defesa pessoal?",
        answer:
          "Ensina a se mover, a manter distância e a reagir com socos, chutes, joelhadas e cotoveladas. Mas a aula é um ambiente controlado. Em situação de risco real, a melhor defesa continua sendo sair dela.",
      },
      {
        question: "Precisa ter preparo físico para começar no muay thai?",
        answer:
          "Não. A aula para iniciantes começa pela técnica, e o condicionamento vem com o tempo. Avise o professor que você está começando, use bandagem e luva desde o primeiro dia e deixe o sparring para quando a técnica estiver firme.",
      },
    ],
    content: `<p>Os <strong>benefícios do muay thai</strong> vão além de suar a camiseta: mais fôlego, mais potência nos braços, mais agilidade e um gasto de calorias alto por aula. Os estudos sobre isso existem, mas são poucos e pequenos, e vale saber o tamanho real de cada benefício antes de criar expectativa. Abaixo está o que a ciência mostra, o que ela ainda não mostra e o que o muay thai não faz sozinho.</p>

<h2>Quais são os benefícios do muay thai?</h2>
<ul>
<li><strong>Condicionamento:</strong> fôlego para esforço longo e para tiros fortes, como os rounds.</li>
<li><strong>Potência e agilidade:</strong> braços mais explosivos, mais velocidade e mudança de direção mais rápida.</li>
<li><strong>Flexibilidade e coordenação:</strong> chute pede quadril solto; combinação pede braço e perna no tempo certo.</li>
<li><strong>Gasto calórico alto:</strong> cerca de ${kcal(TIPICA.kcal70)} kcal numa aula típica de 1 hora, para 70 kg.</li>
<li><strong>Bem-estar:</strong> efeito pequeno, mas positivo, nos estudos de artes marciais.</li>
<li><strong>Constância:</strong> a aula é dinâmica, e treino divertido é treino que se repete.</li>
</ul>

<h2>Condicionamento: o benefício mais estudado</h2>
<p>O estudo mais citado é de kickboxing, luta da mesma família do muay thai, com socos e chutes. Trinta pessoas foram sorteadas em dois grupos. Um deles treinou kickboxing <strong>três vezes por semana, cerca de 1 hora por aula, durante 5 semanas</strong>; o outro manteve a rotina (<a href="${FONTE_OUERGUI.url}" target="_blank" rel="noopener noreferrer">Ouergui e colegas, 2014</a>).</p>
<p>Quem lutou melhorou a <strong>potência aeróbia</strong> (o fôlego para esforço longo) e o <strong>condicionamento anaeróbio</strong> (o tiro forte, medido no teste de Wingate). Faz sentido: um round é um esforço intenso de alguns minutos, seguido de descanso curto, repetido várias vezes. É exatamente o tipo de esforço que o corpo aprende a aguentar.</p>
<p>O limite: são 15 pessoas por grupo e só 5 semanas. É um bom sinal, não uma prova definitiva.</p>

<h2>Força, potência, agilidade e flexibilidade</h2>
<p>No mesmo estudo, o grupo que lutou também melhorou a <strong>potência dos braços</strong>, a <strong>flexibilidade</strong>, a <strong>velocidade</strong> e a <strong>agilidade</strong>. O salto vertical, que mede a potência das pernas, não mudou.</p>
<p>Na aula, isso aparece como chute mais alto, guarda que volta mais rápido e combinação que deixa de ser uma sequência pensada e vira um movimento só.</p>

<h2>Benefícios do muay thai para mulher</h2>
<p>São os mesmos que para o homem: fôlego, potência, agilidade, flexibilidade, gasto calórico alto e bem-estar. Não existe um benefício "feminino" à parte, e isso é boa notícia: o corpo da mulher responde ao treino tão bem quanto o do homem. Numa meta-análise que comparou homens e mulheres no mesmo treino de força, o ganho de músculo foi parecido, e o ganho de força de braços, em proporção, foi até maior nas mulheres (<a href="${FONTE_ROBERTS.url}" target="_blank" rel="noopener noreferrer">Roberts e colegas, 2020</a>).</p>
<p>O que costuma fazer diferença na prática é a aula: dinâmica, em grupo, com técnica que dá sensação de progresso nas primeiras semanas. Para muita gente, é o que faz voltar na semana seguinte, e constância é o benefício que sustenta todos os outros.</p>

<h3>O muay thai define o corpo feminino?</h3>
<p>Ajuda, mas não sozinho. Corpo definido é menos gordura por cima de músculo. O muay thai ajuda na primeira parte, porque gasta muitas calorias por aula; na segunda, ajuda pouco, porque não sobe carga. Quem quer definir costuma ter o melhor resultado juntando as duas coisas: duas aulas de luta e duas ou três de musculação na semana, com a alimentação acertada. E nada de medo de "ficar grande": ganhar músculo é lento, para homem e para mulher, e depende de anos de carga subindo.</p>

<h2>Como fica o corpo de quem pratica muay thai?</h2>
<p>O que os estudos medem é o que muda primeiro: mais fôlego, braços mais explosivos, quadril mais solto, mais agilidade. A aparência muda mais devagar e depende de duas coisas fora da aula: a alimentação, que decide quanto de gordura sai, e a musculação, que decide quanto de músculo aparece. No estudo de 5 semanas de kickboxing, quem lutou melhorou o condicionamento, mas a composição corporal ficou igual (<a href="${FONTE_OUERGUI.url}" target="_blank" rel="noopener noreferrer">Ouergui e colegas, 2014</a>).</p>

<h2>Quantas calorias uma aula de muay thai gasta</h2>
<p>Depende de quanto da aula é técnica e de quantos rounds fortes ela tem. A conta abaixo é a da <a href="/ferramentas/calculadora-calorias-muay-thai">Calculadora de Calorias no Muay Thai</a>, com rounds de 3 minutos e 1 minuto de descanso, usando os valores do <a href="${FONTE_COMPENDIO_MUAY.url}" target="_blank" rel="noopener noreferrer">Compêndio de Atividades Físicas</a>:</p>
${tabelaCalorias}
<p>Muay thai emagrece quantos quilos por semana? Não existe um número fixo: a aula gasta, mas quem decide quantos quilos saem é o déficit da semana inteira. Duas aulas de cerca de 1 hora gastam perto de ${kcal(TIPICA.kcal70 * 2)} kcal para quem pesa 70 kg, o que, sozinho, não chega a um quilo por semana.</p>
<p>Uma aula técnica para iniciantes fica perto de ${kcal(TECNICA.kcal70)} kcal para 70 kg; uma aula intensa, com sparring, passa de ${kcal(INTENSA.kcal70)}. Para saber se isso emagrece, a conta da semana está em <a href="/blog/muay-thai-emagrece">muay thai emagrece?</a>.</p>

<h2>Muay thai faz bem para a cabeça?</h2>
<p>Uma meta-análise juntou 14 estudos sobre artes marciais e saúde mental (<a href="${FONTE_MOORE.url}" target="_blank" rel="noopener noreferrer">Moore e colegas, 2020</a>). O treino teve um efeito <strong>pequeno e positivo no bem-estar</strong> e um efeito médio em sintomas de ansiedade e depressão, mas com resultados muito diferentes de um estudo para outro. Na agressividade, o efeito foi mínimo e não significativo.</p>
<p>Traduzindo: o muay thai pode ser um bom lugar para descarregar o estresse do dia. Mas é um complemento. Se a ansiedade está atrapalhando a sua vida, o caminho é um profissional de saúde mental.</p>

<h2>Muay thai dá massa muscular?</h2>
<p>Pouca. No estudo de 5 semanas de kickboxing, a <strong>composição corporal não mudou</strong> em nenhum dos grupos, e os próprios autores sugerem somar outras atividades e cuidar da alimentação.</p>
<p>O motivo é simples: músculo cresce com carga que sobe aos poucos e com séries suficientes por músculo na semana. Quanto mais séries semanais, maior o ganho, até um ponto (<a href="${FONTE_SCHOENFELD_VOLUME.url}" target="_blank" rel="noopener noreferrer">Schoenfeld e colegas, 2017</a>). O muay thai treina resistência e potência; quem faz o trabalho de construir músculo é a musculação. Veja como funciona a <a href="/blog/progressao-de-carga">progressão de carga</a>.</p>

<h2>Muay thai e musculação juntos</h2>
<p>As duas se completam: a luta entrega fôlego, agilidade e gasto calórico; a musculação, músculo, força e articulações mais protegidas para chutar e levar chute. Uma semana que funciona para a maioria das pessoas:</p>
<ul>
<li><strong>2 aulas de muay thai</strong> e <strong>2 ou 3 treinos de musculação</strong>;</li>
<li>perna pesada longe do dia de sparring, para não chegar sem perna na aula;</li>
<li>pelo menos um dia sem nada, porque luta, força e pouco sono juntos derrubam qualquer um.</li>
</ul>
<p>O que costuma dar errado é o meio da semana: você faltou na musculação porque a aula de luta acabou com você, a carga parou de subir, a rotina mudou. É aí que alguém precisa olhar e ajustar. Eu não dou aula de muay thai; o que eu faço é montar a musculação em volta da sua luta e acompanhar o que acontece, na <a href="/consultoria-online">consultoria online</a> ou presencialmente nos locais de <a href="/onde-atendo">onde atendo</a>.</p>

<h2>Benefícios do muay thai para crianças e adolescentes</h2>
<p>A Organização Mundial da Saúde recomenda que crianças e adolescentes façam, em média, <strong>60 minutos por dia de atividade física moderada a intensa</strong>, com atividades que fortaleçam músculos e ossos pelo menos 3 vezes por semana (<a href="${FONTE_OMS.url}" target="_blank" rel="noopener noreferrer">OMS, 2020</a>). Uma aula de muay thai ajuda a cumprir essa conta, com coordenação, agilidade e disciplina de treino junto.</p>
<p>O cuidado é com o contato: na aula infantil, o foco deve ser técnica, coordenação e brincadeira, com sparring leve e supervisionado. Vale olhar se a academia tem turma separada por idade e professor acostumado com criança.</p>

<h2>Desvantagens e malefícios do muay thai</h2>
<p>A principal desvantagem é o <strong>risco de lesão</strong>. Num levantamento com 152 praticantes de muay thai, as lesões mais comuns foram nas pernas, quase sempre de tecido mole (hematomas e pancadas), seguidas de entorses e distensões. Os <strong>iniciantes tiveram a maior taxa de lesões por ano</strong>, bem acima de amadores e profissionais (<a href="${FONTE_GARTLAND.url}" target="_blank" rel="noopener noreferrer">Gartland e colegas, 2001</a>). Ou seja: o risco é maior justamente quando a técnica ainda não está firme.</p>
<p>A outra desvantagem é o que ele não faz: não constrói músculo como a musculação e, sozinho, não garante emagrecimento. Nada disso é motivo para não treinar; é motivo para começar do jeito certo.</p>

<h2>Cuidados para começar</h2>
<ul>
<li>Avise o professor que você está começando e respeite a progressão da técnica.</li>
<li>Bandagem e luva desde a primeira aula: mão e punho sentem primeiro.</li>
<li>Deixe o sparring para quando a técnica estiver firme.</li>
<li>Round forte é esforço perto do máximo. Com alguma condição cardiovascular, ou voltando depois de muito tempo parado, converse com o seu médico antes de emendar rounds.</li>
</ul>
<p>Se você mora em Barueri e região, o <a href="/blog/academias-de-jiu-jitsu-em-barueri">guia de academias de luta em Barueri</a> ajuda a escolher onde treinar.</p>

<h2>Não se compare</h2>
<p>Tem gente que chega na primeira aula chutando alto e gente que leva meses para soltar o quadril. Cada pessoa tem a própria genética, a própria rotina e a própria história, com altos e baixos. O muay thai traz benefício para quem volta na semana seguinte, e na outra. O melhor treino é o que você consegue seguir pelo resto da vida, com constância e progressão.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/muay-thai-emagrece">Muay thai emagrece? Calorias e o que esperar</a></li>
<li><a href="/blog/boxe-emagrece">Boxe emagrece?</a></li>
<li><a href="/blog/crossfit-da-massa-muscular">CrossFit dá massa muscular?</a></li>
<li><a href="/ferramentas/calculadora-calorias-muay-thai">Calculadora de Calorias no Muay Thai</a></li>
</ul>

<h2>Fontes</h2>
<ul>
<li><a href="${FONTE_OUERGUI.url}" target="_blank" rel="noopener noreferrer">${FONTE_OUERGUI.rotulo}</a></li>
<li><a href="${FONTE_MOORE.url}" target="_blank" rel="noopener noreferrer">${FONTE_MOORE.rotulo}</a></li>
<li><a href="${FONTE_SCHOENFELD_VOLUME.url}" target="_blank" rel="noopener noreferrer">${FONTE_SCHOENFELD_VOLUME.rotulo}</a></li>
<li><a href="${FONTE_ROBERTS.url}" target="_blank" rel="noopener noreferrer">${FONTE_ROBERTS.rotulo}</a></li>
<li><a href="${FONTE_GARTLAND.url}" target="_blank" rel="noopener noreferrer">${FONTE_GARTLAND.rotulo}</a></li>
<li><a href="${FONTE_OMS.url}" target="_blank" rel="noopener noreferrer">${FONTE_OMS.rotulo}</a></li>
<li><a href="${FONTE_COMPENDIO_MUAY.url}" target="_blank" rel="noopener noreferrer">${FONTE_COMPENDIO_MUAY.rotulo}</a></li>
<li><a href="${FONTE_HALL.url}" target="_blank" rel="noopener noreferrer">${FONTE_HALL.rotulo}</a></li>
</ul>`,
  },
];
