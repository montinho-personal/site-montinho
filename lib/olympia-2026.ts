import type { BlogPost } from "./blog";
import { ATLETAS_BRASIL, DIA_TEXTO, FORA_DO_EVENTO, categoria } from "./olympia-brasil";

/**
 * Cluster Mr. Olympia 2026 — conteúdo de notícia, num arquivo próprio.
 *
 * POR QUE FORA DO lib/blog.ts
 *
 * Estes seis artigos mudam de estado três vezes em 48 horas (antes → depois
 * das prévias → resultado oficial), e cada mudança é um commit. Editar um
 * arquivo de 117 mil linhas para trocar "A definir" por um nome é lento e
 * arriscado. Aqui, cada artigo cabe numa tela.
 *
 * A REGRA QUE NÃO SE QUEBRA
 *
 * Nada de resultado, colocação, horário, peso ou atleta que não tenha vindo
 * de fonte primária (Olympia/IFBB Pro League) ou de dois veículos
 * confiáveis. Enquanto a competição não acontece, a tabela diz "A definir"
 * e o primeiro parágrafo diz que o resultado ainda não saiu. Quando sair, a
 * MESMA URL é atualizada — nunca uma página nova.
 *
 * ESTADOS (trocar ESTADO_* e o texto do topo, e só então o updatedAt):
 *   1 — antes: "ainda não foi definido"
 *   2 — depois das prévias: atletas chamados, sem declarar vencedor
 *   3 — resultado oficial: vencedor no primeiro parágrafo, tabela, title
 *
 * HORÁRIOS (confirmados em 25/09 na programação oficial e em CNN/O Povo):
 *   Sexta 25/09 — prévias 9h30 Las Vegas = 13h30 Brasília (212, Classic,
 *   Figure, Women's Physique, Ms. Olympia, Wellness); finais 18h = 22h
 *   (Figure, Women's Physique, Wellness, 212, Ms. Olympia, Classic), com as
 *   prévias do Open na mesma sessão.
 *   Sábado 26/09 — prévias 9h30 = 13h30 (Men's Physique, Fitness, Bikini,
 *   Wheelchair, Fit Model); finais 19h = 23h (Fitness, Men's Physique,
 *   Bikini, Mr. Olympia Open).
 */

const AUTOR = "Montinho Personal Trainer";
const DATA = "2026-09-24";

const AVISO_ANTES = (o: string) =>
  `<blockquote><p><strong>${o}</strong> Esta página será atualizada assim que houver resultado oficial. Última verificação: 24 de setembro de 2026, 22h (Brasília).</p></blockquote>`;

const FONTES = `<h2>Fontes</h2>
<ul>
<li><a href="https://www.olympiaproductions.com/" target="_blank" rel="noopener noreferrer">Olympia Productions — site oficial e programação</a></li>
<li><a href="https://www.ifbbpro.com/" target="_blank" rel="noopener noreferrer">IFBB Professional League</a></li>
<li>Veículos consultados para pesagem, escalações e horários no Brasil: CNN Brasil, O Povo, NSC Total, Gazeta Esportiva, Lance!</li>
</ul>`;

const CTA_WELLNESS = `<h2>E o seu treino?</h2>
<p>O desenvolvimento de glúteos e coxas que a Wellness premia não é exclusividade de quem compete: vem de volume bem distribuído por semana, carga que progride e paciência. Se você quer um treino montado para o seu objetivo e a sua rotina, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>`;

const CTA_FASES = `<h2>Do palco para a sua rotina</h2>
<p>Ramon não chega ao limite de peso por acaso: são anos de fases planejadas, ganho de massa e definição em blocos. O mesmo raciocínio serve para quem nunca vai competir. Se você quer organizar a sua próxima fase com método, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>`;

const CTA_MONTINHO = `<h2>E o seu shape?</h2>
<p>Ninguém precisa de palco para querer um corpo melhor. O que os atletas do Olympia mostram, em escala extrema, é o que funciona para qualquer pessoa: treino individualizado, progressão de carga, alimentação que cabe na rotina e constância por anos. Se você quer aplicar isso à sua vida, sem comparação com ninguém, eu monto o seu plano: <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo no WhatsApp pelo botão ao fim desta página.</p>`;

/** Segunda onda (212, Women's Physique, Brasil, Men's Physique, Bikini): verificada depois das outras seis. */
const AVISO_ONDA2 = (o: string) =>
  `<blockquote><p><strong>${o}</strong> Esta página será atualizada assim que houver resultado oficial. Última verificação: 24 de setembro de 2026, 23h (Brasília).</p></blockquote>`;

const CTA_MASSA = `<h2>Do palco para o seu treino</h2>
<p>Ninguém chega a quase 96 kg de palco em uma temporada: são anos de fases de ganho de massa bem conduzidas. Para quem treina sem competir, a lógica é a mesma, em escala real. Quer ver quanto músculo dá para ganhar em alguns meses? Use o <a href="/ferramentas/simulador-ganho-massa-muscular">simulador de ganho de massa muscular</a>. Se quiser um plano feito para o seu corpo e a sua rotina, sem se comparar com ninguém, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>`;

/** Tabela do hub Brasil, gerada de lib/olympia-brasil.ts (HTML estático, indexável). */
const TABELA_BRASIL = `<table><thead><tr><th>Atleta</th><th>Categoria</th><th>Representação oficial</th><th>Dia</th><th>Status</th><th>Resultado</th></tr></thead><tbody>${ATLETAS_BRASIL.map((x) => `<tr><td>${x.nome}</td><td>${categoria(x.categoria).nome}</td><td>${x.representacao}</td><td>${DIA_TEXTO[categoria(x.categoria).dia]}</td><td>${categoria(x.categoria).resultadoOficial ? "Finalizado" : categoria(x.categoria).previasConcluidas ? "Aguardando final" : "Programado"}</td><td>${x.resultado ?? "A definir"}</td></tr>`).join("")}</tbody></table>`;

const CTA_MASSA_PHYSIQUE = `<h2>Do palco para o seu treino</h2>
<p>Ombros largos e cintura fina não são sorte: são anos de treino bem distribuído, ganho de massa em fases e definição. Quer ter uma noção de quanto músculo dá para ganhar em alguns meses, no seu caso? Use o <a href="/ferramentas/simulador-ganho-massa-muscular">simulador de ganho de massa muscular</a>. Se preferir um plano feito para o seu corpo e a sua rotina, sem se comparar com ninguém, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>`;

const CTA_ROTINA = `<h2>E o seu shape?</h2>
<p>Quer trabalhar o seu próprio shape sem se comparar a uma atleta profissional? Cada corpo tem a própria genética, rotina e história. O que funciona é um treino que caiba na sua semana e que você consiga manter por anos. Monte o seu em <a href="/treino-para-minha-rotina">treino para a minha rotina</a>. Se preferir acompanhamento, fale comigo pelo WhatsApp no fim da página.</p>`;

/** Capa 1800×1013 (16:9) depois do primeiro parágrafo: a resposta vem antes da imagem no celular, e o Discover pega a primeira imagem raster do conteúdo. */
const CAPA = (slug: string, alt: string) =>
  `<img src="/blog-images/${slug}-capa.webp" alt="${alt}" width="1800" height="1013" loading="eager" style="width:100%;height:auto;border-radius:12px;margin:1.5rem 0;" />`;

/**
 * "Acompanhe o Mr. Olympia 2026": navegação discreta do cluster, antes do CTA.
 * Lista as outras cinco páginas (a atual fica de fora) com anchor descritivo.
 */
const LINKS_CLUSTER: [string, string][] = [
  ["quem-ganhou-mr-olympia-2026", "Quem ganhou o Mr. Olympia 2026: todos os campeões"],
  ["resultado-classic-physique-mr-olympia-2026", "Resultado da Classic Physique, com Ramon Dino"],
  ["por-que-ramon-dino-perdeu-mr-olympia-2026", "Por que Ramon Dino perdeu e qual a polêmica"],
  ["ramon-dino-mr-olympia-2026-horario", "Que horas Ramon Dino compete e onde assistir"],
  ["resultado-wellness-mr-olympia-2026", "Resultado da Wellness e as brasileiras"],
  ["resultado-mr-olympia-open-2026", "Resultado do Open: campeão e top 10"],
  ["ramon-dino-peso-altura", "Quanto pesa Ramon Dino e o limite da Classic"],
  ["resultado-212-mr-olympia-2026", "Resultado da 212, com Lucas Garcia"],
  ["resultado-womens-physique-olympia-2026", "Resultado da Women's Physique, com Natália Coelho"],
  ["brasileiros-mr-olympia-2026", "Brasileiros no Mr. Olympia 2026: painel e resultados"],
  ["resultado-mens-physique-olympia-2026", "Resultado da Men's Physique, com Edvan Palmeira"],
  ["resultado-bikini-olympia-2026", "Resultado da Bikini, com Elisa Pecini"],
  ["resultado-fit-model-olympia-2026", "Resultado da Fit Model, com Gabriela Queiroz"],
];
const ACOMPANHE = (atual: string) =>
  `<h3>Acompanhe o Mr. Olympia 2026</h3>
<ul>${LINKS_CLUSTER.filter(([s]) => s !== atual).map(([s, t]) => `<li><a href="/blog/${s}">${t}</a></li>`).join("")}</ul>`;

const TABELA_PENDENTE = (n: number) =>
  `<table><thead><tr><th>Posição</th><th>Atleta</th><th>País</th></tr></thead><tbody>${Array.from({ length: n }, (_, i) => `<tr><td>${i + 1}º</td><td>A definir</td><td>—</td></tr>`).join("")}</tbody></table>`;

