import type { BlogPost } from "./blog";

/**
 * Guias de Hyrox nascidos do export do Answer the Public de "hyrox"
 * (23/10/2026): treino, estações e pesos, Hyrox x CrossFit, tênis, PFT e
 * calendário no Brasil.
 *
 * Mesma regra da cobertura do HYROX São Paulo: formato, pesos e datas só
 * entram com fonte oficial (hyrox.com, hyroxbrazil.com, rulebook) ou dois
 * veículos independentes. Tempo de prova e de Roxzone vêm de análises de
 * resultados, citadas pelo nome.
 *
 * Os prints da primeira página do Google para cada termo ainda não tinham
 * chegado quando os textos foram escritos (o Montinho pediu para seguir sem).
 * Quando chegarem, H2 e FAQ são conferidos contra o que ranqueia.
 */

const FONTE_FORMATO = `<li><a href="https://hyrox.com/the-fitness-race/" target="_blank" rel="noopener noreferrer">HYROX — The Fitness Race: formato, estações e pesos por categoria (oficial)</a></li>`;
const FONTE_REGRAS = `<li><a href="https://hyrox.com/rulebook/" target="_blank" rel="noopener noreferrer">HYROX — Rulebooks: individual, dupla, revezamento e adaptativo (oficial)</a></li>`;

