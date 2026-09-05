import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOBILIDADE_NO_AR } from "@/lib/mobilidade/lancamento";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import TesteMobilidade from "@/components/mobilidade/TesteMobilidade";
import {
  FONTES,
  FONTE_DOSE,
  FONTE_FORCA,
  FONTE_KNEE_TO_WALL,
  FONTE_TRIAGEM,
  LIMITE_DO_TESTE,
  NAO_PRECISA_DOER,
  NAO_PREVINE_LESAO,
} from "@/lib/mobilidade/evidencia";
import { TESTES } from "@/lib/mobilidade/testes";
import { SEMANAS_ATE_RETESTE } from "@/lib/mobilidade/motor";
import Compartilhar from "@/components/share/Compartilhar";

/**
 * Destrave Seu Corpo — a página da ferramenta.
 *
 * "Destrave Seu Corpo" é o nome de marca; o H1 e o title dizem "Teste de
 * Mobilidade", que é o que as pessoas digitam. As duas coisas convivem: a
 * marca dá personalidade, o termo de busca traz gente.
 *
 * A ferramenta vem antes do conteúdo editorial porque quem chega aqui quer
 * fazer o teste, não ler sobre ele. O texto abaixo existe para o Google
 * entender a página, para quem quer conferir a metodologia antes de confiar, e
 * para linkar o acervo — mas nunca na frente de quem já decidiu agir.
 *
 * Só BreadcrumbList no schema. Nada de FAQPage: a página não é um FAQ, e
 * marcar como se fosse é o tipo de otimização que envelhece mal.
 */
