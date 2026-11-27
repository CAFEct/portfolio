import type { certificates } from "@/db/schema";
import { Checkbox, Field, TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/submit-button";
import UploadInput from "@/components/admin/upload-input";

type Certificate = typeof certificates.$inferSelect;

export default function CertificateForm({
  action,
  certificate,
  error,
}: {
  action: (formData: FormData) => Promise<void>;
  certificate?: Certificate;
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
        <Field label="Título" htmlFor="title" className="sm:col-span-2">
          <TextInput id="title" name="title" required defaultValue={certificate?.title} />
        </Field>
        <Field label="Título (EN)" htmlFor="titleEn">
          <TextInput id="titleEn" name="titleEn" defaultValue={certificate?.titleEn ?? ""} />
        </Field>
        <Field label="Emissor" htmlFor="issuer">
          <TextInput id="issuer" name="issuer" defaultValue={certificate?.issuer ?? ""} />
        </Field>
        <Field label="Categoria" htmlFor="category">
          <TextInput id="category" name="category" required defaultValue={certificate?.category ?? "Geral"} />
        </Field>
        <Field label="Ano" htmlFor="year">
          <TextInput id="year" name="year" type="number" min={1900} max={2100} defaultValue={certificate?.year ?? ""} />
        </Field>
        <Field label="Ordem" htmlFor="sortOrder" hint="Menor aparece primeiro.">
          <TextInput id="sortOrder" name="sortOrder" type="number" defaultValue={certificate?.sortOrder ?? 0} />
        </Field>
      </div>

      <Field label="Arquivo PDF" htmlFor="pdfUrl" hint="Envie o PDF ou cole um link https://…">
        <UploadInput
          name="pdfUrl"
          accept="application/pdf"
          defaultValue={certificate?.pdfUrl ?? ""}
        />
      </Field>
      <Field label="Link de verificação" htmlFor="credentialUrl">
        <TextInput id="credentialUrl" name="credentialUrl" type="url" defaultValue={certificate?.credentialUrl ?? ""} />
      </Field>

      <div className="flex flex-wrap items-center gap-6">
        <Checkbox
          id="isVisible"
          name="isVisible"
          label="Visível no site"
          defaultChecked={certificate?.isVisible ?? true}
        />
      </div>

      <div className="flex gap-3">
        <SubmitButton>{certificate ? "Salvar" : "Criar"}</SubmitButton>
      </div>
    </form>
  );
}
