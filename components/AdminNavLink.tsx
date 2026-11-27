"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminNavLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.email) setIsAdmin(true);
      })
      .catch(() => {});
  }, []);

  if (!isAdmin) return null;
  return (
    <Link
      href="/admin"
      className="block whitespace-nowrap rounded-full border border-sky-500/40 px-3 py-1.5 text-sm font-semibold text-[#0750c2] transition hover:bg-sky-100"
    >
      Admin
    </Link>
  );
}
