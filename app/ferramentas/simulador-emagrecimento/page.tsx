import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import OutrosSimuladores from "@/components/simulador/OutrosSimuladores";
import Compartilhar from "@/components/share/Compartilhar";
import SimuladorEmagrecimento from "@/components/simulador/SimuladorEmagrecimento";
import { ESTUDOS, FONTES, cenarioAtual, fmtSemanas, projeta, type Perfil } from "@/lib/simulador/emagrecimento";
import { EVIDENCIAS, REFERENCIAS_EVIDENCIAS } from "@/lib/simulador/evidencias";
import { MARCOS, REFERENCIAS_MARCOS, semanaDoMarco } from "@/lib/simulador/marcos";

/**
 * A página do Simulador de Emagrecimento.
 *
 * UMA PÁGINA FORTE, NÃO DEZENAS DE PÁGINAS FINAS
 *
 * "Quanto tempo para perder 5 kg", "10 kg", "20 kg" são respondidas aqui,
 * numa tabela calculada pelo próprio motor no build — não em URLs
 * separadas. Resultados individuais não geram URL nenhuma: tudo fica no
 * navegador.
 *
 * O PAPEL AO LADO DAS VIZINHAS
 *
 * Déficit Calórico responde "quanto comer"; Meta de Peso responde "quanto
 * cabe até uma data". Esta responde "o que tende a acontecer se eu
 * continuar assim, e o que mais mudaria" — e linka as duas.
 */

const CAMINHO = "/ferramentas/simulador-emagrecimento";

