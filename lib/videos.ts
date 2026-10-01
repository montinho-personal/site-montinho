/**
 * Vídeos do canal do Montinho: o registro que alimenta as páginas
 * /videos/<slug> e o dado estruturado (VideoObject).
 *
 * SÓ VÍDEO DO PRÓPRIO MONTINHO
 *
 * Marcar como "nosso" o vídeo de outro canal seria mentir sobre a autoria.
 * Vídeo de terceiros pode continuar embutido num artigo, mas não entra aqui.
 *
 * UMA PÁGINA POR TEMA
 *
 * Quando dois vídeos falam da mesma coisa (dois sobre a balança, dois sobre
 * "melhor exercício"), só um ganha página. Duas páginas para a mesma busca
 * competem entre si e nenhuma ranqueia.
 *
 * A DATA DE PUBLICAÇÃO
 *
 * O Google exige nome, miniatura e data no VideoObject. A data só existe no
 * YouTube, e inventá-la seria dado estruturado falso. Então `publicadoEm`
 * fica vazio até ser conferido no YouTube Studio: a página existe e o vídeo
 * aparece normalmente, só sem a marcação.
 */

export interface VideoCanal {
  /** O id de 11 caracteres da URL do YouTube. */
  id: string;
  /** Endereço da página em /videos/<slug>. */
  slug: string;
  titulo: string;
  /** Título da aba e do Google (até ~60 caracteres). */
  metaTitle: string;
  descricao: string;
  /** Chamada curta do cartão na lista /videos: o motivo para dar o play. */
  chamada: string;
  /** Texto da página, em parágrafos, a partir da descrição do Montinho. */
  texto: string[];
  artigos: { href: string; nome: string }[];
  ferramenta?: { href: string; nome: string };
  /** Data de publicação no YouTube, AAAA-MM-DD. Conferida, nunca estimada. */
  publicadoEm?: string;
}