export const OLYMPIA_2026_POSTS: BlogPost[] = [
  /* ───────────────── 1. RESULTADO CLASSIC PHYSIQUE ───────────────── */
  {
    slug: "resultado-classic-physique-mr-olympia-2026",
    title: "Resultado Classic Physique Mr. Olympia 2026: Niall Darwen campeão, Ramon Dino em 3º",
    metaTitle: "Classic Physique Olympia 2026: Niall Darwen Campeão, Ramon 3º",
    metaDescription:
      "Niall Darwen (Reino Unido) é o campeão da Classic Physique do Mr. Olympia 2026. Mike Sommerfeld ficou em 2º e Ramon Dino, que defendia o título, em 3º.",
    excerpt:
      "Niall Darwen venceu a Classic Physique do Mr. Olympia 2026, na sexta, 25 de setembro, em Las Vegas. Ramon Dino perdeu o título e terminou em 3º.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-30",
    readTime: "4 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Classic Physique", "Ramon Dino", "resultado", "fisiculturismo"],
    content: `<blockquote><p><strong>Resultado definido: Niall Darwen (Reino Unido) é o campeão da Classic Physique 2026.</strong> Ramon Dino, campeão de 2025, ficou em 3º. Top 5 completo e declaração de Ramon adicionados em 30 de setembro de 2026.</p></blockquote>
<p>A Classic Physique do Mr. Olympia 2026 foi decidida na <strong>noite de sexta-feira, 25 de setembro</strong>, em Las Vegas. <strong>Niall Darwen (Reino Unido)</strong> conquistou o primeiro título dele no Olympia, à frente de <strong>Mike Sommerfeld (Alemanha)</strong>, vice pelo segundo ano seguido, e de <strong>Ramon Dino (Brasil)</strong>, que defendia o título conquistado em 2025 e terminou em 3º. Foi a grande surpresa da noite: Darwen tinha sido 11º e depois 5º nas duas edições anteriores em que competiu no Olympia.</p>
${CAPA("resultado-classic-physique-mr-olympia-2026", "Capa: Niall Darwen campeão da Classic Physique do Mr. Olympia 2026, com Mike Sommerfeld em 2º e Ramon Dino em 3º")}

<h2>Classificação da Classic Physique 2026</h2>
<table><thead><tr><th>Posição</th><th>Atleta</th><th>País</th></tr></thead><tbody><tr><td>1º</td><td><strong>Niall Darwen</strong></td><td>Reino Unido</td></tr><tr><td>2º</td><td>Mike Sommerfeld</td><td>Alemanha</td></tr><tr><td>3º</td><td>Ramon Dino</td><td>Brasil</td></tr><tr><td>4º</td><td>Wesley Vissers</td><td>Holanda</td></tr><tr><td>5º</td><td>Terrence Ruffin</td><td>EUA</td></tr></tbody></table>
<p><em>Classificação confirmada por duas fontes independentes (Fitness Volt e MiddleEasy). Pelo 3º lugar, Ramon recebeu US$ 20 mil de premiação; Darwen levou US$ 100 mil e Sommerfeld, US$ 40 mil (Lance! e Gazeta de Varginha).</em></p>

<h2>Ramon Dino: em que posição ficou?</h2>
<p><strong>Ramon Dino ficou em 3º lugar</strong> e perdeu o título que tinha conquistado em 2025. Ele passou na pesagem oficial da IFBB Pro League na quarta-feira, 23 de setembro, abaixo do limite de peso da altura dele, e chegou como atual campeão: em 2025 venceu a categoria à frente de Mike Sommerfeld (Alemanha) e Terrence Ruffin (EUA), na primeira edição sem Chris Bumstead, que se aposentou após o sexto título em 2024. Os números do atleta estão em <a href="/blog/ramon-dino-peso-altura">quanto pesa Ramon Dino: peso, altura e limite da Classic</a>.</p>

<h2>O que Ramon disse depois do resultado</h2>
<p>Ainda no sábado, 26/09, Ramon publicou nas redes: <em>"Hoje foi Top 3. Não foi o que buscávamos, mas assumimos a responsabilidade"</em>, e prometeu voltar em 2027 para corrigir o que precisa ser corrigido (CNN Brasil e Terra). O motivo da derrota, a hipótese de lesão levantada por analistas e a polêmica nas redes estão em <a href="/blog/por-que-ramon-dino-perdeu-mr-olympia-2026">por que Ramon Dino perdeu o Mr. Olympia 2026</a>.</p>

<h2>Quem eram os favoritos antes da final</h2>
<p>Antes do campeonato, pelas escalações e pelos resultados da temporada, os nomes mais citados para o primeiro chamado eram:</p>
<ul>
<li><strong>Mike Sommerfeld (Alemanha)</strong> — vice em 2025 e campeão do Arnold Classic UK 2026, apontado pela imprensa especializada como a principal ameaça ao brasileiro.</li>
<li><strong>Terrence Ruffin (EUA)</strong> — terceiro em 2025, duas vezes campeão do Arnold Classic e referência em posing na categoria.</li>
<li><strong>Wesley Vissers (Holanda)</strong> — segundo no Arnold Classic UK 2026, atrás de Sommerfeld, e campeão do Arnold Classic Ohio de 2024, quando superou Ramon.</li>
<li><strong>Niall Darwen (Reino Unido)</strong> — citado por Vissers entre os cinco do primeiro chamado, ao lado de Ramon, Sommerfeld, Ruffin e dele mesmo.</li>
</ul>
<p>Outros atletas aparecem nas prévias da imprensa especializada como candidatos ao top 5. A lista final de quem sobe ao palco é da IFBB Pro League, e o primeiro chamado das prévias costuma indicar quem disputa o título — sem definir nada até a final.</p>

<h2>E se você competisse na Classic?</h2>
<p>Ramon compete na faixa até 182,9 cm. Veja em qual faixa a sua altura cairia — e qual seria o seu teto na tabela profissional (ou <a href="/ferramentas/calculadora-peso-classic-physique">calcule o limite de peso da Classic Physique pela sua altura</a> na versão completa):</p>
<!--CALCULADORA_CLASSIC:compacta-->

<p><em>Quanto tempo levaria para chegar a um shape desse nível? O <a href="/ferramentas/quanto-tempo-para-ter-shape?ref=classic">simulador de evolução muscular</a> mostra seu estágio e o caminho provável, sem prometer prazo para o nível profissional.</em></p>

<h2>Como foram as prévias</h2>
<p>As prévias da Classic Physique aconteceram na tarde desta sexta-feira, 25 de setembro. No primeiro chamado, <strong>Ramon Dino e Mike Sommerfeld dividiram o centro do palco</strong>, as posições que costumam ficar com os candidatos ao título, e chegaram a trocar de lugar durante as comparações, segundo a Generation Iron e a RepOne.</p>
<p>Na final, à noite, Niall Darwen passou os dois e levou o título.</p>

<h2>Como funciona a decisão: prévias e final</h2>
<p>Na <strong>prévia (prejudging)</strong>, os juízes comparam os atletas em grupos, nas poses obrigatórias, e é ali que a maior parte da nota se forma. Na <strong>final</strong>, cada um faz a rotina de posing e há novas comparações; o resultado é anunciado no palco. Por isso o "quem ganhou" só existe depois da final — e em 2026 a final mudou o que as prévias sugeriam. Detalhes do formato e da regra de peso: <a href="/blog/ramon-dino-peso-altura">limite de peso da Classic Physique</a>.</p>

<h2>As outras categorias</h2>
<p>Na mesma noite foram decididas Wellness (<a href="/blog/resultado-wellness-mr-olympia-2026">resultado da Wellness 2026</a>), 212 (<a href="/blog/resultado-212-mr-olympia-2026">resultado da 212</a>), Figure, Women's Physique e Ms. Olympia. O Open, título máximo do evento, foi decidido no sábado, 26/09, e ficou com Nick Walker (<a href="/blog/resultado-mr-olympia-open-2026">resultado do Mr. Olympia Open 2026</a>). Todos os campeões ficam reunidos em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-classic-physique-mr-olympia-2026")}

${CTA_FASES}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Classic Physique do Mr. Olympia 2026?", answer: "Niall Darwen, do Reino Unido, na final de sexta-feira, 25 de setembro, em Las Vegas. É o primeiro título dele no Olympia." },
      { question: "Em que posição Ramon Dino ficou?", answer: "Em 3º lugar. Ramon era o atual campeão, título de 2025, e ficou atrás de Niall Darwen e Mike Sommerfeld." },
      { question: "Quem ficou em segundo na Classic Physique 2026?", answer: "Mike Sommerfeld, da Alemanha, vice pelo segundo ano seguido." },
      { question: "Ramon Dino perdeu o título?", answer: "Sim. Ele venceu a Classic Physique em 2025, primeiro brasileiro campeão do Mr. Olympia, e em 2026 terminou em 3º." },
      { question: "Quem ficou em 4º e 5º na Classic Physique 2026?", answer: "Wesley Vissers, da Holanda, em 4º, e Terrence Ruffin, dos EUA, em 5º." },
      { question: "Quanto Ramon Dino ganhou pelo 3º lugar?", answer: "US$ 20 mil de premiação. O campeão Niall Darwen recebeu US$ 100 mil e Mike Sommerfeld, US$ 40 mil." },
    ],
  },

  /* ───────────────── 1b. POR QUE RAMON DINO PERDEU ───────────────── */
  {
    slug: "por-que-ramon-dino-perdeu-mr-olympia-2026",
    title: "Por que Ramon Dino perdeu o Mr. Olympia 2026? O que aconteceu e qual a polêmica",
    metaTitle: "Por Que Ramon Dino Perdeu o Olympia 2026? O Que Aconteceu",
    metaDescription:
      "Ramon Dino perdeu para Niall Darwen e ficou em 3º no Mr. Olympia 2026. Os erros de pose, a hipótese de lesão, a polêmica nas redes e o que ele disse depois.",
    excerpt:
      "Ramon Dino perdeu o título da Classic Physique para o britânico Niall Darwen e terminou em 3º. O que explica a derrota, o que é fato e o que é hipótese, e a polêmica que veio depois.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: "2026-09-30",
    readTime: "5 min",
    author: AUTOR,
    tags: ["Ramon Dino", "Mr. Olympia 2026", "Classic Physique", "polêmica", "fisiculturismo"],
    content: `<p><strong>Ramon Dino perdeu o título da Classic Physique para o britânico Niall Darwen</strong> e terminou em 3º no Mr. Olympia 2026, decidido na noite de 25 de setembro em Las Vegas. O alemão Mike Sommerfeld ficou em 2º. A explicação que aparece em quase toda a cobertura é a mesma: <strong>falhas na execução de poses</strong> nas comparações decisivas, diante de adversários que chegaram melhores.</p>

<h2>Para quem Ramon Dino perdeu?</h2>
<p>Para <strong>Niall Darwen (Reino Unido)</strong>, campeão, e <strong>Mike Sommerfeld (Alemanha)</strong>, vice pelo segundo ano seguido. Darwen foi a surpresa: tinha sido 11º no Olympia 2024 e 5º em 2025. Top 5 completo e premiação em <a href="/blog/resultado-classic-physique-mr-olympia-2026">resultado da Classic Physique 2026</a>.</p>
<table><thead><tr><th>Posição</th><th>Atleta</th><th>País</th></tr></thead><tbody><tr><td>1º</td><td>Niall Darwen</td><td>Reino Unido</td></tr><tr><td>2º</td><td>Mike Sommerfeld</td><td>Alemanha</td></tr><tr><td>3º</td><td>Ramon Dino</td><td>Brasil</td></tr><tr><td>4º</td><td>Wesley Vissers</td><td>Holanda</td></tr><tr><td>5º</td><td>Terrence Ruffin</td><td>EUA</td></tr></tbody></table>

<h2>O que aconteceu com Ramon Dino no Olympia?</h2>
<p>Nas prévias da tarde de sexta, Ramon dividiu o centro do palco com Sommerfeld no primeiro chamado, a posição de quem disputa o título. A partir daí a apresentação caiu. Os veículos que cobriram o evento, como CNN Brasil, Terra e ge, registram <strong>erros visíveis na execução de poses</strong> e perda de terreno nas comparações diretas. Na final, Darwen passou os dois.</p>
<p>Na Classic Physique, pose não é detalhe. Os juízes comparam os atletas lado a lado, e quem não consegue mostrar a contração de um músculo naquela pose perde o ponto, por melhor que seja o físico. Como a categoria tem teto de peso por altura (<a href="/blog/ramon-dino-peso-altura">Ramon pesou 102,5 kg para um limite de 103 kg</a>), ninguém ganha só por estar maior: ganha quem apresenta melhor o que tem.</p>

<h2>Ramon Dino estava lesionado?</h2>
<p><strong>Não há confirmação.</strong> A hipótese foi levantada por Renato Cariani, em análise publicada pela CNN Brasil: ele disse ter ficado incomodado com a perna esquerda de Ramon, que dava a sensação de não buscar contração, e que parecia haver alguma lesão atrapalhando. Julio Balestrin, na mesma análise, apontou outra causa possível: um atleta cansado, com muita dieta e muito treino, cujo físico estressado não respondeu à recarga final de carboidratos.</p>
<p>São leituras de quem assistiu, não diagnóstico. Até 30 de setembro, Ramon não confirmou nem negou lesão. Se houver declaração dele ou da equipe, esta página é atualizada.</p>

<h2>Qual a polêmica com Ramon Dino?</h2>
<p>A polêmica não é de arbitragem. Não houve acusação séria de resultado roubado. O que houve foi uma onda de críticas nas redes depois do 3º lugar, e ela tem duas partes:</p>
<ul>
<li><strong>Antes do campeonato:</strong> uma semana antes do Olympia, Ramon respondeu a quem criticava o conteúdo repetitivo que ele postava na preparação. Disse que prefere uma rotina reservada, focada em treino, refeições, descanso e família, e que isso é uma escolha dele (Terra, Estado de Minas e Diário do Litoral).</li>
<li><strong>Depois do resultado:</strong> a esposa dele, a atleta Vit Viana, saiu em defesa do marido. <em>"Muito fácil falar de fora"</em>, escreveu, e <em>"ninguém apaga o que você já fez"</em> (CNN Brasil, Terra e Correio).</li>
</ul>

<h2>O que Ramon disse depois</h2>
<p>No sábado, 26/09, Ramon publicou: <em>"A gente se dedica, abre mão de muita coisa e sobe naquele palco buscando o melhor resultado. Hoje foi Top 3. Não foi o que buscávamos, mas assumimos a responsabilidade."</em> Ele disse que agora é hora de corrigir o que precisa ser corrigido e prometeu voltar em 2027 (CNN Brasil e Terra).</p>

<h2>O que acontece com Ramon Dino agora?</h2>
<p>Ele segue na Classic Physique e mira o Olympia 2027. Mesmo com a derrota, Ramon está no top 5 da categoria desde 2021: 5º, 2º, 2º, 4º, campeão em 2025 e 3º em 2026. A trajetória ano a ano está em <a href="/blog/ramon-dino-peso-altura">quanto pesa Ramon Dino</a>.</p>

<h2>O que isso ensina para quem treina</h2>
<p>O atual campeão do mundo oscilou de um ano para o outro, com a mesma genética e a mesma equipe. Evolução nunca é linha reta, nem no topo. Por isso comparar o seu shape com o de outra pessoa não faz sentido: cada um tem a própria genética, rotina e história, com altos e baixos. O que funciona é um treino que dê para seguir por anos, com aderência e progressão, corrigindo a rota quando algo não sai como o planejado. Se você quer montar o seu com acompanhamento, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>

${ACOMPANHE("por-que-ramon-dino-perdeu-mr-olympia-2026")}

<h2>Fontes</h2>
<ul>
<li>CNN Brasil: "Ramon Dino lamenta terceira colocação no Mr. Olympia e manda recado"; "Esposa de Ramon Dino sai em defesa do atleta"; "Cariani e Balestrin explicam 3º lugar de Ramon Dino no Mr. Olympia"</li>
<li>Terra: "Ramon Dino lamenta 3º lugar no Mr. Olympia e promete voltar em 2027"; "Ramon Dino rebate críticas sobre sua rotina antes de defender título"</li>
<li>ge: "Ramon Dino perde título do Mr. Olympia 2026 e termina em 3º"</li>
<li>Fitness Volt e MiddleEasy: classificação completa da Classic Physique 2026</li>
</ul>`,
    faq: [
      { question: "Por que Ramon Dino perdeu o Mr. Olympia 2026?", answer: "A cobertura aponta falhas na execução de poses nas comparações decisivas, diante de Niall Darwen e Mike Sommerfeld, que chegaram melhores. Analistas levantaram ainda fadiga da preparação e uma possível lesão na perna esquerda, que não foi confirmada." },
      { question: "Para quem Ramon Dino perdeu?", answer: "Para o britânico Niall Darwen, campeão, e o alemão Mike Sommerfeld, vice. Ramon terminou em 3º." },
      { question: "Ramon Dino estava lesionado no Olympia?", answer: "Não há confirmação. A hipótese é de Renato Cariani, que viu a perna esquerda sem contração. Ramon não confirmou nem negou até 30 de setembro de 2026." },
      { question: "Qual a polêmica com Ramon Dino?", answer: "Críticas nas redes: antes do Olympia, ao conteúdo repetitivo da preparação; depois, ao 3º lugar. A esposa, Vit Viana, respondeu dizendo que é muito fácil falar de fora. Não houve acusação séria de erro de arbitragem." },
      { question: "Ramon Dino vai competir em 2027?", answer: "Sim. Ele disse que vai corrigir o que precisa e voltar ao Olympia em 2027, na Classic Physique." },
    ],
  },

  /* ───────────────── 2. HORÁRIO RAMON DINO ───────────────── */
  {
    slug: "ramon-dino-mr-olympia-2026-horario",
    title: "Que horas Ramon Dino compete no Mr. Olympia 2026? Veja o horário",
    metaTitle: "Que Horas Ramon Dino Compete no Olympia 2026? Horário",
    metaDescription:
      "Ramon Dino competiu na sexta, 25/09, com prévias às 13h30 e final às 22h (Brasília), e terminou em 3º na Classic Physique do Mr. Olympia 2026.",
    excerpt:
      "Ramon Dino competiu na sexta-feira, 25 de setembro: prévias às 13h30 e final a partir das 22h (Brasília). Ele terminou em 3º; o título ficou com Niall Darwen.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-27",
    readTime: "3 min",
    author: AUTOR,
    tags: ["Ramon Dino", "Mr. Olympia 2026", "horário", "onde assistir", "Classic Physique"],
    content: `<blockquote><p><strong>A Classic Physique já foi decidida: Niall Darwen (Reino Unido) é o campeão e Ramon Dino ficou em 3º.</strong> Veja a <a href="/blog/resultado-classic-physique-mr-olympia-2026">classificação completa</a>. Última verificação: 27 de setembro de 2026.</p></blockquote>
<p><strong>Ramon Dino competiu na sexta-feira, 25 de setembro de 2026</strong>, na Classic Physique do Mr. Olympia, em Las Vegas. Os horários, em Brasília, foram:</p>
${CAPA("ramon-dino-mr-olympia-2026-horario", "Capa: que horas Ramon Dino competiu no Mr. Olympia 2026 — sexta, 25 de setembro: prévias às 13h30 e final a partir das 22h, horário de Brasília")}
<table><thead><tr><th>Etapa</th><th>Brasília</th><th>Las Vegas</th><th>Local</th></tr></thead><tbody>
<tr><td>Prévias (prejudging) da Classic Physique</td><td><strong>a partir das 13h30</strong></td><td>9h30</td><td>Las Vegas Convention Center (South Hall)</td></tr>
<tr><td>Final da Classic Physique</td><td><strong>a partir das 22h</strong></td><td>18h</td><td>Orleans Arena</td></tr>
</tbody></table>
<p>Os horários eram de início da sessão. A Classic Physique dividiu a sessão com outras categorias (212, Figure, Women's Physique, Ms. Olympia e Wellness), então o momento exato em que Ramon sobe ao palco depende da ordem do dia. A final da Classic costuma ficar entre as últimas da noite. O resultado entra em <a href="/blog/resultado-classic-physique-mr-olympia-2026">resultado da Classic Physique do Mr. Olympia 2026</a>.</p>

<h2>Onde assistir Ramon Dino</h2>
<ul>
<li><strong>OlympiaTV (oficial):</strong> pela primeira vez a transmissão é gratuita, com cadastro no site do evento. Cobre prévias e finais de todas as categorias.</li>
<li><strong>Cobertura em português:</strong> o canal de Renato Cariani no YouTube anunciou transmissão com comentários e análises para o público brasileiro.</li>
</ul>

<h2>Prévias e final: o que muda</h2>
<p>Na <strong>prévia</strong>, à tarde, os juízes fazem as comparações nas poses obrigatórias e o primeiro chamado (os atletas comparados juntos primeiro) indica quem disputa o título. Na <strong>final</strong>, à noite, vêm as rotinas de posing, novas comparações e o anúncio das colocações. Ou seja: às 13h30 dá para ver a briga; o campeão só sai depois das 22h.</p>

<h2>Por que a Classic mudou para sexta</h2>
<p>Em 2025 a categoria foi decidida no sábado. Em 2026 a organização moveu a Classic Physique para a sexta-feira, junto com a Wellness. O sábado ficou com Men's Physique, Bikini, Fitness e a final do Mr. Olympia Open, vencida por Nick Walker.</p>

<h2>Depois da final</h2>
<p>A classificação completa, com Ramon em 3º, está em <a href="/blog/resultado-classic-physique-mr-olympia-2026">resultado da Classic Physique do Mr. Olympia 2026</a>. A programação do fim de semana inteiro, com as outras categorias, está em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("ramon-dino-mr-olympia-2026-horario")}

${FONTES}`,
    faq: [
      { question: "Que horas Ramon Dino competiu no Olympia 2026?", answer: "Na sexta-feira, 25 de setembro, as prévias da Classic Physique começaram às 13h30 e a final a partir das 22h, no horário de Brasília (9h30 e 18h em Las Vegas). A hora exata em que ele sobe ao palco depende da ordem das categorias na sessão." },
      { question: "Em qual categoria Ramon Dino compete?", answer: "Classic Physique, categoria com limite de peso por altura. Ramon foi campeão em 2025 e, em 2026, terminou em 3º, atrás de Niall Darwen e Mike Sommerfeld." },
      { question: "Onde assistir Ramon Dino no Mr. Olympia 2026?", answer: "Na OlympiaTV, transmissão oficial gratuita com cadastro no site do evento, e em coberturas em português como a do canal de Renato Cariani no YouTube." },
      { question: "O horário de Las Vegas é diferente do de Brasília?", answer: "Sim: Las Vegas está 4 horas atrás de Brasília em setembro. As prévias de 9h30 em Las Vegas são 13h30 em Brasília, e a final de 18h é 22h." },
    ],
  },

  /* ───────────────── 3. HUB — QUEM GANHOU ───────────────── */
  {
    slug: "quem-ganhou-mr-olympia-2026",
    title: "Quem ganhou o Mr. Olympia 2026? Nick Walker e todos os campeões",
    metaTitle: "Quem Ganhou o Mr. Olympia 2026? Nick Walker é o Campeão",
    metaDescription:
      "Nick Walker é o Mr. Olympia 2026. Veja todos os campeões, categoria por categoria: Classic Physique, Wellness, 212, Men's Physique, Bikini e mais.",
    excerpt:
      "Nick Walker venceu o Open e é o Mr. Olympia 2026. Todos os campeões do fim de semana em Las Vegas, categoria por categoria.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-27",
    readTime: "5 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "campeões", "resultados", "fisiculturismo", "Las Vegas"],
    content: `<blockquote><p><strong>Resultado definido: Nick Walker é o Mr. Olympia 2026.</strong> Última verificação: 27 de setembro de 2026, 3h30 (Brasília).</p></blockquote>
<p><strong>Nick Walker (EUA) é o campeão do Mr. Olympia 2026.</strong> Ele venceu o Open na noite de sábado, 26 de setembro, em Las Vegas, à frente de Samson Dauda e do atual campeão, Derek Lunsford, que ficou em 3º. É o primeiro Sandow da carreira de Walker, que tinha sido 6º em 2025.</p>
<p>Os outros campeões do fim de semana: <strong>Niall Darwen</strong> (Classic Physique), <strong>Eduarda Bezerra</strong> (Wellness, bicampeã), <strong>Keone Pearson</strong> (212), <strong>Ryan Terry</strong> (Men's Physique, quarto título seguido), <strong>Jasmine Gonzalez</strong> (Bikini), <strong>Michelle Fredua-Mensah</strong> (Fitness), <strong>Natalia Abraham Coelho</strong> (Women's Physique), <strong>Andrea Shaw</strong> (Ms. Olympia), <strong>Lola Montez</strong> (Figure) e <strong>Shealynn Burnett</strong> (Fit Model, na estreia da categoria, com a brasileira Gabriela Queiroz em 2º). A tabela abaixo reúne todos.</p>
${CAPA("quem-ganhou-mr-olympia-2026", "Capa: Nick Walker é o Mr. Olympia 2026 — todos os campeões, categoria por categoria: Open, Classic Physique, Wellness, 212, Men's Physique, Bikini e mais")}

<h2>Campeões do Mr. Olympia 2026</h2>
<table><thead><tr><th>Categoria</th><th>Final</th><th>Campeão(ã) 2026</th><th>Campeão(ã) 2025</th><th>Resultado</th></tr></thead><tbody>
<tr><td>Classic Physique</td><td>Sex 25/09, 22h</td><td><strong>Niall Darwen (GBR)</strong></td><td>Ramon Dino (BRA)</td><td><a href="/blog/resultado-classic-physique-mr-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Wellness</td><td>Sex 25/09, 22h</td><td><strong>Eduarda Bezerra (BRA)</strong></td><td>Eduarda Bezerra (BRA)</td><td><a href="/blog/resultado-wellness-mr-olympia-2026">Ver resultado</a></td></tr>
<tr><td>212</td><td>Sex 25/09, 22h</td><td><strong>Keone Pearson (EUA)</strong></td><td>Keone Pearson (EUA)</td><td><a href="/blog/resultado-212-mr-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Figure</td><td>Sex 25/09, 22h</td><td><strong>Lola Montez</strong></td><td>Rhea Gayle (GBR)</td><td>Nesta página</td></tr>
<tr><td>Women's Physique</td><td>Sex 25/09, 22h</td><td><strong>Natalia Abraham Coelho (EUA)</strong></td><td>Natalia Abraham Coelho (EUA)</td><td><a href="/blog/resultado-womens-physique-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Ms. Olympia</td><td>Sex 25/09, 22h</td><td><strong>Andrea Shaw (EUA)</strong></td><td>Andrea Shaw (EUA)</td><td>Nesta página</td></tr>
<tr><td>Fitness</td><td>Sáb 26/09, 23h</td><td><strong>Michelle Fredua-Mensah (GBR)</strong></td><td>Michelle Fredua-Mensah (GBR)</td><td>Nesta página</td></tr>
<tr><td>Men's Physique</td><td>Sáb 26/09, 23h</td><td><strong>Ryan Terry (GBR)</strong></td><td>Ryan Terry (GBR)</td><td><a href="/blog/resultado-mens-physique-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Bikini</td><td>Sáb 26/09, 23h</td><td><strong>Jasmine Gonzalez</strong></td><td>Maureen Blanquisco (PHI)</td><td><a href="/blog/resultado-bikini-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Fit Model (estreia)</td><td>Sáb 26/09, 13h30*</td><td><strong>Shealynn Burnett</strong></td><td>—</td><td><a href="/blog/resultado-fit-model-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Mr. Olympia (Open)</td><td>Sáb 26/09, 23h</td><td><strong>Nick Walker (EUA)</strong></td><td>Derek Lunsford (EUA)</td><td><a href="/blog/resultado-mr-olympia-open-2026">Ver resultado</a></td></tr>
</tbody></table>
<p><em>O resultado da Wheelchair entra aqui quando confirmado por duas fontes. Horários são o início de cada sessão de finais. *A Fit Model teve prévias e final na sessão da manhã de sábado.</em></p>

<h2>Status das categorias agora</h2>
<p>Cada linha leva à página da categoria. O status muda sozinho quando um bloco começa; "resultado definido" só aparece com o anúncio oficial.</p>
<!--OLYMPIA_STATUS:geral-->

<h2>Programação completa (horário de Brasília)</h2>
<h3>Sexta-feira, 25 de setembro</h3>
<ul>
<li><strong>13h30</strong> — prévias de 212, Classic Physique, Figure, Women's Physique, Ms. Olympia e Wellness (Las Vegas Convention Center).</li>
<li><strong>22h</strong> — finais de Figure, Women's Physique, Wellness, 212, Ms. Olympia e Classic Physique, e as prévias do Mr. Olympia Open (Orleans Arena).</li>
</ul>
<h3>Sábado, 26 de setembro</h3>
<ul>
<li><strong>13h30</strong> — prévias de Men's Physique, Fitness, Bikini, Wheelchair e Fit Model.</li>
<li><strong>23h</strong> — finais de Fitness, Men's Physique, Bikini e Mr. Olympia Open.</li>
</ul>
<p>Transmissão gratuita pela OlympiaTV, com cadastro no site oficial. Detalhes em <a href="/blog/ramon-dino-mr-olympia-2026-horario">que horas Ramon Dino compete e onde assistir</a>.</p>

<h2>Os brasileiros em destaque</h2>
<p>Todos os brasileiros, por dia e categoria, com o resultado de cada um, estão no <a href="/blog/brasileiros-mr-olympia-2026">painel dos brasileiros no Mr. Olympia 2026</a>.</p>
<ul>
<li><strong>Ramon Dino</strong> — 3º lugar na Classic Physique 2026; campeão em 2025, primeiro brasileiro a vencer o Mr. Olympia. Pesou 102,5 kg na pesagem oficial (<a href="/blog/ramon-dino-peso-altura">peso, altura e limite</a>).</li>
<li><strong>Eduarda Bezerra</strong> — bicampeã da Wellness em 2026; o Brasil venceu as seis edições da categoria desde 2021.</li>
<li><strong>Isa Pereira Nunes</strong> — 2º lugar na Wellness 2026, na dobradinha brasileira.</li>
</ul>

<h2>Como foi o Open</h2>
<p>Nick Walker (EUA) venceu, Samson Dauda ficou em 2º e Derek Lunsford, que defendia o título de 2025, em 3º. Hadi Choopan, vice três vezes seguidas, não competiu: desistiu em agosto por problemas de visto. A análise completa está em <a href="/blog/resultado-mr-olympia-open-2026">resultado do Mr. Olympia Open 2026</a>.</p>

${ACOMPANHE("quem-ganhou-mr-olympia-2026")}

${CTA_MONTINHO}
${FONTES}`,
    faq: [
      { question: "Quem ganhou o Mr. Olympia 2026?", answer: "Nick Walker, dos Estados Unidos, venceu o Open na noite de sábado, 26 de setembro, em Las Vegas. Samson Dauda ficou em 2º e Derek Lunsford, o campeão de 2025, em 3º." },
      { question: "Quem são os campeões de todas as categorias?", answer: "Open: Nick Walker. Classic Physique: Niall Darwen. Wellness: Eduarda Bezerra. 212: Keone Pearson. Men's Physique: Ryan Terry. Bikini: Jasmine Gonzalez. Fitness: Michelle Fredua-Mensah. Women's Physique: Natalia Abraham Coelho. Ms. Olympia: Andrea Shaw. Figure: Lola Montez. Fit Model: Shealynn Burnett." },
      { question: "Quando foram as finais do Mr. Olympia 2026?", answer: "Sexta-feira, 25/09, a partir das 22h (Classic Physique, Wellness, 212, Figure, Women's Physique e Ms. Olympia) e sábado, 26/09, a partir das 23h (Open, Men's Physique, Bikini e Fitness), no horário de Brasília." },
      { question: "Quantos brasileiros competem no Mr. Olympia 2026?", answer: "58, entre 322 atletas de 12 categorias. Os mais conhecidos são Ramon Dino, na Classic Physique, e Eduarda Bezerra, Isa Pereira Nunes e Rayane Fogal, na Wellness." },
      { question: "Onde ver os resultados do Mr. Olympia 2026?", answer: "Nesta página, atualizada categoria por categoria com base nos anúncios oficiais do Olympia e da IFBB Pro League, e nos artigos específicos de Classic Physique, Wellness e Open." },
    ],
  },

  /* ───────────────── 4. WELLNESS ───────────────── */
  {
    slug: "resultado-wellness-mr-olympia-2026",
    title: "Resultado Wellness Mr. Olympia 2026: Eduarda Bezerra é bicampeã",
    metaTitle: "Wellness Olympia 2026: Eduarda Bezerra Bicampeã, Isa Nunes 2ª",
    metaDescription:
      "Eduarda Bezerra é bicampeã da Wellness do Mr. Olympia 2026, com Isa Pereira Nunes em 2º: dobradinha brasileira. O Brasil segue invicto na categoria.",
    excerpt:
      "Eduarda Bezerra venceu a Wellness do Mr. Olympia 2026 e é bicampeã. Isa Pereira Nunes ficou em 2º, e o Brasil segue invicto na categoria.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-26",
    readTime: "4 min",
    author: AUTOR,
    tags: ["Wellness", "Mr. Olympia 2026", "Eduarda Bezerra", "Isa Pereira Nunes", "resultado"],
    content: `<blockquote><p><strong>Resultado definido: Eduarda Bezerra é bicampeã da Wellness.</strong> Isa Pereira Nunes ficou em 2º. Última verificação: 26 de setembro de 2026, 10h (Brasília).</p></blockquote>
<p><strong>Eduarda Bezerra</strong> venceu a Wellness do Mr. Olympia 2026 na noite de <strong>sexta-feira, 25 de setembro</strong>, em Las Vegas, e conquistou o segundo título seguido. <strong>Isa Pereira Nunes</strong>, campeã de 2024, ficou em 2º, numa dobradinha brasileira, e <strong>Elisa Alcantara</strong> (República Dominicana) completou o pódio — o mesmo top 3 de 2025. Com isso, o Brasil venceu as seis edições da categoria desde a estreia, em 2021.</p>
${CAPA("resultado-wellness-mr-olympia-2026", "Capa: Eduarda Bezerra bicampeã da Wellness no Mr. Olympia 2026, com Isa Pereira Nunes em 2º; o Brasil venceu as seis edições")}

<h2>Classificação da Wellness 2026</h2>
<table><thead><tr><th>Posição</th><th>Atleta</th><th>País</th></tr></thead><tbody><tr><td>1º</td><td><strong>Eduarda Bezerra</strong></td><td>Brasil</td></tr><tr><td>2º</td><td>Isa Pereira Nunes</td><td>Brasil</td></tr><tr><td>3º</td><td>Elisa Alcantara</td><td>República Dominicana</td></tr><tr><td>4º</td><td>A confirmar</td><td>—</td></tr><tr><td>5º</td><td>A confirmar</td><td>—</td></tr></tbody></table>
<p><em>O pódio foi confirmado por duas fontes independentes. O 4º e o 5º lugares, e as colocações das outras brasileiras, entram quando também estiverem confirmados.</em></p>

<h2>As brasileiras</h2>
<p>Eram <strong>19 brasileiras entre as 40 inscritas</strong>. As mais cotadas antes da final:</p>
<ul>
<li><strong>Eduarda Bezerra</strong> (Caruaru, PE) — <strong>campeã (1º lugar)</strong>. Em 2025 venceu o Arnold Classic Ohio e o Olympia, superando Isa Pereira Nunes nos dois.</li>
<li><strong>Isa Pereira Nunes</strong> — <strong>2º lugar</strong>, repetindo o vice de 2025. Foi campeã em 2024.</li>
<li><strong>Rayane Fogal</strong> — campeã do Arnold Classic Ohio e do Arnold Classic UK em 2026. Colocação a confirmar.</li>
</ul>
<p>As outras brasileiras inscritas aparecem com variações entre as listas publicadas pela imprensa; a relação oficial é a da IFBB Pro League, e as colocações delas entram aqui quando confirmadas. <strong>Francielle Mattos</strong>, tricampeã (2021–2023), tem vaga garantida mas optou por não competir em 2026.</p>

<h2>O histórico: Brasil em todas as edições</h2>
<table><thead><tr><th>Ano</th><th>Campeã</th></tr></thead><tbody>
<tr><td>2021</td><td>Francielle Mattos (BRA)</td></tr>
<tr><td>2022</td><td>Francielle Mattos (BRA)</td></tr>
<tr><td>2023</td><td>Francielle Mattos (BRA)</td></tr>
<tr><td>2024</td><td>Isa Pereira Nunes (BRA)</td></tr>
<tr><td>2025</td><td>Eduarda Bezerra (BRA)</td></tr>
<tr><td>2026</td><td>Eduarda Bezerra (BRA)</td></tr>
</tbody></table>

<h2>O que os juízes avaliam na Wellness</h2>
<p>A Wellness premia o desenvolvimento da parte inferior do corpo — glúteos, coxas e quadril — em proporção maior que a superior, com condicionamento moderado: definição visível sem a secura das categorias de bodybuilding. Para entender como esse tipo de desenvolvimento se constrói no treino comum, sem palco, veja <a href="/blog/como-ganhar-massa-sem-ganhar-gordura">como ganhar massa sem ganhar gordura</a>.</p>

<h2>As outras decisões da noite</h2>
<p>Na mesma sessão de sexta foram decididas Classic Physique (<a href="/blog/resultado-classic-physique-mr-olympia-2026">Niall Darwen campeão, Ramon Dino em 3º</a>), 212, Figure, Women's Physique e Ms. Olympia. Todos os campeões em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-wellness-mr-olympia-2026")}

${CTA_WELLNESS}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Wellness do Mr. Olympia 2026?", answer: "Eduarda Bezerra, do Brasil, na final de sexta-feira, 25 de setembro. É o segundo título seguido dela." },
      { question: "Quem ficou em segundo e terceiro na Wellness 2026?", answer: "Isa Pereira Nunes (Brasil) ficou em 2º e Elisa Alcantara (República Dominicana) em 3º, o mesmo pódio de 2025." },
      { question: "O Brasil já perdeu a Wellness no Olympia?", answer: "Não. Desde a estreia da categoria, em 2021, todas as seis edições foram vencidas por brasileiras: Francielle Mattos (3), Isa Pereira Nunes (1) e Eduarda Bezerra (2)." },
      { question: "Francielle Mattos competiu em 2026?", answer: "Não. A tricampeã (2021, 2022 e 2023) tinha vaga garantida, mas optou por ficar fora desta edição." },
    ],
  },

  /* ───────────────── 5. OPEN ───────────────── */
  {
    slug: "resultado-mr-olympia-open-2026",
    title: "Nick Walker é o Mr. Olympia 2026: quem é ele, resultado do Open e classificação",
    metaTitle: "Nick Walker Vence o Mr. Olympia 2026: Resultado do Open",
    metaDescription:
      "Nick Walker venceu o Mr. Olympia 2026, com Samson Dauda em 2º e Derek Lunsford em 3º. Veja a classificação do Open e como foi a final.",
    excerpt:
      "Nick Walker venceu o Mr. Olympia 2026 em Las Vegas. Samson Dauda ficou em 2º e o campeão de 2025, Derek Lunsford, em 3º.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-29",
    readTime: "4 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Open", "Nick Walker", "Samson Dauda", "Derek Lunsford", "resultado"],
    content: `<blockquote><p><strong>Resultado definido: Nick Walker é o Mr. Olympia 2026.</strong> Última verificação: 27 de setembro de 2026, 3h30 (Brasília).</p></blockquote>
<p><strong>Nick Walker venceu o Mr. Olympia 2026</strong> na noite de sábado, 26 de setembro, na Orleans Arena, em Las Vegas. O norte-americano, 6º colocado em 2025, conquistou o primeiro Sandow da carreira à frente de <strong>Samson Dauda</strong> (2º), campeão de 2024, e de <strong>Derek Lunsford</strong> (3º), que defendia o título. O Open é a principal categoria da IFBB Pro League e a única sem limite de peso.</p>
${CAPA("resultado-mr-olympia-open-2026", "Capa: Nick Walker é o Mr. Olympia 2026 — resultado oficial do Open, com Samson Dauda em 2º e Derek Lunsford em 3º")}

<h2>Classificação do Mr. Olympia Open 2026</h2>
<table><thead><tr><th>Posição</th><th>Atleta</th><th>País</th></tr></thead><tbody><tr><td>1º</td><td><strong>Nick Walker</strong></td><td>EUA</td></tr><tr><td>2º</td><td>Samson Dauda</td><td>Nigéria/Reino Unido</td></tr><tr><td>3º</td><td>Derek Lunsford</td><td>EUA</td></tr><tr><td>4º</td><td>Andrew Jacked</td><td>Nigéria</td></tr><tr><td>5º</td><td>Tonio Burton</td><td>EUA</td></tr></tbody></table>
<p><em>Top 5 confirmado por duas fontes independentes. As posições do 6º em diante e a de Leandro Peres, único brasileiro no Open, entram aqui quando também tiverem duas fontes.</em></p>

<h2>Quem é Nick Walker, o novo Mr. Olympia</h2>
<p>Nick Walker é norte-americano, conhecido no fisiculturismo como <strong>"The Mutant"</strong> pelo volume muscular. Profissional desde 2020, subiu rápido: venceu o <strong>Arnold Classic de 2021</strong>, um dos torneios mais importantes do calendário, e foi <strong>3º no Mr. Olympia de 2022</strong>. Depois de oscilar nas edições seguintes e terminar em 6º em 2025, chegou a Las Vegas em 2026 como aposta de parte da imprensa para o grupo da frente — e saiu com o primeiro Sandow da carreira.</p>

<h2>Quem eram os favoritos</h2>
<ul>
<li><strong>Derek Lunsford (EUA)</strong> — campeão em 2023 e 2025. Em 2025 venceu Arnold Classic, Pittsburgh Pro e Olympia, e tornou-se o segundo atleta da história a recuperar o título depois de perdê-lo, ao lado de Jay Cutler.</li>
<li><strong>Samson Dauda (Nigéria/Reino Unido)</strong> — campeão de 2024, caiu para quarto em 2025. Venceu o Europa Pro em 13 de setembro, onze dias antes de Las Vegas.</li>
<li><strong>Andrew Jacked (Nigéria)</strong> — terceiro em 2025 e invicto desde então: Romania Pro 2025, Arnold Classic Ohio e Arnold Classic UK 2026.</li>
<li><strong>Nick Walker (EUA)</strong> — 6º em 2025, era citado para o primeiro chamado; saiu campeão.</li>
<li><strong>Martin Fitzwater (EUA)</strong> — também citado para o grupo da frente pela imprensa especializada.</li>
</ul>
<p><strong>Hadi Choopan</strong> (Irã), vice por três anos seguidos, desistiu em 26 de agosto por problemas de visto — o que abriu uma vaga no grupo da frente.</p>

<h2>Das prévias à final</h2>
<p>O Open teve as prévias na <strong>sexta-feira à noite</strong> e a final no <strong>sábado</strong>. Nas prévias, as comparações principais reuniram Lunsford, Dauda, Andrew Jacked e Walker, segundo a Fitness Volt e a RepOne. Na final, Walker levou o Sandow, o troféu do campeão.</p>

<h2>Open e Classic: a diferença</h2>
<p>O Open não tem limite de peso: vence quem combina mais massa muscular com condicionamento e proporção. A Classic Physique, de Ramon Dino, limita o peso pela altura e valoriza linhas e estética. Um atleta de 1,81 m compete na Classic com no máximo 103 kg; no Open, os primeiros colocados passam com folga dos 120 kg. Os números da Classic estão em <a href="/blog/ramon-dino-peso-altura">peso, altura e limite da Classic Physique</a>, e todas as divisões estão explicadas em <a href="/blog/categorias-do-fisiculturismo">categorias do fisiculturismo</a>.</p>

<h2>Quanto tempo para construir um shape grande?</h2>
<p>O Open é o nível máximo de massa muscular do fisiculturismo. Se você quer saber em que estágio está e como tende a ser a sua curva nos próximos anos, compare com essa referência:</p>
<!--SHAPE:open-->

<h2>Próximo evento: Mr. Olympia Brasil 2026</h2>
<p>A marca Olympia vem ao Brasil de 16 a 18 de outubro, no Distrito Anhembi, em São Paulo, com campeonato amador valendo Pro Card e feira fitness. Datas, ingressos e programação em <a href="/blog/mr-olympia-brasil-2026">Mr. Olympia Brasil 2026</a>.</p>

<h2>Todas as categorias</h2>
<p>Os campeões de sexta e sábado estão reunidos em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>, incluindo a <a href="/blog/resultado-wellness-mr-olympia-2026">Wellness, com as brasileiras</a>.</p>

${ACOMPANHE("resultado-mr-olympia-open-2026")}

${CTA_MONTINHO}
${FONTES}`,
    faq: [
      { question: "Quem ganhou o Open do Mr. Olympia 2026?", answer: "Nick Walker, dos Estados Unidos, na final de sábado, 26 de setembro, em Las Vegas. É o primeiro título dele no Mr. Olympia." },
      { question: "Quem é Nick Walker?", answer: "Fisiculturista norte-americano apelidado de The Mutant. Venceu o Arnold Classic de 2021, foi 3º no Mr. Olympia de 2022 e 6º em 2025, e conquistou o título do Mr. Olympia em 2026." },
      { question: "Quem ficou no top 5 do Mr. Olympia 2026?", answer: "Nick Walker (1º), Samson Dauda (2º), Derek Lunsford (3º), Andrew Jacked (4º) e Tonio Burton (5º)." },
      { question: "Derek Lunsford perdeu o título?", answer: "Sim. Campeão em 2023 e 2025, Lunsford terminou em 3º em 2026." },
      { question: "Hadi Choopan competiu no Olympia 2026?", answer: "Não. Vice em 2023, 2024 e 2025, ele anunciou a desistência em 26 de agosto de 2026 por problemas de visto." },
    ],
  },

  /* ───────────────── 6. EVERGREEN — PESO E ALTURA ───────────────── */
  {
    slug: "ramon-dino-peso-altura",
    title: "Quanto pesa Ramon Dino? Peso, altura e limite na Classic Physique",
    metaTitle: "Quanto Pesa Ramon Dino? Peso, Altura e Limite na Classic",
    metaDescription:
      "Ramon Dino tem 1,81 m e pesou 102,5 kg na pesagem do Olympia 2026, para um limite de 103 kg. Entenda como funciona o limite de peso por altura na Classic.",
    excerpt:
      "Ramon Dino tem 1,81 m e pesou 102,5 kg na pesagem do Mr. Olympia 2026, 500 g abaixo do limite de 103 kg. O que é esse limite, por que existe e como o peso muda ao longo do ano.",
    category: "Fisiculturismo",
    date: DATA,
    readTime: "5 min",
    author: AUTOR,
    tags: ["Ramon Dino", "peso", "altura", "Classic Physique", "limite de peso"],
    content: `<p><strong>Ramon Dino tem 1,81 m de altura e pesou 102,5 kg na pesagem oficial do Mr. Olympia 2026</strong>, realizada em 23 de setembro de 2026 em Las Vegas — 500 gramas abaixo do limite de <strong>103 kg</strong> que a IFBB Pro League permite para a altura dele na Classic Physique. Esse é o peso que vale: o de palco, medido na véspera da competição.</p>
${CAPA("ramon-dino-peso-altura", "Capa: quanto pesa Ramon Dino — 102,5 kg na pesagem do Mr. Olympia 2026, limite de 103 kg na Classic Physique para 1,81 m de altura")}

<table><thead><tr><th>Dado</th><th>Valor</th><th>Referência</th></tr></thead><tbody>
<tr><td>Nome completo</td><td>Ramon Rocha Queiroz</td><td>—</td></tr>
<tr><td>Nascimento</td><td>9 de fevereiro de 1995, Rio Branco (AC) — 31 anos</td><td>—</td></tr>
<tr><td>Altura</td><td>1,81 m</td><td>—</td></tr>
<tr><td>Peso na pesagem do Olympia 2026</td><td>102,5 kg</td><td>23/09/2026</td></tr>
<tr><td>Limite para 1,81 m na Classic Physique</td><td>103 kg (227 lb)</td><td>IFBB Pro League</td></tr>
<tr><td>Categoria</td><td>Classic Physique</td><td>—</td></tr>
<tr><td>Principais resultados</td><td>Mr. Olympia Classic Physique 2025 (campeão); Arnold Classic Ohio 2023 (campeão) e 2024 (vice, atrás de Wesley Vissers)</td><td>—</td></tr>
</tbody></table>

<h2>Peso de palco não é peso do ano inteiro</h2>
<p>Os 102,5 kg são o peso do dia da pesagem, depois de meses de preparação e da fase final de perda de água e gordura. Fora de temporada, o peso de um atleta de Classic Physique costuma ficar vários quilos acima, porque o objetivo do off-season é construir músculo, não estar definido. Por isso todo número sobre "quanto pesa Ramon Dino" precisa vir com a data: o peso de junho e o de setembro são de fases diferentes da mesma preparação. Quando a imprensa cita 103 kg "em temporada de competição", está falando do teto que ele mira na pesagem.</p>

<h2>O que é o limite de peso da Classic Physique</h2>
<p>A Classic Physique é a categoria criada pela IFBB Pro League em 2016 para premiar o físico "clássico": cintura fina, ombros largos, linhas e proporção, em vez da massa máxima do Open. Para impedir que ela virasse um Open menor, existe um <strong>teto de peso por faixa de altura</strong>: quanto mais alto o atleta, mais peso pode levar ao palco. Quem passa do limite na pesagem não compete.</p>
<p>A tabela oficial é da IFBB Pro League e foi revisada em 2025, com limites maiores em várias faixas. Para a altura de Ramon Dino, 1,81 m, o teto é 103 kg (227 lb). A tabela completa, faixa por faixa, está nas <a href="https://www.ifbbpro.com/rules/" target="_blank" rel="noopener noreferrer">regras oficiais da IFBB Pro League</a>; não reproduzimos os outros valores aqui porque eles mudam entre temporadas e o número certo é sempre o do documento vigente.</p>

<h2>Qual seria seu limite na Classic Physique?</h2>
<p>Digite sua altura para descobrir em qual faixa da tabela profissional você entraria. A <a href="/ferramentas/calculadora-peso-classic-physique">calculadora de peso da Classic Physique</a> também tem a tabela oficial completa e aceita pés e polegadas.</p>
<!--CALCULADORA_CLASSIC:completa-->

<h2>Por que altura e peso andam juntos</h2>
<p>Dois atletas com a mesma massa muscular e alturas diferentes têm visuais diferentes: no mais alto, o mesmo músculo se distribui por mais osso e parece menor. O limite por altura tenta manter a comparação justa e, principalmente, manter a proposta estética da categoria. É o mesmo raciocínio que faz a Classic ser julgada com poses clássicas (como a vacuum pose) que o Open não exige.</p>
<p>Isso tem uma consequência prática que os fãs discutem todo ano: um atleta próximo do teto da própria altura, como Ramon, precisa escolher entre mais músculo e mais definição, porque não pode ter os dois além do limite. O <a href="/blog/resultado-classic-physique-mr-olympia-2026">resultado da Classic Physique do Olympia 2026</a> mostra como essa escolha se traduz no palco.</p>

<h2>Ramon Dino no Olympia, ano a ano</h2>
<table><thead><tr><th>Ano</th><th>Colocação na Classic Physique</th></tr></thead><tbody>
<tr><td>2021</td><td>5º</td></tr>
<tr><td>2022</td><td>2º</td></tr>
<tr><td>2023</td><td>2º</td></tr>
<tr><td>2024</td><td>4º</td></tr>
<tr><td>2025</td><td><strong>1º</strong> — primeiro brasileiro campeão do Mr. Olympia</td></tr>
<tr><td>2026</td><td>3º — título para Niall Darwen (Reino Unido)</td></tr>
</tbody></table>
<p>Os vices de 2022 e 2023 foram atrás de Chris Bumstead, que venceu seis vezes seguidas (2019–2024) e se aposentou no palco em 2024. Horários e transmissão de 2026: <a href="/blog/ramon-dino-mr-olympia-2026-horario">que horas Ramon Dino compete</a>.</p>

<h2>O que isso ensina para quem treina sem palco</h2>
<p>Se a pergunta que ficou é "quanto tempo eu levaria para chegar perto disso?", o <a href="/ferramentas/quanto-tempo-para-ter-shape?ref=classic">simulador de quanto tempo para ter shape</a> mostra o seu estágio hoje e o caminho provável dos próximos anos, com a Classic Physique como referência de escala.</p>
<p>Ramon compete com um limite de peso e mesmo assim precisa parecer maior a cada ano. A resposta não é "mais peso": é mais músculo no mesmo peso, com menos gordura e melhor distribuição. Para quem treina em academia comum, a lição é a mesma: a balança sozinha diz pouco; o que muda o corpo é a composição. Se você quer saber quanto músculo o seu corpo comporta sem hormônios, a <a href="/ferramentas/potencial-natural">Calculadora de Potencial Natural</a> estima isso pela altura e pela estrutura, e o artigo sobre <a href="/blog/quanto-tempo-para-ganhar-massa-muscular">quanto tempo leva para ganhar massa muscular</a> mostra o ritmo realista.</p>

${ACOMPANHE("ramon-dino-peso-altura")}

${CTA_FASES}
${FONTES}`,
    faq: [
      { question: "Quanto pesa Ramon Dino?", answer: "Na pesagem oficial do Mr. Olympia 2026, em 23 de setembro, 102,5 kg. Fora de temporada o peso é maior, por isso todo número vem com a data." },
      { question: "Qual é a altura de Ramon Dino?", answer: "1,81 m. Para essa altura, o limite de peso da Classic Physique na IFBB Pro League é 103 kg (227 libras)." },
      { question: "Qual é o limite de peso da Classic Physique?", answer: "Depende da altura: a IFBB Pro League define um peso máximo para cada faixa, revisado em 2025. Para 1,81 m, o teto é 103 kg. A tabela completa está nas regras oficiais da liga." },
      { question: "Por que existe limite de peso na Classic Physique?", answer: "Para preservar a proposta da categoria — proporção, cintura fina e linhas clássicas — e manter a comparação justa entre alturas diferentes. Sem o limite, ela viraria um Open menor." },
      { question: "Ramon Dino já foi campeão do Mr. Olympia?", answer: "Sim, em 2025, na Classic Physique, o primeiro brasileiro a vencer o Olympia. Antes foi vice em 2022 e 2023, quarto em 2024 e quinto em 2021." },
    ],
  },
  /* ───────────────── 7. RESULTADO 212 ───────────────── */
  {
    slug: "resultado-212-mr-olympia-2026",
    title: "Keone Pearson é tetracampeão da 212 no Mr. Olympia 2026; Lucas Garcia é vice",
    metaTitle: "Resultado 212 Olympia 2026: Keone Pearson Tetra; Lucas Garcia Vice",
    metaDescription:
      "Keone Pearson venceu a 212 do Mr. Olympia 2026, o 4º título seguido. O brasileiro Lucas Garcia foi vice e Vitor Porto ficou em 4º. Veja o top 5.",
    excerpt:
      "Keone Pearson venceu a 212 do Mr. Olympia 2026 e chegou ao quarto título seguido. Lucas Garcia foi vice-campeão e Vitor Porto terminou em 4º.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-26",
    readTime: "3 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "212", "Lucas Garcia", "resultado", "fisiculturismo"],
    content: `<blockquote><p><strong>Resultado oficial.</strong> Última verificação: 26 de setembro de 2026, 2h (Brasília).</p></blockquote>
<p><strong>Keone Pearson (EUA) venceu a 212 do Mr. Olympia 2026</strong>, na noite de sexta-feira, 25 de setembro, em Las Vegas, e chegou ao quarto título seguido. O brasileiro <strong>Lucas Garcia foi vice-campeão</strong>, subindo um degrau em relação a 2025, e <strong>Vitor Porto terminou em 4º</strong>. Shaun Clarida ficou em 3º e Nihat Kaya em 5º.</p>
${CAPA("resultado-212-mr-olympia-2026", "Capa: Keone Pearson é tetracampeão da 212 no Mr. Olympia 2026; o brasileiro Lucas Garcia é vice, Shaun Clarida é 3º e Vitor Porto 4º")}

<h2 id="resultado">Resultado 212 Olympia 2026</h2>
<table><thead><tr><th>Posição</th><th>Atleta</th><th>País</th></tr></thead><tbody><tr><td>1º</td><td>Keone Pearson</td><td>EUA</td></tr><tr><td>2º</td><td>Lucas Garcia</td><td>Brasil</td></tr><tr><td>3º</td><td>Shaun Clarida</td><td>EUA</td></tr><tr><td>4º</td><td>Vitor Porto</td><td>Brasil</td></tr><tr><td>5º</td><td>Nihat Kaya</td><td>Turquia</td></tr></tbody></table>
<p><em>Top 5 confirmado por Fitness Volt e NSC Total; campeão também pela CNN Brasil. Do 6º lugar em diante, a classificação entra quando for publicada.</em></p>

<h2>Como ficaram os brasileiros na 212?</h2>
<table><thead><tr><th>Atleta</th><th>Resultado</th><th>Status</th></tr></thead><tbody>
<tr><td>Lucas Garcia</td><td>2º lugar</td><td>Resultado oficial</td></tr>
<tr><td>Vitor Porto</td><td>4º lugar</td><td>Resultado oficial</td></tr>
<tr><td>Felipe Moraes</td><td>A confirmar</td><td>Competiu</td></tr>
<tr><td>Andrey Pereira</td><td>A confirmar</td><td>Competiu</td></tr>
</tbody></table>
<p>Os quatro aparecem no roster oficial da IFBB Pro League representando o Brasil (Vitor Porto está inscrito como Vitor Alves Porto de Oliveira). Como foram os brasileiros das outras categorias: <a href="/blog/brasileiros-mr-olympia-2026">brasileiros no Mr. Olympia 2026</a>.</p>

<h2>Em que posição Lucas Garcia ficou?</h2>
<p><strong>Lucas Garcia foi vice-campeão</strong>, o melhor resultado de um brasileiro na história da 212, igualando o 2º lugar de Eduardo Corrêa em 2014. Levou US$ 20 mil. Paulista, ele chegou como o brasileiro mais bem colocado da categoria: em 2025, na estreia no Olympia, terminou em <strong>terceiro</strong>, atrás de Keone Pearson e Shaun Clarida, com Nihat Kaya (Turquia) em quarto e Courage Opara (EUA) em quinto. Em 2026, subiu para o 2º lugar.</p>

<h2>Quem ganhou a 212 Olympia 2026?</h2>
<p><strong>Keone Pearson</strong>, que venceu o pose down final e chegou ao quarto título seguido (2023, 2024, 2025 e 2026). Os favoritos antes da final eram:</p>
<ul>
<li><strong>Keone Pearson (EUA)</strong> — campeão em 2023, 2024 e 2025, busca o quarto título seguido.</li>
<li><strong>Shaun Clarida (EUA)</strong> — ex-campeão da categoria e vice em 2025.</li>
<li><strong>Breon Ansley (EUA)</strong> — bicampeão da Classic Physique (2017 e 2018), estreia na 212 no Olympia. Se vencer, será o primeiro atleta com títulos do Olympia nas duas categorias.</li>
</ul>

<h2 id="como-foram-as-previas">Como foram as prévias?</h2>
<p>As prévias ainda não aconteceram. Depois delas, esta seção vai registrar quem foi chamado para as primeiras comparações. Chamado não é resultado: a IFBB Pro League não divulga notas das prévias, e a colocação só existe depois da final.</p>

<h2 id="horario">Que horas acontece a final da 212?</h2>
<ul>
<li><strong>Prévias:</strong> sexta, 25/09, bloco a partir das 13h30 de Brasília (9h30 em Las Vegas), com 212, Classic Physique, Figure, Women's Physique, Ms. Olympia e Wellness.</li>
<li><strong>Final:</strong> sexta, 25/09, sessão a partir das 22h de Brasília (18h em Las Vegas).</li>
</ul>
<p>Esses são os horários de início de cada bloco, não o minuto exato em que a 212 sobe ao palco.</p>

<h2>Onde assistir?</h2>
<p>Pela OlympiaTV, transmissão oficial, gratuita com cadastro no site do evento. No Brasil, canais no YouTube fazem cobertura com comentários em português.</p>

<h2>O que significa 212 no fisiculturismo?</h2>
<p>É o fisiculturismo tradicional com teto de peso: 212 libras, cerca de 96,2 kg, na pesagem oficial. Os critérios são os do Open (massa, densidade, condicionamento, simetria), mas só compete quem está dentro do limite, o que favorece atletas mais baixos. Diferente da Classic Physique, o peso máximo não depende da altura: é o mesmo para todos.</p>

<h2>Quanto tempo para construir um shape grande?</h2>
<p>Use seus dados para comparar o seu nível atual com uma referência de muscularidade da 212 e ver o caminho provável dos próximos anos. O simulador mostra estágios e faixas — e diz com honestidade quando uma referência profissional não cabe num prazo.</p>
<!--SHAPE:212-->

<h2>As outras categorias</h2>
<p>Na mesma noite saíram os resultados da <a href="/blog/resultado-classic-physique-mr-olympia-2026">Classic Physique, com Ramon Dino em 3º</a>, e da <a href="/blog/resultado-wellness-mr-olympia-2026">Wellness</a>. O Open foi decidido no sábado (<a href="/blog/resultado-mr-olympia-open-2026">Nick Walker campeão</a>), e todos os campeões estão em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-212-mr-olympia-2026")}

${CTA_MASSA}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a 212 do Mr. Olympia 2026?", answer: "Keone Pearson (EUA), que chegou ao quarto título seguido na categoria." },
      { question: "Em que posição Lucas Garcia ficou na 212?", answer: "Em segundo: Lucas Garcia foi vice-campeão da 212 no Mr. Olympia 2026, atrás de Keone Pearson. Em 2025, na estreia, tinha ficado em terceiro." },
      { question: "Quantos brasileiros competem na 212 do Olympia 2026?", answer: "Quatro, pelo roster oficial da IFBB Pro League: Lucas Garcia, Vitor Porto, Felipe Moraes e Andrey Pereira." },
      { question: "Qual é o limite de peso da 212?", answer: "212 libras, cerca de 96,2 kg, na pesagem oficial, para qualquer altura." },
    ],
  },
  /* ───────────────── 8. RESULTADO WOMEN'S PHYSIQUE ───────────────── */
  {
    slug: "resultado-womens-physique-olympia-2026",
    title: "Natália Coelho é tricampeã da Women's Physique no Olympia 2026; Zama Benta é vice",
    metaTitle: "Natália Coelho é Tricampeã da Women's Physique no Olympia 2026",
    metaDescription:
      "Natália Coelho venceu a Women's Physique do Mr. Olympia 2026, o terceiro título dela. A brasileira Zama Benta foi vice e Sarah Villegas ficou em 3º.",
    excerpt:
      "Natália Coelho venceu a Women's Physique do Mr. Olympia 2026 e chegou ao terceiro título. Zama Benta, brasileira, foi vice; Sarah Villegas terminou em 3º.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-26",
    readTime: "3 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Women's Physique", "Natália Coelho", "resultado", "fisiculturismo"],
    content: `<blockquote><p><strong>Resultado oficial.</strong> Última verificação: 26 de setembro de 2026, 0h (Brasília).</p></blockquote>
<p><strong>Natália Coelho venceu a Women's Physique do Mr. Olympia 2026</strong>, na noite de sexta-feira, 25 de setembro, em Las Vegas, e chegou ao terceiro título na categoria (2022, 2025 e 2026). A brasileira <strong>Zama Benta foi vice-campeã</strong>, e Sarah Villegas terminou em terceiro.</p>
${CAPA("resultado-womens-physique-olympia-2026", "Capa: Natália Coelho é tricampeã da Women's Physique no Mr. Olympia 2026; Zama Benta é vice e Sarah Villegas fica em terceiro")}

<h2 id="resultado">Resultado Women's Physique Olympia 2026</h2>
<table><thead><tr><th>Posição</th><th>Atleta</th><th>País (roster)</th></tr></thead><tbody><tr><td>1º</td><td>Natalia Abraham Coelho</td><td>EUA</td></tr><tr><td>2º</td><td>Zama Benta</td><td>Brasil</td></tr><tr><td>3º</td><td>Sarah Villegas</td><td>EUA</td></tr><tr><td>4º</td><td>A confirmar</td><td>—</td></tr><tr><td>5º</td><td>A confirmar</td><td>—</td></tr></tbody></table>
<p><em>Top 3 confirmado por CNN Brasil, NSC Total, Fitness Volt e Generation Iron. As demais posições entram quando a classificação completa for publicada.</em></p>

<h2>Em que posição Natália Coelho ficou?</h2>
<p><strong>Natália Coelho foi campeã.</strong> É o terceiro título dela na Women's Physique, depois de 2022 e 2025. Levou o prêmio de US$ 50 mil. Brasileira, ela aparece no roster oficial da IFBB Pro League <strong>representando os Estados Unidos</strong>, onde vive e compete. Por isso a tabela oficial mostra "EUA" ao lado do nome dela. A colocação de 2026 entra aqui logo após a final.</p>

<h2>Como ficaram Zama Benta e as brasileiras?</h2>
<table><thead><tr><th>Atleta</th><th>Representação no roster</th><th>Resultado</th><th>Status</th></tr></thead><tbody>
<tr><td>Natália Coelho</td><td>EUA</td><td>1º lugar</td><td>Resultado oficial</td></tr>
<tr><td>Zama Benta</td><td>Brasil</td><td>2º lugar</td><td>Resultado oficial</td></tr>
<tr><td>Jessica Macedo</td><td>Brasil</td><td>A confirmar</td><td>Competiu</td></tr>
<tr><td>Naiana Nana</td><td>Brasil</td><td>A confirmar</td><td>Competiu</td></tr>
<tr><td>Amanda de Carvalho Machado</td><td>EUA</td><td>A confirmar</td><td>Competiu</td></tr>
</tbody></table>
<p>A imprensa brasileira conta cinco brasileiras na categoria. No roster oficial, três estão listadas pelo Brasil e duas pelos EUA. A coluna "representação" mostra o país que a IFBB Pro League exibe, não a nacionalidade. <strong>Zama Benta</strong>, terceira em 2025, subiu para <strong>vice-campeã</strong> em 2026: dobradinha brasileira no pódio. Os brasileiros de todas as categorias estão no <a href="/blog/brasileiros-mr-olympia-2026">painel Brasil do Olympia</a>.</p>

<h2>Top 5 Women's Physique</h2>
<p>Pódio oficial: 1º Natália Coelho, 2º Zama Benta, 3º Sarah Villegas. O 4º e o 5º lugares entram quando a classificação completa for publicada.</p>

<h2 id="como-foram-as-previas">Como foram as prévias?</h2>
<p>As prévias foram na tarde de sexta-feira e a final à noite, na Orleans Arena. A disputa chegou cercada de tensão entre Natália e Sarah Villegas, que tinha feito acusações públicas contra a rival antes do evento; o resultado foi decidido pelos árbitros, no palco.</p>

<h2 id="horario">Horário da final</h2>
<ul>
<li><strong>Prévias:</strong> sexta, 25/09, bloco a partir das 13h30 de Brasília (9h30 em Las Vegas), com Women's Physique, 212, Classic Physique, Figure, Ms. Olympia e Wellness.</li>
<li><strong>Final:</strong> sexta, 25/09, sessão a partir das 22h de Brasília (18h em Las Vegas).</li>
</ul>
<p>São os horários de início de cada bloco, não o minuto em que a categoria sobe ao palco.</p>

<h2>Onde assistir</h2>
<p>Pela OlympiaTV, transmissão oficial, gratuita com cadastro no site do evento.</p>

<h2>O que é Women's Physique?</h2>
<p>É a categoria feminina entre a Figure e o fisiculturismo (Ms. Olympia): pede mais massa muscular e separação que a Figure, mas com ênfase em proporção, linhas e apresentação, sem o volume extremo do bodybuilding. As atletas fazem poses obrigatórias e uma rotina livre de posing.</p>

<h2>As outras categorias</h2>
<p>Na mesma noite saem a <a href="/blog/resultado-wellness-mr-olympia-2026">Wellness, com as brasileiras</a>, a <a href="/blog/resultado-212-mr-olympia-2026">212</a> e a <a href="/blog/resultado-classic-physique-mr-olympia-2026">Classic Physique</a>. Todas as campeãs e campeões ficam em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-womens-physique-olympia-2026")}

${CTA_MONTINHO}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Women's Physique do Olympia 2026?", answer: "Natália Coelho, que chegou ao terceiro título na categoria (2022, 2025 e 2026). A brasileira Zama Benta foi vice e Sarah Villegas terminou em terceiro." },
      { question: "Em que posição Natália Coelho ficou?", answer: "Em primeiro. Natália Coelho venceu a Women's Physique do Mr. Olympia 2026, o terceiro título dela." },
      { question: "Natália Coelho compete pelo Brasil?", answer: "Natália é brasileira, mas aparece no roster oficial da IFBB Pro League representando os Estados Unidos, onde vive e compete." },
      { question: "Quantas brasileiras competem na Women's Physique 2026?", answer: "Cinco pela contagem da imprensa brasileira: Natália Coelho, Zama Benta, Jessica Macedo, Naiana Nana e Amanda de Carvalho Machado. No roster oficial, três aparecem pelo Brasil e duas pelos EUA." },
    ],
  },
  /* ───────────────── 9. HUB BRASIL ───────────────── */
  {
    slug: "brasileiros-mr-olympia-2026",
    title: "Brasileiros no Mr. Olympia 2026: atletas, horários e resultados",
    metaTitle: "Brasileiros no Mr. Olympia 2026: Atletas e Resultados",
    metaDescription:
      "Como terminaram os brasileiros no Mr. Olympia 2026: Eduarda Bezerra bicampeã, Lucas Garcia, Zama Benta, Isa Nunes e Gabriela Queiroz vices, Ramon Dino 3º.",
    excerpt:
      "Painel dos brasileiros no Mr. Olympia 2026: quem competiu, em que categoria, por qual país no roster e como terminou cada um.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-27",
    readTime: "5 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "brasileiros", "Ramon Dino", "resultados", "fisiculturismo"],
    content: `<blockquote><p><strong>O Mr. Olympia 2026 terminou.</strong> Os resultados abaixo são os oficiais confirmados por duas fontes; as posições ainda sem confirmação estão marcadas. Última verificação: 27 de setembro de 2026, 11h (Brasília).</p></blockquote>
<p><strong>O Brasil saiu do Mr. Olympia 2026 com um título e quatro vice-campeonatos.</strong> <strong>Eduarda Bezerra</strong> foi bicampeã da Wellness, com <strong>Isa Pereira Nunes</strong> em 2º. <strong>Lucas Garcia</strong> foi vice na 212, <strong>Zama Benta</strong> na Women's Physique e <strong>Gabriela Queiroz</strong> (pelos EUA) na estreia da Fit Model. <strong>Ramon Dino</strong> perdeu o título da Classic Physique e ficou em 3º, mesma posição de <strong>Leyvina Barros</strong> na Ms. Olympia. Natália Coelho, brasileira que compete pelos EUA, foi tricampeã da Women's Physique.</p>
<h2>Os brasileiros no Mr. Olympia 2026</h2>
<p>As provas foram na sexta (25) e no sábado (26), com prévias às 13h30 e finais a partir das 22h e das 23h, horário de Brasília. Uma categoria só aparece como finalizada com resultado oficial.</p>
<!--OLYMPIA_CONTAGEM:brasil-->
${CAPA("brasileiros-mr-olympia-2026", "Capa: brasileiros no Mr. Olympia 2026 — painel com atletas, categorias, horários de Brasília e resultados de sexta e sábado")}

<h2>Painel Brasil no Mr. Olympia 2026</h2>
<p>Filtre por dia, categoria ou nome. "Roster" é o país que a IFBB Pro League mostra ao lado do atleta.</p>
<!--PAINEL_BRASIL:olympia-->

<h2 id="resultados-brasileiros">Resultados dos brasileiros no Mr. Olympia 2026</h2>
${TABELA_BRASIL}
<p><em>A coluna "Resultado" só é preenchida com a classificação oficial. Wellness: estão aqui as brasileiras de destaque; a lista completa da categoria fica em <a href="/blog/resultado-wellness-mr-olympia-2026">resultado da Wellness 2026</a>.</em></p>

<h2>Quantos brasileiros competiram?</h2>
<p>Depende de quem conta. As listas publicadas variam, e por isso não usamos um número fechado: a CNN Brasil falou em 58 classificados, o NSC Total em 57, e a Folha chegou a contar 60 no início de setembro. A diferença vem do critério: há quem conte todos os classificados, quem conte só os confirmados e quem inclua brasileiros que competem por outra bandeira.</p>
<p><strong>O nosso critério:</strong> entra no painel quem está no roster atual da IFBB Pro League e não foi reportado fora do evento. Brasileiros que aparecem por outro país, como Natália Coelho (EUA) e Mauro Fialho (Espanha), entram com a representação oficial indicada. Classificados que não viajaram ficam na lista abaixo.</p>

<h2>Brasileiros que ficaram fora</h2>
<p>Pelo menos sete brasileiros classificados não competiram, segundo CNN Brasil e O Povo, a maioria por visto americano negado:</p>
<ul>${FORA_DO_EVENTO.map((f) => `<li><strong>${f.nome}</strong> (${f.categoria}) — ${f.motivo}</li>`).join("")}</ul>

<h2>Os brasileiros de sexta-feira</h2>
<p>Prévias a partir das 13h30 e finais a partir das 22h (Brasília).</p>
<h3>Classic Physique</h3>
<p>Ramon Dino, campeão de 2025, ficou em 3º; o título foi para Niall Darwen (Reino Unido). Também competiram César Falcão, Fábio Júnio, Gabriel Zancanelli e Matheus Menegate. <a href="/blog/resultado-classic-physique-mr-olympia-2026">Resultado da Classic Physique e a colocação de Ramon</a>.</p>
<h3>212</h3>
<p>Lucas Garcia foi vice, atrás de Keone Pearson, e Vitor Porto ficou em 4º. Também competiram Felipe Moraes e Andrey Pereira. <a href="/blog/resultado-212-mr-olympia-2026">Como ficou Lucas Garcia na 212</a>.</p>
<h3>Wellness</h3>
<p>A categoria em que o Brasil venceu todas as edições tem a maior delegação brasileira. Eduarda Bezerra é bicampeã e Isa Pereira Nunes ficou em 2º: dobradinha brasileira. <a href="/blog/resultado-wellness-mr-olympia-2026">Resultado da Wellness e a lista das brasileiras</a>.</p>
<h3>Women's Physique</h3>
<p>Natália Coelho, brasileira que compete pelos EUA, foi tricampeã, e Zama Benta, pelo Brasil, ficou em 2º. <a href="/blog/resultado-womens-physique-olympia-2026">Posição de Natália Coelho e das brasileiras</a>.</p>
<h3>Ms. Olympia (Women's Bodybuilding)</h3>
<p>Leyvina Barros ficou em 3º; Andrea Shaw venceu. Barbara Moojen também competiu. Sem página própria: o resultado está neste painel e em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

<h2>Os brasileiros de sábado</h2>
<p>Prévias a partir das 13h30 e finais a partir das 23h (Brasília).</p>
<h3>Open</h3>
<p>Leandro Peres foi o único brasileiro na categoria principal, vencida por Nick Walker; a colocação dele entra quando confirmada. <a href="/blog/resultado-mr-olympia-open-2026">Resultado do Open e o campeão</a>.</p>
<h3>Men's Physique</h3>
<p>Ryan Terry foi tetracampeão. Nove brasileiros estavam no roster pelo Brasil, entre eles Edvan Palmeira e Vitor Chaves, além de Mauro Fialho, listado pela Espanha; as colocações entram quando confirmadas. <a href="/blog/resultado-mens-physique-olympia-2026">Posição de Edvan Palmeira e dos brasileiros</a>.</p>
<h3>Bikini</h3>
<p>Jasmine Gonzalez venceu. Elisa Pecini (Isa Pecini), campeã em 2019, Nivea Campos e Bruna Toigo competiram; as colocações entram quando confirmadas. <a href="/blog/resultado-bikini-olympia-2026">Como ficou Isa Pecini na Bikini</a>.</p>
<h3>Fit Model</h3>
<p>Gabriela Queiroz, brasileira que compete pelos EUA, foi vice na estreia da categoria, atrás de Shealynn Burnett. <a href="/blog/resultado-fit-model-olympia-2026">Em que posição Gabriela Queiroz ficou</a>.</p>

<h2>Horários</h2>
<p>Os horários da Classic, com Ramon Dino, estão em <a href="/blog/ramon-dino-mr-olympia-2026-horario">que horas Ramon Dino competiu</a>.</p>

${ACOMPANHE("brasileiros-mr-olympia-2026")}

${CTA_MONTINHO}
${FONTES}`,
    faq: [
      { question: "Quantos brasileiros competem no Mr. Olympia 2026?", answer: "As contagens variam entre 57 e 60 conforme o critério: classificados, confirmados ou brasileiros por outra bandeira. Pelo menos sete classificados ficaram fora, a maioria por visto negado. O painel desta página lista quem está no roster atual." },
      { question: "Quais brasileiros competem na sexta-feira?", answer: "Classic Physique (Ramon Dino e outros quatro), 212 (Lucas Garcia e outros três), Wellness, Women's Physique (Natália Coelho, Zama Benta e outras) e Ms. Olympia (Leyvina Barros e Barbara Moojen). Prévias às 13h30 e finais a partir das 22h, horário de Brasília." },
      { question: "Quais brasileiros competem no sábado?", answer: "Open (Leandro Peres), Men's Physique (Edvan Palmeira, Vitor Chaves e outros), Bikini (Elisa Pecini, Nivea Campos e Bruna Toigo) e Fit Model (Gabriela Queiroz). Finais a partir das 23h de Brasília." },
      { question: "Natália Coelho compete pelo Brasil?", answer: "Ela é brasileira, mas aparece no roster oficial da IFBB Pro League representando os Estados Unidos." },
    ],
  },
  /* ───────────────── 10. RESULTADO MEN'S PHYSIQUE ───────────────── */
  {
    slug: "resultado-mens-physique-olympia-2026",
    title: "Resultado Men's Physique Olympia 2026: Ryan Terry tetracampeão",
    metaTitle: "Men's Physique Olympia 2026: Ryan Terry Tetracampeão",
    metaDescription:
      "Ryan Terry venceu a Men's Physique do Olympia 2026 e igualou o recorde de quatro títulos. A colocação de Edvan Palmeira e dos brasileiros entra quando confirmada.",
    excerpt:
      "Ryan Terry venceu a Men's Physique do Olympia 2026, o quarto título seguido, e igualou o recorde de Jeremy Buendia.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-27",
    readTime: "3 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Men's Physique", "Edvan Palmeira", "resultado", "fisiculturismo"],
    content: `<blockquote><p><strong>Resultado definido: Ryan Terry é tetracampeão da Men's Physique.</strong> As demais colocações, incluindo a de Edvan Palmeira, entram quando confirmadas por duas fontes. Última verificação: 27 de setembro de 2026, 3h30 (Brasília).</p></blockquote>
<p><strong>Ryan Terry (Reino Unido) venceu a Men's Physique do Olympia 2026</strong> na noite de sábado, 26 de setembro, em Las Vegas. É o quarto título seguido dele, o que iguala o recorde de Jeremy Buendia na categoria. <strong>Edvan Palmeira</strong>, quinto em 2025, era o brasileiro mais bem colocado no ano passado.</p>
<!--OLYMPIA_CONTAGEM:mens-physique-->
${CAPA("resultado-mens-physique-olympia-2026", "Capa: Ryan Terry tetracampeão da Men's Physique no Olympia 2026; colocação de Edvan Palmeira e dos brasileiros")}

<h2 id="resultado">Resultado Men's Physique Olympia 2026</h2>
<table><thead><tr><th>Posição</th><th>Atleta</th><th>País</th></tr></thead><tbody><tr><td>1º</td><td><strong>Ryan Terry</strong></td><td>Reino Unido</td></tr><tr><td>2º</td><td>A definir</td><td>—</td></tr><tr><td>3º</td><td>A definir</td><td>—</td></tr><tr><td>4º</td><td>A definir</td><td>—</td></tr><tr><td>5º</td><td>A definir</td><td>—</td></tr><tr><td>6º</td><td>A definir</td><td>—</td></tr><tr><td>7º</td><td>A definir</td><td>—</td></tr><tr><td>8º</td><td>A definir</td><td>—</td></tr><tr><td>9º</td><td>A definir</td><td>—</td></tr><tr><td>10º</td><td>A definir</td><td>—</td></tr></tbody></table>
<p><em>O campeão foi confirmado por duas fontes independentes; as outras posições entram quando também estiverem.</em></p>

<h2>Como ficaram os brasileiros?</h2>
<table><thead><tr><th>Atleta</th><th>Representação no roster</th><th>Resultado</th></tr></thead><tbody>
${ATLETAS_BRASIL.filter((x) => x.categoria === "mens-physique").map((x) => `<tr><td>${x.nome}</td><td>${x.representacao}</td><td>${x.resultado ?? "A definir"}</td></tr>`).join("")}
</tbody></table>
<p>Nove atletas aparecem no roster oficial representando o Brasil. <strong>Mauro Fialho</strong> é citado entre os brasileiros pela imprensa, mas está listado pela Espanha, e é assim que aparece na classificação oficial. Todos os brasileiros do fim de semana estão no <a href="/blog/brasileiros-mr-olympia-2026">painel dos brasileiros no Mr. Olympia 2026</a>.</p>

<h2>Em que posição Edvan Palmeira ficou?</h2>
<p><strong>A colocação de 2026 ainda não foi confirmada.</strong> O baiano Edvan Palmeira terminou em <strong>quinto</strong> em 2025, atrás de Ryan Terry, Ali Bilal, Brandon Hendrickson e Erin Banks. A posição dele entra aqui assim que houver duas fontes.</p>

<h2>Quem ganhou a Men's Physique?</h2>
<p><strong>Ryan Terry (Reino Unido)</strong>, pela quarta vez seguida, igualando o recorde de Jeremy Buendia. Antes da final, os nomes mais citados eram:</p>
<ul>
<li><strong>Ryan Terry (Reino Unido)</strong> — campeão em 2023, 2024 e 2025. Um quarto título igualaria o recorde de Jeremy Buendia.</li>
<li><strong>Ali Bilal (EUA)</strong> — vice em 2025.</li>
<li><strong>Brandon Hendrickson (EUA)</strong> — terceiro em 2025 e ex-campeão da categoria.</li>
<li><strong>Erin Banks (EUA)</strong> — campeão em 2022 e quarto em 2025.</li>
</ul>

<h2 id="horario">Horário da final</h2>
<ul>
<li><strong>Prévias:</strong> sábado, 26/09, bloco a partir das 13h30 de Brasília (9h30 em Las Vegas), com Men's Physique, Fitness, Bikini, Wheelchair e Fit Model.</li>
<li><strong>Final:</strong> sábado, 26/09, sessão a partir das 23h de Brasília (19h em Las Vegas), a mesma noite do Open.</li>
</ul>
<p>São os horários de início de cada bloco, não o minuto em que a categoria sobe ao palco.</p>

<h2>Onde assistir</h2>
<p>Pela OlympiaTV, transmissão oficial, gratuita com cadastro no site do evento.</p>

<h2>O que é Men's Physique?</h2>
<p>É a categoria masculina com bermuda de praia e sem poses de fisiculturismo: os juízes avaliam o físico de frente e de costas, com foco em ombros largos, cintura fina, abdômen definido e proporção. As pernas não entram no julgamento. É a categoria de entrada mais popular entre os homens.</p>

<h2>As outras categorias</h2>
<p>Na mesma noite foi decidido o <a href="/blog/resultado-mr-olympia-open-2026">Open: Nick Walker é o Mr. Olympia 2026</a>. Os campeões de todas as categorias estão em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-mens-physique-olympia-2026")}

${CTA_MASSA_PHYSIQUE}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Men's Physique do Olympia 2026?", answer: "Ryan Terry, do Reino Unido, na final de sábado, 26 de setembro. É o quarto título seguido dele, igualando o recorde de Jeremy Buendia." },
      { question: "Em que posição Edvan Palmeira ficou?", answer: "A colocação de 2026 ainda não foi confirmada por duas fontes. Em 2025, Edvan Palmeira ficou em quinto na Men's Physique." },
      { question: "Quantos brasileiros competem na Men's Physique 2026?", answer: "Nove atletas estão no roster oficial pelo Brasil. Mauro Fialho, citado entre os brasileiros, aparece pela Espanha." },
    ],
  },

  /* ───────────────── 11. RESULTADO BIKINI ───────────────── */
  {
    slug: "resultado-bikini-olympia-2026",
    title: "Resultado Bikini Olympia 2026: Jasmine Gonzalez é a campeã",
    metaTitle: "Bikini Olympia 2026: Jasmine Gonzalez Campeã",
    metaDescription:
      "Jasmine Gonzalez venceu a Bikini Olympia 2026, o primeiro título dela. As colocações de Isa Pecini, Nivea Campos e Bruna Toigo entram quando confirmadas.",
    excerpt:
      "Jasmine Gonzalez venceu a Bikini Olympia 2026 e conquistou o primeiro título. A campeã de 2025, Maureen Blanquisco, perdeu a coroa.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-27",
    readTime: "3 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Bikini", "Elisa Pecini", "resultado", "fisiculturismo"],
    content: `<blockquote><p><strong>Resultado definido: Jasmine Gonzalez é a campeã da Bikini Olympia 2026.</strong> As demais colocações, incluindo as das três brasileiras, entram quando confirmadas por duas fontes. Última verificação: 27 de setembro de 2026, 3h30 (Brasília).</p></blockquote>
