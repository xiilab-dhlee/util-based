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
type VerifyPasswordPhase = "start" | "validate" | "success" | "error";

function jsonWithTrace(
  body: Record<string, unknown>,
  init: ResponseInit | undefined,
  phase: VerifyPasswordPhase,
) {
  const headers = new Headers(init?.headers);
  headers.set("x-verify-password-route", "hit");
  headers.set("x-verify-password-phase", phase);

  return NextResponse.json(body, {
    ...(init ?? {}),
    headers,
  });
}

async function parseBackendErrorBody(response: Response) {
  try {
    const text = await response.text();
    if (!text) {
      return undefined;
    }
    try {
      return JSON.parse(text) as unknown;
    } catch {
      return text;
    }
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  // 1. 현재 로그인된 사용자 세션 확인
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return jsonWithTrace(
      { valid: false, error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401 },
      "error",
    );
  }

  // 2. 요청에서 비밀번호 추출
  let password: string;
  try {
    const body = await request.json();
    if (!isString(body.password) || body.password.trim().length === 0) {
      return jsonWithTrace(
        { valid: false, error: "Password required" },
        { status: 400 },
        "error",
      );
    }
    password = body.password;
  } catch {
    return jsonWithTrace(
      { valid: false, error: "Invalid request body" },
      { status: 400 },
      "error",
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
      return jsonWithTrace({ valid: true }, { status: 200 }, "success");
    }

    const backendError = await parseBackendErrorBody(response);

    // Client/auth errors (400, 401, 403) - password mismatch or authentication issues
    if (
      response.status === 400 ||
      response.status === 401 ||
      response.status === 403
    ) {
      return jsonWithTrace(
        {
          valid: false,
          error: "Password mismatch",
          code: "PASSWORD_MISMATCH",
          backendError,
        },
        { status: response.status },
        "validate",
      );
    }

    // Server errors (5xx) or unexpected status codes
    return jsonWithTrace(
      {
        valid: false,
        error: "Backend server error",
        code: "BACKEND_ERROR",
        backendError,
      },
      { status: response.status >= 500 ? 502 : 500 },
      "error",
    );
  } catch {
    return jsonWithTrace(
      { valid: false, error: "Server error" },
      { status: 500 },
      "error",
    );
  }
}
