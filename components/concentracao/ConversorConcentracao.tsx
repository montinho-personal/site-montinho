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
import CTAEstrategiaTreino from "./CTAEstrategiaTreino";

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
 * A trava de insulina, e por que ela deixou de ser uma pergunta.
 *
 * Havia um passo antes de tudo: "o líquido é insulina?". Todo mundo
 * respondia, para atender um caso — um obstáculo para cem por causa de um.
 * Agora insulina é uma opção do seletor de composto, e escolhê-la leva ao
 * aviso em vez do resultado. A trava é a mesma; o que sumiu foi o pedágio.
 */
const ID_INSULINA = "insulina";

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

/*
 * Um acordeão de explicação: fechado por padrão, e sempre depois da resposta.
 * Fica FORA do componente de propósito — declarado dentro do render, ele
 * seria um tipo novo a cada teclada, e o React desmontaria e remontaria cada
 * bloco, perdendo o que estivesse aberto e o que estivesse digitado dentro.
 */
function Explica({ titulo, children, ao }: { titulo: string; children: React.ReactNode; ao?: () => void }) {
  return (
    <details
      className="border border-white/15 px-5 py-1 sm:px-6"
      onToggle={(e) => { if ((e.currentTarget as HTMLDetailsElement).open) ao?.(); }}
    >
      <summary className="cursor-pointer list-none min-h-[52px] flex items-center justify-between gap-3">
        <span className="text-white font-semibold" style={h}>{titulo}</span>
        <span aria-hidden="true" className="text-[#BA9E50] text-2xl leading-none shrink-0">+</span>
      </summary>
      <div className="pb-5">{children}</div>
    </details>
  );
}

