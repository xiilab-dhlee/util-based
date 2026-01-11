import type { Account, NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import KeycloakProvider from "next-auth/providers/keycloak";

// ============================================================================
// 타입 정의
// ============================================================================

interface AuthUser {
  id: string;
  name: string;
  email: string;
  preferred_username: string;
  roles: string[];
}

interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

interface DecodedJwtPayload {
  sub: string;
  name?: string;
  email?: string;
  preferred_username?: string;
  realm_access?: { roles: string[] };
}

interface CachedToken {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: AuthUser;
}

// ============================================================================
// 환경 설정
// ============================================================================

/** 테스트 환경 여부 (CredentialsProvider vs KeycloakProvider) */
const useTestAuth = process.env.TEST_AUTH_ENABLE === "true";

/** 개발 환경 여부 */
const isDev = process.env.NODE_ENV === "development";

/** 토큰 만료 전 갱신 버퍼 (초) */
const TOKEN_EXPIRY_BUFFER_SECONDS = 30;

/** 프로덕션 환경 여부 */
const isProduction = process.env.NODE_ENV === "production";

/**
 * NextAuth 시크릿 키
 * - 프로덕션: NEXTAUTH_SECRET 필수 (없으면 에러)
 * - 개발: fallback 허용
 */
function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret && isProduction) {
    throw new Error(
      "[Auth] NEXTAUTH_SECRET 환경변수가 프로덕션 환경에서 필수입니다.",
    );
  }

  return secret ?? "dev-secret-key-for-development";
}

// ============================================================================
// 유틸리티 함수
// ============================================================================

/** 개발 환경 전용 디버깅 로그 */
function authDebug(message: string, data?: Record<string, unknown>): void {
  if (!isDev) return;
  const dataStr = data ? ` ${JSON.stringify(data)}` : "";
  console.debug(`[Auth]${dataStr} ${message}`);
}

/** URL-safe Base64 디코딩 */
function decodeBase64Safely(base64String: string): string {
  let normalized = base64String.replace(/-/g, "+").replace(/_/g, "/");
  while (normalized.length % 4) normalized += "=";
  return Buffer.from(normalized, "base64").toString("utf8");
}

/** Unix timestamp를 한국어 날짜 문자열로 변환 */
function formatExpiresAt(expiresAt: number | undefined): string {
  return expiresAt ? new Date(expiresAt * 1000).toLocaleString("ko-KR") : "N/A";
}

// ============================================================================
// JWT 파싱
// ============================================================================

/** JWT access_token에서 페이로드 추출 */
function parseJwtPayload(accessToken: string): DecodedJwtPayload | null {
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return null;
    return JSON.parse(decodeBase64Safely(parts[1]));
  } catch {
    return null;
  }
}

/** JWT access_token에서 사용자 정보 추출 */
function parseUserFromToken(accessToken: string): AuthUser | null {
  const payload = parseJwtPayload(accessToken);
  if (!payload) {
    console.error("[Auth] JWT 파싱 실패");
    return null;
  }

  return {
    id: payload.sub,
    name: payload.name ?? payload.preferred_username ?? "Unknown",
    email: payload.email ?? "",
    preferred_username: payload.preferred_username ?? payload.email ?? "",
    roles: payload.realm_access?.roles ?? [],
  };
}

/** JWT access_token에서 역할(roles) 추출 */
function parseRolesFromToken(accessToken: string | undefined): string[] {
  if (!accessToken) return [];
  return parseJwtPayload(accessToken)?.realm_access?.roles ?? [];
}

// ============================================================================
// 세션 생성 (공통)
// ============================================================================

