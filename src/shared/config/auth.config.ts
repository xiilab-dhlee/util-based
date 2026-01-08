import type { Account, NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import KeycloakProvider from "next-auth/providers/keycloak";

import {
  DEFAULT_TEST_USER,
  TEST_USERS,
} from "@/shared/constants/auth.constant";

// ============================================================================
// 환경 설정
// ============================================================================

/**
 * 테스트/모킹 환경 여부
 * - TEST_AUTH_ENABLE=true: KeycloakProvider 사용 (테스트/모킹)
 * - TEST_AUTH_ENABLE=false 또는 미설정: CredentialsProvider 사용 (기본값)
 */
const useTestAuth = process.env.TEST_AUTH_ENABLE === "true";

// ============================================================================
// 테스트 환경 헬퍼 (CredentialsProvider)
// ============================================================================

interface DevUser {
  id: string;
  name: string;
  email: string;
  preferred_username: string;
  roles: string[];
}

function getDevUserFromCredentials(user?: User | DevUser): DevUser {
  const devUser = user as DevUser | undefined;
  return {
    id: devUser?.id ?? DEFAULT_TEST_USER.id,
    name: devUser?.name ?? DEFAULT_TEST_USER.name,
    email: devUser?.email ?? DEFAULT_TEST_USER.email,
    preferred_username:
      devUser?.preferred_username ?? DEFAULT_TEST_USER.preferred_username,
    roles: devUser?.roles ?? DEFAULT_TEST_USER.roles,
  };
}

function createTestToken(token: JWT, user?: User): JWT {
  const devUser = getDevUserFromCredentials(user);
  return {
    ...token,
    ...devUser,
    access_token: process.env.TEST_ACCESS_TOKEN ?? "dev-test-access-token",
    refresh_token: process.env.TEST_REFRESH_TOKEN ?? "dev-test-refresh-token",
    expires_at: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
  };
}

function createTestSession(session: Session, token: JWT): Session {
  return {
    ...session,
    accessToken: (token.access_token as string) ?? "dev-test-access-token",
    refresh_token: (token.refresh_token as string) ?? "dev-test-refresh-token",
    user: {
      ...session.user,
      id: token.id,
      name: token.name,
      email: token.email,
      preferred_username: token.preferred_username,
    },
    roles: (token.roles as string[]) ?? DEFAULT_TEST_USER.roles,
    error: token.error,
  };
}

// ============================================================================
// Keycloak 환경 헬퍼
// ============================================================================

interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

async function refreshKeycloakToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(
      `${process.env.AUTH_ISSUER}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: process.env.AUTH_CLIENT_ID ?? "",
          client_secret: process.env.AUTH_CLIENT_SECRET ?? "",
          grant_type: "refresh_token",
          refresh_token: token.refresh_token as string,
        }),
      },
    );

    const refreshedTokens: KeycloakTokenResponse = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token ?? token.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

function createKeycloakToken(token: JWT, user: User, account: Account): JWT {
  let roles: string[] = [];
  try {
    const accessToken = account.access_token;
    if (accessToken) {
      const payload = JSON.parse(
        Buffer.from(accessToken.split(".")[1], "base64").toString(),
      );
      roles = payload.realm_access?.roles ?? [];
    }
  } catch {
    console.warn("Failed to parse Keycloak token for roles");
  }

  return {
    ...token,
    id: user.id,
    name: user.name ?? undefined,
    email: user.email ?? undefined,
    preferred_username:
      (user as DevUser).preferred_username ?? user.email ?? undefined,
    roles,
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expires_at: account.expires_at,
  };
}

function createKeycloakSession(session: Session, token: JWT): Session {
  return {
    ...session,
    accessToken: token.access_token as string,
    refresh_token: token.refresh_token as string,
    user: {
      ...session.user,
      id: token.id,
      name: token.name,
      email: token.email,
      preferred_username: token.preferred_username,
    },
    roles: (token.roles as string[]) ?? [],
    error: token.error,
  };
}

// ============================================================================
// Provider 설정
// ============================================================================

const testProviders = [
  CredentialsProvider({
    id: "credentials",
    name: "Test Credentials",
    credentials: {
      username: { label: "Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      // 자동 로그인 (credentials 없음)
      if (!credentials?.username && !credentials?.password) {
        return getDevUserFromCredentials();
      }

      // 테스트 계정 로그인 (username === password)
      const testUser = TEST_USERS[credentials.username];
      if (testUser && credentials.password === credentials.username) {
        return getDevUserFromCredentials(testUser);
      }

      return null;
    },
  }),
];

const keycloakProviders = [
  KeycloakProvider({
    clientId: process.env.AUTH_CLIENT_ID ?? "",
    clientSecret: process.env.AUTH_CLIENT_SECRET ?? "",
    issuer: process.env.AUTH_ISSUER,
  }),
];

// ============================================================================
// Callbacks 설정
// ============================================================================

const testCallbacks: NextAuthOptions["callbacks"] = {
  async jwt({ token, user }): Promise<JWT> {
    return user || !token.access_token ? createTestToken(token, user) : token;
  },

  async session({ session, token }): Promise<Session> {
    return createTestSession(session, token);
  },
};

const keycloakCallbacks: NextAuthOptions["callbacks"] = {
  async jwt({ token, user, account }): Promise<JWT> {
    // 최초 로그인 시 Keycloak 토큰 정보 저장
    if (account && user) {
      return createKeycloakToken(token, user, account);
    }

    // 토큰 만료 전이면 기존 토큰 반환
    const expiresAt = token.expires_at as number;
    if (Date.now() < expiresAt * 1000) {
      return token;
    }

    // 토큰 만료 시 갱신
    return refreshKeycloakToken(token);
  },

  async session({ session, token }): Promise<Session> {
    return createKeycloakSession(session, token);
  },
};

// ============================================================================
// NextAuth 설정
// ============================================================================

export const authOptions: NextAuthOptions = {
  providers: useTestAuth ? testProviders : keycloakProviders,
  callbacks: useTestAuth ? testCallbacks : keycloakCallbacks,

  pages: {
    signIn: "/signin",
    error: "/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-key-for-development",
  debug: false,
};
