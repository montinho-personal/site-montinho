/**
 * A regra de cobertura: todo artigo novo passa por uma decisão de ferramenta.
 *
 * O problema que isto resolve apareceu na prática. Sete artigos foram
 * publicados em dois dias e nenhum recebeu ferramenta — não porque alguém
 * decidiu que não cabia, mas porque ninguém lembrou de perguntar. E o mesmo
 * já tinha acontecido antes com o artigo mais linkado do site inteiro, que
 * ficou anos sem nada.
 *
 * A regra NÃO é "todo artigo precisa de ferramenta". Seria falsa: existe
 * artigo cuja pergunta não termina em conta nenhuma, e enfiar calculadora
 * nele piora a leitura e dilui a ferramenta. A regra é que a decisão precisa
 * ser EXPLÍCITA — ou o artigo está num registro de ferramenta, ou está
 * listado aqui com o motivo de não estar.
 *
 * Vale a partir de DATA_DA_REGRA. O acervo anterior é grande demais para
 * classificar de uma vez, e forçar isso agora transformaria a regra numa
 * dívida impagável que o teste reprovaria para sempre. O passado entra aos
 * poucos, quando alguém mexer no artigo.
 *
 * Como cumprir, ao publicar um artigo novo:
 *
 *   1. Pergunte: o leitor termina este texto com uma conta na cabeça?
 *   2. Se sim, registre no registro da ferramenta que responde essa conta.
 *      Cuidado com os tetos — vários registros são limitados a oito por um
 *      teste de seletividade, e nesses casos existe a variante de LINK.
 *   3. Se não, acrescente o slug aqui embaixo com uma frase dizendo por quê.
 *
 * O teste de cobertura reprova qualquer artigo novo que não esteja nem num
 * lugar nem no outro.
 */

/** A regra só vale para artigos publicados a partir desta data. */
export const DATA_DA_REGRA = "2026-08-29";

/**
 * Artigos que ficam sem ferramenta por decisão, com o motivo.
 *
 * O motivo não é burocracia: é o que impede a lista de virar depósito de
 * "não deu tempo". Se você não consegue escrever a frase, provavelmente o
 * artigo cabe numa ferramenta.
 */
