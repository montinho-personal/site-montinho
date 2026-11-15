import Image from "next/image";
import Link from "next/link";
import { RESULTADOS, type ResultadoItem } from "@/lib/resultados";
import { FILOSOFIAS } from "@/lib/filosofia";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import ComparadorAntesDepois from "./ComparadorAntesDepois";
import VitrineRastreio from "./VitrineRastreio";

/**
 * Vitrine de transformações: comparador do aluno em destaque, cartões dos
 * outros e o caminho para falar com o Montinho. Os dados são os da página
 * /resultados (lib/resultados.ts); nada aqui inventa número ou história.
 *
 * Uso numa página:
 *   <VitrineResultados
 *     pagina="personal-trainer-alphaville"
 *     introducao={<p>Texto curto e próprio da página…</p>}
 *     destaque="natalia-nascimento"        // opcional
 *     outros={["elisa-cruz", "bruna-rodrigues"]}  // opcional, define a ordem
 *     limite={3}                           // opcional, nº de cartões
 *   />
 *
 * Sem filtros nem categorias nesta versão: todos os resultados com foto
 * são de emagrecimento. Um campo de objetivo pode entrar em ResultadoItem
 * quando houver resultados de outro tipo.
 */

const COM_FOTOS = RESULTADOS.filter((r): r is ResultadoItem & { slug: string } => Boolean(r.vitrine && r.slug && r.photo));

const ouro = "#BA9E50";
const titulo = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;

