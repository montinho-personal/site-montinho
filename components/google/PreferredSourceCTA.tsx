"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";

/**
 * Botão oficial "Fontes preferidas" do Google.
 *
 * O que isto é, e o que não é. Isto é RETENÇÃO: dar ao leitor que gostou do
 * conteúdo uma forma de dizer ao Google que prefere esta fonte. Não é um
 * recurso de ranqueamento, e a copy em volta nunca promete posição, destaque
 * garantido ou "aparecer sempre" — não temos base para afirmar nada disso.
 *
 * Por isso ele é deliberadamente discreto e vem DEPOIS do CTA comercial no
 * artigo: conversão e retenção têm objetivos diferentes, e quando disputam o
 * mesmo espaço a conversão perde. Aqui a hierarquia é visual, não só verbal —
 * o CTA comercial é uma caixa; este é uma linha.
 *
 * Três regras de implementação que vêm da documentação oficial:
 *
 * 1. O fluxo de seleção é do Google. Não recriamos modal, estrela, checkbox
 *    nem confirmação própria — e nunca dizemos "adicionado", porque o site
 *    não recebe confirmação de que a pessoa concluiu.
 * 2. A preferência é por DOMÍNIO. Não existe registrar /blog como fonte
 *    separada; o alvo é montinhopersonal.com.br.
 * 3. O recurso é suplementar. Se o script falhar, for bloqueado ou o
 *    navegador não suportar, a página não pode mostrar caixa vazia nem erro
 *    técnico — cai no deeplink oficial, que é uma alternativa prevista.
 */

/** Domínio canônico. A preferência é por domínio, sem caminho e sem www. */
const DOMINIO = "montinhopersonal.com.br";

/** Alternativa oficial para quando o JavaScript não puder ser usado. */
const DEEPLINK = `https://www.google.com/preferences/source?q=${DOMINIO}`;

/**
 * Biblioteca oficial. O `id` faz o next/script deduplicar: mesmo que o
 * componente apareça mais de uma vez numa página, o script entra uma só vez.
 */
const SCRIPT_ID = "google-preferred-source";
const SCRIPT_SRC = "https://news.google.com/swg/js/v1/publisher.js";

/** Quanto esperar o botão oficial renderizar antes de cair no deeplink. */
const ESPERA_ATE_FALLBACK_MS = 4000;

export type PreferredSourcePlacement =
  | "article_end"
  | "ask_montinho"
  | "diagnostic_result"
  | "routine_result"
  | "home";

export interface PreferredSourceCTAProps {
  /** Onde o bloco está — vira parâmetro do evento, para comparar depois. */
  placement: PreferredSourcePlacement;
  /** Variante de copy. Existe para permitir teste A/B do texto, nunca do botão. */
  variant?: "curtiu" | "encontrar" | "ajudou";
  /** Tipo de página, para segmentar no GA4 sem precisar ler a URL. */
  pageType?: string;
  className?: string;
}

/**
 * Três aberturas possíveis. Todas dizem a mesma coisa e nenhuma promete
 * resultado: "encontrar com mais facilidade" é o teto do que podemos afirmar.
 */
const COPY: Record<NonNullable<PreferredSourceCTAProps["variant"]>, string> = {
  curtiu: "Curtiu o conteúdo?",
  encontrar: "Quer encontrar mais conteúdos do Montinho no Google?",
  ajudou: "O Montinho te ajudou hoje?",
};

export default function PreferredSourceCTA({
  placement,
  variant = "curtiu",
  pageType,
  className = "",
}: PreferredSourceCTAProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [falhou, setFalhou] = useState(false);

  const params = { placement, cta_variant: variant, ...(pageType ? { page_type: pageType } : {}) };

  /**
   * View só conta quando o bloco entra de fato no viewport. Registrar no
   * carregamento do HTML mediria "existe na página", não "foi visto" — e é a
   * diferença entre saber se o bloco funciona e achar que sabe.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          trackOncePerSession("preferred_source_cta_view", params);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement, variant]);

  /**
   * Se o botão oficial não renderizar nada dentro do slot, mostramos o
   * deeplink. Cobre script bloqueado, offline, bloqueador de anúncios e
   * navegador sem suporte — em todos, a pessoa continua conseguindo chegar
   * à ferramenta do Google.
   */
  useEffect(() => {
    const t = setTimeout(() => {
      const slot = ref.current?.querySelector("[google-add-preferred-source-btn]");
      if (!slot || slot.childElementCount === 0) setFalhou(true);
    }, ESPERA_ATE_FALLBACK_MS);
    return () => clearTimeout(t);
  }, []);

  /**
   * Listener passivo no contêiner, em bubbling. Não intercepta, não cancela e
   * não toca no botão do Google — só observa que houve interação. É o máximo
   * que dá para medir honestamente: o site não sabe se a pessoa concluiu a
   * seleção do outro lado, então não existe evento de "adicionado".
   */
  function aoInteragir() {
    trackEvent("preferred_source_cta_interaction", params);
  }

  return (
    <div
      ref={ref}
      className={`border-t border-white/10 pt-6 ${className}`}
      data-testid="preferred-source-cta"
    >
      <Script id={SCRIPT_ID} src={SCRIPT_SRC} strategy="lazyOnload" />

      <p className="text-gray-400 text-sm leading-relaxed mb-1">{COPY[variant]}</p>
      <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-xl">
        Você pode adicionar o Montinho às suas fontes preferidas no Google e
        encontrar estes conteúdos com mais facilidade.
      </p>

      {/* onClick no contêiner, não no botão: o elemento do Google é dele. */}
      <div onClick={aoInteragir} onKeyUp={(e) => e.key === "Enter" && aoInteragir()}>
        {/* min-height reserva o espaço do botão oficial antes de ele existir,
            para o bloco não empurrar os artigos relacionados (CLS). */}
        <div className="min-h-[44px]">
          {!falhou && <div google-add-preferred-source-btn="" data-theme="dark" />}

          {falhou && (
            <a
              href={DEEPLINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm font-semibold text-white underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
              style={{ textDecorationColor: "#BA9E50" }}
            >
              Adicionar o Montinho às fontes preferidas
              <span aria-hidden="true">&nbsp;→</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
