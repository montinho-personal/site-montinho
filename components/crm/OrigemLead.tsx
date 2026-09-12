"use client";
import { useEffect, useRef, useState } from "react";
import { identificarOrigem, type ResultadoOrigem, type ResumoHandoff } from "@/app/crm/actions";
import { Aviso, Campo, Input, Select, Textarea, dataHoraBr } from "@/components/crm/ui";
import { extrairRef } from "@/lib/crm/mensagens";

/**
 * O bloco "De onde veio" do formulário de lead.
 *
 * Cole a mensagem que chegou no WhatsApp e o resto se preenche: o Ref é
 * lido do texto, o clique é buscado no banco, origem e detalhe são
 * escritos nos campos. Sem Ref, a frase diz a página e o botão, e os
 * cliques recentes compatíveis aparecem para escolher pelo horário.
 * Os campos continuam editáveis — o automático sugere, não tranca.
 */
export default function OrigemLead({ fontes, refInicial, servicos }: {
  fontes: { code: string; nome: string }[];
  refInicial: string;
  servicos: { id: string; code: string }[];
}) {
  const [mensagem, setMensagem] = useState("");
  const [ref, setRef] = useState(refInicial);
  const [fonte, setFonte] = useState("");
  const [detalhe, setDetalhe] = useState("");
  const [res, setRes] = useState<ResultadoOrigem | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const pedido = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function aplicar(h: ResumoHandoff | null, r: ResultadoOrigem) {
    const codigoServico = h?.servico_interesse ?? r.identificacao.servico;
    if (codigoServico) {
      const sel = document.querySelector<HTMLSelectElement>('select[name="service_id"]');
      const id = servicos.find((s) => s.code === codigoServico)?.id;
      if (sel && id) sel.value = id;
    }
    if (h) {
      setFonte(h.source_code && h.source_code !== "unknown" ? h.source_code : "");
      const partes = [h.utm_campaign ? `campanha ${h.utm_campaign}` : null, h.page_path, h.cta_id?.replace(/^(text|aria):/, "")].filter(Boolean);
      setDetalhe(partes.join(" · "));
    } else {
      // Sem clique no banco: a frase ainda pode provar a origem (diretório
      // externo, por exemplo), e aí ela preenche a fonte como o handoff faria.
      if (r.identificacao.fonte) setFonte(r.identificacao.fonte);
      if (r.detalhe) setDetalhe(r.detalhe + (r.identificacao.complemento ? ` · "${r.identificacao.complemento}"` : ""));
    }
  }

  /** Espera a pessoa parar de digitar e busca uma vez; respostas atrasadas são descartadas. */
  function agendar(msg: string, codigo: string) {
    if (timer.current) clearTimeout(timer.current);
    const refOk = /^[A-Z0-9]{5}$/.test(codigo.trim().toUpperCase());
    if (!msg.trim() && !refOk) { setRes(null); setBuscando(false); return; }
    const meu = ++pedido.current;
    setBuscando(true);
    setErro(null);
    timer.current = setTimeout(async () => {
      try {
        const r = await identificarOrigem(msg, refOk ? codigo : null);
        if (meu !== pedido.current) return;
        setRes(r);
        if (r.ref && r.ref !== codigo.trim().toUpperCase()) setRef(r.ref);
        aplicar(r.handoff, r);
      } catch (e) {
        /*
         * Sem este catch a busca falhava calada: a promessa era rejeitada,
         * nada aparecia na tela e a pessoa concluía que o CRM "não estava
         * reconhecendo" — sem nenhuma pista do motivo. Falha visível é
         * melhor que ausência de resposta.
         */
        if (meu !== pedido.current) return;
        setRes(null);
        setErro(e instanceof Error ? e.message : "Não consegui consultar o clique. Recarregue a página e tente de novo.");
      } finally { if (meu === pedido.current) setBuscando(false); }
    }, 400);
  }
  // Ref vindo da URL (/crm/leads/novo?ref=…): busca ao abrir, fora do render.
  useEffect(() => {
    if (refInicial) timer.current = setTimeout(() => agendar("", refInicial), 0);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [refInicial]); // eslint-disable-line react-hooks/exhaustive-deps

  function escolher(c: ResumoHandoff) { setRef(c.ref_code); agendar(mensagem, c.ref_code); }
  const onMensagem = (v: string) => { setMensagem(v); agendar(v, ref); };
  /** Aceita o código digitado, colado com lixo invisível, ou a mensagem inteira colada no campo errado. */
  const onRef = (v: string) => {
    const u = extrairRef(v) ?? v.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 5);
    setRef(u);
    agendar(mensagem, u);
  };

  const h = res?.handoff ?? null;
  return (
    <div className="space-y-3">
      <Campo rotulo="Mensagem recebida no WhatsApp (cole aqui)" dica="Com ou sem Ref. A frase do botão já diz a página; o Ref acha o clique exato.">
        <Textarea name="mensagem_whatsapp" value={mensagem} onChange={(e) => onMensagem(e.target.value)} placeholder="Olá, Montinho! Vi a página da… Ref: A7K2Q" />
      </Campo>
      {buscando && <p className="text-xs text-zinc-500">Procurando o clique…</p>}
      {erro && <Aviso tom="alerta">Não deu para consultar: {erro}</Aviso>}
      {h && (
        <Aviso>
          Clique encontrado (ref <strong>{h.ref_code}</strong>) em {dataHoraBr(h.created_at)}: {h.page_path ?? "página desconhecida"}
          {h.cta_id ? ` · botão "${h.cta_id.replace(/^(text|aria):/, "")}"` : ""} · origem <strong>{h.source_code ?? "desconhecida"}</strong>
          {h.utm_campaign ? ` · campanha ${h.utm_campaign}` : ""}{h.device ? ` · ${h.device}` : ""}.
          {h.ja_ligado ? " Atenção: este clique já está ligado a outro lead." : " A origem será registrada com confiança alta."}
        </Aviso>
      )}
      {!h && res && res.ref && (
        <Aviso tom="alerta">Nenhum clique com o Ref <strong>{res.ref}</strong>. Confira o código; se estiver certo, o clique pode não ter sido registrado (bloqueador, modo anônimo).</Aviso>
      )}
      {!h && res && !res.ref && res.identificacao.origem && (
        <Aviso>
          Frase reconhecida: <strong>{res.identificacao.origem}</strong>
          {res.identificacao.extra.local ? ` (${res.identificacao.extra.local})` : ""}
          {res.identificacao.extra.titulo ? ` — "${res.identificacao.extra.titulo}"` : ""}
          {res.identificacao.extra.ferramenta ? ` — ${res.identificacao.extra.ferramenta}` : ""}.
          {res.candidatos.length
            ? " Sem Ref na mensagem. Estes cliques recentes, ainda sem lead, batem com a página e o botão — escolha pelo horário:"
            : " Sem Ref e sem clique recente compatível: a origem fica pela frase, com confiança média."}
        </Aviso>
      )}
      {!h && res && !res.ref && res.candidatos.length > 0 && (
        <ul className="space-y-1">
          {res.candidatos.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => escolher(c)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm hover:border-white/30">
                <span className="font-mono text-xs text-zinc-400">{c.ref_code}</span> · {dataHoraBr(c.created_at)} · {c.source_code ?? "desconhecida"}
                {c.utm_campaign ? ` · ${c.utm_campaign}` : ""}{c.device ? ` · ${c.device}` : ""}
              </button>
            </li>
          ))}
        </ul>
      )}
      {!h && res && !res.ref && !res.identificacao.origem && mensagem.trim() && (
        <p className="text-xs text-zinc-500">Não reconheci essa frase como um botão do site. Preencha a origem à mão.</p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo rotulo="Código Ref do WhatsApp"><Input name="ref_code" value={ref} onChange={(e) => onRef(e.target.value)} placeholder="A7K2Q" className="uppercase" /></Campo>
        <Campo rotulo="Origem (se souber)">
          <Select name="source_code" value={fonte} onChange={(e) => setFonte(e.target.value)}>
            <option value="">Desconhecida</option>
            {fontes.map((f) => <option key={f.code} value={f.code}>{f.nome}</option>)}
          </Select>
        </Campo>
        <Campo rotulo="Detalhe (campanha, página, botão)"><Input name="source_detail" value={detalhe} onChange={(e) => setDetalhe(e.target.value)} /></Campo>
      </div>
    </div>
  );
}
