import Link from "next/link";
import { outrosSimuladores, type Simulador } from "@/lib/simuladores";

/** Ao pé de cada simulador: os irmãos e a porta da família. */
export default function OutrosSimuladores({ atual }: { atual: Simulador["id"] }) {
  const outros = outrosSimuladores(atual);
  return (
    <div className="border border-white/15 p-5" data-testid="outros-simuladores">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>Outros Simuladores Montinho</p>
      <ul className="space-y-2">
        {outros.map((s) => (
          <li key={s.id}>
            <Link href={s.href} className="text-white underline underline-offset-4 decoration-1 decoration-white/30 hover:decoration-[#BA9E50] min-h-[44px] inline-flex items-center">
              {s.pergunta}? {s.nome} →
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/simuladores" className="text-gray-400 text-sm underline underline-offset-4 hover:text-white min-h-[44px] inline-flex items-center">Ver todos os simuladores</Link>
    </div>
  );
}
