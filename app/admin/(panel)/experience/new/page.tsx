import Link from "next/link";
import ExperienceForm from "@/components/admin/experience-form";
import { createExperience } from "../actions";

export default async function NewExperiencePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <Link href="/admin/experience" className="text-sm text-white/60 hover:text-white">← Voltar</Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Nova experiência</h1>
      <div className="mt-6">
        <ExperienceForm action={createExperience} error={error} />
      </div>
    </div>
  );
}