export default function ConversorConcentracao({ placement }: { placement: string }) {
  const uid = useId();
  const raiz = useRef<HTMLDivElement>(null);

  const [modo, setModo] = useState<Modo>("calcular");
  const [mgTxt, setMgTxt] = useState("");
  const [mlTxt, setMlTxt] = useState("");
  const [concTxt, setConcTxt] = useState("");
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
  const ehInsulina = composto === ID_INSULINA;
  const nome = ehInsulina ? null : nomeDoComposto(composto || null);

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
        Quanto puxar na seringa
      </h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        Três campos e a resposta aparece. As explicações ficam no fim, para quem quiser.
      </p>

      {/*
        OS CAMPOS, TODOS JUNTOS.
        A versão anterior alternava campo e parágrafo: preenchia, lia três
        blocos, preenchia de novo, lia mais. Quem chega com o frasco na mão
        quer a resposta, não uma aula intercalada. Agora o que se preenche
        fica todo num lugar, a resposta vem logo abaixo, e tudo o que explica
        virou acordeão fechado no fim.
      */}
      <div className="grid gap-4 sm:grid-cols-2">
        {modo === "calcular" ? (
          <>
            <div>
              <label htmlFor={`${uid}-mg`} className="block text-gray-300 text-sm font-medium mb-2">1. Quanto o rótulo declara</label>
              <div className="flex items-center gap-3">
                <input id={`${uid}-mg`} type="text" inputMode="decimal" autoComplete="off" placeholder="60" value={mgTxt} onChange={(e) => setMgTxt(e.target.value)} className={inputCls} aria-describedby={`${uid}-mg-ajuda`} />
                <span className="text-gray-300 text-lg">mg</span>
              </div>
              <p id={`${uid}-mg-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
                {vMg.erro && vMg.erro !== "vazio" ? MENSAGEM_ERRO[vMg.erro] : "O total que vem no frasco."}
              </p>
            </div>
            <div>
              <label htmlFor={`${uid}-ml`} className="block text-gray-300 text-sm font-medium mb-2">2. Quanta água foi usada para diluir</label>
              <div className="flex items-center gap-3">
                <input id={`${uid}-ml`} type="text" inputMode="decimal" autoComplete="off" placeholder="2,5" value={mlTxt} onChange={(e) => setMlTxt(e.target.value)} className={inputCls} aria-describedby={`${uid}-ml-ajuda`} />
                <span className="text-gray-300 text-lg">mL</span>
              </div>
              <p id={`${uid}-ml-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
                {vMl.erro && vMl.erro !== "vazio" ? MENSAGEM_ERRO[vMl.erro] : "Água bacteriostática ou água para injeção. Se o frasco já veio pronto, é o volume do rótulo."}
              </p>
            </div>
          </>
        ) : (
          <div>
            <label htmlFor={`${uid}-conc`} className="block text-gray-300 text-sm font-medium mb-2">1. Concentração do frasco</label>
            <div className="flex items-center gap-3">
              <input id={`${uid}-conc`} type="text" inputMode="decimal" autoComplete="off" placeholder="24" value={concTxt} onChange={(e) => setConcTxt(e.target.value)} className={inputCls} aria-describedby={`${uid}-conc-ajuda`} />
              <span className="text-gray-300 text-lg whitespace-nowrap">mg/mL</span>
            </div>
            <p id={`${uid}-conc-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
              {vConc.erro && vConc.erro !== "vazio" ? MENSAGEM_ERRO[vConc.erro] : "Como está escrito no rótulo."}
            </p>
          </div>
        )}

        <div>
          <label htmlFor={`${uid}-presc`} className="block text-gray-300 text-sm font-medium mb-2">
            {modo === "calcular" ? "3." : "2."} Qual dosagem o profissional indicou
          </label>
          <div className="flex items-center gap-3">
            <input id={`${uid}-presc`} type="text" inputMode="decimal" autoComplete="off" placeholder="2,5" value={mgPrescritoTxt}
              onChange={(e) => { setMgPrescritoTxt(e.target.value); setUltimoAjuste("dose"); }} className={inputCls} aria-describedby={`${uid}-presc-ajuda`} />
            <span className="text-gray-300 text-lg">mg</span>
          </div>
          <p id={`${uid}-presc-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            {mgPrescritoTxt && vMgPrescrito.erro && vMgPrescrito.erro !== "vazio" ? MENSAGEM_ERRO[vMgPrescrito.erro] : "A dose que já foi prescrita para você."}
          </p>
        </div>

        {/*
          O composto é opcional e cosmético — muda o rótulo do resultado e
          nada mais. A exceção é "Insulina", que aqui funciona como saída: ela
          substituiu a pergunta separada que todo mundo respondia antes de ver
          qualquer campo.
        */}
        <div>
          <label htmlFor={`${uid}-composto`} className="block text-gray-300 text-sm font-medium mb-2">
            O que tem no frasco <span className="text-gray-500 font-normal">(opcional)</span>
          </label>
          <select
            id={`${uid}-composto`}
            value={composto}
            onChange={(e) => { setComposto(e.target.value); if (e.target.value) trackEvent("compound_selected", { placement }); }}
            className="w-full bg-black border border-white/25 focus:border-[#BA9E50] text-white px-4 py-[13px] outline-none transition-colors min-h-[52px]"
            aria-describedby={`${uid}-composto-ajuda`}
          >
            <option value="">Prefiro não dizer</option>
            {COMPOSTOS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <p id={`${uid}-composto-ajuda`} className="text-gray-400 text-sm mt-2 min-h-[20px]">
            Só nomeia o resultado. A conta é a mesma para todos.
          </p>
        </div>
      </div>

      {modo === "calcular" && (
        <button
          type="button"
          onClick={() => setModo("concentracao")}
          className="text-gray-400 text-sm underline underline-offset-4 decoration-1 hover:text-white transition-colors min-h-[44px]"
          style={{ textDecorationColor: OURO }}
        >
          O rótulo já diz a concentração em mg/mL
        </button>
      )}
      {modo === "concentracao" && (
        <button
          type="button"
          onClick={() => setModo("calcular")}
          className="text-gray-400 text-sm underline underline-offset-4 decoration-1 hover:text-white transition-colors min-h-[44px]"
          style={{ textDecorationColor: OURO }}
        >
          Prefiro calcular pela quantidade e pelo volume
        </button>
      )}

      {/*
        A conferência da escala só aparece quando já há o que responder. Pedir
        antes seria mais um obstáculo antes do primeiro número — e ela existe
        para proteger a RESPOSTA, não a digitação. O motivo dela está no
        comentário de EscalaOk: a seringa U-40 erra por 2,5×.
      */}
      {ehInsulina ? null : concentracao != null && vMgPrescrito.valor != null && (
        <div className="mt-5 border-l-2 pl-4" style={{ borderColor: OURO }}>
          <p id={`${uid}-esc-rot`} className="text-white font-semibold mb-2">Antes da resposta: na sua seringa está escrito U-100?</p>
          <div role="radiogroup" aria-labelledby={`${uid}-esc-rot`} className="flex flex-wrap gap-2">
            {([["sim", "Sim, está"], ["nao", "Está escrito outra coisa"]] as const).map(([id, rot]) => (
              <button key={id} type="button" role="radio" aria-checked={escalaOk === id} onClick={() => setEscalaOk(id)}
                className={`px-4 py-2.5 text-sm font-medium border transition-colors min-h-[44px] ${escalaOk === id ? "border-[#BA9E50] text-white bg-[#BA9E50]/10" : "border-white/20 text-gray-300 hover:border-white/40"}`}>
                {rot}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= A RESPOSTA ================= */}
      <div aria-live="polite" className="mt-6">
        {ehInsulina ? (
          <div role="alert" className="border border-white/30 bg-black/60 p-5">
            <p className="text-white font-semibold leading-relaxed mb-3">
              Esta ferramenta não calcula doses de insulina. Use exatamente a concentração, dispositivo e quantidade prescritos para o produto específico. Não converta entre concentrações ou seringas por conta própria.
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Para insulina, as unidades da escala são unidades da própria insulina, e existem produtos em concentrações diferentes (U-100, U-200, U-300, U-500) que não se convertem por regra de três.{" "}
              {fonteInsulina && <a href={linkDaFonte(fonteInsulina)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 decoration-1 hover:text-white transition-colors" onClick={() => trackEvent("source_open", { placement, fonte: fonteInsulina.id })}>A insulina está na lista de medicamentos de alto risco do ISMP</a>}.
            </p>
          </div>
        ) : escalaOk === "nao" ? (
          <div role="alert" className="border border-white/40 bg-black/60 p-5">
            <p className="text-white font-bold text-lg mb-2" style={h}>Então pare por aqui</p>
            <p className="text-gray-300 text-sm leading-relaxed mb-3">
              A mais comum das outras é a U-40, de insulina veterinária: nela cada marquinha vale 0,025 mL em vez de 0,01, então a marquinha 5 seria 0,125 mL — duas vezes e meia mais líquido do que numa seringa de farmácia.
            </p>
            <p className="text-white text-sm leading-relaxed font-semibold">
              A conta desta página não serve para essa seringa. Confirme com o farmacêutico qual dispositivo usar.
            </p>
          </div>
        ) : prescrito?.status === "fora_da_seringa" ? (
          <div role="alert" className="border border-white/40 bg-black/60 p-5">
            <p className="text-white font-semibold leading-relaxed mb-2">Essa dose não cabe nesta seringa</p>
            <p className="text-gray-300 text-sm leading-relaxed">
              Nesta concentração, {formatarMg(prescrito.mgPrescrito)} mg ocupariam {formatarMlFino(prescrito.volumeMl)} mL, e a maior dessas seringas vai só até 1,00 mL. Isso costuma significar que a concentração informada ou a quantidade estão trocadas. Confirme as duas com o prescritor ou o farmacêutico.
            </p>
          </div>
        ) : prescrito?.status === "ok" && escalaOk === "sim" ? (
          <div className="border border-[#BA9E50]/40 bg-[#BA9E50]/[0.06] p-5 sm:p-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: OURO }}>Puxe até a</p>
            <p className="text-white font-bold text-5xl sm:text-6xl leading-none mb-3" style={h}>
              marquinha {formatarMarca(prescrito.marcaAproximada)}
            </p>
            <div className="mb-4">
              <SeringaU100 marca={marcaDesenhada} id={`${uid}-seringa`} />
            </div>
            <p className="text-gray-200 leading-relaxed mb-1">
              São <strong className="text-white">{formatarMlFino(prescrito.volumeMl)} mL</strong>{nome ? ` do seu frasco de ${nome.toLowerCase()}` : ""}, que está a <strong className="text-white">{formatarConcentracao(concentracao!)} mg/mL</strong>.
            </p>
            {!Number.isInteger(prescrito.marcaAproximada) && (
              <p className="text-gray-300 text-sm leading-relaxed mt-3">
                Repare que não cai numa marquinha inteira. Seringa não tem precisão de décimo de marquinha — se a diferença importa no seu caso, quem resolve isso é quem prescreveu.
              </p>
            )}
            <p className="text-white text-sm leading-relaxed font-semibold mt-3">
              Confira este número com quem prescreveu antes de usar. A ferramenta conferiu a matemática, não a adequação ao seu caso.
            </p>
            <button
              type="button"
              onClick={() => {
                const linha = `Frasco: ${formatarConcentracao(concentracao!)} mg/mL${nome ? ` (${nome})` : ""} · ${formatarMg(prescrito.mgPrescrito)} mg = ${formatarMlFino(prescrito.volumeMl)} mL = marquinha ${formatarMarca(prescrito.marcaAproximada)} da seringa`;
                navigator.clipboard?.writeText(linha).then(() => {
                  setCopiado(true);
                  trackEvent("result_copied", { placement });
                  setTimeout(() => setCopiado(false), 2500);
                }).catch(() => setCopiado(false));
              }}
              className="mt-4 text-sm font-semibold text-white underline underline-offset-4 decoration-1 min-h-[44px] hover:opacity-80 transition-opacity"
              style={{ textDecorationColor: OURO }}
            >
              {copiado ? "Copiado" : "Copiar para mandar a quem prescreveu"}
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: OURO }}>
            {concentracao == null
              ? "Preencha o frasco para começar. Se o rótulo não diz a quantidade e o volume, não dá para saber a concentração — e a ferramenta não chuta."
              : vMgPrescrito.valor == null
                ? `Seu frasco está a ${formatarConcentracao(concentracao)} mg/mL. Informe a dose prescrita para ver a marquinha.`
                : "Responda sobre a seringa para ver a resposta."}
          </p>
        )}
      </div>

      {/*
        A TABELA DE CONVERSÃO DO FRASCO DA PESSOA.
        Ela existe porque a pergunta "e se fosse outra quantidade?" vem logo
        depois da primeira resposta, e mandar a pessoa apagar o campo e
        digitar de novo é atrito à toa.

        O que ela NÃO é, e a distinção é o motivo de ela poder existir: não é
        uma lista de quantidades usadas, nem por substância nem por
        protocolo. As linhas saem das marquinhas redondas da seringa — 5, 10,
        15… — e a coluna de mg é o que essas marquinhas contêm NESTE frasco.
        É aritmética do frasco informado, lida de trás para frente.

        Uma tabela de "tirzepatida: 2,5 / 5 / 7,5 mg" seria outra coisa: um
        banco de doses, que o briefing da ferramenta proibiu e que
        scripts/concentracao-test.ts reprova. Fora que para parte dos
        compostos dessa lista não existe esquema aprovado nenhum — publicar
        um seria inventar autoridade.
      */}
      {prescrito?.status === "ok" && escalaOk === "sim" && !ehInsulina && (
        <div className="mt-6 border border-white/15 p-5 sm:p-6">
          <p className="text-white font-semibold mb-1" style={h}>Conversão rápida do seu frasco</p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            A {formatarConcentracao(concentracao!)} mg/mL, é isto que cada marquinha da sua seringa contém.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-white/15">
                  <th className="py-2 pr-3 font-medium">Quantidade</th>
                  <th className="py-2 pr-3 font-medium">Volume</th>
                  <th className="py-2 font-medium">Marquinha</th>
                </tr>
              </thead>
              <tbody>
                {tabela.map((l) => (
                  <tr key={l.marca} className={`border-b border-white/10 ${prescrito.marcaAproximada >= l.marca - 0.5 && prescrito.marcaAproximada < l.marca + 0.5 ? "text-white bg-[#BA9E50]/10" : "text-gray-200"}`}>
                    <td className="py-2 pr-3 font-semibold text-white">{formatarMg(l.mg)} mg</td>
                    <td className="py-2 pr-3">{formatarMl(l.volumeMl)} mL</td>
                    <td className="py-2 font-semibold" style={{ color: OURO }}>{l.marca}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed mt-3">
            Nenhuma linha é sugestão de quanto usar. A tabela mostra o que existe em cada marquinha deste frasco — quem define a quantidade é quem prescreveu.
          </p>
        </div>
      )}

      {/*
        O CTA entra AQUI, e só quando existe resposta na tela. É o momento de
        maior atenção da página: a pessoa acabou de resolver o que veio
        resolver, e a pergunta seguinte dela — como treinar nessa fase — é
        justamente a que cabe a um treinador. Fora do cartão do resultado de
        propósito: dentro, a oferta se misturaria com a conversão de dose.
      */}
      {prescrito?.status === "ok" && escalaOk === "sim" && !ehInsulina && (
        <div className="mt-6">
          <CTAEstrategiaTreino placement="apos-resultado" />
        </div>
      )}

      <div role="note" className="border border-white/25 bg-black/50 p-4 mt-5">
        <p className="text-white text-sm leading-relaxed font-semibold">
          Esta ferramenta explica concentração e volume. Ela não determina quanto você deve injetar. Use somente uma quantidade previamente orientada por profissional habilitado e confirme qualquer divergência antes da administração.
        </p>
      </div>

      {/* ================= AS EXPLICAÇÕES, FECHADAS ================= */}
      {concentracao != null && !ehInsulina && (
        <div className="mt-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: OURO }}>Se quiser entender melhor</p>
          <div className="grid gap-2">
            <Explica titulo="De onde saiu esse número">
              <dl className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                {[
                  ["mg", "É a substância. Quanto dela tem no frasco."],
                  ["mL", "É o líquido. Quanto dele tem no frasco."],
                  ["mg/mL", "Junta os dois: quanta substância tem em cada mL."],
                ].map(([t, d]) => (
                  <div key={t} className="border border-white/15 p-3">
                    <dt className="text-white font-bold text-xl leading-none mb-1.5" style={h}>{t}</dt>
                    <dd className="text-gray-400 text-xs sm:text-sm leading-snug">{d}</dd>
                  </div>
                ))}
              </dl>
              <ol className="grid gap-2">
                {[
                  modo === "calcular" && vMg.valor != null ? [`${formatarMg(vMg.valor)} mg`, "de substância no frasco"] : null,
                  modo === "calcular" && vMl.valor != null ? [`${formatarMl(vMl.valor)} mL`, "de líquido no frasco"] : null,
                  [`${formatarConcentracao(concentracao)} mg/mL`, "logo, tem isso em cada mL"],
                  prescrito?.status === "ok" ? [`${formatarMlFino(prescrito.volumeMl)} mL`, "é o volume da dose prescrita"] : null,
                  prescrito?.status === "ok" ? [`Marquinha ${formatarMarca(prescrito.marcaAproximada)}`, "é onde esse volume cai na seringa"] : null,
                ].filter((x): x is [string, string] => !!x).map(([v, r], i, arr) => (
                  <li key={r} className="flex items-baseline gap-3">
                    <span className="text-gray-500 text-sm font-semibold w-5 shrink-0">{i + 1}.</span>
                    <span><strong className="text-white text-lg" style={h}>{v}</strong> <span className="text-gray-400 text-sm">— {r}{i < arr.length - 1 ? " ↓" : ""}</span></span>
                  </li>
                ))}
              </ol>
            </Explica>

            <Explica titulo="O que cada marquinha vale" ao={() => trackEvent("u100_education_open", { placement })}>
              <p className="text-gray-300 leading-relaxed mb-3">
                Cada marquinha vale 0,01 mL. Dez dão 0,10 mL, cinquenta dão 0,50 mL, cem enchem 1 mL. A seringa de 30, a de 50 e a de 100 têm a mesma régua — muda só até onde ela vai.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Se o líquido não é insulina, esses risquinhos são só medida de volume. A marquinha 10 continua sendo 0,10 mL, mas isso não significa que o outro composto possua 10 unidades internacionais. UI não tem conversão fixa para mg: muda de substância para substância. Por isso aqui a gente diz “marquinha 10”, e nunca “10 UI”.
              </p>
            </Explica>

            <Explica titulo="Ver o que tem em cada marquinha">
              <label htmlFor={`${uid}-marca`} className="block text-gray-300 text-sm font-medium mb-2">Escolha uma marquinha</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <input id={`${uid}-marca`} type="text" inputMode="numeric" autoComplete="off" placeholder="10" value={marcaTxt}
                  onChange={(e) => { setMarcaTxt(e.target.value); const v = validarMarca(e.target.value); escolherMarca(v.valor); }}
                  className="w-full sm:w-32 bg-black border border-white/25 focus:border-[#BA9E50] text-white text-2xl font-bold px-4 py-3 outline-none transition-colors" aria-describedby={`${uid}-marca-ajuda`} />
                <input type="range" min={0} max={MARCA_MAX} step={1} value={marca ?? 0} onChange={(e) => escolherMarca(Number(e.target.value) || null)}
                  aria-label="Deslize para escolher a marquinha" className="w-full accent-[#BA9E50]" />
              </div>
              <p id={`${uid}-marca-ajuda`} className="text-gray-400 text-sm mb-3 min-h-[20px]">
                {marcaTxt && validarMarca(marcaTxt).erro ? `Use um número inteiro de ${MARCA_MIN} a ${MARCA_MAX}.` : "O desenho lá em cima acompanha."}
              </p>
              <div aria-live="polite">
                {leitura && (
                  <div className="border border-white/20 p-4">
                    <p className="text-gray-200 leading-relaxed">
                      Marquinha <strong className="text-white">{leitura.marca}</strong> = <strong className="text-white">{formatarMl(leitura.volumeMl)} mL</strong> e contém <strong className="text-white">{formatarMg(leitura.mg)} mg</strong>.
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed mt-2">
                      A conta: {formatarConcentracao(concentracao)} mg em cada mL × {formatarMl(leitura.volumeMl)} mL. Isso é só a medida do que existe nesse volume, não uma recomendação de quanto usar.
                    </p>
                  </div>
                )}
              </div>
            </Explica>

            <Explica titulo="Cuidado com um zero">
              <p className="text-gray-300 leading-relaxed mb-3">
                A marquinha 5 é 0,05 mL. A marquinha 50 é 0,50 mL. Um zero a mais e o volume fica dez vezes maior. Nesse seu frasco: na marquinha 5 tem {formatarMg(lerMarca(concentracao, 5)!.mg)} mg; na marquinha 50 tem {formatarMg(lerMarca(concentracao, 50)!.mg)} mg.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">A FDA já registrou erros assim em injetáveis manipulados. Não é para ter medo: é para conferir a marquinha duas vezes antes de usar.</p>
            </Explica>

            <Explica titulo="Conferir uma instrução que recebi" ao={() => { if (!jaAbriuConferir.current) { jaAbriuConferir.current = true; trackEvent("instruction_check_open", { placement }); } }}>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Use somente para conferir a consistência matemática de uma orientação já fornecida por profissional habilitado.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mb-4">
                <div>
                  <label htmlFor={`${uid}-mginfo`} className="block text-gray-300 text-sm font-medium mb-2">Quantidade informada</label>
                  <div className="flex items-center gap-3">
                    <input id={`${uid}-mginfo`} type="text" inputMode="decimal" autoComplete="off" placeholder="2,4" value={mgInfoTxt} onChange={(e) => setMgInfoTxt(e.target.value)} className={inputCls} />
                    <span className="text-gray-300 text-lg">mg</span>
                  </div>
                </div>
                <div>
                  <label htmlFor={`${uid}-marcainfo`} className="block text-gray-300 text-sm font-medium mb-2">Marquinha informada</label>
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
                      Na concentração de {formatarConcentracao(concentracao)} mg/mL, a marquinha {conferencia.marca} ({formatarMl(conferencia.volumeMl)} mL) contém {formatarMg(conferencia.mgContido)} mg, e a instrução fala em {formatarMg(conferencia.mgInformado)} mg.
                    </p>
                    <p className="text-white text-sm leading-relaxed font-semibold">Não ajuste por conta própria. Confirme a concentração do frasco e a orientação com o prescritor ou farmacêutico antes de usar.</p>
                  </div>
                )}
                {(mgInfoTxt || marcaInfoTxt) && !conferencia && (
                  <p className="text-gray-400 text-sm">Preencha os dois campos com números válidos (marquinha inteira de {MARCA_MIN} a {MARCA_MAX}).</p>
                )}
              </div>
            </Explica>
          </div>
        </div>
      )}
    </div>
  );
}
