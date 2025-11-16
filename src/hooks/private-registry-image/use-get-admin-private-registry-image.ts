import { type UseQueryResult, useQuery } from "@tanstack/react-query";

import { privateRegistryImageKeys } from "@/constants/private-registry-image/private-registry-image.key";
import { useServices } from "@/providers/service-provider";
import type { PrivateRegistryImageDetailType } from "@/schemas/private-registry-image.schema";
import type { GetAdminPrivateRegistryImagePayload } from "@/types/private-registry-image/private-registry-image.type";

/**
 * 관리자 내부 레지스트리의 이미지 상세 조회
 */
export const useGetAdminPrivateRegistryImage = (
  payload: GetAdminPrivateRegistryImagePayload,
): UseQueryResult<PrivateRegistryImageDetailType, Error> => {
  const { adminPrivateRegistryImageService } = useServices();

  return useQuery({
    queryKey: privateRegistryImageKeys.adminDetail(payload),
    queryFn: async () => {
      const response =
        await adminPrivateRegistryImageService.getDetail(payload);
      return response.data;
    },
    enabled: !!payload.registryName && !!payload.imageId,
  });
};
