"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import ProjectionChart, { type Marco } from "./ProjectionChart";
import { DOURADO, InsightCard, MethodologyDrawer, NumericInput, OptionCards, ProgressBar, QuestionStep, ScenarioSelector, h, type Opcao } from "./ui";
import {
  ESTUDOS, NOTA_ESTIMATIVA, NOTA_PRIMEIRAS_SEMANAS, SEMANAS_MAX, TREINO,
  bloqueio, cenarioAtual, fmtFaixaSemanas, fmtKg, fmtKgProj, fmtSemanas, impactos, insight, parseAltura, parseNumero, projeta,
  validaBasicos, validaMeta, KCAL_MAX, KCAL_MIN,
  type Bloqueio, type Cenario, type FaixaPassos, type Hormonio, type Medicacao, type NivelComida, type Objetivo, type Perfil, type Rotina, type Sexo, type TipoTreino,
} from "@/lib/simulador/emagrecimento";

/**
 * O Simulador de Emagrecimento.
 *
 * PERGUNTA POR TELA
 *
 * Sete telas curtas em vez de um formulário de quinze campos. Cada tela
 * pergunta uma coisa (ou um grupo que a pessoa responde de uma vez, como
 * idade/altura/peso), diz por que pergunta e deixa seguir sem saber:
 * passos e calorias têm "não sei", meta tem "não tenho".
 *
 * PRIVACIDADE
 *
 * Tudo roda no navegador. Os eventos levam só o número da etapa e o nome
 * do controle mexido — nunca peso, altura, idade, sexo, medicação ou
 * hormônio, nem uma combinação que permita inferir isso. O CTA também não
 * muda de evento para quem usa caneta, porque isso revelaria o uso. As
 * respostas ficam em sessionStorage (somem ao fechar a aba) só para a
 * simulação não sumir se a pessoa abrir outra ferramenta e voltar.
 */

const CHAVE = "montinho:simulador-emagrecimento";
const TOTAL = 7;

interface Respostas {
  objetivo: Objetivo | null;
  idade: string; sexo: Sexo | null; altura: string; peso: string; gestante: boolean | null;
  semMeta: boolean; meta: string;
  rotina: Rotina | null; treinos: number | null; tipoTreino: TipoTreino | null;
  passos: FaixaPassos | null;
  sabeKcal: boolean | null; kcal: string;
  medicacao: Medicacao | null; tempoMed: string | null; medico: string | null; hormonio: Hormonio | null;
}

const VAZIO: Respostas = {
  objetivo: null, idade: "", sexo: null, altura: "", peso: "", gestante: null, semMeta: false, meta: "",
  rotina: null, treinos: null, tipoTreino: null, passos: null, sabeKcal: null, kcal: "",
  medicacao: null, tempoMed: null, medico: null, hormonio: null,
};

const OBJETIVOS: Opcao<Objetivo>[] = [
  { valor: "peso", rotulo: "Perder peso" },
  { valor: "gordura", rotulo: "Diminuir gordura corporal" },
  { valor: "composicao", rotulo: "Melhorar composição corporal", detalhe: "Menos gordura, mais músculo — o peso importa menos" },
  { valor: "nao-sei", rotulo: "Ainda não sei exatamente" },
];
const ROTINAS: Opcao<Rotina>[] = [
  { valor: "sentado", rotulo: "Trabalho principalmente sentado" },
  { valor: "em-pe", rotulo: "Fico em pé ou caminho parte do dia" },
  { valor: "ativo", rotulo: "Sou bastante ativo no dia a dia" },
  { valor: "fisico", rotulo: "Meu trabalho é fisicamente pesado" },
];
const TREINOS: Opcao<number>[] = [0, 1, 2, 3, 4, 5, 6].map((n) => ({ valor: n, rotulo: n === 6 ? "6+" : String(n) }));
const TIPOS: Opcao<TipoTreino>[] = [
  { valor: "musculacao", rotulo: "Musculação" }, { valor: "corrida", rotulo: "Corrida" }, { valor: "caminhada", rotulo: "Caminhada" },
  { valor: "esportes", rotulo: "Esportes" }, { valor: "funcional", rotulo: "Funcional" }, { valor: "combinacao", rotulo: "Combinação" },
];
const PASSOS: Opcao<FaixaPassos>[] = [
  { valor: "lt3", rotulo: "Menos de 3.000" }, { valor: "3a5", rotulo: "3.000 a 5.000" }, { valor: "5a75", rotulo: "5.000 a 7.500" },
  { valor: "75a10", rotulo: "7.500 a 10.000" }, { valor: "gt10", rotulo: "Mais de 10.000" }, { valor: "nao-sei", rotulo: "Não sei" },
];
const MEDICACOES: Opcao<Medicacao>[] = [
  { valor: "nao", rotulo: "Não" },
  { valor: "tirzepatida", rotulo: "Tirzepatida", detalhe: "ex.: Mounjaro" },
  { valor: "semaglutida", rotulo: "Semaglutida", detalhe: "ex.: Ozempic, Wegovy" },
  { valor: "liraglutida", rotulo: "Liraglutida", detalhe: "ex.: Saxenda" },
  { valor: "outra", rotulo: "Outra" },
  { valor: "nao-informar", rotulo: "Prefiro não informar" },
];
const TEMPOS: Opcao<string>[] = [
  { valor: "lt1", rotulo: "Menos de 1 mês" }, { valor: "1a3", rotulo: "1 a 3 meses" }, { valor: "3a6", rotulo: "3 a 6 meses" },
  { valor: "gt6", rotulo: "Mais de 6 meses" }, { valor: "ni", rotulo: "Prefiro não informar" },
];
const HORMONIOS: Opcao<Hormonio>[] = [
  { valor: "nao", rotulo: "Não" }, { valor: "reposicao", rotulo: "Reposição hormonal prescrita" },
  { valor: "desempenho", rotulo: "Uso para desempenho ou estética" }, { valor: "outro", rotulo: "Outro" }, { valor: "nao-informar", rotulo: "Prefiro não informar" },
];

