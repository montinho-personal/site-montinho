/**
 * Camada editorial das páginas /exercicios/[grupo].
 *
 * Os exercícios vêm da base única; o texto daqui é escrito à mão, por grupo,
 * e diz o que os dados não dizem (como escolher, o que muda entre eles).
 * Indexação seletiva: só vai para o Google (e para o sitemap) o grupo com
 * demanda de busca, revisão editorial e lista com exercícios suficientes.
 * Os demais existem para a navegação, com noindex.
 *
 * Canibalização: o blog tem "treino de X" (como montar o treino) e "como
 * fazer Y" (execução). Estas páginas são "exercícios para X" (descobrir quais
 * existem) — outra intenção. As duas se linkam.
 */

import type { GrupoSlug } from "./mapa";

export interface EditorialGrupo {
  title: string;
  description: string;
  h1: string;
  resposta: string;
  comoEscolher: string;
  emCasa: string;
  artigos: { slug: string; texto: string }[];
  /** Seções extras para perguntas que aparecem nas buscas. */
  extras?: { h2: string; p: string }[];
  searchDemand: "alta" | "media" | "baixa";
  editorialReviewed: boolean;
  uniqueContent: boolean;
  isIndexable: boolean;
}

const base = (o: Omit<EditorialGrupo, "editorialReviewed" | "uniqueContent">): EditorialGrupo => ({ editorialReviewed: true, uniqueContent: true, ...o });

