"use client";

import { useEffect, useState } from "react";

export default function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setIndex((current) => (current + 1) % roles.length), 2800);
    return () => window.clearInterval(id);
  }, [roles.length]);
  return <span className="text-[#176dcc]" aria-live="polite">{roles[index]}</span>;
}
