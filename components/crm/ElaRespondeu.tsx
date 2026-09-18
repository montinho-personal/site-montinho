import { marcarRespondeu, marcarRespostaSemRetorno } from "@/app/crm/actions";
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
 *
 * SÃO DOIS BOTÕES PORQUE SÃO DUAS COISAS
 *
 * "Quanto custa?" devolve a bola. "Ok", "valeu" e "qualquer coisa te chamo"
 * encerram o turno. Um botão só tratava os dois igual, e o segundo caso ia
 * parar no topo da tela com PRIORIDADE ALTA e "está esperando você" — pedindo
 * para escrever uma hora depois justamente a quem disse que ia chamar.
 */
export default function ElaRespondeu({ leadId, contactId, className = "", jaNoTopo = false }: {
  leadId: string;
  contactId: string;
  className?: string;
  /**
   * O card já está em "respondeu e está esperando você". Aqui "Respondeu"
   * não teria o que dizer — mas "Só deu um ok" é justamente o botão que
   * tira o card dali, e esconder os dois deixava o lead preso no topo sem
   * saída. Era o caso do "qualquer coisa te chamo" empacado em PRIORIDADE
   * ALTA.
   */
  jaNoTopo?: boolean;
}) {
  return (
    <>
      {!jaNoTopo && (
      <form action={marcarRespondeu} className={className}>
        <input type="hidden" name="lead_id" value={leadId} />
        <input type="hidden" name="contact_id" value={contactId} />
        <Btn tom="secundario" pequeno>Respondeu</Btn>
      </form>
      )}
      <form action={marcarRespostaSemRetorno} className={className} title="Respondeu algo que não pede retorno: ok, valeu, qualquer coisa te chamo">
        <input type="hidden" name="lead_id" value={leadId} />
        <input type="hidden" name="contact_id" value={contactId} />
        <Btn tom="ghost" pequeno>Só deu um ok</Btn>
      </form>
    </>
  );
}
