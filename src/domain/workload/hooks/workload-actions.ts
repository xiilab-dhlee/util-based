import { useQueryClient } from "@tanstack/react-query";

import {
  getGetActiveWorkloadsQueryKey,
  useCreateWorkload,
} from "@/api/generated/workload/workload";

/**
 * 워크로드 생성 액션 훅
 * - 생성 성공 시 활성화 워크로드 목록 무효화
 * - 성공 토스트 메시지 표시
 */
export function useCreateWorkloadAction(
  options?: Parameters<typeof useCreateWorkload>[0],
) {
  const queryClient = useQueryClient();

  return useCreateWorkload(
    {
      ...options,
      mutation: {
        ...options?.mutation,
        onSuccess: (data, variables, ...rest) => {
          queryClient.invalidateQueries({
            queryKey: getGetActiveWorkloadsQueryKey(variables.workspaceId),
          });
          options?.mutation?.onSuccess?.(data, variables, ...rest);
        },
      },
    },
    queryClient,
  );
}
