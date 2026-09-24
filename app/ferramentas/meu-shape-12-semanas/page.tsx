import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { aplicativoSchema } from "@/lib/ferramentas/schema";
import FAQ, { type ItemFAQ } from "@/components/ui/FAQ";
import Compartilhar from "@/components/share/Compartilhar";
import OutrosSimuladores from "@/components/simulador/OutrosSimuladores";
import SimuladorShape12 from "@/components/simulador/SimuladorShape12";
import { ESTUDOS } from "@/lib/simulador/emagrecimento";
import { NIVEIS } from "@/lib/potencial";
import { FASES, FONTES_12, projeta12, sessoesLargando, type Perfil12 } from "@/lib/simulador/shape12";
import { EVIDENCIAS_12_PROPRIAS } from "@/lib/simulador/evidencias-shape12";

/**
 * Meu Shape em 12 Semanas — o terceiro dos Simuladores Montinho.
 *
 * Os outros dois fixam a META e perguntam o prazo. Este fixa o PRAZO (12
 * semanas) e pergunta o que dá para construir nele. Cobre "3 meses",
 * "90 dias" e "12 semanas" sem dizer que são a mesma coisa, e ataca
 * "antes e depois de 3 meses" explicando o que a foto não mostra — sem
 * fabricar nenhuma. Tabelas calculadas pelos motores no build.
 */

const CAMINHO = "/ferramentas/meu-shape-12-semanas";

export const metadata: Metadata = {
  title: "Meu Shape em 12 Semanas: Quanto o Corpo Muda em 3 Meses",
  description:
    "Simule como treino, passos e consistência podem mudar seu shape nos próximos 3 meses. Cenários, checkpoints e o que acompanhar. Grátis, sem cadastro.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "Meu Shape em 12 Semanas | Montinho Personal Trainer",
    description: "12 semanas vão passar de qualquer jeito. Veja o que você pode acumular até lá — e o que mais muda o resultado.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const appSchema = aplicativoSchema({
  nome: "Meu Shape em 12 Semanas",
  descricao: "Simula as próximas 12 semanas de quem quer emagrecer, ganhar massa ou fazer recomposição: trajetória de peso com faixa, treinos acumulados, checkpoints com datas, gargalo por regras e comparação de cenários.",
  caminho: CAMINHO,
  categoria: "HealthApplication",
});
const breadcrumbSchema = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    { "@type": "ListItem", position: 3, name: "Simuladores", item: `${SITE_URL}/simuladores` },
    { "@type": "ListItem", position: 4, name: "Meu Shape em 12 Semanas", item: `${SITE_URL}${CAMINHO}` },
  ],
};

/* ── Exemplos calculados pelo motor, no build ── */
const BASE: Perfil12 = { objetivo: "emagrecer", espelho: [], idade: 35, sexo: "m", alturaCm: 175, pesoKg: 90, gorduraPct: null, medidas: {}, experiencia: "lt6m", treinos: 3, tempo: "45a60", estruturado: "mais-ou-menos", acompanha: "mais-ou-menos", esforco: "algumas", consistHist: "75", rotina: "sentado", passos: "5a75", cardio: "nao", comida: "normal", kcalDia: null, proteinaG: null, sono: "7a8", fimSemana: "um-pouco", medicacao: "nao", hormonio: "nao", historicoPeso: "sempre" };
const emag = (peso: number, c: number) => { const p = { ...BASE, pesoKg: peso }; const r = projeta12(p, { treinos: 3, passos: 6250, consistencia: c }); return -r.variacao12.centro; };
const TAB_EMAG = [70, 90, 110].map((peso) => ({ peso, c75: emag(peso, 0.75), c90: emag(peso, 0.9) }));
const k = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
const TAB_MUSC = NIVEIS.map((n) => ({ nome: n.nome, min: 70 * n.taxa.min * 3, max: 70 * n.taxa.max * 3 }));
const A3 = Math.round(12 * sessoesLargando(3, 0.75)), B3 = Math.round(36 * 0.75);

