import Link from "next/link";
import { getTranslations } from "next-intl/server";
import GlassCard from "@/components/GlassCard";
import { getContentLocale, pickLocalized } from "@/lib/i18n";
import { getProjectsPublic } from "@/lib/queries";

export default async function ProjetosPage() {
  const [t, locale, projects] = await Promise.all([
    getTranslations("projetos"),
    getContentLocale(),
    getProjectsPublic().catch(() => []),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <h1 className="chrome-text font-display text-5xl font-extrabold">{t("titulo")}</h1>
      <p className="mt-3 text-white/70">{t("subtitulo")}</p>

      {projects.length === 0 ? (
        <p className="glass mt-10 p-8 text-center text-white/60">{t("vazio")}</p>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id}>
              <Link href={`/projetos/${p.slug}`} className="block" data-track="project_click">
                <GlassCard className="flex h-full flex-col transition hover:border-cyan-300/60">
                  <h2 className="font-display text-2xl font-bold">
                    {pickLocalized(p.title, p.titleEn, locale)}
                  </h2>
                  <p className="mt-3 flex-1 text-white/75">
                    {pickLocalized(p.description, p.descriptionEn, locale)}
                  </p>
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