export const VIDEOS_CANAL: VideoCanal[] = [
  {
    id: "ul6Xi60zPeY",
    slug: "melhor-treino-para-quem-usa-mounjaro",
    titulo: "Usa Mounjaro e o peso está caindo? O melhor treino para não perder músculo",
    metaTitle: "Melhor Treino Para Quem Usa Mounjaro (Vídeo)",
    descricao:
      "O Mounjaro tira o apetite e cria um déficit forte. Sem o estímulo certo, o corpo perde gordura e músculo junto. Treino de força três vezes por semana, 10 a 16 séries por músculo e caminhada no lugar do HIIT pesado.",
    chamada: "Está usando Mounjaro e o peso está caindo? Em menos de 1 minuto: o treino para o músculo não ir embora junto com a gordura.",
    texto: [
      "Você está usando Mounjaro e o peso está caindo. Mas o que você está perdendo? O remédio tira o apetite e cria um déficit forte, e sem o estímulo certo o corpo queima gordura e músculo junto. Caminhada sozinha não segura músculo.",
      "O melhor treino para quem usa Mounjaro é o treino de força: três vezes por semana já faz o músculo entender que ele tem que ficar. Com menos comida você recupera menos, então nada de treino gigante: 10 a 16 séries por músculo na semana já resolve. Treine pesado de verdade, chegando na falha ou perto dela.",
      "Cardio? Caminhada de 30 a 45 minutos; HIIT pesado, não. Se bater enjoo, treine 2 a 3 horas depois de comer e pegue mais leve naquele dia. E não se compare com ninguém: o que funciona é um treino que você consegue manter. Uso de medicamento, sempre com acompanhamento médico.",
    ],
    artigos: [
      { href: "/blog/melhor-treino-para-quem-usa-mounjaro", nome: "Melhor treino para quem usa Mounjaro" },
      { href: "/blog/mounjaro-faz-perder-musculos", nome: "Mounjaro faz perder músculos?" },
      { href: "/blog/musculacao-durante-uso-de-mounjaro", nome: "Musculação durante o uso de Mounjaro" },
    ],
  },
  {
    id: "9X968Kqa2-Y",
    slug: "a-balanca-mente",
    titulo: "A balança mente? Por que o peso sobe mesmo emagrecendo",
    metaTitle: "A Balança Mente? Por Que o Peso Sobe Mesmo Emagrecendo",
    descricao:
      "O peso muda todo dia: sal, sono ruim e treino pesado fazem o corpo segurar água. Com musculação você perde gordura e ganha músculo ao mesmo tempo. O que medir de verdade: cintura toda semana, foto a cada 15 dias e a roupa.",
    chamada: "Fez tudo certo e o peso subiu? Em 41 segundos você entende por que isso não é gordura e o que medir no lugar da balança.",
    texto: [
      "Você pode estar emagrecendo e a balança não mostrar. O peso muda todo dia: sal, sono ruim e treino pesado fazem o corpo segurar água e o número subir. Não é gordura, é água.",
      "E com musculação você perde gordura e ganha músculo ao mesmo tempo. A balança para, mas o corpo continua mudando.",
      "O que medir de verdade: a cintura, toda semana; uma foto, a cada 15 dias; e a roupa, que folga antes do número cair. A balança é só um dado. O seu placar é a constância.",
    ],
    artigos: [
      { href: "/blog/balanca-nao-muda-mas-o-corpo-muda", nome: "A balança não muda, mas o corpo muda" },
      { href: "/blog/retencao-de-liquido-como-desinchar", nome: "Retenção de líquido: como desinchar" },
      { href: "/blog/como-tirar-medidas-corporais", nome: "Como tirar medidas corporais" },
    ],
    ferramenta: { href: "/ferramentas/simulador-emagrecimento", nome: "Simulador de emagrecimento" },
    publicadoEm: "2026-09-30",
  },
  {
    id: "nEhysMtPPVw",
    slug: "engordei-2-kg-no-feriado",
    titulo: "Você não engordou 2 kg no feriado",
    metaTitle: "Engordei 2 kg no Feriado? Por Que Não É Gordura",
    descricao:
      "Voltou do feriado com 2 kg a mais na balança? Boa parte é água, glicogênio e comida no intestino, não gordura. Volte à rotina e dê alguns dias para o peso estabilizar.",
    chamada: "Voltou do feriado com 2 kg a mais? Antes de cortar comida ou se matar no cardio, assista isto.",
    texto: [
      "Você voltou do feriado, subiu na balança e apareceu 2 kg a mais? Calma: isso não significa necessariamente que você engordou 2 kg de gordura.",
      "Depois de alguns dias com mais comida, carboidrato, sal, bebida alcoólica e uma rotina diferente, o peso pode aumentar por retenção de líquido, maior armazenamento de glicogênio e até pelo próprio volume de comida no sistema digestivo. Para ganhar 2 kg de gordura em poucos dias, seria necessário um excedente calórico muito maior do que muita gente imagina.",
      "O maior erro depois do feriado é entrar em pânico, cortar comida demais ou tentar compensar tudo com horas de cardio. Volte para a sua alimentação normal, retome os treinos, mantenha a hidratação e dê alguns dias para o peso estabilizar.",
      "A balança mostra o seu peso. Ela não mostra, sozinha, quanto você ganhou de gordura. Acompanhe o processo por semanas, não pelo peso de uma única manhã.",
    ],
    artigos: [
      { href: "/blog/fim-de-semana-estraga-a-dieta", nome: "O fim de semana estraga a dieta?" },
      { href: "/blog/retencao-de-liquido-como-desinchar", nome: "Retenção de líquido: como desinchar" },
      { href: "/blog/balanca-nao-muda-mas-o-corpo-muda", nome: "A balança não muda, mas o corpo muda" },
    ],
    publicadoEm: "2026-09-07",
  },
  {
    id: "nrT-Fan_Nbg",
    slug: "efeito-sanfona",
    titulo: "Efeito sanfona: por que você volta a engordar",
    metaTitle: "Efeito Sanfona: Por Que Você Volta a Engordar",
    descricao:
      "Você não voltou a engordar por falta de força de vontade. Muitas vezes ensinaram você a perder peso, mas ninguém ensinou a manter o resultado.",
    chamada: "Emagreceu e engordou tudo de novo? O problema não é força de vontade. Veja o que ninguém te ensinou sobre manter.",
    texto: [
      "Você não voltou a engordar porque é fraco ou porque não tem força de vontade. Muitas vezes, o efeito sanfona acontece porque ensinaram você a perder peso, mas ninguém ensinou como manter o resultado depois do emagrecimento.",
      "Dietas extremamente restritivas, fome, abandono completo dos alimentos que você gosta e uma rotina de treinos impossível de sustentar podem até gerar resultados rápidos. O problema é que, quando essa fase termina, os hábitos antigos costumam voltar.",
      "Neste vídeo, o Montinho explica por que preservar a massa muscular, construir hábitos que cabem na sua vida e planejar a fase de manutenção reduzem as chances de recuperar o peso perdido. Ele também já viveu o efeito sanfona.",
      "O objetivo não deve ser só encontrar uma maneira rápida de emagrecer. Deve ser construir uma maneira possível de viver.",
    ],
    artigos: [{ href: "/blog/como-evitar-efeito-sanfona", nome: "Como evitar o efeito sanfona" }],
    ferramenta: { href: "/ferramentas/calculadora-de-proteina", nome: "Calculadora de proteína" },
    publicadoEm: "2026-08-02",
  },
  {
    id: "DiH1OzIR6Yk",
    slug: "proteja-seu-objetivo",
    titulo: "Proteja o seu objetivo: a brecha que te faz recomeçar",
    metaTitle: "Proteja o Seu Objetivo: a Brecha Que Te Faz Recomeçar",
    descricao:
      "Quem chegou lá protege o objetivo. Uma exceção vira duas, duas viram hábito, e você volta ao ponto de onde queria sair.",
    chamada: "\"É só hoje\", \"segunda eu volto\"... Descubra a brecha que faz você recomeçar do zero toda vez.",
    texto: [
      "Quando o assunto é melhorar o shape, existe uma verdade que muita gente não quer aceitar: quem faz o trabalho não tem como dar errado.",
      "Por experiência própria, e observando centenas de pessoas que chegaram lá, todas têm uma coisa em comum: elas protegem o objetivo delas. Não significa nunca sair, nunca comer algo diferente ou viver preso. Significa não abrir brechas o tempo todo.",
      "Porque uma exceção vira duas. Duas viram um hábito. E, quando você percebe, está de volta ao ponto de onde tanto queria sair. Foi o que aconteceu com o Montinho por muito tempo: \"é só hoje\", \"segunda eu volto\", \"essa semana foi puxada\".",
      "O shape não é construído pelos dias em que você está animado. É construído principalmente nos dias em que seria muito mais fácil desistir.",
    ],
    artigos: [
      { href: "/blog/fim-de-semana-estraga-a-dieta", nome: "O fim de semana estraga a dieta?" },
      { href: "/blog/como-nao-desistir-da-dieta", nome: "Como não desistir da dieta" },
    ],
  },
  {
    id: "GPuqJs_DRoY",
    slug: "sensacao-de-dever-feito",
    titulo: "O poder da disciplina: a sensação de dever feito",
    metaTitle: "O Poder da Disciplina: a Sensação de Dever Feito",
    descricao:
      "Esse é o poder da disciplina: a sensação de dever feito e a confiança de ter feito tudo o que só você poderia fazer.",
    chamada: "22 segundos sobre a sensação que nenhum atalho te dá: a de ter feito a sua parte.",
    texto: [
      "Esse é o poder da disciplina: aquela sensação de dever feito.",
      "É uma sensação de confiança, porque você fez tudo aquilo que só você poderia ter feito. Ninguém treina por você, ninguém come por você.",
    ],
    artigos: [
      { href: "/blog/como-continuar-emagrecendo-sem-perder-motivacao", nome: "Como continuar emagrecendo sem perder a motivação" },
    ],
    publicadoEm: "2026-07-17",
  },
  {
    id: "yndKE1GrnUQ",
    slug: "toda-transformacao-comeca-com-uma-decisao",
    titulo: "Toda transformação começa com uma decisão",
    metaTitle: "Toda Transformação Começa Com Uma Decisão",
    descricao:
      "Quem conseguiu emagrecer ou ganhar massa aprendeu a dizer não para o que afastava do objetivo. Não existe fórmula mágica: existe disciplina e constância.",
    chamada: "Não teve pílula mágica. Veja a decisão que toda pessoa que mudou o corpo precisou tomar.",
    texto: [
      "Toda transformação começa com uma decisão.",
      "Quem conseguiu emagrecer, ganhar massa muscular ou mudar de vida aprendeu a dizer não para aquilo que afastava do objetivo.",
      "Não existe fórmula mágica. Existe disciplina, constância e a capacidade de escolher o que realmente importa todos os dias. E você: quantos \"nãos\" já disse hoje para ficar mais perto do seu objetivo?",
    ],
    artigos: [{ href: "/blog/como-nao-desistir-da-dieta", nome: "Como não desistir da dieta" }],
  },
  {
    id: "RvapDDClRXY",
    slug: "melhor-exercicio-e-o-que-voce-mantem",
    titulo: "Qual o melhor exercício para ganhar músculo? A pergunta está errada",
    metaTitle: "Melhor Exercício Para Ganhar Músculo? A Pergunta Está Errada",
    descricao:
      "O melhor exercício no estudo não é necessariamente o melhor para você. Execução, objetivo, volume e segurança importam, mas aderência é o que mais importa.",
    chamada: "Procurando o melhor exercício para ganhar músculo? A resposta vai mudar a forma como você monta o seu treino.",
    texto: [
      "Qual o melhor exercício para ganhar músculo? Talvez essa seja uma das perguntas mais erradas da musculação. O melhor exercício no estudo não necessariamente é o melhor exercício para você.",
      "Estudo importa. Execução, objetivo, volume, segurança e intensidade também. Mas tem uma coisa que muita gente esquece: aderência é o que mais importa. Não adianta um treino teoricamente perfeito se você odeia fazer aquele treino.",
      "Treino não é feito para um estudo científico. É feito para uma pessoa com rotina, preferências, limitações e tempo disponível. A pergunta certa é: qual o melhor exercício para essa pessoa, nesse momento, para esse objetivo? Prescrever treino é tomar decisões.",
    ],
    artigos: [{ href: "/blog/melhor-exercicio-para-ganhar-musculo", nome: "Melhor exercício para ganhar músculo" }],
    ferramenta: { href: "/ferramentas/calculadora-volume-treino", nome: "Calculadora de volume de treino" },
  },
  {
    id: "Dg8Sbv6_V8w",
    slug: "aprenda-a-recomecar-rapido",
    titulo: "O maior conselho para emagrecer: aprenda a recomeçar rápido",
    metaTitle: "O Maior Conselho Para Emagrecer: Recomece Rápido",
    descricao:
      "Perdeu um treino? Volta no próximo. O que mais atrapalha o emagrecimento não é errar uma vez, é transformar um erro pequeno em semanas longe do objetivo.",
    chamada: "Errou na dieta ou faltou no treino? Este é o conselho que mais separa quem emagrece de quem desiste.",
    texto: [
      "O maior conselho para quem quer emagrecer é simples: aprenda a recomeçar rápido.",
      "Perdeu um treino? Volta no próximo. Saiu da dieta em uma refeição? Volta na próxima. Comeu demais no fim de semana? Continua. Ficou alguns dias sem treinar? Recomeça.",
      "O que mais atrapalha o emagrecimento não é errar uma vez. É transformar um erro pequeno em vários dias ou semanas longe do objetivo. Você não precisa fazer tudo perfeito para mudar o seu corpo: precisa aprender a voltar para o caminho cada vez mais rápido.",
      "Consistência não é nunca errar. É não desistir quando errar.",
    ],
    artigos: [
      { href: "/blog/fim-de-semana-estraga-a-dieta", nome: "O fim de semana estraga a dieta?" },
      { href: "/blog/como-nao-desistir-da-dieta", nome: "Como não desistir da dieta" },
    ],
    ferramenta: { href: "/ferramentas/simulador-emagrecimento", nome: "Simulador de emagrecimento" },
    publicadoEm: "2026-09-25",
  },
  {
    id: "xb1sP6z01-s",
    slug: "nao-sentiu-o-musculo",
    titulo: "Não sentiu o músculo? Pump não é sinônimo de hipertrofia",
    metaTitle: "Não Sentiu o Músculo? Pump Não É Hipertrofia",
    descricao:
      "Não sentir o músculo não significa que você treinou errado. Execução, esforço, proximidade da falha e progressão importam mais do que sentir queimar.",
    chamada: "Terminou o treino sem sentir o músculo e achou que foi perdido? Assista antes de mudar tudo.",
    texto: [
      "Não sentiu o músculo durante o exercício? Isso não significa automaticamente que você treinou errado.",
      "Pump não é sinônimo de hipertrofia. Sentir queimar não significa crescer mais. Conexão mente-músculo pode ajudar, mas não é a única medida de um bom treino.",
      "Execução, esforço, proximidade da falha e progressão ao longo do tempo importam muito mais. Músculo não cresce porque você sentiu. Músculo cresce porque você deu estímulo.",
    ],
    artigos: [{ href: "/blog/conexao-mente-musculo", nome: "Conexão mente-músculo" }],
    ferramenta: { href: "/ferramentas/calculadora-volume-treino", nome: "Calculadora de volume de treino" },
  },
  {
    id: "0uzpCxIJkBg",
    slug: "caneta-emagrecedora-perda-de-musculo",
    titulo: "Caneta emagrecedora: um a cada três quilos pode não ser gordura",
    metaTitle: "Caneta Emagrecedora: Como Não Perder Músculo Junto",
    descricao:
      "Sem treino de força, parte relevante do peso perdido com as canetas vem de massa magra. Não é para parar o remédio: é para não entregar o músculo junto.",
    chamada: "Está usando caneta para emagrecer? Veja por que um a cada três quilos perdidos pode ser músculo, e como evitar.",
    texto: [
      "Um a cada três quilos que você perde na caneta pode não ser gordura. Nos estudos dessa classe de medicamento, sem treino de força, 30 a 40% do peso perdido vem de massa magra. Na semaglutida, perto de 39%.",
      "Músculo é o motor que gasta energia 24 horas por dia. Perder músculo é o que facilita o peso voltar depois.",
      "Não é para parar o remédio: isso é com o seu médico. É para não entregar o músculo junto: musculação 3 a 4 vezes por semana e 1,6 a 2 g de proteína por quilo. Perda muscular na caneta não é inevitável. É evitável.",
    ],
    artigos: [
      { href: "/blog/mounjaro-faz-perder-musculos", nome: "Mounjaro faz perder músculos?" },
      { href: "/blog/ozempic-faz-perder-musculo", nome: "Ozempic faz perder músculo?" },
      { href: "/blog/ozempic-e-treino", nome: "Ozempic e treino" },
    ],
    ferramenta: { href: "/ferramentas/calculadora-de-proteina", nome: "Calculadora de proteína" },
    publicadoEm: "2026-09-08",
  },
  {
    id: "yqPAYRVTe0E",
    slug: "pare-de-copiar-treino-de-influencer",
    titulo: "Pare de copiar o treino do influencer",
    metaTitle: "Pare de Copiar o Treino do Influencer",
    descricao:
      "Não existe segredo nem um único caminho. O treino perfeito é aquele que você consegue seguir por mais tempo e que cabe na sua rotina.",
    chamada: "Copiando o treino do influencer e não vendo resultado? Em menos de um minuto você entende o porquê.",
    texto: [
      "Parem de tentar copiar o treino da blogueirinha ou do influencer que você gosta. Não existe segredo, não existe apenas um caminho.",
      "O treino perfeito é aquele que você consegue seguir por mais tempo. É aquele que se encaixa na sua rotina e nas suas individualidades.",
      "Seguindo o plano com consistência, é impossível dar errado.",
    ],
    artigos: [{ href: "/blog/melhor-exercicio-para-ganhar-musculo", nome: "Melhor exercício para ganhar músculo" }],
    ferramenta: { href: "/treino-para-minha-rotina", nome: "Treino para a minha rotina" },
    publicadoEm: "2026-08-19",
  },
  {
    id: "izMrrSoJGBw",
    slug: "raiva-e-sangue-no-olho",
    titulo: "O que todo mundo que evoluiu no shape tem em comum",
    metaTitle: "O Que Todo Mundo Que Evoluiu no Shape Tem em Comum",
    descricao:
      "Um dia você vai errar. Sem raiva e sangue no olho para continuar, você desiste como sempre fez. Quem faz o trabalho não tem como dar errado.",
    chamada: "Você vai errar, isso é certo. O que decide se você chega lá é o que faz no dia seguinte.",
    texto: [
      "Existe uma característica em comum em todas as pessoas que conseguiram evoluir no shape, emagrecer e ganhar massa muscular.",
      "Um dia, com certeza, você vai errar. Se você não tiver raiva e sangue no olho para continuar, vai desistir como sempre fez.",
      "E uma coisa é certa: quem fez o trabalho não tem como dar errado. É só fazer.",
    ],
    artigos: [
      { href: "/blog/como-continuar-emagrecendo-sem-perder-motivacao", nome: "Como continuar emagrecendo sem perder a motivação" },
    ],
    publicadoEm: "2026-08-13",
  },
];

