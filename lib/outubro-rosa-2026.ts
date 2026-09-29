import type { BlogPost } from "./blog";

/** Outubro Rosa. Tema de saúde: só dado de fonte oficial (INCA, OMS/IARC),
 *  sempre com encaminhamento ao médico; sem promessa. */
export const OUTUBRO_ROSA_POSTS: BlogPost[] = [
  {
    slug: "outubro-rosa-exercicio-fisico",
    title: "Outubro Rosa: exercício físico e musculação na prevenção do câncer de mama",
    metaTitle: "Outubro Rosa: Exercício Físico e Musculação Ajudam a Prevenir?",
    metaDescription:
      "Outubro Rosa: qual a relação entre exercício físico e câncer de mama, se a musculação ajuda a prevenir, quanto se mexer por semana segundo o INCA e o que não substitui o exame.",
    excerpt:
      "O que o INCA diz sobre atividade física e câncer de mama, quanto se mexer por semana, o papel da musculação — e por que nada disso substitui o exame.",
    category: "Saúde",
    date: "2026-09-29",
    readTime: "5 min",
    author: "Montinho Personal Trainer",
    tags: ["Outubro Rosa", "câncer de mama", "exercício físico", "musculação", "prevenção"],
    content: `<p>O <strong>Outubro Rosa</strong> é o mês de conscientização sobre o <strong>câncer de mama</strong>. Além do exame e do diagnóstico precoce, um dos fatores que mais se repetem nas recomendações oficiais é o <strong>movimento</strong>: segundo o Instituto Nacional de Câncer (INCA), a atividade física está associada à redução do risco de câncer de mama. Este guia explica o que se sabe — sem exagero e sem promessa.</p>

<h2>Exercício físico previne câncer de mama?</h2>
<p>O INCA, com base na Agência Internacional para Pesquisa em Câncer, associa a prática regular de atividade física à menor chance de câncer de mama, de intestino (cólon) e de endométrio. Parte do efeito vem do controle do peso e da gordura corporal — o excesso de gordura aumenta o risco de vários tipos de câncer — e parte de mudanças no sistema imunológico e nos hormônios.</p>
<p><strong>Exercício reduz o risco, não zera.</strong> Mulheres ativas também podem ter câncer de mama, e a prevenção não substitui o rastreamento.</p>

<h2>Quanto se mexer por semana?</h2>
<ul>
<li><strong>150 minutos</strong> de atividade moderada (caminhada rápida, bike leve, dança) <strong>ou 75 minutos</strong> de atividade vigorosa (corrida, aula intensa), ou uma combinação das duas;</li>
<li>e, segundo o próprio INCA, <strong>qualquer tempo de movimento</strong>, em qualquer intensidade, já traz benefício para quem hoje está parada.</li>
</ul>

<h2>A musculação pode prevenir o câncer?</h2>
<p>A musculação entra na conta da atividade física semanal e ajuda a manter massa muscular e controlar a gordura corporal, que é um dos caminhos da prevenção. O ideal é combinar: <strong>musculação duas vezes por semana</strong> e atividade aeróbica (caminhada, corrida, bike) nos outros dias.</p>

<h2>Quais são as dicas para prevenir o câncer de mama?</h2>
<ul>
<li>Manter o peso saudável;</li>
<li>Praticar atividade física regularmente;</li>
<li>Evitar ou reduzir o consumo de bebida alcoólica;</li>
<li>Amamentar, quando possível;</li>
<li>Fazer os exames indicados pelo médico para a sua idade e o seu histórico.</li>
</ul>

<h2>Sedentarismo e câncer de mama</h2>
<p>O inverso também vale: o INCA aponta a inatividade física e o excesso de peso entre os fatores de risco que dá para mudar. Sair do zero é o passo que mais conta.</p>

<h2>O que o exercício NÃO substitui</h2>
<p>O exame. A mamografia de rastreamento e a consulta médica são o que permite descobrir o câncer cedo, quando as chances de cura são maiores. Sentiu um nódulo, notou alteração na pele, no mamilo ou secreção? Procure o médico — independentemente de quanto você treina.</p>

<h2>E durante ou depois do tratamento?</h2>
<p>Com liberação da equipe médica, o exercício costuma ser recomendado também durante e depois do tratamento, ajustado a cada fase. Veja o guia de <a href="/blog/musculacao-pos-cancer">musculação depois do câncer</a>.</p>

<h2>Caminhada Rosa: um bom começo</h2>
<p>Muitas cidades organizam caminhadas do Outubro Rosa. É um jeito leve de começar — e, se virar hábito, de chegar aos 150 minutos por semana.</p>

<h2>Cada uma no seu ritmo</h2>
<p>Não se compare com ninguém: cada mulher tem a própria genética, rotina e história. O que protege a saúde é o movimento que você consegue manter por anos. Se quiser montar um treino seguro para o seu momento, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.gov.br/inca/pt-br" target="_blank" rel="noopener noreferrer">INCA — Instituto Nacional de Câncer</a> (atividade física e prevenção do câncer; recomendação de 150/75 minutos por semana)</li>
<li>Agência Internacional para Pesquisa em Câncer (IARC/OMS), citada pelo INCA.</li>
</ul>`,
    faq: [
      { question: "Qual a relação entre exercício físico e câncer de mama?", answer: "Segundo o INCA, a atividade física regular está associada à redução do risco de câncer de mama, em parte pelo controle do peso e da gordura corporal. Ela reduz o risco, mas não o elimina." },
      { question: "A musculação pode prevenir o câncer?", answer: "Ela faz parte da atividade física semanal e ajuda a controlar a gordura corporal, um dos caminhos da prevenção. O ideal é combinar musculação com atividade aeróbica." },
      { question: "Quanto exercício por semana para prevenir o câncer de mama?", answer: "A recomendação é de 150 minutos de atividade moderada ou 75 de vigorosa por semana. Para quem está parada, qualquer movimento já traz benefício." },
      { question: "Exercício substitui a mamografia?", answer: "Não. O exame e a consulta médica continuam indispensáveis para o diagnóstico precoce." },
      { question: "Quem tem nódulo na mama pode fazer musculação?", answer: "Nódulo precisa de avaliação médica antes de qualquer conclusão. Com a liberação do médico, em geral a pessoa pode seguir treinando; a decisão é caso a caso." },
    ],
  },
];
