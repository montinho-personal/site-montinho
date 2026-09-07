/**
 * Reconhece a mensagem que chegou no WhatsApp.
 *
 * Todo botão do site abre o WhatsApp com uma frase fixa, e essa frase é a
 * assinatura da página e do botão. Quando o "Ref: XXXXX" vem junto, o clique
 * é encontrado direto no banco. Quando a pessoa apaga o código (acontece), a
 * frase ainda diz de onde ela veio — e serve para filtrar, entre os cliques
 * recentes ainda sem lead, quais podem ser o dela.
 *
 * O catálogo abaixo espelha as mensagens em app/consultoria-online/page.tsx,
 * app/personal-trainer/page.tsx, app/consultoria/page.tsx, lib/cta/registry.ts,
 * lib/sticky/regras.ts, lib/revisao.ts, lib/ferramentas/pos-resultado.ts, as
 * ferramentas (diagnóstico, rotina, volume, cardápio, mobilidade, Pergunte)
 * e a mensagem montada no clique em lib/whatsapp.ts. Se uma frase mudar lá
 * e não aqui, o teste em scripts/crm-mensagens-test.ts é quem avisa.
 */

export interface Identificacao {
  /** Código Ref encontrado no texto, já em maiúsculas. */
  ref: string | null;
  /** Nome legível do lugar de onde a mensagem saiu. */
  origem: string | null;
  /** Regex (fonte) que o page_path do handoff precisa casar. */
  pathPadrao: string | null;
  /** Rótulos dos botões que abrem essa frase (cta_id = "text:<rótulo>"). Vazio = qualquer botão da página. */
  botoes: string[];
  /** Serviço provável, se a frase deixa claro. */
  servico: "online" | "presencial" | null;
  /** O que a pessoa escreveu além do texto do botão, se escreveu. */
  complemento: string | null;
  /** Detalhes extraídos de frases com variável (local, título do artigo, ferramenta). */
  extra: Record<string, string>;
}

interface Regra {
  origem: string;
  pathPadrao: string | null;
  botoes?: string[];
  servico?: "online" | "presencial";
  /** Texto fixo (comparado normalizado) ou regex; `grupos` nomeia os grupos de captura na ordem. */
  frase: string | RegExp;
  grupos?: string[];
}

