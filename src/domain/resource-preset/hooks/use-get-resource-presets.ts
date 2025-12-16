import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { resourcePresetKeys } from "@/domain/resource-preset/constants/resource-preset.key";
import type {
  GetResourcePresetsPayload,
  ResourcePresetsListResponse,
} from "@/domain/resource-preset/types/resource-preset.type";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 리소스 프리셋 목록 조회 훅
 *
 * @param payload - 조회 조건 (page, size, search, jobType, nodeType)
 * @returns React Query 결과
 */
export const useGetResourcePresets = (
  payload?: GetResourcePresetsPayload,
): UseQueryResult<ResourcePresetsListResponse, Error> => {
  const { resourcePresetService } = useServices();

  return useQuery({
    queryKey: resourcePresetKeys.list(payload),
    queryFn: async () => {
      const response = await resourcePresetService.getList(payload);
      return response.data;
    },
  });
};
