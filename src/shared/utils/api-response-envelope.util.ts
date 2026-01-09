import { isPlainObject } from "es-toolkit";
import { isNumber } from "es-toolkit/compat";
import { isString } from "es-toolkit/predicate";

import type {
  BaseResponse,
  BaseResponseStatus,
} from "@/shared/types/api-response.type";

const VALID_STATUS_MAP = {
  SUCCESS: true,
  FAIL: true,
  ERROR: true,
} as const satisfies Record<BaseResponseStatus, true>;

function isBaseResponseStatus(value: unknown): value is BaseResponseStatus {
  return isString(value) && value in VALID_STATUS_MAP;
}

export function isEnvelopeResponse(value: unknown): value is BaseResponse {
  if (!isPlainObject(value)) return false;

  const { status, timestamp } = value;

  return (
    isBaseResponseStatus(status) &&
    isNumber(timestamp) &&
    Number.isFinite(timestamp)
  );
}
