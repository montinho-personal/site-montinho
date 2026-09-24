"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import DoisCaminhos from "@/components/comece/DoisCaminhos";
import ProjectionChart, { type Marco } from "./ProjectionChart";
import { DOURADO, Dobra, InsightCard, MethodologyDrawer, MultiOptionCards, NumericInput, OptionCards, ProgressBar, QuestionStep, ScenarioSelector, h, type Opcao } from "./ui";
import {
  ESTADO_RITMO, MARCOS_MASSA, KCAL_MAX, KCAL_MIN, SEMANAS_MAX,
  avaliaProteina, avisos, bloqueioMassa, cenarioAtualMassa, diagnostico, fmtFaixaSemanas, fmtKg, fmtKgProj, fmtSemanas, manutencao, nivelDe, parseAltura, parseNumero, projetaMassa, ritmos, validaBasicos, validaMetaMassa,
  type Acompanha, type Apetite, type BloqueioMassa, type Cardio, type CenarioMassa, type Continuidade, type Dificuldade, type Experiencia, type FaixaPassos, type HistoricoPeso, type Hormonio, type ObjetivoMassa, type PerfilMassa, type Progressao, type Rotina, type Sexo, type Suplemento, type Tendencia,
} from "@/lib/simulador/massa";
import { evidenciaMassa } from "@/lib/simulador/evidencias-massa";

/**
 * O Simulador de Ganho de Massa Muscular.
 *
 * Mesmas peças do Simulador de Emagrecimento (ui.tsx, ProjectionChart),
 * outra matemática (lib/simulador/massa.ts). Oito telas curtas; nenhuma
 * pergunta obriga a saber calorias, proteína ou percentual de gordura.
 *
 * PRIVACIDADE: tudo roda no navegador; os eventos levam só o número da
 * etapa e o controle mexido; sessionStorage guarda as respostas até a aba
 * fechar, com botão para apagar. A mensagem do WhatsApp vai sem número
 * nenhum, a não ser que a pessoa marque a caixa.
 */

const CHAVE = "montinho:simulador-massa";
const TOTAL = 8;

interface R {
  objetivo: ObjetivoMassa | null;
  idade: string; sexo: Sexo | null; altura: string; peso: string; sabeGordura: boolean | null; gordura: string;
  semMeta: boolean; meta: string;
  experiencia: Experiencia | null; continuidade: Continuidade | null;
  treinos: number | null; acompanha: Acompanha | null;
  tendencia: Tendencia | null; sabeKcal: boolean | null; kcal: string; apetite: Apetite | null; dificuldade: Dificuldade | null;
  sabeProteina: boolean | null; proteina: string;
  rotina: Rotina | null; passos: FaixaPassos | null; cardio: Cardio | null;
  suplementos: Suplemento[]; hormonio: Hormonio | null; historicoPeso: HistoricoPeso | null;
}
const VAZIO: R = { objetivo: null, idade: "", sexo: null, altura: "", peso: "", sabeGordura: null, gordura: "", semMeta: false, meta: "", experiencia: null, continuidade: null, treinos: null, acompanha: null, tendencia: null, sabeKcal: null, kcal: "", apetite: null, dificuldade: null, sabeProteina: null, proteina: "", rotina: null, passos: null, cardio: null, suplementos: [], hormonio: null, historicoPeso: null };

const OBJETIVOS: Opcao<ObjetivoMassa>[] = [
  { valor: "massa", rotulo: "Ganhar massa muscular" }, { valor: "peso", rotulo: "Ganhar peso" }, { valor: "maior", rotulo: "Ficar visualmente maior" },
  { valor: "forca", rotulo: "Ganhar força" }, { valor: "sem-barriga", rotulo: "Ganhar massa sem aumentar muito a barriga" }, { valor: "nao-sei", rotulo: "Ainda não sei exatamente" },
];
const EXPERIENCIAS: Opcao<Experiencia>[] = [
  { valor: "nunca", rotulo: "Ainda não treino" }, { valor: "lt6m", rotulo: "Menos de 6 meses" }, { valor: "6a12", rotulo: "6 a 12 meses" },
  { valor: "1a2", rotulo: "1 a 2 anos" }, { valor: "2a4", rotulo: "2 a 4 anos" }, { valor: "gt4", rotulo: "Mais de 4 anos" },
];
const CONTINUIDADES: Opcao<Continuidade>[] = [
  { valor: "continuo", rotulo: "Sim, quase sem interrupções" }, { valor: "pausas", rotulo: "Tenho algumas pausas" }, { valor: "para-e-volta", rotulo: "Paro e volto bastante" }, { valor: "voltando", rotulo: "Estou voltando agora" },
];
const TREINOS: Opcao<number>[] = [0, 1, 2, 3, 4, 5, 6].map((n) => ({ valor: n, rotulo: n === 6 ? "6+" : String(n) }));
const ACOMPANHA: Opcao<Acompanha>[] = [
  { valor: "anota", rotulo: "Sim, anoto cargas e repetições" }, { valor: "nocao", rotulo: "Tenho uma noção" }, { valor: "nao", rotulo: "Não acompanho" }, { valor: "nem-sei", rotulo: "Nem sei como fazer isso" },
];
const TENDENCIAS: Opcao<Tendencia>[] = [
  { valor: "perdendo", rotulo: "Estou perdendo peso" }, { valor: "igual", rotulo: "Está praticamente igual" }, { valor: "subindo-devagar", rotulo: "Está subindo devagar" }, { valor: "subindo-rapido", rotulo: "Está subindo rápido" }, { valor: "nao-sei", rotulo: "Não sei" },
];
const APETITES: Opcao<Apetite>[] = [
  { valor: "muita-dificuldade", rotulo: "Tenho muita dificuldade para comer bastante" }, { valor: "cheio-rapido", rotulo: "Fico cheio rápido" }, { valor: "normal", rotulo: "Meu apetite é normal" }, { valor: "bastante", rotulo: "Tenho bastante apetite" },
];
const DIFICULDADES: Opcao<Dificuldade>[] = [
  { valor: "comer", rotulo: "Não consigo comer o suficiente" }, { valor: "peso-nao-sobe", rotulo: "Meu peso simplesmente não sobe" }, { valor: "quanto-comer", rotulo: "Não sei quanto preciso comer" },
  { valor: "treino-bom", rotulo: "Não sei se meu treino está bom" }, { valor: "cargas", rotulo: "Não consigo evoluir as cargas" }, { valor: "constancia", rotulo: "Não tenho constância" },
  { valor: "medo-barriga", rotulo: "Tenho medo de ganhar barriga" }, { valor: "organizar", rotulo: "Não sei organizar minha alimentação" }, { valor: "nao-sei", rotulo: "Não sei" }, { valor: "outro", rotulo: "Outro" },
];
const ROTINAS: Opcao<Rotina>[] = [
  { valor: "sentado", rotulo: "Passo boa parte do dia sentado" }, { valor: "em-pe", rotulo: "Ando bastante ou trabalho em pé" }, { valor: "ativo", rotulo: "Sou bastante ativo" }, { valor: "fisico", rotulo: "Trabalho fisicamente ou sou extremamente ativo" },
];
const PASSOS: Opcao<FaixaPassos>[] = [
  { valor: "lt3", rotulo: "Menos de 3.000" }, { valor: "3a5", rotulo: "3 a 5 mil" }, { valor: "5a75", rotulo: "5 a 7,5 mil" }, { valor: "75a10", rotulo: "7,5 a 10 mil" }, { valor: "gt10", rotulo: "Mais de 10 mil" }, { valor: "nao-sei", rotulo: "Não sei" },
];
const CARDIOS: Opcao<Cardio>[] = [{ valor: "nao", rotulo: "Não" }, { valor: "1a2", rotulo: "1 a 2x por semana" }, { valor: "3a4", rotulo: "3 a 4x" }, { valor: "5+", rotulo: "5x ou mais" }, { valor: "nao-sei", rotulo: "Não sei" }];
const SUPLEMENTOS: Opcao<Suplemento>[] = [{ valor: "creatina", rotulo: "Creatina" }, { valor: "whey", rotulo: "Whey protein" }, { valor: "hipercalorico", rotulo: "Hipercalórico" }, { valor: "outro", rotulo: "Outro" }];
const HORMONIOS: Opcao<Hormonio>[] = [
  { valor: "nao", rotulo: "Não" }, { valor: "reposicao", rotulo: "Reposição hormonal prescrita" }, { valor: "desempenho", rotulo: "Uso para desempenho ou estética" }, { valor: "outro", rotulo: "Outro" }, { valor: "nao-informar", rotulo: "Prefiro não informar" },
];
const HISTORICOS: Opcao<HistoricoPeso>[] = [
  { valor: "sempre", rotulo: "Sempre fui magro" }, { valor: "mudei", rotulo: "Emagreci porque mudei alimentação ou rotina" }, { valor: "sem-querer", rotulo: "Perdi peso sem querer" }, { valor: "nao-sei", rotulo: "Não sei" },
];

