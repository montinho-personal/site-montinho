"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { trackEvent, trackOncePerSession } from "@/lib/analytics";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { FECHAMENTO_COMPARACAO } from "@/lib/filosofia";
import { DOURADO, Dobra, InsightCard, MethodologyDrawer, NumericInput, OptionCards, ProgressBar, QuestionStep, ScenarioSelector, h, type Opcao } from "./ui";
import { Comparacao, RestartFastComparison, ScaleVsFatExplanation, WeekendBuilder, WeeklyBalanceBar, WeeklyBalanceTimeline } from "./SemanaVisual";
import {
  KCAL_MAX, KCAL_MIN, ROTULO_ESTADO, ROTULO_FONTE, SEM_AJUSTE,
  balanca, comparaRefeicaoFds, contribuicoes, ehCompensacaoArriscada, fmtDeltaKg, fmtFaixaKcal, fmtKcal, fraseDaSemana, insight, item, manutencao, mudancas, parseAltura, parseNumero, projecao, recomecar, semana, validaBasicos,
  type Ajustes, type ComoCome, type Compensa, type DiaFds, type EntradaFds, type Evento, type Medicacao, type Modo, type Movimento, type ObjetivoFds, type Padrao, type Rotina, type Sexo, type SextaNoite,
} from "@/lib/simulador/fim-de-semana";

/**
 * O Simulador do Fim de Semana — um raio-x da semana.
 *
 * Duas portas: "sei minhas calorias" e "não sei". A segunda é a principal:
 * a pessoa descreve o sábado e o domingo como os vive ("faço uma refeição
 * mais livre") e, se quiser, detalha no construtor (pizza, cerveja…), com
 * faixas de caloria e não números únicos.
 *
 * PRIVACIDADE: tudo roda no navegador. Os eventos levam só etapa, controle
 * e o GRUPO do item adicionado. A mensagem do WhatsApp é fixa, sem número
 * nenhum; o compartilhamento leva só a frase-resultado.
 */

const CHAVE = "montinho:simulador-fim-de-semana";
type Etapa = "objetivo" | "modo" | "voce" | "uteis" | "sexta" | "sabado" | "domingo" | "bebidas" | "movimento";

interface R {
  objetivo: ObjetivoFds | null; modo: Modo | null;
  idade: string; sexo: Sexo | null; altura: string; peso: string;
  sabeManutencao: boolean | null; manutencao: string; rotina: Rotina | null;
  kcalUtil: string; comoCome: ComoCome | null;
  sexta: SextaNoite | null; kcalSexta: string;
  sabado: Padrao | null; kcalSabado: string; detalharSabado: boolean;
  domingo: Padrao | null; kcalDomingo: string; detalharDomingo: boolean;
  bebe: "nao" | "as-vezes" | "sim" | null;
  eventos: Evento[];
  movimento: Movimento | null; sabePassos: boolean; passosUtil: string; passosSabado: string; passosDomingo: string;
  treina: EntradaFds["treinaFds"] | null; compensa: Compensa | null; medicacao: Medicacao | null;
}
const VAZIO: R = {
  objetivo: null, modo: null, idade: "", sexo: null, altura: "", peso: "", sabeManutencao: null, manutencao: "", rotina: null,
  kcalUtil: "", comoCome: null, sexta: null, kcalSexta: "", sabado: null, kcalSabado: "", detalharSabado: false, domingo: null, kcalDomingo: "", detalharDomingo: false,
  bebe: null, eventos: [], movimento: null, sabePassos: false, passosUtil: "", passosSabado: "", passosDomingo: "", treina: null, compensa: null, medicacao: null,
};

const OBJETIVOS: Opcao<ObjetivoFds>[] = [
  { valor: "emagrecer", rotulo: "Emagrecer" }, { valor: "manter", rotulo: "Manter o peso" }, { valor: "composicao", rotulo: "Melhorar composição corporal" },
  { valor: "entender", rotulo: "Só quero entender meu fim de semana" }, { valor: "massa", rotulo: "Ganhar massa" },
];
const ROTINAS: Opcao<Rotina>[] = [
  { valor: "sentado", rotulo: "Passo boa parte do dia sentado" }, { valor: "em-pe", rotulo: "Ando bastante ou trabalho em pé" }, { valor: "ativo", rotulo: "Sou bastante ativo" }, { valor: "fisico", rotulo: "Trabalho fisicamente ou sou extremamente ativo" },
];
const COMO_COME: Opcao<ComoCome>[] = [
  { valor: "plano", rotulo: "Sigo um plano para emagrecer", detalhe: "Como menos do que gasto na maioria dos dias." },
  { valor: "cuidado", rotulo: "Como com cuidado, sem plano fechado" },
  { valor: "normal", rotulo: "Como normalmente, sem restringir" },
];
const PADROES: Opcao<Padrao>[] = [
  { valor: "igual", rotulo: "Quase igual aos outros dias" }, { valor: "pouco", rotulo: "Como um pouco mais" }, { valor: "refeicao", rotulo: "Faço uma refeição mais livre" },
  { valor: "varias", rotulo: "Faço várias refeições diferentes" }, { valor: "muito", rotulo: "Costumo exagerar bastante" }, { valor: "varia", rotulo: "Varia muito" },
];
const SEXTAS: Opcao<SextaNoite>[] = [{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }, { valor: "as-vezes", rotulo: "Às vezes" }];
const MOVIMENTOS: Opcao<Movimento>[] = [
  { valor: "muito-menos", rotulo: "Muito menos" }, { valor: "pouco-menos", rotulo: "Um pouco menos" }, { valor: "parecido", rotulo: "Parecido" },
  { valor: "pouco-mais", rotulo: "Um pouco mais" }, { valor: "muito-mais", rotulo: "Muito mais" }, { valor: "nao-sei", rotulo: "Não sei" },
];
const TREINOS: Opcao<EntradaFds["treinaFds"]>[] = [{ valor: "nao", rotulo: "Não" }, { valor: "sabado", rotulo: "Sábado" }, { valor: "domingo", rotulo: "Domingo" }, { valor: "ambos", rotulo: "Ambos" }, { valor: "varia", rotulo: "Varia" }];
const COMPENSAS: Opcao<Compensa>[] = [
  { valor: "nao", rotulo: "Não, sigo a rotina normal" }, { valor: "segunda-menos", rotulo: "Como um pouco menos na segunda" },
  { valor: "jejum", rotulo: "Fico muitas horas sem comer para compensar" }, { valor: "cardio-longo", rotulo: "Faço muito cardio para compensar" },
];
const MEDICACOES: Opcao<Medicacao>[] = [
  { valor: "nao", rotulo: "Não" }, { valor: "tirzepatida", rotulo: "Tirzepatida" }, { valor: "semaglutida", rotulo: "Semaglutida" }, { valor: "liraglutida", rotulo: "Liraglutida" }, { valor: "outra", rotulo: "Outra" }, { valor: "nao-informar", rotulo: "Prefiro não informar" },
];
const SIM_NAO: Opcao<"sim" | "nao">[] = [{ valor: "sim", rotulo: "Sim" }, { valor: "nao", rotulo: "Não" }];

