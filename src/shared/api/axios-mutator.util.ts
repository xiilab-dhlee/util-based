import type { AxiosRequestConfig } from "axios";
import { isNil, isPlainObject } from "es-toolkit";

import type { BaseResponse } from "@/shared/types/api-response.type";

export interface SerializeParamsOptions {
  /**
   * 배열 직렬화 형식
   * - "comma": ids=1,2,3 (기본값)
   * - "repeat": ids=1&ids=2&ids=3
   */
  arrayFormat?: "comma" | "repeat";
}

/**
 * 파라미터를 쿼리 스트링으로 직렬화
 *
 * 1. 중첩 객체 평탄화 (wrapper key 제거)
 * 2. 배열 직렬화 (옵션에 따라 comma 또는 repeat 형식)
 * 3. 빈 값 제거 (undefined, null, '')
 *
 * 참고: 0, false 등 falsy 값은 정상적으로 직렬화됨
 */
export function serializeParams(
  params: Record<string, unknown>,
  options: SerializeParamsOptions = {},
): string {
  const { arrayFormat = "comma" } = options;
  const searchParams = new URLSearchParams();
  flattenAndAppend(params, searchParams, arrayFormat);
  return searchParams.toString();
}

function flattenAndAppend(
  obj: Record<string, unknown>,
  searchParams: URLSearchParams,
  arrayFormat: "comma" | "repeat",
): void {
  for (const [key, value] of Object.entries(obj)) {
    // undefined, null, 빈 문자열만 제외 (0, false는 유효한 값)
    if (isNil(value) || value === "") continue;

    if (isPlainObject(value)) {
      flattenAndAppend(
        value as Record<string, unknown>,
        searchParams,
        arrayFormat,
      );
      continue;
    }

    if (Array.isArray(value)) {
      appendArray(key, value, searchParams, arrayFormat);
      continue;
    }

    searchParams.append(key, String(value));
  }
}

function appendArray(
  key: string,
  value: unknown[],
  searchParams: URLSearchParams,
  arrayFormat: "comma" | "repeat",
): void {
  if (value.length === 0) return;

  // repeat: ids=1&ids=2&ids=3, comma: ids=1,2,3
  const values =
    arrayFormat === "repeat" ? value.map(String) : [value.join(",")];
  values.forEach((v) => {
    searchParams.append(key, v);
  });
}

/**
 * SUCCESS 응답에서 data 추출
 */
export function unwrapSuccess(
  body: BaseResponse,
  config: AxiosRequestConfig,
): unknown {
  if (!("data" in body)) return undefined;

  if (body.data === undefined) {
    throw new Error(
      `[API Error] SUCCESS 응답에 data가 누락되었습니다. (URL: ${config.url ?? "(unknown url)"})`,
    );
  }

  return body.data;
}
