import type { BlogPost } from "./blog";

/**
 * "Creatina engorda?" (04/11/2026). 22.200 buscas por mês no Planejador de
 * Palavras-chave do Google Ads (Brasil), e o site não recebia impressão
 * nenhuma para a busca: ela só aparecia como pergunta frequente em outros
 * artigos. Publicado a pedido do Montinho ANTES dos prints ("pode criar os
 * dois, depois eu mando os prints"); título, H2 e FAQ serão revistos com a
 * pesquisa.
 *
 * Canibalização: "creatina-retencao-de-liquido-mito" fica com a dúvida de
 * inchaço e água em profundidade; este responde a pergunta que as pessoas
 * digitam ("engorda?") e linka para lá. Os dois se linkam.
 *
 * Fatos, e só estes:
 *   - Antonio et al., 2021 (JISSN 18:13, PMID 33557850): creatina não
 *     aumenta a massa gorda; a retenção de água é um efeito dos primeiros
 *     dias, sobretudo com saturação.
 *   - Kreider et al., 2017 (posicionamento da ISSN, JISSN 14:18, PMID
 *     28615996): saturação de ~0,3 g/kg/dia por 5 a 7 dias e depois 3 a 5 g
 *     por dia; ou 3 a 5 g por dia direto, que enche o estoque em 3 a 4
 *     semanas.
 *   - Calorias: a creatina monohidratada pura traz 0 kcal na tabela
 *     nutricional; produto com carboidrato adicionado tem, e o texto manda
 *     conferir o rótulo.
 * Quanto o peso sobe na saturação não entra em número: não achamos a cifra
 * na fonte primária.
 *
 * Ferramenta: Calculadora de Creatina embutida (a conta que sobra é "quanto
 * eu tomo, com o meu peso").
 */

