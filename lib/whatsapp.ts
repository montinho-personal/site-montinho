const WHATSAPP_NUMBER = "5511981063409";
const DEFAULT_MESSAGE = "Olá! Vim pelo site e quero saber mais sobre o Personal Trainer.";

export function getWhatsAppUrl(message: string = DEFAULT_MESSAGE): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export const WHATSAPP_NUMBER_DISPLAY = "+55 (11) 98106-3409";
export { WHATSAPP_NUMBER, DEFAULT_MESSAGE };
