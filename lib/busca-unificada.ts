import { termosDeIntencao } from "@/lib/search";
import { ferramentasDaBusca } from "@/lib/ferramentas/busca";

/**
 * As ferramentas que a busca do site sugere junto com os artigos.
 *
 * Primeiro pela consulta como foi digitada. Sem nada, pela intenção que a
 * camada semântica reconhece ("nunca treinei" → iniciante, "perder barriga"
 * → emagrecer) — e a intenção de preço fica de fora, porque preço de
 * serviço não tem calculadora.
 *
 * Só no servidor: lib/search carrega o acervo inteiro do blog.
 */
export interface FerramentaSugerida {
  id: string;
  href: string;
  nome: string;
  resultado: string;
}

export function sugerirFerramentas(q: string, limite = 3): FerramentaSugerida[] {
  let lista = ferramentasDaBusca(q, limite);
  if (lista.length === 0) {
    const intencao = termosDeIntencao(q, true);
    if (intencao.length) lista = ferramentasDaBusca(intencao.join(" "), limite);
  }
  return lista.map((f) => ({ id: f.id, href: f.href, nome: f.nome, resultado: f.resultado }));
}