<p><strong>Jasmine Gonzalez (EUA) venceu a Bikini Olympia 2026</strong> na noite de sábado, 26 de setembro, em Las Vegas, e conquistou o primeiro título dela. A campeã de 2025, Maureen Blanquisco (Filipinas), perdeu a coroa. O Brasil teve três atletas: <strong>Elisa Pecini</strong>, a Isa Pecini, campeã em 2019, <strong>Nivea Campos</strong> e <strong>Bruna Toigo</strong>.</p>
<!--OLYMPIA_CONTAGEM:bikini-->
${CAPA("resultado-bikini-olympia-2026", "Capa: Jasmine Gonzalez campeã da Bikini Olympia 2026; colocação de Elisa Pecini e das brasileiras")}

<h2 id="resultado">Resultado Bikini Olympia 2026</h2>
<table><thead><tr><th>Posição</th><th>Atleta</th><th>País</th></tr></thead><tbody><tr><td>1º</td><td><strong>Jasmine Gonzalez</strong></td><td>EUA</td></tr><tr><td>2º</td><td>A definir</td><td>—</td></tr><tr><td>3º</td><td>A definir</td><td>—</td></tr><tr><td>4º</td><td>A definir</td><td>—</td></tr><tr><td>5º</td><td>A definir</td><td>—</td></tr><tr><td>6º</td><td>A definir</td><td>—</td></tr><tr><td>7º</td><td>A definir</td><td>—</td></tr><tr><td>8º</td><td>A definir</td><td>—</td></tr><tr><td>9º</td><td>A definir</td><td>—</td></tr><tr><td>10º</td><td>A definir</td><td>—</td></tr></tbody></table>
<p><em>A campeã foi confirmada por duas fontes independentes; as outras posições entram quando também estiverem.</em></p>

