import type { RequestResourceStatusType } from "../schemas/request-resource.schema";

/** 리소스 요청 쿼리 키 */
export const REQUEST_RESOURCE_QUERY_KEY = "request-resource";

/** 리소스 요청 상태 타입 (re-export for convenience) */
export type RequestResourceStatus = RequestResourceStatusType;

/** 리소스 요청 상태 상수 맵 */
export const REQUEST_RESOURCE_STATUS: Record<
  "WAITING" | "APPROVE" | "REJECT",
  RequestResourceStatus
> = {
  WAITING: "WAITING",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
} as const;

/** 리소스 요청 상태 필터 옵션 */
export const REQUEST_RESOURCE_STATUS_OPTIONS = [
  { label: "대기", value: REQUEST_RESOURCE_STATUS.WAITING },
  { label: "승인", value: REQUEST_RESOURCE_STATUS.APPROVE },
  { label: "반려", value: REQUEST_RESOURCE_STATUS.REJECT },
] as const satisfies readonly { label: string; value: RequestResourceStatus }[];
