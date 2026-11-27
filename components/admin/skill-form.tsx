import type { skills } from "@/db/schema";
import { Checkbox, Field, TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/submit-button";

type Skill = typeof skills.$inferSelect;

export default function SkillForm({
  action,
  skill,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  skill?: Skill;
  error?: string;
}) {
  return (
    <form action={action} className="glass max-w-2xl space-y-5 p-6 md:p-8">
      {error ? (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nome" htmlFor="name">
          <TextInput id="name" name="name" required defaultValue={skill?.name} />
        </Field>
        <Field label="Categoria" htmlFor="category" hint='Ex.: "Frontend", "Backend", "Design"'>
          <TextInput id="category" name="category" required defaultValue={skill?.category ?? "Geral"} />
        </Field>
        <Field label="Nível (0–100)" htmlFor="level">
          <TextInput id="level" name="level" type="number" min={0} max={100} required defaultValue={skill?.level ?? 50} />
        </Field>
        <Field label="Ordem" htmlFor="sortOrder">
          <TextInput id="sortOrder" name="sortOrder" type="number" defaultValue={skill?.sortOrder ?? 0} />
        </Field>
      </div>

      <Checkbox id="isVisible" name="isVisible" label="Visível no site" defaultChecked={skill?.isVisible ?? true} />

      <SubmitButton>{skill ? "Salvar" : "Criar"}</SubmitButton>
    </form>
  );
}
