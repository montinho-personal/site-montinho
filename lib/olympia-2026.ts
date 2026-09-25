import type { BlogPost } from "./blog";

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

<h2>Como funciona a decisão: prévias e final</h2>
<p>Na <strong>prévia (prejudging)</strong>, os juízes comparam os atletas em grupos, nas poses obrigatórias, e é ali que a maior parte da nota se forma. Na <strong>final</strong>, cada um faz a rotina de posing e há novas comparações; o resultado é anunciado no palco. Por isso o "quem ganhou" só existe depois da final, na noite de sexta no horário de Brasília. Detalhes do formato e da regra de peso: <a href="/blog/ramon-dino-peso-altura">limite de peso da Classic Physique</a>.</p>

<h2>As outras categorias</h2>
<p>Na mesma noite são decididas Wellness (<a href="/blog/resultado-wellness-mr-olympia-2026">resultado da Wellness 2026</a>), 212, Figure, Women's Physique e Ms. Olympia. O Open, título máximo do evento, é decidido no sábado (<a href="/blog/resultado-mr-olympia-open-2026">resultado do Mr. Olympia Open 2026</a>). Todos os campeões ficam reunidos em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>.</p>

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

<h2>Campeões do Mr. Olympia 2026</h2>
<table><thead><tr><th>Categoria</th><th>Final</th><th>Campeão(ã) 2026</th><th>Campeão(ã) 2025</th><th>Resultado</th></tr></thead><tbody>
<tr><td>Classic Physique</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Ramon Dino (BRA)</td><td><a href="/blog/resultado-classic-physique-mr-olympia-2026">Ver resultado</a></td></tr>
<tr><td>Wellness</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Eduarda Bezerra (BRA)</td><td><a href="/blog/resultado-wellness-mr-olympia-2026">Ver resultado</a></td></tr>
<tr><td>212</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Keone Pearson (EUA)</td><td>Nesta página</td></tr>
<tr><td>Figure</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Rhea Gayle (GBR)</td><td>Nesta página</td></tr>
<tr><td>Women's Physique</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Natalia Abraham Coelho (EUA)</td><td>Nesta página</td></tr>
<tr><td>Ms. Olympia</td><td>Sex 25/09, 22h</td><td>A definir</td><td>Andrea Shaw (EUA)</td><td>Nesta página</td></tr>
<tr><td>Fitness</td><td>Sáb 26/09, 23h</td><td>A definir</td><td>Michelle Fredua-Mensah (GBR)</td><td>Nesta página</td></tr>
<tr><td>Men's Physique</td><td>Sáb 26/09, 23h</td><td>A definir</td><td>Ryan Terry (GBR)</td><td>Nesta página</td></tr>
<tr><td>Bikini</td><td>Sáb 26/09, 23h</td><td>A definir</td><td>Maureen Blanquisco (PHI)</td><td>Nesta página</td></tr>
<tr><td>Mr. Olympia (Open)</td><td>Sáb 26/09, 23h</td><td>A definir</td><td>Derek Lunsford (EUA)</td><td><a href="/blog/resultado-mr-olympia-open-2026">Ver resultado</a></td></tr>
</tbody></table>
<p><em>Wheelchair e Fit Model também são decididas no sábado e entram aqui com o resultado oficial. Horários são o início de cada sessão de finais.</em></p>

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
<ul>
<li><strong>Ramon Dino</strong> — atual campeão da Classic Physique, primeiro brasileiro a vencer o Mr. Olympia. Pesou 102,5 kg na pesagem oficial (<a href="/blog/ramon-dino-peso-altura">peso, altura e limite</a>).</li>
<li><strong>Eduarda Bezerra</strong> — atual campeã da Wellness, categoria em que o Brasil venceu todas as cinco edições desde 2021 e tem 19 das 40 inscritas em 2026.</li>
<li><strong>Isa Pereira Nunes</strong> (campeã Wellness 2024) e <strong>Rayane Fogal</strong> (campeã do Arnold Ohio e do Arnold UK 2026) completam as principais candidatas brasileiras.</li>
</ul>

<h2>Quem chega como favorito no Open</h2>
<p>Derek Lunsford (EUA) defende o título de 2025, ano em que não perdeu nenhuma competição. Samson Dauda (campeão de 2024), Andrew Jacked (terceiro em 2025 e invicto desde então), Nick Walker e Martin Fitzwater são os mais citados para o primeiro chamado. Hadi Choopan, vice três vezes seguidas, desistiu em agosto. A análise completa está em <a href="/blog/resultado-mr-olympia-open-2026">resultado do Mr. Olympia Open 2026</a>.</p>

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

<h2>Todas as categorias</h2>
<p>Os campeões de sexta e sábado ficam reunidos em <a href="/blog/quem-ganhou-mr-olympia-2026">quem ganhou o Mr. Olympia 2026</a>, incluindo a <a href="/blog/resultado-wellness-mr-olympia-2026">Wellness, com as brasileiras</a>.</p>

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
<p>Ramon compete com um limite de peso e mesmo assim precisa parecer maior a cada ano. A resposta não é "mais peso": é mais músculo no mesmo peso, com menos gordura e melhor distribuição. Para quem treina em academia comum, a lição é a mesma: a balança sozinha diz pouco; o que muda o corpo é a composição. Se você quer saber quanto músculo o seu corpo comporta sem hormônios, a <a href="/ferramentas/potencial-natural">Calculadora de Potencial Natural</a> estima isso pela altura e pela estrutura, e o artigo sobre <a href="/blog/quanto-tempo-para-ganhar-massa-muscular">quanto tempo leva para ganhar massa muscular</a> mostra o ritmo realista.</p>

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
];
