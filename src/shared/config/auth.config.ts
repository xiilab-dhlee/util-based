import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

// import KeycloakProvider from "next-auth/providers/keycloak";

import {
  DEFAULT_TEST_USER,
  TEST_USERS,
} from "@/shared/constants/auth.constant";

// ============================================================================
// 개발 환경 헬퍼
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

function createDevToken(token: JWT, user?: User): JWT {
  const devUser = getDevUserFromCredentials(user);
  return {
    ...token,
    ...devUser,
    access_token: "dev-test-access-token",
    refresh_token: "dev-test-refresh-token",
    expires_at: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
  };
}

function createDevSession(session: Session, token: JWT): Session {
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
// NextAuth 설정
// ============================================================================

export const authOptions: NextAuthOptions = {
  providers: [
    // KeycloakProvider({
    //   clientId: process.env.AUTH_CLIENT_ID ?? "",
    //   clientSecret: process.env.AUTH_CLIENT_SECRET ?? "",
    //   issuer: process.env.AUTH_ISSUER,
    // }),
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
  ],

  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      return user || !token.access_token ? createDevToken(token, user) : token;
    },

    async session({ session, token }): Promise<Session> {
      return createDevSession(session, token);
    },
  },

  pages: {
    signIn: "/signin",
    error: "/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
  secret: "dev",
  // secret: process.env.NEXTAUTH_SECRET ?? "dev-secret-key-for-development",
  debug: false,
};
