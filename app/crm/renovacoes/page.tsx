import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo, urlWhatsAppContato } from "@/lib/crm/dados";
import { mensagemPara } from "@/lib/crm/copy";
import { FAIXAS, panoramaRenovacoes, type LinhaRenovacao } from "@/lib/crm/renovacoes";
import { Badge, Pagina, Stat, brl, dataBr } from "@/components/crm/ui";
import BotaoWhatsApp from "@/components/crm/BotaoWhatsApp";

/**
 * Renovações: o mapa inteiro, não só o que vence hoje.
 *
 * A lista de hoje mostra o card na hora de agir; aqui o Montinho vê quem
 * renova esta semana, este mês e depois, quanto vale cada ciclo, quantas
 * mensagens já foram e quem está com o pacote acabando. O botão do WhatsApp
 * só aparece quando é hora de falar (mesma janela de alerta da lista de hoje)
 * e registra o envio do mesmo jeito.
 */
export default async function Renovacoes() {
  await exigirUsuario();
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const agora = new Date();
  const alertas = (cat.config.renovacao?.alertas_dias_antes as number[] | undefined) ?? [30, 14, 7];
  const linhas = panoramaRenovacoes(b, cat, agora, alertas);
  const de = (f: string) => linhas.filter((l) => l.faixa === f);
  const soma = (ls: LinhaRenovacao[]) => ls.reduce((s, l) => s + (l.valor ?? 0), 0);
  const agir = linhas.filter((l) => l.faixa === "vencida" || l.faixa === "pacote_fim" || l.faixa === "semana" || l.faixa === "mes");

  return (
    <Pagina titulo="Renovações" sub="Todo aluno ativo, em que ponto do ciclo está e o que falta fazer.">
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <Stat rotulo="Venceu" valor={de("vencida").length} tom={de("vencida").length ? "ruim" : "bom"} sub={de("vencida").length ? brl(soma(de("vencida"))) : undefined} />
        <Stat rotulo="Pacote terminou" valor={de("pacote_fim").length} tom={de("pacote_fim").length ? "alerta" : "neutro"} />
        <Stat rotulo="Até 7 dias" valor={de("semana").length} tom={de("semana").length ? "alerta" : "neutro"} />
        <Stat rotulo="8 a 30 dias" valor={de("mes").length} />
        <Stat rotulo="Em jogo nos próximos 30 dias" valor={brl(soma(agir))} sub={`${agir.length} aluno${agir.length === 1 ? "" : "s"}`} />
      </div>

      {FAIXAS.map((f) => {
        const ls = de(f.id);
        if (!ls.length) return null;
        return (
          <section key={f.id} className="mb-8">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-zinc-400">{f.titulo} <span className="text-zinc-500">· {ls.length}</span></h2>
            <p className="mb-3 text-sm text-zinc-500">{f.sub}</p>
            <ul className="space-y-2">{ls.map((l) => <Linha key={l.clientId} l={l} wa={l.grupo && !l.decidir ? urlWhatsAppContato(l.telefone, mensagemPara(b, cat, { contactId: l.contactId, clientId: l.clientId }, l.grupo, agora).texto) : null} situacao={l.grupo ? mensagemPara(b, cat, { contactId: l.contactId, clientId: l.clientId }, l.grupo, agora).situacao : undefined} />)}</ul>
          </section>
        );
      })}
    </Pagina>
  );
}

function quando(l: LinhaRenovacao): string {
  if (l.pacote) return `${l.pacote.usadas} de ${l.pacote.contratadas} aulas dadas${l.pacote.usadas < l.pacote.contratadas ? ` · faltam ${l.pacote.contratadas - l.pacote.usadas}` : ""}`;
  if (l.dias == null) return "sem data";
  if (l.dias < 0) return `venceu em ${dataBr(l.renewalDate)} · há ${-l.dias} dia${l.dias === -1 ? "" : "s"}`;
  if (l.dias === 0) return "renova hoje";
  return `renova em ${dataBr(l.renewalDate)} · faltam ${l.dias} dia${l.dias === 1 ? "" : "s"}`;
}

function Linha({ l, wa, situacao }: { l: LinhaRenovacao; wa: string | null; situacao?: string }) {
  const tom = l.faixa === "vencida" ? "ruim" : l.faixa === "pacote_fim" || l.faixa === "semana" ? "alerta" : "neutro";
  const ciclo = l.cicloMeses ? ` · ${l.cicloMeses === 1 ? "mensal" : `${l.cicloMeses} meses`}` : "";
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/70 p-3">
      <div className="min-w-0 flex-1 basis-full sm:basis-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/crm/clientes/${l.clientId}`} className="font-medium hover:underline">{l.nome}</Link>
          <Badge tom={l.servicoCode === "online" ? "info" : "neutro"}>{l.servico}</Badge>
        </div>
        <div className="mt-1 text-sm"><span className={tom === "ruim" ? "text-red-300" : tom === "alerta" ? "text-amber-300" : "text-zinc-300"}>{quando(l)}</span></div>
        <div className="mt-0.5 text-xs text-zinc-500">{l.plano}{l.valor != null ? ` · ${brl(l.valor)}${ciclo}` : ""}</div>
        {(l.cobrancas > 0 || l.aguardandoAte || l.decidir) && (
          <div className="mt-1 flex flex-wrap gap-2 text-xs">
            {l.cobrancas > 0 && <span className="text-zinc-400">{l.cobrancas} mensage{l.cobrancas === 1 ? "m" : "ns"} sobre a renovação neste ciclo</span>}
            {l.aguardandoAte && <Badge tom="info">aguardando resposta até {dataBr(l.aguardandoAte)}</Badge>}
            {l.decidir && <Badge tom="alerta">3 mensagens sem resposta: decidir renovar, pausar ou encerrar</Badge>}
          </div>
        )}
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
        {wa && l.grupo && <BotaoWhatsApp url={wa} contactId={l.contactId} clientId={l.clientId} grupo={l.grupo} situacao={situacao} />}
        <Link href={`/crm/clientes/${l.clientId}`} className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-zinc-200 hover:bg-white/5">Abrir ficha</Link>
      </div>
    </li>
  );
}
