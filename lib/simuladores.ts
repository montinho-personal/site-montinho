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
  id: "emagrecimento" | "massa";
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
];

/** O que vem depois. Sem link: intenção declarada, não página vazia. */
export const PROXIMOS_SIMULADORES = [
  { nome: "Simulador do Fim de Semana", pergunta: "Quanto o sábado e o domingo desfazem da minha semana?" },
  { nome: "Simulador de Frequência", pergunta: "Treinar 2, 3 ou 4 vezes — o que muda no meu caso?" },
  { nome: "Simulador de Consistência", pergunta: "Quanto um mês fora da rotina custa de verdade?" },
];

export const outrosSimuladores = (id: Simulador["id"]) => SIMULADORES.filter((s) => s.id !== id);
