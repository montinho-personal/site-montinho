import type { Metadata } from "next";
import Image from "next/image";
import testimonials from "@/data/testimonials.json";
import { BORDOES } from "@/lib/bordoes";
import LpCta, { LpCtaFixa } from "@/components/lp/LpCta";

/**
 * Landing page de anúncio (Google Ads) — personal presencial em Alphaville
 * e Tamboré.
 *
 * UM objetivo: abrir conversa no WhatsApp. Sem menu, rodapé, blog ou
 * ferramentas — clique pago não vem passear, e cada rota de fuga é dinheiro.
 *
 * MESSAGE MATCH: quem pesquisou "personal trainer em Alphaville" precisa ler
 * essa expressão no H1, não uma frase conceitual. A frase de impacto virou
 * apoio, logo abaixo.
 *
 * SEM PREÇO, DE PROPÓSITO. A página constrói valor, confiança e desejo; o
 * comercial acontece no WhatsApp, onde dá para entender o caso antes de
 * falar de dinheiro. Não existe seção de valores, nem "a partir de", nem
 * FAQ de preço, nem número escondido em schema.
 *
 * ÂNCORAS PARA SITELINKS: #como-funciona, #onde-atendo, #atendimento e
 * #contato, todas com scroll-mt para o título não encostar no topo quando a
 * URL é aberta direto pelo anúncio.
 *
 * PROVA: só o que o site já afirma — nota e avaliações do Google
 * (data/testimonials.json), resultados de /resultados, "+40 kg" de
 * /minha-historia. Nenhum aluno recebe localização que eu não posso provar.
 */
export const metadata: Metadata = {
  title: "Personal Trainer em Alphaville | Treino presencial com acompanhamento",
  description:
    "Personal trainer em Alphaville e Tamboré: treino individualizado, presencial, na academia do seu condomínio ou onde você já treina. Fale comigo no WhatsApp e consulte horários.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.montinhopersonal.com.br/personal-trainer-alphaville" },
};

const LP = "personal-alphaville";
const MSG_TOPO = "Oi, Montinho! Vi seu anúncio e quero consultar horários de personal presencial em Alphaville.";
const MSG_MEIO = "Oi, Montinho! Vi seu anúncio. Quero entender como funciona o treino presencial e ver horários.";
const MSG_LOCAL = "Oi, Montinho! Vi seu anúncio. Queria saber se você atende no meu condomínio/academia em Alphaville.";
const MSG_FIM = "Oi, Montinho! Li sua página. Meu objetivo é ___ e eu prefiro treinar ___. Quais horários você tem?";

