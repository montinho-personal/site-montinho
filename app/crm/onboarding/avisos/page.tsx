import Link from "next/link";
import { exigirUsuario } from "@/lib/crm/auth";
import { painelOnboarding } from "@/lib/crm/onboarding-dados";
import { Btn, Pagina, Vazio, dataBr } from "@/components/crm/ui";
import { adiarAviso, dispensarAviso, lerAviso } from "../actions";

/**
 * Central de avisos. Ler, adiar ou dispensar mexe só no aviso: a tarefa
 * continua aberta até ser concluída na tela do aluno ou em Minhas tarefas.
 */
const ICONE = { atrasada: "🔴", hoje: "📌", amanha: "🗓", aguardando: "🟡", liberada: "🔓" } as const;

export default async function Avisos() {
  const u = await exigirUsuario();
  const { linhas } = await painelOnboarding();
  const avisos = linhas.flatMap((l) => l.avisos).sort((a, z) => Number(a.lido) - Number(z.lido) || ["atrasada", "hoje", "amanha", "liberada", "aguardando"].indexOf(a.tipo) - ["atrasada", "hoje", "amanha", "liberada", "aguardando"].indexOf(z.tipo));
  const ro = u.role === "readonly";
  const campos = (a: (typeof avisos)[number]) => <><input type="hidden" name="chave" value={a.chave} /><input type="hidden" name="onboarding_id" value={a.onboardingId} /><input type="hidden" name="task_id" value={a.tarefaId} /></>;
  return (
    <Pagina titulo="Avisos" sub="Marcar como lido não conclui a tarefa." acoes={<Btn href="/crm/onboarding/tarefas" tom="secundario" pequeno>Minhas tarefas</Btn>}>
      {!avisos.length ? <Vazio>Nenhum aviso agora.</Vazio> : (
        <ul className="space-y-2">
          {avisos.map((a) => (
            <li key={a.chave} className={`flex flex-wrap items-center gap-3 rounded-lg border p-3 ${a.lido ? "border-white/5 bg-black/10 text-zinc-400" : "border-white/15 bg-zinc-900/70"}`}>
              <div className="min-w-0 flex-1 basis-full sm:basis-0">
                <Link href={`/crm/onboarding/${a.onboardingId}#t-${a.tarefa.key}`} prefetch={false} className="hover:underline">{ICONE[a.tipo]} {a.texto}</Link>
                {a.prazo && <div className="text-xs text-zinc-500">prazo {dataBr(a.prazo)}</div>}
              </div>
              {!ro && <div className="flex flex-wrap gap-1">
                {!a.lido && <form action={lerAviso}>{campos(a)}<Btn pequeno tom="ghost">Lido</Btn></form>}
                <form action={adiarAviso}>{campos(a)}<input type="hidden" name="dias" value="1" /><Btn pequeno tom="ghost">Amanhã</Btn></form>
                <form action={adiarAviso}>{campos(a)}<input type="hidden" name="dias" value="3" /><Btn pequeno tom="ghost">3 dias</Btn></form>
                <form action={dispensarAviso}>{campos(a)}<Btn pequeno tom="ghost">Dispensar</Btn></form>
              </div>}
            </li>
          ))}
        </ul>
      )}
    </Pagina>
  );
}