export const CREATINA_ENGORDA_POSTS: BlogPost[] = [
  {
    slug: "creatina-engorda",
    title: "Creatina Engorda? O Que Sobe na Balança e Por Quê",
    metaTitle: "Creatina Engorda? O Que Sobe na Balança e Por Quê",
    metaDescription:
      "Creatina engorda? Não aumenta a gordura, mas a balança pode subir nos primeiros dias. Veja de onde vem esse peso e como tomar sem susto, com a calculadora.",
    excerpt:
      "Creatina engorda ou não? A diferença entre ganhar peso e ganhar gordura, por que a balança sobe no começo e como tomar a dose certa para o seu peso.",
    category: "Suplementação",
    date: "2026-11-04",
    readTime: "6 min",
    author: "Montinho",
    tags: ["creatina", "creatina engorda", "suplementação", "retenção de líquido", "emagrecimento"],
    faq: [
      {
        question: "Creatina engorda?",
        answer:
          "Não aumenta a gordura. Uma revisão de 2021 de pesquisadores da Sociedade Internacional de Nutrição Esportiva concluiu que a creatina não aumenta a massa gorda. O que pode subir é o peso na balança nos primeiros dias, porque o músculo guarda mais água junto com a creatina.",
      },
      {
        question: "Creatina engorda ou emagrece?",
        answer:
          "Nem um nem outro sozinha. Ela não tem calorias e não queima gordura. O que ela faz é ajudar a treinar com mais força, e é o treino com a alimentação que decide se você ganha ou perde gordura.",
      },
      {
        question: "Por que a balança subiu depois que comecei a creatina?",
        answer:
          "Porque a creatina leva água para dentro do músculo. Esse aumento aparece principalmente nos primeiros dias, e é maior para quem faz a fase de saturação. Não é gordura e não aparece como barriga.",
      },
      {
        question: "Creatina tem calorias?",
        answer:
          "A creatina monohidratada pura traz 0 kcal na tabela nutricional da dose. Produtos misturados com carboidrato ou sabor têm calorias: confira o rótulo do seu.",
      },
      {
        question: "Creatina engorda a mulher?",
        answer:
          "Não. A resposta é a mesma para homens e mulheres: a creatina não aumenta a gordura. O peso pode oscilar um pouco no começo, por água no músculo, e isso costuma ser confundido com inchaço.",
      },
      {
        question: "Quem está fazendo dieta para emagrecer pode tomar creatina?",
        answer:
          "Pode. Em déficit calórico, ela ajuda a manter a força no treino, o que ajuda a preservar músculo. Só não use a balança dos primeiros dias para julgar a dieta: a água no músculo confunde a leitura.",
      },
      {
        question: "Precisa fazer a fase de saturação?",
        answer:
          "Não. O posicionamento da Sociedade Internacional de Nutrição Esportiva diz que 3 a 5 g por dia enchem o estoque do músculo em 3 a 4 semanas. A saturação só adianta isso, e é nela que a balança mais sobe.",
      },
      {
        question: "Quanto de creatina tomar por dia?",
        answer:
          "A manutenção é de 3 a 5 g por dia, segundo a Sociedade Internacional de Nutrição Esportiva. Para calcular com o seu peso, use a Calculadora de Creatina do site.",
      },
    ],
    content: `<img src="/blog-images/creatina-engorda-capa.webp" alt="Capa: Creatina engorda? O que sobe na balança e por quê. Ilustração de pote de creatina e balança" title="Creatina Engorda? — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Creatina engorda?</strong> Não aumenta a gordura. O que pode acontecer é a balança subir um pouco nos primeiros dias, porque o músculo guarda mais água junto com a creatina. Peso na balança e gordura no corpo são coisas diferentes, e é aí que nasce o medo.</p>

<h2>Creatina engorda: sim ou não?</h2>
<p><strong>Não engorda no sentido de ganhar gordura.</strong> Uma revisão de 2021, assinada por pesquisadores da Sociedade Internacional de Nutrição Esportiva, reuniu os estudos sobre as dúvidas mais comuns da creatina e concluiu que ela não aumenta a massa gorda, nem em uso curto nem em uso longo.</p>
<p>A creatina monohidratada pura também não tem calorias para engordar: a tabela nutricional da dose traz 0 kcal. Se o seu produto vem misturado com carboidrato ou sabor, aí sim tem caloria, e o rótulo mostra quanto.</p>

<h2>Então por que a balança sobe?</h2>
<p>Porque a creatina é guardada dentro do músculo, e leva água junto. Quando o estoque enche, o músculo fica mais cheio de água, e o peso total sobe um pouco. Isso é diferente de inchaço: a água fica <strong>dentro</strong> da fibra muscular, não embaixo da pele.</p>
<p>A mesma revisão de 2021 descreve essa retenção como um efeito dos primeiros dias, mais forte em quem começa com a fase de saturação, e não como algo que fica crescendo com o tempo. Para entender a diferença entre água no músculo e inchaço, veja <a href="/blog/creatina-retencao-de-liquido-mito">creatina causa retenção de líquido?</a>.</p>

<h2>Ganhar peso não é ganhar gordura</h2>
<p>A balança mede tudo junto: gordura, músculo, água, o que você comeu e o que ainda não foi ao banheiro. Por isso ela é uma régua ruim nas primeiras semanas de creatina. Duas pessoas que sobem 1 kg podem estar em situações opostas: uma ganhou gordura, a outra encheu o músculo de água e creatina.</p>
<p>Se quiser acompanhar de verdade, use mais de uma medida: a fita métrica na cintura, as fotos e as cargas do treino. Se a cintura não aumentou e a carga subiu, o peso extra não é gordura.</p>

<h2>Creatina engorda ou emagrece?</h2>
<p>Nenhum dos dois sozinha. Ela não queima gordura e não tem caloria para engordar. O que ela faz é ajudar o músculo a render mais em esforços curtos e pesados, como a série de musculação. Com mais força no treino, fica mais fácil progredir carga e ganhar músculo.</p>
<p>Quem engorda ou emagrece é a soma da alimentação e do treino. A creatina só muda o quanto você rende dentro do treino. Para a parte da alimentação, veja <a href="/blog/deficit-calorico-como-calcular">como calcular o déficit calórico</a>.</p>

<h2>Quem está de dieta pode tomar creatina?</h2>
<p>Pode, e costuma ser uma boa ideia. Em déficit calórico, a força tende a cair, e a creatina ajuda a segurar o desempenho no treino. Treinar pesado durante a dieta é o que avisa o corpo para manter o músculo.</p>
<p>O único cuidado é com a leitura da balança. Se você começar a creatina e a dieta na mesma semana, o peso pode não descer como esperava nos primeiros dias, por causa da água no músculo. Dê duas ou três semanas antes de concluir que a dieta não está funcionando.</p>

<h2>Creatina engorda a mulher?</h2>
<p>Não. Os estudos valem para homens e mulheres: a creatina não aumenta a gordura. O receio costuma vir da oscilação de peso do começo, que algumas mulheres percebem mais por causa da variação do ciclo menstrual. Mais detalhes em <a href="/blog/creatina-para-mulheres">creatina para mulheres</a>.</p>

<h2>Como tomar sem susto na balança</h2>
<p>O posicionamento da Sociedade Internacional de Nutrição Esportiva, de 2017, traz dois jeitos:</p>
<ul>
<li><strong>Direto na manutenção:</strong> 3 a 5 g por dia. O estoque do músculo enche em 3 a 4 semanas, e o aumento de peso aparece aos poucos, sem salto.</li>
<li><strong>Com saturação:</strong> cerca de 0,3 g por quilo por dia (perto de 20 g para quem pesa 70 kg), divididos ao longo do dia, por 5 a 7 dias, e depois 3 a 5 g por dia. Enche mais rápido, e é nesse jeito que a balança mais sobe.</li>
</ul>
<p>Se o número da balança te incomoda, vá direto na manutenção. O resultado depois de um mês é o mesmo. O horário não muda nada nessa conta: veja <a href="/blog/melhor-horario-para-tomar-creatina">o melhor horário para tomar creatina</a>. Para saber a dose para o seu peso, faça a conta na calculadora abaixo.</p>

<h2>Não se compare</h2>
<p>Tem gente que vê a balança subir na primeira semana de creatina e gente que não nota nada. Nenhum dos dois é a sua régua. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um jeito de treinar e de comer que dê para manter, mês depois de mês.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://link.springer.com/article/10.1186/s12970-021-00412-w" target="_blank" rel="noopener noreferrer">Antonio J. et al. Common questions and misconceptions about creatine supplementation: what does the scientific evidence really show? Journal of the International Society of Sports Nutrition, 2021</a> (PMID 33557850)</li>
<li><a href="https://pubmed.ncbi.nlm.nih.gov/28615996/" target="_blank" rel="noopener noreferrer">Kreider R. B. et al. International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine. Journal of the International Society of Sports Nutrition, 2017</a></li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/creatina-retencao-de-liquido-mito">Creatina causa retenção de líquido?</a></li>
<li><a href="/blog/creatina-para-mulheres">Creatina para mulheres</a></li>
<li><a href="/blog/whey-protein-engorda">Whey protein engorda?</a></li>
<li><a href="/blog/suplementacao-basica-para-iniciantes">Suplementação básica para iniciantes</a></li>
</ul>`,
  },
];
