import type { QueryKey } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { getAllErrorConfigs } from "@/constants/error";
import type { ErrorConfig } from "@/shared/types/error";

/**
 * 쿼리 키를 문자열로 변환 (방어적 처리 포함)
 * ['workloads', 'list'] -> 'workloads.list'
 * [123, {id: 1}] -> '123.{"id":1}'
 * [null, undefined] -> 'null.undefined'
 */
const getQueryKeyString = (queryKey: QueryKey): string => {
  if (!Array.isArray(queryKey) || queryKey.length === 0) {
    return "default";
  }

  // 첫 두 요소만 사용하여 domain.action 패턴 생성
  const normalizedKeys = queryKey
    .slice(0, 2)
    .map((element) => {
      // null 명시적 처리
      if (element === null) {
        return "null";
      }

      // undefined 처리
      if (element === undefined) {
        return "undefined";
      }

      // 원시 타입 (string, number, boolean)
      if (
        typeof element === "string" ||
        typeof element === "number" ||
        typeof element === "boolean"
      ) {
        return String(element);
      }

      // 객체 타입 (배열 포함)
      try {
        return JSON.stringify(element);
      } catch {
        // JSON.stringify 실패 시 문자열로 변환
        return String(element);
      }
    })
    .map((str) => str.replace(/\./g, "_")) // 점을 언더스코어로 대체
    .filter((str) => str.length > 0); // 빈 문자열 제거

  // 결과가 비어있으면 기본값 반환
  const result = normalizedKeys.join(".");
  return result.length > 0 ? result : "default";
};

/**
 * 쿼리 키 기반으로 에러 설정 조회
 */
export const getQueryErrorConfig = (queryKey: QueryKey): ErrorConfig => {
  const keyString = getQueryKeyString(queryKey);
  const allErrorConfigs = getAllErrorConfigs();
  return allErrorConfigs[keyString] || allErrorConfigs.default;
};

/**
 * 에러 메시지 가져오기 (방어적 검증 포함)
 */
export const getErrorMessage = (
  queryKey: QueryKey,
  error: AxiosError,
): string => {
  // 1. getQueryErrorConfig 결과를 안전한 기본값으로 폴백
  let config: ErrorConfig;
  try {
    config = getQueryErrorConfig(queryKey);
    // config가 null이거나 undefined인 경우 기본값 사용
    if (!config || typeof config !== "object") {
      config = {
        showToast: true,
        errorMessage: "요청 처리 중 오류가 발생했습니다.",
        statusMessages: {},
      };
    }
  } catch {
    // getQueryErrorConfig 호출 실패 시 기본값 사용
    config = {
      showToast: true,
      errorMessage: "요청 처리 중 오류가 발생했습니다.",
      statusMessages: {},
    };
  }

  // 2. statusCode 안전한 추출 (옵셔널 체이닝과 타입 강제 변환)
  const statusCode = Number(error?.response?.status ?? error?.status) || 0;

  // 3. statusMessages 객체 검증 후 안전한 인덱싱
  if (
    config.statusMessages &&
    typeof config.statusMessages === "object" &&
    config.statusMessages !== null
  ) {
    // statusCode로 직접 조회 (Record<number, string> 타입에 맞춰)
    const statusMessage = config.statusMessages[statusCode];

    // 상태별 메시지가 존재하고 문자열인 경우에만 반환
    if (statusMessage && typeof statusMessage === "string") {
      return statusMessage;
    }
  }

  // 4. config.errorMessage에 대한 합리적인 폴백
  const fallbackMessage = "요청 처리 중 오류가 발생했습니다.";

  if (config.errorMessage && typeof config.errorMessage === "string") {
    return config.errorMessage;
  }

  return fallbackMessage;
};

/**
 * 토스트 표시 여부 확인
 */
export const shouldShowToast = (queryKey: QueryKey): boolean => {
  const config = getQueryErrorConfig(queryKey);
  return config.showToast;
};

/**
 * 개발 모드에서 디버깅 정보 출력
 */
export const logErrorInfo = (queryKey: QueryKey, error: AxiosError): void => {
  if (process.env.NODE_ENV === "development") {
    const keyString = getQueryKeyString(queryKey);
    const config = getQueryErrorConfig(queryKey);

    console.group(`🚨 Query Error: ${keyString}`);
    console.log("Query Key:", queryKey);
    console.log("Error:", error);
    console.log("Config:", config);
    console.log("Message:", getErrorMessage(queryKey, error));
    console.groupEnd();
  }
};
