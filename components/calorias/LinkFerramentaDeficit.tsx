"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

/**
 * Cartão de link para a Calculadora de Déficit Calórico.
 *
 * Vai nos artigos "X engorda?": o leitor sai com as calorias do alimento e
 * fica com a pergunta do dia inteiro ("quanto disso cabe em mim?"). A
 * calculadora embutida está no teto de 8 artigos; o cartão leva quem
 * terminou de ler direto para a conta, sem pesar no meio do texto.
 */
export default function LinkFerramentaDeficit({ slug }: { slug: string }) {
  return (
    <div className="mt-12 border border-white/15 p-5 sm:p-6">
      <p className="text-white font-semibold mb-1.5">
        Quantas calorias cabem no seu dia?
      </p>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">
        Informe peso, altura, idade e nível de atividade e veja quanto você
        gasta por dia e quanto comer para emagrecer.
      </p>
      <Link
        href="/ferramentas/calculadora-deficit-calorico"
        onClick={() => trackEvent("calorie_article_click", { placement: `link-${slug}` })}
        className="inline-flex items-center text-white text-sm font-semibold underline underline-offset-4 decoration-1 hover:opacity-80 transition-opacity min-h-[44px]"
        style={{ textDecorationColor: "#BA9E50" }}
      >
        Calcular meu gasto →
      </Link>
    </div>
  );
}
