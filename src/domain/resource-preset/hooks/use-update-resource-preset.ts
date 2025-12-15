import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { resourcePresetKeys } from "@/domain/resource-preset/constants/resource-preset.key";
import type {
  ResourcePresetDetailResponseType,
  ResourcePresetRequestPayload,
} from "@/domain/resource-preset/schemas/resource-preset.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 리소스 프리셋 수정 훅
 *
 * @returns React Query Mutation 결과
 */
export const useUpdateResourcePreset = (): UseMutationResult<
  ResourcePresetDetailResponseType,
  Error,
  { id: string; payload: ResourcePresetRequestPayload }
> => {
  const { resourcePresetService } = useServices();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ResourcePresetRequestPayload;
    }) => {
      const response = await resourcePresetService.update(id, payload);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      // 모든 리스트 캐시 무효화 (payload 변형 포함)
      queryClient.invalidateQueries({
        queryKey: [...resourcePresetKeys.all, "list"],
      });
      // 상세 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: resourcePresetKeys.detail(id),
      });
    },
  });
};
