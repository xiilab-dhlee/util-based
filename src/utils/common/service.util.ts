import { isEmpty } from "lodash";

import { Core } from "@/models/core.model";
import type { CorePayload } from "@/types/common/api.interface";

/**
 * payload 객체의 모든 키값을 URLSearchParams로 변환하는 유틸리티 함수
 * @param payload - 변환할 payload 객체
 * @returns URLSearchParams 객체
 */
export function payloadToParams(payload: CorePayload): URLSearchParams {
  const params = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    // ALL 값은 제외
    if (!isEmpty(value) && value !== Core.ALL_VALUE) {
      params.append(key, encodeURIComponent(String(value)));
    }
  });

  return params;
}
