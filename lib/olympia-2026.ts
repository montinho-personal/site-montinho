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
    title: "Resultado Classic Physique Mr. Olympia 2026: classificação completa e Ramon Dino",
    metaTitle: "Resultado Classic Physique Olympia 2026: Ramon Dino e Top 5",
    metaDescription:
      "Classificação completa da Classic Physique do Mr. Olympia 2026 e a colocação de Ramon Dino. Página atualizada com prévias e final desta sexta, 25/09.",
    excerpt:
      "A Classic Physique do Mr. Olympia 2026 acontece nesta sexta-feira, 25 de setembro, em Las Vegas. O resultado e a colocação de Ramon Dino são atualizados aqui assim que saem.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "4 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Classic Physique", "Ramon Dino", "resultado", "fisiculturismo"],
    content: `${AVISO_ANTES("O resultado da Classic Physique do Mr. Olympia 2026 ainda não foi definido.")}
<p>A Classic Physique do Mr. Olympia 2026 acontece <strong>nesta sexta-feira, 25 de setembro</strong>, em Las Vegas: prévias a partir das <strong>13h30 (horário de Brasília)</strong> e final a partir das <strong>22h</strong>. Ramon Dino defende o título conquistado em 2025, quando se tornou o primeiro brasileiro campeão do Mr. Olympia. A classificação completa entra aqui assim que a IFBB Pro League divulgar o resultado oficial.</p>
${CAPA("resultado-classic-physique-mr-olympia-2026", "Capa: Mr. Olympia 2026, Classic Physique — Ramon Dino defende o título; classificação completa e top 5, final na sexta às 22h de Brasília")}

<h2>Classificação da Classic Physique 2026</h2>
${TABELA_PENDENTE(5)}
<p><em>Tabela preenchida após a final oficial. Enquanto isso, veja <a href="/blog/ramon-dino-mr-olympia-2026-horario">que horas Ramon Dino compete e onde assistir</a>.</em></p>

<h2>Ramon Dino: em que posição ficou?</h2>
<p><strong>Ainda não há resultado.</strong> Ramon Dino (Brasil) passou na pesagem oficial da IFBB Pro League na quarta-feira, 23 de setembro, abaixo do limite de peso da altura dele, e chega como atual campeão: em 2025 venceu a categoria à frente de Mike Sommerfeld (Alemanha) e Terrence Ruffin (EUA), na primeira edição sem Chris Bumstead, que se aposentou após o sexto título em 2024. Os números do atleta estão em <a href="/blog/ramon-dino-peso-altura">quanto pesa Ramon Dino: peso, altura e limite da Classic</a>.</p>

<h2>Quem disputa o título com Ramon Dino</h2>
<p>Pelas escalações divulgadas e pelos resultados da temporada, os nomes mais citados para o primeiro chamado são:</p>
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

<h2>Como funciona a decisão: prévias e final</h2>
<p>Na <strong>prévia (prejudging)</strong>, os juízes comparam os atletas em grupos, nas poses obrigatórias, e é ali que a maior parte da nota se forma. Na <strong>final</strong>, cada um faz a rotina de posing e há novas comparações; o resultado é anunciado no palco. Por isso o "quem ganhou" só existe depois da final, na noite de sexta no horário de Brasília. Detalhes do formato e da regra de peso: <a href="/blog/ramon-dino-peso-altura">limite de peso da Classic Physique</a>.</p>

<h2>As outras categorias</h2>
<p>Na mesma noite são decididas Wellness (<a href="/blog/resultado-wellness-mr-olympia-2026">resultado da Wellness 2026</a>), 212 (<a href="/blog/resultado-212-mr-olympia-2026">resultado da 212</a>), Figure, Women's Physique e Ms. Olympia. O Open, título máximo do evento, é decidido no sábado (<a href="/blog/resultado-mr-olympia-open-2026">resultado do Mr. Olympia Open 2026</a>). Todos os campeões ficam reunidos em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-classic-physique-mr-olympia-2026")}

${CTA_FASES}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Classic Physique do Mr. Olympia 2026?", answer: "O resultado ainda não foi definido. A final acontece na sexta-feira, 25 de setembro, a partir das 22h (horário de Brasília), e esta página é atualizada assim que a IFBB Pro League anuncia o campeão." },
      { question: "Em que posição Ramon Dino ficou?", answer: "Ainda não há resultado. Ramon Dino compete como atual campeão, após passar na pesagem com 102,5 kg. A colocação dele entra nesta página logo após a final." },
      { question: "Quando é a final da Classic Physique 2026?", answer: "Nesta sexta-feira, 25 de setembro de 2026. As prévias começam às 13h30 e a final a partir das 22h, no horário de Brasília (9h30 e 18h em Las Vegas)." },
      { question: "Onde assistir à Classic Physique do Mr. Olympia?", answer: "Pela OlympiaTV, transmissão oficial gratuita mediante cadastro no site do evento. No Brasil, canais como o de Renato Cariani no YouTube fazem cobertura com comentários em português." },
    ],
  },

  /* ───────────────── 2. HORÁRIO RAMON DINO ───────────────── */
  {
    slug: "ramon-dino-mr-olympia-2026-horario",
    title: "Que horas Ramon Dino compete no Mr. Olympia 2026? Veja o horário",
    metaTitle: "Que Horas Ramon Dino Compete no Olympia 2026? Horário",
    metaDescription:
      "Ramon Dino compete nesta sexta, 25/09: prévias às 13h30 e final a partir das 22h (Brasília). Veja onde assistir de graça e como funciona a decisão.",
    excerpt:
      "Ramon Dino compete nesta sexta-feira, 25 de setembro: prévias às 13h30 e final a partir das 22h, no horário de Brasília. Onde assistir e o que acontece em cada etapa.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "3 min",
    author: AUTOR,
    tags: ["Ramon Dino", "Mr. Olympia 2026", "horário", "onde assistir", "Classic Physique"],
    content: `<p><strong>Ramon Dino compete nesta sexta-feira, 25 de setembro de 2026</strong>, na Classic Physique do Mr. Olympia, em Las Vegas. No horário de Brasília:</p>
${CAPA("ramon-dino-mr-olympia-2026-horario", "Capa: que horas Ramon Dino compete no Mr. Olympia 2026 — sexta, 25 de setembro: prévias às 13h30 e final a partir das 22h, horário de Brasília")}
<table><thead><tr><th>Etapa</th><th>Brasília</th><th>Las Vegas</th><th>Local</th></tr></thead><tbody>
<tr><td>Prévias (prejudging) da Classic Physique</td><td><strong>a partir das 13h30</strong></td><td>9h30</td><td>Las Vegas Convention Center (South Hall)</td></tr>
<tr><td>Final da Classic Physique</td><td><strong>a partir das 22h</strong></td><td>18h</td><td>Orleans Arena</td></tr>
</tbody></table>
<p>Os horários são de início da sessão. A Classic Physique divide a sessão com outras categorias (212, Figure, Women's Physique, Ms. Olympia e Wellness), então o momento exato em que Ramon sobe ao palco depende da ordem do dia. A final da Classic costuma ficar entre as últimas da noite. O resultado entra em <a href="/blog/resultado-classic-physique-mr-olympia-2026">resultado da Classic Physique do Mr. Olympia 2026</a>.</p>

<h2>Onde assistir Ramon Dino</h2>
<ul>
<li><strong>OlympiaTV (oficial):</strong> pela primeira vez a transmissão é gratuita, com cadastro no site do evento. Cobre prévias e finais de todas as categorias.</li>
<li><strong>Cobertura em português:</strong> o canal de Renato Cariani no YouTube anunciou transmissão com comentários e análises para o público brasileiro.</li>
</ul>

<h2>Prévias e final: o que muda</h2>
<p>Na <strong>prévia</strong>, à tarde, os juízes fazem as comparações nas poses obrigatórias e o primeiro chamado (os atletas comparados juntos primeiro) indica quem disputa o título. Na <strong>final</strong>, à noite, vêm as rotinas de posing, novas comparações e o anúncio das colocações. Ou seja: às 13h30 dá para ver a briga; o campeão só sai depois das 22h.</p>

<h2>Por que a Classic mudou para sexta</h2>
<p>Em 2025 a categoria foi decidida no sábado. Em 2026 a organização moveu a Classic Physique para a sexta-feira, junto com a Wellness. O sábado fica com Men's Physique, Bikini, Fitness e a final do Mr. Olympia Open, a partir das 23h de Brasília.</p>

<h2>Depois da final</h2>
<p>A classificação completa e a colocação de Ramon entram em <a href="/blog/resultado-classic-physique-mr-olympia-2026">resultado da Classic Physique do Mr. Olympia 2026</a> assim que forem anunciadas. A programação do fim de semana inteiro, com as outras categorias, está em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("ramon-dino-mr-olympia-2026-horario")}

