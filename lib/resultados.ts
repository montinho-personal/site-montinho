/**
 * Resultados dos alunos: a fonte única da página /resultados e da vitrine
 * de transformações (components/resultados/VitrineResultados.tsx).
 *
 * Os textos, idades, prazos e resultados vieram da página /resultados como
 * estavam; nada foi reescrito. Itens sem `photo` não aparecem em lugar
 * nenhum (a página já os filtrava).
 *
 * VITRINE (`vitrine`)
 * As fotos de antes e depois do site são uma montagem só, lado a lado. Para
 * o comparador, cada montagem foi cortada ao meio (só corte, sem retoque,
 * sem mudar cor ou proporção) em public/transformacoes/<slug>-antes.webp e
 * -depois.webp, com a mesma largura e altura. Só entra na vitrine quem tem
 * `vitrine`: ao cadastrar alguém novo, gere os dois arquivos do mesmo jeito
 * e confirme com o Montinho a autorização de uso das fotos.
 */

export interface FotosVitrine {
  antes: string;
  depois: string;
  /** Largura e altura de CADA metade, em px (as duas são iguais). */
  largura: number;
  altura: number;
}

export interface ResultadoItem {
  /** Identificador estável, para escolher quem aparece na vitrine. */
  slug?: string;
  name: string;
  age: string;
  duration: string;
  result: string;
  modality: string;
  photo?: string;
  objectPosition?: string;
  photoAspect?: string;
  description: string;
  quote: string;
  /** Fotos separadas para o comparador. Ausente = fora da vitrine. */
  vitrine?: FotosVitrine;
}

