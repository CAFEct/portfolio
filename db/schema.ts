import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  labelPt: text("label_pt").notNull(),
  labelEn: text("label_en").notNull(),
  icon: text("icon"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const certificates = pgTable(
  "certificates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title_pt").notNull(),
    titleEn: text("title_en").notNull().default(""),
    issuer: text("issuer").notNull().default(""),
    category: text("category").notNull().default("Geral"),
    categoryId: uuid("category_id"),
    descriptionPt: text("description_pt").notNull().default(""),
    descriptionEn: text("description_en").notNull().default(""),
    issuedAt: timestamp("issued_at"),
    year: integer("year"),
    hours: integer("hours"),
    thumbnailUrl: text("thumbnail_url"),
    pdfUrl: text("pdf_url"),
    credentialUrl: text("credential_url"),
    isVisible: boolean("is_published").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("certificates_category_idx").on(t.category)],
);

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title_pt").notNull(),
  titleEn: text("title_en").notNull().default(""),
  slug: text("slug").notNull().unique(),
  description: text("description_pt").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  longDescription: text("long_description"),
  longDescriptionEn: text("long_description_en"),
  tags: jsonb("tags"),
  images: jsonb("images"),
  stack: text("stack").array().notNull().default([]),
  imageUrl: text("image_url"),
  liveUrl: text("live_url"),
  repoUrl: text("repo_url"),
  isFeatured: boolean("is_featured").notNull().default(false),
  isVisible: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const experiences = pgTable("experiences", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: text("role_pt").notNull(),
  roleEn: text("role_en").notNull().default(""),
  company: text("company").notNull(),
  period: text("period_pt").notNull().default(""),
  periodEn: text("period_en").notNull().default(""),
  description: text("description_pt").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const skills = pgTable("skills", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  level: integer("level").notNull().default(50),
  category: text("category").notNull().default("Geral"),
  icon: text("icon"),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const videos = pgTable("videos", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  titleEn: text("title_en").notNull().default(""),
  youtubeId: varchar("youtube_id", { length: 50 }).notNull(),
  description: text("description_pt").notNull().default(""),
  descriptionEn: text("description_en").notNull().default(""),
  isVisible: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const analyticsEvents = pgTable(
  "analytics_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: varchar("type", { length: 50 }).notNull(),
    path: text("path").notNull(),
    referrer: text("referrer"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("analytics_events_type_idx").on(t.type, t.createdAt)],
);

// Auth.js adapter tables (kept for compatibility; JWT sessions don't require them)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified"),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refreshToken: text("refresh_token"),
  accessToken: text("access_token"),
  expiresAt: integer("expires_at"),
  tokenType: text("token_type"),
  scope: text("scope"),
  idToken: text("id_token"),
  sessionState: text("session_state"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: text("session_token").notNull().unique(),
  userId: uuid("user_id").notNull(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: timestamp("expires").notNull(),
});
