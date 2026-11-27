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
    <li>
      <Link
        href="/admin"
        className="block whitespace-nowrap rounded-full border border-cyan-300/50 px-3 py-1.5 text-cyan-200 transition hover:bg-cyan-300/15"
      >
        Admin
      </Link>
    </li>
  );
}
