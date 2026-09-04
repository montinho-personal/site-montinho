import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";

/** Cliente para Server Components, Server Actions e Route Handlers, com a sessão do cookie. */
export async function supabaseServer() {
  const store = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (all) => {
        try {
          for (const { name, value, options } of all) store.set(name, value, options);
        } catch {
          // Em Server Component não dá para gravar cookie; o proxy.ts renova a sessão.
        }
      },
    },
  });
}

/** Cliente anônimo, sem cookie: usado pelos endpoints públicos de rastreamento (só INSERT via RLS). */
export function supabaseAnon() {
  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}