${FONTES}`,
    faq: [
      { question: "Que horas Ramon Dino compete hoje?", answer: "Nesta sexta-feira, 25 de setembro, as prévias da Classic Physique começam às 13h30 e a final a partir das 22h, no horário de Brasília (9h30 e 18h em Las Vegas). A hora exata em que ele sobe ao palco depende da ordem das categorias na sessão." },
      { question: "Em qual categoria Ramon Dino compete?", answer: "Classic Physique, categoria com limite de peso por altura. Ramon é o atual campeão, título de 2025." },
      { question: "Onde assistir Ramon Dino no Mr. Olympia 2026?", answer: "Na OlympiaTV, transmissão oficial gratuita com cadastro no site do evento, e em coberturas em português como a do canal de Renato Cariani no YouTube." },
      { question: "O horário de Las Vegas é diferente do de Brasília?", answer: "Sim: Las Vegas está 4 horas atrás de Brasília em setembro. As prévias de 9h30 em Las Vegas são 13h30 em Brasília, e a final de 18h é 22h." },
    ],
  },

  /* ───────────────── 3. HUB — QUEM GANHOU ───────────────── */
  {
    slug: "quem-ganhou-mr-olympia-2026",
    title: "Quem ganhou o Mr. Olympia 2026? Veja campeões e resultados",
    metaTitle: "Quem Ganhou o Mr. Olympia 2026? Todos os Campeões",
    metaDescription:
      "Campeões e resultados do Mr. Olympia 2026, categoria por categoria: Open, Classic Physique, Wellness e 212. Atualizado durante as finais de 25 e 26/09.",
    excerpt:
      "Todos os campeões do Mr. Olympia 2026 reunidos numa página, atualizada durante as finais de sexta (25) e sábado (26), em Las Vegas.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "5 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "campeões", "resultados", "fisiculturismo", "Las Vegas"],
    content: `${AVISO_ANTES("Nenhuma categoria do Mr. Olympia 2026 foi decidida ainda.")}
<p>O Mr. Olympia 2026 acontece de 24 a 27 de setembro em Las Vegas, com 322 atletas em 12 categorias — 58 deles brasileiros. As finais são <strong>nesta sexta (25) a partir das 22h</strong> e <strong>no sábado (26) a partir das 23h</strong>, no horário de Brasília. Esta página reúne todos os campeões e é atualizada categoria por categoria, à medida que os resultados oficiais saem.</p>
${CAPA("quem-ganhou-mr-olympia-2026", "Capa: quem ganhou o Mr. Olympia 2026 — todos os campeões, categoria por categoria: Open, Classic Physique, Wellness, 212, Men's Physique, Bikini e mais")}

<h2>Campeões do Mr. Olympia 2026</h2>
<table><thead><tr><th>Categoria</th><th>Final</th><th>Campeão(ã) 2026</th><th>Campeão(ã) 2025</th><th>Resultado</th></tr></thead><tbody>
<tr><td>Classic Physique</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Ramon Dino (BRA)</td><td><a href="/blog/resultado-classic-physique-mr-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Wellness</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Eduarda Bezerra (BRA)</td><td><a href="/blog/resultado-wellness-mr-olympia-2026">Ver resultado</a></td></tr>
<tr><td>212</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Keone Pearson (EUA)</td><td><a href="/blog/resultado-212-mr-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Figure</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Rhea Gayle (GBR)</td><td>Nesta página</td></tr>
<tr><td>Women's Physique</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Natalia Abraham Coelho (EUA)</td><td><a href="/blog/resultado-womens-physique-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Ms. Olympia</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Andrea Shaw (EUA)</td><td>Nesta página</td></tr>
<tr><td>Fitness</td><td>Sáb 26/09, 23h</td><td>A definir</td><td>Michelle Fredua-Mensah (GBR)</td><td>Nesta página</td></tr>
<tr><td>Men's Physique</td><td>Sáb 26/09, 23h</td><td>A definir</td><td>Ryan Terry (GBR)</td><td><a href="/blog/resultado-mens-physique-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Bikini</td><td>Sáb 26/09, 23h</td><td>A definir</td><td>Maureen Blanquisco (PHI)</td><td><a href="/blog/resultado-bikini-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Fit Model (estreia)</td><td>Sáb 26/09, 13h30*</td><td>A definir</td><td>—</td><td><a href="/blog/resultado-fit-model-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Mr. Olympia (Open)</td><td>Sáb 26/09, 23h</td><td>A definir</td><td>Derek Lunsford (EUA)</td><td><a href="/blog/resultado-mr-olympia-open-2026">Ver resultado</a></td></tr>
</tbody></table>
<p><em>Wheelchair também é decidida no sábado e entra aqui com o resultado oficial. Horários são o início de cada sessão de finais. *A Fit Model tem prévias e final na sessão da manhã de sábado.</em></p>

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
<li><strong>Ramon Dino</strong> — atual campeão da Classic Physique, primeiro brasileiro a vencer o Mr. Olympia. Pesou 102,5 kg na pesagem oficial (<a href="/blog/ramon-dino-peso-altura">peso, altura e limite</a>).</li>
<li><strong>Eduarda Bezerra</strong> — atual campeã da Wellness, categoria em que o Brasil venceu todas as cinco edições desde 2021 e tem 19 das 40 inscritas em 2026.</li>
<li><strong>Isa Pereira Nunes</strong> (campeã Wellness 2024) e <strong>Rayane Fogal</strong> (campeã do Arnold Ohio e do Arnold UK 2026) completam as principais candidatas brasileiras.</li>
</ul>

<h2>Quem chega como favorito no Open</h2>
<p>Derek Lunsford (EUA) defende o título de 2025, ano em que não perdeu nenhuma competição. Samson Dauda (campeão de 2024), Andrew Jacked (terceiro em 2025 e invicto desde então), Nick Walker e Martin Fitzwater são os mais citados para o primeiro chamado. Hadi Choopan, vice três vezes seguidas, desistiu em agosto. A análise completa está em <a href="/blog/resultado-mr-olympia-open-2026">resultado do Mr. Olympia Open 2026</a>.</p>