const DORES = [
  "Treina há meses e o corpo não muda",
  "Já começou e parou tantas vezes que perdeu a confiança",
  "Tem uma dor antiga e medo de piorar treinando errado",
  "A agenda é apertada e o treino é o primeiro a cair",
  "Segue ficha de app ou vídeo e nunca sabe se está fazendo certo",
  "Passou dos 40, 50, 60 e sente que ficou mais difícil",
];
const MUDANCAS = [
  { t: "Treino construído do zero para você", d: "Não existe ficha pronta que eu adapto. O seu treino nasce do seu objetivo, do seu nível, das suas limitações e do tempo que você tem de verdade." },
  { t: "Eu ao seu lado em cada série", d: "Não fico no celular no canto da academia. Observo a execução, corrijo antes de virar hábito e ajusto a carga na hora." },
  { t: "Medir, ajustar, seguir", d: "Seu corpo se adapta e o treino acompanha. Reavaliação mensal para manter o que funciona e mudar o que travou." },
  { t: "Perto de você, no seu horário", d: "Na academia do condomínio, onde você já treina ou em casa. Alphaville, Tamboré e região." },
];
const LOCAIS = [
  { t: "Academia do seu condomínio", d: "É onde treina boa parte dos meus alunos. Monto o treino com o equipamento que existe ali — e o que falta, a gente resolve com criatividade e técnica." },
  { t: "A academia onde você já treina", d: "Não precisa mudar de lugar nem cancelar plano. Eu vou até onde a sua rotina já acontece." },
  { t: "Na sua casa", d: "Com o espaço e o equipamento disponíveis. Funciona melhor do que a maioria imagina quando o treino é bem montado." },
];
const RESULTADOS = [
  { nome: "Bruna Rodrigues", r: "−22 kg", foto: "/antes-depois-montinho-personal-trainer-alphaville-sp.jpg", t: "Durante anos viveu entre começar e recomeçar. Montamos um plano para a vida que ela levava, e a constância substituiu a culpa." },
  { nome: "Elisa Cruz", r: "−20 kg", foto: "/antes-depois-montinho-personal-trainer-4.jpg", t: "“Pela primeira vez consegui manter a consistência e ver resultados de verdade.”" },
  { nome: "Natália Nascimento", r: "−13 kg", foto: "/antes-depois-natalia-montinho-personal.webp", t: "“Percebi que não precisava treinar mais, e sim treinar com estratégia.”" },
];
const PASSOS = [
  { n: "1", t: "Você me chama no WhatsApp", d: "Eu mesmo respondo. Sem robô e sem formulário." },
  { n: "2", t: "Entendo seu objetivo e sua rotina", d: "O que você quer, quanto tempo tem, se há dor ou lesão e onde prefere treinar." },
  { n: "3", t: "Combinamos a aula experimental", d: "Você sente na prática como é treinar comigo, no seu horário e no seu local." },
  { n: "4", t: "Monto o seu treino", d: "Individual, do zero, para o seu ponto de partida — não uma ficha genérica." },
  { n: "5", t: "Acompanho e ajusto", d: "Presença em cada série, reavaliação mensal e correção de rota quando precisa." },
];
const FAQ = [
  { q: "Como funciona o primeiro contato?", a: "Você me chama no WhatsApp e me conta o objetivo, a rotina e onde prefere treinar. A partir daí eu explico o formato que faz sentido para o seu caso e vejo os horários disponíveis. É uma conversa, não um cadastro." },
  { q: "Preciso fechar alguma coisa depois da aula experimental?", a: "Não. A aula experimental existe justamente para você sentir como é treinar comigo antes de decidir qualquer coisa. Se fizer sentido, seguimos; se não fizer, está tudo certo." },
  { q: "Você atende na academia do meu condomínio?", a: "Sim. Boa parte dos meus alunos treina no próprio espaço fitness do condomínio, em Alphaville e no Tamboré. Me diga onde você mora que eu confirmo se atendo aí." },
  { q: "Preciso já estar treinando?", a: "Não. Atendo desde quem nunca pisou numa academia até quem treina há anos e travou. Começar acompanhado é o jeito mais seguro: técnica primeiro, base de força depois, carga de forma gradual." },
  { q: "Tenho dor nas costas, no joelho ou no ombro. Dá para treinar?", a: "Na maior parte dos casos, treinar bem orientado é justamente o que ajuda. Tenho formação específica em treino para pessoas com dores e limitações, e muitos dos meus alunos têm 50, 60 e 70 anos. A conversa inicial define o que entra e o que fica de fora." },
  { q: "E se eu viajar muito?", a: "Muitos alunos combinam presencial quando estão em Alphaville e acompanhamento à distância quando estão fora. O treino não para porque você embarcou." },
];

