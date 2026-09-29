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
    content: `<blockquote><p><strong>As inscrições abrem na quarta-feira, 30 de setembro de 2026, às 10h (Brasília).</strong> São 55 mil vagas, e o kit mais barato custa R$ 335,90. Última verificação: 29 de setembro de 2026.</p></blockquote>
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
<p>A São Silvestre tem <strong>15 km</strong>, com largada e chegada na <strong>Avenida Paulista</strong>, em pontos diferentes, passando pela região central de São Paulo. O trecho mais conhecido — e mais temido — é a <strong>subida da Avenida Brigadeiro Luís Antônio</strong>, perto do fim, quando a perna já está cansada. É por causa dela que o treino de força faz tanta diferença nessa prova.</p>

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
      { question: "Quantos quilômetros tem a São Silvestre?", answer: "15 km, com largada e chegada na Avenida Paulista. O trecho mais difícil é a subida da Avenida Brigadeiro Luís Antônio, na parte final." },
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
    content: `<p>A São Silvestre tem <strong>15 km</strong>, com largada e chegada na Avenida Paulista. Da abertura das inscrições até a largada, em <strong>31 de dezembro</strong>, são cerca de <strong>13 semanas</strong>. É tempo suficiente para chegar bem aos <strong>15 km da São Silvestre</strong> — desde que o plano respeite o ponto de onde você parte. Quem hoje não corre 20 minutos seguidos e quem já faz 10 km precisam de treinos diferentes, e é por isso que este guia traz três planilhas, uma para cada ponto de partida — incluindo uma para iniciantes.</p>
<p>Antes de escolher, vale saber quanto tempo você levaria hoje: o <a href="/ferramentas/previsor-sao-silvestre">Previsor da São Silvestre</a> parte do seu tempo em 5 km, 10 km ou meia e mostra a faixa provável nos 15 km, com a subida na conta.</p>

<h2>Qual planilha é a sua?</h2>
<table><thead><tr><th>Você hoje</th><th>Plano</th><th>Objetivo em 31/12</th></tr></thead><tbody>
<tr><td>Não corre 20 minutos sem parar</td><td><strong>Plano 1 — Completar</strong></td><td>Terminar os 15 km inteiro, alternando corrida e caminhada</td></tr>
<tr><td>Corre 5 km sem parar</td><td><strong>Plano 2 — Correr os 15 km</strong></td><td>Correr a prova toda, em ritmo confortável</td></tr>
<tr><td>Já corre 10 km</td><td><strong>Plano 3 — Baixar o tempo</strong></td><td>Chegar mais rápido, com força para a Brigadeiro</td></tr>
</tbody></table>
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
      { question: "Dá para se preparar para a São Silvestre em um mês?", answer: "Para quem já corre 10 km com regularidade, sim, ajustando o volume e descansando na última semana. Para quem não corre, um mês é pouco para correr os 15 km com segurança; a meta realista é completar alternando corrida e caminhada." },
      { question: "Quantos km tem a São Silvestre?", answer: "15 km, com largada e chegada na Avenida Paulista e a subida da Avenida Brigadeiro Luís Antônio perto do fim." },
      { question: "Quantas vezes por semana devo treinar para a São Silvestre?", answer: "Três corridas por semana para quem quer completar ou correr a prova toda, quatro para quem quer baixar o tempo, e duas sessões de musculação para pernas e tronco em todos os casos." },
      { question: "Preciso correr 15 km antes da prova?", answer: "Não. Chegar a 13 ou 14 km no treino longo e reduzir o volume nas duas últimas semanas costuma render mais do que correr a distância total perto da largada. Quem busca tempo pode ir a 16 km no longo." },
      { question: "Como treinar para a subida da Brigadeiro?", answer: "Com treino de força duas vezes por semana (agachamento, afundo, subida no banco e panturrilha) e, a partir da semana 9, subidas curtas de 30 segundos a 1 minuto em um dos treinos de corrida." },
      { question: "Posso caminhar na São Silvestre?", answer: "Pode. Muitos participantes alternam corrida e caminhada, principalmente na subida da Brigadeiro. Caminhar com estratégia costuma dar um resultado melhor do que insistir em correr e quebrar." },
    ],
  },
];
