import { JWT as originJWT } from "next-auth";

declare module "next-auth/providers/keycloak" {
  interface TOKEN {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    id_token: string;
    "not-before-policy": number;
    session_state: string;
    scope: string;
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends originSession {
    accessToken?: string;
    refresh_token?: string;
    error?: string;
    // 엔진엑스에서 과도한 캐시로 다운이 되어서 제외
    origin?: import("next-auth/providers/keycloak").TOKEN;
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      preferred_username?: string | null;
    };
    roles?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends originJWT {
    access_token?: string;
    refresh_token?: string;
    expires_at: number;
    error?: string;
    accessTokenExpired?: number;
    refreshTokenExpired?: number;

    preferred_username?: string;
    name?: string;
    email?: string;
    sub?: string;
    id?: string;
    access_token?: string;
    refresh_token?: string;
    iat?: number;
    exp?: number;
    jti?: string;
  }
}
