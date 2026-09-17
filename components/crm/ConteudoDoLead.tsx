import { registrarConteudo } from "@/app/crm/actions";
import { Aviso, Btn, Campo, Card, Input } from "@/components/crm/ui";
import { INTERVALO_DIAS, MAX_CONTEUDOS, cliqueAntesDoRetorno, podeEnviarConteudo, textoDoRetorno, urlDoConteudo, type Veredito } from "@/lib/crm/conteudo";
import { SITE_URL } from "@/lib/blog";
import { preencher, saudacaoDe } from "@/lib/crm/copy";
import { TEXTOS } from "@/lib/crm/copy-textos";

export interface EnvioRegistrado {
  token: string; destino: string; titulo: string | null;
  enviado_em: string; cliques: number; primeiro_clique_em: string | null;
}

/*
 * A ordem tem razão de ser e está aqui para não se perder:
 *
 * 1º  desmente a previsão dela. Ela espera cobrança e recebe um presente que
 *     não pede nada — é a mensagem que reconstrói a confiança na frase "não
 *     vou ficar te cobrando" que fechou o ciclo anterior.
 * 2º  ferramenta, não artigo. Um número sobre o corpo dela é o que fica, e
 *     devolve a ela um motivo de voltar que não é o Montinho pedindo.
 * 3º  o que ela mesma disse. Provar que ouviu vale mais que qualquer texto.
 */
const SEQUENCIA = ["conteudo_primeiro", "conteudo_ferramenta", "conteudo_do_que_ela_disse"] as const;
const SUGESTAO = [
  { destino: "/blog/balanca-nao-muda-mas-o-corpo-muda", titulo: "por que a balança não muda mas o corpo está mudando" },
  { destino: "/ferramentas/calculadora-de-proteina", titulo: "quanta proteína o seu corpo precisa por dia" },
  { destino: "", titulo: "" },
];

/**
 * Conteúdo para lead adiado: presença sem cobrança.
 *
 * Depois do terceiro follow-up o CRM para de cobrar, e a mensagem que fecha
 * o ciclo promete não cobrar de novo. O que ainda pode chegar é algo que não
 * pede nada — e o link daqui é o que permite responder, daqui a três meses,
 * se isso funcionou, em vez de discutir impressão.
 */
export default function ConteudoDoLead({ leadId, contactId, primeiroNome, envios, ultimaRespostaDela, emPaz, motivoPerda, somenteLeitura }: {
  leadId: string;
  contactId: string;
  primeiroNome: string;
  envios: EnvioRegistrado[];
  /** Quando ela voltou a falar — o `last_reply_at` do lead. */
  ultimaRespostaDela: string | null;
  emPaz: boolean;
  motivoPerda: string | null;
  somenteLeitura: boolean;
}) {
  const ordenados = [...envios].sort((a, b) => a.enviado_em.localeCompare(b.enviado_em));
  const v: Veredito = podeEnviarConteudo(
    ordenados.map((e) => ({ enviadoEm: e.enviado_em })),
    { emPaz, motivoPerda },
  );
  const proximo = v.pode ? v.numero : ordenados.length + 1;
  const sugestao = SUGESTAO[Math.min(proximo, SEQUENCIA.length) - 1] ?? SUGESTAO[2];

  const mensagemDe = (e: EnvioRegistrado, i: number) =>
    preencher(TEXTOS[SEQUENCIA[Math.min(i, SEQUENCIA.length - 1)]], {
      saudacao: saudacaoDe(new Date()),
      nome: primeiroNome,
      assunto: e.titulo ?? "",
      link: urlDoConteudo(SITE_URL, e.token),
    });

  return (
    <Card titulo={`Conteúdo — ${ordenados.length}/${MAX_CONTEUDOS} enviados`}>
      <p className="text-xs text-zinc-500">
        Presença sem cobrança, para quem foi adiado. A mensagem não pergunta nada e termina no link —
        é o que faz a promessa de não cobrar continuar valendo. Um a cada {INTERVALO_DIAS} dias, no máximo {MAX_CONTEUDOS}.
      </p>

      {ordenados.length > 0 && (
        <ul className="mt-3 space-y-3">
          {ordenados.map((e, i) => (
            <li key={e.token} className="rounded-lg border border-white/10 p-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">{i + 1}. {e.titulo || e.destino}</span>
<span className="text-xs text-zinc-500">
                  {new Date(e.enviado_em).toLocaleDateString("pt-BR")} ·{" "}
                  {e.cliques > 0
                    ? <strong className="text-emerald-400">clicou{e.cliques > 1 ? ` ${e.cliques}×` : ""}</strong>
                    : "sem clique"}
                </span>
              </div>
              {(() => {
                /*
                 * A frase diz o que aconteceu e em que ordem — nunca que o
                 * conteúdo trouxe a pessoa. Quem lê é quem conclui, do mesmo
                 * jeito que o CRM já faz quando o Ref some da mensagem: mostra
                 * o que sabe e deixa uma pessoa ligar, porque atribuição
                 * inventada é pior que atribuição faltando.
                 */
                const r = cliqueAntesDoRetorno(e.primeiro_clique_em, ultimaRespostaDela);
                return r ? <p className="mt-1 text-xs text-amber-300">↩ {textoDoRetorno(r)}</p> : null;
              })()}
              <textarea readOnly rows={5} value={mensagemDe(e, i)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 p-2 font-mono text-xs text-zinc-300"
                aria-label={`Mensagem do conteúdo ${i + 1}, pronta para copiar`} />
            </li>
          ))}
        </ul>
      )}

      {!v.pode && <div className="mt-3"><Aviso tom="alerta">{v.motivo}</Aviso></div>}

      {v.pode && !somenteLeitura && (
        <form action={registrarConteudo} className="mt-3 space-y-3">
          <input type="hidden" name="lead_id" value={leadId} />
          <input type="hidden" name="contact_id" value={contactId} />
          <Campo rotulo="Caminho no site" dica="Só caminho, começando com / — o link é gerado com o rastreio.">
            <Input name="destino" required defaultValue={sugestao.destino} placeholder="/blog/..." pattern="^/[A-Za-z0-9/_-]*$" />
          </Campo>
          <Campo rotulo="Assunto, como você diria no WhatsApp" dica="Entra no meio da frase: “É sobre ___”. Em minúscula, sem ponto final.">
            <Input name="titulo" defaultValue={sugestao.titulo} placeholder="por que a balança não muda mas o corpo está mudando" />
          </Campo>
          <Btn tom="secundario" pequeno>Gerar link do conteúdo {proximo}</Btn>
        </form>
      )}
    </Card>
  );
}
