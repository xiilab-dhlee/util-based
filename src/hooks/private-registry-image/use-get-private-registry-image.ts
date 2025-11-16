import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/constants/private-registry-image/private-registry-image.key";
import { useServices } from "@/providers/service-provider";
import type { PrivateRegistryImageDetailType } from "@/schemas/private-registry-image.schema";

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
