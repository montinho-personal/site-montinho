import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { TRILHAS } from "@/lib/ferramentas/trilha";
import { BORDOES } from "@/lib/bordoes";
import RastreioComece from "@/components/comece/RastreioComece";

/**
 * /comece/treino — a LP do caminho do treino.
 *
 * Diferença estrutural para a LP da dieta: este caminho tem uma bifurcação
 * (tem treino / não tem treino) e três desembocaduras na conversa com o
 * Montinho — e a página as apresenta como o que são: os pontos onde o
 * gratuito termina de propósito, porque montar treino individual é o
 * trabalho dele. Honestidade sobre o modelo é o argumento de venda.
 */
export const metadata: Metadata = {
  title: "Como Começar a Treinar: o Caminho Completo em 5 Passos",
  description:
    "Do 'por onde eu começo?' à execução conferida em vídeo: diagnóstico, divisão de treino, volume, carga e técnica — 5 ferramentas gratuitas conectadas, sem cadastro, feitas por quem perdeu 40 kg.",
  alternates: { canonical: `${SITE_URL}/comece/treino` },
  openGraph: {
    title: "O Caminho do Treino — do zero à execução em 5 passos",
    description:
      "Por onde começo → qual divisão → volume certo → carga certa → técnica conferida em vídeo. Ferramentas gratuitas e conectadas.",
    url: `${SITE_URL}/comece/treino`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Comece Aqui", item: `${SITE_URL}/comece` },
    { "@type": "ListItem", position: 3, name: "O Caminho do Treino", item: `${SITE_URL}/comece/treino` },
  ],
};

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const sans = { fontFamily: "var(--font-inter), sans-serif" } as const;

const DETALHES: Record<string, { entrega: string; detalhe: string }> = {
  "/diagnostico": {
    entrega: "Seu perfil, seu gargalo e por onde começar",
    detalhe:
      "Nove perguntas sobre objetivo, rotina, experiência e o que te trava. No fim, você sabe qual perfil de treino combina com o seu momento e qual é o obstáculo real — que quase nunca é o que a pessoa imagina.",
  },
  "/treino-para-minha-rotina": {
    entrega: "A divisão de treino que cabe na SUA semana",
    detalhe:
      "Full body, upper/lower, ABC ou PPL — decidido pelos dias que você realmente tem, não pelos dias ideais de uma planilha. Com a semana desenhada e um plano B para quando a agenda apertar. É aqui que o caminho bifurca: quem já tem ficha segue conferindo; quem não tem descobre exatamente onde eu entro.",
  },
  "/ferramentas/calculadora-volume-treino": {
    entrega: "Quantas séries por músculo você REALMENTE faz",
    detalhe:
      "Você copia seu treino real e a ferramenta identifica os músculos, soma as séries semanais e mostra onde o volume concentra. Se algo estiver muito fora — 25 séries num grupo, 3 em outro — ela aponta, sem alarme e sem diagnóstico.",
  },
  "/ferramentas/calculadora-1rm": {
    entrega: "Quanto colocar na barra, anilha por anilha",
    detalhe:
      "Uma carga e suas repetições estimam seu 1RM e as cargas de 50% a 100% — com o calculador de anilhas dizendo o que montar de cada lado da barra, considerando as anilhas que a sua academia tem. Para usar entre uma série e outra.",
  },
  "/revisao-de-execucao": {
    entrega: "Sua execução conferida em vídeo — por mim, de graça",
    detalhe:
      "Carga certa com técnica errada é risco, não estímulo. Você grava uma série, me manda no WhatsApp, e eu mesmo assisto e devolvo os pontos de atenção. Sem custo, sem cadastro — porque ver a pessoa executando é o que nenhuma ferramenta consegue fazer.",
  },
};

