import type { BlogPost } from "./blog";

/**
 * "O que acontece se ficar 7 dias sem carboidrato" (pauta da pesquisa do
 * ciclo de carboidratos, 15/10/2026: pergunta do "As pessoas também
 * perguntam" que não cabia naquela página). Escrito sem export nem print do
 * Google, a pedido do Montinho (29/10/2026): quando a pesquisa chegar, H2 e
 * FAQ são ajustados às perguntas reais.
 *
 * Não canibaliza "dieta-cetogenica-musculacao" (a dieta como estratégia de
 * longo prazo) nem "treino-low-carb-musculacao" (treinar com pouco
 * carboidrato): este responde só o que acontece numa semana de corte total,
 * dia a dia, e o que sobra na balança quando o carboidrato volta.
 *
 * Números só das fontes: 3 a 4 partes de água por parte de glicogênio
 * (Kreitzman 1992); cérebro buscando outra energia depois de 3 a 4 dias
 * (Paoli 2013); sintomas da "gripe" no pico da 1ª semana (Bostock 2020,
 * relatos de fórum, não ensaio clínico); 4 dias abaixo de 50 g reduzindo o
 * desempenho em esforço anaeróbio (Wroble 2019, 16 pessoas); RDA de 130 g
 * (DRI 2005). A conta da balança é aritmética em cima de Kreitzman.
 *
 * Ferramenta: a Calculadora de Macros (o leitor sai querendo saber quanto
 * carboidrato cabe no dia dele).
 */

const FONTE_KREITZMAN = {
  rotulo: "Kreitzman SN, Coxon AY, Szaz KF. Glycogen storage: illusions of easy weight loss, excessive weight regain, and distortions in estimates of body composition. American Journal of Clinical Nutrition, 1992",
  url: "https://pubmed.ncbi.nlm.nih.gov/1615908/",
};
const FONTE_PAOLI = {
  rotulo: "Paoli A, Rubini A, Volek JS, Grimaldi KA. Beyond weight loss: a review of the therapeutic uses of very-low-carbohydrate (ketogenic) diets. European Journal of Clinical Nutrition, 2013",
  url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3826507/",
};
const FONTE_BOSTOCK = {
  rotulo: "Bostock ECS, et al. Consumer reports of \"keto flu\" associated with the ketogenic diet. Frontiers in Nutrition, 2020",
  url: "https://www.frontiersin.org/articles/10.3389/fnut.2020.00020/full",
};
const FONTE_WROBLE = {
  rotulo: "Wroble KA, et al. Low-carbohydrate, ketogenic diet impairs anaerobic exercise performance in exercise-trained women and men: a randomized-sequence crossover trial. Journal of Sports Medicine and Physical Fitness, 2019",
  url: "https://pubmed.ncbi.nlm.nih.gov/29619799/",
};
const FONTE_DRI = {
  rotulo: "Institute of Medicine. Dietary Reference Intakes for Energy, Carbohydrate, Fiber, Fat, Fatty Acids, Cholesterol, Protein, and Amino Acids. National Academies Press, 2005",
  url: "https://nap.nationalacademies.org/catalog/10490",
};

const FONTES = [FONTE_KREITZMAN, FONTE_PAOLI, FONTE_BOSTOCK, FONTE_WROBLE, FONTE_DRI];

const link = (f: { url: string }, texto: string) => `<a href="${f.url}" target="_blank" rel="noopener noreferrer">${texto}</a>`;

