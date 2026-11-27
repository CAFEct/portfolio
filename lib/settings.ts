import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export const SECTION_DEFS = [
  { id: "home", label: "Hero" },
  { id: "sobre", label: "Sobre" },
  { id: "habilidades", label: "Habilidades" },
  { id: "projetos", label: "Projetos" },
  { id: "experiencia", label: "Experiência" },
  { id: "videos", label: "Vídeos" },
  { id: "certificados", label: "Certificados" },
  { id: "contato", label: "Contato" },
] as const;

export type SectionId = (typeof SECTION_DEFS)[number]["id"];

export type SectionSetting = { id: SectionId; visible: boolean; order: number };

export type SiteSettings = {
  heroTitle: string;
  heroTitleEn: string;
  heroTitleEs: string;
  heroSubtitle: string;
  heroSubtitleEn: string;
  heroSubtitleEs: string;
  aboutText: string;
  aboutTextEn: string;
  aboutTextEs: string;
  email: string;
  cvUrl: string;
  socials: {
    github: string;
    youtube: string;
    linkedin: string;
    instagram: string;
    gmail: string;
    whatsapp: string;
  };
  seo: { title: string; titleEn: string; description: string; descriptionEn: string };
  sections: SectionSetting[];
};

export const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "Olá a todos 👋, sou Gabriel Felipe",
  heroTitleEn: "Hi all 👋, I'm Gabriel Felipe",
  heroTitleEs: "Hola a todos 👋, soy Gabriel Felipe",
  heroSubtitle: "Desenvolvedor Full-Stack Júnior",
  heroSubtitleEn: "Junior Full-Stack Developer",
  heroSubtitleEs: "Desarrollador Full-Stack Júnior",
  aboutText:
    "Sou desenvolvedor full-stack com mais de 1 ano de experiência criando soluções web inovadoras. Minha paixão é transformar ideias complexas em interfaces intuitivas e funcionais, com ótimas experiências para as pessoas.\n\nMinha jornada na programação começou aos 15 anos. Desde então, tenho me dedicado a aprender novas tecnologias e metodologias. Acredito que a tecnologia deve ser acessível e útil para todos.",
  aboutTextEn: "I am a full-stack developer with over 1 year of experience creating innovative web solutions. My passion is transforming complex ideas into intuitive and functional interfaces that provide excellent user experiences.\n\nMy programming journey began at 15 years of age, and since then I have been dedicated to learning new technologies and methodologies. I believe technology should be accessible and useful to everyone, and that's what motivates me to create applications that make a difference.",
  aboutTextEs: "Soy desarrollador full-stack con más de 1 año de experiencia creando soluciones web innovadoras. Me apasiona transformar ideas complejas en interfaces intuitivas y funcionales que ofrecen excelentes experiencias.\n\nMi camino en la programación comenzó a los 15 años. Desde entonces, me he dedicado a aprender nuevas tecnologías y metodologías. Creo que la tecnología debe ser accesible y útil para todos, y eso me motiva a crear aplicaciones que marquen la diferencia.",
  email: "gutiajs@gmail.com",
  cvUrl: "",
  socials: { github: "https://github.com/CAFE2l", youtube: "https://www.youtube.com/@CAFE_ct/streams", linkedin: "https://www.linkedin.com/in/gabriel-felipe-sabino-de-souza-ab05a630a/", instagram: "", gmail: "mailto:gutiajs@gmail.com", whatsapp: "https://api.whatsapp.com/send/?phone=5541996713782" },
  seo: { title: "Gabriel Felipe | Desenvolvedor Full-Stack", titleEn: "Gabriel Felipe | Full-Stack Developer", description: "Portfólio de Gabriel Felipe, desenvolvedor full-stack júnior.", descriptionEn: "Portfolio of Gabriel Felipe, junior full-stack developer." },
  sections: SECTION_DEFS.map((s, i) => ({ id: s.id, visible: true, order: i })),
};

export async function getSettings(): Promise<SiteSettings> {
  const rows = await db.select().from(siteSettings);
  const map = new Map(rows.map((r) => [r.key, r.value]));
  const str = (key: string, fallback: string) =>
    typeof map.get(key) === "string" ? (map.get(key) as string) : fallback;
  const storedHeroTitle = str("heroTitle", DEFAULT_SETTINGS.heroTitle);
  const storedHeroTitleEn = str("heroTitleEn", DEFAULT_SETTINGS.heroTitleEn);

  const merged: SiteSettings = {
    heroTitle: storedHeroTitle.includes("Gabriel, o dev por trás do CAFÉ") ? DEFAULT_SETTINGS.heroTitle : storedHeroTitle,
    heroTitleEn: storedHeroTitleEn.includes("Gabriel, the dev behind CAFÉ") ? DEFAULT_SETTINGS.heroTitleEn : storedHeroTitleEn,
    heroTitleEs: str("heroTitleEs", DEFAULT_SETTINGS.heroTitleEs),
    heroSubtitle: str("heroSubtitle", DEFAULT_SETTINGS.heroSubtitle),
    heroSubtitleEn: str("heroSubtitleEn", DEFAULT_SETTINGS.heroSubtitleEn),
    heroSubtitleEs: str("heroSubtitleEs", DEFAULT_SETTINGS.heroSubtitleEs),
    aboutText: str("aboutText", DEFAULT_SETTINGS.aboutText),
    aboutTextEn: str("aboutTextEn", DEFAULT_SETTINGS.aboutTextEn),
    aboutTextEs: str("aboutTextEs", DEFAULT_SETTINGS.aboutTextEs),
    email: str("email", ""),
    cvUrl: str("cvUrl", ""),
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
