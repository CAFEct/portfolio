import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export const SECTION_DEFS = [
  { id: "home", label: "Hero" },
  { id: "sobre", label: "Sobre" },
  { id: "projetos", label: "Projetos" },
  { id: "experiencia", label: "Experiência" },
  { id: "habilidades", label: "Habilidades" },
  { id: "videos", label: "Vídeos" },
  { id: "certificados", label: "Certificados" },
  { id: "contato", label: "Contato" },
] as const;

export type SectionId = (typeof SECTION_DEFS)[number]["id"];

export type SectionSetting = { id: SectionId; visible: boolean; order: number };

export type SiteSettings = {
  heroTitle: string;
  heroTitleEn: string;
  heroSubtitle: string;
  heroSubtitleEn: string;
  aboutText: string;
  aboutTextEn: string;
  email: string;
  socials: {
    github: string;
    youtube: string;
    linkedin: string;
    instagram: string;
    gmail: string;
    discord: string;
    whatsapp: string;
  };
  seo: { title: string; titleEn: string; description: string; descriptionEn: string };
  sections: SectionSetting[];
};

export const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "Olá a todos 👋, sou Gabriel Felipe",
  heroTitleEn: "Hi all 👋, I'm Gabriel Felipe",
  heroSubtitle: "Desenvolvedor Full-Stack Júnior",
  heroSubtitleEn: "Junior Full-Stack Developer",
  aboutText:
    "Sou desenvolvedor full-stack com mais de 1 ano de experiência criando soluções web inovadoras. Minha paixão é transformar ideias complexas em interfaces intuitivas e funcionais, com ótimas experiências para as pessoas.\n\nMinha jornada na programação começou aos 15 anos. Desde então, tenho me dedicado a aprender novas tecnologias e metodologias. Acredito que a tecnologia deve ser acessível e útil para todos.",
  aboutTextEn: "I am a full-stack developer with over 1 year of experience creating innovative web solutions. My passion is transforming complex ideas into intuitive and functional interfaces that provide excellent user experiences.\n\nMy programming journey began at 15 years of age, and since then I have been dedicated to learning new technologies and methodologies. I believe technology should be accessible and useful to everyone, and that's what motivates me to create applications that make a difference.",
  email: "gutiajs@gmail.com",
  socials: { github: "https://github.com/CAFE2l", youtube: "https://www.youtube.com/@CAFE_ct/streams", linkedin: "https://www.linkedin.com/in/gabriel-felipe-sabino-de-souza-ab05a630a/", instagram: "", gmail: "mailto:gutiajs@gmail.com", discord: "", whatsapp: "https://api.whatsapp.com/send/?phone=5541996713782" },
  seo: { title: "Gabriel Felipe | Desenvolvedor Full-Stack", titleEn: "Gabriel Felipe | Full-Stack Developer", description: "Portfólio de Gabriel Felipe, desenvolvedor full-stack júnior.", descriptionEn: "Portfolio of Gabriel Felipe, junior full-stack developer." },
  sections: SECTION_DEFS.map((s, i) => ({ id: s.id, visible: true, order: i })),
};

export async function getSettings(): Promise<SiteSettings> {
  const rows = await db.select().from(siteSettings);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const str = (key: string, fallback: string) =>
    typeof map.get(key) === "string" ? (map.get(key) as string) : fallback;

  const merged: SiteSettings = {
    heroTitle: str("heroTitle", DEFAULT_SETTINGS.heroTitle),
    heroTitleEn: str("heroTitleEn", ""),
    heroSubtitle: str("heroSubtitle", DEFAULT_SETTINGS.heroSubtitle),
    heroSubtitleEn: str("heroSubtitleEn", ""),
    aboutText: str("aboutText", DEFAULT_SETTINGS.aboutText),
    aboutTextEn: str("aboutTextEn", ""),
    email: str("email", ""),
    socials: { ...DEFAULT_SETTINGS.socials, ...((map.get("socials") as object) ?? {}) },
    seo: { ...DEFAULT_SETTINGS.seo, ...((map.get("seo") as object) ?? {}) },
    sections: DEFAULT_SETTINGS.sections,
  };

  const storedSections = map.get("sections") as SectionSetting[] | undefined;
  if (Array.isArray(storedSections) && storedSections.length > 0) {
    const byId = new Map(storedSections.map((s) => [s.id, s]));
    merged.sections = SECTION_DEFS.map((def, i) => {
      const stored = byId.get(def.id);
      return {
        id: def.id,
        visible: stored?.visible ?? true,
        order: stored?.order ?? i,
      };
    }).sort((a, b) => a.order - b.order);
  }

  return merged;
}

export function visibleSections(settings: SiteSettings) {
  return settings.sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
    .map((s) => s.id);
}
