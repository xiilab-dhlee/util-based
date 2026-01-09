import type { Account, NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import KeycloakProvider from "next-auth/providers/keycloak";

// ============================================================================
// 환경 설정
// ============================================================================

/**
 * 테스트/모킹 환경 여부
 * - TEST_AUTH_ENABLE=true: CredentialsProvider 사용 (테스트/모킹)
 * - TEST_AUTH_ENABLE=false 또는 미설정: KeycloakProvider 사용 (기본값)
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

interface KeycloakPasswordGrantResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

interface DecodedKeycloakToken {
  sub: string;
  name?: string;
  email?: string;
  preferred_username?: string;
  realm_access?: { roles: string[] };
}

/**
 * JWT access_token에서 사용자 정보를 파싱합니다.
 */
function parseUserFromAccessToken(accessToken: string): DevUser | null {
  try {
    const payload: DecodedKeycloakToken = JSON.parse(
      Buffer.from(accessToken.split(".")[1], "base64").toString(),
    );
    return {
      id: payload.sub,
      name: payload.name ?? payload.preferred_username ?? "Unknown",
      email: payload.email ?? "",
      preferred_username: payload.preferred_username ?? payload.email ?? "",
      roles: payload.realm_access?.roles ?? [],
    };
  } catch (error) {
    console.error("Failed to parse access token:", error);
    return null;
  }
}

/**
 * Backend API를 통해 Keycloak 토큰을 발급받습니다.
 */
async function fetchKeycloakTokenWithPassword(): Promise<KeycloakPasswordGrantResponse | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const username = process.env.AUTH_USERNAME;
  const password = process.env.AUTH_PASSWORD;
  const clientSecret = process.env.AUTH_CLIENT_SECRET;

  if (!apiUrl || !username || !password || !clientSecret) {
    console.warn("Missing test auth environment variables");
    return null;
  }

  const tokenUrl = `${apiUrl}/api/v1/auth/tokens`;
  const requestBody = {
    userName: username,
    password: password,
    clientSecret: clientSecret,
  };

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Failed to fetch auth token:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });
      return null;
    }

    const responseData = await response.json();

    // Backend API 응답에서 토큰 데이터 추출 (BaseResponse 형식 처리)
    const tokenData = responseData.data ?? responseData;

    // Backend API는 camelCase로 응답하므로 snake_case로 변환
    return {
      access_token: tokenData.accessToken ?? tokenData.access_token,
      refresh_token: tokenData.refreshToken ?? tokenData.refresh_token,
      expires_in: tokenData.expiresIn ?? tokenData.expires_in,
      refresh_expires_in:
        tokenData.refreshExpiresIn ??
        tokenData.refresh_expires_in ??
        tokenData.expiresIn ??
        tokenData.expires_in,
    };
  } catch (error) {
    console.error("Error fetching auth token:", error);
    return null;
  }
}

// 토큰 캐시 (서버 재시작 전까지 유지)
let cachedTestToken: {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: DevUser;
} | null = null;

async function createTestToken(token: JWT): Promise<JWT> {
  // 캐시된 토큰이 있고 아직 유효하면 재사용
  if (
    cachedTestToken &&
    Date.now() < cachedTestToken.expires_at * 1000 - 60000
  ) {
    return {
      ...token,
      ...cachedTestToken.user,
      access_token: cachedTestToken.access_token,
      refresh_token: cachedTestToken.refresh_token,
      expires_at: cachedTestToken.expires_at,
    };
  }

  // Keycloak에서 새 토큰 발급
  const keycloakToken = await fetchKeycloakTokenWithPassword();

  if (keycloakToken) {
    const expires_at = Math.floor(Date.now() / 1000) + keycloakToken.expires_in;
    // 토큰에서 실제 사용자 정보 파싱
    const parsedUser = parseUserFromAccessToken(keycloakToken.access_token);

    if (!parsedUser) {
      throw new Error("Failed to parse user from Keycloak token");
    }

    cachedTestToken = {
      access_token: keycloakToken.access_token,
      refresh_token: keycloakToken.refresh_token,
      expires_at,
      user: parsedUser,
    };

    return {
      ...token,
      ...parsedUser,
      access_token: keycloakToken.access_token,
      refresh_token: keycloakToken.refresh_token,
      expires_at,
    };
  }

  // 토큰 발급 실패 시 에러 (fallback 제거)
  throw new Error(
    "Failed to fetch Keycloak token. Check AUTH_* environment variables.",
  );
}

function createTestSession(session: Session, token: JWT): Session {
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
    async authorize() {
      // Keycloak에서 실제 토큰을 발급받아 사용자 정보 추출
      const keycloakToken = await fetchKeycloakTokenWithPassword();

      if (!keycloakToken) {
        console.error(
          "Failed to fetch Keycloak token. Check AUTH_* environment variables.",
        );
        return null;
      }

      const user = parseUserFromAccessToken(keycloakToken.access_token);

      if (!user) {
        console.error("Failed to parse user from Keycloak token");
        return null;
      }

      return user;
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
    // 최초 로그인 또는 토큰이 없는 경우 Keycloak에서 토큰 발급
    if (user || !token.access_token) {
      return await createTestToken(token);
    }
    return token;
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
