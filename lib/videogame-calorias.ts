import type { BlogPost } from "./blog";
import { kcalPorMinuto } from "./polichinelo";
import { TIPOS as TIPOS_MUSCULACAO } from "./musculacao";
import { RITMOS as RITMOS_CAMINHADA } from "./caminhada";

/**
 * "Jogar videogame gasta calorias?" (20/11/2026), no gancho do lançamento do
 * GTA 6 (19/11/2026). Pauta pedida pelo Montinho.
 *
 * Pesquisa (SerpApi, celular, São Paulo, 20/11/2026):
 * docs/seo/serp/jogar-videogame-gasta-calorias-2026-11-20.json. A primeira
 * página só tinha resultados estrangeiros (italiano, francês, turco, russo,
 * espanhol): não há página em português respondendo.
 *
 * Canibalização: nenhum artigo de videogame no acervo (busca normalizada por
 * "videogame", "video game", "game", "gta", "jogo"). Vizinhos linkados:
 * como-sair-do-sedentarismo, exercicio-que-mais-queima-calorias.
 *
 * Números: METs do 2024 Adult Compendium of Physical Activities, categoria
 * Video Games (22) e Inactivity (07), consultados em 20/11/2026 em
 * pacompendium.com. Gasto pela equação da ACSM (kcal/min = MET × 3,5 × peso
 * ÷ 200), a mesma das calculadoras do site. Nada é escrito à mão: as tabelas
 * saem das constantes abaixo.
 *
 * Fora por falta de fonte: o "estudo" de 210 kcal por hora que a visão de IA
 * cita (levantamento de uma plataforma de apostas com 50 jogadores, sem
 * publicação científica) e qualquer detalhe do GTA 6 além da data de
 * lançamento, que tem vários veículos.
 *
 * Ferramenta: cartão de link da Calculadora de Déficit (ARTIGOS_COM_LINK_DEFICIT):
 * o leitor sai com a conta "quanto o meu dia gasta".
 */

const P = 70;
const PESOS = [60, 70, 80, 90] as const;

/** Compêndio 2024, códigos e METs. */
const SENTADO_TV = { codigo: "07020", met: 1.0, nome: "Sentado vendo TV" };
const VG_PARADO = { codigo: "22040", met: 1.3, nome: "Videogame sentado, com controle (parado)" };
const VG_LEVE = { codigo: "22120", met: 1.5, nome: "Videogame com controle, esforço leve" };
const VG_ATIVO_BRACOS = { codigo: "22200", met: 3.0, nome: "Jogo de movimento, só com os braços" };
const VG_ATIVO_CORPO = { codigo: "22240", met: 4.0, nome: "Jogo de movimento, corpo todo (moderado)" };
const VG_DANCA = { codigo: "22320", met: 7.5, nome: "Exergame, treino ou dança (vigoroso)" };
const MUSC = TIPOS_MUSCULACAO.find((t) => t.id === "tradicional")!;
const RITMO_CAM = RITMOS_CAMINHADA.find((r) => r.id === "moderado")!;
const CAMINHADA = { met: RITMO_CAM.met, nome: `Caminhada a ${RITMO_CAM.velocidade} km/h` };

const porHora = (met: number, peso = P) => kcalPorMinuto(met, peso) * 60;
const dez = (n: number) => (Math.round(n / 10) * 10).toLocaleString("pt-BR");
const met1 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** O que jogar acrescenta ao que você gastaria parado (MET 1,0). */
const extraPorHora = (met: number, peso = P) => porHora(met - SENTADO_TV.met, peso);
const HORAS_SESSAO = 4;
const EXTRA_SESSAO = extraPorHora(VG_PARADO.met) * HORAS_SESSAO;
const CAMINHADA_EQUIV_MIN = EXTRA_SESSAO / kcalPorMinuto(CAMINHADA.met - SENTADO_TV.met, P);

const LINHAS = [SENTADO_TV, VG_PARADO, VG_LEVE, VG_ATIVO_BRACOS, VG_ATIVO_CORPO, VG_DANCA];