export const SEM_CARBOIDRATO_POSTS: BlogPost[] = [
  {
    slug: "ficar-7-dias-sem-carboidrato",
    title: "O Que Acontece se Ficar 7 Dias Sem Carboidrato",
    metaTitle: "7 Dias Sem Carboidrato: O Que Acontece com o Corpo",
    metaDescription:
      "Dia a dia do corpo numa semana sem carboidrato: o que cai na balança, quando vem a dor de cabeça e o que acontece com o peso quando o carboidrato volta.",
    excerpt:
      "A balança cai rápido, mas boa parte é água que sai junto com o glicogênio. Veja o que acontece em cada fase da semana, o que muda no treino e o que fica quando o carboidrato volta.",
    category: "Nutrição",
    date: "2026-10-29",
    readTime: "8 min",
    author: "Montinho",
    tags: ["carboidrato", "low carb", "dieta cetogênica", "emagrecimento", "glicogênio"],
    faq: [
      {
        question: "O que acontece se ficar 7 dias sem carboidrato?",
        answer:
          "Nos primeiros dois dias o corpo gasta o glicogênio, o estoque de carboidrato do fígado e dos músculos, e perde a água que vem junto. Por volta do 3º ou 4º dia o cérebro passa a usar outra fonte de energia, os corpos cetônicos. Na primeira semana são comuns dor de cabeça, cansaço e queda de rendimento no treino. A balança cai, mas boa parte do que sai é água.",
      },
      {
        question: "Quantos quilos perde em 7 dias sem carboidrato?",
        answer:
          "Varia muito, e o número da balança engana. Cada grama de glicogênio é guardado com 3 a 4 gramas de água. Então, se o corpo gastar 300 g de glicogênio, saem junto de 900 g a 1,2 kg de água, e a balança cai de 1,2 a 1,5 kg só por isso, sem que essa parte seja gordura.",
      },
      {
        question: "Ficar 7 dias sem carboidrato emagrece?",
        answer:
          "Só a parte que vier do déficit calórico. Gordura sai quando você gasta mais do que come, com ou sem carboidrato. A queda rápida da primeira semana é principalmente água e glicogênio, e volta quando o carboidrato volta.",
      },
      {
        question: "O peso volta quando eu voltar a comer carboidrato?",
        answer:
          "A parte que era água e glicogênio volta, e isso é normal: o corpo repõe o estoque. Não quer dizer que você engordou. O que fica é a gordura que você perdeu de verdade com o déficit da semana.",
      },
      {
        question: "Em quanto tempo o corpo entra em cetose?",
        answer:
          "Com o carboidrato bem baixo, abaixo de cerca de 50 g por dia, o cérebro passa a depender de outra fonte de energia depois de 3 a 4 dias. O ponto exato varia de pessoa para pessoa.",
      },
      {
        question: "Por que dá dor de cabeça quando corta o carboidrato?",
        answer:
          "É um dos sintomas da chamada gripe low carb. Num levantamento de relatos de pessoas que começaram a dieta cetogênica, os mais citados foram dor de cabeça, cansaço, náusea, tontura e mente lenta, com pico na primeira semana e melhora até a quarta. São relatos, não um estudo clínico, então mostram o que as pessoas sentem, não a causa.",
      },
      {
        question: "Dá para treinar sem carboidrato?",
        answer:
          "Dá, mas o desempenho em esforço curto e forte costuma cair. Num estudo, quatro dias com menos de 50 g de carboidrato por dia reduziram a potência num teste de bicicleta em sprint e a distância num teste de corrida intermitente, comparado com dieta rica em carboidrato.",
      },
      {
        question: "Ficar sem carboidrato faz perder músculo?",
        answer:
          "A queda da balança numa semana sem carboidrato é principalmente água e glicogênio, não músculo. O que protege o músculo é o mesmo de sempre: proteína suficiente e treino de força. Se o desempenho cair, ajuste a carga, mas continue treinando.",
      },
      {
        question: "Qual o mínimo de carboidrato por dia?",
        answer:
          "A recomendação de referência para adultos é de 130 g por dia, que é a glicose que o cérebro usa. Para quem treina, a necessidade costuma ser maior. A Calculadora de Macros mostra uma divisão para o seu objetivo.",
      },
      {
        question: "Quem não deve ficar sem carboidrato?",
        answer:
          "Quem usa remédio para diabetes, gestantes, lactantes, quem tem doença nos rins e quem tem ou teve transtorno alimentar não deve cortar carboidrato por conta própria. Nesses casos, a mudança precisa ser feita com o médico e o nutricionista.",
      },
    ],
    content: `<img src="/blog-images/ficar-7-dias-sem-carboidrato-capa.webp" alt="Capa: 7 dias sem carboidrato, o que acontece com o corpo. Ilustração de calendário, pessoa na balança e pão cortado, com ícones de água, balança e treino" title="7 Dias Sem Carboidrato — Montinho Personal Trainer" width="1024" height="672" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>O que acontece se ficar 7 dias sem carboidrato?</strong> A balança cai rápido nos primeiros dias, mas boa parte do que sai é água. O corpo gasta o estoque de carboidrato que guarda no fígado e nos músculos, o glicogênio, e cada grama dele estava guardado com água. Por volta do 3º ou 4º dia o cérebro muda de combustível. No meio do caminho, dor de cabeça e cansaço são comuns, e o treino forte rende menos. Abaixo está a semana dia a dia, quanto da balança é água e o que acontece quando o carboidrato volta.</p>

<h2>Dia 1 e 2: o glicogênio vai embora, e a água vai junto</h2>
<p>Sem carboidrato chegando, o corpo usa o que tem guardado. O glicogênio do fígado segura a glicose do sangue, e o dos músculos abastece o treino. O detalhe que explica a balança: o glicogênio é guardado com <strong>3 a 4 partes de água para cada parte de glicogênio</strong> (${link(FONTE_KREITZMAN, "Kreitzman e colegas, 1992")}). Quando o estoque cai, essa água sai junto, e você vai mais ao banheiro.</p>
<p>É por isso que os primeiros dias de qualquer dieta muito baixa em carboidrato parecem milagrosos. A queda é real na balança, mas não é gordura.</p>

<h2>Dia 3 e 4: o cérebro troca de combustível</h2>
<p>O cérebro gosta de glicose. Quando ela falta por alguns dias, o fígado passa a produzir corpos cetônicos a partir da gordura, e eles viram a energia alternativa. Uma revisão descreve que, depois de <strong>3 a 4 dias sem carboidrato</strong>, o sistema nervoso é "forçado" a buscar outra fonte, e que isso acontece com o consumo abaixo de cerca de <strong>50 g de carboidrato por dia</strong> (${link(FONTE_PAOLI, "Paoli e colegas, 2013")}). Esse estado é a cetose. O limite exato varia de pessoa para pessoa.</p>

<h2>Dia 5 a 7: a fase da "gripe low carb"</h2>
<p>A primeira semana é a mais difícil. Num levantamento de relatos de pessoas que começaram a dieta cetogênica, os sintomas mais citados foram <strong>dor de cabeça, cansaço, náusea, tontura, mente lenta, desconforto intestinal e falta de energia</strong>, com pico na primeira semana e melhora até a quarta (${link(FONTE_BOSTOCK, "Bostock e colegas, 2020")}). São relatos de fóruns, não um estudo clínico: mostram o que as pessoas sentem, não por que sentem.</p>
<p>Outro efeito comum é o intestino ficar preso. Pão integral, aveia, feijão e frutas são carboidratos e também são de onde vem boa parte da fibra do dia. Se eles saem, a fibra cai junto. Veja os <a href="/blog/alimentos-ricos-em-fibra">alimentos ricos em fibra</a> que têm pouco carboidrato, como as verduras.</p>

<h2>Quantos quilos dá para perder em 7 dias sem carboidrato?</h2>
<p>Não existe um número certo, porque depende de quanto glicogênio você tinha, do seu tamanho e de quanto comeu na semana. Mas a conta da água ajuda a entender o que a balança mostra:</p>
<table>
<thead><tr><th>Glicogênio gasto</th><th>Água que sai junto (3 a 4 g por grama)</th><th>Queda na balança só por isso</th></tr></thead>
<tbody>
<tr><td>200 g</td><td>600 a 800 g</td><td>0,8 a 1,0 kg</td></tr>
<tr><td>300 g</td><td>900 g a 1,2 kg</td><td>1,2 a 1,5 kg</td></tr>
<tr><td>400 g</td><td>1,2 a 1,6 kg</td><td>1,6 a 2,0 kg</td></tr>
</tbody>
</table>
<p>A tabela é só a aritmética da proporção de água; quanto de glicogênio cada pessoa gasta varia. A gordura é outra conta: um quilo de gordura guarda cerca de 7.700 kcal, então ela só sai com déficit calórico, dia após dia. A conta completa está em <a href="/blog/quantas-calorias-tem-1kg-de-gordura">quantas calorias tem 1 kg de gordura</a>.</p>

<h2>E quando o carboidrato volta?</h2>
<p>O corpo repõe o glicogênio, e a água volta com ele. A balança sobe em um ou dois dias, e muita gente acha que "engordou tudo de novo". Não engordou: a parte que volta é exatamente a que tinha saído sem ser gordura. O que fica é a gordura que você perdeu de verdade com o déficit da semana.</p>
<p>Por isso, semana sem carboidrato não é um bom jeito de medir progresso. Se o objetivo é emagrecer, olhe a média do peso de várias semanas, a cintura e as roupas, não o tombo dos primeiros dias. Se o plano é perder peso aos poucos, veja <a href="/blog/quantos-kg-perder-por-mes">quantos quilos perder por mês</a> sem perder músculo.</p>

<h2>Dá para treinar sem carboidrato?</h2>
<p>Dá, mas o treino forte sente. Num estudo com 16 homens e mulheres treinados, <strong>quatro dias com menos de 50 g de carboidrato por dia</strong> reduziram a potência num teste de sprint na bicicleta e a distância num teste de corrida intermitente, comparado com quatro dias de dieta rica em carboidrato (${link(FONTE_WROBLE, "Wroble e colegas, 2019")}). É um estudo pequeno e de poucos dias, mas mostra o que muita gente sente: a série pesada e o tiro rendem menos.</p>
<p>Na prática, é aqui que entra a observação de quem acompanha: a carga parou de subir, a última série não sai, o fôlego some no meio do treino. Se isso aparecer, não é falta de força de vontade. É combustível. Ajuste a carga nessa semana ou coloque carboidrato perto do treino, como mostra o artigo de <a href="/blog/carboidrato-antes-do-treino">carboidrato antes do treino</a>.</p>

<h2>Ficar sem carboidrato faz perder músculo?</h2>
<p>A queda da balança numa semana sem carboidrato é principalmente água e glicogênio, não músculo. O que protege o músculo é o de sempre: proteína suficiente no dia e treino de força com carga. Quem corta carboidrato e também corta o treino porque "está sem energia" perde nos dois lados. Se o rendimento cair, reduza a carga, mas mantenha o estímulo.</p>

<h2>Qual o mínimo de carboidrato por dia?</h2>
<p>A recomendação de referência para adultos é de <strong>130 g de carboidrato por dia</strong>, a quantidade de glicose que o cérebro usa (${link(FONTE_DRI, "Dietary Reference Intakes, 2005")}). A mesma referência coloca o carboidrato entre 45% e 65% das calorias do dia. Para quem treina, a necessidade costuma ser maior que o mínimo.</p>
<p>Não precisa ir a zero para emagrecer. Dá para reduzir os carboidratos refinados e manter os que ajudam o treino e o intestino. Se você quer uma divisão de proteína, gordura e carboidrato para o seu objetivo, a Calculadora de Macros faz a conta. E, se a ideia é variar o carboidrato conforme o treino do dia, veja o <a href="/blog/ciclo-de-carboidratos-carb-cycling">ciclo de carboidratos</a>.</p>

<h2>Quem não deve ficar sem carboidrato por conta própria</h2>
<ul>
<li>Quem usa remédio para diabetes, porque a dose pode precisar de ajuste.</li>
<li>Gestantes e lactantes.</li>
<li>Quem tem doença nos rins.</li>
<li>Quem tem ou teve transtorno alimentar.</li>
</ul>
<p>Nesses casos, qualquer mudança grande na alimentação precisa ser feita com o médico e o nutricionista.</p>

<h2>Não se compare</h2>
<p>Sempre tem alguém que diz que cortou o carboidrato e perdeu 4 kg na semana. Cada pessoa tem a própria genética, rotina e história, com altos e baixos, e a balança da primeira semana conta mais sobre água do que sobre gordura. O que decide o resultado é um jeito de comer e treinar que dê para seguir por meses, com progressão.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/dieta-cetogenica-musculacao">Dieta cetogênica e musculação</a></li>
<li><a href="/blog/treino-low-carb-musculacao">Treino low carb e musculação</a></li>
<li><a href="/blog/carboidratos-simples-vs-complexos">Carboidratos simples e complexos</a></li>
<li><a href="/blog/carboidrato-a-noite-engorda">Carboidrato à noite engorda?</a></li>
<li><a href="/blog/ciclo-de-carboidratos-carb-cycling">Ciclo de carboidratos</a></li>
</ul>

<h2>Fontes</h2>
<ul>
${FONTES.map((f) => `<li><a href="${f.url}" target="_blank" rel="noopener noreferrer">${f.rotulo}</a></li>`).join("\n")}
</ul>`,
  },
];
