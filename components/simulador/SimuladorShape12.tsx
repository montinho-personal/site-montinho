"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import DoisCaminhos from "@/components/comece/DoisCaminhos";
import ProjectionChart, { type Marco } from "./ProjectionChart";
import TwelveWeekTimeline from "./TwelveWeekTimeline";
import { DOURADO, Dobra, InsightCard, MethodologyDrawer, MultiOptionCards, NumericInput, OptionCards, ProgressBar, QuestionStep, ScenarioSelector, h, type Opcao } from "./ui";
import { ESTUDOS, fmtKg, fmtKgProj, parseAltura, parseNumero, validaBasicos, KCAL_MAX, KCAL_MIN, type Hormonio, type Medicacao, type Sexo } from "@/lib/simulador/emagrecimento";
import { avaliaProteina, type HistoricoPeso } from "@/lib/simulador/massa";
import {
  CONSIST_HIST, FASES, PASSOS12, SEMANAS, bloqueio12, caminho, caminhosSugeridos, cenarioAtual12, checkpoints, diagnostico12, fmtData, impactos12, insight12, projeta12,
  type Acompanha12, type Bloqueio12, type Cardio12, type Cenario12, type Comida, type ConsistHist, type Esforco, type Espelho, type Estruturado, type Experiencia12, type FimSemana, type Medidas, type Objetivo12, type Passos12, type Perfil12, type Rotina12, type Sono, type Tempo,
} from "@/lib/simulador/shape12";
import { evidencia12 } from "@/lib/simulador/evidencias-shape12";

/**
 * Meu Shape em 12 Semanas.
 *
 * Oito telas (três delas puláveis num toque), um "ponto de partida" para
 * conferir, e o resultado em camadas: resposta → gráfico (peso ou treinos
 * acumulados) → linha do tempo com datas → o que você acumularia → gargalo
 * → "e se?" → recomeçar rápido → checkpoints → contexto → CTA.
 *
 * PRIVACIDADE: tudo no navegador; eventos shape12_* só com etapa, controle
 * ou destino; sessionStorage até fechar a aba, com botão de apagar; nada do
 * corpo vai no WhatsApp nem no card sem a pessoa marcar.
 */

const CHAVE = "montinho:shape12";
const TOTAL = 8;
const PULAVEIS = new Set([3, 7, 8]);

interface R {
  objetivo: Objetivo12 | null; espelho: Espelho[];
  idade: string; sexo: Sexo | null; altura: string; peso: string; gestante: boolean | null; sabeGordura: boolean | null; gordura: string;
  cintura: string; abdomen: string; quadril: string; braco: string; coxa: string; peito: string;
  experiencia: Experiencia12 | null; treinos: number | null; tempo: Tempo | null; estruturado: Estruturado | null;
  acompanha: Acompanha12 | null; esforco: Esforco | null; consistHist: ConsistHist | null;
  rotina: Rotina12 | null; passos: Passos12 | null; cardio: Cardio12 | null;
  comida: Comida | null; sabeKcal: boolean | null; kcal: string; sabeProteina: boolean | null; proteina: string; sono: Sono | null; fimSemana: FimSemana | null;
  medicacao: Medicacao | null; tempoMed: string | null; medico: string | null; hormonio: Hormonio | null; historicoPeso: HistoricoPeso | null;
}
const VAZIO: R = { objetivo: null, espelho: [], idade: "", sexo: null, altura: "", peso: "", gestante: null, sabeGordura: null, gordura: "", cintura: "", abdomen: "", quadril: "", braco: "", coxa: "", peito: "", experiencia: null, treinos: null, tempo: null, estruturado: null, acompanha: null, esforco: null, consistHist: null, rotina: null, passos: null, cardio: null, comida: null, sabeKcal: null, kcal: "", sabeProteina: null, proteina: "", sono: null, fimSemana: null, medicacao: null, tempoMed: null, medico: null, hormonio: null, historicoPeso: null };

