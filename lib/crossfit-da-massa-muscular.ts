import type { BlogPost } from "./blog";

/**
 * "CrossFit dá massa muscular?" (pauta da fila de 23/10/2026). Escrito antes
 * dos prints do Google, a pedido do Montinho (24/10/2026): quando chegarem,
 * H2 e FAQ são ajustados às perguntas reais.
 *
 * Não canibaliza "crossfit-vs-musculacao" (a escolha entre os dois) nem
 * "crossfit-emagrece" (calorias): este responde só se o CrossFit constrói
 * músculo, quanto e como ganhar mais. Os três se linkam.
 *
 * Evidência citada com o tamanho real: Kapsis 2022 é treino funcional de
 * alta intensidade (HIFT) em circuito, não "CrossFit" com marca; Cavedon
 * 2020 é transversal (compara praticantes, não acompanha); Claudino 2018
 * diz que a literatura é fraca. A ferramenta é a Calculadora de Volume,
 * como link (o embed está no teto de 8).
 */

const FONTE_KAPSIS = {
  rotulo: "Kapsis DP, et al. Changes in body composition and strength after 12 weeks of high-intensity functional training with two different loads in physically active men and women: a randomized controlled study. Sports (Basel), 2022",
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8822892/",
};
const FONTE_CAVEDON = {
  rotulo: "Cavedon V, et al. Different amount of training affects body composition and performance in High-Intensity Functional Training participants. PLoS One, 2020",
  url: "https://pubmed.ncbi.nlm.nih.gov/32817652/",
};
const FONTE_CLAUDINO = {
  rotulo: "Claudino JG, et al. CrossFit overview: systematic review and meta-analysis. Sports Medicine - Open, 2018",
  url: "https://pubmed.ncbi.nlm.nih.gov/29484512/",
};
const FONTE_SCHOENFELD_CARGA = {
  rotulo: "Schoenfeld BJ, et al. Strength and hypertrophy adaptations between low- vs. high-load resistance training: a systematic review and meta-analysis. Journal of Strength and Conditioning Research, 2017",
  url: "https://pubmed.ncbi.nlm.nih.gov/28834797/",
};
const FONTE_SCHOENFELD_VOLUME = {
  rotulo: "Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass. Journal of Sports Sciences, 2017",
  url: "https://pubmed.ncbi.nlm.nih.gov/27433992/",
};
const FONTE_HUBAL = {
  rotulo: "Hubal MJ, et al. Variability in muscle size and strength gain after unilateral resistance training. Medicine & Science in Sports & Exercise, 2005",
  url: "https://pubmed.ncbi.nlm.nih.gov/15947721/",
};

const FONTES = [FONTE_KAPSIS, FONTE_CAVEDON, FONTE_CLAUDINO, FONTE_SCHOENFELD_CARGA, FONTE_SCHOENFELD_VOLUME, FONTE_HUBAL];