<h2>Em que posição Elisa Pecini ficou?</h2>
<p><strong>A colocação de 2026 ainda não foi confirmada.</strong> Elisa Pecini, conhecida como Isa Pecini, venceu a Bikini Olympia em 2019 e tem vaga garantida por esse título. A posição dela entra aqui assim que houver duas fontes.</p>

<h2>Como ficaram as brasileiras?</h2>
<table><thead><tr><th>Atleta</th><th>Representação no roster</th><th>Resultado</th></tr></thead><tbody>
${ATLETAS_BRASIL.filter((x) => x.categoria === "bikini").map((x) => `<tr><td>${x.nome}</td><td>${x.representacao}</td><td>${x.resultado ?? "A definir"}</td></tr>`).join("")}
</tbody></table>
<p>As três aparecem no roster oficial representando o Brasil. Os brasileiros de todas as categorias estão no <a href="/blog/brasileiros-mr-olympia-2026">painel Brasil do Mr. Olympia 2026</a>.</p>

<h2>Quem ganhou a Bikini Olympia 2026?</h2>
<p><strong>Jasmine Gonzalez (EUA)</strong>, terceira colocada em 2025, conquistou o primeiro título dela. Em 2025, o pódio tinha sido Maureen Blanquisco, Ashlyn Little e Jasmine Gonzalez.</p>

