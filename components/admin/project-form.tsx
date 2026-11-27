import type { projects } from "@/db/schema";
import { Checkbox, Field, TextArea, TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/submit-button";
import UploadInput from "@/components/admin/upload-input";

type Project = typeof projects.$inferSelect;

export default function ProjectForm({
  action,
  project,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  project?: Project;
  error?: string;
}) {
  return (
    <form action={action} className="glass max-w-3xl space-y-5 p-6 md:p-8">
      {error ? (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Título" htmlFor="title">
          <TextInput id="title" name="title" required defaultValue={project?.title} />
        </Field>
        <Field label="Título (EN)" htmlFor="titleEn">
          <TextInput id="titleEn" name="titleEn" defaultValue={project?.titleEn ?? ""} />
        </Field>
        <Field label="Slug" htmlFor="slug" hint="Vazio = gerado do título.">
          <TextInput id="slug" name="slug" defaultValue={project?.slug ?? ""} placeholder="meu-projeto" />
        </Field>
        <Field label="Ordem" htmlFor="sortOrder" hint="Menor aparece primeiro.">
          <TextInput id="sortOrder" name="sortOrder" type="number" defaultValue={project?.sortOrder ?? 0} />
        </Field>
      </div>

      <Field label="Descrição curta" htmlFor="description">
        <TextArea id="description" name="description" required rows={2} defaultValue={project?.description} />
      </Field>
      <Field label="Descrição curta (EN)" htmlFor="descriptionEn">
        <TextArea id="descriptionEn" name="descriptionEn" rows={2} defaultValue={project?.descriptionEn ?? ""} />
      </Field>
      <Field label="Descrição longa" htmlFor="longDescription">
        <TextArea id="longDescription" name="longDescription" rows={6} defaultValue={project?.longDescription ?? ""} />
      </Field>
      <Field label="Descrição longa (EN)" htmlFor="longDescriptionEn">
        <TextArea id="longDescriptionEn" name="longDescriptionEn" rows={6} defaultValue={project?.longDescriptionEn ?? ""} />
      </Field>
      <Field label="Stack" htmlFor="stack" hint="Uma tecnologia por linha.">
        <TextArea id="stack" name="stack" rows={4} defaultValue={project?.stack.join("\n") ?? ""} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Imagem" htmlFor="imageUrl" hint="Envie PNG/JPG/WebP ou cole um link.">
          <UploadInput
            name="imageUrl"
            accept="image/png,image/jpeg,image/webp"
            defaultValue={project?.imageUrl ?? ""}
          />
        </Field>
        <Field label="Link do projeto" htmlFor="liveUrl">
          <TextInput id="liveUrl" name="liveUrl" type="url" defaultValue={project?.liveUrl ?? ""} />
        </Field>
        <Field label="Repositório" htmlFor="repoUrl">
          <TextInput id="repoUrl" name="repoUrl" type="url" defaultValue={project?.repoUrl ?? ""} />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Checkbox id="isFeatured" name="isFeatured" label="Destaque na home" defaultChecked={project?.isFeatured} />
        <Checkbox id="isVisible" name="isVisible" label="Visível no site" defaultChecked={project?.isVisible ?? true} />
      </div>

      <div className="flex gap-3">
        <SubmitButton>{project ? "Salvar" : "Criar"}</SubmitButton>
      </div>
    </form>
  );
}
