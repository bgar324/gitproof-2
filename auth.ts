import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

// FIX: Cast NextAuth to 'any' to silence the "not callable" error
export const { handlers, auth, signIn, signOut } = (NextAuth as any)({
  providers: [
    GitHub({
      authorization: { params: { scope: "read:user user:email repo" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account) {
        token.accessToken = account.access_token
      }
      if (profile) {
        token.username = profile.login; 
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      if (session.user) {
        session.user.username = token.username
      }
      return session
    },
  },
})