const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const btnPrim = "inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 transition-colors";
const btnSec = "inline-flex items-center justify-center border border-white/25 text-white px-5 py-3.5 text-sm min-h-[52px] hover:border-white/60 transition-colors";
const fmtN = (n: number) => Math.round(n).toLocaleString("pt-BR");
const rotuloSemana = (s: number) => (s === 0 ? "Hoje" : s === 26 ? "6 meses" : s === 52 ? "12 meses" : `${Math.round(s)} sem`);
type Proj = ReturnType<typeof projetaMassa>;

export default function SimuladorMassa({ placement }: { placement: string }) {
  const [r, setR] = useState<R>(VAZIO);
  const [passo, setPasso] = useState(0);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [bloq, setBloq] = useState<BloqueioMassa | null>(null);
  const [cen, setCen] = useState<CenarioMassa | null>(null);
  const [metodo, setMetodo] = useState(false);
  const [enviarDados, setEnviarDados] = useState(false);
  const [compartMeta, setCompartMeta] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const iniciou = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const salvo = sessionStorage.getItem(CHAVE);
        if (salvo) { const d = JSON.parse(salvo) as { r: R; passo: number; cen: CenarioMassa | null }; if (d?.r) { setR({ ...VAZIO, ...d.r }); setPasso(d.passo); setCen(d.cen); iniciou.current = true; } }
      } catch { /* sem storage */ }
    }, 0);
    trackOncePerSession("simulator_view", { placement });
    return () => clearTimeout(t);
  }, [placement]);
  useEffect(() => { if (passo === 0) return; try { sessionStorage.setItem(CHAVE, JSON.stringify({ r, passo, cen })); } catch { /* ignora */ } }, [r, passo, cen]);

  const set = <K extends keyof R>(k: K, v: R[K]) => { setR((a) => ({ ...a, [k]: v })); setErros((e) => { const n = { ...e }; delete n[k as string]; return n; }); };
  function irPara(n: number) { setPasso(n); requestAnimationFrame(() => { raiz.current?.scrollIntoView({ behavior: "smooth", block: "start" }); tituloRef.current?.focus({ preventScroll: true }); }); }
  function comecar() { if (!iniciou.current) { iniciou.current = true; trackEvent("simulator_start", { placement }); } irPara(1); }

  const idade = parseNumero(r.idade), altura = parseAltura(r.altura), peso = parseNumero(r.peso);
  const meta = r.semMeta ? null : parseNumero(r.meta);
  const gordura = r.sabeGordura ? parseNumero(r.gordura) : null;
  const kcal = r.sabeKcal ? parseNumero(r.kcal) : null;
  const proteina = r.sabeProteina ? parseNumero(r.proteina) : null;

  const perfil: PerfilMassa | null = useMemo(() => {
    if (idade === null || altura === null || peso === null || !r.sexo || !r.experiencia || r.treinos === null || !r.tendencia || !r.apetite || !r.rotina) return null;
    return {
      objetivo: r.objetivo ?? "massa", idade, sexo: r.sexo, alturaCm: altura, pesoKg: peso, metaKg: meta, gorduraPct: gordura !== null && gordura >= 3 && gordura <= 60 ? gordura : null,
      experiencia: r.experiencia, continuidade: r.continuidade ?? "continuo", treinos: r.treinos, acompanha: r.acompanha ?? "nocao",
      tendencia: r.tendencia, kcalDia: kcal, apetite: r.apetite, dificuldade: r.dificuldade ?? "nao-sei", proteinaG: proteina,
      rotina: r.rotina, passos: r.passos ?? "nao-sei", cardio: r.cardio ?? "nao", suplementos: r.suplementos, hormonio: r.hormonio ?? "nao", historicoPeso: r.historicoPeso ?? "nao-sei",
    };
  }, [idade, altura, peso, meta, gordura, kcal, proteina, r]);

  function avancar() {
    const e: Record<string, string> = {};
    if (passo === 1 && !r.objetivo) e.objetivo = "Escolha uma opção para seguir.";
    if (passo === 2) {
      for (const x of validaBasicos(idade, altura, peso)) e[x.campo] = x.mensagem;
      if (!r.sexo) e.sexo = "Escolha uma opção. Ela entra só na equação de gasto.";
      if (r.sabeGordura && (gordura === null || gordura < 3 || gordura > 60)) e.gordura = "Informe um percentual entre 3 e 60, ou marque “Não”.";
      if (Object.keys(e).length === 0) { const b = bloqueioMassa(idade!); if (b) { setBloq(b); return; } }
    }
    if (passo === 3 && !r.semMeta) { const v = validaMetaMassa(meta, peso!); if (v && "campo" in v) e.meta = v.mensagem; else if (v) { setBloq(v); return; } }
    if (passo === 4) { if (!r.experiencia) e.experiencia = "Escolha a opção mais próxima."; if (r.experiencia && r.experiencia !== "nunca" && !r.continuidade) e.continuidade = "Responda para seguir."; }
    if (passo === 5) { if (r.treinos === null) e.treinos = "Escolha quantos dias (0 também vale)."; if (r.treinos && r.treinos > 0 && !r.acompanha) e.acompanha = "Escolha uma opção."; }
    if (passo === 6) {
      if (!r.tendencia) e.tendencia = "Escolha a opção mais próxima.";
      if (r.sabeKcal && (kcal === null || kcal < KCAL_MIN || kcal > KCAL_MAX)) e.kcal = `Informe um número aproximado entre ${fmtN(KCAL_MIN)} e ${fmtN(KCAL_MAX)}, ou marque “Não”.`;
      if (!r.apetite) e.apetite = "Escolha uma opção.";
      if (!r.dificuldade) e.dificuldade = "Escolha a que mais pesa hoje.";
      if (r.sabeProteina && (proteina === null || proteina < 10 || proteina > 500)) e.proteina = "Informe gramas por dia (ex.: 90), ou marque “Não”.";
    }
    if (passo === 7) { if (!r.rotina) e.rotina = "Escolha a opção mais parecida com seu dia."; }
    if (passo === 8) { if (!r.historicoPeso) e.historicoPeso = "Responda para seguir — é a única pergunta de segurança."; }
    if (Object.keys(e).length) { setErros(e); return; }
    trackEvent("simulator_step_complete", { placement, step: passo });
    if (passo === TOTAL) { if (perfil) { setCen({ ...cenarioAtualMassa(perfil), superavit: ritmos(perfil)[1].superavit }); trackEvent("simulator_complete", { placement }); irPara(9); } return; }
    irPara(passo + 1);
  }
  function recomecar() { try { sessionStorage.removeItem(CHAVE); } catch { /* ignora */ } setR(VAZIO); setCen(null); setBloq(null); setErros({}); setEnviarDados(false); setCompartMeta(false); irPara(1); }

  const atual = perfil ? cenarioAtualMassa(perfil) : null;
  const projAtual = useMemo(() => (perfil && atual ? projetaMassa(perfil, atual) : null), [perfil, atual?.superavit, atual?.treinos, atual?.progressao]); // eslint-disable-line react-hooks/exhaustive-deps
  const projCen = useMemo(() => (perfil && cen ? projetaMassa(perfil, cen) : null), [perfil, cen]);
  /* O gargalo descreve a situação de HOJE, não o ritmo que a pessoa está testando: senão ele troca a cada toque. */
  const diag = useMemo(() => (perfil && projAtual ? diagnostico(perfil, projAtual) : null), [perfil, projAtual]);
  function mexe(controle: string, novo: Partial<CenarioMassa>) { setCen((c) => (c ? { ...c, ...novo } : c)); trackEvent("scenario_changed", { placement, control: controle }); }
  const clique = () => trackEvent("simulator_internal_tool_click", { placement });
  const usaHormonio = r.hormonio === "reposicao" || r.hormonio === "desempenho" || r.hormonio === "outro";

  if (bloq) return <div ref={raiz} className="scroll-mt-24"><Guardrail b={bloq} onVoltar={() => { setBloq(null); irPara(bloq.tipo === "meta-alta" ? 3 : 2); }} onRecomecar={recomecar} tituloRef={tituloRef} /></div>;

  if (passo === 0) {
    return (
      <div ref={raiz} className="border border-white/15 p-6 sm:p-8 scroll-mt-24" data-testid="simulador-capa">
        <p className="text-white text-lg leading-relaxed mb-2">Responda algumas perguntas e veja como seu peso pode evoluir nos próximos meses — e descubra o que pode estar dificultando seu ganho de massa.</p>
        <p className="text-gray-400 text-sm mb-6">Leva cerca de 1 minuto. Nada sai do seu navegador.</p>
        <button type="button" onClick={comecar} className={btnPrim}>Simular meu ganho →</button>
      </div>
    );
  }

  if (passo >= 1 && passo <= TOTAL) {
    const dif = peso !== null && meta !== null && meta > peso ? meta - peso : null;
    return (
      <div ref={raiz} className="border border-white/15 p-5 sm:p-8 scroll-mt-24" data-testid={`simulador-passo-${passo}`}>
        <ProgressBar passo={passo} total={TOTAL} />
        <form onSubmit={(e) => { e.preventDefault(); avancar(); }} noValidate>
          {passo === 1 && (
            <QuestionStep titulo="Qual é seu principal objetivo?" tituloRef={tituloRef}>
              <OptionCards nome="Objetivo" opcoes={OBJETIVOS} valor={r.objetivo} onChange={(v) => set("objetivo", v)} />
              <Erro m={erros.objetivo} />
            </QuestionStep>
          )}
          {passo === 2 && (
            <QuestionStep titulo="Seu ponto de partida" tituloRef={tituloRef} ajuda="Idade, altura, peso e sexo biológico entram na equação que estima quanto seu corpo gasta. Ficam só no seu navegador.">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <NumericInput rotulo="Idade" sufixo="anos" valor={r.idade} onChange={(v) => set("idade", v)} erro={erros.idade} placeholder="22" />
                <NumericInput rotulo="Altura" sufixo="cm" valor={r.altura} onChange={(v) => set("altura", v)} erro={erros.altura} placeholder="175" />
                <div className="col-span-2"><NumericInput rotulo="Peso atual" sufixo="kg" valor={r.peso} onChange={(v) => set("peso", v)} erro={erros.peso} placeholder="60" onEnter={avancar} /></div>
              </div>
              <p className="text-white text-sm font-semibold mb-1.5">Sexo biológico</p>
              <OptionCards nome="Sexo biológico" colunas={2} opcoes={[{ valor: "m", rotulo: "Masculino" }, { valor: "f", rotulo: "Feminino" }]} valor={r.sexo} onChange={(v) => set("sexo", v)} />
              <Erro m={erros.sexo} />
              <p className="text-white text-sm font-semibold mt-5 mb-1.5">Você sabe aproximadamente seu percentual de gordura? <span className="text-gray-500 font-normal">(opcional)</span></p>
              <OptionCards nome="Sabe o percentual de gordura" colunas={2} opcoes={[{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }]} valor={r.sabeGordura === null ? null : r.sabeGordura ? "sim" : "nao"} onChange={(v) => set("sabeGordura", v === "sim")} />
              {r.sabeGordura && <div className="mt-3"><NumericInput rotulo="Percentual de gordura" sufixo="%" valor={r.gordura} onChange={(v) => set("gordura", v)} erro={erros.gordura} placeholder="12" /></div>}
            </QuestionStep>
          )}
          {passo === 3 && (
            <QuestionStep titulo="Quanto você gostaria de pesar?" tituloRef={tituloRef} ajuda="Você pode alterar isso depois.">
              {!r.semMeta && <NumericInput rotulo="Meta" sufixo="kg" valor={r.meta} onChange={(v) => set("meta", v)} erro={erros.meta} placeholder={peso ? String(Math.round(peso + 8)) : "70"} onEnter={avancar} />}
              {dif !== null && !r.semMeta && (
                <div className="mt-4 border-l-2 pl-4" style={{ borderColor: DOURADO }} data-testid="reacao-meta">
                  <p className="text-white font-semibold">Seu objetivo é ganhar {fmtKg(dif)}.</p>
                  <p className="text-gray-400 text-sm">Agora vamos entender qual ritmo poderia fazer sentido para você.</p>
                </div>
              )}
              <label className="flex items-center gap-3 mt-4 min-h-[44px] text-gray-200 cursor-pointer">
                <input type="checkbox" checked={r.semMeta} onChange={(e) => set("semMeta", e.target.checked)} className="w-5 h-5 accent-[#BA9E50]" />Não sei
              </label>
              {r.semMeta && <p className="text-gray-400 text-sm mt-2">Sem problema. A simulação mostra a trajetória dos próximos meses nos três ritmos.</p>}
            </QuestionStep>
          )}
          {passo === 4 && (
            <QuestionStep titulo="Há quanto tempo você treina musculação de forma consistente?" tituloRef={tituloRef} ajuda="Iniciantes e avançados não recebem a mesma expectativa — e é assim que deve ser.">
              <OptionCards nome="Experiência" colunas={2} opcoes={EXPERIENCIAS} valor={r.experiencia} onChange={(v) => set("experiencia", v)} />
              <Erro m={erros.experiencia} />
              {r.experiencia && r.experiencia !== "nunca" && (
                <>
                  <p className="text-white text-sm font-semibold mt-6 mb-1.5">Seu treino tem sido realmente contínuo?</p>
                  <OptionCards nome="Continuidade" opcoes={CONTINUIDADES} valor={r.continuidade} onChange={(v) => set("continuidade", v)} />
                  <Erro m={erros.continuidade} />
                </>
              )}
            </QuestionStep>
          )}
          {passo === 5 && (
            <QuestionStep titulo="Quantos dias por semana você consegue treinar?" tituloRef={tituloRef} ajuda="Consegue, não gostaria. Um plano de 3 dias que acontece vale mais que um de 6 que não acontece.">
              <OptionCards nome="Treinos por semana" colunas={4} opcoes={TREINOS} valor={r.treinos} onChange={(v) => set("treinos", v)} />
              <Erro m={erros.treinos} />
              {r.treinos !== null && r.treinos > 0 && (
                <>
                  <p className="text-white text-sm font-semibold mt-6 mb-1.5">Você acompanha se está ficando mais forte?</p>
                  <OptionCards nome="Acompanha o progresso" opcoes={ACOMPANHA} valor={r.acompanha} onChange={(v) => set("acompanha", v)} />
                  <Erro m={erros.acompanha} />
                </>
              )}
            </QuestionStep>
          )}
          {passo === 6 && (
            <QuestionStep titulo="Seu peso está mudando atualmente?" tituloRef={tituloRef} ajuda="Essa é a pergunta mais útil do simulador: o que a balança faz há semanas diz mais que qualquer conta de calorias.">
              <OptionCards nome="Tendência do peso" opcoes={TENDENCIAS} valor={r.tendencia} onChange={(v) => set("tendencia", v)} />
              <Erro m={erros.tendencia} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Você sabe aproximadamente quantas calorias come por dia?</p>
              <OptionCards nome="Sabe as calorias" colunas={2} opcoes={[{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }]} valor={r.sabeKcal === null ? null : r.sabeKcal ? "sim" : "nao"} onChange={(v) => set("sabeKcal", v === "sim")} />
              {r.sabeKcal && <div className="mt-3"><NumericInput rotulo="Calorias por dia" sufixo="kcal" valor={r.kcal} onChange={(v) => set("kcal", v)} erro={erros.kcal} placeholder="2500" ajuda="Aproximado basta. Quem anota costuma subestimar." /></div>}
              {r.sabeKcal === false && <p className="text-gray-400 text-sm mt-2">Tudo bem — o simulador estima pelo seu corpo e pela tendência do peso. Se quiser uma referência: <Link href="/ferramentas/calculadora-tmb-tdee" onClick={clique} className={ln}>Calculadora de Gasto Calórico</Link>. Sua simulação fica salva nesta aba.</p>}
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Como é seu apetite?</p>
              <OptionCards nome="Apetite" opcoes={APETITES} valor={r.apetite} onChange={(v) => set("apetite", v)} />
              <Erro m={erros.apetite} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">O que mais atrapalha você a ganhar massa hoje?</p>
              <OptionCards nome="Principal dificuldade" colunas={2} opcoes={DIFICULDADES} valor={r.dificuldade} onChange={(v) => set("dificuldade", v)} />
              <Erro m={erros.dificuldade} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Você sabe aproximadamente quanta proteína come? <span className="text-gray-500 font-normal">(opcional)</span></p>
              <OptionCards nome="Sabe a proteína" colunas={2} opcoes={[{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }]} valor={r.sabeProteina === null ? null : r.sabeProteina ? "sim" : "nao"} onChange={(v) => set("sabeProteina", v === "sim")} />
              {r.sabeProteina && <div className="mt-3"><NumericInput rotulo="Proteína por dia" sufixo="g" valor={r.proteina} onChange={(v) => set("proteina", v)} erro={erros.proteina} placeholder="90" /></div>}
              {r.sabeProteina === false && <p className="text-gray-400 text-sm mt-2">Sem problema. Se quiser descobrir: <Link href="/ferramentas/calculadora-de-proteina" onClick={clique} className={ln}>Calculadora de Proteína</Link>.</p>}
            </QuestionStep>
          )}
          {passo === 7 && (
            <QuestionStep titulo="Como é sua rotina?" tituloRef={tituloRef} ajuda="Quem é muito ativo gasta mais — e precisa de mais comida para o peso subir.">
              <OptionCards nome="Rotina" opcoes={ROTINAS} valor={r.rotina} onChange={(v) => set("rotina", v)} />
              <Erro m={erros.rotina} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Quantos passos, aproximadamente? <span className="text-gray-500 font-normal">(opcional)</span></p>
              <OptionCards nome="Passos por dia" colunas={3} opcoes={PASSOS} valor={r.passos} onChange={(v) => set("passos", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Além da musculação, você pratica esporte ou cardio?</p>
              <OptionCards nome="Cardio e esportes" colunas={3} opcoes={CARDIOS} valor={r.cardio} onChange={(v) => set("cardio", v)} />
            </QuestionStep>
          )}
          {passo === 8 && (
            <QuestionStep titulo="Últimas perguntas" tituloRef={tituloRef} ajuda="Suplementos e hormônios não mudam a curva — mudam a leitura. Nada disso sai do seu navegador.">
              <p className="text-white text-sm font-semibold mb-1.5">Você usa algum destes atualmente? <span className="text-gray-500 font-normal">(opcional — marque todos)</span></p>
              <MultiOptionCards nome="Suplementos" colunas={2} opcoes={SUPLEMENTOS} valores={r.suplementos} onChange={(v) => set("suplementos", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Você utiliza testosterona ou outro hormônio/anabolizante? <span className="text-gray-500 font-normal">(opcional)</span></p>
              <OptionCards nome="Hormônios" opcoes={HORMONIOS} valor={r.hormonio} onChange={(v) => set("hormonio", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Seu peso sempre foi parecido, ou você emagreceu sem querer recentemente?</p>
              <OptionCards nome="Histórico do peso" opcoes={HISTORICOS} valor={r.historicoPeso} onChange={(v) => set("historicoPeso", v)} />
              <Erro m={erros.historicoPeso} />
            </QuestionStep>
          )}
          <div className="flex flex-wrap gap-3 mt-8">
            {passo > 1 && <button type="button" onClick={() => irPara(passo - 1)} className={btnSec}>← Voltar</button>}
            <button type="submit" className={btnPrim}>{passo === TOTAL ? "Ver minha projeção →" : "Continuar →"}</button>
          </div>
        </form>
      </div>
    );
  }

  if (!perfil || !cen || !projCen || !projAtual || !diag || !atual) {
    return <div ref={raiz} className="border border-white/15 p-6"><p className="text-white mb-4">Faltou alguma resposta para montar a projeção.</p><button type="button" onClick={recomecar} className={btnPrim}>Refazer a simulação</button></div>;
  }

  const temMeta = perfil.metaKg !== null;
  const horizonte = temMeta && projCen.semanaMeta !== null ? Math.min(SEMANAS_MAX, Math.max(12, Math.ceil(projCen.semanaMeta * 1.15))) : temMeta ? SEMANAS_MAX : 26;
  const corta = (pr: Proj) => pr.pontos.slice(0, horizonte + 1).map((p) => ({ x: p.semana, y: p.peso, min: p.min, max: p.max }));
  const igual = cen.superavit === atual.superavit && cen.treinos === atual.treinos && cen.consistencia === atual.consistencia && cen.progressao === atual.progressao;
  const marcos: Marco[] = [0, 4, 8, 12, 26, 52].filter((s) => s <= horizonte).map((s) => ({ x: s, rotulo: rotuloSemana(s) }));
  if (temMeta && projCen.semanaMeta !== null && projCen.semanaMeta <= horizonte && !marcos.some((m) => Math.abs(m.x - projCen.semanaMeta!) < 2)) { marcos.push({ x: Math.round(projCen.semanaMeta), rotulo: "Meta" }); marcos.sort((a, b) => a.x - b.x); }
  const dif = temMeta ? perfil.metaKg! - perfil.pesoKg : null;
  const os3 = ritmos(perfil);
  const ritmoAtivo = os3.find((x) => x.superavit === cen.superavit)?.id ?? null;
  const prot = perfil.proteinaG !== null ? avaliaProteina(perfil.proteinaG, perfil.pesoKg) : null;
  const avs = avisos(perfil);
  const ev = evidenciaMassa(diag.gargalo);
  const msgPadrao = diag.cta.mensagem;
  const msgComDados = `${msgPadrao}\n\nMeus números (escolhi compartilhar): peso atual ${fmtKg(perfil.pesoKg)}${temMeta ? `, meta ${fmtKg(perfil.metaKg!)}` : ""}, ${cen.treinos} treinos por semana, cenário ${ritmoAtivo ?? "personalizado"}.`;
  const urlPagina = "https://www.montinhopersonal.com.br/ferramentas/simulador-ganho-massa-muscular";
  const textoShare = compartMeta && temMeta ? `Projeto hipertrofia: de ${fmtKg(perfil.pesoKg)} para ${fmtKg(perfil.metaKg!)}, com consistência. Simule o seu:` : "Projeto hipertrofia: minha missão agora é crescer com consistência. Simule o seu ganho de massa:";
  async function compartilhar() {
    trackEvent("simulator_share_click", { placement });
    try { if (navigator.share) { await navigator.share({ title: "Simulador de Ganho de Massa", text: textoShare, url: urlPagina }); return; } await navigator.clipboard.writeText(`${textoShare} ${urlPagina}`); setCopiado(true); setTimeout(() => setCopiado(false), 2500); } catch { /* cancelado */ }
  }
  const pesoEm = (p: Proj, s: number) => (s === -1 ? perfil.metaKg! : p.pontos[s].peso);
  const marcosJ = [0, 4, 8, 12, 26, 52].filter((s) => s <= horizonte); if (temMeta && projCen.semanaMeta !== null && projCen.semanaMeta <= horizonte) marcosJ.push(-1);
  const semProgresso = projCen.ritmo12.kg < 0.03;

  return (
    <div ref={raiz} className="scroll-mt-24 space-y-8" data-testid="simulador-resultado">
      {/* 1 — resposta principal */}
      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-5 sm:p-8 relative" aria-live="polite">
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: DOURADO }} aria-hidden="true" />
        <h2 ref={tituloRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-white mb-5 outline-none" style={h}>{temMeta ? `Seu plano para sair dos ${fmtKg(perfil.pesoKg)}` : "Sua projeção de ganho"}</h2>
        <dl className="grid grid-cols-3 gap-3 mb-6">
          <div><dt className="text-gray-400 text-xs uppercase tracking-wide">Peso atual</dt><dd className="text-white text-xl sm:text-2xl font-bold tabular-nums">{fmtKg(perfil.pesoKg)}</dd></div>
          <div><dt className="text-gray-400 text-xs uppercase tracking-wide">Meta</dt><dd className="text-white text-xl sm:text-2xl font-bold tabular-nums">{temMeta ? fmtKg(perfil.metaKg!) : "—"}</dd></div>
          <div><dt className="text-gray-400 text-xs uppercase tracking-wide">Diferença</dt><dd className="text-white text-xl sm:text-2xl font-bold tabular-nums">{dif !== null ? `+${fmtKg(dif)}` : "—"}</dd></div>
        </dl>
        {semProgresso ? (
          <p className="text-lg text-white leading-relaxed" data-testid="resposta">{projCen.ritmo12.kg < -0.03 ? <>Neste cenário, seu peso tende a <strong>cair</strong>: a ingestão fica abaixo do que seu corpo gasta.</> : <>Neste cenário, seu peso tende a ficar <strong>praticamente parado</strong>: a ingestão está perto do que seu corpo gasta.</>} Escolha um ritmo abaixo para ver a curva subir.</p>
        ) : temMeta && projCen.semanaMeta !== null ? (
          <p className="text-lg text-white leading-relaxed" data-testid="resposta">Num ritmo controlado, você chegaria perto de {fmtKg(perfil.metaKg!)} em <strong style={{ color: DOURADO }}>{fmtFaixaSemanas(projCen.faixaMeta!)}</strong> — por volta de {fmtSemanas(projCen.semanaMeta)}.</p>
        ) : temMeta ? (
          <p className="text-lg text-white leading-relaxed" data-testid="resposta">Neste ritmo, a meta não chega em 12 meses: a projeção termina perto de <strong style={{ color: DOURADO }}>{fmtKgProj(projCen.pontos[SEMANAS_MAX].peso)}</strong>. Um ritmo mais rápido aproxima a meta — mas com mais gordura no pacote.</p>
        ) : (
          <p className="text-lg text-white leading-relaxed" data-testid="resposta">Neste ritmo, em 12 semanas seu peso ficaria perto de <strong style={{ color: DOURADO }}>{fmtKgProj(projCen.pontos[12].peso)}</strong>, e em 6 meses perto de {fmtKgProj(projCen.pontos[26].peso)}.</p>
        )}
        <p className="text-gray-300 text-sm mt-3"><span className="text-gray-400">Ritmo neste cenário:</span> <strong className="text-white">{ESTADO_RITMO[projCen.estadoRitmo]}</strong> — cerca de {(projCen.ritmo12.pct * 100).toLocaleString("pt-BR", { maximumFractionDigits: 2 })}% do peso por semana nas primeiras 12.</p>
        <p className="text-gray-400 text-sm mt-2">Isso é uma estimativa de <strong className="text-gray-300">peso</strong>, não de músculo. Se a balança subir 1 kg, isso não significa +1 kg de músculo: sobe também água, glicogênio, conteúdo intestinal e alguma gordura.</p>
        {avs.includes("perda-involuntaria") && <p className="text-white text-sm mt-3 border-l-2 pl-3" style={{ borderColor: DOURADO }}>Você contou que perdeu peso sem querer. Quando isso acontece, vale conversar com um profissional de saúde antes de simplesmente aumentar calorias. A simulação segue por curiosidade.</p>}
        {avs.includes("imc-baixo") && <p className="text-white text-sm mt-3 border-l-2 pl-3" style={{ borderColor: DOURADO }}>Seu peso está bem abaixo da faixa de referência para a sua altura. Ganhar peso aqui é saúde antes de estética — e merece acompanhamento.</p>}
      </div>

      {/* 2 — três ritmos + gráfico */}
      <div className="border border-white/15 p-4 sm:p-6" data-testid="ritmos">
        <h3 className="text-xl font-bold text-white mb-1" style={h}>Três ritmos que valem comparar</h3>
        <p className="text-gray-400 text-sm mb-4">Superávit sobre sua manutenção estimada ({fmtN(projCen.manutencao)} kcal/dia). Mais rápido não é melhor: o músculo tem teto por semana, e o que passa vira gordura.</p>
        <div role="radiogroup" aria-label="Ritmo de ganho" className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-5">
          {os3.map((x) => {
            const sel = ritmoAtivo === x.id;
            const pr = projetaMassa(perfil, { ...cen, superavit: x.superavit });
            return (
              <button key={x.id} type="button" role="radio" aria-checked={sel} onClick={() => mexe("pace", { superavit: x.superavit })}
                className={`text-left border p-3 min-h-[52px] transition-colors ${sel ? "border-[#BA9E50] bg-[#BA9E50]/10" : "border-white/20 hover:border-white/50"}`}>
                <span className="block text-white font-semibold">{x.nome} <span className="text-gray-400 font-normal text-sm">+{x.superavit} kcal</span></span>
                <span className="block text-gray-400 text-xs mt-0.5">{x.descricao}</span>
                <span className="block text-gray-300 text-xs mt-1.5 tabular-nums">6 meses: +{fmtKg(pr.ganho26)}{temMeta ? ` · meta ${pr.semanaMeta !== null ? "em ~" + fmtSemanas(pr.semanaMeta) : "além de 12 meses"}` : ""}</span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400 mb-3">
          <span className="inline-flex items-center gap-2"><span className="w-5 h-[3px]" style={{ background: DOURADO }} aria-hidden="true" />{igual ? "Sua trajetória estimada" : "Cenário ajustado"}</span>
          {!igual && <span className="inline-flex items-center gap-2"><span className="w-5 border-t-2 border-dashed border-gray-400" aria-hidden="true" />Como você está hoje</span>}
          <span className="inline-flex items-center gap-2"><span className="w-5 h-3 opacity-40" style={{ background: DOURADO }} aria-hidden="true" />Faixa provável</span>
        </div>
        <ProjectionChart serie={corta(projCen)} comparacao={igual ? null : corta(projAtual)} meta={perfil.metaKg} marcos={marcos} formataY={fmtKgProj} formataX={(x) => (x === 0 ? "Hoje" : `Semana ${Math.round(x)}`)} rotuloSerie={igual ? "peso estimado" : "ajustado"} rotuloComparacao="hoje" descricao={`Projeção de peso ao longo de ${horizonte} semanas, partindo de ${fmtKg(perfil.pesoKg)}.`} />
      </div>

      {/* 3 — e se */}
      <div className="border border-white/15 p-5 sm:p-6" data-testid="cenarios">
        <h3 className="text-xl font-bold text-white mb-1" style={h}>E se você mudar algumas coisas?</h3>
        <p className="text-gray-400 text-sm mb-5">Treino e progressão mudam pouco a balança — mudam o que o peso ganho vira. Consistência muda os dois.</p>
        <div className="space-y-5">
          <ScenarioSelector rotulo="Treinos por semana" opcoes={[0, 1, 2, 3, 4, 5, 6].map((n) => ({ valor: n, rotulo: n === 6 ? "6+" : `${n}x` }))} valor={cen.treinos} atual={atual.treinos} onChange={(v) => mexe("training", { treinos: v })} />
          <ScenarioSelector rotulo="Consistência (dias em que o plano acontece)" opcoes={[0.6, 0.75, 0.9, 1].map((n) => ({ valor: n, rotulo: `${Math.round(n * 100)}%` }))} valor={cen.consistencia} onChange={(v) => mexe("consistency", { consistencia: v })} />
          <ScenarioSelector rotulo="Você está evoluindo cargas ou repetições?" opcoes={[{ valor: "nao" as Progressao, rotulo: "Não" }, { valor: "pouco" as Progressao, rotulo: "Pouco" }, { valor: "sim" as Progressao, rotulo: "Sim" }]} valor={cen.progressao} atual={atual.progressao} onChange={(v) => mexe("progression", { progressao: v })} />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-6 text-sm">
          <div className="border border-white/15 p-3"><p className="text-xs uppercase tracking-wide mb-1 text-gray-400">Treinos em 12 semanas</p><p className="text-white font-semibold tabular-nums text-lg">{projCen.treinosRealizados12} <span className="text-gray-400 font-normal text-sm">de {projCen.treinosPlanejados12} planejados</span></p></div>
          <div className="border border-white/15 p-3"><p className="text-xs uppercase tracking-wide mb-1 text-gray-400">Do ganho em 6 meses</p><p className="text-white font-semibold text-lg">{projCen.fracaoMagra26 >= 0.6 ? "mais massa magra" : projCen.fracaoMagra26 >= 0.45 ? "meio a meio" : "mais gordura"}</p><p className="text-gray-500 text-xs">tendência do modelo, não medida</p></div>
        </div>
        {cen.progressao === "nao" && <p className="text-gray-300 text-sm mt-4 border-l-2 pl-3" style={{ borderColor: DOURADO }}>O seu peso pode subir, mas hipertrofia depende também de um estímulo que cresce. Não basta comer.</p>}
        <button type="button" onClick={() => { setCen({ ...atual, superavit: os3[1].superavit }); trackEvent("scenario_changed", { placement, control: "reset" }); }} className="text-gray-400 text-sm underline underline-offset-4 mt-4 min-h-[44px]">Voltar ao ritmo intermediário</button>
      </div>

      {/* 3b — a rota */}
      <div className="border border-white/15 p-5 sm:p-6" data-testid="jornada">
        <h3 className="text-xl font-bold text-white mb-1" style={h}>Sua rota neste cenário</h3>
        <p className="text-gray-400 text-sm mb-4">{cen.treinos}x treino · +{cen.superavit} kcal · {Math.round(cen.consistencia * 100)}% de consistência. Pesos aproximados, de 0,5 em 0,5 kg.</p>
        <ol className="grid grid-cols-3 sm:grid-cols-6 gap-2" aria-label="Marcos da rota">
          {marcosJ.map((s, i) => (
            <li key={s} className={`min-w-0 border p-2.5 sm:p-3 text-center ${s === -1 ? "border-[#BA9E50]" : i === 0 ? "border-white/40" : "border-white/15"}`}>
              <p className={`text-[11px] uppercase tracking-wide mb-1 ${s === -1 ? "text-[#BA9E50]" : "text-gray-400"}`}>{s === -1 ? "Meta" : rotuloSemana(s)}</p>
              <p className="text-white font-bold tabular-nums text-[15px] sm:text-base">{fmtKgProj(pesoEm(projCen, s))}</p>
              {s === -1 && projCen.semanaMeta !== null && <p className="text-gray-400 text-[11px] mt-1">~{fmtSemanas(projCen.semanaMeta)}</p>}
            </li>
          ))}
        </ol>
      </div>

      {/* 3c — o que esperar */}
      <div className="border border-white/15 p-5 sm:p-6" data-testid="o-que-esperar">
        <h3 className="text-xl font-bold text-white mb-1" style={h}>O que esperar pelo caminho</h3>
        <p className="text-gray-400 text-sm mb-4">Pela prática e pelos relatos — não uma garantia.</p>
        <ol className="space-y-2">
          {MARCOS_MASSA.map((m) => {
            const alvo = perfil.pesoKg * (1 + m.fracao);
            const i = projCen.pontos.findIndex((p) => p.peso >= alvo);
            if (i < 1 || i > horizonte) return null;
            const sem = projCen.pontos[i - 1].semana + (alvo - projCen.pontos[i - 1].peso) / (projCen.pontos[i].peso - projCen.pontos[i - 1].peso);
            return (
              <li key={m.fracao}>
                <Dobra titulo={`+${fmtKg(perfil.pesoKg * m.fracao)} (${(m.fracao * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%) · por volta de ${fmtSemanas(sem)} — ${m.titulo}`}>
                  <ul className="text-gray-200 text-sm space-y-1.5 list-disc pl-5">{m.costuma.map((c) => <li key={c}>{c}</li>)}</ul>
                  {m.aindaNao && <p className="text-gray-400 text-sm mt-2"><span className="text-gray-500 uppercase text-xs tracking-wide">Ainda não:</span> {m.aindaNao}</p>}
                </Dobra>
              </li>
            );
          })}
        </ol>
      </div>

      {/* 4 — o gargalo */}
      <InsightCard titulo="O que mais está limitando seu ganho">
        <p className="font-semibold" style={h}>{diag.titulo}</p>
        <p className="text-gray-300 mt-2">{diag.texto}</p>
        <p className="text-gray-400 text-xs mt-2">Pelas respostas que você forneceu — regras fixas, não diagnóstico.</p>
      </InsightCard>
      <div className="border border-white/15 p-5 sm:p-6" data-testid="primeiro">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: DOURADO }}>O que eu olharia primeiro no seu caso</p>
        <p className="text-white leading-relaxed">{diag.primeiro}</p>
      </div>
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

      {/* 5 — leituras contextuais */}
      <div className="space-y-4 text-gray-300 leading-relaxed">
        {perfil.tendencia === "igual" && (perfil.apetite === "bastante" || perfil.dificuldade === "peso-nao-sobe") && (
          <div className="border border-white/15 p-4" data-testid="como-muito">
            <p className="text-white font-semibold mb-1">“Como muito e não engordo”: seu corpo já respondeu essa pergunta</p>
            <p className="text-sm">Se o peso permanece estável por várias semanas, sua ingestão média e seu gasto estão próximos do equilíbrio. Isso não significa que você come pouco em todas as refeições — significa que, na média dos sete dias, a energia consumida não está produzindo ganho sustentado. Não é culpa; é medida. Leia <Link href="/blog/endomorfo-ectomorfo-mesomorfo" onClick={clique} className={ln}>por que “ectomorfo” não explica isso</Link>.</p>
          </div>
        )}
        {prot && (
          <p><strong className="text-white">Proteína:</strong> {prot.gkg.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} g/kg por dia — {prot.estado === "abaixo" ? "abaixo da faixa de 1,6 a 2,2 g/kg que a literatura associa ao ganho de massa magra. É a mudança de comida com melhor retorno." : prot.estado === "na-faixa" ? "dentro da faixa de 1,6 a 2,2 g/kg. Mais que isso não constrói mais músculo." : "acima de 2,2 g/kg. Não há ganho extra acima disso; as calorias que faltam podem vir de carboidrato e gordura."} <Link href="/ferramentas/calculadora-de-proteina" onClick={clique} className={ln}>Calculadora de Proteína</Link>.</p>
        )}
        {perfil.suplementos.includes("creatina") && <p><strong className="text-white">Creatina:</strong> nas primeiras semanas o peso pode subir 1 a 2 kg por água dentro do músculo. Não é gordura nem músculo novo — e não some. Conte a partir daí. <Link href="/ferramentas/calculadora-creatina" onClick={clique} className={ln}>Calculadora de Creatina</Link>.</p>}
        {perfil.suplementos.includes("whey") && <p><strong className="text-white">Whey:</strong> não é obrigatório nem “produto para engordar” — é uma forma prática de completar a proteína quando a comida não chega. <Link href="/ferramentas/calculadora-whey" onClick={clique} className={ln}>Calculadora de Whey</Link>.</p>}
        {(perfil.suplementos.includes("hipercalorico") || perfil.apetite === "muita-dificuldade" || perfil.dificuldade === "comer") && <p><strong className="text-white">Hipercalórico e calorias líquidas:</strong> não constroem músculo por si só — são uma forma prática de aumentar a ingestão quando o apetite não acompanha. Shake caseiro (leite integral, aveia, banana, pasta de amendoim) faz o mesmo papel por menos.</p>}
        {usaHormonio && (
          <div className="border border-white/15 p-4">
            <p className="text-white font-semibold mb-1">Seu contexto pode alterar sua resposta ao treinamento</p>
            <p className="text-sm">Substâncias hormonais podem influenciar massa e composição corporal, mas a resposta depende de inúmeros fatores. Por isso este simulador não tenta prever quantos quilos de músculo um hormônio fará você ganhar. Continue acompanhando peso, cintura, medidas, desempenho e composição corporal quando possível — e mantenha o acompanhamento médico separado do treino.</p>
          </div>
        )}
        <p><strong className="text-white">O objetivo não é fazer a balança subir o máximo possível.</strong> É dar ao corpo condições para construir músculo enquanto você acompanha quanto peso está ganhando — e a cintura junto. Peso subindo rápido com cintura subindo rápido é sinal de reavaliar o ritmo, não de comemorar.</p>
        <p><strong className="text-white">Quanto músculo ainda cabe?</strong> Essa pergunta tem outra ferramenta: a <Link href="/ferramentas/potencial-natural" onClick={clique} className={ln}>Calculadora de Potencial Natural</Link>, que usa as mesmas taxas por nível deste simulador. E para conferir se o treino tem volume suficiente: <Link href="/ferramentas/calculadora-volume-treino" onClick={clique} className={ln}>Calculadora de Volume</Link>.</p>
      </div>

      {/* 6 — palavra do Montinho + CTA por gargalo */}
      <DoisCaminhos variante="resultado" placement="simulador-massa-resultado" />

      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 relative" data-testid="cta-simulador">
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: DOURADO }} aria-hidden="true" />
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: DOURADO }}>{FECHAMENTO_COMPARACAO.titulo}</p>
        <div className="space-y-3 mb-6" data-testid="fechamento">{FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white leading-relaxed">{t}</p>)}<p className="text-gray-400 text-sm">— Montinho</p></div>
        <p className="text-white font-bold text-xl mb-2" style={h}>Cansado de ouvir “é só comer mais”?</p>
        <p className="text-gray-300 leading-relaxed mb-5 max-w-xl">Ganhar massa não é comer qualquer coisa e esperar a balança subir. Treino, progressão, alimentação e acompanhamento precisam funcionar juntos — e eu posso estruturar seu treino, acompanhar suas cargas e ajustar a estratégia conforme seu corpo responde.</p>
        <a href={getWhatsAppUrl(enviarDados ? msgComDados : msgPadrao)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("simulator_whatsapp_click", { placement })} className={btnPrim}>{diag.cta.texto} →</a>
        <label className="flex items-start gap-3 mt-4 text-gray-300 text-sm cursor-pointer min-h-[44px]"><input type="checkbox" checked={enviarDados} onChange={(e) => setEnviarDados(e.target.checked)} className="w-5 h-5 mt-0.5 accent-[#BA9E50]" /><span>Enviar meu resultado junto (peso, meta, treinos e ritmo). Sem isso, a mensagem vai sem nenhum número seu.</span></label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={compartilhar} className={btnSec}>Compartilhar minha simulação</button>
        <label className="flex items-center gap-2 text-gray-400 text-sm cursor-pointer min-h-[44px]"><input type="checkbox" checked={compartMeta} onChange={(e) => setCompartMeta(e.target.checked)} className="w-4 h-4 accent-[#BA9E50]" />Incluir peso e meta no texto</label>
        {copiado && <span className="text-sm text-white" role="status">Link copiado.</span>}
      </div>

      <MethodologyDrawer titulo="Como calculamos esta estimativa?" aberto={metodo} onToggle={() => { if (!metodo) trackEvent("simulator_methodology_opened", { placement }); setMetodo(!metodo); }}>
        <p>A cada dia simulado, o que você come menos o que gasta vira variação de peso; o gasto é recalculado com o peso novo. <strong className="text-white">Gasto:</strong> Mifflin-St Jeor × fator de rotina + musculação (3,5 MET) + cardio informado. <strong className="text-white">Manutenção de partida:</strong> {fmtN(projCen.manutencao)} kcal/dia{manutencao(perfil).calibrada ? ", calibrada pelo que você informou e pela tendência do peso" : ", pela equação e pela tendência do peso"}. <strong className="text-white">Nível efetivo:</strong> {nivelDe(perfil.experiencia, perfil.continuidade)}, pelo tempo de treino descontadas as pausas.</p>
        <p><strong className="text-white">O que o ganho vira:</strong> a fração de massa magra parte de Forbes (quem tem menos gordura ganha mais magro) e é ajustada por treino e progressão — mas tem um teto por dia, dado pela taxa do seu nível (as mesmas taxas da Calculadora de Potencial Natural). O que passa do teto vira gordura. Por isso dobrar o superávit não dobra o músculo.</p>
        <p><strong className="text-white">Ritmos:</strong> 7,5%, 12,5% e 20% de superávit sobre a manutenção (5%, 8% e 12% para avançados), a partir da faixa de 10–20% de Iraki (2019). <strong className="text-white">Faixa provável:</strong> gasto ±5%. <strong className="text-white">Não modela:</strong> hormônios, suplementos, água e glicogênio das primeiras semanas, apetite reagindo ao superávit. Projeções param em 12 meses.</p>
        <p><a href="#metodologia" onClick={() => { const d = document.getElementById("metodologia"); if (d instanceof HTMLDetailsElement) d.open = true; }} className={ln}>Ver metodologia completa e referências</a></p>
      </MethodologyDrawer>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <button type="button" onClick={() => irPara(2)} className="underline underline-offset-4 min-h-[44px]">Editar minhas respostas</button>
        <button type="button" onClick={recomecar} className="underline underline-offset-4 min-h-[44px]">Apagar meus dados e recomeçar</button>
      </div>
    </div>
  );
}

function Erro({ m }: { m?: string }) { return m ? <p role="alert" className="text-red-300 text-sm mt-2">{m}</p> : null; }

function Guardrail({ b, onVoltar, onRecomecar, tituloRef }: { b: BloqueioMassa; onVoltar: () => void; onRecomecar: () => void; tituloRef: React.Ref<HTMLHeadingElement> }) {
  return (
    <div className="border border-white/15 p-6 sm:p-8" data-testid={`guardrail-${b.tipo}`}>
      <h2 ref={tituloRef} tabIndex={-1} className="text-2xl font-bold text-white mb-3 outline-none" style={h}>{b.tipo === "menor" ? "Este simulador é feito para adultos" : "Essa meta é grande demais para uma projeção"}</h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        {b.tipo === "menor"
          ? "Antes dos 18 anos o corpo ainda está crescendo, e ganho de peso precisa considerar esse crescimento. O melhor caminho é conversar com um pediatra ou nutricionista — e treinar força com orientação já ajuda."
          : `Uma meta acima de ${b.maximoKg} kg (35% a mais que o peso atual) não cabe numa projeção de 12 meses sem virar fantasia. Escolha uma meta até esse valor, ou siga sem meta e olhe a trajetória.`}
      </p>
      <div className="flex flex-wrap gap-3">
        {b.tipo === "meta-alta" && <button type="button" onClick={onVoltar} className={btnPrim}>Ajustar minha meta</button>}
        <button type="button" onClick={onRecomecar} className={btnSec}>Recomeçar</button>
      </div>
    </div>
  );
}
