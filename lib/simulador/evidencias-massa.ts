/**
 * O que sustenta cada gargalo do Simulador de Ganho de Massa — em três
 * camadas separadas e nomeadas, como no de emagrecimento: estudos (com
 * referência conferida), prática de quem acompanha alunos, relatos.
 */

import type { Gargalo } from "./massa";

export interface EvidenciaMassa {
  id: Gargalo;
  titulo: string;
  resumo: string;
  estudos: { texto: string; ref: { rotulo: string; url: string } }[];
  pratica: string;
  relatos: string;
  acao: string;
}

export const EVIDENCIAS_MASSA: EvidenciaMassa[] = [
  {
    id: "ingestao",
    titulo: "Ingestão: o peso parado é a resposta",
    resumo: "Se a balança não sobe há semanas, na média você come a manutenção — não importa quanto parece.",
    estudos: [
      { texto: "O peso responde ao balanço energético médio ao longo de semanas; um peso estável significa ingestão ≈ gasto, com margem de erro pequena.", ref: { rotulo: "Hall KD et al. The Lancet, 2011;378:826-837", url: "https://pubmed.ncbi.nlm.nih.gov/21872751/" } },
      { texto: "Para iniciantes e intermediários, a recomendação é um superávit de ~10–20% e ganho de 0,25% a 0,5% do peso por semana — não “comer o máximo possível”.", ref: { rotulo: "Iraki J et al. Sports, 2019;7(7):154", url: "https://pubmed.ncbi.nlm.nih.gov/31247944/" } },
      { texto: "Ao superalimentar voluntários, quem menos ganhou gordura foi quem mais aumentou o movimento espontâneo do dia — o “gasto que ninguém vê” varia dez vezes entre pessoas.", ref: { rotulo: "Levine JA et al. Science, 1999;283:212-214", url: "https://www.science.org/doi/10.1126/science.283.5399.212" } },
    ],
    pratica: "O aluno magro que “come muito” quase sempre come muito em duas refeições e quase nada nas outras, ou come muito de segunda a sexta e pouco no fim de semana. Quando anota uma semana inteira, a média decepciona. O que funciona não é prato maior: é densidade (azeite, pasta de amendoim, leite integral, arroz a mais) e uma refeição extra fixa, todo dia, no mesmo horário.",
    relatos: "“Como o dia inteiro e não engordo” é o relato mais comum de quem começa. Quem passa a anotar costuma relatar surpresa: 1.900 kcal num dia que parecia enorme. O outro relato frequente é o oposto: “coloquei um shake de 500 kcal à noite e o peso destravou em duas semanas”.",
    acao: "Escolha UMA refeição extra que caiba todo dia (um shake, um pão com pasta de amendoim, um prato a mais no almoço) e some. Pese-se 3 a 4 vezes por semana e compare médias semanais por 14 dias.",
  },
  {
    id: "monitoramento",
    titulo: "Medir: sem média semanal, tudo é chute",
    resumo: "Peso diário mente; a média da semana não.",
    estudos: [
      { texto: "O peso corporal oscila de um dia para o outro por água, glicogênio e conteúdo intestinal — a tendência só aparece em médias de vários dias.", ref: { rotulo: "Hall KD et al. The Lancet, 2011 — apêndice do modelo", url: "https://www.niddk.nih.gov/-/media/Files/BWP/Hall_Lancet_Web_Appendix.pdf" } },
      { texto: "As recomendações para o off-season são explícitas: ajustar a ingestão pela taxa de ganho observada, não por uma conta feita uma vez.", ref: { rotulo: "Iraki J et al. Sports, 2019;7(7):154", url: "https://pubmed.ncbi.nlm.nih.gov/31247944/" } },
    ],
    pratica: "Quem acompanha alunos vê o mesmo erro: pesar uma vez por semana, num dia aleatório, e decidir por esse número. Um dia com 800 g a mais de glicogênio vira “engordei”; um dia desidratado vira “não funciona”. Média semanal resolve os dois.",
    relatos: "“Subi 1,5 kg em uma semana e depois voltei” é relato clássico das primeiras semanas de superávit (e de creatina). Quem passa a olhar médias relata que a ansiedade cai junto.",
    acao: "Peso de manhã, depois do banheiro, 3 a 4 vezes por semana. Some, divida, compare com a semana anterior. Só mude alguma coisa depois de duas semanas de média parada.",
  },
  {
    id: "treino",
    titulo: "Treino: o material sem o estímulo vira peso, não músculo",
    resumo: "Superávit dá o tijolo; o treino com progressão é a obra.",
    estudos: [
      { texto: "Cada série semanal a mais por músculo rende um pouco mais de hipertrofia, com cerca de 10 séries por semana como ponto de referência para ganhos próximos do máximo.", ref: { rotulo: "Schoenfeld BJ, Ogborn D, Krieger JW. Journal of Sports Sciences, 2017;35:1073-1082", url: "https://pubmed.ncbi.nlm.nih.gov/27433992/" } },
      { texto: "Superávits grandes em atletas aumentaram o peso e a gordura sem aumentar a massa magra além do grupo com ganho lento — o músculo tem teto por semana.", ref: { rotulo: "Garthe I et al. European Journal of Sport Science, 2013;13:295-303", url: "https://pubmed.ncbi.nlm.nih.gov/23679146/" } },
    ],
    pratica: "O iniciante que anota carga e repetições evolui em quase todo treino nos primeiros meses — e é isso que faz o peso ganho ir para o lugar certo. Quem não anota faz o mesmo treino por seis meses e chama de platô o que é falta de progressão.",
    relatos: "“Ganhei 5 kg e só cresceu a barriga” quase sempre vem acompanhado de “treino o mesmo de sempre”. O oposto: “anotei as cargas e em dois meses o supino subiu 20 kg” costuma vir junto de ombro e peito visíveis.",
    acao: "Escolha 4 a 6 exercícios principais e anote carga × repetições em todo treino. A meta é que pelo menos um número suba a cada semana ou duas.",
  },
  {
    id: "constancia",
    titulo: "Constância: o corpo responde aos treinos realizados",
    resumo: "Um plano de 3 dias que acontece vale mais que um de 5 que não acontece.",
    estudos: [
      { texto: "A aderência ao plano — e não o tipo de plano — foi o que previu resultado em um ensaio de um ano comparando quatro dietas.", ref: { rotulo: "Dansinger ML et al. JAMA, 2005;293:43-53", url: "https://pubmed.ncbi.nlm.nih.gov/15632335/" } },
      { texto: "Cerca de 10 séries por músculo por semana, distribuídas, é a referência de volume — o que exige regularidade, não intensidade heroica esporádica.", ref: { rotulo: "Schoenfeld BJ et al. Journal of Sports Sciences, 2017;35:1073-1082", url: "https://pubmed.ncbi.nlm.nih.gov/27433992/" } },
    ],
    pratica: "Parar e voltar é o padrão de quem escolhe uma rotina que não cabe na vida: 5 dias, 1h30, longe de casa. Na volta, perde-se o que se ganhou nas semanas paradas e recomeça-se do mesmo lugar. O aluno que sustenta 3 dias por dois anos cresce mais que o que faz 6 por dois meses.",
    relatos: "“Comecei e parei umas cinco vezes” é o relato mais comum em fóruns de iniciantes. Quem relata sucesso raramente cita o programa: cita ter achado um horário que ficou.",
    acao: "Reduza o plano até caber: 3 dias, 45 a 60 minutos, num horário fixo. Marque no calendário. Em 12 semanas, conte os treinos realizados — essa é a métrica.",
  },
  {
    id: "paciencia",
    titulo: "Paciência: o que falta é tempo, não mais calorias",
    resumo: "Quando peso, treino e constância estão certos, apertar mais só compra gordura.",
    estudos: [
      { texto: "Iniciantes ganham massa magra a cerca de 1–1,5% do peso por mês; intermediários, metade; avançados, um quarto. Nenhum superávit muda esse teto — só decide o que vem junto.", ref: { rotulo: "Aragon AA. Alan Aragon's Research Review (modelo por tempo de treino)", url: "https://alanaragon.com/researchreview/" } },
      { texto: "O superávit necessário para maximizar a hipertrofia é desconhecido, e superávits maiores não produzem mais músculo proporcionalmente — produzem mais gordura.", ref: { rotulo: "Slater GJ et al. Frontiers in Nutrition, 2019;6:131", url: "https://pubmed.ncbi.nlm.nih.gov/31482093/" } },
    ],
    pratica: "É a fase mais difícil de segurar: tudo está certo, e mesmo assim o espelho demora. A tentação é dobrar a comida ou trocar de treino. O que funciona é não mudar nada por 6 a 8 semanas e medir — cargas, cintura, fotos.",
    relatos: "“Fiz tudo certo por dois meses e mudei o programa inteiro” aparece toda semana em fóruns. Quem relata resultado costuma dizer que o segundo semestre foi igual ao primeiro, só com mais carga na barra.",
    acao: "Tire fotos padronizadas hoje e daqui a 8 semanas. Meça a cintura a cada duas. Não mude nada que esteja funcionando.",
  },
  {
    id: "velocidade",
    titulo: "Velocidade: subir rápido demais é gordura, não músculo",
    resumo: "O músculo tem teto por semana; o que passa do teto vira gordura.",
    estudos: [
      { texto: "Atletas com superávit maior ganharam mais peso e mais gordura, sem mais massa magra que o grupo com ganho lento.", ref: { rotulo: "Garthe I et al. European Journal of Sport Science, 2013;13:295-303", url: "https://pubmed.ncbi.nlm.nih.gov/23679146/" } },
      { texto: "Para iniciantes e intermediários a faixa de ganho recomendada é 0,25% a 0,5% do peso por semana; acima disso, a fatia de gordura sobe.", ref: { rotulo: "Iraki J et al. Sports, 2019;7(7):154", url: "https://pubmed.ncbi.nlm.nih.gov/31247944/" } },
    ],
    pratica: "O “bulking sujo” de 1 kg por semana rende um cutting de quatro meses depois — e o músculo que sobra é o mesmo que teria vindo com 300 g por semana. A cintura é o alarme: se sobe mais que 1 a 2 cm por mês, o ritmo está alto.",
    relatos: "“Ganhei 10 kg em três meses e agora preciso secar 6” é dos relatos mais repetidos em comunidades de hipertrofia.",
    acao: "Reduza o superávit em 100 a 150 kcal, mantenha o treino igual, e olhe a média semanal e a cintura por 4 semanas.",
  },
  {
    id: "saude",
    titulo: "Saúde: perda de peso sem querer merece olhar antes",
    resumo: "Não é diagnóstico — é ordem certa das coisas.",
    estudos: [
      { texto: "Perda de peso involuntária relevante é um sinal que a medicina investiga antes de qualquer intervenção nutricional — as causas vão de tireoide a absorção, e comer mais não resolve nenhuma delas.", ref: { rotulo: "Iraki J et al. Sports, 2019 — recomendações pressupõem indivíduos saudáveis", url: "https://pubmed.ncbi.nlm.nih.gov/31247944/" } },
    ],
    pratica: "Personal trainer não diagnostica, e é justamente por isso que manda para quem diagnostica. O treino pode começar leve enquanto isso; a estratégia de comida espera a resposta.",
    relatos: "Não é raro alguém descobrir hipertireoidismo, intolerância ou ansiedade depois de meses “tentando engordar” sem sucesso.",
    acao: "Marque uma consulta e leve o histórico: quando o peso caiu, quanto, e o que mudou na rotina. Enquanto isso, treine força de forma leve e regular.",
  },
];

export const evidenciaMassa = (id: Gargalo) => EVIDENCIAS_MASSA.find((e) => e.id === id)!;
export const REFERENCIAS_EVIDENCIAS_MASSA = [...new Map(EVIDENCIAS_MASSA.flatMap((e) => e.estudos.map((s) => [s.ref.url, s.ref] as const))).values()];