${ACOMPANHE("quem-ganhou-mr-olympia-2026")}

${CTA_MONTINHO}
${FONTES}`,
    faq: [
      { question: "Quem ganhou o Mr. Olympia 2026?", answer: "Ainda não foi decidido. A final do Mr. Olympia Open é no sábado, 26 de setembro, a partir das 23h (Brasília). O campeão entra nesta página assim que for anunciado." },
      { question: "Quando são as finais do Mr. Olympia 2026?", answer: "Sexta-feira, 25/09, a partir das 22h (Classic Physique, Wellness, 212, Figure, Women's Physique e Ms. Olympia) e sábado, 26/09, a partir das 23h (Open, Men's Physique, Bikini e Fitness), no horário de Brasília." },
      { question: "Quantos brasileiros competem no Mr. Olympia 2026?", answer: "58, entre 322 atletas de 12 categorias. Os mais conhecidos são Ramon Dino, na Classic Physique, e Eduarda Bezerra, Isa Pereira Nunes e Rayane Fogal, na Wellness." },
      { question: "Onde ver os resultados do Mr. Olympia 2026?", answer: "Nesta página, atualizada categoria por categoria com base nos anúncios oficiais do Olympia e da IFBB Pro League, e nos artigos específicos de Classic Physique, Wellness e Open." },
    ],
  },

  /* ───────────────── 4. WELLNESS ───────────────── */
  {
    slug: "resultado-wellness-mr-olympia-2026",
    title: "Resultado Wellness Mr. Olympia 2026: campeã, Top 5 e brasileiras",
    metaTitle: "Resultado Wellness Olympia 2026: Campeã e Brasileiras",
    metaDescription:
      "Campeã e top 5 da Wellness do Mr. Olympia 2026, com a colocação de Eduarda Bezerra e das brasileiras. Final nesta sexta, 25/09, às 22h (Brasília).",
    excerpt:
      "A final da Wellness do Mr. Olympia 2026 é nesta sexta, 25 de setembro. Eduarda Bezerra defende o título numa categoria que o Brasil venceu em todas as edições.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "4 min",
    author: AUTOR,
    tags: ["Wellness", "Mr. Olympia 2026", "Eduarda Bezerra", "Isa Pereira Nunes", "resultado"],
    content: `${AVISO_ANTES("O resultado da Wellness do Mr. Olympia 2026 ainda não foi definido.")}
<p>A Wellness do Mr. Olympia 2026 é decidida <strong>nesta sexta-feira, 25 de setembro</strong>: prévias a partir das <strong>13h30</strong> e final a partir das <strong>22h</strong>, horário de Brasília. <strong>Eduarda Bezerra</strong> defende o título de 2025 numa categoria que o Brasil venceu em todas as cinco edições desde a estreia, em 2021. A classificação entra aqui assim que a IFBB Pro League divulgar o resultado.</p>
${CAPA("resultado-wellness-mr-olympia-2026", "Capa: Wellness do Mr. Olympia 2026 — o Brasil venceu todas as cinco edições e 19 das 40 atletas são brasileiras; resultado, campeã e top 5")}

<h2>Classificação da Wellness 2026</h2>
${TABELA_PENDENTE(5)}
<p><em>Tabela preenchida após a final oficial.</em></p>

<h2>As brasileiras na disputa</h2>
<p>São <strong>19 brasileiras entre as 40 inscritas</strong>. As mais cotadas:</p>
<ul>
<li><strong>Eduarda Bezerra</strong> (Caruaru, PE) — atual campeã. Em 2025 venceu o Arnold Classic Ohio e o Olympia, superando Isa Pereira Nunes nos dois.</li>
<li><strong>Isa Pereira Nunes</strong> — campeã de 2024 e vice em 2025.</li>
<li><strong>Rayane Fogal</strong> — campeã do Arnold Classic Ohio e do Arnold Classic UK em 2026.</li>
</ul>
<p>As outras brasileiras inscritas aparecem com variações entre as listas publicadas pela imprensa; a relação oficial é a da IFBB Pro League, e os nomes delas entram aqui com a classificação. <strong>Francielle Mattos</strong>, tricampeã (2021–2023), tem vaga garantida mas optou por não competir em 2026.</p>

<h2>O histórico: Brasil em todas as edições</h2>
<table><thead><tr><th>Ano</th><th>Campeã</th></tr></thead><tbody>
<tr><td>2021</td><td>Francielle Mattos (BRA)</td></tr>
<tr><td>2022</td><td>Francielle Mattos (BRA)</td></tr>
<tr><td>2023</td><td>Francielle Mattos (BRA)</td></tr>
<tr><td>2024</td><td>Isa Pereira Nunes (BRA)</td></tr>
<tr><td>2025</td><td>Eduarda Bezerra (BRA)</td></tr>
<tr><td>2026</td><td>A definir</td></tr>
</tbody></table>

<h2>O que os juízes avaliam na Wellness</h2>
<p>A Wellness premia o desenvolvimento da parte inferior do corpo — glúteos, coxas e quadril — em proporção maior que a superior, com condicionamento moderado: definição visível sem a secura das categorias de bodybuilding. Para entender como esse tipo de desenvolvimento se constrói no treino comum, sem palco, veja <a href="/blog/como-ganhar-massa-sem-ganhar-gordura">como ganhar massa sem ganhar gordura</a>.</p>

<h2>As outras decisões da noite</h2>
<p>Na mesma sessão de sexta são decididas Classic Physique (<a href="/blog/resultado-classic-physique-mr-olympia-2026">resultado da Classic com Ramon Dino</a>), 212, Figure, Women's Physique e Ms. Olympia. Todos os campeões em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-wellness-mr-olympia-2026")}

