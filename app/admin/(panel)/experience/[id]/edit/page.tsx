import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import ExperienceForm from "@/components/admin/experience-form";
import { db } from "@/db";
import { experiences } from "@/db/schema";
import { updateExperience } from "../../actions";

export default async function EditExperiencePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const rows = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  const experience = rows[0];
  if (!experience) notFound();

  return (
    <div>
      <Link href="/admin/experience" className="text-sm text-white/60 hover:text-white">← Voltar</Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Editar experiência</h1>
      {sp.saved ? <p className="mt-3 text-sm text-emerald-300">Salvo.</p> : null}
      <div className="mt-6">
        <ExperienceForm
          action={updateExperience.bind(null, experience.id)}
          experience={experience}
          error={sp.error}
        />
      </div>
    </div>
  );
}
