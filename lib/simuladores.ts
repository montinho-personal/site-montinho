/**
 * Os Simuladores Montinho — o registro da família.
 *
 * POR QUE UMA PÁGINA PRÓPRIA, E NÃO SÓ MAIS DOIS CARDS NA CENTRAL
 *
 * Calculadora responde "quanto?". Simulador responde "se eu continuar
 * assim, o que tende a acontecer — e o que mais mudaria?". É outra
 * promessa, com outro tempo de uso (1 minuto de perguntas, depois mexer
 * nos cenários), e merecia uma porta que explicasse a diferença em vez de
 * se perder entre 35 calculadoras. A /ferramentas aponta para cá numa
 * faixa de destaque; cada simulador aponta para os irmãos.
 *
 * Simulador novo é uma entrada aqui. Os "próximos" aparecem na página sem
 * link — são intenção declarada, não página vazia.
 */

export interface Simulador {
  id: "emagrecimento" | "massa" | "shape12" | "fim-de-semana";
  href: string;
  nome: string;
  /** A pergunta de quem chega — é o que a pessoa escolhe. */
  pergunta: string;
  /** Para quem é, em uma linha. */
  paraQuem: string;
  /** O que sai do outro lado. */
  entrega: string[];
  tempo: string;
  acao: string;
}

export const SIMULADORES: Simulador[] = [
  {
    id: "emagrecimento",
    href: "/ferramentas/simulador-emagrecimento",
    nome: "Simulador de Emagrecimento",
    pergunta: "Quero emagrecer",
    paraQuem: "Para quem quer saber quanto tempo pode levar até a meta — e o que mais mudaria o caminho.",
    entrega: [
      "Sua trajetória de peso semana a semana, com faixa provável",
      "Treino, passos, consistência e alimentação em cenários lado a lado",
      "O que esperar em cada etapa: saúde, roupa, rosto, sono",
      "O ajuste que mais mexe na sua projeção",
    ],
    tempo: "1 minuto",
    acao: "Simular meu emagrecimento",
  },
  {
    id: "massa",
    href: "/ferramentas/simulador-ganho-massa-muscular",
    nome: "Simulador de Ganho de Massa Muscular",
    pergunta: "Quero ganhar massa",
    paraQuem: "Para quem é magro, não consegue engordar ou quer saber quanto tempo até o peso que quer.",
    entrega: [
      "Sua trajetória de peso em três ritmos de ganho",
      "Por que o ritmo mais rápido não constrói mais músculo",
      "O que está limitando seu ganho, pelas suas respostas",
      "O que eu olharia primeiro no seu caso",
    ],
    tempo: "1 minuto",
    acao: "Simular meu ganho",
  },
  {
    id: "shape12",
    href: "/ferramentas/meu-shape-12-semanas",
    nome: "Meu Shape em 12 Semanas",
    pergunta: "Tenho 12 semanas",
    paraQuem: "Para quem quer saber o que dá para construir em 3 meses — emagrecendo, ganhando massa ou mudando o shape.",
    entrega: [
      "Seu ponto de partida e os checkpoints das semanas 4, 8 e 12, com datas",
      "Os treinos que você acumularia — e quantos a mais com consistência",
      "O que mais muda as suas 12 semanas, pelo modelo",
      "O que medir em cada checkpoint, além da balança",
    ],
    tempo: "2 minutos",
    acao: "Simular minhas 12 semanas",
  },
  {
    id: "fim-de-semana",
    href: "/ferramentas/simulador-fim-de-semana",
    nome: "Simulador do Fim de Semana",
    pergunta: "Meu fim de semana anula minha dieta",
    paraQuem: "Para quem faz tudo certo de segunda a sexta e quer saber o que sábado e domingo fazem com a semana.",
    entrega: [
      "O saldo dos seus sete dias: quanto a semana construiu e quanto sobrou",
      "Onde o fim de semana pesou: sexta, sábado, domingo, bebidas ou movimento",
      "A menor mudança com o maior impacto no seu cenário",
      "Por que a balança de segunda engana",
    ],
    tempo: "1 minuto",
    acao: "Simular meu fim de semana",
  },
];

/** O que vem depois. Sem link: intenção declarada, não página vazia. */
export const PROXIMOS_SIMULADORES = [
  { nome: "Simulador de Frequência", pergunta: "Treinar 2, 3 ou 4 vezes — o que muda no meu caso?" },
  { nome: "Simulador de Consistência", pergunta: "Quanto um mês fora da rotina custa de verdade?" },
];

export const outrosSimuladores = (id: Simulador["id"]) => SIMULADORES.filter((s) => s.id !== id);
