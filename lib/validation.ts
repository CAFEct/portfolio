import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .url()
  .refine((u) => /^https?:\/\//i.test(u), "Use um link http(s)")
  .or(z.literal(""))
  .optional();

const requiredText = (max = 200) => z.string().trim().min(1).max(max);
const optionalText = (max = 2000) => z.string().trim().max(max).optional();
const intField = z.coerce.number().int().min(0).max(100000).optional();

export const certificateSchema = z.object({
  title: requiredText(200),
  titleEn: optionalText(200),
  issuer: optionalText(200),
  category: requiredText(100),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  pdfUrl: optionalUrl,
  credentialUrl: optionalUrl,
  isVisible: z.boolean(),
  sortOrder: intField,
});

export const projectSchema = z.object({
  title: requiredText(200),
  titleEn: optionalText(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug: minúsculas, números e hífens"),
  description: requiredText(500),
  descriptionEn: optionalText(500),
  longDescription: optionalText(10000),
  longDescriptionEn: optionalText(10000),
  stack: z.array(z.string().trim().min(1).max(50)).max(30),
  imageUrl: optionalUrl,
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  isFeatured: z.boolean(),
  isVisible: z.boolean(),
  sortOrder: intField,
});

export const experienceSchema = z.object({
  role: requiredText(200),
  roleEn: optionalText(200),
  company: requiredText(200),
  period: requiredText(100),
  description: optionalText(5000),
  descriptionEn: optionalText(5000),
  isVisible: z.boolean(),
  sortOrder: intField,
});

export const skillSchema = z.object({
  name: requiredText(100),
  level: z.coerce.number().int().min(0).max(100),
  category: requiredText(100),
  isVisible: z.boolean(),
  sortOrder: intField,
});

export const videoSchema = z.object({
  title: requiredText(200),
  titleEn: optionalText(200),
  youtubeId: z.string().trim().min(1).max(50),
  description: optionalText(2000),
  descriptionEn: optionalText(2000),
  isVisible: z.boolean(),
  sortOrder: intField,
});

export const contactSchema = z.object({
  name: requiredText(120),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional().or(z.literal("")),
});

export const settingsSchema = z.object({
  heroTitle: requiredText(200),
  heroTitleEn: optionalText(200),
  heroSubtitle: optionalText(1000),
  heroSubtitleEn: optionalText(1000),
  aboutText: optionalText(5000),
  aboutTextEn: optionalText(5000),
  email: z.string().trim().email().max(200).or(z.literal("")),
  socials: z.object({
    github: optionalUrl,
    youtube: optionalUrl,
    linkedin: optionalUrl,
    instagram: optionalUrl,
  }),
  seo: z.object({
    title: requiredText(200),
    titleEn: optionalText(200),
    description: optionalText(300),
    descriptionEn: optionalText(300),
  }),
  sections: z.array(
    z.object({
      id: z.string(),
      visible: z.boolean(),
      order: z.number().int(),
    }),
  ),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
export type CertificateInput = z.infer<typeof certificateSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type VideoInput = z.infer<typeof videoSchema>;
export type ContactInput = z.infer<typeof contactSchema>;

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}
