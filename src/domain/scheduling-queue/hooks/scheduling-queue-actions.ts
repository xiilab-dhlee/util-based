import { useQueryClient } from "@tanstack/react-query";

import {
  getGetUrgentStandbyWorkloadsQueryKey,
  useAddWorkloadToUrgentStandby,
  useRemoveWorkloadFromUrgentStandby,
  useUpdateUrgentStandbyOrder,
} from "@/api/generated/admin-queue/admin-queue";
import { getGetPendingWorkloadsQueryKey } from "@/api/generated/admin-workload/admin-workload";

/**
 * 긴급 대기열에 워크로드 추가 액션 훅
 *
 * 워크로드 추가 성공 시 긴급 대기열 목록을 자동으로 무효화합니다.
 */
export function useAddWorkloadToUrgentStandbyAction(
  options?: Parameters<typeof useAddWorkloadToUrgentStandby>[0],
) {
  const queryClient = useQueryClient();

  return useAddWorkloadToUrgentStandby({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({
          queryKey: getGetUrgentStandbyWorkloadsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetPendingWorkloadsQueryKey(),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}

/**
 * 긴급 대기열 순서 변경 액션 훅
 *
 * 순서 변경 성공 시 긴급 대기열 목록을 자동으로 무효화합니다.
 */
export function useUpdateUrgentStandbyOrderAction(
  options?: Parameters<typeof useUpdateUrgentStandbyOrder>[0],
) {
  const queryClient = useQueryClient();

  return useUpdateUrgentStandbyOrder({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({
          queryKey: getGetUrgentStandbyWorkloadsQueryKey(),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}

/**
 * 긴급 대기열 워크로드 삭제 액션 훅
 *
 * 삭제 성공 시 긴급 대기열과 Pending 워크로드 목록을 자동으로 무효화합니다.
 */
export function useRemoveWorkloadFromUrgentStandbyAction(
  options?: Parameters<typeof useRemoveWorkloadFromUrgentStandby>[0],
) {
  const queryClient = useQueryClient();

  return useRemoveWorkloadFromUrgentStandby({
    ...options,
    mutation: {
      ...options?.mutation,
      onSuccess: (...args) => {
        queryClient.invalidateQueries({
          queryKey: getGetUrgentStandbyWorkloadsQueryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: getGetPendingWorkloadsQueryKey(),
        });

        options?.mutation?.onSuccess?.(...args);
      },
    },
  });
}