const OBJ: Opcao<Objetivo12>[] = [
  { valor: "emagrecer", rotulo: "Emagrecer", detalhe: "Perder peso e gordura" },
  { valor: "recomp", rotulo: "Recomposição", detalhe: "Menos gordura, mais músculo — o peso importa menos" },
  { valor: "massa", rotulo: "Ganhar massa", detalhe: "Ficar maior e mais musculoso" },
  { valor: "nao-sei", rotulo: "Melhorar meu shape", detalhe: "Não sei se preciso emagrecer ou ganhar massa" },
];
const ESPELHO: Opcao<Espelho>[] = [
  { valor: "barriga", rotulo: "Menos barriga" }, { valor: "definicao", rotulo: "Mais definição" }, { valor: "massa", rotulo: "Mais massa muscular" }, { valor: "gluteos", rotulo: "Glúteos e pernas" },
  { valor: "superior", rotulo: "Parte de cima maior" }, { valor: "atletico", rotulo: "Corpo mais atlético" }, { valor: "tudo", rotulo: "O shape como um todo" }, { valor: "nao-sei", rotulo: "Não sei" },
];
const EXP: Opcao<Experiencia12>[] = [
  { valor: "nunca", rotulo: "Ainda não treino" }, { valor: "lt6m", rotulo: "Menos de 6 meses" }, { valor: "6a12", rotulo: "6 a 12 meses" }, { valor: "1a2", rotulo: "1 a 2 anos" },
  { valor: "2a4", rotulo: "2 a 4 anos" }, { valor: "gt4", rotulo: "Mais de 4 anos" }, { valor: "para-e-volta", rotulo: "Treino, mas paro e volto muito" },
];
const TEMPO: Opcao<Tempo>[] = [{ valor: "lt30", rotulo: "Menos de 30 min" }, { valor: "30a45", rotulo: "30 a 45 min" }, { valor: "45a60", rotulo: "45 a 60 min" }, { valor: "60a75", rotulo: "60 a 75 min" }, { valor: "gt75", rotulo: "Mais de 75 min" }];
const ESTR: Opcao<Estruturado>[] = [{ valor: "sim", rotulo: "Sim, sigo um treino planejado" }, { valor: "mais-ou-menos", rotulo: "Mais ou menos" }, { valor: "lembro", rotulo: "Faço o que lembro na academia" }, { valor: "nao-treino", rotulo: "Ainda não treino" }];
const ACOMP: Opcao<Acompanha12>[] = [{ valor: "sim", rotulo: "Sim" }, { valor: "mais-ou-menos", rotulo: "Mais ou menos" }, { valor: "nao", rotulo: "Não" }, { valor: "nao-sei", rotulo: "Não sei o que significa" }];
const ESF: Opcao<Esforco>[] = [
  { valor: "muitas", rotulo: "Conseguiria fazer muitas repetições ainda" }, { valor: "algumas", rotulo: "Conseguiria mais algumas" }, { valor: "1-2", rotulo: "Conseguiria talvez mais 1 ou 2" },
  { valor: "falha", rotulo: "Vou até não conseguir completar outra" }, { valor: "nao-sei", rotulo: "Não sei" },
];
const CONS: Opcao<ConsistHist>[] = [{ valor: "lt50", rotulo: "Menos da metade" }, { valor: "60", rotulo: "Cerca de 60%" }, { valor: "75", rotulo: "Uns 75%" }, { valor: "quase", rotulo: "Quase todos" }, { valor: "100", rotulo: "Praticamente 100%" }];
const ROT: Opcao<Rotina12>[] = [{ valor: "sentado", rotulo: "Quase sempre sentado" }, { valor: "caminho-pouco", rotulo: "Caminho um pouco" }, { valor: "ando-bastante", rotulo: "Ando bastante" }, { valor: "em-pe", rotulo: "Trabalho em pé" }, { valor: "fisico", rotulo: "Trabalho fisicamente" }, { valor: "muito-ativo", rotulo: "Muito ativo" }];
const PAS: Opcao<Passos12>[] = [{ valor: "lt3", rotulo: "Menos de 3 mil" }, { valor: "3a5", rotulo: "3 a 5 mil" }, { valor: "5a75", rotulo: "5 a 7,5 mil" }, { valor: "75a10", rotulo: "7,5 a 10 mil" }, { valor: "10a15", rotulo: "10 a 15 mil" }, { valor: "gt15", rotulo: "Mais de 15 mil" }, { valor: "nao-sei", rotulo: "Não sei" }];
const CAR: Opcao<Cardio12>[] = [{ valor: "nao", rotulo: "Não" }, { valor: "1a2", rotulo: "1 a 2 vezes" }, { valor: "3a4", rotulo: "3 a 4 vezes" }, { valor: "5+", rotulo: "5 ou mais" }];
const COM: Opcao<Comida>[] = [{ valor: "emagrecer", rotulo: "Estou tentando emagrecer" }, { valor: "ganhar", rotulo: "Estou tentando ganhar peso" }, { valor: "normal", rotulo: "Como normalmente, sem controlar" }, { valor: "varia", rotulo: "Varia muito" }, { valor: "nao-sei", rotulo: "Não sei" }];
const SON: Opcao<Sono>[] = [{ valor: "lt5", rotulo: "Menos de 5 h" }, { valor: "5a6", rotulo: "5 a 6 h" }, { valor: "6a7", rotulo: "6 a 7 h" }, { valor: "7a8", rotulo: "7 a 8 h" }, { valor: "gt8", rotulo: "Mais de 8 h" }, { valor: "varia", rotulo: "Varia muito" }];
const FDS: Opcao<FimSemana>[] = [{ valor: "nao", rotulo: "Não muito" }, { valor: "um-pouco", rotulo: "Como ou bebo um pouco mais" }, { valor: "bastante", rotulo: "Muda bastante" }, { valor: "varia", rotulo: "Varia" }, { valor: "nao-informar", rotulo: "Prefiro não informar" }];
const MED: Opcao<Medicacao>[] = [
  { valor: "nao", rotulo: "Não" }, { valor: "tirzepatida", rotulo: "Tirzepatida", detalhe: "ex.: Mounjaro" }, { valor: "semaglutida", rotulo: "Semaglutida", detalhe: "ex.: Ozempic, Wegovy" },
  { valor: "retatrutida", rotulo: "Retatrutida", detalhe: "ainda em estudo, sem marca" }, { valor: "liraglutida", rotulo: "Liraglutida", detalhe: "ex.: Saxenda" }, { valor: "outra", rotulo: "Outra" }, { valor: "nao-informar", rotulo: "Prefiro não informar" },
];
const TMED: Opcao<string>[] = [{ valor: "lt1", rotulo: "Menos de 1 mês" }, { valor: "1a3", rotulo: "1 a 3 meses" }, { valor: "3a6", rotulo: "3 a 6 meses" }, { valor: "gt6", rotulo: "Mais de 6 meses" }, { valor: "ni", rotulo: "Prefiro não informar" }];
const HOR: Opcao<Hormonio>[] = [{ valor: "nao", rotulo: "Não" }, { valor: "reposicao", rotulo: "Reposição hormonal prescrita" }, { valor: "desempenho", rotulo: "Uso para estética ou desempenho" }, { valor: "outro", rotulo: "Outro" }, { valor: "nao-informar", rotulo: "Prefiro não informar" }];
const HIST: Opcao<HistoricoPeso>[] = [{ valor: "sempre", rotulo: "Meu peso é estável" }, { valor: "mudei", rotulo: "Mudou porque mudei a rotina" }, { valor: "sem-querer", rotulo: "Perdi peso sem querer" }, { valor: "nao-sei", rotulo: "Não sei" }];
const MEDIDAS: { k: keyof Medidas; rotulo: string }[] = [{ k: "cintura", rotulo: "Cintura" }, { k: "abdomen", rotulo: "Abdômen" }, { k: "quadril", rotulo: "Quadril" }, { k: "braco", rotulo: "Braço" }, { k: "coxa", rotulo: "Coxa" }, { k: "peito", rotulo: "Peito" }];
const NOME_CAMINHO = { emagrecer: "Emagrecer", recomp: "Recomposição", massa: "Ganhar massa" } as const;

