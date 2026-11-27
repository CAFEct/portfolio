import { auth } from "@/auth";
import { redirect } from "next/navigation";

function isAdminEmail(email: string | null | undefined) {
  const admin = process.env.ADMIN_EMAIL?.toLowerCase();
  return !!email && !!admin && email.toLowerCase() === admin;
}

export async function getAdminSession() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) return null;
  return session;
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
