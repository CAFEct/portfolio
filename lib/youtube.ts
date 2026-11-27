const ID_PATTERN = /^[A-Za-z0-9_-]{6,20}$/;

export function extractYoutubeId(input: string): string | null {
  const value = input.trim();
  if (ID_PATTERN.test(value) && !value.includes(" ")) return value;

  let url: URL;
  try {
    url = new URL(value.startsWith("http") ? value : `https://${value}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\.|^m\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.slice(1).split("/")[0];
    return ID_PATTERN.test(id) ? id : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      const id = url.searchParams.get("v");
      return id && ID_PATTERN.test(id) ? id : null;
    }
    const match = url.pathname.match(/^\/(shorts|embed|live|v)\/([A-Za-z0-9_-]+)/);
    return match ? match[2] : null;
  }
  return null;
}
