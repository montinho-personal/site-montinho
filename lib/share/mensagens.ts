/**
 * Compartilhamento contextual — mensagens, microcopy e URLs.
 *
 * A pergunta que este arquivo responde não é "em quais redes queremos
 * estar", e sim "por que esta pessoa mandaria isto para alguém agora". Por
 * isso a mensagem muda com o contexto da página, e não existe um texto
 * único para o site inteiro.
 *
 * Três regras que o código garante:
 *
 * 1. RESULTADO NÃO É DADO CORPORAL. A mensagem de uma calculadora leva o
 *    resultado útil (gramas de proteína, 1RM estimado), nunca peso, altura,
 *    idade ou sexo — mesmo que a pessoa os tenha digitado. Quem recebe não
 *    precisa saber quanto o outro pesa para achar a conta interessante.
 * 2. A URL COMPARTILHADA É A CANÔNICA, com UTM. Nunca uma URL de resultado
 *    com os dados dentro, nunca a URL suja que a pessoa está vendo.
 * 3. MENSAGEM CURTA. WhatsApp não é lugar de 800 caracteres: gancho,
 *    resultado ou título, link. Sem hashtag, sem emoji em rajada, sem
 *    "MANDA PARA 3 AMIGOS".
 */

export type ContextoShare = "article" | "tool" | "tool-result" | "commercial" | "local" | "food";

/** Onde o botão estava quando foi usado. Vira parâmetro de evento. */
export type LocalShare =
  | "article_top"
  | "article_quick_answer"
  | "article_end"
  | "tool_top"
  | "tool_result"
  | "commercial_page"
  | "local_page"
  | "food_page";

export type MetodoShare = "native" | "whatsapp" | "copy_link" | "copy_message" | "email";

export interface DadosShare {
  contexto: ContextoShare;
  /** Título real da página — nunca escrito à mão no ponto de uso. */
  titulo: string;
  /** Caminho canônico, com barra inicial: /blog/algum-artigo */
  caminho: string;
  /** Linhas do resultado, já sem dado corporal. Só para tool-result. */
  resultado?: string[];
  /** Nome curto da ferramenta, para o evento e para a frase. */
  ferramenta?: string;
  /** Gancho opcional que substitui a primeira linha da mensagem. */
  gancho?: string;
}

export const SITE = "https://www.montinhopersonal.com.br";

/**
 * UTM do link compartilhado. Só três parâmetros: fonte, meio e campanha.
 * Nada de identificador de pessoa, nada de dado do resultado — o link é
 * repassado adiante e não pode carregar quem o gerou.
 */
export function urlCompartilhada(caminho: string, metodo: MetodoShare, contexto: ContextoShare): string {
  const limpo = caminho.split("?")[0].split("#")[0];
  const u = new URL(limpo.startsWith("http") ? limpo : `${SITE}${limpo.startsWith("/") ? "" : "/"}${limpo}`);
  u.searchParams.set("utm_source", "share");
  u.searchParams.set("utm_medium", metodo === "native" ? "native" : metodo === "copy_link" || metodo === "copy_message" ? "copy" : metodo);
  u.searchParams.set("utm_campaign", `${contexto}_share`);
  return u.toString();
}

/**
 * Microcopy do convite. Variações por contexto para o site não repetir a
 * mesma frase em 839 artigos — e nenhuma delas cobra, culpa ou apela.
 * A escolha é estável por chave (o mesmo artigo mostra sempre a mesma
 * frase), porque texto que muda a cada visita parece defeito.
 */
const CONVITES: Record<ContextoShare, string[]> = {
  article: [
    "Conhece alguém com essa dúvida?",
    "Isso te lembrou alguém?",
    "Essa dúvida aparece bastante. Mande para quem também precisa entender.",
    "Essa resposta é útil para mais alguém que você conhece?",
  ],
  tool: ["Quer enviar essa calculadora para alguém?", "Alguém que você conhece faria essa conta?"],
  "tool-result": ["Compartilhar meu resultado", "Enviar esse resultado"],
  commercial: ["Quer enviar esta página para alguém?", "Quer mostrar isso para alguém antes de decidir?"],
  local: ["Conhece alguém procurando personal por aqui?", "Quer enviar esta página para alguém da região?"],
  food: ["Quer mandar essa tabela para alguém?", "Alguém que você conhece ia querer ver isso?"],
};

/** Índice estável a partir do texto: mesma página, mesma frase, sempre. */
function indiceEstavel(chave: string, tamanho: number): number {
  let h = 0;
  for (let i = 0; i < chave.length; i++) h = (h * 31 + chave.charCodeAt(i)) % 100000;
  return h % tamanho;
}

export function convite(contexto: ContextoShare, chave: string): string {
  const opcoes = CONVITES[contexto];
  return opcoes[indiceEstavel(chave, opcoes.length)];
}

/** Rótulo do botão. "Compartilhar" no genérico; verbo claro onde cabe. */
export function rotuloBotao(contexto: ContextoShare): string {
  switch (contexto) {
    case "tool-result":
      return "Compartilhar resultado";
    case "tool":
      return "Compartilhar ferramenta";
    case "commercial":
    case "local":
      return "Compartilhar esta página";
    default:
      return "Compartilhar";
  }
}

/**
 * A mensagem. Gancho + o que interessa + link, nessa ordem, porque quem
 * recebe decide abrir pelas duas primeiras linhas.
 */
export function montarMensagem(d: DadosShare, metodo: MetodoShare): string {
  const url = urlCompartilhada(d.caminho, metodo, d.contexto);
  const linhas: string[] = [];

  switch (d.contexto) {
    case "article":
      linhas.push(d.gancho ?? "Olha esse conteúdo que encontrei:", `"${d.titulo}"`, "", url);
      break;
    case "tool":
      linhas.push(d.gancho ?? `Olha essa ferramenta do Montinho: ${d.titulo}`, "", url);
      break;
    case "tool-result": {
      const corpo = (d.resultado ?? []).filter(Boolean);
      linhas.push(d.gancho ?? "Meu cálculo:", ...corpo, "", "Calculei aqui:", url);
      break;
    }
    case "commercial":
      linhas.push(d.gancho ?? `Olha essa página do Montinho Personal: ${d.titulo}`, "", url);
      break;
    case "local":
      linhas.push(d.gancho ?? `Olha esse personal: ${d.titulo}`, "", url);
      break;
    case "food":
      linhas.push(d.gancho ?? d.titulo, ...(d.resultado ?? []), "", url);
      break;
  }
  return linhas.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

/** wa.me sem número: quem escolhe o destinatário é quem compartilha. */
export function urlWhatsApp(mensagem: string): string {
  return `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
}

export function urlEmail(titulo: string, mensagem: string): string {
  return `mailto:?subject=${encodeURIComponent(titulo)}&body=${encodeURIComponent(mensagem)}`;
}
