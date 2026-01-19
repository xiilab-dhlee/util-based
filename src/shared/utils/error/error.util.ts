import { isAxiosError } from "axios";
import { isString } from "es-toolkit/predicate";

import { BackendError } from "@/shared/types/error.type";
import { isEnvelopeResponse } from "@/shared/utils/api-response-envelope.util";

const DEFAULT_ERROR_MESSAGES: Record<number, string> = {
  401: "로그인이 필요합니다.",
  403: "접근 권한이 없습니다.",
  404: "요청한 데이터를 찾을 수 없습니다.",
  500: "서버에 문제가 발생했습니다.",
  0: "네트워크 연결을 확인해주세요.",
};

/**
 * 에러에서 백엔드 메시지 추출
 * BackendError, AxiosError, 일반 Error 모두 처리
 */
export const getBackendErrorMessage = (
  error: unknown,
  fallback = "요청 처리 중 오류가 발생했습니다.",
): string => {
  // 1) 백엔드 비즈니스 에러(HTTP 200이지만 FAIL/ERROR)
  if (error instanceof BackendError) {
    return error.message;
  }

  // 2) AxiosError
  if (isAxiosError(error)) {
    const responseData = error.response?.data;

    // 2-1) 백엔드 엔벨로프 메시지 우선
    if (isEnvelopeResponse(responseData) && isString(responseData.message)) {
      return responseData.message;
    }

    // 2-2) HTTP 상태코드 기본 메시지
    const statusCode = error.response?.status ?? 0;
    const defaultMessage = DEFAULT_ERROR_MESSAGES[statusCode];
    if (defaultMessage) return defaultMessage;

    // 2-3) axios 에러 메시지(네트워크/기타)
    if (error.message) return error.message;
    return fallback;
  }

  // 3) 일반 Error
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};
