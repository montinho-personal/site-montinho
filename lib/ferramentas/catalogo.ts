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
    id: "superavit",
    href: "/ferramentas/calculadora-superavit-calorico",
    nome: "Calculadora de Superávit Calórico",
    resultado: "Veja quantas calorias comer por dia para ganhar massa muscular sem exagerar na gordura.",
    acao: "Calcular meu superávit",
    tempo: "1 minuto",
    categoria: "alimentacao",
    icone: "balanca",
    tags: ["ganhar massa", "bulking", "lean bulk", "superavit", "quanto comer para ganhar massa", "calorias para ganhar peso", "hipertrofia", "engordar", "ganhar peso"],
    selo: "novo",
  },
  {
    id: "simulador-emagrecimento",
    href: "/ferramentas/simulador-emagrecimento",
    nome: "Simulador de Emagrecimento",
    resultado: "Veja como seu peso pode evoluir e compare cenários de treino, passos e consistência.",
    acao: "Simular meu emagrecimento",
    tempo: "1 minuto",
    categoria: "emagrecimento",
    icone: "balanca",
    tags: ["simulador", "quanto tempo para emagrecer", "perder 10 kg", "perder 5 kg", "projecao de peso", "quando vou chegar no meu peso", "emagrecer", "perder peso", "consistencia", "passos", "mounjaro"],
    selo: "novo",
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
    id: "mapa-muscular",
    href: "/exercicios",
    nome: "Mapa Muscular",
    resultado: "Toque no músculo que quer treinar e veja exercícios compatíveis com seus equipamentos.",
    acao: "Ver exercícios por músculo",
    tempo: "5 segundos",
    categoria: "treino",
    icone: "corpo",
    tags: ["exercicios por musculo", "mapa muscular", "qual exercicio trabalha", "exercicios para peito", "exercicios para gluteo", "exercicios em casa", "biblioteca de exercicios"],
    selo: "novo",
  },
  {
    id: "substituidor",
    href: "/ferramentas/substituidor-de-exercicios",
    nome: "Substituidor de Exercícios",
    resultado: "Escolha um exercício e veja alternativas por músculo, movimento e equipamento disponível.",
    acao: "Encontrar alternativa",
    tempo: "20 segundos",
    categoria: "treino",
    icone: "halter",
    tags: ["substituir exercicio", "alternativa de exercicio", "exercicio parecido", "sem maquina", "treino em casa", "no lugar", "trocar exercicio"],
    selo: "novo",
  },
  {
    id: "comparador",
    href: "/ferramentas/comparador-de-exercicios",
    nome: "Comparador de Exercícios",
    resultado: "Compare músculos, movimento, estabilidade, equipamento e contexto de dois exercícios.",
    acao: "Comparar exercícios",
    tempo: "15 segundos",
    categoria: "treino",
    icone: "halter",
    tags: ["comparar exercicios", "qual exercicio e melhor", "agachamento ou leg press", "supino reto ou inclinado", "barra fixa ou puxada", "stiff ou mesa flexora", "diferenca entre exercicios"],
    selo: "novo",
  },
  {
    id: "descanso",
    href: "/ferramentas/calculadora-descanso-entre-series",
    nome: "Calculadora de Descanso Entre Séries",
    resultado: "Informe exercício, objetivo e esforço e receba uma faixa prática de descanso, com cronômetro.",
    acao: "Calcular meu descanso",
    tempo: "10 segundos",
    categoria: "treino",
    icone: "calendario",
    tags: ["descanso", "descanso entre series", "intervalo", "hipertrofia", "forca", "cronometro", "rir", "timer", "tempo de descanso"],
    selo: "novo",
  },
  {
    id: "imc",
    href: "/ferramentas/calculadora-imc",
    nome: "Calculadora de IMC",
    resultado: "Calcule seu IMC pela tabela da OMS e veja por que ele engana quem treina.",
    acao: "Calcular meu IMC",
    tempo: "15 segundos",
    categoria: "emagrecimento",
    icone: "balanca",
    tags: ["imc", "indice de massa corporal", "calcular imc", "tabela imc", "peso ideal", "obesidade", "sobrepeso"],
    selo: "novo",
  },
  {
    id: "cafeina",
    href: "/ferramentas/calculadora-cafeina",
    nome: "Calculadora de Cafeína",
    resultado: "Some a cafeína do seu dia, veja a dose por kg para treinar e até que horas tomar café.",
    acao: "Calcular minha cafeína",
    tempo: "1 minuto",
    categoria: "suplementacao",
    icone: "capsula",
    tags: ["cafeina", "cafe", "pre-treino", "energetico", "quanto de cafeina por dia", "cafeina por kg", "sono"],
    selo: "novo",
  },
  {
    id: "cooper",
    href: "/ferramentas/teste-de-cooper",
    nome: "Calculadora do Teste de Cooper",
    resultado: "Corra 12 minutos e veja seu VO2 máx e sua classificação por idade.",
    acao: "Calcular meu VO2 máx",
    tempo: "30 segundos",
    categoria: "cardio",
    icone: "corrida",
    tags: ["teste de cooper", "vo2 max", "vo2 maximo", "12 minutos", "condicionamento", "corrida", "folego"],
    selo: "novo",
  },
  {
    id: "percentual-gordura",
    href: "/ferramentas/calculadora-percentual-de-gordura",
    nome: "Calculadora de Percentual de Gordura",
    resultado: "Estime seu percentual de gordura com fita métrica ou com as dobras do adipômetro.",
    acao: "Calcular meu percentual",
    tempo: "1 minuto",
    categoria: "emagrecimento",
    icone: "corpo",
    tags: ["percentual de gordura", "gordura corporal", "fita metrica", "marinha americana", "dobras cutaneas", "adipometro", "7 dobras", "3 dobras", "body fat"],
    selo: "novo",
  },
  {
    id: "passos",
    href: "/ferramentas/calculadora-passos",
    nome: "Calculadora de Passos",
    resultado: "Veja quantos passos por dia são a meta para a sua idade e quanto os seus dão em calorias, km e minutos.",
    acao: "Calcular meus passos",
    tempo: "30 segundos",
    categoria: "emagrecimento",
    icone: "passos",
    tags: ["passos", "10 mil passos", "quantos passos por dia", "passos calorias", "pedometro", "caminhar", "sedentarismo", "passos em km"],
    selo: "novo",
  },
  {
    id: "cintura-altura",
    href: "/ferramentas/relacao-cintura-altura",
    nome: "Calculadora de Relação Cintura-Altura",
    resultado: "Veja se a sua cintura mede menos da metade da sua altura e em que faixa você está.",
    acao: "Calcular minha relação",
    tempo: "15 segundos",
    categoria: "emagrecimento",
    icone: "medida",
    tags: ["cintura", "relacao cintura altura", "rce", "rca", "cintura estatura", "gordura abdominal", "barriga", "medida da cintura"],
    selo: "novo",
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
    id: "beliscometro",
    href: "/ferramentas/beliscometro",
    nome: "Beliscômetro",
    resultado: "Descubra quanto seus beliscos somam no dia e o que a balança não conta depois do fim de semana.",
    acao: "Descobrir meus beliscos",
    tempo: "2 minutos",
    categoria: "alimentacao",
    icone: "pizza",
    tags: ["beliscar", "beliscar engorda", "calorias dos beliscos", "calorias escondidas", "como parar de beliscar", "engordei no fim de semana", "balança subiu", "petiscos calorias", "comer toda hora"],
    selo: "novo",
  },
  {
    id: "mata-a-vontade",
    href: "/ferramentas/mata-a-vontade",
    nome: "Montinho Mata a Vontade",
    resultado: "Diga o doce que você quer e receba a receita que mais combina com a sua vontade.",
    acao: "Matar a vontade",
    tempo: "20 segundos",
    categoria: "alimentacao",
    icone: "talheres",
    tags: ["vontade de doce", "doce fit", "sobremesa proteica", "bolo de caneca", "brownie proteico", "brigadeiro fit", "sorvete proteico", "receita com whey", "dieta"],
    selo: "novo",
  },
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
    id: "simulador-massa",
    href: "/ferramentas/simulador-ganho-massa-muscular",
    nome: "Simulador de Ganho de Massa Muscular",
    resultado: "Veja quanto tempo pode levar para ganhar peso, compare ritmos e descubra o que está limitando.",
    acao: "Simular meu ganho",
    tempo: "1 minuto",
    categoria: "treino",
    icone: "corpo",
    tags: ["simulador", "ganhar massa", "ganhar peso", "sou magro", "nao consigo engordar", "quanto tempo para ganhar massa", "bulking", "superavit", "hipertrofia", "hardgainer", "ectomorfo"],
    selo: "novo",
  },
  {
    id: "shape12",
    href: "/ferramentas/meu-shape-12-semanas",
    nome: "Meu Shape em 12 Semanas",
    resultado: "Veja o que dá para construir em 3 meses: checkpoints, treinos acumulados e o que mais muda.",
    acao: "Simular minhas 12 semanas",
    tempo: "2 minutos",
    categoria: "treino",
    icone: "corpo",
    tags: ["12 semanas", "3 meses", "90 dias", "shape", "transformacao", "resultado academia", "antes e depois", "recomposicao", "definir", "secar"],
    selo: "novo",
  },
  {
    id: "fim-de-semana",
    href: "/ferramentas/simulador-fim-de-semana",
    nome: "Simulador do Fim de Semana",
    resultado: "Veja quanto do déficit da semana sábado e domingo consomem — e o que mudaria com uma coisa só.",
    acao: "Simular meu fim de semana",
    tempo: "1 minuto",
    categoria: "emagrecimento",
    icone: "corpo",
    tags: ["simulador", "fim de semana", "estraga a dieta", "sabado e domingo", "refeicao livre", "dia do lixo", "cheat meal", "cerveja", "alcool", "deficit semanal", "engordei no fim de semana"],
    selo: "novo",
  },
  {
    id: "classic-physique",
    href: "/ferramentas/calculadora-peso-classic-physique",
    nome: "Calculadora de Peso da Classic Physique",
    resultado: "Digite sua altura e veja o peso máximo permitido na Classic Physique profissional da IFBB Pro League.",
    acao: "Calcular meu limite",
    tempo: "10 segundos",
    categoria: "treino",
    icone: "corpo",
    tags: ["classic physique", "peso maximo", "limite de peso", "tabela peso altura", "ifbb pro", "mr olympia", "ramon dino", "fisiculturismo", "bodybuilding"],
    selo: "novo",
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
    id: "quanto-tempo-shape",
    href: "/ferramentas/quanto-tempo-para-ter-shape",
    nome: "Quanto Tempo para Ter Shape?",
    resultado: "Veja seu estágio hoje e a curva provável dos próximos anos, em três cenários.",
    acao: "Simular minha jornada",
    tempo: "1 minuto",
    categoria: "treino",
    icone: "calendario",
    tags: ["quanto tempo", "shape", "ficar musculoso", "anos de treino", "evolucao", "ffmi", "olympia", "ganhar massa", "hipertrofia"],
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
    id: "musculacao",
    href: "/ferramentas/calculadora-calorias-musculacao",
    nome: "Calculadora de Calorias da Musculação",
    resultado: "Veja quanto o seu treino de musculação gasta pelo peso, tempo e tipo de treino, e compare com o cardio.",
    acao: "Calcular meu treino",
    tempo: "10 segundos",
    categoria: "cardio",
    icone: "halter",
    tags: ["musculacao", "academia", "treino de forca", "quantas calorias", "1 hora de musculacao", "gasto calorico musculacao", "musculacao ou cardio", "levantar peso"],
    selo: "novo",
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
    id: "sao-silvestre",
    href: "/ferramentas/previsor-sao-silvestre",
    nome: "Previsor da São Silvestre",
    resultado: "Veja o seu tempo provável nos 15 km da São Silvestre a partir do seu 5 km, 10 km ou meia.",
    acao: "Prever meu tempo",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "corrida",
    tags: ["sao silvestre", "são silvestre", "15 km", "corrida de rua", "tempo de prova", "pace", "previsao", "riegel", "31 de dezembro"],
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
    tags: ["boxe", "luta", "saco de pancada", "sparring", "rounds", "arte marcial"],
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
    id: "muaythai",
    href: "/ferramentas/calculadora-calorias-muay-thai",
    nome: "Calculadora de Calorias no Muay Thai",
    resultado: "Descubra o gasto da aula separando técnica de rounds fortes.",
    acao: "Calcular no muay thai",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "faixa",
    tags: ["muay thai", "muaythai", "boxe tailandes", "kickboxing", "manopla", "rounds", "luta", "arte marcial"],
  },
  {
    id: "artesmarciais",
    href: "/ferramentas/calculadora-calorias-artes-marciais",
    nome: "Calculadora de Calorias nas Artes Marciais",
    resultado: "Compare a mesma aula em judô, caratê, taekwondo, MMA e outras lutas.",
    acao: "Calcular na minha luta",
    tempo: "15 segundos",
    categoria: "cardio",
    icone: "faixa",
    tags: ["artes marciais", "arte marcial", "luta", "judo", "karate", "carate", "taekwondo", "kickboxing", "mma", "jiu jitsu", "muay thai", "boxe", "randori", "kumite", "sparring"],
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