export const HYROX_GUIAS_POSTS: BlogPost[] = [
  /* ───────────────────────── Treino ───────────────────────── */
  {
    slug: "treino-de-hyrox",
    title: "Treino de Hyrox: Planilha de 8 Semanas, WOD e Como Começar",
    metaTitle: "Treino de Hyrox: Planilha de 8 Semanas e WOD para Iniciante",
    metaDescription:
      "Treino de Hyrox com planilha de 8 semanas: corrida, força e simulado na mesma semana, WODs de Hyrox, a versão para iniciante e como treinar sem trenó.",
    excerpt:
      "Um treino de Hyrox junta corrida, força e corrida cansada na mesma semana. A planilha de 8 semanas, os WODs que mais se parecem com a prova e como adaptar na academia comum.",
    category: "Treinamento",
    date: "2026-10-23",
    updatedAt: "2026-10-23",
    readTime: "9 min",
    author: "Montinho",
    tags: ["treino de hyrox", "planilha hyrox", "hyrox workout", "wod hyrox", "treino hyrox iniciante", "hyrox na academia"],
    faq: [
      { question: "O que é um treino de Hyrox?", answer: "É o treino que prepara para a prova: corrida, força para as estações e, principalmente, corrida cansada, alternando 1 km de corrida com uma estação. Numa aula de Hyrox, o bloco principal costuma ser esse circuito." },
      { question: "Quantas vezes por semana treinar para o Hyrox?", answer: "De 4 a 5 sessões para quem já treina: 2 de força, 2 de corrida e 1 de corrida com estações. Quem está começando pode fazer 3 a 4, com a corrida cansada uma vez por semana." },
      { question: "Quanto tempo de treino para fazer o primeiro Hyrox?", answer: "Oito semanas bastam para quem já treina musculação ou corre e quer terminar a prova. Quem parte do zero ganha mais com 3 a 4 meses: primeiro a base de corrida e força, depois as 8 semanas específicas." },
      { question: "Quem faz Hyrox precisa fazer musculação?", answer: "Precisa. Trenó, avanço com saco, farmers carry e wall ball são força com o coração já alto. A musculação dá essa força e protege joelho, lombar e ombro nas semanas de treino." },
      { question: "Dá para treinar Hyrox na academia comum?", answer: "Dá para quase tudo: corrida, remo, wall ball, avanço com peso, farmers carry e burpee. O que costuma faltar é o trenó e o SkiErg; no lugar deles, leg press pesado ou empurrar um banco com anilhas, e remo com puxada de braço. Algumas sessões num box antes da prova completam o que faltou." },
      { question: "Dá para treinar Hyrox em casa?", answer: "A base, sim: corrida na rua, burpee broad jump, afundo com mochila, agachamento com salto e flexão. As estações com carga (trenó, remo, SkiErg, wall ball) pedem academia ou box." },
      { question: "O que é um WOD de Hyrox?", answer: "É o treino do dia no formato da prova. O clássico é alternar 1 km de corrida com uma estação, de 3 a 8 rodadas, em ritmo controlado. Outro comum é fazer meia prova: 4 km e 4 estações." },
      { question: "Simulado de Hyrox: quando fazer?", answer: "Um meio simulado (4 km + 4 estações) por volta da sexta semana e um simulado completo em ritmo controlado duas semanas antes da prova. Na última semana, não; ali o objetivo é chegar descansado." },
    ],
    content: `<p>Um treino de Hyrox não é só correr mais ou só levantar mais. A prova cobra as duas coisas ao mesmo tempo: <strong>oito trechos de 1 km de corrida, cada um seguido de uma estação</strong>, e quem treina as partes separadas chega no wall ball com a perna que nunca correu cansada. A planilha abaixo junta tudo na mesma semana.</p>

<h2>Resposta direta: como é o treino de Hyrox</h2>
<ul>
<li><strong>2 dias de força:</strong> agachamento, terra, avanço, remada e empurrar. É o que sustenta trenó, lunges e farmers carry.</li>
<li><strong>2 dias de corrida:</strong> um leve e mais longo, outro com tiros ou trechos de 1 km em ritmo de prova.</li>
<li><strong>1 dia de corrida cansada:</strong> 1 km de corrida alternado com uma estação. É o treino que mais se parece com a prova.</li>
<li><strong>1 a 2 dias de descanso.</strong> Sem eles, a semana seguinte começa com a perna pesada.</li>
</ul>
<p>Para saber que ritmo de corrida a sua meta pede, a calculadora abaixo soma corrida, estações e Roxzone.</p>

<h2>Planilha de treino Hyrox: 8 semanas</h2>
<p>Ritmo leve é o ritmo em que dá para conversar. "Estação" é qualquer uma das oito da prova, ou a adaptação da sua academia. A semana 4 é mais leve de propósito: é a que deixa o corpo absorver as três anteriores.</p>
<table>
<thead><tr><th>Semana</th><th>Força 1</th><th>Corrida 1</th><th>Corrida + estações</th><th>Força 2</th><th>Corrida 2</th></tr></thead>
<tbody>
<tr><td>1</td><td>Agachamento, terra romeno, remada — 3×10</td><td>30 min leve</td><td>4 × (1 km + 20 wall balls)</td><td>Afundo, desenvolvimento, puxada — 3×10</td><td>40 min leve</td></tr>
<tr><td>2</td><td>Agachamento, terra, remada — 4×8</td><td>6 × 400 m forte / 2 min leve</td><td>4 × (1 km + 500 m remo)</td><td>Afundo com carga, flexão, remada — 3×10</td><td>45 min leve</td></tr>
<tr><td>3</td><td>Agachamento, terra, remada — 4×8</td><td>5 × 1 km em ritmo de prova</td><td>5 × (1 km + estação)</td><td>Afundo, wall ball, prancha — 3×12</td><td>50 min leve</td></tr>
<tr><td>4</td><td>Força leve — metade das séries</td><td>30 min leve</td><td>3 × (1 km + estação)</td><td>Mobilidade + core</td><td>35 min leve</td></tr>
<tr><td>5</td><td>Agachamento frontal, terra, remada — 4×6</td><td>8 × 400 m forte</td><td>6 × (1 km + estação)</td><td>Afundo, burpee, wall ball — 3×12</td><td>55 min leve</td></tr>
<tr><td>6</td><td>Agachamento frontal, terra, remada — 4×6</td><td>4 × 1,5 km em ritmo de prova</td><td>Meio simulado: 4 km + 4 estações</td><td>Afundo com saco, trenó ou leg press — 4×10</td><td>60 min leve</td></tr>
<tr><td>7</td><td>Força — 3×6, carga mantida</td><td>6 × 1 km em ritmo de prova</td><td>Simulado completo em ritmo controlado</td><td>Mobilidade + core</td><td>45 min leve</td></tr>
<tr><td>8</td><td>Força leve — 2×5</td><td>20 min leve + 4 acelerações</td><td>3 × (1 km + estação) leve</td><td>Descanso</td><td>Prova</td></tr>
</tbody>
</table>
<p><strong>Quer imprimir?</strong> <a href="/downloads/planilha-treino-hyrox.pdf" download>Baixe a planilha de treino Hyrox em PDF</a>, com as mesmas 8 semanas.</p>

<h2>WOD de Hyrox: os treinos que mais se parecem com a prova</h2>
<ul>
<li><strong>Corrida + estação:</strong> 1 km de corrida e uma estação, de 3 a 8 rodadas. Comece com a estação mais leve que a da prova e aumente semana a semana.</li>
<li><strong>Meia prova:</strong> 4 km e 4 estações, na ordem oficial (SkiErg, sled push, sled pull, burpee broad jump) ou na segunda metade (remo, farmers carry, sandbag lunges, wall balls).</li>
<li><strong>Compromisso de corrida:</strong> 5 × 1 km no ritmo que você quer na prova, com 90 segundos de pausa. Se o último sair muito mais lento que o primeiro, o ritmo-alvo está otimista.</li>
<li><strong>Estação cansada:</strong> 400 m forte e logo em seguida 25 wall balls ou 50 m de avanço, de 4 a 6 vezes. Ensina a começar a estação sem esperar o fôlego voltar.</li>
</ul>
<p>Nenhum desses é "o treino oficial". A organização da prova tem conteúdos de treino próprios nos Training Clubs credenciados; os de cima são os formatos que eu uso para ensinar o corpo a fazer o que a prova pede.</p>

<h2>Treino de Hyrox para iniciantes</h2>
<p>Quem nunca correu 5 km sem parar ou nunca treinou força começa um passo antes da planilha:</p>
<ol>
<li><strong>Quatro semanas de base:</strong> 3 corridas leves por semana (pode alternar com caminhada) e 2 treinos de força de corpo inteiro.</li>
<li><strong>Depois, as 8 semanas</strong> acima, com metade das rodadas nas semanas 1 a 3.</li>
<li><strong>Prova em dupla</strong> na estreia: os 8 km são corridos juntos e as estações, divididas. Você conhece a prova sem o risco de quebrar no meio.</li>
</ol>
<p>Os pesos de cada categoria estão em <a href="/blog/estacoes-do-hyrox">estações do Hyrox</a>. Treine o movimento antes do volume: wall ball e burpee broad jump mal feitos cansam muito mais do que deveriam.</p>

<h2>Treino de Hyrox na academia (sem trenó)</h2>
<table>
<thead><tr><th>Estação</th><th>Na academia comum</th></tr></thead>
<tbody>
<tr><td>SkiErg</td><td>Puxada no pulley com os braços estendidos, em ritmo, ou remo</td></tr>
<tr><td>Sled push</td><td>Leg press pesado em séries longas, ou empurrar um banco com anilhas</td></tr>
<tr><td>Sled pull</td><td>Remada com corda na polia baixa, caminhando para trás</td></tr>
<tr><td>Burpee broad jump</td><td>Igual: só precisa de espaço</td></tr>
<tr><td>Remo</td><td>Igual, no remo ergométrico</td></tr>
<tr><td>Farmers carry</td><td>Igual, com halteres ou kettlebells</td></tr>
<tr><td>Sandbag lunges</td><td>Afundo andando com anilha ou halter no ombro</td></tr>
<tr><td>Wall balls</td><td>Igual, com a bola; sem alvo, agachamento com arremesso de medicine ball</td></tr>
</tbody>
</table>
<p>Se não tiver nenhum lugar com trenó, vale pagar algumas diárias num box nas semanas 5 a 7. É a estação que mais surpreende quem treina só na academia. Em Alphaville e região, os lugares estão em <a href="/blog/hyrox-alphaville-onde-treinar">onde treinar Hyrox em Alphaville</a>.</p>

<h2>Treino de Hyrox em casa</h2>
<p>Em casa dá para manter a base nas semanas em que a academia não cabe: corrida na rua, burpee broad jump, afundo com mochila carregada, agachamento com salto, flexão e prancha. O que não dá é a carga das estações. Use a casa para não perder a semana, não para substituir o treino inteiro.</p>

<h2>O erro mais comum: treinar as partes separadas</h2>
<p>Quem vem da corrida treina 10 km e chega no trenó sem perna. Quem vem da musculação empurra o trenó bem e anda na quinta corrida. O treino que corrige os dois é o mesmo: <strong>correr logo depois da estação</strong>, toda semana. É o dia da planilha que não pode sair.</p>

<h2>Preparação com acompanhamento</h2>
<p>A planilha é igual para todo mundo; a semana de cada um não é. Quando você falta no dia da corrida cansada, quando a carga do agachamento para de subir ou quando o ritmo de prova sai mais lento que o planejado, alguém precisa decidir o que muda. Eu monto a preparação para o Hyrox e ajusto conforme o que acontece em cada treino, na <a href="/consultoria-online">consultoria online</a> ou presencialmente nos locais de <a href="/onde-atendo">onde atendo</a>.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/estacoes-do-hyrox">Estações do Hyrox: ordem, pesos por categoria e técnica</a></li>
<li><a href="/blog/hyrox-o-que-e">Hyrox: o que é e como funciona</a></li>
<li><a href="/blog/hyrox-vs-crossfit">Hyrox vs CrossFit: qual a diferença</a></li>
<li><a href="/blog/treino-hibrido-forca-corrida-2025">Treino híbrido: como combinar força e corrida</a></li>
<li><a href="/ferramentas/calculadora-tempo-hyrox">Calculadora de Tempo do Hyrox</a></li>
</ul>

<h2>Fontes</h2>
<ul>
${FONTE_FORMATO}
</ul>`,
  },

  /* ───────────────────────── Estações ───────────────────────── */
  {
    slug: "estacoes-do-hyrox",
    title: "Estações do Hyrox: Ordem, Pesos por Categoria e Técnica",
    metaTitle: "Estações do Hyrox: Ordem, Pesos por Categoria e Técnica",
    metaDescription:
      "As 8 estações do Hyrox na ordem da prova, o peso do sled push, sled pull, wall ball e sandbag em cada categoria (Open, Pro, dupla) e como treinar cada uma.",
    excerpt:
      "SkiErg, sled push, sled pull, burpee broad jump, remo, farmers carry, sandbag lunges e wall balls: a ordem, os pesos oficiais por categoria e o que treinar em cada estação.",
    category: "Treinamento",
    date: "2026-10-23",
    updatedAt: "2026-10-23",
    readTime: "8 min",
    author: "Montinho",
    tags: ["estações hyrox", "pesos hyrox", "sled push hyrox", "sled pull hyrox", "skierg hyrox", "wall ball hyrox", "hyrox categorias", "hyrox open pro"],
    faq: [
      { question: "Quais são os exercícios do Hyrox?", answer: "São 8 estações, sempre nesta ordem: SkiErg (1.000 m), sled push (50 m), sled pull (50 m), burpee broad jump (80 m), remo (1.000 m), farmers carry (200 m), sandbag lunges (100 m) e wall balls (100 repetições). Antes de cada uma, 1 km de corrida." },
      { question: "Qual o peso do sled push no Hyrox?", answer: "Pelo site oficial, 102 kg no Open feminino, 152 kg no Open masculino e no Pro feminino, e 202 kg no Pro masculino, já contando o trenó." },
      { question: "Qual o peso do sled pull no Hyrox?", answer: "78 kg no Open feminino, 103 kg no Open masculino e no Pro feminino, e 153 kg no Pro masculino, com o trenó incluído." },
      { question: "Qual o peso da wall ball no Hyrox?", answer: "4 kg no Open feminino, 6 kg no Open masculino e no Pro feminino, e 9 kg no Pro masculino. São 100 repetições." },
      { question: "Qual a diferença entre Hyrox Open e Pro?", answer: "O percurso é o mesmo; o Pro usa cargas mais pesadas. O Pro feminino usa as cargas do Open masculino, e o Pro masculino tem as mais pesadas da prova. Para a primeira prova, o Open é o caminho." },
      { question: "Hyrox é em dupla?", answer: "Pode ser. Na dupla, os dois correm juntos os 8 km e dividem as estações como quiserem. Também existe o revezamento, em que quatro pessoas dividem a prova e cada uma faz 2 km de corrida e duas estações." },
      { question: "Quais são as categorias do Hyrox?", answer: "Individual Open e Pro, feminino e masculino; dupla feminina, masculina e mista, também em Open e Pro; e revezamento de quatro pessoas, feminino, masculino e misto. Há ainda a categoria adaptativa, com regulamento próprio." },
      { question: "Qual a estação mais difícil do Hyrox?", answer: "Para quem nunca treinou com trenó, costuma ser o sled push ou o sled pull. Para quem já chega cansado das corridas, as wall balls, que fecham a prova. Depende de onde você é mais fraco: é ali que vale treinar." },
    ],
    content: `<p>O Hyrox tem <strong>8 estações, sempre na mesma ordem</strong>, em qualquer prova do mundo. Antes de cada uma, 1 km de corrida. O que muda de uma categoria para outra é o peso: o percurso é igual para todo mundo.</p>

<h2>As 8 estações do Hyrox, na ordem</h2>
<ol>
<li><strong>SkiErg — 1.000 m.</strong> Puxada no aparelho de esqui, com braços, tronco e quadril.</li>
<li><strong>Sled push — 50 m.</strong> Empurrar o trenó, em 2 trechos de 25 m.</li>
<li><strong>Sled pull — 50 m.</strong> Puxar o trenó com a corda, em 2 trechos de 25 m.</li>
<li><strong>Burpee broad jump — 80 m.</strong> Burpee seguido de salto à frente, até completar a distância.</li>
<li><strong>Remo — 1.000 m.</strong> No remo ergométrico.</li>
<li><strong>Farmers carry — 200 m.</strong> Carregar dois kettlebells.</li>
<li><strong>Sandbag lunges — 100 m.</strong> Avanço andando com o saco de areia nos ombros.</li>
<li><strong>Wall balls — 100 repetições.</strong> Agachar e arremessar a bola num alvo na parede.</li>
</ol>
<p>Quer saber quanto tempo cada estação vai somar na sua prova? A calculadora abaixo faz a conta, estação por estação.</p>

<h2>Pesos do Hyrox por categoria</h2>
<p>Pesos individuais, do site oficial do Hyrox. No trenó, o peso já inclui o próprio trenó.</p>
<table>
<thead><tr><th>Estação</th><th>Open feminino</th><th>Pro feminino</th><th>Open masculino</th><th>Pro masculino</th></tr></thead>
<tbody>
<tr><td>Sled push (50 m)</td><td>102 kg</td><td>152 kg</td><td>152 kg</td><td>202 kg</td></tr>
<tr><td>Sled pull (50 m)</td><td>78 kg</td><td>103 kg</td><td>103 kg</td><td>153 kg</td></tr>
<tr><td>Farmers carry (200 m)</td><td>2 × 16 kg</td><td>2 × 24 kg</td><td>2 × 24 kg</td><td>2 × 32 kg</td></tr>
<tr><td>Sandbag lunges (100 m)</td><td>10 kg</td><td>20 kg</td><td>20 kg</td><td>30 kg</td></tr>
<tr><td>Wall balls (100)</td><td>4 kg</td><td>6 kg</td><td>6 kg</td><td>9 kg</td></tr>
</tbody>
</table>
<p>SkiErg, burpee broad jump e remo não têm carga: são distância.</p>
<ul>
<li><strong>Dupla:</strong> a dupla feminina usa os pesos do Open feminino; a masculina e a mista, os do Open masculino. Os dois correm juntos e dividem as estações como quiserem.</li>
<li><strong>Revezamento:</strong> quatro pessoas, cada uma com 2 km de corrida e duas estações. No misto, cada estação usa o peso de quem a executa.</li>
<li><strong>Open ou Pro?</strong> Para a primeira prova, o Open. O Pro é para quem já fez a prova e quer carga maior.</li>
</ul>

<h2>Como treinar cada estação</h2>
<h3>SkiErg</h3>
<p>A força vem do quadril e do tronco, não só dos braços: dobre levemente o quadril a cada puxada. Quem puxa só com o braço chega no trenó com o ombro queimado. No treino, blocos de 250 m em ritmo de prova.</p>
<h3>Sled push</h3>
<p>Braços estendidos ou semiflexionados, corpo inclinado e passos curtos e rápidos. É força de perna com o coração alto. Na academia sem trenó, leg press pesado em séries longas é a adaptação mais próxima.</p>
<h3>Sled pull</h3>
<p>Puxe a corda mão sobre mão com o corpo baixo e as pernas ajudando; a corda vai se acumulando atrás de você. Quem só puxa com o braço perde tempo. Remada na polia com corda, caminhando para trás, treina o padrão.</p>
<h3>Burpee broad jump</h3>
<p>Ritmo constante vence pressa: quem começa rápido para no meio. Saltos curtos e regulares, sem pausa no chão. Treine 20 a 30 metros por série antes de juntar com corrida.</p>
<h3>Remo</h3>
<p>Empurre com as pernas primeiro, depois o tronco, depois os braços. É a estação para recuperar um pouco o fôlego sem perder tempo; não vale gastar tudo nela.</p>
<h3>Farmers carry</h3>
<p>Ombros para baixo, tronco firme e passos rápidos. O que costuma falhar é a pegada: treine carregamentos longos e segurar peso parado.</p>
<h3>Sandbag lunges</h3>
<p>O joelho de trás encosta perto do chão e o tronco fica de pé. É a estação em que a perna já cansada mais sofre; treine afundo com carga duas vezes por semana nas semanas de preparação.</p>
<h3>Wall balls</h3>
<p>Agachamento completo e a bola sai com a força da perna, não do braço. Divida as 100 em séries que você consegue sustentar (por exemplo, 10 séries de 10, ou 25-25-20-15-15) e descanse pouco entre elas.</p>

<h2>A ordem muda o treino</h2>
<p>As três primeiras estações (SkiErg e os dois trenós) cansam braço, costas e perna logo no começo. As duas últimas (lunges e wall balls) caem sobre uma perna que já correu 7 km. Por isso, treinar as estações isoladas, descansado, engana: treine pelo menos parte delas logo depois de correr. O passo a passo da semana está em <a href="/blog/treino-de-hyrox">treino de Hyrox</a>.</p>

<h2>Preparação com acompanhamento</h2>
<p>Cada pessoa tem uma estação que derruba o tempo: o trenó para quem vem da corrida, a corrida para quem vem da musculação, a pegada para quase todo mundo no farmers carry. Eu observo onde você perde tempo, ajusto o treino da semana e acompanho a evolução até a prova, na <a href="/consultoria-online">consultoria online</a> ou presencialmente nos locais de <a href="/onde-atendo">onde atendo</a>.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/treino-de-hyrox">Treino de Hyrox: planilha de 8 semanas</a></li>
<li><a href="/blog/hyrox-o-que-e">Hyrox: o que é e como funciona</a></li>
<li><a href="/blog/hyrox-pft">Hyrox PFT: o que é o teste e como fazer</a></li>
<li><a href="/ferramentas/calculadora-calorias-hyrox">Calculadora de Calorias no Hyrox</a></li>
</ul>

<h2>Fontes</h2>
<ul>
${FONTE_FORMATO}
${FONTE_REGRAS}
</ul>`,
  },

  /* ───────────────────────── Hyrox vs CrossFit ───────────────────────── */
  {
    slug: "hyrox-vs-crossfit",
    title: "Hyrox vs CrossFit: Qual a Diferença e Qual Escolher",
    metaTitle: "Hyrox vs CrossFit: Qual a Diferença e Qual Escolher",
    metaDescription:
      "Hyrox e CrossFit não são a mesma coisa: um é prova fixa de corrida e estações, o outro muda todo dia. Veja a diferença, qual emagrece mais e qual escolher.",
    excerpt:
      "O Hyrox é uma prova fixa: 8 km de corrida e 8 estações, iguais no mundo todo. O CrossFit é um método de treino que muda todo dia. A diferença, o que é a aula de Hyrox no box e qual escolher.",
    category: "Treinamento",
    date: "2026-10-23",
    updatedAt: "2026-10-23",
    readTime: "7 min",
    author: "Montinho",
    tags: ["hyrox vs crossfit", "hyrox e crossfit diferença", "o que é hyrox no crossfit", "hyrox crossfit", "hyrox ou crossfit"],
    faq: [
      { question: "Hyrox é CrossFit?", answer: "Não. O Hyrox é uma prova com formato fixo, criada na Alemanha e sem ligação com a marca CrossFit. Muitos boxes de CrossFit oferecem aula de Hyrox porque já têm boa parte do equipamento, e é por isso que os dois nomes aparecem juntos." },
      { question: "O que é Hyrox no CrossFit?", answer: "É a aula de Hyrox dada dentro de um box: corrida alternada com estações da prova, como remo, wall ball, burpee broad jump e trenó, quando o box tem. Serve para quem quer se preparar para a prova ou só gosta do formato." },
      { question: "Qual a diferença entre Hyrox e CrossFit?", answer: "O Hyrox é sempre a mesma prova: 8 km de corrida e 8 estações, na mesma ordem. O CrossFit é um método de treino que muda todo dia e inclui movimentos técnicos, como levantamento olímpico e ginástica. No Hyrox, cerca de metade do tempo é corrida." },
      { question: "Qual emagrece mais, Hyrox ou CrossFit?", answer: "Os dois gastam bem numa hora de treino. Quem emagrece mais é quem consegue treinar mais semanas seguidas, com a alimentação em ordem. Escolha o que você vai querer repetir três vezes por semana." },
      { question: "Hyrox ou CrossFit: qual é melhor para iniciante?", answer: "O Hyrox costuma ser mais fácil de aprender: os movimentos são poucos e simples, e a prova é sempre igual. O CrossFit exige mais técnica no começo, mas também é adaptado para iniciantes num bom box." },
      { question: "Dá para fazer Hyrox e CrossFit juntos?", answer: "Dá, e é comum. O CrossFit dá força, técnica e condicionamento; o Hyrox pede, além disso, corrida. Quem faz CrossFit e quer o Hyrox costuma precisar de duas corridas a mais por semana." },
      { question: "Hyrox ou musculação?", answer: "Não é uma escolha. A musculação dá a força que o Hyrox pede nos trenós, no avanço e no wall ball, e protege as articulações. Quem se prepara para o Hyrox mantém dois dias de força na semana." },
    ],
    content: `<p>Hyrox e CrossFit aparecem juntos o tempo todo, e não é à toa: muitos boxes de CrossFit dão aula de Hyrox. Mas são coisas diferentes. <strong>O Hyrox é uma prova com formato fixo; o CrossFit é um método de treino que muda todo dia.</strong></p>

<h2>Resposta direta: qual a diferença entre Hyrox e CrossFit</h2>
<table>
<thead><tr><th></th><th>Hyrox</th><th>CrossFit</th></tr></thead>
<tbody>
<tr><td>O que é</td><td>Uma prova (fitness race)</td><td>Um método de treino</td></tr>
<tr><td>Formato</td><td>Sempre igual: 8 × (1 km de corrida + 1 estação)</td><td>Muda todo dia (o WOD)</td></tr>
<tr><td>Corrida</td><td>8 km por prova, cerca de metade do tempo</td><td>Aparece em alguns treinos</td></tr>
<tr><td>Técnica</td><td>Poucos movimentos, simples</td><td>Levantamento olímpico, ginástica, barra</td></tr>
<tr><td>Comparação</td><td>Tempo de prova: dá para comparar com você mesmo de uma prova para outra</td><td>Benchmarks e competições, como o Open</td></tr>
</tbody>
</table>
<p>Se você chegou até aqui querendo saber quanto cada um gasta, a calculadora abaixo faz a conta da prova de Hyrox pelo seu tempo e peso.</p>

<h2>Hyrox é CrossFit?</h2>
<p>Não. O Hyrox nasceu em Hamburgo, na Alemanha, e é organizado por uma empresa própria, sem ligação com a marca CrossFit. O que os une é o equipamento: remo, wall ball, kettlebell e espaço para burpee estão em quase todo box. Por isso tantos boxes oferecem a aula.</p>

<h2>O que é Hyrox no CrossFit</h2>
<p>É a <strong>aula de Hyrox dada dentro do box</strong>. Em vez do WOD do dia, a aula alterna corrida com as estações da prova: SkiErg, trenó (quando o box tem), burpee broad jump, remo, farmers carry, avanço com saco e wall ball. Alguns boxes são Training Clubs credenciados pela organização da prova; outros só usam o formato. Para conferir, há o <a href="https://hyrox.com/gym-partners" target="_blank" rel="noopener noreferrer">buscador oficial de Training Clubs</a>.</p>

<h2>A prova de Hyrox x o treino de CrossFit</h2>
<p>No Hyrox, você sabe hoje o que vai fazer na prova daqui a três meses: os mesmos 8 km e as mesmas oito estações, na mesma ordem, com o mesmo peso da sua categoria. Isso muda o treino: dá para medir a evolução pelo tempo e treinar exatamente o que a prova pede. O detalhe de cada estação está em <a href="/blog/estacoes-do-hyrox">estações do Hyrox</a>.</p>
<p>No CrossFit, a graça é a variação. O treino de hoje não é o de amanhã, e a preparação é para "qualquer coisa": força, ginástica, levantamento, condicionamento. Exige mais técnica no começo, e um bom coach faz diferença.</p>

<h2>Qual emagrece mais: Hyrox ou CrossFit?</h2>
<p>Numa hora de treino, os dois gastam bem; o Hyrox tende a ter mais tempo em movimento contínuo e menos pausa para técnica. Mas a prova é um dia, e uma aula é uma hora. O que emagrece é a soma das semanas: <strong>quantas vezes você treina, por quantos meses, e o que come</strong>. Escolha o que você vai querer repetir. A conta do gasto de uma aula de box está na <a href="/ferramentas/calculadora-calorias-crossfit">Calculadora de Calorias no CrossFit</a>, e o que faz o CrossFit ajudar no emagrecimento está em <a href="/blog/crossfit-emagrece">CrossFit emagrece?</a>.</p>

<h2>Qual escolher</h2>
<ul>
<li><strong>Hyrox,</strong> se você gosta de correr, quer uma meta com data e prefere poucos movimentos bem treinados.</li>
<li><strong>CrossFit,</strong> se você gosta de variedade, quer aprender levantamento e ginástica e se motiva com o grupo da aula.</li>
<li><strong>Os dois,</strong> se você já faz CrossFit e quer uma prova: acrescente duas corridas por semana e treine as estações que o box não tem.</li>
</ul>
<p>E nos dois casos: musculação continua valendo. É ela que dá a força que trenó, avanço e wall ball pedem e que segura joelho, lombar e ombro. A comparação com a academia está em <a href="/blog/crossfit-vs-musculacao">CrossFit vs musculação</a>.</p>

<h2>Outras comparações</h2>
<ul>
<li><strong>Hyrox x corrida de rua:</strong> o Hyrox tem 8 km, mas picados e com força no meio. Quem corre bem 10 km não necessariamente corre bem os 8 km do Hyrox.</li>
<li><strong>Hyrox x treino funcional:</strong> o funcional usa movimentos parecidos, mas sem a prova como objetivo. Uma aula de Hyrox é um funcional com formato de prova.</li>
</ul>

<h2>Preparação com acompanhamento</h2>
<p>Quem vem do CrossFit costuma chegar ao Hyrox com força e técnica sobrando e corrida faltando; quem vem da corrida, o contrário. Eu olho de onde você parte, monto a semana para o que falta e ajusto conforme a resposta de cada treino, na <a href="/consultoria-online">consultoria online</a> ou presencialmente nos locais de <a href="/onde-atendo">onde atendo</a>.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/hyrox-o-que-e">Hyrox: o que é e como funciona</a></li>
<li><a href="/blog/treino-de-hyrox">Treino de Hyrox: planilha de 8 semanas</a></li>
<li><a href="/blog/crossfit-vs-musculacao">CrossFit vs musculação</a></li>
<li><a href="/blog/academia-com-cross-training-alphaville">Academia com cross training em Alphaville</a></li>
</ul>

<h2>Fontes</h2>
<ul>
${FONTE_FORMATO}
<li><a href="https://www.crossfit.com/what-is-crossfit" target="_blank" rel="noopener noreferrer">CrossFit — What is CrossFit? (oficial)</a></li>
<li><a href="https://en.wikipedia.org/wiki/Hyrox" target="_blank" rel="noopener noreferrer">Wikipedia — Hyrox (origem em Hamburgo e fundadores)</a></li>
</ul>`,
  },

  /* ───────────────────────── Tênis ───────────────────────── */
  {
    slug: "tenis-para-hyrox",
    title: "Tênis para Hyrox: Como Escolher Para Correr e Para as Estações",
    metaTitle: "Tênis para Hyrox: Como Escolher (Masculino e Feminino)",
    metaDescription:
      "Qual tênis usar no Hyrox: o que ele precisa ter para os 8 km de corrida, o trenó e os lunges, por que tantos usam Puma e o erro de estrear tênis na prova.",
    excerpt:
      "O tênis do Hyrox precisa correr 8 km e segurar o trenó, o avanço e o wall ball. O que olhar, o que evitar, a parceria com a Puma e por que nunca estrear tênis no dia.",
    category: "Treinamento",
    date: "2026-10-23",
    updatedAt: "2026-10-23",
    readTime: "6 min",
    author: "Montinho",
    tags: ["tenis para hyrox", "tenis hyrox", "melhor tenis para hyrox", "tenis hyrox feminino", "tenis hyrox puma", "roupa hyrox"],
    faq: [
      { question: "Qual o melhor tênis para Hyrox?", answer: "O que você já usou em treinos de corrida com estações e não te incomodou. Ele precisa amortecer o suficiente para 8 km, ser estável no avanço e no wall ball e ter sola que segure no trenó. Não existe um modelo certo para todo mundo." },
      { question: "Pode usar tênis de corrida no Hyrox?", answer: "Pode, e é o que a maioria usa. O cuidado é com tênis muito alto e macio, que balança no avanço e no wall ball, e com sola lisa, que escorrega no trenó." },
      { question: "Pode usar tênis de CrossFit no Hyrox?", answer: "Pode. É estável nas estações, mas costuma amortecer menos para os 8 km. Para quem corre pouco, pesa no fim da prova; para quem é leve e corre bem, funciona." },
      { question: "Por que o tênis do Hyrox é da Puma?", answer: "A Puma é a parceira oficial de calçado e roupa das provas de Hyrox desde 2024, com uma linha de tênis de corrida com as cores da prova. Não é obrigatório usar Puma: cada atleta escolhe o próprio tênis." },
      { question: "Tênis para Hyrox feminino é diferente?", answer: "Os critérios são os mesmos: amortecimento para correr, estabilidade e aderência. O que muda é a forma do pé; experimente com a meia que vai usar na prova." },
      { question: "O que vestir no Hyrox?", answer: "Roupa de treino que você já testou correndo e agachando: short ou legging que não desce no avanço, camiseta ou top que não prende o braço no SkiErg e meia que não escorrega dentro do tênis. Nada estreia no dia." },
    ],
    content: `<p>O tênis do Hyrox tem um trabalho que nenhum tênis faz sozinho: <strong>correr 8 km e, no intervalo de cada quilômetro, empurrar trenó, avançar com saco e agachar 100 vezes</strong>. Por isso não existe "o" tênis certo. Existe o que funciona para o seu jeito de fazer a prova.</p>

<h2>Resposta direta: como escolher o tênis para Hyrox</h2>
<ul>
<li><strong>Amortecimento médio:</strong> o suficiente para 8 km de corrida, sem ser tão alto e macio que balance no avanço e no wall ball.</li>
<li><strong>Estabilidade:</strong> o calcanhar não pode "sair" do tênis no lunge nem no burpee broad jump.</li>
<li><strong>Sola com aderência:</strong> no sled push, o pé precisa segurar no piso da pista do trenó.</li>
<li><strong>Já testado:</strong> pelo menos três treinos de corrida com estações antes da prova.</li>
</ul>

<h2>O que cada parte da prova pede do tênis</h2>
<table>
<thead><tr><th>Parte da prova</th><th>O que o tênis precisa</th></tr></thead>
<tbody>
<tr><td>8 × 1 km de corrida</td><td>Amortecimento e conforto para correr cansado</td></tr>
<tr><td>Sled push e sled pull</td><td>Sola que não escorrega e não desmancha na hora de empurrar</td></tr>
<tr><td>Burpee broad jump</td><td>Firmeza para aterrissar do salto dezenas de vezes</td></tr>
<tr><td>Sandbag lunges</td><td>Estabilidade lateral, com o joelho de trás quase no chão</td></tr>
<tr><td>Wall balls</td><td>Base firme para agachar fundo 100 vezes</td></tr>
</tbody>
</table>
<p>Como a corrida é cerca de metade do tempo, a maioria das pessoas usa tênis de corrida. Quem corre menos e sofre mais nas estações às vezes prefere um tênis de treino mais firme. O que decide é onde você perde mais tempo: o detalhe de cada estação está em <a href="/blog/estacoes-do-hyrox">estações do Hyrox</a>.</p>

<h2>Tênis de corrida, de treino ou de CrossFit?</h2>
<ul>
<li><strong>Corrida:</strong> melhor nos 8 km. Evite os de placa e espuma muito alta se você balança no avanço.</li>
<li><strong>Treino/CrossFit:</strong> melhor no trenó, no lunge e no wall ball. Amortece menos: quem é mais pesado ou corre devagar sente no fim.</li>
<li><strong>Meio-termo:</strong> tênis de corrida de uso diário, com base mais larga, é o que muita gente acaba usando.</li>
</ul>
<p>Os critérios gerais para escolher um tênis de treino estão em <a href="/blog/como-escolher-tenis-para-treinar">como escolher tênis para treinar</a>.</p>

<h2>Por que tanta gente usa Puma no Hyrox</h2>
<p>A Puma é a <strong>parceira oficial de calçado e roupa</strong> das provas de Hyrox desde 2024, com versões de tênis de corrida da marca com as cores do Hyrox (no anúncio da parceria, Velocity Nitro e Deviate Nitro). Por isso o nome aparece em tanta busca. Não é regra: cada atleta usa o tênis que quiser, e o melhor é aquele em que você já correu cansado.</p>

<h2>Tênis para Hyrox feminino e masculino</h2>
<p>Os critérios são os mesmos. O que muda é a forma do pé: largura, volume e o drop (a diferença de altura entre calcanhar e ponta) que você está acostumada ou acostumado a usar. Experimente no fim do dia, quando o pé está um pouco mais inchado, e com a meia da prova.</p>

<h2>O erro que mais custa: estrear no dia</h2>
<p>Tênis novo, meia nova, roupa nova: tudo isso estreia no treino, não na prova. O tênis que parece ótimo na loja pode fazer bolha no sexto quilômetro ou escorregar no trenó. Faça pelo menos um treino longo de corrida e estações com o conjunto completo. A reta final da preparação está em <a href="/blog/treino-de-hyrox">treino de Hyrox</a>.</p>

<h2>O que vestir no Hyrox</h2>
<ul>
<li><strong>Short ou legging</strong> que não desce nem sobe no avanço e no wall ball.</li>
<li><strong>Camiseta, regata ou top</strong> que não prende o braço no SkiErg e no remo.</li>
<li><strong>Meia</strong> de corrida que não escorrega dentro do tênis.</li>
<li><strong>Relógio</strong> ajuda a controlar o pace nas corridas; o cronômetro que vale é o oficial, pelo chip da prova.</li>
</ul>

<h2>Preparação com acompanhamento</h2>
<p>Tênis resolve conforto; o tempo vem do treino. Quando a corrida cai no quinto quilômetro ou o trenó trava, eu vejo onde está o problema, ajusto a semana e acompanho até a prova, na <a href="/consultoria-online">consultoria online</a> ou presencialmente nos locais de <a href="/onde-atendo">onde atendo</a>.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/estacoes-do-hyrox">Estações do Hyrox: ordem, pesos e técnica</a></li>
<li><a href="/blog/treino-de-hyrox">Treino de Hyrox: planilha de 8 semanas</a></li>
<li><a href="/blog/como-escolher-tenis-para-treinar">Como escolher tênis para treinar</a></li>
<li><a href="/blog/hyrox-o-que-e">Hyrox: o que é e como funciona</a></li>
<li><a href="/ferramentas/calculadora-tempo-hyrox">Calculadora de Tempo do Hyrox</a></li>
</ul>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.businesswire.com/news/home/20240603537016/de" target="_blank" rel="noopener noreferrer">Business Wire — PUMA anuncia parceria global com o HYROX (2024)</a></li>
<li><a href="https://www.theindustry.fashion/puma-announces-global-partnership-with-racing-programme-hyrox/" target="_blank" rel="noopener noreferrer">TheIndustry.fashion — Puma announces global partnership with racing programme Hyrox</a></li>
${FONTE_FORMATO}
</ul>`,
  },

  /* ───────────────────────── PFT ───────────────────────── */
  {
    slug: "hyrox-pft",
    title: "Hyrox PFT: o Que É o Teste, Como Funciona e o Que o Tempo Diz",
    metaTitle: "Hyrox PFT: o Que É o Teste e Como Funciona",
    metaDescription:
      "O PFT do Hyrox é o teste físico oficial dos Training Clubs: corrida, burpee, avanço, remo, flexão e wall ball. Veja o formato e o que o tempo indica.",
    excerpt:
      "O PFT (Physical Fitness Test) é uma versão curta do Hyrox feita nos Training Clubs. O formato, os pesos, o que o seu tempo indica sobre a categoria e como se preparar.",
    category: "Treinamento",
    date: "2026-10-23",
    updatedAt: "2026-10-23",
    readTime: "5 min",
    author: "Montinho",
    tags: ["hyrox pft", "pft hyrox", "o que é hyrox pft", "physical fitness test hyrox", "teste hyrox"],
    faq: [
      { question: "O que é o PFT do Hyrox?", answer: "É o Physical Fitness Test, um teste físico padronizado do Hyrox feito nos Training Clubs. É uma versão curta da prova que serve para conhecer o formato e ter ideia de qual categoria escolher na primeira prova." },
      { question: "Como é o PFT do Hyrox?", answer: "Seis exercícios seguidos, sem corrida entre eles: 1.000 m de corrida, 50 burpee broad jumps, 100 afundos parados, 1.000 m de remo, 30 flexões com as mãos saindo do chão e 100 wall balls (6 kg para homens e 4 kg para mulheres)." },
      { question: "Quanto tempo dura o PFT?", answer: "Depende do condicionamento. A página do Hyrox no Reino Unido usa o tempo como referência de categoria: de 15 a 25 minutos aponta para o Pro e de 25 a 35, para o Open. Quem está começando costuma passar dos 35." },
      { question: "O PFT é obrigatório para fazer o Hyrox?", answer: "Não. Não existe índice nem classificação para se inscrever: qualquer pessoa pode escolher a categoria. O PFT é só uma referência." },
      { question: "Onde fazer o PFT do Hyrox no Brasil?", answer: "Nos Training Clubs credenciados que oferecem o teste. Procure no buscador oficial de Training Clubs e pergunte direto ao clube se há data de PFT." },
      { question: "Quanto custa o PFT?", answer: "Muda por clube e por evento. Pergunte ao Training Club antes se há cobrança e se a vaga precisa ser reservada." },
    ],
    content: `<p>O PFT do Hyrox é o <strong>Physical Fitness Test</strong>: um teste físico padronizado, feito nos Training Clubs, que funciona como uma versão curta da prova. Serve para conhecer o formato e ter uma ideia de qual categoria escolher na primeira inscrição.</p>

<h2>Resposta direta: como é o PFT do Hyrox</h2>
<p>São seis exercícios seguidos, <strong>sem trechos de corrida entre eles</strong>:</p>
<ol>
<li><strong>1.000 m de corrida</strong> (na rua ou na esteira, conforme o clube);</li>
<li><strong>50 burpee broad jumps;</strong></li>
<li><strong>100 afundos parados</strong> (sem andar);</li>
<li><strong>1.000 m de remo;</strong></li>
<li><strong>30 flexões</strong> com as mãos saindo do chão na descida;</li>
<li><strong>100 wall balls</strong> — 6 kg para homens e 4 kg para mulheres.</li>
</ol>
<p>Não tem tempo limite: o objetivo é terminar e anotar o seu tempo.</p>

<h2>O que o tempo do PFT indica</h2>
<p>A página oficial do Hyrox no Reino Unido usa o tempo do PFT como referência para a primeira inscrição:</p>
<table>
<thead><tr><th>Tempo no PFT</th><th>Categoria sugerida</th></tr></thead>
<tbody>
<tr><td>15 a 25 minutos</td><td>Pro</td></tr>
<tr><td>25 a 35 minutos</td><td>Open</td></tr>
<tr><td>Acima de 35 minutos</td><td>Open, de preferência em dupla na estreia</td></tr>
</tbody>
</table>
<p>É uma referência, não uma regra: o Hyrox não tem índice nem classificação para se inscrever, e qualquer pessoa pode escolher a categoria. O PFT não tem trenó, SkiErg nem farmers carry; quem é fraco nessas estações pode ir bem no teste e sofrer na prova.</p>

<h2>PFT x prova de Hyrox</h2>
<table>
<thead><tr><th></th><th>PFT</th><th>Prova</th></tr></thead>
<tbody>
<tr><td>Corrida</td><td>1 km, no começo</td><td>8 km, em 8 trechos de 1 km</td></tr>
<tr><td>Estações</td><td>5, sem carga pesada</td><td>8, com trenó e carregamento</td></tr>
<tr><td>Duração</td><td>De 15 a mais de 35 min</td><td>Em geral, de 1 a 2 horas</td></tr>
<tr><td>Onde</td><td>No Training Club</td><td>Num evento oficial</td></tr>
</tbody>
</table>
<p>As oito estações da prova e os pesos de cada categoria estão em <a href="/blog/estacoes-do-hyrox">estações do Hyrox</a>.</p>

<h2>Onde fazer o PFT</h2>
<p>O PFT é oferecido nos <strong>Training Clubs credenciados</strong> pela organização da prova, geralmente em datas marcadas. No Brasil, confira no <a href="https://hyrox.com/gym-partners" target="_blank" rel="noopener noreferrer">buscador oficial de Training Clubs</a> e pergunte direto ao clube se há data de teste. Em Alphaville e região, os lugares que oferecem aula de Hyrox estão em <a href="/blog/hyrox-alphaville-onde-treinar">onde treinar Hyrox em Alphaville</a>.</p>

<h2>Como se preparar para o PFT</h2>
<ul>
<li><strong>Wall ball e burpee broad jump:</strong> são os dois que mais derrubam o tempo. Treine a técnica antes do volume.</li>
<li><strong>Afundos:</strong> 100 parados cansam a perna mais do que parece. Duas sessões por semana de afundo com o próprio peso já mudam o resultado.</li>
<li><strong>Divida as séries:</strong> nas 100 wall balls e nos 100 afundos, séries menores e pausas curtas rendem mais do que ir até travar.</li>
<li><strong>Refaça a cada 8 a 12 semanas:</strong> o PFT é um bom jeito de medir a evolução com você mesmo.</li>
</ul>

<h2>Não se compare</h2>
<p>O PFT dá um número, e número vira comparação rápido. Cada pessoa tem a própria genética, rotina e história, com altos e baixos. O tempo que importa é o seu no próximo teste. Se quiser montar a preparação comigo, <a href="/consultoria-online">conheça o acompanhamento</a> ou veja <a href="/onde-atendo">onde atendo</a>.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/treino-de-hyrox">Treino de Hyrox: planilha de 8 semanas</a></li>
<li><a href="/blog/estacoes-do-hyrox">Estações do Hyrox: ordem, pesos e técnica</a></li>
<li><a href="/blog/hyrox-o-que-e">Hyrox: o que é e como funciona</a></li>
<li><a href="/ferramentas/calculadora-tempo-hyrox">Calculadora de Tempo do Hyrox: quanto você faria na prova</a></li>
</ul>

<h2>Fontes</h2>
<ul>
<li><a href="https://hyroxuk.com/test-your-fitness/" target="_blank" rel="noopener noreferrer">HYROX UK — Test your fitness: PFT e tempo por categoria (oficial)</a></li>
<li><a href="https://hyrox.co.in/?p=1375" target="_blank" rel="noopener noreferrer">HYROX Índia — Test your fitness: formato e pesos do PFT (oficial)</a></li>
<li><a href="https://register.hyrox.com/event/hyrox-pft---boston" target="_blank" rel="noopener noreferrer">HYROX — inscrição de PFT num Training Club (oficial)</a></li>
<li><a href="https://www.tecmundo.com.br/ciencia/288822-novo-crossfit-conheca-hyrox-novidade-fitness.htm" target="_blank" rel="noopener noreferrer">TecMundo — Novo CrossFit? Conheça o Hyrox</a></li>
</ul>`,
  },

  /* ───────────────────────── Calendário ───────────────────────── */
  {
    slug: "hyrox-brasil-2026",
    title: "Hyrox no Brasil 2026/2027: Calendário de Provas e Inscrição",
    metaTitle: "Hyrox Brasil 2026/2027: Calendário de Provas e Inscrição",
    metaDescription:
      "As provas de Hyrox no Brasil na temporada 2026/2027: Rio de Janeiro em novembro e São Paulo em maio de 2027. Datas, locais, categorias e como se inscrever.",
    excerpt:
      "A temporada 2026/2027 do Hyrox no Brasil: São Paulo em outubro, Rio de Janeiro em novembro, São Paulo de novo em maio de 2027 e como se inscrever.",
    category: "Treinamento",
    tipo: "noticia",
    date: "2026-10-23",
    updatedAt: "2026-10-23",
    readTime: "4 min",
    author: "Montinho",
    tags: ["hyrox brasil 2026", "provas hyrox 2026", "hyrox rio de janeiro 2026", "hyrox rj", "calendário hyrox", "hyrox inscrição"],
    faq: [
      { question: "Quando é o próximo Hyrox no Brasil?", answer: "O Hyrox Rio de Janeiro, nos dias 21 e 22 de novembro de 2026, no Riocentro, na Barra Olímpica. Depois, São Paulo em 8 e 9 de maio de 2027, com local ainda a definir. A etapa de São Paulo de 2026 foi em 17 e 18 de outubro, no Distrito Anhembi." },
      { question: "Quando é o Hyrox São Paulo 2027?", answer: "A data divulgada é 8 e 9 de maio de 2027. Em 23/10/2026, o local ainda não tinha sido anunciado e as inscrições não estavam abertas." },
      { question: "Onde vai ser o Hyrox Rio de Janeiro 2026?", answer: "No Riocentro, na Av. Salvador Allende, 6555, Barra Olímpica, nos dias 21 e 22 de novembro de 2026, segundo o site oficial." },
      { question: "Tem Hyrox em Curitiba, Brasília ou BH em 2026?", answer: "Até 23/10/2026, o calendário oficial do Hyrox no Brasil não trazia provas nessas cidades na temporada 2026/2027. Para treinar nelas, procure um Training Club; para correr a prova, as etapas confirmadas são São Paulo e Rio." },
      { question: "Como se inscrever no Hyrox?", answer: "Pelo site oficial do Hyrox Brasil, na página de cada prova, escolhendo a categoria e o dia. O preço muda por categoria e por lote, e algumas categorias esgotam antes da data." },
      { question: "Qual a idade mínima para fazer o Hyrox?", answer: "16 anos no dia da prova, pelo regulamento oficial. Não há idade máxima." },
      { question: "Quais categorias tem o Hyrox Rio de Janeiro 2026?", answer: "Individual Open e Pro, feminino e masculino; duplas feminina, masculina e mista, também Pro; e revezamentos feminino, masculino e misto, divididos entre sábado e domingo." },
    ],
    content: `<p>A temporada 2026/2027 do Hyrox no Brasil começou com <strong>São Paulo, em 17 e 18 de outubro</strong>, segue com o <strong>Rio de Janeiro, em 21 e 22 de novembro de 2026</strong>, e volta a <strong>São Paulo em 8 e 9 de maio de 2027</strong>, com local ainda a definir (situação em 23/10/2026).</p>

<h2>Calendário do Hyrox no Brasil 2026/2027</h2>
<table>
<thead><tr><th>Prova</th><th>Data</th><th>Local</th><th>Situação</th></tr></thead>
<tbody>
<tr><td>Hyrox São Paulo</td><td>17 e 18/10/2026</td><td>Distrito Anhembi</td><td>Realizada — veja o <a href="/blog/resultado-hyrox-sao-paulo-2026">resultado</a></td></tr>
<tr><td>Hyrox Rio de Janeiro</td><td>21 e 22/11/2026</td><td>Riocentro, Barra Olímpica</td><td>Confirmada no site oficial</td></tr>
<tr><td>Hyrox São Paulo 2027</td><td>8 e 9/05/2027</td><td>A definir</td><td>Data divulgada; inscrições ainda não abertas</td></tr>
</tbody>
</table>
<p>Datas, locais e categorias mudam. Antes de fechar viagem ou inscrição, confira a página da prova no <a href="https://hyroxbrazil.com/find-your-race/" target="_blank" rel="noopener noreferrer">site oficial do Hyrox Brasil</a>.</p>

<h2>Hyrox Rio de Janeiro 2026</h2>
<ul>
<li><strong>Quando:</strong> sábado e domingo, 21 e 22 de novembro de 2026.</li>
<li><strong>Onde:</strong> Riocentro, Av. Salvador Allende, 6555, Barra Olímpica, Rio de Janeiro.</li>
<li><strong>Sábado:</strong> individual masculino e Pro (feminino e masculino) e dupla mista.</li>
<li><strong>Domingo:</strong> individual feminino, duplas feminina e masculina (também Pro) e revezamentos.</li>
<li><strong>Horários:</strong> provisórios; os horários de largada de cada atleta saem cerca de três dias antes, e não dá para trocar depois.</li>
<li><strong>Retirada:</strong> há registro no dia da prova; leve documento com foto.</li>
<li><strong>Ingressos:</strong> sites de acompanhamento já marcavam a prova como esgotada em outubro. Confira no site oficial se há categoria ou lote aberto.</li>
</ul>

<h2>Hyrox São Paulo 2026 e 2027</h2>
<p>A etapa paulista abriu a temporada no Distrito Anhembi. Os vencedores do Pro foram Bruno Henrique Carvalho (58:41) e Manuela Garcia (1:07:37): o resultado está em <a href="/blog/resultado-hyrox-sao-paulo-2026">resultado do Hyrox São Paulo 2026</a> e o guia da prova, em <a href="/blog/hyrox-sao-paulo-2026">Hyrox São Paulo 2026</a>. A próxima etapa paulista aparece para <strong>8 e 9 de maio de 2027</strong>, ainda sem local e sem venda aberta.</p>

<h2>Tem Hyrox na minha cidade?</h2>
<p>Muita gente procura "Hyrox Curitiba", "Hyrox Brasília" ou "Hyrox BH". Em 23/10/2026, o calendário oficial no Brasil não tinha prova nessas cidades na temporada 2026/2027. O que existe nelas são <strong>Training Clubs e boxes com aula de Hyrox</strong>, onde dá para treinar e, em alguns, fazer o <a href="/blog/hyrox-pft">PFT</a>, o teste físico oficial. Para Alphaville e região, os lugares estão em <a href="/blog/hyrox-alphaville-onde-treinar">onde treinar Hyrox em Alphaville</a>.</p>

<h2>Como se inscrever</h2>
<ol>
<li>Entre na página da prova no site oficial do Hyrox Brasil.</li>
<li>Escolha a categoria (individual, dupla ou revezamento; Open ou Pro) e o dia.</li>
<li>Pague a inscrição; o preço muda por categoria e lote.</li>
</ol>
<p>Idade mínima: <strong>16 anos no dia da prova</strong>, pelo regulamento oficial. Os pesos de cada categoria estão em <a href="/blog/estacoes-do-hyrox">estações do Hyrox</a>.</p>

<h2>Quanto tempo de preparação até a prova</h2>
<p>Para o Rio, a menos de um mês da prova, não dá para construir base nova: dá para chegar descansado e afiado, com um simulado controlado e a última semana leve. Para São Paulo em maio de 2027, há tempo para as 8 semanas da <a href="/blog/treino-de-hyrox">planilha de treino de Hyrox</a>, com folga.</p>

<h2>Não se compare</h2>
<p>A prova dá um tempo, e o tempo do lado vira comparação. Cada pessoa tem a própria genética, rotina e história, com altos e baixos. O que importa é encontrar um treino que dê para seguir pelo resto da vida, com aderência e progressão. Se quiser montar a preparação comigo, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://hyrox.com/event/hyrox-rio-de-janeiro/" target="_blank" rel="noopener noreferrer">HYROX — Creapure HYROX Rio de Janeiro: data, local e categorias (oficial)</a></li>
<li><a href="https://hyroxbrazil.com/find-your-race/" target="_blank" rel="noopener noreferrer">HYROX Brasil — Encontre sua corrida (oficial)</a></li>
<li><a href="https://distritoanhembi.com.br/en/events/hyrox-sao-paulo-2026-2/" target="_blank" rel="noopener noreferrer">Distrito Anhembi — HYROX São Paulo 2026</a></li>
<li><a href="https://www.hyresult.com/event/s9-2027-sao-paulo" target="_blank" rel="noopener noreferrer">HYRESULT — HYROX São Paulo 2027 (data, sem venda aberta)</a></li>
<li><a href="https://rundida.com/hyrox/event/sao-paulo/" target="_blank" rel="noopener noreferrer">Rundida — HYROX São Paulo, 17–18/10/2026 e 8–9/05/2027</a></li>
<li><a href="https://www.roxradar.com/events/hyrox-rio-de-janeiro-2026" target="_blank" rel="noopener noreferrer">RoxRadar — HYROX Rio de Janeiro 2026 (situação dos ingressos)</a></li>
${FONTE_REGRAS}
</ul>`,
  },
];
