import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { db } from "@/lib/db";
import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";

type TokenWithUsername = JWT & { username?: string };

const authConfig: NextAuthConfig = {
  // Use JWT sessions (works in Edge Runtime for middleware)
  // But manually persist User/Account to database in signIn callback
  providers: [
    GitHub({
      // FIXED: Changed from "repo" (full access) to "public_repo" (read-only public repos)
      // This aligns with privacy policy claim of "read-only access to public data"
      authorization: { params: { scope: "read:user user:email public_repo" } },
    }),
  ],
  callbacks: {
    // Runs during sign-in (not in Edge Runtime, so Prisma works here)
    async signIn({ user, account, profile }) {
      try {
        if (!user?.email) return false;

        const login: string | undefined =
          profile && typeof profile.login === "string" ? profile.login : undefined;

        // Manually create/update User in database
        await db.user.upsert({
          where: { email: user.email },
          update: {
            name: user.name,
            image: user.image,
            username: login,
          },
          create: {
            email: user.email,
            name: user.name,
            image: user.image,
            username: login,
          },
        });

        // Manually create/update Account in database
        if (account) {
          const dbUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (dbUser) {
            await db.account.upsert({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
              update: {
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state:
                  typeof account.session_state === "string"
                    ? account.session_state
                    : null,
              },
              create: {
                userId: dbUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state:
                  typeof account.session_state === "string"
                    ? account.session_state
                    : null,
              },
            });
          }
        }

        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    // JWT callback for JWT sessions
    async jwt({ token, profile }) {
      if (profile && typeof profile.login === "string") {
        (token as TokenWithUsername).username = profile.login;
      }
      return token;
    },
    // Session callback for JWT sessions
    async session({ session, token }) {
      if (session.user) {
        session.user.username = (token as TokenWithUsername).username || "";
      }
      return session;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
