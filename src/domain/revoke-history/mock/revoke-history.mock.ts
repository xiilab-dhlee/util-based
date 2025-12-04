import { REVOKE_HISTORY_DETAIL_TYPE } from "@/domain/revoke-history/constants/revoke-history.constant";
import {
  type RevokeCriteriaItemType,
  type RevokeHistoryDetailItemType,
  type RevokeHistoryDetailResponseType,
  type RevokeHistoryItemResponseType,
  revokeCriteriaItemSchema,
  revokeHistoryDetailItemSchema,
  revokeHistoryDetailResponseSchema,
  revokeHistoryItemResponseSchema,
} from "@/domain/revoke-history/schemas/revoke-history.schema";
import { makeMock } from "@/shared/utils/mock.util";

/**
 * 리소스 회수 이력 Mock 데이터
 *
 * - Zod 스키마(`revokeHistoryItemResponseSchema`)를 기반으로 생성합니다.
 * - 실제 목록 API는 `CoreListResponse<RevokeHistoryItemResponseType>` 구조이지만,
 *   UI 컴포넌트에서는 개별 아이템 배열만 필요하므로 아이템 배열만 생성합니다.
 */
export const REVOKE_HISTORY_MOCK_LIST_LENGTH = 20;
export const REVOKE_HISTORY_MOCK_TOTAL_COUNT = 71;

export const REVOKE_HISTORY_MOCK_DATA: RevokeHistoryItemResponseType[] =
  Array.from({ length: REVOKE_HISTORY_MOCK_LIST_LENGTH }, (_, index) => {
    const base = makeMock(
      revokeHistoryItemResponseSchema,
    ) as RevokeHistoryItemResponseType;

    return {
      ...base,
      // 인덱스를 활용해 ID는 고정된 순차 값으로 설정해 재현성을 높입니다.
      id: String(index + 1),
    };
  });

/** Mock 데이터 총 개수 (페이지네이션 테스트용) */
export const REVOKE_HISTORY_MOCK_TOTAL = REVOKE_HISTORY_MOCK_TOTAL_COUNT;

/**
 * 리소스 회수 이력 상세 정보 Mock 데이터 (사이드바용)
 */
export const REVOKE_HISTORY_DETAIL_MOCK_DATA: RevokeHistoryDetailResponseType =
  makeMock(
    revokeHistoryDetailResponseSchema,
  ) as RevokeHistoryDetailResponseType;

/**
 * 리소스 회수 기준 Mock 데이터
 *
 * - Zod 스키마(`revokeCriteriaItemSchema`)를 기반으로 생성합니다.
 * - jobType은 INTERACTIVE, BATCH만 사용합니다.
 */
const JOB_TYPES = ["INTERACTIVE", "BATCH"] as const;

export const REVOKE_CRITERIA_MOCK: RevokeCriteriaItemType[] = JOB_TYPES.map(
  (jobType) => {
    const base = makeMock(revokeCriteriaItemSchema) as RevokeCriteriaItemType;

    return {
      ...base,
      jobType,
    };
  },
);

/**
 * 경고/회수 목록 Mock 데이터
 *
 * - Zod 스키마(`revokeHistoryDetailItemSchema`)를 기반으로 생성합니다.
 * - type은 상수(`REVOKE_HISTORY_DETAIL_TYPE`)를 사용합니다.
 */
const DETAIL_TYPES = [
  REVOKE_HISTORY_DETAIL_TYPE.WARNING,
  REVOKE_HISTORY_DETAIL_TYPE.REVOKED,
] as const;

export const REVOKE_HISTORY_DETAIL_ITEM_MOCK_LIST_LENGTH = 30;
export const REVOKE_HISTORY_DETAIL_ITEM_MOCK_TOTAL_COUNT = 85;

export const REVOKE_HISTORY_DETAIL_ITEM_MOCK_DATA: RevokeHistoryDetailItemType[] =
  Array.from(
    { length: REVOKE_HISTORY_DETAIL_ITEM_MOCK_LIST_LENGTH },
    (_, index) => {
      const base = makeMock(
        revokeHistoryDetailItemSchema,
      ) as RevokeHistoryDetailItemType;

      return {
        ...base,
        workloadId: String(index + 1),
        type: DETAIL_TYPES[index % DETAIL_TYPES.length],
      };
    },
  );

/** 경고/회수 목록 Mock 데이터 총 개수 (페이지네이션 테스트용) */
export const REVOKE_HISTORY_DETAIL_ITEM_MOCK_TOTAL =
  REVOKE_HISTORY_DETAIL_ITEM_MOCK_TOTAL_COUNT;
