/**
 * O banco de exercícios — treze, e nem um a mais.
 *
 * O critério de entrada foi hostil de propósito: um exercício só entra se for
 * fácil de executar sozinho, dispensar equipamento, funcionar em casa e na
 * academia, e não ter um irmão mais simples que entregue o mesmo. Quando dois
 * empataram, o mais simples ganhou — está no campo `facilidade`.
 *
 * O que ficou de fora e por quê: variações "corretivas" específicas, qualquer
 * coisa que precise de elástico, e a metade dos alongamentos clássicos, que
 * são redundantes entre si. Um banco grande não deixa o protocolo melhor; deixa
 * a manutenção pior e tenta o motor a variar exercício sem motivo — e variar
 * atrapalha, porque a pessoa nunca aprende nenhum direito.
 *
 * Duas travas vindas da evidência moram nos dados, não em texto solto:
 *
 *   1. Todo exercício declara em quais MOMENTOS pode entrar. Estático longo
 *      não tem "pre" na lista (Behm et al.), então o motor não consegue
 *      prescrevê-lo antes do treino nem por acidente.
 *   2. Os segundos por lado alimentam o cálculo de volume semanal, que o motor
 *      compara com o alvo de dez minutos por região (Ingram et al.).
 *
 * O campo `video` está vazio em todos. É intencional: a v1 sai com foto e
 * texto, e o vídeo do Montinho entra depois preenchendo o campo — sem tocar em
 * nenhuma outra linha do sistema.
 */

import type { ExercicioMobilidade } from "./tipos";