const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const btnPrim = "inline-flex items-center justify-center bg-white text-black px-6 py-3.5 text-sm font-semibold min-h-[52px] hover:bg-gray-100 transition-colors";
const btnSec = "inline-flex items-center justify-center border border-white/25 text-white px-5 py-3.5 text-sm min-h-[52px] hover:border-white/60 transition-colors";
const fmtN = (n: number) => Math.round(n).toLocaleString("pt-BR");
const URL_PAGINA = "https://www.montinhopersonal.com.br/ferramentas/simulador-fim-de-semana";
const MSG_WHATSAPP = "Oi, Montinho! Fiz o Simulador do Fim de Semana no seu site e queria entender melhor como organizar minha rotina para emagrecer.";

export default function SimuladorFimDeSemana({ placement }: { placement: string }) {
  const [r, setR] = useState<R>(VAZIO);
  const [passo, setPasso] = useState(0);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [aj, setAj] = useState<Ajustes>(SEM_AJUSTE);
  const [metodo, setMetodo] = useState(false);
  const [subiu, setSubiu] = useState("");
  const [copiado, setCopiado] = useState(false);
  const [massa, setMassa] = useState(false);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const iniciou = useRef(false);
  const bebidasUsado = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const salvo = sessionStorage.getItem(CHAVE);
        if (salvo) { const d = JSON.parse(salvo) as { r: R; passo: number; aj: Ajustes }; if (d?.r) { setR({ ...VAZIO, ...d.r }); setPasso(d.passo); setAj({ ...SEM_AJUSTE, ...d.aj }); iniciou.current = true; } }
      } catch { /* sem storage */ }
    }, 0);
    trackOncePerSession("weekend_simulator_view", { placement });
    return () => clearTimeout(t);
  }, [placement]);
  useEffect(() => { if (passo === 0) return; try { sessionStorage.setItem(CHAVE, JSON.stringify({ r, passo, aj })); } catch { /* ignora */ } }, [r, passo, aj]);

  const etapas: Etapa[] = r.modo === "sei"
    ? ["objetivo", "modo", "voce", "uteis", "sexta", "sabado", "domingo", "movimento"]
    : ["objetivo", "modo", "voce", "uteis", "sexta", "sabado", "domingo", "bebidas", "movimento"];
  const total = etapas.length;
  const etapa = passo >= 1 && passo <= total ? etapas[passo - 1] : null;

  const set = <K extends keyof R>(k: K, v: R[K]) => { setR((a) => ({ ...a, [k]: v })); setErros((e) => { const n = { ...e }; delete n[k as string]; return n; }); };
  function irPara(n: number) { setPasso(n); requestAnimationFrame(() => { raiz.current?.scrollIntoView({ behavior: "smooth", block: "start" }); tituloRef.current?.focus({ preventScroll: true }); }); }
  function comecar() { if (!iniciou.current) { iniciou.current = true; trackEvent("weekend_simulator_start", { placement }); } irPara(1); }
  const setEventos = (lista: Evento[]) => set("eventos", lista);
  const aoAdicionar = (g: string) => {
    trackEvent("weekend_food_added", { placement, group: g });
    if (g === "bebida" && !bebidasUsado.current) { bebidasUsado.current = true; trackEvent("weekend_alcohol_module_used", { placement }); }
  };

  const idade = parseNumero(r.idade), altura = parseAltura(r.altura), peso = parseNumero(r.peso);
  const manut = r.sabeManutencao ? parseNumero(r.manutencao) : null;
  const num = (t: string) => { const v = parseNumero(t); return v === null ? null : v; };

  const entrada: EntradaFds | null = useMemo(() => {
    if (!r.objetivo || !r.modo || idade === null || altura === null || peso === null || !r.sexo || !r.sexta || !r.movimento) return null;
    const sei = r.modo === "sei";
    const passosOk = r.sabePassos && num(r.passosUtil) !== null && num(r.passosSabado) !== null && num(r.passosDomingo) !== null;
    return {
      objetivo: r.objetivo, modo: r.modo, sexo: r.sexo, idade, alturaCm: altura, pesoKg: peso,
      manutencaoKcal: manut, rotina: r.rotina ?? "sentado",
      kcalUtil: sei ? num(r.kcalUtil) : null, kcalSabado: sei ? num(r.kcalSabado) : null, kcalDomingo: sei ? num(r.kcalDomingo) : null,
      kcalSextaExtra: sei && r.sexta !== "nao" ? num(r.kcalSexta) ?? 0 : 0,
      comoCome: r.comoCome ?? "cuidado", sexta: r.sexta, sabado: r.sabado ?? "igual", domingo: r.domingo ?? "igual",
      // O construtor só vale nos dias em que a pessoa abriu o detalhe; bebidas valem sempre que ela bebe.
      eventos: sei ? [] : r.eventos.filter((e) => {
        const g = item(e.itemId).grupo;
        if (g === "bebida") return r.bebe !== "nao";
        return (e.dia === "sexta" && r.sexta !== "nao") || (e.dia === "sabado" && r.detalharSabado) || (e.dia === "domingo" && r.detalharDomingo);
      }),
      movimento: r.movimento,
      passosUtil: passosOk ? num(r.passosUtil) : null, passosSabado: passosOk ? num(r.passosSabado) : null, passosDomingo: passosOk ? num(r.passosDomingo) : null,
      treinaFds: r.treina ?? "nao", compensa: r.compensa ?? "nao", medicacao: r.medicacao ?? "nao",
    };
  }, [r, idade, altura, peso, manut]);

  function avancar() {
    const e: Record<string, string> = {};
    const kcalOk = (t: string) => { const v = parseNumero(t); return v !== null && v >= KCAL_MIN && v <= KCAL_MAX; };
    const faixaKcal = `Informe um número aproximado entre ${fmtN(KCAL_MIN)} e ${fmtN(KCAL_MAX)}.`;
    if (etapa === "objetivo") { if (!r.objetivo) e.objetivo = "Escolha uma opção para seguir."; else if (r.objetivo === "massa") { setMassa(true); return; } }
    if (etapa === "modo" && !r.modo) e.modo = "Escolha uma das duas portas.";
    if (etapa === "voce") {
      for (const x of validaBasicos(idade, altura, peso)) e[x.campo] = x.mensagem;
      if (!r.sexo) e.sexo = "Escolha uma opção. Ela entra só na equação de gasto.";
      if (r.sabeManutencao === null) e.sabeManutencao = "Responda para seguir.";
      if (r.sabeManutencao && !kcalOk(r.manutencao)) e.manutencao = faixaKcal;
      if (r.sabeManutencao === false && !r.rotina) e.rotina = "Escolha a opção mais parecida com seu dia.";
    }
    if (etapa === "uteis") { if (r.modo === "sei" && !kcalOk(r.kcalUtil)) e.kcalUtil = faixaKcal; if (r.modo === "nao-sei" && !r.comoCome) e.comoCome = "Escolha a opção mais próxima."; }
    if (etapa === "sexta") {
      if (!r.sexta) e.sexta = "Escolha uma opção.";
      if (r.modo === "sei" && r.sexta && r.sexta !== "nao") { const v = parseNumero(r.kcalSexta); if (v === null || v < 0 || v > 5000) e.kcalSexta = "Informe quanto a sexta à noite soma a mais (0 a 5.000 kcal)."; }
    }
    if (etapa === "sabado") { if (r.modo === "sei" && !kcalOk(r.kcalSabado)) e.kcalSabado = faixaKcal; if (r.modo === "nao-sei" && !r.sabado && !r.detalharSabado) e.sabado = "Escolha a opção mais próxima — ou detalhe o seu sábado."; }
    if (etapa === "domingo") { if (r.modo === "sei" && !kcalOk(r.kcalDomingo)) e.kcalDomingo = faixaKcal; if (r.modo === "nao-sei" && !r.domingo && !r.detalharDomingo) e.domingo = "Escolha a opção mais próxima — ou detalhe o seu domingo."; }
    if (etapa === "bebidas" && !r.bebe) e.bebe = "Escolha uma opção.";
    if (etapa === "movimento") {
      if (!r.movimento) e.movimento = "Escolha a opção mais próxima.";
      if (r.sabePassos && [r.passosUtil, r.passosSabado, r.passosDomingo].some((t) => { const v = parseNumero(t); return v === null || v < 0 || v > 60000; })) e.passos = "Informe os três números de passos, ou desmarque a opção.";
    }
    if (Object.keys(e).length) { setErros(e); return; }
    trackEvent("weekend_step_complete", { placement, step: passo });
    if (passo === total) { setAj(SEM_AJUSTE); trackEvent("weekend_simulation_complete", { placement }); irPara(total + 1); return; }
    irPara(passo + 1);
  }
  function recomecarTudo() { try { sessionStorage.removeItem(CHAVE); } catch { /* ignora */ } setR(VAZIO); setAj(SEM_AJUSTE); setErros({}); setSubiu(""); setMassa(false); irPara(1); }

  const s = useMemo(() => (entrada ? semana(entrada) : null), [entrada]);
  const sB = useMemo(() => (entrada ? semana(entrada, aj) : null), [entrada, aj]);
  const muda = useMemo(() => (entrada ? mudancas(entrada) : []), [entrada]);
  function mexe(controle: string, novo: Partial<Ajustes>) { setAj((a) => ({ ...a, ...novo })); trackEvent("weekend_scenario_changed", { placement, control: controle }); }
  const clique = () => trackEvent("weekend_internal_tool_click", { placement });

  /* ── Ganhar massa: a porta é outra ── */
  if (massa) {
    return (
      <div ref={raiz} className="border border-white/15 p-6 sm:p-8 scroll-mt-24" data-testid="redireciona-massa">
        <h2 ref={tituloRef} tabIndex={-1} className="text-2xl font-bold text-white mb-3 outline-none" style={h}>Para ganhar massa, o simulador certo é outro</h2>
        <p className="text-gray-300 leading-relaxed mb-6">Este aqui mede o quanto o fim de semana tira de um déficit. Para quem quer o peso subindo com músculo, a pergunta é o superávit da semana e o ritmo do ganho — e é isso que o Simulador de Ganho de Massa responde.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/ferramentas/simulador-ganho-massa-muscular" onClick={clique} className={btnPrim}>Abrir o Simulador de Ganho de Massa →</Link>
          <button type="button" onClick={() => { setMassa(false); set("objetivo", "entender"); irPara(2); }} className={btnSec}>Quero só entender meu fim de semana</button>
        </div>
      </div>
    );
  }

  if (passo === 0) {
    return (
      <div ref={raiz} className="border border-white/15 p-6 sm:p-8 scroll-mt-24" data-testid="simulador-capa">
        <p className="text-white text-lg leading-relaxed mb-2">Descubra o que sábado e domingo fazem com o déficit que você construiu durante a semana — e teste diferentes cenários.</p>
        <p className="text-gray-400 text-sm mb-6">Leva cerca de 1 minuto. Não precisa saber calorias. Nada sai do seu navegador.</p>
        <button type="button" onClick={comecar} className={btnPrim}>Simular meu fim de semana →</button>
      </div>
    );
  }

  if (etapa) {
    const sei = r.modo === "sei";
    return (
      <div ref={raiz} className="border border-white/15 p-5 sm:p-8 scroll-mt-24" data-testid={`simulador-passo-${etapa}`}>
        <ProgressBar passo={passo} total={total} />
        <form onSubmit={(e) => { e.preventDefault(); avancar(); }} noValidate>
          {etapa === "objetivo" && (
            <QuestionStep titulo="Qual é seu objetivo atual?" tituloRef={tituloRef}>
              <OptionCards nome="Objetivo" opcoes={OBJETIVOS} valor={r.objetivo} onChange={(v) => set("objetivo", v)} />
              <Erro m={erros.objetivo} />
            </QuestionStep>
          )}
          {etapa === "modo" && (
            <QuestionStep titulo="Você acompanha suas calorias?" tituloRef={tituloRef} ajuda="As duas portas chegam ao mesmo raio-x da semana. A segunda é a mais usada.">
              <OptionCards nome="Modo" opcoes={[
                { valor: "nao-sei", rotulo: "Não sei minhas calorias", detalhe: "Você descreve seu sábado e domingo como eles são." },
                { valor: "sei", rotulo: "Eu sei minhas calorias", detalhe: "Para quem anota o que come." },
              ]} valor={r.modo} onChange={(v) => set("modo", v)} />
              <Erro m={erros.modo} />
            </QuestionStep>
          )}
          {etapa === "voce" && (
            <QuestionStep titulo="Sobre você" tituloRef={tituloRef} ajuda="Para estimar quanto seu corpo gasta por dia. Fica só no seu navegador.">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <NumericInput rotulo="Idade" sufixo="anos" valor={r.idade} onChange={(v) => set("idade", v)} erro={erros.idade} placeholder="35" />
                <NumericInput rotulo="Altura" sufixo="cm" valor={r.altura} onChange={(v) => set("altura", v)} erro={erros.altura} placeholder="168" />
                <div className="col-span-2"><NumericInput rotulo="Peso atual" sufixo="kg" valor={r.peso} onChange={(v) => set("peso", v)} erro={erros.peso} placeholder="75" /></div>
              </div>
              <p className="text-white text-sm font-semibold mb-1.5">Sexo biológico</p>
              <OptionCards nome="Sexo biológico" colunas={2} opcoes={[{ valor: "m", rotulo: "Masculino" }, { valor: "f", rotulo: "Feminino" }]} valor={r.sexo} onChange={(v) => set("sexo", v)} />
              <Erro m={erros.sexo} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Você sabe aproximadamente suas calorias de manutenção?</p>
              <OptionCards nome="Sabe a manutenção" colunas={2} opcoes={SIM_NAO} valor={r.sabeManutencao === null ? null : r.sabeManutencao ? "sim" : "nao"} onChange={(v) => set("sabeManutencao", v === "sim")} />
              <Erro m={erros.sabeManutencao} />
              {r.sabeManutencao && <div className="mt-3"><NumericInput rotulo="Manutenção" sufixo="kcal/dia" valor={r.manutencao} onChange={(v) => set("manutencao", v)} erro={erros.manutencao} placeholder="2200" /></div>}
              {r.sabeManutencao === false && (
                <>
                  <p className="text-white text-sm font-semibold mt-5 mb-1.5">Como é seu dia a dia?</p>
                  <OptionCards nome="Rotina" opcoes={ROTINAS} valor={r.rotina} onChange={(v) => set("rotina", v)} />
                  <Erro m={erros.rotina} />
                  <p className="text-gray-500 text-xs mt-2">Estimamos pela mesma conta da <Link href="/ferramentas/calculadora-tmb-tdee" onClick={clique} className={ln}>Calculadora de Gasto Calórico</Link> (Mifflin-St Jeor × rotina), com margem de ±10%.</p>
                </>
              )}
            </QuestionStep>
          )}
          {etapa === "uteis" && (sei ? (
            <QuestionStep titulo="Quantas calorias você costuma consumir de segunda a sexta?" tituloRef={tituloRef} ajuda="A média de um dia útil. A sexta à noite vem na próxima pergunta.">
              <NumericInput rotulo="Média por dia útil" sufixo="kcal" valor={r.kcalUtil} onChange={(v) => set("kcalUtil", v)} erro={erros.kcalUtil} placeholder="1800" onEnter={avancar} />
            </QuestionStep>
          ) : (
            <QuestionStep titulo="Como você come de segunda a sexta?" tituloRef={tituloRef} ajuda="Isso define o déficit que a semana constrói antes de o fim de semana chegar.">
              <OptionCards nome="Dias úteis" opcoes={COMO_COME} valor={r.comoCome} onChange={(v) => set("comoCome", v)} />
              <Erro m={erros.comoCome} />
            </QuestionStep>
          ))}
          {etapa === "sexta" && (
            <QuestionStep titulo="Seu “fim de semana” começa na sexta à noite?" tituloRef={tituloRef} ajuda="Happy hour, pizza de sexta, o jantar que abre o fim de semana.">
              <OptionCards nome="Sexta à noite" colunas={3} opcoes={SEXTAS} valor={r.sexta} onChange={(v) => set("sexta", v)} />
              <Erro m={erros.sexta} />
              {sei && r.sexta && r.sexta !== "nao" && <div className="mt-4"><NumericInput rotulo="Quanto a sexta à noite soma a mais" sufixo="kcal" valor={r.kcalSexta} onChange={(v) => set("kcalSexta", v)} erro={erros.kcalSexta} placeholder="600" ajuda={r.sexta === "as-vezes" ? "Uma média: se é uma sexta a cada duas, metade do extra." : "Além do que você já comeria num dia útil."} /></div>}
              {!sei && r.sexta && r.sexta !== "nao" && (
                <Dobra titulo="Detalhar a sexta à noite (opcional)">
                  <WeekendBuilder dia="sexta" eventos={r.eventos} onChange={setEventos} grupos={["refeicao", "extra", "bebida"]} onAdd={aoAdicionar} />
                </Dobra>
              )}
            </QuestionStep>
          )}
          {(etapa === "sabado" || etapa === "domingo") && (() => {
            const dia: DiaFds = etapa;
            const nome = dia === "sabado" ? "sábado" : "domingo";
            const padrao = dia === "sabado" ? r.sabado : r.domingo;
            const detalhar = dia === "sabado" ? r.detalharSabado : r.detalharDomingo;
            const kDetalhe = dia === "sabado" ? "detalharSabado" : "detalharDomingo";
            return sei ? (
              <QuestionStep titulo={`E no ${nome}?`} tituloRef={tituloRef} ajuda={`O total do ${nome}, incluindo bebidas.`}>
                <NumericInput rotulo={`Calorias no ${nome}`} sufixo="kcal" valor={dia === "sabado" ? r.kcalSabado : r.kcalDomingo} onChange={(v) => set(dia === "sabado" ? "kcalSabado" : "kcalDomingo", v)} erro={dia === "sabado" ? erros.kcalSabado : erros.kcalDomingo} placeholder="2800" onEnter={avancar} />
              </QuestionStep>
            ) : (
              <QuestionStep titulo={`Como costuma ser seu ${nome} em comparação com os outros dias?`} tituloRef={tituloRef} ajuda={dia === "domingo" ? "Separado do sábado de propósito: muita gente exagera no sábado e come normalmente no domingo — ou não." : "Pense num sábado típico, não no melhor nem no pior."}>
                {!detalhar && <OptionCards nome={nome} colunas={2} opcoes={PADROES} valor={padrao} onChange={(v) => set(dia, v)} />}
                <Erro m={erros[dia]} />
                <label className="flex items-start gap-3 mt-5 text-gray-200 cursor-pointer min-h-[44px]">
                  <input type="checkbox" checked={detalhar} onChange={(ev) => set(kDetalhe, ev.target.checked)} className="w-5 h-5 mt-0.5 accent-[#BA9E50]" />
                  <span>Prefiro montar o meu {nome} item por item <span className="text-gray-500">(pizza, churrasco, sobremesa…)</span></span>
                </label>
                {detalhar && <div className="mt-4"><WeekendBuilder dia={dia} eventos={r.eventos} onChange={setEventos} grupos={["refeicao", "extra", "bebida"]} onAdd={aoAdicionar} /></div>}
                {detalhar && <p className="text-gray-500 text-xs mt-3">Cerveja, vinho, destilado e drinks estão em “Bebidas”. O que você adicionar aqui aparece de novo na etapa de bebidas.</p>}
              </QuestionStep>
            );
          })()}
          {etapa === "bebidas" && (
            <QuestionStep titulo="Costuma beber no fim de semana?" tituloRef={tituloRef} ajuda="Opcional, mas importante: bebida é energia que entra sem ocupar espaço no prato.">
              <OptionCards nome="Bebe no fim de semana" colunas={3} opcoes={[{ valor: "nao", rotulo: "Não" }, { valor: "as-vezes", rotulo: "Às vezes" }, { valor: "sim", rotulo: "Sim" }]} valor={r.bebe} onChange={(v) => set("bebe", v)} />
              <Erro m={erros.bebe} />
              {(r.bebe === "sim" || r.bebe === "as-vezes") && (
                <div className="mt-5 space-y-3">
                  <p className="text-gray-400 text-sm">Adicione o que costuma beber em cada dia{r.bebe === "as-vezes" ? " num fim de semana em que você bebe" : ""}. Calorias por volume e teor alcoólico, mais o açúcar ou misturador — por isso em faixa.</p>
                  {(["sexta", "sabado", "domingo"] as DiaFds[]).filter((d) => d !== "sexta" || r.sexta !== "nao").map((d) => (
                    <Dobra key={d} titulo={d === "sexta" ? "Sexta à noite" : d === "sabado" ? "Sábado" : "Domingo"}>
                      <WeekendBuilder dia={d} eventos={r.eventos} onChange={setEventos} grupos={["bebida"]} onAdd={aoAdicionar} />
                    </Dobra>
                  ))}
                </div>
              )}
            </QuestionStep>
          )}
          {etapa === "movimento" && (
            <QuestionStep titulo="Você costuma se movimentar mais ou menos no fim de semana?" tituloRef={tituloRef} ajuda="O balanço tem dois lados: dá para comer mais e andar muito mais — ou comer mais e passar o domingo parado.">
              <OptionCards nome="Movimento no fim de semana" colunas={2} opcoes={MOVIMENTOS} valor={r.movimento} onChange={(v) => set("movimento", v)} />
              <Erro m={erros.movimento} />
              <label className="flex items-center gap-3 mt-4 text-gray-200 cursor-pointer min-h-[44px]">
                <input type="checkbox" checked={r.sabePassos} onChange={(ev) => set("sabePassos", ev.target.checked)} className="w-5 h-5 accent-[#BA9E50]" />Tenho meus passos no celular ou relógio
              </label>
              {r.sabePassos && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <NumericInput rotulo="Dia útil" valor={r.passosUtil} onChange={(v) => set("passosUtil", v)} placeholder="7000" />
                  <NumericInput rotulo="Sábado" valor={r.passosSabado} onChange={(v) => set("passosSabado", v)} placeholder="4000" />
                  <NumericInput rotulo="Domingo" valor={r.passosDomingo} onChange={(v) => set("passosDomingo", v)} placeholder="3000" />
                </div>
              )}
              <Erro m={erros.passos} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Você costuma treinar no fim de semana? <span className="text-gray-500 font-normal">(opcional)</span></p>
              <OptionCards nome="Treino no fim de semana" colunas={3} opcoes={TREINOS} valor={r.treina} onChange={(v) => set("treina", v)} />
              <p className="text-white text-sm font-semibold mt-6 mb-1.5">Depois de um fim de semana diferente, você costuma compensar? <span className="text-gray-500 font-normal">(opcional)</span></p>
              <OptionCards nome="Compensação" opcoes={COMPENSAS} valor={r.compensa} onChange={(v) => set("compensa", v)} />
              <div className="mt-6"><Dobra titulo="Personalizar ainda mais meu resultado (opcional)">
                <p className="text-white text-sm font-semibold mb-1.5">Você usa alguma medicação para emagrecimento?</p>
                <OptionCards nome="Medicação" colunas={2} opcoes={MEDICACOES} valor={r.medicacao} onChange={(v) => set("medicacao", v)} />
                <p className="text-gray-500 text-xs mt-2">Não muda a conta — muda só o texto que você lê. Fica no seu navegador.</p>
              </Dobra></div>
            </QuestionStep>
          )}
          <div className="flex flex-wrap gap-3 mt-8">
            {passo > 1 && <button type="button" onClick={() => irPara(passo - 1)} className={btnSec}>← Voltar</button>}
            <button type="submit" className={btnPrim}>{passo === total ? "Ver o raio-x da minha semana →" : "Continuar →"}</button>
          </div>
        </form>
      </div>
    );
  }

  if (!entrada || !s || !sB) {
    return <div ref={raiz} className="border border-white/15 p-6"><p className="text-white mb-4">Faltou alguma resposta para montar a semana.</p><button type="button" onClick={recomecarTudo} className={btnPrim}>Refazer a simulação</button></div>;
  }

  const est = ROTULO_ESTADO[s.estado];
  const ins = insight(entrada, s);
  const contrib = contribuicoes(s);
  const totalContrib = contrib.reduce((a, x) => a + x.kcal, 0);
  const melhor = muda[0] ?? null;
  const cmp = comparaRefeicaoFds(entrada);
  const rr = recomecar(entrada);
  const projA = projecao(entrada, s);
  const projB = projecao(entrada, sB);
  const igual = JSON.stringify(aj) === JSON.stringify(SEM_AJUSTE);
  const subiuKg = parseNumero(subiu);
  const bal = subiuKg !== null && subiuKg > 0 && subiuKg <= 10 ? balanca(s, subiuKg) : null;
  const temBebida = s.extras.sexta.bebida.mid + s.extras.sabado.bebida.mid + s.extras.domingo.bebida.mid > 0;
  const seguranca = ehCompensacaoArriscada(entrada, s);
  const usaCaneta = entrada.medicacao !== "nao" && entrada.medicacao !== "nao-informar";
  const fraseShare = s.estado === "deficit" ? "Continuei em déficit." : s.estado === "equilibrio" ? "Fiquei próximo da manutenção." : "Meu saldo semanal virou positivo.";
  const cta = s.estado === "deficit"
    ? { titulo: "Boa notícia: seu fim de semana não está anulando sua semana.", texto: "O próximo passo é acompanhar a tendência por algumas semanas e ajustar somente se necessário. Se quiser alguém olhando isso com você — e um treino montado para a sua rotina —, eu posso ajudar.", botao: "Quero ajuda para organizar meu treino" }
    : { titulo: "Encontramos um ponto importante.", texto: "Sua semana está criando resultado, mas parte relevante dele está sendo perdida no fim de semana. Você provavelmente não precisa jogar tudo fora e começar outra dieta. Talvez precise de uma estratégia que também funcione sábado e domingo — e eu posso estruturar seu treino e seu acompanhamento para você ter resultado sem depender de semanas perfeitas.", botao: "Quero montar uma estratégia com o Montinho" };
  async function compartilhar() {
    trackEvent("weekend_share_clicked", { placement });
    const texto = `Meu fim de semana realmente estraga a dieta? ${fraseShare} Teste o seu no simulador do Montinho Personal Trainer:`;
    try { if (navigator.share) { await navigator.share({ title: "Simulador do Fim de Semana", text: texto, url: URL_PAGINA }); return; } await navigator.clipboard.writeText(`${texto} ${URL_PAGINA}`); setCopiado(true); setTimeout(() => setCopiado(false), 2500); } catch { /* cancelado */ }
  }

  return (
    <div ref={raiz} className="scroll-mt-24 space-y-8" data-testid="simulador-resultado">
      {/* 1 — a frase e o "uau" */}
      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-5 sm:p-8 relative" aria-live="polite">
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: DOURADO }} aria-hidden="true" />
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: DOURADO }}>Sua semana em uma frase</p>
        <h2 ref={tituloRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-4 outline-none" style={h} data-testid="frase">{fraseDaSemana(s)}</h2>
        <p className="inline-flex items-center gap-2 border border-white/25 px-3 py-1.5 text-sm text-white mb-6" data-testid="estado"><span aria-hidden="true">{est.simbolo}</span>{est.rotulo}: <span className="tabular-nums">{fmtFaixaKcal(s.saldo)}</span></p>
        <p className="text-gray-500 text-xs -mt-4 mb-6">Faixa provável da semana; o número central aparece nas barras.</p>
        <WeeklyBalanceBar s={s} />
        {s.preservado !== null && (
          <p className="text-gray-300 leading-relaxed mt-5" data-testid="preservado">
            {s.preservado >= 0.995 ? "Você preservou todo o déficit que construiu durante a semana." : s.preservado <= 0.005 ? "O fim de semana consumiu o déficit construído nos dias úteis." : <>Você preservou aproximadamente <strong className="text-white">{Math.round(s.preservado * 100)}%</strong> do déficit que construiu durante a semana — o fim de semana consumiu os outros {100 - Math.round(s.preservado * 100)}%.</>}
            {" "}<span className="text-gray-500 text-sm">Isso é sobre energia, não sobre “progresso destruído”: o que foi feito de segunda a sexta continua valendo.</span>
          </p>
        )}
      </div>

      {seguranca && (
        <div className="border-2 p-5" style={{ borderColor: DOURADO }} role="note" data-testid="seguranca">
          <p className="text-white font-semibold mb-1" style={h}>{ins.titulo}</p>
          <p className="text-gray-200 leading-relaxed">{ins.texto}</p>
        </div>
      )}

      <div className="border border-white/15 p-5 sm:p-6"><WeeklyBalanceTimeline s={s} /></div>

      {/* 2 — onde isso aconteceu */}
      {contrib.length > 0 && (
        <div className="border border-white/15 p-5 sm:p-6" data-testid="onde">
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-3" style={{ color: DOURADO }}>Onde isso aconteceu?</p>
          <ul className="space-y-3">
            {contrib.map((c) => (
              <li key={c.fonte}>
                <div className="flex justify-between gap-3 text-sm"><span className="text-gray-300">{ROTULO_FONTE[c.fonte]}</span><span className="text-white tabular-nums">{fmtKcal(c.kcal)} · {Math.round((c.kcal / totalContrib) * 100)}%</span></div>
                <div className="h-2 bg-white/5 mt-1"><div className="h-full" style={{ width: `${(c.kcal / contrib[0].kcal) * 100}%`, background: "repeating-linear-gradient(135deg,#9ca3af 0 4px,#6b7280 4px 8px)" }} /></div>
              </li>
            ))}
          </ul>
          <p className="text-gray-500 text-xs mt-3">Quanto cada parte somou em relação a um dia útil. Valores centrais de faixas estimadas.</p>
        </div>
      )}
      {!seguranca && <InsightCard titulo="O que mais está pesando no seu fim de semana"><p className="font-semibold" style={h}>{ins.titulo}</p><p className="text-gray-300 mt-1">{ins.texto}</p><p className="text-gray-500 text-xs mt-2">Pelas suas respostas — regras fixas, não diagnóstico.</p></InsightCard>}
      {!seguranca && s.estado === "deficit" && (
        <div className="border border-white/15 p-4 text-sm leading-relaxed" data-testid="nao-e-o-fds">
          <p className="text-white font-semibold mb-1">Seu fim de semana provavelmente não é o principal problema neste cenário.</p>
          <p className="text-gray-300">Se mesmo assim o peso não está caindo, as hipóteses são outras: gasto menor que o estimado, porções maiores que as anotadas, água mascarando a balança ou pouco tempo de observação. Veja <Link href="/blog/por-que-voce-nao-consegue-emagrecer" onClick={clique} className={ln}>por que você não consegue emagrecer</Link> — e acompanhe a média semanal do peso por algumas semanas antes de mudar qualquer coisa.</p>
        </div>
      )}

      {/* 3 — e se? */}
      <div className="border border-white/15 p-5 sm:p-6 space-y-5" data-testid="e-se">
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: DOURADO }}>E se você mudasse só uma coisa?</p>
          {melhor ? (
            <p className="text-white leading-relaxed" data-testid="menor-mudanca"><strong>Menor mudança, maior impacto no seu cenário:</strong> {melhor.rotulo.charAt(0).toLowerCase() + melhor.rotulo.slice(1)} — cerca de {fmtKcal(melhor.ganho).replace("+", "")} a menos no saldo da semana.</p>
          ) : <p className="text-gray-300">Seu fim de semana já está perto da semana; não há uma mudança que mexa muito no saldo.</p>}
          <p className="text-gray-500 text-xs mt-1">Uma simulação de cenário, não uma prescrição. Nenhuma opção aqui envolve cortar comida além da rotina ou compensar com treino.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {temBebida && <ScenarioSelector rotulo="Bebidas" opcoes={[{ valor: 1, rotulo: "Como hoje" }, { valor: 0.5, rotulo: "Metade" }, { valor: 0, rotulo: "Nenhuma" }]} valor={aj.bebidas} onChange={(v) => mexe("bebidas", { bebidas: v })} atual={1} />}
          <ScenarioSelector rotulo="Passos a mais no sábado e no domingo" opcoes={[{ valor: 0, rotulo: "+0" }, { valor: 2000, rotulo: "+2 mil" }, { valor: 4000, rotulo: "+4 mil" }]} valor={aj.passosExtra} onChange={(v) => mexe("passos", { passosExtra: v })} atual={0} />
        </div>
        <div className="space-y-1">
          {[
            { k: "proximaRefeicao" as const, rotulo: "Voltar à rotina na próxima refeição (uma refeição livre em vez de um dia livre)" },
            { k: "domingoComoSemana" as const, rotulo: "Manter o domingo parecido com a semana" },
            ...(s.extras.sexta.comida.mid + s.extras.sexta.bebida.mid > 0 ? [{ k: "sextaSemExtra" as const, rotulo: "Não estender a sexta à noite" }] : []),
          ].map((t) => (
            <label key={t.k} className="flex items-start gap-3 text-gray-200 cursor-pointer min-h-[44px] py-1">
              <input type="checkbox" checked={aj[t.k]} onChange={(ev) => mexe(t.k, { [t.k]: ev.target.checked })} className="w-5 h-5 mt-0.5 accent-[#BA9E50]" />{t.rotulo}
            </label>
          ))}
        </div>
        {!igual && (
          <div aria-live="polite" data-testid="cenario-b">
            <Comparacao tituloA="Cenário A — seu fim de semana atual" tituloB="Cenário B — com a mudança" a={s} b={sB} rotuloA={`${ROTULO_ESTADO[s.estado].simbolo} ${ROTULO_ESTADO[s.estado].rotulo}`} rotuloB={`${ROTULO_ESTADO[sB.estado].simbolo} ${ROTULO_ESTADO[sB.estado].rotulo}`} />
            <p className="text-white mt-3">Diferença na semana: <strong className="tabular-nums">{fmtKcal(sB.saldo.mid - s.saldo.mid)}</strong>. {fraseDaSemana(sB)}</p>
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          {melhor && <button type="button" onClick={() => { setAj({ ...SEM_AJUSTE, ...melhor.ajuste, passosExtra: melhor.ajuste.passosExtra ?? 0 }); trackEvent("weekend_scenario_changed", { placement, control: "menor-mudanca" }); }} className={btnSec}>Testar a menor mudança</button>}
          <button type="button" onClick={() => { setAj({ ...SEM_AJUSTE, bebidas: temBebida ? 0.5 : 1, proximaRefeicao: true }); trackEvent("weekend_scenario_changed", { placement, control: "flexivel-planejado" }); }} className={btnSec}>Flexível e planejado</button>
          {!igual && <button type="button" onClick={() => mexe("reset", SEM_AJUSTE)} className="text-gray-400 text-sm underline underline-offset-4 min-h-[44px]">Voltar ao cenário atual</button>}
        </div>
        <p className="text-gray-500 text-xs">“Flexível e planejado” mantém uma refeição social por dia{temBebida ? ", metade das bebidas" : ""} e a sobremesa, se estiver nela — e volta à rotina na refeição seguinte.</p>
      </div>

      {/* 4 — uma refeição × fim de semana inteiro */}
      <details className="border border-white/15 group" onToggle={(ev) => { if ((ev.target as HTMLDetailsElement).open) trackEvent("weekend_comparison_viewed", { placement, block: "refeicao-fds" }); }}>
        <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 min-h-[56px]"><span className="text-white font-bold text-lg" style={h}>Compare: uma refeição livre × o fim de semana inteiro</span><span aria-hidden="true" className="text-[#BA9E50] text-2xl leading-none transition-transform group-open:rotate-45">+</span></summary>
        <div className="px-5 pb-5">
          <p className="text-gray-300 text-sm mb-4">Mesma semana útil que a sua, dois fins de semana. Não é o alimento: é quanto tempo a rotina fica de lado.</p>
          <Comparacao tituloA="A — uma refeição mais livre no sábado à noite" tituloB="B — sexta à noite + sábado + domingo" a={cmp.a} b={cmp.b} rotuloA={fraseDaSemana(cmp.a)} rotuloB={fraseDaSemana(cmp.b)} />
        </div>
      </details>

      {/* 5 — recomeçar rápido */}
      <details className="border border-white/15 group" onToggle={(ev) => { if ((ev.target as HTMLDetailsElement).open) trackEvent("weekend_comparison_viewed", { placement, block: "recomecar" }); }}>
        <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 min-h-[56px]"><span className="text-white font-bold text-lg" style={h}>O efeito “já que eu saí da dieta…”</span><span aria-hidden="true" className="text-[#BA9E50] text-2xl leading-none transition-transform group-open:rotate-45">+</span></summary>
        <div className="px-5 pb-5"><p className="text-gray-300 text-sm mb-4">Você saiu do planejado no almoço de sábado. Existem dois caminhos.</p><RestartFastComparison a={rr.a} b={rr.b} diasDeDeficit={rr.diasDeDeficit} /></div>
      </details>

      {/* 6 — balança ≠ gordura */}
      <details className="border border-white/15 group" onToggle={(ev) => { if ((ev.target as HTMLDetailsElement).open) trackEvent("weekend_comparison_viewed", { placement, block: "balanca" }); }}>
        <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 min-h-[56px]"><span className="text-white font-bold text-lg" style={h}>A balança subiu muito na segunda?</span><span aria-hidden="true" className="text-[#BA9E50] text-2xl leading-none transition-transform group-open:rotate-45">+</span></summary>
        <div className="px-5 pb-5 space-y-4 text-gray-300 text-sm leading-relaxed">
          <ScaleVsFatExplanation />
          <p>A balança mede <strong className="text-white">massa corporal</strong>, não gordura. Em 24 a 72 horas ela muda com água, glicogênio (cada grama guardado leva água junto), sódio, a quantidade de comida ainda no intestino e o horário da pesagem. Isso não quer dizer que “é tudo retenção” — um saldo positivo também pode existir. Quer dizer que a balança de segunda, sozinha, não responde a pergunta.</p>
          <div className="max-w-[220px]"><NumericInput rotulo="Quanto a balança subiu? (opcional)" sufixo="kg" valor={subiu} onChange={setSubiu} placeholder="2" /></div>
          {bal && (
            <p className="text-white" data-testid="balanca-resultado">Mesmo no cenário mais alto da sua simulação, a energia extra do fim de semana corresponderia a <strong>no máximo cerca de {bal.tetoGorduraKg.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kg</strong> de tecido gorduroso. O restante dos {subiuKg!.toLocaleString("pt-BR")} kg tende a ser água, glicogênio, sódio e conteúdo intestinal — e costuma baixar em alguns dias de rotina. É um teto, não uma medida.</p>
          )}
          <p>O que responde: a <strong className="text-white">média da semana</strong> comparada com a da semana anterior. Veja <Link href="/blog/balanca-nao-muda-mas-o-corpo-muda" onClick={clique} className={ln}>por que a balança engana</Link> e <Link href="/blog/retencao-de-liquido-como-desinchar" onClick={clique} className={ln}>o que é retenção de líquido</Link>.</p>
        </div>
      </details>

      {/* 7 — projeção */}
      <div className="border border-white/15 p-5 sm:p-6" data-testid="projecao">
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-1" style={{ color: DOURADO }}>E se todos os seus fins de semana fossem assim?</p>
        <p className="text-gray-400 text-sm mb-4">Variação de peso estimada se o padrão se repetisse, por um modelo dinâmico — com faixa, não um número.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <caption className="sr-only">Variação de peso estimada em 4, 8 e 12 semanas, cenário atual e ajustado</caption>
            <thead><tr className="border-b border-white/20"><th scope="col" className="text-left text-gray-400 font-medium py-2 pr-3">Em</th><th scope="col" className="text-left text-gray-400 font-medium py-2 pr-3">Cenário atual</th>{!igual && <th scope="col" className="text-left text-gray-400 font-medium py-2">Com a mudança</th>}</tr></thead>
            <tbody>{projA.map((p, i) => (
              <tr key={p.semana} className="border-b border-white/10">
                <th scope="row" className="text-white text-left font-medium py-2 pr-3">{p.semana} semanas</th>
                <td className="text-gray-200 py-2 pr-3 tabular-nums">{fmtDeltaKg(p.delta)} <span className="text-gray-500 text-xs block sm:inline">({fmtDeltaKg(p.min)} a {fmtDeltaKg(p.max)})</span></td>
                {!igual && <td className="text-gray-200 py-2 tabular-nums">{fmtDeltaKg(projB[i].delta)} <span className="text-gray-500 text-xs block sm:inline">({fmtDeltaKg(projB[i].min)} a {fmtDeltaKg(projB[i].max)})</span></td>}
              </tr>
            ))}</tbody>
          </table>
        </div>
        <p className="text-gray-500 text-xs mt-3">A balança do dia a dia vai oscilar em volta disso. Para ver a trajetória completa até uma meta: <Link href="/ferramentas/simulador-emagrecimento" onClick={clique} className={ln}>Simulador de Emagrecimento</Link>; para 3 meses com checkpoints: <Link href="/ferramentas/meu-shape-12-semanas" onClick={clique} className={ln}>Meu Shape em 12 Semanas</Link>.</p>
      </div>

      {/* 8 — o que é calculado, estimado e desconhecido */}
      <div className="grid gap-3 sm:grid-cols-3 text-sm" data-testid="certeza">
        <div className="border border-white/15 p-4"><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Informado por você</p><p className="text-gray-200">{entrada.modo === "sei" ? `${fmtN(s.ingestaoUtil)} kcal por dia útil; sábado e domingo como você disse.` : "Como são seus dias úteis, sexta, sábado, domingo e movimento."}{manutencao(entrada).informada ? " Sua manutenção." : ""}</p></div>
        <div className="border border-white/15 p-4"><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Estimado pela ferramenta</p><p className="text-gray-200">Gasto de {fmtN(s.manutencao.min)} a {fmtN(s.manutencao.max)} kcal/dia{entrada.modo === "nao-sei" ? "; calorias das refeições e bebidas, em faixa" : ""}; a projeção.</p></div>
        <div className="border border-white/15 p-4"><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Não sabemos</p><p className="text-gray-200">Quanto exatamente virou gordura, quanto é água, e o seu peso exato no futuro.</p></div>
      </div>

      {usaCaneta && (
        <div className="border border-white/15 p-4 text-sm leading-relaxed" data-testid="caneta">
          <p className="text-white font-semibold mb-1">Mesmo usando caneta, o fim de semana ainda conta?</p>
          <p className="text-gray-300">Conta — a matemática do saldo é a mesma. Medicamentos como tirzepatida e semaglutida costumam reduzir apetite e ingestão, mas a resposta varia muito entre pessoas, e por isso o simulador não desconta nada por causa deles. Dose, dia de aplicação e álcool durante o tratamento são conversa com quem prescreve — não mude o dia da aplicação para “cobrir” o fim de semana. Veja também a <Link href="/ferramentas/massa-magra-glp1" onClick={clique} className={ln}>calculadora de massa magra com GLP-1</Link>.</p>
        </div>
      )}

      {/* 9 — palavra do Montinho + CTA honesto */}
      <div className="border border-white/15 bg-gradient-to-b from-white/[0.06] to-transparent p-6 relative" data-testid="cta-simulador">
        <div className="absolute top-0 left-0 h-[2px] w-16" style={{ background: DOURADO }} aria-hidden="true" />
        <p className="text-white text-lg leading-relaxed mb-3" style={h}>Não é uma refeição que define sua semana. É o que acontece no conjunto dos sete dias.</p>
        <p className="text-gray-300 leading-relaxed mb-6">Seu fim de semana não precisa ser perfeito. Precisa fazer parte da estratégia.</p>
        <p className="text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: DOURADO }}>{FECHAMENTO_COMPARACAO.titulo}</p>
        <div className="space-y-3 mb-6" data-testid="fechamento">{FECHAMENTO_COMPARACAO.paragrafos.map((t) => <p key={t} className="text-white leading-relaxed">{t}</p>)}<p className="text-gray-400 text-sm">— Montinho</p></div>
        <p className="text-white font-bold text-xl mb-2" style={h}>{cta.titulo}</p>
        <p className="text-gray-300 leading-relaxed mb-5 max-w-xl">{cta.texto}</p>
        <a href={getWhatsAppUrl(MSG_WHATSAPP)} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("weekend_whatsapp_click", { placement })} className={btnPrim}>{cta.botao} →</a>
        <p className="text-gray-500 text-xs mt-3">A mensagem vai sem nenhum número seu — nem calorias, nem peso, nem bebidas.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={compartilhar} className={btnSec}>Compartilhar meu resultado</button>
        <span className="text-gray-500 text-xs">Só a frase “{fraseShare}” — sem calorias.</span>
        {copiado && <span className="text-sm text-white" role="status">Link copiado.</span>}
      </div>

      <MethodologyDrawer titulo="Como calculamos?" aberto={metodo} onToggle={() => { if (!metodo) trackEvent("weekend_methodology_open", { placement }); setMetodo(!metodo); }}>
        <p><strong className="text-white">Gasto:</strong> {manutencao(entrada).informada ? "a manutenção que você informou, com margem de ±5%" : "Mifflin-St Jeor × fator da sua rotina, com margem de ±10%"}. <strong className="text-white">Dias úteis:</strong> {entrada.modo === "sei" ? "o que você informou" : "a manutenção menos 20% (plano), 10% (cuidado) ou 0%"}. <strong className="text-white">Fim de semana:</strong> {entrada.modo === "sei" ? "o que você informou" : "faixas por descrição (ex.: uma refeição mais livre = 400 a 1.000 kcal a mais que um dia útil) ou pelos itens do construtor; refeições entram como a diferença para uma refeição comum (30% do dia útil), extras e bebidas somam inteiros"}. <strong className="text-white">Movimento:</strong> passos a mais ou a menos × custo de caminhar no seu peso.</p>
        <p><strong className="text-white">Saldo:</strong> soma dos sete dias. <strong className="text-white">Construído:</strong> 5 × (dia útil − manutenção). <strong className="text-white">Preservado:</strong> saldo ÷ construído. Até ±350 kcal na semana (ou uma faixa que cruza o zero), o resultado é “perto da manutenção”.</p>
        <p><strong className="text-white">Projeção:</strong> a ingestão média dos 7 dias num balanço dinâmico (Hall, 2011; partição de Forbes), com o gasto recalculado pelo peso. Não usa 7.700 kcal = 1 kg. Treino, medicação e hormônios não mudam a conta.</p>
        <p><a href="#metodologia" onClick={() => { const d = document.getElementById("metodologia"); if (d instanceof HTMLDetailsElement) d.open = true; }} className={ln}>Ver metodologia completa e referências</a></p>
      </MethodologyDrawer>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <button type="button" onClick={() => irPara(etapas.indexOf("sabado") + 1)} className="underline underline-offset-4 min-h-[44px]">Mexer no meu sábado e domingo</button>
        <button type="button" onClick={() => irPara(1)} className="underline underline-offset-4 min-h-[44px]">Editar minhas respostas</button>
        <button type="button" onClick={recomecarTudo} className="underline underline-offset-4 min-h-[44px]">Apagar meus dados e recomeçar</button>
      </div>
    </div>
  );
}

function Erro({ m }: { m?: string }) { return m ? <p role="alert" className="text-red-300 text-sm mt-2">{m}</p> : null; }
