import { isString } from "es-toolkit";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/shared/config/auth.config";

/**
 * 비밀번호 검증 API
 *
 * 현재 로그인된 사용자의 비밀번호가 맞는지 확인합니다.
 * Keycloak 토큰 발급 API를 통해 검증합니다.
 */
export async function POST(request: Request) {
  // 1. 현재 로그인된 사용자 세션 확인
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { valid: false, error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  // 2. 요청에서 비밀번호 추출
  let password: string;
  try {
    const body = await request.json();
    if (!isString(body.password) || body.password.trim().length === 0) {
      return NextResponse.json(
        { valid: false, error: "Password required" },
        { status: 400 },
      );
    }
    password = body.password;
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid request body" },
      { status: 400 },
    );
  }

  // 3. 백엔드 토큰 API 호출로 비밀번호 검증
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/tokens`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: session.user.email,
          password: password,
          clientSecret: process.env.AUTH_CLIENT_SECRET,
        }),
      },
    );

    if (response.ok) {
      return NextResponse.json({ valid: true });
    }

    // Client/auth errors (400, 401, 403) - password mismatch or authentication issues
    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 403
    ) {
      return NextResponse.json(
        {
          valid: false,
          error: "Password mismatch",
          code: "PASSWORD_MISMATCH",
        },
        { status: response.status },
      );
    }

    // Server errors (5xx) or unexpected status codes
    return NextResponse.json(
      {
        valid: false,
        error: "Backend server error",
        code: "BACKEND_ERROR",
      },
      { status: response.status >= 500 ? 502 : 500 },
    );
  } catch {
    return NextResponse.json(
      { valid: false, error: "Server error" },
      { status: 500 },
    );
  }
}
