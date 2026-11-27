import { getTranslations } from "next-intl/server";
import GlassCard from "@/components/GlassCard";
import VideoEmbed from "@/components/VideoEmbed";
import { getVideosPublic } from "@/lib/queries";
import { getContentLocale, pickLocalized } from "@/lib/i18n";

export default async function VideosPage() {
  const [items, locale, t, tv] = await Promise.all([
    getVideosPublic().catch(() => []),
    getContentLocale(),
    getTranslations("home"),
    getTranslations("videos"),
  ]);
  return <section className="mx-auto min-h-screen max-w-6xl px-6 pb-24 pt-32">
    <h1 className="font-display text-4xl font-extrabold text-[#06203f] md:text-5xl">{t("videosTitulo")}</h1>
    <p className="mt-3 text-[#234661]">{locale === "en" ? "Video Hub" : locale === "es" ? "Centro de videos" : "Central de vídeos"}</p>
    {items.length ? <div className="mt-8 grid gap-6 md:grid-cols-2">{items.map((video) => {
      const title = pickLocalized(video.title, video.titleEn, locale);
      return <GlassCard key={video.id} className="p-4"><VideoEmbed youtubeId={video.youtubeId} title={title} playLabel={tv("reproduzir", { title })} /><h2 className="mt-4 font-display text-xl font-bold">{title}</h2>{video.description ? <p className="mt-2 text-[#234661]">{pickLocalized(video.description, video.descriptionEn, locale)}</p> : null}</GlassCard>;
    })}</div> : <GlassCard className="mt-8 text-[#234661]">{locale === "en" ? "Videos will appear here soon." : locale === "es" ? "Pronto habrá videos aquí." : "Em breve, novos vídeos por aqui."}</GlassCard>}
  </section>;
}
