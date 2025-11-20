import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/domain/private-registry-image/constants/private-registry-image.key";
import type { PrivateRegistryImageDetailType } from "@/domain/private-registry-image/schemas/private-registry-image.schema";
import { useServices } from "@/shared/providers/service-provider";

/**
 * 내부 레지스트리 이미지 상세 조회
 */
export const useGetPrivateRegistryImage = (
  id: number,
): UseQueryResult<PrivateRegistryImageDetailType, Error> => {
  const { privateRegistryImageService } = useServices();

  return useQuery({
    queryKey: privateRegistryImageKeys.detail(id),
    queryFn: async () => {
      const response = await privateRegistryImageService.getDetail(id);
      return response.data;
    },
    enabled: !!id,
  });
};
