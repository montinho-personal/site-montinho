import { exigirUsuario } from "@/lib/crm/auth";
import { catalogo, importacoes } from "@/lib/crm/dados";
import { Aviso, Btn, Campo, Card, Detalhes, Input, Pagina, Select, Tabela, Textarea, brl, dataInput } from "@/components/crm/ui";
import { adicionarUsuario, definirBaseline, salvarConfig, salvarPlano, salvarTemplate } from "../actions";

export default async function Configuracoes() {
  const u = await exigirUsuario();
  const [cat, imps] = await Promise.all([catalogo(), importacoes()]);
  const admin = u.role === "admin";
  const tabelas = ["crm_contacts", "crm_leads", "crm_opportunities", "crm_clients", "crm_contracts", "crm_revenue_events", "crm_activities", "crm_tasks", "crm_trials", "crm_whatsapp_handoffs", "crm_attribution_touches", "crm_ad_spend", "crm_audit_log"];
  return (
    <Pagina titulo="Configurações" sub={`Você é ${u.role}. ${admin ? "" : "Alterações exigem administrador."}`}>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Serviços e planos">
          <Tabela cabecalho={["Serviço", "Plano", "Cobrança", "Ciclo", "Preço", "Ativo"]} linhas={cat.planos.map((p) => [cat.servicos.find((s) => s.id === p.service_id)?.nome, p.nome, p.tipo_cobranca, `${p.ciclo_meses} m`, brl(p.preco), p.ativo ? "sim" : "não"])} vazio="Nenhum plano cadastrado. Cadastre os planos reais antes de marcar vendas." />
          {admin && (
            <Detalhes titulo="Novo plano / editar">
              <form action={salvarPlano} className="grid grid-cols-2 gap-2">
                <Campo rotulo="Editar (id)"><Select name="id" defaultValue=""><option value="">Novo</option>{cat.planos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}</Select></Campo>
                <Campo rotulo="Serviço"><Select name="service_id">{cat.servicos.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</Select></Campo>
                <Campo rotulo="Nome"><Input name="nome" required /></Campo>
                <Campo rotulo="Cobrança"><Select name="tipo_cobranca" defaultValue="mensal"><option value="mensal">Mensal</option><option value="trimestral">Trimestral</option><option value="semestral">Semestral</option><option value="anual">Anual</option><option value="avulso">Avulso</option><option value="pacote">Pacote</option></Select></Campo>
                <Campo rotulo="Ciclo (meses)"><Input name="ciclo_meses" defaultValue="1" /></Campo>
                <Campo rotulo="Preço (R$)"><Input name="preco" inputMode="decimal" /></Campo>
                <Campo rotulo="Sessões/semana"><Input name="sessoes_por_semana" inputMode="numeric" /></Campo>
                <Campo rotulo="Descrição"><Input name="descricao" /></Campo>
                <Btn pequeno className="col-span-2">Salvar plano</Btn>
              </form>
            </Detalhes>
          )}
        </Card>
        <Card titulo="Baseline do tracking">
          <p className="text-sm text-zinc-300">{cat.config.tracking_baseline?.data ? <>A partir de <strong>{cat.config.tracking_baseline.data}</strong>: {cat.config.tracking_baseline.descricao}</> : "Ainda não definida. Defina a data do deploy do rastreamento (HandoffTracker no site)."}</p>
          {admin && <form action={definirBaseline} className="mt-3 flex gap-2"><Input name="data" type="date" defaultValue={cat.config.tracking_baseline?.data ?? dataInput()} /><Btn pequeno tom="secundario">Definir</Btn></form>}
        </Card>
        <Card titulo="Regras (SLA, reativação, renovação, scoring)">
          {["sla", "reativacao", "renovacao", "lead_scoring", "whatsapp"].map((k) => (
            <Detalhes key={k} titulo={k}>
              <form action={salvarConfig} className="space-y-2"><input type="hidden" name="key" value={k} /><Textarea name="value" defaultValue={JSON.stringify(cat.config[k] ?? {}, null, 2)} className="font-mono text-xs" />{admin && <Btn pequeno tom="secundario">Salvar</Btn>}</form>
            </Detalhes>
          ))}
        </Card>
        <Card titulo="Modelos de mensagem (sempre editáveis, nunca enviados sozinhos)">
          <ul className="space-y-1 text-sm">{cat.templates.map((t) => <li key={t.id}><strong>{t.titulo}</strong> <span className="text-zinc-400">— {t.corpo}</span></li>)}</ul>
          {admin && <Detalhes titulo="Novo / editar"><form action={salvarTemplate} className="space-y-2"><Select name="id" defaultValue=""><option value="">Novo</option>{cat.templates.map((t) => <option key={t.id} value={t.id}>{t.titulo}</option>)}</Select><Select name="tipo" defaultValue="follow_up">{["primeiro_contato", "follow_up", "pos_aula", "proposta", "lead_sumido", "reativacao", "renovacao", "indicacao", "outro"].map((x) => <option key={x} value={x}>{x}</option>)}</Select><Input name="titulo" placeholder="Título" required /><Textarea name="corpo" placeholder="Use {nome}" required /><Btn pequeno tom="secundario">Salvar</Btn></form></Detalhes>}
        </Card>
        <Card titulo="Usuários e permissões">
          <Tabela cabecalho={["E-mail", "Nome", "Papel"]} linhas={cat.usuarios.map((x) => [x.email, x.nome ?? "—", x.role])} />
          {admin && <form action={adicionarUsuario} className="mt-3 grid grid-cols-3 gap-2"><Input name="email" type="email" placeholder="e-mail" required /><Input name="nome" placeholder="nome" /><Select name="role" defaultValue="user"><option value="admin">admin</option><option value="user">user</option><option value="readonly">readonly</option></Select><Btn pequeno className="col-span-3" tom="secundario">Autorizar e-mail</Btn></form>}
          <p className="mt-2 text-xs text-zinc-500">Só e-mail autorizado consegue criar acesso. Recomendado: ative 2FA na conta de e-mail.</p>
        </Card>
        <Card titulo="Exportar (você é dono dos dados)">
          <div className="flex flex-wrap gap-2">{tabelas.map((t) => <Btn key={t} href={`/api/crm/export?tabela=${t}`} pequeno tom="secundario">{t.replace("crm_", "")}.csv</Btn>)}</div>
          <p className="mt-2 text-xs text-zinc-500">CSV completo da tabela, com a sua sessão. Backups do banco: diários e criptografados pelo Supabase (plano Pro).</p>
        </Card>
        <Card titulo="LGPD">
          <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
            <li>Finalidade: gestão comercial (leads, propostas, contratos, receita). Base legal: execução de contrato e legítimo interesse; marketing só com consentimento registrado no contato.</li>
            <li>Minimização: nome, telefone, e-mail, cidade, Instagram. Nenhum dado de saúde. Anamnese vive em outro sistema.</li>
            <li>Retenção: lead perdido sem contato por 24 meses → anonimizar. Cliente: enquanto durar a relação + 5 anos (obrigações fiscais).</li>
            <li>Direitos do titular: exportação (CSV acima) e exclusão/anonimização pela ficha (admin). Métricas agregadas preservadas.</li>
            <li>Segurança: RLS por usuário, auditoria de toda alteração, TLS, backups criptografados, CRM fora do índice do Google.</li>
          </ul>
        </Card>
        <Card titulo="Importações realizadas">
          <Tabela cabecalho={["Fonte", "Quando", "Período", "Registros", "Sucesso", "Dup.", "Erros", "Não casados", "Limitações"]} linhas={imps.map((i) => [i.fonte, new Date(i.executado_em).toLocaleDateString("pt-BR"), `${i.periodo_inicio ?? "?"} → ${i.periodo_fim ?? "?"}`, i.registros, i.sucesso, i.duplicados, i.erros, i.nao_casados, <span key="l" className="text-xs">{i.limitacoes}</span>])} vazio="Nenhuma." />
        </Card>
      </div>
      {!admin && <div className="mt-4"><Aviso>Peça ao administrador para alterar planos, regras e usuários.</Aviso></div>}
    </Pagina>
  );
}