export const EXERCICIOS: ExercicioMobilidade[] = [
  // ── Tornozelo ─────────────────────────────────────────────────────────────
  {
    id: "knee-to-wall-dinamico",
    regiao: "tornozelo",
    nome: "Joelho na parede, movimento contínuo",
    momentos: ["pre", "isolada"],
    tipo: "dinamico",
    dose: { pre: "10 movimentos de cada lado", isolada: "12 movimentos de cada lado" },
    como: "Na mesma posição do teste, leve o joelho até a parede e volte, sem parar no fim. Calcanhar sempre no chão.",
    senteOnde: "Um estiramento confortável na batata da perna e na frente do tornozelo.",
    evite: "Tirar o calcanhar do chão para chegar mais longe.",
    equipamento: "parede",
    facilidade: 1,
    porque:
      "É o próprio teste virado em exercício: você trabalha exatamente a amplitude que mediu. Por ser movimento contínuo em vez de sustentação longa, serve antes do treino sem tirar força das suas séries.",
  },
  {
    id: "dorsiflexao-afundo",
    regiao: "tornozelo",
    nome: "Balanço no afundo",
    momentos: ["pre", "isolada"],
    tipo: "dinamico",
    dose: { pre: "8 movimentos de cada lado", isolada: "10 movimentos de cada lado" },
    como: "Em posição de afundo, com o pé da frente inteiro no chão, avance o joelho da frente sobre o pé e volte.",
    senteOnde: "Na parte de trás da perna da frente e no tornozelo.",
    evite: "Deixar o joelho cair para dentro. Ele acompanha a linha do pé.",
    equipamento: "nenhum",
    facilidade: 1,
    porque:
      "Leva a amplitude para a posição em que você vai usá-la: joelho à frente, peso no pé. É o degrau entre o movimento isolado e o exercício da academia.",
  },
  {
    id: "panturrilha-joelho-reto",
    regiao: "tornozelo",
    nome: "Panturrilha com joelho estendido",
    momentos: ["isolada"],
    tipo: "estatico",
    dose: { isolada: "2 séries de 60 segundos de cada lado" },
    segundosPorLado: { isolada: 120 },
    como: "Mãos na parede, uma perna atrás com o joelho estendido e o calcanhar no chão. Avance o quadril até sentir e sustente.",
    senteOnde: "Na parte de cima da batata da perna.",
    evite: "Girar o pé de trás para fora. Ele aponta para a frente.",
    equipamento: "parede",
    facilidade: 1,
    porque:
      "Com o joelho estendido, o alongamento alcança a parte da panturrilha que cruza o joelho. Sessenta segundos por série é a dose que a literatura mostra maximizar o ganho — e por ser sustentação longa, ela fica longe do treino de força.",
  },
  {
    id: "panturrilha-joelho-flexionado",
    regiao: "tornozelo",
    nome: "Panturrilha com joelho dobrado",
    momentos: ["isolada"],
    tipo: "estatico",
    dose: { isolada: "2 séries de 60 segundos de cada lado" },
    segundosPorLado: { isolada: 120 },
    como: "Mesma posição do anterior, mas com o joelho de trás levemente dobrado e o calcanhar ainda no chão.",
    senteOnde: "Mais embaixo, perto do tornozelo.",
    evite: "Deixar o calcanhar subir quando dobrar o joelho.",
    equipamento: "parede",
    facilidade: 1,
    porque:
      "Dobrar o joelho tira de cena a parte de cima da panturrilha e joga o trabalho para a de baixo, que é a que mais limita a dorsiflexão. O outro alongamento sozinho não alcança essa parte.",
  },

  // ── Ombro ─────────────────────────────────────────────────────────────────
  {
    id: "wall-slide",
    regiao: "ombro",
    nome: "Deslize na parede",
    momentos: ["pre", "isolada"],
    tipo: "dinamico",
    dose: { pre: "10 deslizes", isolada: "12 deslizes" },
    como: "De costas para a parede, lombar encostada, antebraços na parede. Deslize os braços para cima e volte, mantendo o contato possível.",
    senteOnde: "Trabalho na parte de cima das costas e nos ombros.",
    evite: "Arquear a lombar para os braços subirem mais. Suba só até onde a lombar aguenta ficar.",
    equipamento: "parede",
    facilidade: 1,
    porque:
      "A parede é o que impede você de trapacear com a lombar — que é como a maioria das pessoas leva o braço para cima sem ter a amplitude. É o mesmo padrão do desenvolvimento, com a compensação bloqueada.",
  },
  {
    id: "flexao-ombro-bastao",
    regiao: "ombro",
    nome: "Braços acima da cabeça, com apoio",
    momentos: ["pre", "isolada"],
    tipo: "dinamico",
    dose: { pre: "10 movimentos", isolada: "12 movimentos" },
    como: "Segure um cabo de vassoura com as duas mãos afastadas e leve os braços por cima da cabeça e para trás, até onde for confortável. Sem bastão, faça o mesmo de mãos dadas.",
    senteOnde: "Abertura na frente dos ombros e no peito.",
    evite: "Mãos muito próximas. Quanto mais perto, mais difícil — comece largo.",
    equipamento: "bastao-opcional",
    facilidade: 2,
    porque:
      "O bastão distribui o movimento entre os dois lados, então o ombro com mais amplitude não compensa o outro. Funciona igual de mãos dadas, se você não tiver um.",
  },
  {
    id: "peitoral-porta",
    regiao: "ombro",
    nome: "Abertura no batente da porta",
    momentos: ["isolada"],
    tipo: "estatico",
    dose: { isolada: "2 séries de 60 segundos de cada lado" },
    segundosPorLado: { isolada: 120 },
    como: "Antebraço apoiado no batente, cotovelo na altura do ombro. Dê um passo à frente e gire levemente o tronco para o lado oposto.",
    senteOnde: "Na frente do peito e do ombro.",
    evite: "Empurrar até doer. Desconforto confortável basta.",
    equipamento: "nenhum",
    facilidade: 1,
    porque:
      "Trabalha a frente do ombro e do peito, que costuma ser o que limita levar o braço para cima em quem passa o dia sentado. É sustentação longa, então fica nos dias sem treino de empurrar.",
  },

  // ── Torácica ──────────────────────────────────────────────────────────────
  {
    id: "open-book",
    regiao: "toracica",
    nome: "Abrir o livro",
    momentos: ["pre", "isolada"],
    tipo: "dinamico",
    dose: { pre: "8 movimentos de cada lado", isolada: "10 movimentos de cada lado" },
    como: "Deitado de lado, joelhos dobrados e empilhados, braços estendidos à frente. Abra o braço de cima levando-o ao outro lado, acompanhando com o olhar, e volte.",
    senteOnde: "Giro na parte de cima das costas e abertura no peito.",
    evite: "Deixar os joelhos abrirem junto. Eles ficam parados.",
    equipamento: "nenhum",
    facilidade: 1,
    porque:
      "Os joelhos presos um no outro obrigam o giro a vir de cima, e não da lombar. É o mesmo giro que você mediu no teste, agora com amplitude sendo trabalhada.",
  },
  {
    id: "rotacao-quatro-apoios",
    regiao: "toracica",
    nome: "Giro em quatro apoios",
    momentos: ["pre", "isolada"],
    tipo: "dinamico",
    dose: { pre: "8 movimentos de cada lado", isolada: "10 movimentos de cada lado" },
    como: "Em quatro apoios, uma mão atrás da cabeça. Gire o cotovelo para o teto, olhando para ele, e desça levando-o para baixo do corpo.",
    senteOnde: "Giro na parte de cima das costas.",
    evite: "Girar o quadril junto. Ele fica quadrado com o chão.",
    equipamento: "nenhum",
    facilidade: 2,
    porque:
      "Cobre o giro em toda a amplitude, para os dois lados, num só movimento. Serve bem como aquecimento para remada e agachamento com barra.",
  },

  // ── Quadril ───────────────────────────────────────────────────────────────
  {
    id: "noventa-noventa",
    regiao: "quadril",
    nome: "90/90",
    momentos: ["pre", "isolada"],
    tipo: "dinamico",
    dose: { pre: "8 trocas de cada lado", isolada: "10 trocas de cada lado" },
    como: "Sentado no chão, uma perna à frente e outra ao lado, ambas dobradas a noventa graus. Gire os dois joelhos para o outro lado e volte.",
    senteOnde: "Nos dois quadris, em pontos diferentes.",
    evite: "Usar as mãos para arrastar as pernas. O movimento é seu.",
    equipamento: "nenhum",
    facilidade: 2,
    porque:
      "Trabalha as duas rotações do quadril no mesmo movimento, que são as amplitudes que aparecem quando você desce no agachamento. Girar ativamente também ensina o controle da posição, não só o alcance.",
  },
  {
    id: "rock-back-adutor",
    regiao: "quadril",
    nome: "Balanço com a perna aberta",
    momentos: ["pre", "isolada"],
    tipo: "dinamico",
    dose: { pre: "10 movimentos de cada lado", isolada: "12 movimentos de cada lado" },
    como: "Em quatro apoios, estenda uma perna para o lado com o pé no chão. Sente o quadril para trás e volte.",
    senteOnde: "Na parte interna da coxa estendida.",
    evite: "Arredondar as costas ao sentar para trás.",
    equipamento: "nenhum",
    facilidade: 1,
    porque:
      "Trabalha a parte interna da coxa, que costuma limitar a abertura no agachamento fundo. O balanço é mais fácil de dosar sozinho do que uma posição sustentada.",
  },

  // ── Cadeia posterior ──────────────────────────────────────────────────────
  {
    id: "posterior-deitado",
    regiao: "posterior",
    nome: "Perna reta, deitado",
    momentos: ["isolada"],
    tipo: "estatico",
    dose: { isolada: "2 séries de 60 segundos de cada lado" },
    segundosPorLado: { isolada: 120 },
    como: "Deitado, suba uma perna estendida e segure atrás da coxa com as mãos. A outra perna fica no chão. Sustente.",
    senteOnde: "Na parte de trás da coxa que subiu.",
    evite: "Dobrar o joelho da perna que subiu, ou levantar a outra do chão.",
    equipamento: "nenhum",
    facilidade: 1,
    porque:
      "É a mesma posição do teste, sustentada. Deitado, as costas ficam apoiadas e você não consegue compensar com a lombar — o que acontece em quase todo alongamento de posterior feito em pé.",
  },
  {
    id: "hinge-controlado",
    regiao: "posterior",
    nome: "Dobradiça de quadril",
    momentos: ["pre", "isolada"],
    tipo: "forca",
    dose: { pre: "2 séries de 8", isolada: "2 séries de 10" },
    como: "Em pé, joelhos levemente dobrados. Empurre o quadril para trás mantendo as costas retas, desça até sentir a parte de trás da coxa e volte apertando os glúteos.",
    senteOnde: "Estiramento atrás da coxa na descida.",
    evite: "Arredondar as costas para descer mais. A amplitude é até onde as costas ficam retas.",
    equipamento: "nenhum",
    facilidade: 2,
    porque:
      "É o padrão do stiff e do terra, sem carga. Treinar o movimento em boa amplitude também aumenta amplitude — a meta-análise de Afonso não encontrou diferença entre força e alongamento nesse quesito. E de quebra você chega no exercício já sabendo a posição.",
  },
];

export const EXERCICIO_POR_ID: Record<string, ExercicioMobilidade> = Object.fromEntries(
  EXERCICIOS.map((e) => [e.id, e]),
);

export function exerciciosDaRegiao(regiao: string): ExercicioMobilidade[] {
  return EXERCICIOS.filter((e) => e.regiao === regiao);
}

/**
 * O foam roller como ele deve aparecer: uma nota, nunca um item do protocolo.
 *
 * A meta-análise mostra empate com o alongamento no conjunto dos estudos, mas
 * em intervenções de até quatro semanas — que é exatamente o ciclo desta
 * ferramenta — só o alongamento mostrou mudança significativa. Então o rolo
 * não entra na prescrição; ele fica disponível para quem já tem e gosta.
 */
export const NOTA_FOAM_ROLLER =
  "Se você tem um rolo e gosta de usar, pode usar antes destes exercícios — ele costuma aumentar a amplitude no curto prazo. Mas ele não é obrigatório e não substitui nada aqui: em ciclos de até quatro semanas, como o seu, o alongamento é o que tem evidência mais consistente.";
