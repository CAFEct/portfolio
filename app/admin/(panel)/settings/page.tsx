import { getSettings } from "@/lib/settings";
import { DEFAULT_SETTINGS, SECTION_DEFS } from "@/lib/settings";
import { Field, TextArea, TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { updateSettings } from "./actions";
import UploadInput from "@/components/admin/upload-input";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const sp = await searchParams;
  const settings = await getSettings().catch(() => DEFAULT_SETTINGS);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold">Configurações</h1>
      <p className="mt-1 text-sm text-white/60">Textos, redes sociais, SEO e ordem das seções do site.</p>

      {sp.error ? (
        <p className="mt-4 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {sp.error}
        </p>
      ) : null}
      {sp.saved ? <p className="mt-4 text-sm text-emerald-300">Configurações salvas.</p> : null}

      <form action={updateSettings} className="mt-8 space-y-8">
        <section className="glass space-y-5 p-6">
          <h2 className="font-display text-xl font-bold text-cyan-200">Hero</h2>
          <Field label="PDF do currículo" htmlFor="cvUrl" hint="Envie o PDF para exibir no modal da navegação.">
            <UploadInput name="cvUrl" defaultValue={settings.cvUrl} accept="application/pdf" />
          </Field>
          <Field label="Imagem de fundo do hero" htmlFor="heroImage"><UploadInput name="heroImage" defaultValue={settings.heroImage} accept="image/png,image/jpeg,image/webp" /></Field>
          <div className="grid gap-5 sm:grid-cols-2"><Field label="Foto do perfil" htmlFor="profileImage"><UploadInput name="profileImage" defaultValue={settings.profileImage} accept="image/png,image/jpeg,image/webp" /></Field><Field label="Foto da seção Sobre" htmlFor="aboutImage"><UploadInput name="aboutImage" defaultValue={settings.aboutImage} accept="image/png,image/jpeg,image/webp" /></Field></div>
          <Field label="Título principal" htmlFor="heroTitle">
            <TextInput id="heroTitle" name="heroTitle" required defaultValue={settings.heroTitle} />
          </Field>
          <Field label="Título principal (EN)" htmlFor="heroTitleEn">
            <TextInput id="heroTitleEn" name="heroTitleEn" defaultValue={settings.heroTitleEn} />
          </Field>
          <Field label="Título principal (ES)" htmlFor="heroTitleEs">
            <TextInput id="heroTitleEs" name="heroTitleEs" defaultValue={settings.heroTitleEs} />
          </Field>
          <Field label="Subtítulo" htmlFor="heroSubtitle">
            <TextArea id="heroSubtitle" name="heroSubtitle" rows={2} defaultValue={settings.heroSubtitle} />
          </Field>
          <Field label="Subtítulo (EN)" htmlFor="heroSubtitleEn">
            <TextArea id="heroSubtitleEn" name="heroSubtitleEn" rows={2} defaultValue={settings.heroSubtitleEn} />
          </Field>
          <Field label="Subtítulo (ES)" htmlFor="heroSubtitleEs">
            <TextArea id="heroSubtitleEs" name="heroSubtitleEs" rows={2} defaultValue={settings.heroSubtitleEs} />
          </Field>
          <Field label="Cargos rotativos (PT-BR, um por linha)" htmlFor="heroRolesPt"><TextArea id="heroRolesPt" name="heroRolesPt" rows={3} defaultValue={settings.heroRolesPt} /></Field>
          <Field label="Rotating roles (EN, one per line)" htmlFor="heroRolesEn"><TextArea id="heroRolesEn" name="heroRolesEn" rows={3} defaultValue={settings.heroRolesEn} /></Field>
          <Field label="Roles rotativos (ES, uno por línea)" htmlFor="heroRolesEs"><TextArea id="heroRolesEs" name="heroRolesEs" rows={3} defaultValue={settings.heroRolesEs} /></Field>
        </section>

        <section className="glass space-y-5 p-6">
          <h2 className="font-display text-xl font-bold text-cyan-200">Sobre</h2>
          <Field label="Texto da seção Sobre" htmlFor="aboutText">
            <TextArea id="aboutText" name="aboutText" rows={5} defaultValue={settings.aboutText} />
          </Field>
          <Field label="Texto da seção Sobre (EN)" htmlFor="aboutTextEn">
            <TextArea id="aboutTextEn" name="aboutTextEn" rows={5} defaultValue={settings.aboutTextEn} />
          </Field>
          <Field label="Texto da seção Sobre (ES)" htmlFor="aboutTextEs">
            <TextArea id="aboutTextEs" name="aboutTextEs" rows={5} defaultValue={settings.aboutTextEs} />
          </Field>
        </section>

        <section className="glass space-y-5 p-6">
          <h2 className="font-display text-xl font-bold text-cyan-200">Contato e redes</h2>
          <Field label="E-mail de contato" htmlFor="email">
            <TextInput id="email" name="email" type="email" defaultValue={settings.email} />
          </Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Localização" htmlFor="location"><TextInput id="location" name="location" defaultValue={settings.location} /></Field>
            <Field label="Telefone" htmlFor="phone"><TextInput id="phone" name="phone" defaultValue={settings.phone} /></Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="GitHub" htmlFor="social_github">
              <TextInput id="social_github" name="social_github" type="url" defaultValue={settings.socials.github} placeholder="https://github.com/…" />
            </Field>
            <Field label="YouTube" htmlFor="social_youtube">
              <TextInput id="social_youtube" name="social_youtube" type="url" defaultValue={settings.socials.youtube} placeholder="https://youtube.com/…" />
            </Field>
            <Field label="LinkedIn" htmlFor="social_linkedin">
              <TextInput id="social_linkedin" name="social_linkedin" type="url" defaultValue={settings.socials.linkedin} placeholder="https://linkedin.com/…" />
            </Field>
            <Field label="Instagram" htmlFor="social_instagram">
              <TextInput id="social_instagram" name="social_instagram" type="url" defaultValue={settings.socials.instagram} placeholder="https://instagram.com/…" />
            </Field>
            <Field label="Gmail" htmlFor="social_gmail">
              <TextInput id="social_gmail" name="social_gmail" defaultValue={settings.socials.gmail} placeholder="mailto:voce@gmail.com ou https://…" />
            </Field>
            <Field label="WhatsApp" htmlFor="social_whatsapp">
              <TextInput id="social_whatsapp" name="social_whatsapp" type="url" defaultValue={settings.socials.whatsapp} placeholder="https://wa.me/…" />
            </Field>
            <Field label="X / Twitter" htmlFor="social_x">
              <TextInput id="social_x" name="social_x" type="url" defaultValue={settings.socials.x} placeholder="https://x.com/…" />
            </Field>
            <Field label="Calendly" htmlFor="social_calendly">
              <TextInput id="social_calendly" name="social_calendly" type="url" defaultValue={settings.socials.calendly} placeholder="https://calendly.com/…" />
            </Field>
          </div>
        </section>

        <section className="glass space-y-5 p-6">
          <h2 className="font-display text-xl font-bold text-cyan-200">SEO</h2>
          <Field label="Título (meta)" htmlFor="seo_title">
            <TextInput id="seo_title" name="seo_title" required defaultValue={settings.seo.title} />
          </Field>
          <Field label="Título (meta, EN)" htmlFor="seo_titleEn">
            <TextInput id="seo_titleEn" name="seo_titleEn" defaultValue={settings.seo.titleEn} />
          </Field>
          <Field label="Descrição (meta)" htmlFor="seo_description">
            <TextArea id="seo_description" name="seo_description" rows={2} defaultValue={settings.seo.description} />
          </Field>
          <Field label="Descrição (meta, EN)" htmlFor="seo_descriptionEn">
            <TextArea id="seo_descriptionEn" name="seo_descriptionEn" rows={2} defaultValue={settings.seo.descriptionEn} />
          </Field>
        </section>

        <section className="glass space-y-4 p-6">
          <h2 className="font-display text-xl font-bold text-cyan-200">Seções da página inicial</h2>
          <p className="text-sm text-white/60">Marque as visíveis e ajuste a ordem (menor = primeiro).</p>
          <ul className="space-y-2">
            {settings.sections.map((section) => {
              const def = SECTION_DEFS.find((d) => d.id === section.id);
              return (
                <li
                  key={section.id}
                  className="flex flex-wrap items-center gap-4 rounded-xl border border-white/15 bg-white/5 px-4 py-3"
                >
                  <label className="flex min-w-40 flex-1 items-center gap-2 text-sm text-white/85">
                    <input
                      type="checkbox"
                      name={`visible_${section.id}`}
                      defaultChecked={section.visible}
                      className="h-4 w-4 accent-cyan-400"
                    />
                    {def?.label ?? section.id}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white/60">
                    Ordem
                    <input
                      type="number"
                      name={`order_${section.id}`}
                      defaultValue={section.order}
                      className="w-20 rounded-lg border border-white/25 bg-white/10 px-2 py-1 text-white outline-none focus:border-cyan-300"
                    />
                  </label>
                </li>
              );
            })}
          </ul>
        </section>

        <SubmitButton>Salvar configurações</SubmitButton>
      </form>
    </div>
  );
}
