import {
  type NextMiddleware,
  type NextRequest,
  NextResponse,
} from "next/server";
import { encode, getToken, type JWT } from "next-auth/jwt";

import type { MiddlewareFactory } from "./types";

export const SESSION_TIMEOUT = 60 * 60 * 24 * 30;
export const SESSION_COOKIE = "next-auth.session-token";
export const SESSION_SECURE = process.env.NODE_ENV === "production";

/**
 * 토큰 갱신이 필요한지 확인합니다.
 * @param token
 * @returns
 */
const shouldUpdateToken = (token: JWT | null): boolean => {
  if (!token) return false;

  // 토큰이 만료되었거나 곧 만료될 예정인지 확인
  const currentTime = Date.now();
  const tokenExpiry = token.accessTokenExpired || 0;
  const refreshTokenExpiry = token.refreshTokenExpired || 0;

  // 액세스 토큰이 만료되었거나 5분 이내에 만료될 예정
  const isAccessTokenExpired = currentTime >= tokenExpiry;
  const isAccessTokenExpiringSoon = currentTime >= tokenExpiry - 5 * 60 * 1000;

  // 리프레시 토큰이 아직 유효한지 확인
  const isRefreshTokenValid = currentTime < refreshTokenExpiry;

  return (
    (isAccessTokenExpired || isAccessTokenExpiringSoon) && isRefreshTokenValid
  );
};

export function updateCookie(
  sessionToken: string | null,
  request: NextRequest,
  response: NextResponse,
): NextResponse<unknown> {
  /*
   * BASIC IDEA:
   *
   * 1. Set request cookies for the incoming getServerSession to read new session
   * 2. Updated request cookie can only be passed to server if it's passed down here after setting its updates
   * 3. Set response cookies to send back to browser
   */

  if (sessionToken) {
    // Set the session token in the request and response cookies for a valid session
    request.cookies.set(SESSION_COOKIE, sessionToken);
    response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      maxAge: SESSION_TIMEOUT,
      secure: SESSION_SECURE,
      sameSite: "lax",
    });
  } else {
    request.cookies.delete(SESSION_COOKIE);
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return response;
}

export const cookieMiddlewares: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, event: any) => {
    const token = (await getToken({ req: request })) as JWT;

    let response = NextResponse.next();

    if (shouldUpdateToken(token)) {
      try {
        console.log("Refreshing token in middleware...");
        const newSessionToken = await encode({
          secret: process.env.NEXTAUTH_SECRET!,
          token: token,
          maxAge: SESSION_TIMEOUT,
        });
        response = updateCookie(newSessionToken, request, response);
      } catch (error) {
        console.log("Error refreshing token: ", error);
        return updateCookie(null, request, response);
      }
    }

    return next(request, event);
  };
};
