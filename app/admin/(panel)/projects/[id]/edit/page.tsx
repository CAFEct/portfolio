import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/project-form";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { updateProject } from "../../actions";

export default async function EditProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const rows = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  const project = rows[0];
  if (!project) notFound();

  return (
    <div>
      <Link href="/admin/projects" className="text-sm text-white/60 hover:text-white">
        ← Voltar
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Editar projeto</h1>
      {sp.saved ? <p className="mt-3 text-sm text-emerald-300">Salvo.</p> : null}
      <div className="mt-6">
        <ProjectForm
          action={updateProject.bind(null, project.id)}
          project={project}
          error={sp.error}
        />
      </div>
    </div>
  );
}
