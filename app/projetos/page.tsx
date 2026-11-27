import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { getProjectsPublic } from "@/lib/queries";

export default async function ProjetosPage() {
  const projects = await getProjectsPublic().catch(() => []);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <h1 className="chrome-text font-display text-5xl font-extrabold">Projetos</h1>
      <p className="mt-3 text-white/70">Tudo que já construí, do e-commerce ao hardware.</p>

      {projects.length === 0 ? (
        <p className="glass mt-10 p-8 text-center text-white/60">Nenhum projeto publicado ainda.</p>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/projetos/${p.slug}`} className="block">
                <GlassCard className="flex h-full flex-col transition hover:border-cyan-300/60">
                  <h2 className="font-display text-2xl font-bold">{p.title}</h2>
                  <p className="mt-3 flex-1 text-white/75">{p.description}</p>
                  <ul className="mt-5 flex flex-wrap gap-2 text-sm">
                    {p.stack.map((tech) => (
                      <li key={tech} className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
