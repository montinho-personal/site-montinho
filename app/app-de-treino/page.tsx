import type { Metadata } from "next";
import Link from "next/link";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { SITE_URL } from "@/lib/blog";
import { FILOSOFIAS } from "@/lib/filosofia";
import FAQ from "@/components/ui/FAQ";
import BotaoApp from "@/components/app/BotaoApp";

/**
 * App de treino — a página do app do Montinho (30 dias grátis).
 *
 * Pesquisa: exports do Answer the Public de "app de treino" e de "aplicativo
 * de musculação grátis" (24/10/2026) e os prints do Google do Montinho no
 * mesmo dia. As duas buscas têm a mesma intenção e ficam nesta página só
 * (uma segunda página canibalizaria a primeira). O maior volume é "app de treino
 * academia / para academia"; depois vêm "em casa", "grátis/gratuito" e
 * "melhor app de treino". A visão geral por IA e os resultados mostram apps
 * de registro de séries (Hevy, Gym WP) e listas de "melhores apps".
 *
 * Fatos conferidos no código e no banco do app em 24/10/2026:
 *  • convite SITE-30DIAS: 30 dias, sem cartão (nome, e-mail, WhatsApp e senha);
 *  • treinos prontos aprovados (lib/visitante/treinos-prontos.ts), com filtro
 *    Feminino/Masculino e nível; os de CASA estão desligados até a biblioteca
 *    ter os exercícios de casa com vídeo (TREINO_EM_CASA_LIGADO = false), por
 *    isso a página NÃO promete treino em casa;
 *  • 104 dos 181 exercícios da biblioteca têm vídeo: "na maior parte";
 *  • 43 medalhas; convite de amigo a partir do 4º treino, +10 dias por amigo,
 *    até +30;
 *  • acesso vencido = só leitura (histórico, Jornada e medalhas ficam);
 *  • app web instalável (manifest standalone): não está nas lojas;
 *  • treino sem internet: as telas ficam salvas e as séries entram numa fila
 *    que sincroniza quando a conexão volta (lib/offline, lib/sync);
 *  • o único lembrete é o de treino deixado aberto: a página não promete
 *    lembrete de agenda.
 *
 * Fica de fora (regra do AGENTS.md): "app de treino para personal" e
 * "prescrição" (intenção de quem é personal), nomes de outros profissionais
 * e marcas, corrida e tiro (sugestão de pauta).
 */

const CAMINHO = "/app-de-treino";
const WHATS = "Oi Montinho! Vi o app de treino no site e queria entender como funciona o acompanhamento com você.";

export const metadata: Metadata = {
  title: { absolute: "App de Treino para Academia: 30 Dias Grátis | Montinho" },
  description:
    "App de treino para academia com treino pronto, carga e repetições registradas e a evolução semana a semana. 30 dias grátis, sem cartão.",
  alternates: { canonical: `${SITE_URL}${CAMINHO}` },
  openGraph: {
    title: "App de treino para academia: 30 dias grátis | Montinho",
    description: "Treino pronto, carga registrada a cada série e a evolução semana a semana. Sem cartão.",
    url: `${SITE_URL}${CAMINHO}`,
    type: "website",
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630 }],
  },
};

/** Treinos prontos aprovados no app (24/10/2026), sem os de casa (desligados). */
const PRONTOS: Array<{ nome: string; chamada: string }> = [
  { nome: "Iniciante Feminino", chamada: "Para quem está começando: pernas e glúteo em destaque" },
  { nome: "Iniciante Masculino", chamada: "Para quem está começando: peito, costas e braços" },
  { nome: "Operação Musa do Bumbum", chamada: "Glúteo em destaque, 2× na semana" },
  { nome: "Pernas de Aço", chamada: "Quadríceps, posteriores e panturrilha" },
  { nome: "Rainha das Pernas", chamada: "Pernas e glúteo pesados e frequentes" },
  { nome: "Deusa Guerreira", chamada: "Pernas firmes, glúteo forte e core de aço" },
  { nome: "Musa da Bulgária", chamada: "Começa e termina no agachamento búlgaro" },
  { nome: "Rainha do Agachamento", chamada: "Um agachamento diferente em cada série de pernas" },
  { nome: "Peitoral de Respeito", chamada: "Peito em destaque, sem esquecer o resto" },
  { nome: "Rei do Supino", chamada: "Supino reto, inclinado, declinado e fechado" },
  { nome: "Missão Braço de Respeito", chamada: "Bíceps e tríceps em destaque" },
  { nome: "Missão Super-Herói", chamada: "Ombros largos, costas em V e braços de cinema" },
  { nome: "Martelo do Trovão", chamada: "Ombros e braços de deus nórdico" },
  { nome: "Físico Clássico", chamada: "Costas em V, cintura fina e ombros largos" },
  { nome: "Projeto Fera", chamada: "Força bruta e tamanho" },
  { nome: "Shape de Verão Sem Desculpa", chamada: "5 dias por semana, corpo todo" },
  { nome: "Peitoral Era de Ouro", chamada: "Peito cheio, no estilo dos anos 70" },
  { nome: "Rotina Era de Ouro", chamada: "6 dias, a divisão clássica dos campeões" },
];

