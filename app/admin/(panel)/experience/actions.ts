"use server";

import { asc, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { experiences } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { experienceSchema } from "@/lib/validation";

const LIST = "/admin/experience";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function parse(fd: FormData) {
  return experienceSchema.safeParse({
    role: str(fd, "role"),
    roleEn: str(fd, "roleEn") || undefined,
    company: str(fd, "company"),
    period: str(fd, "period"),
    description: str(fd, "description") || undefined,
    descriptionEn: str(fd, "descriptionEn") || undefined,
    isVisible: str(fd, "isVisible") === "on",
    sortOrder: str(fd, "sortOrder") || undefined,
  });
}

function fail(back: string, msg: string): never {
  redirect(`${back}?error=${encodeURIComponent(msg)}`);
}

function revalidate() {
  revalidatePath("/");
}

export async function createExperience(formData: FormData) {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) fail(LIST, parsed.error.issues[0]?.message ?? "Dados inválidos");
  const [row] = await db.insert(experiences).values(parsed.data).returning();
  revalidate();
  redirect(`${LIST}/${row.id}/edit?saved=1`);
}

export async function updateExperience(id: string, formData: FormData) {
  await requireAdmin();
  const back = `${LIST}/${id}/edit`;
  const parsed = parse(formData);
  if (!parsed.success) fail(back, parsed.error.issues[0]?.message ?? "Dados inválidos");
  await db.update(experiences).set(parsed.data).where(eq(experiences.id, id));
  revalidate();
  redirect(`${LIST}?saved=1`);
}

export async function deleteExperience(id: string) {
  await requireAdmin();
  await db.delete(experiences).where(eq(experiences.id, id));
  revalidate();
  redirect(`${LIST}?deleted=1`);
}

export async function toggleExperience(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(experiences).where(eq(experiences.id, id)).limit(1);
  if (row) {
    await db.update(experiences).set({ isVisible: !row.isVisible }).where(eq(experiences.id, id));
  }
  revalidate();
  redirect(LIST);
}

export async function moveExperience(id: string, direction: "up" | "down") {
  await requireAdmin();
  const rows = await db
    .select({ id: experiences.id, sortOrder: experiences.sortOrder })
    .from(experiences)
    .orderBy(asc(experiences.sortOrder), desc(experiences.createdAt));
  const idx = rows.findIndex((r) => r.id === id);
  const target = rows[idx + (direction === "up" ? -1 : 1)];
  const current = rows[idx];
  if (!target || !current || idx === -1) redirect(LIST);
  await db.update(experiences).set({ sortOrder: target.sortOrder }).where(eq(experiences.id, current.id));
  await db.update(experiences).set({ sortOrder: current.sortOrder }).where(eq(experiences.id, target.id));
  revalidate();
  redirect(LIST);
}
