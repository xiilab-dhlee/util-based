import type { REVOKE_HISTORY_DETAIL_TYPE } from "@/domain/revoke/constants/revoke-history.constant";
import type {
  RevokeHistoryDetailItemType,
  RevokeHistoryDetailResponseType,
} from "@/domain/revoke/schemas/revoke-history.schema";
import type { CorePaginate, CorePayload } from "@/shared/types/api.interface";
import type { CoreListResponse } from "@/shared/types/core.model";

/**
 * 리소스 회수 이력 목록 조회 Payload
 */
export interface GetRevokeHistoriesPayload extends CorePayload, CorePaginate {
  /** 시작일 */
  startDate?: string;
  /** 종료일 */
  endDate?: string;
}

/**
 * 리소스 회수 상세 타입 (상수에서 추출)
 */
export type RevokeHistoryDetailType =
  (typeof REVOKE_HISTORY_DETAIL_TYPE)[keyof typeof REVOKE_HISTORY_DETAIL_TYPE];

/**
 * 리소스 회수 상세 목록 조회 Payload
 */
export interface GetRevokeHistoryDetailPayload
  extends CorePayload,
    Partial<CorePaginate> {
  /** 시작일 */
  startDate?: string;
  /** 종료일 */
  endDate?: string;
  /** 구분 (WARNING/REVOKED) */
  type?: RevokeHistoryDetailType;
}

/**
 * 리소스 회수 이력 상세 + 경고/회수 목록 응답 타입
 *
 * - 좌측 사이드바에서 사용하는 상세 정보(`detail`)
 * - 우측 테이블/페이지네이션에서 사용하는 경고/회수 목록(`content`, `totalSize` 등)
 * 을 한 번에 포함합니다.
 */
export type RevokeHistoryDetailListResponse =
  CoreListResponse<RevokeHistoryDetailItemType> & {
    /** 상세 정보 (사이드바용) */
    detail: RevokeHistoryDetailResponseType;
  };