${CTA_WELLNESS}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Wellness do Mr. Olympia 2026?", answer: "Ainda não foi definido. A final é nesta sexta-feira, 25 de setembro, a partir das 22h (Brasília). Esta página é atualizada com a campeã e o top 5 assim que o resultado oficial sair." },
      { question: "Quais brasileiras competem na Wellness Olympia 2026?", answer: "19 das 40 inscritas são brasileiras. As mais cotadas: Eduarda Bezerra (atual campeã), Isa Pereira Nunes (campeã de 2024) e Rayane Fogal (campeã do Arnold Ohio e UK 2026)." },
      { question: "Francielle Mattos compete em 2026?", answer: "Não. A tricampeã (2021, 2022 e 2023) tem vaga garantida, mas optou por ficar fora desta edição." },
      { question: "Que horas é a final da Wellness?", answer: "Sexta-feira, 25/09, a partir das 22h no horário de Brasília (18h em Las Vegas), na Orleans Arena. As prévias começam às 13h30." },
    ],
  },

  /* ───────────────── 5. OPEN ───────────────── */
  {
    slug: "resultado-mr-olympia-open-2026",
    title: "Resultado Mr. Olympia Open 2026: campeão, Top 10 e classificação",
    metaTitle: "Resultado Open Mr. Olympia 2026: Campeão e Top 10",
    metaDescription:
      "Classificação do Open do Mr. Olympia 2026: campeão do Sandow, top 10 e colocações. Final no sábado, 26/09, a partir das 23h (Brasília). Atualizado.",
    excerpt:
      "A final do Mr. Olympia Open 2026 é no sábado, 26 de setembro. Derek Lunsford defende o título contra Samson Dauda, Andrew Jacked, Nick Walker e Martin Fitzwater.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "4 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Open", "Derek Lunsford", "Samson Dauda", "resultado"],
    content: `${AVISO_ANTES("O resultado do Mr. Olympia Open 2026 ainda não foi definido.")}
<p>O título máximo do Mr. Olympia 2026 é decidido <strong>no sábado, 26 de setembro</strong>, com a final a partir das <strong>23h (horário de Brasília)</strong>, na Orleans Arena, em Las Vegas. As prévias do Open acontecem antes, na sessão de sexta à noite. <strong>Derek Lunsford</strong> (EUA) defende o título de 2025 contra 21 atletas na principal categoria da IFBB Pro League, a única sem limite de peso. A classificação completa entra aqui assim que for anunciada.</p>
${CAPA("resultado-mr-olympia-open-2026", "Capa: resultado do Open do Mr. Olympia 2026 — quem leva o troféu Sandow; Derek Lunsford defende o título na final de sábado, 23h de Brasília")}

<h2>Classificação do Mr. Olympia Open 2026</h2>
${TABELA_PENDENTE(10)}
<p><em>Tabela preenchida após a final oficial. Enquanto isso, acompanhe a Classic Physique com Ramon Dino em <a href="/blog/resultado-classic-physique-mr-olympia-2026">resultado da Classic Physique 2026</a>.</em></p>

<h2>Os principais nomes</h2>
<ul>
<li><strong>Derek Lunsford (EUA)</strong> — campeão em 2023 e 2025. Em 2025 venceu Arnold Classic, Pittsburgh Pro e Olympia, e tornou-se o segundo atleta da história a recuperar o título depois de perdê-lo, ao lado de Jay Cutler.</li>
<li><strong>Samson Dauda (Nigéria/Reino Unido)</strong> — campeão de 2024, caiu para quarto em 2025. Venceu o Europa Pro em 13 de setembro, onze dias antes de Las Vegas.</li>
<li><strong>Andrew Jacked (Nigéria)</strong> — terceiro em 2025 e invicto desde então: Romania Pro 2025, Arnold Classic Ohio e Arnold Classic UK 2026.</li>
<li><strong>Nick Walker (EUA)</strong> e <strong>Martin Fitzwater (EUA)</strong> — citados para o primeiro chamado pela imprensa especializada.</li>
</ul>
<p><strong>Hadi Choopan</strong> (Irã), vice por três anos seguidos, desistiu em 26 de agosto por problemas de visto — o que abre uma vaga no grupo da frente.</p>

<h2>Prévias na sexta, final no sábado</h2>
<p>Diferente das outras categorias, o Open tem as prévias na <strong>sexta-feira à noite</strong> (na sessão que começa às 22h de Brasília) e a final no <strong>sábado</strong>. O primeiro chamado da sexta costuma antecipar quem briga pelo Sandow, o troféu do campeão; o resultado, só depois das poses e comparações finais de sábado.</p>

<h2>Open e Classic: a diferença</h2>
<p>O Open não tem limite de peso: vence quem combina mais massa muscular com condicionamento e proporção. A Classic Physique, de Ramon Dino, limita o peso pela altura e valoriza linhas e estética. Um atleta de 1,81 m compete na Classic com no máximo 103 kg; no Open, os primeiros colocados passam com folga dos 120 kg. Os números da Classic estão em <a href="/blog/ramon-dino-peso-altura">peso, altura e limite da Classic Physique</a>.</p>

<h2>Quanto tempo para construir um shape grande?</h2>
<p>O Open é o nível máximo de massa muscular do fisiculturismo. Se você quer saber em que estágio está e como tende a ser a sua curva nos próximos anos, compare com essa referência:</p>
<!--SHAPE:open-->

<h2>Todas as categorias</h2>
<p>Os campeões de sexta e sábado ficam reunidos em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>, incluindo a <a href="/blog/resultado-wellness-mr-olympia-2026">Wellness, com as brasileiras</a>.</p>

${ACOMPANHE("resultado-mr-olympia-open-2026")}

${CTA_MONTINHO}
${FONTES}`,
    faq: [
      { question: "Quem ganhou o Open do Mr. Olympia 2026?", answer: "Ainda não foi definido. A final do Open é no sábado, 26 de setembro, a partir das 23h no horário de Brasília. O campeão e o top 10 entram nesta página assim que forem anunciados; os campeões das outras categorias ficam na página de todos os resultados do Olympia 2026." },
      { question: "Quem ficou no Top 5 do Mr. Olympia 2026?", answer: "A classificação sai após a final de sábado. Os mais cotados para o grupo da frente são Derek Lunsford, Samson Dauda, Andrew Jacked, Nick Walker e Martin Fitzwater." },
      { question: "Quando acontece a final do Mr. Olympia 2026?", answer: "Sábado, 26 de setembro de 2026, a partir das 23h (Brasília), 19h em Las Vegas, na Orleans Arena. As prévias do Open são na sexta à noite." },
      { question: "Hadi Choopan compete no Olympia 2026?", answer: "Não. Vice em 2023, 2024 e 2025, ele anunciou a desistência em 26 de agosto de 2026 por problemas de visto." },
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
<tr><td>2026</td><td>A definir — final em 25 de setembro</td></tr>
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
    title: "Resultado 212 Mr. Olympia 2026: campeão, Top 10 e brasileiros",
    metaTitle: "Resultado 212 Olympia 2026: Campeão, Top 10 e Lucas Garcia",
    metaDescription:
      "Quem ganhou a 212 do Mr. Olympia 2026 e como ficaram Lucas Garcia e os outros três brasileiros. Final nesta sexta, 25/09, a partir das 22h de Brasília.",
    excerpt:
      "A 212 do Mr. Olympia 2026 é decidida nesta sexta-feira, 25 de setembro. Campeão, top 10 e a colocação dos quatro brasileiros entram aqui assim que saem.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "3 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "212", "Lucas Garcia", "resultado", "fisiculturismo"],
    content: `${AVISO_ONDA2("O resultado da 212 do Mr. Olympia 2026 ainda não foi definido.")}
<p><strong>A 212 ainda não aconteceu.</strong> As prévias começam às <strong>13h30 de sexta-feira, 25 de setembro</strong> (Brasília), e a final a partir das <strong>22h</strong> do mesmo dia, em Las Vegas. Keone Pearson (EUA) defende o tricampeonato. O Brasil tem quatro atletas na categoria: <strong>Lucas Garcia</strong>, terceiro colocado em 2025, <strong>Vitor Porto</strong>, <strong>Felipe Moraes</strong> e <strong>Andrey Pereira</strong>.</p>
<!--OLYMPIA_CONTAGEM:212-->
${CAPA("resultado-212-mr-olympia-2026", "Capa: resultado da 212 do Mr. Olympia 2026 — Keone Pearson defende o título e Lucas Garcia lidera os quatro brasileiros; final na sexta às 22h de Brasília")}

<h2 id="resultado">Resultado 212 Olympia 2026</h2>
${TABELA_PENDENTE(10)}
<p><em>Tabela preenchida com o resultado oficial da IFBB Pro League, depois da final. Se só o top 5 for divulgado na noite, só o top 5 entra.</em></p>

<h2>Como ficaram os brasileiros na 212?</h2>
<table><thead><tr><th>Atleta</th><th>Resultado</th><th>Status</th></tr></thead><tbody>
<tr><td>Lucas Garcia</td><td>A definir</td><td>Aguardando prévias (sexta, 13h30)</td></tr>
<tr><td>Vitor Porto</td><td>A definir</td><td>Aguardando prévias (sexta, 13h30)</td></tr>
<tr><td>Felipe Moraes</td><td>A definir</td><td>Aguardando prévias (sexta, 13h30)</td></tr>
<tr><td>Andrey Pereira</td><td>A definir</td><td>Aguardando prévias (sexta, 13h30)</td></tr>
</tbody></table>
<p>Os quatro aparecem no roster oficial da IFBB Pro League representando o Brasil (Vitor Porto está inscrito como Vitor Alves Porto de Oliveira). Como foram os brasileiros das outras categorias: <a href="/blog/brasileiros-mr-olympia-2026">brasileiros no Mr. Olympia 2026</a>.</p>

<h2>Em que posição Lucas Garcia ficou?</h2>
<p><strong>Ainda não há resultado.</strong> Lucas Garcia, paulista, chega como o brasileiro mais bem colocado da categoria: em 2025, na estreia no Olympia, terminou em <strong>terceiro</strong>, atrás de Keone Pearson e Shaun Clarida, com Nihat Kaya (Turquia) em quarto e Courage Opara (EUA) em quinto. A colocação de 2026 entra aqui logo após a final.</p>

<h2>Quem ganhou a 212 Olympia 2026?</h2>
<p><strong>Ainda não foi decidido.</strong> Os nomes mais citados pela imprensa especializada:</p>
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
<p>Na mesma noite saem os resultados da <a href="/blog/resultado-classic-physique-mr-olympia-2026">Classic Physique, com Ramon Dino</a>, e da <a href="/blog/resultado-wellness-mr-olympia-2026">Wellness</a>. O Open é decidido no sábado (<a href="/blog/resultado-mr-olympia-open-2026">resultado do Open</a>), e todos os campeões ficam em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-212-mr-olympia-2026")}

${CTA_MASSA}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a 212 do Mr. Olympia 2026?", answer: "Ainda não foi decidido. A final é na sexta-feira, 25 de setembro, a partir das 22h (Brasília). Keone Pearson defende o título, e esta página é atualizada com o resultado oficial." },
      { question: "Em que posição Lucas Garcia ficou na 212?", answer: "Ainda não há resultado de 2026. Em 2025, na estreia no Olympia, Lucas Garcia ficou em terceiro, atrás de Keone Pearson e Shaun Clarida." },
      { question: "Quantos brasileiros competem na 212 do Olympia 2026?", answer: "Quatro, pelo roster oficial da IFBB Pro League: Lucas Garcia, Vitor Porto, Felipe Moraes e Andrey Pereira." },
      { question: "Qual é o limite de peso da 212?", answer: "212 libras, cerca de 96,2 kg, na pesagem oficial, para qualquer altura." },
    ],
  },
  /* ───────────────── 8. RESULTADO WOMEN'S PHYSIQUE ───────────────── */
  {
    slug: "resultado-womens-physique-olympia-2026",
    title: "Resultado Women's Physique Olympia 2026: Natália Coelho e classificação",
    metaTitle: "Resultado Women's Physique Olympia 2026: Natália Coelho",
    metaDescription:
      "Quem ganhou a Women's Physique do Olympia 2026, a posição de Natália Coelho e das brasileiras. Final nesta sexta, 25/09, a partir das 22h de Brasília.",
    excerpt:
      "A Women's Physique do Olympia 2026 é decidida nesta sexta-feira, 25 de setembro. Natália Coelho defende o título; campeã, top 10 e brasileiras entram aqui.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "3 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Women's Physique", "Natália Coelho", "resultado", "fisiculturismo"],
    content: `${AVISO_ONDA2("O resultado da Women's Physique do Olympia 2026 ainda não foi definido.")}
<p><strong>A Women's Physique ainda não aconteceu.</strong> As prévias começam às <strong>13h30 de sexta-feira, 25 de setembro</strong> (Brasília), e a final a partir das <strong>22h</strong>, em Las Vegas. <strong>Natália Coelho</strong> defende o título conquistado em 2025, o segundo dela na categoria. <strong>Zama Benta</strong>, terceira colocada no ano passado, é a principal representante do Brasil no roster.</p>
<!--OLYMPIA_CONTAGEM:womens-physique-->
${CAPA("resultado-womens-physique-olympia-2026", "Capa: resultado da Women's Physique do Olympia 2026 — Natália Coelho defende o título e cinco brasileiras disputam a categoria; final na sexta às 22h de Brasília")}

<h2 id="resultado">Resultado Women's Physique Olympia 2026</h2>
${TABELA_PENDENTE(10)}
<p><em>Tabela preenchida com o resultado oficial da IFBB Pro League, depois da final. Se só o top 5 for divulgado na noite, só o top 5 entra.</em></p>

<h2>Em que posição Natália Coelho ficou?</h2>
<p><strong>Ainda não há resultado.</strong> Natália Coelho chega como atual campeã: venceu em 2025 à frente de Sarah Villegas (EUA), repetindo o título de 2022. Brasileira, ela aparece no roster oficial da IFBB Pro League <strong>representando os Estados Unidos</strong>, onde vive e compete. Por isso a tabela oficial mostra "EUA" ao lado do nome dela. A colocação de 2026 entra aqui logo após a final.</p>

<h2>Como ficaram Zama Benta e as brasileiras?</h2>
<table><thead><tr><th>Atleta</th><th>Representação no roster</th><th>Resultado</th><th>Status</th></tr></thead><tbody>
<tr><td>Natália Coelho</td><td>EUA</td><td>A definir</td><td>Aguardando prévias</td></tr>
<tr><td>Zama Benta</td><td>Brasil</td><td>A definir</td><td>Aguardando prévias</td></tr>
<tr><td>Jessica Macedo</td><td>Brasil</td><td>A definir</td><td>Aguardando prévias</td></tr>
<tr><td>Naiana Nana</td><td>Brasil</td><td>A definir</td><td>Aguardando prévias</td></tr>
<tr><td>Amanda de Carvalho Machado</td><td>EUA</td><td>A definir</td><td>Aguardando prévias</td></tr>
</tbody></table>
<p>A imprensa brasileira conta cinco brasileiras na categoria. No roster oficial, três estão listadas pelo Brasil e duas pelos EUA. A coluna "representação" mostra o país que a IFBB Pro League exibe, não a nacionalidade. <strong>Zama Benta</strong> foi terceira em 2025, atrás de Natália e de Sarah Villegas. Os brasileiros de todas as categorias estão no <a href="/blog/brasileiros-mr-olympia-2026">painel Brasil do Olympia</a>.</p>

<h2>Top 5 Women's Physique</h2>
<p>Ainda não definido. As mais citadas pela imprensa especializada para o primeiro chamado: Natália Coelho, Sarah Villegas (quatro vezes campeã e vice em 2025), Zama Benta, Brittany Herrera (quarta em 2025) e Lenka Ferencukova (Eslováquia), vencedora de dois shows profissionais nesta temporada.</p>

<h2 id="como-foram-as-previas">Como foram as prévias?</h2>
<p>As prévias ainda não aconteceram. Depois delas, esta seção vai registrar quem foi chamado para as primeiras comparações. Chamado não é resultado: a colocação só existe depois da final.</p>

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
      { question: "Quem ganhou a Women's Physique do Olympia 2026?", answer: "Ainda não foi decidido. A final é na sexta-feira, 25 de setembro, a partir das 22h (Brasília). Natália Coelho defende o título, e esta página é atualizada com o resultado oficial." },
      { question: "Em que posição Natália Coelho ficou?", answer: "Ainda não há resultado de 2026. Natália é a atual campeã: venceu em 2025 e em 2022." },
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
      "Todos os brasileiros no Mr. Olympia 2026 por categoria e dia, com horário de Brasília e resultado de cada um, atualizado durante as finais de 25 e 26/09.",
    excerpt:
      "Painel dos brasileiros no Mr. Olympia 2026: quem compete na sexta e no sábado, em que categoria, por qual país no roster e como terminou cada um.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "5 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "brasileiros", "Ramon Dino", "resultados", "fisiculturismo"],
    content: `${AVISO_ONDA2("Nenhum brasileiro competiu ainda no Mr. Olympia 2026.")}
<p><strong>Os brasileiros começam a competir nesta sexta-feira, 25 de setembro</strong>, com as prévias a partir das 13h30 (Brasília): Ramon Dino na Classic Physique, Lucas Garcia na 212, Natália Coelho na Women's Physique e mais de vinte brasileiras na Wellness. No <strong>sábado, 26</strong>, é a vez de Men's Physique, Bikini e do Open, com Leandro Peres. Os resultados de cada um entram aqui assim que forem oficiais.</p>
<h2>Acompanhe os brasileiros no Mr. Olympia 2026</h2>
<p>Prévias às 13h30 e finais a partir das 22h na sexta (25) e das 23h no sábado (26), horário de Brasília. "Agora" indica o bloco que já começou; uma categoria só aparece como finalizada com resultado oficial.</p>
<!--OLYMPIA_CONTAGEM:brasil-->
${CAPA("brasileiros-mr-olympia-2026", "Capa: brasileiros no Mr. Olympia 2026 — painel com atletas, categorias, horários de Brasília e resultados de sexta e sábado")}

<h2>Painel Brasil no Mr. Olympia 2026</h2>
<p>Filtre por dia, categoria ou nome. "Roster" é o país que a IFBB Pro League mostra ao lado do atleta.</p>
<!--PAINEL_BRASIL:olympia-->

<h2 id="resultados-brasileiros">Resultados dos brasileiros no Mr. Olympia 2026</h2>
${TABELA_BRASIL}
<p><em>A coluna "Resultado" só é preenchida com a classificação oficial. Wellness: estão aqui as brasileiras de destaque; a lista completa da categoria fica em <a href="/blog/resultado-wellness-mr-olympia-2026">resultado da Wellness 2026</a>.</em></p>

<h2>Quantos brasileiros competem?</h2>
<p>Depende de quem conta. As listas publicadas variam, e por isso não usamos um número fechado: a CNN Brasil falou em 58 classificados, o NSC Total em 57, e a Folha chegou a contar 60 no início de setembro. A diferença vem do critério: há quem conte todos os classificados, quem conte só os confirmados e quem inclua brasileiros que competem por outra bandeira.</p>
<p><strong>O nosso critério:</strong> entra no painel quem está no roster atual da IFBB Pro League e não foi reportado fora do evento. Brasileiros que aparecem por outro país, como Natália Coelho (EUA) e Mauro Fialho (Espanha), entram com a representação oficial indicada. Classificados que não viajaram ficam na lista abaixo.</p>

<h2>Brasileiros que ficaram fora</h2>
<p>Pelo menos sete brasileiros classificados não competem, segundo CNN Brasil e O Povo, a maioria por visto americano negado:</p>
<ul>${FORA_DO_EVENTO.map((f) => `<li><strong>${f.nome}</strong> (${f.categoria}) — ${f.motivo}</li>`).join("")}</ul>

<h2>Brasileiros que competem na sexta-feira</h2>
<p>Prévias a partir das <strong>13h30</strong> e finais a partir das <strong>22h</strong> (Brasília). São horários de início de bloco: a hora exata de cada categoria depende do andamento do evento.</p>
<h3>Classic Physique</h3>
<p>Ramon Dino defende o título ao lado de César Falcão, Fábio Júnio, Gabriel Zancanelli e Matheus Menegate. <a href="/blog/resultado-classic-physique-mr-olympia-2026">Resultado da Classic Physique e a colocação de Ramon</a>.</p>
<h3>212</h3>
<p>Lucas Garcia, terceiro em 2025, com Vitor Porto, Felipe Moraes e Andrey Pereira. <a href="/blog/resultado-212-mr-olympia-2026">Como ficou Lucas Garcia na 212</a>.</p>
<h3>Wellness</h3>
<p>A categoria em que o Brasil venceu todas as edições tem a maior delegação brasileira. Eduarda Bezerra defende o título, e Isa Pereira Nunes e Rayane Fogal estão entre as candidatas. <a href="/blog/resultado-wellness-mr-olympia-2026">Resultado da Wellness e a lista das brasileiras</a>.</p>
<h3>Women's Physique</h3>
<p>Natália Coelho, atual campeã, aparece no roster pelos EUA. Zama Benta, terceira em 2025, lidera as que competem pelo Brasil. <a href="/blog/resultado-womens-physique-olympia-2026">Posição de Natália Coelho e das brasileiras</a>.</p>
<h3>Ms. Olympia (Women's Bodybuilding)</h3>
<p>Leyvina Barros, top 3 em 2025, e Barbara Moojen. Sem página própria: o resultado entra neste painel e em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

<h2>Brasileiros que competem no sábado</h2>
<p>Prévias a partir das <strong>13h30</strong> e finais a partir das <strong>23h</strong> (Brasília).</p>
<h3>Open</h3>
<p>Leandro Peres é o único brasileiro na categoria principal. <a href="/blog/resultado-mr-olympia-open-2026">Resultado do Open e o campeão</a>.</p>
<h3>Men's Physique</h3>
<p>Nove brasileiros no roster pelo Brasil, entre eles Edvan Palmeira e Vitor Chaves, além de Mauro Fialho, listado pela Espanha. <a href="/blog/resultado-mens-physique-olympia-2026">Posição de Edvan Palmeira e dos brasileiros</a>.</p>
<h3>Bikini</h3>
<p>Elisa Pecini (Isa Pecini), campeã em 2019, com Nivea Campos e Bruna Toigo. <a href="/blog/resultado-bikini-olympia-2026">Como ficou Isa Pecini na Bikini</a>.</p>
<h3>Fit Model</h3>
<p>Gabriela Queiroz, brasileira, aparece no roster pelos EUA, na estreia da categoria no Olympia. Prévias e final na sessão das 13h30. <a href="/blog/resultado-fit-model-olympia-2026">Em que posição Gabriela Queiroz ficou</a>.</p>

<h2>Onde assistir</h2>
<p>Pela OlympiaTV, transmissão oficial, gratuita com cadastro no site do evento. Horários e detalhes em <a href="/blog/ramon-dino-mr-olympia-2026-horario">que horas Ramon Dino compete</a>.</p>

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
    title: "Resultado Men's Physique Olympia 2026: campeão, Top 10 e brasileiros",
    metaTitle: "Resultado Men's Physique Olympia 2026: Edvan Palmeira",
    metaDescription:
      "Quem ganhou a Men's Physique do Olympia 2026 e como ficaram Edvan Palmeira e os brasileiros. Final no sábado, 26/09, a partir das 23h de Brasília.",
    excerpt:
      "A Men's Physique do Olympia 2026 é decidida no sábado, 26 de setembro. Ryan Terry defende o título; campeão, top 10 e brasileiros entram aqui.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "3 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Men's Physique", "Edvan Palmeira", "resultado", "fisiculturismo"],
    content: `${AVISO_ONDA2("O resultado da Men's Physique do Olympia 2026 ainda não foi definido.")}
