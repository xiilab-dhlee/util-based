import fs from "fs";
import http from "http";
import https from "https";
import axios, { isAxiosError } from "axios";
import { format } from "date-fns";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import KeycloakProvider, { type TOKEN } from "next-auth/providers/keycloak";

/**
 * 토큰을 파싱하여 권한을 추출합니다.
 * @param token
 * @returns
 */
const getRole = (token?: string): string[] => {
  if (!token) return [];

  try {
    const keylist = token.split(".");
    if (keylist.length < 2) return [];

    // Handle URL-safe base64 if needed
    let base64 = keylist[1];
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "=";
    }

    const decodedJwtJsonData = Buffer.from(base64, "base64").toString("utf8");
    const json = JSON.parse(decodedJwtJsonData);

    // Validate structure exists
    if (json && json.realm_access && Array.isArray(json.realm_access.roles)) {
      return json.realm_access.roles;
    }

    return [];
  } catch (error) {
    console.error("JWT 파싱 오류:", error);
    return [];
  }
};

const getUsername = (token?: string): string => {
  if (!token) return "";

  try {
    const keylist = token.split(".");
    if (keylist.length < 2) return "";

    // Handle URL-safe base64 and normalize padding
    let base64 = keylist[1];
    while (base64.length % 4) {
      base64 += "=";
    }

    const decodedJwtJsonData = Buffer.from(base64, "base64").toString("utf8");
    const json = JSON.parse(decodedJwtJsonData);

    // Validate that preferred_username exists and is a string
    if (json && typeof json.preferred_username === "string") {
      return json.preferred_username;
    }

    return "";
  } catch (error) {
    console.error("JWT 사용자명 파싱 오류:", error);
    return "";
  }
};

/**
 * 토큰을 가져와서 업데이트된 새 토큰을 반환합니다
 */
const refreshAccessToken = async (refreshToken: string): Promise<TOKEN> => {
  if (!process.env.AUTH_ISSUER) {
    console.error("AUTH_ISSUER 환경변수가 설정되지 않았습니다.");
    throw new Error("AUTH_ISSUER 환경변수가 설정되지 않았습니다.");
  }

  if (!process.env.AUTH_CLIENT_ID) {
    console.error("AUTH_CLIENT_ID 환경변수가 설정되지 않았습니다.");
    throw new Error("AUTH_CLIENT_ID 환경변수가 설정되지 않았습니다.");
  }

  if (!process.env.AUTH_CLIENT_SECRET) {
    console.error("AUTH_CLIENT_SECRET 환경변수가 설정되지 않았습니다.");
    throw new Error("AUTH_CLIENT_SECRET 환경변수가 설정되지 않았습니다.");
  }

  const url = `${process.env.AUTH_ISSUER}/protocol/openid-connect/token`;
  const params = new URLSearchParams();
  params.append("grant_type", "refresh_token");
  params.append("client_id", process.env.AUTH_CLIENT_ID);
  params.append("client_secret", process.env.AUTH_CLIENT_SECRET);
  params.append("refresh_token", refreshToken);

  // Use explicit SSL verification flag, defaulting to true for security
  const sslVerify = process.env.AUTH_REJECT_UNAUTHORIZED !== "false";

  // Load CA certificate if provided
  const caCert = process.env.CA_CERT
    ? fs.readFileSync(process.env.CA_CERT)
    : undefined;

  const httpsAgentOptions = {
    rejectUnauthorized: sslVerify,
    ...(caCert && { ca: caCert }),
  };

  try {
    const { data } = await axios.post<TOKEN>(url, params, {
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      httpAgent: new http.Agent(),
      httpsAgent: new https.Agent(httpsAgentOptions),
    });

    return data;
  } catch (error: any) {
    if (isAxiosError(error) && error.response) {
      console.table(error.response.data);
    }
    throw error;
  }
};

/**
 * 토큰이 유효한지 체크하는 메서드
 */
const isAccessTokenValid = (token: JWT) => {
  return (
    token.accessTokenExpired &&
    typeof token.accessTokenExpired === "number" &&
    Date.now() < token.accessTokenExpired
  );
};