export const RESULTADOS: ResultadoItem[] = [
  {
    slug: "adriana-nascimento",
    name: "Adriana Nascimento",
    age: "43 anos",
    duration: "8 meses",
    result: "−20kg",
    modality: "Modelo Híbrido",
    photo: "/antes-depois-montinho-personal-trainer-2.jpg",
    description:
      "Adriana treinava há anos e já havia tentado diferentes esportes e métodos de treinamento, mas sem uma estratégia bem definida. Com um planejamento estruturado e treino periodizado, em poucos meses conquistou uma transformação que ela mesma não acreditava ser possível.",
    quote:
      "Finalmente entendi o que estava fazendo errado. Em 8 meses aprendi mais sobre meu corpo e minha mente do que em anos de academia.",
    vitrine: { antes: "/transformacoes/adriana-nascimento-antes.webp", depois: "/transformacoes/adriana-nascimento-depois.webp", largura: 630, altura: 1280 },
  },
  {
    name: "Montinho",
    age: "37 anos",
    duration: "Uma vida toda dedicada",
    result: "−40kg",
    modality: "Transformação Pessoal",
    photo: "/antes-depois-montinho-personal-trainer.jpg",
    description:
      "Durante anos, eu tentei de tudo para transformar meu corpo. Vivi o efeito sanfona, cometi erros, segui métodos que prometiam resultados rápidos e me frustrei inúmeras vezes. Quando finalmente encontrei um caminho baseado em ciência, estratégia e constância, minha vida mudou. Hoje, esse é o mesmo método que utilizo para ajudar meus alunos a conquistarem resultados reais.",
    quote:
      "Se eu consegui transformar minha própria história, acredito que posso ajudar você a transformar a sua também.",
  },
  {
    slug: "natalia-nascimento",
    name: "Natália Nascimento",
    age: "40 anos",
    duration: "9 meses",
    result: "−13kg",
    modality: "Personal Presencial · Alphaville",
    photo: "/antes-depois-natalia-montinho-personal.webp",
    description:
      "Natália já treinava há anos e sabia exatamente como executar os exercícios. Já havia conquistado um ótimo físico, mas vivia presa ao efeito sanfona. O que faltava não era esforço, e sim um planejamento estruturado, uma estratégia de treino e o suporte necessário para confiar no processo. Com consistência e acompanhamento, voltou a evoluir e conquistou uma transformação duradoura.",
    quote:
      "Percebi que não precisava treinar mais, e sim treinar com estratégia. Aprendi a confiar no processo e os resultados apareceram novamente.",
    vitrine: { antes: "/transformacoes/natalia-nascimento-antes.webp", depois: "/transformacoes/natalia-nascimento-depois.webp", largura: 690, altura: 1400 },
  },
  {
    slug: "elisa-cruz",
    name: "Elisa Cruz",
    age: "34 anos",
    duration: "9 meses",
    result: "−20kg",
    modality: "Modelo Híbrido",
    photo: "/antes-depois-montinho-personal-trainer-4.jpg",
    description:
      "Elisa já tinha decidido que era hora de mudar. O meu papel foi transformar essa decisão em um plano claro, adaptado à sua rotina e aos seus objetivos. Com um treino estratégico, acompanhamento próximo e confiança no processo, ela conquistou uma transformação consistente sem precisar viver em função da academia.",
    quote:
      "Ter um planejamento feito para a minha realidade fez toda a diferença. Pela primeira vez, consegui manter a consistência e ver resultados de verdade.",
    vitrine: { antes: "/transformacoes/elisa-cruz-antes.webp", depois: "/transformacoes/elisa-cruz-depois.webp", largura: 720, altura: 1462 },
  },
  {
    slug: "bruna-rodrigues",
    name: "Bruna Rodrigues",
    age: "35 anos",
    duration: "",
    result: "−22kg",
    modality: "Modelo Híbrido",
    photo: "/antes-depois-montinho-personal-trainer-alphaville-sp.jpg",
    objectPosition: "center",
    description:
      "Durante anos, Bruna viveu entre o entusiasmo de começar e a frustração de recomeçar. O efeito sanfona parecia não ter fim. Quando me procurou, construímos um plano pensado para a vida que ela realmente levava. Aos poucos, a constância substituiu a culpa, e o resultado deixou de ser temporário para se tornar um novo estilo de vida.",
    quote:
      "Ter um treino personalizado já fez toda a diferença, mas o maior diferencial foi o suporte. Saber que meu treinador já viveu essa mesma luta me deu confiança para não desistir. Hoje tenho resultados que nunca consegui manter antes.",
    vitrine: { antes: "/transformacoes/bruna-rodrigues-antes.webp", depois: "/transformacoes/bruna-rodrigues-depois.webp", largura: 720, altura: 1340 },
  },
  {
    name: "Fernanda S.",
    age: "29 anos",
    duration: "4 meses",
    result: "−15kg e recuperação pós-parto",
    modality: "Personal Presencial · Alphaville",
    description:
      "Mãe de dois filhos, Fernanda precisava de um treino que respeitasse seu corpo pós-gestação e sua rotina intensa. O resultado superou todas as expectativas.",
    quote:
      "O Montinho entendeu que eu precisava de mais do que um treino. Precisava de apoio. E ele me deu os dois.",
  },
  {
    name: "Ricardo A.",
    age: "41 anos",
    duration: "8 meses",
    result: "+8kg de massa magra",
    modality: "Modelo Híbrido",
    description:
      "Ricardo treinava há anos mas não via progresso. Lesões recorrentes e treinos sem periodização foram corrigidos com método e paciência.",
    quote:
      "Finalmente entendi o que estava fazendo errado. Em 8 meses aprendi mais sobre meu corpo do que em anos de academia.",
  },
  {
    name: "Patrícia N.",
    age: "45 anos",
    duration: "5 meses",
    result: "−18kg e reversão de quadro pré-diabético",
    modality: "Consultoria Online",
    description:
      "Patricia tinha indicação médica para perder peso. Com treino e acompanhamento, reverteu um quadro pré-diabético e recuperou a energia.",
    quote:
      "Meu médico ficou impressionado nos exames. Mas quem eu tenho que agradecer é o Montinho.",
  },
  {
    name: "Bruno T.",
    age: "26 anos",
    duration: "4 meses",
    result: "Corpo definido para o verão",
    modality: "Personal Presencial · Alphaville",
    description:
      "Bruno queria chegar ao verão com o corpo definido. Com protocolo específico de hipertrofia e perda de gordura, chegou no resultado antes do prazo.",
    quote:
      "Pensei que seria difícil demais. Mas quando o plano faz sentido e o acompanhamento é bom, você segue sem dificuldade.",
  },
  {
    name: "Luciana M.",
    age: "38 anos",
    duration: "7 meses",
    result: "−20kg e eliminação de dores lombares crônicas",
    modality: "Modelo Híbrido",
    description:
      "Luciana sofria de dores lombares há anos. O trabalho combinado de fortalecimento e mobilidade não apenas eliminou as dores como ajudou a emagrecer 20kg.",
    quote:
      "Curei minha coluna e transformei meu corpo ao mesmo tempo. Não esperava esse resultado duplo.",
  },
];