<h2 id="horario">Horário da final</h2>
<ul>
<li><strong>Prévias:</strong> sábado, 26/09, bloco a partir das 13h30 de Brasília (9h30 em Las Vegas), com Bikini, Men's Physique, Fitness, Wheelchair e Fit Model.</li>
<li><strong>Final:</strong> sábado, 26/09, sessão a partir das 23h de Brasília (19h em Las Vegas).</li>
</ul>
<p>São os horários de início de cada bloco, não o minuto em que a categoria sobe ao palco.</p>

<h2>Onde assistir</h2>
<p>Pela OlympiaTV, transmissão oficial, gratuita com cadastro no site do evento.</p>

<h2>O que é Bikini no fisiculturismo?</h2>
<p>É a categoria feminina com ênfase em forma geral, equilíbrio entre parte superior e inferior, condicionamento leve e apresentação: postura, caminhada e confiança no palco contam. Não há poses de contração muscular como no fisiculturismo. A Fit Model, que estreia no Olympia neste ano, pede ainda menos massa e definição: veja a <a href="/blog/resultado-fit-model-olympia-2026">diferença entre Fit Model e Bikini</a>.</p>

<h2>As outras categorias</h2>
<p>Na mesma noite saíram a <a href="/blog/resultado-mens-physique-olympia-2026">Men's Physique</a> e o <a href="/blog/resultado-mr-olympia-open-2026">Open</a>. As campeãs e os campeões de todas as categorias estão em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-bikini-olympia-2026")}

