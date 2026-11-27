import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import GlassCard from "@/components/GlassCard";
import { getContentLocale, pickLocalized } from "@/lib/i18n";
import { getProjectBySlug, getProjectsPublic } from "@/lib/queries";

export default async function ProjetoPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, t, locale] = await Promise.all([
    params,
    getTranslations("projetos"),
    getContentLocale(),
  ]);
  const project = await getProjectBySlug(slug).catch(() => null);
  if (!project || !project.isVisible) notFound();

  const others = await getProjectsPublic().catch(() => []);
  const related = others.filter((p) => p.id !== project.id).slice(0, 3);
  const title = pickLocalized(project.title, project.titleEn, locale);
  const description = pickLocalized(project.description, project.descriptionEn, locale);
  const longDescription = pickLocalized(project.longDescription, project.longDescriptionEn, locale);

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-32">
      <Link href="/#projetos" className="text-sm text-white/60 hover:text-white">
        {t("voltar")}
      </Link>
      <h1 className="chrome-text mt-4 font-display text-5xl font-extrabold">{title}</h1>
      <p className="mt-4 text-lg text-white/80">{description}</p>

      {project.stack.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech} className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm">
              {tech}
            </li>
          ))}
        </ul>
      ) : null}

      {longDescription ? (
        <GlassCard className="mt-8">
          <p className="whitespace-pre-line text-white/85">{longDescription}</p>
        </GlassCard>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-4">
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-aero" data-track="project_click">
            {t("verProjeto")}
          </a>
        ) : null}
        {project.repoUrl ? (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" data-track="project_click">
            {t("repositorio")}
          </a>
        ) : null}
      </div>

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold">{t("outrosProjetos")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/projetos/${p.slug}`} data-track="project_click">
                <GlassCard className="h-full transition hover:border-cyan-300/60">
                  <h3 className="font-display text-lg font-bold">
                    {pickLocalized(p.title, p.titleEn, locale)}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-white/70">
                    {pickLocalized(p.description, p.descriptionEn, locale)}
                  </p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