const REGRAS: Regra[] = [
  { origem: "Consultoria Online · topo / barra fixa", pathPadrao: "^/consultoria-online", botoes: ["Falar no WhatsApp agora"], servico: "online",
    frase: "Olá, Montinho! Vi a página da Consultoria Online e queria entender se ela faz sentido para o meu caso." },
  { origem: "Consultoria Online · resultados dos alunos", pathPadrao: "^/consultoria-online", botoes: ["Quero um plano assim para mim"], servico: "online",
    frase: "Olá, Montinho! Vi os resultados dos seus alunos e queria entender como funcionaria comigo." },
  { origem: "Consultoria Online · o que está incluso", pathPadrao: "^/consultoria-online", botoes: ["Quero conversar sobre o meu treino", "Dar o primeiro passo agora"], servico: "online",
    frase: "Olá, Montinho! Vi o que está incluso na consultoria e queria conversar sobre o meu treino." },
  { origem: "Consultoria Online · história do Montinho", pathPadrao: "^/consultoria-online", botoes: ["Quero esse acompanhamento comigo"], servico: "online",
    frase: "Olá, Montinho! Li a sua história e queria entender como seria o acompanhamento no meu caso." },
  { origem: "Consultoria Online · garantia / fechamento", pathPadrao: "^/consultoria-online", botoes: ["Quero a Consultoria Montinho", "Começar sem compromisso"], servico: "online",
    frase: "Olá, Montinho! Queria conversar sobre a Consultoria Online antes de decidir." },
  { origem: "Consultoria Online · FAQ", pathPadrao: "^/consultoria-online", botoes: ["Tirar minha dúvida no WhatsApp"], servico: "online",
    frase: "Olá, Montinho! Li a página da Consultoria Online e fiquei com uma dúvida:" },
  { origem: "Consultoria Online · botão final", pathPadrao: "^/consultoria-online", servico: "online",
    frase: "Olá, Montinho! Quero começar minha consultoria online. Podemos conversar?" },
  { origem: "Página /consultoria · barra fixa", pathPadrao: "^/consultoria$", servico: "online",
    frase: "Olá, Montinho! Estou na página da consultoria e queria entender se ela faz sentido para o meu caso." },
  { origem: "Barra fixa · serviço online", pathPadrao: null, servico: "online",
    frase: "Olá, Montinho! Estava lendo sobre o acompanhamento online e queria tirar uma dúvida antes de decidir." },
  { origem: "Landing page /personal-trainer (tráfego pago)", pathPadrao: "^/personal-trainer/?$", servico: "presencial",
    frase: "Olá, Montinho! Vi sua página e quero saber como funciona o acompanhamento. Pode me explicar?" },
  { origem: "Página local · barra fixa", pathPadrao: "personal-trainer|alphaville|tambore|barueri|parnaiba|aldeia", servico: "presencial",
    frase: /^Olá, Montinho! Vi sua página sobre personal trainer (?:em|no) (.+?) e queria saber como funciona o atendimento\.?$/, grupos: ["local"] },
  { origem: "Artigo do blog · barra fixa (leitor recorrente)", pathPadrao: "^/blog/",
    frase: /^Olá, Montinho! Já li alguns conteúdos seus — hoje estava em "(.+?)" — e queria conversar sobre o meu caso\.?$/, grupos: ["titulo"] },
  { origem: "Blog · barra fixa (leitor recorrente)", pathPadrao: "^/blog/",
    frase: "Olá, Montinho! Já li alguns conteúdos seus e queria conversar sobre o meu caso." },
  { origem: "Artigo do blog · revisão de execução", pathPadrao: "^/blog/",
    frase: /^Oi, Montinho! Vim pelo artigo "(.+?)" e queria a revisão gratuita da minha execução\./, grupos: ["titulo"] },
  { origem: "Site · revisão de execução", pathPadrao: null,
    frase: /^Oi, Montinho! Vim pelo site e queria a revisão gratuita da minha execução\./ },
  { origem: "Ferramenta · depois do resultado", pathPadrao: "^/ferramentas/",
    frase: /^Olá, Montinho! Usei a (.+?) no seu site(?: e meu resultado foi (.+?))?\. (.+)$/, grupos: ["ferramenta", "resultado", "pedido"] },
  { origem: "Botão do site (montado no clique)", pathPadrao: null,
    frase: /^Olá, Montinho! Estou no seu site, na página «(.+?)», e cliquei no (.+?)\. Queria saber como funciona o acompanhamento\.?$/, grupos: ["titulo", "botao"] },
  { origem: "Artigo do blog · CTA regional", pathPadrao: "^/blog/", botoes: ["Falar pelo WhatsApp"], servico: "presencial",
    frase: /^Oi, Montinho! Vim pelo blog e queria saber sobre acompanhamento presencial (?:em|no) (.+?)\.?$/, grupos: ["local"] },
  { origem: "Página /consultoria · topo", pathPadrao: "^/consultoria$",
    frase: "Olá! Vi a página de consultoria e quero saber como funciona o acompanhamento." },
  { origem: "Página /consultoria · card Personal Presencial", pathPadrao: "^/consultoria$", servico: "presencial",
    frase: "Olá! Tenho interesse no Personal Presencial em Alphaville. Pode me contar mais?" },
  { origem: "Página /consultoria · card Consultoria Online", pathPadrao: "^/consultoria$", servico: "online",
    frase: "Olá! Tenho interesse na Consultoria Online. Pode me contar mais sobre como funciona?" },
  { origem: "Página /consultoria · card Modelo Híbrido", pathPadrao: "^/consultoria$",
    frase: "Olá! Tenho interesse no Modelo Híbrido (presencial + online). Pode me contar mais?" },
  { origem: "Diagnóstico Montinho · resultado", pathPadrao: "^/diagnostico",
    frase: /^Oi, Montinho! Fiz o Diagnóstico Montinho no site\./ },
  { origem: "Treino para Minha Rotina · resultado", pathPadrao: "rotina",
    frase: /^Oi, Montinho! Fiz o Treino Para Minha Rotina no seu site\./ },
  { origem: "Calculadora de Volume · análise", pathPadrao: "volume",
    frase: /^Oi, Montinho! Analisei meu treino na Calculadora de Volume do seu site/ },
  { origem: "Pergunte ao Montinho", pathPadrao: "^/pergunte-ao-montinho",
    frase: /^Oi, Montinho! Vim pelo Pergunte ao Montinho no seu site\./ },
  { origem: "Monte seu Cardápio · resultado", pathPadrao: "cardapio",
    frase: /^Oi, Montinho! Montei meu cardápio no seu site\./ },
  { origem: "Teste de Mobilidade", pathPadrao: "mobilidade",
    frase: /^Oi,? Montinho! Fiz o teste de mobilidade/ },
  { origem: "Botão padrão do site (frase genérica, sem JavaScript)", pathPadrao: null,
    frase: "Olá, Montinho! Vim pelo seu site e tenho interesse no seu acompanhamento. Gostaria de saber como funciona e qual opção é mais indicada para mim." },
];

