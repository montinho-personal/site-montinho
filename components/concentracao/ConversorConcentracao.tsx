"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import {
  calcularConcentracao, conferirInstrucao, formatarConcentracao, formatarMarca, formatarMg, formatarMl, formatarMlFino,
  lerMarca, localizarQuantidadePrescrita, tabelaU100,
  validarConcentracao, validarMarca, validarMg, validarMl, MARCA_MAX, MARCA_MIN, type Erro,
} from "@/lib/concentracao/calculo";
import { COMPOSTOS, nomeDoComposto } from "@/lib/concentracao/compostos";
import { FONTES, linkDaFonte } from "@/lib/concentracao/fontes";
import SeringaU100 from "./SeringaU100";

/**
 * Calculadora de concentração e da régua da seringa.
 *
 * O que a pessoa precisa entender, e nesta ordem:
 *
 *   mg        — quanto da substância existe
 *   mL        — quanto líquido existe
 *   mg/mL     — quão concentrado está
 *   marquinha — o risquinho na seringa, e o volume que ele representa
 *   volume × concentração — quanto da substância está naquele volume
 *
 * "Marquinha", e não "marca da U-100", é decisão de linguagem com motivo
 * duplo: é a palavra que as pessoas usam, e é honesta. Chamar de "5 UI" o
 * risquinho 5 empresta ao peptídeo uma unidade que ele não tem — que é o
 * erro exato que esta página existe para desfazer. O código U-100 aparece
 * uma vez só, na conferência da escala, e o comentário de EscalaOk explica
 * por que ele não pode sumir de vez.
 *
 * O que este componente NÃO faz, e é a razão de existir: não recebe "quero
 * X mg" e devolve uma marquinha. A pessoa escolhe e a ferramenta explica
 * o que existe ali. O caminho inverso existe num passo separado e parte de
 * uma quantidade JÁ PRESCRITA, para conferência — o campo pergunta o que o
 * profissional passou, não o que a pessoa quer. A diferença parece sutil e é
 * toda a diferença entre explicar uma medida e prescrever uma de injetável.
 *
 * Privacidade: tudo é calculado aqui, no navegador. Nenhum valor digitado —
 * mg, mL, concentração, marquinha — entra em evento de analytics, em URL, em
 * armazenamento ou em rede. Os eventos registram que a ferramenta foi usada,
 * nunca com o quê.
 */

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const OURO = "#BA9E50";

const MENSAGEM_ERRO: Record<Erro, string> = {
  vazio: "",
  invalido: "Confira o valor: só números, com vírgula ou ponto.",
  fora_do_limite: "Esse valor está fora do que a ferramenta consegue interpretar com segurança. Confira o rótulo.",
};

type Modo = "calcular" | "concentracao";
/**
 * A primeira pergunta era "o líquido é insulina?". Quem chega buscando
 * calculadora de peptídeo respondia "não" e ficava sem saber se a página era
 * para ele — a pergunta separava certo e acolhia errado. Agora ela separa
 * pela palavra que a pessoa usa. A trava de insulina continua idêntica; o que
 * mudou foi de que lado ela é enunciada.
 */
type Tipo = null | "peptideo" | "insulina";

/**
 * A conferência da escala, e por que ela substituiu 35 aparições de "U-100".
 *
 * O termo estava em toda frase, todo resultado e toda linha da tabela — como
 * adjetivo permanente. Isso deixou a página difícil de ler para exatamente
 * quem ela atende: gente que nunca segurou uma seringa dessas e tropeça num
 * código antes de entender a ideia.
 *
 * Mas o termo não pode simplesmente sumir, e o motivo tem número. Existe a
 * seringa U-40, de insulina veterinária, em que 1 mL comporta 40 unidades.
 * Nela cada marquinha vale 0,025 mL, e não 0,01 — a marquinha 5 seria
 * 0,125 mL em vez de 0,05 mL, duas vezes e meia mais líquido na mesma marca.
 * Uma calculadora que aceitasse "seringa de insulina" sem conferir estaria
 * errando por esse fator sem avisar ninguém.
 *
 * A saída é trocar rótulo por conferência: perguntar UMA vez, com a seringa
 * na mão, e depois falar português. O que muda entre uma seringa de 30, 50 e
 * 100 unidades é só até onde a régua vai; a marquinha vale o mesmo nas três,
 * e é isso que a pessoa precisa saber.
 */
type EscalaOk = null | "sim" | "nao";