export const metadata: Metadata = {
  title: "Simulador de Emagrecimento: Quanto Tempo até a Meta?",
  description:
    "Veja como seu peso pode evoluir nas próximas semanas e compare cenários de treino, passos e consistência. Projeção em faixa, grátis e sem cadastro.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Simulador de Emagrecimento | Montinho Personal Trainer",
    description: "Mexa em treino, passos e consistência e veja o que pode acontecer com seu emagrecimento nos próximos meses.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Simulador de Emagrecimento",
  descricao:
    "Projeta a trajetória de peso semana a semana com um modelo de balanço energético dinâmico, recalculando o gasto conforme o peso muda, e compara cenários de treino, passos, consistência e alimentação.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Simuladores", item: `${SITE_URL}/simuladores` },
    { "@type": "ListItem", position: 4, name: "Simulador de Emagrecimento", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/* ── Exemplos calculados pelo motor, no build ── */
const REF: Perfil = { idade: 35, sexo: "m", alturaCm: 175, pesoKg: 95, metaKg: null, rotina: "sentado", treinos: 3, tiposTreino: ["musculacao"], passos: "5a75", kcalDia: null };
const semanasPara = (kg: number, consistencia: number) => {
  const p = { ...REF, metaKg: REF.pesoKg - kg };
  return projeta(p, { ...cenarioAtual(p), consistencia }).semanaMeta;
};
const txt = (s: number | null) => (s === null ? "mais de 12 meses" : fmtSemanas(s));
const TABELA = [5, 10, 15, 20].map((kg) => ({ kg, c75: semanasPara(kg, 0.75), c90: semanasPara(kg, 0.9), c100: semanasPara(kg, 1) }));
const T5 = TABELA[0], T10 = TABELA[1];
const P = projeta(REF, cenarioAtual(REF));
const mes1 = REF.pesoKg - P.pontos[4].peso, mes3 = REF.pesoKg - P.pontos[13].peso, mes6 = REF.pesoKg - P.pontos[26].peso;
const k = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const PASSOS_MAIS = projeta(REF, { ...cenarioAtual(REF), passos: 8750 });
const passosGanho = PASSOS_MAIS.pontos[12].peso;

const faq: ItemFAQ[] = [
  { question: "Quanto tempo demora para perder 10 kg?", answer: `Para a maioria dos adultos, de quatro meses a um ano — depende do tamanho do déficit, do peso de partida e, principalmente, de quantos dias o plano acontece de fato. No exemplo de referência do simulador (homem de ${REF.pesoKg} kg, sedentário, três treinos por semana e déficit moderado), 10 kg levariam ${txt(T10.c75)} com 75% de consistência e ${txt(T10.c90)} com 90%.` },
  { question: "Quantos kg posso emagrecer em um mês?", answer: `Em geral, de 1 a 4 kg — e o primeiro mês costuma parecer maior porque sai água e glicogênio. Uma faixa sustentável fica entre 0,5% e 1% do peso por semana. No exemplo de referência, o primeiro mês daria cerca de ${k(mes1)} kg na curva do modelo, sem contar a água.` },
  { question: "É possível saber exatamente quando vou chegar ao meu peso?", answer: "Não. Dá para estimar uma faixa provável, e é isso que o simulador mostra. O gasto real varia de pessoa para pessoa, a aderência muda ao longo das semanas e a balança oscila com água. Por isso a resposta vem em semanas aproximadas, nunca numa data exata." },
  { question: "Por que o emagrecimento fica mais lento com o tempo?", answer: "Porque um corpo mais leve gasta menos para existir e se mover, e o organismo ainda reduz um pouco o gasto além do que o peso explica. O mesmo prato que gerava déficit no começo gera um déficit menor meses depois. A curva do simulador desacelera por esse motivo." },
  { question: "Treinar mais acelera o emagrecimento?", answer: "Acelera um pouco, se a alimentação não subir junto. O efeito maior da musculação durante o emagrecimento é outro: ajudar a preservar massa muscular, para que o peso perdido seja mais gordura. No simulador, compare 2, 3 e 4 treinos e veja o tamanho real da diferença no seu caso." },
  { question: "Quantos passos por dia ajudam no emagrecimento?", answer: `Não existe um número mágico: o que conta é quanto você anda a mais do que anda hoje. No exemplo de referência, subir de cerca de 6.250 para 8.750 passos por dia muda a projeção de 12 semanas para ${k(passosGanho)} kg. Para quem está parado, sair de 3.000 para 7.000 passos costuma pesar mais que um treino extra.` },
  { question: "Mounjaro, Wegovy, Ozempic ou retatrutida mudam a previsão do simulador?", answer: "Não. O simulador não soma quilos por causa de medicamento, porque a resposta a tirzepatida, semaglutida e retatrutida varia muito de pessoa para pessoa. Quem informa que usa vê, à parte, o que os ensaios clínicos observaram em média — separado da sua simulação — e um lembrete sobre preservar massa muscular." },
  { question: "Quem usa caneta emagrecedora pode usar o simulador?", answer: "Pode. A simulação mostra o efeito de treino, passos e consistência, que continuam importando durante o tratamento. O ritmo real com o medicamento costuma ser diferente, e uso, dose e ajustes são decisões do médico que acompanha você." },
  { question: "Por que estou perdendo medidas mas não peso?", answer: "Porque a balança soma gordura, músculo, água, glicogênio e o que está no intestino. Quem começa a treinar pode ganhar um pouco de músculo e reter água enquanto perde gordura — a cintura desce e o peso para. Medidas, fotos padronizadas e desempenho mostram o que o peso esconde." },
  { question: "Com 5 kg a menos, o que muda?", answer: "Depende do seu peso de partida: 5 kg são 5% para quem pesa 100 kg, e é nessa faixa que os estudos veem a saúde responder primeiro — sensibilidade à insulina, pressão e triglicerídeos melhoram. No dia a dia, a roupa começa a sobrar, o rosto afina um pouco e escada e treino ficam mais leves. A numeração da roupa costuma demorar mais. O simulador mostra em que semana o seu cenário passa por cada marco." },
  { question: "Quando as pessoas começam a notar que emagreci?", answer: "Você percebe nas primeiras semanas; quem convive com você, por volta de 5% do peso; quem não vê você toda semana, entre 7% e 10%. Um estudo com fotos de rosto encontrou que a mudança fica perceptível a partir de cerca de 1,3 ponto de IMC. Fotos de lado e de perfil mostram antes que a de frente." },
  { question: "O que pesa mais: treinar mais, andar mais ou ser mais consistente?", answer: "Depende do ponto de partida, e é isso que o simulador testa no seu caso. Para quem já treina 3 vezes e anda pouco, passos e consistência costumam mexer mais que um quarto treino. Para quem não treina, sair de 0 para 2 treinos é a mudança de maior retorno, mesmo que a balança demore. Os estudos apontam a aderência como o maior preditor de resultado, acima do tipo de dieta." },
  { question: "Quem usa testosterona deve olhar só o peso?", answer: "Não. Mudanças de massa magra e de água corporal podem fazer o peso subir ou parar enquanto a gordura cai. Nesse caso, cintura, medidas, fotos e composição corporal contam mais que a balança. O simulador não altera a curva por uso de hormônio." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const th = "text-left text-gray-400 font-medium py-2.5 pr-4";
const td = "text-gray-300 py-2.5 pr-4 tabular-nums";
const cta = "text-gray-300 text-sm underline underline-offset-4 decoration-1 hover:text-white min-h-[44px] inline-flex items-center";

/**
 * Seção editorial recolhível. O H2 fica dentro do summary, e o corpo fica no
 * HTML desde o primeiro byte — o Google indexa conteúdo recolhido, e o
 * leitor no celular vê o índice da página em vez de um paredão de texto.
 */
function Secao({ titulo, id, aberto, children }: { titulo: string; id?: string; aberto?: boolean; children: React.ReactNode }) {
  return (
    <details id={id} open={aberto} className="group border-b border-white/10 pb-2 scroll-mt-24">
      <summary className="cursor-pointer list-none flex items-start justify-between gap-4 py-3 min-h-[56px]">
        <h2 className="text-xl sm:text-2xl font-bold text-white" style={h}>{titulo}</h2>
        <span aria-hidden="true" className="shrink-0 mt-1 text-[#BA9E50] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="pt-2 pb-4">{children}</div>
    </details>
  );
}

export default function SimuladorEmagrecimentoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span>{" "}
            <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <Link href="/simuladores" className="hover:text-white">Simuladores</Link> <span aria-hidden="true">/</span>{" "}
            <span className="text-gray-400">Simulador de Emagrecimento</span>
          </nav>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Simuladores Montinho · grátis · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>
            Simulador de Emagrecimento: Quanto Tempo para Chegar à Sua Meta?
          </h1>
          <Compartilhar contexto="tool" titulo="Simulador de Emagrecimento" caminho={CAMINHO} local="tool_top" ferramenta="simulador-emagrecimento" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed">
            Descubra como seu peso pode evoluir ao longo das próximas semanas e compare diferentes estratégias — alterando treino, atividade e consistência.
          </p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SimuladorEmagrecimento placement="simulador-emagrecimento" />
          <noscript>
            <p className="text-gray-300 mt-4">O simulador precisa de JavaScript para calcular a projeção. A tabela “Quanto tempo pode levar para perder 5 kg ou 10 kg?” abaixo funciona sem ele.</p>
          </noscript>
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
            <p className="text-white text-lg font-semibold" style={h}>Emagrecimento não depende de perfeição.</p>
            <p className="text-gray-300 leading-relaxed mt-1">Depende de acumular boas decisões durante tempo suficiente. Um dia ruim não destrói o processo — o problema é transformar um erro pequeno em semanas fora da rotina.</p>
          </div>

          <Secao titulo="Como funciona o Simulador de Emagrecimento?" aberto>
            <p className="text-gray-300 leading-relaxed mb-3">
              Uma calculadora responde “quanto?”. O simulador responde <strong className="text-white">“se eu continuar assim, o que tende a acontecer?”</strong> — e,
              principalmente, <strong className="text-white">qual mudança teria mais impacto</strong>. Você responde sete perguntas curtas (objetivo, dados básicos, meta,
              rotina, passos, alimentação e, se quiser, medicação), e ele desenha sua trajetória estimada semana a semana, com uma faixa provável em volta.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Depois, você mexe em treinos por semana, passos, consistência e alimentação, e a curva muda na hora ao lado do cenário de partida. No fim, o
              simulador testa sozinho três ajustes pequenos e diz qual deles mexeria mais na sua projeção.
            </p>
          </Secao>

          <Secao titulo="Quanto tempo leva para emagrecer?">
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Semanas para os primeiros quilos, meses para metas maiores.</strong> No exemplo de referência do simulador — homem de 35 anos,
              1,75 m, {REF.pesoKg} kg, trabalho sentado, três treinos por semana, alimentação com déficit moderado e 75% de consistência —, a projeção é de
              cerca de {k(mes1)} kg no primeiro mês, {k(mes3)} kg em três meses e {k(mes6)} kg em seis.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Parece pouco perto das promessas da internet, e é de propósito: é o ritmo de quem erra alguns dias por semana e continua. A balança do primeiro
              mês costuma mostrar mais, porque sai água junto. Para ver quanto cabe até uma data específica, use a{" "}
              <Link href="/ferramentas/meta-de-peso" className={ln}>Calculadora de Meta de Peso</Link>; para saber quanto comer, a{" "}
              <Link href="/ferramentas/calculadora-deficit-calorico" className={ln}>Calculadora de Déficit Calórico</Link>.
            </p>
          </Secao>

          <Secao titulo="Quanto tempo pode levar para perder 5 kg ou 10 kg?">
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">No exemplo de referência, 5 kg levam {txt(T5.c75)} com 75% de consistência e {txt(T5.c90)} com 90%; 10 kg levam {txt(T10.c75)} e {txt(T10.c90)}.</strong>{" "}
              A tabela mostra como a consistência muda o prazo mais do que parece. Seus números são diferentes — o simulador faz a conta com os seus.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Tempo estimado para perder 5, 10, 15 e 20 kg conforme a consistência, no exemplo de referência</caption>
                <thead><tr className="border-b border-white/20"><th scope="col" className={th}>Perder</th><th scope="col" className={th}>75% dos dias</th><th scope="col" className={th}>90% dos dias</th><th scope="col" className="text-left text-gray-400 font-medium py-2.5">Todos os dias</th></tr></thead>
                <tbody>
                  {TABELA.map((l) => (
                    <tr key={l.kg} className="border-b border-white/10">
                      <td className="text-white py-2.5 pr-4 font-medium">{l.kg} kg</td>
                      <td className={td}>{txt(l.c75)}</td>
                      <td className={td}>{txt(l.c90)}</td>
                      <td className="text-gray-300 py-2.5 tabular-nums">{txt(l.c100)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-3">Exemplo: homem, 35 anos, 1,75 m, {REF.pesoKg} kg, trabalho sentado, 3 treinos de musculação por semana, déficit de 20% nos dias de plano. Projeções param em 12 meses.</p>
          </Secao>

          <Secao titulo="O que esperar a cada etapa do emagrecimento?">
            <p className="text-gray-300 leading-relaxed mb-4">
              <strong className="text-white">A saúde responde antes do espelho, e o espelho antes da etiqueta da roupa.</strong> Os marcos abaixo são
              percentuais do peso de partida, porque é assim que os estudos mediram — 5 kg em alguém de 60 kg e em alguém de 140 kg são etapas diferentes.
              No exemplo de referência ({REF.pesoKg} kg), a semana estimada de cada marco aparece ao lado; o simulador calcula com o seu peso e o seu cenário.
            </p>
            <div className="space-y-3">
              {MARCOS.map((m) => {
                const sem = semanaDoMarco(P.pontos, REF.pesoKg, m.fracao);
                return (
                  <details key={m.fracao} className="group border border-white/15 open:border-[#BA9E50]/40">
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-4 min-h-[56px]">
                      <span><span className="block font-bold text-white" style={h}>−{k(REF.pesoKg * m.fracao)} kg ({(m.fracao * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%) — {m.titulo}</span><span className="block text-gray-400 text-sm mt-1">{sem === null ? "além de 12 meses no exemplo" : `por volta de ${fmtSemanas(sem)} no exemplo`}</span></span>
                      <span aria-hidden="true" className="shrink-0 text-[#BA9E50] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="px-4 pb-4 space-y-3 text-sm leading-relaxed">
                      <ul className="text-gray-200 space-y-1.5 list-disc pl-5">{m.costuma.map((c) => <li key={c}>{c}</li>)}</ul>
                      {m.aindaNao && <p className="text-gray-400"><span className="text-gray-500 uppercase text-xs tracking-wide">Ainda não:</span> {m.aindaNao}</p>}
                      <ul className="text-gray-400 space-y-1.5 border-t border-white/10 pt-3">
                        {m.estudos.map((e) => <li key={e.ref.url}>{e.texto} <a href={e.ref.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline underline-offset-2">{e.ref.rotulo}</a></li>)}
                      </ul>
                    </div>
                  </details>
                );
              })}
            </div>
            <p className="text-gray-500 text-xs mt-3">Roupa, rosto e disposição são o que costuma acontecer, pela prática e pelos relatos — não uma garantia. Onde a gordura sai primeiro é genética.</p>
          </Secao>

          <Secao titulo="Por que a perda de peso não é linear?">
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Porque o gasto do corpo cai junto com o peso.</strong> A regra de “7.700 kcal por quilo”, multiplicada para sempre, supõe
              que você gasta o mesmo no mês 1 e no mês 6. Não gasta: um corpo mais leve precisa de menos energia, e o organismo ainda reduz um pouco o gasto além
              do que o peso explica. O modelo do NIH usado como referência por este simulador mostra que a resposta do peso a uma mudança na alimentação é lenta,
              com meia-vida de cerca de um ano.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Soma-se a isso a balança: água, glicogênio e intestino mexem alguns quilos de um dia para o outro. Por isso vale olhar a tendência de semanas, não
              o número de uma manhã. Quando a curva parece parar de vez, leia sobre o{" "}
              <Link href="/blog/plato-do-emagrecimento-como-quebrar" className={ln}>platô do emagrecimento</Link>.
            </p>
          </Secao>

          <Secao titulo="O que muda quando você aumenta sua atividade física?">
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Mais do que a maioria espera nos passos, menos do que se imagina no treino.</strong> Uma sessão de musculação gasta
              relativamente pouco além do repouso; andar 2.500 passos a mais todo dia soma quase o mesmo por semana — e acontece sete dias, não três. No simulador,
              compare os dois e veja qual pesa mais no seu caso. Para contar o gasto de caminhar, use a{" "}
              <Link href="/ferramentas/calculadora-calorias-caminhada" className={ln}>calculadora de calorias da caminhada</Link>, e leia se{" "}
              <Link href="/blog/10-mil-passos-por-dia-emagrece" className={ln}>10 mil passos por dia emagrecem</Link>.
            </p>
          </Secao>

          <Secao titulo="Musculação ajuda durante o emagrecimento?">
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Ajuda, e o motivo principal não é gastar calorias.</strong> No déficit, o corpo perde gordura e também um pouco de massa
              magra. O treino de força dá ao músculo um motivo para ficar, e a proteína adequada dá o material. O resultado é que o peso perdido tende a ser mais
              gordura — o que muda o shape mais do que o número. Veja{" "}
              <Link href="/blog/como-perder-gordura-sem-perder-massa-muscular" className={ln}>como perder gordura sem perder massa muscular</Link> e calcule sua meta
              na <Link href="/ferramentas/calculadora-de-proteina" className={ln}>Calculadora de Proteína</Link>.
            </p>
          </Secao>

          <Secao titulo="O que decide o resultado: estudos, prática e relatos">
            <p className="text-gray-300 leading-relaxed mb-6">
              O simulador aponta qual alavanca mexe mais na sua curva. Aqui está o que sustenta cada uma — em três camadas separadas de propósito:
              o que os <strong className="text-white">estudos</strong> mediram, o que a <strong className="text-white">prática</strong> de quem acompanha alunos
              observa, e o que as pessoas <strong className="text-white">relatam</strong> na internet. Relato não é evidência; é o sintoma que os estudos explicam.
            </p>
            <div className="space-y-3">
              {EVIDENCIAS.map((e) => (
                <details key={e.id} className="group border border-white/15 open:border-[#BA9E50]/40">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-5 min-h-[56px]">
                    <span><span className="block text-lg font-bold text-white" style={h}>{e.titulo}</span><span className="block text-gray-400 text-sm mt-1">{e.resumo}</span></span>
                    <span aria-hidden="true" className="shrink-0 text-[#BA9E50] text-2xl leading-none transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="space-y-3 text-sm leading-relaxed px-5 pb-5">
                    <div>
                      <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Estudos</p>
                      <ul className="text-gray-300 space-y-2">
                        {e.estudos.map((x) => <li key={x.ref.url}>{x.texto} <a href={x.ref.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline underline-offset-2">{x.ref.rotulo}</a></li>)}
                      </ul>
                    </div>
                    <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Prática</p><p className="text-gray-300">{e.pratica}</p></div>
                    <div><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Relatos</p><p className="text-gray-300">{e.relatos}</p></div>
                    <div className="border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}><p className="text-gray-400 text-xs uppercase tracking-wide mb-1">O que fazer amanhã</p><p className="text-white">{e.acao}</p></div>
                  </div>
                </details>
              ))}
            </div>
          </Secao>

          <Secao titulo="Emagrecimento com Mounjaro, Wegovy ou outras canetas é diferente?">
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">O mecanismo muda; os princípios, não.</strong> Tirzepatida (um agonista duplo GIP/GLP-1, ex.: Mounjaro) e semaglutida (um
              agonista de GLP-1, ex.: Ozempic e Wegovy) reduzem apetite e ingestão, e por isso a perda costuma ser maior do que só com mudança de estilo de vida.
              Mas os resultados variam muito entre pessoas, e as médias dos estudos valem para populações, doses e durações específicas:
            </p>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5 mb-3">
              {ESTUDOS.map((e) => (
                <li key={e.id}><strong className="text-white">{e.substancia}</strong> ({e.marcas}), estudo {e.estudo}: em {e.duracao}, média de {e.resultado}, contra {e.comparacao}.</li>
              ))}
            </ul>
            <p className="text-gray-300 leading-relaxed">
              Essas médias não são previsão individual, e o simulador não as soma à sua curva. O que continua valendo com a caneta: composição corporal importa, e o
              treino resistido pode ter papel importante para preservar massa muscular e força. Estime quanto do peso pode ser músculo no{" "}
              <Link href="/ferramentas/massa-magra-glp1" className={ln}>Massa Magra no GLP-1</Link> e veja{" "}
              <Link href="/blog/musculacao-durante-uso-de-mounjaro" className={ln}>musculação durante o uso de Mounjaro</Link>.
            </p>
          </Secao>

          <Secao titulo="O peso pode parar mesmo quando o corpo está mudando?">
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Pode, principalmente em quem começou a treinar.</strong> Músculo novo, glicogênio reposto e água retida pelo treino
              podem compensar na balança a gordura que saiu. É a{" "}
              <Link href="/blog/recomposicao-corporal" className={ln}>recomposição corporal</Link> — e é por isso que o simulador não termina na balança. Leia{" "}
              <Link href="/blog/balanca-nao-muda-mas-o-corpo-muda" className={ln}>a balança não muda, mas o corpo muda</Link>.
            </p>
          </Secao>

          <Secao titulo="Como acompanhar o emagrecimento além da balança?">
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
              <li><strong className="text-white">Peso em tendência:</strong> pese-se nas mesmas condições e compare médias semanais, não dias.</li>
              <li><strong className="text-white">Cintura:</strong> fita na altura do umbigo, a cada duas semanas.</li>
              <li><strong className="text-white">Fotos padronizadas:</strong> mesma luz, mesmo lugar, mesma postura, uma vez por mês.</li>
              <li><strong className="text-white">Desempenho:</strong> cargas e repetições que sobem são sinal de que o músculo está sendo preservado.</li>
              <li><strong className="text-white">Composição corporal:</strong> quando houver avaliação, traduza o percentual na{" "}
                <Link href="/ferramentas/composicao-corporal" className={ln}>Calculadora de Composição Corporal</Link>.</li>
            </ul>
          </Secao>

          <Secao titulo="Como calculamos sua projeção?" id="metodologia">
            <p className="text-gray-300 leading-relaxed mb-3">
              O simulador usa um <strong className="text-white">modelo de balanço energético dinâmico simplificado</strong>, inspirado no modelo de Hall e colegas
              (The Lancet, 2011) que sustenta o Body Weight Planner do NIH/NIDDK. Ele não é o modelo completo do NIH: é uma versão transparente, que roda no seu
              navegador, com estas peças:
            </p>
            <ol className="text-gray-300 leading-relaxed space-y-2 list-decimal pl-5 mb-3">
              <li><strong className="text-white">Gasto de repouso</strong> pela equação de Mifflin-St Jeor, recalculado com o peso de cada dia.</li>
              <li><strong className="text-white">Rotina</strong> como fator sobre o repouso: 1,25 (sentado), 1,4 (em pé parte do dia), 1,55 (ativo), 1,7 (trabalho físico). Os passos de hoje já estão nesse fator; só os passos a mais do cenário são somados à parte.</li>
              <li><strong className="text-white">Treino</strong> pelo custo líquido (MET − 1) do Compêndio de Atividades Físicas 2024 — musculação 3,5 MET por 60 minutos (código 02054).</li>
              <li><strong className="text-white">Passos a mais</strong> pelo custo da caminhada em ritmo moderado (3,8 MET, cerca de 100 passos por minuto).</li>
              <li><strong className="text-white">Alimentação:</strong> se você informa as calorias, o cenário parte delas; se não, de um déficit de 10%, 20% ou 25% sobre o gasto estimado, nunca abaixo do repouso nem de 1.200 kcal (mulheres) ou 1.500 kcal (homens).</li>
              <li><strong className="text-white">Consistência</strong> é a fração de dias em que o plano acontece. Nos outros, a alimentação e o treino voltam ao que eram.</li>
              <li><strong className="text-white">O que é perdido</strong> se divide entre gordura (~9.440 kcal/kg) e massa magra (~1.816 kcal/kg) pela relação de Forbes, com a gordura inicial estimada pelo IMC (Deurenberg).</li>
              <li><strong className="text-white">Adaptação:</strong> o gasto cai 0,14 kcal para cada kcal a menos na ingestão, o parâmetro de Hall.</li>
              <li><strong className="text-white">Faixa provável:</strong> o mesmo cenário com gasto 5% menor e 5% maior. Pesos são arredondados para 0,5 kg; prazos, para semanas ou meses.</li>
            </ol>
            <p className="text-gray-300 leading-relaxed">
              <strong className="text-white">Limitações:</strong> o modelo não considera medicamentos, hormônios, doenças, água e glicogênio das primeiras semanas, nem a
              compensação de apetite quando o treino aumenta. Vale para adultos; não roda para menores de 18 anos, gestantes, lactantes ou metas abaixo de IMC 18,5.
              Projeções param em 12 meses.
            </p>
          </Secao>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Não sabe quanto seu corpo gasta?</p>
              <Link href="/ferramentas/calculadora-tmb-tdee" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Gasto Calórico →</Link>
            </div>
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Tem uma data em mente?</p>
              <Link href="/ferramentas/meta-de-peso" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Meta de Peso →</Link>
            </div>
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Quer saber quanto comer?</p>
              <Link href="/ferramentas/calculadora-deficit-calorico" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Calculadora de Déficit Calórico →</Link>
            </div>
            <div className="border border-white/15 p-5">
              <p className="text-white font-semibold mb-2">Quer um treino montado para a sua rotina?</p>
              <Link href="/consultoria-online" className={cta} style={{ textDecorationColor: "#BA9E50" }}>Conhecer a consultoria →</Link>
            </div>
          </div>

          <OutrosSimuladores atual="emagrecimento" />

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="simulador-emagrecimento" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Quem fez</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Metodologia revisada em setembro de 2026 a partir das
              fontes abaixo. Não houve revisão médica. Estimativa educativa para adultos — não é diagnóstico, prescrição de dieta nem orientação sobre medicamentos.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ol className="text-gray-400 text-sm leading-relaxed space-y-2 list-decimal pl-5">
              {FONTES.map((f) => (
                <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a>. <span className="text-gray-500">{f.resumo}</span></li>
              ))}
              {REFERENCIAS_MARCOS.filter((r) => !FONTES.some((f) => f.url === r.url) && !REFERENCIAS_EVIDENCIAS.some((e) => e.url === r.url)).map((r) => (
                <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" className={ln}>{r.rotulo}</a>. <span className="text-gray-500">Base da seção “o que esperar a cada etapa”.</span></li>
              ))}
              {REFERENCIAS_EVIDENCIAS.filter((r) => !FONTES.some((f) => f.url === r.url)).map((r) => (
                <li key={r.url}><a href={r.url} target="_blank" rel="noopener noreferrer" className={ln}>{r.rotulo}</a>. <span className="text-gray-500">Base da seção sobre estudos, prática e relatos.</span></li>
              ))}
              {ESTUDOS.map((e) => (
                <li key={e.url}><a href={e.url} target="_blank" rel="noopener noreferrer" className={ln}>{e.referencia}</a>. <span className="text-gray-500">Estudo {e.estudo}, citado apenas como resultado observado — não entra na simulação.</span></li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