const CTRL_PASSOS = [3000, 5000, 7500, 10000];
const CTRL_CONSIST = [0.6, 0.75, 0.9, 1];

const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const btnPrim = "inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
const btnSec = "inline-flex items-center justify-center border border-white/25 text-white px-5 py-3.5 text-sm min-h-[52px] hover:border-white/60 transition-colors";

const fmtN = (n: number) => Math.round(n).toLocaleString("pt-BR");
const rotuloSemana = (s: number) => (s === 0 ? "Hoje" : s === 26 ? "6 meses" : s === 52 ? "12 meses" : `${Math.round(s)} sem`);

export default function SimuladorEmagrecimento({ placement }: { placement: string }) {
  const [r, setR] = useState<Respostas>(VAZIO);
  const [passo, setPasso] = useState(0); // 0 = capa, 1..7 = perguntas, 8 = resultado
  const [erros, setErros] = useState<Record<string, string>>({});
  const [bloq, setBloq] = useState<Bloqueio | null>(null);
  const [cen, setCen] = useState<Cenario | null>(null);
  const [metodo, setMetodo] = useState(false);
  const [enviarDados, setEnviarDados] = useState(false);
  const [compartNumeros, setCompartNumeros] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const iniciou = useRef(false);

  /* Restaura a simulação da sessão (quem foi a outra ferramenta e voltou). */
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const salvo = sessionStorage.getItem(CHAVE);
        if (salvo) {
          const d = JSON.parse(salvo) as { r: Respostas; passo: number; cen: Cenario | null };
          if (d && d.r) { setR({ ...VAZIO, ...d.r }); setPasso(d.passo); setCen(d.cen); iniciou.current = true; }
        }
      } catch { /* sem storage: segue do zero */ }
    }, 0);
    trackOncePerSession("simulator_view", { placement });
    return () => clearTimeout(t);
  }, [placement]);

  useEffect(() => {
    if (passo === 0) return;
    try { sessionStorage.setItem(CHAVE, JSON.stringify({ r, passo, cen })); } catch { /* ignora */ }
  }, [r, passo, cen]);

  const set = <K extends keyof Respostas>(k: K, v: Respostas[K]) => {
    setR((a) => ({ ...a, [k]: v }));
    setErros((e) => { const n = { ...e }; delete n[k as string]; return n; });
  };

  function irPara(n: number) {
    setPasso(n);
    requestAnimationFrame(() => {
      raiz.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      tituloRef.current?.focus({ preventScroll: true });
    });
  }

  function comecar() {
    if (!iniciou.current) { iniciou.current = true; trackEvent("simulator_start", { placement }); }
    irPara(1);
  }

  /* ── Valores numéricos ── */
  const idade = parseNumero(r.idade), altura = parseAltura(r.altura), peso = parseNumero(r.peso);
  const meta = r.semMeta ? null : parseNumero(r.meta);
  const kcal = r.sabeKcal ? parseNumero(r.kcal) : null;

  const perfil: Perfil | null = useMemo(() => {
    if (idade === null || altura === null || peso === null || !r.sexo || !r.rotina || r.treinos === null || !r.passos) return null;
    return {
      idade, sexo: r.sexo, alturaCm: altura, pesoKg: peso, metaKg: meta, rotina: r.rotina, treinos: r.treinos,
      tipoTreino: r.treinos > 0 && r.tipoTreino ? r.tipoTreino : "musculacao", passos: r.passos, kcalDia: kcal,
    };
  }, [idade, altura, peso, meta, kcal, r.sexo, r.rotina, r.treinos, r.tipoTreino, r.passos]);

  /* ── Avançar com validação ── */
  function avancar() {
    const e: Record<string, string> = {};
    if (passo === 1 && !r.objetivo) e.objetivo = "Escolha uma opção para seguir.";
    if (passo === 2) {
      for (const x of validaBasicos(idade, altura, peso)) e[x.campo] = x.mensagem;
      if (!r.sexo) e.sexo = "Escolha uma opção. Ela entra só na equação de gasto.";
      if (r.sexo === "f" && r.gestante === null) e.gestante = "Responda para seguir.";
      if (Object.keys(e).length === 0) {
        const b = bloqueio(idade!, r.sexo === "f" && r.gestante === true, peso!, altura!);
        if (b) { setBloq(b); trackEvent("simulator_step_complete", { placement, step: passo }); return; }
      }
    }
    if (passo === 3 && !r.semMeta) {
      const v = validaMeta(meta, peso!, altura!);
      if (v && "campo" in v) e.meta = v.mensagem;
      else if (v) { setBloq(v); return; }
    }
    if (passo === 4) {
      if (!r.rotina) e.rotina = "Escolha a opção mais parecida com seu dia.";
      if (r.treinos === null) e.treinos = "Escolha quantas vezes (0 também vale).";
    }
    if (passo === 5 && !r.passos) e.passos = "Escolha uma faixa, ou “Não sei”.";
    if (passo === 6) {
      if (r.sabeKcal === null) e.sabeKcal = "Escolha uma opção.";
      else if (r.sabeKcal) {
        if (kcal === null) e.kcal = "Informe um número aproximado, ou volte e escolha “Não”.";
        else if (kcal < KCAL_MIN || kcal > KCAL_MAX) e.kcal = `Confira o número: aceitamos de ${fmtN(KCAL_MIN)} a ${fmtN(KCAL_MAX)} kcal por dia.`;
      }
    }
    if (Object.keys(e).length) { setErros(e); return; }
    trackEvent("simulator_step_complete", { placement, step: passo });
    if (passo === TOTAL) {
      if (perfil) { setCen(cenarioAtual(perfil)); trackEvent("simulator_complete", { placement }); irPara(8); }
      return;
    }
    irPara(passo + 1);
  }

  function recomecar() {
    try { sessionStorage.removeItem(CHAVE); } catch { /* ignora */ }
    setR(VAZIO); setCen(null); setBloq(null); setErros({}); setEnviarDados(false); setCompartNumeros(false);
    irPara(1);
  }

  /* ── Resultado ── */
  const atual = perfil ? cenarioAtual(perfil) : null;
  const projAtual = useMemo(() => (perfil && atual ? projeta(perfil, atual) : null), [perfil, atual?.treinos, atual?.passos, atual?.comida]); // eslint-disable-line react-hooks/exhaustive-deps
  const projCen = useMemo(() => (perfil && cen ? projeta(perfil, cen) : null), [perfil, cen]);
  const imp = useMemo(() => (perfil && cen ? impactos(perfil, cen) : []), [perfil, cen]);
  const ins = insight(imp);

  function mexe(controle: string, novo: Partial<Cenario>) {
    setCen((c) => (c ? { ...c, ...novo } : c));
    trackEvent("scenario_changed", { placement, control: controle });
  }

  const usaCaneta = r.medicacao === "tirzepatida" || r.medicacao === "semaglutida" || r.medicacao === "liraglutida" || r.medicacao === "outra";
  const usaHormonio = r.hormonio === "reposicao" || r.hormonio === "desempenho" || r.hormonio === "outro";
  const clique = () => trackEvent("simulator_internal_tool_click", { placement });

  /* ─────────────────────────── Render ─────────────────────────── */

  if (bloq) return <div ref={raiz} className="scroll-mt-24"><Guardrail b={bloq} onVoltar={() => { setBloq(null); irPara(bloq.tipo === "meta-baixa" ? 3 : 2); }} onRecomecar={recomecar} tituloRef={tituloRef} /></div>;

  if (passo === 0) {
    return (
      <div ref={raiz} className="border border-white/15 p-6 sm:p-8 scroll-mt-24" data-testid="simulador-capa">
        <p className="text-white text-lg leading-relaxed mb-2">Informe alguns dados e veja uma projeção do seu emagrecimento — depois mude treino, passos e consistência para comparar cenários.</p>
        <p className="text-gray-400 text-sm mb-6">Leva cerca de 1 minuto. Nada sai do seu navegador.</p>
        <button type="button" onClick={comecar} className={btnPrim}>Começar a simulação →</button>
      </div>
    );
  }

  if (passo >= 1 && passo <= TOTAL) {
    return (
      <div ref={raiz} className="border border-white/15 p-5 sm:p-8 scroll-mt-24" data-testid={`simulador-passo-${passo}`}>
        <ProgressBar passo={passo} total={TOTAL} />
        <form onSubmit={(e) => { e.preventDefault(); avancar(); }} noValidate>
          {passo === 1 && (
            <QuestionStep titulo="Qual é o seu objetivo?" tituloRef={tituloRef}>
              <OptionCards nome="Objetivo" opcoes={OBJETIVOS} valor={r.objetivo} onChange={(v) => set("objetivo", v)} />
              <Erro m={erros.objetivo} />
            </QuestionStep>
          )}

          {passo === 2 && (
            <QuestionStep titulo="Um pouco sobre você" tituloRef={tituloRef}
              ajuda="Idade, altura, peso e sexo biológico entram na equação que estima quanto seu corpo gasta por dia. Ficam só no seu navegador.">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <NumericInput rotulo="Idade" sufixo="anos" valor={r.idade} onChange={(v) => set("idade", v)} erro={erros.idade} placeholder="35" />
                <NumericInput rotulo="Altura" sufixo="cm" valor={r.altura} onChange={(v) => set("altura", v)} erro={erros.altura} placeholder="170" />
                <div className="col-span-2">
                  <NumericInput rotulo="Peso atual" sufixo="kg" valor={r.peso} onChange={(v) => set("peso", v)} erro={erros.peso} placeholder="82,5" onEnter={avancar} />
                </div>
              </div>
              <p className="text-white text-sm font-semibold mb-1.5">Sexo biológico</p>
              <OptionCards nome="Sexo biológico" colunas={2} opcoes={[{ valor: "f", rotulo: "Feminino" }, { valor: "m", rotulo: "Masculino" }]} valor={r.sexo} onChange={(v) => set("sexo", v)} />
              <Erro m={erros.sexo} />
              {r.sexo === "f" && (
                <div className="mt-4">
                  <p className="text-white text-sm font-semibold mb-1.5">Está grávida ou amamentando?</p>
                  <OptionCards nome="Gestação ou amamentação" colunas={2} opcoes={[{ valor: "nao", rotulo: "Não" }, { valor: "sim", rotulo: "Sim" }]}
                    valor={r.gestante === null ? null : r.gestante ? "sim" : "nao"} onChange={(v) => set("gestante", v === "sim")} />
                  <Erro m={erros.gestante} />
                </div>
              )}
            </QuestionStep>
          )}

          {passo === 3 && (
            <QuestionStep titulo="Qual peso você gostaria de atingir?" tituloRef={tituloRef} ajuda="Você pode alterar isso depois.">
              {!r.semMeta && <NumericInput rotulo="Meta" sufixo="kg" valor={r.meta} onChange={(v) => set("meta", v)} erro={erros.meta} placeholder={peso ? String(Math.round(peso * 0.9)) : "75"} onEnter={avancar} />}
              <label className="flex items-center gap-3 mt-4 min-h-[44px] text-gray-200 cursor-pointer">
                <input type="checkbox" checked={r.semMeta} onChange={(e) => set("semMeta", e.target.checked)} className="w-5 h-5 accent-[#BA9E50]" />
                Não tenho uma meta de peso
              </label>
              {r.semMeta && <p className="text-gray-400 text-sm mt-2">Sem problema. A simulação mostra a trajetória dos próximos meses — e lembra que composição corporal vai além do peso.</p>}
            </QuestionStep>
          )}

          {passo === 4 && (
            <QuestionStep titulo="Como é sua rotina hoje?" tituloRef={tituloRef}>
              <OptionCards nome="Rotina" opcoes={ROTINAS} valor={r.rotina} onChange={(v) => set("rotina", v)} />
              <Erro m={erros.rotina} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Quantas vezes você treina por semana?</p>
              <OptionCards nome="Treinos por semana" colunas={4} opcoes={TREINOS} valor={r.treinos} onChange={(v) => set("treinos", v)} />
              <Erro m={erros.treinos} />
              {r.treinos !== null && r.treinos > 0 && (
                <>
                  <p className="text-white text-sm font-semibold mt-6 mb-1.5">Que tipo de treino? <span className="text-gray-500 font-normal">(opcional)</span></p>
                  <OptionCards nome="Tipo de treino" colunas={3} opcoes={TIPOS} valor={r.tipoTreino} onChange={(v) => set("tipoTreino", v)} />
                </>
              )}
            </QuestionStep>
          )}

          {passo === 5 && (
            <QuestionStep titulo="Em média, quantos passos você dá por dia?" tituloRef={tituloRef} ajuda="Não sabe seus passos? Sem problema — escolha “Não sei” e usamos uma média.">
              <OptionCards nome="Passos por dia" colunas={2} opcoes={PASSOS} valor={r.passos} onChange={(v) => set("passos", v)} />
              <Erro m={erros.passos} />
            </QuestionStep>
          )}

          {passo === 6 && (
            <QuestionStep titulo="Você sabe aproximadamente quantas calorias come por dia?" tituloRef={tituloRef}
              ajuda="A maioria das pessoas não sabe — e o simulador funciona do mesmo jeito.">
              <OptionCards nome="Sabe as calorias" colunas={2} opcoes={[{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }]}
                valor={r.sabeKcal === null ? null : r.sabeKcal ? "sim" : "nao"} onChange={(v) => set("sabeKcal", v === "sim")} />
              <Erro m={erros.sabeKcal} />
              {r.sabeKcal && (
                <div className="mt-4">
                  <NumericInput rotulo="Calorias por dia" sufixo="kcal" valor={r.kcal} onChange={(v) => set("kcal", v)} erro={erros.kcal} placeholder="2000" onEnter={avancar} autoFocus
                    ajuda="Um número aproximado basta. Quem anota costuma subestimar um pouco." />
                </div>
              )}
              {r.sabeKcal === false && (
                <p className="text-gray-400 text-sm mt-3">
                  Tudo bem. A simulação parte de uma alimentação com déficit moderado, e você ajusta depois. Quer uma estimativa do seu gasto?{" "}
                  <Link href="/ferramentas/calculadora-tmb-tdee" onClick={clique} className={ln}>Calculadora de Gasto Calórico</Link> — sua simulação fica salva nesta aba.
                </p>
              )}
            </QuestionStep>
          )}

          {passo === 7 && (
            <QuestionStep titulo="Você usa alguma medicação para emagrecimento?" tituloRef={tituloRef}
              ajuda="Opcional. Isso não muda a curva — muda a leitura do resultado e o que vale observar além da balança. Não sai do seu navegador.">
              <OptionCards nome="Medicação para emagrecimento" colunas={2} opcoes={MEDICACOES} valor={r.medicacao} onChange={(v) => set("medicacao", v)} />
              {usaCaneta && (
                <div className="mt-5 space-y-5">
                  <div>
                    <p className="text-white text-sm font-semibold mb-1.5">Há quanto tempo você usa?</p>
                    <OptionCards nome="Tempo de uso" colunas={2} opcoes={TEMPOS} valor={r.tempoMed} onChange={(v) => set("tempoMed", v)} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold mb-1.5">Está sendo acompanhado por médico? <span className="text-gray-500 font-normal">(opcional)</span></p>
                    <OptionCards nome="Acompanhamento médico" colunas={3} opcoes={[{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }, { valor: "ni", rotulo: "Prefiro não dizer" }]} valor={r.medico} onChange={(v) => set("medico", v)} />
                  </div>
                </div>
              )}
              <div className="mt-6">
                <p className="text-white text-sm font-semibold mb-1.5">Você utiliza testosterona ou outro hormônio/anabolizante? <span className="text-gray-500 font-normal">(opcional)</span></p>
                <OptionCards nome="Hormônios" opcoes={HORMONIOS} valor={r.hormonio} onChange={(v) => set("hormonio", v)} />
              </div>
            </QuestionStep>
          )}

          <div className="flex flex-wrap gap-3 mt-8">
            {passo > 1 && <button type="button" onClick={() => irPara(passo - 1)} className={btnSec}>← Voltar</button>}
            <button type="submit" className={btnPrim}>{passo === TOTAL ? "Ver minha projeção →" : passo === 7 || passo === 3 ? "Continuar →" : "Continuar →"}</button>
          </div>
        </form>
      </div>
    );
  }

  /* ── Passo 8: resultado ── */
  if (!perfil || !cen || !projCen || !projAtual) {
    return (
      <div ref={raiz} className="border border-white/15 p-6">
        <p className="text-white mb-4">Faltou alguma resposta para montar a projeção.</p>
        <button type="button" onClick={recomecar} className={btnPrim}>Refazer a simulação</button>
      </div>
    );
  }

  const temMeta = perfil.metaKg !== null;
  const horizonte = temMeta && projCen.semanaMeta !== null
    ? Math.min(SEMANAS_MAX, Math.max(12, Math.ceil(projCen.semanaMeta * 1.15)))
    : temMeta ? SEMANAS_MAX : 26;
  const corta = (pr: typeof projCen) => pr.pontos.slice(0, horizonte + 1).map((p) => ({ x: p.semana, y: p.peso, min: p.min, max: p.max }));
  const igual = cen.treinos === atual!.treinos && cen.passos === atual!.passos && cen.consistencia === atual!.consistencia && cen.comida === atual!.comida;
  const marcos: Marco[] = [0, 4, 8, 12, 26, 52].filter((s) => s <= horizonte).map((s) => ({ x: s, rotulo: rotuloSemana(s) }));
  if (temMeta && projCen.semanaMeta !== null && projCen.semanaMeta <= horizonte && !marcos.some((m) => Math.abs(m.x - projCen.semanaMeta!) < 2)) {
    marcos.push({ x: Math.round(projCen.semanaMeta), rotulo: "Meta" });
    marcos.sort((a, b) => a.x - b.x);
  }
  const perdaTotal = temMeta ? perfil.pesoKg - perfil.metaKg! : null;
  const opcoesComida: Opcao<NivelComida>[] = perfil.kcalDia !== null
    ? [{ valor: "hoje", rotulo: "Como hoje" }, { valor: "leve", rotulo: "−250 kcal" }, { valor: "moderado", rotulo: "−450 kcal" }, { valor: "firme", rotulo: "−650 kcal" }]
    : [{ valor: "leve", rotulo: "Déficit leve" }, { valor: "moderado", rotulo: "Moderado" }, { valor: "firme", rotulo: "Firme" }];
  const semProgresso = projCen.ritmo12 < 0.05;
  const dif = temMeta && projCen.semanaMeta !== null && projAtual.semanaMeta !== null ? projAtual.semanaMeta - projCen.semanaMeta : null;

  const msgPadrao = "Oi, Montinho! Fiz o Simulador de Emagrecimento no site e queria entender como transformar essa projeção em um plano de treino.";
  const msgComDados = `${msgPadrao}\n\nMeus números (escolhi compartilhar): peso atual ${fmtKg(perfil.pesoKg)}${temMeta ? `, meta ${fmtKg(perfil.metaKg!)}` : ""}, ${cen.treinos} treinos por semana, cerca de ${fmtN(cen.passos)} passos por dia.`;
  const urlPagina = "https://www.montinhopersonal.com.br/ferramentas/simulador-emagrecimento";
  const textoShare = compartNumeros && temMeta
    ? `Simulei meu emagrecimento: de ${fmtKg(perfil.pesoKg)} para ${fmtKg(perfil.metaKg!)}, mexendo em treino, passos e consistência. Faça o seu:`
    : "Simulei como meu emagrecimento pode evoluir nos próximos meses — e o que mais mudaria o resultado. Faça o seu:";

  async function compartilhar() {
    trackEvent("simulator_share_click", { placement });
    const dados = { title: "Simulador de Emagrecimento", text: textoShare, url: urlPagina };
    try {
      if (navigator.share) { await navigator.share(dados); return; }
      await navigator.clipboard.writeText(`${textoShare} ${urlPagina}`);
      setCopiado(true); setTimeout(() => setCopiado(false), 2500);
    } catch { /* cancelado */ }
  }

  return (
    <div ref={raiz} className="scroll-mt-24 space-y-8" data-testid="simulador-resultado">
      {/* CAMADA 1 — resposta principal */}
      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-5 sm:p-8 relative" aria-live="polite">
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: DOURADO }} aria-hidden="true" />
        <h2 ref={tituloRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-white mb-5 outline-none" style={h}>Sua projeção de emagrecimento</h2>
        <dl className="grid grid-cols-3 gap-3 mb-6">
          <div><dt className="text-gray-400 text-xs uppercase tracking-wide">Peso atual</dt><dd className="text-white text-xl sm:text-2xl font-bold tabular-nums">{fmtKg(perfil.pesoKg)}</dd></div>
          <div><dt className="text-gray-400 text-xs uppercase tracking-wide">Meta</dt><dd className="text-white text-xl sm:text-2xl font-bold tabular-nums">{temMeta ? fmtKg(perfil.metaKg!) : "—"}</dd></div>
          <div><dt className="text-gray-400 text-xs uppercase tracking-wide">Diferença</dt><dd className="text-white text-xl sm:text-2xl font-bold tabular-nums">{perdaTotal !== null ? fmtKg(perdaTotal) : "—"}</dd></div>
        </dl>
        {semProgresso ? (
          <p className="text-lg text-white leading-relaxed" data-testid="resposta">
            Neste cenário, seu peso tende a ficar <strong>praticamente estável</strong>. As calorias informadas estão perto do que seu corpo gasta — mude a alimentação ou a atividade abaixo para ver a curva descer.
          </p>
        ) : temMeta && projCen.semanaMeta !== null ? (
          <p className="text-lg text-white leading-relaxed" data-testid="resposta">
            Se esse padrão fosse mantido, você chegaria perto de {fmtKg(perfil.metaKg!)} em <strong style={{ color: DOURADO }}>{fmtFaixaSemanas(projCen.faixaMeta!)}</strong> — por volta de {fmtSemanas(projCen.semanaMeta)}.
          </p>
        ) : temMeta ? (
          <p className="text-lg text-white leading-relaxed" data-testid="resposta">
            Neste cenário, a meta não chega em 12 meses: a projeção termina perto de <strong style={{ color: DOURADO }}>{fmtKgProj(projCen.pontos[SEMANAS_MAX].peso)}</strong>. Ajuste os cenários abaixo para ver o que aproxima a meta.
          </p>
        ) : (
          <p className="text-lg text-white leading-relaxed" data-testid="resposta">
            Neste cenário, em 12 semanas seu peso ficaria perto de <strong style={{ color: DOURADO }}>{fmtKgProj(projCen.pontos[12].peso)}</strong>, e em 6 meses perto de {fmtKgProj(projCen.pontos[26].peso)}.
          </p>
        )}
        <p className="text-gray-400 text-sm mt-3">{NOTA_ESTIMATIVA}</p>
        {projCen.noPiso && <p className="text-gray-400 text-sm mt-2">A alimentação do cenário foi limitada a um mínimo seguro: abaixo disso, a projeção deixaria de ser um plano sustentável.</p>}
      </div>

      {/* CAMADA 2 — gráfico */}
      <div className="border border-white/15 p-4 sm:p-6">
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400 mb-3">
          <span className="inline-flex items-center gap-2"><span className="w-5 h-[3px]" style={{ background: DOURADO }} aria-hidden="true" />{igual ? "Sua trajetória estimada" : "Cenário ajustado"}</span>
          {!igual && <span className="inline-flex items-center gap-2"><span className="w-5 border-t-2 border-dashed border-gray-400" aria-hidden="true" />Cenário de partida</span>}
          <span className="inline-flex items-center gap-2"><span className="w-5 h-3 opacity-40" style={{ background: DOURADO }} aria-hidden="true" />Faixa provável</span>
        </div>
        <ProjectionChart
          serie={corta(projCen)} comparacao={igual ? null : corta(projAtual)} meta={perfil.metaKg} marcos={marcos}
          formataY={fmtKgProj} formataX={(x) => (x === 0 ? "Hoje" : `Semana ${Math.round(x)}`)}
          rotuloSerie={igual ? "peso estimado" : "ajustado"} rotuloComparacao="partida"
          descricao={`Projeção de peso ao longo de ${horizonte} semanas, partindo de ${fmtKg(perfil.pesoKg)}.`} />
        <p className="text-gray-500 text-xs mt-3">{NOTA_PRIMEIRAS_SEMANAS}</p>
      </div>

      {/* CAMADA 3 — cenários */}
      <div className="border border-white/15 p-5 sm:p-6" data-testid="cenarios">
        <h3 className="text-xl font-bold text-white mb-1" style={h}>E se você mudar algumas coisas?</h3>
        <p className="text-gray-400 text-sm mb-5">Toque para comparar. O gráfico muda na hora; a linha tracejada é o cenário de partida.</p>
        <div className="space-y-5">
          <ScenarioSelector rotulo="Treinos por semana" opcoes={[0, 1, 2, 3, 4, 5, 6].map((n) => ({ valor: n, rotulo: n === 6 ? "6+" : `${n}x` }))} valor={cen.treinos} atual={atual!.treinos} onChange={(v) => mexe("training", { treinos: v })} />
          <ScenarioSelector rotulo="Passos por dia" opcoes={[...new Set([...CTRL_PASSOS, atual!.passos])].sort((a, b) => a - b).map((n) => ({ valor: n, rotulo: fmtN(n) }))} valor={cen.passos} atual={atual!.passos} onChange={(v) => mexe("steps", { passos: v })} />
          <ScenarioSelector rotulo="Consistência (dias em que o plano acontece)" opcoes={CTRL_CONSIST.map((n) => ({ valor: n, rotulo: `${Math.round(n * 100)}%` }))} valor={cen.consistencia} onChange={(v) => mexe("consistency", { consistencia: v })} />
          <ScenarioSelector rotulo="Alimentação" opcoes={opcoesComida} valor={cen.comida} atual={atual!.comida} onChange={(v) => mexe("food", { comida: v })} />
        </div>
        {!igual && (
          <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
            <Resumo titulo="Partida" c={atual!} pr={projAtual} temMeta={temMeta} />
            <Resumo titulo="Ajustado" c={cen} pr={projCen} temMeta={temMeta} destaque />
          </div>
        )}
        {!igual && dif !== null && Math.abs(dif) >= 1 && (
          <p className="text-gray-300 text-sm mt-3">Diferença estimada: <strong className="text-white">{dif > 0 ? "cerca de " + fmtSemanas(dif) + " antes" : "cerca de " + fmtSemanas(-dif) + " depois"}</strong>. Diferenças pequenas ficam dentro da margem de erro.</p>
        )}
        {!igual && dif !== null && Math.abs(dif) < 1 && <p className="text-gray-400 text-sm mt-3">A diferença entre os cenários é menor que uma semana — dentro da margem de erro da estimativa.</p>}
        <button type="button" onClick={() => { setCen(atual); trackEvent("scenario_changed", { placement, control: "reset" }); }} className="text-gray-400 text-sm underline underline-offset-4 mt-4 min-h-[44px]">Voltar ao cenário de partida</button>
      </div>

      {/* CAMADA 4 — insight */}
      <InsightCard titulo="O que mais mudaria seu resultado">
        {ins ? (
          <p>
            No modelo, o ajuste de maior impacto seria <strong>{ins.vencedor.descricao}</strong>
            {ins.vencedor.unidade === "semanas" ? <> — cerca de {fmtSemanas(ins.vencedor.ganho)} a menos até a meta.</> : <> — cerca de {fmtKg(ins.vencedor.ganho)} a mais em 12 semanas.</>}
            {ins.segundo && ins.segundo.ganho > 0 && <span className="text-gray-300"> {cap(ins.segundo.descricao)} também ajuda, mas mexe menos na curva.</span>}
          </p>
        ) : imp.length > 0 && imp[0].ganho > 0 ? (
          <p>No seu cenário, <strong>{imp.map((i) => i.descricao).join(", ")}</strong> produzem efeitos parecidos. Escolha o que for mais fácil de sustentar — é isso que decide.</p>
        ) : (
          <p>Seu cenário já está no máximo dos ajustes testados. Daqui para frente, o que decide é sustentar isso por tempo suficiente.</p>
        )}
        <p className="text-gray-400 text-xs mt-2">Comparação feita pelo modelo com mudanças pequenas; não é recomendação médica.</p>
      </InsightCard>

      {/* CAMADA 5 — explicação */}
      <div className="space-y-4 text-gray-300 leading-relaxed">
        <p><strong className="text-white">Emagrecimento não depende de perfeição.</strong> Com {Math.round(cen.consistencia * 100)}% de consistência, {Math.round((1 - cen.consistencia) * 7 * 10) / 10} dias por semana fogem do plano — e a curva continua descendo. O que trava o processo não é um dia ruim; é um dia ruim virar semanas fora da rotina.</p>
        <p><strong className="text-white">A curva desacelera, e isso é esperado.</strong> Quanto mais leve o corpo, menos ele gasta. Por isso a trajetória é curva, não reta — e por isso a conta de 7.700 kcal por quilo, repetida para sempre, erra.</p>
        <p><strong className="text-white">O peso é apenas uma das formas de acompanhar seu progresso.</strong> Cintura, medidas, fotos padronizadas e desempenho no treino contam o que a balança não conta. <Link href="/blog/balanca-nao-muda-mas-o-corpo-muda" onClick={clique} className={ln}>Por que a balança às vezes não muda</Link>.</p>
        {(r.objetivo === "composicao" || r.objetivo === "gordura" || !temMeta) && (
          <p>Como seu foco é composição, vale medir a gordura e a massa magra além do peso: <Link href="/ferramentas/composicao-corporal" onClick={clique} className={ln}>Calculadora de Composição Corporal</Link>.</p>
        )}
        {usaHormonio && (
          <div className="border border-white/15 p-4">
            <p className="text-white font-semibold mb-1">A balança conta só uma parte da história</p>
            <p className="text-sm">Mudanças de massa magra, glicogênio e água corporal podem fazer o peso parar mesmo quando a gordura cai. Observe também cintura, medidas, fotos no mesmo horário e luz, desempenho e, quando possível, composição corporal. <Link href="/blog/recomposicao-corporal" onClick={clique} className={ln}>Recomposição corporal</Link>.</p>
          </div>
        )}
        {usaCaneta && (
          <div className="border border-white/15 p-4" data-testid="bloco-caneta">
            <p className="text-white font-semibold mb-1">Está emagrecendo com uma caneta? A balança não conta toda a história.</p>
            <p className="text-sm mb-2">A curva acima não soma nenhum “bônus” pelo medicamento: a resposta varia demais de pessoa para pessoa. O que os estudos mostram é que parte do peso perdido pode vir de massa magra — e que treino de força e proteína adequada ajudam a preservá-la, junto com o acompanhamento médico.</p>
            <p className="text-sm">
              <Link href="/ferramentas/massa-magra-glp1" onClick={clique} className={ln}>Estime quanto do peso perdido pode ser músculo</Link> ·{" "}
              <Link href="/blog/musculacao-durante-uso-de-mounjaro" onClick={clique} className={ln}>Musculação durante o uso de caneta</Link> ·{" "}
              <Link href="/ferramentas/calculadora-de-proteina" onClick={clique} className={ln}>Calculadora de Proteína</Link>
            </p>
          </div>
        )}
      </div>

      {usaCaneta && <Estudos />}

      {/* CAMADA 6 — CTA */}
      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 relative" data-testid="cta-simulador">
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: DOURADO }} aria-hidden="true" />
        {usaCaneta ? (
          <>
            <p className="text-white font-bold text-xl mb-2" style={h}>Está emagrecendo com caneta?</p>
            <p className="text-gray-300 leading-relaxed mb-5 max-w-xl">Seu treino pode ter um papel importante para preservar força, capacidade física e massa muscular durante esse processo.</p>
          </>
        ) : (
          <>
            <p className="text-white font-bold text-xl mb-2" style={h}>A simulação mostra o caminho. Agora falta transformar isso em rotina.</p>
            <p className="text-gray-300 leading-relaxed mb-5 max-w-xl">Treino não precisa ser perfeito. Precisa funcionar na sua vida e ser ajustado conforme seu corpo responde. Eu posso estruturar seu treino, acompanhar sua evolução e ajustar a estratégia conforme você progride.</p>
          </>
        )}
        <a href={getWhatsAppUrl(enviarDados ? msgComDados : msgPadrao)} target="_blank" rel="noopener noreferrer"
          onClick={() => trackEvent("simulator_whatsapp_click", { placement })} className={btnPrim}>
          {usaCaneta ? "Quero um treino para essa fase →" : "Quero montar minha estratégia com o Montinho →"}
        </a>
        <label className="flex items-start gap-3 mt-4 text-gray-300 text-sm cursor-pointer min-h-[44px]">
          <input type="checkbox" checked={enviarDados} onChange={(e) => setEnviarDados(e.target.checked)} className="w-5 h-5 mt-0.5 accent-[#BA9E50]" />
          <span>Enviar meus resultados junto (peso, meta, treinos e passos). Sem isso, a mensagem vai sem nenhum número seu.</span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={compartilhar} className={btnSec}>Compartilhar minha simulação</button>
        <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer min-h-[44px]">
          <input type="checkbox" checked={compartNumeros} onChange={(e) => setCompartNumeros(e.target.checked)} className="w-4 h-4 accent-[#BA9E50]" />
          Incluir peso e meta no texto
        </label>
        {copiado && <span className="text-sm text-white" role="status">Link copiado.</span>}
      </div>

      <MethodologyDrawer titulo="Como calculamos esta estimativa?" aberto={metodo}
        onToggle={() => { if (!metodo) trackEvent("simulator_methodology_opened", { placement }); setMetodo(!metodo); }}>
        <p>A cada dia simulado, o que você come menos o que seu corpo gasta vira variação de peso. O gasto é recalculado com o peso novo — é por isso que a curva desacelera.</p>
        <p><strong className="text-white">Gasto de repouso:</strong> equação de Mifflin-St Jeor. <strong className="text-white">Rotina:</strong> um fator sobre o repouso ({perfil.rotina === "sentado" ? "1,25" : perfil.rotina === "em-pe" ? "1,4" : perfil.rotina === "ativo" ? "1,55" : "1,7"} no seu caso). <strong className="text-white">Treino:</strong> {TREINO[perfil.tipoTreino].rotulo}, {String(TREINO[perfil.tipoTreino].met).replace(".", ",")} MET por {TREINO[perfil.tipoTreino].minutos} minutos (Compêndio de Atividades Físicas 2024). <strong className="text-white">Passos a mais:</strong> custo da caminhada em ritmo moderado.</p>
        <p><strong className="text-white">Gasto de partida estimado:</strong> {fmtN(projCen.manutencao)} kcal/dia. <strong className="text-white">Alimentação do cenário:</strong> {fmtN(projCen.ingestaoPlano)} kcal nos dias de plano{perfil.kcalDia === null ? " (déficit sobre o gasto estimado)" : " (a partir do que você informou)"}; nos outros dias, o que você comia antes.</p>
        <p><strong className="text-white">O que é perdido:</strong> parte gordura, parte massa magra, pela relação de Forbes — quem tem mais gordura perde proporcionalmente mais gordura. Cada quilo de gordura vale ~9.440 kcal; de massa magra, ~1.816. <strong className="text-white">Adaptação:</strong> o gasto cai um pouco além do que o peso explica (parâmetro do modelo de Hall, 2011).</p>
        <p><strong className="text-white">Faixa provável:</strong> o mesmo cenário com gasto 5% menor e 5% maior. <strong className="text-white">O modelo não considera</strong> medicamentos, hormônios, água e glicogênio das primeiras semanas, nem compensação de apetite. Projeções param em 12 meses.</p>
        <p><a href="#metodologia" className={ln}>Ver metodologia completa e referências</a></p>
      </MethodologyDrawer>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <button type="button" onClick={() => irPara(2)} className="underline underline-offset-4 min-h-[44px]">Editar minhas respostas</button>
        <button type="button" onClick={recomecar} className="underline underline-offset-4 min-h-[44px]">Apagar meus dados e recomeçar</button>
      </div>
    </div>
  );
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Erro({ m }: { m?: string }) {
  return m ? <p role="alert" className="text-red-300 text-sm mt-2">{m}</p> : null;
}

