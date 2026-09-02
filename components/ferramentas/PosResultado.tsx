"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import {
  anterior,
  estagio,
  registraConclusao,
  registraWhatsapp,
  type Estagio,
  type Ferramenta,
} from "@/lib/ferramentas/historico";
import { blocoPosResultado, type Bloco, type Variante } from "@/lib/ferramentas/pos-resultado";

/**
 * O bloco que vem depois do resultado de uma ferramenta.
 *
 * Três camadas, na ordem: o resultado (que a ferramenta já mostrou acima),
 * a interpretação, o próximo passo. Uma ação principal; uma secundária
 * discreta. Nunca antes do resultado, nunca cobrindo o resultado, nunca
 * abrindo nada sozinho.
 *
 * O componente não decide texto nem destino — isso é
 * lib/ferramentas/pos-resultado.ts. Ele registra a conclusão no histórico
 * da sessão, calcula o degrau, monta o bloco e mede.
 *
 * QUANDO MONTAR
 *
 * Só quando a ferramenta tem resultado. A ferramenta decide isso, não este
 * componente: ele é renderizado dentro do bloco de resultado dela, então
 * "montou" e "há resultado" são a mesma coisa.
 */

interface Props {
  ferramenta: Ferramenta;
  /** Faixa do resultado, decidida pela ferramenta. "padrao" quando não há faixa. */
  categoria?: string;
  /** Frase curta do resultado para a mensagem — sem peso, altura, idade ou saúde. */
  resumo?: string | null;
  placement: string;
  /**
   * O que a ferramenta já faz ao mandar a pessoa para a próxima — em geral,
   * gravar a ponte (kcal, peso). Chamado no clique da ação de ferramenta,
   * para o bloco novo não perder o comportamento que a ferramenta já tinha.
   */
  aoContinuar?: () => void;
  /**
   * Ferramentas que JÁ têm o passo "próxima" no próprio resultado (déficit
   * com a meta preenchida, gasto com os três objetivos) não repetem a mesma
   * ação num segundo bloco. Nesse estágio o bloco não monta e não conta
   * exposição — mas a conclusão entra no histórico do mesmo jeito.
   */
  ocultaNoEstagio?: Estagio;
}

const CH_VARIANTE = "montinho:ab:pos-ferramenta";
const CH_VISTO = "montinho:ferramentas:cta-visto:";

/** a/b/c estável por visitante. Só a pergunta muda; destino e mensagem, não. */
function variante(): Variante {
  try {
    const v = localStorage.getItem(CH_VARIANTE);
    if (v === "a" || v === "b" || v === "c") return v;
    const nova = (["a", "b", "c"] as const)[Math.floor(Math.random() * 3)];
    localStorage.setItem(CH_VARIANTE, nova);
    return nova;
  } catch {
    return "a";
  }
}

interface Montado {
  bloco: Bloco;
  est: Estagio;
  v: Variante;
  params: Record<string, string | number>;
}

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

export default function PosResultado({ ferramenta, categoria = "padrao", resumo = null, placement, aoContinuar, ocultaNoEstagio }: Props) {
  const [m, setM] = useState<Montado | null>(null);

  /*
   * Registrar, decidir e medir acontecem uma vez por montagem — e a
   * montagem acontece quando o resultado aparece. O setState fica no
   * requestAnimationFrame para não rodar síncrono dentro do efeito.
   */
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const antes = registraConclusao(ferramenta);
      const est = estagio(antes, ferramenta);
      if (est === ocultaNoEstagio) return;
      const v = variante();
      const bloco = blocoPosResultado(ferramenta, categoria, est, v, resumo);
      const params = {
        placement,
        tool_name: ferramenta,
        tool_result_category: categoria,
        cta_variant: v,
        cta_destination: bloco.destino,
        session_tool_count: antes.usadas.length + 1,
        previous_tool: anterior(antes, ferramenta) ?? "none",
      };
      setM({ bloco, est, v, params });
      /* Uma exposição por ferramenta por sessão: recalcular não é ver de novo. */
      try {
        const k = CH_VISTO + ferramenta;
        if (!sessionStorage.getItem(k)) {
          sessionStorage.setItem(k, "1");
          trackEvent("post_tool_cta_view", params);
        }
      } catch {
        trackEvent("post_tool_cta_view", params);
      }
    });
    return () => cancelAnimationFrame(id);
  }, [ferramenta, categoria, resumo, placement, ocultaNoEstagio]);

  if (!m) return null;
  const { bloco, params } = m;

  const clicaPrincipal = () => {
    trackEvent("post_tool_cta_click", params);
    if (bloco.destino === "whatsapp") {
      trackEvent("tool_to_whatsapp", params);
      registraWhatsapp();
    } else {
      trackEvent("tool_journey_continue", params);
      aoContinuar?.();
    }
  };
  const clicaSecundaria = () => {
    trackEvent("post_tool_secondary_click", { ...params, cta_destination: bloco.secundaria?.destino ?? "" });
    if (bloco.secundaria?.destino === "whatsapp") {
      trackEvent("tool_to_whatsapp", params);
      registraWhatsapp();
    } else {
      aoContinuar?.();
    }
  };

  const whats = bloco.destino === "whatsapp";
  const principalCls =
    "inline-flex items-center justify-center px-6 py-3.5 text-[15px] font-semibold min-h-[52px] rounded-md transition-colors w-full sm:w-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA9E50] " +
    (whats ? "bg-[#25D366] text-black hover:bg-[#1fbf5a]" : "bg-white text-black hover:bg-gray-100");
  const secCls =
    "inline-flex items-center text-sm text-gray-300 underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors min-h-[44px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA9E50]";

  return (
    <section
      data-testid="pos-resultado"
      data-ferramenta={ferramenta}
      data-estagio={m.est}
      aria-label="Próximo passo"
      className="relative border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 sm:p-8 mt-8"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: "#BA9E50" }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: "#BA9E50" }}>
        O que fazer com isso
      </p>
      <p className="text-gray-300 leading-relaxed mb-5 max-w-2xl">{bloco.interpretacao}</p>
      <p className="text-white font-bold text-lg sm:text-xl leading-snug mb-5" style={h}>
        {bloco.pergunta}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        {whats ? (
          <a href={bloco.href} target="_blank" rel="noopener noreferrer" onClick={clicaPrincipal} className={principalCls}>
            {bloco.botao}
          </a>
        ) : (
          <Link href={bloco.href} onClick={clicaPrincipal} className={principalCls}>
            {bloco.botao}
          </Link>
        )}
        {bloco.secundaria &&
          (bloco.secundaria.destino === "whatsapp" ? (
            <a href={bloco.secundaria.href} target="_blank" rel="noopener noreferrer" onClick={clicaSecundaria} className={secCls}>
              {bloco.secundaria.label}
            </a>
          ) : (
            <Link href={bloco.secundaria.href} onClick={clicaSecundaria} className={secCls}>
              {bloco.secundaria.label}
            </Link>
          ))}
      </div>

      {whats && (
        <p className="text-gray-500 text-xs leading-relaxed mt-4">
          Abre o WhatsApp com o nome da ferramenta e o seu resultado já escritos — você revisa antes de enviar. Não vai peso, idade nem nada de saúde.
        </p>
      )}
    </section>
  );
}
