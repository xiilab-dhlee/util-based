import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resourcePresetKeys } from "@/domain/resource-preset/constants/resource-preset.key";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 리소스 프리셋 삭제 훅
 *
 * @returns React Query Mutation 결과
 */
export const useDeleteResourcePreset = (): UseMutationResult<
  void,
  Error,
  string
> => {
  const { resourcePresetService } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await resourcePresetService.delete(id);
    },
    onSuccess: (_data, variables) => {
      // 모든 리스트 캐시 무효화 (payload 변형 포함)
      queryClient.invalidateQueries({
        queryKey: [...resourcePresetKeys.all, "list"],
      });
      // 삭제된 아이템의 detail 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: resourcePresetKeys.detail(variables),
      });
    },
  });
};