export default function ComeceTreinoPage() {
  const { passos } = TRILHAS.treino;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <RastreioComece pagina="treino" />

      <section className="py-16 sm:py-20 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            O caminho do treino · 5 passos · gratuito
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-6" style={h}>
            Do &ldquo;por onde eu começo?&rdquo; à barra carregada com confiança
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Cinco passos em ordem: descubra seu perfil, monte a divisão que
            cabe na sua semana, confira seu volume, saiba a carga certa — e
            termine com a sua execução conferida em vídeo, por mim, de graça.
          </p>
        </div>
      </section>

      {/* ── A dor, na primeira pessoa ──────────────────────────────── */}
      <section className="py-12 border-b border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-300 leading-relaxed mb-3">
            Eu sei o que é entrar na academia sem saber o que fazer. Copiar o
            treino de um vídeo, trocar de ficha toda semana porque um
            influencer disse que a anterior estava errada, treinar muito e
            evoluir pouco — e concluir que o problema era eu. Fui o gordinho
            que tentava de tudo e se perdia em conteúdo solto que não
            explicava nada com clareza. Deus sabe que eu tentava.
          </p>
          <p className="text-gray-300 leading-relaxed">
            O problema não era eu. Era a{" "}
            <strong className="text-white">falta de uma ordem</strong>. Quando
            ela apareceu, vieram os 40 kg perdidos, o músculo, e a profissão.
            Este caminho é essa ordem — e no treino ela importa ainda mais que
            na dieta, porque errar aqui custa articulação, não só resultado.
          </p>
        </div>
      </section>

      {/* ── Os 5 passos ────────────────────────────────────────────── */}
      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10" style={h}>
            O caminho, passo a passo
          </h2>
          <ol className="space-y-8">
            {passos.map((p, i) => (
              <li key={p.href} className="border border-white/15 p-6 sm:p-7 relative">
                <div className="absolute top-0 left-0 h-[2px] w-12" style={{ background: "#BA9E50" }} aria-hidden="true" />
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: "#BA9E50", ...sans }}>
                  Passo {i + 1} — {p.pergunta}
                </p>
                <h3 className="text-white font-bold text-xl mb-2" style={h}>
                  {DETALHES[p.href]?.entrega ?? p.nome}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{DETALHES[p.href]?.detalhe}</p>
                <Link
                  href={p.href}
                  className="text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity"
                  style={{ textDecorationColor: "#BA9E50" }}
                >
                  Abrir o passo {i + 1}: {p.nome} →
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── A honestidade que vende ────────────────────────────────── */}
      <section className="py-12 border-b border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-4" style={h}>
            Onde o gratuito termina — dito com todas as letras
          </h2>
          <p className="text-gray-300 leading-relaxed mb-3">
            Nenhuma ferramenta aqui monta os exercícios do seu treino. Isso
            não é limitação — é honestidade: escolher exercícios, séries e
            progressão para o <em>seu</em> corpo, com a <em>sua</em> execução
            na frente, é trabalho individual. É o meu trabalho. As ferramentas
            te levam até a porta sabendo exatamente o que você precisa; quem
            atravessa a porta comigo atravessa sabendo o porquê.
          </p>
          <p className="text-gray-300 leading-relaxed">
            {/* BORDOES.chalala já traz o artigo ("o algo a mais..."). */}
            E {BORDOES.chalala}? {BORDOES.chalalaNaoEhSegredo} O caminho
            gratuito é o que funciona. O acompanhamento é o chalalá em cima
            dele.
          </p>
        </div>
      </section>

      {/* ── Fechamento ─────────────────────────────────────────────── */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xl sm:text-2xl text-white font-bold leading-snug mb-3" style={h}>
            &ldquo;{BORDOES.impossivelCompleta}&rdquo;
          </p>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto mb-8">{BORDOES.impossivelNaoEh}</p>
          <Link
            href={passos[0].href}
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 text-base font-semibold min-h-[52px] hover:opacity-90 transition-opacity"
          >
            Começar pelo passo 1 — {passos[0].pergunta}
            <span aria-hidden="true">→</span>
          </Link>
          <p className="text-gray-500 text-sm mt-6">
            O corpo também se constrói na cozinha:{" "}
            <Link href="/comece/dieta" className="text-gray-300 underline underline-offset-2 hover:text-white transition-colors">
              conheça o caminho da dieta
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
