import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { count, sql as drizzleSql } from "drizzle-orm";
import * as schema from "../db/schema";
import { certificates, experiences, projects, skills, siteSettings, videos } from "../db/schema";
import { DEFAULT_SETTINGS } from "../lib/settings";

config({ path: ".env.local" });
config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  const [{ total: certCount }] = await db.select({ total: count() }).from(certificates);

  if (certCount === 0) await db.insert(certificates).values([
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
      title: "WaveOS", slug: "waveos", description: "O sistema operacional do navegador", descriptionEn: "The browser operating system",
      imageUrl: "/images/waveos.png", stack: ["React", "Node.js", "MongoDB", "Stripe"],
      repoUrl: "https://github.com/CAFE2l/Productivity-App",
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: "CAFÉ STORE", slug: "cafe-store", description: "Tudo para sua Identidade digital. Criação de web-aplicações, agências digitais, site e landing pages para você e seu negócio", descriptionEn: "Everything for your digital identity. Web applications, digital agencies, websites and landing pages for you and your business.",
      imageUrl: "/images/cafe_store.png", liveUrl: "https://e-commerce-landing-page-lime.vercel.app/", stack: ["MySQL", "PHP", "FileZilla", "Firebase", "Tailwind", "Cloudinary"],
      isFeatured: true,
      sortOrder: 2,
    },
    {
      title: "To-do List Overlay", slug: "todo-list-overlay", description: "Sobreposições de produtividade em tempo real para OBS, feitas para criadores.", descriptionEn: "Realtime OBS productivity overlays for creators.",
      imageUrl: "/images/study-overlay.png", liveUrl: "https://to-do-list-three-eta-84.vercel.app/", repoUrl: "https://github.com/CAFE2l/To-do_list", stack: ["Vue.js", "Node.js", "Cloudinary", "Firebase", "Vite"],
      isFeatured: true,
      sortOrder: 3,
    },
    { title: "LinkWave", slug: "linkwave", description: "Links para criadores, influenciadores e streamers. Uma forma simples e elegante de compartilhar todo o seu conteúdo em um só lugar.", descriptionEn: "Links for creators, influencers and streamers. A simple and elegant way to share all your content in one place.", imageUrl: "/images/linkwave.jpg", liveUrl: "https://linkwave.ct.ws", repoUrl: "https://github.com/CAFE2l/LinkWave", stack: ["PHP", "Tailwind", "MySQL", "Firebase", "JavaScript", "FileZilla"], isFeatured: true, sortOrder: 4 },
    { title: "SampTech", slug: "samptech", description: "Loja de Informática e Assistência Técnica para Computadores, Celulares e Consoles.", descriptionEn: "Computer store and technical support for computers, phones and consoles.", imageUrl: "/images/samptech.jpg", liveUrl: "https://samptech-link-tree.vercel.app/", repoUrl: "https://github.com/CAFE2l/samptechPHP", stack: ["Firebase", "JavaScript", "MySQL", "PHP", "Tailwind", "FileZilla"], isFeatured: true, sortOrder: 5 },
    { title: "Stream Pix", slug: "stream-pix", description: "Plataforma de alertas de doações via Pix para streaming.", descriptionEn: "Pix donation alerts platform for streaming.", imageUrl: "/images/streampix.png", liveUrl: "https://stream-pix-ashy.vercel.app/", repoUrl: "https://github.com/CAFE2l/Stream_Pix", stack: ["React", "Render", "Cloudinary", "Firebase", "Node.js", "TypeScript"], isFeatured: true, sortOrder: 6 },
  ]).onConflictDoUpdate({ target: projects.slug, set: { title: drizzleSql`excluded.title`, description: drizzleSql`excluded.description`, descriptionEn: drizzleSql`excluded.description_en`, imageUrl: drizzleSql`excluded.image_url`, liveUrl: drizzleSql`excluded.live_url`, repoUrl: drizzleSql`excluded.repo_url`, stack: drizzleSql`excluded.stack`, isFeatured: drizzleSql`excluded.is_featured`, isVisible: drizzleSql`excluded.is_visible`, sortOrder: drizzleSql`excluded.sort_order` } });

  const [{ total: experienceCount }] = await db.select({ total: count() }).from(experiences);
  if (experienceCount === 0) await db.insert(experiences).values([
    {
      role: "UI/UX Designer", roleEn: "UI/UX Designer", company: "Alura", period: "Março de 2025 — Presente",
      description: "Criação de interfaces intuitivas e experiências excepcionais para aplicações web e mobile. Implementação de sistemas de design e prototipação interativa com Figma.",
      descriptionEn: "Creating intuitive interfaces and exceptional user experiences for web and mobile applications. Implementation of design systems and interactive prototyping with Figma.",
      sortOrder: 1,
    },
    {
      role: "Desenvolvedor Full-Stack", roleEn: "Full-Stack Developer", company: "Alura - Curso em Vídeo - Mimo - Sololearn - LinkedIn Learning", period: "Jan 2025 — Presente",
      description: "Desenvolvimento web com HTML, CSS, JavaScript, PHP e MySQL. Criação de aplicações responsivas e dinâmicas com foco em desempenho.",
      descriptionEn: "Web development using technologies such as HTML, CSS, JavaScript, PHP, and MySQL. Building responsive and dynamic applications with a focus on performance.",
      sortOrder: 2,
    },
    {
      role: "Influenciador Digital", roleEn: "Digital Influencer", company: "Estratégia de redes sociais", period: "Março de 2025 — Presente",
      description: "YouTube: Shorts → edições de alto engajamento | vídeos longos → produção premium | lives → interação com a comunidade. Propósito: crescimento da audiência e conexão.\nTwitter/X: registro da jornada de desenvolvimento e ideias sobre finanças | interação em tempo real com a comunidade tech.\nPinterest: portfólio de design. Propósito: tráfego orgânico e visibilidade.\nLinkedIn: certificados e conquistas profissionais. Propósito: autoridade e credibilidade.\nTelegram: comunicação direta com clientes e conteúdo promocional. Propósito: canal de monetização.\nDiscord: comunidade de estudos e espaço de aprendizado | sessões de estudo ao vivo com foco. Propósito: participação e retenção da comunidade.",
      descriptionEn: "YouTube: Shorts → high-engagement edits | Long-form → premium production | Lives → community interaction. Purpose: audience growth + strong connection.\nTwitter/X: Document my dev journey + financial insights | Real-time engagement with the tech community.\nPinterest: Design portfolio. Purpose: passive traffic + design visibility.\nLinkedIn: Professional certificates & achievements. Purpose: establish authority + professional credibility.\nTelegram: Direct client communication + promotional content. Purpose: direct monetization channel.\nDiscord: Study community & learning hub | Study streams (camera on, focused work). Purpose: community retention + strong engagement.",
      sortOrder: 3,
    },
  ]);

  const [{ total: skillCount }] = await db.select({ total: count() }).from(skills);
  if (skillCount === 0) await db.insert(skills).values([
    { name: "HTML/CSS", level: 75, category: "Technical Skills", sortOrder: 1 },
    { name: "JavaScript/TypeScript", level: 70, category: "Technical Skills", sortOrder: 2 },
    { name: "Firebase/JSON", level: 75, category: "Technical Skills", sortOrder: 3 },
    { name: "Node.js/Docker", level: 60, category: "Technical Skills", sortOrder: 4 },
    { name: "PHP/MySQL", level: 70, category: "Technical Skills", sortOrder: 5 },
    { name: "UI/UX Design", level: 60, category: "Professional Skills", sortOrder: 1 },
    { name: "Agile Development", level: 15, category: "Professional Skills", sortOrder: 2 },
    { name: "Problem Solving", level: 75, category: "Professional Skills", sortOrder: 3 },
    { name: "Teamwork", level: 20, category: "Professional Skills", sortOrder: 4 },
    { name: "Communication", level: 90, category: "Professional Skills", sortOrder: 5 },
  ]);

  const [{ total: videoCount }] = await db.select({ total: count() }).from(videos);
  if (videoCount === 0) await db.insert(videos).values([
    {
      title: "Primeiros passos com Next.js",
      youtubeId: "dQw4w9WgXcQ",
      description: "Vídeo de exemplo — substitua pelo seu no painel admin.",
      sortOrder: 1,
    },
  ]);

  await db.insert(siteSettings).values([
    { key: "heroTitle", value: DEFAULT_SETTINGS.heroTitle },
    { key: "heroTitleEn", value: DEFAULT_SETTINGS.heroTitleEn },
    { key: "heroTitleEs", value: DEFAULT_SETTINGS.heroTitleEs },
    { key: "heroSubtitle", value: DEFAULT_SETTINGS.heroSubtitle },
    { key: "heroSubtitleEn", value: DEFAULT_SETTINGS.heroSubtitleEn },
    { key: "heroSubtitleEs", value: DEFAULT_SETTINGS.heroSubtitleEs },
    { key: "heroRolesPt", value: DEFAULT_SETTINGS.heroRolesPt },
    { key: "heroRolesEn", value: DEFAULT_SETTINGS.heroRolesEn },
    { key: "heroRolesEs", value: DEFAULT_SETTINGS.heroRolesEs },
    { key: "aboutText", value: DEFAULT_SETTINGS.aboutText },
    { key: "aboutTextEn", value: DEFAULT_SETTINGS.aboutTextEn },
    { key: "aboutTextEs", value: DEFAULT_SETTINGS.aboutTextEs },
    { key: "email", value: DEFAULT_SETTINGS.email },
    { key: "location", value: DEFAULT_SETTINGS.location },
    { key: "phone", value: DEFAULT_SETTINGS.phone },
    { key: "cvUrl", value: DEFAULT_SETTINGS.cvUrl },
    { key: "heroImage", value: DEFAULT_SETTINGS.heroImage },
    { key: "profileImage", value: DEFAULT_SETTINGS.profileImage },
    { key: "aboutImage", value: DEFAULT_SETTINGS.aboutImage },
    { key: "socials", value: DEFAULT_SETTINGS.socials },
    { key: "seo", value: DEFAULT_SETTINGS.seo },
    { key: "sections", value: DEFAULT_SETTINGS.sections },
  ]).onConflictDoNothing({ target: siteSettings.key });

  console.log("Seed concluído: certificados, projetos, experiência, habilidades, vídeos e configurações.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