const tabelaVideogame = `<table>
<thead><tr><th>Atividade (Compêndio 2024)</th><th>MET</th>${PESOS.map((p) => `<th>${p} kg</th>`).join("")}</tr></thead>
<tbody>
${LINHAS.map((l) => `<tr><td>${l.nome}</td><td>${met1(l.met)}</td>${PESOS.map((p) => `<td>≈ ${dez(porHora(l.met, p))}</td>`).join("")}</tr>`).join("\n")}
</tbody>
</table>`;

const tabelaComparacao = `<table>
<thead><tr><th>1 hora de…</th><th>Calorias, ${P} kg</th><th>A mais do que ficar parado</th></tr></thead>
<tbody>
<tr><td>GTA ou outro jogo, sentado no sofá</td><td>≈ ${dez(porHora(VG_PARADO.met))} kcal</td><td>≈ ${dez(extraPorHora(VG_PARADO.met))} kcal</td></tr>
<tr><td>${CAMINHADA.nome}</td><td>≈ ${dez(porHora(CAMINHADA.met))} kcal</td><td>≈ ${dez(extraPorHora(CAMINHADA.met))} kcal</td></tr>
<tr><td>Musculação tradicional</td><td>≈ ${dez(porHora(MUSC.met))} kcal</td><td>≈ ${dez(extraPorHora(MUSC.met))} kcal</td></tr>
<tr><td>Jogo de dança ou exergame vigoroso</td><td>≈ ${dez(porHora(VG_DANCA.met))} kcal</td><td>≈ ${dez(extraPorHora(VG_DANCA.met))} kcal</td></tr>
</tbody>
</table>`;