<p><strong>A Men's Physique ainda não aconteceu.</strong> As prévias começam às <strong>13h30 de sábado, 26 de setembro</strong> (Brasília), e a final a partir das <strong>23h</strong>, em Las Vegas. Ryan Terry (Reino Unido) defende o tricampeonato. <strong>Edvan Palmeira</strong>, quinto colocado em 2025, é o brasileiro mais bem colocado no ano passado, num grupo de nove atletas listados pelo Brasil.</p>
<!--OLYMPIA_CONTAGEM:mens-physique-->
${CAPA("resultado-mens-physique-olympia-2026", "Capa: resultado da Men's Physique do Olympia 2026 — Ryan Terry defende o título e Edvan Palmeira lidera os brasileiros; final no sábado às 23h de Brasília")}

<h2 id="resultado">Resultado Men's Physique Olympia 2026</h2>
${TABELA_PENDENTE(10)}
<p><em>Tabela preenchida com o resultado oficial da IFBB Pro League, depois da final. Se só o top 5 for divulgado na noite, só o top 5 entra.</em></p>

<h2>Como ficaram os brasileiros?</h2>
<table><thead><tr><th>Atleta</th><th>Representação no roster</th><th>Resultado</th></tr></thead><tbody>
${ATLETAS_BRASIL.filter((x) => x.categoria === "mens-physique").map((x) => `<tr><td>${x.nome}</td><td>${x.representacao}</td><td>${x.resultado ?? "A definir"}</td></tr>`).join("")}
</tbody></table>
<p>Nove atletas aparecem no roster oficial representando o Brasil. <strong>Mauro Fialho</strong> é citado entre os brasileiros pela imprensa, mas está listado pela Espanha, e é assim que aparece na classificação oficial. Todos os brasileiros do fim de semana estão no <a href="/blog/brasileiros-mr-olympia-2026">painel dos brasileiros no Mr. Olympia 2026</a>.</p>

