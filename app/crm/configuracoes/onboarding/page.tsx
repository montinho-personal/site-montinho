import { exigirUsuario } from "@/lib/crm/auth";
import { catalogo } from "@/lib/crm/dados";
import { baseOnboarding, versaoVigente } from "@/lib/crm/onboarding-dados";
import { VARIAVEIS_ONBOARDING, type EtapaDef, type DefinicaoFluxo } from "@/lib/crm/onboarding-fluxo";
import { Aviso, Badge, Btn, Campo, Card, Detalhes, Input, Pagina, Select, Textarea, dataHoraBr } from "@/components/crm/ui";
import {
  alternarModelo, definirModeloPadrao, duplicarModelo, excluirEtapaModelo, excluirFaseModelo, moverEtapaModelo, publicarVersaoPadrao,
  salvarEtapaModelo, salvarFaseModelo, salvarModelo,
} from "@/app/crm/onboarding/actions";

/**
 * Configurações → Modelos de onboarding. Cada salvamento publica uma versão
 * nova e imutável: quem já começou continua na versão em que nasceu, e só
 * muda por ação explícita na tela do aluno, com prévia do impacto.
 */
const rotuloPrazo = (e: EtapaDef, def: DefinicaoFluxo) => {
  const p = e.prazo;
  if (p.tipo === "inicio") return p.dias ? `D+${p.dias} do início` : "no dia do início";
  if (p.tipo === "apos_etapa") return `${p.dias ? `${p.dias} dia(s)` : "no dia"} após “${def.etapas.find((x) => x.key === p.etapa)?.nome ?? p.etapa}”`;
  return p.tipo === "manual" ? "data manual" : "sem prazo";
};

