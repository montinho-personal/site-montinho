"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

const SIMULADORES = {
  emagrecimento: { href: "/ferramentas/simulador-emagrecimento", titulo: "Quanto tempo até a sua meta — e o que mais mudaria isso?", texto: "O Simulador de Emagrecimento desenha sua trajetória estimada semana a semana e deixa você comparar treino, passos e consistência. Leva cerca de 1 minuto.", botao: "Abrir o Simulador de Emagrecimento →" },
  massa: { href: "/ferramentas/simulador-ganho-massa-muscular", titulo: "Quanto tempo para chegar ao peso que você quer — e o que está limitando?", texto: "O Simulador de Ganho de Massa mostra como seu peso pode evoluir, compara três ritmos de ganho e aponta o gargalo pelas suas respostas. Leva cerca de 1 minuto.", botao: "Abrir o Simulador de Ganho de Massa →" },
  shape12: { href: "/ferramentas/meu-shape-12-semanas", titulo: "Quanto o seu corpo pode mudar em 12 semanas?", texto: "O Meu Shape em 12 Semanas projeta os seus checkpoints das semanas 4, 8 e 12, mostra os treinos que você acumularia e o que mais muda o resultado. Sem antes e depois inventado.", botao: "Simular minhas 12 semanas →" },
  fimDeSemana: { href: "/ferramentas/simulador-fim-de-semana", titulo: "E o seu fim de semana — quanto ele tira da sua semana?", texto: "O Simulador do Fim de Semana soma os seus sete dias, mostra quanto do déficit sobrou e testa o que mudaria com uma coisa só: menos bebidas, domingo parecido com a semana, voltar na próxima refeição. Não precisa saber calorias.", botao: "Simular meu fim de semana →" },
} as const;

/** Convite para um Simulador Montinho nos artigos que perguntam "quanto tempo, no meu caso?". */
export default function LinkFerramentaSimulador({ slug, qual = "emagrecimento" }: { slug: string; qual?: keyof typeof SIMULADORES }) {
  const s = SIMULADORES[qual];
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6" data-testid={`link-simulador-${qual}`}>
      <p className="text-white font-semibold mb-1.5">{s.titulo}</p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.texto}</p>
      <Link href={s.href} onClick={() => trackEvent("simulator_internal_tool_click", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]" style={{ textDecorationColor: "#BA9E50" }}>
        {s.botao}
      </Link>
    </div>
  );
}