export const metadata: Metadata = {
  title: "Teste de Mobilidade: Descubra Onde Você Pode Melhorar",
  description:
    "Cinco testes simples para descobrir quais amplitudes podem estar dificultando seus exercícios de musculação — e um protocolo de 6 minutos com 2 a 3 exercícios. Gratuito, sem cadastro.",
  alternates: { canonical: `${SITE_URL}/ferramentas/teste-mobilidade` },
  openGraph: {
    title: "Destrave Seu Corpo — Teste de Mobilidade do Montinho",
    description:
      "Cinco testes, um mapa das suas regiões e um protocolo curto de verdade. Mobilidade útil para quem treina, não flexibilidade de circo.",
    url: `${SITE_URL}/ferramentas/teste-mobilidade`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Ferramentas", item: `${SITE_URL}/ferramentas` },
    {
      "@type": "ListItem",
      position: 3,
      name: "Teste de Mobilidade",
      item: `${SITE_URL}/ferramentas/teste-mobilidade`,
    },
  ],
};

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln =
  "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function TesteMobilidadePage() {
  if (!MOBILIDADE_NO_AR) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-12 sm:py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Destrave seu corpo · gratuito · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Teste de Mobilidade: descubra onde você pode melhorar
          </h1>
          <Compartilhar
            contexto="tool"
            titulo="Teste de Mobilidade"
            caminho="/ferramentas/teste-mobilidade"
            local="tool_top"
            ferramenta="teste_mobilidade"
            aparencia="discreto"
            className="mb-5"
          />
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Cinco testes simples, cinco minutos. No fim você vê um mapa das suas
            regiões e recebe um protocolo com dois ou três exercícios — não doze.
          </p>
        </div>
      </section>

      {/* A ferramenta, imediatamente. */}
      <section className="py-10 sm:py-12 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <TesteMobilidade />
        </div>
      </section>

      {/* ── Conteúdo editorial ─────────────────────────────────────── */}
      <section className="py-14 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4" style={h}>
              Mobilidade útil para quem treina
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              O objetivo aqui não é te deixar flexível. É te dar amplitude
              suficiente para executar bem os exercícios da academia e os
              movimentos do dia a dia. São coisas diferentes, e confundir as
              duas é o que faz gente perder meia hora por dia alongando sem
              precisar.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Você não precisa virar contorcionista. Precisa conseguir agachar
              sem o calcanhar subir, levar o braço acima da cabeça sem arquear a
              lombar, e descer no stiff sem arredondar as costas. É isso que
              este teste procura.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Flexibilidade e mobilidade não são a mesma coisa
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              <strong className="text-white">Flexibilidade</strong> é o quanto
              uma articulação consegue chegar. <strong className="text-white">Mobilidade</strong>{" "}
              é conseguir chegar lá <em>e controlar</em> a posição.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Na prática: alguém pode ter a perna que sobe bem alto quando outra
              pessoa empurra, e mesmo assim não conseguir subir sozinho. A
              primeira coisa é flexibilidade; a segunda é mobilidade — e é a
              segunda que aparece na hora de agachar com uma barra nas costas.
              Por isso boa parte dos exercícios daqui é de movimento ativo, não
              de alongamento parado.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              O que o teste avalia
            </h2>
            <ul className="space-y-4">
              {TESTES.map((t) => (
                <li key={t.id} className="border-l-2 border-[#BA9E50]/50 pl-4">
                  <p className="text-white font-semibold mb-1">{t.nome}</p>
                  <p className="text-gray-300 text-sm leading-relaxed mb-1">{t.porqueImporta}</p>
                  <p className="text-gray-500 text-sm">
                    Pode influenciar: {t.influencia.join(", ")}.
                  </p>
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-sm leading-relaxed mt-5">
              Você não faz necessariamente todos. Se disser onde sente
              dificuldade, o teste mostra só os que mudam o seu protocolo — em
              geral três.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Quanto tempo leva para melhorar
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A revisão mais recente sobre dose de alongamento encontrou que o
              ganho de flexibilidade é maximizado por volta de{" "}
              <strong className="text-white">dez minutos por semana por região</strong>,
              divididos em cerca de três sessões. Mais que isso não acelerou
              nada nos estudos.
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              É por isso que o protocolo daqui é curto. Não é para ser fácil de
              vender — é o que a evidência mostra bastar. E tem uma parte que
              costuma surpreender: {NAO_PRECISA_DOER}
            </p>
            <p className="text-gray-300 leading-relaxed">
              O ciclo é de {SEMANAS_ATE_RETESTE} semanas, e depois você refaz os
              mesmos testes para comparar. Repetir os mesmos exercícios é de
              propósito: trocar toda semana impede você de aprender qualquer um
              direito e de perceber se mudou alguma coisa.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Alongar não é a única saída
            </h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              Uma meta-análise comparou treino de força com alongamento para
              ganho de amplitude e{" "}
              <strong className="text-white">não encontrou diferença entre os dois</strong>.
              Treinar em boa amplitude, com carga controlada, também aumenta
              amplitude.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Ou seja: você não precisa viver alongando. Se o seu agachamento
              vai fundo, seu remo vai completo e seu supino tem amplitude
              inteira, boa parte do trabalho já está feita dentro do treino. O
              protocolo entra onde falta — e sai quando não falta mais. Para
              organizar o treino em si, o{" "}
              <Link href="/treino-para-minha-rotina" className={ln}>
                Treino Para Minha Rotina
              </Link>{" "}
              monta a divisão da sua semana.
            </p>
          </div>

          {/* ── Metodologia ──────────────────────────────────────── */}
          <div id="metodologia" className="scroll-mt-24 border-t border-white/10 pt-10">
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Como este teste funciona
            </h2>
            <p className="text-gray-300 leading-relaxed mb-4">{LIMITE_DO_TESTE}</p>

            <h3 className="text-white font-bold text-lg mb-2 mt-6" style={h}>
              Por que estes cinco testes
            </h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              O teste de tornozelo é o mais forte da bateria: ele tem
              confiabilidade alta em estudos repetidos e valores de referência
              publicados — distâncias típicas entre 10 e 15 cm, com menos de 10
              cm descrito como restrição relevante. É por isso que ele é o único
              que aceita uma medida em centímetros.
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              Os outros quatro são razoáveis para autoavaliação, mas não têm uma
              norma universal. Então eles usam classificação funcional — bom o
              bastante para orientar treino, e assumidamente insuficiente para
              medir você contra uma tabela. Onde a literatura não estabelece um
              normal, esta ferramenta não inventa um.
            </p>

            <h3 className="text-white font-bold text-lg mb-2 mt-6" style={h}>
              Por que não existe nota de 0 a 100
            </h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              Porque somar cinco testes diferentes num número só produziria uma
              precisão que não existe — e um número que parece nota clínica sem
              ser. O que importa é o perfil: qual região pede trabalho agora.
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              Vale saber o motivo de fundo: escores compostos de triagem de
              movimento, mesmo os validados e estudados há décadas, não predizem
              lesão. {NAO_PREVINE_LESAO}
            </p>

            <h3 className="text-white font-bold text-lg mb-2 mt-6" style={h}>
              Por que o alongamento longo fica fora do pré-treino
            </h3>
            <p className="text-gray-300 leading-relaxed mb-3">
              Sustentar um alongamento por 60 segundos ou mais antes de treinar
              associou-se a queda de desempenho em torno de 4,6% nas revisões;
              abaixo de 60 segundos, a queda cai para cerca de 1,1% — irrelevante
              na prática. Por isso, se você escolher fazer antes do treino, o
              protocolo entrega movimento ativo, e o alongamento sustentado vai
              para os dias sem treino.
            </p>

            <h3 className="text-white font-bold text-lg mb-2 mt-6" style={h}>
              Limitações, ditas com todas as letras
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2 list-disc pl-5 mb-4">
              <li>Você é quem observa e responde — sem alguém conferindo, existe erro de medida.</li>
              <li>Não dá para saber se uma limitação é causa de alguma dificuldade sua. Associação não é causa.</li>
              <li>Amplitude varia muito entre pessoas por motivos que não se treinam, como o formato da articulação.</li>
              <li>Nada aqui investiga dor. Se dor é o seu caso, o caminho é avaliação individual.</li>
            </ul>

            <h3 className="text-white font-bold text-lg mb-2 mt-6" style={h}>
              Referências
            </h3>
            <ul className="space-y-3">
              {FONTES.map((f) => (
                <li key={f.url} className="text-gray-400 text-sm leading-relaxed">
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className={`text-gray-300 ${ln}`}>
                    {f.rotulo}
                  </a>
                  <span className="text-gray-500"> — {f.tipo}.</span> {f.resumo}
                </li>
              ))}
            </ul>
            <p className="text-gray-500 text-sm mt-6">
              Ferramenta criada por Montinho, personal trainer em Alphaville e
              Tamboré.{" "}
              <Link href="/minha-historia" className={ln}>
                Minha história
              </Link>
              . Última revisão do conteúdo: agosto de 2026.
            </p>
          </div>

          <div className="border-t border-white/10 pt-10">
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>
              Continue daqui
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Se o que te trouxe aqui foi a dificuldade no agachamento, o{" "}
              <Link href="/blog/dor-no-joelho-no-agachamento" className={ln}>
                guia sobre desconforto no joelho ao agachar
              </Link>{" "}
              cobre o resto do assunto. Se foi a execução em geral, a{" "}
              <Link href="/revisao-de-execucao" className={ln}>
                revisão de execução
              </Link>{" "}
              é onde eu assisto o seu vídeo e devolvo os pontos de atenção, de
              graça. E se você ainda está montando o treino,{" "}
              <Link href="/comece/treino" className={ln}>
                o caminho do treino
              </Link>{" "}
              organiza os cinco passos na ordem.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