const updateToken = async (token: JWT): Promise<JWT> => {
  const res: TOKEN = await refreshAccessToken(token.refresh_token as string);
  const timeInSeconds = Math.floor(Date.now() / 1000);

  token.access_token = res.access_token;
  token.expires_at = res.expires_in + timeInSeconds;
  token.refresh_token = res.refresh_token;
  token.refreshTokenExpired =
    Date.now() + ((res.refresh_expires_in! as number) - 15) * 1000;

  token.accessTokenExpired = Date.now() + (res.expires_in! - 5) * 1000;
  console.debug("토큰 재발급 완료");
  return token;
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 1,
  },
  providers: [
    KeycloakProvider({
      clientId: (() => {
        if (!process.env.AUTH_CLIENT_ID) {
          console.error("AUTH_CLIENT_ID 환경변수가 설정되지 않았습니다.");
          throw new Error("AUTH_CLIENT_ID 환경변수가 설정되지 않았습니다.");
        }
        return process.env.AUTH_CLIENT_ID;
      })(),
      clientSecret: (() => {
        if (!process.env.AUTH_CLIENT_SECRET) {
          console.error("AUTH_CLIENT_SECRET 환경변수가 설정되지 않았습니다.");
          throw new Error("AUTH_CLIENT_SECRET 환경변수가 설정되지 않았습니다.");
        }
        return process.env.AUTH_CLIENT_SECRET;
      })(),
      issuer: (() => {
        if (!process.env.AUTH_ISSUER) {
          console.error("AUTH_ISSUER 환경변수가 설정되지 않았습니다.");
          throw new Error("AUTH_ISSUER 환경변수가 설정되지 않았습니다.");
        }
        return process.env.AUTH_ISSUER;
      })(),
      httpOptions: {
        timeout: 40000,
      },
    }),
  ],

  pages: {
    signIn: "/signin",
  },

  events: {
    async signOut({ token }) {
      if (!process.env.AUTH_ISSUER) {
        console.error("AUTH_ISSUER 환경변수가 설정되지 않았습니다.");
        return;
      }

      if (!process.env.AUTH_CLIENT_ID) {
        console.error("AUTH_CLIENT_ID 환경변수가 설정되지 않았습니다.");
        return;
      }

      if (!process.env.AUTH_CLIENT_SECRET) {
        console.error("AUTH_CLIENT_SECRET 환경변수가 설정되지 않았습니다.");
        return;
      }

      const url = `${process.env.AUTH_ISSUER}/protocol/openid-connect/logout`;

      const body = new URLSearchParams();
      body.append("client_id", process.env.AUTH_CLIENT_ID);
      body.append("refresh_token", token.refresh_token as string);
      body.append("client_secret", process.env.AUTH_CLIENT_SECRET);

      // Extract access_token and validate it exists
      const accessToken = token.access_token;
      if (!accessToken) {
        console.error("로그아웃 실패: access_token이 없습니다");
        return;
      }

      await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
        },
      });
    },
  },

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.accessToken = token.access_token as string;
      session.refresh_token = token.refresh_token as string;
      session.error = token.error as string;
      session.expires = token.expires_at ? token.expires_at.toString() : "";

      const roles = getRole(token.access_token);
      const username = getUsername(token.access_token);

      session.roles = roles;
      session.user.preferred_username = username;
      return session;
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
      }

      if (trigger === "update" && session) {
        token.name = session.name;
      }

      if (account !== undefined && account !== null) {
        const expires_at = account.expires_at;
        token.access_token = account.access_token;
        token.expires_at = expires_at!;
        token.refresh_token = account.refresh_token;
        token.refreshTokenExpired =
          Date.now() + ((account.refresh_expires_in! as number) - 15) * 1000;

        token.accessTokenExpired = account.expires_at! * 1000;
      }

      console.debug(
        ` JWT 남은 시간 ${format(
          new Date(token.accessTokenExpired || 0),
          "yyyy-MM-dd HH:mm:ss",
        )}`,
      );
      console.debug(
        ` JWT refresh token 남은 시간 ${format(
          new Date(token.refreshTokenExpired || 0),
          "yyyy-MM-dd HH:mm:ss",
        )}`,
      );

      if (isAccessTokenValid(token)) {
        console.debug("현재 토큰 유효함");
        return token;
      } else {
        console.debug("토큰 만료 토큰 재발급 실시");
        try {
          return updateToken(token);
        } catch {
          console.debug("리프레시 토큰 만료 로그아웃");
          throw token;
        }
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