export const ARTIGOS_SEM_FERRAMENTA: Record<string, string> = {
  "rosca-direta-vs-rosca-martelo":
    "Comparativo de exercício: a decisão do leitor é qual pegada usar, e a resposta é anatômica, não numérica. Nenhuma ferramenta do site compara exercícios.",

  "hack-vs-leg-press":
    "Mesma razão do agachamento vs leg press: a pergunta é onde a carga entra e como o quadril se move, e isso não vira conta. A de 1RM aqui seria a disponível, não a certa.",

  "puxada-vs-remada":
    "Mesma razão dos outros comparativos de exercício: a decisão do leitor é qual vetor de puxada colocar no treino, e nenhuma ferramenta do site compara exercícios. A de 1RM responde a carga, que é outra pergunta.",

  "stiff-vs-levantamento-terra":
    "A dúvida é qual exercício serve a qual objetivo, e a resposta é técnica, não numérica. Colocar a calculadora de 1RM aqui seria empurrar a ferramenta disponível — e ainda por cima num artigo cujo recado central é usar MENOS carga no stiff.",

  "supino-reto-vs-supino-inclinado":
    "A dúvida do leitor é qual exercício escolher e em que ângulo, não quanto peso usar. A calculadora de 1RM responde a segunda pergunta, e o registro dela é explícito sobre entrar só onde a pergunta é a carga — os artigos de técnica de supino já têm o link contextual.",

  "agachamento-vs-leg-press":
    "Mesma razão do par de supino: a decisão é qual exercício faz sentido para o corpo e a limitação de quem lê. Nenhuma ferramenta do site compara exercícios, e a de 1RM aqui seria a disponível, não a certa.",

  "personal-trainer-a-domicilio-santana-de-parnaiba":
    "Página de serviço regional. A decisão do leitor é contratar ou não; o que ele precisa é saber como funciona e o que verificar, não um número.",

  "personal-trainer-para-emagrecer-alphaville":
    "Página de serviço. A conta que o leitor poderia querer (déficit, gasto) já mora nos artigos linkados que carregam as calculadoras; aqui a decisão é contratar, e embutir calculadora numa página comercial dilui as duas coisas.",

  "academia-24-horas-santana-de-parnaiba":
    "Guia de onde treinar fora de hora numa cidade específica. O leitor sai com um endereço e uma pergunta para a recepção, não com uma conta.",

  "personal-trainer-feminino-santana-de-parnaiba":
    "Página de serviço regional para mulheres. A decisão é contratar ou não; a conta que poderia caber (proteína, volume) já mora nos artigos de hipertrofia feminina linkados.",

  "quanto-custa-personal-trainer-aldeia-da-serra":
    "O leitor termina querendo uma proposta, não uma conta: o valor depende de local, frequência e deslocamento, e o site não publica tabela. Nenhuma calculadora responde isso — a resposta é a conversa no WhatsApp.",

  "personal-trainer-a-domicilio-aldeia-da-serra":
    "Página de serviço regional. A decisão do leitor é contratar ou não, e o que ele precisa é saber como funciona e o que verificar, não um número.",

  "academias-em-aldeia-da-serra":
    "Guia de onde treinar numa região específica. O leitor termina com um endereço e um trajeto na cabeça, não com uma conta — e a ferramenta de academias só cobre Alphaville, onde a Aldeia não entra.",

  "melhores-academias-aldeia-da-serra":
    "Ranking por situação de uma região sem cobertura na base de academias. A decisão do leitor é qual unidade visitar, e nenhuma calculadora do site responde isso.",

  "forca-de-pegada-e-antebraco":
    "A pergunta do leitor é o que fazer com a mão que solta a barra, e a resposta é um exercício, não um número. Nenhuma das ferramentas do site calcula pegada — colocar a de volume aqui seria empurrar a ferramenta disponível em vez da certa.",

  "acessorios-de-treino-valem-a-pena":
    "O artigo responde uma decisão de compra, não uma conta. Quem termina de ler quer saber se compra o cinto — e nenhuma calculadora responde isso.",

  "primeira-sessao-com-personal-trainer":
    "O leitor termina sem conta na cabeça: ele quer saber se pode marcar sem medo. A pergunta que sobra é para o WhatsApp, e o artigo já leva lá. Ferramenta aqui seria desvio no fundo do funil.",

  "personal-trainer-ou-aula-coletiva":
    "Decisão de formato, não de número. Quem termina de ler quer saber qual dos dois marca, e a resposta depende de lesão, objetivo e rotina — coisas que a conversa inicial resolve e nenhuma calculadora resolve.",

  "por-quanto-tempo-tomar-mounjaro":
    "A pergunta que sobra é 'já posso parar?', e a resposta são três condições — peso estável, treino de força há dois meses, comida que se sustenta — nenhuma delas um número que se calcule. Quem quiser a conta de proteína encontra a calculadora no artigo irmão, sobre parar de tomar; repeti-la aqui responderia uma pergunta que este leitor ainda não fez.",
  "panturrilha-em-pe-vs-sentada":
    "Comparação anatômica: a posição do joelho decide se trabalha gastrocnêmio ou sóleo. O leitor sai com uma decisão de montagem de treino, não com um número para calcular.",
  "barra-fixa-vs-puxada":
    "Comparação de exercício e de momento do aluno. A escolha depende de conseguir ou não fazer barra fixa hoje, que é observação direta, não cálculo.",
};

export const SLUGS_SEM_FERRAMENTA = Object.keys(ARTIGOS_SEM_FERRAMENTA);
