import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { signOut } from "@/auth";
import { Suspense } from "react";
import { getUnreadMessageCount } from "@/lib/queries";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projetos" },
  { href: "/admin/certificates", label: "Certificados" },
  { href: "/admin/experience", label: "Experiência" },
  { href: "/admin/skills", label: "Habilidades" },
  { href: "/admin/videos", label: "Vídeos" },
  { href: "/admin/messages", label: "Mensagens" },
  { href: "/admin/settings", label: "Configurações" },
];

async function logout() {
  "use server";
  await signOut({ redirectTo: "/" });
}

async function UnreadBadge() {
  const count = await getUnreadMessageCount();
  if (count === 0) return null;
  return (
    <span className="ml-auto rounded-full bg-cyan-400 px-2 py-0.5 text-xs font-bold text-black">
      {count}
    </span>
  );
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="glass sticky top-0 flex h-screen w-56 shrink-0 flex-col gap-1 overflow-y-auto rounded-none border-y-0 border-l-0 p-4">
        <Link href="/admin" className="chrome-text mb-4 px-2 font-display text-xl font-extrabold">
          CAFÉ Admin
        </Link>
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            {item.label}
            {item.href === "/admin/messages" ? (
              <Suspense fallback={null}>
                <UnreadBadge />
              </Suspense>
            ) : null}
          </Link>
        ))}
        <div className="mt-auto space-y-2 border-t border-white/15 pt-4">
          <Link href="/" className="block px-3 py-1.5 text-xs text-white/60 hover:text-white">
            ← Ver site
          </Link>
          <p className="truncate px-3 text-xs text-white/40">{session.user?.email}</p>
          <form action={logout}>
            <button type="submit" className="w-full rounded-lg px-3 py-1.5 text-left text-xs text-white/60 hover:bg-white/10 hover:text-white">
              Sair
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-6 md:p-10">
        <Suspense fallback={<p className="text-white/50">Carregando…</p>}>{children}</Suspense>
      </main>
    </div>
  );
}
