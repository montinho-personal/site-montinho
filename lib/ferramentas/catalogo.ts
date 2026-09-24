import { MOBILIDADE_NO_AR } from "@/lib/mobilidade/lancamento";
import { CONVERSOR_NO_AR } from "@/lib/concentracao/revisao";

/**
 * O catálogo da Central de Ferramentas — a fonte única do que existe.
 *
 * POR QUE UM CATÁLOGO, E NÃO CARDS ESCRITOS À MÃO
 *
 * A página /ferramentas nasceu com quatro ferramentas e chegou a trinta e
 * cinco com o mesmo desenho: um card grande por ferramenta, colado na
 * página. Cada ferramenta nova era um bloco de JSX copiado, um item de
 * ItemList numerado à mão e um lugar a mais para a posição desencontrar.
 * Aqui, ferramenta nova é UMA entrada: nome, rota, categoria, uma frase de
 * resultado, a ação, o tempo, o ícone e as palavras pelas quais alguém a
 * procuraria. A página, a busca, os filtros e o schema saem daqui.
 *
 * AS CATEGORIAS SÃO PELO PROBLEMA, NÃO PELO FORMATO
 *
 * "Calculadoras", "quizzes" e "IA" descrevem como a ferramenta é feita.
 * Quem chega não procura um formato: procura resolver emagrecimento,
 * alimentação, suplemento, treino ou cardio. Uma categoria só entra se
 * ajudar a decidir onde clicar — e Alphaville é separada de propósito,
 * para que uma ferramenta local não pareça servir o país inteiro.
 *
 * ESTE ARQUIVO NÃO IMPORTA NADA PESADO
 *
 * Ele roda no navegador, dentro da busca. Nada de blog, nada de base de
 * alimentos: só dados e as duas chaves de lançamento.
 */

export type CategoriaId = "emagrecimento" | "alimentacao" | "suplementacao" | "treino" | "cardio" | "alphaville";

export interface Categoria {
  id: CategoriaId;
  /** O título da seção. */
  nome: string;
  /** O rótulo do filtro — cabe num chip. */
  chip: string;
  /** Uma linha, dizendo o que se resolve ali. */
  descricao: string;
  /** Só a de Alphaville: por que ela é separada. */
  aviso?: string;
}

export const CATEGORIAS: Categoria[] = [
  { id: "emagrecimento", nome: "Emagrecimento e calorias", chip: "Emagrecimento", descricao: "Quanto você gasta, quanto comer e o que esperar da balança." },
  { id: "alimentacao", nome: "Alimentação e nutrientes", chip: "Alimentação", descricao: "Proteína, macros, cardápio e o que tem em cada alimento." },
  { id: "suplementacao", nome: "Suplementação", chip: "Suplementação", descricao: "A dose pelo consenso científico, quanto o pote dura e quanto custa — pelo rótulo do seu produto." },
  { id: "treino", nome: "Treino e hipertrofia", chip: "Treino", descricao: "Por onde começar, como dividir a semana, quanto volume, quanta carga e se a execução está certa." },
  { id: "cardio", nome: "Cardio e atividades", chip: "Cardio", descricao: "O gasto real de cada atividade com o seu peso, e a zona de esforço certa." },
  {
    id: "alphaville",
    nome: "Para quem treina em Alphaville",
    chip: "Alphaville",
    descricao: "Ferramentas de alcance local, para quem mora ou trabalha em Alphaville e região.",
    aviso: "As outras categorias servem qualquer pessoa. Estas só fazem sentido para quem está aqui perto.",
  },
];

export type IconeId =
  | "chama" | "balanca" | "corpo" | "seringa" | "capsula" | "medida"
  | "ovo" | "pizza" | "talheres" | "tabela"
  | "halter" | "bussola" | "calendario" | "video" | "alvo" | "alongar"
  | "coracao" | "corrida" | "passos" | "bicicleta" | "eliptico" | "ondas" | "musica"
  | "bola" | "luva" | "faixa" | "corda" | "escada" | "raio" | "kettlebell" | "bandeira"
  | "pino" | "chat";

