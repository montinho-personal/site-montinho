import type { BlogPost } from "./blog";

/**
 * Dúvidas de quem está decidindo entre formatos de acompanhamento
 * (15/11/2026): online x presencial, avaliação física a distância e
 * consultoria online para quem treina na Smart Fit.
 *
 * Vieram da lista de pautas que o Montinho mandou em 15/11. A checagem de
 * canibalização (sem acento e sem hífen, slug e título) não achou artigo
 * próprio para nenhuma das três. As outras perguntas sobre personal online
 * (para emagrecer, hipertrofia, iniciante, vídeos, correção, tempo de
 * resultado) ficam como seção de personal-trainer-online-como-funciona, para
 * não abrir páginas que disputariam o mesmo termo.
 *
 * Publicados a pedido do Montinho ANTES dos prints; título, H2 e FAQ serão
 * revistos com a pesquisa.
 *
 * O que a consultoria do Montinho inclui sai da própria página
 * /consultoria-online: plano individual, vídeo de execução de cada
 * exercício, correção por vídeo, ajustes, suporte no WhatsApp, check-ins e
 * reavaliações periódicas, sem aula ao vivo e sem plano alimentar. Nenhum
 * preço aqui: valores ficam no artigo de quanto custa e na proposta.
 *
 * Presencial: só Arena 18, condomínios e em casa; outras academias dependem
 * das regras do local para personal externo e de combinação prévia. A Smart
 * Fit entra apenas como lugar onde o aluno da consultoria treina.
 *
 * Ferramenta: nenhuma das três deixa uma conta na cabeça (registro em
 * ARTIGOS_SEM_FERRAMENTA).
 */

