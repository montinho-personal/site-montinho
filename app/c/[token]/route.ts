import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/crm/supabase/server";
import { destinoComUtm, destinoValido } from "@/lib/crm/conteudo";

/**
 * Link de conteúdo enviado a um lead: /c/TOKEN.
 *
 * O token não diz de quem é. Quem traduz token em lead é a função no banco,
 * e ela não devolve o lead — devolve só para onde ir. Assim o link pode ser
 * encaminhado, printado ou colado num grupo sem vazar nada da pessoa.
 *
 * Token desconhecido não é erro visível: manda para a home, como qualquer
 * link velho. Dizer "esse código não existe" só serviria para alguém
 * descobrir, por tentativa, quais existem.
 */
export async function GET(req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const origem = new URL(req.url).origin;
  const limpo = token.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 16);
  const home = () => {
    const r = NextResponse.redirect(new URL("/", origem), 302);
    r.headers.set("X-Robots-Tag", "noindex, nofollow");
    return r;
  };
  if (!limpo) return home();

  let destino: string | null = null;
  try {
    const { data } = await supabaseAnon().rpc("crm_conteudo_clique", { tok: limpo });
    destino = typeof data === "string" ? data : null;
  } catch {
    // O banco fora do ar não pode transformar o link numa página de erro:
    // a pessoa clicou para ler um artigo, não para saber do nosso CRM.
    return home();
  }
  // Cinto e suspensório: o banco já restringe o destino a um caminho do
  // próprio site, e aqui se confere de novo. Redirecionador aberto é como um
  // domínio confiável vira ferramenta de golpe.
  if (!destino || !destinoValido(destino.split("?")[0])) return home();

  const r = NextResponse.redirect(new URL(destinoComUtm(destino, limpo), origem), 302);
  r.headers.set("X-Robots-Tag", "noindex, nofollow");
  return r;
}
