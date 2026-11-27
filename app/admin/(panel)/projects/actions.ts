"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { projectSchema, slugify } from "@/lib/validation";

const LIST = "/admin/projects";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function parseProject(fd: FormData) {
  const title = str(fd, "title");
  const stack = str(fd, "stack")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  return projectSchema.safeParse({
    title,
    titleEn: str(fd, "titleEn") || undefined,
    slug: str(fd, "slug") || slugify(title),
    description: str(fd, "description"),
    descriptionEn: str(fd, "descriptionEn") || undefined,
    longDescription: str(fd, "longDescription") || undefined,
    longDescriptionEn: str(fd, "longDescriptionEn") || undefined,
    stack,
    imageUrl: str(fd, "imageUrl") || undefined,
    liveUrl: str(fd, "liveUrl") || undefined,
    repoUrl: str(fd, "repoUrl") || undefined,
    isFeatured: str(fd, "isFeatured") === "on",
    isVisible: str(fd, "isVisible") === "on",
    sortOrder: str(fd, "sortOrder") || undefined,
  });
}

function fail(back: string, msg: string): never {
  redirect(`${back}?error=${encodeURIComponent(msg)}`);
}

function revalidate() {
  revalidatePath("/");
  revalidatePath("/projetos");
  revalidatePath("/projetos/[slug]", "page");
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const parsed = parseProject(formData);
  if (!parsed.success) fail(LIST, parsed.error.issues[0]?.message ?? "Dados inválidos");
  const [row] = await db.insert(projects).values(parsed.data).returning();
  revalidate();
  redirect(`${LIST}/${row.id}/edit?saved=1`);
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();
  const back = `${LIST}/${id}/edit`;
  const parsed = parseProject(formData);
  if (!parsed.success) fail(back, parsed.error.issues[0]?.message ?? "Dados inválidos");
  try {
    await db.update(projects).set(parsed.data).where(eq(projects.id, id));
  } catch (e) {
    if (String(e).includes("unique") || String(e).includes("duplicate")) {
      fail(back, "Já existe um projeto com esse slug.");
    }
    throw e;
  }
  revalidate();
  redirect(`${LIST}?saved=1`);
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await db.delete(projects).where(eq(projects.id, id));
  revalidate();
  redirect(`${LIST}?deleted=1`);
}

export async function toggleProject(id: string, field: "isVisible" | "isFeatured") {
  await requireAdmin();
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  if (row) {
    await db.update(projects).set({ [field]: !row[field] }).where(eq(projects.id, id));
  }
  revalidate();
  redirect(LIST);
}

export async function moveProject(id: string, direction: "up" | "down") {
  await requireAdmin();
  const rows = await db
    .select({ id: projects.id, sortOrder: projects.sortOrder })
    .from(projects)
    .orderBy(asc(projects.sortOrder), asc(projects.createdAt));
  const idx = rows.findIndex((r) => r.id === id);
  const target = rows[idx + (direction === "up" ? -1 : 1)];
  const current = rows[idx];
  if (!target || !current || idx === -1) redirect(LIST);
  await db.update(projects).set({ sortOrder: target.sortOrder }).where(eq(projects.id, current.id));
  await db.update(projects).set({ sortOrder: current.sortOrder }).where(eq(projects.id, target.id));
  revalidate();
  redirect(LIST);
}
