import type { Metadata } from "next";
import Image from "next/image";
import testimonials from "@/data/testimonials.json";
import { BORDOES } from "@/lib/bordoes";
import LpCta, { LpCtaFixa } from "@/components/lp/LpCta";

/**
 * Landing page de anúncio (Google Ads) — personal presencial em Alphaville
 * e Tamboré.
 *
 * UM objetivo: abrir conversa no WhatsApp para marcar a aula experimental.
 * Sem menu, sem rodapé, sem link para o blog — clique pago não vem passear.
 *
 * ESTRUTURA DE RESPOSTA DIRETA: promessa específica no topo → a dor que a
 * pessoa reconhece → o que muda → prova → o caminho curto → investimento →
 * objeções → última chamada. O CTA aparece onde a decisão costuma acontecer.
 *
 * REGRAS QUE A COPY RESPEITA: nenhum número que o site já não afirme
 * (nota e avaliações vêm de data/testimonials.json; resultados, de
 * /resultados; faixa de preço, da página orgânica). Nenhuma promessa de
 * resultado sem a condição (lib/bordoes). Nenhum dado de saúde. noindex,
 * para não concorrer com /personal-trainer-alphaville no orgânico.
 */
export const metadata: Metadata = {
  title: "Personal Trainer em Alphaville e Tamboré | Aula experimental",
  description:
    "Personal presencial em Alphaville e Tamboré: treino montado para a sua rotina, presença em cada série e reavaliação mensal. Agende a aula experimental pelo WhatsApp.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.montinhopersonal.com.br/personal-trainer-alphaville" },
};

const LP = "personal-alphaville";
const MSG_TOPO = "Oi, Montinho! Vi seu anúncio. Quero agendar uma aula experimental de personal presencial em Alphaville/Tamboré.";
const MSG_MEIO = "Oi, Montinho! Vi seu anúncio e quero entender como funciona o treino presencial. Podemos conversar?";
const MSG_FIM = "Oi, Montinho! Li sua página. Quero marcar a aula experimental e ver os horários disponíveis.";

const DORES = [
  "Treina há meses (ou anos) e o corpo não muda",
  "Já começou e parou tantas vezes que perdeu a confiança",
  "Tem uma dor ou lesão antiga e medo de piorar treinando errado",
  "A agenda é tão apertada que o treino sempre é o primeiro a cair",
  "Segue ficha de app, vídeo ou do amigo — e nunca sabe se está fazendo certo",
  "Passou dos 40, 50, 60 e sente que ficou mais difícil",
];
const MUDANCAS = [
  { t: "Protocolo construído do zero para você", d: "Não existe ficha padrão que eu adapto. Seu treino nasce do seu objetivo, do seu nível, das suas limitações e do tempo que você tem de verdade. Dois alunos com o mesmo objetivo saem com treinos diferentes." },
  { t: "Eu ao seu lado em cada série", d: "Não fico no celular no canto da academia. Observo a execução, corrijo antes de virar hábito e ajusto a carga na hora. É a diferença entre treinar com alguém por perto e treinar com acompanhamento." },
  { t: "Medir, ajustar, seguir — todo mês", d: "Seu corpo se adapta; o treino acompanha. Reavaliação mensal para ver o que funcionou, mudar o que travou e não deixar você fazer o mesmo treino por seis meses." },
  { t: "No seu lugar, no seu horário", d: "Sua academia, o espaço fitness do condomínio ou a sua casa. Alphaville, Tamboré, Aldeia da Serra, Barueri e Santana de Parnaíba. O treino vai até onde a sua vida acontece." },
];
const RESULTADOS = [
  { nome: "Bruna Rodrigues", r: "−22 kg", foto: "/antes-depois-montinho-personal-trainer-alphaville-sp.jpg", t: "Durante anos viveu entre começar e recomeçar. Montamos um plano para a vida que ela levava, e a constância substituiu a culpa." },
  { nome: "Elisa Cruz", r: "−20 kg", foto: "/antes-depois-montinho-personal-trainer-4.jpg", t: "“Pela primeira vez consegui manter a consistência e ver resultados de verdade.”" },
  { nome: "Natália Nascimento", r: "−13 kg", foto: "/antes-depois-natalia-montinho-personal.webp", t: "“Percebi que não precisava treinar mais, e sim treinar com estratégia.”" },
];
const PASSOS = [
  { n: "1", t: "Você chama no WhatsApp", d: "Eu mesmo respondo. Me conta o objetivo, a rotina e onde prefere treinar." },
  { n: "2", t: "Marcamos a aula experimental", d: "Você sente na prática como é treinar comigo. Sem compromisso." },
  { n: "3", t: "Proposta sob medida", d: "Formato, frequência e horário que cabem na sua vida. Você decide." },
];
const FAQ = [
  { q: "Quanto custa?", a: "Os pacotes ficam entre R$ 800 e R$ 2.500 por mês, conforme a frequência e o formato (academia, condomínio ou domicílio). Não trabalho com tabela fechada: na primeira conversa entendo o seu cenário e mando uma proposta sob medida, sem compromisso." },
  { q: "Nunca treinei na vida. Consigo acompanhar?", a: "Sim, e começar acompanhado é o jeito mais seguro. Iniciante evolui rápido quando o treino respeita o ponto de partida: técnica e postura primeiro, base de força depois, carga de forma gradual." },
  { q: "Tenho dor nas costas / joelho / ombro. Dá para treinar?", a: "Na maior parte dos casos, treinar bem orientado é justamente o que ajuda. Tenho formação específica em treino para pessoas com dores e limitações, e boa parte dos meus alunos tem 50, 60 e 70 anos. A avaliação inicial define o que entra e o que fica de fora." },
  { q: "Quantas vezes por semana preciso treinar?", a: "Para a maioria das pessoas, duas a quatro sessões bem feitas por semana. Regularidade e execução valem mais do que quantidade, e é isso que o acompanhamento garante." },
  { q: "Viajo muito. E aí?", a: "Muitos alunos combinam presencial quando estão em Alphaville e consultoria online quando estão fora. O treino não para porque você embarcou." },
  { q: "Onde são os treinos?", a: "Na sua academia, no espaço fitness do condomínio ou em casa, com o equipamento que houver. Não é preciso mudar de lugar para treinar comigo." },
];

