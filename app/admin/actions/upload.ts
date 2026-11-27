"use server";

import { put } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin";

const IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const PDF_TYPE = "application/pdf";
const MAX_IMAGE = 5 * 1024 * 1024;
const MAX_PDF = 10 * 1024 * 1024;

export type UploadResult = { ok: boolean; url?: string; error?: string };

export async function uploadFile(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return { ok: false, error: "Upload não configurado (BLOB_READ_WRITE_TOKEN ausente)." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Nenhum arquivo selecionado." };
  }

  const isImage = IMAGE_TYPES.has(file.type);
  const isPdf = file.type === PDF_TYPE;
  if (!isImage && !isPdf) {
    return { ok: false, error: "Tipo não permitido. Use PNG, JPG, WebP ou PDF." };
  }
  const max = isPdf ? MAX_PDF : MAX_IMAGE;
  if (file.size > max) {
    return { ok: false, error: `Arquivo muito grande (máx. ${max / 1024 / 1024} MB).` };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
  const blob = await put(`uploads/${Date.now()}-${safeName}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return { ok: true, url: blob.url };
}
