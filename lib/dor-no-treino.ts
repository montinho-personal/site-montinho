import type { BlogPost } from "./blog";

/**
 * Grupo "dor no treino" (04/11/2026). Nasceu das 27 perguntas de execução e
 * dor do app (Montinho Desbloqueia, src/lib/desbloqueia/base.ts, d116 a
 * d142) e das 7 de outras categorias que tocam em dor. Cruzando com o
 * acervo, quase tudo já tinha artigo (joelho no agachamento, lombar, hérnia,
 * ombro, joelho estalando, DOMS). Ficaram três lacunas:
 *
 *   ombro-estalando-e-normal            1.600 buscas/mês ("ombro estalando")
 *                                       + 320 ("estalo no ombro")
 *   anti-inflamatorio-atrapalha-hipertrofia   260 + 30 ("tomar antes do treino")
 *   treinar-com-dor                     50 + 20; página central do grupo
 *
 * Volumes do Planejador de Palavras-chave do Google Ads (Brasil). Publicados
 * a pedido do Montinho ANTES dos prints; título, H2 e FAQ serão revistos.
 *
 * Fontes: as mesmas que o app conferiu em 04/11/2026 (fontes.ts), para que
 * site e app digam a mesma coisa. Onde não há estudo específico (ombro
 * estalando sem dor), o texto diz isso, como o app faz.
 *
 * Nenhum artigo faz diagnóstico nem indica remédio. Todos dizem quando
 * procurar um profissional de saúde.
 *
 * Ferramentas:
 *   - ombro: Teste de Mobilidade (tem o teste de flexão de ombro na parede),
 *     com convite próprio em lib/mobilidade/artigos.ts;
 *   - anti-inflamatório e treinar com dor: sem ferramenta que responda a
 *     conta (registro em ARTIGOS_SEM_FERRAMENTA); o Substituidor de
 *     Exercícios vai por link no texto do "treinar com dor".
 */

const NAO_SE_COMPARE = `<h2>Não se compare</h2>
<p>Tem gente que treina anos sem um incômodo e gente que precisa ajustar exercício toda semana. Nenhum dos dois é a sua régua. Cada um tem a própria genética, rotina e história, com altos e baixos. O que muda o seu corpo é um treino que dê para seguir por anos, ajustado ao que o seu corpo aguenta hoje.</p>`;

