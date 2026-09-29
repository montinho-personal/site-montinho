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
<li>Veículos consultados para a abertura das inscrições e os números de 2025: Sua Corrida, Mania de Corrida, Esportividade, CNN Brasil, NSC Total.</li>
</ul>`;

export const SAO_SILVESTRE_2026_POSTS: BlogPost[] = [
  {
    slug: "inscricao-sao-silvestre-2026",
    title: "Inscrição São Silvestre 2026: data, preço e como se inscrever",
    metaTitle: "Inscrição São Silvestre 2026: Data, Preço e Como Fazer",
    metaDescription:
      "As inscrições da 101ª São Silvestre abrem em 30/09, às 10h, pela Ticket Sports, sem sorteio. Veja o passo a passo, os valores de referência e como treinar os 15 km.",
    excerpt:
      "As inscrições da 101ª São Silvestre abrem na quarta, 30 de setembro, às 10h, sem sorteio. O passo a passo, o que se sabe do preço e quanto tempo dá para treinar até 31 de dezembro.",
    category: "Treinamento",
    tipo: "noticia",
    date: "2026-09-26",
    readTime: "5 min",
    author: AUTOR,
    tags: ["São Silvestre", "São Silvestre 2026", "inscrição", "corrida de rua", "15 km"],
    content: `<blockquote><p><strong>As inscrições abrem na quarta-feira, 30 de setembro de 2026, às 10h (Brasília).</strong> Os valores de 2026 ainda não foram divulgados; esta página é atualizada quando saírem. Última verificação: 26 de setembro de 2026.</p></blockquote>
<p>A <strong>101ª Corrida Internacional de São Silvestre</strong> acontece na <strong>quinta-feira, 31 de dezembro de 2026</strong>, na região central de São Paulo, com os tradicionais <strong>15 km</strong>. É a primeira edição depois do centenário, comemorado em 2025. As inscrições abrem em <strong>30 de setembro, às 10h</strong>, por venda direta — <strong>sem sorteio</strong> — na plataforma oficial, a Ticket Sports by Ingresse.</p>

<h2>Resumo da São Silvestre 2026</h2>
<table><thead><tr><th>Item</th><th>O que se sabe</th></tr></thead><tbody>
<tr><td>Edição</td><td>101ª</td></tr>
<tr><td>Data da prova</td><td>Quinta-feira, 31/12/2026, pela manhã</td></tr>
<tr><td>Distância</td><td>15 km</td></tr>
<tr><td>Largada e chegada</td><td>Avenida Paulista, em pontos diferentes (altura dos números 2.000 e 900)</td></tr>
<tr><td>Abertura das inscrições</td><td>30/09/2026, às 10h</td></tr>
<tr><td>Forma de inscrição</td><td>Venda direta, sem sorteio, pela Ticket Sports by Ingresse</td></tr>
<tr><td>Preço 2026</td><td>A confirmar (veja os valores de 2025 abaixo)</td></tr>
</tbody></table>

<h2>Como se inscrever: passo a passo</h2>
<ol>
<li><strong>Faça o pré-cadastro antes de quarta.</strong> A organização abriu um pré-cadastro para quem quer se inscrever. Deixar nome, CPF e dados de contato prontos economiza minutos no momento em que as vagas abrem.</li>
<li><strong>Entre pelo site oficial.</strong> Acesse <a href="https://www.saosilvestre.com.br/" target="_blank" rel="noopener noreferrer">saosilvestre.com.br</a> e siga o link para a inscrição. Desconfie de links recebidos por mensagem: todo ano aparecem páginas falsas imitando a da prova.</li>
<li><strong>Escolha o kit.</strong> Em 2025 havia três opções, com preços diferentes (tabela abaixo).</li>
<li><strong>Pague e guarde o comprovante.</strong> A confirmação chega por e-mail; a retirada do kit acontece nos dias anteriores à prova, com data e local divulgados pela organização.</li>
</ol>