export interface FerramentaCatalogo {
  /** Identificador curto, estável. É o que o analytics recebe. */
  id: string;
  href: string;
  /** O nome, como âncora: é o texto do link. */
  nome: string;
  /** O que a pessoa descobre — uma frase, no imperativo ou no resultado. */
  resultado: string;
  /** A ação do card: verbo + objeto. Nunca "abrir", "saiba mais". */
  acao: string;
  /** Quanto esforço exige, do jeito que cabe numa linha. */
  tempo: string;
  categoria: CategoriaId | "apoio";
  icone: IconeId;
  /**
   * Como as pessoas procuram isto: sinônimos, perguntas, termos leigos,
   * nomes de aparelho. A busca lê nome, resultado e tags; as tags são
   * onde entra a linguagem de quem não sabe o nome da ferramenta.
   */
  tags: string[];
  /** "novo" ganha selo. Nada mais ganha destaque por padrão. */
  selo?: "novo";
  /** Chave de lançamento. Fora do ar, a ferramenta some da página inteira. */
  noAr?: boolean;
}

export const CATALOGO: FerramentaCatalogo[] = [
  /* ── Emagrecimento e calorias ─────────────────────────────────────── */
  {
    id: "tdee",
    href: "/ferramentas/calculadora-tmb-tdee",
    nome: "Calculadora de TMB e TDEE",
    resultado: "Descubra quantas calorias seu corpo gasta por dia.",
    acao: "Calcular meu gasto",
    tempo: "30 segundos",
    categoria: "emagrecimento",
    icone: "chama",
    tags: ["gasto calorico", "metabolismo basal", "quantas calorias eu gasto", "taxa metabolica", "gasto diario", "quanto meu corpo gasta", "calorias por dia", "manutencao", "emagrecer", "perder peso"],
  },
  {
    id: "deficit",
    href: "/ferramentas/calculadora-deficit-calorico",
    nome: "Calculadora de Déficit Calórico",
    resultado: "Veja quantas calorias comer por dia para emagrecer.",
    acao: "Calcular meu déficit",
    tempo: "1 minuto",
    categoria: "emagrecimento",
    icone: "balanca",
    tags: ["emagrecer", "perder peso", "quanto comer para emagrecer", "calorias para emagrecer", "dieta", "secar", "cutting", "definir", "meta calorica", "quantas calorias comer"],
  },
  {
    id: "meta",
    href: "/ferramentas/meta-de-peso",
    nome: "Calculadora de Meta de Peso",
    resultado: "Saiba quantos quilos dá para perder até uma data, sem pagar em músculo.",
    acao: "Calcular minha meta",
    tempo: "10 segundos",
    categoria: "emagrecimento",
    icone: "balanca",
    tags: ["perder peso ate", "quantos quilos", "prazo", "fim do ano", "casamento", "viagem", "quanto tempo para emagrecer", "meta de peso", "quilos por semana", "emagrecer rapido"],
  },
  {
    id: "composicao",
    href: "/ferramentas/composicao-corporal",
    nome: "Calculadora de Composição Corporal",
    resultado: "Traduza peso e percentual de gordura em quilos de músculo e de gordura.",
    acao: "Ler minha composição",
    tempo: "15 segundos",
    categoria: "emagrecimento",
    icone: "corpo",
    tags: ["bioimpedancia", "percentual de gordura", "massa magra", "massa gorda", "gordura corporal", "quanto de gordura", "body fat", "avaliacao fisica"],
  },
  {
    id: "glp1",
    href: "/ferramentas/massa-magra-glp1",
    nome: "Massa Magra no GLP-1",
    resultado: "Estime quanto do peso perdido com Mounjaro ou Ozempic pode ser músculo.",
    acao: "Estimar minha perda",
    tempo: "20 segundos",
    categoria: "emagrecimento",
    icone: "corpo",
    tags: ["mounjaro", "ozempic", "tirzepatida", "retatrutida", "semaglutida", "caneta", "perder musculo", "remedio para emagrecer", "glp1", "wegovy"],
  },

  /* ── Alimentação e nutrientes ─────────────────────────────────────── */
  {
    id: "proteina",
    href: "/ferramentas/calculadora-de-proteina",
    nome: "Calculadora de Proteína",
    resultado: "Descubra quanta proteína consumir por dia, com a fonte de cada número.",
    acao: "Calcular proteína",
    tempo: "10 segundos",
    categoria: "alimentacao",
    icone: "ovo",
    tags: ["quanto de proteina", "proteina por kg", "proteina por dia", "gramas de proteina", "hipertrofia", "ganhar massa", "quanto whey", "dieta"],
  },
  {
    id: "macros",
    href: "/ferramentas/calculadora-macros",
    nome: "Calculadora de Macros",
    resultado: "Distribua suas calorias em proteína, carboidrato e gordura.",
    acao: "Calcular meus macros",
    tempo: "30 segundos",
    categoria: "alimentacao",
    icone: "pizza",
    tags: ["macronutrientes", "carboidrato", "gordura", "distribuir calorias", "dieta flexivel", "quantos carboidratos", "low carb", "dieta"],
  },
  {
    id: "cardapio",
    href: "/ferramentas/monte-seu-cardapio",
    nome: "Montinho FitChef",
    resultado: "Transforme sua meta de calorias em cardápio, com substituições e lista de compras.",
    acao: "Montar meu cardápio",
    tempo: "3 a 5 minutos",
    categoria: "alimentacao",
    icone: "talheres",
    tags: ["cardapio", "plano alimentar", "o que comer", "dieta pronta", "refeicoes", "lista de compras", "monte seu cardapio", "emagrecer", "perder peso", "dieta"],
  },
  {
    id: "alimentos",
    href: "/alimentos",
    nome: "Tabela Nutricional de Alimentos",
    resultado: "Veja calorias, proteína, carboidratos e gorduras de 597 alimentos.",
    acao: "Pesquisar alimento",
    tempo: "resposta em segundos",
    categoria: "alimentacao",
    icone: "tabela",
    tags: ["tabela taco", "quantas calorias tem", "quanta proteina tem", "banana", "feijao", "arroz", "ovo", "frango", "comparar alimentos", "valor nutricional", "informacao nutricional"],
  },

  /* ── Suplementação ────────────────────────────────────────────────── */
  {
    id: "creatina",
    href: "/ferramentas/calculadora-creatina",
    nome: "Calculadora de Creatina",
    resultado: "Veja quanto de creatina tomar por dia, com ou sem saturação, e quanto o pote dura.",
    acao: "Calcular creatina",
    tempo: "10 segundos",
    categoria: "suplementacao",
    icone: "capsula",
    tags: ["creatina", "quanto de creatina", "saturacao", "3g ou 5g", "creatina por kg", "pote de creatina", "suplemento", "dose"],
    selo: "novo",
  },
  {
    id: "whey",
    href: "/ferramentas/calculadora-whey",
    nome: "Calculadora de Whey",
    resultado: "Descubra quanto whey completa a proteína que falta na sua alimentação.",
    acao: "Calcular whey",
    tempo: "30 segundos",
    categoria: "suplementacao",
    icone: "medida",
    tags: ["whey", "quanto whey", "scoop", "dose de whey", "whey protein", "quantos scoops", "concentrado isolado", "suplemento", "proteina em po"],
    selo: "novo",
  },
  {
    noAr: CONVERSOR_NO_AR,
    id: "conversor",
    href: "/ferramentas/conversor-mg-ml-u100",
    nome: "Calculadora de Peptídeos e UI",
    resultado: "Entenda o que as marcações de uma seringa U-100 representam em mg e mL.",
    acao: "Entender a seringa",
    tempo: "educacional",
    categoria: "suplementacao",
    icone: "seringa",
    tags: ["seringa", "unidades", "ui", "mg ml", "peptideo", "concentracao", "conversor"],
  },

  /* ── Treino e hipertrofia ─────────────────────────────────────────── */
  {
    id: "diagnostico",
    href: "/diagnostico",
    nome: "Diagnóstico Montinho",
    resultado: "Descubra seu perfil de treino e o que mais te trava hoje.",
    acao: "Fazer meu diagnóstico",
    tempo: "9 perguntas · 1 a 2 minutos",
    categoria: "treino",
    icone: "bussola",
    tags: ["por onde comecar", "nao sei o que fazer", "perfil", "quiz", "teste", "travado", "iniciante", "comecar a treinar", "avaliacao"],
  },
  {
    id: "rotina",
    href: "/treino-para-minha-rotina",
    nome: "Treino Para Minha Rotina",
    resultado: "Receba a divisão de treino que cabe nos dias que você realmente tem.",
    acao: "Montar minha divisão",
    tempo: "8 perguntas · 1 minuto",
    categoria: "treino",
    icone: "calendario",
    tags: ["divisao de treino", "como dividir meu treino", "abc", "abcd", "push pull legs", "ppl", "upper lower", "full body", "quantos dias treinar", "montar treino", "ficha de treino", "treino semanal"],
  },
  {
    id: "volume",
    href: "/ferramentas/calculadora-volume-treino",
    nome: "Calculadora de Volume de Treino",
    resultado: "Some as séries semanais de cada músculo e veja onde o treino está desequilibrado.",
    acao: "Analisar meu volume",
    tempo: "1 minuto",
    categoria: "treino",
    icone: "halter",
    tags: ["series por semana", "quantas series", "volume semanal", "series por musculo", "treino equilibrado", "hipertrofia", "ganhar massa"],
  },
  {
    id: "onerm",
    href: "/ferramentas/calculadora-1rm",
    nome: "Calculadora de 1RM",
    resultado: "Estime sua carga máxima e saiba quais anilhas colocar na barra.",
    acao: "Calcular meu 1RM",
    tempo: "10 segundos",
    categoria: "treino",
    icone: "halter",
    tags: ["1rm", "repeticao maxima", "carga maxima", "quanto peso colocar", "peso na barra", "anilhas", "porcentagem da carga", "forca", "quanto colocar na barra", "supino", "agachamento"],
  },
  {
    id: "revisao",
    href: "/revisao-de-execucao",
    nome: "Revisão Gratuita de Execução",
    resultado: "Grave uma série, mande pelo WhatsApp e eu digo o que ajustar no movimento.",
    acao: "Enviar meu vídeo",
    tempo: "grave uma série",
    categoria: "treino",
    icone: "video",
    tags: ["execucao", "estou fazendo certo", "tecnica", "video", "corrigir exercicio", "postura", "forma", "amplitude"],
  },
  {
    id: "potencial",
    href: "/ferramentas/potencial-natural",
    nome: "Calculadora de Potencial Natural",
    resultado: "Saiba quanto músculo ainda dá para ganhar sem anabolizante, pelo seu FFMI.",
    acao: "Calcular meu potencial",
    tempo: "20 segundos",
    categoria: "treino",
    icone: "alvo",
    tags: ["ffmi", "potencial genetico", "natural", "limite", "quanto musculo posso ganhar", "plato", "ganhar massa", "hipertrofia"],
  },
  {
    noAr: MOBILIDADE_NO_AR,
    id: "mobilidade",
    href: "/ferramentas/teste-mobilidade",
    nome: "Destrave Seu Corpo",
    resultado: "Teste sua mobilidade em cinco movimentos e receba um protocolo curto.",
    acao: "Testar minha mobilidade",
    tempo: "5 minutos",
    categoria: "treino",
    icone: "alongar",
    tags: ["mobilidade", "alongamento", "flexibilidade", "corpo rigido", "calcanhar levanta", "agachamento", "ombro travado", "amplitude"],
  },

  /* ── Cardio e atividades ──────────────────────────────────────────── */
  {
    id: "corrida",
    href: "/ferramentas/calculadora-corrida",
    nome: "Calculadora de Corrida",
    resultado: "Converta pace, tempo e distância e veja o gasto de correr com o seu peso.",
    acao: "Calcular minha corrida",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "corrida",
    tags: ["pace", "correr", "gasto na corrida", "5km", "10km", "meia maratona", "maratona", "calorias correndo", "ritmo", "tempo de prova"],
  },
  {
    id: "caminhada",
    href: "/ferramentas/calculadora-calorias-caminhada",
    nome: "Calculadora de Calorias da Caminhada",
    resultado: "Veja o gasto de uma caminhada por tempo, distância ou passos, inclusive na esteira.",
    acao: "Calcular minha caminhada",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "passos",
    tags: ["caminhar", "esteira", "10 mil passos", "passos", "12-3-30", "inclinacao", "calorias caminhando", "andar"],
  },
  {
    id: "fc",
    href: "/ferramentas/zonas-de-frequencia-cardiaca",
    nome: "Calculadora de Zonas de Frequência Cardíaca",
    resultado: "Descubra em que batimento treinar em cada zona, pela sua idade.",
    acao: "Ver minhas zonas",
    tempo: "10 segundos",
    categoria: "cardio",
    icone: "coracao",
    tags: ["zona 2", "batimentos", "bpm", "frequencia cardiaca maxima", "karvonen", "fc maxima", "zona de queima", "intensidade"],
  },
  {
    id: "polichinelos",
    href: "/ferramentas/calculadora-polichinelos",
    nome: "Calculadora de Polichinelos",
    resultado: "Saiba quantas calorias os polichinelos gastam e quantos valem uma caminhada.",
    acao: "Calcular polichinelos",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "raio",
    tags: ["polichinelo", "jumping jack", "100 polichinelos", "desafio", "exercicio em casa"],
  },
  {
    id: "eliptico",
    href: "/ferramentas/calculadora-calorias-eliptico",
    nome: "Calculadora de Calorias do Elíptico",
    resultado: "Veja o gasto real do elíptico e se o visor do aparelho está certo.",
    acao: "Calcular no elíptico",
    tempo: "10 segundos",
    categoria: "cardio",
    icone: "eliptico",
    tags: ["eliptico", "transport", "visor", "aparelho", "academia", "cardio na academia"],
  },
  {
    id: "bicicleta",
    href: "/ferramentas/calculadora-calorias-bicicleta",
    nome: "Calculadora de Calorias na Bicicleta",
    resultado: "Veja o gasto do pedal pela velocidade e pelas paradas, e quanto ir de bike ao trabalho rende no mês.",
    acao: "Calcular meu pedal",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "bicicleta",
    tags: ["bicicleta", "bike", "pedalar", "pedal", "ciclismo", "ergometrica", "ir de bike para o trabalho", "mountain bike", "km/h", "watts"],
    selo: "novo",
  },
  {
    id: "atividades",
    href: "/ferramentas/calculadora-calorias-atividades",
    nome: "Calculadora de Calorias por Atividade",
    resultado: "Compare o gasto de 15 atividades no mesmo tempo, com o seu peso, e ache a calculadora de cada uma.",
    acao: "Comparar atividades",
    tempo: "10 segundos",
    categoria: "cardio",
    icone: "raio",
    tags: ["qual atividade queima mais", "comparar", "ranking", "atividade fisica", "esporte", "qual exercicio gasta mais calorias", "tabela de calorias"],
  },
  {
    id: "futebol",
    href: "/ferramentas/calculadora-calorias-futebol",
    nome: "Calculadora de Calorias no Futebol",
    resultado: "Descubra quanto a pelada gastou de verdade, descontando o tempo na lateral.",
    acao: "Calcular a pelada",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "bola",
    tags: ["futebol", "pelada", "futsal", "society", "jogo", "bola", "cerveja"],
  },
  {
    id: "boxe",
    href: "/ferramentas/calculadora-calorias-boxe",
    nome: "Calculadora de Calorias no Boxe",
    resultado: "Veja o gasto da aula de boxe e se as 1.000 kcal da propaganda existem.",
    acao: "Calcular no boxe",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "luva",
    tags: ["boxe", "muay thai", "luta", "saco de pancada", "sparring", "rounds", "arte marcial"],
  },
  {
    id: "zumba",
    href: "/ferramentas/calculadora-calorias-zumba",
    nome: "Calculadora de Calorias na Zumba",
    resultado: "Veja o gasto da aula e quantos quilos por mês as aulas da semana rendem.",
    acao: "Calcular na zumba",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "musica",
    tags: ["zumba", "aula de danca", "fitdance", "emagrece", "aula coletiva"],
  },
  {
    id: "spinning",
    href: "/ferramentas/calculadora-calorias-spinning",
    nome: "Calculadora de Calorias no Spinning",
    resultado: "Calcule o gasto da aula pelos watts da bike, ou pelo ritmo se ela não mostra.",
    acao: "Calcular no spinning",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "bicicleta",
    tags: ["spinning", "bike indoor", "watts", "aula de bike", "ciclismo indoor", "pedalar"],
  },
  {
    id: "danca",
    href: "/ferramentas/calculadora-calorias-danca",
    nome: "Calculadora de Calorias na Dança",
    resultado: "Compare o gasto do seu ritmo, de salão a funk, com o seu peso.",
    acao: "Calcular na dança",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "musica",
    tags: ["dancar", "forro", "samba", "ballet", "funk", "danca de salao", "ritmo", "dancar emagrece"],
  },
  {
    id: "natacao",
    href: "/ferramentas/calculadora-calorias-natacao",
    nome: "Calculadora de Calorias na Natação",
    resultado: "Veja o gasto de cada nado, descontando o tempo parado na borda.",
    acao: "Calcular na piscina",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "ondas",
    tags: ["nadar", "piscina", "crawl", "costas", "peito", "borboleta", "natacao emagrece", "hidroginastica"],
  },
  {
    id: "jiujitsu",
    href: "/ferramentas/calculadora-calorias-jiu-jitsu",
    nome: "Calculadora de Calorias no Jiu-Jitsu",
    resultado: "Descubra o gasto da aula separando técnica de rola.",
    acao: "Calcular no tatame",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "faixa",
    tags: ["jiu jitsu", "jiujitsu", "bjj", "rola", "tatame", "luta", "arte marcial", "kimono"],
  },
  {
    id: "corda",
    href: "/ferramentas/calculadora-calorias-pular-corda",
    nome: "Calculadora de Calorias Pulando Corda",
    resultado: "Veja o gasto só do tempo pulando, e quantos saltos foram.",
    acao: "Calcular na corda",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "corda",
    tags: ["pular corda", "corda", "saltos", "exercicio em casa", "pular corda emagrece"],
  },
  {
    id: "escada",
    href: "/ferramentas/calculadora-calorias-escada",
    nome: "Calculadora de Calorias Subindo Escada",
    resultado: "Saiba quanto custa cada andar e o que trocar o elevador rende no mês.",
    acao: "Calcular na escada",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "escada",
    tags: ["escada", "subir escada", "andares", "elevador", "degraus", "predio"],
  },
  {
    id: "crossfit",
    href: "/ferramentas/calculadora-calorias-crossfit",
    nome: "Calculadora de Calorias no CrossFit",
    resultado: "Some aquecimento, força e WOD e veja de onde saem as calorias do relógio.",
    acao: "Calcular no box",
    tempo: "20 segundos",
    categoria: "cardio",
    icone: "kettlebell",
    tags: ["crossfit", "wod", "box", "emom", "amrap", "tabata", "cross", "treino funcional"],
  },
  {
    id: "hyrox",
    href: "/ferramentas/calculadora-calorias-hyrox",
    nome: "Calculadora de Calorias no Hyrox",
    resultado: "Separe os 8 km de corrida das oito estações e veja o gasto de cada parte.",
    acao: "Calcular minha prova",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "bandeira",
    tags: ["hyrox", "prova", "estacoes", "skierg", "remo", "sled", "simulado", "fitness race"],
  },

  /* ── Alphaville ───────────────────────────────────────────────────── */
  {
    id: "academia",
    href: "/academia-ideal-alphaville",
    nome: "Qual Academia de Alphaville Combina com Você",
    resultado: "Compare as academias de Alphaville pelo que importa na sua rotina.",
    acao: "Comparar academias",
    tempo: "8 perguntas · 1 minuto",
    categoria: "alphaville",
    icone: "pino",
    tags: ["academia", "alphaville", "barueri", "tambore", "onde treinar", "melhor academia", "smart fit", "bodytech", "perto de mim", "estacionamento"],
  },

  /* ── Apoio: não entra em categoria; é o fallback da página ─────────── */
  {
    id: "pergunte",
    href: "/pergunte-ao-montinho",
    nome: "Pergunte ao Montinho",
    resultado: "Faça uma pergunta de treino ou alimentação e receba a resposta com as fontes.",
    acao: "Fazer minha pergunta",
    tempo: "resposta na hora",
    categoria: "apoio",
    icone: "chat",
    tags: ["duvida", "pergunta", "tirar duvida", "posso treinar com dor", "quanto descansar", "ia", "chat", "assistente"],
  },
];

