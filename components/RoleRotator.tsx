"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export default function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % roles.length), 2800);
    return () => window.clearInterval(id);
  }, [roles.length, reduce]);
  return <span className="text-[#176dcc]" aria-live="polite">{reduce ? roles[0] : roles[index]}</span>;
}
