"use client";

import { useEffect } from "react";

const TRACK_TYPES = new Set(["project_click", "pdf_download"]);

function send(type: string, path: string) {
  const payload = JSON.stringify({
    type,
    path,
    referrer: document.referrer || undefined,
  });
  if (!navigator.sendBeacon("/api/track", payload)) {
    fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
  }
}

export default function AnalyticsTracker() {
  useEffect(() => {
    send("page_view", window.location.pathname);

    function onClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement | null)?.closest?.("a[data-track]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const type = anchor.getAttribute("data-track") ?? "";
      if (!TRACK_TYPES.has(type)) return;
      try {
        const url = new URL(anchor.href, window.location.origin);
        send(type, url.pathname + url.search);
      } catch {
        send(type, anchor.getAttribute("href") ?? window.location.pathname);
      }
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
