/**
 * Importação histórica de pessoas para o CRM (fase 2 do backfill).
 *
 * Lê um roster JSON consolidado FORA do repositório (o arquivo carrega nome,
 * telefone e e-mail de alunos — nunca entra no git) e emite SQL idempotente
 * para o Supabase: planos, contatos, leads, clientes, contratos, receitas,
 * experimentais, atividades de importação e uma linha em crm_imports por
 * fonte (Import Report).
 *
 * Uso: npx tsx scripts/crm-importar-pessoas.ts <roster.json> > import-pessoas.sql
 *
 * Regras que o script garante:
 *  - Origem de todo mundo é 'unknown' com confiança 'low'. Nada do que existe
 *    (planilha, cadastro, recibo, agenda) diz de onde a pessoa veio, e
 *    "desconhecido" é resposta válida. Não se inventa atribuição.
 *  - Receita só entra como 'collected'/'verified' quando há recibo. Cliente
 *    sem recibo entra com ZERO receita registrada; o LTV o exclui e a tela
 *    mostra a contagem de "importados sem receita".
 *  - Duplicata provável é MARCADA (possivel_duplicata_de), nunca mesclada.
 *  - Os ids são UUID v5 derivados do id do roster: rodar duas vezes não
 *    duplica nada (on conflict do nothing).
 *  - Nenhum dado de saúde é lido nem gravado.
 */
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

interface Receita { data: string; valor: number; taxa?: number; metodo: string; ref: string; tipo: "sale" | "renewal" | "monthly_payment" }
interface Trial { data: string; status: "agendada" | "realizada" | "no_show" | "cancelada"; outcome?: string }
interface Pessoa {
  id: string; nome: string; telefone?: string; email?: string;
  cliente?: { desde: string; status: "ativo" | "inativo" | "pausado" | "cancelado"; confianca: "verified" | "inferred"; servico?: "presencial" | "online"; plano?: string };
  lead?: { status: "aberto" | "ganho" | "perdido" | "inativo"; criado: string };
  receitas?: Receita[]; trials?: Trial[]; possivelDuplicataDe?: string; evidencias: string[]; observacoes?: string;
}
interface Roster { executadoEm: string; fontes: Record<string, string>; pessoas: Pessoa[] }

const NS = "6f1c1c1e-0b7a-4d2e-9a5f-crmmontinho0".replace(/[^0-9a-f-]/g, "0");
export function uuid5(nome: string): string {
  const h = createHash("sha1").update(NS + ":" + nome).digest("hex").slice(0, 32).split("");
  h[12] = "5"; h[16] = ["8", "9", "a", "b"][parseInt(h[16], 16) % 4];
  const s = h.join("");
  return `${s.slice(0, 8)}-${s.slice(8, 12)}-${s.slice(12, 16)}-${s.slice(16, 20)}-${s.slice(20)}`;
}
const q = (v: unknown) => v == null ? "null" : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`;
const j = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;

export function gerarSql(r: Roster): { sql: string; relatorio: Record<string, unknown> } {
  const out: string[] = [];
  const idsRoster = new Set(r.pessoas.map((p) => p.id));
  const ids = { contato: (p: Pessoa) => uuid5("contact:" + p.id), lead: (p: Pessoa) => uuid5("lead:" + p.id), cliente: (p: Pessoa) => uuid5("client:" + p.id), contrato: (p: Pessoa) => uuid5("contract:" + p.id) };
  const fonteDe = (ev: string) => ev.split(":")[0].trim();
  const contagem: Record<string, { registros: number; sucesso: number; duplicados: number; erros: number; nao_casados: number; itens: string[] }> = {};
  const conta = (fonte: string) => (contagem[fonte] ??= { registros: 0, sucesso: 0, duplicados: 0, erros: 0, nao_casados: 0, itens: [] });

  out.push("begin;");
  out.push(`-- Planos conhecidos. O presencial não tem tabela pública: valor vai por proposta.
