"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { certificates } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { certificateSchema } from "@/lib/validation";

const LIST = "/admin/certificates";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function parseCertificate(fd: FormData) {
  return certificateSchema.safeParse({
    title: str(fd, "title"),
    titleEn: str(fd, "titleEn") || undefined,
    issuer: str(fd, "issuer") || undefined,
    category: str(fd, "category") || "Geral",
    year: str(fd, "year") || undefined,
    pdfUrl: str(fd, "pdfUrl") || undefined,
    credentialUrl: str(fd, "credentialUrl") || undefined,
    isVisible: str(fd, "isVisible") === "on",
    sortOrder: str(fd, "sortOrder") || undefined,
  });
}

function fail(back: string, msg: string): never {
  redirect(`${back}?error=${encodeURIComponent(msg)}`);
}

export async function createCertificate(formData: FormData) {
  await requireAdmin();
  const parsed = parseCertificate(formData);
  if (!parsed.success) fail(LIST, parsed.error.issues[0]?.message ?? "Dados inválidos");
  const [row] = await db.insert(certificates).values(parsed.data).returning();
  revalidatePath("/certificados");
  revalidatePath("/");
  redirect(`${LIST}/${row.id}/edit`);
}

export async function updateCertificate(id: string, formData: FormData) {
  await requireAdmin();
  const back = `${LIST}/${id}/edit`;
  const parsed = parseCertificate(formData);
  if (!parsed.success) fail(back, parsed.error.issues[0]?.message ?? "Dados inválidos");
  await db.update(certificates).set(parsed.data).where(eq(certificates.id, id));
  revalidatePath("/certificados");
  revalidatePath("/");
  redirect(`${LIST}?saved=1`);
}

export async function deleteCertificate(id: string) {
  await requireAdmin();
  await db.delete(certificates).where(eq(certificates.id, id));
  revalidatePath("/certificados");
  revalidatePath("/");
  redirect(`${LIST}?deleted=1`);
}

export async function toggleCertificate(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(certificates).where(eq(certificates.id, id)).limit(1);
  if (row) {
    await db.update(certificates).set({ isVisible: !row.isVisible }).where(eq(certificates.id, id));
  }
  revalidatePath("/certificados");
  revalidatePath("/");
  redirect(LIST);
}
