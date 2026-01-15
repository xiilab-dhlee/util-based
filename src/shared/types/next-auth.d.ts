import type { DefaultJWT, DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    accessToken?: string;
    refresh_token?: string;
    error?: string;
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      preferred_username?: string | null;
    };
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    error?: string;
    roles?: string[];
    id?: string;
    name?: string;
    email?: string;
    preferred_username?: string;
  }
}
