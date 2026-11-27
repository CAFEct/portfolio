"use server";

import { db } from "@/db";
import {
  certificates,
  experiences,
  messages,
  projects,
  siteSettings,
  skills,
  videos,
} from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const TABLES = [certificates, projects, experiences, skills, videos, messages, siteSettings] as const;

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export async function importBackup(formData: FormData) {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/backup?error=" + encodeURIComponent("Selecione um arquivo JSON."));
  }
  if (file.size > 10 * 1024 * 1024) {
    redirect("/admin/backup?error=" + encodeURIComponent("Arquivo muito grande (máx. 10 MB)."));
  }

  let data: unknown;
  try {
    data = JSON.parse(await file.text());
  } catch {
    redirect("/admin/backup?error=" + encodeURIComponent("JSON inválido."));
  }

  if (!isRecord(data)) {
    redirect("/admin/backup?error=" + encodeURIComponent("Formato de backup inválido."));
  }

  const sections: [string, (typeof TABLES)[number]][] = [
    ["certificates", certificates],
    ["projects", projects],
    ["experiences", experiences],
    ["skills", skills],
    ["videos", videos],
    ["messages", messages],
    ["siteSettings", siteSettings],
  ];

  try {
    for (const [key, table] of sections) {
      const rows = data[key];
      if (!Array.isArray(rows)) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.delete(table as any);
      if (rows.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await db.insert(table as any).values(rows as any[]);
      }
    }
  } catch {
    redirect("/admin/backup?error=" + encodeURIComponent("Falha ao importar. Verifique se o JSON é um backup válido."));
  }

  revalidatePath("/");
  revalidatePath("/certificados");
  revalidatePath("/projetos");
  redirect("/admin/backup?saved=1");
}
