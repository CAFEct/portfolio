import Link from "next/link";
import VideoForm from "@/components/admin/video-form";
import { createVideo } from "../actions";

export default async function NewVideoPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <div>
      <Link href="/admin/videos" className="text-sm text-white/60 hover:text-white">← Voltar</Link>
      <h1 className="mt-2 font-display text-3xl font-bold">Novo vídeo</h1>
      <div className="mt-6">
        <VideoForm action={createVideo} error={error} />
      </div>
    </div>
  );
}
