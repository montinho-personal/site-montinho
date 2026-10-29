/**
 * Links controlados: um destino curto por canal, cada um com UTM próprio.
 * É o que vai na bio, nos stories, no QR do condomínio — porque referrer de
 * app social não é confiável e o link controlado é.
 *
 *   /l/ig-bio   → /?utm_source=instagram&utm_medium=organic_social&utm_campaign=perfil&utm_content=bio
 */
export interface LinkControlado { destino: string; utm_source: string; utm_medium: string; utm_campaign: string; utm_content: string; tipo: "social" | "qr" | "other" }

export const LINKS: Record<string, LinkControlado> = {
  "ig-bio": { destino: "/", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "perfil", utm_content: "bio", tipo: "social" },
  "ig-stories": { destino: "/", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "stories", utm_content: "story", tipo: "social" },
  "ig-destaque": { destino: "/", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "perfil", utm_content: "destaque", tipo: "social" },
  "ig-consultoria": { destino: "/consultoria-online", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "consultoria", utm_content: "bio", tipo: "social" },
  "ig-presencial": { destino: "/personal-trainer-alphaville", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "presencial", utm_content: "bio", tipo: "social" },
  "fb": { destino: "/", utm_source: "facebook", utm_medium: "organic_social", utm_campaign: "perfil", utm_content: "pagina", tipo: "social" },
  "yt": { destino: "/", utm_source: "youtube", utm_medium: "organic_social", utm_campaign: "canal", utm_content: "descricao", tipo: "social" },
  "tiktok": { destino: "/", utm_source: "tiktok", utm_medium: "organic_social", utm_campaign: "perfil", utm_content: "bio", tipo: "social" },
  "qr-cartao": { destino: "/", utm_source: "qr", utm_medium: "offline", utm_campaign: "cartao", utm_content: "cartao_visita", tipo: "qr" },
  "qr-condominio": { destino: "/onde-atendo", utm_source: "qr", utm_medium: "offline", utm_campaign: "condominio", utm_content: "qr_condominio", tipo: "qr" },
  "qr-academia": { destino: "/academias-alphaville", utm_source: "qr", utm_medium: "offline", utm_campaign: "academia", utm_content: "qr_academia", tipo: "qr" },
  "ppp": { destino: "/personal-trainer-alphaville", utm_source: "personalporperto", utm_medium: "referral", utm_campaign: "diretorio", utm_content: "perfil", tipo: "other" },
  // O botão "Site" do Perfil da Empresa no Google. Sem isto, quem clica ali
  // chega à home sem marcação e o CRM registra "desconhecido" — o canal com
  // 23 avaliações ficava invisível na atribuição.
  // A história do Montinho, mandada no último toque de uma proposta parada.
  // Link controlado, e não a URL direta, porque é a única forma de saber
  // quantos abriram: essa mensagem sai pelo WhatsApp e o referrer não chega.
  "historia-lead": { destino: "/minha-historia", utm_source: "crm", utm_medium: "whatsapp", utm_campaign: "proposta_parada", utm_content: "historia", tipo: "other" },
  /**
   * Post no grupo de WhatsApp do prédio onde o Montinho mora. Aponta para a
   * história, que é o argumento do post, e não para a home. O utm_source
   * "condominio" existe como fonte no CRM; sem ele, quem clicasse cairia em
   * "WhatsApp direto", que é quem já tinha o número — e o grupo sumiria da
   * atribuição.
   */
  "predio": { destino: "/minha-historia", utm_source: "condominio", utm_medium: "whatsapp_grupo", utm_campaign: "moradores", utm_content: "historia", tipo: "other" },
  /**
   * Vídeo do YouTube sobre beliscar entre as refeições. Leva ao artigo do
   * mesmo assunto, e não à home: quem vem do vídeo procura aquilo, e na home
   * saía sem rolar. Mantém a campanha "beliscadas" que o link antigo já usava,
   * para os números de antes e depois ficarem na mesma linha do GA4.
   */
  "yt-beliscadas": { destino: "/blog/habitos-que-sabotam-seu-emagrecimento", utm_source: "youtube", utm_medium: "video", utm_campaign: "beliscadas", utm_content: "descricao", tipo: "social" },
  "gbp": { destino: "/", utm_source: "google", utm_medium: "perfil_empresa", utm_campaign: "perfil", utm_content: "botao_site", tipo: "other" },
  /**
   * Story que aponta para um artigo específico.
   *
   * O "ig-stories" genérico existe e leva para a home — serve para o story
   * que só diz "tô no site". Não serve aqui: quando o story é sobre UM
   * artigo, mandar para a home perde a pessoa no caminho e, pior, some com
   * a informação de qual story funcionou. Por isso cada story de artigo
   * ganha seu próprio código, sempre sob a campanha "stories", para que os
   * stories continuem comparáveis entre si pelo utm_content.
   */
  "ig-cerveja": { destino: "/blog/cerveja-engorda", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "stories", utm_content: "cerveja_engorda", tipo: "social" },
  /**
   * Mesmo artigo, status do WhatsApp.
   *
   * Precisa ser um código separado do story do Instagram, e não o mesmo
   * link nos dois lugares: com um código só, os cliques se somam e a
   * pergunta que interessa — qual das duas redes traz leitor — fica sem
   * resposta.
   *
   * O utm_medium é "status" de propósito: é ele que faz a fonte cair em
   * whatsapp_status em vez de whatsapp_direct, que significa quem já tinha
   * o número e chamou.
   */
  "wa-cerveja": { destino: "/blog/cerveja-engorda", utm_source: "whatsapp", utm_medium: "status", utm_campaign: "status", utm_content: "cerveja_engorda", tipo: "social" },
  /**
   * Simulador do Fim de Semana: o vídeo "pra onde foi o seu déficit?".
   * Um código por rede, pela mesma razão do par da cerveja; o utm_content
   * nomeia a ferramenta, e não um artigo.
   */
  "ig-fds": { destino: "/ferramentas/simulador-fim-de-semana", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "stories", utm_content: "simulador_fds", tipo: "social" },
  "wa-fds": { destino: "/ferramentas/simulador-fim-de-semana", utm_source: "whatsapp", utm_medium: "status", utm_campaign: "status", utm_content: "simulador_fds", tipo: "social" },
  "yt-sub": { destino: "/ferramentas/substituidor-de-exercicios", utm_source: "youtube", utm_medium: "video", utm_campaign: "substituidor", utm_content: "descricao", tipo: "social" },
  "ig-sub": { destino: "/ferramentas/substituidor-de-exercicios", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "reels", utm_content: "substituidor", tipo: "social" },
  "wa-sub": { destino: "/ferramentas/substituidor-de-exercicios", utm_source: "whatsapp", utm_medium: "status", utm_campaign: "status", utm_content: "substituidor", tipo: "social" },
  "ig-whey": { destino: "/ferramentas/calculadora-whey", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "stories", utm_content: "calculadora_whey", tipo: "social" },
  "wa-whey": { destino: "/ferramentas/calculadora-whey", utm_source: "whatsapp", utm_medium: "status", utm_campaign: "status", utm_content: "calculadora_whey", tipo: "social" },
  "yt-whey": { destino: "/ferramentas/calculadora-whey", utm_source: "youtube", utm_medium: "video", utm_campaign: "calculadora_whey", utm_content: "descricao", tipo: "social" },
  "ig-deficit": { destino: "/ferramentas/calculadora-deficit-calorico", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "stories", utm_content: "calculadora_deficit", tipo: "social" },
  "wa-deficit": { destino: "/ferramentas/calculadora-deficit-calorico", utm_source: "whatsapp", utm_medium: "status", utm_campaign: "status", utm_content: "calculadora_deficit", tipo: "social" },
  "yt-deficit": { destino: "/ferramentas/calculadora-deficit-calorico", utm_source: "youtube", utm_medium: "video", utm_campaign: "calculadora_deficit", utm_content: "descricao", tipo: "social" },
  "ig-emagrecimento": { destino: "/ferramentas/simulador-emagrecimento", utm_source: "instagram", utm_medium: "organic_social", utm_campaign: "stories", utm_content: "simulador_emagrecimento", tipo: "social" },
  "wa-emagrecimento": { destino: "/ferramentas/simulador-emagrecimento", utm_source: "whatsapp", utm_medium: "status", utm_campaign: "status", utm_content: "simulador_emagrecimento", tipo: "social" },
  "yt-emagrecimento": { destino: "/ferramentas/simulador-emagrecimento", utm_source: "youtube", utm_medium: "video", utm_campaign: "simulador_emagrecimento", utm_content: "descricao", tipo: "social" },
  "yt-upper-lower": { destino: "/blog/treino-upper-lower-superior-inferior", utm_source: "youtube", utm_medium: "video", utm_campaign: "treino_upper_lower", utm_content: "descricao", tipo: "social" },
  /**
   * Os dois vídeos de mobilidade (inferiores e superiores). Levam à home, a
   * pedido do Montinho; um código por vídeo e por rede, para saber qual dos
   * dois e qual canal trouxe gente.
   */
  "yt-mob-inferiores": { destino: "/", utm_source: "youtube", utm_medium: "video", utm_campaign: "mobilidade_inferiores", utm_content: "descricao", tipo: "social" },
  "yt-mob-superiores": { destino: "/", utm_source: "youtube", utm_medium: "video", utm_campaign: "mobilidade_superiores", utm_content: "descricao", tipo: "social" },
  "wa-mob-inferiores": { destino: "/", utm_source: "whatsapp", utm_medium: "status", utm_campaign: "status", utm_content: "mobilidade_inferiores", tipo: "social" },
  "wa-mob-superiores": { destino: "/", utm_source: "whatsapp", utm_medium: "status", utm_campaign: "status", utm_content: "mobilidade_superiores", tipo: "social" },
};

export function urlDoLink(slug: string, extra: Record<string, string> = {}): string | null {
  const l = LINKS[slug];
  if (!l) return null;
  const u = new URLSearchParams({ utm_source: l.utm_source, utm_medium: l.utm_medium, utm_campaign: l.utm_campaign, utm_content: l.utm_content, ...extra });
  return `${l.destino}?${u.toString()}`;
}