export default function ConversorConcentracao({ placement }: { placement: string }) {
  const uid = useId();
  const raiz = useRef<HTMLDivElement>(null);

  const [modo, setModo] = useState<Modo>("calcular");
  const [mgTxt, setMgTxt] = useState("");
  const [mlTxt, setMlTxt] = useState("");
  const [concTxt, setConcTxt] = useState("");
  const [tipo, setTipo] = useState<Tipo>(null);
  const [escalaOk, setEscalaOk] = useState<EscalaOk>(null);
  /*
   * Duas entradas desenham a mesma seringa: a dose prescrita e o slider de
   * marquinha. Quem manda é a última que a pessoa tocou — qualquer outra
   * regra faz um dos dois campos parecer quebrado, porque o desenho ignoraria
   * o que acabou de ser digitado.
   */
  const [ultimoAjuste, setUltimoAjuste] = useState<"dose" | "marquinha">("dose");
  const [composto, setComposto] = useState<string>("");
  const [mgPrescritoTxt, setMgPrescritoTxt] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [marca, setMarca] = useState<number | null>(null);
  const [marcaTxt, setMarcaTxt] = useState("");
  const [conferirAberto, setConferirAberto] = useState(false);
  const [mgInfoTxt, setMgInfoTxt] = useState("");
  const [marcaInfoTxt, setMarcaInfoTxt] = useState("");

  // Eventos "uma vez": o comportamento, nunca o valor.
  const jaCalculou = useRef(false);
  const jaMoveu = useRef(false);
  const jaAbriuConferir = useRef(false);
  const ultimaDivergencia = useRef<string | null>(null);

  const vMg = validarMg(mgTxt);
  const vMl = validarMl(mlTxt);
  const vConc = validarConcentracao(concTxt);

  const concentracao = useMemo(() => {
    if (modo === "concentracao") return vConc.valor;
    if (vMg.valor == null || vMl.valor == null) return null;
    return calcularConcentracao(vMg.valor, vMl.valor);
  }, [modo, vMg.valor, vMl.valor, vConc.valor]);

  const leitura = concentracao != null && marca != null ? lerMarca(concentracao, marca) : null;
  const tabela = concentracao != null ? tabelaU100(concentracao) : [];
  const podeSeringa = concentracao != null && tipo === "peptideo" && escalaOk === "sim";
  const nome = nomeDoComposto(composto || null);

  const vMgPrescrito = validarMg(mgPrescritoTxt);
  const prescrito = concentracao != null && vMgPrescrito.valor != null
    ? localizarQuantidadePrescrita(concentracao, vMgPrescrito.valor) : null;
  const marcaDesenhada = ultimoAjuste === "dose" && prescrito?.status === "ok"
    ? prescrito.marcaAproximada
    : marca ?? (prescrito?.status === "ok" ? prescrito.marcaAproximada : null);
  const jaConverteu = useRef(false);
  useEffect(() => {
    if (prescrito && prescrito.status !== "invalido" && !jaConverteu.current) {
      jaConverteu.current = true;
      trackEvent("reverse_calculation", { placement });
    }
  }, [prescrito, placement]);

  /** View: quando o bloco entra na tela. */
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { trackOncePerSession("concentration_tool_view", { placement }); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [placement]);

  useEffect(() => {
    if (concentracao != null && !jaCalculou.current) { jaCalculou.current = true; trackEvent("concentration_calculated", { placement, modo }); }
  }, [concentracao, placement, modo]);

  function escolherMarca(n: number | null) {
    setMarca(n);
    setUltimoAjuste("marquinha");
    setMarcaTxt(n == null ? "" : String(n));
    if (n != null && !jaMoveu.current) { jaMoveu.current = true; trackEvent("u100_mark_change", { placement }); }
  }

  const vMgInfo = validarMg(mgInfoTxt);
  const vMarcaInfo = validarMarca(marcaInfoTxt);
  const conferencia = concentracao != null && vMgInfo.valor != null && vMarcaInfo.valor != null
    ? conferirInstrucao(concentracao, vMgInfo.valor, vMarcaInfo.valor) : null;
  useEffect(() => {
    if (conferencia?.status === "nao_corresponde") {
      const chave = `${mgInfoTxt}|${marcaInfoTxt}`;
      if (ultimaDivergencia.current !== chave) { ultimaDivergencia.current = chave; trackEvent("instruction_check_mismatch", { placement }); }
    }
  }, [conferencia?.status, mgInfoTxt, marcaInfoTxt, placement]);

  const fonteInsulina = FONTES.find((f) => f.id === "ismp-alto-risco");
  const inputCls = "w-full bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors";

  return (
    <div ref={raiz} className="border border-white/15 bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:p-8 relative" data-testid="conversor-concentracao">
      <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: OURO }} aria-hidden="true" />
      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: OURO }}>
        Educacional · sem cadastro · nada sai do seu navegador
      </p>
      <h2 className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-2" style={h}>
        Calcule a Concentração e Converta a Dose Prescrita
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6 max-w-2xl">
        Diga quanto o rótulo declara e quanto líquido tem no frasco. A concentração aparece na hora — e com ela a ferramenta converte, em mL e nas marquinhas da seringa, a dose que já foi prescrita para você.
      </p>

      {/* Passo 1: de que lado da régua a pessoa está. */}
      <div className="mb-6">
        <p id={`${uid}-tipo-rot`} className="text-gray-300 text-sm font-medium mb-2">O que você quer calcular?</p>
        <div role="radiogroup" aria-labelledby={`${uid}-tipo-rot`} className="flex flex-wrap gap-2">
          {([
            ["peptideo", "Peptídeo ou injetável manipulado"],
            ["insulina", "Insulina"],
          ] as const).map(([id, rot]) => (
            <button key={id} type="button" role="radio" aria-checked={tipo === id} onClick={() => setTipo(id)}
              className={`px-4 py-2.5 text-sm font-medium border transition-colors min-h-[44px] ${tipo === id ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/40"}`}>
              {rot}
            </button>
          ))}
        </div>
        {tipo === null && (
          <p className="text-gray-400 text-xs leading-relaxed mt-2">
            Essa seringa nasceu para insulina, e insulina tem regra própria. Responda para a ferramenta saber o que pode explicar.
          </p>
        )}
      </div>

      {tipo === "insulina" && (
        <div role="alert" className="border border-white/30 bg-black/60 p-5 mb-6">
          <p className="text-white font-semibold leading-relaxed mb-3">
            Esta ferramenta não calcula doses de insulina. Use exatamente a concentração, dispositivo e quantidade prescritos para o produto específico. Não converta entre concentrações ou seringas por conta própria.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Para insulina, as unidades da escala são unidades da própria insulina, e existem produtos em concentrações diferentes (U-100, U-200, U-300, U-500) que não se convertem por regra de três.{" "}
            {fonteInsulina && <a href={linkDaFonte(fonteInsulina)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-1 hover:text-white transition-colors" onClick={() => trackEvent("source_open", { placement, fonte: fonteInsulina.id })}>A insulina está na lista de medicamentos de alto risco do ISMP</a>}.
          </p>
        </div>
      )}

      {/*
        A entrada vem primeiro. Quem abre esta página já tem o frasco na mão e
        quer a conta: fazer a pessoa ler três definições antes de digitar
        qualquer coisa é cobrar aula de quem veio buscar resposta. A explicação
        das três palavras vem logo depois do resultado, quando ela já tem um
        número concreto para pendurar o conceito.
      */}
      {modo === "calcular" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${uid}-mg`} className="block text-gray-300 text-sm font-medium mb-2">Quanto o rótulo declara</label>
            <div className="flex items-center gap-3">
              <input id={`${uid}-mg`} type="text" inputMode="decimal" autoComplete="off" placeholder="60" value={mgTxt} onChange={(e) => setMgTxt(e.target.value)} className={inputCls} aria-describedby={`${uid}-mg-ajuda`} />
              <span className="text-gray-300 text-lg">mg</span>
            </div>
            <p id={`${uid}-mg-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
              {vMg.erro && vMg.erro !== "vazio" ? MENSAGEM_ERRO[vMg.erro] : "O total de substância que vem no frasco."}
            </p>
          </div>
          <div>
            <label htmlFor={`${uid}-ml`} className="block text-gray-300 text-sm font-medium mb-2">Quanto líquido tem no frasco</label>
            <div className="flex items-center gap-3">
              <input id={`${uid}-ml`} type="text" inputMode="decimal" autoComplete="off" placeholder="2,5" value={mlTxt} onChange={(e) => setMlTxt(e.target.value)} className={inputCls} aria-describedby={`${uid}-ml-ajuda`} />
              <span className="text-gray-300 text-lg">mL</span>
            </div>
            <p id={`${uid}-ml-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
              {vMl.erro && vMl.erro !== "vazio" ? MENSAGEM_ERRO[vMl.erro] : "O volume final da solução, já pronta."}
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-sm">
          <label htmlFor={`${uid}-conc`} className="block text-gray-300 text-sm font-medium mb-2">Concentração do frasco</label>
          <div className="flex items-center gap-3">
            <input id={`${uid}-conc`} type="text" inputMode="decimal" autoComplete="off" placeholder="24" value={concTxt} onChange={(e) => setConcTxt(e.target.value)} className={inputCls} aria-describedby={`${uid}-conc-ajuda`} />
            <span className="text-gray-300 text-lg whitespace-nowrap">mg/mL</span>
          </div>
          <p id={`${uid}-conc-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {vConc.erro && vConc.erro !== "vazio" ? MENSAGEM_ERRO[vConc.erro] : "Como está escrito no rótulo."}
          </p>
        </div>
      )}

      {/*
        O segundo caminho é um link discreto, não uma escolha na porta de
        entrada. Perguntar "você quer calcular ou já sabe?" antes de mostrar
        qualquer campo obriga a pessoa a decidir algo que ela ainda não
        entendeu — e foi exatamente o que confundiu na primeira versão.
      */}
      <button
        type="button"
        onClick={() => setModo(modo === "calcular" ? "concentracao" : "calcular")}
        className="mt-1 text-gray-400 text-sm underline underline-offset-4 decoration-1 hover:text-white transition-colors min-h-[44px]"
        style={{ textDecorationColor: OURO }}
      >
        {modo === "calcular" ? "O rótulo já diz a concentração em mg/mL" : "Prefiro calcular pela quantidade e pelo volume"}
      </button>

      {/* O resultado, na hora. */}
      <div aria-live="polite" className="mt-5">
        {concentracao == null ? (
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: OURO }}>
            Preencha os dois campos para ver a concentração. Se o rótulo não diz a quantidade total e o volume, não dá para saber a concentração — e a ferramenta não chuta.
          </p>
        ) : (
          <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.06] p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: OURO }}>Concentração</p>
            <p className="text-white font-bold text-4xl sm:text-5xl leading-none mb-3" style={h}>
              {formatarConcentracao(concentracao)}<span className="text-xl font-normal text-gray-300"> mg/mL</span>
            </p>
            <p className="text-gray-300 leading-relaxed">
              Quer dizer: cada 1 mL {nome ? `do seu frasco de ${nome.toLowerCase()}` : "desse frasco"} tem {formatarConcentracao(concentracao)} mg da substância.
            </p>
            {/*
              Copiar entrega o texto inteiro, com a conta à vista. Quem copia
              costuma colar numa conversa com quem prescreveu — e um número
              solto, sem a concentração que o gerou, é justamente o que vira
              mal-entendido.
            */}
            <button
              type="button"
              onClick={() => {
                const linha = `Frasco: ${formatarConcentracao(concentracao)} mg/mL${nome ? ` (${nome})` : ""}${leitura ? ` · marquinha ${leitura.marca} da seringa = ${formatarMl(leitura.volumeMl)} mL = ${formatarMg(leitura.mg)} mg` : ""}`;
                navigator.clipboard?.writeText(linha).then(() => {
                  setCopiado(true);
                  trackEvent("result_copied", { placement });
                  setTimeout(() => setCopiado(false), 2500);
                }).catch(() => setCopiado(false));
              }}
              className="mt-4 text-sm font-semibold text-white underline underline-offset-4 decoration-1 min-h-[44px] hover:opacity-80 transition-opacity"
              style={{ textDecorationColor: OURO }}
            >
              {copiado ? "Copiado" : "Copiar o resultado"}
            </button>
            {modo === "calcular" && vMg.valor != null && vMl.valor != null && (
              <details className="mt-4 group">
                <summary className="cursor-pointer list-none text-white text-sm font-semibold underline underline-offset-4 decoration-1 min-h-[44px] flex items-center" style={{ textDecorationColor: OURO }}>
                  De onde saiu esse número?
                </summary>
                <div className="mt-3 border border-white/10 bg-black/40 p-4 text-sm text-gray-200 leading-relaxed">
                  Divide a quantidade pelo volume:<br />
                  <strong className="text-white">{formatarMg(vMg.valor)} mg ÷ {formatarMl(vMl.valor)} mL = {formatarConcentracao(concentracao)} mg/mL</strong>
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {/*
        Opcional, e cosmético de propósito: escolher um nome muda o rótulo do
        resultado e nada mais. Nenhum campo é preenchido, nenhuma quantidade é
        sugerida, e a conta é idêntica para todos os itens da lista — o nome
        existe para quem chegou pela palavra reconhecer que está no lugar
        certo, não para a ferramenta fingir que sabe algo sobre o frasco.
      */}
      {tipo === "peptideo" && concentracao != null && (
        <div className="mt-5">
          <label htmlFor={`${uid}-composto`} className="block text-gray-300 text-sm font-medium mb-2">
            Qual composto está no frasco? <span className="text-gray-500">(opcional)</span>
          </label>
          <select
            id={`${uid}-composto`}
            value={composto}
            onChange={(e) => { setComposto(e.target.value); if (e.target.value) trackEvent("compound_selected", { placement }); }}
            className="w-full sm:w-80 bg-black border border-white/25 focus:border-[#BA9E50] text-white px-4 py-3 outline-none transition-colors min-h-[44px]"
            aria-describedby={`${uid}-composto-ajuda`}
          >
            <option value="">Não quero escolher</option>
            {COMPOSTOS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <p id={`${uid}-composto-ajuda`} className="text-gray-400 text-sm mt-2">
            Serve só para nomear o resultado. A conta é a mesma para qualquer composto, e nenhum valor é preenchido por você.
          </p>
        </div>
      )}

      {/* Agora sim a explicação: com o número na tela, o conceito gruda. */}
      <dl className="grid grid-cols-3 gap-2 sm:gap-3 mt-6 mb-7">
        {[
          ["mg", "É a substância. Quanto dela tem no frasco."],
          ["mL", "É o líquido. Quanto dele tem no frasco."],
          ["mg/mL", "Junta os dois: quanta substância tem em cada mL."],
        ].map(([t, d]) => (
          <div key={t} className="border border-white/15 p-3 sm:p-4">
            <dt className="text-white font-bold text-xl sm:text-2xl leading-none mb-1.5" style={h}>{t}</dt>
            <dd className="text-gray-400 text-xs sm:text-sm leading-snug">{d}</dd>
          </div>
        ))}
      </dl>

      {concentracao != null && (
        <>
          {/* Aviso de segurança: curto, antes da seringa. */}
          <div role="note" className="border border-white/25 bg-black/50 p-4 sm:p-5 mb-7">
            <p className="text-white text-sm sm:text-base leading-relaxed font-semibold">
              Esta ferramenta explica concentração e volume. Ela não determina quanto você deve injetar. Use somente uma quantidade previamente orientada por profissional habilitado e confirme qualquer divergência antes da administração.
            </p>
          </div>

          {/* Passo 2: a seringa */}
          <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight mb-3" style={h}>Entenda a escala da seringa</h3>

          <div className="mb-6">
            <div>
              <p id={`${uid}-esc-rot`} className="text-white font-semibold mb-2">Pegue a sua seringa e confira uma coisa</p>
              <p className="text-gray-300 leading-relaxed mb-3">
                Olhe o corpo da seringa. Perto da marca de 1 mL costuma estar escrito <strong className="text-white">U-100</strong> — é a seringa de insulina que se compra em farmácia, e é a que esta calculadora entende. Não importa se a sua é a pequena ou a grande: importa esse código.
              </p>
              <div role="radiogroup" aria-labelledby={`${uid}-esc-rot`} className="flex flex-wrap gap-2">
                {([["sim", "Confere, está escrito U-100"], ["nao", "Está escrito outra coisa"]] as const).map(([id, rot]) => (
                  <button key={id} type="button" role="radio" aria-checked={escalaOk === id} onClick={() => setEscalaOk(id)}
                    className={`px-4 py-2.5 text-sm font-medium border transition-colors min-h-[44px] ${escalaOk === id ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/40"}`}>
                    {rot}
                  </button>
                ))}
              </div>
              {escalaOk === null && (
                <p className="text-gray-400 text-xs leading-relaxed mt-2">
                  É a única vez que a gente vai falar nesse código. Depois disso é português.
                </p>
              )}
              {escalaOk === "nao" && (
                <div role="alert" className="border border-white/40 bg-black/60 p-4 sm:p-5 mt-4">
                  <p className="text-white font-bold text-lg mb-2" style={h}>Então pare por aqui</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    Existem seringas com outra régua. A mais comum é a U-40, de insulina veterinária: nela 1 mL comporta 40 unidades, então cada marquinha vale 0,025 mL em vez de 0,01. Na prática, a marquinha 5 seria 0,125 mL — duas vezes e meia mais líquido do que numa seringa de farmácia.
                  </p>
                  <p className="text-white text-sm leading-relaxed font-semibold">
                    A conta desta página não serve para essa seringa. Confirme com o farmacêutico qual dispositivo usar antes de qualquer coisa.
                  </p>
                </div>
              )}
              {escalaOk === "sim" && (
                <details className="mt-3 group">
                  <summary className="cursor-pointer list-none text-white text-sm font-semibold underline underline-offset-4 decoration-1 min-h-[44px] flex items-center" style={{ textDecorationColor: OURO }}>
                    A minha é de 50, não de 100. Muda alguma coisa?
                  </summary>
                  <p className="text-gray-300 leading-relaxed mt-3">
                    Não muda nada na conta. A seringa de 30, a de 50 e a de 100 têm a mesma régua — o que muda é só até onde ela vai. A marquinha 5 é 0,05 mL nas três. Use a que couber na quantidade que você precisa.
                  </p>
                </details>
              )}
            </div>
          </div>

          {podeSeringa && (
            <>
              {/* U-100 em destaque */}
              <div className="border border-white/15 p-5 sm:p-6 mb-6">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: OURO }}>Na sua seringa</p>
                <p className="text-white font-bold text-2xl sm:text-3xl leading-tight mb-3" style={h}>Cada marquinha vale 0,01 mL</p>
                <p className="text-gray-300 leading-relaxed mb-3">
                  Dez marquinhas dão 0,10 mL. Cinquenta dão 0,50 mL. Cem enchem 1 mL. Se o líquido não é insulina, esses risquinhos são só medida de volume: é quanto líquido cabe ali, nada além disso.
                </p>
                <details className="group" onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) trackEvent("u100_education_open", { placement }); }}>
                  <summary className="cursor-pointer list-none text-white text-sm font-semibold underline underline-offset-4 decoration-1 min-h-[44px] flex items-center" style={{ textDecorationColor: OURO }}>
                    A marquinha 10 não é “10 UI” do que está no meu frasco?
                  </summary>
                  <p className="text-gray-300 leading-relaxed mt-3">
                    Não. Essa seringa foi feita para insulina, e é com insulina que os risquinhos viram unidades de verdade. Com outro líquido dentro, a marquinha 10 continua sendo 0,10 mL de volume, mas isso não significa que o outro composto possua 10 unidades internacionais. UI não tem conversão fixa para mg: muda de substância para substância. Por isso aqui a gente diz “marquinha 10”, e nunca “10 UI”.
                  </p>
                </details>
              </div>

              {/*
                O caminho inverso. Ele existe porque metade das pessoas chega
                com o número já na mão — o prescritor falou em mg, e a seringa
                fala em marca. O que mantém isto do lado da explicação é o
                enunciado do campo: ele pergunta o que foi PRESCRITO, não o
                que a pessoa quer. E a saída não arredonda para a marca
                "certa": 10,4 aparece como 10,4, porque uma quantidade que não
                cai numa marca é uma conversa com o prescritor, não um
                arredondamento que a ferramenta faz sozinha.
              */}
              <div className="border border-white/15 p-5 sm:p-6 mb-6">
                <p className="text-white font-bold text-lg mb-2" style={h}>Converter a dose prescrita em mL e na marquinha</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Se um profissional habilitado já passou a dose em mg, veja quantos mL ela dá e em que marquinha desta seringa ela cai. A ferramenta não escolhe a dose: ela só converte a que você informou.
                </p>
                <div className="flex items-center gap-3 max-w-xs mb-3">
                  <label htmlFor={`${uid}-presc`} className="sr-only">Dose prescrita em mg</label>
                  <input id={`${uid}-presc`} type="text" inputMode="decimal" autoComplete="off" placeholder="2,5" value={mgPrescritoTxt}
                    onChange={(e) => { setMgPrescritoTxt(e.target.value); setUltimoAjuste("dose"); }} className={inputCls} aria-describedby={`${uid}-presc-saida`} />
                  <span className="text-gray-300 text-lg">mg</span>
                </div>
                <div id={`${uid}-presc-saida`} aria-live="polite">
                  {mgPrescritoTxt && vMgPrescrito.erro && vMgPrescrito.erro !== "vazio" && (
                    <p className="text-gray-400 text-sm">{MENSAGEM_ERRO[vMgPrescrito.erro]}</p>
                  )}
                  {prescrito?.status === "ok" && (
                    <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.06] p-4 sm:p-5">
                      <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: OURO }}>Puxe até a</p>
                      <p className="text-white font-bold text-4xl sm:text-5xl leading-none mb-2" style={h}>
                        marquinha {formatarMarca(prescrito.marcaAproximada)}
                      </p>
                      <p className="text-gray-300 leading-relaxed mb-3">
                        São {formatarMlFino(prescrito.volumeMl)} mL de líquido.
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        A conta: {formatarMg(prescrito.mgPrescrito)} mg ÷ {formatarConcentracao(concentracao)} mg/mL = {formatarMlFino(prescrito.volumeMl)} mL, e cada marquinha vale 0,01 mL.
                      </p>
                      {!Number.isInteger(prescrito.marcaAproximada) && (
                        <p className="text-gray-300 text-sm leading-relaxed mb-3">
                          Repare que não cai numa marquinha inteira. Seringa não tem precisão de décimo de marquinha — se a diferença importa no seu caso, quem resolve isso é quem prescreveu.
                        </p>
                      )}
                      <p className="text-white text-sm leading-relaxed font-semibold">
                        Confira este número com quem prescreveu antes de usar. A ferramenta conferiu a matemática, não a adequação ao seu caso.
                      </p>
                    </div>
                  )}
                  {prescrito?.status === "fora_da_seringa" && (
                    <div role="alert" className="border border-white/40 bg-black/60 p-4">
                      <p className="text-white font-semibold leading-relaxed mb-2">Essa dose não cabe nesta seringa</p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Nesta concentração, {formatarMg(prescrito.mgPrescrito)} mg ocupariam {formatarMlFino(prescrito.volumeMl)} mL, e a maior dessas seringas vai só até 1,00 mL. Isso costuma significar que a concentração informada ou a quantidade estão trocadas. Confirme as duas com o prescritor ou o farmacêutico.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/*
                O desenho vem AQUI, colado na resposta. Quem digita a dose
                quer ver o êmbolo parar num lugar — a régua sozinha, longe do
                número, é decoração. Ele acompanha a última entrada que a
                pessoa tocou: a dose enquanto ela digita, o slider quando ela
                resolve explorar.
              */}
              <div className="mb-6">
                <SeringaU100 marca={marcaDesenhada} id={`${uid}-seringa`} />
              </div>

              {/* A marquinha, para explorar a régua */}
              <div className="mb-6">
                <label htmlFor={`${uid}-marca`} className="block text-gray-300 text-sm font-medium mb-2">Qual marquinha você quer conferir?</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                  <input id={`${uid}-marca`} type="text" inputMode="numeric" autoComplete="off" placeholder="10" value={marcaTxt}
                    onChange={(e) => { setMarcaTxt(e.target.value); const v = validarMarca(e.target.value); escolherMarca(v.valor); }}
                    className="w-full sm:w-32 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors" aria-describedby={`${uid}-marca-ajuda`} />
                  <input type="range" min={0} max={MARCA_MAX} step={1} value={marca ?? 0} onChange={(e) => escolherMarca(Number(e.target.value) || null)}
                    aria-label="Deslize para escolher a marquinha" className="w-full accent-[#BA9E50]" />
                </div>
                <p id={`${uid}-marca-ajuda`} className="text-gray-400 text-sm min-h-[20px]">
                  {marcaTxt && validarMarca(marcaTxt).erro ? `Use um número inteiro de ${MARCA_MIN} a ${MARCA_MAX}.` : "Mexa aqui para explorar a régua. O desenho acima acompanha."}
                </p>
              </div>

              {/* Resultado 2 */}
              <div aria-live="polite" className="mb-6">
                {leitura && (
                  <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.06] p-5 sm:p-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: OURO }}>Marquinha</p>
                        <p className="text-white font-bold text-3xl leading-none" style={h}>{leitura.marca}<span className="text-base font-normal text-gray-300"> da seringa</span></p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: OURO }}>Volume correspondente</p>
                        <p className="text-white font-bold text-3xl leading-none" style={h}>{formatarMl(leitura.volumeMl)}<span className="text-base font-normal text-gray-300"> mL</span></p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: OURO }}>Quantidade contida nesse volume</p>
                        <p className="text-white font-bold text-3xl leading-none" style={h}>{formatarMg(leitura.mg)}<span className="text-base font-normal text-gray-300"> mg</span></p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mt-4 mb-3">
                      A conta: {formatarConcentracao(concentracao)} mg em cada mL × {formatarMl(leitura.volumeMl)} mL = {formatarMg(leitura.mg)} mg. É o que tem dentro desse volume.
                    </p>
                    <p className="text-white text-sm leading-relaxed font-semibold">Isso é só a medida do que existe nesse volume. Não é uma recomendação de quanto usar.</p>
                  </div>
                )}
              </div>

              {/* As três camadas, com os números da pessoa */}
              <div className="border border-white/15 p-5 sm:p-6 mb-6">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: OURO }}>O caminho todo, passo a passo</p>
                <ol className="grid gap-2 sm:grid-cols-2">
                  {[
                    modo === "calcular" && vMg.valor != null ? [`${formatarMg(vMg.valor)} mg`, "de substância no frasco"] : null,
                    modo === "calcular" && vMl.valor != null ? [`${formatarMl(vMl.valor)} mL`, "de líquido no frasco"] : null,
                    [`${formatarConcentracao(concentracao)} mg/mL`, "logo, tem isso em cada mL"],
                    leitura ? [`Marquinha ${leitura.marca}`, "a que você escolheu"] : ["Marquinha ?", "escolha uma acima"],
                    leitura ? [`${formatarMl(leitura.volumeMl)} mL`, "é o volume dessa marquinha"] : null,
                    leitura ? [`${formatarMg(leitura.mg)} mg`, "é o que tem nesse volume"] : null,
                  ].filter((x): x is [string, string] => !!x).map(([v, r], i, arr) => (
                    <li key={r} className="flex items-baseline gap-3">
                      <span className="text-gray-500 text-sm font-semibold w-5 shrink-0">{i + 1}.</span>
                      <span><strong className="text-white text-lg" style={h}>{v}</strong> <span className="text-gray-400 text-sm">— {r}{i < arr.length - 1 ? " ↓" : ""}</span></span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tabela educacional */}
              <div className="mb-6">
                <p className="text-white font-semibold mb-2">A régua inteira desse frasco</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-400 border-b border-white/15"><th className="py-2 pr-3 font-medium">Marquinha</th><th className="py-2 pr-3 font-medium">Volume</th><th className="py-2 font-medium">Quantidade contida nessa concentração</th></tr></thead>
                    <tbody>
                      {tabela.map((l) => (
                        <tr key={l.marca} className="border-b border-white/10 text-gray-200"><td className="py-2 pr-3 font-semibold text-white">{l.marca}</td><td className="py-2 pr-3">{formatarMl(l.volumeMl)} mL</td><td className="py-2">{formatarMg(l.mg)} mg</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mt-2">Nenhuma linha é sugestão. Está tudo aqui só para você ver que, quanto mais volume, mais substância — sempre na mesma proporção.</p>
              </div>

              {/* Cuidado com um zero */}
              <div className="border border-white/25 bg-black/50 p-5 mb-6">
                <p className="text-white font-bold text-lg mb-2" style={h}>Cuidado com um zero</p>
                <p className="text-gray-300 leading-relaxed mb-3">
                  A marquinha 5 é 0,05 mL. A marquinha 50 é 0,50 mL. Um zero a mais e o volume fica dez vezes maior. Nesse seu frasco: na marquinha 5 tem {formatarMg(lerMarca(concentracao, 5)!.mg)} mg; na marquinha 50 tem {formatarMg(lerMarca(concentracao, 50)!.mg)} mg.
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">A FDA já registrou erros assim em injetáveis manipulados. Não é para ter medo: é para conferir a marquinha duas vezes antes de usar.</p>
              </div>

              {/* Conferir uma instrução */}
              <details className="border border-white/15 p-5 sm:p-6" open={conferirAberto} onToggle={(e) => {
                const aberto = (e.currentTarget as HTMLDetailsElement).open; setConferirAberto(aberto);
                if (aberto && !jaAbriuConferir.current) { jaAbriuConferir.current = true; trackEvent("instruction_check_open", { placement }); }
              }}>
                <summary className="cursor-pointer list-none min-h-[44px] flex items-center justify-between gap-3">
                  <span className="text-white font-bold text-lg" style={h}>Conferir uma instrução que recebi</span>
                  <span aria-hidden="true" className="text-[#BA9E50] text-2xl leading-none">+</span>
                </summary>
                <p className="text-gray-400 text-sm leading-relaxed mt-3 mb-4">
                  Use este recurso somente para conferir a consistência matemática de uma orientação já fornecida por profissional habilitado. Ele compara o que você recebeu com a concentração acima.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 mb-4">
                  <div>
                    <label htmlFor={`${uid}-mginfo`} className="block text-gray-300 text-sm font-medium mb-2">Quantidade informada pelo profissional</label>
                    <div className="flex items-center gap-3">
                      <input id={`${uid}-mginfo`} type="text" inputMode="decimal" autoComplete="off" placeholder="2,4" value={mgInfoTxt} onChange={(e) => setMgInfoTxt(e.target.value)} className={inputCls} />
                      <span className="text-gray-300 text-lg">mg</span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`${uid}-marcainfo`} className="block text-gray-300 text-sm font-medium mb-2">Marquinha informada pelo profissional</label>
                    <div className="flex items-center gap-3">
                      <input id={`${uid}-marcainfo`} type="text" inputMode="numeric" autoComplete="off" placeholder="10" value={marcaInfoTxt} onChange={(e) => setMarcaInfoTxt(e.target.value)} className={inputCls} />
                      <span className="text-gray-300 text-lg whitespace-nowrap">da seringa</span>
                    </div>
                  </div>
                </div>
                <div aria-live="polite">
                  {conferencia?.status === "compativel" && (
                    <div className="border border-white/25 p-4">
                      <p className="text-white font-semibold mb-2">A matemática informada é compatível com a concentração cadastrada.</p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {formatarConcentracao(concentracao)} mg/mL · marquinha {conferencia.marca} = {formatarMl(conferencia.volumeMl)} mL · contém {formatarMg(conferencia.mgContido)} mg. Isso confere a conta, não a adequação clínica: quem decide a quantidade é o prescritor.
                      </p>
                    </div>
                  )}
                  {conferencia?.status === "nao_corresponde" && (
                    <div role="alert" className="border border-white/40 bg-black/60 p-4">
                      <p className="text-white font-bold text-lg mb-2" style={h}>Os números não correspondem</p>
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">
                        A quantidade em mg, a concentração e a marquinha informadas não são matematicamente compatíveis. Na concentração de {formatarConcentracao(concentracao)} mg/mL, a marquinha {conferencia.marca} ({formatarMl(conferencia.volumeMl)} mL) contém {formatarMg(conferencia.mgContido)} mg, e a instrução fala em {formatarMg(conferencia.mgInformado)} mg.
                      </p>
                      <p className="text-white text-sm leading-relaxed font-semibold">Não ajuste por conta própria. Confirme a concentração do frasco e a orientação com o prescritor ou farmacêutico antes de usar.</p>
                    </div>
                  )}
                  {(mgInfoTxt || marcaInfoTxt) && !conferencia && (
                    <p className="text-gray-400 text-sm">Preencha os dois campos com números válidos (marquinha inteira de {MARCA_MIN} a {MARCA_MAX}).</p>
                  )}
                </div>
              </details>
            </>
          )}
        </>
      )}
    </div>
  );
}
