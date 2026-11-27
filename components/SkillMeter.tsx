"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function SkillMeter({ level }: { level: number }) {
  const reduce = useReducedMotion();
  return <div className="skill-track mt-1.5"><motion.div className="skill-fill" initial={{ width: reduce ? `${level}%` : 0 }} whileInView={{ width: `${level}%` }} viewport={{ once: true, amount: 0.8 }} transition={{ duration: 0.9, ease: "easeOut" }} /></div>;
}
