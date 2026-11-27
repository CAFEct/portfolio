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
  socials: { github: string; youtube: string; linkedin: string; instagram: string };
  seo: { title: string; titleEn: string; description: string; descriptionEn: string };
  sections: SectionSetting[];
};

export const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "Gabriel, o dev por trás do CAFÉ",
  heroTitleEn: "",
  heroSubtitle:
    "Crio sites, apps e interfaces com cara de futuro e brilho de vidro. Este portfólio é o meu laboratório.",
  heroSubtitleEn: "",
  aboutText:
    "Sou desenvolvedor full-stack e criador de conteúdo em Curitiba. Trabalho com web, UI/UX e vídeo, e também atendo clientes com portfólios e projetos freelance.",
  aboutTextEn: "",
  email: "",
  socials: { github: "", youtube: "", linkedin: "", instagram: "" },
  seo: { title: "Gabriel | CAFÉ", titleEn: "", description: "Portfólio de Gabriel: desenvolvedor full-stack, UI/UX e criador de conteúdo.", descriptionEn: "" },
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
