/**
 * O que sustenta cada alavanca do Simulador de Emagrecimento.
 *
 * O insight ("o que mais mudaria seu resultado") sai do modelo. Mas um
 * número sozinho não convence ninguém a mudar um hábito — e um modelo
 * pode errar. Por isso cada alavanca carrega três camadas, separadas e
 * nomeadas: o que os ESTUDOS mediram, o que a PRÁTICA de quem acompanha
 * alunos observa e o que as pessoas RELATAM na internet. As três não têm
 * o mesmo peso, e a página diz isso: relato não é evidência, é sintoma
 * comum; prática é experiência, não ensaio controlado.
 *
 * Toda referência aqui foi conferida na fonte antes de entrar. Se uma
 * afirmação não tem referência, ela está na camada de prática ou de
 * relato — nunca na de estudos.
 */

import type { Alavanca } from "./emagrecimento";

export interface Referencia { rotulo: string; url: string }

export interface Evidencia {
  id: Alavanca | "comida" | "primeiras-semanas" | "plato";
  titulo: string;
  /** A frase que resume o porquê, em uma linha. */
  resumo: string;
  estudos: { texto: string; ref: Referencia }[];
  pratica: string;
  relatos: string;
  /** O que fazer com isso amanhã. */
  acao: string;
}

export const EVIDENCIAS: Evidencia[] = [
  {
    id: "consistencia",
    titulo: "Consistência",
    resumo: "Não é a dieta que decide. É quantos dias ela acontece.",
    estudos: [
      {
        texto: "No ensaio que comparou Atkins, Ornish, Zone e Vigilantes do Peso por um ano, o tipo de dieta não previu quem emagreceu. A aderência previu — em todos os grupos.",
        ref: { rotulo: "Dansinger ML et al. JAMA, 2005;293:43-53", url: "https://pubmed.ncbi.nlm.nih.gov/15632335/" },
      },
      {
        texto: "Pesando adultos todos os dias por um ano, o peso subia de sexta a domingo e caía de segunda a quinta. Quem não perdia o fim de semana emagrecia; quem perdia, apenas oscilava.",
        ref: { rotulo: "Racette SB et al. Obesity, 2008;16:1826-1830", url: "https://onlinelibrary.wiley.com/doi/10.1038/oby.2008.320" },
      },
      {
        texto: "O platô por volta dos seis meses, comum a quase toda intervenção, é explicado menos pelo metabolismo e mais pela perda gradual de aderência — o plano continua no papel, mas acontece cada vez menos.",
        ref: { rotulo: "Hall KD, Kahan S. Medical Clinics of North America, 2018;102:183-197", url: "https://pubmed.ncbi.nlm.nih.gov/29156185/" },
      },
    ],
    pratica: "Quem acompanha alunos vê o mesmo padrão: o aluno que “faz tudo certo” de segunda a quinta e solta de sexta a domingo relata que “não emagrece de jeito nenhum”. Não é o corpo dele; são três dias em sete anulando quatro. O que muda o jogo raramente é apertar mais os dias bons — é tornar os dias ruins menos ruins.",
    relatos: "Em comunidades de emagrecimento, o relato mais repetido é “fui perfeito a semana toda e o fim de semana estragou tudo”. O outro é o oposto: quem para de buscar perfeição e aceita 80% dos dias costuma dizer que foi a primeira vez que o processo durou.",
    acao: "Escolha um dia da semana que hoje foge do plano e faça ele ficar “meio certo” — não perfeito. Um dia a mais por semana com o plano acontecendo é o que a consistência de 75% para 90% significa na prática.",
  },
  {
    id: "passos",
    titulo: "Passos e movimento do dia",
    resumo: "Acontece sete dias por semana. O treino, dois ou três.",
    estudos: [
      {
        texto: "Ao superalimentar 16 adultos com 1.000 kcal a mais por dia, quem ganhou menos gordura foi quem aumentou o gasto fora do treino — postura, andar, se mexer. Esse gasto explicou uma diferença de dez vezes no que virou gordura.",
        ref: { rotulo: "Levine JA et al. Science, 1999;283:212-214", url: "https://www.science.org/doi/10.1126/science.283.5399.212" },
      },
      {
        texto: "O modelo do NIH mostra que o peso responde a mudanças pequenas e permanentes no balanço energético — e passos são a mudança mais fácil de tornar permanente, porque não dependem de horário, roupa ou academia.",
        ref: { rotulo: "Hall KD et al. The Lancet, 2011;378:826-837", url: "https://pubmed.ncbi.nlm.nih.gov/21872751/" },
      },
    ],
    pratica: "Um treino de musculação de uma hora gasta, além do repouso, algo entre 150 e 250 kcal para a maioria das pessoas. Andar 2.500 passos a mais gasta menos por dia, mas acontece todos os dias — e, no fim da semana, soma mais. Na prática, o aluno que troca o elevador pela escada e desce um ponto antes muda mais a balança do que o que adiciona um quarto treino e continua sentado 14 horas.",
    relatos: "Quem começa a contar passos costuma relatar surpresa em duas direções: descobrir que dava 2.000 passos num dia de escritório — e ver o peso voltar a cair semanas depois de subir para 7.000, sem mudar a comida.",
    acao: "Não mire 10 mil. Mire o seu número atual mais 2.000, por duas semanas. Ligações em pé, o carro mais longe, uma volta depois do almoço.",
  },
  {
    id: "treino",
    titulo: "Treino de força",
    resumo: "Muda menos a balança do que se imagina — e muda mais o que a balança esconde.",
    estudos: [
      {
        texto: "Numa revisão de 12 revisões sistemáticas (149 estudos), o exercício sozinho produziu perda modesta de peso, de 1,5 a 3,5 kg. Mas o treino de força reduziu a perda de massa magra durante o emagrecimento em cerca de 0,8 kg.",
        ref: { rotulo: "Bellicha A et al. Obesity Reviews, 2021;22(S4):e13256", url: "https://onlinelibrary.wiley.com/doi/full/10.1111/obr.13256" },
      },
      {
        texto: "Em quem perde muito peso com medicamento, uma fatia relevante do que sai é massa magra. É o treino resistido, com proteína, que decide o que sobra quando o peso para de cair.",
        ref: { rotulo: "Look M et al. Diabetes, Obesity and Metabolism, 2025 (SURMOUNT-1, composição corporal)", url: "https://pubmed.ncbi.nlm.nih.gov/39831339/" },
      },
    ],
    pratica: "Treinadores experientes não vendem musculação como queimador de calorias — seria vender o efeito menor. O que ela faz é garantir que os quilos perdidos sejam gordura, que a força continue subindo no déficit e que o corpo mude de formato. Um aluno que perde 6 kg treinando força costuma parecer ter perdido 10; um que perde 10 sem treinar costuma parecer ter perdido 6.",
    relatos: "Relato frequente: “o peso quase não mudou, mas a roupa caiu”. É o que acontece quando gordura sai e músculo entra ou fica. Também é comum o inverso, em quem só faz dieta: “emagreci, mas fiquei flácido”.",
    acao: "Se você já treina 3 vezes, o quarto treino ajuda menos que os passos e a consistência — mantenha os três com carga progressiva e proteína adequada. Se treina 0 ou 1, subir para 2 é a mudança de maior retorno que existe, mesmo que a balança demore a mostrar.",
  },
  {
    id: "comida",
    titulo: "Alimentação",
    resumo: "É a alavanca mais forte — e a mais fácil de apertar demais.",
    estudos: [
      {
        texto: "O tamanho do déficit define o ritmo, mas cortes grandes aumentam a perda de massa magra e a fome, e são os primeiros a desmoronar. Nos modelos dinâmicos, um déficit menor mantido por mais tempo entrega mais do que um déficit grande abandonado no segundo mês.",
        ref: { rotulo: "Hall KD, Kahan S. Medical Clinics of North America, 2018;102:183-197", url: "https://pubmed.ncbi.nlm.nih.gov/29156185/" },
      },
    ],
    pratica: "O erro clássico não é comer demais; é cortar demais na segunda-feira e não chegar ao sábado. O déficit que funciona é o que a pessoa nem sente muito — 300 a 500 kcal — com proteína alta para segurar fome e músculo. Por isso o simulador tem um piso e não deixa o cenário descer abaixo dele.",
    relatos: "“Comi 1.200 kcal por três semanas, perdi 5 kg e recuperei tudo em um mês” é um dos relatos mais comuns de quem tenta sozinho. O oposto também aparece: quem sobe a proteína e corta pouco relata que “nem parece dieta”.",
    acao: "Mexa em uma coisa: proteína em toda refeição. Depois, tire o que é mais fácil de tirar (bebida calórica, o segundo prato) antes de mexer no que você gosta.",
  },
  {
    id: "primeiras-semanas",
    titulo: "As primeiras semanas enganam",
    resumo: "A balança cai rápido no começo, e não é gordura.",
    estudos: [
      {
        texto: "Ao reduzir carboidrato ou calorias, o corpo gasta glicogênio, e cada grama de glicogênio leva cerca de 3 gramas de água. Os primeiros 1 a 3 kg são, em boa parte, água — e voltam com uma refeição maior, sem que nada tenha dado errado.",
        ref: { rotulo: "Hall KD et al. The Lancet, 2011 — apêndice do modelo (água e glicogênio)", url: "https://www.niddk.nih.gov/-/media/Files/BWP/Hall_Lancet_Web_Appendix.pdf" },
      },
    ],
    pratica: "Todo treinador já viu o aluno eufórico na segunda semana e desanimado na quarta, quando o ritmo “caiu”. Não caiu: a água acabou e sobrou a gordura, que sai devagar. A curva do simulador é a da gordura; a balança das duas primeiras semanas costuma ficar abaixo dela.",
    relatos: "O “whoosh” — o peso parado por dias e uma queda de 1 kg de uma vez — é um dos relatos mais repetidos em fóruns. Não tem mecanismo comprovado; provavelmente é água indo e vindo sobre uma perda de gordura lenta e constante.",
    acao: "Pese-se todo dia se quiser, mas compare a média da semana com a média da anterior. Um número isolado não diz nada.",
  },
  {
    id: "plato",
    titulo: "Quando o peso para",
    resumo: "O platô quase sempre tem uma causa que dá para ver.",
    estudos: [
      {
        texto: "O corpo mais leve gasta menos, e o gasto cai um pouco além do que o peso explica. Mas essa adaptação é pequena perto do outro fator: o déficit que era de 500 kcal no começo vira 200 depois de 8 kg, sem que a pessoa tenha mudado nada.",
        ref: { rotulo: "Hall KD et al. The Lancet, 2011;378:826-837", url: "https://pubmed.ncbi.nlm.nih.gov/21872751/" },
      },
      {
        texto: "A revisão de Hall e Kahan estima que o platô típico por volta de seis meses é explicado principalmente pela aderência caindo aos poucos — e não por um metabolismo que “travou”.",
        ref: { rotulo: "Hall KD, Kahan S. Medical Clinics of North America, 2018;102:183-197", url: "https://pubmed.ncbi.nlm.nih.gov/29156185/" },
      },
    ],
    pratica: "Quando o aluno diz que travou, a primeira coisa a olhar não é o metabolismo: é o registro de comida dos últimos dez dias e os passos. Quase sempre uma das duas afrouxou sem ninguém notar. A segunda coisa é recalcular o gasto com o peso novo — o que era déficit virou manutenção.",
    relatos: "“Travei há um mês e não mudei nada” é o relato clássico. Quando a pessoa volta a anotar, descobre que mudou: porções maiores, um lanche a mais, menos passos no inverno.",
    acao: "Recalcule seu gasto com o peso atual, volte a anotar por uma semana e some 2.000 passos. Se em três semanas a média não mexer, aí sim vale um ajuste na comida.",
  },
];

export const evidencia = (id: Evidencia["id"]) => EVIDENCIAS.find((e) => e.id === id)!;

export const REFERENCIAS_EVIDENCIAS: Referencia[] = [...new Map(EVIDENCIAS.flatMap((e) => e.estudos.map((s) => [s.ref.url, s.ref] as const))).values()];