<h2>Em que posição Edvan Palmeira ficou?</h2>
<p><strong>Ainda não há resultado.</strong> O baiano Edvan Palmeira terminou em <strong>quinto</strong> em 2025, atrás de Ryan Terry, Ali Bilal, Brandon Hendrickson e Erin Banks. A colocação de 2026 entra aqui logo após a final de sábado.</p>

<h2>Quem ganhou a Men's Physique?</h2>
<p><strong>Ainda não foi decidido.</strong> Os nomes mais citados pela imprensa especializada:</p>
<ul>
<li><strong>Ryan Terry (Reino Unido)</strong> — campeão em 2023, 2024 e 2025. Um quarto título igualaria o recorde de Jeremy Buendia.</li>
<li><strong>Ali Bilal (EUA)</strong> — vice em 2025.</li>
<li><strong>Brandon Hendrickson (EUA)</strong> — terceiro em 2025 e ex-campeão da categoria.</li>
<li><strong>Erin Banks (EUA)</strong> — campeão em 2022 e quarto em 2025.</li>
</ul>

<h2>Top 10</h2>
<p>Ainda não definido. A tabela no topo recebe o top 10 oficial assim que a IFBB Pro League publicar.</p>

<h2 id="como-foram-as-previas">Como foram as prévias?</h2>
<p>As prévias ainda não aconteceram. Depois delas, esta seção vai registrar quem foi chamado para as primeiras comparações, sem transformar chamado em colocação.</p>

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
<p>Na mesma noite é decidido o <a href="/blog/resultado-mr-olympia-open-2026">Open, o título de Mr. Olympia</a>. Os campeões de todas as categorias estão em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-mens-physique-olympia-2026")}

