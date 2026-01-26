import type { WorkloadReclaimScanResultResponse } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import type { REVOKE_HISTORY_DETAIL_TYPE } from "@/domain/revoke/constants/revoke-history.constant";

/**
 * 리소스 회수 상세 타입 (상수에서 추출)
 */
export type RevokeHistoryDetailType =
  (typeof REVOKE_HISTORY_DETAIL_TYPE)[keyof typeof REVOKE_HISTORY_DETAIL_TYPE];

/**
 * 리소스 회수 이력 상세 아이템 타입
 *
 * 현재 백엔드 API에는 일부 필드만 포함되어 있으나,
 * 추후 추가될 필드들을 위해 UI에서 사용하는 필드들을 확장합니다.
 */
export type RevokeHistoryDetailItemType = WorkloadReclaimScanResultResponse & {
  /** 워크로드 이름 (추후 추가 예정) */
  workloadName?: string;
  /** 구분 (경고/회수) (추후 추가 예정) */
  type?: RevokeHistoryDetailType;
  /** 워크스페이스 이름 (추후 추가 예정) */
  workspaceName?: string;
  /** 잡 타입 (추후 추가 예정) */
  jobType?: string;
  /** GPU 사용률 (추후 추가 예정) */
  gpu?: number;
  /** CPU 사용률 (추후 추가 예정) */
  cpu?: number;
  /** 메모리 사용률 (추후 추가 예정) */
  memory?: number;
  /** 생성자 이름 (추후 추가 예정) */
  creatorName?: string;
};
