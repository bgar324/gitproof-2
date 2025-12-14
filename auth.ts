import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

// @ts-ignore // <--- This magic comment silences the "Not callable" error
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      authorization: { params: { scope: "read:user repo" } },
    }),
  ],
  callbacks: {
    // We explicitly type these as 'any' to fix the other red lines
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken
      return session
    },
  },
})