<h2>Quanto custa a inscrição?</h2>
<p>Os valores de 2026 ainda não foram anunciados. Como referência, em 2025 — a edição do centenário — os kits custaram:</p>
<table><thead><tr><th>Kit (2025)</th><th>Valor</th></tr></thead><tbody>
<tr><td>Geral</td><td>R$ 319,90</td></tr>
<tr><td>Centenário</td><td>R$ 439,90</td></tr>
<tr><td>Premium</td><td>R$ 990,90</td></tr>
</tbody></table>
<p>Em 2025 foram abertas cerca de <strong>50 mil vagas</strong>. O número de 2026 entra aqui quando for divulgado.</p>

<h2>Horários da largada</h2>
<p>Os horários de 2026 ainda serão confirmados no regulamento. Em 2025, foram: cadeirantes às 7h25, elite feminina às 7h40, elite masculina às 8h05, pelotão Premium às 8h08 e pelotão geral às 8h10.</p>

<h2>Dá tempo de treinar até 31 de dezembro?</h2>
<p>Da abertura das inscrições até a prova são cerca de <strong>13 semanas</strong>. Para quem já corre 5 km sem parar, é tempo suficiente para chegar aos 15 km com segurança, aumentando o volume aos poucos e incluindo treino de força para as pernas — é ele que segura a subida da Brigadeiro Luís Antônio, na reta final. Para quem ainda não corre, dá para completar a prova alternando corrida e caminhada; o guia de <a href="/blog/corrida-para-iniciantes">corrida para iniciantes</a> mostra como começar sem se machucar.</p>
<p>Quer saber quanto tempo você levaria? O <a href="/ferramentas/previsor-sao-silvestre">Previsor da São Silvestre</a> parte do seu tempo em 5 km, 10 km ou meia e mostra o tempo provável nos 15 km, com a subida na conta.</p>

<h2>Quem ganhou em 2025</h2>
<p>Na 100ª edição, <strong>Muse Gizachew</strong> (Etiópia) venceu no masculino, com 44min28s, e <strong>Sisilia Panga</strong> (Tanzânia) no feminino, com 51min08s. Os melhores brasileiros foram <strong>Fábio Jesus</strong> e <strong>Núbia Oliveira</strong>, ambos em 3º lugar.</p>

<h2>Corra a sua prova</h2>
<p>Na São Silvestre, cada um corre contra o próprio relógio. Não se compare com quem está do lado: a sua genética, a sua rotina e a sua história são só suas. O que faz diferença é um plano que você consiga seguir até dezembro — e depois dele. Se quiser montar esse plano comigo, com força e corrida no mesmo treino, <a href="/consultoria-online">conheça o acompanhamento</a> ou fale comigo pelo WhatsApp no fim da página.</p>

${FONTES_SS}`,
    faq: [
      { question: "Quando abrem as inscrições da São Silvestre 2026?", answer: "Na quarta-feira, 30 de setembro de 2026, às 10h (Brasília), por venda direta, sem sorteio, na plataforma Ticket Sports by Ingresse." },
      { question: "Quanto custa a inscrição da São Silvestre 2026?", answer: "Os valores de 2026 ainda não foram divulgados. Em 2025, o kit Geral custou R$ 319,90, o Centenário R$ 439,90 e o Premium R$ 990,90." },
      { question: "Quando é a São Silvestre 2026?", answer: "Na quinta-feira, 31 de dezembro de 2026, pela manhã, em São Paulo, com largada e chegada na Avenida Paulista." },
      { question: "Quantos quilômetros tem a São Silvestre?", answer: "15 km, com largada e chegada na Avenida Paulista. O trecho mais difícil é a subida da Avenida Brigadeiro Luís Antônio, na parte final." },
      { question: "Tem sorteio para a São Silvestre?", answer: "Não. Em 2026 a inscrição é por venda direta, enquanto houver vagas." },
    ],
  },
];
