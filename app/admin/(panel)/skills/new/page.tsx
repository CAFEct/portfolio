import Link from "next/link";
import SkillForm from "@/components/admin/skill-form";
import { createSkill } from "../actions";

export default async function NewSkillPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <Link href="/admin/skills" className="text-sm text-white/60 hover:text-white">← Voltar</Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Nova habilidade</h1>
      <div className="mt-6">
        <SkillForm action={createSkill} error={error} />
      </div>
    </div>
  );
}
