import Link from "next/link";
import ProjectForm from "@/components/admin/project-form";
import { createProject } from "../actions";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <Link href="/admin/projects" className="text-sm text-white/60 hover:text-white">
        ← Voltar
      </Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Novo projeto</h1>
      <div className="mt-6">
        <ProjectForm action={createProject} error={error} />
      </div>
    </div>
  );
}
