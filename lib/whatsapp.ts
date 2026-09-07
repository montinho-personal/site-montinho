const WHATSAPP_NUMBER = "5511981063409";
const DEFAULT_MESSAGE = "Olá, Montinho! Vim pelo seu site e tenho interesse no seu acompanhamento. Gostaria de saber como funciona e qual opção é mais indicada para mim.";

export function getWhatsAppUrl(message: string = DEFAULT_MESSAGE): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export const WHATSAPP_NUMBER_DISPLAY = "+55 (11) 98106-3409";
export { WHATSAPP_NUMBER, DEFAULT_MESSAGE };

/**
 * Mensagem montada no clique, para os botões que não têm frase própria.
 *
 * Header, rodapé, botão flutuante, topo e fim das páginas regionais e os
 * links dentro dos artigos abriam o WhatsApp com a mesma frase genérica — e
 * quando a pessoa apaga o "Ref:", nada mais dizia de onde ela veio. Aqui a
 * frase carrega a página e a posição do botão, que ninguém apaga porque é o
 * corpo da mensagem. O CRM lê os dois (lib/crm/mensagens.ts).
 */
export const ORIGENS_WA = {
  menu: "menu",
  "menu-mobile": "menu",
  rodape: "rodapé",
  flutuante: "botão flutuante",
  topo: "botão do topo",
  fim: "botão do fim",
  texto: "link no texto",
  pagina: "página",
} as const;
export type OrigemWa = keyof typeof ORIGENS_WA;

/** Tira o sufixo da marca do document.title: "X | Montinho Personal Trainer" → "X". */
export function limparTitulo(titulo: string): string {
  const semMarca = titulo.replace(/\s*[|—–-]\s*Montinho(?: Personal Trainer)?\s*$/i, "").replace(/\s+/g, " ").trim();
  // "Consultoria Online de Treino | Personal Trainer Online" → a primeira parte já nomeia a página.
  const primeira = semMarca.split(" | ")[0].trim();
  return primeira || semMarca;
}

export function mensagemContextual(origem: OrigemWa | string, titulo: string): string {
  const rotulo = (ORIGENS_WA as Record<string, string>)[origem] ?? "página";
  const t = limparTitulo(titulo) || "seu site";
  return `Olá, Montinho! Estou no seu site, na página «${t}», e cliquei no ${rotulo}. Queria saber como funciona o acompanhamento.`;
}
