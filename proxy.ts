import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./lib/crm/supabase/config";

/**
 * Proxy (o antigo middleware) do CRM.
 *
 * Duas funções: renovar o cookie de sessão do Supabase a cada request e
 * mandar para o login quem chega em /crm sem sessão. É checagem otimista —
 * a autorização de verdade acontece em lib/crm/auth.ts, dentro de cada
 * página e action, e no RLS do banco.
 *
 * O CRM não é indexável e nunca aparece em sitemap: X-Robots-Tag noindex.
 */
export async function proxy(request: NextRequest) {
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set("x-pathname", request.nextUrl.pathname);
  let response = NextResponse.next({ request: { headers: reqHeaders } });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (all) => {
        for (const { name, value } of all) request.cookies.set(name, value);
        response = NextResponse.next({ request: { headers: reqHeaders } });
        for (const { name, value, options } of all) response.cookies.set(name, value, options);
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;
  const publica = pathname.startsWith("/crm/login") || pathname.startsWith("/crm/auth");
  if (!user && !publica) {
    const url = request.nextUrl.clone();
    url.pathname = "/crm/login";
    url.searchParams.set("next", pathname);
    const r = NextResponse.redirect(url);
    r.headers.set("X-Robots-Tag", "noindex, nofollow");
    return r;
  }
  if (user && pathname === "/crm/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/crm";
    url.search = "";
    return NextResponse.redirect(url);
  }
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = { matcher: ["/crm/:path*"] };
