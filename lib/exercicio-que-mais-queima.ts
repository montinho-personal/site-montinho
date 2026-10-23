import type { BlogPost } from "./blog";
import { COMPARADOR, FONTE_HALL, KCAL_POR_KG_GORDURA, comparaAtividades, kcalPorMinuto } from "./atividades";
import { TIPOS as TIPOS_MUSCULACAO } from "./musculacao";
import { ESTACOES as ESTACOES_HYROX } from "./hyrox";
import { metCorrida } from "./corrida";

/**
 * "Exercício que mais queima calorias" (880 buscas/mês no export de 23/10)
 * e "esporte que mais queima calorias", na mesma página: a intenção é a
 * mesma, o ranking.
 *
 * Nenhum número é escrito à mão. A tabela sai do comparador de atividades
 * (lib/atividades.ts), que importa o MET de cada calculadora do site; a
 * musculação vem de lib/musculacao.ts e o remo, da estação do Hyrox. Se
 * uma calculadora mudar o MET, o artigo muda junto e não discorda dela.
 */

const PESOS = [60, 70, 80, 90] as const;
const P = 70;
const mil = (n: number) => Math.round(n).toLocaleString("pt-BR");
const dez = (n: number) => (Math.round(n / 10) * 10).toLocaleString("pt-BR");
const met1 = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const porHora = (met: number, peso: number) => kcalPorMinuto(met, peso) * 60;
const minutosPara = (kcal: number, met: number, peso = P) => kcal / kcalPorMinuto(met, peso);
const hm = (min: number) => {
  const t = Math.round(min);
  return t >= 60 ? `${Math.floor(t / 60)}h${String(t % 60).padStart(2, "0")}` : `${t} min`;
};

const MUSC_TRAD = TIPOS_MUSCULACAO.find((t) => t.id === "tradicional")!;
const MUSC_CIRC = TIPOS_MUSCULACAO.find((t) => t.id === "circuito")!;
const REMO = ESTACOES_HYROX.find((e) => e.id === "remo")!;
const CORRIDA_12 = metCorrida(12);

type Linha = { nome: string; ritmo: string; met: number; href: string };
const LINHAS: Linha[] = [
  ...COMPARADOR.map((a) => ({ nome: a.nome, ritmo: a.ritmo, met: a.met, href: a.href })),
  { nome: "Remo ergométrico", ritmo: "esforço moderado", met: REMO.met, href: "/ferramentas/calculadora-calorias-hyrox" },
  { nome: "Musculação", ritmo: "circuito, quase sem pausa", met: MUSC_CIRC.met, href: "/ferramentas/calculadora-calorias-musculacao" },
  { nome: "Musculação", ritmo: "tradicional, com descanso", met: MUSC_TRAD.met, href: "/ferramentas/calculadora-calorias-musculacao" },
].sort((a, b) => b.met - a.met);

const TOP = LINHAS.slice(0, 5);
const linha = (id: string) => COMPARADOR.find((a) => a.id === id)!;
const CORDA = linha("corda"), CORRIDA = linha("corrida"), JIU = linha("jiujitsu"), ESCADA = linha("escada"), BIKE = linha("bicicleta");
const CAMINHADA = linha("caminhada"), ELIPTICO = linha("eliptico"), NATACAO = linha("natacao"), BOXE = linha("boxe"), FUTEBOL = linha("futebol");
const SPINNING = linha("spinning"), POLICHINELO = linha("polichinelos"), CROSSFIT = linha("crossfit");

const tabelaRanking = `<table>
<thead><tr><th>Exercício</th><th>Ritmo</th>${PESOS.map((p) => `<th>${p} kg</th>`).join("")}</tr></thead>
<tbody>
${LINHAS.map((l) => `<tr><td><a href="${l.href}">${l.nome}</a></td><td>${l.ritmo}</td>${PESOS.map((p) => `<td>≈ ${dez(porHora(l.met, p))}</td>`).join("")}</tr>`).join("\n")}
</tbody>
</table>`;

const ALVOS = [200, 300, 500] as const;
const PARA_ALVOS = [CORRIDA, CORDA, BIKE, CAMINHADA];
const tabelaAlvos = `<table>
<thead><tr><th>Para gastar…</th>${PARA_ALVOS.map((a) => `<th>${a.nome}</th>`).join("")}</tr></thead>
<tbody>
${ALVOS.map((k) => `<tr><td>${k} kcal</td>${PARA_ALVOS.map((a) => `<td>${hm(minutosPara(k, a.met))}</td>`).join("")}</tr>`).join("\n")}
</tbody>
</table>`;

