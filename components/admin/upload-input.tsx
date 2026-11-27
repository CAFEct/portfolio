"use client";

import { useRef, useState, useTransition } from "react";
import { uploadFile } from "@/app/admin/actions/upload";

export default function UploadInput({
  name,
  defaultValue = "",
  accept,
  placeholder,
}: {
  name: string;
  defaultValue?: string;
  accept: string;
  placeholder?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    setError(null);
    startTransition(async () => {
      const res = await uploadFile(fd);
      if (res.ok && res.url) setUrl(res.url);
      else setError(res.error ?? "Falha no upload.");
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="url"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={placeholder ?? "https://…"}
          className="w-full rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-white placeholder-white/40 outline-none transition focus:border-cyan-300 focus:bg-white/15"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={pending}
          className="btn-ghost shrink-0 !px-4 !py-2.5 text-sm"
        >
          {pending ? "Enviando…" : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onFile}
        />
      </div>
      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
}
