"use client";

/**
 * Botão de compartilhamento contextual.
 *
 * No celular, um toque abre o painel do próprio aparelho (Web Share) — é
 * lá que estão WhatsApp, Mensagens, Telegram, e-mail e o que mais a pessoa
 * tiver instalado, e é o caminho de menos atrito que existe. Quando o
 * navegador não suporta, cai numa folha de opções curta: WhatsApp, copiar,
 * e-mail. No desktop, um popover pequeno com as mesmas opções.
 *
 * O que este componente deliberadamente NÃO faz:
 *  - não carrega SDK de rede nenhuma (zero script de terceiro, zero cookie);
 *  - não mostra contador de compartilhamentos (não temos o dado real);
 *  - não trata cancelamento como erro (fechar o painel é uma decisão, não
 *    uma falha, e avisar "não foi possível compartilhar" seria mentira);
 *  - não usa o número do Montinho: aqui quem escolhe o destinatário é o
 *    usuário. Falar com o Montinho é outro botão, com outra intenção.
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import {
  montarMensagem, rotuloBotao, urlCompartilhada, urlEmail, urlWhatsApp,
  type ContextoShare, type DadosShare, type LocalShare, type MetodoShare,
} from "@/lib/share/mensagens";

interface Props {
  contexto: ContextoShare;
  titulo: string;
  caminho: string;
  local: LocalShare;
  resultado?: string[];
  ferramenta?: string;
  gancho?: string;
  /** discreto: link de texto. solido: botão com borda. bloco: largura total. */
  aparencia?: "discreto" | "solido" | "bloco";
  rotulo?: string;
  className?: string;
  /** Mostra a mensagem antes de enviar. Padrão nos resultados. */
  previa?: boolean;
}

/*
 * Ícones em traço, na cor do texto. Emoji colorido (💬 🔗 ✉) parece plugin
 * de 2012 ao lado do preto e dourado do resto do site — e um traço fino
 * pesa zero, porque não é imagem nem fonte, é SVG inline.
 */
const T = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const IconeWhats = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...T} aria-hidden="true"><path d="M21 11.5a8.5 8.5 0 01-12.6 7.4L3 20.5l1.7-5.2A8.5 8.5 0 1121 11.5z" /></svg>
);
const IconeLink = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...T} aria-hidden="true"><path d="M10 13a4 4 0 006 .5l2.5-2.5a4 4 0 00-5.7-5.7L11.5 6.5" /><path d="M14 11a4 4 0 00-6-.5L5.5 13a4 4 0 005.7 5.7l1.3-1.3" /></svg>
);
const IconeCopia = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...T} aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="1.5" /><path d="M6 15H5a1.5 1.5 0 01-1.5-1.5v-9A1.5 1.5 0 015 3h9A1.5 1.5 0 0115.5 4.5V6" /></svg>
);
const IconeEmail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" {...T} aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 7l8.5 6 8.5-6" /></svg>
);
const IconeShare = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v13M12 3l-4 4M12 3l4 4" /><path d="M4 14v5a2 2 0 002 2h12a2 2 0 002-2v-5" />
  </svg>
);