export const EDITORIAL: Record<GrupoSlug, EditorialGrupo> = {
  peito: base({
    title: "Exercícios Para Peito: Academia, Halteres e Casa | Montinho",
    description: "Exercícios para peito (tórax) por equipamento: supinos, crucifixos, crossover, voador e flexões. Filtre por academia, halteres ou casa e veja o que cada um trabalha.",
    h1: "Exercícios para peito",
    resposta: "Supinos (empurrar à frente) e crucifixos ou crossover (fechar os braços) são as duas famílias de exercícios que treinam o peitoral. Não existe um único melhor: a escolha depende do equipamento, do conforto nos ombros e de conseguir progredir carga ou repetições.",
    comoEscolher: "Um supino (barra, halteres ou máquina) costuma ser a base, porque permite mais carga. Um movimento de fechar os braços complementa, com o peitoral mais alongado. Mudar a inclinação do banco pode alterar a ênfase relativa entre as partes do músculo, mas não isola uma delas.",
    emCasa: "Flexões, da mais fácil (joelhos apoiados) à mais difícil (pés elevados), e supino ou crucifixo com halteres no chão ou num banco.",
    extras: [
      { h2: "Exercícios para tórax feminino e masculino são diferentes?", p: "Não. O peitoral é o mesmo músculo em homens e mulheres e responde aos mesmos exercícios: supinos, crucifixos, crossover e flexões. O que muda de pessoa para pessoa é a carga, o volume e o equipamento disponível, não a lista." },
      { h2: "Exercícios para definir o peito", p: "Definição depende de dois fatores: ter músculo e ter pouca gordura por cima dele. Os exercícios desta página constroem o músculo; a gordura diminui com a perda de gordura do corpo todo, que vem da alimentação e do gasto do dia. Nenhum exercício tira gordura só do peito." },
      { h2: "Supino inclinado trabalha a parte de cima do peito?", p: "Inclinar o banco pode aumentar a ênfase relativa na parte superior (clavicular) do peitoral, mas o músculo inteiro trabalha em todos os supinos. Ter um supino reto e um inclinado no treino é uma forma simples de variar o ângulo." },
    ],
    artigos: [{ slug: "treino-de-peito-hipertrofia", texto: "treino de peito para hipertrofia" }, { slug: "treino-de-peito-em-casa", texto: "treino de peito em casa" }, { slug: "como-fazer-supino-reto", texto: "como fazer supino reto" }, { slug: "supino-reto-vs-supino-inclinado", texto: "supino reto vs inclinado" }],
    searchDemand: "alta", isIndexable: true,
  }),
  ombros: base({
    title: "Exercícios Para Ombros: Anterior, Lateral e Posterior",
    description: "Exercícios para ombros separados por parte do deltoide: desenvolvimento, elevação lateral, crucifixo inverso e face pull. Filtre por equipamento.",
    h1: "Exercícios para ombros",
    resposta: "O deltoide tem três partes com funções diferentes: a anterior empurra para cima e para a frente (desenvolvimento), a lateral afasta o braço do corpo (elevação lateral) e a posterior puxa o braço para trás (crucifixo inverso, face pull). Um bom treino de ombros cobre as três.",
    comoEscolher: "Quem faz supino já treina bastante o deltoide anterior. Por isso a lateral e a posterior costumam merecer exercícios próprios. Use os botões de refino abaixo para ver cada parte.",
    emCasa: "Desenvolvimento e elevação lateral com halteres ou elástico, e crucifixo inverso com halteres inclinado à frente.",
    artigos: [{ slug: "treino-de-ombros-hipertrofia", texto: "treino de ombros para hipertrofia" }, { slug: "como-fazer-elevacao-lateral", texto: "como fazer elevação lateral" }, { slug: "como-fazer-desenvolvimento-ombros", texto: "como fazer desenvolvimento" }],
    searchDemand: "alta", isIndexable: true,
  }),
  "deltoide-anterior": base({
    title: "Exercícios Para Deltoide Anterior | Montinho",
    description: "Exercícios para a parte da frente do ombro: desenvolvimentos e elevação frontal, por equipamento.",
    h1: "Exercícios para deltoide anterior",
    resposta: "Desenvolvimentos e elevação frontal são os exercícios que mais trabalham a parte da frente do ombro. Supinos também a treinam como músculo secundário.",
    comoEscolher: "Se o treino já tem supino e desenvolvimento, o deltoide anterior raramente precisa de mais. Ative a opção de incluir secundários para ver os supinos.",
    emCasa: "Desenvolvimento com halteres ou elástico e elevação frontal.",
    artigos: [{ slug: "como-fazer-elevacao-frontal", texto: "como fazer elevação frontal" }],
    searchDemand: "baixa", isIndexable: false,
  }),
  "deltoide-lateral": base({
    title: "Exercícios Para Deltoide Lateral (Ombro Largo) | Montinho",
    description: "Elevação lateral e suas variações: na polia, na máquina, inclinada, com halteres ou elástico. Veja qual usar com o que você tem.",
    h1: "Exercícios para deltoide lateral",
    resposta: "A elevação lateral, em suas variações, é o exercício que mais trabalha a parte do ombro responsável pela largura. Desenvolvimentos ajudam como secundário.",
    comoEscolher: "Halteres, polia, máquina e elástico mudam onde o exercício fica mais pesado no movimento. Vale escolher a variação que você consegue fazer com controle e ir aumentando repetições e carga.",
    emCasa: "Elevação lateral com halteres, garrafas ou elástico preso sob os pés.",
    artigos: [{ slug: "como-fazer-elevacao-lateral", texto: "como fazer elevação lateral" }, { slug: "treino-de-ombros-hipertrofia", texto: "treino de ombros" }],
    searchDemand: "media", isIndexable: true,
  }),
  "deltoide-posterior": base({
    title: "Exercícios Para Posterior de Ombro | Montinho",
    description: "Crucifixo inverso na máquina, face pull na polia, cross e halteres no banco: exercícios para posterior de ombro na academia e em casa.",
    h1: "Exercícios para posterior de ombro",
    resposta: "Crucifixo inverso (na máquina, na polia ou com halteres) e face pull trabalham diretamente o deltoide posterior. Remadas também o treinam, como secundário.",
    comoEscolher: "Como é uma parte pequena e fácil de compensar com as costas, cargas moderadas e boa amplitude costumam funcionar melhor que peso alto. Inclua as remadas ativando a opção de secundários.",
    emCasa: "Crucifixo inverso com halteres, inclinado à frente, ou com elástico. Calistenia: remada invertida numa mesa firme ou barra baixa, com os cotovelos abertos.",
    extras: [
      { h2: "Como se chama a parte posterior do ombro?", p: "Deltoide posterior, a parte de trás do deltoide. A função principal dele é levar o braço para trás com o cotovelo aberto (abdução horizontal), e é esse movimento que os exercícios abaixo repetem." },
      { h2: "Quais os 3 melhores exercícios para posterior de ombro?", p: "Crucifixo inverso na máquina (voador invertido ou peck deck de frente para o banco), face pull na polia com corda e crucifixo inverso com halteres, curvado ou deitado de bruços no banco inclinado. O de máquina é o mais fácil de acertar; o de halteres pede controle para não roubar com o trapézio." },
      { h2: "Posterior de ombro na polia e no cross", p: "Na polia: face pull com corda, puxando na altura do rosto com os cotovelos altos, e crucifixo inverso no cross, cruzando os cabos. O cross unilateral (um braço de cada vez) ajuda quem sente um lado mais que o outro." },
      { h2: "Posterior de ombro e trapézio", p: "O trapézio ajuda em quase todo exercício de posterior. Para o deltoide trabalhar mais, mantenha os ombros longe das orelhas, use carga que dê para controlar e pense em abrir os braços, não em juntar as escápulas." },
    ],
    artigos: [{ slug: "treino-de-ombros-hipertrofia", texto: "treino de ombros" }],
    searchDemand: "alta", isIndexable: true,
  }),
  costas: base({
    title: "Exercícios Para Costas: Dorsais, Trapézio e Lombar | Montinho",
    description: "Melhores exercícios para costas: puxadas para largura e remadas para espessura, na academia, na polia, com halteres ou em casa.",
    h1: "Exercícios para costas",
    resposta: "Costas não é um músculo só. Puxadas e barra fixa (puxar de cima) trabalham mais os dorsais; remadas (puxar à frente) somam o meio das costas; encolhimentos trabalham o trapézio; e exercícios de dobradiça de quadril exigem a lombar. Um treino completo costuma ter pelo menos uma puxada e uma remada.",
    comoEscolher: "Escolha uma puxada vertical e uma remada que você consiga fazer com as costas, sem jogar o corpo. Use os botões de refino para ver só dorsais, parte superior, trapézio ou lombar.",
    emCasa: "Remada com halter apoiado no banco, remada e puxada com elástico, e barra fixa se tiver onde pendurar.",
    extras: [
      { h2: "Quais os melhores exercícios para costas?", p: "Pense em duas funções: puxadas para largura (puxada frontal no pulley, barra fixa) e remadas para espessura (remada curvada, remada unilateral com halter ou serrote, remada baixa). Se fosse escolher 3 para um treino completo: uma puxada, uma remada com barra ou máquina e uma remada unilateral." },
      { h2: "Exercícios para costas na polia", p: "Puxada frontal, remada baixa sentada, pulldown com braços estendidos e remada unilateral no cabo. A polia mantém tensão no músculo o movimento todo e é fácil de ajustar a carga. Use o filtro Polia acima." },
      { h2: "Exercícios para costas com halteres", p: "Remada unilateral apoiada no banco (serrote), remada curvada com dois halteres, remada apoiada no banco inclinado e pullover. Funcionam na academia e em casa." },
      { h2: "Treino de costas feminino é diferente?", p: "Não. Os músculos e os exercícios são os mesmos; o que muda de pessoa para pessoa é carga, volume e o que encaixa na rotina. A mesma puxada e a mesma remada servem para mulheres e homens, inclusive em casa com halteres ou elástico." },
      { h2: "Dá para treinar costas e bíceps no mesmo dia?", p: "Dá, e é uma divisão comum: o bíceps já ajuda em toda puxada e remada. Faça as costas primeiro e o bíceps depois, quando ele já chega um pouco cansado." },
      { h2: "E exercícios de costas de fisioterapia?", p: "Se a busca é por dor nas costas, quem deve avaliar e indicar os exercícios é um médico ou fisioterapeuta. Os exercícios desta página são de treino de força, para quem já está liberado para treinar." },
    ],
    artigos: [{ slug: "treino-de-costas-hipertrofia", texto: "treino de costas para hipertrofia" }, { slug: "treino-de-costas-em-casa", texto: "treino de costas em casa" }, { slug: "puxada-vs-remada", texto: "puxada vs remada" }],
    searchDemand: "alta", isIndexable: true,
  }),
  dorsais: base({
    title: "Exercícios Para Dorsal: Puxadas, Barra e Remadas",
    description: "Exercícios para o grande dorsal (a \"asa\"): puxadas, barra fixa, pullover e remadas, por equipamento.",
    h1: "Exercícios para dorsal",
    resposta: "O grande dorsal puxa o braço para baixo e para trás. Puxadas na polia, barra fixa e pullover são os movimentos mais diretos; remadas também o treinam bastante.",
    comoEscolher: "Pense em levar os cotovelos em direção ao quadril. Se você ainda não faz barra fixa, puxada na polia ou barra assistida permitem ajustar a carga.",
    emCasa: "Barra fixa ou barra assistida com elástico, puxada com elástico preso no alto e remada com halteres.",
    artigos: [{ slug: "como-fazer-pulldown-puxada-frontal", texto: "como fazer a puxada frontal" }, { slug: "barra-fixa-vs-puxada", texto: "barra fixa vs puxada" }],
    searchDemand: "media", isIndexable: true,
  }),
  "parte-superior-das-costas": base({
    title: "Exercícios Para a Parte Superior das Costas | Montinho",
    description: "Remadas e aberturas para o meio das costas, romboides e trapézio médio.",
    h1: "Exercícios para a parte superior das costas",
    resposta: "Remadas e movimentos de abrir os braços para trás trabalham o meio das costas: romboides, trapézio médio e deltoide posterior.",
    comoEscolher: "Remadas com os cotovelos mais abertos tendem a envolver mais essa região; mais junto ao corpo, mais dorsal.",
    emCasa: "Remada com halter ou elástico e crucifixo inverso.",
    artigos: [], searchDemand: "baixa", isIndexable: false,
  }),
  trapezio: base({
    title: "Exercícios Para Trapézio | Montinho",
    description: "Encolhimento, remada alta e farmer's walk: exercícios para trapézio com halteres ou barra.",
    h1: "Exercícios para trapézio",
    resposta: "Encolhimentos (com halteres ou barra) trabalham a parte superior do trapézio. Remadas e levantamento terra também o envolvem como secundário.",
    comoEscolher: "Quem faz terra e remadas pesadas já treina bastante o trapézio. Encolhimentos entram quando o objetivo é dar mais atenção a ele.",
    emCasa: "Encolhimento com halteres ou com uma mochila pesada em cada mão.",
    artigos: [{ slug: "como-fazer-encolhimento-trapezio", texto: "como fazer encolhimento" }],
    searchDemand: "media", isIndexable: true,
  }),
  lombar: base({
    title: "Exercícios Que Trabalham a Lombar | Montinho",
    description: "Exercícios de dobradiça de quadril em que a lombar sustenta o tronco.",
    h1: "Exercícios que trabalham a lombar",
    resposta: "A lombar trabalha sustentando o tronco em exercícios de dobradiça de quadril, como stiff, levantamento terra e extensão lombar.",
    comoEscolher: "Quem tem dor lombar deve ser avaliado antes de escolher exercícios para a região; esta lista não substitui essa avaliação.",
    emCasa: "Extensão lombar no chão (superman) e stiff com halteres ou elástico, com carga leve.",
    artigos: [{ slug: "exercicios-para-dor-nas-costas-coluna", texto: "exercícios para dor nas costas" }],
    searchDemand: "media", isIndexable: false,
  }),
  biceps: base({
    title: "Exercícios Para Bíceps: Academia, Halteres e Casa | Montinho",
    description: "Roscas para bíceps por equipamento: direta, alternada, martelo, Scott, concentrada e no cabo. Veja qual usar com o que você tem.",
    h1: "Exercícios para bíceps",
    resposta: "Todos os exercícios de bíceps são variações de dobrar o cotovelo contra resistência: roscas. O que muda entre elas é a pegada, a posição do braço e onde o movimento fica mais pesado. Puxadas e remadas também treinam o bíceps como secundário.",
    comoEscolher: "Uma rosca em que o braço fica mais à frente do corpo (Scott, concentrada) e outra com o braço ao lado ou atrás (alternada, banco inclinado) cobrem posições diferentes. A rosca martelo inclui mais o braquial e o antebraço.",
    emCasa: "Roscas com halteres, garrafas ou elástico.",
    extras: [
      { h2: "Qual o melhor exercício para bíceps?", p: "Não existe um único. Rosca direta (barra ou halteres) é a base para carga; rosca martelo inclui mais o braquial e o antebraço; rosca Scott fixa o braço à frente; e a rosca no banco inclinado a 45° trabalha o bíceps alongado. O melhor é o que você consegue progredir com boa execução." },
      { h2: "Quais 3 exercícios para um treino de bíceps completo?", p: "Uma rosca com o braço ao lado ou atrás do corpo (direta ou banco inclinado), uma com o braço à frente (Scott ou concentrada) e a martelo. Com isso você cobre posições diferentes do músculo." },
      { h2: "2 exercícios de bíceps são suficientes?", p: "Para a maioria, sim. O bíceps já trabalha em toda puxada e remada do treino de costas, então dois exercícios bem escolhidos, com séries perto da falha e progressão de carga, costumam bastar. O que importa mais é o total de séries na semana, não o número de exercícios." },
      { h2: "Exercícios para bíceps na polia e na máquina", p: "Rosca na polia com barra reta ou corda, rosca unilateral no cabo e rosca Scott na máquina. A polia mantém tensão o movimento todo. Use os filtros Polia ou Máquina acima." },
      { h2: "Treino de bíceps e tríceps no mesmo dia", p: "É uma combinação comum e funciona: são músculos opostos, um descansa enquanto o outro trabalha. Dá para alternar em pares (uma série de cada). Para o tríceps, veja os exercícios para tríceps." },
      { h2: "Bíceps braquial e bíceps femoral", p: "O bíceps do braço se chama bíceps braquial. Bíceps femoral é outro músculo, na parte de trás da coxa: os exercícios dele estão em exercícios para posterior de coxa." },
    ],
    artigos: [{ slug: "treino-de-biceps", texto: "treino de bíceps" }, { slug: "como-fazer-rosca-direta", texto: "como fazer rosca direta" }, { slug: "treino-de-braco-em-casa", texto: "treino de braço em casa" }],
    searchDemand: "alta", isIndexable: true,
  }),
  triceps: base({
    title: "Exercícios Para Tríceps: Academia, Halteres e Casa | Montinho",
    description: "Tríceps pulley, testa, francês, coice, paralelas e supino fechado: exercícios para tríceps por equipamento.",
    h1: "Exercícios para tríceps",
    resposta: "O tríceps estica o cotovelo. Exercícios com o braço junto ao corpo (pulley, coice) e com o braço acima da cabeça (francês, testa) trabalham o músculo em comprimentos diferentes. Supinos e paralelas o treinam junto com o peito.",
    comoEscolher: "Combinar um exercício com o braço acima da cabeça e outro com o braço ao lado do corpo costuma cobrir bem o tríceps.",
    emCasa: "Tríceps no banco ou cadeira, flexão com mãos próximas, francês com halter e tríceps com elástico.",
    extras: [
      { h2: "Quais os 3 melhores exercícios para tríceps?", p: "Tríceps pulley na polia alta (com corda ou barra), tríceps testa e tríceps francês. Os dois primeiros trabalham com o braço ao lado do corpo ou à frente; o francês, com o braço acima da cabeça, que alonga mais a cabeça longa. Se quiser um quarto, supino fechado ou paralelas permitem mais carga." },
      { h2: "Tríceps braquial: as 3 cabeças", p: "Tríceps braquial é o nome do músculo da parte de trás do braço. Ele tem três cabeças: longa, lateral e medial. Todas trabalham em qualquer extensão de cotovelo; a cabeça lateral, a que aparece do lado de fora do braço, é bem recrutada no pulley e nos exercícios com o braço ao lado do corpo, e a longa ganha mais quando o braço está acima da cabeça." },
      { h2: "Exercícios para tríceps no banco e com halteres", p: "No banco: tríceps testa e francês deitado com halteres, supino fechado e o tríceps no banco (mergulho com as mãos apoiadas atrás). Com halteres: francês com um halter nas duas mãos, coice e testa com halteres. Use o filtro Halteres acima." },
      { h2: "Exercícios para tríceps na polia", p: "Pulley com corda, com barra reta ou V, tríceps unilateral no cabo e francês na polia, de costas para o aparelho. A polia mantém tensão o movimento todo." },
      { h2: "Treino de tríceps feminino é diferente?", p: "Não. Os exercícios são os mesmos para mulheres e homens, inclusive em casa: tríceps no banco ou cadeira, flexão com mãos próximas e francês com halter ou garrafa. O que muda é carga e volume de cada pessoa." },
    ],
    artigos: [{ slug: "treino-de-triceps", texto: "treino de tríceps" }, { slug: "como-fazer-skull-crusher-triceps-testa", texto: "como fazer tríceps testa" }],
    searchDemand: "alta", isIndexable: true,
  }),
  antebraco: base({
    title: "Exercícios Para Antebraço | Montinho",
    description: "Rosca inversa, rosca de punho e farmer's walk para antebraço e pegada.",
    h1: "Exercícios para antebraço",
    resposta: "Rosca inversa, rosca de punho e carregar peso (farmer's walk) trabalham o antebraço e a pegada. Remadas, terra e roscas também o envolvem.",
    comoEscolher: "Para a maioria das pessoas, as puxadas e o terra já treinam bem a pegada.",
    emCasa: "Rosca de punho com halter e carregar sacolas ou halteres pesados.",
    artigos: [], searchDemand: "baixa", isIndexable: false,
  }),
  abdomen: base({
    title: "Exercícios Para Abdômen: Academia e Casa | Montinho",
    description: "Exercícios para fortalecer o abdômen: abdominais, prancha, roda e rotação. Sem promessa de perder barriga: veja o que cada um faz.",
    h1: "Exercícios para abdômen",
    resposta: "Abdominais (flexionar o tronco), pranchas e roda (impedir o tronco de se mover) e rotações treinam o abdômen. Eles fortalecem a musculatura; não queimam a gordura da barriga, que depende da perda de gordura do corpo todo.",
    comoEscolher: "Combinar um exercício de flexão do tronco com um de estabilização cobre as funções principais. Agachamentos e terra também exigem bastante do core.",
    emCasa: "Abdominal supra e infra, prancha, prancha lateral e abdominal bicicleta, sem equipamento.",
    extras: [
      { h2: "Quais os melhores exercícios para abdômen?", p: "Prancha, abdominal supra (tirando só os ombros do chão, sem puxar o pescoço), abdominal infra, dead bug e prancha lateral cobrem o básico. Na academia dá para progredir com carga: abdominal na polia ajoelhado, abdominal com anilha e elevação de pernas na barra ou no apoio." },
      { h2: "Abdômen inferior e superior", p: "O reto abdominal é um músculo só, de cima a baixo. Exercícios que trazem o tronco (supra) e os que trazem a pelve (infra, elevação de pernas) mudam um pouco a ênfase, mas não separam o músculo em dois. Vale incluir os dois tipos." },
      { h2: "Exercícios para abdômen com peso, na polia e em pé", p: "Com peso: abdominal com anilha ou halter no peito e abdominal declinado. Na polia: abdominal ajoelhado puxando a corda e rotação no cabo. Em pé: pallof press no cabo ou elástico, rotação no cabo e caminhada do fazendeiro com peso de um lado só." },
      { h2: "Exercício de abdômen faz perder barriga?", p: "Não diretamente. Abdominal fortalece o músculo, mas não queima a gordura da barriga especificamente: ela diminui com o gasto total e a alimentação ao longo do tempo. Treino de força para o corpo todo, mais atividade no dia a dia e constância ajudam mais que dezenas de abdominais." },
      { h2: "O agachamento trabalha o abdômen?", p: "Trabalha como estabilizador: o abdômen segura o tronco firme durante agachamento, terra e outros exercícios pesados. Ajuda, mas não substitui exercícios específicos para quem quer fortalecer o abdômen." },
      { h2: "Abdômen feminino e masculino é diferente?", p: "Não. Os exercícios são os mesmos; o que muda é o ponto de partida e a progressão de cada pessoa." },
    ],
    artigos: [{ slug: "treino-de-abdomen-em-casa", texto: "treino de abdômen em casa" }, { slug: "abdominal-todo-dia-perde-barriga", texto: "abdominal todo dia perde barriga?" }],
    searchDemand: "alta", isIndexable: true,
  }),
  gluteos: base({
    title: "Exercícios Para Glúteos: Academia, Halteres e Casa | Montinho",
    description: "Exercícios para glúteos por equipamento: elevação pélvica, agachamentos, búlgaro, stiff e abdução. Filtre por academia, halteres ou casa.",
    h1: "Exercícios para glúteos",
    resposta: "Os glúteos trabalham estendendo o quadril (elevação pélvica, stiff, agachamentos, búlgaro) e afastando a perna do corpo (abdução, que enfatiza o glúteo médio). Um treino completo combina os dois tipos.",
    comoEscolher: "Elevação pélvica carrega o glúteo com o quadril estendido; stiff e búlgaro, com o músculo alongado. Ter um de cada costuma funcionar melhor que repetir só um tipo.",
    emCasa: "Ponte e elevação pélvica (inclusive unilateral), búlgaro com o pé no sofá, stiff com halteres e abdução com elástico. Caneleira também serve: coice e abdução deitado de lado.",
    extras: [
      { h2: "Como trabalhar os 3 músculos dos glúteos?", p: "O glúteo máximo, o maior, estende o quadril: elevação pélvica, stiff, búlgaro e agachamentos. O glúteo médio e o mínimo, na lateral, afastam a perna e estabilizam a pélvis: cadeira abdutora, abdução na polia ou com elástico, e exercícios de uma perna só, como búlgaro e step up. Um treino que tenha os dois tipos cobre os três." },
      { h2: "Exercícios para glúteo na máquina e na polia", p: "Na academia: hip thrust na máquina, glúteo na máquina (coice), cadeira abdutora e, na polia, glúteo no cabo, abdução no cabo e pull-through. Use o filtro Máquina ou Polia acima." },
      { h2: "Como fazer o glúteo crescer?", p: "Como qualquer músculo: séries perto da falha, volume suficiente na semana (algo como 10 a 20 séries para quem treina há algum tempo), carga ou repetições subindo ao longo das semanas e comida e sono que deem conta. Exercício certo sem progressão não faz crescer." },
      { h2: "Dá para ganhar glúteo em 1 mês?", p: "Em um mês dá para ganhar força e começar a ver diferença, principalmente quem está começando. Mudança visível de tamanho costuma levar alguns meses de treino consistente. Desconfie de promessas de glúteo empinado rápido: a forma depende de músculo, gordura e genética." },
    ],
    artigos: [{ slug: "treino-de-gluteos-feminino", texto: "treino de glúteos" }, { slug: "treino-de-gluteos-em-casa", texto: "treino de glúteos em casa" }, { slug: "exercicios-para-gluteo-medio", texto: "exercícios para glúteo médio" }, { slug: "como-fazer-hip-thrust", texto: "como fazer hip thrust" }],
    searchDemand: "alta", isIndexable: true,
  }),
  quadriceps: base({
    title: "Exercícios Para Quadríceps: Academia e Casa | Montinho",
    description: "Agachamentos, leg press, hack, cadeira extensora, búlgaro e afundo: exercícios para quadríceps por equipamento.",
    h1: "Exercícios para quadríceps",
    resposta: "O quadríceps estica o joelho. Agachamentos, leg press e hack o treinam junto com os glúteos; a cadeira extensora e o sissy squat o isolam. Búlgaro e afundo fazem o mesmo trabalho uma perna por vez.",
    comoEscolher: "Um agachamento ou leg press como base e uma extensão de joelho como complemento cobrem bem o quadríceps. Unilaterais ajudam a equilibrar os lados.",
    emCasa: "Agachamento com halteres ou peso do corpo, búlgaro, afundo, step up e extensão de joelho sentado com caneleira ou elástico.",
    extras: [
      { h2: "Qual exercício para ganhar coxa?", p: "Combine compostos e isolados. Agachamento livre, leg press, hack e agachamento no smith trabalham o quadríceps com carga alta; cadeira extensora isola a extensão do joelho. Um composto e um isolado no mesmo treino já cobrem bem a frente da coxa." },
      { h2: "Qual agachamento pega mais o quadríceps?", p: "Os que deixam o tronco mais em pé e o joelho avançar à frente: agachamento frontal, hack, agachamento no smith com os pés um pouco à frente e búlgaro com passo curto. Pés mais afastados e tronco inclinado passam mais trabalho para glúteos." },
      { h2: "Quantos exercícios no treino de quadríceps?", p: "Dois ou três costumam bastar: um composto pesado, uma variação unilateral e a cadeira extensora. Mais importante que o número de exercícios é o total de séries na semana e conseguir progredir carga ou repetições." },
      { h2: "Exercícios para quadríceps isolado, na máquina e com caneleira", p: "Isolado de verdade, só a cadeira extensora (ou a extensão de joelho sentado com caneleira ou elástico, em casa). Na máquina: extensora, leg press, hack e smith. Use o filtro Máquina acima." },
      { h2: "Quadríceps junto com glúteos e posterior", p: "Agachamento, búlgaro, afundo e leg press trabalham quadríceps e glúteos juntos. Para o posterior de coxa, os exercícios são outros (stiff, mesa e cadeira flexora): veja exercícios para posterior de coxa." },
      { h2: "E exercícios de quadríceps de fisioterapia?", p: "Se é por dor ou recuperação de lesão no joelho, quem deve indicar os exercícios é o médico ou o fisioterapeuta. Esta página é de treino de força, para quem já está liberado." },
    ],
    artigos: [{ slug: "treino-de-perna-completo", texto: "treino de perna completo" }, { slug: "treino-de-pernas-em-casa", texto: "treino de pernas em casa" }, { slug: "como-fazer-cadeira-extensora", texto: "como fazer cadeira extensora" }, { slug: "agachamento-vs-leg-press", texto: "agachamento vs leg press" }],
    searchDemand: "alta", isIndexable: true,
  }),
  "posterior-de-coxa": base({
    title: "Exercícios Para Posterior de Coxa: Academia e Casa | Montinho",
    description: "Stiff, flexoras, terra e nordic curl: exercícios para posterior de coxa por equipamento, separados por função.",
    h1: "Exercícios para posterior de coxa",
    resposta: "O posterior de coxa tem duas funções: dobrar o joelho (mesa, cadeira e flexora em pé, nordic curl) e estender o quadril (stiff, terra, good morning). Um treino completo inclui pelo menos um exercício de cada tipo.",
    comoEscolher: "Stiff e flexora não se substituem: trabalham o mesmo músculo em funções diferentes. Use o filtro de tipo para ver compostos (dobradiça) ou isoladores (flexão de joelho).",
    emCasa: "Stiff com halteres ou elástico e flexão de joelho deslizando os pés no chão.",
    artigos: [{ slug: "treino-de-posterior-de-coxa", texto: "treino de posterior de coxa" }, { slug: "como-fazer-stiff", texto: "como fazer stiff" }, { slug: "stiff-vs-levantamento-terra", texto: "stiff vs levantamento terra" }],
    searchDemand: "alta", isIndexable: true,
  }),
  adutores: base({
    title: "Exercícios Para Adutores | Montinho",
    description: "Exercícios para a parte interna da coxa.",
    h1: "Exercícios para adutores",
    resposta: "A cadeira adutora e agachamentos com as pernas afastadas (sumô) trabalham a parte interna da coxa.",
    comoEscolher: "Agachamentos e afundos já envolvem os adutores; a adutora entra como complemento.",
    emCasa: "Agachamento sumô com halter.",
    artigos: [], searchDemand: "baixa", isIndexable: false,
  }),
  panturrilha: base({
    title: "Exercícios Para Panturrilha: Academia e Casa | Montinho",
    description: "Panturrilha em pé, sentado, no leg press, no smith e unilateral: exercícios por equipamento.",
    h1: "Exercícios para panturrilha",
    resposta: "Todo exercício de panturrilha é uma variação de subir na ponta dos pés. Com o joelho esticado (em pé, leg press, smith) o gastrocnêmio trabalha mais; com o joelho dobrado (sentado), o sóleo.",
    comoEscolher: "Ter uma versão com joelho esticado e outra sentada cobre os dois músculos. Amplitude completa, com pausa embaixo, costuma render mais que carga alta com meio movimento.",
    emCasa: "Panturrilha unilateral num degrau, segurando um halter ou mochila.",
    artigos: [{ slug: "treino-de-panturrilha", texto: "treino de panturrilha" }],
    searchDemand: "media", isIndexable: true,
  }),
};

export const GRUPOS_INDEXAVEIS = (Object.entries(EDITORIAL) as [GrupoSlug, EditorialGrupo][])
  .filter(([, e]) => e.isIndexable && e.editorialReviewed && e.uniqueContent)
  .map(([s]) => s);
