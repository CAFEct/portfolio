import Link from "next/link";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { certificates, projects } from "@/db/schema";
import { getUnreadMessageCount } from "@/lib/queries";
import GlassCard from "@/components/GlassCard";

export default async function AdminDashboard() {
  const [[{ certs }], [{ projects: projectCount }], unread] = await Promise.all([
    db.select({ certs: count() }).from(certificates),
    db.select({ projects: count() }).from(projects),
    getUnreadMessageCount(),
  ]);

  const cards = [
    { label: "Certificados", value: certs, href: "/admin/certificates" },
    { label: "Projetos", value: projectCount, href: "/admin/projects" },
    { label: "Mensagens não lidas", value: unread, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-white/60">Visão geral do conteúdo do site.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <GlassCard className="transition hover:border-cyan-300/60">
              <p className="text-sm text-white/60">{c.label}</p>
              <p className="mt-2 font-display text-4xl font-extrabold">{c.value}</p>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