export const CROSSFIT_MUSCULO_POSTS: BlogPost[] = [
  {
    slug: "crossfit-da-massa-muscular",
    title: "CrossFit Dá Massa Muscular? Quanto Ganha e Como Ganhar Mais",
    metaTitle: "CrossFit Dá Massa Muscular? Quanto e Como Ganhar Mais",
    metaDescription:
      "CrossFit dá massa muscular, mas com limites. Veja o que os estudos mediram, o que esperar no primeiro mês e o que muda para ganhar mais músculo.",
    excerpt:
      "Dá, e os estudos medem ganho de massa magra em poucas semanas. Mas o WOD que muda todo dia pode deixar um músculo com séries de menos, e o fôlego acaba antes do músculo. Veja o que esperar e como ajustar.",
    category: "Hipertrofia",
    date: "2026-10-24",
    updatedAt: "2026-10-24",
    readTime: "8 min",
    author: "Montinho",
    tags: ["crossfit", "hipertrofia", "massa muscular", "treino funcional", "volume de treino"],
    faq: [
      {
        question: "CrossFit dá massa muscular?",
        answer:
          "Dá. Num estudo com 12 semanas de treino funcional de alta intensidade, em circuito, três vezes por semana, os participantes ganharam pouco mais de 1 kg de massa magra. O ganho tende a ser menor e mais irregular que o de uma musculação bem montada, porque o volume de cada músculo muda de um dia para o outro.",
      },
      {
        question: "Quanto tempo leva para ver resultado no CrossFit?",
        answer:
          "No estudo de 12 semanas, a massa magra já tinha subido na 6ª semana no grupo que treinou com carga moderada; o grupo de carga leve só alcançou na 12ª. Mas a resposta varia muito de pessoa para pessoa: com o mesmo treino, há quem quase não mude e quem ganhe muito.",
      },
      {
        question: "CrossFit com pouco peso dá músculo?",
        answer:
          "Pode dar, desde que a série termine perto da falha. Uma meta-análise de 21 estudos mostrou ganho de músculo parecido com carga leve e com carga pesada quando as séries iam até a falha. A diferença é que a carga pesada ganha mais força máxima.",
      },
      {
        question: "CrossFit deixa o corpo definido?",
        answer:
          "Ajuda, porque soma músculo e gasta muita energia. Num estudo com praticantes medidos por densitometria, quem fazia CrossFit tinha menos gordura que pessoas ativas da mesma idade e IMC. Mas definição é, principalmente, gordura baixa, e isso depende da alimentação.",
      },
      {
        question: "Posso fazer CrossFit e musculação juntos?",
        answer:
          "Pode, e é um bom jeito de garantir o volume dos músculos que o WOD deixa de lado. O cuidado é com a recuperação: some as séries da semana das duas atividades e não coloque a perna pesada da musculação no dia seguinte a um WOD de perna.",
      },
      {
        question: "CrossFit ou musculação para ganhar massa?",
        answer:
          "Para hipertrofia, a musculação costuma ser mais eficiente, porque deixa você controlar quantas séries cada músculo recebe e subir a carga aos poucos. O CrossFit entrega condicionamento junto. A comparação completa está no artigo CrossFit ou musculação.",
      },
      {
        question: "Mulher ganha músculo fazendo CrossFit?",
        answer:
          "Ganha. No estudo de 12 semanas havia homens e mulheres, e a massa magra subiu nos grupos que treinaram. O que decide é o mesmo para todo mundo: séries suficientes por músculo, esforço perto da falha, comida e sono.",
      },
    ],
    content: `<p><strong>CrossFit dá massa muscular?</strong> Dá. Os estudos medem ganho de massa magra em poucas semanas de treino funcional de alta intensidade. Mas o ganho tende a ser menor e mais irregular que o de uma musculação bem montada, por dois motivos: o WOD muda todo dia e pode deixar um músculo com séries de menos, e muitas vezes o fôlego acaba antes do músculo. Abaixo está o que os estudos mostram, o que esperar e o que ajustar para ganhar mais.</p>

<h2>O que os estudos mostram</h2>
<p>A pesquisa sobre CrossFit ainda é pequena. Uma revisão sistemática de 2018 encontrou 31 estudos, mas só dois tinham alto nível de evidência e baixo risco de viés (<a href="${FONTE_CLAUDINO.url}" target="_blank" rel="noopener noreferrer">Claudino e colegas</a>). Com essa ressalva, dois estudos ajudam a responder:</p>
<ul>
<li><strong>12 semanas de treino funcional em circuito:</strong> 31 adultos que já se exercitavam treinaram três vezes por semana, com cinco exercícios de 30 segundos e 30 de pausa, em quatro voltas. Um grupo usou 30% da carga máxima e outro, 70%. Em 12 semanas, os dois ganharam pouco mais de 1 kg de massa magra, medida por bioimpedância; quem não treinou, não ganhou (<a href="${FONTE_KAPSIS.url}" target="_blank" rel="noopener noreferrer">Kapsis e colegas, 2022</a>).</li>
<li><strong>Praticantes de CrossFit medidos por densitometria:</strong> quem treinava mais de 10 horas por semana tinha mais massa magra que quem treinava menos. E os praticantes, no geral, tinham menos gordura que pessoas ativas da mesma idade e IMC (<a href="${FONTE_CAVEDON.url}" target="_blank" rel="noopener noreferrer">Cavedon e colegas, 2020</a>). É uma comparação num momento só, não um acompanhamento, então mostra associação, não causa.</li>
</ul>

<h2>Por que o CrossFit pode dar músculo</h2>
<p>O músculo não sabe se está num box ou numa academia. Ele responde a duas coisas:</p>
<ul>
<li><strong>Esforço perto da falha.</strong> Uma meta-análise de 21 estudos mostrou ganho de músculo parecido com carga leve e com carga pesada, quando as séries iam até a falha (<a href="${FONTE_SCHOENFELD_CARGA.url}" target="_blank" rel="noopener noreferrer">Schoenfeld e colegas, 2017</a>). A carga pesada ganha mais força máxima; o tamanho do músculo, nem tanto.</li>
<li><strong>Séries suficientes na semana.</strong> Quanto mais séries semanais por músculo, maior o ganho, até um ponto (<a href="${FONTE_SCHOENFELD_VOLUME.url}" target="_blank" rel="noopener noreferrer">Schoenfeld, Ogborn e Krieger, 2017</a>).</li>
</ul>
<p>Uma aula de CrossFit costuma ter as duas coisas: uma parte de força com carga e um WOD que leva o corpo perto do limite.</p>

<h2>Por que às vezes não dá</h2>
<ul>
<li><strong>O volume de cada músculo é irregular.</strong> Numa semana, o WOD tem agachamento três dias; na outra, quase nada de perna. O peito pode passar a semana só com flexão. Ninguém está contando as séries de cada músculo.</li>
<li><strong>O fôlego acaba antes do músculo.</strong> Num WOD longo, você para porque não consegue respirar, não porque o músculo chegou perto da falha. A série conta para o condicionamento, mas pouco para a hipertrofia.</li>
<li><strong>A carga não sobe de forma planejada.</strong> O peso muda com o WOD do dia, não com a sua evolução.</li>
<li><strong>Falta comida.</strong> O CrossFit gasta muito. Se a alimentação não acompanha, o corpo não tem material para construir músculo.</li>
</ul>

<h2>O que esperar no primeiro mês</h2>
<p>No estudo de 12 semanas, a massa magra já tinha subido na 6ª semana no grupo de carga moderada; o de carga leve só alcançou na 12ª.</p>
<p>E a resposta varia muito. Num estudo com 585 pessoas fazendo exatamente o mesmo treino de braço por 12 semanas, o ganho de tamanho do músculo foi de −2% a +59% (<a href="${FONTE_HUBAL.url}" target="_blank" rel="noopener noreferrer">Hubal e colegas, 2005</a>). Comparar o seu primeiro mês com o de outra pessoa do box não diz nada sobre você.</p>

<h2>Como ganhar mais músculo fazendo CrossFit</h2>
<ol>
<li><strong>Conte as séries de cada músculo na semana.</strong> Some o que o WOD e a parte de força deram para peito, costas, perna e ombro. A <a href="/ferramentas/calculadora-volume-treino">Calculadora de Volume de Treino</a> faz essa conta e mostra onde está faltando.</li>
<li><strong>Complete o que falta com musculação.</strong> Dois treinos curtos por semana, focados nos músculos que o WOD deixou de lado, já resolvem.</li>
<li><strong>Suba a carga aos poucos na parte de força.</strong> Anote quanto você levantou e tente superar. Veja como fazer a <a href="/blog/progressao-de-carga">progressão de carga</a>.</li>
<li><strong>Coma o suficiente.</strong> Proteína todo dia e calorias que não deixem a semana em déficit grande. A <a href="/ferramentas/calculadora-de-proteina">Calculadora de Proteína</a> e a <a href="/ferramentas/calculadora-superavit-calorico">Calculadora de Superávit</a> dão os números.</li>
<li><strong>Durma e descanse.</strong> WOD forte todo dia, sem dia livre, é o caminho mais curto para parar de evoluir.</li>
</ol>
<p>Na prática, o que trava quem faz CrossFit e quer músculo não é o box: é a semana sem conta. Você faltou na segunda, o WOD de perna caiu na sexta junto com a musculação, a carga do agachamento parou de subir e ninguém percebeu. É aí que alguém precisa olhar e ajustar. Eu monto a musculação em volta do seu CrossFit e acompanho o que acontece, na <a href="/consultoria-online">consultoria online</a> ou presencialmente nos locais de <a href="/onde-atendo">onde atendo</a>.</p>

<h2>CrossFit ou musculação para hipertrofia?</h2>
<p>Para ganhar massa, a musculação costuma ser mais eficiente, porque deixa você controlar as séries de cada músculo e subir a carga com plano. O CrossFit entrega condicionamento, comunidade e gasto calórico junto. Não precisa escolher um só: a comparação completa está em <a href="/blog/crossfit-vs-musculacao">CrossFit ou musculação</a>, e as calorias de uma aula, em <a href="/blog/crossfit-emagrece">CrossFit emagrece?</a>.</p>

<h2>Não se compare</h2>
<p>O box é cheio de gente forte, e é fácil olhar para o lado e achar que você está atrasado. Cada pessoa tem a própria genética, a própria rotina e a própria história, com altos e baixos. O que decide o seu músculo é você conseguir treinar, comer e descansar do mesmo jeito por meses, com progressão. Quem faz isso evolui, no box ou na academia.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/crossfit-vs-musculacao">CrossFit ou musculação: qual é melhor para o seu objetivo?</a></li>
<li><a href="/blog/crossfit-emagrece">CrossFit emagrece? Quantas calorias uma aula queima</a></li>
<li><a href="/blog/quantas-series-para-hipertrofia">Quantas séries para hipertrofia?</a></li>
<li><a href="/blog/hyrox-vs-crossfit">Hyrox vs CrossFit</a></li>
<li><a href="/blog/beneficios-do-muay-thai">Benefícios do muay thai</a></li>
</ul>

<h2>Fontes</h2>
<ul>
${FONTES.map((f) => `<li><a href="${f.url}" target="_blank" rel="noopener noreferrer">${f.rotulo}</a></li>`).join("\n")}
</ul>`,
  },
];
