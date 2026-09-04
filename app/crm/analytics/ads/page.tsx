import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo, historicoAquisicao } from "@/lib/crm/dados";
import { tabelaPorFonte } from "@/lib/crm/analise";
import AnalyticsNav from "@/components/crm/AnalyticsNav";
import { Aviso, Btn, Campo, Card, Input, Pagina, Select, Stat, Tabela, brl, dataInput, num } from "@/components/crm/ui";
import { registrarGasto } from "../../actions";

export default async function Ads() {
  const u = await exigirUsuario();
  const [b, cat, hist] = await Promise.all([base(), catalogo(), historicoAquisicao("google_ads")]);
  const de = new Date(Date.now() - 90 * 86400000);
  const fontes = tabelaPorFonte(b, cat, de, new Date()).filter((f) => ["google_ads", "instagram_ads", "facebook_ads"].includes(f.code));
  const gastos = [...b.gastos].sort((a, z) => z.data.localeCompare(a.data));
  const total = gastos.reduce((s, g) => s + Number(g.custo), 0);
  const comClick = b.handoffs.filter((h) => h.gclid || h.gbraid || h.wbraid).length;
  const vendasComClick = b.leads.filter((l) => l.status === "ganho" && b.handoffs.some((h) => h.lead_id === l.id && (h.gclid || h.gbraid || h.wbraid))).length;
  return (
    <Pagina titulo="Ads" sub="Google Ads (conta 644-775-2447) e Meta. Gasto entra manualmente ou por importação até a API estar autorizada.">
      <AnalyticsNav atual="/crm/analytics/ads" />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat rotulo="Gasto registrado" valor={brl(total)} sub={`${gastos.length} lançamentos`} />
        <Stat rotulo="Cliques com click id" valor={comClick} sub="gclid/gbraid/wbraid capturados no site" />
        <Stat rotulo="Vendas com click id" valor={vendasComClick} sub="prontas para offline conversion (fase 2)" />
        <Stat rotulo="Linhas históricas" valor={hist.length} sub="importadas (agregado)" />
      </div>
      <div className="mb-4"><Aviso>A tag de conversão do Google Ads não dispara hoje (acionador "Apenas links" no GTM). Enquanto isso, o CRM guarda o click id e a venda real; a importação de conversões offline é a fase 2, com consentimento e valor real.</Aviso></div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card titulo="Últimos 90 dias por canal pago"><Tabela cabecalho={["Canal", "Leads", "Vendas", "Gasto", "CAC mídia", "Receita", "ROAS"]} linhas={fontes.map((f) => [f.nome, f.leads, f.vendas, f.gasto == null ? "—" : brl(f.gasto), f.cac.valor != null ? brl(f.cac.valor) : <span key="c" className="text-xs text-zinc-500">{f.cac.motivo}</span>, brl(f.receita), f.roas != null ? `${f.roas.toFixed(1)}x` : "—"])} vazio="Sem canal pago com dado." /></Card>
        <Card titulo="Registrar gasto">
          {u.role === "readonly" ? <p className="text-sm text-zinc-500">Somente leitura.</p> : (
            <form action={registrarGasto} className="grid grid-cols-2 gap-2">
              <Campo rotulo="Canal"><Select name="canal" defaultValue="google_ads"><option value="google_ads">Google Ads</option><option value="meta_ads">Meta Ads</option><option value="other">Outro</option></Select></Campo>
              <Campo rotulo="Data"><Input name="data" type="date" defaultValue={dataInput()} /></Campo>
              <Campo rotulo="Campanha"><Input name="campanha" placeholder="Pesquisa | Personal Alphaville | Site" /></Campo>
              <Campo rotulo="Custo (R$)"><Input name="custo" inputMode="decimal" required /></Campo>
              <Campo rotulo="Cliques"><Input name="cliques" inputMode="numeric" /></Campo>
              <Campo rotulo="Impressões"><Input name="impressoes" inputMode="numeric" /></Campo>
              <Btn pequeno className="col-span-2">Registrar</Btn>
            </form>
          )}
        </Card>
      </div>
      <Card titulo="Lançamentos" className="mt-4"><Tabela cabecalho={["Data", "Canal", "Campanha", "Custo", "Cliques", "Impressões"]} linhas={gastos.slice(0, 60).map((g) => [g.data, g.canal, g.campanha ?? "—", brl(Number(g.custo)), num(g.cliques), num(g.impressoes)])} vazio="Nenhum gasto registrado." /></Card>
    </Pagina>
  );
}
