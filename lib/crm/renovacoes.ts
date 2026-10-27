/**
 * Panorama de renovações: todo cliente ativo, em que ponto do ciclo está e
 * o que falta fazer. A tela Hoje mostra só o que precisa de ação agora; esta
 * mostra o mapa inteiro, inclusive quem renova daqui a dois meses.
 *
 * As regras são as mesmas da lista de hoje (metricas.prioridadesHoje): o
 * pacote conta aula, não data; mensagem enviada põe o card em espera até a
 * próxima cobrança; três mensagens sem resposta viram decisão.
 */
import type { Base, Catalogo } from "./dados";
import { diasEntre } from "./metricas";
import { MAX_FOLLOW_UPS } from "./ciclo";
import { pacoteDoCliente } from "./visao";

export type FaixaRenovacao = "vencida" | "semana" | "mes" | "depois" | "pacote_fim" | "pacote" | "sem_data";

export interface LinhaRenovacao {
  clientId: string; contactId: string; nome: string; telefone: string | null;
  servico: string; servicoCode: string | null; plano: string; valor: number | null; cicloMeses: number | null;
  renewalDate: string | null; dias: number | null;
  pacote: { usadas: number; contratadas: number; semanas: number | null } | null;
  faixa: FaixaRenovacao;
  /** Mensagens sobre renovação desde que o ciclo venceu (ou desde o início, se ainda não venceu). */
  cobrancas: number;
  /** Já falei e estou esperando a resposta até esta data. */
  aguardandoAte: string | null;
  /** Grupo da lista de hoje que esta linha usa para o texto do WhatsApp; nulo = ainda não é hora. */
  grupo: "renovacao_vencida" | "renovacao_proxima" | "renovacao_pacote" | null;
  decidir: boolean;
}

export const FAIXAS: { id: FaixaRenovacao; titulo: string; sub: string }[] = [
  { id: "vencida", titulo: "Venceu", sub: "Plano vencido e aluno ativo: confirmar se segue, pausa ou encerra." },
  { id: "pacote_fim", titulo: "Pacote terminou", sub: "Última aula dada: conferir as datas e abrir o próximo." },
  { id: "semana", titulo: "Renova em até 7 dias", sub: "Hora de conversar sobre o próximo ciclo." },
  { id: "mes", titulo: "Renova em 8 a 30 dias", sub: "Já dá para planejar o próximo ciclo com o aluno." },
  { id: "pacote", titulo: "Pacotes em andamento", sub: "Pacote conta aula, não data: o card aparece quando a última aula for dada." },
  { id: "depois", titulo: "Renova em mais de 30 dias", sub: "Ainda sem ação. Fica aqui para você ver o mapa inteiro." },
  { id: "sem_data", titulo: "Sem data de renovação", sub: "Cliente ativo sem data cadastrada: preencher na ficha para entrar no radar." },
];

export function panoramaRenovacoes(b: Base, cat: Catalogo, agora = new Date(), alertasDias: number[] = [5]): LinhaRenovacao[] {
  const limite = Math.max(...alertasDias, 0);
  return b.clientes.filter((c) => c.status === "ativo").map((c): LinhaRenovacao => {
    const contato = b.contatos.find((x) => x.id === c.contact_id);
    const servico = cat.servicos.find((s) => s.id === c.service_id);
    const contrato = b.contratos.filter((k) => k.client_id === c.id && k.status === "ativo").sort((a, z) => z.inicio.localeCompare(a.inicio))[0];
    const pacote = pacoteDoCliente(b, c.id);
    const dias = c.renewal_date ? Math.ceil(diasEntre(agora, c.renewal_date)) : null;
    const aguardandoAte = b.tarefas.filter((t) => t.client_id === c.id && t.tipo === "renovacao" && !t.completed_at && new Date(t.due_at) > agora).map((t) => t.due_at).sort().at(-1) ?? null;
    const desde = c.renewal_date && dias != null && dias < 0 ? `${c.renewal_date}T00:00:00.000Z` : c.first_purchase_at;
    const cobrancas = b.atividades.filter((a) => a.client_id === c.id && a.tipo === "message" && String((a.metadata as { grupo?: string })?.grupo ?? "").startsWith("renovacao") && a.ocorreu_em >= desde).length;
    const faixa: FaixaRenovacao = pacote ? (pacote.usadas >= pacote.contratadas ? "pacote_fim" : "pacote")
      : dias == null ? "sem_data" : dias < 0 ? "vencida" : dias <= 7 ? "semana" : dias <= 30 ? "mes" : "depois";
    const grupo = faixa === "pacote_fim" ? "renovacao_pacote" : faixa === "vencida" ? "renovacao_vencida"
      : (faixa === "semana" || faixa === "mes") && dias != null && dias <= limite ? "renovacao_proxima" : null;
    return {
      clientId: c.id, contactId: c.contact_id, nome: contato?.nome ?? "—", telefone: contato?.telefone_e164 ?? null,
      servico: servico?.nome ?? "—", servicoCode: servico?.code ?? null,
      plano: cat.planos.find((p) => p.id === (contrato?.plan_id ?? c.current_plan_id))?.nome ?? "—",
      valor: contrato?.valor ?? null, cicloMeses: contrato?.ciclo_meses ?? null,
      renewalDate: c.renewal_date, dias, pacote, faixa, cobrancas, aguardandoAte, grupo,
      decidir: !!grupo && cobrancas >= MAX_FOLLOW_UPS,
    };
  }).sort((a, z) => FAIXAS.findIndex((f) => f.id === a.faixa) - FAIXAS.findIndex((f) => f.id === z.faixa)
    || (a.dias ?? 1e9) - (z.dias ?? 1e9)
    || (z.pacote ? z.pacote.usadas / z.pacote.contratadas : 0) - (a.pacote ? a.pacote.usadas / a.pacote.contratadas : 0));
}
