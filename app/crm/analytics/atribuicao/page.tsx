import { exigirUsuario } from "@/lib/crm/auth";
import { base, catalogo } from "@/lib/crm/dados";
import { atribuicaoPorModelo } from "@/lib/crm/analise";
import AnalyticsNav from "@/components/crm/AnalyticsNav";
import { Aviso, Card, Pagina, Stat, Tabela, brl, pct } from "@/components/crm/ui";

export default async function Atribuicao({ searchParams }: { searchParams: Promise<{ modelo?: string }> }) {
  await exigirUsuario();
  const modelo = (await searchParams).modelo ?? "leadCreationTouch";
  const [b, cat] = await Promise.all([base(), catalogo()]);
  const a = atribuicaoPorModelo(b, cat);
  const baseline = cat.config.tracking_baseline?.data as string | null;
  const dados = a.res[modelo] ?? {};
  const linhas = Object.entries(dados).sort((x, y) => y[1].receita - x[1].receita || y[1].vendas - x[1].vendas);
  const nomes: Record<string, string> = { firstTouch: "First touch", leadCreationTouch: "Lead creation", lastNonDirect: "Last non-direct", assisted: "Assistidos" };
  const antes = b.clientes.filter((c) => baseline && c.first_purchase_at < baseline), depois = b.clientes.filter((c) => !baseline || c.first_purchase_at >= baseline);
  const cob = (xs: typeof b.clientes) => xs.length ? xs.filter((c) => c.source_code !== "unknown").length / xs.length : null;
  return (
    <Pagina titulo="Atribuição" sub="Atribuição é modelo, não verdade única. Escolha a perspectiva e leia com o rótulo.">
      <AnalyticsNav atual="/crm/analytics/atribuicao" />
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat rotulo="Cobertura de atribuição" valor={pct(a.cobertura)} sub="vendas com origem conhecida" />
        <Stat rotulo="Cobertura por receita" valor={pct(a.coberturaReceita)} />
        <Stat rotulo="Antes da baseline" valor={pct(cob(antes))} sub={baseline ? `${antes.length} clientes até ${baseline}` : "baseline não definida"} />
        <Stat rotulo="Depois da baseline" valor={pct(cob(depois))} sub={`${depois.length} clientes`} />
      </div>
      {!baseline && <div className="mb-4"><Aviso tom="alerta">Defina a data de baseline do tracking em Configurações. Antes dela, origem é histórica/declarada; depois, capturada pelo site.</Aviso></div>}
      <div className="mb-3 flex flex-wrap gap-1">{Object.entries(nomes).map(([k, n]) => <a key={k} href={`/crm/analytics/atribuicao?modelo=${k}`} className={`rounded-full px-3 py-1 text-xs ${k === modelo ? "bg-white text-black" : "border border-white/15 text-zinc-300"}`}>{n}</a>)}</div>
      <Card titulo={`Modelo: ${nomes[modelo] ?? modelo}`}>
        <Tabela cabecalho={["Origem", "Leads", "Vendas", "Receita realizada"]} linhas={linhas.map(([k, v]) => [a.nome(k), v.leads, v.vendas, brl(v.receita)])} vazio="Sem toques registrados." />
        <p className="mt-2 text-xs text-zinc-500">Unknown continua unknown em todos os modelos. Direto não apaga o papel dos outros toques.</p>
      </Card>
    </Pagina>
  );
}
