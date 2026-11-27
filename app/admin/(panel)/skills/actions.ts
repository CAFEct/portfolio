"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { skills } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { skillSchema } from "@/lib/validation";

const LIST = "/admin/skills";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function parse(fd: FormData) {
  return skillSchema.safeParse({
    name: str(fd, "name"),
    level: str(fd, "level") || "0",
    category: str(fd, "category") || "Geral",
    isVisible: str(fd, "isVisible") === "on",
    sortOrder: str(fd, "sortOrder") || undefined,
  });
}

function fail(back: string, msg: string): never {
  redirect(`${back}?error=${encodeURIComponent(msg)}`);
}

export async function createSkill(formData: FormData) {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.success) fail(LIST, parsed.error.issues[0]?.message ?? "Dados inválidos");
  const [row] = await db.insert(skills).values(parsed.data).returning();
  revalidatePath("/");
  redirect(`${LIST}/${row.id}/edit?saved=1`);
}

export async function updateSkill(id: string, formData: FormData) {
  await requireAdmin();
  const back = `${LIST}/${id}/edit`;
  const parsed = parse(formData);
  if (!parsed.success) fail(back, parsed.error.issues[0]?.message ?? "Dados inválidos");
  await db.update(skills).set(parsed.data).where(eq(skills.id, id));
  revalidatePath("/");
  redirect(`${LIST}?saved=1`);
}

export async function deleteSkill(id: string) {
  await requireAdmin();
  await db.delete(skills).where(eq(skills.id, id));
  revalidatePath("/");
  redirect(`${LIST}?deleted=1`);
}

export async function toggleSkill(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  if (row) {
    await db.update(skills).set({ isVisible: !row.isVisible }).where(eq(skills.id, id));
  }
  revalidatePath("/");
  redirect(LIST);
}
