import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { internalregistryImageKeys } from "@/domain/internal-registry-image/constants/internal-registry-image.key";
import type { InternalRegistryImageDetailType } from "@/domain/internal-registry-image/schemas/internal-registry-image.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 내부 레지스트리 이미지 상세 조회
 */
export const useGetInternalRegistryImage = (
  id: number,
): UseQueryResult<InternalRegistryImageDetailType, Error> => {
  const { internalregistryImageService } = useServices();

  return useQuery({
    queryKey: internalregistryImageKeys.detail(id),
    queryFn: async () => {
      const response = await internalregistryImageService.getDetail(id);
      return response.data;
    },
    enabled: !!id,
  });
};
