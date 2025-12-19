import type { DefaultSession } from "next-auth";

declare module "@auth/core/types" {
  interface Session {
    accessToken?: string;
    user?: {
      username?: string | null;
    } & DefaultSession["user"];
  }

  interface Profile {
    login: string;
  }

  interface User {
    username?: string | null;
  }
}

export {};
