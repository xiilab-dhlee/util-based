import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { isNil } from "es-toolkit";

import { resourcePresetKeys } from "@/domain/resource-preset/constants/resource-preset.key";
import type { ResourcePresetDetailResponseType } from "@/domain/resource-preset/schemas/resource-preset.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 리소스 프리셋 상세 조회 훅
 *
 * @param id - 리소스 프리셋 ID
 * @returns React Query 결과
 */
export const useGetResourcePresetDetail = (
  id: string,
): UseQueryResult<ResourcePresetDetailResponseType, Error> => {
  const { resourcePresetService } = useServices();

  return useQuery({
    queryKey: resourcePresetKeys.detail(id),
    queryFn: async () => {
      const response = await resourcePresetService.getDetail(id);
      return response.data;
    },
    enabled: !isNil(id) && id !== "",
  });
};