const avaliacoes = testimonials as { placeRating: number; totalReviews: number; reviews: { name: string; text: string; stars: number }[] };
const Titulo = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-3xl font-bold leading-tight sm:text-4xl ${className}`} style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>{children}</h2>
);
const ancora = "scroll-mt-6";

export default function LpPersonalAlphaville() {
  const nota = avaliacoes.placeRating.toFixed(1).replace(".", ",");
  return (
    <div className="bg-black pb-28 text-white sm:pb-0">
      {/* HERO — message match com o anúncio */}
      <section className="relative overflow-hidden border-b border-white/10">
        <Image src="/hero-banner.webp" alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="relative mx-auto max-w-5xl px-5 pb-12 pt-9 sm:pb-20 sm:pt-16">
          <p className="mb-4 inline-block rounded-full border border-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-200">Treino presencial · Alphaville · Tamboré</p>
          <h1 className="max-w-3xl text-[2.3rem] font-bold leading-[1.05] sm:text-6xl" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
            Personal Trainer em Alphaville. Treino feito para você, comigo ao seu lado.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-gray-100 sm:text-xl">
            Pare de treinar no escuro. Treino individualizado e presencial, na academia do seu condomínio, onde você já treina ou em casa — construído para a rotina que você tem de verdade.
          </p>
          <div className="mt-8 max-w-xl">
            <LpCta label="Consultar horários" message={MSG_TOPO} posicao="hero" lp={LP} sub="Abre o WhatsApp. Eu mesmo respondo." />
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-200">
            <li><span className="text-yellow-300">★★★★★</span> {nota} no Google · {avaliacoes.totalReviews} avaliações</li>
            <li>Atendimento em academias e condomínios de Alphaville</li>
            <li>Mais de 20 anos morando aqui</li>
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
          <p className="mt-2 text-gray-200">Ficha genérica, execução errada, carga que não progride e um treino que não cabe na sua semana. Isso acontece com quase todo mundo que treina sozinho — e corrigir isso é exatamente o meu trabalho.</p>
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
          <div className="mt-10"><LpCta label="Quero treinar assim" message={MSG_MEIO} posicao="o_que_muda" lp={LP} /></div>
        </div>
      </section>

      {/* ONDE ATENDO — sitelink #onde-atendo */}
      <section id="onde-atendo" className={`mx-auto max-w-5xl px-5 py-14 sm:py-20 ${ancora}`}>
        <Titulo>Treine onde for melhor para você em Alphaville</Titulo>
        <p className="mt-3 max-w-2xl text-gray-200">Eu vou até onde a sua vida acontece. Atendo <strong className="text-white">Alphaville e Tamboré</strong>, e também Aldeia da Serra, Barueri e Santana de Parnaíba.</p>
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {LOCAIS.map((l) => (
            <div key={l.t} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <div className="text-lg font-semibold">{l.t}</div>
              <p className="mt-2 text-gray-300">{l.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-8"><LpCta label="Ver se atendo no meu condomínio" message={MSG_LOCAL} posicao="onde_atendo" lp={LP} /></div>
      </section>

      {/* RESULTADOS */}
      <section className="border-y border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
          <Titulo>Resultados de quem parou de treinar sozinho</Titulo>
          <p className="mt-2 text-sm text-gray-400">Alunos reais, resultados reais. Cada corpo responde no seu tempo: isto é o que aconteceu com eles, não uma promessa para você.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {RESULTADOS.map((r) => (
              <figure key={r.nome} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                <Image src={r.foto} alt={`Antes e depois: ${r.nome}, ${r.r}`} width={600} height={600} loading="lazy" className="aspect-square w-full object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
                <figcaption className="p-4"><div className="text-2xl font-bold">{r.r}</div><div className="text-sm text-gray-300">{r.nome} · treino presencial</div><p className="mt-2 text-sm text-gray-400">{r.t}</p></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* AVALIAÇÕES */}
      <section className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
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
      </section>

      {/* COMO FUNCIONA — sitelink #como-funciona */}
      <section id="como-funciona" className={`border-y border-white/10 ${ancora}`} style={{ background: "#0d0d0d" }}>
        <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
          <Titulo>Como funcionam as aulas</Titulo>
          <ol className="mt-8 grid gap-4 sm:grid-cols-3">
            {PASSOS.map((p) => (
              <li key={p.n} className="rounded-2xl border border-white/10 p-5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-black">{p.n}</div>
                <div className="mt-3 text-lg font-semibold">{p.t}</div>
                <p className="mt-1 text-gray-300">{p.d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10"><LpCta label="Consultar horários para a aula experimental" message={MSG_MEIO} posicao="como_funciona" lp={LP} /></div>
        </div>
      </section>

      {/* ATENDIMENTO — sitelink #atendimento. Formatos, sem valores. */}
      <section id="atendimento" className={`mx-auto max-w-5xl px-5 py-14 sm:py-20 ${ancora}`}>
        <Titulo>Encontre o formato ideal para a sua rotina</Titulo>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-lg font-semibold">Presencial individual</div>
            <p className="mt-2 text-gray-300">Você e eu, na frequência que faz sentido para o seu objetivo e para a sua semana. É o formato da maioria dos meus alunos.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="text-lg font-semibold">Presencial em dupla</div>
            <p className="mt-2 text-gray-300">Com marido, esposa, filho ou amigo. Rende bem quando os dois têm horário parecido e gostam de treinar juntos.</p>
          </div>
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 p-5">
          <div className="text-lg font-semibold">O que está incluído em qualquer formato</div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {["Conversa inicial sobre objetivo, rotina e histórico", "Treino individual construído do zero", "Correção de execução em tempo real, série a série", "Reavaliação e ajustes todo mês", "Suporte pelo WhatsApp entre as sessões", "Treino adaptado quando você viaja"].map((x) => <li key={x} className="flex gap-3 text-gray-100"><span className="text-[#25D366]">✓</span>{x}</li>)}
          </ul>
        </div>
        <p className="mt-6 text-gray-300">A frequência e o formato mudam de pessoa para pessoa, e é por isso que eu prefiro entender o seu caso antes de propor qualquer coisa. Me chama que a gente vê o que cabe na sua rotina.</p>
        <div className="mt-6"><LpCta label="Falar sobre o meu caso" message={MSG_MEIO} posicao="atendimento" lp={LP} /></div>
      </section>

      {/* QUEM SOU — confiança, não biografia */}
      <section className="border-y border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="mx-auto grid max-w-5xl gap-8 px-5 py-14 sm:grid-cols-[1fr_280px] sm:py-20">
          <div>
            <Titulo>Quem vai treinar com você</Titulo>
            <p className="mt-4 text-gray-100">Sou o Montinho. Cresci acima do peso e passei anos em dietas que prometiam rápido e entregavam frustração. Perdi mais de 40 kg quando parei de procurar atalho e comecei a estudar de verdade como o corpo responde ao treino. Eu vivi isso na pele — e vivo isso todo dia, ainda hoje.</p>
            <p className="mt-3 text-gray-100">Moro em Alphaville há mais de 20 anos. Conheço o trânsito da 6h30, a academia que fecha às 22h e o jantar que só acontece depois das 21h. O treino que eu monto cabe nessa vida porque ela também é a minha.</p>
            <div className="mt-5 rounded-2xl border border-white/15 bg-black/40 p-5">
              <p className="text-lg font-semibold">Todo shape merece um chalalá: {BORDOES.chalala}.</p>
              <p className="mt-2 text-gray-300">{BORDOES.chalalaNaoEhSegredo}</p>
            </div>
          </div>
          <Image src="/Treinador Alphaville.jpg" alt="Montinho, personal trainer em Alphaville" width={280} height={498} loading="lazy" className="mx-auto rounded-2xl" sizes="(max-width: 640px) 60vw, 280px" />
        </div>
      </section>

      {/* FAQ — objeções, nenhuma sobre preço */}
      <section className="mx-auto max-w-3xl px-5 py-14 sm:py-20">
        <Titulo>Antes de você me chamar</Titulo>
        <div className="mt-6 space-y-2">
          {FAQ.map((f) => (
            <details key={f.q} className="rounded-xl border border-white/10 p-4">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-gray-300">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-8"><LpCta label="Tirar minha dúvida no WhatsApp" message={MSG_MEIO} posicao="faq" lp={LP} /></div>
      </section>

      {/* CONTATO — sitelink #contato */}
      <section id="contato" className={`border-t border-white/10 ${ancora}`}>
        <div className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
          <Titulo>Daqui a três meses você vai ter treinado ou vai ter adiado de novo.</Titulo>
          <p className="mx-auto mt-5 max-w-xl text-lg text-gray-100">{BORDOES.impossivelCompleta}</p>
          <p className="mx-auto mt-3 max-w-xl text-gray-300">Eu não digo isso da arquibancada: perdi mais de 40 kg fazendo exatamente isso, e continuo fazendo todo dia.</p>
          <p className="mx-auto mt-4 max-w-xl text-gray-300">Me conta seu objetivo, sua rotina e onde você prefere treinar. Eu mesmo respondo.</p>
          <div className="mt-8"><LpCta label="Consultar horários no WhatsApp" message={MSG_FIM} posicao="final" lp={LP} sub="Segunda a sábado. Sem compromisso, sem robô." /></div>
          <p className="mt-10 text-xs text-gray-500">Montinho Personal Trainer · Alphaville, SP · <a href="/lgpd" className="underline">Privacidade</a></p>
        </div>
      </section>

      <LpCtaFixa message={MSG_TOPO} lp={LP} />
    </div>
  );
}