const REF = /\bRef:?\s*([A-Z0-9]{5})\b/i;

export function extrairRef(texto: string): string | null {
  const m = texto.match(REF);
  return m ? m[1].toUpperCase() : null;
}

/** Só espaços e aspas variam de um celular para outro; o resto é o que o site escreveu. */
function normalizar(t: string): string {
  return t.replace(REF, "").replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim();
}

export function identificarMensagem(texto: string): Identificacao {
  const ref = extrairRef(texto);
  const vazio: Identificacao = { ref, origem: null, pathPadrao: null, botoes: [], servico: null, complemento: null, extra: {} };
  const t = normalizar(texto);
  if (!t) return vazio;
  for (const r of REGRAS) {
    if (typeof r.frase === "string") {
      const f = normalizar(r.frase);
      if (t === f || t.startsWith(f)) {
        const resto = t.slice(f.length).trim();
        return { ref, origem: r.origem, pathPadrao: r.pathPadrao, botoes: r.botoes ?? [], servico: r.servico ?? null, complemento: resto || null, extra: {} };
      }
    } else {
      const m = t.match(r.frase);
      if (m) {
        const extra: Record<string, string> = {};
        (r.grupos ?? []).forEach((k, i) => { const v = m[i + 1]; if (v) extra[k] = v; });
        return { ref, origem: r.origem, pathPadrao: r.pathPadrao, botoes: r.botoes ?? [], servico: r.servico ?? null, complemento: null, extra };
      }
    }
  }
  return vazio;
}

/** Um clique registrado no site pode ser o desta mensagem? */
export function handoffCompativel(h: { page_path: string | null; cta_id: string | null; page_title?: string | null }, id: Identificacao): boolean {
  if (!id.origem) return false;
  if (id.pathPadrao && !(h.page_path && new RegExp(id.pathPadrao).test(h.page_path))) return false;
  if (id.botoes.length && h.cta_id && !id.botoes.some((b) => h.cta_id === `text:${b}` || h.cta_id === `aria:${b}`)) return false;
  // Mensagem montada no clique carrega o título da página: o clique precisa ser da mesma página.
  if (id.extra.titulo && !id.pathPadrao && h.page_title != null) {
    const semMarca = (t: string) => t.replace(/\s*[|—–-]\s*Montinho(?: Personal Trainer)?\s*$/i, "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!semMarca(h.page_title).includes(semMarca(id.extra.titulo))) return false;
  }
  return true;
}

/** Texto curto para o campo "detalhe" do lead, quando não há campanha. */
export function detalheDaIdentificacao(id: Identificacao): string | null {
  if (!id.origem) return null;
  const partes = [id.origem];
  if (id.extra.local) partes.push(id.extra.local);
  if (id.extra.titulo) partes.push(`"${id.extra.titulo}"`);
  if (id.extra.botao) partes.push(id.extra.botao);
  if (id.extra.ferramenta) partes.push(id.extra.ferramenta);
  return partes.join(" · ");
}

/**
 * Para o teste que espelha o site: um começo de frase (cortado onde o site
 * interpola uma variável) pertence a alguma regra do catálogo?
 */
export function reconheceInicio(prefixo: string): boolean {
  const p = normalizar(prefixo);
  if (!p) return false;
  return REGRAS.some((r) => {
    const fixo = typeof r.frase === "string"
      ? normalizar(r.frase)
      : normalizar(r.frase.source.replace(/^\^/, "").split("(")[0].replace(/\\(.)/g, "$1"));
    return fixo.startsWith(p) || p.startsWith(fixo);
  });
}
