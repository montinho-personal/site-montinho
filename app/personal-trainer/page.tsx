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
    q: "Quanto custa o acompanhamento?",
    a: "O valor depende do formato (presencial ou consultoria online), da frequência semanal e do local de atendimento. Na primeira conversa pelo WhatsApp eu entendo seu objetivo e te passo uma proposta clara, sem compromisso.",
  },
  {
    q: "Como funciona a primeira conversa?",
    a: "É uma conversa simples pelo WhatsApp: você conta seu objetivo, sua rotina e seu histórico. Sem pressão e sem compromisso — o objetivo é entender se posso te ajudar de verdade.",
  },
  {
    q: "Você atende dentro do meu condomínio?",
    a: "Sim. Atendo na academia do condomínio, em casa ou em áreas comuns — em Alphaville, Tamboré, Barueri e Santana de Parnaíba. Levo equipamentos portáteis quando necessário.",
  },
  {
    q: "Posso treinar na minha academia com você?",
    a: "Sim. Acompanho alunos nas principais academias da região. Se você já tem matrícula, aproveitamos a estrutura que você já paga.",
  },
  {
    q: "Atende iniciantes que nunca treinaram?",
    a: "Sim — e é um dos públicos que mais atendo. Você não precisa 'estar em forma' para começar. Começamos do seu ponto atual, no seu ritmo, com segurança.",
  },
  {
    q: "Atende pessoas mais velhas ou com dores?",
    a: "Sim. Tenho cursos voltados para treino de pessoas com dores e limitações, e adapto cada exercício à sua condição. Treino seguro é a base do método.",
  },
  {
    q: "Quais horários você tem disponíveis?",
    a: "Atendo de segunda a sábado, em horários que se encaixam na rotina de quem trabalha — manhã cedo, horário de almoço e fim de tarde. Me chame no WhatsApp para ver a agenda da semana.",
  },
  {
    q: "Em quanto tempo vejo resultado?",
    a: "Disposição e força melhoram nas primeiras semanas. Mudanças visíveis de composição corporal costumam aparecer entre o 2º e o 3º mês, com constância. Não prometo milagre — prometo método.",
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
      {sub && <p className="text-gray-400 text-sm mt-3">{sub}</p>}
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
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                Perca peso e ganhe saúde com quem já{" "}
                <span className="text-[#BA9E50]">esteve do outro lado</span>.
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-4 max-w-lg">
                Eu já fui obeso. Perdi mais de 40kg sem fórmula mágica — e há mais
                de 20 anos ajudo pessoas como você a fazerem o mesmo, com método,
                segurança e acompanhamento de verdade.
              </p>
              <p className="text-gray-400 text-sm mb-8">
                📍 Atendimento em <strong className="text-gray-200">Alphaville, Tamboré, Barueri e Santana de Parnaíba</strong> — em casa, no condomínio ou na sua academia.
              </p>
              <WhatsButton
                label="Quero começar — falar no WhatsApp"
                sub="Resposta rápida · Primeira conversa sem compromisso"
              />
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-5 text-sm text-gray-300">
                <Stars />
                <span>
                  <strong className="text-white">5.0</strong> no Google · {testimonials.totalReviews} avaliações
                </span>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/foto-hero.jpg"
                  alt="Montinho, personal trainer em Alphaville"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────── 2. PROVA SOCIAL ───────────────────── */}
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Resultados de quem confiou
            </h2>
            <p className="text-center text-gray-400 mb-12">Pessoas reais, da sua região, com rotinas tão corridas quanto a sua.</p>

            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
              {["/antes-depois.jpg", "/antes-depois-montinho-personal-trainer.jpg"].map((src) => (
                <div key={src} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
                  <Image src={src} alt="Antes e depois de aluno do Montinho Personal Trainer" fill loading="lazy" sizes="(max-width: 640px) 90vw, 400px" className="object-cover" />
                </div>
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
                    <span className="text-gray-500"> · Avaliação no Google</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <WhatsButton label="Quero resultados assim" />
          </div>
        </section>

        {/* ───────────────────── 3. BENEFÍCIOS ───────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              O que muda na sua vida
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                ["Emagreça com estratégia", "Sem dieta maluca e sem viver de salada. Um plano que cabe na sua rotina — e que você consegue manter depois."],
                ["Ganhe músculos com inteligência", "Treino certo, na dose certa. Você para de 'ir na academia' e começa a evoluir de verdade, semana após semana."],
                ["Treine sem medo de lesão", "Cada exercício adaptado ao seu corpo e histórico. Quem tem dor não precisa parar — precisa treinar certo."],
                ["Energia para o dia inteiro", "Disposição para o trabalho, para a família e para a vida. É o primeiro resultado que aparece — em semanas."],
                ["Evolução acompanhada", "Você nunca fica perdido: reavaliações periódicas mostram preto no branco o que está funcionando."],
                ["Suporte de verdade", "Dúvida no meio da semana? Me chama. O acompanhamento não termina quando a sessão acaba."],
              ].map(([t, d]) => (
                <div key={t} className="bg-white/[0.03] border border-white/10 rounded-2xl p-7 hover:border-[#BA9E50]/40 transition-colors duration-300">
                  <span className="text-[#25D366] text-xl">✔</span>
                  <h3 className="text-white font-bold text-lg mt-3 mb-2">{t}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────── 4. HISTÓRIA ───────────────────── */}
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-4xl mx-auto px-5 sm:px-8 grid md:grid-cols-5 gap-10 items-center">
            <div className="md:col-span-2 relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10">
              <Image src="/foto-historia.jpg" alt="Montinho antes da transformação de mais de 40kg" fill loading="lazy" sizes="(max-width: 768px) 80vw, 320px" className="object-cover" />
            </div>
            <div className="md:col-span-3">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                Eu sei exatamente como você se sente.
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Porque eu já estive aí: acima do peso, sem energia, tentando dietas
                que não duravam e treinos que não funcionavam.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Foram <strong className="text-white">mais de 40kg eliminados</strong> — não com sorte,
                mas com o método que refinei ao longo de mais de 20 anos e que hoje
                aplico em cada aluno.
              </p>
              <p className="text-gray-300 leading-relaxed mb-6">
                Quando eu digo que entendo sua dificuldade, não é frase de vendedor.
                É memória.
              </p>
              <p className="text-[#BA9E50] font-semibold italic">
                &ldquo;Não vendo fórmula mágica. Divido o caminho que eu mesmo percorri.&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* ───────────────────── 5. COMO FUNCIONA ───────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Simples assim
            </h2>
            <ol className="grid sm:grid-cols-5 gap-4 text-center">
              {[
                ["1", "Conversa", "Você me chama no WhatsApp e conta seu objetivo."],
                ["2", "Avaliação", "Entendo seu corpo, rotina e histórico."],
                ["3", "Plano", "Estratégia desenhada para você — não um PDF genérico."],
                ["4", "Treinos", "Em casa, no condomínio ou na sua academia."],
                ["5", "Evolução", "Ajustes constantes até o resultado — e além."],
              ].map(([n, t, d]) => (
                <li key={n} className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#BA9E50] text-black font-bold mb-3">{n}</span>
                  <h3 className="text-white font-bold mb-1">{t}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{d}</p>
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
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Por que alunos escolhem (e ficam)
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-white/10 rounded-2xl p-7 bg-black/40">
                <h3 className="text-gray-400 font-bold uppercase text-xs tracking-[0.15em] mb-5">Acompanhamento comum</h3>
                <ul className="space-y-3 text-gray-500 text-sm">
                  <li>❌ Treino genérico copiado de aluno para aluno</li>
                  <li>❌ Atenção que termina quando a aula acaba</li>
                  <li>❌ Meses fazendo a mesma planilha</li>
                  <li>❌ Nenhuma medição de progresso</li>
                  <li>❌ Foco em contar repetições</li>
                </ul>
              </div>
              <div className="border border-[#BA9E50]/50 rounded-2xl p-7 bg-[#BA9E50]/[0.06] shadow-[0_0_40px_rgba(186,158,80,0.08)]">
                <h3 className="text-[#BA9E50] font-bold uppercase text-xs tracking-[0.15em] mb-5">Método Montinho</h3>
                <ul className="space-y-3 text-gray-200 text-sm">
                  <li>✅ Estratégia individual, do seu corpo para o seu objetivo</li>
                  <li>✅ Suporte contínuo pelo WhatsApp entre as sessões</li>
                  <li>✅ Ajustes frequentes conforme você evolui</li>
                  <li>✅ Reavaliações periódicas com dados reais</li>
                  <li>✅ Foco em resultado — e em mantê-lo</li>
                  <li>✅ De quem viveu na pele a transformação que você busca</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────── 8. REGIÕES ───────────────────── */}
        <section className="py-16 border-t border-white/10">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Atendimento onde você está
            </h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
              Presencial em toda a região de Alphaville — na sua casa, na academia do
              seu condomínio ou na academia onde você já treina.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Alphaville", "Tamboré", "Barueri", "Santana de Parnaíba",
                "Residenciais Alphaville", "Tamboré 1 a 11", "Gênesis", "Alpha Conde",
                "Alpha Sítio", "Melville", "Valville", "Burle Marx", "Aldeia da Serra", "Quintas de Tamboré",
              ].map((r) => (
                <span key={r} className="border border-white/15 rounded-full px-5 py-2 text-sm text-gray-300 bg-white/[0.03]">
                  📍 {r}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-8">
              Seu condomínio não está na lista? Me chama — provavelmente eu atendo aí também.
            </p>
          </div>
        </section>

        {/* ───────────────────── 9. FAQ ───────────────────── */}
        <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <h2 className="text-center text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Suas dúvidas, respondidas
            </h2>
            <div className="space-y-3">
              {faqLp.map((f) => (
                <details key={f.q} className="group border border-white/10 rounded-xl bg-black/40 open:border-[#BA9E50]/40 transition-colors">
                  <summary className="cursor-pointer list-none flex items-center justify-between px-6 py-4 text-white font-semibold">
                    {f.q}
                    <span className="text-[#BA9E50] group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                  </summary>
                  <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ───────────────────── 10. CTA FINAL ───────────────────── */}
        <section className="py-20 border-t border-white/10 relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
            <div className="relative w-32 h-32 mx-auto mb-8 rounded-full overflow-hidden border-2 border-[#BA9E50]">
              <Image src="/montinho-personal-trainer-shape.jpg" alt="Montinho Personal Trainer" fill loading="lazy" sizes="128px" className="object-cover" />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Daqui a 3 meses, você vai desejar<br className="hidden sm:block" /> ter começado hoje.
            </h2>
            <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
              A primeira conversa não custa nada — nem dinheiro, nem compromisso.
              Só uma mensagem separa você do plano que finalmente funciona.
            </p>
            <WhatsButton
              label="Falar com o Montinho agora"
              sub="🟢 Online — respondo pessoalmente"
            />
            <p className="text-gray-600 text-xs mt-12">
              Montinho Personal Trainer · Alphaville, Barueri e Santana de Parnaíba · São Paulo
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
