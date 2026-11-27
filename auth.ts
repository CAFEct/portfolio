import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();

function isAdminEmail(email: string | null | undefined) {
  return !!email && !!adminEmail && email.toLowerCase() === adminEmail;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET ?? process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    signIn({ profile }) {
      return isAdminEmail(profile?.email);
    },
    session({ session, token }) {
      if (session.user && token.email) {
        session.user.email = token.email as string;
      }
      return session;
    },
    jwt({ token, profile }) {
      if (profile?.email) {
        token.email = profile.email;
      }
      return token;
    },
  },
});