/** JWT 토큰으로부터 세션 객체 생성 */
function createSession(session: Session, token: JWT): Session {
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
// 테스트 환경 토큰 관리
// ============================================================================

// 토큰 캐시 (서버 재시작 전까지 유지)
let cachedTestToken: CachedToken | null = null;

/** Backend API를 통해 테스트용 토큰 발급 (Password Grant) */
async function fetchTestToken(): Promise<KeycloakTokenResponse | null> {
  const {
    NEXT_PUBLIC_API_URL,
    AUTH_USERNAME,
    AUTH_PASSWORD,
    AUTH_CLIENT_SECRET,
  } = process.env;

  if (
    !NEXT_PUBLIC_API_URL ||
    !AUTH_USERNAME ||
    !AUTH_PASSWORD ||
    !AUTH_CLIENT_SECRET
  ) {
    console.warn("[Auth] 테스트 인증 환경변수 누락");
    return null;
  }

  try {
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/auth/tokens`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userName: AUTH_USERNAME,
        password: AUTH_PASSWORD,
        clientSecret: AUTH_CLIENT_SECRET,
      }),
    });

    if (!response.ok) {
      console.error("[Auth] 테스트 토큰 발급 실패:", response.status);
      return null;
    }

    const responseData = await response.json();
    const data = responseData.data ?? responseData;

    return {
      access_token: data.accessToken ?? data.access_token,
      refresh_token: data.refreshToken ?? data.refresh_token,
      expires_in: data.expiresIn ?? data.expires_in,
      refresh_expires_in:
        data.refreshExpiresIn ?? data.refresh_expires_in ?? data.expiresIn,
    };
  } catch (error) {
    console.error("[Auth] 테스트 토큰 발급 오류:", error);
    return null;
  }
}

/** 테스트 환경용 JWT 토큰 생성 */
async function createTestJwt(token: JWT): Promise<JWT> {
  // 캐시된 토큰이 유효하면 재사용
  const bufferMs = TOKEN_EXPIRY_BUFFER_SECONDS * 1000;
  if (
    cachedTestToken &&
    Date.now() < cachedTestToken.expires_at * 1000 - bufferMs
  ) {
    return {
      ...token,
      ...cachedTestToken.user,
      access_token: cachedTestToken.access_token,
      refresh_token: cachedTestToken.refresh_token,
      expires_at: cachedTestToken.expires_at,
    };
  }

  // 새 토큰 발급
  const keycloakToken = await fetchTestToken();
  if (!keycloakToken) {
    throw new Error("[Auth] 테스트 토큰 발급 실패");
  }

  const user = parseUserFromToken(keycloakToken.access_token);
  if (!user) {
    throw new Error("[Auth] 토큰에서 사용자 정보 파싱 실패");
  }

  const expires_at = Math.floor(Date.now() / 1000) + keycloakToken.expires_in;
  authDebug(
    `🎫 [테스트] 토큰 발급: ${user.name} (만료: ${formatExpiresAt(expires_at)})`,
  );

  cachedTestToken = {
    access_token: keycloakToken.access_token,
    refresh_token: keycloakToken.refresh_token,
    expires_at,
    user,
  };

  return { ...token, ...user, ...cachedTestToken };
}

// ============================================================================
// Keycloak 토큰 관리
// ============================================================================

/** Keycloak 토큰 갱신 */
async function refreshKeycloakToken(token: JWT): Promise<JWT> {
  const { AUTH_ISSUER, AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } = process.env;

  try {
    const response = await fetch(
      `${AUTH_ISSUER}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: AUTH_CLIENT_ID ?? "",
          client_secret: AUTH_CLIENT_SECRET ?? "",
          grant_type: "refresh_token",
          refresh_token: token.refresh_token as string,
        }),
      },
    );

    const data: KeycloakTokenResponse = await response.json();
    if (!response.ok) throw data;

    const newExpiresAt = Math.floor(Date.now() / 1000) + data.expires_in;
    authDebug(`✅ 토큰 갱신 완료 (만료: ${formatExpiresAt(newExpiresAt)})`);

    return {
      ...token,
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? token.refresh_token,
      expires_at: newExpiresAt,
    };
  } catch (error) {
    console.error("[Auth] 토큰 갱신 실패:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

/** Keycloak 초기 로그인 시 JWT 토큰 생성 */
function createKeycloakJwt(token: JWT, user: User, account: Account): JWT {
  const roles = parseRolesFromToken(account.access_token);
  const expiresAt = account.expires_at;

  authDebug(
    `🎫 토큰 발급: ${user.name ?? user.email} [${roles.join(", ")}] (만료: ${formatExpiresAt(expiresAt)})`,
  );

  return {
    ...token,
    id: user.id,
    name: user.name ?? undefined,
    email: user.email ?? undefined,
    preferred_username:
      (user as AuthUser).preferred_username ?? user.email ?? undefined,
    roles,
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expires_at: expiresAt,
  };
}

/** Keycloak 로그아웃 처리 */
async function handleKeycloakLogout(token: JWT): Promise<void> {
  const { AUTH_ISSUER, AUTH_CLIENT_ID, AUTH_CLIENT_SECRET } = process.env;

  if (!AUTH_ISSUER || !AUTH_CLIENT_ID || !AUTH_CLIENT_SECRET) {
    console.error("[Auth] 로그아웃 실패: 환경변수 누락");
    return;
  }

  if (!token.access_token) {
    console.error("[Auth] 로그아웃 실패: access_token 없음");
    return;
  }

  try {
    const response = await fetch(
      `${AUTH_ISSUER}/protocol/openid-connect/logout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: AUTH_CLIENT_ID,
          client_secret: AUTH_CLIENT_SECRET,
          refresh_token: token.refresh_token as string,
        }),
      },
    );

    if (!response.ok) {
      console.error("[Auth] Keycloak 로그아웃 실패:", response.status);
      return;
    }

    authDebug("✅ Keycloak 세션 종료 완료");
  } catch (error) {
    console.error("[Auth] Keycloak 로그아웃 실패:", error);
  }
}

// ============================================================================
// Provider 설정
// ============================================================================

const testProvider = CredentialsProvider({
  id: "credentials",
  name: "Test Credentials",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize() {
    const token = await fetchTestToken();
    if (!token) return null;
    return parseUserFromToken(token.access_token);
  },
});

const keycloakProvider = KeycloakProvider({
  clientId: process.env.AUTH_CLIENT_ID ?? "",
  clientSecret: process.env.AUTH_CLIENT_SECRET ?? "",
  issuer: process.env.AUTH_ISSUER ?? "",
  httpOptions: { timeout: 40000 },
});

// ============================================================================
// Callbacks 설정
// ============================================================================

const testCallbacks: NextAuthOptions["callbacks"] = {
  async signIn({ user }) {
    authDebug(`🔑 [테스트] 로그인: ${user?.email ?? user?.id}`);
    return true;
  },

  async jwt({ token, user }) {
    if (user || !token.access_token) {
      return createTestJwt(token);
    }
    return token;
  },

  async session({ session, token }) {
    return createSession(session, token);
  },
};

const keycloakCallbacks: NextAuthOptions["callbacks"] = {
  async signIn({ user, account }) {
    authDebug(`🔑 로그인: ${user?.email ?? user?.id} (${account?.provider})`);
    return true;
  },

  async redirect({ url, baseUrl }) {
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    if (new URL(url).origin === baseUrl) return url;
    return baseUrl;
  },

  async jwt({ token, user, account }) {
    // 최초 로그인
    if (account && user) {
      return createKeycloakJwt(token, user, account);
    }

    // 토큰 유효성 검사
    const expiresAt = token.expires_at as number;
    const isValid =
      Date.now() < (expiresAt - TOKEN_EXPIRY_BUFFER_SECONDS) * 1000;

    if (isValid) return token;

    // 토큰 갱신
    authDebug("⏰ 토큰 만료 → 갱신 시도");
    return refreshKeycloakToken(token);
  },

  async session({ session, token }) {
    if (token.error === "RefreshAccessTokenError") {
      authDebug("❌ 토큰 갱신 실패 → 재로그인 필요");
    }
    return createSession(session, token);
  },
};

// ============================================================================
// NextAuth 설정 (Export)
// ============================================================================

export const authOptions: NextAuthOptions = {
  providers: useTestAuth ? [testProvider] : [keycloakProvider],
  callbacks: useTestAuth ? testCallbacks : keycloakCallbacks,

  pages: {
    signIn: "/signin",
    error: "/error",
  },

  events: {
    async signIn({ user, isNewUser }) {
      authDebug(
        `✅ ${isNewUser ? "신규 가입" : "로그인"} 완료: ${user?.email ?? user?.id}`,
      );
    },
    async signOut({ token }) {
      authDebug(`🚪 로그아웃: ${token?.name ?? token?.id}`);
      await handleKeycloakLogout(token);
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7일
  },

  secret: getAuthSecret(),
  debug: false,
};

// ============================================================================
// 개발 환경 초기화 로그
// ============================================================================

if (isDev) {
  const providerName = useTestAuth
    ? "CredentialsProvider (테스트)"
    : "KeycloakProvider (프로덕션)";
  console.debug(`[Auth] 🔧 프로바이더: ${providerName}`);

  if (!useTestAuth) {
    console.debug("[Auth] 📋 환경변수:", {
      AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID ? "✅" : "❌",
      AUTH_CLIENT_SECRET: process.env.AUTH_CLIENT_SECRET ? "✅" : "❌",
      AUTH_ISSUER: process.env.AUTH_ISSUER ? "✅" : "❌",
    });
  }
}
