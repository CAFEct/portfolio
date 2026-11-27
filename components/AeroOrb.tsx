const bubbles = [
  { size: "2.5rem", top: "-6%", left: "30%", delay: "0s" },
  { size: "1.5rem", top: "8%", left: "72%", delay: "1.2s" },
  { size: "2rem", top: "55%", left: "-8%", delay: "2s" },
  { size: "1.25rem", top: "70%", left: "80%", delay: "0.6s" },
  { size: "3rem", top: "30%", left: "-14%", delay: "1.6s" },
  { size: "1.75rem", top: "85%", left: "45%", delay: "2.6s" },
];

export default function AeroOrb() {
  return (
    <div className="relative mx-auto w-fit" aria-hidden="true">
      <div className="orb">
        <span className="font-display text-6xl font-extrabold text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">
          CAFÉ
        </span>
      </div>
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  );
}
