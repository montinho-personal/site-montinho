"use client";

import { useState } from "react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import SectionTitle from "@/components/ui/SectionTitle";

const faqs = [
  {
    question: "Em quanto tempo vou ver resultados?",
    answer:
      "Os resultados dependem principalmente da sua consistência. Quando você mantém uma boa frequência de treinos, segue o planejamento, faz o cardio conforme orientado e mantém uma alimentação alinhada aos seus objetivos, é comum já perceber mudanças nas primeiras semanas. Em cerca de dois meses, essas evoluções costumam ficar ainda mais evidentes. O meu compromisso é fazer com que você evolua de forma constante, respeitando o seu ritmo e construindo resultados duradouros.",
  },
  {
    question: "A consultoria online funciona tão bem quanto o presencial?",
    answer:
      "Para a maioria dos objetivos, sim. Com um planejamento detalhado, vídeos demonstrativos dos exercícios, suporte diário e acompanhamento próximo, os resultados da consultoria online são comparáveis ao presencial. A grande diferença é a localização — online você pode estar em qualquer lugar do Brasil. O presencial tem a vantagem da correção técnica em tempo real.",
  },
  {
    question: "Não tenho tempo. Como vou conseguir treinar?",
    answer:
      "Esse é um dos principais obstáculos que ouço — e posso te dizer: você não precisa de 2 horas por dia na academia para transformar seu corpo. Treinos de 45-60 minutos, 3 a 4 vezes por semana, com o protocolo certo, produzem resultados excelentes. Parte do meu trabalho é criar um plano que caiba na sua vida real, não em uma versão idealizada dela.",
  },
  {
    question: "Já tentei de tudo e nunca funcionou. Por que seria diferente agora?",
    answer:
      "Porque desta vez você vai ter o método certo E o acompanhamento adequado ao mesmo tempo. A maioria das abordagens falha em um dos dois: ou o plano não é personalizado para sua realidade, ou não há ninguém te acompanhando quando surgem os desafios. Meu trabalho combina os dois. E digo mais: o fato de você ter tentado antes e não ter conseguido não é fraqueza — é prova de que estava faltando a abordagem certa.",
  },
  {
    question: "O que está incluído na consultoria?",
    answer:
      "Dependendo da modalidade, inclui: avaliação física e anamnese completa, protocolo de treino personalizado, orientação nutricional, suporte via WhatsApp, check-ins regulares e reavaliações mensais. Nas modalidades presenciais, inclui ainda as sessões de treino guiadas em Alphaville (Barueri ou Santana de Parnaíba).",
  },
  {
    question: "Quanto custa? Vale o investimento?",
    answer:
      "Os valores variam conforme a modalidade e a frequência. Entre em contato pelo WhatsApp para uma proposta personalizada. Quanto ao valor: considero que a questão mais importante não é quanto custa, mas o quanto você já gastou tentando sozinho — em suplementos, academias, planos que não funcionaram — e quanto isso custou em tempo, saúde e autoestima. Um acompanhamento que realmente funciona tem um ROI imenso.",
  },
  {
    question: "Onde fica o atendimento presencial?",
    answer:
      "Realizo atendimento presencial em Alphaville, atendendo clientes de Barueri e Santana de Parnaíba. Para quem não está nessa região, a consultoria online oferece o mesmo nível de atenção e resultados similares.",
  },
  {
    question: "Preciso de academia própria ou você tem um local?",
    answer:
      "Para o atendimento presencial, o treino pode acontecer em academias parceiras na região de Alphaville ou em condomínios/residências com espaço adequado. Conversamos sobre o melhor arranjo para você. Para a consultoria online, o treino pode ser adaptado para academia, casa ou qualquer espaço disponível.",
  },
  {
    question: "Tenho lesões. Posso treinar?",
    answer:
      "Na maioria dos casos, sim — e muito bem. Parte do meu trabalho é adaptar o treino à sua condição física atual, respeitar limitações e trabalhar na correção de desequilíbrios musculares. Muitos dos meus alunos vieram com histórico de lesões e não apenas treinaram com segurança como resolveram problemas que tinham há anos.",
  },
  {
    question: "Como é o suporte entre as sessões/semanas?",
    answer:
      "Tenho contato direto via WhatsApp. Respondo dúvidas sobre treino e alimentação, acompanho o progresso através de fotos e dados que você me envia, e faço ajustes sempre que necessário. Não sou o tipo de personal que some até a próxima sessão — estou disponível para te apoiar ao longo de todo o processo.",
  },
  {
    question: "Como começo?",
    answer:
      "O primeiro passo é uma conversa. Me mande uma mensagem pelo WhatsApp, me conte seu objetivo e vamos marcar uma conversa inicial sem compromisso. Sem pressão, sem pitch de venda — apenas uma conversa para entender se faz sentido trabalharmos juntos.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-start justify-between py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span
          className="text-white font-medium text-base pr-4 group-hover:text-gray-200 transition-colors"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {question}
        </span>
        <span className="flex-shrink-0 mt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="pb-6">
          <p className="text-gray-300 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 bg-black border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle
            eyebrow="Perguntas Frequentes"
            title="Respondendo suas dúvidas"
            subtitle="As perguntas que mais recebo sobre consultoria, resultados e como funciona o processo. Se a sua não estiver aqui, me manda uma mensagem."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-black">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/10 text-center" style={{ background: "#0d0d0d" }}>
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-2xl sm:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Ainda tem dúvidas?
          </h2>
          <p className="text-gray-400 mb-8">
            Me mande uma mensagem pelo WhatsApp. Respondo pessoalmente e sem enrolação.
          </p>
          <a
            href={getWhatsAppUrl("Olá! Tenho uma dúvida sobre a consultoria e gostaria de conversar.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-base font-semibold tracking-wide hover:bg-gray-100 transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Enviar Mensagem
          </a>
        </div>
      </section>
    </>
  );
}
