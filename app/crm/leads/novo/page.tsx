import { exigirEscrita } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { Btn, Campo, Card, Input, Pagina, Select, Textarea, dataHoraInput } from "@/components/crm/ui";
import { criarLead } from "../../actions";
import OrigemLead from "@/components/crm/OrigemLead";

export default async function NovoLead({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await exigirEscrita();
  const sp = await searchParams;
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const clientes = b.clientes.map((c) => ({ id: c.contact_id, nome: b.contatos.find((x) => x.id === c.contact_id)?.nome ?? "" })).sort((a, c) => a.nome.localeCompare(c.nome));
  return (
    <Pagina titulo="Novo lead" sub="Quem é, o que quer, de onde veio. Próxima ação é obrigatória.">
      <form action={criarLead} className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <Card titulo="Quem é">
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo rotulo="Nome *"><Input name="nome" required autoFocus /></Campo>
              <Campo rotulo="WhatsApp / telefone"><Input name="telefone" inputMode="tel" placeholder="(11) 9…" /></Campo>
              <Campo rotulo="E-mail"><Input name="email" type="email" /></Campo>
              <Campo rotulo="Instagram"><Input name="instagram" placeholder="@" /></Campo>
              <Campo rotulo="Cidade / bairro"><Input name="cidade" /></Campo>
            </div>
          </Card>
          <Card titulo="O que quer">
            <div className="grid gap-3 sm:grid-cols-2">
              <Campo rotulo="Serviço"><Select name="service_id" defaultValue={cat.servicos.find((s) => s.code === "presencial")?.id}>{cat.servicos.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</Select></Campo>
              <Campo rotulo="Valor potencial (R$/mês)"><Input name="expected_value" inputMode="decimal" /></Campo>
              <Campo rotulo="Interesse / objetivo declarado"><Textarea name="interesse" placeholder="Ex.: emagrecer, treinar 3x na Bluefit, horário 7h" /></Campo>
            </div>
          </Card>
          <Card titulo="De onde veio">
            <OrigemLead fontes={cat.fontes.map((f) => ({ code: f.code, nome: f.nome }))} refInicial={sp.ref?.toUpperCase() ?? ""} servicos={cat.servicos.map((s) => ({ id: s.id, code: s.code }))} />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Campo rotulo="Indicado por (aluno)"><Select name="referred_by_contact_id" defaultValue=""><option value="">—</option>{clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}</Select></Campo>
              <Campo rotulo='"Como conheceu?" (declarado)'><Input name="como_conheceu" placeholder="fallback, não substitui o rastreio" /></Campo>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card titulo="Próxima ação *">
            <div className="space-y-3">
              <Campo rotulo="O que fazer"><Input name="next_action" defaultValue="Primeiro contato" required /></Campo>
              <Campo rotulo="Quando"><Input name="next_action_at" type="datetime-local" defaultValue={dataHoraInput()} required /></Campo>
              <Campo rotulo="Lead chegou em (se for retroativo)"><Input name="created_at" type="datetime-local" /></Campo>
            </div>
          </Card>
          <Btn className="w-full">Criar lead</Btn>
        </div>
      </form>
    </Pagina>
  );
}
