import Link from "next/link";
import { notFound } from "next/navigation";
import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo, urlWhatsAppContato } from "@/lib/crm/dados";
import { visaoLead } from "@/lib/crm/visao";
import { atribuir } from "@/lib/crm/metricas";
import { Aviso, Badge, Btn, Campo, Card, Detalhes, Input, Pagina, Select, Textarea, brl, dataHoraBr, dataHoraInput, dataInput, relativo } from "@/components/crm/ui";
import { agendarExperimental, atualizarContato, concluirTarefa, criarTarefa, definirOrigem, definirProximaAcao, enviarProposta, ligarHandoff, marcarExperimental, marcarGanho, marcarPerdido, moverEtapa, reativarLead, registrarAtividade } from "../../actions";

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const u = await exigirUsuario();
  const { id } = await params;
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const lead = b.leads.find((l) => l.id === id);
  if (!lead) notFound();
  const v = visaoLead(b, cat, lead); if (!v) notFound();
  const { contato, opp, etapa } = v;
  const etapasPipe = opp ? cat.etapas.filter((e) => e.pipeline_id === opp.pipeline_id) : [];
  const wa = urlWhatsAppContato(contato.telefone_e164);
  const toques = b.toques.filter((t) => t.contact_id === contato.id);
  const attr = atribuir(toques.map((t) => ({ occurredAt: t.occurred_at, sourceCode: t.source_code, campaign: t.campaign, content: t.content, confidence: t.confidence })), lead.created_at);
  const handoff = b.handoffs.find((h) => h.id === lead.handoff_id);
  const candidatos = !handoff ? b.handoffs.filter((h) => !h.contact_id && Math.abs(new Date(h.created_at).getTime() - new Date(lead.created_at).getTime()) < 3 * 86400000).slice(0, 5) : [];
  const templates = cat.templates.filter((t) => t.ativo);
  const nomeFonte = (c: string) => cat.fontes.find((f) => f.code === c)?.nome ?? c;
  const planosDoServico = (sid: string | null) => cat.planos.filter((p) => p.ativo && (!sid || p.service_id === sid));
  const somenteLeitura = u.role === "readonly";
  const trialsAbertas = v.experimentais.filter((t) => t.status === "agendada");

  return (
    <Pagina titulo={contato.nome} sub={<span>{v.servicoNome} · {v.fonteNome} <Badge tom={lead.attribution_confidence === "high" ? "bom" : lead.attribution_confidence === "medium" ? "info" : "alerta"}>confiança {lead.attribution_confidence}</Badge> · lead {relativo(lead.created_at)}</span>}
      acoes={<>{wa && <Btn href={wa} tom="whatsapp" target="_blank">Abrir WhatsApp</Btn>}{v.cliente && <Btn href={`/crm/clientes/${v.cliente.id}`} tom="secundario">Ficha de cliente</Btn>}</>}>
      {contato.possivel_duplicata_de && <div className="mb-4"><Aviso tom="alerta">Possível duplicata de outro contato. <Link href="/crm/qualidade-de-dados" className="underline">Revisar na qualidade de dados</Link>.</Aviso></div>}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Situação */}
          <Card titulo="Situação">
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div><div className="text-xs text-zinc-500">Etapa</div><div className="font-medium">{etapa?.nome ?? "—"}</div></div>
              <div><div className="text-xs text-zinc-500">Temperatura</div><Badge tom={v.temperatura}>{v.temperatura}</Badge><div className="mt-1 text-xs text-zinc-500">{v.motivos.join(" · ") || "sem sinais ainda"}</div></div>
              <div><div className="text-xs text-zinc-500">Valor potencial</div><div className="font-medium">{opp?.expected_value ? `${brl(opp.expected_value)}/mês` : "—"}</div></div>
              <div><div className="text-xs text-zinc-500">Último contato</div><div className="font-medium">{lead.last_contact_at ? relativo(lead.last_contact_at) : "nunca"}</div></div>
            </div>
            {lead.status === "aberto" && (
              <form action={definirProximaAcao} className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                <input type="hidden" name="lead_id" value={lead.id} />
                <Input name="next_action" defaultValue={lead.next_action ?? ""} placeholder="Próxima ação" required />
                <Input name="next_action_at" type="datetime-local" defaultValue={lead.next_action_at ? dataHoraInput(new Date(lead.next_action_at)) : ""} required />
                <Btn tom="secundario">Salvar</Btn>
              </form>
            )}
            {lead.status === "aberto" && !lead.next_action_at && <p className="mt-2 text-sm text-amber-300">Este lead está sem próxima ação. Defina uma.</p>}
            {lead.status !== "aberto" && <div className="mt-3 flex items-center gap-3 text-sm"><Badge tom={lead.status === "ganho" ? "bom" : "ruim"}>{lead.status}</Badge>{lead.status === "perdido" && <span className="text-zinc-400">Motivo: {cat.motivos.find((m) => m.code === lead.lost_reason_code)?.nome ?? lead.lost_reason_code} {lead.lost_reason_text}</span>}{lead.status === "perdido" && !somenteLeitura && <form action={reativarLead}><input type="hidden" name="lead_id" value={lead.id} /><Btn tom="secundario" pequeno>Reativar</Btn></form>}</div>}
          </Card>

          {/* Quick actions */}
          {lead.status === "aberto" && !somenteLeitura && (
            <Card titulo="Ações rápidas">
              <div className="grid gap-3 md:grid-cols-2">
                <Detalhes titulo="Registrar contato / nota" aberto>
                  <form action={registrarAtividade} className="space-y-2">
                    <input type="hidden" name="lead_id" value={lead.id} /><input type="hidden" name="contact_id" value={contato.id} />
                    <div className="grid grid-cols-2 gap-2">
                      <Select name="tipo" defaultValue="message"><option value="message">Mensagem trocada</option><option value="call">Ligação</option><option value="meeting">Encontro</option><option value="follow_up">Follow-up feito</option><option value="whatsapp_open">Abri o WhatsApp (sem resposta)</option><option value="note">Nota interna</option></Select>
                      <Input name="ocorreu_em" type="datetime-local" defaultValue={dataHoraInput()} />
                    </div>
                    <Textarea name="descricao" placeholder="O que aconteceu? (sem dados de saúde)" />
                    <div className="grid grid-cols-2 gap-2"><Input name="next_action" placeholder="Próxima ação (opcional)" /><Input name="next_action_at" type="datetime-local" /></div>
                    <Btn pequeno>Registrar</Btn>
                  </form>
                </Detalhes>
                <Detalhes titulo="Agendar follow-up (tarefa)">
                  <form action={criarTarefa} className="space-y-2">
                    <input type="hidden" name="lead_id" value={lead.id} /><input type="hidden" name="contact_id" value={contato.id} />
                    <Input name="titulo" placeholder="Ex.: Follow-up da proposta" required />
                    <div className="grid grid-cols-2 gap-2"><Input name="due_at" type="datetime-local" required defaultValue={dataHoraInput(new Date(Date.now() + 86400000))} /><Select name="priority" defaultValue="media"><option value="alta">Alta</option><option value="media">Média</option><option value="baixa">Baixa</option></Select></div>
                    <Btn pequeno>Criar tarefa</Btn>
                  </form>
                </Detalhes>
                {opp && (
                  <Detalhes titulo="Mover etapa">
                    <form action={moverEtapa} className="flex gap-2">
                      <input type="hidden" name="opportunity_id" value={opp.id} />
                      <Select name="stage_code" defaultValue={etapa?.code}>{etapasPipe.filter((e) => e.tipo === "open").map((e) => <option key={e.id} value={e.code}>{e.nome}</option>)}</Select>
                      <Btn pequeno tom="secundario">Mover</Btn>
                    </form>
                    <p className="mt-2 text-xs text-zinc-500">Ganho e perdido têm formulário próprio, com os campos obrigatórios.</p>
                  </Detalhes>
                )}
                <Detalhes titulo="Marcar aula experimental">
                  {trialsAbertas.length > 0 && trialsAbertas.map((t) => (
                    <form key={t.id} action={marcarExperimental} className="mb-3 rounded border border-white/10 p-2 text-sm">
                      <input type="hidden" name="trial_id" value={t.id} />
                      <div className="mb-2">Agendada para <strong>{dataHoraBr(t.scheduled_at)}</strong>{t.local ? ` · ${t.local}` : ""}</div>
                      <Input name="outcome" placeholder="Como foi? (opcional)" className="mb-2" />
                      <div className="flex flex-wrap gap-2"><Btn pequeno name="status" value="realizada">Realizada</Btn><Btn pequeno tom="perigo" name="status" value="no_show">No-show</Btn><Btn pequeno tom="ghost" name="status" value="cancelada">Cancelada</Btn></div>
                    </form>
                  ))}
                  <form action={agendarExperimental} className="space-y-2">
                    <input type="hidden" name="lead_id" value={lead.id} />
                    <div className="grid grid-cols-2 gap-2"><Input name="scheduled_at" type="datetime-local" required /><Input name="local" placeholder="Local (academia, condomínio)" /></div>
                    <Btn pequeno tom="secundario">Agendar experimental</Btn>
                  </form>
                </Detalhes>
                {opp && (
                  <Detalhes titulo="Enviar proposta">
                    <form action={enviarProposta} className="space-y-2">
                      <input type="hidden" name="opportunity_id" value={opp.id} />
                      <div className="grid grid-cols-2 gap-2">
                        <Select name="plan_id" defaultValue={opp.plan_id ?? ""}><option value="">Plano</option>{planosDoServico(opp.service_id).map((p) => <option key={p.id} value={p.id}>{p.nome} · {brl(p.preco)}</option>)}</Select>
                        <Input name="proposal_value" inputMode="decimal" placeholder="Valor proposto (R$)" defaultValue={opp.proposal_value ?? opp.expected_value ?? ""} />
                      </div>
                      <Btn pequeno>Proposta enviada</Btn>
                      <p className="text-xs text-zinc-500">Cria o follow-up automaticamente em {cat.config.sla?.proposta_sem_follow_up_dias ?? 2} dias.</p>
                    </form>
                  </Detalhes>
                )}
                {opp && (
                  <Detalhes titulo="Marcar GANHO">
                    <form action={marcarGanho} className="space-y-2">
                      <input type="hidden" name="opportunity_id" value={opp.id} />
                      <Campo rotulo="Serviço *"><Select name="service_id" defaultValue={opp.service_id ?? cat.servicos[0]?.id} required>{cat.servicos.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</Select></Campo>
                      <Campo rotulo="Plano *"><Select name="plan_id" defaultValue={opp.plan_id ?? ""} required><option value="">Escolha</option>{cat.planos.filter((p) => p.ativo).map((p) => <option key={p.id} value={p.id}>{p.nome} · {brl(p.preco)} · {p.tipo_cobranca}</option>)}</Select></Campo>
                      <div className="grid grid-cols-2 gap-2">
                        <Campo rotulo="Valor do ciclo (R$) *"><Input name="won_value" inputMode="decimal" required defaultValue={opp.proposal_value ?? ""} /></Campo>
                        <Campo rotulo="Ciclo (meses) *"><Input name="ciclo_meses" inputMode="numeric" defaultValue="1" required /></Campo>
                        <Campo rotulo="Data *"><Input name="won_at" type="date" defaultValue={dataInput()} required /></Campo>
                        <Campo rotulo="Forma de pagamento"><Select name="payment_method" defaultValue="pix"><option value="pix">Pix</option><option value="cartao">Cartão</option><option value="mercado_pago">Mercado Pago</option><option value="dinheiro">Dinheiro</option><option value="transferencia">Transferência</option></Select></Campo>
                      </div>
                      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="recebido" defaultChecked /> Primeiro pagamento já recebido</label>
                      <Btn pequeno>Confirmar venda</Btn>
                    </form>
                  </Detalhes>
                )}
                {opp && (
                  <Detalhes titulo="Marcar PERDIDO">
                    <form action={marcarPerdido} className="space-y-2">
                      <input type="hidden" name="opportunity_id" value={opp.id} />
                      <Select name="loss_reason_code" required defaultValue=""><option value="">Motivo *</option>{cat.motivos.map((m) => <option key={m.code} value={m.code}>{m.nome}</option>)}</Select>
                      <Input name="loss_reason_text" placeholder="Detalhe (opcional)" />
                      <Btn pequeno tom="perigo">Marcar perdido</Btn>
                    </form>
                  </Detalhes>
                )}
              </div>
            </Card>
          )}

          {/* Timeline */}
          <Card titulo="O que já aconteceu">
            {v.atividades.length === 0 ? <p className="text-sm text-zinc-500">Sem registros.</p> : (
              <ol className="space-y-2">
                {v.atividades.map((a) => (
                  <li key={a.id} className="flex gap-3 text-sm"><span className="w-28 shrink-0 text-xs text-zinc-500">{dataHoraBr(a.ocorreu_em)}</span><span><Badge>{a.tipo}</Badge> <span className="text-zinc-200">{a.descricao}</span></span></li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card titulo="Contato">
            <form action={atualizarContato} className="space-y-2">
              <input type="hidden" name="contact_id" value={contato.id} />
              <Input name="nome" defaultValue={contato.nome} />
              <Input name="telefone" defaultValue={contato.telefone ?? ""} placeholder="Telefone" />
              <Input name="email" defaultValue={contato.email ?? ""} placeholder="E-mail" />
              <div className="grid grid-cols-2 gap-2"><Input name="instagram" defaultValue={contato.instagram ?? ""} placeholder="@instagram" /><Input name="cidade" defaultValue={contato.cidade ?? ""} placeholder="Cidade" /></div>
              <Textarea name="observacoes" defaultValue={contato.observacoes ?? ""} placeholder="Observações comerciais (nunca saúde)" />
              {!somenteLeitura && <Btn pequeno tom="secundario">Salvar contato</Btn>}
            </form>
            {contato.telefone_e164 && <p className="mt-2 text-xs text-zinc-500">E.164: {contato.telefone_e164}</p>}
          </Card>

          <Card titulo="De onde veio">
            <ul className="space-y-1 text-sm">
              <li><span className="text-zinc-500">Origem do lead:</span> {v.fonteNome} {lead.source_detail ? `· ${lead.source_detail}` : ""}</li>
              <li><span className="text-zinc-500">First touch:</span> {attr.firstTouch ? `${nomeFonte(attr.firstTouch.sourceCode)} (${dataHoraBr(attr.firstTouch.occurredAt)})` : "—"}</li>
              <li><span className="text-zinc-500">Lead creation:</span> {attr.leadCreationTouch ? nomeFonte(attr.leadCreationTouch.sourceCode) : "—"}</li>
              <li><span className="text-zinc-500">Last non-direct:</span> {attr.lastNonDirect ? nomeFonte(attr.lastNonDirect.sourceCode) : "—"}</li>
              {attr.assisted.length > 0 && <li><span className="text-zinc-500">Assistidos:</span> {attr.assisted.map((t) => nomeFonte(t.sourceCode)).join(", ")}</li>}
              {lead.referred_by_contact_id && <li><span className="text-zinc-500">Indicado por:</span> {b.contatos.find((c) => c.id === lead.referred_by_contact_id)?.nome}</li>}
            </ul>
            {handoff && <div className="mt-2 rounded border border-white/10 p-2 text-xs text-zinc-400">Clique no site (ref {handoff.ref_code}, {dataHoraBr(handoff.created_at)}): {handoff.page_path}{handoff.cta_id ? ` · CTA ${handoff.cta_id}` : ""}{handoff.utm_campaign ? ` · ${handoff.utm_campaign}` : ""}{handoff.gclid ? " · gclid capturado" : ""}{handoff.ferramenta ? ` · ferramenta ${handoff.ferramenta}` : ""}</div>}
            {!somenteLeitura && (
              <details className="mt-3 text-sm"><summary className="cursor-pointer text-zinc-400">Corrigir origem / ligar clique do site</summary>
                <form action={definirOrigem} className="mt-2 space-y-2">
                  <input type="hidden" name="lead_id" value={lead.id} />
                  <Select name="source_code" defaultValue={lead.source_code}>{cat.fontes.map((f) => <option key={f.code} value={f.code}>{f.nome}</option>)}</Select>
                  <Input name="source_detail" placeholder="Detalhe" defaultValue={lead.source_detail ?? ""} />
                  <Select name="confidence" defaultValue="medium"><option value="high">Confiança alta (a pessoa disse / código)</option><option value="medium">Média (dedução)</option><option value="low">Baixa (palpite)</option></Select>
                  <Btn pequeno tom="secundario">Salvar origem</Btn>
                </form>
                <form action={ligarHandoff} className="mt-3 space-y-2">
                  <input type="hidden" name="lead_id" value={lead.id} />
                  <Input name="ref_code" placeholder="Código Ref da mensagem" className="uppercase" />
                  <Btn pequeno tom="secundario">Ligar pelo código</Btn>
                </form>
                {candidatos.length > 0 && <div className="mt-3 space-y-1"><p className="text-xs text-zinc-500">Cliques no site perto da data deste lead (ligação manual = confiança média):</p>{candidatos.map((h) => <form key={h.id} action={ligarHandoff} className="flex items-center justify-between gap-2 text-xs"><input type="hidden" name="lead_id" value={lead.id} /><input type="hidden" name="handoff_id" value={h.id} /><input type="hidden" name="confidence" value="medium" /><span>{dataHoraBr(h.created_at)} · {h.page_path} · {h.source_code}</span><Btn pequeno tom="ghost">Ligar</Btn></form>)}</div>}
              </details>
            )}
          </Card>

          {wa && templates.length > 0 && (
            <Card titulo="Mensagens sugeridas">
              <ul className="space-y-1 text-sm">{templates.map((t) => <li key={t.id}><a className="text-zinc-200 underline-offset-2 hover:underline" target="_blank" rel="noopener noreferrer" href={urlWhatsAppContato(contato.telefone_e164, t.corpo.replace(/\{nome\}/g, contato.nome.split(" ")[0]))!}>{t.titulo}</a></li>)}</ul>
              <p className="mt-2 text-xs text-zinc-500">Abre o WhatsApp com o texto para você editar. Nada é enviado sozinho.</p>
            </Card>
          )}

          <Card titulo="Tarefas">
            {v.tarefas.filter((t) => !t.completed_at).length === 0 ? <p className="text-sm text-zinc-500">Nenhuma tarefa aberta.</p> : v.tarefas.filter((t) => !t.completed_at).map((t) => (
              <form key={t.id} action={concluirTarefa} className="flex items-center justify-between gap-2 py-1 text-sm"><input type="hidden" name="task_id" value={t.id} /><span>{t.titulo} <span className="text-xs text-zinc-500">{relativo(t.due_at)}</span></span>{!somenteLeitura && <Btn pequeno tom="ghost">Feito</Btn>}</form>
            ))}
          </Card>
        </div>
      </div>
    </Pagina>
  );
}
