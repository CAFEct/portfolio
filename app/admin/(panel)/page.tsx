import Link from "next/link";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { certificates, projects } from "@/db/schema";
import { getUnreadMessageCount } from "@/lib/queries";
import { getAnalyticsSummary } from "@/lib/analytics";
import GlassCard from "@/components/GlassCard";

function ViewsChart({ daily }: { daily: { day: string; views: number }[] }) {
  const max = Math.max(1, ...daily.map((d) => d.views));
  return (
    <div>
      <div className="flex h-32 items-end gap-1">
        {daily.map((d) => (
          <div
            key={d.day}
            title={`${d.day}: ${d.views} views`}
            className="flex-1 rounded-t bg-gradient-to-t from-aero-blue to-aero-cyan"
            style={{ height: `${Math.max(4, (d.views / max) * 100)}%` }}
          />
        ))}
        {daily.length === 0 ? <p className="text-sm text-white/50">Sem dados ainda.</p> : null}
      </div>
      <div className="mt-2 flex justify-between text-xs text-white/40">
        <span>{daily[0]?.day ?? ""}</span>
        <span>{daily[daily.length - 1]?.day ?? ""}</span>
      </div>
    </div>
  );
}

function TopList({ title, items, label }: { title: string; items: { path: string; n: number }[]; label: string }) {
  return (
    <GlassCard>
      <h3 className="font-display text-lg font-bold text-cyan-200">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-white/50">Sem dados ainda.</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.path} className="flex justify-between gap-3">
              <span className="truncate text-white/80">{item.path}</span>
              <span className="shrink-0 text-white/50">
                {item.n} {label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

export default async function AdminDashboard() {
  const [[{ certs }], [{ projects: projectCount }], unread, analytics] = await Promise.all([
    db.select({ certs: count() }).from(certificates),
    db.select({ projects: count() }).from(projects),
    getUnreadMessageCount(),
    getAnalyticsSummary().catch(() => null),
  ]);

  const cards = [
    { label: "Certificados", value: certs, href: "/admin/certificates" },
    { label: "Projetos", value: projectCount, href: "/admin/projects" },
    { label: "Mensagens não lidas", value: unread, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-white/60">Visão geral do conteúdo e das métricas do site.</p>

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

      {analytics ? (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-bold">Analytics</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <GlassCard>
              <p className="text-sm text-white/60">Visualizações totais</p>
              <p className="mt-2 font-display text-3xl font-extrabold">{analytics.pageViews}</p>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-white/60">Cliques em projetos</p>
              <p className="mt-2 font-display text-3xl font-extrabold">{analytics.projectClicks}</p>
            </GlassCard>
            <GlassCard>
              <p className="text-sm text-white/60">Downloads de PDF</p>
              <p className="mt-2 font-display text-3xl font-extrabold">{analytics.pdfDownloads}</p>
            </GlassCard>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <GlassCard className="lg:col-span-1">
              <h3 className="font-display text-lg font-bold text-cyan-200">Views — últimos 30 dias</h3>
              <div className="mt-4">
                <ViewsChart daily={analytics.daily} />
              </div>
            </GlassCard>
            <TopList
              title="Top projetos"
              items={analytics.topProjects.map((p) => ({ path: p.path, n: p.clicks }))}
              label="cliques"
            />
            <TopList
              title="Top certificados (PDFs)"
              items={analytics.topPdfs.map((p) => ({ path: p.path, n: p.downloads }))}
              label="downloads"
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
