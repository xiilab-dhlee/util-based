import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resourcePresetKeys } from "@/domain/resource-preset/constants/resource-preset.key";
import type {
  ResourcePresetDetailResponseType,
  ResourcePresetRequestPayload,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 리소스 프리셋 생성 훅
 *
 * @returns React Query Mutation 결과
 */
export const useCreateResourcePreset = (): UseMutationResult<
  ResourcePresetDetailResponseType,
  Error,
  ResourcePresetRequestPayload
> => {
  const { resourcePresetService } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ResourcePresetRequestPayload) => {
      const response = await resourcePresetService.create(payload);
      return response.data;
    },
    onSuccess: () => {
      // 모든 리스트 캐시 무효화 (payload 변형 포함)
      queryClient.invalidateQueries({
        queryKey: [...resourcePresetKeys.all, "list"],
      });
    },
  });
};