/** As ferramentas no ar, na ordem do catálogo. */
export const FERRAMENTAS_NO_AR = CATALOGO.filter((f) => f.noAr !== false);

export const porId = (id: string) => FERRAMENTAS_NO_AR.find((f) => f.id === id) ?? null;

export const daCategoria = (c: CategoriaId) => FERRAMENTAS_NO_AR.filter((f) => f.categoria === c);

/**
 * As mais usadas.
 *
 * Não é chute: é o ranking de páginas vistas no GA4 nos 90 dias até
 * 23/09/2026 — cardápio, déficit, macros e TMB/TDEE na frente entre as
 * calculadoras; diagnóstico e tabela de alimentos entre as outras. Os
 * números ainda são pequenos, então a lista deve ser revista quando o
 * Search Console e o GA4 tiverem mais volume — e o evento
 * tool_card_click desta página passa a medir isso direto.
 */
export const MAIS_USADAS: string[] = ["deficit", "cardapio", "tdee", "diagnostico", "macros", "alimentos"];

/** Exemplos de busca, na linguagem de quem procura. */
export const EXEMPLOS_BUSCA = ["quanto de proteína?", "creatina", "calorias", "emagrecer", "1RM", "divisão de treino", "gasto na corrida"];

/** Acima disso, a categoria mostra as primeiras e esconde o resto atrás de "ver todas". */
export const MOSTRAR_POR_CATEGORIA = 8;