export const VIDEOGAME_CALORIAS_POSTS: BlogPost[] = [
  {
    slug: "jogar-videogame-gasta-calorias",
    title: "Jogar Videogame Gasta Calorias? Quanto Queima 1 Hora de Jogo",
    metaTitle: "Jogar Videogame Gasta Calorias? Quanto Queima 1 Hora",
    metaDescription: `Uma hora de videogame sentado gasta perto de ${dez(porHora(VG_PARADO.met))} kcal para ${P} kg, quase o mesmo que ficar parado. Veja por peso, jogos de movimento e a maratona de GTA.`,
    excerpt:
      "Quanto gasta jogar videogame sentado, por peso; a diferença para jogos de movimento; o que uma maratona de GTA 6 faz com o seu dia; e se videogame emagrece.",
    category: "Emagrecimento",
    date: "2026-11-20",
    readTime: "5 min",
    author: "Montinho",
    tags: ["videogame", "calorias", "gasto calórico", "sedentarismo", "GTA 6"],
    faq: [
      {
        question: "Jogar videogame gasta calorias?",
        answer: `Gasta, mas pouco. Pelo Compêndio de Atividades Físicas, jogar sentado com controle vale ${met1(VG_PARADO.met)} MET, quase o mesmo que ficar sentado vendo TV (${met1(SENTADO_TV.met)}). Para ${P} kg, uma hora de jogo gasta perto de ${dez(porHora(VG_PARADO.met))} kcal, só cerca de ${dez(extraPorHora(VG_PARADO.met))} a mais do que ficar parado.`,
      },
      {
        question: "Quantas calorias gasta 1 hora de videogame?",
        answer: `Sentado, com controle: cerca de ${dez(porHora(VG_PARADO.met, 60))} kcal para 60 kg, ${dez(porHora(VG_PARADO.met, 70))} para 70 kg, ${dez(porHora(VG_PARADO.met, 80))} para 80 kg e ${dez(porHora(VG_PARADO.met, 90))} para 90 kg, pelo Compêndio de Atividades Físicas. A maior parte disso o corpo gastaria mesmo parado.`,
      },
      {
        question: "Jogar videogame emagrece?",
        answer: "Jogar sentado, não. O gasto quase não muda em relação a ficar parado. Jogos de movimento, como os de dança e de fitness, gastam bem mais e podem entrar como atividade física. O que emagrece é a semana fechar em déficit, e longas sessões sentado costumam ir na direção contrária: mais tempo parado e mais beliscos.",
      },
      {
        question: "Quantas calorias gasta uma maratona de GTA 6?",
        answer: `Para ${P} kg, ${HORAS_SESSAO} horas jogando sentado gastam cerca de ${dez(porHora(VG_PARADO.met) * HORAS_SESSAO)} kcal, mas só perto de ${dez(EXTRA_SESSAO)} a mais do que ficar parado. Esse extra das ${HORAS_SESSAO} horas é o que uma caminhada de uns ${Math.round(CAMINHADA_EQUIV_MIN)} minutos acrescenta.`,
      },
      {
        question: "Jogo de dança ou de movimento queima calorias?",
        answer: `Queima, e bem mais. O Compêndio dá ${met1(VG_ATIVO_CORPO.met)} MET para jogos de movimento com o corpo todo em ritmo moderado e ${met1(VG_DANCA.met)} para exergames, treinos e dança vigorosos. Para ${P} kg, isso é perto de ${dez(porHora(VG_ATIVO_CORPO.met))} e ${dez(porHora(VG_DANCA.met))} kcal por hora.`,
      },
      {
        question: "Jogar videogame engorda?",
        answer: "O jogo em si não, porque o gasto é quase o mesmo de ficar parado. O que pesa é o que vem junto: horas seguidas sentado, refrigerante e lanche ao lado do controle e sono mais curto. Se a semana fecha acima do que você gasta, o peso sobe, com ou sem videogame.",
      },
    ],
    content: `<img src="/blog-images/jogar-videogame-gasta-calorias-capa.webp" alt="Capa: Videogame queima? Quanto gasta 1 hora jogando. Ilustração de um controle de videogame com uma chama" title="Jogar Videogame Gasta Calorias? Quanto Queima 1 Hora de Jogo — Montinho Personal Trainer" width="1536" height="1024" loading="eager" decoding="async" style="width:100%;height:auto;border-radius:8px;"/>

<p><strong>Jogar videogame gasta calorias?</strong> Gasta, mas quase nada além do que o corpo gastaria parado. Pelo Compêndio de Atividades Físicas, jogar sentado com controle vale <strong>${met1(VG_PARADO.met)} MET</strong>, contra ${met1(SENTADO_TV.met)} de ficar sentado vendo TV. Para uma pessoa de ${P} kg, uma hora de jogo gasta perto de <strong>${dez(porHora(VG_PARADO.met))} kcal</strong>, e só cerca de ${dez(extraPorHora(VG_PARADO.met))} a mais do que ficar parado.</p>
<p>Com o lançamento do GTA 6, em 19 de novembro de 2026, muita gente vai passar a noite (ou o fim de semana) no sofá. Vale saber o que isso faz com o gasto do dia, e onde está a diferença de verdade: nos jogos de movimento.</p>

<h2>Quantas calorias gasta 1 hora de videogame?</h2>
<p>Depende do jogo e do seu peso. O Compêndio, a referência científica usada pelas calculadoras do site, separa o videogame parado dos jogos de movimento:</p>
${tabelaVideogame}
<p>Calorias por hora, pela equação da ACSM (MET × 3,5 × peso ÷ 200). Jogar GTA, futebol ou qualquer jogo sentado, com controle, cai nas duas primeiras linhas de videogame: um pouco acima de ficar vendo TV, e só.</p>

<h2>Uma hora de GTA x uma hora de academia</h2>
<p>A coluna que importa é a da direita: quanto a atividade acrescenta ao que você gastaria parado.</p>
${tabelaComparacao}
<p>Uma hora de musculação gasta perto de ${Math.round(extraPorHora(MUSC.met) / extraPorHora(VG_PARADO.met))} vezes o extra de uma hora de jogo no sofá. E a musculação ainda faz o que nenhuma calculadora mostra: preserva e constrói músculo.</p>

<h2>Quanto gasta uma maratona de GTA 6?</h2>
<p>Para ${P} kg, <strong>${HORAS_SESSAO} horas jogando sentado</strong> gastam cerca de ${dez(porHora(VG_PARADO.met) * HORAS_SESSAO)} kcal no total, mas só perto de <strong>${dez(EXTRA_SESSAO)} kcal a mais</strong> do que ficar parado o mesmo tempo. Esse extra das ${HORAS_SESSAO} horas é o que uma caminhada de uns ${Math.round(CAMINHADA_EQUIV_MIN)} minutos acrescenta.</p>
<p>O problema da maratona não é o que ela deixa de gastar, é o que ela costuma trazer: refrigerante, lanche ao lado do controle, sono mais curto e um dia inteiro com o corpo parado. Uma pausa a cada hora para levantar, andar pela casa e alongar já quebra o tempo sentado. Veja <a href="/blog/como-sair-do-sedentarismo">como sair do sedentarismo</a>.</p>

<h2>Jogar videogame emagrece?</h2>
<p>Jogar sentado, não: o gasto quase não muda. Jogos de movimento são outra história. Os de dança, fitness e realidade virtual em ritmo forte chegam a ${met1(VG_DANCA.met)} MET no Compêndio, perto de ${dez(porHora(VG_DANCA.met))} kcal por hora para ${P} kg, mais do que uma aula de musculação. Para quem não gosta de academia, podem ser uma porta de entrada para se mexer.</p>
<p>Mas emagrecer depende da semana inteira fechar em déficit, não de uma atividade isolada. Para ter uma ideia de quanto o seu dia gasta e quanto comer, use a <a href="/ferramentas/calculadora-deficit-calorico">Calculadora de Déficit Calórico</a>.</p>

<h2>Jogar videogame engorda?</h2>
<p>O jogo em si não engorda. O que pesa é o que vem junto: muitas horas seguidas sentado, bebida açucarada e lanche ao lado do controle, e sono mais curto quando a partida entra pela madrugada. Se a semana termina acima do que você gasta, o peso sobe, com ou sem videogame.</p>

<h2>Dá para jogar e treinar?</h2>
<p>Dá, e muita gente faz isso. O jogo é lazer; o treino é o que mantém o corpo funcionando. Três treinos de musculação por semana e um pouco de caminhada nos outros dias cabem na rotina de quem joga à noite. A comparação entre os exercícios que mais gastam está em <a href="/blog/exercicio-que-mais-queima-calorias">exercício que mais queima calorias</a>.</p>

<h2>Não se compare</h2>
<p>Não se compare com o personagem do jogo nem com quem passa o dia na academia. Cada um tem a própria genética, rotina e história, com altos e baixos. O que funciona é achar um jeito de treinar que dê para manter junto com o resto da vida, inclusive com as noites de videogame. Se quiser ajuda para montar isso, conheça a <a href="/consultoria-online">consultoria online</a>.</p>

<h2>Fontes</h2>
<ul>
<li><a href="https://pacompendium.com/video-games/" target="_blank" rel="noopener noreferrer">Herrmann SD, et al. 2024 Adult Compendium of Physical Activities: Video Games</a> (códigos 22040, 22120, 22200, 22240, 22320)</li>
<li><a href="https://pacompendium.com/inactivity/" target="_blank" rel="noopener noreferrer">2024 Adult Compendium of Physical Activities: Inactivity</a> (código 07020, sentado vendo TV)</li>
<li>American College of Sports Medicine. ACSM's Guidelines for Exercise Testing and Prescription (kcal/min = MET × 3,5 × peso ÷ 200)</li>
</ul>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/exercicio-que-mais-queima-calorias">Exercício que mais queima calorias</a></li>
<li><a href="/blog/como-sair-do-sedentarismo">Como sair do sedentarismo</a></li>
<li><a href="/blog/exercicio-para-sedentario">Exercício para sedentário: como começar do zero</a></li>
</ul>`,
  },
];