const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const btnPrim = "inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 transition-colors";
const btnSec = "inline-flex items-center justify-center border border-white/25 text-white px-5 py-3.5 text-sm min-h-[52px] hover:border-white/60 transition-colors";
const fmtN = (n: number) => Math.round(n).toLocaleString("pt-BR");
const sinal = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${fmtKg(Math.abs(Math.round(n * 2) / 2))}`;

export default function SimuladorShape12({ placement }: { placement: string }) {
  const [r, setR] = useState<R>(VAZIO);
  const [passo, setPasso] = useState(0); // 0 capa · 1–8 perguntas · 9 ponto de partida · 10 resultado
  const [erros, setErros] = useState<Record<string, string>>({});
  const [bloq, setBloq] = useState<Bloqueio12 | null>(null);
  const [cen, setCen] = useState<Cenario12 | null>(null);
  const [metrica, setMetrica] = useState<"peso" | "treinos">("peso");
  const [metodo, setMetodo] = useState(false);
  const [enviarDados, setEnviarDados] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [hoje, setHoje] = useState<Date | null>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const iniciou = useRef(false);
  const viuCheckpoint = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setHoje(new Date());
      try { const s = sessionStorage.getItem(CHAVE); if (s) { const d = JSON.parse(s) as { r: R; passo: number; cen: Cenario12 | null }; if (d?.r) { setR({ ...VAZIO, ...d.r }); setPasso(d.passo); setCen(d.cen); iniciou.current = true; } } } catch { /* sem storage */ }
    }, 0);
    trackOncePerSession("shape12_view", { placement });
    return () => clearTimeout(t);
  }, [placement]);
  useEffect(() => { if (passo === 0) return; try { sessionStorage.setItem(CHAVE, JSON.stringify({ r, passo, cen })); } catch { /* ignora */ } }, [r, passo, cen]);

  const set = <K extends keyof R>(k: K, v: R[K]) => { setR((a) => ({ ...a, [k]: v })); setErros((e) => { const n = { ...e }; delete n[k as string]; return n; }); };
  function irPara(n: number) { setPasso(n); requestAnimationFrame(() => { raiz.current?.scrollIntoView({ behavior: "smooth", block: "start" }); tituloRef.current?.focus({ preventScroll: true }); }); }
  function comecar() { if (!iniciou.current) { iniciou.current = true; trackEvent("shape12_start", { placement }); } irPara(1); }

  const idade = parseNumero(r.idade), altura = parseAltura(r.altura), peso = parseNumero(r.peso);
  const gordura = r.sabeGordura ? parseNumero(r.gordura) : null;
  const kcal = r.sabeKcal ? parseNumero(r.kcal) : null;
  const proteina = r.sabeProteina ? parseNumero(r.proteina) : null;
  const medidas: Medidas = useMemo(() => {
    const m: Medidas = {};
    for (const { k } of MEDIDAS) { const v = parseNumero(r[k]); if (v !== null && v >= 15 && v <= 250) m[k] = v; }
    return m;
  }, [r]);

  const perfil: Perfil12 | null = useMemo(() => {
    if (idade === null || altura === null || peso === null || !r.sexo || !r.objetivo || !r.experiencia || r.treinos === null || !r.consistHist || !r.rotina) return null;
    return {
      objetivo: r.objetivo, espelho: r.espelho, idade, sexo: r.sexo, alturaCm: altura, pesoKg: peso, gorduraPct: gordura !== null && gordura >= 3 && gordura <= 60 ? gordura : null, medidas,
      experiencia: r.experiencia, treinos: r.treinos, tempo: r.tempo ?? "45a60", estruturado: r.estruturado ?? "mais-ou-menos", acompanha: r.acompanha ?? "nao-sei", esforco: r.esforco ?? "nao-sei", consistHist: r.consistHist,
      rotina: r.rotina, passos: r.passos ?? "nao-sei", cardio: r.cardio ?? "nao", comida: r.comida ?? "nao-sei", kcalDia: kcal !== null && kcal >= KCAL_MIN && kcal <= KCAL_MAX ? kcal : null,
      proteinaG: proteina, sono: r.sono, fimSemana: r.fimSemana, medicacao: r.medicacao, hormonio: r.hormonio, historicoPeso: r.historicoPeso,
    };
  }, [idade, altura, peso, gordura, kcal, proteina, medidas, r]);

  function avancar(pular = false) {
    const e: Record<string, string> = {};
    if (!pular) {
      if (passo === 1 && !r.objetivo) e.objetivo = "Escolha uma opção para seguir.";
      if (passo === 2) {
        for (const x of validaBasicos(idade, altura, peso)) e[x.campo] = x.mensagem;
        if (!r.sexo) e.sexo = "Escolha uma opção. Ela entra só na equação de gasto.";
        if (r.sexo === "f" && r.gestante === null) e.gestante = "Responda para seguir.";
        if (r.sabeGordura && (gordura === null || gordura < 3 || gordura > 60)) e.gordura = "Informe um percentual entre 3 e 60, ou marque “Não”.";
        if (Object.keys(e).length === 0) { const b = bloqueio12(idade!, r.sexo === "f" && r.gestante === true, r.objetivo!, peso!, altura!); if (b) { setBloq(b); return; } }
      }
      if (passo === 3) for (const { k, rotulo } of MEDIDAS) { const v = r[k]; if (v.trim() && (parseNumero(v) === null || parseNumero(v)! < 15 || parseNumero(v)! > 250)) e[k] = `Confira ${rotulo.toLowerCase()}: em cm, entre 15 e 250.`; }
      if (passo === 4) { if (!r.experiencia) e.experiencia = "Escolha a opção mais próxima."; if (r.treinos === null) e.treinos = "Escolha quantos dias (0 também vale)."; }
      if (passo === 5) { if (!r.consistHist) e.consistHist = "Escolha a opção mais próxima — é a variável mais importante do simulador."; }
      if (passo === 6) { if (!r.rotina) e.rotina = "Escolha a opção mais parecida com seu dia."; }
      if (passo === 7 && r.sabeKcal && (kcal === null || kcal < KCAL_MIN || kcal > KCAL_MAX)) e.kcal = `Informe um número entre ${fmtN(KCAL_MIN)} e ${fmtN(KCAL_MAX)}, ou marque “Não”.`;
    }
    if (Object.keys(e).length) { setErros(e); return; }
    trackEvent("shape12_step_complete", { placement, step: passo });
    if (passo === TOTAL) { irPara(9); return; }
    irPara(passo + 1);
  }
  function projetar() { if (!perfil) return; setCen(cenarioAtual12(perfil)); trackEvent("shape12_complete", { placement }); irPara(10); }
  function recomecar() { try { sessionStorage.removeItem(CHAVE); } catch { /* ignora */ } setR(VAZIO); setCen(null); setBloq(null); setErros({}); setEnviarDados(false); irPara(1); }
  function mexe(controle: string, novo: Partial<Cenario12>) { setCen((c) => (c ? { ...c, ...novo } : c)); trackEvent("shape12_scenario_change", { placement, control: controle }); }
  const clique = () => trackEvent("shape12_internal_tool_click", { placement });

  const atual = perfil ? cenarioAtual12(perfil) : null;
  const prAtual = useMemo(() => (perfil && atual ? projeta12(perfil, atual) : null), [perfil, atual?.treinos, atual?.passos, atual?.consistencia]); // eslint-disable-line react-hooks/exhaustive-deps
  const pr = useMemo(() => (perfil && cen ? projeta12(perfil, cen) : null), [perfil, cen]);
  const diag = useMemo(() => (perfil ? diagnostico12(perfil) : null), [perfil]);
  const imp = useMemo(() => (perfil && cen ? impactos12(perfil, cen) : []), [perfil, cen]);
  const ins = insight12(imp);
  const cps = hoje ? checkpoints(hoje) : null;

  useEffect(() => { if (passo === 10 && !viuCheckpoint.current) { viuCheckpoint.current = true; trackEvent("shape12_checkpoint_view", { placement }); } }, [passo, placement]);

  if (bloq) return <div ref={raiz} className="scroll-mt-24"><Guardrail b={bloq} tituloRef={tituloRef} onVoltar={() => { setBloq(null); if (bloq.tipo === "imc-baixo-emagrecer") { set("objetivo", "recomp"); irPara(1); } else irPara(2); }} onRecomecar={recomecar} /></div>;

  if (passo === 0) {
    return (
      <div ref={raiz} className="border border-white/15 p-6 sm:p-8 scroll-mt-24" data-testid="simulador-capa">
        <p className="text-white text-xl font-bold mb-2" style={h}>12 semanas vão passar de qualquer jeito.</p>
        <p className="text-white text-lg leading-relaxed mb-2">Veja o que você pode acumular até lá — e o que mais mudaria o resultado.</p>
        <p className="text-gray-400 text-sm mb-6">Cerca de 2 minutos. Isso aqui não é promessa: é uma simulação. Nada sai do seu navegador.</p>
        <button type="button" onClick={comecar} className={btnPrim}>Simular minhas 12 semanas →</button>
      </div>
    );
  }

  if (passo >= 1 && passo <= TOTAL) {
    return (
      <div ref={raiz} className="border border-white/15 p-5 sm:p-8 scroll-mt-24" data-testid={`simulador-passo-${passo}`}>
        <ProgressBar passo={passo} total={TOTAL} />
        <form onSubmit={(e) => { e.preventDefault(); avancar(); }} noValidate>
          {passo === 1 && (
            <QuestionStep titulo="O que você mais gostaria de mudar nas próximas 12 semanas?" tituloRef={tituloRef}>
              <OptionCards nome="Objetivo" opcoes={OBJ} valor={r.objetivo} onChange={(v) => set("objetivo", v)} />
              <Erro m={erros.objetivo} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">E o que mais quer ver no espelho? <span className="text-gray-500 font-normal">(opcional — marque todos)</span></p>
              <MultiOptionCards nome="O que quer ver no espelho" colunas={2} opcoes={ESPELHO} valores={r.espelho} onChange={(v) => set("espelho", v)} />
            </QuestionStep>
          )}
          {passo === 2 && (
            <QuestionStep titulo="Seu ponto de partida" tituloRef={tituloRef} ajuda="Idade, altura, peso e sexo biológico entram na equação de gasto. Ficam só no seu navegador.">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <NumericInput rotulo="Idade" sufixo="anos" valor={r.idade} onChange={(v) => set("idade", v)} erro={erros.idade} placeholder="30" />
                <NumericInput rotulo="Altura" sufixo="cm" valor={r.altura} onChange={(v) => set("altura", v)} erro={erros.altura} placeholder="170" />
                <div className="col-span-2"><NumericInput rotulo="Peso atual" sufixo="kg" valor={r.peso} onChange={(v) => set("peso", v)} erro={erros.peso} placeholder="75" /></div>
              </div>
              <p className="text-white text-sm font-semibold mb-1.5">Sexo biológico</p>
              <OptionCards nome="Sexo biológico" colunas={2} opcoes={[{ valor: "f", rotulo: "Feminino" }, { valor: "m", rotulo: "Masculino" }]} valor={r.sexo} onChange={(v) => set("sexo", v)} />
              <Erro m={erros.sexo} />
              {r.sexo === "f" && (<><p className="text-white text-sm font-semibold mt-4 mb-1.5">Está grávida ou amamentando?</p><OptionCards nome="Gestação ou amamentação" colunas={2} opcoes={[{ valor: "nao", rotulo: "Não" }, { valor: "sim", rotulo: "Sim" }]} valor={r.gestante === null ? null : r.gestante ? "sim" : "nao"} onChange={(v) => set("gestante", v === "sim")} /><Erro m={erros.gestante} /></>)}
              <p className="text-white text-sm font-semibold mt-5 mb-1.5">Sabe aproximadamente seu percentual de gordura? <span className="text-gray-500 font-normal">(opcional)</span></p>
              <OptionCards nome="Sabe o percentual de gordura" colunas={2} opcoes={[{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }]} valor={r.sabeGordura === null ? null : r.sabeGordura ? "sim" : "nao"} onChange={(v) => set("sabeGordura", v === "sim")} />
              {r.sabeGordura && <div className="mt-3"><NumericInput rotulo="Percentual de gordura" sufixo="%" valor={r.gordura} onChange={(v) => set("gordura", v)} erro={erros.gordura} placeholder="22" /></div>}
            </QuestionStep>
          )}
          {passo === 3 && (
            <QuestionStep titulo="Tem alguma medida recente?" tituloRef={tituloRef} ajuda="Informe só o que souber — em cm. Medida acompanha o shape muito melhor que o peso sozinho. Não sabe? Pode pular.">
              <div className="grid grid-cols-2 gap-3">
                {MEDIDAS.map(({ k, rotulo }) => <NumericInput key={k} rotulo={rotulo} sufixo="cm" valor={r[k]} onChange={(v) => set(k, v)} erro={erros[k]} />)}
              </div>
              <p className="text-gray-500 text-xs mt-3">Cintura: fita no meio do caminho entre a última costela e o osso do quadril, justa, sem apertar, paralela ao chão.</p>
            </QuestionStep>
          )}
          {passo === 4 && (
            <QuestionStep titulo="Seu treino hoje" tituloRef={tituloRef}>
              <p className="text-white text-sm font-semibold mb-1.5">Há quanto tempo você treina musculação de forma consistente?</p>
              <OptionCards nome="Experiência" colunas={2} opcoes={EXP} valor={r.experiencia} onChange={(v) => set("experiencia", v)} />
              <Erro m={erros.experiencia} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Quantos dias por semana você consegue <em>realmente</em> treinar?</p>
              <OptionCards nome="Treinos por semana" colunas={4} opcoes={[0, 1, 2, 3, 4, 5, 6].map((n) => ({ valor: n, rotulo: n === 6 ? "6+" : String(n) }))} valor={r.treinos} onChange={(v) => set("treinos", v)} />
              <Erro m={erros.treinos} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Quanto tempo costuma ter por treino?</p>
              <OptionCards nome="Tempo por treino" colunas={2} opcoes={TEMPO} valor={r.tempo} onChange={(v) => set("tempo", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Seu treino é estruturado?</p>
              <OptionCards nome="Treino estruturado" opcoes={ESTR} valor={r.estruturado} onChange={(v) => set("estruturado", v)} />
            </QuestionStep>
          )}
          {passo === 5 && (
            <QuestionStep titulo="Como você treina" tituloRef={tituloRef}>
              <p className="text-white text-sm font-semibold mb-1.5">Você acompanha cargas ou repetições?</p>
              <OptionCards nome="Acompanha cargas" colunas={2} opcoes={ACOMP} valor={r.acompanha} onChange={(v) => set("acompanha", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Quando termina uma série importante, geralmente sente que…</p>
              <OptionCards nome="Esforço na série" opcoes={ESF} valor={r.esforco} onChange={(v) => set("esforco", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Nas últimas semanas, quantos treinos planejados você realmente fez?</p>
              <OptionCards nome="Consistência recente" opcoes={CONS} valor={r.consistHist} onChange={(v) => set("consistHist", v)} />
              <Erro m={erros.consistHist} />
            </QuestionStep>
          )}
          {passo === 6 && (
            <QuestionStep titulo="Como é seu dia fora da academia?" tituloRef={tituloRef}>
              <OptionCards nome="Rotina" colunas={2} opcoes={ROT} valor={r.rotina} onChange={(v) => set("rotina", v)} />
              <Erro m={erros.rotina} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Sabe quantos passos faz por dia? <span className="text-gray-500 font-normal">(opcional)</span></p>
              <OptionCards nome="Passos por dia" colunas={2} opcoes={PAS} valor={r.passos} onChange={(v) => set("passos", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Faz cardio ou pratica algum esporte?</p>
              <OptionCards nome="Cardio e esportes" colunas={2} opcoes={CAR} valor={r.cardio} onChange={(v) => set("cardio", v)} />
            </QuestionStep>
          )}
          {passo === 7 && (
            <QuestionStep titulo="Comida e sono" tituloRef={tituloRef} ajuda="Tudo opcional. Pode deixar em branco ou pular — o simulador funciona do mesmo jeito.">
              <p className="text-white text-sm font-semibold mb-1.5">Como está sua alimentação hoje?</p>
              <OptionCards nome="Alimentação hoje" colunas={2} opcoes={COM} valor={r.comida} onChange={(v) => set("comida", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Sabe aproximadamente quantas calorias come?</p>
              <OptionCards nome="Sabe as calorias" colunas={2} opcoes={[{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }]} valor={r.sabeKcal === null ? null : r.sabeKcal ? "sim" : "nao"} onChange={(v) => set("sabeKcal", v === "sim")} />
              {r.sabeKcal && <div className="mt-3"><NumericInput rotulo="Calorias por dia" sufixo="kcal" valor={r.kcal} onChange={(v) => set("kcal", v)} erro={erros.kcal} placeholder="2200" /></div>}
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">E proteína?</p>
              <OptionCards nome="Sabe a proteína" colunas={2} opcoes={[{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }]} valor={r.sabeProteina === null ? null : r.sabeProteina ? "sim" : "nao"} onChange={(v) => set("sabeProteina", v === "sim")} />
              {r.sabeProteina && <div className="mt-3"><NumericInput rotulo="Proteína por dia" sufixo="g" valor={r.proteina} onChange={(v) => set("proteina", v)} placeholder="100" /></div>}
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Quantas horas costuma dormir?</p>
              <OptionCards nome="Sono" colunas={3} opcoes={SON} valor={r.sono} onChange={(v) => set("sono", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Seu fim de semana costuma ser muito diferente dos outros dias?</p>
              <OptionCards nome="Fim de semana" colunas={2} opcoes={FDS} valor={r.fimSemana} onChange={(v) => set("fimSemana", v)} />
            </QuestionStep>
          )}
          {passo === 8 && (
            <QuestionStep titulo="Contexto" tituloRef={tituloRef} ajuda="Opcional. Nada disso muda a curva — muda a leitura do resultado. Não sai do seu navegador.">
              <p className="text-white text-sm font-semibold mb-1.5">Você usa alguma medicação para emagrecimento?</p>
              <OptionCards nome="Medicação para emagrecimento" colunas={2} opcoes={MED} valor={r.medicacao} onChange={(v) => set("medicacao", v)} />
              {r.medicacao && !["nao", "nao-informar"].includes(r.medicacao) && (
                <div className="mt-4 space-y-4">
                  <div><p className="text-white text-sm font-semibold mb-1.5">Há quanto tempo?</p><OptionCards nome="Tempo de uso" colunas={2} opcoes={TMED} valor={r.tempoMed} onChange={(v) => set("tempoMed", v)} /></div>
                  <div><p className="text-white text-sm font-semibold mb-1.5">Está sendo acompanhado por médico?</p><OptionCards nome="Acompanhamento médico" colunas={3} opcoes={[{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }, { valor: "ni", rotulo: "Prefiro não dizer" }]} valor={r.medico} onChange={(v) => set("medico", v)} /></div>
                </div>
              )}
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Você utiliza testosterona ou outro hormônio/anabolizante?</p>
              <OptionCards nome="Hormônios" opcoes={HOR} valor={r.hormonio} onChange={(v) => set("hormonio", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">E o seu peso, nos últimos meses?</p>
              <OptionCards nome="Histórico do peso" opcoes={HIST} valor={r.historicoPeso} onChange={(v) => set("historicoPeso", v)} />
            </QuestionStep>
          )}
          <div className="flex flex-wrap gap-3 mt-8">
            {passo > 1 && <button type="button" onClick={() => irPara(passo - 1)} className={btnSec}>← Voltar</button>}
            <button type="submit" className={btnPrim}>{passo === TOTAL ? "Ver meu ponto de partida →" : "Continuar →"}</button>
            {PULAVEIS.has(passo) && <button type="button" onClick={() => avancar(true)} className="text-gray-400 text-sm underline underline-offset-4 min-h-[52px] px-2">Pular esta etapa</button>}
          </div>
        </form>
      </div>
    );
  }

  if (!perfil) {
    return <div ref={raiz} className="border border-white/15 p-6"><p className="text-white mb-4">Faltou alguma resposta para montar a simulação.</p><button type="button" onClick={recomecar} className={btnPrim}>Refazer</button></div>;
  }
  const cam = caminho(perfil);
  const sugeridos = perfil.objetivo === "nao-sei" ? caminhosSugeridos(perfil) : null;
  const a0 = cenarioAtual12(perfil);

  /* ── Checkpoint zero: seu ponto de partida ── */
  if (passo === 9) {
    const itens: [string, string][] = [
      ["Peso", fmtKg(perfil.pesoKg)],
      ...(perfil.medidas.cintura ? [["Cintura", `${perfil.medidas.cintura.toLocaleString("pt-BR")} cm`] as [string, string]] : []),
      ["Treino", `${perfil.treinos}x por semana`],
      ["Passos", perfil.passos === "nao-sei" ? "não sei (usamos 5 mil)" : `~${fmtN(PASSOS12[perfil.passos])} por dia`],
      ["Consistência", `${Math.round(CONSIST_HIST[perfil.consistHist] * 100)}% dos treinos`],
      ["Objetivo", perfil.objetivo === "nao-sei" ? "melhorar o shape" : NOME_CAMINHO[perfil.objetivo].toLowerCase()],
    ];
    return (
      <div ref={raiz} className="border border-white/15 p-5 sm:p-8 scroll-mt-24" data-testid="ponto-de-partida">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: DOURADO }}>Checkpoint zero</p>
        <h2 ref={tituloRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-white mb-5 outline-none" style={h}>Seu ponto de partida</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
          {itens.map(([k, v]) => <div key={k} className="border border-white/15 p-3"><dt className="text-gray-400 text-xs uppercase tracking-wide">{k}</dt><dd className="text-white font-semibold">{v}</dd></div>)}
        </dl>
        <p className="text-gray-300 mb-6">Agora vamos projetar suas próximas 12 semanas. Você pode mudar o cenário daqui a pouco.</p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => irPara(2)} className={btnSec}>← Editar</button>
          <button type="button" onClick={projetar} className={btnPrim}>Projetar minhas 12 semanas →</button>
        </div>
      </div>
    );
  }

  if (!cen || !pr || !prAtual || !diag) return <div ref={raiz} className="border border-white/15 p-6"><button type="button" onClick={() => irPara(9)} className={btnPrim}>Ver meu ponto de partida</button></div>;

  /* ── Resultado ── */
  const igual = cen.treinos === a0.treinos && cen.passos === a0.passos && cen.consistencia === a0.consistencia;
  const f12 = pr.pontos[SEMANAS];
  const faixa12 = `${fmtKgProj(Math.min(f12.min, f12.max))} a ${fmtKgProj(Math.max(f12.min, f12.max))}`;
  const marcosG: Marco[] = [0, 4, 8, 12].map((s) => ({ x: s, rotulo: s === 0 ? "Hoje" : `Sem ${s}` }));
  const serieTreinos = (p: Cenario12) => Array.from({ length: SEMANAS + 1 }, (_, w) => ({ x: w, y: w * p.treinos * p.consistencia }));
  const ev = evidencia12(diag.gargalo);
  const usaCaneta = !!perfil.medicacao && !["nao", "nao-informar"].includes(perfil.medicacao);
  const usaHormonio = perfil.hormonio === "reposicao" || perfil.hormonio === "desempenho" || perfil.hormonio === "outro";
  const prot = perfil.proteinaG !== null ? avaliaProteina(perfil.proteinaG, perfil.pesoKg) : null;
  const ctaTexto = usaCaneta ? "Quero organizar meu treino" : diag.cta;
  const msgPadrao = "Oi, Montinho! Fiz o Meu Shape em 12 Semanas no seu site e queria ajuda para transformar essa simulação em um plano de treino.";
  const msgComDados = `${msgPadrao}\n\nMeu cenário (escolhi compartilhar): objetivo ${NOME_CAMINHO[cam].toLowerCase()}, peso ${fmtKg(perfil.pesoKg)}, ${cen.treinos} treinos por semana, ${Math.round(cen.consistencia * 100)}% de consistência.`;
  const dIni = cps ? fmtData(cps[0].data) : "hoje", dFim = cps ? fmtData(cps[3].data) : "daqui a 12 semanas";
  const textoShare = `Minhas próximas 12 semanas: ${NOME_CAMINHO[cam].toLowerCase()}, ${pr.planejados} treinos planejados, meta de ${Math.round(cen.consistencia * 100)}% de consistência. Começo ${dIni}, checkpoint final ${dFim}. Simule as suas:`;
  const urlPagina = "https://www.montinhopersonal.com.br/ferramentas/meu-shape-12-semanas";
  async function compartilhar() {
    trackEvent("shape12_share", { placement });
    try { if (navigator.share) { await navigator.share({ title: "Minhas próximas 12 semanas", text: textoShare, url: urlPagina }); return; } await navigator.clipboard.writeText(`${textoShare} ${urlPagina}`); setCopiado(true); setTimeout(() => setCopiado(false), 2500); } catch { /* cancelado */ }
  }

  return (
    <div ref={raiz} className="scroll-mt-24 space-y-8" data-testid="simulador-resultado">
      {/* R1 — resposta */}
      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-5 sm:p-8 relative" aria-live="polite">
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: DOURADO }} aria-hidden="true" />
        <h2 ref={tituloRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-white mb-4 outline-none" style={h}>Seu cenário para as próximas 12 semanas</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div><dt className="text-gray-400 text-xs uppercase tracking-wide">Caminho</dt><dd className="text-white font-semibold">{NOME_CAMINHO[cam]}</dd></div>
          <div><dt className="text-gray-400 text-xs uppercase tracking-wide">Treinos</dt><dd className="text-white font-semibold">{cen.treinos}x por semana</dd></div>
          <div><dt className="text-gray-400 text-xs uppercase tracking-wide">Passos</dt><dd className="text-white font-semibold">~{fmtN(cen.passos)}/dia</dd></div>
          <div><dt className="text-gray-400 text-xs uppercase tracking-wide">Consistência</dt><dd className="text-white font-semibold">{Math.round(cen.consistencia * 100)}%</dd></div>
        </dl>
        <p className="text-lg text-white leading-relaxed" data-testid="resposta">
          Na semana 12, o peso ficaria perto de <strong style={{ color: DOURADO }}>{faixa12}</strong> ({sinal(pr.variacao12.centro)}) — e você teria feito <strong style={{ color: DOURADO }}>{pr.realizados} treinos</strong>.
        </p>
        {cam === "recomp" && <p className="text-gray-300 text-sm mt-3">Na recomposição, o peso é o sinal <strong className="text-white">menos</strong> importante: ele pode cair pouco, ficar estável ou até subir com o shape melhorando. Cintura, força e fotos contam mais. {pr.recomp === "provavel" ? "Pelo seu perfil, a recomposição tende a ser provável." : pr.recomp === "possivel" ? "Pelo seu perfil, ela é possível, mas mais lenta." : "Com anos de treino, ela costuma ser lenta — o que não quer dizer impossível."}</p>}
        {sugeridos && <p className="text-gray-300 text-sm mt-3 border-l-2 pl-3" style={{ borderColor: DOURADO }}>Você não sabia qual caminho seguir. Pelas suas respostas, existem dois que valem considerar: <strong className="text-white">{NOME_CAMINHO[sugeridos[0]].toLowerCase()}</strong> (projetado aqui) e <strong className="text-white">{NOME_CAMINHO[sugeridos[1]].toLowerCase()}</strong>. Não é diagnóstico — é um ponto de partida para decidir, de preferência com alguém olhando o seu caso.</p>}
        <p className="text-gray-400 text-sm mt-3">Isto é uma projeção baseada nas informações que você forneceu. Seu resultado real dependerá da sua resposta individual ao treino, alimentação, rotina e outros fatores.</p>
        {perfil.historicoPeso === "sem-querer" && <p className="text-white text-sm mt-3 border-l-2 pl-3" style={{ borderColor: DOURADO }}>Você contou que perdeu peso sem querer. Vale conversar com um profissional de saúde antes de mudar a alimentação.</p>}
      </div>

      {/* R2 — gráfico */}
      <div className="border border-white/15 p-4 sm:p-6" data-testid="grafico">
        <div role="radiogroup" aria-label="O que o gráfico mostra" className="flex gap-1.5 mb-4">
          {(["peso", "treinos"] as const).map((m) => (
            <button key={m} type="button" role="radio" aria-checked={metrica === m} onClick={() => { setMetrica(m); trackEvent("shape12_scenario_change", { placement, control: `metric_${m}` }); }}
              className={`px-3 min-h-[44px] text-sm border ${metrica === m ? "bg-white text-black border-white font-semibold" : "border-white/20 text-gray-300"}`}>{m === "peso" ? "Peso" : "Treinos acumulados"}</button>
          ))}
        </div>
        {metrica === "peso" ? (
          <ProjectionChart serie={pr.pontos.map((p) => ({ x: p.semana, y: p.peso, min: p.min, max: p.max }))} comparacao={igual ? null : prAtual.pontos.map((p) => ({ x: p.semana, y: p.peso }))} marcos={marcosG}
            formataY={fmtKgProj} formataX={(x) => (x === 0 ? "Hoje" : `Semana ${x}`)} rotuloSerie={igual ? "peso estimado" : "ajustado"} rotuloComparacao="como está" descricao="Peso estimado ao longo das 12 semanas, com faixa provável." />
        ) : (
          <ProjectionChart serie={serieTreinos(cen)} comparacao={igual ? null : serieTreinos(a0)} marcos={marcosG}
            formataY={(n) => `${Math.round(n)} treinos`} formataX={(x) => (x === 0 ? "Hoje" : `Semana ${x}`)} rotuloSerie={igual ? "treinos feitos" : "ajustado"} rotuloComparacao="como está" descricao="Treinos acumulados ao longo das 12 semanas." />
        )}
        <p className="text-gray-500 text-xs mt-3">Seu corpo não responde como uma planilha. A faixa em volta da linha representa essa incerteza.</p>
      </div>

      {/* R3 — linha do tempo */}
      <div className="border border-white/15 p-5 sm:p-6">
        <h3 className="text-xl font-bold text-white mb-1" style={h}>Suas 12 semanas</h3>
        <p className="text-gray-400 text-sm mb-4">{cps ? <>Se você começar hoje, seu checkpoint final será em <strong className="text-white">{dFim}</strong>. A data marca a duração — não promete o resultado.</> : "Três checkpoints: semanas 4, 8 e 12."}</p>
        <TwelveWeekTimeline marcos={[0, 4, 8, 12].map((s, i) => ({ semana: s, data: cps ? fmtData(cps[i].data) : undefined, valor: s === 0 ? fmtKg(perfil.pesoKg) : `~${fmtKgProj(pr.pontos[s].peso)}` }))} feitos={pr.realizados} />
      </div>

      {/* R4 — o que você acumularia */}
      <div className="border border-white/15 p-5 sm:p-6" data-testid="acumulado">
        <h3 className="text-xl font-bold text-white mb-4" style={h}>O que você acumularia</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-white/15 p-3"><p className="text-gray-400 text-xs uppercase tracking-wide">Oportunidades de treino</p><p className="text-white text-2xl font-bold tabular-nums">{pr.planejados}</p><p className="text-gray-500 text-xs">{cen.treinos} por semana × 12</p></div>
          <div className="border border-[#BA9E50] p-3"><p className="text-xs uppercase tracking-wide" style={{ color: DOURADO }}>Treinos feitos</p><p className="text-white text-2xl font-bold tabular-nums">{pr.realizados}</p><p className="text-gray-500 text-xs">com {Math.round(cen.consistencia * 100)}% de consistência</p></div>
        </div>
        {cen.consistencia < 0.9 && <p className="text-gray-300 text-sm mt-3">Com 90%, seriam <strong className="text-white">{Math.round(pr.planejados * 0.9)}</strong> — <strong className="text-white">+{Math.round(pr.planejados * 0.9) - pr.realizados} estímulos de treino</strong> nas mesmas 12 semanas.</p>}
      </div>

      {/* R5 — gargalo */}
      <InsightCard titulo="O principal gargalo hoje">
        <p className="font-semibold" style={h}>{diag.titulo}</p>
        <p className="text-gray-300 mt-2">{diag.texto}</p>
        <p className="text-gray-400 text-xs mt-2">Pelas respostas que você forneceu — regras fixas, não diagnóstico.</p>
      </InsightCard>
      <div className="border border-white/15 p-5 sm:p-6" data-testid="primeiro">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: DOURADO }}>O que eu olharia primeiro no seu caso</p>
        <p className="text-white leading-relaxed">{diag.primeiro}</p>
      </div>

      {/* R6 — e se */}
      <div className="border border-white/15 p-5 sm:p-6" data-testid="cenarios">
        <h3 className="text-xl font-bold text-white mb-1" style={h}>E se você…</h3>
        <p className="text-gray-400 text-sm mb-5">Toque para comparar. O gráfico e os números acima mudam na hora.</p>
        <div className="space-y-5">
          <ScenarioSelector rotulo="Treinasse por semana" opcoes={[2, 3, 4, 5].map((n) => ({ valor: n, rotulo: `${n}x` }))} valor={cen.treinos} atual={a0.treinos} onChange={(v) => mexe("training", { treinos: v })} />
          <ScenarioSelector rotulo="Andasse por dia" opcoes={[...new Set([3000, 5000, 7500, 10000, 12500, a0.passos])].sort((x, y) => x - y).map((n) => ({ valor: n, rotulo: fmtN(n) }))} valor={cen.passos} atual={a0.passos} onChange={(v) => mexe("steps", { passos: v })} />
          <ScenarioSelector rotulo="Fizesse dos treinos planejados" opcoes={[...new Set([0.5, 0.6, 0.7, 0.8, 0.9, 1, a0.consistencia])].sort((x, y) => x - y).map((n) => ({ valor: n, rotulo: `${Math.round(n * 100)}%` }))} valor={cen.consistencia} atual={a0.consistencia} onChange={(v) => mexe("consistency", { consistencia: v })} />
        </div>
        {!igual && <p className="text-gray-300 text-sm mt-5">Comparado a como está: semana 12 <strong className="text-white">{sinal(pr.variacao12.centro - prAtual.variacao12.centro)}</strong> no peso e <strong className="text-white">{pr.realizados - prAtual.realizados >= 0 ? "+" : ""}{pr.realizados - prAtual.realizados} treinos</strong>. Diferenças pequenas ficam dentro da margem de erro.</p>}
        <button type="button" onClick={() => { setCen(a0); trackEvent("shape12_scenario_change", { placement, control: "reset" }); }} className="text-gray-400 text-sm underline underline-offset-4 mt-4 min-h-[44px]">Voltar a como está hoje</button>
      </div>

      <InsightCard titulo="O que mais pode mudar suas 12 semanas">
        {ins ? <p>Dentro deste modelo, a variável de maior impacto foi <strong>{ins.descricao}</strong> — {ins.unidade === "kg" ? <>cerca de {fmtKg(ins.ganho)} a mais na semana 12.</> : <>+{Math.round(ins.ganho)} treinos feitos.</>}{ins.alavanca === "consistencia" && imp.some((i) => i.alavanca === "treino") && <span className="text-gray-300"> Treinar um dia a mais teve menos impacto do que realizar melhor os treinos que você já planeja.</span>}{ins.alavanca === "passos" && <span className="text-gray-300"> Seu principal limitador não parece ser falta de treino.</span>}</p>
          : imp.length ? <p>Os ajustes testados — {imp.map((i) => i.descricao).join(", ")} — produzem efeitos parecidos. Escolha o que for mais fácil de sustentar.</p> : <p>Seu cenário já está no máximo dos ajustes testados. Agora é sustentar.</p>}
        <p className="text-gray-400 text-xs mt-2">Comparação feita pelo modelo com mudanças pequenas; não é prescrição.</p>
      </InsightCard>

      {/* R7 — recomeçar rápido */}
      <div className="border border-white/15 p-5 sm:p-6" data-testid="recomecar">
        <h3 className="text-xl font-bold text-white mb-1" style={h}>Perdeu um treino? O que importa é o próximo.</h3>
        <p className="text-gray-400 text-sm mb-4">Duas pessoas com o mesmo plano ({cen.treinos}x por semana) e a mesma chance de faltar a um treino.</p>
        {[
          { nome: "Pessoa A", desc: "Faltou? Larga o resto da semana.", v: pr.recomeco.largaSemana, cor: "#6b7280" },
          { nome: "Pessoa B", desc: "Faltou? Volta no treino seguinte.", v: pr.recomeco.voltaRapido, cor: DOURADO },
        ].map((x) => (
          <div key={x.nome} className="mb-3">
            <div className="flex justify-between text-sm mb-1"><span className="text-gray-300"><strong className="text-white">{x.nome}</strong> · {x.desc}</span><span className="text-white font-semibold tabular-nums">{x.v} treinos</span></div>
            <div className="h-2 bg-white/10"><div className="h-2" style={{ width: `${Math.max(3, (x.v / Math.max(1, pr.planejados)) * 100)}%`, background: x.cor }} /></div>
          </div>
        ))}
        <p className="text-white text-sm mt-3">O principal não é nunca errar. É reduzir o tempo entre sair da rotina e voltar.</p>
      </div>

      {/* R8 — fases e checkpoints */}
      <div className="border border-white/15 p-5 sm:p-6" data-testid="checkpoints">
        <h3 className="text-xl font-bold text-white mb-4" style={h}>O que medir em cada checkpoint</h3>
        <ol className="space-y-2">
          {FASES.map((f) => (
            <li key={f.id}>
              <Dobra titulo={f.titulo}>
                <p className="text-gray-300 text-sm mb-2">{f.foco}</p>
                <p className="text-gray-400 text-sm mb-2"><span className="text-gray-500 uppercase text-xs tracking-wide">Força:</span> {f.forca}</p>
                <p className="text-white text-sm"><span className="text-gray-500 uppercase text-xs tracking-wide">No checkpoint:</span> quantos treinos completou · peso em média da semana · cintura{Object.keys(perfil.medidas).length > 1 ? " e as medidas que você informou" : ""} · cargas dos exercícios principais · fotos na mesma luz e postura.</p>
              </Dobra>
            </li>
          ))}
        </ol>
        {pr.cintura && <p className="text-gray-300 text-sm mt-4">Cintura: neste cenário, a tendência é <strong className="text-white">{pr.cintura === "cai" ? "cair" : pr.cintura === "estavel" ? "ficar estável ou cair pouco" : "subir um pouco"}</strong>. Sem número de propósito — a relação entre peso e cintura varia muito de pessoa para pessoa. Meça e compare.</p>}
      </div>

      {/* R9 — por quê */}
      <div className="border border-white/15 p-5 sm:p-6" data-testid="por-que">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: DOURADO }}>Por que isso pesa tanto?</p>
        <p className="text-white font-semibold mb-4" style={h}>{ev.resumo}</p>
        <div className="border-l-2 pl-3 mb-4 text-sm" style={{ borderColor: DOURADO }}><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">O que fazer amanhã</p><p className="text-white">{ev.acao}</p></div>
        <div className="space-y-2 text-sm leading-relaxed">
          <Dobra titulo="O que os estudos mediram"><ul className="text-gray-300 space-y-2">{ev.estudos.map((x) => <li key={x.ref.url}>{x.texto} <a href={x.ref.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline underline-offset-2">{x.ref.rotulo}</a></li>)}</ul></Dobra>
          <Dobra titulo="O que a prática mostra"><p className="text-gray-300">{ev.pratica}</p></Dobra>
          <Dobra titulo="O que as pessoas relatam"><p className="text-gray-300">{ev.relatos} <span className="text-gray-500">Relato não é evidência — é o sintoma que os estudos explicam.</span></p></Dobra>
        </div>
      </div>

      {/* R10 — contexto */}
      <div className="space-y-4 text-gray-300 leading-relaxed">
        {prot && <p><strong className="text-white">Proteína:</strong> {prot.gkg.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} g/kg por dia — {prot.estado === "abaixo" ? "abaixo da faixa de 1,6 a 2,2 g/kg associada a ganho e preservação de massa magra." : prot.estado === "na-faixa" ? "dentro da faixa de 1,6 a 2,2 g/kg." : "acima de 2,2 g/kg; não há ganho extra acima disso."} <Link href="/ferramentas/calculadora-de-proteina" onClick={clique} className={ln}>Calculadora de Proteína</Link>.</p>}
        {usaCaneta && (
          <div className="border border-white/15 p-4" data-testid="bloco-caneta">
            <p className="text-white font-semibold mb-1">Está emagrecendo com medicação? A balança é só parte do processo.</p>
            <p className="text-sm mb-2">A curva não soma nenhum “bônus” pelo medicamento. Um programa de musculação pode ajudar a trabalhar força e massa muscular nessa fase — junto com o acompanhamento médico. <Link href="/ferramentas/massa-magra-glp1" onClick={clique} className={ln}>Massa Magra no GLP-1</Link>.</p>
            <Dobra titulo="O que estudos observaram (não é a sua simulação)">
              <ul className="text-sm space-y-2">{ESTUDOS.map((e) => <li key={e.id}><strong className="text-white">{e.substancia}</strong> ({e.estudo}): em {e.duracao}, {e.resultado}, contra {e.comparacao}. <a href={e.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline underline-offset-2">Referência</a></li>)}</ul>
              <p className="text-gray-400 text-xs mt-2">Médias de ensaios com populações, doses e durações específicas — nenhuma delas é de 12 semanas. Uso e dose são decisões do seu médico.</p>
            </Dobra>
          </div>
        )}
        {usaHormonio && <div className="border border-white/15 p-4"><p className="text-white font-semibold mb-1">Por que não dá para prever seu resultado pelo hormônio</p><p className="text-sm">Hormônios podem alterar massa, água, glicogênio e resposta muscular — mas a resposta varia demais para virar número. Por isso o simulador não muda a curva. Acompanhe cintura, medidas, força e fotos, e mantenha o acompanhamento médico separado do treino.</p></div>}
        <p>Quer olhar só o peso, sem prazo fixo? {cam === "massa" ? <Link href="/ferramentas/simulador-ganho-massa-muscular" onClick={clique} className={ln}>Simulador de Ganho de Massa</Link> : <Link href="/ferramentas/simulador-emagrecimento" onClick={clique} className={ln}>Simulador de Emagrecimento</Link>}. Para conferir o volume do treino: <Link href="/ferramentas/calculadora-volume-treino" onClick={clique} className={ln}>Calculadora de Volume</Link>.</p>
      </div>

      {/* R11 — palavra do Montinho + CTA */}
      <DoisCaminhos variante="resultado" placement="shape12-resultado" />

      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 relative" data-testid="cta-simulador">
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: DOURADO }} aria-hidden="true" />
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: DOURADO }}>{FECHAMENTO_COMPARACAO.titulo}</p>
        <div className="space-y-3 mb-6" data-testid="fechamento">{FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white leading-relaxed">{t}</p>)}<p className="text-gray-400 text-sm">— Montinho</p></div>
        <p className="text-white font-bold text-xl mb-2" style={h}>12 semanas vão passar de qualquer jeito. A diferença é o que você vai acumular até lá.</p>
        <p className="text-gray-300 leading-relaxed mb-5 max-w-xl">A simulação mostra onde você pode chegar. Meu trabalho é ajudar você a fazer essas 12 semanas acontecerem: treino estruturado, acompanhamento das cargas, ajustes e uma estratégia que caiba na sua rotina.</p>
        <a href={getWhatsAppUrl(enviarDados ? msgComDados : msgPadrao)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("shape12_whatsapp_click", { placement })} className={btnPrim}>{ctaTexto} →</a>
        <label className="flex items-start gap-3 mt-4 text-gray-300 text-sm cursor-pointer min-h-[44px]"><input type="checkbox" checked={enviarDados} onChange={(e) => setEnviarDados(e.target.checked)} className="w-5 h-5 mt-0.5 accent-[#BA9E50]" /><span>Enviar meu cenário junto (objetivo, peso, treinos e consistência). Sem isso, a mensagem vai sem nenhum número seu.</span></label>
      </div>

      {/* R12 — compartilhar */}
      <div className="border border-white/15 p-5" data-testid="compartilhar">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: DOURADO }}>Minhas próximas 12 semanas</p>
        <p className="text-white">{NOME_CAMINHO[cam]} · {pr.planejados} treinos planejados · meta de {Math.round(cen.consistencia * 100)}% de consistência</p>
        <p className="text-gray-400 text-sm">Começo {dIni} · checkpoint final {dFim}</p>
        <div className="flex flex-wrap items-center gap-3 mt-4">
          <button type="button" onClick={compartilhar} className={btnSec}>Aceito o desafio das 12 semanas</button>
          {copiado && <span className="text-sm text-white" role="status">Link copiado.</span>}
        </div>
        <p className="text-gray-500 text-xs mt-2">O desafio é de consistência, não de resultado garantido. O card não leva peso, medidas, medicação nem nada do seu corpo.</p>
      </div>

      <MethodologyDrawer titulo="Como este simulador funciona?" aberto={metodo} onToggle={() => { if (!metodo) trackEvent("shape12_methodology_open", { placement }); setMetodo(!metodo); }}>
        <p>O peso usa os mesmos motores dos outros Simuladores Montinho: emagrecer e recomposição, o balanço energético dinâmico do Simulador de Emagrecimento (recomposição com déficit leve de 10%); ganhar massa, o do Simulador de Ganho de Massa, com teto de massa magra por nível de treino. A faixa é o mesmo cenário com gasto 5% menor e maior.</p>
        <p>Treinos acumulados são aritmética: treinos por semana × 12 × consistência. “Recomeçar rápido” compara o valor esperado de duas pessoas com a mesma chance de faltar: quem volta no treino seguinte faz n × c por semana; quem larga a semana na primeira falta faz c + c² + … + cⁿ.</p>
        <p>O simulador não calcula quilos de músculo ou de gordura, centímetros de cintura nem números de força — a variação individual é grande demais. Mostra tendência e o que medir. O gargalo sai de regras fixas, nunca de IA.</p>
        <p><a href="#metodologia" onClick={() => { const d = document.getElementById("metodologia"); if (d instanceof HTMLDetailsElement) d.open = true; }} className={ln}>Ver metodologia completa e referências</a></p>
      </MethodologyDrawer>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <button type="button" onClick={() => irPara(9)} className="underline underline-offset-4 min-h-[44px]">Ver meu ponto de partida</button>
        <button type="button" onClick={() => irPara(2)} className="underline underline-offset-4 min-h-[44px]">Editar minhas respostas</button>
        <button type="button" onClick={recomecar} className="underline underline-offset-4 min-h-[44px]">Apagar meus dados e recomeçar</button>
      </div>
    </div>
  );
}

function Erro({ m }: { m?: string }) { return m ? <p role="alert" className="text-red-300 text-sm mt-2">{m}</p> : null; }

function Guardrail({ b, onVoltar, onRecomecar, tituloRef }: { b: Bloqueio12; onVoltar: () => void; onRecomecar: () => void; tituloRef: React.Ref<HTMLHeadingElement> }) {
  const t = {
    menor: ["Este simulador é feito para adultos", "Antes dos 18 anos o corpo ainda está crescendo, e metas de peso precisam considerar isso. Treinar força com orientação já ajuda — e um pediatra ou nutricionista acompanha o resto."],
    gestacao: ["Essa fase merece acompanhamento individual", "Na gestação e na amamentação, as necessidades mudam e o corpo não deve ser tratado como projeto de 12 semanas. Seu obstetra ou nutricionista orienta com segurança o que faz sentido agora."],
    "imc-baixo-emagrecer": ["Emagrecer não parece o caminho", "Pela sua altura, o peso informado já está abaixo da faixa de referência para adultos. Não vamos projetar perda de peso — mas dá para simular recomposição, que foca em shape, força e medidas."],
  }[b.tipo];
  return (
    <div className="border border-white/15 p-6 sm:p-8" data-testid={`guardrail-${b.tipo}`}>
      <h2 ref={tituloRef} tabIndex={-1} className="text-2xl font-bold text-white mb-3 outline-none" style={h}>{t[0]}</h2>
      <p className="text-gray-300 leading-relaxed mb-6">{t[1]}</p>
      <div className="flex flex-wrap gap-3">
        {b.tipo === "imc-baixo-emagrecer" && <button type="button" onClick={onVoltar} className={btnPrim}>Simular recomposição</button>}
        <button type="button" onClick={onRecomecar} className={btnSec}>Recomeçar</button>
      </div>
    </div>
  );
}
