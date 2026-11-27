"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";

const LIST = "/admin/messages";

export async function toggleMessageRead(id: string) {
  await requireAdmin();
  const [row] = await db.select().from(messages).where(eq(messages.id, id)).limit(1);
  if (row) {
    await db.update(messages).set({ isRead: !row.isRead }).where(eq(messages.id, id));
  }
  revalidatePath(LIST);
  redirect(LIST);
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await db.delete(messages).where(eq(messages.id, id));
  revalidatePath(LIST);
  redirect(`${LIST}?deleted=1`);
}
