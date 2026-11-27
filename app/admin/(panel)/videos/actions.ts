"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { videoSchema } from "@/lib/validation";
import { extractYoutubeId } from "@/lib/youtube";

const LIST = "/admin/videos";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function parse(fd: FormData) {
  const youtube = extractYoutubeId(str(fd, "youtube"));
  if (!youtube) {
    return { ok: false as const, error: "Link do YouTube inválido. Use a URL completa ou o ID do vídeo." };
  }
  const parsed = videoSchema.safeParse({
    title: str(fd, "title"),
    titleEn: str(fd, "titleEn") || undefined,
    youtubeId: youtube,
    description: str(fd, "description") || undefined,
    descriptionEn: str(fd, "descriptionEn") || undefined,
    isVisible: str(fd, "isVisible") === "on",
    sortOrder: str(fd, "sortOrder") || undefined,
  });
  return parsed.success ? { ok: true as const, data: parsed.data } : { ok: false as const, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
}

function fail(back: string, msg: string): never {
  redirect(`${back}?error=${encodeURIComponent(msg)}`);
}

export async function createVideo(formData: FormData) {
  await requireAdmin();
  const parsed = parse(formData);
  if (!parsed.ok) fail(LIST, parsed.error);
  const [row] = await db.insert(videos).values(parsed.data).returning();
  revalidatePath("/");
  redirect(`${LIST}/${row.id}/edit?saved=1`);
}

export async function updateVideo(id: string, formData: FormData) {
  await requireAdmin();
  const back = `${LIST}/${id}/edit`;
  const parsed = parse(formData);
  if (!parsed.ok) fail(back, parsed.error);
  await db.update(videos).set(parsed.data).where(eq(videos.id, id));
  revalidatePath("/");
  redirect(`${LIST}?saved=1`);
}

export async function deleteVideo(id: string) {
  await requireAdmin();
  await db.delete(videos).where(eq(videos.id, id));
  revalidatePath("/");
  redirect(`${LIST}?deleted=1`);
}

export async function toggleVideo(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  if (row) {
    await db.update(videos).set({ isVisible: !row.isVisible }).where(eq(videos.id, id));
  }
  revalidatePath("/");
  redirect(LIST);
}
