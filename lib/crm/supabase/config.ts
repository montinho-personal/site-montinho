/**
 * Configuração pública do Supabase do CRM.
 *
 * A URL e a chave publishable são públicas por desenho (a proteção é o RLS,
 * não o segredo da chave), então ficam aqui como padrão e a variável de
 * ambiente só sobrescreve. Isso evita depender de configuração na Vercel para
 * o CRM subir. A chave de service role NUNCA entra no código nem no site:
 * nada aqui precisa dela — inserções anônimas passam por RLS de INSERT.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://vsldhkkeijmeculaukee.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_-pEKy11GOfBsDx0MpX0E-g_pxGkTUla";
