"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

const SIMULADORES = {
  emagrecimento: { href: "/ferramentas/simulador-emagrecimento", titulo: "Quanto tempo até a sua meta — e o que mais mudaria isso?", texto: "O Simulador de Emagrecimento desenha sua trajetória estimada semana a semana e deixa você comparar treino, passos e consistência. Leva cerca de 1 minuto.", botao: "Abrir o Simulador de Emagrecimento →" },
  massa: { href: "/ferramentas/simulador-ganho-massa-muscular", titulo: "Quanto tempo para chegar ao peso que você quer — e o que está limitando?", texto: "O Simulador de Ganho de Massa mostra como seu peso pode evoluir, compara três ritmos de ganho e aponta o gargalo pelas suas respostas. Leva cerca de 1 minuto.", botao: "Abrir o Simulador de Ganho de Massa →" },
  shape12: { href: "/ferramentas/meu-shape-12-semanas", titulo: "Quanto o seu corpo pode mudar em 12 semanas?", texto: "O Meu Shape em 12 Semanas projeta os seus checkpoints das semanas 4, 8 e 12, mostra os treinos que você acumularia e o que mais muda o resultado. Sem antes e depois inventado.", botao: "Simular minhas 12 semanas →" },
  fimDeSemana: { href: "/ferramentas/simulador-fim-de-semana", titulo: "E o seu fim de semana — quanto ele tira da sua semana?", texto: "O Simulador do Fim de Semana soma os seus sete dias, mostra quanto do déficit sobrou e testa o que mudaria com uma coisa só: menos bebidas, domingo parecido com a semana, voltar na próxima refeição. Não precisa saber calorias.", botao: "Simular meu fim de semana →", topo: "Em cerca de 1 minuto, o simulador mostra quanto do seu déficit sobra depois de sábado e domingo — sem precisar saber calorias." },
  saoSilvestre: { href: "/ferramentas/previsor-sao-silvestre", titulo: "Qual seria o seu tempo nos 15 km da São Silvestre?", texto: "O Previsor da São Silvestre parte do seu tempo em 5 km, 10 km ou meia e mostra o tempo provável na prova, com a subida da Brigadeiro na conta e o que muda até 31 de dezembro.", botao: "Prever meu tempo na São Silvestre →" },
} as const;

/** Convite para um Simulador Montinho nos artigos que perguntam "quanto tempo, no meu caso?". */
export default function LinkFerramentaSimulador({ slug, qual = "emagrecimento", posicao = "fim" }: { slug: string; qual?: keyof typeof SIMULADORES; posicao?: "topo" | "destaque" | "fim" }) {
  const s = SIMULADORES[qual];
  if (posicao === "destaque") {
    return (
      <div className="border border-[#BA9E50]/60 bg-[#BA9E50]/[0.06] p-5 sm:p-6" data-testid={`link-simulador-${qual}-destaque`}>
        <p className="text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ color: "#BA9E50" }}>Ferramenta gratuita</p>
        <p className="text-white text-lg font-semibold mb-1.5">{s.titulo}</p>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">{s.texto}</p>
        <Link href={s.href} onClick={() => trackEvent("simulator_internal_tool_click", { placement: `destaque-${slug}` })}
          className="inline-flex items-center justify-center px-5 py-3 font-semibold bg-[#BA9E50] text-black hover:bg-white transition-colors min-h-[44px]">
          {s.botao}
        </Link>
      </div>
    );
  }
  if (posicao === "topo") {
    return (
      <div className="border-l-2 border-[#BA9E50] bg-white/[0.03] px-4 py-3 sm:px-5" data-testid={`link-simulador-${qual}-topo`}>
        <p className="text-gray-300 text-sm leading-relaxed"><strong className="text-white">Quer saber se isso está acontecendo com você?</strong> {"topo" in s ? s.topo : s.texto}</p>
        <Link href={s.href} onClick={() => trackEvent("simulator_internal_tool_click", { placement: `topo-${slug}` })}
          className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]" style={{ textDecorationColor: "#BA9E50" }}>
          {s.botao}
        </Link>
      </div>
    );
  }
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