const avaliacoes = testimonials as { placeRating: number; totalReviews: number; reviews: { name: string; text: string; stars: number }[] };
const Titulo = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-3xl font-bold leading-tight sm:text-4xl ${className}`} style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>{children}</h2>
);

export default function LpPersonalAlphaville() {
  const nota = avaliacoes.placeRating.toFixed(1).replace(".", ",");
  return (
    <div className="bg-black pb-24 text-white sm:pb-0">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <Image src="/hero-banner.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="relative mx-auto max-w-5xl px-5 pb-12 pt-10 sm:pb-20 sm:pt-16">
          <p className="mb-4 inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-200">Personal trainer presencial · Alphaville · Tamboré</p>
          <h1 className="max-w-3xl text-[2.35rem] font-bold leading-[1.02] sm:text-6xl" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
            Pare de treinar no escuro. Tenha um personal que monta o treino para a <em className="not-italic underline decoration-[#25D366] decoration-4 underline-offset-4">sua</em> vida em Alphaville.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-gray-100 sm:text-xl">
            Protocolo feito do zero, eu ao seu lado em cada série e reavaliação todo mês. Na sua academia, no condomínio ou em casa. Primeiro passo: uma aula experimental, sem compromisso.
          </p>
          <div className="mt-8 max-w-xl">
            <LpCta label="Agendar aula experimental" message={MSG_TOPO} posicao="hero" lp={LP} sub="Abre o WhatsApp. Eu mesmo respondo, não é robô." />
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-200">
            <li><span className="text-yellow-300">★★★★★</span> {nota} no Google · {avaliacoes.totalReviews} avaliações</li>
            <li>Mais de 20 anos morando em Alphaville</li>
            <li>Perdi mais de 40 kg na própria pele</li>
          </ul>
        </div>
      </section>

      {/* DOR */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <Titulo>Isso parece com você?</Titulo>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {DORES.map((d) => <li key={d} className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-gray-100"><span className="text-gray-500">—</span>{d}</li>)}
        </ul>
        <div className="mt-8 rounded-2xl border border-[#25D366]/40 bg-[#25D366]/10 p-6">
          <p className="text-lg font-semibold">O problema não é falta de força de vontade. É treinar sem estratégia e sem ninguém olhando.</p>
          <p className="mt-2 text-gray-200">Ficha genérica, execução errada, carga que não progride e um treino que não cabe na sua semana. Isso não é falha sua: é o que acontece com quase todo mundo que treina sozinho. Corrigir isso é exatamente o meu trabalho.</p>
        </div>
      </section>

      {/* O QUE MUDA */}
      <section className="border-y border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
          <Titulo>O que muda quando você treina comigo</Titulo>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {MUDANCAS.map((m) => (
              <div key={m.t} className="rounded-2xl border border-white/10 p-5">
                <div className="text-lg font-semibold">{m.t}</div>
                <p className="mt-2 text-gray-300">{m.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10"><LpCta label="Quero treinar assim" message={MSG_MEIO} posicao="o-que-muda" lp={LP} sub="Conversa de alguns minutos para entender o seu caso. Sem compromisso." /></div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <Titulo>Resultados de quem parou de treinar sozinho</Titulo>
        <p className="mt-2 text-sm text-gray-400">Alunos reais, resultados reais. Cada corpo responde no seu tempo: isto não é promessa para você, é o que aconteceu com eles.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {RESULTADOS.map((r) => (
            <figure key={r.nome} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <Image src={r.foto} alt={`Antes e depois: ${r.nome}, ${r.r}`} width={600} height={600} className="aspect-square w-full object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
              <figcaption className="p-4"><div className="text-2xl font-bold">{r.r}</div><div className="text-sm text-gray-300">{r.nome}</div><p className="mt-2 text-sm text-gray-400">{r.t}</p></figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* AVALIAÇÕES */}
      <section className="border-y border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
          <Titulo>Nota {nota} no Google. Veja por quê.</Titulo>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {avaliacoes.reviews.map((d) => (
              <blockquote key={d.name} className="rounded-2xl border border-white/10 p-5">
                <div className="text-sm text-yellow-300">{"★".repeat(d.stars)}</div>
                <p className="mt-2 text-gray-100">“{d.text}”</p>
                <footer className="mt-3 text-sm text-gray-400">{d.name} · avaliação pública no Google</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* COMO COMEÇA */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
        <Titulo>Como começa (leva menos de um minuto)</Titulo>
        <ol className="mt-8 grid gap-5 sm:grid-cols-3">
          {PASSOS.map((p) => (
            <li key={p.n} className="rounded-2xl border border-white/10 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-black">{p.n}</div>
              <div className="mt-3 text-lg font-semibold">{p.t}</div>
              <p className="mt-1 text-gray-300">{p.d}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10"><LpCta label="Dar o primeiro passo agora" message={MSG_TOPO} posicao="como-comeca" lp={LP} /></div>
      </section>

      {/* INVESTIMENTO */}
      <section className="border-y border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-14 sm:grid-cols-2 sm:py-20">
          <div>
            <Titulo>Quanto custa</Titulo>
            <p className="mt-4 text-gray-100">Os pacotes ficam entre <strong className="text-white">R$ 800 e R$ 2.500 por mês</strong>, conforme frequência e formato. Você recebe uma proposta sob medida depois da primeira conversa, e decide com calma.</p>
            <p className="mt-3 text-gray-300">Compare com o custo de mais um ano treinando sem resultado, ou de uma lesão por execução errada. Acompanhamento não é gasto: é o que faz o resto do esforço valer.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">O que está incluído</h3>
            <ul className="mt-4 space-y-2 text-gray-100">
              {["Avaliação inicial e conversa sobre objetivo e rotina", "Protocolo individual construído do zero", "Sessões presenciais com correção em tempo real", "Reavaliação mensal e ajustes do treino", "Suporte pelo WhatsApp entre as sessões", "Treino adaptado quando você viaja"].map((x) => <li key={x} className="flex gap-3"><span className="text-[#25D366]">✓</span>{x}</li>)}
            </ul>
          </div>
        </div>
      </section>

      {/* QUEM */}
      <section className="mx-auto grid max-w-5xl gap-8 px-5 py-14 sm:grid-cols-[1fr_280px] sm:py-20">
        <div>
          <Titulo>Quem vai treinar com você</Titulo>
          <p className="mt-4 text-gray-100">Sou o Montinho. Cresci acima do peso e passei anos em dietas e protocolos que prometiam rápido e entregavam frustração. Só mudou quando estudei de verdade como o corpo responde ao treino. Perdi mais de 40 kg, e desde então trabalho com pessoas que têm a rotina que eu tinha: agenda lotada, pouca margem para erro e zero paciência para perder tempo.</p>
          <p className="mt-3 text-gray-100">Moro em Alphaville há mais de 20 anos. Conheço o trânsito da 6h30, a academia que fecha às 22h, o jantar que só acontece depois das 21h. O treino que eu monto cabe nessa vida, porque é a minha também.</p>
        </div>
        <Image src="/Treinador Alphaville.jpg" alt="Montinho, personal trainer em Alphaville" width={280} height={498} className="mx-auto rounded-2xl" sizes="(max-width: 640px) 70vw, 280px" />
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
          <Titulo>Antes de você decidir</Titulo>
          <div className="mt-6 space-y-2">
            {FAQ.map((f) => (
              <details key={f.q} className="rounded-xl border border-white/10 p-4">
                <summary className="cursor-pointer font-semibold">{f.q}</summary>
                <p className="mt-2 text-gray-300">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
          <Titulo>Daqui a três meses você vai ter treinado ou vai ter adiado de novo.</Titulo>
          <p className="mx-auto mt-5 max-w-xl text-gray-100">{BORDOES.impossivelCompleta}</p>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">Atendo presencialmente um número limitado de alunos por horário. Se o seu horário está livre hoje, ele pode não estar na semana que vem.</p>
          <div className="mt-8"><LpCta label="Agendar minha aula experimental" message={MSG_FIM} posicao="final" lp={LP} sub="Abre o WhatsApp. Sem compromisso, sem robô." /></div>
          <p className="mt-10 text-xs text-gray-500">Montinho Personal Trainer · Alphaville, SP · <a href="/lgpd" className="underline">Privacidade</a></p>
        </div>
      </section>

      <LpCtaFixa message={MSG_TOPO} lp={LP} />
    </div>
  );
}
