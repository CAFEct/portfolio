import type { videos } from "@/db/schema";
import { Checkbox, Field, TextArea, TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/submit-button";

type Video = typeof videos.$inferSelect;

export default function VideoForm({
  action,
  video,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  video?: Video;
  error?: string;
}) {
  return (
    <form action={action} className="glass max-w-2xl space-y-5 p-6 md:p-8">
      {error ? (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <Field label="Título" htmlFor="title">
        <TextInput id="title" name="title" required defaultValue={video?.title} />
      </Field>
      <Field label="Título (EN)" htmlFor="titleEn">
        <TextInput id="titleEn" name="titleEn" defaultValue={video?.titleEn ?? ""} />
      </Field>
      <Field
        label="Vídeo do YouTube"
        htmlFor="youtube"
        hint="Cole a URL completa (watch, youtu.be, shorts) ou o ID do vídeo."
      >
        <TextInput
          id="youtube"
          name="youtube"
          required
          defaultValue={video ? `https://www.youtube.com/watch?v=${video.youtubeId}` : ""}
          placeholder="https://www.youtube.com/watch?v=…"
        />
      </Field>
      <Field label="Descrição" htmlFor="description">
        <TextArea id="description" name="description" rows={3} defaultValue={video?.description ?? ""} />
      </Field>
      <Field label="Descrição (EN)" htmlFor="descriptionEn">
        <TextArea id="descriptionEn" name="descriptionEn" rows={3} defaultValue={video?.descriptionEn ?? ""} />
      </Field>
      <Field label="Ordem" htmlFor="sortOrder">
        <TextInput id="sortOrder" name="sortOrder" type="number" defaultValue={video?.sortOrder ?? 0} />
      </Field>

      <Checkbox id="isVisible" name="isVisible" label="Visível no site" defaultChecked={video?.isVisible ?? true} />

      <SubmitButton>{video ? "Salvar" : "Criar"}</SubmitButton>
    </form>
  );
}