${CTA_MONTINHO}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Bikini Olympia 2026?", answer: "Jasmine Gonzalez, dos Estados Unidos, na final de sábado, 26 de setembro. É o primeiro título dela na Bikini Olympia." },
      { question: "Isa Pecini ganhou a Bikini Olympia?", answer: "Em 2026, não: a campeã foi Jasmine Gonzalez, e a colocação de Isa Pecini entra aqui quando confirmada. Ela foi campeã da Bikini Olympia em 2019." },
      { question: "Quais brasileiras competem na Bikini Olympia 2026?", answer: "Elisa Pecini, Nivea Campos e Bruna Toigo, todas listadas pelo Brasil no roster oficial." },
    ],
  },
  /* ───────────────── 12. RESULTADO FIT MODEL ───────────────── */
  {
    slug: "resultado-fit-model-olympia-2026",
    title: "Resultado Fit Model Olympia 2026: Shealynn Burnett campeã, Gabriela Queiroz 2ª",
    metaTitle: "Fit Model Olympia 2026: Burnett Campeã, Gabriela Queiroz 2ª",
    metaDescription:
      "Shealynn Burnett é a primeira campeã da Fit Model Olympia. A brasileira Gabriela Queiroz ficou em 2º lugar na estreia da categoria, em 2026.",
    excerpt:
      "Shealynn Burnett venceu a primeira Fit Model da história do Olympia. A brasileira Gabriela Queiroz foi vice, e Jane Jones ficou em 3º.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    updatedAt: "2026-09-27",
    readTime: "4 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Fit Model", "Gabriela Queiroz", "resultado", "fisiculturismo"],
    content: `<blockquote><p><strong>Resultado definido: Shealynn Burnett é a primeira campeã da Fit Model Olympia; Gabriela Queiroz ficou em 2º.</strong> Última verificação: 27 de setembro de 2026, 11h (Brasília).</p></blockquote>
<p><strong>Shealynn Burnett venceu a Fit Model Olympia 2026</strong> no sábado, 26 de setembro, em Las Vegas, e se tornou a primeira campeã da história da categoria no Olympia. A brasileira <strong>Gabriela Queiroz</strong>, que compete representando os Estados Unidos, ficou em <strong>2º lugar</strong>, e <strong>Jane Jones</strong> completou o pódio.</p>
<!--OLYMPIA_CONTAGEM:fit-model-->
${CAPA("resultado-fit-model-olympia-2026", "Capa: Shealynn Burnett é a primeira campeã da Fit Model Olympia; a brasileira Gabriela Queiroz é vice")}

<h2 id="resultado">Resultado Fit Model Olympia 2026</h2>
<table><thead><tr><th>Posição</th><th>Atleta</th><th>Representação</th></tr></thead><tbody><tr><td>1º</td><td><strong>Shealynn Burnett</strong></td><td>—</td></tr><tr><td>2º</td><td>Gabriela Queiroz</td><td>EUA (brasileira)</td></tr><tr><td>3º</td><td>Jane Jones</td><td>—</td></tr><tr><td>4º</td><td>A confirmar</td><td>—</td></tr><tr><td>5º</td><td>A confirmar</td><td>—</td></tr></tbody></table>
<p><em>O pódio foi confirmado por duas fontes independentes. O 4º e o 5º lugares entram quando também estiverem.</em></p>

<h2 id="gabriela">Em que posição Gabriela Queiroz ficou no Olympia 2026?</h2>
<p><strong>Gabriela Queiroz ficou em 2º lugar</strong>, atrás apenas de Shealynn Burnett. A brasileira compete <strong>representando os Estados Unidos</strong>, por isso a classificação oficial mostra "EUA" ao lado do nome dela. Gabriela se classificou para o Olympia com o título do Wasatch Warrior Pro 2026 e chegou à estreia da categoria entre as vencedoras de shows profissionais da temporada.</p>
<p>Ela é a única brasileira na Fit Model. Os outros brasileiros do fim de semana estão no <a href="/blog/brasileiros-mr-olympia-2026">painel dos brasileiros no Mr. Olympia 2026</a>.</p>

<h2>Quem ganhou a Fit Model Olympia 2026?</h2>
<p><strong>Shealynn Burnett</strong>, a primeira campeã da história da categoria no Olympia. Como era a estreia, não havia campeã anterior para defender o título. Entraram as atletas que venceram shows profissionais da Fit Model na temporada (a categoria não usa sistema de pontos).</p>

<h2 id="horario">Quando foi a Fit Model?</h2>
<ul>
<li><strong>Sábado, 26 de setembro</strong>, na sessão de prévias do Olympia, que começa às <strong>13h30 de Brasília</strong> (9h30 em Las Vegas).</li>
<li>A Fit Model tem <strong>prévias e final na mesma sessão</strong>, junto com as prévias de Men's Physique, Bikini, Fitness e Wheelchair.</li>
</ul>
<p>O bloco começou às 13h30 de Brasília, e a Fit Model teve prévias e final durante essa sessão.</p>

<h2>O que é a categoria Fit Model?</h2>
<p>É a categoria feminina mais nova da IFBB Pro League: estreou no amador (NPC) em 2025 e chega ao profissional e ao Olympia em 2026. A proposta é premiar um físico atlético, equilibrado e proporcional, com o visual de uma modelo de fitness: tonificado, mas sem o volume muscular nem o nível de definição das outras categorias. Apresentação, postura e harmonia do conjunto pesam tanto quanto o músculo.</p>

<h2>Fit Model x Bikini: qual a diferença?</h2>
<table><thead><tr><th>Critério</th><th>Fit Model</th><th>Bikini</th></tr></thead><tbody>
<tr><td>Massa muscular (pernas, glúteos, braços, ombros)</td><td>Menor</td><td>Maior</td></tr>
<tr><td>Condicionamento (definição)</td><td>Menor, "de capa de revista"</td><td>Maior</td></tr>
<tr><td>Proposta</td><td>Físico equilibrado e atlético de modelo fitness</td><td>Forma, curvas e apresentação com mais desenvolvimento</td></tr>
<tr><td>No Olympia</td><td>Estreia em 2026</td><td>Categoria tradicional (<a href="/blog/resultado-bikini-olympia-2026">resultado da Bikini 2026</a>)</td></tr>
</tbody></table>
<p><em>Com base nas regras da divisão publicadas pela NPC (NPC News Online), que servem de referência para a IFBB Pro League.</em></p>

<h2>As outras categorias</h2>
<p>Na noite de sábado saíram a <a href="/blog/resultado-bikini-olympia-2026">Bikini</a>, a Men's Physique e o Open. Todas as campeãs e campeões estão em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-fit-model-olympia-2026")}

${CTA_ROTINA}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Fit Model Olympia 2026?", answer: "Shealynn Burnett, a primeira campeã da história da Fit Model no Olympia, no sábado, 26 de setembro, em Las Vegas." },
      { question: "Em que posição Gabriela Queiroz ficou?", answer: "Em 2º lugar. A brasileira compete representando os Estados Unidos e chegou ao Olympia como campeã do Wasatch Warrior Pro 2026." },
      { question: "Quem completou o pódio da Fit Model?", answer: "Shealynn Burnett (1º), Gabriela Queiroz (2º) e Jane Jones (3º)." },
      { question: "Qual a diferença entre Fit Model e Bikini?", answer: "A Fit Model pede menos massa muscular e menos definição que a Bikini, com foco num físico equilibrado e atlético de modelo fitness." },
    ],
  },
];
