import LoginForm from "./LoginForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  const sp = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl font-semibold">Montinho · CRM</h1>
        <p className="mt-1 text-sm text-zinc-400">Centro de comando comercial. Acesso restrito.</p>
        {sp.erro && <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{sp.erro}</p>}
        <LoginForm next={sp.next ?? "/crm"} />
      </div>
    </div>
  );
}