export default function Compartilhar({
  contexto, titulo, caminho, local, resultado, ferramenta, gancho,
  aparencia = "discreto", rotulo, className = "", previa,
}: Props) {
  const [aberto, setAberto] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [temNativo, setTemNativo] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);
  const idMenu = useId();
  const mostrarPrevia = previa ?? contexto === "tool-result";

  // Feature detection só depois da hidratação: o servidor não sabe se o
  // aparelho tem Web Share, e chutar causaria diferença entre HTML e DOM.
  useEffect(() => { setTemNativo(typeof navigator !== "undefined" && typeof navigator.share === "function"); }, []);

  const dados: DadosShare = { contexto, titulo, caminho, resultado, ferramenta, gancho };
  const params = {
    page_type: contexto, content_type: contexto, share_location: local,
    ...(ferramenta ? { tool_name: ferramenta } : {}),
  };
  const marcar = useCallback((evento: Parameters<typeof trackEvent>[0], metodo?: MetodoShare) => {
    trackEvent(evento, { ...params, ...(metodo ? { share_method: metodo } : {}) });
    if (contexto === "tool-result" && metodo) trackEvent("share_result", { ...params, share_method: metodo });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contexto, local, ferramenta]);

  const anunciar = (texto: string) => { setAviso(texto); setTimeout(() => setAviso(null), 2600); };

  async function copiar(texto: string, metodo: MetodoShare, mensagemOk: string) {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(texto); ok = true; }
    } catch { ok = false; }
    if (!ok) {
      // Fallback para navegador sem Clipboard API ou sem permissão.
      try {
        const ta = document.createElement("textarea");
        ta.value = texto; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select();
        ok = document.execCommand("copy");
        document.body.removeChild(ta);
      } catch { ok = false; }
    }
    anunciar(ok ? mensagemOk : "Não consegui copiar. Selecione o texto e copie à mão.");
    if (ok) marcar(metodo === "copy_link" ? "share_copy_link" : "share_copy_message", metodo);
    setAberto(false);
  }

  async function abrir() {
    marcar("share_open");
    if (temNativo && !mostrarPrevia) {
      const texto = montarMensagem(dados, "native");
      try {
        await navigator.share({ title: titulo, text: texto, url: urlCompartilhada(caminho, "native", contexto) });
        marcar("share_native", "native");
      } catch {
        // Cancelar não é erro e não vira evento nem aviso.
      }
      return;
    }
    setAberto((v) => !v);
  }

  async function nativoDaPrevia() {
    const texto = montarMensagem(dados, "native");
    try {
      await navigator.share({ title: titulo, text: texto, url: urlCompartilhada(caminho, "native", contexto) });
      marcar("share_native", "native");
      setAberto(false);
    } catch { /* cancelou */ }
  }

  // Fecha ao tocar fora, ao rolar para longe e no Escape; devolve o foco.
  useEffect(() => {
    if (!aberto) return;
    const fora = (e: Event) => { if (caixa.current && !caixa.current.contains(e.target as Node)) setAberto(false); };
    const tecla = (e: KeyboardEvent) => { if (e.key === "Escape") { setAberto(false); botao.current?.focus(); } };
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", tecla);
    return () => { document.removeEventListener("pointerdown", fora); document.removeEventListener("keydown", tecla); };
  }, [aberto]);

  const mensagem = montarMensagem(dados, "whatsapp");
  const estilos: Record<string, string> = {
    discreto: "text-sm text-gray-400 hover:text-white underline-offset-4 hover:underline",
    solido: "text-sm text-white border border-white/20 hover:border-[#BA9E50] px-4 py-2.5 min-h-[44px] transition-colors",
    bloco: "w-full justify-center text-sm text-white border border-white/20 hover:border-[#BA9E50] px-4 py-3 min-h-[48px] transition-colors",
  };
  const item = "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-gray-200 hover:bg-white/10 min-h-[44px] transition-colors";

  return (
    <div className={`relative inline-block ${aparencia === "bloco" ? "w-full" : ""} ${className}`} ref={caixa}>
      <button
        ref={botao}
        type="button"
        onClick={abrir}
        aria-haspopup={temNativo && !mostrarPrevia ? undefined : "menu"}
        aria-expanded={temNativo && !mostrarPrevia ? undefined : aberto}
        aria-controls={aberto ? idMenu : undefined}
        aria-label={`${rotulo ?? rotuloBotao(contexto)}: ${titulo}`}
        className={`inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BA9E50] ${estilos[aparencia]}`}
      >
        <IconeShare />
        {rotulo ?? rotuloBotao(contexto)}
      </button>

      {/* Fundo escuro só no celular, onde o menu vira folha inferior. */}
      {aberto && <div className="fixed inset-0 z-[59] bg-black/60 sm:hidden" aria-hidden="true" />}

      {aberto && (
        <div
          id={idMenu}
          role="menu"
          aria-label="Opções de compartilhamento"
          /*
           * Celular: folha inferior colada na borda de baixo, largura toda,
           * dentro do alcance do polegar. Um popover ancorado no botão vazava
           * para fora da tela quando o botão ficava perto da margem esquerda
           * — foi o que a captura de 390 px mostrou.
           * Desktop: popover pequeno ancorado no botão, como deve ser.
           *
           * z acima de 50 porque o banner de cookies, o WhatsApp flutuante e
           * a sticky bar vivem nesse nível: a folha é modal e precisa ficar
           * por cima de todos eles enquanto está aberta.
           */
          className="fixed inset-x-0 bottom-0 z-[60] max-h-[70vh] overflow-y-auto border-t border-white/15 bg-[#0d0d0d] p-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:mt-2 sm:w-[17rem] sm:rounded-none sm:border sm:pb-1"
        >
          <div className="mx-auto mb-1 h-1 w-10 rounded-full bg-white/20 sm:hidden" aria-hidden="true" />
          {mostrarPrevia && (
            <div className="border-b border-white/10 px-3 py-2.5">
              <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">O que será enviado</p>
              <p className="max-h-40 overflow-y-auto whitespace-pre-line break-words text-xs leading-relaxed text-gray-300">{mensagem}</p>
            </div>
          )}
          {temNativo && mostrarPrevia && (
            <button type="button" role="menuitem" className={item} onClick={nativoDaPrevia}>
              <IconeShare /> Compartilhar…
            </button>
          )}
          <a
            role="menuitem"
            href={urlWhatsApp(mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            className={item}
            onClick={() => { marcar("share_whatsapp", "whatsapp"); setAberto(false); }}
          >
            <IconeWhats /> WhatsApp
          </a>
          <button type="button" role="menuitem" className={item} onClick={() => copiar(urlCompartilhada(caminho, "copy_link", contexto), "copy_link", "Link copiado")}>
            <IconeLink /> Copiar link
          </button>
          <button type="button" role="menuitem" className={item} onClick={() => copiar(montarMensagem(dados, "copy_message"), "copy_message", contexto === "tool-result" ? "Resultado copiado" : "Mensagem copiada")}>
            <IconeCopia /> {contexto === "tool-result" ? "Copiar resultado" : "Copiar mensagem"}
          </button>
          <a
            role="menuitem"
            href={urlEmail(titulo, montarMensagem(dados, "email"))}
            className={item}
            onClick={() => { marcar("share_email", "email"); setAberto(false); }}
          >
            <IconeEmail /> E-mail
          </a>
        </div>
      )}

      {/* Feedback acessível: quem usa leitor de tela ouve o mesmo aviso. */}
      <span aria-live="polite" className={aviso ? "ml-2 text-xs text-[#BA9E50]" : "sr-only"}>{aviso ?? ""}</span>
    </div>
  );
}
