import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import VideoForm from "@/components/admin/video-form";
import { db } from "@/db";
import { videos } from "@/db/schema";
import { updateVideo } from "../../actions";

export default async function EditVideoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const rows = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  const video = rows[0];
  if (!video) notFound();

  return (
    <div>
      <Link href="/admin/videos" className="text-sm text-white/60 hover:text-white">← Voltar</Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Editar vídeo</h1>
      {sp.saved ? <p className="mt-3 text-sm text-emerald-300">Salvo.</p> : null}
      <div className="mt-6">
        <VideoForm action={updateVideo.bind(null, video.id)} video={video} error={sp.error} />
      </div>
    </div>
  );
}
