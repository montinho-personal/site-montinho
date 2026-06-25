import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade e LGPD",
  description:
    "Saiba como o Montinho Personal Trainer coleta, usa e protege seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).",
  robots: { index: true, follow: true },
};

export default function LGPD() {
  return (
    <section className="py-20 bg-black min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gray-400 mb-4">
            Privacidade & LGPD
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Política de Privacidade
          </h1>
          <p className="text-gray-400 text-sm">
            Última atualização: junho de 2025 &nbsp;·&nbsp; Em conformidade com
            a Lei nº 13.709/2018 (LGPD)
          </p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-gray-300 leading-relaxed">

          {/* 1 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              1. Quem somos
            </h2>
            <p>
              <strong className="text-white">Montinho Personal Trainer</strong>{" "}
              é um serviço de personal training e consultoria de emagrecimento
              operado por Renato Montinho, com atendimento presencial em
              Alphaville (Barueri e Santana de Parnaíba — SP) e consultoria
              online para todo o Brasil.
            </p>
            <p className="mt-2">
              Site:{" "}
              <a
                href="https://www.montinhopersonal.com.br"
                className="text-white underline underline-offset-2"
              >
                www.montinhopersonal.com.br
              </a>
              <br />
              Contacto:{" "}
              <a
                href="mailto:contato@montinhopersonal.com.br"
                className="text-white underline underline-offset-2"
              >
                contato@montinhopersonal.com.br
              </a>
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              2. Que dados recolhemos
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Dados de contacto</strong> —
                nome, número de telemóvel (WhatsApp) e e-mail fornecidos
                voluntariamente através do formulário de contato ou de mensagens
                diretas.
              </li>
              <li>
                <strong className="text-white">Dados de navegação</strong> —
                endereço IP, tipo de navegador, páginas visitadas e duração da
                visita, recolhidos via cookies analíticos (Google Analytics).
              </li>
              <li>
                <strong className="text-white">Dados de saúde</strong> (apenas
                clientes) — informações físicas e de histórico de saúde
                fornecidas na anamnese, necessárias para a prestação do serviço.
              </li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              3. Para que usamos os seus dados
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Responder às suas mensagens e pedidos de informação.</li>
              <li>Prestar o serviço de personal training e consultoria.</li>
              <li>
                Enviar comunicações relacionadas com o seu treino (via
                WhatsApp), com o seu consentimento.
              </li>
              <li>
                Melhorar o desempenho e a experiência do site através de dados
                analíticos anónimos.
              </li>
              <li>Cumprir obrigações legais aplicáveis.</li>
            </ul>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              4. Base legal (LGPD)
            </h2>
            <p>
              O tratamento dos seus dados baseia-se nas seguintes hipóteses
              previstas na LGPD:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong className="text-white">Consentimento</strong> (art. 7º,
                I) — para cookies não essenciais e comunicações de marketing.
              </li>
              <li>
                <strong className="text-white">Execução de contrato</strong>{" "}
                (art. 7º, V) — para dados necessários à prestação do serviço.
              </li>
              <li>
                <strong className="text-white">Legítimo interesse</strong> (art.
                7º, IX) — para análise do desempenho do site e melhoria do
                serviço.
              </li>
              <li>
                <strong className="text-white">Cumprimento de obrigação legal</strong>{" "}
                (art. 7º, II) — quando exigido por lei.
              </li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              5. Cookies
            </h2>
            <p>
              Utilizamos os seguintes tipos de cookies:
            </p>
            <div className="mt-3 space-y-3">
              <div className="border border-white/10 p-4">
                <p className="text-white font-medium text-sm mb-1">
                  Essenciais
                </p>
                <p className="text-sm">
                  Necessários para o funcionamento básico do site. Não podem
                  ser desativados.
                </p>
              </div>
              <div className="border border-white/10 p-4">
                <p className="text-white font-medium text-sm mb-1">
                  Analíticos (Google Analytics)
                </p>
                <p className="text-sm">
                  Permitem-nos perceber como os visitantes interagem com o
                  site. Os dados são agregados e anónimos. Apenas ativados com
                  o seu consentimento.
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm">
              Pode gerir as suas preferências de cookies a qualquer momento
              através do banner de cookies que aparece na primeira visita, ou
              limpando os dados do seu navegador.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              6. Partilha de dados com terceiros
            </h2>
            <p>
              Não vendemos nem partilhamos os seus dados pessoais com terceiros
              para fins comerciais. Os dados podem ser partilhados apenas com:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong className="text-white">Google LLC</strong> — para
                análise de tráfego (Google Analytics), com sede nos EUA,
                sujeito às cláusulas contratuais padrão da UE e às políticas
                de privacidade do Google.
              </li>
              <li>
                <strong className="text-white">Meta Platforms (WhatsApp)</strong>{" "}
                — para comunicação com clientes, conforme os termos de serviço
                do WhatsApp Business.
              </li>
              <li>
                Autoridades competentes, quando exigido por lei.
              </li>
            </ul>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              7. Por quanto tempo guardamos os seus dados
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Dados de contacto</strong> — até
                ao término da relação comercial ou mediante pedido de eliminação.
              </li>
              <li>
                <strong className="text-white">Dados de saúde</strong> — pelo
                período mínimo exigido por lei (em geral, 5 anos após o término
                do serviço).
              </li>
              <li>
                <strong className="text-white">Dados de navegação</strong> —
                até 26 meses (padrão Google Analytics).
              </li>
            </ul>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              8. Os seus direitos (LGPD, art. 18)
            </h2>
            <p>Como titular dos dados, tem direito a:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Confirmar se tratamos os seus dados pessoais.</li>
              <li>Aceder aos seus dados.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li>
                Solicitar a anonimização, bloqueio ou eliminação de dados
                desnecessários ou tratados em desconformidade com a LGPD.
              </li>
              <li>
                Revogar o consentimento a qualquer momento, sem prejuízo da
                licitude do tratamento anterior.
              </li>
              <li>
                Apresentar reclamação à Autoridade Nacional de Proteção de
                Dados (ANPD).
              </li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer um destes direitos, entre em contacto:{" "}
              <a
                href="mailto:contato@montinhopersonal.com.br"
                className="text-white underline underline-offset-2"
              >
                contato@montinhopersonal.com.br
              </a>
            </p>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              9. Segurança
            </h2>
            <p>
              Adotamos medidas técnicas e organizativas adequadas para proteger
              os seus dados contra acesso não autorizado, perda ou destruição,
              incluindo transmissão via HTTPS e acesso restrito a dados
              sensíveis.
            </p>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              10. Alterações a esta política
            </h2>
            <p>
              Podemos atualizar esta política periodicamente. A versão mais
              recente estará sempre disponível nesta página, com a data de
              atualização no topo. Em caso de alterações significativas,
              notificaremos os clientes ativos.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-white text-lg font-semibold mb-3">
              11. Contacto
            </h2>
            <p>
              Para questões sobre privacidade ou exercício dos seus direitos:
            </p>
            <p className="mt-2">
              <strong className="text-white">Montinho Personal Trainer</strong>
              <br />
              Alphaville, Barueri — SP, Brasil
              <br />
              E-mail:{" "}
              <a
                href="mailto:contato@montinhopersonal.com.br"
                className="text-white underline underline-offset-2"
              >
                contato@montinhopersonal.com.br
              </a>
              <br />
              WhatsApp: +55 11 98106-3409
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  );
}