export const CONSULTORIA_ONLINE_DUVIDAS_POSTS: BlogPost[] = [
  {
    slug: "consultoria-online-ou-personal-presencial",
    title: "Consultoria Online ou Personal Presencial: Qual Escolher?",
    metaTitle: "Consultoria Online ou Personal Presencial: Qual Escolher?",
    metaDescription:
      "O presencial corrige cada série na hora; a consultoria online dá liberdade de horário e acompanha a semana toda. Veja para quem cada formato funciona.",
    excerpt:
      "As diferenças reais entre consultoria online e personal presencial: correção da execução, horário, lugar, custo e constância. E os sinais de que você precisa de um ou de outro.",
    category: "Treino",
    date: "2026-11-15",
    readTime: "7 min",
    author: "Montinho",
    tags: ["consultoria online", "personal trainer", "personal presencial", "treino personalizado"],
    faq: [
      {
        question: "Qual a diferença entre consultoria online e personal presencial?",
        answer:
          "O profissional pode ser o mesmo; muda o formato. No presencial, o personal está do seu lado durante a sessão e corrige cada série na hora. Na consultoria online, ele monta o plano, analisa os vídeos da sua execução e ajusta o treino a distância, com contato entre os treinos.",
      },
      {
        question: "Consultoria online funciona tão bem quanto o presencial?",
        answer:
          "Funciona quando existe acompanhamento de verdade: correção por vídeo, ajuste do plano e conversa entre os treinos. Para quem já sabe treinar com segurança e consegue manter a constância sozinho na sessão, costuma ser suficiente. Para quem precisa de alguém do lado para treinar, o presencial rende mais.",
      },
      {
        question: "Consultoria online é mais barata que personal presencial?",
        answer:
          "Em geral, sim, porque o profissional não precisa estar presente em cada sessão. O valor de cada formato depende do plano e da duração. Os números estão no artigo sobre quanto custa uma consultoria online.",
      },
      {
        question: "Iniciante pode começar pela consultoria online?",
        answer:
          "Pode, com vídeos de cada exercício, envio da sua execução e correção. Mas quem nunca treinou, tem medo de se machucar ou não confia na própria execução costuma aprender mais rápido com algumas sessões presenciais no começo.",
      },
      {
        question: "Dá para misturar consultoria online e personal presencial?",
        answer:
          "Dá. Algumas sessões presenciais para aprender e corrigir, e o resto da semana com o plano e o acompanhamento online. É um jeito de ter correção na hora sem pagar o presencial todos os dias.",
      },
      {
        question: "Quem tem dor ou lesão deve escolher o presencial?",
        answer:
          "Depende do caso. Com dor ativa ou na volta de uma lesão, ter alguém observando cada série ajuda a ajustar na hora. Com a dor controlada e liberação para treinar, a consultoria online também funciona, com o plano adaptado à sua condição.",
      },
      {
        question: "A consultoria online tem aula ao vivo?",
        answer:
          "Na maioria das consultorias, não. Você treina quando e onde puder, grava a execução e recebe correções e ajustes. É isso que dá liberdade de horário. Quem precisa de alguém do lado em cada série tem no presencial o formato certo.",
      },
    ],
    content: `<img src="/blog-images/consultoria-online-ou-personal-presencial-capa.webp" alt="Capa: Consultoria online ou personal presencial. Qual escolher. Ilustração de um celular e de um halter lado a lado" title="Consultoria Online ou Personal Presencial — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>Consultoria online e personal presencial não são uma versão boa e uma versão barata da mesma coisa. São dois formatos diferentes de acompanhamento, cada um com o seu ponto forte. A escolha certa depende menos de qual é "melhor" e mais de onde você costuma travar.</p>

<h2>Qual a diferença entre consultoria online e personal presencial?</h2>
<p>O profissional pode ser o mesmo. O que muda é <strong>onde</strong> e <strong>quando</strong> o acompanhamento acontece.</p>
<ul>
<li><strong>Personal presencial:</strong> o personal está do seu lado durante a sessão. Corrige cada série na hora, decide a carga com você e faz a sessão acontecer no horário marcado.</li>
<li><strong>Consultoria online:</strong> o personal monta o plano, você treina quando e onde puder, grava a execução e manda. Ele corrige, ajusta o plano e conversa com você entre os treinos.</li>
</ul>
<p>O plano, a progressão e o ajuste existem nos dois. O que só o presencial tem é a correção no instante da série. O que só a consultoria tem é a liberdade completa de horário e de lugar.</p>

<h2>Comparando os dois formatos</h2>
<table>
<thead><tr><th></th><th>Personal presencial</th><th>Consultoria online</th></tr></thead>
<tbody>
<tr><td>Correção da execução</td><td>Na hora, série a série</td><td>Por vídeo, depois do treino</td></tr>
<tr><td>Horário</td><td>Marcado com o personal</td><td>Você decide</td></tr>
<tr><td>Lugar</td><td>Onde o personal atende</td><td>Qualquer academia, casa ou hotel</td></tr>
<tr><td>Ajuste do plano</td><td>Durante e entre as sessões</td><td>Entre os treinos, pelos vídeos e check-ins</td></tr>
<tr><td>Constância</td><td>O horário marcado ajuda a ir</td><td>Depende mais de você</td></tr>
<tr><td>Custo</td><td>Maior</td><td>Em geral, uma fração do presencial</td></tr>
</tbody>
</table>

<h2>Quando o personal presencial é a melhor escolha</h2>
<ul>
<li><strong>Você nunca treinou e não confia na própria execução.</strong> Aprender agachamento, terra e supino com alguém do lado é mais rápido e mais seguro.</li>
<li><strong>Você só vai quando tem hora marcada.</strong> Se o compromisso com outra pessoa é o que te tira de casa, o presencial resolve exatamente isso.</li>
<li><strong>Está voltando de uma lesão ou com dor ativa.</strong> Ver a reação do corpo em cada série ajuda a ajustar na hora.</li>
<li><strong>Precisa de alguém puxando a intensidade.</strong> Tem gente que, sozinha, para longe demais da falha.</li>
</ul>

<h2>Quando a consultoria online faz mais sentido</h2>
<ul>
<li><strong>Sua agenda muda toda semana.</strong> Viagem, plantão, filhos: o treino acontece quando der, sem depender do horário de ninguém.</li>
<li><strong>Você já treina e travou.</strong> Quem sabe executar o básico, mas não sabe montar o plano, progredir a carga ou sair do platô, costuma ganhar muito com o acompanhamento online.</li>
<li><strong>Você treina numa academia onde o personal externo não entra</strong>, ou mora longe de quem você quer que te acompanhe.</li>
<li><strong>O custo do presencial não cabe</strong> três vezes por semana, todo mês.</li>
</ul>

<h2>Dá para misturar os dois?</h2>
<p>Dá, e muitas vezes é a melhor solução. Algumas sessões presenciais para aprender os exercícios principais e acertar a execução, e o resto da semana com o plano e o acompanhamento online. Você tem a correção na hora quando ela mais importa e a liberdade no resto.</p>

<h2>O que avaliar antes de contratar qualquer um dos dois</h2>
<ul>
<li><strong>Formação em Educação Física.</strong> Pergunte e confira.</li>
<li><strong>Plano feito para você.</strong> Ficha igual para todo mundo não é acompanhamento, seja online ou presencial.</li>
<li><strong>Como a execução é corrigida.</strong> No online, pergunte se ele assiste aos seus vídeos e como devolve a correção.</li>
<li><strong>O que acontece quando a carga para de subir.</strong> A resposta mostra se existe ajuste ou só entrega de ficha.</li>
<li><strong>Promessa de resultado em prazo fixo.</strong> Desconfie.</li>
</ul>
<p>Mais critérios em <a href="/blog/como-escolher-um-bom-personal-trainer">como escolher um bom personal trainer</a>, e o funcionamento do formato online em <a href="/blog/personal-trainer-online-como-funciona">personal trainer online: como funciona</a>.</p>

<h2>Como funciona comigo</h2>
<p>Eu atendo nos dois formatos. O presencial é em Alphaville e região: na Arena 18, na academia do seu condomínio ou na sua casa. Em outra academia, depende das regras do local para personal externo e de combinação prévia. Detalhes em <a href="/personal-trainer-alphaville">personal trainer em Alphaville</a>.</p>
<p>A <a href="/consultoria-online">consultoria online</a> vale para qualquer lugar do Brasil: plano montado para a sua rotina, vídeo de execução de cada exercício, correção dos seus vídeos, ajustes quando a carga trava ou a semana muda, e conversa direta comigo pelo WhatsApp. Não tem aula ao vivo, e o plano alimentar fica com o nutricionista.</p>
<p>Se você ainda não sabe qual combina com você, a primeira conversa serve exatamente para isso.</p>

<h2>Não se compare</h2>
<p>Não escolha o formato porque um amigo evoluiu com ele. Cada um tem a própria genética, rotina e história, com altos e baixos. O formato certo é o que você consegue manter por anos, com aderência e progressão, e isso depende da sua semana, não da dele.</p>`,
  },
  {
    slug: "avaliacao-fisica-consultoria-online",
    title: "Avaliação Física na Consultoria Online: Como Funciona",
    metaTitle: "Avaliação Física Online: Como Funciona na Consultoria",
    metaDescription:
      "Sem bioimpedância nem adipômetro, a avaliação online usa histórico, fotos, medidas, peso médio e vídeos. Veja como medir em casa e o que ela mostra.",
    excerpt:
      "O que entra numa avaliação física a distância, como tirar fotos e medidas em casa do jeito certo, o que ela não consegue medir e como a reavaliação mostra se o plano está funcionando.",
    category: "Treino",
    date: "2026-11-15",
    readTime: "7 min",
    author: "Montinho",
    tags: ["avaliação física", "consultoria online", "medidas corporais", "evolução"],
    faq: [
      {
        question: "Como é feita a avaliação física na consultoria online?",
        answer:
          "Com o que dá para coletar a distância: questionário de histórico, rotina e saúde, fotos padronizadas, medidas com fita métrica, peso médio da semana e vídeos de alguns movimentos e exercícios. Com isso o personal monta o ponto de partida e repete a avaliação de tempos em tempos para comparar.",
      },
      {
        question: "Avaliação online mede percentual de gordura?",
        answer:
          "Não com precisão. Sem exame, o percentual de gordura é uma estimativa. O que a avaliação online mede bem é a mudança: cintura, fotos e peso médio comparados com você mesmo, nas mesmas condições.",
      },
      {
        question: "Preciso de bioimpedância para começar a consultoria online?",
        answer:
          "Não. Se você já tem um exame, ajuda como referência, mas não é obrigatório. Medidas com fita, fotos e peso médio, repetidos sempre do mesmo jeito, já mostram se o plano está funcionando.",
      },
      {
        question: "Como tirar as fotos para a avaliação online?",
        answer:
          "Mesmo lugar, mesma luz, mesma roupa justa, de manhã, antes de comer. Frente, lado e costas, com o celular na altura do umbigo e a mesma distância. Sem contrair nem encolher a barriga. O que importa é repetir igual na reavaliação.",
      },
      {
        question: "Quais medidas tirar em casa?",
        answer:
          "Cintura na altura do umbigo é a mais útil. Quadril, braço e coxa completam. Use fita métrica flexível, meça de manhã, sem apertar a pele, e anote. Repita as mesmas medidas no mesmo lugar do corpo.",
      },
      {
        question: "De quanto em quanto tempo refazer a avaliação?",
        answer:
          "As medidas e fotos costumam ser refeitas a cada algumas semanas, porque mudanças pequenas não aparecem de uma semana para a outra. O peso dá para acompanhar pela média semanal. O intervalo certo é combinado com quem acompanha você.",
      },
      {
        question: "A avaliação online avalia postura e mobilidade?",
        answer:
          "Em parte. Vídeos de um agachamento, de braços acima da cabeça ou de outros movimentos mostram limitações que mudam a escolha dos exercícios. Não substituem uma avaliação clínica quando há dor ou lesão.",
      },
    ],
    content: `<img src="/blog-images/avaliacao-fisica-consultoria-online-capa.webp" alt="Capa: Avaliação física online. Como funciona. Ilustração de fita métrica e celular" title="Avaliação Física na Consultoria Online — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>Na consultoria online não tem balança de bioimpedância nem adipômetro no meio da sala. Mesmo assim, dá para fazer uma avaliação útil: não para descobrir um número exato de gordura, mas para saber de onde você parte e se o plano está funcionando.</p>

<h2>Como funciona a avaliação física na consultoria online?</h2>
<p>Ela junta o que dá para coletar a distância:</p>
<ol>
<li><strong>Histórico e rotina.</strong> Objetivo, há quanto tempo treina, o que já tentou, quantos dias e quanto tempo tem por semana, onde treina, sono, trabalho.</li>
<li><strong>Saúde.</strong> Dores, lesões, cirurgias, remédios e liberação médica quando for o caso.</li>
<li><strong>Fotos padronizadas</strong> de frente, lado e costas.</li>
<li><strong>Medidas com fita métrica</strong>, principalmente a cintura.</li>
<li><strong>Peso médio da semana</strong>, não o peso de um dia.</li>
<li><strong>Vídeos</strong> de alguns movimentos e dos exercícios que você já faz, para ver execução e limitações.</li>
<li><strong>Cargas atuais</strong>, quando você já treina.</li>
</ol>
<p>Com isso, o plano parte do seu ponto real, e não de uma ficha padrão.</p>

<h2>Como tirar as fotos do jeito certo</h2>
<ul>
<li>Mesmo lugar, mesma luz, mesma roupa justa.</li>
<li>De manhã, antes de comer.</li>
<li>Frente, lado e costas, com o corpo relaxado: sem contrair e sem encolher a barriga.</li>
<li>Celular na altura do umbigo, sempre na mesma distância. Um apoio ou o timer ajuda.</li>
</ul>
<p>A foto não precisa ser bonita. Precisa ser <strong>igual</strong> na próxima vez, porque é a comparação que conta.</p>

<h2>Quais medidas tirar em casa</h2>
<ul>
<li><strong>Cintura</strong>, na altura do umbigo: a mais útil para acompanhar gordura abdominal.</li>
<li><strong>Quadril</strong>, na parte mais larga do glúteo.</li>
<li><strong>Braço e coxa</strong>, sempre no mesmo ponto (marque a distância a partir do cotovelo e do joelho).</li>
</ul>
<p>Fita métrica flexível, de manhã, encostada na pele sem apertar. O passo a passo completo está em <a href="/blog/como-tirar-medidas-corporais">como tirar medidas corporais</a>. Com a cintura e a altura em mãos, a <a href="/ferramentas/relacao-cintura-altura">calculadora de relação cintura-altura</a> mostra onde você está.</p>

<h2>Peso: use a média, não o número do dia</h2>
<p>O peso oscila de um dia para o outro com água, sal, intestino e ciclo menstrual. Pese de manhã, depois do banheiro, alguns dias por semana, e compare a <strong>média</strong> de uma semana com a da outra. O número de um dia isolado engana para os dois lados.</p>

<h2>O que a avaliação online não consegue medir</h2>
<ul>
<li><strong>Percentual de gordura exato.</strong> Sem exame, é estimativa. E mesmo os exames têm margem de erro.</li>
<li><strong>Diagnóstico de dor ou lesão.</strong> Isso é com médico ou fisioterapeuta.</li>
<li><strong>Força máxima com segurança.</strong> Testar carga máxima sozinho não vale o risco; a evolução das cargas de trabalho já mostra a força subindo.</li>
</ul>
<p>Se você já tem um exame de bioimpedância ou DEXA, ele entra como referência. Não é obrigatório.</p>

<h2>A reavaliação: é ela que mostra o resultado</h2>
<p>A primeira avaliação diz de onde você parte. As seguintes dizem se o plano está funcionando. Fotos e medidas costumam ser refeitas a cada algumas semanas, porque mudanças pequenas não aparecem de uma semana para a outra. Entre uma e outra, a carga dos exercícios, a média do peso e a constância dos treinos já contam a história.</p>
<p>Quando a cintura não muda, a carga parou de subir ou a semana saiu do previsto, é aí que o plano muda. Mais sobre isso em <a href="/blog/como-saber-se-o-treino-esta-funcionando">como saber se o treino está funcionando</a>.</p>

<h2>Como é na minha consultoria</h2>
<p>Na <a href="/consultoria-online">consultoria online</a>, o plano começa pela conversa sobre objetivo, rotina, histórico e onde você vai treinar. Depois vêm os check-ins de evolução e as reavaliações periódicas, junto com a análise dos vídeos da sua execução. Se quiser começar só pela execução, a <a href="/revisao-de-execucao">revisão gratuita de execução</a> é o primeiro passo.</p>

<h2>Não se compare</h2>
<p>A foto da avaliação é para comparar você com você. Cada um tem a própria genética, rotina e história, com altos e baixos, e a foto do antes e depois de outra pessoa não diz nada sobre o seu ritmo. O que importa é encontrar um jeito de treinar que você consiga seguir por anos, com aderência e progressão.</p>`,
  },
  {
    slug: "personal-online-smart-fit",
    title: "Personal Online Treinando na Smart Fit: Vale a Pena?",
    metaTitle: "Personal Online na Smart Fit: Como Funciona e Vale a Pena?",
    metaDescription:
      "Dá para ter treino personalizado sem sair da Smart Fit: o plano usa os aparelhos da sua unidade e você envia vídeos. Veja como funciona e para quem vale.",
    excerpt:
      "Como funciona a consultoria online para quem treina na Smart Fit ou em outra academia de rede, como montar o treino com os aparelhos da unidade, horário de pico e o que avaliar antes de contratar.",
    category: "Treino",
    date: "2026-11-15",
    readTime: "6 min",
    author: "Montinho",
    tags: ["smart fit", "consultoria online", "personal online", "academia"],
    faq: [
      {
        question: "Vale a pena contratar personal online treinando na Smart Fit?",
        answer:
          "Vale para quem quer um plano feito para si, correção da execução e ajuste ao longo do tempo, mas quer continuar na academia que já paga. A consultoria online não depende da academia: o plano é montado com os aparelhos da sua unidade.",
      },
      {
        question: "Personal online consegue montar treino com os aparelhos da minha unidade?",
        answer:
          "Consegue. Você manda fotos ou uma lista dos aparelhos e pesos livres da sua unidade, e o plano é montado com eles. Se um aparelho quebrar ou estiver sempre ocupado, o exercício é trocado por outro equivalente.",
      },
      {
        question: "Posso gravar meu treino na Smart Fit para mandar ao personal?",
        answer:
          "Em geral, as pessoas gravam a própria execução com o celular apoiado. Enquadre só você, sem filmar outras pessoas, e confira as regras da sua unidade.",
      },
      {
        question: "Personal presencial pode atender dentro da Smart Fit?",
        answer:
          "Depende da regra da academia para personal externo. Antes de combinar, confira com a sua unidade. A consultoria online não tem essa questão, porque o personal não precisa estar lá.",
      },
      {
        question: "E se a academia estiver cheia no horário em que eu treino?",
        answer:
          "O plano pode prever trocas: se o aparelho estiver ocupado, você já sabe qual exercício fazer no lugar, com o mesmo objetivo. Assim o treino não trava por causa de fila.",
      },
      {
        question: "Consultoria online serve para outras academias de rede?",
        answer:
          "Serve para qualquer academia, inclusive a do condomínio ou a sua casa. O plano é feito para a estrutura que você tem.",
      },
    ],
    content: `<img src="/blog-images/personal-online-smart-fit-capa.webp" alt="Capa: Personal online na academia de rede. Vale a pena. Ilustração de celular com halter" title="Personal Online Treinando na Smart Fit — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p>Muita gente treina na Smart Fit ou em outra academia de rede porque é perto, abre cedo e cabe no bolso. O que costuma faltar é um plano feito para você e alguém olhando o que acontece semana a semana. A consultoria online é um jeito de ter isso sem trocar de academia.</p>

<h2>Vale a pena contratar personal online treinando na Smart Fit?</h2>
<p>Vale para quem:</p>
<ul>
<li>já gosta da academia e não quer mudar;</li>
<li>treina sem saber se o treino está certo, ou copia ficha da internet;</li>
<li>estagnou: a carga parou de subir e o corpo parou de mudar;</li>
<li>quer correção da execução sem pagar personal presencial todo dia.</li>
</ul>
<p>Não é para quem precisa de alguém do lado em cada série para conseguir treinar. Aí o formato certo é o presencial, e a comparação está em <a href="/blog/consultoria-online-ou-personal-presencial">consultoria online ou personal presencial</a>.</p>

<h2>Como o treino é montado com os aparelhos da sua unidade</h2>
<p>As unidades não são iguais: muda a quantidade de aparelhos, de halteres e de espaço de peso livre. Por isso o primeiro passo é saber o que existe na sua.</p>
<ol>
<li>Você manda fotos ou uma lista dos aparelhos, dos halteres e das barras.</li>
<li>O plano é montado só com o que existe ali.</li>
<li>Cada exercício vem com um substituto, para quando o aparelho estiver ocupado ou quebrado.</li>
</ol>
<p>A <a href="/ferramentas/substituidor-de-exercicios">ferramenta de substituição de exercícios</a> ajuda a achar trocas equivalentes no dia a dia.</p>

<h2>Horário de pico: como não perder o treino</h2>
<ul>
<li><strong>Exercício com substituto pronto.</strong> Aparelho ocupado vira outro exercício com o mesmo objetivo, sem improviso.</li>
<li><strong>Ordem flexível.</strong> Em muitos treinos dá para trocar a ordem dos exercícios de um mesmo grupo sem prejuízo.</li>
<li><strong>Halteres e polias</strong> costumam resolver o que a máquina não resolve.</li>
</ul>

<h2>Gravar a execução na academia</h2>
<p>A correção na consultoria online vem dos seus vídeos. Celular apoiado no chão ou num banco, de lado ou na diagonal, pegando o corpo inteiro e a série completa. Enquadre só você, sem filmar outras pessoas, e respeite as regras da sua unidade. O passo a passo está em <a href="/blog/como-filmar-seu-exercicio">como filmar o seu exercício</a>.</p>

<h2>E personal presencial dentro da Smart Fit?</h2>
<p>Depende da regra da academia para personal externo, e isso pode variar. Confira com a sua unidade antes de combinar qualquer coisa. O meu presencial é em Alphaville e região: na Arena 18, em condomínios ou em casa. Em outra academia, depende das regras do local para personal externo e de combinação prévia. A consultoria online funciona em qualquer academia, porque eu não preciso estar lá.</p>

<h2>O que avaliar antes de contratar</h2>
<ul>
<li>Formação em Educação Física.</li>
<li>Plano montado com os aparelhos da sua unidade, não uma ficha genérica.</li>
<li>Correção da execução por vídeo.</li>
<li>Ajuste quando a carga trava ou a sua semana muda.</li>
<li>Nada de promessa de resultado em prazo fixo.</li>
</ul>
<p>Valores estão em <a href="/blog/quanto-custa-consultoria-online-de-treino">quanto custa uma consultoria online</a>, e a análise da própria academia em <a href="/blog/vale-a-pena-smart-fit">vale a pena a Smart Fit?</a>.</p>

<h2>Como é comigo</h2>
<p>Na <a href="/consultoria-online">consultoria online</a>, o plano é feito para a sua academia, com vídeo de execução de cada exercício, correção dos seus vídeos, ajustes e conversa direta comigo pelo WhatsApp. Você continua onde já treina; quem muda é o jeito de treinar.</p>

<h2>Não se compare</h2>
<p>A academia cheia é o lugar onde mais dá vontade de olhar a carga do outro. Cada um tem a própria genética, rotina e história, com altos e baixos. A sua régua é a sua ficha: a mesma execução, com um pouco mais de carga ou uma repetição a mais que na semana passada.</p>`,
  },
];
