import { useMutation } from "@tanstack/react-query";
import { isString } from "es-toolkit/predicate";

type VerifyPasswordResult = {
  success: boolean;
  error?: string;
};

type VerifyPasswordErrorResponse = {
  error?: string;
  code?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseVerifyPasswordErrorResponse(
  value: unknown,
): VerifyPasswordErrorResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  const error = isString(value.error) ? value.error : undefined;
  const code = isString(value.code) ? value.code : undefined;

  if (!error && !code) {
    return null;
  }

  return { error, code };
}

async function verifyPassword(password: string): Promise<VerifyPasswordResult> {
  const response = await fetch("/internal/verify-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (response.ok) {
    return { success: true };
  }

  // 에러 응답 파싱
  let data: VerifyPasswordErrorResponse | null = null;
  let fallbackMessage = "알 수 없는 오류가 발생했습니다.";
  const responseText = await response.text();

  try {
    data = parseVerifyPasswordErrorResponse(JSON.parse(responseText));
  } catch {
    if (responseText.trim()) {
      fallbackMessage = responseText;
    }
  }

  // 403: 비밀번호 불일치 → 인라인 에러로 처리 (throw X)
  if (response.status === 403 || data?.code === "PASSWORD_MISMATCH") {
    return { success: false, error: "비밀번호가 일치하지 않습니다." };
  }

  // 401 또는 기타 에러 → throw해서 토스트로 처리
  throw new Error(data?.error ?? fallbackMessage);
}

export function useVerifyPassword() {
  return useMutation<VerifyPasswordResult, Error, string>({
    mutationFn: verifyPassword,
  });
}
