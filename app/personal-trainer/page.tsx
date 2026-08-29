import type { Metadata } from "next";
import Image from "next/image";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import testimonials from "@/data/testimonials.json";

/**
 * Landing Page de alta conversão para Google Ads.
 * - Sem navegação, sem links externos: único objetivo = clique no WhatsApp
 * - Header/Footer globais ocultados via CSS local
 * - noindex: página de tráfego pago, não compete com as páginas orgânicas
 */

const LP_MESSAGE =
  "Olá, Montinho! Vi sua página e quero saber como funciona o acompanhamento. Pode me explicar?";

export const metadata: Metadata = {
  title: "Personal Trainer em Alphaville | Resultados Reais — Montinho",
  description:
    "Treine com um personal que já esteve do outro lado: ex-obeso, -40kg. Atendimento em Alphaville, Tamboré, Barueri e Santana de Parnaíba. Fale no WhatsApp.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.montinhopersonal.com.br/personal-trainer" },
  openGraph: {
    title: "Personal Trainer em Alphaville | Montinho",
    description:
      "Método de quem já viveu o problema. Atendimento em Alphaville, Tamboré, Barueri e Santana de Parnaíba.",
    images: ["https://www.montinhopersonal.com.br/og-image.jpg"],
  },
};

const faqLp = [
  {
    q: "Nunca treinei. Posso começar?",
    a: "Sim. Todo o planejamento é adaptado ao seu nível de condicionamento e experiência.",
  },
  {
    q: "Você atende em condomínios?",
    a: "Sim. Atendo em condomínios, academias e residências em Alphaville e região.",
  },
  {
    q: "Quanto tempo dura uma aula?",
    a: "A duração varia de acordo com o planejamento definido para cada aluno.",
  },
  {
    q: "Você atende quem quer apenas emagrecer?",
    a: "Sim. O acompanhamento é totalmente personalizado para objetivos como emagrecimento, hipertrofia, condicionamento físico e qualidade de vida.",
  },
  {
    q: "Em quanto tempo aparecem os resultados?",
    a: "Os resultados dependem de fatores como frequência, alimentação, sono e comprometimento. Cada pessoa evolui em um ritmo diferente, mas um planejamento individualizado aumenta significativamente suas chances de progresso.",
  },
  {
    q: "O acompanhamento continua depois das aulas?",
    a: "Sim. Além das aulas presenciais, acompanho sua evolução e realizo ajustes sempre que necessário.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqLp.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

function WhatsButton({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="text-center">
      <a
        href={getWhatsAppUrl(LP_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 bg-[#25D366] text-black font-bold text-lg sm:text-xl px-8 sm:px-12 py-5 rounded-2xl shadow-[0_8px_30px_rgba(37,211,102,0.35)] hover:shadow-[0_8px_40px_rgba(37,211,102,0.55)] hover:scale-[1.02] transition-all duration-200 w-full sm:w-auto"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="26" height="26" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        {label}
      </a>
      {sub && <p className="text-gray-300 text-sm mt-3">{sub}</p>}
    </div>
  );
}

function Stars() {
  return (
    <span className="text-[#FBBC04] tracking-tight" aria-label="5 estrelas">
      ★★★★★
    </span>
  );
}

export default function LandingPage() {
  const reviews = (testimonials.reviews as { name: string; text: string; stars: number }[]).slice(0, 3);

  return (
    <>
      {/* Oculta navegação global: LP sem saídas */}
      <style>{`header, footer { display: none !important; } main { padding-top: 0 !important; }`}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="bg-black text-white">
        {/* ───────────────────────── 1. HERO ───────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24 grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#BA9E50] mb-5">
                Personal Trainer · Alphaville e Região
              </p>
              <h1
                className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] mb-6"
                style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}
              >
                Transforme seu corpo em Alphaville com quem já{" "}
                <span className="text-[#BA9E50]">esteve do outro lado</span>.
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-4 max-w-lg">
                Você não precisa de mais um treino genérico ou de tentar descobrir
                sozinho o que funciona. Você precisa de um{" "}
                <strong className="text-white">plano criado para a sua realidade</strong>, com
                acompanhamento contínuo, estratégia e ajustes conforme sua evolução.
              </p>
              <p className="text-gray-300 text-sm mb-8">
                Atendo presencialmente em <strong className="text-gray-200">Alphaville, Tamboré, Barueri e
                Santana de Parnaíba</strong>, em condomínios, academias e residências.
              </p>
              <WhatsButton
                label="Quero conversar pelo WhatsApp"
                sub="Resposta rápida · Primeira conversa sem compromisso"
              />
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-6 text-sm text-gray-300 max-w-lg">
                <li className="flex items-center gap-2">⭐ <span><strong className="text-white">5.0</strong> · {testimonials.totalReviews} avaliações de alunos</span></li>
                <li className="flex items-center gap-2">💪 Ex-obeso que perdeu mais de 40kg</li>
                <li className="flex items-center gap-2">📍 Atendimento personalizado</li>
                <li className="flex items-center gap-2">📲 Acompanhamento contínuo</li>
              </ul>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <figure className="relative aspect-square rounded-3xl overflow-hidden border border-[#BA9E50]/30 shadow-2xl">
                <Image
                  src="/antes-depois-montinho-personal-trainer.jpg"
                  alt="Antes e depois do Montinho: a própria transformação de mais de 40kg"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-[#BA9E50] text-black text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                  Minha própria transformação
                </span>
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent pt-14 pb-5 px-5 text-center">
                  <p className="text-white font-bold text-lg leading-snug" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
                    A mesma pessoa. <span className="text-[#BA9E50]">40kg de diferença.</span>
                  </p>
                  <p className="text-gray-300 text-sm mt-1">
                    O método que me tirou dali é o que vou aplicar em você.
                  </p>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ───────────────────── 2. PROVA SOCIAL ───────────────────── */}
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Resultados que falam mais alto do que qualquer promessa
            </h2>
            <p className="text-center text-gray-300 mb-10 max-w-2xl mx-auto">
              Nada transmite mais confiança do que ver pessoas reais conquistando
              resultados — alunos que decidiram mudar de vida com estratégia,
              acompanhamento e constância.
            </p>

            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12 text-center">
              {[["-40kg","na própria pele"],["20+","anos de experiência"],["5.0 ★","17 avaliações Google"]].map(([n,d]) => (
                <div key={n} className="border border-white/10 rounded-2xl py-5 px-2 bg-black/40">
                  <p className="text-[#BA9E50] text-2xl sm:text-3xl font-bold" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>{n}</p>
                  <p className="text-gray-300 text-xs mt-1">{d}</p>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
              {[
                {
                  src: "/antes-depois-montinho-personal-trainer-2.jpg",
                  alt: "Antes e depois da Adriana: 20kg eliminados com o Montinho Personal Trainer",
                  name: "Adriana",
                  kg: "−20kg",
                  frase: "Anos tentando sozinha. 8 meses com estratégia.",
                },
                {
                  src: "/antes-depois-montinho-personal-trainer-4.jpg",
                  alt: "Antes e depois da Elisa: 20kg eliminados com o Montinho Personal Trainer",
                  name: "Elisa",
                  kg: "−20kg",
                  frase: "Sem viver em função da academia. Só com o plano certo.",
                },
              ].map((a) => (
                <figure key={a.src} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
                  <Image src={a.src} alt={a.alt} fill loading="lazy" sizes="(max-width: 640px) 90vw, 400px" className="object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent pt-12 pb-4 px-4 text-center">
                    <p className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
                      {a.name} · <span className="text-[#BA9E50]">{a.kg}</span>
                    </p>
                    <p className="text-gray-300 text-xs mt-0.5">{a.frase}</p>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {reviews.map((r) => (
                <figure key={r.name} className="bg-black border border-white/10 rounded-2xl p-7 flex flex-col">
                  <Stars />
                  <blockquote className="text-gray-300 text-sm leading-relaxed italic flex-1 my-4">
                    &ldquo;{r.text.length > 220 ? r.text.slice(0, 217).trimEnd() + "…" : r.text}&rdquo;
                  </blockquote>
                  <figcaption className="text-sm">
                    <span className="text-white font-semibold">{r.name}</span>
                    <span className="text-gray-400"> · Avaliação no Google</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <WhatsButton label="Quero ser o próximo resultado" />
          </div>
        </section>

        {/* ───────────────────── 4. HISTÓRIA ───────────────────── */}
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-2 grid grid-cols-2 gap-3">
              <figure>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
                  <Image src="/foto-historia-4.jpg" alt="Montinho antes: mais de 40kg acima do peso" fill loading="lazy" sizes="(max-width: 768px) 45vw, 170px" className="object-cover" />
                </div>
                <figcaption className="text-center text-gray-400 text-xs mt-2 uppercase tracking-wider">Antes</figcaption>
              </figure>
              <figure>
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-[#BA9E50]/40">
                  <Image src="/foto-hoje-praia.jpg" alt="Montinho hoje: em forma, personal trainer em Alphaville" fill loading="lazy" sizes="(max-width: 768px) 45vw, 170px" className="object-cover" />
                </div>
                <figcaption className="text-center text-[#BA9E50] text-xs mt-2 uppercase tracking-wider">Hoje</figcaption>
              </figure>
            </div>
            <div className="md:col-span-3">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
                Eu sei exatamente como é começar do zero.
              </h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                Durante muito tempo, eu também olhava no espelho e não gostava do
                que via. Já fui obeso. Passei pelo efeito sanfona. Comecei diversas
                vezes. Desisti algumas delas. Achei que nunca conseguiria mudar.
              </p>
              <p className="text-gray-300 leading-relaxed mb-3">
                Até perceber que o problema não era falta de força de vontade.{" "}
                <strong className="text-white">Era falta de um método.</strong>
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Quando consegui perder <strong className="text-white">mais de 40kg</strong> e transformar
                meu corpo, decidi dedicar minha carreira a ajudar outras pessoas a
                conquistarem essa mesma mudança.
              </p>
              <p className="text-[#BA9E50] font-semibold italic mb-8">
                &ldquo;Hoje meu objetivo não é apenas montar treinos. É encurtar o caminho
                entre onde você está e onde deseja chegar.&rdquo;
              </p>
              <WhatsButton label="Quero percorrer esse caminho" />
            </div>
          </div>
        </section>


        {/* ───────────────────── 3. BENEFÍCIOS ───────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Muito mais do que treinar
            </h2>
            <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
              Você terá um acompanhamento pensado para facilitar sua evolução.
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4 max-w-3xl mx-auto">
              {[
                "Emagreça de forma inteligente e sustentável.",
                "Ganhe massa muscular com um plano adequado para você.",
                "Aprenda a treinar corretamente.",
                "Evite perder tempo com métodos aleatórios.",
                "Reduza o risco de lesões com uma execução mais segura.",
                "Tenha alguém acompanhando sua evolução.",
                "Pare de começar e desistir.",
                "Transforme o treino em um hábito que faça parte da sua rotina.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4">
                  <span className="text-[#25D366] font-bold mt-0.5">✔</span>
                  <span className="text-gray-200 text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <WhatsButton label="Quero essa transformação" />
            </div>
          </div>
        </section>

        {/* ───────────────────── 5. COMO FUNCIONA ───────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Como funciona o acompanhamento
            </h2>
            <ol className="grid sm:grid-cols-5 gap-4 text-center">
              {[
                ["1", "Conversa inicial", "Entendo sua rotina, objetivos, dificuldades, limitações e expectativas."],
                ["2", "Avaliação", "Identifico seu ponto de partida para criar uma estratégia personalizada."],
                ["3", "Planejamento", "Você recebe um plano desenvolvido exclusivamente para o seu objetivo."],
                ["4", "Acompanhamento", "Sua evolução é acompanhada de perto e o plano é ajustado sempre que necessário."],
                ["5", "Resultados", "Você evolui com mais segurança, consistência e confiança."],
              ].map(([n, t, d]) => (
                <li key={n} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#BA9E50] text-black font-bold mb-3">{n}</span>
                  <h3 className="text-white font-bold mb-1">{t}</h3>
                  <p className="text-gray-300 text-xs leading-relaxed">{d}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <WhatsButton label="Dar o primeiro passo agora" sub="Leva 2 minutos. Sem compromisso." />
            </div>
          </div>
        </section>

        {/* ───────────────────── 6+7. DIFERENCIAIS / COMPARATIVO ───────────────────── */}
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Por que escolher o Montinho Personal?
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-white/10 rounded-2xl p-7 bg-black/40">
                <h3 className="text-gray-300 font-bold uppercase text-xs tracking-[0.15em] mb-5" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Outros personais</h3>
                <ul className="space-y-3 text-gray-400 text-sm">
                  <li>❌ Utilizam treinos parecidos para diferentes alunos</li>
                  <li>❌ Pouco acompanhamento entre as aulas</li>
                  <li>❌ Ajustes esporádicos</li>
                  <li>❌ Foco apenas na aula</li>
                </ul>
              </div>
              <div className="border border-[#BA9E50]/50 rounded-2xl p-7 bg-[#BA9E50]/[0.06] shadow-[0_0_40px_rgba(186,158,80,0.08)]">
                <h3 className="text-[#BA9E50] font-bold uppercase text-xs tracking-[0.15em] mb-5" style={{ fontFamily: "var(--font-inter), sans-serif" }}>Montinho Personal</h3>
                <ul className="space-y-3 text-gray-200 text-sm">
                  <li>✅ Estratégia personalizada para cada aluno</li>
                  <li>✅ Acompanhamento contínuo</li>
                  <li>✅ Ajustes conforme sua evolução</li>
                  <li>✅ Suporte durante toda a jornada</li>
                  <li>✅ Foco em resultados consistentes</li>
                </ul>
              </div>
            </div>
            <div className="mt-10">
              <WhatsButton label="Quero o Método Montinho" />
            </div>
          </div>
        </section>

        {/* ───────────────────── PARA QUEM É ───────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Esse acompanhamento é ideal para você que...
            </h2>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {[
                "Quer emagrecer de forma saudável.",
                "Deseja ganhar massa muscular.",
                "Nunca treinou.",
                "Está voltando para a academia.",
                "Já tentou sozinho e não conseguiu manter resultados.",
                "Tem uma rotina corrida.",
                "Quer treinar com segurança.",
                "Mora em Alphaville, Tamboré, Barueri ou Santana de Parnaíba.",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4">
                  <span className="text-[#BA9E50] font-bold mt-0.5">✔</span>
                  <span className="text-gray-200 text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ───────────────────── 8. REGIÕES ───────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Regiões atendidas
            </h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto">
              Atendimento presencial em Alphaville, Tamboré, Barueri e Santana de
              Parnaíba — além de diversos condomínios e academias da região.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left mb-10">
              {[
                ["Alphaville", ["Residenciais 1 a 12", "Gênesis", "Alpha Conde", "Alpha Sítio", "Melville", "Burle Marx"]],
                ["Tamboré", ["Tamboré 1 a 11", "Quintas de Tamboré", "Valville", "Condomínios da região"]],
                ["Barueri", ["Centro", "Jardim Belval", "Vila Porto", "Região da Estação CPTM"]],
                ["Santana de Parnaíba", ["Aldeia da Serra", "Fazendinha", "Cidade São Pedro", "Centro Histórico"]],
              ].map(([city, areas]) => (
                <div key={city as string} className="border border-white/10 rounded-2xl p-6 bg-white/[0.02] hover:border-[#BA9E50]/40 transition-colors">
                  <h3 className="text-[#BA9E50] font-bold mb-3">📍 {city}</h3>
                  <ul className="space-y-1.5 text-gray-300 text-sm">
                    {(areas as string[]).map((a) => <li key={a}>{a}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div className="relative max-w-2xl mx-auto rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_center,rgba(186,158,80,0.12),transparent_70%)] py-10 px-6 mb-2">
              <span className="text-3xl">🗺️</span>
              <p className="text-white font-semibold mt-2">Base em Alphaville — atendimento em um raio de ~20 minutos</p>
              <p className="text-gray-300 text-sm mt-1">Tamboré a ~10 min · Centro de Barueri a ~15 min · Aldeia da Serra a ~20 min</p>
            </div>
            <p className="text-gray-400 text-sm mt-8">
              Seu condomínio não está na lista? Me chama — provavelmente eu atendo aí também.
            </p>
          </div>
        </section>

        {/* ───────────────────── 9. FAQ ───────────────────── */}
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Suas dúvidas, respondidas
            </h2>
            <div className="space-y-3">
              {faqLp.map((f) => (
                <details key={f.q} className="group border border-white/10 rounded-xl bg-black/40 open:border-[#BA9E50]/40 transition-colors">
                  <summary className="cursor-pointer list-none flex items-center justify-between px-6 py-4 text-white font-semibold">
                    {f.q}
                    <span className="text-[#BA9E50] group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                  </summary>
                  <p className="px-6 pb-5 text-gray-300 text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <div className="mt-10">
              <WhatsButton label="Tirar minha dúvida no WhatsApp" sub="Respondo pessoalmente, sem robô" />
            </div>
          </div>
        </section>

        {/* ───────────────────── 10. CTA FINAL ───────────────────── */}
        <section className="py-20 border-t border-white/10 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
            <div className="relative w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-2 border-[#BA9E50]">
              <Image src="/montinho-personal-trainer-shape.jpg" alt="Montinho Personal Trainer" fill loading="lazy" sizes="128px" className="object-cover" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-titulo), Georgia, serif" }}>
              Sua transformação pode<br className="hidden sm:block" /> começar hoje.
            </h2>
            <p className="text-gray-300 text-lg mb-4 max-w-xl mx-auto">
              Eu sei que dar o primeiro passo nem sempre é fácil. Também já estive
              desse lado. Por isso, meu compromisso é entender seus objetivos, criar
              um plano que faça sentido para sua rotina e acompanhar sua evolução de
              forma próxima.
            </p>
            <p className="text-gray-300 mb-10 max-w-xl mx-auto">
              Se você procura um Personal Trainer em Alphaville que realmente se
              importe com seus resultados, será um prazer conversar com você. Vamos
              entender seus objetivos e descobrir qual é a melhor estratégia para
              alcançar a transformação que você deseja.
            </p>
            <WhatsButton
              label="Quero começar minha transformação"
              sub="Respondo pessoalmente — geralmente em poucos minutos"
            />
            <p className="text-gray-400 text-xs mt-12">
              Montinho Personal Trainer · Alphaville, Barueri e Santana de Parnaíba · São Paulo
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