const porId = new Map(VIDEOS_CANAL.map((v) => [v.id, v]));

export function videoPorSlug(slug: string): VideoCanal | undefined {
  return VIDEOS_CANAL.find((v) => v.slug === slug);
}

/** Ids de YouTube embutidos num HTML, na ordem em que aparecem, sem repetir. */
export function videosEmbutidos(html: string): string[] {
  const ids = [...html.matchAll(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/g)].map((m) => m[1]);
  return [...new Set(ids)];
}

/** VideoObject de um vídeo, ou null se a data ainda não foi conferida. */
export function videoSchema(v: VideoCanal, siteUrl: string) {
  if (!v.publicadoEm) return null;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.titulo,
    description: v.descricao,
    thumbnailUrl: [`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`],
    uploadDate: v.publicadoEm,
    embedUrl: `https://www.youtube.com/embed/${v.id}`,
    contentUrl: `https://www.youtube.com/shorts/${v.id}`,
    author: { "@type": "Person", name: "Montinho", url: `${siteUrl}/minha-historia` },
  };
}

/**
 * VideoObject para cada vídeo registrado, com data, que aparece no HTML.
 * Vídeo de terceiros ou sem data conferida fica de fora.
 */
export function videoSchemas(html: string, siteUrl: string) {
  return videosEmbutidos(html)
    .map((id) => porId.get(id))
    .filter((v): v is VideoCanal => Boolean(v))
    .map((v) => videoSchema(v, siteUrl))
    .filter((s): s is NonNullable<typeof s> => s !== null);
}
