import { isEmpty } from "es-toolkit/compat";

import { ALL_OPTION } from "@/shared/constants/core.constant";
import type { CorePayload } from "@/shared/types/api.interface";

/**
 * payload 객체의 모든 키값을 URLSearchParams로 변환하는 유틸리티 함수
 * @param payload - 변환할 payload 객체 (없으면 빈 Params 반환)
 * @returns URLSearchParams 객체
 */
export function payloadToParams(payload?: CorePayload): URLSearchParams {
  const params = new URLSearchParams();

  if (!payload) {
    return params;
  }

  Object.entries(payload).forEach(([key, value]) => {
    // ALL 값은 제외
    if (!isEmpty(value) && value !== ALL_OPTION.value) {
      params.append(key, String(value));
    }
  });

  return params;
}

type ParamType = "string" | "number" | "boolean";

/**
 * URLSearchParams에서 override 객체를 생성하는 헬퍼 함수 (MSW handler용)
 * null이 아닌 값만 override 객체에 포함됨
 *
 * @example
 * // 특정 키만 추출
 * const override = paramsToOverride<ActiveWorkloadListType>(url.searchParams, ['jobType', 'status']);
 * // { jobType: 'INTERACTIVE', status: 'RUNNING' } (값이 있는 것만 포함)
 *
 * @example
 * // 모든 파라미터 추출 (keys 생략)
 * const override = paramsToOverride(url.searchParams);
 * // searchParams의 모든 키-값 쌍이 포함됨
 */
export function paramsToOverride<T extends Record<string, unknown>>(
  searchParams: URLSearchParams,
  keys?: (keyof T)[],
  typeMap?: Partial<Record<keyof T, ParamType>>,
): Partial<T> | undefined {
  const override: Partial<T> = {};

  // keys가 전달되지 않은 경우 searchParams의 모든 키를 순회
  const keysToIterate =
    keys ?? (Array.from(searchParams.keys()) as (keyof T)[]);

  for (const key of keysToIterate) {
    const value = searchParams.get(key as string);
    if (value === null) continue;

    const type = typeMap?.[key] ?? "string";

    const decodedValue = decodeURIComponent(value);

    switch (type) {
      case "number":
        (override as Record<string, unknown>)[key as string] =
          Number(decodedValue);
        break;
      case "boolean":
        (override as Record<string, unknown>)[key as string] =
          decodedValue === "true";
        break;
      default:
        (override as Record<string, unknown>)[key as string] = decodedValue;
    }
  }

  return Object.keys(override).length > 0 ? override : undefined;
}