const NO_TREINO = [
  { titulo: "Carga e repetições em cada série", texto: "Você anota o que fez em cada série. A carga da última vez já vem preenchida, então o treino não para para você lembrar o número." },
  { titulo: "O descanso conta sozinho", texto: "Concluiu a série, o cronômetro do descanso começa. Você não precisa de outro app aberto." },
  { titulo: "Tá fácil? O app sugere subir", texto: "Quando as repetições passam do combinado, o app avisa que é hora de aumentar a carga. Bateu recorde? Ele mostra na hora." },
  { titulo: "Vídeo de execução", texto: "A maior parte dos exercícios da biblioteca tem vídeo de como fazer, gravado para o app, para você conferir antes da série." },
];

const faq = [
  {
    question: "O app do Montinho é gratuito?",
    answer:
      "Os primeiros 30 dias são grátis e não pedem cartão: você cria a conta com nome, e-mail, WhatsApp e senha. Depois dos 30 dias, a conta fica para consulta, com os seus treinos, medalhas e a Jornada guardados. Para voltar a treinar com o app, você fala com o Montinho.",
  },
  {
    question: "Qual é o melhor aplicativo gratuito para treino?",
    answer:
      "O que você vai usar todo treino. Para academia, procure um app que registre carga e repetições sem atrapalhar a série, mostre se a carga está subindo ou parou, tenha vídeo de execução e, se você não sabe por onde começar, traga um treino pronto feito por quem entende. Teste por algumas semanas antes de decidir: o app do Montinho tem 30 dias grátis para isso.",
  },
  {
    question: "Como montar meu treino grátis?",
    answer:
      "Você tem três caminhos. No app, escolher um treino pronto ou montar o seu, exercício por exercício. No site, a ferramenta Treino Para Minha Rotina sugere a divisão que cabe nos dias que você tem. E, se quiser um treino feito para você, o Montinho monta e acompanha.",
  },
  {
    question: "Tem treino feminino no app?",
    answer:
      "Tem. Na vitrine você filtra por Feminino ou Masculino e por nível. Para mulheres há o Iniciante Feminino, o Feminino (para quem já passou do começo), Operação Musa do Bumbum, Rainha das Pernas, Deusa Guerreira, Musa da Bulgária e Rainha do Agachamento, entre outros.",
  },
  {
    question: "Dá para usar o app para treinar em casa?",
    answer:
      "Por enquanto, os treinos prontos e o Monte com IA são para academia. Os treinos em casa voltam quando a biblioteca tiver os exercícios de casa com vídeo. Se você já treina em casa com halteres, dá para cadastrar o seu treino com os exercícios da biblioteca.",
  },
  {
    question: "O app funciona no iPhone e no Android?",
    answer:
      "Funciona nos dois, pelo navegador do celular. Ele não está na App Store nem na Play Store: você abre o link, cria a conta e pode colocar o app na tela inicial para abrir como os outros.",
  },
  {
    question: "O app funciona sem internet?",
    answer:
      "Funciona durante o treino. Depois que você abre o app uma vez com internet, as telas ficam salvas no celular. Se a conexão da academia cair no meio do treino, você continua registrando as séries, e o app envia tudo quando a internet volta.",
  },
  {
    question: "Dá para montar treino de musculação com IA?",
    answer:
      "Dá, no Monte com IA: você fala ou escreve o treino que quer e recebe duas opções na hora, montadas com base em estudos de treinamento de força e nos exercícios da biblioteca do Montinho. São sugestões gerais, não uma prescrição individual: não substituem a avaliação de um profissional, e com dor, lesão ou alguma condição de saúde o certo é procurar um antes.",
  },
  {
    question: "Dá para usar o app na academia do Wellhub (Gympass)?",
    answer:
      "Dá. O app não depende da academia: você usa na academia do Wellhub, na do condomínio ou em qualquer outra. Ele não faz parte do Wellhub; é o app do Montinho.",
  },
  {
    question: "O app tem dieta?",
    answer:
      "O app é de treino. Para a alimentação, o site tem ferramentas grátis: a Calculadora de Macros, a Calculadora de Proteína e o Monte seu Cardápio.",
  },
  {
    question: "Dá para treinar com amigos no app?",
    answer:
      "A partir do quarto treino concluído, você pode convidar amigos. Cada amigo que cria a conta te dá mais 10 dias grátis, até 30 dias a mais. E todo mundo entra no ranking de troféus da turma do Montinho.",
  },
  {
    question: "App de treino funciona sem personal?",
    answer:
      "Funciona para registrar e enxergar a sua evolução, o que já resolve muito platô. O limite é que o app não percebe sozinho por que a carga parou, o que mudou na sua rotina ou como está a sua execução. É aí que entra o acompanhamento.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
};

/** A variante "comparacao" (lib/filosofia.ts): a do fim das ferramentas fala em "previsão", e aqui não há previsão. */
const COMPARACAO = FILOSOFIAS.find((f) => f.id === "comparacao")!;
const [ANTES_LINK, DEPOIS_LINK] = COMPARACAO.texto.split("{link}");

const h = { fontFamily: "var(--font-titulo), Georgia, serif" } as const;
const ln = "underline underline-offset-4 decoration-1 decoration-white/30 hover:text-white transition-colors";
const olho = "text-xs font-semibold tracking-[0.2em] uppercase mb-4";

export default function AppDeTreinoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="pt-20 pb-16 bg-black border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className={olho} style={{ color: "#BA9E50" }}>App do Montinho · 30 dias grátis</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6" style={h}>
            App de treino para academia, com treino pronto e 30 dias grátis
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Um aplicativo de musculação feito por personal trainer: você chega na academia sabendo o que fazer, anota carga e repetições em cada série e vê, semana a semana, se a carga está
            subindo ou se parou. Se ainda não tem treino, escolhe um pronto. Se já tem, coloca o seu.
          </p>
          <BotaoApp onde="app-de-treino:topo">Testar o app grátis por 30 dias</BotaoApp>
          <p className="text-gray-500 text-sm mt-3">Sem cartão. A conta pede nome, e-mail, WhatsApp e senha.</p>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className={olho} style={{ color: "#BA9E50" }}>Na academia</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-8" style={h}>O que o app faz no seu treino</h2>
          <div className="grid sm:grid-cols-2 gap-px border border-white/10">
            {NO_TREINO.map((e) => (
              <div key={e.titulo} className="p-6 border-b border-r border-white/10">
                <p className="text-white font-semibold mb-2">{e.titulo}</p>
                <p className="text-gray-300 text-sm leading-relaxed font-light">{e.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4" style={h}>Treino pronto para quem não sabe por onde começar</h2>
          <p className="text-gray-300 leading-relaxed font-light mb-8 max-w-3xl">
            Na vitrine você filtra por Feminino ou Masculino e pelo seu nível, toca em Começar e o treino vai para os seus treinos, já com
            um desafio para você não parar. Alguns dos que estão lá hoje:
          </p>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {PRONTOS.map((t) => (
              <li key={t.nome} className="text-gray-300 text-sm leading-relaxed">
                <strong className="text-white font-semibold">{t.nome}</strong> · {t.chamada}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6" style={h}>Já tem um treino? Coloque o seu no app</h2>
          <ul className="space-y-4 text-gray-300 leading-relaxed font-light max-w-3xl">
            <li><strong className="text-white font-semibold">Exercício por exercício:</strong> você monta com os exercícios da biblioteca, com séries, repetições e descanso.</li>
            <li><strong className="text-white font-semibold">Por print, foto ou PDF:</strong> você manda o treino que já tem e o app tenta ler na hora. Você confere antes de salvar; quando não dá para ler, o arquivo vai para o Montinho montar.</li>
            <li><strong className="text-white font-semibold">Monte com IA:</strong> você fala ou escreve o treino que quer e recebe duas opções na hora.</li>
          </ul>
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6" style={h}>A sua evolução: a carga subiu ou parou?</h2>
          <p className="text-gray-300 leading-relaxed font-light mb-4 max-w-3xl">
            Na tela de Evolução você vê a constância da semana e das últimas 12 semanas, o calendário de cada treino, os exercícios em que
            a carga subiu desde o começo e as evoluções que você nem percebeu. Medidas e avaliações ficam no mesmo lugar.
          </p>
          <p className="text-gray-300 leading-relaxed font-light max-w-3xl">
            É o que mostra o platô antes de ele virar meses: se a carga do supino está igual há quatro semanas, você vê. Sobre o que fazer
            nessa hora, leia <Link href="/blog/como-sair-do-plato-da-musculacao" className={ln}>como sair do platô na musculação</Link> e{" "}
            <Link href="/blog/progressao-de-carga" className={ln}>progressão de carga</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6" style={h}>Medalhas, Jornada do Chalalá e treino com amigos</h2>
          <ul className="space-y-4 text-gray-300 leading-relaxed font-light max-w-3xl">
            <li><strong className="text-white font-semibold">43 medalhas:</strong> cada treino concluído conta, e cada medalha libera uma descoberta no Montinho Desbloqueia.</li>
            <li><strong className="text-white font-semibold">Jornada do Chalalá:</strong> o mapa da sua história no app, com capítulos, personagens e o marcador de onde você está.</li>
            <li><strong className="text-white font-semibold">Ranking de troféus:</strong> você entra no ranking da turma do Montinho.</li>
            <li><strong className="text-white font-semibold">Amigos:</strong> a partir do quarto treino, cada amigo que cria a conta te dá mais 10 dias grátis, até 30 dias a mais.</li>
          </ul>
        </div>
      </section>

      <section className="py-16 border-t border-white/10" style={{ background: "#0d0d0d" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6" style={h}>Como escolher um aplicativo de musculação grátis</h2>
          <p className="text-gray-300 leading-relaxed font-light mb-4 max-w-3xl">Antes de comparar listas de &ldquo;melhores apps&rdquo;, veja se o app faz o básico que muda o seu treino:</p>
          <ul className="space-y-2 text-gray-300 leading-relaxed font-light max-w-3xl list-disc pl-5">
            <li>Registrar carga e repetições sem você perder o ritmo da série.</li>
            <li>Mostrar se a carga está subindo, e não só guardar o histórico.</li>
            <li>Ter vídeo de execução dos exercícios.</li>
            <li>Trazer um treino pronto feito por quem entende, ou aceitar o seu.</li>
            <li>Ajudar você a manter a constância, semana a semana.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed font-light mt-6 max-w-3xl">
            Os prós e os limites de treinar só com app estão em <Link href="/blog/app-de-treino-funciona" className={ln}>app de treino funciona?</Link>
          </p>
        </div>
      </section>

      <section className="py-16 bg-black border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className={olho} style={{ color: "#BA9E50" }}>Perguntas frequentes</p>
          <h2 className="text-3xl font-bold text-white mb-10" style={h}>Dúvidas sobre o app de treino</h2>
          <FAQ itens={faq} placement="app-de-treino" />
        </div>
      </section>

      <section className="py-20 bg-black border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6" style={h}>{COMPARACAO.titulo}</h2>
          <p className="text-gray-300 font-light leading-relaxed text-lg mb-8">
            {ANTES_LINK}
            <Link href="/consultoria" className={ln}>acompanhamento do Montinho</Link>
            {DEPOIS_LINK}
          </p>
          <p className="text-white leading-relaxed mb-8">
            O app registra. Quando a carga parar, a rotina mudar ou um exercício não encaixar, o Montinho percebe e ajusta junto com você.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BotaoApp onde="app-de-treino:fim">Testar o app grátis</BotaoApp>
            <a
              href={getWhatsAppUrl(WHATS)} data-wa-origem="fim" data-cta-id="app-de-treino:fim"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 text-base font-medium tracking-wide hover:border-white hover:bg-white/5 transition-all duration-200"
            >
              Falar com o Montinho
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
