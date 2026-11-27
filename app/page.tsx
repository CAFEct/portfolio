import Link from "next/link";
import Image from "next/image";
import { Suspense, type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import AeroOrb from "@/components/AeroOrb";
import HeroIntro, { HeroItem } from "@/components/HeroIntro";
import GlassCard from "@/components/GlassCard";
import VideoEmbed from "@/components/VideoEmbed";
import ContactForm from "@/components/ContactForm";
import ContactChannels, { CONTACT_CHANNEL_KEYS } from "@/components/ContactChannels";
import RoleRotator from "@/components/RoleRotator";
import SkillMeter from "@/components/SkillMeter";
import ProjectFilters from "@/components/ProjectFilters";
import AnimatedCounter from "@/components/AnimatedCounter";
import { getSettings, visibleSections, SECTION_DEFS, DEFAULT_SETTINGS, type SiteSettings, type SectionId } from "@/lib/settings";
import { getContentLocale, pickLocalized } from "@/lib/i18n";
import {
  getExperiencesPublic,
  getSkillsPublic,
  getVideosPublic,
  getVisibleCertificateCount,
  getVisibleProjects,
} from "@/lib/queries";

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

function SectionShell({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16">
      <h2 className="font-display text-3xl font-bold md:text-4xl">{title}</h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

async function SobreSection({ settings }: { settings: SiteSettings }) {
  const [t, locale] = await Promise.all([getTranslations("home"), getContentLocale()]);
  return (
    <SectionShell id="sobre" title={t("sobreTitulo")}>
      <div className="grid items-center gap-8 md:grid-cols-[.7fr_1.3fr]">
        <div className="relative mx-auto aspect-square w-64 rounded-[2rem] border-4 border-white bg-gradient-to-br from-sky-200 to-cyan-100 p-2 shadow-xl">
          <Image src={settings.aboutImage} alt="Gabriel Felipe" fill sizes="256px" className="rounded-[1.5rem] object-cover" onError={(event) => { event.currentTarget.style.display = "none"; }} />
          <span className="pointer-events-none absolute inset-4 -z-10 translate-x-4 translate-y-4 rounded-[2rem] border-2 border-white/90 bg-white/35" />
        </div>
        <GlassCard>
          <h3 className="font-display text-2xl font-bold">{locale === "en" ? "Full-Stack Developer & Digital Influencer" : locale === "es" ? "Desarrollador Full-Stack e Influenciador Digital" : "Desenvolvedor Full-Stack e Influenciador Digital"}</h3>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-[#173b59]">{pickLocalized(settings.aboutText, settings.aboutTextEn, locale, settings.aboutTextEs)}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[[5, locale === "en" ? "Projects" : locale === "es" ? "Proyectos" : "Projetos"], [10, locale === "en" ? "Clients" : locale === "es" ? "Clientes" : "Clientes"], [1, locale === "en" ? "Years of experience" : locale === "es" ? "Años de experiencia" : "Anos de experiência"], [5, locale === "en" ? "Technologies" : locale === "es" ? "Tecnologías" : "Tecnologias"]].map(([value, label]) => <div key={label} className="glass p-4 text-center"><strong className="block font-display text-2xl text-[#0b5ed7]"><AnimatedCounter value={Number(value)} /></strong><span className="text-xs font-semibold">{label}</span></div>)}
          </div>
          <div className="mt-6 flex flex-wrap gap-3"><a href="#contato" className="btn-aero">{t("falarComigo")}</a><a href="#projetos" className="btn-ghost">{t("verProjetos")}</a></div>
        </GlassCard>
      </div>
    </SectionShell>
  );
}

async function ProjetosSection() {
  const [t, locale, projects] = await Promise.all([
    getTranslations("home"),
    getContentLocale(),
    safe(getVisibleProjects(), []),
  ]);
  if (projects.length === 0) return null;
  return (
    <SectionShell id="projetos" title={t("projetosTitulo")}>
      <ProjectFilters />
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <article key={p.id} className="project-card flex h-full flex-col" data-track="project_click" data-project-category="Full-Stack">
            {p.imageUrl ? <div className="relative h-48 w-full bg-sky-100"><Image src={p.imageUrl} alt={pickLocalized(p.title, p.titleEn, locale)} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" /></div> : null}
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-start justify-between gap-3"><h3 className="font-display text-xl font-bold">{pickLocalized(p.title, p.titleEn, locale)}</h3><span className="shrink-0 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-[#0750c2]">Full-Stack</span></div>
              <p className="mt-3 flex-1 text-[#234661]">{pickLocalized(p.description, p.descriptionEn, locale)}</p>
              <ul className="mt-5 flex flex-wrap gap-2 text-sm">{p.stack.map((tech) => <li key={tech} className="tag">{tech}</li>)}</ul>
              <div className="mt-5 flex items-center justify-between border-t border-sky-100 pt-4 text-sm font-bold">
                {p.liveUrl ? <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-[#0750c2] hover:underline">↗ {locale === "en" ? "View" : locale === "es" ? "Ver" : "Ver"}</a> : <span />}
                {p.repoUrl ? <a href={p.repoUrl} target="_blank" rel="noreferrer" aria-label={`${p.title} GitHub`} className="text-xl text-[#06203f]">⌘</a> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
      <p id="project-filter-empty" hidden className="mt-6 text-center text-[#234661]">{locale === "en" ? "No projects in this category." : locale === "es" ? "No hay proyectos en esta categoría." : "Nenhum projeto nesta categoria."}</p>
      <div className="mt-8">
        <Link href="/projetos" className="btn-ghost">
          {t("verTodosProjetos")}
        </Link>
      </div>
    </SectionShell>
  );
}

async function ExperienciaSection() {
  const [t, locale, items] = await Promise.all([
    getTranslations("home"),
    getContentLocale(),
    safe(getExperiencesPublic(), []),
  ]);
  if (items.length === 0) return null;
  return (
    <SectionShell id="experiencia" title={t("experienciaTitulo")}>
      <ol className="relative space-y-6 border-l-2 border-sky-300 pl-8">
        {items.map((e) => (
          <li key={e.id} className="relative">
            <span className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-[#38c23b] shadow-[0_0_12px_rgba(56,194,59,0.5)]" />
            <GlassCard className="!p-5 md:!p-7">
            <p className="text-sm font-semibold text-[#176dcc]">{e.period}</p>
            <h3 className="mt-1 font-display text-xl font-bold">
              {pickLocalized(e.role, e.roleEn, locale)}
            </h3>
            <p className="text-[#176dcc]">{e.company}</p>
            {e.description ? (
              e.role.includes("Influenciador Digital") || e.roleEn?.includes("Digital Influencer") ? (
                <div className="mt-5 border-t border-sky-100 pt-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-bold uppercase tracking-wider text-[#176dcc]">{locale === "en" ? "Social Media Strategy" : locale === "es" ? "Estrategia de redes sociales" : "Estratégia de redes sociais"}</p><a href="/videos" className="btn-aero !px-4 !py-2 text-sm">▶ {locale === "en" ? "Video Hub" : locale === "es" ? "Videos" : "Central de Vídeos"}</a></div>
                  <div className="space-y-3">{pickLocalized(e.description, e.descriptionEn, locale).split("\n").filter(Boolean).map((row) => { const platform = row.split(":")[0]; const icon = ({ YouTube: "▶", "Twitter/X": "𝕏", Pinterest: "P", LinkedIn: "in", Telegram: "➤", Discord: "◉" } as Record<string, string>)[platform] ?? "•"; return <div key={platform} className="flex items-start gap-3 rounded-xl bg-white/55 p-3"><span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sky-100 font-bold text-[#0750c2]">{icon}</span><p className="text-sm text-[#234661]">{row}</p></div>; })}</div>
                </div>
              ) : (
              <p className="mt-2 max-w-prose text-sm whitespace-pre-line text-[#234661]">
                {pickLocalized(e.description, e.descriptionEn, locale)}
              </p>
              )
            ) : null}
            </GlassCard>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

async function HabilidadesSection() {
  const [t, items] = await Promise.all([getTranslations("home"), safe(getSkillsPublic(), [])]);
  if (items.length === 0) return null;
  const groups = new Map<string, typeof items>();
  for (const s of items) {
    const list = groups.get(s.category) ?? [];
    list.push(s);
    groups.set(s.category, list);
  }
  return (
    <SectionShell id="habilidades" title={t("habilidadesTitulo")}>
      <div className="grid gap-6 md:grid-cols-2">
        {[...groups.entries()].map(([category, skills]) => (
          <GlassCard key={category}>
            <h3 className="font-display text-lg font-bold text-cyan-200">{category}</h3>
            <ul className="mt-4 space-y-4">
              {skills.map((s) => (
                <li key={s.id}>
                  <div className="flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="text-[#2673a8]">{s.level}%</span>
                  </div>
                  <SkillMeter level={s.level} />
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
      </div>
      <div className="mt-14">
        <h3 className="mb-6 text-center font-display text-2xl font-bold">{t("tecnologiasTitulo")}</h3>
        <div className="grid grid-cols-3 gap-3 md:grid-cols-6">{["HTML5", "CSS3", "Tailwind CSS", "PHP", "Python", "Bash", "Linux", "MySQL", "JavaScript", "React", "Git", "Firebase"].map((name) => <div key={name} className="glass grid min-h-24 place-items-center p-3 text-center font-bold text-[#176dcc] transition hover:-translate-y-1"><span className="text-2xl">{name === "HTML5" ? "5" : name === "CSS3" ? "#" : name === "Linux" ? "🐧" : name === "Git" ? "⑂" : name === "Firebase" ? "🔥" : "✦"}</span><span className="mt-1 text-xs text-[#173b59]">{name}</span></div>)}</div>
      </div>
    </SectionShell>
  );
}

async function VideosSection() {
  const [t, locale, tv, items] = await Promise.all([
    getTranslations("home"),
    getContentLocale(),
    getTranslations("videos"),
    safe(getVideosPublic(), []),
  ]);
  if (items.length === 0) return null;
  return (
    <SectionShell id="videos" title={t("videosTitulo")}>
      <div className="grid gap-6 md:grid-cols-2">
        {items.slice(0, 4).map((v) => {
          const title = pickLocalized(v.title, v.titleEn, locale);
          return (
            <GlassCard key={v.id} className="p-4">
              <VideoEmbed youtubeId={v.youtubeId} title={title} playLabel={tv("reproduzir", { title })} />
              <h3 className="mt-3 font-display text-lg font-bold">{title}</h3>
              {v.description ? (
                <p className="mt-1 text-sm text-[#234661]">
                  {pickLocalized(v.description, v.descriptionEn, locale)}
                </p>
              ) : null}
            </GlassCard>
          );
        })}
      </div>
    </SectionShell>
  );
}

async function CertificadosSection() {
  const [t, total] = await Promise.all([
    getTranslations("home"),
    safe(getVisibleCertificateCount(), 0),
  ]);
  return (
    <section id="certificados" className="mx-auto max-w-4xl scroll-mt-28 px-6 py-16">
      <GlassCard className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">{t("certificadosTitulo")}</h2>
          <p className="mt-3 text-[#234661]">
            {total > 0 ? t("certificadosTexto", { count: total }) : t("certificadosTextoVazio")}
          </p>
        </div>
        <Link href="/certificados" className="btn-aero">
          {t("verCertificados")}
        </Link>
      </GlassCard>
    </section>
  );
}

async function ContatoSection({ settings }: { settings: SiteSettings }) {
  const [t, tc, locale] = await Promise.all([
    getTranslations("home"),
    getTranslations("contato"),
    getContentLocale(),
  ]);
  const socials = Object.entries(settings.socials).filter(([, url]) => url);
  // Gmail/LinkedIn/WhatsApp/GitHub are rendered as animated contacts below.
  const extraSocials = socials.filter(([name]) => !CONTACT_CHANNEL_KEYS.has(name) && name !== "youtube" && name !== "x");
  return (
    <section id="contato" className="mx-auto max-w-3xl scroll-mt-28 px-6 pb-28 pt-16">
      <GlassCard>
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">{t("contatoTitulo")}</h2>
        <p className="mx-auto mt-3 max-w-prose text-center text-[#234661]">{t("contatoTexto")}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[[tc("locationLabel"), settings.location, "⌖"], [tc("emailLabel"), settings.email, "✉"], [tc("phoneLabel"), settings.phone, "☎"]].map(([label, value, icon]) => <div key={label} className="glass flex items-center gap-3 p-4"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sky-100 text-xl text-[#0b5ed7]">{icon}</span><div className="min-w-0"><h3 className="text-xs font-bold uppercase tracking-wide text-[#176dcc]">{label}</h3><p className="truncate text-sm font-semibold">{value}</p></div></div>)}
        </div>
        <div className="mt-8">
          <ContactForm
            labels={{
              nome: tc("nome"),
              nomePlaceholder: tc("nomePlaceholder"),
              email: tc("email"),
              emailPlaceholder: tc("emailPlaceholder"),
              mensagem: tc("mensagem"),
              mensagemPlaceholder: tc("mensagemPlaceholder"),
              enviar: tc("enviar"),
              enviado: tc("enviado"),
              erroValidacao: tc("erroValidacao"),
            }}
            locale={locale}
          />
        </div>
        <div className="mt-8">
          <ContactChannels socials={settings.socials} email={settings.email} />
        </div>
        <div className="mt-5 flex justify-center gap-3">{[["YouTube", settings.socials.youtube, "▶"], ["X", settings.socials.x, "𝕏"]].filter(([, url]) => Boolean(url)).map(([name, url, icon]) => <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name} className="grid h-12 w-12 place-items-center rounded-full border border-white bg-white/75 text-xl font-black text-[#0750c2] shadow">{icon}</a>)}</div>
        {extraSocials.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            {extraSocials.map(([name, url]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost !px-4 !py-2 text-xs capitalize"
              >
                {name}
              </a>
            ))}
          </div>
        ) : null}
      </GlassCard>
    </section>
  );
}

const SECTION_LABELS: Record<SectionId, string> = Object.fromEntries(
  SECTION_DEFS.map((s) => [s.id, s.label]),
) as Record<SectionId, string>;

async function DynamicSection({ id, settings }: { id: SectionId; settings: SiteSettings }) {
  switch (id) {
    case "sobre":
      return <SobreSection settings={settings} />;
    case "projetos":
      return <ProjetosSection />;
    case "experiencia":
      return <ExperienciaSection />;
    case "habilidades":
      return <HabilidadesSection />;
    case "videos":
      return <VideosSection />;
    case "certificados":
      return <CertificadosSection />;
    case "contato":
      return <ContatoSection settings={settings} />;
    default:
      return null;
  }
}

export default async function Home() {
  const [t, locale, settings] = await Promise.all([
    getTranslations("home"),
    getContentLocale(),
    safe(getSettings(), null),
  ]);
  const s: SiteSettings = settings ?? DEFAULT_SETTINGS;
  const order = visibleSections(s).filter((id) => id !== "home");
  const heroTitle = pickLocalized(s.heroTitle, s.heroTitleEn, locale, s.heroTitleEs);
  const heroSubtitle = pickLocalized(s.heroSubtitle, s.heroSubtitleEn, locale, s.heroSubtitleEs);
  const heroName = "Gabriel Felipe";
  const heroGreeting = heroTitle.includes(heroName)
    ? heroTitle.slice(0, heroTitle.lastIndexOf(heroName)).trim()
    : locale === "en" ? "Hi all 👋, I'm" : locale === "es" ? "Hola a todos 👋, soy" : "Olá a todos 👋, sou";

  return (
    <>
      <link rel="preload" as="image" href={s.heroImage} fetchPriority="high" />
      <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${s.heroImage})` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#bfe6ff]/55 via-[#d8f5ff]/20 to-transparent"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#dff8ff]/80 to-transparent" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 pb-24 pt-32 md:grid-cols-[1.1fr_0.9fr] md:pt-40">
          <HeroIntro>
            <HeroItem>
              <div>
                <h1 className="font-display text-5xl font-extrabold leading-tight text-[#08284a] md:text-7xl">
                  <span className="block text-3xl md:text-5xl">{heroGreeting}</span>
                  <span className="chrome-text">{heroName}</span>
                </h1>
                <p className="mt-5 text-xl font-bold md:text-3xl"><RoleRotator roles={(locale === "en" ? s.heroRolesEn : locale === "es" ? s.heroRolesEs : s.heroRolesPt).split("\n").map((role) => role.trim()).filter(Boolean)} /></p>
                <p className="mt-3 max-w-xl text-lg font-semibold text-[#173b59]">{heroSubtitle}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="#projetos" className="btn-aero">
                    {t("verProjetos")}
                  </a>
                  <a href="#contato" className="btn-ghost">
                    {t("falarComigo")}
                  </a>
                </div>
                <div className="mt-6 flex items-center gap-4" aria-label="Redes sociais">
                  {[["GitHub",s.socials.github,"◉"],["LinkedIn",s.socials.linkedin,"in"],["X",s.socials.x,"𝕏"],["YouTube",s.socials.youtube,"▶"]].filter(([,url]) => Boolean(url)).map(([name,url,icon]) => <a key={name} href={url} target="_blank" rel="noreferrer" aria-label={name} className="grid h-10 w-10 place-items-center rounded-full border border-white bg-white/75 text-lg font-black text-[#0b5ed7] shadow">{icon}</a>)}
                </div>
              </div>
            </HeroItem>
            <HeroItem className="flex justify-center">
              <AeroOrb profileImage={s.profileImage} />
            </HeroItem>
          </HeroIntro>
        </div>
        <a href="#sobre" aria-label={locale === "en" ? "Scroll to About" : locale === "es" ? "Ir a Sobre mí" : "Rolar para Sobre mim"} className="absolute bottom-8 left-1/2 z-10 grid h-12 w-12 -translate-x-1/2 animate-bounce place-items-center rounded-full border border-white/80 bg-white/50 text-3xl font-bold text-[#176dcc] shadow">⌄</a>
      </section>

      {order.map((id) => (
        <Suspense
          key={id}
          fallback={
            <section className="mx-auto max-w-6xl px-6 py-16">
              <h2 className="font-display text-3xl font-bold text-[#2a6491]/45">{SECTION_LABELS[id]}</h2>
            </section>
          }
        >
          <DynamicSection id={id} settings={s} />
        </Suspense>
      ))}
      <footer className="border-t border-white/70 bg-white/25 px-6 py-9 text-[#173b59]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 md:flex-row">
          <a href="#home" className="font-display text-xl font-extrabold text-[#0b5ed7]">☕ CAFÉ</a>
          <nav aria-label="Links do rodapé" className="flex flex-wrap justify-center gap-4 text-sm font-semibold">
            {["home", "sobre", "habilidades", "projetos", "videos", "contato"].map((id) => <a key={id} href={`#${id}`} className="hover:text-[#0750c2]">{id === "home" ? "Home" : t(`${id}Titulo`)}</a>)}
          </nav>
          <p className="text-sm">© 2026 Gabriel Felipe. {locale === "en" ? "All rights reserved." : locale === "es" ? "Todos los derechos reservados." : "Todos os direitos reservados."}</p>
        </div>
      </footer>
      <a href="#home" aria-label={locale === "en" ? "Back to top" : locale === "es" ? "Volver arriba" : "Voltar ao topo"} className="glass fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full text-2xl font-bold text-[#0b5ed7] shadow-lg">↑</a>
    </>
  );
}
