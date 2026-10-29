import { getWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Pacote flexível: 10 aulas presenciais para usar quando a pessoa decidir.
 *
 * Até 29/10/2026 o serviço existia no CRM e na agenda do Montinho, mas no
 * site era uma linha numa lista de planos de quatro páginas regionais. Quem
 * viaja ou não tem dia fixo lia "personal trainer", entendia "três vezes por
 * semana no mesmo horário" e ia embora. O Montinho pediu que o pacote
 * aparecesse com o mesmo peso da consultoria e do presencial.
 *
 * O que a copy promete, e só isso: 10 aulas presenciais, a pessoa decide
 * quando usar, dá para parcelar, a consultoria online inteira inclusa
 * (descrição do plano no CRM). O argumento central, pedido pelo Montinho:
 * as duas coisas se completam. A aula ensina técnica, percepção de falha e
 * cabeça de treino; a consultoria segura os dias sozinho, e o treino sozinho
 * depois de uma aula rende mais. Sem valor. Sem "sem prazo": o prazo é combinado na venda.
 * Os ritmos listados são exemplos, e o texto diz isso com todas as letras.
 * As desvantagens ficam visíveis: quem compra sabendo que o horário não fica
 * reservado não se frustra na primeira semana cheia.
 */

export const MENSAGEM_PACOTE_FLEXIVEL =
  "Olá, Montinho! Vi o Pacote Flexível de 10 aulas no site e queria saber se ele encaixa na minha rotina.";

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ouro = "#BA9E50";

const PARA_QUEM = [
  {
    titulo: "Vive viajando",
    texto: "Uma semana em casa, outra fora. Você marca as aulas quando está por aqui, e a viagem não vira aula perdida.",
  },
  {
    titulo: "Não tem dia fixo",
    texto: "Escala, plantão, filho, reunião que muda de horário. Você marca na semana em que der, do jeito que der.",
  },
  {
    titulo: "Ainda não cabe toda semana",
    texto: "Em vez de abrir mão de ter alguém olhando o seu treino, você espaça as aulas do jeito que cabe no seu momento.",
  },
];

/* O que a aula presencial entrega, além da hora de treino. */
const NA_AULA = [
  { titulo: "Técnica afinada", texto: "Eu corrijo a execução na série, no peso de verdade. O ajuste que no vídeo leva uma semana, ali leva uma repetição." },
  { titulo: "Percepção de falha", texto: "Você descobre onde está a falha de verdade, e quase sempre ela está mais longe do que você achava." },
  { titulo: "Cabeça de treino", texto: "Ritmo, concentração, o jeito de encarar a série pesada. Isso se aprende treinando do lado de alguém." },
];

/* A consultoria online, a mesma do plano online, que vem inteira no pacote. */
const CONSULTORIA = [
  "Treino montado para você no app, com vídeo de cada exercício",
  "Você grava a execução e eu mostro o que ajustar",
  "A carga travou ou a rotina mudou? A gente ajusta o plano",
  "Conversa direta comigo pelo WhatsApp",
  "Check-ins para decidir o próximo ciclo",
];

const EXEMPLOS = [
  "1 vez por semana, para manter a constância com alguém corrigindo a execução",
  "1 vez a cada 10 ou 15 dias, para revisar o treino e subir as cargas",
  "Uma semana inteira seguida, quando a agenda abrir",
  "Vários dias juntos no começo, para aprender os exercícios do jeito certo",
  "Vários dias juntos no fim do protocolo, para puxar mais e fechar forte",
];

const INCLUI = [
  "10 aulas presenciais comigo: no seu condomínio, em casa, na Arena 18 ou em outra academia que permita personal externo",
  "A consultoria online completa, a mesma do plano online, para todos os dias em que você treina sozinho",
  "Em cada aula, a execução corrigida na hora e a carga decidida com você",
  "A próxima aula começa de onde você parou, não do zero",
  "Pagamento parcelado",
];

export default function PacoteFlexivel({ onde }: { onde: string }) {
  return (
    <section
      id="pacote-flexivel"
      aria-labelledby={`pacote-flexivel-${onde}`}
      className="py-20 border-t border-white/10 scroll-mt-20"
      style={{ background: "#0d0d0d" }}
      data-track-section="pacote-flexivel"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: ouro }}>
          Pacote flexível · 10 aulas presenciais
        </p>
        <h2 id={`pacote-flexivel-${onde}`} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5 max-w-3xl" style={h}>
          Sua agenda não tem dia fixo? Seu treino comigo também não precisa ter.
        </h2>
        <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
          Você compra 10 aulas presenciais e <strong className="text-white">quem decide quando usar cada uma é você</strong>.
          Sem horário fixo, sem frequência obrigatória, sem deixar de ter personal porque a semana virou de cabeça para baixo.
        </p>

        <ul className="mt-10 grid gap-px bg-white/10 border border-white/10 md:grid-cols-3 list-none p-0 m-0">
          {PARA_QUEM.map((p) => (
            <li key={p.titulo} className="p-6" style={{ background: "#0d0d0d" }}>
              <h3 className="text-white text-xl font-semibold mb-2" style={h}>{p.titulo}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{p.texto}</p>
            </li>
          ))}
        </ul>

        {/* A aula e a consultoria: o argumento do pacote. */}
        <div className="mt-14">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: ouro }}>Aula presencial + consultoria online</p>
          <h3 className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-4 max-w-3xl" style={h}>
            Mesmo que você treine comigo de vez em quando, nunca treina sozinho.
          </h3>
          <p className="text-gray-300 leading-relaxed max-w-3xl">
            A consultoria online inteira está dentro do pacote flexível. Nos dias sem aula, você segue o treino que eu montei, me manda a execução e eu ajusto. Nos dias de aula, a gente treina lado a lado, e é aí que acontece o que nenhum vídeo ensina.
          </p>

          <ul className="mt-8 grid gap-px bg-white/10 border border-white/10 md:grid-cols-3 list-none p-0 m-0">
            {NA_AULA.map((a) => (
              <li key={a.titulo} className="p-6 bg-black">
                <h4 className="text-white text-lg font-semibold mb-2" style={h}>{a.titulo}</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{a.texto}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-l-2 pl-5 sm:pl-6 max-w-3xl" style={{ borderColor: ouro }}>
            <p className="text-white text-lg leading-relaxed" style={h}>
              E o melhor aparece no treino seguinte, sozinho.
            </p>
            <p className="text-gray-300 leading-relaxed mt-2">
              Depois de treinar comigo, a cabeça abre: você viu que aguenta mais peso do que imaginava, sabe onde é a falha de verdade e como a série tem que ser. No próximo treino sozinho você leva isso junto, e o treino rende muito mais. Cada aula melhora as semanas que vêm depois dela.
            </p>
          </div>

          <div className="mt-8">
            <p className="text-white text-sm font-semibold tracking-[0.1em] uppercase mb-4">A consultoria que vem junto</p>
            <ul className="grid gap-3 sm:grid-cols-2 list-none p-0 m-0">
              {CONSULTORIA.map((c) => (
                <li key={c} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-white flex-shrink-0 mt-0.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-white text-2xl font-bold mb-2" style={h}>Você escolhe o ritmo</h3>
            <p className="text-gray-400 text-sm mb-5">Só alguns exemplos. O jeito de usar é você que escolhe.</p>
            <ul className="space-y-3 list-none p-0 m-0">
              {EXEMPLOS.map((e) => (
                <li key={e} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: ouro }} />
                  {e}
                </li>
              ))}
            </ul>
            <p className="text-white text-sm mt-5">
              Quer usar de outro jeito? Também pode. O pacote se adapta à sua rotina, e não o contrário.
            </p>
          </div>

          <div>
            <h3 className="text-white text-2xl font-bold mb-5" style={h}>O que vem no pacote</h3>
            <ul className="space-y-3 list-none p-0 m-0">
              {INCLUI.map((i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-white flex-shrink-0 mt-0.5" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {i}
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-sm mt-5">O prazo para usar as 10 aulas a gente combina na compra, pensando na sua rotina.</p>
          </div>
        </div>

        <div className="mt-12 border border-white/15 p-6 sm:p-8">
          <h3 className="text-white text-xl font-bold mb-3" style={h}>Sendo direto: o que você abre mão</h3>
          <ul className="space-y-2 text-gray-300 text-sm leading-relaxed list-disc pl-5">
            <li><strong className="text-white">Não tem horário fixo reservado.</strong> A aula é marcada quando você pede, e não fica um horário guardado para você toda semana.</li>
            <li><strong className="text-white">Depende da minha agenda.</strong> Numa semana cheia, pode não ter o horário exato que você queria. Quanto antes você avisa, mais fácil encaixar.</li>
          </ul>
          <p className="text-gray-400 text-sm mt-4">
            Se você quer treinar comigo toda semana no mesmo horário, o pacote por frequência semanal é o formato certo. Na conversa eu te digo qual dos dois faz mais sentido para você.
          </p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-gray-300 mb-5">Me conta como é a sua semana que eu te digo se o pacote flexível encaixa.</p>
          <a
            href={getWhatsAppUrl(MENSAGEM_PACOTE_FLEXIVEL)}
            data-wa-origem="pacote-flexivel"
            data-cta-id={`${onde}:pacote-flexivel`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-black"
            style={{ background: ouro }}
          >
            Quero o pacote flexível
          </a>
        </div>
      </div>
    </section>
  );
}
