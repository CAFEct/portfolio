"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export default function VideoEmbed({
  youtubeId,
  title,
}: {
  youtubeId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl"
      aria-label={`Reproduzir vídeo: ${title}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- YouTube thumbnail, no next/image domain needed */}
      <img
        src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition group-hover:scale-105"
      />
      <span className="absolute inset-0 grid place-items-center bg-black/25 transition group-hover:bg-black/15">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-white/60 bg-white/20 backdrop-blur-md transition group-hover:scale-110">
          <Play className="ml-1 h-7 w-7 fill-white text-white" />
        </span>
      </span>
    </button>
  );
}
