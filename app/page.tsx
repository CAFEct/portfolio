import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import AeroOrb from "@/components/AeroOrb";
import HeroIntro, { HeroItem } from "@/components/HeroIntro";
import GlassCard from "@/components/GlassCard";
import VideoEmbed from "@/components/VideoEmbed";
import ContactForm from "@/components/ContactForm";
import ContactChannels, { CONTACT_CHANNEL_KEYS } from "@/components/ContactChannels";
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
      <GlassCard>
        <p className="max-w-prose whitespace-pre-line text-white/80">
          {pickLocalized(settings.aboutText, settings.aboutTextEn, locale)}
        </p>
      </GlassCard>
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
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <Link key={p.id} href={`/projetos/${p.slug}`} className="block" data-track="project_click">
            <GlassCard className="flex h-full flex-col transition hover:border-cyan-300/60">
              <h3 className="font-display text-xl font-bold">
                {pickLocalized(p.title, p.titleEn, locale)}
              </h3>
              <p className="mt-3 flex-1 text-white/75">
                {pickLocalized(p.description, p.descriptionEn, locale)}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2 text-sm">
                {p.stack.map((tech) => (
                  <li key={tech} className="rounded-full border border-white/30 bg-white/10 px-3 py-1">
                    {tech}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Link>
        ))}
      </div>
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
      <ol className="relative space-y-6 border-l border-white/20 pl-8">
        {items.map((e) => (
          <li key={e.id} className="relative">
            <span className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,229,255,0.8)]" />
            <p className="text-sm font-semibold text-cyan-200">{e.period}</p>
            <h3 className="mt-1 font-display text-xl font-bold">
              {pickLocalized(e.role, e.roleEn, locale)}
            </h3>
            <p className="text-white/70">{e.company}</p>
            {e.description ? (
              <p className="mt-2 max-w-prose text-sm whitespace-pre-line text-white/70">
                {pickLocalized(e.description, e.descriptionEn, locale)}
              </p>
            ) : null}
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
                    <span className="text-white/50">{s.level}%</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-aero-blue to-aero-cyan"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>
        ))}
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
                <p className="mt-1 text-sm text-white/70">
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
          <p className="mt-3 text-white/75">
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
  // Gmail/Discord/WhatsApp/GitHub are rendered as animated contacts below.
  const extraSocials = socials.filter(([name]) => !CONTACT_CHANNEL_KEYS.has(name));
  return (
    <section id="contato" className="mx-auto max-w-3xl scroll-mt-28 px-6 pb-28 pt-16">
      <GlassCard>
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">{t("contatoTitulo")}</h2>
        <p className="mx-auto mt-3 max-w-prose text-center text-white/75">{t("contatoTexto")}</p>
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
  const heroTitle = pickLocalized(s.heroTitle, s.heroTitleEn, locale);
  const heroSubtitle = pickLocalized(s.heroSubtitle, s.heroSubtitleEn, locale);

  return (
    <>
      <link rel="preload" as="image" href="/images/aero-hero.jpg" fetchPriority="high" />
      <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/aero-hero.jpg)" }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-[#02152e]/85 via-[#02152e]/45 to-[#02152e]/10"
        />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#02152e] to-transparent" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 pb-24 pt-32 md:grid-cols-[1.1fr_0.9fr] md:pt-40">
          <HeroIntro>
            <HeroItem>
              <div>
                <h1 className="chrome-text font-display text-5xl font-extrabold leading-tight md:text-7xl">
                  {heroTitle}
                </h1>
                <p className="mt-6 max-w-xl text-lg text-white/90">{heroSubtitle}</p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <a href="#projetos" className="btn-aero">
                    {t("verProjetos")}
                  </a>
                  <a href="#contato" className="btn-ghost">
                    {t("falarComigo")}
                  </a>
                </div>
              </div>
            </HeroItem>
            <HeroItem className="flex justify-center">
              <AeroOrb />
            </HeroItem>
          </HeroIntro>
        </div>
      </section>

      {order.map((id) => (
        <Suspense
          key={id}
          fallback={
            <section className="mx-auto max-w-6xl px-6 py-16">
              <h2 className="font-display text-3xl font-bold text-white/40">{SECTION_LABELS[id]}</h2>
            </section>
          }
        >
          <DynamicSection id={id} settings={s} />
        </Suspense>
      ))}
    </>
  );
}