insert into public.crm_plans (id, service_id, nome, tipo_cobranca, ciclo_meses, preco, descricao, ordem)
select ${q(uuid5("plan:online-mensal"))}, s.id, 'Consultoria online mensal', 'mensal', 1, 399, 'Valor visto nos recibos do Mercado Pago (jul–ago/2026).', 10 from public.crm_services s where s.code = 'online'
on conflict (id) do nothing;
insert into public.crm_plans (id, service_id, nome, tipo_cobranca, ciclo_meses, preco, descricao, ordem)
select ${q(uuid5("plan:presencial-proposta"))}, s.id, 'Presencial (valor por proposta)', 'mensal', 1, 0, 'Sem preço de tabela: o valor mensal fica entre R$ 800 e R$ 2.500 conforme frequência e local, e é definido na proposta.', 20 from public.crm_services s where s.code = 'presencial'
on conflict (id) do nothing;`);

  const importIds: Record<string, string> = {};
  for (const f of Object.keys(r.fontes)) importIds[f] = uuid5("import:pessoas:" + f + ":" + r.executadoEm);

  for (const p of r.pessoas) {
    const cid = ids.contato(p);
    const fontes = [...new Set(p.evidencias.map(fonteDe))];
    for (const f of fontes) { if (f === "mercadopago") continue; const c = conta(f); c.registros++; c.sucesso++; }
    if (p.possivelDuplicataDe) { const f = fonteDe(p.evidencias[0]); conta(f).duplicados++; conta(f).sucesso--; }
    const obs = [
      `Importado em ${r.executadoEm}. Evidências: ${p.evidencias.join("; ")}.`,
      p.cliente ? `Cliente ${p.cliente.confianca === "verified" ? "confirmado por recibo" : "inferido (sem recibo)"}.` : null,
      p.observacoes ?? null,
    ].filter(Boolean).join(" ");
    out.push(`insert into public.crm_contacts (id, nome, telefone, email, observacoes, created_at) values (${q(cid)}, ${q(p.nome)}, ${q(p.telefone ?? null)}, ${q(p.email ?? null)}, ${q(obs)}, ${q((p.cliente?.desde ?? p.lead?.criado ?? r.executadoEm) + "T12:00:00-03:00")}) on conflict (id) do nothing;`);

    const leadStatus = p.lead?.status ?? (p.cliente ? "ganho" : "inativo");
    const criado = (p.lead?.criado ?? p.cliente?.desde ?? r.executadoEm) + "T12:00:00-03:00";
    const servico = p.cliente?.servico ?? null;
    out.push(`insert into public.crm_leads (id, contact_id, service_id, status, source_code, attribution_confidence, last_contact_at, created_at) select ${q(ids.lead(p))}, ${q(cid)}, ${servico ? `(select id from public.crm_services where code = ${q(servico)})` : "null"}, ${q(leadStatus)}, 'unknown', 'low', ${q(criado)}, ${q(criado)} on conflict (id) do nothing;`);

    if (p.cliente) {
      const planId = p.cliente.plano === "Consultoria online mensal" ? uuid5("plan:online-mensal") : null;
      out.push(`insert into public.crm_clients (id, contact_id, first_purchase_at, status, service_id, current_plan_id, start_date, source_code, source_confidence, origem_registro, created_at) select ${q(ids.cliente(p))}, ${q(cid)}, ${q(p.cliente.desde)}, ${q(p.cliente.status)}, ${servico ? `(select id from public.crm_services where code = ${q(servico)})` : "null"}, ${q(planId)}, ${q(p.cliente.desde)}, 'unknown', 'low', 'import', ${q(criado)} on conflict (id) do nothing;`);
      if (planId && servico) {
        out.push(`insert into public.crm_contracts (id, client_id, service_id, plan_id, valor, ciclo_meses, inicio, status, created_at) select ${q(ids.contrato(p))}, ${q(ids.cliente(p))}, (select id from public.crm_services where code = ${q(servico)}), ${q(planId)}, 399, 1, ${q(p.cliente.desde)}, 'ativo', ${q(criado)} on conflict (id) do nothing;`);
      }
      for (const [i, rc] of (p.receitas ?? []).entries()) {
        const c = conta("mercadopago"); c.registros++; c.sucesso++;
        out.push(`insert into public.crm_revenue_events (id, client_id, contract_id, tipo, amount, occurred_at, status, service_id, plan_id, source_code, payment_method, external_ref, fee, confidence, import_id, created_at) select ${q(uuid5(`rev:${p.id}:${i}`))}, ${q(ids.cliente(p))}, ${planId && servico ? q(ids.contrato(p)) : "null"}, ${q(rc.tipo)}, ${rc.valor}, ${q(rc.data)}, 'collected', ${servico ? `(select id from public.crm_services where code = ${q(servico)})` : "null"}, ${q(planId)}, 'unknown', ${q(rc.metodo)}, ${q(rc.ref)}, ${q(rc.taxa ?? null)}, 'verified', ${q(importIds.mercadopago)}, ${q(rc.data + "T12:00:00-03:00")} on conflict (id) do nothing;`);
      }
      out.push(`insert into public.crm_activities (id, contact_id, lead_id, client_id, tipo, descricao, ocorreu_em, metadata) values (${q(uuid5("act:client:" + p.id))}, ${q(cid)}, ${q(ids.lead(p))}, ${q(ids.cliente(p))}, 'import', ${q(`Cliente importado (${p.cliente.confianca}). ${p.evidencias.join("; ")}`)}, ${q(criado)}, ${j({ confianca: p.cliente.confianca, fontes, import: Object.fromEntries(fontes.filter((f) => importIds[f]).map((f) => [f, importIds[f]])) })}) on conflict (id) do nothing;`);
    } else {
      out.push(`insert into public.crm_activities (id, contact_id, lead_id, tipo, descricao, ocorreu_em, metadata) values (${q(uuid5("act:lead:" + p.id))}, ${q(cid)}, ${q(ids.lead(p))}, 'import', ${q(`Lead importado. ${p.evidencias.join("; ")}`)}, ${q(criado)}, ${j({ fontes })}) on conflict (id) do nothing;`);
    }

    for (const [i, t] of (p.trials ?? []).entries()) {
      const c = conta("calendar"); c.registros++; c.sucesso++;
      out.push(`insert into public.crm_trials (id, contact_id, lead_id, scheduled_at, status, completed_at, outcome, origem_registro, created_at) values (${q(uuid5(`trial:${p.id}:${i}`))}, ${q(cid)}, ${q(ids.lead(p))}, ${q(t.data)}, ${q(t.status)}, ${t.status === "realizada" ? q(t.data) : "null"}, ${q(t.outcome ?? null)}, 'import_calendar', ${q(t.data)}) on conflict (id) do nothing;`);
    }
  }
  // Marcação de duplicata depois de todos os contatos existirem.
  for (const p of r.pessoas) {
    if (!p.possivelDuplicataDe) continue;
    if (!idsRoster.has(p.possivelDuplicataDe)) { conta(fonteDe(p.evidencias[0])).erros++; continue; }
    out.push(`update public.crm_contacts set possivel_duplicata_de = ${q(uuid5("contact:" + p.possivelDuplicataDe))} where id = ${q(ids.contato(p))} and possivel_duplicata_de is null;`);
  }

  const limitacoes: Record<string, string> = {
    drive: "A planilha diz quando o aluno começou a ser acompanhado (createdTime) e a última edição; não diz valor pago, plano nem origem. Aluno só com planilha entra como cliente inferido, sem receita.",
    anamnese: "Só nome, telefone/whatsapp, e-mail, status e data de cadastro foram lidos. Cadastro não prova pagamento: entra como cliente inferido, sem receita. Nomes repetidos viram marcação de duplicata, não mesclagem.",
    mercadopago: "Só e-mails 'Pagamento aprovado' localizados no Gmail. Pagamentos por Pix direto, dinheiro ou transferência não aparecem, então a receita importada é piso, não total. Serviço e plano só foram atribuídos quando o valor bate com plano conhecido (R$ 399 = consultoria online).",
    calendar: "Só eventos com título 'Aula experimental <nome>' no calendário principal. Presença é inferida quando a pessoa virou aluna depois; caso contrário fica 'agendada' sem desfecho.",
  };
  const relatorio: Record<string, unknown> = {};
  for (const [f, c] of Object.entries(contagem)) {
    if (!r.fontes[f]) continue; // evidência avulsa (site, google) não é fonte de importação
    relatorio[f] = { ...c, itens: undefined };
    const datas = r.pessoas.filter((p) => p.evidencias.some((e) => fonteDe(e) === f)).map((p) => p.cliente?.desde ?? p.lead?.criado ?? r.executadoEm).sort();
    out.push(`insert into public.crm_imports (id, fonte, executado_em, periodo_inicio, periodo_fim, registros, sucesso, duplicados, erros, nao_casados, limitacoes, relatorio) values (${q(importIds[f] ?? uuid5("import:pessoas:" + f + ":" + r.executadoEm))}, ${q(f)}, ${q(r.executadoEm + "T12:00:00-03:00")}, ${q(datas[0] ?? null)}, ${q(datas.at(-1) ?? null)}, ${c.registros}, ${c.sucesso}, ${c.duplicados}, ${c.erros}, ${c.nao_casados}, ${q(limitacoes[f] ?? null)}, ${j({ descricao: r.fontes[f], confianca: f === "mercadopago" ? "verified" : "inferred", pessoas: r.pessoas.filter((p) => p.evidencias.some((e) => fonteDe(e) === f)).length })}) on conflict (id) do nothing;`);
  }
  out.push("commit;");
  return { sql: out.join("\n"), relatorio };
}

if (process.argv[1]?.endsWith("crm-importar-pessoas.ts")) {
  const caminho = process.argv[2];
  if (!caminho) { console.error("uso: npx tsx scripts/crm-importar-pessoas.ts <roster.json>"); process.exit(1); }
  const r = JSON.parse(readFileSync(caminho, "utf8")) as Roster;
  const { sql, relatorio } = gerarSql(r);
  process.stdout.write(sql + "\n");
  console.error(JSON.stringify(relatorio, null, 2));
}
