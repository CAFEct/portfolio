import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const certificates = pgTable(
  "certificates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    titleEn: text("title_en"),
    issuer: text("issuer"),
    category: text("category").notNull().default("Geral"),
    year: integer("year"),
    pdfUrl: text("pdf_url"),
    credentialUrl: text("credential_url"),
    isVisible: boolean("is_visible").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("certificates_category_idx").on(t.category)],
);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  descriptionEn: text("description_en"),
  longDescription: text("long_description"),
  longDescriptionEn: text("long_description_en"),
  stack: text("stack").array().notNull().default([]),
  imageUrl: text("image_url"),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: text("role").notNull(),
  roleEn: text("role_en"),
  company: text("company").notNull(),
  period: text("period").notNull(),
  description: text("description"),
  descriptionEn: text("description_en"),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  level: integer("level").notNull().default(50),
  category: text("category").notNull().default("Geral"),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en"),
  youtubeId: text("youtube_id").notNull(),
  description: text("description"),
  descriptionEn: text("description_en"),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
});

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: text("type", { enum: ["page_view", "project_click", "pdf_download"] }).notNull(),
    path: text("path").notNull(),
    referrer: text("referrer"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("analytics_events_type_idx").on(t.type, t.createdAt)],
);
