const WHATSAPP_NUMBER = "5511981063409";
const DEFAULT_MESSAGE = "Olá, Montinho! Vim pelo seu site e tenho interesse no seu acompanhamento. Gostaria de saber como funciona e qual opção é mais indicada para mim.";

export function getWhatsAppUrl(message: string = DEFAULT_MESSAGE): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export const WHATSAPP_NUMBER_DISPLAY = "+55 (11) 98106-3409";
export { WHATSAPP_NUMBER, DEFAULT_MESSAGE };