function FormEtapa({ templateId, def, e }: { templateId: string; def: DefinicaoFluxo; e?: EtapaDef }) {
  const outras = def.etapas.filter((x) => x.key !== e?.key);
  const comPergunta = outras.filter((x) => x.condicao);
  return (
    <form action={salvarEtapaModelo} className="grid gap-2 sm:grid-cols-2">
      <input type="hidden" name="template_id" value={templateId} />
      {e && <input type="hidden" name="key_antiga" value={e.key} />}
      <Campo rotulo="Nome"><Input name="nome" defaultValue={e?.nome} required /></Campo>
      <Campo rotulo="Chave" dica="Identificador interno, sem espaço. Vazio = gerado do nome."><Input name="key" defaultValue={e?.key} pattern="[a-z0-9_]{2,40}" /></Campo>
      <Campo rotulo="Fase"><Select name="fase" defaultValue={e?.fase}>{def.fases.map((f) => <option key={f.key} value={f.key}>{f.nome}</option>)}</Select></Campo>
      <Campo rotulo="Posição"><Input name="ordem" inputMode="numeric" defaultValue={e?.ordem ?? def.etapas.length + 1} /></Campo>
      <Campo rotulo="Descrição"><Textarea name="descricao" defaultValue={e?.descricao} /></Campo>
      <Campo rotulo="Instrução interna"><Textarea name="instrucoes" defaultValue={e?.instrucoes} /></Campo>
      <Campo rotulo="Prazo">
        <div className="flex gap-2">
          <Select name="prazo_tipo" defaultValue={e?.prazo.tipo ?? "inicio"}><option value="inicio">Dias após o início</option><option value="apos_etapa">Dias após outra etapa</option><option value="manual">Data manual</option><option value="sem_prazo">Sem prazo</option></Select>
          <Input name="prazo_dias" inputMode="numeric" className="!w-20" defaultValue={e && "dias" in e.prazo ? e.prazo.dias : 0} />
        </div>
      </Campo>
      <Campo rotulo="Etapa de referência do prazo"><Select name="prazo_etapa" defaultValue={e?.prazo.tipo === "apos_etapa" ? e.prazo.etapa : ""}><option value="">—</option>{outras.map((x) => <option key={x.key} value={x.key}>{x.nome}</option>)}</Select></Campo>
      <Campo rotulo="Depende de" dica="Chaves separadas por vírgula."><Input name="depende_de" defaultValue={e?.depende_de.join(", ")} /></Campo>
      <Campo rotulo="Atalho"><Select name="acao" defaultValue={e?.acao ?? ""}><option value="">Nenhum</option><option value="whatsapp">Mensagem no WhatsApp</option><option value="cliente">Com o aluno</option><option value="dados">Análise</option></Select></Campo>
      <Campo rotulo="Pergunta desta etapa (opcional)"><Input name="condicao_pergunta" defaultValue={e?.condicao?.pergunta ?? ""} placeholder="O aluno já tem avaliação física?" /></Campo>
      <Campo rotulo="Respostas" dica="Uma por linha: valor=Rótulo"><Textarea name="condicao_opcoes" defaultValue={e?.condicao?.opcoes.map((o) => `${o.valor}=${o.rotulo}`).join("\n") ?? ""} /></Campo>
      <Campo rotulo="Não aplicável se a resposta for"><Input name="na_se" defaultValue={e?.na_se ?? ""} placeholder="nao" /></Campo>
      <Campo rotulo="Só existe se a etapa…"><div className="flex gap-2"><Select name="ativar_etapa" defaultValue={e?.ativar_se?.etapa ?? ""}><option value="">sempre existe</option>{comPergunta.map((x) => <option key={x.key} value={x.key}>{x.nome}</option>)}</Select><Input name="ativar_valor" placeholder="valor" className="!w-24" defaultValue={e?.ativar_se?.valor ?? ""} /></div></Campo>
      <Campo rotulo="Mensagem de WhatsApp" dica={`Variáveis: ${VARIAVEIS_ONBOARDING.map((v) => `{${v}}`).join(" ")}`}><Textarea name="mensagem" defaultValue={e?.mensagem ?? ""} /></Campo>
      <Campo rotulo="Materiais" dica="Um por linha: Rótulo|https://link"><Textarea name="materiais" defaultValue={e?.materiais.map((m) => `${m.rotulo}|${m.url}`).join("\n") ?? ""} /></Campo>
      <div className="space-y-1 text-sm sm:col-span-2">
        <label className="mr-4 inline-flex gap-2"><input type="checkbox" name="obrigatoria" defaultChecked={e?.obrigatoria ?? true} /> Obrigatória</label>
        <label className="mr-4 inline-flex gap-2"><input type="checkbox" name="avisar" defaultChecked={e?.avisar ?? true} /> Avisar no sino</label>
        <label className="mr-4 inline-flex gap-2"><input type="checkbox" name="lembrete_no_dia" defaultChecked={e?.lembrete.no_dia ?? true} /> No dia</label>
        <label className="mr-4 inline-flex gap-2"><input type="checkbox" name="lembrete_dia_antes" defaultChecked={e?.lembrete.dia_antes ?? false} /> Um dia antes</label>
        <label className="mr-4 inline-flex gap-2"><input type="checkbox" name="lembrete_atraso" defaultChecked={e?.lembrete.atraso ?? true} /> Quando atrasar</label>
        <label className="inline-flex items-center gap-2">repetir a cada <Input name="lembrete_repetir" className="!w-16 !py-1" defaultValue={e?.lembrete.repetir_dias ?? 2} /> dias</label>
      </div>
      <Btn pequeno className="sm:col-span-2">{e ? "Salvar e publicar nova versão" : "Adicionar etapa e publicar"}</Btn>
    </form>
  );
}

