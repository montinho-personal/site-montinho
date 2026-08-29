/**
 * Onde o teste de mobilidade aparece nos artigos.
 *
 * Diferença deliberada em relação às sete calculadoras: elas são embutidas no
 * corpo do texto, esta NÃO é. O teste tem cinco telas, exige a pessoa de pé
 * com uma parede por perto e leva cinco minutos — embutir isso no meio de um
 * artigo carregaria JavaScript pesado em dezenas de páginas para oferecer algo
 * que ninguém faz enquanto lê. O que entra é um convite, renderizado no
 * servidor, com zero JavaScript.
 *
 * A regra de uma ferramenta por artigo continua valendo: nenhum slug daqui
 * pode estar em outro registro, e o teste garante isso.
 *
 * O convite é escrito por artigo, não genérico. Quem chegou lendo sobre
 * desconforto no joelho ao agachar tem uma dúvida diferente de quem chegou
 * lendo sobre aquecimento — e um convite que repete a mesma frase nos dois
 * lugares vira rodapé ignorado.
 */

export interface ConviteArtigo {
  /** A ponte entre o que a pessoa acabou de ler e o que o teste responde. */
  texto: string;
  rotulo: string;
}

export const ARTIGOS_COM_TESTE_MOBILIDADE: Record<string, ConviteArtigo> = {
  "mobilidade-articular-pre-treino": {
    texto:
      "Antes de escolher exercícios de mobilidade, vale saber quais regiões realmente pedem trabalho no seu caso. Cinco testes simples respondem isso em cinco minutos — e o protocolo que sai tem dois ou três exercícios, não uma lista.",
    rotulo: "Fazer o teste de mobilidade",
  },
  "alongamento-antes-ou-depois-do-treino": {
    texto:
      "O melhor momento para alongar depende de onde você precisa alongar — e de quanto. O teste mostra suas regiões e monta o protocolo já separando o que fica antes do treino do que fica nos dias de folga.",
    rotulo: "Descobrir o que alongar",
  },
  "dor-no-joelho-no-agachamento": {
    texto:
      "A amplitude do tornozelo é uma das coisas que muda a forma como você desce no agachamento. O teste mede a sua em um minuto — sem afirmar que ela seja a causa de qualquer desconforto, o que nenhum teste online consegue dizer.",
    rotulo: "Testar minha mobilidade de tornozelo",
  },
  "aquecimento-antes-do-treino": {
    texto:
      "Um bom aquecimento é específico, e específico quer dizer direcionado ao que é limitado em você. O teste identifica isso e devolve os movimentos certos para o seu pré-treino, já respeitando o que não deve ser feito antes de carga pesada.",
    rotulo: "Montar meu pré-treino",
  },
  "postura-trabalho-sentado-exercicios": {
    texto:
      "Se você passa o dia sentado e sente o corpo rígido, o teste diz quais regiões pedem atenção primeiro. São cinco minutos, e o protocolo cabe em seis — feito para caber num dia de trabalho, não numa academia.",
    rotulo: "Ver o que trabalhar primeiro",
  },
  /**
   * O cluster editorial escrito para sustentar a ferramenta. Estes três
   * saíram depois dela e entram aqui já registrados — quando a chave de
   * lançamento abrir, o convite aparece sem ninguém precisar lembrar.
   */
  "mobilidade-de-tornozelo": {
    texto:
      "Você acabou de ler como medir um tornozelo. O teste completo mede cinco regiões em cinco minutos, cruza o resultado com os exercícios que você faz e devolve um protocolo de dois ou três exercícios — com a dose que a literatura sustenta.",
    rotulo: "Fazer o teste completo",
  },
  "mobilidade-de-quadril": {
    texto:
      "Quadril é uma das cinco regiões que o teste avalia. Fazendo as cinco você descobre qual delas pede atenção primeiro — porque trabalhar duas de cada vez funciona melhor que atacar todas.",
    rotulo: "Ver minhas cinco regiões",
  },
  "flexibilidade-e-musculacao": {
    texto:
      "Se a conclusão é que você deve alongar pouco e direcionado, falta a parte difícil: saber onde. O teste mede cinco regiões e devolve as duas que valem o seu tempo — dentro dos dez minutos semanais que a evidência aponta.",
    rotulo: "Descobrir onde direcionar",
  },
  "dor-no-ombro-ao-treinar": {
    texto:
      "Levar o braço acima da cabeça sem compensar com a lombar exige uma amplitude que nem todo mundo tem. O teste mede a sua. Ele não investiga dor — para isso o caminho é avaliação individual —, mas mostra o que dá para trabalhar.",
    rotulo: "Testar minha amplitude de ombro",
  },
};

export const SLUGS_COM_TESTE_MOBILIDADE = Object.keys(ARTIGOS_COM_TESTE_MOBILIDADE);

export const HREF_TESTE_MOBILIDADE = "/ferramentas/teste-mobilidade";
