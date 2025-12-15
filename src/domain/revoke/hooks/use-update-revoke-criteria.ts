import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { revokeHistoryKeys } from "@/domain/revoke/constants/revoke-history.key";
import type { RevokeCriteriaRequestPayload } from "@/domain/revoke/schemas/revoke-history.schema";
import { useServices } from "@/shared/providers/service-provider";

export type RevokeCriteriaBulkPayload = RevokeCriteriaRequestPayload[];

/**
 * 리소스 회수 기준 수정 훅
 * - BATCH와 INTERACTIVE를 배열로 받아서 한 번의 API 호출로 업데이트
 * @returns 리소스 회수 기준 수정 mutation
 */
export const useUpdateRevokeCriteria = (): UseMutationResult<
  void,
  Error,
  RevokeCriteriaBulkPayload
> => {
  const { revokeHistoryService } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: revokeHistoryKeys.updateCriteria(),
    mutationFn: async (payload: RevokeCriteriaBulkPayload) => {
      const response = await revokeHistoryService.updateCriteria(payload);
      return response.data;
    },
    onSuccess: () => {
      // 리소스 회수 기준 캐시 무효화하여 최신 데이터 refetch
      queryClient.invalidateQueries({
        queryKey: revokeHistoryKeys.criteria(),
      });
    },
  });
};
