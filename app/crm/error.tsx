"use client";

import { useEffect } from "react";

/**
 * A tela de erro do CRM — que existe sobretudo por causa de um erro só.
 *
 * O QUE ACONTECE
 *
 * O CRM fica aberto no celular o dia inteiro. Quando o site é publicado de
 * novo, aquela aba continua apontando para a versão anterior: os botões dela
 * chamam ações do servidor com identificadores que a versão nova não tem
 * mais. O Next responde "Failed to find Server Action", e o navegador mostra
 * "This page couldn't load" — sem explicação e sem saída, no meio do
 * atendimento.
 *
 * Em 18/09 isso apareceu quatorze vezes em quatro segundos, com um usuário
 * só: seis publicações no mesmo dia, e a aba do Montinho envelhecendo entre
 * uma e outra.
 *
 * O QUE ISTO FAZ
 *
 * Reconhece esse caso e recarrega sozinho, que é exatamente o que a pessoa
 * faria à mão — só que sem ela precisar entender por quê. Recarregar busca a
 * versão nova e o botão volta a existir.
 *
 * O CUIDADO QUE FAZ DIFERENÇA
 *
 * Recarregar sem limite transformaria um erro persistente num laço infinito
 * de telas piscando, que é pior do que a mensagem feia. Por isso a recarga
 * automática acontece UMA vez por sessão: se o erro voltar depois dela, a
 * causa é outra e a tela se explica em vez de insistir.
 *
 * O CONSERTO DE VERDADE mora fora daqui: a Proteção contra Desvio de Versão
 * (Skew Protection) da Vercel mantém a aba velha conversando com a versão
 * que ela carregou, e aí o erro não chega a acontecer. É uma chave nas
 * configurações do projeto, não uma linha de código.
 */

const CHAVE = "crm_recarregou_por_versao";

/** O erro de ação que sumiu porque o site foi publicado de novo. */
function ehVersaoAntiga(error: Error): boolean {
  return /failed to find server action|older or newer deployment/i.test(
    `${error.message} ${error.name}`,
  );
}

export default function ErroDoCrm({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    if (!ehVersaoAntiga(error)) return;
    let jaTentou = false;
    try {
      jaTentou = sessionStorage.getItem(CHAVE) === "1";
      sessionStorage.setItem(CHAVE, "1");
    } catch {
      /* navegador sem storage: segue e recarrega uma vez. */
    }
    // Sem marcar estado antes: a página sai do ar no instante seguinte, e
    // mexer em estado só para exibir um texto que ninguém lê custa um
    // re-render em cascata que o lint reprova com razão.
    if (!jaTentou) location.reload();
  }, [error]);

  /*
   * Sessão que carregou sem erro pode esquecer a marca: o próximo desvio de
   * versão merece a mesma recarga automática que este teve.
   */
  useEffect(() => {
    if (ehVersaoAntiga(error)) return;
    try { sessionStorage.removeItem(CHAVE); } catch { /* sem storage */ }
  }, [error]);

  const versaoAntiga = ehVersaoAntiga(error);

  return (
    <div className="mx-auto w-full max-w-lg px-4 py-16 text-center">
      <h1 className="font-serif text-2xl font-semibold text-white">
        {versaoAntiga ? "O site foi atualizado" : "Algo deu errado"}
      </h1>
      <p className="mt-3 text-sm text-zinc-400">
        {versaoAntiga
          ? "Esta aba estava aberta desde antes da última publicação, e o botão que você tocou já não existia mais. Recarregar resolve."
          : "Não consegui carregar esta parte do CRM. Nada do que você registrou se perdeu."}
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => location.reload()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
        >
          Recarregar
        </button>
        <button
          onClick={() => unstable_retry()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-white/20 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10"
        >
          Tentar de novo
        </button>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-zinc-600">Código: {error.digest}</p>
      )}
    </div>
  );
}
