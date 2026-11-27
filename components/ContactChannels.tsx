export type ContactChannelKey = "gmail" | "linkedin" | "whatsapp" | "github";

export type ContactChannel = {
  key: ContactChannelKey;
  label: string;
  /** Animated image shown on the contact (GIF). */
  image: string;
  /** APNG version, preferred when the browser supports it; falls back to `image`. */
  imageApng?: string;
};

export const CONTACT_CHANNELS: readonly ContactChannel[] = [
  { key: "gmail", label: "Gmail", image: "/contacts/gmail.gif", imageApng: "/contacts/gmail.png" },
  { key: "linkedin", label: "LinkedIn", image: "/contacts/linkedin.gif" },
  { key: "whatsapp", label: "WhatsApp", image: "/contacts/whatsapp.gif" },
  { key: "github", label: "GitHub", image: "/contacts/github.gif" },
];

export const CONTACT_CHANNEL_KEYS = new Set<string>(CONTACT_CHANNELS.map((c) => c.key));

function resolveUrl(
  channel: ContactChannel,
  socials: Record<string, string | undefined>,
  email: string | undefined,
): string | undefined {
  const configured = socials[channel.key]?.trim();
  if (configured) return configured;
  // Gmail contact falls back to plain e-mail when no explicit link is configured.
  if (channel.key === "gmail" && email?.trim()) return `mailto:${email.trim()}`;
  return undefined;
}

export default function ContactChannels({
  socials,
  email,
}: {
  socials: Record<string, string | undefined>;
  email?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {CONTACT_CHANNELS.map((channel) => {
        const url = resolveUrl(channel, socials, email);
        const className =
          "group flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-center transition hover:border-cyan-300/60 hover:bg-white/10";
        const body = (
          <>
            <picture className="flex h-20 w-20 items-center justify-center">
              {channel.imageApng ? <source srcSet={channel.imageApng} type="image/apng" /> : null}
              <img
                src={channel.image}
                alt={channel.label}
                width={80}
                height={80}
                loading="lazy"
                decoding="async"
                className="h-20 w-20 object-contain transition duration-200 group-hover:scale-110"
              />
            </picture>
            <span className="text-sm font-semibold text-white/85">{channel.label}</span>
          </>
        );

        if (url) {
          const external = /^https?:\/\//i.test(url);
          return (
            <a
              key={channel.key}
              href={url}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={className}
            >
              {body}
            </a>
          );
        }
        return (
          <div key={channel.key} className={className}>
            {body}
          </div>
        );
      })}
    </div>
  );
}