export default function VitrineResultados({
  pagina,
  introducao,
  destaque,
  outros,
  limite = 3,
  mensagemWhatsApp = "Olá, Montinho! Vi os resultados dos seus alunos no site e queria saber como funciona o acompanhamento.",
  cta,
  semSaidas = false,
}: {
  /** Identificador da página: vai no rastreio e no data-cta-id do botão. */
  pagina: string;
  /** Texto curto e original da página, que contextualiza os resultados. */
  introducao?: React.ReactNode;
  destaque?: string;
  outros?: string[];
  limite?: number;
  mensagemWhatsApp?: string;
  /** Substitui o botão padrão (ex.: o LpCta das landing pages, que tem rastreio próprio). */
  cta?: React.ReactNode;
  /** Landing page de anúncio: sem link para /resultados nem /consultoria. */
  semSaidas?: boolean;
}) {
  const principal = COM_FOTOS.find((r) => r.slug === destaque) ?? COM_FOTOS[0];
  if (!principal?.vitrine) return null;
  const resto = (outros ? outros.map((s) => COM_FOTOS.find((r) => r.slug === s)).filter(Boolean) : COM_FOTOS)
    .filter((r): r is (typeof COM_FOTOS)[number] => Boolean(r) && r!.slug !== principal.slug)
    .slice(0, limite);
  const comparacao = FILOSOFIAS.find((f) => f.id === "comparacao");
  const [compAntes, compDepois = ""] = (comparacao?.texto ?? "").split("{link}");

  return (
    <VitrineRastreio
      pagina={pagina}
      ariaLabelledby={`vitrine-${pagina}`}
      className="py-16 sm:py-20 border-t border-white/10"
      style={{ background: "#0d0d0d" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: ouro }}>
            Resultados reais
          </p>
          <h2 id={`vitrine-${pagina}`} className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-5" style={titulo}>
            Resultados reais. Transformações de verdade.
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed font-light">
            Cada pessoa tem seu ponto de partida. Conheça histórias reais de alunos que decidiram transformar a rotina com acompanhamento personalizado.
          </p>
          {introducao && <div className="mt-5 space-y-4 text-gray-300 leading-relaxed font-light">{introducao}</div>}
        </div>

        {/* Destaque: comparador + história */}
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14 items-center">
          <div className="w-full max-w-[420px] mx-auto lg:mx-0">
            <ComparadorAntesDepois
              fotos={principal.vitrine}
              nome={principal.name}
              slug={principal.slug}
              pagina={pagina}
              altAntes={`Antes: ${principal.name} no início do acompanhamento com o Montinho`}
              altDepois={`Depois: ${principal.name}${principal.duration ? ` após ${principal.duration} de acompanhamento` : " depois do acompanhamento"} (${principal.result})`}
            />
          </div>

          <article>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: ouro }}>
              História real
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight" style={titulo}>
              {principal.name}
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              {principal.age} · {principal.modality}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-px bg-white/10 border border-white/10 max-w-md">
              <div className="bg-[#0d0d0d] p-4">
                <dt className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Resultado</dt>
                <dd className="mt-1 text-3xl font-bold" style={{ ...titulo, color: ouro }}>{principal.result}</dd>
              </div>
              {principal.duration && (
                <div className="bg-[#0d0d0d] p-4">
                  <dt className="text-[11px] uppercase tracking-[0.18em] text-gray-400">Acompanhamento</dt>
                  <dd className="mt-1 text-3xl font-bold text-white" style={titulo}>{principal.duration}</dd>
                </div>
              )}
            </dl>

            <p className="mt-6 text-gray-300 leading-relaxed">{principal.description}</p>
            <blockquote className="mt-6 border-l-2 pl-4" style={{ borderColor: ouro }}>
              <p className="text-white italic leading-relaxed">&ldquo;{principal.quote}&rdquo;</p>
              <footer className="mt-2 text-sm text-gray-400">— {principal.name}</footer>
            </blockquote>
          </article>
        </div>

        {/* Outras transformações */}
        {resto.length > 0 && (
          <div className="mt-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-6" style={{ color: ouro }}>
              Outras transformações
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resto.map((r) => (
                <article key={r.slug} className="border border-white/10 bg-black flex flex-col">
                  <div className="aspect-square bg-black">
                    <Image
                      src={r.photo!}
                      alt={`Antes e depois de ${r.name}${r.duration ? `, ${r.duration} de acompanhamento` : ""}: ${r.result}`}
                      width={600}
                      height={600}
                      sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 92vw"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-white font-semibold">{r.name}</h3>
                      <p className="font-bold text-lg whitespace-nowrap" style={{ ...titulo, color: ouro }}>{r.result}</p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {[r.age, r.duration && `${r.duration} de acompanhamento`].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-4 text-sm text-gray-300 leading-relaxed line-clamp-4">{r.description}</p>
                    <p className="mt-4 text-sm text-gray-300 italic leading-relaxed">&ldquo;{r.quote}&rdquo;</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {!semSaidas && (
        <p className="mt-8">
          <Link
            href="/resultados"
            data-vitrine-acao="resultados"
            className="text-white underline underline-offset-4 hover:text-gray-300"
          >
            Ver todas as transformações e histórias
          </Link>
        </p>
        )}

        {/* Não se compare + CTA */}
        <div className="mt-14 grid gap-10 lg:grid-cols-2 items-start">
          {comparacao && (
            <aside className="border-l-2 pl-5" style={{ borderColor: ouro }} aria-label="Nota do Montinho">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase mb-2" style={{ color: ouro }}>
                {comparacao.titulo}
              </p>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {compAntes}
                {semSaidas ? (
                  "acompanhamento personalizado"
                ) : (
                  <Link href="/consultoria" className="text-white underline underline-offset-4 hover:text-gray-300">
                    acompanhamento personalizado
                  </Link>
                )}
                {compDepois}
              </p>
            </aside>
          )}
          <div className="border border-white/15 bg-black p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-white leading-tight" style={titulo}>
              Sua transformação também pode começar com o primeiro passo.
            </h3>
            <p className="mt-3 text-gray-300 leading-relaxed">
              Conheça o acompanhamento personalizado do Montinho e descubra uma estratégia de treino adaptada à sua realidade.
            </p>
            {cta ? <div className="mt-6" data-vitrine-acao="cta">{cta}</div> : (
            <a
              href={getWhatsAppUrl(mensagemWhatsApp)}
              data-wa-origem="vitrine"
              data-cta-id={`${pagina}:vitrine`}
              data-vitrine-acao="cta"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-3 bg-white text-black px-8 py-4 text-sm sm:text-base font-semibold uppercase tracking-wide hover:bg-gray-100 transition-colors duration-200"
            >
              Quero começar minha transformação
            </a>
            )}
            <p className="mt-4 text-xs text-gray-400">
              Resultados individuais: cada pessoa tem o próprio ponto de partida e o próprio ritmo. Nenhum resultado é garantido.
            </p>
          </div>
        </div>
      </div>
    </VitrineRastreio>
  );
}
