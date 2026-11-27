import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin";
import { signIn, signOut } from "@/auth";
import { Suspense } from "react";

async function login() {
  "use server";
  await signIn("github", { redirectTo: "/admin" });
}

async function logout() {
  "use server";
  await signOut({ redirectTo: "/" });
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return <Suspense fallback={<main className="grid min-h-screen place-items-center">Carregando…</main>}><AdminLoginContent searchParams={searchParams} /></Suspense>;
}

async function AdminLoginContent({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="glass w-full max-w-sm p-8 text-center">
        <h1 className="chrome-text font-display text-3xl font-extrabold">CAFÉ Admin</h1>
        <p className="mt-3 text-sm text-white/70">
          Área restrita. Entre com a conta GitHub autorizada.
        </p>
        {error ? (
          <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            Acesso negado: esta conta não é a administradora.
          </p>
        ) : null}
        <form action={login} className="mt-6">
          <button type="submit" className="btn-aero w-full justify-center">
            Entrar com GitHub
          </button>
        </form>
        <AdminLogoutButton action={logout} />
      </div>
    </main>
  );
}

function AdminLogoutButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action} className="mt-3">
      <button type="submit" className="text-xs text-white/50 underline-offset-2 hover:underline">
        Sair da conta atual
      </button>
    </form>
  );
}