const r15 = comparaAtividades(15, P).slice(0, 5);
const MIL_CORRIDA_12 = minutosPara(1000, CORRIDA_12);
const MIL_CORDA = minutosPara(1000, CORDA.met);
const MIL_CAMINHADA = minutosPara(1000, CAMINHADA.met);
const KG_CORRIDA = minutosPara(KCAL_POR_KG_GORDURA, CORRIDA.met) / 60;
const KG_CAMINHADA_DIAS = minutosPara(KCAL_POR_KG_GORDURA, CAMINHADA.met) / 30;

export const EXERCICIO_QUEIMA_POSTS: BlogPost[] = [
  {
    slug: "exercicio-que-mais-queima-calorias",
    title: "Exercício que Mais Queima Calorias (e o Esporte): Ranking por Hora",
    metaTitle: "Exercício que Mais Queima Calorias: Ranking por Hora e Peso",
    metaDescription:
      "Qual exercício e qual esporte queimam mais calorias por hora, de 60 a 90 kg: corda, corrida, luta, escada, bike, natação e musculação. Veja a tabela.",
    excerpt:
      "O ranking do gasto por hora, pelo seu peso, com os mesmos números das calculadoras do site: o que mais queima na academia, em casa e no esporte, e quanto tempo leva para gastar 200, 500 ou 1.000 kcal.",
    category: "Emagrecimento",
    date: "2026-10-23",
    updatedAt: "2026-10-23",
    readTime: "8 min",
    author: "Montinho",
    tags: ["exercício que mais queima calorias", "esporte que mais queima calorias", "qual exercício queima mais calorias", "tabela de queima de calorias", "queimar calorias"],
    faq: [
      { question: "Qual o exercício que mais queima calorias?", answer: `Por hora, pular corda em ritmo moderado e correr são os que mais gastam: para ${P} kg, cerca de ${dez(porHora(CORDA.met, P))} e ${dez(porHora(CORRIDA.met, P))} kcal (corrida a 10 km/h). Logo atrás vêm o rola do jiu-jitsu, subir escada e o spinning. Mas o que mais queima na sua semana é o exercício que você consegue manter por mais tempo e mais vezes.` },
      { question: "Quais são os 5 exercícios que mais queimam calorias?", answer: `Pelo Compêndio de Atividades Físicas, no ritmo das calculadoras do site: ${TOP.map((l) => `${l.nome.toLowerCase()} (${l.ritmo})`).join(", ")}. Para ${P} kg, todos passam de ${dez(porHora(TOP[4].met, P))} kcal por hora.` },
      { question: "Qual esporte queima mais calorias?", answer: `Entre os esportes, a corrida e as lutas com rola ou round de verdade (jiu-jitsu, muay thai) ficam no topo, com cerca de ${dez(porHora(JIU.met, P))} kcal por hora para ${P} kg. O ciclismo na rua, a 19 a 22 km/h, fica perto de ${dez(porHora(BIKE.met, P))}; a pelada de futebol, de ${dez(porHora(FUTEBOL.met, P))}; e a natação em crawl leve, de ${dez(porHora(NATACAO.met, P))}.` },
      { question: "Qual exercício queima mais calorias na academia?", answer: `Escada e spinning, com cerca de ${dez(porHora(ESCADA.met, P))} e ${dez(porHora(SPINNING.met, P))} kcal por hora para ${P} kg, seguidos da esteira correndo e do remo. A musculação tradicional gasta menos por hora (cerca de ${dez(porHora(MUSC_TRAD.met, P))} kcal), mas é a que constrói o músculo que faz o corpo mudar de forma.` },
      { question: "Qual exercício queima mais calorias em casa?", answer: `Pular corda: cerca de ${dez(porHora(CORDA.met, P))} kcal por hora para ${P} kg em ritmo moderado. Sem corda, polichinelos e burpees em circuito gastam menos por minuto (polichinelo moderado, cerca de ${dez(porHora(POLICHINELO.met, P))} por hora), mas cabem em qualquer sala.` },
      { question: "Como queimar 1000 calorias em 1 hora?", answer: `Para ${P} kg, nem correndo forte cabe em uma hora: a 12 km/h, mil calorias levam cerca de ${hm(MIL_CORRIDA_12)}; pulando corda em ritmo moderado, ${hm(MIL_CORDA)}. Quem pesa mais chega lá mais rápido, mas pouca gente sustenta esse ritmo. Na prática, 1.000 kcal de exercício se juntam ao longo de vários dias, não numa hora.` },
      { question: "Qual exercício queima 500 calorias por dia?", answer: `Para ${P} kg: cerca de ${hm(minutosPara(500, CORRIDA.met))} de corrida a 10 km/h, ${hm(minutosPara(500, CORDA.met))} pulando corda, ${hm(minutosPara(500, BIKE.met))} de bicicleta ou ${hm(minutosPara(500, CAMINHADA.met))} de caminhada.` },
      { question: "Como queimar 300 calorias por dia?", answer: `Para ${P} kg: cerca de ${hm(minutosPara(300, CORRIDA.met))} de corrida, ${hm(minutosPara(300, BIKE.met))} de bicicleta ou ${hm(minutosPara(300, CAMINHADA.met))} de caminhada em passo moderado. Somar a caminhada do dia a dia também conta.` },
      { question: "Quantas calorias queimar para perder 1 kg?", answer: `A conta clássica é ${mil(KCAL_POR_KG_GORDURA)} kcal por quilo de gordura. Ela serve de ordem de grandeza, não de promessa: o corpo se adapta e o gasto cai um pouco conforme o peso cai. Para ${P} kg, seriam cerca de ${Math.round(KG_CORRIDA)} horas de corrida, somadas ao longo das semanas.` },
      { question: "Quantos dias de caminhada para perder 1 kg?", answer: `Só com caminhada, sem mudar a alimentação, seriam cerca de ${Math.round(KG_CAMINHADA_DIAS)} dias de 30 minutos em passo moderado para ${P} kg, pela conta de ${mil(KCAL_POR_KG_GORDURA)} kcal por quilo. Com um pequeno déficit na alimentação, o caminho fica bem mais curto.` },
      { question: "Como queimar 3000 calorias por dia?", answer: `O gasto do dia já inclui o metabolismo e o movimento de rotina, então 3.000 kcal por dia não precisam vir só do exercício. Queimar 3.000 só treinando pediria cerca de ${hm(minutosPara(3000, CORRIDA.met))} de corrida a 10 km/h para ${P} kg. Para saber quanto você gasta no dia inteiro, use a calculadora de TMB e TDEE.` },
      { question: "O que queima mais calorias: cardio ou musculação?", answer: `Na hora do treino, o cardio: uma hora de corrida a 10 km/h gasta cerca de ${dez(porHora(CORRIDA.met, P))} kcal para ${P} kg, contra ${dez(porHora(MUSC_TRAD.met, P))} da musculação tradicional e ${dez(porHora(MUSC_CIRC.met, P))} da musculação em circuito. Para emagrecer com o corpo bonito, os dois juntos funcionam melhor que qualquer um sozinho.` },
      { question: "Qual exercício queima mais gordura da barriga?", answer: "Nenhum exercício escolhe de onde o corpo tira a gordura. O exercício aumenta o gasto do dia; a gordura da barriga sai junto com a do resto do corpo quando há déficit calórico, na ordem que a genética decide." },
      { question: "Qual luta queima mais calorias?", answer: `As que têm luta de verdade no treino: o rola do jiu-jitsu e os rounds fortes do muay thai, com cerca de ${dez(porHora(JIU.met, P))} kcal por hora para ${P} kg. Uma aula de boxe batendo no saco, com pausas, fica perto de ${dez(porHora(BOXE.met, P))}.` },
      { question: "Exercício para queimar calorias em 15 minutos: qual escolher?", answer: `Em 15 minutos, para ${P} kg: ${r15.slice(0, 3).map((l) => `${l.nome.toLowerCase()} (≈ ${dez(l.kcal)} kcal)`).join(", ")}. É pouco tempo para muito gasto, mas somado na semana faz diferença.` },
    ],
    content: `<p>Quem procura o exercício que mais queima calorias quer um ranking. Ele está abaixo, <strong>pelo seu peso</strong>, e não em faixas soltas como "de 700 a 1.000 kcal": quem pesa 60 kg e quem pesa 90 kg gastam muito diferente na mesma aula. Os números são os mesmos das calculadoras do site, todos do Compêndio de Atividades Físicas.</p>

<h2>Resposta direta: qual exercício queima mais calorias</h2>
<p>Por hora, para ${P} kg:</p>
<ol>
${TOP.map((l) => `<li><strong>${l.nome}</strong> (${l.ritmo}): cerca de ${dez(porHora(l.met, P))} kcal</li>`).join("\n")}
</ol>
<p>Correr mais rápido gasta mais: a 12 km/h, a corrida passa de ${dez(porHora(CORRIDA_12, P))} kcal por hora para ${P} kg. Mas há uma pegadinha no ranking: o exercício que mais queima por hora é também o mais difícil de sustentar por uma hora. Quem pula corda 10 minutos e para gasta menos do que quem pedala 50.</p>
<p>Para fazer a conta com o seu peso e o seu tempo, o comparador abaixo põe todas as atividades lado a lado.</p>

<h2>Tabela de queima de calorias por hora</h2>
<p>Gasto estimado em uma hora, por peso, do maior para o menor (kcal, arredondado):</p>
${tabelaRanking}
<p>O número é bruto: inclui o que você gastaria parado nesse tempo. Cada linha leva à calculadora daquela atividade, que faz a conta completa (rounds do boxe, blocos da corda, andares da escada, velocidade da bike).</p>

<h2>Qual esporte queima mais calorias?</h2>
<ul>
<li><strong>Corrida:</strong> o esporte que mais gasta entre os comuns, e o mais fácil de começar. Cerca de ${dez(porHora(CORRIDA.met, P))} kcal por hora a 10 km/h para ${P} kg.</li>
<li><strong>Lutas:</strong> jiu-jitsu e muay thai, nos rolas e rounds fortes, ficam perto de ${dez(porHora(JIU.met, P))}. A técnica parada gasta bem menos.</li>
<li><strong>Ciclismo:</strong> na rua, a 19 a 22 km/h, cerca de ${dez(porHora(BIKE.met, P))}.</li>
<li><strong>Futebol:</strong> numa pelada, cerca de ${dez(porHora(FUTEBOL.met, P))}, contando o tempo parado.</li>
<li><strong>Natação:</strong> em crawl leve, cerca de ${dez(porHora(NATACAO.met, P))}. Nadar forte gasta mais, mas poucos nadam forte por uma hora.</li>
</ul>
<p>"Qual esporte emagrece mais rápido?" tem uma resposta menos animada: o que você consegue fazer três a cinco vezes por semana, por meses. Emagrecer depende do déficit da semana inteira, e o déficit depende mais da alimentação do que de qualquer esporte.</p>

<h2>Qual exercício queima mais calorias na academia?</h2>
<ul>
<li><strong>Escada:</strong> cerca de ${dez(porHora(ESCADA.met, P))} kcal por hora para ${P} kg, em ritmo de treino.</li>
<li><strong>Spinning:</strong> cerca de ${dez(porHora(SPINNING.met, P))} numa aula.</li>
<li><strong>Esteira correndo</strong> e <strong>remo:</strong> ${dez(porHora(CORRIDA.met, P))} e ${dez(porHora(REMO.met, P))}.</li>
<li><strong>Elíptico:</strong> cerca de ${dez(porHora(ELIPTICO.met, P))} em esforço moderado.</li>
<li><strong>Musculação:</strong> cerca de ${dez(porHora(MUSC_TRAD.met, P))} no treino tradicional e ${dez(porHora(MUSC_CIRC.met, P))} em circuito.</li>
</ul>
<p><strong>Musculação ou esteira?</strong> Na hora do treino, a esteira gasta mais. Mas a musculação constrói músculo, que é o que muda a forma do corpo e o que protege o resultado quando o peso cai. A comparação completa está em <a href="/blog/musculacao-ou-corrida-para-emagrecer">musculação ou corrida para emagrecer</a>.</p>

<h2>Qual exercício queima mais calorias em casa?</h2>
<p>Pular corda, com cerca de ${dez(porHora(CORDA.met, P))} kcal por hora para ${P} kg em ritmo moderado. Sem corda, um circuito de polichinelos, burpees e agachamentos com salto: o polichinelo moderado gasta cerca de ${dez(porHora(POLICHINELO.met, P))} por hora, e o circuito sobe isso quando as pausas são curtas. Um treino montado está em <a href="/blog/treino-para-emagrecer-em-casa">treino para emagrecer em casa</a>.</p>

<h2>Exercício que mais queima calorias para iniciantes</h2>
<p>Para quem está começando, o melhor é o que dá para fazer por mais tempo sem dor: caminhada rápida, bicicleta e elíptico. Gastam menos por minuto, mas deixam você treinar 40 minutos hoje e voltar amanhã. A caminhada inclinada (o método 12-3-30) é um bom passo seguinte, explicado em <a href="/blog/caminhada-na-esteira-inclinada">caminhada na esteira inclinada</a>.</p>

<h2>Quanto tempo para queimar 200, 300, 500 e 1.000 calorias</h2>
<p>Para ${P} kg:</p>
${tabelaAlvos}
<p><strong>Mil calorias em uma hora</strong> não cabem nem correndo forte, para ${P} kg: a 12 km/h, levam cerca de ${hm(MIL_CORRIDA_12)}; pulando corda em ritmo moderado, ${hm(MIL_CORDA)}; caminhando, ${hm(MIL_CAMINHADA)}. Para quem está emagrecendo, 300 a 500 kcal por dia de exercício, somadas a uma alimentação em ordem, rendem mais do que um dia de 1.000 e três parados.</p>

<h2>Quantas calorias queimar para perder 1 kg?</h2>
<p>A conta clássica é <strong>${mil(KCAL_POR_KG_GORDURA)} kcal por quilo de gordura</strong>. Para ${P} kg, seriam cerca de ${Math.round(KG_CORRIDA)} horas de corrida, ou ${Math.round(KG_CAMINHADA_DIAS)} dias de 30 minutos de caminhada, sem mudar nada na comida. É uma ordem de grandeza, não uma promessa: o corpo se adapta, o gasto cai um pouco conforme o peso cai, e a balança oscila com água. Por isso o caminho que funciona junta exercício e um <a href="/blog/deficit-calorico-como-calcular">déficit calórico</a> pequeno.</p>

<h2>Queimar calorias emagrece? E a barriga?</h2>
<p>Emagrece quando a semana fecha em déficit: gastar mais do que come. O exercício ajuda nas duas pontas, porque aumenta o gasto e, no caso da musculação, preserva o músculo enquanto o peso cai. Mas nenhum exercício escolhe de onde o corpo tira a gordura: abdominal não "queima a barriga". A barriga sai junto com o resto, na ordem da sua genética. Mais em <a href="/blog/como-perder-gordura-abdominal">como perder gordura abdominal</a>.</p>

<h2>Não se compare</h2>
<p>Duas pessoas do mesmo peso gastam diferente na mesma aula, e o ranking de alguém não é o seu. Cada um tem a própria genética, rotina e história, com altos e baixos. O exercício que mais queima calorias para você é o que dá para seguir pelo resto da vida, com aderência e progressão. Se quiser montar isso comigo, conheça a <a href="/consultoria-online">consultoria online</a> ou veja <a href="/onde-atendo">onde atendo</a>.</p>

<h2>Leia também</h2>
<ul>
<li><a href="/blog/musculacao-ou-corrida-para-emagrecer">Musculação ou corrida para emagrecer</a></li>
<li><a href="/blog/hiit-funciona">HIIT funciona?</a></li>
<li><a href="/blog/caminhada-na-esteira-inclinada">Caminhada na esteira inclinada (12-3-30)</a></li>
<li><a href="/ferramentas/calculadora-tmb-tdee">Calculadora de TMB e TDEE: quanto você gasta por dia</a></li>
<li><a href="/ferramentas/calculadora-deficit-calorico">Calculadora de déficit calórico</a></li>
</ul>

<h2>Fontes</h2>
<ul>
<li><a href="https://pacompendium.com/adult-compendium/" target="_blank" rel="noopener noreferrer">Herrmann SD, et al. 2024 Adult Compendium of Physical Activities (METs de cada atividade)</a></li>
<li>American College of Sports Medicine. ACSM's Guidelines for Exercise Testing and Prescription (equação de corrida e fórmula kcal/min = MET × 3,5 × peso ÷ 200)</li>
<li><a href="${FONTE_HALL.url}" target="_blank" rel="noopener noreferrer">${FONTE_HALL.rotulo}</a> (por que os 7.700 kcal são aproximação)</li>
</ul>`,
  },
];

/** Usado pelo teste: os valores do artigo vêm daqui, não do texto. */
export const _RANKING = LINHAS;
