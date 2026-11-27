import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { count } from "drizzle-orm";
import * as schema from "../db/schema";
import { certificates, experiences, projects, skills, siteSettings, videos } from "../db/schema";
import { DEFAULT_SETTINGS } from "../lib/settings";

config({ path: ".env.local" });
config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  const [{ total: certCount }] = await db.select({ total: count() }).from(certificates);
  const [{ total: projectCount }] = await db.select({ total: count() }).from(projects);

  if (certCount > 0 || projectCount > 0) {
    console.log("Database already seeded, skipping.");
    return;
  }

  await db.insert(certificates).values([
    { title: "Next.js", issuer: "Vercel", category: "Desenvolvimento", year: 2024, sortOrder: 1 },
    { title: "TypeScript", issuer: "Microsoft", category: "Desenvolvimento", year: 2024, sortOrder: 2 },
    { title: "Tailwind CSS", issuer: "Tailwind Labs", category: "Design", year: 2024, sortOrder: 3 },
    { title: "React", issuer: "Meta", category: "Desenvolvimento", year: 2023, sortOrder: 4 },
    { title: "UI/UX Design", issuer: "Alura", category: "Design", year: 2023, sortOrder: 5 },
    { title: "JavaScript", issuer: "Alura", category: "Desenvolvimento", year: 2023, sortOrder: 6 },
    { title: "Node.js", issuer: "Alura", category: "Desenvolvimento", year: 2022, sortOrder: 7 },
    { title: "Git e GitHub", issuer: "Alura", category: "DevOps", year: 2022, sortOrder: 8 },
    { title: "HTML e CSS", issuer: "Alura", category: "Desenvolvimento", year: 2022, sortOrder: 9 },
    { title: "Lógica de Programação", issuer: "Alura", category: "Desenvolvimento", year: 2022, sortOrder: 10 },
  ]);

  await db.insert(projects).values([
    {
      title: "CAFÉ Store",
      slug: "cafe-store",
      description:
        "E-commerce reescrito de PHP/MySQL para Next.js, com loja, painel administrativo e identidade visual própria.",
      longDescription:
        "Migração completa de uma loja legada em PHP/MySQL para Next.js (App Router) com Drizzle ORM e Neon Postgres. Inclui catálogo, carrinho, checkout e painel administrativo — o mesmo sistema que gerencia este portfólio.",
      stack: ["Next.js", "TypeScript", "Tailwind CSS", "Drizzle ORM", "Neon"],
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: "EnergyOS",
      slug: "energyos",
      description:
        "App desktop com sistema gamificado de XP e ligas para acompanhar e motivar a rotina diária.",
      longDescription:
        "Aplicativo desktop construído com Tauri v2 (Rust + webview) que transforma o acompanhamento de hábitos em um jogo: XP, níveis, ligas e progresso visual.",
      stack: ["Tauri v2", "React", "Rust", "TypeScript"],
      isFeatured: true,
      sortOrder: 2,
    },
    {
      title: "Tetris Arduino Edition",
      slug: "tetris-arduino-edition",
      description:
        "Tetris na web controlado por dois Arduinos com Joystick Shield, para dois jogadores no mesmo teclado… e nos mesmos controles físicos.",
      longDescription:
        "Versão web do Tetris jogada com dois Arduinos equipados com Joystick Shield, lendo entrada serial via Web Serial API. Um projeto de hardware + software que une física e jogo.",
      stack: ["Arduino", "JavaScript", "Web Serial API"],
      isFeatured: true,
      sortOrder: 3,
    },
  ]);

  await db.insert(experiences).values([
    {
      role: "Desenvolvedor Full-Stack",
      company: "Freelance",
      period: "2023 — Presente",
      description: "Sites, portfólios e sistemas web para clientes. UI/UX, performance e identidade visual.",
      sortOrder: 1,
    },
    {
      role: "Criador de Conteúdo",
      company: "CAFÉ",
      period: "2022 — Presente",
      description: "Conteúdo sobre tecnologia, programação e criação na internet.",
      sortOrder: 2,
    },
  ]);

  await db.insert(skills).values([
    { name: "Next.js", level: 90, category: "Frontend", sortOrder: 1 },
    { name: "React", level: 88, category: "Frontend", sortOrder: 2 },
    { name: "TypeScript", level: 85, category: "Frontend", sortOrder: 3 },
    { name: "Tailwind CSS", level: 90, category: "Frontend", sortOrder: 4 },
    { name: "Node.js", level: 80, category: "Backend", sortOrder: 1 },
    { name: "PostgreSQL", level: 78, category: "Backend", sortOrder: 2 },
    { name: "Rust", level: 55, category: "Backend", sortOrder: 3 },
    { name: "UI/UX Design", level: 82, category: "Design", sortOrder: 1 },
    { name: "Figma", level: 75, category: "Design", sortOrder: 2 },
  ]);

  await db.insert(videos).values([
    {
      title: "Primeiros passos com Next.js",
      youtubeId: "dQw4w9WgXcQ",
      description: "Vídeo de exemplo — substitua pelo seu no painel admin.",
      sortOrder: 1,
    },
  ]);

  await db.insert(siteSettings).values([
    { key: "heroTitle", value: DEFAULT_SETTINGS.heroTitle },
    { key: "heroTitleEn", value: "" },
    { key: "heroSubtitle", value: DEFAULT_SETTINGS.heroSubtitle },
    { key: "heroSubtitleEn", value: "" },
    { key: "aboutText", value: DEFAULT_SETTINGS.aboutText },
    { key: "aboutTextEn", value: "" },
    { key: "email", value: "" },
    { key: "socials", value: DEFAULT_SETTINGS.socials },
    { key: "seo", value: DEFAULT_SETTINGS.seo },
    { key: "sections", value: DEFAULT_SETTINGS.sections },
  ]);

  console.log("Seed concluído: certificados, projetos, experiência, habilidades, vídeos e configurações.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
