import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import SkillForm from "@/components/admin/skill-form";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { updateSkill } from "../../actions";

export default async function EditSkillPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const rows = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  const skill = rows[0];
  if (!skill) notFound();

  return (
    <div>
      <Link href="/admin/skills" className="text-sm text-white/60 hover:text-white">← Voltar</Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Editar habilidade</h1>
      {sp.saved ? <p className="mt-3 text-sm text-emerald-300">Salvo.</p> : null}
      <div className="mt-6">
        <SkillForm action={updateSkill.bind(null, skill.id)} skill={skill} error={sp.error} />
      </div>
    </div>
  );
}
