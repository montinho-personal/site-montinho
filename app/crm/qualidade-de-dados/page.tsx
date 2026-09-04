import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { coberturaAtribuicao, possiveisDuplicatas } from "@/lib/crm/metricas";
import AnalyticsNav from "@/components/crm/AnalyticsNav";
import { Btn, Card, Pagina, Stat, Tabela, pct } from "@/components/crm/ui";
import { mesclarContatos, naoEhDuplicata } from "../actions";

export default async function Qualidade() {
  const u = await exigirUsuario();
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const abertos = b.leads.filter((l) => l.status === "aberto");
  const semOrigem = b.leads.filter((l) => l.source_code === "unknown");
  const semProxima = abertos.filter((l) => !l.next_action_at);
  const oppsAbertas = b.oportunidades.filter((o) => !o.won_at && !o.lost_at);
  const semValor = oppsAbertas.filter((o) => o.expected_value == null);
  const vendasSemFonte = b.clientes.filter((c) => c.source_code === "unknown");
  const dealsSemPlano = oppsAbertas.filter((o) => o.proposal_sent_at && !o.plan_id);
  const dup = possiveisDuplicatas(b.contatos.filter((c) => !c.anonimizado).map((c) => ({ id: c.id, telefoneE164: c.telefone_e164, email: c.email })));
  const marcados = b.contatos.filter((c) => c.possivel_duplicata_de);
  const utmInvalida = b.handoffs.filter((h) => h.utm_source && !h.utm_medium).length;
  const semTelefone = b.contatos.filter((c) => !c.telefone_e164 && !c.email && !c.anonimizado);
  const cob = coberturaAtribuicao(b.clientes.map((c) => ({ sourceCode: c.source_code })));
  const nome = (id: string) => b.contatos.find((c) => c.id === id)?.nome ?? id;
  const admin = u.role === "admin";
  return (
    <Pagina titulo="Qualidade dos dados" sub="Cobertura de atribuição sobe com correção, não com invenção.">
      <AnalyticsNav atual="/crm/qualidade-de-dados" />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <Stat rotulo="Cobertura de atribuição" valor={pct(cob)} sub="vendas com origem" />
        <Stat rotulo="Leads sem origem" valor={semOrigem.length} tom={semOrigem.length ? "alerta" : "bom"} />
        <Stat rotulo="Abertos sem próxima ação" valor={semProxima.length} tom={semProxima.length ? "ruim" : "bom"} />
        <Stat rotulo="Oportunidades sem valor" valor={semValor.length} />
        <Stat rotulo="Vendas sem fonte" valor={vendasSemFonte.length} tom={vendasSemFonte.length ? "alerta" : "bom"} />
        <Stat rotulo="Propostas sem plano" valor={dealsSemPlano.length} />
        <Stat rotulo="Possíveis duplicatas" valor={marcados.length + dup.length} tom={marcados.length ? "alerta" : "neutro"} />
        <Stat rotulo="UTMs incompletas" valor={utmInvalida} sub="source sem medium" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Leads abertos sem próxima ação"><Tabela cabecalho={["Lead", ""]} linhas={semProxima.map((l) => [nome(l.contact_id), <Btn key="b" href={`/crm/leads/${l.id}`} pequeno tom="secundario">Definir</Btn>])} vazio="Todos os leads abertos têm próxima ação." /></Card>
        <Card titulo="Leads com origem desconhecida"><Tabela cabecalho={["Lead", "Criado", ""]} linhas={semOrigem.slice(0, 50).map((l) => [nome(l.contact_id), new Date(l.created_at).toLocaleDateString("pt-BR"), <Btn key="b" href={`/crm/leads/${l.id}`} pequeno tom="secundario">Corrigir</Btn>])} vazio="Nenhum." /></Card>
        <Card titulo="Possíveis duplicatas (mesclar é decisão humana)">
          {marcados.length === 0 ? <p className="text-sm text-zinc-500">Nenhuma marcada pelo banco.</p> : marcados.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 py-2 text-sm">
              <span>{c.nome} ↔ {nome(c.possivel_duplicata_de!)}</span>
              <span className="flex gap-2">
                {admin && <form action={mesclarContatos}><input type="hidden" name="de_id" value={c.id} /><input type="hidden" name="para_id" value={c.possivel_duplicata_de!} /><Btn pequeno tom="secundario">Mesclar no mais antigo</Btn></form>}
                <form action={naoEhDuplicata}><input type="hidden" name="contact_id" value={c.id} /><Btn pequeno tom="ghost">Não é duplicata</Btn></form>
              </span>
            </div>
          ))}
        </Card>
        <Card titulo="Contatos sem telefone nem e-mail"><Tabela cabecalho={["Contato"]} linhas={semTelefone.slice(0, 30).map((c) => [<Link key="l" href={`/crm/leads?q=${encodeURIComponent(c.nome)}`} className="hover:underline">{c.nome}</Link>])} vazio="Nenhum." /></Card>
        <Card titulo="Vendas sem origem conhecida"><Tabela cabecalho={["Cliente", ""]} linhas={vendasSemFonte.map((c) => { const l = b.leads.find((x) => x.contact_id === c.contact_id); return [nome(c.contact_id), l ? <Btn key="b" href={`/crm/leads/${l.id}`} pequeno tom="secundario">Definir origem</Btn> : ""]; })} vazio="Todas as vendas têm origem." /></Card>
        <Card titulo="Fontes cadastradas"><p className="text-xs text-zinc-500">{cat.fontes.map((f) => f.code).join(" · ")}</p></Card>
      </div>
    </Pagina>
  );
}
