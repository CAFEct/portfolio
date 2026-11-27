import Image from "next/image";

const bubbles = [
  { size: "2.5rem", top: "-6%", left: "30%", delay: "0s" },
  { size: "1.5rem", top: "8%", left: "72%", delay: "1.2s" },
  { size: "2rem", top: "55%", left: "-8%", delay: "2s" },
  { size: "1.25rem", top: "70%", left: "80%", delay: "0.6s" },
  { size: "3rem", top: "30%", left: "-14%", delay: "1.6s" },
  { size: "1.75rem", top: "85%", left: "45%", delay: "2.6s" },
];

export default function AeroOrb({ profileImage = "/images/pfp.jpg" }: { profileImage?: string }) {
  return (
    <div className="relative mx-auto w-fit px-4 py-8" aria-label="Foto de Gabriel Felipe">
      <div className="orb">
        <Image src={profileImage} alt="Gabriel Felipe" fill sizes="(max-width: 768px) 75vw, 400px" onError={(event) => { event.currentTarget.style.display = "none"; }} />
        <span className="absolute inset-0 grid place-items-center font-display text-6xl font-extrabold text-[#0b5ed7]/50">GF</span>
      </div>
      <div className="glass absolute left-0 top-6 rounded-full px-4 py-3 text-sm font-bold">🎉 1+ ano de Experiência</div>
      <div className="glass absolute bottom-6 right-0 rounded-full px-4 py-3 text-sm font-bold">⭐ 5+ Projetos Feitos</div>
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
