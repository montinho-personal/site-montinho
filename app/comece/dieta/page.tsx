import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { TRILHAS } from "@/lib/ferramentas/trilha";
import { BORDOES } from "@/lib/bordoes";
import RastreioComece from "@/components/comece/RastreioComece";

/**
 * /comece/dieta — a LP do caminho da dieta.
 *
 * A intenção de busca é "como começar uma dieta / montar minha dieta
 * sozinho" — e a página responde de verdade: os quatro passos, o que a
 * pessoa sai tendo em cada um, e a promessa técnica que nenhum concorrente
 * faz (os dados atravessam sozinhos, a conta é aberta). Os detalhes por
 * passo vivem aqui; nome, pergunta e ordem vêm de TRILHAS — fonte única.
 */
export const metadata: Metadata = {
  title: "Como Começar uma Dieta: o Caminho Completo em 4 Passos",
  description:
    "Do 'não sei quanto comer' ao cardápio com lista de compras: 4 ferramentas gratuitas conectadas — gasto, meta, macros e cardápio — com seus dados atravessando sozinhos. Sem cadastro, com a conta aberta.",
  alternates: { canonical: `${SITE_URL}/comece/dieta` },
  openGraph: {
    title: "O Caminho da Dieta — do zero ao cardápio em 4 passos",
    description:
      "Quanto eu gasto → quanto eu como → como distribuo → o que boto no prato. Ferramentas gratuitas e conectadas, sem cadastro.",
    url: `${SITE_URL}/comece/dieta`,
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
    { "@type": "ListItem", position: 3, name: "O Caminho da Dieta", item: `${SITE_URL}/comece/dieta` },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const sans = { fontFamily: "var(--font-inter), sans-serif" } as const;

/** O que cada passo entrega — a copy da LP, por cima da trilha canônica. */
const DETALHES: Record<string, { entrega: string; detalhe: string }> = {
  "/ferramentas/calculadora-tmb-tdee": {
    entrega: "Seu gasto diário estimado, com a conta aberta",
    detalhe:
      "Antes de decidir quanto comer, você precisa saber quanto gasta. Peso, altura, idade e rotina — em 30 segundos você vê seu metabolismo em repouso e seu gasto do dia inteiro, com a fórmula à mostra (Mifflin-St Jeor, a mesma dos estudos).",
  },
  "/ferramentas/calculadora-deficit-calorico": {
    entrega: "Sua meta de calorias, no tamanho de corte que VOCÊ escolher",
    detalhe:
      "Seu gasto chega aqui já preenchido. Você compara três faixas de déficit — leve, moderada, maior — vê o que cada uma exige, e escolhe. Nada de 'corte 500 kcal' igual para todo mundo: percentual escala com o seu caso.",
  },
  "/ferramentas/calculadora-macros": {
    entrega: "Proteína, carboidrato e gordura — o orçamento fechado",
    detalhe:
      "A meta vira gramas: quanto de proteína pelo seu peso, quanta gordura, e o carboidrato se ajustando na hora quando você mexe nos outros dois. É aqui que você entende que os três dividem o mesmo orçamento — a lição que a maioria leva anos para aprender.",
  },
  "/ferramentas/monte-seu-cardapio": {
    entrega: "Um cardápio com comida de verdade + lista de compras",
    detalhe:
      "O Montinho FitChef transforma os números em prato: porções caseiras (1 ovo, 1 concha — nunca '137 g de banana'), priorizando o que você já come, com substituições, plano semanal e lista de compras pronta. É onde o papel vira prática.",
  },
};

export default function ComeceDietaPage() {
  const { passos } = TRILHAS.dieta;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <RastreioComece pagina="dieta" />

      <section className="py-16 sm:py-20 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            O caminho da dieta · 4 passos · gratuito
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-6" style={h}>
            Do &ldquo;não sei quanto comer&rdquo; ao cardápio na sua mão
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Quatro perguntas, quatro ferramentas, uma ordem que faz sentido —
            e seus dados atravessando sozinhos de uma para a outra. No fim,
            você sai com um cardápio de comida brasileira e a lista de compras
            da semana. Sem cadastro, sem pegadinha.
          </p>

          {/* O botão no HERÓI, e não só no rodapé.
              A página é narrativa de propósito — a história antes dos passos
              é o que constrói confiança em quem chega em dúvida. Mas quem
              chega já decidido não deveria rolar oitenta por cento da página
              para achar por onde entrar. O par atende os dois: o botão serve
              quem quer começar, a âncora serve quem quer entender antes. */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
            <Link
              href={passos[0].href}
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 text-base font-semibold min-h-[52px] hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Começar agora — passo 1
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href="#passos"
              className="text-gray-300 text-sm underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors min-h-[44px] inline-flex items-center"
            >
              Ver os {passos.length} passos antes
            </a>
          </div>
        </div>
      </section>

      {/* ── A dor, na primeira pessoa ──────────────────────────────── */}
      <section className="py-12 border-b border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-300 leading-relaxed mb-3">
            Eu já estive do seu lado da tela. Pesquisando &ldquo;quantas
            calorias devo comer&rdquo; à meia-noite, abrindo cinco abas que se
            contradiziam, anotando uma dieta de revista que não tinha nada a
            ver com a comida da minha casa — e desistindo na quarta-feira.
            Tentando de novo no mês seguinte, por outro conteúdo solto,
            confuso, que não explicava o porquê de nada.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Quando eu entendi a <strong className="text-white">ordem</strong> —
            gasto, meta, distribuição, prato — perdi mais de 40 kg. Não porque
            achei um segredo: {BORDOES.chalalaNaoEhSegredo.toLowerCase().replace(/\.$/, "")}.
            O caminho abaixo é essa ordem, transformada em ferramentas que
            fazem as contas por você.
          </p>
        </div>
      </section>

      {/* ── Os 4 passos ────────────────────────────────────────────── */}
      <section id="passos" className="py-14 bg-black border-b border-white/10 scroll-mt-20">
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

      {/* ── E quem quer ganhar massa? ──────────────────────────────── */}
      <section className="py-12 border-b border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-4" style={h}>
            Quero ganhar massa, não emagrecer. Serve para mim?
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Serve — o passo 1 pergunta seu objetivo e o caminho se adapta: em
            vez de déficit, você planeja um superávit moderado (a mesma faixa
            que os estudos e os artigos daqui ensinam), os macros usam a
            referência de proteína para ganho, e o cardápio sai no modo
            ganho. No final, o caminho te entrega no treino — porque superávit
            sem treino de força vira gordura, não músculo.
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
            Também existe{" "}
            <Link href="/comece/treino" className="text-gray-300 underline underline-offset-2 hover:text-white transition-colors">
              o caminho do treino
            </Link>{" "}
            — e os dois se encontram.
          </p>
        </div>
      </section>
    </>
  );
}
