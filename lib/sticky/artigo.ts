import type { BlogPost } from "@/lib/blog";
import { classify, matchRegiao } from "@/lib/cta/classify";
import { artigoDeExecucao } from "@/lib/revisao";

/**
 * Cluster do artigo → regra da sticky bar.
 *
 * Roda no build, dentro de generateMetadata, e sai como duas meta tags que o
 * componente lê no cliente. Assim a barra sabe o assunto do artigo sem
 * carregar o classificador nem os 830 slugs no navegador — e a decisão é a
 * mesma que o CTA contextual já toma para a mesma página.
 */

const NOME_REGIAO: Record<string, string> = {
  tambore: "Tamboré",
  barueri: "Barueri",
  santana: "Santana de Parnaíba",
  alphaville: "Alphaville",
};

const normaliza = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-");

export function regraParaArtigo(post: BlogPost): { id: string; contexto?: string } {
  const { cluster, stage } = classify(post);
  const core = normaliza(`${post.slug} ${post.title}`);

  switch (cluster) {
    /*
     * O cluster "exercise" pega alguns artigos por colisão de palavra
     * ("abdominal" em como-perder-gordura-abdominal). O convite de mandar
     * vídeo só vale onde há execução para revisar — a mesma guarda que o
     * CTA contextual usa.
     */
    case "exercise":
      return { id: artigoDeExecucao(post) ? "exercicio" : "hipertrofia" };
    case "hypertrophy":
      return { id: /volume-de-treino|quantas-series|volume-ideal/.test(core) ? "volume" : "hipertrofia" };
    case "weight_loss":
      return { id: stage === "problema" ? "emagrecimento_travado" : "emagrecimento" };
    case "nutrition":
      return { id: /macro|dieta|carboidrato|cardapio|calori|refeic/.test(core) ? "macros" : "proteina" };
    case "beginner":
    case "routine":
      return { id: "rotina" };
    case "pain":
      return { id: "dor" };
    case "health":
      return { id: "saude" };
    case "glp1":
      return { id: "glp1" };
    case "gym_local":
      return { id: "academia_local" };
    case "local_service":
      return { id: "local", contexto: NOME_REGIAO[matchRegiao(core) ?? "alphaville"] };
    case "local_other":
      return { id: "local_fora" };
    case "service_online":
      return { id: "servico_online" };
    case "results":
      return { id: "resultados" };
    case "gym_generic":
    case "general":
    default:
      return { id: "fallback" };
  }
}