export default async function ModelosOnboarding() {
  const u = await exigirUsuario();
  const [bo, cat] = await Promise.all([baseOnboarding(), catalogo()]);
  const admin = u.role === "admin";
  return (
    <Pagina titulo="Modelos de onboarding" sub="Editar aqui vale para os próximos alunos. Quem já começou só muda por ação sua, na tela do aluno.">
      {!admin && <div className="mb-4"><Aviso>Só administrador edita modelos.</Aviso></div>}
      <div className="space-y-4">
        {bo.templates.map((t) => {
          const v = versaoVigente(bo, t.id); const def = v?.definicao ?? { fases: [], etapas: [] };
          const emUso = bo.onboardings.filter((o) => o.template_id === t.id && (o.status === "em_andamento" || o.status === "pausado"));
          const antigos = emUso.filter((o) => o.version_id !== v?.id).length;
          const historico = bo.versoes.filter((x) => x.template_id === t.id).sort((a, z) => z.versao - a.versao);
          return (
            <Card key={t.id} titulo={<>{t.nome} {t.padrao && <Badge tom="info">padrão</Badge>} {!t.ativo && <Badge>inativo</Badge>}</>} acao={<span className="text-xs text-zinc-500">v{v?.versao ?? 0} · {emUso.length} em uso{antigos ? ` (${antigos} em versão antiga)` : ""}</span>}>
              {t.descricao && <p className="mb-2 text-sm text-zinc-400">{t.descricao}</p>}
              <p className="mb-3 text-xs text-zinc-500">Aplica-se a: {t.plan_id ? `plano ${cat.planos.find((p) => p.id === t.plan_id)?.nome}` : t.service_id ? `serviço ${cat.servicos.find((s) => s.id === t.service_id)?.nome}` : "qualquer serviço (quando nenhum modelo mais específico existir)"}</p>
              {!v && admin && t.padrao && <form action={publicarVersaoPadrao} className="mb-3"><Btn pequeno>Publicar o fluxo inicial (v1)</Btn></form>}
              {def.fases.slice().sort((a, z) => a.ordem - z.ordem).map((f) => (
                <div key={f.key} className="mb-3">
                  <div className="mb-1 flex items-center justify-between text-sm font-semibold text-zinc-300">{f.ordem}. {f.nome}
                    {admin && <span className="flex gap-1">
                      <Detalhes titulo="renomear"><form action={salvarFaseModelo} className="flex gap-2"><input type="hidden" name="template_id" value={t.id} /><input type="hidden" name="key_antiga" value={f.key} /><Input name="nome" defaultValue={f.nome} /><Input name="ordem" defaultValue={f.ordem} className="!w-16" /><Btn pequeno tom="secundario">Salvar</Btn></form></Detalhes>
                      <form action={excluirFaseModelo}><input type="hidden" name="template_id" value={t.id} /><input type="hidden" name="key" value={f.key} /><Btn pequeno tom="ghost">excluir</Btn></form>
                    </span>}
                  </div>
                  <ol className="space-y-1">
                    {def.etapas.filter((e) => e.fase === f.key).sort((a, z) => a.ordem - z.ordem).map((e) => (
                      <li key={e.key} className="rounded-lg border border-white/10 bg-black/20 p-2 text-sm">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span>{e.ordem}. {e.nome} {!e.obrigatoria && <Badge>opcional</Badge>} {e.condicao && <Badge tom="info">pergunta</Badge>} {e.ativar_se && <Badge tom="alerta">só se {e.ativar_se.etapa} = {e.ativar_se.valor}</Badge>}</span>
                          <span className="text-xs text-zinc-500">{rotuloPrazo(e, def)}{e.depende_de.length ? ` · depende de ${e.depende_de.join(", ")}` : ""}</span>
                        </div>
                        {admin && <div className="mt-1 flex flex-wrap gap-1">
                          <form action={moverEtapaModelo}><input type="hidden" name="template_id" value={t.id} /><input type="hidden" name="key" value={e.key} /><input type="hidden" name="direcao" value="cima" /><Btn pequeno tom="ghost">↑</Btn></form>
                          <form action={moverEtapaModelo}><input type="hidden" name="template_id" value={t.id} /><input type="hidden" name="key" value={e.key} /><input type="hidden" name="direcao" value="baixo" /><Btn pequeno tom="ghost">↓</Btn></form>
                          <form action={excluirEtapaModelo}><input type="hidden" name="template_id" value={t.id} /><input type="hidden" name="key" value={e.key} /><Btn pequeno tom="ghost">excluir</Btn></form>
                          <Detalhes titulo="editar"><FormEtapa templateId={t.id} def={def} e={e} /></Detalhes>
                        </div>}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
              {admin && v && <div className="space-y-2">
                <Detalhes titulo="+ Nova etapa"><FormEtapa templateId={t.id} def={def} /></Detalhes>
                <Detalhes titulo="+ Nova fase"><form action={salvarFaseModelo} className="flex gap-2"><input type="hidden" name="template_id" value={t.id} /><Input name="nome" placeholder="Nome da fase" required /><Input name="ordem" placeholder="ordem" className="!w-20" /><Btn pequeno tom="secundario">Criar</Btn></form></Detalhes>
                <Detalhes titulo="Dados do modelo">
                  <form action={salvarModelo} className="grid gap-2 sm:grid-cols-2"><input type="hidden" name="template_id" value={t.id} />
                    <Campo rotulo="Nome"><Input name="nome" defaultValue={t.nome} required /></Campo>
                    <Campo rotulo="Descrição"><Input name="descricao" defaultValue={t.descricao ?? ""} /></Campo>
                    <Campo rotulo="Serviço"><Select name="service_id" defaultValue={t.service_id ?? ""}><option value="">Qualquer</option>{cat.servicos.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</Select></Campo>
                    <Campo rotulo="Plano"><Select name="plan_id" defaultValue={t.plan_id ?? ""}><option value="">Qualquer</option>{cat.planos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}</Select></Campo>
                    <Btn pequeno tom="secundario">Salvar</Btn>
                  </form>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <form action={duplicarModelo}><input type="hidden" name="template_id" value={t.id} /><Btn pequeno tom="secundario">Duplicar</Btn></form>
                    {!t.padrao && <form action={definirModeloPadrao}><input type="hidden" name="template_id" value={t.id} /><Btn pequeno tom="secundario">Tornar padrão</Btn></form>}
                    {!(t.padrao && t.ativo) && <form action={alternarModelo}><input type="hidden" name="template_id" value={t.id} /><Btn pequeno tom="ghost">{t.ativo ? "Desativar" : "Ativar"}</Btn></form>}
                  </div>
                </Detalhes>
                <Detalhes titulo={`Versões (${historico.length})`}><ul className="space-y-1 text-xs text-zinc-400">{historico.map((x) => <li key={x.id}>v{x.versao} · {dataHoraBr(x.created_at)} · {x.nota ?? ""}</li>)}</ul></Detalhes>
              </div>}
            </Card>
          );
        })}
        {admin && <Card titulo="Novo modelo">
          <form action={salvarModelo} className="grid gap-2 sm:grid-cols-2">
            <Campo rotulo="Nome"><Input name="nome" required placeholder="Onboarding presencial" /></Campo>
            <Campo rotulo="Descrição"><Input name="descricao" /></Campo>
            <Campo rotulo="Serviço"><Select name="service_id" defaultValue=""><option value="">Qualquer</option>{cat.servicos.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</Select></Campo>
            <Campo rotulo="Plano"><Select name="plan_id" defaultValue=""><option value="">Qualquer</option>{cat.planos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}</Select></Campo>
            <Btn pequeno tom="secundario">Criar modelo vazio</Btn>
          </form>
          <p className="mt-2 text-xs text-zinc-500">Para partir do fluxo padrão, use “Duplicar” no modelo padrão e ajuste a cópia.</p>
        </Card>}
      </div>
    </Pagina>
  );
}
