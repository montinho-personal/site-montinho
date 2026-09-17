import { marcarRespondeu } from "@/app/crm/actions";
import { Btn } from "@/components/crm/ui";

/**
 * "Ela respondeu" — um toque, sem abrir nada.
 *
 * O CRM não enxerga o WhatsApp. Ele sabe quando alguém chegou, porque o
 * clique no site é registrado, mas não sabe o que acontece depois dentro do
 * aplicativo. Enquanto ninguém avisa, o sistema segue achando que a bola
 * está com ela — e em cinco dias pede um follow-up para quem já está
 * conversando. Foi assim que uma aluna que já havia comprado continuou
 * aparecendo na fila de "fazer primeiro contato".
 *
 * Por isso este botão sai de dentro do acordeão "Atualizar o que aconteceu"
 * e vem para a linha visível do card. Três toques (abrir, procurar, tocar)
 * para registrar a coisa mais frequente do dia é o tipo de atrito que não
 * se resolve com disciplina: resolve-se tirando os dois primeiros toques.
 */
export default function ElaRespondeu({ leadId, contactId, className = "" }: {
  leadId: string;
  contactId: string;
  className?: string;
}) {
  return (
    <form action={marcarRespondeu} className={className}>
      <input type="hidden" name="lead_id" value={leadId} />
      <input type="hidden" name="contact_id" value={contactId} />
      <Btn tom="secundario" pequeno>Ela respondeu</Btn>
    </form>
  );
}
