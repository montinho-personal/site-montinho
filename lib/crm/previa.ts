/**
 * Robôs que leem um link para montar a prévia (imagem + título) num app de
 * mensagem ou rede social. Não são visitantes: o link controlado entrega a
 * eles a página de destino e não registra clique.
 */
const ROBOS_DE_PREVIA = /WhatsApp|facebookexternalhit|Facebot|meta-externalagent|TelegramBot|Twitterbot|LinkedInBot|Slackbot|Discordbot|SkypeUriPreview|Pinterest|redditbot|Applebot|iMessage/i;

export function ehRoboDePrevia(ua: string | null | undefined): boolean {
  return !!ua && ROBOS_DE_PREVIA.test(ua);
}
