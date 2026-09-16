"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";

/**
 * O próximo passo de quem usa injetável de composição corporal.
 *
 * POR QUE ELE PODE EXISTIR NESTA PÁGINA
 *
 * A calculadora é educacional e tem barreiras duras: não escolhe dose, não
 * ensina a preparar frasco, não opina sobre substância. Um CTA aqui só é
 * legítimo se respeitar exatamente isso — e este respeita, porque o que ele
 * oferece é a outra metade do problema, que é justamente a que cabe a um
 * personal trainer: o TREINO nessa fase.
 *
 * A frase que sustenta tudo é "a substância é só uma parte do processo".
 * Ela é verdadeira, é o limite da competência de quem assina o site, e é a
 * única forma honesta de vender aqui. Volume, intensidade, progressão,
 * cardio e recuperação são domínio de treinador. Quantidade, frequência e
 * adequação do injetável são de quem prescreveu, e o CTA não encosta nisso.
 *
 * ONDE ELE FICA, E POR QUE NÃO ANTES
 *
 * Depois de todo o conteúdo educacional, das fontes e da ressalva de
 * revisão. Nunca entre a calculadora e os avisos de segurança: ali ele
 * pareceria a oferta de quem orienta sobre a substância, que é exatamente o
 * que a página passou nove seções dizendo que não faz.
 *
 * RASTREIO
 *
 * Não há nada de especial a implementar. O HandoffTracker do layout raiz
 * intercepta todo clique em link de WhatsApp, gera o código Ref, grava o
 * handoff com primeiro toque, último toque, UTM, click ID, página e
 * dispositivo — e o CRM já casa isso com o lead. O que este componente
 * precisa fazer é só se identificar: data-cta-id diz QUAL CTA foi clicado e
 * data-tool-name diz de qual ferramenta ele saiu. Sem esses dois atributos o
 * clique chegaria ao CRM como "text:Quero montar minha estratégia…", que
 * funciona mas não agrupa.
 */

const OURO = "#BA9E50";
const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

const CTA_ID = "ferramenta:conversor-mg-ml-u100:estrategia-treino";
const FERRAMENTA = "conversor_mg_ml_u100";

/*
 * A mensagem que abre no WhatsApp. Ela diz de onde a pessoa veio e o que
 * quer, para a conversa começar no assunto certo — e fala de treino, não de
 * substância, pelo mesmo motivo que o bloco inteiro fala.
 */
const MENSAGEM =
  "Olá, Montinho! Vi a calculadora de peptídeos no seu site. Uso injetável para composição corporal e queria organizar minha estratégia de treino nessa fase.";

export default function CTAEstrategiaTreino({ placement }: { placement: string }) {
  const raiz = useRef<HTMLElement>(null);
  const viu = useRef(false);

  const params = { cta_id: CTA_ID, ferramenta: FERRAMENTA, placement, cta_destination: "whatsapp" };

  /* Impressão só quando o bloco entra na tela: HTML carregado não é visto. */
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting) && !viu.current) {
          viu.current = true;
          const chave = `mt:cta:${CTA_ID}:${placement}`;
          try {
            if (!sessionStorage.getItem(chave)) {
              sessionStorage.setItem(chave, "1");
              trackEvent("post_tool_cta_view", params);
            }
          } catch {
            trackEvent("post_tool_cta_view", params);
          }
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement]);

  return (
    <aside
      ref={raiz}
      aria-label="Sugestão de próximo passo"
      data-cta-id={CTA_ID}
      data-tool-name={FERRAMENTA}
      className="border border-white/25 bg-gradient-to-b from-white/[0.06] to-transparent relative px-6 py-7 sm:px-8 sm:py-8"
    >
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: OURO }} aria-hidden="true" />

      <h2 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-4" style={h}>
        Usa peptídeos ou medicamentos para composição corporal e não sabe como encaixar o treino nessa fase?
      </h2>

      <p className="text-gray-300 leading-relaxed mb-3">
        A substância é só uma parte do processo. Volume, intensidade, progressão, cardio e recuperação precisam conversar com o seu momento — e essa parte não vem escrita no rótulo.
      </p>
      <p className="text-gray-300 leading-relaxed mb-6">
        Se você quer organizar a estratégia de treino de forma individualizada, me chama no WhatsApp. Quem cuida da medicação é quem prescreveu; o treino é comigo.
      </p>

      <a
        href={getWhatsAppUrl(MENSAGEM)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent("post_tool_cta_click", params);
          trackEvent("tool_to_whatsapp", params);
        }}
        className="inline-flex items-center justify-center bg-white text-black px-6 py-3 text-sm font-semibold tracking-wide hover:bg-gray-100 transition-colors min-h-[48px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#BA9E50]"
      >
        Quero montar minha estratégia de treino
        <span aria-hidden="true"> →</span>
      </a>
    </aside>
  );
}