export const DOR_NO_TREINO_POSTS: BlogPost[] = [
  {
    slug: "ombro-estalando-e-normal",
    title: "Ombro Estalando: É Normal? Quando Se Preocupar",
    metaTitle: "Ombro Estalando: É Normal? Quando Se Preocupar",
    metaDescription:
      "Ombro estalando no treino é normal? Estalo sem dor costuma não ser lesão. Veja quando o barulho merece atenção e o que ajustar no supino e no ombro.",
    excerpt:
      "Por que o ombro estala no supino, no desenvolvimento e na elevação lateral, quando o estalo é só barulho e quando ele vem com sinais que pedem avaliação.",
    category: "Treinamento",
    date: "2026-11-04",
    readTime: "6 min",
    author: "Montinho",
    tags: ["ombro estalando", "estalo no ombro", "dor no ombro", "musculação", "mobilidade"],
    faq: [
      { question: "Ombro estalando: como resolver?", answer: "Sem dor, não há o que resolver: é barulho. Com dor, ajuste o exercício que provoca (carga, amplitude, pegada), aqueça o ombro antes e fortaleça costas e manguito rotador. Se a dor não melhora em uma ou duas semanas com os ajustes, procure avaliação." },
      { question: "Ombro estalando quando levanta o braço ou ao girar: é normal?", answer: "Se não dói, costuma ser só barulho do movimento. Se dói ao levantar o braço ou ao girar, principalmente acima da cabeça, ou se a dor aparece no dia a dia, como para pegar algo no alto, vale avaliação." },
      { question: "Ombro estalando e dor no braço ou na escápula: o que pode ser?", answer: "Não dá para saber sem avaliação. Dor que desce pelo braço, formigamento, fraqueza ou dor na escápula que não passa com os ajustes no treino são motivos para procurar um profissional de saúde." },
      { question: "Como saber se o ombro está lesionado?", answer: "Só a avaliação de um profissional de saúde diz. Os sinais que pedem essa avaliação são dor que não passa ou piora, perda de força para levantar o braço, sensação de que o ombro sai do lugar, travamento, dor à noite e começo depois de queda ou pancada." },
      { question: "Ombro estalando e doendo: posso tomar remédio?", answer: "Quem decide remédio é o médico. E o uso frequente de anti-inflamatório pode atrapalhar o ganho de músculo; veja o artigo sobre anti-inflamatório e hipertrofia." },
      {
        question: "Ombro estalando é normal?",
        answer:
          "Na maioria das vezes, sim, quando não dói. Articulações fazem barulho, e estalo sem dor, sem perda de força e sem travamento costuma não indicar lesão. O que pede atenção é o estalo que vem junto com dor, fraqueza ou um ombro que trava.",
      },
      {
        question: "Ombro estalando sem dor é grave?",
        answer:
          "Em geral, não. Não achamos estudo que meça quantas pessoas têm o ombro estalando sem dor, mas no joelho um estudo com 323 mulheres mostrou que o estalo não teve relação com dor nem com função. Se o barulho é a única coisa diferente, siga treinando e observe.",
      },
      {
        question: "Ombro estalando com dor: o que fazer?",
        answer:
          "Baixe a carga ou a amplitude do exercício que provoca, e observe se a dor melhora nos dias seguintes. Se a dor for forte, piorar com o tempo, vier com perda de força ou o ombro travar, procure um profissional de saúde antes de seguir.",
      },
      {
        question: "Por que meu ombro estala no supino?",
        answer:
          "Pode ser só o movimento da articulação. Quando incomoda, ajustes simples costumam ajudar: pegada um pouco mais fechada, descer até onde não dói e controlar a descida. Uma revisão sugere pegada de até cerca de 1,5 vez a largura dos ombros para poupar o ombro.",
      },
      {
        question: "Ombro estalando no desenvolvimento ou na elevação lateral: posso continuar?",
        answer:
          "Sem dor, sim. Com incômodo, teste uma amplitude menor, faça o desenvolvimento pela frente em vez de por trás da cabeça e baixe a carga. Se o incômodo some com o ajuste, siga assim e aumente aos poucos.",
      },
      {
        question: "Estalar o ombro de propósito faz mal?",
        answer:
          "Não há estudo que mostre que estalar o ombro de propósito cause lesão. Se você precisa estalar o tempo todo para aliviar uma sensação de travado, vale investigar a mobilidade e o treino do ombro com alguém que acompanhe.",
      },
      {
        question: "Quando o estalo no ombro precisa de avaliação?",
        answer:
          "Quando vem com dor que não passa, perda de força, sensação de que o ombro sai do lugar, travamento ou depois de uma queda ou pancada. Nesses casos, procure um profissional de saúde.",
      },
    ],
    content: `<img src="/blog-images/ombro-estalando-e-normal-capa.webp" alt="Capa: Ombro estalando, é normal? Quando se preocupar. Ilustração de ombro com halter" title="Ombro Estalando — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Ombro estalando é normal?</strong> Quando não dói, quase sempre é. Articulações fazem barulho, e o ombro, que é a articulação que mais se mexe no corpo, faz bastante. O que separa o barulho que não importa do que pede atenção não é o estalo em si, e sim o que vem junto: dor, fraqueza ou um ombro que trava.</p>

<h2>Ombro estalando é normal?</h2>
<p><strong>Estalo sem dor, sem perda de força e sem travamento costuma não ser lesão.</strong> Sendo honesto: não achamos estudo que meça quantas pessoas têm o ombro estalando sem dor. O que existe é a pista de outras articulações. No joelho, um estudo com 323 mulheres mostrou que o estalo era comum e não teve relação com dor, com função nem com o quanto elas se mexiam no dia a dia.</p>
<p>Outra pista: exames de imagem costumam mostrar alterações no ombro de pessoas que não sentem nada. Uma revisão sistemática de 2025 juntou estudos sobre o manguito rotador em ombros sem dor e encontrou alterações com frequência, numa faixa muito larga entre os estudos. Ou seja: barulho e até exame alterado, sozinhos, não querem dizer que o ombro está machucado.</p>

<h2>Por que o ombro estala?</h2>
<p>O barulho pode vir do jeito que os tecidos deslizam uns sobre os outros durante o movimento, de pequenas mudanças de pressão dentro da articulação ou da escápula se movendo sobre as costelas. Na maior parte das vezes, ninguém consegue dizer de onde vem exatamente, e isso não muda o que fazer quando não há dor.</p>
<p>O que dá para observar no treino é <strong>quando</strong> estala: só no começo do treino e some depois do aquecimento? Só num exercício? Só numa parte do movimento? Essas respostas ajudam a decidir se vale mexer em alguma coisa.</p>

<h2>Ombro estalando sem dor: o que fazer?</h2>
<ul>
<li><strong>Siga treinando.</strong> Se o barulho é a única coisa diferente, não há motivo para tirar exercícios.</li>
<li><strong>Aqueça o ombro antes.</strong> Séries leves do próprio exercício e um pouco de mobilidade costumam deixar o movimento mais suave. Veja <a href="/blog/mobilidade-articular-pre-treino">mobilidade articular antes do treino</a>.</li>
<li><strong>Controle a descida.</strong> Movimento rápido e solto no fim da amplitude é onde o ombro mais reclama.</li>
<li><strong>Observe a semana.</strong> Se continuar só barulho, está tudo certo. Se começar a doer, ajuste.</li>
</ul>

<h2>Ombro estalando com dor: o que ajustar no treino</h2>
<p>Quando o estalo vem com incômodo, o primeiro passo não é parar de treinar o ombro, e sim ajustar o exercício que provoca. Uma revisão sobre lesões de ombro na musculação ligou boa parte delas a desequilíbrio entre os músculos e a pouca atenção à técnica, e não ao treino em si.</p>
<ul>
<li><strong>Supino:</strong> pegada um pouco mais fechada (uma revisão sugere até cerca de 1,5 vez a largura dos ombros), descer até onde não dói e controlar a barra. Veja <a href="/blog/como-fazer-supino-reto">como fazer o supino reto</a>.</li>
<li><strong>Desenvolvimento:</strong> pela frente da cabeça, em vez de por trás, e amplitude menor no começo. Veja <a href="/blog/como-fazer-desenvolvimento-ombros">como fazer o desenvolvimento</a>.</li>
<li><strong>Elevação lateral:</strong> carga menor, braço um pouco à frente do corpo e subida até onde não incomoda. Veja <a href="/blog/como-fazer-elevacao-lateral">como fazer a elevação lateral</a>.</li>
<li><strong>Costas e manguito:</strong> remadas e rotação externa ajudam a equilibrar o ombro. Treino de ombro não é só empurrar.</li>
</ul>
<p>Se a dor melhora com o ajuste e não piora no dia seguinte, siga assim e aumente aos poucos. Se você já tem um diagnóstico, veja também <a href="/blog/sindrome-do-impacto-no-ombro">síndrome do impacto</a>, <a href="/blog/bursite-no-ombro">bursite no ombro</a> e <a href="/blog/lesao-no-manguito-rotador">lesão no manguito rotador</a>.</p>

<h2>Ombro estalando: como resolver?</h2>
<p>Se o estalo não dói, não há o que resolver: é barulho, e você pode seguir treinando. Se dói, o caminho costuma ser este:</p>
<ol>
<li><strong>Ache o exercício e a parte do movimento que provocam.</strong> Quase sempre é um ou dois, não o treino todo.</li>
<li><strong>Ajuste esse exercício:</strong> carga menor, amplitude menor, outra pegada ou outra variação.</li>
<li><strong>Aqueça o ombro</strong> com séries leves antes das séries de trabalho.</li>
<li><strong>Fortaleça costas e manguito rotador:</strong> remadas e rotação externa equilibram o ombro.</li>
<li><strong>Observe uma ou duas semanas.</strong> Melhorou? Siga e aumente aos poucos. Não melhorou? Procure avaliação.</li>
</ol>

<h2>Ombro estalando ao levantar o braço, ao girar ou na elevação lateral</h2>
<p>Levantar o braço acima da cabeça e girar são os movimentos em que o ombro mais trabalha, e onde o barulho mais aparece. Sem dor, siga normalmente. Com dor, na elevação lateral, pare na altura do ombro, que já trabalha bem o músculo; no desenvolvimento, faça pela frente da cabeça. Se a dor aparece também no dia a dia, como para pegar algo no alto ou vestir uma blusa, vale avaliação. Para quem já tem diagnóstico de bursite, veja <a href="/blog/bursite-no-ombro">bursite no ombro</a>.</p>

<h2>Ombro estalando com dor no braço ou na escápula</h2>
<p>Dor que desce pelo braço, formigamento, fraqueza na mão ou dor na escápula que não passa com os ajustes do treino não são para resolver no treino. Esses sinais pedem um profissional de saúde, porque podem vir de outro lugar que não o ombro.</p>

<h2>Quando o estalo no ombro precisa de avaliação</h2>
<p>Procure um profissional de saúde quando o estalo vier com:</p>
<ul>
<li>dor forte, ou dor que piora de uma semana para outra;</li>
<li>perda de força para levantar o braço;</li>
<li>sensação de que o ombro sai do lugar, ou travamento;</li>
<li>inchaço, ou começo depois de uma queda ou pancada;</li>
<li>dor à noite que acorda você.</li>
</ul>
<p>Nenhum artigo e nenhum teste online conseguem dizer a causa de uma dor. O que dá para fazer aqui é separar o que é comum do que pede alguém olhando de perto. Para o caso de dor no ombro durante o treino, veja <a href="/blog/dor-no-ombro-ao-treinar">dor no ombro ao treinar</a>. E remédio é decisão do médico: o uso frequente de anti-inflamatório pode atrapalhar o ganho de músculo, como explica <a href="/blog/anti-inflamatorio-atrapalha-hipertrofia">anti-inflamatório atrapalha a hipertrofia?</a>.</p>

<h2>E a mobilidade do ombro?</h2>
<p>Um ombro que não sobe bem acima da cabeça faz o resto do corpo compensar, principalmente a lombar, nos exercícios por cima da cabeça. Não é uma causa de estalo, mas é uma informação útil para montar o treino. O teste de mobilidade do site tem um teste de ombro na parede que leva um minuto. No joelho, o raciocínio é parecido: veja <a href="/blog/joelho-estalando-e-normal">joelho estalando é normal?</a>.</p>

${NAO_SE_COMPARE}

<h2>Fontes</h2>
<ul>
<li><a href="https://doi.org/10.1016/j.ptsp.2018.06.002" target="_blank" rel="noopener noreferrer">de Oliveira Silva D. et al. Knee crepitus is prevalent in women with patellofemoral pain, but is not related with function, physical activity and pain. Physical Therapy in Sport, 2018</a> (PMID 29890402)</li>
<li><a href="https://pubmed.ncbi.nlm.nih.gov/41308021/" target="_blank" rel="noopener noreferrer">Rotator Cuff Imaging Abnormalities in Asymptomatic Shoulders: A Systematic Review. Journal of Orthopaedic &amp; Sports Physical Therapy, 2025</a></li>
<li><a href="https://doi.org/10.1519/JSC.0b013e3181dc4330" target="_blank" rel="noopener noreferrer">Kolber M. J. et al. Shoulder injuries attributed to resistance training: a brief review. Journal of Strength and Conditioning Research, 2010</a> (PMID 20508476)</li>
<li><a href="https://doi.org/10.1519/00126548-200710000-00001" target="_blank" rel="noopener noreferrer">Green C. M., Comfort P. The affect of grip width on bench press performance and risk of injury. Strength and Conditioning Journal, 2007</a></li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/dor-no-ombro-ao-treinar">Dor no ombro ao treinar</a></li>
<li><a href="/blog/treinar-com-dor">Treinar com dor: quando pode e quando parar</a></li>
<li><a href="/blog/joelho-estalando-e-normal">Joelho estalando é normal?</a></li>
<li><a href="/blog/treino-de-ombros-hipertrofia">Treino de ombros para hipertrofia</a></li>
</ul>`,
  },
  {
    slug: "anti-inflamatorio-atrapalha-hipertrofia",
    title: "Anti-inflamatório Atrapalha a Hipertrofia? Veja a Ciência",
    metaTitle: "Anti-inflamatório Atrapalha a Hipertrofia? Veja a Ciência",
    metaDescription:
      "Anti-inflamatório atrapalha a hipertrofia? Em dose alta e uso frequente, estudos mostram ganho menor. Veja o que se sabe e se pode tomar antes de treinar.",
    excerpt:
      "O que os estudos mostram sobre anti-inflamatório e ganho de músculo, por que tomar remédio antes do treino para não sentir dor é má ideia e o que fazer em vez disso.",
    category: "Treinamento",
    date: "2026-11-04",
    readTime: "5 min",
    author: "Montinho",
    tags: ["anti-inflamatório", "hipertrofia", "ibuprofeno", "dor no treino", "recuperação"],
    faq: [
      { question: "Qual anti-inflamatório não atrapalha a hipertrofia?", answer: "Não existe um anti-inflamatório recomendado para quem treina. Os estudos que mostraram ganho menor de músculo foram com uso frequente e dose alta; um uso pontual, por indicação médica, é outra situação. Qual remédio, dose e tempo de uso é decisão do médico." },
      { question: "Pode tomar anti-inflamatório quem treina?", answer: "Pode, quando o médico indica, pelo tempo que ele indicar. O que não é boa ideia é usar o remédio como rotina do treino ou para treinar sem sentir dor." },
      { question: "Diclofenaco, nimesulida e ibuprofeno atrapalham a hipertrofia?", answer: "Os três são anti-inflamatórios do mesmo grupo (anti-inflamatórios não esteroides), que agem na enzima COX. É sobre esse grupo que os estudos mostraram ganho menor de músculo com uso frequente em dose alta." },
      { question: "Paracetamol e dipirona atrapalham a hipertrofia?", answer: "São analgésicos, não anti-inflamatórios no uso comum. A revisão de 2018 cita que o paracetamol também age na COX, mas ainda não está claro se isso muda o resultado de quem treina. Sobre dipirona e hipertrofia, não achamos estudo." },
      { question: "Dorflex e Torsilax atrapalham a hipertrofia?", answer: "Depende do que tem dentro. Pela bula, o Dorflex tem dipirona, orfenadrina e cafeína, sem anti-inflamatório. O Torsilax tem diclofenaco, que é anti-inflamatório, além de carisoprodol, paracetamol e cafeína. Os dois são para uso indicado por médico, não para tomar antes do treino." },
      {
        question: "Anti-inflamatório atrapalha a hipertrofia?",
        answer:
          "Em dose alta e uso frequente, os estudos indicam que sim. Uma revisão de 2018 relatou que anti-inflamatórios interferiram no ganho de músculo e de força em jovens que faziam musculação, e um estudo do mesmo ano mostrou isso com doses altas. Um comprimido ocasional, por indicação médica, é outra situação.",
      },
      {
        question: "Posso tomar anti-inflamatório antes do treino para não sentir dor?",
        answer:
          "Não é uma boa ideia. A dor é a informação que diz se a carga ou o exercício estão passando do ponto. Tirar essa informação para treinar igual aumenta a chance de piorar o problema, e o uso frequente ainda pode atrapalhar o ganho de músculo.",
      },
      {
        question: "Ibuprofeno atrapalha o ganho de massa muscular?",
        answer:
          "O ibuprofeno é um anti-inflamatório, então vale o mesmo: o uso frequente em dose alta é o que os estudos ligam a ganho menor de músculo em jovens. Quem decide dose e tempo de uso é o médico.",
      },
      {
        question: "Analgésico comum também atrapalha?",
        answer:
          "A revisão de 2018 cita que tanto os anti-inflamatórios quanto o paracetamol agem numa enzima ligada à resposta do músculo ao treino. Ainda não está claro o quanto isso pesa no resultado de quem treina. O mais seguro é não usar remédio como rotina do treino.",
      },
      {
        question: "Tomei anti-inflamatório por indicação médica. Posso treinar?",
        answer:
          "Siga a orientação de quem prescreveu. Se o médico liberou o treino, avise quem monta o seu treino para ajustar carga e exercícios enquanto a dor não passa. Uma semana de remédio não desfaz meses de treino.",
      },
      {
        question: "O que fazer com a dor muscular depois do treino em vez de remédio?",
        answer:
          "A dor muscular do dia seguinte costuma passar sozinha em poucos dias. Movimento leve, sono e a progressão de carga gradual ajudam mais do que o remédio. Se a dor é na articulação, e não no músculo, ajuste o exercício e avise quem acompanha você.",
      },
    ],
    content: `<img src="/blog-images/anti-inflamatorio-atrapalha-hipertrofia-capa.webp" alt="Capa: Anti-inflamatório atrapalha a hipertrofia? Ilustração de cartela de comprimidos e halter" title="Anti-inflamatório e Hipertrofia — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Anti-inflamatório atrapalha a hipertrofia?</strong> Em dose alta e uso frequente, os estudos indicam que pode atrapalhar. Um comprimido ocasional, indicado por um médico para uma dor específica, é outra conversa. O problema mais comum na academia é outro: tomar remédio antes do treino para não sentir dor e treinar igual.</p>
<p><em>Este artigo fala do efeito no treino. Ele não substitui a orientação de quem prescreve remédio: dose e tempo de uso são decisão do médico.</em></p>

<h2>Anti-inflamatório atrapalha a hipertrofia?</h2>
<p>Uma revisão de 2018, publicada no Scandinavian Journal of Medicine &amp; Science in Sports, reuniu o que se sabe sobre analgésicos, anti-inflamatórios e treino. Ela relata que os anti-inflamatórios <strong>interferiram no ganho de músculo e de força em jovens</strong> que faziam musculação por semanas. No mesmo ano, um estudo na Acta Physiologica mostrou isso com <strong>doses altas</strong> de anti-inflamatório em adultos jovens.</p>
<p>A explicação está numa enzima que o remédio bloqueia (a COX). Ela participa da inflamação, e também da resposta do músculo ao treino. Bloquear sempre essa resposta pode diminuir o que o treino constrói.</p>
<p>Os próprios autores da revisão fazem a ressalva: ainda não está claro o quanto isso se traduz em resultado menor para atletas, e a recomendação deles é pesar risco e benefício com orientação profissional.</p>

<h2>Posso tomar anti-inflamatório antes do treino?</h2>
<p>Para "não sentir dor e conseguir treinar", não é uma boa ideia. A dor no treino é informação: ela diz se a carga, a amplitude ou o exercício estão passando do que a articulação aguenta hoje. Tirar essa informação para fazer o mesmo treino é como desligar o alarme e continuar dirigindo.</p>
<p>Além disso, usar o remédio como rotina do treino é justamente o cenário de uso frequente que os estudos ligam a ganho menor de músculo.</p>

<h2>E o analgésico comum, como o paracetamol?</h2>
<p>A revisão de 2018 cita que o paracetamol também age sobre a mesma enzima, o que poderia explicar uma resposta menor do músculo ao treino agudo. O quanto isso pesa no resultado de meses ainda não está claro. Na prática, vale a mesma regra: remédio para dor é para quando o médico indica, não para fazer parte do treino.</p>

<h2>Diclofenaco, nimesulida, ibuprofeno, paracetamol, dipirona: qual atrapalha?</h2>
<p>A pergunta "qual anti-inflamatório não atrapalha a hipertrofia" não tem uma resposta de prateleira, e não cabe a um site de treino escolher remédio. O que dá para explicar é em que grupo cada um está:</p>
<table>
<thead><tr><th>Remédio</th><th>Grupo</th><th>O que se sabe sobre ganho de músculo</th></tr></thead>
<tbody>
<tr><td>Ibuprofeno, diclofenaco, nimesulida</td><td>Anti-inflamatórios não esteroides</td><td>É sobre esse grupo que os estudos mostraram ganho menor com uso frequente em dose alta</td></tr>
<tr><td>Paracetamol</td><td>Analgésico</td><td>A revisão de 2018 cita efeito na mesma enzima; não está claro se muda o resultado</td></tr>
<tr><td>Dipirona</td><td>Analgésico</td><td>Não achamos estudo sobre dipirona e hipertrofia</td></tr>
<tr><td>Dorflex</td><td>Dipirona, orfenadrina e cafeína (pela bula)</td><td>Não tem anti-inflamatório na fórmula</td></tr>
<tr><td>Torsilax</td><td>Diclofenaco, carisoprodol, paracetamol e cafeína (pela bula)</td><td>Tem anti-inflamatório (diclofenaco) na fórmula</td></tr>
</tbody>
</table>
<p>Todos são remédios para usar quando o médico indica, pelo tempo que ele indica. Nenhum deles é "o certo" para tomar antes do treino.</p>

<h2>O que fazer em vez de tomar remédio para treinar</h2>
<ul>
<li><strong>Separe dor no músculo de dor na articulação.</strong> A dor muscular do dia seguinte é comum e passa sozinha; veja <a href="/blog/dor-muscular-tardia-doms">dor muscular tardia</a>. Dor na articulação durante o exercício pede ajuste.</li>
<li><strong>Ajuste o exercício que dói.</strong> Amplitude menor, carga menor ou outro exercício para o mesmo músculo. Veja <a href="/blog/treinar-com-dor">treinar com dor: quando pode e quando parar</a>.</li>
<li><strong>Durma e coma o suficiente.</strong> Sono e proteína fazem mais pela recuperação do que qualquer comprimido. Veja <a href="/blog/sono-e-crescimento-muscular">sono e crescimento muscular</a>.</li>
<li><strong>Progrida a carga aos poucos.</strong> A maior parte das dores de treino vem de subir carga ou volume rápido demais.</li>
<li><strong>Avise quem acompanha você.</strong> Uma dor que se repete todo treino é sinal de que o plano precisa mudar.</li>
</ul>

<h2>Quando procurar um profissional de saúde</h2>
<p>Dor forte, dor que não melhora em alguns dias, inchaço, perda de força ou dor depois de um trauma pedem avaliação. Nesses casos, quem decide se você precisa de remédio, de quanto e por quanto tempo é o médico. Se ele liberar o treino, o treino se ajusta à dor, e não o contrário.</p>

${NAO_SE_COMPARE}

<h2>Fontes</h2>
<ul>
<li><a href="https://doi.org/10.1111/sms.13275" target="_blank" rel="noopener noreferrer">Lundberg T. R., Howatson G. Analgesic and anti-inflammatory drugs in sports: implications for exercise performance and training adaptations. Scandinavian Journal of Medicine &amp; Science in Sports, 2018</a> (PMID 30102811)</li>
<li><a href="https://www.saudedireta.com.br/catinc/drugs/bulas/dorflex.pdf" target="_blank" rel="noopener noreferrer">Bula do Dorflex</a> e <a href="https://www.drogariasaopaulo.com.br/arquivos/127612---torsilax-neo-quimica-30-comprimidos.pdf" target="_blank" rel="noopener noreferrer">bula do Torsilax</a> (composição)</li>
<li>Lilja M. et al. High doses of anti-inflammatory drugs compromise muscle strength and hypertrophic adaptations to resistance training in young adults. Acta Physiologica, 2018</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/treinar-com-dor">Treinar com dor: quando pode e quando parar</a></li>
<li><a href="/blog/dor-muscular-tardia-doms">Dor muscular tardia (DOMS)</a></li>
<li><a href="/blog/alimentos-anti-inflamatorios-treino">Alimentos anti-inflamatórios e treino</a></li>
<li><a href="/blog/cicatrizacao-lesao-muscular-reabilitacao-ativa">Lesão muscular e reabilitação ativa</a></li>
</ul>`,
  },
  {
    slug: "treinar-com-dor",
    title: "Treinar Com Dor: Quando Pode e Quando Parar",
    metaTitle: "Treinar Com Dor: Quando Pode e Quando Parar",
    metaDescription:
      "Pode treinar com dor? Depende de onde dói e de como a dor se comporta. Veja a diferença entre dor muscular e na articulação e quando parar o exercício.",
    excerpt:
      "Dor muscular, dor na articulação e dor que pede avaliação: como diferenciar, quando dá para treinar com um pouco de dor e o que ajustar no exercício.",
    category: "Treinamento",
    date: "2026-11-04",
    readTime: "7 min",
    author: "Montinho",
    tags: ["treinar com dor", "dor muscular", "dor na articulação", "lesão", "musculação"],
    faq: [
      { question: "Pode treinar o mesmo músculo dolorido?", answer: "Pode, se a dor for a muscular do dia seguinte e leve a moderada. Treine esse músculo mais leve ou com menos séries, ou treine outro grupo e deixe ele para o próximo treino. Se a dor muda o jeito de fazer o movimento, espere mais um dia." },
      { question: "Comecei a malhar e estou com muita dor. O que fazer?", answer: "É comum nas primeiras semanas: o corpo ainda não está acostumado. Não pare, mas diminua o volume (menos séries), mantenha o movimento leve nos dias seguintes e aumente aos poucos. Dor muscular desproporcional, inchaço forte, fraqueza ou urina escura depois do treino pedem atendimento médico no mesmo dia." },
      { question: "Malhei perna e não consigo andar: o que fazer?", answer: "Costuma ser a dor muscular do dia seguinte, depois de um treino de perna novo ou mais pesado. Caminhar devagar e fazer movimento leve ajudam mais do que ficar parado. Se a dor for desproporcional, com inchaço forte, fraqueza ou urina escura, procure atendimento médico." },
      { question: "Malhei perna e não consigo andar: posso tomar remédio?", answer: "Quem decide remédio é o médico. Para a dor muscular comum, movimento leve, sono e tempo costumam resolver; o uso frequente de anti-inflamatório pode atrapalhar o ganho de músculo. Veja o artigo sobre anti-inflamatório e hipertrofia." },
      { question: "Posso treinar com dor no joelho?", answer: "Muitas vezes, sim, com ajustes: amplitude menor, carga menor ou outro exercício para a perna. Fortalecer coxas e quadril é uma das coisas que mais ajudam o joelho com dor. Dor forte, inchaço, travamento ou falseio pedem avaliação antes." },
      { question: "Dor pós-treino é sinal de resultado?", answer: "Não necessariamente. Uma revisão de 2013 mostrou que a dor muscular do dia seguinte não é um bom indicador de que o músculo vai crescer. Dá para evoluir sem sentir dor todo treino; o que conta é a progressão de carga e a constância." },
      {
        question: "Pode treinar com dor?",
        answer:
          "Depende. Dor muscular do dia seguinte e um incômodo leve, que não piora durante o treino nem no dia seguinte, costumam permitir treinar com ajustes. Dor forte, que piora, que vem com inchaço, perda de força ou depois de um trauma, pede parar o exercício e procurar avaliação.",
      },
      {
        question: "Posso treinar com dor muscular?",
        answer:
          "Pode. A dor muscular do dia seguinte é comum depois de treino novo ou mais pesado, e ficar totalmente parado não ajuda a passar. Treinar o mesmo músculo mais leve, ou outro grupo muscular, costuma funcionar.",
      },
      {
        question: "Como saber se é dor muscular ou lesão?",
        answer:
          "A dor muscular costuma ser difusa, no músculo todo, aparecer um ou dois dias depois e melhorar com movimento leve. Sinais de lesão: dor pontual e aguda na hora do exercício, inchaço, roxo, perda de força ou dor na articulação que piora com o movimento. Nesses casos, procure avaliação.",
      },
      {
        question: "Dor no músculo e dor na articulação são a mesma coisa?",
        answer:
          "Não. A dor no músculo que trabalhou é esperada. A dor dentro da articulação, como joelho, ombro ou lombar, durante o exercício, é o sinal para ajustar a carga, a amplitude ou o exercício, e para avisar quem acompanha você.",
      },
      {
        question: "Se um exercício doeu, preciso trocar para sempre?",
        answer:
          "Não. Muitas vezes basta reduzir a carga ou a amplitude por um tempo e voltar aos poucos. Trocar por outro exercício para o mesmo músculo também é uma opção enquanto a dor melhora.",
      },
      {
        question: "Dá para treinar com um pouco de dor sem piorar?",
        answer:
          "Em dores crônicas, sim. Uma meta-análise de 2017 mostrou que exercício com alguma dor deu um pequeno benefício na dor a curto prazo, sem diferença a médio e longo prazo. A regra prática: a dor fica leve, não piora durante o treino e volta ao normal até o dia seguinte.",
      },
      {
        question: "Devo ficar parado quando estou dolorido?",
        answer:
          "Na dor muscular comum, não precisa. Movimento leve costuma ajudar mais do que repouso total. Já dor forte na articulação, ou dor depois de um trauma, pede parar o exercício que dói e procurar avaliação.",
      },
    ],
    content: `<img src="/blog-images/treinar-com-dor-capa.webp" alt="Capa: Treinar com dor, quando pode e quando parar. Ilustração de semáforo e halter" title="Treinar Com Dor — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Pode treinar com dor?</strong> Depende de onde dói e de como a dor se comporta. A dor no músculo do dia seguinte é comum e quase nunca pede parar. A dor dentro da articulação durante o exercício pede ajuste. E alguns sinais pedem parar e procurar avaliação. O segredo é saber separar uma coisa da outra.</p>
<p><em>Este artigo não faz diagnóstico. Ele ajuda a decidir o que fazer no treino e quando a dor precisa de alguém olhando de perto.</em></p>

<h2>Pode treinar com dor?</h2>
<p><strong>Pode, com ajustes, quando a dor é leve e se comporta bem.</strong> Uma meta-análise de 2017, publicada no British Journal of Sports Medicine, comparou exercício com alguma dor e exercício sem dor em pessoas com dor crônica nos músculos e articulações. O grupo que treinou com um pouco de dor teve um benefício pequeno na dor a curto prazo, e a médio e longo prazo não houve diferença. Os autores concluíram que sentir um pouco de dor no exercício não precisa ser uma barreira.</p>
<p>Isso não quer dizer "ignore a dor". Quer dizer que dor leve, acompanhada de perto, não é motivo automático para parar tudo.</p>

<h2>Pode malhar com os músculos doendo?</h2>
<p>Pode, se for a dor muscular do dia seguinte e ela estiver leve a moderada. Duas saídas funcionam: treinar o mesmo músculo mais leve, com menos séries, ou treinar outro grupo e deixar o dolorido para o próximo treino. Movimento leve ajuda mais do que ficar parado. Só espere mais um dia se a dor mudar o jeito de fazer o exercício.</p>
<p>E dor não é medida de resultado: uma revisão de 2013 mostrou que a dor do dia seguinte não indica, sozinha, que o músculo vai crescer. Dá para evoluir sem sentir dor todo treino. Mais sobre isso em <a href="/blog/dor-muscular-tardia-doms">dor muscular tardia</a>.</p>

<h2>Comecei a malhar e estou com muita dor: o que fazer?</h2>
<p>Nas primeiras semanas de academia, ou depois de um treino de perna novo, é comum sair dolorido a ponto de estranhar escada. Não é motivo para desistir:</p>
<ul>
<li><strong>Não pare.</strong> Caminhar e se movimentar leve nos dias seguintes ajuda a dor a passar.</li>
<li><strong>Diminua o volume.</strong> Menos séries nas primeiras semanas, e aumente aos poucos.</li>
<li><strong>Mantenha a carga que você controla.</strong> A pressa em subir peso é o que mais dói depois.</li>
</ul>
<p><strong>Atenção a um caso raro e sério:</strong> dor muscular desproporcional ao treino, com inchaço forte, fraqueza ou urina escura (cor de chá ou de refrigerante de cola) pode ser rabdomiólise, uma lesão muscular que afeta os rins. Nesse caso, procure atendimento médico no mesmo dia, sem treinar.</p>

<h2>Dor muscular, dor na articulação ou sinal de alerta?</h2>
<table>
<thead><tr><th>Tipo</th><th>Como costuma ser</th><th>O que fazer</th></tr></thead>
<tbody>
<tr><td><strong>Dor muscular do dia seguinte</strong></td><td>Difusa, no músculo que trabalhou, aparece um ou dois dias depois e melhora com movimento</td><td>Treinar normalmente outro músculo, ou o mesmo mais leve</td></tr>
<tr><td><strong>Incômodo leve na articulação</strong></td><td>Aparece num exercício, é leve e não piora durante o treino</td><td>Ajustar carga, amplitude ou exercício e observar o dia seguinte</td></tr>
<tr><td><strong>Sinal de alerta</strong></td><td>Dor forte, pontual, que piora, com inchaço, roxo, perda de força, travamento ou depois de um trauma</td><td>Parar o exercício e procurar um profissional de saúde</td></tr>
</tbody>
</table>
<p>A dor muscular do dia seguinte tem artigo próprio: veja <a href="/blog/dor-muscular-tardia-doms">dor muscular tardia</a>.</p>

<h2>A regra prática do "dá para treinar"</h2>
<p>Quando a dor é leve, três perguntas ajudam a decidir:</p>
<ol>
<li><strong>Durante o exercício, a dor fica leve?</strong> Um incômodo que você nota, mas que não muda o jeito de fazer o movimento.</li>
<li><strong>Ela não piora ao longo das séries?</strong> Se começa leve e vai subindo, pare aquele exercício.</li>
<li><strong>No dia seguinte, está igual ou melhor?</strong> Se piorou, o ajuste não foi suficiente.</li>
</ol>
<p>Três "sim": dá para seguir com o ajuste e aumentar aos poucos. Um "não": volte um passo na carga ou na amplitude, ou troque o exercício por um tempo.</p>

<h2>O que ajustar no exercício que dói</h2>
<ul>
<li><strong>Amplitude:</strong> descer só até onde não dói, e ir aumentando conforme melhora.</li>
<li><strong>Carga:</strong> menos peso, com mais controle.</li>
<li><strong>Exercício:</strong> outro movimento para o mesmo músculo. O <a href="/ferramentas/substituidor-de-exercicios">Substituidor de Exercícios</a> mostra alternativas para cada exercício.</li>
<li><strong>Velocidade:</strong> descida mais lenta costuma ser mais bem tolerada.</li>
<li><strong>Aquecimento:</strong> séries leves do próprio exercício antes das séries de trabalho.</li>
</ul>
<p>Se um exercício doeu, não precisa trocar para sempre. Muitas vezes, depois de algumas semanas com carga e amplitude ajustadas, ele volta ao treino normal.</p>

<h2>Dor no joelho, no ombro e na lombar</h2>
<p>Cada articulação tem os seus ajustes mais comuns:</p>
<ul>
<li><strong>Joelho:</strong> dá para treinar com ajustes; fortalecer coxas e quadril é uma das coisas que mais ajudam. Veja <a href="/blog/dor-no-joelho-no-agachamento">dor no joelho no agachamento</a> e <a href="/blog/condromalacia-patelar-musculacao">condromalácia patelar e musculação</a>.</li>
<li><strong>Ombro:</strong> veja <a href="/blog/dor-no-ombro-ao-treinar">dor no ombro ao treinar</a> e <a href="/blog/ombro-estalando-e-normal">ombro estalando é normal?</a>.</li>
<li><strong>Lombar:</strong> veja <a href="/blog/dor-lombar-na-musculacao">dor lombar na musculação</a>, <a href="/blog/travou-a-lombar-o-que-fazer">travou a lombar, o que fazer</a> e <a href="/blog/hernia-de-disco-pode-treinar">quem tem hérnia de disco pode treinar?</a>.</li>
</ul>

<h2>Remédio para treinar sem dor?</h2>
<p>Tomar analgésico ou anti-inflamatório antes do treino para não sentir dor tira justamente a informação que diz se o exercício está passando do ponto. E o uso frequente pode atrapalhar o ganho de músculo. Veja <a href="/blog/anti-inflamatorio-atrapalha-hipertrofia">anti-inflamatório atrapalha a hipertrofia?</a>.</p>

<h2>Quando parar e procurar avaliação</h2>
<ul>
<li>dor forte, ou que aparece de repente no meio de uma série;</li>
<li>dor que piora de um treino para o outro;</li>
<li>inchaço, roxo ou articulação que trava ou falseia;</li>
<li>perda de força ou formigamento;</li>
<li>dor depois de uma queda, torção ou pancada.</li>
</ul>
<p>Nesses casos, pare o exercício que dói e procure um profissional de saúde. Ele diz o que pode e o que não pode; o treino se ajusta a isso.</p>

${NAO_SE_COMPARE}

<h2>Fontes</h2>
<ul>
<li><a href="https://doi.org/10.1519/SSC.0b013e3182a61820" target="_blank" rel="noopener noreferrer">Schoenfeld B. J., Contreras B. Is postexercise muscle soreness a valid indicator of muscular adaptations? Strength and Conditioning Journal, 2013</a></li>
<li><a href="https://health.stonybrookmedicine.edu/understanding-the-early-signs-of-rhabdomyolysis/" target="_blank" rel="noopener noreferrer">Stony Brook Medicine — sinais de rabdomiólise</a></li>
<li><a href="https://doi.org/10.1136/bjsports-2016-097383" target="_blank" rel="noopener noreferrer">Smith B. E. et al. Should exercises be painful in the management of chronic musculoskeletal pain? A systematic review and meta-analysis. British Journal of Sports Medicine, 2017</a> (PMID 28596288)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/dor-muscular-tardia-doms">Dor muscular tardia (DOMS)</a></li>
<li><a href="/blog/anti-inflamatorio-atrapalha-hipertrofia">Anti-inflamatório atrapalha a hipertrofia?</a></li>
<li><a href="/blog/ombro-estalando-e-normal">Ombro estalando é normal?</a></li>
<li><a href="/blog/dor-no-joelho-no-agachamento">Dor no joelho no agachamento</a></li>
</ul>`,
  },
];
