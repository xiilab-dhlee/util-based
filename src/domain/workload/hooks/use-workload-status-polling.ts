"use client";

import type { UseQueryResult } from "@tanstack/react-query";

import { WorkloadStatusResponseWorkloadStatus } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import {
  type GetWorkloadStatusQueryResult,
  useGetWorkloadStatus,
} from "@/api/generated/workload/workload";

/**
 * 워크로드 상태 폴링 간격 (밀리초)
 * 10초마다 상태를 조회합니다.
 */
const POLLING_INTERVAL = 10000;

/**
 * 워크로드 상태에 따라 폴링 여부를 결정하는 함수
 * @param status - 워크로드 상태
 * @returns TERMINATED가 아닌 경우 true, 그 외 false
 */
const shouldPollStatus = (
  status: WorkloadStatusResponseWorkloadStatus | undefined,
): boolean => {
  if (!status) return false;
  // TERMINATED 상태가 아닌 모든 상태에서 폴링
  return status !== WorkloadStatusResponseWorkloadStatus.TERMINATED;
};

export interface UseWorkloadStatusPollingParams {
  /** 워크스페이스 ID */
  workspaceId: number;
  /** 워크로드 리소스 이름 */
  workloadResourceName: string;
  /** 훅 활성화 여부 (기본값: true) */
  enabled?: boolean;
}

export interface UseWorkloadStatusPollingReturn {
  /** 현재 워크로드 상태 */
  status: WorkloadStatusResponseWorkloadStatus | undefined;
  /** React Query 결과 객체 */
  query: UseQueryResult<GetWorkloadStatusQueryResult, unknown>;
}

export function useWorkloadStatusPolling({
  workspaceId,
  workloadResourceName,
  enabled = true,
}: UseWorkloadStatusPollingParams): UseWorkloadStatusPollingReturn {
  // 워크로드 상태 조회 (status-only API)
  const query = useGetWorkloadStatus(workspaceId, workloadResourceName, {
    query: {
      // 파라미터가 유효하고 enabled가 true일 때만 쿼리 실행
      enabled: enabled && Boolean(workspaceId && workloadResourceName),

      // 조건부 폴링: 현재 상태가 TERMINATED가 아닐 때만 폴링
      refetchInterval: (query) => {
        const currentStatus = query.state.data?.workloadStatus;
        return shouldPollStatus(currentStatus) ? POLLING_INTERVAL : false;
      },

      // 백그라운드에서는 폴링 중지
      refetchIntervalInBackground: false,

      // 데이터가 오래되었다고 판단하는 시간 (폴링 간격과 동일하게 설정)
      staleTime: POLLING_INTERVAL,
    },
  });

  // 현재 상태 추출
  const status = query.data?.workloadStatus;

  return {
    status,
    query,
  };
}
