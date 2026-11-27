"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { id: string; label: string };

export default function NavItems({ items }: { items: Item[] }) {
  const pathname = usePathname();
  const [active, setActive] = useState("home");
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = items.map(({ id }) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (current?.target.id) setActive(current.target.id);
    }, { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.15, 0.4, 0.7] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items, pathname]);
  const currentActive = pathname === "/videos" ? "videos" : pathname === "/" ? active : "";

  return <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-1">
    {items.map(({ id, label }) => <li key={id}>{id === "videos" ? <Link href="/videos" aria-current={currentActive === id ? "page" : undefined} className={`block whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition ${currentActive === id ? "bg-white/90 text-[#0750c2] shadow-sm" : "text-[#173b59] hover:bg-white/75 hover:text-[#0750c2]"}`}>{label}</Link> : <a href={`#${id}`} aria-current={currentActive === id ? "location" : undefined} className={`block whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold transition ${currentActive === id ? "bg-white/90 text-[#0750c2] shadow-sm" : "text-[#173b59] hover:bg-white/75 hover:text-[#0750c2]"}`}>{label}</a>}</li>)}
  </ul>;
}