const faq: ItemFAQ[] = [
  { question: "Quanto o corpo muda em 3 meses de academia?", answer: `O bastante para medir, raramente o bastante para uma foto de propaganda. No exemplo de referência do simulador (homem de 90 kg, 3 treinos por semana, 75% de consistência, déficit moderado), o peso cai cerca de ${k(TAB_EMAG[1].c75)} kg em 12 semanas. A força sobe bem mais rápido que o músculo nas primeiras semanas, e cintura, roupa e fotos costumam mudar antes da balança na recomposição.` },
  { question: "3 meses de academia dão resultado?", answer: "Dão, e o primeiro resultado costuma ser força e disposição, não espelho. Nas primeiras 4 semanas a força sobe principalmente por adaptação do sistema nervoso; a partir das semanas 6 a 8 o crescimento muscular passa a pesar mais. Quem mede cintura, cargas e fotos vê o resultado dos 3 meses; quem olha só a balança costuma achar que não funcionou." },
  { question: "Quanto dá para emagrecer em 3 meses?", answer: `Depende do peso de partida e, principalmente, de quantos dias o plano acontece. No exemplo de referência, 12 semanas rendem cerca de ${k(TAB_EMAG[0].c75)} kg para quem pesa 70 kg e ${k(TAB_EMAG[2].c75)} kg para quem pesa 110 kg, com 75% de consistência — e mais com 90%. O simulador faz a conta com os seus dados.` },
  { question: "Quanto músculo dá para ganhar em 3 meses?", answer: `Pelo modelo de Aragon, que o simulador usa como teto, alguém de 70 kg no primeiro ano de treino ganha no máximo ${k(TAB_MUSC[0].min)} a ${k(TAB_MUSC[0].max)} kg de massa magra em 3 meses — e isso cai para ${k(TAB_MUSC[2].min)} a ${k(TAB_MUSC[2].max)} kg em quem treina há anos. Massa magra não é só músculo, e ninguém consegue prever o seu número exato; por isso o simulador mostra tendência, não quilos.` },
  { question: "Dá para emagrecer e ganhar músculo ao mesmo tempo em 12 semanas?", answer: "Dá, e isso se chama recomposição. Ela acontece com mais facilidade em iniciantes, em quem volta a treinar depois de parar e em quem tem mais gordura; em quem treina há anos é mais lenta (Barakat, 2020). O peso pode cair pouco, ficar estável ou até subir enquanto o shape melhora — por isso, na recomposição, cintura, força e fotos contam mais que a balança." },
  { question: "Por que o peso não muda se meu shape está melhorando?", answer: "Porque a balança soma gordura, músculo, água, glicogênio e conteúdo intestinal. Quem começa a treinar retém água nos músculos e pode ganhar um pouco de músculo enquanto perde gordura: a cintura desce e o peso fica. É o sinal mais comum de recomposição — e o motivo de o simulador mostrar mais do que peso." },
  { question: "Quantas vezes por semana devo treinar para mudar o shape em 3 meses?", answer: "As que acontecem. Cerca de 10 séries por músculo por semana é a referência de volume, e cabe em 3 ou 4 treinos. No simulador, treinar um dia a mais costuma pesar menos do que fazer de verdade os treinos que você já planeja: 4x com 60% de consistência dá menos sessões que 3x com 90%." },
  { question: "Um antes e depois de 3 meses é confiável?", answer: "Raramente conta a história toda. Luz, pose, horário, bomba de treino, bronzeado, ponto de partida, experiência, uso de medicamentos ou hormônios e o tempo real entre as fotos mudam tudo. Fotos de progresso servem para você mesmo, tiradas sempre do mesmo jeito — não para comparar com a de outra pessoa." },
  { question: "Mounjaro ou outras canetas mudam o resultado de 12 semanas?", answer: "Mudam o apetite e, em geral, a velocidade de perda de peso — mas a resposta individual varia demais para virar previsão, e nenhum dos grandes ensaios mede 12 semanas como desfecho principal. O simulador não soma bônus pelo medicamento. Quem usa vê, separado, o que os estudos observaram, e um lembrete sobre treino de força para preservar força e massa muscular nessa fase." },
  { question: "Quem usa testosterona consegue prever o resultado de 3 meses?", answer: "Não com segurança. Hormônios podem alterar massa, água, glicogênio e resposta muscular, mas a resposta varia demais entre pessoas. O simulador não muda a curva por uso hormonal; mostra o que acompanhar — cintura, medidas, força e fotos — e mantém o acompanhamento médico separado do treino." },
  { question: "O que fazer depois das 12 semanas?", answer: "Olhar os dados das semanas 0, 4, 8 e 12 e decidir o próximo ciclo a partir deles: manter o que funcionou, ajustar o que travou. Doze semanas não são um fim — são o primeiro trecho em que dá para ver tendência de verdade. O que decide o longo prazo é o jeito de treinar que você consegue manter." },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const th = "text-left text-gray-400 font-medium py-2.5 pr-4";
const td = "text-gray-300 py-2.5 pr-4 tabular-nums";

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

export default function MeuShape12Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="py-12 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="Trilha" className="text-xs text-gray-500 mb-5">
            <Link href="/" className="hover:text-white">Home</Link> <span aria-hidden="true">/</span> <Link href="/ferramentas" className="hover:text-white">Ferramentas</Link> <span aria-hidden="true">/</span> <Link href="/simuladores" className="hover:text-white">Simuladores</Link> <span aria-hidden="true">/</span> <span className="text-gray-400">Meu Shape em 12 Semanas</span>
          </nav>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>Simuladores Montinho · grátis · sem cadastro</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={h}>Meu Shape em 12 Semanas: Simule Como Seu Corpo Pode Mudar em 3 Meses</h1>
          <Compartilhar contexto="tool" titulo="Meu Shape em 12 Semanas" caminho={CAMINHO} local="tool_top" ferramenta="shape12" aparencia="discreto" className="mb-4" />
          <p className="text-gray-300 text-lg leading-relaxed">Veja como treino, passos e consistência podem influenciar sua evolução nos próximos 3 meses — com checkpoints, cenários e o que acompanhar além da balança.</p>
        </div>
      </section>

      <section className="py-8 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SimuladorShape12 placement="shape12" />
          <noscript><p className="text-gray-300 mt-4">O simulador precisa de JavaScript. As tabelas “quanto emagrecer” e “quanto músculo em 3 meses” abaixo funcionam sem ele.</p></noscript>
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="border-l-2 pl-4" style={{ borderColor: "#BA9E50" }}>
            <p className="text-white text-lg font-semibold" style={h}>Não é “transforme seu corpo em 12 semanas”.</p>
            <p className="text-gray-300 leading-relaxed mt-1">É “veja o que 12 semanas bem aproveitadas podem representar”. A diferença é o que separa uma promessa de uma simulação.</p>
          </div>

          <Secao titulo="Quanto o corpo pode mudar em 12 semanas?" aberto>
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">O bastante para medir; raramente o bastante para uma foto de propaganda.</strong> Em 12 semanas, o que muda com mais certeza é o que você faz: treinos acumulados, cargas, passos. O peso muda de forma previsível dentro de uma faixa. Músculo, gordura e cintura mudam também — mas variam tanto entre pessoas que nenhum simulador honesto dá o seu número.</p>
            <p className="text-gray-300 leading-relaxed">Por isso o simulador separa <strong className="text-white">o que dá para estimar melhor</strong> (peso em faixa, treinos feitos, datas dos checkpoints) do que <strong className="text-white">tem muita variação individual</strong> (músculo, gordura, cintura, força) — e mostra tendência e o que medir para o segundo grupo.</p>
          </Secao>

          <Secao titulo="Três meses de academia dão resultado? O que muda primeiro">
            <ol className="space-y-3 mb-3">{FASES.map((f) => <li key={f.id} className="text-gray-300 leading-relaxed"><strong className="text-white">{f.titulo}.</strong> {f.foco} {f.forca}</li>)}</ol>
            <p className="text-gray-300 leading-relaxed">A força subir no primeiro mês é real — mas é principalmente o sistema nervoso aprendendo o movimento, não músculo novo ainda (Seynnes, 2007). Não confunda uma coisa com a outra: é o erro que faz muita gente achar que “travou” no mês 3.</p>
          </Secao>

          <Secao titulo="Quanto dá para emagrecer em 3 meses?">
            <p className="text-gray-300 leading-relaxed mb-4"><strong className="text-white">Depende do peso de partida e, sobretudo, de quantos dias o plano acontece.</strong> Exemplo de referência: 3 treinos por semana, trabalho sentado, déficit moderado nos dias de plano. Seus números são diferentes — o simulador faz a conta com os seus.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Peso perdido em 12 semanas no exemplo de referência, conforme o peso inicial e a consistência</caption>
                <thead><tr className="border-b border-white/20"><th scope="col" className={th}>Peso inicial</th><th scope="col" className={th}>75% dos dias</th><th scope="col" className="text-left text-gray-400 font-medium py-2.5">90% dos dias</th></tr></thead>
                <tbody>{TAB_EMAG.map((l) => <tr key={l.peso} className="border-b border-white/10"><td className="text-white py-2.5 pr-4 font-medium">{l.peso} kg</td><td className={td}>−{k(l.c75)} kg</td><td className="text-gray-300 py-2.5 tabular-nums">−{k(l.c90)} kg</td></tr>)}</tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-3">Homem, 35 anos, 1,75 m. Estimativa central do modelo; o simulador mostra a faixa. Para uma meta com data qualquer: <Link href="/ferramentas/simulador-emagrecimento" className={ln}>Simulador de Emagrecimento</Link>.</p>
          </Secao>

          <Secao titulo="Quanto músculo dá para ganhar em 3 meses?">
            <p className="text-gray-300 leading-relaxed mb-4"><strong className="text-white">Menos do que os “antes e depois” sugerem, e cada vez menos com os anos de treino.</strong> A tabela mostra o <em>teto</em> de massa magra do modelo de Aragon para alguém de 70 kg — o simulador usa esse teto e não passa dele. Massa magra inclui água e glicogênio, não só músculo.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <caption className="sr-only">Teto de ganho de massa magra em 3 meses por tempo de treino, para 70 kg</caption>
                <thead><tr className="border-b border-white/20"><th scope="col" className={th}>Tempo de treino</th><th scope="col" className="text-left text-gray-400 font-medium py-2.5">Teto em 3 meses (70 kg)</th></tr></thead>
                <tbody>{TAB_MUSC.map((l) => <tr key={l.nome} className="border-b border-white/10"><td className="text-white py-2.5 pr-4 font-medium">{l.nome}</td><td className="text-gray-300 py-2.5 tabular-nums">{k(l.min)} a {k(l.max)} kg</td></tr>)}</tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-3">As taxas de Aragon foram observadas em homens. Quanto ainda cabe no longo prazo: <Link href="/ferramentas/potencial-natural" className={ln}>Calculadora de Potencial Natural</Link>. Peso em ganho sem prazo fixo: <Link href="/ferramentas/simulador-ganho-massa-muscular" className={ln}>Simulador de Ganho de Massa</Link>.</p>
          </Secao>

          <Secao titulo="Dá para emagrecer e ganhar músculo em 12 semanas?">
            <p className="text-gray-300 leading-relaxed"><strong className="text-white">Dá — é a recomposição, e ela tem público certo.</strong> Acontece com mais facilidade em iniciantes, em quem volta a treinar depois de parar e em quem tem mais gordura; em quem treina há anos, é mais lenta (Barakat, 2020). O simulador diz em qual grupo você parece estar. Leia mais em <Link href="/blog/recomposicao-corporal" className={ln}>recomposição corporal</Link>.</p>
          </Secao>

          <Secao titulo="Qual a importância da consistência?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">É a variável que mais muda o que você acumula.</strong> Com 3 treinos por semana, 12 semanas são 36 oportunidades. Com 75% de consistência, 27 viram treino; com 90%, 32.</p>
            <p className="text-gray-300 leading-relaxed">E o jeito de faltar importa: duas pessoas com a mesma chance de perder um treino — uma larga o resto da semana, a outra volta no seguinte — terminam as 12 semanas com cerca de <strong className="text-white">{A3} e {B3} treinos</strong>. O principal não é nunca errar; é reduzir o tempo entre sair da rotina e voltar.</p>
          </Secao>

          <Secao titulo="O que acompanhar além da balança">
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
              <li><strong className="text-white">Peso em média semanal:</strong> 3 a 4 pesagens de manhã; compare médias, nunca dias.</li>
              <li><strong className="text-white">Cintura:</strong> fita no ponto médio entre a última costela e o osso do quadril, justa, sem apertar, paralela ao chão (protocolo da OMS). A cada duas semanas.</li>
              <li><strong className="text-white">Cargas e repetições:</strong> dos 4 a 6 exercícios principais, em todo treino.</li>
              <li><strong className="text-white">Fotos padronizadas:</strong> mesma luz, mesmo lugar, mesma postura, mesmo horário — nas semanas 0, 4, 8 e 12.</li>
              <li><strong className="text-white">Treinos feitos:</strong> é a métrica que decide todas as outras.</li>
            </ul>
          </Secao>

          <Secao titulo="O que um antes e depois de 3 meses não mostra">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">Quase tudo que importa para você.</strong> Luz, pose, horário, bomba de treino, bronzeado e ângulo mudam uma foto mais que muitas semanas de treino. E a foto não diz o ponto de partida, a experiência, a genética, o uso de medicamentos ou hormônios, nem quanto tempo passou de verdade.</p>
            <p className="text-gray-300 leading-relaxed">O simulador não gera imagem de corpo, de propósito. Fotos de progresso servem para comparar você com você, sempre do mesmo jeito. Veja também <Link href="/blog/antes-e-depois-musculacao" className={ln}>antes e depois na musculação</Link>.</p>
          </Secao>

          <Secao titulo="Sono, recuperação e fim de semana">
            <div className="space-y-3">
              {EVIDENCIAS_12_PROPRIAS.map((e) => (
                <details key={e.titulo} className="group border border-white/15 open:border-[#BA9E50]/40">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-4 p-4 min-h-[56px]"><span><span className="block font-bold text-white" style={h}>{e.titulo}</span><span className="block text-gray-400 text-sm mt-1">{e.resumo}</span></span><span aria-hidden="true" className="shrink-0 text-[#BA9E50] text-2xl leading-none transition-transform group-open:rotate-45">+</span></summary>
                  <div className="px-4 pb-4 space-y-3 text-sm leading-relaxed">
                    <ul className="text-gray-300 space-y-2">{e.estudos.map((x) => <li key={x.ref.url}>{x.texto} <a href={x.ref.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 underline underline-offset-2">{x.ref.rotulo}</a></li>)}</ul>
                    <p className="text-gray-300"><span className="text-gray-500 uppercase text-xs tracking-wide">Prática:</span> {e.pratica}</p>
                    <p className="text-gray-300"><span className="text-gray-500 uppercase text-xs tracking-wide">Relatos:</span> {e.relatos}</p>
                    <p className="text-white border-l-2 pl-3" style={{ borderColor: "#BA9E50" }}>{e.acao}</p>
                  </div>
                </details>
              ))}
            </div>
          </Secao>

          <Secao titulo="E para quem usa Mounjaro, Wegovy ou outras canetas?">
            <p className="text-gray-300 leading-relaxed mb-3"><strong className="text-white">O simulador não soma bônus por medicamento.</strong> As canetas mudam o apetite e, em geral, a velocidade de perda — mas a resposta varia demais, e os grandes ensaios medem desfechos de 48 a 72 semanas, não 12:</p>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5 mb-3">{ESTUDOS.map((e) => <li key={e.id}><strong className="text-white">{e.substancia}</strong> ({e.marcas}), {e.estudo}: em {e.duracao}, {e.resultado}, contra {e.comparacao}.</li>)}</ul>
            <p className="text-gray-300 leading-relaxed">Em 12 semanas de caneta, o treino de força pode ajudar a trabalhar força e massa muscular enquanto o peso cai. Veja <Link href="/ferramentas/massa-magra-glp1" className={ln}>Massa Magra no GLP-1</Link>.</p>
          </Secao>

          <Secao titulo="E para quem usa testosterona ou outros hormônios?">
            <p className="text-gray-300 leading-relaxed"><strong className="text-white">Não dá para prever o resultado pelo hormônio.</strong> Ele pode alterar massa corporal, água, glicogênio e resposta muscular — mas a resposta individual varia demais. O simulador não muda a curva por uso hormonal e não orienta substância, dose ou protocolo. O que vale para todo mundo vale aqui: cintura, medidas, força e fotos, com acompanhamento médico separado do treino.</p>
          </Secao>

          <Secao titulo="Como calculamos sua projeção?" id="metodologia">
            <ol className="text-gray-300 leading-relaxed space-y-2 list-decimal pl-5 mb-3">
              <li><strong className="text-white">Peso:</strong> os mesmos motores dos outros Simuladores Montinho. Emagrecer e recomposição usam o balanço energético dinâmico do Simulador de Emagrecimento (inspirado em Hall, 2011), com déficit moderado ou leve (10%); ganhar massa usa o do Simulador de Ganho de Massa, com teto de massa magra por nível de treino. Faixa: gasto ±5%.</li>
              <li><strong className="text-white">Rotina:</strong> seis opções viram o fator de atividade dos motores; cardio 3 ou mais vezes por semana sobe um degrau.</li>
              <li><strong className="text-white">Treinos acumulados:</strong> treinos por semana × 12 × consistência.</li>
              <li><strong className="text-white">Recomeçar rápido:</strong> valor esperado exato — quem volta no seguinte faz n × c por semana; quem larga a semana na primeira falta, c + c² + … + cⁿ.</li>
              <li><strong className="text-white">Recomposição:</strong> viabilidade por perfil (Barakat, 2020): provável em iniciantes, em quem volta e em quem tem mais gordura; possível em intermediários; lenta em avançados.</li>
              <li><strong className="text-white">Cintura:</strong> só tendência (cai, estável, sobe um pouco), ligada à direção do peso, e só quando você mede.</li>
              <li><strong className="text-white">Gargalo:</strong> regras fixas em ordem — saúde, recuperação (6+ treinos com sono curto nunca vira “treine mais”), sono em déficit, consistência, treino, movimento, comida na direção errada, fim de semana, indo bem.</li>
              <li><strong className="text-white">O que mais muda:</strong> testa +1 treino, +2.500 passos e +15 pontos de consistência; só aponta vencedor quando a diferença é clara.</li>
            </ol>
            <p className="text-gray-300 leading-relaxed"><strong className="text-white">O que ele não faz:</strong> quilos de músculo e de gordura, centímetros, números de força, bônus por caneta ou hormônio, imagem de corpo. Vale para adultos; menores de 18 e gestantes recebem orientação em vez de projeção.</p>
          </Secao>

          <OutrosSimuladores atual="shape12" />

          <div>
            <h2 className="text-2xl font-bold text-white mb-5" style={h}>Perguntas frequentes</h2>
            <FAQ itens={faq} placement="shape12" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Quem fez</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Por <Link href="/minha-historia" className={ln}>Montinho</Link>, personal trainer em Alphaville. Metodologia revisada em setembro de 2026 a partir das fontes abaixo. Não houve revisão médica nem de nutricionista. Simulação educativa para adultos — não é diagnóstico, prescrição nem orientação sobre medicamentos ou hormônios.</p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-3" style={h}>Referências</h3>
            <ol className="text-gray-400 text-sm leading-relaxed space-y-2 list-decimal pl-5">
              {FONTES_12.map((f) => <li key={f.url}><a href={f.url} target="_blank" rel="noopener noreferrer" className={ln}>{f.rotulo}</a>. <span className="text-gray-500">{f.resumo}</span></li>)}
              <li>Os motores de peso, as taxas de massa magra e as referências de volume, proteína e aderência são as mesmas do <Link href="/ferramentas/simulador-emagrecimento" className={ln}>Simulador de Emagrecimento</Link> e do <Link href="/ferramentas/simulador-ganho-massa-muscular" className={ln}>Simulador de Ganho de Massa</Link>, onde estão listadas.</li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
