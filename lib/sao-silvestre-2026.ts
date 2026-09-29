import type { BlogPost } from "./blog";

/**
 * Cobertura da 101ª São Silvestre (31/12/2026). Mesma regra do Olympia:
 * só entra fato confirmado por fonte oficial ou por dois veículos
 * independentes. O que ainda não foi divulgado (preço de 2026, horários de
 * 2026) aparece como "a confirmar", com o número de 2025 como referência.
 */

const AUTOR = "Montinho Personal Trainer";

const FONTES_SS = `<h2>Fontes</h2>
<ul>
<li><a href="https://www.saosilvestre.com.br/" target="_blank" rel="noopener noreferrer">São Silvestre — site oficial</a></li>
<li><a href="https://www.saosilvestre.com.br/faq/" target="_blank" rel="noopener noreferrer">São Silvestre — perguntas frequentes</a></li>
<li>Veículos consultados para a abertura das inscrições, vagas, valores de 2026 e números de 2025: CBN, Correr Brasília, Esportividade, Sua Corrida, Mania de Corrida, CNN Brasil, NSC Total.</li>
</ul>`;

export const SAO_SILVESTRE_2026_POSTS: BlogPost[] = [
  {
    slug: "inscricao-sao-silvestre-2026",
    title: "Inscrição São Silvestre 2026: data, preço e como se inscrever",
    metaTitle: "Inscrição São Silvestre 2026: Valor, Data e Como Fazer",
    metaDescription:
      "Inscrição da São Silvestre 2026: abre em 30/09, às 10h, sem sorteio, com 55 mil vagas. Kits de R$ 335,90 a R$ 1.039,90, passo a passo, percurso e como treinar os 15 km.",
    excerpt:
      "As inscrições da 101ª São Silvestre abrem na quarta, 30 de setembro, às 10h, sem sorteio e com 55 mil vagas. Valores dos kits, passo a passo, percurso e quanto tempo dá para treinar.",
    category: "Treinamento",
    tipo: "noticia",
    date: "2026-09-26",
    readTime: "5 min",
    author: AUTOR,
    tags: ["São Silvestre", "São Silvestre 2026", "inscrição", "corrida de rua", "15 km"],
    content: `<img src="/blog-images/inscricao-sao-silvestre-2026-capa.webp" alt="Capa: inscrição da São Silvestre 2026 — 55 mil vagas, sem sorteio, kits de R$ 335,90 a R$ 1.039,90; prova em 31/12" width="1800" height="1013" loading="eager" style="width:100%;height:auto;border-radius:12px;margin:0 0 1.5rem;" />
<blockquote><p><strong>As inscrições abrem na quarta-feira, 30 de setembro de 2026, às 10h (Brasília).</strong> São 55 mil vagas, e o kit mais barato custa R$ 335,90. Última verificação: 29 de setembro de 2026.</p></blockquote>
<p>A <strong>101ª Corrida Internacional de São Silvestre</strong> acontece na <strong>quinta-feira, 31 de dezembro de 2026</strong>, na região central de São Paulo, com os tradicionais <strong>15 km</strong>. É a primeira edição depois do centenário, comemorado em 2025. As inscrições abrem em <strong>30 de setembro, às 10h</strong>, por venda direta — <strong>sem sorteio</strong> — na plataforma oficial, a Ticket Sports by Ingresse.</p>

<h2>Resumo da São Silvestre 2026</h2>
<table><thead><tr><th>Item</th><th>O que se sabe</th></tr></thead><tbody>
<tr><td>Edição</td><td>101ª</td></tr>
<tr><td>Data da prova</td><td>Quinta-feira, 31/12/2026, pela manhã</td></tr>
<tr><td>Distância</td><td>15 km</td></tr>
<tr><td>Largada e chegada</td><td>Avenida Paulista, em pontos diferentes (altura dos números 2.000 e 900)</td></tr>
<tr><td>Abertura das inscrições</td><td>30/09/2026, às 10h</td></tr>
<tr><td>Forma de inscrição</td><td>Venda direta, sem sorteio, pela Ticket Sports by Ingresse</td></tr>
<tr><td>Vagas</td><td>55 mil</td></tr>
<tr><td>Valor 2026</td><td>De R$ 335,90 (Básico) a R$ 1.039,90 (Premium)</td></tr>
</tbody></table>

<h2>Como se inscrever: passo a passo</h2>
<ol>
<li><strong>Faça o pré-cadastro antes de quarta.</strong> A organização abriu um pré-cadastro para quem quer se inscrever. Deixar nome, CPF e dados de contato prontos economiza minutos no momento em que as vagas abrem.</li>
<li><strong>Entre pelo site oficial.</strong> Acesse <a href="https://www.saosilvestre.com.br/" target="_blank" rel="noopener noreferrer">saosilvestre.com.br</a> e siga o link para a inscrição. Desconfie de links recebidos por mensagem: todo ano aparecem páginas falsas imitando a da prova.</li>
<li><strong>Escolha o kit.</strong> São três opções — Básico, Intermediário e Premium —, com os valores da tabela abaixo.</li>
<li><strong>Pague e guarde o comprovante.</strong> A confirmação chega por e-mail; a retirada do kit acontece nos dias anteriores à prova, com data e local divulgados pela organização.</li>
</ol>

<h2>Quanto custa a inscrição da São Silvestre 2026?</h2>
<p>O valor da inscrição depende do kit escolhido:</p>
<table><thead><tr><th>Kit (2026)</th><th>Valor</th><th>O que inclui</th></tr></thead><tbody>
<tr><td>Básico</td><td>R$ 335,90</td><td>Número de peito com chip, camiseta e sacochila</td></tr>
<tr><td>Intermediário</td><td>R$ 459,90</td><td>Número com chip, camiseta e camiseta finisher</td></tr>
<tr><td>Premium</td><td>R$ 1.039,90</td><td>Número com chip, camiseta, camiseta finisher, corta-vento, boné, porta-tênis, chinelo e serviços exclusivos na Expo e na arena da prova</td></tr>
</tbody></table>
<p>A plataforma cobra uma taxa de serviço à parte; confira o total antes de pagar. Clientes do cartão Caixa Visa tiveram uma pré-venda com desconto em 28 e 29 de setembro, já encerrada.</p>
<p>Para comparar: em 2025, na edição do centenário, os kits custaram R$ 319,90 (Geral), R$ 439,90 (Centenário) e R$ 990,90 (Premium), e as 50 mil vagas foram abertas de uma vez.</p>

<h2>Quantas vagas tem a São Silvestre 2026?</h2>
<p>São <strong>55 mil vagas</strong>, vendidas por ordem de chegada, sem sorteio. Em anos de grande procura as vagas acabam no mesmo dia — por isso vale deixar o pré-cadastro pronto e entrar no horário de abertura.</p>

<h2>Percurso: quantos km e por onde passa</h2>
<p>A São Silvestre tem <strong>15 km</strong>, com largada e chegada na <strong>Avenida Paulista</strong>, em pontos diferentes, passando pela região central de São Paulo. O trecho mais conhecido — e mais temido — é a <strong>subida da Avenida Brigadeiro Luís Antônio</strong>, perto do fim, quando a perna já está cansada. É por causa dela que o treino de força faz tanta diferença nessa prova. Veja o <a href="/blog/percurso-sao-silvestre">percurso da São Silvestre trecho a trecho</a>.</p>

<h2>Horários da largada</h2>
<p>Os horários de 2026 ainda serão confirmados no regulamento. Em 2025, foram: cadeirantes às 7h25, elite feminina às 7h40, elite masculina às 8h05, pelotão Premium às 8h08 e pelotão geral às 8h10.</p>

<h2>Dá tempo de treinar até 31 de dezembro?</h2>
<p>Da abertura das inscrições até a prova são cerca de <strong>13 semanas</strong>. Para quem já corre 5 km sem parar, é tempo suficiente para chegar aos 15 km com segurança, aumentando o volume aos poucos e incluindo treino de força para as pernas — é ele que segura a subida da Brigadeiro Luís Antônio, na reta final. Para quem ainda não corre, dá para completar a prova alternando corrida e caminhada; o guia de <a href="/blog/corrida-para-iniciantes">corrida para iniciantes</a> mostra como começar sem se machucar.</p>
<p>O <a href="/blog/treino-sao-silvestre-13-semanas">plano de treino de 13 semanas para a São Silvestre</a> traz três versões — para completar, para correr os 15 km e para baixar o tempo.</p>
<p>Quer saber quanto tempo você levaria? O <a href="/ferramentas/previsor-sao-silvestre">Previsor da São Silvestre</a> parte do seu tempo em 5 km, 10 km ou meia e mostra o tempo provável nos 15 km, com a subida na conta.</p>

<h2>Quem ganhou em 2025</h2>
<p>Na 100ª edição, <strong>Muse Gizachew</strong> (Etiópia) venceu no masculino, com 44min28s, e <strong>Sisilia Panga</strong> (Tanzânia) no feminino, com 51min08s. Os melhores brasileiros foram <strong>Fábio Jesus</strong> e <strong>Núbia Oliveira</strong>, ambos em 3º lugar.</p>

<h2>Corra a sua prova</h2>
<p>Na São Silvestre, cada um corre contra o próprio relógio. Não se compare com quem está do lado: a sua genética, a sua rotina e a sua história são só suas. O que faz diferença é um plano que você consiga seguir até dezembro — e depois dele. Se quiser montar esse plano comigo, com força e corrida no mesmo treino, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>

${FONTES_SS}`,
    faq: [
      { question: "Quando abrem as inscrições da São Silvestre 2026?", answer: "Na quarta-feira, 30 de setembro de 2026, às 10h (Brasília), por venda direta, sem sorteio, na plataforma Ticket Sports by Ingresse." },
      { question: "Qual o valor da inscrição da São Silvestre 2026?", answer: "O kit Básico custa R$ 335,90, o Intermediário R$ 459,90 e o Premium R$ 1.039,90, mais a taxa de serviço da plataforma." },
      { question: "Quantas vagas tem a São Silvestre 2026?", answer: "55 mil vagas, vendidas por ordem de chegada, sem sorteio, a partir de 30 de setembro às 10h." },
      { question: "Quando é a São Silvestre 2026?", answer: "Na quinta-feira, 31 de dezembro de 2026, pela manhã, em São Paulo, com largada e chegada na Avenida Paulista." },
      { question: "Tem sorteio para a São Silvestre?", answer: "Não. Em 2026 a inscrição é por venda direta, enquanto houver vagas." },
    ],
  },
  {
    slug: "treino-sao-silvestre-13-semanas",
    title: "Treino para a São Silvestre: planilha de 13 semanas para os 15 km",
    metaTitle: "Planilha de Treino para a São Silvestre: 13 Semanas (15 km)",
    metaDescription:
      "Planilha de treino para a São Silvestre 2026 em três níveis, do iniciante a quem quer baixar o tempo nos 15 km. Quanto tempo treinar, se pode caminhar e como encarar a Brigadeiro.",
    excerpt:
      "Três planos de 13 semanas até 31 de dezembro — para completar, para sair dos 5 km e para baixar o tempo — com o treino de força que segura a subida da Brigadeiro.",
    category: "Treinamento",
    date: "2026-09-29",
    readTime: "9 min",
    author: AUTOR,
    tags: ["São Silvestre", "São Silvestre 2026", "treino de corrida", "15 km", "corrida de rua", "plano de treino"],
    content: `<img src="/blog-images/treino-sao-silvestre-13-semanas-capa.webp" alt="Capa: planilha de treino para a São Silvestre — 13 semanas em três níveis, do iniciante a quem quer baixar o tempo" width="1800" height="1013" loading="eager" style="width:100%;height:auto;border-radius:12px;margin:0 0 1.5rem;" />
<p>A São Silvestre tem <strong>15 km</strong>, com largada e chegada na Avenida Paulista. Da abertura das inscrições até a largada, em <strong>31 de dezembro</strong>, são cerca de <strong>13 semanas</strong>. É tempo suficiente para chegar bem aos <strong>15 km da São Silvestre</strong> — desde que o plano respeite o ponto de onde você parte. Quem hoje não corre 20 minutos seguidos e quem já faz 10 km precisam de treinos diferentes, e é por isso que este guia traz três planilhas, uma para cada ponto de partida — incluindo uma para iniciantes.</p>
<p>Antes de escolher, vale saber quanto tempo você levaria hoje: o <a href="/ferramentas/previsor-sao-silvestre">Previsor da São Silvestre</a> parte do seu tempo em 5 km, 10 km ou meia e mostra a faixa provável nos 15 km, com a subida na conta.</p>

<h2>Qual planilha é a sua?</h2>
<table><thead><tr><th>Você hoje</th><th>Plano</th><th>Objetivo em 31/12</th></tr></thead><tbody>
<tr><td>Não corre 20 minutos sem parar</td><td><strong>Plano 1 — Completar</strong></td><td>Terminar os 15 km inteiro, alternando corrida e caminhada</td></tr>
<tr><td>Corre 5 km sem parar</td><td><strong>Plano 2 — Correr os 15 km</strong></td><td>Correr a prova toda, em ritmo confortável</td></tr>
<tr><td>Já corre 10 km</td><td><strong>Plano 3 — Baixar o tempo</strong></td><td>Chegar mais rápido, com força para a Brigadeiro</td></tr>
</tbody></table>
<p><strong>Quer imprimir?</strong> <a href="/downloads/planilha-treino-sao-silvestre-2026.pdf" download>Baixe a planilha de treino da São Silvestre em PDF</a> — as três planilhas semana a semana, com as datas de 2026, o treino de força e um espaço para marcar cada semana cumprida.</p>
<p>Na dúvida entre dois, escolha o mais leve. Começar abaixo do seu nível custa pouco; começar acima é o caminho mais comum para a lesão de novembro que tira a pessoa da prova.</p>

<h2>As regras que valem para os três planos</h2>
<ul>
<li><strong>Quase tudo em ritmo leve.</strong> A maior parte dos treinos deve ser num ritmo em que você consegue conversar. Ritmo forte entra pouco e com propósito.</li>
<li><strong>O volume sobe devagar.</strong> Aumente a distância aos poucos, semana a semana, e a cada três ou quatro semanas faça uma semana mais leve para o corpo assimilar.</li>
<li><strong>Força duas vezes por semana.</strong> Musculação para pernas e tronco reduz o risco de lesão e é o que segura a subida da Brigadeiro Luís Antônio, na reta final.</li>
<li><strong>Descanso é parte do plano.</strong> Pelo menos um dia sem treino por semana. Dormir mal e treinar forte é a combinação que mais quebra corredor iniciante.</li>
<li><strong>As duas últimas semanas são de redução.</strong> Perto da prova você diminui o volume e mantém um pouco de intensidade, para chegar descansado em 31/12.</li>
</ul>

<h2>Planilha 1 — Iniciante: completar a prova correndo e caminhando</h2>
<p>Três sessões de corrida e caminhada por semana, mais duas de força. O objetivo não é o relógio: é cruzar a linha na Paulista inteiro e com vontade de voltar no ano que vem.</p>
<table><thead><tr><th>Semanas</th><th>Sessões de corrida (3x/semana)</th><th>Treino longo (1x/semana)</th></tr></thead><tbody>
<tr><td>1 a 4 — Base</td><td>30 min alternando 1 min correndo e 2 min caminhando; aos poucos, 2 min correndo e 1 min caminhando</td><td>40 a 50 min no mesmo formato</td></tr>
<tr><td>5 a 8 — Construção</td><td>30 a 40 min com blocos de 5 min correndo e 1 min caminhando</td><td>6 a 9 km alternando corrida e caminhada</td></tr>
<tr><td>9 a 11 — Específico</td><td>35 a 45 min; em uma das sessões, inclua subidas curtas caminhando rápido</td><td>10 a 12 km alternando</td></tr>
<tr><td>12 a 13 — Redução</td><td>25 a 30 min leves</td><td>Semana 12: 7 km; semana 13: só a prova</td></tr>
</tbody></table>
<p>Na prova, use a mesma estratégia do treino: correr e caminhar em blocos. Caminhar na subida da Brigadeiro não é derrota — muita gente que caminha ali termina melhor do que quem insiste em correr e quebra.</p>

<h2>Planilha 2 — Correr os 15 km (para quem já faz 5 km)</h2>
<p>Três corridas por semana e duas sessões de força. O longo é o treino que mais importa: é ele que ensina o corpo a ficar em movimento por mais de uma hora.</p>
<table><thead><tr><th>Semanas</th><th>Corridas curtas (2x/semana)</th><th>Treino longo (1x/semana)</th></tr></thead><tbody>
<tr><td>1 a 4 — Base</td><td>5 a 6 km leves</td><td>6 → 7 → 8 km, com a semana 4 mais leve (6 km)</td></tr>
<tr><td>5 a 8 — Construção</td><td>6 a 7 km; em uma delas, 4 a 6 tiros de 1 min um pouco mais forte</td><td>9 → 10 → 11 km, com a semana 8 mais leve (8 km)</td></tr>
<tr><td>9 a 11 — Específico</td><td>6 a 8 km; em uma delas, 6 a 8 subidas curtas de 30 a 45 s</td><td>12 → 13 → 14 km, em ritmo de conversa</td></tr>
<tr><td>12 a 13 — Redução</td><td>5 km leves com 3 acelerações curtas no fim</td><td>Semana 12: 9 km; semana 13: só a prova</td></tr>
</tbody></table>
<p>Não é preciso correr os 15 km inteiros antes da prova. Chegar a 13 ou 14 km no treino longo e descansar nas duas últimas semanas costuma render mais do que forçar a distância total a poucos dias da largada.</p>

<h2>Planilha 3 — Baixar o tempo (para quem já corre 10 km)</h2>
<p>Quatro corridas por semana e duas sessões de força. Aqui entram treinos de qualidade — mas só um ou dois por semana; o resto continua leve.</p>
<table><thead><tr><th>Semanas</th><th>Treino de qualidade</th><th>Treino longo</th><th>Demais corridas</th></tr></thead><tbody>
<tr><td>1 a 4 — Base</td><td>6 a 8 tiros de 1 min forte com 1 min leve</td><td>10 → 12 km</td><td>2 corridas leves de 6 a 8 km</td></tr>
<tr><td>5 a 8 — Construção</td><td>20 a 30 min em ritmo firme, um pouco abaixo do ritmo de prova</td><td>12 → 14 km</td><td>2 leves de 7 a 8 km</td></tr>
<tr><td>9 a 11 — Específico</td><td>8 a 10 subidas de 45 s a 1 min; e, na outra semana, 3 blocos de 2 km no ritmo de prova</td><td>14 → 16 km, com os últimos 3 km no ritmo de prova</td><td>2 leves de 8 km</td></tr>
<tr><td>12 a 13 — Redução</td><td>Metade do volume de tiros, mesma intensidade</td><td>Semana 12: 10 km; semana 13: só a prova</td><td>Leves e curtas</td></tr>
</tbody></table>
<p>Para saber qual é o seu ritmo de prova, use o <a href="/ferramentas/previsor-sao-silvestre">previsor</a> com um tempo recente de 5 ou 10 km: ele mostra o pace médio provável nos 15 km.</p>

<h2>Quanto tempo de treino é preciso para correr a São Silvestre?</h2>
<p>Depende de onde você parte. Para quem já corre 5 km, de 10 a 13 semanas é um prazo confortável. Para quem está começando do zero, o mesmo período permite completar a prova alternando corrida e caminhada. Um mês só costuma bastar para quem já corre 10 km com regularidade e quer ajustar a preparação; para quem não corre, um mês é pouco para correr os 15 km sem aumentar muito o risco de lesão — nesse caso, a meta segura é completar caminhando e correndo.</p>

<h2>Pode caminhar na São Silvestre?</h2>
<p>Pode. A prova é aberta a quem corre e a quem alterna corrida e caminhada, e muita gente caminha em algum trecho, principalmente na subida da Brigadeiro. Para quem está começando, caminhar de forma planejada — e não só quando o fôlego acaba — é a estratégia da Planilha 1.</p>

<h2>O treino de força que segura a Brigadeiro</h2>
<p>A subida da Avenida Brigadeiro Luís Antônio vem perto do fim, quando a perna já está cansada. Quem chega ali com força sobe; quem não chega, arrasta. Duas sessões por semana, em dias sem treino forte de corrida:</p>
<ul>
<li><strong>Agachamento</strong> — 3 séries de 8 a 12 repetições;</li>
<li><strong>Afundo ou passada</strong> — 3 séries de 8 a 10 por perna;</li>
<li><strong>Subida no banco (step-up)</strong> — 3 séries de 8 a 10 por perna, o exercício mais parecido com a subida;</li>
<li><strong>Elevação de panturrilha</strong> — 3 séries de 12 a 15;</li>
<li><strong>Prancha</strong> — 3 séries de 30 a 45 s, para o tronco não desmontar no fim da prova.</li>
</ul>
<p>Nas duas últimas semanas, reduza a carga e as séries pela metade. O guia de <a href="/blog/corrida-e-musculacao">corrida e musculação</a> mostra como encaixar os dois na mesma semana sem um atrapalhar o outro.</p>

<h2>Sinais para parar e procurar ajuda</h2>
<p>Desconforto muscular leve depois do treino é normal. Não é normal: dor que piora durante a corrida, dor em um ponto específico do osso, dor que faz você mancar ou que continua no dia seguinte sem melhorar. Nesses casos, pare e procure um médico ou fisioterapeuta. Quem tem alguma condição de saúde, ou está parado há muito tempo, deve fazer uma avaliação médica antes de começar.</p>

<h2>A semana da prova</h2>
<ul>
<li>Não teste nada novo: nem tênis, nem roupa, nem comida.</li>
<li>Faça um ou dois treinos curtos e leves; o condicionamento já está construído.</li>
<li>Na véspera, jante o que você já está acostumado e durma cedo — a largada do pelotão geral foi às 8h10 em 2025.</li>
<li>Na largada, comece mais devagar do que dá vontade. São 15 km, e a parte difícil é no fim.</li>
</ul>
<p>Datas de retirada do kit e horários de 2026 saem no regulamento; o <a href="/blog/inscricao-sao-silvestre-2026">guia da inscrição</a> é atualizado quando forem divulgados.</p>

<h2>Corra a sua prova</h2>
<p>Na São Silvestre tem gente de todo tipo: quem vai buscar recorde e quem vai para completar a primeira prova da vida. Não se compare com quem está do seu lado — cada um tem a própria genética, rotina e história, com altos e baixos. O que faz diferença é um plano que você consiga seguir até dezembro e continuar depois dele. Se quiser montar esse plano comigo, ajustado ao seu nível e à sua agenda, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>

${FONTES_SS}`,
    faq: [
      { question: "Dá para treinar para a São Silvestre em 13 semanas?", answer: "Sim. Para quem já corre 5 km, 13 semanas bastam para chegar aos 15 km aumentando o volume aos poucos. Para quem ainda não corre, dá para completar a prova alternando corrida e caminhada." },
      { question: "Existe planilha de treino para São Silvestre para iniciantes?", answer: "Sim. A Planilha 1 deste guia é para quem não corre 20 minutos sem parar: três sessões por semana alternando corrida e caminhada, mais duas de força, até completar os 15 km." },
      { question: "Tem planilha de treino da São Silvestre em PDF?", answer: "Tem. As três planilhas deste guia estão num PDF gratuito para imprimir, semana a semana com as datas de 2026, em /downloads/planilha-treino-sao-silvestre-2026.pdf." },
      { question: "Dá para se preparar para a São Silvestre em um mês?", answer: "Para quem já corre 10 km com regularidade, sim, ajustando o volume e descansando na última semana. Para quem não corre, um mês é pouco para correr os 15 km com segurança; a meta realista é completar alternando corrida e caminhada." },
      { question: "Quantas vezes por semana devo treinar para a São Silvestre?", answer: "Três corridas por semana para quem quer completar ou correr a prova toda, quatro para quem quer baixar o tempo, e duas sessões de musculação para pernas e tronco em todos os casos." },
      { question: "Preciso correr 15 km antes da prova?", answer: "Não. Chegar a 13 ou 14 km no treino longo e reduzir o volume nas duas últimas semanas costuma render mais do que correr a distância total perto da largada. Quem busca tempo pode ir a 16 km no longo." },
      { question: "Como treinar para a subida da Brigadeiro?", answer: "Com treino de força duas vezes por semana (agachamento, afundo, subida no banco e panturrilha) e, a partir da semana 9, subidas curtas de 30 segundos a 1 minuto em um dos treinos de corrida." },
      { question: "Posso caminhar na São Silvestre?", answer: "Pode. Muitos participantes alternam corrida e caminhada, principalmente na subida da Brigadeiro. Caminhar com estratégia costuma dar um resultado melhor do que insistir em correr e quebrar." },
    ],
  },
  {
    slug: "percurso-sao-silvestre",
    title: "Percurso da São Silvestre: os 15 km trecho a trecho",
    metaTitle: "Percurso da São Silvestre 2026: Mapa dos 15 km e Ruas",
    metaDescription:
      "Percurso da São Silvestre: 15 km da Paulista ao centro e de volta, com descida da Dr. Arnaldo, Pacaembu e a subida da Brigadeiro. Ruas em ordem e como correr cada trecho.",
    excerpt:
      "Os 15 km da São Silvestre trecho a trecho: largada na Paulista, descida para o Pacaembu, centro histórico e a subida da Brigadeiro até a chegada. E como correr cada parte.",
    category: "Treinamento",
    date: "2026-09-29",
    readTime: "6 min",
    author: AUTOR,
    tags: ["São Silvestre", "São Silvestre 2026", "percurso", "15 km", "Brigadeiro Luís Antônio", "corrida de rua"],
    content: `<img src="/blog-images/percurso-sao-silvestre-capa.webp" alt="Capa: percurso da São Silvestre trecho a trecho — Paulista, Pacaembu, centro e a subida da Brigadeiro" width="1800" height="1013" loading="eager" style="width:100%;height:auto;border-radius:12px;margin:0 0 1.5rem;" />
<blockquote><p>O percurso oficial de 2026 é publicado no regulamento da prova. Esta página descreve o trajeto de 2025, usado como referência, e é atualizada se houver mudança. Última verificação: 29 de setembro de 2026.</p></blockquote>
<p>A São Silvestre tem <strong>15 km</strong> — não 42, como às vezes se pensa: 42 km é a distância da maratona. A largada e a chegada ficam na <strong>Avenida Paulista</strong>, em pontos diferentes, e no meio o trajeto desce até o Pacaembu, atravessa o centro histórico de São Paulo e volta subindo a <strong>Avenida Brigadeiro Luís Antônio</strong>.</p>

<h2>O percurso em resumo</h2>
<table><thead><tr><th>Item</th><th>Referência (edição de 2025)</th></tr></thead><tbody>
<tr><td>Distância</td><td>15 km</td></tr>
<tr><td>Largada</td><td>Avenida Paulista, entre a Rua Frei Caneca e a Rua Augusta</td></tr>
<tr><td>Chegada</td><td>Avenida Paulista, 900, em frente à Fundação Cásper Líbero</td></tr>
<tr><td>Pontos conhecidos</td><td>Estádio do Pacaembu, Praça da República, Theatro Municipal, Elevado Presidente João Goulart</td></tr>
<tr><td>Trecho mais difícil</td><td>Subida da Avenida Brigadeiro Luís Antônio, perto do fim</td></tr>
</tbody></table>

<h2>As ruas do percurso, em ordem</h2>
<ol>
<li><strong>Avenida Paulista</strong> — largada, sentido Consolação.</li>
<li><strong>Avenida Doutor Arnaldo</strong> — começa a descida.</li>
<li><strong>Avenida Pacaembu</strong> — trecho mais baixo, junto ao estádio.</li>
<li><strong>Avenida Marquês de São Vicente</strong> e <strong>Avenida Rudge</strong> — a parte plana do meio da prova.</li>
<li><strong>Avenida Rio Branco</strong>, <strong>Avenida Ipiranga</strong> e <strong>Avenida São João</strong> — o centro histórico, passando pela Praça da República e perto do Theatro Municipal.</li>
<li><strong>Avenida Duque de Caxias</strong> — a caminho da subida.</li>
<li><strong>Avenida Brigadeiro Luís Antônio</strong> — a subida famosa, de volta à Paulista.</li>
<li><strong>Avenida Paulista</strong> — os metros finais até a chegada, no número 900.</li>
</ol>

<h2>Como correr cada trecho</h2>
<h3>Largada e descida: segure o ritmo</h3>
<p>A largada é cheia, e logo depois vem a descida pela Doutor Arnaldo. É o lugar onde mais gente estraga a prova: o empurrão da multidão e a ladeira a favor fazem você correr mais rápido do que aguenta por 15 km. Desça solto, com passos curtos, e deixe passar quem quiser passar.</p>
<h3>Pacaembu e meio da prova: encontre o seu ritmo</h3>
<p>Na parte plana, perto do Pacaembu e nas avenidas até o centro, é hora de achar o ritmo que você consegue sustentar. Se o seu plano é correr e caminhar, mantenha os blocos que treinou.</p>
<h3>Centro histórico: economize</h3>
<p>O centro é bonito e barulhento, com público e pontos conhecidos. Aproveite, mas guarde energia: a parte que decide a prova ainda vem.</p>
<h3>Brigadeiro: a subida que decide a prova</h3>
<p>A Brigadeiro Luís Antônio sobe até a Paulista quando a perna já tem mais de 12 km. Encurte a passada, use os braços e mantenha o esforço, não a velocidade. Caminhar em algum momento da subida é normal e, para muita gente, é a estratégia certa. Quem treinou força e subidas sente a diferença exatamente aqui — é por isso que o <a href="/blog/treino-sao-silvestre-13-semanas">plano de treino de 13 semanas</a> tem subidas e step-up.</p>
<h3>Paulista: os metros finais</h3>
<p>Depois da subida, a chegada está perto. Se sobrou energia, é aqui que você acelera.</p>

<h2>Quanto tempo você levaria nesse percurso?</h2>
<p>O percurso não é plano, então a conta simples de ritmo engana. O <a href="/ferramentas/previsor-sao-silvestre">Previsor da São Silvestre</a> parte do seu tempo em 5 km, 10 km ou meia e soma uma margem para a descida cheia da largada e para a subida da Brigadeiro.</p>

<h2>Serviços no percurso</h2>
<p>A organização monta pontos de hidratação, banheiros e atendimento médico ao longo dos 15 km. O mapa com a posição de cada serviço é publicado no site oficial da prova antes da largada; confira na semana da corrida.</p>

<h2>Corra a sua prova</h2>
<p>Ninguém corre a São Silvestre do mesmo jeito: tem quem desça voando e quem caminhe a Brigadeiro inteira. Não se compare com quem está do seu lado — cada um tem a própria genética, rotina e história. O que importa é conhecer o seu percurso e o seu ritmo. Se quiser se preparar comigo, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.saosilvestre.com.br/" target="_blank" rel="noopener noreferrer">São Silvestre — site oficial</a></li>
<li>Veículos consultados para o trajeto de 2025 (largada, chegada, ruas e pontos de passagem): CNN Brasil, Olympics.com, InfoMoney, Veja São Paulo.</li>
</ul>`,
    faq: [
      { question: "Quantos km tem a São Silvestre?", answer: "15 km, com largada e chegada na Avenida Paulista, em pontos diferentes." },
      { question: "A São Silvestre tem 42 km?", answer: "Não. A São Silvestre tem 15 km. 42 km (42,195 km) é a distância da maratona." },
      { question: "Qual é o percurso da São Silvestre?", answer: "Pela referência de 2025: largada na Paulista, descida pela Doutor Arnaldo até o Pacaembu, avenidas Marquês de São Vicente e Rudge, centro histórico pelas avenidas Rio Branco, Ipiranga e São João, Duque de Caxias, subida da Brigadeiro Luís Antônio e chegada na Paulista, 900." },
      { question: "Onde é a largada e a chegada da São Silvestre?", answer: "A largada é na Avenida Paulista, entre as ruas Frei Caneca e Augusta; a chegada é na Paulista, 900, em frente à Fundação Cásper Líbero." },
      { question: "Qual a parte mais difícil do percurso?", answer: "A subida da Avenida Brigadeiro Luís Antônio, perto do fim, quando o corredor já passou dos 12 km." },
    ],
  },
  {
    slug: "vencedores-sao-silvestre",
    title: "Vencedores da São Silvestre: campeões, recordes e brasileiros",
    metaTitle: "Vencedores da São Silvestre: Campeões, Recordes e Brasileiros",
    metaDescription:
      "Quem venceu a São Silvestre 2025, o recorde masculino e feminino dos 15 km, os maiores campeões da história e os brasileiros que já ganharam a prova.",
    excerpt:
      "Os campeões de 2025, os recordes do percurso, Paul Tergat e Rosa Mota, e o último brasileiro a vencer a São Silvestre — tudo o que se pergunta sobre os vencedores.",
    category: "Treinamento",
    date: "2026-09-29",
    readTime: "5 min",
    author: AUTOR,
    tags: ["São Silvestre", "vencedores São Silvestre", "recorde São Silvestre", "corrida de rua", "atletismo"],
    content: `<img src="/blog-images/vencedores-sao-silvestre-capa.webp" alt="Capa: vencedores da São Silvestre — recorde de 42min59s, Rosa Mota com seis títulos e Marílson, único brasileiro tricampeão" width="1800" height="1013" loading="eager" style="width:100%;height:auto;border-radius:12px;margin:0 0 1.5rem;" />
<p>A <strong>São Silvestre</strong> é disputada desde 1925 e, desde que virou internacional, é dominada por corredores do leste da África. Aqui estão os <strong>vencedores de 2025</strong>, os <strong>recordes</strong> dos 15 km, os <strong>maiores campeões</strong> da história e os <strong>brasileiros</strong> que já venceram. A 101ª edição, em 31 de dezembro de 2026, entra nesta página com o resultado oficial.</p>

<h2>Vencedores da São Silvestre 2025</h2>
<p>Na 100ª edição, em 31 de dezembro de 2025:</p>
<table><thead><tr><th>Categoria</th><th>Campeão(ã)</th><th>Tempo</th><th>Melhor brasileiro(a)</th></tr></thead><tbody>
<tr><td>Masculino</td><td><strong>Muse Gizachew</strong> (Etiópia)</td><td>44min28s</td><td>Fábio Jesus, 3º</td></tr>
<tr><td>Feminino</td><td><strong>Sisilia Panga</strong> (Tanzânia)</td><td>51min08s</td><td>Núbia Oliveira, 3ª</td></tr>
</tbody></table>

<h2>Recorde da São Silvestre</h2>
<table><thead><tr><th>Categoria</th><th>Recorde</th><th>Atleta</th><th>Ano</th></tr></thead><tbody>
<tr><td>Masculino</td><td><strong>42min59s</strong></td><td>Kibiwott Kandie (Quênia)</td><td>2019</td></tr>
<tr><td>Feminino</td><td><strong>48min35s</strong></td><td>Jemima Sumgong (Quênia)</td><td>2016</td></tr>
</tbody></table>
<p>Kandie foi o primeiro a correr os 15 km abaixo de 43 minutos, numa chegada decidida no último passo, e quebrou a marca que era de Paul Tergat desde 1995. A marca feminina de Sumgong, campeã olímpica da maratona naquele ano, superou os 48min48s de Priscah Jeptoo, de 2011. Em 2017, Sumgong foi suspensa por doping.</p>
<p>Para ter ideia do ritmo: 42min59s em 15 km é menos de 2min52s por quilômetro, sustentado por uma prova com a subida da Brigadeiro no fim.</p>

<h2>Quem é o maior vencedor da São Silvestre?</h2>
<ul>
<li><strong>Masculino:</strong> o queniano <strong>Paul Tergat</strong>, com cinco vitórias (1995, 1996, 1998, 1999 e 2000).</li>
<li><strong>Feminino e geral:</strong> a portuguesa <strong>Rosa Mota</strong>, com seis vitórias seguidas, de 1981 a 1986 — a maior vencedora da história da prova.</li>
</ul>

<h2>Qual brasileiro já ganhou a São Silvestre?</h2>
<p>O Brasil tem campeões nas duas categorias. Os mais lembrados:</p>
<ul>
<li><strong>Marílson Gomes dos Santos</strong> — único brasileiro tricampeão (2003, 2005 e 2010) e o último homem do país a vencer, em 2010.</li>
<li><strong>Franck Caldeira</strong> — campeão em 2006.</li>
<li><strong>Lucélia Peres</strong> — campeã em 2006, a última brasileira a vencer a prova feminina.</li>
</ul>
<p>Desde então, quenianos, etíopes, ugandenses e tanzanianos dividem as vitórias. Em 2025, Fábio Jesus e Núbia Oliveira colocaram o Brasil no pódio, os dois em 3º lugar.</p>

<h2>E o seu tempo?</h2>
<p>O recorde é de 42min59s; a maior parte dos participantes leva bem mais de uma hora — e isso não diz nada sobre quem é melhor. Cada um corre contra o próprio relógio. Para saber o seu tempo provável, use o <a href="/ferramentas/previsor-sao-silvestre">Previsor da São Silvestre</a>; para se preparar, o <a href="/blog/treino-sao-silvestre-13-semanas">plano de treino de 13 semanas</a>; e, para conhecer o trajeto, o <a href="/blog/percurso-sao-silvestre">percurso trecho a trecho</a>.</p>

<h2>Corra a sua prova</h2>
<p>Os campeões treinam a vida inteira para disputar segundos. Você não precisa disso para viver a São Silvestre: não se compare com ninguém — cada um tem a própria genética, rotina e história. O que importa é um plano que você consiga seguir. Se quiser montar o seu comigo, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://www.saosilvestre.com.br/" target="_blank" rel="noopener noreferrer">São Silvestre — site oficial</a></li>
<li>Veículos consultados: Gazeta Esportiva, Band, Jornal Cruzeiro, CBAt, Olympics.com, Metrópoles, Lance!, CNN Brasil.</li>
</ul>`,
    faq: [
      { question: "Quem venceu a São Silvestre 2025?", answer: "Muse Gizachew, da Etiópia, no masculino (44min28s), e Sisilia Panga, da Tanzânia, no feminino (51min08s). Fábio Jesus e Núbia Oliveira foram 3º e 3ª." },
      { question: "Qual o recorde da São Silvestre?", answer: "No masculino, 42min59s, do queniano Kibiwott Kandie, em 2019. No feminino, 48min35s, da queniana Jemima Sumgong, em 2016." },
      { question: "Quem é o maior vencedor da São Silvestre?", answer: "Rosa Mota, de Portugal, com seis vitórias seguidas (1981 a 1986). No masculino, o queniano Paul Tergat, com cinco." },
      { question: "Qual brasileiro já ganhou a São Silvestre?", answer: "Vários. Marílson Gomes dos Santos é o único tricampeão (2003, 2005 e 2010) e o último homem brasileiro a vencer. Lucélia Peres, em 2006, foi a última brasileira campeã." },
      { question: "Quando um brasileiro venceu a São Silvestre pela última vez?", answer: "No masculino, Marílson Gomes dos Santos, em 2010. No feminino, Lucélia Peres, em 2006." },
    ],
  },
  {
    slug: "primeira-sao-silvestre-dicas",
    title: "Primeira São Silvestre: dicas para estrear nos 15 km",
    metaTitle: "Primeira São Silvestre: Dicas para Iniciantes (Guia 2026)",
    metaDescription:
      "Vai correr a São Silvestre pela primeira vez? O que fazer na véspera, o que levar, como largar no pelotão, segurar a descida e encarar a Brigadeiro. Guia para iniciantes.",
    excerpt:
      "Guia para quem vai estrear na São Silvestre: preparação, véspera, o que levar, largada no pelotão, descida, Brigadeiro e o pós-prova.",
    category: "Treinamento",
    date: "2026-09-29",
    readTime: "7 min",
    author: AUTOR,
    tags: ["São Silvestre", "São Silvestre 2026", "primeira corrida", "iniciante", "dicas de corrida", "15 km"],
    content: `<img src="/blog-images/primeira-sao-silvestre-dicas-capa.webp" alt="Capa: primeira São Silvestre — dicas para estrear nos 15 km, da véspera à chegada na Paulista" width="1800" height="1013" loading="eager" style="width:100%;height:auto;border-radius:12px;margin:0 0 1.5rem;" />
<p>A primeira <strong>São Silvestre</strong> tem um clima que nenhuma outra prova tem: dezenas de milhares de pessoas na Paulista, fantasia, música e o último dia do ano. Também tem armadilhas que pegam quase todo estreante — a descida forte logo depois da largada, o pelotão apertado e a subida da Brigadeiro no fim. Este guia é para você chegar à chegada inteiro e com vontade de voltar.</p>

<h2>Quanto tempo antes começar a treinar?</h2>
<p>Quanto antes, melhor. Para quem já corre 5 km, de 10 a 13 semanas bastam para chegar aos 15 km com segurança. Para quem está começando do zero, o mesmo prazo permite completar a prova alternando corrida e caminhada — e três a seis meses deixam tudo mais tranquilo. O <a href="/blog/treino-sao-silvestre-13-semanas">plano de treino de 13 semanas</a> traz uma planilha só para iniciantes, também em PDF para imprimir. Se você ainda não corre nem 5 km, comece pelo guia de <a href="/blog/corrida-para-iniciantes">corrida para iniciantes</a>.</p>

<h2>Como se preparar: o básico que resolve</h2>
<ul>
<li><strong>Aumente o volume aos poucos.</strong> Suba a distância semana a semana, com uma semana mais leve a cada três ou quatro.</li>
<li><strong>Corra quase sempre leve.</strong> Uma regra usada por treinadores é a do <strong>80/20</strong>: cerca de 80% do treino em ritmo fácil, em que dá para conversar, e só 20% em ritmo forte. Para quem está começando, é o que evita lesão e cansaço acumulado.</li>
<li><strong>Faça musculação duas vezes por semana.</strong> Pernas e tronco fortes protegem as articulações e seguram a Brigadeiro.</li>
<li><strong>Treine subidas.</strong> A partir da metade da preparação, inclua subidas curtas em um treino por semana.</li>
</ul>

<h2>O que fazer um dia antes da prova</h2>
<ul>
<li>Descanse ou faça só uma caminhada ou um trote bem leve.</li>
<li>Coma o que você está acostumado; nada de testar comida nova.</li>
<li>Beba água ao longo do dia.</li>
<li>Separe tudo à noite: número de peito com chip, roupa, tênis, documento.</li>
<li>Durma cedo. A largada do pelotão geral é de manhã cedo — em 2025, foi às 8h10.</li>
</ul>

<h2>O que levar e o que vestir</h2>
<ul>
<li><strong>Tênis já amaciado</strong>, usado em treinos longos. Tênis novo na prova é a receita de bolha.</li>
<li><strong>Roupa leve</strong>, que você já testou. Dezembro em São Paulo costuma ser quente; boné e protetor solar ajudam.</li>
<li><strong>Número de peito preso na frente</strong>, com o chip, sem dobrar.</li>
<li>Pouca coisa nos bolsos: <strong>documento de identificação</strong> e cartão ou celular bastam.</li>
<li><strong>Hidratação:</strong> use os postos de água do percurso. Gel ou isotônico só se você já testou no treino — prova não é lugar de novidade.</li>
<li>Se for fantasiado, teste a fantasia num treino antes — 15 km é bastante tempo para algo apertar ou esquentar.</li>
</ul>

<h2>Chegue cedo</h2>
<p>A região da Paulista fica fechada e cheia. Planeje chegar com folga, de preferência de transporte público, e deixe tempo para banheiro e para entrar no seu pelotão com calma. Chegar em cima da hora é o jeito mais fácil de começar a prova ansioso.</p>

<h2>Na largada: paciência com o pelotão</h2>
<p>No pelotão geral, os primeiros minutos são de gente parada, andando e se esbarrando. Não gaste energia costurando entre as pessoas: o ritmo abre sozinho depois dos primeiros quilômetros. O seu tempo é marcado pelo chip a partir do momento em que você cruza o tapete da largada, não do tiro.</p>

<h2>A descida: o erro número um do estreante</h2>
<p>Logo depois da largada o percurso desce forte em direção ao Pacaembu. Com a empolgação e a ladeira a favor, dá vontade de voar — e é aí que muita gente queima a perna que vai faltar no fim. Desça solto, com passos curtos, num ritmo que pareça fácil demais. Veja o <a href="/blog/percurso-sao-silvestre">percurso trecho a trecho</a>.</p>

<h2>A Brigadeiro: esforço, não velocidade</h2>
<p>A subida da Avenida Brigadeiro Luís Antônio vem no fim. Diminua o ritmo, encurte a passada, incline levemente o corpo para a frente e use os braços. Caminhar em algum momento é normal e pode ser a melhor estratégia. O que não pode é chegar ali sem energia porque você correu rápido demais na descida.</p>

<h2>Dor: quando parar</h2>
<p>Cansaço e desconforto muscular fazem parte. Dor forte, dor que piora a cada passo, dor em um ponto do osso, tontura ou mal-estar não fazem: pare, caminhe e procure o atendimento médico da prova. Nenhuma medalha vale uma lesão.</p>

<h2>Depois da chegada</h2>
<p>Continue andando alguns minutos, beba água e coma algo. Nos dias seguintes, é normal ter dor muscular; caminhadas leves ajudam. Volte a correr quando as pernas estiverem sem dor.</p>

<h2>Quanto tempo você vai levar?</h2>
<p>Na primeira São Silvestre, a meta é terminar bem — mas é natural querer ter uma ideia. O <a href="/ferramentas/previsor-sao-silvestre">Previsor da São Silvestre</a> parte do seu tempo em 5 km, 10 km ou meia e mostra a faixa provável nos 15 km, já com a subida na conta.</p>

<h2>Corra a sua prova</h2>
<p>Na primeira São Silvestre você vai ver gente mais rápida, mais lenta, fantasiada, caminhando e correndo. Não se compare com ninguém: cada um tem a própria genética, rotina e história, com altos e baixos. A sua prova é contra o seu relógio — e o objetivo é voltar no ano que vem. Se quiser se preparar comigo, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>

${FONTES_SS}`,
    faq: [
      { question: "Iniciante pode correr a São Silvestre?", answer: "Pode. A prova é aberta a quem corre e a quem alterna corrida e caminhada. Com algumas semanas de preparação gradual, é possível completar os 15 km com segurança." },
      { question: "Quanto tempo antes devo começar a treinar para a primeira São Silvestre?", answer: "Para quem já corre 5 km, 10 a 13 semanas bastam. Para quem está começando do zero, o ideal é ter de três a seis meses, ou fazer a prova alternando corrida e caminhada." },
      { question: "O que é a regra 80/20 na corrida?", answer: "É a orientação de fazer cerca de 80% do treino em ritmo fácil, em que dá para conversar, e só 20% em ritmo forte. Ajuda a evoluir sem acumular cansaço nem se lesionar." },
      { question: "O que fazer um dia antes de correr a São Silvestre?", answer: "Descansar ou fazer só um trote leve, comer o que já está acostumado, beber água, separar número, chip, roupa e tênis e dormir cedo." },
      { question: "O que levar no dia da São Silvestre?", answer: "Número de peito com chip preso na frente da camiseta, documento de identificação, tênis já amaciado, roupa leve testada, boné e protetor solar. Gel ou isotônico só se já testou no treino." },
      { question: "O que tomar para ter mais fôlego na São Silvestre?", answer: "Fôlego vem do treino, não de um produto. No dia, beba água nos postos do percurso e use gel ou isotônico apenas se já tiver testado em treinos longos." },
      { question: "Qual o maior erro de quem corre a São Silvestre pela primeira vez?", answer: "Correr rápido demais na descida logo depois da largada. A energia gasta ali faz falta na subida da Brigadeiro, no fim da prova." },
    ],
  },
];
