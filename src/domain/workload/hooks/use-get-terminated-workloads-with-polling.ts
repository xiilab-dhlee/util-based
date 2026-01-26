"use client";

import type { GetTerminatedWorkloadsParams } from "@/api/generated/astragoBackendAPIDocumentation.schemas";
import { useGetTerminatedWorkloads } from "@/api/generated/workload/workload";
import { WORKLOAD_LIST_POLLING_INTERVAL } from "@/domain/workload/constants/workload.constant";

export interface UseGetTerminatedWorkloadsWithPollingParams {
  /** 워크스페이스 ID */
  workspaceId: number;
  /** API 요청 파라미터 (필터, 정렬, 페이지네이션 등) */
  params?: GetTerminatedWorkloadsParams;
  /** 쿼리 활성화 여부 (기본값: true) */
  enabled?: boolean;
}

export function useGetTerminatedWorkloadsWithPolling({
  workspaceId,
  params,
  enabled = true,
}: UseGetTerminatedWorkloadsWithPollingParams) {
  return useGetTerminatedWorkloads(workspaceId, params, {
    query: {
      // workspaceId가 존재하고 enabled가 true일 때만 쿼리 실행
      enabled: enabled && Boolean(workspaceId),
      // 30초마다 자동 갱신
      refetchInterval: WORKLOAD_LIST_POLLING_INTERVAL,
      // 탭이 백그라운드일 때는 폴링 중지 (리소스 절약)
      refetchIntervalInBackground: false,
      // 폴링 주기와 동일하게 설정하여 불필요한 재요청 방지
      staleTime: WORKLOAD_LIST_POLLING_INTERVAL,
    },
  });
}
