"use client";
import { useState } from "react";
import { registrarAulas } from "@/app/crm/actions";
import { lerDatas } from "@/lib/crm/aulas";
import { Btn, Detalhes, Textarea } from "@/components/crm/ui";

/**
 * A lista de aulas colada como ela vive no WhatsApp.
 *
 * O Montinho já mantém o controle lá ("-06/08, -07/08…"). Pedir para digitar
 * data por data num formulário é garantir que ninguém preenche. Aqui ele
 * cola o bloco inteiro, e a prévia diz na hora quantas datas o CRM entendeu
 * — antes de gravar, porque contagem errada vira cobrança errada.
 */
export default function ColarAulas({ clientId }: { clientId: string }) {
  const [texto, setTexto] = useState("");
  const { datas, repetidas, ignoradas } = lerDatas(texto);
  return (
    <Detalhes titulo="Colar datas das aulas" aberto>
      <form action={registrarAulas} className="space-y-2">
        <input type="hidden" name="client_id" value={clientId} />
        <Textarea name="datas" value={texto} onChange={(e) => setTexto(e.target.value)} rows={5}
          placeholder={"Cole a lista como está no WhatsApp:\n-06/08\n-07/08\n-10/08"} />
        {texto.trim() && (
          <p className="text-xs text-zinc-400">
            {datas.length === 0 ? "Nenhuma data reconhecida ainda." : `Entendi ${datas.length} data${datas.length > 1 ? "s" : ""}: ${datas.map((d) => `${d.slice(8, 10)}/${d.slice(5, 7)}`).join(", ")}.`}
            {repetidas.length > 0 && ` ${repetidas.length} repetida${repetidas.length > 1 ? "s" : ""} na lista, conto uma vez.`}
            {ignoradas.length > 0 && ` Ignorei: ${ignoradas.slice(0, 3).join(" · ")}.`}
          </p>
        )}
        {datas.length > 0 && <Btn pequeno>Registrar {datas.length} aula{datas.length === 1 ? "" : "s"}</Btn>}
      </form>
    </Detalhes>
  );
}
