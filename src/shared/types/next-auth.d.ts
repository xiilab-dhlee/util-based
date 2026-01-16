import type { DefaultJWT, DefaultSession } from "next-auth";

import type { AccountRole } from "@/shared/constants/core.constant";

declare module "next-auth" {
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
    roles?: AccountRole[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
    error?: string;
    roles?: AccountRole[];
    id?: string;
    name?: string;
    email?: string;
    preferred_username?: string;
  }
}
