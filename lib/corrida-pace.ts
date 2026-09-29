import type { BlogPost } from "./blog";

/**
 * Artigos de pace e velocidade na corrida. A tabela de pace é conta pura
 * (min/km → km/h e tempo por distância), sem dado de terceiros.
 */
export const CORRIDA_PACE_POSTS: BlogPost[] = [
  {
    slug: "como-melhorar-o-pace-na-corrida",
    title: "Como melhorar o pace na corrida: o que é, como calcular e como baixar",
    metaTitle: "Como Melhorar o Pace na Corrida (com Tabela de Pace)",
    metaDescription:
      "O que é pace, como calcular, tabela de pace em km/h e tempo para 5, 10 e 15 km, e os treinos que fazem você correr mais rápido e cansar menos. Pace de 7 é ruim? Veja.",
    excerpt:
      "O que é pace, como calcular, tabela de pace e os treinos que fazem você correr mais rápido e cansar menos — sem se comparar com ninguém.",
    category: "Treinamento",
    date: "2026-09-29",
    readTime: "8 min",
    author: "Montinho Personal Trainer",
    tags: ["pace", "corrida", "correr mais rápido", "tabela de pace", "treino de corrida", "corrida de rua"],
    content: `<img src="/blog-images/como-melhorar-o-pace-na-corrida-capa.webp" alt="Capa: como melhorar o pace na corrida — o que é, como calcular, tabela de pace e os treinos para baixar" width="1800" height="1013" loading="eager" style="width:100%;height:auto;border-radius:12px;margin:0 0 1.5rem;" />
<p><strong>Pace</strong> é o tempo que você leva para correr um quilômetro. Quem corre 5 km em 30 minutos tem pace de 6:00 por km. <strong>Melhorar o pace</strong> — ou "baixar o pace" — é levar menos tempo por quilômetro. Abaixo você calcula o seu, confere a tabela e vê os treinos que fazem você correr mais rápido e cansar menos.</p>

<h2>Como calcular o pace</h2>
<p>A conta é simples: <strong>tempo total ÷ distância</strong>. Correu 10 km em 58 minutos? 58 ÷ 10 = 5,8 minutos por km, ou seja, <strong>5:48 /km</strong> (0,8 minuto são 48 segundos). Para não fazer conta, use a calculadora abaixo: ela dá o pace, a velocidade em km/h e o tempo de prova para qualquer distância.</p>

<h2>Tabela de pace: km/h e tempo em 5, 10 e 15 km</h2>
<p>Pace e velocidade são a mesma informação escrita de dois jeitos — a esteira mostra km/h, o relógio mostra min/km.</p>
<table><thead><tr><th>Pace</th><th>Velocidade</th><th>5 km</th><th>10 km</th><th>15 km</th></tr></thead><tbody>
<tr><td>4:00 /km</td><td>15,0 km/h</td><td>20min</td><td>40min</td><td>1h00min</td></tr>
<tr><td>4:30 /km</td><td>13,3 km/h</td><td>22min30s</td><td>45min</td><td>1h07min30s</td></tr>
<tr><td>5:00 /km</td><td>12,0 km/h</td><td>25min</td><td>50min</td><td>1h15min</td></tr>
<tr><td>5:30 /km</td><td>10,9 km/h</td><td>27min30s</td><td>55min</td><td>1h22min30s</td></tr>
<tr><td>6:00 /km</td><td>10,0 km/h</td><td>30min</td><td>1h00min</td><td>1h30min</td></tr>
<tr><td>6:30 /km</td><td>9,2 km/h</td><td>32min30s</td><td>1h05min</td><td>1h37min30s</td></tr>
<tr><td>7:00 /km</td><td>8,6 km/h</td><td>35min</td><td>1h10min</td><td>1h45min</td></tr>
<tr><td>7:30 /km</td><td>8,0 km/h</td><td>37min30s</td><td>1h15min</td><td>1h52min30s</td></tr>
<tr><td>8:00 /km</td><td>7,5 km/h</td><td>40min</td><td>1h20min</td><td>2h00min</td></tr>
</tbody></table>
<p><strong>Aumentar ou diminuir o pace?</strong> Em corrida, "baixar" ou "diminuir" o pace é ficar mais rápido: menos minutos por quilômetro. Na esteira é o contrário — você aumenta a velocidade.</p>

<h2>Pace de 7 é ruim? 10 km em 1 hora é bom? 5 km em 30 minutos é bom?</h2>
<p>Não existe pace ruim. Existe o seu pace de hoje. Pace de 7:00 /km é um ritmo comum para quem está começando ou corre por saúde, e muita gente completa provas assim. 10 km em 1 hora (6:00 /km) e 5 km em 30 minutos são marcas que muitos corredores amadores perseguem — mas elas não dizem se você é "bom" ou "ruim". Idade, peso, rotina, sono e há quanto tempo você corre mudam tudo.</p>
<p>A comparação que importa é com você mesmo de três meses atrás. Se o seu pace caiu, você melhorou — seja de 8:00 para 7:30 ou de 5:00 para 4:45.</p>

<h2>Como melhorar o pace: os treinos que funcionam</h2>
<h3>1. Mais corrida leve do que você imagina</h3>
<p>Parece contraditório, mas a base da velocidade é o volume em ritmo fácil, em que dá para conversar. É ele que desenvolve o condicionamento aeróbio. Uma referência usada por treinadores é a do 80/20: cerca de 80% do treino leve e 20% forte.</p>
<h3>2. Tiros (treino intervalado)</h3>
<p>Alternar trechos rápidos com trote ou caminhada ensina o corpo a sustentar ritmos mais fortes. Exemplo para começar: 6 a 8 tiros de 1 minuto forte com 1 a 2 minutos leves, uma vez por semana.</p>
<h3>3. Treino ritmado</h3>
<p>Correr de 15 a 30 minutos num ritmo firme — um pouco mais lento que o seu ritmo de prova — ensina a manter o pace do começo ao fim, sem largar rápido e quebrar.</p>
<h3>4. Subidas</h3>
<p>Subidas curtas, de 30 segundos a 1 minuto, dão força e potência às pernas com menos impacto que os tiros no plano.</p>
<h3>5. Musculação para as pernas e o core</h3>
<p>Agachamento, afundo, subida no banco, panturrilha e prancha, duas vezes por semana. Perna mais forte empurra o chão com mais eficiência e se cansa menos. Veja como combinar os dois em <a href="/blog/corrida-e-musculacao">corrida e musculação</a>.</p>
<h3>6. Técnica: cadência e postura</h3>
<p>Passos um pouco mais curtos e mais rápidos, com o pé tocando o chão perto da linha do quadril, gastam menos energia do que passadas longas "freando" à frente do corpo. Tronco estável, olhar para a frente, braços soltos.</p>
<h3>7. Consistência e paciência</h3>
<p>O pace melhora em semanas e meses, não em dias. Aumente volume e intensidade aos poucos e descanse: é no descanso que o corpo se adapta.</p>

<h2>Como correr mais rápido e cansar menos</h2>
<p>Cansar rápido costuma ter três causas: começar rápido demais, pouca base aeróbia e perna fraca. A solução é a mesma dos treinos acima — mais corrida leve, força e um ritmo inicial controlado. Na prova, os primeiros quilômetros devem parecer fáceis demais.</p>

<h2>Falta de fôlego: por que acontece e como melhorar</h2>
<p>Sentir falta de ar ao correr quase sempre é ritmo acima do seu condicionamento atual — não pulmão fraco. O fôlego melhora com os mesmos treinos acima, principalmente a corrida leve e constante, três vezes por semana ou mais. Não existe jeito de ganhar fôlego em uma semana nem remédio para isso; se a falta de ar vier com dor no peito, tontura ou chiado, procure um médico. Para a técnica de respirar, veja o guia de <a href="/blog/respiracao-durante-treino">respiração durante o treino</a>.</p>

<h2>Um exemplo prático: baixar o tempo na São Silvestre</h2>
<p>A Planilha 3 do <a href="/blog/treino-sao-silvestre-13-semanas">plano de treino da São Silvestre</a> junta tudo isso em 13 semanas: um treino de qualidade (tiros, ritmado ou subidas), um longo e duas corridas leves por semana. Para saber o seu tempo provável nos 15 km, use o <a href="/ferramentas/previsor-sao-silvestre">Previsor da São Silvestre</a>.</p>

<h2>Não se compare</h2>
<p>O pace do seu amigo, do influenciador ou do corredor do lado não tem nada a ver com o seu. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu pace é um plano que você consiga seguir por muito tempo — com aderência e progressão. Se quiser montar o seu comigo, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>`,
    faq: [
      { question: "O que é pace na corrida?", answer: "É o tempo que você leva para correr um quilômetro, em minutos por km. Pace de 6:00 /km significa um quilômetro a cada 6 minutos, ou 10 km/h." },
      { question: "Como calcular o pace?", answer: "Divida o tempo total pela distância. 10 km em 58 minutos dá 5,8 min/km, ou 5:48 /km. A Calculadora de Corrida do site faz a conta e mostra a velocidade em km/h." },
      { question: "Pace de 7 é ruim?", answer: "Não. 7:00 /km é um ritmo comum para quem está começando ou corre por saúde. O importante é a sua evolução em relação a você mesmo." },
      { question: "10 km em 1 hora é um bom tempo?", answer: "É uma marca que muitos corredores amadores buscam, equivalente a 6:00 /km. Mas não existe tempo bom ou ruim em absoluto: depende da sua idade, rotina e histórico." },
      { question: "O que fazer para diminuir o pace na corrida?", answer: "Correr bastante em ritmo leve, fazer um treino de qualidade por semana (tiros, ritmado ou subidas), musculação para pernas e core duas vezes por semana e aumentar a carga aos poucos." },
      { question: "Como ter mais fôlego para correr?", answer: "Corra com regularidade, a maior parte em ritmo leve, aumente o volume aos poucos e inclua um treino de tiros ou longão por semana. O fôlego melhora em semanas, não em dias." },
      { question: "Como correr mais rápido sem cansar?", answer: "Construa base com corrida leve, fortaleça as pernas e controle o ritmo no início: largar rápido demais é a causa mais comum de cansar cedo." },
    ],
  },
];
