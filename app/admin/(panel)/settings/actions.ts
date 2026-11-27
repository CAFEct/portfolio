"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/admin";
import { settingsSchema } from "@/lib/validation";
import { SECTION_DEFS } from "@/lib/settings";

function str(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();

  const sections = SECTION_DEFS.map((def, i) => ({
    id: def.id,
    visible: str(formData, `visible_${def.id}`) === "on",
    order: Number.parseInt(str(formData, `order_${def.id}`) || String(i), 10) || i,
  })).sort((a, b) => a.order - b.order);

  const parsed = settingsSchema.safeParse({
    heroTitle: str(formData, "heroTitle"),
    heroTitleEn: str(formData, "heroTitleEn") || undefined,
    heroSubtitle: str(formData, "heroSubtitle") || undefined,
    heroSubtitleEn: str(formData, "heroSubtitleEn") || undefined,
    aboutText: str(formData, "aboutText") || undefined,
    aboutTextEn: str(formData, "aboutTextEn") || undefined,
    email: str(formData, "email"),
    socials: {
      github: str(formData, "social_github") || undefined,
      youtube: str(formData, "social_youtube") || undefined,
      linkedin: str(formData, "social_linkedin") || undefined,
      instagram: str(formData, "social_instagram") || undefined,
      gmail: str(formData, "social_gmail") || undefined,
      discord: str(formData, "social_discord") || undefined,
      whatsapp: str(formData, "social_whatsapp") || undefined,
    },
    seo: {
      title: str(formData, "seo_title"),
      titleEn: str(formData, "seo_titleEn") || undefined,
      description: str(formData, "seo_description") || undefined,
      descriptionEn: str(formData, "seo_descriptionEn") || undefined,
    },
    sections,
  });

  if (!parsed.success) {
    redirect(`/admin/settings?error=${encodeURIComponent(parsed.error.issues[0]?.message ?? "Dados inválidos")}`);
  }

  const d = parsed.data;
  const entries: [string, unknown][] = [
    ["heroTitle", d.heroTitle],
    ["heroTitleEn", d.heroTitleEn ?? ""],
    ["heroSubtitle", d.heroSubtitle ?? ""],
    ["heroSubtitleEn", d.heroSubtitleEn ?? ""],
    ["aboutText", d.aboutText ?? ""],
    ["aboutTextEn", d.aboutTextEn ?? ""],
    ["email", d.email],
    ["socials", d.socials],
    ["seo", d.seo],
    ["sections", d.sections],
  ];

  for (const [key, value] of entries) {
    await db
      .insert(siteSettings)
      .values({ key, value: value as object })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value: value as object } });
  }

  revalidatePath("/");
  revalidatePath("/certificados");
  revalidatePath("/projetos");
  redirect("/admin/settings?saved=1");
}
