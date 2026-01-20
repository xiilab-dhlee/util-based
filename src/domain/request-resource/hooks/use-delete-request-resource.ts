import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { REQUEST_RESOURCE_QUERY_KEY } from "@/domain/request-resource/constants/request-resource.constant";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 리소스 요청 취소(삭제) mutation hook
 *
 * 리소스 요청을 취소하고 목록을 자동으로 갱신합니다.
 */
export const useDeleteRequestResource = (): UseMutationResult<
  unknown,
  Error,
  number,
  unknown
> => {
  const { workspaceService } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: number) => {
      return workspaceService.deleteRequestResource(resourceId);
    },
    onSuccess: () => {
      // 리소스 요청 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [REQUEST_RESOURCE_QUERY_KEY],
      });
    },
  });
};
