import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/blog";
import { ACADEMIAS } from "@/lib/academias/base";
import { completude } from "@/lib/academias/tipos";
import AcademiaQuiz from "@/components/academias/AcademiaQuiz";

/**
 * Academia Ideal em Alphaville.
 *
 * NOINDEX E FORA DO MENU DE PROPÓSITO enquanto a base de dados não estiver
 * preenchida. A ferramenta funciona, mas recomendar com atributos "não
 * confirmado" entregaria exatamente o oposto do que ela promete. Assim que
 * `npx tsx scripts/academias-test.ts` acusar 60%+ de completude, basta remover
 * o bloco `robots` abaixo e adicionar a página ao sitemap e ao menu.
 */
export const metadata: Metadata = {
  title: "Qual Academia de Alphaville Combina com Você?",
  description:
    "Musculação, 24 horas, estacionamento, localização ou aulas? Responda algumas perguntas e descubra quais academias de Alphaville combinam mais com a sua rotina.",
  alternates: { canonical: `${SITE_URL}/academia-ideal-alphaville` },
  robots: { index: false, follow: true },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Academia Ideal em Alphaville", item: `${SITE_URL}/academia-ideal-alphaville` },
  ],
};

const h = { fontFamily: "var(--font-playfair), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";

export default function AcademiaIdealPage() {
  const total = ACADEMIAS.reduce((acc, a) => acc + completude(a).total, 0);
  const preenchidos = ACADEMIAS.reduce((acc, a) => acc + completude(a).preenchidos, 0);
  const pronta = preenchidos / total >= 0.6;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <section className="py-14 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-5" style={{ color: "#BA9E50" }}>
            Gratuito · sem cadastro
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5" style={h}>
            Qual academia de Alphaville combina com você?
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-3">
            Em Alphaville existem várias boas academias. A questão é outra: qual
            delas é boa <strong className="text-white">para você</strong>?
          </p>
          <p className="text-gray-400 text-base leading-relaxed">
            O Google Maps mostra onde as academias estão. Aqui você descobre qual
            faz sentido para a sua rotina — e por quê.
          </p>
        </div>
      </section>

      {!pronta && (
        <section className="py-6 bg-black">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="border-l-2 pl-5 py-1" style={{ borderColor: "#BA9E50" }}>
              <p className="text-white font-semibold mb-1">Ferramenta em preparação</p>
              <p className="text-gray-300 text-sm leading-relaxed">
                As informações de horário, estrutura e valores de cada unidade
                ainda estão sendo verificadas uma a uma. Enquanto isso o
                comparador funciona, mas com muitos itens marcados como &ldquo;não
                confirmado&rdquo;. Prefira as{" "}
                <Link href="/blog" className={ln}>análises individuais de cada academia</Link>.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="py-10 bg-black">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <AcademiaQuiz />
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Como funciona a recomendação</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              A ferramenta <strong className="text-white">não elege a melhor academia de
              Alphaville</strong> — essa pergunta não tem resposta única. Ela compara o
              que você marcou como prioridade com informações verificáveis sobre
              cada unidade e mostra as que mais se encaixam, listando critério por
              critério o que bate e o que não bate.
            </p>
            <p className="text-gray-300 leading-relaxed mb-3">
              Três regras que o motor segue, e que você confere no resultado:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
              <li>
                <strong className="text-white">Informação não confirmada nunca elimina
                ninguém.</strong> Se não sabemos se uma unidade abre 24h, ela continua
                aparecendo — marcada como &ldquo;não confirmado&rdquo;. Descartar por buraco no
                nosso dado seria punir a academia pelo nosso desconhecimento.
              </li>
              <li>
                <strong className="text-white">Só critério essencial elimina</strong>, e apenas
                contra informação confirmada. Uma unidade que sabidamente fecha às
                22h sai para quem só consegue treinar depois das 23h.
              </li>
              <li>
                <strong className="text-white">Nada de nota de qualidade.</strong> Você vê
                &ldquo;7 de 9 critérios atendidos&rdquo;, não &ldquo;compatibilidade 94,7%&rdquo;. Percentual
                com casa decimal dá aparência de ciência para o que é só uma conta
                de critérios.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>De onde vêm as informações</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              De três origens, e cada atributo guarda a sua: o que a própria
              academia publica oficialmente, listagens de plataformas como Wellhub
              e TotalPass, e a verificação direta do Montinho, que atende alunos
              dentro dessas academias e conhece a região.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Todo dado carrega a data em que foi verificado. Horário e preço mudam
              — quando não conseguimos confirmar algo, dizemos &ldquo;não confirmado&rdquo; em
              vez de estimar. Nenhum valor aqui é chute.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Localização ou estrutura: o que pesa mais?</h2>
            <p className="text-gray-300 leading-relaxed">
              Depende, mas há um ponto que a maioria subestima. Equipamento importa
              e estrutura importa — só que a academia perfeita a 40 minutos da sua
              rotina costuma perder para uma boa academia a 5 minutos, por um
              motivo simples: você consegue ir. Em Alphaville, com o trânsito de
              fim de tarde no Centro Industrial e Empresarial, isso pesa ainda
              mais. Considere o deslocamento no seu horário real, não no horário
              vazio.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Por que visitar no seu horário habitual</h2>
            <p className="text-gray-300 leading-relaxed">
              Essa é a dica que mais evita arrependimento. Uma academia às 14h pode
              ser irreconhecível às 19h — fila no supino, esteira lotada, aula
              coletiva ocupando o espaço. Antes de assinar qualquer plano, faça a
              aula experimental exatamente no horário em que você pretende treinar.
              É o único jeito de saber como vai ser a sua rotina de verdade.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Encontrou informação desatualizada?</h2>
            <p className="text-gray-300 leading-relaxed">
              Horário mudou, o convênio saiu, a unidade reformou? Me avise pelo{" "}
              <Link href="/contato" className={ln}>contato</Link> — toda correção é
              revisada por mim antes de entrar, nunca aplicada automaticamente.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4" style={h}>Já escolheu a academia?</h2>
            <p className="text-gray-300 leading-relaxed">
              A academia é o lugar; o treino é a estratégia. Se quiser ajuda com o
              que fazer lá dentro, existe o{" "}
              <Link href="/consultoria" className={ln}>acompanhamento presencial em Alphaville</Link>{" "}
              e a consultoria online. E se a dúvida agora é como encaixar os
              treinos na semana, o{" "}
              <Link href="/treino-para-minha-rotina" className={ln}>Treino Para Minha Rotina</Link>{" "}
              resolve em um minuto.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
