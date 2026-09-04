import { exigirUsuario } from "@/lib/crm/auth";
import { KPIS } from "@/lib/crm/kpis";
import { Pagina } from "@/components/crm/ui";

export default async function Dicionario() {
  await exigirUsuario();
  return (
    <Pagina titulo="Dicionário de métricas" sub="Uma definição por KPI. Toda tela calcula pela mesma função em lib/crm/metricas.ts.">
      <div className="space-y-3">
        {KPIS.map((k) => (
          <details key={k.id} className="rounded-xl border border-white/10 bg-zinc-900/70 p-3">
            <summary className="cursor-pointer font-medium">{k.nome}</summary>
            <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-[140px_1fr]">
              <dt className="text-zinc-500">Definição</dt><dd>{k.definicao}</dd>
              <dt className="text-zinc-500">Fórmula</dt><dd><code className="text-xs">{k.formula}</code></dd>
              <dt className="text-zinc-500">Fonte</dt><dd className="text-zinc-300">{k.fonte}</dd>
              <dt className="text-zinc-500">Base de data</dt><dd className="text-zinc-300">{k.baseDeData}</dd>
              {k.ressalvas && <><dt className="text-zinc-500">Ressalvas</dt><dd className="text-amber-100">{k.ressalvas}</dd></>}
              <dt className="text-zinc-500">Função</dt><dd><code className="text-xs">{k.funcao}</code></dd>
            </dl>
          </details>
        ))}
      </div>
    </Pagina>
  );
}