${CTA_MASSA_PHYSIQUE}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Men's Physique do Olympia 2026?", answer: "Ainda não foi decidido. A final é no sábado, 26 de setembro, a partir das 23h (Brasília). Ryan Terry defende o título, e esta página é atualizada com o resultado oficial." },
      { question: "Em que posição Edvan Palmeira ficou?", answer: "Ainda não há resultado de 2026. Em 2025, Edvan Palmeira ficou em quinto na Men's Physique." },
      { question: "Quantos brasileiros competem na Men's Physique 2026?", answer: "Nove atletas estão no roster oficial pelo Brasil. Mauro Fialho, citado entre os brasileiros, aparece pela Espanha." },
    ],
  },

  /* ───────────────── 11. RESULTADO BIKINI ───────────────── */
  {
    slug: "resultado-bikini-olympia-2026",
    title: "Resultado Bikini Olympia 2026: campeã, Top 10 e Elisa Pecini",
    metaTitle: "Resultado Bikini Olympia 2026: Campeã, Top 10 e Isa Pecini",
    metaDescription:
      "Quem ganhou a Bikini Olympia 2026 e como ficaram Elisa (Isa) Pecini, Nivea Campos e Bruna Toigo. Final no sábado, 26/09, a partir das 23h de Brasília.",
    excerpt:
      "A Bikini Olympia 2026 é decidida no sábado, 26 de setembro. Maureen Blanquisco defende o título; campeã, top 10 e as três brasileiras entram aqui.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "3 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Bikini", "Elisa Pecini", "resultado", "fisiculturismo"],
    content: `${AVISO_ONDA2("O resultado da Bikini Olympia 2026 ainda não foi definido.")}
<p><strong>A Bikini ainda não aconteceu.</strong> As prévias começam às <strong>13h30 de sábado, 26 de setembro</strong> (Brasília), e a final a partir das <strong>23h</strong>, em Las Vegas. Maureen Blanquisco (Filipinas) defende o título. O Brasil tem três atletas: <strong>Elisa Pecini</strong>, a Isa Pecini, campeã em 2019, <strong>Nivea Campos</strong> e <strong>Bruna Toigo</strong>.</p>
<!--OLYMPIA_CONTAGEM:bikini-->
${CAPA("resultado-bikini-olympia-2026", "Capa: resultado da Bikini Olympia 2026 — Maureen Blanquisco defende o título e Elisa Pecini lidera as três brasileiras; final no sábado às 23h de Brasília")}

<h2 id="resultado">Resultado Bikini Olympia 2026</h2>
${TABELA_PENDENTE(10)}
<p><em>Tabela preenchida com o resultado oficial da IFBB Pro League, depois da final. Se só o top 5 for divulgado na noite, só o top 5 entra.</em></p>

<h2>Em que posição Elisa Pecini ficou?</h2>
<p><strong>Ainda não há resultado.</strong> Elisa Pecini, conhecida como Isa Pecini, venceu a Bikini Olympia em 2019 e tem vaga garantida por esse título. A colocação de 2026 entra aqui logo após a final de sábado.</p>

<h2>Como ficaram as brasileiras?</h2>
<table><thead><tr><th>Atleta</th><th>Representação no roster</th><th>Resultado</th></tr></thead><tbody>
${ATLETAS_BRASIL.filter((x) => x.categoria === "bikini").map((x) => `<tr><td>${x.nome}</td><td>${x.representacao}</td><td>${x.resultado ?? "A definir"}</td></tr>`).join("")}
</tbody></table>
<p>As três aparecem no roster oficial representando o Brasil. Os brasileiros de todas as categorias estão no <a href="/blog/brasileiros-mr-olympia-2026">painel Brasil do Mr. Olympia 2026</a>.</p>

<h2>Quem ganhou a Bikini Olympia 2026?</h2>
<p><strong>Ainda não foi decidido.</strong> Em 2025, o pódio foi Maureen Blanquisco, Ashlyn Little (EUA) e Jasmine Gonzalez (EUA). As três voltam como referências da categoria.</p>

<h2>Top 10</h2>
<p>Ainda não definido. A tabela no topo recebe o top 10 oficial assim que a IFBB Pro League publicar.</p>

<h2 id="como-foram-as-previas">Como foram as prévias?</h2>
<p>As prévias ainda não aconteceram. Depois delas, esta seção vai registrar quem foi chamada para as primeiras comparações, sem transformar chamado em colocação.</p>

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
<p>Na mesma noite saem a <a href="/blog/resultado-mens-physique-olympia-2026">Men's Physique</a> e o <a href="/blog/resultado-mr-olympia-open-2026">Open</a>. As campeãs e os campeões de todas as categorias estão em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-bikini-olympia-2026")}

${CTA_MONTINHO}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Bikini Olympia 2026?", answer: "Ainda não foi decidido. A final é no sábado, 26 de setembro, a partir das 23h (Brasília). Maureen Blanquisco defende o título, e esta página é atualizada com o resultado oficial." },
      { question: "Isa Pecini ganhou a Bikini Olympia?", answer: "Em 2026, ainda não há resultado. Elisa (Isa) Pecini foi campeã da Bikini Olympia em 2019." },
      { question: "Quais brasileiras competem na Bikini Olympia 2026?", answer: "Elisa Pecini, Nivea Campos e Bruna Toigo, todas listadas pelo Brasil no roster oficial." },
    ],
  },
  /* ───────────────── 12. RESULTADO FIT MODEL ───────────────── */
  {
    slug: "resultado-fit-model-olympia-2026",
    title: "Resultado Fit Model Olympia 2026: campeã, Top 10 e Gabriela Queiroz",
    metaTitle: "Resultado Fit Model Olympia 2026: Gabriela Queiroz e Top 10",
    metaDescription:
      "Quem ganhou a Fit Model Olympia 2026, a estreia da categoria, e como ficou a brasileira Gabriela Queiroz. Prévias e final no sábado, 26/09, desde 13h30.",
    excerpt:
      "A Fit Model estreia no Olympia neste sábado, 26 de setembro, com prévias e final na mesma sessão. Campeã, top 10 e a posição de Gabriela Queiroz entram aqui.",
    category: "Fisiculturismo",
    tipo: "noticia",
    date: DATA,
    readTime: "4 min",
    author: AUTOR,
    tags: ["Mr. Olympia 2026", "Fit Model", "Gabriela Queiroz", "resultado", "fisiculturismo"],
    content: `${AVISO_ONDA2("O resultado da Fit Model Olympia 2026 ainda não foi definido.")}
<p><strong>⏳ Aguardando competição.</strong> A Fit Model Olympia 2026 acontece <strong>neste sábado, 26 de setembro</strong>, e é a estreia da categoria no Olympia. As prévias e a final estão programadas para a mesma sessão, iniciada às <strong>13h30 de Brasília</strong> (9h30 em Las Vegas). A brasileira <strong>Gabriela Queiroz</strong> está entre as classificadas. O resultado entra nesta página assim que for confirmado.</p>
<!--OLYMPIA_CONTAGEM:fit-model-->
${CAPA("resultado-fit-model-olympia-2026", "Capa: resultado da Fit Model Olympia 2026 — estreia da categoria no Olympia, com a brasileira Gabriela Queiroz; prévias e final no sábado a partir das 13h30 de Brasília")}

<h2 id="resultado">Resultado Fit Model Olympia 2026</h2>
${TABELA_PENDENTE(5)}
<p><em>Tabela preenchida com o resultado oficial da IFBB Pro League. Se a classificação completa for divulgada, a tabela cresce até o top 10; se não, fica no que foi oficializado.</em></p>

<h2 id="gabriela">Em que posição Gabriela Queiroz ficou no Olympia 2026?</h2>
<p><strong>A posição de Gabriela Queiroz ainda não foi definida.</strong> A brasileira aparece no roster oficial da competição <strong>representando os Estados Unidos</strong>, por isso a classificação oficial vai mostrar "EUA" ao lado do nome dela. Gabriela se classificou para o Olympia com o título do Wasatch Warrior Pro 2026 e chega à estreia da categoria entre as vencedoras de shows profissionais da temporada.</p>
<p>Ela é a única brasileira na Fit Model. Os outros brasileiros do fim de semana estão no <a href="/blog/brasileiros-mr-olympia-2026">painel dos brasileiros no Mr. Olympia 2026</a>.</p>

<h2>Quem ganhou a Fit Model Olympia 2026?</h2>
<p><strong>Ainda não foi decidido.</strong> Como é a primeira Fit Model do Olympia, não há campeã anterior para defender o título: a primeira vencedora da história da categoria no evento sai neste sábado. Entram as atletas que venceram shows profissionais da Fit Model na temporada (a categoria não usa sistema de pontos).</p>

<h2>Top 5 / Top 10</h2>
<p>Ainda não definidos. Só entram aqui colocações oficiais. Nada de top 10 montado por palpite ou por ordem de chamada.</p>

<h2 id="como-foram-as-previas">Como foi a competição?</h2>
<p>A competição ainda não aconteceu. Durante a sessão, esta seção vai registrar só fatos verificados, como as chamadas para comparação. Chamado não é colocação.</p>

<h2 id="horario">Que horas acontece a Fit Model?</h2>
<ul>
<li><strong>Sábado, 26 de setembro</strong>, na sessão de prévias do Olympia, que começa às <strong>13h30 de Brasília</strong> (9h30 em Las Vegas).</li>
<li>A Fit Model tem <strong>prévias e final na mesma sessão</strong>, junto com as prévias de Men's Physique, Bikini, Fitness e Wheelchair.</li>
</ul>
<p>O bloco começa às 13h30 de Brasília, e a Fit Model terá prévias e finais durante essa sessão. A ordem das categorias não é publicada com antecedência: o horário exato em que a categoria sobe ao palco pode variar.</p>

<h2>Onde assistir?</h2>
<p>Pela OlympiaTV, transmissão oficial, gratuita com cadastro no site do evento.</p>

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
<p>Na noite de sábado saem a <a href="/blog/resultado-bikini-olympia-2026">Bikini</a>, a Men's Physique e o Open. Todas as campeãs e campeões ficam em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

${ACOMPANHE("resultado-fit-model-olympia-2026")}

${CTA_ROTINA}
${FONTES}`,
    faq: [
      { question: "Quem ganhou a Fit Model Olympia 2026?", answer: "Ainda não foi decidido. Prévias e final acontecem no sábado, 26 de setembro, na sessão que começa às 13h30 de Brasília. É a primeira Fit Model da história do Olympia." },
      { question: "Em que posição Gabriela Queiroz ficou?", answer: "A posição ainda não foi definida. Gabriela Queiroz, brasileira, aparece no roster oficial representando os Estados Unidos, e se classificou com o título do Wasatch Warrior Pro 2026." },
      { question: "Que horas é a Fit Model no Olympia?", answer: "No sábado, 26 de setembro, na sessão de prévias que começa às 13h30 de Brasília (9h30 em Las Vegas). A categoria tem prévias e final nessa mesma sessão; o horário exato depende da ordem do bloco." },
      { question: "Qual a diferença entre Fit Model e Bikini?", answer: "A Fit Model pede menos massa muscular e menos definição que a Bikini, com foco num físico equilibrado e atlético de modelo fitness." },
    ],
  },
];
