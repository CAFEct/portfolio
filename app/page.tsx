import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import AeroOrb from "@/components/AeroOrb";
import GlassCard from "@/components/GlassCard";
import VideoEmbed from "@/components/VideoEmbed";
import ContactForm from "@/components/ContactForm";
import { getSettings, visibleSections, SECTION_DEFS, DEFAULT_SETTINGS, type SiteSettings, type SectionId } from "@/lib/settings";
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
  return (
    <SectionShell id="sobre" title="Sobre mim">
      <GlassCard>
        <p className="max-w-prose whitespace-pre-line text-white/80">{settings.aboutText}</p>
      </GlassCard>
    </SectionShell>
  );
}

async function ProjetosSection() {
  const projects = await safe(getVisibleProjects(), []);
  if (projects.length === 0) return null;
  return (
    <SectionShell id="projetos" title="Projetos">
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((p) => (
          <Link key={p.id} href={`/projetos/${p.slug}`} className="block">
            <GlassCard className="flex h-full flex-col transition hover:border-cyan-300/60">
              <h3 className="font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-3 flex-1 text-white/75">{p.description}</p>
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
          Ver todos os projetos
        </Link>
      </div>
    </SectionShell>
  );
}

async function ExperienciaSection() {
  const items = await safe(getExperiencesPublic(), []);
  if (items.length === 0) return null;
  return (
    <SectionShell id="experiencia" title="Experiência">
      <ol className="relative space-y-6 border-l border-white/20 pl-8">
        {items.map((e) => (
          <li key={e.id} className="relative">
            <span className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(34,229,255,0.8)]" />
            <p className="text-sm font-semibold text-cyan-200">{e.period}</p>
            <h3 className="mt-1 font-display text-xl font-bold">{e.role}</h3>
            <p className="text-white/70">{e.company}</p>
            {e.description ? <p className="mt-2 max-w-prose text-sm text-white/70">{e.description}</p> : null}
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}

async function HabilidadesSection() {
  const items = await safe(getSkillsPublic(), []);
  if (items.length === 0) return null;
  const groups = new Map<string, typeof items>();
  for (const s of items) {
    const list = groups.get(s.category) ?? [];
    list.push(s);
    groups.set(s.category, list);
  }
  return (
    <SectionShell id="habilidades" title="Habilidades">
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
  const items = await safe(getVideosPublic(), []);
  if (items.length === 0) return null;
  return (
    <SectionShell id="videos" title="Vídeos">
      <div className="grid gap-6 md:grid-cols-2">
        {items.slice(0, 4).map((v) => (
          <GlassCard key={v.id} className="p-4">
            <VideoEmbed youtubeId={v.youtubeId} title={v.title} />
            <h3 className="mt-3 font-display text-lg font-bold">{v.title}</h3>
            {v.description ? <p className="mt-1 text-sm text-white/70">{v.description}</p> : null}
          </GlassCard>
        ))}
      </div>
    </SectionShell>
  );
}

async function CertificadosSection() {
  const total = await safe(getVisibleCertificateCount(), 0);
  return (
    <section id="certificados" className="mx-auto max-w-4xl scroll-mt-28 px-6 py-16">
      <GlassCard className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold md:text-4xl">Certificados</h2>
          <p className="mt-3 text-white/75">
            {total > 0 ? `${total} certificados em desenvolvimento e gestão.` : "Certificados e formações."}
          </p>
        </div>
        <Link href="/certificados" className="btn-aero">
          Ver certificados
        </Link>
      </GlassCard>
    </section>
  );
}

function ContatoSection({ settings }: { settings: SiteSettings }) {
  const socials = Object.entries(settings.socials).filter(([, url]) => url);
  return (
    <section id="contato" className="mx-auto max-w-3xl scroll-mt-28 px-6 pb-28 pt-16">
      <GlassCard>
        <h2 className="text-center font-display text-3xl font-bold md:text-4xl">Vamos construir algo juntos?</h2>
        <p className="mx-auto mt-3 max-w-prose text-center text-white/75">
          Me chame para um projeto, uma parceria ou só para trocar ideia sobre código.
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
        {socials.length > 0 ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm">
            {socials.map(([name, url]) => (
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
  const settings = await safe(getSettings(), null);
  const s: SiteSettings = settings ?? DEFAULT_SETTINGS;
  const order = visibleSections(s).filter((id) => id !== "home");

  return (
    <>
      <section
        id="home"
        className="mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-6 pb-20 pt-32 md:grid-cols-[1.1fr_0.9fr]"
      >
        <div>
          <h1 className="chrome-text font-display text-5xl font-extrabold leading-tight md:text-7xl">
            {s.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">{s.heroSubtitle}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#projetos" className="btn-aero">
              Ver projetos
            </a>
            <a href="#contato" className="btn-ghost">
              Falar comigo
            </a>
          </div>
        </div>
        <AeroOrb />
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