function Resumo({ titulo, c, pr, temMeta, destaque }: { titulo: string; c: Cenario; pr: ReturnType<typeof projeta>; temMeta: boolean; destaque?: boolean }) {
  return (
    <div className={`border p-3 ${destaque ? "border-[#BA9E50]" : "border-white/15"}`}>
      <p className={`text-xs uppercase tracking-wide mb-2 ${destaque ? "text-[#BA9E50]" : "text-gray-400"}`}>{titulo}</p>
      <ul className="text-gray-300 space-y-0.5 tabular-nums">
        <li>{c.treinos}x treino</li>
        <li>{fmtN(c.passos)} passos</li>
        <li>{Math.round(c.consistencia * 100)}% consistência</li>
      </ul>
      <p className="text-white font-semibold mt-2 tabular-nums">
        {temMeta ? (pr.semanaMeta !== null ? `Meta em ~${fmtSemanas(pr.semanaMeta)}` : "Meta além de 12 meses") : `12 sem: ${fmtKgProj(pr.pontos[12].peso)}`}
      </p>
    </div>
  );
}

function Estudos() {
  return (
    <details className="border border-white/15 group" data-testid="estudos">
      <summary className="px-4 py-3 min-h-[52px] flex items-center text-white font-semibold cursor-pointer">O que estudos observaram com esses medicamentos</summary>
      <div className="px-4 pb-4 text-sm text-gray-300 leading-relaxed space-y-4">
        <p className="text-gray-400">Isto <strong className="text-white">não é a sua simulação</strong> nem uma previsão individual. São médias de ensaios clínicos com populações, doses e durações específicas — e dentro de cada estudo houve quem perdeu muito mais e quem perdeu bem menos.</p>
        {ESTUDOS.map((e) => (
          <div key={e.id} className="border-l-2 border-white/20 pl-3">
            <p className="text-white font-semibold">{e.substancia} <span className="text-gray-400 font-normal">({e.marcas}) — {e.estudo}</span></p>
            <p>Em {e.duracao}, com {e.populacao}, usando {e.dose}, participantes tiveram em média {e.resultado}, contra {e.comparacao}.</p>
            <p className="text-gray-500 text-xs mt-1"><a href={e.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{e.referencia}</a></p>
          </div>
        ))}
        <p className="text-gray-400">Uso, dose e ajustes são decisões do seu médico. O simulador não recomenda nem ajusta medicamento.</p>
      </div>
    </details>
  );
}

function Guardrail({ b, onVoltar, onRecomecar, tituloRef }: { b: Bloqueio; onVoltar: () => void; onRecomecar: () => void; tituloRef: React.Ref<HTMLHeadingElement> }) {
  const textos: Record<Bloqueio["tipo"], { t: string; p: string }> = {
    menor: { t: "Este simulador é feito para adultos", p: "Antes dos 18 anos o corpo ainda está crescendo, e metas de peso precisam considerar esse crescimento. Uma projeção automática aqui poderia orientar mal. O melhor caminho é conversar com um pediatra ou nutricionista, que acompanham o desenvolvimento como um todo." },
    gestacao: { t: "Essa fase merece acompanhamento individual", p: "Na gestação e na amamentação, as necessidades de energia mudam e o peso não deve ser tratado como meta de emagrecimento automática. Seu obstetra ou nutricionista consegue orientar com segurança o que faz sentido agora. Se quiser ler mais, há um texto sobre emagrecer amamentando no blog." },
    "imc-baixo": { t: "Seu peso já está abaixo da faixa usada como referência", p: "Pela sua altura, o peso informado já está abaixo da faixa considerada adequada para adultos. Por isso não vamos projetar mais perda de peso. Se o objetivo é mudar a composição do corpo — ganhar músculo, melhorar o shape — isso é outro caminho, e vale fazer com acompanhamento." },
    "meta-baixa": { t: "Essa meta fica abaixo da faixa de referência", p: "" },
  };
  const x = textos[b.tipo];
  return (
    <div className="border border-white/15 p-6 sm:p-8" data-testid={`guardrail-${b.tipo}`}>
      <h2 ref={tituloRef} tabIndex={-1} className="text-2xl font-bold text-white mb-3 outline-none" style={h}>{x.t}</h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        {b.tipo === "meta-baixa"
          ? `Pela sua altura, um peso abaixo de ${b.minimoKg} kg fica abaixo da faixa usada como referência para adultos. Não vamos projetar essa meta — mas você pode escolher uma meta a partir de ${b.minimoKg} kg, ou seguir sem meta e olhar a trajetória.`
          : x.p}
      </p>
      <div className="flex flex-wrap gap-3">
        {(b.tipo === "meta-baixa" || b.tipo === "imc-baixo") && <button type="button" onClick={onVoltar} className={btnPrim}>{b.tipo === "meta-baixa" ? "Ajustar minha meta" : "Revisar meus dados"}</button>}
        {b.tipo === "gestacao" && <Link href="/blog/emagrecer-amamentando" className={btnPrim}>Ler sobre emagrecer amamentando</Link>}
        <button type="button" onClick={onRecomecar} className={btnSec}>Recomeçar</button>
      </div>
    </div>
  );
}
