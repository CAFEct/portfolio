import type { experiences } from "@/db/schema";
import { Checkbox, Field, TextArea, TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/submit-button";

type Experience = typeof experiences.$inferSelect;

export default function ExperienceForm({
  action,
  experience,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  experience?: Experience;
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
        <Field label="Cargo" htmlFor="role">
          <TextInput id="role" name="role" required defaultValue={experience?.role} />
        </Field>
        <Field label="Cargo (EN)" htmlFor="roleEn">
          <TextInput id="roleEn" name="roleEn" defaultValue={experience?.roleEn ?? ""} />
        </Field>
        <Field label="Empresa" htmlFor="company">
          <TextInput id="company" name="company" required defaultValue={experience?.company} />
        </Field>
        <Field label="Período" htmlFor="period" hint='Ex.: "2023 — Presente"'>
          <TextInput id="period" name="period" required defaultValue={experience?.period} />
        </Field>
        <Field label="Ordem" htmlFor="sortOrder">
          <TextInput id="sortOrder" name="sortOrder" type="number" defaultValue={experience?.sortOrder ?? 0} />
        </Field>
      </div>

      <Field label="Descrição" htmlFor="description">
        <TextArea id="description" name="description" rows={4} defaultValue={experience?.description ?? ""} />
      </Field>
      <Field label="Descrição (EN)" htmlFor="descriptionEn">
        <TextArea id="descriptionEn" name="descriptionEn" rows={4} defaultValue={experience?.descriptionEn ?? ""} />
      </Field>

      <Checkbox id="isVisible" name="isVisible" label="Visível no site" defaultChecked={experience?.isVisible ?? true} />

      <SubmitButton>{experience ? "Salvar" : "Criar"}</SubmitButton>
    </form>
  );
}
